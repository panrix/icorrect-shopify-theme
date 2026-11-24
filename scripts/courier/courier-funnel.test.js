/**
 * Courier funnel PostHog payload tests (#53).
 * Wizard JS lives in Liquid (not executed here). Payload shape is unit-tested
 * via courierFunnelExtra; Liquid is source-checked for event names + no-PII extras.
 *
 * Run: node --test scripts/courier/courier-funnel.test.js
 *
 * Manual (preview theme): enter SW11 8BJ → wizard_postcode_entered + wizard_courier_quoted
 * + wizard_service_selected + wizard_slot_selected; M1 1AE → wizard_out_of_area +
 * wizard_mailin_confirmed; Proceed → wizard_proceed before checkout. No full postcode.
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const {
  courierFunnelExtra,
  quoteServiceAdjustment,
} = require('../../assets/courier-pricing.js');

const bandsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8')
);
const variantsAsset = JSON.parse(
  fs.readFileSync(path.join(root, 'data/service-adjustment-variants.json'), 'utf8')
);

const FULL_POSTCODE = /\b[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}\b/i;
const WIZARD_EVENTS = [
  'wizard_postcode_entered',
  'wizard_courier_quoted',
  'wizard_out_of_area',
  'wizard_service_selected',
  'wizard_slot_selected',
  'wizard_proceed',
  'wizard_mailin_confirmed',
];
const BOOKER_EVENTS = WIZARD_EVENTS.filter((name) => name !== 'wizard_slot_selected');

function assertNoPii(payload) {
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'postcode'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'Postcode'), false);
  const blob = JSON.stringify(payload);
  assert.equal(FULL_POSTCODE.test(blob), false, 'payload leaked a full postcode: ' + blob);
}

describe('courierFunnelExtra', () => {
  it('in-area courier quote: outward + band + prices, never full postcode', () => {
    const quote = quoteServiceAdjustment({
      postcode: 'sw11 8bj',
      productTags: [],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 149,
      variants: variantsAsset,
    });
    const extra = courierFunnelExtra(quote);
    assert.equal(extra.outward, 'SW11');
    assert.equal(extra.band, 'B2');
    assert.equal(extra.tier, 'paid');
    assert.equal(extra.adjustment, 25);
    assert.equal(extra.charged, 25);
    assert.equal(extra.repair_price, 149);
    assert.equal(extra.total, 174);
    assert.equal(extra.service, 'courier');
    assertNoPii(extra);
  });

  it('B3 quote: adjustment 15 with charged 0 (intentional £0 variant)', () => {
    const quote = quoteServiceAdjustment({
      postcode: 'N6 4AA',
      productTags: ['courier:free'],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    const extra = courierFunnelExtra(quote);
    assert.equal(extra.outward, 'N6');
    assert.equal(extra.band, 'B3');
    assert.equal(extra.tier, 'free');
    assert.equal(extra.adjustment, 15);
    assert.equal(extra.charged, 0);
    assert.equal(extra.repair_price, 299);
    assert.equal(extra.total, 299);
    assert.equal(extra.service, 'courier');
    assertNoPii(extra);
  });

  it('B4 quote: adjustment 25 with charged 25', () => {
    const quote = quoteServiceAdjustment({
      postcode: 'W5 5RF',
      productTags: ['courier:free'],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    const extra = courierFunnelExtra(quote);
    assert.equal(extra.outward, 'W5');
    assert.equal(extra.band, 'B4');
    assert.equal(extra.tier, 'free');
    assert.equal(extra.adjustment, 25);
    assert.equal(extra.charged, 25);
    assert.equal(extra.repair_price, 299);
    assert.equal(extra.total, 324);
    assert.equal(extra.service, 'courier');
    assertNoPii(extra);
  });

  it('B1 free quote: adjustment 0 with charged 0', () => {
    const quote = quoteServiceAdjustment({
      postcode: 'W1B 4BD',
      productTags: ['courier:free'],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    const extra = courierFunnelExtra(quote);
    assert.equal(extra.outward, 'W1B');
    assert.equal(extra.band, 'B1');
    assert.equal(extra.tier, 'free');
    assert.equal(extra.adjustment, 0);
    assert.equal(extra.charged, 0);
    assert.equal(extra.repair_price, 299);
    assert.equal(extra.total, 299);
    assert.equal(extra.service, 'courier');
    assertNoPii(extra);
  });

  it('out of area: band null, mail-in service', () => {
    const quote = quoteServiceAdjustment({
      postcode: 'M1 1AE',
      productTags: ['courier:free'],
      bands: bandsAsset,
      service: 'courier',
      repairPrice: 299,
      variants: variantsAsset,
    });
    const extra = courierFunnelExtra(quote);
    assert.equal(extra.outward, 'M1');
    assert.equal(extra.band, null);
    assert.equal(extra.adjustment, 0);
    assert.equal(extra.charged, 0);
    assert.equal(extra.service, 'mail-in');
    assert.equal(quote.forcedMailIn, true);
    assertNoPii(extra);
  });

  it('strips postcode and PII keys from extra', () => {
    const extra = courierFunnelExtra(
      { outward: 'W1B', band: 'B1', tier: 'free', adjustment: 0, charged: 0, repair_price: 299, total: 299, service: 'courier' },
      {
        postcode: 'W1B 4BD',
        Postcode: 'W1B 4BD',
        full_postcode: 'W1B 4BD',
        postal_code: 'W1B 4BD',
        email: 'test@example.com',
        name: 'Test Customer',
        phone: '02070998517',
        address: '12 Margaret Street',
        collection_date: '2026-09-15',
        collection_window: 'AM',
      }
    );
    assert.equal(extra.outward, 'W1B');
    assert.equal(extra.charged, 0);
    assert.equal(extra.collection_date, '2026-09-15');
    assert.equal(extra.collection_window, 'AM');
    for (const piiKey of ['postcode', 'Postcode', 'full_postcode', 'postal_code', 'email', 'name', 'phone', 'address']) {
      assert.equal(Object.prototype.hasOwnProperty.call(extra, piiKey), false, 'leaked PII key: ' + piiKey);
    }
    assertNoPii(extra);
  });

  it('empty quote still serialises nulls without PII', () => {
    const extra = courierFunnelExtra(null, { service: 'courier', total: 0 });
    assert.equal(extra.outward, null);
    assert.equal(extra.band, null);
    assert.equal(extra.adjustment, null);
    assert.equal(extra.charged, null);
    assert.equal(extra.service, 'courier');
    assert.equal(extra.total, 0);
    assertNoPii(extra);
  });
});

describe('theme source: courier funnel events', () => {
  const wizard = [
    fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8'),
    fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8'),
  ].join('\n');
  const booker = fs.readFileSync(path.join(root, 'snippets/additional-repair.liquid'), 'utf8');

  it('quote-wizard fires all funnel events via trackWizardEvent*', () => {
    for (const name of WIZARD_EVENTS) {
      assert.match(wizard, new RegExp("'" + name + "'"), name + ' missing from quote-wizard');
    }
    assert.match(wizard, /trackWizardEventOnce\([\s\S]*?'wizard_postcode_entered'/);
    assert.match(wizard, /trackWizardEvent\('wizard_proceed'/);
    assert.match(wizard, /if \(!window\.posthog\) return/);
  });

  it('additional-repair still has live courier UI and the same events except slots', () => {
    assert.match(booker, /id="courier-postcode"/);
    for (const name of BOOKER_EVENTS) {
      assert.match(booker, new RegExp("'(?:" + name + ")'"), name + ' missing from additional-repair');
    }
    assert.doesNotMatch(booker, /wizard_slot_selected/);
    assert.match(booker, /if \(!window\.posthog \|\| typeof window\.posthog\.capture !== 'function'\) return/);
  });
});
