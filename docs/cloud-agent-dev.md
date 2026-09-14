# Cloud Agent development environment

How a Cursor Cloud Agent previews and tests the **real** iCorrect theme against the
store, and how changes get released.

- Store: `i-correct-final.myshopify.com` (public: `www.icorrect.co.uk`)
- Live theme id: `158358438141` (never pushed to by the agent)
- Releases: via GitHub (Shopify's GitHub theme integration) — the agent does **not**
  publish to the live theme.

## Auth: Shopify CLI needs a token (headless)

The Shopify CLI (`theme dev`, `theme push`, `theme pull`, `theme check`) authenticates
non-interactively with a **Theme Access password** (`shptka_...`) or an Admin API token
(`shpat_...`), supplied via environment variables. No interactive browser login is needed.

Set these as Cloud Agent **secrets** (right-hand Secrets panel, next to the chat):

| Secret | Value |
| --- | --- |
| `SHOPIFY_CLI_THEME_TOKEN` | the Theme Access password (`shptka_...`) |
| `SHOPIFY_FLAG_STORE` | `i-correct-final.myshopify.com` |

### Where to get the Theme Access password

1. In the Shopify admin for `i-correct-final.myshopify.com`, install the free
   **Theme Access** app: <https://apps.shopify.com/theme-access>
2. Open **Apps → Theme Access → Create password**. Give it a name (e.g.
   `Cursor Cloud Agent`) and your email.
3. Shopify emails a link. Open it and copy the `shptka_...` password — it is shown
   **once** and the link expires after 7 days or first view.
4. Paste it into the `SHOPIFY_CLI_THEME_TOKEN` secret above.

The password is scoped to `write_themes` only — it can work on themes and nothing else
(no products, orders, or customers).

## Test loop (make change → preview → release)

1. Make theme changes in the repo (Liquid / CSS / JS).
2. Push to an **unpublished** preview theme (never live):
   ```bash
   npx shopify theme push --unpublished --json -t "cursor-preview"
   # → returns the new theme id + preview URL
   ```
   To reuse one preview theme per branch instead of creating new ones each time:
   ```bash
   npx shopify theme push --development --development-context "$(git branch --show-current)" --json
   ```
3. Open the preview in a browser and verify on the real storefront:
   `https://i-correct-final.myshopify.com/<path>?preview_theme_id=<id>`
4. When approved, release through the normal GitHub flow.

Alternatively, `npx shopify theme dev` (auto-started by the `theme-dev` terminal when the
secrets are present) runs a local hot-reload server at <http://localhost:9292> rendering the
real theme.

## Offline checks (no token needed)

```bash
npm test              # node --test scripts/courier/*.test.js (quote/courier logic)
npm run theme:check   # Shopify theme linter
```
