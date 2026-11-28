/*
  cookie-banner-compact.js (GRO-3)
  Shopify draws the cookie banner and its preferences dialog. The theme cannot
  change their wording in Liquid, so this file does two small jobs:

  1. Shortens the visible banner sentence and the "Manage preferences" label.
     The meaning is kept (analytics, ads and personalisation only if accepted),
     the Privacy Policy link is kept, and the full label stays on the button
     for screen readers.
  2. Makes sure the optional boxes in the preferences dialog start unticked
     for a visitor who has not made a choice yet. A visitor who already chose
     sees their saved choice, which this file never touches.

  It does not read, set or change any consent value, and it does not decide
  which tags load. Analytics gating is a separate decision (see the PR notes).
*/
(function () {
  'use strict';

  var BANNER_ID = 'shopify-pc__banner';
  var SHORT_TEXT = 'We use cookies for analytics, ads and personalisation, only if you accept. ';
  var MANAGE_SHORT = 'Manage';
  var MANAGE_FULL = 'Manage cookie preferences';
  var OPTIONAL_IDS = [
    'shopify-pc__prefs__preferences-input',
    'shopify-pc__prefs__marketing-input',
    'shopify-pc__prefs__analytics-input'
  ];

  function shortenBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (!banner || banner.getAttribute('data-ic-compact') === '1') return;

    var p = banner.querySelector('.shopify-pc__banner__body p');
    var link = document.getElementById('shopify-pc__banner__body-policy-link');
    var manage = document.getElementById('shopify-pc__banner__btn-manage-prefs');
    // Wait until Shopify has drawn all the parts, so a half drawn banner is never marked done.
    if (!p || !link || !manage) return;

    p.textContent = '';
    p.appendChild(document.createTextNode(SHORT_TEXT));
    p.appendChild(link);

    var label = manage.querySelector('span');
    if (label) label.textContent = MANAGE_SHORT; else manage.textContent = MANAGE_SHORT;
    manage.setAttribute('aria-label', MANAGE_FULL);

    banner.setAttribute('data-ic-compact', '1');
  }

  function consentNotAnswered() {
    try {
      var cp = window.Shopify && window.Shopify.customerPrivacy;
      if (!cp || typeof cp.currentVisitorConsent !== 'function') return false;
      var c = cp.currentVisitorConsent() || {};
      return !c.analytics && !c.marketing && !c.preferences;
    } catch (e) {
      return false;
    }
  }

  function untickOptionalBoxes() {
    if (!consentNotAnswered()) return;
    for (var i = 0; i < OPTIONAL_IDS.length; i++) {
      var box = document.getElementById(OPTIONAL_IDS[i]);
      if (box && box.checked && box.getAttribute('data-ic-user-set') !== '1') box.checked = false;
    }
  }

  // If the visitor ticks a box themselves, never undo it.
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.id && OPTIONAL_IDS.indexOf(t.id) !== -1) t.setAttribute('data-ic-user-set', '1');
  }, true);

  function run() {
    shortenBanner();
    if (document.getElementById('shopify-pc__prefs__dialog') || document.querySelector('.shopify-pc__prefs__dialog')) {
      untickOptionalBoxes();
    }
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    var raf = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };
    raf(function () { scheduled = false; run(); });
  }

  function start() {
    run();
    if (typeof MutationObserver === 'function' && document.body) {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
