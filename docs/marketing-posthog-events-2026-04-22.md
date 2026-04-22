# Marketing Brief: PostHog Custom Event Instrumentation
**Date:** 2026-04-22
**Author:** Marketing Jarvis
**Priority:** P2 — Conversion optimization data

---

## Problem

We cannot see why 98.8% of visitors don't add to cart. PostHog shows the drop-off but not the cause. We are flying blind on the biggest conversion bottleneck.

**Evidence:**
- PostHog funnel: 98.8% of sessions do not reach "Added to Cart"
- No visibility into: booking form interactions, scroll depth, validation failures, or where users drop off
- Cannot A/B test changes without measurement

**Missing data:**
- Do users scroll to the booking form? Or stop at price/FAQ?
- Do they click "Book now" without selecting date/time?
- Where do they drop off: product page, booking form, or cart?
- Mobile vs desktop behavior differences

---

## Hypothesis

The date/time selection requirement on the booking form is the primary blocker. Users click "Book now" without completing required fields, see a validation error, and abandon.

**To confirm:** Need custom events to track:
1. Form engagement (clicks on date/time fields)
2. "Book now" clicks with/without required fields
3. Validation failures
4. Alternative CTAs ("Proceed to checkout", "Email quote")

---

## Fix Options

### Option 1: Add 10 custom events (Recommended)
Instrument the site with PostHog events for key user actions.

**Tradeoffs:**
- Pro: Quantitative data on exact drop-off points
- Pro: Enables A/B testing and measurement
- Pro: Build effort: few hours
- Con: Requires ongoing maintenance if page structure changes

**Events to add:**

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `booking_form_started` | User clicks date field, time dropdown, or any booking form element | `device_type`, `product_name`, `product_price` |
| `book_now_clicked` | User clicks "Book now" button | `device_type`, `has_date_selected`, `has_time_selected`, `product_name` |
| `book_now_validation_failed` | Form validation fails (date/time missing) | `missing_fields`, `device_type`, `product_name` |
| `proceed_to_checkout_clicked` | User clicks "Proceed to checkout" | `device_type`, `has_date_selected`, `has_time_selected`, `product_name` |
| `email_quote_clicked` | User clicks "Email me this quote" | `device_type`, `product_name` |
| `question_form_opened` | User clicks "I have a question first" | `device_type`, `product_name` |
| `scroll_depth_25` | User scrolls 25% down page | `device_type`, `product_name` |
| `scroll_depth_50` | User scrolls 50% down page | `device_type`, `product_name` |
| `scroll_depth_75` | User scrolls 75% down page | `device_type`, `product_name` |
| `faq_expanded` | User clicks an FAQ accordion | `faq_question`, `product_name` |

**Files to edit:**
- `sections/main-product.liquid` or product template
- `snippets/posthog-tracking.liquid` (add event listeners)

### Option 2: Automated recording analysis tool
Build a tool that pulls click coordinates, scroll depth, and time on page from PostHog API to generate heatmaps and drop-off reports automatically.

**Tradeoffs:**
- Pro: Comprehensive analysis without manual event tagging
- Pro: Scalable across all pages
- Con: Build effort: 1-2 days
- Con: Requires API integration and ongoing maintenance

### Option 3: External tool
Use Microsoft Clarity (free) or Hotjar (£79/month) for heatmaps and session recordings.

**Tradeoffs:**
- Pro: No build required
- Con: Another tool to manage
- Con: Data siloed from PostHog

---

## Acceptance Criteria

- [ ] `book_now_clicked` event fires on every "Book now" click
- [ ] `book_now_validation_failed` event fires when date/time missing
- [ ] `booking_form_started` event fires when user interacts with date/time
- [ ] `scroll_depth_25/50/75` events fire as users scroll
- [ ] All events include `device_type` property
- [ ] All events include `product_name` property
- [ ] Events visible in PostHog within 1 hour of deployment
- [ ] Events tested on mobile Safari and Chrome Android

---

## Priority

**P2 — Fix after image loading and heatmap issues.** This is important for optimization but not blocking conversions.

---

## Related

- Full event spec: `docs/posthog-event-instrumentation-brief.md`
- PostHog initialization: `layout/theme.liquid`
- Existing tracking snippets: `snippets/posthog-tracking.liquid`, `snippets/posthog-scroll-depth.liquid`
