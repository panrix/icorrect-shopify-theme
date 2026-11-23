/**
 * Wizard catalogue helpers hide drafted repairs and models. No network.
 * Run: node --test scripts/courier/catalogue-availability.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../../assets/repair-catalogue.js');
const prefill = require('../../assets/wizard-prefill.js');

function map() {
  return {
    models: {
      'iphone::iphone-11': {
        device: 'iphone', name: 'iPhone 11', slug: 'iphone-11',
        repairs: {
          screen: { variantId: 1, handle: 'iphone-11-screen', title: 'iPhone 11 Screen', price: 199, tags: [], unavailable: true },
          battery: { variantId: 2, handle: 'iphone-11-battery', title: 'iPhone 11 Battery', price: 79, tags: [], unavailable: true },
        },
      },
      'iphone::iphone-15': {
        device: 'iphone', name: 'iPhone 15', slug: 'iphone-15',
        repairs: {
          screen: { variantId: 3, handle: 'iphone-15-screen', title: 'iPhone 15 Screen', price: 249, tags: [] },
          battery: { variantId: 4, handle: 'iphone-15-battery', title: 'iPhone 15 Battery', price: 99, tags: [], unavailable: true },
        },
      },
    },
  };
}

describe('catalogue availability', () => {
  it('hides a model when every repair is unavailable', () => {
    assert.equal(cat.modelIsOffered(map(), 'iphone', 'iPhone 11'), false);
    assert.deepEqual(Object.keys(cat.repairsMapForModel(map(), 'iphone', 'iPhone 11')), []);
  });
  it('hides only the drafted repairs when others are live', () => {
    assert.equal(cat.modelIsOffered(map(), 'iphone', 'iPhone 15'), true);
    assert.deepEqual(Object.keys(cat.repairsMapForModel(map(), 'iphone', 'iPhone 15')), ['screen']);
    assert.equal(cat.getRepair(map(), 'iphone', 'iPhone 15', 'battery'), null);
    assert.ok(cat.getRepair(map(), 'iphone', 'iPhone 15', 'screen'));
  });
  it('keeps models the catalogue does not know', () => {
    assert.equal(cat.modelIsOffered(map(), 'iphone', 'iPhone 99 Mega'), true);
  });
  it('does not prefill from an unavailable product', () => {
    assert.equal(prefill.resolveProductPrefill(map(), { handle: 'iphone-11-screen' }), null);
    assert.ok(prefill.resolveProductPrefill(map(), { handle: 'iphone-15-screen' }));
  });
});
