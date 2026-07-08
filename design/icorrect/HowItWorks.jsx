// How It Works page — all section components
// Voice: clear, simple, reassuring. Remove friction. Make the process feel effortless.

function HIWHero() {
  return (
    <section className="hiw-hero">
      <div className="container hiw-hero-inner">
        <div className="mono-label">How it works</div>
        <h1>Get a quote. Book in. We handle the rest.</h1>
        <p>Whether you walk in, send a courier, or post your device — the process is the same. Simple, transparent, and backed by a 2-year warranty.</p>
        <div className="hiw-hero-actions">
          <a href="iCorrect Homepage.html#wizard" className="btn btn-dark btn-lg">Get an instant quote →</a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">Call us</a>
        </div>
      </div>
    </section>
  );
}

function ThreeStepsSection() {
  return (
    <section className="hiw-steps">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Three steps</div>
          <h2>From broken to fixed — here's the full picture.</h2>
          <p>Every repair follows the same path. No surprises, no hidden stages, no waiting in the dark for a callback.</p>
        </div>
        <div className="hiw-steps-grid hiw-steps-grid-with-arrows">
          <div className="hiw-step-card">
            <div className="hiw-step-num">1</div>
            <h3>Get your quote</h3>
            <p>Tell us your device and what's wrong. You'll see a fixed price instantly — or if it needs diagnosis, we'll inspect it for free and quote before any work begins.</p>
            <ul className="hiw-step-detail">
              <li><span className="tick">✓</span><span>Instant online pricing for standard repairs</span></li>
              <li><span className="tick">✓</span><span>Free in-person or mail-in diagnosis for complex issues</span></li>
              <li><span className="tick">✓</span><span>Written quote — no obligation, no pressure</span></li>
            </ul>
          </div>
          <div className="hiw-step-arrow" aria-hidden="true">→</div>
          <div className="hiw-step-card">
            <div className="hiw-step-num">2</div>
            <h3>Book your device in</h3>
            <p>Choose how you'd like to get your device to us — walk in, same-day London courier, or post it from anywhere in the UK. Pick a date and time that works for you.</p>
            <ul className="hiw-step-detail">
              <li><span className="tick">✓</span><span>Walk-in appointments or drop-in — your choice</span></li>
              <li><span className="tick">✓</span><span>Same-day courier collection within London</span></li>
              <li><span className="tick">✓</span><span>Pre-paid Royal Mail label for UK-wide posting</span></li>
            </ul>
          </div>
          <div className="hiw-step-arrow" aria-hidden="true">→</div>
          <div className="hiw-step-card">
            <div className="hiw-step-num">3</div>
            <h3>We take care of everything</h3>
            <p>Your device goes straight to the bench. We repair it with genuine parts, calibrate it, run a 30-point QA check, and return it — with a 2-year warranty and a full report.</p>
            <ul className="hiw-step-detail">
              <li><span className="tick">✓</span><span>Timestamped bench photos at each stage</span></li>
              <li><span className="tick">✓</span><span>SMS updates so you always know where it's at</span></li>
              <li><span className="tick">✓</span><span>Collect in person or tracked return delivery</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="hiw-services">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Our services</div>
          <h2>Three ways we can help.</h2>
          <p>Most repairs fall into one of these categories. Not sure which you need? That's fine — start with a free diagnosis and we'll tell you exactly what's going on.</p>
        </div>
        <div className="hiw-services-grid">

          <div className="hiw-service-card">
            <div className="hiw-service-banner hiw-service-banner-blue"></div>
            <div className="hiw-service-body">
              <h3>Standard repairs</h3>
              <p>The fix is known, the price is fixed, and we have the parts in stock. Cracked screens, dead batteries, broken keyboards, faulty speakers — these are our bread and butter.</p>
              <ul className="hiw-service-includes">
                <li><span className="dot dot-blue"></span><span><strong>Fixed pricing</strong> — you see the cost before you commit</span></li>
                <li><span className="dot dot-blue"></span><span><strong>Genuine Apple parts</strong> calibrated in-house</span></li>
                <li><span className="dot dot-blue"></span><span><strong>1–2 day turnaround</strong> for most repairs</span></li>
                <li><span className="dot dot-blue"></span><span><strong>2-year warranty</strong> on parts and labour</span></li>
              </ul>
              <div className="hiw-service-price">From <strong>£79</strong> · fixed price per repair</div>
            </div>
          </div>

          <div className="hiw-service-card">
            <div className="hiw-service-banner hiw-service-banner-green"></div>
            <div className="hiw-service-body">
              <h3>Diagnostics</h3>
              <p>Something's wrong but you're not sure what. We'll inspect your device on the bench, identify the fault at the component level, and give you a written quote — before any work starts.</p>
              <ul className="hiw-service-includes">
                <li><span className="dot dot-green"></span><span><strong>Bench inspection</strong> — thorough component-level diagnosis</span></li>
                <li><span className="dot dot-green"></span><span><strong>Component-level fault finding</strong> using microscopy and schematics</span></li>
                <li><span className="dot dot-green"></span><span><strong>Written quote</strong> with a clear explanation of the issue</span></li>
                <li><span className="dot dot-green"></span><span><strong>£0 if we can't fix it</strong> — you only pay for a successful repair</span></li>
              </ul>
              <div className="hiw-service-price"><strong>£49</strong> · no obligation to proceed</div>
            </div>
          </div>

          <div className="hiw-service-card">
            <div className="hiw-service-banner hiw-service-banner-amber"></div>
            <div className="hiw-service-body">
              <h3>Liquid damage</h3>
              <p>Spills, splashes, full submersion — liquid damage needs specialist attention fast. We ultrasonically clean the board, trace the corrosion, and replace only the components that failed.</p>
              <ul className="hiw-service-includes">
                <li><span className="dot dot-amber"></span><span><strong>Ultrasonic board cleaning</strong> to remove corrosion</span></li>
                <li><span className="dot dot-amber"></span><span><strong>Microscopy inspection</strong> to map the damage path</span></li>
                <li><span className="dot dot-amber"></span><span><strong>Targeted component replacement</strong> — not a full board swap</span></li>
                <li><span className="dot dot-amber"></span><span><strong>Data recovery</strong> available if the board can't be saved</span></li>
              </ul>
              <div className="hiw-service-price">From <strong>£149</strong> · quoted after inspection</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function DeliveryMethodsSection() {
  return (
    <section className="hiw-delivery">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Getting your device to us</div>
          <h2>Walk in. Send a courier. Or post it.</h2>
          <p>Three ways to get your device onto our bench — pick the one that suits you. The repair process is the same regardless.</p>
        </div>
        <div className="hiw-delivery-grid">

          <div className="hiw-delivery-card">
            <div className="hiw-delivery-card-head">
              <div className="hiw-delivery-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 19v-7a8 8 0 0116 0v7" /><path d="M3 19h16" /><rect x="8" y="12" width="6" height="7" rx="1" /></svg>
              </div>
            </div>
            <h3>Walk in</h3>
            <p>Drop into our Fitzrovia workshop — no appointment needed for a free diagnosis. Book ahead through our wizard to reserve a bench slot and skip the queue.</p>
            <dl className="hiw-delivery-details">
              <dt>Where</dt>
              <dd>12 Margaret St, London W1W 8JQ</dd>
              <dt>Hours</dt>
              <dd>Mon–Thu 9am–6pm, Fri 10am–6pm</dd>
              <dt>Cost</dt>
              <dd>Free</dd>
              <dt>Best for</dt>
              <dd>London-based, same-day turnaround</dd>
            </dl>
          </div>

          <div className="hiw-delivery-card">
            <div className="hiw-delivery-card-head">
              <div className="hiw-delivery-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="12" height="10" rx="1" /><path d="M14 9h4l2 3v4h-6V9z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
              </div>
              <span className="hiw-delivery-badge hiw-delivery-badge-popular">Popular</span>
            </div>
            <h3>London courier</h3>
            <p>We send a same-day courier to your door — tracked, insured, and door-to-door. Pick a date and a 3-hour collection window that works for you.</p>
            <dl className="hiw-delivery-details">
              <dt>Coverage</dt>
              <dd>Central London (zones 1–3)</dd>
              <dt>Collection</dt>
              <dd>Same day, 3-hour window</dd>
              <dt>Cost</dt>
              <dd>£20 — tracked and insured</dd>
              <dt>Best for</dt>
              <dd>London professionals, corporate fleets</dd>
            </dl>
          </div>

          <div className="hiw-delivery-card">
            <div className="hiw-delivery-card-head">
              <div className="hiw-delivery-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="16" height="12" rx="1.5" /><path d="M3 6l8 6 8-6" /></svg>
              </div>
              <span className="hiw-delivery-badge hiw-delivery-badge-soon">Intl. soon</span>
            </div>
            <h3>Mail it in</h3>
            <p>Post your device from anywhere in the UK using our pre-paid Royal Mail Special Delivery label. International shipping is coming soon — register your interest.</p>
            <dl className="hiw-delivery-details">
              <dt>Coverage</dt>
              <dd>UK-wide (international soon)</dd>
              <dt>Delivery</dt>
              <dd>Next-day Royal Mail Special Delivery</dd>
              <dt>Cost</dt>
              <dd>£24 — pre-paid label included</dd>
              <dt>Best for</dt>
              <dd>Outside London, remote workers</dd>
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
}

function OnTheBenchSection() {
  const steps = [
    {
      num: "1",
      title: "Intake & inspection",
      body: "We log your device, photograph its condition, and run a preliminary diagnostic on the bench. If you're walking in, we do this with you — takes about 30 minutes.",
      time: "30 min",
    },
    {
      num: "2",
      title: "Fault confirmation & quote",
      body: "We identify the specific fault — at the component level where needed — and confirm or refine your quote. For standard repairs, the price won't change. For diagnostic cases, this is where you get your written quote.",
      time: "Included",
    },
    {
      num: "3",
      title: "Repair",
      body: "Work happens on our own bench in Fitzrovia — never outsourced. Screen assemblies are replaced with the hinge and antenna carefully transferred. Board-level repairs are done under a stereo microscope with lead-free solder.",
      time: "1–2 days",
    },
    {
      num: "4",
      title: "Calibration",
      body: "Every display is True Tone calibrated against a reference colour sensor, brightness-matched, and colour-profile checked. Non-screen repairs get a hardware function pass instead.",
      time: "45 min",
    },
    {
      num: "5",
      title: "30-point QA",
      body: "Brightness uniformity, touch response, keyboard, trackpad, speakers, camera, microphones, Wi-Fi throughput, Bluetooth, battery health, sensor checks. Everything gets tested. Anything that fails gets addressed.",
      time: "45 min",
    },
    {
      num: "✓",
      title: "Ready — collect or delivered",
      body: "We text you the moment QA passes. Walk-in customers can collect the same day; courier and mail-in customers get a tracked return delivery. Every repair ships with your QA report and 2-year warranty.",
      time: "Same day",
    },
  ];

  return (
    <section className="hiw-bench">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">On the bench</div>
          <h2>What happens between "drop-off" and "fixed."</h2>
          <p>Here's exactly what your device goes through once it's in our hands. No grey areas — we send you timestamped photos at each stage.</p>
        </div>
        <div className="hiw-bench-timeline">
          {steps.map((s, i) => (
            <div key={i} className="hiw-bench-item">
              <div className="hiw-bench-marker">{s.num}</div>
              <div className="hiw-bench-body">
                <h4>{s.title}</h4>
                <p>{s.body}</p>
                <div className="hiw-bench-time">{s.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HIWCTA() {
  return (
    <section className="hiw-cta">
      <div className="container hiw-cta-inner">
        <div className="mono-label">Ready to start?</div>
        <h2>Your repair is 60 seconds away.</h2>
        <p>Tell us your device and what's wrong. You'll see a price, pick a date, and book — with genuine Apple parts, a 2-year warranty, and a free diagnosis if we need to look first.</p>
        <div className="hiw-cta-actions">
          <a href="iCorrect Homepage.html#wizard" className="btn btn-dark btn-lg">Get an instant quote →</a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">+44 (0)207 099 8517</a>
        </div>
        <div className="hiw-cta-trust">
          <span><strong>4.9</strong> · 719 Google reviews</span>
          <span><strong>2-year</strong> warranty</span>
          <span><strong>Genuine</strong> Apple parts</span>
          <span><strong>£0</strong> if we can't fix it</span>
        </div>
      </div>
    </section>
  );
}

function HIWBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>How It Works</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  HIWHero, ThreeStepsSection, ServicesSection,
  DeliveryMethodsSection, OnTheBenchSection,
  HIWCTA, HIWBreadcrumb,
});
