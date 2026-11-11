/**
 * Courier / mail-in / diagnostic journey clocks (Ricky 2026-09-14).
 *
 * Conversion bias: shortest honest working-day clock when parts are in stock.
 * Courier collection day is day 1 of the clock.
 * Every clock below carries +1 working day (Michael and Ricky, Slack,
 * 2026-11-11): the workshop can't keep up with repair volume.
 * iPhone known repair: 2 working days (collect Mon → back Wed).
 * MacBook / iPad known repair: 3 working days (collect Mon → back Thu).
 * Watch: 4 (adhesive cure — physical constraint).
 * iPhone front camera on a Face ID model: 6-8 working days (was 5-7, Michael 2026-10-30).
 * The Face ID module is ordered from Apple for each device. Dates use the
 * upper bound (8) so the promise holds. Labels show the range.
 * Diagnostic: collect/receive → diagnose + email quote in 2 working days.
 * Device stays with us. No return until the customer approves a repair.
 *
 * Mail-in: pack ships same UK working day until 15:00 Europe/London.
 * UPost / device with us = next working day. Then bench, then return +1.
 * Clocks always use Europe/London — never the browser timezone.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectRepairJourney = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var PACK_CUTOFF_HOUR = 15;
  var LONDON_TZ = 'Europe/London';

  function londonWall(now) {
    var n = now || new Date();
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: LONDON_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(n);
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === type) return parts[i].value;
      }
      return '0';
    };
    var year = parseInt(get('year'), 10);
    var month = parseInt(get('month'), 10) - 1;
    var day = parseInt(get('day'), 10);
    var hour = parseInt(get('hour'), 10);
    var minute = parseInt(get('minute'), 10);
    return {
      date: new Date(year, month, day),
      hour: hour + minute / 60
    };
  }

  var DIAGNOSTIC_DAYS = 2;

  /* iPhone front camera / Face ID: the module is ordered from Apple per device. */
  var APPLE_FACE_ID_REPAIR_TYPES = { 'front-camera': true, 'face-id': true };
  var APPLE_FACE_ID_DAYS = { min: 6, max: 8 };
  var APPLE_FACE_ID_NOTE = 'The Face ID module needs to be ordered directly from Apple.';

  /* iPhone SE and iPhone 8 / 8 Plus have no Face ID. No model = assume Face ID. */
  function modelHasFaceId(model) {
    var name = String(model || '');
    if (!name) return true;
    if (/iPhone\s*SE\b/i.test(name)) return false;
    if (/\biPhone\s*8(\s*Plus)?\b/i.test(name)) return false;
    return true;
  }

  function repairTypesOf(opts) {
    var list = [];
    if (opts.repairType) list.push(opts.repairType);
    if (opts.repairTypes && opts.repairTypes.length) list = list.concat(opts.repairTypes);
    return list.map(function (t) { return String(t || '').toLowerCase(); });
  }

  /* True when any repair in the booking needs the Apple Face ID module. */
  function needsAppleFaceIdModule(device, opts) {
    opts = opts || {};
    if (opts.diagnostic || device !== 'iphone') return false;
    if (!modelHasFaceId(opts.model)) return false;
    var types = repairTypesOf(opts);
    for (var i = 0; i < types.length; i++) {
      if (APPLE_FACE_ID_REPAIR_TYPES[types[i]]) return true;
    }
    return false;
  }

  /* { min, max } working days on the bench. Mixed bookings take the longest. */
  function repairBenchRange(device, opts) {
    opts = opts || {};
    if (opts.diagnostic) return { min: DIAGNOSTIC_DAYS, max: DIAGNOSTIC_DAYS };
    if (needsAppleFaceIdModule(device, opts)) {
      return { min: APPLE_FACE_ID_DAYS.min, max: APPLE_FACE_ID_DAYS.max };
    }
    if (device === 'iphone') return { min: 2, max: 2 };
    if (device === 'watch') return { min: 4, max: 4 };
    // MacBook / iPad: 3 working days (was 2, +1 on 2026-11-11).
    return { min: 3, max: 3 };
  }

  /* Days used for dates. Always the upper bound of the range. */
  function repairBenchDays(device, opts) {
    return repairBenchRange(device, opts).max;
  }

  /* Client line explaining a longer clock, or ''. */
  function turnaroundNote(device, opts) {
    return needsAppleFaceIdModule(device, opts) ? APPLE_FACE_ID_NOTE : '';
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isWorkingDay(d) {
    var day = d.getDay();
    return day !== 0 && day !== 6;
  }

  function addWorkingDays(fromDate, n) {
    var d = startOfDay(fromDate);
    var left = n;
    if (left <= 0) return d;
    while (left > 0) {
      d.setDate(d.getDate() + 1);
      if (isWorkingDay(d)) left--;
    }
    return d;
  }

  function packShipDate(now) {
    var wall = londonWall(now);
    var d = startOfDay(wall.date);
    if (!isWorkingDay(d) || wall.hour >= PACK_CUTOFF_HOUR) {
      return addWorkingDays(d, 1);
    }
    return d;
  }

  function turnaroundClaimLabel(device, opts) {
    opts = opts || {};
    if (opts.diagnostic) return 'Quote in ' + DIAGNOSTIC_DAYS + ' working days';
    var range = repairBenchRange(device, opts);
    if (range.min !== range.max) return range.min + '-' + range.max + ' working days';
    if (range.max === 1) return '1 working day';
    return range.max + ' working days';
  }

  function repairOpts(opts) {
    var o = {};
    opts = opts || {};
    for (var k in opts) if (Object.prototype.hasOwnProperty.call(opts, k)) o[k] = opts[k];
    o.diagnostic = false;
    return o;
  }

  function courierRepairJourney(device, collectDate, opts) {
    var ro = repairOpts(opts);
    var bench = repairBenchDays(device, ro);
    var note = turnaroundNote(device, ro);
    if (!collectDate) {
      return {
        kind: 'repair',
        steps: [
          { title: 'We collect', meta: 'Pick a collection window' },
          { title: 'We repair', meta: turnaroundClaimLabel(device, ro) },
          { title: 'Back to you', meta: 'After repair' }
        ],
        returnDate: null,
        quoteDate: null,
        note: note
      };
    }
    var returnDate = addWorkingDays(collectDate, bench);
    return {
      kind: 'repair',
      steps: [
        { title: 'We collect', meta: collectDate },
        { title: 'We repair', meta: turnaroundClaimLabel(device, ro) },
        { title: 'Back to you', meta: returnDate }
      ],
      returnDate: returnDate,
      quoteDate: null,
      note: note
    };
  }

  function courierDiagnosticJourney(collectDate) {
    if (!collectDate) {
      return {
        kind: 'diagnostic',
        steps: [
          { title: 'We collect', meta: 'Pick a collection window' },
          { title: 'We diagnose & email your quote', meta: DIAGNOSTIC_DAYS + ' working days after collection' },
          { title: 'You decide next', meta: 'Device stays with us until you approve' }
        ],
        returnDate: null,
        quoteDate: null
      };
    }
    var quoteDate = addWorkingDays(collectDate, DIAGNOSTIC_DAYS);
    return {
      kind: 'diagnostic',
      steps: [
        { title: 'We collect', meta: collectDate },
        { title: 'We diagnose & email your quote', meta: quoteDate },
        { title: 'You decide next', meta: 'Device stays with us until you approve' }
      ],
      returnDate: null,
      quoteDate: quoteDate
    };
  }

  function mailinRepairJourney(device, now, opts) {
    var ro = repairOpts(opts);
    var bench = repairBenchDays(device, ro);
    var ship = packShipDate(now);
    var weReceive = addWorkingDays(ship, 1);
    var repairDone = addWorkingDays(weReceive, bench);
    var returnDate = addWorkingDays(repairDone, 1);
    return {
      kind: 'repair',
      steps: [
        { title: 'We send packaging', meta: ship },
        { title: 'You post the device', meta: weReceive },
        { title: 'We repair', meta: turnaroundClaimLabel(device, ro) },
        { title: 'Back to you', meta: returnDate }
      ],
      returnDate: returnDate,
      quoteDate: null,
      note: turnaroundNote(device, ro)
    };
  }

  function mailinDiagnosticJourney(now) {
    var ship = packShipDate(now);
    var weReceive = addWorkingDays(ship, 1);
    var quoteDate = addWorkingDays(weReceive, DIAGNOSTIC_DAYS);
    return {
      kind: 'diagnostic',
      steps: [
        { title: 'We send packaging', meta: ship },
        { title: 'You post the device', meta: weReceive },
        { title: 'We diagnose & email your quote', meta: quoteDate },
        { title: 'You decide next', meta: 'Device stays with us until you approve' }
      ],
      returnDate: null,
      quoteDate: quoteDate
    };
  }

  return {
    PACK_CUTOFF_HOUR: PACK_CUTOFF_HOUR,
    DIAGNOSTIC_DAYS: DIAGNOSTIC_DAYS,
    APPLE_FACE_ID_NOTE: APPLE_FACE_ID_NOTE,
    repairBenchDays: repairBenchDays,
    repairBenchRange: repairBenchRange,
    needsAppleFaceIdModule: needsAppleFaceIdModule,
    turnaroundNote: turnaroundNote,
    addWorkingDays: addWorkingDays,
    packShipDate: packShipDate,
    turnaroundClaimLabel: turnaroundClaimLabel,
    courierRepairJourney: courierRepairJourney,
    courierDiagnosticJourney: courierDiagnosticJourney,
    mailinRepairJourney: mailinRepairJourney,
    mailinDiagnosticJourney: mailinDiagnosticJourney
  };
});
