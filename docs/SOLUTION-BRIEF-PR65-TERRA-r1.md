# Solution Brief — theme #65 — Terra r1

## 1. Root cause
Product title is stuffed into `data-repair="..."` with text-node `esc()`, which does not encode `"`, so a quoted Shopify title breaks the attribute. Email-quote also fires without a fresh `syncIcorrectQuote()`.

## 2. Solution
Do not put product metadata in HTML attributes. Set `repair` / `handle` / `type` / `route` on the card via DOM (`dataset`) after insert, or use an attribute-safe encoder. Call `syncIcorrectQuote()` immediately before *every* quote-events capture (shown, proceed, email). Deploy only after hub #432 is live (unknown keys 400 the whole beacon).

## 3. Adjacent risks
- Diagnostic card uses the same `esc()` in `data-repair` — same sink, same fix
- Hostile title with `"` must be covered by a test, not only Chromium anecdote
- Hub merge-order is operational, not a theme code bug — do not “fix” it by sending unknown keys more softly

## 4. Done when (2–3 tests Terra can’t ignore)
1. Product title `Repair " onmouseover="xss` does not produce a new attribute/handler in the quote card DOM
2. Email-quote capture payload includes the current card’s repair title/handle after a card is shown
3. Shown/proceed/email all go through one sync-then-payload path
