'use strict';

const fs = require('node:fs');
const path = require('node:path');

function normalizeHandle(handle) {
  return String(handle || '').trim().toLowerCase();
}

function loadHandleMap(filePath) {
  const resolved = filePath
    || process.env.SAME_DAY_HANDLE_MAP
    || path.join(__dirname, 'handle-map.json');
  try {
    const raw = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    return raw && typeof raw === 'object' ? raw : {};
  } catch (e) {
    return {};
  }
}

function resolvePartIdsForHandle(handle, map) {
  const row = (map || {})[normalizeHandle(handle)];
  if (!row) return [];
  const ids = row.part_ids || row.partIds || [];
  return ids.map(String).filter(Boolean);
}

function resolveShopifyProductId(handle, map) {
  const row = (map || {})[normalizeHandle(handle)];
  if (!row) return null;
  return row.shopify_product_id ? String(row.shopify_product_id) : null;
}

function isInStock(handle, deps = {}) {
  const map = deps.map || {};
  const ids = resolvePartIdsForHandle(handle, map);
  if (!ids.length) return false;
  const availability = deps.availabilityById || {};
  return ids.some((id) => Number(availability[id]) >= 1);
}

module.exports = {
  normalizeHandle,
  loadHandleMap,
  resolvePartIdsForHandle,
  resolveShopifyProductId,
  isInStock
};
