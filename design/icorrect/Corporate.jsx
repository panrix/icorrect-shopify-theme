// Corporate Services page — all section components (v2 — conversion-led)
// Structure: Pain → Proof → Solution → Process → Contact
// Voice: direct, empathetic to IT frustration, then confident on the fix.

function CorpBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Corporate Services</span>
      </div>
    </div>
  );
}

/* ── Hero — lead with the frustration ──────────────────────────────────── */
function CorpHero() {
  return (
    <section className="corp-hero">
      <div className="container">
        <div className="corp-hero-inner">
          <div className="mono-label">Corporate device repair</div>
          <h1>Apple quoted you £1,200. We'll fix it for £400.</h1>
          <p>Your fleet is down. Apple says it'll take a week — or suggests you buy new. We repair at component level, return devices in 1–3 days, and save you up to 65% per unit.</p>
          <div className="corp-hero-actions">
            <a href="#corp-contact" className="btn btn-dark btn-lg">Get a fleet quote →</a>
            <a href="#corp-cost" className="btn btn-lg" style={{ background: "rgba(0,0,0,0.04)", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }}>See the cost breakdown</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Pain cards — the three frustrations ───────────────────────────────── */
function CorpPain() {
  return (
    <section className="corp-pain">
      <div className="container">
        <div className="corp-pain-grid">
          <div className="corp-pain-card">
            <div className="pain-label">The wait</div>
            <h3>Apple turnaround is too long.</h3>
            <p>5–7 business days minimum. During peak, often longer. Every day a device is out, your team loses productivity and you're fielding complaints.</p>
            <div className="corp-pain-stat">
              <span className="num">1–3</span>
              <span className="unit">days · our turnaround</span>
            </div>
          </div>
          <div className="corp-pain-card">
            <div className="pain-label">The cost</div>
            <h3>Repairs cost nearly as much as new.</h3>
            <p>Apple's out-of-warranty pricing pushes you toward replacement. A logic board "repair" becomes a £1,200 unit swap. Your budget shouldn't work that way.</p>
            <div className="corp-pain-stat">
              <span className="num">50–65%</span>
              <span className="unit">less · typical saving</span>
            </div>
          </div>
          <div className="corp-pain-card">
            <div className="pain-label">The verdict</div>
            <h3>"Not repairable" — but it is.</h3>
            <p>Apple doesn't do component-level board work. When they say a device can't be fixed, they mean they won't fix it. We diagnose at circuit level and repair what others replace.</p>
            <div className="corp-pain-stat">
              <span className="num">85%+</span>
              <span className="unit">of "unrepairable" devices · fixed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Trust band — logos + stats ─────────────────────────────────────────── */
function CorpTrust() {
  return (
    <section className="corp-trust">
      <div className="container corp-trust-inner">
        <div className="corp-trust-logos">
          <span className="corp-trust-logos-label">Trusted by</span>
          <span className="corp-logo-item">Inditex</span>
          <span className="corp-logo-item">Panasonic</span>
          <span className="corp-logo-item">JLL</span>
          <span className="corp-logo-item">Prada</span>
        </div>
        <div className="corp-trust-stats">
          <div className="corp-trust-stat">
            <span className="num">40k+</span>
            <span className="label">Repairs</span>
          </div>
          <div className="corp-trust-stat">
            <span className="num">4.9</span>
            <span className="label">Rating</span>
          </div>
          <div className="corp-trust-stat">
            <span className="num">11</span>
            <span className="label">Years</span>
          </div>
          <div className="corp-trust-stat">
            <span className="num">2yr</span>
            <span className="label">Warranty</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Cost comparison (elevated, early) ─────────────────────────────────── */
function CorpCost() {
  return (
    <section id="corp-cost" className="corp-cost-section">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Cost comparison</div>
          <h2>Same device. Different outcome.</h2>
          <p>Based on a typical MacBook Pro logic board failure — the most common high-value corporate repair.</p>
        </div>
        <div className="corp-cost-layout">
          <div className="corp-cost-col them">
            <div className="corp-cost-col-head">
              <h3>Apple / manufacturer</h3>
              <span className="badge badge-ring">Their quote</span>
            </div>
            <div className="corp-cost-price">
              <span className="amount">£1,200+</span>
              <span className="context">Full unit swap — out of warranty</span>
            </div>
            <ul className="corp-cost-list">
              <li><span className="marker">—</span><span>Assembly replacement, not component repair</span></li>
              <li><span className="marker">—</span><span>Data wiped as standard procedure</span></li>
              <li><span className="marker">—</span><span>5–7 business day turnaround</span></li>
              <li><span className="marker">—</span><span>90-day warranty on replacement</span></li>
              <li><span className="marker">—</span><span>Often advised to buy new instead</span></li>
            </ul>
          </div>
          <div className="corp-cost-col us">
            <div className="corp-cost-col-head">
              <h3>iCorrect</h3>
              <span className="badge badge-dark">Board-level</span>
            </div>
            <div className="corp-cost-price">
              <span className="amount">£400–550</span>
              <span className="context">Targeted component repair</span>
            </div>
            <ul className="corp-cost-list">
              <li><span className="marker">✓</span><span>Faulty component identified and replaced</span></li>
              <li><span className="marker">✓</span><span>Data safely retained throughout</span></li>
              <li><span className="marker">✓</span><span>1–3 business day turnaround</span></li>
              <li><span className="marker">✓</span><span>2-year warranty on parts and labour</span></li>
              <li><span className="marker">✓</span><span>Devices Apple called "unrepairable" — fixed</span></li>
            </ul>
          </div>
        </div>
        <div className="corp-cost-savings">
          <span className="save-num">£650+</span>
          <span className="save-text">saved per device on average — across a fleet of 50 MacBooks, that's over £32,000 back in your IT budget.</span>
        </div>
      </div>
    </section>
  );
}

/* ── Process ───────────────────────────────────────────────────────────── */
function CorpProcess() {
  const steps = [
    { num: "01", title: "Intake", body: "Email, phone, or bulk submission. We log device details and reported faults against your account." },
    { num: "02", title: "Collection", body: "Nationwide insured courier, London express, or in-person drop-off at our Fitzrovia workshop." },
    { num: "03", title: "Diagnostic", body: "£49 board-level diagnosis. Written quote issued — deducted from repair cost if you proceed." },
    { num: "04", title: "Repair", body: "Component-level repair in-house. Devices cleaned and stress-tested before sign-off." },
    { num: "05", title: "Return", body: "Returned via courier with repair summary, QA report, and VAT invoice for your records." },
  ];
  return (
    <section id="corp-process" className="corp-process">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Service workflow</div>
          <h2>Intake to return in 1–3 days.</h2>
          <p>Every corporate repair follows the same documented path. Full audit trail, no surprises.</p>
        </div>
        <div className="corp-process-grid">
          {steps.map((s, i) => (
            <div key={i} className="corp-process-step">
              <div className="corp-process-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Device coverage ───────────────────────────────────────────────────── */
function CorpDevices() {
  const devices = [
    { title: "MacBook", body: "Pro and Air, Intel and Apple Silicon. Screen, battery, keyboard, and logic board repairs.", icon: "laptop" },
    { title: "iPhone", body: "All recent models. Screen, battery, charging port, camera, and board-level repairs.", icon: "phone" },
    { title: "iPad", body: "Pro, Air, and standard. Screen, battery, charging port, and logic board repairs.", icon: "tablet" },
    { title: "Apple Watch", body: "Selected models. Screen, battery, and liquid damage assessment.", icon: "watch" },
  ];
  return (
    <section className="corp-devices">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Fleet coverage</div>
          <h2>Every Apple device your team uses.</h2>
          <p>From common part swaps to component-level board work — we cover the full range.</p>
        </div>
        <div className="corp-devices-grid">
          {devices.map((d, i) => (
            <div key={i} className="corp-device-card">
              <div className="corp-device-icon"><CorpDeviceIcon type={d.icon} /></div>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              <a href="#corp-contact" className="corp-device-link">Enquire →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorpDeviceIcon({ type }) {
  const s = { width: 22, height: 22, viewBox: "0 0 22 22", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "laptop": return <svg {...s}><rect x="3" y="4" width="16" height="11" rx="1.5" /><path d="M1 18h20M8 15h6" /></svg>;
    case "phone": return <svg {...s}><rect x="6" y="2" width="10" height="18" rx="2" /><path d="M10 17h2" /></svg>;
    case "tablet": return <svg {...s}><rect x="4" y="2" width="14" height="18" rx="2" /><path d="M10 17h2" /></svg>;
    case "watch": return <svg {...s}><rect x="7" y="5" width="8" height="12" rx="3" /><path d="M9 2h4M9 20h4M7 8h8M7 14h8" /></svg>;
    default: return <svg {...s}><circle cx="11" cy="11" r="8" /></svg>;
  }
}

/* ── SLA tiers ─────────────────────────────────────────────────────────── */
function CorpSLA() {
  return (
    <section className="corp-sla">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Turnaround commitments</div>
          <h2>SLA tiers built for fleet operations.</h2>
          <p>Turnaround measured from device receipt to dispatch. Final timeline confirmed after diagnostic.</p>
        </div>
        <div className="corp-sla-tiers">
          <div className="corp-sla-card">
            <div className="corp-sla-card-head"><h3>Standard</h3></div>
            <p>Non-urgent repairs and planned maintenance cycles.</p>
            <dl className="corp-sla-meta">
              <div className="corp-sla-meta-row"><dt>Turnaround</dt><dd>3–5 business days</dd></div>
              <div className="corp-sla-meta-row"><dt>Best for</dt><dd>Spare pool devices</dd></div>
            </dl>
          </div>
          <div className="corp-sla-card featured">
            <div className="corp-sla-card-head">
              <h3>Priority</h3>
              <span className="corp-sla-badge corp-sla-badge-pop">Popular</span>
            </div>
            <p>Business-critical devices that need a fast return.</p>
            <dl className="corp-sla-meta">
              <div className="corp-sla-meta-row"><dt>Turnaround</dt><dd>1–2 business days</dd></div>
              <div className="corp-sla-meta-row"><dt>Best for</dt><dd>Active staff devices</dd></div>
            </dl>
          </div>
          <div className="corp-sla-card">
            <div className="corp-sla-card-head">
              <h3>Express VIP</h3>
              <span className="corp-sla-badge corp-sla-badge-rec">Fastest</span>
            </div>
            <p>Urgent — executive devices, live-event kit, zero-downtime roles.</p>
            <dl className="corp-sla-meta">
              <div className="corp-sla-meta-row"><dt>Turnaround</dt><dd>Same day</dd></div>
              <div className="corp-sla-meta-row"><dt>Note</dt><dd>Subject to availability</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Admin (trimmed — 6 cards, not 9) ──────────────────────────────────── */
function CorpAdmin() {
  const cards = [
    { title: "PO & invoicing", body: "Purchase orders accepted. VAT invoices issued per repair with serial number, fault description, and cost breakdown." },
    { title: "Payment terms", body: "Net-30 terms available for approved corporate clients. Consolidated invoicing by agreement." },
    { title: "Chain of custody", body: "Devices tracked by serial from receipt to return. Condition documented at intake and before dispatch." },
    { title: "Data handling", body: "Devices stay locked. Passcodes not required for most repairs. Data is never accessed unless unavoidable and agreed." },
    { title: "NDA available", body: "Non-disclosure agreements on request. We work with our standard NDA or your own." },
    { title: "Approval workflow", body: "No work without written approval. Quote must be confirmed before any repair proceeds." },
  ];
  return (
    <section className="corp-admin">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Administration</div>
          <h2>Built for procurement and IT ops.</h2>
          <p>Invoicing, data handling, and approvals structured for corporate requirements.</p>
        </div>
        <div className="corp-admin-grid">
          {cards.map((c, i) => (
            <div key={i} className="corp-admin-card">
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact (dark, with proof points) ─────────────────────────────────── */
function CorpContact() {
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", title: "", company: "",
    fleet: "", sla: "", notes: "",
  });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section id="corp-contact" className="corp-contact">
      <div className="container corp-contact-inner">
        <div className="corp-contact-text">
          <div className="mono-label">Get started</div>
          <h2>Stop overpaying. Start repairing.</h2>
          <p>Tell us your fleet size and we'll send a tailored proposal within one business day. No commitment, no hard sell.</p>
          <div className="corp-contact-email">
            Prefer email? <a href="mailto:support@icorrect.co.uk">support@icorrect.co.uk</a>
          </div>
          <div className="corp-contact-proof">
            <div className="corp-contact-proof-item"><span className="check">✓</span><span>Most clients onboarded within 24 hours</span></div>
            <div className="corp-contact-proof-item"><span className="check">✓</span><span>£49 diagnostic — deducted if you proceed</span></div>
            <div className="corp-contact-proof-item"><span className="check">✓</span><span>2-year warranty on every repair</span></div>
            <div className="corp-contact-proof-item"><span className="check">✓</span><span>No minimum fleet size</span></div>
          </div>
        </div>
        <form className="corp-form" onSubmit={(e) => e.preventDefault()}>
          <div className="corp-form-row">
            <div className="corp-form-field">
              <label>Full name</label>
              <input type="text" value={form.name} onChange={update("name")} placeholder="Jane Smith" />
            </div>
            <div className="corp-form-field">
              <label>Work email</label>
              <input type="email" value={form.email} onChange={update("email")} placeholder="jane@company.com" />
            </div>
          </div>
          <div className="corp-form-row">
            <div className="corp-form-field">
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+44 20 7099 8517" />
            </div>
            <div className="corp-form-field">
              <label>Job title</label>
              <input type="text" value={form.title} onChange={update("title")} placeholder="IT Manager" />
            </div>
          </div>
          <div className="corp-form-row">
            <div className="corp-form-field full">
              <label>Company</label>
              <input type="text" value={form.company} onChange={update("company")} placeholder="Acme Ltd" />
            </div>
          </div>
          <div className="corp-form-row">
            <div className="corp-form-field">
              <label>Fleet size</label>
              <select value={form.fleet} onChange={update("fleet")}>
                <option value="">Select</option>
                <option>1–20 devices</option>
                <option>21–50 devices</option>
                <option>51–100 devices</option>
                <option>101–500 devices</option>
                <option>500+ devices</option>
              </select>
            </div>
            <div className="corp-form-field">
              <label>Urgency</label>
              <select value={form.sla} onChange={update("sla")}>
                <option value="">Select</option>
                <option>Standard (3–5 days)</option>
                <option>Priority (1–2 days)</option>
                <option>Express VIP (Same day)</option>
              </select>
            </div>
          </div>
          <div className="corp-form-row">
            <div className="corp-form-field full">
              <label>Anything else?</label>
              <textarea rows="3" value={form.notes} onChange={update("notes")} placeholder="Device types, common faults, volume — whatever helps us quote accurately."></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-dark" style={{ background: "#fff", color: "#171717" }}>Get your fleet quote →</button>
        </form>
      </div>
    </section>
  );
}

Object.assign(window, {
  CorpBreadcrumb, CorpHero, CorpPain, CorpTrust, CorpCost,
  CorpProcess, CorpDifference: CorpCost, CorpDevices, CorpSLA,
  CorpAdmin, CorpContact, CorpDeviceIcon,
});
