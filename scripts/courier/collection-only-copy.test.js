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

function serviceUpdate(noun) {
  return `Service Update: the bench is at capacity, so we've paused walk-ins. Get an instant quote online, and we'll collect your ${noun} same day in London, nationwide by courier.`;
}

const STALE_SUB =
  'Courier collection across London, or free tracked mail-in nationwide.';

describe('quote wizard collection-only intro', () => {
  const wizard = read('sections/quote-wizard.liquid');

  it('renders the Service Update and names the device from the page', () => {
    assert.match(wizard, /Service Update:/);
    assert.match(wizard, /paused walk-ins/);
    assert.match(wizard, /Get an instant quote online/);
    assert.match(wizard, /nationwide by courier/);
    assert.match(wizard, /assign qw_noun = 'iPhone'/);
    assert.match(wizard, /assign qw_noun = 'MacBook'/);
    assert.match(wizard, /assign qw_noun = 'iPad'/);
    assert.match(wizard, /assign qw_noun = 'Apple Watch'/);
    assert.match(wizard, /assign qw_noun = 'device'/);
  });

  it('homepage quote says device, not a named product', () => {
    const index = parseThemeJson('templates/index.json');
    assert.equal(index.sections.contact_with_map_JLb8kC.settings.subheading, serviceUpdate('device'));
    assert.equal(read('templates/index.json').includes(STALE_SUB), false);
  });

  it('iPhone / MacBook / iPad / Watch templates use the matching noun', () => {
    assert.equal(
      parseThemeJson('templates/collection.iphone-collections.json').sections.quote_wizard_top.settings.subheading,
      serviceUpdate('iPhone')
    );
    assert.equal(
      parseThemeJson('templates/collection.macbook-collections.json').sections.quote_wizard_top.settings.subheading,
      serviceUpdate('MacBook')
    );
    assert.equal(
      parseThemeJson('templates/collection.ipad-collections.json').sections.quote_wizard_top.settings.subheading,
      serviceUpdate('iPad')
    );
    assert.equal(
      parseThemeJson('templates/collection.apple-watch-collections.json').sections.quote_wizard_top.settings.subheading,
      serviceUpdate('Apple Watch')
    );
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
  });

  it('iPad collections: wizard above the model grid and a real description without an em dash', () => {
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
    assert.equal(details.includes('—'), false, 'iPad description still has an em dash');
  });
});
