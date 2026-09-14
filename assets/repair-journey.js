/**
 * Courier / mail-in / diagnostic journey clocks (Ricky 2026-09-14).
 *
 * Conversion bias: shortest honest working-day clock when parts are in stock.
 * Courier collection day is day 1 of the clock.
 * iPhone known repair: 1 working day (collect Mon → back Tue).
 * MacBook / iPad known repair: 2 working days (collect Mon → back Wed).
 * Watch stays 3 (adhesive cure — physical constraint).
 * Diagnostic: collect/receive → diagnose + email quote in 1 working day.
 * Device stays with us. No return until the customer approves a repair.
 *
 * Mail-in: we ship pack day 0, customer posts next working day, we receive
 * the day after that, then bench, then return (repair only).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectRepairJourney = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var PACK_CUTOFF_HOUR = 14;

  function repairBenchDays(device, opts) {
    opts = opts || {};
    if (opts.diagnostic) return 1;
    if (device === 'iphone') return 1;
    if (device === 'watch') return 3;
    // MacBook / iPad: 2 working days (Ricky 2026-09-14 confirm).
    return 2;
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
    var n = now || new Date();
    var d = startOfDay(n);
    if (!isWorkingDay(d) || n.getHours() >= PACK_CUTOFF_HOUR) {
      return addWorkingDays(d, 1);
    }
    return d;
  }

  function turnaroundClaimLabel(device, opts) {
    opts = opts || {};
    if (opts.diagnostic) return 'Quote in 1 working day';
    var days = repairBenchDays(device, opts);
    if (days === 1) return '1 working day';
    return days + ' working days';
  }

  function courierRepairJourney(device, collectDate) {
    var bench = repairBenchDays(device, { diagnostic: false });
    if (!collectDate) {
      return {
        kind: 'repair',
        steps: [
          { title: 'We collect', meta: 'Pick a collection window' },
          { title: 'We repair', meta: turnaroundClaimLabel(device) },
          { title: 'Back to you', meta: 'After repair' }
        ],
        returnDate: null,
        quoteDate: null
      };
    }
    var returnDate = addWorkingDays(collectDate, bench);
    return {
      kind: 'repair',
      steps: [
        { title: 'We collect', meta: collectDate },
        { title: 'We repair', meta: turnaroundClaimLabel(device) },
        { title: 'Back to you', meta: returnDate }
      ],
      returnDate: returnDate,
      quoteDate: null
    };
  }

  function courierDiagnosticJourney(collectDate) {
    if (!collectDate) {
      return {
        kind: 'diagnostic',
        steps: [
          { title: 'We collect', meta: 'Pick a collection window' },
          { title: 'We diagnose & email your quote', meta: '1 working day after collection' },
          { title: 'You decide next', meta: 'Device stays with us until you approve' }
        ],
        returnDate: null,
        quoteDate: null
      };
    }
    var quoteDate = addWorkingDays(collectDate, 1);
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

  function mailinRepairJourney(device, now) {
    var bench = repairBenchDays(device, { diagnostic: false });
    var ship = packShipDate(now);
    var youPost = addWorkingDays(ship, 1);
    var weReceive = addWorkingDays(youPost, 1);
    var repairDone = addWorkingDays(weReceive, bench);
    var returnDate = addWorkingDays(repairDone, 1);
    return {
      kind: 'repair',
      steps: [
        { title: 'We send packaging', meta: ship },
        { title: 'You post the device', meta: youPost },
        { title: 'We repair', meta: turnaroundClaimLabel(device) },
        { title: 'Back to you', meta: returnDate }
      ],
      returnDate: returnDate,
      quoteDate: null
    };
  }

  function mailinDiagnosticJourney(now) {
    var ship = packShipDate(now);
    var youPost = addWorkingDays(ship, 1);
    var weReceive = addWorkingDays(youPost, 1);
    var quoteDate = addWorkingDays(weReceive, 1);
    return {
      kind: 'diagnostic',
      steps: [
        { title: 'We send packaging', meta: ship },
        { title: 'You post the device', meta: youPost },
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
