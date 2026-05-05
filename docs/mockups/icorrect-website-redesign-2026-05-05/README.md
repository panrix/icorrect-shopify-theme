# iCorrect Website Redesign Mockups

Source exports copied from Ricky's Claude Design downloads on 2026-05-05.

This folder is a review workspace only. It is not live Shopify theme code and should be treated as the visual contract before converting sections/templates into Liquid.

## Pages

- `collection/` — MacBook Screen Collection prototype. Complete source export with collection page, mobile preview, JSX, CSS, Geist fonts, and screenshots.
- `product/` — MacBook Screen Repair product page prototype. Complete source export with product page, mobile page, bundled export, JSX, CSS, Geist fonts, and screenshots.
- `homepage/` — Homepage prototype start. Includes hero variants, proof section, inline wizard option, diagnostic morph, diagnostic trees/data, CSS, and fonts.

## Review Order

1. `index.html` — hub page linking to each mockup.
2. Collection `MacBook Screen Collection.html` — strongest baseline for the shared visual system.
3. Product `MacBook Screen Repair - Product.html` — product-page conversion template.
4. Homepage `iCorrect Homepage.html` — early homepage direction with hero and diagnostic mechanics.

## Notes

- These files use React and Babel from CDN in the original exported HTML. Use the local static preview server rather than opening through the Shopify theme.
- Keep changes here separate from production theme work until the visual direction is approved.
- The next phase is translating approved mockup components into Shopify Liquid sections/snippets and theme CSS on `codex/shopify-website-2026-05-04`.
