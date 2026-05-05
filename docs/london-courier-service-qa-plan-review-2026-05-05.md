# London Courier Service QA Plan — Review

**Date:** 2026-05-05
**Reviewer:** Claude Code (build-side QA)
**Reviewed:** `docs/london-courier-service-qa-plan-2026-05-05.md`
**Cross-checked against:** `docs/london-courier-decision-engine-spec-2026-05-05.md`
**Status:** Feedback for Codex follow-up

## Verdict

Solid scaffolding. Coverage of the obvious axes (postcode, VAT, profitability, same-day, copy, cart, failure) is good. **It is not yet executable as a QA pass.** Roughly 30% of items are pass/fail today; the rest depend on unresolved spec decisions, missing fixture values, or ambiguous boundaries. There are also material coverage gaps around concurrency, time, security, and operational reality.

---

## Blockers (must resolve before QA is runnable)

1. **Free-courier representation is undecided.** Spec lists this as an Open Decision; CART-02 punts to it. Until "zero-price variant vs metadata-only" is chosen, CART-01/02/03 cannot be executed — different fixtures and assertions apply to each path.
2. **No concrete fixture values.** `data/gophr-london-coverage-decision-summary-2026-05-05.csv` is referenced but specific postcodes for each band aren't pinned. Without "W1T = central, RM6 = outer, etc." the plan is descriptive, not runnable.
3. **Margin threshold + repair profitability table is open.** PROF-01 through PROF-08 all assume £40 contribution and "high/low margin" categories, but `estimated_parts_cost`, `estimated_labour_cost`, and `payment_and_platform_allowance` aren't loaded anywhere — testers can't compute expected results.
4. **Stale-quote definition missing** (CART-08, FAIL-06). What makes a quote stale — 5 min? 30 min? End of day? Slot consumption? Not defined; not testable.

## Coverage gaps (material risk)

5. **No concurrency / slot race tests.** Two customers hit the last same-day slot simultaneously → who wins? Slot decrement must be atomic. FAIL-06 covers "consumed during checkout" but not the race window. **High operational risk for production.**
6. **No abandonment / slot release.** If a customer sees "1 slot left" and walks away, does the slot release? If not, the slot counter drifts down through the day with no real bookings. Add: `SD-09 abandoned wizard does not consume slot`.
7. **No timezone / DST tests.** Spec says "12:00 local London time"; cutoff must respect BST/GMT switch (last Sunday March, last Sunday October). No test that the decision app evaluates time correctly when the request originates from a non-London client.
8. **No `requested_date ≠ today` tests.** A customer wanting "next Monday" — same-day shouldn't apply, but this isn't asserted. Slot-counter scope (per-day) needs an explicit fixture.
9. **No asymmetric two-way pricing.** VAT-02 assumes two-way = one-way × 2. The Gophr matrix can have different inbound/outbound (collection from Zone 5, return to Zone 1, or vice versa). Add: `PROF-09 asymmetric two-way is summed correctly`.
10. **No boundary tests for thresholds.** Profitability at £39.99 / £40.00 / £40.01; cutoff at 11:59 / 12:00 / 12:01; capacity at slots 0/1/2/3. Off-by-one bugs typically live here.
11. **No non-London valid postcode test.** PC-04 covers "malformed" but not "valid UK postcode outside London matrix" (M1, B15, EH1, BT1, JE2, IM1). All should fall to mail-in. Add: `PC-07`.
12. **No security / leak tests for the decision API:**
    - Decision response must not include `decision_reason`, subsidy, or margin bands in the client-visible payload (or the wizard layer must strip them).
    - Endpoint rate-limit / postcode enumeration (free intel for competitors).
    - Build-time check that no Gophr API key is present in the theme bundle (the spec's #1 guardrail — currently untested).
13. **No observability tests.** Every decision should be logged so ops can see if same-day silently never fires (e.g., a stock-state bug). No QA item asserts logging or metrics.
14. **No repair-type-change UI test.** UI-04 covers postcode change; missing the symmetric case where a customer changes repair type after courier loaded (must invalidate). Spec covers this in CART-06 but only at cart layer, not wizard.
15. **No partial-postcode (outward only) test.** Spec normalises to outward code — should the wizard accept "W1" as input? Decide and test.
16. **No accessibility specifics.** UI-08 is a single line. Add: visible focus indicator, `aria-live` on slot counter, error message announced, screen-reader pronunciation of postcode, contrast for unavailable options.
17. **Mobile breakpoints unspecified.** UI-06 says "mobile viewport" — pin to 320 / 375 / 414 / 768.
18. **Manual-quote path is referenced but not tested as a flow.** What does the customer see / do? Email form? Phone CTA? Add a UI test for it.

## Inconsistencies with the spec

19. **DIAG-05 mismatch.** Says cart marks order as "diagnostic/assessment-first", but the required metadata list (lines 156–170) has no diagnostic flag. Either add `_repair_flow_type` (or similar) to the metadata schema, or reword DIAG-05.
20. **VAT-04 wording is ambiguous.** "Customer charge reduces the iCorrect subsidy" — true mathematically but easy to misread. Restate: `subsidy = two_way_cost - customer_courier_charge`. Copy the contribution formula from the spec into the QA plan as the source of truth.
21. **Same-day capacity drift.** Spec body says "3 per day"; spec Open Decisions says "2 or 3"; QA plan doesn't pin a fixture value.
22. **Back glass treatment.** Spec lists it as "Manual/next-day"; QA SD-07 lumps it into "non-eligible". Worth its own row to verify the specific manual/next-day messaging fires.

## Ambiguity / non-actionable items

23. **PROF-07** "Internal subsidy or margin reason exists in decision output" — pass criterion is "UI does not show internal margin language." Need an explicit allowlist of customer-visible fields, or denylist of internal fields, in the spec — otherwise testers will disagree on "internal."
24. **STOCK-03 vs STOCK-04** — both cover "unknown stock" but with different outcomes. Distinguish "unknown and same-day hidden" vs "unknown but soft collection-first". When does each path fire?
25. **STOCK-05** mentions "stock changes between quote and checkout" — the detection mechanism isn't defined (real-time poll? webhook? ops review only?). Without that, the test isn't reproducible.
26. **CART-07** "prevents nonsensical courier quantities" — define nonsensical (qty > 1? qty = 0?).
27. **Open QA Decisions list (lines 213–218)** has no owners or due dates. Each item is a blocker — assign to spec owner with target date.

## Nice-to-haves

28. **Performance budget.** P95 decision-API response < 400ms; wizard interaction-to-options < 800ms.
29. **Localisation row.** £ symbol, DD/MM/YYYY date format, 24-hour times for collection windows.
30. **Shopify checkout-extension test.** Ensure private `_*` line item properties are visible to the merchant in the order admin and exports — this is what makes the metadata useful for ops audit.

---

## Recommended next steps (in order)

1. Resolve the four Blockers above — most are spec decisions, not QA work.
2. Pin a **fixtures table**: 8–10 specific postcodes mapped to bands, repair types, expected outputs. This becomes the canonical input for both manual and automated QA.
3. Lift Coverage gaps #5, #7, #12, #13 into the QA plan (concurrency, timezone, security, observability) — these are the production-risk items most likely to bite after launch.
4. Add a brief **out-of-scope** section so reviewers know what is *not* being tested in phase one (e.g., non-London postcodes, cross-border, business accounts).

## Compromises

- Reviewed only the QA plan and decision engine spec; did not read the underlying CSV matrices or any wizard/theme code. Findings about feasibility (e.g., async slot decrement) are based on the documented architecture, not implementation.
- Did not run any of the QA scenarios; this is a plan review only.
- No verification against the broader `docs/london-courier-postcode-product-plan-2026-05-05.md` — that may resolve some of the open decisions noted above.
