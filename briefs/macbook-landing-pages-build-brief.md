# MacBook Landing Pages — Build Brief
**Issued by:** Marketing Agent  
**Date:** 2026-03-23  
**Priority:** High  
**For:** Code Agent / Claude Code  

---

## Objective

Build 6 new Shopify pages targeting high-value MacBook repair keywords in London. These pages serve dual purpose: organic SEO ranking + paid ad landing pages. They must be built to a high conversion standard from day one.

---

## Pages to Build

| Handle (URL slug) | Target Keyword | H1 |
|---|---|---|
| `macbook-screen-repair-london` | macbook screen repair london | MacBook Screen Repair London |
| `macbook-repair-london` | macbook repair london | MacBook Repair London |
| `macbook-pro-screen-replacement-london` | macbook pro screen replacement london | MacBook Pro Screen Replacement London |
| `macbook-air-screen-replacement-london` | macbook air screen replacement london | MacBook Air Screen Replacement London |
| `macbook-pro-repair-london` | macbook pro repair london | MacBook Pro Repair London |
| `macbook-air-repair-london` | macbook air repair london | MacBook Air Repair London |

---

## Technical Approach

### How Shopify Pages Work

Each page requires two things:
1. **A Shopify Page object** (created via Admin API) — sets the handle/URL, title, and SEO meta
2. **A Theme template JSON file** — controls the layout/sections rendered on that page

### Base Template to Clone

Use `templates/page.macbook-repairs.json` (live theme ID: `158358438141`) as the base. It has the right section structure. Each new page gets its own template JSON file with keyword-specific copy.

### Template Structure per Page

Each page should use this section order (matching the base):
1. `image-with-text` — hero with H1, intro paragraph, CTA button
2. `rich-text` — supporting paragraph with keyword + trust signals
3. `custom-liquid` — repair services relevant to that page (see copy below)
4. `macbook-videos` — reuse as-is (no changes needed)
5. `custom-liquid` — FAQ section with page-specific questions
6. `main-page` — disabled (as per base template)

---

## Implementation Steps

### Step 1: Create Each Shopify Page via Admin API

```bash
POST https://i-correct-final.myshopify.com/admin/api/2024-01/pages.json
X-Shopify-Access-Token: $SHOPIFY_ACCESS_TOKEN
Content-Type: application/json

{
  "page": {
    "title": "<PAGE TITLE>",
    "handle": "<HANDLE>",
    "body_html": "",
    "published": true,
    "metafields": [
      {
        "namespace": "global",
        "key": "title_tag",
        "value": "<SEO TITLE>",
        "type": "single_line_text_field"
      },
      {
        "namespace": "global",
        "key": "description_tag",
        "value": "<META DESCRIPTION>",
        "type": "single_line_text_field"
      }
    ]
  }
}
```

### Step 2: Create Template JSON for Each Page

Upload to live theme (`158358438141`) via:
```
PUT https://i-correct-final.myshopify.com/admin/api/2024-01/themes/158358438141/assets.json
```

Template key format: `templates/page.<handle>.json`

---

## Page-by-Page Copy & Content

---

### PAGE 1: `macbook-screen-repair-london`

**Shopify Page Title:** MacBook Screen Repair London  
**SEO Title:** MacBook Screen Repair London | Same-Day Service | iCorrect  
**Meta Description:** Expert MacBook screen repair in London. Cracked display, backlight failure, Flexgate issues. Most repairs completed same-day. 2-year warranty. Book online.

**Hero H1:** MacBook Screen Repair London  
**Hero Text:** Specialist MacBook screen repairs in London. We fix cracked displays, backlight failures, Flexgate, and Dustgate on all MacBook models. Most screen repairs completed same-day or next-day. 2-year warranty included.  
**Hero CTA Label:** View Screen Repair Prices  
**Hero CTA Link:** /collections/macbook-screen-repair-prices

**Rich Text Heading:** MacBook Screen Repair Specialists in London  
**Rich Text Body:** Whether your display is cracked, flickering, or completely dark, our London-based technicians carry out component-level screen repairs to restore your MacBook to factory condition. We use genuine LCDs and test every display before and after repair. All MacBook screen repairs include a 2-year warranty.

**Repair Services Section (custom-liquid):**
Include 3 cards:
- MacBook Screen Replacement → link /collections/macbook-screen-repair-prices
- MacBook Flexgate Repair → link /collections/macbook-flexgate-repair-prices
- MacBook Diagnostic Service → link /collections/macbook-diagnostic-prices

**FAQs:**
1. How long does a MacBook screen repair take in London? — Most MacBook screen repairs are completed same-day or within 24 hours at our London repair centre. Exact turnaround depends on model and part availability. Express same-day slots are available when pre-booked.
2. Do you fix MacBook Flexgate in London? — Yes. Flexgate (the stage-light backlight effect on 2016–2019 MacBook Pro models) is a repair we specialise in. We replace the damaged display cable at component level rather than replacing the entire display unnecessarily.
3. How much does MacBook screen repair cost in London? — Prices vary by model. Visit our screen repair pricing page for an exact quote by MacBook model. We're transparent about costs upfront — no hidden fees.
4. Do you use genuine MacBook screens? — Yes. Approximately 90% of the screens we use are original Apple panels, professionally recovered from genuine devices. This preserves True Tone, brightness consistency, and long-term reliability.
5. Is there a warranty on MacBook screen repairs? — All screen repairs include a 2-year warranty covering the repaired display and associated components.

**JSON-LD Schema (inject in custom-liquid):**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "iCorrect",
  "image": "https://cdn.shopify.com/s/files/1/0674/1952/0525/files/MacBook_Repair.png",
  "url": "https://www.icorrect.co.uk/pages/macbook-screen-repair-london",
  "telephone": "+442080049995",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 Margaret Street",
    "addressLocality": "London",
    "postalCode": "W1W 8JQ",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.5175,
    "longitude": -0.1418
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "££",
  "description": "Expert MacBook screen repair in London. Cracked display, backlight failure, Flexgate. Same-day service available. 2-year warranty."
}
```

---

### PAGE 2: `macbook-repair-london`

**Shopify Page Title:** MacBook Repair London  
**SEO Title:** MacBook Repair London | Expert Mac Technicians | iCorrect  
**Meta Description:** MacBook repair specialists in London. Screens, batteries, keyboards, liquid damage, logic board repairs. 2-year warranty. Same-day express available. Book now.

**Hero H1:** MacBook Repair London  
**Hero Text:** London's MacBook repair specialists. We fix screens, batteries, keyboards, charging issues, liquid damage, and logic board failures — all with a 2-year warranty. Average turnaround 48 hours, express same-day available.  
**Hero CTA Label:** View Repair Prices  
**Hero CTA Link:** /pages/macbook-repairs

**Rich Text Heading:** MacBook Repair Service London  
**Rich Text Body:** From minor screen cracks to complex logic board failures, our London technicians handle every MacBook repair at component level. We don't swap boards — we fix them. Serving customers across London with transparent pricing, no-fix no-fee on standard repairs, and a 2-year warranty on every job.

**Repair Services Section:** Include all 5 cards from existing macbook-repairs page (Screen, Battery, Keyboard, Liquid Damage, Diagnostic) — copy as-is but update links to pricing collections.

**FAQs:**
1. Where is iCorrect located in London? — We're based at 12 Margaret Street, London W1W 8JQ — a short walk from Oxford Circus and Regent Street. Walk-ins are welcome. Mail-in repair is also available across the UK.
2. How long does MacBook repair take? — Most repairs are completed within 48 hours. Screen replacements and battery swaps are often same-day. Logic board diagnostics and liquid damage repairs typically take 3–5 working days. Express slots are available.
3. Do you offer a no-fix no-fee guarantee? — Yes. If we can't fix your MacBook, you don't pay for the repair. Diagnostic fees may apply for logic board assessments if the board cannot be repaired.
4. Can you repair MacBook logic boards in London? — Yes — this is one of our core specialisms. We carry out component-level microchip repair on MacBook logic boards, including power circuit failures, liquid damage corrosion, and charging IC faults.
5. What MacBook models do you repair? — We repair all MacBook models from 2016 onwards, including MacBook Air, MacBook Pro 13", 14", 15", and 16". We can also assist older models for battery and data recovery work.

**JSON-LD Schema:** Same LocalBusiness schema as Page 1 but with updated URL (`/pages/macbook-repair-london`) and description.

---

### PAGE 3: `macbook-pro-screen-replacement-london`

**Shopify Page Title:** MacBook Pro Screen Replacement London  
**SEO Title:** MacBook Pro Screen Replacement London | iCorrect  
**Meta Description:** MacBook Pro screen replacement in London. All models including M1, M2, M3 Pro & Max. Genuine displays, same-day available, 2-year warranty. Book now.

**Hero H1:** MacBook Pro Screen Replacement London  
**Hero Text:** MacBook Pro screen replacement specialists in London. We replace cracked, damaged and faulty displays on all MacBook Pro models — M1, M2, M3, Pro and Max chips. Genuine panels, same-day slots available, 2-year warranty.  
**Hero CTA Label:** View MacBook Pro Screen Prices  
**Hero CTA Link:** /collections/macbook-screen-repair-prices

**Rich Text Heading:** MacBook Pro Screen Replacement — All Models  
**Rich Text Body:** We replace MacBook Pro displays on all current and previous generation models. Whether you have the 14" MacBook Pro M3 Pro, the 16" MacBook Pro M3 Max, or an older Intel model, our London technicians carry out full screen replacements using genuine Liquid Retina XDR panels where available. Every replacement includes component-level testing and a 2-year warranty.

**Repair Services Section (3 cards):**
- MacBook Pro Screen Prices → /collections/macbook-screen-repair-prices
- MacBook Pro Flexgate Repair → /collections/macbook-flexgate-repair-prices
- MacBook Diagnostic → /collections/macbook-diagnostic-prices

**FAQs:**
1. Which MacBook Pro screen sizes do you replace? — We replace screens on all MacBook Pro sizes: 13", 14", 15", and 16". This includes all chip generations: Intel, M1, M1 Pro/Max, M2, M2 Pro/Max, M3, M3 Pro/Max.
2. How much does MacBook Pro screen replacement cost? — Prices vary by model. See our screen repair pricing page for exact costs per MacBook Pro model. We're upfront about pricing before any work begins.
3. Do you fix MacBook Pro Flexgate in London? — Yes. Flexgate (backlight stage-light effect on 2016–2019 MacBook Pro 13" and 15") is a common repair we handle regularly. We fix the display cable at component level.
4. Can you replace a MacBook Pro Liquid Retina XDR display? — Yes. We replace the Liquid Retina XDR displays found in 14" and 16" MacBook Pro M1/M2/M3 models using genuine Apple panels.
5. How long does MacBook Pro screen replacement take? — Most MacBook Pro screen replacements are completed within 24 hours. Same-day service is available when pre-booked.

**JSON-LD Schema:** Same LocalBusiness schema with updated URL and description.

---

### PAGE 4: `macbook-air-screen-replacement-london`

**Shopify Page Title:** MacBook Air Screen Replacement London  
**SEO Title:** MacBook Air Screen Replacement London | iCorrect  
**Meta Description:** MacBook Air screen replacement in London. All models including M1, M2, M3. Genuine Retina displays, fast turnaround, 2-year warranty. Book online.

**Hero H1:** MacBook Air Screen Replacement London  
**Hero Text:** MacBook Air screen replacement in London. We replace cracked and faulty displays on all MacBook Air models — M1, M2, and M3, in both 13" and 15" sizes. Genuine Retina panels, fast turnaround, 2-year warranty.  
**Hero CTA Label:** View MacBook Air Screen Prices  
**Hero CTA Link:** /collections/macbook-screen-repair-prices

**Rich Text Heading:** MacBook Air Screen Replacement — All Models  
**Rich Text Body:** MacBook Air screens are thin, precise, and require specialist handling. Our London technicians replace displays on all Air models with care, using genuine panels that maintain True Tone and brightness calibration. Whether it's the 13" MacBook Air M2, the 15" MacBook Air M3, or an older Intel model, we have you covered with a 2-year warranty on every screen replacement.

**Repair Services Section (3 cards):**
- MacBook Air Screen Prices → /collections/macbook-screen-repair-prices
- MacBook Air Battery Replacement → /collections/macbook-battery-repair-prices
- MacBook Diagnostic → /collections/macbook-diagnostic-prices

**FAQs:**
1. Which MacBook Air models do you replace screens on? — We replace screens on all MacBook Air models: 13" and 15", Intel and Apple Silicon (M1, M2, M3). Bring your MacBook Air to our London centre or send it via mail-in.
2. How long does MacBook Air screen replacement take? — Most MacBook Air screen replacements are completed within 24 hours. Express same-day slots are available.
3. How much does MacBook Air screen replacement cost in London? — See our screen pricing page for exact costs per model. Prices are fixed upfront — no surprises.
4. Do you use genuine MacBook Air display panels? — Yes. We use genuine Apple Retina display panels wherever available, preserving True Tone and the original display quality.
5. Is there a warranty on the screen replacement? — Yes — all MacBook Air screen replacements include a 2-year warranty covering the display and installation.

**JSON-LD Schema:** Same LocalBusiness schema with updated URL and description.

---

### PAGE 5: `macbook-pro-repair-london`

**Shopify Page Title:** MacBook Pro Repair London  
**SEO Title:** MacBook Pro Repair London | Screen, Battery, Logic Board | iCorrect  
**Meta Description:** MacBook Pro repair specialists in London. Screens, batteries, keyboards, liquid damage, logic board. All models M1–M3. 2-year warranty. Book now.

**Hero H1:** MacBook Pro Repair London  
**Hero Text:** Expert MacBook Pro repair in London. We fix everything from screen replacements and battery swaps to complex logic board failures on all MacBook Pro models — M1, M2, and M3. Component-level repairs, 2-year warranty, express same-day available.  
**Hero CTA Label:** View MacBook Pro Repair Prices  
**Hero CTA Link:** /pages/macbook-repairs

**Rich Text Heading:** MacBook Pro Repair — All Models, All Faults  
**Rich Text Body:** We repair MacBook Pro models from 2016 to the latest M3 Pro and Max. Whether it's a damaged Liquid Retina XDR display, a swollen battery, keyboard failure, charging fault, or a logic board with liquid damage — our London technicians carry out the repair at component level. No unnecessary part replacements, no data loss, no inflated bills.

**Repair Services Section:** Same 5 cards as macbook-repair-london page.

**FAQs:**
1. Do you repair MacBook Pro M3 in London? — Yes. We repair all MacBook Pro M3 models, including the 14" and 16" M3 Pro and M3 Max. This includes screen replacement, battery repair, and component-level logic board work.
2. Can you fix a MacBook Pro that won't turn on? — In most cases, yes. A MacBook Pro that won't power on is often caused by a charging circuit fault, liquid damage, or a failed power management chip. We diagnose and repair at component level.
3. How much does MacBook Pro repair cost? — Costs vary by repair type and model. We provide upfront pricing before any work begins. See our pricing pages or book a diagnostic for a firm quote.
4. Do you fix MacBook Pro liquid damage in London? — Yes. Liquid damage repair is one of our specialist services. We carry out ultrasonic cleaning, corrosion removal, and logic board component replacement where needed.
5. What warranty do you offer on MacBook Pro repairs? — All MacBook Pro repairs carry a 2-year warranty covering the repaired components and workmanship.

**JSON-LD Schema:** Same LocalBusiness schema with updated URL and description.

---

### PAGE 6: `macbook-air-repair-london`

**Shopify Page Title:** MacBook Air Repair London  
**SEO Title:** MacBook Air Repair London | Screen, Battery & More | iCorrect  
**Meta Description:** MacBook Air repair specialists in London. Screen, battery, charging, keyboard and logic board repairs. M1, M2, M3 models. 2-year warranty. Book online.

**Hero H1:** MacBook Air Repair London  
**Hero Text:** MacBook Air repair specialists in London. We fix screens, batteries, charging ports, keyboards, and logic boards on all MacBook Air models including M1, M2 and M3. Transparent pricing, 2-year warranty, express service available.  
**Hero CTA Label:** View MacBook Air Repair Prices  
**Hero CTA Link:** /pages/macbook-repairs

**Rich Text Heading:** MacBook Air Repair — Expert Service in London  
**Rich Text Body:** The MacBook Air is Apple's most popular laptop — and one of the most common repairs we carry out in London. From cracked Retina displays to swollen batteries, charging faults, and liquid damage, we handle every MacBook Air repair at component level. Same-day express repair is available for most common faults. All repairs come with a 2-year warranty.

**Repair Services Section (4 cards):**
- MacBook Air Screen Replacement → /collections/macbook-screen-repair-prices
- MacBook Air Battery Replacement → /collections/macbook-battery-repair-prices
- MacBook Liquid Damage Repair → /collections/macbook-repair-prices
- MacBook Diagnostic → /collections/macbook-diagnostic-prices

**FAQs:**
1. Which MacBook Air models do you repair in London? — We repair all MacBook Air models: 13" and 15", Intel and Apple Silicon (M1, M2, M3). Walk-in at our London centre or use our UK mail-in service.
2. Can you fix a MacBook Air that won't charge? — Yes. Charging failures on MacBook Air are usually caused by a faulty USB-C port, charging IC, or liquid damage. We diagnose and repair at component level — not by replacing the entire board.
3. How long does MacBook Air repair take? — Most standard repairs (screens, batteries) are completed within 24 hours. Logic board and liquid damage repairs typically take 3–5 working days. Express same-day is available for common faults.
4. Do you offer no-fix no-fee on MacBook Air repairs? — Yes. For standard repairs, if we can't fix it, you don't pay. A diagnostic fee applies for logic board assessments where repair isn't possible.
5. Is there a warranty on MacBook Air repairs? — All MacBook Air repairs include a 2-year warranty covering the repaired components and associated workmanship.

---

## Shared Requirements (All Pages)

### Internal Linking
Each page must link to:
- Relevant collection pricing page (above the fold)
- `/pages/macbook-repairs` (hub page — contextual link in body)
- `/collections/macbook-diagnostic-prices` (FAQ or CTA)

### Trust Signals (include on all pages)
- ⭐ 2-year warranty on all repairs
- ✅ No-fix no-fee on standard repairs
- 🔧 Component-level repair (not board swaps)
- 📍 12 Margaret Street, London W1W 8JQ
- ⚡ Express same-day available

### Schema Markup
Inject LocalBusiness JSON-LD in a `custom-liquid` section on each page. Use the schema template from Page 1 above, updating `url` and `description` per page.

---

## Quality Checklist

Before publishing each page:
- [ ] Handle matches the slug exactly (lowercase, hyphens)
- [ ] H1 matches the target keyword exactly
- [ ] SEO title and meta description set via metafields
- [ ] CTA button links to correct collection
- [ ] LocalBusiness JSON-LD present and valid
- [ ] Page published and accessible at `www.icorrect.co.uk/pages/<handle>`
- [ ] Mobile rendering tested (no broken layouts)

---

## Credentials

```bash
source /home/ricky/config/api-keys/.env
# Use: $SHOPIFY_ACCESS_TOKEN
# Store: i-correct-final.myshopify.com
# Live theme ID: 158358438141
```

---

## Notes

- Do NOT modify the existing `/pages/macbook-repairs` page — these are net-new pages
- Build one page fully first, verify it looks right, then replicate the pattern for remaining 5
- The `macbook-videos` section can be reused exactly as-is across all pages (no config needed)
- Once quote module is built by Ferrari, CTAs will be updated to point to it — build with standard collection CTAs for now
