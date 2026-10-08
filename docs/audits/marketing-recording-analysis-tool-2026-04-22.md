# Session Recording Analysis Tool — Spec
**Prepared for:** Ricky Panesar / Claude Code  
**Date:** 22 April 2026  
**Status:** Proposed — needs build

---

## The Problem

PostHog has 100+ session recordings, but reviewing them manually is:
- Time-consuming (2-5 minutes per recording)
- Subjective (what one person notices, another misses)
- Not scalable (can't review 100 recordings daily)

**We need automated analysis** — extract patterns from recordings at scale.

---

## What We Can Build

### Option 1: PostHog API Extraction + Analysis (Recommended)

**What it does:**
1. Pulls session recording data via PostHog API
2. Extracts click coordinates, scroll depth, time on page
3. Aggregates patterns across all recordings
4. Generates a dashboard showing:
   - Heatmap of clicks (where users click most)
   - Scroll depth distribution (how far users scroll)
   - Drop-off points (where users leave)
   - Device comparison (mobile vs desktop behaviour)

**Data available from PostHog API:**
- Click coordinates (x, y)
- Scroll events
- Page navigation
- Time on each page
- Device type
- Referrer

**Output:**
```
MacBook Screen Repair Page (1,175 views)
├── Clicks on "Book now": 12% of users
├── Clicks on date field: 8% of users
├── Clicks on time field: 6% of users
├── Scroll to booking form: 45% of users
├── Scroll to FAQ: 70% of users
├── Average time on page: 89s
├── Mobile: 3.2% click "Book now"
└── Desktop: 5.1% click "Book now"
```

**Build effort:** Medium (1-2 days)
**Cost:** Free (uses existing PostHog data)

---

### Option 2: Enhanced PostHog Event Instrumentation (Immediate)

**What it does:**
Add custom events to the site so PostHog captures exactly what we need:

| Event | What it tells us |
|-------|------------------|
| `booking_form_started` | User clicked date or time field |
| `book_now_clicked` | User tried to book |
| `book_now_validation_failed` | User clicked without date/time |
| `scroll_depth_25/50/75` | How far users scroll |
| `faq_expanded` | Which FAQ questions users care about |

**This is BETTER than recordings because:**
- It's quantitative (exact counts, not subjective observations)
- It's real-time (see data within minutes)
- It's scalable (works for 100 or 100,000 users)
- It enables A/B testing (measure before/after changes)

**Build effort:** Low (few hours)
**Cost:** Free

---

### Option 3: Heatmap Tool (External)

**Options:**
- **Microsoft Clarity** — Free, integrates with Shopify
- **Hotjar** — £79/month, more features
- **Crazy Egg** — £49/month

**What they provide:**
- Click heatmaps (where users click)
- Scroll heatmaps (how far users scroll)
- Session recordings (same as PostHog)
- Conversion funnels

**Pros:**
- No build required
- Immediate setup
- Beautiful visualisations

**Cons:**
- Another tool to manage
- May conflict with existing tracking
- Monthly cost

---

## My Recommendation

**Do Option 2 first (events), then Option 1 (analysis).**

### Phase 1: Add Events (This Week)
Claude Code adds the 10 custom events to the theme. This takes a few hours.

### Phase 2: Build Analysis Tool (Next Week)
I build a Python script that:
1. Pulls PostHog data via API
2. Generates daily reports
3. Alerts when patterns change

### Phase 3: Visual Dashboard (Later)
If needed, build a simple dashboard showing:
- Daily funnel metrics
- Heatmaps
- Device comparison
- A/B test results

---

## What This Gives You

Instead of watching recordings manually, you get:

**Daily Report (automatic):**
```
April 22, 2026
- 347 users visited MacBook screen repair page
- 45% scrolled to booking form
- 12% clicked "Book now"
- 8% clicked without date/time (validation failed)
- 3% completed booking
- Mobile conversion: 1.2% | Desktop: 2.1%
```

**Weekly Report:**
```
Week of April 15-21
- Booking form engagement: +15% vs last week
- Validation failures: -8% (date/time autofill working)
- Checkout completion: +5%
- Top drop-off: Contact info step (62% abandon)
```

**Alert:**
```
ALERT: MacBook screen repair page conversion dropped 20% today.
Possible causes: page load speed, new deployment, competitor ad.
```

---

## Next Steps

1. **Ricky approves** — Add custom events to site?
2. **Claude Code implements** — Add 10 events to theme (few hours)
3. **I build analysis script** — Pull data, generate reports (1-2 days)
4. **Test and iterate** — Verify data accuracy, refine reports

---

*Prepared by Marketing Jarvis — 22 April 2026*
