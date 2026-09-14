# QA — PR 65 Terra r2 return — 2026-09-14

## VERDICT: NEEDS-FIX

The r1 XSS and email-event defects are fixed at `609ef9b546c4dfb32c8a65d64e3f1b47728e679f`. One P1 remains: diagnostic journeys promise a 24-hour quote but calculate that date as the next *working* day. A Friday collection (or a mail-in received Friday) is shown as Monday, not within 24 hours.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | HEAD is exactly `609ef9b546c4dfb32c8a65d64e3f1b47728e679f` | YES | `git rev-parse HEAD` returned that SHA. |
| 2 | Quote-card `innerHTML` does not interpolate title into `data-repair`; stamp uses DOM dataset | YES | Both repair and diagnostic card strings omit repair metadata; `ICorrectQuotedRepair.stampQuotedRepair` sets `el.dataset` in [quoted-repair-stamp.js](../assets/quoted-repair-stamp.js). |
| 3 | Hostile title creates no attribute/handler and is test-covered | YES | `quoted-repair-stamp.test.js` uses `Repair " onmouseover="xss` and asserts `dataset.onmouseover === undefined`; the Liquid wiring test also rejects `data-repair=` interpolation. |
| 4 | Email capture takes `fireQuoteEmailRequested` → `syncIcorrectQuote()` → event dispatch | YES | Email success calls the wrapper; it synchronizes immediately before `captureQuoteEmailRequested`. The email dispatcher intentionally uses `fetch(..., { keepalive: true })`, not `navigator.sendBeacon`, due to the documented Chromium behavior. |
| 5 | Specified independent tests | YES — 9/9 | `node --test scripts/courier/quoted-repair-stamp.test.js scripts/courier/repair-journey.test.js scripts/courier/quote-wizard-repair-stamp.liquid.test.js`: 9 pass, 0 fail. |
| 6 | Diagnostic has `quoteDate` and `returnDate: null` | YES | Courier and mail-in diagnostic models set `quoteDate` and `returnDate: null`; covered by the journey tests. |
| 7 | MacBook courier collected Monday returns Wednesday (2 WD) | YES | The independent test asserts 2026-09-14 → 2026-09-16. |

## P0

None in the theme delta. Hub #432 being not live is a deploy-order residual, not a theme-code blocker for this review.

## P1

- **“Quote in 24 hours” is false across weekends.** `addWorkingDays()` skips Saturday and Sunday, but both diagnostic models use it for `quoteDate`. Thus a courier diagnostic collected Friday 2026-09-18 produces Monday 2026-09-21; a mail-in ordered Wednesday morning produces a Friday receipt and the same Monday quote date. The UI promises “Quote in 24 hours” and “diagnose within 24 hours.” The brief distinguishes repair *working days* and mail handoff *WDs*, but not diagnostic’s 24-hour clock. Use a calendar-day/24-hour calculation for diagnostic quote dates, or change the explicit product promise and obtain approval. Add Friday/weekend tests for both diagnostic paths.

## P2

None release-blocking. The hostile-title test uses a lightweight `dataset` double rather than a browser DOM; the companion Liquid source test still verifies the dangerous attribute interpolation is absent.

## Deploy residual

Deploy the theme **after hub #432 is live and migration 0028 has run**. Until then, the hub’s fail-closed unknown-key behavior can reject theme quote-event payloads.
