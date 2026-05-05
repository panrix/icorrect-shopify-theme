// HeroDiagnose — the "Help me diagnose" journey.
//
// Five-stage flow:
//   1. Device     → which kind of device
//   2. Model      → which exact model (skippable, with visual-guide helper)
//   3. Fault      → fault category
//   4. Symptoms   → guided 3–6 question diagnostic tree
//   5. Diagnosis  → confidence + eliminated trail + 3 CTAs
//
// Lives in place of the marketing hero. URL synced to #diagnose. Esc / back
// button closes. State persisted in localStorage so refresh-mid-flow is OK.

const DIAG_LS = "icorrect-diag-v1";

function loadDiagState() {
  try {
    const raw = localStorage.getItem(DIAG_LS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    stage: "device",   // device | model | fault | symptoms | diagnosis
    deviceId: null,
    modelName: null,
    modelSkipped: false,
    faultId: null,
    nodeId: null,        // current node in the tree
    history: [],         // [{ nodeId, answer: { label, evidence } }, ...]
    diagnosisId: null,   // terminal node id once we hit one
  };
}
function saveDiagState(s) { try { localStorage.setItem(DIAG_LS, JSON.stringify(s)); } catch {} }

function useDiagState() {
  const [state, setState] = React.useState(loadDiagState);
  React.useEffect(() => { saveDiagState(state); }, [state]);

  const reset = () => setState({
    stage: "device", deviceId: null, modelName: null, modelSkipped: false,
    faultId: null, nodeId: null, history: [], diagnosisId: null,
  });

  return [state, setState, reset];
}

// Stage labels for the breadcrumb + workshop notes
const STAGE_LABELS = {
  device:     "Step 1 of 5 · Device",
  model:      "Step 2 of 5 · Model",
  fault:      "Step 3 of 5 · Fault area",
  symptoms:   "Step 4 of 5 · Symptoms",
  diagnosis:  "Step 5 of 5 · Diagnosis",
};

// Workshop-notes copy per stage. Keeps the rail purposeful, not filler.
function railCopy(stage, state) {
  switch (stage) {
    case "device": return {
      eyebrow: "Workshop notes",
      title: "Most common at this stage",
      items: [
        { kind: "iPhone",  note: "Screen, battery, rear glass — fixed-price repairs while-you-wait" },
        { kind: "MacBook", note: "Flexgate, backlight ICs, liquid recovery — board-level work" },
        { kind: "iPad",    note: "Glass, charging port, battery — most fixes 2–4 days" },
        { kind: "Watch",   note: "Screen replacements, battery, water seal restoration" },
      ],
      footer: "Don't see your device? Pick anything — there's a \"none of these\" option on the next step.",
    };
    case "model": return {
      eyebrow: "Why we ask",
      title: "Model affects pricing, not diagnosis",
      items: [
        { kind: "Skip if unsure",        note: "We can diagnose most faults without knowing the exact model." },
        { kind: "Visual guide",          note: "Camera layout, edges, screen — we'll narrow it down." },
        { kind: "About this Mac / Settings", note: "Apple → About This Mac (macOS), Settings → General → About (iOS)." },
      ],
      footer: "Skipping is fine — we'll just need the model later if you want a fixed price.",
    };
    case "fault": return {
      eyebrow: "Workshop notes",
      title: "What we mean by each",
      items: [
        { kind: "Screen / Display", note: "Cracks, lines, flicker, dead pixels, backlight, touch issues" },
        { kind: "Power / Battery",  note: "Won't charge, drains fast, random shutdowns, swelling" },
        { kind: "Water Damage",     note: "Anything liquid-related — coffee, rain, full submersion" },
        { kind: "Something else",   note: "Pick this if your fault straddles categories. We'll guide you." },
      ],
    };
    case "symptoms": return {
      eyebrow: "What we're doing",
      title: "Eliminating possibilities",
      items: [
        { kind: "Each question narrows it down", note: "Most faults have 3–4 plausible causes. We rule them out one at a time." },
        { kind: "We work like this on the bench too", note: "Same questions, same elimination order — we just do it with the device in hand." },
        { kind: "Skip any time",                   note: "If you'd rather we just look at it, click \"book pre-diagnosis\" below." },
      ],
      footer: state.history?.length
        ? `So far: ${state.history.length} thing${state.history.length === 1 ? "" : "s"} eliminated.`
        : null,
    };
    case "diagnosis": return {
      eyebrow: "Workshop notes",
      title: "What happens next",
      items: [
        { kind: "Drop-off in Fitzrovia",  note: "12 Margaret Street · open Mon–Fri" },
        { kind: "Free UK collection",     note: "Tracked, insured, signed-for both ways" },
        { kind: "Two-year warranty",      note: "On the part and the labour" },
      ],
      footer: "Diagnosis confidence reflects what we can tell from your answers. In-person scope is always more accurate.",
    };
    default: return null;
  }
}

/* ===== Breadcrumb ===== */
function DiagBreadcrumb({ stage, onClose, onJump, history }) {
  const stages = ["device", "model", "fault", "symptoms", "diagnosis"];
  const idx = stages.indexOf(stage);
  return (
    <div className="diag-breadcrumb">
      <button className="diag-back" onClick={onClose} aria-label="Back to homepage">
        <span className="diag-back-arrow">←</span>
        <span>Back</span>
      </button>
      <span className="diag-bc-sep" aria-hidden="true">/</span>
      <span className="diag-bc-trail">Diagnostic</span>
      <span className="diag-bc-sep" aria-hidden="true">/</span>
      <span className="diag-bc-step">{STAGE_LABELS[stage]}</span>
    </div>
  );
}

/* ===== Right rail ===== */
function DiagRail({ stage, state }) {
  const copy = railCopy(stage, state);
  if (!copy) return null;
  return (
    <aside className="diag-rail" aria-label="Workshop notes">
      <div className="diag-rail-head">
        <span className="diag-rail-eyebrow">{copy.eyebrow}</span>
        <h3 className="diag-rail-title">{copy.title}</h3>
      </div>
      <ul className="diag-rail-list">
        {copy.items.map((it, i) => (
          <li key={i} className="diag-rail-item">
            <span className="diag-rail-kind">{it.kind}</span>
            <span className="diag-rail-note">{it.note}</span>
          </li>
        ))}
      </ul>
      {copy.footer && <p className="diag-rail-aside">{copy.footer}</p>}
    </aside>
  );
}

/* ===== Stage 1: Device ===== */
function DiagStepDevice({ onPick }) {
  return (
    <div className="diag-stage">
      <h2 className="diag-q-title">What needs fixing?</h2>
      <p className="diag-q-sub">Pick your device. We'll take it from there.</p>
      <div className="diag-device-grid">
        {DIAG_DEVICES.map(d => (
          <button key={d.id} className="diag-device-card" onClick={() => onPick(d.id)}>
            <span className="diag-device-icon">
              <DiagIcon name={d.id} />
            </span>
            <span className="diag-device-name">{d.name}</span>
            <span className="diag-device-detail">{d.detail}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===== Stage 2: Model (skippable) ===== */
function DiagStepModel({ deviceId, onPickModel, onSkip, onBack }) {
  const groups = DIAG_MODELS[deviceId] || [];
  const [openGroup, setOpenGroup] = React.useState(null);
  const [helperOpen, setHelperOpen] = React.useState(false);

  return (
    <div className="diag-stage">
      <button className="diag-textback" onClick={onBack}>← Back to device</button>
      <h2 className="diag-q-title">Which model?</h2>
      <p className="diag-q-sub">
        This helps us give you a price later. <strong>You can skip it</strong> — we can diagnose most faults without it.
      </p>

      <div className="diag-model-groups">
        {groups.map(g => {
          const open = openGroup === g.g;
          return (
            <div key={g.g} className={"diag-mg " + (open ? "is-open" : "")}>
              <button className="diag-mg-head" onClick={() => setOpenGroup(open ? null : g.g)}>
                <span>
                  <strong>{g.g}</strong>
                  <span className="diag-mg-count">{g.m.length} variant{g.m.length === 1 ? "" : "s"}</span>
                </span>
                <span className="diag-mg-chev" aria-hidden="true">⌄</span>
              </button>
              {open && (
                <div className="diag-mg-list">
                  {g.m.map(m => (
                    <button key={m.n} className="diag-mg-item" onClick={() => onPickModel(m.n)}>
                      <span>{m.n}</span>
                      <span className="diag-mg-y">{m.y}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="diag-model-actions">
        <button className="diag-helper-trigger" onClick={() => setHelperOpen(o => !o)}>
          <span aria-hidden="true">🔍</span> Not sure which one? <span style={{textDecoration:"underline"}}>Help me identify it</span>
        </button>
        <button className="diag-skip" onClick={onSkip}>
          I don't know — keep going <span aria-hidden="true">→</span>
        </button>
      </div>

      {helperOpen && (
        <div className="diag-helper">
          <p className="diag-helper-lede">
            <strong>Quickest way:</strong> Apple menu → <em>About This Mac</em> (macOS), or Settings → General → About (iPhone / iPad / Watch). Look for the marketing name (e.g. "MacBook Pro (16-inch, 2021)") or the model identifier (A2442).
          </p>
          <p className="diag-helper-lede" style={{marginTop: 12}}>
            <strong>For iPhone:</strong> we have a visual guide based on camera layout and edges — <a href="#">launch visual guide →</a>
          </p>
        </div>
      )}
    </div>
  );
}

/* ===== Stage 3: Fault ===== */
function DiagStepFault({ deviceId, onPick, onBack }) {
  const faults = DIAG_FAULTS[deviceId] || DIAG_FAULTS.iphone;
  return (
    <div className="diag-stage">
      <button className="diag-textback" onClick={onBack}>← Back</button>
      <h2 className="diag-q-title">What kind of fault?</h2>
      <p className="diag-q-sub">Pick the area that's affected. We'll narrow down the cause next.</p>
      <div className="diag-fault-grid">
        {faults.map(f => (
          <button key={f.id} className="diag-fault-card" onClick={() => onPick(f.id)}>
            <span className="diag-fault-icon">
              <DiagIcon name={f.icon} />
            </span>
            <span className="diag-fault-label">{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===== Stage 4: Symptoms — the decision tree ===== */
function DiagStepSymptoms({ state, setState, onBack, onAdvance, onPrediag }) {
  const treeKey = `${state.deviceId}:${state.faultId}`;
  const tree = DIAG_TREES[treeKey];
  const nodeId = state.nodeId || tree?.root;
  const node = tree?.nodes?.[nodeId];

  if (!tree || !node) {
    return (
      <div className="diag-stage">
        <p>Something's missing — let's book you a free pre-diagnosis.</p>
        <button className="diag-cta-primary" onClick={onPrediag}>Book pre-diagnosis →</button>
      </div>
    );
  }

  // If it's a terminal node, advance to diagnosis stage
  React.useEffect(() => {
    if (node.terminal) onAdvance(nodeId);
    // eslint-disable-next-line
  }, [nodeId, node.terminal]);

  const pickAnswer = (answer) => {
    setState(s => ({
      ...s,
      nodeId: answer.next,
      history: [...s.history, { nodeId, question: node.question, answer: { label: answer.label, evidence: answer.evidence } }],
    }));
  };

  const stepNum = state.history.length + 1;

  return (
    <div className="diag-stage diag-symptoms">
      <button className="diag-textback" onClick={onBack}>← Back</button>

      {/* Eliminated trail — what we know so far */}
      {state.history.length > 0 && (
        <div className="diag-trail">
          <div className="diag-trail-head">What you've told us</div>
          <ol className="diag-trail-list">
            {state.history.map((h, i) => (
              <li key={i} className="diag-trail-item">
                <span className="diag-trail-num">{i + 1}</span>
                <span className="diag-trail-text">{h.answer.evidence || h.answer.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="diag-question-card">
        <span className="diag-q-step">Question {stepNum}</span>
        <h3 className="diag-q-text">{node.question}</h3>
        {node.hint && <p className="diag-q-hint">{node.hint}</p>}
        <div className="diag-answers">
          {node.answers.map((a, i) => (
            <button key={i} className="diag-answer" onClick={() => pickAnswer(a)}>
              <span className="diag-answer-main">
                <span className="diag-answer-label">{a.label}</span>
                {a.detail && <span className="diag-answer-detail">{a.detail}</span>}
              </span>
              <span className="diag-answer-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="diag-symptoms-foot">
        <button className="diag-skip-quiet" onClick={onPrediag}>
          Skip the questions — book a free pre-diagnosis →
        </button>
      </div>
    </div>
  );
}

/* ===== Stage 5: Diagnosis ===== */
function DiagStepDiagnosis({ state, onReset, onBack }) {
  const tree = DIAG_TREES[`${state.deviceId}:${state.faultId}`];
  const node = tree?.nodes?.[state.diagnosisId];
  if (!node) return null;

  const conf = node.confidence || "medium";
  const confLabel = { high: "High confidence", medium: "Likely", low: "Possible — needs verification" }[conf];

  return (
    <div className="diag-stage diag-diagnosis">
      <button className="diag-textback" onClick={onBack}>← Adjust answers</button>

      <div className={"diag-diag-card conf-" + conf}>
        <div className="diag-diag-head">
          <span className={"diag-conf-pill conf-" + conf}>
            <span className="diag-conf-dot" />
            {confLabel}
          </span>
          <span className="diag-diag-eyebrow">Most likely diagnosis</span>
        </div>
        <h2 className="diag-diag-title">{node.title}</h2>
        <p className="diag-diag-summary">{node.summary}</p>

        {node.repair && !node.prediagnosis && (
          <div className="diag-repair">
            <div className="diag-repair-row">
              <span className="diag-repair-label">Repair</span>
              <span className="diag-repair-value">{node.repair.name}</span>
            </div>
            <div className="diag-repair-row">
              <span className="diag-repair-label">From</span>
              <span className="diag-repair-value diag-repair-price">£{node.repair.priceFrom}</span>
            </div>
            <div className="diag-repair-row">
              <span className="diag-repair-label">Turnaround</span>
              <span className="diag-repair-value">{node.repair.days}</span>
            </div>
          </div>
        )}

        {/* Eliminated summary */}
        {state.history.length > 0 && (
          <details className="diag-eliminated">
            <summary>What we eliminated to get here ({state.history.length})</summary>
            <ul>
              {state.history.map((h, i) => (
                <li key={i}>{h.answer.evidence || h.answer.label}</li>
              ))}
            </ul>
          </details>
        )}

        {/* CTAs — order changes based on path */}
        <div className="diag-diag-ctas">
          {node.prediagnosis ? (
            <>
              <a href="#" className="diag-cta-primary">Book free pre-diagnosis →</a>
              <a href="#" className="diag-cta-secondary">Talk to a specialist</a>
            </>
          ) : (
            <>
              <a href="#" className="diag-cta-primary">
                {state.modelName ? `Get a fixed quote for my ${state.modelName.split(' ').slice(0,3).join(' ')}` : "Get a fixed quote"} →
              </a>
              <a href="#" className="diag-cta-secondary">Book free pre-diagnosis instead</a>
            </>
          )}
          {node.reading && (
            <a href={node.reading.url} className="diag-cta-tertiary">
              Read more: {node.reading.title} →
            </a>
          )}
        </div>
      </div>

      <button className="diag-restart" onClick={onReset}>
        ↺ Start a new diagnostic
      </button>
    </div>
  );
}

/* ===== The shell ===== */
function HeroDiagnose({ onClose }) {
  const [state, setState, reset] = useDiagState();

  // Esc to close
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setStage = (stage, patch = {}) => setState(s => ({ ...s, stage, ...patch }));

  return (
    <section className="hp-hero hp-hero-diagnose">
      <div className="container hp-hero-grid diag-grid">
        <div className="diag-main">
          <DiagBreadcrumb stage={state.stage} onClose={onClose} />
          <div className="diag-frame">
            {state.stage === "device" && (
              <DiagStepDevice onPick={(deviceId) => setStage("model", { deviceId })} />
            )}
            {state.stage === "model" && (
              <DiagStepModel
                deviceId={state.deviceId}
                onPickModel={(modelName) => setStage("fault", { modelName, modelSkipped: false })}
                onSkip={() => setStage("fault", { modelName: null, modelSkipped: true })}
                onBack={() => setStage("device")}
              />
            )}
            {state.stage === "fault" && (
              <DiagStepFault
                deviceId={state.deviceId}
                onPick={(faultId) => setStage("symptoms", { faultId, nodeId: null, history: [] })}
                onBack={() => setStage("model")}
              />
            )}
            {state.stage === "symptoms" && (
              <DiagStepSymptoms
                state={state}
                setState={setState}
                onBack={() => {
                  // pop one history; if empty, back to fault
                  setState(s => {
                    if (s.history.length === 0) return { ...s, stage: "fault", nodeId: null };
                    const last = s.history[s.history.length - 1];
                    return { ...s, nodeId: last.nodeId, history: s.history.slice(0, -1) };
                  });
                }}
                onAdvance={(nodeId) => setStage("diagnosis", { diagnosisId: nodeId })}
                onPrediag={() => setStage("diagnosis", { diagnosisId: null, _forcedPrediag: true })}
              />
            )}
            {state.stage === "diagnosis" && (
              <DiagStepDiagnosis
                state={state}
                onReset={reset}
                onBack={() => setStage("symptoms")}
              />
            )}
          </div>
        </div>
        <DiagRail stage={state.stage} state={state} />
      </div>
    </section>
  );
}

Object.assign(window, { HeroDiagnose });
