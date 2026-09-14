# QA return — PR 65 quote-events repair beacons

**Audited HEAD:** `7241ea6b8a6d48b652d1d6b6fea0bd417ae6c2f0`  
**PR:** [panrix/icorrect-shopify-theme#65](https://github.com/panrix/icorrect-shopify-theme/pull/65)  
**Upstream dependency:** [panrix/workshop-os#432](https://github.com/panrix/workshop-os/pull/432), currently **OPEN** and unmerged at the time of review.

## VERDICT: BLOCKED

Do not merge or deploy this PR as a release. Hub PR #432 has not landed, including the request allow-list and database migration for these four fields. Shipping the theme first makes the hub reject quote-events requests for unknown fields, losing the entire capture request. There are also code-level findings below which must be addressed before approval.

| # | Required check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | HEAD is exactly the claimed commit | **YES** | `git rev-parse HEAD` returned `7241ea6b8a6d48b652d1d6b6fea0bd417ae6c2f0`. |
| 2 | `quotePayload` includes the four fields and drops null/empty keys | **YES** | `sections/quote-wizard.liquid:149-178` adds `repair`, `repair_handle`, `repair_type`, and `route`; the existing null/empty deletion pass remains. |
| 3 | Repair card stamps actual product title/handle, repair type, and repair route | **YES** | `:3574` uses `product.title`, `product.handle`, `iss.repairType`, and literal `repair`; it does not use the fault label. |
| 4 | Diagnostic card stamps diagnostic product title/handle, `diagnostic` type/route | **YES** | `:3680` uses the fetched diagnostic product title (falling back to the mapped diagnostic title), mapped diagnostic handle, and literal diagnostic type/route. |
| 5 | `syncIcorrectQuote` copies card fields before shown/proceed/email beacons | **NO** | It copies the fields at `:1772-1776`, and shown/proceed call it at `:1844` and `:1857`. The email success handler calls `captureQuoteEmailRequested` directly at `:4134-4142`, with no preceding sync. |
| 6 | No new full postcode, name, or phone on shown/proceed payloads | **YES** | The new payload fields are product metadata only (`:157-160`). Shown/proceed only call `quotePayload` with `proceeded`; postcode is reduced through `outwardHalfOnly` during sync. Email/name remains confined to the pre-existing email-requested event path. |
| 7 | Product titles/handles are safely escaped in HTML attributes (no title XSS) | **NO** | The new title attribute sinks at `:3574` and `:3680` call `esc()`, but `esc()` (`:446`) serializes a text node and does not encode double quotes for an attribute context. Chromium proof: title `Repair " onmouseover="xss` rendered as `<div data-repair="Repair " onmouseover="xss">`. |
| 8 | PR must not go live before hub #432 | **YES** | Hub #432 is open/unmerged and its diff adds both the `ALLOWED_KEYS` entries and migration `0028-quote-events-repair.sql`; the current hub rejects unknown keys. |

## P0

- **Release dependency is not deployed:** workshop-os #432 is open. Until it is merged, deployed, and its migration is applied, all theme quote-events containing any of the four new keys are rejected with HTTP 400. This blocks the release.

## P1

- **New attribute-context XSS sink:** product title is inserted into `data-repair` using an HTML-text escaping helper that leaves `"` intact. A crafted Shopify product title can break out of the attribute and add event-handler attributes. Use an attribute-safe encoder or set these values via DOM APIs; cover both repair and diagnostic paths.
- **Email beacon can contain stale or empty repair metadata:** email success does not invoke `syncIcorrectQuote()` before `captureQuoteEmailRequested`. While a normal untouched card may retain a previous sync, it is not guaranteed—especially across an asynchronous webhook response and navigation/reset. Synchronize immediately before that capture (or make the capture wrapper perform the synchronization).

## P2

- **No automated coverage for this contract:** the theme test suite passed, but none of the existing tests exercise the four new payload fields, repair/diagnostic card stamping, email synchronization, null-key omission, or hostile product-title attribute escaping. Add focused tests, including a quoted title containing `"` and the repair/diagnostic/email paths.

## Contradictions

- The stated goal is to send the product on **quote-shown, proceed, and email-quote** beacons, but only the first two are synchronized immediately before capture. The email path bypasses that invariant.
- The diff appears to use `esc()` at the new attribute sites, but that helper is only safe for HTML text. Its behavior contradicts the claimed “no XSS via product.title” outcome.
- The theme PR sends fields that the currently deployed hub does not yet accept. It is not independently deployable even though the client-side field names match the pending hub PR.

## Unsafe to merge even if surface looks fine

**Yes.** Treat merge/deploy as unsafe until #432 is merged, deployed, and migration `0028` is verified applied in the production hub. Separately, resolve the attribute-context XSS and make email capture synchronize the current card before it serializes the payload. A successful theme-only test run does not prove the cross-repository API contract or those browser paths.

## Verification performed

- Exact HEAD and working-tree inspection. A pre-existing untracked file, `docs/QA-PR65-TERRA-r1-2026-09-14.md`, was left untouched.
- Reviewed the PR diff and all three beacon call paths.
- Checked hub PR #432 live: open, clean, unmerged; reviewed its allow-list/migration diff.
- Ran existing courier tests: catalogue map, courier funnel, pricing, slots, and wizard prefill — all passed. They do not cover this PR's new beacon contract.
- Reproduced the quote-in-attribute injection behavior in headless Chromium.
