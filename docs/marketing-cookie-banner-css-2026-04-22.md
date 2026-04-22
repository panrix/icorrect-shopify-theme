# Marketing Brief: Cookie Banner CSS Override
**Date:** 2026-04-22
**Author:** Marketing Jarvis
**Priority:** P1 — UX + Recording quality

---

## Problem

Shopify's privacy banner is a large modal that covers the entire page. Even when changed to "bottom" position in Shopify settings, it's still too large and intrusive.

**Evidence:**
- Desktop: Large modal blocking page content in PostHog recordings
- Mobile: Covers ~80% of screen (screenshot provided)
- Recording IDs: `019dafec-1e71-7fbc-8e40-a8be901c16b4`, `019db2b4-be27-71fd-a77e-...`

---

## Fix Required

Add CSS to `assets/base.css` or `layout/theme.liquid` to override Shopify's cookie banner styles.

**Target selectors:**
- `.shopify-pc__banner__dialog` or `.shopify-pc__banner__dialog-2`
- `.shopify-pc__overlay`

**Required changes:**

```css
/* Force cookie banner to small bottom bar */
.shopify-pc__banner__dialog,
.shopify-pc__banner__dialog-2 {
  position: fixed !important;
  bottom: 0 !important;
  top: auto !important;
  left: 0 !important;
  right: 0 !important;
  max-height: 60px !important;
  width: 100% !important;
  border-radius: 0 !important;
  padding: 8px 16px !important;
  font-size: 13px !important;
  background: #ffffff !important;
  border-top: 1px solid #e5e5e5 !important;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
}

/* Remove dark overlay */
.shopify-pc__overlay {
  display: none !important;
}

/* Make buttons smaller */
.shopify-pc__banner__dialog button,
.shopify-pc__banner__dialog-2 button {
  padding: 6px 12px !important;
  font-size: 12px !important;
}

/* Hide on mobile if too intrusive */
@media screen and (max-width: 749px) {
  .shopify-pc__banner__dialog,
  .shopify-pc__banner__dialog-2 {
    max-height: 50px !important;
    font-size: 11px !important;
  }
  
  .shopify-pc__banner__dialog button,
  .shopify-pc__banner__dialog-2 button {
    padding: 4px 8px !important;
    font-size: 11px !important;
  }
}
```

**Note:** The exact class names may vary. Use browser inspector to confirm selectors.

---

## Acceptance Criteria

- [ ] Banner is a small bar at bottom (not modal)
- [ ] No dark overlay blocking page
- [ ] Text and buttons are compact
- [ ] Banner does not block content in PostHog recordings
- [ ] Still functional on mobile
- [ ] Users can still accept/decline cookies

---

## Priority

P1 — Deploy with image loading fix.
