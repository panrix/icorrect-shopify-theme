# Go-live: quote-events repair fields (hub #432)

**Status (2026-09-14 ~04:07 UTC): LIVE**

- Hub deployed: `intake-hub` @ `f5eade1` — *Capture quoted repair on quote_events (#432)*
- Migration `0028-quote-events-repair.sql` applied clean; post-check PASS
- Theme: still on [#65](https://github.com/panrix/icorrect-shopify-theme/pull/65) (gate [#66](https://github.com/panrix/icorrect-shopify-theme/pull/66) closed unmerged — would have omitted repair keys)
- Production smoke: repair-field POST and legacy POST both `{"ok":true}`

## What was broken

Theme #65 emitted `repair` / `repair_handle` / `repair_type` / `route`. Until hub #432 was deployed, production returned `400 unknown field: repair` and dropped the whole beacon.

## Deploy (ops — done)

Follow **`H-DEPLOY-RUNBOOK.md`** and `.claude/skills/intake-hub-*` on the VPS — not guessed repo-root paths.

```bash
ssh ricky@ops.icorrect.co.uk
cd /home/ricky/apps/workshop-os
git fetch origin && git checkout main && git pull --ff-only origin main

cd intake/intake-hub
npm run build   # tsc -p tsconfig.json

# migrations: scripts live under intake/intake-hub/scripts/
# SUPABASE_DB_URL must come from the systemd unit's env file:
#   /home/ricky/config/.env
# (not api-keys/.env)
set -a && source /home/ricky/config/.env && set +a
npx tsx scripts/apply-pending-migrations.ts   # confirm path matches runbook on box

sudo systemctl daemon-reload
sudo systemctl restart intake-hub
sudo systemctl status intake-hub --no-pager
```

## Smoke

```bash
curl -sS -X POST 'https://api.icorrect.co.uk/api/quote-events' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://icorrect.co.uk' \
  -d '{"session_id":"smoke-repair","device":"iPhone","fault":"Screen","repair":"iPhone 14 Screen","repair_handle":"iphone-14-screen","repair_type":"screen","route":"repair","proceeded":false}'
# expect: {"ok":true}
```

## Theme follow-up

**None required for the gate.** Live theme already sends repair fields; hub accepts them.

Optional residuals (not blocking):

- Spot-check Shopify `diagnostic_turnaround` section settings for a legacy “24 hours” override
- Soft lead-gate + express mail-in: `docs/CONVERSION-NOTES-QUOTES-2026-09-14.md`

## Pre-existing ops drift (noted by CLI deploy, untouched)

- `intake_tasks.payment_amount_gbp` numeric precision drift (preflight non-zero)
- Dirty `intake/icloud-checker/specs-cache.json` + old backup junk on the box
