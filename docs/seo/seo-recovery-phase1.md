# SEO recovery phase 1

Goal: win back organic clicks lost after the 13 Sep (#58) and 24 Sep (#95,
250fa1a) releases, keeping the quote wizard as the first block on collection
and product pages.

## Changes

1. Crawlable links
   - Restored the "Choose your iPhone, MacBook, iPad, Apple Watch repair"
     grids on the four hubs (revert of 250fa1a), below the wizard.
   - Re-enabled the iPhone link section to /pages/iphone-repairs (off since
     #58) on 26 iPhone templates, below the first grid after the wizard.
   - New `snippets/repair-index.liquid`, rendered by the quote wizard section
     on collections: a compact list of plain links under the wizard, one per
     product, with full model and repair names and the from price
     ("MacBook Pro 13-inch M2 A2338 Screen Repair, from £429"). Turn off per
     template with the wizard setting "Show the repair price index under the wizard".
2. One H1 per page
   - `about-info` and `parent-categories` gain a heading tag setting
     ("H1, collection title"); the quote wizard gains "Show the collection title as the page H1" for
     templates where it is the first block. The wizard heading stays an H2.
   - Product templates: the rich text heading is now H2, so the product title
     is the only H1.
3. Images: see `docs/seo/repair-diagram-images.md`.
4. Copy and meta descriptions
   - No walk-in wording. Standard line: "Courier collection across London,
     tracked mail-in nationwide."
   - No "free mail-in" claims (mail-in is +£20 under £200).
   - `layout/theme.liquid` rewrites the "Central London" endings of admin
     SEO descriptions at render time. Title tags are unchanged.
5. Context content for the MacBook screen family
   - New `sections/repair-context.liquid`: symptoms, model number finder,
     courier and mail-in process, parts and calibration, warranty, FAQs.
     Only claims already published on the site are used.
   - Shown on macbook-screen-repair-prices, the A2338 collection and the A2338
     screen product via handle allowlists in the section settings.

## Phase 2

- Roll the context section out to the other families (iPhone battery,
  MacBook battery, Watch glass, iPhone screen) with family-specific copy.
- Replace product media with the generated diagram PNGs (admin data, needs
  approval) to fix the image sitemap and Merchant feed.
- Fix admin SEO descriptions at source (882 products, 39 collections).
- After merge: request reindexing of the key URLs in Search Console.
