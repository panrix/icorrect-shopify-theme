// === Product page journey sections =======================================
// FAQ-driven arc: Failure → Why us / Parts → Process (videos inline) →
// Behind the scenes reel → Warranty → FAQ
// All sections accept generic copy so this template works across products.

// ---------- 1. Hero header (above hero) ----------------------------------
function ProductBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="#">Home</a>
        <span className="sep">/</span>
        <a href="#">Repairs</a>
        <span className="sep">/</span>
        <a href="#">MacBook</a>
        <span className="sep">/</span>
        <span>Screen</span>
      </div>
    </div>);

}

// ---------- 2. Hero --------------------------------------------------------
function ProductHero({ placement = "top" }) {
  const anchors = [
  { num: "01", label: "Why screens fail", href: "#failure" },
  { num: "02", label: "Why most shops can't fix this", href: "#parts" },
  { num: "03", label: "Behind the bench", href: "#process" },
  { num: "04", label: "Warranty", href: "#warranty" },
  { num: "05", label: "FAQs", href: "#faqs" }];


  return (
    <section className="product-hero" id="product-hero">
      <div className="container">
        <div className="product-hero-grid">
          <div className="product-hero-left">
            <div className="product-hero-eyebrow">
              <span className="dot" />
              MacBook · Screen Repair
            </div>
            <h1>MacBook Pro 16" M3 Pro/Max screen repair, with True Tone preserved.</h1>
            <p className="product-hero-lede">
              We replace the A2991 display assembly with a genuine pulled OEM panel — calibrated against a
              reference sensor before it leaves the bench. Most repairs are completed inside 48 hours,
              warrantied for two years.
            </p>

            <div className="product-hero-price">
              <div className="product-hero-price-key">Repair from</div>
              <div className="product-hero-price-val">£699</div>
              <div className="product-hero-price-foot">
                <span>Turnaround <strong>48 hrs</strong></span>
                <span className="sep" />
                <span>Warranty <strong>2 years</strong></span>
                <span className="sep" />
                <span><span className="star">★</span> <strong>4.9</strong> · 2,139 reviews</span>
              </div>
            </div>

            <div className="product-hero-anchors">
              {anchors.map((a) =>
              <a key={a.num} href={a.href} className="product-hero-anchor">
                  <span className="anchor-num">{a.num}</span>
                  {a.label}
                </a>
              )}
            </div>
          </div>

          {placement !== "bottom" &&
          <div className="product-hero-right">
              <ProductConfigurator />
            </div>
          }
        </div>
      </div>
    </section>);

}

// ---------- 3. Failure section ("Why screens fail") ----------------------
function FailureSection() {
  const causes = [
  {
    symptom: "Cracked or shattered glass",
    title: "Impact through the glass laminate.",
    body: "The 16\" mini-LED panel uses a fully-bonded glass layer. Even a hairline crack lets light leak around dimming zones — and the OLED-style backlight halos worsen with time as moisture wicks in.",
    cause: "Glass + LCD assembly"
  },
  {
    symptom: "Black screen, fan still spinning",
    title: "Backlight IC or fuse failure.",
    body: "When the Mac sounds alive but the display stays dark, it's almost always U7800 (the backlight controller) or a blown fuse on the logic board — not the panel itself. Most shops swap the screen anyway. We probe it first.",
    cause: "Backlight driver IC"
  },
  {
    symptom: "Vertical bars, flickering",
    title: "Stage Light effect on flex cable.",
    body: "Apple's silicone-bonded display flex develops microfractures along the hinge. It's a known design flaw on 13/14/16\" MBPs — and it's why we keep a stockpile of replacement flex cables on the bench.",
    cause: "Display flex cable"
  },
  {
    symptom: "Dead pixels, bright spots",
    title: "Backlight LED or polariser damage.",
    body: "Pressure points or stuck pixels often come from carrying a Mac in a tight bag. Below a threshold count, they're not user-visible — above it, the panel needs replacement. We'll show you the pixel test before you commit.",
    cause: "LCD pixel grid"
  },
  {
    symptom: "Image distortion, colour cast",
    title: "Liquid damage on display PCB.",
    body: "Water tracks under the panel and corrodes the timing-control PCB. Visible as colour shifts, ghosting, or a colour cast. Usually recoverable at the board level — most shops won't touch it.",
    cause: "T-CON board corrosion"
  },
  {
    symptom: "Dim, uneven, or angle-dependent",
    title: "Backlight failing across zones.",
    body: "The 2023 16\" uses 1,920 mini-LED dimming zones. Individual zones can fail without obvious symptoms until you're on a dark scene. We test every zone with our calibration sensor before quoting.",
    cause: "Mini-LED dimming zones"
  }];


  return (
    <section className="journey" id="failure">
      <div className="container">
        <div className="journey-stage">
          <span className="journey-stage-num">01</span>
          What's actually broken
        </div>
        <h2>Six things go wrong with this display. Only two of them actually need a new screen.</h2>
        <p className="journey-lede">
          Before quoting, we need to know what's failed. Apple's diagnostic just says "display issue" — useful
          to nobody. Here's what we look for under the microscope, and which fixes are board-level vs assembly.
        </p>

        <div className="failure-grid">
          {causes.map((c, i) =>
          <div key={i} className="failure-card">
              <div className="failure-card-symptom">{c.symptom}</div>
              <h3>{c.title}</h3>
              <p className="failure-card-body">{c.body}</p>
              <div className="failure-card-cause">
                <span className="failure-card-cause-label">Likely cause</span>
                <span className="failure-card-cause-val">{c.cause}</span>
              </div>
            </div>
          )}
        </div>

        <div className="failure-callout">
          <div className="failure-callout-mark">i</div>
          <div className="failure-callout-body">
            <strong>Free pre-diagnosis.</strong> Drop your Mac in or post it to the workshop and we'll pinpoint the
            actual failure under a stereo microscope before sending a written quote. No fee, no commitment —
            we'd rather you knew exactly what you're paying for.
          </div>
        </div>
      </div>
    </section>);

}

// ---------- 4. Parts / Why us --------------------------------------------
function PartsSection() {
  const rows = [
  { attr: "Source", us: "Genuine pulled OEM", them: "Aftermarket compatible" },
  { attr: "True Tone", us: { mark: "yes", t: "Calibrated" }, them: { mark: "no", t: "Not preserved" } },
  { attr: "Brightness", us: "1,000 nits sustained", them: "~600 nits, fades" },
  { attr: "Colour accuracy", us: "ΔE < 2 (reference)", them: "ΔE 4–6 typical" },
  { attr: "Warranty", us: "2 years", them: "3–6 months" },
  { attr: "Lifespan", us: "5+ years matched", them: "12–18 months" }];


  return (
    <section className="journey journey-tight" id="parts">
      <div className="container">
        <div className="parts-grid">
          <div className="parts-text">
            <div className="journey-stage">
              <span className="journey-stage-num">02</span>
              Parts & quality
            </div>
            <h2>Why most shops can't actually do this repair.</h2>
            <p>
              The cheap option is an aftermarket panel from a third-party supplier. They look fine for the
              first week. Then True Tone stops working, brightness drops, and the colour balance shifts warm.
            </p>
            <p>
              We don't touch them. Every screen we fit on this model is a genuine Apple assembly — pulled from
              first-party stock and fully recalibrated against a reference colorimeter. It's slower and more
              expensive on our side. It's also why our 2-year warranty actually pays out.
            </p>
            <p style={{ color: "#171717", fontWeight: 500 }}>
              For the harder stuff — backlight IC, T-CON corrosion, Stage Light flex — most shops send those
              jobs to us. It's day-rate microsoldering work, and we keep the parts in stock.
            </p>
          </div>

          <div className="parts-vs">
            <div className="parts-vs-head">
              <div></div>
              <div className="col-us">iCorrect</div>
              <div>Most shops</div>
            </div>
            {rows.map((r, i) =>
            <div key={i} className="parts-vs-row">
                <div className="parts-vs-attr">{r.attr}</div>
                <div className="parts-vs-cell us">
                  {typeof r.us === "object" ?
                <><span className={"parts-vs-mark " + r.us.mark}>{r.us.mark === "yes" ? "✓" : "✗"}</span>{r.us.t}</> :
                r.us}
                </div>
                <div className="parts-vs-cell">
                  {typeof r.them === "object" ?
                <><span className={"parts-vs-mark " + r.them.mark}>{r.them.mark === "yes" ? "✓" : "✗"}</span>{r.them.t}</> :
                r.them}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ---------- 5. Process / behind the bench (videos inline) -----------------
function ProcessSection({ videoMode = "inline" }) {
  const steps = [
  {
    num: "01",
    title: "Free diagnosis on the bench",
    body: "Walk in or ship your Mac. We probe the backlight rail, test the panel under a stereo microscope, and check for collateral damage — hinge flex, board corrosion, Stage Light. You get a written quote before anything is opened.",
    meta: [["Time", "30 min"], ["Cost", "Free"]],
    video: { title: "Apple says you need a new MacBook. We disagreed.", dur: "1:42", tag: "Diagnosis", aspect: "tall" }
  },
  {
    num: "02",
    title: "Repair under the microscope",
    body: "Work happens here in Fitzrovia — never sent out. For a screen swap, the hinge and antenna transfer to the new assembly. For backlight IC or flex repairs, it's solder-paste work under 40× magnification.",
    meta: [["Time", "1–2 days"], ["Bench", "In-house"]],
    video: { title: "We complete our MacBook repairs differently.", dur: "0:58", tag: "Microsoldering", aspect: "tall" }
  },
  {
    num: "03",
    title: "Calibration & 30-point QA",
    body: "Every display we fit is True-Tone calibrated against a reference sensor and colour-profile matched. Then a 30-point QA pass — brightness uniformity, all dimming zones, touch-bar response, keyboard, speakers, camera, Wi-Fi.",
    meta: [["Tests", "30 points"], ["ΔE target", "<2"]],
    video: { title: "Liquid damaged M1 MacBook Pro, recovered.", dur: "1:15", tag: "QA", aspect: "tall" }
  },
  {
    num: "04",
    title: "Collection or insured courier",
    body: "Collect in person Mon–Fri or opt for insured next-day courier back to you. Every repair ships with a printed QA report, the 2-year warranty card, and your original parts if you want them returned.",
    meta: [["Return", "Same/next day"], ["Warranty", "2 years"]],
    video: null
  }];


  return (
    <section className="journey" id="process">
      <div className="container">
        <div className="journey-stage">
          <span className="journey-stage-num">03</span>
          Behind the bench
        </div>
        <h2>What actually happens between drop-off and "fixed".</h2>
        <p className="journey-lede">
          Four stages, no grey area. We send timestamped photos from the bench when the display comes off,
          so you'll know where your Mac is at every step.
        </p>

        <div className="process-stack">
          {steps.map((s, i) =>
          <div key={i} className={"process-row" + (videoMode === "inline" && s.video ? " inline-video" : "")}>
              <div className="process-num">{s.num}</div>
              <div className="process-content">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="process-meta">
                  {s.meta.map(([k, v]) =>
                <div key={k} className="process-meta-item">
                      <span className="process-meta-key">{k}</span>
                      <span className="process-meta-val">{v}</span>
                    </div>
                )}
                </div>
                {videoMode === "inline" && s.video &&
              <div className="process-video">
                    <div className="process-video-thumb">
                      <PlaceholderVideoIcon />
                    </div>
                    <div className="process-video-frame">{s.video.tag} · placeholder footage</div>
                    <div className="process-video-overlay">
                      <div className="process-video-play">
                        <svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" /></svg>
                      </div>
                      <div className="process-video-meta">
                        <div className="process-video-title">{s.video.title}</div>
                        <div className="process-video-dur">{s.video.dur}</div>
                      </div>
                    </div>
                  </div>
              }
              </div>
              {videoMode === "side" && s.video &&
            <div className="process-video tall">
                  <div className="process-video-thumb">
                    <PlaceholderVideoIcon />
                  </div>
                  <div className="process-video-frame">{s.video.tag} · placeholder</div>
                  <div className="process-video-overlay">
                    <div className="process-video-play">
                      <svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" /></svg>
                    </div>
                    <div className="process-video-meta">
                      <div className="process-video-title">{s.video.title}</div>
                      <div className="process-video-dur">{s.video.dur}</div>
                    </div>
                  </div>
                </div>
            }
              {videoMode === "off" && s.video &&
            <div style={{ padding: "12px 0", font: "500 11px var(--font-mono)", color: "#a3a3a3" }}>
                  &nbsp;
                </div>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

}

function PlaceholderVideoIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="14" width="44" height="32" rx="2" />
      <rect x="40" y="22" width="20" height="20" rx="2" />
      <line x1="14" y1="22" x2="38" y2="22" opacity="0.3" />
      <line x1="14" y1="28" x2="32" y2="28" opacity="0.3" />
    </svg>);

}

// ---------- 6a. Reviews wall (alternative to BTS reel) -------------------
function ReviewsWall() {
  const reviews = [
  {
    who: "Daniel R.",
    where: "Google",
    device: "MBP 16\" M3 Pro",
    title: "Apple quoted £1,200. Done for £699.",
    body: "Cracked screen plus stuck pixels. Written quote in 20 minutes, fixed in a weekend. True Tone perfect.",
    tag: "Saved 41%"
  },
  {
    who: "Priya S.",
    where: "Trustpilot",
    device: "MBP 14\" M2",
    title: "Fixed what Apple said couldn't be.",
    body: "Genius Bar wrote it off. Microscope diagnosis found a single failed backlight IC. Two years on, still flawless.",
    tag: "Board-level"
  },
  {
    who: "Marcus L.",
    where: "Google",
    device: "MBP 16\" M1 Max",
    title: "Stage Light gone. Warranty honoured.",
    body: "Classic flex-cable failure. Re-did the work for free under warranty 9 months later. No quibbles.",
    tag: "Free re-work"
  },
  {
    who: "Henrietta W.",
    where: "Trustpilot",
    device: "MBP 16\" M3 Max",
    title: "Liquid damage. They returned my data.",
    body: "Apple wrote it off after a wine spill. Cleaned the board, replaced the flex, recovered every file.",
    tag: "Recovery"
  }];


  return (
    <section className="journey reviews-wall" id="reviews" style={{ backgroundColor: "rgb(229, 229, 229)" }}>
      <div className="container">
        <div className="reviews-wall-head">
          <div className="reviews-wall-head-text">
            <div className="journey-stage">
              <span className="journey-stage-num">·</span>
              Customer outcomes
            </div>
            <h2>The hard cases. Real customers.</h2>
          </div>
          <div className="reviews-wall-stat" style={{ padding: "14px 18px" }}>
            <div className="reviews-wall-stat-row">
              <div className="reviews-wall-stat-num">4.9</div>
              <div className="reviews-wall-stat-stars">
                {[0, 1, 2, 3, 4].map((i) =>
                <svg key={i} viewBox="0 0 14 14" width="16" height="16"><path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z" fill="#171717" /></svg>
                )}
              </div>
            </div>
            <div className="reviews-wall-stat-meta">
              <strong>1,247</strong> Google · <strong>892</strong> Trustpilot
            </div>
          </div>
        </div>

        <div className="reviews-wall-grid">
          {reviews.map((r, i) =>
          <article key={i} className="review-card">
              <div className="review-card-top">
                <span className="review-card-tag">{r.tag}</span>
                <div className="review-card-stars">
                  {[0, 1, 2, 3, 4].map((j) =>
                <svg key={j} viewBox="0 0 14 14" width="11" height="11">
                      <path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z" fill="#171717" />
                    </svg>
                )}
                </div>
              </div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <footer className="review-card-foot">
                <strong>{r.who}</strong>
                <span>{r.device} · {r.where}</span>
              </footer>
            </article>
          )}
        </div>
      </div>
    </section>);

}

// ---------- 6b. Engineering brief (alternative — "what we fix") ----------
function EngineeringBrief() {
  const cases = [
  {
    label: "01",
    title: "Backlight IC replacement",
    cat: "Logic board · Microsoldering",
    body: "When the Mac powers on but the display stays dark. Most shops swap the entire screen for £600+. We replace the failed IC for under £200.",
    stat: { num: "£430", label: "Average customer saving" }
  },
  {
    label: "02",
    title: "Stage Light effect (flex cable)",
    cat: "Display flex · Pre-A2442",
    body: "The known design flaw on 13/14/16\" MBPs. Microfractures in the silicone-bonded display flex. Apple replaces the lid; we replace the cable.",
    stat: { num: "£329", label: "vs £1,100 Apple lid swap" }
  },
  {
    label: "03",
    title: "Liquid-damaged T-CON board",
    cat: "Display PCB · Component-level",
    body: "Water tracks under the panel and corrodes the timing-control PCB — visible as colour shifts or ghosting. Recoverable at the board level. Most shops won't touch it.",
    stat: { num: "92%", label: "Recovery rate, last 200 jobs" }
  },
  {
    label: "04",
    title: "Logic-board fuse / short repair",
    cat: "Power rail · Diagnosis",
    body: "Black-screen Macs are often blown fuses on the SMC rail or backlight feed. £40 repairs Apple won't perform. We probe the rail and fix the actual fault.",
    stat: { num: "1–2 days", label: "Bench-to-pickup typical" }
  }];


  return (
    <section className="journey eng-brief" id="brief">
      <div className="container">
        <div className="eng-brief-head">
          <div className="journey-stage">
            <span className="journey-stage-num">·</span>
            On the bench
          </div>
          <h2>What we fix that other shops won't.</h2>
          <p className="journey-lede">
            Most repair shops have one move — swap the whole part. Component-level work needs microscopes,
            hot-air, and the experience to read a schematic. Here's what comes through our bench every week.
          </p>
        </div>

        <div className="eng-brief-grid">
          {cases.map((c, i) =>
          <div key={i} className="eng-brief-row">
              <div className="eng-brief-num">{c.label}</div>
              <div className="eng-brief-body">
                <div className="eng-brief-cat">{c.cat}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="eng-brief-stat">
                <div className="eng-brief-stat-num">{c.stat.num}</div>
                <div className="eng-brief-stat-label">{c.stat.label}</div>
              </div>
            </div>
          )}
        </div>

        <div className="eng-brief-foot">
          <div>
            <strong>Not on this list?</strong> If Apple has told you a Mac is beyond repair, send us the
            diagnostic. We've recovered machines from every major UK insurer and a handful of Apple Stores.
          </div>
          <a href="#" className="eng-brief-cta">Get a free diagnosis →</a>
        </div>
      </div>
    </section>);

}

// ---------- 6c. Behind the scenes reel (kept) ----------------------------
function BTSReel({ mode = "reel" }) {
  if (mode === "off") return null;
  if (mode === "reviews") return <ReviewsWall />;
  if (mode === "brief") return <EngineeringBrief />;
  const reels = [
  { tag: "Microsoldering", title: "Backlight IC swap, start to finish.", dur: "1:42", a: "#2a1f3e", b: "#0a0a0a" },
  { tag: "Diagnosis", title: "Pinpointing a logic-board short.", dur: "0:58", a: "#1f2e2a", b: "#0a0a0a" },
  { tag: "Recovery", title: "Liquid-damaged M3 brought back.", dur: "1:15", a: "#3e1f2a", b: "#0a0a0a" },
  { tag: "Calibration", title: "True Tone matched on a reference.", dur: "0:44", a: "#1f2a3e", b: "#0a0a0a" },
  { tag: "Stage Light", title: "The famous flex-cable fix.", dur: "1:08", a: "#2a3e1f", b: "#0a0a0a" },
  { tag: "Workshop", title: "Inside the Fitzrovia bench.", dur: "2:20", a: "#3e2a1f", b: "#0a0a0a" }];

  return (
    <section className="journey bts" id="bts">
      <div className="container">
        <div className="journey-stage">
          <span className="journey-stage-num">·</span>
          On the bench
        </div>
        <h2>Real repairs, filmed at the workshop.</h2>
        <p className="journey-lede">
          Six short films from the bench — the kind of work most shops won't show you. No staged shots,
          no royalty-free B-roll. Just the actual repair.
        </p>
        <div className="bts-reel">
          {reels.slice(0, mode === "minimal" ? 3 : 6).map((r, i) =>
          <div key={i} className="bts-card" style={{ ["--bg-a"]: r.a, ["--bg-b"]: r.b }}>
              <div className="bts-card-bg" />
              <div className="bts-card-frame">{r.tag} · placeholder</div>
              <div className="bts-card-overlay" />
              <div className="bts-card-play">
                <svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" /></svg>
              </div>
              <div className="bts-card-dur">{r.dur}</div>
              <div className="bts-card-info">
                <div className="bts-card-tag">{r.tag}</div>
                <div className="bts-card-title">{r.title}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ---------- 7. Warranty --------------------------------------------------
function WarrantyStrip() {
  const cards = [
  { num: "24", suffix: "mo", label: "Warranty period", body: "Against any functional defect of the assembly we fitted. Parts, labour, return shipping included." },
  { num: "0", suffix: "", label: "Excess on re-work", body: "If anything we touched fails inside warranty, we fix it free. No diagnostic fee, no goodwill bargaining." },
  { num: "48", suffix: "h", label: "Warranty turnaround", body: "Priority bench slot if a warrantied repair fails. Drop in or use our pre-paid courier label." },
  { num: "ISO", suffix: " 9001", label: "Workshop standard", body: "Repair log, torque spec, calibration reference for every job. Audit trail available on request." }];

  return (
    <section className="journey warranty-strip" id="warranty">
      <div className="container">
        <div className="journey-stage">
          <span className="journey-stage-num">04</span>
          Warranty & standards
        </div>
        <h2>Two years of cover. No asterisks.</h2>
        <p className="journey-lede">
          Apple's own out-of-warranty screen repair runs 90 days. Most London repair shops offer 6 or 12 months.
          We warrant every screen we fit for 24 months — parts, labour, and any re-work.
        </p>
        <div className="warranty-cards">
          {cards.map((c, i) =>
          <div key={i} className="warranty-card-pp">
              <div className="warranty-card-pp-num">
                {c.num}<small>{c.suffix}</small>
              </div>
              <div className="warranty-card-pp-label">{c.label}</div>
              <div className="warranty-card-pp-body">{c.body}</div>
            </div>
          )}
        </div>
        <div className="warranty-compare">
          <strong>For comparison:</strong> Apple's out-of-warranty repair = 90 days. Most London shops = 6 months.
          iCorrect = 24 months on every screen we fit.
        </div>
      </div>
    </section>);

}

// ---------- 8. Bottom configurator (placement option) --------------------
function BottomConfigurator() {
  return (
    <section className="product-config-bottom" id="bottom-config">
      <div className="container">
        <div className="product-config-bottom-head">
          <div className="journey-stage">
            <span className="journey-stage-num">05</span>
            Ready to book
          </div>
          <h2 style={{ marginBottom: 12 }}>Configure your repair.</h2>
          <p className="journey-lede" style={{ margin: "0 auto" }}>
            Three options. All transparent. Your final price is calculated below — no upsells at checkout.
          </p>
        </div>
        <ProductConfigurator />
      </div>
    </section>);

}

// ---------- 9. Product-specific FAQ --------------------------------------
function ProductFAQ() {
  const items = [
  { q: "How long does the MacBook 16\" M3 screen repair take?", a: "Most repairs are completed in 1–2 working days. If you drop in before 11am and the part is in stock, same-day is often possible. Add the £79 fast-turnaround option if you need a guaranteed 1-day return." },
  { q: "Are the screens genuine Apple parts?", a: "Yes. Every display we fit is a genuine pulled OEM panel — sourced from first-party Apple stock and recalibrated in-house against a reference sensor. We do not fit aftermarket panels on this model. True Tone, full brightness, and colour accuracy are preserved." },
  { q: "Will my data be safe during the repair?", a: "Yes. Screen repairs don't touch your drive. We run a GDPR-compliant workshop and sign an NDA on request for corporate clients. We never ask for your passcode unless post-repair testing requires it — and you can be present for that step." },
  { q: "What does the 2-year warranty cover?", a: "Functional defects of the display assembly we fitted, the labour, and any re-work needed during the period. Accidental damage isn't covered, but we'll always quote fairly for re-repairs. Apple's own warranty on out-of-warranty screen repair is 90 days, for comparison." },
  { q: "Do I need an appointment, or can I walk in?", a: "Either works. Walk in Mon–Fri 9–6 (Fri until 6pm) at 12 Margaret St, W1W 8JQ — opposite The London Palladium. Booking ahead via the configurator above reserves a workshop slot and is faster, especially for Stage Light or board-level work." },
  { q: "What if the issue isn't actually the screen?", a: "We do a free pre-diagnosis before quoting. If it turns out to be the backlight IC, a logic-board fuse, or T-CON corrosion, we'll fix the actual fault — usually for less than a full screen swap. We won't sell you a screen you don't need." },
  { q: "Can you collect from outside London?", a: "Yes. London-area customers can use our courier service (£20 same/next-day collection). UK-wide, we offer free pre-paid mail-in. International courier coming soon." },
  { q: "Will True Tone still work after the repair?", a: "Yes. We use a reference colorimeter to flash the True Tone profile onto every display before fitting. Aftermarket panels can't carry the True Tone calibration — that's why we don't fit them." }];

  const [open, setOpen] = React.useState(0);
  return (
    <section className="journey faq-journey" id="faqs">
      <div className="container faq-grid">
        <div className="faq-left">
          <div className="journey-stage">
            <span className="journey-stage-num">·</span>
            Frequently asked
          </div>
          <h2>Questions, answered honestly.</h2>
          <p className="journey-lede">
            Specific to MacBook 16" M3 screen repair. Speak to a human first? Call{" "}
            <a href="tel:+442070998517">+44 (0)207 099 8517</a> or drop into Fitzrovia.
          </p>
        </div>
        <div className="faq-right">
          {items.map((it, i) =>
          <div key={i} className={"faq-item" + (open === i ? " open" : "")}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {it.q}
                <span className="icon">+</span>
              </div>
              <div className="faq-a">{it.a}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

Object.assign(window, {
  ProductBreadcrumb, ProductHero, FailureSection, PartsSection,
  ProcessSection, BTSReel, ReviewsWall, EngineeringBrief,
  WarrantyStrip, BottomConfigurator, ProductFAQ
});