# Status handoff — quote-events repair capture + turnaround clocks

**Date:** 2026-09-14  
**Repos:** panrix/icorrect-shopify-theme (this doc) · panrix/workshop-os (hub)  
**Audience:** next Cloud / CLI agent

## Verdict

**Urgent path is live.** Theme #65 ships quoted-repair fields; hub #432 is deployed on ops and accepts them. Quote capture should be working again. No theme flag-flip required.

## What shipped

| Piece | State |
|---|---|
| Theme [#65](https://github.com/panrix/icorrect-shopify-theme/pull/65) | Merged to `main`, live on Shopify (`fccb94d`) |
| Hub workshop-os #432 | Deployed on VPS: `intake-hub` @ `f5eade1`, migration `0028` applied |
| Theme gate [#66](https://github.com/panrix/icorrect-shopify-theme/pull/66) | **Closed unmerged** — would have omitted repair keys after hub was already live |

### Theme behaviour (live)

- Quote-events beacons include `repair`, `repair_handle`, `repair_type`, `route` when a product is quoted (DOM `dataset` stamp — not HTML-attr interpolation).
- Endpoint: `https://api.icorrect.co.uk/api/quote-events`
- Wizard clocks (via live `repair-journey.js` / `ICorrectRepairJourney`):
  - iPhone repair: **1 working day**
  - MacBook / iPad repair: **2 working days**
  - Watch repair: **3 working days** (adhesive)
  - Diagnostic: **Quote in 1 working day**; device stays until customer approves
- Homepage section setting: `diagnosticTurnaround: "Quote in 1 working day"` (not “24 hours”)
- Diagnostic card copy is service-neutral (“once your device arrives — by courier or mail-in…”)

### Hub behaviour (live)

Smoke (2026-09-14):

```bash
# repair fields
curl -sS -X POST 'https://api.icorrect.co.uk/api/quote-events' \
  -H 'Content-Type: application/json' -H 'Origin: https://icorrect.co.uk' \
  -d '{"session_id":"smoke","device":"iPhone","fault":"Screen","repair":"iPhone 14 Screen","repair_handle":"iphone-14-screen","repair_type":"screen","route":"repair","proceeded":false}'
# → {"ok":true}

# legacy without repair keys
# → {"ok":true}
```

Earlier failure mode (pre-deploy) was `400 unknown field: repair`, which dropped the whole beacon.

## Ops deploy notes (for next VPS work)

SSH to `ops.icorrect.co.uk` as `ricky` (Cloud Agent SSH secret applies to **new** sessions only).

Follow **`H-DEPLOY-RUNBOOK.md`** / `.claude/skills/intake-hub-*` on the box — not guessed paths:

- App: `/home/ricky/apps/workshop-os`
- Build: `cd intake/intake-hub && npm run build`
- Migrations: under `intake/intake-hub/scripts/`, with `SUPABASE_DB_URL` from **`/home/ricky/config/.env`** (the systemd unit env — not `api-keys/.env`)
- Restart: `sudo systemctl daemon-reload && sudo systemctl restart intake-hub`

Pre-existing noise left untouched: intake_tasks payment precision drift in preflight; dirty `icloud-checker` cache / old junk on the box.

## Residuals (not blocking capture)

1. **FAQ / marketing copy drift** — homepage FAQ + FAQ schema (and many MacBook/iPad/Watch collection FAQs) still say diagnostics / repairs take **“two to three working days”**, which conflicts with the wizard’s 1-day diagnostic / short bench clocks. Good next PR.
2. **Mail-in door-to-door dates** look longer than the bench claim because pack → post → receive → return ship are stacked on top (e.g. MacBook mail-in Mon start → back next Mon while bench still says “2 working days”). Honest transit; don’t confuse with old inflated bench clocks.
3. **Supabase row spot-check** — confirm one live repair + one diagnostic `quote_events` row has the new columns. API smoke passed; dashboard row check was not completed from the prior agent.
4. **Product follow-ups** (see `docs/CONVERSION-NOTES-QUOTES-2026-09-14.md`): soft lead-gate before price; express mail-in (+fee) when stocked.

## Process

- PR ready → harsh Terra queue → **SHIP only** → then merge.
- Do not re-open gate #66 or set a “omit repair fields” flag unless the hub starts rejecting again.

## Suggested next agent tasks

1. Spot-check Supabase `quote_events` for repair columns after a real wizard quote.
2. Docs/copy PR: align homepage FAQ + schema (and optionally collection FAQs) to the new clocks.
3. Optional conversion work from the notes file above.
