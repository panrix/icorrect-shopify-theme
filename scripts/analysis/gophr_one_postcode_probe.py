#!/usr/bin/env python3
"""Run a tiny redacted Gophr quote probe for two London postcodes.

The script reads GOPHR_API_KEY from the environment and never prints it.
It writes line-by-line CSV and Markdown summaries suitable for reviewing the
shape of Gophr quote responses before building the full postcode map.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_BASE_URL = "https://api-sandbox.gophr.com/v2-commercial-api"
DEFAULT_DOC_OUT = Path("docs/gophr-one-postcode-probe-2026-05-05.md")
DEFAULT_CSV_OUT = Path("data/gophr-one-postcode-probe-2026-05-05.csv")
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

DESTINATIONS = [
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
]

VEHICLES = [
    {"label": "pushbike", "vehicle_type": 10},
    {"label": "motorcycle", "vehicle_type": 20},
]


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def build_payload(destination: dict[str, str], vehicle: dict[str, Any]) -> dict[str, Any]:
    parcel_external_id = f"parcel-{destination['outward_code'].lower()}-{vehicle['label']}"
    return {
        "external_id": f"icorrect-probe-{destination['outward_code'].lower()}-{vehicle['label']}",
        "vehicle_type": vehicle["vehicle_type"],
        "is_confirmed": 0,
        "is_fixed_sequence": 0,
        "pickups": [
            {
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
                        "parcel_description": "Apple device for repair",
                        "parcel_insurance_value": 1000,
                        "id_check": 0,
                        "length": 38,
                        "width": 28,
                        "height": 8,
                        "weight": 5,
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
        ],
        "dropoffs": [
            {
                "dropoff_address1": destination["address1"],
                "dropoff_city": destination["city"],
                "dropoff_postcode": destination["postcode"],
                "dropoff_country_code": destination["country_code"],
                "dropoff_person_name": destination["person_name"],
                "dropoff_mobile_number": destination["mobile_number"],
                "sequence_number": 1,
                "parcels": [{"parcel_external_id": parcel_external_id}],
            }
        ],
        "meta_data": [
            {"key": "source", "value": "icorrect-shopify-theme probe"},
            {"key": "postcode_outward_code", "value": destination["outward_code"]},
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
            return f"{amount:.2f} {currency}" if isinstance(amount, float) else f"{amount} {currency}"
    return str(value) if value not in (None, "") else ""


def summarise_response(status: int, body: str) -> tuple[dict[str, Any], str]:
    try:
        parsed = json.loads(body)
    except json.JSONDecodeError:
        return (
            {
                "response_type": "text",
                "response_keys": "",
                "price_net": "",
                "price_gross": "",
                "vehicle_returned": "",
                "distance": "",
                "eta": "",
                "error": body[:500],
            },
            body[:2000],
        )

    keys = ",".join(parsed.keys()) if isinstance(parsed, dict) else ""
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
            "distance",
            "distance_meters",
            "eta",
            "pickup_eta",
            "delivery_eta",
            "error",
            "message",
        },
    )
    summary = {
        "response_type": "json",
        "response_keys": keys,
        "price_net": format_money(fields.get("price_net", fields.get("net_price", ""))),
        "price_gross": format_money(fields.get("price_gross", fields.get("gross_price", fields.get("price", "")))),
        "vehicle_returned": fields.get("vehicle_type", fields.get("vehicle", "")),
        "distance": fields.get("distance", fields.get("distance_meters", "")),
        "eta": fields.get("eta", fields.get("pickup_eta", fields.get("delivery_eta", ""))),
        "error": fields.get("error", fields.get("message", "")) if status >= 400 else "",
    }
    pretty = json.dumps(redact(parsed), indent=2, sort_keys=True)[:4000]
    return summary, pretty


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


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "quoted_at",
        "outward_code",
        "representative_postcode",
        "address1",
        "destination_label",
        "requested_vehicle",
        "requested_vehicle_type",
        "http_status",
        "quote_status",
        "response_type",
        "price_net",
        "price_gross",
        "vehicle_returned",
        "distance",
        "eta",
        "response_keys",
        "error",
    ]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def write_markdown(
    path: Path,
    rows: list[dict[str, Any]],
    payloads: list[dict[str, Any]],
    responses: list[dict[str, Any]],
    dry_run: bool,
    base_url: str,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Gophr One Postcode Probe",
        "",
        f"**Generated:** {utc_now()}",
        f"**Mode:** {'dry run' if dry_run else 'live API call'}",
        f"**Base URL:** `{base_url}`",
        "",
        "## Safety",
        "",
        "- The script reads `GOPHR_API_KEY` from the shell environment.",
        "- The API key is never printed or written to this file.",
        "- Payload examples below omit all authentication headers.",
        "- Jobs are requested as draft/quote probes, not confirmed courier bookings.",
        "",
        "## Addresses",
        "",
        f"- Origin: {ORIGIN['address1']}, {ORIGIN['city']}, {ORIGIN['postcode']}",
    ]
    for destination in DESTINATIONS:
        lines.append(
            f"- {destination['outward_code']}: {destination['label']}, "
            f"{destination['address1']}, {destination['city']}, {destination['postcode']} "
            f"({destination['source']})"
        )
    lines.extend(["", "## Results", ""])
    lines.append(
        "| Outward | Postcode | Requested vehicle | HTTP | Status | Net | Gross | Returned vehicle | Error |"
    )
    lines.append("|---|---|---:|---:|---|---:|---:|---|---|")
    for row in rows:
        lines.append(
            "| {outward_code} | {representative_postcode} | {requested_vehicle} | "
            "{http_status} | {quote_status} | {price_net} | {price_gross} | "
            "{vehicle_returned} | {error} |".format(**{k: str(v).replace("|", "\\|") for k, v in row.items()})
        )
    lines.extend(["", "## Redacted Payload Shape", ""])
    lines.append("```json")
    lines.append(json.dumps(redact(payloads), indent=2, sort_keys=True))
    lines.append("```")
    if responses:
        lines.extend(["", "## Response Shape Notes", ""])
        for response in responses:
            lines.append(
                f"### {response['outward_code']} / {response['requested_vehicle']} / HTTP {response['http_status']}"
            )
            lines.append("")
            lines.append("```json")
            lines.append(response["body_excerpt"])
            lines.append("```")
            lines.append("")
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="write payload/result files without calling Gophr")
    parser.add_argument("--base-url", default=os.environ.get("GOPHR_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--doc-out", type=Path, default=DEFAULT_DOC_OUT)
    parser.add_argument("--csv-out", type=Path, default=DEFAULT_CSV_OUT)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    api_key = os.environ.get("GOPHR_API_KEY", "")

    if not args.dry_run and not api_key:
        print("GOPHR_API_KEY is not set. Run with --dry-run or set the key in your shell.", file=sys.stderr)
        return 2

    rows: list[dict[str, Any]] = []
    payloads: list[dict[str, Any]] = []
    responses: list[dict[str, Any]] = []

    quoted_at = utc_now()
    for destination in DESTINATIONS:
        for vehicle in VEHICLES:
            payload = build_payload(destination, vehicle)
            payloads.append(payload)
            status = 0
            body = ""
            if args.dry_run:
                summary = {
                    "response_type": "dry_run",
                    "response_keys": "",
                    "price_net": "",
                    "price_gross": "",
                    "vehicle_returned": "",
                    "distance": "",
                    "eta": "",
                    "error": "",
                }
                quote_status = "dry_run"
            else:
                status, body = post_quote(args.base_url, api_key, payload)
                summary, body_excerpt = summarise_response(status, body)
                quote_status = "ok" if 200 <= status < 300 else "error"
                responses.append(
                    {
                        "outward_code": destination["outward_code"],
                        "requested_vehicle": vehicle["label"],
                        "http_status": status,
                        "body_excerpt": body_excerpt,
                    }
                )

            rows.append(
                {
                    "quoted_at": quoted_at,
                    "outward_code": destination["outward_code"],
                    "representative_postcode": destination["postcode"],
                    "address1": destination["address1"],
                    "destination_label": destination["label"],
                    "requested_vehicle": vehicle["label"],
                    "requested_vehicle_type": vehicle["vehicle_type"],
                    "http_status": status,
                    "quote_status": quote_status,
                    **summary,
                }
            )

    write_csv(args.csv_out, rows)
    write_markdown(args.doc_out, rows, payloads, responses, args.dry_run, args.base_url)
    print(f"Wrote {args.csv_out}")
    print(f"Wrote {args.doc_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
