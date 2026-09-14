/**
 * Contract: customer-facing diagnostic FAQ/schema matches wizard clocks.
 * Wizard source: assets/repair-journey.js (diagnostic = 1 working day).
 * Run: node --test scripts/courier/faq-clock-copy.test.js
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
  const src = read(rel).replace(/^\/\*[\s\S]*?\*\/\s*/, '');
  return JSON.parse(src);
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function homepageDiagnosticAnswerHtml() {
  const index = parseThemeJson('templates/index.json');
  const blocks = index.sections.homepage_faqs_LfBAfa.blocks;
  const faq = Object.values(blocks).find(
    (b) => b.settings && b.settings.heading === 'How long does it take to diagnose an unknown fault?'
  );
  assert.ok(faq, 'homepage FAQ block missing');
  return faq.settings.sub_head;
}

const STALE = /two to three working days|one to two working days|2-3 working days|2 to 3 working days|1 to 2 working days/i;
const ONE_DAY = /diagnose within 1 working day/;
const SERVICE_NEUTRAL = /by courier or mail-in/;
const DEVICE_STAYS = /device stays with us/;

const HOMEPAGE_SOURCES = [
  'templates/index.json',
  'templates/collection.all-devices.json',
  'sections/homepage-faqs.liquid',
  'snippets/icorrect-faq-page-schema.liquid',
];

const DIAGNOSTIC_SOURCES = [
  'templates/collection.ipad-diagnostics.json',
  'templates/collection.macbook-diagnostic.json',
  'templates/collection.apple-watch-diagnostics.json',
  'templates/collection.watch-diagnostics.json',
  'templates/collection.iphone-diagnostics.json',
  'templates/page.advanced-diagnostics.json',
];

describe('FAQ diagnostic clock copy', () => {
  it('homepage FAQ + schema drop the 2–3 day diagnostic claim', () => {
    for (const rel of HOMEPAGE_SOURCES) {
      assert.equal(
        STALE.test(read(rel)),
        false,
        `${rel} still claims two to three / 2-3 working days`
      );
    }
  });

  it('homepage FAQ + schema use the 1-day courier-or-mail-in diagnostic clock', () => {
    for (const rel of HOMEPAGE_SOURCES) {
      const src = read(rel);
      assert.match(src, ONE_DAY, `${rel} missing 1 working day diagnose claim`);
      assert.match(src, SERVICE_NEUTRAL, `${rel} missing courier-or-mail-in wording`);
      assert.match(src, DEVICE_STAYS, `${rel} missing device-stays wording`);
    }
  });

  it('homepage FAQPage JSON-LD matches the visible homepage FAQ answer', () => {
    const schema = read('snippets/icorrect-faq-page-schema.liquid');
    const visible = stripHtml(homepageDiagnosticAnswerHtml());
    const match = schema.match(
      /"name": "How long does it take to diagnose an unknown fault\?",[\s\S]*?"text": "([^"]+)"/
    );
    assert.ok(match, 'FAQPage diagnostic question missing from schema');
    assert.equal(match[1], visible);
  });

  it('diagnostic collection / advanced pages drop the 2–3 day claim', () => {
    for (const rel of DIAGNOSTIC_SOURCES) {
      assert.equal(
        STALE.test(read(rel)),
        false,
        `${rel} still claims two to three / 2-3 working days`
      );
      assert.match(read(rel), /1 working day/, `${rel} missing 1 working day`);
    }
  });

  it('apple-watch-diagnostics is watch-named, not an iPad paste', () => {
    const src = read('templates/collection.apple-watch-diagnostics.json');
    assert.equal(src.includes('iPad'), false);
    assert.match(src, /Apple Watch Diagnostic/);
  });
});
