/**
 * Contract: named parts faults quote a repair.
 * Diagnostic is for water, data recovery, won't-turn-on / won't-charge,
 * Wi-Fi / Bluetooth / signal, and liquid-evidence labels.
 * Run: node --test scripts/courier/repair-first-triage.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const liquid = fs.readFileSync(
  path.join(__dirname, '../../sections/quote-wizard.liquid'),
  'utf8'
);

const DIAGNOSTIC_CATEGORIES = new Set(['Water Damage', 'Data Recovery']);
const DIAGNOSTIC_LABELS = new Set([
  'Condensation in camera',
  'Won\'t turn on',
  'Won\'t charge',
  'No display, no response',
  'No image, no backlight or no external picture',
  'No signal / "No Service" / "SOS only"',
  'WiFi not connecting or greyed out',
  'Bluetooth not working',
  'WiFi not connecting',
  'Bluetooth not connecting to phone',
  'WiFi not working',
  'SIM not detected',
  'Random shutdowns or reboots',
  'Back camera: no preview or it freezes',
  'Front camera: no preview or it freezes',
]);

const MUST_BE_REPAIR = [
  'Black screen (sound or buttons still work)',
  'Black screen (phone still vibrates/rings)',
  'Keys not responding',
  'Sticky, stuck, or crunchy keys',
  'Trackpad not clicking',
  'Ghost typing or phantom input',
  'Touch Bar not responding or frozen',
  'Touch Bar flickering or displaying incorrectly',
  'Front camera: Face ID error or TrueDepth message',
  'Back camera blurry or shaking',
  'Front camera not working',
  'Microphone not picking up voice',
  'Display dead or unresponsive',
  'Cracked or shattered screen',
  'Physically damaged trackpad',
  'Device powers on, but will not charge',
  'No image, backlight on, external monitor works',
];

const MUST_BE_DIAGNOSTIC = [
  'Back camera: no preview or it freezes',
  'Front camera: no preview or it freezes',
  'Random shutdowns or reboots',
  'Won\'t turn on',
  'Won\'t charge',
  'No display, no response',
  'No image, no backlight or no external picture',
  'No signal / "No Service" / "SOS only"',
  'WiFi not connecting or greyed out',
  'Bluetooth not working',
  'WiFi not connecting',
  'Bluetooth not connecting to phone',
  'WiFi not working',
  'SIM not detected',
];

function extractIssues() {
  const start = liquid.indexOf('var TS = {');
  const end = liquid.indexOf('var VG_DB = [');
  assert.ok(start >= 0 && end > start, 'TS issue map missing');
  const block = liquid.slice(start, end);
  const issues = [];
  let category = null;
  let label = null;
  for (const line of block.split('\n')) {
    const cat = line.match(/^\s+'([^']+)': \[$/);
    if (cat) {
      category = cat[1];
      continue;
    }
    const lab = line.match(/label:\s*'((?:\\'|[^'])*)'/);
    if (lab) label = lab[1].replace(/\\'/g, "'");
    const route = line.match(/route:\s*'([^']+)'/);
    const repairType = line.match(/repairType:\s*'([^']+)'/);
    const onlyWhenMissing = line.match(/onlyWhenMissing:\s*'([^']+)'/);
    if (route && label) {
      issues.push({
        category,
        label,
        route: route[1],
        repairType: repairType ? repairType[1] : null,
        onlyWhenMissing: onlyWhenMissing ? onlyWhenMissing[1] : null,
      });
      label = null;
    }
  }
  return issues;
}

describe('repair-first triage', () => {
  const issues = extractIssues();

  it('parses the issue map', () => {
    assert.ok(issues.length > 40, `expected a full map, got ${issues.length}`);
  });

  it('diagnostic is only for water, data, power-unknown, wireless, or liquid-evidence', () => {
    const unexpected = issues.filter((iss) => {
      if (iss.route !== 'diagnostic') return false;
      if (DIAGNOSTIC_CATEGORIES.has(iss.category)) return false;
      if (DIAGNOSTIC_LABELS.has(iss.label)) return false;
      return true;
    });
    assert.deepEqual(
      unexpected,
      [],
      unexpected.map((i) => `${i.category} / ${i.label}`).join('\n')
    );
  });

  it('named parts faults quote a repair, not a diagnostic', () => {
    for (const label of MUST_BE_REPAIR) {
      const matches = issues.filter((iss) => iss.label === label);
      assert.ok(matches.length > 0, `missing issue: ${label}`);
      const diagnostic = matches.filter((iss) => iss.route === 'diagnostic');
      assert.deepEqual(
        diagnostic,
        [],
        `${label} still routes to diagnostic`
      );
      assert.ok(
        matches.every((iss) => iss.route === 'repair'),
        `${label} should be repair (got ${matches.map((i) => i.route).join(',')})`
      );
    }
  });

  it('won\'t turn on, won\'t charge, and Wi-Fi/Bluetooth/signal stay diagnostic', () => {
    for (const label of MUST_BE_DIAGNOSTIC) {
      const matches = issues.filter((iss) => iss.label === label);
      assert.ok(matches.length > 0, `missing issue: ${label}`);
      assert.ok(
        matches.every((iss) => iss.route === 'diagnostic'),
        `${label} should be diagnostic (got ${matches.map((i) => i.route).join(',')})`
      );
    }
  });

  it('every water-damage issue is diagnostic', () => {
    const water = issues.filter((iss) => iss.category === 'Water Damage');
    assert.ok(water.length >= 8, `expected water-damage paths, got ${water.length}`);
    assert.ok(
      water.every((iss) => iss.route === 'diagnostic'),
      water
        .filter((i) => i.route !== 'diagnostic')
        .map((i) => `${i.label}=${i.route}`)
        .join(', ')
    );
  });

  it('iPad outer glass quotes glass only when that product exists', () => {
    const cracked = issues.filter(
      (iss) => iss.label === 'Cracked glass only (display still works)'
    );
    assert.equal(cracked.length, 2);
    assert.ok(cracked.some((iss) => iss.repairType === 'screen-glass' && iss.route === 'repair'));
    assert.ok(
      cracked.some(
        (iss) =>
          iss.repairType === 'screen' &&
          iss.onlyWhenMissing === 'screen-glass' &&
          iss.route === 'repair'
      )
    );
    const blotches = issues.find(
      (iss) => iss.label === 'Blotches, lines, or a damaged display'
    );
    assert.equal(blotches.repairType, 'screen');
    assert.equal(blotches.route, 'repair');

    const cat = require('../../assets/repair-catalogue-map.json');
    function visibleTypes(repairs) {
      return cracked
        .filter((iss) => {
          if (iss.onlyWhenMissing && repairs[iss.onlyWhenMissing]) return false;
          return !!repairs[iss.repairType];
        })
        .map((iss) => iss.repairType);
    }
    const regular = Object.values(cat.models).find((m) => /iPad 10th Gen/.test(m.name));
    const pro = Object.values(cat.models).find((m) => /iPad Pro 11-inch M4/.test(m.name));
    assert.deepEqual(visibleTypes(regular.repairs), ['screen-glass']);
    assert.deepEqual(visibleTypes(pro.repairs), ['screen']);
  });

  it('data recovery still has diagnostic paths', () => {
    const kept = issues.filter(
      (iss) => iss.category === 'Data Recovery' && iss.route === 'diagnostic'
    );
    assert.ok(kept.length >= 3, `expected data-recovery diagnostic paths, got ${kept.length}`);
  });
});
