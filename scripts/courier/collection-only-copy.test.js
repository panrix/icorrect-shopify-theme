/**
 * Quote intro is a collect offer, not a capacity warning.
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

function collectLine(noun) {
  return `We'll collect your ${noun} same day in London, nationwide by courier.`;
}

describe('quote wizard collect intro', () => {
  const wizard = read('sections/quote-wizard.liquid');

  it('does not say the bench is full or walk-ins are paused', () => {
    assert.equal(/Service Update|bench is at capacity|paused walk-ins/i.test(wizard), false);
    assert.match(wizard, /We'll collect your /);
    assert.match(wizard, /same day in London, nationwide by courier/);
    assert.match(wizard, /assign qw_noun = 'iPhone'/);
    assert.match(wizard, /assign qw_noun = 'MacBook'/);
    assert.match(wizard, /assign qw_noun = 'iPad'/);
    assert.match(wizard, /assign qw_noun = 'Apple Watch'/);
    assert.match(wizard, /assign qw_noun = 'device'/);
  });

  it('homepage quote says device', () => {
    const index = parseThemeJson('templates/index.json');
    assert.equal(index.sections.contact_with_map_JLb8kC.settings.subheading, collectLine('device'));
  });

  it('iPhone / MacBook / iPad / Watch templates use the matching noun', () => {
    assert.equal(
      parseThemeJson('templates/collection.iphone-collections.json').sections.quote_wizard_top.settings.subheading,
      collectLine('iPhone')
    );
    assert.equal(
      parseThemeJson('templates/collection.macbook-collections.json').sections.quote_wizard_top.settings.subheading,
      collectLine('MacBook')
    );
    assert.equal(
      parseThemeJson('templates/collection.ipad-collections.json').sections.quote_wizard_top.settings.subheading,
      collectLine('iPad')
    );
    assert.equal(
      parseThemeJson('templates/collection.apple-watch-collections.json').sections.quote_wizard_top.settings.subheading,
      collectLine('Apple Watch')
    );
  });
});

describe('device collection pages put the quote first', () => {
  it('iPhone collections: wizard above the model grid', () => {
    const t = parseThemeJson('templates/collection.iphone-collections.json');
    assert.ok(
      t.order.indexOf('quote_wizard_top') < t.order.indexOf('parent_categories_nWCAYw'),
      'iPhone quote is still below Choose your iPhone model'
    );
  });

  it('iPad collections: wizard above the model grid and a real description without an em dash', () => {
    const t = parseThemeJson('templates/collection.ipad-collections.json');
    assert.ok(
      t.order.indexOf('quote_wizard_top') < t.order.indexOf('parent_categories_f6HGVL'),
      'iPad quote is still below Choose your iPad model'
    );
    const details = t.sections.parent_categories_f6HGVL.settings.details;
    assert.ok(details && details.length > 80, 'iPad collection still has no description');
    assert.match(details, /iPad repairs/i);
    assert.match(details, /collect/i);
    assert.equal(details.includes('—'), false, 'iPad description still has an em dash');
  });
});
