# Gophr London Quote Matrix Pilot

**Generated:** 2026-05-05T04:34:50+00:00
**Mode:** live API call
**Base URL:** `https://api.gophr.com/v2-commercial-api`
**Quote date:** `2026-05-05`
**Destination set:** `central-short`
**Window set:** `short-windows`
**Rows written:** 72
**Successful quotes:** 72
**Stopped early:** no

## Safety

- The script reads `GOPHR_API_KEY` from the local environment or the approved local env file.
- The API key is never printed, logged, or written to this file.
- Jobs are requested as unconfirmed quote probes, not confirmed courier bookings.
- `direct_now_asap` is an ASAP quote; no direct/no-stopping flag was set because the public quote reference did not document one.

## Parcel And Vehicles

- Parcel: 20 x 15 x 5 cm, 0.5kg, insurance 0, not fragile, not glass.
- Vehicles: pushbike (`10`) and motorcycle (`20`).

## Pilot Addresses

- Origin: 12 Margaret Street, London, W1W 8JQ
- W1: Apple Regent Street, 235 Regent Street, London, W1B 2EL (public commercial address)
- SW1: Buckingham Palace, Buckingham Palace, London, SW1A 1AA (public landmark address)
- NW1: The British Library, 96 Euston Road, London, NW1 2DB (public landmark address)
- E1: Whitechapel Gallery, 77-82 Whitechapel High Street, London, E1 7QX (public venue address)

## Price Range By Pilot Postcode

| Outward | Successful quotes | Cheapest gross | Most expensive gross |
|---|---:|---:|---:|
| E1 | 18 | 11.28 GBP | 24.79 GBP |
| NW1 | 18 | 8.54 GBP | 16.30 GBP |
| SW1 | 18 | 8.54 GBP | 16.73 GBP |
| W1 | 18 | 8.54 GBP | 16.30 GBP |

## Cheapest And Most Expensive Rows

- Cheapest: W1 three_hour_9_12 pushbike at 8.54 GBP.
- Most expensive: E1 one_hour_15_16 motorcycle at 24.79 GBP.

## Tight Window Behaviour

- No service windows failed in the pilot.
- One-hour windows were feasible for all four central postcodes, but they cost materially more than three-hour windows.
- Two-hour windows sit in the middle: still feasible, but already meaningfully more expensive for SW1, NW1, and especially E1.

## Window Compression Summary

Gross prices below are stable across the three tested start times for each window length.

| Outward | Vehicle | 3-hour gross | 2-hour gross | 1-hour gross |
|---|---|---:|---:|---:|
| W1 | pushbike | 8.54 GBP | 9.74 GBP | 15.56 GBP |
| W1 | motorcycle | 8.95 GBP | 11.99 GBP | 16.30 GBP |
| SW1 | pushbike | 8.54 GBP | 12.48 GBP | 15.56 GBP |
| SW1 | motorcycle | 9.37 GBP | 14.33 GBP | 16.73 GBP |
| NW1 | pushbike | 8.54 GBP | 12.31 GBP | 15.56 GBP |
| NW1 | motorcycle | 8.95 GBP | 13.69 GBP | 16.30 GBP |
| E1 | pushbike | 11.28 GBP | 17.50 GBP | 20.54 GBP |
| E1 | motorcycle | 14.03 GBP | 21.94 GBP | 24.79 GBP |

## Pushbike Vs Motorcycle

| Outward | Window | Pushbike gross | Motorcycle gross | Motorbike delta |
|---|---|---:|---:|---:|
| E1 | two_hour_9_11 | 17.50 GBP | 21.94 GBP | 4.44 GBP |
| E1 | two_hour_12_14 | 17.50 GBP | 21.94 GBP | 4.44 GBP |
| E1 | two_hour_15_17 | 17.50 GBP | 21.94 GBP | 4.44 GBP |
| E1 | one_hour_9_10 | 20.54 GBP | 24.79 GBP | 4.25 GBP |
| E1 | one_hour_12_13 | 20.54 GBP | 24.79 GBP | 4.25 GBP |
| E1 | one_hour_15_16 | 20.54 GBP | 24.79 GBP | 4.25 GBP |
| E1 | three_hour_9_12 | 11.28 GBP | 14.03 GBP | 2.75 GBP |
| E1 | three_hour_12_15 | 11.28 GBP | 14.03 GBP | 2.75 GBP |
| E1 | three_hour_15_18 | 11.28 GBP | 14.03 GBP | 2.75 GBP |
| W1 | two_hour_9_11 | 9.74 GBP | 11.99 GBP | 2.25 GBP |
| W1 | two_hour_12_14 | 9.74 GBP | 11.99 GBP | 2.25 GBP |
| W1 | two_hour_15_17 | 9.74 GBP | 11.99 GBP | 2.25 GBP |

## Recommendations For Scaling

- Keep the baseline parcel profile fixed while expanding coverage, otherwise postcode effects and parcel effects will be mixed.
- Expand in outward-code batches with a conservative stop condition for repeated HTTP or validation failures.
- Store both vehicle quotes even where one is consistently cheaper; the returned vehicle type can reveal Gophr substitutions or availability constraints.
- Keep `direct_now_asap` separate from scheduled windows because it has no pickup-after or delivery-before constraints in the payload.
- Use public/commercial representative addresses for each outward code and keep source notes beside the address list.

## Raw Result Notes

- Full row-level output is in `data/gophr-central-short-window-matrix-2026-05-05.csv`.
