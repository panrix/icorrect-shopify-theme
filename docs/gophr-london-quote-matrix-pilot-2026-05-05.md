# Gophr London Quote Matrix Pilot

**Generated:** 2026-05-05T04:20:27+00:00
**Mode:** live API call
**Base URL:** `https://api.gophr.com/v2-commercial-api`
**Quote date:** `2026-05-05`
**Rows written:** 180
**Successful quotes:** 180
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
- W1T: The Fitzroy Tavern, 16 Charlotte Street, London, W1T 2LY (https://fitzroytavern.co.uk/contact/)
- W1W: The Yorkshire Grey, 46 Langham Street, London, W1W 7AX (public commercial address)
- SW1: Buckingham Palace, Buckingham Palace, London, SW1A 1AA (public landmark address)
- SW18: Southside Shopping Centre, Wandsworth High Street, London, SW18 4TF (https://www.southsidewandsworth.com/en)
- SW11: Battersea Power Station, 1 Electric Boulevard, London, SW11 8BJ (https://batterseapowerstation.co.uk/contact-us/)
- EC1: Sadler's Wells Theatre, Rosebery Avenue, London, EC1R 4TN (public venue address)
- E1: Whitechapel Gallery, 77-82 Whitechapel High Street, London, E1 7QX (public venue address)
- N1: Business Design Centre, 52 Upper Street, London, N1 0QH (public venue address)
- NW1: The British Library, 96 Euston Road, London, NW1 2DB (public landmark address)
- SE1: National Theatre, Upper Ground, London, SE1 9PX (public venue address)
- E14: One Canada Square, One Canada Square, London, E14 5AB (public landmark address)
- W8: Design Museum, 224-238 Kensington High Street, London, W8 6AG (public venue address)
- WC2: Royal Opera House, Bow Street, London, WC2E 9DD (public venue address)
- N16: Stoke Newington Town Hall, 71 Stoke Newington Church Street, London, N16 0JR (public civic venue address)
- W5: Ealing Broadway Shopping Centre, The Broadway, London, W5 5JY (https://www.ealing.com/ealing-broadway/)

## Price Range By Pilot Postcode

| Outward | Successful quotes | Cheapest gross | Most expensive gross |
|---|---:|---:|---:|
| E1 | 12 | 11.28 GBP | 14.03 GBP |
| E14 | 12 | 15.73 GBP | 23.84 GBP |
| EC1 | 12 | 8.54 GBP | 10.48 GBP |
| N1 | 12 | 9.58 GBP | 12.12 GBP |
| N16 | 12 | 14.36 GBP | 19.55 GBP |
| NW1 | 12 | 8.54 GBP | 8.95 GBP |
| SE1 | 12 | 8.54 GBP | 12.00 GBP |
| SW1 | 12 | 8.54 GBP | 9.37 GBP |
| SW11 | 12 | 12.14 GBP | 15.72 GBP |
| SW18 | 12 | 17.27 GBP | 24.01 GBP |
| W1T | 12 | 8.54 GBP | 8.95 GBP |
| W1W | 12 | 8.54 GBP | 8.95 GBP |
| W5 | 12 | 22.27 GBP | 33.62 GBP |
| W8 | 12 | 11.80 GBP | 13.54 GBP |
| WC2 | 12 | 8.54 GBP | 8.95 GBP |

## Cheapest And Most Expensive Rows

- Cheapest: W1T economy_9_18 pushbike at 8.54 GBP.
- Most expensive: W5 tight_15_18 motorcycle at 33.62 GBP.

## Tight Window Behaviour

- No service windows failed in the pilot.
- Scheduled three-hour windows were feasible for every pilot postcode, but outer postcodes became materially more expensive.
- The `direct_now_asap` rows are **not** the Gophr UI's "Direct - No stopping" product. They are ASAP quote rows with no direct/no-stopping API flag set.

| Outward | Window | Vehicle | Gross |
|---|---|---|---:|
| W5 | tight_9_12 | motorcycle | 33.62 GBP |
| W5 | tight_12_15 | motorcycle | 33.62 GBP |
| W5 | tight_15_18 | motorcycle | 33.62 GBP |
| W5 | tight_9_12 | pushbike | 30.52 GBP |
| W5 | tight_12_15 | pushbike | 30.52 GBP |
| W5 | tight_15_18 | pushbike | 30.52 GBP |
| SW18 | tight_9_12 | pushbike | 24.01 GBP |
| SW18 | tight_12_15 | pushbike | 24.01 GBP |

## Pushbike Vs Motorcycle

| Outward | Window | Pushbike gross | Motorcycle gross | Motorbike delta |
|---|---|---:|---:|---:|
| E14 | economy_9_18 | 15.73 GBP | 19.24 GBP | 3.51 GBP |
| E14 | economy_12_18 | 15.73 GBP | 19.24 GBP | 3.51 GBP |
| E14 | direct_now_asap | 15.73 GBP | 19.24 GBP | 3.51 GBP |
| SE1 | tight_9_12 | 8.54 GBP | 12.00 GBP | 3.46 GBP |
| SE1 | tight_12_15 | 8.54 GBP | 12.00 GBP | 3.46 GBP |
| SE1 | tight_15_18 | 8.54 GBP | 12.00 GBP | 3.46 GBP |
| SW11 | tight_9_12 | 12.50 GBP | 15.72 GBP | 3.22 GBP |
| SW11 | tight_12_15 | 12.50 GBP | 15.72 GBP | 3.22 GBP |
| SW11 | tight_15_18 | 12.50 GBP | 15.72 GBP | 3.22 GBP |
| W5 | tight_9_12 | 30.52 GBP | 33.62 GBP | 3.10 GBP |
| W5 | tight_12_15 | 30.52 GBP | 33.62 GBP | 3.10 GBP |
| W5 | tight_15_18 | 30.52 GBP | 33.62 GBP | 3.10 GBP |

## Recommendations For Scaling

- Keep the baseline parcel profile fixed while expanding coverage, otherwise postcode effects and parcel effects will be mixed.
- Expand in outward-code batches with a conservative stop condition for repeated HTTP or validation failures.
- Store both vehicle quotes even where one is consistently cheaper; the returned vehicle type can reveal Gophr substitutions or availability constraints.
- Keep `direct_now_asap` separate from scheduled windows because it has no pickup-after or delivery-before constraints in the payload and does not represent the UI's direct/no-stopping price.
- To price the true premium/direct product, inspect the browser request made by the Gophr UI or ask Gophr which quote field selects "Direct - No stopping".
- Use public/commercial representative addresses for each outward code and keep source notes beside the address list.

## Raw Result Notes

- Full row-level output is in `data/gophr-london-quote-matrix-pilot-2026-05-05.csv`.
