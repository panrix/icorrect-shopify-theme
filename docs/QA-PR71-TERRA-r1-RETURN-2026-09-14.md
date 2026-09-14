# PR 71 Terra r1 — adversarial QA return

## VERDICT: SHIP

| # | Forced checklist | Answer | Evidence |
|---|---|---|---|
| 1 | HEAD is exactly `eefbdf67643d86a31356d3b7d884d8ac30d4340a` | YES | `git rev-parse HEAD` returned `eefbdf67643d86a31356d3b7d884d8ac30d4340a`. |
| 2 | `buildCartItems()` no longer pushes `CFG.mailIn.variantId` | YES | The mail-in branch stamps properties only; its former `miVid`/`items.push` block is removed. |
| 3 | Mail-in still sets `Service Type` = `Mail-in` on the repair line | YES | `items[0].properties['Service Type'] = 'Mail-in'` remains in the mail-in branch. |
| 4 | Paid postage adds the adjustment variant only when `_courierQuote.adjustment > 0` | YES | The only adjustment-variant `items.push` is under `_courierQuote && _courierQuote.adjustment > 0`; it also requires a resolved variant ID. |
| 5 | `additional-repair.liquid` no longer adds mail-in-service when mail-in is checked | YES | The `mailActive`/`mailInCheckbox.checked` SKU-push block is removed; the repair line receives `Service Type: Mail-in`. |
| 6 | BH10 + £479 mail-in produces adjustment 0 and total 479 | YES | `quoteServiceAdjustment()` resolves untagged £479 to the `free` tier; focused test asserts adjustment `0`, total `479`. |
| 7 | `node --test scripts/courier/mail-in-free-over-200.test.js` passes | YES — 5/5 | 5 tests passed; 0 failed. |
| 8 | `node --test scripts/courier/*.test.js` passes | YES — 90/90 | 90 tests passed; 0 failed. |
| 9 | No new P0/P1: double postage, free mail-in £20 charge, or lost under-£200 £20 adjustment | YES | Both checkout paths omit only the legacy £20 mail-in SKU and retain the positive adjustment-variant path. The pricing suite covers under-£200 mail-in as `+£20`. |

## P0

None.

## P1

None.

## P2

None.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

None found in this PR's three changed files. The retained positive-adjustment path is necessary: removing the legacy mail-in SKU does not remove the under-£200 mail-in adjustment variant.
