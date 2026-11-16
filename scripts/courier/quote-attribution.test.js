/**
 * Quote source tracking (snippets/quote-attribution.liquid).
 * Run: node --test scripts/courier/quote-attribution.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '../..');
const snippet = fs.readFileSync(path.join(root, 'snippets/quote-attribution.liquid'), 'utf8');
const script = snippet.replace(/^[\s\S]*?<script>/, '').replace(/<\/script>[\s\S]*$/, '');

function memStore(initial) {
  const m = new Map(Object.entries(initial || {}));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    _m: m,
  };
}

function run({ href, referrer = '', session, local, blocked = false }) {
  const window = { location: { href } };
  if (blocked) {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('SecurityError'); } });
  } else {
    window.sessionStorage = session || memStore();
    window.localStorage = local || memStore();
  }
  const ctx = { window, document: { referrer }, URL, JSON, Date, Object, String };
  vm.runInNewContext(script, ctx);
  return window;
}

describe('quote attribution capture', () => {
  it('paid search from utm + gclid, path only (no query string)', () => {
    const w = run({ href: 'https://icorrect.co.uk/collections/macbook-screen-repair-prices?utm_source=google&utm_medium=cpc&utm_campaign=tracking-check&gclid=abc', referrer: 'https://www.google.com/' });
    const q = w.icorrectAttribution.forQuote();
    assert.equal(q.channel, 'paid_search');
    assert.equal(q.landing_path, '/collections/macbook-screen-repair-prices');
    assert.equal(q.utm_campaign, 'tracking-check');
    assert.equal(q.gclid, true);
    assert.equal(q.referrer_host, 'www.google.com');
    const c = w.icorrectAttribution.forCart();
    assert.deepEqual(
      { _landing_page: c._landing_page, _source: c._source, _medium: c._medium, _campaign: c._campaign, _channel: c._channel, _referrer: c._referrer, _click_id: c._click_id },
      { _landing_page: '/collections/macbook-screen-repair-prices', _source: 'google', _medium: 'cpc', _campaign: 'tracking-check', _channel: 'paid_search', _referrer: 'www.google.com', _click_id: 'gclid' }
    );
    for (const k of Object.keys(c)) assert.match(k, /^_/);
  });

  it('derives organic, social, referral, email, ai and direct', () => {
    const ch = (href, referrer) => run({ href, referrer }).icorrectAttribution.forQuote().channel;
    assert.equal(ch('https://icorrect.co.uk/', 'https://www.google.co.uk/'), 'organic_search');
    assert.equal(ch('https://icorrect.co.uk/', 'https://www.bing.com/'), 'organic_search');
    assert.equal(ch('https://icorrect.co.uk/', 'https://l.facebook.com/'), 'social');
    assert.equal(ch('https://icorrect.co.uk/?fbclid=x', ''), 'social');
    assert.equal(ch('https://icorrect.co.uk/?utm_source=facebook&utm_medium=cpc', ''), 'paid_social');
    assert.equal(ch('https://icorrect.co.uk/', 'https://www.trustpilot.com/'), 'referral');
    assert.equal(ch('https://icorrect.co.uk/?utm_source=klaviyo&utm_medium=email', ''), 'email');
    assert.equal(ch('https://icorrect.co.uk/?utm_source=chatgpt.com', ''), 'ai_assistant');
    assert.equal(ch('https://icorrect.co.uk/', 'https://chatgpt.com/'), 'ai_assistant');
    assert.equal(ch('https://icorrect.co.uk/', ''), 'direct');
    assert.equal(ch('https://icorrect.co.uk/', 'https://icorrect.co.uk/pages/x'), 'direct');
  });

  it('keeps the session first touch on later page views', () => {
    const session = memStore();
    const local = memStore();
    run({ href: 'https://icorrect.co.uk/?utm_source=google&utm_medium=cpc', session, local });
    const w2 = run({ href: 'https://icorrect.co.uk/collections/x', referrer: 'https://icorrect.co.uk/', session, local });
    assert.equal(w2.icorrectAttribution.forQuote().channel, 'paid_search');
    assert.equal(w2.icorrectAttribution.forQuote().landing_path, '/');
  });

  it('keeps the first-ever touch in localStorage across sessions', () => {
    const local = memStore();
    run({ href: 'https://icorrect.co.uk/a?utm_source=google&utm_medium=cpc', local });
    const w2 = run({ href: 'https://icorrect.co.uk/b', referrer: 'https://www.google.com/', local });
    const q = w2.icorrectAttribution.forQuote();
    assert.equal(q.channel, 'organic_search');
    assert.equal(q.first_channel, 'paid_search');
    assert.equal(q.first_landing_path, '/a');
  });

  it('drops values that look like an email or phone number', () => {
    const w = run({ href: 'https://icorrect.co.uk/?utm_source=a%40b.com&utm_term=07123%20456789&utm_medium=email' });
    const q = w.icorrectAttribution.forQuote();
    assert.equal(q.utm_source, undefined);
    assert.equal(q.utm_term, undefined);
    assert.equal(q.channel, 'email');
  });

  it('does not throw when storage is blocked, still exposes the API', () => {
    const w = run({ href: 'https://icorrect.co.uk/?utm_source=google&utm_medium=cpc', blocked: true });
    assert.equal(typeof w.icorrectAttribution.forQuote, 'function');
    assert.equal(w.icorrectAttribution.forQuote().channel, 'paid_search');
  });
});

describe('quote attribution wiring', () => {
  it('theme layout renders the snippet', () => {
    assert.match(fs.readFileSync(path.join(root, 'layout/theme.liquid'), 'utf8'), /render 'quote-attribution'/);
  });
  it('quote_events payload carries attribution', () => {
    assert.match(fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8'), /payload\.attribution = attr/);
  });
  it('checkout writes hidden cart attributes', () => {
    const js = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
    assert.match(js, /icorrectAttribution\.forCart\(\)/);
    assert.match(js, /attributes: cartAttrs/);
  });
});
