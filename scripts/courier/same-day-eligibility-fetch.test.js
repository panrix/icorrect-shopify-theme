/**
 * Task 6: live same-day eligibility fetch (fail closed).
 * Run: node --test scripts/courier/same-day-eligibility-fetch.test.js
 */
'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const liquid = fs.readFileSync(
  path.join(__dirname, '../../sections/quote-wizard.liquid'),
  'utf8'
);
const proxyDoc = fs.readFileSync(
  path.join(__dirname, '../same-day-proxy.md'),
  'utf8'
);

function extractFunction(src, name) {
  let start = src.indexOf('async function ' + name + '(');
  if (start === -1) start = src.indexOf('function ' + name + '(');
  assert.ok(start !== -1, 'missing function ' + name);
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('unclosed function ' + name);
}

describe('theme wiring: proxy URL + no workshop secret', () => {
  it('keeps quote-events on api.icorrect.co.uk and adds same_day_eligibility_url (blank default)', () => {
    assert.match(liquid, /var ENDPOINT = "https:\/\/api\.icorrect\.co\.uk\/api\/quote-events"/);
    assert.match(liquid, /var sameDayEligibilityUrl/);
    assert.match(liquid, /"id":\s*"same_day_eligibility_url"/);
    assert.match(
      liquid,
      /eligibilityUrl:\s*\{\{\s*section\.settings\.same_day_eligibility_url/
    );
    const schema = liquid.slice(liquid.indexOf('"id": "same_day_eligibility_url"'));
    assert.match(schema, /"default":\s*""/);
  });

  it('never embeds a workshop token or webhookAuth secret in Liquid/JS', () => {
    assert.doesNotMatch(liquid, /webhookAuth|WEBHOOK_TOKEN|parts_token|workshop.?secret/i);
    assert.doesNotMatch(liquid, /[?&]token=/);
  });

  it('fetches after postcode resolve and fail-closes the stub first', () => {
    assert.match(liquid, /function fetchSameDayEligibility\s*\(/);
    assert.match(liquid, /function refreshSameDayEligibility\s*\(/);
    const apply = extractFunction(liquid, 'applyCourierQuoteToUI');
    assert.match(apply, /refreshSameDayEligibility\s*\(/);
    assert.match(liquid, /AbortController/);
    assert.match(liquid, /1500/);
    assert.match(liquid, /credentials:\s*['"]omit['"]/);
  });

  it('documents a secret-bearing proxy on the quote-events origin, not a browser secret', () => {
    assert.match(proxyDoc, /api\.icorrect\.co\.uk/);
    assert.match(proxyDoc, /\/same-day\/eligibility/);
    assert.match(proxyDoc, /orders\/paid/);
    assert.match(proxyDoc, /SAME-DAY RESERVE FAILED/);
    assert.doesNotMatch(proxyDoc, /sk_live|whsec_|Bearer [A-Za-z0-9._-]{12,}/);
  });
});

describe('fetchSameDayEligibility', () => {
  const origFetch = global.fetch;
  const origAbort = global.AbortController;
  const origWindow = global.window;

  function loadFn() {
    const src = extractFunction(liquid, 'fetchSameDayEligibility');
    return new Function('return (' + src + ')')();
  }

  beforeEach(() => {
    global.window = {
      __sameDayConfig: { eligibilityUrl: 'https://api.icorrect.co.uk/same-day/eligibility' }
    };
  });

  afterEach(() => {
    global.fetch = origFetch;
    global.AbortController = origAbort;
    global.window = origWindow;
  });

  it('maps Task 5 JSON to inStock / slotsRemaining / eligible', async () => {
    const calls = [];
    global.fetch = async (url, opts) => {
      calls.push({ url, opts });
      return {
        ok: true,
        json: async () => ({ in_stock: true, slots_remaining: 3, eligible: true })
      };
    };
    const fetchSameDayEligibility = loadFn();
    const result = await fetchSameDayEligibility('iphone-15-screen', '2026-09-14', 'W1');
    assert.deepEqual(result, { inStock: true, slotsRemaining: 3, eligible: true });
    assert.equal(
      calls[0].url,
      'https://api.icorrect.co.uk/same-day/eligibility?handle=iphone-15-screen&date=2026-09-14&outward=W1'
    );
    assert.equal(calls[0].opts.credentials, 'omit');
    assert.ok(calls[0].opts.signal);
  });

  it('returns inStock false on HTTP error, timeout/abort, and blank URL', async () => {
    const fetchSameDayEligibility = loadFn();

    global.fetch = async () => ({ ok: false, json: async () => ({ in_stock: true }) });
    assert.deepEqual(await fetchSameDayEligibility('iphone', '2026-09-14', 'W1'), {
      inStock: false,
      slotsRemaining: 0
    });

    global.fetch = async (_url, opts) => {
      return new Promise((_, reject) => {
        opts.signal.addEventListener('abort', () => {
          const err = new Error('aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    };
    const origSetTimeout = global.setTimeout;
    global.setTimeout = (fn) => origSetTimeout(fn, 0);
    try {
      const timedOut = await fetchSameDayEligibility('iphone', '2026-09-14', 'SW11');
      assert.deepEqual(timedOut, { inStock: false, slotsRemaining: 0 });
    } finally {
      global.setTimeout = origSetTimeout;
    }

    global.window.__sameDayConfig.eligibilityUrl = '';
    global.fetch = async () => {
      throw new Error('must not fetch when url is blank');
    };
    assert.deepEqual(await fetchSameDayEligibility('iphone', '2026-09-14', 'W1'), {
      inStock: false,
      slotsRemaining: 0
    });
  });
});
