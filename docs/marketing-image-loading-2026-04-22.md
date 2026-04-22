# Marketing Brief: Image Loading Failure
**Date:** 2026-04-22  
**Author:** Marketing Jarvis  
**Priority:** P0 — Revenue blocking

---

## Problem

40-65% of images across the site fail to load. This includes product images, mega menu navigation images, and the footer logo. Users see grey placeholders and broken image icons instead of actual content.

**Evidence:**
- Homepage: 22/55 images broken (40%)
- MacBook screen repair collection: 34+/60 images broken (57%+)
- iPhone screen repair collection: 39/60 images broken (65%)
- MacBook repairs page: 9/16 images broken (56%)

**PostHog session recordings confirm users see broken images:**
- Recording ID: `019dafec-1e71-7fbc-8e40-a8be901c16b4` — MacBook screen repair page
- Screenshot: [user-provided image showing grey placeholder with broken image icon]

**Live verification:**
- URL tested: https://www.icorrect.co.uk/collections/macbook-screen-repair-prices
- Browser audit: 34 images with `complete: false` and `naturalWidth: 0`

---

## Hypothesis

All broken images have `loading="lazy"`. The native browser lazy loading is not triggering because:

1. **Product images:** IntersectionObserver is not firing (possibly theme JavaScript conflict)
2. **Mega menu images:** CSS `visibility: hidden` on parent container prevents IntersectionObserver from detecting images
3. **Footer logo:** Should not be lazy-loaded (above-the-fold content)

**Confirmed:** Removing `loading="lazy"` via browser console fixes all images immediately.

---

## Fix Options

### Option 1: Remove lazy loading (Recommended)
Change `loading="lazy"` to `loading="eager"` for product images, footer logo, and mega menu images.

**Tradeoffs:**
- Pro: Immediate fix, all images load
- Pro: Speed impact negligible (tested: 1.2s → 1.3s)
- Con: Slightly higher initial page weight

**Files to edit:**
- `sections/icorrect-product-grid.liquid` (line ~23)
- `sections/footer.liquid` (line ~319)
- `snippets/header-mega-menu-enhanced.liquid` or `sections/header.liquid`

### Option 2: Fix lazy loading implementation
Add JavaScript fallback that detects unloaded images after 2 seconds and forces them to load.

**Tradeoffs:**
- Pro: Keeps lazy loading benefits
- Con: More complex, may not fix all cases
- Con: Requires ongoing maintenance

### Option 3: Hybrid approach
Remove lazy loading from above-the-fold images (footer logo, first row of products), keep it for below-the-fold content.

**Tradeoffs:**
- Pro: Balances speed and reliability
- Con: More complex implementation

---

## Acceptance Criteria

- [ ] All product images load on collection pages
- [ ] Mega menu images appear on hover
- [ ] Footer logo loads immediately
- [ ] No broken image icons visible to users
- [ ] Page load time remains under 2 seconds
- [ ] Verified on mobile Safari and Chrome Android

---

## Priority

**P0 — Fix before any other work.** This is blocking conversions. Customers cannot see products they are supposed to buy.
