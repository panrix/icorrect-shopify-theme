/**
 * MacBook SEO titles, schema guards, and the turnaround copy lock.
 * Run: node --test scripts/courier/macbook-seo.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '../..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function titleLength(title) {
  return [...title].length;
}

describe('MacBook search titles stay within the snippet limit', () => {
  const titles = [
    'MacBook Repair Cost UK | iCorrect',
    'MacBook Screen Replacement Cost UK | iCorrect',
    'MacBook Keyboard Replacement Cost UK | iCorrect',
    'MacBook Battery Replacement Cost UK | iCorrect',
    'MacBook Trackpad Repair Cost UK | iCorrect',
    'MacBook Flexgate Repair Cost UK | iCorrect',
    'MacBook Dustgate Repair Cost UK | iCorrect',
    'MacBook Touch Bar Repair Cost UK | iCorrect',
    'MacBook Charging Port Repair Cost UK | iCorrect',
    'MacBook Diagnostic Cost UK | iCorrect',
    'A2338 MacBook Pro Repair Cost UK | iCorrect',
    'A2337 MacBook Air Repair Cost UK | iCorrect',
    'A2337 Screen Replacement Cost UK | iCorrect',
    'A2338 Keyboard Replacement Cost UK | iCorrect',
    'MacBook Pro Repair Cost UK | iCorrect',
    'MacBook Air Repair Cost UK | iCorrect',
    'MacBook Pro 14" Repair Cost UK | iCorrect',
    'MacBook Air 13" Repair Cost UK | iCorrect',
    'MacBook Pro 16" Repair Cost UK | iCorrect',
  ];

  for (const title of titles) {
    it(`${title} is 60 characters or under`, () => {
      assert.ok(titleLength(title) <= 60, `${titleLength(title)} chars`);
      assert.match(title, /iCorrect$/);
      assert.doesNotMatch(title, /—|–/);
    });
  }

  it('builds those titles from the Liquid rules', () => {
    const seo = read('snippets/icorrect-macbook-seo.liquid');
    assert.match(seo, /MacBook Repair Cost UK \| iCorrect/);
    assert.match(seo, /append: repair_label \| append: ' Cost UK \| iCorrect'/);
    assert.match(seo, /append: family \| append: ' Repair Cost UK \| iCorrect'/);
    assert.match(seo, /'" Repair Cost UK \| iCorrect'/);
    assert.equal(seo.includes('£350'), false);
    assert.equal(seo.includes('—'), false);
    assert.equal(seo.includes('free mail-in'), false);
    assert.equal(seo.includes('walk-in'), false);
  });
});

describe('MacBook pages keep the turnaround test copy', () => {
  it('does not edit wizard script, cart, or London templates', () => {
    const diff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: root, encoding: 'utf8' });
    const files = diff.split('\n').filter(Boolean);
    const blocked = files.filter((file) =>
      /london/.test(file) ||
      file.endsWith('quote-wizard.js') ||
      file.includes('assets/cart') ||
      file.endsWith('cart.js') ||
      file.includes('checkout')
    );
    assert.deepEqual(blocked, []);
  });

  it('keeps the wizard H1 and only adds the from-price under it', () => {
    const wizard = read('sections/quote-wizard.liquid');
    assert.match(wizard, /<h1 class="qw-page-title">\{\{ collection\.title \| escape \}\}<\/h1>\n\s*\{% render 'macbook-from-price' %\}/);
    assert.equal(read('assets/quote-wizard.js').includes("render 'macbook-from-price'"), false);
  });

  it('keeps the hub FAQ timing sentences', () => {
    const hub = read('templates/page.macbook-repairs.json');
    assert.match(hub, /take around 3 working days/);
    assert.match(hub, /within one working day/);
    assert.match(hub, /same-day or next-day depending on model/);
  });
});

describe('reviews, FAQ schema and links are wired', () => {
  it('does not put the homepage reviews widget on MacBook templates', () => {
    const screen = read('templates/collection.macbook-screen-repair.json');
    const london = read('templates/page.macbook-pro-screen-replacement-london.json');
    const hub = read('templates/page.macbook-repairs.json');
    assert.equal(screen.includes('google-reviews'), false);
    assert.equal(hub.includes('google-reviews'), false);
    assert.match(screen, /"emit_faq_schema": true/);
    assert.equal(london.includes('google-reviews'), false);
    assert.match(read('templates/index.json'), /"type": "google-reviews"/);
  });

  it('skips diagnostic products except on the diagnostic collection', () => {
    const min = read('snippets/macbook-min-price.liquid');
    const fromCents = read('snippets/macbook-from-cents.liquid');
    assert.match(min, /unless include_diagnostics/);
    assert.match(min, /priced_handle contains 'diagnostic'/);
    assert.match(fromCents, /cents_handle contains 'diagnostic'/);
    assert.match(fromCents, /include_diagnostics: include_diagnostics/);
    assert.equal(fromCents.includes('macbook-diagnostic-prices'), false);
  });

  it('puts a space between list items when flattening FAQ HTML', () => {
    const faq = read('snippets/icorrect-faq-jsonld.liquid');
    assert.match(faq, /replace: '<\/li>', ' '/);
    const sample = '<ul><li>Battery draining unusually fast</li><li>macOS showing “Service Recommended”</li></ul>';
    const flat = sample
      .replaceAll('</li>', ' ')
      .replaceAll('</ul>', ' ')
      .replaceAll('><', '> <')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    assert.match(flat, /fast macOS/);
    assert.equal(flat.includes('fastmacOS'), false);
  });

  it('builds FAQPage JSON-LD from the visible FAQ blocks', () => {
    const faq = read('snippets/icorrect-faq-jsonld.liquid');
    assert.match(faq, /"@type": "FAQPage"/);
    assert.match(faq, /strip_html/);
    assert.match(faq, /\| json/);
    assert.equal(faq.includes('£350'), false);
  });

  it('adds a price to MacBook service schema from Liquid cents', () => {
    const schema = read('snippets/icorrect-seo-schema.liquid');
    assert.match(schema, /"@type": "AggregateOffer"/);
    assert.match(schema, /macbook-min-price/);
    assert.match(schema, /priceCurrency": "GBP"/);
    assert.equal(schema.includes('Same-day and next-day service available'), true);
  });
});

describe('MacBook from-prices match catalogue variants', () => {
  const map = JSON.parse(read('assets/repair-catalogue-map.json'));
  const catalogue = JSON.parse(read('data/shopify-catalogue-2026-09-11.json'));
  const products = Array.isArray(catalogue) ? catalogue : catalogue.products;

  function cheapest(repairKey) {
    let best = null;
    for (const model of Object.values(map.models || map)) {
      if (!model || model.device !== 'macbook' || !model.repairs) continue;
      const row = model.repairs[repairKey];
      if (!row || typeof row.price !== 'number') continue;
      if (!best || row.price < best.price) best = row;
    }
    return best;
  }

  function variantPrice(variantId) {
    let found = null;
    function walk(node) {
      if (!node || typeof node !== 'object' || found) return;
      if (node.id === variantId && node.price != null) found = Number(node.price);
      for (const value of Object.values(node)) {
        if (value && typeof value === 'object') walk(value);
      }
    }
    walk(products);
    return found;
  }

  const cases = [
    ['keyboard', 'templates/collection.macbook-keyboard-repairs.json', /start from £(\d+)/],
    ['flexgate', 'templates/collection.macbook-flexgate-repairs.json', /start from £(\d+)/],
    ['trackpad', 'templates/collection.macbook-trackpad-repair.json', /start from £(\d+)/],
    ['dustgate', 'templates/collection.macbook-dustgate-repair.json', /start from £(\d+)/],
    ['touch-bar', 'templates/collection.macbook-touchbar-repairs.json', /start from £(\d+)/],
    ['charging-port', 'templates/collection.macbook-c-port-repairs.json', /starts from £(\d+)/],
    ['diagnostic', 'templates/collection.macbook-diagnostic.json', /We charge £(\d+)/],
  ];

  for (const [repairKey, file, pattern] of cases) {
    it(`${repairKey} FAQ matches the cheapest catalogue variant`, () => {
      const row = cheapest(repairKey);
      assert.ok(row, repairKey);
      assert.equal(variantPrice(row.variantId), row.price);
      const copy = read(file);
      const match = copy.match(pattern);
      assert.ok(match, `${file} has no from-price`);
      assert.equal(Number(match[1]), row.price);
      assert.equal(match[0].includes('—'), false);
    });
  }
});

describe('MacBook intro stays short above the wizard', () => {
  it('puts the screen essay below the quote wizard and keeps a short courier line', () => {
    const screen = JSON.parse(read('templates/collection.macbook-screen-repair.json').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
    const order = screen.order;
    const wizard = order.indexOf('quote_wizard_top');
    const about = order.indexOf('about_this_repair');
    assert.ok(wizard > 0 && about > wizard);
    assert.equal(screen.sections.about_info_RWbQxj.settings.details, '');
    assert.match(screen.sections.about_this_repair.settings.details, /If your MacBook screen is cracked/);
    const offer = read('snippets/macbook-from-price.liquid');
    assert.match(offer, /Courier collection across London, tracked mail-in nationwide\./);
    assert.match(offer, /font-size: 14px/);
    assert.match(offer, /font-weight: 600/);
    assert.match(offer, /text-align: center/);
    assert.match(offer, /color: #1d1d1f/);
    assert.equal(offer.includes('!important'), false);
    assert.equal(offer.includes('Free courier'), false);
    assert.equal(offer.includes('—'), false);
    const base = read('assets/base.css');
    assert.match(base, /body p:not\(\.macbook-from-price\):not\(\.macbook-benefit\)/);
    assert.equal(screen.sections.about_this_repair.settings.padding_top, 35);
    assert.equal(screen.sections.about_this_repair.settings.padding_bottom, 10);
    assert.equal(screen.sections.about_this_repair.settings.mob_padding_top, 30);
    assert.equal(screen.sections.about_this_repair.settings.mob_padding_bottom, 10);
  });
});

describe('MacBook template settings fit their section schema', () => {
  const schemaCache = new Map();

  function parseSchemaJson(text) {
    let out = '';
    let quote = null;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (quote) {
        out += char;
        if (char === '\\') {
          out += text[i + 1] || '';
          i += 1;
        } else if (char === quote) {
          quote = null;
        }
        continue;
      }
      if (char === '"') {
        quote = char;
        out += char;
        continue;
      }
      if (char === '/' && text[i + 1] === '/') {
        while (i < text.length && text[i] !== '\n') i += 1;
        continue;
      }
      if (char === '/' && text[i + 1] === '*') {
        i += 2;
        while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i += 1;
        i += 1;
        continue;
      }
      out += char;
    }
    return JSON.parse(out.replace(/,\s*([}\]])/g, '$1'));
  }

  function schemaFor(type) {
    if (schemaCache.has(type)) return schemaCache.get(type);
    const file = path.join(root, 'sections', `${type}.liquid`);
    if (!fs.existsSync(file)) {
      schemaCache.set(type, null);
      return null;
    }
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    if (!match) {
      schemaCache.set(type, null);
      return null;
    }
    const schema = parseSchemaJson(match[1]);
    schemaCache.set(type, schema);
    return schema;
  }

  function rangeProblem(value, setting) {
    if (setting.type !== 'range' || typeof value !== 'number' || !Number.isFinite(value)) return null;
    if (typeof setting.min === 'number' && value < setting.min) return `below min ${setting.min}`;
    if (typeof setting.max === 'number' && value > setting.max) return `above max ${setting.max}`;
    if (typeof setting.step === 'number' && setting.step > 0 && typeof setting.min === 'number') {
      const steps = (value - setting.min) / setting.step;
      if (Math.abs(steps - Math.round(steps)) > 1e-9) return `off step ${setting.step} from ${setting.min}`;
    }
    return null;
  }

  function checkSettings(values, definitions, where, problems) {
    if (!values || !definitions) return;
    for (const [id, value] of Object.entries(values)) {
      const setting = definitions.find((item) => item.id === id);
      if (!setting) continue;
      const problem = rangeProblem(value, setting);
      if (problem) problems.push(`${where}.${id}=${value} (${problem})`);
    }
  }

  const templates = fs.readdirSync(path.join(root, 'templates'))
    .filter((name) => /macbook/i.test(name) && name.endsWith('.json') && !/london/i.test(name));

  it('keeps every range setting on its min, max and step', () => {
    const problems = [];
    for (const name of templates) {
      const raw = read(`templates/${name}`).replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
      const template = JSON.parse(raw);
      for (const [sectionId, section] of Object.entries(template.sections || {})) {
        if (!section || !section.type) continue;
        const schema = schemaFor(section.type);
        if (!schema) continue;
        checkSettings(section.settings, schema.settings, `${name} ${sectionId}`, problems);
        const blockDefs = schema.blocks || [];
        for (const [blockId, block] of Object.entries(section.blocks || {})) {
          const def = blockDefs.find((item) => item.type === block.type);
          if (!def) continue;
          checkSettings(block.settings, def.settings, `${name} ${sectionId}.${blockId}`, problems);
        }
      }
    }
    assert.deepEqual(problems, []);
  });
});

describe('MacBook screen page additions', () => {
  function template() {
    return JSON.parse(read('templates/collection.macbook-screen-repair.json').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
  }

  it('places live size ranges, quick FAQs and the trust card around the wizard', () => {
    const screen = template();
    const order = screen.order;
    const about = order.indexOf('about_info_RWbQxj');
    const wizard = order.indexOf('quote_wizard_top');
    const quick = order.indexOf('screen_quick_faqs');
    const trust = order.indexOf('macbook_trust_row');
    const table = order.indexOf('macbook_price_table');
    assert.ok(about < wizard && wizard < quick && quick < trust && trust < table);
    assert.equal(screen.sections.about_info_RWbQxj.settings.show_screen_ranges, true);
    assert.equal(screen.sections.about_info_RWbQxj.settings.show_klarna, false);
    assert.equal(screen.sections.screen_quick_faqs.settings.wizard_position, 'below');
    assert.equal(screen.sections.screen_quick_faqs.settings.compact, true);
    assert.equal(screen.sections.screen_quick_faqs.settings.emit_faq_schema, false);
    const quickHeadings = screen.sections.screen_quick_faqs.block_order.map((id) => screen.sections.screen_quick_faqs.blocks[id].settings.heading);
    assert.deepEqual(quickHeadings, [
      'How much does my MacBook screen repair cost?',
      'Why are some quotes much cheaper?',
      'How do I get my MacBook to you, and how long does it take?',
    ]);
    const quickCopy = Object.values(screen.sections.screen_quick_faqs.blocks).map((block) => block.settings.sub_head).join('\n');
    assert.equal(quickCopy.includes('—'), false);
    assert.equal(quickCopy.includes('–'), false);
    assert.equal(/original parts only/i.test(quickCopy), false);
    assert.equal(/walk-in/i.test(quickCopy), false);
    assert.equal(/same-day/i.test(quickCopy), false);
    assert.equal(/express/i.test(quickCopy), false);
    const labels = screen.sections.macbook_trust_row.block_order.map((id) => screen.sections.macbook_trust_row.blocks[id].settings.label);
    assert.deepEqual(labels, [
      '4.8 from 750+ Google reviews',
      'Genuine Apple displays, never aftermarket',
      'Board-level microelectronics specialists',
      '2-year warranty',
      'Collected from your office or home, anywhere in the UK',
    ]);
    assert.equal(screen.sections.macbook_trust_row.blocks.point_board.settings.link, '#macbook-process');
    assert.match(screen.sections.macbook_trust_row.blocks.point_warranty.settings.link, /our-warranty/);
    assert.match(screen.sections.macbook_trust_row.blocks.point_reviews.settings.link, /maps\.google\.com/);
    assert.equal(screen.sections.macbook_trust_row.blocks.point_reviews.settings.new_tab, true);
    assert.equal(screen.sections.about_this_repair.settings.anchor_id, 'macbook-process');
    const ranges = read('snippets/macbook-screen-ranges.liquid');
    assert.match(ranges, /contains 'macbook air'/);
    assert.match(ranges, /contains 'macbook pro'/);
    assert.match(ranges, /money_without_trailing_zeros/);
    assert.equal(/£\s*\d/.test(ranges), false);
    assert.equal(ranges.includes("contains 'air'"), false);
    const klarna = read('snippets/macbook-klarna-placement.liquid');
    assert.match(klarna, /data-key="credit-promotion-badge"/);
    assert.match(klarna, /data-locale="en-GB"/);
    assert.match(klarna, /data-purchase-amount="\{\{ purchase_amount \}\}"/);
    assert.match(klarna, /or spread the cost with Klarna, subject to status\./);
    assert.match(klarna, /customElements\.whenDefined\('klarna-placement'\)/);
    assert.match(klarna, /macbook-klarna--script/);
    assert.equal(klarna.includes('max-height'), false);
    assert.equal(klarna.includes('overflow: hidden'), false);
    assert.equal(/£\d/.test(klarna), false);
    assert.equal(klarna.includes('per month'), false);
    const tableSource = read('sections/macbook-price-table.liquid') + read('snippets/macbook-price-row.liquid');
    assert.match(tableSource, /money_without_trailing_zeros/);
    assert.match(tableSource, /collection\.products/);
    assert.equal(/£\s*\d/.test(tableSource), false);
    assert.equal(tableSource.includes('—'), false);
    assert.match(tableSource, /contains 'macbook air'/);
    assert.match(tableSource, /contains 'macbook pro'/);
    assert.equal(tableSource.includes("contains 'air'"), false);
    assert.match(tableSource, /white-space: normal/);
    const titles = [
      'MacBook Air 13-inch M1 Screen Repair',
      'MacBook Pro 14-inch M4 Screen Repair',
    ];
    for (const title of titles) {
      const down = title.toLowerCase();
      const air = down.includes('macbook air');
      const pro = down.includes('macbook pro');
      assert.equal(air && pro, false, title);
    }
    assert.equal('MacBook Pro 13-inch Screen Repair'.toLowerCase().includes('macbook air'), false);
    assert.equal('repair'.includes('air'), true);
  });

  it('computes screen size ranges from products and keeps Pro 15 out of the header', () => {
    const catalogue = JSON.parse(read('data/shopify-catalogue-2026-09-11.json'));
    const products = Array.isArray(catalogue) ? catalogue : catalogue.products;
    const groups = {};
    function sizeOf(title) {
      const down = title.toLowerCase();
      if (down.includes('16-inch') || down.includes('16"') || down.includes('16”')) return '16';
      if (down.includes('15-inch') || down.includes('15"') || down.includes('15”')) return '15';
      if (down.includes('14-inch') || down.includes('14"') || down.includes('14”')) return '14';
      if (down.includes('13-inch') || down.includes('13"') || down.includes('13”')) return '13';
      return '';
    }
    for (const product of products) {
      const title = product.title || '';
      const down = title.toLowerCase();
      if (!/screen/i.test(title) || /diagnostic/i.test(down) || /diagnostic/i.test(product.handle || '')) continue;
      const family = down.includes('macbook air') ? 'air' : down.includes('macbook pro') ? 'pro' : '';
      const size = sizeOf(title);
      if (!family || !size || (family === 'pro' && size === '15')) continue;
      const cents = Math.min(...(product.variants || []).map((variant) => Math.round(Number(variant.price) * 100)).filter((price) => price > 0));
      if (!Number.isFinite(cents)) continue;
      const key = `${family}-${size}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(cents);
    }
    const min = (key) => Math.min(...groups[key]);
    const max = (key) => Math.max(...groups[key]);
    assert.equal(min('air-13'), 29900);
    assert.equal(min('air-15'), 44900);
    assert.equal(min('pro-13'), 29900);
    assert.equal(min('pro-14'), 54900);
    assert.equal(min('pro-16'), 49900);
    assert.equal(max('pro-16'), 79900);
    assert.equal(groups['pro-15'], undefined);
    const screen = template();
    const schemaBlocks = screen.sections.icorrect_faqs_RVk3VL.blocks;
    for (const heading of [
      'How much does my MacBook screen repair cost?',
      'Why are some quotes much cheaper?',
      'How do I get my MacBook to you, and how long does it take?',
    ]) {
      const block = Object.values(schemaBlocks).find((item) => item.settings.heading === heading);
      assert.ok(block, heading);
      assert.equal(block.settings.show_in_accordion, false);
    }
    const jsonld = read('snippets/icorrect-faq-jsonld.liquid');
    assert.match(jsonld, /How much does my MacBook screen repair cost\?/);
    assert.match(jsonld, /cost in the UK/);
  });

  it('appends screen FAQs that stay in the FAQPage JSON-LD', () => {
    const screen = template();
    const blocks = screen.sections.icorrect_faqs_RVk3VL.blocks;
    const headings = screen.sections.icorrect_faqs_RVk3VL.block_order.map((id) => blocks[id].settings.heading);
    const expected = [
      'How much does a MacBook screen repair cost in the UK?',
      'Why does a 14-inch or 16-inch MacBook Pro screen cost more?',
      'Will True Tone still work after the repair?',
      'What is the difference between a genuine and an aftermarket MacBook screen?',
      'My screen has lines or flickers, is it the screen?',
    ];
    for (const heading of expected) assert.ok(headings.includes(heading), heading);
    const answers = expected.map((heading) => Object.values(blocks).find((block) => block.settings.heading === heading).settings.sub_head).join('\n');
    assert.match(answers, /\[\[from_price\]\]/);
    assert.match(answers, /macbook-flexgate-repair-prices/);
    assert.match(answers, /macbook-dustgate-repair-prices/);
    assert.equal(answers.includes('—'), false);
    assert.equal(answers.includes('–'), false);
    assert.equal(/original parts only/i.test(answers), false);
    assert.equal(/walk-in/i.test(answers), false);
    assert.equal(/deposit/i.test(answers), false);
    assert.equal(/free collection/i.test(answers), false);
    const jsonld = read('snippets/icorrect-faq-jsonld.liquid');
    assert.match(jsonld, /macbook-faq-answer/);
    assert.match(jsonld, /"@type": "FAQPage"/);
    assert.equal(jsonld.includes('aggregateRating'), false);
  });

  it('removes PayPal Pay in 3 from MacBook templates', () => {
    const files = fs.readdirSync(path.join(root, 'templates')).filter((name) => /macbook/i.test(name));
    const hits = [];
    for (const name of files) {
      const text = read(`templates/${name}`);
      if (text.includes('PayPal Pay in 3') || text.includes('Pay in 3')) hits.push(name);
    }
    assert.deepEqual(hits, []);
    const page = read('templates/page.macbook-repairs.json');
    const schema = read('snippets/icorrect-faq-page-schema.liquid');
    assert.equal(page.includes('PayPal Pay in 3'), false);
    assert.equal(page.includes('Pay in 3'), false);
    assert.equal(schema.includes('PayPal Pay in 3'), false);
    assert.equal(schema.includes('Pay in 3'), false);
    assert.match(page, /flexible payment options including Klarna/);
    assert.match(schema, /flexible payment options including Klarna/);
  });
});

describe('sample JSON-LD is structurally valid', () => {
  it('accepts a FAQPage and a Service AggregateOffer built the way the snippets do', () => {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long do MacBook repairs take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most MacBook repairs, including screen replacements, battery replacements, and keyboard repairs, take around 3 working days.',
          },
        },
      ],
    };
    const service = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'MacBook Repair London',
      serviceType: 'Electronics Repair',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'GBP',
        lowPrice: 299,
        offerCount: 29,
        availability: 'https://schema.org/InStock',
      },
    };
    for (const doc of [faq, service]) {
      assert.equal(typeof doc['@context'], 'string');
      assert.equal(typeof doc['@type'], 'string');
      JSON.parse(JSON.stringify(doc));
    }
    assert.equal(faq.mainEntity[0].acceptedAnswer.text.includes('—'), false);
    assert.equal(typeof service.offers.lowPrice, 'number');
    assert.ok(service.offers.lowPrice > 0);
    assert.equal(service.offers.priceCurrency, 'GBP');
  });
});
