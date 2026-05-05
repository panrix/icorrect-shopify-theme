# MacBook Screen Collection Redesign Conversion Spec

**Date:** 2026-05-05  
**Branch:** `codex/shopify-website-2026-05-04`  
**Surface:** `/collections/macbook-screen-repair-prices`  
**Mockup source:** `docs/mockups/icorrect-website-redesign-2026-05-05/collection/`

## Purpose

Convert the approved MacBook Screen Collection mockup into Shopify theme code without losing the conversion logic that already works in the live theme.

The mockup is the visual target. The existing Shopify `quote-wizard` section is the behavioural baseline. The implementation should adapt the current Liquid/JS data hooks into the new collection-page layout rather than shipping a React prototype or replacing working Shopify flows blindly.

## Current Theme State

`templates/collection.macbook-screen-repair.json` currently uses mostly generic, editor-authored sections:

1. Disabled `main-collection-banner`
2. Disabled `main-collection-product-grid`
3. Disabled `main-banner-and-video`
4. `about-info` intro copy
5. `model-number-search`
6. `featured-collection` limited to 3 products from `macbook-screen-repair-prices`
7. `about-info` process copy
8. `macbook-videos`
9. `repair-services`
10. `icorrect-faqs`
11. `contact-with-map`

There is no quote wizard on this collection template today. Other templates already use `sections/quote-wizard.liquid`, which has useful Shopify-native data hooks:

- `window.WIZARD_MODELS` from linklists
- `window.WIZARD_CONTEXT` from collection/product context
- `window.WIZARD_CFG` from service products and section settings
- Existing add-to-cart/service product logic
- Existing PostHog-oriented wizard event vocabulary elsewhere in the repo

## Mockup Structure

The collection mockup entrypoint is:

`docs/mockups/icorrect-website-redesign-2026-05-05/collection/MacBook Screen Collection.html`

It renders:

1. Navigation
2. Breadcrumb/header
3. Trust band
4. Hero variant V2 by default: "Get an instant MacBook screen quote."
5. Pre-scoped three-step wizard: model -> issue -> quote
6. Identify helper
7. Product grid as a secondary browsing route
8. Process section
9. Parts section
10. Warranty section
11. FAQ
12. Location/footer

Important source files:

- `collection/icorrect/Heros.jsx` — hero/header variants and selected V2 direction
- `collection/icorrect/Wizard.jsx` — simplified MacBook screen wizard interaction
- `collection/icorrect/Shell.jsx` — trust band, identify helper, product grid, FAQ, location
- `collection/icorrect/InfoSections.jsx` — process, parts, warranty
- `collection/icorrect/*.css` — visual language and responsive behaviour

## Recommended Conversion Architecture

### New Assets

Create shared redesign assets:

- `assets/icorrect-redesign-tokens.css`
- `assets/icorrect-collection-redesign.css`
- `assets/icorrect-collection-redesign.js`

`icorrect-redesign-tokens.css` owns the shared Vercel/Geist-inspired design language:

- color tokens
- radii
- shadows
- spacing variables
- button/card/trust primitives

Do not import external fonts from Google for the redesign. Prefer Shopify-hosted font assets or theme fallbacks. If Geist is used, add the WOFF2 files as theme assets and load them with `font-display: swap`. If that becomes too invasive for the first launch, use the current system stack and preserve the geometry through CSS.

### New Sections

Create purpose-built sections for the collection redesign:

- `sections/icorrect-collection-hero-wizard.liquid`
- `sections/icorrect-trust-band.liquid`
- `sections/icorrect-identify-helper.liquid`
- `sections/icorrect-repair-product-grid.liquid`
- `sections/icorrect-process-proof.liquid`
- `sections/icorrect-parts-proof.liquid`
- `sections/icorrect-warranty-strip.liquid`
- `sections/icorrect-redesign-faq.liquid`
- `sections/icorrect-workshop-location.liquid`

This is more sections than the mockup has React files, but it keeps Shopify editor control and lets future collection pages reuse individual pieces.

### Template Strategy

Modify only:

`templates/collection.macbook-screen-repair.json`

Replace the current section order with the redesign order:

1. `icorrect-trust-band`
2. `icorrect-collection-hero-wizard`
3. `icorrect-identify-helper`
4. `icorrect-repair-product-grid`
5. `icorrect-process-proof`
6. `icorrect-parts-proof`
7. `icorrect-warranty-strip`
8. `icorrect-redesign-faq`
9. `icorrect-workshop-location`

Keep old sections in git history; do not delete shared legacy sections yet. If risk needs to be reduced, leave old sections in the JSON with `"disabled": true` for one release.

## Component Mapping

| Mockup component | Shopify destination | Notes |
|---|---|---|
| `TrustBand` | `sections/icorrect-trust-band.liquid` | Static first-paint trust bar. Settings for rating, review count, part claim, warranty claim. |
| `HeroV2` | `sections/icorrect-collection-hero-wizard.liquid` | Default to V2. Do not ship V1/V3 tweak variants to customers. |
| `Wizard` | New mode inside `icorrect-collection-hero-wizard.liquid`, reusing logic from `quote-wizard.liquid` | Pre-scope to MacBook + Screen fault from section settings and collection metafields. |
| `IdentifyHelper` | `sections/icorrect-identify-helper.liquid` | Can adapt current `model-number-search` logic and style it like the mockup. |
| `ProductGrid` | `sections/icorrect-repair-product-grid.liquid` | Render actual collection products, not mockup constants. Preserve product URLs. |
| `ProcessSection` | `sections/icorrect-process-proof.liquid` | Static/editor-configurable four-step cards. |
| `PartsSection` | `sections/icorrect-parts-proof.liquid` | Editorial proof block, no Shopify product dependency. |
| `WarrantySection` | `sections/icorrect-warranty-strip.liquid` | Static/editor-configurable warranty metrics. |
| `FAQ` | `sections/icorrect-redesign-faq.liquid` | Replace current FAQ styling and avoid the current dead-click-prone accordion pattern. |
| `Location` | `sections/icorrect-workshop-location.liquid` | Reuse real address/hours. Prefer static map visual or existing map image over heavy iframe above footer. |

## Wizard Conversion

The mockup wizard is intentionally simpler than the live wizard:

- Step 1: MacBook model
- Step 2: screen issue
- Step 3: quote, delivery, contact

The Shopify implementation should preserve the simplified collection-page UX while borrowing live wizard behaviour:

- Preselect `device = macbook`
- Preselect `fault = Screen / Display`
- Use live model data from Shopify/linklists rather than hardcoded `MAC_MODELS`
- Use live product handles/prices rather than mockup prices
- Keep diagnostic fallback for older/unknown/hinge/other issues
- Preserve add-to-cart path for the selected repair product and service option
- Preserve existing wizard analytics events where possible

Do not copy the React wizard into production. Convert the interaction to Shopify Liquid + vanilla JS, either by:

1. Extending `sections/quote-wizard.liquid` with a `collection_compact` mode, or
2. Creating `snippets/icorrect-collection-wizard.liquid` and extracting shared helper logic from `quote-wizard.liquid`.

Recommendation: start with option 2 if the existing `quote-wizard.liquid` is too large to safely branch inside. Keep the first implementation scoped to MacBook screen collection, then generalise after it works.

## Product Grid Conversion

The mockup grid is secondary. It should support users who still want to browse products, but the primary conversion route is the wizard.

Use the actual collection:

`collections['macbook-screen-repair-prices'].products`

Requirements:

- Render all relevant products, not just 3.
- Preserve each product URL.
- Show product title, price, model/year metadata when available.
- Lazy-load images below the first row.
- Avoid inline product JSON blobs.
- Keep filters/sort off for the first build unless we discover a product-count problem.

This replaces the current `featured-collection` section for this template. Do not modify global `featured-collection.liquid` for this redesign.

## Data Dependencies

Minimum data available today:

- Collection object and products
- Product titles, handles, prices
- Existing wizard model linklists
- Existing service products for walk-in/mail-in
- Existing copy in the current collection JSON

Nice-to-have data later:

- Product metafields for wizard model name, repair type, year, and group
- Collection metafields for wizard device/fault
- Review count/rating from a single theme setting or Shopify metafield
- Model A-number aliases for the identify helper

For the first conversion, hardcoded editorial copy in section settings is acceptable. Hardcoded product/model/pricing data is not.

## Content-Flow Hold

Ricky wants a separate content-flow review after the technical conversion mapping. Do not treat this spec as final content approval.

For now, preserve the mockup order as the technical baseline:

1. Trust
2. Quote
3. Identify
4. Browse
5. Process
6. Parts proof
7. Warranty
8. FAQ
9. Location

The later content-flow pass should decide whether this order is still right, whether "Process" or "Parts proof" should come earlier, and how much product-grid browsing belongs before proof content.

## Implementation Phases

### Phase 1 — Static Shell

Build the redesign sections with static/editor settings, no functional wizard conversion yet. The page should visually match the mockup and render without React or external prototype scripts.

Files:

- `assets/icorrect-redesign-tokens.css`
- `assets/icorrect-collection-redesign.css`
- new `sections/icorrect-*.liquid`
- `templates/collection.macbook-screen-repair.json`

Verification:

- Shopify theme check passes if available.
- Local/preview render has no Liquid errors.
- Mobile first fold shows trust + quote entry.

### Phase 2 — Collection Wizard

Port the simplified MacBook screen wizard into Shopify-native Liquid/JS, using live collection/product data.

Files:

- `sections/icorrect-collection-hero-wizard.liquid`
- `assets/icorrect-collection-redesign.js`
- possible `snippets/icorrect-collection-wizard-data.liquid`

Verification:

- Selecting a known model and issue resolves to the correct product.
- Unknown/diagnostic path does not show a broken price.
- Delivery/service options add the correct Shopify variant(s).
- Wizard analytics still fire.

### Phase 3 — Product Grid + Identify Helper

Finish the real product grid and model number helper.

Files:

- `sections/icorrect-identify-helper.liquid`
- `sections/icorrect-repair-product-grid.liquid`
- `assets/icorrect-collection-redesign.js`

Verification:

- Searching an A-number scrolls/highlights the correct product or wizard option.
- All visible product links resolve.
- Images below first row lazy-load.

### Phase 4 — QA + Content-Flow Review

Compare the implemented Shopify page against the mockup and then run the separate content-flow session.

Verification:

- Desktop and mobile screenshots.
- FAQ accordions open/close on mobile.
- No dead CTA targets.
- No obvious page-speed regression from extra scripts/fonts.

## Risks

- Existing `quote-wizard.liquid` is large and production-sensitive. Avoid broad rewrites.
- The mockup uses React state and localStorage; production should use minimal vanilla JS.
- Loading Geist as additional font assets could affect page speed. Test before committing to production.
- Current collection JSON is admin-generated. Changes can be overwritten by theme editor edits, so keep the committed JSON canonical during this build.
- The mockup product list contains simplified prices. Production must use Shopify product prices.

## Decision Points Before Implementation

1. Use Geist as a hosted theme asset now, or preserve mockup feel with system fonts first?
2. Build a collection-specific wizard snippet first, or add a mode to `quote-wizard.liquid`?
3. Should the first product grid show all products or a curated top 9 plus "View all"?
4. Should the location section use a static map visual or the existing Google iframe?

Recommended defaults:

1. System fonts first, Geist later if visual gap is unacceptable.
2. Collection-specific wizard snippet first.
3. Show all products with lazy loading.
4. Static map visual for performance unless contact/map accuracy requires iframe.
