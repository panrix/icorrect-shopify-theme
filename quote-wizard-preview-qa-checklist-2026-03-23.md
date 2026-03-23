# Quote Wizard Preview QA Checklist

**Date:** 2026-03-23
**Scope:** Preview verification for the local quote wizard fixes before commit/push
**Related review:** `quote-wizard-qa-review-2026-03-23.md`

## Goal

Verify that the latest local fixes behave correctly in a Shopify theme preview before any commit or push.

## Preconditions

- Use a non-live preview theme.
- Make sure the quote wizard section is present on the relevant page templates.
- Use a browser where you can inspect the cart and watch webhook behavior.
- If possible, have access to:
  - a test inbox for quote emails
  - n8n execution logs or Intercom inbox updates

## Pass Criteria

- All critical booking flows complete without the wrong SKU being selected.
- Existing cart contents are handled intentionally, not silently carried into checkout.
- Email/contact success states appear only when the webhook really succeeds.
- MacBook helper selections resolve to the intended model.

## Test Cases

### 1. Clean repair checkout

- Start with an empty cart.
- Open the quote wizard on preview.
- Choose a standard repair path with a direct booking result.
  Example: `iPhone 16 Pro Max` -> `Rear Glass` -> `Cracked back glass`
- Select service options and proceed to checkout.
- Confirm:
  - only the intended repair product is in checkout
  - the service add-on is present
  - no unrelated items appear

Expected result: clean repair-only checkout.

### 2. Existing cart warning

- Add a random non-repair item to cart first.
- Return to the quote wizard and complete a booking flow.
- Click `Proceed to checkout`.
- Confirm:
  - a warning appears saying the cart will be replaced
  - cancelling the prompt keeps the user on the wizard
  - accepting the prompt clears the old cart and proceeds with only wizard items

Expected result: no silent cart contamination.

### 3. iPhone 11 screen SKU selection

- Run:
  - `iPhone 11` -> `Screen / Display` -> `Cracked glass (touch still works)`
  - `iPhone 11` -> `Screen / Display` -> `Black screen (phone still vibrates/rings)`
- Confirm:
  - cracked-glass route uses the normal iPhone 11 screen product
  - black-screen route uses the no-screen-message LCD product if that is the intended SKU
  - title and price shown in the result card match the selected product

Expected result: issue-aware screen SKU resolution.

### 4. Rear glass vs housing preference

- Run:
  - `iPhone 16 Pro Max` -> `Rear Glass` -> `Cracked back glass`
  - one older model where only housing-style rear glass exists, such as `iPhone 11`
- Confirm:
  - newer model prefers dedicated `rear-glass-repair`
  - older model falls back cleanly to housing-based rear glass product when needed
  - the product title shown matches the expected SKU

Expected result: deterministic rear-glass product selection.

### 5. Contact question webhook success behavior

- Open a result card and click `I have a question first`.
- Submit a valid question.
- Confirm:
  - success message appears only when the webhook actually succeeds
  - if the webhook fails, the form remains usable and shows an error

Expected result: no false-positive success state.

### 6. Email quote webhook success behavior

- Open a repair or diagnostic result.
- Click `Email me this quote`.
- Submit a valid name and email.
- Confirm:
  - success state appears only after a real successful response
  - the email payload includes the correct model, fault, issue, price, service, and product URL
  - if the webhook fails, the UI shows an error instead of `Sent!`

Expected result: truthful quote email success/failure handling.

### 7. A2338 MacBook helper disambiguation

- Open the MacBook wizard.
- Use the model helper and search for `A2338`.
- Confirm:
  - the helper shows separate M1 and M2 entries
  - selecting each one lands on the correct configured model
  - subsequent repair pricing corresponds to the chosen model family

Expected result: no M1/M2 cross-selection.

## Notes To Capture During Preview

- Page used for test
- Device/model/fault/issue path tested
- Product title shown in result card
- Product(s) present in cart/checkout
- Whether webhook succeeded or failed
- Whether UI messaging matched reality

## Outcome Log

- `PASS`:
- `FAIL`:
- `Needs follow-up`:
