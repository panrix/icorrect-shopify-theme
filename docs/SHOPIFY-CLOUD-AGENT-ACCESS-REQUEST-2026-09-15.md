# Blocker: Cloud Agent needs existing Shopify Admin token

**For:** Ricky  
**From:** Ferrari / Cursor Cloud Agent  
**Date:** 2026-09-15  
**Status:** Ferrari is blocked. No new Shopify app required.

Ferrari cannot see the Jarvis Admin API token in Shopify Admin. Custom-app create is also blocked. Direct store edits from Cloud Agent cannot start until the **existing** token is copied into Cursor secrets.

Do **not** put the token in git, this PR, Slack, or Monday.

## What already exists

| Item | Value |
|---|---|
| Store | `i-correct-final.myshopify.com` |
| App | Jarvis (Monday also called this “iCorrect Automation”) |
| Admin page | https://admin.shopify.com/store/i-correct-final/settings/apps/development/fb7725995cf0448dd2cb8c9d8392d150/configuration |
| VPS secret file | `/home/ricky/config/api-keys/.env` |
| Keys in that file | `SHOPIFY_STORE`, `SHOPIFY_ACCESS_TOKEN` |
| Already using them live | `shopify-order-handler` (fulfill), Alex triage (read products) |

Ferrari SSH on `mission-control` (`VPS_SSH_USER=Ferrari`) can deploy workshop-os. It **cannot** read `/home/ricky/config/`. That is expected.

## What Ricky should do (about 5 minutes)

1. Copy `SHOPIFY_STORE` and `SHOPIFY_ACCESS_TOKEN` from `/home/ricky/config/api-keys/.env`.
2. Add them as **Cursor Cloud Agent secrets** for this environment / this repo (`panrix/icorrect-shopify-theme`). Names must match exactly:
   - `SHOPIFY_STORE=i-correct-final.myshopify.com`
   - `SHOPIFY_ACCESS_TOKEN=<existing Jarvis token>`
3. Tell Ferrari (or comment on this PR) when it is saved.
4. Ferrari starts a **new** Cloud Agent after that. This run will not pick up new secrets mid-chat.

If Jarvis is missing write scopes for the job (products / pages / themes), add them on **this same app** and reinstall so the existing token updates. Do not create a second app.

## Check it worked

A new Cloud Agent can run a read-only shop query against `i-correct-final.myshopify.com` without SSH’ing into `/home/ricky/config`.

## Out of scope

- Ferrari reading Ricky’s full `api-keys/.env`
- Committing tokens
- Creating a new Shopify app
