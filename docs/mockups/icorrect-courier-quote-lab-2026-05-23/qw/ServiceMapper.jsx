// iCorrect Courier Quote Lab - Service Mapper
// Replaces Claude's static courier pricing with the local decision contract.

const CFG = window.QW_SERVICE_CONFIG;

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const _holidays = new Set(CFG.UK_BANK_HOLIDAYS);
function isWorkingDay(d) {
  const dow = d.getDay();
  return dow !== 0 && dow !== 6 && !_holidays.has(isoDate(d));
}

function addWorkingDays(d, n) {
  const out = new Date(d);
  let added = 0;
  while (added < n) {
    out.setDate(out.getDate() + 1);
    if (isWorkingDay(out)) added++;
  }
  return out;
}

function upcomingWorkingDates(count = 8) {
  const out = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (isWorkingDay(d)) out.push(new Date(d));
  }
  return out;
}

function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return Number.isNaN(dt.getTime()) ? "" : dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function moneyLabel(value) {
  if (value === null || value === undefined || value === "") return "Manual";
  const number = Number(value);
  if (Number.isNaN(number)) return "Manual";
  if (number === 0) return "Free";
  return `+£${number.toFixed(2)}`;
}

function serviceTitle(option) {
  if (!option) return "";
  if (option.label) return option.label;
  if (option.service_level === "priority") return "Priority courier";
  if (option.service_level === "urgent") return "Urgent courier";
  if (option.service_level === "manual") return "Manual courier quote";
  return "Standard courier";
}

function serviceSubtitle(option) {
  if (!option) return "";
  if (option.customer_message) return option.customer_message;
  const bits = [];
  if (option.estimated_collection_window) bits.push(`Collect ${option.estimated_collection_window}`);
  if (option.estimated_return_window) bits.push(option.estimated_return_window);
  return bits.join(" · ");
}

function decisionError(decision) {
  if (!decision) return "";
  return (decision.contract?.errors || []).join(" ");
}

function contractOptions(decision) {
  return decision?.contract?.options || [];
}

function courierOptions(decision) {
  return contractOptions(decision).filter(option => option.service_level !== "manual");
}

function manualOption(decision) {
  return contractOptions(decision).find(option => option.service_level === "manual") || null;
}

function sameDayCountCopy(decision) {
  const slots = decision?.contract?.same_day_slots_remaining;
  if (typeof slots !== "number") return "";
  if (slots <= 0) return "No same-day repair slots left in this test state.";
  if (slots === 1) return "1 same-day repair slot left in this test state.";
  return `${slots} same-day repair slots left in this test state.`;
}

function buildTimeline({ delivery, selectedOption, walkInDate, walkInTime, mailStartDate }) {
  const steps = [];
  if (delivery === "walkin" && walkInDate) {
    const start = new Date(walkInDate);
    steps.push({ label: "Customer drops off at iCorrect", date: fmtDate(start) + (walkInTime ? ` · ${walkInTime}` : ""), note: "Workshop confirms scope and timing." });
    steps.push({ label: "Repair or diagnostic starts", date: "Workshop controlled", note: "Ops can adjust timing after inspection." });
    steps.push({ label: "Customer notified", date: fmtDate(addWorkingDays(start, 2)), note: "Collection or next step confirmed.", final: true });
  } else if (delivery === "courier" && selectedOption) {
    steps.push({ label: "We collect by London courier", date: selectedOption.estimated_collection_window || "Window pending", note: serviceTitle(selectedOption) });
    steps.push({ label: "Workshop repair or diagnostic", date: selectedOption.same_day_return ? "Same-day eligible" : "After arrival", note: selectedOption.customer_message || "Status updates can be sent by ops." });
    steps.push({ label: "Returned to customer", date: selectedOption.estimated_return_window || "Return timing pending", note: "Final courier booking happens after order confirmation.", final: true });
  } else if (delivery === "mail") {
    const start = mailStartDate || new Date();
    steps.push({ label: "Customer sends device", date: `Post by ${fmtDate(start)}`, note: "Mail-in remains the fallback for non-London or manual courier paths." });
    steps.push({ label: "Arrives at workshop", date: fmtDate(addWorkingDays(start, 2)) });
    steps.push({ label: "Repair or diagnostic starts", date: "After arrival", note: "Turnaround depends on selected repair and assessment." });
  }
  return steps;
}

function QWDeliveryCard({ active, onSelect, title, subtitle, price, badge, disabled }) {
  return (
    <button type="button" disabled={disabled} className={"qw-delivery-card" + (active ? " active" : "") + (disabled ? " qw-card-disabled" : "")} onClick={disabled ? undefined : onSelect}>
      {badge && <span className="qw-delivery-badge">{badge}</span>}
      <div className="qw-delivery-radio"><span /></div>
      <div className="qw-delivery-body">
        <div className="qw-delivery-title">{title}</div>
        <div className="qw-delivery-sub">{subtitle}</div>
      </div>
      <div className="qw-delivery-price">{price}</div>
    </button>
  );
}

function ServiceMapper({ device, model, fault, issue, repairPrice, requiresDiagnosis, onSubmit }) {
  const [postcode, setPostcode] = React.useState("");
  const [stock, setStock] = React.useState("available");
  const [sameDaySlots, setSameDaySlots] = React.useState(3);
  const [action, setAction] = React.useState("quote");
  const [decision, setDecision] = React.useState(null);
  const [decisionState, setDecisionState] = React.useState("idle");
  const [delivery, setDelivery] = React.useState(null);
  const [selectedOptionId, setSelectedOptionId] = React.useState(null);
  const [walkInDate, setWalkInDate] = React.useState(null);
  const [walkInTime, setWalkInTime] = React.useState(null);
  const [mailStartDate] = React.useState(new Date());
  const [nudgeTarget, setNudgeTarget] = React.useState(null);
  const nudgeRef = React.useRef(null);

  const selectedOption = contractOptions(decision).find(option => option.option_id === selectedOptionId) || null;
  const options = courierOptions(decision);
  const manual = manualOption(decision);
  const postcodeKnown = decision?.contract?.status && !["invalid_postcode", "full_postcode_required"].includes(decision.contract.status);
  const courierAvailable = options.length > 0;

  React.useEffect(() => {
    const compact = postcode.trim().replace(/\s+/g, "");
    setDelivery(null);
    setSelectedOptionId(null);
    setWalkInDate(null);
    setWalkInTime(null);
    if (!compact) {
      setDecision(null);
      setDecisionState("idle");
      return;
    }
    if (compact.length < 5) {
      setDecision(null);
      setDecisionState("typing");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setDecisionState("loading");
      fetch("api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode,
          device,
          model,
          fault,
          issue,
          stock,
          same_day_slots: Number(sameDaySlots),
          action,
        }),
        signal: controller.signal,
      })
        .then(response => {
          if (!response.ok) throw new Error(`Decision request failed: ${response.status}`);
          return response.json();
        })
        .then(payload => {
          setDecision(payload);
          setDecisionState("ready");
        })
        .catch(error => {
          if (error.name === "AbortError") return;
          setDecision({ error: error.message, contract: { status: "error", errors: [error.message], options: [] } });
          setDecisionState("error");
        });
    }, 260);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [postcode, stock, sameDaySlots, action, device, model, fault, issue]);

  const canSubmit =
    (delivery === "courier" && selectedOption) ||
    (delivery === "mail" && postcodeKnown) ||
    (delivery === "walkin" && walkInDate && walkInTime);

  const nextAction = (() => {
    if (!postcode.trim()) return { label: "Enter postcode to continue", target: "qw-postcode" };
    if (decisionState === "loading") return { label: "Checking courier options", target: "qw-postcode" };
    if (decisionError(decision)) return { label: decisionError(decision), target: "qw-postcode" };
    if (!delivery) return { label: "Pick a service to continue", target: "qw-delivery-section" };
    if (delivery === "walkin" && !walkInDate) return { label: "Pick a day to continue", target: "qw-walkin-dates" };
    if (delivery === "walkin" && !walkInTime) return { label: "Pick a time to continue", target: "qw-walkin-times" };
    if (delivery === "courier" && !selectedOption) return { label: "Pick a courier option", target: "qw-delivery-section" };
    return null;
  })();

  const ctaLabel = nextAction ? nextAction.label : requiresDiagnosis ? "Continue to booking payload · Diagnosis flow" : "Continue to booking payload";

  const bp = {
    postcode: !!postcodeKnown,
    service: !!delivery,
    dateTime: delivery === "mail" ? true : delivery === "courier" ? !!selectedOption : !!(walkInDate && walkInTime),
  };
  const timeline = buildTimeline({ delivery, selectedOption, walkInDate, walkInTime, mailStartDate });

  const handleDisabledTap = () => {
    if (canSubmit) return;
    if (nextAction?.target) {
      const el = document.getElementById(nextAction.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setNudgeTarget(nextAction.target);
        clearTimeout(nudgeRef.current);
        nudgeRef.current = setTimeout(() => setNudgeTarget(null), 1600);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      mode: "courier_quote_lab",
      model,
      fault,
      issue,
      postcode: postcode.trim().toUpperCase(),
      selectedService: delivery,
      selectedCourierOption: selectedOption,
      mappedRepairType: decision?.mapped_repair_type,
      decisionContract: decision?.contract,
      walkInDate: delivery === "walkin" ? walkInDate : null,
      walkInTime: delivery === "walkin" ? walkInTime : null,
      opsTestState: { stock, sameDaySlots: Number(sameDaySlots), action },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="qw-lab-controls" aria-label="Ops test controls">
        <div className="qw-section-label">Ops test state</div>
        <div className="qw-lab-control-grid">
          <label className="qw-lab-control">Stock
            <select value={stock} onChange={e => setStock(e.target.value)}>
              <option value="available">Available</option>
              <option value="unknown">Unknown</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
          <label className="qw-lab-control">Same-day slots
            <select value={sameDaySlots} onChange={e => setSameDaySlots(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
              <option value={0}>0</option>
            </select>
          </label>
          <label className="qw-lab-control">Action
            <select value={action} onChange={e => setAction(e.target.value)}>
              <option value="quote">Quote view</option>
              <option value="reserve">Reserve simulation</option>
            </select>
          </label>
        </div>
      </div>

      <div className="qw-bp">
        <div className={"qw-bp-step" + (bp.postcode ? " done" : " current")}><span className="qw-bp-num">{bp.postcode ? "✓" : "1"}</span><span className="qw-bp-label">Postcode</span></div>
        <div className="qw-bp-line" />
        <div className={"qw-bp-step" + (bp.service ? " done" : bp.postcode ? " current" : "")}><span className="qw-bp-num">{bp.service ? "✓" : "2"}</span><span className="qw-bp-label">Service</span></div>
        <div className="qw-bp-line" />
        <div className={"qw-bp-step" + (bp.dateTime ? " done" : bp.service ? " current" : "")}><span className="qw-bp-num">{bp.dateTime ? "✓" : "3"}</span><span className="qw-bp-label">Timing</span></div>
        <div className="qw-bp-line" />
        <div className={"qw-bp-step" + (canSubmit ? " current" : "")}><span className="qw-bp-num">4</span><span className="qw-bp-label">Payload</span></div>
      </div>

      <div className={"qw-postcode-card" + (postcodeKnown ? " qw-postcode-card-resolved" : "")}>
        <label className="qw-postcode-label" htmlFor="qw-postcode">
          See available courier options
          <span className="qw-postcode-hint">Enter a full UK postcode. Courier choices now come from the decision contract, not static prototype prices.</span>
        </label>
        <div className="qw-postcode-row">
          <input id="qw-postcode" className="qw-postcode-input" placeholder="e.g. W1B 2EL" autoComplete="postal-code" value={postcode} onChange={e => setPostcode(e.target.value)} />
        </div>
        {decisionState === "typing" && <div className="qw-postcode-warn"><strong>Keep typing.</strong> We need the full postcode before checking courier options.</div>}
        {decisionState === "loading" && <div className="qw-courier-confirm">Checking decision contract...</div>}
        {decisionError(decision) && <div className="qw-postcode-warn"><strong>Postcode check:</strong> {decisionError(decision)}</div>}
        {!postcodeKnown && !decisionError(decision) && (
          <ul className="qw-postcode-unlocks">
            <li><span aria-hidden="true">✓</span> Walk in <span className="qw-postcode-unlocks-meta">(free)</span></li>
            <li><span aria-hidden="true">✓</span> London courier if eligible</li>
            <li><span aria-hidden="true">✓</span> Mail-in fallback</li>
          </ul>
        )}
      </div>

      {postcodeKnown && (
        <div id="qw-delivery-section" className={"qw-delivery-grid qw-delivery-grid-lab" + (nudgeTarget === "qw-delivery-section" ? " qw-nudge" : "")}>
          <QWDeliveryCard active={delivery === "walkin"} onSelect={() => { setDelivery("walkin"); setSelectedOptionId(null); }} title="Walk in" subtitle={CFG.WORKSHOP_ADDRESS} price="Free" />
          {options.map((option, index) => (
            <QWDeliveryCard
              key={option.option_id}
              active={selectedOptionId === option.option_id}
              onSelect={() => { setDelivery("courier"); setSelectedOptionId(option.option_id); }}
              title={serviceTitle(option)}
              subtitle={serviceSubtitle(option)}
              price={moneyLabel(option.customer_price_gross)}
              badge={index === 0 ? "Contract" : null}
            />
          ))}
          {!courierAvailable && manual && (
            <QWDeliveryCard active={delivery === "manual"} onSelect={() => { setDelivery("manual"); setSelectedOptionId(manual.option_id); }} title={serviceTitle(manual)} subtitle={serviceSubtitle(manual)} price="Manual" />
          )}
          <QWDeliveryCard active={delivery === "mail"} onSelect={() => { setDelivery("mail"); setSelectedOptionId(null); }} title="Mail in" subtitle="Fallback path for UK repairs" price="Manual" />
        </div>
      )}

      {decision?.contract?.status === "ok" && (
        <div className="qw-courier-confirm">
          <strong>{decision.contract.postcode.normalised}</strong> returned {options.length} courier option{options.length === 1 ? "" : "s"}. {sameDayCountCopy(decision)}
        </div>
      )}

      {decision?.contract?.status === "manual_fallback" && (
        <div className="qw-postcode-warn">
          <strong>Manual fallback.</strong> This postcode or repair cannot safely show automated London courier options yet.
        </div>
      )}

      {decision?.contract?.turnaround_message && (
        <div className="qw-decision-note">
          <strong>Turnaround wording:</strong> {decision.contract.turnaround_message}
        </div>
      )}

      {delivery === "walkin" && (
        <div className="qw-delivery-detail">
          <div className="qw-section-label">Pick a day & time</div>
          <div id="qw-walkin-dates" className={"qw-date-grid" + (nudgeTarget === "qw-walkin-dates" ? " qw-nudge" : "")}>
            {upcomingWorkingDates(8).map((d, i) => {
              const selected = walkInDate && d.toDateString() === new Date(walkInDate).toDateString();
              return (
                <button key={i} type="button" className={"qw-date-btn" + (selected ? " active" : "")} onClick={() => setWalkInDate(d.toISOString())}>
                  <span className="qw-date-dow">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                  <span className="qw-date-day">{d.getDate()}</span>
                  <span className="qw-date-mon">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
                </button>
              );
            })}
          </div>
          {walkInDate && (
            <div id="qw-walkin-times" className={"qw-time-grid" + (nudgeTarget === "qw-walkin-times" ? " qw-nudge" : "")}>
              {CFG.WALK_IN_TIMES.map(slot => (
                <button key={slot.time} type="button" disabled={slot.full} className={"qw-time-btn" + (walkInTime === slot.time ? " active" : "") + (slot.full ? " full" : "")} onClick={() => !slot.full && setWalkInTime(slot.time)}>
                  {slot.time}{slot.full && <span className="qw-slot-full">Full</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {delivery === "courier" && selectedOption && (
        <div className="qw-selected-contract">
          <div className="qw-section-label">Selected courier decision</div>
          <div className="qw-summary-line"><span>Service</span><span>{serviceTitle(selectedOption)}</span></div>
          <div className="qw-summary-line"><span>Customer price</span><span>{moneyLabel(selectedOption.customer_price_gross)}</span></div>
          <div className="qw-summary-line"><span>Collection</span><span>{selectedOption.estimated_collection_window || "Pending"}</span></div>
          <div className="qw-summary-line"><span>Return</span><span>{selectedOption.estimated_return_window || "Pending"}</span></div>
          <div className="qw-summary-line"><span>Same-day</span><span>{selectedOption.same_day_return ? "Yes" : "No"}</span></div>
        </div>
      )}

      {timeline.length > 0 && (
        <div className="qw-timeline" role="list">
          <div className="qw-timeline-head">
            <div className="qw-section-label">Your repair timeline</div>
            <div className="qw-timeline-promise">Prototype timeline based on the selected service and decision-contract output.</div>
          </div>
          <ol className="qw-timeline-steps">
            {timeline.map((step, i) => (
              <li key={i} className={"qw-timeline-step" + (step.final ? " qw-timeline-step-final" : "")} role="listitem">
                <div className="qw-timeline-marker">{step.final ? "✓" : i + 1}</div>
                <div className="qw-timeline-body">
                  <div className="qw-timeline-label">{step.label}</div>
                  <div className="qw-timeline-date">{step.date}</div>
                  {step.note && <div className="qw-timeline-note">{step.note}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {decision && (
        <details className="qw-contract-payload">
          <summary>Decision payload</summary>
          <pre>{JSON.stringify(decision, null, 2)}</pre>
        </details>
      )}

      <button type={canSubmit ? "submit" : "button"} onClick={canSubmit ? undefined : handleDisabledTap}
        className={"qw-btn qw-btn-lg " + (canSubmit ? "qw-btn-dark" : "qw-btn-prompt")} style={{ width: "100%", marginTop: 12 }}>
        {ctaLabel}
      </button>
      <p className="qw-fineprint">Phase one does not create a Shopify checkout or book Gophr. It produces the booking payload for testing.</p>
    </form>
  );
}

Object.assign(window, { ServiceMapper, QWDeliveryCard });
