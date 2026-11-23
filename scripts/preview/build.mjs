#!/usr/bin/env node
/*
 * Static preview of the quote wizard for Vercel (preview links per branch).
 *
 * Renders sections/quote-wizard.liquid with the repo catalogue, copies the theme
 * assets, and writes product JSON so the wizard runs without Shopify. The cart and
 * checkout are stand-ins: "Proceed to checkout" opens a page that shows exactly
 * what the wizard would add to the Shopify cart. Nothing here touches the live store.
 *
 * Vercel project settings:
 *   Install command:  npm i --no-save --no-package-lock liquidjs@10
 *   Build command:    node scripts/preview/build.mjs
 *   Output directory: preview-dist
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'preview-dist');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => {
  const f = path.join(OUT, p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, s);
};

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---- Branch label (Vercel sets these on git deployments) ---- */
const branch = process.env.VERCEL_GIT_COMMIT_REF || 'local';
const sha = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7);

/* ---- Assets ---- */
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), {
  recursive: true,
  filter: (src) => fs.statSync(src).isDirectory() || !/\.liquid$/.test(src),
});

/* ---- Catalogue: models for the wizard menus, products for /products/<handle>.json ---- */
const cat = JSON.parse(read('assets/repair-catalogue-map.json'));
const products = new Map();
const exportFile = 'data/shopify-catalogue-2026-09-11.json';
if (fs.existsSync(path.join(ROOT, exportFile))) {
  for (const p of JSON.parse(read(exportFile)).products || []) products.set(p.handle, p);
}
const groups = { macbook: new Map(), iphone: new Map(), ipad: new Map(), watch: new Map() };
const groupOf = (device, name) => {
  if (device === 'macbook') {
    const m = name.match(/^MacBook (?:Pro|Air)(?: \d+-inch)?|^MacBook \d+-inch|^MacBook/);
    return (m ? m[0] : 'MacBook').replace(/-inch/, '"');
  }
  if (device === 'iphone') return name.split(' ').slice(0, 2).join(' ');
  if (device === 'ipad') {
    const m = name.match(/^iPad (?:Pro|Air|mini)|^iPad/);
    return m ? m[0] : 'iPad';
  }
  return name.split(' ').slice(0, 3).join(' ');
};
for (const m of Object.values(cat.models || {})) {
  const g = groups[m.device];
  if (!g) continue;
  const key = groupOf(m.device, m.name);
  if (!g.has(key)) g.set(key, []);
  g.get(key).push({ title: m.name, url: '/collections/' + m.slug, links: [] });
  for (const r of Object.values(m.repairs || {})) {
    if (products.has(r.handle)) continue;
    products.set(r.handle, {
      id: r.variantId,
      title: r.title,
      handle: r.handle,
      tags: (r.tags || []).join(','),
      variants: [{ id: r.variantId, title: 'Default Title', price: Number(r.price).toFixed(2) }],
    });
  }
}
const linklist = (dev) => ({ links: [...groups[dev]].map(([title, links]) => ({ title, url: '#', links })) });
for (const [handle, p] of products) {
  write(`products/${handle}.json`, JSON.stringify({ product: p }));
  write(`products/${handle}.js`, JSON.stringify({
    ...p,
    variants: (p.variants || []).map((v) => ({ ...v, price: Math.round(parseFloat(v.price) * 100) })),
  }));
}

/* ---- Liquid ---- */
const engine = new Liquid({ strictVariables: false, strictFilters: false });
engine.registerFilter('asset_url', (v) => '/assets/' + v);
engine.registerFilter('stylesheet_tag', (v) => `<link rel="stylesheet" href="${v}">`);
engine.registerFilter('json', (v) => JSON.stringify(v === undefined ? null : v));
engine.registerFilter('money_without_currency', (v) => v);
engine.registerFilter('payment_type_svg_tag', () => read('scripts/preview/klarna.svg'));
const source = read('sections/quote-wizard.liquid').replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/, '');

const baseContext = {
  linklists: {
    'wizard-macbook-models': linklist('macbook'),
    'wizard-iphone-models': linklist('iphone'),
    'wizard-ipad-models': linklist('ipad'),
    'wizard-watch-models': linklist('watch'),
  },
  request: { page_type: 'collection' },
  section: { settings: { heading: 'Get a repair quote', prefill_mode: 'auto', show_map: false } },
  all_products: {},
};

/* Stand-in cart: records what the wizard would send to Shopify. */
const cartShim = `<script>
(function () {
  var KEY = 'qwPreviewCart';
  var origFetch = window.fetch.bind(window);
  function ok(body) { return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })); }
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (/\\/cart\\/add(\\.js)?/.test(url)) {
      var body = init && init.body;
      try { body = typeof body === 'string' ? JSON.parse(body) : body; } catch (e) {}
      if (body instanceof FormData) { var o = {}; body.forEach(function (v, k) { o[k] = v; }); body = o; }
      var log = []; try { log = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) {}
      log.push({ at: new Date().toISOString(), page: location.pathname, body: body });
      sessionStorage.setItem(KEY, JSON.stringify(log));
      return ok({ items: (body && body.items) || [] });
    }
    if (/\\/cart(\\.js|\\/(clear|update|change)\\.js)/.test(url)) return ok({ items: [], item_count: 0, attributes: {} });
    return origFetch(input, init);
  };
})();
</script>`;

const banner = (title) => `<div class="pv-bar"><a href="/">Quote wizard preview</a><span>${title}</span><span class="pv-ref">${branch}${sha ? ' · ' + sha : ''}</span></div>`;
const pageCss = `<style>
:root{--font-sans:"Geist",Arial,sans-serif;--font-mono:"Geist Mono",ui-monospace,monospace}
body{margin:0;background:#fff;font-family:var(--font-sans);color:#171717}
.pv-bar{position:sticky;top:0;z-index:50;display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;padding:8px 16px;background:#171717;color:#d4d4d4;font:500 11px var(--font-mono);letter-spacing:.06em;text-transform:uppercase}
.pv-bar a{color:#fff;text-decoration:none}.pv-ref{margin-left:auto;color:#a3a3a3}
main{max-width:1200px;margin:0 auto;padding:16px 0 64px}
</style>`;

async function renderPage(file, title, ctx) {
  const html = await engine.parseAndRender(source, { ...baseContext, ...ctx });
  write(file, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} · quote wizard preview</title>${pageCss}${cartShim}</head>
<body>${banner(title)}<main>${html}</main></body></html>`);
}

await renderPage('macbook-screen/index.html', 'MacBook screen repair page', {
  template: { name: 'collection' },
  collection: {
    handle: 'macbook-screen-repair-prices',
    title: 'MacBook Screen Repair Prices',
    metafields: { custom: { wizard_device: 'macbook', wizard_fault: '' } },
  },
});
await renderPage('quote/index.html', 'All devices', { template: { name: 'page' }, request: { page_type: 'page' } });

/* Checkout stand-in: shows the cart the wizard built. */
const checkout = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Checkout (preview)</title>${pageCss}
<style>.pv-wrap{max-width:640px;margin:0 auto;padding:24px 20px}.pv-wrap h1{font-size:28px;letter-spacing:-.04em;margin:0 0 8px}
.pv-wrap p{color:#4d4d4d;margin:0 0 16px}.pv-card{border-radius:12px;box-shadow:0 0 0 1px rgba(0,0,0,.08);padding:16px;margin:12px 0}
.pv-row{display:flex;justify-content:space-between;gap:16px;padding:8px 0;font-size:15px}.pv-row+.pv-row{box-shadow:inset 0 1px 0 rgba(0,0,0,.08)}
.pv-row b{font-weight:500;color:#666}.pv-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:8px;background:#171717;color:#fff;text-decoration:none;font-size:14px;font-weight:500}</style></head>
<body>${banner('Checkout stand-in')}<div class="pv-wrap"><h1>This is where Shopify checkout opens.</h1>
<p>In the preview nothing is charged. Below is exactly what the quote wizard added to the cart.</p><div id="pv-cart"></div>
<p><a class="pv-btn" href="javascript:history.back()">Back to the quote</a></p></div>
<script>
var log=[];try{log=JSON.parse(sessionStorage.getItem('qwPreviewCart')||'[]')}catch(e){}
var last=log[log.length-1],el=document.getElementById('pv-cart');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
if(!last){el.innerHTML='<div class="pv-card">No cart yet. Run a quote and press Proceed to checkout.</div>'}
else{var items=(last.body&&last.body.items)||[];el.innerHTML=items.map(function(it,i){var p=it.properties||{};
var rows='<div class="pv-row"><b>Item</b><span>'+esc(it.id)+' × '+esc(it.quantity||1)+'</span></div>'+Object.keys(p).map(function(k){return '<div class="pv-row"><b>'+esc(k)+'</b><span>'+esc(p[k])+'</span></div>'}).join('');
return '<div class="pv-card">'+rows+'</div>'}).join('')}
</script></body></html>`;
write('checkout/index.html', checkout);
write('cart/index.html', checkout);

/* Index */
write('index.html', `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Quote wizard preview</title>${pageCss}
<style>.pv-wrap{max-width:640px;margin:0 auto;padding:24px 20px}.pv-wrap h1{font-size:28px;letter-spacing:-.04em;margin:0 0 8px}
.pv-wrap p,.pv-wrap li{color:#4d4d4d;font-size:15px;line-height:1.5}.pv-links a{display:flex;align-items:center;min-height:56px;padding:0 16px;margin:8px 0;border-radius:12px;box-shadow:0 0 0 1px rgba(0,0,0,.12);color:#171717;text-decoration:none;font-weight:500}</style></head>
<body>${banner('Start')}<div class="pv-wrap"><h1>Quote wizard preview</h1>
<p>Branch <b>${branch}</b>${sha ? ' at ' + sha : ''}. Prices come from the repo catalogue, not the live store. Checkout is a stand-in that shows what would go into the Shopify cart.</p>
<div class="pv-links"><a href="/macbook-screen/">MacBook screen repair page</a><a href="/quote/">All devices</a></div>
<p>Postcodes to try:</p><ul><li><b>W1T 3AB</b>: central London (courier collection or bring it to the workshop)</li><li><b>SE15 4QF</b>: further out in London</li><li><b>M1 4BT</b>: outside London (mail-in)</li></ul></div></body></html>`);

console.log(`preview-dist: ${products.size} products, branch ${branch}`);
