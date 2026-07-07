// ═══════════════════════════════════════════════════════════════════════════
//  iCorrect Quote Wizard v3 — the combined flow.
//  Steps 1–4 from v2 (Device → Model → Fault → Issue).
//  Step 5 = product-page "Configure your repair" postcode module.
//  Step 6 = Tiers + Schedule quote (method toggle · when · Standard/Fast) + timeline.
// ═══════════════════════════════════════════════════════════════════════════

const QW3_DEVICES = window.QW_DEVICES;
const QW3_MODELS  = window.QW_MODELS;
const QW3_FAULTS  = window.QW_FAULTS;
const QW3_ISSUES  = window.QW_ISSUES;
const QW3_ICONS   = window.QW_FAULT_ICONS;
const V3CFG   = window.QW_SERVICE_CONFIG;

function v3Classify(pc) {
  if (!pc || !pc.trim()) return "empty";
  const t = pc.trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z]{1,2}[0-9][A-Z0-9]?/.test(t)) return "international";
  const area = t.match(/^[A-Z]+/)?.[0];
  return V3CFG.LONDON_POSTCODES.includes(area) ? "london" : "uk";
}

// Estimate-type faults: no exact price until the bench. Returns a band +
// factor breakdown, or null for firm-priced repairs. Mirrors the diagnose
// estimate model — honest range now, £49 diagnostic (a separate charge) pins it.
function v3EstimateFault(fault) {
  const l = (fault?.label || "").toLowerCase();
  if (l.includes("liquid") || l.includes("water")) {
    return {
      title: "Liquid damage — assessment first",
      summary: "Liquid never follows one rule, so we don't pretend it does. We estimate from what you've told us — the £49 diagnostic confirms the exact price.",
      processLabel: "How our liquid-damage process works",
      processHref: "Liquid Damage Process.html",
      band: [149, 449],
      typical: [149, 259],
      factors: [
        { label: "Corrosion clean & board treatment", note: "Nearly every liquid job needs this — it's the baseline.", price: 149, base: true, chance: "Almost always", weight: 4, level: "low" },
        { label: "Battery and/or charging port", note: "The parts that most often take the hit.", price: 110, chance: "Common", weight: 3, level: "mid" },
        { label: "Display", note: "Only if liquid actually reached the screen.", price: 190, chance: "Worst case", weight: 1, level: "high" },
      ],
    };
  }
  if (l.includes("won't") || l.includes("dead") || l.includes("turn on") || l.includes("boot") || (l.includes("power") && !l.includes("charg"))) {
    return {
      title: "Won't power on — assessment first",
      summary: "It could be the battery, the charging circuit, or a power fault on the board. We estimate from what you've told us — the £49 diagnostic confirms the exact price.",
      processLabel: "How our board-level diagnosis works",
      processHref: "Board-Level Diagnosis.html",
      band: [129, 389],
      typical: [129, 229],
      factors: [
        { label: "Battery", note: "The cheapest and most common cause.", price: 129, base: true, chance: "Most likely", weight: 4, level: "low" },
        { label: "Charging port / charging circuit", note: "If the battery's fine but power isn't getting in.", price: 100, chance: "Possible", weight: 2, level: "mid" },
        { label: "Power-management repair (microsolder)", note: "Board-level — the less common, higher end.", price: 160, chance: "Less common", weight: 1, level: "high" },
      ],
    };
  }
  return null;
}

function v3RepairPrice(fault) {
  const l = (fault?.label || "").toLowerCase();
  if (l.includes("screen") || l.includes("display") || l.includes("glass")) return 449;
  if (l.includes("batter")) return 179;
  if (l.includes("liquid") || l.includes("water")) return 249;
  if (l.includes("charg") || l.includes("port") || l.includes("power")) return 149;
  if (l.includes("keyboard")) return 199;
  if (l.includes("data")) return 299;
  if (l.includes("speaker") || l.includes("audio") || l.includes("mic")) return 119;
  if (l.includes("camera")) return 129;
  if (l.includes("turn on") || l.includes("won't") || l.includes("dead") || l.includes("boot")) return 129;
  return 299;
}

function FaultIcon({ icon, size = 20 }) {
  const path = QW3_ICONS[icon];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

// ── Pricing resolution ──────────────────────────────────────────────────────
// Every fault + issue combination resolves to exactly one honest outcome:
//   fixed      — firm price, book it            (screen crack, battery swap)
//   estimate   — honest band + factors          (liquid, won't-power)
//   diagnostic — £49 bench diagnosis, a separate charge (board-level ambiguity:
//                greyed-out Wi-Fi, black screen, data recovery — no price until seen)
// Pass issue = null for the fault-level view (before the issue is answered).
function v3Resolve(fault, issue) {
  const fl = (fault?.label || "").toLowerCase();
  const il = (issue?.label || "").toLowerCase();
  // Fault-level: liquid is always an estimate band
  if (fl.includes("liquid") || fl.includes("water")) return { kind: "estimate", est: v3EstimateFault(fault) };
  // Fault-level: diagnostic-first categories
  if (fl.includes("connect") || fl.includes("wifi"))
    return { kind: "diagnostic", reason: "Greyed-out Wi-Fi or dropping connections can be software, an antenna, or the logic board itself — we confirm which before we quote, so the quote we give is the price." };
  if (fl.includes("data"))
    return { kind: "diagnostic", reason: "Recovery cost depends entirely on how the drive failed. We assess it on the bench before quoting — no recovery, no fee beyond the diagnostic." };
  if (fl.includes("other"))
    return { kind: "diagnostic", reason: "Without seeing it we'd be guessing — and we don't quote guesses. The diagnostic pins the fault, then the price is the price." };
  // Issue-level overrides inside otherwise firm-priced faults
  if (il) {
    if (il.includes("won't turn on") || il.includes("dead") || il.includes("won't power"))
      return { kind: "estimate", est: v3EstimateFault({ label: issue.label }) };
    if (il.includes("black screen"))
      return { kind: "diagnostic", reason: "A black screen can be the display, the GPU, or the board. Fitting a £449 display to a board fault helps nobody — the diagnostic confirms which it is first." };
    if (il.includes("charger not recognised") || il.includes("ghost typing"))
      return { kind: "diagnostic", reason: "This one can be a simple part or a board-level fault. We confirm which on the bench before quoting — so the quote we give is the price." };
  }
  return { kind: "fixed", price: v3RepairPrice(fault) };
}

function QuoteWizard({ startDevice = null, startFaultId = null, startModelName = null, startPrice = null, unknownModelTargetId = null, renderQuote = null, hideProgressOnQuote = false, modelFirst = false, priceEarly = false, compactProgress = false } = {}) {
  // Pre-fill support for collection pages (device + repair category already known).
  const _initFault = (startDevice && startFaultId)
    ? (QW3_FAULTS[startDevice] || []).find(f => f.id === startFaultId) || null
    : null;
  const faultKnown = !!_initFault;
  const deviceKnown = !!startDevice;
  const modelKnown = !!startModelName;
  // When the model is already known (a specific product page), we skip straight
  // to postcode → quote and assume the default issue for that fault.
  const _initIssue = (faultKnown && modelKnown)
    ? ((QW3_ISSUES[startDevice]?.[_initFault.label] || [])[0] || { label: _initFault.label, hint: "" })
    : null;

  // Step sequence depends on how deep the customer entered:
  //  • Full flow (homepage / standalone):          Device → Model → Fault → Issue → Postcode → Quote
  //  • Category hub (device known, repair not yet): Fault → Model → Issue → Postcode → Quote
  //  • Collection (device + repair):                Model → Issue → Postcode → Quote
  //  • Product page (device + repair + model):      Postcode → Quote
  const sequence = faultKnown
    ? (modelKnown ? ["postcode", "quote"]
        : modelFirst ? ["model", "issue", "postcode", "quote"]
        : ["issue", "model", "postcode", "quote"])
    : deviceKnown
      ? ["fault", "model", "issue", "postcode", "quote"]
      : ["device", "model", "fault", "issue", "postcode", "quote"];

  const [idx, setIdx] = React.useState(0);
  const [device, setDevice] = React.useState(startDevice);
  const [modelName, setModelName] = React.useState(startModelName);
  const [fault, setFault] = React.useState(_initFault);
  const [issue, setIssue] = React.useState(_initIssue);
  const [postcode, setPostcode] = React.useState("");
  const [zone, setZone] = React.useState("empty");
  const [openGroup, setOpenGroup] = React.useState(null);

  const currentKey = sequence[idx];

  // Keep the wizard nicely in view as steps advance (skip the initial mount,
  // so pre-filled collection pages don't auto-scroll on load).
  const rootRef = React.useRef(null);
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = rootRef.current;
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, [idx]);

  const goNext = () => setIdx(i => Math.min(i + 1, sequence.length - 1));

  const selectDevice = (d) => { setDevice(d); setModelName(null); setFault(null); setIssue(null); setOpenGroup(null); goNext(); };
  const selectModel = (name) => { setModelName(name); goNext(); };
  const selectFault = (f) => { setFault(f); setIssue(null); goNext(); };
  const selectIssue = (iss) => { setIssue(iss); goNext(); };

  const liveZone = v3Classify(postcode);
  const canUnlock = liveZone === "london" || liveZone === "uk" || liveZone === "international";
  const commitPostcode = () => { if (!canUnlock) return; setZone(liveZone); goNext(); };

  // Jump back to an earlier step, clearing the inputs that come after it.
  const resetters = {
    device: () => { setDevice(null); setOpenGroup(null); },
    model: () => setModelName(null),
    fault: () => setFault(null),
    issue: () => setIssue(null),
    postcode: () => setZone("empty"),
  };
  const jumpTo = (j) => {
    if (j > idx) return;
    sequence.forEach((key, i) => { if (i > j && resetters[key]) resetters[key](); });
    setIdx(j);
  };

  // "I don't know my model" → jump to the on-page model-finder section.
  const findMyModel = () => {
    if (!unknownModelTargetId) return;
    const el = document.getElementById(unknownModelTargetId);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  const repairPrice = startPrice != null ? startPrice : (fault ? v3RepairPrice(fault) : null);

  const LABELS = { device: "Device", model: "Model", fault: "Fault", issue: "Issue", postcode: "Postcode", quote: "Quote" };
  const valueFor = (key) => {
    switch (key) {
      case "device": return device ? QW3_DEVICES.find(d => d.id === device)?.name : null;
      case "model": return modelName;
      case "fault": return fault?.label;
      case "issue": return issue?.label;
      case "postcode": return zone !== "empty" ? postcode.trim().toUpperCase() : null;
      default: return null;
    }
  };

  const backBtn = idx > 0
    ? <button className="qw-btn-back" type="button" onClick={() => jumpTo(idx - 1)}>← Back</button>
    : null;

  return (
    <div className="qw-page" ref={rootRef}>
      {/* Progress dots — hidden at the quote step when the host renders its own header (e.g. v4). */}
      {!(hideProgressOnQuote && currentKey === "quote") && (
      <div className="qw-progress">
        <div className="qw-progress-top"><div className="qw-mono">Step {idx + 1} of {sequence.length}</div></div>
        <div className="qw-dots">
          {sequence.map((key, i) => {
            const isDone = i < idx, isCurrent = i === idx, canJump = i <= idx;
            const v = isDone ? valueFor(key) : null;
            return (
              <button key={key} type="button" disabled={!canJump} onClick={() => canJump && jumpTo(i)}
                title={compactProgress && v ? v : undefined}
                className={"qw-dot" + (isDone ? " done" : "") + (isCurrent ? " current" : "")}>
                <div className="qw-dot-num">{compactProgress && isDone ? "✓" : i + 1}</div>
                <div className="qw-dot-label">
                  {LABELS[key]}{!compactProgress && v ? `: ${v.length > 16 ? v.slice(0,14) + "…" : v}` : ""}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Price-early banner — the price lands the moment fault (+model) is known,
          so the postcode becomes a delivery question, not a toll gate. */}
      {priceEarly && fault && (currentKey === "issue" || currentKey === "postcode") && (() => {
        const res = startPrice != null
          ? { kind: "fixed", price: startPrice }
          : v3Resolve(fault, currentKey === "postcode" ? issue : null);
        // On the issue step, does the answer change the outcome (fixed vs bench)?
        const pending = currentKey === "issue" && startPrice == null &&
          (QW3_ISSUES[device]?.[fault.label] || []).some(iss => v3Resolve(fault, iss).kind !== res.kind);
        const num = res.kind === "estimate" ? `£${res.est.band[0]}–£${res.est.band[1]}`
          : res.kind === "diagnostic" ? "£49"
          : `£${res.price}`;
        const tag = res.kind === "estimate" ? "estimate" : res.kind === "diagnostic" ? "diagnostic" : null;
        const note = res.kind === "estimate" ? "Honest range — a £49 diagnostic confirms the exact figure"
          : res.kind === "diagnostic" ? "You're booking a £49 diagnostic — fixed repair quote follows"
          : pending ? "Typical fixed price — your answer below confirms it"
          : "Fixed price · genuine parts · 2-year warranty";
        return (
          <div className="qw-earlyprice" role="status" aria-live="polite">
            <div className="qw-earlyprice-info">
              <span className="qw-earlyprice-label">{fault.label}{modelName ? " · " + modelName : ""}</span>
              <span className="qw-earlyprice-note">{note}</span>
            </div>
            <div className="qw-earlyprice-num">
              {num}
              {tag && <span className="qw-earlyprice-est">{tag}</span>}
            </div>
          </div>
        );
      })()}
      {/* Device */}
      {currentKey === "device" && (
        <div className="qw-step">
          <h3 className="qw-step-title">What needs fixing?</h3>
          <p className="qw-step-sub">Pick your device to get started.</p>
          <div className="qw-device-grid">
            {QW3_DEVICES.map(d => (
              <button key={d.id} type="button" className={"qw-device-card" + (device === d.id ? " selected" : "")} onClick={() => selectDevice(d.id)}>
                <div className="qw-device-icon" dangerouslySetInnerHTML={{ __html: d.svg }} />
                <div className="qw-device-name">{d.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model */}
      {currentKey === "model" && device && (
        <div className="qw-step">
          {backBtn}
          <h3 className="qw-step-title">Which {QW3_DEVICES.find(d => d.id === device)?.name}?</h3>
          <p className="qw-step-sub">Pick your exact model for accurate pricing.</p>
          <div className="qw-model-groups">
            {(QW3_MODELS[device] || []).map((g, gi) => {
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
          {unknownModelTargetId && (
            <button type="button" className="qw-model-unknown" onClick={findMyModel}>
              <span>I don't know my model</span>
              <span className="qw-model-unknown-hint">Find it in 5 seconds ↓</span>
            </button>
          )}
        </div>
      )}

      {/* Fault */}
      {currentKey === "fault" && device && (
        <div className="qw-step">
          {backBtn}
          <h3 className="qw-step-title">What's the issue?</h3>
          <p className="qw-step-sub">Pick the category that best describes the problem.</p>
          <div className="qw-fault-grid">
            {(QW3_FAULTS[device] || []).map(f => (
              <button key={f.id} type="button" className={"qw-fault-card" + (fault?.id === f.id ? " selected" : "")} onClick={() => selectFault(f)}>
                <div className="qw-fault-icon"><FaultIcon icon={f.icon} /></div>
                <div className="qw-fault-name">{f.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Issue */}
      {currentKey === "issue" && device && fault && (
        <div className="qw-step">
          {backBtn}
          <h3 className="qw-step-title">{fault.label}</h3>
          <p className="qw-step-sub">Pick the closest match — this decides whether it's a fixed price or needs a look on the bench first.</p>
          <div className="qw-issue-list">
            {(QW3_ISSUES[device]?.[fault.label] || []).map((iss, i) => (
              <button key={i} type="button" className={"qw-issue-card" + (issue?.label === iss.label ? " selected" : "")} onClick={() => selectIssue(iss)}>
                <div className="qw-issue-icon-wrap"><FaultIcon icon={fault.icon} size={18} /></div>
                <div className="qw-issue-text">
                  <div className="qw-issue-label">{iss.label}</div>
                  <div className="qw-issue-hint">{iss.hint}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Postcode — product-page "Configure your repair" module */}
      {currentKey === "postcode" && issue && (
        <div className="qw-step">
          {backBtn}
          <h3 className="qw-step-title">Plan your repair</h3>

          <div className="qw-cfg">
            <div className="qw-cfg-prompt">{priceEarly ? "Enter your postcode to see how soon you can have it back" : "Enter your postcode to see your price"}</div>
            <form className="qw-cfg-form" onSubmit={e => { e.preventDefault(); commitPostcode(); }}>
              <input className="qw-cfg-input" placeholder="e.g. W1W 8JQ" autoComplete="postal-code" aria-label="Postcode"
                value={postcode} onChange={e => setPostcode(e.target.value)} />
              <button type="submit" className={"qw-cfg-btn" + (canUnlock ? " ready" : "")}>{priceEarly ? "Show my dates →" : "Show my price →"}</button>
            </form>
            <div className="qw-cfg-hint" aria-live="polite">
              {liveZone === "london" && <><span className="qw-cfg-dot blue" /> London — walk in, same-day courier &amp; mail-in</>}
              {liveZone === "uk" && <><span className="qw-cfg-dot blue" /> UK mainland — mail-in or courier collection</>}
              {liveZone === "international" && <><span className="qw-cfg-dot amber" /> Outside the UK — drop in if visiting London</>}
              {liveZone === "empty" && <span className="qw-cfg-hint-muted">Try W1W 8JQ (London) or EH1 1AA (Edinburgh)</span>}
            </div>

            <div className="qw-cfg-ex">
              <span className="qw-cfg-ex-label">Try an example</span>
              {[["W1W 8JQ","London"],["M1 1AE","Manchester"],["EH1 1AA","Edinburgh"]].map(([pc, l]) => (
                <button key={pc} type="button" className="qw-cfg-ex-btn" onClick={() => setPostcode(pc)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quote — Tiers + Schedule quote (+ timeline). renderQuote lets a host
          swap in an alternative quote UI (e.g. v4) without changing this flow.
          Estimate-type faults (liquid / won't-power) skip the firm tiers and
          show an honest band + £49 diagnostic (separate charge) instead. */}
      {currentKey === "quote" && device && modelName && fault && issue && zone !== "empty" && (
        <div className="qw-step">
          {(() => {
            const res = startPrice != null ? { kind: "fixed", price: startPrice } : v3Resolve(fault, issue);
            // Estimate/diagnostic quotes render inline (no modal close button),
            // so they must always offer a way back — even when the host hides
            // the progress rail (hideProgressOnQuote).
            const showBack = !hideProgressOnQuote || res.kind !== "fixed";
            return showBack ? backBtn : null;
          })()}
          {(() => {
            const res = startPrice != null ? { kind: "fixed", price: startPrice } : v3Resolve(fault, issue);
            if (res.kind === "diagnostic") {
              return (
                <div className="qw-estimate-quote">
                  <div className="qw-eq-head">
                    <span className="qw-eq-kicker">Diagnostic · {modelName}</span>
                    <h2 className="qw-eq-title">First step: a £49 diagnostic.</h2>
                    <p className="qw-eq-summary">{res.reason} You're booking the diagnostic — not a repair yet. Once we've confirmed the fault, you get a fixed repair quote to approve before any work starts.</p>
                  </div>
                  <div className="qw-diag-card">
                    <div className="qw-diag-price">
                      <span className="qw-diag-price-num">£49</span>
                      <span className="qw-diag-price-label">diagnostic · one-off charge · repair quoted separately</span>
                    </div>
                    <ol className="qw-diag-steps">
                      <li><span className="qw-diag-step-n">01</span> Book the £49 diagnostic — walk-in, courier or post</li>
                      <li><span className="qw-diag-step-n">02</span> Bench diagnosis, usually within 1 working day</li>
                      <li><span className="qw-diag-step-n">03</span> Fixed repair quote to approve — or your device back, nothing more to pay</li>
                    </ol>
                  </div>
                  <a className="qw-eq-processlink" href="Board-Level Diagnosis.html">How our board-level diagnosis works <span aria-hidden="true">→</span></a>
                  <div className="qw-eq-ctas qw-eq-ctas-stack">
                    <button type="button" className="dg-cta dg-cta-primary" onClick={() => { window.location.hash = ""; }}>
                      Book the £49 diagnostic <span aria-hidden="true">→</span>
                    </button>
                    <button type="button" className="qw-eq-startover" onClick={() => jumpTo(0)}>Start over</button>
                  </div>
                </div>
              );
            }
            const est = res.kind === "estimate" ? res.est : null;
            if (est) {
              return (
                <div className="qw-estimate-quote">
                  <div className="qw-eq-head">
                    <span className="qw-eq-kicker">Estimate · {modelName}</span>
                    <h2 className="qw-eq-title">{est.title}</h2>
                    <p className="qw-eq-summary">{est.summary}</p>
                  </div>
                  <div className="qw-diag-card">
                    <div className="qw-diag-price">
                      <span className="qw-diag-price-num">£{est.band[0]}–£{est.band[1]}</span>
                      <span className="qw-diag-price-label">estimate · £49 diagnostic confirms the exact price</span>
                    </div>
                    <ol className="qw-diag-steps">
                      <li><span className="qw-diag-step-n">01</span> Book the £49 diagnostic — walk-in, courier or post</li>
                      <li><span className="qw-diag-step-n">02</span> Bench diagnosis, usually within 1 working day</li>
                      <li><span className="qw-diag-step-n">03</span> Exact price to approve — or your device back, nothing more to pay</li>
                    </ol>
                  </div>
                  {est.processLabel && (
                    <a className="qw-eq-processlink" href={est.processHref || "How It Works.html"}>{est.processLabel} <span aria-hidden="true">→</span></a>
                  )}
                  <div className="qw-eq-ctas qw-eq-ctas-stack">
                    <button type="button" className="dg-cta dg-cta-primary" onClick={() => { window.location.hash = ""; }}>
                      Book the £49 diagnostic <span aria-hidden="true">→</span>
                    </button>
                    <button type="button" className="qw-eq-startover" onClick={() => jumpTo(0)}>Start over</button>
                  </div>
                </div>
              );
            }
            return renderQuote
            ? renderQuote({
                model: { name: modelName },
                issue,
                price: repairPrice,
                zone,
                postcode: postcode.trim().toUpperCase(),
                fault,
                onChangePostcode: () => jumpTo(sequence.indexOf("postcode")),
                editStep: (key) => { const i = sequence.indexOf(key); if (i >= 0) jumpTo(i); },
              })
            : (typeof QuoteTiersV6 !== "undefined" && typeof QuoteModalV7 !== "undefined")
            ? (
              <QuoteModalV7 onClose={() => { const i = sequence.indexOf("postcode"); if (i >= 0) jumpTo(i); }}>
                <QuoteTiersV6
                  model={{ name: modelName }}
                  issue={issue}
                  price={repairPrice}
                  zone={zone}
                  postcode={postcode.trim().toUpperCase()}
                  onChangePostcode={() => jumpTo(sequence.indexOf("postcode"))}
                />
              </QuoteModalV7>
            )
            : (
              <QuoteTiersSchedule
                model={{ name: modelName }}
                issue={issue}
                price={repairPrice}
                zone={zone}
                postcode={postcode.trim().toUpperCase()}
                onChangePostcode={() => jumpTo(sequence.indexOf("postcode"))}
                showTimeline={true}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { QuoteWizard, FaultIcon });
