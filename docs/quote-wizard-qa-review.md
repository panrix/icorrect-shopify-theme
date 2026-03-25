# Quote Wizard v2: QA Review

**Date:** 2026-03-18
**Reviewer:** Jarvis (Technical QA)
**Files reviewed:** quote-wizard-build-plan.md, quote-wizard-audit.md, icorrect-quote-wizard-final.html, Products.csv (967 products), collections.xlsx (180+ collections)

---

## Task 1: Completeness Check

**Verdict: PARTIAL**

The build plan covers the major components well (data structure migration, three resolution templates, handle resolution, pre-fill, fetch/caching, contact form). However, there are gaps:

### Issues Found

| # | Finding | Severity | Detail |
|---|---------|----------|--------|
| 1.1 | **No spec for the `repairType` override mapping** | HIGH | The plan mentions `repairType` (e.g. Flexgate, Dustgate, Camera Lens vs Rear Camera) but never provides the full list of which issues need it. The audit tables mention it in prose but don't give the developer a definitive `repairType` → handle suffix mapping. |
| 1.2 | **MacBook Pro 13" M1 vs M2 share A2338 — no disambiguation logic** | HIGH | Both models use A2338. The plan says "derive handles from A-numbers" but doesn't address this collision. Shopify has separate handles: `macbook-pro-13-m1-2020-a2338-*` vs `macbook-pro-13-m2-2022-a2338-*`. The handle builder needs the chip gen (M1/M2), not just the A-number. |
| 1.3 | **No "Other" device handling** | MEDIUM | The `DEVS` array in the original has no "Other" device, and neither the plan nor audit addresses what happens if a fifth "Other" card is added (or if it should be). The plan's `DN` map includes `other:'Other'` but there's no `MD.other`, `FO.other`, or `TS.other`. |
| 1.4 | **No specification for skeleton loading UI** | MEDIUM | Plan mentions "skeleton loading" and "2s timeout → View pricing link" but provides no HTML/CSS spec. Developer needs to know what the skeleton looks like. |
| 1.5 | **No form validation spec** | MEDIUM | The contact form currently uses `alert()` for validation. Plan doesn't specify inline validation, error states, or email/phone format validation. |
| 1.6 | **Touch Bar fault category still undecided** | LOW | Open Decision #4 recommends adding it but no TS entries or routing are defined. If it's being added, it needs full spec. |
| 1.7 | **No analytics/tracking spec** | LOW | No mention of tracking which paths users take, conversion rates, or drop-off points. Consider adding `dataLayer` events for GTM. |
| 1.8 | **iPhone screen handle inconsistency: `display-screen-repair` vs `screen-repair` vs `original-screen-repair`** | HIGH | Plan doesn't address this. iPhone 11 uses `original-lcd-screen-no-screen-message-repair` and `original-screen-repair`; iPhone 12+ uses `display-screen-repair`; iPhone SE uses `original-screen-repair`. The generic handle builder cannot derive this. See Task 3 for full analysis. |
| 1.9 | **No `urgent` flag implementation spec** | MEDIUM | The new TS structure includes `urgent: true/false` but neither the plan nor audit specifies what urgent styling looks like (colours, icons, animation, position). Only mentioned as "urgency styling (e.g. swollen battery, fresh liquid damage)." |

---

## Task 2: Data Integrity

**Verdict: PARTIAL**

### 2A: Audit vs TS Object Cross-Reference

Compared all 85 issues in `quote-wizard-audit.md` against the current `TS` object in the HTML file.

**Issues present in current TS but REMOVED/CHANGED in audit:**

| Device | Fault | Current TS Issue | Audit Disposition |
|--------|-------|-----------------|-------------------|
| MacBook | Screen | "Lines or artifacts" | Renamed → "Lines, discolouration, or artefacts" |
| MacBook | Screen | "Dead pixels" | Merged → "Dead pixels or bright spots" |
| MacBook | Screen | "Black screen" (single) | Split into 2: "Black screen (external works)" and "Black screen (external doesn't work)" |
| MacBook | Screen | "Dust under glass" | Renamed → "Dust or debris behind the screen" |
| MacBook | Power | "Won't charge past a certain %" | Renamed → "Service Recommended warning" |
| MacBook | Power | "Charger not recognised" | Merged → "Won't charge or charger not recognised" |
| MacBook | Trackpad | 4 issues (no keycap) | Added: "Missing or broken keycap" |
| MacBook | Water | "Spilled liquid" (single) | Split into: within 24hrs, more than 24hrs |
| MacBook | Water | "Won't turn on after spill" | Replaced → "MacBook was submerged" |
| MacBook | Data | "Drive failing" | Replaced → "MacBook dead, need data" |
| iPhone | Screen | "Green line" (separate) | Merged into "Lines, discolouration, or green line" |
| iPhone | Screen | "Black screen (still vibrates)" | Split: vibrates/rings → repair; no response → diagnostic |
| iPhone | Camera | 3 issues | Added: "Condensation in camera" |
| iPhone | Audio | "No sound" (generic) | Split: Loudspeaker vs Earpiece |
| iPhone | Other | "SIM issues" | Removed, replaced with "Buttons not working" |
| Watch | Other | "Digital Crown stuck" only | Added: "Side button not responding" |

**Issues in audit NOT in current TS (net new):**

| Device | Fault | New Issue |
|--------|-------|-----------|
| MacBook | Screen | "Dead pixels or bright spots" (was just "Dead pixels") |
| MacBook | Power | "Service Recommended" warning |
| MacBook | Trackpad | "Missing or broken keycap" |
| MacBook | Water | "MacBook was submerged" |
| MacBook | Water | "Partial failure after liquid exposure" (existed as "Partial failure after spill") |
| MacBook | Data | "MacBook dead, need data" |
| iPhone | Camera | "Condensation in camera" |
| iPhone | Other | "Buttons not working (power/volume/mute)" |
| Watch | Other | "Side button not responding" |

**Count verification:** Audit claims 85 issues total. My count from the audit tables:
- MacBook: 7+6+5+3+3+4+3+3 = **34** (plan says 29 — **DISCREPANCY**)
- iPhone: 5+2+4+4+3+3+2+2+3 = **28** (plan says 30 — **DISCREPANCY**)
- iPad: 4+3+2+2+1+1+2 = **15** (matches)
- Watch: 2+1+3+2+1+3 = **12** (plan says 11 — **DISCREPANCY**)
- **Total: 89** (plan says 85 — **DISCREPANCY**)

| # | Finding | Severity |
|---|---------|----------|
| 2.1 | **Issue count mismatch: audit tables contain 89 issues, plan says 85** | HIGH |
| 2.2 | The summary table in the build plan (Section 4) doesn't match the actual audit. MacBook shows 29 but audit has 34; iPhone shows 30 but audit has 28; Watch shows 11 but audit has 12. | HIGH |

### 2B: Product Handle Coverage for Repair Routes

For every issue routed to "repair", I checked whether a matching product handle pattern exists in Products.csv.

**Repair routes that WILL 404 or need special handling:**

| # | Issue | Expected Handle Pattern | Actual Handle | Status | Severity |
|---|-------|------------------------|---------------|--------|----------|
| 2.3 | iPhone > Other > "Vibration not working" → Taptic Engine Repair | `iphone-{model}-taptic-engine-repair` | **NO PRODUCT EXISTS** | CRITICAL |
| 2.4 | iPhone > Other > "Buttons not working" → Button Repair | Ambiguous: power-button, volume-button, mute-button are separate products | Which handle? Need sub-question or pick one | HIGH |
| 2.5 | Watch > Other > "Crown stuck" → Crown Repair | `apple-watch-{model}-crown-repair` | Only exists for Series 4-6 + SE (1st gen). **Missing for Series 7-10, Ultra, SE 2nd gen** | HIGH |
| 2.6 | MacBook > Screen > Flexgate | `macbook-pro-{model}-flexgate-repair` | Only 3 products: A1706, A1708, A1707. Audit says A1990 also but **no A1990 flexgate product** | MEDIUM |
| 2.7 | iPhone > Screen > all → "display-screen-repair" | Varies by model | iPhone 11 uses `original-screen-repair` not `display-screen-repair`; SE uses `original-screen-repair` | HIGH |
| 2.8 | iPhone > Rear Glass > "Cracked back glass" | `iphone-{model}-rear-glass-repair` | iPhone 11/12 use `housing-rear-glass-repair`; iPhone 14+ have both `housing-repair` and `rear-glass-repair` | HIGH |
| 2.9 | Watch > Screen > "Cracked screen" | Need to pick `screen-glass-repair` or `display-screen-repair` | Both exist per model — they're different repairs (glass-only vs full OLED) | MEDIUM |

---

## Task 3: Handle Derivation Logic

**Verdict: FAIL**

The plan proposes deriving Shopify handles from model A-numbers. After testing against all 967 products in the CSV, the handles are **NOT consistently derivable** from a simple algorithm. A lookup table (HANDLES) is essential, not optional.

### Inconsistencies Found

| # | Pattern Issue | Examples | Severity |
|---|--------------|----------|----------|
| 3.1 | **Year/A-number ordering varies** | Air 13 M1: `m1-2020-a2337` (year first). Air 15 M2: `m2-a2941-2023` (A-number first). Air 13 M3: `m3-2024-a3113` (year first). | CRITICAL |
| 3.2 | **Multi-A-number models have DUPLICATE products** | MacBook Pro 14 M4 has THREE handle patterns: `m4-2024-a3112-a3185-a3401-*` (combined), `m4-max-a3185-2024-*`, `m4-pro-a3401-2024-*`. Which does the wizard use? | CRITICAL |
| 3.3 | **Pro/Max chip suffix inconsistency** | Some models include "pro-max" in handle, others use just "m4". No predictable pattern for when chip variant appears. | HIGH |
| 3.4 | **iPhone handles have NO A-numbers** | iPhones use model name slugs: `iphone-15-pro-max-*`. iPads use gen number + year: `ipad-pro-11-2024-m4-*`. Watches use series + size: `apple-watch-series-9-45mm-*`. Completely different patterns per device. | CRITICAL |
| 3.5 | **iPhone screen handle naming varies by model** | iPhone 11: `original-lcd-screen-no-screen-message-repair` / `original-screen-repair`. iPhone 12+: `display-screen-repair`. SE: `original-screen-repair`. | HIGH |
| 3.6 | **iPhone rear glass naming varies** | iPhone 11-12: `housing-rear-glass-repair`. iPhone 14+: both `housing-repair` AND `rear-glass-repair` exist (separate products). iPhone 16e: `rear-glass-repair` + `housing-repair`. | HIGH |
| 3.7 | **MacBook Pro 13" A2338 collision** | Both M1 (2020) and M2 (2022) use A2338. Handles differ by chip: `m1-2020-a2338` vs `m2-2022-a2338`. A-number alone is insufficient. | HIGH |
| 3.8 | **Some handles have typos/inconsistencies in CSV** | `macbook-pro-14-m4-pro-a3401-2024trackpad-repair` (missing hyphen before "trackpad"). `macbook-pro-14-m4-max-a3185-2024-battery` (missing "-repair" suffix). | MEDIUM |
| 3.9 | **iPad handle patterns are highly inconsistent** | Standard iPads: `ipad-{gen}-{year}-*` (e.g. `ipad-9-2021`). iPad Air: `ipad-air-{size}-{year}-{chip}-*` or `ipad-air-{gen}-{year}-*`. iPad Pro: `ipad-pro-{size}-{year}-{chip}-*`. | HIGH |

### Recommendation

**Do NOT attempt algorithmic handle derivation.** Build the HANDLES lookup table by parsing Products.csv programmatically. The plan already suggests this as option but frames it as "auto-generated + fallback slug". The fallback slug will fail for ~60% of models due to the inconsistencies above. The HANDLES table must be the primary (and effectively only) resolution mechanism, with Contact as the fallback for any miss.

---

## Task 4: Collection Pre-fill Mapping

**Verdict: PARTIAL**

### Collection handles from Shopify vs PREFILL_MAP

The actual Shopify collection handles end in `-prices` (e.g. `macbook-screen-repair-prices`), but the build plan's PREFILL_MAP uses handles WITHOUT `-prices` (e.g. `macbook-screen-repair`).

| # | Finding | Severity |
|---|---------|----------|
| 4.1 | **Collection handle suffix mismatch** | CRITICAL |
| | Plan uses: `macbook-screen-repair`. Actual Shopify: `macbook-screen-repair-prices`. The Liquid template passes `{{ collection.handle }}` which will be `macbook-screen-repair-prices`. PREFILL_MAP won't match. | |
| 4.2 | **Missing collection mappings** | HIGH |
| | Collections that exist but aren't in the plan's PREFILL_MAP example: |
| | - `macbook-charging-port-repair-prices` → no wizard fault maps to "Charging Port" directly |
| | - `macbook-trackpad-repair-prices` → maps to "Trackpad / Keyboard" but wizard combines these |
| | - `macbook-keyboard-repair-prices` → same combined fault |
| | - `macbook-touch-bar-repair-prices` → no fault category for Touch Bar |
| | - `macbook-dustgate-repair-prices` → no fault category |
| | - `macbook-flexgate-repair-prices` → no fault category |
| | - `iphone-rear-housing-repair-prices` → maps to "Rear Glass" but naming is different |
| | - `iphone-rear-camera-repair-prices` → maps to "Camera" |
| | - `iphone-rear-camera-lens-repair-prices` → maps to "Camera" |
| | - `iphone-front-camera-repair-prices` → maps to "Camera" |
| | - `iphone-face-id-repair-prices` → maps to "Camera" (front camera/Face ID) |
| | - `iphone-charging-port-repair-prices` → no direct fault |
| | - `iphone-earpiece-speaker-repair-prices` → maps to "Audio / Mic / Speaker" |
| | - `iphone-loudspeaker-repair-prices` → maps to "Audio / Mic / Speaker" |
| | - `iphone-microphone-repair-prices` → maps to "Audio / Mic / Speaker" |
| | - `apple-watch-screen-glass-only-repair-prices` → maps to "Screen / Display" |
| | - `apple-watch-oled-display-repair-prices` → maps to "Screen / Display" |
| | - `apple-watch-rear-housing-repair-prices` → maps to "Rear Glass" |
| | - `apple-watch-crown-repair-prices` → maps to "Other" |
| | - `apple-watch-side-button-repair-prices` → maps to "Other" |
| | - `apple-watch-heart-rate-monitor-repair-prices` → maps to "Rear Glass" |
| | - `iphone-genuine-screen-repair-prices` → maps to "Screen / Display" |
| 4.3 | **Per-model collection pages also exist** | MEDIUM |
| | 60+ model-specific collections (e.g. `macbook-air-13-m1-a2337-2020-repair-prices`, `iphone-15-pro-max-repair-prices`) could pre-fill device + model. Not addressed in plan. |
| 4.4 | **Plan shows `macbook-battery-replacement` but collection is `macbook-battery-repair-prices`** | MEDIUM |
| | Even the repair type naming differs: plan says "replacement", Shopify says "repair". |

### Recommendation

The PREFILL_MAP must be built from the actual collection handles in Shopify (ending in `-prices`). Use the collections.xlsx as the source of truth. Also map per-model collection pages to device + model pre-fill.

---

## Task 5: Copy Review

**Verdict: PASS (with minor issues)**

The copy across all 85 issues in the audit is well-written overall: technically sound, customer-appropriate, and consistent in tone. However:

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 5.1 | **"OIS" not explained** | LOW | iPhone > Camera > "Blurry photos or shaking camera": "optical image stabilisation (OIS)" — good that it's spelled out, but could be simpler: "the camera's stabilisation system has failed" |
| 5.2 | **"APFS" jargon** | LOW | MacBook > Data Recovery > "Accidentally deleted files": "On Apple Silicon Macs with APFS, recovery is extremely limited." Non-technical customers won't know APFS. Suggest: "On newer Macs, recovery is extremely limited once files are deleted." |
| 5.3 | **"TrueDepth sensor" jargon** | LOW | iPhone > Camera > "Front camera or Face ID": "the TrueDepth sensor" — customers may not know this term. Suggest: "the Face ID sensor array" |
| 5.4 | **Inconsistent urgency language** | LOW | MacBook battery swollen: "Stop using the MacBook and don't charge it." iPhone battery swollen: "Stop using the phone and don't charge it." MacBook water (24hr): "Stop using the MacBook, don't try to charge it." Slight wording variation; recommend standardising the safety warning format. |
| 5.5 | **"Board-level repair" in iPhone Data Recovery** | LOW | "we can attempt a board-level repair to get the phone working long enough to back up" — technically accurate but may alarm customers who envision soldering. Suggest: "we can attempt a specialised repair to get the phone working long enough to back up" |
| 5.6 | **Missing "diagnostic fee deducted" note in audit copy** | MEDIUM | The build plan (Template B) says to show "The diagnostic fee is deducted from the repair cost if you go ahead with the fix." But the audit's per-issue copy doesn't mention this. Confirm the developer adds this as a static note on all diagnostic cards, not relying on per-issue copy. |
| 5.7 | **iPad copy is notably shorter than MacBook/iPhone** | LOW | iPad issues have 1-2 sentence descriptions vs 2-3 for MacBook/iPhone. Consistent tone, but less informative. Consider expanding iPad "Won't turn on" and "Black screen" copy to match the detail level of their Mac/iPhone equivalents. |

---

## Task 6: Edge Cases

**Verdict: PARTIAL**

### 6.1: Model exists in wizard but no products on Shopify

| # | Finding | Severity |
|---|---------|----------|
| 6.1a | **Plan handles this correctly**: fetch failure → Contact fallback. But the UX of falling back to Contact after a user already selected a specific model and issue is jarring. No loading state or explanation is specified. | MEDIUM |
| 6.1b | **Missing models in Shopify**: MacBook Air 13-inch 'M4' A3240 (2025) and MacBook Air 15-inch 'M4' A3241 (2025) DO have products. All wizard models appear to have Shopify products. No gaps found for current models. | — (OK) |

### 6.2: Direct navigation with no page context

| # | Finding | Severity |
|---|---------|----------|
| 6.2 | Plan handles this: "If no match: start at step 1 (default)". This is correct. | — (PASS) |

### 6.3: Shopify product JSON slow or erroring

| # | Finding | Severity |
|---|---------|----------|
| 6.3a | Plan specifies caching, skeleton loading, 2s timeout → "View pricing" link. | — (PASS) |
| 6.3b | **No retry logic specified** | LOW | A single transient failure results in permanent fallback for that session. Consider 1 retry with backoff. |
| 6.3c | **Cache invalidation not addressed** | LOW | `_productCache` persists for the session. If user leaves wizard open for hours and prices change, they see stale data. Acceptable for now but worth noting. |

### 6.4: Multiple A-numbers per model

| # | Finding | Severity |
|---|---------|----------|
| 6.4 | **CRITICAL**: The plan doesn't specify which handle to use for multi-A-number models. MacBook Pro 14" M4 has A3112/A3185/A3401, and Shopify has THREE different handle sets. The wizard model name is `"MacBook Pro 14-inch 'M4 Pro/Max' A3112/A3185/A3401 (2024)"` — a generic slug builder would produce something like `macbook-pro-14-inch-m4-pro-max-a3112-a3185-a3401-2024-screen-repair` which doesn't match any real handle. Only the HANDLES lookup table can solve this. | CRITICAL |

### 6.5: "Other" device category

| # | Finding | Severity |
|---|---------|----------|
| 6.5 | The current wizard doesn't include an "Other" device card. Plan doesn't mention adding one. `DN` map has `other:'Other'` but `DEVS` array only has 4 devices. If a customer has an Apple TV, AirPods, or Mac Pro, there's no path. Consider adding "Other" → Contact as a catch-all. | LOW |

### 6.6: Browser back button

| # | Finding | Severity |
|---|---------|----------|
| 6.6 | Plan recommends `history.pushState` per step. This is correct. But no spec for popstate handler is provided — developer needs to know how to restore wizard state when back is pressed. | MEDIUM |

---

## Task 7: Architectural Concerns

**Verdict: PARTIAL**

| # | Finding | Severity | Detail |
|---|---------|----------|--------|
| 7.1 | **HANDLES table size could be massive** | HIGH | With 967 products across ~100 models × ~10 repair types, the HANDLES object could be 5000+ entries. Inline in the HTML/Liquid file, this adds significant page weight. Consider: (a) lazy-loading the HANDLES JSON, (b) generating it server-side via Liquid, or (c) using a simpler lookup with model→handle-prefix mapping instead of full model×repair combinations. |
| 7.2 | **TS object also grows significantly** | MEDIUM | 89 issues × 5-6 fields each (including multi-sentence copy strings) will make the TS object much larger than the current version. Combined with HANDLES, the inline JS could exceed 50KB. Consider externalising as a JSON file. |
| 7.3 | **No versioning or cache-busting strategy** | MEDIUM | When TS data, HANDLES, or PREFILL_MAP change, the Liquid section needs redeployment. No mechanism for A/B testing or gradual rollout. |
| 7.4 | **Contact form XSS risk** | MEDIUM | The current form uses `document.getElementById('cn').value` directly in a `console.log`. If this is later used in DOM insertion (like the summary card), it could allow XSS. The plan's payload goes to n8n webhook which is safer, but the summary pre-fill (`c-sum` div) concatenates model/fault/issue from state without escaping. Since these come from the wizard's own data (not user input), risk is low but worth sanitising. |
| 7.5 | **Diagnostic price is hardcoded in plan but fetched in section 5.1** | HIGH | Section 3.2 (Template B) says diagnostic price is "static, not fetched" — £49/£19. But Section 5.1 says "112 per-model diagnostic pages already exist" and Section 5.3 says "Diagnostic pricing is fetched from the product JSON, just like repairs." These contradict each other. Which is it? If fetched, you need per-model diagnostic handles in HANDLES. If static, the diagnostic products are only used for the booking CTA link, not pricing. **This must be resolved before build.** |
| 7.6 | **No Shopify section schema defined** | MEDIUM | The plan says "convert to Shopify section" but doesn't specify the section schema (settings, blocks, presets). Developer needs to know what's configurable via the theme editor. |
| 7.7 | **Single-page app inside Shopify theme** | LOW | The wizard is a large self-contained SPA. If Shopify's theme JS (e.g. theme.js, cart.js) interferes with the wizard's global functions (`go`, `pickDev`, `vgSelect`, etc.), there could be naming collisions. Consider wrapping in an IIFE or module pattern. |
| 7.8 | **Accessibility gaps** | MEDIUM | The current wizard has basic a11y (role="button", tabindex, keyboard enter). But the resolution templates have no ARIA live regions for dynamic content. Screen readers won't announce when a resolution card appears. The diagnostic/contact badge colour changes need accessible alternatives (not colour-alone). |

---

## Summary: Blocking Issues

These must be resolved before the developer starts building:

### CRITICAL (build will produce broken features)

| # | Issue | Recommended Fix |
|---|-------|----------------|
| C1 | **Handle derivation is not algorithmic** (Task 3) | Abandon slug generation. Build HANDLES table by parsing Products.csv. Make it the sole resolution mechanism. Generate it with a script, not by hand. |
| C2 | **Issue count mismatch: plan says 85, audit has 89** (Task 2) | Recount and reconcile. Update Section 4 summary tables. The developer will use these counts for validation. |
| C3 | **Multi-A-number models have duplicate/conflicting Shopify products** (Task 3.2) | Decide: does the wizard use the combined handle (`m4-2024-a3112-a3185-a3401-*`) or the individual handles? Document the rule. |
| C4 | **Collection handle suffix mismatch** (Task 4.1) | PREFILL_MAP must use actual Shopify handles ending in `-prices`. |
| C5 | **Diagnostic pricing: static or fetched?** (Task 7.5) | Resolve the contradiction between Section 3.2 and Section 5.1. If static, document the exact prices. If fetched, add per-model diagnostic handles to HANDLES. |

### HIGH (will cause visible bugs or data issues)

| # | Issue | Recommended Fix |
|---|-------|----------------|
| H1 | iPhone screen handle varies by model generation (Task 2.7) | Must be in HANDLES table per-model, not derived. |
| H2 | iPhone rear glass handle varies (`housing-rear-glass-repair` vs `rear-glass-repair` vs `housing-repair`) (Task 2.8) | Same: per-model in HANDLES. |
| H3 | No Taptic Engine product exists for iPhone vibration repair (Task 2.3) | Either create the product on Shopify, or route to Diagnostic/Contact instead of Repair. |
| H4 | iPhone "Buttons not working" is ambiguous (Task 2.4) | Either add sub-options (power/volume/mute) or route to Contact. Can't link to a single product. |
| H5 | Watch Crown repair only exists for Series 4-6 + SE 1st gen (Task 2.5) | Crown repair for Series 7-10, Ultra, SE 2nd gen will 404. Either create products or route newer models to Contact. |
| H6 | `repairType` override mapping is incomplete (Task 1.1) | Provide definitive table: issue → `repairType` → handle suffix. |
| H7 | HANDLES table size may bloat page (Task 7.1) | Generate from CSV via build script; consider lazy-loading or Liquid-side generation. |
| H8 | Shopify handle typos in CSV (Task 3.8) | Fix `macbook-pro-14-m4-pro-a3401-2024trackpad-repair` (missing hyphen) and `macbook-pro-14-m4-max-a3185-2024-battery` (missing `-repair`). |
| H9 | Missing collection mappings in PREFILL_MAP (Task 4.2) | 20+ repair-type collection pages exist. Map all of them. |
| H10 | Flexgate audit mentions A1990 but no Flexgate product exists for that model (Task 2.6) | Either create the product or remove A1990 from Flexgate copy. |

### MEDIUM (should fix before launch)

| # | Issue |
|---|-------|
| M1 | No skeleton loading UI spec (Task 1.4) |
| M2 | No form validation spec (Task 1.5) |
| M3 | No `urgent` flag visual spec (Task 1.9) |
| M4 | No popstate handler spec for back button (Task 6.6) |
| M5 | No Shopify section schema spec (Task 7.6) |
| M6 | Accessibility gaps — ARIA live regions, colour-independent status indicators (Task 7.8) |
| M7 | Watch screen repair ambiguity: glass-only vs full OLED are different products (Task 2.9) |
| M8 | iPad copy is thinner than other devices (Task 5.7) |
| M9 | Diagnostic fee deduction note not in per-issue copy (Task 5.6) |
| M10 | Per-model collection pages (60+) not addressed for pre-fill (Task 4.3) |

---

## Final Recommendation

**Do not send to developer yet.** Resolve the 5 CRITICAL issues first, then the HIGH issues. The biggest risk is the handle resolution system — the plan underestimates how inconsistent Shopify handles are. The HANDLES table must be auto-generated from Products.csv as a build step, and the plan needs to provide the generation script (or at minimum, the mapping rules per device type).

Once CRITICALs are resolved and HIGHs have a documented plan, this is ready for build.
