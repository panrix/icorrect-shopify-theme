/**
 * Courier / mail-in / diagnostic journey clocks (Ricky 2026-09-14).
 *
 * Conversion bias: shortest honest working-day clock when parts are in stock.
 * Courier collection day is day 1 of the clock.
 * iPhone known repair: 1 working day (collect Mon → back Tue).
 * MacBook / iPad known repair: 3 working days (collect Mon → back Thu).
 * Watch stays 3 (adhesive cure — physical constraint).
 * Fast repair: 1 working day. Same-day: back on collect day (0 bench days).
 * Diagnostic: collect/receive → diagnose + email quote in 3 working days.
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

  function repairBenchDays(device, opts) {
    opts = opts || {};
    if (opts.speed === 'same_day') return 0;
    if (opts.speed === 'fast') return 1;
    if (opts.diagnostic) return 3;
    if (device === 'iphone') return 1;
    if (device === 'watch') return 3;
    return 3; // macbook / ipad
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
    if (opts.diagnostic) {
      if (opts.speed === 'fast') return 'Quote in 1 working day';
      return 'Quote in 3 working days';
    }
    if (opts.speed === 'same_day') return 'Same day';
    if (opts.speed === 'fast') return '1 working day';
    var days = repairBenchDays(device, opts);
    if (days === 1) return '1 working day';
    return days + ' working days';
  }

  function courierRepairJourney(device, collectDate, opts) {
    opts = opts || {};
    var bench = repairBenchDays(device, opts);
    if (!collectDate) {
      return {
        kind: 'repair',
        steps: [
          { title: 'We collect', meta: 'Pick a collection window' },
          { title: 'We repair', meta: turnaroundClaimLabel(device, opts) },
          { title: 'Back to you', meta: 'After repair' }
        ],
        returnDate: null,
        quoteDate: null
      };
    }
    var returnDate =
      opts.speed === 'same_day'
        ? startOfDay(collectDate)
        : addWorkingDays(collectDate, bench);
    return {
      kind: 'repair',
      steps: [
        { title: 'We collect', meta: collectDate },
        { title: 'We repair', meta: turnaroundClaimLabel(device, opts) },
        { title: 'Back to you', meta: returnDate }
      ],
      returnDate: returnDate,
      quoteDate: null
    };
  }

  function courierDiagnosticJourney(collectDate, opts) {
    opts = opts || {};
    var quoteDays = repairBenchDays(null, { diagnostic: true, speed: opts.speed });
    var quoteMeta = quoteDays === 1 ? '1 working day after collection' : '3 working days after collection';
    if (!collectDate) {
      return {
        kind: 'diagnostic',
        steps: [
          { title: 'We collect', meta: 'Pick a collection window' },
          { title: 'We diagnose & email your quote', meta: quoteMeta },
          { title: 'You decide next', meta: 'Device stays with us until you approve' }
        ],
        returnDate: null,
        quoteDate: null
      };
    }
    var quoteDate = addWorkingDays(collectDate, quoteDays);
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
    opts = opts || {};
    var bench = repairBenchDays(device, opts);
    var ship = packShipDate(now);
    var weReceive = addWorkingDays(ship, 1);
    var repairDone = addWorkingDays(weReceive, bench);
    var returnDate = addWorkingDays(repairDone, 1);
    return {
      kind: 'repair',
      steps: [
        { title: 'We send packaging', meta: ship },
        { title: 'You post the device', meta: weReceive },
        { title: 'We repair', meta: turnaroundClaimLabel(device, opts) },
        { title: 'Back to you', meta: returnDate }
      ],
      returnDate: returnDate,
      quoteDate: null
    };
  }

  function mailinDiagnosticJourney(now, opts) {
    opts = opts || {};
    var ship = packShipDate(now);
    var weReceive = addWorkingDays(ship, 1);
    var quoteDays = repairBenchDays(null, { diagnostic: true, speed: opts.speed });
    var quoteDate = addWorkingDays(weReceive, quoteDays);
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
    repairBenchDays: repairBenchDays,
    addWorkingDays: addWorkingDays,
    packShipDate: packShipDate,
    turnaroundClaimLabel: turnaroundClaimLabel,
    courierRepairJourney: courierRepairJourney,
    courierDiagnosticJourney: courierDiagnosticJourney,
    mailinRepairJourney: mailinRepairJourney,
    mailinDiagnosticJourney: mailinDiagnosticJourney
  };
});
