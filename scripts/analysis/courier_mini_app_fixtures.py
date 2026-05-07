#!/usr/bin/env python3
"""No-browser fixture checks for the courier mini app prototype."""

from __future__ import annotations

import json
import threading
import urllib.error
import urllib.request

from courier_mini_app import create_server


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


class TestServer:
    def __init__(self):
        self.server = create_server("127.0.0.1", 0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.base_url = f"http://127.0.0.1:{self.server.server_port}"

    def __enter__(self):
        self.thread.start()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=5)

    def get_json(self, path: str) -> dict:
        with urllib.request.urlopen(f"{self.base_url}{path}", timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))

    def post_json(self, path: str, payload: dict) -> dict:
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))


def test_index_serves_html() -> None:
    with TestServer() as server:
        with urllib.request.urlopen(f"{server.base_url}/", timeout=10) as response:
            body = response.read().decode("utf-8")
        assert_true(response.status == 200, "index should return HTTP 200")
        assert_true("Courier Decision Lab" in body, "index should render mini app shell")
        assert_true("/api/decision" in body, "index should wire decision API")


def test_fixtures_endpoint_contains_button_data() -> None:
    with TestServer() as server:
        data = server.get_json("/api/fixtures")
    assert_true(any(item["postcode"] == "W1B 2EL" for item in data["postcodes"]), "fixtures should include W1B")
    assert_true("iphone_screen" in data["repairs"], "fixtures should include iPhone screen")
    assert_true(data["stocks"] == ["available", "unknown", "unavailable"], "fixtures should expose stock buttons")
    assert_true(data["slots"] == [3, 2, 1, 0], "fixtures should expose slot buttons")


def test_decision_endpoint_returns_customer_safe_options() -> None:
    with TestServer() as server:
        data = server.post_json(
            "/api/decision",
            {
                "postcode": "W1B 2EL",
                "repair_type": "iphone_screen",
                "stock": "available",
                "same_day_slots": 3,
                "now": "2026-05-07T10:30:00+01:00",
            },
        )
    assert_true(data["status"] == "ok", "central screen quote should be ok")
    assert_true(any(option["label"] == "Free standard courier" for option in data["options"]), "should include free standard")
    rendered = json.dumps(data).lower()
    for token in (
        "_repair_flow_type",
        "gophr_api_key",
        "gophr_raw_response",
        "net_contribution",
        "courier_subsidy",
        "courier_margin",
    ):
        assert_true(token not in rendered, f"decision response leaked {token}")


def test_invalid_post_body_returns_400() -> None:
    with TestServer() as server:
        request = urllib.request.Request(
            f"{server.base_url}/api/decision",
            data=b"{not json",
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            urllib.request.urlopen(request, timeout=10)
        except urllib.error.HTTPError as exc:
            assert_true(exc.code == 400, "invalid JSON should return HTTP 400")
            payload = json.loads(exc.read().decode("utf-8"))
            assert_true(payload["status"] == "error", "invalid JSON should return error payload")
        else:
            raise AssertionError("invalid JSON should fail")


TESTS = [
    test_index_serves_html,
    test_fixtures_endpoint_contains_button_data,
    test_decision_endpoint_returns_customer_safe_options,
    test_invalid_post_body_returns_400,
]


def main() -> int:
    for test in TESTS:
        test()
        print(f"PASS {test.__name__}")
    print(f"OK {len(TESTS)} courier mini app checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
