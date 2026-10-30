# Quote Wizard Re-QA — Code Review Confirmation

**Date:** 2026-03-25
**Reviewer:** Claude (code review)
**Scope:** `sections/quote-wizard.liquid` — all four findings from `quote-wizard-qa-review-2026-03-23.md`
**Branch:** `claude/review-quote-wizard-qa-NdHYg`
**Status:** All fixes confirmed present in codebase. No new code changes required.

## Context

The original QA review (2026-03-23) documented four findings, all marked "Fixed locally, pending re-QA." This re-QA performed a full code review of `sections/quote-wizard.liquid` (2877 lines) to confirm each fix is correctly implemented.

## Finding 1: Cart contamination

**Status:** Confirmed fixed

**Code location:** `ensureCleanWizardCart()` (lines 1679–1700)

**What was checked:**
- `addToCartAndCheckout()` calls `ensureCleanWizardCart()` before any cart mutation
- The function fetches `cart.js`, checks `cart.items`
- If items exist, a `window.confirm()` prompt warns the user their cart will be replaced
- Cancelling returns `false`, which aborts checkout and re-enables the button
- Accepting calls `cart/clear.js` before proceeding
- Only after a successful clear does `cart/add.js` fire with the wizard items

## Finding 2: Lossy SKU resolution

**Status:** Confirmed fixed

**Code locations:**
- `getProductsForRepairType()` (lines 742–746) — filters `_collectionProducts` to return ALL products matching a repair type
- `pickProductByHandlePreference()` (lines 748–755) — deterministic handle-pattern matching
- `resolveRepairProduct()` (lines 757–790) — applies issue-aware preferences

**What was checked:**
- `_collectionProducts` stores the full product array from the collection fetch (line 1179)
- `buildRepairsMap()` is only used for availability checks (fault/issue filtering), not for final product selection
- Rear glass path prefers: `rear-glass-repair` > `housing-rear-glass-repair` > `housing-repair`
- Screen path with black screen / no display issues prefers: `original-lcd-screen-no-screen-message-repair` > `display-screen-repair` > `screen-repair` > `original-screen-repair`
- Standard screen path prefers: `original-screen-repair` > `display-screen-repair` > `screen-repair` > `original-lcd-screen-no-screen-message-repair`
- Single-product repair types return immediately without preference logic

## Finding 3: False-positive webhook success

**Status:** Confirmed fixed

**Code locations:**
- `postQuoteWizardWebhook()` (lines 1976–2016)
- Contact form submit handler (lines 2064–2082)
- Email quote send handler (lines 2266–2272)

**What was checked:**
- No `no-cors` mode anywhere in the file — all fetches use standard CORS with JSON headers
- `postQuoteWizardWebhook()` checks `res.ok` and `data.success !== false` before resolving
- AbortController with 30-second timeout prevents silent hangs
- Contact form: success UI (`form.style.display = 'none'` + ok message) only appears inside the `await` success path; the `catch` block re-enables the button and shows the error on `pErr`
- Email quote: `showEmailSuccess()` only fires inside `.then()`; `.catch()` re-enables the button and shows error in `qwEqErr`

## Finding 4: A2338 MacBook helper ambiguity

**Status:** Confirmed fixed

**Code locations:**
- `MB_NUMS` array (line 703) — two separate entries for A2338
- `mbFilter()` (lines 1408–1434) — search and dedup logic
- `findConfiguredModelByName()` (lines 1385–1404) — model resolution

**What was checked:**
- `MB_NUMS` contains `{n:"A2338",m:"MacBook Pro 13-inch 'M2' A2338 (2022)"}` and `{n:"A2338",m:"MacBook Pro 13-inch 'M1' A2338 (2020)"}` as separate entries
- Dedup key is `n.m` (the full model description), not `n.n` (the A-number), so both M1 and M2 appear as separate selectable options
- `findConfiguredModelByName()` resolves against configured model names in `MODELS['macbook']`, using exact match first, then best-fit substring match — not a raw A-number lookup
- Selecting either entry calls `pickModel()` with the correct `collectionHandle` from the matching configured model

## Recommendation

All four fixes are structurally sound from a code review perspective. The remaining step is **live preview testing** against the checklist in `quote-wizard-preview-qa-checklist-2026-03-23.md` to confirm runtime behaviour matches the code intent. Key paths to verify on preview:

1. Add a non-repair item to cart, then complete a wizard booking — confirm the replace warning appears
2. iPhone 11 > Screen > cracked glass vs black screen — confirm different SKUs are selected
3. iPhone 16 Pro Max > Rear Glass — confirm dedicated rear-glass product is preferred
4. Submit a contact question and email quote — confirm success only shows after real webhook response
5. MacBook helper > search A2338 — confirm both M1 and M2 entries appear and resolve correctly
