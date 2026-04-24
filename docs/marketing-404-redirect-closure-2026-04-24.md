# Marketing Brief: Legacy 404 Redirect Closure
Date: 2026-04-24
Author: Marketing Jarvis
Priority: P1 — revenue leakage and recurring audit noise from unresolved dead-end legacy URLs

---

## Problem

Legacy URLs from previous site structures are still returning raw 404s on the live Shopify site instead of redirecting users to the closest relevant page. This means old backlinks, bookmarks, and residual crawl paths still send visitors into dead ends, and the same issue keeps resurfacing in audits even when the hostname consolidation work is largely resolved.

Evidence:
- Historical baseline brief documented **156 unique 404 URLs** generating **362 wasted sessions/month** from GA4 property `353983768`, page title `404 Not Found – iCorrect` (source: prior brief dated 2026-03-12).
- Fresh live checks on 2026-04-24 confirmed these URLs return **404 with no redirect hop**:
  - `https://icorrect.co.uk/ipad-repairs/ipad-3/diagnostic`
  - `https://icorrect.co.uk/repair/7PAtNG8VPor21Ldv0vIew2Yl9Z`
  - `https://icorrect.co.uk/iphone-repairs/iphone-7-plus/touch-ic-repair`
  - `https://icorrect.co.uk/smartphone/iphone-repairs/iphone-6s-plus/battery-replacement`
  - `https://icorrect.co.uk/blog/ipad-pro-11`
  - `https://icorrect.co.uk/products/macbook-pro-14-m1-2021-a2442`
- URL Inspection in Google Search Console for sampled broken URLs returns **`URL is unknown to Google`**, which suggests these are not currently major indexed coverage issues, but they are still live user dead ends when visited.
- Fresh GA4 404 path review for the last 30 days found recurring broken-path hits including:
  - `/2022/03/03/iphone-face-id-not-working-try-these-tips-from-our-repair-experts` (4 views)
  - `/brighton` (4 views)
  - `/ipad-repairs/ipad-3/diagnostic` (3 views)
  - `/repair/7PAtNG8VPor21Ldv0vIew2Yl9ZPor21LdvQaJCiyGRMxMl3JkyreNEg4Ml32` (2 views)
  - `/post/apple-pencil-jitter-issue-after-screen-replacement` (2 views)
  - several polluted `/web-pixels@...` pseudo-paths, which are tracking noise and should not be treated as real URL issues
- Verified live target destinations exist and return **200**:
  - `/pages/iphone-repairs`
  - `/pages/ipad-repairs`
  - `/pages/apple-watch-repairs`
  - `/pages/contact`
  - `/blogs/news/iphone-face-id-not-working-try-these-tips-from-our-repair-experts`
  - `/blogs/news/apple-pencil-not-working-after-repair`

---

## Hypothesis

The original legacy-URL redirect closure was either never fully implemented in the live theme, was only partially implemented, or does not cover the remaining old URL shapes now being hit. The current hostname issues, `www`, `staging`, and `icrtcont`, are mostly legacy reporting residue. The recurring audit problem is now narrower: legacy route patterns still fall through to raw 404 instead of being caught and redirected.

Confirmed findings:
- This is **not primarily a live Google indexing crisis**. Sampled broken URLs are unknown to Google in GSC.
- This **is** still a live UX and link-equity cleanup problem because real visits can still land on dead ends.
- A meaningful portion of the current 404 list is polluted by malformed URLs and web-pixel path noise. Those should be excluded from success criteria.

---

## Fix Options

### Option 1: Complete legacy redirect handling in the theme 404 layer (Recommended)
Implement a deterministic legacy URL router in the theme so known old patterns immediately redirect to the closest relevant live destination before the user experiences a dead end.

Files to edit:
- likely `templates/404.liquid` or `sections/main-404.liquid`
- any shared snippet or layout include used by the 404 template
- optionally a small mapping helper snippet if the theme structure benefits from keeping rules separate

Recommended redirect pattern mapping:
- `/iphone-repairs/*` and `/smartphone/iphone-repairs/*` → `/pages/iphone-repairs`
- `/ipad-repairs/*`, `/ipad-mini-*`, `/ipad-air-*`, `/ipad-pro-*` → `/pages/ipad-repairs`
- `/apple-watch-repairs/*` → `/pages/apple-watch-repairs`
- `/repair/*` and `/product/london-courier-*` and similar old service/booking tokens → `/pages/contact`
- `/blog/*`, `/post/*`, and dated legacy blog slugs like `/2022/...` → exact matching article where known, otherwise `/blogs/news`
- old MacBook product-like legacy routes such as `/products/macbook*`, `/macbook-repairs/*`, `/macbook-air-*`, `/macbook-pro-*` → `/pages/macbook-repairs`
- `/product-category/*` legacy WooCommerce-style paths → closest service hub or collection path only if there is a confident mapping, otherwise service hub rather than homepage

Tradeoffs:
- Pros: closes the actual live dead-end issue, fast to verify, no app dependency, keeps logic in version-controlled theme code
- Cons: client-side or template-level redirect logic is less elegant than true server-side URL redirects, and long-term rule sprawl should be managed carefully
- Rough build effort: low to medium

### Option 2: Create explicit Shopify URL redirects for highest-value legacy paths
Use Shopify URL redirect tooling or a managed redirect list for the highest-volume historic URLs and known backlink targets.

Files to edit:
- no theme code necessarily required if handled in Shopify admin or an importable redirect configuration workflow
- may still need a supporting doc or export list in repo for maintainability

Tradeoffs:
- Pros: cleaner redirect semantics for exact paths, easier for Google and users, less logic embedded in theme templates
- Cons: poor fit for broad pattern families, brittle at scale, harder to keep version-controlled unless exported and documented
- Rough build effort: medium if many paths need hand-mapping

### Option 3: Hybrid approach, exact redirects for top-value URLs plus theme catch-all for pattern families
Use explicit redirects for the highest-value article and product URLs, and theme-level catch-all handling for broad legacy families.

Files to edit:
- theme 404 handling for pattern families
- optional redirect list in Shopify for priority one-to-one mappings
- supporting documentation in repo

Tradeoffs:
- Pros: best balance of specificity and coverage, keeps article-level intent where known, reduces fallback noise
- Cons: slightly more implementation coordination
- Rough build effort: medium, but most robust

---

## Acceptance Criteria

- [ ] Visiting `/iphone-repairs/*` legacy URLs redirects to `/pages/iphone-repairs`
- [ ] Visiting `/ipad-repairs/*` legacy URLs redirects to `/pages/ipad-repairs`
- [ ] Visiting `/apple-watch-repairs/*` legacy URLs redirects to `/pages/apple-watch-repairs`
- [ ] Visiting `/repair/*` legacy booking/token URLs redirects to `/pages/contact`
- [ ] Visiting known legacy blog/article paths redirects to either the exact replacement article or `/blogs/news`
- [ ] Visiting known old MacBook legacy paths redirects to `/pages/macbook-repairs`
- [ ] Representative legacy WooCommerce-style `/product-category/*` URLs no longer hard-stop on raw 404 where a sensible hub redirect exists
- [ ] Malformed `/web-pixels@...` pseudo-paths are explicitly treated as tracking noise and excluded from closure reporting
- [ ] A smoke test confirms zero redirect loops and correct final destinations for at least 10 representative legacy URLs
- [ ] Mobile Safari + Chrome Android smoke-tested

---

## Priority

**P1** because this is not the main reason rankings or traffic are under pressure, but it does create real dead ends for residual traffic, keeps polluting audits, and should be closed properly so it stops resurfacing.

---

*Prepared by Marketing Jarvis — 2026-04-24*
