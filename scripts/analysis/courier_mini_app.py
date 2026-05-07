#!/usr/bin/env python3
"""Local browser mini app for the courier decision prototype."""

from __future__ import annotations

import argparse
import datetime as dt
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from courier_decision_engine import DEFAULT_FIXTURES, DecisionEngine, normalise_now


HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Courier Decision Lab</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #180047;
      --muted: #5f5a6f;
      --line: #ddd8e8;
      --accent: #5b18ff;
      --accent-soft: #f2ecff;
      --ok: #0a7a4f;
      --warn: #9c5b00;
      --bg: #faf9fc;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 28px 18px 40px;
    }
    h1 {
      margin: 0 0 6px;
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.04;
      letter-spacing: 0;
    }
    p { color: var(--muted); }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
      gap: 18px;
      align-items: start;
      margin-top: 22px;
    }
    .panel {
      background: white;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(28, 13, 55, 0.06);
    }
    .group { margin-top: 18px; }
    .group:first-child { margin-top: 0; }
    .label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0;
      margin-bottom: 8px;
    }
    input {
      width: 100%;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 0 12px;
      color: var(--ink);
      font-size: 16px;
    }
    .buttons {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .buttons.compact {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    button {
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 9px 10px;
      background: white;
      color: var(--ink);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    button:hover { border-color: var(--accent); }
    button.active {
      background: var(--accent-soft);
      border-color: var(--accent);
      color: var(--accent);
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 18px;
    }
    .actions button {
      flex: 1;
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }
    .actions button.secondary {
      background: white;
      color: var(--ink);
      border-color: var(--line);
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 12px;
    }
    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fff;
    }
    .metric span {
      display: block;
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .metric strong {
      display: block;
      overflow-wrap: anywhere;
      font-size: 15px;
    }
    .option {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      margin-top: 10px;
      background: #fff;
    }
    .option.same-day {
      border-color: rgba(10, 122, 79, 0.35);
      background: #f4fbf8;
    }
    .option h3 {
      margin: 0 0 8px;
      font-size: 18px;
    }
    .option dl {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 5px 10px;
      margin: 0;
      color: var(--muted);
    }
    .option dt { font-weight: 700; color: var(--ink); }
    .empty {
      border: 1px dashed var(--line);
      border-radius: 8px;
      padding: 24px;
      color: var(--muted);
      background: white;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #171022;
      color: #f7f3ff;
      border-radius: 8px;
      padding: 12px;
      font-size: 12px;
      line-height: 1.5;
      max-height: 360px;
      overflow: auto;
    }
    @media (max-width: 860px) {
      .layout { grid-template-columns: 1fr; }
      .summary { grid-template-columns: 1fr; }
    }
    @media (max-width: 460px) {
      main { padding: 20px 12px 32px; }
      .buttons, .buttons.compact { grid-template-columns: 1fr; }
      .option dl { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Courier Decision Lab</h1>
    <p>Click through postcode, repair, stock, and same-day capacity to test the local courier decision engine.</p>
    <div class="layout">
      <section class="panel" aria-label="Inputs">
        <div class="group">
          <div class="label">Postcode <span id="postcode-note"></span></div>
          <input id="postcode" autocomplete="postal-code" value="W1B 2EL">
          <div id="postcode-buttons" class="buttons" style="margin-top: 8px;"></div>
        </div>
        <div class="group">
          <div class="label">Repair</div>
          <div id="repair-buttons" class="buttons"></div>
        </div>
        <div class="group">
          <div class="label">Stock</div>
          <div id="stock-buttons" class="buttons"></div>
        </div>
        <div class="group">
          <div class="label">Same-day slots left</div>
          <div id="slot-buttons" class="buttons compact"></div>
        </div>
        <div class="group">
          <div class="label">Current time</div>
          <input id="now" value="2026-05-07T10:30:00+01:00">
        </div>
        <div class="actions">
          <button id="run">Run Decision</button>
          <button id="debug" class="secondary">Debug</button>
        </div>
      </section>
      <section aria-label="Results">
        <div id="result"></div>
      </section>
    </div>
  </main>
  <script>
    const state = {
      repair_type: "iphone_screen",
      stock: "available",
      same_day_slots: 3,
      debug: false
    };

    const labels = {
      iphone_screen: "iPhone screen",
      iphone_battery: "iPhone battery",
      iphone_camera_module: "iPhone camera",
      ipad_known_repair: "iPad repair",
      macbook_known_repair: "MacBook repair",
      back_glass: "Back glass",
      other_known_repair: "Other repair",
      diagnostic: "Diagnostic",
      available: "Available",
      unknown: "Unknown",
      unavailable: "Unavailable"
    };

    function button(label, active, onClick) {
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = label;
      if (active) el.classList.add("active");
      el.addEventListener("click", onClick);
      return el;
    }

    function renderChoiceButtons(target, values, key, labelFn = (value) => value) {
      const root = document.getElementById(target);
      root.innerHTML = "";
      values.forEach((value) => {
        root.appendChild(button(labelFn(value), state[key] === value, () => {
          state[key] = value;
          renderAll();
          runDecision(false);
        }));
      });
    }

    function renderPostcodes(postcodes) {
      const root = document.getElementById("postcode-buttons");
      root.innerHTML = "";
      postcodes.forEach((item) => {
        root.appendChild(button(item.id + " " + item.postcode, false, () => {
          document.getElementById("postcode").value = item.postcode;
          document.getElementById("postcode-note").textContent = item.band;
          runDecision(false);
        }));
      });
    }

    function renderAll() {
      renderChoiceButtons("repair-buttons", window.fixtures.repairs, "repair_type", (value) => labels[value] || value);
      renderChoiceButtons("stock-buttons", window.fixtures.stocks, "stock", (value) => labels[value] || value);
      renderChoiceButtons("slot-buttons", window.fixtures.slots, "same_day_slots", String);
    }

    async function runDecision(debug) {
      state.debug = debug;
      const payload = {
        postcode: document.getElementById("postcode").value,
        repair_type: state.repair_type,
        stock: state.stock,
        same_day_slots: state.same_day_slots,
        now: document.getElementById("now").value,
        debug
      };
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      renderResult(data);
    }

    function renderResult(data) {
      const root = document.getElementById("result");
      const options = data.options || [];
      root.innerHTML = `
        <div class="summary">
          <div class="metric"><span>Status</span><strong>${escapeHtml(data.status || "")}</strong></div>
          <div class="metric"><span>Band</span><strong>${escapeHtml(data.postcode_band || "n/a")}</strong></div>
          <div class="metric"><span>Quote</span><strong>${escapeHtml(data.quote_id || "n/a")}</strong></div>
        </div>
      `;
      if (data.turnaround_message) {
        const note = document.createElement("div");
        note.className = "panel";
        note.textContent = data.turnaround_message;
        root.appendChild(note);
      }
      if (!options.length) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "No options returned.";
        root.appendChild(empty);
      }
      options.forEach((option) => root.appendChild(renderOption(option)));
      if (data.debug) {
        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(data.debug, null, 2);
        root.appendChild(pre);
      }
    }

    function renderOption(option) {
      const el = document.createElement("article");
      el.className = "option" + (option.same_day_return ? " same-day" : "");
      el.innerHTML = `
        <h3>${escapeHtml(option.label)}</h3>
        <dl>
          <dt>Price</dt><dd>${option.customer_price_gross === null ? "Manual" : "£" + escapeHtml(option.customer_price_gross)}</dd>
          <dt>Collection</dt><dd>${escapeHtml(option.estimated_collection_window || "n/a")}</dd>
          <dt>Return</dt><dd>${escapeHtml(option.estimated_return_window || "n/a")}</dd>
          <dt>Same-day</dt><dd>${option.same_day_return ? "yes" : "no"}</dd>
          <dt>Variant</dt><dd>${escapeHtml(option.shopify_variant_id || "n/a")}</dd>
        </dl>
      `;
      if (option.customer_message) {
        const msg = document.createElement("p");
        msg.textContent = option.customer_message;
        el.appendChild(msg);
      }
      return el;
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char]));
    }

    async function init() {
      const res = await fetch("/api/fixtures");
      window.fixtures = await res.json();
      renderPostcodes(window.fixtures.postcodes);
      renderAll();
      document.getElementById("run").addEventListener("click", () => runDecision(false));
      document.getElementById("debug").addEventListener("click", () => runDecision(true));
      document.getElementById("postcode").addEventListener("change", () => runDecision(false));
      document.getElementById("now").addEventListener("change", () => runDecision(false));
      runDecision(false);
    }

    init().catch((error) => {
      document.getElementById("result").innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
    });
  </script>
</body>
</html>
"""


class CourierMiniAppHandler(BaseHTTPRequestHandler):
    server_version = "CourierMiniApp/0.1"

    def do_GET(self) -> None:
        if self.path == "/" or self.path.startswith("/?"):
            self.send_text(HTML, "text/html; charset=utf-8")
            return
        if self.path == "/api/fixtures":
            self.send_json(build_fixture_payload(self.server.engine))  # type: ignore[attr-defined]
            return
        self.send_json({"status": "error", "message": "Not found"}, status=HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        if self.path != "/api/decision":
            self.send_json({"status": "error", "message": "Not found"}, status=HTTPStatus.NOT_FOUND)
            return
        try:
            payload = self.read_json()
            result = run_decision(self.server.engine, payload)  # type: ignore[attr-defined]
        except (ValueError, TypeError) as exc:
            self.send_json({"status": "error", "message": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            return
        self.send_json(result)

    def read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid JSON request body.") from exc
        if not isinstance(payload, dict):
            raise ValueError("JSON request body must be an object.")
        return payload

    def send_text(self, body: str, content_type: str, status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)

    def send_json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, indent=2, sort_keys=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, format: str, *args: Any) -> None:
        return


def build_fixture_payload(engine: DecisionEngine) -> dict[str, Any]:
    repairs = list(engine.repair_fixtures)
    return {
        "postcodes": engine.fixtures["postcode_fixtures"],
        "repairs": repairs,
        "stocks": ["available", "unknown", "unavailable"],
        "slots": engine.fixtures["same_day_slots"],
    }


def run_decision(engine: DecisionEngine, payload: dict[str, Any]) -> dict[str, Any]:
    now_raw = payload.get("now") or dt.datetime.now(tz=engine_now_tz()).isoformat()
    now = normalise_now(dt.datetime.fromisoformat(str(now_raw)))
    return engine.decide(
        postcode=str(payload.get("postcode", "")),
        repair_type=str(payload.get("repair_type", "iphone_screen")),
        stock=str(payload.get("stock", "unknown")),
        now=now,
        same_day_slots=int(payload.get("same_day_slots", 3)),
        action=str(payload.get("action", "quote")),
        target_contribution=engine.default_target_contribution,
        debug=bool(payload.get("debug", False)),
    )


def engine_now_tz() -> dt.tzinfo:
    return dt.timezone(dt.timedelta(hours=1))


def create_server(host: str, port: int) -> ThreadingHTTPServer:
    server = ThreadingHTTPServer((host, port), CourierMiniAppHandler)
    server.engine = DecisionEngine()  # type: ignore[attr-defined]
    return server


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the local courier decision mini app.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    server = create_server(args.host, args.port)
    url = f"http://{args.host}:{server.server_port}"
    print(f"Courier mini app running at {url}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Stopped.", flush=True)
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
