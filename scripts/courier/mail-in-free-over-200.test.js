/**
 * Contract: ≥£200 mail-in stays free at checkout.
 * The Shopify mail-in-service SKU is priced £20 — do not add it when
 * the all-in quote already includes postage (adjustment === 0).
 * Run: node --test scripts/courier/mail-in-free-over-200.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const wizard = fs.readFileSync(
  path.join(root, 'sections/quote-wizard.liquid'),
  'utf8'
);
const additional = fs.readFileSync(
  path.join(root, 'snippets/additional-repair.liquid'),
  'utf8'
);

const {
  quoteServiceAdjustment,
} = require('../../assets/courier-pricing.js');

const bandsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8')
);
const variantsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'data/service-adjustment-variants.json'), 'utf8')
);

function sliceFn(src, startNeedle, endNeedle) {
  const start = src.indexOf(startNeedle);
  const end = src.indexOf(endNeedle);
  assert.ok(start >= 0 && end > start, `missing ${startNeedle}`);
  return src.slice(start, end);
}

describe('≥£200 mail-in quote is free', () => {
  it('BH10 / outside London + £479 screen → adjustment 0, total 479', () => {
    const q = quoteServiceAdjustment({
      postcode: 'BH10 5AJ',
      productTags: [],
      bands: bandsAsset,
      service: 'mail-in',
      repairPrice: 479,
      variants: variantsAsset,
    });
    assert.equal(q.service, 'mail-in');
    assert.equal(q.tier, 'free');
    assert.equal(q.adjustment, 0);
    assert.equal(q.total, 479);
  });
});

describe('quote wizard cart must not add the £20 mail-in-service SKU', () => {
  const fn = sliceFn(wizard, 'function buildCartItems()', 'function getShopifyRoot()');

  it('mail-in still stamps Service Type on the repair line', () => {
    assert.match(fn, /properties\['Service Type'\] = 'Mail-in'/);
  });

  it('does not push CFG.mailIn.variantId (Shopify SKU is £20)', () => {
    assert.equal(
      fn.includes('CFG.mailIn.variantId'),
      false,
      'wizard still adds mail-in-service — that is how Leilia paid £499 on a £479 quote'
    );
  });

  it('paid postage uses only the adjustment variant when adjustment > 0', () => {
    assert.match(fn, /_courierQuote\.adjustment > 0/);
    assert.match(fn, /_courierQuote\.variantId/);
  });

  it('never adds a mail-in adjustment on repairs of £200 or more', () => {
    assert.match(
      fn,
      /currentRepairPrice\(\) >= 200/,
      '≥£200 mail-in must not add Mail-in pack contribution'
    );
  });
});

describe('product-page additional-repair cart matches the same rule', () => {
  it('does not add mail-in-service whenever the mail-in checkbox is on', () => {
    assert.equal(
      /if \(mailActive \|\| \(mailInCheckbox && mailInCheckbox\.checked\)\) \{/.test(
        additional
      ),
      false,
      'additional-repair still adds the £20 mail-in-service SKU on every mail-in'
    );
  });
});
