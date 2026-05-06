# PostHog behaviour analysis

Three small Python scripts that turn PostHog event data into before/after
comparisons — so we can tell whether a design or code change *actually*
moved user behaviour, instead of waiting 4 weeks for conversion rate to
stabilise.

Spec this implements: [`docs/marketing-recording-analysis-tool-2026-04-22.md`](../../docs/marketing-recording-analysis-tool-2026-04-22.md)

## Files

| Script | Purpose |
|---|---|
| `posthog_snapshot.py` | Pull current metrics from PostHog → JSON file under `snapshots/` |
| `posthog_report.py`   | Render a single snapshot as human-readable markdown |
| `posthog_diff.py`     | Compare two snapshots, produce a markdown diff |
| `courier_decision_engine.py` | Prototype London courier decision engine using the committed Gophr matrix and local fixtures |
| `courier_decision_engine_fixtures.py` | Standard-library fixture checks for the courier decision prototype |
| `courier_telegram_bot.py` | Internal Telegram guided-flow wrapper for the courier decision prototype |
| `courier_telegram_bot_fixtures.py` | No-network Telegram conversation fixture checks |

No daemons, no dashboards, no dependencies beyond Python 3.10+.

## Courier decision prototype

The courier prototype is local-only. It does not call Gophr live, mutate
Shopify, or touch the theme UI. It reads:

- `data/gophr-london-coverage-matrix-2026-05-05.csv`
- `data/gophr-london-coverage-decision-summary-2026-05-05.csv`
- `data/courier-decision-engine-fixtures-2026-05-06.json`

Example:

```bash
python3 scripts/analysis/courier_decision_engine.py \
  --postcode "W1B 2EL" \
  --repair-type iphone_screen \
  --stock available \
  --now "2026-05-06T10:30:00+01:00"
```

Run fixture checks:

```bash
python3 scripts/analysis/courier_decision_engine_fixtures.py
```

Run Telegram conversation fixture checks:

```bash
python3 scripts/analysis/courier_telegram_bot_fixtures.py
```

Run the internal Telegram prototype:

```bash
export TELEGRAM_BOT_TOKEN="..."
export TELEGRAM_ALLOWED_USER_IDS="123456789"
# Optional group allowlist. Telegram supergroup links like t.me/c/4036696902/2
# normally map to chat id -1004036696902.
export TELEGRAM_ALLOWED_CHAT_IDS="-1004036696902"
python3 scripts/analysis/courier_telegram_bot.py
```

The Telegram bot supports a guided flow:

```text
quote -> postcode -> repair type -> stock state -> same-day slots -> courier options
```

Use `debug` instead of `quote` to include local calculation details. The bot
also accepts group commands like `/quote@YourBotName`. The bot requires
`TELEGRAM_ALLOWED_USER_IDS` or `TELEGRAM_ALLOWED_CHAT_IDS` unless `--allow-all`
is passed for local testing.

## Running

```bash
# Load credentials (PostHog personal API key phx_* + project id)
set -a; source /home/ricky/config/api-keys/.env; set +a

# Capture current-state snapshot (default windows: 7, 28, 90 days)
python3 scripts/analysis/posthog_snapshot.py --label baseline-pre-design
# → writes snapshots/YYYY-MM-DD-baseline-pre-design.json

# Render readable report from a snapshot
python3 scripts/analysis/posthog_report.py snapshots/<file>.json --window 28 \
    --out reports/<name>.md

# After a change ships, capture another snapshot + diff it
python3 scripts/analysis/posthog_snapshot.py --label post-collection-redesign
python3 scripts/analysis/posthog_diff.py \
    snapshots/2026-04-23-baseline-pre-design.json \
    snapshots/2026-05-07-post-collection-redesign.json \
    --window 28 \
    --out reports/post-collection-redesign-diff.md
```

## What the snapshot captures

Per rolling window (7d / 28d / 90d):

- **Session volume + duration buckets** — under 5s, 5–30s, 30s–2min, 2–10min, 10min+
- **Top landing pages** — sessions, bounce % (single-pageview proxy), median + avg + p90 duration
- **Frustration hotspots** — dead-click and rage-click counts per page
- **Scroll reach** — sessions hitting `scroll_depth_25/50/75` per page (post-2026-04-22 only)
- **Wizard + checkout event counts** — every instrumented event plus `$exception`
- **Wizard routing** — resolution counts split by route (repair/diagnostic/contact)
- **Wizard outcomes** — conversion counts split by action (book_repair/book_diagnostic/email_quote/contact_submit/question_submit)
- **Wizard funnel by device** — iphone / macbook / ipad / watch
- **Validation fail reasons** — distribution of `book_now_validation_failed.reason`
- **Top JS exceptions** — from `$exception` (PostHog's exception capture, enabled 2026-04-22)

## Event availability caveat

PostHog data goes back to **30 Jan 2026** for standard events. But the custom
instrumentation was rolled out in phases:

| Event class | First seen |
|---|---|
| `$pageview`, `$autocapture`, `$dead_click`, `$rageclick`, `$web_vitals` | **30 Jan 2026** |
| `Checkout Started`, `Checkout Step: *`, `Product Added to Cart` | 27 Jan – 11 Feb 2026 |
| `wizard_step`, `wizard_resolution`, `wizard_abandoned`, `wizard_conversion` | 18 Mar 2026 |
| `wizard_entry` | 9 Apr 2026 |
| `scroll_depth_25/50/75`, `faq_expanded`, `book_now_clicked`, `book_now_validation_failed`, `booking_form_started`, `proceed_to_checkout_clicked`, `question_form_opened`, `device_type` super prop | **22 Apr 2026** (PR #33) |
| `$exception` | 22 Apr 2026 (enabled via PR #37) |
| `purchase_completed` (v3.2 pixel) | not yet firing — see PR #29 |

The `90d` window is richest for behavioural metrics (dead clicks, bounce,
session duration). The `7d` window is right for freshly-instrumented events.
The diff tool handles matching windows automatically and simply reports `-`
for missing data instead of failing.

## Recommended cadence

- **Before any design/code change:** capture a snapshot (`--label baseline-<thing>`)
- **7 days after ship:** snapshot + diff
- **14 days after ship:** snapshot + diff (more stable numbers)

Avoid diffing the same window against a sub-window that's being *actively*
observed — compare like-for-like (28d vs 28d etc.).
