# iCorrect Shopify theme — agent workflow

You tell us the change. We propose how it looks and behaves. You confirm. Only then do we build. We never ship to live until preview + tests + QA are green, then we merge via GitHub.

## Pipeline (do not skip)

1. **Brief** — wait for the product/UI change. Do not invent a new module.
2. **Design — stop and confirm** — write or mock the customer-facing look and behaviour (layout, copy, what appears when, empty/error states). Show it to Ricky. **Do not write theme code, push a preview, or “just start building” until he confirms.** Mechanisms (clocks, SKUs, eligibility) can be sketched in the same note, but visible UI is not implied by a working backend.
3. **Implement** — only what was confirmed. Edit the real theme (`sections/`, `snippets/`, `assets/`, `templates/`). Not the standalone HTML prototypes in the repo root.
4. **Preview** — push this worktree to an unpublished / CLI development theme. Never publish theme `158358438141` (`icorrect-shopify-theme/main`).
   - Preview URL: `https://icorrect.co.uk/?preview_theme_id=<id>`
   - Auth: `./scripts/load-shopify-env-from-vps.sh` (same VPS `.env` other Shopify agents use)
5. **Tests** — `npm test` (courier/quote logic) and `npm run theme:check`. Add/adjust tests for the change.
6. **QA** — click the real storefront preview (homepage wizard, affected collections/products, empty/error paths). Write a short QA note under `docs/` in the existing QA-PR style.
7. **Live** — only after preview + tests + QA are green: merge the PR to `main`. Shopify’s GitHub theme integration updates live. Do not `theme push --live`.

## What not to do

- Do not demo `prototype-quote-flow.html` or `icorrect-quote-wizard-final.html` as the site.
- Do not ask for a new Theme Access token. Credentials are already on mission-control.
- Do not overwrite existing staging themes (`STAGING — NEW DESIGN`, `STAGING — courier-first #53`) unless asked.

Details: `docs/cloud-agent-dev.md`.
