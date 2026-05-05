// === Diagnostic decision trees ===
//
// SHAPE: a tree of "investigations". Each investigation either asks ONE
// question with a few answer options, or it's a terminal "diagnosis" node.
//
//   InvestigationNode = {
//     id: "mbp-screen-flicker",
//     question: "When the lines appear, do they...",
//     hint?: "Tip: try gently flexing the lid back and forth.",
//     answers: [
//       { label: "Change when I flex the lid", next: "...", evidence: "Lines flex with lid → likely cable" },
//       ...
//     ],
//   }
//
//   DiagnosisNode = {
//     id: "...",
//     terminal: true,
//     confidence: "high" | "medium" | "low",
//     title: "Flexgate — display flex cable wear",
//     summary: "...",
//     repair: { name: "Display flex / cable repair", priceFrom: 280, days: "2–4 days", productHandle?: "..." },
//     // OR for "we need to see it" cases:
//     prediagnosis: true,
//     reading?: { title: "Why MacBooks get Flexgate", url: "#" },
//   }
//
// Each fault category has an entry tree. Only `mbp-screen` is fully worked
// for the prototype — everything else stubs to a 1-question pre-diagnosis path.
// Claude Code will fill the rest using TS data from the live wizard.

const DIAG_TREES = {

  /* ============================================================
     MacBook · Screen — fully worked example
     ============================================================ */
  "macbook:screen": {
    root: "mbp-screen-symptom",
    nodes: {
      "mbp-screen-symptom": {
        question: "What does the screen actually look like?",
        hint: "Pick the closest match — we'll narrow it down with a couple of follow-ups.",
        answers: [
          { label: "Cracked or shattered glass",     detail: "Visible damage on the surface", next: "mbp-cracked", evidence: "Physical damage visible" },
          { label: "Lines, bars, or artifacts",      detail: "Vertical / horizontal lines, glitchy areas", next: "mbp-lines", evidence: "Lines or artifacts on screen" },
          { label: "Black / dark with backlight on", detail: "You can see the Apple logo faintly with a torch", next: "mbp-backlight", evidence: "Backlight on, image dark" },
          { label: "Completely dead — nothing at all", detail: "No image, no flicker, fan may still spin", next: "mbp-dead", evidence: "No display output at all" },
          { label: "Flickering or random colours",   detail: "Image present but unstable", next: "mbp-flicker", evidence: "Display flickers / colour-shifts" },
        ],
      },

      // === Cracked branch ===
      "mbp-cracked": {
        question: "Does the touch / display still respond when it's not cracked?",
        hint: "If the cursor still moves and you can read the un-cracked area, the panel itself is probably fine.",
        answers: [
          { label: "Yes, the rest of the screen works fine", next: "mbp-cracked-glass-only", evidence: "Display still functional outside cracks" },
          { label: "No, parts of it are dead",                next: "mbp-cracked-panel",      evidence: "Damage extends beyond glass" },
          { label: "Not sure",                                 next: "mbp-cracked-unsure",     evidence: "Unsure if panel damaged" },
        ],
      },
      "mbp-cracked-glass-only": {
        terminal: true,
        confidence: "high",
        title: "Display assembly replacement",
        summary: "MacBook displays are sealed assemblies — the glass isn't separable from the panel like a phone screen. Even cosmetic cracks mean a full display swap. Good news: it's a fixed-price repair, not a logic-board diagnosis.",
        repair: { name: "Display assembly", priceFrom: 339, days: "2–4 days" },
        reading: { title: "Why MacBook glass isn't sold separately", url: "#" },
      },
      "mbp-cracked-panel": {
        terminal: true,
        confidence: "high",
        title: "Display assembly replacement",
        summary: "Crack damage that extends into the panel (dead pixels, dark patches, ink-blot spread) means the LCD/OLED itself is compromised. Same fix — full display assembly — but the urgency is higher; ink spread can keep getting worse.",
        repair: { name: "Display assembly", priceFrom: 339, days: "2–4 days" },
      },
      "mbp-cracked-unsure": {
        terminal: true,
        confidence: "medium",
        prediagnosis: true,
        title: "Likely display assembly — book a free pre-diagnosis",
        summary: "Cracked screens are nearly always a display swap, but if the cursor / touch behaviour seems off too, we'd want to rule out a flex cable or trackpad signal issue before quoting. Free 15-minute pre-diagnosis at the workshop.",
      },

      // === Lines / bars branch ===
      "mbp-lines": {
        question: "Do the lines move or change when you flex the lid?",
        hint: "Gently open and close the lid 10°. If lines come and go with the angle, it's almost certainly the flex cable, not the panel.",
        answers: [
          { label: "Yes — the lines change with lid angle", next: "mbp-flexgate", evidence: "Lines respond to lid flex" },
          { label: "No — they're stable regardless",         next: "mbp-lines-stable", evidence: "Lines stable, lid-independent" },
          { label: "Lines disappear entirely sometimes",     next: "mbp-flexgate", evidence: "Intermittent — flex cable signature" },
        ],
      },
      "mbp-flexgate": {
        question: "Roughly which year is your MacBook?",
        hint: "Flexgate is most common on the 2016–2017 MacBook Pro 13\" / 15\" Touch Bar models.",
        answers: [
          { label: "2016–2018 MacBook Pro",  next: "mbp-flexgate-confirmed", evidence: "Year matches Flexgate window" },
          { label: "2019 onwards",            next: "mbp-flexgate-newer",     evidence: "Outside main Flexgate window" },
          { label: "Not sure — older though", next: "mbp-flexgate-confirmed", evidence: "Likely older model, Flexgate plausible" },
        ],
      },
      "mbp-flexgate-confirmed": {
        terminal: true,
        confidence: "high",
        title: "Flexgate — display flex cable wear",
        summary: "Apple's display flex cables on this generation were too short, so opening and closing the lid a few thousand times stresses them until they fail. Two fixes: (1) replace the flex cable alone — board-level repair, what we recommend; (2) full display assembly — Apple's only option and 3× the price.",
        repair: { name: "Flex cable repair (microsoldering)", priceFrom: 280, days: "3–4 days" },
        reading: { title: "Flexgate explained — and why we don't swap the whole screen", url: "#" },
      },
      "mbp-flexgate-newer": {
        terminal: true,
        confidence: "medium",
        prediagnosis: true,
        title: "Flex-cable behaviour on a newer MBP — let's verify",
        summary: "Newer MacBooks use redesigned flex cables, so this is unusual. Could still be flex damage from a knock or wear, but we'd want to scope it before committing to a repair.",
      },
      "mbp-lines-stable": {
        question: "Do the lines appear immediately on boot, or only after the screen has been on a while?",
        hint: "This separates a panel fault from a thermal / GPU issue.",
        answers: [
          { label: "Immediately, every boot",       next: "mbp-panel",      evidence: "Lines from cold boot" },
          { label: "After it's been on a while",    next: "mbp-thermal",    evidence: "Lines appear with warm-up" },
          { label: "Random — sometimes fine",       next: "mbp-prediag",    evidence: "Intermittent without flex pattern" },
        ],
      },
      "mbp-panel": {
        terminal: true,
        confidence: "high",
        title: "LCD / OLED panel failure",
        summary: "Lines that are stable from cold boot and don't change with lid movement point at the panel itself — usually a row driver or T-CON fault. The display assembly is the fix.",
        repair: { name: "Display assembly", priceFrom: 339, days: "2–4 days" },
      },
      "mbp-thermal": {
        terminal: true,
        confidence: "medium",
        title: "GPU or thermal fault — needs in-person diagnosis",
        summary: "Lines that only appear after warm-up are a classic GPU symptom — could be solder fatigue on the GPU package, thermal paste degradation, or a failing voltage rail. We'd need to scope it. Sometimes board-level repair is possible; sometimes the logic board needs replacing.",
        prediagnosis: true,
        reading: { title: "GPU artifacts — what we look for", url: "#" },
      },

      // === Backlight branch ===
      "mbp-backlight": {
        question: "Does an external monitor work when you connect one?",
        hint: "If you can plug in any external display (USB-C / HDMI), that tells us the GPU and main board are still alive.",
        answers: [
          { label: "Yes, external monitor is fine",            next: "mbp-backlight-ic", evidence: "External display works → GPU alive" },
          { label: "No — external monitor is also dark",       next: "mbp-board",        evidence: "External also dark → board / GPU" },
          { label: "Haven't tried / no cable",                  next: "mbp-prediag",      evidence: "External not yet tested" },
        ],
      },
      "mbp-backlight-ic": {
        terminal: true,
        confidence: "high",
        title: "Backlight IC failure",
        summary: "Image present + backlight off = the LCD signal is fine but the backlight power circuit isn't. On most MacBooks this is one or two surface-mount ICs on the logic board — a microsoldering job. Apple's only fix is a £1,400+ logic-board swap. Ours is a chip replacement.",
        repair: { name: "Backlight IC replacement (microsoldering)", priceFrom: 280, days: "3–5 days" },
        reading: { title: "Why Apple swaps the whole board for one IC", url: "#" },
      },
      "mbp-board": {
        terminal: true,
        confidence: "medium",
        title: "Logic-board level fault — pre-diagnosis",
        summary: "External display also dark suggests the GPU or display controller side, not the panel or backlight. We'd need to scope the board to identify which rail or chip — could be repairable, could need a board.",
        prediagnosis: true,
      },

      // === Dead branch ===
      "mbp-dead": {
        question: "When you press the power button, does anything happen?",
        hint: "Listen carefully — fans, the boot chime, keyboard backlight, any sign of life.",
        answers: [
          { label: "Yes — fans / chime / keyboard light", next: "mbp-dead-alive", evidence: "Boots — display side only" },
          { label: "Nothing at all",                        next: "mbp-dead-power", evidence: "Won't power on" },
          { label: "Sometimes one, sometimes the other",    next: "mbp-prediag",    evidence: "Intermittent power" },
        ],
      },
      "mbp-dead-alive": {
        terminal: true,
        confidence: "medium",
        title: "Display or backlight — likely a board-level repair",
        summary: "If the Mac is alive but the screen is fully dead, we're looking at either a backlight circuit or a display-data signal failure. We'd want to confirm under the scope before quoting. Most fixes here are microsoldering, not a screen swap.",
        prediagnosis: true,
      },
      "mbp-dead-power": {
        terminal: true,
        confidence: "medium",
        title: "Won't power on — board-level diagnosis",
        summary: "No fans, no chime, no light = a power rail issue, not a display fault. Could be the battery, a power IC, or a short. We diagnose this for free and quote before any work.",
        prediagnosis: true,
      },

      // === Flicker branch ===
      "mbp-flicker": {
        question: "When does the flickering happen?",
        answers: [
          { label: "Only at certain brightness levels", next: "mbp-flexgate-confirmed", evidence: "Flicker tied to brightness — Flexgate signature" },
          { label: "All the time, randomly",             next: "mbp-prediag",            evidence: "Continuous random flicker" },
          { label: "Only when running on battery",       next: "mbp-prediag",            evidence: "Flicker tied to power source" },
        ],
      },

      "mbp-prediag": {
        terminal: true,
        confidence: "low",
        title: "Needs in-person diagnosis",
        summary: "We've narrowed it to display-side, but the symptoms cross a few possible causes. A 15-minute scope at the workshop will tell us exactly what we're looking at — free, no commitment.",
        prediagnosis: true,
      },
    },
  },

  /* ============================================================
     STUBS — every other (device, fault) combo
     1-question intro then a "book pre-diagnosis" outcome.
     Claude Code can replace each stub with a full tree using
     the TS{} data from icorrect-quote-wizard-final.html.
     ============================================================ */
};

function _stubTree(faultLabel, deviceLabel) {
  return {
    root: "stub-q1",
    nodes: {
      "stub-q1": {
        question: `Tell us a bit more about the ${faultLabel.toLowerCase()} on your ${deviceLabel}.`,
        hint: "We'll route you to the right repair or book you in for a free pre-diagnosis.",
        answers: [
          { label: "Started suddenly",          next: "stub-end-sudden",     evidence: "Sudden onset" },
          { label: "Got worse over time",       next: "stub-end-gradual",    evidence: "Gradual deterioration" },
          { label: "After a drop or knock",     next: "stub-end-impact",     evidence: "Recent impact" },
          { label: "After contact with liquid", next: "stub-end-liquid",     evidence: "Liquid exposure" },
          { label: "Not sure",                  next: "stub-end-prediag",    evidence: "Uncertain origin" },
        ],
      },
      "stub-end-sudden": {
        terminal: true, confidence: "low", prediagnosis: true,
        title: "Sudden-onset fault — pre-diagnosis recommended",
        summary: `Sudden ${faultLabel.toLowerCase()} faults can be a single failed component (often repairable) or a deeper board issue. Quickest path to certainty: a free 15-minute scope at the workshop.`,
      },
      "stub-end-gradual": {
        terminal: true, confidence: "medium", prediagnosis: true,
        title: "Gradual deterioration — likely component wear",
        summary: `${faultLabel} that's been getting worse usually points at a wearing component (battery, flex cable, sensor). We'll confirm under the scope.`,
      },
      "stub-end-impact": {
        terminal: true, confidence: "medium", prediagnosis: true,
        title: "Post-impact fault — needs a look",
        summary: "A drop or knock can damage a single chip, a flex cable, or shift a connector. We open the device, scope it, and tell you what's repairable before we touch anything else.",
      },
      "stub-end-liquid": {
        terminal: true, confidence: "low", prediagnosis: true,
        title: "Liquid damage — ultrasonic clean + diagnosis",
        summary: "Liquid damage doesn't follow rules — corrosion can spread for weeks. We ultrasonic-clean the board, identify failed components, and quote the repair. The pre-diagnosis is free.",
      },
      "stub-end-prediag": {
        terminal: true, confidence: "low", prediagnosis: true,
        title: "Free pre-diagnosis",
        summary: "When the symptoms aren't clear-cut, our diagnosis is. Bring it in or send it to us and we'll tell you exactly what's wrong before quoting a single pound.",
      },
    },
  };
}

// Fill in stubs for every (device, fault) we don't have a real tree for.
for (const dev of ["iphone", "macbook", "ipad", "watch"]) {
  const faults = DIAG_FAULTS[dev] || [];
  const devLabel = (DIAG_DEVICES.find(d => d.id === dev) || {}).name || dev;
  for (const f of faults) {
    const key = `${dev}:${f.id}`;
    if (!DIAG_TREES[key]) {
      DIAG_TREES[key] = _stubTree(f.label, devLabel);
    }
  }
}

Object.assign(window, { DIAG_TREES });
