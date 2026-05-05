// === Product page configurator ===========================================
// Mirrors the collection-page wizard's service options (turnaround, battery,
// delivery) on a single product. Lives in three placements via Tweaks.

const TURNAROUND_OPTIONS = [
  { id: "standard", title: "Standard", meta: "2–3 working days", price: 0, included: true },
  { id: "fast",     title: "Fast",     meta: "1 working day",    price: 79 },
];

const BATTERY_OPTIONS = [
  { id: "good", title: "It's good",  meta: "No replacement needed", price: 0, included: true },
  { id: "bad",  title: "Not good",   meta: "Replace it",            price: 249 },
];

const DELIVERY_OPTIONS = [
  { id: "walkin",  title: "Walk in",      meta: "Drop off in store",        price: 0,  included: true },
  { id: "courier", title: "Collect & deliver", meta: "London door-to-door", price: 20, badge: "Popular" },
  { id: "mailin",  title: "Mail-in",      meta: "Pre-paid label · UK-wide", price: 0,  included: true },
];

function useConfig() {
  const initial = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("icorrect-product-config");
      if (raw) return JSON.parse(raw);
    } catch {}
    return { turnaround: "standard", battery: "good", delivery: "walkin", postcode: "" };
  }, []);
  const [state, setState] = React.useState(initial);
  React.useEffect(() => {
    try { localStorage.setItem("icorrect-product-config", JSON.stringify(state)); } catch {}
  }, [state]);

  const setKey = (k, v) => setState(s => ({ ...s, [k]: v }));

  const basePrice = 699;
  const tOpt = TURNAROUND_OPTIONS.find(o => o.id === state.turnaround) || TURNAROUND_OPTIONS[0];
  const bOpt = BATTERY_OPTIONS.find(o => o.id === state.battery) || BATTERY_OPTIONS[0];
  const dOpt = DELIVERY_OPTIONS.find(o => o.id === state.delivery) || DELIVERY_OPTIONS[0];
  const total = basePrice + tOpt.price + bOpt.price + dOpt.price;

  return { state, setKey, basePrice, total, tOpt, bOpt, dOpt };
}

function ProductConfigurator({ compact = false, onPrimary }) {
  const cfg = useConfig();
  const [showCourier, setShowCourier] = React.useState(false);

  const isLondon = (pc) => {
    if (!pc) return null;
    const trimmed = pc.trim().toUpperCase().replace(/\s+/g, "");
    if (trimmed.length < 2) return null;
    const area = trimmed.match(/^[A-Z]+/)?.[0];
    return ["E","EC","N","NW","SE","SW","W","WC"].includes(area);
  };

  const courierStatus = cfg.state.delivery === "courier"
    ? (cfg.state.postcode ? isLondon(cfg.state.postcode) : null)
    : null;

  return (
    <div className="product-config-card">
      <div className="product-config-head">
        <div>
          <div className="product-config-title">Configure your repair</div>
          <div className="product-config-sub">Genuine display · 2-yr warranty · Free quote</div>
        </div>
        <div className="product-config-price-wrap">
          <div className="product-config-price-label">Base</div>
          <div className="product-config-price">£{cfg.basePrice}<small>before options</small></div>
        </div>
      </div>

      <ConfigSection
        label="Repair turnaround"
        help="When you need it back"
        options={TURNAROUND_OPTIONS}
        selected={cfg.state.turnaround}
        onSelect={v => cfg.setKey("turnaround", v)}
      />
      <ConfigSection
        label="How is your battery life?"
        help="Add only if needed"
        options={BATTERY_OPTIONS}
        selected={cfg.state.battery}
        onSelect={v => cfg.setKey("battery", v)}
      />
      <div className="config-section">
        <div className="config-section-head">
          <div className="config-section-label">How do we get the device?</div>
          <div className="config-section-help">3 options</div>
        </div>
        <div className="config-grid-2" style={{gridTemplateColumns: compact ? "1fr 1fr" : "1fr 1fr 1fr"}}>
          {DELIVERY_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              className={"config-card" + (cfg.state.delivery === o.id ? " active" : "")}
              onClick={() => cfg.setKey("delivery", o.id)}
            >
              {o.badge && <span className="config-card-badge">{o.badge}</span>}
              <span className="config-card-title">{o.title}</span>
              <span className="config-card-meta">
                {o.meta}{" "}
                {o.included ? <strong>Free</strong> : <strong>+£{o.price}</strong>}
              </span>
            </button>
          ))}
        </div>

        {cfg.state.delivery === "walkin" && (
          <div className="config-walkin-info">
            <strong>12 Margaret St, W1W 8JQ</strong> · Mon–Fri · Walk in for free pre-diagnosis or pre-book a slot at checkout.
          </div>
        )}
        {cfg.state.delivery === "courier" && (
          <>
            <div className="config-courier-input">
              <input
                placeholder="Collection postcode"
                value={cfg.state.postcode}
                onChange={e => cfg.setKey("postcode", e.target.value)}
              />
              <input
                placeholder="Address line 1"
                onChange={() => {}}
              />
            </div>
            {courierStatus === true && (
              <div className="config-courier-msg ok">✓ London postcode — same/next-day collection.</div>
            )}
            {courierStatus === false && (
              <div className="config-courier-msg warn">Outside London — we'll switch you to free mail-in.</div>
            )}
          </>
        )}
        {cfg.state.delivery === "mailin" && (
          <div className="config-walkin-info">
            We'll email a <strong>pre-paid label</strong> after checkout. Insured both ways. UK-wide.
          </div>
        )}
      </div>

      <div className="config-total">
        <div>
          <div className="config-total-label">Total</div>
          <div style={{fontSize:11,color:"#808080",marginTop:2,fontFamily:"var(--font-mono)"}}>
            £{cfg.basePrice} repair{cfg.tOpt.price>0?` + £${cfg.tOpt.price} fast`:""}{cfg.bOpt.price>0?` + £${cfg.bOpt.price} battery`:""}{cfg.dOpt.price>0?` + £${cfg.dOpt.price} courier`:""}
          </div>
        </div>
        <div className="config-total-price">£{cfg.total}</div>
      </div>

      <button
        type="button"
        className="config-cta"
        onClick={() => { onPrimary && onPrimary(); }}
      >
        Book now · £{cfg.total}
        <span className="config-cta-arrow">→</span>
      </button>
      <p className="config-fineprint">Secure checkout · No payment until repair confirmed.</p>
    </div>
  );
}

function ConfigSection({ label, help, options, selected, onSelect }) {
  return (
    <div className="config-section">
      <div className="config-section-head">
        <div className="config-section-label">{label}</div>
        {help && <div className="config-section-help">{help}</div>}
      </div>
      <div className="config-grid-2">
        {options.map(o => (
          <button
            key={o.id}
            type="button"
            className={"config-card" + (selected === o.id ? " active" : "")}
            onClick={() => onSelect(o.id)}
          >
            <span className="config-card-title">{o.title}</span>
            <span className="config-card-meta">
              {o.meta}{" "}
              {o.included
                ? <strong>Included</strong>
                : <strong>+£{o.price}</strong>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// === Floating pill =======================================================

function FloatingPill({ onBookNow }) {
  const cfg = useConfig();
  const [visible, setVisible] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      // Only show after the user has scrolled past the hero's configurator (or hero itself)
      const hero = document.getElementById("product-hero");
      if (!hero) { setVisible(window.scrollY > 600); return; }
      const rect = hero.getBoundingClientRect();
      setVisible(rect.bottom < 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="float-pill-wrap">
        <button
          type="button"
          className={"float-pill" + (visible && !open ? " visible" : "")}
          onClick={() => setOpen(true)}
          aria-label="Open configurator"
        >
          <span className="float-pill-meta">
            <span className="float-pill-label">Your repair</span>
            <span className="float-pill-price">£{cfg.total}</span>
          </span>
          <span className="float-pill-cta">
            Book now
            <span className="float-pill-cta-arrow">→</span>
          </span>
        </button>
      </div>

      {open && (
        <>
          <div className="float-pill-backdrop" onClick={() => setOpen(false)} />
          <div className="float-mini">
            <div className="float-mini-head">
              <div>
                <div className="float-mini-title">Your repair</div>
                <div className="float-mini-sub">Adjust options or jump to checkout</div>
              </div>
              <button className="float-mini-close" onClick={() => setOpen(false)} aria-label="Close" />
            </div>
            <ProductConfigurator compact onPrimary={() => { setOpen(false); onBookNow && onBookNow(); }} />
          </div>
        </>
      )}
    </>
  );
}

Object.assign(window, { ProductConfigurator, FloatingPill, useConfig });
