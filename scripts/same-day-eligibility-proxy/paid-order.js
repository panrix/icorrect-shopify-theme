'use strict';

const SAME_DAY_VARIANT_IDS = new Set([
  '71304855585021', // same-day-iphone £49
  '46150010962173'  // turn-around-time-fatest-4-hours £149
]);

const SAME_DAY_HANDLES = new Set([
  'same-day-iphone',
  'turn-around-time-fatest-4-hours'
]);

function lineVariantId(line) {
  return String(line.variant_id || line.variantId || '');
}

function lineHandle(line) {
  return String(line.handle || line.sku || '').toLowerCase();
}

function lineTitle(line) {
  return String(line.title || '').toLowerCase();
}

function isSameDayLine(line) {
  if (!line) return false;
  if (SAME_DAY_VARIANT_IDS.has(lineVariantId(line))) return true;
  if (SAME_DAY_HANDLES.has(lineHandle(line))) return true;
  const title = lineTitle(line);
  if (title.includes('same-day') || title.includes('same day')) return true;
  if (title.includes('fatest') && title.includes('4')) return true;
  return false;
}

function findSameDayLine(order) {
  const lines = (order && order.line_items) || [];
  for (const line of lines) {
    if (isSameDayLine(line)) return line;
  }
  return null;
}

function propertyValue(line, name) {
  const props = (line && line.properties) || [];
  if (Array.isArray(props)) {
    const hit = props.find((p) => p && p.name === name);
    return hit ? String(hit.value || '') : '';
  }
  if (props && typeof props === 'object') {
    return String(props[name] || '');
  }
  return '';
}

function sameDayDateFromOrder(order) {
  const lines = (order && order.line_items) || [];
  for (const line of lines) {
    const dedicated = propertyValue(line, 'Same-day date');
    if (/^\d{4}-\d{2}-\d{2}$/.test(dedicated)) return dedicated;
  }
  for (const line of lines) {
    const collect = propertyValue(line, 'Collection Date');
    if (/^\d{4}-\d{2}-\d{2}$/.test(collect)) return collect;
  }
  return null;
}

function repairHandleFromOrder(order) {
  const lines = (order && order.line_items) || [];
  for (const line of lines) {
    if (isSameDayLine(line)) continue;
    const handle = String(line.handle || '').trim();
    if (handle) return handle;
  }
  return null;
}

function reserveRequestFromOrder(order) {
  const line = findSameDayLine(order);
  if (!line) return null;
  const date = sameDayDateFromOrder(order);
  return {
    orderId: order.id ? String(order.id) : String(order.order_number || ''),
    date,
    handle: repairHandleFromOrder(order),
    variantId: lineVariantId(line)
  };
}

module.exports = {
  SAME_DAY_VARIANT_IDS,
  SAME_DAY_HANDLES,
  isSameDayLine,
  findSameDayLine,
  sameDayDateFromOrder,
  reserveRequestFromOrder
};
