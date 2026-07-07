// Careers page — all section components
// Voice: professional, structured, direct. Speak to skilled technicians and ops talent.

function CareersBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Careers</span>
      </div>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
function CareersHero() {
  return (
    <section className="careers-hero">
      <div className="container">
        <div className="careers-hero-inner">
          <div className="mono-label">Careers at iCorrect</div>
          <h1>Repair what others replace.</h1>
          <p>We're a specialist Apple repair team in Fitzrovia, London — working at component level on devices the manufacturers write off. If you want to do precise, meaningful work with a growing team, we're hiring.</p>
          <div className="careers-hero-actions">
            <a href="#careers-apply" className="btn btn-dark btn-lg">Apply now →</a>
            <a href="#careers-roles" className="btn btn-lg" style={{ background: "rgba(0,0,0,0.04)", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }}>View open roles</a>
          </div>
        </div>
        <div className="careers-hero-stats">
          <div className="careers-hero-stat">
            <span className="num">5</span>
            <span className="label">Open roles</span>
          </div>
          <div className="careers-hero-stat">
            <span className="num">11</span>
            <span className="label">Years trading</span>
          </div>
          <div className="careers-hero-stat">
            <span className="num">40k+</span>
            <span className="label">Devices repaired</span>
          </div>
          <div className="careers-hero-stat">
            <span className="num">W1</span>
            <span className="label">Central London</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Why work here ─────────────────────────────────────────────────────── */
function CareersWhy() {
  const cards = [
    { title: "Competitive salary", body: "We pay well and review regularly. Skilled technicians and experienced operators are valued and compensated accordingly." },
    { title: "Continuous training", body: "Stay at the cutting edge. We invest in ongoing training — from advanced microsoldering techniques to new Apple silicon architectures." },
    { title: "Central London workshop", body: "Based in Fitzrovia, W1. Well-equipped workspace with professional-grade tooling, easy transport links, and a good team around you." },
    { title: "Flexible hours", body: "Flexible scheduling for technical roles. We focus on output and quality, not clock-watching." },
    { title: "Team culture", body: "Small team, low politics. Regular team events, direct communication, and a shared commitment to doing precise, high-quality work." },
    { title: "Growing company", body: "We're scaling — expanding our corporate client base, building new services, and hiring across the board. Early joiners shape how we grow." },
  ];
  return (
    <section className="careers-why">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Why iCorrect</div>
          <h2>What we offer.</h2>
          <p>We're building a team of specialists who take pride in doing work that most repair shops can't. Here's what that looks like day to day.</p>
        </div>
        <div className="careers-why-grid">
          {cards.map((c, i) => (
            <div key={i} className="careers-why-card">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Open roles ────────────────────────────────────────────────────────── */
const ROLES = [
  {
    title: "Advanced Microelectronics Technician",
    type: "Full-time",
    location: "Fitzrovia, London",
    dept: "Technical",
    responsibilities: [
      "Diagnose and repair faults at component level on Apple logic boards",
      "Use schematics, boardview data, and diagnostic tools to isolate failures",
      "Perform BGA rework, microsoldering, and reballing on current and legacy boards",
      "Document repair outcomes and maintain quality records",
      "Contribute to internal training and knowledge sharing",
    ],
    requirements: [
      "Proven experience with board-level repair and microsoldering",
      "Ability to read schematics and use diagnostic equipment (multimeter, oscilloscope, thermal camera)",
      "Familiarity with Apple Mac and iPhone logic board architectures",
      "Attention to detail and a methodical approach to fault-finding",
      "Ability to work independently and manage a repair queue",
    ],
  },
  {
    title: "MacBook Repair Technician",
    type: "Full-time",
    location: "Fitzrovia, London",
    dept: "Technical",
    responsibilities: [
      "Carry out MacBook repairs — screens, batteries, keyboards, trackpads, and ports",
      "Run diagnostics and triage incoming devices accurately",
      "Escalate board-level faults to the microelectronics team with clear notes",
      "Perform post-repair quality checks and stress testing",
      "Maintain a clean, organised workspace and follow intake procedures",
    ],
    requirements: [
      "Experience with MacBook hardware repair (Pro and Air, Retina era onward)",
      "Comfortable disassembling and reassembling Apple portables to a high standard",
      "Basic understanding of macOS diagnostics and Apple hardware test tools",
      "Reliable, detail-oriented, and comfortable working to turnaround targets",
      "Training provided on advanced techniques — willingness to learn is essential",
    ],
  },
  {
    title: "Operations Manager",
    type: "Full-time",
    location: "Fitzrovia, London",
    dept: "Operations",
    responsibilities: [
      "Oversee day-to-day workshop operations — intake, repair queue, dispatch, and logistics",
      "Manage and develop the operations and logistics team",
      "Coordinate with corporate clients on SLAs, bulk submissions, and reporting",
      "Improve internal processes — tracking, communication, and turnaround efficiency",
      "Report on KPIs including turnaround time, repair volume, and client satisfaction",
    ],
    requirements: [
      "Experience in operations or service management, ideally in a technical or repair environment",
      "Strong organisational skills and the ability to manage competing priorities",
      "Comfortable with CRM and ticketing tools — experience with repair-specific platforms a plus",
      "Clear communicator who can work with technicians, clients, and suppliers",
      "A proactive mindset — you see problems before they become bottlenecks",
    ],
  },
  {
    title: "Operations Assistant",
    type: "Full-time",
    location: "Fitzrovia, London",
    dept: "Operations",
    responsibilities: [
      "Support the operations manager with daily workshop coordination",
      "Log devices on intake — record serial numbers, faults, and client details",
      "Communicate with clients on repair status, quotes, and collection",
      "Prepare devices for dispatch and coordinate with courier partners",
      "Maintain accurate records across all active repairs",
    ],
    requirements: [
      "Organised, reliable, and comfortable in a fast-paced environment",
      "Good written and verbal communication",
      "Basic familiarity with Apple products — technical knowledge a bonus, not required",
      "Experience in admin, customer service, or logistics preferred",
      "Keen to learn and grow into a broader operations role",
    ],
  },
  {
    title: "Logistics Assistant",
    type: "Full-time",
    location: "Fitzrovia, London",
    dept: "Operations",
    responsibilities: [
      "Manage inbound and outbound shipments — booking couriers, printing labels, tracking parcels",
      "Coordinate with corporate clients on collection and return scheduling",
      "Ensure devices are securely packaged for transit",
      "Maintain the parts and consumables inventory — reorder when needed",
      "Support the operations team with ad-hoc tasks as the business grows",
    ],
    requirements: [
      "Experience in logistics, warehouse, or dispatch — even if informal",
      "Comfortable with tracking systems and spreadsheets",
      "Physically able to handle parcels and keep a stockroom organised",
      "Reliable and punctual — logistics runs on timing",
      "A team player who communicates clearly when things change",
    ],
  },
];

function CareersRoles() {
  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <section id="careers-roles" className="careers-roles">
      <div className="container">
        <div className="info-head">
          <div className="mono-label">Open positions</div>
          <h2>Current roles.</h2>
          <p>We're hiring across technical and operations. Every role is based at our Fitzrovia workshop in central London.</p>
        </div>
        <div className="careers-roles-list">
          {ROLES.map((role, i) => (
            <div key={i} className={`careers-role-card${openIndex === i ? " open" : ""}`}>
              <div className="careers-role-header" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                <div className="careers-role-header-left">
                  <h3>{role.title}</h3>
                  <div className="careers-role-meta">
                    <span className="careers-role-tag">{role.type}</span>
                    <span className="careers-role-tag">{role.dept}</span>
                    <span className="careers-role-tag">{role.location}</span>
                  </div>
                </div>
                <div className="careers-role-chevron">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 5l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div className="careers-role-body">
                <div className="careers-role-body-inner">
                  <div className="careers-role-section">
                    <h4>What you'll do</h4>
                    <ul>
                      {role.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="careers-role-section">
                    <h4>What we're looking for</h4>
                    <ul>
                      {role.requirements.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                    <a href="#careers-apply" className="careers-role-apply-link">Apply for this role →</a>
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

/* ── Application form ──────────────────────────────────────────────────── */
function CareersApply() {
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", role: "", cover: "",
  });
  const [fileName, setFileName] = React.useState("");
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFileName(f.name);
  };

  return (
    <section id="careers-apply" className="careers-apply">
      <div className="container careers-apply-inner">
        <div className="careers-apply-text">
          <div className="mono-label">Apply</div>
          <h2>Interested? Let's talk.</h2>
          <p>Send us your details and we'll be in touch within a few working days. No cover letter required — but if you want to tell us why you're a good fit, we'll read every word.</p>
          <div className="careers-apply-email">
            Prefer email? <a href="mailto:careers@icorrect.co.uk">careers@icorrect.co.uk</a>
          </div>
          <div className="careers-apply-proof">
            <div className="careers-apply-proof-item"><span className="check">✓</span><span>We respond to every application</span></div>
            <div className="careers-apply-proof-item"><span className="check">✓</span><span>Interview within 5 working days</span></div>
            <div className="careers-apply-proof-item"><span className="check">✓</span><span>No recruitment agencies</span></div>
            <div className="careers-apply-proof-item"><span className="check">✓</span><span>Training provided for the right candidate</span></div>
          </div>
        </div>
        <form className="careers-form" onSubmit={(e) => e.preventDefault()}>
          <div className="careers-form-row">
            <div className="careers-form-field">
              <label>Full name</label>
              <input type="text" value={form.name} onChange={update("name")} placeholder="Alex Johnson" />
            </div>
            <div className="careers-form-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update("email")} placeholder="alex@email.com" />
            </div>
          </div>
          <div className="careers-form-row">
            <div className="careers-form-field">
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+44 7700 000000" />
            </div>
            <div className="careers-form-field">
              <label>Role</label>
              <select value={form.role} onChange={update("role")}>
                <option value="">Select a role</option>
                {ROLES.map((r, i) => <option key={i} value={r.title}>{r.title}</option>)}
              </select>
            </div>
          </div>
          <div className="careers-form-row">
            <div className="careers-form-field full">
              <label>CV / Resume</label>
              <div className={`careers-cv-upload${fileName ? " has-file" : ""}`}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />
                <div className="upload-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12V3M4 7l4-4 4 4" />
                    <path d="M2 13h12" />
                  </svg>
                </div>
                <span className="upload-text">{fileName || "Drop your CV here or click to browse"}</span>
                <span className="upload-hint">PDF or Word · 5MB max</span>
              </div>
            </div>
          </div>
          <div className="careers-form-row">
            <div className="careers-form-field full">
              <label>Cover note (optional)</label>
              <textarea rows="4" value={form.cover} onChange={update("cover")} placeholder="Tell us a bit about yourself — your experience, what interests you about iCorrect, or anything else you'd like us to know."></textarea>
            </div>
          </div>
          <button type="submit" className="btn">Submit application →</button>
        </form>
      </div>
    </section>
  );
}

Object.assign(window, {
  CareersBreadcrumb, CareersHero, CareersWhy,
  CareersRoles, CareersApply, ROLES,
});
