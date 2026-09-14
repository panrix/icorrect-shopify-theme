# QA return — PR 65 Terra r3

**Verdict: SHIP** (after hub #432 is live)

Reviewed 2026-09-14. Builds on r2 (dataset stamp + clocks) and Ricky's conversion call: diagnostic UI must not promise a return, and known-repair clocks should be the shortest honest working-day promise.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Diagnostic courier/mail-in journeys have no return leg | YES | `returnDate: null`; final step is `You decide next` / device stays. |
| 2 | Diagnostic ETA is quote/diagnosis date, not return | YES | ETA label: “We'll tell you what's wrong by {date}”. |
| 3 | Working-day math kept (Fri → Mon) | YES | Tests: Friday collection → Monday quote. |
| 4 | Copy says 1 working day, not 24 hours | YES | Badge + journey strings. |
| 5 | Known repair iPhone/MacBook/iPad = 1 working day; watch = 3 | YES | `repairBenchDays` + tests. |
| 6 | Independent courier tests | YES | `node --test scripts/courier/*.test.js` → 70 pass. |

## Findings

### P0
None in theme code.

### P1
None.

### Operational residual
Deploy **after** workshop-os #432 (migration 0028 applied). Theme beacons with `repair*` keys 400 on an old hub and drop the whole capture.

## Follow-ups (not blocking this PR)
- Soft lead-gate before revealing price (email/name) so £17k quote volume becomes a chaseable CRM list.
- Express mail-in (+fee) when stock is confirmed — customers already pay for speed.
