#!/usr/bin/env python3
"""Run a controlled London Gophr quote matrix pilot for iCorrect.

The script reads GOPHR_API_KEY from the environment, or from a local env file
when explicitly configured, and never prints it. It writes CSV and Markdown
outputs for representative public London destinations, two vehicle classes,
and a small set of service windows.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_BASE_URL = "https://api.gophr.com/v2-commercial-api"
DEFAULT_DOC_OUT = Path("docs/gophr-london-quote-matrix-pilot-2026-05-05.md")
DEFAULT_CSV_OUT = Path("data/gophr-london-quote-matrix-pilot-2026-05-05.csv")
DEFAULT_ENV_FILE = Path("/Users/ricky/vps/config/api-keys/.env")
LONDON_TZ = dt.timezone(dt.timedelta(hours=1))
PROBE_MOBILE = os.environ.get("GOPHR_PROBE_MOBILE", "07123456789")

ORIGIN = {
    "label": "iCorrect",
    "address1": "12 Margaret Street",
    "city": "London",
    "postcode": "W1W 8JQ",
    "country_code": "GB",
    "person_name": "iCorrect",
    "mobile_number": PROBE_MOBILE,
}

PILOT_DESTINATIONS = [
    {
        "outward_code": "W1T",
        "label": "The Fitzroy Tavern",
        "address1": "16 Charlotte Street",
        "city": "London",
        "postcode": "W1T 2LY",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "https://fitzroytavern.co.uk/contact/",
    },
    {
        "outward_code": "W1W",
        "label": "The Yorkshire Grey",
        "address1": "46 Langham Street",
        "city": "London",
        "postcode": "W1W 7AX",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public commercial address",
    },
    {
        "outward_code": "SW1",
        "label": "Buckingham Palace",
        "address1": "Buckingham Palace",
        "city": "London",
        "postcode": "SW1A 1AA",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public landmark address",
    },
    {
        "outward_code": "SW18",
        "label": "Southside Shopping Centre",
        "address1": "Wandsworth High Street",
        "city": "London",
        "postcode": "SW18 4TF",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "https://www.southsidewandsworth.com/en",
    },
    {
        "outward_code": "SW11",
        "label": "Battersea Power Station",
        "address1": "1 Electric Boulevard",
        "city": "London",
        "postcode": "SW11 8BJ",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "https://batterseapowerstation.co.uk/contact-us/",
    },
    {
        "outward_code": "EC1",
        "label": "Sadler's Wells Theatre",
        "address1": "Rosebery Avenue",
        "city": "London",
        "postcode": "EC1R 4TN",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
    {
        "outward_code": "E1",
        "label": "Whitechapel Gallery",
        "address1": "77-82 Whitechapel High Street",
        "city": "London",
        "postcode": "E1 7QX",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
    {
        "outward_code": "N1",
        "label": "Business Design Centre",
        "address1": "52 Upper Street",
        "city": "London",
        "postcode": "N1 0QH",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
    {
        "outward_code": "NW1",
        "label": "The British Library",
        "address1": "96 Euston Road",
        "city": "London",
        "postcode": "NW1 2DB",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public landmark address",
    },
    {
        "outward_code": "SE1",
        "label": "National Theatre",
        "address1": "Upper Ground",
        "city": "London",
        "postcode": "SE1 9PX",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
    {
        "outward_code": "E14",
        "label": "One Canada Square",
        "address1": "One Canada Square",
        "city": "London",
        "postcode": "E14 5AB",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public landmark address",
    },
    {
        "outward_code": "W8",
        "label": "Design Museum",
        "address1": "224-238 Kensington High Street",
        "city": "London",
        "postcode": "W8 6AG",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
    {
        "outward_code": "WC2",
        "label": "Royal Opera House",
        "address1": "Bow Street",
        "city": "London",
        "postcode": "WC2E 9DD",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
    {
        "outward_code": "N16",
        "label": "Stoke Newington Town Hall",
        "address1": "71 Stoke Newington Church Street",
        "city": "London",
        "postcode": "N16 0JR",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public civic venue address",
    },
    {
        "outward_code": "W5",
        "label": "Ealing Broadway Shopping Centre",
        "address1": "The Broadway",
        "city": "London",
        "postcode": "W5 5JY",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "https://www.ealing.com/ealing-broadway/",
    },
]

CENTRAL_SHORT_DESTINATIONS = [
    {
        "outward_code": "W1",
        "label": "Apple Regent Street",
        "address1": "235 Regent Street",
        "city": "London",
        "postcode": "W1B 2EL",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public commercial address",
    },
    {
        "outward_code": "SW1",
        "label": "Buckingham Palace",
        "address1": "Buckingham Palace",
        "city": "London",
        "postcode": "SW1A 1AA",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public landmark address",
    },
    {
        "outward_code": "NW1",
        "label": "The British Library",
        "address1": "96 Euston Road",
        "city": "London",
        "postcode": "NW1 2DB",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public landmark address",
    },
    {
        "outward_code": "E1",
        "label": "Whitechapel Gallery",
        "address1": "77-82 Whitechapel High Street",
        "city": "London",
        "postcode": "E1 7QX",
        "country_code": "GB",
        "person_name": "Courier Probe",
        "mobile_number": PROBE_MOBILE,
        "source": "public venue address",
    },
]

DESTINATION_SETS = {
    "pilot": PILOT_DESTINATIONS,
    "central-short": CENTRAL_SHORT_DESTINATIONS,
}

VEHICLES = [
    {"label": "pushbike", "vehicle_type": 10},
    {"label": "motorcycle", "vehicle_type": 20},
]

PILOT_WINDOW_SPECS = {
    "economy_9_18": ("09:00", "18:00"),
    "economy_12_18": ("12:00", "18:00"),
    "tight_9_12": ("09:00", "12:00"),
    "tight_12_15": ("12:00", "15:00"),
    "tight_15_18": ("15:00", "18:00"),
    "direct_now_asap": (None, None),
}

SHORT_WINDOW_SPECS = {
    "three_hour_9_12": ("09:00", "12:00"),
    "three_hour_12_15": ("12:00", "15:00"),
    "three_hour_15_18": ("15:00", "18:00"),
    "two_hour_9_11": ("09:00", "11:00"),
    "two_hour_12_14": ("12:00", "14:00"),
    "two_hour_15_17": ("15:00", "17:00"),
    "one_hour_9_10": ("09:00", "10:00"),
    "one_hour_12_13": ("12:00", "13:00"),
    "one_hour_15_16": ("15:00", "16:00"),
}

WINDOW_SETS = {
    "pilot": PILOT_WINDOW_SPECS,
    "short-windows": SHORT_WINDOW_SPECS,
}

WINDOW_ID_CODES = {
    "economy_9_18": "e918",
    "economy_12_18": "e1218",
    "tight_9_12": "t912",
    "tight_12_15": "t1215",
    "tight_15_18": "t1518",
    "direct_now_asap": "asap",
    "three_hour_9_12": "3h9",
    "three_hour_12_15": "3h12",
    "three_hour_15_18": "3h15",
    "two_hour_9_11": "2h9",
    "two_hour_12_14": "2h12",
    "two_hour_15_17": "2h15",
    "one_hour_9_10": "1h9",
    "one_hour_12_13": "1h12",
    "one_hour_15_16": "1h15",
}

VEHICLE_ID_CODES = {
    "pushbike": "pb",
    "motorcycle": "mc",
}

PARCEL_PROFILE = {
    "description": "Small packaged device for repair",
    "insurance_value": 0,
    "length": 20,
    "width": 15,
    "height": 5,
    "weight": 0.5,
}

CSV_FIELDNAMES = [
    "quoted_at",
    "outward_code",
    "representative_postcode",
    "address1",
    "destination_label",
    "service_window",
    "pickup_after",
    "deliver_before",
    "requested_vehicle",
    "requested_vehicle_type",
    "quote_status",
    "http_status",
    "price_net",
    "price_gross",
    "returned_vehicle_type",
    "pickup_eta",
    "delivery_eta",
    "min_realistic_time",
    "error",
]


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def london_timestamp(quote_date: dt.date, hhmm: str) -> str:
    hour, minute = (int(part) for part in hhmm.split(":", 1))
    value = dt.datetime(quote_date.year, quote_date.month, quote_date.day, hour, minute, tzinfo=LONDON_TZ)
    return value.isoformat()


def build_service_windows(quote_date: dt.date, window_specs: dict[str, tuple[str | None, str | None]]) -> dict[str, dict[str, str]]:
    windows: dict[str, dict[str, str]] = {}
    for name, (pickup_after, deliver_before) in window_specs.items():
        window: dict[str, str] = {}
        if pickup_after:
            window["pickup_after"] = london_timestamp(quote_date, pickup_after)
        if deliver_before:
            window["deliver_before"] = london_timestamp(quote_date, deliver_before)
        if name == "direct_now_asap":
            window["note"] = "ASAP quote; no documented direct/no-stopping flag was set."
        windows[name] = window
    return windows


def read_api_key(env_file: Path | None) -> str:
    api_key = os.environ.get("GOPHR_API_KEY", "")
    if api_key or not env_file or not env_file.exists():
        return api_key

    pattern = re.compile(r"""^\s*GOPHR_API_KEY\s*=\s*(['"]?)(.*?)\1\s*$""")
    for line in env_file.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line)
        if match:
            return match.group(2)
    return ""


def build_payload(
    destination: dict[str, str],
    vehicle: dict[str, Any],
    service_window_name: str,
    service_window: dict[str, str],
) -> dict[str, Any]:
    slug = (
        f"{destination['outward_code'].lower()}-"
        f"{WINDOW_ID_CODES[service_window_name]}-{VEHICLE_ID_CODES[vehicle['label']]}"
    )
    parcel_external_id = f"parcel-{slug}"
    pickup = {
        "pickup_address1": ORIGIN["address1"],
        "pickup_city": ORIGIN["city"],
        "pickup_postcode": ORIGIN["postcode"],
        "pickup_country_code": ORIGIN["country_code"],
        "pickup_person_name": ORIGIN["person_name"],
        "pickup_mobile_number": ORIGIN["mobile_number"],
        "parcels": [
            {
                "parcel_external_id": parcel_external_id,
                "parcel_reference_number": parcel_external_id,
                "parcel_description": PARCEL_PROFILE["description"],
                "parcel_insurance_value": PARCEL_PROFILE["insurance_value"],
                "id_check": 0,
                "length": PARCEL_PROFILE["length"],
                "width": PARCEL_PROFILE["width"],
                "height": PARCEL_PROFILE["height"],
                "weight": PARCEL_PROFILE["weight"],
                "is_food": 0,
                "is_fragile": 0,
                "is_liquid": 0,
                "is_not_rotatable": 0,
                "is_glass": 0,
                "is_baked": 0,
                "is_flower": 0,
                "is_alcohol": 0,
                "is_beef": 0,
                "is_pork": 0,
            }
        ],
    }
    dropoff = {
        "dropoff_address1": destination["address1"],
        "dropoff_city": destination["city"],
        "dropoff_postcode": destination["postcode"],
        "dropoff_country_code": destination["country_code"],
        "dropoff_person_name": destination["person_name"],
        "dropoff_mobile_number": destination["mobile_number"],
        "sequence_number": 1,
        "parcels": [{"parcel_external_id": parcel_external_id}],
    }
    if service_window.get("pickup_after"):
        pickup["earliest_pickup_time"] = service_window["pickup_after"]
    if service_window.get("deliver_before"):
        dropoff["dropoff_deadline"] = service_window["deliver_before"]

    return {
        "external_id": f"icorrect-matrix-{slug}",
        "vehicle_type": vehicle["vehicle_type"],
        "is_confirmed": 0,
        "is_fixed_sequence": 0,
        "pickups": [pickup],
        "dropoffs": [dropoff],
        "meta_data": [
            {"key": "source", "value": "icorrect-shopify-theme matrix pilot"},
            {"key": "postcode_outward_code", "value": destination["outward_code"]},
            {"key": "service_window", "value": service_window_name},
            {"key": "direct_flag", "value": "not_set_no_documented_field"},
        ],
    }


def redact(value: Any) -> Any:
    if isinstance(value, dict):
        return {
            key: (
                "[REDACTED]"
                if key.upper() in {"API-KEY", "AUTHORIZATION"}
                or key.lower().endswith("_mobile_number")
                or key.lower().endswith("_phone_number")
                or key.lower().endswith("_email")
                else redact(item)
            )
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [redact(item) for item in value]
    return value


def find_nested(data: Any, names: set[str]) -> dict[str, Any]:
    found: dict[str, Any] = {}

    def walk(node: Any) -> None:
        if isinstance(node, dict):
            for key, value in node.items():
                key_l = str(key).lower()
                if key_l in names and key_l not in found:
                    found[key_l] = value
                walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(data)
    return found


def format_money(value: Any) -> str:
    if isinstance(value, dict):
        amount = value.get("amount")
        currency = value.get("currency")
        if amount is not None and currency:
            return f"{float(amount):.2f} {currency}"
    if isinstance(value, (int, float)):
        return f"{float(value):.2f}"
    return str(value) if value not in (None, "") else ""


def money_value(value: Any) -> float | None:
    if value in (None, ""):
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", str(value))
    return float(match.group(0)) if match else None


def summarise_response(status: int, body: str) -> dict[str, Any]:
    try:
        parsed = json.loads(body)
    except json.JSONDecodeError:
        return {
            "price_net": "",
            "price_gross": "",
            "returned_vehicle_type": "",
            "pickup_eta": "",
            "delivery_eta": "",
            "min_realistic_time": "",
            "error": body[:500],
        }

    fields = find_nested(
        parsed,
        {
            "price_net",
            "price_gross",
            "net_price",
            "gross_price",
            "price",
            "vehicle_type",
            "vehicle",
            "pickup_eta",
            "delivery_eta",
            "eta",
            "min_realistic_time",
            "minimum_realistic_time",
            "error",
            "message",
        },
    )
    error = fields.get("error", fields.get("message", "")) if status >= 400 else ""
    return {
        "price_net": format_money(fields.get("price_net", fields.get("net_price", ""))),
        "price_gross": format_money(fields.get("price_gross", fields.get("gross_price", fields.get("price", "")))),
        "returned_vehicle_type": fields.get("vehicle_type", fields.get("vehicle", "")),
        "pickup_eta": fields.get("pickup_eta", fields.get("eta", "")),
        "delivery_eta": fields.get("delivery_eta", ""),
        "min_realistic_time": fields.get("min_realistic_time", fields.get("minimum_realistic_time", "")),
        "error": json.dumps(error, sort_keys=True)[:500] if isinstance(error, (dict, list)) else str(error)[:500],
    }


def post_quote(base_url: str, api_key: str, payload: dict[str, Any]) -> tuple[int, str]:
    request = urllib.request.Request(
        f"{base_url.rstrip('/')}/quotes",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "API-KEY": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as exc:
        return 0, str(exc)


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_FIELDNAMES, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def successful_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [row for row in rows if row["quote_status"] == "ok" and money_value(row["price_gross"]) is not None]


def group_min_max_by_postcode(rows: list[dict[str, Any]]) -> list[tuple[str, float, float, int]]:
    grouped: dict[str, list[float]] = {}
    for row in successful_rows(rows):
        grouped.setdefault(row["outward_code"], []).append(money_value(row["price_gross"]) or 0)
    return sorted((code, min(values), max(values), len(values)) for code, values in grouped.items())


def failure_counts(rows: list[dict[str, Any]]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for row in rows:
        if row["quote_status"] != "ok":
            counts[row["service_window"]] = counts.get(row["service_window"], 0) + 1
    return counts


def vehicle_deltas(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_key: dict[tuple[str, str], dict[str, float]] = {}
    for row in successful_rows(rows):
        key = (row["outward_code"], row["service_window"])
        by_key.setdefault(key, {})[row["requested_vehicle"]] = money_value(row["price_gross"]) or 0
    deltas = []
    for (outward_code, service_window), prices in by_key.items():
        if "pushbike" in prices and "motorcycle" in prices:
            deltas.append(
                {
                    "outward_code": outward_code,
                    "service_window": service_window,
                    "pushbike": prices["pushbike"],
                    "motorcycle": prices["motorcycle"],
                    "delta": prices["motorcycle"] - prices["pushbike"],
                }
            )
    return sorted(deltas, key=lambda item: abs(item["delta"]), reverse=True)


def write_markdown(
    path: Path,
    rows: list[dict[str, Any]],
    destinations: list[dict[str, str]],
    csv_out: Path,
    dry_run: bool,
    base_url: str,
    quote_date: dt.date,
    stopped_early: bool,
    destination_set: str,
    window_set: str,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok_rows = successful_rows(rows)
    gross_sorted = sorted(ok_rows, key=lambda row: money_value(row["price_gross"]) or 0)
    failures = failure_counts(rows)
    postcode_ranges = group_min_max_by_postcode(rows)
    deltas = vehicle_deltas(rows)
    source_lines = [
        f"- {destination['outward_code']}: {destination['label']}, {destination['address1']}, "
        f"{destination['city']}, {destination['postcode']} ({destination['source']})"
        for destination in destinations
    ]

    lines = [
        "# Gophr London Quote Matrix Pilot",
        "",
        f"**Generated:** {utc_now()}",
        f"**Mode:** {'dry run' if dry_run else 'live API call'}",
        f"**Base URL:** `{base_url}`",
        f"**Quote date:** `{quote_date.isoformat()}`",
        f"**Destination set:** `{destination_set}`",
        f"**Window set:** `{window_set}`",
        f"**Rows written:** {len(rows)}",
        f"**Successful quotes:** {len(ok_rows)}",
        f"**Stopped early:** {'yes' if stopped_early else 'no'}",
        "",
        "## Safety",
        "",
        "- The script reads `GOPHR_API_KEY` from the local environment or the approved local env file.",
        "- The API key is never printed, logged, or written to this file.",
        "- Jobs are requested as unconfirmed quote probes, not confirmed courier bookings.",
        "- `direct_now_asap` is an ASAP quote; no direct/no-stopping flag was set because the public quote reference did not document one.",
        "",
        "## Parcel And Vehicles",
        "",
        "- Parcel: 20 x 15 x 5 cm, 0.5kg, insurance 0, not fragile, not glass.",
        "- Vehicles: pushbike (`10`) and motorcycle (`20`).",
        "",
        "## Pilot Addresses",
        "",
        f"- Origin: {ORIGIN['address1']}, {ORIGIN['city']}, {ORIGIN['postcode']}",
        *source_lines,
        "",
        "## Price Range By Pilot Postcode",
        "",
        "| Outward | Successful quotes | Cheapest gross | Most expensive gross |",
        "|---|---:|---:|---:|",
    ]
    for outward_code, cheapest, most_expensive, count in postcode_ranges:
        lines.append(f"| {outward_code} | {count} | {cheapest:.2f} GBP | {most_expensive:.2f} GBP |")

    lines.extend(["", "## Cheapest And Most Expensive Rows", ""])
    if gross_sorted:
        lines.extend(
            [
                f"- Cheapest: {gross_sorted[0]['outward_code']} {gross_sorted[0]['service_window']} "
                f"{gross_sorted[0]['requested_vehicle']} at {gross_sorted[0]['price_gross']}.",
                f"- Most expensive: {gross_sorted[-1]['outward_code']} {gross_sorted[-1]['service_window']} "
                f"{gross_sorted[-1]['requested_vehicle']} at {gross_sorted[-1]['price_gross']}.",
            ]
        )
    else:
        lines.append("- No successful priced quote rows were returned.")

    lines.extend(["", "## Tight Window Behaviour", ""])
    if failures:
        for window, count in sorted(failures.items()):
            lines.append(f"- {window}: {count} failed quote rows.")
    else:
        lines.append("- No service windows failed in the pilot.")

    tight_rows = [row for row in ok_rows if row["service_window"].startswith("tight_")]
    if tight_rows:
        tight_sorted = sorted(tight_rows, key=lambda row: money_value(row["price_gross"]) or 0, reverse=True)[:8]
        lines.extend(["", "| Outward | Window | Vehicle | Gross |", "|---|---|---|---:|"])
        for row in tight_sorted:
            lines.append(
                f"| {row['outward_code']} | {row['service_window']} | "
                f"{row['requested_vehicle']} | {row['price_gross']} |"
            )

    lines.extend(["", "## Pushbike Vs Motorcycle", ""])
    if deltas:
        lines.extend(["| Outward | Window | Pushbike gross | Motorcycle gross | Motorbike delta |", "|---|---|---:|---:|---:|"])
        for item in deltas[:12]:
            lines.append(
                f"| {item['outward_code']} | {item['service_window']} | {item['pushbike']:.2f} GBP | "
                f"{item['motorcycle']:.2f} GBP | {item['delta']:.2f} GBP |"
            )
    else:
        lines.append("- No paired pushbike/motorcycle prices were available to compare.")

    lines.extend(
        [
            "",
            "## Recommendations For Scaling",
            "",
            "- Keep the baseline parcel profile fixed while expanding coverage, otherwise postcode effects and parcel effects will be mixed.",
            "- Expand in outward-code batches with a conservative stop condition for repeated HTTP or validation failures.",
            "- Store both vehicle quotes even where one is consistently cheaper; the returned vehicle type can reveal Gophr substitutions or availability constraints.",
            "- Keep `direct_now_asap` separate from scheduled windows because it has no pickup-after or delivery-before constraints in the payload.",
            "- Use public/commercial representative addresses for each outward code and keep source notes beside the address list.",
            "",
            "## Raw Result Notes",
            "",
            f"- Full row-level output is in `{csv_out}`.",
        ]
    )
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="write payload/result files without calling Gophr")
    parser.add_argument("--base-url", default=os.environ.get("GOPHR_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--quote-date", default="2026-05-05", help="London-local quote date in YYYY-MM-DD format")
    parser.add_argument("--doc-out", type=Path, default=DEFAULT_DOC_OUT)
    parser.add_argument("--csv-out", type=Path, default=DEFAULT_CSV_OUT)
    parser.add_argument("--env-file", type=Path, default=DEFAULT_ENV_FILE)
    parser.add_argument("--destination-set", choices=sorted(DESTINATION_SETS), default="pilot")
    parser.add_argument("--window-set", choices=sorted(WINDOW_SETS), default="pilot")
    parser.add_argument("--limit", type=int, default=0, help="optional row limit for smoke tests")
    parser.add_argument("--sleep", type=float, default=0.15, help="seconds to pause between live API calls")
    parser.add_argument("--max-consecutive-errors", type=int, default=20)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    quote_date = dt.date.fromisoformat(args.quote_date)
    destinations = DESTINATION_SETS[args.destination_set]
    service_windows = build_service_windows(quote_date, WINDOW_SETS[args.window_set])
    api_key = read_api_key(args.env_file)

    if not args.dry_run and not api_key:
        print("GOPHR_API_KEY is not set. Run with --dry-run or provide the approved local env file.", file=sys.stderr)
        return 2

    rows: list[dict[str, Any]] = []
    quoted_at = utc_now()
    consecutive_errors = 0
    stopped_early = False

    for destination in destinations:
        for service_window_name, service_window in service_windows.items():
            for vehicle in VEHICLES:
                payload = build_payload(destination, vehicle, service_window_name, service_window)
                status = 0
                quote_status = "dry_run"
                summary = {
                    "price_net": "",
                    "price_gross": "",
                    "returned_vehicle_type": "",
                    "pickup_eta": "",
                    "delivery_eta": "",
                    "min_realistic_time": "",
                    "error": "",
                }
                if args.dry_run:
                    summary["error"] = service_window.get("note", "")
                else:
                    status, body = post_quote(args.base_url, api_key, payload)
                    summary = summarise_response(status, body)
                    quote_status = "ok" if 200 <= status < 300 else "error"
                    consecutive_errors = 0 if quote_status == "ok" else consecutive_errors + 1
                    if args.sleep:
                        time.sleep(args.sleep)

                if service_window_name == "direct_now_asap":
                    note = "direct flag not set; no documented quote field"
                    summary["error"] = f"{summary['error']}; {note}".strip("; ")

                rows.append(
                    {
                        "quoted_at": quoted_at,
                        "outward_code": destination["outward_code"],
                        "representative_postcode": destination["postcode"],
                        "address1": destination["address1"],
                        "destination_label": destination["label"],
                        "service_window": service_window_name,
                        "pickup_after": service_window.get("pickup_after", ""),
                        "deliver_before": service_window.get("deliver_before", ""),
                        "requested_vehicle": vehicle["label"],
                        "requested_vehicle_type": vehicle["vehicle_type"],
                        "quote_status": quote_status,
                        "http_status": status,
                        **summary,
                    }
                )

                if args.limit and len(rows) >= args.limit:
                    stopped_early = True
                    break
                if consecutive_errors >= args.max_consecutive_errors:
                    stopped_early = True
                    break
            if stopped_early:
                break
        if stopped_early:
            break

    write_csv(args.csv_out, rows)
    write_markdown(
        args.doc_out,
        rows,
        destinations,
        args.csv_out,
        args.dry_run,
        args.base_url,
        quote_date,
        stopped_early,
        args.destination_set,
        args.window_set,
    )
    print(f"Wrote {args.csv_out}")
    print(f"Wrote {args.doc_out}")
    print(f"Rows: {len(rows)}")
    return 0 if rows else 1


if __name__ == "__main__":
    raise SystemExit(main())
