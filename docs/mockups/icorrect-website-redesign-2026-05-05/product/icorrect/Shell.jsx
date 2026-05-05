// Shell: Nav, Trust Band, Identify helper, Product grid, FAQ, Location, Footer

function Nav() {
  return (
    <nav className="icnav">
      <div className="container icnav-inner">
        <a className="icnav-logo" href="#">iCorrect</a>
        <div className="icnav-links">
          <a href="#">Repairs</a>
          <a href="#">Corporate</a>
          <a href="#">Why us</a>
          <a href="#">How it works</a>
          <a href="#">About</a>
        </div>
      </div>
    </nav>
  );
}

function Breadcrumb() {
  return (
    <div className="container">
      <div className="crumbs">
        <a href="#">Home</a>
        <span className="sep">/</span>
        <a href="#">Repairs</a>
        <span className="sep">/</span>
        <span>MacBook Screen</span>
      </div>
    </div>
  );
}

function TrustBand({ reviewCount = 719, rating = 4.8 }) {
  return (
    <section className="trust-band">
      <div className="container">
        <ul className="trust-band-inner" role="list">
          <li className="trust-item trust-item-rating">
            <div className="trust-rating-num">{rating}</div>
            <div className="trust-rating-meta">
              <Stars rating={rating} />
              <span>{reviewCount} Google reviews</span>
            </div>
          </li>
          <li className="trust-item">
            <div className="trust-icon"><AppleLogo /></div>
            <div className="trust-label">
              <strong>Apple parts</strong>
              <span>Calibrated in-house</span>
            </div>
          </li>
          <li className="trust-item">
            <div className="trust-icon"><ChipIcon /></div>
            <div className="trust-label">
              <strong>Microsoldering</strong>
              <span>Board-level repairs</span>
            </div>
          </li>
          <li className="trust-item">
            <div className="trust-icon"><ShieldIcon /></div>
            <div className="trust-label">
              <strong>2-yr warranty</strong>
              <span>Double the standard</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      {[0,1,2,3,4].map(i => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14" style={{flexShrink:0}}>
            <defs><linearGradient id={`g${i}`}><stop offset={`${fill*100}%`} stopColor="#f5a623"/><stop offset={`${fill*100}%`} stopColor="#e5e5e5"/></linearGradient></defs>
            <path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z" fill={`url(#g${i})`} />
          </svg>
        );
      })}
    </div>
  );
}

function AppleLogo() {
  // Generic display icon — explicitly NOT an Apple bitten-apple silhouette
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><rect x="2.5" y="3.5" width="17" height="11" rx="1.5"/><path d="M8 18.5h6M11 14.5v4"/></svg>;
}
function ChipIcon() {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="6" width="10" height="10" rx="1.5"/><path d="M8.5 4.5V2M11 4.5V2M13.5 4.5V2M8.5 20V17.5M11 20V17.5M13.5 20V17.5M4.5 8.5H2M4.5 11H2M4.5 13.5H2M20 8.5H17.5M20 11H17.5M20 13.5H17.5"/></svg>;
}
function ShieldIcon() {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M11 2.5l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6l7-2.5z"/><path d="M8 11l2.2 2.2L14.5 9"/></svg>;
}

function IdentifyStrip() {
  const [input, setInput] = React.useState("");
  return (
    <section className="identify-strip">
      <div className="container identify-strip-inner">
        <div className="identify-strip-icon">A2442</div>
        <div className="identify-strip-text">
          <strong>Don't know which MacBook you have?</strong>
          <span>Type the model code from the underside — or jump to the visual guide.</span>
        </div>
        <form className="identify-strip-form" onSubmit={e => { e.preventDefault(); const el = document.getElementById("identify"); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); }}>
          <input placeholder="e.g. A2442" value={input} onChange={e => setInput(e.target.value)} />
          <button type="submit">Identify</button>
        </form>
      </div>
    </section>
  );
}

function IdentifyHelper() {
  const [input, setInput] = React.useState("");
  return (
    <section id="identify" className="identify">
      <div className="container identify-grid">
        <div className="identify-visual">
          <div className="identify-visual-inner">
            <div className="identify-plate">
              <div className="identify-plate-line">Designed by Apple in California.</div>
              <div className="identify-plate-line muted">Assembled in China</div>
              <div className="identify-plate-line highlight">Model <span className="hl">A2442</span></div>
              <div className="identify-plate-line muted small">EMC 3650 · 61W USB-C</div>
            </div>
            <div className="mono-label identify-hint">← Look on the underside</div>
          </div>
        </div>
        <div className="identify-text">
          <div className="mono-label">Not sure which model you have?</div>
          <h2>Find your model number in 5 seconds.</h2>
          <p>Flip your MacBook over. Look for a four-character code starting with "A" — it's printed in small grey type near the hinge. Tell us that code and we'll match the repair exactly.</p>
          <form className="identify-form" onSubmit={e => e.preventDefault()}>
            <input placeholder="e.g. A2442" value={input} onChange={e => setInput(e.target.value)} />
            <button type="submit" className="btn btn-dark">Identify</button>
          </form>
          <div className="identify-foot">Or <a href="#wizard">browse models in the wizard →</a></div>
        </div>
      </div>
    </section>
  );
}

const GRID_ITEMS = [
  { name: "MacBook Pro 14\" (M3) Screen Repair", price: "£449", year: "2023–24" },
  { name: "MacBook Pro 16\" (M3) Screen Repair", price: "£599", year: "2023–24" },
  { name: "MacBook Pro 14\" (M1/M2) Screen Repair", price: "£419", year: "2021–23" },
  { name: "MacBook Pro 16\" (M1/M2) Screen Repair", price: "£549", year: "2021–23" },
  { name: "MacBook Air 15\" Screen Repair", price: "£379", year: "2023–24" },
  { name: "MacBook Air 13\" (M-series) Screen Repair", price: "£329", year: "2020–24" },
  { name: "MacBook Pro 13\" Touch Bar Screen Repair", price: "£389", year: "2016–22" },
  { name: "MacBook Air 13\" (Retina) Screen Repair", price: "£299", year: "2018–20" },
  { name: "Stage Light Effect Repair (MBP 13/14/16)", price: "from £329", year: "Diagnosis" },
];

function ProductGrid() {
  return (
    <section className="product-grid">
      <div className="container">
        <div className="pg-head">
          <div>
            <div className="mono-label">All repairs</div>
            <h2>Browse every MacBook screen repair we offer.</h2>
          </div>
          <div className="pg-foot-note">9 services · Genuine Apple parts · 2-year warranty</div>
        </div>
        <div className="pg">
          {GRID_ITEMS.map((item, i) => (
            <a key={i} className="pg-item" href="#">
              <div className="pg-thumb"><DeviceGlyph /></div>
              <div className="pg-name">{item.name}</div>
              <div className="pg-price"><span style={{color:"#171717"}}>{item.price}</span> · {item.year}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceGlyph() {
  return <svg width="64" height="44" viewBox="0 0 64 44" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="8" y="4" width="48" height="30" rx="2"/><rect x="2" y="34" width="60" height="4" rx="1"/><line x1="28" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="1.2"/></svg>;
}

function FAQ() {
  const items = [
    { q: "How long does a MacBook screen repair take?", a: "Most screen repairs are completed in 1–2 working days. If you drop in before 11am and we have the part in stock, same-day turnaround is often possible. Walk-ins welcome at our Fitzrovia workshop — no appointment needed for diagnosis." },
    { q: "Are the replacement screens genuine Apple parts?", a: "Yes. We source original Apple displays, reclaim them where possible, and recalibrate every unit in-house to original factory standards. That means True Tone, full brightness, and colour accuracy are preserved — no downgrade in quality versus an Apple Store repair." },
    { q: "Is my data safe during the repair?", a: "Completely. Screen repairs don't touch your drive, but we run a GDPR-compliant workshop and sign an NDA on request for corporate clients. We never ask for your passcode unless post-repair testing requires it — and you can be present for that step." },
    { q: "What does the 2-year warranty cover?", a: "Every MacBook screen repair carries a full 2-year warranty against functional defects — double what most shops offer. The warranty covers the replaced display, the labour, and any re-work needed during that period. Accidental damage isn't covered, but we'll always quote fairly for re-repairs." },
    { q: "Do I need to book, or can I just walk in?", a: "Either works. Walk in Mon–Fri 9am–6pm (Fri until 6pm, closed weekends) for a free diagnosis and written quote before any work starts. Booking ahead via the wizard reserves a workshop slot and is usually faster — particularly for Stage Light repairs or logic-board work." },
    { q: "You're microsoldering specialists — what does that mean?", a: "Most repair shops swap whole components. We work at the board level: individual chips, resistors, and solder joints under a microscope. That's why other repair shops (and insurers) send their tougher cases to us — backlight IC replacements, liquid damage recovery, and the infamous MBP Stage Light fix are routine for our team." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section className="faq">
      <div className="container faq-grid">
        <div className="faq-left">
          <div className="mono-label">Frequently asked</div>
          <h2>Questions, answered honestly.</h2>
          <p>If you want to speak to a human first, call <a href="tel:+442070998517">+44 (0)207 099 8517</a> or drop in — we're opposite The London Palladium.</p>
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

function Location() {
  return (
    <section className="location">
      <div className="container location-grid">
        <div>
          <div className="mono-label">Visit the workshop</div>
          <h2>Fitzrovia, London.</h2>
          <p>Opposite The London Palladium. Drop-in diagnosis, no appointment needed.</p>
          <dl className="location-dl">
            <dt>Address</dt><dd>12 Margaret Street<br/>Audley House<br/>London W1W 8JQ</dd>
            <dt>Phone</dt><dd><a href="tel:+442070998517">+44 (0)207 099 8517</a></dd>
            <dt>Email</dt><dd><a href="mailto:support@icorrect.co.uk">support@icorrect.co.uk</a></dd>
            <dt>Hours</dt><dd>Mon–Thu 9am–6pm<br/>Fri 10am–6pm · Sat/Sun closed</dd>
          </dl>
        </div>
        <div className="location-map">
          <div className="location-map-pin">
            <div className="location-map-pin-card">
              <strong>iCorrect</strong>
              <span>12 Margaret St, London W1W 8JQ</span>
              <div className="location-map-pin-rating">★ 4.8 · 719 reviews</div>
            </div>
            <div className="location-map-marker">📍</div>
          </div>
          <div className="location-map-bg">
            {[...Array(20)].map((_, i) => <div key={i} className="map-street" style={{top: `${(i*11) % 100}%`, left: `${(i*17) % 100}%`, width: `${40 + (i*13) % 60}%`, transform: `rotate(${(i*31) % 180}deg)`}} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="icfooter">
      <div className="container icfooter-inner">
        <div>
          <div className="icnav-logo" style={{color: "#fff"}}>iCorrect</div>
          <div className="icfooter-tag">Apple repair specialists · Fitzrovia, London</div>
        </div>
        <div className="icfooter-cols">
          <div>
            <div className="mono-label" style={{color:"#808080"}}>Repairs</div>
            <a href="#">MacBook</a><a href="#">iPhone</a><a href="#">iPad</a><a href="#">Apple Watch</a>
          </div>
          <div>
            <div className="mono-label" style={{color:"#808080"}}>Company</div>
            <a href="#">Why us</a><a href="#">Corporate</a><a href="#">How it works</a><a href="#">Contact</a>
          </div>
          <div>
            <div className="mono-label" style={{color:"#808080"}}>Legal</div>
            <a href="#">Warranty</a><a href="#">Privacy</a><a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="container icfooter-base">
        <span>© 2026 iCorrect Ltd. Not affiliated with Apple Inc.</span>
        <span>Company No. 09392844 · VAT GB 203495788</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Breadcrumb, TrustBand, IdentifyStrip, IdentifyHelper, ProductGrid, FAQ, Location, Footer });
