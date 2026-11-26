/**
 * PostHog storefront enquiry identity stitch tests.
 * Covers snippets/posthog-tracking.liquid, assets/contact-form-interceptor.js,
 * and assets/quote-wizard.js.
 *
 * Run: node --test scripts/courier/posthog-enquiry-stitch.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '../..');
const trackingSnippet = fs.readFileSync(path.join(root, 'snippets/posthog-tracking.liquid'), 'utf8');
const trackingScript = trackingSnippet.replace(/^[\s\S]*?<script>/, '').replace(/<\/script>[\s\S]*$/, '');
const interceptorSource = fs.readFileSync(path.join(root, 'assets/contact-form-interceptor.js'), 'utf8');
const wizardSource = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');

function runTrackingSnippet({ posthog, quoteEvents } = {}) {
  const listeners = {};
  const document = {
    querySelectorAll: () => [],
    addEventListener: (type, fn) => {
      listeners[type] = listeners[type] || [];
      listeners[type].push(fn);
    },
  };
  const window = {
    location: { origin: 'https://icorrect.co.uk', href: 'https://icorrect.co.uk/pages/contact', pathname: '/pages/contact' },
    icorrectQuoteEvents: quoteEvents || undefined,
  };
  const ctx = {
    window,
    document,
    posthog,
    URL,
    String,
    setTimeout: () => 1,
    setInterval: () => 1,
    clearInterval: () => {},
  };
  vm.runInNewContext(trackingScript, ctx);
  return { window, listeners };
}

describe('snippets/posthog-tracking.liquid enquiry stitch', () => {
  it('normalizes email and identifies visitor with name', () => {
    const calls = [];
    const posthog = {
      __loaded: true,
      get_distinct_id: () => '01a20e8a-6795-7eb2-b9c2-d4816c0b5af7',
      identify: (id, props) => calls.push({ id, props }),
    };
    const { window } = runTrackingSnippet({ posthog });
    assert.equal(window.icorrectPostHog.getDistinctId(), '01a20e8a-6795-7eb2-b9c2-d4816c0b5af7');
    assert.equal(window.icorrectPostHog.identifyEnquiry('  Alice.Smith@Example.COM ', ' Alice Smith '), true);
    assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
      { id: 'alice.smith@example.com', props: { email: 'alice.smith@example.com', name: 'Alice Smith' } },
    ]);
  });

  it('rejects empty or malformed emails without calling identify', () => {
    const calls = [];
    const posthog = {
      __loaded: true,
      get_distinct_id: () => 'anon-123',
      identify: (id, props) => calls.push({ id, props }),
    };
    const { window } = runTrackingSnippet({ posthog });
    assert.equal(window.icorrectPostHog.identifyEnquiry('', 'Bob'), false);
    assert.equal(window.icorrectPostHog.identifyEnquiry('not-an-email', 'Bob'), false);
    assert.equal(window.icorrectPostHog.identifyEnquiry(null), false);
    assert.equal(calls.length, 0);
  });

  it('never throws when posthog is missing or throws internally', () => {
    const { window: w1 } = runTrackingSnippet({ posthog: undefined });
    assert.equal(w1.icorrectPostHog.getDistinctId(), '');
    assert.equal(w1.icorrectPostHog.identifyEnquiry('user@example.com', 'User'), false);

    const brokenPosthog = {
      get_distinct_id: () => { throw new Error('blocked'); },
      identify: () => { throw new Error('blocked'); },
    };
    const { window: w2 } = runTrackingSnippet({ posthog: brokenPosthog });
    assert.equal(w2.icorrectPostHog.getDistinctId(), '');
    assert.equal(w2.icorrectPostHog.identifyEnquiry('user@example.com', 'User'), false);
  });

  it('passively identifies native Shopify /contact forms without preventing default', () => {
    const calls = [];
    const posthog = {
      __loaded: true,
      get_distinct_id: () => 'anon-native',
      identify: (id, props) => calls.push({ id, props }),
    };
    const { listeners } = runTrackingSnippet({ posthog });
    let prevented = false;
    const fakeForm = {
      dataset: {},
      getAttribute: (k) => (k === 'action' ? '/contact#RepairForm' : null),
      querySelector: (sel) => {
        if (sel.includes('email')) return { value: 'Client@Work.co.uk' };
        if (sel.includes('name')) return { value: 'Jamie' };
        return null;
      },
    };
    listeners.submit[0]({ target: fakeForm, preventDefault: () => { prevented = true; } });
    assert.equal(prevented, false);
    assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
      { id: 'client@work.co.uk', props: { email: 'client@work.co.uk', name: 'Jamie' } },
    ]);
  });

  it('skips intercepted contact forms until their webhook succeeds', () => {
    const calls = [];
    const posthog = {
      __loaded: true,
      get_distinct_id: () => 'anon-intercepted',
      identify: (id, props) => calls.push({ id, props }),
    };
    const { listeners } = runTrackingSnippet({ posthog });
    const fakeForm = {
      dataset: { contactIntercept: 'true' },
      getAttribute: () => '/contact',
      querySelector: () => ({ value: 'skip@example.com' }),
    };
    listeners.submit[0]({ target: fakeForm });
    assert.equal(calls.length, 0);
  });
});

describe('assets/contact-form-interceptor.js PostHog stitch', () => {
  function runInterceptor({ fetchResponse, distinctId = '01a20e8a-6795-7eb2-b9c2-d4816c0b5af7', attribution = { channel: 'organic_search' } }) {
    let submitHandler = null;
    const fetchCalls = [];
    const identifyCalls = [];
    const captureCalls = [];

    class FakeHTMLFormElement {
      constructor() {
        this.id = 'ContactForm';
        this.dataset = { contactIntercept: 'true' };
        this.style = {};
        this.parentNode = { insertBefore: () => {} };
      }
      getAttribute() { return '/contact'; }
      addEventListener(type, fn) { if (type === 'submit') submitHandler = fn; }
      querySelector(sel) {
        if (sel === 'button[type="submit"]') return { innerHTML: 'Send', style: {}, disabled: false };
        return null;
      }
      insertBefore() {}
    }

    const form = new FakeHTMLFormElement();
    class FakeFormData {
      entries() {
        return [
          ['contact[name]', 'Test Client'],
          ['contact[email]', 'Test.Client@Example.com'],
          ['contact[body]', 'My MacBook screen is cracked'],
        ][Symbol.iterator]();
      }
    }

    const window = {
      location: { href: 'https://icorrect.co.uk/pages/contact', pathname: '/pages/contact' },
      setTimeout: () => 1,
      clearTimeout: () => {},
      icorrectPostHog: {
        getDistinctId: () => distinctId,
        identifyEnquiry: (email, name) => identifyCalls.push({ email, name }),
      },
      icorrectAttribution: {
        forQuote: () => attribution,
      },
      posthog: {
        get_distinct_id: () => distinctId,
        capture: (evt, props) => captureCalls.push({ evt, props }),
      },
    };

    const document = {
      readyState: 'complete',
      referrer: 'https://www.google.com/',
      body: {},
      head: { appendChild: () => {} },
      querySelectorAll: () => [form],
      getElementById: () => null,
      createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {}, scrollIntoView: () => {} }),
      createTextNode: (t) => t,
      addEventListener: () => {},
    };

    const ctx = {
      window,
      document,
      HTMLFormElement: FakeHTMLFormElement,
      FormData: FakeFormData,
      AbortController: class { abort() {} },
      MutationObserver: class { observe() {} },
      requestAnimationFrame: (fn) => fn(),
      setTimeout: () => 1,
      console: { log: () => {}, error: () => {} },
      fetch: async (url, opts) => {
        fetchCalls.push({ url, body: JSON.parse(opts.body) });
        return fetchResponse;
      },
    };

    vm.runInNewContext(interceptorSource, ctx);
    return { form, submitHandler, fetchCalls, identifyCalls, captureCalls };
  }

  it('sends posthog_distinct_id + attribution on webhook and identifies on success', async () => {
    const { form, submitHandler, fetchCalls, identifyCalls, captureCalls } = runInterceptor({
      fetchResponse: {
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true }),
      },
    });
    await submitHandler({ target: form, preventDefault: () => {} });

    assert.equal(fetchCalls.length, 1);
    assert.equal(fetchCalls[0].body.source, 'shopify-website');
    assert.equal(fetchCalls[0].body.contact.email, 'Test.Client@Example.com');
    assert.equal(fetchCalls[0].body.posthog_distinct_id, '01a20e8a-6795-7eb2-b9c2-d4816c0b5af7');
    assert.deepEqual(fetchCalls[0].body.attribution, { channel: 'organic_search' });

    assert.deepEqual(JSON.parse(JSON.stringify(identifyCalls)), [{ email: 'Test.Client@Example.com', name: 'Test Client' }]);
    assert.deepEqual(JSON.parse(JSON.stringify(captureCalls)), [
      { evt: 'contact_form_submitted', props: { form_type: 'consumer', page_path: '/pages/contact' } },
    ]);
  });

  it('does not identify visitor when webhook submission fails', async () => {
    const { form, submitHandler, identifyCalls, captureCalls } = runInterceptor({
      fetchResponse: {
        ok: false,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: false, error: 'Upstream down' }),
      },
    });
    await submitHandler({ target: form, preventDefault: () => {} });
    assert.equal(identifyCalls.length, 0);
    assert.equal(captureCalls.length, 0);
  });
});

describe('assets/quote-wizard.js PostHog stitch wiring', () => {
  it('attaches posthog_distinct_id and identifies on Ask-a-Question submit', () => {
    assert.match(wizardSource, /questionPayload\.posthog_distinct_id\s*=\s*phDistinctId/);
    assert.match(wizardSource, /icorrectPostHog\.identifyEnquiry\(userEmail,\s*userName\)/);
  });

  it('attaches posthog_distinct_id on email_quote and identifies AFTER fireQuoteEmailRequested', () => {
    assert.match(wizardSource, /payload\.posthog_distinct_id\s*=\s*eqPhId/);
    const fireIdx = wizardSource.indexOf('fireQuoteEmailRequested({');
    const identifyIdx = wizardSource.indexOf('icorrectPostHog.identifyEnquiry(email, name)');
    assert.ok(fireIdx > 0, 'fireQuoteEmailRequested call must exist');
    assert.ok(identifyIdx > fireIdx, 'PostHog identify must run AFTER fireQuoteEmailRequested so quote_events.session_id stays intact');
  });

  it('contains zero em dashes in added stitch comments', () => {
    assert.doesNotMatch(trackingSnippet.slice(trackingSnippet.indexOf('function getDistinctId')), /—/);
    assert.doesNotMatch(interceptorSource, /—/);
  });
});
