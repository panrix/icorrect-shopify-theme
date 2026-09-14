/**
 * Theme #65 Terra r1: product titles must not land in HTML attributes.
 * Run: node --test scripts/courier/quote-wizard-repair-stamp.liquid.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const liquid = fs.readFileSync(
  path.join(__dirname, '../../sections/quote-wizard.liquid'),
  'utf8'
);

describe('quote-wizard repair stamp wiring', () => {
  it('does not interpolate repair title into data-repair attributes', () => {
    assert.equal(liquid.includes('data-repair="'), false);
    assert.equal(liquid.includes('data-repair-handle="'), false);
  });

  it('stamps quoted repair via DOM dataset after both cards render', () => {
    assert.match(liquid, /ICorrectQuotedRepair\.stampQuotedRepair/);
    assert.match(liquid, /function fireQuoteEmailRequested/);
    const emailIdx = liquid.indexOf('fireQuoteEmailRequested({');
    const syncIdx = liquid.indexOf('function fireQuoteEmailRequested');
    const syncBody = liquid.slice(syncIdx, syncIdx + 450);
    assert.match(syncBody, /syncIcorrectQuote\(\)/);
    assert.ok(emailIdx > 0);
  });

  it('diagnostic turnaround copy is 1 working day, not 24 hours', () => {
    assert.match(liquid, /Quote in 1 working day/);
    assert.match(liquid, /diagnose within 1 working day/);
    assert.equal(liquid.includes('Quote in 24 hours'), false);
    assert.equal(liquid.includes('24 hours on the bench'), false);
    assert.equal(liquid.includes('diagnose within 24 hours'), false);
    assert.match(liquid, /within 24 hours/); // liquid-damage incident copy stays
  });
});
