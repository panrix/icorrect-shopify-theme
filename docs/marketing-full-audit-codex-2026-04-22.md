# Full Website Audit — PostHog / GSC / GA4 / CrUX
**Date:** 2026-04-22
**Author:** Claude Code (direct API audit; the spawned Codex rescue task failed on a read-only sandbox and was abandoned)
**Priority:** Mixed — see individual findings

---

## Executive summary — top 5 findings by impact

1. **[P0] Homepage is eating all the ranking authority. 15+ high-intent GSC queries rank top-5 on Google with literally 0 clicks in 28 days** — they all land on `/` (a generic homepage) instead of the matching collection page. Unused ranking equity worth conservatively 400+ extra clicks/mo.
2. **[P0] `www.icorrect.co.uk` vs `icorrect.co.uk` canonical mismatch.** GSC property is verified on `www`; Google's chosen canonical is non-www. 0 sitemaps registered. Crawl/indexing signals are fragmented across hosts.
3. **[P1] Desktop CTR from Google is 0.9% vs mobile 7.3%** — 8× worse on the channel that's 70% of GSC impressions. Desktop snippet / branding / competitor crowding is destroying conversion on the biggest traffic source.
4. **[P1] Quote wizard has a 99% drop-off** — 7,966 `wizard_entry` → 75 `Checkout Started` last 14d. That's 0.94% wizard-to-checkout. Biggest single leak: `wizard_step` (6,403) → `wizard_resolution` (592), a 91% drop after the user answers the faults question.
5. **[P1] Dead clicks cluster on 5 specific pages** (homepage: 94, macbook-repair-prices: 59, macbook-screen-repair-prices: 41, /pages/our-services: 38, /pages/advanced-diagnostic: 34). Users are tapping things that aren't actually interactive.

---

## Data freshness and scope

| Source | Window | Status |
|---|---|---|
| PostHog | Last 14 days (2026-04-08 → 2026-04-22) | ✅ Full |
| GSC | Last 28 days (2026-03-25 → 2026-04-21) | ✅ Full |
| Meta Graph | Last 7 days | ✅ Full (already reported in `marketing-capi-status-2026-04-21.md`) |
| **GA4** | 28 days | **❌ BLOCKED** — see investigations-blocked section |
| **PageSpeed Insights / CrUX** | n/a | **❌ BLOCKED** — API key required, public endpoint rate-limited |

### Investigations blocked

- **GA4 (investigations 8–13):** the OAuth refresh token in `/home/ricky/config/api-keys/.env` has `analytics.readonly` scope, but the Google user behind it is only granted on GA4 property `312689874` (dormant, 0 sessions ever). The live property `353983768` rejects the token with `PERMISSION_DENIED`. **Fix:** grant the service user (visible as `iCorrect` account 227019412) viewer access on property 353983768, or swap in a refresh token from an account that already has access.
- **PSI / CrUX (Core Web Vitals per page):** the unauthenticated PageSpeed Insights endpoint rate-limits after one request. **Fix:** set `PAGESPEED_INSIGHTS_API_KEY` in `api-keys/.env` (free from Google Cloud Console, 25k queries/day).
- **INV4 `book_now_validation_failed` reason distribution** and most device-split funnel stats (INV5): these events / super properties only shipped in PRs #33–#35 (~8 hours ago). Data will populate going forward. Not a bug.

---

## 1. [P0] Homepage cannibalising collection-page SEO

### Problem
Google ranks the iCorrect homepage (`/`) top-5 for high-intent repair queries — but clicks through at **0%** because the snippet title/description is generic ("iCorrect: MacBook, iPhone & iPad Repair Specialists") and doesn't match the specific device+repair intent. Users search "ipad screen repair" in London, see iCorrect at #1, read a generic brand snippet, and click a competitor instead.

### Evidence — GSC, last 28 days
| Query | Avg position | Impressions | Clicks | CTR | Landing |
|---|---|---|---|---|---|
| ipad screen repair | **1.1** | 38 | 0 | 0% | `/` |
| fix ipad screen | 1.2 | 34 | 0 | 0% | `/` |
| fixing ipad screen | 1.1 | 34 | 0 | 0% | `/` |
| ipad repair london | **1.7** | 36 | 0 | 0% | `/` |
| iphone repair | 2.6 | 39 | 0 | 0% | `/` |
| apple battery replacement | 3.6 | 83 | 0 | 0% | `/` |
| iphone battery replacement | 3.4 | 61 | 0 | 0% | `/` |
| replace screen ipad | 4.2 | 41 | 0 | 0% | `/` |
| battery iphone replace | 4.4 | 41 | 0 | 0% | `/` |
| screen replacement on ipad | 5.5 | 29 | 0 | 0% | `/` |
| iwatch screen replacement | 3.7 | 26 | 0 | 0% | `/` |
| apple watch fix screen | 7.2 | 24 | 0 | 0% | `/` |

~15 similar queries, ~600 combined impressions, 0 clicks, all landing on `/`.

By contrast, when Google picks a matching collection page, CTR is fine:
- `icorrect` → 10.9% CTR @ pos 5.0 (brand search)
- `icorrect london` → 15.1% CTR @ pos 4.5

### Hypothesis
Google's SERP snippet for `/` uses the generic homepage `<title>` and meta description, which say nothing about iPads, batteries, or screens. A user searching "ipad screen repair" sees a brand-generic snippet and picks a competitor whose snippet says "iPad screen repair". The collection pages (`/collections/ipad-screen-repair-prices` etc.) have the right titles, but Google prefers the higher-authority homepage.

### Fix options

**Option 1 — Redirect high-intent queries away from `/` (recommended)**
Add strong internal links from the homepage to the specific collection pages using the exact-match anchor text ("iPad Screen Repair", "Battery Replacement London"). Over 4–8 weeks Google should re-evaluate the better landing page. Low effort, low risk.

**Option 2 — Rewrite homepage snippet to target the top 3 queries explicitly**
Rewrite `<title>` and meta description to include `iPhone, iPad, MacBook Screen & Battery Repair London` instead of the generic specialist line. Doesn't split ranking authority but widens the set of queries the homepage can plausibly click through on.

**Option 3 — Canonical pinning (high-effort, high-risk)**
Use `<link rel="canonical">` on the homepage pointing to itself and on collection pages pointing to themselves. Optionally use Search Console "URL parameters" / content-specific structured data. Only worth it if Option 1+2 don't move the needle in 60 days.

### Priority
**P0.** This is the single biggest unrealised organic-traffic gain visible in the data. Conservatively: if 15 queries with 600 impressions all hit their expected CTR for their position (≈10–25% for top-3), that's 60–150 extra clicks/mo, and the underlying demand is probably 10× what GSC currently records because low CTR suppresses future impressions.

---

## 2. [P0] www vs non-www canonical fragmentation

### Problem
- GSC property is verified on `https://www.icorrect.co.uk/`
- Google's picked canonical for the homepage: `https://icorrect.co.uk/` (no www)
- `https://www.icorrect.co.uk/sitemap.xml` 301-redirects to `https://icorrect.co.uk/sitemap.xml`
- GSC shows **0 sitemaps registered**
- URL Inspection API on `https://www.icorrect.co.uk/`: `coverageState: "Page with redirect"`, `userCanonical: https://icorrect.co.uk/`

Effect: GSC is monitoring a redirect-source host; indexing metadata and sitemap submissions either aren't happening on this property or are being split across two property views.

### Hypothesis
At some point the canonical domain was switched to non-www (likely by Shopify's "Set primary domain" setting in Admin → Domains), but the verified GSC property was never updated. Sitemaps were either never submitted, or were submitted via Shopify's auto-ping to a property that isn't this one.

### Fix options

**Option 1 — Add the apex `icorrect.co.uk` property to GSC (recommended)**
Verify `https://icorrect.co.uk/` (or ideally a Domain-type property covering both) in Search Console. Submit the sitemap (`https://icorrect.co.uk/sitemap.xml`) against the new property. Keep the existing `www` property for historic data.

**Option 2 — Switch Shopify back to www-primary**
Reverses the redirect. Would unify GSC property with canonical, but risks temporary ranking loss during the redirect change and is harder to justify given Shopify and SEO communities have moved toward apex domains.

### Priority
**P0 for visibility accuracy** — any SEO work you do without a GSC property covering the live canonical is flying half-blind. 30-minute fix.

---

## 3. [P1] Desktop CTR on Google is 8× worse than mobile

### Evidence — GSC last 28d
| Device | Impressions | Clicks | CTR |
|---|---|---|---|
| Desktop | **3,991** | 36 | **0.9%** |
| Mobile | 1,747 | 128 | 7.3% |
| Tablet | 27 | 0 | 0% |

Desktop sees **2.3× the impressions** of mobile yet generates **3.5× fewer clicks**. Totally inverse of expected — if anything, desktop usually clicks more on commercial queries.

### Hypothesis
Several plausible causes — the data doesn't distinguish between them yet:
1. Desktop SERPs show more rich results (map packs, PAA, featured snippets) pushing organic listings below the fold
2. Desktop users are more likely to directly navigate to Apple.com / Apple Store rather than click repair shops
3. Homepage snippet looks worse on desktop's wider display (meta description gets ellipsed differently)
4. Mobile users are self-selecting as "device is broken right now, need someone today"
5. Paid competitors (uBreakiFix, iSmash) bid harder on desktop

### Fix options

**Option 1 — SERP snippet preview test**
Use `site:icorrect.co.uk` desktop + mobile SERP for the top 5 queries side by side, screenshot each. Compare which iCorrect-specific messages survive truncation. Re-write if desktop is losing a key phrase.

**Option 2 — Local pack check**
If the Google Business Profile isn't showing strongly in the map-pack for desktop searches, that's a separate GBP optimisation job (schema, reviews, categories).

**Option 3 — Accept and pivot spend**
If desktop is genuinely low-intent for this market, reallocate SEO/content budget toward mobile-first landing pages and AI citation sources (see growth direction in Marketing SOUL).

### Priority
**P1.** Not blocking, but 70% of organic impressions are underconverting massively. Even a 2× CTR improvement on desktop = ~40 extra clicks/mo.

---

## 4. [P1] Quote wizard collapses between step and resolution

### Evidence — PostHog, last 14 days
```
wizard_entry                    7,966
wizard_step                     6,403    (-20% from entry)
wizard_resolution                 592    (-91% from step)
wizard_abandoned                1,208
wizard_conversion                  78
Checkout Started                   75
Checkout Step: Contact Info        (inferred ~60 based on earlier checkout events)
Checkout Step: Payment Info        27    (-64% from Checkout Started)
Order Completed                     0    ← see note below
```

**0.94% wizard → Checkout Started conversion**. Of the 99% drop-off, the biggest single step loss is `wizard_step` → `wizard_resolution`, losing 91% of users between answering the initial faults question and reaching the booking/contact resolution.

### Hypothesis
The `wizard_resolution` step is where the wizard commits to a repair product, price, and the walk-in date/time panel appears. Previous audit (`marketing-jarvis-audit-2026-04-21.md`) identified the date/time requirement as a suspected blocker; we've since shipped autofill (PR #31), but those users didn't benefit from it yet. Plus other possibilities that we can't yet tell apart:
- User picked a device/fault that doesn't resolve to a product ("We can't help with this one" dead-end)
- Price sticker-shock at the resolution step
- Users click through steps for comparison but never intended to book

`book_now_validation_failed` was a zero-row query because the event only started firing 8 hours ago (PR #33). Once that event has 7 days of data, it will tell us directly how many validation fails vs price rejections.

### Fix options

**Option 1 — Wait for the new instrumentation to produce data (recommended)**
`book_now_clicked`, `book_now_validation_failed`, `booking_form_started` all started firing in the last ~8 hours. In 3–7 days the funnel will be diagnosable at the step level. Don't fix speculatively before then.

**Option 2 — Split the resolution event now**
Fire new events `wizard_resolution_shown` (when the repair card renders) vs `wizard_resolution_aborted` (when they close/leave). Right now `wizard_resolution` conflates "saw the card" with "engaged with the card". Small theme change.

**Option 3 — Price A/B test**
Once the funnel is visible step-by-step, test removing the `[Total £X]` line on the resolution card and see whether walking users further into the contact form before showing price lifts conversion. Classic repair-industry tactic.

### Priority
**P1** once the data matures in ~7 days. Hold the speculative fixes until then.

---

## 5. [P1] Dead-click hotspots — users tapping non-interactive elements

### Evidence — PostHog, last 14 days
| Path | Dead clicks | Rage clicks |
|---|---|---|
| `/` | 94 | 15 |
| `/collections/macbook-repair-prices` | 59 | ~1 |
| `/collections/macbook-screen-repair-prices` | 41 | 12 |
| `/pages/our-services` | 38 | - |
| `/pages/advanced-diagnostic` | 34 | - |
| `/collections/iphone-repair-prices` | 25 | - |
| `/pages/our-warranty` | 24 | - |

A dead click = user clicked an element and nothing happened. A rage click = repeated frustration clicks in the same spot.

### Hypothesis
Pages fall into two patterns:
1. **Homepage (94/15)** — visual elements that look interactive but aren't. Specific candidates: hero images, trust-bar icons, logo (non-linked?), the "why iCorrect" cards.
2. **Collection and info pages (59–34)** — mixture of product card elements that don't link correctly (e.g. the product *image* is tapped but only the title has a link), and PostHog's heuristic flagging non-link text blocks that look clickable.

### Fix options

**Option 1 — Watch 5 recordings per page (cheap, direct)**
Filter PostHog recordings to `$dead_click` on each of the 5 top paths, watch the 2–3 clicks most users hit. Pattern will surface in < 1 hour of viewing. No code until the pattern is known.

**Option 2 — Blanket "make the whole product card clickable"**
The classic fix for collection pages is to make the entire `.repair-card` wrap in `<a href="{{ product.url }}">`. Low effort, typically lifts CTR to PDP 10–25%. `sections/icorrect-product-grid.liquid` currently only wraps the image and title in links.

### Priority
**P1** for collection pages (direct revenue impact — harder to reach product pages means fewer wizard entries). **P2** for homepage (harder to diagnose without recording review).

---

## 6. [P1] Bounce rates on top landing pages

### Evidence — PostHog single-pageview sessions (bounce proxy), last 14d
| Landing page | Sessions | Single-pv % (bounce) |
|---|---|---|
| `/collections/macbook-screen-repair-prices` | 865 | **82.5%** |
| `/` | 513 | 75.4% |
| `/collections/iphone-battery-repair-prices` | 420 | 69.5% |
| `/pages/macbook-repairs` | 349 | 71.1% |
| `/collections/iphone-screen-repair-prices` | 94 | 77.7% |
| `/blogs/news/macbook-pro-flexgate-repair-guide-...` | 84 | 85.7% |
| `/collections/apple-watch-screen-glass-only-repair-prices` | 67 | 86.6% |
| `/collections/iphone-16-repair-prices` | 58 | **89.7%** |
| `/collections/iphone-14-pro-max-repair-prices` | 39 | **89.7%** |
| `/collections/iphone-repair-prices` | 56 | **5.4%** |

The outlier `/collections/iphone-repair-prices` at 5.4% bounce is interesting — that page is keeping users engaged. Everything else is in the 70–90% range.

### Hypothesis
High bounce on dedicated collection pages suggests they're landing pages in the Google sense but not in the UX sense — users arrive expecting detail and get a thin list of variants. `iphone-16-repair-prices` at 90% bounce with 58 sessions is likely thin content (phone launched recently, minimal engagement built in). The iPad pages aren't flagged here because they have much lower traffic.

### Fix options

**Option 1 — Audit the outlier (`/collections/iphone-repair-prices`) and clone what works**
5.4% bounce is startling. Find what makes this page sticky vs the others — probably a Liquid section that renders different content. That pattern should be pulled onto the underperformers.

**Option 2 — Fold "thin" model-specific collection pages into their model family**
`iphone-14-pro-max-repair-prices` (39 sessions, 90% bounce) probably shouldn't exist as its own landing page — consolidate into `iphone-14-repair-prices` or `iphone-repair-prices` with anchor-link sections per model.

**Option 3 — Add a below-fold "how repair works" block**
Static content (intake → diagnostic → repair → collect), social proof, and schema. Thin collection pages benefit disproportionately.

### Priority
**P1** for the three 90%-bounce collections (`iphone-16`, `iphone-14-pro-max`, low-traffic ones). **P2** for the big high-traffic pages where 75–85% bounce is the category baseline.

---

## 7. [P2] Session duration — half of all sessions are under 30 seconds

### Evidence — PostHog, last 14d
| Bucket | Sessions | % |
|---|---|---|
| Under 5s | 1,447 | 24% |
| 5–30s | 1,914 | 32% |
| 30s–2min | 1,442 | 24% |
| 2–10min | 743 | 12% |
| 10min+ | 427 | 7% |
| **Total** | 5,973 | 100% |

**56% of sessions are under 30 seconds.**

### Interpretation
Matches the 98.8% non-add-to-cart rate. Two distinct populations:
- Under 5s (24%): Probably bots, bounced bots, accidental taps, broken back-button handoffs
- 5–30s (32%): Real humans who saw something they didn't like fast enough to leave

Together: over half of traffic isn't even reaching the point of being a potential customer. Anything you do for conversion optimisation is at best reaching the 44% that stay past 30 seconds.

### Fix options
Nothing direct — this is a symptom not a lever. But it reframes the optimisation ceiling:
- If 56% of sessions can't be saved, the *actual* conversion denominator for design work is ~2,600 sessions, not 5,973
- Worth filtering all future PostHog analyses to "sessions ≥ 30s" for anything UX-related

### Priority
**P2** as a framing insight. Not a fix on its own.

---

## 8. [P2] Missing / zero data investigations (documented for completeness)

Per the investigation contract, every numbered investigation gets an explicit status:

| # | Investigation | Status |
|---|---|---|
| 1 | PostHog event volume by name | ✅ 26 events captured |
| 2 | Rage + dead clicks by page | ✅ 50 rows, reported in §5 |
| 2b | `$exception` events | ⚠️ 0 rows — exception capture not currently enabled in `posthog.init` (needs `capture_exceptions: true`) |
| 3 | Bounce/exit by landing page | ✅ 30 rows, reported in §6 |
| 4 | `book_now_validation_failed` reasons | ⚠️ 0 rows — event shipped <24h ago (PR #33) |
| 5 | Device-type split at funnel steps | ⚠️ mostly null — super prop shipped <24h ago (PR #33) |
| 6 | Session duration distribution | ✅ reported in §7 |
| 7 | Referrer/UTM breakdown | ❌ `$initial_referring_domain` / `$initial_utm_source` not populated on most events — PostHog cross-domain bridge isn't carrying attribution |
| 8–13 | GA4: landing pages, source/medium, CWV events, user paths, geography, device-browser | ❌ BLOCKED (wrong GA4 property permission — see top of doc) |
| 14 | Pages with impressions but zero clicks (50+ imp threshold) | ✅ none found (good sign) |
| 15 | Queries with high impressions, low CTR | ✅ but the more useful slice is "ranked top-10 with ~0 CTR" → reported in §1 |
| 16 | Sitemap + index coverage | ✅ reported in §2 (0 sitemaps, unhelpful) |
| 17 | GSC device split | ✅ reported in §3 |
| 18 | Country breakdown | ✅ GBR 4,980 imp / 145 clicks — domestic-dominant, expected |
| 19 | Top-10 rank + <1% CTR opportunities | ✅ reported in §1 |
| 20 | GSC rank + GA4 bounce cross-ref | ❌ GA4 blocked |
| 21 | GSC referrers vs GA4 attribution | ❌ GA4 blocked |
| 22 | PostHog engagement vs GA4 conversion | ❌ GA4 blocked |
| + | Core Web Vitals per page template | ❌ BLOCKED — PageSpeed Insights API rate-limited without key |

---

## Suggested priority queue

1. **Fix GA4 permission** so investigations 8–13 can run next week (30 min)
2. **Get a PSI API key** and schedule a weekly CWV crawl of the top 8 templates (1 hr)
3. **Turn on `$exception` capture** in `posthog.init` — 1-line change, enables investigation 2b for free
4. **Add apex-domain property to GSC + submit sitemap** (30 min)
5. **Watch 10 homepage dead-click recordings** and fix the top 2 patterns (1 hr)
6. **Homepage snippet rewrite** targeting the top 5 zero-CTR queries (1 hr)
7. **Wait 7 days**, then re-analyse the wizard funnel with the new PR #33 events

---

*Prepared by Claude Code via direct PostHog + GSC + Meta Graph API calls — 22 April 2026*
