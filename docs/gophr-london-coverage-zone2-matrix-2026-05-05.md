# Gophr London Quote Matrix Pilot

**Generated:** 2026-05-05T05:24:38+00:00
**Mode:** live API call
**Base URL:** `https://api.gophr.com/v2-commercial-api`
**Quote date:** `2026-05-05`
**Destination set:** `pilot`
**Window set:** `short-windows`
**Rows written:** 522
**Successful quotes:** 522
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
- zone2 / W2: Paddington Station, Praed Street, London, W2 1HQ (public transport address)
- zone2 / W8: Design Museum, 224-238 Kensington High Street, London, W8 6AG (public venue address)
- zone2 / W9: Maida Vale Station, Elgin Avenue, London, W9 1JS (public transport address)
- zone2 / W10: Museum of Brands, 111-117 Lancaster Road, London, W10 6HJ (public venue address)
- zone2 / W11: Notting Hill Gate Station, Notting Hill Gate, London, W11 3HT (public transport address)
- zone2 / W14: Olympia London, Hammersmith Road, London, W14 8UX (public venue address)
- zone2 / SW3: Saatchi Gallery, Duke of York's HQ King's Road, London, SW3 4RY (public venue address)
- zone2 / SW5: Earl's Court Station, Earl's Court Road, London, SW5 9QA (public transport address)
- zone2 / SW6: Stamford Bridge, Fulham Road, London, SW6 1HS (public stadium address)
- zone2 / SW7: Science Museum, Exhibition Road, London, SW7 2DD (public museum address)
- zone2 / SW10: Chelsea and Westminster Hospital, 369 Fulham Road, London, SW10 9NH (public hospital address)
- zone2 / SW11: Battersea Power Station, 1 Electric Boulevard, London, SW11 8BJ (public retail address)
- zone2 / SE5: King's College Hospital, Denmark Hill, London, SE5 9RS (public hospital address)
- zone2 / SE11: Kennington Station, Kennington Park Road, London, SE11 4JQ (public transport address)
- zone2 / SE15: Peckham Rye Station, Station Way, London, SE15 4RX (public transport address)
- zone2 / SE16: Canada Water Station, Deal Porter Way, London, SE16 7BB (public transport address)
- zone2 / E2: Bethnal Green Station, Cambridge Heath Road, London, E2 0ET (public transport address)
- zone2 / E3: Bow Road Station, Bow Road, London, E3 2SJ (public transport address)
- zone2 / E8: Hackney Central Station, Amhurst Road, London, E8 1LL (public transport address)
- zone2 / E9: Hackney Wick Station, White Post Lane, London, E9 5TS (public transport address)
- zone2 / E14: One Canada Square, One Canada Square, London, E14 5AB (public landmark address)
- zone2 / N4: Finsbury Park Station, Station Place, London, N4 2DH (public transport address)
- zone2 / N5: Highbury Fields, Highbury Crescent, London, N5 1AR (public park address)
- zone2 / N7: Emirates Stadium, Hornsey Road, London, N7 7AJ (public stadium address)
- zone2 / N16: Stoke Newington Town Hall, 71 Stoke Newington Church Street, London, N16 0JR (public civic venue address)
- zone2 / NW3: Hampstead Heath Station, South End Road, London, NW3 2QD (public transport address)
- zone2 / NW5: Kentish Town Station, Kentish Town Road, London, NW5 2AA (public transport address)
- zone2 / NW6: Kilburn High Road Station, Kilburn High Road, London, NW6 7QL (public transport address)
- zone2 / NW8: Lord's Cricket Ground, St John's Wood Road, London, NW8 8QN (public stadium address)

## Price Range By Pilot Postcode

| Outward | Successful quotes | Cheapest gross | Most expensive gross |
|---|---:|---:|---:|
| E14 | 18 | 21.08 GBP | 34.99 GBP |
| E2 | 18 | 13.36 GBP | 27.78 GBP |
| E3 | 18 | 19.94 GBP | 36.29 GBP |
| E8 | 18 | 16.62 GBP | 30.74 GBP |
| E9 | 18 | 21.44 GBP | 36.29 GBP |
| N16 | 18 | 17.95 GBP | 29.90 GBP |
| N4 | 18 | 15.67 GBP | 26.93 GBP |
| N5 | 18 | 11.46 GBP | 24.38 GBP |
| N7 | 18 | 12.20 GBP | 26.09 GBP |
| NW3 | 18 | 14.80 GBP | 26.50 GBP |
| NW5 | 18 | 10.78 GBP | 19.69 GBP |
| NW6 | 18 | 11.63 GBP | 25.22 GBP |
| NW8 | 18 | 8.89 GBP | 18.42 GBP |
| SE11 | 18 | 10.60 GBP | 23.94 GBP |
| SE15 | 18 | 18.67 GBP | 32.89 GBP |
| SE16 | 18 | 18.53 GBP | 32.45 GBP |
| SE5 | 18 | 17.81 GBP | 30.34 GBP |
| SW10 | 18 | 13.15 GBP | 23.94 GBP |
| SW11 | 18 | 12.50 GBP | 26.50 GBP |
| SW3 | 18 | 10.94 GBP | 20.98 GBP |
| SW5 | 18 | 13.15 GBP | 23.94 GBP |
| SW6 | 18 | 14.69 GBP | 26.93 GBP |
| SW7 | 18 | 10.51 GBP | 20.12 GBP |
| W10 | 18 | 12.20 GBP | 23.53 GBP |
| W11 | 18 | 10.51 GBP | 20.54 GBP |
| W14 | 18 | 13.36 GBP | 26.09 GBP |
| W2 | 18 | 8.54 GBP | 16.30 GBP |
| W8 | 18 | 11.80 GBP | 24.38 GBP |
| W9 | 18 | 9.86 GBP | 20.12 GBP |

## Cheapest And Most Expensive Rows

- Cheapest: W2 three_hour_9_12 pushbike at 8.54 GBP.
- Most expensive: E9 one_hour_15_16 motorcycle at 36.29 GBP.

## Tight Window Behaviour

- No service windows failed in the pilot.

## Pushbike Vs Motorcycle

| Outward | Window | Pushbike gross | Motorcycle gross | Motorbike delta |
|---|---|---:|---:|---:|
| E3 | one_hour_9_10 | 27.70 GBP | 36.29 GBP | 8.59 GBP |
| E3 | one_hour_12_13 | 27.70 GBP | 36.29 GBP | 8.59 GBP |
| E3 | one_hour_15_16 | 27.70 GBP | 36.29 GBP | 8.59 GBP |
| E3 | two_hour_9_11 | 27.24 GBP | 35.29 GBP | 8.05 GBP |
| E3 | two_hour_12_14 | 27.24 GBP | 35.29 GBP | 8.05 GBP |
| E3 | two_hour_15_17 | 27.24 GBP | 35.29 GBP | 8.05 GBP |
| E9 | one_hour_9_10 | 29.57 GBP | 36.29 GBP | 6.72 GBP |
| E9 | one_hour_12_13 | 29.57 GBP | 36.29 GBP | 6.72 GBP |
| E9 | one_hour_15_16 | 29.57 GBP | 36.29 GBP | 6.72 GBP |
| E14 | one_hour_9_10 | 28.63 GBP | 34.99 GBP | 6.36 GBP |
| E14 | one_hour_12_13 | 28.63 GBP | 34.99 GBP | 6.36 GBP |
| E14 | one_hour_15_16 | 28.63 GBP | 34.99 GBP | 6.36 GBP |

## Recommendations For Scaling

- Keep the baseline parcel profile fixed while expanding coverage, otherwise postcode effects and parcel effects will be mixed.
- Expand in outward-code batches with a conservative stop condition for repeated HTTP or validation failures.
- Store both vehicle quotes even where one is consistently cheaper; the returned vehicle type can reveal Gophr substitutions or availability constraints.
- Keep `direct_now_asap` separate from scheduled windows because it has no pickup-after or delivery-before constraints in the payload.
- Use public/commercial representative addresses for each outward code and keep source notes beside the address list.

## Raw Result Notes

- Full row-level output is in `data/gophr-london-coverage-zone2-matrix-2026-05-05.csv`.
