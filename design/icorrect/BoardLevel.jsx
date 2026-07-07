// Board-Level Diagnosis process page — sections. Reuses ld-* styles.
// Voice: senior technician. The £49 diagnostic is a separate one-off charge.

function BLBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Board-level diagnosis</span>
      </div>
    </div>
  );
}

function BLHero() {
  return (
    <section className="hiw-hero" data-screen-label="Board-level hero">
      <div className="container hiw-hero-inner">
        <div className="mono-label">Board-level · The process</div>
        <h1>When the fault is on the board.</h1>
        <p>Apple replaces logic boards whole — we repair them component by component, under a stereo microscope. Here's how a board-level job actually runs, and why the quote comes after the bench, not before.</p>
        <div className="hiw-hero-actions">
          <a href="iCorrect Homepage.html" className="btn btn-dark btn-lg">Book the £49 diagnostic <span style={{fontFamily:"var(--font-mono)"}}>→</span></a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">Call the workshop</a>
        </div>
      </div>
    </section>
  );
}

function BLSigns() {
  return (
    <section className="ld-urgent" data-screen-label="Signs it's board-level">
      <div className="container">
        <div className="ld-urgent-card">
          <div className="ld-urgent-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="12" height="12" rx="2" />
              <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
            </svg>
          </div>
          <div>
            <h2 className="ld-urgent-title">Signs the board is the problem</h2>
            <ul className="ld-urgent-list">
              <li><span className="ld-do">Sign</span> Won't power on at all — no chime, no fan, no backlight.</li>
              <li><span className="ld-do">Sign</span> Wi-Fi or Bluetooth greyed out — the radio has dropped off the board.</li>
              <li><span className="ld-do">Sign</span> Black screen but signs of life, chargers not recognised, or the MacBook "Stage Light" backlight fault.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BLProcess() {
  const steps = [
    {
      title: "Book the £49 diagnostic",
      body: "Walk in, book a courier, or post it. The £49 is a one-off charge for the bench work — your repair is quoted separately, and you approve it before anything is done.",
      meta: "Walk-in · courier · post",
    },
    {
      title: "Diagnosis under the microscope",
      body: "The board comes out and goes under the scope with the schematics and boardview open. We measure the power rails and trace the fault to the component that caused it — not just the area.",
      meta: "Usually within 1 working day",
    },
    {
      title: "Your exact price",
      body: "We name the component and the fixed price to repair it — \"backlight IC, £380\", not \"logic board, £1,400\". If it isn't worth repairing, we say so and tell you your options.",
      meta: "Fixed quote · your call",
    },
    {
      title: "Repair, test, return",
      body: "Approve the quote and the component is replaced, the board reflowed, and the machine tested properly before it goes back. Decline and you get it back reassembled — nothing more to pay.",
      meta: "Most jobs: 2–5 working days",
    },
  ];
  return (
    <section className="ld-process" data-screen-label="The four steps">
      <div className="container">
        <div className="ld-process-head">
          <div className="mono-label">What happens</div>
          <h2>Four steps. One component, not one board.</h2>
          <p>Board faults can't be priced from a symptom — two identical-looking failures can be a £2 component or a damaged trace. The diagnostic replaces guesswork with a named fault and a fixed figure.</p>
        </div>
        <div className="ld-steps">
          {steps.map((s, i) => (
            <div key={i} className="ld-step hp-reveal">
              <span className="ld-step-n">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="ld-step-meta">{s.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BLWhy() {
  return (
    <section className="ld-why" data-screen-label="Why Apple says replace">
      <div className="container ld-why-grid">
        <div>
          <div className="mono-label">Why Apple quotes so much more</div>
          <h2>They price the whole board. We price the component.</h2>
        </div>
        <div className="ld-why-copy">
          <p>Apple's repair path for a board fault is to <strong>replace the entire logic board</strong> — often £1,000+ on a MacBook Pro, and your data goes with it. It's not wrong, it's just wholesale.</p>
          <p>Microsoldering means we replace the <strong>single failed component</strong> on your existing board. Your data stays where it is, and the price reflects one part and the bench time — not a whole board.</p>
          <div className="ld-band">
            <span className="ld-band-label">Typical board repair</span>
            <span className="ld-band-num">£129–£389</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BLPhotos() {
  const shots = [
    { src: "assets/repair-boardview.jpg", tag: "Schematics & boardview", note: "Fault traced, not guessed" },
    { src: "assets/backlight-repair.jpg", tag: "Backlight IC · fixed £380", note: "Apple: write-off" },
    { src: "assets/workshop-bench.jpg", tag: "The bench", note: "12 Margaret Street" },
  ];
  return (
    <section className="ld-photos" data-screen-label="Bench photos">
      <div className="container">
        <div className="ld-photos-grid">
          {shots.map((s, i) => (
            <figure key={i} className="ld-shot">
              <img src={s.src} alt={s.tag} loading="lazy" />
              <figcaption>
                <span className="ld-shot-tag">{s.tag}</span>
                <span className="ld-shot-note">{s.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BLCTA() {
  return (
    <section className="hiw-cta" data-screen-label="Book CTA">
      <div className="container hiw-cta-inner">
        <h2>Get the fault named before anyone replaces anything.</h2>
        <p>Book the £49 diagnostic and you'll have the component, the fixed price, and your options — usually within one working day.</p>
        <div className="hiw-cta-actions">
          <a href="iCorrect Homepage.html" className="btn btn-dark btn-lg">Book the £49 diagnostic <span style={{fontFamily:"var(--font-mono)"}}>→</span></a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">Call +44 (0)207 099 8517</a>
        </div>
        <div className="hiw-cta-trust">
          <span><strong>4.9</strong> · 719 Google reviews</span>
          <span>The workshop other repair shops send their boards to</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { BLBreadcrumb, BLHero, BLSigns, BLProcess, BLWhy, BLPhotos, BLCTA });
