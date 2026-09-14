# QA — PR #65 Terra r5 return — 2026-09-14

## VERDICT: SHIP

The r4 P1s are resolved in this delta: the diagnostic card's customer-facing sentence is service-neutral, and an executable local contract now checks the emitted `route` and `repairType` literals against the pinned Hub #432 allowlists. The contract test and the complete courier suite are green.

This is a source-level SHIP, not evidence that the deployed Hub currently accepts the payload. The worktree does not contain the Hub source or a deployed-schema endpoint; retain the stated deployment ordering and perform the production smoke check.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | HEAD is exactly `1ff56a3e0063a660eae6c6ef2c7e20b6fc3db8fb` | YES | `git rev-parse HEAD` returned exactly `1ff56a3e0063a660eae6c6ef2c7e20b6fc3db8fb`. |
| 2 | Liquid no longer contains `We collect, diagnose within 1 working day` | YES | No match in `sections/quote-wizard.liquid`; the new contract test's negative assertion also passes. |
| 3 | Liquid contains courier-or-mail-in arrival wording on the diagnostic card | YES | `showDiagnosticCard()` renders: “Once your device arrives — by courier or mail-in — we diagnose within 1 working day and email your quote.” |
| 4 | `node --test scripts/courier/hub-quote-events-allowlist.test.js` passes | YES — 4/4 | 1 suite; 4 pass, 0 fail, 0 skipped/todo. It validates extracted `route` and `repairType` literals, payload key wiring, and the neutral diagnostic-card copy. |
| 5 | `node --test scripts/courier/*.test.js` passes | YES — 74/74 | 21 suites; 74 pass, 0 fail, 0 cancelled, 0 skipped/todo. |
| 6 | No new P0/P1 introduced in the delta | YES | The only production change is the neutral diagnostic sentence; the remaining change is a passing static contract test. No functional regression found in the delta. |

## P0

None found.

## P1

None found in the r5 delta.

## P2

1. **The Hub contract is pinned, not live.** `hub-quote-events-allowlist.test.js` duplicates Hub allowlists in local `Set`s, with source provenance only in a comment. It protects against future theme literals outside that pinned set, but cannot detect a divergent or undeployed Hub #432 configuration. The worktree contains no Hub revision/schema to compare, so a production quote-event smoke test remains necessary.
2. **Committed QA-brief whitespace.** `git diff --check HEAD^..HEAD` reports trailing spaces in the newly added r4 QA brief. It is documentation-only and does not affect theme execution or the test result.

## Deploy residual

Deploy the theme only after Hub #432 is deployed, migration `0028` is applied, and the intake hub is restarted. After deploy, submit one repair and one diagnostic quote through the real theme and verify the Hub/Supabase rows accept `repair`, `repair_handle`, `repair_type`, and `route` without an HTTP 400. Also verify that the target Shopify section does not retain a legacy `diagnostic_turnaround` setting that overrides the corrected schema default.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

- A green pinned test does not prove the remotely deployed validator matches its copied `HUB_ROUTES` / `HUB_REPAIR_TYPES`; that assurance comes only from the required Hub deployment and production smoke test.
- The corrected static sentence now accurately covers either intake method. It must remain service-neutral if the service-card behavior changes.
