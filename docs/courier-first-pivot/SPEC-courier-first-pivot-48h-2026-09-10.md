# BUILD SPEC — Courier-first pivot, 48-hour ship

_Date: 2026-09-10 · Initiative: **courier-first-pivot** · Code repo: `panrix/icorrect-shopify-theme` (+ small webhook receiver in `panrix/workshop-os`) · Requested by: Ricky, 2026-09-10 02:47 UTC_

**Goal:** by the weekend, icorrect.co.uk offers no walk-in service. London customers get courier collection with transparent tiered pricing; everyone else gets mail-in; the few who insist on coming in person get a booked drop-off slot.

**Explicitly OUT OF SCOPE:** live Gophr quoting in the browser, real capacity/slot API (D-09 system), payment-link-at-intake, trade-in module (parked by Ricky 2026-09-10), new website build, national DHL journey (copy mention only), warehouse move.

**RULING 2026-09-11 08:53 UTC (Ricky): PURE collection & delivery.** No drop-off at all — no booked slots, no walk-in, no exceptions on the website. The wizard offers exactly two paths: London courier collection or free mail-in pack. UI reference = Ricky's May prototype (`panrix/workshop-os` courier-quote-lab 2026-05-23, ServiceMapper.jsx) with the `walkin` branch deleted — NOT the orchestrator mockups (superseded). Ops note: reception iPad flow (PR #405, drop-off-only) now contradicts the door policy — walk-ups must be redirected to "book a collection"; separate workshop-os change, not this repo.

---

## 1. End-to-end flow (the map)

```
Customer lands on site
  → Quote wizard: device → model → fault → price
  → Service choice:
      [Courier collection — London]   ← postcode field appears
      [Mail-in — free pack posted]    ← national, unchanged
      [Booked drop-off — limited slots] ← existing date/time picker, capped
  → Courier path: postcode → static band → tier (product tag) → price shown
      + collection window copy ("book by 2pm → collect today")
  → Checkout (Shopify, existing)
  → Order paid webhook → workshop-os receiver
      → creates Gophr DRAFT job (is_confirmed=0) for collection leg
      → posts to Slack #courier-bookings for staff review
      → staff confirm (one click / reply) → Gophr job confirmed
      → customer gets tracking link (v0: Gophr public tracking, branded email/page wrapper)
  → Device arrives → existing mail-in intake path (parcel matched to booking)
  → Repair → QC → return leg (same flow, reversed)
```

**Why draft-first booking:** the April Gophr discovery confirmed `is_confirmed=0` draft jobs; draft-first means a mis-booked job never dispatches a rider. Auto-confirm can come later once the window fields are proven.

## 2. Components

### A. Static postcode band table (theme asset)
- **DONE 2026-09-10:** full London coverage refreshed live (396/396 quotes, W1 origin, economy + tight-evening windows). Band table: `marketing/shopify-theme/data/gophr-london-bands-2026-09-10.json` (+ `.csv`) — 99 outward codes: **B1 (38 codes, RT £17–24) · B2 (25, £24–32) · B3 (19, £32–42) · B4 (17, £45–66)**; beyond coverage → mail-in offer.
- Theme asset = outward code → band lookup JSON generated from that file. Customer-facing band prices set from RT cost × tier modifier (Ricky confirms final £ at plan sign-off).

### B. Tier logic via product tags
- Tag each repair product: `courier:free` / `courier:subsidised` / `courier:full`.
- Wizard maths: `customer_price = band_price × tier_modifier` (free=0, subsidised≈0.5, full=1).
- Tier assignment follows Ricky's ruling: high-value repairs + silicon-level diagnostics = free; mid = subsidised; low-margin (iPhone battery class) = full. **This explicitly overrules parked ruling D-08** (no subsidy until margin evidence) — Ricky ruled 2026-09-10.

### C. Quote wizard changes (`sections/quote-wizard.liquid`) — v2 per PURE C&D ruling
- **Remove walk-in entirely** (4 zones: product config L92–101, service card + picker panel L1072–1108, picker wiring L1109–1160, cart branch L1912–1960).
- Service step = Ricky's May prototype design (ServiceMapper.jsx) ported to Liquid: courier (postcode → band × tier price + window copy) or mail-in. No third option.
- Same change in `snippets/additional-repair.liquid` (product-page booker).

### D. Walk-in retraction copy sweep
- Scripted pass over ~78 collection JSON templates + `templates/index.json`, `sections/our-services.liquid`, `repair-services.liquid`, `icorrect-landing.liquid`, `homepage-faqs.liquid`.
- FAQ + LocalBusiness JSON-LD schema updates (`snippets/icorrect-faq-page-schema.liquid`) — SEO-sensitive.
- Retire `walk-in-service` Shopify product (or repurpose as the booked-drop-off placeholder).
- Cart blackout-date guards for walk-in removed/repointed.

### E. Order→Gophr draft booking webhook (workshop-os)
- New small receiver (intake-hub sibling): Shopify `orders/paid` webhook → if courier line item → build `POST /jobs` draft (pickup = customer, dropoff = 12 Margaret St) → Slack review card → confirm action.
- **Must fix the midnight bug first:** April discovery found `pickup_window_start/end` + `dropoff_window_start/end` are accepted but appear IGNORED by `/quotes`; the real deadline/window field was never identified. Build task: probe live API (docs + test drafts) until a draft job shows the correct collection window in the Gophr dashboard — NOT "deliver by midnight". Done-when: screenshot of Gophr dashboard showing correct window on a test draft, then cancel the draft.
- Gophr key: env reference only (`GOPHR_API_KEY`), never in source. Production key (sandbox 401s — confirmed April).

### F. Tracking v0 (48h) and v1 (later)
- v0: customer email/SMS contains Gophr public tracking URL (`app.gophr.com/tracking/...`) wrapped in iCorrect-branded order-status messaging. Cheap, ships Friday.
- v1 (NOT this week): branded tracking page on our domain polling job status — this is the design work Ricky wants to spend time on. Needs Gophr job-status polling + UI design. Separate slice after launch.

## 3. Workstream split (parallel)

| Stream | What | Est. |
|---|---|---|
| W1 — theme logic | A + B + C | 1 builder-day |
| W2 — copy sweep | D, scripted + eyeball QA | 0.5 day |
| W3 — booking webhook | E incl. window-field probe | 1 day (probe is the risk) |
| W4 — non-code (Ricky/Ferrari) | GBP hours/"no walk-ins", Intercom/Alex macros, phone script, reception signage | parallel |

QA gate: Terra on the PR(s) per standard; live-check = place real test order on staging theme, verify band price, tier price, slot cap, draft job in Gophr dashboard with correct window.

## 4. Risks / honest flags

1. **W3 window probe is the only real schedule risk.** If the window field can't be found Friday, ship W1+W2 anyway and run bookings manually from Slack cards for the first week (booking link pre-fills Gophr web UI). The website pivot does not depend on auto-booking.
2. **Ops load shifts, doesn't vanish.** Box-opening/receiving admin grows (Ricky acknowledged — Royal Mail/mail-in receiving process is a follow-up system build).
3. **Stale Gophr prices** — May matrix must be spot-checked Friday morning or band prices may be under water.
4. **Weekend timing** — shipping Friday evening means the first real courier bookings land when staffing is thinnest. Soft-launch option: live site, no ad push until Monday.

## 5. Done-when (this initiative)

- No walk-in offer anywhere on the live theme (grep-clean + visual pass on top 10 pages).
- Postcode → correct band price for 5 test postcodes across bands.
- Tier tag flips price correctly on 3 test products (free/subsidised/full).
- Booked drop-off shows capped slots; walk-in product retired.
- Test order → Gophr draft with correct window → Slack card → confirm → tracking link received.
- GBP + macros + phone script updated (Ricky/Ferrari confirm).
