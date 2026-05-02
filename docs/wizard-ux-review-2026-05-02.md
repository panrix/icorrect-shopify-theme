# Quote Wizard — UX review
**Date:** 2026-05-02
**Author:** Claude Code (direct)
**Sources:** Live wizard `sections/quote-wizard.liquid` (3,333 LOC) · Prototype handoff from Claude Design (`Wizard.jsx`, 772 LOC + `wizard.css`, 776 LOC) · PostHog snapshot `snapshots/2026-04-23-baseline-pre-design.json` · `docs/dead-click-analysis-2026-04-23.md`.

---

## TL;DR

The live wizard is doing too much, in too many steps, on too many surfaces. The biggest single failure is **users dropping out before step 1 even completes** (5,389 of 8,848 wizard_entry events, **61%**, never select a device). The prototype design fixes this structurally by **scoping step 1 to the page context** (you're on a MacBook Screen collection page, so device + repair-type are pre-known). It also collapses the rest of the journey from 5 steps to 3, replaces the dead-end `contact` route with a first-class "Ask a question" mode, and adds a state-aware floating mini-wizard for re-engagement.

The prototype isn't a drop-in replacement — it lacks the live wizard's full fault-routing logic and product mapping for non-screen repairs. But for the **collection-page entry path**, it's a clear improvement on every metric we have data for.

---

## Live wizard — UX diagnostic

### Funnel data (PostHog, last 14d)

```
wizard_entry                  8,848
wizard_step                   6,403   (-28%, but step is pre-step-1 noise — see below)
wizard_resolution             1,147   (-91% from wizard_step, -87% from entry)
wizard_conversion               152   (1.72% end-to-end)
Checkout Started                130
Checkout Step: Payment Info      45   (-65% from Checkout Started)
```

### The five real UX problems

#### 1. **The first step is invisible to 61% of users**
- 5,389 of 8,848 `wizard_entry` events fire with `S.device = null` and never advance.
- The current step 1 is a 4-tile device picker (iPhone / iPad / MacBook / Watch) shown the moment the wizard mounts. On a MacBook collection page the user has *already chosen* MacBook by being there. The picker is asking a question they've already answered, which signals "this isn't smart" and they bounce.
- **Prototype fixes this:** the new step 1 is "Which MacBook?" — pre-scoped to the surface the user landed on. Family/size filters are inline rather than a separate screen.

#### 2. **Step 2 (model picker) hides everything inside accordions**
- Live wizard renders model groups as collapsed accordions; one is open at a time. Selecting the wrong family forces a click-to-collapse-then-click-to-open dance.
- The accordion has no count of "models matching what you've already filtered" — users don't know how deep each group is.
- **Prototype fixes this:** flat grid by default on desktop, family-then-grid on mobile. Filter chips (`Pro` / `Air` / `13"` / `14"` / etc.) reduce noise without hiding it. Empty state has a "Clear filters" recovery affordance.

#### 3. **Fault → issue is the cliff** — 91% drop between `wizard_step` and `wizard_resolution`
- Three of the five steps live between "device picked" and "we're showing you a price." Each is a list of 5–10 options with verbose descriptive copy.
- The MacBook screen branch in particular is **mostly theatre**: 5 of 6 fault options route to the same screen-replacement product. Asking the user to discriminate between "thick bands or distortion" and "dead pixels or bright spots" doesn't change what we sell — it just adds a click and a cognitive load that 91% of users won't pay.
- See yesterday's discussion: simpler 2-question test (does it turn on? do KB+trackpad work?) routes the same outcomes more accurately and in fewer clicks.
- **Prototype fixes this:** 6-issue list, most with fixed prices. "Hinge / lid damage" and "Something else" are explicitly tagged `Diagnosis`. No fault → issue → resolution chain — issue selection is the resolution.

#### 4. **The resolution page presents a high-commitment buy decision in one breath**
- Live resolution card shows: total price, mandatory date-time picker, contact form, walk-in/mail-in toggle — all together. It looks like a checkout, but the user hasn't agreed to anything yet.
- Resolution-to-conversion rates (14d):
  - `repair` route: 6.4% conversion
  - `diagnostic` route: 21.9% conversion
  - `contact` route: **36.7% conversion** — the highest, but presented as a "we can't help" dead end.
- **Prototype fixes this:** Quote step has 3 explicit modes — *Book repair* / *Email quote* / *Ask a question* — chosen via tabs. The "Ask a question" mode is no longer a polite dead-end; it's positioned as a normal valid outcome ("technician (not chatbot) replies in 2 hours"). Email mode is positioned as the insurance-claim path explicitly. This recasts what we already see in the data: 41 `contact_submit` outcomes per 14d are real conversions, not failures.

#### 5. **Date/time validation is still too easy to fail**
- We shipped autofill for the next available slot in PR #31. That helps, but the field is still mandatory and visually heavy in the resolution card.
- `book_now_validation_failed` event went live <24h before the snapshot, so reason-distribution data isn't useful yet — but the event will mature in the next 7 days.
- **Prototype fixes this implicitly:** delivery method (walk-in / courier / mail-in) is the primary commitment; date/time isn't on the booking step at all. The follow-up confirmation email handles scheduling. This trades convenience for friction reduction — and the data already says friction reduction is the bigger lever.

### Other UX problems the data flags

- **Dead clicks on FAQ accordions inside the wizard resolution page** (8 questions, ~4 dead clicks each). PostHog likely false-positives because `style.maxHeight` changes don't register as DOM mutations. Cosmetic but mis-trains the dead-click metric.
- **`+£20` and `Included` price labels on the service-type cards** — 6 dead clicks total. Users tap the price, expecting it to select the card. The card itself responds, but the price label is a `<div>` whose click doesn't bubble reliably on mobile.
- **`Email` and `Phone` labels in the contact-info card** are not wrapped in the `mailto:` / `tel:` anchors — only the values below are. 4 dead clicks.
- **5,973 sessions ≥0s in 14d, 56% under 30s.** A meaningful chunk of these are bots; the rest are real people who decide we're not what they want before the wizard even renders fully. Wizard-design choices don't help these — **page-level affordance and trust signals do**.

---

## Prototype — what it does well

### 1. **Page-context scoping eliminates step 1's dead air**
The whole prototype assumes "you're on the MacBook Screen Repair collection page" and skips the device + repair-type questions. The same pattern applied to other collection pages would mean every collection-landing user enters the wizard with their first two answers pre-filled. This is the single biggest behavioural lever in the prototype.

### 2. **3 steps with a real "back" affordance**
Each step has a `← Back` button as a first-class element, not a hidden gesture. Live wizard relies on the global progress dots, which don't read as actionable to most users.

### 3. **localStorage persistence**
`useWizardState()` writes to `localStorage` on every change. A user can navigate away to read the FAQ, come back, and the wizard remembers where they were. The live wizard resets on any page change.

### 4. **Three-mode quote outcome**
*Book repair* / *Email quote* / *Ask a question* are tabs on the same step, not three different paths. This:
- Promotes the highest-converting `contact` route (37%) from "dead end" to "valid choice"
- Acknowledges the insurance-claim use case explicitly (Email quote → "send to my insurer")
- Lets a user toggle modes without losing their device + issue selection

### 5. **London postcode validation as a friction reducer, not gate**
Courier delivery requires a postcode. Non-London postcode triggers an inline soft-fail: *"That postcode is outside London. We'll switch you to free mail-in and email a pre-paid label."* with a one-click switch. This is the right pattern — never reject the user, always offer the next door.

### 6. **State-aware floating mini-wizard**
Once the user scrolls past the main wizard, a sticky bar appears showing their current selections as chips ("Model: MacBook Pro 14" · Issue: Cracked glass · Turnaround: 1–2 days") with a context-aware CTA. Live wizard has nothing equivalent — once the user scrolls down to read FAQs, the wizard might as well not exist.

### 7. **"Don't know which MacBook you have?" model-code lookup**
Inline help card at the bottom of step 1 with an `A2442`-style code input. Reduces "which model" abandons. Live wizard sends users to a separate page if they don't know.

---

## Prototype — gaps and concerns

### 1. **Scope is screen-only**
The prototype hardcodes MacBook screen repair. Production rollout needs:
- The same pattern repeated for iPhone screen, iPhone battery, MacBook battery, etc. (~15 collection variants)
- A non-collection variant for the homepage and direct-traffic landings (where device isn't pre-known)

This is fine — it's expected for a prototype — but the brief should call it out so we don't ship the redesigned macbook-screen page and leave the rest stranded.

### 2. **No connection to the live wizard's product/price logic**
The prototype hardcodes prices in `MAC_MODELS` (e.g. `mbp-14-m3: £449`). Live wizard pulls these from Shopify product data via collection handle → repair type → product variant. Implementation must:
- Wire `MAC_MODELS` to live Shopify product data so prices stay accurate
- Use the same `_repairsMap` system we already have, not a parallel dataset

### 3. **Submit handler is a stub**
`onSubmit` in the prototype just sets `submitted = true` and shows a confirmation. The live wizard does:
- `cart/add.js` POST to Shopify with main product + speed upgrade + service-type variant + line-item properties
- VPS intake webhook for contact and email-quote routes (`fix/intake-migration-quote-wizard`)
- PostHog `wizard_conversion` event with action and route properties

Implementation must keep all three working. **This is non-negotiable** — any implementation that loses event firing breaks the snapshot diff measurement we set up to prove the redesign worked.

### 4. **No mention of the bank-holiday blackout we shipped today (PR #39)**
The 2026-05-04 blocking logic in `wireWalkinPicker` isn't represented in the prototype's date handling. Either:
- The prototype assumes scheduling moves to the post-booking confirmation email (in which case the blackout becomes a customer-service script), or
- The prototype just hasn't accounted for it

Worth confirming with the design intent before implementation.

### 5. **Accessibility — partial**
- `role="tablist"` + `aria-selected` on the mode tabs ✓
- `aria-label` on chip buttons ✓
- Keyboard navigation through the model grid: not yet tested (the prototype renders buttons, so should work, but tab order through filter chips → grid → help card needs checking)
- The progress-dot buttons disable themselves via `disabled` if the step isn't yet reachable — good, but a screen reader announcement of "step 2 of 3, locked until you pick a model" would be better than silently disabled

### 6. **Mobile model picker funnels through a family screen**
Family → models is a strong mobile pattern (reduces choice paralysis on small screens) but adds a click. For a returning user who already knows their model, this is friction. Worth A/B testing against a single-screen mobile grid.

### 7. **The floating mini-wizard appearing after scroll-past has its own UX risks**
- It's a sticky element on mobile — eats screen real estate that's already constrained
- It's a hover-style component, but mobile doesn't have hover — `expanded` state is toggled by tap, but the bar's tap target is generous so accidental opens are likely
- A user who closed the floating wizard once and then scrolls again should probably not see it re-summon — needs a "dismissed" state

### 8. **Email-quote flow dropped a key live feature**
Live wizard's email-quote produces a real branded PDF with serial number request as follow-up. Prototype just confirms with copy. Implementation should keep the live flow's email-PDF behaviour and use the prototype as visual treatment only.

---

## Recommendations

### Before implementation

1. **Confirm scope:** macbook-screen-repair-prices first, then which other collection pages? Suggested cascade order from the audit (highest-impact first):
   - `/collections/macbook-screen-repair-prices` (1,840 sessions/28d, 0.27% CR — biggest absolute uplift available)
   - `/collections/iphone-battery-repair-prices` (851, 0.59%)
   - `/collections/iphone-screen-repair-prices` (179, 0%)
   - `/collections/macbook-battery-repair-prices` (94, 0%)
   - `/collections/ipad-repair-prices` (74, 2.7%)
2. **Decide the date/time question:** does the redesign drop pre-booking date/time entirely (handle in confirmation email), or keep it for walk-in only?
3. **Decide the family-screen-on-mobile question:** measure as part of the rollout, but pick a default.

### During implementation

1. **Reuse, don't replace, the live wizard's data + event layer.** The new design is a SHELL; keep the live wizard's product mapping, PostHog event firing, intake webhook, and Shopify cart logic intact under the hood.
2. **Keep all instrumentation events firing.** `wizard_entry`, `wizard_step`, `wizard_resolution`, `wizard_conversion`, `book_now_clicked`, `book_now_validation_failed`, `proceed_to_checkout_clicked`, `email_quote_clicked`, `question_form_opened`, `booking_form_started`, `faq_expanded`, `scroll_depth_*`. The diff tool measures the redesign's impact through these.
3. **Self-host the Geist fonts under `assets/`.** No `unpkg.com` runtime React/Babel.
4. **Add a `wizard_resolution_shown` event** distinguishing "card rendered" from "user engaged". The current `wizard_resolution` conflates them, which is why we can't read the resolution-step drop-off cleanly.

### After implementation

1. **Capture a fresh PostHog snapshot the day before deploy.** `python3 scripts/analysis/posthog_snapshot.py --label baseline-pre-collection-redesign-deploy`.
2. **7 days post-deploy:** snapshot + diff against baseline. Look for:
   - `wizard_entry` → `wizard_resolution` conversion delta (this should be the biggest win — pre-context scoping)
   - `wizard_resolution` → `wizard_conversion` delta (smaller, but the three-mode tabs should help)
   - Dead clicks on the redesigned page (should drop on FAQ + service cards)
   - Mobile Safari conversion rate (the wizard is the primary mobile commitment surface)

---

## Resolved spec decisions (2026-05-02 working session)

The following decisions are now locked in for the wizard rebuild brief.

### Step structure on collection pages → 2 steps

```
Collection page (e.g. /collections/macbook-screen-repair-prices)
   ↓
Step 1 — Pick your model       (this also reveals the price)
   ↓
Step 2 — Book / Email quote / Ask a question
```

The fault is implied by the page (we know it's a screen repair). Skip the fault step entirely on collection pages. For homepage / non-collection entries, fall back to the longer flow (device → fault → model → quote).

### Contact route → first-class outcome, not dead-end

Restore as a normal CTA the way the current site has it. Two surfaces:

1. **Tabbed third option on Step 2** — `Book repair / Email quote / Ask a question` (matches prototype's pattern)
2. **Persistent escape link on every step** — small "Have a question? Talk to us →" in the wizard chrome

Both because the data shows the contact route is the highest-converting outcome (36.7% vs 6.4% for direct repair) and we should make it as reachable as possible.

### Turnaround tiers → 2 tiers, product-level availability

Only two turnaround upgrades, not three:

| Tier | Add-on | Customer promise |
|---|---|---|
| **Standard** | Free | 2–3 working days |
| **Fast** | +£X | Next working day |
| **Fastest** | +£Y | Same day if booked before 12pm |

Currently offered **on MacBook screen repairs only**. Expanding to other products as the team grows. The wizard must check at runtime whether the chosen product has speed-upgrade variants and show the tier picker only when they exist — silently fall back to Standard otherwise.

Implementation hook: read a Shopify product metafield `custom.has_speed_upgrade` (boolean) on the resolved repair product, or rely on the existing `detectExpressFromPage` pattern. Either is fine; metafield is cleaner.

### Service type → postcode-driven, zone-based pricing

Replace the binary "walk-in / mail-in" with three options, postcode-aware:

| Service | Cost | Who can use |
|---|---|---|
| **Walk-in** | Free | Anyone — they bring it to W1W 8JQ |
| **Same-day courier** | £35 / £45 / £58 by zone | London postcodes only |
| **Next-day courier** | £24 flat | All UK |

Implementation: a `assets/courier-zones.json` config file with postcode prefixes mapped to one of 3 zones for same-day pricing. National = flat rate. Outside UK → walk-in only.

```json
{
  "zone-a": { "prefixes": ["W1","WC1","EC1","NW1","N1","SE1","SW1"], "product_handle": "courier-same-day-zone-a", "price": 35 },
  "zone-b": { "prefixes": ["E","N","SE","SW","W","NW"],              "product_handle": "courier-same-day-zone-b", "price": 45 },
  "zone-c": { "prefixes": ["SW15","SW19","NW10","E18"],              "product_handle": "courier-same-day-zone-c", "price": 58 },
  "national": { "prefixes": ["*"],                                    "product_handle": "courier-next-day-uk",     "price": 24 }
}
```

5 Shopify products to maintain (3 same-day zones + 1 next-day + the existing walk-in £0). When the courier rate card changes, edit the JSON + the product price; nothing else.

---

## Customer-facing timeline UX

The wizard must show the customer **a real estimated return date**, not "1–2 working days." Date strings are visual; "back on Wednesday" is meaningfully different from "back in 1–2 working days."

The matrix is complex but tractable. Compute on the client from:
- **Today's date and time** (London timezone)
- **Selected turnaround tier** (Standard / Fast / Fastest)
- **Selected service type** (walk-in / same-day courier / next-day courier)
- **Workshop calendar** (closed Sat/Sun, closed bank holidays — already encoded for 2026-05-04)
- **Same-day-courier 12pm cutoff** (orders after 12pm are next working day)

### What the customer sees

Three timeline patterns. Show the relevant one inline on Step 2 once they've picked their service type and turnaround tier:

#### Walk-in (any tier)

```
   You drop off                      Tue 5 May, before 6pm
   We repair                          [tier-dependent]
✓ Ready to collect                   Wed 6 May, from 12pm
```

#### Same-day courier (London)

```
   We collect                          Tue 5 May, before 4pm
   We repair                           same day
✓ With you tonight                    Tue 5 May, by 8pm   (Fastest)
✓ With you tomorrow                   Wed 6 May, by 12pm  (Standard or Fast)
```

#### Next-day courier (UK)

This is the one the customer needs spelled out clearly because of the packaging-kit step:

```
   We post you a packaging kit        arrives Wed 6 May
   You ship your MacBook back         dispatch by Fri 8 May
   We repair                           ready Mon 11 May
✓ With you                            Tue 12 May
```

### Why this matters for conversion

Wizard end-to-end conversion is currently 1.6–1.7%. We don't have telemetry on *why* people abandon at the resolution step yet (the new events are <2 weeks old) but the strongest hypothesis from session-recording observations + the pre-step-1 drop-off pattern is that **users don't trust the price/timing** when it's expressed abstractly. A customer comparing iCorrect to Apple Store needs to know: how much, when, with what tradeoffs. "1–2 working days" doesn't answer "will I have my laptop on Friday for my flight."

The timeline view turns the wizard from "calculator that emits a price" into "scheduler that tells you when you'll have your machine back." That's the difference between a £319 quote and £319 + a confident decision.

### Implementation as small JS

```javascript
// scripts/wizard-timeline.js (sketch)
function estimateTimeline(opts) {
  // opts: { now: Date, deliveryMethod, turnaroundTier, productHasSpeedOption }
  const tz = 'Europe/London';
  const HOLIDAYS = ['2026-05-04', '2026-05-26', '2026-08-25', '2026-12-25', '2026-12-26'];
  const isWorkingDay = d => {
    const dow = d.getDay();
    if (dow === 0 || dow === 6) return false;
    const ymd = d.toISOString().slice(0, 10);
    return !HOLIDAYS.includes(ymd);
  };
  const nextWorkingDay = d => {
    const next = new Date(d);
    do { next.setDate(next.getDate() + 1); } while (!isWorkingDay(next));
    return next;
  };
  // ... build the steps array based on deliveryMethod + turnaroundTier
  // returns: [{ icon, label, date, dateLabel: 'Wed 6 May' }, ...]
}
```

Maybe 100 lines of JS. Same module powers all three timeline patterns. Renders into the wizard's Step 2 once the user has made their delivery + turnaround choices. Updates live as they change either choice.

---

## Updated decision log

| # | Decision | Status |
|---|---|---|
| 1 | Collection-page wizard = 2 steps (model → book) | ✅ Locked |
| 2 | Drop fault step on collection pages; keep on homepage flow | ✅ Locked |
| 3 | Contact route as both a step-2 tab and a persistent escape link | ✅ Locked |
| 4 | Postcode → 3-zone courier model (£35 / £45 / £58 London + £24 national) | ✅ Locked |
| 5 | Turnaround = Standard / Fast / Fastest (2 paid tiers), MacBook-screen-only initially | ✅ Locked |
| 6 | Customer-facing timeline view with real dates per booking matrix combo | ✅ Locked |
| 7 | localStorage state persistence (from prototype) | ✅ Locked |
| 8 | Floating mini-wizard (from prototype) | ⚠️ Implement but verify no mobile real-estate issue |
| 9 | Mobile model picker — family screen first, or single grid | ❌ Decide via post-launch A/B |
| 10 | Drop date/time pre-booking entirely, or keep for walk-in | ❌ Pending — leaning "drop, scheduling moves to confirmation email" |

---

*Captured by Claude Code — 2026-05-02. References live wizard at `sections/quote-wizard.liquid@cd3b1dd` and prototype handoff `J_KxLbKP6NVgueTU8HZlJQ` (Claude Design / claude.ai).*
