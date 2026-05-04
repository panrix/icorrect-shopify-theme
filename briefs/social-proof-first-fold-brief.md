# Social Proof — First Fold Brief
**Raised by:** Marketing Jarvis  
**Date:** 2026-03-28  
**Priority:** High — Meta ads are live, this directly impacts conversion  
**Repo:** panrix/icorrect-shopify-theme

---

## Problem

All collection pages and content pages have zero social proof in the first fold. Users arriving from Meta ads (or organic) see pricing/content immediately but have no trust signals before they scroll. For a repair business, trust is the #1 conversion barrier.

The homepage has strong trust signals already. They need to be propagated to the pages where ad traffic lands.

---

## What We Have (from homepage)

- ⭐⭐⭐⭐⭐ **700+ Google Reviews** — Average **4.8 rating**
- **100,000+ devices repaired**
- **2-year warranty**
- **Original parts**
- **Same-day service**
- **10+ years experience**

---

## What to Build

A compact trust bar to sit **immediately below the page hero/header** on collection and content pages. Should be visible without scrolling on mobile.

### Design

Single-row bar, mobile-friendly, no images required. Example layout:

```
⭐ 4.8 · 700+ Google Reviews  |  ✓ 2-Year Warranty  |  ✓ Same-Day Service  |  ✓ Original Parts
```

- Keep it to one line on desktop, wraps to 2 lines on mobile is fine
- Stars can be Unicode (★★★★★) or a small SVG — no external image deps
- Background: subtle (light grey or white with border) — don't compete with the hero
- No animation, no carousel — static and instant-loading

---

## Pages to Add It To

**Priority 1 — ad landing pages (do these first):**
- `/collections/macbook-screen-repair-prices`
- `/pages/macbook-repairs`

**Priority 2 — all other collection pages:**
- `/collections/iphone-battery-repair-prices`
- `/collections/iphone-screen-repair-prices`
- All other `/collections/` pages

**Priority 3 — content pages:**
- All `/pages/` pages (MacBook Air/Pro repair London, etc.)

---

## Implementation Notes

- Best approach: add a new Shopify section (`sections/trust-bar.liquid`) and include it in:
  - `templates/collection.liquid` (or `collection.json`)
  - `templates/page.liquid` (or `page.json`)
- Alternatively, add it directly to `layout/theme.liquid` conditionally by template type
- The trust bar should render server-side (no JS dependency) — it must appear on first paint
- Do NOT use an app or third-party widget — we don't want another script loading for this

---

## Success Criteria

- Trust bar visible on first fold on mobile for both ad landing pages
- Renders without JavaScript
- No additional external scripts or stylesheets added
- Consistent styling with existing site design

---

## Notes

- The homepage already has a full `google_reviews` section — this trust bar is a lightweight summary, not a full reviews section
- After deployment, monitor PostHog for scroll depth and conversion rate changes on affected pages
- Coordinate with Marketing Jarvis when live — we'll track impact on Meta ad add-to-cart and checkout events
