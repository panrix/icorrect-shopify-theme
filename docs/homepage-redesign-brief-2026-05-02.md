# Homepage redesign brief — for Claude Design
**Date:** 2026-05-02
**Author:** Claude Code, with Ricky (working session)
**Surface:** `https://icorrect.co.uk/` only (collection + product page redesigns are separate briefs)
**Status:** Decisions locked — ready for design pass

---

## The principle

> **The new homepage must stand on the shoulders of what already works.**

The current homepage is the **best-converting page on the site** — 4.17% conversion rate vs 0.27% on the MacBook Screen collection (28-day GA4 window). The wizard mechanic is the engine. **Do not rip it out, bury it, or replace it with something untested.** The redesign is an upgrade, not a rebuild from zero.

The redesign also has to fix what's broken — 194 dead clicks in 28 days (highest of any page), generic SERP snippet that wins zero clicks on high-intent device queries, no diagnostic path for non-quote-ready visitors.

---

## The brand promise

**"We repair what they can't."**

This is the load-bearing line. It's the truth of the business — microsoldering, liquid damage recovery, "Apple said write-off, we fixed it" cases — and it is what makes iCorrect categorically different from every high-street repair shop, every uBreakiFix, every Apple Store. Every other line on the homepage has to back this one up with proof.

Generic copy like "London Apple repair specialists" or "Get a free quote now" is permitted as supporting copy, but **it cannot be the hero**. The promise has to be the first thing the visitor reads.

---

## The two intents the homepage must serve

Most homepage failures come from picking one. This page picks both, side by side:

### Intent A — Quote-seekers (high commercial intent)
- Already know they need a repair
- Came directly or from a branded search
- Action: **start the wizard, get a price, book**
- Today: this is the user the homepage already serves well

### Intent B — Diagnosis-seekers (mid / top of funnel)
- Have a problem, don't know what's wrong, may not even know if it's repairable
- Came from a generic problem-shaped search ("MacBook won't turn on after spilling coffee", "iPhone screen flickering")
- Action: **walk them through a diagnostic, then route to a quote, an article, or a contact**
- Today: this user gets nothing useful from the homepage and bounces

Both audiences are on the same page. They self-select via two equal-weight CTAs in the hero. **Neither path is buried.**

---

## The two customer types — same homepage, different sections within it

### Type 1 — Consumer (everyday device problems)
- Cracked iPhone screen, old MacBook battery, iPad won't charge
- Likely price-conscious, comparing to Apple Store and high-street shops
- Wants: clear price, fast turnaround, trust

### Type 2 — Specialist case (advanced repair, often business-critical)
- "My MacBook is dead and I need the data"
- "Logic board fault Apple won't touch"
- "Time-critical recovery"
- Often corporate, often high stakes
- Cost is secondary; **success rate is primary**
- Wants: proof we can do what others can't, direct route to talk to a human

**The homepage must serve both without trying to be everything to everyone.** Type 1 lands in the wizard / diagnostic. Type 2 sees a quiet but unmissable specialist section that routes them to contact, not commerce.

---

## The diagnostic journey (new — strategic move)

This is the biggest functional addition. A second journey alongside the booking wizard:

```
                "Help me diagnose →"
                        ↓
            Symptoms questionnaire (3–6 questions)
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
   "We can fix this  "Here's what's   "This needs hands-on.
    — here's a       likely wrong +   Let's talk."
    quote."          a guide"         (specialist case)

   → routes to        → routes to       → routes to contact form
   wizard with        a content         with pre-filled
   pre-fill           article on        symptom summary
                      iCorrect blog
```

### Why this matters strategically

The Google authority signal: visitors who don't convert today still **engage 2–3 minutes with iCorrect-branded diagnostic content**, on iCorrect URLs, reading iCorrect logic. Google reads that as expertise. Even non-converters become "iCorrect knows what they're talking about" mental bookmarks. Some come back when they're ready. Some refer.

The current homepage catches **only the bottom of the funnel** (people ready to quote). The diagnostic journey catches mid- and top-of-funnel. That's a strategic move no high-street competitor will replicate because it requires real diagnostic expertise to write the content.

### Phasing

**Phase 1 (ship first):**
- Static branching: 3-question form → routes to one of N pre-written articles or to the wizard
- 5–10 articles needed (see Content Dependencies below)
- Feels smart enough; cheap to build

**Phase 2 (later, if Phase 1 shows usage):**
- Dynamic, scaled version with deeper symptom branching
- Possibly a separate dedicated `/diagnose` page rather than embedded on the homepage

The brief is asking for **Phase 1 only.** Don't over-build the diagnostic until we know users will use it.

---

## Page structure

```
1. HERO
   "We repair what they can't."
   Sub: Microelectronic specialists · Central London · 2-year warranty
   Two equal-weight CTAs:
     [Get a quote →]         (scrolls to / opens wizard)
     [Help me diagnose →]    (scrolls to / opens diagnostic)

2. PROOF — "What others said was unfixable"
   Not testimonials. Specific real cases:
     - "Apple quoted £1,400 for a logic board. We microsoldered the failed
       IC for £280."  + actual board photo
     - "Liquid damage, two weeks in rice. Recovered, including all data."
       + before/after photo
     - "Touch ID failure post-screen replacement. Two other shops said
       unfixable."
   3–4 of these. **Photos of actual repaired boards, not stock images.**

3. WIZARD
   Full booking wizard inline (the upgraded one from
   docs/wizard-ux-review-2026-05-02.md). High-intent users land here
   without scrolling further.

4. DIAGNOSTIC ENTRY
   "Not sure what's wrong? Walk us through it."
   Visible alternative for the second intent. Step into the symptom
   questionnaire here, or via the hero CTA above.

5. WHAT WE FIX (compact)
   Screen · Battery · Logic board · Liquid damage · Data recovery
   Each is a tile linking to the matching collection page. Compact —
   this is a router, not a sales section.

6. SPECIALIST WORK (the second audience)
   Quiet, distinct section. Reads more like B2B than B2C:
     - "Time-critical recovery"
     - "Business-critical devices"
     - "When data matters more than the device"
   Single CTA: "Talk to a specialist →" → contact form (not wizard).

7. HOW IT WORKS
   4-step diagram: Book → Drop / Collect → Repair → Return.
   Clarifies what to expect for first-timers. Reuses the same
   "real dates not abstract turnaround" thinking from the wizard
   redesign.

8. SOCIAL PROOF
   Real reviews. Named. Dated. Device + repair-type referenced.
   Aggregate Google review count + star rating prominent (this is the
   number people check most). No "Trusted by thousands" without proof.

9. FAQ
   Top 5–6 questions. Working accordions (verify open behaviour
   on mobile — current site has dead-click hits on FAQs that may
   indicate broken handlers).

10. FOOTER
    Standard.
```

### Why this order

- **Hero before everything**: the brand promise is what wins or loses Google CTR (currently 0% on high-intent device queries because the SERP snippet is generic).
- **Proof before wizard**: even high-intent users glance at proof; it's the bridge from "this looks legit" to "let me start." Two scroll-actions to the wizard, not zero — but worth it for the trust uplift.
- **Wizard high in the page**: high-intent users shouldn't have to scroll past five sections of marketing copy to start a booking.
- **Diagnostic immediately after wizard**: the alternative path is unmissable for users who pressed "diagnose" but didn't end up there from the hero.
- **Specialist section after the consumer flow**: high-stakes repair customers will scroll. The consumer flow has to land first because they're the volume.

---

## What to actively avoid

| Pattern | Why it's banned |
|---|---|
| Hero carousels / sliders | Historically tank conversion; nobody clicks past slide 1 |
| Stock photography of "smiling customer with phone" | Every competitor uses these; signals generic high-street shop |
| Long marketing copy before any CTA | High-intent users bounce before reaching the wizard |
| "Trusted by thousands of customers" without a number | Meaningless — worse than silence |
| Yellow/red "WE FIX SCREENS" energy | This is high-street aesthetic. iCorrect is the opposite of that. |
| Pricing on the homepage as the primary message | Apple beats us on price for some repairs; we don't compete on price, we compete on capability |
| Generic "Apple repair specialists London" copy in the hero | Loses the SERP CTR battle to better-positioned competitors |
| Multiple competing CTAs of the same intent | The hero has two CTAs because they serve different intents. Anywhere else, one CTA per section. |

---

## Aesthetic guard rails

**iCorrect is the specialist, not the high-street shop.** The visual language should signal:

- **Technical competence** — clean type, restrained colour, generous whitespace
- **Workshop authenticity** — real photos of real repairs, real boards, real workspace
- **Premium without being precious** — accessible, not exclusive; the busy parent with a cracked iPhone has to feel as welcome as the CTO with a dead laptop
- **Quiet confidence, not loud claims**

Reference vibes (the brief's vibe target — designers can interpret):
- An indie design agency's case-studies page, not a phone repair store
- A boutique watchmaker's "restorations" page
- An architecture firm's project page
- The handoff bundle's Geist/Vercel-leaning aesthetic from the collection-page prototype is **fine** as a starting palette — slightly more warmth would be appropriate for a customer-facing repair shop than for a developer tools company, but the typographic discipline and minimal chrome are right.

---

## Content dependencies (block before launch)

The diagnostic journey can only ship if the content it routes to exists. These articles must be live before the homepage redesign goes to production:

| Article topic | Routed from |
|---|---|
| MacBook won't turn on — what to check | "Dead / black screen" diagnostic |
| iPhone screen flickering or distorted | "Display issues" diagnostic |
| Liquid damage — first 24 hours | "Spilled liquid recently" diagnostic |
| iPad won't charge — port vs board vs battery | "Charging issues" diagnostic |
| Data recovery from a dead Mac | "Need data from broken device" |
| When Apple says it's unfixable — what to do | Specialist case entry, also good SEO |
| Battery health below 80% — replacement guide | "Battery degraded" diagnostic |
| What an Apple-quality screen repair looks like | Trust + general SEO |

Some of these may already exist on the iCorrect blog. Marketing should audit existing content first; net new = ~5–7 articles. Worth treating this as a parallel content sprint, not a blocker that holds the design team idle.

---

## What must be preserved from today's homepage

| Today's element | Status in redesign |
|---|---|
| Quote wizard (the engine of 4.17% CR) | ✅ Keep, redesigned per `wizard-ux-review-2026-05-02.md` |
| Trust band (reviews aggregate) | ✅ Keep, possibly redesigned |
| Existing CTAs ("Get a quote") | ✅ Keep one path; add a second equal-weight diagnostic path |
| 70s+ average engagement time | ✅ Keep (the redesign should have things worth reading; don't strip down so much that engaged users have no payoff) |
| FAQ section | ✅ Keep, fix accordion behaviour |
| Currently-good org schema for "Apple repair London" | ⚠️ Carry forward in the redesigned `<title>` and meta description |

The redesign's worst-case outcome must not be **a homepage that converts worse than 4.17%**. Every visual or structural choice that risks regression is a deliberate trade and should be flagged.

---

## Measurement plan

**Pre-launch baseline:** captured 2026-05-02 in
`snapshots/2026-05-02-baseline-pre-design-rollout.json`

**Post-launch checks** (run after the redesign deploys):
```bash
set -a; source /home/ricky/config/api-keys/.env; set +a
python3 scripts/analysis/posthog_snapshot.py --label post-homepage-redesign
python3 scripts/analysis/posthog_diff.py \
    snapshots/2026-05-02-baseline-pre-design-rollout.json \
    snapshots/2026-XX-XX-post-homepage-redesign.json \
    --window 28 \
    --filter-path / \
    --out reports/post-homepage-redesign-diff.md
```

**Metrics that matter most for this surface:**
1. Bounce rate on `/` (currently 75.2%) — should drop or hold
2. Median session duration on `/` (currently 38s in 28-day window, 70s overall avg) — should hold or rise
3. Dead clicks on `/` (currently 194 in 28d, mostly inside wizard service cards + FAQ accordions) — should drop substantially when wizard fixes ship together
4. `wizard_entry` count from sessions starting on `/` — should rise (more visitors find the wizard)
5. `wizard_conversion` from those sessions — should hold or rise (don't dilute the converter)
6. **New metric: `diagnostic_started`** — track diagnostic engagement (event needs adding when the diagnostic flow is built)
7. **New metric: `diagnostic_outcome`** with property `route: quote | content | contact` — track which exit users take

---

## Decision log

| # | Decision | Status |
|---|---|---|
| 1 | Hero line: "We repair what they can't." | ✅ Locked |
| 2 | Two equal-weight hero CTAs (Quote / Diagnose) | ✅ Locked |
| 3 | Wizard kept and prominent (not buried) | ✅ Locked |
| 4 | New diagnostic journey, Phase 1 = static branching | ✅ Locked |
| 5 | Specialist-case section as a distinct surface for the high-stakes audience | ✅ Locked |
| 6 | Real-photo proof of unfixable repairs (no stock imagery) | ✅ Locked |
| 7 | High-street-shop aesthetic explicitly forbidden | ✅ Locked |
| 8 | Geist/Vercel-leaning typography from collection-page prototype = starting palette | ⚠️ Designer's call to refine for warmth |
| 9 | Content articles for diagnostic exits | ❌ Block on launch — write or audit existing first |
| 10 | New events `diagnostic_started`, `diagnostic_outcome` | ❌ Add to instrumentation when the diagnostic flow ships |
| 11 | Hero copy after the headline (sub, CTAs) | ❌ Designer's call within the constraints above |
| 12 | Specific ordering of sections 5–9 | ⚠️ Defaults set above; designer can argue for re-order with rationale |

---

## Companion docs

- **Wizard redesign:** `docs/wizard-ux-review-2026-05-02.md` — the wizard that the homepage embeds is specced separately. Both must ship in coordination.
- **Audit findings:** `docs/marketing-full-audit-codex-2026-04-22.md` — the full data context for why the homepage matters
- **Dead-click reference:** `docs/dead-click-analysis-2026-04-23.md` — element-level breakdown of where the 194 dead clicks land

---

*Prepared by Claude Code with Ricky — 2026-05-02. Ready for handoff to Claude Design.*
