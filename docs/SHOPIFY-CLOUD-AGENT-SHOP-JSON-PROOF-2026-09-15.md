# Proof: Admin `shop.json` on i-correct-final

**Date:** 2026-09-15  
**Follows:** [#82](https://github.com/panrix/icorrect-shopify-theme/pull/82) handover  
**Agent:** [bc-1fefeff1-04e3-4851-bd37-82872a96dde1](https://cursor.com/agents/bc-1fefeff1-04e3-4851-bd37-82872a96dde1)  
**Status:** Admin read works. No live mutation in this chat.

Do not commit token values. Do not paste tokens in PRs, Slack, or Monday.

## PR 82 steps 1–3

| Step | Result |
|---|---|
| Secrets loaded | `env` lists `SHOPIFY_STORE`, `SHOPIFY_ACCESS_TOKEN`, `SHOPIFY_API_VERSION`, plus client/storefront names |
| Store readable | `SHOPIFY_STORE=i-correct-final.myshopify.com` |
| API version | `2024-01` |

## `shop.json` (read-only)

Request:

```text
GET https://i-correct-final.myshopify.com/admin/api/2024-01/shop.json
Header: X-Shopify-Access-Token (Runtime Secret; not printed)
```

Response (public fields only):

| Field | Value |
|---|---|
| HTTP | `200` |
| `shop.name` | `iCorrect` |
| `shop.myshopify_domain` | `i-correct-final.myshopify.com` |
| `shop.id` | `72871117053` |
| `shop.plan_name` | `professional` |
| `errors` | none |

Access works. Mutations are live; no undo. This run did not write to the store.

## Next (only if Ferrari asks)

Name the live Shopify change. Do not invent a product/theme edit.

## Out of scope here

- Creating a new Shopify app
- Using Storefront tokens for Admin edits
- Closing or merging [#82](https://github.com/panrix/icorrect-shopify-theme/pull/82)
