## Canonical quote stack (consolidated 5 Jul 2026)

One wizard everywhere: `qw/QuoteWizardV3.jsx` (flow) + `qw/QuoteTiersV6.jsx` (quote) + `qw/QuoteModalV7.jsx` (modal shell), data from `qw/data.js`, styles `qw/wizard-v3.css` + `qw/quote-v6.css` (+ `qw/diagnose.css` for dg-cta buttons on estimate/diagnostic cards). All older wizards/quote surfaces (Wizard.jsx, UniversalWizard, QuoteTiers V1–V5, ServiceMapper, courier/method/postcode variants, ProductConfigureModal) live in `archive/` and must not ship. Entry depths: homepage hero (full flow) · collection page (device+fault pre-filled) · product page (model+price pre-filled, postcode→quote only).

## Booking handoff (decided 5 Jul 2026)

- "Book" on a fixed-price quote hands off to **Shopify checkout** — payment and customer details are Shopify's job, not the wizard's. We do not design a details/payment form.
- The **£49 diagnostic is paid online at booking** (also via Shopify). It is a separate one-off charge — never credited to the repair.
- **Walk-in slots are firm reservations** — we expect the customer at that time. Busy slots show as "Full" (core requirement).
- The confirmation screen's job: show the **repair timeline / ready-by promise**.

# Quote Wizard — Working Notes & Decisions

_Last updated: 22 Jun 2026_

## Current decision: two-lane / two-phase split

We are **not** building the complex tiered quote into the live flow yet. Agreed roadmap:

### Phase 1 (ship first) — the simple wizard
- Flow: **Device → Repair → Model → Issue → Postcode (its own step) → Quote**
- Quote screen shows: **one fixed price**, an **estimated ready-by date**, delivery options **filtered by postcode zone**, and a **"Faster" option shown ONLY when the product allows it**.
- The existing **`Quote Step - Postcode First.html`** is essentially Phase 1 already — postcode is its own step, ready-by dates + zone-filtered delivery exist. The only rewire needed: drive the "Faster" option off a **per-product flag**, not date-math.

### Phase 2 (parked, designed, do later) — tiered cards
- The **`Quote Tiers - Method Toggle.html`** version (3 cards: Standard / Priority / Same-day + Walk-in/Courier method bar) is the **target design** for Phase 2.
- Nothing gets thrown away — it waits until the pricing + feasibility data model exists.
- Other explored directions (parked): `Quote Tiers.html`, `Quote Tiers - Courier Premium.html`, `Quote - Courier Primary.html`.

## Shopify wiring notes (for when we build)
- Each repair = a Shopify product/variant.
- **`express_available` (boolean metafield) per product** → controls whether the "Faster" option appears. This is the "faster only when you need it / only some products have it" logic.
- **Tier modifiers can be GLOBAL flat rules, not per-device data:** Priority +£20, Same-day +£79, Courier +£25 (London) / +£29 (UK). This collapses most of the complexity.
- The only unavoidable per-`device × repair` data is the **repair price** itself.
- Optional per-product override: `standard_lead_days` if global default isn't enough.
- **Ready-by date** = today + lead days (working days) + postcode transit + method, shown as an estimate.

## ⏸ PARKED TASKS (do AFTER the full spec run-through)
1. Rewire `Quote Step - Postcode First.html` so the "Faster" option is driven by a per-product `express_available` toggle (add to Tweaks: a repair *with* vs *without* faster).
2. Write `ROADMAP.md` — Phase 1 vs Phase 2, Shopify metafields each needs, the global-modifier shortcut. Brief for the developer.

## ▶ NEXT (what the user wants to do now)
**A proper run-through of the Quote Wizard as a full spec from the very start** — perfect the whole wizard end-to-end first, THEN come back and wire in the Phase 1 changes above.

## ★ KEY INSIGHT: one engine, three entry depths
The wizard is **not three different things** — it's the **same engine pre-filled to different depths** depending on where the customer enters. This is the spine of the full spec.

| Entry point | Already known | Wizard asks | Ends at |
|---|---|---|---|
| **Homepage** | nothing | Device → Repair → Model → Issue → Postcode | **Quote** (no details taken) |
| **Collection page** (e.g. "MacBook Screen Repair") | device + repair category | Issue → Model → Postcode | **Quote** |
| **Product page** (e.g. 'MacBook Pro 16" M3 Screen') | device + repair + model | options only (turnaround / battery / delivery) | **Book now** (transactional) |

- Product-page version exists in the OTHER project (`019de950…`) as **`Configurator.jsx`** — a "Configure your repair" card + live total + floating pill + Book now. Base price hardcoded £699.
- **Reconciliation decisions needed before building** (vocab differs across the three today):
  1. Turnaround naming/price — product page uses "Fast +£79 / 1 day"; tiered version uses Standard/Priority/Same-day. Pick ONE vocabulary.
  2. Delivery naming — "Walk in / Collect & deliver / Mail-in" (product) vs "Walk-in / Courier" (tiered). Pick ONE.
  3. **Battery condition** question only appears on product page — decide if it belongs in the shared spec (it's a screen-repair upsell).
  4. Does product page go straight to **checkout/Book**, while homepage + collection end at **Quote**? (User: collection ends at quote, "we don't take details at this point.") Confirm this is the rule.
  5. Express/"Faster" shown only when product flag allows (ties to `express_available`).

## OPEN SPEC POINT: collection timing vs bench speed (raised 22 Jun)
Two separate levers — do NOT conflate:
- **Bench speed** (Standard / Fast / etc.) = how long WE take once on the bench. This is the *tier* (un-editable choice).
- **Collection timing** = when the device leaves the customer's hands. This is a property of the *courier option*, revealed only when "Collect & return" is chosen (like the original wizard revealing postcode/address).
- **Ready-by = collection date + transit-to-us + bench time + transit-back.** Both current builds silently assume earliest (next-working-day) collection.
- Consistent model across all surfaces: tiers = bench speed; courier = adds a "when collected" date that moves ready-by; walk-in/mail-in = date estimated from "today".
- **DECISION NEEDED:** (A) headline ready-by assumes earliest collection, show best-case, pick exact day at checkout [lean for product page] vs (B) force collection-day pick inside configurator before showing a date [more honest if courier slots are limited]. Depends on how the courier actually runs.

- **DECISION (22 Jun): always quote the FASTEST (option A).** Headline ready-by assumes earliest collection / best-case, then the customer can adjust (collection day, slower speed) downward from there. Never quote a slow date by default.

## CORE REQUIREMENT: booking-time selection (from original Wizard.jsx — the thing the 3-card explorations dropped)
The original Quote Wizard (`icorrect/Wizard.jsx`, rendered by `Quote Wizard Full.html`) has full scheduling on its final **Service** step. This MUST carry into every quote/configurator surface — it is not optional:
- **Walk in** → pick a **day + time slot**; busy slots show **"Full"** and are disabled (`WALK_IN_TIMES`).
- **London courier** → pick a **collection day + a 3-hour window**: 9:00–12:00 / 12:00–15:00 / 15:00–18:00 (`COURIER_WINDOWS`).
- **Mail-in** → post-by date → arrives ~2 working days.
- The chosen **collection/drop-off day = `serviceStartDate`**, and Standard (2-day) / Fast (1-day) return dates compute FROM it. **Bank-holiday blackouts** are skipped (`UK_BANK_HOLIDAYS`).
- Ties to the "always quote fastest" rule: pre-select the earliest day + earliest slot; customer can push later, which moves the ready-by.
- The 3-product-card explorations (`Quote Tiers*.html`) are visually nice but LACK this scheduling — must be reconciled before they could ship.

## Other standing project notes
- **Brand accent is BLUE (`#0072f5`), not green.** All quote screens recolored. Keep green only for true success if ever, but default to blue.
- iCorrect is **not affiliated with Apple Inc.** — comparison only, never marks.
- Design system lives in this project (tokens, fonts, UI kit, preview cards). The separate linked DS project reads empty to Claude.
