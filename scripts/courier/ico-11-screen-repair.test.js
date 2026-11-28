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

    it(`${rel} has valid OS 2.0 schema scoped under .ico11-shopify with <= 25 char names and no invalid url defaults`, () => {
      const schema = parseSchema(src, rel);
      assert.equal(schema.tag, 'div', `${rel} schema.tag must be div`);
      assert.equal(schema.class, 'ico11-shopify', `${rel} schema.class must be ico11-shopify`);
      assert.ok(
        typeof schema.name === 'string' && schema.name.length > 0 && schema.name.length <= 25,
        `${rel} schema.name "${schema.name}" exceeds Shopify 25-char limit (${(schema.name || '').length})`
      );
      for (const preset of schema.presets || []) {
        assert.ok(
          typeof preset.name === 'string' && preset.name.length > 0 && preset.name.length <= 25,
          `${rel} preset.name "${preset.name}" exceeds Shopify 25-char limit (${(preset.name || '').length})`
        );
      }

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
      assert.doesNotMatch(
        src,
        /href=["']\/collections\//,
        `${rel} should use {{ routes.collections_url }} instead of hardcoded /collections/`
      );
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
        /walk-in|drop-in|express|same-day|same day|apple certified|aggregateRating|no deposits?|£200\+|£200 or more/i,
        `forbidden term found in ${rel}`
      );
    }
    assert.doesNotMatch(
      read('scripts/courier/ico-11-screen-repair.test.js'),
      /[\u2013\u2014]/,
      'em/en dash found in scripts/courier/ico-11-screen-repair.test.js'
    );
  });

  it('uses H1 "MacBook Screen Repair Prices", upfront £299 hero lead, and accurate Band 4 £25 courier copy', () => {
    const tpl = JSON.parse(read('templates/collection.macbook-screen-repair.json'));
    const heroSchema = parseSchema(read('sections/ico-11-hero.liquid'), 'sections/ico-11-hero.liquid');
    const heroHeadingSetting = heroSchema.settings.find((s) => s.id === 'heading');
    assert.equal(tpl.sections.ico_11_hero.settings.heading, 'MacBook Screen Repair Prices');
    assert.equal(heroHeadingSetting.default, 'MacBook Screen Repair Prices');
    assert.match(tpl.sections.ico_11_hero.settings.lead, /from £299/);
    assert.match(tpl.sections.ico_11_hero.settings.lead, /30% to 50% less/);
    assert.match(tpl.sections.ico_11_faqs.blocks.faq_collection.settings.answer, /Band 4/i);
    assert.match(tpl.sections.ico_11_faqs.blocks.faq_collection.settings.answer, /£25/);
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

  it('preserves parallel 3-column comparison table (waste first, warranty last) and exposes mobile provider names to AT', () => {
    const compare = read('sections/ico-11-compare.liquid');
    assert.ok(compare.includes('iCorrect'));
    assert.ok(compare.includes('Apple Store &amp; full-lid shops'));
    assert.ok(compare.includes('Aftermarket shops'));
    assert.doesNotMatch(
      compare,
      /class="cmp-name-short"[^>]*aria-hidden="true"/,
      'mobile comparison provider names must not be aria-hidden="true"'
    );
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

  it('ico-11-screen-repair.js parses cleanly and covers all 32 catalogue MacBook screen codes in finder and price directory', () => {
    assert.doesNotThrow(() => new vm.Script(js, { filename: 'assets/ico-11-screen-repair.js' }));
    const codeMatches = js.match(/code:\s*"A\d{4}"/g) || [];
    assert.equal(codeMatches.length, 32, `expected 32 models in JS finder, got ${codeMatches.length}`);

    const catalogue = JSON.parse(read('assets/repair-catalogue-map.json'));
    const pricesDir = read('sections/ico-11-prices-by-model.liquid');
    const catalogueCodes = new Map();
    for (const model of Object.values(catalogue.models)) {
      if (model.device !== 'macbook' || !model.repairs || !model.repairs.screen) continue;
      for (const code of model.name.match(/A\d{4}/g) || []) {
        if (!catalogueCodes.has(code)) catalogueCodes.set(code, []);
        catalogueCodes.get(code).push(model.repairs.screen.price);
      }
    }
    assert.equal(catalogueCodes.size, 32, 'catalogue should have 32 MacBook screen A-codes');
    for (const [code, prices] of catalogueCodes.entries()) {
      assert.ok(js.includes(`code: "${code}"`), `JS finder missing catalogue code ${code}`);
      assert.ok(pricesDir.includes(code), `prices-by-model directory missing catalogue code ${code}`);
      for (const p of prices) {
        assert.ok(
          pricesDir.includes(`£${p}`),
          `prices-by-model directory missing price £${p} for ${code}`
        );
      }
    }

    assert.match(pricesDir, /Model A1466[\s\S]*?£299/);
    assert.match(pricesDir, /Model A1706[\s\S]*?£399/);
    assert.match(pricesDir, /Model A1708[\s\S]*?£399/);
    assert.ok(pricesDir.includes('Show all 10 models'));
    assert.ok(pricesDir.includes('Show all 11 models'));
  });

  it('finder resolves A1466/A1706/A1708 with exact prices, rejects malformed A24420, and aligns desktop/mobile group ARIA', () => {
    function createEl(tag, init) {
      const attrs = Object.assign({}, (init && init.attrs) || {});
      const classes = new Set((init && init.classes) || []);
      const listeners = {};
      const children = [];
      let text = (init && init.text) || '';
      const el = {
        tagName: tag.toUpperCase(),
        dataset: {},
        hidden: false,
        value: '',
        focused: false,
        children,
        classList: {
          add: (c) => classes.add(c),
          remove: (c) => classes.delete(c),
          contains: (c) => classes.has(c),
          toggle: (c, force) => {
            if (force === undefined) {
              if (classes.has(c)) classes.delete(c);
              else classes.add(c);
            } else if (force) classes.add(c);
            else classes.delete(c);
          },
        },
        setAttribute: (k, v) => { attrs[k] = String(v); },
        getAttribute: (k) => (Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null),
        removeAttribute: (k) => { delete attrs[k]; },
        addEventListener: (ev, fn) => {
          listeners[ev] = listeners[ev] || [];
          listeners[ev].push(fn);
        },
        dispatch: (ev, payload) => {
          for (const fn of listeners[ev] || []) fn(payload || { preventDefault: () => {} });
        },
        focus: () => { el.focused = true; },
        appendChild: (child) => { children.push(child); return child; },
        querySelector: (sel) => (init && init.querySelector ? init.querySelector(sel) : null),
        get textContent() {
          if (children.length) return children.map((c) => c.textContent).join('');
          return text;
        },
        set textContent(v) {
          text = String(v);
          children.length = 0;
        },
      };
      return el;
    }

    const input = createEl('input');
    const error = createEl('p');
    const out = createEl('div');
    const form = createEl('form');

    const btn1 = createEl('button', { attrs: { 'aria-expanded': 'true' } });
    const btn2 = createEl('button', { attrs: { 'aria-expanded': 'false' } });
    const btn3 = createEl('button', { attrs: { 'aria-expanded': 'false' } });
    const group1 = createEl('div', {
      classes: ['is-open'],
      querySelector: (s) => (s === '.model-group-head-btn' ? btn1 : null),
    });
    const group2 = createEl('div', {
      querySelector: (s) => (s === '.model-group-head-btn' ? btn2 : null),
    });
    const group3 = createEl('div', {
      querySelector: (s) => (s === '.model-group-head-btn' ? btn3 : null),
    });

    const winListeners = {};
    const windowObj = {
      innerWidth: 1440,
      scrollY: 0,
      addEventListener: (ev, fn) => {
        winListeners[ev] = winListeners[ev] || [];
        winListeners[ev].push(fn);
      },
      setTimeout: () => 1,
    };
    const documentObj = {
      readyState: 'complete',
      getElementById: (id) => {
        if (id === 'identify-input') return input;
        if (id === 'identify-error') return error;
        if (id === 'identify-result') return out;
        return null;
      },
      querySelector: (sel) => (sel === '#identify-form' ? form : null),
      querySelectorAll: (sel) => (sel === '[data-ico11-model-group]' ? [group1, group2, group3] : []),
      createElement: (tag) => createEl(tag),
      createTextNode: (t) => ({ textContent: String(t) }),
      addEventListener: () => {},
    };

    vm.runInNewContext(js, { window: windowObj, document: documentObj });

    // Desktop (> 768px): all 3 visible model-group buttons report expanded and aria-disabled
    assert.equal(btn1.getAttribute('aria-expanded'), 'true');
    assert.equal(btn2.getAttribute('aria-expanded'), 'true');
    assert.equal(btn3.getAttribute('aria-expanded'), 'true');
    assert.equal(btn2.getAttribute('aria-disabled'), 'true');
    assert.equal(btn3.getAttribute('aria-disabled'), 'true');

    // Mobile (390px): resize restores interactive collapsed ARIA state on closed groups
    windowObj.innerWidth = 390;
    for (const fn of winListeners.resize || []) fn();
    assert.equal(btn1.getAttribute('aria-expanded'), 'true');
    assert.equal(btn2.getAttribute('aria-expanded'), 'false');
    assert.equal(btn3.getAttribute('aria-expanded'), 'false');
    assert.equal(btn2.getAttribute('aria-disabled'), null);
    btn2.dispatch('click');
    assert.equal(btn2.getAttribute('aria-expanded'), 'true');
    assert.equal(group2.classList.contains('is-open'), true);

    // Finder matches A1466, A1706, A1708, and normalized Model a2442 with exact prices
    for (const [query, expectedCode, expectedPrice] of [
      ['A1466', 'A1466', '£299'],
      ['A1706', 'A1706', '£399'],
      ['A1708', 'A1708', '£399'],
      ['Model a2442', 'A2442', '£549'],
    ]) {
      input.value = query;
      form.dispatch('submit');
      assert.ok(out.textContent.includes(`(${expectedCode})`), `expected ${query} to match ${expectedCode}, got: ${out.textContent}`);
      assert.ok(out.textContent.includes(expectedPrice), `expected ${query} to show ${expectedPrice}, got: ${out.textContent}`);
    }

    // Finder rejects malformed codes that only contain a valid code as a substring
    for (const bad of ['A24420', 'XA2442', 'A2442B', '1A1706']) {
      input.value = bad;
      form.dispatch('submit');
      assert.match(out.textContent, /We could not match/, `expected ${bad} not to match, got: ${out.textContent}`);
    }
  });
});
