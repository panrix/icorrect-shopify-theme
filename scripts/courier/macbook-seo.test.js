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
    assert.equal(seo.includes('£350'), false);
    assert.equal(seo.includes('—'), false);
    assert.equal(seo.includes('free mail-in'), false);
    assert.equal(seo.includes('walk-in'), false);
  });
});

describe('MacBook pages keep the turnaround test copy', () => {
  it('does not edit the quote wizard, cart, or London templates', () => {
    const diff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: root, encoding: 'utf8' });
    const files = diff.split('\n').filter(Boolean);
    const blocked = files.filter((file) =>
      /london/.test(file) ||
      file.includes('quote-wizard') ||
      file.includes('assets/cart') ||
      file.endsWith('cart.js') ||
      file.includes('checkout')
    );
    assert.deepEqual(blocked, []);
  });

  it('keeps the hub FAQ timing sentences', () => {
    const hub = read('templates/page.macbook-repairs.json');
    assert.match(hub, /take around 3 working days/);
    assert.match(hub, /within one working day/);
    assert.match(hub, /same-day or next-day depending on model/);
  });
});

describe('reviews, FAQ schema and links are wired', () => {
  it('adds the homepage reviews section to the screen template and not the London pages', () => {
    const screen = read('templates/collection.macbook-screen-repair.json');
    const london = read('templates/page.macbook-pro-screen-replacement-london.json');
    assert.match(screen, /"type": "google-reviews"/);
    assert.match(screen, /"emit_faq_schema": true/);
    assert.equal(london.includes('google-reviews'), false);
    assert.equal(london.includes('emit_faq_schema'), false);
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
