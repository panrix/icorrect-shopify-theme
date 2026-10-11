# Repair diagram images

The imageless repair design (#95) draws every device as inline SVG inside
`<span class="dg" aria-hidden="true">`. Google Images does not index inline
SVG, so those pages had no indexable images: no file, no alt text, no
dimensions. Product og:image, Product schema `image` and the image sitemap
still pointed at the old product media.

## What changed

- `snippets/device-glyph.liquid` builds a key for each drawing
  (`family-variant-view-part[-lN][-tb]`). When `assets/repair-diagram-<key>.svg`
  exists (listed in `snippets/repair-diagram-keys.liquid`) it renders
  `<img class="dg__img" src alt width height>` instead of the inline SVG.
  The file holds the same drawing and CSS, so the look is unchanged.
- Callers pass alt text: `repair-card` and `repair-visual` use
  "<model> <repair> diagram", `parent-categories` tiles use the tile title.
  The product panel image loads eagerly with `fetchpriority="high"`; the rest
  are lazy.
- `snippets/repair-diagram-image-url.liquid` returns the 1200x900 PNG for a
  product. `snippets/meta-tags.liquid` uses it for og:image (with width,
  height and alt) and `sections/main-product.liquid` swaps it into the
  Product JSON-LD `image`.
- Rollback switch: Theme settings, Repair pages, "Serve repair drawings as
  image files" (`repair_diagram_images`). Unticked, everything returns to
  inline SVG and the old og:image.

## Regenerating the files

After changing any `device-glyph*` snippet or `assets/repair-imageless.css`:

1. Upload the changed snippets and `templates/collection.repair-diagram-export.liquid`
   to an unpublished preview theme.
2. From the repo root run
   `python3 scripts/seo/export-repair-diagrams.py --theme <previewThemeId>`
   (set `CHROME_PATH` if Playwright's bundled Chromium is not installed).
3. Upload the changed `assets/repair-diagram-*` files and
   `snippets/repair-diagram-keys.liquid`.

The export view is `noindex` and `layout none`:
`/collections/all?view=repair-diagram-export&page=N`.

## Known limits

- The diagnostic scan line is a CSS animation; inside an `<img>` it still
  plays but cannot be paused by page CSS (`prefers-reduced-motion` is honoured
  inside the SVG file itself).
- Small mobile cards render the highlight at product-panel strength
  (`--dg-hl: 1`); the difference is minor.
- The image sitemap and Merchant feed come from product media in admin, so
  they still show the old composite images until product media is replaced
  (phase 2, needs approval).
