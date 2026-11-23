/* Quote result layout (phase 1): one complete quote after the postcode.
   - Summary: price card (total, return date, Klarna), Book, trust tiles,
     email and question. Sticky right column on desktop (CSS).
   - Collection / drop-off picker collapses to one line with Change.
     The earliest slot is already preselected by renderCollectionSlots.
   - Journey steps sit behind "How it works" on mobile.
   Watches the wizard with a MutationObserver, so quote-wizard.js only
   calls ICorrectQuoteLayout.focus() after a postcode resolves. */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function txt(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function wide() { return !!(window.matchMedia && window.matchMedia('(min-width: 1024px)').matches); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  var CHEVRON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function arrange(card) {
    var price = $('qwResPrice');
    var cta = card.querySelector('.qw-res-cta');
    if (!price || !cta) return;
    card.setAttribute('data-qw-layout', '1');
    card.classList.add('qw-res--split');

    var sum = document.createElement('div');
    sum.id = 'qwSummary';
    sum.className = 'qw-sum';
    sum.appendChild(price);
    sum.appendChild(cta);
    var acc = $('qwCAcc');
    if (acc) sum.appendChild(acc);
    card.appendChild(sum);

    var trust = sum.querySelector('.qw-trust-cross');
    if (trust) {
      if (!trust.id) trust.id = 'qwTrustCross';
      var trustBtn = document.createElement('button');
      trustBtn.type = 'button';
      trustBtn.className = 'qw-how qw-trust-toggle';
      trustBtn.id = 'qwTrustToggle';
      trustBtn.hidden = true;
      trustBtn.setAttribute('aria-expanded', 'false');
      trustBtn.setAttribute('aria-controls', trust.id);
      trustBtn.innerHTML = '<span>Reviews &amp; guarantee</span>' + CHEVRON;
      sum.appendChild(trustBtn);
    }

    var big = $('qwPriceBigWrap');
    if (big) {
      var eta = document.createElement('div');
      eta.id = 'qwSumEta';
      eta.className = 'qw-sum-eta';
      eta.hidden = true;
      big.insertBefore(eta, $('qwKlarna'));
    }

    var panel = $('qwSlotPanel');
    if (panel) {
      var line = document.createElement('div');
      line.className = 'qw-slot-line';
      line.innerHTML = '<span class="qw-slot-line-txt"><span class="qw-slot-line-k"></span><strong class="qw-slot-line-v"></strong></span>' +
        '<button type="button" class="qw-slot-change">Change</button>';
      panel.insertBefore(line, panel.firstChild);
    }

    var host = $('qwJourney');
    if (host && host.parentNode) {
      var how = document.createElement('button');
      how.type = 'button';
      how.className = 'qw-how';
      how.id = 'qwHow';
      how.hidden = true;
      how.setAttribute('aria-expanded', 'false');
      how.setAttribute('aria-controls', 'qwJourney');
      how.innerHTML = '<span>How it works</span>' + CHEVRON;
      host.parentNode.insertBefore(how, host);
    }

    placeJourney();

    card.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var p = $('qwSlotPanel');
      if (t.closest('.qw-slot-change') && p) {
        p.classList.remove('qw-collapsed');
        return;
      }
      if (t.closest('#qwSlotParts .qw-window-btn') && p) {
        p.classList.add('qw-collapsed');
        return;
      }
      var tb = t.closest('#qwTrustToggle');
      if (tb) {
        var tc = $('qwTrustCross');
        var tOpen = !(tc && tc.classList.contains('qw-trust-open'));
        if (tc) tc.classList.toggle('qw-trust-open', tOpen);
        tb.setAttribute('aria-expanded', tOpen ? 'true' : 'false');
        return;
      }
      var h = t.closest('#qwHow');
      if (h) {
        var j = $('qwJourney');
        var open = !(j && j.classList.contains('qw-jr-open'));
        if (j) j.classList.toggle('qw-jr-open', open);
        h.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });

    var state = { slotVisible: false };
    var queued = false;
    var mo = new MutationObserver(function () {
      if (queued) return;
      queued = true;
      Promise.resolve().then(function () { queued = false; sync(state); });
    });
    mo.observe(card, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
    sync(state);
  }

  function sync(state) {
    var panel = $('qwSlotPanel');
    if (panel) {
      var vis = !panel.hidden;
      if (vis && !state.slotVisible) panel.classList.add('qw-collapsed');
      state.slotVisible = vis;
      var sel = document.querySelector('#qwDeliveryGrid .qw-opt-card.sel');
      var workshop = sel && sel.getAttribute('data-svc') === 'workshop';
      var d = document.querySelector('#qwSlotDates .qw-date-btn.active');
      var w = document.querySelector('#qwSlotParts .qw-window-btn.active');
      var when = d ? dayLabel(d.getAttribute('data-iso'), txt(d.querySelector('.qw-date-dow'))) : '';
      var win = w ? (txt(w.querySelector('.qw-window-detail')) || txt(w.querySelector('.qw-window-label'))) : '';
      setText(panel.querySelector('.qw-slot-line-k'), workshop ? 'Drop-off' : 'Collection');
      setText(panel.querySelector('.qw-slot-line-v'), when + (win ? ' · ' + win : ''));
    }

    var host = $('qwJourney');
    var how = $('qwHow');
    var shown = !!(host && !host.hidden && host.querySelector('.qw-jr'));
    if (how && how.hidden === shown) how.hidden = !shown;

    var sum = $('qwSummary');
    var big = $('qwPriceBigWrap');
    var priced = !!(big && !big.hidden);
    if (sum) sum.classList.toggle('qw-priced', priced);
    var trustBtn = $('qwTrustToggle');
    if (trustBtn && trustBtn.hidden === priced) trustBtn.hidden = !priced;

    var eta = $('qwSumEta');
    if (eta) {
      var label = shown ? txt(host.querySelector('.qw-journey-eta-label')) : '';
      var date = shown ? txt(host.querySelector('.qw-journey-eta-date')) : '';
      var note = shown ? txt(host.querySelector('.qw-journey-eta-note')) : '';
      var key = label + '|' + date + '|' + note;
      if (eta.getAttribute('data-k') !== key) {
        eta.setAttribute('data-k', key);
        eta.innerHTML = date
          ? '<span class="qw-sum-eta-k">' + esc(/\bby$/i.test(label) ? label : (label || 'Back with you') + ' by') + '</span> <strong class="qw-sum-eta-v">' + esc(date) + '</strong>' +
            (note ? '<span class="qw-sum-eta-n">' + esc(note) + '</span>' : '')
          : '';
        eta.hidden = !date;
      }
    }
  }

  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  /* "Today, 23 Nov" / "Tomorrow, 24 Nov" / "Wed 25 Nov" */
  function dayLabel(iso, head) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return head;
    var dt = new Date(+m[1], +m[2] - 1, +m[3]);
    var day = dt.getDate() + ' ' + MON[dt.getMonth()];
    return /^(today|tomorrow)$/i.test(head) ? head + ', ' + day : DOW[dt.getDay()] + ' ' + day;
  }

  /* Mobile: "How it works" sits under Book so the total and Book fit one
     screen. Desktop: the timeline stays in the left column. */
  function placeJourney() {
    var how = $('qwHow'), host = $('qwJourney'), sum = $('qwSummary'), reveal = $('qwDeliveryReveal');
    if (!how || !host || !sum || !reveal) return;
    var target = wide() ? reveal : sum;
    if (host.parentNode === target) return;
    target.appendChild(how);
    target.appendChild(host);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  /* After a postcode: land on "how it gets to us" with the total and Book
     below it, clear of the sticky site header. */
  function focus() {
    setTimeout(function () {
      requestAnimationFrame(function () {
        var t = $('qwDeliveryChoice');
        if (!t || t.hidden || !t.offsetParent) t = $('qwPostcodeCard');
        if (!t) return;
        var head = document.querySelector('.section-header');
        var hb = head ? head.getBoundingClientRect() : null;
        var off = hb && hb.top <= 1 ? Math.max(0, hb.bottom) : 0;
        if (wide()) {
          /* Desktop: the summary sticks beside the questions; show the card top. */
          var card = $('qwResCard');
          var book = $('qwBookBtn');
          if (!card) return;
          if (book && book.getBoundingClientRect().bottom <= window.innerHeight && t.getBoundingClientRect().bottom <= window.innerHeight) return;
          t = card;
        }
        var y = t.getBoundingClientRect().top - off - 12;
        if (Math.abs(y) < 4) return;
        var smooth = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        window.scrollBy({ top: y, behavior: smooth ? 'smooth' : 'auto' });
      });
    }, 160);
  }

  function scan() {
    var card = $('qwResCard');
    if (card && !card.getAttribute('data-qw-layout')) arrange(card);
  }

  /* Sticky site header height, so the sticky summary clears it on desktop. */
  function setHead() {
    var head = document.querySelector('.section-header');
    var h = head ? Math.round(head.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--qw-head', h + 'px');
  }

  function start() {
    setHead();
    window.addEventListener('resize', function () { setHead(); placeJourney(); });
    var root = document.querySelector('.qw-wizard') || document.body;
    new MutationObserver(scan).observe(root, { childList: true, subtree: true });
    scan();
  }

  window.ICorrectQuoteLayout = { focus: focus, arrange: arrange };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
