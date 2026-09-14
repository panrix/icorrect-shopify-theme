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
  it('iphone/macbook/ipad 1, watch 3, diagnostic 1', () => {
    assert.equal(J.repairBenchDays('iphone'), 1);
    assert.equal(J.repairBenchDays('macbook'), 1);
    assert.equal(J.repairBenchDays('ipad'), 1);
    assert.equal(J.repairBenchDays('watch'), 3);
    assert.equal(J.repairBenchDays('macbook', { diagnostic: true }), 1);
  });
});

describe('courier clocks from Monday collection', () => {
  const collect = new Date(2026, 8, 14); // Mon 14 Sep 2026

  it('iphone and macbook back Tuesday (1 working day)', () => {
    assert.equal(iso(J.courierRepairJourney('iphone', collect).returnDate), '2026-09-15');
    assert.equal(iso(J.courierRepairJourney('macbook', collect).returnDate), '2026-09-15');
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

describe('mail-in from Sunday evening', () => {
  const sundayNight = new Date(2026, 8, 13, 23, 0, 0);

  it('pack Monday, customer posts Tuesday, then bench + return', () => {
    const j = J.mailinRepairJourney('macbook', sundayNight);
    assert.equal(iso(j.steps[0].meta), '2026-09-14');
    assert.equal(iso(j.steps[1].meta), '2026-09-15');
    assert.equal(j.steps[0].title, 'We send packaging');
    assert.equal(j.steps[1].title, 'You post the device');
    assert.ok(j.returnDate);
  });

  it('diagnostic emails quote, no return leg', () => {
    const j = J.mailinDiagnosticJourney(sundayNight);
    assert.equal(j.returnDate, null);
    assert.ok(j.quoteDate);
    assert.equal(j.steps[2].title, 'We diagnose & email your quote');
    assert.equal(iso(j.steps[2].meta), iso(j.quoteDate));
    assert.equal(j.steps[3].title, 'You decide next');
    assert.match(j.steps[3].meta, /stays with us/i);
  });

  it('mail-in received Friday quotes Monday', () => {
    const wednesdayMorning = new Date(2026, 8, 16, 9, 0, 0); // Wed 16 Sep
    const j = J.mailinDiagnosticJourney(wednesdayMorning);
    assert.equal(iso(j.quoteDate), '2026-09-21');
  });
});
