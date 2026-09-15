/**
 * Details-first quote gate: validate the lead, stamp cart attributes,
 * and prefill Shopify checkout so we never ask for name/email/phone twice.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectQuoteLead = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

  function normalizePostcode(value) {
    var compact = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (compact.length < 5) return String(value || '').trim().toUpperCase();
    return compact.slice(0, -3) + ' ' + compact.slice(-3);
  }

  function splitName(fullName) {
    var parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return { firstName: '', lastName: '' };
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  }

  function validateLead(raw) {
    raw = raw || {};
    var name = String(raw.name || '').trim();
    var email = String(raw.email || '').trim();
    var mobile = String(raw.mobile || '').trim();
    var postcode = normalizePostcode(raw.postcode);
    var errors = {};

    if (!name) errors.name = 'Tell us who the repair is for.';
    if (!EMAIL_RE.test(email)) errors.email = 'We need a working email to send the quote.';
    var digits = mobile.replace(/\D/g, '');
    if (digits.length < 10) errors.mobile = 'A mobile number, so the driver can reach you.';
    if (!POSTCODE_RE.test(postcode)) errors.postcode = 'Enter a UK postcode, e.g. W1W 8JQ.';

    var keys = Object.keys(errors);
    if (keys.length) return { ok: false, errors: errors, lead: null };
    return {
      ok: true,
      errors: null,
      lead: { name: name, email: email, mobile: mobile, postcode: postcode }
    };
  }

  function cartLeadAttributes(lead) {
    if (!lead || !lead.name || !lead.email) return {};
    return {
      Name: String(lead.name),
      Email: String(lead.email),
      Phone: String(lead.mobile || '')
    };
  }

  function checkoutPrefillUrl(base, lead, extra) {
    var path = base || '/checkout';
    extra = extra || {};
    if (!lead || !lead.email) return path;
    var params = new URLSearchParams();
    Object.keys(extra).forEach(function (key) {
      if (extra[key] != null && extra[key] !== '') params.set(key, extra[key]);
    });
    var names = splitName(lead.name);
    params.set('checkout[email]', lead.email);
    if (names.firstName) params.set('checkout[shipping_address][first_name]', names.firstName);
    if (names.lastName) params.set('checkout[shipping_address][last_name]', names.lastName);
    if (lead.mobile) params.set('checkout[shipping_address][phone]', lead.mobile);
    var qs = params.toString();
    return qs ? path + '?' + qs : path;
  }

  function intakeContactPayload(lead, extra) {
    extra = extra || {};
    lead = lead || {};
    return {
      source: 'shopify-website',
      contact: {
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.mobile || '',
        body: 'Website quote request. Collection postcode: ' + (lead.postcode || '') + '.',
        device_type: extra.device || '',
        device_model: extra.model || '',
        fault_area: extra.fault || ''
      }
    };
  }

  function leadGateHtml() {
    return '<div class="qw-lead-summary" id="qwLeadSummary" hidden>' +
      '<div class="qw-lead-summary-copy">Quote for <strong id="qwLeadSummaryName"></strong> · <span id="qwLeadSummaryMeta"></span></div>' +
      '<button type="button" class="qw-lead-change" id="qwLeadChange">Change</button>' +
    '</div>' +
    '<div class="qw-lead-gate" id="qwLeadGate">' +
      '<div class="qw-lead-kicker">Your fixed price · one step left</div>' +
      '<h3 class="qw-lead-title" id="qwLeadTitle">We need a few details for the quote</h3>' +
      '<p class="qw-lead-sub">It\u2019s instant. Your all-in price appears on the next screen.</p>' +
      '<div class="qw-lead-grid">' +
        '<label class="qw-lead-field" for="qwLeadName"><span>Full name</span>' +
          '<input type="text" id="qwLeadName" class="qw-lead-input" name="name" autocomplete="name" placeholder="Jane Whitfield">' +
          '<span class="qw-lead-err" id="qwLeadNameErr"></span></label>' +
        '<label class="qw-lead-field" for="qwLeadEmail"><span>Email</span>' +
          '<input type="email" id="qwLeadEmail" class="qw-lead-input" name="email" autocomplete="email" placeholder="jane@company.co.uk">' +
          '<span class="qw-lead-err" id="qwLeadEmailErr"></span></label>' +
        '<label class="qw-lead-field" for="qwLeadMobile"><span>Mobile</span>' +
          '<input type="tel" id="qwLeadMobile" class="qw-lead-input" name="tel" autocomplete="tel" placeholder="07700 900 812">' +
          '<span class="qw-lead-err" id="qwLeadMobileErr"></span></label>' +
        '<label class="qw-lead-field" for="qwPostcode"><span>Collection postcode</span>' +
          '<input type="text" id="qwPostcode" class="qw-postcode-input qw-lead-input qw-courier-inp" name="postal-code" autocomplete="postal-code" inputmode="text" placeholder="W1W 8JQ">' +
          '<span class="qw-lead-hint"><strong>We come to you and collect</strong> the device, then bring it back once it\u2019s repaired. Outside London we send a free tracked mail-in pack instead.</span>' +
          '<span class="qw-lead-err" id="qwLeadPostcodeErr"></span></label>' +
      '</div>' +
      '<button type="button" class="qw-lead-submit" id="qwLeadSubmit">Show my price and turnaround time <span aria-hidden="true">\u2192</span></button>' +
      '<p class="qw-lead-note">No obligation to book. We use these details for your quote and to answer any questions about it.</p>' +
      '<div class="qw-lead-trust">719 Google reviews · 2-yr warranty on every repair · 12 Margaret Street, W1W 8JQ</div>' +
    '</div>';
  }

  return {
    normalizePostcode: normalizePostcode,
    splitName: splitName,
    validateLead: validateLead,
    cartLeadAttributes: cartLeadAttributes,
    checkoutPrefillUrl: checkoutPrefillUrl,
    intakeContactPayload: intakeContactPayload,
    leadGateHtml: leadGateHtml
  };
});
