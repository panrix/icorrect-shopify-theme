# High-value convert (thin slice) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. This session implements inline.

**Goal:** On the unpublished preview, high-value diagnostics lead with “we can collect it today,” optional 24h word-back behind a Safan dial, Apple/data/serial on the same card, and B1 collection eaten. In-stock MacBook Pro screens get tomorrow included. Do not publish the live theme.

**Architecture:** New `assets/quote-high-value.js` holds detect + copy + HTML so `quote-wizard.liquid` stays under Shopify’s 256 KB section cap. Wizard calls `evaluate()` and `laneAIntroHtml()`. Courier eat uses the existing `courier:free` tag hook. Safan dial is a theme checkbox, not a live Monday count.

**Tech Stack:** Theme JS (UMD like `quote-lead-checkout.js`), `node --test`, unpublished `theme push`.

## Global Constraints

- Never `theme push --live` / never publish `158358438141`.
- Do not change live H1 / title / meta / nav.
- Do not revert Ferrari catalogue prices.
- `sections/quote-wizard.liquid` must stay under 256 KB.
- Battery / cheap screen path unchanged.
- Same-day *repair* stays off for diagnostics.

---

### Task 1: High-value detect + copy module

**Files:**
- Create: `assets/quote-high-value.js`
- Test: `scripts/courier/quote-high-value.test.js`

- [x] Write tests then module (`evaluate`, lane A/B, eatCollect B1-only, Safan 24h dial).
- [x] Commit

### Task 2: Wire wizard (diagnostic card, eat collect, clocks)

**Files:**
- Modify: `sections/quote-wizard.liquid` (script tag, setting, small hooks only)
- Modify: `assets/repair-journey.js` (`diag24h`, `includedFast`)
- Modify: `assets/quote-wizard.css`
- Modify: `assets/quote-lead-checkout.js` (prequal on intake payload)

- [x] Tests for liquid hooks + journey days
- [x] Implement
- [ ] `npm test`
- [ ] Commit

### Task 3: Unpublished preview (not live)

- [ ] `theme push --unpublished` to a new STAGING name
- [ ] QA on `?preview_theme_id=`
