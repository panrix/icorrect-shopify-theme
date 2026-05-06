# London Courier Service QA Plan — Review Follow-Up

**Date:** 2026-05-05
**Reviewer:** Claude Code (build-side QA)
**Reviewing:** Codex commit `165fc83 docs: address courier qa review`
**Reviewed against:** `docs/london-courier-service-qa-plan-review-2026-05-05.md` (commit `6c98304`)
**Status:** Follow-up — green light to proceed to implementation

## Verdict

Strong follow-up. The QA plan is now executable end-to-end. 26 of 30 original findings resolved, both recommended next-step blocks completed, and Codex made three architectural improvements on his own that pre-empt future leaks. The two unresolved items are not blockers for phase-one QA — they can be cleared in a single line of spec when the implementation work starts.

**Recommendation:** Treat the QA plan as feedback-incorporated. Move on to fixture data + decision-app prototype build (spec build sequence step 1).

---

## Scorecard

### Blockers (4)

| # | Finding | Status |
|---|---|---|
| 1 | Free-courier representation | **Resolved** — spec pins zero-price courier variant in phase one; CART-02 reflects it. |
| 2 | Concrete fixture values | **Resolved** — FX-01 to FX-10 added with specific postcodes per band. |
| 3 | Margin threshold + profitability table | **Partial** — RF-01 to RF-06 added with concrete numbers + canonical formula. Final threshold values still in Open Decisions, but testers can now compute expected results. |
| 4 | Stale-quote definition | **Resolved** — `quote_ttl = 15 minutes`, atomic reservation, CART-08 reworded. |

### Coverage gaps (14)

| # | Finding | Status |
|---|---|---|
| 5 | Concurrency / slot race | **Resolved** — SD-10 + atomic reservation in spec. |
| 6 | Abandonment / slot release | **Resolved** — SD-09, SD-11, OBS-05. |
| 7 | Timezone / DST | **Resolved** — new TIME-01 to TIME-05 section. |
| 8 | `requested_date ≠ today` | **Resolved** — SD-12, TIME-05. |
| 9 | Asymmetric two-way pricing | **Resolved** — VAT-06, PROF-09. |
| 10 | Boundary thresholds | **Resolved** — PROF-08, SD-13, SD-14. |
| 11 | Non-London valid postcode | **Resolved** — PC-07 with explicit examples (M1, B15, EH1, BT1, JE2, IM1). |
| 12 | Security / API leak | **Resolved** — new SEC-01 to SEC-05 section + FAIL-09 build-time secret scan. |
| 13 | Observability | **Resolved** — new OBS-01 to OBS-05 section. |
| 14 | Repair-type change UI | **Resolved** — UI-05. |
| 15 | Partial postcode | **Resolved** — PC-08. |
| 16 | Accessibility specifics | **Resolved** — UI-09 expanded (focus, aria-live, contrast) + UI-10 screen-reader. |
| 17 | Mobile breakpoints | **Resolved** — UI-07 pinned to 320/375/414/768. |
| 18 | Manual-quote path flow | **Resolved** — COPY-09. |

### Inconsistencies (4)

| # | Finding | Status |
|---|---|---|
| 19 | DIAG-05 metadata flag | **Resolved** — `_repair_flow_type` added to required metadata. |
| 20 | VAT-04 wording | **Resolved** — formula restated explicitly. |
| 21 | Same-day capacity 2 vs 3 | **Resolved** — pinned to 3; Open Decision removed. |
| 22 | Back glass row | **Not addressed** — still folded into SD-07. Minor. |

### Ambiguity (5)

| # | Finding | Status |
|---|---|---|
| 23 | Internal-fields allow/denylist | **Resolved** — explicit denylist now in QA plan. |
| 24 | STOCK-03 vs STOCK-04 | **Resolved** — distinct conditions and outcomes. |
| 25 | STOCK-05 detection mechanism | **Not addressed** — poll vs webhook vs ops still unspecified. Minor. |
| 26 | CART-07 nonsensical quantities | **Resolved** — qty bounds defined. |
| 27 | Open Decisions owners/dates | **Partial** — meta-line about owners/dates added, but the actual decisions still have no named owner. |

### Nice-to-haves (3)

| # | Finding | Status |
|---|---|---|
| 28 | Performance budget | **Resolved** — FAIL-07 (P95 < 400ms / 800ms). |
| 29 | Localisation | **Resolved** — COPY-10. |
| 30 | Shopify admin/export visibility | **Resolved** — CART-09. |

### Recommended next steps (4)

| # | Step | Status |
|---|---|---|
| A | Resolve blockers | Done. |
| B | Pin fixtures table | Done. |
| C | Lift concurrency/timezone/security/observability into plan | Done. |
| D | Add out-of-scope section | Done. |

## Tally

- **Resolved:** 26 / 30 findings + 4 / 4 next steps
- **Partial:** 2 (final margin values, decision owners — both correctly punted to spec ownership, not QA work)
- **Not addressed:** 2 (back glass row, stock-change detection mechanism — both genuinely minor)

## Bonus moves Codex made unprompted

- **Architectural separation of secrets** — internal cost/subsidy/margin now stored server-side keyed by `quote_id`; client payload is deliberately stripped. Cleaner than the review asked for.
- **Explicit field denylist** — `gophr_api_key`, `gophr_raw_response`, `net_contribution_after_logistics` listed as fields that must never appear in client/cart. Pre-empts future leaks.
- **STOCK-06 added** — stock check on ineligible repair type doesn't accidentally enable same-day. Good defensive thinking.

## Outstanding items (non-blocking)

These can be cleared in a single line of spec/plan during implementation. None should block starting build sequence step 1.

1. **Back glass row (finding #22).** Add a dedicated SD row asserting back glass shows manual/next-day wording, distinct from "non-eligible repair." One row.
2. **STOCK-05 detection mechanism (finding #25).** Decide whether stock-change-between-quote-and-checkout is detected by real-time poll, inventory webhook, or manual ops review — and pin it to STOCK-05's expected result.
3. **Open Decisions ownership (finding #27 partial).** Final margin threshold and Shopify courier variant IDs need an owner and a date. Suggest assigning to spec owner with a target before phase-one cart wiring lands.

## Compromises

- Reviewed only the diff between commits `6c98304` and `165fc83`. Did not re-read the full QA plan top-to-bottom; relied on diff hunks for completeness.
- Did not run any QA scenarios. The judgement that the plan is "executable end-to-end" is based on the test descriptions and fixtures being concrete enough for a tester to act on without further clarification — not on actual execution.
- No verification against `docs/london-courier-postcode-product-plan-2026-05-05.md` or the underlying CSV matrices in this pass.
