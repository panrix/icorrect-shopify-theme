# iCorrect Theme v11 Series Changelog

---

## 22 March 2026 — SEO: 404 Redirect Fix (81 archived products)

### Summary
Investigated a Google Search Console alert flagging pages returning 404. Identified 81 archived Shopify products (archived January 2026) whose URLs Google had previously indexed. Created 301 redirects for all of them via the Shopify Redirects API.

### Root Cause
Products were archived in January 2026 (Face ID repairs, home button repairs, aftermarket screen options, housing/frame replacements, and several MacBook Pro model-specific products). Shopify removes archived products from the sitemap but doesn't auto-create redirects — leaving Google with dead URLs.

### Redirects Created (67 new, 14 already existed)

#### iPhone — Face ID / Front Camera repairs → model collection
- iPhone X, XR, XS, XS Max, 11, 11 Pro, 11 Pro Max, 12, 12 Mini, 12 Pro, 12 Pro Max

#### iPhone — Home Button repairs → model collection
- iPhone 8, 8 Plus, SE 2nd Gen (2020), SE 3rd Gen (2022)

#### iPhone — Housing / Frame replacement → model collection
- iPhone 14, 14 Plus, 15, 15 Plus, 15 Pro, 15 Pro Max, 16, 16 Plus, 16 Pro, 16 Pro Max, 16e

#### iPhone — Aftermarket Screen (Soft OLED) → model collection
- iPhone 12–15 range *(most already had redirects from prior work)*

#### MacBook Pro — model-specific products → model collection
- MacBook Pro 13" A1502 (2013–2015) — 6 repair types → `/collections/macbook-pro-13-repair-prices`
- MacBook Pro 14" M4 Max A3185 (2024) — 6 repair types → `/collections/macbook-pro-14-m4-max-a3185-2024-repair-prices`
- MacBook Pro 14" M4 Pro A3401 (2024) — 6 repair types → `/collections/macbook-pro-14-m4-pro-a3401-2024-repair-prices`
- MacBook Pro 15" A1398 (2012) — 6 repair types → `/collections/macbook-pro-15-repair-prices`
- MacBook Pro 16" M4 Pro A3403 (2024) — 6 repair types → `/collections/macbook-pro-16-m4-pro-a3403-2024-repair-prices`

#### Misc
- `/products/donavan-felix-kojo-screen-repair` (customer order page) → `/collections/iphone-screen-repair-prices`
- `/products/macbook-screen-repair-test` → `/pages/macbook-repairs`
- `/products/test-turnaround-time` → `/`

### SEO Impact
All 81 product URLs now 301 redirect to the relevant collection page. Google will re-crawl and clear these from the Coverage report within 2–4 weeks. Link equity from any external links is preserved.

### Notes
- No theme files changed — redirects created via Shopify Admin API
- Full redirect CSV saved at: `agents/website/workspace/data/shopify-redirects-needed.csv`
- Shopify API token confirmed write access (redirects scope)

---

## Version 11.11 — 29 December 2025

### Summary
Clean build based on v11.9, applying content fixes and bug fixes without the problematic CSS changes from v11.12-13.

### Changes

#### 1. FAQ and Content Link Removal
- **Scope**: 24 template JSON files
- **Action**: Stripped all anchor tags from FAQ headings, FAQ content, and details fields
- **Reason**: Links in FAQ sections appeared as black text on dark backgrounds; redundant links in card descriptions caused spacing issues due to nested anchor tags
- **Benefit**: Cleaner content, no more invisible FAQ links, proper text rendering

#### 2. Social Icon Alt Text & Schema Fix
- **File**: sections/footer.liquid
- **Changes**:
  - Alt text: Google→Instagram, LinkedIn→TikTok, X→YouTube
  - Schema IDs and labels updated to match actual icons

#### 3. Missing Alt Text Added (Accessibility)
- **Files**: banner-info.liquid, find-your-repair.liquid, header.liquid, icorrect-blog.liquid, repair-services.liquid, parent-categories.liquid
- **Action**: Added appropriate alt attributes

#### 4. MacBook Capitalisation Fix
- **File**: sections/google-reviews.liquid
- **Change**: "Macbook" → "MacBook"

#### 5. COVID-19 Text Removal
- **File**: templates/collection.macbook-collections.json
- **Change**: "Covid-19 secure drop off service" → "walk-in drop-off service by appointment"

#### 6. Mobile Button Color Fix
- **File**: sections/repair-contact-row.liquid
- **Change**: Added !important to mobile button color values
- **Reason**: Section swaps button styles on mobile, but base.css was overriding colors

### Testing Checklist
- [ ] Homepage "Unsure which repair" buttons visible on mobile
- [ ] FAQ sections display correctly (no broken links)
- [ ] Find Your Repair cards have proper spacing
- [ ] Social icons in footer have correct alt text
- [ ] All buttons site-wide have visible text

### Base Version
Built from v11.9

---
*Last updated: 29 December 2025*
