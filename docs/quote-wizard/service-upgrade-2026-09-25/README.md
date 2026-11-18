# iCorrect quote module (step 4 + triage lanes)

Design prototype for the quote wizard's final steps.

The questions for Ferrari to extend are in [QUESTIONS.md](QUESTIONS.md) (diagnostic and data recovery).

## Open it
- `quote-module-standalone.html`: single self-contained file, opens offline in any browser. Reference only, not for lifting code.
- `quote-module.dc.html`: readable source. Serve this folder over HTTP (e.g. `npx serve .`) and open it; it needs `support.js` and `_ds/` alongside.

## Lanes
- **Priced** (Screen replacement): details gate -> quote with collection windows, Standard / Fast (+£79) / Same day (+£149, 3 slots, 11:00 cut-off), Klarna split.
- **Diagnostic** (Liquid damage, No power): required triage (Apple visit + verdict, data importance) -> details -> quote. £79 diagnostic, deducted from the repair.
- **Data recovery**: required triage (what happened, how dead, previous attempts + outcome, login password) -> details -> quote. £99 recovery diagnostic, deducted from the recovery.

## Rules encoded in the logic class
- London courier if postcode matches E, EC, N, NW, SE, SW, W, WC, BR, CR, DA, EN, HA, IG, KT, RM, SM, TW, UB, WD; otherwise tracked mail-in.
- Express collection (within 1h / 2h) only today, London, 08:30-16:00.
- Same-day return only when: London, collected today, window ends by 12:00, before 11:00 cut-off, slots > 0.
- Working-day clock skips weekends (bank holidays not handled).
- Klarna shown only when total >= £100.

## Placeholders to replace
Guide prices per fault, £1,049 Apple comparison, £25 express collection, £39 priority diagnostic.
