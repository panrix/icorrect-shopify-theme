#!/usr/bin/env node
/**
 * Generate assets/courier-london-bands.json from data/gophr-london-bands-*.json (#53).
 * Usage: node scripts/courier/generate-bands-asset.js
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const sourceRel = 'data/gophr-london-bands-2026-09-10.json';
const outRel = 'assets/courier-london-bands.json';

const rows = JSON.parse(fs.readFileSync(path.join(root, sourceRel), 'utf8'));
if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error(`Expected non-empty array in ${sourceRel}`);
}

const outward = {};
const bandStats = {};

for (const row of rows) {
  const code = String(row.outward || '').trim().toUpperCase();
  const band = String(row.band || '').trim().toUpperCase();
  const rt = Number(row.rt_cost);
  if (!code || !/^B[1-4]$/.test(band) || !Number.isFinite(rt)) {
    throw new Error(`Invalid band row: ${JSON.stringify(row)}`);
  }
  if (outward[code]) {
    throw new Error(`Duplicate outward code: ${code}`);
  }
  outward[code] = { band, rt_cost: rt };
  if (!bandStats[band]) {
    bandStats[band] = { count: 0, rt_min: rt, rt_max: rt };
  }
  bandStats[band].count += 1;
  bandStats[band].rt_min = Math.min(bandStats[band].rt_min, rt);
  bandStats[band].rt_max = Math.max(bandStats[band].rt_max, rt);
}

const asset = {
  source: sourceRel,
  generated_for: 'courier-first-pivot #53',
  fallback: 'mail-in',
  /**
   * Outward code (postcode prefix before the space, uppercased) → band + RT cost.
   * Unknown codes → mail-in (see assets/courier-pricing.js).
   */
  outward,
  bands: bandStats,
};

const outPath = path.join(root, outRel);
fs.writeFileSync(outPath, `${JSON.stringify(asset, null, 2)}\n`);
console.log(`Wrote ${outRel} (${Object.keys(outward).length} outward codes)`);
