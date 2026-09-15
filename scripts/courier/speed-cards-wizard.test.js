/**
 * Task 3: Fast / same-day cards in quote-wizard.liquid.
 * Run: node --test scripts/courier/speed-cards-wizard.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const liquid = fs.readFileSync(
  path.join(__dirname, '../../sections/quote-wizard.liquid'),
  'utf8'
);
const css = fs.readFileSync(
  path.join(__dirname, '../../assets/quote-wizard.css'),
  'utf8'
);

function extractFunction(src, name) {
  const start = src.indexOf('function ' + name + '(');
  assert.ok(start !== -1, 'missing function ' + name);
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('unclosed function ' + name);
}

describe('quote-wizard same-day / Fast wiring', () => {
  it('loads same-day-eligibility.js before the wizard IIFE and stubs stock closed', () => {
    assert.match(liquid, /same-day-eligibility\.js['"]\s*\|\s*asset_url/);
    const eligSrc = liquid.indexOf("same-day-eligibility.js");
    const iife = liquid.lastIndexOf("(function() {");
    assert.ok(eligSrc !== -1 && iife !== -1 && eligSrc < iife);
    assert.match(
      liquid,
      /window\.__sameDayEligibility\s*=\s*window\.__sameDayEligibility\s*\|\|\s*\{\s*inStock:\s*false,\s*dates:\s*\{\s*\}\s*\}/
    );
  });

  it('exposes Fast / same-day variant id section settings (default 0) on __sameDayConfig', () => {
    ['fast_variant_id', 'iphone_sameday_variant_id', 'macbook_sameday_variant_id'].forEach((id) => {
      assert.match(liquid, new RegExp('"id":\\s*"' + id + '"'));
      assert.match(liquid, new RegExp('section\\.settings\\.' + id));
    });
    assert.match(liquid, /window\.__sameDayConfig/);
  });

  it('speed cards keep checkout data attributes and spec copy', () => {
    assert.match(liquid, /data-opt="speed"/);
    assert.match(liquid, /data-speed=/);
    assert.match(liquid, /data-date=/);
    assert.match(liquid, /data-add=/);
    assert.match(liquid, /data-vid=/);
    assert.match(liquid, /We collect /);
    assert.match(liquid, /We repair the next working day and return it that afternoon/);
    assert.match(liquid, /Collect and back the same day\./);
    assert.match(liquid, /slots left/);
    assert.match(liquid, /How fast should we turn it around/);
    assert.match(liquid, /When should we collect/);
    assert.match(liquid, /qw-opt-back/);
    assert.match(liquid, /speedBackLabel/);
    assert.match(liquid, /function speedBackLabel\s*\(\s*speed,\s*isoOverride\s*\)/);
    assert.match(liquid, /speedBackLabel\('same_day',\s*picked \? picked\.iso : ''\)/);
    assert.doesNotMatch(liquid, /Book a day ahead/);
    assert.match(liquid, /S\.sameDayDate/);
  });

  it('places speed cards after the collection strip and before the journey', () => {
    const svc = extractFunction(liquid, 'buildServiceCards');
    const slot = svc.indexOf('qwSlotPanel');
    const speed = svc.indexOf('qwTurnaroundMount');
    const journey = svc.indexOf('qwJourney');
    assert.ok(slot !== -1 && speed !== -1 && journey !== -1);
    assert.ok(slot < speed && speed < journey);
  });

  it('CSS adds slot subline and date chips with existing --qw tokens', () => {
    assert.match(css, /\.qw-slot-left\s*\{/);
    assert.match(css, /\.qw-date-chip\s*\{/);
    assert.match(css, /font:[^;]*12px/);
    assert.doesNotMatch(css, /@import|fonts\.google/);
    const slot = css.match(/\.qw-slot-left\s*\{[^}]+\}/)[0];
    assert.match(slot, /12px/);
    assert.match(slot, /var\(--qw/);
  });
});

describe('same-day cart line properties', () => {
  it('speed variant carries Turnaround and Same-day date for the paid reserve', () => {
    const fn = extractFunction(liquid, 'buildCartItems');
    assert.match(fn, /speedProps\['Turnaround'\] = 'Same-day'/);
    assert.match(fn, /speedProps\['Same-day date'\] = S\.sameDayDate/);
    assert.match(fn, /items\.push\(\{ id: speedVid, quantity: 1, properties: speedProps \}\)/);
  });
});

describe('default stock stub hides same-day', () => {
  const E = require('../../assets/same-day-eligibility.js');
  it('inStock false + empty dates → no available dateOptions', () => {
    const dates = E.dateOptions({
      device: 'iphone',
      band: 'B1',
      service: 'courier',
      diagnostic: false,
      inStock: false,
      slotsByDate: {},
      now: new Date(Date.UTC(2026, 8, 14, 9, 0, 0))
    });
    assert.ok(dates.length > 0);
    assert.ok(dates.every((d) => d.available === false));
  });
});

describe('planSpeedOffers', () => {
  const plan = new Function('return (' + extractFunction(liquid, 'planSpeedOffers') + ')')();
  const vids = {
    config: { fastVariantId: 111, iphoneSameDayVariantId: 222, macbookSameDayVariantId: 333 }
  };

  it('iPhone courier B1/B2 eligible: Standard + Same-day, never Fast', () => {
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'courier', band: 'B1', diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: false, sameDay: true }
    );
  });

  it('MacBook courier B1/B2 eligible: Standard + Fast + Same-day', () => {
    assert.deepEqual(
      plan(Object.assign({ device: 'macbook', service: 'courier', band: 'B2', diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: true, sameDay: true }
    );
  });

  it('MacBook/iPad/diagnostic mail-in or B3/B4: Standard + Fast only', () => {
    assert.deepEqual(
      plan(Object.assign({ device: 'macbook', service: 'mailin', band: null, diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: true, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'ipad', service: 'courier', band: 'B3', diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: true, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'macbook', service: 'courier', band: 'B1', diagnostic: true, sameDayOk: true }, vids)),
      { standard: true, fast: true, sameDay: false }
    );
  });

  it('iPhone mail-in / B3/B4 / ineligible stub: Standard only', () => {
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'mailin', band: 'B1', diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: false, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'courier', band: 'B4', diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: false, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'courier', band: 'B1', diagnostic: false, sameDayOk: false }, vids)),
      { standard: true, fast: false, sameDay: false }
    );
  });

  it('iPhone diagnostic still gets Fast; known-repair iPhone does not', () => {
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'courier', band: 'B1', diagnostic: true, sameDayOk: true }, vids)),
      { standard: true, fast: true, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'mailin', band: null, diagnostic: true, sameDayOk: false }, vids)),
      { standard: true, fast: true, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'courier', band: 'B3', diagnostic: true, sameDayOk: false }, vids)),
      { standard: true, fast: true, sameDay: false }
    );
    assert.deepEqual(
      plan(Object.assign({ device: 'iphone', service: 'courier', band: 'B1', diagnostic: false, sameDayOk: true }, vids)),
      { standard: true, fast: false, sameDay: true }
    );
  });

  it('hides Fast and Same-day when variant ids are missing or 0 (fail closed)', () => {
    assert.deepEqual(
      plan({ device: 'macbook', service: 'courier', band: 'B1', diagnostic: false, sameDayOk: true }),
      { standard: true, fast: false, sameDay: false }
    );
    assert.deepEqual(
      plan({
        device: 'macbook',
        service: 'courier',
        band: 'B1',
        diagnostic: false,
        sameDayOk: true,
        config: { fastVariantId: 0, macbookSameDayVariantId: 0, iphoneSameDayVariantId: 999 }
      }),
      { standard: true, fast: false, sameDay: false }
    );
    assert.deepEqual(
      plan({
        device: 'iphone',
        service: 'courier',
        band: 'B1',
        diagnostic: false,
        sameDayOk: true,
        config: { fastVariantId: 111, iphoneSameDayVariantId: 0, macbookSameDayVariantId: 333 }
      }),
      { standard: true, fast: false, sameDay: false }
    );
    assert.deepEqual(
      plan({
        device: 'macbook',
        service: 'mailin',
        band: null,
        diagnostic: true,
        sameDayOk: false,
        config: { fastVariantId: 111, iphoneSameDayVariantId: 222, macbookSameDayVariantId: 333 }
      }),
      { standard: true, fast: true, sameDay: false }
    );
  });
});

describe('MacBook same-day uses selected collection window', () => {
  it('maps AM/PM part ids to morning/afternoon', () => {
    const fromPart = new Function('return (' + extractFunction(liquid, 'collectionWindowFromPartId') + ')')();
    assert.equal(fromPart('AM'), 'morning');
    assert.equal(fromPart('PM'), 'afternoon');
    assert.equal(fromPart(null), 'morning');
  });

  it('does not hardcode MacBook eligibility to morning', () => {
    const fn = extractFunction(liquid, 'buildSameDayOpts');
    assert.doesNotMatch(fn, /macbook['"]?\s*\?\s*['"]morning['"]/);
    assert.match(fn, /collectionWindowFromPartId/);
  });

  it('afternoon window refresh hides same-day until morning; same-day pick forces morning', () => {
    const windowClick = liquid.slice(
      liquid.indexOf("btn.getAttribute('data-part')"),
      liquid.indexOf("btn.getAttribute('data-part')") + 800
    );
    assert.match(windowClick, /refreshTurnaroundCards\s*\(/);
    assert.match(liquid, /function ensureMorningCollectionWindow\s*\(/);
    const sameDayClick = liquid.slice(
      liquid.indexOf("card.getAttribute('data-speed') === 'same_day'"),
      liquid.indexOf("card.getAttribute('data-speed') === 'same_day'") + 400
    );
    assert.match(sameDayClick, /ensureMorningCollectionWindow\s*\(/);
  });
});

describe('standard card copy uses standard collect clock', () => {
  const standardIso = new Function('return (' + extractFunction(liquid, 'standardCardCollectIso') + ')')();

  it('ignores selected same-day date when Same-day is selected', () => {
    assert.equal(
      standardIso({
        selectedSpeed: 'same_day',
        sameDayIso: '2026-09-14',
        collectionIso: '2026-09-16',
        standardCollectIso: '2026-09-16',
        packShipIso: '2026-09-15'
      }),
      '2026-09-16'
    );
    assert.equal(
      standardIso({
        selectedSpeed: 'same_day',
        sameDayIso: '2026-09-14',
        collectionIso: '2026-09-14',
        standardCollectIso: '',
        packShipIso: '2026-09-15'
      }),
      '2026-09-15'
    );
  });

  it('uses collection slot when Standard is selected, else next-working-day clock', () => {
    assert.equal(
      standardIso({
        selectedSpeed: 'standard',
        sameDayIso: '2026-09-14',
        collectionIso: '2026-09-16',
        standardCollectIso: '',
        packShipIso: '2026-09-15'
      }),
      '2026-09-16'
    );
    assert.equal(
      standardIso({
        selectedSpeed: 'standard',
        collectionIso: '',
        standardCollectIso: '',
        packShipIso: '2026-09-15'
      }),
      '2026-09-15'
    );
  });

  it('buildTurnaroundCards feeds Standard copy from standardCardCollectIso, not picked same-day', () => {
    const fn = extractFunction(liquid, 'buildTurnaroundCards');
    assert.match(fn, /standardCardCollectIso\s*\(/);
    assert.match(fn, /standardSpeedCopy\s*\(/);
    assert.doesNotMatch(fn, /current === 'same_day' && picked/);
  });
});

describe('buildTurnaroundCards fail-closed variant ids', () => {
  it('passes section config into planSpeedOffers and does not invent Fast vid from product HTML', () => {
    const fn = extractFunction(liquid, 'buildTurnaroundCards');
    assert.match(fn, /planSpeedOffers\s*\(\s*\{[\s\S]*config:\s*cfg/);
    assert.doesNotMatch(fn, /expressData\.variantId/);
  });
});

describe('I1: Fast card price must match the charged variant', () => {
  const fastCardPrice = new Function('return (' + extractFunction(liquid, 'fastCardPrice') + ')')();

  it('uses the scraped price when it belongs to the configured Fast variant', () => {
    assert.equal(fastCardPrice({ price: 65, variantId: 111 }, 111), 65);
  });

  it('falls back to £79 when the scraped variant id does not match the configured Fast variant id', () => {
    assert.equal(fastCardPrice({ price: 65, variantId: 999 }, 111), 79);
  });

  it('falls back to £79 when there is no express data at all', () => {
    assert.equal(fastCardPrice(null, 111), 79);
  });

  it('falls back to £79 when the scraped variant id is missing', () => {
    assert.equal(fastCardPrice({ price: 65, variantId: null }, 111), 79);
  });

  it('falls back to £79 when cfgFastVid is 0 even if scraped variant id is also 0 (M11)', () => {
    assert.equal(fastCardPrice({ price: 65, variantId: 0 }, 0), 79);
  });

  it('buildTurnaroundCards computes the Fast price via fastCardPrice, not a bare expressData.price check', () => {
    const fn = extractFunction(liquid, 'buildTurnaroundCards');
    assert.match(fn, /fastCardPrice\s*\(\s*expressData\s*,\s*cfgFastVid\s*\)/);
    assert.doesNotMatch(fn, /if\s*\(\s*expressData\s*&&\s*expressData\.price\s*\)\s*fastPrice\s*=\s*expressData\.price/);
  });
});

describe('I2: Standard card must not say "We collect" on mail-in or with no collection slot', () => {
  const standardSpeedMeta = new Function('return (' + extractFunction(liquid, 'standardSpeedMeta') + ')')();

  it('courier with a collection slot says "We collect <date>."', () => {
    const meta = standardSpeedMeta({
      postOnly: false,
      diagnostic: false,
      device: 'macbook',
      dateLabel: 'Tue 15 Sep',
      benchDays: 3,
      benchLabel: '3 working days'
    });
    assert.match(meta, /^We collect Tue 15 Sep\./);
  });

  it('mail-in never says a bare "We collect" and keeps the pack/post + bench sentence', () => {
    const meta = standardSpeedMeta({
      postOnly: true,
      diagnostic: false,
      device: 'macbook',
      dateLabel: 'Tue 15 Sep',
      benchDays: 3,
      benchLabel: '3 working days'
    });
    assert.doesNotMatch(meta, /We collect/);
    assert.equal(meta, 'We send you a pack to post your device to us. We repair in 3 working days.');
  });

  it('no collection slot yet (courier, pre-postcode) does not say "We collect" either', () => {
    const meta = standardSpeedMeta({
      postOnly: true,
      diagnostic: false,
      device: 'iphone',
      dateLabel: 'Tue 15 Sep',
      benchDays: 1,
      benchLabel: '1 working day'
    });
    assert.doesNotMatch(meta, /We collect/);
  });

  it('mail-in iPhone (1-day bench) does not promise same-afternoon return (I4)', () => {
    const meta = standardSpeedMeta({
      postOnly: true,
      diagnostic: false,
      device: 'iphone',
      dateLabel: 'Tue 15 Sep',
      benchDays: 1,
      benchLabel: '1 working day'
    });
    assert.doesNotMatch(meta, /return it that afternoon/);
    assert.equal(
      meta,
      'We send you a pack to post your device to us. We repair the next working day after it arrives.'
    );
  });

  it('courier iPhone (1-day bench) still promises same-afternoon return', () => {
    const meta = standardSpeedMeta({
      postOnly: false,
      diagnostic: false,
      device: 'iphone',
      dateLabel: 'Tue 15 Sep',
      benchDays: 1,
      benchLabel: '1 working day'
    });
    assert.equal(
      meta,
      'We collect Tue 15 Sep. We repair the next working day and return it that afternoon.'
    );
  });

  it('mail-in diagnostic keeps the bench claim via turnaroundClaimLabel, not a bare "We collect"', () => {
    const meta = standardSpeedMeta({
      postOnly: true,
      diagnostic: true,
      device: 'macbook',
      dateLabel: 'Tue 15 Sep',
      benchDays: 3,
      benchLabel: 'Quote in 3 working days'
    });
    assert.doesNotMatch(meta, /We collect/);
    assert.match(meta, /Quote in 3 working days\./);
  });

  it('courier diagnostic still says "We collect" and keeps the bench claim', () => {
    const meta = standardSpeedMeta({
      postOnly: false,
      diagnostic: true,
      device: 'macbook',
      dateLabel: 'Tue 15 Sep',
      benchDays: 3,
      benchLabel: 'Quote in 3 working days'
    });
    assert.match(meta, /^We collect Tue 15 Sep\. Quote in 3 working days\./);
  });

  it('standardSpeedCopy call site passes postOnly from mail-in or a missing collection slot', () => {
    const fn = extractFunction(liquid, 'buildTurnaroundCards');
    assert.match(fn, /standardSpeedCopy\s*\(\s*dateLabel\s*,\s*standardPostOnly\s*\)/);
    assert.match(fn, /currentSpeedService\s*\(\s*\)\s*===\s*'mailin'\s*\|\|\s*!hasCollectionSlot/);
  });

  it('standardSpeedCopy uses turnaroundClaimLabel for the bench claim (reviewer M3)', () => {
    const fn = extractFunction(liquid, 'standardSpeedCopy');
    assert.match(fn, /turnaroundClaimLabel\s*\(/);
    assert.doesNotMatch(fn, /['"]Quote in 3 working days\.['"]/);
  });
});

describe('leaving Same-day restores standard collection date', () => {
  it('Standard/Fast click restores _collectionSlot.date from _standardCollectIso', () => {
    const wire = extractFunction(liquid, 'wireTurnaroundMount');
    assert.match(wire, /restoreStandardCollectionSlot\s*\(/);
    assert.match(wire, /data-speed'\) === 'same_day'/);
    assert.match(wire, /S\.speed\s*=\s*card\.getAttribute\('data-speed'\)/);
    assert.doesNotMatch(wire, /refreshTurnaroundCards\s*\(/);
    const sel = extractFunction(liquid, 'selectedSpeed');
    assert.match(sel, /S\.speed === 'same_day'/);
    const restore = extractFunction(liquid, 'restoreStandardCollectionSlot');
    assert.match(restore, /_standardCollectIso/);
    assert.match(restore, /_collectionSlot\.date/);
    assert.doesNotMatch(restore, /S\.sameDayDate/);
  });
});

describe('quote-wizard clock fallbacks match repair-journey.js', () => {
  it('repairBenchDays fallback: diagnostic 3, macbook/ipad 3, iphone 1, same_day 0, fast 1', () => {
    const fn = extractFunction(liquid, 'repairBenchDays');
    assert.match(fn, /speed === 'same_day'[\s\S]*return 0/);
    assert.match(fn, /speed === 'fast'[\s\S]*return 1/);
    assert.match(fn, /opts\.diagnostic\) return 3/);
    assert.match(fn, /device === 'iphone'\) return 1/);
    assert.match(fn, /device === 'watch'\) return 3/);
    assert.match(fn, /return 3/);
    assert.doesNotMatch(fn, /opts\.diagnostic\) return 1/);
    assert.doesNotMatch(fn, /return 2;/);
  });

  it('mail-in diagnostic fallback uses repairBenchDays, not +1 calendar/working day', () => {
    const fn = extractFunction(liquid, 'buildMailinJourneyModel');
    assert.doesNotMatch(fn, /addWorkingDays\(weReceive,\s*1\)/);
    assert.match(fn, /addWorkingDays\(weReceive,\s*bench\)/);
  });

  it('diagnostic journeys receive speedJourneyOpts so Fast is +1 WD', () => {
    const courier = extractFunction(liquid, 'buildCourierJourneyModel');
    const mailin = extractFunction(liquid, 'buildMailinJourneyModel');
    assert.match(courier, /courierDiagnosticJourney\(collect,\s*opts\)/);
    assert.match(mailin, /mailinDiagnosticJourney\(new Date\(\),\s*opts\)/);
  });
});

describe('speedCardHtml data attributes', () => {
  const esc = (str) => String(str);
  const gbp = { format: (n) => '£' + n };
  const speedCardHtml = new Function('gbp', 'esc', 'return (' + extractFunction(liquid, 'speedCardHtml') + ')')(gbp, esc);

  it('emits checkout attrs for same-day including data-speed and data-date', () => {
    const html = speedCardHtml({
      speed: 'same_day',
      name: 'Same-day',
      meta: 'Collect and back the same day.',
      price: 49,
      vid: 111,
      selected: true,
      dateIso: '2026-09-14',
      extraInner: '<div class="qw-slot-left">3 slots left</div>'
    });
    assert.match(html, /data-opt="speed"/);
    assert.match(html, /data-speed="same_day"/);
    assert.match(html, /data-date="2026-09-14"/);
    assert.match(html, /data-add="49"/);
    assert.match(html, /data-vid="111"/);
    assert.match(html, /qw-opt-card sel/);
    assert.match(html, /3 slots left/);
  });
});
