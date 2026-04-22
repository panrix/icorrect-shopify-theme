# Marketing Brief: Minimize Cookie Banner
**Date:** 2026-04-22
**Author:** Marketing Jarvis
**Priority:** P2 — UX polish

---

## Problem

Shopify's bottom cookie banner is functional but still too large. Text is verbose, buttons are spread out, banner takes up unnecessary vertical space.

**Current state:**
- Full paragraph about cookies, partners, analytics
- Three buttons: Manage preferences, Accept, Decline
- Link to Privacy Policy
- Height: ~120px

**Desired state:**
- One line of text
- Two buttons: Accept, Cookie settings
- Height: ~40-50px
- Compact, minimal, Apple-like

---

## Fix Required

Add CSS to `assets/base.css` or `layout/theme.liquid` to minimize Shopify's cookie banner.

**Target selectors:**
- `.shopify-pc__banner__dialog` or `.shopify-pc__banner__dialog-2`
- `.shopify-pc__banner__dialog button` or `.shopify-pc__banner__dialog-2 button`

**Required CSS:**

```css
/* Minimize cookie banner */
.shopify-pc__banner__dialog,
.shopify-pc__banner__dialog-2 {
  max-height: 50px !important;
  padding: 6px 16px !important;
  font-size: 12px !important;
  line-height: 1.3 !important;
}

/* Compact buttons */
.shopify-pc__banner__dialog button,
.shopify-pc__banner__dialog-2 button {
  padding: 4px 10px !important;
  font-size: 11px !important;
  min-height: 28px !important;
}

/* Hide Privacy Policy link (optional) */
.shopify-pc__banner__dialog a[href*="privacy"],
.shopify-pc__banner__dialog-2 a[href*="privacy"] {
  display: none !important;
}

/* Mobile adjustments */
@media screen and (max-width: 749px) {
  .shopify-pc__banner__dialog,
  .shopify-pc__banner__dialog-2 {
    max-height: 80px !important; /* Allow more height on mobile for text wrapping */
    font-size: 11px !important;
  }
  
  .shopify-pc__banner__dialog button,
  .shopify-pc__banner__dialog-2 button {
    padding: 4px 8px !important;
    font-size: 10px !important;
  }
}
```

**Note:** Exact class names may vary. Use browser inspector to confirm.

---

## Acceptance Criteria

- [ ] Banner height is 50px or less on desktop
- [ ] Text is compact (one line if possible)
- [ ] Buttons are small but still clickable
- [ ] Still functional on mobile
- [ ] Users can still accept/decline/manage cookies

---

## Priority

P2 — Nice to have, not blocking. Deploy with other fixes if possible.
