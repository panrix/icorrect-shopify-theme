# Quote Wizard v2: Fix Plan for Every QA Issue

**Date:** 2026-03-18
**Author:** Jarvis (Technical QA)
**Reference:** quote-wizard-qa-review.md

This document provides a concrete, actionable fix for every issue raised in the QA review. Each fix is based on verified data from Products.csv (967 products) and collections.xlsx (183 collections).

---

## CRITICAL FIXES (Must resolve before build)

---

### C1: Handle Derivation Is Not Algorithmic — Use Generated Lookup Table

**Problem:** Shopify handles follow 4 different patterns per device type with inconsistencies even within device types. A slug builder will fail ~60% of the time.

**Fix:** Generate the `HANDLES` table from Products.csv as a build-time artifact. The table maps `wizardModelName → { repairType → shopifyHandle }`.

**Implementation:**

1. Create a build script (`scripts/generate-handles.js`) that:
   - Reads Products.csv
   - For each product, extracts model prefix + repair type from the handle
   - Maps it to the wizard model name using the model→prefix mapping below
   - Outputs the HANDLES object as a JSON or JS file

2. **Model → Handle Prefix Mapping** (the Rosetta Stone — every wizard model to its Shopify handle prefix):

**MacBook** (pattern: varies, must be explicit):
```
"MacBook Air 13-inch A1932 (2018-2019)"        → "macbook-air-13-2018-a1932"
"MacBook Air 13-inch A2179 (2020)"              → "macbook-air-13-2020-a2179"
"MacBook Air 13-inch 'M1' A2337 (2020)"         → "macbook-air-13-m1-2020-a2337"
"MacBook Air 13-inch 'M2' A2681 (2022)"         → "macbook-air-13-m2-2022-a2681"
"MacBook Air 13-inch 'M3' A3113 (2024)"         → "macbook-air-13-m3-2024-a3113"
"MacBook Air 13-inch 'M4' A3240 (2025)"         → "macbook-air-13-m4-2025-a3240"
"MacBook Air 15-inch 'M2' A2941 (2023)"         → "macbook-air-15-m2-a2941-2023"       ← NOTE: A-number before year!
"MacBook Air 15-inch 'M3' A3114 (2024)"         → "macbook-air-15-m3-a3114-2024"       ← NOTE: A-number before year!
"MacBook Air 15-inch 'M4' A3241 (2025)"         → "macbook-air-15-m4-2025-a3241"
"MacBook Pro 16-inch 'M4 Pro/Max' A3186/A3403 (2024)" → "macbook-pro-16-m4-2024-a3186-a3403"
"MacBook Pro 16-inch 'M3 Pro/Max' A2991 (2023)" → "macbook-pro-16-m3-2023-a2991"
"MacBook Pro 16-inch 'M2 Pro/Max' A2780 (2023)" → "macbook-pro-16-m2-2023-a2780"       ← battery only; others use "macbook-pro-16-m2-pro-max-a2780-2023"
"MacBook Pro 16-inch 'M1 Pro/Max' A2485 (2021)" → "macbook-pro-16-m1-2021-a2485"
"MacBook Pro 16-inch A2141 (2019)"              → "macbook-pro-16-2019-a2141"
"MacBook Pro 15-inch A1990 (2018-2019)"         → "macbook-pro-15-2018-a1990"
"MacBook Pro 15-inch A1707 (2016-2017)"         → "macbook-pro-15-2016-a1707"
"MacBook Pro 14-inch 'M4 Pro/Max' A3112/A3185/A3401 (2024)" → "macbook-pro-14-m4-2024-a3112-a3185-a3401"
"MacBook Pro 14-inch 'M3 Pro/Max' A2918/A2992 (2023)" → "macbook-pro-14-m3-2023-a2918-a2992"
"MacBook Pro 14-inch 'M2 Pro/Max' A2779 (2023)" → "macbook-pro-14-m2-2023-a2779"
"MacBook Pro 14-inch 'M1 Pro/Max' A2442 (2021)" → "macbook-pro-14-m1-2021-a2442"
"MacBook Pro 13-inch 'M2' A2338 (2022)"         → "macbook-pro-13-m2-2022-a2338"
"MacBook Pro 13-inch 'M1' A2338 (2020)"         → "macbook-pro-13-m1-2020-a2338"
"MacBook Pro 13-inch A2251 (2020)"              → "macbook-pro-13-2020-a2251"
"MacBook Pro 13-inch A2289 (2020)"              → "macbook-pro-13-2020-a2289"
"MacBook Pro 13-inch A2159 (2019)"              → "macbook-pro-13-2019-a2159"
"MacBook Pro 13-inch A1989 (2018-2019)"         → "macbook-pro-13-2018-a1989"
```

**MacBook repair-type suffixes** (append to prefix):
```
Screen / Display     → "-screen-repair"
Battery              → "-battery-repair"
Keyboard             → "-keyboard-repair"
Trackpad             → "-trackpad-repair"
Charging Port        → "-charging-port-repair"
Diagnostic           → "-diagnostic"
Flexgate             → "-flexgate-repair"    (only A1706, A1707, A1708)
Dustgate             → "-dustgate-repair"    (only A1706, A1708, A1989, A2159, A2251, A2289, A2338-M1, A1707, A1990, A2141)
Touch Bar            → "-touch-bar-repair"   (only A2338-M1, A2338-M2, A1989, A2159, A2251, A2289, A2141)
```

**iPhone** (pattern: `iphone-{model-slug}-{repair-type}`):
```
"iPhone 16 Pro Max" → "iphone-16-pro-max"
"iPhone 16 Pro"     → "iphone-16-pro"
"iPhone 16 Plus"    → "iphone-16-plus"
"iPhone 16"         → "iphone-16"
"iPhone 16e"        → "iphone-16e"
"iPhone 15 Pro Max" → "iphone-15-pro-max"
"iPhone 15 Pro"     → "iphone-15-pro"
"iPhone 15 Plus"    → "iphone-15-plus"
"iPhone 15"         → "iphone-15"
"iPhone 14 Pro Max" → "iphone-14-pro-max"
"iPhone 14 Pro"     → "iphone-14-pro"
"iPhone 14 Plus"    → "iphone-14-plus"
"iPhone 14"         → "iphone-14"
"iPhone 13 Pro Max" → "iphone-13-pro-max"
"iPhone 13 Pro"     → "iphone-13-pro"
"iPhone 13"         → "iphone-13"
"iPhone 13 Mini"    → "iphone-13-mini"
"iPhone SE 3rd Gen (2022)" → "iphone-se-3rd-gen-2022"
"iPhone 12 Pro Max" → "iphone-12-pro-max"
"iPhone 12 Pro"     → "iphone-12-pro"
"iPhone 12"         → "iphone-12"
"iPhone 12 Mini"    → "iphone-12-mini"
"iPhone SE 2nd Gen (2020)" → "iphone-se-2nd-gen-2020"
"iPhone 11 Pro Max" → "iphone-11-pro-max"
"iPhone 11 Pro"     → "iphone-11-pro"
"iPhone 11"         → "iphone-11"
```

**iPhone repair-type suffixes** (CRITICAL — these vary by model generation):

| Repair Type | iPhone 11 (non-Pro) + SE + 8/XR | iPhone 11 Pro/Max + 12-16 | iPhone 16 Pro Max ONLY |
|---|---|---|---|
| Screen | `-original-screen-repair` | `-display-screen-repair` | `-screen-repair` |
| Battery | `-battery-repair` | `-battery-repair` | `-battery-repair` |
| Rear Glass | `-housing-rear-glass-repair` | varies: 11/12=`-housing-rear-glass-repair`, 14+=both `-rear-glass-repair` and `-housing-repair` | `-rear-glass-repair` |
| Rear Camera | `-rear-camera-repair` | `-rear-camera-repair` | `-rear-camera` (no -repair!) |
| Rear Camera Lens | `-rear-camera-lens-repair` | `-rear-camera-lens-repair` | `-rear-camera-lens` (no -repair!) |
| Front Camera | `-front-camera-repair` | `-front-camera-repair` | `-front-camera` (no -repair!) |
| Loudspeaker | `-loudspeaker-repair` | `-loudspeaker-repair` | `-loudspeaker` (no -repair!) |
| Earpiece | `-earpiece-speaker-repair` | `-earpiece-speaker-repair` | `-earpiece-speaker-repair` |
| Microphone | `-microphone-repair` | `-microphone-repair` | `-microphone` (no -repair!) |
| Charging Port | `-charging-port-repair` | `-charging-port-repair` | `-charging-port` (no -repair!) |
| Diagnostic | `-diagnostic` | `-diagnostic` | `-diagnostic` |
| Power Button | `-power-button-repair` | `-power-button-repair` | `-power-button` (no -repair!) |
| Volume Button | `-volume-button-repair` | `-volume-button-repair` | `-volume-button` (no -repair!) |
| Mute Button | `-mute-button-repair` | `-mute-button-repair` | N/A (no mute on 16 PM) |
| Face ID | `-face-id-repair` | `-face-id-repair` | N/A |
| Home Button | `-home-button-repair` | N/A | N/A |

**KEY FINDING:** iPhone 16 Pro Max has inconsistent handle suffixes (missing `-repair`). This means the lookup MUST be per-model, not derivable from rules. Use the HANDLES table.

**iPad** (pattern: varies significantly):
```
"iPad Pro 13 M4 (2024)"           → "ipad-pro-13-2024-m4"
"iPad Pro 12.9 6th Gen M2 (2022)" → "ipad-pro-12-9-2022-m2"
"iPad Pro 12.9 5th Gen M1 (2021)" → "ipad-pro-12-9-2021-m1"
"iPad Pro 12.9 4th Gen (2020)"    → "ipad-pro-12-9-2020-m1"         ← labelled M1 in handle even though it's pre-M1
"iPad Pro 12.9 3rd Gen (2018)"    → "ipad-pro-12-9-3rd-gen-2018"
"iPad Pro 11 M4 (2024)"           → "ipad-pro-11-2024-m4"
"iPad Pro 11 4th Gen M2 (2022)"   → "ipad-pro-11-2022-m2"
"iPad Pro 11 3rd Gen M1 (2021)"   → "ipad-pro-11-2021-m1"
"iPad Pro 11 2nd Gen (2020)"      → "ipad-pro-11-2020-m1"           ← same M1 label issue
"iPad Pro 11 1st Gen (2018)"      → "ipad-pro-11-2019"              ← labelled 2019 not 2018!
"iPad Air 13 7th Gen 'M3' (2025)" → "ipad-air-13-7th-gen-m3-2025"
"iPad Air 11 7th Gen 'M3' (2025)" → "ipad-air-11-7th-gen-m3-2025"
"iPad Air 13 M2 (2024)"           → "ipad-air-13-2024-m2"
"iPad Air 11 M2 (2024)"           → "ipad-air-11-2024-m2"
"iPad Air 5th Gen (2022)"         → "ipad-air-5-2022-m1"
"iPad Air 4th Gen (2020)"         → "ipad-air-4-2020"
"iPad 11th Gen (2025)"            → "ipad-11-2025"
"iPad 10th Gen (2022)"            → "ipad-10-2022"
"iPad 9th Gen (2021)"             → "ipad-9-2021"
"iPad 8th Gen (2020)"             → "ipad-8-2020"
"iPad 7th Gen (2019)"             → "ipad-7-2019"
"iPad Mini 7 (2024)"              → "ipad-mini-7-2024"
"iPad Mini 6 (2021)"              → "ipad-mini-6-2021"
"iPad Mini 5 (2019)"              → "ipad-mini-5-2019"
```

**iPad repair-type suffixes:**
```
Screen (non-M3/11th) → "-screen-repair"
Screen (M3 Air/11th) → "-lcd-display-repair"     ← different!
Screen (Pro 12.9 M2) → "-xdr-screen-repair"      ← different!
Battery              → "-battery-repair"
Charging Port        → "-charging-port-repair"
Diagnostic           → "-diagnostic"
Home Button          → "-home-button-repair"      (only 7th/8th/9th gen + Mini 5)
```

Note: standard iPads also have dual screen handles (`ipad-{gen}-{year}-screen-repair` AND `ipad-{gen}th-gen-{year}-glass-screen-repair`). Use the simpler one.

**Apple Watch** (pattern: `apple-watch-{series}-{size}-{repair-type}`):
```
"Apple Watch Ultra 2"         → "apple-watch-ultra-2"
"Apple Watch Ultra"           → "apple-watch-ultra"
"Apple Watch Series 10 46MM"  → "apple-watch-series-10-45mm"      ← NOTE: Shopify uses 45mm not 46mm!
"Apple Watch Series 10 42MM"  → "apple-watch-series-10-41mm"      ← NOTE: Shopify uses 41mm not 42mm!
"Apple Watch Series 9 45MM"   → "apple-watch-series-9-45mm"
"Apple Watch Series 9 41MM"   → "apple-watch-series-9-41mm"
"Apple Watch Series 8 45MM"   → "apple-watch-series-8-45mm"
"Apple Watch Series 8 41MM"   → "apple-watch-series-8-41mm"
"Apple Watch Series 7 45MM"   → "apple-watch-series-7-45mm"
"Apple Watch Series 7 41MM"   → "apple-watch-series-7-41mm"
"Apple Watch Series 6 44MM"   → "apple-watch-series-6-44mm"
"Apple Watch Series 6 40MM"   → "apple-watch-series-6-40mm"
"Apple Watch Series 5 44MM"   → "apple-watch-series-5-44mm"
"Apple Watch Series 5 40MM"   → "apple-watch-series-5-40mm"
"Apple Watch SE 2nd Gen 44MM" → "apple-watch-se-2-44mm"
"Apple Watch SE 2nd Gen 40MM" → "apple-watch-se-2-40mm"
"Apple Watch SE 1st Gen 44MM" → "apple-watch-se-44mm"
"Apple Watch SE 1st Gen 40MM" → "apple-watch-se-40mm"
```

**Watch repair-type suffixes:**
```
Screen (glass-only)  → "-screen-glass-repair"
Screen (full OLED)   → "-display-screen-repair"
Battery              → "-battery-repair"
Rear Glass/HRM       → "-heart-rate-monitor-rear-glass-repair"
Side Button          → "-side-button-repair"
Crown                → "-crown-repair"          (ONLY Series 4-6 + SE 1st gen)
Diagnostic           → "-diagnostic"
```

**IMPORTANT Watch caveat:** Series 10 uses 42mm/46mm in the wizard model name but Shopify handles use 41mm/45mm. The mapping must convert these sizes.

3. **Fallback rule:** If a HANDLES lookup returns `undefined`, show Contact template. Never attempt slug generation.

---

### C2: Issue Count Mismatch — Reconciliation

**Problem:** Plan Section 4 says 85 issues. Actual count from audit tables is 89.

**Fix:** Recount from audit tables and update Section 4.

**Correct counts:**

| Device | Fault | Actual Count | Plan Said |
|--------|-------|-------------|-----------|
| MacBook | Screen / Display | 7 | 7 ✓ |
| MacBook | Power / Battery / Charging | 6 | 6 ✓ |
| MacBook | Trackpad / Keyboard | **5** | was missing "Missing or broken keycap" |
| MacBook | Audio / Mic / Speaker | 3 | 3 ✓ |
| MacBook | Connectivity | 3 | 3 ✓ |
| MacBook | Water Damage | **4** | plan said 4 ✓ but total didn't add up |
| MacBook | Data Recovery | 3 | 3 ✓ |
| MacBook | Other | 3 | 3 ✓ |
| **MacBook Total** | | **34** | **Plan said 29** |
| iPhone | Screen / Display | 5 | 5 ✓ |
| iPhone | Rear Glass | 2 | 2 ✓ |
| iPhone | Camera | **4** | plan said 4 ✓ |
| iPhone | Power / Battery / Charging | 4 | 4 ✓ |
| iPhone | Audio / Mic / Speaker | 3 | 3 ✓ |
| iPhone | Connectivity | 3 | 3 ✓ |
| iPhone | Water Damage | 2 | 2 ✓ |
| iPhone | Data Recovery | 2 | 2 ✓ |
| iPhone | Other | **3** | plan said 3 ✓ |
| **iPhone Total** | | **28** | **Plan said 30** |
| iPad | All | **15** | **15 ✓** |
| Watch | Screen / Display | 2 | 2 ✓ |
| Watch | Rear Glass | 1 | 1 ✓ |
| Watch | Power / Battery / Charging | 3 | 3 ✓ |
| Watch | Connectivity | 2 | 2 ✓ |
| Watch | Water Damage | 1 | 1 ✓ |
| Watch | Other | **3** | **Plan said 2** (missing "Side button") |
| **Watch Total** | | **12** | **Plan said 11** |

**Grand Total: 89** (plan said 85)

**Fix action:** Update the summary table in build-plan Section 4 to use 89. The discrepancy came from the plan being written before the audit was finalised. The audit is the source of truth.

---

### C3: Multi-A-Number Models — Use the Combined Handle

**Problem:** MacBook Pro 14" M4 and 16" M4 have THREE handle variants each (combined all-A-numbers, individual Pro, individual Max). Which does the wizard use?

**Fix:** Use the **combined handle** (the one with all A-numbers). These are the most complete product sets:

| Wizard Model | Use Handle Prefix |
|-------------|-------------------|
| MacBook Pro 14-inch 'M4 Pro/Max' A3112/A3185/A3401 (2024) | `macbook-pro-14-m4-2024-a3112-a3185-a3401` |
| MacBook Pro 16-inch 'M4 Pro/Max' A3186/A3403 (2024) | `macbook-pro-16-m4-2024-a3186-a3403` |
| MacBook Pro 14-inch 'M3 Pro/Max' A2918/A2992 (2023) | `macbook-pro-14-m3-2023-a2918-a2992` |

**Rationale:** The individual Pro/Max handles appear to be duplicates (same repairs at same prices). The combined handles have all 6 repair types with consistent naming. The individual ones have typos (e.g. `macbook-pro-14-m4-pro-a3401-2024trackpad-repair` missing hyphen; `macbook-pro-14-m4-max-a3185-2024-battery` missing `-repair`).

**Additional note for MacBook Pro 16 M2:** This model has a split: battery uses `macbook-pro-16-m2-2023-a2780-battery-repair`, but all other repairs use `macbook-pro-16-m2-pro-max-a2780-2023-*`. The HANDLES table must have per-repair-type entries for this model:

```js
"MacBook Pro 16-inch 'M2 Pro/Max' A2780 (2023)": {
  "Screen / Display": "macbook-pro-16-m2-pro-max-a2780-2023-screen-repair",
  "Power / Battery / Charging": "macbook-pro-16-m2-2023-a2780-battery-repair",  // different prefix!
  "Trackpad / Keyboard": "macbook-pro-16-m2-pro-max-a2780-2023-keyboard-repair",
  "diagnostic": "macbook-pro-16-m2-pro-max-a2780-2023-diagnostic"
}
```

---

### C4: Collection Handle Suffix Mismatch — Add `-prices` Suffix

**Problem:** PREFILL_MAP uses `macbook-screen-repair` but actual Shopify collection handles are `macbook-screen-repair-prices`.

**Fix:** The complete PREFILL_MAP using actual Shopify collection handles:

```js
var PREFILL_MAP = {
  // === REPAIR-TYPE COLLECTION PAGES (device + fault pre-fill) ===

  // MacBook
  "macbook-screen-repair-prices":          { device: "macbook", fault: "Screen / Display" },
  "macbook-battery-repair-prices":         { device: "macbook", fault: "Power / Battery / Charging" },
  "macbook-keyboard-repair-prices":        { device: "macbook", fault: "Trackpad / Keyboard" },
  "macbook-trackpad-repair-prices":        { device: "macbook", fault: "Trackpad / Keyboard" },
  "macbook-charging-port-repair-prices":   { device: "macbook", fault: "Power / Battery / Charging" },
  "macbook-touch-bar-repair-prices":       { device: "macbook", fault: "Other" },  // no Touch Bar fault yet
  "macbook-dustgate-repair-prices":        { device: "macbook", fault: "Screen / Display" },
  "macbook-flexgate-repair-prices":        { device: "macbook", fault: "Screen / Display" },
  "macbook-diagnostic-prices":             { device: "macbook", fault: null },  // device only

  // iPhone
  "iphone-screen-repair-prices":           { device: "iphone", fault: "Screen / Display" },
  "iphone-genuine-screen-repair-prices":   { device: "iphone", fault: "Screen / Display" },
  "iphone-battery-repair-prices":          { device: "iphone", fault: "Power / Battery / Charging" },
  "iphone-rear-housing-repair-prices":     { device: "iphone", fault: "Rear Glass" },
  "iphone-rear-glass-repair-prices":       { device: "iphone", fault: "Rear Glass" },
  "iphone-rear-camera-repair-prices":      { device: "iphone", fault: "Camera" },
  "iphone-rear-camera-lens-repair-prices": { device: "iphone", fault: "Camera" },
  "iphone-front-camera-repair-prices":     { device: "iphone", fault: "Camera" },
  "iphone-face-id-repair-prices":          { device: "iphone", fault: "Camera" },
  "iphone-charging-port-repair-prices":    { device: "iphone", fault: "Power / Battery / Charging" },
  "iphone-earpiece-speaker-repair-prices": { device: "iphone", fault: "Audio / Mic / Speaker" },
  "iphone-loudspeaker-repair-prices":      { device: "iphone", fault: "Audio / Mic / Speaker" },
  "iphone-microphone-repair-prices":       { device: "iphone", fault: "Audio / Mic / Speaker" },
  "iphone-volume-button-repair-prices":    { device: "iphone", fault: "Other" },
  "iphone-power-button-repair-prices":     { device: "iphone", fault: "Other" },
  "iphone-home-button-repair-prices":      { device: "iphone", fault: "Other" },
  "iphone-diagnostic-prices":              { device: "iphone", fault: null },

  // iPad
  "ipad-screen-repair-prices":             { device: "ipad", fault: "Screen / Display" },
  "ipad-lcd-display-repair-prices":        { device: "ipad", fault: "Screen / Display" },
  "ipad-battery-repair-prices":            { device: "ipad", fault: "Power / Battery / Charging" },
  "ipad-charging-port-repair-prices":      { device: "ipad", fault: "Power / Battery / Charging" },
  "ipad-diagnostic-prices":                { device: "ipad", fault: null },

  // Apple Watch
  "apple-watch-screen-glass-only-repair-prices": { device: "watch", fault: "Screen / Display" },
  "apple-watch-oled-display-repair-prices":      { device: "watch", fault: "Screen / Display" },
  "apple-watch-rear-housing-repair-prices":      { device: "watch", fault: "Rear Glass" },
  "apple-watch-heart-rate-monitor-repair-prices": { device: "watch", fault: "Rear Glass" },
  "apple-watch-crown-repair-prices":             { device: "watch", fault: "Other" },
  "apple-watch-side-button-repair-prices":       { device: "watch", fault: "Other" },
  "apple-watch-battery-repair-prices":           { device: "watch", fault: "Power / Battery / Charging" },
  "apple-watch-diagnostic-prices":               { device: "watch", fault: null },

  // === DEVICE LANDING PAGES (device-only pre-fill) ===
  "macbook-repair-prices":        { device: "macbook", fault: null },
  "iphone-repair-prices":         { device: "iphone", fault: null },
  "ipad-repair-prices":           { device: "ipad", fault: null },
  "apple-watch-repair-prices":    { device: "watch", fault: null },
  "all-devices-repair-prices":    { device: null, fault: null },  // no pre-fill

  // === DEVICE SUB-CATEGORY PAGES (device-only pre-fill) ===
  "macbook-pro-14-repair-prices": { device: "macbook", fault: null },
  "macbook-pro-16-repair-prices": { device: "macbook", fault: null },
  "macbook-pro-15-repair-prices": { device: "macbook", fault: null },
  "macbook-pro-13-repair-prices": { device: "macbook", fault: null },
  "macbook-air-15-repair-prices": { device: "macbook", fault: null },
  "macbook-air-13-repair-prices": { device: "macbook", fault: null },
  "ipad-pro-repair-prices":       { device: "ipad", fault: null },
  "ipad-air-repair-prices":       { device: "ipad", fault: null },
  "ipad-mini-repair-prices":      { device: "ipad", fault: null },
  "standard-ipad-repair-prices":  { device: "ipad", fault: null },

  // === SERIES PAGES (device-only pre-fill) ===
  "iphone-16-series-repair-prices": { device: "iphone", fault: null },
  "iphone-15-series-repair-prices": { device: "iphone", fault: null },
  "iphone-14-series-repair-prices": { device: "iphone", fault: null },
  "iphone-13-series-repair-prices": { device: "iphone", fault: null },
  "iphone-12-series-repair-prices": { device: "iphone", fault: null },
  "iphone-11-series-repair-prices": { device: "iphone", fault: null },
  "iphone-se-series-repair-prices": { device: "iphone", fault: null },
  "apple-watch-ultra-repair-prices":       { device: "watch", fault: null },
  "apple-watch-series-10-repair-prices":   { device: "watch", fault: null },
  "apple-watch-series-9-repair-prices":    { device: "watch", fault: null },  // extrapolated
  "apple-watch-se-series-repair-prices":   { device: "watch", fault: null },
  "apple-watch-se2-series-repair-prices":  { device: "watch", fault: null },
};
```

**Per-model collection pages** (60+): These should pre-fill device + model. Build these into `PRODUCT_PREFILL` as described in the plan, mapping collection handle → wizard model name. Example:
```js
"macbook-air-13-m1-a2337-2020-repair-prices": {
  device: "macbook",
  model: "MacBook Air 13-inch 'M1' A2337 (2020)",
  fault: null
}
```

Generate this programmatically from the collections.xlsx + model mapping table in C1.

---

### C5: Diagnostic Pricing — Resolve the Contradiction

**Problem:** Section 3.2 says static prices. Section 5.1 says 112 per-model diagnostic pages exist and prices are "fetched from product JSON."

**Fix: Use fetched pricing via per-model diagnostic handles.**

**Rationale:** The per-model diagnostic products already exist (112 total). They contain the correct model-specific pricing in their variants. Fetching from these products means:
- Prices stay accurate without code changes when Shopify prices are updated
- The "Book a Diagnostic" CTA can link to the model-specific product page
- It's consistent with the repair flow (both fetch from product JSON)

**Implementation:**
1. Add diagnostic handles to the HANDLES table for every model (already mapped above — every model prefix + `-diagnostic`)
2. Fetch the diagnostic product JSON the same way as repairs
3. Use a **static fallback** only if the fetch fails: `{macbook: 49, iphone: 49, ipad: 49, watch: 19}`
4. Update Section 3.2 to say: "Price: Fetched from per-model diagnostic product JSON. Fallback: £49 (Mac/iPhone/iPad) or £19 (Watch)."

**Delete from Section 3.2:** "static, not fetched" and the device-specific price map in the risk mitigations table.

---

## HIGH FIXES

---

### H1: iPhone Screen Handle Varies by Model Generation

**Problem:** iPhone 11 (non-Pro) uses `original-screen-repair`, SE uses `original-screen-repair`, iPhone 12+ uses `display-screen-repair`, iPhone 16 Pro Max uses `screen-repair`.

**Fix:** This is already solved by C1 — the HANDLES table is per-model and per-repair-type. No algorithmic derivation means no inconsistency. The generation script reads each model's actual handle from Products.csv.

Specific mappings:
```
iPhone 11          → "iphone-11-original-screen-repair"
iPhone 11 Pro      → "iphone-11-pro-display-screen-repair"
iPhone 11 Pro Max  → "iphone-11-pro-max-display-screen-repair"
iPhone 12+         → "iphone-{model}-display-screen-repair"
iPhone 16 Pro      → "iphone-16-pro-display-screen-repair"
iPhone 16 Pro Max  → "iphone-16-pro-max-screen-repair"        ← unique!
iPhone SE 2nd Gen  → "iphone-se-2nd-gen-2020-original-screen-repair"
iPhone SE 3rd Gen  → "iphone-se-3rd-gen-2022-original-screen-repair"
```

---

### H2: iPhone Rear Glass Handle Varies

**Fix:** Same approach — per-model in HANDLES. Specific mappings:

For the wizard's "Cracked back glass" → Rear Glass Replacement, use:
```
iPhone 11/12/12 Mini → "{prefix}-housing-rear-glass-repair"
iPhone 13+           → "{prefix}-rear-glass-repair"
iPhone 16e           → "iphone-16e-rear-glass-repair"
```

For the wizard's "Camera lens cover cracked" → Camera Lens Repair, use:
```
All models → "{prefix}-rear-camera-lens-repair"   (or "-rear-camera-lens" for 16 Pro Max)
```

---

### H3: No Taptic Engine Product — Route to Contact

**Problem:** No `taptic-engine-repair` product exists on Shopify for any iPhone model.

**Fix:** Change the routing for "Vibration not working" from `repair` to `contact`.

Updated audit entry:
```
| Vibration not working | → CONTACT | Contact | The vibration motor (Taptic Engine) may have failed.
  Get in touch and we'll confirm whether this is something we can repair for your model. |
```

This is a safer route anyway — Taptic Engine repairs aren't offered on all models, and parts availability varies.

---

### H4: iPhone Buttons — Split into Sub-Options or Contact

**Problem:** "Buttons not working (power/volume/mute)" maps to 3 different products.

**Fix: Split into specific button options.** Replace the single "Buttons not working" entry with three:

```
| Power button not working  | → REPAIR | Power Button  | The power button or its flex cable has failed.
  We'll replace the flex to restore full function. |
| Volume buttons not working | → REPAIR | Volume Button | The volume button flex cable needs replacing.
  Quick repair to restore control. |
| Mute switch not working   | → REPAIR | Mute Button   | The mute switch mechanism has failed.
  We'll replace the flex cable to fix it. |
```

Each routes to the correct product handle: `{prefix}-power-button-repair`, `{prefix}-volume-button-repair`, `{prefix}-mute-button-repair`.

**Note:** iPhone 15+ doesn't have a mute switch (it's an Action Button). iPhone 16 Pro Max uses handles without `-repair` suffix. The HANDLES table handles this per-model.

**Impact on issue count:** This adds 2 net new issues to iPhone > Other (from 3 to 5). New total: **91 issues** (not 89).

---

### H5: Watch Crown Repair — Conditional Availability

**Problem:** Crown repair products only exist for Series 4-6 and SE 1st gen (8 models). Series 7-10, Ultra, and SE 2nd gen have no crown product.

**Fix: Route to diagnostic for models without a crown product.**

Implementation:
```js
// In the TS data for Watch > Other > "Digital Crown stuck":
{
  l: "Digital Crown stuck or not rotating",
  route: "repair",  // default
  repairType: "crown",
  title: "Crown Repair",
  copy: "The Digital Crown can get jammed by dirt or debris. We'll clean or replace the crown mechanism.",
  // The showRes() function checks HANDLES[model]["crown"].
  // If undefined → fall back to diagnostic template with copy:
  // "We'll inspect the crown and advise on the best fix."
}
```

In `showRes()`, when `route === "repair"` and the HANDLES lookup returns `undefined`:
1. First try the diagnostic handle for the same model
2. Show diagnostic template with modified copy: "We need to inspect the crown mechanism to determine the right repair."

This gracefully handles the gap without breaking the UX.

---

### H6: Complete repairType Override Mapping

**Problem:** Plan mentions `repairType` but doesn't list which issues need it.

**Fix:** Here's the definitive list of issues where `repairType` differs from the fault category:

| Device | Fault Category | Issue | repairType | Handle Suffix |
|--------|---------------|-------|------------|---------------|
| MacBook | Screen / Display | Backlight fading (Flexgate) | `flexgate` | `-flexgate-repair` |
| MacBook | Screen / Display | Dust or debris behind screen | `dustgate` | `-dustgate-repair` |
| MacBook | Trackpad / Keyboard | Missing or broken keycap | `keyboard` | `-keyboard-repair` |
| iPhone | Rear Glass | Camera lens cover cracked | `rear-camera-lens` | `-rear-camera-lens-repair` |
| iPhone | Camera | Blurry photos or shaking camera | `rear-camera` | `-rear-camera-repair` |
| iPhone | Camera | Camera shows black (no image) | `rear-camera` | `-rear-camera-repair` |
| iPhone | Audio / Mic / Speaker | No sound or low volume | `loudspeaker` | `-loudspeaker-repair` |
| iPhone | Audio / Mic / Speaker | Earpiece quiet or silent | `earpiece` | `-earpiece-speaker-repair` |
| iPhone | Other | Power button not working | `power-button` | `-power-button-repair` |
| iPhone | Other | Volume buttons not working | `volume-button` | `-volume-button-repair` |
| iPhone | Other | Mute switch not working | `mute-button` | `-mute-button-repair` |
| Watch | Rear Glass | Cracked back crystal | `heart-rate-monitor` | `-heart-rate-monitor-rear-glass-repair` |
| Watch | Other | Digital Crown stuck | `crown` | `-crown-repair` |
| Watch | Other | Side button not responding | `side-button` | `-side-button-repair` |

All other repair-route issues use the fault category's default repair type:
- Screen / Display → `screen` → `-screen-repair` (or model-specific variant)
- Power / Battery / Charging → `battery` → `-battery-repair`
- Rear Glass (iPhone) → `rear-glass` → `-rear-glass-repair` (or `-housing-rear-glass-repair`)

---

### H7: HANDLES Table Size — Lazy-Load as External JSON

**Problem:** ~100 models × ~10 repair types = ~1000 entries. Inline in HTML is too heavy.

**Fix:** Generate as an external JSON file and lazy-load it.

1. Build script outputs `handles.json` (~30KB minified)
2. Wizard fetches it on page load: `fetch('/assets/handles.json').then(...)`
3. Cache it in `sessionStorage` after first load
4. While loading, the wizard's steps 1-3 still work (no handles needed until step 4 resolution)
5. If the fetch fails, fall back to Contact for all repair routes

Alternative: Generate as a Liquid snippet that Shopify serves inline. This avoids the extra HTTP request:
```liquid
<script>
  var HANDLES = {{ 'handles.json' | asset_url | fetch | json }};
</script>
```
Or generate it directly in Liquid from metafields/product data if Shopify's Liquid performance allows.

---

### H8: Shopify Handle Typos in CSV

**Problem:** Two products have malformed handles:
- `macbook-pro-14-m4-pro-a3401-2024trackpad-repair` (missing hyphen before "trackpad")
- `macbook-pro-14-m4-max-a3185-2024-battery` (missing `-repair` suffix)
- `macbook-pro-16-m4-pro-a3403-2024-battery` (missing `-repair` suffix)

**Fix:** These need to be corrected in Shopify Admin. The handle can be edited in Products > [Product] > SEO > URL handle.

Correct handles:
- `macbook-pro-14-m4-pro-a3401-2024-trackpad-repair`
- `macbook-pro-14-m4-max-a3185-2024-battery-repair`
- `macbook-pro-16-m4-pro-a3403-2024-battery-repair`

**However**, per C3, the wizard uses the combined handles, not the individual Pro/Max handles. So these typos won't directly affect the wizard. Still fix them for consistency and for any direct links.

---

### H9: Missing Collection Mappings in PREFILL_MAP

**Fix:** Already fully addressed in C4 above. The complete PREFILL_MAP covers all 60+ collection handles from the Shopify export.

---

### H10: Flexgate Audit Mentions A1990 But No Product Exists

**Problem:** Audit says Flexgate applies to "A1706/A1707/A1708" for the Flexgate issue but also mentions A1990 elsewhere. Products.csv only has Flexgate for A1706, A1707, A1708.

**Fix:** Remove A1990 from Flexgate references. The Flexgate issue (backlight cable wear) affects the 2016-2017 models only. A1990 (2018-2019 15-inch) has a redesigned cable and is not affected.

Update the audit copy for MacBook > Screen > Issue #6:
```
This is a known issue on 2016-2017 MacBook Pro models (A1706, A1707, A1708) where the display
cable wears over time.
```

For A1990 and other models, the "Backlight fading" issue should route to regular screen repair, not Flexgate. The HANDLES table naturally handles this: A1990 won't have a flexgate entry, so `repairType: "flexgate"` will fail lookup → falls back to screen repair → `macbook-pro-15-2018-a1990-screen-repair` (which exists).

**Implementation in TS:** The Flexgate issue should appear for ALL MacBooks (as recommended in Open Decision #6) but the `repairType` should be `"flexgate"`. The `showRes()` logic handles the fallback:

```js
// In showRes, when repairType is "flexgate":
var handle = HANDLES[S.model] && HANDLES[S.model]["flexgate"];
if (!handle) {
  // No Flexgate product for this model — fall back to regular screen repair
  handle = HANDLES[S.model] && HANDLES[S.model]["screen"];
}
```

Same pattern for Dustgate.

---

## MEDIUM FIXES

---

### M1: Skeleton Loading UI Spec

**Fix:** Add to build plan:

```
Skeleton loading state for resolution card:
- Show the card container immediately with badge, title, and copy (these come from TS data, no fetch needed)
- Price area shows a pulsing grey bar (48px wide, 36px tall, rounded, CSS animation)
- Speed tier area shows 2-3 pulsing bars
- Service option area shows 2 pulsing cards
- Once fetch completes, replace skeleton with real data (fade transition, 200ms)
- If fetch fails after 2s timeout:
  - Replace price skeleton with: "View pricing →" link to product page
  - Remove speed tier and service option skeletons
  - Keep badge, title, copy, trust badges, and CTAs
```

CSS:
```css
.skel {
  background: linear-gradient(90deg, #f0f1f5 25%, #e8e9ee 50%, #f0f1f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
```

---

### M2: Form Validation Spec

**Fix:** Replace `alert()` with inline validation:

- **On blur:** Validate individual fields. Show red border + error message below field.
- **On submit:** Validate all required fields. Scroll to first error.
- **Email:** Basic format check (`/.+@.+\..+/`). Red border + "Please enter a valid email address."
- **Phone:** Must start with `+` or `0`, min 10 digits. Red border + "Please enter a valid phone number."
- **Name:** Non-empty, min 2 characters. Red border + "Please enter your name."
- **Visual:** Error border is `var(--accent)` replaced with `#dc2626` (red). Error text is `#dc2626`, 12px, shown below the field.

---

### M3: Urgent Flag Visual Spec

**Fix:** When `iss.urgent === true`:

- Badge changes from green/amber to **red**: `background: #fef2f2; color: #dc2626;`
- Badge text: "⚠ Urgent — stop using your device"
- Badge icon: warning triangle (not checkmark or magnifying glass)
- Copy area gets a top border: `border-top: 3px solid #dc2626;`
- An additional callout box appears above the copy:
  ```html
  <div class="urgent-callout">
    <strong>Safety first:</strong> Stop using the device and don't charge it.
    Bring it in as soon as possible.
  </div>
  ```
- Callout styling: `background: #fef2f2; border-left: 3px solid #dc2626; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #991b1b; margin-bottom: 16px;`

Applies to:
- MacBook > Power > Battery swollen
- MacBook > Water > Spilled liquid (within 24 hours)
- MacBook > Water > MacBook was submerged
- iPhone > Power > Swollen battery
- iPhone > Water > Dropped in liquid (within 24 hours)

---

### M4: Popstate Handler Spec

**Fix:** Add to build plan:

```js
// On each step transition, push state:
function go(n) {
  // ... existing step logic ...
  history.pushState({ step: n, device: S.device, model: S.model, fault: S.fault }, '', '');
}

// On popstate (browser back):
window.addEventListener('popstate', function(e) {
  if (e.state && e.state.step) {
    // Restore wizard state
    S.device = e.state.device;
    S.model = e.state.model;
    S.fault = e.state.fault;
    // Re-render the target step's content
    if (e.state.step === 1) {
      go(1);
    } else if (e.state.step === 2 && S.device) {
      renderModels(S.device);
      go(2);
    } else if (e.state.step === 3 && S.device) {
      renderFaults(S.device);
      go(3);
    } else if (e.state.step === 4 && S.device && S.fault) {
      renderTS(S.device, S.fault);
      go(4);
    } else {
      go(1);
    }
  }
});

// Push initial state on load:
history.replaceState({ step: 1 }, '', '');
```

**Edge case:** If the user presses back from step 1, it should navigate away from the wizard page (normal browser behaviour). The `replaceState` on load ensures this.

---

### M5: Shopify Section Schema Spec

**Fix:** Add to build plan:

```json
{% schema %}
{
  "name": "Quote Wizard",
  "tag": "section",
  "class": "quote-wizard-section",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_map",
      "label": "Show map and contact info",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_wizard",
      "label": "Show quote wizard",
      "default": true
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Get your free quote"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading",
      "default": "Pick your device and we'll point you to the right repair."
    }
  ],
  "presets": [
    {
      "name": "Quote Wizard"
    }
  ]
}
{% endschema %}
```

No blocks needed. The wizard's content is data-driven, not editable via theme editor.

---

### M6: Accessibility Gaps

**Fix:** Add to build plan:

1. **ARIA live region** for resolution card:
   ```html
   <div id="rP" aria-live="polite" aria-atomic="true" style="display:none;margin-top:20px;"></div>
   ```
   Screen readers will announce when the resolution card content changes.

2. **Badge status** must not rely on colour alone. The badge text already differentiates ("We can fix this" / "We need to take a look" / "Let's chat about this") — this is sufficient. Ensure the icon also differs (checkmark / magnifying glass / chat bubble).

3. **Focus management**: When resolution card appears, move focus to it:
   ```js
   document.getElementById('rP').focus();
   ```
   Add `tabindex="-1"` to the resolution container so it can receive focus without being in tab order.

4. **Keyboard support** for option cards (speed tiers, service): Add `onkeydown` handler for Enter/Space, same as existing device/model cards.

---

### M7: Watch Screen Repair — Glass-Only vs Full OLED

**Problem:** Two screen repair products exist per Watch model: `screen-glass-repair` (glass-only, cheaper) and `display-screen-repair` (full OLED, more expensive).

**Fix:** Split the Watch screen issues in the audit to distinguish:

```
| Cracked screen (display still works) | → REPAIR | Screen Glass Repair |
  Your watch glass is cracked but the display underneath still works.
  We'll replace the glass and re-seal the watch. |

| Cracked screen (display damaged or bleeding) | → REPAIR | Display Repair |
  The OLED display is damaged and needs a full replacement.
  We'll fit a genuine panel and re-seal the watch. |

| Display dead or unresponsive | → DIAGNOSTIC | Diagnostic |
  (unchanged) |
```

Repair type mappings:
- "Screen Glass Repair" → `repairType: "screen-glass"` → handle suffix `-screen-glass-repair`
- "Display Repair" → `repairType: "display-screen"` → handle suffix `-display-screen-repair`

**Impact on issue count:** Adds 1 net new issue to Watch > Screen (from 2 to 3). New total: **92 issues**.

---

### M8: iPad Copy — Expand Thin Descriptions

**Fix:** Updated copy for iPad issues that are notably shorter than their Mac/iPhone counterparts:

**iPad > Screen > Black screen:**
> A completely black screen could be the display, battery, or logic board. If your iPad still makes sounds or responds to touch, it's likely the display. If there's no response at all, we need to test the device to find the root cause.

**iPad > Power > Won't turn on:**
> An iPad that won't power on could have a dead battery, a logic board fault, or a charging issue. If it was working recently and suddenly died, try a hard reset first (hold Power + Volume Down for 10 seconds). If that doesn't help, bring it in for a diagnostic.

**iPad > Power > Won't charge:**
> Charging failures on iPads can be the Lightning or USB-C port, the battery itself, or the charging IC on the logic board. We need to test each component to find the fault. If you're using a third-party cable, try an Apple cable first to rule that out.

**iPad > Audio > No sound from speakers:**
> iPad speaker issues can be the speaker module itself or a logic board fault. If sound works through headphones but not the built-in speakers, it's likely the module. We'll test to confirm before recommending a repair.

---

### M9: Diagnostic Fee Deduction Note

**Fix:** This should be a static element on the diagnostic resolution template (Template B), not in per-issue copy. Add to the Template B spec:

```html
<div class="diag-note">
  <svg>...</svg> <!-- info icon -->
  <span>The diagnostic fee is deducted from the repair cost if you go ahead with the fix.</span>
</div>
```

Styling: `background: #fef9c3; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #854d0e; margin: 16px 24px;`

This appears on EVERY diagnostic resolution card, between the price and the service options.

---

### M10: Per-Model Collection Pages for Pre-Fill

**Fix:** The collections.xlsx contains 60+ per-model collection pages. Generate `PRODUCT_PREFILL` from these:

```js
var PRODUCT_PREFILL = {
  // MacBook per-model
  "macbook-air-13-a1932-2018-2019-repair-prices":          { device: "macbook", model: "MacBook Air 13-inch A1932 (2018-2019)" },
  "macbook-air-13-a2179-2020-repair-prices":                { device: "macbook", model: "MacBook Air 13-inch A2179 (2020)" },
  "macbook-air-13-m1-a2337-2020-repair-prices":             { device: "macbook", model: "MacBook Air 13-inch 'M1' A2337 (2020)" },
  "macbook-air-13-m2-a2681-2022-repair-prices":             { device: "macbook", model: "MacBook Air 13-inch 'M2' A2681 (2022)" },
  "macbook-air-13-m3-a3113-2024-repair-prices":             { device: "macbook", model: "MacBook Air 13-inch 'M3' A3113 (2024)" },
  "macbook-air-13-m4-a3240-2025-repair-prices":             { device: "macbook", model: "MacBook Air 13-inch 'M4' A3240 (2025)" },
  "macbook-air-15-m2-a2941-2023-repair-prices":             { device: "macbook", model: "MacBook Air 15-inch 'M2' A2941 (2023)" },
  "macbook-air-15-m3-a3114-2024-repair-prices":             { device: "macbook", model: "MacBook Air 15-inch 'M3' A3114 (2024)" },
  "macbook-air-15-m4-a3241-2025-repair-prices":             { device: "macbook", model: "MacBook Air 15-inch 'M4' A3241 (2025)" },
  "macbook-pro-13-a1708-2016-2017-repair-prices":           { device: "macbook", model: null },  // model not in wizard (pre-2018)
  "macbook-pro-13-touch-bar-a1706-2016-2018-repair-prices": { device: "macbook", model: null },
  "macbook-pro-13-touch-bar-a1989-2018-2019-repair-prices": { device: "macbook", model: "MacBook Pro 13-inch A1989 (2018-2019)" },
  "macbook-pro-13-2tb-3-a2159-2019-repair-prices":          { device: "macbook", model: "MacBook Pro 13-inch A2159 (2019)" },
  "macbook-pro-13-2tb-3-a2289-2020-repair-prices":          { device: "macbook", model: "MacBook Pro 13-inch A2289 (2020)" },
  "macbook-pro-13-4tb-3-a2251-2020-repair-prices":          { device: "macbook", model: "MacBook Pro 13-inch A2251 (2020)" },
  "macbook-pro-13-m1-a2338-2020-repair-prices":             { device: "macbook", model: "MacBook Pro 13-inch 'M1' A2338 (2020)" },
  "macbook-pro-13-m2-a2338-2022-repair-prices":             { device: "macbook", model: "MacBook Pro 13-inch 'M2' A2338 (2022)" },
  "macbook-pro-14-m1-pro-max-a2442-2021-repair-prices":     { device: "macbook", model: "MacBook Pro 14-inch 'M1 Pro/Max' A2442 (2021)" },
  "macbook-pro-14-m2-pro-max-a2779-2023-repair-prices":     { device: "macbook", model: "MacBook Pro 14-inch 'M2 Pro/Max' A2779 (2023)" },
  "macbook-pro-14-m3-m3-pro-max-a2918-a2992-2023-repair-prices": { device: "macbook", model: "MacBook Pro 14-inch 'M3 Pro/Max' A2918/A2992 (2023)" },
  "macbook-pro-14-m4-a3312-2024-repair-prices":             { device: "macbook", model: "MacBook Pro 14-inch 'M4 Pro/Max' A3112/A3185/A3401 (2024)" },
  "macbook-pro-14-m4-pro-a3401-2024-repair-prices":         { device: "macbook", model: "MacBook Pro 14-inch 'M4 Pro/Max' A3112/A3185/A3401 (2024)" },
  "macbook-pro-14-m4-max-a3185-2024-repair-prices":         { device: "macbook", model: "MacBook Pro 14-inch 'M4 Pro/Max' A3112/A3185/A3401 (2024)" },
  "macbook-pro-15-retina-a1707-2016-2017-repair-prices":    { device: "macbook", model: "MacBook Pro 15-inch A1707 (2016-2017)" },
  "macbook-pro-15-a1990-2018-2019-repair-prices":           { device: "macbook", model: "MacBook Pro 15-inch A1990 (2018-2019)" },
  "macbook-pro-16-a2141-2019-repair-prices":                { device: "macbook", model: "MacBook Pro 16-inch A2141 (2019)" },
  "macbook-pro-16-m1-pro-max-a2485-2021-repair-prices":     { device: "macbook", model: "MacBook Pro 16-inch 'M1 Pro/Max' A2485 (2021)" },
  "macbook-pro-16-m2-pro-max-a2780-2023-repair-prices":     { device: "macbook", model: "MacBook Pro 16-inch 'M2 Pro/Max' A2780 (2023)" },
  "macbook-pro-16-m3-pro-max-a2991-2023-repair-prices":     { device: "macbook", model: "MacBook Pro 16-inch 'M3 Pro/Max' A2991 (2023)" },
  "macbook-pro-16-m4-pro-a3403-2024-repair-prices":         { device: "macbook", model: "MacBook Pro 16-inch 'M4 Pro/Max' A3186/A3403 (2024)" },
  "macbook-pro-16-m4-max-a3186-2024-repair-prices":         { device: "macbook", model: "MacBook Pro 16-inch 'M4 Pro/Max' A3186/A3403 (2024)" },

  // iPhone per-model
  "iphone-11-repair-prices":          { device: "iphone", model: "iPhone 11" },
  "iphone-11-pro-repair-prices":      { device: "iphone", model: "iPhone 11 Pro" },
  "iphone-11-pro-max-repair-prices":  { device: "iphone", model: "iPhone 11 Pro Max" },
  "iphone-12-mini-repair-prices":     { device: "iphone", model: "iPhone 12 Mini" },
  "iphone-12-repair-prices":          { device: "iphone", model: "iPhone 12" },
  "iphone-12-pro-repair-prices":      { device: "iphone", model: "iPhone 12 Pro" },
  "iphone-12-pro-max-repair-prices":  { device: "iphone", model: "iPhone 12 Pro Max" },
  "iphone-13-mini-repair-prices":     { device: "iphone", model: "iPhone 13 Mini" },
  "iphone-13-repair-prices":          { device: "iphone", model: "iPhone 13" },
  "iphone-13-pro-repair-prices":      { device: "iphone", model: "iPhone 13 Pro" },
  "iphone-13-pro-max-repair-prices":  { device: "iphone", model: "iPhone 13 Pro Max" },
  "iphone-se-2nd-gen-repair-prices":  { device: "iphone", model: "iPhone SE 2nd Gen (2020)" },
  "iphone-se-3rd-gen-repair-prices":  { device: "iphone", model: "iPhone SE 3rd Gen (2022)" },  // extrapolated handle
  "iphone-14-repair-prices":          { device: "iphone", model: "iPhone 14" },
  "iphone-14-plus-repair-prices":     { device: "iphone", model: "iPhone 14 Plus" },
  "iphone-14-pro-repair-prices":      { device: "iphone", model: "iPhone 14 Pro" },
  "iphone-14-pro-max-repair-prices":  { device: "iphone", model: "iPhone 14 Pro Max" },
  "iphone-15-repair-prices":          { device: "iphone", model: "iPhone 15" },
  "iphone-15-plus-repair-prices":     { device: "iphone", model: "iPhone 15 Plus" },
  "iphone-15-pro-repair-prices":      { device: "iphone", model: "iPhone 15 Pro" },
  "iphone-15-pro-max-repair-prices":  { device: "iphone", model: "iPhone 15 Pro Max" },
  "iphone-16-repair-prices":          { device: "iphone", model: "iPhone 16" },
  "iphone-16-plus-repair-prices":     { device: "iphone", model: "iPhone 16 Plus" },
  "iphone-16-pro-repair-prices":      { device: "iphone", model: "iPhone 16 Pro" },
  "iphone-16-pro-max-repair-prices":  { device: "iphone", model: "iPhone 16 Pro Max" },
  "iphone-16e-repair-prices":         { device: "iphone", model: "iPhone 16e" },

  // iPad per-model (selected — generate the rest from collections.xlsx)
  // ... (similar pattern)

  // Watch per-model
  "apple-watch-ultra-2-repair-prices":           { device: "watch", model: "Apple Watch Ultra 2" },
  "apple-watch-series-10-45mm-repair-prices":    { device: "watch", model: "Apple Watch Series 10 46MM" },
  "apple-watch-series-10-41mm-repair-prices":    { device: "watch", model: "Apple Watch Series 10 42MM" },
  "apple-watch-series-9-45mm-repair-prices":     { device: "watch", model: "Apple Watch Series 9 45MM" },
  "apple-watch-series-9-41mm-repair-prices":     { device: "watch", model: "Apple Watch Series 9 41MM" },
  "apple-watch-series-8-45mm-repair-prices":     { device: "watch", model: "Apple Watch Series 8 45MM" },
  "apple-watch-series-8-41mm-repair-prices":     { device: "watch", model: "Apple Watch Series 8 41MM" },
  "apple-watch-series-7-45mm-repair-prices":     { device: "watch", model: "Apple Watch Series 7 45MM" },
  "apple-watch-series-7-41mm-repair-prices":     { device: "watch", model: "Apple Watch Series 7 41MM" },
  "apple-watch-series-6-44mm-repair-prices":     { device: "watch", model: "Apple Watch Series 6 44MM" },
  "apple-watch-series-6-40mm-repair-prices":     { device: "watch", model: "Apple Watch Series 6 40MM" },
  "apple-watch-series-5-44mm-repair-prices":     { device: "watch", model: "Apple Watch Series 5 44MM" },
  "apple-watch-series-5-40mm-repair-prices":     { device: "watch", model: "Apple Watch Series 5 40MM" },
  "apple-watch-se-2-44mm-repair-prices":         { device: "watch", model: "Apple Watch SE 2nd Gen 44MM" },
  "apple-watch-se-2-40mm-repair-prices":         { device: "watch", model: "Apple Watch SE 2nd Gen 40MM" },
  "apple-watch-se-44mm-repair-prices":           { device: "watch", model: "Apple Watch SE 1st Gen 44MM" },
  "apple-watch-se-40mm-repair-prices":           { device: "watch", model: "Apple Watch SE 1st Gen 40MM" },
};
```

When a match is found in `PRODUCT_PREFILL`, skip steps 1 and 2, go directly to step 3 (fault selection).

---

## LOW FIXES (can defer to post-launch)

---

### L1: "OIS" / "APFS" / "TrueDepth" Jargon (from Task 5)

**Fix:**
- "optical image stabilisation (OIS) has failed" → "the camera's stabilisation system has failed"
- "On Apple Silicon Macs with APFS" → "On newer Macs"
- "the TrueDepth sensor" → "the Face ID sensor array"

---

### L2: Inconsistent Urgency Language

**Fix:** Standardise all urgent warnings to:

> **Stop using your [device] immediately and do not charge it.** Bring it in as soon as possible.

Use this exact phrasing for: swollen battery (MacBook + iPhone), liquid damage within 24 hours (MacBook + iPhone), submersion (MacBook).

---

### L3: "Board-level repair" Language

**Fix:** Change to "specialised repair" in customer-facing copy. Keep "board-level" internally.

---

### L4: "Other" Device Category

**Fix:** Add a 5th device card: "Other / Not Listed" → Contact. No model/fault/issue steps — goes directly to contact form with a generic "Tell us what device you have and what's wrong" prompt.

---

### L5: No Analytics Spec

**Fix:** Add `dataLayer.push` events at each step for Google Tag Manager:

```js
// On device selection
dataLayer.push({ event: 'wizard_device', device: S.device });
// On model selection
dataLayer.push({ event: 'wizard_model', device: S.device, model: S.model });
// On fault selection
dataLayer.push({ event: 'wizard_fault', device: S.device, fault: S.fault });
// On issue selection + resolution shown
dataLayer.push({ event: 'wizard_result', device: S.device, model: S.model, fault: S.fault, issue: S.issue, route: iss.route });
// On CTA click
dataLayer.push({ event: 'wizard_cta', action: 'book_repair' | 'book_diagnostic' | 'contact_submit' });
```

---

### L6: No Fetch Retry Logic

**Fix:** Add a single retry with 1s delay on transient fetch failures:

```js
async function fetchProduct(handle) {
  if (_productCache[handle]) return _productCache[handle];
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await fetch('/products/' + handle + '.json');
      if (!res.ok) return null;
      var data = await res.json();
      _productCache[handle] = data.product;
      return data.product;
    } catch(e) {
      if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
    }
  }
  return null;
}
```

---

### L7: Global Function Namespace Collision

**Fix:** Wrap the entire wizard JS in an IIFE:

```js
(function(window) {
  // All wizard code here
  // Only expose what's needed for onclick handlers:
  window.QuoteWizard = { go, pickDev, pickModel, pickFault, pickIssue, ... };
})(window);
```

Or better: use `data-action` attributes and a single delegated event listener instead of inline `onclick` handlers.

---

## Final Updated Issue Count

After implementing H4 (split buttons) and M7 (split watch screen):

| Device | Issues |
|--------|--------|
| MacBook | 34 |
| iPhone | 30 (was 28, +2 from button split) |
| iPad | 15 |
| Watch | 13 (was 12, +1 from screen split) |
| **Total** | **92** |

---

## Recommended Build Order (Updated)

1. **Pre-build:** Fix Shopify handle typos (H8). Run once, takes 5 minutes.
2. **Phase 1a:** Write the HANDLES generation script. Run against Products.csv. Output `handles.json`. Validate every wizard model has entries.
3. **Phase 1b:** Build complete PREFILL_MAP and PRODUCT_PREFILL from collections.xlsx (C4, M10).
4. **Phase 1c:** Build the new TS data structure with all 92 issues, routes, repairTypes, and copy (C2, H6). Include the button split (H4), watch screen split (M7), and vibration reroute (H3).
5. **Phase 2:** Implement three resolution templates with skeleton loading (M1), urgent styling (M3), diagnostic fee note (M9).
6. **Phase 3:** Update `showRes()` with routing logic, repairType fallbacks (H5, H10), fetch + cache + retry (L6).
7. **Phase 4:** Shopify section conversion (M5), pre-fill logic, Liquid context passing, contact form webhook, pushState (M4).
8. **Phase 5:** Accessibility (M6), analytics (L5), namespace isolation (L7), validation (M2).
9. **Phase 6:** QA all 92 paths. Mobile testing. Deploy.
