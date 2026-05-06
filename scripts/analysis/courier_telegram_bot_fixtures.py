#!/usr/bin/env python3
"""No-network fixture checks for the courier Telegram prototype."""

from __future__ import annotations

import datetime as dt

from courier_decision_engine import LONDON_TZ
from courier_telegram_bot import CourierTelegramBot, parse_allowed_user_ids


NOW = dt.datetime(2026, 5, 6, 10, 30, tzinfo=LONDON_TZ)


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def make_bot() -> CourierTelegramBot:
    return CourierTelegramBot(allowed_user_ids={123})


def send(bot: CourierTelegramBot, text: str, chat_id: int = 456, user_id: int = 123):
    return bot.handle_message(user_id=user_id, chat_id=chat_id, text=text, now=NOW)


def test_guided_quote_flow() -> None:
    bot = make_bot()
    assert_true("postcode" in send(bot, "quote")[0].text.lower(), "quote should ask for postcode")
    assert_true("repair" in send(bot, "W1B 2EL")[0].text.lower(), "postcode should ask repair type")
    assert_true("stock" in send(bot, "iPhone screen")[0].text.lower(), "repair should ask stock state")
    assert_true("slots" in send(bot, "Available")[0].text.lower(), "stock should ask slots")
    final = send(bot, "3")[0]
    assert_true("Courier quote result" in final.text, "final reply should contain decision result")
    assert_true("Free standard courier" in final.text, "central screen quote should include free standard")
    assert_true("Same-day return: yes" in final.text, "eligible flow should show same-day")
    assert_true(final.remove_keyboard is True, "final reply should remove keyboard")


def test_debug_flow_includes_calculations() -> None:
    bot = make_bot()
    send(bot, "debug")
    send(bot, "W1B 2EL")
    send(bot, "iPhone screen")
    send(bot, "Available")
    final = send(bot, "3")[0]
    assert_true("Debug:" in final.text, "debug flow should include debug section")
    assert_true("Target contribution" in final.text, "debug flow should include contribution data")


def test_invalid_repair_reprompts() -> None:
    bot = make_bot()
    send(bot, "quote")
    send(bot, "W1B 2EL")
    reply = send(bot, "screen please")[0]
    assert_true("repair buttons" in reply.text, "invalid repair input should reprompt")
    assert_true(reply.keyboard is not None, "invalid repair input should keep repair keyboard")


def test_cancel_resets_flow() -> None:
    bot = make_bot()
    send(bot, "quote")
    reply = send(bot, "cancel")[0]
    assert_true("cancelled" in reply.text.lower(), "cancel should acknowledge")
    assert_true(456 not in bot.conversations, "cancel should remove conversation state")


def test_unauthorized_user_blocked() -> None:
    bot = make_bot()
    reply = send(bot, "quote", user_id=999)[0]
    assert_true("restricted" in reply.text.lower(), "unauthorized user should be blocked")


def test_help_keyboard() -> None:
    bot = make_bot()
    reply = send(bot, "help")[0]
    assert_true("quote" in reply.text.lower(), "help should mention quote")
    assert_true(reply.keyboard == [["quote", "debug"], ["cancel"]], "help should expose quick commands")


def test_allowed_user_parser() -> None:
    assert_true(parse_allowed_user_ids("123, 456") == {123, 456}, "allowlist parser should handle comma list")
    assert_true(parse_allowed_user_ids("") == set(), "empty allowlist should parse as empty set")


TESTS = [
    test_guided_quote_flow,
    test_debug_flow_includes_calculations,
    test_invalid_repair_reprompts,
    test_cancel_resets_flow,
    test_unauthorized_user_blocked,
    test_help_keyboard,
    test_allowed_user_parser,
]


def main() -> int:
    for test in TESTS:
        test()
        print(f"PASS {test.__name__}")
    print(f"OK {len(TESTS)} Telegram fixture checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
