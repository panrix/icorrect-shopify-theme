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
  applyShelfPrices,
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

  it('parses full postcodes with or without a space, in any case', () => {
    const cases = {
      W1F0DP: 'W1F',
      'w1f 0dp': 'W1F',
      w1f0dp: 'W1F',
      SW114GG: 'SW11',
      'SW11 4GG': 'SW11',
      EC1A1BB: 'EC1A',
      'ec1a 1bb': 'EC1A',
      'W1W 8JQ': 'W1W',
      W1W8JQ: 'W1W',
      ' w1w   8jq ': 'W1W',
      M11AE: 'M1',
      'B33 8TH': 'B33',
      CR26XH: 'CR2',
      SE260AB: 'SE26',
    };
    for (const [input, outward] of Object.entries(cases)) {
      assert.equal(extractOutwardCode(input), outward, input);
    }
  });

  it('keeps an outward code typed on its own or before a half-typed inward', () => {
    assert.equal(extractOutwardCode('SW11'), 'SW11');
    assert.equal(extractOutwardCode('sw1a'), 'SW1A');
    assert.equal(extractOutwardCode('SW11 4'), 'SW11');
  });

  it('returns null for text that is not a UK postcode', () => {
    for (const input of ['', '   ', null, undefined, '12 Margaret Street', 'SW114', 'W1F0D', 'LONDON', '123456']) {
      assert.equal(extractOutwardCode(input), null, String(input));
    }
  });
});

describe('no-space postcodes reach the courier band', () => {
  it('W1F0DP → W1F courier band', () => {
    const spaced = lookupCourierBand('W1F 0DP', bandsAsset);
    const compact = lookupCourierBand('W1F0DP', bandsAsset);
    assert.equal(compact.service, 'courier');
    assert.equal(compact.outward, 'W1F');
    assert.equal(compact.band, spaced.band);
  });

  it('SW114GG → SW11 B2', () => {
    const result = lookupCourierBand('SW114GG', bandsAsset);
    assert.equal(result.service, 'courier');
    assert.equal(result.outward, 'SW11');
    assert.equal(result.band, 'B2');
  });

  it('EC1A1BB → EC1 via district fallback, same as EC1A 1BB', () => {
    const spaced = lookupCourierBand('EC1A 1BB', bandsAsset);
    const compact = lookupCourierBand('ec1a1bb', bandsAsset);
    assert.equal(compact.outward, 'EC1A');
    assert.equal(compact.service, spaced.service);
    assert.equal(compact.band, spaced.band);
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
    assert.equal(q.charged, 0);
    assert.equal(q.total, 299);
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
    assert.equal(q.charged, 25);
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
    assert.equal(q.charged, 0);
    assert.equal(q.total, 89);
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
      assert.equal(q.charged, 0);
      assert.equal(q.total, 89);
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
  it('quote exposes total = repair + basket charge, not a separate courier fee line', () => {
    const q = quoteCourierCollection({
      postcode: 'SW11 8BJ',
      productTags: [],
      bands: bandsAsset,
      repairPrice: 89,
      variants: variantsAsset,
    });
    assert.equal(q.charged, 25);
    assert.equal(q.total, q.repair_price + q.charged);
    assert.equal(q.customer_price, q.charged);
    assert.ok(!('courier_fee' in q));
    assert.ok(!('courier_breakdown' in q));
  });

  it('£0 Shopify variant is not added to the payable total', () => {
    const b3 = quoteServiceAdjustment({
      postcode: 'N6 4AA',
      productTags: ['courier:free'],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    assert.equal(b3.adjustment, 15);
    assert.equal(b3.charged, 0);
    assert.equal(b3.total, 299);

    const mail = quoteServiceAdjustment({
      postcode: 'SW11 8BJ',
      productTags: [],
      bands: bandsAsset,
      service: 'mail-in',
      repairPrice: 149,
      variants: variantsAsset,
    });
    assert.equal(mail.adjustment, 20);
    assert.equal(mail.charged, 0);
    assert.equal(mail.total, 149);
  });

  it('applyShelfPrices reads Ajax product.js pence onto the price map', () => {
    const asset = {
      variants: { '25': 71280436445437, '20': 71280436412669 },
      prices: { '25': 25, '20': 20 },
    };
    applyShelfPrices(asset, {
      variants: [
        { id: 71280436445437, price: 2500 },
        { id: 71280436412669, price: 0 },
      ],
    });
    assert.equal(asset.prices['25'], 25);
    assert.equal(asset.prices['20'], 0);
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

describe('quote wizard total follows the basket charge', () => {
  const wizard = [
    fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8'),
    fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8'),
  ].join('\n');

  function sliceFn(startNeedle, endNeedle) {
    const start = wizard.indexOf(startNeedle);
    const end = wizard.indexOf(endNeedle);
    assert.ok(start >= 0 && end > start, `missing ${startNeedle}`);
    return wizard.slice(start, end);
  }

  it('all-in total adds serviceCharge, which is the Shopify shelf price', () => {
    const fn = sliceFn('function refreshAllInTotal()', 'function selectServiceCard(');
    assert.match(fn, /serviceCharge\(_courierQuote\)/);
    assert.equal(fn.includes('_courierQuote.adjustment'), false);
  });

  it('cart still adds the adjustment variant when the policy amount is positive', () => {
    const fn = sliceFn('function buildCartItems()', 'function getShopifyRoot()');
    assert.match(fn, /_courierQuote\.adjustment > 0/);
  });
});
