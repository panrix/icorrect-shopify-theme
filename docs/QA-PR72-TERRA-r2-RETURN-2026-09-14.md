# QA verdict — PR 72 Terra r2

VERDICT: SHIP

The r1 fallback defect is closed. The reachable `quote-wizard.liquid` no-library path now derives both the UK calendar day and cutoff from `Europe/London`; it no longer reads the browser-local hour. The claimed source contract is present and passes. I also executed the exact fallback code extracted from the section under four browser-local timezones; Bali 15:16 / London 08:16 ships on Monday, the 15:00 London boundary ships Tuesday, and Sunday advances to Monday in every case.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Delta contains the London fallback and contract; no other theme/script surprises | YES | `git diff fd00f7a... -- sections/quote-wizard.liquid scripts/courier/repair-journey.test.js` shows only the new `londonWall()`/`wall.hour` fallback implementation and its contract. `git diff --name-only fd00f7a... -- assets sections snippets scripts` returned exactly `sections/quote-wizard.liquid` and `scripts/courier/repair-journey.test.js`. |
| 2 | Fallback has no browser `getHours(` and uses `Europe/London` | YES | `sections/quote-wizard.liquid:1605-1635` formats `now` with `timeZone: 'Europe/London'`, builds the London date/hour, and compares `wall.hour >= PACK_CUTOFF_HOUR`; the fallback slice contains no `getHours(`. |
| 3 | Shared clocks retain the required behavior | YES | No `assets/` file changed from `fd00f7a`. `assets/repair-journey.js:25-31,85-92,155-177` keeps the 15:00 London cutoff and UPost + one working day. The journey tests cover Monday 10:00 iPhone (pack Mon / post Tue / return Thu) and Bali afternoon. `assets/courier-slots.js:53-96` still uses London time and permits Today only for B1/B2 before 14:00. |
| 4 | Mail-in cart rules remain correct | YES | `sections/quote-wizard.liquid:3468-3494` stamps Mail-in on the repair line, adds no `mail-in-service` SKU, and only suppresses the adjustment for mail-in repairs at `>= 200`; paid under-£200 adjustments remain addable. `scripts/courier/mail-in-free-over-200.test.js` passed. |
| 5 | Three required test files pass | YES — 28 tests | `node --test scripts/courier/repair-journey.test.js scripts/courier/courier-slots.test.js scripts/courier/mail-in-free-over-200.test.js`: 28 pass, 0 fail. |
| 6 | Full courier test glob passes | YES — 96 tests | `node --test scripts/courier/*.test.js`: 96 pass, 0 fail. |
| 7 | r1 P1/P2 closed; no new P0/P1 | YES | P1 is closed by the London wall clock plus direct four-timezone fallback execution. P2 is closed by `scripts/courier/repair-journey.test.js:117-138`, which contracts the fallback’s London timezone, prohibits `getHours`, and requires the London-wall cutoff comparison. The delta introduces no new P0/P1. |

## P0

None found.

## P1

None found.

## P2

None found. The committed fallback coverage is deliberately a source contract rather than a browser-executed unit test; the QA probe additionally executed the exact extracted fallback in `UTC`, `Asia/Makassar`, `Pacific/Auckland`, and `America/Los_Angeles`, including Bali, cutoff-boundary, and Sunday cases. No behavioral discrepancy was observed.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

None found in the reviewed delta. The prior unsafe condition—the apparently-correct shared library masking a browser-local fallback—no longer applies: both paths use the London wall clock for the pack cutoff.
