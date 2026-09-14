# Conversion notes — quotes → orders (Ricky 2026-09-14)

Context: ~£17k quoted, ~1 order. This PR ships diagnostic honesty + shorter clocks. Two further levers:

## 1. Soft lead-gate before the price (recommended next)

Industry pattern: capture email (and optionally name/phone) **before** revealing the fixed price, or immediately on “Email me this quote” as a required step earlier.

Why it helps here:
- Today we hand out priced quotes for free; most walk away and we cannot follow up.
- With contact + device/fault/repair already in Supabase (`quote_events`), we can email: clarify turnaround, offer express, or help them choose a cheaper path — still useful even if they go elsewhere.

Suggested UX (do not block checkout path for people ready to buy):
1. After fault selected, before all-in price: “Where should we send this quote?” (email required, name optional).
2. Show price + journey immediately after.
3. Beacon `quote_email_requested` / contact fields on that submit (already supported).

Trade-off: fewer anonymous quotes, higher quality leads. Worth it at 1/£17k conversion.

## 2. Express mail-in when stocked

Customers already ask for 1-day mail-in and pay extra. Stock is the constraint for courier; mail-in can wait on parts.

Suggested offer:
- Default: current working-day clock.
- If parts in stock (Monday/catalogue flag): “Express — diagnosed/repaired next working day” +£X.
- Only show when stock flag is true so we do not over-promise empty drawers.

## 3. What this PR already changes for conversion
- Diagnostic journey no longer says collect → repair → return.
- It now says collect/send pack → diagnose & email quote by {date} → you decide (device stays).
- MacBook/iPad known repair promised at **1 working day** (watch stays 3 for adhesive). Prefer too much demand over idle benches.
