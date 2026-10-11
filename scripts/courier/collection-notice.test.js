/**
 * Courier collection address note on the quote result step.
 * Run: node --test scripts/courier/collection-notice.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const js = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/quote-wizard.css'), 'utf8');

function loadNoticeFns() {
  const start = js.indexOf('function formatDisplayPostcode');
  const end = js.indexOf('function collectionNoticePostcode');
  assert.ok(start > 0 && end > start, 'notice helpers missing');
  const chunk = js.slice(start, end);
  return new Function(chunk + '\nreturn { formatDisplayPostcode, shouldShowCollectionNotice };')();
}

const { formatDisplayPostcode, shouldShowCollectionNotice } = loadNoticeFns();

describe('formatDisplayPostcode', () => {
  it('formats a full postcode the way the field shows it', () => {
    assert.equal(formatDisplayPostcode('ec4y 0ay'), 'EC4Y 0AY');
    assert.equal(formatDisplayPostcode('EC4Y0AY'), 'EC4Y 0AY');
    assert.equal(formatDisplayPostcode('  sw11   8bj '), 'SW11 8BJ');
    assert.equal(formatDisplayPostcode('m1 1ae'), 'M1 1AE');
    assert.equal(formatDisplayPostcode('M11AE'), 'M1 1AE');
  });

  it('leaves an incomplete code as typed, uppercased', () => {
    assert.equal(formatDisplayPostcode('EC4Y 0'), 'EC4Y 0');
    assert.equal(formatDisplayPostcode(''), '');
    assert.equal(formatDisplayPostcode('   '), '');
  });
});

describe('shouldShowCollectionNotice', () => {
  const courierQuote = { service: 'courier', outward: 'EC4Y', forcedMailIn: false, band: 'B1' };

  it('shows for a resolved courier postcode', () => {
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'courier', 'EC4Y 0AY'), true);
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'courier', 'ec4y 0ay'), true);
  });

  it('does not treat an unspaced code as the same outward the quote used', () => {
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'courier', 'ec4y0ay'), false);
  });

  it('hides for mail-in, including an outside-London postcode', () => {
    const mail = { service: 'mail-in', outward: 'M1', forcedMailIn: true, band: null };
    assert.equal(shouldShowCollectionNotice(true, mail, 'mailin', 'M1 1AE'), false);
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'mailin', 'EC4Y 0AY'), false);
  });

  it('hides when there is no postcode or the quote is not ready', () => {
    assert.equal(shouldShowCollectionNotice(false, courierQuote, 'courier', 'EC4Y 0AY'), false);
    assert.equal(shouldShowCollectionNotice(true, null, 'courier', 'EC4Y 0AY'), false);
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'courier', ''), false);
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'courier', 'EC4'), false);
  });

  it('hides while the typed outward no longer matches the quote', () => {
    assert.equal(shouldShowCollectionNotice(true, courierQuote, 'courier', 'M1 1AE'), false);
  });
});

describe('result step markup and styles', () => {
  it('places a hidden notice in both result cards, ahead of checkout', () => {
    const marker = '<div class="qw-collect-notice" id="qwCollectionNotice" role="note" hidden></div>';
    const first = js.indexOf(marker);
    const second = js.indexOf(marker, first + 1);
    assert.ok(first > 0 && second > first);
    assert.equal(js.indexOf(marker, second + 1), -1);
    [first, second].forEach((at) => {
      const next = js.indexOf('qwBookBtn', at);
      assert.ok(next > at && next - at < 400);
    });
  });

  it('uses the approved amber callout and Axiforma', () => {
    assert.match(css, /\.qw-collect-notice\s*\{[^}]*background:\s*#FFF7E6/s);
    assert.match(css, /border:\s*1px solid #F5C46B/);
    assert.match(css, /\.qw-collect-notice\s*\{[^}]*border-radius:\s*10px/s);
    assert.match(css, /Axiforma-R/);
    assert.match(css, /#171717/);
    assert.match(css, /display:\s*block/);
  });

  it('keeps the notice copy free of em dashes', () => {
    const copy = js.slice(js.indexOf('Collecting from '), js.indexOf('Collecting from ') + 160);
    assert.match(copy, /Collecting from /);
    assert.match(copy, /Please use this address as your shipping address at checkout\./);
    assert.equal(copy.includes('\u2014'), false);
    assert.equal(copy.includes('\u2013'), false);
  });
});
