/**
 * Contract: theme repair_type / route values ⊆ hub #432 allowlists.
 * Source of truth pinned from workshop-os intake-hub
 * src/lib/quote-events-validate.ts (main after #432 merge).
 * Run: node --test scripts/courier/hub-quote-events-allowlist.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

/** Pinned from workshop-os quote-events-validate.ts after #432. */
const HUB_ROUTES = new Set(['repair', 'diagnostic', 'contact', 'dismiss']);
const HUB_REPAIR_TYPES = new Set([
  'screen',
  'screen-glass',
  'dustgate',
  'flexgate',
  'battery',
  'charging-port',
  'keyboard',
  'trackpad',
  'touch-bar',
  'loudspeaker',
  'earpiece',
  'microphone',
  'rear-camera',
  'rear-camera-lens',
  'front-camera',
  'face-id',
  'rear-glass',
  'heart-rate-monitor',
  'volume-button',
  'power-button',
  'mute-button',
  'home-button',
  'side-button',
  'crown',
  'diagnostic',
]);

const liquidPath = path.join(__dirname, '../../sections/quote-wizard.liquid');
const liquid = fs.readFileSync(liquidPath, 'utf8');

function uniq(re) {
  return [...new Set([...liquid.matchAll(re)].map((m) => m[1]))].sort();
}

describe('hub #432 allowlist contract', () => {
  it('every quote-wizard route literal is allowlisted', () => {
    const routes = uniq(/route:\s*'([^']+)'/g);
    assert.ok(routes.length > 0, 'expected route literals');
    const missing = routes.filter((r) => !HUB_ROUTES.has(r));
    assert.deepEqual(missing, [], `routes not in hub allowlist: ${missing.join(', ')}`);
  });

  it('every quote-wizard repairType literal is allowlisted', () => {
    const types = uniq(/repairType:\s*'([^']+)'/g);
    assert.ok(types.length > 0, 'expected repairType literals');
    const missing = types.filter((t) => !HUB_REPAIR_TYPES.has(t));
    assert.deepEqual(missing, [], `repairTypes not in hub allowlist: ${missing.join(', ')}`);
  });

  it('payload keys include repair / repair_handle / repair_type / route', () => {
    assert.match(liquid, /repair_handle:\s*q\.repair_handle/);
    assert.match(liquid, /repair_type:\s*q\.repair_type/);
    assert.match(liquid, /route:\s*q\.route/);
  });

  it('quotePayload and proceed extras include speed, same_day_date, slots_remaining', () => {
    const payloadStart = liquid.indexOf('function quotePayload(extra)');
    const payload = liquid.slice(payloadStart, liquid.indexOf('function captureQuoteShown'));
    assert.match(payload, /speed:\s*q\.speed/);
    assert.match(payload, /same_day_date:/);
    assert.match(payload, /slots_remaining:/);
    assert.match(liquid, /function selectedSpeedTrackFields\s*\(/);
    const proceedStart = liquid.indexOf("function trackWizardProceed");
    const proceed = liquid.slice(proceedStart, liquid.indexOf("function trackWizardEntry"));
    assert.match(proceed, /selectedSpeedTrackFields\s*\(/);
    const courierEvents = liquid.slice(
      liquid.indexOf("function trackCourierQuoteEvents"),
      liquid.indexOf("function trackSlotSelected")
    );
    assert.match(courierEvents, /selectedSpeedTrackFields\s*\(/);
  });

  it('diagnostic card copy is service-neutral (no bare “We collect”)', () => {
    assert.doesNotMatch(
      liquid,
      /We collect, diagnose within 1 working day/
    );
    assert.match(
      liquid,
      /Once your device arrives — by courier or mail-in — we diagnose within 3 working days/
    );
  });
});
