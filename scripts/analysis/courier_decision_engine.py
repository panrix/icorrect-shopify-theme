#!/usr/bin/env python3
"""Prototype London courier decision engine for iCorrect.

This is a local CLI prototype. It does not call Gophr, Shopify, or the theme.
It reads the committed quote matrix and returns customer-safe JSON that can be
used as the contract for a later HTTP decision app.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import hashlib
import json
import re
import sys
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MATRIX = REPO_ROOT / "data/gophr-london-coverage-matrix-2026-05-05.csv"
DEFAULT_DECISION_SUMMARY = REPO_ROOT / "data/gophr-london-coverage-decision-summary-2026-05-05.csv"
DEFAULT_FIXTURES = REPO_ROOT / "data/courier-decision-engine-fixtures-2026-05-06.json"
LONDON_TZ = ZoneInfo("Europe/London")
TARGET_CONTRIBUTION = Decimal("40.00")
SAME_DAY_CUTOFF = dt.time(12, 0)
FULL_POSTCODE_RE = re.compile(r"^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$")
OUTWARD_ONLY_RE = re.compile(r"^[A-Z]{1,2}\d[A-Z\d]?$")

DIAGNOSTIC_COPY = (
    "We will collect your device for assessment. Once our technicians have completed "
    "a full diagnostic, we will confirm the repair options, cost, and expected "
    "turnaround before any repair work goes ahead."
)

TWO_WORKING_DAY_COPY = "Estimated two working days after the device arrives at iCorrect."
MANUAL_COPY = "Courier is not available for this quote yet. Please use mail-in, drop-off, or request a manual courier quote."
STOCK_CHECK_COPY = "We can collect today and confirm the repair timing after checking part availability."

DENIED_OUTPUT_FIELDS = {
    "_courier_icorrect_two_way_cost_gross",
    "_courier_subsidy_gross",
    "_courier_margin_band",
    "net_contribution_after_logistics",
    "gophr_api_key",
    "gophr_raw_response",
}

SERVICE_LEVELS = {
    "standard": {
        "prefix": "three_hour",
        "label": "Standard courier",
        "charges": [Decimal("9.99"), Decimal("14.99"), Decimal("19.99")],
    },
    "priority": {
        "prefix": "two_hour",
        "label": "Priority courier",
        "charges": [Decimal("24.99"), Decimal("34.99")],
    },
    "urgent": {
        "prefix": "one_hour",
        "label": "Urgent courier",
        "charges": [Decimal("39.99"), Decimal("49.99")],
    },
}


@dataclass(frozen=True)
class QuoteRow:
    outward_code: str
    service_window: str
    requested_vehicle: str
    price_gross: Decimal
    quote_status: str


@dataclass(frozen=True)
class ServiceCost:
    service_level: str
    service_window: str
    price_gross_one_way: Decimal
    price_gross_two_way: Decimal
    requested_vehicle: str
    collection_window: str


class DecisionEngine:
    def __init__(
        self,
        matrix_path: Path = DEFAULT_MATRIX,
        summary_path: Path = DEFAULT_DECISION_SUMMARY,
        fixtures_path: Path = DEFAULT_FIXTURES,
    ):
        self.matrix_rows = load_matrix(matrix_path)
        self.summary = load_decision_summary(summary_path)
        self.fixtures = load_fixtures(fixtures_path)
        self.repair_fixtures = self.fixtures["repair_fixtures"]
        self.variant_placeholders = self.fixtures["shopify_variant_placeholders"]
        self.default_target_contribution = self.fixtures["target_contribution"]
        self.quote_ttl_minutes = self.fixtures["quote_ttl_minutes"]

    def decide(
        self,
        postcode: str,
        repair_type: str,
        stock: str,
        now: dt.datetime,
        same_day_slots: int,
        action: str = "quote",
        target_contribution: Decimal = TARGET_CONTRIBUTION,
        debug: bool = False,
    ) -> dict[str, Any]:
        now = normalise_now(now)
        postcode_result = normalise_postcode(postcode)
        quote_id = build_quote_id(postcode, repair_type, now)

        base: dict[str, Any] = {
            "quote_id": quote_id,
            "status": "ok",
            "postcode_input": postcode,
            "outward_code": postcode_result.get("outward_code"),
            "postcode_band": None,
            "same_day_slots_remaining": max(same_day_slots, 0),
            "quote_ttl_minutes": self.quote_ttl_minutes,
            "reservation": {
                "action": action,
                "slot_consumed_on_view": False,
                "slot_reserved": False,
            },
            "options": [],
        }

        if postcode_result["status"] != "ok":
            base["status"] = postcode_result["status"]
            base["errors"] = [postcode_result["message"]]
            base["options"] = [manual_option(postcode_result["message"], self.variant_placeholders)]
            return base

        outward = postcode_result["outward_code"]
        summary_row = self.summary.get(outward)
        if not summary_row:
            base["status"] = "manual_fallback"
            base["postcode_band"] = "out_of_matrix"
            base["options"] = [manual_option(MANUAL_COPY, self.variant_placeholders)]
            return base

        repair = self.repair_fixtures.get(repair_type)
        if not repair:
            base["status"] = "invalid_repair_type"
            base["errors"] = [f"Unknown repair type: {repair_type}"]
            base["options"] = [manual_option("Please choose a valid repair type.", self.variant_placeholders)]
            return base
        base["postcode_band"] = summary_row["recommended_band"]
        base["_repair_flow_type"] = repair["flow_type"]

        if repair["flow_type"] == "diagnostic":
            base["options"] = [diagnostic_option(self.variant_placeholders, repair.get("turnaround") or DIAGNOSTIC_COPY)]
            return strip_private_response(base)

        service_costs = best_service_costs(self.matrix_rows, outward, now)
        same_day_possible = is_same_day_possible(
            repair=repair,
            stock=stock,
            now=now,
            same_day_slots=same_day_slots,
            postcode_band=summary_row["recommended_band"],
        )

        debug_rows: list[dict[str, Any]] = []
        options: list[dict[str, Any]] = []
        for service_level in ("standard", "priority", "urgent"):
            cost = service_costs.get(service_level)
            if not cost:
                continue
            option, debug_row = build_service_option(
                service_level=service_level,
                cost=cost,
                repair=repair,
                postcode_band=summary_row["recommended_band"],
                same_day_possible=same_day_possible,
                target_contribution=target_contribution,
                variant_placeholders=self.variant_placeholders,
            )
            debug_rows.append(debug_row)
            if option:
                options.append(option)

        if not options:
            base["status"] = "manual_fallback"
            base["options"] = [manual_option(MANUAL_COPY, self.variant_placeholders)]
        else:
            base["options"] = options

        if action == "reserve" and same_day_possible and any(option.get("same_day_return") for option in options):
            base["reservation"]["slot_reserved"] = True
            base["reservation"]["expires_at"] = (now + dt.timedelta(minutes=self.quote_ttl_minutes)).isoformat()

        if repair.get("turnaround"):
            base["turnaround_message"] = repair["turnaround"]
        elif stock == "unknown" and repair["same_day_eligible"]:
            base["turnaround_message"] = STOCK_CHECK_COPY

        public_response = strip_private_response(base)
        if debug:
            public_response["debug"] = {
                "target_contribution": money(target_contribution),
                "stock": stock,
                "same_day_possible": same_day_possible,
                "calculations": debug_rows,
            }
        return public_response


def load_matrix(path: Path) -> list[QuoteRow]:
    rows: list[QuoteRow] = []
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row["quote_status"] != "ok":
                continue
            rows.append(
                QuoteRow(
                    outward_code=row["outward_code"].strip().upper(),
                    service_window=row["service_window"].strip(),
                    requested_vehicle=row["requested_vehicle"].strip(),
                    price_gross=parse_money(row["price_gross"]),
                    quote_status=row["quote_status"],
                )
            )
    return rows


def load_decision_summary(path: Path) -> dict[str, dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return {row["outward_code"].strip().upper(): row for row in reader}


def load_fixtures(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as handle:
        raw = json.load(handle)
    repair_fixtures: dict[str, dict[str, Any]] = {}
    for key, fixture in raw["repair_fixtures"].items():
        repair_fixtures[key] = {
            **fixture,
            "repair_price_net": Decimal(fixture["repair_price_net"]),
            "parts": Decimal(fixture["parts"]),
            "labour": Decimal(fixture["labour"]),
            "platform": Decimal(fixture["platform"]),
        }
    variants: dict[tuple[str, Decimal], str] = {}
    for key, value in raw["shopify_variant_placeholders"].items():
        service_level, charge = key.split(":", 1)
        variants[(service_level, Decimal(charge))] = value
    return {
        "target_contribution": Decimal(raw["target_contribution"]),
        "quote_ttl_minutes": int(raw["quote_ttl_minutes"]),
        "same_day_slots": raw["same_day_slots"],
        "postcode_fixtures": raw["postcode_fixtures"],
        "repair_fixtures": repair_fixtures,
        "shopify_variant_placeholders": variants,
    }


def parse_money(value: str) -> Decimal:
    amount = value.replace("GBP", "").strip()
    return Decimal(amount).quantize(Decimal("0.01"))


def money(value: Decimal | None) -> str | None:
    if value is None:
        return None
    return f"{value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)}"


def normalise_postcode(postcode: str) -> dict[str, str]:
    compact = re.sub(r"\s+", "", postcode.strip().upper())
    full_match = FULL_POSTCODE_RE.match(compact)
    if full_match:
        return {
            "status": "ok",
            "outward_code": full_match.group(1),
            "normalised_postcode": f"{full_match.group(1)} {full_match.group(2)}",
        }
    if OUTWARD_ONLY_RE.match(compact):
        return {
            "status": "full_postcode_required",
            "outward_code": compact,
            "message": "Please enter a full postcode before courier options are shown.",
        }
    return {
        "status": "invalid_postcode",
        "outward_code": "",
        "message": "Please enter a valid UK postcode.",
    }


def normalise_now(now: dt.datetime) -> dt.datetime:
    if now.tzinfo is None:
        return now.replace(tzinfo=LONDON_TZ)
    return now.astimezone(LONDON_TZ)


def build_quote_id(postcode: str, repair_type: str, now: dt.datetime) -> str:
    source = f"{postcode}|{repair_type}|{now.isoformat()}".encode("utf-8")
    digest = hashlib.sha1(source).hexdigest()[:12]
    return f"courier_quote_{now.strftime('%Y%m%d')}_{digest}"


def best_service_costs(rows: list[QuoteRow], outward: str, now: dt.datetime) -> dict[str, ServiceCost]:
    results: dict[str, ServiceCost] = {}
    for service_level, config in SERVICE_LEVELS.items():
        prefix = config["prefix"]
        candidates = [
            row
            for row in rows
            if row.outward_code == outward and row.service_window.startswith(prefix)
        ]
        if not candidates:
            continue
        selected_window = choose_service_window(candidates, now)
        window_rows = [row for row in candidates if row.service_window == selected_window]
        best = min(window_rows, key=lambda row: row.price_gross)
        results[service_level] = ServiceCost(
            service_level=service_level,
            service_window=best.service_window,
            price_gross_one_way=best.price_gross,
            price_gross_two_way=(best.price_gross * Decimal("2")).quantize(Decimal("0.01")),
            requested_vehicle=best.requested_vehicle,
            collection_window=window_label(best.service_window),
        )
    return results


def choose_service_window(rows: list[QuoteRow], now: dt.datetime) -> str:
    windows = sorted({row.service_window for row in rows}, key=window_start_hour)
    for service_window in windows:
        if window_start_hour(service_window) > now.hour or (
            window_start_hour(service_window) == now.hour and now.minute == 0
        ):
            return service_window
    return windows[-1]


def window_start_hour(service_window: str) -> int:
    parts = service_window.split("_")
    return int(parts[-2])


def window_end_hour(service_window: str) -> int:
    parts = service_window.split("_")
    return int(parts[-1])


def window_label(service_window: str) -> str:
    return f"{window_start_hour(service_window):02d}:00-{window_end_hour(service_window):02d}:00"


def is_same_day_possible(
    repair: dict[str, Any],
    stock: str,
    now: dt.datetime,
    same_day_slots: int,
    postcode_band: str,
) -> bool:
    return (
        bool(repair["same_day_eligible"])
        and stock == "available"
        and now.time() < SAME_DAY_CUTOFF
        and same_day_slots > 0
        and postcode_band != "outer_manual_or_motorbike_only"
    )


def build_service_option(
    service_level: str,
    cost: ServiceCost,
    repair: dict[str, Any],
    postcode_band: str,
    same_day_possible: bool,
    target_contribution: Decimal,
    variant_placeholders: dict[tuple[str, Decimal], str],
) -> tuple[dict[str, Any] | None, dict[str, Any]]:
    charges = list(SERVICE_LEVELS[service_level]["charges"])
    if service_level == "standard" and postcode_band == "standard_free_candidate_priority_available":
        charges = [Decimal("0.00")] + charges

    debug_row = {
        "service_level": service_level,
        "one_way_cost_gross": money(cost.price_gross_one_way),
        "two_way_cost_gross": money(cost.price_gross_two_way),
        "attempts": [],
    }

    for charge in charges:
        contribution = contribution_after_logistics(repair, cost.price_gross_two_way, charge)
        debug_row["attempts"].append(
            {
                "customer_charge_gross": money(charge),
                "contribution_after_logistics": money(contribution),
                "passes": contribution >= target_contribution,
            }
        )
        if contribution >= target_contribution:
            label = option_label(service_level, charge)
            return (
                {
                    "service_level": service_level,
                    "label": label,
                    "customer_price_gross": money(charge),
                    "estimated_collection_window": cost.collection_window,
                    "estimated_return_window": "Today, 17:00-19:00" if same_day_possible else "Earliest return tomorrow",
                    "same_day_return": bool(same_day_possible),
                    "shopify_variant_id": variant_placeholders[(service_level, charge)],
                    "_repair_flow_type": repair["flow_type"],
                },
                debug_row,
            )
    return None, debug_row


def contribution_after_logistics(
    repair: dict[str, Any],
    two_way_courier_cost: Decimal,
    customer_charge: Decimal,
) -> Decimal:
    return (
        repair["repair_price_net"]
        - repair["parts"]
        - repair["labour"]
        - repair["platform"]
        - two_way_courier_cost
        + customer_charge
    ).quantize(Decimal("0.01"))


def option_label(service_level: str, charge: Decimal) -> str:
    if service_level == "standard" and charge == Decimal("0.00"):
        return "Free standard courier"
    if service_level == "standard":
        return "Standard courier"
    if service_level == "priority":
        return "Priority courier"
    return "Urgent courier"


def diagnostic_option(variant_placeholders: dict[tuple[str, Decimal], str], message: str) -> dict[str, Any]:
    return {
        "service_level": "manual",
        "label": "Diagnostic assessment",
        "customer_price_gross": None,
        "estimated_collection_window": None,
        "estimated_return_window": None,
        "same_day_return": False,
        "shopify_variant_id": variant_placeholders[("manual", Decimal("0.00"))],
        "customer_message": message,
        "_repair_flow_type": "diagnostic",
    }


def manual_option(message: str, variant_placeholders: dict[tuple[str, Decimal], str]) -> dict[str, Any]:
    return {
        "service_level": "manual",
        "label": "Manual courier quote",
        "customer_price_gross": None,
        "estimated_collection_window": None,
        "estimated_return_window": None,
        "same_day_return": False,
        "shopify_variant_id": variant_placeholders[("manual", Decimal("0.00"))],
        "customer_message": message,
    }


def strip_private_response(value: Any) -> Any:
    if isinstance(value, dict):
        clean: dict[str, Any] = {}
        for key, child in value.items():
            if key in DENIED_OUTPUT_FIELDS:
                continue
            clean[key] = strip_private_response(child)
        return clean
    if isinstance(value, list):
        return [strip_private_response(item) for item in value]
    return value


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the local courier decision prototype.")
    parser.add_argument("--postcode", required=True)
    parser.add_argument("--repair-type", required=True)
    parser.add_argument("--stock", choices=["available", "unavailable", "unknown"], default="unknown")
    parser.add_argument("--now", required=True, help="ISO datetime; evaluated in Europe/London")
    parser.add_argument("--same-day-slots", type=int, default=3)
    parser.add_argument("--action", choices=["quote", "reserve"], default="quote")
    parser.add_argument("--target-contribution")
    parser.add_argument("--matrix", type=Path, default=DEFAULT_MATRIX)
    parser.add_argument("--decision-summary", type=Path, default=DEFAULT_DECISION_SUMMARY)
    parser.add_argument("--fixtures", type=Path, default=DEFAULT_FIXTURES)
    parser.add_argument("--debug", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    now = dt.datetime.fromisoformat(args.now)
    engine = DecisionEngine(args.matrix, args.decision_summary, args.fixtures)
    target_contribution = (
        Decimal(args.target_contribution)
        if args.target_contribution
        else engine.default_target_contribution
    )
    result = engine.decide(
        postcode=args.postcode,
        repair_type=args.repair_type,
        stock=args.stock,
        now=now,
        same_day_slots=args.same_day_slots,
        action=args.action,
        target_contribution=target_contribution,
        debug=args.debug,
    )
    json.dump(result, sys.stdout, indent=2, sort_keys=True)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
