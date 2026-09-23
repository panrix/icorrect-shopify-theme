# Imageless repair pages: audit and redesign (2026-09-23)

Goal: remove artwork creation as a dependency for launching devices and repairs, without changing page structure, URLs, content or SEO.

Preview theme (unpublished, safe to share): `PREVIEW — imageless repair pages (do not publish)`, id `213583757565`.

- Product: https://icorrect.co.uk/products/iphone-air-screen?preview_theme_id=213583757565
- Per-model grid: https://icorrect.co.uk/collections/iphone-16-pro-repair-prices?preview_theme_id=213583757565
- Model tiles: https://icorrect.co.uk/collections/iphone-16-series-repair-prices?preview_theme_id=213583757565
- Repair-type grid: https://icorrect.co.uk/collections/iphone-screen-repair-prices?preview_theme_id=213583757565

## 1. Audit: where images are used

| Page type | Template(s) | Section | Image source |
|---|---|---|---|
| Family / series / model-picker pages (e.g. iPhone 16 Models, All devices, MacBook Pro 14") | `collection.*-series`, `*-models`, `*-collections`, `all-devices`, `categories` | `parent-categories` | Hand-picked `image_picker` per tile (e.g. `iPhone_16_Pro_relative_size.png`) |
| Per-model repair price pages (e.g. iPhone 16 Pro Repair Prices) | `collection.iphone/ipad/macbook/watch-collection-prices`, `collection.json` | `icorrect-product-grid` | `product.featured_image` |
| Repair-type pages (e.g. iPhone Screen Repair Prices) | `collection.iphone-screens`, `macbook-screen-repair` and 30 similar | `featured-collection` → `card-product` | `product.featured_media` |
| One MacBook collection | `collection.macbook-16` | `main-collection-product-grid` → `card-product` | `product.featured_media` |
| Product pages | `product.*` | `main-product` → `product-media-gallery` | `product.media` (circle + device + repair-icon composite) |

Not device-dependent and left alone: `repair-services` icons, the Quote Wizard's fault icons, videos, FAQs.

### What breaks without images (measured on the live store)

- **49 of 55 iPhone 17-series products show an iPhone 16 image.** For example, every iPhone Air repair uses the `iphone-16-pro-*` artwork. The remaining 6 (all five 17-series diagnostics and iPhone 17 Pro Screen) have no image at all.
- **Product page with no image:** `main-product` drops to `product--no-media`, a single centred text column with no visual. Live example: `/products/iphone-17-pro-diagnostic`.
- **Repair grids with no image:** `icorrect-product-grid` shows Shopify's grey placeholder SVG. `card-product` collapses to a text card with a different height from its neighbours.
- **Model tiles with no image:** `parent-categories` always outputs an `<img>` from the block's image picker, so a tile without artwork has no visual. Adding a new model tile requires artwork first.
- The iPhone Air product showed an iPhone 16 Pro photo, and until recently its description said "iPhone 16 Pro". This is copy-paste debt from the same bottleneck.

### Other issues found (not fixed here; admin changes)

1. All five iPhone 17 per-model collections (`iphone-17-repair-prices`, `iphone-17-pro-…`, `iphone-17-pro-max-…`, `iphone-17e-…`, `iphone-air-…`) use the **default** `collection.json`. That template carries MacBook videos and MacBook FAQs. Set their template to `iphone-collection-prices`.
2. `iphone-air-repair-prices` returns 404 on the storefront. It appears unpublished from the Online Store channel.
3. iPhone 17-series products have no template suffix, so they use `product.json` (generic videos/FAQs) rather than `product.iphone-product-template`.
4. There is no iPhone 17 series landing page or tile on `iphone-repair-prices`. With this change a tile can be added in the theme editor without an image.

## 2. The redesign

Everything is driven by data that already exists on each product and tile: title, tags and product type. Nothing new has to be entered for a new device.

### Building blocks (new files)

- `snippets/repair-meta.liquid` works out family, repair type, model, repair name, qualifier, relative size and rear-lens count from the title. It uses tags and type as a fallback, and page context for tiles like "Series 9" or "45MM". It covers every active repair product in the catalogue (911).
- `snippets/repair-icon.liquid` is a line-icon set on the Quote Wizard's 24px / 1.5-stroke grid: 23 repair types, 4 device families, and trust icons.
- `snippets/device-glyph.liquid` + `snippets/device-glyph-<era>.liquid` hold one line-art drawing per **design era** (15 eras across iPhone, iPad, MacBook and Watch), chosen by `snippets/device-variant.liquid`. The rules for drawing a new era are in `docs/design/device-illustrations.md`. It **highlights the part being repaired**: screen crack, battery x-ray, port, camera area, buttons, crown, keyboard, trackpad, hinge (Flexgate), heart-rate sensor, or a scan line for diagnostics. Rear repairs flip to the back of the device. Each era has its identifying features (home button, notch, Dynamic Island, camera plateau, Touch Bar, Ultra crown guard…). Unknown newer models fall into the newest era, so a launch never needs artwork. Only overall size scales with the model (mini/e < base < Plus/Max, 13" < 16"). The MacBook charging port sits on the side of the top case.
- `snippets/repair-card.liquid` is the card used by every repair grid.
- `snippets/repair-visual.liquid` is the product-page panel.
- `assets/repair-imageless.css` holds the styles, with tokens aligned to `assets/quote-wizard.css`.

### How each page changes

- **Product page:** the left column keeps the site's familiar "circle + repair icon" composition, now drawn in code. It shows the diagram with the part highlighted, a repair badge, model / repair / "Genuine OLED" chips, and a trust row (2-year warranty, genuine parts, London collection & UK courier). The whole left column carries the panel colour, so it always matches the height of the right column however far the wizard expands. The drawing stays pinned under the sticky header while you scroll.
  - The Quote Wizard now sits under the title and description in the right-hand column. The panel, title and wizard share the first screen at 1440×900.
  - How it works: the wizard section moves itself into a slot in the product column before it initialises. The theme editor keeps it in place so it stays editable. Its map panel is hidden in that position.
  - The theme setting "Quote Wizard beside the repair panel" turns the move off.
  - Title, description, breadcrumb and structured data are unchanged.
- **Per-model grid:** each card shows the repair as the title (the model is visually hidden), with the qualifier as a green chip, the price, and "Book Repair". The highlighted part differs per card, so the grid reads at a glance. There are no extra corner icons. Grids cap at 1360px, and cards and diagrams scale up at 990px and 1200px. It is a single-column list on mobile.
- **Repair-type grid:** the same card with the emphasis flipped (repair eyebrow, model title), chosen automatically when the collection title names a repair.
- **Model tiles:** two styles, set per section with "Tile style". The whole tile is clickable in both. Two columns on mobile instead of one.
  - **Device diagram** (default): a circle with a scaled device diagram (or a repair icon for repair-category tiles), the model name, a live "11 repairs · from £119" line read from the linked collection (diagnostics excluded), and "View repairs".
  - **Headline prices** (proposed): the model name plus its own screen and battery prices, read from the linked collection, and "View all 11 repairs". This makes tiles on a series page differ from each other instead of repeating the same picture.

### Part badges

`snippets/repair-badge.liquid` applies one rule, with no tags or settings:

1. The title's own quality note wins. "(Genuine OLED)" and "(Original Specification)" show as the green badge; "(Premium Aftermarket Battery)" shows as a neutral note.
2. Otherwise the part is genuine, and the badge follows the repair type: "Genuine screen", "Genuine keys", "Genuine Face ID", "Genuine crown", "Genuine Touch Bar", and so on. Anything else shows "Genuine parts".
3. Diagnostics, data recovery and liquid damage get no badge. Nothing with "aftermarket" in the title is ever called genuine.

### Glass vs display

- "Screen Glass Repair" and "Glass Screen Repair" show an impact shatter on an otherwise normal screen.
- "Display Screen Repair" and "… Display Repair" show panel damage (lines, ink bleed) under intact glass.
- Full screen assemblies ("Screen Repair") keep the crack.

### Model tiles

Every tile shows its era drawing, the model name, the screen and battery prices from its linked collection (when there are any), and a "View all N repairs" button. Because drawings follow design eras, tiles on mixed pages (e.g. Ultra vs Series 10 vs SE) look different on their own.

### Repair order on model pages

Diagnostic first, then screen / display / glass, battery, charging port, rear glass, cameras, Face ID, audio, buttons, crown, keyboard, trackpad, Touch Bar, Flexgate, Dustgate, heart-rate sensor. The model name above each repair is hidden on these pages because the page title already names it; it stays in the HTML for SEO.

### Model order (automatic)

`snippets/model-order.liquid` applies one rule everywhere models are listed: model tiles, and repair grids that show one repair across many models.

1. Product line, in the order it first appears on the page (keeps Air and Pro groups together).
2. Newest generation first: the year in the title (chip number breaks same-year ties), else "Nth Gen", else the model number. Names with no number (e.g. "iPhone Air") join the newest generation.
3. Within a generation: standard, mini, Plus/Air, Pro, Pro Max/Max, then budget (16e, XR).
4. Smaller size first (13" before 15", 41mm before 45mm).

For example: iPhone 17, Air, 17 Pro, 17 Pro Max, 17e, then 16, 16 Plus, 16 Pro, 16 Pro Max, 16E. New models slot in without template edits. Tiles can opt out with "Order tiles automatically".

### What was borrowed from the staging theme, and what wasn't

Borrowed: the principle of typography-led repair pages, device + repair eyebrow labels, the trust row, and leaning on the Quote Wizard's visual language.

Not copied: its page structure, section set, Geist font override, or product-page layout. The staging theme (`fablewebsite/os2-rebuild`) has no device or repair detection. Its product and collection moulds hardcode "MacBook · Screen Repair" copy, which is why the iPhone Air shows as "MacBook" there. Its iPhone collections are still the old image-based templates.

### SEO and structure

- No templates, URLs, headings, descriptions or section orders were changed. Only markup inside six existing sections changed.
- Card headings still contain the model and repair text, and link to the same product URLs.
- `product | structured_data` is untouched, so existing product images stay in Google's product markup. Product media is not deleted. It just isn't displayed.

### Rollback

Theme settings → **Repair pages** → untick **Imageless repair design**. The original image-based markup is still in each section behind this switch. It was verified on the preview theme to render exactly as live. The trust-row copy is editable in the same panel.

## 3. Launching a new device from now on

1. Create products as usual (e.g. "iPhone 18 Pro Screen Repair (Genuine OLED)", tag `screen-repair`). No image needed.
2. Create the per-model collection and assign the right `*-collection-prices` template.
3. Add a tile in the relevant `parent-categories` section (title + link). Leave the image empty.

A new family (e.g. AirPods) needs one diagram in `device-glyph.liquid` and one keyword in `repair-meta.liquid`. That is a code change, not per-model artwork.

## 4. Suggested follow-ups

- Apply the admin fixes in section 1.
- `iphone-model-search` and the Quote Wizard's visual guide still use per-model iPhone photos (`17pm.png`, `air.png`, …) to help customers identify their phone. They are identification aids rather than decoration, but they are the remaining artwork dependency and could move to the same diagrams.
