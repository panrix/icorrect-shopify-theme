# Solution Brief — PR #65 — Terra r4

## 1. Root cause

1. Diagnostic result card used a courier-only summary (“We collect, diagnose…”) that stayed on screen for mail-in / out-of-area customers, contradicting the corrected journey timeline.
2. Hub allowlist compatibility was claimed in prose without an executable contract Terra could verify from the theme worktree.

## 2. Solution

1. Replace diagnostic card summary with service-neutral copy: “Once your device arrives — by courier or mail-in — we diagnose within 1 working day…”.
2. Add `scripts/courier/hub-quote-events-allowlist.test.js` pinning hub #432 `ROUTES` / `REPAIR_TYPES` from `quote-events-validate.ts` and asserting every theme `route` / `repairType` literal is allowlisted; also guards the neutral copy.

## 3. Adjacent risks

- Journey step titles still say “We collect” on the **courier** path only — correct.
- Shopify section setting `diagnostic_turnaround` may still hold a legacy “24 hours” value in the live theme editor; schema default is already corrected.
- Deploy order unchanged: hub #432 + migration `0028` before theme.

## 4. Done when (tests Terra can’t ignore)

1. Liquid no longer contains `We collect, diagnose within 1 working day`.
2. Liquid contains the courier-or-mail-in arrival sentence.
3. `node --test scripts/courier/hub-quote-events-allowlist.test.js` passes (routes + repairTypes ⊆ hub allowlists).
