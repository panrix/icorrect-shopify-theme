#!/usr/bin/env python3
"""
PostHog behaviour snapshot — captures per-page + wizard behaviour metrics
into a dated JSON file for later before/after comparison.

Spec: docs/marketing-recording-analysis-tool-2026-04-22.md

Usage:
    set -a; source /home/ricky/config/api-keys/.env; set +a
    python3 scripts/analysis/posthog_snapshot.py
    python3 scripts/analysis/posthog_snapshot.py --label baseline-pre-design
    python3 scripts/analysis/posthog_snapshot.py --windows 7,28,90

By default captures three rolling windows: 7d, 28d, 90d. Each metric is
computed for all windows so the diff tool can match apples-to-apples.

Reads: POSTHOG_API_KEY (phx_*), POSTHOG_PROJECT_ID from env.
Writes: snapshots/YYYY-MM-DD[-label].json
"""

import argparse
import datetime as dt
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request


class PostHog:
    def __init__(self, key, project_id, host="https://us.posthog.com"):
        self.base = f"{host}/api/projects/{project_id}"
        self.headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

    def hogql(self, sql):
        body = {"query": {"kind": "HogQLQuery", "query": sql}}
        req = urllib.request.Request(
            f"{self.base}/query/", data=json.dumps(body).encode(), headers=self.headers
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.loads(r.read())
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"HTTP {e.code}: {e.read().decode('utf-8','replace')[:400]}") from None
        if data.get("error"):
            raise RuntimeError(data["error"])
        return data.get("results") or []


# ---------------------------------------------------------------------------
# Per-window metrics
# ---------------------------------------------------------------------------

def pages_basic(ph, days):
    """Top pages: sessions, pageviews, bounce proxy (single-pageview sessions)."""
    sql = f"""
    SELECT
      properties.$pathname AS path,
      count(DISTINCT properties.$session_id) AS sessions,
      count() AS pageviews
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY path
    HAVING sessions >= 10
    ORDER BY sessions DESC
    LIMIT 40
    """
    rows = ph.hogql(sql)
    return [{"path": r[0], "sessions": int(r[1]), "pageviews": int(r[2])} for r in rows]


def pages_bounce(ph, days):
    """Single-pageview sessions per landing page (bounce proxy)."""
    sql = f"""
    WITH per_session AS (
      SELECT
        properties.$session_id AS sid,
        any(properties.$pathname) AS landing,
        count() AS pv
      FROM events
      WHERE event = '$pageview' AND timestamp >= now() - INTERVAL {days} DAY
      GROUP BY sid
    )
    SELECT
      landing,
      count() AS sessions,
      countIf(pv = 1) AS single_pv,
      round(100 * countIf(pv = 1) / count(), 1) AS bounce_pct
    FROM per_session
    GROUP BY landing
    HAVING sessions >= 10
    ORDER BY sessions DESC
    LIMIT 40
    """
    rows = ph.hogql(sql)
    return [
        {"path": r[0], "sessions": int(r[1]), "single_pv": int(r[2]), "bounce_pct": float(r[3])}
        for r in rows
    ]


def pages_duration(ph, days):
    """Session duration stats per landing page."""
    sql = f"""
    WITH per_session AS (
      SELECT
        properties.$session_id AS sid,
        any(properties.$pathname) AS landing,
        dateDiff('second', min(timestamp), max(timestamp)) AS dur
      FROM events
      WHERE timestamp >= now() - INTERVAL {days} DAY
      GROUP BY sid
      HAVING dur >= 0
    )
    SELECT
      landing,
      count() AS sessions,
      round(avg(dur), 0) AS avg_dur_s,
      round(quantile(0.5)(dur), 0) AS median_dur_s,
      round(quantile(0.9)(dur), 0) AS p90_dur_s
    FROM per_session
    GROUP BY landing
    HAVING sessions >= 10
    ORDER BY sessions DESC
    LIMIT 40
    """
    rows = ph.hogql(sql)
    return [
        {"path": r[0], "sessions": int(r[1]), "avg_dur_s": int(r[2] or 0),
         "median_dur_s": int(r[3] or 0), "p90_dur_s": int(r[4] or 0)}
        for r in rows
    ]


def frustration(ph, days):
    """Dead and rage clicks per page."""
    sql = f"""
    SELECT
      properties.$pathname AS path,
      countIf(event = '$dead_click') AS dead_clicks,
      countIf(event = '$rageclick') AS rage_clicks,
      count(DISTINCT properties.$session_id) AS sessions
    FROM events
    WHERE event IN ('$dead_click', '$rageclick')
      AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY path
    HAVING dead_clicks + rage_clicks >= 3
    ORDER BY dead_clicks + rage_clicks DESC
    LIMIT 40
    """
    rows = ph.hogql(sql)
    return [
        {"path": r[0], "dead_clicks": int(r[1]), "rage_clicks": int(r[2]),
         "frustrated_sessions": int(r[3])}
        for r in rows
    ]


def scroll_reach(ph, days):
    """Scroll depth reach per page (only meaningful post-2026-04-22)."""
    sql = f"""
    SELECT
      properties.page_path AS path,
      event AS milestone,
      count(DISTINCT properties.$session_id) AS sessions
    FROM events
    WHERE event IN ('scroll_depth_25','scroll_depth_50','scroll_depth_75')
      AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY path, milestone
    ORDER BY path, milestone
    """
    rows = ph.hogql(sql)
    out = {}
    for path, milestone, sessions in rows:
        out.setdefault(path, {})[milestone] = int(sessions)
    return [{"path": p, **v} for p, v in out.items()]


def session_duration_buckets(ph, days):
    """Overall session length distribution."""
    sql = f"""
    WITH s AS (
      SELECT
        properties.$session_id AS sid,
        dateDiff('second', min(timestamp), max(timestamp)) AS dur
      FROM events
      WHERE timestamp >= now() - INTERVAL {days} DAY
      GROUP BY sid
      HAVING dur >= 0
    )
    SELECT
      countIf(dur < 5)                     AS under_5s,
      countIf(dur BETWEEN 5 AND 29)        AS s_5_30,
      countIf(dur BETWEEN 30 AND 119)      AS s_30_120,
      countIf(dur BETWEEN 120 AND 599)     AS s_2_10m,
      countIf(dur >= 600)                  AS over_10m,
      count()                              AS total
    FROM s
    """
    rows = ph.hogql(sql)
    if not rows:
        return {}
    r = rows[0]
    total = r[5] or 1
    return {
        "under_5s": int(r[0]),
        "s_5_30": int(r[1]),
        "s_30_120": int(r[2]),
        "s_2_10m": int(r[3]),
        "over_10m": int(r[4]),
        "total": int(r[5]),
        "pct_under_30s": round(100 * (r[0] + r[1]) / total, 1),
        "pct_over_2min": round(100 * (r[3] + r[4]) / total, 1),
    }


def wizard_events(ph, days):
    """Raw count of wizard + checkout events."""
    wanted = [
        "wizard_entry", "wizard_step", "wizard_resolution", "wizard_abandoned",
        "wizard_resolution_abandoned", "wizard_conversion",
        "book_now_clicked", "book_now_validation_failed", "booking_form_started",
        "proceed_to_checkout_clicked", "email_quote_clicked", "question_form_opened",
        "faq_expanded",
        "Product Added to Cart",
        "Checkout Started", "Checkout Step: Contact Info",
        "Checkout Step: Shipping Info", "Checkout Step: Payment Info",
        "purchase_completed", "Order Completed",
        "$exception",
    ]
    names = "','".join(w.replace("'", "''") for w in wanted)
    sql = f"""
    SELECT event, count() AS c
    FROM events
    WHERE event IN ('{names}')
      AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY event
    """
    rows = ph.hogql(sql)
    counts = {r[0]: int(r[1]) for r in rows}
    # Ensure all wanted events appear (zero if missing)
    for w in wanted:
        counts.setdefault(w, 0)
    return counts


def wizard_resolution_routes(ph, days):
    sql = f"""
    SELECT properties.route AS route, count() AS c
    FROM events
    WHERE event = 'wizard_resolution' AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY route ORDER BY c DESC
    """
    return {str(r[0]): int(r[1]) for r in ph.hogql(sql)}


def wizard_conversion_actions(ph, days):
    sql = f"""
    SELECT properties.action AS action, count() AS c
    FROM events
    WHERE event = 'wizard_conversion' AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY action ORDER BY c DESC
    """
    return {str(r[0]): int(r[1]) for r in ph.hogql(sql)}


def wizard_validation_reasons(ph, days):
    sql = f"""
    SELECT properties.reason AS reason, count() AS c
    FROM events
    WHERE event = 'book_now_validation_failed' AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY reason ORDER BY c DESC
    """
    return {str(r[0]): int(r[1]) for r in ph.hogql(sql)}


def wizard_funnel_by_device_field(ph, days):
    """Wizard's own S.device field — device/model picked in step 1."""
    sql = f"""
    SELECT
      properties.device AS wizard_device,
      countIf(event='wizard_entry') AS entry,
      countIf(event='wizard_step') AS step,
      countIf(event='wizard_resolution') AS resolution,
      countIf(event='wizard_conversion') AS conversion
    FROM events
    WHERE event IN ('wizard_entry','wizard_step','wizard_resolution','wizard_conversion')
      AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY wizard_device
    ORDER BY entry DESC
    """
    rows = ph.hogql(sql)
    return [
        {"wizard_device": str(r[0]), "entry": int(r[1]), "step": int(r[2]),
         "resolution": int(r[3]), "conversion": int(r[4])}
        for r in rows
    ]


def pageviews_by_device_type(ph, days):
    """New device_type super prop (mobile/tablet/desktop) — only populated post-2026-04-22."""
    sql = f"""
    SELECT properties.device_type AS device_type,
      count(DISTINCT properties.$session_id) AS sessions,
      count() AS pageviews
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY device_type
    ORDER BY sessions DESC
    """
    rows = ph.hogql(sql)
    return [{"device_type": str(r[0]), "sessions": int(r[1]), "pageviews": int(r[2])}
            for r in rows]


def exceptions_summary(ph, days):
    sql = f"""
    SELECT
      properties.$exception_type AS type,
      properties.$exception_message AS message,
      properties.$pathname AS path,
      count() AS c
    FROM events
    WHERE event = '$exception' AND timestamp >= now() - INTERVAL {days} DAY
    GROUP BY type, message, path
    ORDER BY c DESC
    LIMIT 30
    """
    rows = ph.hogql(sql)
    return [{"type": str(r[0]), "message": str(r[1])[:200] if r[1] else None,
             "path": r[2], "count": int(r[3])} for r in rows]


# ---------------------------------------------------------------------------
# Snapshot assembly
# ---------------------------------------------------------------------------

def snapshot_window(ph, days):
    """Produce all per-window metrics."""
    return {
        "pages_basic": pages_basic(ph, days),
        "pages_bounce": pages_bounce(ph, days),
        "pages_duration": pages_duration(ph, days),
        "frustration": frustration(ph, days),
        "scroll_reach": scroll_reach(ph, days),
        "session_duration_buckets": session_duration_buckets(ph, days),
        "wizard_event_counts": wizard_events(ph, days),
        "wizard_resolution_by_route": wizard_resolution_routes(ph, days),
        "wizard_conversion_by_action": wizard_conversion_actions(ph, days),
        "wizard_validation_fail_reasons": wizard_validation_reasons(ph, days),
        "wizard_funnel_by_device": wizard_funnel_by_device_field(ph, days),
        "pageviews_by_device_type": pageviews_by_device_type(ph, days),
        "exceptions": exceptions_summary(ph, days),
    }


def build_snapshot(ph, windows):
    now = dt.datetime.now(dt.timezone.utc)
    out = {
        "schema_version": 2,
        "captured_at": now.isoformat(),
        "host": "icorrect.co.uk",
        "posthog_project_id": os.environ.get("POSTHOG_PROJECT_ID"),
        "windows": {},
    }
    for days in windows:
        sys.stderr.write(f"[snapshot] capturing {days}-day window...\n")
        sys.stderr.flush()
        out["windows"][str(days)] = {
            "days": days,
            "window_start_utc": (now - dt.timedelta(days=days)).isoformat(),
            **snapshot_window(ph, days),
        }
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--windows", default="7,28,90", help="Comma-separated list of rolling windows in days")
    ap.add_argument("--label", default="", help="Optional suffix for the filename")
    ap.add_argument("--out", help="Write JSON to this path (overrides default)")
    args = ap.parse_args()

    key = os.environ.get("POSTHOG_API_KEY")
    pid = os.environ.get("POSTHOG_PROJECT_ID")
    if not key or not pid:
        raise SystemExit("POSTHOG_API_KEY / POSTHOG_PROJECT_ID env vars required (source api-keys/.env)")
    ph = PostHog(key, pid)

    windows = [int(w.strip()) for w in args.windows.split(",") if w.strip()]
    data = build_snapshot(ph, windows)

    if args.out:
        path = pathlib.Path(args.out)
    else:
        root = pathlib.Path(__file__).resolve().parents[2] / "snapshots"
        root.mkdir(exist_ok=True)
        today = dt.date.today().isoformat()
        suffix = f"-{args.label}" if args.label else ""
        path = root / f"{today}{suffix}.json"

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))
    sys.stderr.write(f"[snapshot] wrote {path} ({path.stat().st_size:,} bytes)\n")

    # Headline summary
    wc = data["windows"][str(windows[0])]["wizard_event_counts"]
    sd = data["windows"][str(windows[0])]["session_duration_buckets"]
    sys.stderr.write(
        f"[snapshot] first-window ({windows[0]}d) highlights: "
        f"wizard_entry={wc.get('wizard_entry',0)}  "
        f"wizard_resolution={wc.get('wizard_resolution',0)}  "
        f"wizard_conversion={wc.get('wizard_conversion',0)}  "
        f"Checkout Started={wc.get('Checkout Started',0)}  "
        f"$exception={wc.get('$exception',0)}  "
        f"sessions={sd.get('total',0)} "
        f"(%<30s={sd.get('pct_under_30s','?')}%)\n"
    )

    print(str(path))


if __name__ == "__main__":
    main()
