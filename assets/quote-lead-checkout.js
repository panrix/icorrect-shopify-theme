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

  return {
    normalizePostcode: normalizePostcode,
    splitName: splitName,
    validateLead: validateLead,
    cartLeadAttributes: cartLeadAttributes,
    checkoutPrefillUrl: checkoutPrefillUrl,
    intakeContactPayload: intakeContactPayload
  };
});
