# Quote wizard phase 1: result step

Draft for Ricky's preview test. Built on the live wizard (logic, flow, tracking unchanged), with the result-step look taken from the 11 Oct design (`panrix/icorrect-web`, `design/quote-wizard-upgrade/`) and finished against Untitled UI patterns.

## What changes for the customer

| Area | Before | After |
|---|---|---|
| Wizard sub-heading | "We'll collect your MacBook same day in London, nationwide by courier." | "Courier collection in London, tracked mail-in across the UK." |
| Postcode after entry | Full input box stays open | One line: postcode, area, Change |
| Outside London | "Same Day Courier isn't available for your postcode. We've switched you to tracked mail-in." | One card: "Free tracked mail-in", box with prepaid label, drop at a Post Office, returned tracked |
| London options | Collection windows only | Free courier collection (default) or Bring it to our workshop |
| Walk-in | Not offered | Pick a drop-off day and window. Today is offered Mon to Fri until 5pm London time; after midday only the afternoon window. Friday mornings open at 10am |
| Timeline | 4 small columns plus a separate return box | 11 Oct numbered steps (stacked on phone, across on desktop) and one "Back with you" date |
| Price | "All-in total" | 11 Oct total card with the Klarna badge and Pay in 3 line |
| Trust | 4.9 / 719, "Original parts", "Double the standard" | 4.8 / 750+, "Genuine Apple displays" (screen repairs), "On every repair" |
| Sticky "£ · Book now" bar | Shown on phones, covered the price | Removed |
| Scrolling on phones | After a London postcode the page jumped past the date picker to the price | Stops on the date picker; moves to Proceed once a window is picked |

## What changes in the order

- Walk-in orders carry `Service Type: Walk-in`, `Drop-off Date`, `Drop-off Window`, `Postcode`, `Return by`. No courier fee line. Monday's existing walk-in automation should pick these up: please confirm on the preview.
- Courier and mail-in properties are unchanged.

## Files

- `assets/quote-wizard.js`: phase 1 changes.
- `assets/quote-wizard-walkin.js` (new, 3.4 KB): walk-in dates, windows and timeline. Separate so `quote-wizard.js` stays under Shopify's 256 KB asset limit. It is now 261,574 of 262,144 bytes, so the next change to it will need a split like this one.
- `assets/quote-wizard.css`: styles appended at the end.
- `sections/quote-wizard.liquid`: sub-heading copy, the walk-in script tag, and a `<template id="qwKlarnaBadge">` filled by Shopify's `payment_type_svg_tag` (official Klarna icon).

## How it was checked

- The live section rendered locally with the repo catalogue (`assets/repair-catalogue-map.json`, `data/shopify-catalogue-2026-09-11.json`), stepped through MacBook Pro 14" A2442, cracked screen, London (W1T 3AB) and outside London (M1 4BT).
- 14 runs at 320, 360, 375, 390, 430, 1280 and 1440 px: after every answer the next thing to fill is on screen, no horizontal scroll, every tap target 44 px or more.
- Walk-in at simulated Mon 10am, 2pm, 6pm and Fri 9am: dates, windows and cart properties as above.
- `node --test scripts/courier/*.test.js scripts/**/*.test.js`: 241 of 245 pass, the same 4 that fail on `main`.

Not checked here: the real Shopify checkout, Klarna eligibility, and Monday intake. Those need the preview theme.

## Screenshots (390 px phone)

Before: `before-london-390.jpg`, `before-mailin-390.jpg`. After: `after-london-390.jpg`, `after-walkin-390.jpg`, `after-mailin-390.jpg`. Desktop: `after-london-1440.jpg`, `after-mailin-1440.jpg`.
