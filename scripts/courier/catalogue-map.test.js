/**
 * Catalogue map + lookup tests (#53).
 * Run: node --test scripts/courier/catalogue-map.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const {
  findModel,
  getRepair,
  repairsMapForModel,
} = require('../../assets/repair-catalogue.js');
const {
  quoteCourierCollection,
} = require('../../assets/courier-pricing.js');

const map = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/repair-catalogue-map.json'), 'utf8')
);
const bands = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8')
);

describe('repair catalogue map', () => {
  it('covers hundreds of model×repair rows from the Admin snapshot', () => {
    assert.ok(map.model_count >= 200);
    assert.ok(map.repair_count >= 800);
  });

  it('resolves MacBook Air M1 A2337 screen to a real variant + price', () => {
    const repair = getRepair(
      map,
      'macbook',
      "MacBook Air 13-inch 'M1' A2337 (2020)",
      'screen'
    );
    assert.ok(repair);
    assert.equal(typeof repair.variantId, 'number');
    assert.ok(repair.price > 0);
    assert.ok(repair.handle.includes('a2337'));
  });

  it('builds a wizard repairs map without scraping', () => {
    const repairs = repairsMapForModel(
      map,
      'macbook',
      "MacBook Air 13-inch 'M1' A2337 (2020)"
    );
    assert.ok(repairs.battery);
    assert.ok(repairs.screen);
    assert.ok(Number(repairs.battery.variants[0].price) > 0);
  });

  it('finds models by A-number even if the label is slightly different', () => {
    const model = findModel(map, 'macbook', 'MacBook Air M1 A2337');
    assert.ok(model);
    assert.match(model.name, /A2337/);
  });
});

describe('SW11 all-in adjustment (done-when, policy v2)', () => {
  it('SW11 + free tier → £0 adjustment (all-in)', () => {
    const q = quoteCourierCollection({
      postcode: 'SW11 8BJ',
      productTags: ['courier:free'],
      bands,
      repairPrice: 299,
    });
    assert.equal(q.service, 'courier');
    assert.equal(q.band, 'B2');
    assert.equal(q.adjustment, 0);
    assert.equal(q.customer_price, 0);
    assert.equal(q.total, 299);
  });

  it('SW11 + untagged/<£200 → +£25 courier adjustment', () => {
    const q = quoteCourierCollection({
      postcode: 'SW11 8BJ',
      productTags: [],
      bands,
      repairPrice: 89,
    });
    assert.equal(q.service, 'courier');
    assert.equal(q.adjustment, 25);
    assert.equal(q.customer_price, 25);
    assert.equal(q.total, 114);
  });

  it('unknown postcode → mail-in, never throws', () => {
    const q = quoteCourierCollection({
      postcode: 'M1 1AE',
      productTags: ['courier:free'],
      bands,
      repairPrice: 299,
    });
    assert.equal(q.service, 'mail-in');
    assert.equal(q.adjustment, 0);
    assert.equal(q.total, 299);
  });
});
