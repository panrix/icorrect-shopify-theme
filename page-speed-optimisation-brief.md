# Page Speed Optimisation Brief
**Raised by:** Marketing Jarvis  
**Date:** 2026-03-28  
**Priority:** High  
**Repo:** panrix/icorrect-shopify-theme

---

## Background

Meta ads are running for MacBook repairs (£40/day, ~£127 spent last 7 days). We're seeing a severe click-to-landing-page-view drop-off:

- **MacBook Repairs Cold campaign:** 159 link clicks → 54 landing page views = **66% drop-off**
- **MacBook Screen Cold campaign:** 77 link clicks → 32 landing page views = **58% drop-off**

This means we're paying for clicks that never result in a page load. Every lost landing view is a lost booking opportunity. The ad spend is being wasted.

Server TTFB is fast (0.2s — Shopify/Cloudflare is fine). The problem is **client-side render blocking on mobile**.

---

## What We Found

Audit run on `https://icorrect.co.uk/pages/macbook-repairs` (mobile UA):

| Issue | Detail |
|-------|--------|
| **23 external scripts** | Most deferred, but volume is high |
| **27 stylesheets** | Extremely high — app CSS loading globally |
| **jQuery (no defer/async)** | `https://code.jquery.com/jquery-3.7.1.min.js` — loading synchronously, **render-blocking** |
| **HTML size: 138KB** | Heavy for a page template |
| **CF-Cache-Status: DYNAMIC** | Page not being cached by Cloudflare — every request hits origin |

The jQuery CDN call is the most critical issue. It's an external, synchronous script load that blocks page rendering until it resolves. On mobile 4G this alone can add 500ms–1s to paint time.

---

## Tasks

### 1. Fix jQuery — High Priority
- **Find** where jQuery is being loaded (likely a theme snippet or app embed)
- **Option A:** Add `defer` attribute if jQuery is required
- **Option B:** Remove entirely if nothing in the theme actually depends on it (Shopify Dawn doesn't need it)
- Check: `grep -r "jquery" /theme/assets/ /theme/snippets/ /theme/layout/`

### 2. Audit Stylesheets — Medium Priority
- 27 stylesheets is abnormally high
- Identify which are injected by Shopify apps (app blocks, app embeds)
- Check if any app CSS is loading on all pages when it's only needed on specific pages
- Apps to check: anything in `layout/theme.liquid` loading unconditionally

### 3. Enable Cloudflare Caching — Medium Priority
- `CF-Cache-Status: DYNAMIC` means the MacBook hub page is not being edge-cached
- If the page has no personalisation, it should be cacheable
- Check Shopify/Cloudflare cache rules — static content pages like `/pages/macbook-repairs` should be served from edge

### 4. Reduce HTML payload — Low Priority
- 138KB HTML suggests heavy inline content or Liquid rendering
- Review the MacBook hub page template for unnecessary rendered sections
- Consider lazy-rendering below-fold content

---

## Success Criteria

- jQuery removed or deferred
- Stylesheet count reduced (target: under 15)
- Click-to-LPV rate improves from ~34% toward 60%+
- PageSpeed mobile score: target 70+ (currently unmeasured due to API quota)

---

## Pages Affected (ads sending traffic here)

- `https://icorrect.co.uk/pages/macbook-repairs` — MacBook Repairs Cold campaign
- `https://icorrect.co.uk/collections/macbook-screen-repair-prices` — MacBook Screen Cold campaign

Both pages should be checked and fixed.

---

## Notes

- Do not remove scripts blindly — test in staging/preview theme before pushing to live
- PostHog session recording is active — after fix, check if LPV rate improves in Meta Ads Manager within 48h
- Coordinate with Marketing Jarvis when fix is live so ad performance can be re-evaluated
