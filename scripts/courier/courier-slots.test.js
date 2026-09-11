/**
 * Collection slot cutoff tests (#53 slice 3).
 * Run: node --test scripts/courier/courier-slots.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  earliestCollectionDay,
  listCollectionDates,
  dayParts,
  slotCartProperties,
  toISODate,
  addDays,
} = require('../../assets/courier-slots.js');

describe('earliestCollectionDay cutoff', () => {
  it('B1 before 2pm → today allowed', () => {
    const now = new Date(2026, 8, 11, 13, 30, 0); // Fri 11 Sep 2026 13:30
    const g = earliestCollectionDay('B1', now);
    assert.equal(g.todayAllowed, true);
    assert.equal(toISODate(g.earliest), '2026-09-11');
  });

  it('B2 after 2pm → tomorrow', () => {
    const now = new Date(2026, 8, 11, 14, 0, 0);
    const g = earliestCollectionDay('B2', now);
    assert.equal(g.todayAllowed, false);
    assert.equal(toISODate(g.earliest), '2026-09-12');
  });

  it('B4 before 2pm → still tomorrow (outer London)', () => {
    const now = new Date(2026, 8, 11, 10, 0, 0);
    const g = earliestCollectionDay('B4', now);
    assert.equal(g.todayAllowed, false);
    assert.equal(toISODate(g.earliest), '2026-09-12');
  });

  it('B3 after 2pm → tomorrow', () => {
    const now = new Date(2026, 8, 11, 16, 0, 0);
    const g = earliestCollectionDay('B3', now);
    assert.equal(g.todayAllowed, false);
    assert.equal(toISODate(g.earliest), '2026-09-12');
  });
});

describe('listCollectionDates', () => {
  it('B2 before 2pm includes Today as first option', () => {
    const now = new Date(2026, 8, 11, 11, 0, 0);
    const { dates } = listCollectionDates('B2', { now: now, count: 5, includeWeekends: true });
    assert.equal(dates[0].isToday, true);
    assert.equal(dates[0].headline, 'Today');
    assert.equal(dates[1].headline, 'Tomorrow');
  });

  it('B4 never offers Today', () => {
    const now = new Date(2026, 8, 11, 11, 0, 0);
    const { dates } = listCollectionDates('B4', { now: now, count: 5, includeWeekends: true });
    assert.equal(dates[0].isToday, false);
    assert.equal(dates[0].headline, 'Tomorrow');
  });
});

describe('day parts + cart properties', () => {
  it('exposes AM and PM windows', () => {
    const parts = dayParts();
    assert.deepEqual(parts.map((p) => p.id), ['AM', 'PM']);
  });

  it('slotCartProperties sets Collection Date and Collection Window', () => {
    const props = slotCartProperties(
      { iso: '2026-09-12', headline: 'Tomorrow' },
      { id: 'AM', label: 'Morning', detail: '9am – 12pm' }
    );
    assert.equal(props['Collection Date'], '2026-09-12');
    assert.match(props['Collection Window'], /Tomorrow/);
    assert.match(props['Collection Window'], /Morning/);
  });

  it('null-safe when slot incomplete', () => {
    assert.equal(slotCartProperties(null, dayParts()[0]), null);
    assert.equal(slotCartProperties({ iso: '2026-09-12' }, null), null);
  });
});
