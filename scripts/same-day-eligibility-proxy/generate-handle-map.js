#!/usr/bin/env node
/**
 * Build handle → Shopify product id + Monday part ids.
 * Run on the VPS with SHOPIFY_ACCESS_TOKEN + MONDAY_* loaded.
 *
 * Writes scripts/same-day-eligibility-proxy/handle-map.json
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createLiveMondayRequest } = require('./monday-request');
const { PRODUCT_PARTS_RELATION, parseLinkedIds, availableFromPart } = require('./monday-stock');

const STORE = process.env.SHOPIFY_STORE || 'i-correct-final.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const API = process.env.SHOPIFY_API_VERSION || '2024-10';

function isRepairHandle(handle, title) {
  const h = String(handle || '').toLowerCase();
  const t = String(title || '').toLowerCase();
  if (h.includes('iphone') || t.includes('iphone')) return 'iphone';
  if (h.includes('macbook') || h.includes('mac-book') || t.includes('macbook')) return 'macbook';
  return null;
}

async function listProducts() {
  const products = [];
  let page = `/products.json?limit=250&fields=id,handle,title,status`;
  while (page) {
    const url = `https://${STORE}/admin/api/${API}${page.startsWith('/products') ? page : '/products.json?' + page}`;
    const res = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': TOKEN, Accept: 'application/json' }
    });
    if (!res.ok) throw new Error('Shopify products ' + res.status);
    const body = await res.json();
    products.push(...(body.products || []));
    const link = res.headers.get('link') || '';
    const next = link.split(',').map((p) => p.trim()).find((p) => p.includes('rel="next"'));
    if (!next) break;
    const m = next.match(/<([^>]+)>/);
    if (!m) break;
    const u = new URL(m[1]);
    page = u.pathname.replace(/^\/admin\/api\/[^/]+/, '') + u.search;
  }
  return products;
}

async function main() {
  if (!TOKEN) {
    process.stderr.write('SHOPIFY_ACCESS_TOKEN is required\n');
    process.exit(1);
  }
  const mondayRequest = createLiveMondayRequest();
  if (!mondayRequest) {
    process.stderr.write('MONDAY_AUTOMATIONS_TOKEN or MONDAY_APP_TOKEN is required\n');
    process.exit(1);
  }

  const products = await listProducts();
  const map = {};
  let looked = 0;
  for (const product of products) {
    const device = isRepairHandle(product.handle, product.title);
    if (!device) continue;
    looked += 1;
    let partIds = [];
    let available = 0;
    try {
      const found = await mondayRequest({
        kind: 'products',
        shopifyProductIds: [String(product.id)]
      });
      const item = (found.items || [])[0];
      if (item) {
        const rel = (item.column_values || []).find((c) => c.id === PRODUCT_PARTS_RELATION);
        partIds = parseLinkedIds(rel);
        if (partIds.length) {
          const parts = await mondayRequest({ kind: 'parts', ids: partIds });
          available = Math.max(0, ...((parts.items || []).map(availableFromPart)));
        }
      }
    } catch (e) {
      process.stderr.write('skip ' + product.handle + ': ' + e.message + '\n');
    }
    map[String(product.handle).toLowerCase()] = {
      shopify_product_id: String(product.id),
      monday_product_id: null,
      part_ids: partIds,
      available,
      device
    };
  }

  const out = process.env.SAME_DAY_HANDLE_MAP || path.join(__dirname, 'handle-map.json');
  fs.writeFileSync(out, JSON.stringify(map, null, 2) + '\n');
  const mapped = Object.values(map).filter((r) => r.part_ids.length).length;
  process.stdout.write(JSON.stringify({
    products: products.length,
    considered: looked,
    mapped,
    out
  }) + '\n');
}

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(String(err && err.stack || err) + '\n');
    process.exit(1);
  });
}

module.exports = { isRepairHandle, listProducts };
