/**
 * Homepage Google reviews use the Trustindex widget.
 * The theme must not ship the old mock cards or the hardcoded 4.8/700 AggregateRating.
 * Run: node --test scripts/courier/google-reviews-trustindex.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const WIDGET_ID = '47cc7ef8590e8871fa062160cf7';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

describe('homepage Trustindex Google reviews', () => {
  const section = read('sections/google-reviews.liquid');
  const schema = read('snippets/icorrect-localbusiness-schema.liquid');
  const hero = read('sections/hero-banner.liquid');
  const index = read('templates/index.json');

  it('embeds the Trustindex loader and reserves height', () => {
    assert.match(
      section,
      new RegExp(
        `<script defer async src="https://cdn\\.trustindex\\.io/loader\\.js\\?\\{\\{ trustindex_widget_id \\| escape \\}\\}"></script>`
      )
    );
    assert.match(section, new RegExp(`"default": "${WIDGET_ID}"`));
    assert.match(section, /min-height:\s*420px/);
    assert.match(section, /"default": "Google reviews"/);
    assert.doesNotMatch(section, /700\+|4\.8|MOCK DATA|seo-fallback|author_name|William|Noah|Rainer|Mark Evans/);
  });

  it('stores the widget id on the homepage section', () => {
    assert.match(index, new RegExp(`"trustindex_widget_id": "${WIDGET_ID}"`));
    assert.match(index, /"heading": "Google reviews"/);
    assert.doesNotMatch(index, /Over 700\+|Average 4\.8 Rating/);
  });

  it('drops the hardcoded AggregateRating from LocalBusiness JSON-LD', () => {
    assert.doesNotMatch(schema, /AggregateRating|aggregateRating|ratingValue|reviewCount/);
    assert.match(schema, /"@type": "LocalBusiness"/);
  });

  it('shows the homepage hero badge as 4.8 from 750+ Google reviews', () => {
    assert.match(hero, /"default": "4\.8 from 750\+ Google reviews"/);
    assert.match(index, /"review_badge_text": "4\.8 from 750\+ Google reviews"/);
    assert.match(hero, /section\.settings\.review_badge_text \| escape/);
    assert.doesNotMatch(hero, /700\+<\/strong> Reviews|719 Google reviews/);
  });

  it('does not let other templates render the google-reviews section', () => {
    const templatesDir = path.join(root, 'templates');
    const files = walk(templatesDir, []).filter((file) => file.endsWith('.json') || file.endsWith('.liquid'));
    const offenders = [];
    for (const file of files) {
      const rel = path.relative(root, file);
      if (rel === 'templates/index.json') continue;
      const text = fs.readFileSync(file, 'utf8');
      if (/"type": "google-reviews"/.test(text) || /MOCK DATA|Mark Evans|seo-fallback/.test(text)) {
        offenders.push(rel);
      }
    }
    assert.deepEqual(offenders, []);
  });
});
