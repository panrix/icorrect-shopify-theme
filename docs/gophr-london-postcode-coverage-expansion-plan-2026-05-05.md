# Gophr London Postcode Coverage Expansion Plan

**Date:** 2026-05-05  
**Branch:** `codex/shopify-website-2026-05-04`  
**Purpose:** Expand the courier postcode matrix without mixing Zone 1, Zone 2, and outer-London assumptions.

## What We Learned So Far

- Small parcel assumptions match the Gophr UI: 20 x 15 x 5 cm, 0.5kg, no insurance, not fragile, not glass.
- Three-hour windows are feasible in the central pilot and remain relatively affordable.
- Two-hour windows are feasible but can jump quickly, especially east/wider central.
- One-hour windows are feasible in the central pilot but should be treated as premium.
- The API rows marked `direct_now_asap` are not the Gophr UI's "Direct - No stopping" service. We need the hidden UI field or Gophr confirmation before pricing that product.

## Recommended Matrix Shape

For each representative outward postcode, quote:

- pushbike, 3-hour collection window
- motorcycle, 3-hour collection window
- pushbike, 2-hour collection window
- motorcycle, 2-hour collection window
- pushbike, 1-hour collection window
- motorcycle, 1-hour collection window

Use these baseline windows first:

- 3-hour: 9-12, 12-15, 15-18
- 2-hour: 9-11, 12-14, 15-17
- 1-hour: 9-10, 12-13, 15-16

Keep gross and net prices. For customer-facing products, make decisions from gross cost plus margin/subsidy.

## Coverage Phases

### Phase A: Zone 1 Dense Central

Goal: establish the cheap/fast core where same-day collection can be confidently offered.

Suggested outward coverage:

- `W1`, `W1B`, `W1C`, `W1D`, `W1F`, `W1G`, `W1H`, `W1J`, `W1K`, `W1S`, `W1T`, `W1U`, `W1W`
- `WC1`, `WC2`
- `EC1`, `EC2`, `EC3`, `EC4`
- `SW1`
- `SE1`
- `NW1`
- `N1`
- `E1`

### Phase B: Zone 2 Core Residential / Commercial

Goal: find where pushbike still works and where motorcycle starts to become the safer default.

Suggested outward coverage:

- West/southwest: `W2`, `W8`, `W9`, `W10`, `W11`, `W14`, `SW3`, `SW5`, `SW6`, `SW7`, `SW10`, `SW11`
- South/east: `SE5`, `SE11`, `SE15`, `SE16`, `E2`, `E3`, `E8`, `E9`, `E14`
- North/northwest: `N4`, `N5`, `N7`, `N16`, `NW3`, `NW5`, `NW6`, `NW8`

### Phase C: Zone 3 And Zone 4 Feasibility

Goal: separate "same-day possible" from "same-day premium only".

For these areas, default to motorcycle-first mapping and only retain pushbike if Gophr returns feasible/competitive quotes.

Suggested first pass:

- West: `W3`, `W4`, `W5`, `W6`, `W7`, `W12`, `W13`
- Southwest: `SW4`, `SW8`, `SW9`, `SW12`, `SW13`, `SW15`, `SW16`, `SW17`, `SW18`, `SW19`
- Southeast: `SE4`, `SE6`, `SE8`, `SE10`, `SE13`, `SE14`, `SE17`, `SE19`, `SE21`, `SE22`, `SE23`, `SE24`
- East: `E5`, `E6`, `E7`, `E10`, `E11`, `E12`, `E15`, `E16`, `E17`
- North/northwest: `N2`, `N6`, `N8`, `N10`, `N15`, `N19`, `NW2`, `NW10`, `NW11`

## Product Strategy

Create customer-facing Shopify courier products from bands, not raw Gophr rows:

- Standard London Collection: based on 3-hour gross cost plus margin/subsidy.
- Priority London Collection: based on 2-hour gross cost plus margin.
- Urgent London Collection: based on 1-hour gross cost plus premium margin.

For Phase 1, show only Standard unless the postcode/window matrix proves Priority and Urgent are reliable for that postcode band.

## Operational Guardrails

- Treat the chosen customer window as a preferred/target collection window until courier booking automation can monitor assignments.
- If a job is not assigned or collection is not progressing near the final hour of the preferred window, trigger proactive customer messaging from ops automation.
- Keep same-day claims postcode-aware. Outer zones should not inherit Zone 1 promises.

