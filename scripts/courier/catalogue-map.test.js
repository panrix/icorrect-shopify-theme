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
const { auditWizardCoverage, loadInputs } = require('./wizard-coverage');

const map = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/repair-catalogue-map.json'), 'utf8')
);
const bands = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8')
);

describe('repair catalogue map', () => {
  it('covers hundreds of model×repair rows from the Admin snapshot', () => {
    assert.ok(map.model_count >= 100);
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

  it('keeps only wizard fields on each repair row', () => {
    const allowed = new Set(['variantId', 'handle', 'title', 'price', 'tags']);
    const sample = map.models['watch::apple-watch-se-2-40mm'].repairs.battery;
    assert.deepEqual(Object.keys(sample).sort(), [...allowed].sort());
    const bytes = fs.statSync(path.join(root, 'assets/repair-catalogue-map.json')).size;
    assert.ok(bytes < 260000, 'catalogue map should stay under 260KB, got ' + bytes);
  });

  it('maps iPhone 17 Screen from the live catalogue (not a 16 clone)', () => {
    const repair = getRepair(map, 'iphone', 'iPhone 17', 'screen');
    assert.ok(repair);
    assert.equal(repair.handle, 'iphone-17-screen');
    assert.equal(repair.price, 329);
    assert.equal(repair.variantId, 71308261589245);
  });

  it('resolves wizard aliases when Monday/Shopify titles differ', () => {
    const repair = getRepair(
      map,
      'ipad',
      'iPad Pro 11” 2nd Gen (2020)',
      'screen'
    );
    assert.ok(repair);
    assert.equal(repair.handle, 'ipad-pro-11-2020-m1-screen-repair');
    assert.ok(repair.price > 0);
    const model = findModel(map, 'ipad', 'iPad Pro 11" 2nd Gen (2020)');
    assert.ok(model);
    assert.match(model.name, /iPad Pro 11(?:-inch)? M1 \(2020\)/);
  });

  it('keeps iPhone 16 rear glass on the iPhone 16 model', () => {
    const repair = getRepair(map, 'iphone', 'iPhone 16', 'rear-glass');
    assert.ok(repair);
    assert.equal(repair.handle, 'iphone-16-rear-glass-repair');
    assert.equal(map.models['iphone::iphone-16-rear-glass-replacement'], undefined);
  });

  it('classifies earpiece separately from loudspeaker', () => {
    const ear = getRepair(map, 'iphone', 'iPhone 17', 'earpiece');
    const speaker = getRepair(map, 'iphone', 'iPhone 17', 'loudspeaker');
    assert.ok(ear);
    assert.ok(speaker);
    assert.match(ear.handle, /earpiece/);
    assert.match(speaker.handle, /loudspeaker/);
  });

  it('maps MacBook Pro 13 M2 A2338 menu name to every collection repair', () => {
    const repairs = repairsMapForModel(
      map,
      'macbook',
      'MacBook Pro 13” ‘M2’ A2338 (2022)'
    );
    assert.ok(repairs.screen, 'screen');
    assert.ok(repairs.battery, 'battery');
    assert.ok(repairs.keyboard, 'keyboard');
    assert.ok(repairs.trackpad, 'trackpad');
    assert.ok(repairs['charging-port'], 'charging-port');
    assert.ok(repairs['touch-bar'], 'touch-bar');
    assert.ok(repairs.diagnostic, 'diagnostic');
    assert.match(repairs.screen.handle, /m2-2022-a2338/);
  });

  it('does not collapse M2 A2338 into the M1 A2338 catalogue row', () => {
    const m2 = findModel(map, 'macbook', 'MacBook Pro 13” ‘M2’ A2338 (2022)');
    const m1 = findModel(map, 'macbook', 'MacBook Pro 13” ‘M1’ A2338 (2020)');
    assert.ok(m2);
    assert.ok(m1);
    assert.notEqual(m2.slug, m1.slug);
    assert.ok(m1.repairs.dustgate);
    assert.equal(m2.repairs.dustgate, undefined);
  });

  it('maps every wizard menu name to the live catalogue repairs', () => {
    const aliases = JSON.parse(
      fs.readFileSync(path.join(root, 'data/wizard-menu-aliases.json'), 'utf8')
    );
    const catalogue = JSON.parse(
      fs.readFileSync(path.join(root, 'data/shopify-catalogue-2026-09-15.json'), 'utf8')
    );
    const active = new Set((catalogue.products || []).map((p) => p.handle));
    const thin = [];
    for (const row of aliases.aliases || []) {
      const liveHandles = (row.productHandles || []).filter((h) => active.has(h));
      if (liveHandles.length < 2) continue;
      const model = findModel(map, row.device, row.menuName);
      const count = model && model.repairs ? Object.keys(model.repairs).length : 0;
      if (count < 2) {
        thin.push(row.menuName + ' → ' + count + ' (collection ' + liveHandles.length + ')');
      }
    }
    assert.deepEqual(thin, []);
  });

  it('quotes iPad Air 11 M3 screen from the Display Repair SKU', () => {
    const repair = getRepair(
      map,
      'ipad',
      'iPad Air 11" 7th Gen \'M3\' (2025)',
      'screen'
    );
    assert.ok(repair);
    assert.equal(repair.handle, 'ipad-air-11-7th-gen-m3-2025-lcd-display-repair');
    assert.equal(repair.price, 399);
  });

  it('keeps MacBook Touch Bar SKUs on the same model as screen/battery', () => {
    const repairs = repairsMapForModel(
      map,
      'macbook',
      'MacBook Pro 15” A1990 (2018-2019)'
    );
    assert.ok(repairs['touch-bar'], 'touch-bar');
    assert.ok(repairs.screen, 'screen');
    assert.match(repairs['touch-bar'].handle, /a1990/);
  });

  it('classifies Apple Watch side button as side-button, not power-button', () => {
    const repairs = repairsMapForModel(map, 'watch', 'Apple Watch Ultra 2');
    assert.ok(repairs['side-button']);
    assert.equal(repairs['side-button'].handle, 'apple-watch-ultra-2-side-button-repair');
    assert.equal(repairs['power-button'], undefined);
  });

  it('maps iPad Pro 13 M4 battery from the mistagged Shopify product', () => {
    const repair = getRepair(
      map,
      'ipad',
      'iPad Pro 13” 7th Gen ‘M4’ (2024)',
      'battery'
    );
    assert.ok(repair);
    assert.equal(repair.handle, 'ipad-pro-13-2024-m4-battery-repair');
    assert.equal(repair.price, 229);
  });

  it('maps every live collection SKU onto the wizard repairs map', () => {
    const report = auditWizardCoverage(loadInputs());
    assert.equal(report.ok, true, JSON.stringify(report.gaps, null, 2));
    assert.ok(report.checked >= 100);
    assert.ok(report.skus >= 800);
  });

  it('maps watch side-button onto Buttons / Crown in the wizard', () => {
    const liquid = fs.readFileSync(
      path.join(root, 'sections/quote-wizard.liquid'),
      'utf8'
    );
    assert.match(liquid, /device === 'watch' && fault === 'Buttons'/);
    assert.match(liquid, /available\['Buttons \/ Crown'\] = true/);
    const repairs = repairsMapForModel(map, 'watch', 'Apple Watch Ultra 2');
    assert.ok(repairs['side-button']);
    assert.equal(repairs['power-button'], undefined);
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
