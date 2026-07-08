// ═══════════════════════════════════════════════════════════════════════════
//  Diagnose — data layer (rebuilt on the estimate model)
//
//  Implements the house-rules: ask only band-movers, every path lands on a
//  number or a next action, five outcomes one vocabulary:
//    QUOTE ✓ · ESTIMATE · FIXED AT HOME · DATA RECOVERY · TALK TO US
//
//  STAGED LAUNCH: only iPhone · Power/Battery/Charging is a live worked tree.
//  Every other device+fault routes to TALK TO US.
// ═══════════════════════════════════════════════════════════════════════════

// ── PRICES — EDIT THESE. Realistic placeholders, swap for your real figures.
//    The diagnostic is the one fixed number the customer pays up front; it is
//    a separate charge. Bands anchor toward the TOP so the bench result is a relief.
const DIAG_PRICE = {
  diagnostic: 49,                       // £49, a separate one-off charge
  iphone: {
    battery:      { firm: 69 },         // QUOTE ✓ — powers on, battery
    chargePort:   { firm: 89 },         // QUOTE ✓ — ruled out cable/charger
    wontPower:    { low: 69, high: 289 },// ESTIMATE — battery → board-level
    board:        { typical: 289 },     // power-management IC (top of band)
    dataRecovery: { from: 149 },        // separate quote
  },
};

// ── Devices (re-used from the quote wizard vocabulary) ──────────────────────
const DIAG_DEVICES = [
  { id: "iphone",  name: "iPhone",  detail: "iPhone 11 onwards", live: true },
  { id: "macbook", name: "MacBook", detail: "Pro · Air · 2018+", live: false },
  { id: "ipad",    name: "iPad",    detail: "iPad · Air · Pro · Mini", live: false },
  { id: "watch",   name: "Watch",   detail: "Series 5+ · SE · Ultra", live: false },
];

// ── Fault categories per device ─────────────────────────────────────────────
const DIAG_FAULTS = {
  iphone: [
    { id: "battery", label: "Won't power, charge, or hold battery", icon: "battery", live: true },
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "back",    label: "Rear Glass",              icon: "glass" },
    { id: "camera",  label: "Camera",                  icon: "camera" },
    { id: "audio",   label: "Audio / Mic / Speaker",   icon: "audio" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "data",    label: "Data Recovery",           icon: "data" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
  macbook: [
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "input",   label: "Trackpad / Keyboard",     icon: "keyboard" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "data",    label: "Data Recovery",           icon: "data" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
  ipad: [
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "data",    label: "Data Recovery",           icon: "data" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
  watch: [
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
};

// ── Icons (line-SVG, currentColor) ──────────────────────────────────────────
const DIAG_ICONS = {
  screen:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  glass:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="6" r="1.5"/><path d="M10 18h4"/></svg>',
  camera:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  battery:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8"/></svg>',
  audio:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>',
  water:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
  data:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  other:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01M12 8a2 2 0 012 2c0 1-2 2-2 3"/></svg>',
  iphone:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="1" width="12" height="22" rx="2.5"/><path d="M10 19h4"/></svg>',
  macbook:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 17h20M8 21h8M12 17v4"/></svg>',
  ipad:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M10 18h4"/></svg>',
  watch:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="6"/><path d="M9 1h6M9 23h6"/></svg>',
};

function DiagIcon({ name, className }) {
  const html = DIAG_ICONS[name] || DIAG_ICONS.other;
  return <span className={"dg-icon " + (className || "")} dangerouslySetInnerHTML={{ __html: html }} />;
}

// ═══════════════════════════════════════════════════════════════════════════
//  THE LIVE TREE — iPhone · Power / Battery / Charging
//
//  Outcome node shapes:
//   { terminal:true, outcome:"quote",    repair, price, turnaround, summary }
//   { terminal:true, outcome:"estimate", band:[lo,hi], factors:[…], summary, dataNote? }
//   { terminal:true, outcome:"fixed",    title, summary, steps:[…], fallback? }
//   { terminal:true, outcome:"data",     from, summary }
//   { terminal:true, outcome:"talk",     reason, summary, safety? }
// ═══════════════════════════════════════════════════════════════════════════
const P = DIAG_PRICE.iphone;

const DIAG_TREE_IPHONE_POWER = {
  root: "liquid-gate",
  nodes: {

    // CONTEXT gate — liquid changes the whole cost structure, so it's a hard
    // cross-link, not a branch. Safety-first.
    "liquid-gate": {
      question: "First — has it had any liquid contact, ever?",
      hint: "Spills, rain, pocket sweat, a drop in water — even months ago. Liquid changes everything, so we check first.",
      answers: [
        { label: "No liquid contact", next: "powers-on", evidence: "No liquid history" },
        { label: "Yes — it's been wet", next: "out-talk-liquid", evidence: "Liquid contact reported" },
      ],
    },

    // START
    "powers-on": {
      question: "Does the iPhone power on at all?",
      hint: "Any sign of life counts — Apple logo, a buzz, the screen lighting even faintly.",
      answers: [
        { label: "Yes — it powers on", detail: "Boots up, or at least lights up", next: "on-issue", evidence: "Powers on" },
        { label: "No — completely dead", detail: "No logo, no light, no vibration", next: "dead-tried", evidence: "Will not power on" },
      ],
    },

    // ── POWERS ON branch ──
    "on-issue": {
      question: "What's actually happening?",
      answers: [
        { label: "Battery drains fast, or it says “Service”", detail: "Dies early, runs hot, low health %", next: "out-battery", evidence: "Battery wear symptoms" },
        { label: "Won't charge, or only sometimes", detail: "Dead at the cable, or cuts in and out", next: "charge-tried", evidence: "Charging fault" },
        { label: "Random restarts or shutdowns", detail: "Reboots on its own, freezes, bootloops", next: "restart-tried", evidence: "Random restarts" },
      ],
    },

    "charge-tried": {
      question: "Have you tried a different known-good cable AND charger?",
      hint: "A failed cable is the single most common “won't charge.” Worth ruling out before anything else.",
      answers: [
        { label: "Yes — still won't charge", next: "out-port", evidence: "Cable & charger ruled out" },
        { label: "No, not yet", next: "out-fixed-cable", evidence: "Cable not yet ruled out" },
      ],
    },

    "restart-tried": {
      question: "Have you tried a software update or a full restore?",
      hint: "Random restarts are often software. A restore rules that out before we look at hardware.",
      answers: [
        { label: "Yes — still restarts", next: "out-restart-estimate", evidence: "Software ruled out, persists" },
        { label: "No, not yet", next: "out-fixed-restore", evidence: "Software not yet ruled out" },
      ],
    },

    // ── WON'T POWER branch ──
    "dead-tried": {
      question: "Have you tried a known-good charger AND a force restart?",
      hint: "Force restart: press Volume Up, then Volume Down, then hold the Side button for ~10 seconds.",
      answers: [
        { label: "Yes — still totally dead", next: "dead-data", evidence: "Charger + force restart tried, still dead" },
        { label: "No, not yet", next: "out-fixed-deadtry", evidence: "Free checks not yet tried" },
      ],
    },

    "dead-data": {
      question: "Is there data on it you need back that isn't backed up?",
      hint: "Photos, messages, notes — anything not in iCloud or on a computer.",
      answers: [
        { label: "Yes, and it's not backed up", next: "out-data", evidence: "Unbacked-up data at risk" },
        { label: "No — it's backed up / I don't need it", next: "out-wontpower", evidence: "No data at risk" },
      ],
    },

    // ═══ OUTCOMES ═══

    "out-battery": {
      terminal: true, outcome: "quote",
      repair: "Battery replacement",
      price: P.battery.firm,
      turnaround: "Same or next day",
      title: "Battery replacement",
      summary: "Fast drain, a hot phone, or the “Service” message almost always means a worn battery — a known, fixed-price job. Genuine-capacity cell, recalibrated, same standard 2-year warranty.",
    },

    "out-port": {
      terminal: true, outcome: "quote",
      repair: "Charging port repair",
      price: P.chargePort.firm,
      turnaround: "Same or next day",
      title: "Charging port repair",
      summary: "With the cable and charger ruled out, the charging port (or its flex) is the cause — a known, fixed-price repair. We clean, test and replace the port assembly and verify charge current on the bench.",
    },

    "out-fixed-cable": {
      terminal: true, outcome: "fixed",
      title: "Try this first — it's often the cable",
      summary: "Before you pay for anything: a failed cable or charger is the commonest “won't charge.” Rule it out and you may have fixed it for free.",
      steps: [
        "Try a different, known-good Apple cable.",
        "Try a different charger / plug, and a different wall socket.",
        "Gently clean the port — lint packs in and blocks the connection.",
      ],
      fallback: { label: "Still won't charge after all that?", outcome: "quote", repair: "Charging port repair", price: P.chargePort.firm },
    },

    "out-fixed-restore": {
      terminal: true, outcome: "fixed",
      title: "Try a restore first",
      summary: "Random restarts are often software, not hardware. A restore is free and rules it out before we look at the battery or board.",
      steps: [
        "Back up first (iCloud or to a computer).",
        "Update to the latest iOS.",
        "If it persists, restore as new and test before restoring your backup.",
      ],
      fallback: { label: "Still restarting after a restore?", outcome: "estimate" },
    },

    "out-fixed-deadtry": {
      terminal: true, outcome: "fixed",
      title: "Two free checks before anything else",
      summary: "A genuinely dead phone is sometimes a flat battery or a soft lock-up. Try both of these — if it comes back, you've saved a repair.",
      steps: [
        "Leave it on a known-good charger for 30 minutes, then try again.",
        "Force restart: Volume Up, Volume Down, then hold the Side button ~10s.",
      ],
      fallback: { label: "Still no sign of life?", outcome: "estimate" },
    },

    "out-restart-estimate": {
      terminal: true, outcome: "estimate",
      title: "Likely battery — possibly board-level",
      summary: "Restarts that survive a restore are hardware. Most are a worn battery; a minority are a power-management fault on the board. Here's how the range is built — the £" + DIAG_PRICE.diagnostic + " diagnostic (a separate charge) confirms which it is.",
      band: [P.battery.firm, P.board.typical],
      typical: [P.battery.firm, P.battery.firm + 40],
      factors: [
        { label: "Battery replacement", note: "The common cause — most restarts are this.", price: P.battery.firm, base: true, chance: "Most likely", weight: 4, level: "low" },
        { label: "Power-management repair (board-level)", note: "Microsoldering — the less common, higher end.", price: P.board.typical - P.battery.firm, chance: "Less common", weight: 1, level: "high" },
      ],
    },

    "out-wontpower": {
      terminal: true, outcome: "estimate",
      title: "Won't-power — board-level diagnosis",
      summary: "A phone that's truly dead could be the battery, the charging port, or a power fault on the board. Here's how the range is built — the £" + DIAG_PRICE.diagnostic + " diagnostic (a separate charge) confirms the cause.",
      band: [P.wontPower.low, P.wontPower.high],
      typical: [P.wontPower.low, P.wontPower.low + 60],
      factors: [
        { label: "Battery", note: "The cheapest and most common cause.", price: P.wontPower.low, base: true, chance: "Most likely", weight: 4, level: "low" },
        { label: "Charging port", note: "If power isn't getting in at all.", price: 70, chance: "Possible", weight: 2, level: "mid" },
        { label: "Power-management (board)", note: "Microsoldering — the higher end.", price: P.wontPower.high - P.wontPower.low - 70, chance: "Less common", weight: 1, level: "high" },
      ],
      dataNote: "Backed up, so this is a straight repair-cost question — no data-recovery step needed.",
    },

    "out-data": {
      terminal: true, outcome: "data",
      from: P.dataRecovery.from,
      title: "Data first — recovery route",
      summary: "A dead phone with data you need back is a different job from a repair: the priority is getting the data off safely before anything else. It's a separate, data-led service with its own handling and timeline.",
    },

    "out-talk-liquid": {
      terminal: true, outcome: "talk",
      reason: "Liquid damage",
      title: "Liquid damage — let's talk, fast",
      summary: "Liquid changes the whole repair, and speed matters more than a web estimate right now. Talk to us or bring it in today and we'll scope it properly.",
      safety: [
        "Power it off and leave it off — don't charge it.",
        "Rice does nothing. Getting it in fast does.",
        "Corrosion spreads from the moment it's powered.",
      ],
    },
  },
};

// Registry: only worked trees are live. Missing keys → TALK TO US.
const DIAG_TREES = {
  "iphone:battery": DIAG_TREE_IPHONE_POWER,
};

Object.assign(window, {
  DIAG_PRICE, DIAG_DEVICES, DIAG_FAULTS, DIAG_ICONS, DiagIcon, DIAG_TREES,
});
