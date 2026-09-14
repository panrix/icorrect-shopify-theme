# QA — PR #65 Terra r4 return — 2026-09-14

## VERDICT: NEEDS-FIX

The r2 24-hour/working-day contradiction is fixed: the diagnostic path now promises one working day, calculates the next working day, and does not render a return ETA. Confirmed repair clocks are also correct. This is not ready to ship because the customer-visible diagnostic card still says **“We collect”** even after a customer has selected (or been forced onto) mail-in, and the hub allowlist assertion cannot be independently verified from this worktree or the available GitHub access.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | HEAD is exactly `0c534972e0001feb7c81ec968e5ce08be5da1a54` | YES | `git rev-parse HEAD` returned the claimed SHA. |
| 2 | `repairBenchDays`: iPhone=1, MacBook=2, iPad=2, Watch=3, diagnostic=1 | YES | [assets/repair-journey.js](../assets/repair-journey.js) returns those values; `repair-journey.test.js` asserts all five. |
| 3 | Courier diagnostic: collect → diagnose & email quote → customer decides; no return; quote date set | YES | `courierDiagnosticJourney()` has those three steps, sets `quoteDate` after a collection date, and sets `returnDate: null`. Before a slot is selected, the deliberately pending model has no date. |
| 4 | Mail-in diagnostic: packaging → customer posts → diagnose & email quote → customer decides; no return | YES — timeline | `mailinDiagnosticJourney()` and the Liquid fallback use those four steps with `quoteDate` and `returnDate: null`. See P1: a separate card paragraph still promises collection. |
| 5 | Diagnostic ETA uses diagnosis/quote wording, not “Estimated return by” | YES | `renderServiceJourney()` takes the diagnostic branch first and renders “We’ll tell you what’s wrong by”; the return label is only in the non-diagnostic branch. |
| 6 | Customer-facing diagnostic turnaround says one working day, not a 24-hour turnaround | YES | Default/schema/template setting and diagnostic card use “Quote in 1 working day” / “diagnose within 1 working day”; the only remaining “within 24 hours” instances describe liquid-damage incidents. |
| 7 | Quote-card stamp uses DOM dataset; hostile title remains safe | YES | [assets/quoted-repair-stamp.js](../assets/quoted-repair-stamp.js) assigns `dataset`; quote-card markup has no `data-repair="..."`; hostile-title test passes. |
| 8 | `node --test scripts/courier/*.test.js` | YES — 70/70 | 20 suites, 70 pass, 0 fail, 0 skipped/todo. |
| 9 | Emitted `repair_type` / `route` values are in Hub #432 allowlists | NO — not independently verifiable | Theme can emit `route` `repair` or `diagnostic` on quote-event cards, and potential repair types include `battery`, `crown`, `diagnostic`, `dustgate`, `earpiece`, `flexgate`, `heart-rate-monitor`, `keyboard`, `loudspeaker`, `mute-button`, `power-button`, `rear-camera`, `rear-camera-lens`, `rear-glass`, `screen`, `screen-glass`, `side-button`, `touch-bar`, `trackpad`, `volume-button`. Hub source/PR #432 is not present in this worktree and is inaccessible to the available GitHub credential, so there is no authoritative comparison or contract test. |

## P0

None found in the reviewed theme delta.

## P1

1. **Mail-in diagnostic customers are told “We collect.”** `showDiagnosticCard()` in [sections/quote-wizard.liquid](../sections/quote-wizard.liquid) always renders: “We collect, diagnose within 1 working day, then email your quote.” It remains on screen after mail-in is selected and is especially wrong for out-of-area customers forced to mail-in. The timeline is correct, but the visible summary contradicts it. Make this service-neutral (“Once we receive your device…”) or update it when the selected service changes.
2. **Hub allowlist compatibility is asserted, not proved.** The PR body says workshop-os #432 is merged, but this review could not read that private source or a published schema. Add/execute a contract check against the deployed Hub #432 allowlists (including all actual `repair_type` and `route` values) before deploy. Otherwise a fail-closed validation can still turn a valid-looking UI into silent HTTP 400 quote-event loss.

## P2

- The stamp implementation has a slow-asset edge: both cards stamp only when `window.ICorrectQuotedRepair` is already present. If its deferred asset is unavailable at the exact user interaction, `repair` and `repair_handle` are omitted; `repair_type` / `route` fall back to wizard state. This is an analytics completeness defect, not an attribute-XSS regression.
- The safety tests use a `dataset` double plus Liquid source matching. They catch the prior dangerous interpolation but do not exercise the browser DOM and beacon payload together.

## Deploy residual

Per the required order, deploy the theme only **after** Hub #432 is deployed, migration `0028` is applied, and the intake hub is restarted. This is a residual deployment gate, not a claim that Hub #432 remains unmerged. Also verify persisted Shopify section settings in the target theme: a non-empty legacy `diagnostic_turnaround` setting overrides the newly corrected schema default.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

- The corrected mail-in timeline can make the screen look compliant while the persistent diagnostic-card sentence still promises a courier collection.
- Green unit/source tests prove local code paths, not the deployed Hub validation contract; a 400 is swallowed by the beacon calls and will not visibly break checkout.
- The `diagnostic_turnaround` schema default is corrected, but Shopify retains existing section setting values. A legacy “Quote in 24 hours” value would still win over the default even though the committed template inspected here has the new value.
