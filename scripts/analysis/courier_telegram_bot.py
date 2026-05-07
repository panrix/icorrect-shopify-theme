#!/usr/bin/env python3
"""Telegram prototype wrapper for the local courier decision engine.

This is an internal ops prototype. It uses Telegram long polling when run with
TELEGRAM_BOT_TOKEN, keeps conversation state in memory, and never calls Gophr
or Shopify directly.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any

from courier_decision_engine import DecisionEngine, LONDON_TZ, normalise_now


REPAIR_LABELS = {
    "iPhone screen": "iphone_screen",
    "iPhone battery": "iphone_battery",
    "iPhone camera module": "iphone_camera_module",
    "iPad known repair": "ipad_known_repair",
    "MacBook known repair": "macbook_known_repair",
    "Back glass": "back_glass",
    "Diagnostic": "diagnostic",
}
STOCK_LABELS = {
    "Available": "available",
    "Unknown": "unknown",
    "Unavailable": "unavailable",
}
SLOT_LABELS = {"3": 3, "2": 2, "1": 1, "0": 0}


@dataclass
class Conversation:
    step: str = "idle"
    debug: bool = False
    postcode: str = ""
    repair_type: str = ""
    stock: str = ""
    same_day_slots: int = 3


@dataclass
class BotReply:
    text: str
    keyboard: list[list[str]] | None = None
    inline_keyboard: list[list[dict[str, str]]] | None = None
    remove_keyboard: bool = False


@dataclass
class CourierTelegramBot:
    engine: DecisionEngine = field(default_factory=DecisionEngine)
    allowed_user_ids: set[int] = field(default_factory=set)
    allowed_chat_ids: set[int] = field(default_factory=set)
    allow_all: bool = False
    conversations: dict[int, Conversation] = field(default_factory=dict)

    def handle_message(self, user_id: int, chat_id: int, text: str, now: dt.datetime | None = None) -> list[BotReply]:
        now = normalise_now(now or dt.datetime.now(tz=LONDON_TZ))
        text = text.strip()
        command = normalise_command(text)

        if not self.is_allowed(user_id, chat_id):
            return [BotReply("This courier prototype is restricted to approved internal users.")]

        if command in {"start", "help"}:
            self.conversations.pop(chat_id, None)
            return [help_reply()]

        if command == "cancel":
            self.conversations.pop(chat_id, None)
            return [BotReply("Quote flow cancelled.", remove_keyboard=True)]

        if command in {"quote", "debug"}:
            conversation = Conversation(step="postcode", debug=command == "debug")
            self.conversations[chat_id] = conversation
            return [postcode_reply(self.engine)]

        conversation = self.conversations.get(chat_id)
        if not conversation:
            return [BotReply("Type quote to start a courier quote, or debug to include local calculation details.")]

        if conversation.step == "postcode":
            conversation.postcode = text
            conversation.step = "repair"
            return [repair_reply()]

        if conversation.step == "repair":
            repair_type = REPAIR_LABELS.get(text)
            if not repair_type:
                return [BotReply("Please choose one of the repair buttons.", keyboard=chunked(list(REPAIR_LABELS), 2), inline_keyboard=repair_keyboard())]
            conversation.repair_type = repair_type
            conversation.step = "stock"
            return [stock_reply()]

        if conversation.step == "stock":
            stock = STOCK_LABELS.get(text)
            if not stock:
                return [BotReply("Please choose a stock state.", keyboard=[list(STOCK_LABELS)], inline_keyboard=stock_keyboard())]
            conversation.stock = stock
            conversation.step = "slots"
            return [slots_reply()]

        if conversation.step == "slots":
            if text not in SLOT_LABELS:
                return [BotReply("Please choose the remaining same-day slots.", keyboard=[list(SLOT_LABELS)], inline_keyboard=slots_keyboard())]
            conversation.same_day_slots = SLOT_LABELS[text]
            result = self.engine.decide(
                postcode=conversation.postcode,
                repair_type=conversation.repair_type,
                stock=conversation.stock,
                now=now,
                same_day_slots=conversation.same_day_slots,
                target_contribution=self.engine.default_target_contribution,
                debug=conversation.debug,
            )
            self.conversations.pop(chat_id, None)
            return [BotReply(format_decision(result, conversation), inline_keyboard=restart_keyboard(), remove_keyboard=True)]

        self.conversations.pop(chat_id, None)
        return [BotReply("Something went out of step. Type quote to start again.", remove_keyboard=True)]

    def handle_callback(
        self,
        user_id: int,
        chat_id: int,
        data: str,
        now: dt.datetime | None = None,
    ) -> list[BotReply]:
        now = normalise_now(now or dt.datetime.now(tz=LONDON_TZ))
        action, _, value = data.partition("|")

        if not self.is_allowed(user_id, chat_id):
            return [BotReply("This courier prototype is restricted to approved internal users.")]

        if action == "quote":
            conversation = Conversation(step="postcode", debug=value == "debug")
            self.conversations[chat_id] = conversation
            return [postcode_reply(self.engine)]

        if action == "custom_postcode":
            conversation = self.conversations.get(chat_id) or Conversation(step="postcode")
            conversation.step = "postcode"
            self.conversations[chat_id] = conversation
            return [BotReply("Type the postcode you want to test.")]

        if action == "cancel":
            self.conversations.pop(chat_id, None)
            return [BotReply("Quote flow cancelled.", inline_keyboard=restart_keyboard(), remove_keyboard=True)]

        conversation = self.conversations.get(chat_id)
        if not conversation:
            return [BotReply("This quote flow has expired. Start a fresh one.", inline_keyboard=restart_keyboard())]

        if action == "postcode":
            conversation.postcode = value
            conversation.step = "repair"
            return [repair_reply()]

        if action == "repair":
            if value not in set(REPAIR_LABELS.values()):
                return [repair_reply("Please choose one of the repair buttons.")]
            conversation.repair_type = value
            conversation.step = "stock"
            return [stock_reply()]

        if action == "stock":
            if value not in set(STOCK_LABELS.values()):
                return [stock_reply("Please choose a stock state.")]
            conversation.stock = value
            conversation.step = "slots"
            return [slots_reply()]

        if action == "slots":
            if value not in SLOT_LABELS:
                return [slots_reply("Please choose the remaining same-day slots.")]
            conversation.same_day_slots = SLOT_LABELS[value]
            result = self.engine.decide(
                postcode=conversation.postcode,
                repair_type=conversation.repair_type,
                stock=conversation.stock,
                now=now,
                same_day_slots=conversation.same_day_slots,
                target_contribution=self.engine.default_target_contribution,
                debug=conversation.debug,
            )
            self.conversations.pop(chat_id, None)
            return [BotReply(format_decision(result, conversation), inline_keyboard=restart_keyboard(), remove_keyboard=True)]

        return [BotReply("I did not recognise that button. Start a fresh quote.", inline_keyboard=restart_keyboard())]

    def is_allowed(self, user_id: int, chat_id: int) -> bool:
        return self.allow_all or user_id in self.allowed_user_ids or chat_id in self.allowed_chat_ids


def help_reply() -> BotReply:
    return BotReply(
        "Courier prototype\n\n"
        "Tap Quote to run the courier decision flow.\n"
        "Tap Debug to include local calculation details.\n"
        "You can still type a custom postcode when the flow asks for one.\n"
        "Type cancel to stop the current flow.",
        inline_keyboard=[[inline_button("Quote", "quote|normal"), inline_button("Debug", "quote|debug")]],
    )


def postcode_reply(engine: DecisionEngine) -> BotReply:
    return BotReply(
        "Choose a postcode fixture, or type a postcode manually.",
        inline_keyboard=postcode_keyboard(engine),
        remove_keyboard=True,
    )


def repair_reply(text: str = "What repair type?") -> BotReply:
    return BotReply(text, keyboard=chunked(list(REPAIR_LABELS), 2), inline_keyboard=repair_keyboard())


def stock_reply(text: str = "Is the required part in stock?") -> BotReply:
    return BotReply(text, keyboard=[list(STOCK_LABELS)], inline_keyboard=stock_keyboard())


def slots_reply(text: str = "How many same-day slots are left today?") -> BotReply:
    return BotReply(text, keyboard=[list(SLOT_LABELS)], inline_keyboard=slots_keyboard())


def inline_button(text: str, callback_data: str) -> dict[str, str]:
    return {"text": text, "callback_data": callback_data}


def postcode_keyboard(engine: DecisionEngine) -> list[list[dict[str, str]]]:
    buttons = [
        inline_button(f"{fixture['id']} {fixture['postcode']}", f"postcode|{fixture['postcode']}")
        for fixture in engine.fixtures["postcode_fixtures"]
    ]
    buttons.append(inline_button("Type custom postcode", "custom_postcode|"))
    buttons.append(inline_button("Cancel", "cancel|"))
    return chunked(buttons, 2)


def repair_keyboard() -> list[list[dict[str, str]]]:
    buttons = [inline_button(label, f"repair|{value}") for label, value in REPAIR_LABELS.items()]
    buttons.append(inline_button("Cancel", "cancel|"))
    return chunked(buttons, 2)


def stock_keyboard() -> list[list[dict[str, str]]]:
    return [[inline_button(label, f"stock|{value}") for label, value in STOCK_LABELS.items()], [inline_button("Cancel", "cancel|")]]


def slots_keyboard() -> list[list[dict[str, str]]]:
    return [[inline_button(label, f"slots|{value}") for label, value in SLOT_LABELS.items()], [inline_button("Cancel", "cancel|")]]


def restart_keyboard() -> list[list[dict[str, str]]]:
    return [[inline_button("Quote again", "quote|normal"), inline_button("Debug quote", "quote|debug")]]


def format_decision(result: dict[str, Any], conversation: Conversation) -> str:
    lines = [
        "Courier quote result",
        f"Postcode: {conversation.postcode}",
        f"Repair: {repair_label(conversation.repair_type)}",
        f"Stock: {conversation.stock}",
        f"Slots: {conversation.same_day_slots}",
        f"Status: {result.get('status')}",
    ]
    if result.get("postcode_band"):
        lines.append(f"Band: {result['postcode_band']}")
    if result.get("turnaround_message"):
        lines.extend(["", result["turnaround_message"]])

    lines.append("")
    lines.append("Options:")
    for option in result.get("options", []):
        lines.append(f"- {option['label']}")
        price = option.get("customer_price_gross")
        if price is not None:
            lines.append(f"  Price: £{price}")
        if option.get("customer_message"):
            lines.append(f"  {option['customer_message']}")
        if option.get("estimated_collection_window"):
            lines.append(f"  Collection: {option['estimated_collection_window']}")
        if option.get("estimated_return_window"):
            lines.append(f"  Return: {option['estimated_return_window']}")
        lines.append(f"  Same-day return: {'yes' if option.get('same_day_return') else 'no'}")
        lines.append(f"  Variant: {option.get('shopify_variant_id')}")

    reservation = result.get("reservation") or {}
    lines.extend(
        [
            "",
            f"Slot reserved: {'yes' if reservation.get('slot_reserved') else 'no'}",
            f"Quote ID: {result.get('quote_id')}",
        ]
    )

    if conversation.debug and result.get("debug"):
        lines.extend(["", "Debug:"])
        debug = result["debug"]
        lines.append(f"Target contribution: £{debug.get('target_contribution')}")
        lines.append(f"Same-day possible: {'yes' if debug.get('same_day_possible') else 'no'}")
        for calculation in debug.get("calculations", []):
            lines.append(
                f"- {calculation['service_level']}: "
                f"one-way £{calculation['one_way_cost_gross']}, "
                f"two-way £{calculation['two_way_cost_gross']}"
            )
            for attempt in calculation.get("attempts", []):
                marker = "pass" if attempt["passes"] else "fail"
                lines.append(
                    f"  charge £{attempt['customer_charge_gross']} -> "
                    f"contribution £{attempt['contribution_after_logistics']} ({marker})"
                )

    return "\n".join(lines)


def repair_label(repair_type: str) -> str:
    for label, value in REPAIR_LABELS.items():
        if value == repair_type:
            return label
    return repair_type


def chunked(items: list[str], size: int) -> list[list[str]]:
    return [items[index : index + size] for index in range(0, len(items), size)]


def normalise_command(text: str) -> str:
    first_token = text.strip().split(maxsplit=1)[0].lower() if text.strip() else ""
    if first_token.startswith("/"):
        first_token = first_token[1:]
    if "@" in first_token:
        first_token = first_token.split("@", 1)[0]
    return first_token


class TelegramClient:
    def __init__(self, token: str):
        self.base_url = f"https://api.telegram.org/bot{token}"

    def get_updates(self, offset: int | None, timeout: int) -> list[dict[str, Any]]:
        params = {"timeout": str(timeout)}
        if offset is not None:
            params["offset"] = str(offset)
        url = f"{self.base_url}/getUpdates?{urllib.parse.urlencode(params)}"
        with urllib.request.urlopen(url, timeout=timeout + 5) as response:
            payload = json.loads(response.read().decode("utf-8"))
        if not payload.get("ok"):
            raise RuntimeError(f"Telegram getUpdates failed: {payload}")
        return payload.get("result", [])

    def send_reply(self, chat_id: int, reply: BotReply, message_thread_id: int | None = None) -> None:
        payload = build_send_message_payload(chat_id, reply, message_thread_id)
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}/sendMessage",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
        if not payload.get("ok"):
            raise RuntimeError(f"Telegram sendMessage failed: {payload}")

    def answer_callback_query(self, callback_query_id: str) -> None:
        data = json.dumps({"callback_query_id": callback_query_id}).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}/answerCallbackQuery",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
        if not payload.get("ok"):
            raise RuntimeError(f"Telegram answerCallbackQuery failed: {payload}")


def build_send_message_payload(chat_id: int, reply: BotReply, message_thread_id: int | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"chat_id": chat_id, "text": reply.text}
    if message_thread_id is not None:
        payload["message_thread_id"] = message_thread_id
    if reply.inline_keyboard:
        payload["reply_markup"] = {"inline_keyboard": reply.inline_keyboard}
    elif reply.keyboard:
        payload["reply_markup"] = {
            "keyboard": [[{"text": label} for label in row] for row in reply.keyboard],
            "one_time_keyboard": True,
            "resize_keyboard": True,
        }
    elif reply.remove_keyboard:
        payload["reply_markup"] = {"remove_keyboard": True}
    return payload


def parse_allowed_user_ids(raw: str) -> set[int]:
    if not raw.strip():
        return set()
    return {int(value.strip()) for value in raw.split(",") if value.strip()}


def parse_allowed_chat_ids(raw: str) -> set[int]:
    if not raw.strip():
        return set()
    return {int(value.strip()) for value in raw.split(",") if value.strip()}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the internal courier Telegram prototype.")
    parser.add_argument("--token", default=os.environ.get("TELEGRAM_BOT_TOKEN", ""))
    parser.add_argument("--allowed-user-ids", default=os.environ.get("TELEGRAM_ALLOWED_USER_IDS", ""))
    parser.add_argument("--allowed-chat-ids", default=os.environ.get("TELEGRAM_ALLOWED_CHAT_IDS", ""))
    parser.add_argument("--allow-all", action="store_true", default=os.environ.get("TELEGRAM_ALLOW_ALL") == "1")
    parser.add_argument("--poll-timeout", type=int, default=30)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.token:
        raise SystemExit("Set TELEGRAM_BOT_TOKEN or pass --token.")
    allowed_user_ids = parse_allowed_user_ids(args.allowed_user_ids)
    allowed_chat_ids = parse_allowed_chat_ids(args.allowed_chat_ids)
    if not allowed_user_ids and not allowed_chat_ids and not args.allow_all:
        raise SystemExit("Set TELEGRAM_ALLOWED_USER_IDS, TELEGRAM_ALLOWED_CHAT_IDS, or pass --allow-all for local testing.")

    telegram = TelegramClient(args.token)
    bot = CourierTelegramBot(
        allowed_user_ids=allowed_user_ids,
        allowed_chat_ids=allowed_chat_ids,
        allow_all=args.allow_all,
    )
    offset: int | None = None
    print("Courier Telegram prototype polling. Press Ctrl+C to stop.", flush=True)
    while True:
        try:
            updates = telegram.get_updates(offset=offset, timeout=args.poll_timeout)
            for update in updates:
                offset = update["update_id"] + 1
                callback_query = update.get("callback_query") or {}
                if callback_query:
                    callback_id = callback_query.get("id")
                    data = callback_query.get("data")
                    message = callback_query.get("message") or {}
                    chat = message.get("chat") or {}
                    user = callback_query.get("from") or {}
                    if callback_id:
                        telegram.answer_callback_query(str(callback_id))
                    if not data or "id" not in chat or "id" not in user:
                        continue
                    message_thread_id = message.get("message_thread_id")
                    for reply in bot.handle_callback(
                        user_id=int(user["id"]),
                        chat_id=int(chat["id"]),
                        data=str(data),
                    ):
                        telegram.send_reply(int(chat["id"]), reply, message_thread_id=message_thread_id)
                    continue

                message = update.get("message") or {}
                text = message.get("text")
                chat = message.get("chat") or {}
                user = message.get("from") or {}
                if not text or "id" not in chat or "id" not in user:
                    continue
                message_thread_id = message.get("message_thread_id")
                for reply in bot.handle_message(user_id=int(user["id"]), chat_id=int(chat["id"]), text=text):
                    telegram.send_reply(int(chat["id"]), reply, message_thread_id=message_thread_id)
        except KeyboardInterrupt:
            print("Stopped.")
            return 0
        except (urllib.error.URLError, RuntimeError) as exc:
            print(f"Telegram polling error: {exc}", flush=True)
            time.sleep(3)


if __name__ == "__main__":
    raise SystemExit(main())
