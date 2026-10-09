/**
 * Pricing endpoint checker. No network.
 * Run: node --test scripts/monitor/check-pricing-endpoints.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const checker = require('./check-pricing-endpoints.js');

const HTML = [
  '<script src="https://www.icorrect.co.uk/cdn/shop/t/1/assets/courier-pricing.js?v=1" defer></script>',
  '<script>',
  'window.WIZARD_CFG = {',
  '  bandsUrl: "https://www.icorrect.co.uk/cdn/shop/t/1/assets/courier-london-bands.json?v=1\\u0026a=1",',
  '  catalogueUrl: "https://cdn.shopify.com/s/files/1/catalogue.json?v=2",',
  '  serviceAdjustmentsUrl: "https://www.icorrect.co.uk/cdn/shop/t/1/assets/service-adjustment-variants.json?v=3",',
  '};',
  '</script>',
].join('\n');

function catalogue(repairs) {
  const models = {};
  for (let i = 0; i < 50; i++) {
    models['iphone::m' + i] = {
      device: 'iphone',
      name: 'M' + i,
      repairs: {
        screen: { handle: 'iphone-m' + i + '-screen', variantId: 1000 + i, price: 179, title: 'Screen' },
      },
    };
  }
  return { model_count: 50, repair_count: repairs, models };
}

function bands() {
  const outward = {};
  for (let i = 0; i < 20; i++) outward['W' + i] = { band: 'B1' };
  return { fallback: 'mail-in', outward };
}

function shelf(prices) {
  return {
    variants: [
      { id: checker.VARIANT_IDS[15], price: prices[0] },
      { id: checker.VARIANT_IDS[20], price: prices[1] },
      { id: checker.VARIANT_IDS[25], price: prices[2] },
    ],
  };
}

describe('parse and validate', () => {
  it('reads the wizard asset urls from page HTML', () => {
    const cfg = checker.parseWizardConfig(HTML);
    assert.equal(cfg.bandsUrl, 'https://www.icorrect.co.uk/cdn/shop/t/1/assets/courier-london-bands.json?v=1&a=1');
    assert.match(cfg.catalogueUrl, /catalogue\.json/);
    assert.match(cfg.serviceAdjustmentsUrl, /service-adjustment-variants\.json/);
    assert.match(cfg.courierPricingSrc, /courier-pricing\.js/);
  });

  it('accepts a real-sized catalogue and rejects a tiny one', () => {
    const ok = checker.validateCatalogue(catalogue(100));
    assert.equal(ok.ok, true);
    assert.equal(ok.sampleHandle, 'iphone-m0-screen');
    const tiny = checker.validateCatalogue({ repair_count: 1, models: { a: { repairs: {} } } });
    assert.equal(tiny.ok, false);
  });

  it('requires an outward band map', () => {
    assert.equal(checker.validateBands(bands()).ok, true);
    assert.equal(checker.validateBands({ outward: { W1: { band: 'B1' } } }).ok, false);
  });

  it('compares service-adjustment.js cents with the pound prices', () => {
    const ok = checker.validateServiceProduct(shelf([0, 0, 2500]), { 15: 0, 20: 0, 25: 25 });
    assert.equal(ok.ok, true);
    const bad = checker.validateServiceProduct(shelf([1500, 0, 2500]), { 15: 0, 20: 0, 25: 25 });
    assert.equal(bad.ok, false);
    assert.match(bad.detail, /71280436379901/);
  });

  it('checks the theme variant ids', () => {
    assert.equal(checker.validateVariantMap({
      variants: { 15: checker.VARIANT_IDS[15], 20: checker.VARIANT_IDS[20], 25: checker.VARIANT_IDS[25] },
    }).ok, true);
    assert.equal(checker.validateVariantMap({ variants: { 15: 1, 20: 2, 25: 3 } }).ok, false);
  });
});

describe('checkPricingEndpoints', () => {
  function routes(extra) {
    return async (url) => {
      const href = String(url);
      if (extra && extra[href]) return extra[href]();
      if (href.endsWith('/')) return { ok: true, status: 200, text: async () => HTML };
      if (href.includes('courier-london-bands')) return { ok: true, status: 200, text: async () => JSON.stringify(bands()) };
      if (href.includes('catalogue.json')) return { ok: true, status: 200, text: async () => JSON.stringify(catalogue(120)) };
      if (href.includes('service-adjustment-variants')) {
        return { ok: true, status: 200, text: async () => JSON.stringify({ variants: { 15: checker.VARIANT_IDS[15], 20: checker.VARIANT_IDS[20], 25: checker.VARIANT_IDS[25] } }) };
      }
      if (href.includes('courier-pricing.js')) return { ok: true, status: 200, text: async () => 'function ICorrectCourier(){}' };
      if (href.includes('/products/service-adjustment.js')) return { ok: true, status: 200, text: async () => JSON.stringify(shelf([0, 0, 2500])) };
      if (href.includes('/products/iphone-m0-screen.js')) return { ok: true, status: 200, text: async () => JSON.stringify({ variants: [{ id: 55, price: 17900 }] }) };
      return { ok: false, status: 404, text: async () => 'missing ' + href };
    };
  }

  it('passes when every live read matches', async () => {
    const posts = [];
    const result = await checker.checkPricingEndpoints({
      fetch: routes(),
      storeUrl: 'https://www.icorrect.co.uk',
      pagePath: '/',
      timeoutMs: 50,
    });
    assert.equal(result.ok, true);
    assert.equal(result.checks.length, 7);
    const note = await checker.maybeNotify({ fetch: async (url) => { posts.push(url); }, webhookUrl: '' }, result);
    assert.equal(note.posted, false);
    assert.equal(posts.length, 0);
  });

  it('fails the catalogue check and can post that failure without a postcode', async () => {
    const posts = [];
    const result = await checker.checkPricingEndpoints({
      fetch: routes({
        'https://cdn.shopify.com/s/files/1/catalogue.json?v=2': async () => ({ ok: false, status: 500, text: async () => 'nope' }),
      }),
      storeUrl: 'https://www.icorrect.co.uk',
      pagePath: '/',
      timeoutMs: 50,
    });
    assert.equal(result.ok, false);
    const catalogue = result.checks.find((check) => check.name === 'catalogue_map');
    assert.equal(catalogue.ok, false);
    assert.match(catalogue.detail, /HTTP 500/);
    const note = await checker.maybeNotify({
      fetch: async (url, init) => { posts.push({ url, body: init.body }); return { ok: true }; },
      webhookUrl: 'https://hooks.example.test/abc',
    }, result);
    assert.equal(note.posted, true);
    assert.equal(note.kind, 'failure');
    assert.equal(posts.length, 1);
    assert.equal(posts[0].body.includes('SW1A'), false);
    assert.equal(posts[0].body.includes('postcode'), false);
    assert.match(posts[0].body, /catalogue_map/);
  });
});
