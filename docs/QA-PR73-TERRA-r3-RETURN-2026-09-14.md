# Terra QA return — PR 73 r3

VERDICT: SHIP

Reviewed signed-off code commit `153d54cb1133b5a89c89a4ec573917f60b9b04ce`.
`git diff 153d54c...HEAD -- sections templates scripts` is empty: commits
after it contain QA documentation only.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | r2 P1 is not treated as a merge blocker | YES | The contextual `Get your <subject> quote` logic at `sections/quote-wizard.liquid:308-360` is unchanged from the signed-off code and is explicitly out of scope in the r3 brief. It is not listed as a finding. |
| 2 | Service Update and noun logic are correct | YES | `sections/quote-wizard.liquid:363-393` unconditionally constructs the exact signed-off sentence and derives `device`, `iPhone`, `MacBook`, `iPad`, or `Apple Watch` from the device/context. `index.json` persists `device`; all 66 changed template JSON files parse and have exact Service Update values: device 4, iPhone 23, iPad 12, MacBook 21, Apple Watch 6. |
| 3 | iPad details has no em dash; iPhone/iPad wizard is above the model grid | YES | The required iPad parent-category `details` paragraph at `templates/collection.ipad-collections.json:105` preserves the mail-in-pack wording and contains no `—`. Its order puts `quote_wizard_top` before `parent_categories_f6HGVL` at lines 386-387; the iPhone equivalent precedes `parent_categories_nWCAYw` at `templates/collection.iphone-collections.json:524-525`. |
| 4 | `node --test scripts/courier/collection-only-copy.test.js` | YES — 5/5 | 5 tests passed; 0 failed, skipped, cancelled, or todo. |
| 5 | `node --test scripts/courier/*.test.js` | YES — 101/101 | 101 tests in 29 suites passed; 0 failed, skipped, cancelled, or todo. |
| 6 | No new P0/P1 in this PR delta | YES | Direct source/delta review found no in-scope release blocker. The signed-off code is unchanged after `153d54c`; all changed template JSON files parse successfully. |

## P0

None.

## P1

None.

## P2

1. `git diff --check origin/main...HEAD` reports trailing whitespace in the
   added QA briefing Markdown files (`docs/QA-PR73-TERRA-r1-2026-09-14.md`,
   `docs/QA-PR73-TERRA-r2-2026-09-14.md`, and
   `docs/QA-PR73-TERRA-r3-2026-09-14.md`). This is documentation-only and
   does not affect the theme or tested behaviour.
2. The new contract test samples four named templates and checks Liquid source
   tokens; it does not render Liquid contexts or exhaustively assert all 66
   changed template settings. This review separately parsed all 66 changed
   template JSON files and inspected the runtime noun-selection source.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

No in-scope unsafe contradiction found.

The iPad parent-category paragraph retains “a free tracked mail-in pack”,
while the Service Update says “nationwide by courier.” This is an apparent
service-policy difference, but the r3 brief explicitly requires retaining
that older iPad wording and says not to fail it against the Service Update.
It is therefore an accepted exception, not a merge blocker.

The contextual heading remains intentionally unchanged and is excluded from
this verdict by the r3 brief.
