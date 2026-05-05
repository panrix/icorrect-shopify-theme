// Content sections: Process, Parts, Warranty. Placed between product grid and FAQ.
// Vercel voice: confident, specific, quantified. No hype words.

function ProcessSection() {
  const steps = [
    {
      label: "01",
      title: "Free Pre-diagnosis",
      time: "30 min",
      body: "Walk in or ship your MacBook. We inspect the display, test backlight channels on the scope, and check for related damage — hinge flex, logic board shorts, Stage Light. You get a written quote before anything is opened.",
    },
    {
      label: "02",
      title: "Repair on the bench",
      time: "1–2 days",
      body: "Work happens in our Fitzrovia workshop — never sent out. Screen assemblies are replaced with the hinge and antenna transferred to the new unit; backlight IC replacements are done under a stereo microscope with lead-free solder.",
    },
    {
      label: "03",
      title: "Calibration & QA",
      time: "45 min",
      body: "Every repair is True-Tone calibrated against a reference sensor, colour-profile matched, and run through a 30-point QA pass — brightness uniformity, touch-bar response, keyboard, speakers, camera, Wi-Fi throughput.",
    },
    {
      label: "04",
      title: "Collection or courier",
      time: "Same day",
      body: "Collect in person (Mon–Fri) or opt for insured next-day courier back to you. Every repair ships with a printed QA report, the 2-year warranty card, and the original (or recycled) parts if you want them returned.",
    },
  ];

  return (
    <section className="info info-process">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Our process</div>
          <h2>What happens between "drop-off" and "fixed".</h2>
          <p>Four stages. No grey area. You'll know where your Mac is at every step — we send timestamped photos from the bench when the display comes off.</p>
        </div>
        <ol className="process-grid">
          {steps.map((s, i) => (
            <li key={i} className="process-step">
              <div className="process-step-head">
                <span className="process-step-num">{s.label}</span>
                <span className="process-step-time">{s.time}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PartsSection() {
  const facts = [
    { k: "Source", v: "Genuine Apple LCD & OLED assemblies — reclaimed from first-party stock, not aftermarket." },
    { k: "Calibration", v: "Every display factory-matched for colour temperature, gamma, and True Tone before it leaves the bench." },
    { k: "What's new", v: "LCD panel, backlight driver, digitizer cable, hinge covers, adhesive perimeter. Camera and antenna transferred." },
    { k: "What's recycled", v: "Your original LCD is stripped for recoverable components. You can request the carcass back at collection." },
  ];

  return (
    <section className="info info-parts">
      <div className="container info-parts-grid">
        <div className="info-parts-text">
          <div className="mono-label">Parts &amp; materials</div>
          <h2>Apple OEM displays, recalibrated in-house.</h2>
          <p>Aftermarket "compatible" screens cost less up front and fail inside 18 months — lower brightness, off-white point, dead True Tone. We don't fit them. Every screen we install is a genuine Apple assembly, tested against a reference panel, and warrantied for two years.</p>
          <dl className="info-parts-dl">
            {facts.map((f, i) => (
              <React.Fragment key={i}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
        <div className="info-parts-card">
          <div className="info-parts-card-top">
            <span className="mono-label" style={{ color: "#666" }}>Supply chain</span>
            <span className="info-badge">Verified</span>
          </div>
          <div className="info-parts-chain">
            <div className="info-parts-node">
              <div className="info-parts-node-title">Apple authorised stock</div>
              <div className="info-parts-node-body">First-party LCD / mini-LED assemblies, sealed.</div>
            </div>
            <div className="info-parts-arrow" aria-hidden="true">↓</div>
            <div className="info-parts-node">
              <div className="info-parts-node-title">Recalibration bench</div>
              <div className="info-parts-node-body">White-point, gamma, True Tone profile flashed.</div>
            </div>
            <div className="info-parts-arrow" aria-hidden="true">↓</div>
            <div className="info-parts-node">
              <div className="info-parts-node-title">Your MacBook</div>
              <div className="info-parts-node-body">Fitted, QA'd, returned with a 2-year warranty.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WarrantySection() {
  return (
    <section className="info info-warranty">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Warranty &amp; standards</div>
          <h2>Two years of cover. No asterisks.</h2>
          <p>Apple's own out-of-warranty screen repair runs 90 days. Most London repair shops offer 6 or 12 months. We warrant every MacBook screen we fit for 24 months — parts, labour, and any re-work.</p>
        </div>
        <div className="warranty-grid">
          <div className="warranty-card">
            <div className="warranty-num">24 mo</div>
            <div className="warranty-label">Warranty period</div>
            <div className="warranty-body">Against functional defect of the display assembly we fitted. Covers parts, labour, and return shipping.</div>
          </div>
          <div className="warranty-card">
            <div className="warranty-num">0</div>
            <div className="warranty-label">Excess on re-work</div>
            <div className="warranty-body">If anything we touched fails inside warranty, we fix it free. No diagnostic fee, no "goodwill" bargaining.</div>
          </div>
          <div className="warranty-card">
            <div className="warranty-num">48 h</div>
            <div className="warranty-label">Warranty turnaround</div>
            <div className="warranty-body">Priority bench slot if a warrantied repair fails. Drop in or use our pre-paid courier label.</div>
          </div>
          <div className="warranty-card">
            <div className="warranty-num">ISO 9001</div>
            <div className="warranty-label">Workshop standard</div>
            <div className="warranty-body">Repair log, torque spec, calibration reference for every job. Corporate clients get the audit trail on request.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ProcessSection, PartsSection, WarrantySection });
