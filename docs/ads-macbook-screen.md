# Ads page: MacBook screen repair (page.ads-macbook-screen)

Status: **HOLD.** Preview only. `noindex`. Not linked from the site. No ads running. Do not merge this PR: a merge to `main` deploys to the live theme.

Design brief and claims register: `panrix/icorrect-web`, `design/ads-macbook-screen/BRIEF-v3.md` (page) and `BRIEF.md` (v2: quote, tracking, claims). Design prototype: panrix/icorrect-web#8 (superseded by this build for hosting, kept as the design reference).

## Why it lives in the theme
Ricky, 12 Oct 2026: the quote must be the existing live wizard, not a new build. The wizard reads Shopify menus and collections through Liquid and calls same-origin Shopify endpoints (`/products/*.js`, `/cart/*`, `/checkout`), and icorrect.co.uk refuses to be framed. So the page is a theme page template with its own minimal layout.

## Files
| File | What |
|---|---|
| `layout/ads.liquid` | Minimal layout: noindex, A/B choice in the head, GA4 and PostHog as in `theme.liquid`, no site header or footer. |
| `templates/page.ads-macbook-screen.json` | Story section, the live `quote-wizard` section (MacBook, screen, no map, own heading), the after section. |
| `sections/ads-mbs-story.liquid` | Sticky bar, hero, the six chapters, the desktop stage. |
| `sections/ads-mbs-after.liquid` | Variant B list, trust block and FAQ. Footer for both. |
| `snippets/ads-mbs-trust.liquid` | Trust block. |
| `assets/ads-mbs.css`, `assets/ads-mbs.js` | Page styles and behaviour. No library. |
| `assets/ads-mbs-tokens.css`, `assets/ads-mbs-components.css` | The iCorrect design contract, copied verbatim (fonts point at the theme's Geist files). |
| `assets/macbook-display-assembly-*.svg`, `courier-route-*.svg`, `repair-bench-*.svg`, `warranty-seal-closed.svg` | Diagram kit SVGs, copied verbatim. |
| `docs/ads-mbs-copy-contract.sh` | Re-copies the contract and the diagrams from an `icorrect-design-system` checkout. |
| `docs/ads-mbs-booking-pixel.js` | Draft custom pixel for bookings in GA4. Not installed. |

## A/B split
- Chosen in the head of `layout/ads.liquid`, before paint, so there is no flicker. Both variants are in the HTML; CSS shows one.
- In the test: a visitor arriving from a paid click (`gclid`, `gbraid`, `wbraid`, or `utm_medium` cpc, ppc, paid, paidsearch, paid_social). They get 50/50 and a first-party cookie `ic_lp_mbs` for 90 days, so they see the same version every visit.
- Not in the test: everyone else sees Variant A and is marked `lp_in_test: false`.
- `?variant=a` or `?variant=b` forces a version for review. It is never stored and is marked `lp_ab_source: forced`.
- Open: the cookie is set without a consent check. It holds only "a" or "b", but it is not strictly necessary under PECR. Legal check before traffic.

## Events (GA4 `G-YHN7YHZNM8`)
Every event on the page carries `lp`, `lp_variant`, `lp_in_test` and `lp_ab_source` (set with `gtag('set')`), including the wizard's own events. Register them as event-scoped custom dimensions in GA4 to report on them.

| Event | When |
|---|---|
| `page_view` | GA4's own, with the variant |
| `chapter_view` | Variant A, each chapter once, after 500ms (`chapter` 1 to 6) |
| `sticky_cta_click` | Variant A, sticky bar button (`chapter`, `progress`) |
| `progress_dot_click` | Variant A, a chapter dot (`chapter`, `from_chapter`) |
| `cta_click` | Hero button (`position: hero_scroll`) |
| `quote_start` | First tap or key inside the wizard |
| `quote_complete` | The all-in price is on screen |
| `wizard_start`, `step_complete`, `begin_checkout`, `generate_lead` | The wizard's existing events, unchanged |
| `booking` | Completed checkout from this page. Needs `docs/ads-mbs-booking-pixel.js` installed by Ricky in Customer events. |

The page also tags the cart with `lp`, `lp_variant` and `lp_in_test` at quote start and again at checkout, so every Shopify order from this page carries its version. Shopify orders are the first-party count of bookings.

## Preview
`https://www.icorrect.co.uk/pages/our-warranty?view=ads-macbook-screen&preview_theme_id=<id>` (any page handle works with `?view=`). Add `&variant=b` for Variant B.

## Going live (Ricky's call, none of it done)
1. Merge this PR (deploys the template to the live theme; nothing links to it).
2. Create a hidden page in Shopify admin with the template `page.ads-macbook-screen`.
3. Install the booking pixel. Register the GA4 custom dimensions.
4. Replace every `data-live` placeholder with its live value, and clear the held claims.
5. Google Ads paused-ad review, then traffic.
