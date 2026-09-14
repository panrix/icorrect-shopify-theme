# QA — same-day express preview (Task 7) — 2026-09-14

**Branch:** `cursor/setup-dev-environment-a035`  
**HEAD at push:** `b700e74322a016ce8ddabad3b7bbc207b6f23956`  
**PR / live merge:** not done. Do **not** merge to `main`. Do **not** `theme push --live`.  
**Live theme left alone:** `158358438141`

## VERDICT: BLOCKED

Source tests are green. An unpublished staging theme exists, but **preview storefront QA of the wizard is not possible**: Shopify rejected `sections/quote-wizard.liquid` because a text setting default is blank. Templates that reference that section were also rejected. Cookie-bound preview of `/` and representative collections returns **404** on the unpublished theme. Same-day cards are **fail-closed** in code and would stay hidden even on a healthy preview until SKUs, `same_day_eligibility_url`, and workshop-os `in_stock` exist.

## Preview theme

| Field | Value |
| --- | --- |
| Theme id | `213273968893` |
| Name | `STAGING — same-day express` |
| Role | `unpublished` |
| Shop | `i-correct-final.myshopify.com` |
| Preview | https://icorrect.co.uk/?preview_theme_id=213273968893 |
| Editor | https://i-correct-final.myshopify.com/admin/themes/213273968893/editor |
| CLI | `npx shopify theme push --unpublished --json -t "STAGING — same-day express"` (VPS token via `./scripts/load-shopify-env-from-vps.sh`) |
| CLI warning | `"The theme 'STAGING — same-day express' was pushed with errors"` |

Root schema error:

`sections/quote-wizard.liquid` — `Invalid schema: setting with id="same_day_eligibility_url" default can't be blank`

Admin API after push: `assets/same-day-eligibility.js` and `assets/quote-wizard.css` are present; **`sections/quote-wizard.liquid` is absent**.

## Forced checklist

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | `npm test` green | YES — 131/131 | `node --test scripts/courier/*.test.js`: 38 suites, 131 pass, 0 fail (fresh run). Includes todayEligible B1/B2 cutoffs, stub hides same-day, fetch fail-closed, planSpeedOffers. |
| 2 | Unpublished theme push (not live) | YES, with errors | Theme `213273968893` role `unpublished`. Live `158358438141` not published. |
| 3 | Preview homepage / collection with wizard | NO — 404 | Seed `GET ?preview_theme_id=213273968893` → 302, `server-timing` `theme=213273968893` `pageType=index`. Follow with preview cookie: `GET /` and `GET /collections/iphone-screen-repair-prices` → HTTP 404, `Shopify.theme` `id=213273968893` `name=STAGING — same-day express`. No `quote-wizard` / `qw-root` in HTML. |
| 4 | Matrix 1–9 on preview | NOT RUN (blocked) | Wizard section missing on unpublished theme. Same-day happy path also blocked by missing SKUs / proxy / stock map (expected). |
| 5 | Same-day fail-closed | YES (code + API) | Stub `inStock: false`; `same_day_eligibility_url` default blank (and Shopify will not even accept that schema). `GET https://api.icorrect.co.uk/same-day/eligibility` → nginx **404**. Handle→parts map not in this repo. |
| 6 | Merge to `main` / `--live` | NOT DONE | Per Task 7 instruction: preview QA only. |

## Preview matrix (must be on `?preview_theme_id=…`)

| # | Case | Preview | Notes |
| --- | --- | --- | --- |
| 1 | iPhone B1 (W1) 10:00 mock — same-day £49, 3 left | **Cannot verify** | Unit: `todayEligible` iPhone B1 10:00 ok. UI needs stock+proxy+SKUs and a working wizard section. |
| 2 | iPhone B1 after 12:00 — today hidden, next WD | **Cannot verify** | Unit: iPhone B1 12:00 not today-eligible. Advance dates need live `dates{}`. |
| 3 | iPhone B2 after 11:00 — today hidden | **Cannot verify** | Unit: iPhone B2 11:00 no. |
| 4 | MacBook afternoon hidden; morning £149 | **Cannot verify** | Unit: afternoon window hides same-day; morning can show. £149 needs Admin variant id ≠ 0. |
| 5 | B3 / mail-in — no same-day; MacBook Fast £79 | **Cannot verify** | Unit: B3/mail-in no same-day; MacBook Fast still planned. Fast variant default 0. Preview 404. |
| 6 | Force `in_stock: false` — no same-day card | **Cannot verify on preview** | Unit + stub: no `dateOptions` when `inStock` false. This is the **current production-shaped state**. |
| 7 | Reserve 3 — fourth browse hides same-day | **Cannot verify** | Needs workshop-os reserve + live eligibility. `orders/paid` reserve not in this theme. |
| 8 | API stop — no same-day; standard checkout works | **Partial** | Eligibility URL 404 / blank → fail-closed (intended). Standard checkout **not** exercised: unpublished theme 404s, wizard missing. |
| 9 | Copy: iPhone collect today / back tomorrow vs collect and back today | **Source only** | Standard meta: `We collect … We repair the next working day and return it that afternoon`. Same-day meta is a single string: `Collect and back the same day.` (MacBook same-day uses the same sentence; spec’s iPhone vs MacBook same-day copy split is not in the card meta). Not seen in preview HTML. |

## What this QA **can** claim

- Courier suite is green at 131/131.
- Staging theme id `213273968893` is unpublished; live theme was not overwritten.
- Same-day is **fail-closed**: blank proxy URL, no public eligibility route, no handle→parts `in_stock`, variant ids default `0`.
- Shopify CLI will not upload `quote-wizard.liquid` while `same_day_eligibility_url` has `"default": ""`.

## What this QA **cannot** claim

- Any browser matrix row on the preview wizard.
- Same-day £49 / Fast £79 / Fastest £149 appearing in the quote UI.
- Slot counts, cutoffs, or reserve cap on the storefront.
- Standard checkout on this unpublished theme (homepage and sampled collections 404).

## P0

1. **Blank text default blocks the wizard section.** `same_day_eligibility_url` `"default": ""` is invalid in Shopify section schema. Fix: omit `default` (Liquid already uses `| default: ''`) **or** use a non-empty placeholder Shopify accepts, then re-push unpublished. Update `same-day-eligibility-fetch.test.js` which currently asserts `"default": ""`.
2. **Unpublished preview 404s** until `quote-wizard.liquid` and templates that type it upload. Do not treat the preview URL as a working storefront.

## P1

1. **No public eligibility proxy.** `https://api.icorrect.co.uk/same-day/eligibility` is nginx 404. Theme setting cannot be pointed at a working URL yet (`scripts/same-day-proxy.md` is a sketch).
2. **Task 8 SKUs / section settings not applied** on this theme: `same-day-iphone`, published Fastest, pasted variant ids.
3. **workshop-os `in_stock`** stays false until handle→parts map exists. Happy-path same-day cannot pass even after schema fix.

## P2

1. Same-day card meta does not distinguish iPhone “collect today, back tomorrow” (that is **Standard** copy) from MacBook same-day; both same-day cards use `Collect and back the same day.`
2. Theme push listed every `quote-wizard` template as missing the section file — noise from P0, not extra product bugs.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

- A green `npm test` does **not** mean preview QA passed. The CLI reported a successful unpublished theme **with errors**; the asset that contains the feature did not land.
- Cookie-less `curl` of `?preview_theme_id=` 302s to `/` and can render **live** theme `158358438141`. Always confirm `Shopify.theme.id === 213273968893` before scoring the matrix.
- Fail-closed same-day is correct for missing proxy/stock. It is **not** a substitute for matrix rows 1–4, 7, or 9.
- **Do not merge** until: schema uploads, preview wizard loads, Task 8 SKUs + proxy URL on the preview theme, and a real matrix pass (or an explicit product decision to merge fail-closed UI only).
