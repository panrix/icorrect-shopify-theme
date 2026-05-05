# Gophr London Coverage Summary

**Generated:** 2026-05-05
**Source matrix:** `data/gophr-london-coverage-matrix-2026-05-05.csv`
**Decision summary:** `data/gophr-london-coverage-decision-summary-2026-05-05.csv`

## Run Summary

- Representative outward postcodes: 99
- Quote rows: 1782
- Successful quote rows: 1781
- Error rows: 1
- Error detail: N1 one_hour_9_10 motorcycle HTTP 502

## Zone Ranges

| Zone | Postcodes | Rows | Cheapest gross | Most expensive gross |
|---|---:|---:|---:|---:|
| outer | 47 | 846 | 11.11 GBP | 60.17 GBP |
| zone1 | 23 | 414 | 8.54 GBP | 24.79 GBP |
| zone2 | 29 | 522 | 8.54 GBP | 36.29 GBP |

## Recommended Bands

| Band | Postcodes |
|---|---:|
| outer_manual_or_motorbike_only | 31 |
| standard_free_candidate_priority_available | 21 |
| standard_paid_priority_available | 25 |
| standard_premium_review_priority_optional | 22 |

## Most Expensive Urgent Candidates

| Zone | Outward | 3-hour | 2-hour | 1-hour | Band |
|---|---|---:|---:|---:|---|
| outer | W7 | 48.06 GBP | 57.56 GBP | 57.56 GBP | outer_manual_or_motorbike_only |
| outer | E6 | 40.02 GBP | 49.90 GBP | 49.90 GBP | outer_manual_or_motorbike_only |
| outer | E12 | 37.79 GBP | 47.76 GBP | 47.76 GBP | outer_manual_or_motorbike_only |
| outer | SW19 | 38.15 GBP | 46.91 GBP | 46.91 GBP | outer_manual_or_motorbike_only |
| outer | SE19 | 37.46 GBP | 46.50 GBP | 46.50 GBP | outer_manual_or_motorbike_only |
| outer | E11 | 37.46 GBP | 46.06 GBP | 46.06 GBP | outer_manual_or_motorbike_only |
| outer | E16 | 37.20 GBP | 46.06 GBP | 46.06 GBP | outer_manual_or_motorbike_only |
| outer | SE6 | 37.20 GBP | 46.06 GBP | 46.06 GBP | outer_manual_or_motorbike_only |
| outer | E17 | 36.02 GBP | 45.22 GBP | 45.22 GBP | outer_manual_or_motorbike_only |
| outer | W13 | 34.54 GBP | 43.94 GBP | 43.94 GBP | outer_manual_or_motorbike_only |
| outer | E7 | 33.95 GBP | 43.51 GBP | 43.51 GBP | outer_manual_or_motorbike_only |
| outer | SE13 | 31.93 GBP | 41.81 GBP | 41.81 GBP | outer_manual_or_motorbike_only |

## Product Implication

- Standard 3-hour collection can be productised widely, but outer postcodes need paid or premium pricing.
- Priority 2-hour and urgent 1-hour service should be postcode-aware, not globally promised.
- Keep motorbike quotes for fallback even where pushbike is cheaper.
- The single N1 1-hour motorcycle 502 should be retested before final pricing import.
