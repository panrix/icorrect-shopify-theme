// Liquid Damage Process page — sections.
// Voice: senior technician. Honest, specific, no hype. The £49 diagnostic is
// a separate one-off charge — never claim it's credited to the repair.

function LDBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Liquid damage</span>
      </div>
    </div>
  );
}

function LDHero() {
  return (
    <section className="hiw-hero" data-screen-label="Liquid damage hero">
      <div className="container hiw-hero-inner">
        <div className="mono-label">Liquid damage · The process</div>
        <h1>Liquid damage, handled properly.</h1>
        <p>Rice doesn't work, and waiting makes it worse. Here's exactly what we do when a Mac or iPhone meets liquid — what it costs, how long it takes, and when you get your answer.</p>
        <div className="hiw-hero-actions">
          <a href="iCorrect Homepage.html" className="btn btn-dark btn-lg">Book the £49 diagnostic <span style={{fontFamily:"var(--font-mono)"}}>→</span></a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">Call the workshop</a>
        </div>
      </div>
    </section>
  );
}

function LDUrgent() {
  return (
    <section className="ld-urgent" data-screen-label="Right now — do and don't">
      <div className="container">
        <div className="ld-urgent-card">
          <div className="ld-urgent-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c3.5 4.5 6 7.6 6 10.5a6 6 0 0 1-12 0C6 10.6 8.5 7.5 12 3z" />
            </svg>
          </div>
          <div>
            <h2 className="ld-urgent-title">First — before anything else</h2>
            <ul className="ld-urgent-list">
              <li><span className="ld-do">Do</span> Power it off and keep it off. Corrosion needs power to do its worst.</li>
              <li><span className="ld-dont">Don't</span> Charge it, "test if it still works", or leave it in rice — rice does nothing.</li>
              <li><span className="ld-do">Do</span> Get it to a bench quickly. The first 48 hours matter most.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function LDProcess() {
  const steps = [
    {
      title: "Book the £49 diagnostic",
      body: "Walk in, book a courier, or post it. The £49 is a one-off charge for the bench work — your repair is quoted separately, and you approve it before anything is fitted.",
      meta: "Walk-in · courier · post",
    },
    {
      title: "Ultrasonic clean & inspection",
      body: "The board comes out, goes through an ultrasonic bath, and every affected area is inspected under the stereo microscope. This stops the corrosion — and shows us exactly what the liquid touched.",
      meta: "Usually within 1 working day",
    },
    {
      title: "Your exact price",
      body: "We tell you precisely which parts were hit and what the repair costs — a fixed figure, not a range. If it's not worth repairing, we say so.",
      meta: "Fixed quote · your call",
    },
    {
      title: "Repair, test, return",
      body: "Approve the quote and we complete the repair, test everything, and hand it back. Decline it and you get your device back reassembled — nothing more to pay.",
      meta: "Most jobs: 2–4 working days",
    },
  ];
  return (
    <section className="ld-process" data-screen-label="The four steps">
      <div className="container">
        <div className="ld-process-head">
          <div className="mono-label">What happens</div>
          <h2>Four steps. One honest answer.</h2>
          <p>Liquid damage is the one repair nobody can price from a web form — so we don't pretend to. The diagnostic exists to replace guesswork with a number.</p>
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

function LDWhy() {
  return (
    <section className="ld-why" data-screen-label="Why a range, not a price">
      <div className="container ld-why-grid">
        <div>
          <div className="mono-label">Why we quote a range online</div>
          <h2>Because the corrosion decides, not us.</h2>
        </div>
        <div className="ld-why-copy">
          <p>A splash across the keyboard and a full submersion look identical in a web form. On the bench they're hundreds of pounds apart — it depends entirely on <strong>where the liquid travelled</strong> and <strong>how long it sat there</strong>.</p>
          <p>Most liquid jobs need the clean and one or two parts. The worst ones need board-level work. Anyone who gives you a firm price without opening the machine is guessing — and you'll meet the real price later.</p>
          <div className="ld-band">
            <span className="ld-band-label">Typical MacBook range</span>
            <span className="ld-band-num">£149–£449</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function LDPhotos() {
  const shots = [
    { src: "assets/repair-scope.jpg", tag: "Under the microscope", note: "Corrosion mapping" },
    { src: "assets/repair-rework.jpg", tag: "Rework station", note: "Board-level repair" },
    { src: "assets/repair-teardown.jpg", tag: "Teardown", note: "Every affected part, checked" },
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

function LDCTA() {
  return (
    <section className="hiw-cta" data-screen-label="Book CTA">
      <div className="container hiw-cta-inner">
        <h2>The sooner it's on the bench, the better the odds.</h2>
        <p>Book the £49 diagnostic and you'll have an exact price — not a guess — usually within one working day.</p>
        <div className="hiw-cta-actions">
          <a href="iCorrect Homepage.html" className="btn btn-dark btn-lg">Book the £49 diagnostic <span style={{fontFamily:"var(--font-mono)"}}>→</span></a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">Call +44 (0)207 099 8517</a>
        </div>
        <div className="hiw-cta-trust">
          <span><strong>4.9</strong> · 719 Google reviews</span>
          <span>12 Margaret Street, Fitzrovia</span>
          <span>Nothing fitted without your approval</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { LDBreadcrumb, LDHero, LDUrgent, LDProcess, LDWhy, LDPhotos, LDCTA });
