# Walk-in booking blackout: Monday 31 August 2026

## Reason

Monday 31 August 2026 is the UK Late Summer Bank Holiday. iCorrect should not accept walk-in appointment bookings for that date from either the quote wizard or normal product booking flow.

This follows the same one-off blackout map as Early May (`docs/walk-in-bank-holiday-blackout-2026-05-04.md`). The May 4 entry stays in the JS maps.

## Theme paths covered

- `sections/quote-wizard.liquid`
  - Rejects `2026-08-31` when selected in the quote wizard walk-in date picker.
  - Skips `2026-08-31` when auto-selecting the next available walk-in slot.

- `snippets/additional-repair.liquid`
  - Rejects `2026-08-31` in the normal product-page walk-in booking date picker.
  - Uses the same one-off blackout message pattern as the quote wizard.

- `sections/main-cart-footer.liquid`
  - Adds a defensive cart checkout guard for stale carts that already contain a walk-in line item with `Preferred Date` of `2026-08-31` or `2026-05-04`.
  - Disables the cart checkout button and hides accelerated checkout buttons until the invalid walk-in appointment is removed.

## Customer-facing message

> We are closed on Monday 31 August 2026 for the UK bank holiday. Please choose another weekday.

The cart guard uses a slightly longer version asking the customer to remove the invalid walk-in appointment and choose another weekday.

## Deployment note

This is a theme-code change only. Commit and push to GitHub, but do not deploy to Shopify until the theme deploy step is explicitly approved.
