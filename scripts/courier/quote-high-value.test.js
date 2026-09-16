/**
 * High-value convert detect + copy (Lane A diagnostic, Lane B in-stock Pro).
 * Run: node --test scripts/courier/quote-high-value.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const HV = require('../../assets/quote-high-value.js');

const root = path.join(__dirname, '../..');
const liquid = fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/quote-wizard.css'), 'utf8');

function ev(extra) {
  return HV.evaluate(Object.assign({
    device: 'macbook',
    model: 'MacBook Pro 16" M3',
    route: 'diagnostic',
    repairType: 'diagnostic',
    fault: 'Water Damage',
    issue: 'Spilled liquid recently (within 24 hours)',
    band: 'B1',
    repairPrice: 49,
    safan24hOpen: false
  }, extra || {}));
}

describe('evaluate — Lane A high-value diagnostic', () => {
  it('M-series Pro + liquid is Lane A, eats B1 collect, no 24h when Safan is closed', () => {
    const r = ev();
    assert.equal(r.lane, 'A');
    assert.equal(r.highValue, true);
    assert.equal(r.eatCollectEligible, true);
    assert.equal(r.eatCollect, true);
    assert.equal(r.diag24h, false);
    assert.equal(r.includedFast, false);
    assert.equal(r.callDefaultOn, true);
    assert.equal(r.askPrequal, true);
  });

  it('M-series Pro + liquid + Safan open → 24h word-back', () => {
    const r = ev({ safan24hOpen: true });
    assert.equal(r.lane, 'A');
    assert.equal(r.diag24h, true);
  });

  it('does not eat collection on B2–B4 even for an M4 Pro spill', () => {
    assert.equal(ev({ band: 'B2' }).eatCollect, false);
    assert.equal(ev({ band: 'B3' }).eatCollect, false);
    assert.equal(ev({ band: 'B4' }).eatCollect, false);
    assert.equal(ev({ band: 'B2' }).lane, 'A');
  });

  it('M-series Pro won\'t-charge is Lane A but does not eat collect', () => {
    const r = ev({
      fault: 'Battery / Power',
      issue: 'Won\'t charge or charger not recognised'
    });
    assert.equal(r.lane, 'A');
    assert.equal(r.eatCollectEligible, false);
    assert.equal(r.eatCollect, false);
  });

  it('2018 Air spill is diagnostic questions only — not Lane A, never eat collect', () => {
    const r = ev({
      model: 'MacBook Air 13" 2018',
      fault: 'Water Damage',
      issue: 'MacBook was submerged'
    });
    assert.equal(r.lane, null);
    assert.equal(r.highValue, false);
    assert.equal(r.eatCollect, false);
    assert.equal(r.askPrequal, true);
    assert.equal(r.callDefaultOn, false);
  });

  it('Air M3/M4 liquid or dead is Lane A; battery is not', () => {
    const liquid = ev({
      model: 'MacBook Air 13" M3',
      fault: 'Water Damage',
      issue: 'Spilled liquid (more than 24 hours ago)'
    });
    assert.equal(liquid.lane, 'A');
    assert.equal(liquid.eatCollect, false);

    const dead = ev({
      model: 'MacBook Air 15" M4',
      fault: 'Data Recovery',
      issue: 'MacBook dead, need data'
    });
    assert.equal(dead.lane, 'A');

    const battery = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Air 13" M3',
      route: 'repair',
      repairType: 'battery',
      fault: 'Battery / Power',
      issue: 'Battery draining quickly',
      band: 'B1',
      repairPrice: 199
    });
    assert.equal(battery.lane, null);
    assert.equal(battery.askPrequal, false);
  });

  it('iPhone 16 Pro dead and 15 Pro liquid are Lane A and eat B1; iPhone 16 non-Pro does not eat', () => {
    const dead17pro = ev({
      device: 'iphone',
      model: 'iPhone 17 Pro',
      fault: 'Screen / Display',
      issue: 'No display, no response'
    });
    assert.equal(dead17pro.lane, 'A');
    assert.equal(dead17pro.eatCollect, true);

    const dead16pro = ev({
      device: 'iphone',
      model: 'iPhone 16 Pro',
      fault: 'Screen / Display',
      issue: 'No display, no response'
    });
    assert.equal(dead16pro.lane, 'A');
    assert.equal(dead16pro.eatCollect, true);

    const liquid15 = ev({
      device: 'iphone',
      model: 'iPhone 15 Pro Max',
      fault: 'Water Damage',
      issue: 'Spilled liquid recently (within 24 hours)'
    });
    assert.equal(liquid15.lane, 'A');
    assert.equal(liquid15.eatCollect, true);

    const dead16 = ev({
      device: 'iphone',
      model: 'iPhone 16',
      fault: 'Screen / Display',
      issue: 'No display, no response'
    });
    assert.equal(dead16.lane, 'A');
    assert.equal(dead16.eatCollect, false);
  });

  it('iPhone 14 Pro liquid and iPhone 16 Pro battery are not Lane A', () => {
    const old = ev({
      device: 'iphone',
      model: 'iPhone 14 Pro',
      fault: 'Water Damage',
      issue: 'Spilled liquid recently (within 24 hours)'
    });
    assert.equal(old.lane, null);
    assert.equal(old.askPrequal, true);

    const batt = HV.evaluate({
      device: 'iphone',
      model: 'iPhone 16 Pro',
      route: 'repair',
      repairType: 'battery',
      fault: 'Battery / Power',
      issue: 'Battery drains fast',
      band: 'B1',
      repairPrice: 119
    });
    assert.equal(batt.lane, null);
    assert.equal(batt.askPrequal, false);
  });

  it('matches live wizard titles with quoted M-series chips', () => {
    const live = ev({
      model: 'MacBook Pro 14” ‘M4’ A3112 (2024)',
      fault: 'Water Damage',
      issue: 'Spilled liquid recently (within 24 hours)'
    });
    assert.equal(live.lane, 'A');
    assert.equal(live.eatCollect, true);

    const m4max = ev({
      model: 'MacBook Pro 16” ‘M4 Max’ A3186 (2024)',
      fault: 'Water Damage',
      issue: 'Spilled liquid recently (within 24 hours)'
    });
    assert.equal(m4max.lane, 'A');

    const airM3 = ev({
      model: 'MacBook Air 13” ‘M3’ A3113 (2024)',
      fault: 'Water Damage',
      issue: 'Spilled liquid recently (within 24 hours)'
    });
    assert.equal(airM3.lane, 'A');
    assert.equal(airM3.eatCollect, false);

    const air2018 = ev({
      model: 'MacBook Air 13” A1932 (2018-2019)',
      fault: 'Water Damage',
      issue: 'MacBook was submerged'
    });
    assert.equal(air2018.lane, null);
  });

  it('iPad Pro M-series dead is Lane A; does not eat collect', () => {
    const r = ev({
      device: 'ipad',
      model: 'iPad Pro 11" M4',
      fault: 'Power / Charge',
      issue: 'Won\'t turn on'
    });
    assert.equal(r.lane, 'A');
    assert.equal(r.eatCollect, false);
  });
});

describe('evaluate — Lane B in-stock MacBook Pro screen / keyboard', () => {
  it('16" M3 screen ≥£279 in B1/B2 is Lane B with included Fast, no eat-collect flag', () => {
    const r = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Pro 16" M3',
      route: 'repair',
      repairType: 'screen',
      fault: 'Screen / Display',
      issue: 'Cracked or shattered screen',
      band: 'B1',
      repairPrice: 699,
      inStock: true
    });
    assert.equal(r.lane, 'B');
    assert.equal(r.highValue, true);
    assert.equal(r.includedFast, true);
    assert.equal(r.eatCollect, false);
    assert.equal(r.diag24h, false);
    assert.equal(r.callDefaultOn, true);
    assert.equal(r.askPrequal, false);
  });

  it('keyboard ≥£279 in B2 is Lane B; battery and cheap screen are not', () => {
    const kb = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Pro 14" M4',
      route: 'repair',
      repairType: 'keyboard',
      fault: 'Keyboard / Trackpad',
      issue: 'Keys not responding',
      band: 'B2',
      repairPrice: 349
    });
    assert.equal(kb.lane, 'B');
    assert.equal(kb.includedFast, true);

    const batt = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Pro 16" M3',
      route: 'repair',
      repairType: 'battery',
      fault: 'Battery / Power',
      issue: 'Battery draining quickly',
      band: 'B1',
      repairPrice: 249
    });
    assert.equal(batt.lane, null);

    const cheap = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Pro 14" M3',
      route: 'repair',
      repairType: 'screen',
      fault: 'Screen / Display',
      issue: 'Cracked or shattered screen',
      band: 'B1',
      repairPrice: 278
    });
    assert.equal(cheap.lane, null);
  });

  it('Lane B waits for B1/B2 before giving tomorrow away', () => {
    const unknown = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Pro 16" M3',
      route: 'repair',
      repairType: 'screen',
      fault: 'Screen / Display',
      issue: 'Cracked or shattered screen',
      band: null,
      repairPrice: 699
    });
    assert.equal(unknown.laneBCandidate, true);
    assert.equal(unknown.includedFast, false);
    assert.equal(unknown.lane, 'B');

    const outer = HV.evaluate({
      device: 'macbook',
      model: 'MacBook Pro 16" M3',
      route: 'repair',
      repairType: 'screen',
      fault: 'Screen / Display',
      issue: 'Cracked or shattered screen',
      band: 'B3',
      repairPrice: 699
    });
    assert.equal(outer.lane, null);
    assert.equal(outer.includedFast, false);
  });
});

describe('withEatCollect', () => {
  it('zeros a B1 courier adjustment only when eatCollect is on', () => {
    const quote = { service: 'courier', band: 'B1', adjustment: 25, tier: 'paid' };
    const eaten = HV.withEatCollect(quote, { eatCollect: true });
    assert.equal(eaten.adjustment, 0);
    assert.equal(eaten.tier, 'free');
    assert.equal(HV.withEatCollect(quote, { eatCollect: false }).adjustment, 25);
    assert.equal(HV.withEatCollect({ service: 'courier', band: 'B2', adjustment: 25 }, { eatCollect: true }).adjustment, 25);
  });
});

describe('copy + prequal HTML', () => {
  it('Lane A leads with collect today and does not invent a Back Market £', () => {
    const html = HV.diagnosticCardIntroHtml({ copy: 'Liquid on the board.' }, ev({ safan24hOpen: true }));
    assert.match(html, /We can collect it today/);
    assert.match(html, /afternoon/i);
    assert.match(html, /24 hours/);
    assert.match(html, /qwHvCall/);
    assert.match(html, /checked/);
    assert.doesNotMatch(html, /£2,?500|2500/);
    assert.doesNotMatch(html, /Book a Diagnostic/);
  });

  it('ordinary diagnostic keeps the 3 working day fee card', () => {
    const html = HV.diagnosticCardIntroHtml(
      { copy: 'We need to open it.' },
      ev({ model: 'MacBook Air 13" 2018' })
    );
    assert.match(html, /Book a Diagnostic/);
    assert.match(html, /diagnose within 3 working days/);
    assert.doesNotMatch(html, /We can collect it today/);
  });

  it('Safan closed drops 24h to next working day', () => {
    const html = HV.diagnosticCardIntroHtml({ copy: 'Dead board.' }, ev({ safan24hOpen: false }));
    assert.match(html, /next working day/);
    assert.doesNotMatch(html, /word back in 24 hours/i);
  });

  it('Lane B repair intro is collect today, not a diagnostic fee', () => {
    const html = HV.repairCardIntroHtml(
      { title: 'MacBook Pro 16" M3 Screen Repair', copy: 'Genuine display.' },
      HV.evaluate({
        device: 'macbook',
        model: 'MacBook Pro 16" M3',
        route: 'repair',
        repairType: 'screen',
        fault: 'Screen / Display',
        issue: 'Cracked or shattered screen',
        band: 'B1',
        repairPrice: 699
      })
    );
    assert.match(html, /We can collect it today/);
    assert.match(html, /qwHvCall/);
    assert.match(html, /MacBook Pro 16&quot; M3 Screen Repair/);
  });

  it('prequal sits on the card and never includes a passcode field', () => {
    const html = HV.prequalHtml(ev());
    assert.match(html, /qwHvApple/);
    assert.match(html, /Has it been to the Apple Store/);
    assert.match(html, /data important/i);
    assert.match(html, /serial/i);
    assert.doesNotMatch(html, /passcode/i);
    assert.doesNotMatch(html, /required/);
  });

  it('readPrequal maps Apple / data / serial / call without blocking empties', () => {
    const rootEl = {
      querySelector: function (sel) {
        const map = {
          '#qwHvAppleYes': { checked: true },
          '#qwHvAppleNo': { checked: false },
          '#qwHvAppleUnknown': { checked: false },
          '#qwHvAppleOutcome': { value: 'refused' },
          '#qwHvDataYes': { checked: true },
          '#qwHvDataNo': { checked: false },
          '#qwHvDataUnknown': { checked: false },
          '#qwHvSerial': { value: 'C02ABC123' },
          '#qwHvCall': { checked: true }
        };
        return map[sel] || null;
      }
    };
    const p = HV.readPrequal(rootEl);
    assert.equal(p.apple_diagnosed, 'yes');
    assert.equal(p.apple_outcome, 'refused');
    assert.equal(p.data_important, 'yes');
    assert.equal(p.serial, 'C02ABC123');
    assert.equal(p.call_requested, true);
  });
});

describe('wizard wiring (liquid stays a thin hook)', () => {
  it('loads quote-high-value.js before the wizard IIFE', () => {
    assert.match(liquid, /quote-high-value\.js['"]\s*\|\s*asset_url/);
    const src = liquid.indexOf('quote-high-value.js');
    const iife = liquid.lastIndexOf('(function() {');
    assert.ok(src !== -1 && iife !== -1 && src < iife);
  });

  it('exposes a fail-closed Safan 24h checkbox on CFG', () => {
    assert.match(liquid, /"id":\s*"safan_24h_open"/);
    assert.match(liquid, /safan24hOpen:\s*\{\{\s*section\.settings\.safan_24h_open/);
    assert.match(liquid, /"default":\s*false/);
  });

  it('diagnostic and repair cards call the high-value intro helpers', () => {
    assert.match(liquid, /ICorrectHighValue\.diagnosticCardIntroHtml/);
    assert.match(liquid, /ICorrectHighValue\.repairCardIntroHtml/);
    assert.match(liquid, /ICorrectHighValue\.prequalHtml/);
    assert.match(liquid, /ICorrectHighValue\.withEatCollect/);
    assert.match(liquid, /function currentHighValue/);
  });

  it('speedJourneyOpts forwards diag24h and includedFast', () => {
    const start = liquid.indexOf('function speedJourneyOpts');
    const end = liquid.indexOf('function turnaroundClaimLabel');
    const fn = liquid.slice(start, end);
    assert.match(fn, /diag24h/);
    assert.match(fn, /includedFast/);
  });

  it('does not post prequal keys on the quote-events allowlist body', () => {
    const payloadStart = liquid.indexOf('function quotePayload(extra)');
    const payload = liquid.slice(payloadStart, liquid.indexOf('function captureQuoteShown'));
    assert.doesNotMatch(payload, /apple_diagnosed|apple_outcome|data_important/);
  });

  it('section file stays under Shopify\'s 256 KB cap', () => {
    assert.ok(Buffer.byteLength(liquid, 'utf8') < 262144, 'quote-wizard.liquid is over 256 KB');
  });

  it('styles the convert card without new webfonts', () => {
    assert.match(css, /\.qw-hv-card\s*\{/);
    assert.match(css, /\.qw-hv-prequal\s*\{/);
    assert.doesNotMatch(css, /@import|fonts\.google/);
  });
});
