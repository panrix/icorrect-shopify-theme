/**
 * Courier band + tier pricing tests (#53).
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
  customerCourierPrice,
  quoteCourierCollection,
} = require('../../assets/courier-pricing.js');

const bandsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8')
);

/** Five covered postcodes (B1–B4) + one unknown → mail-in. */
const SAMPLE_POSTCODES = [
  { postcode: 'W1B 4BD', outward: 'W1B', band: 'B1', rt_cost: 17.08 },
  { postcode: 'sw11 8bj', outward: 'SW11', band: 'B2', rt_cost: 24.28 },
  { postcode: 'N6 4AA', outward: 'N6', band: 'B3', rt_cost: 32.4 },
  { postcode: 'W5 5RF', outward: 'W5', band: 'B4', rt_cost: 44.54 },
  { postcode: 'E14 5AB', outward: 'E14', band: 'B2', rt_cost: 31.46 },
];

const UNKNOWN_POSTCODE = 'M1 1AE';

describe('extractOutwardCode', () => {
  it('takes the uppercased prefix before the space', () => {
    assert.equal(extractOutwardCode('sw11 8bj'), 'SW11');
    assert.equal(extractOutwardCode('W1B 4BD'), 'W1B');
  });

  it('accepts postcodes without an inward part', () => {
    assert.equal(extractOutwardCode('EC1'), 'EC1');
    assert.equal(extractOutwardCode('  n6  '), 'N6');
  });
});

describe('outward → band lookup (theme asset)', () => {
  for (const sample of SAMPLE_POSTCODES) {
    it(`${sample.postcode} → ${sample.band}`, () => {
      const result = lookupCourierBand(sample.postcode, bandsAsset);
      assert.equal(result.service, 'courier');
      assert.equal(result.outward, sample.outward);
      assert.equal(result.band, sample.band);
      assert.equal(result.rt_cost, sample.rt_cost);
    });
  }

  it(`${UNKNOWN_POSTCODE} (unknown) → mail-in fallback`, () => {
    const result = lookupCourierBand(UNKNOWN_POSTCODE, bandsAsset);
    assert.equal(result.service, 'mail-in');
    assert.equal(result.band, null);
    assert.equal(result.rt_cost, null);
    assert.equal(result.outward, 'M1');
  });

  it('asset covers 99 London outward codes B1–B4', () => {
    const codes = Object.keys(bandsAsset.outward);
    assert.equal(codes.length, 99);
    for (const code of codes) {
      assert.match(bandsAsset.outward[code].band, /^B[1-4]$/);
    }
  });
});

describe('tier → customer courier price', () => {
  const tiers = [
    { tag: 'courier:free', tier: 'free', modifier: 0 },
    { tag: 'courier:subsidised', tier: 'subsidised', modifier: 0.5 },
    { tag: 'courier:full', tier: 'full', modifier: 1 },
  ];

  for (const { tag, tier, modifier } of tiers) {
    it(`resolves product tag ${tag}`, () => {
      assert.equal(resolveCourierTier(['repair', tag, 'macbook']), tier);
    });
  }

  for (const sample of SAMPLE_POSTCODES) {
    for (const { tag, tier, modifier } of tiers) {
      it(`${sample.band} ${sample.postcode} × ${tier} = £${(sample.rt_cost * modifier).toFixed(2)}`, () => {
        const quote = quoteCourierCollection({
          postcode: sample.postcode,
          productTags: [tag],
          bands: bandsAsset,
        });
        assert.equal(quote.service, 'courier');
        assert.equal(quote.band, sample.band);
        assert.equal(quote.tier, tier);
        assert.equal(quote.customer_price, customerCourierPrice(tier, sample.rt_cost));
        assert.equal(quote.customer_price, Math.round(sample.rt_cost * modifier * 100) / 100);
      });
    }
  }

  it('unknown postcode stays mail-in for every tier (no courier price)', () => {
    for (const { tag } of tiers) {
      const quote = quoteCourierCollection({
        postcode: UNKNOWN_POSTCODE,
        productTags: [tag],
        bands: bandsAsset,
      });
      assert.equal(quote.service, 'mail-in');
      assert.equal(quote.customer_price, null);
      assert.equal(quote.band, null);
    }
  });

  it('free is £0, subsidised is half RT, full is band RT', () => {
    assert.equal(customerCourierPrice('free', 24.28), 0);
    assert.equal(customerCourierPrice('subsidised', 24.28), 12.14);
    assert.equal(customerCourierPrice('full', 24.28), 24.28);
  });
});
