# Marketing Jarvis Audit — 21 April 2026
**Prepared for:** Claude Code (Shopify developer)  
**Date:** 21 April 2026  
**Status:** Action required — multiple issues identified

---

## 1. Meta Pixel Attribution Fix

**Problem:** Meta pixel fires (46 purchases in April) but zero purchases attributed to active campaigns.

**Root causes:**
- `fbclid` parameter stripped on landing pages
- `_fbc` / `_fbp` cookie handling missing
- Cross-domain checkout gap (`icorrect.co.uk` → `checkout.shopify.com`)
- CAPI may not be configured as backup

**Fix required:**
1. Preserve `fbclid` on all page navigations
2. Implement `_fbc` / `_fbp` cookie handling
3. Configure CAPI server-side events
4. Test attribution end-to-end

**Full brief:** See `meta-pixel-fix-brief.md` in repo root (already exists)

---

## 2. Booking Form Date/Time Requirement

**Problem:** 98.8% of visitors don't add to cart. The booking form requires date/time selection before "Book now" or "Proceed to checkout" works.

**What we know:**
- Browser audit confirmed: date/time fields are mandatory
- PostHog shows 6,685 pageviews → 81 add-to-cart (1.21%)
- No checkout recordings found in 100 PostHog sessions

**What we don't know (unverified):**
- How many users try to click "Book now" without date/time
- Whether users see the form and leave, or never scroll to it
- Whether mobile users struggle more (68% of traffic)

**Fix options:**
1. Make date/time optional (collect post-booking via email/SMS)
2. Move date/time to checkout instead of product page
3. Add "Book without date — we'll confirm later" option
4. Pre-populate with next available slot

**Verification:** Ricky will review PostHog session recordings on 22 Apr. Recording IDs in Section 5 below.

---

## 3. Checkout UX Issues

**Problem:** 68% abandon at contact info step. Zero Purchase events in PostHog.

**Live audit findings:**
- Checkout has 8 required fields (not 12 as initially claimed)
- Shop Pay + Apple Pay ARE enabled
- Google Pay missing from cart (only on checkout)
- Checkout shows "Your order is free" for walk-in service
- No shipping step shown for walk-in product

**Questions for Claude Code:**
1. How is repair price passed to checkout? (The direct-add via AJAX creates a £0 product)
2. Is payment collected online or in-store?
3. What does checkout look like for a PAID repair (not the £0 walk-in)?

**Fix required:**
- Clarify payment timing ("Book now, pay after repair" vs collect now)
- Ensure repair price carries through to checkout correctly
- Reduce required fields where possible
- Add Google Pay to cart page

---

## 4. PostHog Purchase Event Broken

**Problem:** PostHog shows 0 Purchase events. Meta pixel shows 46.

**Likely cause:** PostHog not firing on Shopify checkout completion.

**Fix required:**
- Add Purchase event via Shopify Web Pixels API or checkout.liquid
- Ensure event fires on order confirmation
- Include order value, items, traffic source

**Full brief:** See Section 6 in `posthog-event-instrumentation-brief.md`

---

## 5. Session Recordings to Review

PostHog has 100 session recordings. Priority IDs:

**MacBook Screen Repair Page:**
- `019dafec-1e71-7fbc-8e40-a8be901c16b4` — 149s, 4 clicks

**Meta Ad Traffic (fbclid):**
- `019dafe5-ff81-7132-be5e-904531e26cd5` — 377s, 10 clicks
- `019dafad-7575-745d-af58-edb0246cc941` — 311s, 4 clicks

**Highly Engaged Users:**
- `019daf63-f13e-7cb1-8bec-19a523d5d09a` — 211s, 57 clicks (homepage)
- `019daf74-933b-7241-a06c-2bd48711aebc` — 276s, 50 clicks (homepage)

**Where to watch:** `https://app.posthog.com/project/296651/replay`

---

## 6. Custom Events to Add

To stop guessing, add these PostHog events:

| Event | Trigger |
|-------|---------|
| `book_now_clicked` | "Book now" button click |
| `book_now_validation_failed` | Date/time missing |
| `booking_form_started` | Date/time field interaction |
| `proceed_to_checkout_clicked` | "Proceed to checkout" click |
| `email_quote_clicked` | "Email me this quote" click |
| `scroll_depth_25/50/75` | Scroll milestones |
| `purchase_completed` | Order confirmation |

**Full implementation:** See `posthog-event-instrumentation-brief.md`

---

## 7. Device Breakdown

| Device | Traffic | Add-to-Cart Conversion |
|--------|---------|------------------------|
| Mobile | 68% | 1.06% |
| Desktop | 30% | 1.62% |
| Tablet | 2% | 0% |

**Mobile converts 34% worse.** Test booking form on iOS Safari and Chrome Android.

---

## 8. Traffic Source Quality

| Source | Conversion |
|--------|------------|
| Google organic | 1.46% |
| Direct | 1.59% |
| Instagram | 0.15% |
| Facebook | 0.18% |

**Social converts 10x worse than organic.** Not a bug — social users browse, they don't search.

---

## Priority Order

1. **Meta pixel attribution** — affects all campaign reporting
2. **Booking form date/time** — suspected biggest conversion blocker
3. **PostHog Purchase event** — fix tracking
4. **Custom event instrumentation** — stop guessing
5. **Checkout field reduction** — secondary UX improvement

---

## Files in This Repo

- `meta-pixel-fix-brief.md` — Meta pixel (already exists)
- `docs/marketing-jarvis-audit-2026-04-21.md` — This file

## Files in Marketing Workspace

- `docs/meta-pixel-attribution-fix-brief.md`
- `docs/checkout-abandonment-investigation.md`
- `docs/website-funnel-analysis-apr-2026.md`
- `docs/session-recording-analysis.md`
- `docs/posthog-event-instrumentation-brief.md`

---

*Prepared by Marketing Jarvis — 21 April 2026*
