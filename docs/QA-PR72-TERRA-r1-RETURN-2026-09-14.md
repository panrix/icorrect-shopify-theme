# QA verdict — PR 72 Terra r1

VERDICT: NEEDS-FIX

The primary shared journey library implements the required London clock and the required test commands pass. However, `quote-wizard.liquid` retains a reachable no-library fallback whose `packShipDate()` uses the browser-local `Date#getHours()`. A customer in Bali at 15:16 local while London is 08:16 will therefore be told that the pack ships Tuesday, recreating the reported defect, if `repair-journey.js` is unavailable. This violates the mission requirement that pack and mail-in clocks never use the browser clock.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Claimed code is an ancestor and scoped theme/script files match it | YES | `git merge-base --is-ancestor fd00f7a02d3697d312c5ea91457290cb55d698a8 HEAD && git diff --quiet fd00f7a02d3697d312c5ea91457290cb55d698a8 -- assets sections snippets scripts` exited 0. |
| 2 | Shared `packShipDate` uses London wall time and cutoff is 15:00 | YES | `assets/repair-journey.js:26-52` derives date/hour with `Intl.DateTimeFormat(... timeZone: 'Europe/London')`; `:24` sets `PACK_CUTOFF_HOUR = 15`; `:85-92` uses it. |
| 3 | Monday 10:00 UK iPhone: pack Mon, UPost Tue, back Thu | YES | `mailinRepairJourney()` uses ship → `addWorkingDays(ship, 1)` → bench → return (`assets/repair-journey.js:155-170`); the required test passed for `2026-09-14` / `15` / `17`. |
| 4 | Monday 15:30 UK ships Tuesday | YES | The required test passed; shared `packShipDate()` rolls forward when London wall hour is `>= 15` (`assets/repair-journey.js:85-92`). |
| 5 | Bali Monday 15:16 still ships Monday UK | YES (shared library) | Required test passed using `2026-09-14T15:16:00+08:00`; London wall time is 08:16 and `assets/repair-journey.js` returns 14 Sep. See P1 for the wizard fallback exception. |
| 6 | Mail-in receive is ship + one working day in library and fallback | YES | Library: `assets/repair-journey.js:157,175`. Wizard fallback: `sections/quote-wizard.liquid:1697-1701` assigns `weReceive = addWorkingDays(ship, 1)` with no extra post day. |
| 7 | B1/B2 Today is London `< 14`; B3/B4 never Today | YES | `assets/courier-slots.js:53-67` reads a London hour; `:87-110` permits Today only for B1/B2 before 14. Required slot tests passed for B1, B2, B3 and B4 cases. |
| 8 | Wizard cart omits mail-in SKU; skips adjustment at ≥£200; retains paid adjustment below £200 | YES | `sections/quote-wizard.liquid:3446-3473` stamps Mail-in on the repair line, does not push `CFG.mailIn.variantId`, and gates adjustment with `!(svcKind === 'mailin' && currentRepairPrice() >= 200)`. Required contract tests passed. |
| 9 | Additional-repair has equivalent ≥£200 mail-in skip and no mail-in SKU | YES | No mail-in SKU push follows the comment at `snippets/additional-repair.liquid:1450-1452`; `:1468-1477` adds an adjustment only when the mail-in repair price is below £200. |
| 10 | Three required test files pass | YES — 27 tests | `node --test scripts/courier/repair-journey.test.js scripts/courier/courier-slots.test.js scripts/courier/mail-in-free-over-200.test.js`: 27 pass, 0 fail. |
| 11 | Complete courier test glob passes | YES — 95 tests | `node --test scripts/courier/*.test.js`: 95 pass, 0 fail. |
| 12 | No new P0/P1 regressions | NO | P1 below: quote-wizard fallback restores the browser-timezone/Bali cutoff bug despite the shared library being correct. |

## P0

None found.

## P1

1. **Quote-wizard fallback silently restores the Bali timezone bug.** `sections/quote-wizard.liquid:1605-1614` falls back when `window.ICorrectRepairJourney` is absent, builds `d` from `new Date()`, and evaluates `n.getHours() >= PACK_CUTOFF_HOUR`. This is explicitly browser-local time, not `Europe/London`. At 2026-09-14 15:16 in Bali, the fallback advances to Tuesday even though London is still 08:16 Monday. The fallback must derive both the calendar date and cutoff hour in `Europe/London`, matching the shared library.

## P2

1. **Coverage omits the no-library fallback.** The green journey tests import `assets/repair-journey.js`; they cannot detect the `quote-wizard.liquid` fallback regression. Add a source/runtime contract for the fallback’s London wall-clock behavior after correcting it.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

- The page normally delegates to `ICorrectRepairJourney`, so ordinary manual testing and all current test cases show the correct London result. The fallback is nevertheless present and chosen whenever the journey asset is unavailable; it claims to provide the same journey but calculates its deadline from the viewer’s local clock.
- The brief’s “never `Date#getHours()` of the browser” requirement is contradicted directly by `n.getHours()` in the fallback. Treating the shared-library result as sufficient would leave an untested production path that repeats Ricky’s reported outcome.
