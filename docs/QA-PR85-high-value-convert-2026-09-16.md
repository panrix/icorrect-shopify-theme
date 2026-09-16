# QA — PR #85 high-value convert (unpublished)

**HEAD at this note:** `645a82a` plus the Lane A next-working-day clock follow-up on `cursor/quote-contextual-prequal-a035`  
**Preview:** https://icorrect.co.uk/?preview_theme_id=213333442813  
**Theme:** `213333442813` `STAGING — high-value convert` (unpublished)  
**Live:** `158358438141` `icorrect-shopify-theme/main` — not published, not overwritten.

Do **not** merge. Do **not** `theme push --live`.

## Matrix

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Unpublished push, not live | YES | Theme id `213333442813` role unpublished. Live still `158358438141`. |
| 2 | Preview homepage / collections 200 | YES | `Shopify.theme.id === 213333442813`, wizard + `quote-high-value.js` present on `/`, MacBook collection, iPhone collection. |
| 3 | Lane A 14" M4 liquid → collect today | YES | Headline **We can collect it today**. Badge **We want this job**. Call default on. Apple/data/serial optional. No passcode. |
| 4 | N7 eat-collect is £49 all-in | YES after fix | First walk was £74 (band not yet on `_courierQuote`). Fix: eat from `eatCollectEligible` + live quote band. Re-walk **£49**, courier **Included**. |
| 5 | iPhone 16 Pro battery unchanged | YES | **We can fix this** / product title. No convert headline. No prequal block. |
| 6 | Lane B 16" M3 screen N7 | YES | Collect today. **£699** included. Standard back tomorrow (1 WD). Paid Fast hidden. Same-day +£149 with slots. |
| 7 | `npm test` | YES | 237+ pass (clock follow-up included). |
| 8 | Section under 256 KB | YES | `quote-wizard.liquid` 258,021 bytes. |

## Preview

https://icorrect.co.uk/?preview_theme_id=213333442813

Safan 24h stays **off** (fail closed) on this unpublished theme until ops ticks **Safan 24h word-back is open**.
