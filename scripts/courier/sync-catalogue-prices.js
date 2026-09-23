#!/usr/bin/env node
/**
 * Copy Shopify variant prices into the live quote-wizard catalogue.
 *
 * The wizard reads assets/repair-catalogue-map.json on the published theme.
 * This updates only the price on each repair row, matched by variant id.
 * It does not add, remove, or rename repairs.
 *
 *   node scripts/courier/sync-catalogue-prices.js           # write the theme asset when a price differs
 *   node scripts/courier/sync-catalogue-prices.js --dry-run
 *
 * Env: SHOPIFY_ACCESS_TOKEN (required), SHOPIFY_STORE, SHOPIFY_API_VERSION, SHOPIFY_THEME_ID
 */
'use strict';

const STORE = process.env.SHOPIFY_STORE || 'i-correct-final.myshopify.com';
const API = process.env.SHOPIFY_API_VERSION || '2024-01';
const THEME_ID = process.env.SHOPIFY_THEME_ID || '158358438141';
const ASSET_KEY = 'assets/repair-catalogue-map.json';
const BATCH = 50;

function toCents(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function priceNumber(cents) {
  const n = cents / 100;
  return Number.isInteger(n) ? n : Math.round(n * 100) / 100;
}

function collectVariantIds(map) {
  const ids = new Set();
  const models = map && map.models ? map.models : {};
  for (const model of Object.values(models)) {
    const repairs = model && model.repairs ? model.repairs : {};
    for (const row of Object.values(repairs)) {
      const id = row && row.variantId;
      if (id) ids.add(String(id));
    }
  }
  return [...ids];
}

/**
 * @param {object} map parsed catalogue
 * @param {Record<string, number|string>} priceByVariantId Shopify price keyed by numeric variant id
 * @returns {{ changes: object[], missing: object[] }}
 */
function applyVariantPrices(map, priceByVariantId) {
  const changes = [];
  const missing = [];
  const models = map && map.models ? map.models : {};
  for (const modelKey of Object.keys(models)) {
    const repairs = models[modelKey].repairs || {};
    for (const type of Object.keys(repairs)) {
      const row = repairs[type];
      if (!row || !row.variantId) continue;
      const id = String(row.variantId);
      if (!Object.prototype.hasOwnProperty.call(priceByVariantId, id)) {
        missing.push({ modelKey, type, variantId: row.variantId, price: row.price });
        continue;
      }
      const nextCents = toCents(priceByVariantId[id]);
      if (nextCents == null) {
        missing.push({ modelKey, type, variantId: row.variantId, price: row.price });
        continue;
      }
      const prevCents = toCents(row.price);
      if (prevCents === nextCents) continue;
      const next = priceNumber(nextCents);
      changes.push({
        modelKey,
        type,
        variantId: row.variantId,
        from: row.price,
        to: next,
      });
      row.price = next;
    }
  }
  return { changes, missing };
}

async function shopify(path, options) {
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  if (!token) throw new Error('SHOPIFY_ACCESS_TOKEN is not set');
  const res = await fetch(`https://${STORE}/admin/api/${API}${path}`, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
      ...(options && options.headers),
    },
  });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  if (!res.ok) {
    const detail = typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300);
    throw new Error(`Shopify ${res.status} ${path}: ${detail}`);
  }
  return body;
}

async function downloadCatalogue() {
  const body = await shopify(
    `/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(ASSET_KEY)}`
  );
  const value = body && body.asset && body.asset.value;
  if (!value) throw new Error('Theme asset has no inline value: ' + ASSET_KEY);
  return JSON.parse(value);
}

async function fetchVariantPrices(ids) {
  const prices = {};
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    const gids = chunk.map((id) => `gid://shopify/ProductVariant/${id}`);
    const body = await shopify('/graphql.json', {
      method: 'POST',
      body: JSON.stringify({
        query: 'query($ids:[ID!]!){ nodes(ids:$ids){ ... on ProductVariant { id price } } }',
        variables: { ids: gids },
      }),
    });
    if (body.errors) throw new Error('GraphQL: ' + JSON.stringify(body.errors).slice(0, 300));
    const nodes = (body.data && body.data.nodes) || [];
    for (const node of nodes) {
      if (!node || !node.id || node.price == null) continue;
      const id = String(node.id).split('/').pop();
      prices[id] = node.price;
    }
  }
  return prices;
}

async function uploadCatalogue(map) {
  await shopify(`/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    body: JSON.stringify({
      asset: {
        key: ASSET_KEY,
        value: JSON.stringify(map, null, 2),
      },
    }),
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const map = await downloadCatalogue();
  const ids = collectVariantIds(map);
  const prices = await fetchVariantPrices(ids);
  const { changes, missing } = applyVariantPrices(map, prices);
  console.log(JSON.stringify({
    dryRun,
    themeId: THEME_ID,
    variants: ids.length,
    shopifyPrices: Object.keys(prices).length,
    changed: changes.length,
    missing: missing.length,
    changes: changes.slice(0, 40),
    missingSample: missing.slice(0, 10),
  }, null, 2));
  if (!changes.length) {
    console.log('No price changes. Catalogue left as it is.');
    return;
  }
  if (dryRun) {
    console.log('Dry run. Theme asset not updated.');
    return;
  }
  map.price_synced_at = new Date().toISOString();
  await uploadCatalogue(map);
  console.log('Updated ' + changes.length + ' prices on ' + ASSET_KEY);
}

module.exports = {
  toCents,
  applyVariantPrices,
  collectVariantIds,
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
