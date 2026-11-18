# PostHog Error Triage — 2026-04-27

## Trigger

PostHog weekly digest reported:

- 644 total exceptions
- 3.31K sessions
- 93.69% crash-free sessions
- top issue: `ReferenceError: Can't find variable: _AutofillCallbackHandler`

Marketing checked live PostHog data before this fix.

## Findings

Last 7 days in PostHog:

- `$exception`: 667
- affected users: 217
- `wizard_conversion`: 49
- `Checkout Started`: 25
- `proceed_to_checkout_clicked`: 18
- `purchase_completed`: 5

Commercial read:

- This was an amber issue, not a checkout-stopping red issue.
- Purchases and checkout events were still firing.
- Most high-volume exceptions were browser / Shopify / third-party infrastructure noise.
- Two small first-party theme issues were worth fixing now.

## High-volume noise filtered from PostHog error capture

Added a conservative `before_send` filter in `layout/theme.liquid` for known non-theme exception noise:

- `_AutofillCallbackHandler`, browser autofill injection noise
- Shopify privacy banner Monorail/network backpressure
- Shopify storefront event listener / Shopify Pay network fetch noise
- Klarna Shopify OSM fetch noise
- generic cross-origin `Script error.` with no source

Reason:

These were hiding actual first-party errors in the weekly digest and were not actionable theme bugs.

## First-party fixes added

### `assets/cart-drawer.js`

Fixed null access around `#CartDrawer-Overlay`.

Before:

- constructor assumed overlay always existed
- `renderContents` assumed overlay always existed after section rendering

After:

- added `bindOverlayClose()`
- overlay click handler only binds when the overlay exists
- missing section markup returns empty string instead of throwing

PostHog issue addressed:

- `Cannot read properties of null (reading 'addEventListener')` from `cart-drawer.js`

### `assets/predictive-search.js`

Added null guards for predictive search variants that render without the full expected form/results/status markup.

Fixes include:

- only bind submit listener when `this.input.form` exists
- safe `getQuery()` when input is missing
- safe live-region status updates when status element is missing
- safe result rendering when results container is missing
- safe max-height calculation when header is absent
- safe close/open behaviour when input or results element is absent
- safe parsing if predictive search response markup is missing

PostHog issue addressed:

- `Cannot read properties of null (reading 'form')` from `predictive-search.js`

## What this does not change

- Does not change checkout flow.
- Does not change Meta Pixel / CAPI.
- Does not change GA4.
- Does not suppress first-party theme exceptions generally.
- Does not hide cart/search errors if they still occur after the null guards.

## Verification

Recommended after deploy:

1. Check PostHog weekly digest next week for lower exception volume.
2. Confirm `cart-drawer.js` and `predictive-search.js` no longer appear in top issues.
3. Continue watching MacBook screen repair pricing page because it receives paid traffic.
4. Treat any new first-party exception on checkout/cart/quote wizard as high priority.
