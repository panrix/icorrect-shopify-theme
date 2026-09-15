'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {
  evaluateEligibility,
  deviceFromHandle,
  lookupBand,
  start,
  setRuntime,
  createRuntime
} = require('./server');
const { createSlotStore } = require('./slots');

describe('same-day eligibility proxy', () => {
  it('maps handles and W1B to iPhone / B1', () => {
    assert.equal(deviceFromHandle('iphone-16-pro-max-screen-replacement'), 'iphone');
    assert.equal(deviceFromHandle('macbook-pro-16-inch-screen-replacement'), 'macbook');
    assert.equal(deviceFromHandle('ipad-pro-glass'), null);
    assert.equal(lookupBand('W1B'), 'B1');
    assert.equal(lookupBand('M1'), null);
  });

  it('W1B iPhone screen is eligible with prototype stock', () => {
    const body = evaluateEligibility({
      handle: 'iphone-16-pro-max-oled-screen-repair',
      date: '2026-09-16',
      outward: 'W1B'
    });
    assert.equal(body.device, 'iphone');
    assert.equal(body.band, 'B1');
    assert.equal(body.in_stock, true);
    assert.equal(body.slots_remaining, 3);
    assert.equal(body.eligible, true);
    assert.equal(body.price_pence, 4900);
  });

  it('uses device= when the Shopify handle has no macbook/iphone token', () => {
    const body = evaluateEligibility({
      handle: 'a3186-screen-replacement',
      date: '2026-09-16',
      outward: 'W1B',
      device: 'macbook'
    });
    assert.equal(body.device, 'macbook');
    assert.equal(body.in_stock, true);
    assert.equal(body.eligible, true);
  });

  it('mail-in / outer postcode and iPad fail closed', () => {
    assert.equal(evaluateEligibility({
      handle: 'macbook-pro-16-inch-screen-replacement',
      date: '2026-09-16',
      outward: 'M1'
    }).eligible, false);
    assert.equal(evaluateEligibility({
      handle: 'ipad-pro-11-screen',
      date: '2026-09-16',
      outward: 'W1B'
    }).in_stock, false);
    assert.equal(evaluateEligibility({
      handle: 'ipad-pro-11-screen',
      date: '2026-09-16',
      outward: 'W1B'
    }).eligible, false);
  });

  it('mapped handle uses ledger qty and the slot store, not prototype stock', () => {
    const store = createSlotStore();
    store.reserve('2026-09-16', 'seed-1');
    const body = evaluateEligibility({
      handle: 'iphone-16-pro-max-oled-screen-repair',
      date: '2026-09-16',
      outward: 'W1B',
      map: { 'iphone-16-pro-max-oled-screen-repair': { part_ids: ['P1'], available: 2 } },
      slotStore: store
    });
    assert.equal(body.in_stock, true);
    assert.equal(body.slots_remaining, 2);
    assert.equal(body.eligible, true);
    const empty = evaluateEligibility({
      handle: 'iphone-16-pro-max-oled-screen-repair',
      date: '2026-09-16',
      outward: 'W1B',
      map: { 'other-handle': { part_ids: ['P1'], available: 9 } },
      slotStore: store
    });
    assert.equal(empty.in_stock, false);
    assert.equal(empty.eligible, false);
  });

  it('GET /same-day/eligibility returns JSON with CORS', async () => {
    setRuntime(createRuntime({ map: {}, reserveSecret: 'test' }));
    const server = start(0);
    await new Promise((resolve) => server.once('listening', resolve));
    try {
      const { port } = server.address();
      const url = 'http://127.0.0.1:' + port + '/same-day/eligibility?handle=macbook-air-screen&date=2026-09-16&outward=W1B';
      const res = await new Promise((resolve, reject) => {
        http.get(url, resolve).on('error', reject);
      });
      assert.equal(res.statusCode, 200);
      const acao = res.headers['access-control-allow-origin'];
      assert.equal(acao, '*');
      assert.equal(String(acao).includes(','), false);
      const raw = await new Promise((resolve, reject) => {
        let buf = '';
        res.on('data', (c) => { buf += c; });
        res.on('end', () => resolve(buf));
        res.on('error', reject);
      });
      const body = JSON.parse(raw);
      assert.equal(body.eligible, true);
      assert.equal(body.device, 'macbook');
      assert.equal(body.price_pence, 14900);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('POST /same-day/reserve binds the cap and rejects a fourth booking', async () => {
    setRuntime(createRuntime({ map: {}, reserveSecret: 'test', slotStore: createSlotStore() }));
    const server = start(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();

    async function reserve(orderId) {
      return new Promise((resolve, reject) => {
        const req = http.request({
          hostname: '127.0.0.1',
          port,
          path: '/same-day/reserve',
          method: 'POST',
          headers: {
            Authorization: 'Bearer test',
            'Content-Type': 'application/json'
          }
        }, (res) => {
          let buf = '';
          res.on('data', (c) => { buf += c; });
          res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(buf) }));
        });
        req.on('error', reject);
        req.end(JSON.stringify({ date: '2026-09-16', orderId }));
      });
    }

    try {
      assert.equal((await reserve('1')).body.ok, true);
      assert.equal((await reserve('2')).body.ok, true);
      assert.equal((await reserve('3')).body.slots_remaining, 0);
      const fourth = await reserve('4');
      assert.equal(fourth.status, 200);
      assert.equal(fourth.body.ok, false);
      const denied = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: '127.0.0.1',
          port,
          path: '/same-day/reserve',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, (res) => {
          let buf = '';
          res.on('data', (c) => { buf += c; });
          res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(buf) }));
        });
        req.on('error', reject);
        req.end(JSON.stringify({ date: '2026-09-16', orderId: 'x' }));
      });
      assert.equal(denied.status, 401);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('nginx snippet does not emit a second Access-Control-Allow-Origin', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const nginx = fs.readFileSync(path.join(__dirname, 'nginx-location.conf'), 'utf8');
    assert.doesNotMatch(nginx, /^\s*add_header\s+Access-Control-Allow-Origin/m);
    assert.match(nginx, /proxy_pass http:\/\/127\.0\.0\.1:8061/);
  });
});
