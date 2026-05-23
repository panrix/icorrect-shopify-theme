// ═══════════════════════════════════════════════════════════════════════════
//  iCorrect Quote Wizard — Main Wizard Flow
//  Step 1: Device → Step 2: Model → Step 3: Fault → Step 4: Issue → Step 5: Service
// ═══════════════════════════════════════════════════════════════════════════

const DEVICES = window.QW_DEVICES;
const MODELS  = window.QW_MODELS;
const FAULTS  = window.QW_FAULTS;
const ISSUES  = window.QW_ISSUES;
const ICONS   = window.QW_FAULT_ICONS;

function FaultIcon({ icon, size = 20 }) {
  const path = ICONS[icon];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}


function QuoteWizard() {
  const [step, setStep] = React.useState(1);
  const [device, setDevice] = React.useState(null);
  const [modelName, setModelName] = React.useState(null);
  const [fault, setFault] = React.useState(null);
  const [issue, setIssue] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [payload, setPayload] = React.useState(null);

  // Model accordion open state
  const [openGroup, setOpenGroup] = React.useState(null);

  const selectDevice = (d) => { setDevice(d); setModelName(null); setFault(null); setIssue(null); setOpenGroup(null); setStep(2); };
  const selectModel = (name) => { setModelName(name); setFault(null); setIssue(null); setStep(3); };
  const selectFault = (f) => { setFault(f); setIssue(null); setStep(4); };
  const selectIssue = (iss) => { setIssue(iss); setStep(5); };

  const handleServiceSubmit = (data) => { setPayload(data); setSubmitted(true); };
  const reset = () => { setStep(1); setDevice(null); setModelName(null); setFault(null); setIssue(null); setSubmitted(false); setPayload(null); setOpenGroup(null); };

  const jumpToStep = (s) => {
    if (s <= step) {
      if (s <= 1) { setDevice(null); setModelName(null); setFault(null); setIssue(null); }
      if (s <= 2) { setModelName(null); setFault(null); setIssue(null); }
      if (s <= 3) { setFault(null); setIssue(null); }
      if (s <= 4) { setIssue(null); }
      setStep(s);
    }
  };

  const stepLabels = ["Device", "Model", "Fault", "Issue", "Service"];
  const stepValues = [
    device ? DEVICES.find(d => d.id === device)?.name : null,
    modelName,
    fault?.label,
    issue?.label,
    null,
  ];

  if (submitted) {
    return (
      <div className="qw-page" style={{ textAlign: "center" }}>
        <div className="qw-check">✓</div>
        <h2 className="qw-step-title">Ready for checkout</h2>
        <p className="qw-step-sub" style={{ maxWidth: 480, margin: "8px auto 24px" }}>
          The wizard returned the full payload below. In production this forwards to your checkout flow.
        </p>
        <pre className="qw-payload-pre">
          {JSON.stringify(payload, null, 2)}
        </pre>
        <button className="qw-btn qw-btn-dark" style={{ marginTop: 20 }} onClick={reset}>Reset wizard</button>
      </div>
    );
  }

  return (
    <div className="qw-page">
      {/* ── Progress dots ──────────────────────────────────────── */}
      <div className="qw-progress">
        <div className="qw-progress-top">
          <div className="qw-mono">Step {step} of 5</div>
        </div>
        <div className="qw-dots">
          {stepLabels.map((label, i) => {
            const idx = i + 1;
            const isDone = idx < step;
            const isCurrent = idx === step;
            const canJump = idx <= step;
            return (
              <button key={label} type="button" disabled={!canJump} onClick={() => canJump && jumpToStep(idx)}
                className={"qw-dot" + (isDone ? " done" : "") + (isCurrent ? " current" : "")}>
                <div className="qw-dot-num">{idx}</div>
                <div className="qw-dot-label">
                  {label}{isDone && stepValues[i] ? `: ${stepValues[i].length > 18 ? stepValues[i].slice(0,16) + "…" : stepValues[i]}` : ""}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Step 1: Device ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="qw-step">
          <h3 className="qw-step-title">What needs fixing?</h3>
          <p className="qw-step-sub">Pick your device to get started.</p>
          <div className="qw-device-grid">
            {DEVICES.map(d => (
              <button key={d.id} type="button" className={"qw-device-card" + (device === d.id ? " selected" : "")} onClick={() => selectDevice(d.id)}>
                <div className="qw-device-icon" dangerouslySetInnerHTML={{ __html: d.svg }} />
                <div className="qw-device-name">{d.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Model (accordion groups) ───────────────────── */}
      {step === 2 && device && (
        <div className="qw-step">
          <button className="qw-btn-back" type="button" onClick={() => jumpToStep(1)}>← Back</button>
          <h3 className="qw-step-title">Which {DEVICES.find(d => d.id === device)?.name}?</h3>
          <p className="qw-step-sub">Pick your exact model for accurate pricing.</p>
          <div className="qw-model-groups">
            {(MODELS[device] || []).map((g, gi) => {
              const isOpen = openGroup === gi;
              return (
                <div key={gi} className={"qw-model-group" + (isOpen ? " open" : "")}>
                  <button type="button" className="qw-model-group-head" onClick={() => setOpenGroup(isOpen ? null : gi)}>
                    <div>
                      <div className="qw-model-group-name">{g.group}</div>
                      <div className="qw-model-group-count">{g.models.length} model{g.models.length !== 1 ? "s" : ""}</div>
                    </div>
                    <svg className="qw-model-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {isOpen && (
                    <div className="qw-model-list">
                      {g.models.map((m, mi) => (
                        <button key={mi} type="button" className={"qw-model-item" + (modelName === m.name ? " selected" : "")} onClick={() => selectModel(m.name)}>
                          <span className="qw-model-item-name">{m.name}</span>
                          <span className="qw-model-item-year">{m.year}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 3: Fault category ─────────────────────────────── */}
      {step === 3 && device && modelName && (
        <div className="qw-step">
          <button className="qw-btn-back" type="button" onClick={() => jumpToStep(2)}>← Back</button>
          <h3 className="qw-step-title">What's the issue?</h3>
          <p className="qw-step-sub">Pick the category that best describes the problem.</p>
          <div className="qw-fault-grid">
            {(FAULTS[device] || []).map(f => (
              <button key={f.id} type="button" className={"qw-fault-card" + (fault?.id === f.id ? " selected" : "")} onClick={() => selectFault(f)}>
                <div className="qw-fault-icon"><FaultIcon icon={f.icon} /></div>
                <div className="qw-fault-name">{f.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Specific issue / troubleshoot ──────────────── */}
      {step === 4 && device && fault && (
        <div className="qw-step">
          <button className="qw-btn-back" type="button" onClick={() => jumpToStep(3)}>← Back</button>
          <h3 className="qw-step-title">{fault.label}</h3>
          <p className="qw-step-sub">Tell us a bit more so we can give you the best quote.</p>
          <div className="qw-issue-list">
            {(ISSUES[device]?.[fault.label] || []).map((iss, i) => (
              <button key={i} type="button" className={"qw-issue-card" + (issue?.label === iss.label ? " selected" : "")} onClick={() => selectIssue(iss)}>
                <div className="qw-issue-icon-wrap">
                  <FaultIcon icon={fault.icon} size={18} />
                </div>
                <div className="qw-issue-text">
                  <div className="qw-issue-label">{iss.label}</div>
                  <div className="qw-issue-hint">{iss.hint}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 5: Service mapper ─────────────────────────────── */}
      {step === 5 && device && modelName && fault && issue && (
        <div className="qw-step">
          <button className="qw-btn-back" type="button" onClick={() => jumpToStep(4)}>← Back</button>

          {/* Quote summary */}
          <div className="qw-summary">
            <div className="qw-mono">Your repair</div>
            <div className="qw-summary-line"><span>Device</span><span>{modelName}</span></div>
            <div className="qw-summary-line"><span>Fault</span><span>{fault.label}</span></div>
            <div className="qw-summary-line"><span>Issue</span><span>{issue.label}</span></div>
            <div className="qw-summary-line"><span>Warranty</span><span>2 years</span></div>
            <div className="qw-diagnosis-note">
              <strong>Prices are confirmed at checkout.</strong> You'll fill in exact amounts — the service mapper handles delivery, scheduling, and turnaround.
            </div>
          </div>

          <ServiceMapper
            device={device}
            model={modelName}
            fault={fault}
            issue={issue}
            repairPrice={null}
            requiresDiagnosis={true}
            onSubmit={handleServiceSubmit}
          />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { QuoteWizard, FaultIcon });
