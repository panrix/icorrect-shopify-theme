/* Ads page: MacBook screen repair (page.ads-macbook-screen). Small vanilla behaviour, no library.
   Both variants are in the page; layout/ads.liquid picks one in the head (data-variant).
   Variant B has no story, bar or diagrams, so those parts find nothing visible and stay idle.
   Motion is CSS only (transform and opacity). Script sets classes and the
   diagram kit's state number --p, nothing else. */
(() => {
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  if (params.has('clean')) root.classList.add('lp-clean');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('js-motion');
  const phone = matchMedia('(max-width: 600px)');
  const desktop = matchMedia('(min-width: 1024px)');

  /* ---- Tracking shim -------------------------------------------------------
     The Next.js port swaps this for PostHog and gtag (BRIEF.md section 6).
     No personal data goes into any event. */
  /* Events go to GA4 through the layout's gtag, which already carries lp, lp_variant and
     lp_in_test on every event. GA4 sends its own page_view, so page_view stays local. */
  const ab = window.lpAB || { variant: root.dataset.variant || 'a', inTest: false };
  const common = { lp: 'ads-macbook-screen', variant: ab.variant };
  const events = (window.lpEvents = window.lpEvents || []);
  const track = (event, props = {}) => {
    const e = { event, ...common, ...props, ts: Date.now() };
    events.push(e);
    if (event !== 'page_view' && typeof window.gtag === 'function') window.gtag('event', event, props);
    if (params.has('debug')) console.info('[lp]', e);
  };
  track('page_view', { viewport_width: innerWidth });

  /* ---- Diagrams ----------------------------------------------------------------
     A host (.dg) holds a kit SVG. It is fetched when its chapter is near, then
     mounted in a shadow root so the kit's styles and ids stay its own. Until
     then, and without script, the <img> fallback shows the file's final state. */
  const HOST_CSS = ':host{display:block}svg{display:block;width:100%;height:100%;overflow:hidden}';
  const HIDE = {
    // Chapter 3: only the inside of the workshop. No ground, route, trees, office or bike.
    workshop: '#d2-ground,#d2-route,#d2-props,#d2-office,#d2-bike,#d2-lab-home,#d2-lab-shop,[id^="d2-cap-"]{display:none}',
    // Phone crops: the legend under the drawing names the parts, so the numbered markers go.
    markers: '.lb,.ld,.ld-b,.dot,.dot-b{display:none}',
  };
  const hosts = [...document.querySelectorAll('.dg')];
  const shown = (el) => el.getClientRects().length > 0;

  const setP = (host, p) => {
    if (host.svg) host.svg.style.setProperty('--p', p);
  };

  const mount = (host) => {
    if (host.dataset.state) return;
    host.dataset.state = 'loading';
    const usePhone = phone.matches && !!host.dataset.srcPhone;
    const src = usePhone ? host.dataset.srcPhone : host.dataset.src;
    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        const img = host.querySelector('img');
        const shadow = host.attachShadow({ mode: 'open' });
        const hide = (HIDE[host.dataset.hide] || '') + (usePhone ? HIDE[host.dataset.hidePhone] || '' : '');
        shadow.innerHTML = `<style>${HOST_CSS}${hide}</style>${text.slice(text.indexOf('<svg'))}`;
        const svg = shadow.querySelector('svg');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('aria-hidden', 'true');
        // Frame the drawing to its own bounds. Phone files already come tightly cropped.
        if (host.dataset.viewbox && !usePhone) svg.setAttribute('viewBox', host.dataset.viewbox);
        host.svg = svg;
        const alt = (img && img.alt) || host.dataset.alt;
        if (alt) {
          host.setAttribute('role', 'img');
          host.setAttribute('aria-label', alt);
        }
        const from = reduce ? host.dataset.to : host.dataset.from;
        setP(host, from);
        host.dataset.state = 'ready';
        if (!reduce) {
          // Two frames: paint the start state, then let the kit's own transition run.
          requestAnimationFrame(() => requestAnimationFrame(() => {
            svg.classList.add('is-animated');
            if (host.isActive) setP(host, host.dataset.to);
          }));
        }
      })
      .catch(() => { host.dataset.state = 'failed'; });   // the <img> fallback stays
  };

  const hostsFor = (n) => hosts.filter((h) => h.dataset.ch === String(n));
  hosts.filter((h) => 'eager' in h.dataset && shown(h)).forEach(mount);

  /* ---- Story: one scroll reading drives progress, chapters and the stage ---- */
  const chapters = ab.variant === 'a' ? [...document.querySelectorAll('.lp-ch')] : [];
  const quote = document.getElementById('get-free-quote');
  if (quote) quote.setAttribute('tabindex', '-1');
  const bar = document.getElementById('lp-bar');
  const fill = bar && bar.querySelector('.lp-prog__fill');
  const dots = bar ? [...bar.querySelectorAll('.lp-prog__dot')] : [];
  const nowCount = bar && bar.querySelector('.lp-bar__count');
  const nowName = bar && bar.querySelector('.lp-bar__name');
  const stage = document.querySelector('.lp-stage__frame');
  const scenes = stage ? [...stage.querySelectorAll('.lp-scene')] : [];
  const records = [...document.querySelectorAll('.lp-record')];

  let edges = [];
  let shownKey = -1;
  let jumping = false;
  let jumpTimer = 0;
  let active = 0;
  let progress = 0;
  const seen = new Set();
  let viewTimer = 0;

  const measure = () => {
    if (!chapters.length || !quote) return;
    edges = [...chapters, quote].map((el) => el.getBoundingClientRect().top + scrollY);
  };

  // A rewind the visitor cannot see (a faded-out stage scene) happens at once, not over 0.9s.
  const rewind = (h) => {
    if (h.isActive || !h.svg) return;
    if (h.closest('.lp-scene')) {
      h.svg.classList.remove('is-animated');
      setP(h, h.dataset.from);
      requestAnimationFrame(() => requestAnimationFrame(() => h.svg.classList.add('is-animated')));
    } else setP(h, h.dataset.from);
  };

  const activate = (next, force) => {
    const prev = active;
    if (next === prev && !force) return;
    active = next;

    hostsFor(prev).forEach((h) => {
      h.isActive = false;
      // D1 goes back together when you leave it. Others rewind only when you scroll back up,
      // so they play again on the way down.
      if (!reduce && ('replay' in h.dataset || next < prev)) setTimeout(() => rewind(h), 260);
    });
    hostsFor(next).forEach((h) => {
      h.isActive = true;
      if (h.dataset.state === 'ready') setP(h, h.dataset.to);
    });
    // Fetch this chapter's drawings and the next one's before they arrive.
    for (let k = 1; k <= Math.min(chapters.length, next + 1); k++) {
      hostsFor(k).filter((h) => !h.dataset.state && shown(h)).forEach(mount);
    }
    records.forEach((r) => r.classList.toggle('is-on', reduce || next >= 5));

    scenes.forEach((s) => s.classList.toggle('is-on', s.dataset.sceneFor === String(next || 1)));

    clearTimeout(viewTimer);
    if (next && !seen.has(next)) {
      viewTimer = setTimeout(() => {
        if (active === next && !seen.has(next)) { seen.add(next); track('chapter_view', { chapter: next }); }
      }, 500);
    }
  };

  const paint = () => {
    if (edges.length < 2) return;
    const line = scrollY + innerHeight / 2;
    const n = edges.length - 1;   // six segments: one per chapter, the last runs to the quote
    let p = 0;
    if (line >= edges[n]) p = 1;
    else if (line > edges[0]) {
      let i = 0;
      while (i < n - 1 && line >= edges[i + 1]) i++;
      p = (i + (line - edges[i]) / (edges[i + 1] - edges[i])) / n;
    }
    progress = p;
    const next = p <= 0 ? 0 : Math.min(n, Math.floor(p * n) + 1);

    if (fill) fill.style.transform = `scaleX(${p.toFixed(4)})`;

    // Everything below changes only when the chapter changes, so write it only then.
    const key = p >= 1 ? 7 : next;
    if (key === shownKey) return;
    shownKey = key;
    dots.forEach((d, i) => {
      const k = i + 1;
      if (k === next && p < 1) { d.setAttribute('aria-current', 'step'); d.dataset.state = 'current'; }
      else { d.removeAttribute('aria-current'); d.dataset.state = k < next || p >= 1 ? 'done' : 'todo'; }
    });
    if (nowCount) {
      const label = next ? dots[next - 1].querySelector('.lp-prog__label').textContent : 'How it works';
      nowCount.textContent = `${p >= 1 ? 6 : next} of 6`;
      nowName.textContent = p >= 1 ? 'Your price' : label;
    }
    // During a jump (a dot or the sticky button) the page flies past chapters in between.
    // They are not activated on the way, so no drawing plays or loads for a chapter you skipped.
    if (!jumping) activate(next);
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; paint(); });
  };

  if (chapters.length) {
    measure();
    paint();
    activate(active, true);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { measure(); onScroll(); });
    if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); onScroll(); }).observe(document.body);
    if (document.fonts) document.fonts.ready.then(() => { measure(); onScroll(); });
  }

  /* Desktop stage: the test record and trust block move into the pinned stage,
     and back into their chapters under 1024px. One copy each, never two. */
  const uiFigs = [...document.querySelectorAll('.lp-ch__fig--ui')].map((fig) => ({ fig, home: fig.parentElement, after: fig.nextElementSibling }));
  const placeUi = () => {
    uiFigs.forEach(({ fig, home, after }) => {
      const n = home.dataset.ch;
      const scene = scenes.find((s) => s.dataset.sceneFor === n);
      if (desktop.matches && scene) scene.appendChild(fig);
      else home.insertBefore(fig, after);
    });
    hosts.filter(shown).filter((h) => Number(h.dataset.ch) <= active + 1).forEach(mount);
    measure();
    onScroll();
  };
  if (scenes.length) {
    placeUi();
    desktop.addEventListener('change', placeUi);
  }

  /* ---- Sticky bar ------------------------------------------------------------
     Visible from the first screen. Hidden while the quote is in view and while the
     on-screen keyboard is open. While the hero's own button is on screen the bar's
     button is secondary, so there is never more than one blue button in view. */
  if (bar) {
    const btn = bar.querySelector('.lp-bar__btn');
    let atQuote = false;
    let typing = false;
    const sync = () => bar.classList.toggle('is-hidden', atQuote || typing);

    if (quote && 'IntersectionObserver' in window) {
      // "At the quote" means its top has passed 60% of the screen, not its top padding peeking in.
      new IntersectionObserver(([e]) => { atQuote = e.isIntersecting; sync(); }, { rootMargin: '0px 0px -40% 0px' }).observe(quote);
    }
    const isField = (el) => el && el.matches && el.matches('input:not([type="radio"]):not([type="checkbox"]):not([type="button"]), textarea, select, [contenteditable="true"]');
    document.addEventListener('focusin', (e) => { if (isField(e.target)) { typing = true; sync(); } });
    document.addEventListener('focusout', (e) => { if (isField(e.target)) { typing = false; sync(); } });
    if (window.visualViewport) {
      visualViewport.addEventListener('resize', () => {
        typing = visualViewport.height < innerHeight * 0.75 || isField(document.activeElement);
        sync();
      });
    }

    const heroBtn = document.querySelector('.lp-hero__btn');
    if (heroBtn && btn && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => btn.classList.toggle('ic-btn--secondary', e.isIntersecting)).observe(heroBtn);
    }
  }

  /* ---- Links that jump: move focus to the target after the scroll ---------- */
  const focusLater = (el, now) => setTimeout(() => el.focus({ preventScroll: true }), reduce || now ? 0 : 450);
  const endJump = () => {
    if (!jumping) return;
    jumping = false;
    clearTimeout(jumpTimer);
    shownKey = -1;
    onScroll();
  };
  addEventListener('scrollend', endJump);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const focusEl = target.querySelector('.lp-ch__q') || target;
    // A keyboard press (detail 0) gets focus at once, no wait for the scroll.
    focusLater(focusEl, e.detail === 0);
    if (!reduce && chapters.length) {
      jumping = true;
      clearTimeout(jumpTimer);
      jumpTimer = setTimeout(endJump, 1200);   // browsers without scrollend
    }

    const cta = a.dataset.cta;
    if (cta === 'sticky') track('sticky_cta_click', { chapter: active, progress: Math.round(progress * 100) });
    else if (cta) track('cta_click', { position: cta, target: id === 'get-free-quote' ? 'quote' : 'story' });
    if (a.dataset.dot) track('progress_dot_click', { chapter: Number(a.dataset.dot), from_chapter: active });
  });

  /* ---- The live quote wizard ----------------------------------------------------
     The wizard is the theme's own section, unchanged. This page only listens:
     quote_start   the visitor's first tap or keypress inside the wizard
     quote_complete the all-in price is on screen
     It also tags the cart (lp, lp_variant, lp_in_test) so every booking from this page
     carries its version on the Shopify order. */
  const tagCart = (leaving) => {
    try {
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ attributes: { lp: 'ads-macbook-screen', lp_variant: ab.variant, lp_in_test: String(!!ab.inTest) } }),
        keepalive: !!leaving,
        credentials: 'same-origin',
      });
    } catch (e) { /* the booking still goes through, only the tag is lost */ }
  };
  if (quote) {
    let started = false;
    const start = (e) => {
      if (started || !e.isTrusted) return;
      started = true;
      track('quote_start', {});
      tagCart(false);
    };
    ['pointerdown', 'keydown'].forEach((t) => quote.addEventListener(t, start, { capture: true, passive: true }));

    let complete = false;
    const priceShown = () => {
      const el = quote.querySelector('#qwPriceBig, #qwPriceTotal');
      return !!el && !el.closest('[hidden]') && /\d/.test(el.textContent || '') && el.getClientRects().length > 0;
    };
    const watch = new MutationObserver(() => {
      if (complete || !started || !priceShown()) return;
      complete = true;
      track('quote_complete', {});
      watch.disconnect();
    });
    watch.observe(quote, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });

    (window.lpGtagListeners = window.lpGtagListeners || []).push((name) => {
      if (name === 'begin_checkout') tagCart(true);
    });
  }
})();
