/**
 * Checkout must collect a home/shipping address as well as billing.
 * Run: node --test scripts/courier/checkout-home-address.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

describe('checkout home + billing address', () => {
  it('wizard checkout prefills shipping zip from the quote postcode', () => {
    const src = read('sections/quote-wizard.liquid');
    assert.match(src, /checkoutUrlWithHomeAddress/);
    assert.match(src, /checkout\[shipping_address\]\[zip\]/);
    assert.match(src, /checkout\[shipping_address\]\[country\]/);
  });

  it('product-page additional repair uses the same shipping zip prefill', () => {
    const src = read('snippets/additional-repair.liquid');
    assert.match(src, /checkout\[shipping_address\]\[zip\]/);
  });

  it('adds the £0 home-address SKU so Checkout is not digital-only', () => {
    const wizard = read('sections/quote-wizard.liquid');
    assert.match(wizard, /homeAddress:/);
    assert.match(wizard, /Address type': 'Home \/ collection \/ mail-in pack'/);
    const additional = read('snippets/additional-repair.liquid');
    assert.match(additional, /46150010929405/);
  });
});
