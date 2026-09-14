# QA — same-day express preview (Task 7) — 2026-09-14 (schema re-push)

**Branch:** `cursor/setup-dev-environment-a035`  
**HEAD at this theme push:** `b0ae73d132f05b84844232c753f22c13236d2255` (`fix: quote-wizard schema — omit blank default on eligibility URL`)  
**PR / live merge:** not done. Do **not** merge to `main`. Do **not** `theme push --live`.  
**Live theme left alone:** `158358438141` (`icorrect-shopify-theme/main`, role `main`, `updated_at` still `2026-09-01T12:59:28+01:00`)

## VERDICT: PREVIEW UNBLOCKED; MATRIX HAPPY-PATH STILL FAIL-CLOSED

Schema fix landed. Unpublished theme `213273968893` accepted `sections/quote-wizard.liquid` (no schema error). Preview homepage is **HTTP 200** on that theme; quote-wizard / `qw-` HTML is present. Standard wizard walk works (iPhone 16 Pro Max screen → Standard card + checkout CTA). Same-day cards stay **hidden** as expected: blank `eligibilityUrl`, `inStock: false`, variant ids `0`, eligibility proxy nginx **404**. Happy-path matrix rows 1–4, 7, 9 still cannot pass until Task 8 SKUs + proxy + stock.

## Preview theme

| Field | Value |
| --- | --- |
| Theme id | `213273968893` |
| Name | `STAGING — same-day express` |
| Role | `unpublished` |
| Shop | `i-correct-final.myshopify.com` |
| Preview | https://icorrect.co.uk/?preview_theme_id=213273968893 |
| Editor | https://i-correct-final.myshopify.com/admin/themes/213273968893/editor |
| CLI | `npx shopify theme push --theme 213273968893 --json` (existing unpublished; VPS token via `./scripts/load-shopify-env-from-vps.sh`) |
| CLI result | exit 0, JSON theme id `213273968893`, **no** `"pushed with errors"` |

Admin API after this push: `sections/quote-wizard.liquid` **present** (size 258446). Schema snippet has `same_day_eligibility_url` with **no** `"default"`. Also present: `assets/same-day-eligibility.js`, `assets/quote-wizard.css`.

## Forced checklist

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | `npm test` green | YES — 131/131 | `node --test scripts/courier/*.test.js`: 38 suites, 131 pass, 0 fail (fresh after this re-push). |
| 2 | Unpublished theme push (not live) | YES, **no schema error** | Push targeted `--theme 213273968893`. Role unpublished. Live `158358438141` not published / not updated today. |
| 3 | Preview homepage / collection with wizard | YES — HTTP **200**, wizard HTML present | `GET https://icorrect.co.uk/?preview_theme_id=213273968893` follows to `/` with `server-timing` `theme=213273968893` `pageType=index`. `Shopify.theme` `id=213273968893` `name=STAGING — same-day express` `role=unpublished`. Body contains `quote-wizard`, `qw-s1`…`qw-s4`, `qw-` classes. Collection `/collections/iphone-screen-repair-prices` also 200 on the same theme. |
| 4 | Matrix 1–9 on preview | PARTIAL | Standard path walked (see below). Same-day happy path blocked by missing SKUs / proxy / stock (expected). |
| 5 | Same-day fail-closed | YES (preview + API + config) | Preview `__sameDayConfig.eligibilityUrl === ""`; `__sameDayEligibility.inStock === false`. `GET https://api.icorrect.co.uk/same-day/eligibility` → nginx **404**. After iPhone B1-shaped postcode `W1B 4BD`, only Standard card; `[data-speed="same_day"]` count **0**. |
| 6 | Merge to `main` / `--live` | NOT DONE | Per Task 7 instruction: preview QA only. |

## Preview HTTP (this run)

| Request | HTTP | Theme | Wizard HTML |
| --- | --- | --- | --- |
| `/?preview_theme_id=213273968893` (follows redirects/cookies) | **200** | `213273968893` unpublished | **Yes** (`quote-wizard`, `qw-` step ids) |
| `GET /` with preview cookies | **200** | same | Yes |
| `/collections/iphone-screen-repair-prices` with cookies | **200** | same | Yes |

Previous blocked QA (HEAD `b700e74`, blank schema default) had cookie preview **404** and **no** `quote-wizard.liquid` on the theme. That is no longer true after `b0ae73d`.

## Standard wizard walk (preview, headless Chrome)

Theme confirmed `213273968893` in-page. Path:

1. Step `qw-s1` — devices MacBook / iPhone / iPad / Watch.
2. iPhone → `qw-s2` “Which iPhone is it?” series cards (16 / 15 / 14 / 13 / Older).
3. iPhone 16 series → models including iPhone 16 Pro Max.
4. iPhone 16 Pro Max → `qw-s3` faults including Screen / Display.
5. Screen / Display → `qw-s4` issues; “Cracked glass (touch still works)”.
6. Result: `iPhone 16 Pro Max Screen Repair (Genuine OLED)`, `data-base="379"`, postcode field `qwPostcode`.
7. Postcode `W1B 4BD` (B1): **Repair turnaround** shows **Standard** only — “We collect Tue 15 Sep. We repair the next working day and return it that afternoon. Included”. Proceed to checkout visible. Same-day card **not** in DOM.

Checkout was **not** submitted (preview QA only; no order).

## Preview matrix (must be on `?preview_theme_id=…`)

| # | Case | Preview | Notes |
| --- | --- | --- | --- |
| 1 | iPhone B1 (W1) 10:00 mock — same-day £49, 3 left | **Fail-closed (expected)** | Walked iPhone 16 Pro Max screen + `W1B 4BD`. Same-day card absent. Unit still: `todayEligible` iPhone B1 10:00 ok **if** stock+proxy. Variant id 0 / blank URL / `inStock` false. |
| 2 | iPhone B1 after 12:00 — today hidden, next WD | **Cannot verify today-vs-next** | Same-day never shown. Standard clock showed next collect Tue 15 Sep (run date Mon 14 Sep 2026). |
| 3 | iPhone B2 after 11:00 — today hidden | **Cannot verify cutoff** | Same-day hidden for all bands until eligibility works. |
| 4 | MacBook afternoon hidden; morning £149 | **Not walked** | Same-day would stay hidden anyway (url/stock/SKU). Fast/Fastest variants still 0. |
| 5 | B3 / mail-in — no same-day; MacBook Fast £79 | **Partial** | iPhone known-repair: Standard only (matches `planSpeedOffers` when same-day ineligible). MacBook Fast £79 not exercised; `fastVariantId` 0. |
| 6 | Force `in_stock: false` — no same-day card | **YES on preview** | Live stub is already `inStock: false`. After B1 postcode, same-day count 0. |
| 7 | Reserve 3 — fourth browse hides same-day | **Cannot verify** | Needs workshop-os reserve + live eligibility. |
| 8 | API stop — no same-day; standard checkout works | **YES / partial** | Eligibility URL blank + public route 404 → fail-closed. Standard card + “Proceed to checkout” rendered; cart/checkout **not** completed. |
| 9 | Copy: iPhone collect today / back tomorrow vs collect and back today | **Standard copy only** | Seen: Standard meta “We collect … We repair the next working day and return it that afternoon.” Same-day sentence not rendered (card hidden). Source still uses a single same-day string: `Collect and back the same day.` |

## What this QA **can** claim

- Courier suite is green at 131/131.
- Staging theme id `213273968893` is unpublished; live theme was not overwritten.
- `quote-wizard.liquid` uploads after omitting the blank text `default`.
- Preview homepage and iPhone collection are HTTP 200 on that unpublished theme; wizard HTML (`qw-`) is present.
- Standard wizard (device → series → model → fault → issue → postcode → Standard card) works on preview.
- Same-day is **fail-closed** on preview: blank proxy URL, no public eligibility route, stub `inStock` false, variant ids default `0`.

## What this QA **cannot** claim

- Same-day £49 / Fast £79 / Fastest £149 appearing in the quote UI.
- Slot counts, cutoffs, or reserve cap on the storefront.
- Completed checkout / paid order on this unpublished theme.
- Matrix rows 1–4, 7, 9 as product-complete same-day behaviour.

## P0 (resolved)

1. **Blank text default blocked the wizard section.** Fixed in `b0ae73d`: `same_day_eligibility_url` has no `"default"`; Liquid still uses `| default: ''`. Re-push succeeded; section is on the theme.

## P1

1. **No public eligibility proxy.** `https://api.icorrect.co.uk/same-day/eligibility` is nginx 404. Theme setting `eligibilityUrl` is still `""` on this unpublished theme (`Blank = hide same-day`).
2. **Task 8 SKUs / section settings not applied** on this theme: `same-day-iphone`, published Fastest, pasted variant ids (all still `0`).
3. **workshop-os `in_stock`** stays false until handle→parts map exists. Happy-path same-day cannot pass even with a working preview.

## P2

1. Same-day card meta does not distinguish iPhone “collect today, back tomorrow” (that is **Standard** copy) from MacBook same-day; both same-day cards use `Collect and back the same day.` (source; not visible on preview).

## Contradictions / unsafe-to-merge-if-surface-looks-fine

- A green `npm test` plus a working Standard wizard does **not** mean same-day matrix passed.
- Cookie-less or mis-followed `curl` of `?preview_theme_id=` can still 302 onto live theme `158358438141`. Always confirm `Shopify.theme.id === 213273968893` before scoring the matrix. This run did.
- Fail-closed same-day is correct for missing proxy/stock. It is **not** a substitute for matrix rows 1–4, 7, or 9.
- **Do not merge** until Task 8 SKUs + proxy URL on the preview theme, and a real same-day matrix pass (or an explicit product decision to merge fail-closed UI only).
