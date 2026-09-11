#!/usr/bin/env node
/**
 * Build assets/repair-catalogue-map.json from the Shopify Admin catalogue snapshot.
 *
 * Maps taxonomy (device → model → repairType) → variantId + price + tags.
 * Regenerable: node scripts/courier/build-catalogue-map.js
 *
 * #53 — replaces live HTML/collection scraping in the quote wizard.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '../..');
const SOURCE = 'data/shopify-catalogue-2026-09-11.json';
const OUT = 'assets/repair-catalogue-map.json';

/** Tag / title cues → wizard repairType keys (matches HANDLE_SUFFIX_MAP in quote-wizard). */
const REPAIR_RULES = [
  { type: 'diagnostic', re: /\bdiagnostic\b/i },
  { type: 'flexgate', re: /flexgate/i },
  { type: 'dustgate', re: /dustgate/i },
  { type: 'screen-glass', re: /screen glass|glass only|glass repair/i },
  { type: 'screen', re: /\b(screen|display)\b/i },
  { type: 'battery', re: /\bbattery\b/i },
  { type: 'charging-port', re: /charging port|charge port|usb-?c port/i },
  { type: 'keyboard', re: /\bkeyboard\b/i },
  { type: 'trackpad', re: /\btrackpad\b/i },
  { type: 'touch-bar', re: /touch ?bar/i },
  { type: 'loudspeaker', re: /loudspeaker|speaker/i },
  { type: 'earpiece', re: /earpiece/i },
  { type: 'microphone', re: /microphone|\bmic\b/i },
  { type: 'rear-camera-lens', re: /rear camera lens|camera lens/i },
  { type: 'rear-camera', re: /rear camera/i },
  { type: 'front-camera', re: /front camera|selfie camera/i },
  { type: 'face-id', re: /face ?id/i },
  { type: 'heart-rate-monitor', re: /heart rate|rear glass/i },
  { type: 'rear-glass', re: /rear glass|back glass|housing/i },
  { type: 'volume-button', re: /volume button/i },
  { type: 'power-button', re: /power button|side button/i },
  { type: 'mute-button', re: /mute button|silent switch/i },
  { type: 'home-button', re: /home button/i },
  { type: 'side-button', re: /side button/i },
  { type: 'crown', re: /\bcrown\b/i },
];

const SKIP_TITLE = /klarna|gift card|shipping|postage|walk-?in|mail-?in|collection & delivery|test product|dan fry|dov arlauskas/i;

function deviceFromProduct(p) {
  const type = String(p.type || '').toLowerCase();
  const title = String(p.title || '').toLowerCase();
  if (type.includes('macbook') || type.includes('laptop') || title.includes('macbook')) return 'macbook';
  if (type.includes('iphone') || /^iphone\b/.test(title)) return 'iphone';
  if (type.includes('ipad') || /^ipad\b/.test(title)) return 'ipad';
  if (type.includes('watch') || title.includes('apple watch')) return 'watch';
  return null;
}

function repairTypeFromProduct(p) {
  const tags = String(p.tags || '');
  const title = String(p.title || '');
  const handle = String(p.handle || '');
  const blob = `${tags} ${title} ${handle}`;
  for (const rule of REPAIR_RULES) {
    if (rule.re.test(blob)) return rule.type;
  }
  return null;
}

/** Strip trailing fault wording so sibling repairs share one model key. */
function modelNameFromTitle(title, repairType) {
  let name = String(title || '').trim();
  const cutters = [
    /\s+Battery Replacement.*$/i,
    /\s+Battery Repair.*$/i,
    /\s+Charging Port Repair.*$/i,
    /\s+Diagnostic.*$/i,
    /\s+Keyboard Repair.*$/i,
    /\s+Trackpad Repair.*$/i,
    /\s+Touch Bar Repair.*$/i,
    /\s+Screen Repair.*$/i,
    /\s+Screen Glass Repair.*$/i,
    /\s+Display Screen Repair.*$/i,
    /\s+Display Repair.*$/i,
    /\s+Liquid Retina.*Display Repair.*$/i,
    /\s+Flexgate.*$/i,
    /\s+Dustgate.*$/i,
    /\s+Speaker Repair.*$/i,
    /\s+Loudspeaker Repair.*$/i,
    /\s+Earpiece.*$/i,
    /\s+Microphone Repair.*$/i,
    /\s+Front Camera Repair.*$/i,
    /\s+Rear Camera Lens Repair.*$/i,
    /\s+Rear Camera Repair.*$/i,
    /\s+Face ID Repair.*$/i,
    /\s+Heart Rate Monitor.*$/i,
    /\s+Back Glass Repair.*$/i,
    /\s+Rear Glass Repair.*$/i,
    /\s+Housing Repair.*$/i,
    /\s+Volume Button Repair.*$/i,
    /\s+Power Button Repair.*$/i,
    /\s+Side Button Repair.*$/i,
    /\s+Mute Button Repair.*$/i,
    /\s+Home Button Repair.*$/i,
    /\s+Crown Repair.*$/i,
    /\s+Repair$/i,
  ];
  for (const re of cutters) {
    const next = name.replace(re, '');
    if (next !== name && next.length >= 5) {
      name = next.trim();
      break;
    }
  }
  return name;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Ricky tier rule until products are tagged in Admin. */
function inferCourierTier(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return 'full';
  if (n >= 250) return 'free';
  if (n >= 150) return 'subsidised';
  return 'full';
}

function courierTagForTier(tier) {
  return `courier:${tier}`;
}

function main() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, SOURCE), 'utf8'));
  const products = raw.products || [];
  const models = {};
  const stats = {
    products: products.length,
    mapped: 0,
    skipped: 0,
    byDevice: {},
    byRepair: {},
  };

  for (const p of products) {
    if (SKIP_TITLE.test(p.title || '')) {
      stats.skipped += 1;
      continue;
    }
    const device = deviceFromProduct(p);
    const repairType = repairTypeFromProduct(p);
    if (!device || !repairType) {
      stats.skipped += 1;
      continue;
    }
    const variant = (p.variants && p.variants[0]) || {};
    if (!variant.id) {
      stats.skipped += 1;
      continue;
    }
    const modelName = modelNameFromTitle(p.title, repairType);
    const modelKey = `${device}::${slugify(modelName)}`;
    const price = Number(variant.price);
    const tier = inferCourierTier(price);
    const tags = String(p.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (!tags.includes(courierTagForTier(tier))) tags.push(courierTagForTier(tier));

    if (!models[modelKey]) {
      models[modelKey] = {
        device,
        name: modelName,
        slug: slugify(modelName),
        repairs: {},
      };
    }

    const entry = {
      productId: p.id,
      variantId: variant.id,
      handle: p.handle,
      title: p.title,
      price,
      tags,
      courierTier: tier,
      type: p.type || '',
    };

    // Prefer genuine/original screen SKUs when colliding.
    const existing = models[modelKey].repairs[repairType];
    if (existing) {
      const prefer =
        /genuine|original|xdr|oled/i.test(entry.title) &&
        !/genuine|original|xdr|oled/i.test(existing.title);
      if (!prefer && entry.price >= existing.price) {
        // keep existing unless new is clearly better labelled
      } else if (prefer || entry.price < existing.price) {
        models[modelKey].repairs[repairType] = entry;
      }
    } else {
      models[modelKey].repairs[repairType] = entry;
    }

    stats.mapped += 1;
    stats.byDevice[device] = (stats.byDevice[device] || 0) + 1;
    stats.byRepair[repairType] = (stats.byRepair[repairType] || 0) + 1;
  }

  const asset = {
    source: SOURCE,
    generated_for: 'courier-first-pivot #53',
    generated_at: new Date().toISOString().slice(0, 10),
    model_count: Object.keys(models).length,
    repair_count: stats.mapped,
    models,
  };

  fs.writeFileSync(path.join(ROOT, OUT), `${JSON.stringify(asset)}\n`);
  console.log(
    JSON.stringify(
      {
        out: OUT,
        model_count: asset.model_count,
        repair_count: stats.mapped,
        skipped: stats.skipped,
        byDevice: stats.byDevice,
      },
      null,
      2
    )
  );
}

main();
