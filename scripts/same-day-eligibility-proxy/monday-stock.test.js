'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { lookupMondayStock, parseLinkedIds, availableFromPart, createMondayStockProvider } = require('./monday-stock');

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

  it('resolves an unmapped handle via Shopify product id then Monday parts', async () => {
    const result = await lookupMondayStock({
      handle: 'a3186-screen-replacement',
      map: {},
      shopifyLookup: async () => '999',
      mondayRequest: async (job) => {
        if (job.kind === 'products') {
          return {
            items: [{
              id: 'M1',
              column_values: [{ id: 'connect_boards8', linked_item_ids: ['P9'] }]
            }]
          };
        }
        return { items: [{ id: 'P9', column_values: [{ id: 'formula_mkv86xh7', text: '3' }] }] };
      }
    });
    assert.equal(result.inStock, true);
    assert.deepEqual(result.partIds, ['P9']);
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

  it('coalesces parallel lookups for the same handle', async () => {
    let calls = 0;
    const map = { 'iphone-16-pro-max-screen-repair': { part_ids: ['P1'] } };
    const provider = createMondayStockProvider({
      cacheMs: 60000,
      shopifyLookup: async () => {
        throw new Error('mapped part ids must not hit Shopify');
      },
      mondayRequest: async () => {
        calls += 1;
        await new Promise((r) => setTimeout(r, 20));
        return { items: [{ id: 'P1', column_values: [{ id: 'formula_mkv86xh7', text: '2' }] }] };
      }
    });
    const rows = await Promise.all([
      provider({ handle: 'iphone-16-pro-max-screen-repair', map }),
      provider({ handle: 'iphone-16-pro-max-screen-repair', map }),
      provider({ handle: 'iphone-16-pro-max-screen-repair', map })
    ]);
    assert.deepEqual(rows, [true, true, true]);
    assert.equal(calls, 1);
  });
});
