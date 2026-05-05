# London Courier Postcode Product Plan

**Date:** 2026-05-05  
**Branch:** `codex/shopify-website-2026-05-04`  
**Surface:** Quote wizard service selection across redesigned collection, product, and homepage quote flows  
**Theme context:** Existing collection templates already include London Courier service blocks, mostly disabled. This plan turns that dormant service into a quote-wizard option without requiring live booking automation in the first launch.

## Goal

Add a practical first version of London Courier Service without needing live courier booking automation.

The customer should be able to enter a postcode in the quote wizard, receive a fixed London courier price, add that service to checkout, and then enter the full address in Shopify checkout as normal.

This is intentionally simpler than full Gophr API booking. The live API quote/booking flow can come later once the productised postcode map is proven.

## Why This Approach

The original desired end state was:

1. customer enters full address
2. site calls Gophr API
3. site receives a live courier quote
4. customer books collection directly
5. automation creates the courier job

That is still the future phase.

The first production phase should instead be:

1. customer enters postcode only
2. site normalises postcode outward code
3. site looks up a matching Shopify courier product
4. site shows fixed price
5. customer adds repair + courier service to cart
6. customer enters full address at Shopify checkout
7. operations verify checkout address matches the selected postcode/product

This gives the user a clear price early while keeping checkout and fulfilment operationally simple.

## Gophr API Facts

Official Gophr docs confirm:

- Gophr has a V2 Commercial API using REST resources for jobs, deliveries, and parcels.
- Authentication uses an `API-KEY` request header.
- Sandbox base URL is `https://api-sandbox.gophr.com`.
- Production base URL is `https://api.gophr.com`.
- Quotes are obtained via `POST /v2-commercial-api/quotes`.
- Accurate pickup/dropoff address fields matter for geocoding in real jobs.
- Vehicle type and parcel dimensions/weight affect vehicle selection and pricing.

Sources:

- [Gophr Commercial API introduction](https://developers.gophr.com/docs/gophr-commercial-api)
- [Gophr authentication](https://developers.gophr.com/docs/authorisation)
- [Gophr environments](https://developers.gophr.com/docs/environments)
- [Gophr addresses](https://developers.gophr.com/docs/addresses)
- [Gophr vehicle types](https://developers.gophr.com/docs/vehicle-types)
- [Gophr quote endpoint](https://developers.gophr.com/reference/post-quotes-2)

## Phase 1: Build a Postcode Price Map

Use the Gophr API key offline/admin-side to query representative costs from iCorrect's workshop postcode to London destination postcodes.

Workshop origin:

- iCorrect
- 12 Margaret Street
- London
- W1W 8JQ

The quoting script should produce:

- postcode outward code, e.g. `SW11`, `W1`, `EC1`, `N1`
- normalised Shopify handle, e.g. `london-courier-sw11`
- raw Gophr quote
- rounded customer-facing price
- vehicle type assumed
- package assumptions
- whether quote succeeded
- error reason if quote failed
- timestamp of quote run

Suggested output:

`data/london-courier-postcode-map.csv`

Suggested columns:

```csv
outward_code,product_handle,title,gophr_quote,customer_price,vehicle_type,quote_status,error,quoted_at
SW11,london-courier-sw11,London Courier - SW11,18.72,20.00,car,ok,,2026-05-05T00:00:00Z
```

## API Query Assumptions

For initial mapping, use consistent assumptions so prices are comparable:

- pickup address: `12 Margaret Street, London, W1W 8JQ, GB`
- dropoff address: representative postcode centroid or a representative address if Gophr requires full geocoding
- parcel description: `Apple device for repair`
- parcel dimensions: laptop-safe parcel dimensions
- parcel weight: conservative MacBook weight plus packaging
- fragile/glass flag: true if the API accepts it and it affects vehicle assignment
- vehicle: likely car, unless Gophr recommends another vehicle

Important unknown:

Gophr quote API docs expose the endpoint and top-level `pickups` / `dropoffs` request fields, but the public docs do not clearly show every nested field and response property in the crawled view. Before writing the production script, use either:

1. Gophr API Specification/Postman collection, or
2. one manual sandbox request with the account API key,

to confirm exact field names and response shape.

## Phase 2: Create Shopify Courier Products

Create one Shopify product per serviceable postcode outward code.

Product pattern:

- Title: `London Courier - SW11`
- Handle: `london-courier-sw11`
- Product type: `Courier Service`
- Vendor: `iCorrect`
- Price: mapped customer-facing price
- Status: active if serviceable
- Collection: `london-courier-service`
- Tags:
  - `service:london-courier`
  - `postcode:SW11`
  - `courier:gophr`

Recommended metafields:

- `custom.service_type = london_courier`
- `custom.postcode_outward_code = SW11`
- `custom.gophr_quote = 18.72`
- `custom.customer_price = 20.00`
- `custom.vehicle_type = car`
- `custom.quote_source = gophr`
- `custom.quote_run_at = 2026-05-05T00:00:00Z`

Use product variants only if needed later for return-only, collect-only, or collect-and-return pricing. For the first build, one product per outward code is simpler.

## Phase 3: Wizard Behaviour

In the service step, show:

1. Walk-in
2. London courier
3. National mail-in

When the user selects London courier:

1. Ask: "What's your postcode?"
2. Accept full postcode or outward code.
3. Normalise:
   - uppercase
   - remove extra whitespace
   - extract outward code
   - examples:
     - `SW11 2AA` -> `SW11`
     - `sw11` -> `SW11`
     - `W1W 8JQ` -> `W1W`
4. Lookup courier product handle:
   - `london-courier-` + lowercase outward code
5. If product exists:
   - show price
   - add it to cart with the repair product
   - add line item properties with postcode and service method
6. If product does not exist:
   - show a contact/manual quote route

Suggested line item properties:

- `_service_method = london_courier`
- `_postcode_entered = SW11 2AA`
- `_postcode_outward_code = SW11`
- `_courier_product_handle = london-courier-sw11`
- `_courier_quote_source = postcode_product`
- `_device`
- `_model`
- `_fault`
- `_repair_product_handle`

Customer-facing copy:

- Success: `London courier available for SW11: £20. You'll enter your full collection address at checkout.`
- No match: `We may still be able to collect from this postcode. Continue with walk-in/mail-in or contact us for a manual courier quote.`
- Verification note: `Please use the same postcode at checkout so we can confirm your collection correctly.`

## Phase 4: Operations Process

When an order comes in with London courier:

1. Check courier service product in order.
2. Check line item property `_postcode_outward_code`.
3. Check checkout shipping postcode.
4. Confirm shipping postcode outward code matches courier product.
5. If mismatch:
   - contact customer before booking courier
   - collect extra payment or refund difference if needed
6. Book Gophr manually using full checkout address.
7. Add courier tracking/booking reference to order notes.

This is deliberately operationally boring. It avoids needing an address API, live quote widget, or courier booking automation in the first launch.

## Future Phase: Live Gophr Quote and Booking

Once postcode-product pricing is proven, replace or augment the lookup with live API flow:

1. customer enters full address in the wizard
2. site/backend calls Gophr `POST /quotes`
3. site shows live price and service options
4. customer pays
5. backend creates draft/confirmed Gophr job after Shopify order payment
6. order receives Gophr job ID and tracking link
7. status webhooks update the order timeline or internal ops system

Do not make this Phase 1. It needs a secure backend because the Gophr API key must not be exposed in frontend JavaScript.

## Security Note

Never call Gophr directly from theme JavaScript with the API key. Shopify theme JavaScript is public. The API key must only be used from:

- local/admin scripts
- secure backend
- Shopify app/proxy
- automation environment

For Phase 1, the storefront only looks up public Shopify products and prices. That is safe.

## Build Tasks Later

1. Confirm exact Gophr quote request body using API spec/Postman.
2. Write script to quote target outward postcodes.
3. Generate `data/london-courier-postcode-map.csv`.
4. Review and round customer-facing prices.
5. Create/update Shopify courier products.
6. Add wizard postcode lookup.
7. Add cart line item properties.
8. Add ops checklist and order verification note.
9. Add analytics:
   - `courier_postcode_entered`
   - `courier_quote_found`
   - `courier_quote_missing`
   - `courier_service_selected`

## Open Decisions

1. Is the courier product price one-way collection only, or collection plus return?
2. Should all repairs offer London courier, or only selected device categories?
3. What is the minimum customer-facing margin/rounding rule above raw Gophr quote?
4. Should serviceable postcodes include only central London at launch or all Gophr-quoted London outward codes?
5. Should mismatch at checkout block fulfilment manually or trigger an automatic payment adjustment later?
