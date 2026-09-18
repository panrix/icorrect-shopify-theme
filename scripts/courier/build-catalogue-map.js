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
const SOURCE = 'data/shopify-catalogue-2026-09-15.json';
const ALIASES_SOURCE = 'data/wizard-menu-aliases.json';
const OUT = 'assets/repair-catalogue-map.json';

/** Tag / title cues → wizard repairType keys (matches HANDLE_SUFFIX_MAP in quote-wizard). */
const REPAIR_RULES = [
  { type: 'diagnostic', re: /\bdiagnostic\b/i },
  { type: 'flexgate', re: /flexgate/i },
  { type: 'dustgate', re: /dustgate/i },
  { type: 'screen-glass', re: /screen glass|glass only|glass screen/i },
  { type: 'rear-camera-lens', re: /rear camera lens|camera lens/i },
  { type: 'earpiece', re: /earpiece/i },
  { type: 'loudspeaker', re: /loudspeaker|\bspeaker\b/i },
  { type: 'screen', re: /\b(screen|display)\b/i },
  { type: 'battery', re: /\bbattery\b/i },
  { type: 'charging-port', re: /charging port|charge port|usb-?c port/i },
  { type: 'keyboard', re: /\bkeyboard\b/i },
  { type: 'trackpad', re: /\btrackpad\b/i },
  { type: 'touch-bar', re: /touch ?bar/i },
  { type: 'microphone', re: /microphone|\bmic\b/i },
  { type: 'rear-camera', re: /rear camera/i },
  { type: 'front-camera', re: /front camera|selfie camera/i },
  { type: 'face-id', re: /face ?id/i },
  { type: 'heart-rate-monitor', re: /heart rate/i },
  { type: 'rear-glass', re: /rear glass|back glass|(?:rear )?housing/i },
  { type: 'volume-button', re: /volume button/i },
  { type: 'side-button', re: /side button/i },
  { type: 'power-button', re: /power button/i },
  { type: 'mute-button', re: /mute button|silent switch/i },
  { type: 'home-button', re: /home button/i },
  { type: 'crown', re: /\bcrown\b/i },
];

/** Strip repair wording after the type is known — Monday titles omit "Repair". */
const STRIP_BY_TYPE = {
  diagnostic: [/\s+diagnostic.*$/i],
  battery: [/\s+battery(\s+replacement|\s+repair)?.*$/i],
  'charging-port': [/\s+charging port(\s+repair)?.*$/i],
  keyboard: [/\s+keyboard(\s+repair)?.*$/i],
  trackpad: [/\s+trackpad(\s+repair)?.*$/i],
  'touch-bar': [/\s+touch ?bar(\s+repair)?.*$/i],
  screen: [
    /\s+original(\s+lcd)?\s+screen(\s+repair)?.*$/i,
    /\s+lcd\s+screen(\s+repair)?.*$/i,
    /\s+display screen(\s+repair)?.*$/i,
    /\s+liquid retina.*$/i,
    /\s+display(\s+repair)\b.*$/i,
    /\s+screen(\s+repair)?.*$/i,
    /\s+display(\s+repair)?.*$/i,
  ],
  'screen-glass': [/\s+screen glass(\s+repair)?.*$/i],
  flexgate: [/\s+flexgate.*$/i],
  dustgate: [/\s+dustgate.*$/i],
  loudspeaker: [/\s+(loud)?speaker(\s+repair)?.*$/i],
  earpiece: [/\s+earpiece(\s+speaker)?(\s+repair)?.*$/i],
  microphone: [/\s+microphone(\s+repair)?.*$/i],
  'front-camera': [/\s+front camera(\s+repair)?.*$/i],
  'rear-camera-lens': [/\s+rear camera lens(\s+repair)?.*$/i],
  'rear-camera': [/\s+rear camera(\s+repair)?.*$/i],
  'face-id': [/\s+face ?id(\s+repair)?.*$/i],
  'heart-rate-monitor': [/\s+heart rate monitor.*$/i],
  'rear-glass': [
    /\s+housing\s*&\s*rear glass(\s+replacement|\s+repair)?.*$/i,
    /\s+frame\s*&\s*rear glass(\s+replacement|\s+repair)?.*$/i,
    /\s+(rear|back) glass(\s+replacement|\s+repair)?.*$/i,
    /\s+(rear )?housing(\s+repair)?.*$/i,
  ],
  'volume-button': [/\s+volume button(\s+repair)?.*$/i],
  'power-button': [/\s+power button(\s+repair)?.*$/i],
  'mute-button': [/\s+mute button(\s+repair)?.*$/i],
  'home-button': [/\s+home button(\s+repair)?.*$/i],
  'side-button': [/\s+side button(\s+repair)?.*$/i],
  crown: [/\s+crown(\s+repair)?.*$/i],
};

const SKIP_TITLE = /klarna|gift card|shipping|postage|walk-?in|mail-?in|collection & delivery|test product|dan fry|dov arlauskas/i;
/** Leftover Admin duplicate; Monday/wizard use the cloned `iphone-17-pro-max-screen`. */
const SKIP_HANDLES = new Set(['iphone-17-pro-max-screen-repair']);

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
  const titleHandle = `${p.title || ''} ${p.handle || ''}`;
  const tags = String(p.tags || '');
  for (const rule of REPAIR_RULES) {
    if (rule.re.test(titleHandle)) return rule.type;
  }
  for (const rule of REPAIR_RULES) {
    if (rule.re.test(tags)) return rule.type;
  }
  return null;
}

/** Drop "(Genuine Liquid Retina Display)" notes without eating "(2025)". */
function stripQualityParens(title) {
  return String(title || '')
    .replace(
      /\s*\(([^)]*)\)\s*$/i,
      (full, inner) =>
        /genuine|original|lcd|oled|xdr|liquid retina|no screen message/i.test(inner)
          ? ''
          : full
    )
    .trim();
}

/** Strip trailing fault wording so sibling repairs share one model key. */
function modelNameFromTitle(title, repairType, device) {
  let name = stripQualityParens(title);
  const typed = STRIP_BY_TYPE[repairType] || [];
  const cutters = typed.concat([/\s+Repair$/i]);
  for (const re of cutters) {
    const next = name.replace(re, '').trim();
    if (next !== name && next.length >= 5) {
      name = next;
      break;
    }
  }
  return canonicalizeModelText(name, device).replace(/\s+/g, ' ').trim();
}

/** Wizard menus / Monday Touch Bars use 13"; other SKUs use 13-inch. */
function canonicalizeModelText(s, device) {
  let out = String(s || '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\b(20\d{2})\/(\d{2})\b/g, (_, y, yy) => `${y}-${y.slice(0, 2)}${yy}`)
    .replace(/(\d+(?:\.\d+)?)\s*-?\s*(?:["\u2033](?=[\s'"]|$)|inch\b)/gi, '$1-inch');
  if (device === 'ipad' || device === 'macbook') {
    out = out.replace(/\b(11|12\.9|13|14|15|16)(?!-inch)\b(?=\s)/g, '$1-inch');
  }
  return out;
}

function slugify(s, device) {
  return canonicalizeModelText(s, device)
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function preferRepair(existing, incoming) {
  if (!existing) return incoming;
  const prefer =
    /genuine|original|xdr|oled/i.test(incoming.title) &&
    !/genuine|original|xdr|oled/i.test(existing.title);
  if (prefer) return incoming;
  if (incoming.price < existing.price) return incoming;
  return existing;
}

/** Ricky tier rule until products are tagged in Admin. */
function inferCourierTier(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return 'paid';
  /* Policy v2 (#53): ≥£200 → free (B1–B2), else paid. Tags in Admin beat this. */
  if (n >= 200) return 'free';
  return 'paid';
}

function courierTagForTier(tier) {
  return `courier:${tier}`;
}

function main() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, SOURCE), 'utf8'));
  const products = raw.products || [];
  const models = {};
  const handleToKey = {};
  const stats = {
    products: products.length,
    mapped: 0,
    skipped: 0,
    byDevice: {},
    byRepair: {},
  };

  for (const p of products) {
    if (SKIP_TITLE.test(p.title || '') || SKIP_HANDLES.has(p.handle)) {
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
    const modelName = modelNameFromTitle(p.title, repairType, device);
    const modelKey = `${device}::${slugify(modelName, device)}`;
    const price = Number(variant.price);
    const tier = inferCourierTier(price);
    let tags = String(p.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    /* Policy v2: only stamp courier:free (≥£200). Untagged = paid. */
    if (tier === 'free') {
      const freeTag = courierTagForTier('free');
      if (!tags.includes(freeTag)) tags.push(freeTag);
      tags = tags.filter((t) => !/^courier:(full|subsidised|paid)$/i.test(t));
    } else {
      tags = tags.filter((t) => !/^courier:(full|subsidised|paid)$/i.test(t));
    }

    if (!models[modelKey]) {
      models[modelKey] = {
        device,
        name: modelName,
        slug: slugify(modelName, device),
        aliases: [],
        repairs: {},
      };
    }
    if (p.handle) handleToKey[p.handle] = modelKey;

    /* Wizard reads title/price/variantId/tags/handle per repair
       (assets/repair-catalogue.js asWizardProduct + quote-wizard). */
    const courierTags = tags.filter((t) => /^courier:/i.test(t));
    const entry = {
      variantId: variant.id,
      handle: p.handle,
      title: p.title,
      price,
      tags: courierTags,
    };

    models[modelKey].repairs[repairType] = preferRepair(
      models[modelKey].repairs[repairType],
      entry
    );

    stats.mapped += 1;
    stats.byDevice[device] = (stats.byDevice[device] || 0) + 1;
    stats.byRepair[repairType] = (stats.byRepair[repairType] || 0) + 1;
  }

  const aliasPath = path.join(ROOT, ALIASES_SOURCE);
  if (fs.existsSync(aliasPath)) {
    const aliasDoc = JSON.parse(fs.readFileSync(aliasPath, 'utf8'));
    for (const row of aliasDoc.aliases || []) {
      const counts = {};
      for (const handle of row.productHandles || []) {
        const key = handleToKey[handle];
        if (!key || !models[key]) continue;
        counts[key] = (counts[key] || 0) + 1;
      }
      const keys = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a] || a.localeCompare(b)
      );
      if (!keys.length) continue;
      const primaryKey = keys[0];
      const model = models[primaryKey];
      const alias = String(row.menuName || '').trim();
      if (
        alias &&
        !model.aliases.includes(alias) &&
        slugify(alias, row.device) !== model.slug
      ) {
        model.aliases.push(alias);
      }
      /* Collection SKUs that title-stripping split onto another key still quote. */
      for (const handle of row.productHandles || []) {
        const key = handleToKey[handle];
        const src = key && models[key];
        if (!src) continue;
        for (const [rt, entry] of Object.entries(src.repairs || {})) {
          if (entry.handle !== handle) continue;
          model.repairs[rt] = preferRepair(model.repairs[rt], entry);
          handleToKey[handle] = primaryKey;
        }
      }
    }
  }

  const handleOwners = {};
  for (const [key, model] of Object.entries(models)) {
    for (const entry of Object.values(model.repairs || {})) {
      if (!entry.handle) continue;
      if (!handleOwners[entry.handle]) handleOwners[entry.handle] = [];
      handleOwners[entry.handle].push(key);
    }
  }
  for (const [key, model] of Object.entries(models)) {
    const handles = Object.values(model.repairs || {})
      .map((e) => e.handle)
      .filter(Boolean);
    const absorbed =
      handles.length &&
      handles.every((h) => (handleOwners[h] || []).some((k) => k !== key));
    const hasAlias = Array.isArray(model.aliases) && model.aliases.length;
    if (absorbed && !hasAlias) delete models[key];
  }

  for (const model of Object.values(models)) {
    if (!model.aliases.length) delete model.aliases;
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

  const { auditWizardCoverage } = require('./wizard-coverage');
  const { repairsMapForModel } = require('../../assets/repair-catalogue.js');
  const coverage = auditWizardCoverage({
    map: asset,
    aliases: fs.existsSync(aliasPath)
      ? JSON.parse(fs.readFileSync(aliasPath, 'utf8'))
      : { aliases: [] },
    catalogue: raw,
    liquid: fs.readFileSync(path.join(ROOT, 'sections/quote-wizard.liquid'), 'utf8'),
    repairsMapForModel,
  });
  if (!coverage.ok) {
    console.error(
      JSON.stringify(
        { formula: coverage.formula, gaps: coverage.gaps },
        null,
        2
      )
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        out: OUT,
        model_count: asset.model_count,
        repair_count: stats.mapped,
        skipped: stats.skipped,
        byDevice: stats.byDevice,
        coverage: {
          formula: coverage.formula,
          models: coverage.checked,
          skus: coverage.skus,
          gaps: coverage.gaps.length,
        },
      },
      null,
      2
    )
  );
}

main();
