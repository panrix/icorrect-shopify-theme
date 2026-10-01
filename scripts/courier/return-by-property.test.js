/**
 * The date on the journey ETA is the promise stored on the order.
 * Run: node --test scripts/courier/return-by-property.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const wizard = fs.readFileSync(
  path.join(__dirname, '../../sections/quote-wizard.liquid'),
  'utf8'
);

function sliceFn(startNeedle, endNeedle) {
  const start = wizard.indexOf(startNeedle);
  const end = wizard.indexOf(endNeedle);
  assert.ok(start >= 0 && end > start, `missing ${startNeedle}`);
  return wizard.slice(start, end);
}

describe('journey ETA date is the calendar day that gets stored', () => {
  const src = sliceFn('function formatJourneyDate(d)', 'function londonWall(now)');
  const api = new Function(
    'esc',
    `${src}\nreturn { isoJourneyDate, journeyEtaDateHtml, formatJourneyDate };`
  )(function (value) { return String(value); });

  it('Wednesday 16 Sep 2026 is 2026-09-16 and the label the client sees', () => {
    const d = new Date(2026, 8, 16);
    assert.equal(api.isoJourneyDate(d), '2026-09-16');
    assert.equal(api.formatJourneyDate(d), 'Wed 16 Sep');
    const html = api.journeyEtaDateHtml(d);
    assert.match(html, /data-iso="2026-09-16"/);
    assert.match(html, />Wed 16 Sep</);
    assert.match(html, /class="qw-journey-eta-date"/);
  });

  it('an empty date does not invent an ISO value', () => {
    assert.equal(api.isoJourneyDate(null), '');
  });
});

describe('book copies the on-screen date into the order recap', () => {
  const cart = sliceFn('function buildCartItems()', 'function orderSummaryText(props)');
  const summary = sliceFn('function orderSummaryText(props)', 'function getShopifyRoot()');

  it('reads the visible journey date, not a collection-slot button', () => {
    assert.match(cart, /#qwJourney:not\(\[hidden\]\) \.qw-journey-eta-date/);
    assert.match(cart, /getAttribute\('data-iso'\)/);
    const readAt = cart.indexOf('qw-journey-eta-date');
    const summaryAt = cart.indexOf("properties['Order summary']");
    assert.ok(readAt >= 0 && summaryAt > readAt, 'promise date must be set before Order summary');
  });

  it('known repair stores Return by and diagnostic stores Quote by', () => {
    assert.match(cart, /S\.route === 'diagnostic' \? 'Quote by' : 'Return by'/);
  });

  it('order summary prints both lines when the property is present', () => {
    assert.match(summary, /add\('Return by', 'Return by'\)/);
    assert.match(summary, /add\('Quote by', 'Quote by'\)/);
  });

  it('both ETA branches stamp data-iso from the same date helper', () => {
    const render = sliceFn('function renderServiceJourney(kind)', 'function hideServiceJourney()');
    const uses = render.match(/journeyEtaDateHtml\(/g) || [];
    assert.equal(uses.length, 2);
    assert.equal(render.includes('formatJourneyDate(quoteDate)'), false);
    assert.equal(render.includes('formatJourneyDate(model.returnDate)'), false);
  });
});
