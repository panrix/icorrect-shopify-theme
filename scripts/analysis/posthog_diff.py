#!/usr/bin/env python3
"""
Compare two PostHog snapshots. Produces a markdown diff highlighting
behavioural changes. Designed for "before vs after Claude Design change".

Usage:
    python3 scripts/analysis/posthog_diff.py \
        snapshots/2026-04-23-baseline-pre-design.json \
        snapshots/2026-05-07.json \
        --window 28 \
        --out reports/post-design-diff-2026-05-07.md

If --window is omitted, defaults to the smallest window common to both snapshots.
If --out is omitted, writes markdown to stdout.
"""

import argparse
import json
import pathlib
import sys


def delta(before, after):
    """Return (absolute_change, percent_change_str, direction_marker)."""
    if before is None or after is None:
        return None, "n/a", "·"
    diff = after - before
    if before == 0:
        if after == 0:
            return 0, "0%", "·"
        return diff, "new", "✨"
    pct = 100 * diff / before
    marker = "▲" if diff > 0 else "▼" if diff < 0 else "·"
    if abs(pct) >= 20:
        marker = "📈" if diff > 0 else "📉"
    return diff, f"{pct:+.1f}%", marker


def fmt_row(label, before, after):
    d, pct, marker = delta(before, after)
    before_s = "-" if before is None else f"{before:,}"
    after_s = "-" if after is None else f"{after:,}"
    return f"| {label} | {before_s} | {after_s} | {d:+,} | {pct} | {marker} |" if d is not None else \
           f"| {label} | {before_s} | {after_s} | - | {pct} | {marker} |"


def table(title, rows):
    out = [f"### {title}", "", "| Metric | Before | After | Δ | % | |", "|---|---|---|---|---|---|"]
    out.extend(rows)
    out.append("")
    return "\n".join(out)


def diff_wizard(before, after):
    rows = []
    all_events = sorted(set(before.get("wizard_event_counts", {})) |
                        set(after.get("wizard_event_counts", {})))
    for ev in all_events:
        rows.append(fmt_row(
            ev,
            before.get("wizard_event_counts", {}).get(ev),
            after.get("wizard_event_counts", {}).get(ev),
        ))
    return table("Wizard + checkout event counts", rows)


def diff_funnel_rates(before, after):
    """Derived wizard funnel conversion rates."""
    def rate(snap, num, den):
        n = snap.get("wizard_event_counts", {}).get(num, 0)
        d = snap.get("wizard_event_counts", {}).get(den, 0)
        return round(100 * n / d, 2) if d else None

    stages = [
        ("wizard_entry → wizard_step",        "wizard_step",       "wizard_entry"),
        ("wizard_step → wizard_resolution",   "wizard_resolution", "wizard_step"),
        ("wizard_resolution → wizard_conversion", "wizard_conversion", "wizard_resolution"),
        ("wizard_entry → wizard_conversion",  "wizard_conversion", "wizard_entry"),
        ("wizard_entry → Checkout Started",   "Checkout Started",  "wizard_entry"),
        ("Checkout Started → Payment Info",   "Checkout Step: Payment Info", "Checkout Started"),
    ]
    rows = []
    for label, num, den in stages:
        b = rate(before, num, den)
        a = rate(after, num, den)
        rows.append(fmt_row(label + " (%)", b, a))
    return table("Wizard / checkout funnel rates", rows)


def diff_frustration(before, after, top=15):
    """Top-N frustration pages, show dead/rage changes."""
    b_map = {x["path"]: x for x in before.get("frustration", [])}
    a_map = {x["path"]: x for x in after.get("frustration", [])}
    paths = sorted(set(b_map) | set(a_map), key=lambda p: -(
        (b_map.get(p, {}).get("dead_clicks", 0) + b_map.get(p, {}).get("rage_clicks", 0)) +
        (a_map.get(p, {}).get("dead_clicks", 0) + a_map.get(p, {}).get("rage_clicks", 0))
    ))[:top]
    rows = []
    for p in paths:
        b = b_map.get(p, {}); a = a_map.get(p, {})
        b_total = b.get("dead_clicks", 0) + b.get("rage_clicks", 0)
        a_total = a.get("dead_clicks", 0) + a.get("rage_clicks", 0)
        rows.append(fmt_row(f"`{p[:55]}`", b_total, a_total))
    return table("Dead + rage clicks per page (top 15)", rows)


def diff_bounce(before, after, top=15):
    b_map = {x["path"]: x for x in before.get("pages_bounce", [])}
    a_map = {x["path"]: x for x in after.get("pages_bounce", [])}
    paths = sorted(set(b_map) | set(a_map), key=lambda p: -(
        b_map.get(p, {}).get("sessions", 0) + a_map.get(p, {}).get("sessions", 0)
    ))[:top]
    rows = []
    for p in paths:
        b = b_map.get(p, {}); a = a_map.get(p, {})
        rows.append(fmt_row(f"`{p[:55]}` (bounce%)", b.get("bounce_pct"), a.get("bounce_pct")))
    return table("Bounce rate per landing page (top 15 by sessions)", rows)


def diff_duration(before, after, top=15):
    b_map = {x["path"]: x for x in before.get("pages_duration", [])}
    a_map = {x["path"]: x for x in after.get("pages_duration", [])}
    paths = sorted(set(b_map) | set(a_map), key=lambda p: -(
        b_map.get(p, {}).get("sessions", 0) + a_map.get(p, {}).get("sessions", 0)
    ))[:top]
    rows = []
    for p in paths:
        b = b_map.get(p, {}); a = a_map.get(p, {})
        rows.append(fmt_row(f"`{p[:55]}` (median s)", b.get("median_dur_s"), a.get("median_dur_s")))
    return table("Median session duration per landing page (top 15)", rows)


def diff_scroll(before, after, top=15):
    b_map = {x["path"]: x for x in before.get("scroll_reach", [])}
    a_map = {x["path"]: x for x in after.get("scroll_reach", [])}
    paths = sorted(set(b_map) | set(a_map))[:top]
    rows = []
    for p in paths:
        b = b_map.get(p, {}); a = a_map.get(p, {})
        rows.append(fmt_row(f"`{p[:40]}` reach_75",
                            b.get("scroll_depth_75"), a.get("scroll_depth_75")))
    if not paths:
        return ""
    return table("Scroll-to-75% reach per page (top 15)", rows)


def diff_session_duration(before, after):
    b = before.get("session_duration_buckets", {}) or {}
    a = after.get("session_duration_buckets", {}) or {}
    rows = [
        fmt_row("Total sessions", b.get("total"), a.get("total")),
        fmt_row("Under 5s", b.get("under_5s"), a.get("under_5s")),
        fmt_row("5–30s", b.get("s_5_30"), a.get("s_5_30")),
        fmt_row("30s–2min", b.get("s_30_120"), a.get("s_30_120")),
        fmt_row("2–10min", b.get("s_2_10m"), a.get("s_2_10m")),
        fmt_row("10min+", b.get("over_10m"), a.get("over_10m")),
        fmt_row("% under 30s", b.get("pct_under_30s"), a.get("pct_under_30s")),
        fmt_row("% over 2min", b.get("pct_over_2min"), a.get("pct_over_2min")),
    ]
    return table("Session duration distribution", rows)


def render_diff(before_snap, after_snap, window):
    b = before_snap["windows"].get(str(window), {})
    a = after_snap["windows"].get(str(window), {})
    if not b or not a:
        raise SystemExit(f"Window {window}d missing in one of the snapshots")

    lines = [
        f"# PostHog behaviour diff — {window}-day windows",
        "",
        f"- **Before:** `{before_snap['captured_at']}` (window_start {b.get('window_start_utc')})",
        f"- **After:**  `{after_snap['captured_at']}` (window_start {a.get('window_start_utc')})",
        "",
        "Markers: `▲` up  `▼` down  `📈` +20%+  `📉` -20%+  `✨` new data  `·` flat",
        "",
        diff_session_duration(b, a),
        diff_wizard(b, a),
        diff_funnel_rates(b, a),
        diff_frustration(b, a),
        diff_bounce(b, a),
        diff_duration(b, a),
        diff_scroll(b, a),
    ]
    return "\n".join(lines)


def pick_window(before, after, requested):
    b_windows = set(before["windows"])
    a_windows = set(after["windows"])
    common = sorted((int(w) for w in (b_windows & a_windows)))
    if not common:
        raise SystemExit(f"No common windows. before={sorted(b_windows)} after={sorted(a_windows)}")
    if requested:
        if str(requested) not in b_windows or str(requested) not in a_windows:
            raise SystemExit(f"Window {requested}d not in both snapshots; common={common}")
        return requested
    return common[0]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("before", help="baseline snapshot .json")
    ap.add_argument("after", help="current snapshot .json")
    ap.add_argument("--window", type=int, help="Window in days (defaults to smallest common)")
    ap.add_argument("--out", help="Write markdown to this path (default stdout)")
    args = ap.parse_args()

    before = json.loads(pathlib.Path(args.before).read_text())
    after = json.loads(pathlib.Path(args.after).read_text())
    window = pick_window(before, after, args.window)
    md = render_diff(before, after, window)

    if args.out:
        pathlib.Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        pathlib.Path(args.out).write_text(md)
        sys.stderr.write(f"[diff] wrote {args.out}\n")
    else:
        print(md)


if __name__ == "__main__":
    main()
