# Quote Wizard: Self-Sustaining Architecture

**Date:** 2026-03-18
**Problem:** The current build plan requires manual JS edits to 6 hardcoded objects every time a product, model, or collection is added to Shopify. That's not maintainable.
**Goal:** Adding a new model (e.g. "MacBook Neo") should require ZERO wizard code changes. Add products to Shopify → wizard automatically discovers them.

---

## The Core Insight

Every Shopify product title follows a strict pattern:

```
{Model Name} {Repair Type Description}
```

Examples from actual product data:
```
"MacBook Air 13-inch 'M1' A2337 (2020) Screen Repair (Genuine Display)"
 ↑ model name (exact match to wizard)      ↑ repair type suffix

"iPhone 15 Pro Max Display Screen Repair"
 ↑ model name                ↑ repair type

"Apple Watch Series 9 45MM Battery Repair"
 ↑ model name                    ↑ repair type
```

The model name portion **exactly matches** the model names in the wizard's MD object. This means the wizard doesn't need a hardcoded model list — it can derive one from Shopify's own product data.

---

## What Changes vs. What Doesn't

There are two categories of wizard data:

### Category A: Shopify Already Knows This (make dynamic)

| Data | Current | New Source |
|------|---------|-----------|
| Model list (MD) | Hardcoded JS object | Generated from Shopify product titles at render time |
| Product handles (HANDLES) | Hardcoded JS lookup table | Generated from Shopify product handles at render time |
| Prices | Fetched from `/products/{handle}.json` | Same (already dynamic) |
| Pre-fill context (PREFILL_MAP) | Hardcoded JS lookup table | Liquid passes page context directly |
| MacBook A-number search | Hardcoded `nums` array | Derived from MD at runtime |
| Device name map (DN) | Hardcoded `{iphone:'iPhone',...}` | Derived from DEVS at runtime |

### Category B: Business/Editorial Knowledge (stays curated, but model-agnostic)

| Data | Why It's Manual | Why That's OK |
|------|----------------|---------------|
| Fault categories (FO) | "Screen / Display", "Power / Battery" etc. are curated taxonomy | Changes ~never. Same for all models within a device type. |
| Issue routing (TS) | "Sticky keys → diagnostic because liquid damage" requires expert judgment | **Model-agnostic.** Same 34 MacBook issues apply to EVERY MacBook. Adding MacBook Neo doesn't touch TS. |
| Issue copy | Customer-facing text needs editorial control | Same reason — per device type, not per model. |
| Device list (DEVS) | 4 devices with custom SVG icons | Changes only if Apple launches a new device category. |
| Fault icons (FI) | SVG assets for each fault type | Design assets; same across all models. |
| Visual guide (VG_DB) | iPhone physical identification metadata | iPhone-only, ~1 update/year when new iPhones launch. |

**Key point:** TS is keyed by `device + fault`, not by `model`. The same issue routing applies to every MacBook, every iPhone, every iPad, every Watch. When MacBook Neo launches, you add products to Shopify and the wizard discovers the new model automatically. You DON'T update TS.

---

## How It Works: Liquid Generates the Dynamic Data

The wizard becomes a Liquid section that generates its own data from Shopify's product/collection data at render time.

### Step 1: Liquid Generates the Model List (replaces MD)

```liquid
<script>
window.WIZARD_DATA = {
  models: {
    {%- comment -%} Loop through each device's repair collection {%- endcomment -%}

    {%- assign device_collections = "macbook-repair-prices,iphone-repair-prices,ipad-repair-prices,apple-watch-repair-prices" | split: "," -%}
    {%- assign device_keys = "macbook,iphone,ipad,watch" | split: "," -%}

    {%- for i in (0..3) -%}
      {%- assign col_handle = device_collections[i] -%}
      {%- assign dev_key = device_keys[i] -%}
      {%- assign col = collections[col_handle] -%}

      "{{ dev_key }}": [
        {%- assign seen_models = "" -%}
        {%- paginate col.products by 250 -%}
          {%- for product in col.products -%}
            {%- comment -%}
              Extract model name from product title.
              Product title format: "{Model Name} {Repair Suffix}"
              We use the product's "model_name" metafield (preferred) or parse from title.
            {%- endcomment -%}

            {%- assign model_name = product.metafields.custom.wizard_model_name -%}
            {%- unless model_name -%}
              {%- comment -%} Fallback: use product tag "model:{name}" {%- endcomment -%}
              {%- for tag in product.tags -%}
                {%- if tag contains "model:" -%}
                  {%- assign model_name = tag | remove: "model:" -%}
                {%- endif -%}
              {%- endfor -%}
            {%- endunless -%}

            {%- if model_name and seen_models contains model_name -%}
              {%- continue -%}
            {%- endif -%}
            {%- if model_name -%}
              {%- unless seen_models == "" -%},{%- endunless -%}
              "{{ model_name | escape }}"
              {%- assign seen_models = seen_models | append: "|||" | append: model_name -%}
            {%- endif -%}
          {%- endfor -%}
        {%- endpaginate -%}
      ]{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  },

  handles: {
    {%- comment -%}
      Build handle lookup: model_name → { repair_type → handle }
      Same loop, but this time we capture model_name + handle pairs
    {%- endcomment -%}

    {%- for i in (0..3) -%}
      {%- assign col_handle = device_collections[i] -%}
      {%- assign col = collections[col_handle] -%}

      {%- paginate col.products by 250 -%}
        {%- for product in col.products -%}
          {%- assign model_name = product.metafields.custom.wizard_model_name -%}
          {%- assign repair_type = product.metafields.custom.wizard_repair_type -%}

          {%- if model_name and repair_type -%}
            "{{ model_name | escape }}__{{ repair_type }}": "{{ product.handle }}"{%- unless forloop.last -%},{%- endunless -%}
          {%- endif -%}
        {%- endfor -%}
      {%- endpaginate -%}
    {%- endfor -%}
  }
};
</script>
```

### Step 2: Liquid Passes Page Context (replaces PREFILL_MAP)

```liquid
<script>
window.WIZARD_CONTEXT = {
  pageType: "{{ template.name }}",
  handle: "{{ collection.handle | default: product.handle }}",

  {%- comment -%} Read pre-fill data from collection/product metafields {%- endcomment -%}
  {%- if collection -%}
    device: "{{ collection.metafields.custom.wizard_device }}",
    fault: "{{ collection.metafields.custom.wizard_fault }}",
    model: "{{ collection.metafields.custom.wizard_model }}"
  {%- elsif product -%}
    device: "{{ product.metafields.custom.wizard_device }}",
    fault: "{{ product.metafields.custom.wizard_fault }}",
    model: "{{ product.metafields.custom.wizard_model_name }}"
  {%- else -%}
    device: null, fault: null, model: null
  {%- endif -%}
};
</script>
```

### Step 3: JS Reads the Liquid-Generated Data (replaces hardcoded lookups)

```js
// Models: built from WIZARD_DATA.models
// Instead of the hardcoded MD object, group models dynamically
function buildModelGroups(device) {
  var models = window.WIZARD_DATA.models[device] || [];
  // Group by series (parse from model name)
  // "MacBook Pro 16-inch 'M4 Pro/Max' A3186/A3403 (2024)" → group "MacBook Pro 16""
  // "iPhone 15 Pro Max" → group "iPhone 15 series"
  // Grouping logic is simple string parsing — see implementation below
}

// Handles: built from WIZARD_DATA.handles
function getHandle(model, repairType) {
  var key = model + "__" + repairType;
  return window.WIZARD_DATA.handles[key] || null;
}
```

---

## What Shopify Needs: Product Metafields + Tags

For this to work, each product in Shopify needs metadata that the wizard can consume. Two options:

### Option A: Product Tags (simplest, works today)

Add structured tags to each product:
```
model:MacBook Air 13-inch 'M1' A2337 (2020)
device:macbook
repair:screen
group:MacBook Air 13"
year:2020
```

**Pros:** No Shopify Plus needed. Tags are free-text. Bulk-editable via CSV import.
**Cons:** Tags aren't strongly typed. Can have typos.

### Option B: Product Metafields (cleaner, recommended)

Create custom metafields on products:

| Namespace | Key | Type | Example |
|-----------|-----|------|---------|
| `custom` | `wizard_model_name` | Single line text | `MacBook Air 13-inch 'M1' A2337 (2020)` |
| `custom` | `wizard_device` | Single line text | `macbook` |
| `custom` | `wizard_repair_type` | Single line text | `screen` |
| `custom` | `wizard_model_group` | Single line text | `MacBook Air 13"` |
| `custom` | `wizard_year` | Single line text | `2020` |

Create custom metafields on collections:

| Namespace | Key | Type | Example |
|-----------|-----|------|---------|
| `custom` | `wizard_device` | Single line text | `macbook` |
| `custom` | `wizard_fault` | Single line text | `Screen / Display` |
| `custom` | `wizard_model` | Single line text | (blank for category collections, model name for model collections) |

**Pros:** Strongly typed. Searchable. Editable in Shopify admin GUI.
**Cons:** Requires initial setup of metafield definitions. Bulk population via API script.

### One-Time Setup Cost

You need to populate metafields on existing 967 products + 183 collections. This is a one-time script:

```js
// Pseudocode: populate metafields from existing product titles
for each product in Shopify:
  model_name = extractModelFromTitle(product.title)  // parse known patterns
  repair_type = extractRepairType(product.handle)     // "screen", "battery", etc.
  device = inferDevice(product.title)                 // "macbook", "iphone", etc.
  group = inferGroup(model_name)                      // "MacBook Air 13"", etc.
  year = extractYear(model_name)                      // "2020", "2023", etc.

  // Write metafields via Shopify Admin API
  shopify.product.update(product.id, {
    metafields: [
      { namespace: "custom", key: "wizard_model_name", value: model_name },
      { namespace: "custom", key: "wizard_device", value: device },
      { namespace: "custom", key: "wizard_repair_type", value: repair_type },
      { namespace: "custom", key: "wizard_model_group", value: group },
      { namespace: "custom", key: "wizard_year", value: year }
    ]
  })
```

After this, every NEW product just needs the same 5 metafields filled in when created. Shopify's admin UI shows metafield inputs on the product edit page, so whoever creates the product fills them in as part of normal workflow.

---

## The "MacBook Neo" Scenario — Step by Step

Apple announces the MacBook Neo. Here's what happens:

### What iCorrect does (normal Shopify workflow):
1. Create products: "MacBook Neo A9999 (2027) Screen Repair", "...Battery Replacement", "...Diagnostic", etc.
2. Fill in metafields on each product:
   - `wizard_model_name`: "MacBook Neo A9999 (2027)"
   - `wizard_device`: "macbook"
   - `wizard_repair_type`: "screen" / "battery" / "diagnostic" / etc.
   - `wizard_model_group`: "MacBook Neo"
   - `wizard_year`: "2027"
3. Add products to the `macbook-repair-prices` collection (or let Shopify's automated collection rules handle it)
4. Create a collection page `macbook-neo-a9999-2027-repair-prices` with metafields:
   - `wizard_device`: "macbook"
   - `wizard_model`: "MacBook Neo A9999 (2027)"

### What the wizard does automatically:
1. On next page load, Liquid iterates the `macbook-repair-prices` collection
2. Finds new products with `wizard_model_name = "MacBook Neo A9999 (2027)"`
3. Adds "MacBook Neo A9999 (2027)" to the model list under group "MacBook Neo"
4. Adds handle entries: `"MacBook Neo A9999 (2027)__screen" → "macbook-neo-a9999-2027-screen-repair"`
5. User selects MacBook Neo → wizard shows existing MacBook faults and issues (from TS) → resolves to the correct product

### What requires NO changes:
- Wizard code ✅
- TS (issues/routing) ✅ — same MacBook faults apply
- FO (fault categories) ✅ — same categories
- DEVS, FI ✅ — it's still a MacBook
- PREFILL_MAP ✅ — metafields on the collection handle the pre-fill
- Theme deployment ✅ — nothing to redeploy

---

## What Still Requires Manual Work

| Scenario | Action Required | Frequency |
|----------|----------------|-----------|
| New model within existing device (MacBook Neo) | Create products with metafields. That's it. | ~2-3x/year |
| New repair type (e.g. eSIM Repair) | Add products. May need new fault category in FO + new TS entries if it's a new symptom category. | Rare |
| New device category (Apple Vision Pro) | Add to DEVS, FO, TS, create collections. This is a real code change. | ~once every few years |
| New iPhone (for visual guide) | Update VG_DB with physical characteristics. | ~1x/year |
| Issue copy rewrite | Edit TS entries. | Occasional, editorial |
| New routing decision (e.g. "this issue now routes to repair instead of diagnostic") | Edit single TS entry. | Rare |

**Bottom line:** Day-to-day product management (adding models, changing prices, creating collections) requires ZERO wizard code changes. Only taxonomy-level changes (new device category, new fault category, new symptom type) need code.

---

## Liquid Performance: Can It Handle 967 Products?

**Concern:** Iterating 967 products across 4 collections at Liquid render time could be slow.

**Reality check:**
- Shopify Liquid `paginate` supports up to 250 items per page
- Each device collection has ~200-300 products
- Liquid iteration is server-side, not client-side — Shopify's infrastructure handles this
- The data output is JSON strings, not full HTML rendering — lightweight

**Mitigation if needed:**
- Cache the generated JSON in `sessionStorage` client-side
- Or generate as a static JS asset via Shopify's Asset API (rebuild on product change via webhook)
- Or use Shopify's `{% render %}` to break the work into snippets

**Benchmark:** The existing `macbook-matrix.liquid` already iterates blocks at render time. The new approach replaces manual blocks with automated collection iteration — it's structurally similar, just data-driven.

---

## Alternative: Build-Time Generation via CI/CD

If Liquid render performance is a concern, an alternative is:

1. Set up a Shopify webhook: `products/create`, `products/update`, `products/delete`
2. Webhook triggers a CI/CD job (GitHub Action)
3. Job fetches all products via Shopify Admin API
4. Generates `wizard-data.json` (models, handles, groups)
5. Pushes to Shopify as a theme asset (`/assets/wizard-data.json`)
6. Wizard fetches this JSON on page load

**Pros:** Zero Liquid performance concern. Clean separation.
**Cons:** More infrastructure (webhook + CI/CD). Data is stale until webhook fires.

**Recommendation:** Start with Liquid-generated data. If performance is an issue, switch to the CI/CD approach later. The wizard JS code is the same either way — it just reads from `window.WIZARD_DATA` regardless of how that data was generated.

---

## Model Grouping Logic

The wizard needs to group models into collapsible series (e.g. "MacBook Pro 16"", "iPhone 15 series"). Here's how to derive groups from model names:

### MacBook
Extract from model name: `"MacBook {Pro/Air} {size}-inch"` → group name
```
"MacBook Pro 16-inch 'M4 Pro/Max' A3186/A3403 (2024)" → "MacBook Pro 16""
"MacBook Air 13-inch 'M1' A2337 (2020)"                → "MacBook Air 13""
```

### iPhone
Extract from model name: `"iPhone {number}"` → group name
```
"iPhone 15 Pro Max"  → "iPhone 15 series"
"iPhone 15 Pro"      → "iPhone 15 series"
"iPhone SE 3rd Gen"  → "Older iPhones"  (or "iPhone SE series")
```

### iPad
Extract: `"iPad {type}"` → group name
```
"iPad Pro 13 M4 (2024)"     → "iPad Pro"
"iPad Air 13 M2 (2024)"     → "iPad Air"
"iPad 10th Gen (2022)"      → "iPad + iPad Mini"
"iPad Mini 7 (2024)"        → "iPad + iPad Mini"
```

### Apple Watch
Extract: `"Apple Watch {series/type}"` → group name
```
"Apple Watch Ultra 2"           → "Apple Watch Ultra"
"Apple Watch Series 10 46MM"    → "Apple Watch Series"
"Apple Watch SE 2nd Gen 44MM"   → "Apple Watch SE"
```

This parsing can be done in Liquid (using `split`, `first`, string filters) or in JS after receiving the model list. **The `wizard_model_group` metafield eliminates the need for parsing** — it's the cleanest approach.

---

## Repair Type Mapping: Handle Suffix → Fault Category

The wizard needs to know which fault category each product belongs to. This can be derived from the `wizard_repair_type` metafield:

```js
var REPAIR_TO_FAULT = {
  // These map repair types to wizard fault categories
  "screen":           "Screen / Display",
  "display-screen":   "Screen / Display",
  "flexgate":         "Screen / Display",
  "dustgate":         "Screen / Display",
  "battery":          "Power / Battery / Charging",
  "charging-port":    "Power / Battery / Charging",
  "keyboard":         "Trackpad / Keyboard",
  "trackpad":         "Trackpad / Keyboard",
  "touch-bar":        "Other",
  "loudspeaker":      "Audio / Mic / Speaker",
  "earpiece":         "Audio / Mic / Speaker",
  "microphone":       "Audio / Mic / Speaker",
  "rear-camera":      "Camera",
  "rear-camera-lens": "Camera",
  "front-camera":     "Camera",
  "face-id":          "Camera",
  "rear-glass":       "Rear Glass",
  "housing":          "Rear Glass",
  "heart-rate-monitor": "Rear Glass",
  "crown":            "Other",
  "side-button":      "Other",
  "power-button":     "Other",
  "volume-button":    "Other",
  "mute-button":      "Other",
  "home-button":      "Other",
  "diagnostic":       "diagnostic"
};
```

This is a static mapping that only changes when a NEW repair type is invented — which is very rare. It's not model-dependent.

---

## Summary: What the Wizard Looks Like After This Change

### Static (hardcoded, curated):
- **DEVS** — 4 device cards with SVG icons
- **FO** — Fault categories per device (8 for MacBook, 9 for iPhone, 7 for iPad, 6 for Watch)
- **FI** — SVG icons for fault types
- **TS** — 92 issue entries with routing + copy (keyed by device + fault, NOT model)
- **REPAIR_TO_FAULT** — Repair type → fault category mapping (~25 entries)
- **VG_DB** — iPhone visual guide (updated annually)

### Dynamic (generated from Shopify):
- **Model list** — from product metafields via Liquid or API
- **Model groups** — from metafield `wizard_model_group`
- **Product handles** — from product metafields via Liquid or API
- **Prices** — fetched from `/products/{handle}.json` at resolution time
- **Pre-fill context** — from collection/product metafields via Liquid

### Self-sustaining triggers:
| Event | Wizard updates automatically? |
|-------|------------------------------|
| New product added with metafields | ✅ Yes |
| Product price changed | ✅ Yes (live fetch) |
| Product handle renamed | ✅ Yes (metafield-based) |
| New collection added with metafields | ✅ Yes |
| New model (MacBook Neo) | ✅ Yes — just add products with metafields |
| New repair type (eSIM Repair) | ⚠️ Needs REPAIR_TO_FAULT entry + possibly new FO/TS entries |
| New device category (Vision Pro) | ❌ Needs code changes (DEVS, FO, TS, icons) |
| New iPhone (visual guide) | ⚠️ Needs VG_DB update |

---

## Migration Path

### Phase 0: Metafield Setup (one-time, ~2 hours)
1. Define metafield definitions in Shopify Admin → Settings → Custom data
2. Write a script to bulk-populate metafields on all 967 products from product titles/handles
3. Write a script to bulk-populate metafields on all 183 collections

### Phase 1: Build Wizard with Liquid Data Generation
1. Wizard section renders `window.WIZARD_DATA` from Liquid collection iteration
2. Wizard section renders `window.WIZARD_CONTEXT` from Liquid page context
3. JS reads these instead of hardcoded MD/HANDLES/PREFILL_MAP

### Phase 2: TS Stays Hardcoded (acceptable)
1. TS is the editorial content — model-agnostic, rarely changes
2. Could be moved to Shopify Articles or a CMS later if editorial frequency increases
3. For now, it lives in the JS/Liquid section file

### Phase 3: SOP for Adding New Models
1. Document the metafield requirements for new products
2. Add to the product creation checklist/SOP
3. No developer involvement needed for new models

---

## One-Time Metafield Population Script

Here's the logic for the initial bulk population (run once via Shopify Admin API):

```
For each product:
  1. Parse title to extract model name:
     - MacBook: everything before " Screen Repair" / " Battery Replacement" / " Keyboard Repair" / etc.
     - iPhone: everything before " Display Screen" / " Battery" / " Charging Port" / etc.
     - iPad: everything before " Screen Repair" / " Battery" / etc.
     - Watch: everything before " Battery" / " Screen" / " Diagnostic" / etc.

  2. Derive device from handle prefix:
     - macbook-* → "macbook"
     - iphone-* → "iphone"
     - ipad-* → "ipad"
     - apple-watch-* → "watch"

  3. Derive repair_type from handle suffix:
     - *-screen-repair → "screen"
     - *-battery-repair → "battery"
     - *-diagnostic → "diagnostic"
     - etc. (see REPAIR_TO_FAULT map)

  4. Derive model_group from model_name:
     - MacBook: "{Pro/Air} {size}"" (e.g. "MacBook Pro 16"")
     - iPhone: "iPhone {number} series" or "Older iPhones"
     - iPad: "iPad Pro" / "iPad Air" / "iPad + iPad Mini"
     - Watch: "Apple Watch Ultra" / "Apple Watch Series" / "Apple Watch SE"

  5. Derive year from model_name:
     - Extract (YYYY) or (YYYY-YYYY) from end of model name

  6. Write metafields via Admin API
```

This script can be reused anytime to verify/fix metafield consistency.
