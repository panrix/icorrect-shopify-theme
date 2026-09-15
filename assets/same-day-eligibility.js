/**
 * Same-day express eligibility (inner London B1/B2, stock + slot cap).
 * Europe/London wall clock — never browser-local getHours().
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectSameDay = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

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

  function londonHour(now) {
    return londonWall(now).hour;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isWorkingDay(d) {
    var day = d.getDay();
    return day !== 0 && day !== 6;
  }

  function nextWorkingDays(fromDate, n) {
    var result = [];
    var d = startOfDay(fromDate);
    while (result.length < n) {
      if (isWorkingDay(d)) {
        result.push(new Date(d.getTime()));
      }
      d.setDate(d.getDate() + 1);
    }
    return result;
  }

  function isoDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function sameDayCutoffHour(device, band) {
    if (device === 'iphone' && band === 'B1') return 12;
    if (device === 'iphone' && band === 'B2') return 11;
    if (device === 'macbook' && (band === 'B1' || band === 'B2')) return 11;
    return null;
  }

  function slotsForDate(opts, iso) {
    if (opts.slotsByDate && Object.prototype.hasOwnProperty.call(opts.slotsByDate, iso)) {
      return opts.slotsByDate[iso];
    }
    return opts.slotsRemaining;
  }

  function dateEligible(opts, isToday) {
    opts = opts || {};
    if (opts.diagnostic) return { ok: false, reason: 'diagnostic' };
    if (opts.device !== 'iphone' && opts.device !== 'macbook') {
      return { ok: false, reason: 'device' };
    }
    if (opts.service !== 'courier') return { ok: false, reason: 'service' };
    if (opts.band !== 'B1' && opts.band !== 'B2') return { ok: false, reason: 'band' };
    if (opts.inStock !== true) return { ok: false, reason: 'in_stock' };
    var wall = londonWall(opts.now);
    var today = startOfDay(wall.date);
    if (!isWorkingDay(today)) return { ok: false, reason: 'weekend' };
    if (isToday && opts.device === 'macbook' && opts.collectionWindow !== 'morning') {
      return { ok: false, reason: 'collection_window' };
    }
    var iso = isoDate(today);
    var slots = slotsForDate(opts, iso);
    if (slots == null || slots < 1) return { ok: false, reason: 'slots' };
    if (isToday) {
      var cutoff = sameDayCutoffHour(opts.device, opts.band);
      if (cutoff == null) return { ok: false, reason: 'cutoff' };
      if (londonHour(opts.now) >= cutoff) return { ok: false, reason: 'cutoff' };
    }
    return { ok: true, reason: '' };
  }

  function todayEligible(opts) {
    return dateEligible(opts, true);
  }

  function dateOptions(opts) {
    opts = opts || {};
    var wall = londonWall(opts.now);
    var today = startOfDay(wall.date);
    var options = [];
    var todayResult = dateEligible(opts, true);
    if (isWorkingDay(today) && todayResult.ok) {
      var todayIso = isoDate(today);
      options.push({
        iso: todayIso,
        slotsRemaining: slotsForDate(opts, todayIso),
        available: true
      });
    }
    var dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 1);
    var futureDays = nextWorkingDays(dayAfter, 5);
    for (var i = 0; i < futureDays.length; i++) {
      var d = futureDays[i];
      var iso = isoDate(d);
      var futureOpts = Object.assign({}, opts, { now: d });
      var eligible = dateEligible(futureOpts, false);
      var slots = slotsForDate(opts, iso);
      var available = eligible.ok && slots != null && slots >= 1;
      options.push({
        iso: iso,
        slotsRemaining: slots == null ? 0 : slots,
        available: available
      });
    }
    return options;
  }

  return {
    londonHour: londonHour,
    isWorkingDay: isWorkingDay,
    nextWorkingDays: nextWorkingDays,
    sameDayCutoffHour: sameDayCutoffHour,
    todayEligible: todayEligible,
    dateOptions: dateOptions
  };
});
