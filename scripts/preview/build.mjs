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

const banner = (title) => `<div class="pv-bar section-header"><a href="/">Quote wizard preview</a><span>${title}</span><span class="pv-ref">${branch}${sha ? ' · ' + sha : ''}</span></div>`;
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
/* ---- PR #140 Previews: Blog CTA, llms.txt, and Redesigned 3-Video Panel Concept ---- */
const articleSrc = read('sections/main-article.liquid').replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/, '');
const ctaOnlyMatch = articleSrc.match(/\{%-?\s*when 'repair_cta'\s*-?%\}([\s\S]*?)\{%-?\s*endcase\s*-?%\}/);
const ctaLiquid = ctaOnlyMatch ? ctaOnlyMatch[1].replace(/\{\{\s*block\.shopify_attributes\s*\}\}/g, '') : '';

const sampleArticles = [
  {
    label: 'Scenario 1 · MacBook Liquid Damage Article',
    handle: 'navigating-macbook-liquid-damage-and-why-immediate-action-is-crucial',
    title: 'Navigating MacBook Liquid Damage and Why Immediate Action Is Crucial',
    tags: ['MacBook', 'Liquid Damage'],
    excerpt: 'Liquid trapped beneath tightly sealed logic board chips keeps corroding silently even after the keyboard feels dry. Switching off immediately and avoiding rice prevents permanent power-rail damage.',
  },
  {
    label: 'Scenario 2 · Dead / No Power MacBook Article',
    handle: 'macbook-wont-turn-on-logic-board-power-rail-guide',
    title: 'MacBook Won\'t Turn On or Charge? How Component-Level Tracing Saves Your Board',
    tags: ['MacBook', 'No Power', 'Logic Board'],
    excerpt: 'When a MacBook stops taking power at 5V or pulls 0.000A at 20V, the root cause is often a single shorted SMD capacitor or CD3217 USB-C controller rather than a dead Apple Silicon chip.',
  },
  {
    label: 'Scenario 3 · MacBook Screen Repair Article',
    handle: 'the-importance-of-professional-macbook-screen-repairs',
    title: 'The Importance of Professional MacBook Screen Repairs',
    tags: ['MacBook', 'Screen'],
    excerpt: 'Replacing the genuine Apple display panel only inside your original aluminium lid preserves your factory hinges, webcam, and alignment at 30% to 50% less than a full-lid assembly swap.',
  },
  {
    label: 'Scenario 4 · iPhone Not Turning On Article (Edge-Case Guard)',
    handle: 'iphone-not-turning-on-try-these-tips-from-our-repair-experts',
    title: 'iPhone Not Turning On? Try These Tips From Our Repair Experts',
    tags: ['iPhone', 'Not Turning On'],
    excerpt: 'Before assuming your iPhone logic board has failed, test a known-good USB-C or Lightning cable and force-restart sequence. Note how the CTA detects iPhone and routes to iPhone repairs (with same-day screen service) rather than MacBook No Power.',
  },
  {
    label: 'Scenario 5 · General Turnaround Article (Default Fallback)',
    handle: 'how-long-does-a-macbook-repair-take',
    title: 'How Long Does a MacBook Repair Take?',
    tags: ['MacBook', 'Turnaround'],
    excerpt: 'Standard MacBook workshop repairs complete in 2 working days once your device reaches Fitzrovia, with express same-day and next-day service options available subject to capacity, while iPhone screen repairs offer same-day turnaround.',
  },
];

const renderedCtas = [];
for (const a of sampleArticles) {
  const rendered = await engine.parseAndRender(ctaLiquid, {
    article: { handle: a.handle, title: a.title, tags: a.tags },
    pages: {
      'macbook-liquid-damage-repair': { url: '/pages/macbook-liquid-damage-repair' },
      'macbook-no-power-repair': { url: '/pages/macbook-no-power-repair' },
    },
  });
  renderedCtas.push(`<section class="pv-demo-block">
    <div class="pv-demo-tag">${a.label}</div>
    <div class="pv-article-stub">
      <div class="pv-article-slug">/blogs/news/${a.handle}</div>
      <h1>${a.title}</h1>
      <p>${a.excerpt}</p>
    </div>
    ${rendered}
  </section>`);
}

write('blog-cta-preview/index.html', `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Blog CTA Preview · PR #140</title>${pageCss}
<style>
.pv-blog-wrap{max-width:820px;margin:0 auto;padding:28px 20px 80px}
.pv-blog-intro{margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #e5e7eb}
.pv-blog-intro h1{margin:0 0 8px;font-size:28px;letter-spacing:-.03em}
.pv-blog-intro p{margin:0;font-size:14.5px;color:#4b5563;line-height:1.55}
.pv-demo-block{margin:0 0 42px;padding:22px;border-radius:16px;background:#f8fafc;border:1px solid #e5e7eb}
.pv-demo-tag{display:inline-block;margin-bottom:12px;padding:4px 10px;border-radius:999px;background:#111827;color:#fff;font:500 10.5px var(--font-mono);letter-spacing:.05em;text-transform:uppercase}
.pv-article-stub{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;margin-bottom:16px}
.pv-article-slug{font:500 11px var(--font-mono);color:#6b7280;margin-bottom:6px;word-break:break-all}
.pv-article-stub h1{margin:0 0 8px;font-size:20px;line-height:1.25;letter-spacing:-.02em;color:#111827}
.pv-article-stub p{margin:0;font-size:14px;line-height:1.55;color:#4b5563}
.pv-demo-block .ic-article-cta{margin:0 !important;padding:0 !important;max-width:none !important}
</style></head>
<body>${banner('PR #140 · Blog CTA Preview')}<div class="pv-blog-wrap">
  <div class="pv-blog-intro">
    <h1>Dynamic Blog Repair CTA Preview (PR #140)</h1>
    <p>Rendered directly from <code>sections/main-article.liquid</code> across 5 real iCorrect blog article scenarios. Each card adapts automatically to the article topic, reflects same-day iPhone screen repairs + MacBook 2-working-day standard with express options, and falls back safely to <code>/pages/advanced-diagnostic</code> until the new Liquid Damage and Dead/No Power pages are published in Shopify Admin.</p>
  </div>
  ${renderedCtas.join('\n')}
</div></body></html>`);

/* Render templates/page.llms-txt.liquid preview */
const llmsSrc = read('templates/page.llms-txt.liquid').replace(/\{%-?\s*layout\s+none\s*-?%\}/, '');
const llmsRenderedLive = await engine.parseAndRender(llmsSrc, { pages: {} });
const llmsRenderedWithPillar = await engine.parseAndRender(llmsSrc, {
  pages: {
    'macbook-liquid-damage-repair': { url: '/pages/macbook-liquid-damage-repair' },
    'macbook-no-power-repair': { url: '/pages/macbook-no-power-repair' },
  },
});
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
write('llms-txt/index.html', `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>llms.txt Preview · PR #140</title>${pageCss}
<style>
.pv-llms{max-width:900px;margin:0 auto;padding:28px 20px 64px}
.pv-llms h1{margin:0 0 8px;font-size:26px;letter-spacing:-.03em}
.pv-llms p{color:#4b5563;font-size:14.5px;line-height:1.55;margin:0 0 18px}
.pv-llms pre{background:#0f172a;color:#e2e8f0;padding:20px 22px;border-radius:12px;overflow-x:auto;font:400 12.5px/1.6 var(--font-mono);white-space:pre-wrap}
.pv-llms h2{margin:24px 0 8px;font-size:16px;color:#111827}
</style></head>
<body>${banner('PR #140 · /pages/llms-txt Preview')}<div class="pv-llms">
  <h1>/pages/llms-txt Preview (PR #140)</h1>
  <p>Rendered directly from <code>templates/page.llms-txt.liquid</code>. Today (before PR #141 pages exist in Shopify Admin), the two upcoming URLs are hidden so zero 404s are served; once published, they appear automatically.</p>
  <h2>Output once PR #141 pages are live in Shopify Admin</h2>
  <pre>${escHtml(llmsRenderedWithPillar.trim())}</pre>
  <h2>Output today (defensive zero-404 mode before PR #141 pages are created)</h2>
  <pre>${escHtml(llmsRenderedLive.trim())}</pre>
</div></body></html>`);

/* Concept Preview: Redesigned 3-Video Panel (Click-to-Play Facade) */
write('video-panel-concept/index.html', `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Redesigned 3-Video Panel Concept · Preview</title>${pageCss}
<style>
.vp-wrap{max-width:1120px;margin:0 auto;padding:36px 24px 80px}
.vp-kicker{font:500 11px var(--font-mono);letter-spacing:.07em;text-transform:uppercase;color:#6b7280;display:block;margin-bottom:6px}
.vp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px}
.vp-head h1{margin:0 0 6px;font-size:32px;letter-spacing:-.035em;line-height:1.12;color:#111827}
.vp-head p{margin:0;font-size:15px;color:#4b5563;max-width:58ch;line-height:1.5}
.vp-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;background:#eff6ff;border:1px solid #bfdbfe;color:#0b63ce;font:500 11px var(--font-mono);text-transform:uppercase;letter-spacing:.04em}
.vp-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.vp-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.04);display:flex;flex-direction:column}
.vp-media{position:relative;aspect-ratio:4/5;background:#0f172a;overflow:hidden;cursor:pointer}
.vp-media img{width:100%;height:100%;object-fit:cover;filter:brightness(.86);transition:transform .24s ease,filter .24s ease;display:block}
.vp-card:hover .vp-media img{transform:scale(1.03);filter:brightness(.94)}
.vp-media iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.vp-tag{position:absolute;top:12px;left:12px;padding:4px 9px;border-radius:999px;background:rgba(17,24,39,.82);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.16);color:#fff;font:500 10px var(--font-mono);letter-spacing:.04em;text-transform:uppercase}
.vp-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:999px;background:rgba(17,24,39,.88);border:1.5px solid rgba(255,255,255,.32);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,.35);transition:transform .16s ease,background .16s ease}
.vp-card:hover .vp-play{transform:translate(-50%,-50%) scale(1.07);background:#0b63ce;border-color:#93c5fd}
.vp-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:5px}
.vp-body h2{margin:0;font-size:16.5px;font-weight:600;letter-spacing:-.02em;color:#111827;line-height:1.28}
.vp-body p{margin:0;font-size:13.5px;color:#4b5563;line-height:1.48}
.vp-note{margin-top:26px;padding:18px 20px;border-radius:12px;background:#f8fafc;border:1px solid #e5e7eb;font-size:13.5px;color:#374151;line-height:1.55}
.vp-note strong{color:#111827}
@media(max-width:860px){.vp-grid{grid-template-columns:1fr}}
</style></head>
<body>${banner('Concept · Redesigned 3-Video Panel (Click-to-Play Facade)')}
<div class="vp-wrap">
  <div class="vp-head">
    <div>
      <span class="vp-kicker">Inside Our Fitzrovia Workshop · Never Outsourced</span>
      <h1>See how we repair your MacBook</h1>
      <p>Click-to-play facade design replacing the current 3 raw 9:16 YouTube iframes used across 81 templates. Zero YouTube JS loads until a visitor clicks play.</p>
    </div>
    <span class="vp-badge">0 KB YouTube JS on load</span>
  </div>
  <div class="vp-grid">
    <article class="vp-card">
      <div class="vp-media" data-yt="VP2e-2K6fR0" data-title="Why repairing your MacBook beats full replacement" role="button" tabindex="0" aria-label="Play video: Why repairing your MacBook beats full replacement">
        <img src="https://i.ytimg.com/vi/VP2e-2K6fR0/oar2.jpg" alt="iCorrect Fitzrovia MacBook repair walkthrough" loading="lazy">
        <span class="vp-tag">Fitzrovia Bench · 01</span>
        <span class="vp-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l11 6-11 6z"/></svg></span>
      </div>
      <div class="vp-body">
        <h2>Repair is better than replace</h2>
        <p>Why component-level logic board and panel-only repairs keep original Apple hardware alive instead of triggering £700+ swaps.</p>
      </div>
    </article>
    <article class="vp-card">
      <div class="vp-media" data-yt="SVbeyRWUeh0" data-title="Our sustainable microelectronics repair approach" role="button" tabindex="0" aria-label="Play video: Our sustainable microelectronics repair approach">
        <img src="https://i.ytimg.com/vi/SVbeyRWUeh0/oar2.jpg" alt="Sustainable Apple microelectronics repair at iCorrect London" loading="lazy">
        <span class="vp-tag">Fitzrovia Bench · 02</span>
        <span class="vp-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l11 6-11 6z"/></svg></span>
      </div>
      <div class="vp-body">
        <h2>Our repair approach is sustainable</h2>
        <p>Fixing the single shorted capacitor or cracked LCD panel instead of scrapping an entire working chassis and logic board.</p>
      </div>
    </article>
    <article class="vp-card">
      <div class="vp-media" data-yt="6j_C-4PejV4" data-title="How to avoid overpaying for Apple MacBook repairs" role="button" tabindex="0" aria-label="Play video: How to avoid overpaying for Apple MacBook repairs">
        <img src="https://i.ytimg.com/vi/6j_C-4PejV4/oar2.jpg" alt="Component-level MacBook repair pricing vs Apple full assembly swap" loading="lazy">
        <span class="vp-tag">Fitzrovia Bench · 03</span>
        <span class="vp-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l11 6-11 6z"/></svg></span>
      </div>
      <div class="vp-body">
        <h2>Do not overpay for your repairs</h2>
        <p>How upfront fixed component-level quotes in Fitzrovia save 30% to 50% compared to full-assembly store replacements.</p>
      </div>
    </article>
  </div>
  <div class="vp-note">
    <strong>SEO &amp; Core Web Vitals impact:</strong> Replacing the 3 immediate YouTube iframes with click-to-play facades removes ~1.5 MB of third-party YouTube JS and cookies on page load across 81 templates, keeps the exact same YouTube video IDs, replaces generic <code>title="MacBook Video 1"</code> labels with real descriptive titles, and optionally lets us add clean <code>VideoObject</code> JSON-LD. Zero ranking downside; net positive for Core Web Vitals (INP / LCP) and user engagement.
  </div>
</div>
<script>
document.querySelectorAll('[data-yt]').forEach(function(el){
  function load(){
    var id = el.getAttribute('data-yt');
    var title = el.getAttribute('data-title') || 'iCorrect repair video';
    el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + title.replace(/"/g,'') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  }
  el.addEventListener('click', load);
  el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); load(); } });
});
</script></body></html>`);

/* Index */
write('index.html', `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Quote wizard preview</title>${pageCss}
<style>.pv-wrap{max-width:640px;margin:0 auto;padding:24px 20px}.pv-wrap h1{font-size:28px;letter-spacing:-.04em;margin:0 0 8px}
.pv-wrap p,.pv-wrap li{color:#4d4d4d;font-size:15px;line-height:1.5}.pv-links a{display:flex;align-items:center;min-height:56px;padding:0 16px;margin:8px 0;border-radius:12px;box-shadow:0 0 0 1px rgba(0,0,0,.12);color:#171717;text-decoration:none;font-weight:500}</style></head>
<body>${banner('Start')}<div class="pv-wrap"><h1>PR #140 SEO &amp; CTA Preview</h1>
<p>Branch <b>${branch}</b>${sha ? ' at ' + sha : ''}.</p>
<div class="pv-links">
  <a href="/blog-cta-preview/">Blog CTA Preview (5 Real Article Scenarios)</a>
  <a href="/llms-txt/">Updated /pages/llms-txt Output Preview</a>
  <a href="/video-panel-concept/">Redesigned 3-Video Panel Concept (Click-to-Play)</a>
  <a href="/macbook-screen/">MacBook screen repair quote wizard</a>
  <a href="/quote/">All devices quote wizard</a>
</div></div></body></html>`);

console.log(`preview-dist: ${products.size} products, branch ${branch}`);
