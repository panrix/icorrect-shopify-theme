/**
 * Contract: quote module explains collection-only (walk-ins paused).
 * Device collection pages put the wizard above the model grid.
 * Run: node --test scripts/courier/collection-only-copy.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function parseThemeJson(rel) {
  return JSON.parse(read(rel).replace(/^\/\*[\s\S]*?\*\/\s*/, ''));
}

const NEW_SUB =
  "The bench is at capacity, so we've paused walk-ins. Quote online and we'll collect your device — same day in London, or free tracked mail-in nationwide.";
const STALE_SUB =
  'Courier collection across London, or free tracked mail-in nationwide.';

describe('quote wizard collection-only intro', () => {
  const wizard = read('sections/quote-wizard.liquid');

  it('renders the bench-at-capacity / no walk-ins explanation', () => {
    assert.match(wizard, /paused walk-ins/);
    assert.match(wizard, /same day in London/);
    assert.match(wizard, /free tracked mail-in nationwide/);
    assert.match(wizard, /qw_sub_default/);
  });

  it('still remaps the stale courier-only one-liner', () => {
    assert.match(wizard, /assign qw_sub_stale = 'Courier collection across London/);
    assert.match(wizard, /qw_sub == qw_sub_stale/);
  });

  it('schema default matches the live intro', () => {
    assert.match(wizard, new RegExp(NEW_SUB.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  it('homepage quote uses the collection-only intro', () => {
    const index = parseThemeJson('templates/index.json');
    assert.equal(index.sections.contact_with_map_JLb8kC.settings.subheading, NEW_SUB);
    assert.equal(read('templates/index.json').includes(STALE_SUB), false);
  });
});

describe('device collection pages put the quote first', () => {
  it('iPhone collections: wizard above the model grid', () => {
    const t = parseThemeJson('templates/collection.iphone-collections.json');
    const order = t.order;
    assert.ok(
      order.indexOf('quote_wizard_top') < order.indexOf('parent_categories_nWCAYw'),
      'iPhone quote is still below Choose your iPhone model'
    );
    assert.equal(t.sections.quote_wizard_top.settings.subheading, NEW_SUB);
  });

  it('iPad collections: wizard above the model grid and a real description', () => {
    const t = parseThemeJson('templates/collection.ipad-collections.json');
    const order = t.order;
    assert.ok(
      order.indexOf('quote_wizard_top') < order.indexOf('parent_categories_f6HGVL'),
      'iPad quote is still below Choose your iPad model'
    );
    const details = t.sections.parent_categories_f6HGVL.settings.details;
    assert.ok(details && details.length > 80, 'iPad collection still has no description');
    assert.match(details, /iPad repairs/i);
    assert.match(details, /collect/i);
    assert.equal(t.sections.quote_wizard_top.settings.subheading, NEW_SUB);
  });
});
