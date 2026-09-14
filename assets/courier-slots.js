/**
 * Courier collection slot helpers (#53 slice 3).
 *
 * Windows: Today (B1/B2 before 14:00 Europe/London), Tomorrow, or later — no customer-facing 2pm copy.
 * Day-parts: AM (09:00–12:00) / PM (12:00–17:00).
 * B3/B4: earliest = tomorrow.
 * Cutoff always uses UK time — never the browser timezone.
 *
 * Safe for browser (theme asset) and Node (tests).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectCourierSlots = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DAY_PARTS = [
    { id: 'AM', label: 'Morning', detail: '9am – 12pm', startHour: 9, endHour: 12 },
    { id: 'PM', label: 'Afternoon', detail: '12pm – 5pm', startHour: 12, endHour: 17 },
  ];

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function toISODate(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function addDays(d, n) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  }

  function isWeekend(d) {
    var day = d.getDay();
    return day === 0 || day === 6;
  }

  /**
   * @param {string|null} band B1–B4
   * @param {Date} [now]
   * @returns {{ todayAllowed: boolean, earliest: Date, reason: string }}
   */
  function londonHour(now) {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(now || new Date());
    var hour = 0;
    var minute = 0;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].type === 'hour') hour = parseInt(parts[i].value, 10);
      if (parts[i].type === 'minute') minute = parseInt(parts[i].value, 10);
    }
    return hour + minute / 60;
  }

  function londonToday(now) {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(now || new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === type) return parseInt(parts[i].value, 10);
      }
      return 0;
    };
    return new Date(get('year'), get('month') - 1, get('day'));
  }

  function earliestCollectionDay(band, now) {
    now = now || new Date();
    var today = startOfDay(londonToday(now));
    var hour = londonHour(now);
    var before2pm = hour < 14;
    var inner = band === 'B1' || band === 'B2';

    if (inner && before2pm) {
      return {
        todayAllowed: true,
        earliest: today,
        reason: '', /* cutoff still applies; no 2pm marketing copy */
      };
    }
    if (inner && !before2pm) {
      return {
        todayAllowed: false,
        earliest: addDays(today, 1),
        reason: '',
      };
    }
    return {
      todayAllowed: false,
      earliest: addDays(today, 1),
      reason: '',
    };
  }

  /**
   * Build upcoming selectable dates (skip weekends by default).
   * @param {string|null} band
   * @param {{ now?: Date, count?: number, includeWeekends?: boolean }} [opts]
   */
  function listCollectionDates(band, opts) {
    opts = opts || {};
    var now = opts.now || new Date();
    var count = opts.count || 8;
    var includeWeekends = !!opts.includeWeekends;
    var gate = earliestCollectionDay(band, now);
    var cursor = startOfDay(gate.earliest);
    var londonDay = startOfDay(londonToday(now));
    var todayISO = toISODate(londonDay);
    var out = [];

    var guard = 0;
    var maxGuard = Math.max(60, count * 3);
    while (out.length < count && guard < maxGuard) {
      guard += 1;
      if (!includeWeekends && isWeekend(cursor)) {
        cursor = addDays(cursor, 1);
        continue;
      }
      var iso = toISODate(cursor);
      var isToday = iso === todayISO;
      out.push({
        iso: iso,
        date: new Date(cursor.getTime()),
        isToday: isToday,
        labelDow: cursor.toLocaleDateString('en-GB', { weekday: 'short' }),
        labelDay: String(cursor.getDate()),
        labelMon: cursor.toLocaleDateString('en-GB', { month: 'short' }),
        headline: isToday ? 'Today' : iso === toISODate(addDays(londonDay, 1)) ? 'Tomorrow' : null,
      });
      cursor = addDays(cursor, 1);
    }
    return { gate: gate, dates: out };
  }

  function dayParts() {
    return DAY_PARTS.map(function (p) {
      return {
        id: p.id,
        label: p.label,
        detail: p.detail,
        windowLabel: p.label + ' (' + p.detail + ')',
      };
    });
  }

  /**
   * Human cart property for Collection Window.
   * @param {{ iso: string, isToday?: boolean }} date
   * @param {{ id: string, label: string, detail: string }} part
   */
  function formatCollectionWindow(date, part) {
    if (!date || !part) return '';
    var dayLabel = date.headline || date.iso;
    return dayLabel + ' · ' + part.label + ' ' + part.detail;
  }

  /**
   * Cart properties for a chosen slot (null-safe).
   */
  function slotCartProperties(date, part) {
    if (!date || !part) return null;
    return {
      'Collection Date': date.iso,
      'Collection Window': formatCollectionWindow(date, part),
    };
  }

  return {
    DAY_PARTS: DAY_PARTS,
    earliestCollectionDay: earliestCollectionDay,
    listCollectionDates: listCollectionDates,
    dayParts: dayParts,
    formatCollectionWindow: formatCollectionWindow,
    slotCartProperties: slotCartProperties,
    toISODate: toISODate,
    addDays: addDays,
  };
});
