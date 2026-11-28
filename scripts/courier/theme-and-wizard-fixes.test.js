/**
 * Regression tests for Ricky's approved theme and quote wizard fixes:
 * 1. layout/theme.liquid smooth-scroll guard + details-disclosure.js / details-modal.js null guards
 * 2. Trust tile star removal + Fitzrovia Mon to Fri 9am to 6pm hours
 * 3. B3/B4 under-200 mail-in explanation note and disabled courier hint
 * 4. Dawn div:empty .qw-confirm-backdrop fix
 * 5. Mobile CTA ordering above #qwDeliveryReveal, cookie banner offset, and deterministic sticky CTA
 *
 * Run: node --test scripts/courier/theme-and-wizard-fixes.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '../..');
const themeLiquid = fs.readFileSync(path.join(ROOT, 'layout/theme.liquid'), 'utf8');
const detailsDisclosureJs = fs.readFileSync(path.join(ROOT, 'assets/details-disclosure.js'), 'utf8');
const detailsModalJs = fs.readFileSync(path.join(ROOT, 'assets/details-modal.js'), 'utf8');
const wizardJs = fs.readFileSync(path.join(ROOT, 'assets/quote-wizard.js'), 'utf8');
const wizardWalkinJs = (fs.existsSync(path.join(ROOT, 'assets/quote-wizard-walkin.js')) ? fs.readFileSync(path.join(ROOT, 'assets/quote-wizard-walkin.js'), 'utf8') : '');
const wizardLayoutJs = (fs.existsSync(path.join(ROOT, 'assets/quote-wizard-layout.js')) ? fs.readFileSync(path.join(ROOT, 'assets/quote-wizard-layout.js'), 'utf8') : '');
const wizardCss = fs.readFileSync(path.join(ROOT, 'assets/quote-wizard.css'), 'utf8');
const baseCss = fs.readFileSync(path.join(ROOT, 'assets/base.css'), 'utf8');

function sliceFn(src, startNeedle, endNeedle) {
  const start = src.indexOf(startNeedle);
  const end = src.indexOf(endNeedle, start + 1);
  assert.ok(start >= 0 && end > start, `missing ${startNeedle} .. ${endNeedle}`);
  return src.slice(start, end);
}

describe('Item 1: theme.liquid smooth-scroll guard and details element null-guards', () => {
  it('skips bare "#" and invalid selectors in layout/theme.liquid smooth-scroll handler', () => {
    const match = themeLiquid.match(/<script>\s*document\.addEventListener\('DOMContentLoaded',function\(\)\{[\s\S]*?a\[href\^="#"\][\s\S]*?\}\);\s*<\/script>/);
    assert.ok(match, 'smooth-scroll script block missing in layout/theme.liquid');
    const code = match[0].replace(/^<script>|<\/script>$/g, '');

    let domReadyCb = null;
    const scrolled = [];
    const targetEl = { scrollIntoView: (opts) => scrolled.push(opts && opts.behavior) };

    function makeLink(href) {
      let clickHandler = null;
      return {
        getAttribute: (name) => (name === 'href' ? href : null),
        addEventListener: (ev, fn) => { if (ev === 'click') clickHandler = fn; },
        click() {
          let prevented = false;
          clickHandler.call(this, { preventDefault() { prevented = true; } });
          return prevented;
        },
      };
    }

    const bareLink = makeLink('#');
    const invalidLink = makeLink('#bad[selector');
    const validLink = makeLink('#get-free-quote');
    let queriedSelectors = [];

    const sandbox = {
      document: {
        addEventListener: (ev, fn) => { if (ev === 'DOMContentLoaded') domReadyCb = fn; },
        querySelectorAll: () => [bareLink, invalidLink, validLink],
        querySelector: (sel) => {
          queriedSelectors.push(sel);
          if (sel === '#' || sel === '#bad[selector') {
            throw new SyntaxError(`'${sel}' is not a valid selector`);
          }
          return sel === '#get-free-quote' ? targetEl : null;
        },
      },
    };

    vm.runInNewContext(code, sandbox);
    assert.ok(domReadyCb, 'DOMContentLoaded listener registered');
    domReadyCb();

    assert.equal(bareLink.click(), false, 'bare # must not throw or preventDefault');
    assert.equal(queriedSelectors.includes('#'), false, 'bare # must not be passed to querySelector');
    assert.equal(invalidLink.click(), false, 'invalid selector must be caught safely');
    assert.equal(validLink.click(), true, 'valid hash anchor scrolls smoothly');
    assert.deepEqual(scrolled, ['smooth']);
  });

  it('DetailsDisclosure and HeaderMenu do not throw when details or summary are missing', () => {
    const defined = {};
    class FakeHTMLElement {
      querySelector() { return null; }
      contains() { return false; }
    }
    const sandbox = {
      window: {},
      HTMLElement: FakeHTMLElement,
      customElements: { define: (name, cls) => { defined[name] = cls; } },
      document: {
        activeElement: null,
        querySelector: () => null,
        documentElement: { style: { getPropertyValue: () => '', setProperty: () => {} } },
      },
      setTimeout: (fn) => fn(),
    };

    vm.runInNewContext(detailsDisclosureJs, sandbox);
    const dd = new defined['details-disclosure']();
    assert.doesNotThrow(() => dd.onToggle());
    assert.doesNotThrow(() => dd.close());
    assert.doesNotThrow(() => dd.onFocusOut());

    const hm = new defined['header-menu']();
    assert.doesNotThrow(() => hm.onToggle());
    assert.doesNotThrow(() => hm.close());
  });

  it('DetailsModal does not throw when details, summary, or close button are missing', () => {
    const defined = {};
    class FakeHTMLElement {
      querySelector() { return null; }
      contains() { return false; }
    }
    const sandbox = {
      HTMLElement: FakeHTMLElement,
      customElements: { define: (name, cls) => { defined[name] = cls; } },
      document: {
        body: {
          addEventListener: () => {},
          removeEventListener: () => {},
          classList: { add: () => {}, remove: () => {} },
        },
      },
      trapFocus: () => {},
      removeTrapFocus: () => {},
    };

    vm.runInNewContext(detailsModalJs, sandbox);
    const modal = new defined['details-modal']();
    assert.equal(modal.isOpen(), false);
    assert.doesNotThrow(() => modal.onSummaryClick({ preventDefault() {}, target: { closest: () => null } }));
    assert.doesNotThrow(() => modal.open({ target: { closest: () => null } }));
    assert.doesNotThrow(() => modal.onBodyClick({ target: null }));
    assert.doesNotThrow(() => modal.close());
  });
});

describe('Item 2: remove star icons and set Fitzrovia hours to Mon to Fri 9am to 6pm', () => {
  it('GRO-8: keeps the gold stars (restored pre-23 Nov look), no aggregateRating, and the 4.8 from 750+ wording', () => {
    assert.equal(wizardJs.includes('qw-trust-stars'), true);
    assert.equal(wizardJs.includes('aggregateRating'), false);
    assert.match(wizardJs, /aria-label="4\.8 from 750\+ Google reviews"/);
    assert.match(wizardJs, /qw-trust-sub">750\+ Google reviews</);
    assert.equal(wizardJs.includes('qw-trust-sub">from 750+ Google reviews'), false);
  });

  it('GRO-8: Klarna line is the official no-disclosure wording with no amount', () => {
    assert.match(wizardJs, /qw-klarna-text">Pay with Klarna</);
    assert.equal(wizardJs.includes('interest-free payments of'), false);
    assert.equal(wizardJs.includes('Pay in 3 with Klarna at checkout'), false);
  });

  it('uses Mon to Fri 9am to 6pm on Fitzrovia drop-off card and walk-in morning window on Fridays', () => {
    assert.match(wizardJs, /12 Margaret Street, Fitzrovia W1W 8JQ\. Mon to Fri 9am to 6pm\./);
    assert.equal(/Fri 10am to 6pm/.test(wizardJs), false);

    const sandbox = { window: {} };
    vm.runInNewContext(wizardWalkinJs, sandbox);
    const friday = new Date(2026, 10, 27);
    assert.equal(friday.getDay(), 5);
    assert.equal(sandbox.window.ICorrectWalkin.windowLabel('AM', friday), '9am \u2013 12pm');
  });
});

/* GRO-8: Item 4 copy (b3b4MailInThresholdCopy) belongs to the #134 wizard that the restore replaced */
describe.skip('Item 4: B3/B4 under-200 mail-in explanation and courier pill hint', () => {
  const b3b4Chunk = sliceFn(wizardJs, 'function b3b4MailInThresholdCopy(', 'function paintPostcodeSummary()');
  const hintChunk = sliceFn(wizardJs, 'function formatServiceCardHint(', '/* Hide mail-in only');

  function makeB3B4Helpers(postcodeResolved) {
    const fn = new Function(
      'serviceCharge',
      '_postcodeResolved',
      'document',
      'quoteForService',
      `${b3b4Chunk}\n${hintChunk}\nreturn { b3b4MailInThresholdCopy, formatServiceCardHint };`
    );
    return fn(
      (q) => (q && typeof q.charged === 'number' ? q.charged : 0),
      postcodeResolved,
      { getElementById: () => null },
      () => null
    );
  }

  it('shows free tracked mail-in explanation for B3 and B4 under-200 forced mail-in', () => {
    const { b3b4MailInThresholdCopy, formatServiceCardHint } = makeB3B4Helpers(true);
    for (const band of ['B3', 'B4']) {
      const q = { band, forcedMailIn: true, courierAvailable: false, service: 'mail-in', charged: 0 };
      const copy = b3b4MailInThresholdCopy(true, q);
      assert.equal(
        copy,
        'Courier collection in this area applies to repairs \u00A3200 and over. Free tracked mail-in is selected for this repair.'
      );
      assert.equal(copy.includes('\u2014'), false, 'must not contain em dashes');
      assert.equal(/deposit/i.test(copy), false, 'must not contain deposit wording');
      assert.equal(formatServiceCardHint(q, 'courier'), '\u00A3200+ repairs');
    }
  });

  it('omits "Free" when mail-in has a positive service charge', () => {
    const { b3b4MailInThresholdCopy } = makeB3B4Helpers(true);
    const q = { band: 'B3', forcedMailIn: true, courierAvailable: false, service: 'mail-in', charged: 20 };
    assert.equal(
      b3b4MailInThresholdCopy(true, q),
      'Courier collection in this area applies to repairs \u00A3200 and over. Tracked mail-in is selected for this repair.'
    );
  });

  it('hides note for B1/B2 courier, B3/B4 over-200 courier, outside-London mail-in, or unresolved postcode', () => {
    const { b3b4MailInThresholdCopy, formatServiceCardHint } = makeB3B4Helpers(true);
    assert.equal(b3b4MailInThresholdCopy(true, { band: 'B1', forcedMailIn: false, courierAvailable: true, service: 'courier', charged: 25 }), '');
    assert.equal(b3b4MailInThresholdCopy(true, { band: 'B2', forcedMailIn: false, courierAvailable: true, service: 'courier', charged: 0 }), '');
    assert.equal(b3b4MailInThresholdCopy(true, { band: 'B3', forcedMailIn: false, courierAvailable: true, service: 'courier', charged: 0 }), '');
    const outside = { band: null, forcedMailIn: true, courierAvailable: false, service: 'mail-in', charged: 0 };
    assert.equal(b3b4MailInThresholdCopy(true, outside), '');
    assert.equal(formatServiceCardHint(outside, 'courier'), 'Not in area');
    assert.equal(b3b4MailInThresholdCopy(false, { band: 'B3', forcedMailIn: true, courierAvailable: false }), '');
  });
});

describe('Item 5: backdrop fix, mobile CTA order, cookie banner offset, and sticky CTA', () => {
  it('forces .qw-confirm-backdrop display: block !important and hides .qw-confirm-modal[hidden]', () => {
    assert.match(wizardCss, /\.qw-confirm-backdrop\s*\{[^}]*display:\s*block\s*!important/s);
    assert.match(wizardCss, /\.qw-confirm-modal\[hidden\]\s*\{[^}]*display:\s*none\s*!important/s);
  });

  /* GRO-8: asserts #134 / #137 wizard internals that the restore replaced */
  it.skip('placeDeliveryReveal moves #qwDeliveryReveal into #qwSummary on mobile and restores it on desktop', () => {
    function makeNode(id) {
      const node = {
        id,
        parentNode: null,
        children: [],
        get nextSibling() {
          if (!this.parentNode) return null;
          const idx = this.parentNode.children.indexOf(this);
          return idx >= 0 ? this.parentNode.children[idx + 1] || null : null;
        },
        appendChild(child) {
          if (child.parentNode) {
            const idx = child.parentNode.children.indexOf(child);
            if (idx >= 0) child.parentNode.children.splice(idx, 1);
          }
          child.parentNode = this;
          this.children.push(child);
          return child;
        },
        insertBefore(child, ref) {
          if (child.parentNode) {
            const idx = child.parentNode.children.indexOf(child);
            if (idx >= 0) child.parentNode.children.splice(idx, 1);
          }
          child.parentNode = this;
          const refIdx = ref ? this.children.indexOf(ref) : -1;
          if (refIdx >= 0) this.children.splice(refIdx, 0, child);
          else this.children.push(child);
          return child;
        },
      };
      return node;
    }

    const mapper = makeNode('mapper');
    const pcCard = makeNode('qwPostcodeCard');
    const reveal = makeNode('qwDeliveryReveal');
    const err = makeNode('qwServiceErr');
    const sum = makeNode('qwSummary');
    mapper.appendChild(pcCard);
    mapper.appendChild(reveal);
    mapper.appendChild(err);

    let isWide = false;
    const byId = { qwPostcodeCard: pcCard, qwDeliveryReveal: reveal, qwServiceErr: err, qwSummary: sum };
    const sandbox = {
      window: {
        matchMedia: () => ({ matches: isWide }),
        addEventListener: () => {},
      },
      document: {
        readyState: 'complete',
        body: makeNode('body'),
        documentElement: { style: { setProperty: () => {} } },
        getElementById: (id) => byId[id] || null,
        querySelector: (sel) => (sel === '#qwResCard .qw-service-mapper' ? mapper : null),
      },
      MutationObserver: class { observe() {} },
    };

    vm.runInNewContext(wizardLayoutJs, sandbox);
    sandbox.window.ICorrectQuoteLayout.placeDeliveryReveal();
    assert.equal(reveal.parentNode, sum, 'mobile moves #qwDeliveryReveal into #qwSummary');

    isWide = true;
    sandbox.window.ICorrectQuoteLayout.placeDeliveryReveal();
    assert.equal(reveal.parentNode, mapper, 'desktop restores #qwDeliveryReveal into .qw-service-mapper');
    assert.deepEqual(mapper.children.map((c) => c.id), ['qwPostcodeCard', 'qwDeliveryReveal', 'qwServiceErr']);
  });

  /* GRO-8: asserts #134 / #137 wizard internals that the restore replaced */
  it.skip('tracks cookie banner height and toggles sticky CTA based on unobstructed viewport bounds', () => {
    const chunk = sliceFn(
      wizardJs,
      '/* =============================================\n     [5.1] COOKIE BANNER OFFSET + STICKY CTA ON MOBILE',
      '/* =============================================\n     RESET'
    );

    const state = {
      postcodeResolved: true,
      desktop: false,
      vh: 740,
      headerRect: { top: 0, bottom: 60, height: 60 },
      cardRect: { top: 68, bottom: 900, height: 832 },
      bookRect: { top: 380, bottom: 432, height: 52 },
      banner: {
        hidden: false,
        style: { position: 'fixed', display: 'block', visibility: 'visible', opacity: '1' },
        rect: { top: 610, bottom: 740, height: 130 },
      },
      confirmOpen: false,
      calOpen: false,
    };

    const rootVars = {};
    const rootClasses = new Set();
    const stickyClasses = new Set();
    const winListeners = new Map();
    let bookClicks = 0;
    let stickyClickHandler = null;
    let observerDisconnected = false;

    const stickyEl = {
      innerHTML: '',
      classList: {
        add: (c) => stickyClasses.add(c),
        remove: (c) => stickyClasses.delete(c),
        contains: (c) => stickyClasses.has(c),
        toggle: (c, on) => (on ? stickyClasses.add(c) : stickyClasses.delete(c)),
      },
      querySelector: (sel) => (sel === '.qw-sticky-book' ? {
        addEventListener: (ev, fn) => { if (ev === 'click') stickyClickHandler = fn; },
      } : null),
    };

    const bannerEl = {
      get hidden() { return state.banner.hidden; },
      getBoundingClientRect: () => state.banner.rect,
    };
    const bookEl = {
      disabled: false,
      click: () => { bookClicks++; },
      getBoundingClientRect: () => state.bookRect,
    };
    const resCardEl = { getBoundingClientRect: () => state.cardRect };
    const headEl = { getBoundingClientRect: () => state.headerRect };

    const doc = {
      body: {},
      documentElement: {
        clientHeight: state.vh,
        style: { setProperty: (k, v) => { rootVars[k] = v; } },
        classList: { toggle: (c, on) => (on ? rootClasses.add(c) : rootClasses.delete(c)) },
      },
      getElementById: (id) => {
        if (id === 'qw-sticky-cta') return stickyEl;
        if (id === 'qwBookBtn') return bookEl;
        if (id === 'qwResCard') return resCardEl;
        if (id === 'qwCartConfirmModal') return state.confirmOpen ? { hidden: false } : null;
        if (id === 'qwCalModal') return state.calOpen ? { hidden: false } : { hidden: true };
        return null;
      },
      querySelector: (sel) => {
        if (sel === '.section-header') return headEl;
        if (sel === '#shopify-pc__banner, .shopify-pc__banner__dialog') return bannerEl;
        if (sel === '.qw-confirm-modal') return state.confirmOpen ? { hidden: false } : null;
        return null;
      },
      querySelectorAll: (sel) => (sel === '#shopify-pc__banner, .shopify-pc__banner__dialog' ? [bannerEl] : []),
    };

    const win = {
      get innerHeight() { return state.vh; },
      matchMedia: () => ({ matches: state.desktop }),
      getComputedStyle: () => state.banner.style,
      addEventListener: (ev, fn) => {
        if (!winListeners.has(ev)) winListeners.set(ev, new Set());
        winListeners.get(ev).add(fn);
      },
      removeEventListener: (ev, fn) => {
        if (winListeners.has(ev)) winListeners.get(ev).delete(fn);
      },
    };

    const sandbox = {
      window: win,
      document: doc,
      esc: (s) => String(s),
      IntersectionObserver: class {
        observe() {}
        disconnect() { observerDisconnected = true; }
      },
      MutationObserver: class { observe() {} disconnect() {} },
      ResizeObserver: class { observe() {} disconnect() {} },
      requestAnimationFrame: (fn) => { fn(); return 1; },
      cancelAnimationFrame: () => {},
      get _postcodeResolved() { return state.postcodeResolved; },
    };

    vm.runInNewContext(
      `${chunk}\nthis.__exports = { measureCookieBannerHeight, syncCookieBannerOffset, updateStickyCTA, setupStickyCTA, destroyStickyCTA };`,
      sandbox
    );
    const api = sandbox.__exports;

    api.setupStickyCTA('\u00A3149');
    assert.equal(rootVars['--qw-cookie-h'], '130px');
    assert.equal(rootClasses.has('qw-consent-bar-on'), true);
    assert.equal(stickyClasses.has('show'), false, 'hidden while #qwBookBtn sits above cookie banner');

    // Cookie banner covers #qwBookBtn (bottom 650 > bottomBound 610)
    state.bookRect = { top: 598, bottom: 650, height: 52 };
    api.updateStickyCTA();
    assert.equal(stickyClasses.has('show'), true, 'shows when #qwBookBtn is covered by cookie banner');

    // Sticky button safely clicks #qwBookBtn
    stickyClickHandler();
    assert.equal(bookClicks, 1);

    // Confirm modal open hides sticky CTA
    state.confirmOpen = true;
    api.updateStickyCTA();
    assert.equal(stickyClasses.has('show'), false, 'hides while confirm modal is open');
    state.confirmOpen = false;

    // Calendar modal open hides sticky CTA
    state.calOpen = true;
    api.updateStickyCTA();
    assert.equal(stickyClasses.has('show'), false, 'hides while calendar modal is open');
    state.calOpen = false;

    // Cookie banner dismissed -> height drops to 0, #qwBookBtn is now visible -> sticky hides
    state.banner.hidden = true;
    api.syncCookieBannerOffset();
    assert.equal(rootVars['--qw-cookie-h'], '0px');
    assert.equal(rootClasses.has('qw-consent-bar-on'), false);
    assert.equal(stickyClasses.has('show'), false, 'hides once banner dismissed and #qwBookBtn visible');

    // Compliant tall mobile banner (~55% vh, e.g. 405px on 740px or 225px on 640px) is measured
    state.banner.hidden = false;
    state.banner.rect = { top: 335, bottom: 740, height: 405 };
    assert.equal(api.measureCookieBannerHeight(), 405);

    // Full-screen preferences dialog (>=65% vh) is ignored
    state.banner.rect = { top: 0, bottom: 740, height: 740 };
    assert.equal(api.measureCookieBannerHeight(), 0);

    // Scrolled past #qwBookBtn (above sticky header) -> sticky shows
    state.banner.hidden = true;
    state.bookRect = { top: 10, bottom: 50, height: 40 };
    api.updateStickyCTA();
    assert.equal(stickyClasses.has('show'), true, 'shows when #qwBookBtn scrolled behind header');

    // Desktop hides sticky bar
    state.desktop = true;
    api.updateStickyCTA();
    assert.equal(stickyClasses.has('show'), false);
    state.desktop = false;

    // Unresolved postcode hides sticky bar
    state.postcodeResolved = false;
    api.updateStickyCTA();
    assert.equal(stickyClasses.has('show'), false);

    // Cleanup removes observer and scroll/resize listeners
    api.destroyStickyCTA();
    assert.equal(observerDisconnected, true);
    assert.equal(stickyClasses.has('show'), false);
    assert.equal(stickyEl.innerHTML, '');
  });

  it('never uses a class or ID containing "cookie-banner" that collides with assets/base.css', () => {
    assert.doesNotMatch(
      wizardJs,
      /cookie-banner/i,
      'assets/quote-wizard.js must not contain "cookie-banner" (matches [class*="cookie-banner"] in assets/base.css)'
    );
    assert.doesNotMatch(
      wizardCss,
      /cookie-banner/i,
      'assets/quote-wizard.css must not contain "cookie-banner" (matches [class*="cookie-banner"] in assets/base.css)'
    );
    assert.doesNotMatch(
      wizardLayoutJs,
      /cookie-banner/i,
      'assets/quote-wizard-layout.js must not contain "cookie-banner" (matches [class*="cookie-banner"] in assets/base.css)'
    );
  });

  /* GRO-8: asserts #134 / #137 wizard internals that the restore replaced */
  it.skip('mobile focus() nudges scroll so #qwBookBtn clears a tall cookie banner without pushing price card above header', () => {
    const scrolls = [];
    const rects = {
      head: { top: 0, bottom: 58, height: 58 },
      pcCard: { top: 200, bottom: 270, height: 70 },
      priceCard: { top: 278, bottom: 438, height: 160 },
      bookBtn: { top: 514, bottom: 566, height: 52 },
      banner: { top: 415, bottom: 640, height: 225 },
    };

    const elById = {
      qwPostcodeCard: { getBoundingClientRect: () => rects.pcCard },
      qwBookBtn: { getBoundingClientRect: () => rects.bookBtn },
      qwSummary: { getBoundingClientRect: () => rects.priceCard },
      qwResCard: { getBoundingClientRect: () => rects.pcCard, getAttribute: () => '1' },
    };
    const bannerEl = { hidden: false, getBoundingClientRect: () => rects.banner };
    const headEl = { getBoundingClientRect: () => rects.head };
    const priceEl = { getBoundingClientRect: () => rects.priceCard };

    const win = {
      innerHeight: 640,
      matchMedia: () => ({ matches: false }),
      addEventListener: () => {},
      getComputedStyle: () => ({ position: 'fixed', display: 'block', visibility: 'visible', opacity: '1' }),
      scrollBy: (opts) => { scrolls.push(opts.top); },
    };
    const doc = {
      readyState: 'complete',
      documentElement: {
        clientHeight: 640,
        style: {
          setProperty: () => {},
          getPropertyValue: (k) => (k === '--qw-cookie-h' ? '225px' : ''),
        },
      },
      body: {},
      getElementById: (id) => elById[id] || null,
      querySelector: (sel) => {
        if (sel === '.section-header') return headEl;
        if (sel === '#shopify-pc__banner, .shopify-pc__banner__dialog') return bannerEl;
        if (sel === '#qwSummary .qw-price-trust-price') return priceEl;
        return null;
      },
    };

    const sandbox = {
      window: win,
      document: doc,
      MutationObserver: class { observe() {} },
      setTimeout: (fn) => { fn(); return 1; },
      requestAnimationFrame: (fn) => { fn(); return 1; },
    };
    vm.runInNewContext(wizardLayoutJs, sandbox);

    // Case 1: overflow (23px) fits within maxExtra (80px), so bookBtn clears safeBottom (407)
    win.ICorrectQuoteLayout.focus();
    assert.equal(scrolls.length, 1);
    const dy1 = scrolls[0];
    assert.ok(rects.bookBtn.bottom - dy1 <= 640 - 225 - 8, 'bookBtn lands at or above safeBottom');
    assert.ok(rects.priceCard.top - dy1 >= 58 + 4, 'priceCard stays below sticky header');

    // Case 2: extreme overflow is capped so priceCard never scrolls above off + 4 (62px)
    rects.bookBtn = { top: 610, bottom: 662, height: 52 };
    win.ICorrectQuoteLayout.focus();
    assert.equal(scrolls.length, 2);
    const dy2 = scrolls[1];
    assert.equal(rects.priceCard.top - dy2, 58 + 4, 'scroll caps so priceCard top stays at header + 4px');
  });
});

describe('Cookie banner CSS compliance in assets/base.css', () => {
  it('removes legacy clamping, privacy-link hiding, overlay hiding, and wildcard selectors', () => {
    assert.doesNotMatch(baseCss, /max-height:\s*(50|80)px/i, 'must not clamp banner height to 50px or 80px');
    assert.doesNotMatch(baseCss, /a\[href\*=["']privacy["']\][\s\S]{0,120}display:\s*none/i, 'must not hide privacy policy links');
    assert.doesNotMatch(baseCss, /\.shopify-pc__overlay[\s\S]{0,120}display:\s*none/i, 'must not hide .shopify-pc__overlay');
    assert.doesNotMatch(baseCss, /\[class\*=["']cookie-banner["']\]/i, 'must not use [class*="cookie-banner"] wildcard');
    assert.doesNotMatch(baseCss, /\[id\*=["']cookie-banner["']\]/i, 'must not use [id*="cookie-banner"] wildcard');
    assert.doesNotMatch(baseCss, /#shopify-pc__prefs/, 'must leave Shopify preferences modal untouched');
  });

  it('enforces 44px touch targets, visible privacy link, and equal Accept/Decline prominence', () => {
    assert.match(
      baseCss,
      /#shopify-pc__banner\.shopify-pc__banner__dialog\s+button\s*\{[^}]*min-height:\s*44px/s
    );
    assert.match(
      baseCss,
      /#shopify-pc__banner\.shopify-pc__banner__dialog\s+#shopify-pc__banner__body-policy-link\s*\{[^}]*display:\s*inline[^}]*text-decoration:\s*underline/s
    );
    // Accept and Decline share the exact same styling rule for equal prominence
    assert.match(
      baseCss,
      /#shopify-pc__banner\.shopify-pc__banner__dialog\s+#shopify-pc__banner__btn-accept,\s*#shopify-pc__banner\.shopify-pc__banner__dialog\s+#shopify-pc__banner__btn-decline\s*\{[^}]*background:\s*#ffffff;[^}]*color:\s*#171717;[^}]*border:\s*1\.5px solid #171717;[^}]*font-weight:\s*600;/s
    );
    assert.match(
      baseCss,
      /#shopify-pc__banner\.shopify-pc__banner__dialog\s+#shopify-pc__banner__btn-manage-prefs\s*\{[^}]*min-height:\s*44px[^}]*text-decoration:\s*underline/s
    );
  });
});
