/**
 * Catalogue price sync. No network.
 * Run: node --test scripts/courier/sync-catalogue-prices.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  applyVariantPrices,
  applyCourierTiers,
  collectVariantIds,
  toCents,
} = require('./sync-catalogue-prices.js');

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

describe('applyCourierTiers (#119: under £200 always pays courier)', () => {
  function row(price, tags) {
    return { variantId: 1, handle: 'h', title: 't', price, tags };
  }
  function mapOf(repairs) {
    return { models: { 'iphone::iphone-17': { repairs } } };
  }

  it('strips a stale courier:free tag when the price is below £200', () => {
    const map = sample();
    const battery = map.models['iphone::iphone-15'].repairs.battery;
    battery.price = 179;
    const { tagChanges } = applyCourierTiers(map);
    assert.deepEqual(battery.tags, []);
    const stripped = tagChanges.find((c) => c.type === 'battery');
    assert.deepEqual(stripped.from, ['courier:free']);
    assert.deepEqual(stripped.to, []);
    assert.equal(stripped.price, 179);
  });

  it('strips the tag in the same pass as a price drop below £200', () => {
    const map = sample();
    applyVariantPrices(map, { 11: '179.00', 12: '249.00' });
    const battery = map.models['iphone::iphone-15'].repairs.battery;
    assert.equal(battery.price, 179);
    assert.deepEqual(battery.tags, ['courier:free']);
    applyCourierTiers(map);
    assert.deepEqual(battery.tags, []);
  });

  it('adds courier:free when the price is £200 or more and no tier tag exists', () => {
    const map = sample();
    const { tagChanges } = applyCourierTiers(map);
    assert.deepEqual(map.models['iphone::iphone-15'].repairs.screen.tags, ['courier:free']);
    assert.ok(tagChanges.some((c) => c.type === 'screen' && c.to.includes('courier:free')));
  });

  it('strips courier:one-leg too, and keeps unrelated tags, below £200', () => {
    const map = mapOf({ a: row(179, ['courier:one-leg', 'COURIER:FREE', 'other']) });
    applyCourierTiers(map);
    assert.deepEqual(map.models['iphone::iphone-17'].repairs.a.tags, ['other']);
  });

  it('treats exactly £200 as free and £199.99 as paid', () => {
    const map = mapOf({ a: row(200, []), b: row(199.99, ['courier:free']) });
    applyCourierTiers(map);
    assert.deepEqual(map.models['iphone::iphone-17'].repairs.a.tags, ['courier:free']);
    assert.deepEqual(map.models['iphone::iphone-17'].repairs.b.tags, []);
  });

  it('leaves an explicit one-leg tag in place at £200 or more', () => {
    const map = mapOf({ a: row(249, ['courier:one-leg']) });
    const { tagChanges } = applyCourierTiers(map);
    assert.equal(tagChanges.length, 0);
    assert.deepEqual(map.models['iphone::iphone-17'].repairs.a.tags, ['courier:one-leg']);
  });

  it('reports no change when tags already match the price', () => {
    const map = mapOf({ a: row(249, ['courier:free']), b: row(89, []) });
    const { tagChanges } = applyCourierTiers(map);
    assert.equal(tagChanges.length, 0);
  });

  it('adds a tags array to a £200+ row that has none', () => {
    const map = mapOf({ a: { variantId: 1, price: 249 } });
    applyCourierTiers(map);
    assert.deepEqual(map.models['iphone::iphone-17'].repairs.a.tags, ['courier:free']);
  });

  it('leaves rows with no usable price alone', () => {
    const map = mapOf({
      a: row(null, ['courier:free']),
      b: row('', ['courier:free']),
      c: row('n/a', ['courier:free']),
    });
    const { tagChanges } = applyCourierTiers(map);
    assert.equal(tagChanges.length, 0);
    assert.deepEqual(map.models['iphone::iphone-17'].repairs.a.tags, ['courier:free']);
  });

  it('no row under £200 in the committed catalogue keeps a free-courier tag', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const map = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../assets/repair-catalogue-map.json'), 'utf8')
    );
    const offenders = [];
    for (const [modelKey, model] of Object.entries(map.models || {})) {
      for (const [type, r] of Object.entries(model.repairs || {})) {
        const tags = Array.isArray(r.tags) ? r.tags : [];
        if (Number(r.price) < 200 && tags.some((t) => /^courier:(free|one-leg)$/i.test(t))) {
          offenders.push(modelKey + ' ' + type + ' £' + r.price + ' ' + (r.handle || ''));
        }
      }
    }
    assert.deepEqual(offenders, []);
  });
});
