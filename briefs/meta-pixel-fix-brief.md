# Meta Pixel Fix Brief
**Raised:** 2026-03-25
**Priority:** High — affects campaign learning phase and ROAS accuracy
**For:** Code agent

---

## Problem Summary

The Meta pixel (ID: `570102806970617`) is partially working but has two bugs:

1. **Double-firing on purchases** — every completed order triggers 2 Purchase events instead of 1
2. **Missing ~29% of purchases** — 7 Shopify orders placed since Mar 22, only 5 have matching pixel events

Evidence:
```
Shopify orders (Mar 22–24):    7
Pixel Purchase events total:  10  ← should be 7, not 10
Matched orders:                5
Unmatched orders:              2  (Mar 23 08:45 £89, Mar 24 09:25 £49)
```

---

## Why This Matters

- Meta campaigns launched Mar 24 — learning phase needs 50 real purchases to optimise
- Double-firing means Meta thinks it has more signal than it does → distorted targeting
- Missing events = conversions not attributed to ads → ROAS looks worse than reality
- Without accurate purchase tracking, spend decisions are based on bad data

---

## What We Know

- **Pixel is NOT in theme Liquid files** (checked: no `fbq()` in layout/, sections/, snippets/)
- Pixel is installed via **Shopify's Meta channel** (Customer Events / Web Pixels API)
- Standard Meta channel fires: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`
- Double-firing suggests **a second pixel trigger exists** alongside the Meta channel — likely one of:
  - A custom Web Pixel app also sending Purchase events
  - The Meta channel configured twice
  - Manual `fbq('track', 'Purchase')` code somewhere in checkout or order status page
  - Shopify's `additional_scripts` / order status page containing a pixel call

---

## Investigation Steps

### 1. Check Shopify Web Pixels
```
GET /admin/api/2024-01/customer_events.json
```
Or in Shopify Admin → Settings → Customer Events → check all installed pixels.
If Meta pixel appears more than once, remove the duplicate.

### 2. Check Order Status Page / Checkout Scripts
Shopify Admin → Settings → Checkout → Additional scripts (legacy)
Shopify Admin → Settings → Checkout → Order status page
Look for any `fbq('track', 'Purchase')` calls here. If found, remove — the Meta channel handles this natively.

### 3. Check for duplicate Meta channel installations
Shopify Admin → Apps → Sales channels → check if Meta channel is installed once or twice.

### 4. Implement event deduplication (belt-and-braces fix)
Even after removing duplicates, add `eventID` deduplication to the pixel:
```javascript
fbq('track', 'Purchase', {
  value: {{ order.total_price }},
  currency: 'GBP',
  content_ids: [{{ order.line_items | map: 'variant_id' | join: ',' }}],
  content_type: 'product'
}, {
  eventID: '{{ order.id }}'  // deduplication key
});
```
Meta will deduplicate events with the same `eventID` within a 48h window.

### 5. Fix missing events
The 2 missing orders were a walk-in service (no referring site) and an order at 08:45.
Check if the pixel fires on ALL payment methods and order types, including:
- Walk-in service products
- Orders placed by staff in Shopify admin
- Draft orders converted to real orders

---

## Acceptance Criteria

- [ ] Place a test order → exactly 1 Purchase event fires in Meta Events Manager (not 2)
- [ ] All order types tracked: web, walk-in service, mail-in
- [ ] Meta Events Manager shows match rate >90%
- [ ] No duplicate pixel in Shopify Customer Events
- [ ] eventID deduplication implemented

---

## Meta Pixel Details
- **Pixel ID:** `570102806970617`
- **Ad Account:** `act_513485772889925`
- **Active campaigns relying on this:** MacBook Repairs Cold, MacBook Screen Repair Cold
- **Verify in:** [Meta Events Manager](https://business.facebook.com/events_manager2/list/pixel/570102806970617)

---

## References
- Brief owner: Marketing agent
- Shopify store: `i-correct-final.myshopify.com`
- Credentials: `/home/ricky/config/api-keys/.env` → `SHOPIFY_ACCESS_TOKEN`
