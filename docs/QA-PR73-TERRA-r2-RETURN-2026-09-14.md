# Terra QA return — PR 73 r2

## VERDICT: NEEDS-FIX

Reviewed claimed code HEAD `153d54cb1133b5a89c89a4ec573917f60b9b04ce`.
Current `HEAD` is `316e27689a9dcddf0f08cba586c2005c64e6f105`; its only
committed change after the claimed code is the r2 QA brief. `git diff
153d54cb1133b5a89c89a4ec573917f60b9b04ce -- sections templates scripts`
was empty.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Liquid always builds the Service Update and selects the noun from prefill/metafield/handle/title | YES | `sections/quote-wizard.liquid:365-394` builds `qw_sub` from the exact signed-off fragments. It derives `qw_device` from `prefill_device` and collection/product metafields, then evaluates the device plus collection/product/page handle and title. |
| 2 | Homepage uses `device`; device collection JSON uses its matching noun | YES | Parsed all 66 changed template JSON files and their 66 `quote-wizard` sections. `index.json` uses `device`; every iPhone/iPad/MacBook/Apple Watch filename family has its expected noun; the three generic collection templates use `device`. |
| 3 | iPad `details` has no em dash and describes iPad repairs plus collection | YES | `templates/collection.ipad-collections.json:105` contains the repair and collection description, including “iPad repairs” and “we’ll collect”; it has no `—`. |
| 4 | iPhone and iPad collection wizards precede their model grids | YES | In `collection.iphone-collections.json`, `quote_wizard_top` is ordered before `parent_categories_nWCAYw`; in `collection.ipad-collections.json`, it is before `parent_categories_f6HGVL`. |
| 5 | `node --test scripts/courier/collection-only-copy.test.js` | YES — 5/5 | Executed locally: 5 tests passed, 0 failed. |
| 6 | `node --test scripts/courier/*.test.js` | YES — 101/101 | Executed locally: 101 tests passed, 0 failed. |
| 7 | No P0/P1 — including approved heading, noun and wizard placement | NO | No P0 found, and noun/placement checks pass. However, the actual Liquid renderer rewrites the approved generic heading on collection/product/page contexts, producing a non-approved contextual heading. |

## P0

None.

## P1

1. The visible heading does not stay **“Get a repair quote”** outside a
   context-free page. In `sections/quote-wizard.liquid:308-360`, a generic
   `section.settings.heading` is deliberately replaced with
   `Get your <collection/product/page title> quote`. All reviewed templates
   configure `"heading": "Get a repair quote"`, so a normal collection with a
   non-empty title will render, for example, “Get your iPhone repair quote”
   rather than the signed-off heading. The heading logic predates this PR,
   but this PR does not meet the r2 acceptance requirement while it remains
   active. The source must preserve the configured signed-off heading for
   these quote sections (or the requirement must be explicitly changed).

## P2

1. The new test verifies JSON settings and source-token presence, not rendered
   Liquid behavior. It therefore passes while the P1 heading rewrite remains.
   Add coverage that asserts the rendered heading remains exactly “Get a
   repair quote” for collection, product, and non-contact page contexts.

## Contradictions / unsafe-to-merge-if-surface-looks-fine

- The JSON surface says `"heading": "Get a repair quote"`, but the Liquid
  surface changes it when a collection, product, or ordinary page has a
  title. This is the release-blocking contradiction: static JSON inspection
  and the complete Node suite both look green although storefront output is
  not the signed-off copy.
- The newly added iPad description says the rest of the UK receives “a free
  tracked mail-in pack,” while the required Service Update says collection is
  “nationwide by courier.” Both statements are in this PR and cannot both
  describe the same nationwide fulfilment policy. The QA brief explicitly
  requires preserving the iPad wording, so this is recorded as a required
  product-policy decision rather than a proposed copy change.
- Template `subheading` values are now checked by tests but are not rendered:
  the Liquid section always reconstructs `qw_sub`. That is compatible with
  the “always builds” requirement, but means Theme Editor changes to the
  subheading setting will not affect storefront output.
