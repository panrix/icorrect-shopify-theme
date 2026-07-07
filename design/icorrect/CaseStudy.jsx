// === Repair Case Study page components ===
// One worked example: "Apple quoted £1,400. We fixed it for £380."
// Template is generic — swap the data object for any repair.

const CASE = {
  id: "2026-0418",
  tag: "Case study",
  device: "MacBook Pro 14\" (M1 Pro)",
  model: "A2442",
  fault: "Backlight IC failure",
  outcome: "Repaired",
  title: "Apple quoted £1,400 for a logic board. We replaced one chip for £380.",
  lede: "A 2021 MacBook Pro came in with a black screen — fans running, keyboard lit, external monitor fine. Apple's Genius Bar diagnosed it as a logic-board failure and quoted £1,400 for a full replacement. We found a single failed backlight IC and microsoldered a new one in four days.",
  appleQuote: "£1,400",
  icorrectPrice: "£380",
  saving: "73%",
  turnaround: "4 days",
  warranty: "2 years",
  date: "April 2026",
  technician: "R. Sheridan",
  tags: ["Microsoldering", "Backlight IC", "MacBook Pro", "Board-level"],
  steps: [
    {
      num: "01",
      title: "Intake and initial triage",
      body: "Customer walked in with a MacBook Pro 14\" (A2442, M1 Pro, 2021). Complaint: black screen, no image at all. External monitor worked fine via USB-C. Apple had quoted a full logic-board replacement at £1,400 — customer wanted a second opinion.",
      meta: [["Time", "15 min"], ["Status", "Intake"]],
      imageTag: "S1 · Intake",
      imagePlaceholder: "Photo: MacBook on intake bench",
    },
    {
      num: "02",
      title: "Board-level diagnosis under the scope",
      body: "Removed the bottom case and connected the board to our DC power supply. Current draw was normal at 0.3A — the board was alive, just not driving the backlight. Probed the backlight power rail with a multimeter: 0V at the connector. Traced upstream to U7600, the backlight boost IC. Cold solder joint visible under 40× magnification.",
      meta: [["Time", "45 min"], ["Tool", "Stereo microscope · 40×"]],
      imageTag: "S2 · Diagnosis",
      imagePlaceholder: "Photo: Board under microscope, IC circled",
    },
    {
      num: "03",
      title: "Backlight IC removal and replacement",
      body: "Applied flux paste around U7600 and reflowed with hot air at 380°C for 12 seconds. Removed the failed IC with vacuum tweezers. Cleaned the pads with solder wick and IPA. Placed a new LP8548 backlight driver IC from stock, reflowed, and inspected the joints under the scope.",
      meta: [["Time", "1.5 hrs"], ["Temp", "380°C reflow"], ["Part", "LP8548"]],
      imageTag: "S3 · Microsoldering",
      imagePlaceholder: "Photo: IC removal under hot air",
    },
    {
      num: "04",
      title: "Backlight rail verification",
      body: "Powered the board on the bench (no screen attached). Measured the backlight rail at the display connector: 48.2V — within spec. Connected a test display: full brightness, all dimming zones active, no flicker. The repair was holding.",
      meta: [["Voltage", "48.2V (spec: 48V)"], ["Result", "Pass"]],
      imageTag: "S4 · Verification",
      imagePlaceholder: "Photo: Multimeter reading on backlight rail",
    },
    {
      num: "05",
      title: "Full reassembly and QA pass",
      body: "Reconnected the original display, battery, and all flex cables. Ran our 30-point QA checklist: True Tone calibration, brightness uniformity across all zones, keyboard, speakers, camera, Wi-Fi throughput, trackpad. Every test passed.",
      meta: [["Tests", "30-point QA"], ["True Tone", "Preserved"]],
      imageTag: "S5 · QA",
      imagePlaceholder: "Photo: QA checklist on screen",
    },
    {
      num: "06",
      title: "Returned to customer",
      body: "MacBook returned fully assembled with a printed QA report and a 2-year warranty card covering the backlight IC, labour, and any rework. Total time on bench: 4 working days including parts sourcing. Customer saved £1,020 versus the Apple quote.",
      meta: [["Turnaround", "4 days"], ["Warranty", "2 years"]],
      imageTag: "S6 · Complete",
      imagePlaceholder: "Photo: MacBook powered on, ready for collection",
    },
  ],
  eliminated: [
    "External monitor works → GPU and display controller alive",
    "Current draw normal → no short-circuit, board is powered",
    "Backlight rail at 0V → fault is upstream of the display",
    "U7600 cold joint visible → root cause identified at IC level",
    "New IC + 48.2V on rail → repair confirmed before reassembly",
  ],
  related: [
    { tag: "Liquid damage", title: "Coffee spill recovery — MBA 13\" M1", meta: "6 days · £420 · 100% data recovered", href: "#" },
    { tag: "Touch ID", title: "T2 pairing fault after third-party screen swap", meta: "2 days · £190 · Fingerprint unlock restored", href: "#" },
    { tag: "Stage Light", title: "Flexgate repair on MBP 15\" 2017", meta: "3 days · £280 · Flex cable replaced", href: "#" },
  ],
};

function CaseStudyHero() {
  return (
    <section className="cs-hero">
      <div className="container cs-hero-grid">
        <div>
          <div className="cs-hero-eyebrow">{CASE.tag} · {CASE.id}</div>
          <h1>{CASE.title}</h1>
          <p className="cs-hero-lede">{CASE.lede}</p>

          <div className="cs-outcome-strip">
            <div className="cs-outcome-item">
              <span className="cs-outcome-label">Apple quote</span>
              <span className="cs-outcome-value strike">{CASE.appleQuote}</span>
            </div>
            <div className="cs-outcome-item">
              <span className="cs-outcome-label">iCorrect</span>
              <span className="cs-outcome-value green">{CASE.icorrectPrice}</span>
            </div>
            <div className="cs-outcome-item">
              <span className="cs-outcome-label">Saving</span>
              <span className="cs-outcome-value">{CASE.saving}</span>
            </div>
          </div>

          <div className="cs-meta-row">
            {CASE.tags.map(t => <span key={t} className="cs-meta-tag">{t}</span>)}
          </div>
        </div>

        <div className="cs-hero-image">
          <img className="cs-photo" src="uploads/repair-rework.jpg" alt="Microsoldering the backlight IC on a MacBook Pro logic board" />
          <span className="cs-hero-image-tag resolved">Resolved · {CASE.turnaround}</span>
        </div>
      </div>
    </section>
  );
}

function CaseStudySteps() {
  const STEP_PHOTOS = {
    "01": "uploads/repair-teardown.jpg",
    "02": "uploads/repair-scope.jpg",
    "03": "uploads/repair-rework.jpg",
    "04": "uploads/repair-boardview.jpg",
    "05": "uploads/repair-scope.jpg",
    "06": "uploads/repair-teardown.jpg",
  };
  return (
    <section className="cs-steps">
      <div className="container">
        <div className="cs-steps-head">
          <div className="cs-hero-eyebrow">Repair log · {CASE.steps.length} steps</div>
          <h2>What we actually did.</h2>
        </div>

        {CASE.steps.map((s, i) => (
          <div key={i} className="cs-step">
            <div className="cs-step-num">{s.num}</div>
            <div className="cs-step-text">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="cs-step-meta">
                {s.meta.map(([k, v]) => (
                  <div key={k} className="cs-step-meta-item">
                    <span className="cs-step-meta-key">{k}</span>
                    <span className="cs-step-meta-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cs-step-image">
              <img className="cs-photo" src={STEP_PHOTOS[s.num]} alt={s.title} />
              <div className="cs-step-image-tag">{s.imageTag}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaseStudyDiagnosis() {
  return (
    <section className="cs-diagnosis">
      <div className="container">
        <div className="cs-diagnosis-grid">
          <div className="cs-diagnosis-card">
            <h3>Diagnosis summary</h3>
            <p>
              A single failed backlight boost IC (LP8548 / U7600) was preventing the internal display from
              receiving power. The GPU, display panel, flex cables, and all other components were functional.
              Apple's standard procedure replaces the entire logic board for this fault because they don't
              perform component-level repair. We replaced the one chip.
            </p>
            <table className="cs-diagnosis-table">
              <tbody>
                <tr><td>Root cause</td><td>Cold solder joint on U7600 (backlight boost IC)</td></tr>
                <tr><td>Repair</td><td>IC removal + replacement (LP8548) via hot-air reflow</td></tr>
                <tr><td>Parts cost</td><td>~£12 (IC) + consumables</td></tr>
                <tr><td>Apple approach</td><td>Full logic-board replacement (£1,400)</td></tr>
                <tr><td>Our approach</td><td>Component-level microsoldering (£380)</td></tr>
                <tr><td>Warranty</td><td>2 years — part, labour, rework</td></tr>
                <tr><td>Technician</td><td>{CASE.technician}</td></tr>
                <tr><td>Date</td><td>{CASE.date}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="cs-eliminated">
            <h3>What we eliminated to get here</h3>
            <ul className="cs-eliminated-list">
              {CASE.eliminated.map((e, i) => (
                <li key={i} className="cs-eliminated-item">
                  <span className="cs-eliminated-check">✓</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudyCTA() {
  return (
    <section className="cs-cta">
      <div className="container cs-cta-inner">
        <h2>Same problem? Let's fix it.</h2>
        <p>
          If your MacBook has a black screen but fans still run, it's likely the same fault.
          Get a quote in 60 seconds or book a free pre-diagnosis.
        </p>
        <div className="cs-cta-row">
          <a href="iCorrect Homepage.html#wizard" className="cs-cta-btn cs-cta-primary">
            Get a quote →
          </a>
        </div>
      </div>
    </section>
  );
}

function CaseStudyRelated() {
  return (
    <section className="cs-related">
      <div className="container">
        <h2>More from the bench.</h2>
        <div className="cs-related-grid">
          {CASE.related.map((r, i) => (
            <a key={i} href={r.href} className="cs-related-card">
              <span className="cs-related-tag">{r.tag}</span>
              <span className="cs-related-title">{r.title}</span>
              <span className="cs-related-meta">{r.meta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Nav + Footer reused from homepage
function CaseStudyNav() {
  return (
    <nav className="hp-nav">
      <div className="container hp-nav-inner">
        <a className="hp-logo" href="iCorrect Homepage.html">
          <span className="hp-logo-mark">iC</span>
          iCorrect
        </a>
        <div className="hp-nav-links">
          <a href="iCorrect Homepage.html">Home</a>
          <a href="#">Repairs</a>
          <a href="#">Case studies</a>
          <a href="#">How it works</a>
        </div>
        <a href="iCorrect Homepage.html#wizard" className="hp-nav-cta">Get a quote →</a>
      </div>
    </nav>
  );
}

function CaseStudyBreadcrumb() {
  return (
    <div className="container" style={{padding:"20px 32px 0"}}>
      <div style={{
        display:"flex", alignItems:"center", gap:"8px",
        font:"500 13px var(--font-sans)", color:"#666"
      }}>
        <a href="iCorrect Homepage.html" style={{color:"#666",textDecoration:"none"}}>Home</a>
        <span style={{color:"#c4c4c4",fontFamily:"var(--font-mono)"}}>›</span>
        <span style={{color:"#666"}}>Case studies</span>
        <span style={{color:"#c4c4c4",fontFamily:"var(--font-mono)"}}>›</span>
        <span style={{color:"#171717"}}>{CASE.device} — {CASE.fault}</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  CaseStudyNav, CaseStudyBreadcrumb, CaseStudyHero, CaseStudySteps,
  CaseStudyDiagnosis, CaseStudyCTA, CaseStudyRelated,
});
