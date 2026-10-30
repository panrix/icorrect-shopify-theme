/**
 * Repair / diagnostic journey clocks (Ricky 2026-09-14).
 * Run: node --test scripts/courier/repair-journey.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const J = require('../../assets/repair-journey.js');

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('repairBenchDays', () => {
  it('iphone 1, macbook/ipad 2, watch 3, diagnostic 1', () => {
    assert.equal(J.repairBenchDays('iphone'), 1);
    assert.equal(J.repairBenchDays('macbook'), 2);
    assert.equal(J.repairBenchDays('ipad'), 2);
    assert.equal(J.repairBenchDays('watch'), 3);
    assert.equal(J.repairBenchDays('macbook', { diagnostic: true }), 1);
  });
});

describe('courier clocks from Monday collection', () => {
  const collect = new Date(2026, 8, 14); // Mon 14 Sep 2026

  it('iphone back Tuesday; macbook back Wednesday', () => {
    assert.equal(iso(J.courierRepairJourney('iphone', collect).returnDate), '2026-09-15');
    assert.equal(iso(J.courierRepairJourney('macbook', collect).returnDate), '2026-09-16');
  });

  it('watch still back Thursday (3 working days)', () => {
    assert.equal(iso(J.courierRepairJourney('watch', collect).returnDate), '2026-09-17');
  });

  it('diagnostic quotes Tuesday and does not return the device', () => {
    const j = J.courierDiagnosticJourney(collect);
    assert.equal(iso(j.quoteDate), '2026-09-15');
    assert.equal(j.returnDate, null);
    assert.equal(j.steps[0].title, 'We collect');
    assert.equal(j.steps[1].title, 'We diagnose & email your quote');
    assert.equal(iso(j.steps[1].meta), '2026-09-15');
    assert.equal(j.steps[2].title, 'You decide next');
    assert.match(j.steps[2].meta, /stays with us/i);
    assert.equal(J.turnaroundClaimLabel('macbook', { diagnostic: true }), 'Quote in 1 working day');
  });

  it('Friday collection quotes next working day (Monday)', () => {
    const friday = new Date(2026, 8, 18); // Fri 18 Sep 2026
    const j = J.courierDiagnosticJourney(friday);
    assert.equal(iso(j.quoteDate), '2026-09-21');
    assert.equal(j.returnDate, null);
  });
});

/** Sep 2026 is BST (UTC+1). hourLondon is wall time in Europe/London. */
function bst(y, m, d, hourLondon, min) {
  return new Date(Date.UTC(y, m, d, hourLondon - 1, min || 0, 0));
}

describe('mail-in pack clock (UK, UPost +1 working day)', () => {
  it('cutoff is 3pm Europe/London', () => {
    assert.equal(J.PACK_CUTOFF_HOUR, 15);
  });

  it('Monday 10:00 UK ships today; UPost arrives Tuesday', () => {
    const j = J.mailinRepairJourney('iphone', bst(2026, 8, 14, 10, 0));
    assert.equal(j.steps[0].title, 'We send packaging');
    assert.equal(iso(j.steps[0].meta), '2026-09-14');
    assert.equal(j.steps[1].title, 'You post the device');
    assert.equal(iso(j.steps[1].meta), '2026-09-15');
    assert.equal(iso(j.returnDate), '2026-09-17'); // receive Tue, repair Wed, back Thu
  });

  it('Monday 15:30 UK ships Tuesday', () => {
    const j = J.mailinRepairJourney('iphone', bst(2026, 8, 14, 15, 30));
    assert.equal(iso(j.steps[0].meta), '2026-09-15');
    assert.equal(iso(j.steps[1].meta), '2026-09-16');
  });

  it('Bali afternoon that is still morning in the UK ships today', () => {
    // 15:16 Bali (UTC+8) on Mon 14 Sep = 07:16 UTC = 08:16 UK
    const baliAfternoon = new Date('2026-09-14T15:16:00+08:00');
    const ship = J.packShipDate(baliAfternoon);
    assert.equal(iso(ship), '2026-09-14');
  });

  it('Sunday evening UK ships Monday, device Tuesday', () => {
    const sundayNight = bst(2026, 8, 13, 23, 0);
    const j = J.mailinRepairJourney('macbook', sundayNight);
    assert.equal(iso(j.steps[0].meta), '2026-09-14');
    assert.equal(iso(j.steps[1].meta), '2026-09-15');
    assert.ok(j.returnDate);
  });

  it('diagnostic emails quote one working day after the device arrives', () => {
    const j = J.mailinDiagnosticJourney(bst(2026, 8, 14, 10, 0));
    assert.equal(j.returnDate, null);
    assert.equal(iso(j.quoteDate), '2026-09-16'); // ship Mon, arrive Tue, quote Wed
    assert.equal(j.steps[2].title, 'We diagnose & email your quote');
    assert.equal(iso(j.steps[2].meta), iso(j.quoteDate));
    assert.equal(j.steps[3].title, 'You decide next');
    assert.match(j.steps[3].meta, /stays with us/i);
  });

  it('Wednesday morning ships Wednesday; quote Friday', () => {
    const j = J.mailinDiagnosticJourney(bst(2026, 8, 16, 9, 0));
    assert.equal(iso(j.steps[0].meta), '2026-09-16');
    assert.equal(iso(j.quoteDate), '2026-09-18');
  });
});

describe('quote-wizard packShipDate fallback uses UK time', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const wizard = [
    fs.readFileSync(path.join(__dirname, '../../sections/quote-wizard.liquid'), 'utf8'),
    fs.readFileSync(path.join(__dirname, '../../assets/quote-wizard.js'), 'utf8'),
  ].join('\n');
  const start = wizard.indexOf('function packShipDate(now)');
  const end = wizard.indexOf('function journeyStepHtml(');
  assert.ok(start >= 0 && end > start, 'packShipDate / journeyStepHtml markers missing');
  const fallback = wizard.slice(wizard.lastIndexOf('function londonWall(now)', start), end);

  it('fallback derives the cutoff from Europe/London, not Date#getHours', () => {
    assert.match(fallback, /timeZone:\s*'Europe\/London'/);
    assert.equal(
      /getHours\s*\(/.test(fallback),
      false,
      'wizard packShipDate fallback still uses browser-local getHours()'
    );
    assert.match(fallback, /wall\.hour >= PACK_CUTOFF_HOUR/);
  });
});

/** iPhone front camera / Face ID: module ordered from Apple (Michael 2026-10-30). */
describe('iPhone front camera / Face ID turnaround', () => {
  const collect = new Date(2026, 8, 14); // Mon 14 Sep 2026

  it('label is 5-7 working days; dates use 7', () => {
    for (const repairType of ['front-camera', 'face-id']) {
      assert.equal(J.turnaroundClaimLabel('iphone', { repairType }), '5-7 working days');
      assert.equal(J.repairBenchDays('iphone', { repairType }), 7);
      assert.deepEqual(J.repairBenchRange('iphone', { repairType }), { min: 5, max: 7 });
    }
  });

  it('courier return date is 7 working days after collection with the Apple note', () => {
    const j = J.courierRepairJourney('iphone', collect, { repairType: 'front-camera', model: 'iPhone 15 Pro' });
    assert.equal(iso(j.returnDate), '2026-09-23');
    assert.equal(j.steps[1].meta, '5-7 working days');
    assert.equal(j.note, 'The Face ID module needs to be ordered directly from Apple.');
  });

  it('mail-in: receive +1, bench 7, return +1', () => {
    const mon = new Date('2026-09-14T08:00:00Z'); // 09:00 London, before pack cut-off
    const base = J.mailinRepairJourney('iphone', mon);
    const fc = J.mailinRepairJourney('iphone', mon, { repairType: 'front-camera' });
    assert.equal(fc.steps[2].meta, '5-7 working days');
    assert.match(fc.note, /ordered directly from Apple/);
    assert.equal(base.note, '');
    // 6 extra bench days over a standard iPhone repair (Mon-Fri only).
    const diffDays = Math.round((fc.returnDate - base.returnDate) / 86400000);
    assert.ok(diffDays >= 6, `expected at least 6 days later, got ${diffDays}`);
  });

  it('mixed booking takes the longest', () => {
    assert.equal(J.repairBenchDays('iphone', { repairTypes: ['screen', 'front-camera'] }), 7);
    assert.equal(J.turnaroundClaimLabel('iphone', { repairTypes: ['battery', 'face-id'] }), '5-7 working days');
  });

  it('other iPhone repairs, other devices, diagnostics stay as before', () => {
    assert.equal(J.turnaroundClaimLabel('iphone', { repairType: 'screen' }), '1 working day');
    assert.equal(J.turnaroundClaimLabel('iphone'), '1 working day');
    assert.equal(J.repairBenchDays('ipad', { repairType: 'front-camera' }), 2);
    assert.equal(J.turnaroundClaimLabel('iphone', { repairType: 'front-camera', diagnostic: true }), 'Quote in 1 working day');
    assert.equal(iso(J.courierRepairJourney('iphone', collect, { repairType: 'screen' }).returnDate), '2026-09-15');
  });

  it('iPhone SE and iPhone 8 have no Face ID so stay at 1 working day', () => {
    assert.equal(J.turnaroundClaimLabel('iphone', { repairType: 'front-camera', model: 'iPhone SE 3rd Gen (2022)' }), '1 working day');
    assert.equal(J.turnaroundClaimLabel('iphone', { repairType: 'front-camera', model: 'iPhone 8 Plus' }), '1 working day');
    assert.equal(J.turnaroundNote('iphone', { repairType: 'front-camera', model: 'iPhone 8' }), '');
  });
});
