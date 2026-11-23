/**
 * Phase 1 quote wizard regression tests:
 * - Parts quality read from Shopify product title with safe model fallback
 * - Walk-in dates: 3pm London cutoff, weekend skip, same-day theme toggle
 * - Walk-in afternoon mode: switches to PM via callback without clicking/scrolling
 * - Walk-in journey: repair and diagnostic routes
 * - Courier card title: Free courier collection only when charge is £0
 * - Drop-off cart: skips homeAddress SKU, skips shipping zip prefill, includes drop-off slot in Order summary
 * - Email quote snapshot: reads both .qw-jr-* and .qw-journey-* step classes
 * - Sticky CTA: observes #qwBookBtn and respects _postcodeResolved
 *
 * Run: node --test scripts/courier/quote-wizard-phase1.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '../..');
const wizardJs = fs.readFileSync(path.join(ROOT, 'assets/quote-wizard.js'), 'utf8');
const walkinJs = fs.readFileSync(path.join(ROOT, 'assets/quote-wizard-walkin.js'), 'utf8');
const layoutJs = fs.readFileSync(path.join(ROOT, 'assets/quote-wizard-layout.js'), 'utf8');
const wizardCss = fs.readFileSync(path.join(ROOT, 'assets/quote-wizard.css'), 'utf8');
const wizardLiquid = fs.readFileSync(path.join(ROOT, 'sections/quote-wizard.liquid'), 'utf8');

function sliceFn(src, startNeedle, endNeedle) {
  const start = src.indexOf(startNeedle);
  const end = src.indexOf(endNeedle, start + 1);
  assert.ok(start >= 0 && end > start, `missing ${startNeedle} .. ${endNeedle}`);
  return src.slice(start, end);
}

function loadWalkin() {
  const sandbox = { window: {} };
  vm.runInNewContext(walkinJs, sandbox);
  return sandbox.window.ICorrectWalkin;
}

describe('partsClaimLabel reads parts quality from the Shopify product title', () => {
  const src = sliceFn(wizardJs, 'function isAppleSiliconModel(model)', '/* [2.2] Device-specific badge builders */');
  const { partsClaimLabel } = new Function(`${src}\nreturn { partsClaimLabel };`)();

  it('recognises genuine displays across MacBook, iPhone and iPad titles', () => {
    assert.equal(partsClaimLabel('macbook', "MacBook Pro 14-inch 'M1 Pro/Max' A2442 (2021)", "MacBook Pro 14-inch 'M1 Pro/Max' A2442 (2021) Screen Repair (Genuine Display)"), 'Genuine Apple displays');
    assert.equal(partsClaimLabel('iphone', 'iPhone 15 Pro', 'iPhone 15 Pro Screen Repair (Genuine OLED)'), 'Genuine Apple displays');
    assert.equal(partsClaimLabel('ipad', 'iPad Air 11 M2 (2024)', 'iPad Air 11 M2 (2024) Display Repair (Genuine Liquid Retina Display)'), 'Genuine Apple displays');
    assert.equal(partsClaimLabel('ipad', 'iPad Pro 13 M4 (2024)', 'iPad Pro 13 M4 (2024) Display Repair (Genuine XDR Display)'), 'Genuine Apple displays');
    assert.equal(partsClaimLabel('ipad', 'iPad 10th Gen (2022)', 'iPad 10th Gen (2022) Display Repair (Genuine LCD)'), 'Genuine Apple displays');
  });

  it('reads Genuine Battery, Original Specification and Aftermarket directly from the title', () => {
    assert.equal(partsClaimLabel('iphone', 'iPhone 15', 'iPhone 15 Battery Replacement (Genuine Battery)'), 'Genuine Apple battery');
    assert.equal(partsClaimLabel('macbook', "MacBook Air 13-inch 'M3' A3113 (2024)", "MacBook Air 13-inch 'M3' A3113 (2024) Battery Replacement (Original Specification)"), 'Original specification');
    assert.equal(partsClaimLabel('iphone', 'iPhone 15', 'iPhone 15 Aftermarket Screen Repair (Soft OLED)'), 'Premium aftermarket');
    assert.equal(partsClaimLabel('iphone', 'iPhone 11', 'iPhone 11 Battery (Premium Aftermarket Battery)'), 'Premium aftermarket');
  });

  it('does not falsely claim Genuine Apple displays when the Shopify title has no qualifier', () => {
    assert.equal(partsClaimLabel('watch', 'Apple Watch Series 10 42MM', 'Apple Watch Series 10 42MM Display Screen Repair'), 'Original specification');
    assert.equal(partsClaimLabel('ipad', 'iPad Pro 11 1st Gen (2019)', 'iPad Pro 11 1st Gen (2019) Display Repair'), 'Original specification');
    assert.equal(partsClaimLabel('macbook', 'MacBook Pro 13-inch A1708 (2016-2017)', ''), 'Original specification');
    assert.equal(partsClaimLabel('macbook', "MacBook Pro 14-inch 'M3'", ''), 'Original parts');
  });
});

describe('ICorrectWalkin dates, 3pm cutoff, same-day toggle, afternoon auto-PM and diagnostic journey', () => {
  const walkin = loadWalkin();
  const baseTomorrow = [{ iso: '2026-11-24', date: new Date(2026, 10, 24), headline: 'Tomorrow' }];
  const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  it('offers Today on a weekday before 3pm London time when enabled', () => {
    const mon259 = { date: new Date(2026, 10, 23), hour: 14.99 };
    const res = walkin.dates(baseTomorrow, mon259, isoOf, { allowSameDay: true });
    assert.equal(res[0].iso, '2026-11-23');
    assert.equal(res[0].headline, 'Today');
  });

  it('hides Today at or after 3pm London time', () => {
    const mon300 = { date: new Date(2026, 10, 23), hour: 15 };
    const res = walkin.dates(baseTomorrow, mon300, isoOf, { allowSameDay: true });
    assert.equal(res[0].iso, '2026-11-24');
  });

  it('hides Today when same-day drop-off is switched off in theme settings', () => {
    const mon10am = { date: new Date(2026, 10, 23), hour: 10 };
    const res = walkin.dates(baseTomorrow, mon10am, isoOf, { allowSameDay: false });
    assert.equal(res[0].iso, '2026-11-24');
  });

  it('hides Today on weekends', () => {
    const sat10am = { date: new Date(2026, 10, 21), hour: 10 };
    const res = walkin.dates(baseTomorrow, sat10am, isoOf, { allowSameDay: true });
    assert.equal(res[0].iso, '2026-11-24');
  });

  it('after midday switches AM to PM via onAutoPM without invoking button.click()', () => {
    let clicked = 0;
    let autoPmCalled = 0;
    const makeBtn = (part, active) => {
      const classes = new Set(active ? ['active'] : []);
      const attrs = { 'data-part': part };
      const detailEl = { textContent: '' };
      return {
        disabled: false,
        classList: {
          add: (c) => classes.add(c),
          remove: (c) => classes.delete(c),
          contains: (c) => classes.has(c),
          toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)),
        },
        getAttribute: (k) => attrs[k] || '',
        setAttribute: (k, v) => { attrs[k] = v; },
        removeAttribute: (k) => { delete attrs[k]; },
        querySelector: () => detailEl,
        click: () => { clicked++; },
      };
    };
    const am = makeBtn('AM', true);
    const pm = makeBtn('PM', false);
    const panel = {
      querySelector: (sel) => (sel === '.qw-section-label' ? { textContent: '' } : null),
      querySelectorAll: () => [am, pm],
    };

    walkin.applyMode(panel, {
      workshop: true,
      selected: { iso: '2026-11-23', date: new Date(2026, 10, 23) },
      todayIso: '2026-11-23',
      hour: 13.5,
      onAutoPM: () => { autoPmCalled++; },
    });

    assert.equal(clicked, 0, 'must not trigger synthetic click');
    assert.equal(autoPmCalled, 1);
    assert.equal(am.disabled, true);
    assert.equal(am.classList.contains('active'), false);
    assert.equal(pm.classList.contains('active'), true);
  });

  it('builds a diagnostic journey with quoteDate for walk-in diagnostic orders', () => {
    const drop = new Date(2026, 10, 23);
    const addWorkingDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const fmt = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const res = walkin.journey({ drop, bench: 2, turnaround: '2 working days', note: '', diagnostic: true, fmt, addWorkingDays });
    assert.equal(res.kind, 'diagnostic');
    assert.equal(res.returnDate, null);
    assert.ok(res.quoteDate instanceof Date);
    assert.equal(res.steps[1].title, 'We diagnose & email your quote');
  });
});

describe('quote wizard phase 1 contracts in JS, CSS and Liquid', () => {
  it('Liquid exposes enable_same_day_drop_off theme setting to WIZARD_CFG.sameDayDropOff', () => {
    assert.match(wizardLiquid, /sameDayDropOff:/);
    assert.match(wizardLiquid, /"id":\s*"enable_same_day_drop_off"/);
  });

  it('Courier card title defaults to Courier collection and is dynamically painted', () => {
    assert.match(wizardJs, /function paintCourierCard\(quote\)/);
    assert.match(wizardJs, /free \? 'Free courier collection' : 'Courier collection'/);
    assert.doesNotMatch(wizardJs, /qw-delivery-title qw-opt-name">Free courier collection</);
  });

  it('Walk-in cart skips homeAddress SKU, skips shipping zip prefill, and includes drop-off slot in Order summary', () => {
    const cart = sliceFn(wizardJs, 'function buildCartItems()', 'function orderSummaryText(props)');
    const summary = sliceFn(wizardJs, 'function orderSummaryText(props)', 'function getShopifyRoot()');
    assert.match(cart, /if \(homeVid && svcKind !== 'workshop'\)/);
    assert.match(summary, /add\('Drop-off date', 'Drop-off Date'\)/);
    assert.match(summary, /add\('Drop-off window', 'Drop-off Window'\)/);
    assert.match(wizardJs, /var isWalkin = items\[0\] && items\[0\]\.properties && items\[0\]\.properties\['Service Type'\] === 'Walk-in'/);
  });

  it('readQuoteSnapshot supports both .qw-jr-* and .qw-journey-* step classes', () => {
    const snap = sliceFn(wizardJs, 'function readQuoteSnapshot()', 'function wireEmailQuote(');
    assert.match(snap, /\.qw-jr-step, \.qw-journey-step/);
    assert.match(snap, /\.qw-jr-title, \.qw-journey-title/);
    assert.match(snap, /\.qw-jr-meta, \.qw-journey-meta/);
  });

  it('setupStickyCTA observes #qwBookBtn and guards on _postcodeResolved', () => {
    const sticky = sliceFn(wizardJs, 'function setupStickyCTA(price)', 'function destroyStickyCTA()');
    assert.match(sticky, /document\.getElementById\('qwBookBtn'\)/);
    assert.match(sticky, /_postcodeResolved && !entry\.isIntersecting/);
  });

  it('Summary flex ordering covers #qwEmailPanel, #qwCAcc, #qwIntercomBtn, #qwTrustToggle, and 44px tap targets', () => {
    assert.match(wizardCss, /#qwSummary #qwEmailPanel\{order:9/);
    assert.match(wizardCss, /#qwSummary #qwCAcc\{order:11/);
    assert.match(wizardCss, /#qwSummary #qwIntercomBtn\{order:12/);
    assert.match(wizardCss, /#qwSummary #qwTrustToggle\{order:6/);
    assert.match(wizardCss, /\.qw-back\{[^}]*min-height:44px/);
    assert.match(wizardCss, /\.qw-crumb-btn\{[^}]*min-height:44px/);
    assert.match(wizardCss, /\.qw-price-warr\{/);
    assert.match(layoutJs, /trustBtn\.id = 'qwTrustToggle'/);
    assert.match(layoutJs, /if \(acc\) sum\.appendChild\(acc\)/);
  });
});
