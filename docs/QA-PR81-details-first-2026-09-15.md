# QA — PR #81 details-first quote gate — 2026-09-15

**Branch:** `cursor/quote-details-first-a035`  
**HEAD at this QA:** `bdaeb32`  
**PR:** https://github.com/panrix/icorrect-shopify-theme/pull/81 (draft)  
**Base:** `cursor/same-day-launch-wiring-a035` (#80)  
**Preview:** https://icorrect.co.uk/?preview_theme_id=213273968893  
**Theme:** `213273968893` `STAGING — same-day express` (unpublished)  
**Live theme left alone:** `158358438141`

Do **not** merge. Do **not** `theme push --live`.

## VERDICT: PREVIEW DETAILS-FIRST WORKS

Name / email / mobile / postcode appear before any all-in price. Submit unlocks the existing collection strip + live speed cards. Cart attributes and checkout query carry the lead so there is no second contact form.

## Forced checks

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | `npm test` | **209/209** | includes `quote-lead-checkout.test.js` |
| 2 | Theme push | **clean** | `quote-wizard.liquid` under 256 KB after moving model helpers |
| 3 | Unpublished preview only | **YES** | `Shopify.theme.id === 213273968893` |
| 4 | Live theme / merge | **NOT DONE** | |

## Preview walk (headless Chrome, theme cookie)

Path: homepage wizard → iPhone → 16 Pro Max → Screen → Cracked glass → `W1B 4BD`.

| Step | Result |
| --- | --- |
| Gate | “We need a few details for the quote”. Price / collection / speeds hidden. Book disabled. |
| Empty submit | Mock errors: name / email / mobile / postcode. |
| After submit | “Quote for Jane Whitfield · jane.whitfield@icorrect.test · W1B 4BD”. Courier B1. Standard + Same-day **+£49**, 3 slots. All-in **£379**. |
| Cart attributes | `Name`, `Email`, `Phone` on `cart/update.js` |
| Checkout URL | `checkout[email]`, `checkout[shipping_address][first_name\|last_name\|phone]` |
| Checkout UI | Email `jane.whitfield@icorrect.test` prefilled. Line item keeps Postcode / collection window. |

Live clocks and eligibility are unchanged from #80 (iPhone Fast still not offered; Same-day uses the real slot/stock proxy).
