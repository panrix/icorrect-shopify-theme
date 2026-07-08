// MacBook Repairs pillar page — all section components
// Deep SEO pillar: inform → prove → quote → convert
// Voice: authoritative but accessible. Explain the technical simply.

function MBRBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Repairs</span>
        <span className="sep">/</span>
        <span>MacBook Repairs</span>
      </div>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
function MBRHero({ accentColor = "#6B9E8A", accentStyle = "filled" }) {
  const diagBtnStyle = accentStyle === "filled"
    ? { background: accentColor, color: "#fff", boxShadow: "none" }
    : { background: "transparent", color: accentColor, boxShadow: `0 0 0 2px ${accentColor}` };

  const goToQuote = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("mbr:set-mode", { detail: "quote" }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  };

  const goToDiagnose = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("mbr:set-mode", { detail: "diagnose" }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  };

  return (
    <section className="mbr-hero">
      <div className="container">
        <div className="mbr-hero-inner">
          <div className="mono-label">Fitzrovia, London · Walk-ins welcome</div>
          <h1>MacBook Repair Specialists.</h1>
          <p>Board-level diagnostics and component repairs for every MacBook model. Screens, batteries, liquid damage, keyboards, charging faults, and logic board failures — repaired to original factory standards with genuine Apple parts and a 2-year warranty.</p>
          <div className="mbr-hero-actions">
            <a href="#mbr-wizard" className="btn btn-dark btn-lg" onClick={goToQuote}>Get an instant quote →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Repair types ──────────────────────────────────────────────────────── */
const REPAIR_TYPES = [
  {
    title: "Screen repair",
    body: "Cracked, dead, flickering, or Stage Light effect. We replace the display assembly using genuine Apple panels, recalibrated in-house. True Tone, full brightness, original colour accuracy preserved.",
    price: "from £299",
    icon: "screen",
    faultId: "screen",
  },
  {
    title: "Battery replacement",
    body: "Swollen, degraded, or not holding charge. We remove the old cell safely, fit a genuine replacement, and recalibrate the battery management system so macOS reports accurate health.",
    price: "from £179",
    icon: "battery",
    faultId: "battery",
  },
  {
    title: "Liquid damage",
    body: "Spills, condensation, or submersion. We strip the board, ultrasonically clean every component, then diagnose and replace corroded ICs at component level. The faster you bring it in, the more we can save.",
    price: "from £249",
    icon: "liquid",
    faultId: "water",
  },
  {
    title: "Power diagnostics",
    body: "Won't turn on, random shutdowns, or no charge. We trace the power delivery path from the USB-C port through the charging IC, power rails, and CPU power management to find the exact failure point.",
    price: "£49",
    icon: "power",
    faultId: "battery",
  },
  {
    title: "Keyboard repair",
    body: "Dead keys, sticky butterfly mechanism, or full keyboard failure. We repair or replace the top case assembly and test every key. Backlight functionality fully restored.",
    price: "from £199",
    icon: "keyboard",
    faultId: "keyboard",
  },
  {
    title: "Trackpad repair",
    body: "Unresponsive, phantom clicks, or physical damage. Often caused by battery swelling pressing against the trackpad. We replace the trackpad and address the root cause.",
    price: "from £149",
    icon: "trackpad",
    faultId: "keyboard",
  },
  {
    title: "Charging port",
    body: "USB-C port not recognising cables, intermittent charging, or physical damage. We replace the port assembly or, where possible, repair the individual port at board level.",
    price: "from £129",
    icon: "port",
    faultId: "battery",
  },
];

function MBRTypeIcon({ type }) {
  const s = { width: 22, height: 22, viewBox: "0 0 22 22", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "screen": return <svg {...s}><rect x="2" y="3" width="18" height="13" rx="1.5" /><path d="M7 19h8M11 16v3" /><path d="M6 8l4 4M14 8l-4 4" strokeOpacity="0.4" /></svg>;
    case "battery": return <svg {...s}><rect x="4" y="7" width="14" height="8" rx="1.5" /><path d="M19 10v2" /><path d="M7 11h4M9 9v4" /></svg>;
    case "liquid": return <svg {...s}><path d="M11 3c-3 4.5-6 7.5-6 10.5a6 6 0 0012 0c0-3-3-6-6-10.5z" /></svg>;
    case "power": return <svg {...s}><path d="M13 2L7 12h4l-2 8 8-12h-5l1-6z" /></svg>;
    case "keyboard": return <svg {...s}><rect x="2" y="6" width="18" height="10" rx="1.5" /><path d="M6 13h10M6 10h2M10 10h2M14 10h2" /></svg>;
    case "trackpad": return <svg {...s}><rect x="4" y="3" width="14" height="16" rx="2" /><path d="M4 13h14" /><circle cx="11" cy="8" r="2" /></svg>;
    case "port": return <svg {...s}><rect x="6" y="8" width="10" height="6" rx="2" /><path d="M3 11h3M16 11h3M9 8V5M13 8V5" /></svg>;
    default: return <svg {...s}><circle cx="11" cy="11" r="8" /></svg>;
  }
}

function MBRTypes() {
  const goQuote = (faultId) => {
    window.dispatchEvent(new CustomEvent("mbr:quote", { detail: { faultId } }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  };
  const goDiagnose = () => {
    window.dispatchEvent(new CustomEvent("mbr:set-mode", { detail: "diagnose" }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  };

  return (
    <section id="mbr-types" className="mbr-types">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Repair services</div>
          <h2>Every MacBook repair we offer.</h2>
          <p>From common part swaps to advanced board-level microsoldering. All repairs use genuine Apple parts and carry a 2-year warranty. Pick one to get an instant price.</p>
        </div>
        <div className="mbr-types-grid">
          {REPAIR_TYPES.map((r, i) => (
            <button key={i} type="button" className="mbr-type-card" onClick={() => goQuote(r.faultId)}>
              <div className="mbr-type-icon"><MBRTypeIcon type={r.icon} /></div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <div className="mbr-type-footer">
                <div className="mbr-type-price">{r.price}</div>
                <span className="mbr-type-cta">Quote this repair →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Specialist section — narrative, not comparison ─────────────────────── */
function MBRSpecialist() {
  return (
    <section className="mbr-specialist">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">What board-level repair means</div>
          <h2>We find the failed chip. Not the failed board.</h2>
        </div>

        {/* The story */}
        <div className="mbr-spec-story">
          <div className="mbr-spec-scenario">
            <div className="mbr-spec-scenario-label">A real scenario</div>
            <p className="mbr-spec-scenario-text">Your MacBook Pro won't turn on. You take it to Apple. They run their diagnostic, tell you the logic board has failed, and quote you <strong>£1,000+</strong> for a full board replacement. Your data? Gone — it's on the old board.</p>
            <p className="mbr-spec-scenario-text">You bring it to us. We put the board under a thermal camera and find a single failed charging IC — a chip smaller than your fingernail. We remove it, solder a replacement, and your MacBook powers on. Same board. Same data. <strong>£400–500</strong>.</p>
          </div>

          <div className="mbr-spec-why">
            <div className="mbr-spec-why-item">
              <div className="mbr-spec-why-num">50–60%</div>
              <div className="mbr-spec-why-label">less than Apple's quote</div>
              <p>Because we replace a £4 component, not a £600 board. The saving scales across every logic board repair we do.</p>
            </div>
            <div className="mbr-spec-why-item">
              <div className="mbr-spec-why-num">85%+</div>
              <div className="mbr-spec-why-label">of "unrepairable" devices fixed</div>
              <p>When Apple or another shop says it can't be repaired, they mean they can't repair it at their level. We work at circuit level — schematics, boardview, multimeter, thermal imaging.</p>
            </div>
            <div className="mbr-spec-why-item">
              <div className="mbr-spec-why-num">100%</div>
              <div className="mbr-spec-why-label">data preserved</div>
              <p>We repair the board your data lives on. No swap, no wipe, no migration. Your files, settings, and accounts stay exactly where they are.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Case study — real liquid damage recovery ──────────────────────────── */
function MBRCaseStudy({ recovery = true }) {
  return (
    <section className={"mbr-case" + (recovery ? " mbr-case--recovery" : "")}>
      <div className="container mbr-case-inner">
        <div className="mbr-case-story">
          <div className="mbr-case-kicker">
            <span className="mono-label">Real repair · Liquid damage</span>
            {recovery && <span className="mbr-case-recovered"><span className="mbr-case-recovered-dot" />Recovered</span>}
          </div>
          <h2>A MacBook Pro full of Coke. Apple said replace it. We saved it.</h2>
          <p>A client came to us after spilling a full glass of Coca-Cola across their MacBook Pro 14". They'd taken it to Apple first. <strong>Apple's verdict: logic board replacement, £1,100+, data wiped, 7–10 days.</strong></p>
          <p>They brought it to us the next morning. We stripped the board within an hour, ran it through ultrasonic cleaning to dissolve the sugar residue and corrosion, then inspected every IC under magnification. Three components had corroded — the charging IC, a power MOSFET, and a USB-C retimer. We replaced all three at board level.</p>
          <p><strong>The MacBook powered on with all data intact.</strong> Total repair time: 2 days. Total cost: a fraction of Apple's quote. The client left a 5-star Google review.</p>

          <div className="mbr-case-urgency">
            <div className="mbr-case-urgency-icon">⏱</div>
            <div className="mbr-case-urgency-text">
              <strong>With liquid damage, speed is everything.</strong> Corrosion starts within hours. The faster you get your MacBook to us, the more components we can save — and the cheaper the repair. Don't dry it out and wait. Bring it in.
            </div>
          </div>
        </div>

        <div className="mbr-case-proof">
          <div className="mbr-case-review">
            <div className="mbr-case-review-stars">★★★★★</div>
            <blockquote>"Spilled an entire Coke on my MacBook Pro. Apple told me it was beyond repair and quoted over a thousand pounds for a replacement board. iCorrect had it back to me in two days, fully working, with all my data. Genuinely can't recommend them enough."</blockquote>
            <div className="mbr-case-review-author">Verified client</div>
            <div className="mbr-case-review-source">
              <span>★</span> Google Review
            </div>
          </div>

          <div className="mbr-case-breakdown">
            <div className="mono-label">Repair breakdown</div>
            <div className="mbr-case-breakdown-row">
              <span className="mbr-case-breakdown-label">Diagnostic &amp; ultrasonic clean</span>
              <span className="mbr-case-breakdown-value">£49</span>
            </div>
            <div className="mbr-case-breakdown-row">
              <span className="mbr-case-breakdown-label">Charging IC replacement</span>
              <span className="mbr-case-breakdown-value">£180</span>
            </div>
            <div className="mbr-case-breakdown-row">
              <span className="mbr-case-breakdown-label">Power MOSFET + USB-C retimer</span>
              <span className="mbr-case-breakdown-value">£220</span>
            </div>
            <div className="mbr-case-breakdown-row">
              <span className="mbr-case-breakdown-label">Apple's quote</span>
              <span className="mbr-case-breakdown-value" style={{ color: "#808080", textDecoration: "line-through" }}>£1,100+</span>
            </div>
            <div className="mbr-case-breakdown-row">
              <span className="mbr-case-breakdown-label">iCorrect total</span>
              <span className="mbr-case-breakdown-value">£449</span>
            </div>
          </div>

          <a href="#mbr-wizard" className="btn btn-dark btn-lg mbr-case-cta" style={{ textAlign: "center" }}>Spilled something? Get help now →</a>
        </div>
      </div>
    </section>
  );
}

/* ── Common faults explained (deep SEO content) ────────────────────────── */
const FAULTS = [
  {
    title: "Cracked or broken screen",
    subtitle: "The most common MacBook repair — and the one most often overpriced.",
    whatHappens: "A MacBook display is a layered sandwich: the outer glass, the LCD panel, the backlight sheet, and a metal frame. When the glass cracks, it usually damages the LCD beneath it too — which is why you'll see black patches, colour bleeding, or lines alongside the crack. The display still technically works, but the damage spreads over time as the cracked glass flexes.",
    howWeRepair: "We replace the entire display assembly — glass, LCD, and backlight — as a single calibrated unit. Every replacement is a genuine Apple panel, recalibrated in-house so True Tone, auto-brightness, and full colour accuracy work exactly as they did from factory. The repair takes 1–2 hours once the part is matched.",
    signs: ["Visible cracks or shatter marks", "Black patches or colour bleeding", "Lines across part of the screen", "Touch Bar still works but main display is damaged"],
  },
  {
    title: "Stage Light effect",
    subtitle: "A backlight cable failure unique to MacBook Pro models — Apple's most notorious design flaw.",
    whatHappens: "On MacBook Pro models from 2016–2020, the backlight flex cable runs over the display hinge. Every time you open and close the lid, the cable flexes. Over thousands of cycles, the cable fatigues and the backlight LEDs start failing from the bottom up. You'll see bright spotlights at the base of the screen, or the backlight dies completely while the image is still faintly visible.",
    howWeRepair: "We don't replace the whole display for this. We repair the backlight circuit at board level — replacing the failed flex cable and, where needed, the backlight driver IC on the display's T-CON board. This costs significantly less than a full screen replacement and solves the root cause, not just the symptom.",
    signs: ["Bright spots or 'stage lights' along the bottom edge", "Backlight works intermittently when the lid is at certain angles", "Screen goes completely dark but image is faintly visible with a torch", "Progressively worsening over weeks"],
  },
  {
    title: "Battery degradation and swelling",
    subtitle: "Every lithium battery degrades — but swelling is a safety issue that needs immediate attention.",
    whatHappens: "MacBook batteries are lithium-polymer cells glued into the top case. Over 2–4 years of charge cycles, the chemistry degrades and capacity drops. This is normal. What's not normal is swelling — when the internal layers of the cell produce gas and the battery physically expands. A swollen battery pushes against the trackpad (causing phantom clicks), warps the bottom case, and in extreme cases can crack the display from internal pressure.",
    howWeRepair: "We safely remove the old battery (including dissolving the adhesive Apple uses to bond it to the chassis), fit a genuine replacement cell, and recalibrate the battery management system. Post-repair, macOS will report accurate cycle count and health data. If the swelling has damaged the trackpad or case, we'll quote that separately before proceeding.",
    signs: ["macOS reports 'Service Recommended' or 'Replace Now'", "Battery drains in under 2 hours", "Trackpad feels stiff or clicks on its own", "Bottom case is visibly warped or doesn't sit flat", "Less than 80% maximum capacity in System Report"],
  },
  {
    title: "Liquid damage",
    subtitle: "The repair most shops refuse — and the one where speed matters most.",
    whatHappens: "When liquid reaches the logic board, it doesn't just short-circuit components — it starts a chemical reaction. Water, coffee, and wine are all slightly acidic or conductive. Within hours, copper traces on the board begin corroding. The longer you wait, the more components fail. This is why a MacBook that 'worked fine after drying out' can die days later — the corrosion was progressing invisibly.",
    howWeRepair: "Step one is always ultrasonic cleaning — we fully strip the board and submerge it in a specialised cleaning solution that dissolves corrosion without damaging components. Then we inspect every IC and trace under magnification. Failed components are replaced individually at board level. We've recovered MacBooks that were fully submerged — the key is how quickly you get it to us and how thorough the cleaning is.",
    signs: ["Visible liquid residue around keyboard or ports", "Won't power on at all after a spill", "Powers on but has erratic behaviour — random shutdowns, missing ports, fans spinning constantly", "Keyboard or trackpad partially unresponsive", "Worked fine after drying, then failed days later"],
  },
  {
    title: "Power and charging faults",
    subtitle: "Won't turn on, won't charge, or shuts down randomly — the diagnostic starts at the USB-C port and works inward.",
    whatHappens: "MacBook power delivery is a chain: USB-C port → charging IC (CD3217) → power management unit → individual voltage rails that feed the CPU, GPU, RAM, and SSD. A failure at any point in this chain can look like 'it won't turn on.' The USB-C port might be physically damaged. The charging IC might have failed from a surge. A power rail might be shorted by a failed component elsewhere on the board. Without board-level diagnostic tools, most shops can only guess.",
    howWeRepair: "We start with a £49 diagnostic that traces the power path systematically — measuring voltage at each stage with a multimeter and checking for shorts with a thermal camera. Once we've isolated the failure point, we replace the specific component. Common repairs include USB-C port replacement, charging IC (CD3217) swap, and PPBUS voltage rail fault repair. Most power faults are fixable at board level for a fraction of the cost of a new logic board.",
    signs: ["Completely dead — no light, no fan, no chime", "Charges intermittently or only on one USB-C port", "Shows charging icon but battery percentage doesn't increase", "Random shutdowns under load", "Fan spins briefly then everything dies"],
  },
  {
    title: "Keyboard failure",
    subtitle: "From the infamous butterfly mechanism to flex cable faults — and why Apple's solution is often overkill.",
    whatHappens: "MacBook keyboards fail in two main ways. The butterfly-mechanism keyboards (2016–2019) are notorious for keys that stick, double-type, or stop working when debris gets under the keycap. The mechanism is so thin that a single grain of dust can prevent the key from actuating. On newer models, keyboard failures are more often caused by liquid ingress or a failed flex cable connecting the keyboard to the logic board.",
    howWeRepair: "For butterfly keyboards, we can sometimes clean and restore individual keys — but if multiple keys are affected, a top case replacement is more reliable. For flex cable failures, we repair at board level where possible. Apple's standard fix is to replace the entire top case (keyboard, battery, trackpad, and speakers as one unit) — which is expensive and unnecessary when only the keyboard is at fault. We isolate the actual failure and repair only what's broken.",
    signs: ["Keys that stick, repeat, or don't register", "Entire rows of keys unresponsive", "Keyboard works intermittently — worse after the laptop warms up", "Backlight on but keys don't type"],
  },
];

function MBRFaults() {
  const [openIndex, setOpenIndex] = React.useState(0);
  return (
    <section className="mbr-faults">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Fault guides</div>
          <h2>Common MacBook faults — explained simply.</h2>
          <p>Not sure what's wrong with your MacBook? Here's what each symptom usually means, how the repair actually works, and what to look for. Written by our technicians, not a marketing team.</p>
        </div>
        <div className="mbr-faults-list">
          {FAULTS.map((f, i) => (
            <div key={i} className={`mbr-fault-card${openIndex === i ? " open" : ""}`}>
              <div className="mbr-fault-header" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                <div className="mbr-fault-header-left">
                  <h3>{f.title}</h3>
                  <div className="mbr-fault-sub">{f.subtitle}</div>
                </div>
                <div className="mbr-fault-chevron">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5l4 4 4-4" /></svg>
                </div>
              </div>
              <div className="mbr-fault-body">
                <div className="mbr-fault-body-inner">
                  <div className="mbr-fault-section">
                    <h4>What's happening</h4>
                    <p>{f.whatHappens}</p>
                  </div>
                  <div className="mbr-fault-section">
                    <h4>How we repair it</h4>
                    <p>{f.howWeRepair}</p>
                    <h4 style={{ marginTop: 20 }}>Signs to look for</h4>
                    <ul>{f.signs.map((s, j) => <li key={j}>{s}</li>)}</ul>
                    <a href="#mbr-wizard" className="mbr-fault-cta">Get a quote for this repair →</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Videos removed — add back when real footage is ready ──────────────── */

/* ── Process strip ─────────────────────────────────────────────────────── */
function MBRProcess() {
  const steps = [
    { num: "01", title: "Diagnosis", body: "£49 board-level inspection. We identify the exact fault and give you a written quote — no obligation. Deducted from repair cost if you proceed." },
    { num: "02", title: "Quote approval", body: "You see the price before any work starts. Approve by email, phone, or in person. No surprises, no hidden fees." },
    { num: "03", title: "Repair", body: "Component-level work in our Fitzrovia workshop. Genuine Apple parts, microsoldering where needed, and full post-repair testing." },
    { num: "04", title: "Collection", body: "Walk in and collect, or we ship back via tracked courier. Every repair leaves with a 2-year warranty and a clear repair summary." },
  ];
  return (
    <section className="mbr-process">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">How it works</div>
          <h2>Drop off to collection in 48 hours.</h2>
          <p>Walk in or send your MacBook by post. Every repair follows the same documented process.</p>
        </div>
        <div className="mbr-process-steps">
          {steps.map((s, i) => (
            <div key={i} className="mbr-process-card">
              <div className="mbr-process-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Quote wizard section — straight V3 wizard (device known, repair-first) ── */
function MBRWizardSection() {
  const [mode, setMode] = React.useState("quote");       // "quote" | "diagnose"
  const [startFaultId, setStartFaultId] = React.useState(null);

  // Hero buttons + repair-type cards drive this section.
  //  • "mbr:quote" {faultId}  → quote wizard pre-filled to that repair
  //  • "mbr:set-mode" detail  → "quote" (generic) or "diagnose"
  React.useEffect(() => {
    const onMode = (e) => {
      if (e.detail === "diagnose") setMode("diagnose");
      else { setStartFaultId(null); setMode("quote"); }
    };
    const onQuote = (e) => {
      setStartFaultId(e.detail?.faultId || null);
      setMode("quote");
    };
    window.addEventListener("mbr:set-mode", onMode);
    window.addEventListener("mbr:quote", onQuote);
    return () => {
      window.removeEventListener("mbr:set-mode", onMode);
      window.removeEventListener("mbr:quote", onQuote);
    };
  }, []);

  const scrollHere = () => {
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  };

  return (
    <section id="mbr-wizard" className="mbr-wizard-section">
      <div className="container">
        {mode === "quote" && (
          <>
            <div className="info-head">
              <div className="mono-label">Instant quote · 60 seconds</div>
              <h2>Get your instant MacBook quote.</h2>
              <p>Choose the repair, pick your model, and see your price — genuine Apple parts, a 2-year warranty, and no obligation to book.</p>
            </div>
            <div className="mbr-wizard-mount">
              <QuoteWizard key={startFaultId || "all"} startDevice="macbook" startFaultId={startFaultId} />
            </div>
          </>
        )}

        {mode === "diagnose" && (
          <div className="mbr-diagnose-compact">
            <button className="mbr-wizard-back" onClick={() => { setMode("quote"); scrollHere(); }}>← Back to instant quote</button>
            <div className="mbr-diagnose-flow">
              <div className="info-head" style={{ marginTop: 8 }}>
                <div className="mono-label">Guided diagnostic</div>
                <h2>Let's figure out what's wrong.</h2>
                <p>Answer a few quick questions and we'll narrow down the fault, suggest the most likely repair, and give you a price — or book you a £49 in-person diagnostic.</p>
              </div>
              <MBRDiagnoseSteps />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Simplified diagnostic flow for the MacBook page ───────────────────── */
function MBRDiagnoseSteps() {
  const faults = [
    { id: "screen", label: "Screen / Display", detail: "Cracked, dead, flickering, lines, Stage Light effect", icon: "screen" },
    { id: "power", label: "Power / Battery", detail: "Won't turn on, won't charge, drains fast, shutdowns, swelling", icon: "power" },
    { id: "liquid", label: "Liquid damage", detail: "Spill, submersion, corrosion — any liquid contact", icon: "liquid" },
    { id: "keyboard", label: "Keyboard / Trackpad", detail: "Dead keys, sticky keys, phantom clicks, unresponsive", icon: "keyboard" },
    { id: "port", label: "Charging / Ports", detail: "USB-C not working, intermittent charging, no data", icon: "port" },
    { id: "other", label: "Something else", detail: "Fan noise, overheating, slow performance, other", icon: "other" },
  ];

  const [selected, setSelected] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <div className="mbr-diag-result">
        <div className="mbr-diag-result-icon">✓</div>
        <h3>We'd recommend a £49 board-level diagnostic.</h3>
        <p>Based on what you've described, an in-person inspection will give us the exact fault and a fixed-price quote. The £49 diagnostic is a one-off charge — you approve the repair quote before any work starts.</p>
        <div className="mbr-diag-result-actions">
          <a href="#mbr-wizard" className="btn btn-dark btn-lg">Book diagnostic · £49 →</a>
          <a href="tel:+442070998517" className="btn btn-lg" style={{ background: "rgba(0,0,0,0.04)", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }}>Call us instead</a>
        </div>
        <p className="mbr-diag-result-note">Or walk in — Mon–Thu 9am–6pm, Fri 10am–6pm, 12 Margaret Street, Fitzrovia W1W 8JQ.</p>
      </div>
    );
  }

  return (
    <div className="mbr-diag-faults">
      <div className="mbr-diag-label">What's happening with your MacBook?</div>
      <div className="mbr-diag-grid">
        {faults.map(f => (
          <button
            key={f.id}
            className={"mbr-diag-fault" + (selected === f.id ? " active" : "")}
            onClick={() => setSelected(f.id)}
          >
            <div className="mbr-diag-fault-icon"><MBRTypeIcon type={f.icon} /></div>
            <div className="mbr-diag-fault-text">
              <strong>{f.label}</strong>
              <span>{f.detail}</span>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <button className="btn btn-dark btn-lg" style={{ width: "100%", marginTop: 16 }} onClick={() => setSubmitted(true)}>
          {selected === "other" ? "Get diagnostic recommendation →" : `Continue with ${faults.find(f => f.id === selected)?.label} →`}
        </button>
      )}
    </div>
  );
}

/* ── FAQ (comprehensive, SEO-targeted) ─────────────────────────────────── */
function MBRFAQ() {
  const items = [
    { q: "How much does a MacBook repair cost?", a: "It depends on the model and fault. Screen repairs start from £299, battery replacements from £179, and liquid damage recovery from £249. Power diagnostics are £49, which is deducted from the repair cost if you proceed. Use our quote wizard for an instant price, or walk in for a free initial assessment." },
    { q: "How long does a MacBook repair take?", a: "Most repairs are completed in 1–2 working days. Screen and battery replacements are often same-day if you drop in before 11am and we have the part in stock. Complex board-level work — liquid damage, power faults — typically takes 2–3 days. We'll confirm the timeline after diagnosis." },
    { q: "Do you use genuine Apple parts?", a: "Yes. We source original Apple displays, batteries, and components. Every screen is recalibrated in-house to preserve True Tone, full brightness, and colour accuracy. We don't use third-party panels or aftermarket batteries." },
    { q: "Is my data safe during repair?", a: "Yes. Most MacBook repairs don't require access to your data. We never ask for your passcode unless post-repair testing requires it — and you're welcome to be present for that step. We run a GDPR-compliant workshop and offer NDAs for corporate clients." },
    { q: "What does the 2-year warranty cover?", a: "Every repair carries a 2-year warranty covering the replaced component, the labour, and any rework needed. If the same fault recurs within the warranty period, we'll repair it at no charge. Accidental damage isn't covered, but we'll always quote fairly for re-repairs." },
    { q: "Can you fix a MacBook that Apple said is unrepairable?", a: "In most cases, yes. Apple doesn't perform component-level board repairs — when they say a device 'can't be repaired,' they mean they won't repair it at that level. We diagnose at circuit level and regularly fix devices that Apple, insurers, and other repair shops have written off. Over 85% of 'unrepairable' MacBooks we receive are successfully repaired." },
    { q: "Do I need to book, or can I walk in?", a: "Either works. Walk in Mon–Thu 9am–6pm, Fri 10am–6pm at our Fitzrovia workshop — no appointment needed for diagnosis. Booking ahead via the quote wizard reserves a workshop slot and is usually faster for board-level work." },
    { q: "Can you repair MacBooks bought outside the UK?", a: "Yes. MacBook hardware is the same worldwide. We repair devices regardless of where they were purchased. If you're visiting London, you can drop in for a same-day repair — we're in Fitzrovia, W1." },
    { q: "Do you offer corporate or fleet repair services?", a: "Yes. We work with companies including Inditex, Panasonic, JLL, and Prada. Corporate accounts get SLA-backed turnarounds, PO acceptance, consolidated invoicing, and dedicated account management. See our Corporate Services page for details." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section className="faq">
      <div className="container faq-grid">
        <div className="faq-left">
          <div className="mono-label">Frequently asked</div>
          <h2>MacBook repair questions, answered.</h2>
          <p>If your question isn't here, call <a href="tel:+442070998517">+44 (0)207 099 8517</a> or drop into our Fitzrovia workshop.</p>
        </div>
        <div className="faq-right">
          {items.map((it, i) => (
            <div key={i} className={"faq-item" + (open === i ? " open" : "")}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {it.q}
                <span className="icon">+</span>
              </div>
              <div className="faq-a">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  MBRBreadcrumb, MBRHero, MBRTypes, MBRSpecialist, MBRCaseStudy,
  MBRFaults, MBRProcess, MBRWizardSection, MBRFAQ,
  MBRTypeIcon, REPAIR_TYPES, FAULTS,
});
