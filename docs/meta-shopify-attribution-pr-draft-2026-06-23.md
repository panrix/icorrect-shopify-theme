# PR Draft: Meta, PostHog, and Shopify Attribution Repair

**Date:** 2026-06-23  
**Owner:** Website / Systems agent  
**Requester:** Ricky / Marketing  
**Status:** Draft for QA before build  
**Priority:** High, blocks confident Meta funnel optimisation  

---

## PR Title

Fix first-touch paid attribution across Meta ads, PostHog, Shopify checkout, and order handoff

---

## Summary

This PR should make iCorrect's paid-social attribution durable across delayed buying journeys.

Customers often click a Meta ad, browse, leave, compare options, then return later through Google, direct, or the Shopify checkout path. Today, Meta and PostHog can see parts of that journey, but the original paid source is not reliably preserved through:

1. first ad click,
2. storefront browsing,
3. later return visit,
4. Shopify checkout,
5. completed order,
6. Monday/order operational handoff.

The goal is not to make Meta attribution perfect. Privacy restrictions mean it will never be perfect. The goal is to create a reliable first-party attribution layer so we can answer:

> Did this order originally start from Meta, Instagram, Facebook, TikTok, Google Ads, organic, direct, or referral?

---

## Why This Is Needed

Current lower-funnel ad data is too weak to make ROAS decisions confidently.

### Meta Ads evidence

Last 30 days from Meta:

| Metric | Count |
|---|---:|
| Spend | £605 |
| Impressions | 112,051 |
| Link clicks | 1,118 |
| Landing page views | 352 |
| View content | 8 |
| Add to cart | 0 |
| Checkout | 0 |
| Purchase | 0 |

Last 90 days from Meta:

| Metric | Count |
|---|---:|
| Spend | £2,447.76 |
| Link clicks | 4,026 |
| Landing page views | 1,848 |
| View content | 296 |
| Add to cart | 27 |
| Checkout | 9 |
| Purchase | 3 |

Meta has enough data for video-view, engagement, and site-visitor retargeting. It does **not** yet have enough clean lower-funnel signal for purchase optimisation.

### PostHog evidence

Last 30 days PostHog sees site behaviour:

| Event | Count |
|---|---:|
| Pageviews | 20,301 |
| Product Added to Cart | 185 |
| Checkout Started | 49 |
| purchase_completed | 9 |

But when filtering commerce events to Meta/Instagram/Facebook traffic, PostHog attribution is thin. Last 90 days showed only **5 Meta-attributed add-to-carts** and no clean Meta-attributed purchases.

### Commercial impact

Without this fix, Meta ads can drive assisted purchases that later appear as direct, organic, or unknown. That makes good top-of-funnel ads look weaker than they are, and makes budget decisions less reliable.

---

## Known Background

Previous docs already identified related issues:

- `docs/meta-pixel-attribution-fix-brief.md`
- `docs/meta-attribution-verification-2026-04-27.md`
- `docs/posthog-event-instrumentation-brief.md`
- `docs/call-tracking-setup-brief-2026-04-28.md`

April verification showed progress:

- Meta attribution bridge code existed.
- Live site created `_fbc` from `fbclid`.
- `_fbp` was present.
- Meta Ads API showed 3 attributed purchases for the UGC testimonial ad.
- PostHog started seeing `purchase_completed` events.

This PR should verify that setup still works and extend it into a durable first-party source capture system.

---

## Scope

### In scope

1. Persist first-touch and last-touch marketing source on storefront.
2. Preserve Meta click identity, especially `fbclid`, `_fbc`, and `_fbp`.
3. Persist UTMs and landing-page context across sessions.
4. Pass attribution context into Shopify cart/checkout/order metadata where Shopify permits it.
5. Send attribution context to PostHog on key events.
6. Ensure Meta pixel/CAPI setup is not duplicated and purchase events deduplicate cleanly.
7. Add a lightweight “How did you hear about us?” source field where appropriate.
8. Document QA steps and verification results.

### Out of scope

- Changing Meta campaign structure.
- Changing budgets.
- Publishing new ads.
- Replacing the existing Meta pixel.
- Replacing PostHog.
- Building call-tracking numbers, unless this PR only prepares event fields for later call tracking.

---

## Implementation Requirements

### 1. First-touch attribution storage

On every storefront page load, detect and persist first-touch attribution if not already present.

Capture at minimum:

```json
{
  "first_source": "meta | instagram | facebook | google_ads | google_organic | tiktok | youtube | direct | referral | unknown",
  "first_medium": "paid_social | organic_social | paid_search | organic_search | direct | referral | unknown",
  "first_campaign": "utm_campaign value if present",
  "first_adset": "utm_adset or equivalent if present",
  "first_ad": "utm_ad or equivalent if present",
  "first_content": "utm_content if present",
  "first_term": "utm_term if present",
  "first_landing_page": "full landing URL without sensitive query values",
  "first_referrer": "document.referrer where available",
  "first_fbclid": "fbclid if present",
  "first_gclid": "gclid if present",
  "first_ttclid": "ttclid if present",
  "first_seen_at": "ISO timestamp"
}
```

Also capture last-touch attribution on each qualifying visit:

```json
{
  "last_source": "...",
  "last_medium": "...",
  "last_campaign": "...",
  "last_landing_page": "...",
  "last_referrer": "...",
  "last_seen_at": "ISO timestamp"
}
```

Recommended persistence:

- first-party cookie, 90-day expiry,
- localStorage backup,
- avoid storing personal data,
- do not store full query strings if they may contain PII.

### 2. Meta click identity

When `fbclid` exists:

- store raw `fbclid` first-party,
- create or verify `_fbc` format is present,
- preserve `_fbp`,
- keep values available for Meta pixel/CAPI events,
- confirm no redirect strips the click ID before pixel initialisation.

Expected `_fbc` format:

```txt
fb.1.<timestamp_ms>.<fbclid>
```

### 3. UTM standards for Meta ads

Ensure Meta ads can pass enough parameters for internal attribution.

Recommended URL parameters:

```txt
utm_source=meta
utm_medium=paid_social
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
utm_term={{adset.name}}
meta_campaign_id={{campaign.id}}
meta_adset_id={{adset.id}}
meta_ad_id={{ad.id}}
```

If Meta macro support differs, use the nearest supported dynamic parameters and document the final set.

### 4. Shopify cart and checkout handoff

Pass attribution context into Shopify using the safest available mechanism, likely one or more of:

- cart attributes,
- checkout attributes,
- order note attributes,
- customer metafields,
- web pixel custom data,
- server-side order webhook enrichment.

Minimum order-level fields:

```txt
_attribution_first_source
_attribution_first_medium
_attribution_first_campaign
_attribution_first_adset
_attribution_first_ad
_attribution_first_landing_page
_attribution_first_seen_at
_attribution_last_source
_attribution_last_medium
_attribution_last_campaign
_attribution_last_landing_page
_attribution_last_seen_at
_attribution_fbclid_present
_attribution_fbc_present
_attribution_fbp_present
```

Do not expose internal attribution fields in customer-facing order notes if avoidable.

### 5. PostHog event enrichment

Every key PostHog event should include first-touch and last-touch attribution properties.

Events to enrich:

- `$pageview`
- `wizard_entry`
- `wizard_step`
- `wizard_conversion`
- `booking_form_started`
- `book_now_clicked`
- `proceed_to_checkout_clicked`
- `Product Added to Cart`
- `Checkout Started`
- `purchase_completed`
- phone click events if present
- email quote click events if present

Properties:

```txt
first_source
first_medium
first_campaign
first_adset
first_ad
first_landing_page
first_seen_at
last_source
last_medium
last_campaign
last_landing_page
last_seen_at
fbclid_present
fbc_present
fbp_present
```

### 6. Meta pixel and CAPI verification

Verify:

- exactly one intended Meta pixel is active,
- no duplicate browser `Purchase` events,
- Shopify Facebook & Instagram app is connected to the correct ad account,
- Conversions API is enabled,
- advanced matching is enabled,
- browser and server events use matching `event_id` for deduplication,
- `Purchase` includes value, currency, content IDs, and event ID,
- Event Match Quality is acceptable in Meta Events Manager.

### 7. Human source capture

Add or prepare a lightweight source field in the booking/checkout journey:

Question:

> How did you hear about us?

Options:

- Google
- Instagram
- Facebook
- TikTok
- YouTube
- Friend/referral
- Apple said they could not repair it
- Returning customer
- Other

This value should be passed to:

- Shopify order metadata,
- PostHog event properties,
- Monday/order system if available.

If adding this to checkout is not possible without Shopify Plus or UX risk, add it to the quote/booking form first and document the limitation.

---

## Acceptance Criteria

### Functional

- [ ] Landing with `?fbclid=test123&utm_source=meta&utm_medium=paid_social&utm_campaign=test_campaign&utm_content=test_ad&utm_term=test_adset` stores first-touch attribution.
- [ ] Returning later without UTMs keeps the original first-touch source and updates last-touch source.
- [ ] `_fbc` is created or preserved when `fbclid` exists.
- [ ] `_fbp` is present after Meta pixel loads.
- [ ] Attribution survives moving from product page to cart.
- [ ] Attribution is attached to Shopify order metadata or equivalent backend record.
- [ ] PostHog key events include first-touch and last-touch fields.
- [ ] Meta pixel is not duplicated.
- [ ] Purchase event deduplication works between browser and server events.
- [ ] A source-capture field is implemented or explicitly marked blocked with the Shopify/UX reason.

### QA evidence required in PR

- [ ] Screenshot or log of browser storage/cookies after test Meta landing.
- [ ] Screenshot or log of cart/order attributes containing attribution.
- [ ] PostHog query showing attribution properties on test events.
- [ ] Meta Events Manager Test Events screenshot or notes confirming PageView, ViewContent/AddToCart, InitiateCheckout, Purchase where possible.
- [ ] Confirmation that duplicate Purchase events are not created.
- [ ] Confirmation that no PII is stored in attribution cookies or URL-derived fields.

---

## Test Plan

### Test 1: First-touch Meta landing

1. Visit:

```txt
https://www.icorrect.co.uk/?fbclid=test123&utm_source=meta&utm_medium=paid_social&utm_campaign=qa_campaign&utm_content=qa_ad&utm_term=qa_adset
```

2. Confirm cookie/localStorage contains:

- first source = meta,
- first medium = paid_social,
- first campaign = qa_campaign,
- first ad = qa_ad,
- first adset = qa_adset,
- fbclid present,
- `_fbc` present,
- `_fbp` present.

### Test 2: Later return journey

1. Close browser or open clean return path in same browser.
2. Visit:

```txt
https://www.icorrect.co.uk/products/[test-product]
```

3. Confirm first-touch remains Meta.
4. Confirm last-touch updates to direct or appropriate source.

### Test 3: Add to cart and checkout

1. Add a product to cart.
2. Proceed to checkout.
3. Confirm attribution is preserved in cart/checkout/order data.
4. Confirm PostHog events include attribution properties.

### Test 4: Purchase/test order

If safe in staging or with a controlled test product:

1. Complete test purchase.
2. Confirm Shopify order contains attribution fields.
3. Confirm PostHog `purchase_completed` includes attribution fields.
4. Confirm Meta receives/deduplicates Purchase event.

### Test 5: Non-Meta source

Repeat with Google Ads style URL:

```txt
https://www.icorrect.co.uk/?gclid=test456&utm_source=google&utm_medium=cpc&utm_campaign=qa_google_campaign
```

Confirm first-touch source is Google Ads, not Meta.

---

## Risks and Constraints

1. **Shopify checkout limitations**  
   Some checkout customisation may be restricted unless Shopify Plus or Customer Events APIs support the required handoff. If blocked, document the exact limitation and implement the strongest available storefront/cart/order-level alternative.

2. **Privacy restrictions**  
   iOS/Safari and consent rules will still reduce Meta attribution. This PR improves first-party evidence but does not guarantee perfect platform-reported ROAS.

3. **Duplicate events**  
   Adding custom tracking on top of Shopify's Meta integration can double-count purchases if event IDs are not deduped. QA must explicitly check this.

4. **Customer-facing leakage**  
   Attribution metadata should not appear in customer-facing order notes/emails if avoidable.

5. **Historical data remains weak**  
   This fix improves future measurement only. It cannot repair past attribution.

---

## Recommended Rollout

1. Build on staging or preview theme.
2. QA with synthetic UTMs and test click IDs.
3. Run one controlled test order.
4. Verify PostHog and Meta Events Manager.
5. Deploy to live.
6. Monitor for 7 days:
   - Meta landing-page views vs PostHog Meta sessions,
   - add-to-cart attribution,
   - checkout-start attribution,
   - purchase/order attribution,
   - duplicate purchase count risk.

---

## Post-Deploy Monitoring Queries

### PostHog, source coverage on key events

```sql
SELECT
  event,
  properties.first_source AS first_source,
  count() AS events
FROM events
WHERE timestamp >= now() - INTERVAL 7 DAY
AND event IN ('Product Added to Cart', 'Checkout Started', 'purchase_completed', 'wizard_conversion')
GROUP BY event, first_source
ORDER BY event, events DESC
```

### PostHog, Meta assisted lower-funnel events

```sql
SELECT
  event,
  count() AS events,
  count(DISTINCT distinct_id) AS users
FROM events
WHERE timestamp >= now() - INTERVAL 7 DAY
AND properties.first_source IN ('meta', 'facebook', 'instagram')
AND event IN ('Product Added to Cart', 'Checkout Started', 'purchase_completed', 'wizard_conversion')
GROUP BY event
ORDER BY events DESC
```

### PostHog, missing attribution check

```sql
SELECT
  event,
  count() AS events,
  countIf(isNull(properties.first_source) OR properties.first_source = '') AS missing_first_source
FROM events
WHERE timestamp >= now() - INTERVAL 7 DAY
AND event IN ('Product Added to Cart', 'Checkout Started', 'purchase_completed', 'wizard_conversion')
GROUP BY event
ORDER BY events DESC
```

---

## Definition of Done

This work is done when a new test customer journey can be traced from:

**Meta-style landing URL → storefront → cart/checkout → order → PostHog event → Meta test event**

with first-touch source preserved as Meta and no duplicate purchase events.

---

## Commercial Read

This is a measurement foundation PR. It should happen before major Meta restructuring.

Once this is live, Marketing can judge the proposed funnel properly:

- top-of-funnel Apple comparison content,
- retargeting with UGC, proof, and offer formats,
- assisted conversion impact across delayed shopping journeys.

Until then, Meta can still be used for awareness and retargeting, but purchase ROAS should be treated as incomplete.
