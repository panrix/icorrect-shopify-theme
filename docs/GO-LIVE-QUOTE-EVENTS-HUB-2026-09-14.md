# Go-live: quote-events repair fields (hub #432)

**Status (2026-09-14):** Theme PR #65 is live on `icorrect.co.uk` and stamps repair metadata client-side, but production `POST https://api.icorrect.co.uk/api/quote-events` still returns `400 {"ok":false,"error":"unknown field: repair"}`. Legacy payloads without those keys still return `200`.

## Immediate mitigation (theme)

`HUB_ACCEPTS_REPAIR_FIELDS = false` in `sections/quote-wizard.liquid` omits `repair`, `repair_handle`, `repair_type`, and `route` from outbound beacons so device/fault/email capture keeps working. Client-side stamps remain so flipping the flag re-enables product capture after the hub is live.

## Hub deploy (VPS — required)

This cloud agent has no SSH key to `ops.icorrect.co.uk`. Deploy from a machine that can reach the protected clone:

```bash
# On ops / jarvis as the deploy user
cd /home/ricky/apps/workshop-os
git fetch origin
git checkout main
git pull --ff-only origin main
# build intake-hub (use the repo's usual build command)
npm run build --workspace=intake-hub   # or the project-standard equivalent
npx tsx scripts/apply-pending-migrations.ts   # must apply 0028-quote-events-repair
sudo systemctl restart intake-hub
sudo systemctl status intake-hub --no-pager
```

## Smoke after hub restart

```bash
curl -sS -X POST 'https://api.icorrect.co.uk/api/quote-events' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://icorrect.co.uk' \
  -d '{"session_id":"smoke-repair","device":"iPhone","fault":"Screen","repair":"iPhone 14 Screen","repair_handle":"iphone-14-screen","repair_type":"screen","route":"repair","proceeded":false}'
# expect: {"ok":true}
```

Then set `HUB_ACCEPTS_REPAIR_FIELDS = true` in the theme, merge via Terra SHIP, and confirm one live repair + one diagnostic quote write repair columns in Supabase `quote_events`.

## Residual checks

- Shopify section setting `diagnostic_turnaround` on live templates (homepage already shows “Quote in 1 working day”; spot-check other templates in the theme editor for a legacy “24 hours” override).
- Soft lead-gate + express mail-in remain follow-ups in `docs/CONVERSION-NOTES-QUOTES-2026-09-14.md`.
