'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { shopifyProductIdFromHandle } = require('./shopify-handle');

describe('Shopify handle → product id', () => {
  it('returns the product id for a matching handle', async () => {
    const id = await shopifyProductIdFromHandle('iphone-16-pro-max-oled-screen-repair', {
      store: 'i-correct-final.myshopify.com',
      token: 'tok',
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ products: [{ id: 111, handle: 'iphone-16-pro-max-oled-screen-repair' }] })
      })
    });
    assert.equal(id, '111');
  });

  it('fail-closes when Shopify is unconfigured or empty', async () => {
    assert.equal(await shopifyProductIdFromHandle('x', { store: '', token: '' }), null);
    assert.equal(await shopifyProductIdFromHandle('missing', {
      store: 's',
      token: 't',
      fetchImpl: async () => ({ ok: true, json: async () => ({ products: [] }) })
    }), null);
  });
});
