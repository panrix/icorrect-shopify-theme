# QA — same-day launch wiring

Branch: `cursor/same-day-launch-wiring-a035`  
Preview theme: `213273968893` (`STAGING — same-day express`)  
Do **not** merge to `main`. Do **not** `theme push --live`.

## What this PR binds

1. Real stock — Shopify handle → Monday parts + live Monday qty. Unmapped / API down fail-closes.
2. 3-slot cap — `POST /same-day/reserve` decrements a per-date store. Fourth booking `ok: false`.
3. Browser never sees the Monday / reserve secret. Public GET only.
4. Every `quote-wizard` JSON section has the three variant IDs + eligibility URL.
5. Paid path — cart stamps `Turnaround` + `Same-day date`; order-handler reserves on `orders/paid`.
6. Slack — `SAME-DAY` or `SAME-DAY RESERVE FAILED`.
7. Diagnostic handles are never eligible.
8. Wizard sends the stamped **repair** handle (`#qwResCard` / `S.repairHandle`), not the collection handle, and waits 5s.

## Automated

`npm test` — 193 pass. GitGuardian on #80 — green.

## Live API (mission-control, 2026-09-15)

| Case | Result |
|---|---|
| `iphone-16-pro-max-screen-repair` + `W1B` | `eligible:true` `in_stock:true` £49 |
| `macbook-pro-16-m4-2024-a3186-a3403-screen-repair` + `W1B` | `eligible:true` £149 |
| Same + `M1` | `eligible:false`, stock still true |
| Diagnostic handle + `W1B` | `eligible:false` |
| Public `POST /same-day/reserve` | nginx 404 |
| Localhost reserve 1–3 / 4th / no-auth | OK / `cap_reached` / 401 |

Far-future date `2099-01-05` was used for the cap test so live days were not consumed.

## Preview wizard (theme 213273968893)

First walk hid Same-day: eligibility used the collection handle and aborted at 1.5s (cold Monday+Shopify ≈ 1.7s). Fixed in `7050d99`.

After the push:

- iPhone 16 Pro Max screen + `W1B 4BD` → Standard + Same-day **+£49**, handle `iphone-16-pro-max-screen-repair`, 3 slots.
- Same + `M1 1AE` → mail-in, no Same-day.
- MacBook 16 M4 A3186 screen + `W1B 4BD` → Standard + Fast **+£79** + Same-day **+£149**.
- iPad hide is device-gated in `planSpeedOffers` (no Same-day even when the eligibility URL is set).

Do not place a live paid order. Reserve is proven on localhost + simulated `orders/paid`.
