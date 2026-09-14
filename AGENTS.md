# iCorrect Shopify theme — agent workflow

You tell us the change. We design the UI. We never ship to live until preview + tests + QA are green, then we merge via GitHub.

## Pipeline (do not skip)

1. **Brief** — wait for the product/UI change. Do not invent a new module.
2. **Design + implement** — edit the real theme (`sections/`, `snippets/`, `assets/`, `templates/`). Not the standalone HTML prototypes in the repo root.
3. **Preview** — push this worktree to an unpublished / CLI development theme. Never publish theme `158358438141` (`icorrect-shopify-theme/main`).
   - Preview URL: `https://icorrect.co.uk/?preview_theme_id=<id>`
   - Auth: `./scripts/load-shopify-env-from-vps.sh` (same VPS `.env` other Shopify agents use)
4. **Tests** — `npm test` (courier/quote logic) and `npm run theme:check`. Add/adjust tests for the change.
5. **QA** — click the real storefront preview (homepage wizard, affected collections/products, empty/error paths). Write a short QA note under `docs/` in the existing QA-PR style.
6. **Live** — only after preview + tests + QA are green: merge the PR to `main`. Shopify’s GitHub theme integration updates live. Do not `theme push --live`.

## What not to do

- Do not demo `prototype-quote-flow.html` or `icorrect-quote-wizard-final.html` as the site.
- Do not ask for a new Theme Access token. Credentials are already on mission-control.
- Do not overwrite existing staging themes (`STAGING — NEW DESIGN`, `STAGING — courier-first #53`) unless asked.

Details: `docs/cloud-agent-dev.md`.
