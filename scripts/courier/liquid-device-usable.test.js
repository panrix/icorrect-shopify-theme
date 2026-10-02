/**
 * Water-damage detail options ask whether the device is usable, then show
 * Michael's locked data note before the diagnostic quote.
 * Run: node --test scripts/courier/liquid-device-usable.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const liquid = fs.readFileSync(path.join(root, 'sections/quote-wizard.liquid'), 'utf8');
const wizardJs = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
const source = wizardJs.replace(/\\'/g, "'");

const QUESTION = 'Is the device turning on and usable right now?';
const YES = 'Yes (usable)';
const NO = "No (won't turn on / isn't usable)";
const COPY_USABLE = "If you can, please back up your device. Liquid damage is unpredictable and may still affect your data, though we'll still take every care with your device.";
const COPY_NOT_USABLE = "Liquid damage can be unpredictable. There's a small chance data is affected. During the diagnostic we'll prioritise protecting your data wherever we can.";

function count(hay, needle) {
  let n = 0;
  let i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) {
    n += 1;
    i += needle.length;
  }
  return n;
}

describe('liquid-damage usable step', () => {
  it('loads the wizard script from the theme asset', () => {
    assert.match(liquid, /<script src="\{\{ 'quote-wizard\.js' \| asset_url \}\}" defer><\/script>/);
    assert.ok(Buffer.byteLength(liquid) <= 262144, 'section must stay within Shopify’s 256 KB limit');
  });

  it('asks the locked question after a water-damage detail, before the quote', () => {
    assert.equal(count(source, QUESTION), 1);
    assert.match(source, /if \(S\.fault === 'Water Damage'\) \{\s*showLiquidUsableQuestion\(iss\);/);
    assert.match(source, /yesBtn\.onclick = function\(\) \{ showLiquidDataNotice\(iss, true\); \}/);
    assert.match(source, /noBtn\.onclick = function\(\) \{ showLiquidDataNotice\(iss, false\); \}/);
    assert.match(source, /id="qwLiqOk">I understand</);
    const questionAt = source.indexOf('function showLiquidUsableQuestion');
    const noticeAt = source.indexOf('function showLiquidDataNotice');
    const resolutionAt = source.indexOf('async function showResolution');
    assert.ok(questionAt > 0 && noticeAt > questionAt && resolutionAt > noticeAt);
  });

  it('uses the locked yes and no labels', () => {
    assert.equal(count(source, YES), 1);
    assert.equal(count(source, NO), 1);
  });

  it('shows the locked copy for usable and not usable', () => {
    assert.equal(count(source, COPY_USABLE), 1);
    assert.equal(count(source, COPY_NOT_USABLE), 1);
    assert.match(source, /var copy = usable \? LIQUID_COPY_USABLE : LIQUID_COPY_NOT_USABLE;/);
  });

  it('keeps existing water-damage incident copy', () => {
    assert.match(source, /Spilled liquid recently \(within 24 hours\)/);
    assert.match(source, /Spilled liquid \(more than 24 hours ago\)/);
    assert.match(source, /Dropped in liquid \(within 24 hours\)/);
    assert.match(source, /Liquid damage \(more than 24 hours ago\)/);
    assert.match(source, /Partial failure after liquid exposure/);
    assert.match(source, /Water ingress despite water resistance/);
  });

  it('records the answer on the booking, not as a new quote-event field', () => {
    assert.match(source, /mainProps\['Device usable'\] = usableLabel/);
    assert.match(source, /add\('Device usable', 'Device usable'\)/);
    assert.match(source, /deviceParts\.push\('Device usable: ' \+ usableLabel\)/);
    const payloadStart = liquid.indexOf('function quotePayload');
    const payloadEnd = liquid.indexOf('function captureQuoteShown');
    assert.ok(payloadStart > 0 && payloadEnd > payloadStart);
    const payload = liquid.slice(payloadStart, payloadEnd);
    assert.equal(payload.includes('liquidDeviceUsable'), false);
    assert.equal(payload.includes('Device usable'), false);
  });

  it('does not put the new question in the FAQ schema', () => {
    const faq = fs.readFileSync(path.join(root, 'snippets/icorrect-faq-page-schema.liquid'), 'utf8');
    assert.equal(faq.includes(QUESTION), false);
    assert.equal(faq.includes(COPY_NOT_USABLE), false);
    assert.equal(faq.includes(COPY_USABLE), false);
  });

  it('back from the data note returns to the usable question', () => {
    assert.match(source, /if \(_liquidGate === 'notice' && _liquidIssue\) \{\s*showLiquidUsableQuestion\(_liquidIssue\);/);
  });
});
