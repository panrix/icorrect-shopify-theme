# Solution Brief — PR #65 — Terra r3

Ricky 2026-09-14 (verbatim): **use working days. should say quote in 1 working day.**

## 1. Root cause

Diagnostic journeys computed `quoteDate` in working days but customer copy promised “24 hours”, so Friday collection showing Monday contradicted the badge.

## 2. Solution

Keep `addWorkingDays()` for diagnostic `quoteDate`. Change customer-facing diagnostic turnaround copy to **“Quote in 1 working day”** (and matching bench/result strings: “1 working day on the bench”, “diagnose within 1 working day”). Do not switch to calendar-day math.

## 3. Adjacent risks

- Liquid-damage *incident* copy (“spilled within 24 hours”) is not turnaround — leave it.
- MacBook landing/FAQ “repairs within 24 hours” is out of this PR unless it is the quote-wizard diagnostic journey.
- Shopify section default + `collection.iphone-12-series.json` `diagnostic_turnaround` + `repair-journey.js` must move together or the badge will still lie.
- Journey tests that assert the old string / Friday→Monday date must be updated, not deleted.

## 4. Done when (2–3 tests Terra can’t ignore)

1. Diagnostic wizard/journey copy in `quote-wizard.liquid` + `repair-journey.js` says “1 working day”, not “Quote in 24 hours” / “24 hours on the bench” / “diagnose within 24 hours”.
2. Friday collection still quotes the next working day (e.g. 2026-09-18 → Monday 2026-09-21) via `addWorkingDays`.
3. Independent journey/wizard tests pass with the new strings + weekend cases.
