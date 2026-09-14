# Same-day / Fast express — design

Date: 2026-09-14  
Repos: `panrix/icorrect-shopify-theme` (wizard, clocks, copy) + `panrix/workshop-os` (stock read + slot reserve)  
Status: draft for Ricky review — do not implement until approved

## Goal

Sell **time**, not a cheaper repair. Walk-ins are paused; courier has to convert. Standard clocks stay honest and queueable. Paid speed is scarce: inner London, part on the shelf, three same-day slots per date, bookable today or in advance.

This ships **before AdWords**. No engineer-calendar module in v1.

## Locked decisions

### Standard clocks (collection day does **not** count)

| Job | Standard (included) | Meaning |
| --- | --- | --- |
| iPhone known repair | 1 working day | Collect today. Repair tomorrow. Back tomorrow. |
| MacBook / iPad known repair | 3 working days | Collect today. Bench starts next working day. |
| Diagnostic | 3 working days | Collect/receive, then diagnose. Device stays until they approve a repair. |
| Watch | unchanged (3 days, adhesive) | No same-day. Fast optional later — **out of v1**. |

Live theme comments that call collection day “day 1” are wrong relative to this spec. Copy and `repair-journey.js` must match the table.

### Paid speed

| Device | Fast — 1 working day | Same-day (Fastest) |
| --- | --- | --- |
| iPhone | **Not offered** (same clock as standard) | **£49** — new SKU. Bench &lt; 1 hour. Collect + return that day. |
| MacBook | **£79** — existing `turn-around-time-1-working-day` | **£149** — existing `turn-around-time-fatest-4-hours` (publish; rename customer copy to same-day). Price **includes** priority collect + return. |
| iPad / diagnostic | **£79** (same Fast SKU) | **Not offered** |
| Watch | not in v1 | not in v1 |

One customer-facing price per card. Do not show a separate courier surcharge.

### Same-day eligibility (all must be true)

1. Device is **iPhone or MacBook** (known repair, not diagnostic).
2. Service is **London courier**, band **B1 or B2** (existing `courier-london-bands.json`). B3/B4 and mail-in never see same-day.
3. workshop-os parts ledger: **available ≥ 1** for the linked part(s) of this Shopify product **now**.
4. That **calendar date** has **&lt; 3** same-day reservations (iPhone + MacBook share the cap).
5. Cutoff (Europe/London, working days Mon–Fri only):

| Device | Band | Book-by if the date is **today** | Collection window |
| --- | --- | --- | --- |
| iPhone | B1 | 12:00 | same-day window |
| iPhone | B2 | 11:00 | same-day window |
| MacBook | B1 or B2 | 11:00 | **morning only** |

After today’s cutoff, **today** is not offered. Future working days still are.

### Advance booking

Same-day is a **date**, not only “right now”.

- Picker: **today** (if cutoff still open) plus the next **5 working days**.
- Each date has its own 3-slot count (“Thu · 2 left”).
- Stock is **on the shelf now**. We do not sell a future same-day against a part that might arrive later.
- Booking a future date consumes one slot **on that date**.

### Slot cap

- **3 same-day jobs per date**, all devices together.
- When 0, the same-day card is **hidden** (not struck-through / still clickable).
- Raising the cap later is one workshop-os number. No calendar engine in v1.

## Customer UI

Quote screen, after postcode is known (existing courier step).

**iPhone + B1/B2 + in stock + slots left**

- Card **Standard** — included. Copy: “We collect [date]. We repair the next working day and return it that afternoon.”
- Card **Same-day** — +£49. Copy: “Collect and back the same day.” Default date = today if eligible, else next working day. Subline: “N slots left” for the selected date. Control: “Book a day ahead” → date list with per-day remaining.

**MacBook + B1/B2 + in stock**

- **Standard** — 3 working days, included.
- **Fast** — +£79, 1 working day (mail-in or courier).
- **Same-day** — +£149, morning collection, same date/slot picker.

**Mail-in, B3, B4, iPad, diagnostic**

- No same-day card.
- MacBook/iPad/diagnostic still offer Fast +£79 (clock becomes 1 working day after the device is with us / after collection day).
- iPhone mail-in: standard only (1 working day after arrival).

**Stock or API fail:** same-day card not rendered. Standard / Fast still work.

Do not use `prototype-quote-flow.html` / `icorrect-quote-wizard-final.html` as the live module. Those files are the **visual reference** for Standard / Fast / Fastest cards only.

## Systems

### Theme (`icorrect-shopify-theme`)

- Quote wizard service/result step: speed cards + date picker + slot copy.
- `repair-journey.js`: iPhone 1 WD after collection day; MacBook/iPad/diagnostic 3 WD after collection day; Fast = 1 WD after collection/arrival; same-day = 0 extra bench days (collect date = return date).
- Checkout: add the correct variant (iPhone £49 SKU or MacBook Fastest £149 or Fast £79).
- Funnel events: `same_day` / `fast`, date, band, `slots_remaining` (hub allowlist update in workshop-os if required).
- Tests: eligibility matrix, cutoffs, clocks, hidden card when ineligible.

### workshop-os

There is **no** public stock URL today. Stock-check is Monday/job webhooks + ledger. Add:

`GET /same-day/eligibility?handle=&date=&outward=` (auth: existing workshop shared secret, called from a **theme app proxy or small theme-side function** — never expose the secret in browser JS).

Response (shape):

```json
{
  "eligible": true,
  "in_stock": true,
  "slots_remaining": 2,
  "cutoff_ok": true,
  "band": "B1",
  "device": "iphone",
  "price_pence": 4900
}
```

`POST /same-day/reserve` on `orders/paid` (or checkout complete) with order id + date + handle. Atomically decrement that date’s slot if `slots_remaining > 0` and `in_stock`. If reserve fails: keep the repair order, **do not** keep the same-day line (remove/refund Fastest). Fail closed.

Slot store: one row per date, integer remaining, default 3. Not an engineer roster.

Priority Gophr both legs for same-day orders is an **ops follow-up** on the existing courier draft webhook (higher Gophr priority). If that flag is not ready on day one, Slack `#courier-bookings` must show **SAME-DAY** so staff book the fast legs by hand. Website still ships.

### Shopify admin

- Keep `turn-around-time-1-working-day` at £79 (Fast).
- Publish / retitle customer name of `turn-around-time-fatest-4-hours` to same-day / collect & return today at £149 (MacBook).
- Create **iPhone same-day** product at £49 (new handle, e.g. `same-day-iphone`). Do not reuse the £149 SKU.
- Do not attach Fast metafields on iPhone products.

## Out of scope (v1)

- Engineer repair calendar / per-technician slots.
- Watch Fast / same-day.
- iPad same-day.
- Selling same-day when the part is on order.
- Live Gophr quote in the browser.
- Changing B3/B4 or mail-in into same-day.
- Walk-in return.

## Test / QA gate (before merge to live)

1. `npm test` and `npm run theme:check` green.
2. Preview theme (`https://icorrect.co.uk/?preview_theme_id=…`), never live push.
3. Matrix: iPhone B1 before/after 12:00; iPhone B2 before/after 11:00; MacBook morning vs afternoon; B3; mail-in; out of stock; 3 slots then 4th hidden; advance date with its own count; API down → no same-day card.
4. `docs/QA-PR…` note. Merge to `main` via GitHub only when QA is green.

## Success

Same-day cards appear only when we can actually do it. People can book ahead. iPhone £49 / MacBook £149 look like a bargain for time-conscious customers. Standard queues still fill. AdWords can send traffic at this promise without inventing walk-in capacity.
