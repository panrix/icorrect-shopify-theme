// Why Us page — all section components
// Voice: confident, specific, quantified. No hype. Let the facts do the selling.

function WhyUsHero() {
  return (
    <section className="whyus-hero">
      <div className="container whyus-hero-inner">
        <div className="whyus-hero-text">
          <div className="mono-label">Why iCorrect</div>
          <h1>The workshop other repair shops send their hardest jobs to.</h1>
          <p>We're not a parts-swapping service. We're microelectronics engineers who work at the board level — individual chips, solder joints, and backlight circuits under a microscope. That's why insurers, corporates, and other repair shops trust us with the cases they can't solve.</p>
          <div className="whyus-hero-actions">
            <a href="iCorrect Homepage.html#wizard" className="btn btn-dark btn-lg">Get an instant quote →</a>
            <a href="tel:+442070998517" className="btn btn-light btn-lg">Call us</a>
          </div>
        </div>
        <div className="whyus-hero-stats">
          <div className="whyus-stat-card">
            <div className="whyus-stat-num">4.9</div>
            <div className="whyus-stat-label">Google rating</div>
            <div className="whyus-stat-body">719 verified reviews. Not curated, not incentivised — just honest feedback.</div>
          </div>
          <div className="whyus-stat-card">
            <div className="whyus-stat-num">24 mo</div>
            <div className="whyus-stat-label">Warranty</div>
            <div className="whyus-stat-body">Double the industry standard. Parts, labour, and any re-work — no asterisks.</div>
          </div>
          <div className="whyus-stat-card">
            <div className="whyus-stat-num">11 yr</div>
            <div className="whyus-stat-label">In business</div>
            <div className="whyus-stat-body">Founded in 2015 at our Fitzrovia workshop. Same team, same bench, same standards.</div>
          </div>
          <div className="whyus-stat-card">
            <div className="whyus-stat-num">40k+</div>
            <div className="whyus-stat-label">Repairs completed</div>
            <div className="whyus-stat-body">MacBooks, iPhones, iPads — from cracked screens to liquid-damaged logic boards.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DifferenceSection() {
  return (
    <section className="whyus-diff">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">The difference</div>
          <h2>Most repair shops replace parts. We repair them.</h2>
          <p>The majority of repair services swap entire assemblies — screen, battery, logic board. We go deeper. That means lower cost, less waste, and fixes for problems other shops call "unrepairable."</p>
        </div>
        <div className="whyus-diff-grid">
          <div className="whyus-diff-card">
            <div className="whyus-diff-card-head">
              <h3>A typical repair shop</h3>
              <span className="badge badge-ring">Industry norm</span>
            </div>
            <ul className="whyus-diff-list">
              <li>
                <span className="icon">—</span>
                <span>Swaps the entire logic board when one chip fails — £800+ for a £40 component</span>
              </li>
              <li>
                <span className="icon">—</span>
                <span>Uses aftermarket screens that lose True Tone, peak brightness, and colour accuracy</span>
              </li>
              <li>
                <span className="icon">—</span>
                <span>Sends complex jobs out to a third-party lab (adding days and markup)</span>
              </li>
              <li>
                <span className="icon">—</span>
                <span>6-month warranty at best — some offer 90 days or none at all</span>
              </li>
              <li>
                <span className="icon">—</span>
                <span>Diagnosis is a guess-and-swap process — you pay even if they can't fix it</span>
              </li>
            </ul>
          </div>
          <div className="whyus-diff-card highlight">
            <div className="whyus-diff-card-head">
              <h3>iCorrect</h3>
              <span className="badge badge-dark">Board-level</span>
            </div>
            <ul className="whyus-diff-list">
              <li>
                <span className="icon">✓</span>
                <span>Replaces the individual chip, resistor, or capacitor under a microscope — saving you hundreds</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span>Genuine Apple displays, recalibrated in-house for True Tone, full brightness, and colour match</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span>Every repair happens on our own bench in Fitzrovia — never outsourced, ever</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span>2-year warranty on every repair — parts, labour, and re-work included</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span>£49 diagnosis with a written quote before any work starts — deducted from the repair cost if you proceed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  const caps = [
    {
      icon: "microscope",
      title: "Microsoldering",
      body: "We rework individual BGA chips, capacitors, and resistors under a stereo microscope with lead-free solder. This is how we fix problems — like backlight failure or no-power faults — that other shops declare terminal.",
      tag: "Board-level",
      tagColor: "blue",
    },
    {
      icon: "display",
      title: "Display calibration",
      body: "Every screen we fit is True Tone calibrated against a reference colour sensor, brightness-matched, and run through a 30-point QA checklist. No white-point drift, no aftermarket guesswork.",
      tag: "In-house",
      tagColor: "green",
    },
    {
      icon: "water",
      title: "Liquid damage recovery",
      body: "Spilled liquid doesn't always mean a write-off. We ultrasonically clean the board, map the corrosion path under magnification, and replace only the components that shorted — recovering data and function.",
      tag: "Specialist",
      tagColor: "amber",
    },
    {
      icon: "stagelight",
      title: "Stage Light repair",
      body: "The MacBook Pro 'Stage Light effect' — bright spots at the bottom of the display — is caused by a flex cable fatigue issue. We replace the backlight cable and driver IC, not the entire display assembly.",
      tag: "Board-level",
      tagColor: "blue",
    },
    {
      icon: "chip",
      title: "IC replacement",
      body: "Backlight driver, USB-C controller, power management IC — we stock common Apple silicon and can reball or reflow BGAs on-site. No waiting for a third-party lab.",
      tag: "In-house",
      tagColor: "green",
    },
    {
      icon: "data",
      title: "Data recovery",
      body: "Even when the logic board is too far gone to repair economically, we can often recover your data by transplanting the NAND storage to a donor board — encrypted and intact.",
      tag: "Specialist",
      tagColor: "amber",
    },
  ];

  return (
    <section className="whyus-cap">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">What we can do</div>
          <h2>Repairs other shops can't — or won't — attempt.</h2>
          <p>Our technicians are trained in microelectronics, not just parts replacement. Here's what that means in practice.</p>
        </div>
        <div className="whyus-cap-grid">
          {caps.map((c, i) => (
            <div key={i} className="whyus-cap-card">
              <div className="whyus-cap-icon">
                <CapIcon type={c.icon} />
              </div>
              <span className={"whyus-cap-tag whyus-cap-tag-" + c.tagColor}>{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapIcon({ type }) {
  const s = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "microscope":
      return <svg {...s}><circle cx="12" cy="7" r="4" /><path d="M12 11v6M8 21h8M10 17h4" /></svg>;
    case "display":
      return <svg {...s}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /><path d="M7 9h2M11 9h2M15 9h2" strokeWidth="2" strokeLinecap="round" /></svg>;
    case "water":
      return <svg {...s}><path d="M12 3c0 0-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z" /><path d="M9.5 16a2.5 2.5 0 003.5-1" /></svg>;
    case "stagelight":
      return <svg {...s}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M7 19h10" /><path d="M6 13h12" strokeWidth="2" opacity="0.4" /><circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" /></svg>;
    case "chip":
      return <svg {...s}><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M9.5 5V3M12 5V3M14.5 5V3M9.5 21V19M12 21V19M14.5 21V19M5 9.5H3M5 12H3M5 14.5H3M21 9.5H19M21 12H19M21 14.5H19" /></svg>;
    case "data":
      return <svg {...s}><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></svg>;
    default:
      return <svg {...s}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function TransparencySection() {
  return (
    <section className="whyus-transparent">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">How we work</div>
          <h2>Total transparency. No grey areas.</h2>
          <p>You'll know exactly what's happening with your device at every stage. We don't hide behind jargon or vague timelines.</p>
        </div>
        <div className="whyus-transparent-grid">
          <div className="whyus-transparent-card">
            <div className="whyus-transparent-num">£49</div>
            <h3>Diagnosis</h3>
            <p>Walk in or send your device. We'll inspect it, identify the fault on the scope, and give you a written quote — no commitment. The fee is deducted from the repair cost if you proceed.</p>
          </div>
          <div className="whyus-transparent-card">
            <div className="whyus-transparent-num">30-pt</div>
            <h3>QA checklist</h3>
            <p>Every repair runs through a 30-point quality assurance pass before it leaves the bench — brightness uniformity, True Tone, keyboard, speakers, camera, Wi-Fi, and more.</p>
          </div>
          <div className="whyus-transparent-card">
            <div className="whyus-transparent-num">Live</div>
            <h3>Bench photos</h3>
            <p>We send timestamped photos from the workbench when your display comes off, when the new part goes on, and when QA passes. You see exactly what we did and why.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const reviews = [
    {
      text: "Took my MacBook Pro in with the Stage Light issue. They explained exactly what was wrong at the component level, showed me the damaged flex cable, and had it back to me next day. Genuinely impressed by the technical knowledge.",
      author: "James T.",
      date: "3 weeks ago",
      initials: "JT",
    },
    {
      text: "Our company sends all Apple repairs to iCorrect. They handle NDAs, provide audit trails for our IT department, and the turnaround is consistently faster than Apple's own service. The 2-year warranty sealed it for us.",
      author: "Sarah M.",
      date: "1 month ago",
      initials: "SM",
    },
    {
      text: "I was told by two other shops that my water-damaged MacBook Air was beyond repair. iCorrect recovered the board and my data. I don't usually leave reviews but these people genuinely know what they're doing at a level most shops don't.",
      author: "David K.",
      date: "2 months ago",
      initials: "DK",
    },
    {
      text: "Screen replaced on my M1 Pro 14-inch. True Tone still works perfectly, colours are spot-on, and the whole thing was done in under 24 hours. Half the price of the Apple Store. Will be back for anything else.",
      author: "Emma R.",
      date: "3 weeks ago",
      initials: "ER",
    },
    {
      text: "I run a repair shop myself and outsource board-level work to iCorrect. Their microsoldering is excellent — backlight IC replacements, NAND transplants, things I can't do in-house. Fast, reliable, and they communicate well throughout.",
      author: "Chris W.",
      date: "1 month ago",
      initials: "CW",
    },
    {
      text: "Brought in a 2019 MacBook Pro with a flickering display. They diagnosed a failing T-CON connection in about 20 minutes, quoted me on the spot, and I collected it fixed the next afternoon. Straightforward, no nonsense.",
      author: "Priya N.",
      date: "5 weeks ago",
      initials: "PN",
    },
  ];

  return (
    <section className="whyus-reviews">
      <div className="container">
        <div className="whyus-reviews-head">
          <div className="info-head">
            <div className="mono-label">What our customers say</div>
            <h2>719 Google reviews. Read any of them.</h2>
            <p>We don't cherry-pick. These are verified Google Business reviews — the same ones you'd see if you searched "iCorrect London" right now.</p>
          </div>
          <div className="whyus-reviews-score">
            <div className="whyus-reviews-score-num">4.9</div>
            <div>
              <Stars rating={4.9} />
              <div className="whyus-reviews-score-meta">on Google</div>
            </div>
          </div>
        </div>
        <div className="whyus-reviews-grid">
          {reviews.map((r, i) => (
            <div key={i} className="whyus-review-card">
              <div className="whyus-review-stars">★★★★★</div>
              <div className="whyus-review-text">{r.text}</div>
              <div className="whyus-review-author">
                <div className="whyus-review-avatar">{r.initials}</div>
                <div>
                  <div className="whyus-review-name">{r.author}</div>
                  <div className="whyus-review-date">{r.date}</div>
                </div>
                <div className="whyus-review-source">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.14 6.36H11.2v1.92H7.14V13H5.04V8.28H1V6.36h4.04V1.5h2.1v4.86z" fill="#4285F4"/></svg>
                  Google
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  const clients = [
    {
      icon: "🏢",
      title: "Corporate IT departments",
      body: "We manage fleet repairs for London businesses — NDAs signed, GDPR-compliant processes, audit-ready repair logs, and priority turnaround on bulk work.",
    },
    {
      icon: "🛡",
      title: "Insurance companies",
      body: "Insurers refer policyholders to us because our quotes are itemised, our diagnostics are documented, and our repair-vs-replace decisions save them money.",
    },
    {
      icon: "🔧",
      title: "Other repair shops",
      body: "When a repair shop hits a board-level problem they can't solve in-house — a backlight IC, a NAND transplant, liquid damage — they send it to our bench.",
    },
    {
      icon: "🎓",
      title: "Universities & schools",
      body: "Education institutions trust us with student and staff MacBook fleets. We offer volume pricing, documented processes, and term-time priority scheduling.",
    },
  ];

  return (
    <section className="whyus-trusted">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Who trusts us</div>
          <h2>Not just individuals. Businesses send their toughest repairs to us.</h2>
          <p>From solo freelancers to corporate IT departments with 500-device fleets — our clients choose us because the work speaks for itself.</p>
        </div>
        <div className="whyus-trusted-grid">
          {clients.map((c, i) => (
            <div key={i} className="whyus-trusted-card">
              <div className="whyus-trusted-icon">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsCTA() {
  return (
    <section className="whyus-cta">
      <div className="container whyus-cta-inner">
        <div className="mono-label">Ready?</div>
        <h2>Get a quote in 60 seconds. Or just walk in.</h2>
        <p>Tell us your model and your issue. You'll see a fixed price, pick a date, and book — with a 2-year warranty and genuine Apple parts. No commitment until you say go.</p>
        <div className="whyus-cta-actions">
          <a href="iCorrect Homepage.html#wizard" className="btn btn-dark btn-lg">Get an instant quote →</a>
          <a href="tel:+442070998517" className="btn btn-light btn-lg">+44 (0)207 099 8517</a>
        </div>
        <div className="whyus-cta-contact">
          Or email <a href="mailto:support@icorrect.co.uk">support@icorrect.co.uk</a> · Walk in Mon–Fri, 12 Margaret St, Fitzrovia W1W 8JQ
        </div>
      </div>
    </section>
  );
}

function WhyUsBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Why Us</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  WhyUsHero, DifferenceSection, CapabilitiesSection,
  TransparencySection, ReviewsSection, TrustedBySection,
  WhyUsCTA, WhyUsBreadcrumb, CapIcon,
});
