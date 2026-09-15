'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { reserveSameDayOnPaid, annotateSuccessSlackText } = require('./same-day-from-order');

describe('orders/paid → reserve', () => {
  it('skips orders with no same-day line', async () => {
    const result = await reserveSameDayOnPaid({
      id: 1,
      line_items: [{ title: 'iPhone screen', handle: 'iphone-16-pro-max-oled-screen-repair' }]
    }, { fetchImpl: async () => { throw new Error('should not fetch'); } });
    assert.equal(result.skipped, true);
  });

  it('POSTs the reserve payload and reports cap failure', async () => {
    const calls = [];
    const result = await reserveSameDayOnPaid({
      id: 88,
      line_items: [
        {
          handle: 'iphone-16-pro-max-oled-screen-repair',
          properties: [{ name: 'Collection Date', value: '2026-09-16' }]
        },
        { variant_id: 71304855585021, handle: 'same-day-iphone' }
      ]
    }, {
      reserveSecret: 'test',
      fetchImpl: async (url, opts) => {
        calls.push({ url, opts });
        return { ok: true, json: async () => ({ ok: false, slots_remaining: 0 }) };
      }
    });
    assert.equal(result.ok, false);
    assert.equal(result.request.date, '2026-09-16');
    assert.equal(calls[0].opts.headers.Authorization, 'Bearer test');
    assert.match(
      annotateSuccessSlackText('kept repair', {
        line_items: [{ variant_id: 71304855585021 }]
      }, { reserveFailed: true }),
      /SAME-DAY RESERVE FAILED/
    );
  });
});
