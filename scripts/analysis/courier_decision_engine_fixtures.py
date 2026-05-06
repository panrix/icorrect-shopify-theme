#!/usr/bin/env python3
"""Fixture checks for the local courier decision engine prototype."""

from __future__ import annotations

import datetime as dt
import json
from decimal import Decimal

from courier_decision_engine import (
    DENIED_OUTPUT_FIELDS,
    DIAGNOSTIC_COPY,
    DecisionEngine,
    LONDON_TZ,
    TWO_WORKING_DAY_COPY,
)


ENGINE = DecisionEngine()


def decide(
    postcode: str,
    repair_type: str = "iphone_screen",
    stock: str = "available",
    now: str = "2026-05-06T10:30:00+01:00",
    slots: int = 3,
    action: str = "quote",
    debug: bool = False,
) -> dict:
    return ENGINE.decide(
        postcode=postcode,
        repair_type=repair_type,
        stock=stock,
        now=dt.datetime.fromisoformat(now).astimezone(LONDON_TZ),
        same_day_slots=slots,
        action=action,
        target_contribution=Decimal("40.00"),
        debug=debug,
    )


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def option_levels(result: dict) -> set[str]:
    return {option["service_level"] for option in result["options"]}


def has_free_standard(result: dict) -> bool:
    return any(
        option["service_level"] == "standard" and option["customer_price_gross"] == "0.00"
        for option in result["options"]
    )


def any_same_day(result: dict) -> bool:
    return any(option.get("same_day_return") is True for option in result["options"])


def contains_key(value, denied: set[str]) -> bool:
    if isinstance(value, dict):
        return any(key in denied or contains_key(child, denied) for key, child in value.items())
    if isinstance(value, list):
        return any(contains_key(item, denied) for item in value)
    return False


def test_central_same_day_free_or_subsidised() -> None:
    result = decide("W1B 2EL", "iphone_screen", "available")
    assert_true(result["status"] == "ok", "central iPhone screen should be serviceable")
    assert_true("standard" in option_levels(result), "standard option should be returned")
    assert_true(has_free_standard(result), "central high-margin repair should qualify for free standard")
    assert_true(any_same_day(result), "eligible central repair should show same-day when slots and stock pass")


def test_outer_hides_free_and_falls_back_when_unprofitable() -> None:
    for postcode in ("E10 5PS", "W7 3SA"):
        result = decide(postcode, "iphone_screen", "available")
        assert_true(not has_free_standard(result), f"{postcode} should not show free courier")
        assert_true(result["status"] == "manual_fallback", f"{postcode} should fall back when no band is profitable")


def test_low_margin_battery_blocks_free_courier() -> None:
    result = decide("W1B 2EL", "iphone_battery", "available")
    assert_true(not has_free_standard(result), "low-margin battery should not get free courier")
    assert_true(
        all(option["customer_price_gross"] != "0.00" for option in result["options"]),
        "low-margin battery should only show paid/manual options",
    )


def test_diagnostic_wording() -> None:
    result = decide("W1B 2EL", "diagnostic", "unknown")
    assert_true(result["options"][0]["customer_message"] == DIAGNOSTIC_COPY, "diagnostic copy must match spec")
    assert_true(not any_same_day(result), "diagnostic must not promise same-day")


def test_two_working_day_repairs() -> None:
    for repair_type in ("ipad_known_repair", "macbook_known_repair"):
        result = decide("W1B 2EL", repair_type, "available")
        assert_true(result.get("turnaround_message") == TWO_WORKING_DAY_COPY, f"{repair_type} needs two-working-day copy")
        assert_true(not any_same_day(result), f"{repair_type} must not be same-day")


def test_non_eligible_repairs_never_same_day() -> None:
    for repair_type in ("back_glass", "other_known_repair"):
        result = decide("W1B 2EL", repair_type, "available")
        assert_true(not any_same_day(result), f"{repair_type} must not be same-day")


def test_stock_unknown_or_unavailable_hides_same_day() -> None:
    for stock in ("unknown", "unavailable"):
        result = decide("W1B 2EL", "iphone_screen", stock)
        assert_true(not any_same_day(result), f"{stock} stock must hide same-day")


def test_slot_boundaries() -> None:
    for slots in (3, 2, 1):
        result = decide("W1B 2EL", "iphone_screen", "available", slots=slots)
        assert_true(any_same_day(result), f"{slots} slots should permit same-day")
    result = decide("W1B 2EL", "iphone_screen", "available", slots=0)
    assert_true(not any_same_day(result), "zero slots must hide same-day")


def test_cutoff_boundaries() -> None:
    before = decide("W1B 2EL", "iphone_screen", "available", now="2026-05-06T11:59:00+01:00")
    at_cutoff = decide("W1B 2EL", "iphone_screen", "available", now="2026-05-06T12:00:00+01:00")
    after = decide("W1B 2EL", "iphone_screen", "available", now="2026-05-06T12:01:00+01:00")
    assert_true(any_same_day(before), "11:59 should permit same-day")
    assert_true(not any_same_day(at_cutoff), "12:00 should hide same-day")
    assert_true(not any_same_day(after), "12:01 should hide same-day")


def test_postcode_fallbacks() -> None:
    non_london = decide("M1 1AE", "iphone_screen", "available")
    malformed = decide("BAD POSTCODE", "iphone_screen", "available")
    outward_only = decide("W1", "iphone_screen", "available")
    assert_true(non_london["status"] == "manual_fallback", "valid non-London postcode should be manual")
    assert_true(malformed["status"] == "invalid_postcode", "malformed postcode should be invalid")
    assert_true(outward_only["status"] == "full_postcode_required", "outward-only postcode should ask for full postcode")


def test_quote_view_does_not_consume_slot_and_reserve_does() -> None:
    quote = decide("W1B 2EL", "iphone_screen", "available", action="quote")
    reserve = decide("W1B 2EL", "iphone_screen", "available", action="reserve")
    assert_true(quote["reservation"]["slot_consumed_on_view"] is False, "viewing options must not consume a slot")
    assert_true(quote["reservation"]["slot_reserved"] is False, "quote action should not reserve a slot")
    assert_true(reserve["reservation"]["slot_reserved"] is True, "reserve action should reserve an eligible same-day slot")
    assert_true("expires_at" in reserve["reservation"], "reservation should expose expiry time")


def test_normal_output_has_no_denied_fields() -> None:
    result = decide("W1B 2EL", "iphone_screen", "available")
    assert_true(not contains_key(result, DENIED_OUTPUT_FIELDS), "normal output leaked denied internal field")
    rendered = json.dumps(result, sort_keys=True)
    for token in ("gophr", "subsidy", "margin", "net_contribution"):
        assert_true(token not in rendered.lower(), f"normal output leaked {token}")


def test_debug_output_contains_local_calculations() -> None:
    result = decide("W1B 2EL", "iphone_screen", "available", debug=True)
    assert_true("debug" in result, "debug mode should expose local calculation details")
    assert_true(result["debug"]["calculations"], "debug mode should include calculations")


TESTS = [
    test_central_same_day_free_or_subsidised,
    test_outer_hides_free_and_falls_back_when_unprofitable,
    test_low_margin_battery_blocks_free_courier,
    test_diagnostic_wording,
    test_two_working_day_repairs,
    test_non_eligible_repairs_never_same_day,
    test_stock_unknown_or_unavailable_hides_same_day,
    test_slot_boundaries,
    test_cutoff_boundaries,
    test_postcode_fallbacks,
    test_quote_view_does_not_consume_slot_and_reserve_does,
    test_normal_output_has_no_denied_fields,
    test_debug_output_contains_local_calculations,
]


def main() -> int:
    for test in TESTS:
        test()
        print(f"PASS {test.__name__}")
    print(f"OK {len(TESTS)} fixture checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
