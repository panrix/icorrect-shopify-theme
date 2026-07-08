// ═══════════════════════════════════════════════════════════════════════════
//  Homepage hero variants — A / B / C, switchable via the Tweaks panel so the
//  three directions can be compared side by side.
//
//   A — Rebalance & refocus: category-setting sub (no repeated numbers), an
//       inline trust line under the CTA to fill the void + proof at the
//       decision point, "real case" label moved onto the card.
//   B — Card hits harder: lean left column, the proof card becomes the
//       dominant visual with a big £1,400 → £380 contrast.
//   C — Action-first: lead with the quote wizard ("price in 60 seconds")
//       instead of the proof card.
// ═══════════════════════════════════════════════════════════════════════════

function HVStars({ value = 4.9 }) {
  return (
    <span className="hv-stars" aria-label={value + " out of 5"}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} viewBox="0 0 20 20" className="hv-star" aria-hidden="true">
          <path d="M10 1.5l2.47 5.27 5.78.62-4.32 3.9 1.2 5.71L10 14.9l-5.13 2.6 1.2-5.71-4.32-3.9 5.78-.62z" />
        </svg>
      ))}
    </span>
  );
}

function HVTrustLine({ reviewCount = 719, rating = 4.9 }) {
  return (
    <div className="hv-trustline">
      <HVStars value={rating} />
      <strong>{rating}</strong>
      <span className="hv-trust-sep" aria-hidden="true">·</span>
      <span>{reviewCount.toLocaleString()} Google reviews</span>
      <span className="hv-trust-sep" aria-hidden="true">·</span>
      <span>2-year warranty</span>
    </div>
  );
}

/* ── The proof card (shared by A) ─────────────────────────────────────────── */
function HVProofCard({ big = false }) {
  return (
    <div className={"proof-card hv-proof-card" + (big ? " hv-proof-card-big" : "")}>
      <div className="proof-card-image">
        <img className="proof-photo" src="uploads/backlight-repair.jpg" alt="The actual MacBook backlight circuit we repaired — backlight driver IC and coils" />
        <span className="proof-card-tag success">Real case · Fixed in 4 days</span>
      </div>
      <div className="proof-card-body">
        <p className="proof-card-quote">
          "Apple quoted £1,400 for a full logic-board swap. We microsoldered the failed backlight IC and returned it in four days."
        </p>
        {big ? (
          <div className="hv-bigprice">
            <div className="hv-bigprice-col strike">
              <span className="hv-bigprice-label">Apple quoted</span>
              <span className="hv-bigprice-num">£1,400</span>
            </div>
            <span className="hv-bigprice-arrow" aria-hidden="true">→</span>
            <div className="hv-bigprice-col fix">
              <span className="hv-bigprice-label">We charged</span>
              <span className="hv-bigprice-num">£380</span>
            </div>
          </div>
        ) : (
          <div className="proof-card-grid">
            <div className="proof-card-stat strike">
              <span className="proof-card-stat-label">Apple quote</span>
              <span className="proof-card-stat-value">£1,400</span>
            </div>
            <div className="proof-card-stat fix">
              <span className="proof-card-stat-label">iCorrect</span>
              <span className="proof-card-stat-value">£380</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ VARIANT A — Rebalance & refocus ═══ */
function HeroA({ reviewCount = 719, rating = 4.9 }) {
  return (
    <section className="hp-hero hp-hero-v2 hv-hero-a">
      <div className="container hp-hero-grid">
        <div className="hv-left">
          <div className="hp-hero-eyebrow">
            <span className="dot" />
            Fitzrovia, London · Board-level Apple repair
          </div>
          <h1>We repair what they can't.</h1>
          <p className="hp-hero-sub">
            The cracked screens, water damage and "dead" logic boards that other shops — and Apple itself — write off. Genuine parts, calibrated in-house, backed by a two-year warranty.
          </p>
          <div className="hp-hero-cta-row">
            <a href="#wizard" className="hp-cta hp-cta-primary">Get a quote <span className="arrow">→</span></a>
            <a href="How It Works.html" className="hp-cta hp-cta-secondary">How it works <span className="arrow">→</span></a>
          </div>
          <HVTrustLine reviewCount={reviewCount} rating={rating} />
        </div>
        <HVProofCard />
      </div>
    </section>
  );
}

/* ═══ VARIANT B — Card hits harder ═══ */
function HeroB({ reviewCount = 719, rating = 4.9 }) {
  return (
    <section className="hp-hero hp-hero-v2 hv-hero-b">
      <div className="container hp-hero-grid">
        <div className="hv-left">
          <div className="hp-hero-eyebrow">
            <span className="dot" />
            Board-level Apple repair · Fitzrovia
          </div>
          <h1>We repair what they can't.</h1>
          <p className="hp-hero-sub hv-sub-short">
            Microsoldering is what we do — it's why other repair shops send us their toughest jobs.
          </p>
          <div className="hp-hero-cta-row">
            <a href="#wizard" className="hp-cta hp-cta-primary">Get a quote <span className="arrow">→</span></a>
          </div>
          <HVTrustLine reviewCount={reviewCount} rating={rating} />
        </div>
        <HVProofCard big={true} />
      </div>
    </section>
  );
}

/* ═══ VARIANT C — Action-first (wizard in hero) ═══ */
function HeroC({ reviewCount = 719, rating = 4.9, priceEarly = false, compactProgress = false }) {
  return (
    <section className="hp-hero hp-hero-v3 hv-hero-c">
      <div className="container hp-hero-grid hv-hero-c-grid">
        <div className="hv-left">
          <div className="hp-hero-eyebrow">
            <span className="dot" />
            Quote · 60 seconds
          </div>
          <h1>We repair what they can't.</h1>
          <p className="hp-hero-sub">
            Tell us your model and the symptom — see your price in 60 seconds. <span className="hv-sub-more">Genuine parts, two-year warranty, no obligation.</span>
          </p>
          <HVTrustLine reviewCount={reviewCount} rating={rating} />
          <div className="hv-c-apple">
            When Apple says "logic board, <span className="strike">£1,400</span>" we say "backlight IC, <strong>£380</strong>."
          </div>
        </div>
        <div className="hv-c-trustcard">
          <TrustCard reviewCount={reviewCount} rating={rating} />
        </div>
        <div className="hv-c-wizard" id="wizard">
          <div className="hv-c-wizard-head">
            <span className="hv-c-wizard-kicker">Instant quote</span>
            <span className="hv-c-wizard-meta">↳ 60 sec · no obligation</span>
          </div>
          <QuoteWizard hideProgressOnQuote={true} priceEarly={priceEarly} compactProgress={compactProgress} />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroA, HeroB, HeroC, HVTrustLine, HVProofCard });
