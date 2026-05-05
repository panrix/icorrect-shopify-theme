// Three hero variants. Each one takes the Wizard as a child and provides its own surrounding frame.

function HeroV1({ reviewCount = 719, showFilters = true }) {
  return (
    <section className="hero-v1">
      <div className="container hero-v1-grid">
        <div className="hero-v1-left">
          <div className="mono-label">MacBook · Screen Repair</div>
          <h1 className="h1-v1">Your MacBook screen, restored to original.</h1>
          <p>Genuine Apple displays, calibrated in-house at our Fitzrovia workshop. Most repairs complete in 1–2 days, all backed by a 2-year warranty.</p>
          <div className="hero-v1-trust-inline">
            <div>★ <strong>4.8</strong> · {reviewCount} Google reviews</div>
            <div>·</div>
            <div><strong>2-year</strong> warranty</div>
            <div>·</div>
            <div><strong>Genuine</strong> Apple parts</div>
          </div>
        </div>
        <div className="hero-v1-wizard" id="wizard">
          <Wizard variant="v1" showFilters={showFilters} />
        </div>
      </div>
    </section>
  );
}

function HeroV2({ reviewCount = 719, rating = 4.8, headerStyle = "merged", showFilters = true }) {
  // headerStyle:
  //   "merged"     — eyebrow = "MacBook Screen Repair · Fitzrovia" + action-led headline
  //   "stacked"    — banner stays above; hero shows wizard only (no duplicate H1)
  //   "keyword-h1" — single SEO H1 "MacBook Screen Repair" with instant-quote subtitle
  //   "original"   — pre-change layout: banner H1 above + second H1 in hero (for comparison)
  return (
    <section className={"hero-v2 hero-v2-hs-" + headerStyle}>
      <div className="hero-gradient-bg" />
      <div className="container">
        {headerStyle === "merged" && (
          <div className="hero-v2-headline">
            <div className="hero-v2-eyebrow">
              <span className="dot" /> MacBook Screen Repair · Fitzrovia, London
            </div>
            <h1>Get your instant quote.</h1>
            <p>Tell us your model. See your price. Book in 60 seconds — with a 2-year warranty and genuine Apple parts.</p>
          </div>
        )}
        {headerStyle === "stacked" && (
          <div className="hero-v2-headline hero-v2-headline-slim">
            <div className="hero-v2-eyebrow"><span className="dot" /> In stock today · 1–2 day turnaround</div>
            <p>Tell us your model. See your price. Book in 60 seconds — genuine Apple parts, 2-year warranty.</p>
          </div>
        )}
        {headerStyle === "keyword-h1" && (
          <div className="hero-v2-headline">
            <div className="hero-v2-eyebrow"><span className="dot" /> Fitzrovia workshop · in stock today</div>
            <h1>MacBook Screen Repair</h1>
            <p>Instant quote in 60 seconds. Genuine Apple parts. 2-year warranty. Most repairs complete in 1–2 days at our Fitzrovia workshop.</p>
          </div>
        )}
        {headerStyle === "original" && (
          <div className="hero-v2-headline">
            <div className="hero-v2-eyebrow"><span className="dot" /> Fitzrovia workshop · in stock today</div>
            <h1>Get an instant MacBook screen quote.</h1>
            <p>Tell us your model. See your price. Book in 60 seconds — with a 2-year warranty and genuine Apple parts.</p>
          </div>
        )}
        <div className="hero-v2-wizard" id="wizard">
          <Wizard variant="v2" showFilters={showFilters} />
        </div>
      </div>
    </section>
  );
}

function HeroV3({ reviewCount = 719, showFilters = true }) {
  return (
    <section className="hero-v3">
      <div className="container hero-v3-inner">
        <div className="hero-v3-grid">
          <div className="hero-v3-left">
            <div className="mono-label">MacBook · Screen Repair · Fitzrovia, London</div>
            <h1>The workshop other repair shops send their MacBooks to.</h1>
            <p>Board-level specialists. Genuine Apple displays. A 2-year warranty that's double the industry standard — because we know what's in the repair.</p>
            <div className="hero-v3-trust-stack">
              <div className="hero-v3-trust-row">
                <div className="tick">★</div>
                <div><strong>4.8 from {reviewCount} Google reviews.</strong> Verified by Google Business, not curated.</div>
              </div>
              <div className="hero-v3-trust-row">
                <div className="tick">✓</div>
                <div><strong>Genuine Apple parts, calibrated in-house.</strong> True Tone, full brightness, colour-accurate — same as Apple Store.</div>
              </div>
              <div className="hero-v3-trust-row">
                <div className="tick">◉</div>
                <div><strong>Microsoldering specialists.</strong> Backlight IC, liquid damage, Stage Light effect — repairs other shops can't do.</div>
              </div>
              <div className="hero-v3-trust-row">
                <div className="tick">⧗</div>
                <div><strong>1–2 working day turnaround.</strong> Walk in before 11am and same-day is usually possible.</div>
              </div>
            </div>
          </div>
          <div className="hero-v3-wizard" id="wizard">
            <Wizard variant="v3" showFilters={showFilters} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionHeader({ variant, headerStyle = "merged" }) {
  if (variant === "v3") return null;

  // "merged" / "keyword-h1": show breadcrumb only — H1 lives in the hero
  // "stacked" / "original": full banner with the "MacBook Screen Repair" H1
  if (headerStyle !== "stacked" && headerStyle !== "original") {
    return (
      <header className="collection-header collection-header-slim">
        <div className="container">
          <nav className="coll-breadcrumb" aria-label="Breadcrumb">
            <a href="#">Services</a>
            <span className="coll-breadcrumb-sep">›</span>
            <a href="#">MacBook</a>
            <span className="coll-breadcrumb-sep">›</span>
            <span aria-current="page">Screen Repair</span>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="collection-header">
      <div className="container">
        <div className="mono-label" style={{marginTop:32}}>Collection · MacBook · Screen</div>
        <div className="coll-head-title">
          <h1 className="display">MacBook Screen Repair</h1>
          <div className="coll-head-lede">
            Cracked, dead, flickering, or stuck on Stage Light? We replace the display only — never the full lid — using genuine Apple parts, at prices that make sense.
          </div>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { HeroV1, HeroV2, HeroV3, CollectionHeader });
