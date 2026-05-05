# iCorrect Website Redesign Roadmap

**Date:** 2026-05-05  
**Branch:** `codex/shopify-website-2026-05-04`  
**Goal:** Move the current Shopify theme from its existing generic look into the new professionally designed iCorrect system, with stronger content structure and quote wizards placed at or near the top of key pages.

## Why This Work Matters

Current conversion is still under 1%. The new Claude Design mockups look materially more credible for the target market: affluent Apple users who expect precision, trust, and polish. The current site has useful content and working Shopify flows, but visually it reads more generic and less premium than the business actually is.

The redesign should make iCorrect feel like the specialist workshop it is:

- Apple-adjacent, but warmer and more human
- technical, precise, and trustworthy
- premium without feeling inaccessible
- proof-led rather than hype-led
- clear path to a quote or booking above the fold

## Source Mockups

All reviewable mockups are staged here:

`docs/mockups/icorrect-website-redesign-2026-05-05/`

Key entries:

- Collection: `collection/MacBook Screen Collection.html`
- Product: `product/MacBook Screen Repair - Product.html`
- Homepage: `homepage/iCorrect Homepage.html`
- Hub: `index.html`

Production code should not copy React directly. Use the mockups as the visual and interaction blueprint, then convert to Shopify-native Liquid, CSS, and vanilla JS.

## Core UX Direction

### Quote Comes First

The quote wizard is the proven commercial engine. On key pages it should be visible:

- directly inside the hero, or
- immediately underneath the hero before long explanatory content

This applies first to:

1. Homepage
2. MacBook screen collection
3. Product pages
4. Other high-intent collection pages

### Homepage CTAs

The intended homepage has two CTA paths:

1. **Get a quote** — routes into the newly styled quote wizard.
2. **Help me diagnose** — routes into a diagnostic-help flow.

Phase 1 should prioritize **Get a quote** because it can ship with the existing product/service structure.

The diagnostic CTA should remain a strategic direction, but it depends on support content that does not exist yet. It should not be treated as fully shippable until the diagnostic article/content sprint exists.

## Phasing

### Phase 0 — Mockups and Mapping

Status: started.

Completed:

- Mockups imported into `docs/mockups/icorrect-website-redesign-2026-05-05/`
- Collection conversion spec written at `docs/collection-redesign-conversion-spec-2026-05-05.md`

Still needed:

- Product page conversion spec
- Homepage conversion spec
- Content-flow review after technical mapping

### Phase 1 — Visual System and Quote-First Collection Page

Goal: ship the new look and feel on the MacBook screen collection while keeping the quote flow production-safe.

Build:

- shared redesign CSS tokens
- MacBook screen collection hero + trust band
- new styled quote wizard surface near the top
- real Shopify product grid below the wizard
- identify helper
- process/proof/warranty/FAQ/location sections

Use:

- Liquid for Shopify data
- CSS for visual system
- vanilla JS for wizard interaction
- no React in production

Success criteria:

- collection page visually matches the mockup direction
- quote wizard is above or near the fold on mobile
- products/prices/URLs come from Shopify, not hardcoded mockup data
- page renders without React/Babel/CDN prototype dependencies
- no obvious page-speed regression

### Phase 2 — New Styled Quote Wizard Across Key Surfaces

Goal: make the quote wizard feel like the new site system, not a bolted-on form.

The wizard should support:

1. select device/model
2. select fault/issue
3. show quote or diagnostic route
4. select service method
5. collect required booking/contact details
6. add the correct repair/service item to cart or route to contact/diagnostic

Key surfaces:

- homepage quote section
- collection hero wizard
- product page configurator/wizard

Important: keep the existing Shopify-native data hooks from `sections/quote-wizard.liquid` where possible.

### Phase 3 — Service Options Including London Courier

Goal: make service choice clear and conversion-oriented.

Service methods should become:

1. **Walk-in / drop-off**
   - customer brings device to Fitzrovia
   - reserve slot where applicable
   - no courier fee

2. **London courier**
   - new service option
   - positioned for London customers who want collection/return convenience
   - should collect postcode, address, date, and time window
   - automation is not built yet, so first implementation must capture structured order details reliably

3. **National mail-in**
   - UK-wide postal option
   - collect customer contact/address expectations
   - explain secure postage/return flow

The new London courier option should not wait for full courier automation. Phase 1 can capture intent and order properties; automation can follow.

#### London Courier Data to Capture

At minimum, the wizard/order should capture:

- service method: `london_courier`
- customer name
- email
- phone
- collection address
- postcode
- preferred collection date
- preferred collection time window
- selected device
- selected model
- selected fault/issue
- selected repair product/variant
- selected turnaround tier if applicable
- quote price shown at booking

Recommended Shopify implementation:

- add London courier as a service product/variant, or a line-item add-on
- attach structured line item properties to the cart item
- include the service method and chosen window in order notes/attributes if needed
- fire analytics events for service choice and courier selection

#### Later Courier Automation

Once the booking capture is reliable, automation can be layered on:

- order webhook detects `service_method = london_courier`
- validates service area/postcode
- creates internal task or calendar slot
- optionally integrates with courier provider
- sends confirmation and prep instructions
- sends staff alert with address/window/device details

Until this exists, the site must set expectations honestly: "request collection" or "we will confirm your collection slot" if exact automated booking is not guaranteed.

### Phase 4 — Product Page Redesign

Goal: apply the same professional system to product pages and remove friction around booking.

Use the product mockup as baseline:

- strong product hero
- configurator/booking rail near the top
- floating CTA on mobile
- failure explanation
- parts/proof comparison
- process section
- behind-the-bench/social proof
- warranty
- FAQ

The product page should work as a generic template across repair products, but initial build can validate against:

`/products/macbook-pro-16-m3-2023-a2991-screen-repair`

### Phase 5 — Homepage Redesign Phase 1

Goal: refresh the homepage look and structure while keeping the proven quote path.

Phase 1 homepage should include:

- brand promise: "We repair what they can't."
- primary CTA: "Get a quote"
- quote wizard placed in or immediately after the hero
- proof section
- specialist repair positioning
- trust band/reviews
- FAQ and standard footer

Diagnostic CTA can be shown as an intent marker only if it routes safely:

- either to a diagnostic booking route, or
- to a short "tell us the symptom" contact path

Do not promise a content-rich diagnostic journey until the content exists.

### Phase 6 — Diagnostic Content Sprint

Goal: make the second homepage CTA genuinely useful.

Needed content includes:

- MacBook will not turn on
- iPhone screen flickering/distorted
- liquid damage first 24 hours
- iPad will not charge
- data recovery from a dead Mac
- when Apple says it is unfixable
- battery health below 80%
- what an Apple-quality screen repair looks like

Once these exist, the diagnostic flow can route users to:

- quote wizard with prefill
- relevant article
- contact/specialist form
- diagnostic product

Analytics events needed:

- `diagnostic_started`
- `diagnostic_outcome` with route `quote | content | contact | diagnostic`

## Content-Flow Review

After technical mapping, Ricky wants a deliberate content-flow review.

Questions to answer:

1. Does each page lead with the right intent?
2. Is the quote path early enough?
3. Does the proof come before or after the wizard?
4. How much product-grid browsing should appear before deeper proof content?
5. Which sections are conversion-critical vs SEO/supporting?
6. Which diagnostic claims need article support before launch?

Do not skip this. The redesign is not just a skin; the page narrative needs to feel right.

## Build Order Recommendation

1. Collection page static shell and visual system
2. Collection quote wizard, service choices, and product grid
3. London courier capture in the wizard
4. Product page template
5. Homepage quote-first Phase 1
6. Diagnostic content and diagnostic CTA Phase 2

This order targets the highest commercial intent first while creating reusable components for the rest of the site.

## Open Decisions

1. Use Geist font in production now or approximate with system fonts first?
2. Build a collection-specific wizard snippet first or refactor `quote-wizard.liquid` directly?
3. Should London courier be a separate product, a variant, or line item property only?
4. Should homepage Phase 1 show the diagnostic CTA visibly, or hold it until content exists?
5. Should static proof sections use real workshop photography now, or launch with design-system visuals while photo assets are gathered?

## Non-Negotiables

- Do not ship React/Babel prototype code into the live Shopify theme.
- Do not hardcode live product prices in production sections.
- Do not bury the quote wizard below long content.
- Do not make diagnostic promises unsupported by content.
- Do not break existing SEO URLs or product links.
- Keep all changes inside `/Users/ricky/vps/builds/icorrect-shopify-theme`.
