# London Courier Decision Engine Spec

**Date:** 2026-05-05
**Status:** Phase-one build spec
**Source data:** `data/gophr-london-coverage-matrix-2026-05-05.csv`
**Summary data:** `data/gophr-london-coverage-decision-summary-2026-05-05.csv`

## Goal

Build a decision layer that lets the redesigned quote wizard show profitable, realistic courier repair options by postcode, repair type, repair price, service window, and same-day workshop capacity.

The Shopify theme should own the customer experience. A small decision app should own the business logic. Shopify products and variants should own the chargeable courier line items.

## Why This Exists

The Gophr matrix is one-way pricing. A real repair journey usually needs two courier legs:

1. Customer to iCorrect.
2. iCorrect back to customer.

That means a `price_gross` of `25.00 GBP` is a roughly `50.00 GBP` two-way logistics cost before any subsidy. The website must not offer free or heavily subsidised courier options where the repair margin cannot support them.

## Phase-One Architecture

```text
Quote wizard
  -> collects device, fault, repair price, postcode, preferred speed
  -> calls courier decision app
  -> receives allowed service options
  -> shows only profitable and operationally realistic options
  -> adds repair product and courier variant to Shopify cart
  -> stores quote metadata as line item/cart attributes
```

Liquid should render the theme and known Shopify data. Vanilla JavaScript should run the wizard UI and call the decision endpoint. The decision app should calculate courier options, subsidy, same-day eligibility, and recommended Shopify variant IDs.

## Inputs

The decision app needs:

| Field | Purpose |
|---|---|
| `postcode` | Finds outward postcode coverage and courier band. |
| `repair_type` | Determines same-day eligibility and repair duration. |
| `stock_available` | Prevents same-day promises for repairs where required parts are not available. |
| `repair_price_gross` | Customer-facing repair price. |
| `repair_price_net` | Commercial contribution calculation. |
| `estimated_parts_cost` | Repair profitability calculation. |
| `estimated_labour_cost` | Repair profitability calculation. |
| `service_preference` | Standard, priority, urgent, or no preference. |
| `requested_date` | Same-day and capacity calculation. |
| `current_time` | Cutoff and collection window calculation. |

## Outputs

The decision app returns a list of customer-safe options:

```json
{
  "postcode": "W1T",
  "postcode_band": "standard_free_candidate_priority_available",
  "same_day_slots_remaining": 2,
  "options": [
    {
      "service_level": "standard",
      "label": "Free standard courier",
      "customer_price_gross": 0,
      "icorrect_one_way_cost_gross": 8.54,
      "icorrect_two_way_cost_gross": 17.08,
      "icorrect_subsidy_gross": 17.08,
      "net_contribution_after_logistics": 52.30,
      "estimated_collection_window": "12:00-15:00",
      "estimated_return_window": "17:00-19:00",
      "same_day_return": true,
      "shopify_variant_id": "gid://shopify/ProductVariant/...",
      "decision_reason": "central postcode, profitable repair, same-day slot available"
    }
  ]
}
```

## Courier Service Levels

Phase one should use price-band variants rather than one Shopify product per postcode.

| Service | Customer Promise | Shopify Charge Shape |
|---|---|---|
| Standard | Slower collection/return window, default option. | Free, subsidised, or paid variant. |
| Priority | Shorter collection and return window. | Paid upgrade only unless margin is strong. |
| Urgent | Fastest same-day/direct option. | Premium paid upgrade. |
| Manual | Not enough margin or operational certainty. | Hide courier or show manual quote path. |

Suggested initial courier variants:

- London Courier Standard - Free
- London Courier Standard - 9.99
- London Courier Standard - 14.99
- London Courier Standard - 19.99
- London Courier Priority - 24.99
- London Courier Priority - 34.99
- London Courier Urgent - 39.99
- London Courier Urgent - 49.99
- London Courier Manual Quote

## Profitability Model

Every courier option must pass a contribution test before it is shown.

```text
repair_price_net
- estimated_parts_cost
- estimated_labour_cost
- payment_and_platform_allowance
- two_way_courier_cost_gross
+ customer_courier_charge_gross
= net_contribution_after_logistics
```

The first implementation can use conservative estimated costs stored in a repair profitability table. Later, these values can come from product metafields or an operations system.

Recommended phase-one thresholds:

| Result | Rule |
|---|---|
| Free courier | Only if contribution after full courier subsidy clears the target margin. |
| Subsidised courier | Show paid courier if the customer contribution keeps the repair above target margin. |
| Paid courier only | Show only courier variants that prevent the job going below target contribution. |
| Manual/mail-in/drop-off | Hide courier if no option preserves margin. |

The target contribution should be configurable. Until real margin data is loaded, use a conservative initial default of `40.00 GBP` net contribution after logistics.

## Service Promise Model

Courier eligibility is not enough. Same-day repair must also pass a timing and capacity test.

```text
postcode
+ current time
+ inbound courier window
+ repair duration
+ same-day slot availability
+ required stock availability
+ outbound courier window
= same-day possible / next-day only / manual review
```

Phase-one repair durations:

| Repair Type | Same-Day Eligible | Duration Allowance |
|---|---:|---:|
| iPhone screen | Yes, only if stock is available | 90 minutes |
| iPhone battery | Yes, only if stock is available | 90 minutes |
| iPhone camera module | Yes, only if stock is available | 120 minutes |
| iPad known repair | No by default | Two working days |
| MacBook known repair | No by default | Two working days |
| Back glass | No by default | Manual/next-day |
| Diagnostic | No fixed promise | Assessment wording only |

## Same-Day Capacity

Phase one should cap same-day courier repairs without requiring full workshop management integration.

Recommended initial rule:

```text
same_day_slots_total = 3 per day
same_day_cutoff = 12:00 local London time
```

Same-day can be shown only if:

- Postcode is in a same-day eligible band.
- Repair type is same-day eligible.
- Required stock is available or the stock state is confidently known.
- Current time is before cutoff.
- A same-day slot remains.
- Inbound and outbound courier windows can complete within the working day.
- The repair remains profitable after two-way logistics.

If stock is unknown, same-day should not be guaranteed. The UI should either hide same-day or use a softer collection-first message:

```text
We can collect today and confirm the repair timing after checking part availability.
```

If slots are gone, the UI should fall back to:

```text
Collection today, return tomorrow
```

If courier timing is too tight, the UI should fall back to:

```text
Earliest return tomorrow
```

## Customer UI Behaviour

The quote wizard should never show internal margin language. It should translate decisions into clear customer options:

- Free standard collection and return.
- Standard courier available.
- Priority courier available.
- Same-day collection and return available.
- Collection today, return tomorrow.
- Courier not available for this repair/postcode; offer mail-in or drop-off.
- Diagnostic collection available, with timing confirmed after assessment.

Example UI metadata:

```text
Estimated collection: Today, 12:00-15:00
Estimated return: Today, 17:00-19:00
2 same-day repair slots left today
```

## Shopify Cart Contract

When the customer selects an option, the theme should add:

1. The repair product/variant.
2. The courier product/variant, if chargeable.
3. Hidden metadata for operations and audit.

Suggested private line item/cart metadata:

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

## Phase-One Data Tables

The decision app needs these local tables:

| Table | Source |
|---|---|
| Postcode courier matrix | Generated Gophr CSV matrix. |
| Courier decision summary | Generated decision CSV. |
| Shopify courier variants | Manually configured variant IDs. |
| Repair profitability | Initial static table, later metafields/admin-managed. |
| Repair turnaround rules | Static repair-type rules for same-day, two-working-day, and diagnostic flows. |
| Stock availability | Initial manual/static stock state, later inventory/API-backed. |
| Same-day capacity | Date-based slot counter. |

## Turnaround Messaging

Known repairs can have customer-facing turnaround estimates. Diagnostics need a different promise because the repair scope is unknown until inspection.

| Flow | Customer-Facing Promise |
|---|---|
| Eligible iPhone known repair with stock | Same-day may be offered if postcode, cutoff, capacity, and margin rules pass. |
| Eligible iPhone known repair without confirmed stock | Do not guarantee same-day; offer collection with timing confirmed after stock check. |
| iPad known repair | Estimated two working days after the device arrives at iCorrect. |
| MacBook known repair | Estimated two working days after the device arrives at iCorrect. |
| Diagnostic | Collection/assessment first; repair options and timing confirmed after diagnosis. |

Suggested diagnostic copy:

```text
We will collect your device for assessment. Once our technicians have inspected it, we will confirm the repair options, cost, and expected turnaround before any repair work goes ahead.
```

## Risks And Guardrails

- Do not expose Gophr API keys or margin logic in theme JavaScript.
- Do not promise same-day globally.
- Do not promise same-day unless required iPhone parts are confirmed in stock.
- Do not use one postcode product per postcode unless the decision app cannot be built.
- Do not show free courier when two-way logistics would make the repair unprofitable.
- Treat the `N1` one-hour motorcycle 502 as a data gap to retest before production import.
- Keep copy conservative where timing is estimated.

## Build Sequence

1. Implement a local decision-engine prototype that reads the generated CSVs.
2. Add a static repair profitability table for core iPhone repairs.
3. Add configurable margin thresholds and same-day slot caps.
4. Test scenario fixtures across central, zone two, and outer postcodes.
5. Create Shopify courier products/variants for price bands.
6. Wire the quote wizard to call the decision endpoint.
7. Add selected repair and courier variants to cart with private metadata.
8. Add order/admin verification workflow later.

## Open Decisions

- Final minimum contribution threshold after logistics.
- Exact courier variant price bands.
- Whether `same_day_slots_total` starts at 2 or 3.
- Whether same-day return should be hidden after 12:00 or allowed for very central postcodes until a later cutoff.
- Whether customer-facing copy says "estimated" or "expected" for collection/return windows.
