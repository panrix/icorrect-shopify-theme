# London Courier Decision Contract

**Date:** 2026-05-22  
**Status:** Phase-one prototype contract  
**Implementation:** `scripts/analysis/courier_decision_contract.py`  
**Fixture checks:** `scripts/analysis/courier_decision_contract_fixtures.py`

## Goal

Give the redesigned quote wizard a stable, customer-safe payload for London courier decisions.

The existing decision engine remains responsible for postcode coverage, two-way courier cost, profitability, same-day eligibility, stock state, and slot state. This contract wrapper is the boundary the Shopify/front-end work should build against.

## Production Split

```text
Shopify theme / quote wizard
  collects postcode + selected repair context
  calls courier decision app
  renders returned options only
  adds selected repair variant + courier variant to cart

Courier decision app
  validates postcode and repair type
  applies stock, slot, profitability, timing, and postcode rules
  returns the contract payload
  stores internal decision details server-side by quote_id

Operations / courier booking
  uses confirmed order metadata
  revalidates stock, slot, customer address, and courier promise
  books Gophr after checkout/payment
```

The Shopify theme must not contain Gophr credentials, raw Gophr payloads, internal courier costs, subsidy logic, margin bands, or profitability calculations.

## Request Shape

The phase-one prototype accepts these fields:

| Field | Source | Notes |
|---|---|---|
| `postcode` | Customer | Full UK postcode. Outward-only values ask for the full postcode before options are shown. |
| `repair_type` | Quote wizard | Canonical key such as `iphone_screen`, `iphone_battery`, `diagnostic`, `macbook_known_repair`. |
| `stock` | Backend/fixture | `available`, `unavailable`, or `unknown`. In production, this should not be trusted from browser input. |
| `same_day_slots` | Backend/fixture | Remaining same-day courier repair capacity. Viewing options does not consume a slot. |
| `action` | Theme/backend | `quote` for viewing options, `reserve` for add-to-cart reservation. |
| `now` | Backend/fixture | Prototype/test input. Production should use server time in `Europe/London`. |

Example:

```bash
python3 scripts/analysis/courier_decision_contract.py \
  --postcode "W1B 2EL" \
  --repair-type iphone_screen \
  --stock available \
  --now "2026-05-06T10:30:00+01:00"
```

## Response Shape

Top-level fields:

| Field | Purpose |
|---|---|
| `schema_version` | Pinned as `courier_decision.v1`. |
| `quote_id` | Stable ID for cart metadata and later server-side lookup. |
| `status` | `ok`, `manual_fallback`, `invalid_postcode`, `full_postcode_required`, or `invalid_repair_type`. |
| `postcode` | Customer-safe postcode summary: input, normalised value, outward code, band, coverage state. |
| `repair` | Customer-safe repair context: repair type, flow type, same-day eligibility. |
| `same_day_slots_remaining` | Displayable slot count from the decision state. |
| `turnaround_message` | Repair timing copy where applicable, including diagnostic and two-working-day wording. |
| `reservation` | Quote/reserve state with 15-minute TTL. |
| `options` | Renderable courier options. Empty when checkout must be blocked. |
| `errors` | Validation or repair-type messages. Empty on successful quotes. |

Option fields:

| Field | Purpose |
|---|---|
| `option_id` | Quote-scoped selected option ID. |
| `service_level` | `standard`, `priority`, `urgent`, or `manual`. |
| `label` | Customer-facing service label. |
| `customer_price_gross` | VAT-inclusive customer courier price in GBP, or empty/manual when not chargeable. |
| `currency` | Always `GBP`. |
| `estimated_collection_window` | Customer-facing collection estimate. |
| `estimated_return_window` | Customer-facing return estimate. |
| `same_day_return` | Boolean promise flag. |
| `shopify_variant_id` | Placeholder now; real courier variant ID later. |
| `customer_message` | Optional safe copy for diagnostic/manual paths. |
| `cart_properties` | Stable Shopify line-item properties for the selected courier option. |

## Shopify Cart Properties

Every selectable courier option includes this exact property set:

```text
_courier_schema_version
_courier_quote_id
_courier_option_id
_courier_postcode
_courier_outward_code
_courier_service_level
_courier_customer_charge_gross
_estimated_collection_window
_estimated_return_window
_same_day_slot_date
_repair_flow_type
```

These are private-style Shopify line item properties for operational clarity. They are customer-safe, but not treated as secure storage because browser requests can still be inspected.

## Blocked And Fallback States

| Scenario | Contract behaviour |
|---|---|
| Malformed postcode | `status: invalid_postcode`, `options: []`, checkout blocked. |
| Outward-only postcode | `status: full_postcode_required`, `options: []`, checkout blocked. |
| Valid postcode outside matrix | `status: manual_fallback`, manual option returned. |
| Courier/postcode unprofitable | `status: manual_fallback`, manual option returned. |
| Diagnostic repair | Assessment-first wording; no fixed repair turnaround; no same-day promise. |
| iPad/MacBook known repair | Two-working-day wording after arrival at iCorrect. |
| Stock unknown/out of stock | Same-day hidden. |
| Same-day slot count `0` | Same-day hidden. |
| Reserve action | Eligible same-day option returns `slot_reserved: true` and `expires_at`. |

## Denied Fields

The contract fixture checks scan normal output for these denied tokens:

```text
gophr
subsidy
margin
net_contribution
one_way_cost
two_way_cost
api_key
raw_response
```

Normal contract output also allows private underscore keys only inside the approved Shopify cart property set.

## Current Test Command

```bash
python3 scripts/analysis/courier_decision_contract_fixtures.py
```

The fixture runner covers:

- central London quote shape;
- stable cart property keys;
- malformed postcode checkout blocking;
- valid non-London manual fallback;
- diagnostic assessment wording;
- quote versus reserve slot semantics;
- denied-field leak scanning;
- CLI JSON output shape.

## Next Integration Step

The quote wizard should call an HTTP version of this contract before rendering courier choices. Until that app exists, the Liquid/JS implementation should treat this Python contract output as the source of truth for field names and allowed states.
