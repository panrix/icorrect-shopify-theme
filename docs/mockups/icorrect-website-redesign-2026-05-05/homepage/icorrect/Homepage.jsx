// Homepage Nav, Hero variants, Proof section, and small support components.

// Fired when any "Help me diagnose" CTA is clicked. App listens and morphs hero.
function openDiagnose(e) {
  if (e) e.preventDefault();
  window.dispatchEvent(new CustomEvent("icorrect:diagnose-open"));
}

function HomepageNav() {
  return (
    <nav className="hp-nav">
      <div className="container hp-nav-inner">
        <a className="hp-logo" href="#">
          <span className="hp-logo-mark">iC</span>
          iCorrect
        </a>
        <div className="hp-nav-links">
          <a href="#">Repairs</a>
          <a href="#">Diagnostic</a>
          <a href="#">Specialist</a>
          <a href="#">How it works</a>
          <a href="#">Workshop</a>
        </div>
        <span className="hp-status">
          <span className="dot" /> Open · Fitzrovia
        </span>
        <a href="#wizard" className="hp-nav-cta">Get a quote →</a>
      </div>
    </nav>
  );
}

function HeroTrust({ reviewCount = 719, rating = 4.9 }) {
  return (
    <div className="hp-hero-trust">
      <span className="stars" aria-hidden="true">
        {[0,1,2,3,4].map(i => <Star key={i} />)}
      </span>
      <span><strong>{rating}</strong> · {reviewCount} Google reviews</span>
      <span className="sep">·</span>
      <span><strong>2-year</strong> warranty</span>
      <span className="sep">·</span>
      <span><strong>Microsoldering</strong> certified</span>
    </div>
  );
}

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z"/>
    </svg>
  );
}

/* ===== HERO V1 — Workshop split ===== */
function HeroWorkshop({ reviewCount, rating }) {
  return (
    <section className="hp-hero hp-hero-v1">
      <div className="container hp-hero-grid">
        <div>
          <div className="hp-hero-eyebrow">
            <span className="dot" />
            Microelectronic specialists · Fitzrovia, London
          </div>
          <h1>We repair what they can't.</h1>
          <p className="hp-hero-sub">
            Microsoldering, liquid damage recovery, and the repairs Apple writes off — done in-house at our Fitzrovia workshop. Genuine parts. Two-year warranty.
          </p>
          <div className="hp-hero-cta-row">
            <a href="#wizard" className="hp-cta hp-cta-primary">
              Get a quote <span className="arrow">→</span>
            </a>
            <a href="#diagnose" onClick={openDiagnose} className="hp-cta hp-cta-secondary">
              Help me diagnose <span className="arrow">→</span>
            </a>
          </div>
          <HeroTrust reviewCount={reviewCount} rating={rating} />
        </div>
        <div className="workshop-frame">
          <div className="workshop-caption">
            <span className="live-dot" /> On the bench · today
          </div>
          <WorkshopSceneSVG />
          <div className="workshop-meta">
            <div className="workshop-meta-label">A2442 · Stage Light fix</div>
            <div className="workshop-meta-label">17:42 · Bench 02</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== HERO V2 — Proof-forward ===== */
function HeroProof({ reviewCount, rating }) {
  return (
    <section className="hp-hero hp-hero-v2">
      <div className="container hp-hero-grid">
        <div>
          <div className="hp-hero-eyebrow">
            <span className="dot" />
            Real case · April 2026
          </div>
          <h1>We repair what they can't.</h1>
          <p className="hp-hero-sub">
            When Apple says "logic board, £1,400" we say "backlight IC, £280." Microsoldering is what we do — it's why other repair shops send their tough jobs to us.
          </p>
          <div className="hp-hero-cta-row">
            <a href="#wizard" className="hp-cta hp-cta-primary">
              Get a quote <span className="arrow">→</span>
            </a>
            <a href="#diagnose" onClick={openDiagnose} className="hp-cta hp-cta-secondary">
              Help me diagnose <span className="arrow">→</span>
            </a>
          </div>
          <HeroTrust reviewCount={reviewCount} rating={rating} />
        </div>
        <div className="proof-card">
          <div className="proof-card-image">
            <span className="proof-card-tag success">Fixed · 4 days</span>
            <BoardSVG tone="warm" />
          </div>
          <div className="proof-card-body">
            <p className="proof-card-quote">
              "Apple quoted £1,400 for a full logic-board swap. We microsoldered the failed backlight IC and returned it in four days."
            </p>
            <div className="proof-card-grid">
              <div className="proof-card-stat strike">
                <span className="proof-card-stat-label">Apple quote</span>
                <span className="proof-card-stat-value">£1,400</span>
              </div>
              <div className="proof-card-stat fix">
                <span className="proof-card-stat-label">iCorrect</span>
                <span className="proof-card-stat-value">£280</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== HERO V3 — Wizard inline ===== */
function HeroWizardInline({ reviewCount, rating }) {
  return (
    <section className="hp-hero hp-hero-v3">
      <div className="container hp-hero-grid">
        <div>
          <div className="hp-hero-eyebrow">
            <span className="dot" />
            Apple repair · Fitzrovia, London
          </div>
          <h1>We repair what they can't.</h1>
          <p className="hp-hero-sub">
            Tell us your model and the symptom — see your price in 60 seconds. Or, if you don't know what's wrong yet, walk us through it.
          </p>
          <div className="hp-hero-cta-row">
            <a href="#diagnose" onClick={openDiagnose} className="hp-cta hp-cta-secondary">
              I don't know what's wrong <span className="arrow">→</span>
            </a>
          </div>
          <HeroTrust reviewCount={reviewCount} rating={rating} />
        </div>
        <div id="wizard" className="wizard-frame">
          <div className="wizard-frame-head">
            <span>Instant quote · Step 1</span>
            <span>↳ 60 sec</span>
          </div>
          <Wizard variant="hero" showFilters={true} />
        </div>
      </div>
    </section>
  );
}

/* ===== Proof section ===== */
function ProofSection() {
  return (
    <section className="hp-proof" id="proof">
      <div className="container">
        <div className="hp-proof-head">
          <div>
            <div className="hp-section-eyebrow">Proof · what Apple won't touch</div>
            <h2 className="hp-section-title">The repairs other shops send to us.</h2>
          </div>
          <p className="hp-section-lede">
            Real cases from the bench, last 90 days. Boards, not stock photos. Prices, not promises. Click any case for the full repair log.
          </p>
        </div>

        <div className="proof-grid">
          <article className="proof-case featured">
            <div className="proof-case-img">
              <span className="proof-case-tag">Apple: write-off</span>
              <BoardSVG tone="warm" />
              <div className="proof-case-meta">
                <span className="swatch" style={{background:"#34d399"}} />
                MBP 14" · A2442 · 4 days
              </div>
            </div>
            <div className="proof-case-body">
              <p className="proof-case-quote">
                "Backlight IC failure — exactly the chip Apple's logic-board swap covers up. We replaced it under the scope. Same Mac. Different bill."
              </p>
              <div className="proof-case-numbers">
                <div className="proof-case-num strike">
                  <span className="proof-case-num-label">Apple quote</span>
                  <span className="proof-case-num-value">£1,400</span>
                </div>
                <div className="proof-case-num win">
                  <span className="proof-case-num-label">iCorrect</span>
                  <span className="proof-case-num-value">£280</span>
                </div>
                <div className="proof-case-num">
                  <span className="proof-case-num-label">Saving</span>
                  <span className="proof-case-num-value">80%</span>
                </div>
              </div>
              <div className="proof-case-foot">
                <span>Case #2026-0418</span>
                <a href="#">Read repair log →</a>
              </div>
            </div>
          </article>

          <article className="proof-case">
            <div className="proof-case-img">
              <span className="proof-case-tag">Two weeks in rice</span>
              <LiquidDamageSVG />
              <div className="proof-case-meta">
                <span className="swatch" style={{background:"#f59e0b"}} />
                MBA 13" · liquid · 6 days
              </div>
            </div>
            <div className="proof-case-body">
              <p className="proof-case-quote">
                "Coffee, then a fortnight of denial. We pulled the board, ultrasonic'd it, recovered the data, and reflowed three corroded IC pads."
              </p>
              <div className="proof-case-numbers">
                <div className="proof-case-num win">
                  <span className="proof-case-num-label">Recovered</span>
                  <span className="proof-case-num-value">100%</span>
                </div>
                <div className="proof-case-num">
                  <span className="proof-case-num-label">Repair</span>
                  <span className="proof-case-num-value">£420</span>
                </div>
              </div>
              <div className="proof-case-foot">
                <span>Case #2026-0331</span>
                <a href="#">Read →</a>
              </div>
            </div>
          </article>

          <article className="proof-case">
            <div className="proof-case-img">
              <span className="proof-case-tag">"Unfixable" elsewhere</span>
              <TouchIDSVG />
              <div className="proof-case-meta">
                <span className="swatch" style={{background:"#7dd3fc"}} />
                MBP 13" · Touch ID · 2 days
              </div>
            </div>
            <div className="proof-case-body">
              <p className="proof-case-quote">
                "Touch ID dead after a third-party screen swap. Two shops gave up. We repaired the T2 pairing trace — back to fingerprint unlock."
              </p>
              <div className="proof-case-numbers">
                <div className="proof-case-num win">
                  <span className="proof-case-num-label">Functional</span>
                  <span className="proof-case-num-value">Yes</span>
                </div>
                <div className="proof-case-num">
                  <span className="proof-case-num-label">Repair</span>
                  <span className="proof-case-num-value">£190</span>
                </div>
              </div>
              <div className="proof-case-foot">
                <span>Case #2026-0402</span>
                <a href="#">Read →</a>
              </div>
            </div>
          </article>
        </div>

        <div className="proof-capabilities">
          <div className="proof-capabilities-text">
            <strong>The capability stack.</strong>
            <p>Every case above started with the same toolkit. Most repair shops can't do any of this — that's what "specialist" actually means.</p>
          </div>
          <div className="proof-cap-list">
            <div className="proof-cap-item">
              <span className="proof-cap-num">40×</span>
              <span className="proof-cap-label">Stereo microscope · 0201 components</span>
            </div>
            <div className="proof-cap-item">
              <span className="proof-cap-num">220°C</span>
              <span className="proof-cap-label">Lead-free reflow · IC replacement</span>
            </div>
            <div className="proof-cap-item">
              <span className="proof-cap-num">XRF</span>
              <span className="proof-cap-label">Fault tracing · short-circuit isolation</span>
            </div>
            <div className="proof-cap-item">
              <span className="proof-cap-num">ISO 9001</span>
              <span className="proof-cap-label">Repair log · audit trail</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Wizard section (when wizard isn't already in hero) ===== */
function WizardSection() {
  return (
    <section className="hp-wizard-section" id="wizard-section">
      <div className="container">
        <div className="hp-wizard-head">
          <div>
            <div className="hp-section-eyebrow">Quote · 60 seconds</div>
            <h2 className="hp-section-title">Tell us your model. See your price.</h2>
          </div>
          <p className="hp-section-lede">
            Most screen and battery repairs have a fixed price the moment we know the model. Microsoldering and liquid jobs need a free pre-diagnosis first — the wizard knows the difference.
          </p>
        </div>

        <div className="hp-wizard-shell" id="wizard">
          <Wizard variant="home" showFilters={true} />
        </div>

        <div className="hp-wizard-aside">
          <div className="hp-wizard-aside-item">
            <span className="hp-wizard-aside-num">01 · Quote-ready?</span>
            <span className="hp-wizard-aside-title">Get a price in 60 seconds.</span>
            <span className="hp-wizard-aside-body">Pick model, pick symptom, see the price. Book on the spot or save the quote for later.</span>
          </div>
          <div className="hp-wizard-aside-item">
            <span className="hp-wizard-aside-num">02 · Not sure yet?</span>
            <span className="hp-wizard-aside-title">Walk us through the symptom.</span>
            <span className="hp-wizard-aside-body">Three quick questions. We route you to the right repair, the right article, or a real human.</span>
          </div>
          <div className="hp-wizard-aside-item">
            <span className="hp-wizard-aside-num">03 · Critical case?</span>
            <span className="hp-wizard-aside-title">Talk to a specialist.</span>
            <span className="hp-wizard-aside-body">Business-critical, time-critical, or "Apple said unfixable." Skip the queue — go straight to a technician.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  HomepageNav, HeroTrust, HeroWorkshop, HeroProof, HeroWizardInline,
  ProofSection, WizardSection, openDiagnose,
});
