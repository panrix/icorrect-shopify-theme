'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  resolvePartIdsForHandle,
  resolveShopifyProductId,
  isInStock
} = require('./handle-map');

const MAP = {
  'iphone-16-pro-max-oled-screen-repair': {
    shopify_product_id: '123',
    part_ids: ['P-SCREEN'],
    device: 'iphone'
  },
  'a3186-screen-replacement': {
    shopify_product_id: '456',
    part_ids: ['P-MB-SCREEN'],
    device: 'macbook'
  }
};

describe('handle → parts map', () => {
  it('resolves part ids and shopify product id from the handle', () => {
    assert.deepEqual(
      resolvePartIdsForHandle('iPhone-16-Pro-Max-OLED-Screen-Repair', MAP),
      ['P-SCREEN']
    );
    assert.equal(
      resolveShopifyProductId('iphone-16-pro-max-oled-screen-repair', MAP),
      '123'
    );
    assert.deepEqual(resolvePartIdsForHandle('unknown-handle', MAP), []);
  });

  it('fail-closes stock when the handle is unmapped', () => {
    assert.equal(isInStock('ipad-pro-glass', { map: MAP, availabilityById: { 'P-SCREEN': 4 } }), false);
  });

  it('is in stock when any mapped part has available >= 1', () => {
    assert.equal(isInStock('iphone-16-pro-max-oled-screen-repair', {
      map: MAP,
      availabilityById: { 'P-SCREEN': 2 }
    }), true);
    assert.equal(isInStock('iphone-16-pro-max-oled-screen-repair', {
      map: MAP,
      availabilityById: { 'P-SCREEN': 0 }
    }), false);
  });
});
