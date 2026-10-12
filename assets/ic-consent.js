/* iCorrect consent bar (snippets/ic-consent.liquid). No library.
   Shows only when the visitor has not answered yet, and records the answer through
   Shopify's Customer Privacy API. Accept and Decline carry equal weight. */
(function () {
  var bar = document.getElementById('ic-consent');
  if (!bar) return;
  var root = document.documentElement;
  var form = bar.querySelector('.ic-consent__choose');
  var more = bar.querySelector('.ic-consent__more');

  function withApi(cb) {
    var S = window.Shopify;
    if (S && S.customerPrivacy) { cb(S.customerPrivacy); return; }
    if (S && typeof S.loadFeatures === 'function') {
      S.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], function (err) {
        if (!err && window.Shopify.customerPrivacy) cb(window.Shopify.customerPrivacy);
      });
    }
  }

  function show() {
    bar.hidden = false;
    root.classList.add('ic-consent-open');
  }
  function hide() {
    bar.hidden = true;
    root.classList.remove('ic-consent-open');
  }

  function save(analytics, marketing) {
    withApi(function (cp) {
      cp.setTrackingConsent(
        { analytics: analytics, marketing: marketing, preferences: analytics },
        function () {
          hide();
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'consent_choice', { analytics: analytics, marketing: marketing });
          }
        }
      );
    });
  }

  withApi(function (cp) {
    var c = (typeof cp.currentVisitorConsent === 'function' && cp.currentVisitorConsent()) || {};
    if (c.analytics === '' || c.marketing === '') show();
  });

  bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent]');
    if (!b || b.type === 'submit') return;
    save(b.dataset.consent === 'accept', b.dataset.consent === 'accept');
  });

  more.addEventListener('click', function () {
    var open = more.getAttribute('aria-expanded') === 'true';
    more.setAttribute('aria-expanded', String(!open));
    form.hidden = open;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    save(form.elements.analytics.checked, form.elements.marketing.checked);
  });
})();
