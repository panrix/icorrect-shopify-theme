# Quote Wizard v2: Build Plan

**Date:** 2026-03-18
**Status:** Draft for QA
**Audit reference:** `quote-wizard-audit.md`
**Original file:** `quote-wizard-original.html`
**Pricing sources:** `/home/ricky/kb/pricing/{macbook,iphone,ipad,watch,services}.md`
**Intake flows:** `/home/ricky/builds/intake-system/device-flows/*.md`

---

## 1. What We're Building

A revamped quote wizard that replaces the current one on icorrect.co.uk. Same visual design, but with:

1. **Issue-level repair routing**: each "which best describes the problem?" option routes to the correct repair type (not just the fault category)
2. **Three resolution types**: Direct Repair, Diagnostic, and Contact (currently only Direct Repair exists)
3. **Collection page pre-filling**: wizard auto-fills based on the page it's embedded on
4. **Accurate copy**: every issue's summary text is technically correct and customer-friendly

The wizard is a standalone HTML/CSS/JS component that will be embedded as a Shopify section.

---

## 2. Current Architecture (What Exists)

### 2.1 Flow
```
Step 1: Pick device (iPhone / MacBook / iPad / Watch)
Step 2: Pick model (grouped, collapsible, with visual guide helper)
Step 3: Pick fault category ("What's wrong?")
Step 4: Pick specific issue ("Which best describes the problem?")
       → Shows resolution card with price, badges, booking CTA
```

### 2.2 Data Structures (in JS)

| Variable | Purpose |
|----------|---------|
| `DEVS` | Device list (iPhone, MacBook, iPad, Watch) with SVG icons |
| `MD` | Model data grouped by series, per device |
| `FO` | Fault options per device (Screen, Battery, etc.) with icon keys |
| `FI` | SVG icons keyed by fault type |
| `TS` | Troubleshoot options: `TS[device][fault]` → array of `{l, d}` |
| `PRODUCTS` | Hardcoded sample data for demo; production fetches from Shopify |
| `VG_DB` | iPhone visual guide database for model identification helper |

### 2.3 Key Functions

| Function | What It Does |
|----------|-------------|
| `go(n)` | Navigate to step N, update progress bar |
| `pickDev(id, el)` | Select device, render models, advance to step 2 |
| `renderModels(dev)` | Build model list with collapsible groups |
| `pickModel(n, el)` | Select model, render faults, advance to step 3 |
| `renderFaults(dev)` | Build fault cards for selected device |
| `pickFault(v, el)` | Select fault, render troubleshoot options, advance to step 4 |
| `renderTS(dev, fault)` | Build "which best describes the problem?" cards |
| `pickIssue(iss, el)` | Select issue, show resolution |
| `showRes(iss)` | **Core resolution logic** — builds the result card |
| `getProductData(model, fault)` | Looks up `PRODUCTS[model][fault]` |
| `getProductUrl(model, fault)` | Builds Shopify product URL from handle or slug fallback |
| `updatePrice(el)` | Recalculates total when speed/service options change |
| `toggleCF()` | Opens/closes contact form accordion |

### 2.4 What's Broken

1. `showRes()` routes by `S.fault` only. All issues within a fault get the same product.
2. No diagnostic resolution template exists.
3. No contact-only resolution template exists.
4. ~40% of issues should route to diagnostic but currently show a repair product (or fallback).
5. Sample `PRODUCTS` data has a wrong price (M1 Air battery: £219 vs actual £179).
6. Copy in `TS` is written as internal tech notes, not customer-facing language.

---

## 3. What Changes

### 3.1 New TS Data Structure

Current:
```js
{l: "Sticky or stuck keys", d: "Debris or mechanism failure."}
```

New:
```js
{
  l: "Sticky, stuck, or crunchy keys",          // Display label
  route: "diagnostic",                            // "repair" | "diagnostic" | "contact"
  repairType: null,                               // Only needed when route="repair" AND repair differs from fault category
  title: "Book a Diagnostic",                     // Resolution card heading
  copy: "Keys that feel sticky or crunchy are almost always a sign of liquid exposure, even if you don't remember a spill. Liquid creeps under the keys and causes corrosion over time. We need to assess the extent of the damage before recommending a repair.",
  urgent: false                                   // If true, shows urgency styling (e.g. swollen battery, fresh liquid damage)
}
```

The `d` field (short description shown on the troubleshoot card itself) is removed. The troubleshoot cards in step 4 only show the label `l`. The detailed copy appears in the resolution card.

### 3.2 Three Resolution Templates

#### Template A: Direct Repair (`route: "repair"`)
- **Badge:** "We can fix this" (green, checkmark) — same as current
- **Title:** From product JSON or `iss.title`
- **Subtitle/copy:** From `iss.copy`
- **Price:** Fetched from Shopify product JSON (`/products/{handle}.json`)
- **Speed tiers:** From product JSON variants (if applicable)
- **Service options:** Walk-in (free) vs Collection (+£20)
- **Trust badges:** Warranty, turnaround, parts, service type
- **CTAs:** "Book this repair" (→ product page) + "I have a question" (→ contact accordion)

#### Template B: Diagnostic (`route: "diagnostic"`)
- **Badge:** "We need to take a look" (amber/yellow, magnifying glass icon)
- **Title:** "Book a Diagnostic"
- **Subtitle/copy:** From `iss.copy` (explains why diagnostic is needed)
- **Price:** £49 (MacBook/iPhone/iPad) or £19 (Watch) — static, not fetched
- **Note:** "The diagnostic fee is deducted from the repair cost if you go ahead with the fix."
- **No speed tiers** (diagnostic is standard turnaround)
- **Service options:** Walk-in (free) vs Collection (+£20) — same as repair
- **Trust badges:** Same set
- **CTAs:** "Book a Diagnostic" (→ diagnostic product page) + "I have a question" (→ contact accordion)

#### Template C: Contact (`route: "contact"`)
- **Badge:** "Let's chat about this" (blue, chat icon)
- **Title:** "Get in Touch"
- **Subtitle/copy:** From `iss.copy`
- **No price shown**
- **No speed/service options**
- **Trust badges:** Minimal (just warranty + service type)
- **CTA:** Contact form shown inline (not in an accordion, directly visible)
- **Summary:** Pre-filled with device, model, fault, issue

### 3.3 Updated `showRes()` Logic

```
function showRes(iss) {
  if (iss.route === "diagnostic") {
    showDiagnosticRes(iss);
  } else if (iss.route === "contact") {
    showContactRes(iss);
  } else {
    // route === "repair"
    var repairType = iss.repairType || S.fault;
    var handle = getHandle(S.device, S.model, repairType);
    fetchAndShowRepairRes(handle, iss);
  }
}
```

### 3.4 Product Handle Resolution

**Problem:** Constructing Shopify product handles from model + repair type via string manipulation is fragile. Handles are set manually in Shopify and don't follow a strict naming convention.

**Solution:** A handle lookup table + fallback slug generation.

```js
var HANDLES = {
  "MacBook Air 13-inch 'M1' A2337 (2020)": {
    "Screen / Display": "macbook-air-13-m1-2020-a2337-screen-repair",
    "Power / Battery / Charging": "macbook-air-13-m1-2020-a2337-battery-repair",
    "Trackpad / Keyboard": "macbook-air-13-m1-2020-a2337-keyboard-repair",
    "diagnostic": "macbook-diagnostic"
  },
  // ... per model
};

function getHandle(device, model, repairType) {
  // 1. Try explicit lookup
  if (HANDLES[model] && HANDLES[model][repairType]) {
    return HANDLES[model][repairType];
  }
  // 2. Try diagnostic handle by device
  if (repairType === "diagnostic") {
    return device + "-diagnostic";
  }
  // 3. Fallback: generate slug (may not match Shopify)
  return slugify(model + " " + repairType);
}
```

**Who maintains HANDLES?** This table needs to be built from Shopify's actual product list. Can be auto-generated by scraping the Shopify admin API or `/products.json`. Should be regenerated whenever products are added/renamed.

**Fallback when handle doesn't resolve:** If fetch returns 404 or empty, fall back to Template C (Contact). Never show a broken card.

### 3.5 Collection Page Pre-fill

When the wizard loads, check the URL context and pre-fill wizard state:

```js
var PREFILL_MAP = {
  // Collection pages: pre-fill device + fault
  "macbook-screen-repair": { device: "macbook", fault: "Screen / Display" },
  "macbook-battery-replacement": { device: "macbook", fault: "Power / Battery / Charging" },
  "macbook-keyboard-repair": { device: "macbook", fault: "Trackpad / Keyboard" },
  "iphone-screen-repair": { device: "iphone", fault: "Screen / Display" },
  "iphone-battery-replacement": { device: "iphone", fault: "Power / Battery / Charging" },
  "iphone-rear-glass-repair": { device: "iphone", fault: "Rear Glass" },
  "ipad-screen-repair": { device: "ipad", fault: "Screen / Display" },
  "apple-watch-screen-repair": { device: "watch", fault: "Screen / Display" },
  // ... etc
};

// Product pages: pre-fill device + model + fault
var PRODUCT_PREFILL = {
  "macbook-air-13-m1-2020-a2337-screen-repair": {
    device: "macbook",
    model: "MacBook Air 13-inch 'M1' A2337 (2020)",
    fault: "Screen / Display"
  },
  // ... etc
};
```

**On page load:**
```
1. Read page context (Shopify Liquid passes collection.handle or product.handle into JS)
2. Look up in PREFILL_MAP or PRODUCT_PREFILL
3. If match found:
   a. Set S.device, S.model, S.fault as appropriate
   b. Skip completed steps (go directly to the first unset step)
   c. Mark skipped steps as "done" in progress bar
4. If no match: start at step 1 (default)
```

**Shopify integration:**
```liquid
<script>
  window.WIZARD_CONTEXT = {
    pageType: "{{ template.name }}",
    handle: "{{ collection.handle | default: product.handle }}",
    productTitle: "{{ product.title | escape }}"
  };
</script>
```

### 3.6 Fetch Logic + Caching

```js
var _productCache = {};

async function fetchProduct(handle) {
  if (_productCache[handle]) return _productCache[handle];

  try {
    var res = await fetch('/products/' + handle + '.json');
    if (!res.ok) return null;
    var data = await res.json();
    _productCache[handle] = data.product;
    return data.product;
  } catch(e) {
    console.error('Product fetch failed:', handle, e);
    return null;
  }
}
```

**When fetch fails or returns null:** fall back to Contact template. Never show a broken/empty card.

**Skeleton loading:** Show the resolution card structure immediately (badge, title, copy, trust badges) and lazy-load the price. If price doesn't arrive within 2 seconds, show "View pricing →" link to product page instead.

### 3.7 Contact Form Submission

Current: `console.log()` only. No actual submission.

**RESOLVED:** Existing pipeline handles this. The current "Get Your Free Quote" section on the website already POSTs to an n8n webhook (`https://icorrect.app.n8n.cloud/workflow/tNQphRiUo0L8SdBn`), which parses the data and sends it to Intercom. The current form is in `contact-with-map.liquid`.

The wizard's contact/question form should POST to the same n8n endpoint, matching the existing payload shape and adding wizard context fields:

**Payload (extends existing form fields):**
```json
{
  "source": "quote-wizard",
  "device": "MacBook",
  "model": "MacBook Air 13-inch 'M1' A2337 (2020)",
  "fault": "Trackpad / Keyboard",
  "issue": "Sticky, stuck, or crunchy keys",
  "route": "diagnostic",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+447000000000",
  "message": "Optional free text",
  "timestamp": "2026-03-18T09:30:00Z"
}
```

The n8n workflow may need a minor update to handle the extra fields (device/model/fault/issue/route) and include them in the Intercom conversation context. But no new automation is needed.
```

---

## 4. Complete Issue Routing Data

Full mapping of every device > fault > issue with corrected routing and copy.

Reference: `quote-wizard-audit.md` Part 2 has the complete table. Below is the summary count:

### MacBook (8 fault categories, 29 issues total)
| Fault | Issues | → Repair | → Diagnostic | → Contact |
|-------|--------|----------|-------------|-----------|
| Screen / Display | 7 | 5 | 2 | 0 |
| Power / Battery / Charging | 6 | 3 | 3 | 0 |
| Trackpad / Keyboard | 5 | 1 | 4 | 0 |
| Audio / Mic / Speaker | 3 | 0 | 3 | 0 |
| Connectivity | 3 | 0 | 3 | 0 |
| Water Damage | 4 | 0 | 4 | 0 |
| Data Recovery | 3 | 0 | 2 | 1 |
| Other | 3 | 0 | 1 | 2 |

### iPhone (9 fault categories, 30 issues total)
| Fault | Issues | → Repair | → Diagnostic | → Contact |
|-------|--------|----------|-------------|-----------|
| Screen / Display | 5 | 4 | 1 | 0 |
| Rear Glass | 2 | 2 | 0 | 0 |
| Camera | 4 | 2 | 2 | 0 |
| Power / Battery / Charging | 4 | 2 | 2 | 0 |
| Audio / Mic / Speaker | 3 | 2 | 1 | 0 |
| Connectivity | 3 | 0 | 3 | 0 |
| Water Damage | 2 | 0 | 2 | 0 |
| Data Recovery | 2 | 0 | 1 | 1 |
| Other | 3 | 2 | 0 | 1 |

### iPad (7 fault categories, 15 issues total)
| Fault | Issues | → Repair | → Diagnostic | → Contact |
|-------|--------|----------|-------------|-----------|
| Screen / Display | 4 | 3 | 1 | 0 |
| Power / Battery / Charging | 3 | 1 | 2 | 0 |
| Audio / Mic / Speaker | 2 | 0 | 2 | 0 |
| Connectivity | 2 | 0 | 2 | 0 |
| Water Damage | 1 | 0 | 1 | 0 |
| Data Recovery | 1 | 0 | 1 | 0 |
| Other | 2 | 0 | 1 | 1 |

### Apple Watch (6 fault categories, 11 issues total)
| Fault | Issues | → Repair | → Diagnostic | → Contact |
|-------|--------|----------|-------------|-----------|
| Screen / Display | 2 | 1 | 1 | 0 |
| Rear Glass | 1 | 1 | 0 | 0 |
| Power / Battery / Charging | 3 | 1 | 2 | 0 |
| Connectivity | 2 | 0 | 2 | 0 |
| Water Damage | 1 | 0 | 1 | 0 |
| Other | 3 | 2 | 0 | 1 |

**Totals across all devices: 85 issues. 30 → Repair, 49 → Diagnostic, 6 → Contact.**

---

## 5. Shopify Prerequisites

### 5.1 Diagnostic Product Pages: ✅ ALREADY EXIST
Every model already has its own diagnostic product page (112 total). No new pages needed.
- MacBook: 34 diagnostic pages
- iPhone: 32 diagnostic pages
- iPad: 26 diagnostic pages
- Watch: 20 diagnostic pages

The wizard routes to model-specific diagnostic handles (e.g. `macbook-air-13-m1-2020-a2337-diagnostic`, `iphone-15-pro-max-diagnostic`), same pattern as repair handles. Diagnostic pricing is fetched from the product JSON, just like repairs.

### 5.2 Product Coverage: 947 repair products
Full Shopify product export saved at `shopify-products.csv` (967 lines incl. non-repair). Collections export at `shopify-collections.xlsx` (180+ collections).

Handle patterns are consistent and derivable from the model A-number. The HANDLES table from section 3.4 can be auto-generated from the CSV rather than manually maintained.

**Repair types with product pages:**
screen, battery, keyboard, trackpad, charging-port, diagnostic, dustgate, flexgate, touch-bar, rear-glass/housing, rear-camera, rear-camera-lens, front-camera, face-id, loudspeaker, earpiece, microphone, volume-button, power-button, mute-button, side-button, crown, heart-rate-monitor, home-button

### 5.3 Handle Derivation
The products CSV shows handles can be derived from model A-numbers. The build should include a handle generation function that:
1. Extracts the A-number(s) from the wizard model name
2. Constructs the handle slug following the observed patterns
3. Falls back to Contact if fetch returns 404

### 5.4 Wizard as Shopify Section
The wizard needs to be a Shopify section (`.liquid` file) so it can:
- Be placed on any page via the theme editor
- Receive page context via Liquid variables
- Optionally be toggled on/off per page

---

## 6. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Product handle mismatch (404) | Explicit HANDLES lookup table + Contact fallback on fetch failure |
| Missing Shopify product pages | 947 products already exist with full coverage. Contact fallback for any gaps. |
| Stale HANDLES table | Auto-generate from Shopify API; document the regeneration process |
| Slow product fetch | Cache in session; skeleton loading; 2s timeout → "View pricing" link |
| Collection URL mismatch | Explicit PREFILL_MAP; fail silently to step 1 if no match |
| Contact form goes nowhere | POST to existing n8n webhook (tNQphRiUo0L8SdBn) → Intercom. Add wizard context fields to payload. |
| Mobile keyboard overlapping form | Scroll active input into view with 300ms delay on focus |
| User hits back button (browser) | Use `history.pushState` per step so browser back = wizard back |
| Wrong diagnostic price for Watch | Device-specific diagnostic price map: `{macbook:49, iphone:49, ipad:49, watch:19}` |
| Wizard breaks on old browsers | No async/await in critical path; use `.then()` or provide polyfill |

---

## 7. Build Sequence

### Phase 1: Data + Templates (no visual changes)
1. Build the new TS data structure with all 85 issues, routes, and copy (from audit)
2. Build the HANDLES lookup table from Shopify product list
3. Build the PREFILL_MAP from existing collection/product URLs
4. Implement diagnostic resolution template (Template B)
5. Implement contact resolution template (Template C)
6. Update `showRes()` to route based on `iss.route`
7. Add product fetch caching

### Phase 2: Shopify Prerequisites
8. Create 4 diagnostic product pages on Shopify
9. Run handle audit: verify all repair routes have matching products
10. Create any missing product pages (or accept Contact fallback)

### Phase 3: Integration
11. Convert to Shopify section (`.liquid` wrapper)
12. Pass page context via Liquid → JS
13. Implement pre-fill logic from PREFILL_MAP / PRODUCT_PREFILL
14. Wire contact form to n8n webhook (or chosen endpoint)
15. Add `history.pushState` for browser back button support

### Phase 4: QA + Launch
16. Test every device × fault × issue path (85 paths)
17. Test collection page pre-fill on 5+ collection pages
18. Test product page pre-fill on 5+ product pages
19. Test fallback behaviour (missing products, failed fetches)
20. Mobile testing (iPhone Safari, Android Chrome)
21. Deploy as Shopify section
22. Remove old quote widget

---

## 8. Open Decisions (Need Ricky / Ferrari input)

1. **Contact form destination:** ✅ RESOLVED. Uses existing n8n webhook (`tNQphRiUo0L8SdBn`) → Intercom pipeline. Same as current "Get Your Free Quote" form. Minor n8n update needed to pass wizard context fields to Intercom.
2. **Diagnostic product pages:** ✅ RESOLVED. 112 per-model diagnostic pages already exist on Shopify. No new pages needed.
3. **Browser back button:** Use `history.pushState` for proper back navigation, or keep current behaviour (back button exits wizard)? **Recommended: pushState.**
4. **Touch Bar fault category:** Add for applicable MacBook Pro models (A2338, A1989, A2159, A2251, A2289, A2141), or leave under "Other"? **Recommended: add it.**
5. **"Has it been liquid damaged?" follow-up:** Some intake flows (Meesha's) ask about prior liquid damage before routing keyboard/trackpad/audio to a specific repair vs diagnostic. Should the wizard add this as a sub-question, or always route to diagnostic? **Recommended: always diagnostic (simpler for customers; the liquid question is better asked in-person).**
6. **Flexgate/Dustgate model filtering:** Should these issues only appear for applicable models (A1706/A1707/A1708), or show for all MacBooks with a note? **Recommended: show for all with a note; filtering adds complexity and customers may not know their model number precisely.**

---

## 9. Files

| File | Purpose |
|------|---------|
| `quote-wizard-original.html` | Current wizard (unchanged, for reference) |
| `quote-wizard-audit.md` | Full issue-by-issue audit with corrected routing + copy |
| `quote-wizard-build-plan.md` | This document |
| `quote-wizard-v2.html` | Final built wizard (to be created) |

---

## 10. Success Criteria

The wizard is done when:
- [ ] All 85 issue paths route to the correct resolution type
- [ ] Repair paths fetch live pricing from Shopify product JSON
- [ ] Diagnostic paths show flat fee with correct device-specific price
- [ ] Contact paths show inline form that actually submits somewhere
- [ ] Collection page pre-fill works for all active collection URLs
- [ ] Product page pre-fill works for all active product URLs
- [ ] Fetch failures gracefully fall back to Contact
- [ ] Mobile experience is smooth (no broken layouts, keyboard doesn't overlap)
- [ ] Browser back button navigates within the wizard
- [ ] All copy matches the audit document (technically accurate, customer-friendly)
