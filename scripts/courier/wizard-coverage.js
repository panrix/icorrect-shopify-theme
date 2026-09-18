#!/usr/bin/env node
/**
 * Wizard completeness formula:
 *
 *   liveTypes(M) ⊆ wizardTypes(M)
 *   ∧ faultTile(device, t) ∈ FAULTS[device]
 *   ∧ quoteIssues(device, fault) ∩ wizardTypes(M) ≠ ∅
 *
 * M is a wizard menu model. liveTypes come from that model's collection
 * handles via HANDLE_SUFFIX_MAP in sections/quote-wizard.liquid.
 * wizardTypes come from repairsMapForModel (catalogue map + findModel).
 * faultTile applies REPAIR_TYPE_TO_FAULT plus the watch Buttons → Buttons / Crown remap.
 *
 * This is the check that would have failed for iPad Air 11 M3 screen,
 * MacBook A2338 missing repairs, and Watch Ultra side-button.
 *
 * Run: node scripts/courier/wizard-coverage.js
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '../..');
const FORMULA =
  'liveTypes(M) ⊆ wizardTypes(M) ∧ faultTile(device, t) ∈ FAULTS[device] ∧ quoteIssues(fault) ∩ wizardTypes(M) ≠ ∅';

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function sliceVarObject(src, varName) {
  const start = src.indexOf('var ' + varName + ' = {');
  if (start < 0) throw new Error('missing var ' + varName);
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) return src.slice(src.indexOf('{', start), i + 1);
    }
  }
  throw new Error('unclosed var ' + varName);
}

function parseQuotedPairs(objSrc) {
  const out = {};
  const re = /'([^']+)':'([^']+)'/g;
  let m;
  while ((m = re.exec(objSrc))) out[m[1]] = m[2];
  return out;
}

function parseFaultLabels(liquid) {
  const block = sliceVarObject(liquid, 'FAULTS');
  const out = {};
  let device = null;
  for (const line of block.split('\n')) {
    const d = line.match(/^\s+(iphone|ipad|macbook|watch):\s*\[/);
    if (d) {
      device = d[1];
      out[device] = [];
      continue;
    }
    const v = line.match(/\{ v: '([^']+)'/);
    if (v && device) out[device].push(v[1]);
  }
  return out;
}

function parseQuoteIssueTypes(liquid) {
  const start = liquid.indexOf('var TS = {');
  if (start < 0) throw new Error('missing var TS');
  const end = liquid.indexOf('IPHONE VISUAL GUIDE', start);
  const block = liquid.slice(start, end > start ? end : undefined);
  const out = {};
  let device = null;
  let fault = null;
  for (const line of block.split('\n')) {
    const d = line.match(/^\s+(iphone|ipad|macbook|watch):\s*\{/);
    if (d) {
      device = d[1];
      out[device] = {};
      fault = null;
      continue;
    }
    const f = line.match(/^\s+'([^']+)':\s*\[/);
    if (f && device) {
      fault = f[1];
      if (!out[device][fault]) out[device][fault] = [];
      continue;
    }
    const rt = line.match(/route:\s*'repair',\s*repairType:\s*'([^']+)'/);
    if (rt && device && fault && !out[device][fault].includes(rt[1])) {
      out[device][fault].push(rt[1]);
    }
  }
  return out;
}

function typeFromHandle(handle, suffixMap) {
  const h = String(handle || '');
  const keys = Object.keys(suffixMap).sort((a, b) => b.length - a.length);
  for (const suffix of keys) {
    if (h === suffix || h.endsWith('-' + suffix)) return suffixMap[suffix];
  }
  /* iPhone 17 / Monday titles omit the trailing "repair" token. */
  for (const suffix of keys) {
    const bare = suffix.replace(/-repair$/, '');
    if (bare !== suffix && bare.length >= 4 && (h === bare || h.endsWith('-' + bare))) {
      return suffixMap[suffix];
    }
  }
  return null;
}

function faultTile(device, repairType, typeToFault, faultLabels) {
  let fault = typeToFault[repairType];
  if (!fault || fault === '_diagnostic') return null;
  const allowed = new Set(faultLabels[device] || []);
  if (allowed.has(fault)) return fault;
  if (device === 'watch' && fault === 'Buttons' && allowed.has('Buttons / Crown')) {
    return 'Buttons / Crown';
  }
  return null;
}

function parseWizardLogic(liquid) {
  return {
    suffixMap: parseQuotedPairs(sliceVarObject(liquid, 'HANDLE_SUFFIX_MAP')),
    typeToFault: parseQuotedPairs(sliceVarObject(liquid, 'REPAIR_TYPE_TO_FAULT')),
    faultLabels: parseFaultLabels(liquid),
    quoteIssues: parseQuoteIssueTypes(liquid),
  };
}

function auditWizardCoverage(opts) {
  const liquid = opts.liquid || read('sections/quote-wizard.liquid');
  const logic = parseWizardLogic(liquid);
  const map = opts.map;
  const aliases = opts.aliases;
  const catalogue = opts.catalogue;
  const repairsMapForModel = opts.repairsMapForModel;
  const active = new Set((catalogue.products || []).map((p) => p.handle));
  const gaps = [];
  let checked = 0;
  let skus = 0;

  for (const row of aliases.aliases || []) {
    const live = (row.productHandles || []).filter((h) => active.has(h));
    if (live.length < 2) continue;
    checked += 1;
    const repairs = repairsMapForModel(map, row.device, row.menuName) || {};
    const wizardTypes = new Set(Object.keys(repairs));
    const liveTypes = new Set();

    for (const handle of live) {
      skus += 1;
      const t = typeFromHandle(handle, logic.suffixMap);
      if (!t) {
        gaps.push({
          menu: row.menuName,
          device: row.device,
          handle,
          kind: 'unclassified',
        });
        continue;
      }
      liveTypes.add(t);
      if (t !== 'diagnostic' && t !== '_diagnostic') {
        if (!wizardTypes.has(t)) {
          gaps.push({
            menu: row.menuName,
            device: row.device,
            handle,
            kind: 'missing-type',
            type: t,
          });
        }
        const tile = faultTile(row.device, t, logic.typeToFault, logic.faultLabels);
        if (!tile) {
          gaps.push({
            menu: row.menuName,
            device: row.device,
            handle,
            kind: 'hidden-fault',
            type: t,
          });
        } else {
          const issueTypes = (logic.quoteIssues[row.device] || {})[tile] || [];
          if (
            issueTypes.length &&
            !issueTypes.some((qt) => wizardTypes.has(qt))
          ) {
            gaps.push({
              menu: row.menuName,
              device: row.device,
              handle,
              kind: 'hidden-issue',
              type: t,
              fault: tile,
              issueTypes,
            });
          }
        }
      }
    }
  }

  return {
    formula: FORMULA,
    checked,
    skus,
    gaps,
    ok: gaps.length === 0,
    logic,
  };
}

function loadInputs() {
  const {
    repairsMapForModel,
  } = require('../../assets/repair-catalogue.js');
  return {
    map: JSON.parse(read('assets/repair-catalogue-map.json')),
    aliases: JSON.parse(read('data/wizard-menu-aliases.json')),
    catalogue: JSON.parse(read('data/shopify-catalogue-2026-09-15.json')),
    liquid: read('sections/quote-wizard.liquid'),
    repairsMapForModel,
  };
}

function main() {
  const inputs = loadInputs();
  const report = auditWizardCoverage(inputs);
  const m3 = inputs.repairsMapForModel(
    inputs.map,
    'ipad',
    "iPad Air 11\" 7th Gen 'M3' (2025)"
  );
  const summary = {
    formula: report.formula,
    ok: report.ok,
    models: report.checked,
    skus: report.skus,
    gaps: report.gaps.length,
    failures: report.gaps.slice(0, 20),
    proof: {
      ipadAir11M3Screen: m3.screen
        ? { handle: m3.screen.handle, price: Number(m3.screen.variants[0].price) }
        : null,
    },
  };
  console.log(JSON.stringify(summary, null, 2));
  if (!report.ok) process.exit(1);
}

module.exports = {
  FORMULA,
  auditWizardCoverage,
  parseWizardLogic,
  typeFromHandle,
  faultTile,
  loadInputs,
};

if (require.main === module) main();
