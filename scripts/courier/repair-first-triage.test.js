/**
 * Contract: quote wizard sends common faults to a repair quote.
 * Diagnostic is only for Water Damage, Data Recovery, and liquid-evidence labels.
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
]);

const MUST_BE_REPAIR = [
  'Won\'t turn on',
  'Won\'t charge',
  'Won\'t charge or charger not recognised',
  'Random shutdowns or reboots',
  'Black screen (external doesn\'t work or untested)',
  'Black screen',
  'No display, no response',
  'Keys not responding',
  'Sticky, stuck, or crunchy keys',
  'Trackpad not clicking',
  'Ghost typing or phantom input',
  'Touch Bar not responding or frozen',
  'Touch Bar flickering or displaying incorrectly',
  'Front camera or Face ID not working',
  'Microphone not picking up voice',
  'Home button or Touch ID not working',
  'Display dead or unresponsive',
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
    if (route && label) {
      issues.push({ category, label, route: route[1] });
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

  it('diagnostic is only for liquid, data recovery, or named liquid-evidence labels', () => {
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

  it('common bookable faults quote a repair, not a diagnostic', () => {
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

  it('water damage and data recovery still use the diagnostic card', () => {
    const kept = issues.filter(
      (iss) =>
        DIAGNOSTIC_CATEGORIES.has(iss.category) && iss.route === 'diagnostic'
    );
    assert.ok(kept.length >= 8, `expected liquid/data diagnostic paths, got ${kept.length}`);
  });
});
