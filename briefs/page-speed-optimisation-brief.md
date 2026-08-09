# Page Speed Optimisation Brief
**Raised by:** Marketing Jarvis  
**Date:** 2026-03-28 (updated same day)  
**Priority:** High  
**Repo:** panrix/icorrect-shopify-theme

---

## Background

Meta ads are running for MacBook repairs (£40/day, ~£127 spent last 7 days). We're seeing a severe click-to-landing-page-view drop-off:

- **MacBook Repairs Cold campaign:** 159 link clicks → 54 landing page views = **66% drop-off**
- **MacBook Screen Cold campaign:** 77 link clicks → 32 landing page views = **58% drop-off**

This means we're paying for clicks that never result in a page load. Every lost landing view is a lost booking opportunity. The ad spend is being wasted.

Server TTFB is fast (0.2–0.36s — Shopify/Cloudflare is fine). The problem is **client-side render blocking and payload size on mobile**.

---

## Audit Results (both landing pages, mobile UA)

### `/pages/macbook-repairs` — MacBook Repairs Cold destination

| Metric | Value | Status |
|--------|-------|--------|
| HTML size | 138KB | ⚠️ Heavy |
| Scripts | 23 | ⚠️ |
| Stylesheets | 27 | 🚨 |
| Images not lazy-loaded | 5 | ⚠️ |
| jQuery | render-blocking* | 🚨 |
| CF-Cache-Status | DYNAMIC | ⚠️ |

### `/collections/macbook-screen-repair-prices` — MacBook Screen Cold destination

| Metric | Value | Status |
|--------|-------|--------|
| HTML size | **502KB** | 🚨 Critical |
| Scripts | 23 | ⚠️ |
| Stylesheets | **36** | 🚨 Critical |
| Images not lazy-loaded | **18** | 🚨 Critical |
| jQuery | render-blocking* | 🚨 |

**The Screen collection page is the worst offender.** 502KB HTML + 18 eager images + 36 stylesheets = extremely slow mobile paint. This is the page getting the most ad traffic from the Screen Cold campaign.

*jQuery fix was merged (PR #21) — may need CDN propagation time.

---

## Tasks

### 1. ✅ jQuery defer — DONE (PR #21 merged Mar 28)
- jQuery now deferred in `layout/theme.liquid`
- `video-reviews.liquid` updated to handle deferred init
- Verify propagated to live site (check source, should show `defer` on jQuery tag)

### 2. Image lazy loading on collection pages — HIGH PRIORITY 🚨
- `/collections/macbook-screen-repair-prices` has **18 images loading eagerly**
- All product images below the fold must have `loading="lazy"`
- Check `snippets/card-product.liquid` — ensure `<img>` tags include `loading="lazy"` and `fetchpriority="low"` for non-hero images
- Only the first 2–3 visible images (above fold) should be eager; everything else lazy

### 3. Reduce collection page HTML (502KB) — HIGH PRIORITY 🚨
- 502KB HTML is 3.5x heavier than the hub page — likely caused by all product variant data being inline-rendered
- Check if product JSON blobs are being rendered inline in the page HTML (common Shopify pattern)
- Consider deferring product data fetch to JS after load rather than embedding in HTML
- Review how many products are being rendered: paginate or reduce per-page count if over 24

### 4. Stylesheet audit — MEDIUM PRIORITY
- Hub page: 27 stylesheets. Collection page: 36 (9 extra)
- Identify which app CSS is loading on collection pages but not hub pages
- Remove or scope any app CSS that isn't needed on these specific pages
- Target: under 15 stylesheets on both pages

### 5. Enable Cloudflare caching — MEDIUM PRIORITY
- Both pages returning `CF-Cache-Status: DYNAMIC`
- Static content pages and collection pages with no personalisation should be edge-cached
- Check Shopify/Cloudflare cache rules and set appropriate TTL

### 6. Reduce hub page HTML (138KB) — LOW PRIORITY
- Review `pages/macbook-repairs` template for unnecessary rendered sections
- Consider lazy-rendering below-fold content

---

## Success Criteria

- jQuery deferred and confirmed on live site ✅ (verify)
- Collection page HTML under 200KB
- Image lazy loading on all product cards below fold
- Stylesheet count under 15 on both pages
- Click-to-LPV rate improves from ~35% toward 60%+

---

## Pages Affected

- `https://icorrect.co.uk/pages/macbook-repairs` — MacBook Repairs Cold campaign (£20/day)
- `https://icorrect.co.uk/collections/macbook-screen-repair-prices` — MacBook Screen Cold campaign (£20/day)

---

## Notes

- Test all changes in preview theme before pushing to live
- PostHog session recording is active — after fixes, monitor LPV rate in Meta Ads Manager (allow 48h)
- No add-to-cart or checkout events firing in Meta pixel yet — once LPV improves, verify pixel funnel events are firing correctly on these pages
- Coordinate with Marketing Jarvis when fixes are live
