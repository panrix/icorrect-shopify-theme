// Contact page — short and immediate: three ways in, then the workshop.
// Voice: senior technician. No forms — the wizard handles quotes; humans handle the rest.

function CTBreadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="iCorrect Homepage.html">Home</a>
        <span className="sep">/</span>
        <span>Contact</span>
      </div>
    </div>
  );
}

function CTHero() {
  return (
    <section className="ct-hero" data-screen-label="Contact hero">
      <div className="container">
        <div className="mono-label">Contact</div>
        <h1>Talk to the workshop.</h1>
        <p>No call centre, no ticket queue — you get the people at the bench. For a repair price, the <a href="iCorrect Homepage.html#wizard">60-second quote</a> is fastest; for everything else, we're here.</p>
      </div>
    </section>
  );
}

function CTWays() {
  return (
    <section className="ct-ways" data-screen-label="Three ways in">
      <div className="container ct-ways-grid">
        <div className="ct-way">
          <div className="ct-way-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          </div>
          <h2>Walk in</h2>
          <div className="ct-way-main">12 Margaret Street, Audley House<br />London W1W 8JQ</div>
          <p>Opposite The London Palladium. Drop-in diagnosis, no appointment needed — a technician will look at it while you're here.</p>
          <span className="ct-way-meta">Mon–Thu 9am–6pm · Fri 10am–6pm</span>
        </div>
        <a className="ct-way" href="tel:+442070998517">
          <div className="ct-way-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7a2 2 0 0 1 1.7 2.05z" />
            </svg>
          </div>
          <h2>Call</h2>
          <div className="ct-way-main">+44 (0)207 099 8517</div>
          <p>Straight to the workshop during opening hours. If we're mid-repair, leave a message — we call back the same day.</p>
          <span className="ct-way-meta">Mon–Thu 9am–6pm · Fri 10am–6pm</span>
        </a>
        <a className="ct-way" href="mailto:support@icorrect.co.uk">
          <div className="ct-way-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
          </div>
          <h2>Email</h2>
          <div className="ct-way-main">support@icorrect.co.uk</div>
          <p>Best for photos of the damage, courier queries, or anything you want in writing. A technician replies — not a template.</p>
          <span className="ct-way-meta">Reply within 1 working day</span>
        </a>
      </div>
    </section>
  );
}

function CTCorporate() {
  return (
    <section className="ct-corp" data-screen-label="Corporate strip">
      <div className="container">
        <div className="ct-corp-card">
          <div>
            <strong>Managing a fleet, or need an NDA first?</strong>
            <p>Priority turnaround, collection from your office, and GDPR-compliant data handling for businesses.</p>
          </div>
          <a href="Corporate Services.html" className="btn btn-light">Corporate services <span style={{fontFamily:"var(--font-mono)"}}>→</span></a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { CTBreadcrumb, CTHero, CTWays, CTCorporate });
