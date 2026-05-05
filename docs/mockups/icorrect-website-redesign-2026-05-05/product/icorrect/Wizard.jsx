// === iCorrect wizard — pre-scoped to MacBook / Screen on collection page ===
// Step 1: Model (grouped by family) · Step 2: Issue · Step 3: Quote

const MAC_FAMILIES = [
  { id: "pro",  name: "MacBook Pro",  detail: "13\" · 14\" · 16\"" },
  { id: "air",  name: "MacBook Air",  detail: "13\" · 15\"" },
  { id: "old",  name: "Older / Unsure", detail: "Pre-2018 or not listed" },
];

const MAC_MODELS = [
  { id: "mbp-14-m3", family: "pro", size: 14, name: "MacBook Pro 14\"", detail: "M3 / M3 Pro / M3 Max · 2023–24", price: 449 },
  { id: "mbp-16-m3", family: "pro", size: 16, name: "MacBook Pro 16\"", detail: "M3 Pro / M3 Max · 2023–24", price: 599 },
  { id: "mbp-14-m2", family: "pro", size: 14, name: "MacBook Pro 14\"", detail: "M1 Pro / M1 Max / M2 · 2021–23", price: 419 },
  { id: "mbp-16-m2", family: "pro", size: 16, name: "MacBook Pro 16\"", detail: "M1 Pro / M1 Max / M2 · 2021–23", price: 549 },
  { id: "mbp-13",    family: "pro", size: 13, name: "MacBook Pro 13\"", detail: "Touch Bar · 2016–22",          price: 389 },
  { id: "mba-15",    family: "air", size: 15, name: "MacBook Air 15\"", detail: "M2 / M3 · 2023–24",            price: 379 },
  { id: "mba-13-m",  family: "air", size: 13, name: "MacBook Air 13\"", detail: "M1 / M2 / M3 · 2020–24",       price: 329 },
  { id: "mba-13-i",  family: "air", size: 13, name: "MacBook Air 13\"", detail: "Intel / Retina · 2018–20",     price: 299 },
  { id: "older",     family: "old", size: null, name: "Older MacBook",  detail: "Pre-2018 · requires diagnosis", price: null },
];

const ISSUES = [
  { id: "cracked",  label: "Cracked glass",       detail: "Visible cracks or shatter" },
  { id: "dead",     label: "Dead / black screen", detail: "No backlight or won't wake" },
  { id: "flicker",  label: "Flickering",          detail: "Lines, artifacts, or flashing" },
  { id: "ghost",    label: "Stage light effect",  detail: "Vertical bars (MBP 13/14/16)" },
  { id: "hinge",    label: "Hinge / lid damage",  detail: "Lid won't close or stuck", diagnosis: true },
  { id: "other",    label: "Something else",      detail: "Diagnosis required", diagnosis: true },
];

// Shared wizard state hook — persists to localStorage so mirror + main stay in sync
function useWizardState() {
  const initial = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("icorrect-wizard");
      if (raw) return JSON.parse(raw);
    } catch {}
    return { step: 1, modelId: null, issueId: null, family: null, delivery: null, address: { line1: "", postcode: "" }, contact: { name: "", email: "", phone: "" } };
  }, []);

  const [state, setState] = React.useState(initial);

  React.useEffect(() => {
    try { localStorage.setItem("icorrect-wizard", JSON.stringify(state)); } catch {}
  }, [state]);

  const model = MAC_MODELS.find(m => m.id === state.modelId) || null;
  const issue = ISSUES.find(i => i.id === state.issueId) || null;

  const setStep = (step) => setState(s => ({ ...s, step }));
  const setModel = (m) => setState(s => ({ ...s, modelId: m?.id ?? null, family: m?.family ?? s.family, step: m ? 2 : s.step }));
  const setIssue = (i) => setState(s => ({ ...s, issueId: i?.id ?? null, step: i ? 3 : s.step }));
  const setFamily = (family) => setState(s => ({ ...s, family }));
  const setContact = (contact) => setState(s => ({ ...s, contact }));
  const setDelivery = (delivery) => setState(s => ({ ...s, delivery }));
  const setAddress = (address) => setState(s => ({ ...s, address: { ...s.address, ...address } }));
  const reset = () => setState({ step: 1, modelId: null, issueId: null, family: null, delivery: null, address: { line1: "", postcode: "" }, contact: { name: "", email: "", phone: "" } });

  return { state, model, issue, setStep, setModel, setIssue, setFamily, setContact, setDelivery, setAddress, reset };
}

function Wizard({ variant = "middle", showFilters = true }) {
  const w = useWizardState();
  const requiresDiagnosis = w.issue?.diagnosis || w.model?.price == null;
  const price = requiresDiagnosis ? null : w.model?.price;

  return (
    <div className={"wiz wiz-" + variant} id="wizard-root">
      <WizProgress step={w.state.step} model={w.model} issue={w.issue} onJump={w.setStep} />
      {w.state.step === 1 && (
        <StepModel
          family={w.state.family}
          selected={w.model}
          onSelectFamily={w.setFamily}
          onSelect={w.setModel}
          showFilters={showFilters}
        />
      )}
      {w.state.step === 2 && (
        <StepIssue
          issues={ISSUES}
          selected={w.issue}
          onSelect={w.setIssue}
          onBack={() => w.setStep(1)}
        />
      )}
      {w.state.step === 3 && (
        <StepQuote
          model={w.model}
          issue={w.issue}
          price={price}
          requiresDiagnosis={requiresDiagnosis}
          contact={w.state.contact}
          setContact={w.setContact}
          delivery={w.state.delivery}
          setDelivery={w.setDelivery}
          address={w.state.address}
          setAddress={w.setAddress}
          onBack={() => w.setStep(2)}
          onReset={w.reset}
        />
      )}
    </div>
  );
}

function WizProgress({ step, model, issue, onJump }) {
  const steps = [
    { label: "Model", value: model?.name },
    { label: "Issue", value: issue?.label },
    { label: "Quote", value: null },
  ];
  return (
    <div className="wiz-progress">
      <div className="mono-label" style={{color:"#666"}}>Step {step} of 3</div>
      <div className="wiz-dots">
        {steps.map((s, i) => {
          const idx = i + 1;
          const isDone = idx < step;
          const isCurrent = idx === step;
          const canJump = idx < step || (idx === 2 && model) || (idx === 3 && model && issue);
          return (
            <button
              key={s.label}
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onJump(idx)}
              className={"wiz-dot" + (isDone ? " done" : "") + (isCurrent ? " current" : "")}
            >
              <div className="wiz-dot-num">{idx}</div>
              <div className="wiz-dot-label">{s.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepModel({ family, selected, onSelectFamily, onSelect, showFilters = true }) {
  // Mobile: family → variant. Desktop: show everything flat with filter chips.
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia("(max-width: 640px)").matches);
  const [familyFilter, setFamilyFilter] = React.useState("all"); // all | pro | air
  const [sizeFilter, setSizeFilter] = React.useState("all"); // all | 13 | 14 | 15 | 16

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const pickFamily = family;

  // Available sizes per family filter — only show size chips that exist in the current family
  const sizesForFamily = React.useMemo(() => {
    const pool = familyFilter === "all"
      ? MAC_MODELS
      : MAC_MODELS.filter(m => m.family === familyFilter);
    const sizes = [...new Set(pool.map(m => m.size).filter(Boolean))].sort((a,b) => a-b);
    return sizes;
  }, [familyFilter]);

  // If current size filter isn't valid for the selected family, reset it
  React.useEffect(() => {
    if (sizeFilter !== "all" && !sizesForFamily.includes(sizeFilter)) {
      setSizeFilter("all");
    }
  }, [sizesForFamily, sizeFilter]);

  const shownModels = React.useMemo(() => {
    if (isMobile && pickFamily) return MAC_MODELS.filter(m => m.family === pickFamily);
    return MAC_MODELS.filter(m => {
      if (familyFilter !== "all" && m.family !== familyFilter) return false;
      if (sizeFilter !== "all" && m.size !== sizeFilter) return false;
      return true;
    });
  }, [isMobile, pickFamily, familyFilter, sizeFilter]);

  return (
    <div className="wiz-step">
      <h3 className="wiz-step-title">Which MacBook?</h3>
      <p className="wiz-step-sub">
        {isMobile && !pickFamily
          ? "Pick your family first — we'll narrow it down."
          : "We've identified the repair — just select your model."}
      </p>

      {isMobile && !pickFamily && (
        <div className="wiz-family-grid">
          {MAC_FAMILIES.map(f => (
            <button
              key={f.id}
              className="wiz-family-btn"
              onClick={() => onSelectFamily(f.id)}
            >
              <FamilyGlyph id={f.id} />
              <div className="wiz-family-text">
                <div className="wiz-family-name">{f.name}</div>
                <div className="wiz-family-detail">{f.detail}</div>
              </div>
              <span className="wiz-arrow">→</span>
            </button>
          ))}
        </div>
      )}

      {(!isMobile || pickFamily) && (
        <>
          {isMobile && pickFamily && (
            <button className="wiz-back" onClick={() => onSelectFamily(null)}>← All families</button>
          )}

          {/* Desktop filter chips */}
          {!isMobile && showFilters && (
            <div className="wiz-filters">
              <div className="wiz-filter-group" role="group" aria-label="Filter by family">
                <span className="wiz-filter-label">Family</span>
                <button type="button" className={"wiz-chip" + (familyFilter === "all" ? " active" : "")} onClick={() => setFamilyFilter("all")}>All</button>
                <button type="button" className={"wiz-chip" + (familyFilter === "pro" ? " active" : "")} onClick={() => setFamilyFilter("pro")}>Pro</button>
                <button type="button" className={"wiz-chip" + (familyFilter === "air" ? " active" : "")} onClick={() => setFamilyFilter("air")}>Air</button>
              </div>
              {sizesForFamily.length > 1 && (
                <div className="wiz-filter-group" role="group" aria-label="Filter by screen size">
                  <span className="wiz-filter-label">Size</span>
                  <button type="button" className={"wiz-chip" + (sizeFilter === "all" ? " active" : "")} onClick={() => setSizeFilter("all")}>All</button>
                  {sizesForFamily.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={"wiz-chip" + (sizeFilter === s ? " active" : "")}
                      onClick={() => setSizeFilter(s)}
                    >{s}"</button>
                  ))}
                </div>
              )}
              {(familyFilter !== "all" || sizeFilter !== "all") && (
                <button
                  type="button"
                  className="wiz-filter-clear"
                  onClick={() => { setFamilyFilter("all"); setSizeFilter("all"); }}
                >Clear</button>
              )}
            </div>
          )}

          <div className="wiz-grid">
            {shownModels.map(m => (
              <button key={m.id} className={"wiz-option" + (selected?.id === m.id ? " selected" : "")} onClick={() => onSelect(m)}>
                <div className="wiz-option-main">
                  <div className="wiz-option-name">{m.name}</div>
                  <div className="wiz-option-detail">{m.detail}</div>
                </div>
                <div className="wiz-option-price">
                  {m.price ? <>from <span>£{m.price}</span></> : <span className="wiz-option-diag">Requires diagnosis</span>}
                </div>
              </button>
            ))}
            {shownModels.length === 0 && (
              <div className="wiz-empty">No models match. <button type="button" onClick={() => { setFamilyFilter("all"); setSizeFilter("all"); }}>Clear filters</button></div>
            )}
          </div>
        </>
      )}

      <ModelHelpCard />
    </div>
  );
}

function FamilyGlyph({ id }) {
  const common = { width: 48, height: 32, viewBox: "0 0 48 32", fill: "none", stroke: "currentColor", strokeWidth: 1.4 };
  if (id === "pro") return (
    <svg {...common}><rect x="4" y="3" width="40" height="24" rx="1.5"/><rect x="0" y="27" width="48" height="3" rx="0.5"/><line x1="20" y1="29" x2="28" y2="29"/></svg>
  );
  if (id === "air") return (
    <svg {...common}><rect x="6" y="5" width="36" height="20" rx="1.5"/><rect x="2" y="25" width="44" height="3" rx="0.5"/><line x1="21" y1="27" x2="27" y2="27"/></svg>
  );
  return (
    <svg {...common}><rect x="5" y="4" width="38" height="22" rx="1.5"/><line x1="5" y1="8" x2="43" y2="8"/><rect x="0" y="26" width="48" height="3" rx="0.5"/></svg>
  );
}

function ModelHelpCard() {
  const [code, setCode] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    const el = document.getElementById("identify");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <div className="wiz-help-cta">
      <div className="wiz-help-cta-icon" aria-hidden="true">A2442</div>
      <div className="wiz-help-cta-text">
        <strong>Don't know which MacBook you have?</strong>
        <span>Type the model code from the underside — or jump to the visual guide.</span>
      </div>
      <form className="wiz-help-cta-form" onSubmit={submit}>
        <input
          placeholder="e.g. A2442"
          value={code}
          onChange={e => setCode(e.target.value)}
          aria-label="MacBook model code"
        />
        <button type="submit">Identify</button>
      </form>
    </div>
  );
}

function StepIssue({ issues, selected, onSelect, onBack }) {
  return (
    <div className="wiz-step">
      <button className="wiz-back" onClick={onBack}>← Back</button>
      <h3 className="wiz-step-title">What's happening?</h3>
      <p className="wiz-step-sub">Most screen issues have a fixed price. Some require diagnosis.</p>
      <div className="wiz-list">
        {issues.map(i => (
          <button key={i.id} className={"wiz-option-row" + (selected?.id === i.id ? " selected" : "")} onClick={() => onSelect(i)}>
            <div>
              <div className="wiz-option-name">{i.label}</div>
              <div className="wiz-option-detail">{i.detail}</div>
            </div>
            {i.diagnosis
              ? <span className="badge badge-ring">Diagnosis</span>
              : <span className="wiz-arrow">→</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

const LONDON_POSTCODES = ["E","EC","N","NW","SE","SW","W","WC"];

function isLondonPostcode(pc) {
  if (!pc) return false;
  const trimmed = pc.trim().toUpperCase().replace(/\s+/g, "");
  if (trimmed.length < 2) return false;
  // Match against area prefixes (letters before the first digit)
  const area = trimmed.match(/^[A-Z]+/)?.[0];
  return LONDON_POSTCODES.includes(area);
}

const COURIER_FEE = 20;
const FAST_TURNAROUND_FEE = 79;

// ── Date helpers (UK working days, Mon–Fri) ────────────────────────────────
function addWorkingDays(d, n) {
  const out = new Date(d);
  let added = 0;
  while (added < n) {
    out.setDate(out.getDate() + 1);
    const dow = out.getDay();
    if (dow !== 0 && dow !== 6) added += 1;
  }
  return out;
}
function nextWorkingDay(d) { return addWorkingDays(d, 1); }
function fmtDate(d) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
function fmtDateRange(a, b) {
  const sameMonth = a.getMonth() === b.getMonth();
  const aStr = a.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", ...(sameMonth ? {} : { month: "short" }) });
  const bStr = b.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return `${aStr} – ${bStr}`;
}
// Mon–Fri dates for the next 14 calendar days
function upcomingWalkInDates(count = 8) {
  const out = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) out.push(new Date(d));
  }
  return out;
}
const WALK_IN_TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function StepQuote({ model, issue, price, requiresDiagnosis, contact, setContact, delivery, setDelivery, address, setAddress, onBack, onReset }) {
  const [secondary, setSecondary] = React.useState(null); // null | "email" | "chat"
  const [submitted, setSubmitted] = React.useState(false);
  const [walkInDate, setWalkInDate] = React.useState(null);
  const [walkInTime, setWalkInTime] = React.useState(null);
  const [turnaround, setTurnaround] = React.useState("standard"); // "standard" | "fast"

  const londonOk = isLondonPostcode(address?.postcode);
  const effectiveDelivery =
    delivery === "courier" && address?.postcode && !londonOk ? "mail" : delivery;

  const courierFee = effectiveDelivery === "courier" && londonOk ? COURIER_FEE : 0;
  const fastFee = turnaround === "fast" ? FAST_TURNAROUND_FEE : 0;
  const total = price != null ? price + courierFee + fastFee : null;

  // Estimated dates
  const today = new Date();
  const collectionDate = effectiveDelivery === "courier" ? nextWorkingDay(today) : null;
  const arrivalDate = effectiveDelivery === "mail" ? addWorkingDays(today, 2) : null;
  const repairDays = turnaround === "fast" ? 1 : 2; // standard 1–2, show worst case
  const completionDate = (() => {
    const start =
      effectiveDelivery === "walkin" && walkInDate ? new Date(walkInDate) :
      effectiveDelivery === "courier" ? collectionDate :
      effectiveDelivery === "mail" ? arrivalDate : null;
    if (!start) return null;
    return addWorkingDays(start, repairDays);
  })();
  const returnDate = completionDate ? nextWorkingDay(completionDate) : null;

  const canSubmit = !!delivery
    && (delivery !== "courier" || (address?.line1 && londonOk))
    && (delivery !== "walkin" || (walkInDate && walkInTime))
    && (!secondary || (contact.name && contact.email));

  const submit = (e) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    const copy =
      secondary === "email" ? {
        title: "Quote sent",
        sub: "Check your inbox — we've sent a formatted quote you can forward to your insurer. Reply any time to book the repair."
      } : secondary === "chat" ? {
        title: "We'll be in touch",
        sub: "One of our technicians will message you within 2 working hours to answer your questions before you decide."
      } : {
        title: "Redirecting to checkout…",
        sub: effectiveDelivery === "walkin"
          ? `We'll see you ${walkInDate ? fmtDate(walkInDate) : "soon"}${walkInTime ? ` at ${walkInTime}` : ""} at 12 Margaret St, W1W 8JQ.`
          : effectiveDelivery === "courier"
          ? `Your London courier will collect ${collectionDate ? fmtDate(collectionDate) : "tomorrow"}.`
          : "We'll email a pre-paid shipping label as soon as your order is confirmed."
      };
    return (
      <div className="wiz-step wiz-quote">
        <div className="wiz-check">✓</div>
        <h3 className="wiz-step-title">{copy.title}</h3>
        <p className="wiz-step-sub" style={{maxWidth:440,margin:"0 auto 24px"}}>{copy.sub}</p>
        <button className="btn btn-light" onClick={onReset}>Start over</button>
      </div>
    );
  }

  return (
    <div className="wiz-step wiz-quote">
      <button className="wiz-back" onClick={onBack}>← Back</button>

      {/* Summary card */}
      <div className="wiz-summary">
        <div className="mono-label">Your quote</div>
        <div className="wiz-summary-line"><span>Device</span><span>{model?.name}</span></div>
        <div className="wiz-summary-line"><span>Issue</span><span>{issue?.label}</span></div>
        <div className="wiz-summary-line"><span>Turnaround</span><span>{turnaround === "fast" ? "1 working day" : "1–2 working days"}</span></div>
        <div className="wiz-summary-line"><span>Warranty</span><span>2 years</span></div>
        {!requiresDiagnosis && price && (
          <div className="wiz-price-row">
            <div>
              <div className="mono-label">Repair</div>
              {(courierFee > 0 || fastFee > 0) && (
                <div className="wiz-price-note">
                  {[
                    fastFee > 0 ? `+ £${fastFee} fast turnaround` : null,
                    courierFee > 0 ? `+ £${courierFee} London courier` : null,
                  ].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
            <div className="wiz-price">£{total}</div>
          </div>
        )}
        {requiresDiagnosis && (
          <div className="wiz-diagnosis-note">
            <strong>Free diagnosis first.</strong> We'll inspect your device and send an exact quote within 24 hours before any work begins.
          </div>
        )}
      </div>

      <form className="wiz-contact" onSubmit={submit}>
        <div className="wiz-section-label">How will we get your MacBook?</div>
        {/* Delivery */}
        <div className="wiz-delivery-grid">
          <DeliveryCard
            id="walkin"
            active={delivery === "walkin"}
            onSelect={() => setDelivery("walkin")}
            title="Walk in"
            subtitle="12 Margaret St, W1W 8JQ · Mon–Fri"
            price="Free"
            badge={null}
          />
          <DeliveryCard
            id="courier"
            active={delivery === "courier"}
            onSelect={() => setDelivery("courier")}
            title="London courier"
            subtitle="Door-to-door, same or next day"
            price={"+£" + COURIER_FEE}
            badge="Popular"
          />
          <DeliveryCard
            id="mail"
            active={delivery === "mail"}
            onSelect={() => setDelivery("mail")}
            title="Mail-in"
            subtitle="Pre-paid label · UK-wide"
            price="Free"
            badge={null}
            footer={<span className="wiz-delivery-soon">International coming soon</span>}
          />
        </div>

        {/* Walk-in: date + time slot */}
        {delivery === "walkin" && (
          <div className="wiz-delivery-detail">
            <div className="wiz-section-label">Pick a day & time</div>
            <div className="wiz-walkin-dates">
              {upcomingWalkInDates(8).map((d, i) => {
                const sel = walkInDate && d.toDateString() === new Date(walkInDate).toDateString();
                return (
                  <button
                    key={i}
                    type="button"
                    className={"wiz-walkin-date" + (sel ? " active" : "")}
                    onClick={() => setWalkInDate(d.toISOString())}
                  >
                    <span className="wiz-walkin-dow">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                    <span className="wiz-walkin-day">{d.getDate()}</span>
                    <span className="wiz-walkin-mon">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            {walkInDate && (
              <div className="wiz-walkin-times">
                {WALK_IN_TIMES.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={"wiz-walkin-time" + (walkInTime === t ? " active" : "")}
                    onClick={() => setWalkInTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courier: address + live quote */}
        {delivery === "courier" && (
          <div className="wiz-delivery-detail wiz-address-check">
            <div className="wiz-section-label">Collection address</div>
            <div className="wiz-address-grid">
              <input
                placeholder="Address line 1"
                value={address?.line1 || ""}
                onChange={e => setAddress({ ...address, line1: e.target.value })}
                required
              />
              <input
                placeholder="Postcode"
                value={address?.postcode || ""}
                onChange={e => setAddress({ ...address, postcode: e.target.value })}
                required
                aria-invalid={address?.postcode && !londonOk ? "true" : "false"}
              />
            </div>
            {address?.postcode && !londonOk && (
              <div className="wiz-address-warn">
                <strong>That postcode is outside London.</strong> Courier is London-only — we'll switch you to free mail-in and email a pre-paid label.
                <button type="button" className="wiz-address-warn-action" onClick={() => setDelivery("mail")}>
                  Switch to mail-in →
                </button>
              </div>
            )}
            {address?.postcode && londonOk && (
              <div className="wiz-address-ok">
                ✓ London postcode confirmed · live courier quote: <strong>£{COURIER_FEE}</strong>
              </div>
            )}
          </div>
        )}

        {/* Estimated dates: courier + mail-in only (walk-in shows on the picker) */}
        {((delivery === "courier" && londonOk) || delivery === "mail") && (
          <div className="wiz-eta">
            <div className="wiz-eta-row">
              <span className="wiz-eta-label">Estimated collection</span>
              <span className="wiz-eta-value">
                {delivery === "courier" ? fmtDate(collectionDate) : `Post by ${fmtDate(today)}`}
              </span>
            </div>
            {delivery === "mail" && (
              <div className="wiz-eta-row">
                <span className="wiz-eta-label">Arrives at workshop</span>
                <span className="wiz-eta-value">{fmtDate(arrivalDate)}</span>
              </div>
            )}
            {returnDate && (
              <div className="wiz-eta-row">
                <span className="wiz-eta-label">Returned to you by</span>
                <span className="wiz-eta-value"><strong>{fmtDate(returnDate)}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Repair turnaround upsell */}
        {!requiresDiagnosis && price && (
          <div className="wiz-turnaround">
            <div className="wiz-section-label">Repair turnaround</div>
            <div className="wiz-turnaround-grid">
              <button
                type="button"
                className={"wiz-turnaround-card" + (turnaround === "standard" ? " active" : "")}
                onClick={() => setTurnaround("standard")}
              >
                <div className="wiz-turnaround-title">Standard</div>
                <div className="wiz-turnaround-meta">1–2 working days</div>
                <div className="wiz-turnaround-price wiz-turnaround-included">Included</div>
              </button>
              <button
                type="button"
                className={"wiz-turnaround-card" + (turnaround === "fast" ? " active" : "")}
                onClick={() => setTurnaround("fast")}
              >
                <span className="wiz-turnaround-badge">Faster</span>
                <div className="wiz-turnaround-title">Fast</div>
                <div className="wiz-turnaround-meta">Same or next working day</div>
                <div className="wiz-turnaround-price">+£{FAST_TURNAROUND_FEE}</div>
              </button>
            </div>
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn btn-dark btn-lg" style={{width:"100%",marginTop:8}}>
          {requiresDiagnosis
            ? "Continue to checkout · Free diagnosis"
            : `Continue to checkout · £${total}`}
        </button>
        <p className="wiz-fineprint">You'll add your details and pay securely on the next step.</p>
      </form>

      {/* Secondary actions: text-style alternates */}
      <div className="wiz-secondary-actions">
        <span>Not ready?</span>
        <button type="button" className="wiz-secondary-link" onClick={() => setSecondary(secondary === "email" ? null : "email")}>
          Email me this quote
        </button>
        <span className="wiz-secondary-sep">·</span>
        <button type="button" className="wiz-secondary-link" onClick={() => setSecondary(secondary === "chat" ? null : "chat")}>
          Ask a question
        </button>
      </div>

      {secondary === "email" && (
        <form className="wiz-contact wiz-secondary-form" onSubmit={submit}>
          <p className="wiz-step-sub" style={{marginTop:0,marginBottom:12}}>
            Need a formatted quote for your insurer? We'll send a PDF with your device, issue, and price — typically accepted by UK home & business policies.
          </p>
          <input required placeholder="Full name" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
          <input required type="email" placeholder="Email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
          <button type="submit" className="btn btn-dark" style={{width:"100%",marginTop:4}}>
            Send quote to my inbox
          </button>
        </form>
      )}

      {secondary === "chat" && (
        <form className="wiz-contact wiz-secondary-form" onSubmit={submit}>
          <p className="wiz-step-sub" style={{marginTop:0,marginBottom:12}}>
            Not ready to book? A technician (not a chatbot) will reply within 2 working hours.
          </p>
          <input required placeholder="Full name" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
          <input required type="email" placeholder="Email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
          <textarea
            className="wiz-textarea"
            placeholder="What would you like to know? (optional)"
            rows={3}
          />
          <button type="submit" className="btn btn-dark" style={{width:"100%",marginTop:4}}>
            Start conversation
          </button>
        </form>
      )}
    </div>
  );
}

function DeliveryCard({ id, active, onSelect, title, subtitle, price, badge, footer }) {
  return (
    <button
      type="button"
      className={"wiz-delivery-card" + (active ? " active" : "")}
      onClick={onSelect}
    >
      {badge && <span className="wiz-delivery-badge">{badge}</span>}
      <div className="wiz-delivery-radio" aria-hidden="true">
        <span />
      </div>
      <div className="wiz-delivery-body">
        <div className="wiz-delivery-title">{title}</div>
        <div className="wiz-delivery-sub">{subtitle}</div>
        {footer}
      </div>
      <div className="wiz-delivery-price">{price}</div>
    </button>
  );
}

// ── Floating sticky mini-wizard ────────────────────────────────────────────
function FloatingWizard() {
  const w = useWizardState();
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const wiz = document.getElementById("wizard-root");
      if (!wiz) { setVisible(false); return; }
      const rect = wiz.getBoundingClientRect();
      // Show once the user has fully scrolled past the bottom of the wizard
      // (with a small buffer so it doesn't flicker while scrolling near the edge)
      setVisible(rect.bottom < -120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const requiresDiagnosis = w.issue?.diagnosis || w.model?.price == null;
  const price = requiresDiagnosis ? null : w.model?.price;

  const scrollToMain = () => {
    const wiz = document.getElementById("wizard-root");
    if (wiz) window.scrollTo({ top: wiz.offsetTop - 80, behavior: "smooth" });
  };

  if (!visible) return null;

  // Two surfaces: compact bar (always) + expanded panel (toggled)
  return (
    <>
      {expanded && (
        <div className="fwiz-backdrop" onClick={() => setExpanded(false)} />
      )}
      <div className={"fwiz" + (expanded ? " expanded" : "")}>
        {expanded ? (
          <FloatingExpanded w={w} price={price} requiresDiagnosis={requiresDiagnosis} onClose={() => setExpanded(false)} onJumpToFull={scrollToMain} />
        ) : (
          <FloatingBar w={w} price={price} requiresDiagnosis={requiresDiagnosis} onExpand={() => setExpanded(true)} onJumpToFull={scrollToMain} />
        )}
      </div>
    </>
  );
}

function FloatingBar({ w, price, requiresDiagnosis, onExpand, onJumpToFull }) {
  const hasModel = !!w.model;
  const hasIssue = !!w.issue;
  const hasBoth = hasModel && hasIssue;

  // Real, action-led CTA based on state
  let ctaText, ctaAction;
  if (w.state.step === 3) {
    ctaText = requiresDiagnosis ? "Book free pre-diagnosis" : `Book repair · £${price}`;
    ctaAction = onJumpToFull;
  } else if (hasBoth) {
    ctaText = "Get my quote";
    ctaAction = onJumpToFull;
  } else if (hasModel) {
    ctaText = "Pick your issue";
    ctaAction = onExpand;
  } else if (hasIssue) {
    ctaText = "Pick your model";
    ctaAction = onExpand;
  } else {
    ctaText = "Start your quote";
    ctaAction = onExpand;
  }

  // Click a chip → scroll to main wizard and jump to that step
  const chipJump = (step) => {
    w.setStep(step);
    onJumpToFull();
  };

  // Turnaround copy — replaces the old price chip
  const turnaround = requiresDiagnosis
    ? "Pre-diagnosis first"
    : (hasIssue ? "1–2 days" : "1–2 days typical");

  return (
    <div className="fwiz-bar">
      <div className="fwiz-bar-main">
        <div className="fwiz-bar-chips">
          <button
            type="button"
            className={"fwiz-chip fwiz-chip-btn" + (hasModel ? " filled" : "")}
            onClick={() => chipJump(1)}
            aria-label={hasModel ? `Change model (currently ${w.model.name})` : "Pick model"}
          >
            <span className="fwiz-chip-label">Model</span>
            <span className="fwiz-chip-value">{w.model?.name || "Not set"}</span>
            {hasModel && <span className="fwiz-chip-edit" aria-hidden="true">↺</span>}
          </button>
          <button
            type="button"
            className={"fwiz-chip fwiz-chip-btn" + (hasIssue ? " filled" : "")}
            onClick={() => chipJump(2)}
            aria-label={hasIssue ? `Change issue (currently ${w.issue.label})` : "Pick issue"}
          >
            <span className="fwiz-chip-label">Issue</span>
            <span className="fwiz-chip-value">{w.issue?.label || "Not set"}</span>
            {hasIssue && <span className="fwiz-chip-edit" aria-hidden="true">↺</span>}
          </button>
          <div className="fwiz-chip fwiz-chip-turnaround filled" aria-label={`Turnaround: ${turnaround}`}>
            <span className="fwiz-chip-label">Turnaround</span>
            <span className="fwiz-chip-value">{turnaround}</span>
          </div>
        </div>
        <div className="fwiz-bar-actions">
          <button className="fwiz-btn fwiz-btn-primary fwiz-btn-cta" onClick={ctaAction}>
            {ctaText}
            <span className="fwiz-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingExpanded({ w, price, requiresDiagnosis, onClose, onJumpToFull }) {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia("(max-width: 640px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  return (
    <div className="fwiz-panel">
      <div className="fwiz-panel-head">
        <div>
          <div className="mono-label" style={{color:"#666"}}>Quick repair picker</div>
          <div className="fwiz-panel-title">
            {w.state.step === 3 ? "Review your quote"
              : w.state.step === 2 ? "What's happening?"
              : "Which MacBook?"}
          </div>
        </div>
        <button className="fwiz-close" onClick={onClose} aria-label="Close"></button>
      </div>

      <div className="fwiz-panel-body">
        {w.state.step === 1 && (
          <StepModel
            family={w.state.family}
            selected={w.model}
            onSelectFamily={w.setFamily}
            onSelect={w.setModel}
          />
        )}
        {w.state.step === 2 && (
          <StepIssue
            issues={ISSUES}
            selected={w.issue}
            onSelect={w.setIssue}
            onBack={() => w.setStep(1)}
          />
        )}
        {w.state.step === 3 && (
          <StepQuote
            model={w.model}
            issue={w.issue}
            price={price}
            requiresDiagnosis={requiresDiagnosis}
            contact={w.state.contact}
            setContact={w.setContact}
            delivery={w.state.delivery}
            setDelivery={w.setDelivery}
            address={w.state.address}
            setAddress={w.setAddress}
            onBack={() => w.setStep(2)}
            onReset={w.reset}
          />
        )}
      </div>

      <div className="fwiz-panel-foot">
        <button className="fwiz-btn fwiz-btn-ghost" onClick={onJumpToFull}>Open full wizard ↑</button>
      </div>
    </div>
  );
}

Object.assign(window, { Wizard, FloatingWizard, useWizardState, MAC_MODELS, MAC_FAMILIES, ISSUES });
