'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../../assets/same-day-eligibility.js');

function bst(y, m, d, h, min) {
  return new Date(Date.UTC(y, m, d, h - 1, min || 0, 0));
}

const base = {
  device: 'iphone',
  band: 'B1',
  service: 'courier',
  diagnostic: false,
  inStock: true,
  slotsRemaining: 3,
  collectionWindow: 'morning',
  now: bst(2026, 8, 14, 10, 0) // Mon 10:00 UK
};

describe('todayEligible', () => {
  it('iphone B1 at 10:00 ok; at 12:00 no', () => {
    assert.equal(E.todayEligible(base).ok, true);
    assert.equal(E.todayEligible(Object.assign({}, base, { now: bst(2026, 8, 14, 12, 0) })).ok, false);
  });
  it('iphone B2 at 11:00 no', () => {
    assert.equal(E.todayEligible(Object.assign({}, base, { band: 'B2', now: bst(2026, 8, 14, 11, 0) })).ok, false);
  });
  it('macbook afternoon window no', () => {
    assert.equal(E.todayEligible(Object.assign({}, base, { device: 'macbook', collectionWindow: 'afternoon' })).ok, false);
  });
  it('macbook afternoon still offers future same-day dates', () => {
    const dates = E.dateOptions(Object.assign({}, base, {
      device: 'macbook',
      collectionWindow: 'afternoon'
    }));
    assert.ok(dates.some((d) => d.available), 'future same-day dates stay bookable');
  });
  it('B3 / mail-in / ipad / diagnostic / no stock / 0 slots all no', () => {
    ['band', 'service', 'device', 'diagnostic', 'inStock', 'slotsRemaining'].forEach(() => {});
    assert.equal(E.todayEligible(Object.assign({}, base, { band: 'B3' })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { service: 'mail-in' })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { device: 'ipad' })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { diagnostic: true })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { inStock: false })).ok, false);
    assert.equal(E.todayEligible(Object.assign({}, base, { slotsRemaining: 0 })).ok, false);
  });
});
