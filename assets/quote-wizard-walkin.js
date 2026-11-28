/* Walk-in ("Bring it to our workshop") helpers for quote-wizard.js.
   Kept in their own file so quote-wizard.js stays smaller.
   No state lives here: quote-wizard.js passes in what each helper needs. */
(function () {
  'use strict';

  var LAST_HOUR = 15; /* same-day drop-off offered Mon to Fri until 3pm London time */
  var PARTS = { morning: '9am – 12pm', afternoon: '12pm – 6pm' };

  function isAfternoon(partId) {
    return /after|pm/i.test(String(partId || ''));
  }

  /* Drop-off window shown on the button and stored on the order. */
  function windowLabel(partId) {
    return isAfternoon(partId) ? PARTS.afternoon : PARTS.morning;
  }

  /* Courier dates start tomorrow; a walk-in can be today while enabled and before 3pm London time. */
  function dates(list, wall, isoOf, opts) {
    if (opts && opts.allowSameDay === false) return list;
    var d = wall.date;
    var dow = d.getDay();
    if (dow < 1 || dow > 5 || wall.hour >= LAST_HOUR) return list;
    var iso = isoOf(d);
    if (list.length && list[0].iso === iso) return list;
    return [{
      iso: iso,
      date: new Date(d.getTime()),
      isToday: true,
      labelDow: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      labelDay: String(d.getDate()),
      labelMon: d.toLocaleDateString('en-GB', { month: 'short' }),
      headline: 'Today'
    }].concat(list);
  }

  /* opts: { workshop, selected (slot date or null), todayIso, hour, onAutoPM } */
  function applyMode(panel, opts) {
    var label = panel.querySelector('.qw-section-label');
    if (label) label.textContent = opts.workshop ? 'Pick a drop-off time' : 'Pick a collection window';
    var btns = panel.querySelectorAll('.qw-window-btn');
    btns.forEach(function (btn) {
      btn.classList.remove('qw-window-off');
      btn.removeAttribute('aria-disabled');
      btn.disabled = false;
    });
    if (!opts.workshop) return;
    var sel = opts.selected;
    var afterMidday = !!(sel && sel.iso === opts.todayIso && opts.hour >= 12);
    var switchToPm = false;
    btns.forEach(function (btn) {
      var id = btn.getAttribute('data-part') || '';
      var detail = btn.querySelector('.qw-window-detail');
      if (detail) detail.textContent = windowLabel(id, sel && sel.date);
      if (afterMidday && !isAfternoon(id)) {
        btn.classList.add('qw-window-off');
        btn.setAttribute('aria-disabled', 'true');
        btn.disabled = true;
        if (btn.classList.contains('active')) {
          switchToPm = true;
        }
      }
    });
    if (switchToPm) {
      btns.forEach(function (btn) {
        var pm = isAfternoon(btn.getAttribute('data-part') || '');
        btn.classList.toggle('active', pm);
        btn.setAttribute('aria-selected', pm ? 'true' : 'false');
      });
      if (typeof opts.onAutoPM === 'function') opts.onAutoPM();
    }
  }

  /* h: { drop (Date|null), bench, turnaround, note, diagnostic, fmt, addWorkingDays } */
  function journey(h) {
    if (h.diagnostic) {
      var quoteDate = h.drop ? h.addWorkingDays(h.drop, 1) : null;
      var diagSteps = [
        { title: 'You drop it off', meta: h.drop ? h.fmt(h.drop) : 'Pick a drop-off time' },
        { title: 'We diagnose & email your quote', meta: quoteDate ? h.fmt(quoteDate) : '1 working day after drop-off' },
        { title: 'You decide next', meta: 'Device stays with us until you approve' }
      ];
      return {
        kind: 'diagnostic',
        etaLabel: 'We\'ll tell you what\'s wrong by',
        note: 'Device stays with us until you approve a repair',
        steps: diagSteps,
        returnDate: null,
        quoteDate: quoteDate
      };
    }
    var steps = [
      { title: 'You drop it off', meta: h.drop ? h.fmt(h.drop) : 'Pick a drop-off time' },
      { title: 'We repair', meta: h.turnaround },
      { title: 'Ready to collect', meta: 'After repair' }
    ];
    var ready = h.drop ? h.addWorkingDays(h.drop, h.bench) : null;
    if (ready) steps[2].meta = h.fmt(ready);
    return { kind: 'repair', etaLabel: 'Ready to collect by', note: ready ? h.note : undefined, steps: steps, returnDate: ready, quoteDate: null };
  }

  window.ICorrectWalkin = { dates: dates, applyMode: applyMode, windowLabel: windowLabel, journey: journey };
})();
