# Same-day / Fast express Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Offer stock-gated Fast / same-day on the real quote wizard (iPhone £49 same-day, MacBook £79 Fast / £149 same-day), with a 3-slot cap and inner-London cutoffs, then merge via GitHub only after preview QA.

**Architecture:** Pure eligibility + clocks live in theme JS and are unit-tested. The wizard asks a workshop-os eligibility API (via a secret-bearing proxy, never from browser JS). workshop-os is the source of truth for stock and per-date slots; on `orders/paid` it reserves a slot or strips the same-day line. Fail closed: API down → no same-day card.

**Tech Stack:** existing Node `node:test` suite, `assets/repair-journey.js`, `sections/quote-wizard.liquid`, Shopify SKUs, workshop-os `parts` service (Express + SQLite ledger).

**Spec:** `docs/superpowers/specs/2026-09-14-same-day-express-design.md`

## Global Constraints

- Never publish live theme `158358438141`. Preview only: `https://icorrect.co.uk/?preview_theme_id=<id>`.
- Collection day does **not** count as a bench day. iPhone standard = collect today, back tomorrow. MacBook/iPad/diagnostic standard = 3 working days after collection day.
- iPhone: no Fast (£79). Same-day = **£49** new SKU `same-day-iphone`.
- MacBook Fast = existing `turn-around-time-1-working-day` **£79**. Same-day = existing `turn-around-time-fatest-4-hours` **£149** (includes priority courier).
- Same-day only: iPhone or MacBook, courier **B1/B2**, in stock now, &lt; 3 slots that date, Mon–Fri, cutoffs: iPhone B1 12:00 / B2 11:00 / MacBook 11:00 + morning collection.
- Advance: today (if cutoff open) + next 5 working days. Stock must be on the shelf **now**.
- Fail closed. No engineer calendar. No same-day on iPad, Watch, diagnostic, mail-in, B3/B4.
- Extra Gophr cost and bench stress are accepted; the cap + cutoffs + baked price bound it.

---

### Task 1: Standard / Fast / same-day clocks

**Files:**
- Modify: `assets/repair-journey.js`
- Modify: `scripts/courier/repair-journey.test.js`
- Test: `scripts/courier/repair-journey.test.js`

**Interfaces:**
- Consumes: existing `addWorkingDays(fromDate, n)`, `londonWall(now)`
- Produces: `repairBenchDays(device, opts)` where `opts.speed` is `'standard' | 'fast' | 'same_day'` and `opts.diagnostic` is boolean. Same-day bench = `0` (return date = collect date). Fast bench = `1`. Standard: iphone `1`, macbook/ipad `3`, watch `3`, diagnostic `3`. `courierRepairJourney(device, collectDate, opts)` and `mailinRepairJourney(device, now, opts)` honour `opts.speed`.

- [ ] **Step 1: Rewrite the failing clock tests**

In `scripts/courier/repair-journey.test.js` replace the `repairBenchDays` suite and Monday collection assertions with:

```javascript
describe('repairBenchDays', () => {
  it('standard: iphone 1, macbook/ipad/diagnostic 3, watch 3', () => {
    assert.equal(J.repairBenchDays('iphone'), 1);
    assert.equal(J.repairBenchDays('macbook'), 3);
    assert.equal(J.repairBenchDays('ipad'), 3);
    assert.equal(J.repairBenchDays('watch'), 3);
    assert.equal(J.repairBenchDays('macbook', { diagnostic: true }), 3);
  });

  it('fast is 1 working day; same_day is 0 (back the collect day)', () => {
    assert.equal(J.repairBenchDays('macbook', { speed: 'fast' }), 1);
    assert.equal(J.repairBenchDays('iphone', { speed: 'same_day' }), 0);
    assert.equal(J.repairBenchDays('macbook', { speed: 'same_day' }), 0);
  });
});

describe('courier clocks from Monday collection', () => {
  const collect = new Date(2026, 8, 14); // Mon 14 Sep 2026

  it('iphone standard back Tuesday; macbook standard back Thursday', () => {
    assert.equal(iso(J.courierRepairJourney('iphone', collect).returnDate), '2026-09-15');
    assert.equal(iso(J.courierRepairJourney('macbook', collect).returnDate), '2026-09-17');
  });

  it('same-day return equals collect date', () => {
    const j = J.courierRepairJourney('iphone', collect, { speed: 'same_day' });
    assert.equal(iso(j.returnDate), '2026-09-14');
  });

  it('macbook fast back Tuesday', () => {
    const j = J.courierRepairJourney('macbook', collect, { speed: 'fast' });
    assert.equal(iso(j.returnDate), '2026-09-15');
  });

  it('diagnostic quotes Thursday (3 working days) and does not return', () => {
    const j = J.courierDiagnosticJourney(collect);
    assert.equal(iso(j.quoteDate), '2026-09-17');
    assert.equal(j.returnDate, null);
    assert.equal(J.turnaroundClaimLabel('macbook', { diagnostic: true }), 'Quote in 3 working days');
  });
});
```

Update the mail-in iPhone return assertion: receive Tue + 1 bench day + 1 return day = Thu 2026-09-17 still holds for iPhone standard. MacBook mail-in standard becomes receive + 3 + 1. Fix any other assertions in that file that assume macbook bench = 2 or diagnostic = 1.

- [ ] **Step 2: Run tests — expect FAIL**

Run: `node --test scripts/courier/repair-journey.test.js`  
Expected: FAIL on macbook = 2 / diagnostic = 1.

- [ ] **Step 3: Minimal clock implementation**

In `assets/repair-journey.js` change `repairBenchDays` to:

```javascript
function repairBenchDays(device, opts) {
  opts = opts || {};
  if (opts.speed === 'same_day') return 0;
  if (opts.speed === 'fast') return 1;
  if (opts.diagnostic) return 3;
  if (device === 'iphone') return 1;
  if (device === 'watch') return 3;
  return 3; // macbook / ipad
}
```

Thread `opts` through `courierRepairJourney`, `mailinRepairJourney`, `turnaroundClaimLabel`. For `same_day`, `returnDate = startOfDay(collectDate)` (do not call `addWorkingDays` with 0 in a way that advances). Diagnostic quote date = `addWorkingDays(collectDate, 3)` / mail-in `addWorkingDays(weReceive, 3)`. Labels: diagnostic `'Quote in 3 working days'`; same-day `'Same day'`; fast `'1 working day'`.

- [ ] **Step 4: Run tests — expect PASS**

Run: `node --test scripts/courier/repair-journey.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/repair-journey.js scripts/courier/repair-journey.test.js
git commit -m "fix: standard clocks — MacBook/iPad/diagnostic 3WD; same-day back on collect day"
```

---

### Task 2: Pure same-day eligibility (no network)

**Files:**
- Create: `assets/same-day-eligibility.js`
- Create: `scripts/courier/same-day-eligibility.test.js`

**Interfaces:**
- Consumes: `londonWall`-equivalent `now` Date, band string, device, speed intent
- Produces:

```javascript
// assets/same-day-eligibility.js
function londonHour(now) { /* Europe/London wall hour, same pattern as repair-journey.js */ }
function isWorkingDay(d) { /* Mon–Fri */ }
function nextWorkingDays(fromDate, n) { /* array of Date, length n, skipping weekends */ }
function sameDayCutoffHour(device, band) {
  // iphone + B1 → 12; iphone + B2 → 11; macbook + B1|B2 → 11; else null
}
function todayEligible(opts) {
  // opts: { device, band, service, diagnostic, inStock, slotsRemaining, now, collectionWindow }
  // returns { ok: boolean, reason: string }
}
function dateOptions(opts) {
  // returns [{ iso, slotsRemaining, available }] for today + 5 WD
}
```

Rules (copy exactly):

- `todayEligible` false if `diagnostic`, device not `iphone`|`macbook`, `service !== 'courier'`, band not `B1`|`B2`, `inStock !== true`, `slotsRemaining < 1`, weekend, or `londonHour(now) >= sameDayCutoffHour(device, band)` when the date is today.
- MacBook: `collectionWindow` must be `'morning'` (string). Afternoon → false.
- `dateOptions`: include today only if `todayEligible` would pass cutoff (stock/slots still passed in per date). Future dates ignore today's clock cutoff.

- [ ] **Step 1: Write the failing tests**

Create `scripts/courier/same-day-eligibility.test.js`:

```javascript
'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../../assets/same-day-eligibility.js');

function bst(y, m, d, h, min) {
  return new Date(Date.UTC(y, m, d, h - 1, min || 0, 0));
}

const base = {
  device: 'iphone',
  band: 'B1',
  service: 'courier',
  diagnostic: false,
  inStock: true,
  slotsRemaining: 3,
  collectionWindow: 'morning',
  now: bst(2026, 8, 14, 10, 0) // Mon 10:00 UK
};

describe('todayEligible', () => {
  it('iphone B1 at 10:00 ok; at 12:00 no', () => {
    assert.equal(E.todayEligible(base).ok, true);
    assert.equal(E.todayEligible(Object.assign({}, base, { now: bst(2026, 8, 14, 12, 0) })).ok, false);
  });
  it('iphone B2 at 11:00 no', () => {
    assert.equal(E.todayEligible(Object.assign({}, base, { band: 'B2', now: bst(2026, 8, 14, 11, 0) })).ok, false);
  });
  it('macbook afternoon window no', () => {
    assert.equal(E.todayEligible(Object.assign({}, base, { device: 'macbook', collectionWindow: 'afternoon' })).ok, false);
  });
  it('B3 / mail-in / ipad / diagnostic / no stock / 0 slots all no', () => {
    ['band', 'service', 'device', 'diagnostic', 'inStock', 'slotsRemaining'].forEach(() => {});
    assert.equal(E.todayEligible(Object.assign({}, base, { band: 'B3' })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { service: 'mail-in' })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { device: 'ipad' })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { diagnostic: true })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { inStock: false })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { slotsRemaining: 0 })).ok, false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module` or `todayEligible` missing)

Run: `node --test scripts/courier/same-day-eligibility.test.js`

- [ ] **Step 3: Implement `assets/same-day-eligibility.js`**

UMD wrapper matching `repair-journey.js` (`module.exports` + `root.ICorrectSameDay`). Implement the functions above with Europe/London `Intl.DateTimeFormat` hour (copy `londonWall` from `repair-journey.js` — do not import ESM; duplicate the 15-line helper to stay browser-safe).

- [ ] **Step 4: Run — expect PASS**

Run: `node --test scripts/courier/same-day-eligibility.test.js`

- [ ] **Step 5: Commit**

```bash
git add assets/same-day-eligibility.js scripts/courier/same-day-eligibility.test.js
git commit -m "feat: same-day eligibility rules (B1/B2, cutoffs, 3-slot, stock flag)"
```

---

### Task 3: Speed cards in the quote wizard

**Files:**
- Modify: `sections/quote-wizard.liquid` (speed cards + date picker; replace/extend `buildTurnaroundCards`)
- Modify: `layout/theme.liquid` or the wizard section’s script tags to load `same-day-eligibility.js` before the wizard IIFE
- Modify: `assets/quote-wizard.css` (slot subline + date chips only; match existing `.qw-opt-card`)
- Test: `scripts/courier/same-day-eligibility.test.js` (already green) + manual preview later

**Interfaces:**
- Consumes: `ICorrectSameDay.todayEligible`, `dateOptions`; courier quote `{ band, service }`; `S.device`; stock/slots from a `window.__sameDayEligibility` stub in this task (`{ inStock: false, dates: {} }` default → card hidden)
- Produces: selected `{ speed: 'standard'|'fast'|'same_day', dateIso, variantId, price }`; cart adds Fast / same-day variant when selected

Shopify variant IDs (resolve at implement time via Admin if they drift):

- Fast: product handle `turn-around-time-1-working-day` (expected variant price 79)
- MacBook same-day: handle `turn-around-time-fatest-4-hours` (149) — publish if still draft
- iPhone same-day: create handle `same-day-iphone` at £49 (Ricky / Admin) then paste variant id into Liquid settings

- [ ] **Step 1: Add section settings for the three variant IDs**

In `sections/quote-wizard.liquid` schema, add number settings `fast_variant_id`, `iphone_sameday_variant_id`, `macbook_sameday_variant_id` (default 0). Read them into `window.__sameDayConfig`.

- [ ] **Step 2: Load the eligibility script**

Next to the existing courier script tags (~line 107):

```liquid
<script src="{{ 'same-day-eligibility.js' | asset_url }}" defer></script>
```

- [ ] **Step 3: Replace `buildTurnaroundCards`**

Render:

- iPhone + courier B1/B2 + stub/API eligible: Standard + Same-day (£49). Never Fast.
- MacBook + courier B1/B2 + eligible: Standard + Fast (£79) + Same-day (£149).
- MacBook/iPad/diagnostic mail-in or B3/B4: Standard + Fast only.
- iPhone mail-in / B3/B4: Standard only.
- Same-day card omitted when `todayEligible` / selected date `available` is false (including stub `inStock: false`).

Date chips: `dateOptions` for same-day; selected date stored on `S.sameDayDate`. Copy exactly from the spec (“We collect [date]. We repair the next working day…” / “Collect and back the same day.” / “N slots left”).

Checkout path that already reads `.qw-opt-card.sel[data-opt="speed"]` must keep working: `data-add`, `data-vid`, `data-speed`, `data-date`.

- [ ] **Step 4: CSS**

Add `.qw-slot-left` (12px, grey) and `.qw-date-chip` using existing `--qw` tokens. No new font, no prototype HTML.

- [ ] **Step 5: Commit**

```bash
git add sections/quote-wizard.liquid assets/quote-wizard.css layout/theme.liquid
git commit -m "feat: quote wizard Fast / same-day cards with date chips"
```

---

### Task 4: FAQ / schema clocks (diagnostic 3WD, iPhone 1WD)

**Files:**
- Modify: `scripts/courier/faq-clock-copy.test.js` (diagnostic contract → 3 working days)
- Modify: homepage + device FAQ JSON that still say “diagnose within 1 working day” or MacBook “2 working days” as standard — only the blocks this test already lists, plus `assets/repair-journey.js` labels already done
- Test: `scripts/courier/faq-clock-copy.test.js`, `scripts/courier/quote-wizard-repair-stamp.liquid.test.js`

**Interfaces:**
- Consumes: Task 1 labels
- Produces: customer-visible diagnostic copy = 3 working days; iPhone standard remains 1 working day after collection

- [ ] **Step 1: Point the FAQ contract at 3WD diagnostic**

In `faq-clock-copy.test.js` change `ONE_DAY` to `/diagnose within 3 working days/` (or the exact phrase you put in the homepage FAQ). Update the file header comment. Keep `STALE` banned phrases.

- [ ] **Step 2: Run — expect FAIL** on homepage / schema files

Run: `node --test scripts/courier/faq-clock-copy.test.js`

- [ ] **Step 3: Update only the listed sources** in that test (`templates/index.json`, `snippets/icorrect-faq-page-schema.liquid`, and any other files the test names) so diagnostic = 3 working days and device-stays copy remains. Do not rewrite walk-in-era “4 hours” marketing on old collection templates in this task (out of scope except where the test fails).

- [ ] **Step 4: Fix `quote-wizard-repair-stamp.liquid.test.js`** if it still asserts “Quote in 1 working day” for diagnostic.

- [ ] **Step 5: Run full courier suite**

Run: `npm test`  
Expected: all  existing + new tests PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/courier/faq-clock-copy.test.js snippets/icorrect-faq-page-schema.liquid templates/index.json sections/quote-wizard.liquid scripts/courier/quote-wizard-repair-stamp.liquid.test.js
git commit -m "fix: diagnostic standard clock copy is 3 working days"
```

---

### Task 5: workshop-os eligibility + slot store

**Files (repo `panrix/workshop-os`):**
- Create: `parts/src/same-day-slots.js`
- Create: `parts/src/same-day-http.js`
- Create: `parts/test/same-day-slots.test.js`
- Modify: `parts/src/index.js` — register `GET /same-day/eligibility` and `POST /same-day/reserve` behind existing `webhookAuth`
- Create: `parts/migrations/008_same_day_slots.sql`

**Interfaces:**
- Consumes: `getPartsAvailabilityByIds` / product→parts map already used by `stock-check.js`; Shopify handle → Monday product id (existing catalogue map or handle column — look up in `parts/src` before inventing a second map)
- Produces:

```javascript
// same-day-slots.js
function slotsRemaining(db, isoDate) { /* integer, default 3 */ }
function reserveSlot(db, isoDate, orderId) { /* { ok, slotsRemaining } atomic; ok false if 0 */ }

// same-day-http.js
// GET /same-day/eligibility?handle=&date=&outward=
// → { eligible, in_stock, slots_remaining, cutoff_ok, band, device, price_pence }
// POST /same-day/reserve  { orderId, date, handle }
// → { ok, slots_remaining } 
```

`price_pence`: iphone same-day `4900`, macbook same-day `14900`. Band from the same outward table as the theme (`B1`/`B2` only eligible). `in_stock` = ledger `available >= 1`. `eligible` = stock && slots && band && device in iphone|macbook.

- [ ] **Step 1: Failing slot tests** in `parts/test/same-day-slots.test.js` (use the parts repo’s existing test runner). Assert default 3, fourth `reserveSlot` returns `ok: false`, two dates independent.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Migration + implementation.** Table `same_day_slots (date TEXT PRIMARY KEY, remaining INTEGER NOT NULL, updated_at TEXT)`. `reserveSlot` in a transaction: insert default 3 if missing, decrement if remaining &gt; 0.

- [ ] **Step 4: HTTP handlers** with `webhookAuth`. No CORS from `icorrect.co.uk` to this service directly.

- [ ] **Step 5: Tests PASS + commit on workshop-os**

```bash
git commit -m "feat: same-day eligibility GET + slot reserve (cap 3)"
```

---

### Task 6: Theme proxy + wire eligibility

**Files:**
- Create: `scripts/same-day-proxy.md` only if you cannot add a Shopify app proxy — prefer a 20-line Cloudflare/worker or existing workshop ingress already used by the theme. If the theme already posts quote events to a hub URL, **reuse that origin** with a new path `/same-day/eligibility` rather than a new host.
- Modify: `sections/quote-wizard.liquid` — replace `window.__sameDayEligibility` stub with `fetch(proxyUrl + query)` after postcode resolve. On HTTP error / timeout (1.5s): treat as `inStock: false` (hide same-day).
- Never put the workshop secret in Liquid or JS.

**Interfaces:**
- Consumes: Task 5 JSON
- Produces: live `inStock`, `slotsRemaining` per date for Task 3 cards

- [ ] **Step 1: Confirm hub/proxy URL** from existing wizard quote-event posts in `sections/quote-wizard.liquid` (search `wizard_` / hub). Add `sameDayEligibilityUrl` next to it.

- [ ] **Step 2: Fetch helper**

```javascript
async function fetchSameDayEligibility(handle, isoDate, outward) {
  try {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 1500);
    var res = await fetch(url + '?handle=' + encodeURIComponent(handle) + '&date=' + isoDate + '&outward=' + encodeURIComponent(outward), { signal: ctrl.signal, credentials: 'omit' });
    clearTimeout(t);
    if (!res.ok) return { inStock: false, slotsRemaining: 0 };
    var j = await res.json();
    return { inStock: !!j.in_stock, slotsRemaining: j.slots_remaining | 0, eligible: !!j.eligible };
  } catch (e) {
    return { inStock: false, slotsRemaining: 0 };
  }
}
```

- [ ] **Step 3: On paid order**, ensure workshop-os already receives `orders/paid` (courier webhook). Add `same-day/reserve` call there when line items include `same-day-iphone` or `turn-around-time-fatest-4-hours`. If `ok === false`, remove/refund that line and Slack `SAME-DAY RESERVE FAILED`.

- [ ] **Step 4: Commit theme + workshop-os separately**

```bash
git commit -m "feat: wire same-day eligibility proxy; fail closed on timeout"
```

---

### Task 7: Preview QA + GitHub live

**Files:**
- Create: `docs/QA-PR-same-day-express.md` (existing QA-PR style)
- Preview theme only (env scripts already load VPS Shopify token)

**Matrix (must all be run on `https://icorrect.co.uk/?preview_theme_id=…`):**

1. iPhone B1 (e.g. W1) at 10:00 mock — same-day £49 visible, 3 left.
2. iPhone B1 after 12:00 — today hidden, next WD offered.
3. iPhone B2 after 11:00 — today hidden.
4. MacBook afternoon slot — same-day hidden; morning — shown at £149.
5. B3 / mail-in — no same-day; MacBook Fast £79 still there.
6. Force `in_stock: false` — no same-day card.
7. Reserve 3 on a date — fourth browse hides same-day.
8. API stop — no same-day card; standard checkout still works.
9. Copy: iPhone “collect today, back tomorrow” vs “collect and back today”.

- [ ] **Step 1:** `npm test` green.
- [ ] **Step 2:** `eval "$(./scripts/load-shopify-env-from-vps.sh)" && npx shopify theme push --unpublished --json -t "STAGING — same-day express"`
- [ ] **Step 3:** Walk the matrix. Write `docs/QA-PR-same-day-express.md`.
- [ ] **Step 4:** Only when QA is green: merge PR to `main`. Do not `theme push --live`.

---

### Task 8: Shopify admin (Ricky / implementer, not in git)

- Publish `turn-around-time-fatest-4-hours` (£149). Customer title: “Same-day repair (collect & return today)”.
- Create `same-day-iphone` at £49.
- Paste variant IDs into the quote-wizard section settings on the **preview** theme, then again on live after merge.
- Do not attach Fast metafields to iPhone products.

---

## Spec coverage

| Spec item | Task |
| --- | --- |
| Clocks (1WD iPhone, 3WD MacBook/iPad/diag, same-day = collect day) | 1, 4 |
| Eligibility B1/B2, cutoffs, morning MacBook, 3 slots | 2, 5 |
| Speed cards + advance 5 WD | 3 |
| £49 / £79 / £149 SKUs | 3, 8 |
| Live stock + reserve | 5, 6 |
| Fail closed | 6 |
| Preview → QA → GitHub live | 7 |
| Priority Gophr / Slack SAME-DAY if auto flag missing | 6 (Slack), ops note in spec |
| No calendar / no Watch / no iPad same-day | 2 |
