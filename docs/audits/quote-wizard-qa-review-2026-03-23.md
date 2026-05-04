# Quote Wizard QA Review

**Date:** 2026-03-23
**Reviewer:** Codex
**Scope:** `sections/quote-wizard.liquid`
**Status:** Open findings documented, fixes implemented in local branch pending re-QA

## Summary

This review focused on the current quote wizard build after Ferrari's latest round of changes. The headline features are present, but four implementation risks needed to be addressed before release:

1. Wizard checkout could include unrelated pre-existing cart items.
2. Some model collections contained multiple valid Shopify products for the same logical repair path, causing the chosen SKU to depend on collection order.
3. Wizard webhook flows showed success without verifying a real server-side success response.
4. The MacBook helper still treated `A2338` as a one-to-one key even though it maps to both M1 and M2 13-inch MacBook Pro variants.

## Findings

### 1. Cart contamination

- Severity: High
- Risk: A user with existing cart contents could be sent to checkout with the repair booking plus unrelated items.
- Expected: Quote wizard checkout should be isolated to the selected repair booking flow.
- Fix: Inspect the current cart first, warn the user if it contains items, clear it only after confirmation, then add the wizard items and redirect to checkout.
- Status: Fixed locally, pending re-QA

### 2. Lossy SKU resolution

- Severity: High
- Risk: Where a model collection exposes multiple products that collapse into the same `repairType`, the wizard could quote and add the wrong SKU.
- Expected: Product choice should be deterministic and issue-aware.
- Fix: Preserve collection products and resolve the final product using explicit preferences by repair path:
  rear glass prefers `rear-glass-repair`, then `housing-rear-glass-repair`, then `housing-repair`
  iPhone screen issues that imply no image prefer `original-lcd-screen-no-screen-message-repair`
  standard iPhone screen issues prefer `original-screen-repair`, then `display-screen-repair`, then `screen-repair`
- Status: Fixed locally, pending re-QA

### 3. False-positive webhook success

- Severity: Medium-High
- Risk: The wizard could display "Sent" or "We'll be in touch" even when the webhook rejected the request server-side.
- Expected: Success UI should only appear after a readable successful response.
- Fix: Replace `no-cors` fire-and-forget requests with JSON POST requests that check HTTP status and surface server failures.
- Status: Fixed locally, pending re-QA

### 4. A2338 helper ambiguity

- Severity: Medium
- Risk: The MacBook helper could select the wrong model when a user enters `A2338`.
- Expected: The helper should resolve against the full model label, not a last-write-wins A-number lookup.
- Fix: Match helper entries against configured model names first, then use a best-fit fallback instead of a raw A-number map.
- Status: Fixed locally, pending re-QA

## Correct Process

1. Log findings in a QA document.
2. Agree the intended behavior for each finding.
3. Implement fixes.
4. Re-QA the updated build against the documented findings.
5. Push only after the fixed build is verified.

## Re-QA Checklist

- Confirm checkout warns before replacing an existing cart and then produces a clean repair-only checkout.
- Confirm iPhone 11 screen issues route to the correct screen SKU.
- Confirm rear-glass issues prefer dedicated rear-glass products where both rear-glass and housing products exist.
- Confirm quote email and wizard question submissions only show success on a real successful webhook response.
- Confirm the MacBook helper can distinguish `A2338` M1 vs M2 options.
