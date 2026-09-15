#!/usr/bin/env node
/**
 * Public same-day eligibility + authenticated slot reserve.
 * Browser-safe GET: no workshop / Monday token.
 *
 * GET  /same-day/eligibility?handle=&date=&outward=&device=
 * POST /same-day/reserve        (Bearer SAME_DAY_RESERVE_SECRET, localhost)
 * POST /same-day/orders-paid    (Bearer SAME_DAY_RESERVE_SECRET)
 *
 * Stock: handle → Monday parts map, then live Monday qty when configured.
 * Prototype stock is only used when the map is empty AND SAME_DAY_PROTOTYPE_STOCK!=0.
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createSlotStore } = require('./slots');
const { loadHandleMap, isInStock } = require('./handle-map');
const { reserveRequestFromOrder } = require('./paid-order');

const LONDON_TZ = 'Europe/London';
const PRICE_PENCE = { iphone: 4900, macbook: 14900 };
const SLOT_CAP = 3;

function loadBands() {
  const candidates = [
    process.env.SAME_DAY_BANDS_JSON,
    path.join(__dirname, '../../assets/courier-london-bands.json'),
    path.join(__dirname, 'courier-london-bands.json')
  ].filter(Boolean);
  for (let i = 0; i < candidates.length; i++) {
    try {
      return JSON.parse(fs.readFileSync(candidates[i], 'utf8'));
    } catch (e) { /* try next */ }
  }
  return { outward: {} };
}

const bandsAsset = loadBands();

function deviceFromHandle(handle) {
  const h = String(handle || '').toLowerCase();
  if (!h) return null;
  if (h.includes('iphone')) return 'iphone';
  if (h.includes('macbook') || h.includes('mac-book')) return 'macbook';
  return null;
}

function extractOutwardCode(outward) {
  if (outward == null) return null;
  const cleaned = String(outward).trim().toUpperCase().replace(/\s+/g, ' ');
  if (!cleaned) return null;
  return cleaned.split(' ')[0] || null;
}

function lookupBand(outward, asset) {
  const code = extractOutwardCode(outward);
  const table = (asset || bandsAsset).outward || {};
  if (!code) return null;
  if (table[code]) return table[code].band || null;
  if (/[A-Z]$/.test(code)) {
    const district = code.slice(0, -1);
    if (table[district]) return table[district].band || null;
  }
  return null;
}

function londonWall(now) {
  const n = now || new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(n);
  const get = (type) => {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].type === type) return parts[i].value;
    }
    return '0';
  };
  const year = parseInt(get('year'), 10);
  const month = parseInt(get('month'), 10) - 1;
  const day = parseInt(get('day'), 10);
  const hour = parseInt(get('hour'), 10);
  const minute = parseInt(get('minute'), 10);
  return {
    iso: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    hour: hour + minute / 60
  };
}

function sameDayCutoffHour(device, band) {
  if (device === 'iphone' && band === 'B1') return 12;
  if (device === 'iphone' && band === 'B2') return 11;
  if (device === 'macbook' && (band === 'B1' || band === 'B2')) return 11;
  return null;
}

function prototypeInStock(handle, device) {
  if (process.env.SAME_DAY_PROTOTYPE_STOCK === '0') return false;
  return device === 'iphone' || device === 'macbook';
}

function availabilityFromMap(map) {
  const out = {};
  for (const row of Object.values(map || {})) {
    const ids = row.part_ids || row.partIds || [];
    const qty = row.available != null ? row.available : row.on_hand;
    for (const id of ids) {
      if (qty != null) out[String(id)] = Number(qty);
    }
  }
  return out;
}

function mapInUse(map) {
  return Boolean(map && Object.keys(map).length);
}

function resolveInStockSync({ handle, device, map, availabilityById, inStock }) {
  if (inStock != null) return Boolean(inStock);
  if (mapInUse(map)) {
    return isInStock(handle, {
      map,
      availabilityById: availabilityById || availabilityFromMap(map)
    });
  }
  return prototypeInStock(handle, device);
}

function evaluateEligibility({
  handle,
  date,
  outward,
  device: deviceHint,
  now,
  inStock,
  slotsRemaining,
  map,
  availabilityById,
  slotStore
} = {}) {
  const device = deviceHint === 'iphone' || deviceHint === 'macbook'
    ? deviceHint
    : deviceFromHandle(handle);
  const band = lookupBand(outward);
  const stock = resolveInStockSync({ handle, device, map, availabilityById, inStock });
  const slots = slotsRemaining != null
    ? Number(slotsRemaining)
    : (slotStore ? slotStore.remaining(date) : SLOT_CAP);
  const wall = londonWall(now);
  const cutoffHour = sameDayCutoffHour(device, band);
  const isToday = date && String(date) === wall.iso;
  const cutoff = !isToday || (cutoffHour != null && wall.hour < cutoffHour);
  const deviceOk = device === 'iphone' || device === 'macbook';
  const bandOk = band === 'B1' || band === 'B2';
  const eligible = Boolean(stock && slots >= 1 && bandOk && deviceOk);
  return {
    eligible,
    in_stock: stock,
    slots_remaining: slots,
    cutoff_ok: cutoff,
    band,
    device,
    price_pence: device ? PRICE_PENCE[device] : null
  };
}

function createRuntime(overrides = {}) {
  const map = overrides.map !== undefined ? overrides.map : loadHandleMap();
  const slotFile = overrides.slotFile || process.env.SAME_DAY_SLOTS_JSON;
  let slotRows = overrides.slotRows || {};
  if (!overrides.slotStore && slotFile) {
    try { slotRows = JSON.parse(fs.readFileSync(slotFile, 'utf8')); } catch (e) { slotRows = {}; }
  }
  const slotStore = overrides.slotStore || createSlotStore({ cap: SLOT_CAP, rows: slotRows });
  const persistSlots = () => {
    if (!slotFile) return;
    fs.mkdirSync(path.dirname(slotFile), { recursive: true });
    fs.writeFileSync(slotFile, JSON.stringify(slotStore.dump(), null, 2));
  };
  return {
    map,
    slotStore,
    persistSlots,
    stockProvider: overrides.stockProvider || null,
    availabilityById: overrides.availabilityById || availabilityFromMap(map),
    reserveSecret: overrides.reserveSecret != null
      ? overrides.reserveSecret
      : (process.env.SAME_DAY_RESERVE_SECRET || '')
  };
}

let runtime = createRuntime();

function setRuntime(next) {
  runtime = next || createRuntime();
  return runtime;
}

function authorizeReserve(req, secret) {
  const expected = secret || runtime.reserveSecret;
  if (!expected) return false;
  const hdr = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || '');
  return hdr === 'Bearer ' + expected || hdr === expected;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch (e) {
        reject(Object.assign(new Error('invalid_json'), { statusCode: 400 }));
      }
    });
    req.on('error', reject);
  });
}

async function resolveStock(params) {
  const device = params.device === 'iphone' || params.device === 'macbook'
    ? params.device
    : deviceFromHandle(params.handle);
  if (runtime.stockProvider) {
    return Boolean(await runtime.stockProvider({
      handle: params.handle,
      device,
      map: runtime.map
    }));
  }
  return resolveInStockSync({
    handle: params.handle,
    device,
    map: runtime.map,
    availabilityById: runtime.availabilityById
  });
}

function cors(res) {
  /* Single ACAO only. Nginx must hide this header before re-adding it;
     browsers reject Access-Control-Allow-Origin: *, * */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
}

function send(res, status, body) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body) + '\n');
}

function parseUrl(req) {
  const host = req.headers.host || '127.0.0.1';
  return new URL(req.url, 'http://' + host);
}

function handleReserveBody(payload) {
  const date = payload && payload.date;
  const orderId = payload && (payload.orderId || payload.order_id);
  const result = runtime.slotStore.reserve(date, orderId);
  runtime.persistSlots();
  return {
    ok: result.ok,
    slots_remaining: result.slotsRemaining,
    idempotent: Boolean(result.idempotent),
    reason: result.reason || null
  };
}

async function handleRequest(req, res) {
  const url = parseUrl(req);
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method === 'POST' && (url.pathname === '/same-day/reserve' || url.pathname === '/same-day/orders-paid')) {
    if (!authorizeReserve(req)) {
      send(res, 401, { error: 'unauthorized' });
      return;
    }
    try {
      const payload = await readJsonBody(req);
      const reservePayload = url.pathname === '/same-day/orders-paid'
        ? reserveRequestFromOrder(payload.order || payload)
        : payload;
      if (!reservePayload || !reservePayload.date) {
        send(res, 200, { ok: false, skipped: true, reason: reservePayload ? 'missing_date' : 'not_same_day' });
        return;
      }
      send(res, 200, handleReserveBody(reservePayload));
    } catch (e) {
      send(res, e.statusCode || 400, { error: e.message || 'bad_request' });
    }
    return;
  }
  if (req.method !== 'GET') {
    send(res, 405, { error: 'method_not_allowed' });
    return;
  }
  if (url.pathname !== '/same-day/eligibility' && url.pathname !== '/') {
    send(res, 404, { error: 'not_found' });
    return;
  }
  const handle = url.searchParams.get('handle');
  const device = url.searchParams.get('device');
  const date = url.searchParams.get('date');
  let inStock;
  try {
    inStock = await resolveStock({ handle, device });
  } catch (e) {
    inStock = false;
  }
  const body = evaluateEligibility({
    handle,
    date,
    outward: url.searchParams.get('outward'),
    device,
    inStock,
    slotStore: runtime.slotStore,
    map: runtime.map
  });
  send(res, 200, body);
}

function start(port) {
  const server = http.createServer(handleRequest);
  server.listen(port, '127.0.0.1', () => {
    process.stderr.write('same-day-eligibility-proxy listening on 127.0.0.1:' + port + '\n');
  });
  return server;
}

function bootRuntime() {
  let stockProvider = null;
  try {
    const { createLiveMondayRequest } = require('./monday-request');
    const { createMondayStockProvider } = require('./monday-stock');
    const mondayRequest = createLiveMondayRequest();
    if (mondayRequest) {
      stockProvider = createMondayStockProvider({ mondayRequest, cacheMs: 60000 });
    }
  } catch (e) { /* keep map / prototype */ }
  return createRuntime({
    stockProvider,
    slotFile: process.env.SAME_DAY_SLOTS_JSON || path.join(__dirname, 'data', 'slots.json')
  });
}

if (require.main === module) {
  setRuntime(bootRuntime());
  start(parseInt(process.env.PORT, 10) || 8061);
}

module.exports = {
  evaluateEligibility,
  deviceFromHandle,
  lookupBand,
  handleRequest,
  start,
  createRuntime,
  setRuntime,
  authorizeReserve
};
