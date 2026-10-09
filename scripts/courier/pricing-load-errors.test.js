/**
 * Quote wizard pricing load failures are visible (#120).
 * Run: node --test scripts/courier/pricing-load-errors.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const wizard = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
const liquid = fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8');
const lib = require(path.join(root, 'assets/courier-pricing.js'));

function between(startNeedle, endNeedle) {
  const start = wizard.indexOf(startNeedle);
  assert.ok(start >= 0, 'missing ' + startNeedle);
  const end = wizard.indexOf(endNeedle, start + startNeedle.length);
  assert.ok(end > start, 'missing ' + endNeedle);
  return wizard.slice(start, end);
}

function loadHelpers(env) {
  let src = between('  var PRICING_FETCH_TIMEOUT_MS', '  function currentRepairTags()');
  src = src
    .replace('PRICING_FETCH_TIMEOUT_MS = 4000', 'PRICING_FETCH_TIMEOUT_MS = ' + (env.timeoutMs || 30))
    .replace('PRICING_FETCH_RETRY_DELAY_MS = 400', 'PRICING_FETCH_RETRY_DELAY_MS = 1');
  const events = [];
  const window = Object.assign({ location: { pathname: '/pages/quote' } }, env.window || {});
  if (env.posthog !== false) {
    window.posthog = {
      capture(name, props) { events.push({ name, props }); },
    };
  }
  const CFG = Object.assign({
    bandsUrl: '/bands.json',
    catalogueUrl: '/catalogue.json',
    serviceAdjustmentsUrl: '/variants.json',
    collectionPrefillUrl: '/prefill.json',
    serviceAdjustments: { 15: 1, 20: 2, 25: 3 },
    serviceAdjustmentPrices: { 15: 0, 20: 0, 25: 25 },
  }, env.CFG || {});
  const api = new Function(
    'window', 'fetch', 'CFG', 'console', 'AbortController', 'setTimeout', 'clearTimeout',
    src + '\nreturn { ensureCourierAssets, fetchPricingJson, trackPricingLoadFailed, ensureServiceShelfPrices, pricingLoadErrorHtml };'
  )(window, env.fetch, CFG, { warn() {} }, AbortController, setTimeout, clearTimeout);
  return { api, events, window, CFG };
}

function jsonRes(body, status) {
  return { ok: (status || 200) < 400, status: status || 200, json: () => Promise.resolve(body) };
}

function hangingFetch(url, opts) {
  return new Promise((resolve, reject) => {
    if (opts && opts.signal) {
      opts.signal.addEventListener('abort', () => {
        const e = new Error('aborted');
        e.name = 'AbortError';
        reject(e);
      });
    }
  });
}

describe('fetchPricingJson', () => {
  it('retries a failed response once and then succeeds with no event', async () => {
    let calls = 0;
    const { api, events } = loadHelpers({
      fetch: () => {
        calls += 1;
        return Promise.resolve(calls === 1 ? jsonRes(null, 503) : jsonRes({ ok: 1 }));
      },
    });
    const out = await api.fetchPricingJson('courier-london-bands.json', '/b.json');
    assert.deepEqual(out, { ok: 1 });
    assert.equal(calls, 2);
    assert.equal(events.length, 0);
  });

  it('stops after one retry on HTTP errors and reports the brief properties', async () => {
    let calls = 0;
    const { api, events } = loadHelpers({
      fetch: () => { calls += 1; return Promise.resolve(jsonRes(null, 404)); },
    });
    await assert.rejects(api.fetchPricingJson('courier-london-bands.json', '/b.json'), (err) => {
      assert.equal(err.failureType, 'http');
      assert.equal(err.status, 404);
      assert.equal(err.attempt, 2);
      return true;
    });
    assert.equal(calls, 2);
    assert.equal(events.length, 1);
    const props = events[0].props;
    assert.equal(events[0].name, 'quote_wizard_pricing_load_failed');
    assert.equal(props.asset, 'courier-london-bands.json');
    assert.equal(props.status, 404);
    assert.equal(props.attempt, 2);
    assert.equal(typeof props.duration_ms, 'number');
    assert.equal(props.page, '/pages/quote');
    assert.equal(props.url, '/pages/quote');
    assert.equal(props.reason, 'http');
  });

  it('aborts a hung fetch at the timeout', async () => {
    let calls = 0;
    const { api, events } = loadHelpers({
      timeoutMs: 20,
      fetch: (url, opts) => { calls += 1; return hangingFetch(url, opts); },
    });
    await assert.rejects(
      api.fetchPricingJson('service-adjustment.js', '/products/service-adjustment.js'),
      (err) => err.failureType === 'timeout'
    );
    assert.equal(calls, 2);
    assert.equal(events[0].props.reason, 'timeout');
    assert.equal(events[0].props.asset, 'service-adjustment.js');
  });

  it('is a no-op when PostHog is absent', async () => {
    const { api, events } = loadHelpers({
      posthog: false,
      fetch: () => Promise.resolve(jsonRes(null, 500)),
    });
    await assert.rejects(api.fetchPricingJson('courier-london-bands.json', '/b'));
    assert.equal(events.length, 0);
    assert.doesNotThrow(() => api.trackPricingLoadFailed({ asset: 'x', reason: 'http' }));
  });
});

describe('ensureCourierAssets', () => {
  it('rejects when bands fail so the lookup can show an error', async () => {
    const { api, events } = loadHelpers({
      fetch: (url) => Promise.resolve(url === '/bands.json' ? jsonRes(null, 500) : jsonRes({ variants: { 15: 1 } })),
    });
    await assert.rejects(api.ensureCourierAssets());
    assert.ok(events.some((e) => e.props.asset === 'courier-london-bands.json'));
  });

  it('does not reject when only the shelf price fails, and keeps the Liquid prices', async () => {
    const { api, events, window, CFG } = loadHelpers({
      window: { ICorrectCourier: lib },
      fetch: (url) => {
        if (url === '/products/service-adjustment.js') return Promise.resolve(jsonRes(null, 500));
        if (url === '/variants.json') return Promise.resolve(jsonRes({ variants: { 15: 1, 20: 2, 25: 3 } }));
        return Promise.resolve(jsonRes({ ok: true }));
      },
    });
    await api.ensureCourierAssets();
    assert.ok(window.__QW_BANDS);
    assert.deepEqual(window.__QW_SERVICE_ADJUSTMENTS.prices, CFG.serviceAdjustmentPrices);
    await new Promise((r) => setTimeout(r, 30));
    assert.ok(events.some((e) => e.props.asset === 'service-adjustment.js' && e.props.status === 500));
  });

  it('applies live shelf prices onto the variant map', async () => {
    const { api, window } = loadHelpers({
      window: { ICorrectCourier: lib },
      fetch: (url) => {
        if (url === '/products/service-adjustment.js') {
          return Promise.resolve(jsonRes({
            variants: [{ id: 1, price: 0 }, { id: 2, price: 0 }, { id: 3, price: 2500 }],
          }));
        }
        if (url === '/variants.json') return Promise.resolve(jsonRes({ variants: { 15: 1, 20: 2, 25: 3 } }));
        return Promise.resolve(jsonRes({ ok: true }));
      },
    });
    await api.ensureCourierAssets();
    await api.ensureServiceShelfPrices();
    assert.equal(window.__QW_SERVICE_ADJUSTMENTS.prices['25'], 25);
    assert.equal(window.__QW_SERVICE_ADJUSTMENTS.prices['20'], 0);
    assert.equal(window.__QW_SERVICE_ADJUSTMENTS.prices['15'], 0);
  });

  it('shares one in-flight request per asset', async () => {
    const seen = {};
    const { api } = loadHelpers({
      fetch: (url) => {
        seen[url] = (seen[url] || 0) + 1;
        return new Promise((r) => setTimeout(() => r(jsonRes({ variants: {} })), 5));
      },
    });
    await Promise.all([api.ensureCourierAssets(), api.ensureCourierAssets(), api.ensureCourierAssets()]);
    assert.equal(seen['/bands.json'], 1);
    assert.equal(seen['/catalogue.json'], 1);
  });
});

describe('customer-facing copy and caps', () => {
  it('runLookup catches a failed load instead of retrying forever', () => {
    assert.doesNotMatch(wizard, /ensureCourierAssets\(\)\.then\(function \(\) \{ runLookup\(settled\); \}\)/);
    assert.match(wizard, /function waitForCourierPricing/);
    assert.match(wizard, /_courierWaits >= COURIER_PRICING_MAX_WAITS/);
    assert.match(wizard, /showPricingLoadError\(\)/);
    assert.equal(wizard.includes("We couldn\\'t load prices."), true);
    assert.match(wizard, /id="qwPricingRetry"/);
    assert.match(wizard, /href="\/pages\/contact"/);
    assert.match(wizard, /role="alert"/);
  });

  it('caps the courier-pricing.js wait at about 10 seconds', () => {
    assert.match(wizard, /var COURIER_PRICING_MAX_WAITS = 20;/);
    assert.match(wizard, /var COURIER_PRICING_WAIT_MS = 500;/);
  });

  it('fires the same event for free mail-in fallback and cart-add errors', () => {
    assert.match(wizard, /reason: 'fallback_free_mail_in'/);
    assert.match(wizard, /reason: 'cart_add'/);
    assert.match(wizard, /quote_wizard_pricing_load_failed/);
  });

  it('shows the catalogue failure on the contact card and keeps the form', () => {
    assert.match(wizard, /pricingFailed: !window\.__QW_CATALOGUE/);
    assert.match(wizard, /buildContactFormHTML\('qwCFD'/);
  });

  it('drops the stale mail-in-service £20 comment', () => {
    assert.doesNotMatch(wizard, /Shopify £20/);
    assert.doesNotMatch(fs.readFileSync(path.join(root, 'snippets/additional-repair.liquid'), 'utf8'), /Shopify £20/);
  });

  it('error html names the retry and does not include a book control', () => {
    const { api } = loadHelpers({ fetch: () => Promise.resolve(jsonRes({})) });
    const html = api.pricingLoadErrorHtml();
    assert.match(html, /We couldn't load prices/);
    assert.match(html, /qwPricingRetry/);
    assert.match(html, /\/pages\/contact/);
    assert.doesNotMatch(html, /qwBookBtn|Proceed to checkout/);
  });
});

describe('service adjustment prices come from the Shopify product', () => {
  it('Liquid reads service-adjustment variant prices and does not hard-type 0/0/25', () => {
    const block = liquid.slice(liquid.indexOf('serviceAdjustmentPrices'), liquid.indexOf('mailIn:'));
    assert.match(liquid, /all_products\['service-adjustment'\]/);
    assert.match(liquid, /v\.price \| divided_by: 100\.0/);
    assert.match(block, /qw_price_15/);
    assert.doesNotMatch(block, /"15": 0/);
  });

  it('the theme JSON no longer carries a hand-typed price map', () => {
    const asset = JSON.parse(fs.readFileSync(path.join(root, 'assets/service-adjustment-variants.json'), 'utf8'));
    assert.equal(asset.prices, undefined);
    assert.deepEqual(Object.keys(asset.variants).sort(), ['15', '20', '25']);
  });

  it('keeps the checkout variant ids', () => {
    assert.match(liquid, /"25": 71280436445437/);
    assert.match(wizard, /adjustment > 0/);
    assert.doesNotMatch(
      between('function buildCartItems()', 'function orderSummaryText('),
      /CFG\.mailIn\.variantId/
    );
  });
});
