// ═══════════════════════════════════════════════════════════════════════════
//  Diagnose — flow + outcome renderers (estimate model)
//
//  Stages:  device → fault → symptoms (live tree) → outcome
//  Only iphone:battery runs the live tree; every other combo → TALK TO US.
//  Loaded after qw/diagnose-data.jsx.
// ═══════════════════════════════════════════════════════════════════════════

const DG_LS = "icorrect-diagnose-v2";

function loadDg() {
  try { const r = localStorage.getItem(DG_LS); if (r) return JSON.parse(r); } catch {}
  return { stage: "device", deviceId: null, faultId: null, nodeId: null, history: [], outcomeId: null };
}
function useDg() {
  const [s, setS] = React.useState(loadDg);
  React.useEffect(() => { try { localStorage.setItem(DG_LS, JSON.stringify(s)); } catch {} }, [s]);
  const reset = () => setS({ stage: "device", deviceId: null, faultId: null, nodeId: null, history: [], outcomeId: null });
  return [s, setS, reset];
}

const money = n => "£" + Number(n).toLocaleString("en-GB");

// ── Progress rail (left) ────────────────────────────────────────────────────
const DG_STEPS = [
  { id: "device",   label: "Device" },
  { id: "fault",    label: "Fault" },
  { id: "symptoms", label: "Symptoms" },
  { id: "outcome",  label: "Result" },
];
function DgProgress({ stage }) {
  const idx = DG_STEPS.findIndex(s => s.id === stage);
  return (
    <ol className="dg-progress" aria-label="Progress">
      {DG_STEPS.map((s, i) => (
        <li key={s.id} className={"dg-progress-step" + (i < idx ? " is-done" : i === idx ? " is-current" : "")}>
          <span className="dg-progress-dot">{i < idx ? "✓" : i + 1}</span>
          <span className="dg-progress-label">{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function DgHead({ stage, onBack }) {
  return (
    <div className="dg-head">
      <div className="dg-head-left">
        <span className="dg-kicker">Diagnose · what's wrong</span>
      </div>
      {onBack && <button type="button" className="dg-back" onClick={onBack}>← Back</button>}
    </div>
  );
}

// ── Stage 1: Device ─────────────────────────────────────────────────────────
function DgDevice({ onPick }) {
  return (
    <div className="dg-stage">
      <h2 className="dg-title">What needs fixing?</h2>
      <p className="dg-sub">Pick your device — we'll narrow down the fault from there.</p>
      <div className="dg-grid dg-grid-device">
        {DIAG_DEVICES.map(d => (
          <button key={d.id} type="button" className="dg-card dg-card-device" onClick={() => onPick(d.id)}>
            <span className="dg-card-icon"><DiagIcon name={d.id} /></span>
            <span className="dg-card-name">{d.name}</span>
            <span className="dg-card-detail">{d.detail}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Stage 2: Fault ──────────────────────────────────────────────────────────
function DgFault({ deviceId, onPick }) {
  const faults = DIAG_FAULTS[deviceId] || [];
  return (
    <div className="dg-stage">
      <h2 className="dg-title">What kind of fault?</h2>
      <p className="dg-sub">Pick the closest area — a few quick questions will pin down the cause and the cost.</p>
      <div className="dg-fault-list">
        {faults.map(f => (
          <button key={f.id} type="button" className="dg-fault" onClick={() => onPick(f.id)}>
            <span className="dg-fault-icon"><DiagIcon name={f.icon} /></span>
            <span className="dg-fault-label">{f.label}</span>
            <span className="dg-fault-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Stage 3: Symptoms (decision tree) ───────────────────────────────────────
function DgSymptoms({ state, setState, onOutcome }) {
  const tree = DIAG_TREES[`${state.deviceId}:${state.faultId}`];
  const nodeId = state.nodeId || tree?.root;
  const node = tree?.nodes?.[nodeId];

  React.useEffect(() => {
    if (node && node.terminal) onOutcome(nodeId);
    // eslint-disable-next-line
  }, [nodeId]);

  if (!node || node.terminal) return null;

  const pick = (a) => setState(s => ({
    ...s,
    nodeId: a.next,
    history: [...s.history, { nodeId, evidence: a.evidence }],
  }));

  const stepNum = state.history.length + 1;

  return (
    <div className="dg-stage dg-symptoms">
      {state.history.length > 0 && (
        <div className="dg-trail">
          <span className="dg-trail-head">What you've told us</span>
          <ul className="dg-trail-list">
            {state.history.map((h, i) => (
              <li key={i} className="dg-trail-item"><span className="dg-trail-tick" aria-hidden="true">✓</span>{h.evidence}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="dg-q">
        <span className="dg-q-step">Question {stepNum}</span>
        <h2 className="dg-q-text">{node.question}</h2>
        {node.hint && <p className="dg-q-hint">{node.hint}</p>}
        <div className="dg-answers">
          {node.answers.map((a, i) => (
            <button key={i} type="button" className="dg-answer" onClick={() => pick(a)}>
              <span className="dg-answer-body">
                <span className="dg-answer-label">{a.label}</span>
                {a.detail && <span className="dg-answer-detail">{a.detail}</span>}
              </span>
              <span className="dg-answer-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ OUTCOME RENDERERS ═══════════════════════════════════════════════════════

function DgTag({ kind }) {
  const map = {
    quote:    ["QUOTE", "dg-tag-quote"],
    estimate: ["ESTIMATE", "dg-tag-estimate"],
    fixed:    ["FIXED AT HOME", "dg-tag-fixed"],
    data:     ["DATA RECOVERY", "dg-tag-data"],
    talk:     ["TALK TO US", "dg-tag-talk"],
  };
  const [label, cls] = map[kind] || map.talk;
  return <span className={"dg-tag " + cls}>{label}</span>;
}

// Diagnostic-fee reassurance line — shared by estimate + data
function DgDiagnosticLine() {
  return (
    <div className="dg-dxline">
      <span className="dg-dxline-amt">{money(DIAG_PRICE.diagnostic)} diagnostic</span>
      <span className="dg-dxline-note">— a separate, one-off charge. You approve the repair quote before any work starts.</span>
    </div>
  );
}

// ── QUOTE ✓ — firm price ──
function DgOutQuote({ node, onBook }) {
  return (
    <div className="dg-out">
      <div className="dg-out-head"><DgTag kind="quote" /><span className="dg-out-eyebrow">A known repair — firm price</span></div>
      <h2 className="dg-out-title">{node.title}</h2>
      <p className="dg-out-summary">{node.summary}</p>
      <div className="dg-quote-card">
        <div className="dg-quote-rows">
          <div className="dg-quote-row"><span>Repair</span><span>{node.repair}</span></div>
          <div className="dg-quote-row"><span>Turnaround</span><span>{node.turnaround}</span></div>
        </div>
        <div className="dg-quote-price">
          <span className="dg-quote-price-label">Price</span>
          <span className="dg-quote-price-num">{money(node.price)}</span>
        </div>
      </div>
      <div className="dg-out-ctas">
        <button type="button" className="dg-cta dg-cta-primary" onClick={onBook}>Book this repair <span aria-hidden="true">→</span></button>
        <a className="dg-cta dg-cta-ghost" href="tel:+442070998517">Questions? Call us</a>
      </div>
    </div>
  );
}

// ── ESTIMATE — a range you can SEE built up from priced, weighted stages.
//    Reusable: diagnose tool + quote side both render this.
//    factors[]: { label, note, price, base?, chance, weight (1–4), level }
function EstLikelihood({ weight = 2, chance }) {
  return (
    <span className="dg-est-chance" title={chance}>
      <span className="dg-est-dots" aria-hidden="true">
        {[1, 2, 3, 4].map(i => <span key={i} className={"dg-est-dot" + (i <= weight ? " on" : "")} />)}
      </span>
      <span className="dg-est-chance-label">{chance}</span>
    </span>
  );
}

function EstimateResult({ band, factors, typical, summary, dataNote, title, onBook, compact }) {
  const [lo, hi] = band;
  const tLo = typical ? typical[0] : lo;
  const tHi = typical ? typical[1] : Math.round(lo + (hi - lo) * 0.5);
  const clamp = v => Math.max(0, Math.min(100, v));
  const pct = v => clamp(((v - lo) / (hi - lo)) * 100);
  const priced = factors && factors.some(f => f.price != null);

  return (
    <div className={"dg-estimate" + (compact ? " is-compact" : "")}>
      {/* Headline range + where most jobs actually land */}
      <div className="dg-est-top">
        <div className="dg-est-bandwrap">
          <span className="dg-est-band-label">Estimate range</span>
          <span className="dg-est-band">{money(lo)}<span className="dg-est-band-dash">–</span>{money(hi)}</span>
        </div>
        <div className="dg-est-typical">
          <span className="dg-est-typical-label">Most jobs land</span>
          <span className="dg-est-typical-val">{money(tLo)}–{money(tHi)}</span>
        </div>
      </div>

      {/* Visual track — the band, with the typical zone shaded */}
      <div className="dg-est-track">
        <div className="dg-est-track-rail">
          <span className="dg-est-track-zone" style={{ left: pct(tLo) + "%", right: (100 - pct(tHi)) + "%" }} />
        </div>
        <div className="dg-est-track-ends">
          <span>{money(lo)} · best case</span>
          <span>{money(hi)} · worst case</span>
        </div>
      </div>

      {/* The build-up — each priced stage, weighted by how likely it is */}
      {factors && factors.length > 0 && (
        <div className="dg-est-build">
          <span className="dg-est-build-head">How the range is built</span>
          <ul className="dg-est-factors">
            {factors.map((f, i) => (
              <li key={i} className={"dg-est-factor lvl-" + (f.level || "mid")}>
                <span className="dg-est-factor-main">
                  <span className="dg-est-factor-label">{f.base ? "" : "+ "}{f.label}</span>
                  {f.note && <span className="dg-est-factor-note">{f.note}</span>}
                </span>
                <span className="dg-est-factor-right">
                  {f.price != null && (
                    <span className="dg-est-factor-price">{f.base ? "" : "+"}{money(f.price)}</span>
                  )}
                  {f.chance && <EstLikelihood weight={f.weight} chance={f.chance} />}
                </span>
              </li>
            ))}
          </ul>
          {priced && (
            <div className="dg-est-build-foot">
              <span>Just the essentials</span>
              <span>{money(lo)}</span>
            </div>
          )}
        </div>
      )}

      {dataNote && <p className="dg-est-datanote">{dataNote}</p>}
      <DgDiagnosticLine />
      <p className="dg-est-agency">Every add-on above is confirmed before we touch it — you sign off the figure, we never decide it for you.</p>
    </div>
  );
}

function DgOutEstimate({ node, onBook }) {
  return (
    <div className="dg-out">
      <div className="dg-out-head"><DgTag kind="estimate" /><span className="dg-out-eyebrow">Probable repair — confirmed on the bench</span></div>
      <h2 className="dg-out-title">{node.title}</h2>
      <p className="dg-out-summary">{node.summary}</p>
      <EstimateResult band={node.band} factors={node.factors} dataNote={node.dataNote} />
      <div className="dg-out-ctas">
        <button type="button" className="dg-cta dg-cta-primary" onClick={onBook}>Book diagnostic &amp; repair <span aria-hidden="true">→</span></button>
        <a className="dg-cta dg-cta-ghost" href="tel:+442070998517">Talk it through first</a>
      </div>
    </div>
  );
}

// ── FIXED AT HOME — free fix to try, optional fallback ──
function DgOutFixed({ node, onBook }) {
  return (
    <div className="dg-out">
      <div className="dg-out-head"><DgTag kind="fixed" /><span className="dg-out-eyebrow">You might fix this for free</span></div>
      <h2 className="dg-out-title">{node.title}</h2>
      <p className="dg-out-summary">{node.summary}</p>
      <ol className="dg-steps">
        {node.steps.map((s, i) => (
          <li key={i} className="dg-step"><span className="dg-step-num">{i + 1}</span><span className="dg-step-text">{s}</span></li>
        ))}
      </ol>
      {node.fallback && (
        <div className="dg-fallback">
          <span className="dg-fallback-q">{node.fallback.label}</span>
          {node.fallback.outcome === "quote" ? (
            <span className="dg-fallback-a">It's likely a <strong>{node.fallback.repair}</strong> — {money(node.fallback.price)}, fixed price.</span>
          ) : (
            <span className="dg-fallback-a">Then it's hardware — we'll give you an honest range and the {money(DIAG_PRICE.diagnostic)} diagnostic (a separate charge) confirms it.</span>
          )}
        </div>
      )}
      <div className="dg-out-ctas">
        <button type="button" className="dg-cta dg-cta-primary" onClick={onBook}>It didn't work — book it in <span aria-hidden="true">→</span></button>
        <a className="dg-cta dg-cta-ghost" href="tel:+442070998517">Ask us first</a>
      </div>
    </div>
  );
}

// ── DATA RECOVERY ──
function DgOutData({ node, onBook }) {
  return (
    <div className="dg-out">
      <div className="dg-out-head"><DgTag kind="data" /><span className="dg-out-eyebrow">Data-led — handled separately</span></div>
      <h2 className="dg-out-title">{node.title}</h2>
      <p className="dg-out-summary">{node.summary}</p>
      <div className="dg-data-card">
        <span className="dg-data-from">From {money(node.from)}</span>
        <span className="dg-data-note">Separate quote — the figure depends on what's needed to reach the data safely. We assess before any charge.</span>
      </div>
      <div className="dg-out-ctas">
        <button type="button" className="dg-cta dg-cta-primary" onClick={onBook}>Start data recovery <span aria-hidden="true">→</span></button>
        <a className="dg-cta dg-cta-ghost" href="tel:+442070998517">Talk to a specialist</a>
      </div>
    </div>
  );
}

// ── TALK TO US (liquid / unbuilt faults) ──
function DgOutTalk({ node, deviceId, faultId }) {
  const fault = (DIAG_FAULTS[deviceId] || []).find(f => f.id === faultId);
  const summary = node?.summary || `This one's best handled in person. Tell us about the ${fault ? fault.label.toLowerCase() : "fault"} and we'll scope it properly — most jobs end on a firm price or an honest range once we've seen it.`;
  return (
    <div className="dg-out">
      <div className="dg-out-head"><DgTag kind="talk" /><span className="dg-out-eyebrow">{node?.reason || "Best handled in person"}</span></div>
      <h2 className="dg-out-title">{node?.title || "Let's take a look"}</h2>
      <p className="dg-out-summary">{summary}</p>
      {node?.safety && (
        <div className="dg-safety">
          <span className="dg-safety-head">Right now — before anything else</span>
          <ul className="dg-safety-list">
            {node.safety.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
      <div className="dg-access">
        <div className="dg-access-card">
          <span className="dg-access-label">Walk in</span>
          <span className="dg-access-val">12 Margaret Street, Fitzrovia W1W 8JQ</span>
          <span className="dg-access-sub">Mon–Fri · opposite the London Palladium</span>
        </div>
        <div className="dg-access-card">
          <span className="dg-access-label">Call</span>
          <span className="dg-access-val">+44 (0)207 099 8517</span>
          <span className="dg-access-sub">We'll tell you the likely path before you travel</span>
        </div>
      </div>
      <div className="dg-out-ctas">
        <a className="dg-cta dg-cta-primary" href="tel:+442070998517">Call the workshop <span aria-hidden="true">→</span></a>
        <a className="dg-cta dg-cta-ghost" href="How It Works.html">How it works</a>
      </div>
    </div>
  );
}

// ── Outcome router ──
function DgOutcome({ state, onBook }) {
  const tree = DIAG_TREES[`${state.deviceId}:${state.faultId}`];
  const node = state.outcomeId ? tree?.nodes?.[state.outcomeId] : null;

  // No worked tree, or forced talk → TALK TO US
  if (!node) return <DgOutTalk node={null} deviceId={state.deviceId} faultId={state.faultId} />;

  switch (node.outcome) {
    case "quote":    return <DgOutQuote node={node} onBook={onBook} />;
    case "estimate": return <DgOutEstimate node={node} onBook={onBook} />;
    case "fixed":    return <DgOutFixed node={node} onBook={onBook} />;
    case "data":     return <DgOutData node={node} onBook={onBook} />;
    case "talk":     return <DgOutTalk node={node} deviceId={state.deviceId} faultId={state.faultId} />;
    default:         return <DgOutTalk node={null} deviceId={state.deviceId} faultId={state.faultId} />;
  }
}

// ═══ SHELL ═══════════════════════════════════════════════════════════════════
function Diagnose({ onBook, onClose }) {
  const [state, setState, reset] = useDg();

  const goBack = () => setState(s => {
    if (s.stage === "outcome") {
      // back into the tree (or to fault if there was no tree)
      const tree = DIAG_TREES[`${s.deviceId}:${s.faultId}`];
      if (!tree) return { ...s, stage: "fault", outcomeId: null };
      if (s.history.length === 0) return { ...s, stage: "fault", outcomeId: null, nodeId: null };
      const last = s.history[s.history.length - 1];
      return { ...s, stage: "symptoms", outcomeId: null, nodeId: last.nodeId, history: s.history.slice(0, -1) };
    }
    if (s.stage === "symptoms") {
      if (s.history.length === 0) return { ...s, stage: "fault", nodeId: null };
      const last = s.history[s.history.length - 1];
      return { ...s, nodeId: last.nodeId, history: s.history.slice(0, -1) };
    }
    if (s.stage === "fault") return { ...s, stage: "device", faultId: null };
    return s;
  });

  const pickDevice = (deviceId) => setState(s => ({ ...s, deviceId, stage: "fault", faultId: null }));
  const pickFault = (faultId) => setState(s => {
    const hasTree = !!DIAG_TREES[`${s.deviceId}:${faultId}`];
    return { ...s, faultId, nodeId: null, history: [], outcomeId: null, stage: hasTree ? "symptoms" : "outcome" };
  });

  const book = () => {
    const payload = { device: state.deviceId, fault: state.faultId, outcome: state.outcomeId };
    if (onBook) onBook(payload);
  };

  const showBack = state.stage !== "device";

  return (
    <div className="dg">
      <aside className="dg-rail">
        <div className="dg-rail-brand">iCorrect</div>
        <DgProgress stage={state.stage} />
        <div className="dg-rail-foot">
          <p className="dg-rail-note">Every answer narrows it down — exactly how we work on the bench. You'll land on a price, an honest range, or a free fix to try.</p>
          <button type="button" className="dg-rail-restart" onClick={reset}>↺ Start over</button>
        </div>
      </aside>

      <div className="dg-main">
        <DgHead stage={state.stage} onBack={showBack ? goBack : null} />
        <div className="dg-body">
          {state.stage === "device" && <DgDevice onPick={pickDevice} />}
          {state.stage === "fault" && <DgFault deviceId={state.deviceId} onPick={pickFault} />}
          {state.stage === "symptoms" && (
            <DgSymptoms state={state} setState={setState}
              onOutcome={(nodeId) => setState(s => ({ ...s, stage: "outcome", outcomeId: nodeId }))} />
          )}
          {state.stage === "outcome" && <DgOutcome state={state} onBook={book} />}
        </div>
      </div>
    </div>
  );
}

// ═══ MODAL WRAPPER ═══════════════════════════════════════════════════════════
// Drop <DiagnoseModal/> once on any page. Opens when a "Help me diagnose"
// control dispatches window.dispatchEvent(new Event('icorrect:diagnose-open')),
// or on a #diagnose hash. Esc / back-button / scrim close it.
function DiagnoseModal() {
  const [open, setOpen] = React.useState(() => window.location.hash.startsWith("#diagnose"));

  React.useEffect(() => {
    const openFn = () => {
      if (!window.location.hash.startsWith("#diagnose")) history.pushState(null, "", "#diagnose");
      setOpen(true);
    };
    const onHash = () => setOpen(window.location.hash.startsWith("#diagnose"));
    window.addEventListener("icorrect:diagnose-open", openFn);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("icorrect:diagnose-open", openFn);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const close = React.useCallback(() => {
    if (window.location.hash === "#diagnose") history.back();
    else setOpen(false);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, close]);

  const book = (payload) => {
    // Hand off to the quote/booking flow. For now, route to the collection
    // quote wizard; the booking spine is shared. (Logic owner can refine.)
    window.location.href = "MacBook Screen Collection.html#wizard";
  };

  if (!open) return null;
  return (
    <div className="qm7-overlay" role="dialog" aria-modal="true" aria-label="Diagnose your fault">
      <div className="qm7-scrim" onClick={close} />
      <div className="qm7-panel dg-panel">
        <button type="button" className="qm7-close" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <Diagnose onBook={book} onClose={close} />
      </div>
    </div>
  );
}

Object.assign(window, { Diagnose, EstimateResult, DiagnoseModal });
