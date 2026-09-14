# Terra r1 QA return — PR 74

**Reviewed code commit:** `2429fa6bb1baff28edbb635588f6b181afccb58b`  
**Branch HEAD:** `24b2eec81e83fc964dd70e14eb7c19be5e3347fc` (adds only the QA brief)  
VERDICT: SHIP

## Checklist

| # | Requirement | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Liquid and homepage/device JSON use the collect line with the correct noun | YES | `sections/quote-wizard.liquid:367-394` derives `device`, `iPhone`, `MacBook`, `iPad`, or `Apple Watch` and renders exactly “We'll collect your {noun} same day in London, nationwide by courier.” The schema default at `:4810-4814` matches. An independent audit parsed all 66 changed JSON templates / 66 quote-wizard sections and found each exact expected line and configured heading. |
| 2 | Prohibited capacity-warning copy is absent | YES | Case-insensitive searches found no `Service Update`, `bench is at capacity`, or `paused walk-ins` in `sections/quote-wizard.liquid` or any template JSON. |
| 3 | iPhone/iPad wizard remains above model grid; iPad description remains valid | YES | `templates/collection.iphone-collections.json:519-530` and `templates/collection.ipad-collections.json:381-391` place `quote_wizard_top` before their model-grid sections. Both complete `order` arrays are byte-for-byte unchanged from `origin/main`; the iPad details string is present, describes iPad repairs and collection, and contains no em dash. |
| 4 | `node --test scripts/courier/collection-only-copy.test.js` | YES — 5/5 | 2 suites, 5 tests passed; 0 failed, skipped, cancelled, or todo. |
| 5 | `node --test scripts/courier/*.test.js` | YES — 101/101 | 29 suites, 101 tests passed; 0 failed, skipped, cancelled, or todo. |
| 6 | No new P0/P1 | YES | The code diff changes only the capacity-warning copy to the specified collect line, plus its regression test and matching template settings. `git diff --check` is clean. No P0 or P1 issue was found. |

The required integrity check passed: `git diff 2429fa6bb1baff28edbb635588f6b181afccb58b -- sections templates scripts` is empty. The branch's later commit contains only `docs/QA-PR74-TERRA-r1-2026-09-14.md`.

## P0

None.

## P1

None.

## P2

- The committed regression test samples four family templates, while this PR changes 66 quote-wizard template settings. This did not hide a present defect: the independent QA audit parsed and validated every changed template. It remains a non-blocking future-drift risk if later edits affect one of the other 62 templates.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

No PR-introduced contradiction or release-blocking unsafe path found.

The `subheading` theme setting remains exposed in the section schema and in JSON, but the rendered copy is generated directly in Liquid (`qw_sub`) rather than read from `section.settings.subheading`. This behavior predates the reviewed code commit; the generated Liquid line is therefore the actual display source of truth. It does not invalidate this PR's required copy, but a future change that expects per-template subheading overrides would not take effect without changing that rendering path.
