'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { lookupMondayStock, parseLinkedIds, availableFromPart } = require('./monday-stock');

describe('Monday stock lookup', () => {
  it('parses linked part ids and available qty', () => {
    assert.deepEqual(parseLinkedIds({ linked_item_ids: ['11', '22'] }), ['11', '22']);
    assert.equal(availableFromPart({
      column_values: [
        { id: 'formula_mkv86xh7', text: '4' },
        { id: 'quantity', text: '4' }
      ]
    }), 4);
  });

  it('fail-closes when the handle is not on the map', async () => {
    const result = await lookupMondayStock({
      handle: 'unknown',
      map: {},
      mondayRequest: async () => { throw new Error('should not call'); }
    });
    assert.equal(result.inStock, false);
    assert.equal(result.reason, 'unmapped');
  });

  it('is in stock when a linked part has available >= 1', async () => {
    const result = await lookupMondayStock({
      handle: 'iphone-16-pro-max-oled-screen-repair',
      map: { 'iphone-16-pro-max-oled-screen-repair': { part_ids: ['P1'] } },
      mondayRequest: async () => ({
        items: [{ id: 'P1', column_values: [{ id: 'formula_mkv86xh7', text: '2' }] }]
      })
    });
    assert.equal(result.inStock, true);
  });

  it('is out of stock when every linked part is 0', async () => {
    const result = await lookupMondayStock({
      handle: 'iphone-16-pro-max-oled-screen-repair',
      map: { 'iphone-16-pro-max-oled-screen-repair': { part_ids: ['P1'] } },
      mondayRequest: async () => ({
        items: [{ id: 'P1', column_values: [{ id: 'formula_mkv86xh7', text: '0' }] }]
      })
    });
    assert.equal(result.inStock, false);
  });
});
