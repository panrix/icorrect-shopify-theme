#!/usr/bin/env python3
"""Website-facing contract wrapper for the courier decision prototype.

The decision engine owns courier and profitability logic. This module owns the
stable payload shape the quote wizard can safely consume later.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from decimal import Decimal
from pathlib import Path
from typing import Any

from courier_decision_engine import (
    DEFAULT_DECISION_SUMMARY,
    DEFAULT_FIXTURES,
    DEFAULT_MATRIX,
    DecisionEngine,
    LONDON_TZ,
    normalise_now,
    normalise_postcode,
)


SCHEMA_VERSION = "courier_decision.v1"
DEFAULT_TARGET_CONTRIBUTION = Decimal("40.00")

CART_PROPERTY_KEYS = (
    "_courier_schema_version",
    "_courier_quote_id",
    "_courier_option_id",
    "_courier_postcode",
    "_courier_outward_code",
    "_courier_service_level",
    "_courier_customer_charge_gross",
    "_estimated_collection_window",
    "_estimated_return_window",
    "_same_day_slot_date",
    "_repair_flow_type",
)

DENIED_CONTRACT_TOKENS = (
    "gophr",
    "subsidy",
    "margin",
    "net_contribution",
    "one_way_cost",
    "two_way_cost",
    "api_key",
    "raw_response",
)

CHECKOUT_BLOCKING_STATUSES = {
    "invalid_postcode",
    "full_postcode_required",
    "invalid_repair_type",
}


def build_contract(
    postcode: str,
    repair_type: str,
    stock: str,
    now: dt.datetime,
    same_day_slots: int,
    action: str = "quote",
    target_contribution: Decimal = DEFAULT_TARGET_CONTRIBUTION,
    engine: DecisionEngine | None = None,
) -> dict[str, Any]:
    engine = engine or DecisionEngine()
    now = normalise_now(now)
    engine_result = engine.decide(
        postcode=postcode,
        repair_type=repair_type,
        stock=stock,
        now=now,
        same_day_slots=same_day_slots,
        action=action,
        target_contribution=target_contribution,
        debug=False,
    )
    postcode_result = normalise_postcode(postcode)
    repair = engine.repair_fixtures.get(repair_type)
    status = engine_result["status"]
    outward_code = engine_result.get("outward_code") or postcode_result.get("outward_code") or ""
    quote_id = engine_result["quote_id"]
    normalised_postcode = postcode_result.get("normalised_postcode") or postcode.strip().upper()
    coverage = coverage_state(status, engine_result.get("postcode_band"))
    errors = list(engine_result.get("errors") or [])

    turnaround_message = engine_result.get("turnaround_message")
    if turnaround_message is None and repair:
        turnaround_message = repair.get("turnaround")

    contract: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "quote_id": quote_id,
        "status": status,
        "postcode": {
            "input": postcode,
            "normalised": normalised_postcode,
            "outward_code": outward_code,
            "band": engine_result.get("postcode_band"),
            "coverage": coverage,
        },
        "repair": {
            "repair_type": repair_type,
            "flow_type": repair["flow_type"] if repair else None,
            "same_day_eligible": bool(repair["same_day_eligible"]) if repair else False,
        },
        "same_day_slots_remaining": max(same_day_slots, 0),
        "turnaround_message": turnaround_message,
        "reservation": normalise_reservation(engine_result.get("reservation") or {}, engine),
        "options": [],
        "errors": errors,
    }

    if status in CHECKOUT_BLOCKING_STATUSES:
        return contract

    options = engine_result.get("options") or []
    contract["options"] = [
        option_contract(
            quote_id=quote_id,
            option=option,
            index=index,
            postcode=normalised_postcode,
            outward_code=outward_code,
            repair_flow_type=contract["repair"]["flow_type"] or "unknown",
            now=now,
        )
        for index, option in enumerate(options, start=1)
        if option.get("shopify_variant_id")
    ]
    return contract


def coverage_state(status: str, postcode_band: str | None) -> str:
    if status in {"invalid_postcode", "full_postcode_required"}:
        return "validation_required"
    if postcode_band == "out_of_matrix" or status == "manual_fallback":
        return "manual_fallback"
    if status == "ok":
        return "london_courier"
    return "unavailable"


def normalise_reservation(reservation: dict[str, Any], engine: DecisionEngine) -> dict[str, Any]:
    result = {
        "action": reservation.get("action", "quote"),
        "slot_consumed_on_view": bool(reservation.get("slot_consumed_on_view", False)),
        "slot_reserved": bool(reservation.get("slot_reserved", False)),
        "ttl_minutes": engine.quote_ttl_minutes,
    }
    if reservation.get("expires_at"):
        result["expires_at"] = reservation["expires_at"]
    return result


def option_contract(
    quote_id: str,
    option: dict[str, Any],
    index: int,
    postcode: str,
    outward_code: str,
    repair_flow_type: str,
    now: dt.datetime,
) -> dict[str, Any]:
    customer_price = option.get("customer_price_gross")
    service_level = option["service_level"]
    option_id = build_option_id(quote_id, service_level, customer_price, index)
    same_day_slot_date = now.date().isoformat() if option.get("same_day_return") else ""
    shaped = {
        "option_id": option_id,
        "service_level": service_level,
        "label": option["label"],
        "customer_price_gross": customer_price,
        "currency": "GBP",
        "estimated_collection_window": option.get("estimated_collection_window"),
        "estimated_return_window": option.get("estimated_return_window"),
        "same_day_return": bool(option.get("same_day_return")),
        "shopify_variant_id": option["shopify_variant_id"],
        "cart_properties": cart_properties(
            quote_id=quote_id,
            option_id=option_id,
            postcode=postcode,
            outward_code=outward_code,
            service_level=service_level,
            customer_price=customer_price,
            collection_window=option.get("estimated_collection_window"),
            return_window=option.get("estimated_return_window"),
            same_day_slot_date=same_day_slot_date,
            repair_flow_type=repair_flow_type,
        ),
    }
    if option.get("customer_message"):
        shaped["customer_message"] = option["customer_message"]
    return shaped


def build_option_id(
    quote_id: str,
    service_level: str,
    customer_price: str | None,
    index: int,
) -> str:
    price_slug = re.sub(r"[^0-9a-z]+", "-", str(customer_price or "manual").lower()).strip("-")
    return f"{quote_id}:{index}:{service_level}:{price_slug}"


def cart_properties(
    quote_id: str,
    option_id: str,
    postcode: str,
    outward_code: str,
    service_level: str,
    customer_price: str | None,
    collection_window: str | None,
    return_window: str | None,
    same_day_slot_date: str,
    repair_flow_type: str,
) -> dict[str, str]:
    return {
        "_courier_schema_version": SCHEMA_VERSION,
        "_courier_quote_id": quote_id,
        "_courier_option_id": option_id,
        "_courier_postcode": postcode,
        "_courier_outward_code": outward_code,
        "_courier_service_level": service_level,
        "_courier_customer_charge_gross": customer_price or "",
        "_estimated_collection_window": collection_window or "",
        "_estimated_return_window": return_window or "",
        "_same_day_slot_date": same_day_slot_date,
        "_repair_flow_type": repair_flow_type,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Emit the website-facing courier decision contract.")
    parser.add_argument("--postcode", required=True)
    parser.add_argument("--repair-type", required=True)
    parser.add_argument("--stock", choices=["available", "unavailable", "unknown"], default="unknown")
    parser.add_argument("--now", required=True, help="ISO datetime; evaluated in Europe/London")
    parser.add_argument("--same-day-slots", type=int, default=3)
    parser.add_argument("--action", choices=["quote", "reserve"], default="quote")
    parser.add_argument("--target-contribution", default=str(DEFAULT_TARGET_CONTRIBUTION))
    parser.add_argument("--matrix", type=Path, default=DEFAULT_MATRIX)
    parser.add_argument("--decision-summary", type=Path, default=DEFAULT_DECISION_SUMMARY)
    parser.add_argument("--fixtures", type=Path, default=DEFAULT_FIXTURES)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    engine = DecisionEngine(args.matrix, args.decision_summary, args.fixtures)
    result = build_contract(
        postcode=args.postcode,
        repair_type=args.repair_type,
        stock=args.stock,
        now=dt.datetime.fromisoformat(args.now).astimezone(LONDON_TZ),
        same_day_slots=args.same_day_slots,
        action=args.action,
        target_contribution=Decimal(args.target_contribution),
        engine=engine,
    )
    json.dump(result, sys.stdout, indent=2, sort_keys=True)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
