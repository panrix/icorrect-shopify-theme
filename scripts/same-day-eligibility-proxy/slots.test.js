'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createSlotStore, DEFAULT_CAP } = require('./slots');

describe('same-day slot store', () => {
  it('defaults a new date to the cap of 3', () => {
    const store = createSlotStore();
    assert.equal(DEFAULT_CAP, 3);
    assert.equal(store.remaining('2026-09-16'), 3);
  });

  it('fourth reserve on the same date fails and leaves remaining at 0', () => {
    const store = createSlotStore();
    assert.equal(store.reserve('2026-09-16', 'o1').ok, true);
    assert.equal(store.reserve('2026-09-16', 'o2').slotsRemaining, 1);
    assert.equal(store.reserve('2026-09-16', 'o3').slotsRemaining, 0);
    const fourth = store.reserve('2026-09-16', 'o4');
    assert.equal(fourth.ok, false);
    assert.equal(fourth.slotsRemaining, 0);
    assert.equal(store.remaining('2026-09-16'), 0);
  });

  it('keeps dates independent and is idempotent per order id', () => {
    const store = createSlotStore();
    assert.equal(store.reserve('2026-09-16', 'a').ok, true);
    assert.equal(store.reserve('2026-09-17', 'b').ok, true);
    const again = store.reserve('2026-09-16', 'a');
    assert.equal(again.ok, true);
    assert.equal(again.idempotent, true);
    assert.equal(store.remaining('2026-09-16'), 2);
    assert.equal(store.remaining('2026-09-17'), 2);
  });

  it('rejects a missing date', () => {
    const store = createSlotStore();
    assert.equal(store.reserve('', 'o1').ok, false);
    assert.equal(store.remaining(''), 0);
  });
});
