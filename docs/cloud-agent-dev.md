# Cloud Agent development environment

How a Cursor Cloud Agent previews and tests the **real** iCorrect theme against the
store. Same credentials the other Shopify agents already use — no extra token
setup.

- Store: `i-correct-final.myshopify.com` (public: `www.icorrect.co.uk`)
- Live theme: `158358438141` (`icorrect-shopify-theme/main`, GitHub-connected)
- Credentials: `/home/ricky/config/api-keys/.env` on mission-control
  (`SHOPIFY_STORE`, `SHOPIFY_ACCESS_TOKEN`, `SHOPIFY_CLIENT_ID`,
  `SHOPIFY_CLIENT_SECRET`)
- Releases: GitHub → Shopify theme integration. Agents do **not** publish the
  live theme.

## Auth (already in place)

Cloud Agents reach the VPS with the existing `VPS_SSH_*` secrets, then load the
same `.env` file other Shopify agents source. `scripts/load-shopify-env-from-vps.sh`
does that and (when possible) mints a client-credentials Admin token, matching
`/home/ricky/scripts/push-staging-theme-53.py`.

`start` writes those exports to `/tmp/icorrect-secrets/shopify.env` (mode 600,
never committed). The `theme-dev` terminal then runs `shopify theme dev`, which
uploads this worktree to a CLI **development** theme (never the live theme).

The local proxy at <http://127.0.0.1:9292> returns 401 with an Admin API token
(Shopify's documented limitation vs a Theme Access password). Preview the real
storefront instead:

`https://icorrect.co.uk/?preview_theme_id=<id>`

That is the same URL shape other agents already use for QA.

## Delivery pipeline

You describe the change. The agent designs the UI, updates a **preview** theme,
runs tests, gets QA on the real storefront, and only then merges to live via
GitHub.

1. **Brief** — the change (copy, flow, a different quote-wizard module, etc.).
2. **Design + implement** in the real theme files. Ignore the standalone HTML
   prototypes at the repo root.
3. **Preview** — `shopify theme dev` or `theme push --unpublished` using the VPS
   token. Never `--live` / never publish `158358438141`.
   Open `https://icorrect.co.uk/?preview_theme_id=<id>` and click the real wizard.
4. **Tests** — `npm test` and `npm run theme:check` must be green. Add tests for
   new quote/courier behaviour.
5. **QA** — browser pass on the preview URL (happy path + edges). Write a
   `docs/QA-PR…` note in the existing style.
6. **Live** — merge the PR to `main`. Shopify’s GitHub integration updates the
   live theme. No Admin API publish.

To push an unpublished staging theme (same pattern as #53):

```bash
eval "$(./scripts/load-shopify-env-from-vps.sh)"
npx shopify theme push --unpublished --json -t "STAGING — do not publish"
```

Existing unpublished themes on the store (do not publish, do not overwrite unless
you intend to):

- `162397946109` — STAGING — NEW DESIGN
- `213180776701` — STAGING — courier-first #53

## Offline checks (no store needed)

```bash
npm test              # scripts/courier/*.test.js
npm run theme:check   # Shopify theme linter
```
