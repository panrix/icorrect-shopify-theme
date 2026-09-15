# QA — same-day launch wiring

Branch: `cursor/same-day-launch-wiring-a035`  
Preview theme: `213273968893` (`STAGING — same-day express`)  
Do **not** merge to `main`. Do **not** `theme push --live`.

## What this PR binds

1. Real stock — Shopify handle → Monday parts map + live Monday qty. Unmapped / API down fail-closes.
2. 3-slot cap — `POST /same-day/reserve` decrements a per-date store. Fourth booking `ok: false`.
3. Browser never sees the Monday / reserve secret. Public GET only.
4. Every `quote-wizard` JSON section has the three variant IDs + eligibility URL.
5. Paid path — cart stamps `Turnaround` + `Same-day date`; order-handler reserves on `orders/paid`.
6. Slack — `SAME-DAY` or `SAME-DAY RESERVE FAILED`.

## Automated

`npm test` and `npm run theme:check` on this branch.

## Manual (preview)

- MacBook 16" + `W1B 4BD` → Standard / Fast / Same-day (if Monday says the part is on the shelf).
- iPhone 16 Pro Max + `W1B 4BD` → Standard / Same-day, no Fast.
- Same MacBook + `M1 1AE` → no Same-day.
- iPad / Watch collection pages now have the eligibility URL; Same-day must stay hidden.
- Do not place a live paid order in QA. Reserve is proven with `POST /same-day/reserve` against localhost and a simulated `orders/paid` payload.
