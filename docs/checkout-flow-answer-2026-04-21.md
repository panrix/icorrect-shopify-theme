# Checkout flow — answers to audit §3 questions

**Ref:** `docs/marketing-jarvis-audit-2026-04-21.md` §3

## Q1. How is the repair price passed to checkout?

The quote wizard (`sections/quote-wizard.liquid` → `buildCartItems()`, line ~1838) constructs a **2–3 line-item cart** before hitting `/cart/add.js`:

| # | Line item | Source | Price range |
|---|---|---|---|
| 1 | **Main repair product** (the actual fix) | Matched by repair type → Shopify variant id via `_repairsMap` | £49 – £479 (from 58 real April orders) |
| 2 | **Speed upgrade** *(optional)* | Express option card, separate variant id | Varies by product |
| 3 | **Service type** | Walk-in (variant `46150013387005`, **£0**) **or** Mail-in (variant `47019145789693`, **£20**) | £0 / £20 |

The direct `/cart/add.js` call includes all three items with full metadata (`_device`, `_model`, `_fault`, `_issue`, `Device Color`, `Preferred Date`, `Preferred Time`) as line item properties. Full repair price hits checkout, not £0.

## Q2. Is payment collected online or in-store?

**Online.** Shopify Payments / Shop Pay on `checkout.shopify.com`. The 46 April Purchase events reaching Meta with populated `value` / `currencyCode` confirm real card capture. No "book now pay later" flow exists.

## Q3. What does checkout look like for a paid repair (not the £0 walk-in)?

The checkout total is **repair price + optional speed upgrade + service type (£0 walk-in or £20 mail-in) + tax**. For a typical iPhone screen at £79 walk-in: subtotal £79, shipping £0, total £79.

### Likely cause of the audit's "Your order is free" observation

The auditor probably added the **walk-in-service product in isolation** (without going through the wizard) — variant `46150013387005` is £0 on its own. That single-item cart would indeed show "Your order is free." A real wizard-generated cart always carries the repair line (#1) as the anchor item.

### Verification

```bash
# 58 Shopify web orders since 2026-03-25, totals range £49 – £479
# 46 Meta Purchase events in April with matching value/currency
```

Neither number is consistent with a £0-dominant checkout.

## Follow-ups worth doing anyway (still in audit §3)

- **Google Pay missing from cart page** — confirmed; only appears on checkout. Requires theme edit in `snippets/cart-drawer.liquid` + `sections/cart.liquid`.
- **Reduce checkout required fields** — the 8 fields are `name / email / address line 1 / city / postcode / country / phone` + consent. Address block is mandated by Shopify for physical-goods SKUs (walk-in/mail-in both count). Making address optional would require switching to Shopify's "digital product" checkout behaviour, which blocks shipping labels for the mail-in flow — not recommended.
