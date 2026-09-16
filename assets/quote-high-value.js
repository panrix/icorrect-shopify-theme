/**
 * High-value convert + contextual pre-qual (Ricky 2026-09-16).
 *
 * Detect lives here so quote-wizard.liquid stays under Shopify’s 256 KB cap.
 * Lane A: replacement-class diagnostic → collect today, optional Safan 24h,
 *         eat B1 collect only on M-series Pro / 15–16 Pro liquid-or-dead.
 * Lane B: in-stock MacBook Pro screen/keyboard ≥£279 in B1/B2 → tomorrow included.
 * Questions sit on the same card and never block book / call.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectHighValue = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var LANE_B_MIN = 279;

  function text(value) {
    return String(value || '').toLowerCase().replace(/[“”]/g, '"');
  }

  function blob(ctx) {
    return text((ctx.fault || '') + ' ' + (ctx.issue || '') + ' ' + (ctx.label || ''));
  }

  function isLiquid(ctx) {
    return /liquid|spill|submerged|water damage|moisture|condensation/.test(blob(ctx));
  }

  function isDead(ctx) {
    return /won'?t turn on|won'?t power|phone dead|macbook dead|ipad dead|dead, need data|no display, no response|no signs of life/.test(blob(ctx));
  }

  function isMacBookPro(ctx) {
    var t = text(ctx.model);
    return ctx.device === 'macbook' && /macbook\s*pro|\bmbp\b/.test(t);
  }

  function isMSeries(ctx) {
    return /\bm[1-9](\s|$|pro|max|ultra)/.test(text(ctx.model));
  }

  function isMacBookAirM3Plus(ctx) {
    var t = text(ctx.model);
    return ctx.device === 'macbook' && /\bair\b/.test(t) && /\bm[3-9](\s|$|pro|max)/.test(t);
  }

  function isIphoneHighValue(ctx) {
    var t = text(ctx.model);
    if (ctx.device !== 'iphone') return false;
    if (/iphone\s*16\s*e\b/.test(t)) return false;
    if (/iphone\s*1[56]\s*pro/.test(t)) return true;
    return /iphone\s*16(\s*plus)?(\b|$)/.test(t);
  }

  function isIphone15or16Pro(ctx) {
    return ctx.device === 'iphone' && /iphone\s*1[56]\s*pro/.test(text(ctx.model));
  }

  function isIpadProM(ctx) {
    var t = text(ctx.model);
    return ctx.device === 'ipad' && /\bpro\b/.test(t) && isMSeries(ctx);
  }

  function isDiagnostic(ctx) {
    return ctx.route === 'diagnostic' || ctx.repairType === 'diagnostic';
  }

  function replacementClassDiagnostic(ctx) {
    if (!isDiagnostic(ctx)) return false;
    if (isMacBookPro(ctx) && isMSeries(ctx)) return true;
    if (isMacBookAirM3Plus(ctx) && (isLiquid(ctx) || isDead(ctx))) return true;
    if (isIphoneHighValue(ctx) && (isLiquid(ctx) || isDead(ctx))) return true;
    if (isIpadProM(ctx) && (isLiquid(ctx) || isDead(ctx))) return true;
    return false;
  }

  function eatCollectEligible(ctx) {
    if (!isDiagnostic(ctx) || !(isLiquid(ctx) || isDead(ctx))) return false;
    if (isMacBookPro(ctx) && isMSeries(ctx)) return true;
    if (isIphone15or16Pro(ctx)) return true;
    return false;
  }

  function laneBCandidate(ctx) {
    if (ctx.route === 'diagnostic') return false;
    if (ctx.device !== 'macbook' || !isMacBookPro(ctx)) return false;
    if (ctx.repairType !== 'screen' && ctx.repairType !== 'keyboard') return false;
    if (Number(ctx.repairPrice) < LANE_B_MIN) return false;
    if (ctx.inStock === false) return false;
    return true;
  }

  function evaluate(raw) {
    var ctx = raw || {};
    var band = ctx.band || null;
    var askPrequal = isDiagnostic(ctx);
    var laneA = replacementClassDiagnostic(ctx);
    var bCandidate = laneBCandidate(ctx);
    var includedFast = bCandidate && (band === 'B1' || band === 'B2');
    var laneB = bCandidate && (band === 'B1' || band === 'B2' || !band);
    var eatEligible = eatCollectEligible(ctx);
    var lane = laneA ? 'A' : (laneB ? 'B' : null);
    return {
      lane: lane,
      highValue: !!lane,
      laneBCandidate: bCandidate,
      eatCollectEligible: eatEligible,
      eatCollect: eatEligible && band === 'B1',
      diag24h: laneA && !!ctx.safan24hOpen,
      includedFast: includedFast,
      callDefaultOn: !!lane,
      askPrequal: askPrequal
    };
  }

  function withEatCollect(quote, evaluation) {
    if (!quote || !evaluation || !evaluation.eatCollect) return quote;
    if (quote.band !== 'B1') return quote;
    if (quote.service && quote.service !== 'courier') return quote;
    return Object.assign({}, quote, { adjustment: 0, tier: 'free' });
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function callRow(checked) {
    return '<label class="qw-hv-call" for="qwHvCall">' +
      '<input type="checkbox" id="qwHvCall"' + (checked ? ' checked' : '') + '>' +
      '<span>Call me about this — afternoon is fine</span></label>';
  }

  function badge(kind, label) {
    var cls = kind === 'go' ? 'qw-badge-green' : 'qw-badge-amber';
    return '<div class="qw-res-badge ' + cls + '">' + esc(label) + '</div>';
  }

  function diagnosticCardIntroHtml(iss, evaluation) {
    iss = iss || {};
    evaluation = evaluation || {};
    if (evaluation.lane === 'A') {
      var word = evaluation.diag24h
        ? 'We word back in 24 hours once it is on the bench.'
        : 'We word back the next working day once it is on the bench.';
      return '<div class="qw-hv-card" data-hv-lane="A">' +
        badge('go', 'We want this job') +
        '<h3 class="qw-res-h">We can collect it today</h3>' +
        '<p class="qw-res-p">Afternoon windows count. As long as the machine is on a bike today, it is in.</p>' +
        '<p class="qw-res-p">' + word + ' The £49 diagnostic is how we start — repair or like-for-like after we have looked. We will not invent a replacement price until we have the serial or the board in front of us.</p>' +
        (iss.copy ? '<p class="qw-res-p">' + esc(iss.copy) + '</p>' : '') +
        callRow(!!evaluation.callDefaultOn) +
      '</div>';
    }
    return badge('look', 'We need to take a look') +
      '<h3 class="qw-res-h">Book a Diagnostic</h3>' +
      (iss.copy ? '<p class="qw-res-p">' + esc(iss.copy) + '</p>' : '') +
      '<p class="qw-res-p">We can\'t quote the full repair until we\'ve looked. The prices below are a guide — diagnostic first, then the repair if the board or other parts need work.</p>' +
      '<p class="qw-res-p">Once your device arrives — by courier or mail-in — we diagnose within 3 working days and email your quote. The device stays with us until you decide.</p>';
  }

  function repairCardIntroHtml(product, evaluation) {
    product = product || {};
    evaluation = evaluation || {};
    var title = product.title || 'Your repair';
    var copy = product.copy || '';
    if (evaluation.lane === 'B' || evaluation.laneBCandidate) {
      return '<div class="qw-hv-card" data-hv-lane="B">' +
        badge('go', 'In stock — we\'ll move') +
        '<h3 class="qw-res-h">We can collect it today</h3>' +
        '<p class="qw-res-p">Afternoon windows count. On inner London jobs this size, tomorrow is included once we have your postcode. Same-day is the paid pull-forward if a slot is left.</p>' +
        '<p class="qw-res-p">' + esc(title) + (copy ? ' — ' + esc(copy) : '') + '</p>' +
        callRow(!!evaluation.callDefaultOn) +
      '</div>';
    }
    return badge('go', 'We can fix this') +
      '<h3 class="qw-res-h">' + esc(title) + '</h3>' +
      (copy ? '<p class="qw-res-p">' + esc(copy) + '</p>' : '');
  }

  function prequalHtml(evaluation) {
    evaluation = evaluation || {};
    if (!evaluation.askPrequal && evaluation.lane !== 'A') return '';
    return '<div class="qw-hv-prequal" id="qwHvPrequal">' +
      '<p class="qw-hv-prequal-kicker">Optional — does not hold up booking</p>' +
      '<p class="qw-hv-q">Has it been to the Apple Store / Apple for a diagnosis?</p>' +
      '<div class="qw-hv-choices" role="radiogroup" aria-label="Apple diagnosis">' +
        '<label><input type="radio" name="qwHvApple" id="qwHvAppleYes" value="yes"> Yes</label>' +
        '<label><input type="radio" name="qwHvApple" id="qwHvAppleNo" value="no"> No</label>' +
        '<label><input type="radio" name="qwHvApple" id="qwHvAppleUnknown" value="unknown"> Not sure</label>' +
      '</div>' +
      '<div class="qw-hv-apple-out" id="qwHvAppleOut" hidden>' +
        '<label class="qw-hv-field" for="qwHvAppleOutcome">What did they say?</label>' +
        '<select id="qwHvAppleOutcome" class="qw-hv-select">' +
          '<option value="">Select if you know</option>' +
          '<option value="refused">They said they won’t repair it</option>' +
          '<option value="replacement_quoted">They quoted a replacement / whole-unit swap</option>' +
          '<option value="repair_quoted">They quoted a repair</option>' +
          '<option value="unsure">They weren’t sure / I didn’t go ahead</option>' +
        '</select>' +
        '<p class="qw-hv-tighten" id="qwHvAppleTighten" hidden>Apple have already said no — this is the job we take.</p>' +
      '</div>' +
      '<p class="qw-hv-q">Is the data on this device important to keep?</p>' +
      '<div class="qw-hv-choices" role="radiogroup" aria-label="Data important">' +
        '<label><input type="radio" name="qwHvData" id="qwHvDataYes" value="yes"> Yes, repair to keep the data if we can</label>' +
        '<label><input type="radio" name="qwHvData" id="qwHvDataNo" value="no"> No, I have a backup</label>' +
        '<label><input type="radio" name="qwHvData" id="qwHvDataUnknown" value="unknown"> Not sure</label>' +
      '</div>' +
      '<label class="qw-hv-field" for="qwHvSerial">Optional serial</label>' +
      '<input type="text" id="qwHvSerial" class="qw-hv-input" autocomplete="off" placeholder="Underside / About This Mac / Settings">' +
      '<p class="qw-hv-hint">If you can read it, we can price a like-for-like properly. Skip is fine.</p>' +
    '</div>';
  }

  function checkedVal(root, ids) {
    for (var i = 0; i < ids.length; i++) {
      var el = root.querySelector(ids[i].sel);
      if (el && el.checked) return ids[i].value;
    }
    return '';
  }

  function readPrequal(root) {
    root = root || (typeof document !== 'undefined' ? document : null);
    if (!root || typeof root.querySelector !== 'function') {
      return { apple_diagnosed: '', apple_outcome: '', data_important: '', serial: '', call_requested: false };
    }
    var apple = checkedVal(root, [
      { sel: '#qwHvAppleYes', value: 'yes' },
      { sel: '#qwHvAppleNo', value: 'no' },
      { sel: '#qwHvAppleUnknown', value: 'unknown' }
    ]);
    var data = checkedVal(root, [
      { sel: '#qwHvDataYes', value: 'yes' },
      { sel: '#qwHvDataNo', value: 'no' },
      { sel: '#qwHvDataUnknown', value: 'unknown' }
    ]);
    var outcomeEl = root.querySelector('#qwHvAppleOutcome');
    var serialEl = root.querySelector('#qwHvSerial');
    var callEl = root.querySelector('#qwHvCall');
    return {
      apple_diagnosed: apple,
      apple_outcome: apple === 'yes' && outcomeEl ? String(outcomeEl.value || '') : '',
      data_important: data,
      serial: serialEl ? String(serialEl.value || '').trim() : '',
      call_requested: !!(callEl && callEl.checked)
    };
  }

  function wirePrequal(root) {
    root = root || (typeof document !== 'undefined' ? document : null);
    if (!root || typeof root.querySelector !== 'function') return;
    var yes = root.querySelector('#qwHvAppleYes');
    var out = root.querySelector('#qwHvAppleOut');
    var outcome = root.querySelector('#qwHvAppleOutcome');
    var tighten = root.querySelector('#qwHvAppleTighten');
    function sync() {
      var show = !!(yes && yes.checked);
      if (out) out.hidden = !show;
      if (tighten) tighten.hidden = !(outcome && outcome.value === 'refused');
    }
    ['#qwHvAppleYes', '#qwHvAppleNo', '#qwHvAppleUnknown'].forEach(function (sel) {
      var el = root.querySelector(sel);
      if (el) el.addEventListener('change', sync);
    });
    if (outcome) outcome.addEventListener('change', sync);
    sync();
  }

  function cartPrequalAttributes(prequal, evaluation) {
    var a = {};
    prequal = prequal || {};
    evaluation = evaluation || {};
    if (evaluation.lane) a['High-value lane'] = evaluation.lane;
    if (prequal.apple_diagnosed) a['Apple diagnosed'] = prequal.apple_diagnosed;
    if (prequal.apple_outcome) a['Apple outcome'] = prequal.apple_outcome;
    if (prequal.data_important) a['Data important'] = prequal.data_important;
    if (prequal.serial) a['Serial'] = prequal.serial;
    if (prequal.call_requested) a['Call requested'] = 'yes';
    return a;
  }

  function appendIntakeNotes(body, extra) {
    extra = extra || {};
    var bits = [body || ''];
    if (extra.high_value_lane) bits.push('High-value lane ' + extra.high_value_lane + '.');
    if (extra.apple_diagnosed) bits.push('Apple diagnosed: ' + extra.apple_diagnosed + '.');
    if (extra.apple_outcome) bits.push('Apple outcome: ' + extra.apple_outcome + '.');
    if (extra.data_important) bits.push('Data important: ' + extra.data_important + '.');
    if (extra.serial) bits.push('Serial: ' + extra.serial + '.');
    if (extra.call_requested) bits.push('Call requested.');
    return bits.join(' ').replace(/\s+/g, ' ').trim();
  }

  function enrichIntake(payload, extra) {
    payload = payload || {};
    if (!payload.contact) payload.contact = {};
    payload.contact.body = appendIntakeNotes(payload.contact.body, extra);
    return payload;
  }

  return {
    LANE_B_MIN: LANE_B_MIN,
    evaluate: evaluate,
    withEatCollect: withEatCollect,
    diagnosticCardIntroHtml: diagnosticCardIntroHtml,
    repairCardIntroHtml: repairCardIntroHtml,
    prequalHtml: prequalHtml,
    readPrequal: readPrequal,
    wirePrequal: wirePrequal,
    cartPrequalAttributes: cartPrequalAttributes,
    appendIntakeNotes: appendIntakeNotes,
    enrichIntake: enrichIntake
  };
});
