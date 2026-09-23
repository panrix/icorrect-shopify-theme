/**
 * Catalogue price sync. No network.
 * Run: node --test scripts/courier/sync-catalogue-prices.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { applyVariantPrices, collectVariantIds, toCents } = require('./sync-catalogue-prices.js');

function sample() {
  return {
    models: {
      'iphone::iphone-15': {
        repairs: {
          battery: {
            variantId: 11,
            handle: 'iphone-15-battery',
            title: 'iPhone 15 Battery',
            price: 99,
            tags: ['courier:free'],
          },
          screen: {
            variantId: 12,
            handle: 'iphone-15-screen',
            title: 'iPhone 15 Screen',
            price: 249,
            tags: [],
          },
        },
      },
    },
  };
}

describe('applyVariantPrices', () => {
  it('updates a changed price and leaves the rest of the row', () => {
    const map = sample();
    const { changes, missing } = applyVariantPrices(map, { 11: '119.00', 12: '249.00' });
    assert.equal(changes.length, 1);
    assert.equal(changes[0].from, 99);
    assert.equal(changes[0].to, 119);
    assert.equal(map.models['iphone::iphone-15'].repairs.battery.price, 119);
    assert.equal(map.models['iphone::iphone-15'].repairs.battery.handle, 'iphone-15-battery');
    assert.deepEqual(map.models['iphone::iphone-15'].repairs.battery.tags, ['courier:free']);
    assert.equal(map.models['iphone::iphone-15'].repairs.screen.price, 249);
    assert.equal(missing.length, 0);
  });

  it('treats 119 and 119.00 as the same price', () => {
    const map = sample();
    map.models['iphone::iphone-15'].repairs.battery.price = 119;
    const { changes } = applyVariantPrices(map, { 11: '119.00', 12: 249 });
    assert.equal(changes.length, 0);
    assert.equal(toCents('119.00'), 11900);
  });

  it('keeps a repair when Shopify has no price for that variant', () => {
    const map = sample();
    const { changes, missing } = applyVariantPrices(map, { 12: '249.00' });
    assert.equal(changes.length, 0);
    assert.equal(missing.length, 1);
    assert.equal(missing[0].variantId, 11);
    assert.equal(map.models['iphone::iphone-15'].repairs.battery.price, 99);
    assert.deepEqual(collectVariantIds(map).sort(), ['11', '12']);
  });

  it('stores a pence price', () => {
    const map = sample();
    const { changes } = applyVariantPrices(map, { 11: '119.50', 12: '249.00' });
    assert.equal(changes[0].to, 119.5);
    assert.equal(map.models['iphone::iphone-15'].repairs.battery.price, 119.5);
  });
});
