/**
 * Quote wizard: no courier / mail-in result and no funnel events until a
 * complete UK postcode is entered (Ricky 2026-10-06).
 * Run: node --test scripts/courier/postcode-full-required.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const wizard = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
const lib = require(path.join(root, 'assets/courier-pricing.js'));
const bands = JSON.parse(fs.readFileSync(path.join(root, 'assets/courier-london-bands.json'), 'utf8'));

function sliceFn(name) {
  const start = wizard.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name + ' missing');
  const next = wizard.indexOf('\n  function ', start + 10);
  return wizard.slice(start, next);
}

function loadGate(withLib) {
  const src = sliceFn('isFullPostcodeValue');
  // eslint-disable-next-line no-new-func
  return new Function('window', src + '\nreturn isFullPostcodeValue;')(withLib ? { ICorrectCourier: lib } : {});
}

/* Mirrors runLookup: returns what the customer would see for a typed value. */
function lookupOutcome(gate, value) {
  const pc = String(value || '').trim();
  if (!pc) return 'nothing';
  if (!gate(pc)) return 'nothing';
  const quote = lib.quoteServiceAdjustment({ postcode: pc, bands, service: 'courier', repairPrice: 399, productTags: ['courier:free'] });
  return quote.service;
}

describe('runLookup gate (library and inline fallback)', () => {
  for (const withLib of [true, false]) {
    const gate = loadGate(withLib);
    const label = withLib ? 'library' : 'fallback';
    for (const partial of ['W1W', 'W1W 8', 'W1W 8J', 'W1W8J']) {
      it(`${label}: "${partial}" shows no courier or mail-in result`, () => {
        assert.equal(gate(partial), false);
        assert.equal(lookupOutcome(gate, partial), 'nothing');
      });
    }
    for (const full of ['W1W 8JQ', 'W1W8JQ']) {
      it(`${label}: "${full}" resolves to courier`, () => {
        assert.equal(gate(full), true);
        assert.equal(lookupOutcome(gate, full), 'courier');
      });
    }
  }
});

describe('quote-wizard wiring', () => {
  const runLookupSrc = wizard.slice(wizard.indexOf('function runLookup('), wizard.indexOf("input.addEventListener('input'"));

  it('runLookup checks for a full postcode before any quote', () => {
    const gateAt = runLookupSrc.indexOf('isFullPostcodeValue(pc)');
    const quoteAt = runLookupSrc.indexOf("quoteForService('courier'");
    assert.ok(gateAt > 0 && quoteAt > gateAt);
    assert.doesNotMatch(runLookupSrc, /compact\.length < 5/);
  });

  it('funnel events need a full postcode', () => {
    assert.match(sliceFn('trackCourierQuoteEvents'), /isFullPostcodeValue\(currentPostcodeValue\(\)\)/);
  });

  it('blur and Enter resolve, with a short debounce while typing', () => {
    assert.match(wizard, /addEventListener\('blur', function\(\)\{ clearTimeout\(timer\); runLookup\(true\); \}\)/);
    assert.match(wizard, /e\.key === 'Enter'/);
    assert.match(wizard, /setTimeout\(function \(\) \{ runLookup\(false\); \}, 220\)/);
  });

  it('checkout refuses a partial postcode', () => {
    assert.match(wizard, /Enter your full postcode, for example W1W 8JQ\./);
  });
});
