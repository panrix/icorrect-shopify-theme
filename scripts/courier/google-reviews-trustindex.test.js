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
    assert.match(section, /\.google-reviews__widget\s*\{[^}]*min-height:\s*420px/);
    assert.match(section, /@media screen and \(min-width:\s*990px\)\s*\{[^}]*\.google-reviews__widget\s*\{[^}]*min-height:\s*320px/);
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

describe('storefront rating copy', () => {
  const roots = ['sections', 'snippets', 'templates', 'layout', 'blocks', 'config', 'locales', 'assets', 'emails'];
  const exts = new Set(['.liquid', '.json', '.js', '.css', '.html']);
  const claims = [
    { name: '4.9 rating', re: /4\.9\s*\/\s*5|★\s*4\.9|4\.9\s+Rating|4\.9\s+out of|rating\s*=\s*'4\.9'|"default"\s*:\s*"4\.9"|title"\s*:\s*"4\.9"|>(?:4\.9)<|qw-trust-score">4\.9/ },
    { name: '719 review count', re: /719\s*\+?\s*Google reviews/i },
    { name: '700+ review count', re: /700\+\s*(?:Google\s+)?reviews/i },
    { name: 'aggregateRating JSON-LD', re: /aggregateRating|AggregateRating|"reviewCount"\s*:\s*"700"/ },
    { name: 'devices repaired count', re: /(?:100,000|250,000|65,000)\+\s*(?:<\/strong>\s*)?devices repaired/i },
  ];

  function filesUnder(dir, acc) {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        filesUnder(full, acc);
      } else if (exts.has(path.extname(entry.name))) {
        acc.push(full);
      }
    }
    return acc;
  }

  it('does not render a 4.9 rating, a 719 or 700+ review count, or AggregateRating', () => {
    const hits = [];
    for (const relRoot of roots) {
      for (const file of filesUnder(path.join(root, relRoot), [])) {
        const rel = path.relative(root, file);
        const text = fs.readFileSync(file, 'utf8');
        for (const claim of claims) {
          if (claim.re.test(text)) hits.push(`${rel}: ${claim.name}`);
        }
      }
    }
    assert.deepEqual(hits, []);
  });
});
