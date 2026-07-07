// Homepage sections 2+: Trust strip, Data safety, Price confidence,
// London access, Corporate doorway, FAQ. The hero + proof + wizard
// sections live in Homepage.jsx.

/* ===== Section 2: Trust band =============================================
   Ported from the collection page's TrustBand — #fafafa card, 4-up grid,
   icon boxes, dividers. Same component, same visual language.
   ====================================================================== */
function TrustStrip({ reviewCount = 719, rating = 4.9 }) {
  return (
    <section className="trust-band">
      <div className="container">
        <TrustCard reviewCount={reviewCount} rating={rating} />
      </div>
    </section>
  );
}

Object.assign(window, { TrustStrip });

/* ===== Photo band: "Boards, not stock photos." ==========================
   The bench, full width — dark-framed documentary shots with mono tags.
   Toggleable from the Tweaks panel (photography pass).
   ======================================================================== */
function PhotoBand() {
  const shots = [
    { src: "uploads/repair-scope.jpg", tag: "Under the microscope", note: "Board-level diagnosis" },
    { src: "uploads/backlight-repair.jpg", tag: "Backlight IC · fixed £380", note: "Apple: write-off" },
    { src: "uploads/repair-rework.jpg", tag: "Rework station", note: "Microsoldering bench" },
  ];
  return (
    <section className="hp-photoband">
      <div className="container">
        <div className="hp-photoband-head">
          <div>
            <div className="hp-section-eyebrow">The bench</div>
            <h2>Boards, not stock photos.</h2>
          </div>
          <p>
            Every photo on this site is our own workshop at 12 Margaret Street. This is what your repair actually looks like — a stereo microscope, a rework station, and the board Apple said was dead.
          </p>
        </div>
        <div className="hp-photoband-grid">
          {shots.map((s, i) => (
            <figure key={i} className={"hp-photoband-shot hp-reveal hp-reveal-d" + (i + 1)}>
              <img src={s.src} alt={s.tag} loading="lazy" />
              <figcaption>
                <span className="hp-photoband-tag">{s.tag}</span>
                <span className="hp-photoband-note">{s.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PhotoBand });

/* ===== Reviews wall — "The hard cases. Real customers." =================
   Lifted from the product page treatment the client signed off; homepage
   edition spans the whole bench (board, liquid, warranty, walk-in), not
   just screens. Replaces the proof-cases section via the Tweaks panel. */
function HomeReviewsWall({ reviewCount = 719, rating = 4.9 }) {
  const reviews = [
    {
      who: "Daniel R.", where: "Google", device: "MBP 16\" M1 Max",
      title: "Apple said new logic board. It was one chip.",
      body: "Quoted £1,400 for a board swap. iCorrect traced it to the backlight IC and repaired it under the microscope. Same Mac, my data untouched.",
      tag: "Saved £1,020",
    },
    {
      who: "Henrietta W.", where: "Trustpilot", device: "MBA 13\" M2",
      title: "Liquid damage. They returned my data.",
      body: "Apple wrote it off after a wine spill. Cleaned the board, replaced the flex, recovered every file.",
      tag: "Recovery",
    },
    {
      who: "Marcus T.", where: "Google", device: "MBP 16\" M1 Max",
      title: "Stage Light gone. Warranty honoured.",
      body: "Classic flex-cable failure. Re-did the work for free under warranty 9 months later. No quibbles.",
      tag: "Free re-work",
    },
    {
      who: "Priya S.", where: "Google", device: "iPhone 15 Pro",
      title: "Walked in at 9. Working screen by lunch.",
      body: "Genuine display fitted while I worked across the road. The price I was quoted online was the price I paid.",
      tag: "Same day",
    },
  ];
  return (
    <section className="hp-reviews" id="reviews" data-screen-label="Reviews wall">
      <div className="container">
        <div className="hp-reviews-head">
          <div>
            <div className="hp-section-eyebrow">Customer outcomes</div>
            <h2 className="hp-section-title">The hard cases. Real customers.</h2>
          </div>
          <div className="reviews-wall-stat">
            <div className="reviews-wall-stat-row">
              <div className="reviews-wall-stat-num">{rating}</div>
              <div className="reviews-wall-stat-stars">
                {[0, 1, 2, 3, 4].map(i => (
                  <svg key={i} viewBox="0 0 14 14" width="16" height="16">
                    <path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z" style={{ fill: "var(--ic-star, #f59e0b)" }} />
                  </svg>
                ))}
              </div>
            </div>
            <div className="reviews-wall-stat-meta"><strong>{reviewCount}</strong> verified Google reviews</div>
          </div>
        </div>
        <div className="reviews-wall-grid">
          {reviews.map((r, i) => (
            <article key={i} className="review-card hp-reveal">
              <div className="review-card-top">
                <span className="review-card-tag">{r.tag}</span>
                <div className="review-card-stars">
                  {[0, 1, 2, 3, 4].map(j => (
                    <svg key={j} viewBox="0 0 14 14" width="11" height="11">
                      <path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z" style={{ fill: "var(--ic-star, #f59e0b)" }} />
                    </svg>
                  ))}
                </div>
              </div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <footer className="review-card-foot">
                <strong>{r.who}</strong>
                <span>{r.device} · {r.where}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeReviewsWall });

/* ===== Section 5: Data safety ============================================
   "Your data stays on your drive." Quiet, specific, no hype.
   ======================================================================== */
function DataSafetySection() {
  const items = [
    { num: "01", title: "Screen repairs never touch your drive", body: "The display is a separate assembly. We replace it without powering on — your data doesn't enter the equation." },
    { num: "02", title: "GDPR-compliant workshop", body: "No passcodes requested unless post-repair testing requires it — and you can be present for that step. NDA on request for corporate clients." },
    { num: "03", title: "No cloud, no sync", body: "Your device doesn't connect to our network. Diagnosis happens on an isolated bench with board-level tools, not software." },
  ];
  return (
    <section className="hp-section hp-datasafety">
      <div className="container">
        <div className="hp-section-head">
          <div>
            <div className="hp-section-eyebrow">Data &amp; privacy</div>
            <h2 className="hp-section-title">Your data stays on your device.</h2>
          </div>
          <p className="hp-section-lede">
            We're board-level hardware specialists, not IT support. We don't need your passwords, we don't image your drive, and we don't plug your Mac into our network.
          </p>
        </div>
        <div className="hp-datasafety-grid">
          {items.map((it, i) => (
            <div key={i} className={"hp-datasafety-card hp-reveal hp-reveal-d" + (i + 1)}>
              <span className="hp-datasafety-num">{it.num}</span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Section 6: Price confidence ======================================
   "What you're quoted is what you pay." Counters the industry's bait-and-switch reputation.
   ======================================================================== */
function PriceConfidenceSection() {
  return (
    <section className="hp-section hp-priceconf">
      <div className="container">
        <div className="hp-section-head">
          <div>
            <div className="hp-section-eyebrow">Pricing</div>
            <h2 className="hp-section-title">The quote is the price. No surprises.</h2>
          </div>
          <p className="hp-section-lede">
            We don't lowball to get you through the door and then discover "additional damage." If diagnosis reveals something we didn't expect, we call you with an updated quote before touching anything.
          </p>
        </div>
        <div className="hp-priceconf-grid">
          <div className="hp-priceconf-card hp-priceconf-card-main">
            <div className="hp-priceconf-row">
              <span className="hp-priceconf-label">Fixed-price repairs</span>
              <span className="hp-priceconf-value">Screen, battery, rear glass — priced by model, not by mood.</span>
            </div>
            <div className="hp-priceconf-row">
              <span className="hp-priceconf-label">Free pre-diagnosis</span>
              <span className="hp-priceconf-value">15 minutes on the scope. Written quote before any work. Walk away for free.</span>
            </div>
            <div className="hp-priceconf-row">
              <span className="hp-priceconf-label">No hidden fees</span>
              <span className="hp-priceconf-value">The price includes parts, labour, calibration, QA, and a 2-year warranty. Collection and return are the only add-on.</span>
            </div>
          </div>
          <div className="hp-priceconf-compare">
            <div className="hp-priceconf-compare-head">
              <span>Why we're different from Apple</span>
            </div>
            <div className="hp-priceconf-row-compare">
              <span className="hp-priceconf-compare-label">Backlight IC failure</span>
              <div className="hp-priceconf-compare-prices">
                <span className="hp-priceconf-compare-theirs">Apple: <strong>£1,400</strong> <em>(full board swap)</em></span>
                <span className="hp-priceconf-compare-ours">iCorrect: <strong>£380</strong> <em>(chip replacement)</em></span>
              </div>
            </div>
            <div className="hp-priceconf-row-compare">
              <span className="hp-priceconf-compare-label">MacBook Pro 14" screen</span>
              <div className="hp-priceconf-compare-prices">
                <span className="hp-priceconf-compare-theirs">Apple: <strong>£669</strong></span>
                <span className="hp-priceconf-compare-ours">iCorrect: <strong>£449</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Section 7: London access ==========================================
   Walk-in, courier, mail-in. Three equal-weight paths.
   ======================================================================== */
function LondonAccessSection() {
  const paths = [
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>,
      title: "Walk in",
      detail: "12 Margaret Street, Fitzrovia W1W 8JQ",
      meta: "Free · Mon–Fri · No appointment needed",
      body: "Opposite The London Palladium. Free diagnosis while you wait. Most screen and battery repairs returned same-day or next-day.",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="6" width="22" height="12" rx="2"/><path d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v.01"/></svg>,
      title: "Same-day courier",
      detail: "London postcodes only",
      meta: "+ £20 · Collected within 3 hours",
      body: "We send a tracked courier to your door. Your device is on the bench the same day, returned as soon as the repair's done.",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
      title: "UK-wide mail-in",
      detail: "Pre-paid tracked shipping",
      meta: "+ £24 · Next-day collection kit",
      body: "We send you a pre-paid, insured shipping kit. Post it, we repair it, we courier it back. Same warranty, same quality.",
    },
  ];
  return (
    <section className="hp-section hp-access">
      <div className="container">
        <div className="hp-section-head">
          <div>
            <div className="hp-section-eyebrow">Getting your device to us</div>
            <h2 className="hp-section-title">Three ways in. One standard of repair.</h2>
          </div>
          <p className="hp-section-lede">
            Walk in from Oxford Circus, send a London courier, or post it from anywhere in the UK. Every repair uses the same bench, the same parts, the same warranty.
          </p>
        </div>
        <div className="hp-access-grid">
          {paths.map((p, i) => (
            <div key={i} className={"hp-access-card hp-reveal hp-reveal-d" + (i + 1)}>
              <div className="hp-access-icon">{p.icon}</div>
              <h3 className="hp-access-title">{p.title}</h3>
              <div className="hp-access-detail">{p.detail}</div>
              <div className="hp-access-meta">{p.meta}</div>
              <p className="hp-access-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Section 8: Corporate doorway =====================================
   Quiet, B2B-leaning. Dark band. "When it's business-critical."
   ======================================================================== */
function CorporateSection() {
  return (
    <section className="hp-section hp-corporate">
      <div className="container hp-corporate-inner">
        <div className="hp-corporate-text">
          <div className="hp-section-eyebrow" style={{color:"#a3a3a3"}}>Specialist &amp; Corporate</div>
          <h2 className="hp-corporate-title">When it's business-critical,<br />skip the queue.</h2>
          <p className="hp-corporate-body">
            Time-sensitive data recovery. Fleet repairs on retainer. The device Apple said was a write-off that your board presentation lives on. We handle the cases other shops won't touch — and we don't route you through a chatbot to get there.
          </p>
          <ul className="hp-corporate-list">
            <li>Priority bench slot — same-day or next-day turnaround</li>
            <li>Dedicated technician, not a call centre</li>
            <li>NDA, audit trail, GDPR-compliant handling</li>
            <li>Fleet pricing for 5+ devices</li>
          </ul>
          <a href="Corporate Services.html" className="hp-corporate-cta">Talk to a specialist →</a>
        </div>
        <div className="hp-corporate-aside">
          <div className="hp-corporate-stat hp-reveal hp-reveal-d1">
            <span className="hp-corporate-stat-num">94%</span>
            <span className="hp-corporate-stat-label">Data recovered from "dead" Macs in 2025</span>
          </div>
          <div className="hp-corporate-stat hp-reveal hp-reveal-d2">
            <span className="hp-corporate-stat-num">4 h</span>
            <span className="hp-corporate-stat-label">Average turnaround on priority bench repairs</span>
          </div>
          <div className="hp-corporate-stat hp-reveal hp-reveal-d3">
            <span className="hp-corporate-stat-num">NDA</span>
            <span className="hp-corporate-stat-label">Signed on request for every corporate job</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Section 9: FAQ + final CTA =======================================
   Working accordions. Top 6 questions.
   ======================================================================== */
const HP_FAQ_ITEMS = [
  { q: "How long does a repair take?", a: "Most screen and battery repairs are done in 1–2 working days. Walk in before 11am with a common repair and same-day turnaround is usually possible. Board-level work (backlight IC, liquid damage) takes 3–5 days because we need to scope, repair, and QA under the microscope." },
  { q: "Are the parts genuine Apple?", a: "Yes. We source original Apple displays and batteries — not aftermarket \"compatible\" parts. Every screen is True Tone calibrated in-house to factory standards. That's why we can warrant them for two years instead of the usual six months." },
  { q: "Is my data safe?", a: "Completely. Screen and battery repairs don't touch your storage at all. For board-level work, your device stays on an isolated bench — it never connects to our network. We sign NDAs for corporate clients on request, and we never ask for your passcode unless post-repair testing requires it." },
  { q: "What does the 2-year warranty cover?", a: "Every part we fit and the labour to install it. If anything we touched fails inside 24 months, we fix it free — no diagnostic fee, no \"goodwill\" negotiation. Accidental damage isn't covered, but we'll always quote fairly for re-repairs." },
  { q: "Do I need to book, or can I walk in?", a: "Either. Walk in Mon–Fri (Mon–Thu 9–6, Fri 10–6) for a free diagnosis and written quote. Booking via the wizard reserves a bench slot and is usually faster — particularly for board-level work or if you want same-day courier collection." },
  { q: "What if Apple says it's unfixable?", a: "That's what we specialise in. \"Unfixable\" at Apple usually means they've quoted a full logic-board replacement because they don't repair at the chip level. We do. Backlight IC failures, liquid damage recovery, T2/Touch ID pairing faults — these are routine for us. Bring it in or send it over, and we'll scope it for free." },
];

function HomepageFAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="hp-section hp-faq" id="faq">
      <div className="container hp-faq-grid">
        <div className="hp-faq-left">
          <div className="hp-section-eyebrow">Frequently asked</div>
          <h2 className="hp-section-title">Questions, answered honestly.</h2>
          <p style={{font:"400 16px/1.55 var(--font-sans)", color:"#4d4d4d", marginTop:16, textWrap:"pretty"}}>
            If your question isn't here, call <a href="tel:+442070998517" style={{color:"#171717",fontWeight:500}}>+44 (0)207 099 8517</a> or drop in — we're opposite The London Palladium.
          </p>
        </div>
        <div className="hp-faq-right">
          {HP_FAQ_ITEMS.map((it, i) => (
            <div key={i} className={"hp-faq-item" + (open === i ? " is-open" : "")}>
              <button className="hp-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <span className="hp-faq-icon" aria-hidden="true">+</span>
              </button>
              {open === i && (
                <div className="hp-faq-a">{it.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Final CTA + Footer =============================================== */
function FinalCTA() {
  return (
    <section className="hp-finalcta">
      <div className="container hp-finalcta-inner">
        <h2>Ready to get it fixed?</h2>
        <p>Tell us your device and the symptom. See your price in 60 seconds — or let us diagnose it for free.</p>
        <div className="hp-finalcta-row">
          <a href="#wizard" className="hp-cta hp-cta-primary hp-cta-lg">
            Get a quote <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function HomepageFooter() {
  return (
    <footer className="hp-footer">
      <div className="container hp-footer-inner">
        <div className="hp-footer-brand">
          <span className="hp-logo" style={{color:"#fff", pointerEvents:"none"}}>
            <span className="hp-logo-mark" style={{background:"#fff", color:"#171717"}}>iC</span>
            iCorrect
          </span>
          <span className="hp-footer-tag">Apple repair specialists · Fitzrovia, London</span>
        </div>
        <div className="hp-footer-cols">
          <div>
            <span className="hp-footer-col-title">Repairs</span>
            <a href="MacBook Repairs.html">MacBook</a><a href="MacBook Screen Collection.html">MacBook Screen</a><a href="Liquid Damage Process.html">Liquid damage</a><a href="Board-Level Diagnosis.html">Board-level</a><a href="#">iPhone</a><a href="#">iPad</a>
          </div>
          <div>
            <span className="hp-footer-col-title">Company</span>
            <a href="Why Us.html">Why us</a><a href="Corporate Services.html">Corporate</a><a href="How It Works.html">How it works</a><a href="Repair Case Study.html">Case study</a><a href="Contact.html">Contact</a>
          </div>
          <div>
            <span className="hp-footer-col-title">Legal</span>
            <a href="#">Warranty</a><a href="#">Privacy</a><a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="container hp-footer-base">
        <span>© 2026 iCorrect Ltd. Not affiliated with Apple Inc.</span>
        <span>Company No. 09392844 · VAT GB 203495788</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  TrustStrip, DataSafetySection, PriceConfidenceSection,
  LondonAccessSection, CorporateSection, HomepageFAQ,
  FinalCTA, HomepageFooter,
});
