# PR 68 Terra adversarial QA return

**PR:** https://github.com/panrix/icorrect-shopify-theme/pull/68  
**Base reviewed:** `fccb94d` (`origin/main` per brief)  
**HEAD reviewed:** `c922f15d4aa5f4d6c380393df7704591846fc328`  
**Scope:** PR delta only. The untracked mission brief was excluded. Existing collection-repair copy outside this delta was not used as a finding.

## VERDICT: SHIP

| # | Check | Result | Evidence |
|---:|---|---|---|
| 1 | HEAD is exactly `c922f15d4aa5f4d6c380393df7704591846fc328` | YES | `git rev-parse HEAD` returned exactly `c922f15d4aa5f4d6c380393df7704591846fc328`. |
| 2 | Homepage FAQ/schema sources have no specified stale diagnostic clocks | YES | Case-insensitive search across `templates/index.json`, `templates/collection.all-devices.json`, `sections/homepage-faqs.liquid`, and `snippets/icorrect-faq-page-schema.liquid` returned no `two to three`, `2-3`, `2 to 3`, `one to two`, or `1 to 2 working days` matches. |
| 3 | Those homepage sources state the one-day, service-neutral, device-stays terms | YES | Each of the four files contains: “by courier or mail-in”, “we diagnose within 1 working day”, and “The device stays with us until you decide.” |
| 4 | Homepage `FAQPage` `acceptedAnswer.text` equals visible homepage FAQ with HTML stripped | YES | Independent Node comparison succeeded (`schema/visible exact match: YES`, normalized answer length 651). The static homepage JSON-LD also parsed as an `FAQPage` with 10 questions. |
| 5 | Six diagnostic collection/page files have no stale clocks and contain `1 working day` | YES | Robust stale-clock search found no variants in `ipad-diagnostics`, `macbook-diagnostic`, `iphone-diagnostics`, `apple-watch-diagnostics`, `watch-diagnostics`, or `page.advanced-diagnostics`; all six contain `1 working day`. Delta review confirms their diagnostic answers say the quote is emailed after arrival by courier or mail-in. |
| 6 | `collection.apple-watch-diagnostics.json` has no iPad paste | YES | Case-insensitive `ipad` search returned no matches. The full changed block is Apple Watch-named, including its title, FAQ questions, and device references. |
| 7 | `node --test scripts/courier/faq-clock-copy.test.js` | YES — 5/5 tests passed, 0 failed | Exit 0; 1 suite, 5 tests, 0 failures. |
| 8 | `node --test scripts/courier/*.test.js` | YES — 79/79 tests passed, 0 failed | Exit 0; 22 suites, 79 tests, 0 failures. |
| 9 | No new P0/P1 in delta | YES | `git diff --check fccb94d HEAD` returned clean. All 8 changed JSON templates parse. Homepage section schema and homepage JSON-LD parse. The visible/schema answer is identical. The delta removes five express-diagnostic claims and adds none. |

## Findings

### P0 — 0

None.

### P1 — 0

None.

### P2 — 0

None.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

None found in the PR delta. The visible homepage answer and its index-route JSON-LD are byte-equivalent after the visible HTML is normalized, so there is no hidden schema/visible-copy divergence. The diagnostic updates consistently use the wizard’s “arrives → diagnose and email quote within 1 working day” model; they do not introduce an express-diagnostic offer. Existing non-diagnostic express-repair statements in the schema snippet predate this delta and are outside the PR finding scope.
