/**
 * Quote-events proceed capture must not use sendBeacon (credentialed CORS
 * preflight is rejected by api.icorrect.co.uk, so the POST never arrives).
 * Run: node --test scripts/courier/quote-events-proceed.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const liquid = fs.readFileSync(path.join(__dirname, '../../sections/quote-wizard.liquid'), 'utf8');

function fnBody(name) {
  const start = liquid.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name + ' missing');
  const next = liquid.indexOf('\n  function ', start + 10);
  return liquid.slice(start, next > start ? next : undefined);
}

describe('quote-events proceed capture', () => {
  const body = fnBody('captureQuoteProceeded');

  it('does not call navigator.sendBeacon', () => {
    assert.doesNotMatch(body, /navigator\.sendBeacon\s*\(/);
  });

  it('posts JSON with fetch keepalive and no credentials', () => {
    assert.match(body, /fetch\(ENDPOINT/);
    assert.match(body, /keepalive:\s*true/);
    assert.match(body, /credentials:\s*"omit"/);
    assert.match(body, /proceeded:\s*true/);
  });
});
