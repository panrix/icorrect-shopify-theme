/**
 * Wizard prefill resolution tests (#53 slice 3).
 * Run: node --test scripts/courier/wizard-prefill.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const {
  resolveCollectionPrefill,
  resolveProductPrefill,
} = require('../../assets/wizard-prefill.js');

const rules = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/wizard-collection-prefill.json'), 'utf8')
);
const catalogue = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/repair-catalogue-map.json'), 'utf8')
);

describe('resolveCollectionPrefill', () => {
  it('macbook collection → device=macbook', () => {
    const p = resolveCollectionPrefill('macbook-screen-repairs', rules);
    assert.equal(p.device, 'macbook');
    assert.equal(p.fault, 'screen');
  });

  it('iphone battery collection → device+fault', () => {
    const p = resolveCollectionPrefill('iphone-batteries', rules);
    assert.equal(p.device, 'iphone');
    assert.equal(p.fault, 'battery');
  });

  it('watch series → device=watch', () => {
    const p = resolveCollectionPrefill('apple-watch-series-9', rules);
    assert.equal(p.device, 'watch');
  });

  it('unknown handle → empty', () => {
    const p = resolveCollectionPrefill('accessories-cables', rules);
    assert.equal(p.device, null);
    assert.equal(p.fault, null);
  });
});

describe('resolveProductPrefill', () => {
  it('finds a catalogue repair by handle', () => {
    const sample = catalogue.models['watch::apple-watch-se-2-40mm'].repairs.battery;
    const p = resolveProductPrefill(catalogue, { handle: sample.handle });
    assert.ok(p);
    assert.equal(p.device, 'watch');
    assert.equal(p.fault, 'battery');
    assert.equal(p.variantId, sample.variantId);
    assert.equal(p.price, sample.price);
  });

  it('finds a catalogue repair by variantId', () => {
    const sample = catalogue.models['watch::apple-watch-se-2-40mm'].repairs.battery;
    const p = resolveProductPrefill(catalogue, { variantId: sample.variantId });
    assert.ok(p);
    assert.equal(p.handle, sample.handle);
  });

  it('returns null for unknown product', () => {
    assert.equal(resolveProductPrefill(catalogue, { handle: 'not-a-real-product' }), null);
  });
});
