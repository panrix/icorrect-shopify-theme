/**
 * Courier / mail-in service adjustment tests (#53 policy v2).
 * All-in totals — adjustment matrix by band × tag, single total, null-variant fallback.
 * Run: node --test scripts/courier/courier-pricing.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const {
  extractOutwardCode,
  lookupCourierBand,
  resolveCourierTier,
  computeAdjustment,
  resolveAdjustmentVariant,
  storefrontAdjustmentMap,
  quoteServiceAdjustment,
  quoteCourierCollection,
  ADJUSTMENT,
} = require('../../assets/courier-pricing.js');

const bandsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8')
);
const variantsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'data/service-adjustment-variants.json'), 'utf8')
);

const SAMPLES = [
  { postcode: 'W1B 4BD', outward: 'W1B', band: 'B1', rt_cost: 17.08 },
  { postcode: 'sw11 8bj', outward: 'SW11', band: 'B2', rt_cost: 24.28 },
  { postcode: 'N6 4AA', outward: 'N6', band: 'B3', rt_cost: 32.4 },
  { postcode: 'W5 5RF', outward: 'W5', band: 'B4', rt_cost: 44.54 },
];
const OUTSIDE = 'M1 1AE';

describe('extractOutwardCode', () => {
  it('takes the uppercased prefix before the space', () => {
    assert.equal(extractOutwardCode('sw11 8bj'), 'SW11');
    assert.equal(extractOutwardCode('W1B 4BD'), 'W1B');
  });
});

describe('outward → band lookup', () => {
  for (const sample of SAMPLES) {
    it(`${sample.postcode} → ${sample.band}`, () => {
      const result = lookupCourierBand(sample.postcode, bandsAsset);
      assert.equal(result.service, 'courier');
      assert.equal(result.outward, sample.outward);
      assert.equal(result.band, sample.band);
      assert.equal(result.rt_cost, sample.rt_cost);
    });
  }

  it(`${OUTSIDE} → mail-in fallback`, () => {
    const result = lookupCourierBand(OUTSIDE, bandsAsset);
    assert.equal(result.service, 'mail-in');
    assert.equal(result.band, null);
  });

  it("SW1A 1AA → B1 via district SW1 (trailing letter fallback)", () => {
    const result = lookupCourierBand('SW1A 1AA', bandsAsset);
    assert.equal(result.service, 'courier');
    assert.equal(result.band, 'B1');
    assert.equal(result.rt_cost, bandsAsset.outward.SW1.rt_cost);
  });

  it("W1T 2LY still matches the existing W1T key as B1", () => {
    const result = lookupCourierBand('W1T 2LY', bandsAsset);
    assert.equal(result.service, 'courier');
    assert.equal(result.outward, 'W1T');
    assert.equal(result.band, 'B1');
    assert.equal(result.rt_cost, bandsAsset.outward.W1T.rt_cost);
  });

  it("unknown ZZ9 9ZZ still mail-in fallback", () => {
    const result = lookupCourierBand('ZZ9 9ZZ', bandsAsset);
    assert.equal(result.service, 'mail-in');
    assert.equal(result.band, null);
    assert.equal(result.rt_cost, null);
  });
});

describe('resolveCourierTier (tags beat price)', () => {
  it('courier:free → free', () => {
    assert.equal(resolveCourierTier(['courier:free']), 'free');
  });
  it('courier:one-leg → one-leg', () => {
    assert.equal(resolveCourierTier(['courier:one-leg']), 'one-leg');
  });
  it('untagged → paid', () => {
    assert.equal(resolveCourierTier([]), 'paid');
  });
  it('untagged + price ≥£200 → free', () => {
    assert.equal(resolveCourierTier([], 200), 'free');
    assert.equal(resolveCourierTier([], 199), 'paid');
  });
  it('manual free tag wins under £200 (MacBook battery edge)', () => {
    assert.equal(resolveCourierTier(['courier:free'], 199), 'free');
  });
  it('legacy subsidised/full → paid', () => {
    assert.equal(resolveCourierTier(['courier:subsidised']), 'paid');
    assert.equal(resolveCourierTier(['courier:full']), 'paid');
  });
});

describe('adjustment matrix — band × tag × service', () => {
  const freeTags = ['courier:free'];
  const paidTags = [];

  it('≥£200 B1–B2 courier → £0', () => {
    for (const s of SAMPLES.filter((x) => x.band === 'B1' || x.band === 'B2')) {
      const q = quoteServiceAdjustment({
        postcode: s.postcode,
        productTags: freeTags,
        bands: bandsAsset,
        service: 'courier',
        repairPrice: 299,
        variants: variantsAsset,
      });
      assert.equal(q.service, 'courier');
      assert.equal(q.adjustment, 0);
      assert.equal(q.total, 299);
    }
  });

  it('≥£200 B3 courier → +£15', () => {
    const q = quoteServiceAdjustment({
      postcode: 'N6 4AA',
      productTags: freeTags,
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    assert.equal(q.adjustment, 15);
    assert.equal(q.total, 314);
    assert.equal(q.variantId, variantsAsset.variants['15']);
    assert.equal(q.variantMode, 'ok');
  });

  it('≥£200 B4 courier → +£25', () => {
    const q = quoteServiceAdjustment({
      postcode: 'W5 5RF',
      productTags: freeTags,
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    assert.equal(q.adjustment, 25);
    assert.equal(q.total, 324);
    assert.equal(q.variantId, variantsAsset.variants['25']);
  });

  it('≥£200 mail-in any band / outside → £0', () => {
    for (const pc of ['SW11 8BJ', 'N6 4AA', 'W5 5RF', OUTSIDE]) {
      const q = quoteServiceAdjustment({
        postcode: pc,
        productTags: freeTags,
        bands: bandsAsset,
        service: 'mail-in',
        repairPrice: 299,
        variants: variantsAsset,
      });
      assert.equal(q.service, 'mail-in');
      assert.equal(q.adjustment, 0);
      assert.equal(q.total, 299);
    }
  });

  it('<£200 B1–B2 courier → +£25', () => {
    const q = quoteServiceAdjustment({
      postcode: 'SW11 8BJ',
      productTags: paidTags,
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 89,
      variants: variantsAsset,
    });
    assert.equal(q.service, 'courier');
    assert.equal(q.adjustment, 25);
    assert.equal(q.total, 114);
    assert.equal(q.variantId, variantsAsset.variants['25']);
  });

  it('<£200 + B1 + courier selected → adjustment 25, variant …445437, service stays courier', () => {
    const q = quoteServiceAdjustment({
      postcode: 'W1B 4BD',
      productTags: [],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 89,
      variants: variantsAsset,
    });
    assert.equal(q.tier, 'paid');
    assert.equal(q.band, 'B1');
    assert.equal(q.service, 'courier');
    assert.equal(q.forcedMailIn, false);
    assert.equal(q.courierAvailable, true);
    assert.equal(q.adjustment, 25);
    assert.equal(q.variantId, 71280436445437);
    assert.equal(q.variantMode, 'ok');
    assert.equal(q.total, 114);
  });

  it('<£200 B1–B2 mail-in → +£20', () => {
    const q = quoteServiceAdjustment({
      postcode: 'SW11 8BJ',
      productTags: paidTags,
      bands: bandsAsset,
      service: 'mail-in',
      repairPrice: 89,
      variants: variantsAsset,
    });
    assert.equal(q.adjustment, 20);
    assert.equal(q.total, 109);
    assert.equal(q.variantId, variantsAsset.variants['20']);
  });

  it('<£200 + B3/B4 + courier → still mail-in only', () => {
    for (const pc of ['N6 4AA', 'W5 5RF', OUTSIDE]) {
      const q = quoteServiceAdjustment({
        postcode: pc,
        productTags: paidTags,
        bands: bandsAsset,
        service: 'courier',
        repairPrice: 89,
        variants: variantsAsset,
      });
      assert.equal(q.service, 'mail-in');
      assert.equal(q.forcedMailIn, true);
      assert.equal(q.adjustment, 20);
      assert.equal(q.total, 109);
    }
  });

  it('computeAdjustment matches ADJUSTMENT constants', () => {
    assert.equal(computeAdjustment('free', 'B3', 'courier').adjustment, ADJUSTMENT.B3_ONE_LEG);
    assert.equal(computeAdjustment('free', 'B4', 'courier').adjustment, ADJUSTMENT.B4_ONE_LEG);
    assert.equal(computeAdjustment('paid', 'B1', 'courier').adjustment, ADJUSTMENT.PAID_COURIER);
    assert.equal(computeAdjustment('paid', null, 'mail-in').adjustment, ADJUSTMENT.MAIL_IN);
  });
});

describe('single all-in total (never courier breakdown field)', () => {
  it('quote exposes total = repair + adjustment, not a separate courier fee line', () => {
    const q = quoteCourierCollection({
      postcode: 'SW11 8BJ',
      productTags: [],
      bands: bandsAsset,
      repairPrice: 89,
      variants: variantsAsset,
    });
    assert.equal(q.total, q.repair_price + q.adjustment);
    assert.equal(q.customer_price, q.adjustment);
    assert.ok(!('courier_fee' in q));
    assert.ok(!('courier_breakdown' in q));
  });
});

describe('null-variant fallback', () => {
  it('missing variant ID → free mail-in, never £0 charge for quoted adjustment', () => {
    const warnings = [];
    const resolved = resolveAdjustmentVariant(25, { variants: {} }, {
      warn: (msg) => warnings.push(msg),
    });
    assert.equal(resolved.mode, 'fallback-free-mail-in');
    assert.equal(resolved.variantId, null);
    assert.equal(resolved.adjustment, 0);
    assert.ok(warnings.length >= 1);

    const q = quoteServiceAdjustment({
      postcode: 'SW11 8BJ',
      productTags: [],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 89,
      variants: { variants: {} },
    });
    assert.equal(q.service, 'mail-in');
    assert.equal(q.forcedMailIn, true);
    assert.equal(q.adjustment, 0);
    assert.equal(q.total, 89);
    assert.equal(q.variantMode, 'fallback-free-mail-in');
    assert.equal(q.variantId, null);
  });

  it('variant map resolves 15/20/25 IDs from data/service-adjustment-variants.json', () => {
    assert.equal(resolveAdjustmentVariant(15, variantsAsset).variantId, variantsAsset.variants['15']);
    assert.equal(resolveAdjustmentVariant(20, variantsAsset).variantId, variantsAsset.variants['20']);
    assert.equal(resolveAdjustmentVariant(25, variantsAsset).variantId, variantsAsset.variants['25']);
  });
});

describe('wizard and booker probe live service-adjustment.js', () => {
  const wizardSrc = fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8');
  const additionalSrc = fs.readFileSync(path.join(root, 'snippets/additional-repair.liquid'), 'utf8');

  it('quote wizard replaces hardcoded IDs from product.js and clears them on 404', () => {
    assert.match(wizardSrc, /products\/' \+ adjHandle \+ '\.js/);
    assert.match(wizardSrc, /storefrontAdjustmentMap/);
    assert.match(wizardSrc, /source: 'unavailable'/);
  });

  it('additional-repair probes the same handle before quoting', () => {
    assert.match(additionalSrc, /function ensureServiceAdjustments\(\)/);
    assert.match(additionalSrc, /storefrontAdjustmentMap/);
    assert.match(additionalSrc, /Promise\.all\(\[ensureBands\(\), ensureServiceAdjustments\(\)\]\)/);
    assert.match(additionalSrc, /await ensureServiceAdjustments\(\)/);
  });
});

describe('storefrontAdjustmentMap', () => {
  it('returns empty when the product is missing (draft / 404)', () => {
    assert.deepEqual(storefrontAdjustmentMap(null), {});
    assert.deepEqual(storefrontAdjustmentMap(undefined), {});
    assert.deepEqual(storefrontAdjustmentMap({ variants: [] }), {});
  });

  it('maps Shopify product.js variants by pound price, including cents', () => {
    const map = storefrontAdjustmentMap({
      variants: [
        { id: 111, price: 1500, available: true },
        { id: 222, price: 2000, available: true },
        { id: 333, price: 2500, available: false },
      ],
    });
    assert.deepEqual(map, { '15': 111, '20': 222, '25': 333 });
  });

  it('unpublished product empties the map so a £49 diagnostic cannot cart a dead £25 id', () => {
    const q = quoteServiceAdjustment({
      postcode: 'SW11 8BJ',
      productTags: [],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 49,
      variants: { variants: storefrontAdjustmentMap(null) },
    });
    assert.equal(q.variantMode, 'fallback-free-mail-in');
    assert.equal(q.variantId, null);
    assert.equal(q.adjustment, 0);
    assert.equal(q.total, 49);
  });
});
