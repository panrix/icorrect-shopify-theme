// ═══════════════════════════════════════════════════════════════════════════
//  Quote Tiers v4 — pricing-page tier cards FUSED with v3 scheduling.
//  Combines the loved "Plan your repair" 3-column tier layout with the v3
//  ability to choose service method + drop-in/collection date (+ calendar).
//
//  Flow: pick a speed tier → schedule how & when → one book bar commits it.
//  Supports 2 OR 3 tiers (a repair can offer Standard+Fast, or +Fastest).
//
//  Self-contained — own date helpers (q4*) so it never collides with the
//  v3 QuoteTiersSchedule component.
// ═══════════════════════════════════════════════════════════════════════════

function q4IsWD(d){const x=d.getDay();return x!==0&&x!==6;}
function q4AddWD(d,n){const o=new Date(d);let a=0;while(a<n){o.setDate(o.getDate()+1);if(q4IsWD(o))a++;}return o;}
function q4NextWD(d){return q4AddWD(d,1);}
function q4Fmt(d){const dt=d instanceof Date?d:new Date(d);return isNaN(dt.getTime())?"":dt.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});}
function q4Upcoming(n){const o=[];const d=new Date();while(o.length<n){d.setDate(d.getDate()+1);if(q4IsWD(d))o.push(new Date(d));}return o;}
function q4SameDay(a,b){return new Date(a).toDateString()===new Date(b).toDateString();}

// ── Month calendar (further-out dates) ──────────────────────────────────────
function Q4Calendar({ value, min, isAllowed, onPick, onClose }) {
  const sel = new Date(value);
  const minD = new Date(min); minD.setHours(0,0,0,0);
  const [view, setView] = React.useState(new Date(sel.getFullYear(), sel.getMonth(), 1));
  const year = view.getFullYear(), month = view.getMonth();
  const startDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  const canPrev = new Date(year, month, 1) > new Date(minD.getFullYear(), minD.getMonth(), 1);
  return (
    <div className="qs-cal" role="dialog" aria-label="Choose a date">
      <div className="qs-cal-head">
        <button type="button" className="qs-cal-nav" disabled={!canPrev} onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Previous month">‹</button>
        <span className="qs-cal-title">{view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
        <button type="button" className="qs-cal-nav" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Next month">›</button>
      </div>
      <div className="qs-cal-grid qs-cal-dow">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <span key={d} className="qs-cal-dowcell">{d}</span>)}
      </div>
      <div className="qs-cal-grid">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="qs-cal-empty" />;
          const disabled = d < minD || (isAllowed ? !isAllowed(d) : false);
          const isSel = q4SameDay(d, sel);
          return (
            <button key={i} type="button" disabled={disabled}
              className={"qs-cal-day" + (isSel ? " active" : "") + (disabled ? " disabled" : "")}
              onClick={() => onPick(d)}>{d.getDate()}</button>
          );
        })}
      </div>
      <div className="qs-cal-foot">
        <span className="qs-cal-hint">Weekends unavailable</span>
        <button type="button" className="qs-cal-close" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

const Q4_COURIER_WINDOWS = [
  { id: "morn", label: "9:00 – 12:00" },
  { id: "mid",  label: "12:00 – 15:00" },
  { id: "aft",  label: "15:00 – 18:00" },
];
const Q4_WALKIN_TIMES = ["9:30","11:00","12:30","14:00","15:30","17:00"];
const Q4_COURIER_FEE = 20, Q4_MAIL_FEE = 24;

// Comparison rows — consistent across cards so columns line up like a pricing page.
const Q4_FEATURES = ["turnaround", "warranty", "updates", "queue", "technician"];
const Q4_LABELS = {
  turnaround: "Turnaround",
  warranty: "Genuine parts · 2-yr warranty",
  updates: "SMS status updates",
  queue: "Bench priority",
  technician: "Dedicated technician",
};

function QuoteTiersV6({ model, issue, price, zone = "london", postcode = "W1W 8JQ", onChangePostcode, editStep, tierCount = 3 }) {
  const isLondon = zone === "london";
  const earliest = q4Upcoming(1)[0];

  // ── Speed tiers (the pricing-page cards) ──────────────────────────────────
  // A repair offers either 2 (Standard + Fast) or 3 (+ Fastest same-day) tiers.
  const allTiers = [
    {
      id: "standard", name: "Standard", tagline: "No rush — done right.",
      speedFee: 0, days: 2,
      feats: { turnaround: isLondon ? "2–3 working days" : "4–5 working days", warranty: true, updates: false, queue: false, technician: false },
    },
    {
      id: "fast", name: "Express", tagline: "Skip the queue.",
      speedFee: 79, days: 1, recommended: true,
      feats: { turnaround: "1 working day", warranty: true, updates: true, queue: "Express queue", technician: false },
    },
    {
      id: "fastest", name: "Priority", tagline: "Back in your hands today.",
      speedFee: 149, days: 0, sameDay: true, londonOnly: true,
      feats: { turnaround: "~4 hours", warranty: true, updates: true, queue: "Front of queue", technician: true },
    },
  ];
  // Always show at least TWO tiers. A tier beyond what this repair offers is
  // shown greyed-out WITH its price ("what it would cost") rather than hidden
  // — the same treatment as the London-only Fastest tier.
  const shownCount = tierCount >= 3 ? 3 : 2;
  const tiers = allTiers.slice(0, shownCount);
  const isAvail = (t, i) => i < tierCount && !(t.londonOnly && !isLondon);
  const availableTiers = tiers.filter((t, i) => isAvail(t, i));
  const fastestTier = availableTiers[availableTiers.length - 1] || tiers[0];

  // ── Service method (how it travels) ───────────────────────────────────────
  const methods = isLondon
    ? [
        { id: "courier", name: "Courier collection", sub: `We come to you · +£${Q4_COURIER_FEE}`, badge: "Most popular", fee: Q4_COURIER_FEE, back: 1, kind: "collect" },
        { id: "walkin",  name: "Walk in", sub: "Fitzrovia · free", fee: 0, back: 0, kind: "dropin" },
      ]
    : [
        { id: "mail", name: "Mail-in", sub: `Prepaid label · +£${Q4_MAIL_FEE}`, badge: "Recommended", fee: Q4_MAIL_FEE, back: 2, kind: "mail" },
        { id: "walkin", name: "Walk in (visiting London)", sub: "Fitzrovia · free", fee: 0, back: 0, kind: "dropin" },
      ];

  const [tierId, setTierId] = React.useState((availableTiers.find(t => t.recommended) || availableTiers[0] || tiers[0]).id);
  const [methodId, setMethodId] = React.useState(methods[0].id);
  const [day, setDay] = React.useState(earliest.toISOString());
  const [slot, setSlot] = React.useState(isLondon ? Q4_COURIER_WINDOWS[0].id : Q4_WALKIN_TIMES[0]);
  const [calOpen, setCalOpen] = React.useState(false);
  const [booked, setBooked] = React.useState(false);
  const [screen, setScreen] = React.useState("speed"); // "speed" | "schedule"

  const tier = tiers.find(t => t.id === tierId) || tiers[0];
  const method = methods.find(m => m.id === methodId) || methods[0];

  // Fastest needs a same-day hand-over → force walk-in when picked.
  React.useEffect(() => {
    if (tier.sameDay && method.kind !== "dropin") {
      const w = methods.find(m => m.kind === "dropin");
      if (w) setMethodId(w.id);
    }
  }, [tierId]);

  React.useEffect(() => {
    if (method.kind === "collect") setSlot(Q4_COURIER_WINDOWS[0].id);
    else if (method.kind === "dropin") setSlot(Q4_WALKIN_TIMES[0]);
    else setSlot(null);
  }, [methodId]);

  // If availability changes (tweak / postcode) and the selected tier is no
  // longer available, fall back to the best available one.
  React.useEffect(() => {
    const i = tiers.findIndex(t => t.id === tierId);
    if (i < 0 || !isAvail(tiers[i], i)) {
      const next = availableTiers.find(t => t.recommended) || availableTiers[0];
      if (next) setTierId(next.id);
    }
  }, [tierCount, isLondon]);

  const today = new Date();
  const serviceStart = method.kind === "mail" ? q4AddWD(today, 2) : new Date(day);
  const readyFor = (t) => t.sameDay ? new Date(serviceStart) : q4NextWD(q4AddWD(serviceStart, t.days + method.back));

  const total = price + method.fee + tier.speedFee;
  const slotLabel = method.kind === "collect" ? Q4_COURIER_WINDOWS.find(w => w.id === slot)?.label : method.kind === "dropin" ? slot : null;

  // ── Repair timeline (ported from v3/v5) — lives inside the How & when step ──
  const deviceShort = model?.name?.split(" (")[0] || "device";
  const tlReady = readyFor(tier);
  const tlReturn = method.kind === "dropin" ? tlReady : q4NextWD(tlReady);
  const timeline = [];
  if (method.kind === "mail") {
    // Mail-in: we ship packaging first, then collect — the real sequence.
    const arrive = q4NextWD(today);          // packaging reaches the customer
    const collect = q4NextWD(arrive);        // courier collects from them
    const reachUs = q4NextWD(collect);       // device arrives at the workshop
    const repaired = q4AddWD(reachUs, tier.days);
    const shipBack = q4NextWD(repaired);
    timeline.push({ label: "You book & we post your packaging", date: "Today — same day if you order before 3pm", note: "Protective box + a prepaid, insured return label" });
    timeline.push({ label: "Packaging reaches you", date: q4Fmt(arrive), note: `Pop your ${deviceShort} in — it takes two minutes` });
    timeline.push({ label: "We arrange your collection", date: "Same or next working day", note: "A courier picks it up from your door" });
    timeline.push({ label: "It arrives at the workshop", date: q4Fmt(reachUs) });
    timeline.push({ label: "Repaired & 30-point QA on the bench", date: `${tier.feats.turnaround} in workshop`, note: tier.feats.queue || "Standard queue" });
    timeline.push({
      label: "Shipped back to you",
      date: q4Fmt(shipBack),
      note: tier.speedFee > 0 ? `On time, or your £${tier.speedFee} ${tier.name.toLowerCase()} fee is refunded` : "Genuine parts · 2-year warranty",
      final: true,
    });
  } else {
    timeline.push({ label: "You book — part reserved, bench slot held", date: "Today · payment taken upfront" });
    if (method.kind === "dropin") {
      timeline.push({ label: "You drop it in", date: `${q4Fmt(serviceStart)}${slotLabel ? " · " + slotLabel : ""}`, note: "12 Margaret Street, Fitzrovia W1W 8JQ" });
    } else {
      timeline.push({ label: "We collect by courier", date: `${q4Fmt(serviceStart)}${slotLabel ? " · " + slotLabel : ""}`, note: "Fully insured, door to door" });
    }
    timeline.push({ label: "Repaired & 30-point QA on the bench", date: tier.sameDay ? "Same afternoon" : `${tier.feats.turnaround} in workshop`, note: tier.feats.queue || "Standard queue" });
    timeline.push({
      label: method.kind === "dropin" ? "Ready to collect" : "Back in your hands",
      date: q4Fmt(tlReturn),
      note: tier.speedFee > 0 ? `On time, or your £${tier.speedFee} ${tier.name.toLowerCase()} fee is refunded` : "Genuine parts · 2-year warranty",
      final: true,
    });
  }

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="qs-confirm">
        <div className="qs-confirm-check">✓</div>
        <h3>{tier.name} · {method.name} booked</h3>
        <p>
          {model?.name} · {issue?.label?.toLowerCase()} · ready by <strong>{q4Fmt(readyFor(tier))}</strong>.
          {method.kind === "collect" ? ` We'll collect ${q4Fmt(serviceStart)}${slotLabel ? `, ${slotLabel}` : ""}.` : method.kind === "dropin" ? ` See you ${q4Fmt(serviceStart)}${slotLabel ? `, ${slotLabel}` : ""}.` : " Post it with the prepaid label we email you."}
        </p>
        <div className="qs-confirm-total">£{total}</div>
        <button className="q4-book-secondary" onClick={() => setBooked(false)}>← Back to options</button>
      </div>
    );
  }

  const Mark = ({ v }) => v === false
    ? <span className="q4-feat-no" aria-hidden="true">—</span>
    : <span className="q4-feat-yes" aria-hidden="true">✓</span>;

  // Trust badges — shown at the foot of each screen.
  const TrustModule = () => (
    <div className="qs-trust" role="list" aria-label="What's included">
      <div className="qs-trust-item" role="listitem">
        <span className="qs-trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6L12 3z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg></span>
        <span className="qs-trust-text"><span className="qs-trust-label">Warranty</span><span className="qs-trust-value">2-year warranty</span></span>
      </div>
      <div className="qs-trust-item" role="listitem">
        <span className="qs-trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg></span>
        <span className="qs-trust-text"><span className="qs-trust-label">Turnaround</span><span className="qs-trust-value">From {fastestTier.feats.turnaround}</span></span>
      </div>
      <div className="qs-trust-item" role="listitem">
        <span className="qs-trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/><path d="M9.5 2.5v3M14.5 2.5v3M9.5 18.5v3M14.5 18.5v3M2.5 9.5h3M2.5 14.5h3M18.5 9.5h3M18.5 14.5h3"/></svg></span>
        <span className="qs-trust-text"><span className="qs-trust-label">Parts</span><span className="qs-trust-value">Genuine Apple parts</span></span>
      </div>
    </div>
  );

  const Q4_FEATURES_NOTURN = ["warranty", "updates", "queue", "technician"];

  // Header — centred intro (Quote Tiers style) + identity strip with big price + edit.
  const Header = ({ showTotal, intro }) => (
    <>
      {intro && (
        <div className="q4-intro">
          <div className="mono-label">Quote · your repair plan</div>
          <h1>Plan your repair.</h1>
        </div>
      )}
      <div className="q4-head">
        <div className="q4-head-info">
          <div className="q4-head-device">{model?.name}</div>
          <div className="q4-head-meta">
            <span>{issue?.label}</span>
            <span className="q4-head-sep">·</span>
            <span className="q4-head-pc">{postcode}</span>
            {editStep && <button type="button" className="q4-head-edit" onClick={() => editStep("issue")}>Edit</button>}
          </div>
        </div>
        <div className="q4-head-price">
          <span className="q4-head-price-num">£{showTotal ? total : price}</span>
          <span className="q4-head-price-label">{showTotal ? `${tier.name} · total` : "repair · fixed"}</span>
        </div>
      </div>
    </>
  );

  // ───────────────────────────── Screen 1: speed ──────────────────────────
  if (screen === "speed") {
    return (
      <div className="q4">
        <Header showTotal={false} intro={true} />
        <TrustModule />

        <div className="q4-step-label"><span className="q4-step-num">1</span> Choose your speed</div>
        <div className={"q4-grid q4-grid-" + tiers.length}>
          {tiers.map((t, i) => {
            const disabled = !isAvail(t, i);
            const selected = t.id === tierId && !disabled;
            const tTotal = price + t.speedFee;
            const readyEst = t.sameDay ? today : q4AddWD(today, t.days);
            return (
              <div
                key={t.id}
                className={"q4-card" + (selected ? " q4-card-sel" : "") + (t.recommended ? " q4-card-rec" : "") + (disabled ? " q4-card-off" : "")}
                onClick={() => { if (!disabled) { setTierId(t.id); } }}
              >
                {t.recommended && !disabled && <span className="q4-card-badge">Most popular</span>}
                <span className="q4-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                <span className="q4-card-name">{t.name}</span>
                <span className="q4-card-tagline">{t.tagline}</span>
                <span className="q4-card-price">
                  {t.speedFee > 0 ? <span className="q4-card-price-plus">+£{t.speedFee}</span> : <span className="q4-card-price-plus">Included</span>}
                  <span className="q4-card-price-total">£{tTotal} total</span>
                </span>

                {!disabled && (
                  <div className="q4-card-ready">
                    <span className="q4-card-ready-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4"/></svg></span>
                    <span className="q4-card-ready-text">
                      <span className="q4-card-ready-label">Ready from</span>
                      <span className="q4-card-ready-date">{q4Fmt(readyEst)}</span>
                    </span>
                    <span className="q4-card-ready-rel">{t.feats.turnaround}</span>
                  </div>
                )}

                <ul className="q4-feats">
                  {Q4_FEATURES_NOTURN.map(f => {
                    const v = t.feats[f];
                    const text = typeof v === "string" ? v : Q4_LABELS[f];
                    return (
                      <li key={f} className={"q4-feat" + (v === false ? " q4-feat-dim" : "")}>
                        <Mark v={v} /><span className="q4-feat-label">{text}</span>
                      </li>
                    );
                  })}
                </ul>
                {disabled
                  ? <span className="q4-card-note">{(t.londonOnly && !isLondon) ? "London postcodes only" : "Not available for this repair"}</span>
                  : <button type="button" className={"q4-card-pick" + (selected ? " q4-card-pick-sel" : "")}
                      onClick={(e) => { e.stopPropagation(); setTierId(t.id); setScreen("schedule"); }}>
                      Select {t.name} <span aria-hidden="true">→</span>
                    </button>}
              </div>
            );
          })}
        </div>

        {/* The promise — the single home for the speed guarantee + risk reversal */}
        <div className="q6-promise">
          <div className="q6-promise-lead">
            <span className="q6-promise-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6L12 3z"/><path d="M8.5 12l2.2 2.2L15.5 9.8"/></svg>
            </span>
            <div className="q6-promise-text">
              {tier.speedFee > 0 ? (
                <>
                  <div className="q6-promise-title">On time, or your <span className="q6-promise-amt">£{tier.speedFee}</span> {tier.name.toLowerCase()} fee comes straight back.</div>
                  <div className="q6-promise-sub">We lock in your {tier.feats.turnaround} date the moment you book. Miss it and the speed fee is refunded automatically — you never have to ask.</div>
                </>
              ) : (
                <>
                  <div className="q6-promise-title">Your date, guaranteed — or the speed fee's on us.</div>
                  <div className="q6-promise-sub">Choose Express or Priority and we commit to the date. If we miss it, the speed fee is refunded in full — automatically.</div>
                </>
              )}
            </div>
          </div>
          <ul className="q6-promise-points" aria-label="Every repair, either way">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l2.5 2.5L16 8"/><circle cx="12" cy="12" r="9"/></svg>
              Find another fault? We don't touch it until you sign off
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // ──────────────────────────── Screen 2: schedule ────────────────────────
  return (
    <div className={"q4 q6" + (method.kind === "mail" ? " q6-mail" : "")}>
      <Header showTotal={true} intro={false} />

      <button type="button" className="q4-back" onClick={() => setScreen("speed")}>← Change plan</button>

      <div className="q4-step-label"><span className="q4-step-num">2</span> How &amp; when</div>

      {tier.sameDay && (
        <div className="q4-sameday-note">
          <strong>Priority is a same-day repair.</strong> Drop in before 11:00 and your {model?.name?.split(" (")[0]} is ready the same afternoon.
        </div>
      )}

      <div className="q6-sched">
        <div className="q6-sched-main">
          <div className="qs-method" role="tablist" aria-label="How it travels">
            {methods.map(m => {
              const lock = tier.sameDay && m.kind !== "dropin";
              return (
                <button key={m.id} role="tab" aria-selected={methodId === m.id} disabled={lock}
                  className={"qs-method-tab" + (methodId === m.id ? " active" : "") + (lock ? " qs-method-lock" : "")}
                  onClick={() => !lock && setMethodId(m.id)}>
                  {m.badge && !lock && <span className="qs-method-tag">{m.badge}</span>}
                  <span className="qs-method-name">{m.name}</span>
                  <span className="qs-method-sub">{lock ? "Not available same-day" : m.sub}</span>
                </button>
              );
            })}
          </div>

          {method.kind !== "mail" ? (
            <div className="qs-when">
              <div className="qs-when-label">{method.kind === "collect" ? "When shall we collect?" : "When will you drop in?"}</div>
              <div className="qs-sub-label">Select a day</div>
              {(() => {
                const upcoming = q4Upcoming(5);
                const sel = new Date(day);
                const inGrid = upcoming.some(d => q4SameDay(d, sel));
                return (
                  <>
                    <div className="qs-day-grid">
                      {upcoming.map((d, i) => (
                        <button key={i} type="button" className={"qs-day" + (q4SameDay(d, sel) ? " active" : "")} onClick={() => { setDay(d.toISOString()); setCalOpen(false); }}>
                          <span className="qs-day-dow">{d.toLocaleDateString("en-GB",{weekday:"short"})}</span>
                          <span className="qs-day-num">{d.getDate()}</span>
                          <span className="qs-day-mon">{d.toLocaleDateString("en-GB",{month:"short"})}</span>
                        </button>
                      ))}
                      <button type="button"
                        className={"qs-day qs-day-more" + (!inGrid ? " active" : "") + (calOpen ? " open" : "")}
                        onClick={() => setCalOpen(o => !o)} aria-expanded={calOpen} aria-label="Pick another date">
                        {!inGrid ? (
                          <>
                            <span className="qs-day-dow">{sel.toLocaleDateString("en-GB",{weekday:"short"})}</span>
                            <span className="qs-day-num">{sel.getDate()}</span>
                            <span className="qs-day-mon">{sel.toLocaleDateString("en-GB",{month:"short"})}</span>
                          </>
                        ) : (
                          <>
                            <span className="qs-day-more-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg></span>
                            <span className="qs-day-more-label">More<br/>dates</span>
                          </>
                        )}
                      </button>
                    </div>
                    {calOpen && (
                      <Q4Calendar value={day} min={earliest} isAllowed={q4IsWD}
                        onPick={(d) => { setDay(d.toISOString()); setCalOpen(false); }}
                        onClose={() => setCalOpen(false)} />
                    )}
                  </>
                );
              })()}
              <div className="qs-sub-label">{method.kind === "collect" ? "Select collection window" : "Select a time"}</div>
              <div className="qs-slot-grid">
                {(method.kind === "collect" ? Q4_COURIER_WINDOWS.map(w => [w.id, w.label]) : Q4_WALKIN_TIMES.map(t => [t, t])).map(([id, label]) => (
                  <button key={id} type="button" className={"qs-slot" + (slot === id ? " active" : "")} onClick={() => setSlot(id)}>{label}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="qs-when qs-when-mail">
              <div className="qs-when-label">Mail-in — how it works</div>
              <div className="q6-mailflow" aria-hidden="true">
                <div className="q6-mailflow-step">
                  <span className="q6-mailflow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l9-4 9 4v8l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v8"/></svg></span>
                  <span className="q6-mailflow-label">We post packaging</span>
                </div>
                <div className="q6-mailflow-step">
                  <span className="q6-mailflow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/></svg></span>
                  <span className="q6-mailflow-label">It reaches you</span>
                </div>
                <div className="q6-mailflow-step">
                  <span className="q6-mailflow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h11v8H2z"/><path d="M13 10h4l4 3v2h-8z"/><circle cx="6" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/></svg></span>
                  <span className="q6-mailflow-label">We collect</span>
                </div>
                <div className="q6-mailflow-step">
                  <span className="q6-mailflow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg></span>
                  <span className="q6-mailflow-label">We repair</span>
                </div>
                <div className="q6-mailflow-step">
                  <span className="q6-mailflow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9 4-9-4 9-4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M9 18l-2-2 2-2"/></svg></span>
                  <span className="q6-mailflow-label">Back to you</span>
                </div>
              </div>
              <p className="qs-mail-note">Book before 3pm and we post protective packaging out the <strong>same day</strong>. Pack your {deviceShort} in, and we arrange a courier to collect — every date in the timeline shifts with the speed you picked.</p>
            </div>
          )}
        </div>

        {/* Repair timeline — ported from v3/v5, sits beside the picker */}
        <div className="qw-timeline q6-timeline" role="list">
          <div className="qw-timeline-head">
            <div className="qs-when-label" style={{ marginBottom: 0 }}>Your repair timeline</div>
            <div className="qw-timeline-promise">Booking reserves your part and bench slot — every date below becomes a guarantee.</div>
          </div>
          <ol className="qw-timeline-steps">
            {timeline.map((s, i) => (
              <li key={i} className={"qw-timeline-step" + (s.final ? " qw-timeline-step-final" : "")} role="listitem">
                <div className="qw-timeline-marker">{s.final ? "✓" : i + 1}</div>
                <div className="qw-timeline-body">
                  <div className="qw-timeline-label">{s.label}</div>
                  <div className="qw-timeline-date">{s.date}</div>
                  {s.note && <div className="qw-timeline-note">{s.note}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── Book bar — summary + commit ───────────────────────────────────── */}
      <div className="q4-book">
        <div className="q4-book-summary">
          <div className="q4-book-line">
            <span className="q4-book-plan">{tier.name}</span>
            <span className="q4-book-dot">·</span>
            <span className="q4-book-method">{method.name}</span>
          </div>
          <div className="q4-book-ready">
            <span className="q4-book-ready-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4"/></svg></span>
            Ready by <strong>{q4Fmt(readyFor(tier))}</strong>
          </div>
        </div>
        <div className="q4-book-action">
          <div className="q4-book-total">
            <span className="q4-book-total-num">£{total}</span>
            <span className="q4-book-total-sub">
              £{price} repair{method.fee ? ` + £${method.fee} ${method.kind === "mail" ? "post" : "courier"}` : ""}{tier.speedFee ? ` + £${tier.speedFee} ${tier.name.toLowerCase()}` : ""}
            </span>
          </div>
          <button className="q4-book-btn" onClick={() => setBooked(true)}>Book this repair <span aria-hidden="true">→</span></button>
        </div>
      </div>

      <div className="qs-reassure">
        <span>★ 4.8 · 719 reviews</span><span className="qs-sep">·</span>
        <span>No payment until we inspect</span><span className="qs-sep">·</span>
        <span>£0 if unfixable</span>
        {onChangePostcode && <><span className="qs-sep">·</span><button className="qs-change" onClick={onChangePostcode}>Change postcode</button></>}
      </div>
    </div>
  );
}

Object.assign(window, { QuoteTiersV6 });
