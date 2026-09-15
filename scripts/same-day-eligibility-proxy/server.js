#!/usr/bin/env node
/**
 * Public same-day eligibility (prototype).
 * Browser-safe: no workshop token. GET only.
 *
 * GET /same-day/eligibility?handle=&date=&outward=
 * → { eligible, in_stock, slots_remaining, cutoff_ok, band, device, price_pence }
 *
 * Prototype stock: iPhone / MacBook handles count as in_stock until
 * workshop-os has a Shopify handle → Monday parts map. Slots default to 3.
 * Fail closed for iPad, Watch, missing handle, or non-B1/B2 outward.
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

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

function evaluateEligibility({ handle, date, outward, now } = {}) {
  const device = deviceFromHandle(handle);
  const band = lookupBand(outward);
  const inStock = prototypeInStock(handle, device);
  const slots = SLOT_CAP;
  const wall = londonWall(now);
  const cutoffHour = sameDayCutoffHour(device, band);
  const isToday = date && String(date) === wall.iso;
  const cutoff = !isToday || (cutoffHour != null && wall.hour < cutoffHour);
  const deviceOk = device === 'iphone' || device === 'macbook';
  const bandOk = band === 'B1' || band === 'B2';
  const eligible = Boolean(inStock && slots >= 1 && bandOk && deviceOk);
  return {
    eligible,
    in_stock: inStock,
    slots_remaining: slots,
    cutoff_ok: cutoff,
    band,
    device,
    price_pence: device ? PRICE_PENCE[device] : null
  };
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

function handleRequest(req, res) {
  const url = parseUrl(req);
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
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
  const body = evaluateEligibility({
    handle: url.searchParams.get('handle'),
    date: url.searchParams.get('date'),
    outward: url.searchParams.get('outward')
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

if (require.main === module) {
  start(parseInt(process.env.PORT, 10) || 8061);
}

module.exports = {
  evaluateEligibility,
  deviceFromHandle,
  lookupBand,
  handleRequest,
  start
};
