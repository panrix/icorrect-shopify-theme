# Handover: Shopify Admin access for Cloud Agents

**Date:** 2026-09-15  
**Status:** Secrets are in Cursor. This Cloud Agent run cannot use them. Next chat starts a **new** agent, then verifies Admin API, then does store work.  
**Do not** commit token values. Do not paste tokens in PRs, Slack, or Monday.

This supersedes the earlier blocker request on the same PR ([#82](https://github.com/panrix/icorrect-shopify-theme/pull/82)). Ferrari could not create a Shopify app and could not see the Jarvis token in Admin. Ricky’s existing Jarvis credentials are now in Cursor Cloud secrets.

## Where we left it

1. Goal: Cloud Agent edits live Shopify (`i-correct-final`) without a new app.
2. Ferrari VPS SSH (`VPS_SSH_USER=Ferrari` @ `46.225.53.159` / `mission-control`) works, but **cannot** read `/home/ricky/config/`.
3. Live VPS already uses Jarvis: `shopify-order-handler` (fulfill) and Alex triage (read products). Token file: `/home/ricky/config/api-keys/.env`.
4. This run (`bc-5005a8fb-413e-4f70-aa78-66385a72ba77`) started **before** secrets were added. `env | grep SHOPIFY_` is empty here. That is expected.
5. Next agent must boot **after** the secrets screenshot. Then prove Admin read, then Ferrari’s actual Shopify change.

## Secrets in Cursor (names only)

| Name | Type | Why |
|---|---|---|
| `SHOPIFY_STORE` | Environment Variable | Public shop domain; agent must read it |
| `SHOPIFY_API_VERSION` | Environment Variable | Public, e.g. `2024-10` |
| `SHOPIFY_CLIENT_ID` | Environment Variable | App id, not a password |
| `SHOPIFY_STOREFRONT_CLIENT_ID` | Environment Variable | Same |
| `SHOPIFY_ACCESS_TOKEN` | Runtime Secret | Admin writes; value is `[REDACTED]` in chat |
| `SHOPIFY_CLIENT_SECRET` | Runtime Secret | Webhook HMAC |
| `SHOPIFY_SECRET_KEY` | Runtime Secret | Same family as client secret |
| `SHOPIFY_STOREFRONT_TOKEN` | Runtime Secret | Storefront API, not Admin |
| `SHOPIFY_STOREFRONT_SECRET` | Runtime Secret | Storefront |

Admin edits only need `SHOPIFY_STORE` + `SHOPIFY_ACCESS_TOKEN`. Storefront keys are extra. None of these are Build Secrets.

## First 5 minutes in the next chat

1. Confirm secrets loaded: `env | grep -E '^SHOPIFY_' | cut -d= -f1` lists at least `SHOPIFY_STORE` and `SHOPIFY_ACCESS_TOKEN`.
2. Confirm store is readable (not `[REDACTED]`): `printf '%s\n' "$SHOPIFY_STORE"`.
3. Read-only Admin check (do not print the token):

```bash
curl -sS "https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION:-2024-10}/shop.json" \
  -H "X-Shopify-Access-Token: ${SHOPIFY_ACCESS_TOKEN}" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); s=d.get("shop") or d; print(s.get("name"), s.get("myshopify_domain"), s.get("id"))'
```

4. If that returns `i-correct-final.myshopify.com`, access works. Ask Ferrari what to change. Mutations are live; no undo.
5. If 401/403: token missing, wrong type, or Jarvis scopes. Existing app only: https://admin.shopify.com/store/i-correct-final/settings/apps/development/fb7725995cf0448dd2cb8c9d8392d150/configuration

## Store / app facts

- Store: `i-correct-final.myshopify.com`
- App: Jarvis (Monday: “iCorrect Automation”)
- Theme repo: `panrix/icorrect-shopify-theme`
- Monday: Development https://icorrect.monday.com/boards/18430109564/pulses/13049944891 — Ferrari Daily Work https://icorrect.monday.com/boards/18393875720/pulses/13049904128

## Out of scope for the next chat unless Ferrari asks

- Creating a new Shopify app
- Giving Ferrari read on `/home/ricky/config/`
- Using Storefront tokens for Admin product/theme edits
