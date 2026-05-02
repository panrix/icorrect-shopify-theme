# Walk-in booking blackout: Monday 4 May 2026

## Reason

Monday 4 May 2026 is a one-off UK bank holiday. iCorrect should not accept walk-in appointment bookings for that date from either the quote wizard or normal product booking flow.

## Theme paths covered

- `sections/quote-wizard.liquid`
  - Rejects `2026-05-04` when selected in the quote wizard walk-in date picker.
  - Skips `2026-05-04` when auto-selecting the next available walk-in slot.

- `snippets/additional-repair.liquid`
  - Rejects `2026-05-04` in the normal product-page walk-in booking date picker.
  - Uses the same one-off blackout message pattern as the quote wizard.

- `sections/main-cart-footer.liquid`
  - Adds a defensive cart checkout guard for stale carts that already contain a walk-in line item with `Preferred Date = 2026-05-04`.
  - Disables the cart checkout button and hides accelerated checkout buttons until the invalid walk-in appointment is removed.

## Customer-facing message

> We are closed on Monday 4 May 2026 for the UK bank holiday. Please choose another weekday.

The cart guard uses a slightly longer version asking the customer to remove the invalid walk-in appointment and choose another weekday.

## Deployment note

This is a theme-code change only. Commit and push to GitHub, but do not deploy to Shopify until the theme deploy step is explicitly approved.
