#!/usr/bin/env python3
"""No-network fixture checks for the courier Telegram prototype."""

from __future__ import annotations

import datetime as dt

from courier_decision_engine import LONDON_TZ
from courier_telegram_bot import (
    BotReply,
    CourierTelegramBot,
    build_send_message_payload,
    normalise_command,
    parse_allowed_chat_ids,
    parse_allowed_user_ids,
)


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


def test_inline_button_quote_flow() -> None:
    bot = make_bot()
    first = send(bot, "/quote")[0]
    assert_true(first.inline_keyboard is not None, "quote should expose postcode inline buttons")
    assert_true(first.inline_keyboard[0][0]["callback_data"].startswith("postcode|"), "postcode buttons should use callback data")

    second = bot.handle_callback(user_id=123, chat_id=456, data="postcode|W1B 2EL", now=NOW)[0]
    assert_true("repair" in second.text.lower(), "postcode callback should ask repair")
    assert_true(second.inline_keyboard is not None, "repair step should use inline buttons")

    third = bot.handle_callback(user_id=123, chat_id=456, data="repair|iphone_screen", now=NOW)[0]
    assert_true("stock" in third.text.lower(), "repair callback should ask stock")

    fourth = bot.handle_callback(user_id=123, chat_id=456, data="stock|available", now=NOW)[0]
    assert_true("slots" in fourth.text.lower(), "stock callback should ask slots")

    final = bot.handle_callback(user_id=123, chat_id=456, data="slots|3", now=NOW)[0]
    assert_true("Courier quote result" in final.text, "slot callback should produce quote result")
    assert_true("Free standard courier" in final.text, "inline flow should include decision options")
    assert_true(final.inline_keyboard == [[{"text": "Quote again", "callback_data": "quote|normal"}, {"text": "Debug quote", "callback_data": "quote|debug"}]], "result should expose restart buttons")


def test_debug_callback_starts_debug_flow() -> None:
    bot = make_bot()
    reply = bot.handle_callback(user_id=123, chat_id=456, data="quote|debug", now=NOW)[0]
    assert_true("postcode" in reply.text.lower(), "debug callback should start postcode step")
    assert_true(bot.conversations[456].debug is True, "debug callback should mark conversation as debug")


def test_unknown_callback_reprompts() -> None:
    bot = make_bot()
    reply = bot.handle_callback(user_id=123, chat_id=456, data="repair|iphone_screen", now=NOW)[0]
    assert_true("expired" in reply.text.lower(), "callback without conversation should explain expiry")
    assert_true(reply.inline_keyboard is not None, "expired callback should offer restart buttons")


def test_debug_flow_includes_calculations() -> None:
    bot = make_bot()
    send(bot, "debug")
    send(bot, "W1B 2EL")
    send(bot, "iPhone screen")
    send(bot, "Available")
    final = send(bot, "3")[0]
    assert_true("Debug:" in final.text, "debug flow should include debug section")
    assert_true("Target contribution" in final.text, "debug flow should include contribution data")


def test_group_command_suffix_starts_flow() -> None:
    bot = make_bot()
    reply = send(bot, "/quote@icorrectcourierbot")[0]
    assert_true("postcode" in reply.text.lower(), "group command with bot suffix should start quote flow")


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


def test_allowed_group_chat_can_use_bot() -> None:
    bot = CourierTelegramBot(allowed_chat_ids={-1004036696902})
    reply = send(bot, "/quote", chat_id=-1004036696902, user_id=999)[0]
    assert_true("postcode" in reply.text.lower(), "allowed chat should permit users in that chat")


def test_help_keyboard() -> None:
    bot = make_bot()
    reply = send(bot, "help")[0]
    assert_true("quote" in reply.text.lower(), "help should mention quote")
    assert_true(reply.inline_keyboard == [[{"text": "Quote", "callback_data": "quote|normal"}, {"text": "Debug", "callback_data": "quote|debug"}]], "help should expose inline quick commands")


def test_allowed_user_parser() -> None:
    assert_true(parse_allowed_user_ids("123, 456") == {123, 456}, "allowlist parser should handle comma list")
    assert_true(parse_allowed_user_ids("") == set(), "empty allowlist should parse as empty set")


def test_allowed_chat_parser() -> None:
    assert_true(parse_allowed_chat_ids("-1004036696902") == {-1004036696902}, "chat allowlist parser should support supergroups")
    assert_true(parse_allowed_chat_ids("") == set(), "empty chat allowlist should parse as empty set")


def test_command_normalisation() -> None:
    assert_true(normalise_command("/quote@icorrectcourierbot") == "quote", "bot suffix should be stripped")
    assert_true(normalise_command("quote") == "quote", "plain quote should stay quote")
    assert_true(normalise_command("/debug now please") == "debug", "command arguments should be ignored")


def test_thread_id_payload_is_preserved() -> None:
    payload: dict = {}

    class FakeTelegram:
        def send_reply(self, chat_id: int, reply: BotReply, message_thread_id: int | None = None) -> None:
            payload["chat_id"] = chat_id
            payload["text"] = reply.text
            payload["message_thread_id"] = message_thread_id

    fake = FakeTelegram()
    fake.send_reply(-1004036696902, BotReply("hello"), message_thread_id=2)
    assert_true(payload["message_thread_id"] == 2, "forum topic replies should preserve message_thread_id")


def test_inline_keyboard_payload_shape() -> None:
    payload = build_send_message_payload(
        -1004036696902,
        BotReply("Choose", inline_keyboard=[[{"text": "W1B", "callback_data": "postcode|W1B 2EL"}]]),
        message_thread_id=2,
    )
    assert_true(payload["message_thread_id"] == 2, "inline payload should preserve topic thread")
    assert_true(
        payload["reply_markup"] == {"inline_keyboard": [[{"text": "W1B", "callback_data": "postcode|W1B 2EL"}]]},
        "inline payload should use Telegram inline_keyboard markup",
    )


TESTS = [
    test_guided_quote_flow,
    test_inline_button_quote_flow,
    test_debug_callback_starts_debug_flow,
    test_unknown_callback_reprompts,
    test_debug_flow_includes_calculations,
    test_group_command_suffix_starts_flow,
    test_invalid_repair_reprompts,
    test_cancel_resets_flow,
    test_unauthorized_user_blocked,
    test_allowed_group_chat_can_use_bot,
    test_help_keyboard,
    test_allowed_user_parser,
    test_allowed_chat_parser,
    test_command_normalisation,
    test_thread_id_payload_is_preserved,
    test_inline_keyboard_payload_shape,
]


def main() -> int:
    for test in TESTS:
        test()
        print(f"PASS {test.__name__}")
    print(f"OK {len(TESTS)} Telegram fixture checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
