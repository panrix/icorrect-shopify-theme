# QA — PR #78 collect-first quote + public eligibility — 2026-09-15

**Branch:** `cursor/quote-collect-first-ui-a035`  
**HEAD at this QA:** collect-first branch after CORS + Same-day Back-date fix  
**PR:** https://github.com/panrix/icorrect-shopify-theme/pull/78 (draft)  
**Preview:** https://icorrect.co.uk/?preview_theme_id=213273968893  
**Theme:** `213273968893` `STAGING — same-day express` (unpublished)  
**Live theme left alone:** `158358438141`

Do **not** merge. Do **not** `theme push --live`. Homepage `same_day_eligibility_url` is the public proxy — keep that off `main`.

## VERDICT: PREVIEW SAME-DAY WORKS AFTER CORS FIX

Harsh QA first failed: Same-day stayed hidden on MacBook + `W1B 4BD` even though the proxy returned `eligible: true`. Chromium blocked every browser fetch:

`Access-Control-Allow-Origin` was sent twice (`*, *`) — Node CORS + nginx `add_header`. Curl succeeded; the wizard fail-closed (`inStock: false`, slots 0).

VPS nginx on `api.icorrect.co.uk` now proxies only. One `Access-Control-Allow-Origin: *`. Walks A–C then passed on the unpublished preview.

## Forced checks

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | `npm test` | **164/164** | `node --test scripts/courier/*.test.js scripts/same-day-eligibility-proxy/*.test.js` |
| 2 | Public GET eligibility | **200**, `eligible: true` for MacBook / W1B / `device=macbook` | `GET https://api.icorrect.co.uk/same-day/eligibility?...` |
| 3 | CORS is a single `*` | **YES** after nginx edit | Browser walk: 0 CORS errors. Header count 1. |
| 4 | Unpublished preview only | **YES** | `Shopify.theme.id === 213273968893`, role unpublished |
| 5 | Live theme / merge | **NOT DONE** | |

## Preview walks (headless Chrome, theme cookie)

Layout on all three: **When should we collect?** then **How fast should we turn it around?** then timeline. No `#qwBookAhead`.

| Walk | Path | Same-day | Speed cards | Notes |
| --- | --- | --- | --- | --- |
| A | MacBook Pro 16" M4 Max screen + `W1B 4BD` (B1) | **YES** +£149, 3 slots, Back Tue 15 Sep | Standard / Fast +£79 / Same-day | Eligibility `inStock: true`. Collect-first labels present. |
| B | iPhone 16 Pro Max screen + `W1B 4BD` | **YES** +£49 | Standard / Same-day — **no Fast** | Matches locked clocks (iPhone Fast not offered). |
| C | Same MacBook + `M1 1AE` (mail-in) | **NO** | Standard / Fast | `service_selected: mail-in`, `eligible: false`. |
| A′ | Walk A, then Afternoon, then Same-day | Card stays | Same-day click forces Morning | Afternoon does not hide the card (future dates still bookable). |

Eligibility URLs included `&device=macbook` / `&device=iphone` (Shopify handles often omit the brand token).

## What this QA does **not** claim

- Monday parts ledger / real stock. Prototype `device=iphone|macbook` → `in_stock: true`.
- `POST /same-day/reserve` on `orders/paid`. Not in this theme.
- Variant IDs on collection / product wizards (homepage only).
- Checkout / paid order / Slack `SAME-DAY RESERVE FAILED`.
- Live theme behaviour. Do not point `158358438141` at this URL.

## Residual risk

- Nginx backups must stay **out** of `sites-enabled` (`*.bak-*` were being loaded and warning `conflicting server name`).
- If someone re-adds `add_header Access-Control-Allow-Origin` on the location, Same-day disappears again in Chrome.
- Same-day Back date uses the picked same-day ISO (not the Standard collect day).
- Do not rebuild speed cards inside the speed click handler — that wiped `.sel` and forced a second click.
