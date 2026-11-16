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
    assert.equal(offer.includes('Free courier'), false);
    assert.equal(offer.includes('—'), false);
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
