#!/usr/bin/env python3
"""Fixture checks for the website-facing courier decision contract."""

from __future__ import annotations

import datetime as dt
import json
import subprocess
import sys
from pathlib import Path

from courier_decision_contract import (
    CART_PROPERTY_KEYS,
    DENIED_CONTRACT_TOKENS,
    SCHEMA_VERSION,
    build_contract,
)
from courier_decision_engine import DIAGNOSTIC_COPY, LONDON_TZ


ROOT = Path(__file__).resolve().parents[2]


def contract(
    postcode: str,
    repair_type: str = "iphone_screen",
    stock: str = "available",
    now: str = "2026-05-06T10:30:00+01:00",
    slots: int = 3,
    action: str = "quote",
) -> dict:
    return build_contract(
        postcode=postcode,
        repair_type=repair_type,
        stock=stock,
        now=dt.datetime.fromisoformat(now).astimezone(LONDON_TZ),
        same_day_slots=slots,
        action=action,
    )


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def walk_keys(value) -> set[str]:
    keys: set[str] = set()
    if isinstance(value, dict):
        for key, child in value.items():
            keys.add(key)
            keys.update(walk_keys(child))
    elif isinstance(value, list):
        for child in value:
            keys.update(walk_keys(child))
    return keys


def option_levels(result: dict) -> set[str]:
    return {option["service_level"] for option in result["options"]}


def test_contract_shape_for_central_quote() -> None:
    result = contract("W1B 2EL")
    assert_true(result["schema_version"] == SCHEMA_VERSION, "schema version should be pinned")
    assert_true(result["status"] == "ok", "central postcode should be serviceable")
    assert_true(result["postcode"]["normalised"] == "W1B 2EL", "full postcode should be normalised")
    assert_true(result["postcode"]["outward_code"] == "W1B", "outward code should be exposed")
    assert_true(result["postcode"]["coverage"] == "london_courier", "coverage should identify London courier")
    assert_true("standard" in option_levels(result), "standard option should be present")
    assert_true(result["errors"] == [], "successful quote should have an empty errors list")


def test_options_include_stable_shopify_cart_properties() -> None:
    result = contract("W1B 2EL")
    for option in result["options"]:
        assert_true(option["option_id"].startswith(f"{result['quote_id']}:"), "option id should be quote-scoped")
        assert_true(option["currency"] == "GBP", "contract should pin GBP")
        assert_true(set(option["cart_properties"]) == set(CART_PROPERTY_KEYS), "cart property keys should stay stable")
        assert_true(
            option["cart_properties"]["_courier_quote_id"] == result["quote_id"],
            "cart properties should carry quote id",
        )
        assert_true(
            option["cart_properties"]["_courier_option_id"] == option["option_id"],
            "cart properties should carry selected option id",
        )
        assert_true(
            option["cart_properties"]["_courier_customer_charge_gross"] == option["customer_price_gross"],
            "cart charge should match customer-facing price",
        )


def test_invalid_postcode_has_no_checkout_options() -> None:
    result = contract("BAD POSTCODE")
    assert_true(result["status"] == "invalid_postcode", "malformed postcode should be invalid")
    assert_true(result["options"] == [], "invalid postcode must not create checkout options")
    assert_true(result["errors"], "invalid postcode should explain the validation failure")


def test_non_london_postcode_returns_manual_fallback() -> None:
    result = contract("M1 1AE")
    assert_true(result["status"] == "manual_fallback", "valid non-London postcode should be a manual fallback")
    assert_true(result["postcode"]["coverage"] == "manual_fallback", "coverage should not imply London courier")
    assert_true(result["options"][0]["service_level"] == "manual", "manual fallback should return one manual option")


def test_diagnostic_contract_uses_assessment_first_wording() -> None:
    result = contract("W1B 2EL", repair_type="diagnostic", stock="unknown")
    assert_true(result["repair"]["flow_type"] == "diagnostic", "diagnostic flow type should be explicit")
    assert_true(result["turnaround_message"] == DIAGNOSTIC_COPY, "diagnostic turnaround wording should match spec")
    assert_true(result["options"][0]["customer_message"] == DIAGNOSTIC_COPY, "diagnostic option needs assessment copy")
    assert_true(not result["options"][0]["same_day_return"], "diagnostic should not promise same-day")


def test_reserve_contract_sets_ttl_without_consuming_on_view() -> None:
    quote = contract("W1B 2EL", action="quote")
    reserve = contract("W1B 2EL", action="reserve")
    assert_true(quote["reservation"]["slot_consumed_on_view"] is False, "quote view must not consume slots")
    assert_true(quote["reservation"]["slot_reserved"] is False, "quote action must not reserve")
    assert_true(reserve["reservation"]["slot_reserved"] is True, "reserve action should reserve eligible same-day")
    assert_true(reserve["reservation"]["ttl_minutes"] == 15, "reservation TTL should be fixed at 15 minutes")
    assert_true("expires_at" in reserve["reservation"], "reservation should expose expiry for cart validation")


def test_contract_output_does_not_leak_internal_fields() -> None:
    result = contract("W1B 2EL")
    rendered = json.dumps(result, sort_keys=True).lower()
    for token in DENIED_CONTRACT_TOKENS:
        assert_true(token not in rendered, f"contract leaked denied token: {token}")
    for key in walk_keys(result):
        if key.startswith("_"):
            assert_true(key in CART_PROPERTY_KEYS, f"unexpected private key leaked: {key}")


def test_cli_outputs_contract_json() -> None:
    completed = subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts/analysis/courier_decision_contract.py"),
            "--postcode",
            "W1B 2EL",
            "--repair-type",
            "iphone_screen",
            "--stock",
            "available",
            "--now",
            "2026-05-06T10:30:00+01:00",
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    payload = json.loads(completed.stdout)
    assert_true(payload["schema_version"] == SCHEMA_VERSION, "CLI should emit the contract schema")
    assert_true("debug" not in payload, "contract CLI should not expose debug output by default")


TESTS = [
    test_contract_shape_for_central_quote,
    test_options_include_stable_shopify_cart_properties,
    test_invalid_postcode_has_no_checkout_options,
    test_non_london_postcode_returns_manual_fallback,
    test_diagnostic_contract_uses_assessment_first_wording,
    test_reserve_contract_sets_ttl_without_consuming_on_view,
    test_contract_output_does_not_leak_internal_fields,
    test_cli_outputs_contract_json,
]


def main() -> int:
    for test in TESTS:
        test()
        print(f"PASS {test.__name__}")
    print(f"OK {len(TESTS)} contract checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
