/**
 * Regression tests for GRO-1 follow-up fixes:
 * 1. In-page cart replacement dialog in ensureCleanWizardCart (no window.confirm)
 * 2. sections/quote-wizard.liquid drop-off conditional copy and Friday 9am - 6pm default
 *
 * Run: node --test scripts/courier/wizard-cart-confirm-and-copy.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '../..');
const wizardJsPath = path.join(ROOT, 'assets/quote-wizard.js');
const wizardCssPath = path.join(ROOT, 'assets/quote-wizard.css');
const wizardLiquidPath = path.join(ROOT, 'sections/quote-wizard.liquid');

const wizardJs = fs.readFileSync(wizardJsPath, 'utf8');
const wizardCss = fs.readFileSync(wizardCssPath, 'utf8');
const wizardLiquid = fs.readFileSync(wizardLiquidPath, 'utf8');

function sliceFn(src, startNeedle, endNeedle) {
  const start = src.indexOf(startNeedle);
  const end = src.indexOf(endNeedle, start + 1);
  assert.ok(start >= 0 && end > start, `missing ${startNeedle} .. ${endNeedle}`);
  return src.slice(start, end);
}

function createFakeDom() {
  const docListeners = new Map();
  const byId = new Map();

  function makeElement(tagName) {
    const attrs = new Map();
    const listeners = new Map();
    let _id = '';
    const el = {
      tagName: tagName.toUpperCase(),
      className: '',
      textContent: '',
      type: '',
      children: [],
      parentNode: null,
      get id() {
        return _id;
      },
      set id(val) {
        if (_id && byId.get(_id) === el) byId.delete(_id);
        _id = String(val || '');
        if (_id) byId.set(_id, el);
      },
      setAttribute(name, value) {
        attrs.set(name, String(value));
        if (name === 'id') el.id = value;
      },
      getAttribute(name) {
        return attrs.has(name) ? attrs.get(name) : null;
      },
      appendChild(child) {
        child.parentNode = el;
        el.children.push(child);
        registerTree(child);
        return child;
      },
      removeChild(child) {
        const idx = el.children.indexOf(child);
        if (idx >= 0) el.children.splice(idx, 1);
        child.parentNode = null;
        unregisterTree(child);
        return child;
      },
      addEventListener(type, fn) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(fn);
      },
      removeEventListener(type, fn) {
        if (listeners.has(type)) listeners.get(type).delete(fn);
      },
      dispatch(type, event) {
        const set = listeners.get(type);
        if (!set) return;
        const evt = Object.assign({ target: el, preventDefault() {} }, event || {});
        for (const fn of Array.from(set)) fn(evt);
      },
      focus() {
        doc.activeElement = el;
      },
      listenerCount(type) {
        return listeners.has(type) ? listeners.get(type).size : 0;
      },
    };
    return el;
  }

  function registerTree(node) {
    if (node.id) byId.set(node.id, node);
    for (const c of node.children || []) registerTree(c);
  }

  function unregisterTree(node) {
    if (node.id && byId.get(node.id) === node) byId.delete(node.id);
    for (const c of node.children || []) unregisterTree(c);
  }

  const body = makeElement('body');
  const initialFocus = makeElement('button');
  initialFocus.id = 'qwBookBtn';

  const doc = {
    body,
    activeElement: initialFocus,
    createElement: makeElement,
    getElementById(id) {
      return byId.get(id) || null;
    },
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, new Set());
      docListeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      if (docListeners.has(type)) docListeners.get(type).delete(fn);
    },
    dispatch(type, event) {
      const set = docListeners.get(type);
      if (!set) return;
      const evt = Object.assign({ preventDefault() {} }, event || {});
      for (const fn of Array.from(set)) fn(evt);
    },
    listenerCount(type) {
      return docListeners.has(type) ? docListeners.get(type).size : 0;
    },
  };

  return { doc, initialFocus };
}

function loadCartHelpers({ fetchImpl, doc }) {
  const src = sliceFn(
    wizardJs,
    'function getShopifyRoot()',
    '/* Cart funnel diagnostics (PostHog).'
  );
  const tracked = [];
  let nativeConfirmCalls = 0;

  const sandbox = {
    window: {
      Shopify: { routes: { root: '/' } },
      confirm() {
        nativeConfirmCalls++;
        return false;
      },
    },
    document: doc,
    fetch: fetchImpl,
    trackWizardEvent(name, extra) {
      tracked.push({ name, extra: extra ? Object.assign({}, extra) : extra });
    },
    Promise,
    Number,
    String,
    Boolean,
  };

  vm.runInNewContext(
    `${src}\nthis.__exports = { confirmWizardCartReplace, ensureCleanWizardCart };`,
    sandbox
  );

  return {
    confirmWizardCartReplace: sandbox.__exports.confirmWizardCartReplace,
    ensureCleanWizardCart: sandbox.__exports.ensureCleanWizardCart,
    tracked,
    getNativeConfirmCalls: () => nativeConfirmCalls,
  };
}

describe('ensureCleanWizardCart in-page confirmation dialog', () => {
  it('never uses window.confirm in assets/quote-wizard.js and stays under the 300 KB guard', () => {
    assert.equal(/window\.confirm\s*\(/.test(wizardJs), false, 'window.confirm must be removed');
    const sizeBytes = fs.statSync(wizardJsPath).size;
    assert.ok(sizeBytes < 307200, `assets/quote-wizard.js must be under 300 KB, got ${sizeBytes}`);
    assert.match(wizardCss, /\.qw-confirm-modal\b/);
    assert.match(wizardCss, /\.qw-confirm-dialog\b/);
    assert.match(wizardCss, /\.qw-confirm-btn-primary\b/);
    assert.match(wizardCss, /\.qw-confirm-btn-secondary\b/);
  });

  it('returns true immediately on an empty cart without opening a modal or clearing cart', async () => {
    const { doc } = createFakeDom();
    const calls = [];
    const { ensureCleanWizardCart, tracked, getNativeConfirmCalls } = loadCartHelpers({
      doc,
      fetchImpl: async (url, opts) => {
        calls.push({ url, opts });
        return { ok: true, json: async () => ({ items: [] }) };
      },
    });

    const result = await ensureCleanWizardCart();
    assert.equal(result, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/cart.js');
    assert.equal(doc.body.children.length, 0);
    assert.equal(tracked.length, 0);
    assert.equal(getNativeConfirmCalls(), 0);
  });

  it('confirm button resolves true, clears cart, fires wizard_cart_replace_confirmed, cleans up and restores focus', async () => {
    const { doc, initialFocus } = createFakeDom();
    const calls = [];
    const { ensureCleanWizardCart, tracked, getNativeConfirmCalls } = loadCartHelpers({
      doc,
      fetchImpl: async (url, opts) => {
        calls.push({ url, opts });
        if (url === '/cart.js') {
          return { ok: true, json: async () => ({ items: [{ id: 1 }, { id: 2 }] }) };
        }
        if (url === '/cart/clear.js') {
          return { ok: true, json: async () => ({}) };
        }
        throw new Error('Unexpected fetch: ' + url);
      },
    });

    const pending = ensureCleanWizardCart();
    await new Promise((r) => setImmediate(r));

    const modal = doc.getElementById('qwCartConfirmModal');
    assert.ok(modal, 'modal should be mounted on document.body');
    const dialog = modal.children[1];
    assert.equal(dialog.getAttribute('role'), 'dialog');
    assert.equal(dialog.getAttribute('aria-modal'), 'true');
    assert.equal(dialog.getAttribute('aria-labelledby'), 'qwCartConfirmTitle');
    assert.equal(dialog.getAttribute('aria-describedby'), 'qwCartConfirmDesc');

    const title = doc.getElementById('qwCartConfirmTitle');
    const desc = doc.getElementById('qwCartConfirmDesc');
    const yesBtn = doc.getElementById('qwCartConfirmYes');
    const noBtn = doc.getElementById('qwCartConfirmNo');
    assert.ok(title && desc && yesBtn && noBtn);
    assert.equal(doc.activeElement, yesBtn);

    const modalText = [title.textContent, desc.textContent, yesBtn.textContent, noBtn.textContent].join(' ');
    assert.equal(modalText.includes('\u2014'), false, 'dialog copy must not contain em dashes');

    yesBtn.dispatch('click');
    const result = await pending;

    assert.equal(result, true);
    assert.equal(getNativeConfirmCalls(), 0);
    assert.equal(doc.body.children.length, 0, 'modal should be removed on close');
    assert.equal(doc.listenerCount('keydown'), 0, 'keydown listener should be cleaned up');
    assert.equal(doc.activeElement, initialFocus, 'focus should return to prior element');
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, '/cart/clear.js');
    assert.equal(calls[1].opts.method, 'POST');
    assert.deepEqual(tracked, [
      { name: 'wizard_cart_replace_confirmed', extra: { cartItemCount: 2 } },
    ]);
  });

  it('secondary cancel button resolves false, does not clear cart, fires wizard_cart_replace_cancelled', async () => {
    const { doc, initialFocus } = createFakeDom();
    const calls = [];
    const { ensureCleanWizardCart, tracked } = loadCartHelpers({
      doc,
      fetchImpl: async (url) => {
        calls.push(url);
        return { ok: true, json: async () => ({ items: [{ id: 10 }] }) };
      },
    });

    const pending = ensureCleanWizardCart();
    await new Promise((r) => setImmediate(r));

    doc.getElementById('qwCartConfirmNo').dispatch('click');
    const result = await pending;

    assert.equal(result, false);
    assert.deepEqual(calls, ['/cart.js']);
    assert.equal(doc.body.children.length, 0);
    assert.equal(doc.listenerCount('keydown'), 0);
    assert.equal(doc.activeElement, initialFocus);
    assert.deepEqual(tracked, [
      { name: 'wizard_cart_replace_cancelled', extra: { cartItemCount: 1 } },
    ]);
  });

  it('Escape key resolves false, does not clear cart, cleans up and restores focus', async () => {
    const { doc, initialFocus } = createFakeDom();
    const calls = [];
    const { ensureCleanWizardCart, tracked } = loadCartHelpers({
      doc,
      fetchImpl: async (url) => {
        calls.push(url);
        return { ok: true, json: async () => ({ items: [{ id: 1 }, { id: 2 }, { id: 3 }] }) };
      },
    });

    const pending = ensureCleanWizardCart();
    await new Promise((r) => setImmediate(r));

    let prevented = false;
    doc.dispatch('keydown', { key: 'Escape', preventDefault() { prevented = true; } });
    const result = await pending;

    assert.equal(prevented, true);
    assert.equal(result, false);
    assert.deepEqual(calls, ['/cart.js']);
    assert.equal(doc.body.children.length, 0);
    assert.equal(doc.listenerCount('keydown'), 0);
    assert.equal(doc.activeElement, initialFocus);
    assert.deepEqual(tracked, [
      { name: 'wizard_cart_replace_cancelled', extra: { cartItemCount: 3 } },
    ]);
  });

  it('backdrop click resolves false, does not clear cart, cleans up and restores focus', async () => {
    const { doc, initialFocus } = createFakeDom();
    const calls = [];
    const { ensureCleanWizardCart, tracked } = loadCartHelpers({
      doc,
      fetchImpl: async (url) => {
        calls.push(url);
        return { ok: true, json: async () => ({ items: [{ id: 99 }] }) };
      },
    });

    const pending = ensureCleanWizardCart();
    await new Promise((r) => setImmediate(r));

    const modal = doc.getElementById('qwCartConfirmModal');
    const backdrop = modal.children[0];
    assert.equal(backdrop.className, 'qw-confirm-backdrop');
    backdrop.dispatch('click');
    const result = await pending;

    assert.equal(result, false);
    assert.deepEqual(calls, ['/cart.js']);
    assert.equal(doc.body.children.length, 0);
    assert.equal(doc.listenerCount('keydown'), 0);
    assert.equal(doc.activeElement, initialFocus);
    assert.deepEqual(tracked, [
      { name: 'wizard_cart_replace_cancelled', extra: { cartItemCount: 1 } },
    ]);
  });

  it('traps Tab focus between the two modal buttons while open', async () => {
    const { doc } = createFakeDom();
    const { confirmWizardCartReplace } = loadCartHelpers({ doc, fetchImpl: async () => ({}) });

    const pending = confirmWizardCartReplace(1);
    const yesBtn = doc.getElementById('qwCartConfirmYes');
    const noBtn = doc.getElementById('qwCartConfirmNo');

    assert.equal(doc.activeElement, yesBtn);
    doc.dispatch('keydown', { key: 'Tab', shiftKey: true });
    assert.equal(doc.activeElement, noBtn);
    doc.dispatch('keydown', { key: 'Tab', shiftKey: false });
    assert.equal(doc.activeElement, yesBtn);

    noBtn.dispatch('click');
    assert.equal(await pending, false);
  });

  it('prevents duplicate dialogs on double-invocation', async () => {
    const { doc } = createFakeDom();
    const { confirmWizardCartReplace } = loadCartHelpers({ doc, fetchImpl: async () => ({}) });

    const p1 = confirmWizardCartReplace(2);
    const p2 = confirmWizardCartReplace(2);
    assert.equal(p1, p2);
    assert.equal(doc.body.children.length, 1);

    doc.getElementById('qwCartConfirmYes').dispatch('click');
    assert.deepEqual(await Promise.all([p1, p2]), [true, true]);
    assert.equal(doc.body.children.length, 0);
  });

  it('fails safe to false when document.body is unavailable', async () => {
    const { confirmWizardCartReplace } = loadCartHelpers({
      doc: { body: null },
      fetchImpl: async () => ({}),
    });
    const result = await confirmWizardCartReplace(1);
    assert.equal(result, false);
  });

  it('throws on non-OK cart.js without opening modal', async () => {
    const { doc } = createFakeDom();
    const { ensureCleanWizardCart, tracked } = loadCartHelpers({
      doc,
      fetchImpl: async () => ({ ok: false, status: 500 }),
    });

    await assert.rejects(() => ensureCleanWizardCart(), /Could not check the current cart\./);
    assert.equal(doc.body.children.length, 0);
    assert.equal(tracked.length, 0);
  });

  it('throws on non-OK cart/clear.js after confirmation', async () => {
    const { doc } = createFakeDom();
    const { ensureCleanWizardCart, tracked } = loadCartHelpers({
      doc,
      fetchImpl: async (url) => {
        if (url === '/cart.js') return { ok: true, json: async () => ({ items: [{ id: 1 }] }) };
        if (url === '/cart/clear.js') return { ok: false, status: 503 };
        throw new Error('Unexpected URL');
      },
    });

    const pending = ensureCleanWizardCart();
    await new Promise((r) => setImmediate(r));
    doc.getElementById('qwCartConfirmYes').dispatch('click');

    await assert.rejects(
      () => pending,
      /Could not prepare a clean checkout\. Please try again\./
    );
    assert.deepEqual(tracked, [
      { name: 'wizard_cart_replace_confirmed', extra: { cartItemCount: 1 } },
    ]);
  });
});

describe('sections/quote-wizard.liquid copy fixes', () => {
  it('renders workshop drop-off copy unless enable_drop_off is explicitly false', () => {
    const match = wizardLiquid.match(/<p class="qw-no-walkin">([\s\S]*?)<\/p>/);
    assert.ok(match, 'missing .qw-no-walkin paragraph');
    const body = match[1];
    assert.match(
      body,
      /\{%\s*if section\.settings\.enable_drop_off == false\s*%\}Courier collection or tracked mail-in only\.\{%\s*else\s*%\}Courier collection, tracked mail-in, or workshop drop-off\.\{%\s*endif\s*%\}/
    );
    assert.equal(body.includes('\u2014'), false, 'drop-off copy must not contain em dashes');
  });

  it('defaults Friday opening hours to 9am - 6pm in both Liquid and schema', () => {
    assert.match(
      wizardLiquid,
      /<span class="qw-hrs-d">Fri<\/span><span class="qw-hrs-t">\{\{\s*section\.settings\.hours_fri\s*\|\s*default:\s*'9am - 6pm'\s*\}\}<\/span>/
    );
    assert.equal(
      /hours_fri\s*\|\s*default:\s*'10am - 6pm'/.test(wizardLiquid),
      false,
      'stale 10am - 6pm Liquid default for hours_fri must be removed'
    );

    const schemaMatch = wizardLiquid.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    assert.ok(schemaMatch, 'missing schema block');
    const schema = JSON.parse(schemaMatch[1]);
    const fri = schema.settings.find((s) => s.id === 'hours_fri');
    assert.ok(fri, 'missing hours_fri schema setting');
    assert.equal(fri.default, '9am - 6pm');
  });
});
