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
- Internal courier cost, margin, subsidy, and Gophr details must not be visible in the UI, client-side decision response, or cart properties.
- Free courier is represented by a zero-price Shopify courier variant in phase one.
- Same-day slots are reserved atomically on cart add, expire after 15 minutes, and are confirmed when an order is created.

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

Canonical fixture postcodes:

| Fixture ID | Postcode | Band | Why It Exists |
|---|---|---|---|
| FX-01 | `W1B 2EL` | `standard_free_candidate_priority_available` | Central low-cost benchmark; 3-hour gross starts at `8.54 GBP`. |
| FX-02 | `SW1A 1AA` | `standard_free_candidate_priority_available` | Central Westminster fixture. |
| FX-03 | `E1 7QX` | `standard_paid_priority_available` | Inner-east paid-standard fixture; 3-hour gross starts at `11.28 GBP`. |
| FX-04 | `N1 0QH` | `standard_paid_priority_available` | Known `one_hour_9_10` motorcycle 502 data-gap fixture. |
| FX-05 | `E14 5AB` | `standard_premium_review_priority_optional` | Premium-review fixture; 3-hour gross starts at `21.08 GBP`. |
| FX-06 | `N4 2DH` | `standard_premium_review_priority_optional` | North London premium-review fixture. |
| FX-07 | `E10 5PS` | `outer_manual_or_motorbike_only` | Outer manual/paid-only fixture; 3-hour gross starts at `30.52 GBP`. |
| FX-08 | `W7 3SA` | `outer_manual_or_motorbike_only` | Most expensive urgent candidate in the summary. |
| FX-09 | `M1 1AE` | Out of matrix | Valid non-London postcode; should fall to mail-in/manual. |
| FX-10 | `BAD POSTCODE` | Invalid | Malformed postcode validation fixture. |

Profitability fixtures use the current phase-one target contribution of `40.00 GBP` net after logistics.

| Repair Fixture | Repair Type | Repair Price Net | Parts | Labour | Platform Allowance | Expected Use |
|---|---|---:|---:|---:|---:|---|
| RF-01 | iPhone screen | 120.00 | 35.00 | 20.00 | 5.00 | High-margin same-day candidate. |
| RF-02 | iPhone battery | 65.00 | 22.00 | 15.00 | 4.00 | Low-margin courier-risk candidate. |
| RF-03 | iPhone camera module | 110.00 | 45.00 | 20.00 | 5.00 | Same-day only when stock and timing pass. |
| RF-04 | iPad known repair | 140.00 | 55.00 | 30.00 | 6.00 | Two-working-day wording candidate. |
| RF-05 | MacBook known repair | 220.00 | 80.00 | 45.00 | 8.00 | Two-working-day wording candidate. |
| RF-06 | Diagnostic | 0.00 | 0.00 | 0.00 | 0.00 | Assessment-first wording candidate. |

Source of truth for profitability assertions:

```text
subsidy = two_way_courier_cost_gross - customer_courier_charge_gross
net_contribution_after_logistics =
  repair_price_net
  - estimated_parts_cost
  - estimated_labour_cost
  - payment_and_platform_allowance
  - two_way_courier_cost_gross
  + customer_courier_charge_gross
```

## Postcode Coverage QA

| ID | Scenario | Expected Result |
|---|---|---|
| PC-01 | Customer enters a full postcode covered by the matrix. | Engine normalises to outward code and returns the correct courier band. |
| PC-02 | Customer enters lowercase postcode with spaces. | Engine normalises postcode and produces the same result as uppercase input. |
| PC-03 | Customer enters a postcode with no matrix match. | Wizard shows mail-in/drop-off or manual courier quote, not live courier options. |
| PC-04 | Customer enters malformed postcode. | Wizard asks for a valid postcode and does not call checkout/cart logic. |
| PC-05 | Postcode maps to `outer_manual_or_motorbike_only`. | Wizard hides free courier and only shows paid/manual-safe options. |
| PC-06 | Known Gophr data gap occurs, such as `N1` 1-hour motorcycle 502. | Engine falls back to the next safe option or marks urgent unavailable. |
| PC-07 | Customer enters a valid UK postcode outside the London matrix, such as `M1 1AE`, `B15 2TT`, `EH1 1YZ`, `BT1 5GS`, `JE2 3QA`, or `IM1 1AD`. | Wizard shows mail-in/drop-off/manual quote, not London courier. |
| PC-08 | Customer enters outward code only, such as `W1`. | Wizard asks for a full postcode before showing courier options. |

## Pricing And VAT QA

| ID | Scenario | Expected Result |
|---|---|---|
| VAT-01 | Matrix row has `price_net` and `price_gross`. | Customer-facing baseline uses `price_gross`; no extra 20% VAT is added. |
| VAT-02 | One-way gross courier cost is `8.54 GBP`. | Two-way baseline is calculated as `17.08 GBP` before customer subsidy/charge. |
| VAT-03 | Courier option is free to customer. | `customer_courier_charge_gross = 0`, subsidy equals two-way cost. |
| VAT-04 | Courier option is paid by customer. | `subsidy = two_way_courier_cost - customer_courier_charge`; the contribution formula above is used. |
| VAT-05 | Spreadsheet displays ETA/date fields as numeric serials. | QA ignores spreadsheet serial formatting and validates source ISO date/time fields. |
| VAT-06 | Inbound and outbound prices differ in a future live-pricing flow. | Two-way cost is calculated as `inbound_gross + outbound_gross`, not blindly as `one_way_gross x 2`. |

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
| PROF-07 | Internal subsidy or margin reason exists in the server-side decision record. | The client API response and UI do not expose internal margin language. |
| PROF-08 | Net contribution lands at `39.99 GBP`, `40.00 GBP`, and `40.01 GBP`. | Boundary behaviour matches the configured threshold exactly. |
| PROF-09 | Inbound and outbound courier costs are asymmetric. | Profitability uses the sum of both legs. |

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
| SD-07 | Back glass repair. | Same-day is hidden; manual/next-day wording is used. |
| SD-08 | Same-day option fails profitability threshold. | Same-day is hidden or converted to paid upgrade only if still profitable. |
| SD-09 | Customer views same-day availability but abandons before cart add. | Same-day slot is not consumed. |
| SD-10 | Two customers attempt to add the last same-day slot to cart at the same time. | Only one reservation succeeds; the other customer sees the next safe option. |
| SD-11 | Same-day reservation is added to cart but no order is created within 15 minutes. | Reservation expires and slot becomes available again. |
| SD-12 | Request is for a future date, not today. | Same-day wording is not shown; date-specific capacity and courier windows are used. |
| SD-13 | Request time is `11:59`, `12:00`, and `12:01` London time. | Cutoff boundary behaviour is deterministic and matches the implementation rule. |
| SD-14 | Same-day capacity is `3`, then `2`, `1`, and `0` remaining. | UI and decision output match each boundary state. |
| SD-15 | Non-eligible known repair other than back glass. | Same-day is hidden and the repair-specific fallback wording is used. |

## Stock Check QA

| ID | Scenario | Expected Result |
|---|---|---|
| STOCK-01 | Required iPhone part is confirmed in stock. | Same-day can proceed if all other rules pass. |
| STOCK-02 | Required iPhone part is out of stock. | Same-day is hidden. |
| STOCK-03 | Stock state is unknown for a known repair quote. | Same-day is hidden. |
| STOCK-04 | Stock state is unknown and the customer chooses a collection-first path. | Wizard uses collection-first wording: timing confirmed after stock check. |
| STOCK-05 | Stock changes between quote and checkout. | Decision app revalidates stock on cart add and order creation; if the stock state no longer supports the promise, same-day is removed or the order is flagged for operations review before courier is booked. |
| STOCK-06 | Stock is checked for an ineligible repair type. | Stock availability does not cause same-day to appear for non-eligible repairs. |

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
| COPY-09 | Manual courier quote path is shown. | Customer sees a clear next step: mail-in, drop-off, phone, or manual quote CTA. |
| COPY-10 | UK formatting is rendered. | Prices use `£`, dates use UK-friendly formatting, and collection windows use 24-hour time. |

## Shopify Cart Metadata QA

When the customer selects a courier option, the cart must preserve enough metadata for operations and audit.

| ID | Scenario | Expected Result |
|---|---|---|
| CART-01 | Customer selects chargeable courier. | Repair variant and courier variant are both added to cart. |
| CART-02 | Customer receives free courier. | Repair variant and zero-price courier variant are both added to cart. |
| CART-03 | Courier quote is added to cart. | Customer-safe private metadata includes quote ID, postcode, outward code, service level, customer charge, estimated windows, and repair flow type. |
| CART-04 | Metadata fields use private naming. | Internal keys are prefixed with `_` where Shopify supports private line item properties. |
| CART-05 | Customer changes postcode after selecting courier. | Existing courier option is invalidated and recalculated before checkout. |
| CART-06 | Customer changes repair type after selecting courier. | Profitability and same-day eligibility are recalculated before checkout. |
| CART-07 | Customer quantity is changed in cart. | Courier quantity cannot exceed the associated repair quantity; `0`, negative, or unrelated quantities are blocked/recalculated. |
| CART-08 | Checkout begins more than 15 minutes after quote reservation. | Decision app or order validation detects stale quote and flags for review/recalculation. |
| CART-09 | Shopify order admin/export is inspected. | Customer-safe courier metadata is visible enough for operations audit. |

Required metadata fields:

```text
_courier_quote_id
_courier_postcode
_courier_outward_code
_courier_service_level
_courier_customer_charge_gross
_estimated_collection_window
_estimated_return_window
_same_day_slot_date
_repair_flow_type
```

Fields that must not be present in client responses or cart metadata:

```text
_courier_icorrect_two_way_cost_gross
_courier_subsidy_gross
_courier_margin_band
net_contribution_after_logistics
gophr_api_key
gophr_raw_response
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
| FAIL-07 | Decision API response exceeds performance budget. | P95 decision response remains below 400ms and wizard interaction-to-options remains below 800ms. |
| FAIL-08 | Client rapidly sends postcode enumeration requests. | Endpoint rate limits or throttles abusive traffic. |
| FAIL-09 | Theme bundle is built. | Secret scan confirms no Gophr API key or private margin table is present in theme assets. |

## Frontend Quote Wizard QA

| ID | Scenario | Expected Result |
|---|---|---|
| UI-01 | Customer completes normal eligible quote flow. | Wizard reaches service options without layout shift or hidden invalid states. |
| UI-02 | Customer enters postcode before selecting repair. | Wizard waits for required repair data before showing courier promises. |
| UI-03 | Customer selects repair before entering postcode. | Wizard asks for postcode before showing courier options. |
| UI-04 | Customer edits postcode after options load. | Existing options clear and recalculate. |
| UI-05 | Customer edits repair type after options load. | Existing options clear and recalculate. |
| UI-06 | Customer selects manual quote path. | Wizard provides clear next step without adding invalid courier products. |
| UI-07 | Mobile viewports at 320, 375, 414, and 768px. | Courier cards, prices, and estimated windows fit without overlapping. |
| UI-08 | Desktop viewport. | Courier options are scannable and do not expose internal fields. |
| UI-09 | Accessibility pass. | Courier options are keyboard reachable, focus is visible, errors are announced, slot updates use `aria-live`, and unavailable options have sufficient contrast. |
| UI-10 | Screen reader reaches postcode and service selection. | Labels and error messages are understandable without visual context. |

## Timezone And Date QA

| ID | Scenario | Expected Result |
|---|---|---|
| TIME-01 | Request originates from a non-London timezone. | Same-day cutoff is evaluated in Europe/London time, not client timezone. |
| TIME-02 | Date falls in BST. | Collection/return windows use correct London offset. |
| TIME-03 | Date falls in GMT. | Collection/return windows use correct London offset. |
| TIME-04 | Date is the last Sunday in March or October. | DST transition does not shift cutoff or windows incorrectly. |
| TIME-05 | Requested date is tomorrow or next Monday. | Same-day wording is hidden and the correct date-specific capacity bucket is used. |

## Security And Privacy QA

| ID | Scenario | Expected Result |
|---|---|---|
| SEC-01 | Inspect decision API response in browser dev tools. | Response contains only customer-safe option fields and Shopify variant IDs. |
| SEC-02 | Inspect cart add request. | Request does not include internal cost, subsidy, margin band, profitability, Gophr key, or raw Gophr payload. |
| SEC-03 | Inspect built theme assets. | No Gophr API key, private cost table, or margin formula is bundled into theme JavaScript. |
| SEC-04 | Repeated postcode probes are sent. | Endpoint throttles or rate-limits enumeration-style traffic. |
| SEC-05 | Invalid or tampered Shopify variant ID is submitted. | Server rejects or recalculates before allowing checkout/order validation. |

## Observability QA

| ID | Scenario | Expected Result |
|---|---|---|
| OBS-01 | Decision app returns courier options. | Server logs quote ID, postcode band, repair type, allowed option count, and selected service without exposing secrets. |
| OBS-02 | Same-day is unavailable. | Log records the non-customer reason category, such as stock, cutoff, capacity, margin, postcode, or courier timing. |
| OBS-03 | Manual fallback is shown. | Log records fallback category so operations can monitor postcode/service gaps. |
| OBS-04 | Same-day never appears for a day. | Metrics make this visible for operational investigation. |
| OBS-05 | Reservation expires. | Expiry event is logged and capacity is restored. |

## Regression Checklist

Run before marking the courier service ready for production:

- `price_gross` is treated as VAT-inclusive.
- Two-way courier cost is used for normal repair collection and return.
- Same-day only appears for eligible iPhone repairs.
- Same-day requires confirmed stock.
- Same-day slot count is respected.
- Same-day slot reservation is atomic and expires after 15 minutes.
- iPad and MacBook known repairs show two-working-day wording.
- Diagnostics use full-diagnostic wording.
- Profitability threshold prevents unprofitable courier offers.
- Shopify cart contains repair and courier information consistently.
- Internal subsidy/margin/API details are not shown to customers or sent to the browser.
- Manual fallback exists for unsupported postcodes and API failures.

## Out Of Scope For Phase One QA

- Non-London courier productisation beyond mail-in/drop-off/manual fallback.
- Cross-border courier, offshore UK routing, business account SLAs, and bulk repair flows.
- Live Gophr booking automation after checkout.
- Full workshop management integration beyond same-day slot capacity and stock-aware eligibility.
- Automated inventory sync, unless stock checks are implemented before launch.
- Post-repair customer notification flows after the Shopify order is created.

## Open QA Decisions

| Decision | Owner | Target |
|---|---|---|
| Final margin threshold and repair profitability table values. | Ricky, with Codex modelling support. | 2026-05-08, before phase-one cart wiring starts. |
| Exact Shopify courier variant IDs. | Ricky for Shopify admin setup; Codex for theme/app mapping. | 2026-05-08, before phase-one cart wiring starts. |
