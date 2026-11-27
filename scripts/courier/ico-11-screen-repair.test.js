/**
 * ICO-11 MacBook Screen Repair Shopify OS 2.0 port validation tests.
 * Verifies template structure, native quote-wizard mounting, Liquid schema and
 * tag integrity, CSS scoping, JS syntax, assets, Trustindex, FAQPage JSON-LD,
 * and copy/design constraints against commit 5033f06.
 *
 * Run: node --test scripts/courier/ico-11-screen-repair.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '../..');

const ICO11_SECTIONS = [
  'ico-11-hero',
  'ico-11-reviews',
  'ico-11-starting-prices',
  'ico-11-process-timeline',
  'ico-11-compare',
  'ico-11-workshop-warranty',
  'ico-11-faults',
  'ico-11-model-finder',
  'ico-11-quote-intro',
  'ico-11-faqs',
  'ico-11-prices-by-model',
  'ico-11-closing-cta',
];

const EXPECTED_ORDER = [
  'ico_11_hero',
  'ico_11_reviews',
  'ico_11_starting_prices',
  'ico_11_process_timeline',
  'ico_11_compare',
  'ico_11_workshop_warranty',
  'ico_11_faults',
  'ico_11_model_finder',
  'ico_11_quote_intro',
  'quote_wizard_top',
  'ico_11_faqs',
  'ico_11_prices_by_model',
  'ico_11_closing_cta',
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function parseSchema(liquidSrc, rel) {
  const match = liquidSrc.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  assert.ok(match, `missing schema block in ${rel}`);
  return JSON.parse(match[1]);
}

describe('ICO-11 collection.macbook-screen-repair.json template', () => {
  const raw = read('templates/collection.macbook-screen-repair.json');
  const tpl = JSON.parse(raw);

  it('mounts all 12 ICO-11 sections plus untouched native quote-wizard in exact 5033f06 vertical order', () => {
    assert.deepEqual(tpl.order, EXPECTED_ORDER);
    assert.equal(tpl.sections.quote_wizard_top.type, 'quote-wizard');
    assert.equal(tpl.sections.quote_wizard_top.settings.show_map, false);
    assert.equal(tpl.sections.quote_wizard_top.settings.prefill_mode, 'auto');
    assert.equal(tpl.sections.quote_wizard_top.settings.skip_to_service, false);
  });

  it('every referenced section file exists in sections/', () => {
    for (const id of tpl.order) {
      const sec = tpl.sections[id];
      assert.ok(sec && sec.type, `missing section definition for ${id}`);
      const secPath = path.join(root, 'sections', `${sec.type}.liquid`);
      assert.equal(fs.existsSync(secPath), true, `missing section file sections/${sec.type}.liquid`);
    }
  });

  it('populates 5 starting price chips and 8 FAQs synced to 5033f06', () => {
    assert.equal(tpl.sections.ico_11_starting_prices.block_order.length, 5);
    assert.equal(tpl.sections.ico_11_faqs.block_order.length, 8);
    assert.equal(tpl.sections.ico_11_reviews.settings.trustindex_widget_id, 'b831fa386ffa616e7a2620959d0');
    assert.equal(tpl.sections.ico_11_reviews.settings.heading, '4.8 from 750+ Google reviews');
  });

  it('places FAQs on white directly below quote-wizard, then prices-by-model on soft, then dark closing CTA', () => {
    const qIdx = tpl.order.indexOf('quote_wizard_top');
    assert.equal(tpl.order[qIdx - 1], 'ico_11_quote_intro');
    assert.equal(tpl.order[qIdx + 1], 'ico_11_faqs');
    assert.equal(tpl.order[qIdx + 2], 'ico_11_prices_by_model');
    assert.equal(tpl.order[qIdx + 3], 'ico_11_closing_cta');

    assert.match(read('sections/ico-11-faqs.liquid'), /<section class="section section-faq-below-wizard" id="faqs">/);
    assert.match(read('sections/ico-11-prices-by-model.liquid'), /<section class="section section-soft" id="prices-by-model">/);
    assert.match(read('sections/ico-11-closing-cta.liquid'), /<section class="section section-compact section-dark" id="closing-cta"/);
    const css = read('assets/ico-11-screen-repair.css');
    assert.match(css, /--ico11-bg-1:\s*#ffffff/i);
    assert.match(css, /--ico11-bg-2:\s*#fafafa/i);
    assert.match(css, /--ico11-ink:\s*#111827/i);
  });
});

describe('ICO-11 Liquid sections schema, tags, and assets', () => {
  for (const name of ICO11_SECTIONS) {
    const rel = `sections/${name}.liquid`;
    const src = read(rel);

    it(`${rel} has valid OS 2.0 schema scoped under .ico11-shopify with no invalid url defaults`, () => {
      const schema = parseSchema(src, rel);
      assert.equal(schema.tag, 'div', `${rel} schema.tag must be div`);
      assert.equal(schema.class, 'ico11-shopify', `${rel} schema.class must be ico11-shopify`);

      const allSettings = [
        ...(schema.settings || []),
        ...((schema.blocks || []).flatMap((b) => b.settings || [])),
      ];
      for (const s of allSettings) {
        if (s.type === 'url') {
          assert.equal(
            Object.prototype.hasOwnProperty.call(s, 'default'),
            false,
            `${rel} url setting "${s.id}" must not define a default in Shopify schema`
          );
        }
      }
    });

    it(`${rel} has balanced Liquid block tags and no duplicated header/footer`, () => {
      const pairs = [
        ['if', 'endif'],
        ['for', 'endfor'],
        ['unless', 'endunless'],
        ['case', 'endcase'],
        ['capture', 'endcapture'],
        ['schema', 'endschema'],
      ];
      for (const [open, close] of pairs) {
        const opens = (src.match(new RegExp(`\\{%-?\\s*${open}\\b`, 'g')) || []).length;
        const closes = (src.match(new RegExp(`\\{%-?\\s*${close}\\b`, 'g')) || []).length;
        assert.equal(opens, closes, `${rel} unbalanced Liquid ${open}/${close} (${opens} vs ${closes})`);
      }
      assert.doesNotMatch(src, /<header[\s>]|<footer[\s>]/i, `${rel} must not duplicate site header or footer`);
    });

    it(`${rel} references only existing files via asset_url`, () => {
      const matches = [...src.matchAll(/['"]([^'"]+)['"]\s*\|\s*asset_url/g)];
      for (const m of matches) {
        const assetPath = path.join(root, 'assets', m[1]);
        assert.equal(fs.existsSync(assetPath), true, `${rel} references missing asset assets/${m[1]}`);
        assert.ok(fs.statSync(assetPath).size > 0, `asset assets/${m[1]} is empty`);
      }
    });
  }
});

describe('ICO-11 visual, copy, and SEO parity with 5033f06', () => {
  const css = read('assets/ico-11-screen-repair.css');
  const js = read('assets/ico-11-screen-repair.js');
  const allFiles = [
    'templates/collection.macbook-screen-repair.json',
    'assets/ico-11-screen-repair.css',
    'assets/ico-11-screen-repair.js',
    'assets/ico-11-display-assembly-clean.svg',
    ...ICO11_SECTIONS.map((s) => `sections/${s}.liquid`),
  ];

  it('contains zero em dashes, zero en dashes, and zero forbidden copy terms', () => {
    for (const rel of allFiles) {
      const src = read(rel);
      assert.doesNotMatch(src, /[\u2013\u2014]/, `em/en dash found in ${rel}`);
      assert.doesNotMatch(
        src,
        /walk-in|drop-in|express|same-day|same day|apple certified|aggregateRating/i,
        `forbidden term found in ${rel}`
      );
    }
  });

  it('uses cool neutrals, #38598C accent, #111827 CTAs, zero green accents, zero gradients, and strict .ico11-shopify CSS scoping', () => {
    assert.match(css, /--ico11-accent:\s*#38598C/i);
    assert.match(css, /--ico11-ink:\s*#111827/i);
    assert.doesNotMatch(css, /linear-gradient|radial-gradient|conic-gradient/i);
    assert.doesNotMatch(css, /#(?:16a34a|22c55e|10b981|059669|15803d|4ade80|86efac|166534|dcfce7)/i);

    const strippedCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const selectorRegex = /(?:^|[{}])\s*([^{}]+?)\s*\{/g;
    let m;
    while ((m = selectorRegex.exec(strippedCss)) !== null) {
      const rawSel = m[1].trim();
      if (!rawSel || rawSel.startsWith('@')) continue;
      for (const sel of rawSel.split(',')) {
        const s = sel.trim();
        if (!s || s === 'from' || s === 'to' || /^\d+%$/.test(s)) continue;
        assert.match(
          s,
          /^\.ico11-shopify\b/,
          `unscoped CSS selector found in ico-11-screen-repair.css: "${s}"`
        );
      }
    }
  });

  it('preserves 5033f06 2x2 single-line mobile hero proof stamps', () => {
    const hero = read('sections/ico-11-hero.liquid');
    for (const label of ['4.8', 'from 750+ Google reviews', 'from £299', '2 working days', '2-year warranty']) {
      assert.ok(hero.includes(label), `missing hero proof stamp "${label}"`);
    }
    assert.match(css, /\.ico11-shopify \.stamp-strip\s*\{[\s\S]*?grid-auto-rows:\s*1fr/);
    assert.match(css, /\.ico11-shopify \.stamp-figure\s*\{[\s\S]*?white-space:\s*nowrap/);
  });

  it('preserves parallel 3-column comparison table (waste first, warranty last)', () => {
    const compare = read('sections/ico-11-compare.liquid');
    assert.ok(compare.includes('iCorrect'));
    assert.ok(compare.includes('Apple Store &amp; full-lid shops'));
    assert.ok(compare.includes('Aftermarket shops'));
    const wasteIdx = compare.indexOf('What gets replaced &amp; waste');
    const warrantyIdx = compare.indexOf('>Warranty<');
    assert.ok(wasteIdx > 0 && warrantyIdx > wasteIdx, 'Waste row must appear before Warranty row');
    assert.match(css, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  });

  it('preserves dedicated MacBook Screen Trustindex widget and zero hardcoded amber stars', () => {
    const reviews = read('sections/ico-11-reviews.liquid');
    assert.ok(reviews.includes('b831fa386ffa616e7a2620959d0'));
    assert.ok(reviews.includes('4.8 from 750+ Google reviews'));
    assert.doesNotMatch(reviews, /\u2605|#f59e0b|#fbbf24|ti-star/i);
  });

  it('includes all 4 real fault photos with Flexgate labeled A1706', () => {
    const faults = read('sections/ico-11-faults.liquid');
    for (const asset of [
      'ico-11-fault-cracked-lcd.webp',
      'ico-11-fault-flexgate.webp',
      'ico-11-fault-dustgate.webp',
      'ico-11-fault-backlight.webp',
    ]) {
      assert.ok(faults.includes(asset), `missing fault asset ${asset} in ico-11-faults.liquid`);
      assert.equal(fs.existsSync(path.join(root, 'assets', asset)), true);
    }
    assert.ok(faults.includes('MacBook Pro 13\\" (Intel, A1706)') || faults.includes('MacBook Pro 13" (Intel, A1706)'));
  });

  it('preserves Fitzrovia address, Mon-Fri 9am-6pm / Sat-Sun Closed hours, and optional image_picker workshop photo slots', () => {
    const workshop = read('sections/ico-11-workshop-warranty.liquid');
    const schema = parseSchema(workshop, 'sections/ico-11-workshop-warranty.liquid');
    assert.ok(workshop.includes('12 Margaret Street, Audley House, London W1W 8JQ'));
    assert.ok(workshop.includes('Mon to Fri'));
    assert.ok(workshop.includes('9am to 6pm'));
    assert.ok(workshop.includes('Sat &amp; Sun'));
    assert.ok(workshop.includes('Closed'));
    const pickers = schema.settings.filter((s) => s.type === 'image_picker');
    assert.equal(pickers.length, 2, 'workshop section should expose 2 optional image_picker settings');
  });

  it('generates 1:1 synced FAQPage JSON-LD directly from section.blocks with zero aggregateRating', () => {
    const faqs = read('sections/ico-11-faqs.liquid');
    assert.match(faqs, /"@type":\s*"FAQPage"/);
    assert.match(faqs, /"mainEntity":\s*\[/);
    assert.match(faqs, /block\.settings\.question \| strip \| json/);
    assert.match(faqs, /block\.settings\.answer \| strip_html \| strip \| json/);
    assert.doesNotMatch(faqs, /aggregateRating/i);
  });

  it('ico-11-screen-repair.js parses cleanly as valid JavaScript and includes all 29 MacBook model codes', () => {
    assert.doesNotThrow(() => new vm.Script(js, { filename: 'assets/ico-11-screen-repair.js' }));
    const codeMatches = js.match(/code:\s*"A\d{4}"/g) || [];
    assert.equal(codeMatches.length, 29, `expected 29 models in JS finder, got ${codeMatches.length}`);
  });
});
