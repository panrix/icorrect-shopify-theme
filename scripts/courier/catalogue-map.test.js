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
  findWizardLabel,
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

  it('maps wizard iPad Pro 11 2nd Gen (2020) to the live 2020 screen product', () => {
    const model = findModel(map, 'ipad', 'iPad Pro 11” 2nd Gen (2020)');
    assert.ok(model, 'wizard 2nd Gen (2020) label must resolve to a catalogue model');
    assert.equal(model.name, 'iPad Pro 11 M1 (2020)');
    const screen = getRepair(map, 'ipad', 'iPad Pro 11” 2nd Gen (2020)', 'screen');
    assert.ok(screen);
    assert.equal(screen.handle, 'ipad-pro-11-2020-m1-screen-repair');
  });

  it('does not confuse iPad Pro 11 2nd Gen (2020) with the 2021 M1 3rd Gen', () => {
    const model = findModel(map, 'ipad', 'iPad Pro 11” 2nd Gen (2020)');
    assert.ok(model);
    assert.notEqual(model.name, 'iPad Pro 11 3rd Gen M1 (2021)');
    const third = findModel(map, 'ipad', 'iPad Pro 11” 3rd Gen M1 (2021)');
    assert.ok(third);
    assert.equal(third.name, 'iPad Pro 11 3rd Gen M1 (2021)');
  });

  it('maps wizard iPad Pro 12.9 4th Gen 2020 and iPad Air 4th Gen 2020 labels', () => {
    const pro = findModel(map, 'ipad', "iPad Pro 12.9” 4th Gen ‘M1’ (2020)");
    assert.ok(pro);
    assert.equal(pro.name, 'iPad Pro 12.9 4th Gen (2020)');
    const air = findModel(map, 'ipad', 'iPad Air 4th Gen (2020)');
    assert.ok(air);
    assert.equal(air.name, 'iPad Air 4 (2020)');
  });

  it('maps a catalogue product name back to the wizard collection label', () => {
    const label = findWizardLabel(
      map,
      'ipad',
      'iPad Pro 11 M1 (2020)',
      [
        'iPad Pro 11” 1st Gen (2019)',
        'iPad Pro 11” 2nd Gen (2020)',
        'iPad Pro 11” 3rd Gen M1 (2021)',
      ]
    );
    assert.equal(label, 'iPad Pro 11” 2nd Gen (2020)');
  });

  it('merges Watch Series 10 Display and adjacent-size glass into the wizard size', () => {
    const repairs45 = repairsMapForModel(map, 'watch', 'Apple Watch Series 10 45MM');
    assert.ok(repairs45.battery, 'base 45MM repairs stay');
    assert.ok(repairs45.screen, 'Display sibling supplies screen');
    assert.equal(repairs45.screen.handle, 'apple-watch-series-10-45mm-display-screen-repair');
    assert.ok(repairs45['screen-glass'], '46MM sibling supplies glass');
    assert.equal(repairs45['screen-glass'].handle, 'apple-watch-series-10-46mm-screen-glass-repair');

    const repairs41 = repairsMapForModel(map, 'watch', 'Apple Watch Series 10 41MM');
    assert.ok(repairs41.screen);
    assert.equal(repairs41.screen.handle, 'apple-watch-series-10-41mm-display-screen-repair');
    assert.ok(repairs41['screen-glass']);
    assert.equal(repairs41['screen-glass'].handle, 'apple-watch-series-10-42mm-screen-glass-repair');
  });

  it('keeps only wizard fields on each repair row', () => {
    const allowed = new Set(['variantId', 'handle', 'title', 'price', 'tags']);
    const sample = map.models['watch::apple-watch-se-2-40mm'].repairs.battery;
    assert.deepEqual(Object.keys(sample).sort(), [...allowed].sort());
    const bytes = fs.statSync(path.join(root, 'assets/repair-catalogue-map.json')).size;
    assert.ok(bytes < 220000, 'catalogue map should stay under 220KB, got ' + bytes);
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
