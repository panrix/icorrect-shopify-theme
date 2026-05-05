# Gophr London Quote Matrix Pilot

**Generated:** 2026-05-05T05:14:39+00:00
**Mode:** live API call
**Base URL:** `https://api.gophr.com/v2-commercial-api`
**Quote date:** `2026-05-05`
**Destination set:** `pilot`
**Window set:** `short-windows`
**Rows written:** 414
**Successful quotes:** 413
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
- zone1 / W1B: Apple Regent Street, 235 Regent Street, London, W1B 2EL (public commercial address)
- zone1 / W1C: Bond Street Station, Oxford Street, London, W1C 2JS (public transport address)
- zone1 / W1D: Chinatown London, Gerrard Street, London, W1D 6QF (public district address)
- zone1 / W1F: Carnaby Street, Carnaby Street, London, W1F 9PS (public retail address)
- zone1 / W1G: Harley Street Clinic, 35 Weymouth Street, London, W1G 8BJ (public medical address)
- zone1 / W1H: Marble Arch Station, Oxford Street, London, W1H 7EJ (public transport address)
- zone1 / W1J: The Ritz London, 150 Piccadilly, London, W1J 9BR (public hotel address)
- zone1 / W1K: Grosvenor Square, Grosvenor Square, London, W1K 6JP (public square address)
- zone1 / W1S: Savile Row, Savile Row, London, W1S 3PQ (public street address)
- zone1 / W1T: The Fitzroy Tavern, 16 Charlotte Street, London, W1T 2LY (public commercial address)
- zone1 / W1U: Daunt Books Marylebone, 84 Marylebone High Street, London, W1U 4QW (public retail address)
- zone1 / W1W: The Yorkshire Grey, 46 Langham Street, London, W1W 7AX (public commercial address)
- zone1 / WC1: The British Museum, Great Russell Street, London, WC1B 3DG (public landmark address)
- zone1 / WC2: Royal Opera House, Bow Street, London, WC2E 9DD (public venue address)
- zone1 / EC1: Sadler's Wells Theatre, Rosebery Avenue, London, EC1R 4TN (public venue address)
- zone1 / EC2: Liverpool Street Station, Bishopsgate, London, EC2M 7PY (public transport address)
- zone1 / EC3: Tower Hill Station, Trinity Square, London, EC3N 4DJ (public transport address)
- zone1 / EC4: St Paul's Cathedral, St Paul's Churchyard, London, EC4M 8AD (public landmark address)
- zone1 / SW1: Buckingham Palace, Buckingham Palace, London, SW1A 1AA (public landmark address)
- zone1 / SE1: National Theatre, Upper Ground, London, SE1 9PX (public venue address)
- zone1 / NW1: The British Library, 96 Euston Road, London, NW1 2DB (public landmark address)
- zone1 / N1: Business Design Centre, 52 Upper Street, London, N1 0QH (public venue address)
- zone1 / E1: Whitechapel Gallery, 77-82 Whitechapel High Street, London, E1 7QX (public venue address)

## Price Range By Pilot Postcode

| Outward | Successful quotes | Cheapest gross | Most expensive gross |
|---|---:|---:|---:|
| E1 | 18 | 11.28 GBP | 24.79 GBP |
| EC1 | 18 | 8.54 GBP | 17.99 GBP |
| EC2 | 18 | 10.43 GBP | 22.68 GBP |
| EC3 | 18 | 10.60 GBP | 22.68 GBP |
| EC4 | 18 | 8.89 GBP | 19.27 GBP |
| N1 | 17 | 9.77 GBP | 19.69 GBP |
| NW1 | 18 | 8.54 GBP | 16.30 GBP |
| SE1 | 18 | 8.54 GBP | 19.69 GBP |
| SW1 | 18 | 8.54 GBP | 16.73 GBP |
| W1B | 18 | 8.54 GBP | 16.30 GBP |
| W1C | 18 | 8.54 GBP | 16.30 GBP |
| W1D | 18 | 8.54 GBP | 16.30 GBP |
| W1F | 18 | 8.54 GBP | 16.30 GBP |
| W1G | 18 | 8.54 GBP | 16.30 GBP |
| W1H | 18 | 8.54 GBP | 16.30 GBP |
| W1J | 18 | 8.54 GBP | 16.30 GBP |
| W1K | 18 | 8.54 GBP | 16.30 GBP |
| W1S | 18 | 8.54 GBP | 16.30 GBP |
| W1T | 18 | 8.54 GBP | 16.30 GBP |
| W1U | 18 | 8.54 GBP | 16.30 GBP |
| W1W | 18 | 8.54 GBP | 16.30 GBP |
| WC1 | 18 | 8.54 GBP | 16.30 GBP |
| WC2 | 18 | 8.54 GBP | 16.30 GBP |

## Cheapest And Most Expensive Rows

- Cheapest: W1B three_hour_9_12 pushbike at 8.54 GBP.
- Most expensive: E1 one_hour_15_16 motorcycle at 24.79 GBP.

## Tight Window Behaviour

- one_hour_9_10: 1 failed quote rows.

## Pushbike Vs Motorcycle

| Outward | Window | Pushbike gross | Motorcycle gross | Motorbike delta |
|---|---|---:|---:|---:|
| SE1 | two_hour_9_11 | 12.65 GBP | 17.52 GBP | 4.87 GBP |
| SE1 | two_hour_12_14 | 12.65 GBP | 17.52 GBP | 4.87 GBP |
| SE1 | two_hour_15_17 | 12.65 GBP | 17.52 GBP | 4.87 GBP |
| E1 | two_hour_9_11 | 17.50 GBP | 21.94 GBP | 4.44 GBP |
| E1 | two_hour_12_14 | 17.50 GBP | 21.94 GBP | 4.44 GBP |
| E1 | two_hour_15_17 | 17.50 GBP | 21.94 GBP | 4.44 GBP |
| E1 | one_hour_9_10 | 20.54 GBP | 24.79 GBP | 4.25 GBP |
| E1 | one_hour_12_13 | 20.54 GBP | 24.79 GBP | 4.25 GBP |
| E1 | one_hour_15_16 | 20.54 GBP | 24.79 GBP | 4.25 GBP |
| SE1 | one_hour_9_10 | 15.56 GBP | 19.69 GBP | 4.13 GBP |
| SE1 | one_hour_12_13 | 15.56 GBP | 19.69 GBP | 4.13 GBP |
| SE1 | one_hour_15_16 | 15.56 GBP | 19.69 GBP | 4.13 GBP |

## Recommendations For Scaling

- Keep the baseline parcel profile fixed while expanding coverage, otherwise postcode effects and parcel effects will be mixed.
- Expand in outward-code batches with a conservative stop condition for repeated HTTP or validation failures.
- Store both vehicle quotes even where one is consistently cheaper; the returned vehicle type can reveal Gophr substitutions or availability constraints.
- Keep `direct_now_asap` separate from scheduled windows because it has no pickup-after or delivery-before constraints in the payload.
- Use public/commercial representative addresses for each outward code and keep source notes beside the address list.

## Raw Result Notes

- Full row-level output is in `data/gophr-london-coverage-zone1-matrix-2026-05-05.csv`.
