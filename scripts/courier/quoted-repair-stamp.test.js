/**
 * Quoted-repair DOM stamp (#65 Terra r1).
 * Run: node --test scripts/courier/quoted-repair-stamp.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { stampQuotedRepair, readQuotedRepair } = require('../../assets/quoted-repair-stamp.js');

describe('stampQuotedRepair', () => {
  it('stores a hostile title with quotes on dataset without creating extra keys', () => {
    const el = { dataset: {} };
    stampQuotedRepair(el, {
      title: 'Repair " onmouseover="xss',
      handle: 'iphone-14-pro-max-screen-replacement',
      repairType: 'screen',
      route: 'repair'
    });
    assert.equal(el.dataset.repair, 'Repair " onmouseover="xss');
    assert.equal(el.dataset.repairHandle, 'iphone-14-pro-max-screen-replacement');
    assert.equal(el.dataset.onmouseover, undefined);
    const read = readQuotedRepair(el);
    assert.equal(read.repair, 'Repair " onmouseover="xss');
    assert.equal(read.repair_handle, 'iphone-14-pro-max-screen-replacement');
    assert.equal(read.repair_type, 'screen');
    assert.equal(read.route, 'repair');
  });

  it('clears empty opts to empty strings', () => {
    const el = { dataset: { repair: 'old' } };
    stampQuotedRepair(el, {});
    assert.equal(el.dataset.repair, '');
  });
});
