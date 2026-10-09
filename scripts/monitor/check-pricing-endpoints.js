#!/usr/bin/env node
/**
 * Read-only check of the live quote-wizard pricing assets.
 * GETs only. No Shopify Admin. No theme write.
 *
 *   node scripts/monitor/check-pricing-endpoints.js
 *   node scripts/monitor/check-pricing-endpoints.js --json
 *
 * Env: STORE_URL (default https://www.icorrect.co.uk), WIZARD_PAGE (default /),
 * EXPECT_ADJUSTMENT_PRICES (default 0,0,25 for keys 15,20,25),
 * CHECK_TIMEOUT_MS (default 8000), SLACK_WEBHOOK_URL (off unless set; failure only),
 * CHECK_STATE_FILE (optional; enables a recovery post). See README.md.
 */
'use strict';

const fs = require('node:fs');

const VARIANT_IDS = {
  15: 71280436379901,
  20: 71280436412669,
  25: 71280436445437,
};

function parseExpectedPrices(raw) {
  const parts = String(raw == null || raw === '' ? '0,0,25' : raw).split(',').map((n) => Number(n.trim()));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error('EXPECT_ADJUSTMENT_PRICES must be three numbers, e.g. 0,0,25');
  }
  return { 15: parts[0], 20: parts[1], 25: parts[2] };
}

function parseWizardConfig(html) {
  const source = String(html || '');
  function field(key) {
    const re = new RegExp(key + '\\s*:\\s*("(?:\\\\.|[^"\\\\])*")');
    const match = source.match(re);
    if (!match) return null;
    try { return JSON.parse(match[1]); } catch (e) { return null; }
  }
  const script = source.match(/<script[^>]*\ssrc="([^"]*courier-pricing\.js[^"]*)"/i);
  let courierPricingSrc = null;
  if (script) {
    courierPricingSrc = script[1].replace(/&amp;/g, '&');
  }
  return {
    bandsUrl: field('bandsUrl'),
    catalogueUrl: field('catalogueUrl'),
    serviceAdjustmentsUrl: field('serviceAdjustmentsUrl'),
    courierPricingSrc,
  };
}

function validateBands(data) {
  if (!data || typeof data.outward !== 'object' || data.outward == null) {
    return { ok: false, detail: 'bands JSON has no outward map' };
  }
  const count = Object.keys(data.outward).length;
  if (count < 20) return { ok: false, detail: 'bands outward count ' + count };
  return { ok: true, detail: count + ' outward codes' };
}

function validateCatalogue(data) {
  if (!data || typeof data.models !== 'object' || data.models == null) {
    return { ok: false, detail: 'catalogue JSON has no models' };
  }
  const models = Object.keys(data.models);
  let repairs = Number(data.repair_count);
  let sampleHandle = null;
  if (!Number.isFinite(repairs)) repairs = 0;
  models.forEach((key) => {
    const rows = (data.models[key] && data.models[key].repairs) || {};
    Object.keys(rows).forEach((type) => {
      if (!Number.isFinite(Number(data.repair_count))) repairs += 1;
      const row = rows[type];
      if (!sampleHandle && row && row.handle && row.variantId) sampleHandle = String(row.handle);
    });
  });
  if (models.length < 50) return { ok: false, detail: 'catalogue models ' + models.length };
  if (repairs < 100) return { ok: false, detail: 'catalogue repairs ' + repairs };
  if (!sampleHandle) return { ok: false, detail: 'catalogue has no repair handle' };
  return { ok: true, detail: models.length + ' models, ' + repairs + ' repairs', sampleHandle };
}

function validateVariantMap(data) {
  const variants = data && data.variants;
  if (!variants || typeof variants !== 'object') return { ok: false, detail: 'variant map missing' };
  for (const key of [15, 20, 25]) {
    if (Number(variants[String(key)]) !== VARIANT_IDS[key]) {
      return { ok: false, detail: 'variant key ' + key + ' id ' + variants[String(key)] };
    }
  }
  return { ok: true, detail: 'variant ids 15/20/25 match' };
}

function validateServiceProduct(product, expectedPounds) {
  if (!product || !Array.isArray(product.variants)) {
    return { ok: false, detail: 'service-adjustment.js has no variants' };
  }
  const poundsById = {};
  product.variants.forEach((variant) => {
    if (!variant || variant.id == null) return;
    const cents = Number(variant.price);
    if (!Number.isFinite(cents)) return;
    poundsById[String(variant.id)] = cents / 100;
  });
  const expected = expectedPounds || { 15: 0, 20: 0, 25: 25 };
  for (const key of [15, 20, 25]) {
    const id = String(VARIANT_IDS[key]);
    if (!Object.prototype.hasOwnProperty.call(poundsById, id)) {
      return { ok: false, detail: 'missing variant ' + id };
    }
    const got = poundsById[id];
    if (Math.abs(got - expected[key]) > 0.001) {
      return { ok: false, detail: 'variant ' + id + ' is £' + got + ', expected £' + expected[key] };
    }
  }
  return {
    ok: true,
    detail: 'prices £' + expected[15] + '/' + expected[20] + '/' + expected[25],
  };
}

function validateRepairProduct(product) {
  if (!product || !Array.isArray(product.variants) || !product.variants.length) {
    return { ok: false, detail: 'sample repair has no variant' };
  }
  if (product.variants[0].id == null) return { ok: false, detail: 'sample repair variant has no id' };
  return { ok: true, detail: 'variant ' + product.variants[0].id };
}

function absoluteUrl(storeUrl, value) {
  if (!value || typeof value !== 'string') return null;
  try { return new URL(value, storeUrl).href; } catch (e) { return null; }
}

function line(check) {
  return (check.ok ? 'OK  ' : 'FAIL') + '  ' + check.name + '  ' + check.detail;
}

function slackText(result) {
  const head = result.ok ? 'pricing check recovered' : 'pricing check failed';
  const rows = result.checks.map(line).join('\n');
  return head + '\n' + rows;
}

async function fetchText(fetchImpl, url, timeoutMs) {
  const res = await fetchImpl(url, {
    method: 'GET',
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: '*/*', 'User-Agent': 'icorrect-pricing-check' },
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, text };
}

async function checkPricingEndpoints(options) {
  const fetchImpl = options.fetch;
  const storeUrl = String(options.storeUrl || 'https://www.icorrect.co.uk').replace(/\/$/, '');
  const pagePath = options.pagePath || '/';
  const timeoutMs = options.timeoutMs || 8000;
  const expectedPrices = options.expectedPrices || { 15: 0, 20: 0, 25: 25 };
  const checks = [];
  function add(name, result) {
    checks.push({ name, ok: !!result.ok, detail: result.detail });
    return result;
  }
  async function getJson(name, url) {
    const target = absoluteUrl(storeUrl, url);
    if (!target) return add(name, { ok: false, detail: 'missing url' });
    try {
      const res = await fetchText(fetchImpl, target, timeoutMs);
      if (!res.ok) return add(name, { ok: false, detail: 'HTTP ' + res.status });
      try {
        return { response: add(name, { ok: true, detail: 'HTTP ' + res.status }), json: JSON.parse(res.text), text: res.text };
      } catch (e) {
        checks[checks.length - 1].ok = false;
        checks[checks.length - 1].detail = 'JSON parse failed';
        return null;
      }
    } catch (err) {
      const timeout = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
      return add(name, { ok: false, detail: timeout ? 'timeout' : 'network' });
    }
  }

  let cfg = null;
  try {
    const page = await fetchText(fetchImpl, absoluteUrl(storeUrl, pagePath), timeoutMs);
    if (!page.ok) add('wizard_page', { ok: false, detail: 'HTTP ' + page.status });
    else {
      cfg = parseWizardConfig(page.text);
      const ready = cfg.bandsUrl && cfg.catalogueUrl && cfg.serviceAdjustmentsUrl && cfg.courierPricingSrc;
      add('wizard_page', ready
        ? { ok: true, detail: 'WIZARD_CFG asset urls found' }
        : { ok: false, detail: 'WIZARD_CFG asset urls missing' });
    }
  } catch (err) {
    const timeout = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
    add('wizard_page', { ok: false, detail: timeout ? 'timeout' : 'network' });
  }

  const bands = cfg && await getJson('courier_bands', cfg.bandsUrl);
  if (bands && bands.json) {
    const verdict = validateBands(bands.json);
    checks[checks.length - 1].ok = verdict.ok;
    checks[checks.length - 1].detail = verdict.detail;
  }

  const catalogue = cfg && await getJson('catalogue_map', cfg.catalogueUrl);
  let sampleHandle = null;
  if (catalogue && catalogue.json) {
    const verdict = validateCatalogue(catalogue.json);
    checks[checks.length - 1].ok = verdict.ok;
    checks[checks.length - 1].detail = verdict.detail;
    sampleHandle = verdict.sampleHandle || null;
  }

  const variants = cfg && await getJson('service_adjustment_variants', cfg.serviceAdjustmentsUrl);
  if (variants && variants.json) {
    const verdict = validateVariantMap(variants.json);
    checks[checks.length - 1].ok = verdict.ok;
    checks[checks.length - 1].detail = verdict.detail;
  }

  if (cfg && cfg.courierPricingSrc) {
    try {
      const script = await fetchText(fetchImpl, absoluteUrl(storeUrl, cfg.courierPricingSrc), timeoutMs);
      const looksLikeJs = script.ok && /ICorrectCourier|function/.test(script.text);
      add('courier_pricing_script', looksLikeJs
        ? { ok: true, detail: 'HTTP ' + script.status }
        : { ok: false, detail: script.ok ? 'body is not the courier script' : 'HTTP ' + script.status });
    } catch (err) {
      const timeout = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
      add('courier_pricing_script', { ok: false, detail: timeout ? 'timeout' : 'network' });
    }
  } else if (cfg) add('courier_pricing_script', { ok: false, detail: 'missing url' });

  const shelf = await getJson('service_adjustment_product', storeUrl + '/products/service-adjustment.js');
  if (shelf && shelf.json) {
    const verdict = validateServiceProduct(shelf.json, expectedPrices);
    checks[checks.length - 1].ok = verdict.ok;
    checks[checks.length - 1].detail = verdict.detail;
  }

  if (sampleHandle) {
    const sample = await getJson('sample_repair_product', storeUrl + '/products/' + sampleHandle + '.js');
    if (sample && sample.json) {
      const verdict = validateRepairProduct(sample.json);
      checks[checks.length - 1].ok = verdict.ok;
      checks[checks.length - 1].detail = sampleHandle + ' ' + verdict.detail;
    }
  } else {
    add('sample_repair_product', { ok: false, detail: 'no catalogue handle to sample' });
  }

  return { ok: checks.every((check) => check.ok), checks };
}

function loadState(file) {
  if (!file) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; }
}

function saveState(file, state) {
  if (!file) return;
  fs.writeFileSync(file, JSON.stringify(state));
}

async function maybeNotify(options, result) {
  const webhook = options.webhookUrl || '';
  if (!webhook || typeof options.fetch !== 'function') return { posted: false };
  const previous = options.previousOk != null ? { ok: options.previousOk } : loadState(options.stateFile);
  const recovered = !!(result.ok && previous && previous.ok === false);
  if (result.ok && !recovered) return { posted: false };
  const text = slackText(Object.assign({ ok: result.ok && recovered ? true : result.ok }, { checks: result.checks }));
  if (recovered) {
    await options.fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'pricing check recovered\n' + result.checks.map(line).join('\n') }),
    });
    return { posted: true, kind: 'recovery' };
  }
  await options.fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return { posted: true, kind: 'failure' };
}

async function main() {
  const storeUrl = process.env.STORE_URL || 'https://www.icorrect.co.uk';
  const result = await checkPricingEndpoints({
    fetch: globalThis.fetch,
    storeUrl,
    pagePath: process.env.WIZARD_PAGE || '/',
    timeoutMs: Number(process.env.CHECK_TIMEOUT_MS || 8000),
    expectedPrices: parseExpectedPrices(process.env.EXPECT_ADJUSTMENT_PRICES),
  });
  const webhook = process.env.SLACK_WEBHOOK_URL || '';
  const stateFile = process.env.CHECK_STATE_FILE || '';
  const previous = loadState(stateFile);
  if (webhook) {
    await maybeNotify({
      fetch: globalThis.fetch,
      webhookUrl: webhook,
      stateFile: '',
      previousOk: previous ? previous.ok : null,
    }, result);
  }
  if (stateFile) saveState(stateFile, { ok: result.ok });
  if (process.argv.includes('--json')) console.log(JSON.stringify(result));
  else result.checks.forEach((check) => console.log(line(check)));
  if (!result.ok) {
    console.error('pricing check failed');
    process.exitCode = 1;
  }
}

module.exports = {
  VARIANT_IDS,
  parseExpectedPrices,
  parseWizardConfig,
  validateBands,
  validateCatalogue,
  validateVariantMap,
  validateServiceProduct,
  validateRepairProduct,
  checkPricingEndpoints,
  slackText,
  maybeNotify,
  line,
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err && err.message ? err.message : err);
    process.exitCode = 1;
  });
}
