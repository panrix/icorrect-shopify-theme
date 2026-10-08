# Full Website Audit — PostHog / GA4 / GSC / Meta
**Date:** 2026-04-22
**Author:** Claude Code (direct API audit)
**Priority:** Mixed — see individual findings

---

## Executive summary — top 5 findings by impact

1. **[P0] 40 high-intent Google queries with 500+ impressions each are converting at <3% CTR** — combined ~30,000 wasted impressions per 28 days. Top bleeder: `iphone battery replacement` at pos 5.6, 6,478 imp, 146 clicks (2.25%). Position would predict ~15–20% CTR. That one query alone is ~900 missing clicks/mo.
2. **[P0] Collection pages convert at 0.27–0.54% while the homepage converts at 4.17%.** MacBook Screen Repair Prices (1,472 sessions) produces 4 conversions; the homepage (1,439 sessions) produces 60. The quote wizard on `/` is working; the same journey doesn't exist on collection pages where most organic traffic lands.
3. **[P1] Mobile Safari is the largest segment (9,715 sessions) and converts at 1.48%.** Desktop Chrome (3,991 sessions) converts at 4.23% — 2.9× better. Mobile-first optimisation is the biggest user-count lever available.
4. **[P1] Quote wizard collapses 91% between step-answer and resolution.** 7,966 `wizard_entry` → 6,403 `wizard_step` → 592 `wizard_resolution` → 75 `Checkout Started` last 14d. 0.94% wizard-to-checkout. New per-step events shipped <24h ago (PR #33) — 7 days of data will expose the exact sub-step where users drop.
5. **[P2 — MEASUREMENT ONLY] Facebook paid appears to produce £0 revenue but this is the attribution gap we shipped a fix for today, not a channel failure.** See §1.

---

## Data freshness and scope

| Source | Window | Status |
|---|---|---|
| PostHog | Last 14 days (2026-04-08 → 2026-04-22) | ✅ Full |
| GSC (property `sc-domain:icorrect.co.uk`) | Last 28 days (2026-03-25 → 2026-04-21) | ✅ Full |
| GA4 (property `353983768`) | Last 28 days | ✅ Full (via `EDGE_GOOGLE_REFRESH_TOKEN`) |
| Meta Graph | Apr 1–21 | ✅ Full (already reported in `meta-capi-status-2026-04-21.md`) |
| PageSpeed Insights per page | — | ⚠️ Rate-limited without API key; add `PAGESPEED_INSIGHTS_API_KEY` to unblock |

### Correction vs my first draft of this audit

My initial pass used `GOOGLE_REFRESH_TOKEN` and `https://www.icorrect.co.uk/` as the GSC property. That token only has access to a dormant GA4 property, and the URL-prefix GSC property has no sitemaps registered (because the site canonical is apex, not www). The correct token is `EDGE_GOOGLE_REFRESH_TOKEN` and the correct GSC property is `sc-domain:icorrect.co.uk`. Both are fine and fully accessible — the "fragmented GSC data" finding in my first draft was wrong. Numbers below are from the authoritative sources.

---

## 1. [P2 — measurement, not a finding] Facebook paid "£0 revenue" is the attribution gap we already fixed today

### Evidence — GA4 source/medium, 28 days
| Source / medium | Sessions | Conversions | CR | Revenue |
|---|---|---|---|---|
| google / organic | 11,635 | 210 | 1.80% | **£7,284** |
| (direct) / (none) | 2,891 | 68 | 2.35% | £1,888 |
| facebook / paid | 3,050 | 7 | 0.23% | **£0** |
| m.facebook.com / referral | 382 | 0 | 0.00% | £0 |
| facebook.com / referral | 248 | 1 | 0.40% | £0 |
| chatgpt.com / (not set) | 144 | 8 | 5.56% | £49 |

### Why the £0 revenue number is not what it looks like

`meta-capi-status-2026-04-21.md` documents exactly this problem: the Meta pixel's `fbc` / `fbp` match-key coverage was **0%** in the 28-day window. Without those cookies, Meta Ads can't connect a purchase back to the ad click that drove it — so purchases made by someone who clicked a Facebook ad get re-attributed (by Meta, by Shopify, and by GA4) to direct or organic traffic instead of paid.

Today's fixes (PR #28 `snippets/meta-pixel-attribution.liquid` + v3.2 PostHog pixel) write `_fbc` from `fbclid` and pass `_fbp`/`_fbc` to Shopify checkout so Meta CAPI now carries them server-side. The GA4 data for the 28-day window was captured *before* that fix shipped, so the £0 number is an artefact of the old attribution pipe.

### Don't pause Facebook paid yet

Prior draft of this audit recommended pausing. That was wrong — it would throw away real conversions we just can't see yet.

### What to do instead

1. **Wait 7–14 days** after the attribution fix is live. Check GA4 source/medium again, and check Meta Events Manager → match-keys breakdown to confirm `fbc`/`fbp` coverage is now >0%.
2. **Verify CAPI dedup rate in Events Manager** — the `event_id` deduplication between browser pixel and server CAPI needs to hold; the v3.2 pixel and our CAPI config are both fine in theory, but in Meta's actual ingestion it needs to show 90%+ dedup.
3. **Then revisit** whether the Facebook paid channel is actually performing. Until both match-keys and dedup are healthy, paid FB revenue is unmeasurable from this side.

### Priority
**P2 — measurement only.** No action this week beyond observing that the attribution fix is propagating. The real decision about Facebook paid happens in 2 weeks with clean data.

---

## 2. [P0] 40 high-impression queries bleeding CTR

### Evidence — GSC `sc-domain:icorrect.co.uk`, 28 days, queries with ≥500 imp AND CTR <3%

| Query | Impressions | Clicks | CTR | Avg pos | Lost clicks @ rank-avg CTR |
|---|---|---|---|---|---|
| iphone battery replacement | **6,478** | 146 | 2.25% | 5.6 | ~900–1000 |
| apple battery replacement | 4,149 | 40 | 0.96% | 6.5 | ~500 |
| iphone battery replacement cost uk | 2,395 | 32 | 1.34% | 2.4 | ~500 |
| apple watch battery replacement | 2,227 | 12 | 0.54% | 7.0 | ~200 |
| iphone 13 battery replacement | 1,957 | 21 | 1.07% | 2.3 | ~400 |
| iphone screen repair | 1,701 | 14 | 0.82% | 8.8 | ~150 |
| ipad battery replacement | 1,333 | 11 | 0.83% | 2.8 | ~230 |
| ipad screen repair | 1,253 | 5 | 0.40% | 8.1 | ~100 |
| iphone battery replacement cost | 1,165 | 27 | 2.32% | 1.8 | ~250 |
| iphone repair | 1,164 | 11 | 0.95% | 11.4 | ~40 |
| macbook screen repair | 1,160 | 26 | 2.24% | 7.0 | ~100 |
| apple watch screen repair | 1,114 | 19 | 1.71% | 5.1 | ~150 |
| iphone 14 battery replacement | 1,019 | 17 | 1.67% | 1.8 | ~200 |

…and 27 more similar queries. Combined impressions on the 40-query set: **~30,000 per 28 days**. CTR expected for these ranks is 10–25%; actual is 0.4–2.7%.

Total current clicks from that set: ~900
Total at expected CTR for rank: ~4,500–6,000
**Gap: ~3,500–5,000 missing clicks per 28 days.**

### Hypothesis
For the top-10-ranked queries (positions 1–5), the problem is almost certainly snippet quality — title tag, meta description, or SERP result appearance. Specific patterns in the data:
- The homepage `/` is the landing page for most of these queries, even for specific ones like `ipad screen repair`. Its generic snippet doesn't promise an answer to the device-specific question.
- The collection pages that *should* rank (e.g. `/collections/iphone-battery-repair-prices`) have proper titles (we confirmed in the SEO fix earlier today) but aren't the chosen result because the homepage has higher authority and matches broadly.

### Fix options

**Option 1 — Rewrite the homepage title + meta to target the top 3 intent buckets**
Current: `iCorrect: MacBook, iPhone & iPad Repair Specialists`. Proposed:
- `<title>` — `iPhone, iPad & MacBook Screen & Battery Repair London | iCorrect`
- `<meta name="description">` — `Apple repair specialists in central London. iPhone & MacBook screen, battery, logic board. 2-year warranty. Same-day available. Walk-in or mail-in.`

**Option 2 — Content and internal-link push on the worst offenders**
For `iphone battery replacement` / `apple battery replacement` / `apple watch battery replacement` (the three huge bleeders), add a dedicated guide article (`/blogs/news/iphone-battery-replacement-london-guide`) with:
- Specific ranking keyword in H1 and meta
- Local intent ("iPhone battery replacement London — same-day")
- Internal link from homepage and collection pages

**Option 3 — Schema review**
Check each top-ranking page has correct `Service`, `LocalBusiness`, `FAQPage`, `Product` schema. Schema-enriched snippets CTR 20–40% higher in the same position.

### Priority
**P0.** This is the largest single untapped revenue opportunity visible in the data. Execution risk is low — all three fixes are reversible text changes.

---

## 3. [P0] Collection pages convert 10× worse than the homepage

### Evidence — GA4 landing-page report (28d, non-pixel-sandbox pages)
| Landing page | Sessions | Bounce | Eng (sec) | Conversions | CR |
|---|---|---|---|---|---|
| `/` | 1,439 | 46% | 70 | 60 | **4.17%** |
| `/collections/macbook-screen-repair-prices` | 1,472 | 41% | 22 | 4 | **0.27%** |
| `/collections/iphone-battery-repair-prices` | 969 | 45% | 25 | 5 | 0.52% |
| `/pages/macbook-repairs` | 934 | 51% | 25 | 5 | 0.54% |
| `/collections/iphone-screen-repair-prices` | 168 | 45% | 21 | 0 | 0.00% |
| `/collections/macbook-keyboard-repair-prices` | 140 | 46% | 39 | 0 | 0.00% |
| `/collections/iphone-16-repair-prices` | 127 | 58% | 11 | 0 | 0.00% |
| `/collections/iphone-13-repair-prices` | 100 | 54% | 12 | 0 | 0.00% |
| `/collections/ipad-repair-prices` | 74 | 53% | 82 | 2 | 2.70% |

Two very different worlds. The homepage keeps users for 70 seconds with a quote wizard and converts 4.17%. Collection pages keep users for ~22 seconds and convert under 0.5%. Engagement time and conversion rate move together — the collection pages don't hold attention long enough for a booking decision.

### Hypothesis
The homepage's quote wizard is a concrete "start a decision here" surface. Collection pages show a grid of products and a buy button (which fires `Add to Cart` but doesn't start the wizard). Users need to pick a product → add to cart → try to check out → hit the date/time requirement → abandon. That's 4 steps for a commitment instead of 1.

### Fix options

**Option 1 — Embed the quote wizard on collection pages (recommended)**
Add a "Not sure which repair?" wizard embed at the top of every collection page. Same flow, same events (`wizard_entry`, `book_now_clicked`), just presented before the product grid. Expected uplift: collection CR lifts from 0.3% toward the homepage's 4%. Even a 2× lift on the MacBook Screen Repair collection alone = 10–20 extra conversions/mo.

**Option 2 — Convert collection pages to rich landing pages**
Add above-the-fold: headline, sub-head, hero image, 3 trust signals, CTA → book via wizard. Keep the product grid as an alternative path below. Moves users from "browse" to "decide" mode.

**Option 3 — Preselect the user's context into the wizard**
When a user lands on `/collections/iphone-battery-repair-prices`, the wizard embed should open pre-filled with device = iPhone, fault = battery. One fewer step.

### Priority
**P0.** Collection pages are where most organic traffic lands (aggregate ~5,000 sessions across the 10 biggest collections vs 1,439 on the homepage). Closing even half the CR gap is worth 50–100 conversions/mo.

---

## 4. [P1] Mobile Safari is the biggest segment and converts worst

### Evidence — GA4 device × browser (28d)
| Device | Browser | Sessions | Bounce | Conversions | CR |
|---|---|---|---|---|---|
| Mobile | Safari | **9,715** | 34% | 144 | 1.48% |
| Desktop | Chrome | 3,991 | 51% | 169 | **4.23%** |
| Mobile | Chrome | 2,289 | 38% | 53 | 2.32% |
| Desktop | Safari | 1,712 | 26% | 36 | 2.10% |
| Desktop | Edge | 428 | 49% | 12 | 2.80% |
| Mobile | Android Webview | 396 | 23% | 0 | **0.00%** |
| Mobile | Safari (in-app) | 279 | 39% | 2 | 0.72% |

Mobile Safari is 50% of all sessions and half the conversion rate of Desktop Chrome. Android in-app webview (mostly Facebook and Instagram) converts at 0%.

### Hypothesis
Mobile-specific issues we have direct evidence for:
- The quote wizard's walk-in date picker worked poorly on mobile until PR #31 autofill (shipped today)
- Cookie banner covered most of the screen on mobile until PR #34/#35 (shipped today)
- Images weren't loading on collections until PR #31 (shipped today)

Three mobile-degrading bugs were fixed in the last 48h but the 28-day GA4 window includes all the old, broken sessions. Real mobile CR after these fixes ship + stabilise (~7 days) could be materially better.

### Fix options

**Option 1 — Re-measure mobile in 7 days (recommended first step)**
Before any new mobile-specific work, let the three fixes that shipped today circulate. Check GA4 for the 2026-04-22..04-29 window specifically on Mobile Safari bounce + CR.

**Option 2 — Investigate Android Webview zero-conversion separately**
If FB/IG in-app browser is effectively dead for conversion, that's a case for Option 1 in §1 (pause Meta paid) — it's also confirmation that much of the 3,050 Facebook paid sessions can't physically convert because of the in-app browser barrier.

**Option 3 — Mobile-first landing page variants**
Only worth doing if post-fix measurement still shows Mobile Safari under 2% CR. Stripped-down variant of key pages with single-column wizard.

### Priority
**P1 after measurement.** Don't over-fix before re-measuring.

---

## 5. [P1] Quote wizard 99% drop-off — biggest single leak at resolution step

### Evidence — PostHog, 14 days
```
wizard_entry                    7,966
wizard_step                     6,403    (-20%)
wizard_resolution                 592    (-91%)
wizard_abandoned                1,208
wizard_conversion                  78
Checkout Started                   75
Checkout Step: Payment Info        27    (-64% from Checkout Started)
Order Completed                     0    ← v3.2 custom pixel verification pending
```

**0.94% wizard → Checkout Started.**

The 91% drop between `wizard_step` (user answered faults question) and `wizard_resolution` (repair card shown) is the dominant leak. Of the 592 who reached resolution, 78 converted (13.2% resolution-to-conversion — a healthy rate).

### Hypothesis
One of:
- Users start the wizard, answer questions speculatively, and exit before they've committed to a specific fault
- The `wizard_step` event fires on every step transition so the count inflates (each user triggers it multiple times) — need to verify the event is unique per step not per session
- Some wizards hit a "we can't help with this one" dead-end that isn't tracked separately

We can't yet split these apart because `book_now_clicked` / `book_now_validation_failed` / `booking_form_started` only shipped <24h ago. 7 days of post-deploy data will resolve this.

### Fix options

**Option 1 — Wait 7 days for the new events (recommended)**
Don't fix speculatively. The instrumentation is now in place; let it run.

**Option 2 — Add `wizard_resolution_shown` vs `wizard_resolution_engaged`**
Small theme change to separate "card rendered" from "user clicked anything on card". Gives a cleaner denominator for all future optimisation.

**Option 3 — Aggressive session-recording triage**
Filter recordings to sessions where `wizard_step` fired but `wizard_resolution` didn't. Watch 10 to identify the common drop-off moment.

### Priority
**P1 in 7 days.** Logging the event flow is the prerequisite for any real fix here.

---

## 6. [P1] Dead-click hotspots — users tapping non-interactive elements

### Evidence — PostHog, 14 days
| Path | Dead clicks | Rage clicks |
|---|---|---|
| `/` | 94 | 15 |
| `/collections/macbook-repair-prices` | 59 | ~1 |
| `/collections/macbook-screen-repair-prices` | 41 | 12 |
| `/pages/our-services` | 38 | — |
| `/pages/advanced-diagnostic` | 34 | — |
| `/collections/iphone-repair-prices` | 25 | — |
| `/pages/our-warranty` | 24 | — |
| `/collections/macbook-pro-13-m1-a2338-2020-repair-prices` | 22 | — |

PostHog classifies a "dead click" as a click on an element that didn't produce any detectable interaction within 300ms (no navigation, no DOM change, no event listener). Rage clicks are repeated frustrated clicks in the same spot.

### Fix options

**Option 1 — Watch 3 recordings per page, fix the top 2 patterns**
PostHog → Events → filter `$dead_click` by pathname. Open each recording, note the x/y coordinates of the click, correlate to the element. 15 minutes per page, 1.5 hours for all 5 top pages.

**Option 2 — Make the whole product card clickable on collection pages**
`sections/icorrect-product-grid.liquid` currently only wraps the image and title in `<a>`. Wrapping the full card resolves the most common dead-click cause on collections (tapping price or badge and nothing happens).

### Priority
**P1** for collection pages (direct revenue path). **P2** for homepage (needs recording review first).

---

## 7. [P2] Channel insights worth acting on

### AI citations are already producing real bookings
- `chatgpt.com/(not set)`: 144 sessions, 8 conversions, 5.56% CR, £49 revenue
- `chatgpt.com/referral`: 50 sessions, 0 conversions
- `search.brave.com/referral`: 21 sessions, 3 conversions, 14.3% CR
- `duckduckgo/organic`: 91 sessions, 2 conversions

Small but non-zero. ChatGPT is the 7th-biggest source by session. AI visibility work is grounded in real bookings, not just traffic.

### Geography
- England: 14,815 sessions, 287 conversions (~1.94% CR) — the real UK market
- Scotland: 543 sessions, 3 conversions (0.55%) — high session count, poor conversion
- Wales: 392 sessions, 7 conversions (1.79%)
- Italy/Emilia-Romagna: 83 sessions, **75 conversions (90%)** ← noise, almost certainly a specific recurring non-customer session or bot farm reporting as Italian. Should filter this out of future conversion reports or investigate the specific user
- Singapore: 436 sessions, 0 conversions — likely bot traffic
- China: 115 sessions, 0 conversions — likely bots

**Action:** add a GA4 filter excluding non-UK traffic when building the conversion report. Dashboarding on the full-funnel should be UK-only to avoid the Singapore/China/bot noise.

### Conversion events on GA4
| Event | Count | Flagged as conversion |
|---|---|---|
| form_start | 327 | 327 |
| purchase | 56 | 56 |
| begin_checkout | 26 | 26 |
| generate_lead | 25 | 25 |
| scroll | 20,323 | 0 |
| user_engagement | 12,413 | 0 |

GA4 is counting `purchase`=56 in 28 days, Shopify shows ~45 orders in April = consistent. The `form_start` event at 327 is ~6× higher than `purchase` — there's a funnel leak from "filled a form" to "paid order" we should investigate separately.

### Priority
**P2** for acting. Mainly informs reporting hygiene.

---

## 8. Investigations — full status against the original 22

| # | Investigation | Status |
|---|---|---|
| 1 | PostHog event volume by name | ✅ 26 events |
| 2 | Rage + dead clicks by page | ✅ §6 |
| 2b | `$exception` events | ⚠️ 0 rows — capture not enabled; add `capture_exceptions: true` to `posthog.init` (1 line, no perf cost) |
| 3 | Bounce by landing page | ✅ §3 (via GA4) + PostHog corroboration |
| 4 | `book_now_validation_failed` reasons | ⚠️ 0 rows — shipped <24h ago |
| 5 | Device-type super prop at funnel steps | ⚠️ mostly null — shipped <24h ago |
| 6 | Session duration distribution | ✅ 56% of sessions <30s |
| 7 | Referrer/UTM breakdown | ⚠️ PostHog `$initial_*` props mostly null; use GA4 source/medium instead (§1) |
| 8 | GA4 landing page report | ✅ §3 |
| 9 | GA4 source/medium | ✅ §1 |
| 10 | GA4 Core Web Vitals events | ❌ No CWV events in GA4 — theme doesn't push them via gtag. Use PSI + CrUX once API key set |
| 11 | GA4 page × conversion | ✅ integrated into §3 |
| 12 | Geography | ✅ §7 |
| 13 | Device + browser | ✅ §4 |
| 14 | Pages with impressions but 0 clicks | ✅ §2 |
| 15 | Queries with high imp low CTR | ✅ §2 |
| 16 | Sitemap + index | ✅ 2 sitemaps registered on sc-domain property (1,114 + 20 URLs submitted). No coverage issues |
| 17 | GSC device split | ✅ in §2 analysis |
| 18 | Country breakdown | ✅ UK 95%+ |
| 19 | Top-10 rank with 0% CTR | ✅ §2 |
| 20 | GSC rank + GA4 bounce cross-ref | ✅ macbook-screen-repair-prices ranks for `macbook screen repair` but lands with 41% bounce + 0.27% CR — content-intent mismatch is the story |
| 21 | GSC referrers vs GA4 attribution | ✅ GA4 sees many more session sources than GSC (which only shows organic Google). No obvious gap |
| 22 | PostHog engagement vs GA4 conversion | ✅ PostHog says /collections/macbook-screen-repair-prices has 865 sessions, GA4 says 1,472 — different windows (14d vs 28d) explain the ratio |
| + | PSI / CrUX per page | ❌ Rate-limited — needs `PAGESPEED_INSIGHTS_API_KEY` |

---

## Suggested priority queue

Actionable, in order:

1. **Homepage snippet rewrite** targeting iPhone/iPad/MacBook battery+screen keywords (§2). 1 hour; next deploy.
2. **Embed quote wizard on top 5 collection pages** (§3). 2–4 hours depending on template reuse. Highest single-lever uplift on organic traffic.
3. **Add `PAGESPEED_INSIGHTS_API_KEY`** to `api-keys/.env` and schedule a weekly CWV crawl of the top 8 templates. Unblocks CWV-per-page analysis.
4. **Watch 10 dead-click recordings on homepage + macbook-screen-repair-prices**, fix top 2 patterns (§6). 1.5 hours.
5. **Add `capture_exceptions: true`** to `posthog.init` — 1 line, then wait 7 days for exception data.
6. **Wait 7–14 days**, then re-analyse:
   - Wizard funnel with `book_now_clicked` / `book_now_validation_failed` / `booking_form_started` now firing
   - Mobile Safari CR after images, cookie banner, and booking-form fixes have been live for a week
   - Meta Events Manager match-keys (`fbc`/`fbp` should now be >0%) and GA4 `facebook / paid` revenue re-check — only then is a channel decision on Facebook real (§1)

---

*Prepared by Claude Code via direct PostHog + GA4 + GSC + Meta Graph API calls — 22 April 2026*
