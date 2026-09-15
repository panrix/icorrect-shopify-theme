'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {
  evaluateEligibility,
  deviceFromHandle,
  lookupBand,
  start
} = require('./server');

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

  it('GET /same-day/eligibility returns JSON with CORS', async () => {
    const server = start(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    const url = 'http://127.0.0.1:' + port + '/same-day/eligibility?handle=macbook-air-screen&date=2026-09-16&outward=W1B';
    const res = await new Promise((resolve, reject) => {
      http.get(url, resolve).on('error', reject);
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], '*');
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
    await new Promise((resolve) => server.close(resolve));
  });
});
