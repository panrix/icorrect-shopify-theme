#!/usr/bin/env python3
"""Fixture checks for the hosted courier quote lab prototype."""

from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from courier_decision_contract import DENIED_CONTRACT_TOKENS


ROOT = Path(__file__).resolve().parents[2]
PORT = 8768
BASE_URL = f"http://127.0.0.1:{PORT}"


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def get(path: str) -> tuple[int, str]:
    with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=5) as response:
        return response.status, response.read().decode("utf-8")


def post_json(path: str, payload: dict) -> tuple[int, dict]:
    request = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=5) as response:
        return response.status, json.loads(response.read().decode("utf-8"))


def start_server() -> subprocess.Popen:
    process = subprocess.Popen(
        [
            sys.executable,
            str(ROOT / "scripts/analysis/courier_quote_lab_server.py"),
            "--host",
            "127.0.0.1",
            "--port",
            str(PORT),
        ],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    for _ in range(40):
        try:
            status, _ = get("/health")
            if status == 200:
                return process
        except Exception:
            time.sleep(0.1)
    stderr = process.stderr.read() if process.stderr else ""
    process.terminate()
    raise RuntimeError(f"Server did not start: {stderr}")


def stop_server(process: subprocess.Popen) -> None:
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()


def test_static_lab_serves_quote_wizard() -> None:
    status, body = get("/courier/")
    assert_true(status == 200, "courier lab should serve HTML")
    assert_true("iCorrect" in body, "HTML should contain iCorrect title")
    assert_true("qw/QuoteWizard.jsx" in body, "HTML should load Claude quote wizard")


def test_decision_endpoint_returns_contract() -> None:
    status, payload = post_json(
        "/courier/api/decision",
        {
            "postcode": "W1B 2EL",
            "device": "iphone",
            "model": "iPhone 15 Pro",
            "fault": {"id": "screen", "label": "Screen / Display"},
            "issue": {"label": "Cracked glass (touch works)"},
            "stock": "available",
            "same_day_slots": 3,
            "action": "quote",
        },
    )
    assert_true(status == 200, "decision endpoint should return 200")
    assert_true(payload["mapped_repair_type"] == "iphone_screen", "iPhone screen should map to iphone_screen")
    assert_true(payload["contract"]["status"] == "ok", "central iPhone screen should be serviceable")
    assert_true(payload["contract"]["options"], "central iPhone screen should return courier options")


def test_macbook_power_maps_to_diagnostic() -> None:
    _, payload = post_json(
        "/courier/api/decision",
        {
            "postcode": "W1B 2EL",
            "device": "macbook",
            "model": "MacBook Pro 16",
            "fault": {"id": "battery", "label": "Power / Battery / Charging"},
            "issue": {"label": "Won't turn on"},
            "stock": "unknown",
            "same_day_slots": 3,
            "action": "quote",
        },
    )
    assert_true(payload["mapped_repair_type"] == "diagnostic", "MacBook won't turn on should be assessment-first")
    assert_true(payload["contract"]["repair"]["flow_type"] == "diagnostic", "contract should mark diagnostic flow")


def test_non_london_returns_manual_fallback() -> None:
    _, payload = post_json(
        "/courier/api/decision",
        {
            "postcode": "M1 1AE",
            "device": "iphone",
            "model": "iPhone 15",
            "fault": {"id": "screen", "label": "Screen / Display"},
            "issue": {"label": "Cracked glass (touch works)"},
            "stock": "available",
            "same_day_slots": 3,
            "action": "quote",
        },
    )
    assert_true(payload["contract"]["status"] == "manual_fallback", "non-London should be manual fallback")


def test_decision_payload_has_no_internal_tokens() -> None:
    _, payload = post_json(
        "/courier/api/decision",
        {
            "postcode": "W1B 2EL",
            "device": "iphone",
            "model": "iPhone 15",
            "fault": {"id": "screen", "label": "Screen / Display"},
            "issue": {"label": "Cracked glass (touch works)"},
            "stock": "available",
            "same_day_slots": 3,
            "action": "quote",
        },
    )
    rendered = json.dumps(payload, sort_keys=True).lower()
    for token in DENIED_CONTRACT_TOKENS:
        assert_true(token not in rendered, f"decision response leaked denied token: {token}")


def test_invalid_json_returns_400() -> None:
    request = urllib.request.Request(
        f"{BASE_URL}/courier/api/decision",
        data=b"{not-json",
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(request, timeout=5)
    except urllib.error.HTTPError as error:
        assert_true(error.code == 400, "invalid JSON should return 400")
        return
    raise AssertionError("invalid JSON unexpectedly succeeded")


TESTS = [
    test_static_lab_serves_quote_wizard,
    test_decision_endpoint_returns_contract,
    test_macbook_power_maps_to_diagnostic,
    test_non_london_returns_manual_fallback,
    test_decision_payload_has_no_internal_tokens,
    test_invalid_json_returns_400,
]


def main() -> int:
    process = start_server()
    try:
        for test in TESTS:
            test()
            print(f"PASS {test.__name__}")
    finally:
        stop_server(process)
    print(f"OK {len(TESTS)} quote lab checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
