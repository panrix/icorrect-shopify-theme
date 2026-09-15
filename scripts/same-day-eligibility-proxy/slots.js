'use strict';

const DEFAULT_CAP = 3;

function createSlotStore({ cap = DEFAULT_CAP, rows = {} } = {}) {
  const data = {};
  for (const [date, row] of Object.entries(rows)) {
    data[date] = {
      remaining: Number(row.remaining),
      orderIds: Array.isArray(row.orderIds) ? row.orderIds.map(String) : []
    };
  }

  function remaining(date) {
    const key = String(date || '');
    if (!key) return 0;
    if (!data[key]) return cap;
    return Number(data[key].remaining);
  }

  function reserve(date, orderId) {
    const key = String(date || '');
    if (!key) return { ok: false, slotsRemaining: 0, reason: 'missing_date' };
    const id = orderId != null && String(orderId) ? String(orderId) : null;
    if (!data[key]) {
      data[key] = { remaining: cap, orderIds: [] };
    }
    if (id && data[key].orderIds.includes(id)) {
      return { ok: true, slotsRemaining: data[key].remaining, idempotent: true };
    }
    const rem = Number(data[key].remaining);
    if (!(rem > 0)) {
      return { ok: false, slotsRemaining: rem, reason: 'cap_reached' };
    }
    data[key].remaining = rem - 1;
    if (id) data[key].orderIds.push(id);
    return { ok: true, slotsRemaining: data[key].remaining, idempotent: false };
  }

  return {
    remaining,
    reserve,
    dump() {
      return JSON.parse(JSON.stringify(data));
    }
  };
}

module.exports = {
  DEFAULT_CAP,
  createSlotStore
};
