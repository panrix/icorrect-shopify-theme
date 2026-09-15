'use strict';

async function shopifyProductIdFromHandle(handle, deps = {}) {
  const h = String(handle || '').trim();
  if (!h) return null;
  const store = deps.store || process.env.SHOPIFY_STORE;
  const token = deps.token || process.env.SHOPIFY_ACCESS_TOKEN;
  const api = deps.apiVersion || process.env.SHOPIFY_API_VERSION || '2024-10';
  const fetchImpl = deps.fetchImpl || fetch;
  if (!store || !token) return null;
  const url = `https://${store}/admin/api/${api}/products.json?handle=${encodeURIComponent(h)}&fields=id,handle`;
  const res = await fetchImpl(url, {
    headers: { 'X-Shopify-Access-Token': token, Accept: 'application/json' }
  });
  if (!res.ok) return null;
  const body = await res.json();
  const product = (body.products || [])[0];
  return product ? String(product.id) : null;
}

module.exports = { shopifyProductIdFromHandle };
