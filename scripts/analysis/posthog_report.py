#!/usr/bin/env python3
"""
Render a single PostHog snapshot JSON as a readable markdown report.

Usage:
    python3 scripts/analysis/posthog_report.py snapshots/2026-04-23-baseline-pre-design.json \
        --window 28 \
        --out reports/baseline-2026-04-23.md
"""

import argparse
import json
import pathlib
import sys


def fmt(n):
    if n is None:
        return "-"
    if isinstance(n, float):
        return f"{n:.1f}" if not n.is_integer() else f"{int(n):,}"
    if isinstance(n, int):
        return f"{n:,}"
    return str(n)


def render(snap, window):
    w = snap["windows"].get(str(window))
    if not w:
        raise SystemExit(f"Window {window}d missing. Available: {sorted(snap['windows'])}")

    wec = w.get("wizard_event_counts", {})
    sd = w.get("session_duration_buckets", {}) or {}

    out = [
        f"# PostHog behaviour report — {window}-day window",
        "",
        f"- Snapshot: `{snap['captured_at']}`",
        f"- Window: {window} days (start `{w.get('window_start_utc')}`)",
        f"- Host: `{snap.get('host','?')}`  Project: `{snap.get('posthog_project_id','?')}`",
        "",
        "## Session volume + quality",
        "",
        f"- Total sessions: **{fmt(sd.get('total'))}**",
        f"- Under 5s: {fmt(sd.get('under_5s'))}  ({round(100*(sd.get('under_5s') or 0)/(sd.get('total') or 1),1)}%)",
        f"- 5–30s: {fmt(sd.get('s_5_30'))}",
        f"- 30s–2min: {fmt(sd.get('s_30_120'))}",
        f"- 2–10min: {fmt(sd.get('s_2_10m'))}",
        f"- 10min+: {fmt(sd.get('over_10m'))}",
        f"- **% under 30s: {fmt(sd.get('pct_under_30s'))}%**",
        f"- % over 2min: {fmt(sd.get('pct_over_2min'))}%",
        "",
        "## Wizard funnel",
        "",
        f"- wizard_entry: **{fmt(wec.get('wizard_entry'))}**",
        f"- wizard_step: {fmt(wec.get('wizard_step'))}",
        f"- wizard_resolution: {fmt(wec.get('wizard_resolution'))}",
        f"- wizard_abandoned: {fmt(wec.get('wizard_abandoned'))}",
        f"- wizard_conversion: **{fmt(wec.get('wizard_conversion'))}**",
        f"- Checkout Started: {fmt(wec.get('Checkout Started'))}",
        f"- Checkout Step: Contact Info: {fmt(wec.get('Checkout Step: Contact Info'))}",
        f"- Checkout Step: Shipping Info: {fmt(wec.get('Checkout Step: Shipping Info'))}",
        f"- Checkout Step: Payment Info: {fmt(wec.get('Checkout Step: Payment Info'))}",
        f"- purchase_completed (new pixel): {fmt(wec.get('purchase_completed'))}",
        f"- Order Completed (legacy): {fmt(wec.get('Order Completed'))}",
        "",
    ]

    # Derived rates
    def rate(num, den):
        n = wec.get(num, 0); d = wec.get(den, 0)
        return f"{round(100*n/d, 2)}%" if d else "n/a"

    out.extend([
        "### Derived funnel rates",
        "",
        f"- wizard_entry → wizard_step: **{rate('wizard_step','wizard_entry')}**",
        f"- wizard_step → wizard_resolution: **{rate('wizard_resolution','wizard_step')}**",
        f"- wizard_resolution → wizard_conversion: **{rate('wizard_conversion','wizard_resolution')}**",
        f"- wizard_entry → wizard_conversion: {rate('wizard_conversion','wizard_entry')}",
        f"- wizard_entry → Checkout Started: {rate('Checkout Started','wizard_entry')}",
        f"- Checkout Started → Payment Info: {rate('Checkout Step: Payment Info','Checkout Started')}",
        "",
    ])

    # Resolution by route
    rr = w.get("wizard_resolution_by_route", {})
    if rr:
        out.extend(["### Resolution shown by route", "",
                    "| Route | Count |", "|---|---|"])
        for k, v in sorted(rr.items(), key=lambda x: -x[1]):
            out.append(f"| {k} | {v:,} |")
        out.append("")

    # Conversion by action
    ca = w.get("wizard_conversion_by_action", {})
    if ca:
        out.extend(["### Conversion by action", "",
                    "| Action | Count |", "|---|---|"])
        for k, v in sorted(ca.items(), key=lambda x: -x[1]):
            out.append(f"| {k} | {v:,} |")
        out.append("")

    # Device funnel
    wd = w.get("wizard_funnel_by_device", [])
    if wd:
        out.extend(["### Wizard funnel by device (from step-1 picker)", "",
                    "| Device | Entry | Step | Resolution | Conversion |",
                    "|---|---|---|---|---|"])
        for r in wd:
            out.append(f"| {r['wizard_device']} | {r['entry']:,} | {r['step']:,} | {r['resolution']:,} | {r['conversion']:,} |")
        out.append("")

    # Bounce + duration per page
    pb = w.get("pages_bounce", [])
    pd_ = w.get("pages_duration", [])
    if pb:
        out.extend(["## Top landing pages", "",
                    "| Page | Sessions | Bounce % | Median duration (s) |",
                    "|---|---|---|---|"])
        dur_by_path = {x["path"]: x for x in pd_}
        for r in pb[:20]:
            d = dur_by_path.get(r["path"], {})
            out.append(f"| `{r['path'][:50]}` | {r['sessions']:,} | {r['bounce_pct']}% | {d.get('median_dur_s','-')} |")
        out.append("")

    # Frustration
    fr = w.get("frustration", [])
    if fr:
        out.extend(["## Frustration hotspots (dead + rage clicks)", "",
                    "| Page | Dead | Rage | Frustrated sessions |",
                    "|---|---|---|---|"])
        for r in fr[:15]:
            out.append(f"| `{r['path'][:50]}` | {r['dead_clicks']:,} | {r['rage_clicks']:,} | {r['frustrated_sessions']:,} |")
        out.append("")

    # Scroll
    sc = w.get("scroll_reach", [])
    if sc:
        out.extend(["## Scroll reach (sessions hitting depth milestone)", "",
                    "| Page | Reached 25% | Reached 50% | Reached 75% |",
                    "|---|---|---|---|"])
        for r in sc[:15]:
            out.append(f"| `{r['path'][:50]}` | {r.get('scroll_depth_25','-')} | {r.get('scroll_depth_50','-')} | {r.get('scroll_depth_75','-')} |")
        out.append("")
    else:
        out.append("> Scroll events first shipped 2026-04-22; no meaningful data in this window yet.\n")

    # Exceptions
    ex = w.get("exceptions", [])
    if ex:
        out.extend(["## Top JS exceptions", "",
                    "| Type | Message | Path | Count |",
                    "|---|---|---|---|"])
        for r in ex[:10]:
            msg = (r.get("message") or "")[:80].replace("|", "\\|")
            out.append(f"| {r.get('type') or '-'} | {msg} | `{r.get('path') or '-'}` | {r['count']:,} |")
        out.append("")

    # Validation fails
    vf = w.get("wizard_validation_fail_reasons", {})
    if vf and any(v for k, v in vf.items() if k and k != "None"):
        out.extend(["## Validation failures (book_now_validation_failed)", "",
                    "| Reason | Count |", "|---|---|"])
        for k, v in sorted(vf.items(), key=lambda x: -x[1]):
            out.append(f"| `{k}` | {v:,} |")
        out.append("")

    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("snapshot", help="Snapshot JSON path")
    ap.add_argument("--window", type=int, default=28, help="Which window to render (default 28)")
    ap.add_argument("--out", help="Write markdown to this path (default stdout)")
    args = ap.parse_args()

    snap = json.loads(pathlib.Path(args.snapshot).read_text())
    md = render(snap, args.window)

    if args.out:
        pathlib.Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        pathlib.Path(args.out).write_text(md)
        sys.stderr.write(f"[report] wrote {args.out}\n")
    else:
        print(md)


if __name__ == "__main__":
    main()
