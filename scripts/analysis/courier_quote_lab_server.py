#!/usr/bin/env python3
"""HTTP server for the internal iCorrect courier quote lab."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import mimetypes
import posixpath
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

from courier_decision_contract import build_contract
from courier_decision_engine import LONDON_TZ


REPO_ROOT = Path(__file__).resolve().parents[2]
LAB_ROOT = REPO_ROOT / "docs/mockups/icorrect-courier-quote-lab-2026-05-23"
DEFAULT_NOW = "2026-05-06T10:30:00+01:00"


def map_repair_type(device: str, fault: dict[str, Any], issue: dict[str, Any]) -> str:
    device = (device or "").strip().lower()
    fault_id = str(fault.get("id") or "").strip().lower()
    fault_label = str(fault.get("label") or "").strip().lower()
    issue_label = str(issue.get("label") or "").strip().lower()
    joined = f"{fault_id} {fault_label} {issue_label}"

    if device == "iphone":
        if "camera" in joined:
            return "iphone_camera_module"
        if "rear glass" in joined or "back glass" in joined or fault_id == "glass":
            return "back_glass"
        if "battery" in joined or "drains fast" in joined or "swollen battery" in joined:
            return "iphone_battery"
        if "screen" in joined or "display" in joined or "touch" in joined or "green line" in joined:
            return "iphone_screen"
        return "diagnostic"

    if device == "ipad":
        if "screen" in joined or "display" in joined or "battery" in joined or "charging" in joined:
            return "ipad_known_repair"
        return "diagnostic"

    if device == "macbook":
        if "screen" in joined or "display" in joined:
            return "macbook_known_repair"
        return "diagnostic"

    return "diagnostic"


def parse_now(value: str | None) -> dt.datetime:
    raw = value or DEFAULT_NOW
    parsed = dt.datetime.fromisoformat(raw)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=LONDON_TZ)
    return parsed.astimezone(LONDON_TZ)


def build_lab_decision(payload: dict[str, Any]) -> dict[str, Any]:
    fault = payload.get("fault") if isinstance(payload.get("fault"), dict) else {}
    issue = payload.get("issue") if isinstance(payload.get("issue"), dict) else {}
    mapped_repair_type = map_repair_type(str(payload.get("device") or ""), fault, issue)
    same_day_slots = int(payload.get("same_day_slots", 3))
    contract = build_contract(
        postcode=str(payload.get("postcode") or ""),
        repair_type=mapped_repair_type,
        stock=str(payload.get("stock") or "unknown"),
        now=parse_now(payload.get("now")),
        same_day_slots=same_day_slots,
        action=str(payload.get("action") or "quote"),
    )
    return {
        "mapped_repair_type": mapped_repair_type,
        "input_summary": {
            "device": payload.get("device"),
            "model": payload.get("model"),
            "fault": fault.get("label") or fault.get("id"),
            "issue": issue.get("label"),
            "stock": payload.get("stock") or "unknown",
            "same_day_slots": same_day_slots,
            "action": payload.get("action") or "quote",
        },
        "contract": contract,
    }


class CourierQuoteLabHandler(BaseHTTPRequestHandler):
    server_version = "iCorrectCourierQuoteLab/0.1"

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path in {"/health", "/courier/health"}:
            self.write_json({"status": "ok"})
            return
        self.serve_static(parsed.path)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path not in {"/api/decision", "/courier/api/decision"}:
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length).decode("utf-8")
            payload = json.loads(body)
            if not isinstance(payload, dict):
                raise ValueError("JSON body must be an object")
        except Exception as exc:
            self.write_json({"error": f"Invalid JSON body: {exc}"}, status=HTTPStatus.BAD_REQUEST)
            return
        self.write_json(build_lab_decision(payload))

    def serve_static(self, raw_path: str) -> None:
        if raw_path in {"", "/", "/courier", "/courier/"}:
            relative_path = "index.html"
        else:
            relative_path = raw_path
            if relative_path.startswith("/courier/"):
                relative_path = relative_path[len("/courier/") :]
            elif relative_path.startswith("/"):
                relative_path = relative_path[1:]
        normalised = posixpath.normpath(unquote(relative_path))
        if normalised.startswith("../") or normalised == "..":
            self.send_error(HTTPStatus.FORBIDDEN, "Forbidden")
            return
        candidate = (LAB_ROOT / normalised).resolve()
        if not str(candidate).startswith(str(LAB_ROOT.resolve())):
            self.send_error(HTTPStatus.FORBIDDEN, "Forbidden")
            return
        if candidate.is_dir():
            candidate = candidate / "index.html"
        if not candidate.exists() or not candidate.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return

        content_type, _ = mimetypes.guess_type(str(candidate))
        if candidate.suffix == ".jsx":
            content_type = "text/babel; charset=utf-8"
        elif candidate.suffix in {".js", ".css", ".html"}:
            content_type = f"{content_type or 'text/plain'}; charset=utf-8"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        with candidate.open("rb") as handle:
            self.wfile.write(handle.read())

    def write_json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        rendered = json.dumps(payload, indent=2, sort_keys=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(rendered)))
        self.end_headers()
        self.wfile.write(rendered)

    def log_message(self, format: str, *args: Any) -> None:
        print(f"{self.address_string()} - {format % args}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the iCorrect courier quote lab server.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8055)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    server = ThreadingHTTPServer((args.host, args.port), CourierQuoteLabHandler)
    print(f"Serving courier quote lab on http://{args.host}:{args.port}/courier/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
