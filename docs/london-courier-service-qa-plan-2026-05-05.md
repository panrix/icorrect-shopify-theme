# London Courier Service QA Plan

**Date:** 2026-05-05
**Status:** Phase-one QA plan
**Related spec:** `docs/london-courier-decision-engine-spec-2026-05-05.md`
**Source matrix:** `data/gophr-london-coverage-matrix-2026-05-05.csv`
**Decision summary:** `data/gophr-london-coverage-decision-summary-2026-05-05.csv`

## Goal

Verify that the London courier decision engine and quote wizard only show courier options that are commercially safe, operationally realistic, and correctly represented in Shopify cart data.

This QA plan covers postcode coverage, one-way versus two-way pricing, profitability, same-day eligibility, stock checks, diagnostics, Shopify cart metadata, customer-facing wording, and failure states.

## QA Principles

- Customer-facing options must be driven by decision output, not hardcoded theme assumptions.
- Customer prices must be based on `price_gross`, which already includes VAT.
- Commercial checks must use two-way courier cost unless the flow is explicitly collection-only.
- Same-day must never be promised globally.
- Same-day must only be offered for eligible iPhone repairs with confirmed stock.
- Diagnostic flows must not promise fixed repair timing.
- Private margin, subsidy, and Gophr details must not be visible in the UI.

## Test Data Baseline

Use the committed Gophr coverage data as the first QA fixture set:

| Fixture | Expected Use |
|---|---|
| `standard_free_candidate_priority_available` | Central/strong-margin scenarios where free standard courier may be shown. |
| `standard_paid_priority_available` | Paid standard or subsidised courier scenarios. |
| `standard_premium_review_priority_optional` | Paid courier with careful margin checks. |
| `outer_manual_or_motorbike_only` | Manual, paid-only, mail-in, or drop-off fallback scenarios. |
| `N1 one_hour_9_10 motorcycle HTTP 502` | API/data-gap handling scenario. |

Representative postcode scenarios should include:

- A central low-cost postcode.
- A Zone 2 postcode.
- An outer expensive postcode.
- A postcode with priority/urgent cost above the margin threshold.
- An unsupported or malformed postcode.
- The known `N1` one-hour motorcycle error case.

## Postcode Coverage QA

| ID | Scenario | Expected Result |
|---|---|---|
| PC-01 | Customer enters a full postcode covered by the matrix. | Engine normalises to outward code and returns the correct courier band. |
| PC-02 | Customer enters lowercase postcode with spaces. | Engine normalises postcode and produces the same result as uppercase input. |
| PC-03 | Customer enters a postcode with no matrix match. | Wizard shows mail-in/drop-off or manual courier quote, not live courier options. |
| PC-04 | Customer enters malformed postcode. | Wizard asks for a valid postcode and does not call checkout/cart logic. |
| PC-05 | Postcode maps to `outer_manual_or_motorbike_only`. | Wizard hides free courier and only shows paid/manual-safe options. |
| PC-06 | Known Gophr data gap occurs, such as `N1` 1-hour motorcycle 502. | Engine falls back to the next safe option or marks urgent unavailable. |

## Pricing And VAT QA

| ID | Scenario | Expected Result |
|---|---|---|
| VAT-01 | Matrix row has `price_net` and `price_gross`. | Customer-facing baseline uses `price_gross`; no extra 20% VAT is added. |
| VAT-02 | One-way gross courier cost is `8.54 GBP`. | Two-way baseline is calculated as `17.08 GBP` before customer subsidy/charge. |
| VAT-03 | Courier option is free to customer. | `customer_courier_charge_gross = 0`, subsidy equals two-way cost. |
| VAT-04 | Courier option is paid by customer. | Customer charge reduces the iCorrect subsidy in the contribution calculation. |
| VAT-05 | Spreadsheet displays ETA/date fields as numeric serials. | QA ignores spreadsheet serial formatting and validates source ISO date/time fields. |

## Profitability QA

Use a configurable target contribution threshold. The current phase-one initial default is `40.00 GBP` net contribution after logistics.

| ID | Scenario | Expected Result |
|---|---|---|
| PROF-01 | High-margin iPhone screen repair in a central postcode. | Free or subsidised standard courier can be shown if contribution remains above threshold. |
| PROF-02 | Low-margin iPhone battery repair in an expensive postcode. | Free courier is hidden; paid/manual/mail-in options are shown instead. |
| PROF-03 | Repair contribution is above threshold before courier but below threshold after two-way logistics. | Free courier is not shown. |
| PROF-04 | Paid courier keeps contribution above threshold. | Paid courier option is shown with the correct Shopify variant. |
| PROF-05 | No courier price band preserves contribution. | Courier is hidden or manual quote/mail-in/drop-off is shown. |
| PROF-06 | Priority or urgent service would make the job unprofitable. | Priority/urgent is hidden even if standard remains available. |
| PROF-07 | Internal subsidy or margin reason exists in decision output. | The UI does not show internal margin language to the customer. |

## Same-Day Eligibility QA

Same-day is only valid for:

- iPhone screen.
- iPhone battery.
- iPhone camera module.

It also requires eligible postcode, confirmed stock, current time before cutoff, remaining same-day capacity, workable courier windows, and acceptable profitability.

| ID | Scenario | Expected Result |
|---|---|---|
| SD-01 | iPhone screen, central postcode, stock available, before cutoff, slots available. | Same-day collection and return can be shown. |
| SD-02 | iPhone battery, eligible postcode, no same-day slots left. | Same-day is hidden; fallback is collection today/return tomorrow or next available service. |
| SD-03 | iPhone camera module, stock available, but after cutoff. | Same-day is hidden. |
| SD-04 | iPhone screen, postcode too far for same-day return. | Same-day return is hidden, even if the repair itself is simple. |
| SD-05 | iPad known repair. | Same-day is never shown; estimated two working days is shown. |
| SD-06 | MacBook known repair. | Same-day is never shown; estimated two working days is shown. |
| SD-07 | Back glass or non-eligible repair. | Same-day is hidden; manual/next-day wording is used. |
| SD-08 | Same-day option fails profitability threshold. | Same-day is hidden or converted to paid upgrade only if still profitable. |

## Stock Check QA

| ID | Scenario | Expected Result |
|---|---|---|
| STOCK-01 | Required iPhone part is confirmed in stock. | Same-day can proceed if all other rules pass. |
| STOCK-02 | Required iPhone part is out of stock. | Same-day is hidden. |
| STOCK-03 | Stock state is unknown. | Same-day is not guaranteed. |
| STOCK-04 | Stock state is unknown but collection is still allowed. | Wizard uses collection-first wording: timing confirmed after stock check. |
| STOCK-05 | Stock changes between quote and checkout. | Order/admin verification flags the quote for review before courier is booked. |

## Diagnostics QA

| ID | Scenario | Expected Result |
|---|---|---|
| DIAG-01 | Customer selects a diagnostic flow. | Wizard does not show a fixed repair turnaround. |
| DIAG-02 | Customer selects diagnostic courier collection. | Copy says timing is confirmed after full diagnostic. |
| DIAG-03 | Diagnostic postcode is courier eligible. | Collection option may be shown, but repair completion time is not promised. |
| DIAG-04 | Diagnostic postcode is not courier eligible. | Mail-in/drop-off/manual option is shown. |
| DIAG-05 | Diagnostic line item reaches cart. | Cart metadata marks the order as diagnostic/assessment-first. |

Required diagnostic copy:

```text
We will collect your device for assessment. Once our technicians have completed a full diagnostic, we will confirm the repair options, cost, and expected turnaround before any repair work goes ahead.
```

## Customer-Facing Wording QA

| ID | Scenario | Expected Result |
|---|---|---|
| COPY-01 | Same-day is available. | UI clearly shows estimated collection and return windows. |
| COPY-02 | Same-day slots remain. | UI may show remaining slots, such as `2 same-day repair slots left today`. |
| COPY-03 | Same-day slots are full. | UI says today's same-day slots are full and gives the next available option. |
| COPY-04 | Stock is unknown. | UI does not promise same-day; it says timing is confirmed after stock check. |
| COPY-05 | iPad/MacBook known repair. | UI says estimated two working days after arrival at iCorrect. |
| COPY-06 | Courier is unavailable. | UI offers mail-in/drop-off/manual quote without blaming postcode or exposing internal logic. |
| COPY-07 | Priority/urgent is unavailable. | UI does not show unavailable premium choices. |
| COPY-08 | Any decision path contains internal reason fields. | Internal reasons are never rendered to the customer. |

## Shopify Cart Metadata QA

When the customer selects a courier option, the cart must preserve enough metadata for operations and audit.

| ID | Scenario | Expected Result |
|---|---|---|
| CART-01 | Customer selects chargeable courier. | Repair variant and courier variant are both added to cart. |
| CART-02 | Customer receives free courier. | Repair variant is added; free courier handling is represented according to the chosen Shopify product strategy. |
| CART-03 | Courier quote is added to cart. | Private metadata includes postcode, outward code, service level, customer charge, subsidy, and estimated windows. |
| CART-04 | Metadata fields use private naming. | Internal keys are prefixed with `_` where Shopify supports private line item properties. |
| CART-05 | Customer changes postcode after selecting courier. | Existing courier option is invalidated and recalculated before checkout. |
| CART-06 | Customer changes repair type after selecting courier. | Profitability and same-day eligibility are recalculated before checkout. |
| CART-07 | Customer quantity is changed in cart. | Wizard/cart flow prevents nonsensical courier quantities or flags for recalculation. |
| CART-08 | Checkout begins with stale quote metadata. | Decision app or order validation detects stale quote and flags for review. |

Required metadata fields:

```text
_courier_quote_id
_courier_postcode
_courier_outward_code
_courier_service_level
_courier_customer_charge_gross
_courier_icorrect_two_way_cost_gross
_courier_subsidy_gross
_courier_margin_band
_estimated_collection_window
_estimated_return_window
_same_day_slot_date
```

## API And Failure-State QA

| ID | Scenario | Expected Result |
|---|---|---|
| FAIL-01 | Decision app is unavailable. | Wizard shows a graceful fallback, such as manual courier quote/mail-in/drop-off. |
| FAIL-02 | Gophr live quote fails during future live pricing. | Existing matrix or manual fallback is used; no broken option is shown. |
| FAIL-03 | Decision response is missing Shopify variant ID. | Option is hidden or marked manual; cart add is blocked. |
| FAIL-04 | Decision response is malformed. | Wizard does not add courier to cart and logs the failure. |
| FAIL-05 | Customer postcode is changed rapidly. | Only the latest decision response updates the UI. |
| FAIL-06 | Same-day slot is consumed during checkout. | Order is flagged for review or customer is moved to the next safe promise. |

## Frontend Quote Wizard QA

| ID | Scenario | Expected Result |
|---|---|---|
| UI-01 | Customer completes normal eligible quote flow. | Wizard reaches service options without layout shift or hidden invalid states. |
| UI-02 | Customer enters postcode before selecting repair. | Wizard waits for required repair data before showing courier promises. |
| UI-03 | Customer selects repair before entering postcode. | Wizard asks for postcode before showing courier options. |
| UI-04 | Customer edits postcode after options load. | Existing options clear and recalculate. |
| UI-05 | Customer selects manual quote path. | Wizard provides clear next step without adding invalid courier products. |
| UI-06 | Mobile viewport. | Courier cards, prices, and estimated windows fit without overlapping. |
| UI-07 | Desktop viewport. | Courier options are scannable and do not expose internal fields. |
| UI-08 | Accessibility pass. | Courier options are keyboard reachable and selected state is announced or visible. |

## Regression Checklist

Run before marking the courier service ready for production:

- `price_gross` is treated as VAT-inclusive.
- Two-way courier cost is used for normal repair collection and return.
- Same-day only appears for eligible iPhone repairs.
- Same-day requires confirmed stock.
- Same-day slot count is respected.
- iPad and MacBook known repairs show two-working-day wording.
- Diagnostics use full-diagnostic wording.
- Profitability threshold prevents unprofitable courier offers.
- Shopify cart contains repair and courier information consistently.
- Internal subsidy/margin/API details are not shown to customers.
- Manual fallback exists for unsupported postcodes and API failures.

## Open QA Decisions

- Final list of representative postcode fixtures for automated tests.
- Final margin threshold and repair profitability table values.
- Exact Shopify courier variant IDs.
- Whether free courier is represented as a zero-price courier variant or metadata-only.
- Whether stale quote validation happens before cart add, before checkout, or in order admin.
