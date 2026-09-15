'use strict';

const { resolveShopifyProductId, resolvePartIdsForHandle } = require('./handle-map');
const { shopifyProductIdFromHandle } = require('./shopify-handle');

const PRODUCT_PARTS_RELATION = 'connect_boards8';
const PART_AVAILABLE = 'formula_mkv86xh7';
const PART_QTY = 'quantity';

function parseLinkedIds(columnValue) {
  if (!columnValue) return [];
  if (Array.isArray(columnValue.linked_item_ids) && columnValue.linked_item_ids.length) {
    return columnValue.linked_item_ids.map(String).filter(Boolean);
  }
  const raw = columnValue.value ?? columnValue;
  if (!raw) return [];
  let parsed;
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
  const linked = parsed.linkedPulseIds || parsed.linked_item_ids || [];
  return linked.map((entry) => String(entry.linkedPulseId || entry.itemId || entry)).filter(Boolean);
}

function availableFromPart(part) {
  const cols = part.column_values || [];
  const avail = cols.find((c) => c.id === PART_AVAILABLE);
  const qty = cols.find((c) => c.id === PART_QTY);
  const text = (avail && avail.text) || (qty && qty.text) || '0';
  const n = parseFloat(text);
  return Number.isFinite(n) ? n : 0;
}

async function lookupMondayStock({ handle, map, mondayRequest, productsBoardId, productIdColumnId, shopifyLookup }) {
  const mappedIds = resolvePartIdsForHandle(handle, map);
  let shopifyProductId = resolveShopifyProductId(handle, map);
  if (!shopifyProductId && !mappedIds.length && shopifyLookup) {
    shopifyProductId = await shopifyLookup(handle);
  }
  if (!shopifyProductId && !mappedIds.length) return { inStock: false, partIds: [], reason: 'unmapped' };
  if (!mondayRequest) return { inStock: false, partIds: mappedIds, reason: 'no_monday' };

  let partIds = mappedIds.slice();
  if (!partIds.length && shopifyProductId) {
    const products = await mondayRequest({
      kind: 'products',
      boardId: productsBoardId,
      productIdColumnId,
      shopifyProductIds: [shopifyProductId]
    });
    const item = (products && products.items && products.items[0]) || null;
    if (item) {
      const rel = (item.column_values || []).find((c) => c.id === PRODUCT_PARTS_RELATION);
      partIds = parseLinkedIds(rel);
    }
  }
  if (!partIds.length) return { inStock: false, partIds: [], reason: 'no_parts' };

  const parts = await mondayRequest({ kind: 'parts', ids: partIds });
  const rows = (parts && parts.items) || [];
  const inStock = rows.some((part) => availableFromPart(part) >= 1);
  return { inStock, partIds, reason: inStock ? 'ok' : 'out_of_stock' };
}

function createMondayStockProvider(opts = {}) {
  const cacheMs = opts.cacheMs == null ? 60000 : opts.cacheMs;
  const cache = new Map();
  const inflight = new Map();
  return async function stockProvider({ handle, map }) {
    const key = String(handle || '');
    const now = Date.now();
    const hit = cache.get(key);
    if (hit && now - hit.at < cacheMs) return hit.inStock;
    if (inflight.has(key)) return inflight.get(key);
    const pending = (async () => {
      try {
        const result = await lookupMondayStock({
          handle,
          map,
          mondayRequest: opts.mondayRequest,
          productsBoardId: opts.productsBoardId,
          productIdColumnId: opts.productIdColumnId,
          shopifyLookup: opts.shopifyLookup || shopifyProductIdFromHandle
        });
        cache.set(key, { at: Date.now(), inStock: result.inStock });
        return result.inStock;
      } catch (e) {
        cache.set(key, { at: Date.now(), inStock: false });
        return false;
      } finally {
        inflight.delete(key);
      }
    })();
    inflight.set(key, pending);
    return pending;
  };
}

module.exports = {
  PRODUCT_PARTS_RELATION,
  parseLinkedIds,
  availableFromPart,
  lookupMondayStock,
  createMondayStockProvider
};
