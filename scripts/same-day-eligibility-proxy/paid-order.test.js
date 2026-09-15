'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  findSameDayLine,
  sameDayDateFromOrder,
  reserveRequestFromOrder
} = require('./paid-order');

function order(lines) {
  return { id: 999, order_number: 4242, line_items: lines };
}

describe('paid same-day order → reserve', () => {
  it('finds the iPhone £49 variant and the MacBook fastest variant', () => {
    assert.equal(
      findSameDayLine(order([{ variant_id: 71304855585021, title: 'Same-day iPhone' }])).variant_id,
      71304855585021
    );
    assert.ok(findSameDayLine(order([{
      variant_id: 46150010962173,
      handle: 'turn-around-time-fatest-4-hours',
      title: 'Turn around time fatest 4 hours'
    }])));
    assert.equal(findSameDayLine(order([{ variant_id: 46150011027709, title: '1 working day' }])), null);
  });

  it('reads Same-day date then Collection Date', () => {
    const paid = order([
      {
        title: 'iPhone 16 Pro Max OLED Screen Repair',
        handle: 'iphone-16-pro-max-oled-screen-repair',
        properties: [
          { name: 'Collection Date', value: '2026-09-16' },
          { name: 'Service Type', value: 'Courier collection' }
        ]
      },
      {
        variant_id: 71304855585021,
        handle: 'same-day-iphone',
        properties: [{ name: 'Same-day date', value: '2026-09-16' }]
      }
    ]);
    assert.equal(sameDayDateFromOrder(paid), '2026-09-16');
    const req = reserveRequestFromOrder(paid);
    assert.equal(req.orderId, '999');
    assert.equal(req.date, '2026-09-16');
    assert.equal(req.handle, 'iphone-16-pro-max-oled-screen-repair');
    assert.equal(req.variantId, '71304855585021');
  });

  it('returns null when the order has no same-day line', () => {
    assert.equal(reserveRequestFromOrder(order([
      { title: 'iPhone 16 Pro Max OLED Screen Repair', handle: 'iphone-16-pro-max-oled-screen-repair' }
    ])), null);
  });
});
