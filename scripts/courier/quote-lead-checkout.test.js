/**
 * Details-first quote gate: validate lead, cart attributes, checkout prefill.
 * Run: node --test scripts/courier/quote-lead-checkout.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const liquid = fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/quote-wizard.css'), 'utf8');

function extractFunction(src, name) {
  const start = src.indexOf('function ' + name + '(');
  assert.ok(start !== -1, 'missing function ' + name);
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('unclosed function ' + name);
}

describe('ICorrectQuoteLead.validateLead', () => {
  const { validateLead } = require('../../assets/quote-lead-checkout.js');

  it('accepts a complete UK lead and normalises postcode + email', () => {
    const r = validateLead({
      name: '  Jane Whitfield  ',
      email: '  jane@company.co.uk ',
      mobile: '07700 900 812',
      postcode: 'w1w8jq'
    });
    assert.equal(r.ok, true);
    assert.equal(r.lead.name, 'Jane Whitfield');
    assert.equal(r.lead.email, 'jane@company.co.uk');
    assert.equal(r.lead.mobile, '07700 900 812');
    assert.equal(r.lead.postcode, 'W1W 8JQ');
    assert.equal(r.errors, null);
  });

  it('rejects empty name, bad email, short mobile, and invalid postcode', () => {
    const r = validateLead({
      name: '  ',
      email: 'not-an-email',
      mobile: '07700',
      postcode: 'XYZ'
    });
    assert.equal(r.ok, false);
    assert.equal(r.errors.name, 'Tell us who the repair is for.');
    assert.equal(r.errors.email, 'We need a working email to send the quote.');
    assert.equal(r.errors.mobile, 'A mobile number, so the driver can reach you.');
    assert.equal(r.errors.postcode, 'Enter a UK postcode, e.g. W1W 8JQ.');
  });

  it('requires at least 10 digits in the mobile number', () => {
    const short = validateLead({
      name: 'Jane',
      email: 'jane@icorrect.co.uk',
      mobile: '077009008',
      postcode: 'SW1A 1AA'
    });
    assert.equal(short.ok, false);
    assert.ok(short.errors.mobile);

    const ok = validateLead({
      name: 'Jane',
      email: 'jane@icorrect.co.uk',
      mobile: '+44 7700 900812',
      postcode: 'SW1A 1AA'
    });
    assert.equal(ok.ok, true);
  });
});

describe('ICorrectQuoteLead.splitName', () => {
  const { splitName } = require('../../assets/quote-lead-checkout.js');

  it('splits first and remaining words for Shopify checkout', () => {
    assert.deepEqual(splitName('Jane Whitfield'), { firstName: 'Jane', lastName: 'Whitfield' });
    assert.deepEqual(splitName('Mary Ann Smith'), { firstName: 'Mary', lastName: 'Ann Smith' });
    assert.deepEqual(splitName('Prince'), { firstName: 'Prince', lastName: '' });
  });
});

describe('ICorrectQuoteLead.cartLeadAttributes', () => {
  const { cartLeadAttributes } = require('../../assets/quote-lead-checkout.js');

  it('maps Name, Email, and Phone for cart/update.js', () => {
    assert.deepEqual(
      cartLeadAttributes({
        name: 'Jane Whitfield',
        email: 'jane@company.co.uk',
        mobile: '07700 900 812',
        postcode: 'W1W 8JQ'
      }),
      {
        Name: 'Jane Whitfield',
        Email: 'jane@company.co.uk',
        Phone: '07700 900 812'
      }
    );
  });

  it('returns empty object when the lead is missing', () => {
    assert.deepEqual(cartLeadAttributes(null), {});
    assert.deepEqual(cartLeadAttributes({}), {});
  });
});

describe('ICorrectQuoteLead.checkoutPrefillUrl', () => {
  const { checkoutPrefillUrl } = require('../../assets/quote-lead-checkout.js');

  it('prefills email, name, and phone without a second form', () => {
    const url = checkoutPrefillUrl('/checkout', {
      name: 'Jane Whitfield',
      email: 'jane@company.co.uk',
      mobile: '07700 900 812'
    });
    assert.ok(url.startsWith('/checkout?'));
    const q = new URL(url, 'https://icorrect.co.uk').searchParams;
    assert.equal(q.get('checkout[email]'), 'jane@company.co.uk');
    assert.equal(q.get('checkout[shipping_address][first_name]'), 'Jane');
    assert.equal(q.get('checkout[shipping_address][last_name]'), 'Whitfield');
    assert.equal(q.get('checkout[shipping_address][phone]'), '07700 900 812');
  });

  it('keeps existing query params such as ph_distinct_id', () => {
    const url = checkoutPrefillUrl('/checkout', {
      name: 'Jane',
      email: 'jane@icorrect.co.uk',
      mobile: '07700900812'
    }, { ph_distinct_id: 'phc_abc' });
    const q = new URL(url, 'https://icorrect.co.uk').searchParams;
    assert.equal(q.get('ph_distinct_id'), 'phc_abc');
    assert.equal(q.get('checkout[email]'), 'jane@icorrect.co.uk');
  });

  it('returns /checkout when there is no lead', () => {
    assert.equal(checkoutPrefillUrl('/checkout', null), '/checkout');
  });
});

describe('ICorrectQuoteLead.intakeContactPayload', () => {
  const { intakeContactPayload } = require('../../assets/quote-lead-checkout.js');

  it('wraps the gate submit in the existing shopify-website contact shape', () => {
    const payload = intakeContactPayload({
      name: 'Jane Whitfield',
      email: 'jane@company.co.uk',
      mobile: '07700 900 812',
      postcode: 'W1W 8JQ'
    }, {
      device: 'MacBook',
      model: 'MacBook Pro 14',
      fault: 'Screen / Display'
    });
    assert.equal(payload.source, 'shopify-website');
    assert.equal(payload.contact.name, 'Jane Whitfield');
    assert.equal(payload.contact.email, 'jane@company.co.uk');
    assert.equal(payload.contact.phone, '07700 900 812');
    assert.equal(payload.contact.device_type, 'MacBook');
    assert.equal(payload.contact.device_model, 'MacBook Pro 14');
    assert.equal(payload.contact.fault_area, 'Screen / Display');
    assert.match(payload.contact.body, /W1W 8JQ/);
    assert.match(payload.contact.body, /quote/i);
  });
});

describe('quote-wizard details-first wiring', () => {
  it('loads quote-lead-checkout.js before the wizard IIFE', () => {
    assert.match(liquid, /quote-lead-checkout\.js['"]\s*\|\s*asset_url/);
    const src = liquid.indexOf('quote-lead-checkout.js');
    const iife = liquid.lastIndexOf('(function() {');
    assert.ok(src !== -1 && iife !== -1 && src < iife);
  });

  it('puts the details gate in front of price and collection', () => {
    const svc = extractFunction(liquid, 'buildServiceCards');
    const leadJs = fs.readFileSync(path.join(root, 'assets/quote-lead-checkout.js'), 'utf8');
    assert.match(svc, /leadGateHtml/);
    assert.match(svc, /qwDeliveryReveal/);
    assert.match(leadJs, /id="qwLeadGate"/);
    assert.match(leadJs, /We need a few details for the quote/);
    assert.match(leadJs, /Show my price and turnaround time/);
    assert.match(leadJs, /id="qwLeadName"/);
    assert.match(leadJs, /id="qwLeadEmail"/);
    assert.match(leadJs, /id="qwLeadMobile"/);
    assert.match(leadJs, /id="qwPostcode"/);
    assert.match(leadJs, /id="qwLeadSummary"/);
    assert.match(leadJs, /id="qwLeadChange"/);
  });

  it('does not reveal a courier quote until the lead gate is unlocked', () => {
    const wire = extractFunction(liquid, 'wireCourierService');
    assert.match(wire, /_leadUnlocked/);
    assert.match(wire, /validateLead/);
    assert.match(wire, /qwLeadSubmit/);
    assert.match(liquid, /S\.lead/);
  });

  it('stamps Name / Email / Phone on the cart and prefills checkout', () => {
    const add = extractFunction(liquid, 'addToCartAndCheckout');
    assert.match(add, /cartLeadAttributes/);
    assert.match(add, /checkoutPrefillUrl/);
    assert.match(add, /cart\/update\.js/);
    assert.doesNotMatch(add, /window\.location\.href = checkoutUrl;/);
  });

  it('books with the mock CTA and still offers email-this-quote', () => {
    assert.match(liquid, /Book this repair/);
    assert.match(liquid, /Email me this quote/);
    assert.match(liquid, /Your details first/);
  });

  it('styles the gate and gives Fast / Same-day a visual upgrade panel', () => {
    assert.match(css, /\.qw-lead-gate\s*\{/);
    assert.match(css, /\.qw-lead-submit\s*\{/);
    assert.match(css, /\.qw-speed-upgrade\s*\{/);
    assert.match(css, /\.qw-speed-sameday-badge\s*\{/);
    assert.match(css, /--ic-orange|#BC6A2C|#F6EADD/);
    const cards = extractFunction(liquid, 'buildTurnaroundCards');
    assert.match(cards, /qw-speed-upgrade/);
    assert.match(cards, /How fast do you need it back/);
  });
});
