/**
 * Repair-type price pages (macbook-screen-repair-prices, iphone-battery-repair-prices, ...)
 * must land on the issue list for that repair after a model is picked.
 * Before: collection rules gave a repair type key ("screen") but the wizard
 * looked it up as a fault name ("Screen / Display"), so every repair-type page
 * showed "No specific issues found".
 * Run: node --test scripts/courier/repair-type-collections.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const wizard = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
const rules = JSON.parse(fs.readFileSync(path.join(root, 'assets/wizard-collection-prefill.json'), 'utf8'));
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'assets/repair-catalogue-map.json'), 'utf8'));
const { handles: ALL_HANDLES } = JSON.parse(fs.readFileSync(path.join(__dirname, 'repair-prices-collections.fixture.json'), 'utf8'));
const { resolveCollectionPrefill } = require('../../assets/wizard-prefill.js');

function sliceBlock(startMarker, endMarker) {
  const start = wizard.indexOf(startMarker);
  assert.ok(start >= 0, startMarker + ' missing');
  const end = wizard.indexOf(endMarker, start);
  assert.ok(end > start, endMarker + ' missing after ' + startMarker);
  return wizard.slice(start, end + endMarker.length);
}

const src = [
  sliceBlock('  var TS = {', '\n  };'),
  sliceBlock('  var REPAIR_TYPE_TO_FAULT = {', '\n  };'),
  sliceBlock('  var REPAIR_TYPE_ALIASES = {', '};'),
  sliceBlock('  function faultForRepairType(', '\n  }\n'),
].join('\n');
// eslint-disable-next-line no-new-func
const { TS, faultForRepairType, REPAIR_TYPE_ALIASES } = new Function(
  src + '\nreturn { TS: TS, faultForRepairType: faultForRepairType, REPAIR_TYPE_ALIASES: REPAIR_TYPE_ALIASES };'
)();

function faultHasRepair(device, fault, key) {
  const want = [key, REPAIR_TYPE_ALIASES[key]].filter(Boolean);
  return (TS[device][fault] || []).some((i) => i.route === 'repair' && want.includes(i.repairType));
}

/* Every repair-type price page on the store (6 Oct 2026). */
const REPAIR_TYPE_PAGES = {
  'macbook-screen-repair-prices': ['macbook', 'screen', 'Screen / Display'],
  'macbook-battery-repair-prices': ['macbook', 'battery', 'Power / Battery / Charging'],
  'macbook-charging-port-repair-prices': ['macbook', 'charging-port', 'Power / Battery / Charging'],
  'macbook-keyboard-repair-prices': ['macbook', 'keyboard', 'Trackpad / Keyboard'],
  'macbook-trackpad-repair-prices': ['macbook', 'trackpad', 'Trackpad / Keyboard'],
  'macbook-touch-bar-repair-prices': ['macbook', 'touch-bar', 'Touch Bar'],
  'macbook-dustgate-repair-prices': ['macbook', 'dustgate', 'Screen / Display'],
  'macbook-flexgate-repair-prices': ['macbook', 'flexgate', 'Screen / Display'],
  'iphone-screen-repair-prices': ['iphone', 'screen', 'Screen / Display'],
  'iphone-genuine-screen-repair-prices': ['iphone', 'screen', 'Screen / Display'],
  'iphone-battery-repair-prices': ['iphone', 'battery', 'Power / Battery / Charging'],
  'iphone-charging-port-repair-prices': ['iphone', 'charging-port', 'Power / Battery / Charging'],
  'iphone-earpiece-speaker-repair-prices': ['iphone', 'earpiece', 'Audio / Mic / Speaker'],
  'iphone-loudspeaker-repair-prices': ['iphone', 'loudspeaker', 'Audio / Mic / Speaker'],
  'iphone-microphone-repair-prices': ['iphone', 'microphone', 'Audio / Mic / Speaker'],
  'iphone-front-camera-repair-prices': ['iphone', 'front-camera', 'Camera'],
  'iphone-rear-camera-repair-prices': ['iphone', 'rear-camera', 'Camera'],
  'iphone-rear-camera-lens-repair-prices': ['iphone', 'rear-camera-lens', 'Rear Glass'],
  'iphone-rear-glass-repair-prices': ['iphone', 'rear-glass', 'Rear Glass'],
  'ipad-screen-repair-prices': ['ipad', 'screen', 'Screen / Display'],
  'ipad-lcd-display-repair-prices': ['ipad', 'screen', 'Screen / Display'],
  'ipad-battery-repair-prices': ['ipad', 'battery', 'Power / Battery / Charging'],
  'ipad-charging-port-repair-prices': ['ipad', 'charging-port', 'Power / Battery / Charging'],
  'apple-watch-oled-display-repair-prices': ['watch', 'screen', 'Screen / Display'],
  'apple-watch-screen-glass-only-repair-prices': ['watch', 'screen-glass', 'Screen / Display'],
  'apple-watch-battery-repair-prices': ['watch', 'battery', 'Power / Battery / Charging'],
  'apple-watch-heart-rate-monitor-repair-prices': ['watch', 'heart-rate-monitor', 'Rear Glass'],
};

describe('repair-type price pages', () => {
  it('fixture covers every repair-type page we test', () => {
    for (const handle of Object.keys(REPAIR_TYPE_PAGES)) assert.ok(ALL_HANDLES.includes(handle), handle);
  });

  for (const [handle, [device, key, fault]] of Object.entries(REPAIR_TYPE_PAGES)) {
    it(`${handle} → ${device} / ${key} → "${fault}" with matching issues`, () => {
      const p = resolveCollectionPrefill(handle, rules);
      assert.equal(p.device, device);
      assert.equal(p.fault, key);
      assert.equal(faultForRepairType(device, key), fault);
      assert.ok(faultHasRepair(device, fault, key), `no ${key} issue under ${fault}`);
      const offered = Object.values(catalogue.models).filter((m) => m.device === device && m.repairs && m.repairs[key]);
      assert.ok(offered.length > 0, `no ${device} model in the catalogue offers ${key}`);
    });
  }

  it('model and series pages get no repair prefill', () => {
    const repairPages = new Set(Object.keys(REPAIR_TYPE_PAGES));
    const leaked = ALL_HANDLES.filter((h) => !repairPages.has(h) && resolveCollectionPrefill(h, rules).fault);
    assert.deepEqual(leaked, []);
  });

  it('every page with repair-prices still resolves a device (except all-devices)', () => {
    const missing = ALL_HANDLES.filter((h) => h !== 'all-devices-repair-prices' && !resolveCollectionPrefill(h, rules).device);
    assert.deepEqual(missing, []);
  });
});

describe('faultForRepairType', () => {
  it('maps every catalogue repair key to the fault group that lists it', () => {
    const unmapped = [];
    for (const m of Object.values(catalogue.models)) {
      for (const key of Object.keys(m.repairs || {})) {
        if (key === 'diagnostic') continue;
        const fault = faultForRepairType(m.device, key);
        if (!fault) { unmapped.push(`${m.device}:${key}`); continue; }
        assert.ok(faultHasRepair(m.device, fault, key), `${m.device}:${key} → ${fault}`);
      }
    }
    /* Watch side button has no issue card yet; it falls back to the fault picker. */
    assert.deepEqual([...new Set(unmapped)].sort(), ['watch:side-button']);
  });

  it('accepts a fault name as is, any case', () => {
    assert.equal(faultForRepairType('macbook', 'Screen / Display'), 'Screen / Display');
    assert.equal(faultForRepairType('iphone', 'rear glass'), 'Rear Glass');
  });

  it('returns null for diagnostic, unknown keys and unknown devices', () => {
    assert.equal(faultForRepairType('macbook', 'diagnostic'), null);
    assert.equal(faultForRepairType('macbook', 'not-a-repair'), null);
    assert.equal(faultForRepairType('toaster', 'screen'), null);
    assert.equal(faultForRepairType('macbook', ''), null);
  });

  it('resolves per device (lens is Rear Glass on iPhone)', () => {
    assert.equal(faultForRepairType('iphone', 'rear-camera-lens'), 'Rear Glass');
    assert.equal(faultForRepairType('watch', 'heart-rate-monitor'), 'Rear Glass');
    assert.equal(faultForRepairType('ipad', 'screen-glass'), 'Screen / Display');
  });
});

describe('quote-wizard wiring', () => {
  it('collection and device prefill go through faultForRepairType', () => {
    const uses = wizard.match(/S\.preFault = faultForRepairType\(ctx\.device, ctx\.fault\)/g) || [];
    assert.equal(uses.length, 2);
    assert.match(wizard, /S\.preFault = faultForRepairType\(hit\.device, hit\.fault\)/);
    assert.match(wizard, /faultForRepairType\(modelMatch\.device, rt\)/);
    assert.doesNotMatch(wizard, /S\.preFault = ctx\.fault;/);
  });

  it('a prefilled fault with no issues for the model falls back to the fault picker', () => {
    assert.match(wizard, /if \(pf && !getAvailableIssues\(S\.device, pf, _repairsMap\)\.length\) pf = null;/);
  });
});
