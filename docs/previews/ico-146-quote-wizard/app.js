(function () {
  "use strict";

  var LONDON_PREFIXES = [
    "EC", "WC", "W", "SW", "SE", "NW", "N", "E",
    "BR", "CR", "DA", "EN", "HA", "IG", "KT", "RM", "SM", "TW", "UB", "WD"
  ];

  var INNER_LONDON_PREFIXES = ["W1", "WC1", "WC2", "EC1", "EC2", "EC3", "EC4", "SW1", "SE1", "E1", "N1", "NW1", "SW11"];

  var CATALOG = {
    macbook: {
      label: "MacBook",
      meta: "Pro & Air",
      families: ["All", "MacBook Pro", "MacBook Air"],
      models: [
        { id: "mbp-14-m3", family: "MacBook Pro", name: "MacBook Pro 14\" (M3)", sub: "2023 to 2024 · Liquid Retina XDR", code: "A2918", screenPrice: 399, batteryPrice: 229, diagPrice: 49 },
        { id: "mba-13-m3", family: "MacBook Air", name: "MacBook Air 13\" (M3)", sub: "2024 · Liquid Retina", code: "A3113", screenPrice: 299, batteryPrice: 199, diagPrice: 49 },
        { id: "mbp-16-m3", family: "MacBook Pro", name: "MacBook Pro 16\" (M3 Pro / Max)", sub: "2023 to 2024 · Liquid Retina XDR", code: "A2991", screenPrice: 549, batteryPrice: 249, diagPrice: 49 },
        { id: "mbp-14-m2", family: "MacBook Pro", name: "MacBook Pro 14\" (M1 / M2 Pro)", sub: "2021 to 2023 · Liquid Retina XDR", code: "A2442", screenPrice: 379, batteryPrice: 219, diagPrice: 49 },
        { id: "mba-13-m2", family: "MacBook Air", name: "MacBook Air 13\" (M2)", sub: "2022 · Liquid Retina", code: "A2681", screenPrice: 289, batteryPrice: 189, diagPrice: 49 },
        { id: "mbp-13-m1", family: "MacBook Pro", name: "MacBook Pro 13\" (M1 / M2)", sub: "2020 to 2022 · Touch Bar", code: "A2338", screenPrice: 299, batteryPrice: 189, diagPrice: 49 }
      ]
    },
    iphone: {
      label: "iPhone",
      meta: "iPhone 12 to 16",
      families: ["All", "iPhone 16", "iPhone 15", "iPhone 14"],
      models: [
        { id: "ip-15", family: "iPhone 15", name: "iPhone 15", sub: "6.1-inch Super Retina XDR", code: "A3090", screenPrice: 149, batteryPrice: 89, diagPrice: 49 },
        { id: "ip-15-pro", family: "iPhone 15", name: "iPhone 15 Pro", sub: "6.1-inch ProMotion XDR", code: "A3102", screenPrice: 249, batteryPrice: 99, diagPrice: 49 },
        { id: "ip-16-pro", family: "iPhone 16", name: "iPhone 16 Pro", sub: "6.3-inch ProMotion XDR", code: "A3293", screenPrice: 299, batteryPrice: 109, diagPrice: 49 },
        { id: "ip-14", family: "iPhone 14", name: "iPhone 14", sub: "6.1-inch Super Retina XDR", code: "A2882", screenPrice: 139, batteryPrice: 79, diagPrice: 49 }
      ]
    },
    ipad: {
      label: "iPad",
      meta: "Pro, Air & Mini",
      families: ["All", "iPad Pro", "iPad Air"],
      models: [
        { id: "ipad-pro-11", family: "iPad Pro", name: "iPad Pro 11\" (M2 / M4)", sub: "Full display replacement", code: "A2759", screenPrice: 279, batteryPrice: 149, diagPrice: 49 },
        { id: "ipad-air-m2", family: "iPad Air", name: "iPad Air 11\" (M2)", sub: "Liquid Retina display", code: "A2902", screenPrice: 219, batteryPrice: 139, diagPrice: 49 }
      ]
    },
    watch: {
      label: "Apple Watch",
      meta: "Series & Ultra",
      families: ["All", "Series", "Ultra"],
      models: [
        { id: "aw-s9", family: "Series", name: "Apple Watch Series 9", sub: "41mm / 45mm OLED display", code: "A2980", screenPrice: 159, batteryPrice: 89, diagPrice: 49 },
        { id: "aw-ultra-2", family: "Ultra", name: "Apple Watch Ultra 2", sub: "49mm flat sapphire display", code: "A2986", screenPrice: 249, batteryPrice: 119, diagPrice: 49 }
      ]
    }
  };

  var FAULTS = [
    {
      id: "screen",
      title: "Cracked or broken screen",
      desc: "Shattered glass, black screen, vertical lines, or backlight failure.",
      tag: "Fixed price",
      isDiag: false
    },
    {
      id: "liquid",
      title: "Liquid damage",
      desc: "Spilled water, coffee, or other liquid. Board-level microelectronics diagnostic.",
      tag: "Triage + diagnostic",
      isDiag: true
    },
    {
      id: "nopower",
      title: "No power / will not turn on",
      desc: "Completely dead, no charging sign, or shuts down unexpectedly.",
      tag: "Triage + diagnostic",
      isDiag: true
    },
    {
      id: "battery",
      title: "Battery replacement",
      desc: "Drains quickly, service battery warning, or swollen cells.",
      tag: "Fixed price",
      isDiag: false
    },
    {
      id: "data",
      title: "Data recovery",
      desc: "Recover essential files from a liquid-damaged or dead Apple device.",
      tag: "Triage + diagnostic",
      isDiag: true
    }
  ];

  var COLLECTION_DATES = [
    { id: "thu-26", dow: "Today", day: "26 Nov", full: "Thu 26 Nov" },
    { id: "fri-27", dow: "Fri", day: "27 Nov", full: "Fri 27 Nov" },
    { id: "mon-30", dow: "Mon", day: "30 Nov", full: "Mon 30 Nov" },
    { id: "tue-01", dow: "Tue", day: "1 Dec", full: "Tue 1 Dec" }
  ];

  var COLLECTION_WINDOWS = [
    { id: "AM", title: "Morning slot", time: "09:00 to 13:00" },
    { id: "PM", title: "Afternoon slot", time: "13:00 to 17:00" }
  ];

  var SCENARIOS = {
    A: {
      id: "A",
      device: "macbook",
      modelId: "mbp-14-m3",
      faultId: "screen",
      name: "Alex Morgan",
      phone: "07700 900123",
      postcode: "W1W 8JQ",
      service: "courier",
      defaultStep: 4
    },
    B: {
      id: "B",
      device: "iphone",
      modelId: "ip-15",
      faultId: "screen",
      name: "Hannah Patel",
      phone: "07700 900456",
      postcode: "E1 6AN",
      service: "mailin",
      defaultStep: 4
    },
    C: {
      id: "C",
      device: "macbook",
      modelId: "mba-13-m3",
      faultId: "screen",
      name: "Samira Bennett",
      phone: "07700 900789",
      postcode: "M1 4BT",
      service: "mailin",
      defaultStep: 4
    },
    D: {
      id: "D",
      device: "macbook",
      modelId: "mbp-14-m3",
      faultId: "liquid",
      name: "David Chen",
      phone: "07700 900321",
      postcode: "SW11 8BJ",
      service: "courier",
      defaultStep: 2
    }
  };

  var state = {
    scenario: "A",
    step: 3,
    device: "macbook",
    familyFilter: "All",
    modelId: "mbp-14-m3",
    faultId: "screen",
    helperOpen: false,
    helperQuery: "",
    triage: {
      usable: "no",
      seenBefore: "apple_quote",
      dataPriority: "essential"
    },
    lead: {
      name: "Alex Morgan",
      phone: "07700 900123",
      postcode: "W1W 8JQ"
    },
    leadErrors: {},
    service: "courier",
    dateId: "thu-26",
    windowId: "AM",
    futureSpeed: "standard",
    showCookieBanner: false,
    showFutureSpeed: false,
    feedbackMsg: ""
  };

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
    });
  }

  function getDeviceObj() {
    return CATALOG[state.device] || CATALOG.macbook;
  }

  function getModelObj() {
    var dev = getDeviceObj();
    for (var i = 0; i < dev.models.length; i++) {
      if (dev.models[i].id === state.modelId) return dev.models[i];
    }
    return dev.models[0];
  }

  function getFaultObj() {
    for (var i = 0; i < FAULTS.length; i++) {
      if (FAULTS[i].id === state.faultId) return FAULTS[i];
    }
    return FAULTS[0];
  }

  function normalizePostcode(raw) {
    var clean = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length > 3) {
      return clean.slice(0, clean.length - 3) + " " + clean.slice(clean.length - 3);
    }
    return clean;
  }

  function isValidUkPostcode(raw) {
    var clean = String(raw || "").trim().toUpperCase().replace(/\s+/g, "");
    return /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(clean);
  }

  function isValidUkPhone(raw) {
    var digits = String(raw || "").replace(/[^\d+]/g, "");
    return /^((\+44|0044)7\d{9}|07\d{9}|(\+44|0044)[123]\d{8,9}|0[123]\d{8,9})$/.test(digits);
  }

  function classifyPostcode(raw) {
    var formatted = normalizePostcode(raw);
    var outward = formatted.split(" ")[0] || "";
    var areaMatch = outward.match(/^[A-Z]+/);
    var area = areaMatch ? areaMatch[0] : "";
    var isLondon = LONDON_PREFIXES.indexOf(area) !== -1;
    var isInner = INNER_LONDON_PREFIXES.indexOf(outward) !== -1 || outward.indexOf("W1") === 0 || outward.indexOf("EC") === 0 || outward.indexOf("WC") === 0;
    return {
      formatted: formatted,
      outward: outward,
      isLondon: isLondon,
      areaLabel: isInner ? "Central London courier zone" : (isLondon ? "Selected London courier zone" : "UK tracked mail-in zone")
    };
  }

  function getBasePrice() {
    var model = getModelObj();
    var fault = getFaultObj();
    if (fault.isDiag) {
      return fault.id === "data" ? 99 : model.diagPrice;
    }
    if (fault.id === "battery") return model.batteryPrice;
    return model.screenPrice;
  }

  function getServiceFee() {
    var zone = classifyPostcode(state.lead.postcode);
    var base = getBasePrice();
    var fault = getFaultObj();
    if (!zone.isLondon) return 0;
    if (state.service === "courier") {
      if (fault.isDiag || base >= 200) return 0;
      return 25;
    }
    return 0;
  }

  function getFutureSpeedAdd() {
    if (!state.showFutureSpeed) return 0;
    var fault = getFaultObj();
    if (fault.isDiag) return 0;
    if (state.futureSpeed === "fast") return 79;
    if (state.futureSpeed === "sameday") return state.device === "iphone" ? 49 : 149;
    return 0;
  }

  function getTotalPrice() {
    return getBasePrice() + getServiceFee() + getFutureSpeedAdd();
  }

  function ensureValidServiceForZone() {
    var zone = classifyPostcode(state.lead.postcode);
    var base = getBasePrice();
    var fault = getFaultObj();
    if (!zone.isLondon) {
      state.service = "mailin";
      return;
    }
    if (base >= 200 || fault.isDiag) {
      if (state.service !== "courier" && state.service !== "workshop") {
        state.service = "courier";
      }
    } else {
      if (state.service !== "courier" && state.service !== "mailin" && state.service !== "workshop") {
        state.service = "mailin";
      }
    }
  }

  function renderDeviceIcon(devKey) {
    if (devKey === "macbook") {
      return '<svg class="device-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="6" width="22" height="15" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M2 23.5h28" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    }
    if (devKey === "iphone") {
      return '<svg class="device-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="9" y="4" width="14" height="24" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M14 7.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    }
    if (devKey === "ipad") {
      return '<svg class="device-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="6" y="4" width="20" height="24" rx="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="24.5" r="1" fill="currentColor"/></svg>';
    }
    return '<svg class="device-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="9" y="8" width="14" height="16" rx="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 8V4.5h8V8M12 24v3.5h8V24" stroke="currentColor" stroke-width="1.6"/></svg>';
  }

  function renderFaultVisualSvg() {
    var fault = getFaultObj();
    var isPhone = state.device === "iphone";
    var accentStroke = fault.isDiag ? "#b45309" : "#0070f3";
    if (isPhone) {
      var overlayPhone = "";
      if (fault.id === "screen") {
        overlayPhone = '<path d="M55 24 L42 52 L58 68 L38 96 M42 52 L28 60" stroke="' + accentStroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      } else if (fault.id === "battery") {
        overlayPhone = '<rect x="34" y="44" width="22" height="36" rx="3" fill="#e8f7f0" stroke="#047857" stroke-width="2"/><path d="M41 41h8" stroke="#047857" stroke-width="2" stroke-linecap="round"/>';
      } else {
        overlayPhone = '<circle cx="45" cy="60" r="16" fill="#fffbeb" stroke="#b45309" stroke-width="2"/><path d="M45 50 C49 56 52 59 52 63 a7 7 0 1 1 -14 0 c0 -4 3 -7 7 -13z" fill="#b45309" opacity="0.85"/>';
      }
      return '<svg width="90" height="122" viewBox="0 0 90 122" fill="none" aria-hidden="true">' +
        '<rect x="18" y="8" width="54" height="106" rx="11" fill="#ffffff" stroke="#171717" stroke-width="2"/>' +
        '<rect x="23" y="15" width="44" height="92" rx="6" fill="#fafafa" stroke="rgba(0,0,0,0.12)"/>' +
        '<rect x="37" y="19" width="16" height="4" rx="2" fill="#171717"/>' +
        overlayPhone +
        '</svg>';
    }

    var overlayMac = "";
    if (fault.id === "screen") {
      overlayMac = '<path d="M68 24 L94 46 L76 66 L108 92 M94 46 L124 38 M76 66 L54 74" stroke="' + accentStroke + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="132" y="24" width="10" height="68" fill="' + accentStroke + '" opacity="0.16"/>';
    } else if (fault.id === "battery") {
      overlayMac = '<rect x="66" y="42" width="68" height="32" rx="4" fill="#e8f7f0" stroke="#047857" stroke-width="2"/><rect x="134" y="51" width="5" height="14" rx="1.5" fill="#047857"/>';
    } else {
      overlayMac = '<circle cx="100" cy="58" r="22" fill="#fffbeb" stroke="#b45309" stroke-width="2"/>' +
        '<path d="M100 44 C106 53 110 57 110 62 a10 10 0 1 1 -20 0 c0 -5 4 -9 10 -18z" fill="#b45309" opacity="0.85"/>';
    }
    return '<svg width="200" height="128" viewBox="0 0 200 128" fill="none" aria-hidden="true">' +
      '<rect x="26" y="12" width="148" height="92" rx="8" fill="#ffffff" stroke="#171717" stroke-width="2"/>' +
      '<rect x="33" y="19" width="134" height="78" rx="3" fill="#fafafa" stroke="rgba(0,0,0,0.12)"/>' +
      '<path d="M10 108 H190 C190 113 185 116 178 116 H22 C15 116 10 113 10 108 Z" fill="#e5e5e5" stroke="#171717" stroke-width="1.8"/>' +
      overlayMac +
      '</svg>';
  }

  function renderStep1() {
    var devObj = getDeviceObj();
    var deviceCards = Object.keys(CATALOG).map(function (key) {
      var d = CATALOG[key];
      var sel = state.device === key ? " is-selected" : "";
      return '<button type="button" class="device-card' + sel + '" data-device="' + key + '">' +
        renderDeviceIcon(key) +
        '<div><div class="device-name">' + esc(d.label) + '</div><div class="device-meta">' + esc(d.meta) + '</div></div>' +
        '</button>';
    }).join("");

    var familyChips = devObj.families.map(function (fam) {
      var active = state.familyFilter === fam ? " is-active" : "";
      return '<button type="button" class="filter-chip' + active + '" data-family="' + esc(fam) + '">' + esc(fam) + '</button>';
    }).join("");

    var filteredModels = devObj.models.filter(function (m) {
      return state.familyFilter === "All" || m.family === state.familyFilter;
    });

    var modelCards = filteredModels.map(function (m) {
      var sel = state.modelId === m.id ? " is-selected" : "";
      return '<button type="button" class="model-btn' + sel + '" data-model="' + esc(m.id) + '">' +
        '<span><span class="model-title">' + esc(m.name) + '</span><span class="model-sub">' + esc(m.sub) + '</span></span>' +
        '<span class="model-code">' + esc(m.code) + '</span>' +
        '</button>';
    }).join("");

    var allMacModels = CATALOG.macbook.models;
    var helperQuery = state.helperQuery.trim().toUpperCase();
    var helperHits = helperQuery
      ? allMacModels.filter(function (m) {
          return m.code.toUpperCase().indexOf(helperQuery) !== -1 || m.name.toUpperCase().indexOf(helperQuery) !== -1;
        })
      : allMacModels.slice(0, 3);

    var helperResultsHtml = helperHits.map(function (m) {
      return '<button type="button" class="helper-hit" data-helper-model="' + esc(m.id) + '">' +
        '<span><strong>' + esc(m.code) + '</strong> · ' + esc(m.name) + '</span>' +
        '<span style="color:#0070f3;font-weight:600;">Select</span>' +
        '</button>';
    }).join("");

    return '<h2 class="step-heading">Which Apple device needs repairing?</h2>' +
      '<p class="step-sub">Select your device and exact model. Every repair uses genuine Apple displays (panel only) with a 2-year warranty.</p>' +
      '<div class="device-grid">' + deviceCards + '</div>' +
      '<div class="section-block">' +
        '<div class="section-block-head">' +
          '<h3 class="section-block-title">Select your ' + esc(devObj.label) + ' model</h3>' +
          '<span class="mono-label">' + filteredModels.length + ' models shown</span>' +
        '</div>' +
        '<div class="filter-row">' + familyChips + '</div>' +
        '<div class="model-grid">' + modelCards + '</div>' +
      '</div>' +
      '<div class="helper-box">' +
        '<button type="button" class="helper-toggle" id="toggleModelHelper" aria-expanded="' + (state.helperOpen ? "true" : "false") + '">' +
          (state.helperOpen ? "Hide model number finder" : "Not sure of your model? Search by A-number") +
        '</button>' +
        '<div class="helper-panel" id="modelHelperPanel"' + (state.helperOpen ? "" : " hidden") + '>' +
          '<p>Flip your MacBook over to find the A-number printed near the hinge (for example, A2918 or A3113).</p>' +
          '<input type="text" class="text-input is-mono" id="modelHelperInput" value="' + esc(state.helperQuery) + '" placeholder="Type A-number, e.g. A2918">' +
          '<div class="helper-results">' + (helperResultsHtml || '<p style="margin:6px 0 0;font-size:13px;color:#5c5c5c;">No matching A-number found in this preview set.</p>') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="step-footer">' +
        '<span class="mono-label">Step 1 of 4</span>' +
        '<button type="button" class="btn-primary" id="step1Continue" style="max-width:300px;">Continue to fault selection &rarr;</button>' +
      '</div>';
  }

  function renderStep2() {
    var model = getModelObj();
    var fault = getFaultObj();

    var faultCards = FAULTS.map(function (f) {
      var sel = state.faultId === f.id ? " is-selected" : "";
      var tagClass = f.isDiag ? "fault-tag is-diag" : "fault-tag";
      return '<button type="button" class="fault-card' + sel + '" data-fault="' + esc(f.id) + '">' +
        '<span class="fault-title">' + esc(f.title) + '</span>' +
        '<span class="fault-desc">' + esc(f.desc) + '</span>' +
        '<span class="' + tagClass + '">' + esc(f.tag) + '</span>' +
        '</button>';
    }).join("");

    var triageHtml = "";
    if (fault.isDiag) {
      var dataNote = state.triage.usable === "yes"
        ? "If you can, please back up your device. Liquid damage is unpredictable and may still affect your data, though we will take every care with your device."
        : "Liquid damage and power faults can be unpredictable. During the diagnostic we will prioritise protecting your data wherever we can.";

      triageHtml = '<div class="triage-card" id="triageCard">' +
        '<span class="mono-label">Quick Bench Triage (Required for ' + esc(fault.title) + ')</span>' +
        '<h3 class="section-block-title" style="margin-top:6px;">Three quick questions for our microelectronics team</h3>' +
        '<p class="quote-card-sub">Straightforward screen repairs skip these questions. For liquid damage, no power, or data recovery, your answers let our technicians prepare the right bench diagnostic.</p>' +

        '<div class="triage-q">' +
          '<span class="triage-q-label">1. Is the device turning on and usable right now?</span>' +
          '<div class="triage-opts">' +
            '<button type="button" class="triage-opt' + (state.triage.usable === "yes" ? " is-selected" : "") + '" data-triage="usable" data-val="yes">Yes, turns on and is usable</button>' +
            '<button type="button" class="triage-opt' + (state.triage.usable === "no" ? " is-selected" : "") + '" data-triage="usable" data-val="no">No, will not turn on or is not usable</button>' +
          '</div>' +
        '</div>' +

        '<div class="triage-q">' +
          '<span class="triage-q-label">2. Has it already been to Apple or another repair shop?</span>' +
          '<div class="triage-opts">' +
            '<button type="button" class="triage-opt' + (state.triage.seenBefore === "no" ? " is-selected" : "") + '" data-triage="seenBefore" data-val="no">No, nobody has opened it</button>' +
            '<button type="button" class="triage-opt' + (state.triage.seenBefore === "apple_quote" ? " is-selected" : "") + '" data-triage="seenBefore" data-val="apple_quote">Yes, Apple quoted a replacement</button>' +
            '<button type="button" class="triage-opt' + (state.triage.seenBefore === "other_shop" ? " is-selected" : "") + '" data-triage="seenBefore" data-val="other_shop">Yes, another repair shop looked at it</button>' +
            '<button type="button" class="triage-opt' + (state.triage.seenBefore === "unsure" ? " is-selected" : "") + '" data-triage="seenBefore" data-val="unsure">Not sure</button>' +
          '</div>' +
        '</div>' +

        '<div class="triage-q">' +
          '<span class="triage-q-label">3. How important is keeping the data on this device?</span>' +
          '<div class="triage-opts">' +
            '<button type="button" class="triage-opt' + (state.triage.dataPriority === "essential" ? " is-selected" : "") + '" data-triage="dataPriority" data-val="essential">Essential: prioritise keeping my data</button>' +
            '<button type="button" class="triage-opt' + (state.triage.dataPriority === "backup" ? " is-selected" : "") + '" data-triage="dataPriority" data-val="backup">I already have a full backup</button>' +
          '</div>' +
        '</div>' +

        '<div class="triage-notice">' + esc(dataNote) + '</div>' +
      '</div>';
    }

    return '<h2 class="step-heading">What is wrong with your ' + esc(model.name) + '?</h2>' +
      '<p class="step-sub">Select the symptom that matches best. The illustration highlights the affected area (referencing Michael\'s PR #104/#107 fault marks pattern).</p>' +
      '<div class="fault-layout">' +
        '<div class="fault-visual-card">' +
          '<span class="mono-label">Visual Fault Preview Slot</span>' +
          '<div class="fault-visual-stage">' + renderFaultVisualSvg() + '</div>' +
          '<p class="fault-visual-caption"><strong>' + esc(model.name) + '</strong><br>' + esc(fault.title) + '</p>' +
        '</div>' +
        '<div class="fault-grid">' + faultCards + '</div>' +
      '</div>' +
      triageHtml +
      '<div class="step-footer">' +
        '<span class="mono-label">Step 2 of 4</span>' +
        '<button type="button" class="btn-primary" id="step2Continue" style="max-width:320px;">Continue to unlock your quote &rarr;</button>' +
      '</div>';
  }

  function renderStep3DataWall() {
    var model = getModelObj();
    var fault = getFaultObj();
    var zoneValid = isValidUkPostcode(state.lead.postcode);
    var zone = zoneValid ? classifyPostcode(state.lead.postcode) : null;

    var zoneBadgeHtml = "";
    if (zone) {
      zoneBadgeHtml = '<div class="zone-preview-pill' + (zone.isLondon ? "" : " is-mailin") + '">' +
        (zone.isLondon
          ? "London zone matched (" + esc(zone.outward) + "): same-day London courier &amp; Fitzrovia drop-off available"
          : "UK zone matched (" + esc(zone.outward) + "): free tracked and insured UK mail-in pack available") +
        '</div>';
    }

    return '<div class="data-wall-grid">' +
      '<div class="data-wall-card">' +
        '<div class="job-pill-banner">' +
          '<div>' +
            '<span class="job-pill-text">' + esc(model.name) + ' · ' + esc(fault.title) + '</span>' +
            '<span class="job-pill-sub">' + (fault.isDiag ? "Board-level diagnostic · deducted from final repair" : "Genuine Apple displays (panel only) · 2-year warranty") + '</span>' +
          '</div>' +
          '<button type="button" class="text-action-btn" id="dwEditDevice">Edit</button>' +
        '</div>' +

        '<span class="mono-label">Step 3 of 4 · Instant Fixed Quote</span>' +
        '<h2 class="step-heading" style="margin-top:6px;">Unlock your instant fixed quote</h2>' +
        '<p class="step-sub">See your upfront fixed price right now, plus same-day London collection availability for your postcode.</p>' +

        '<div class="trust-inline-strip">' +
          '<span class="trust-badge is-green">4.8 from 750+ Google reviews</span>' +
          '<span class="trust-badge">Genuine Apple displays</span>' +
          '<span class="trust-badge">2-year warranty</span>' +
          '<span class="trust-badge">2 working days</span>' +
        '</div>' +

        '<form class="form-stack" id="dataWallForm" novalidate>' +
          '<div class="field-group">' +
            '<label class="field-label" for="dwName">Full name</label>' +
            '<input type="text" class="text-input' + (state.leadErrors.name ? " is-error" : "") + '" id="dwName" autocomplete="name" value="' + esc(state.lead.name) + '" placeholder="e.g. Alex Morgan">' +
            (state.leadErrors.name ? '<span class="field-error">' + esc(state.leadErrors.name) + '</span>' : '') +
          '</div>' +

          '<div class="field-group">' +
            '<label class="field-label" for="dwPhone">UK phone number</label>' +
            '<input type="tel" inputmode="tel" class="text-input' + (state.leadErrors.phone ? " is-error" : "") + '" id="dwPhone" autocomplete="tel" value="' + esc(state.lead.phone) + '" placeholder="e.g. 07700 900123">' +
            '<span class="field-hint">Used for courier arrival updates and your quote follow-up if you need advice.</span>' +
            (state.leadErrors.phone ? '<span class="field-error">' + esc(state.leadErrors.phone) + '</span>' : '') +
          '</div>' +

          '<div class="field-group">' +
            '<label class="field-label" for="dwPostcode">UK postcode</label>' +
            '<input type="text" class="text-input is-mono' + (state.leadErrors.postcode ? " is-error" : "") + '" id="dwPostcode" autocomplete="postal-code" autocapitalize="characters" spellcheck="false" value="' + esc(state.lead.postcode) + '" placeholder="e.g. W1W 8JQ">' +
            '<div id="dwZonePreview">' + zoneBadgeHtml + '</div>' +
            (state.leadErrors.postcode ? '<span class="field-error">' + esc(state.leadErrors.postcode) + '</span>' : '') +
          '</div>' +

          '<p class="privacy-note">No spam calls, ever. Your details pre-fill Shopify checkout so you do not have to type them twice, and let our Fitzrovia team help if you prefer a trade-in or question first.</p>' +

          '<button type="submit" class="btn-primary" id="dwSubmitBtn">Show my fixed quote &rarr;</button>' +

          '<div class="sample-fill-row">' +
            '<button type="button" class="text-action-btn" id="dwFillSample">Fill sample details for Scenario ' + esc(state.scenario) + '</button>' +
            '<span class="mono-label">Upfront fixed pricing · No deposits</span>' +
          '</div>' +
        '</form>' +
      '</div>' +

      '<aside class="data-wall-aside" aria-label="What you unlock next">' +
        '<span class="mono-label">What You See Next</span>' +
        '<h3 class="aside-title">Transparent pricing with zero surprises</h3>' +
        '<ul class="aside-list">' +
          '<li><span class="check-dot" aria-hidden="true">&#10003;</span><span><strong>Exact fixed repair total</strong> including VAT and 2-year warranty, with Klarna 3-payment breakdown on orders £100+.</span></li>' +
          '<li><span class="check-dot" aria-hidden="true">&#10003;</span><span><strong>Instant London vs UK check:</strong> free collection on orders £200+ in selected London zones, or a free tracked and insured UK mail-in pack elsewhere.</span></li>' +
          '<li><span class="check-dot" aria-hidden="true">&#10003;</span><span><strong>Direct technician support:</strong> if your device is better suited to a diagnostic or trade-in, our Fitzrovia workshop can advise straight away.</span></li>' +
        '</ul>' +
      '</aside>' +
    '</div>';
  }

  function renderStep4Quote() {
    ensureValidServiceForZone();
    var model = getModelObj();
    var fault = getFaultObj();
    var zone = classifyPostcode(state.lead.postcode);
    var base = getBasePrice();
    var svcFee = getServiceFee();
    var speedAdd = getFutureSpeedAdd();
    var total = getTotalPrice();
    var firstName = (state.lead.name || "there").trim().split(/\s+/)[0];

    var serviceCardsHtml = "";
    if (zone.isLondon && (base >= 200 || fault.isDiag)) {
      serviceCardsHtml =
        '<button type="button" class="service-card' + (state.service === "courier" ? " is-selected" : "") + '" data-svc="courier">' +
          '<span class="service-radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="service-name-row"><span class="service-name">Same-Day London Courier Collection</span><span class="service-pill">Recommended</span></span>' +
            '<span class="service-desc">Door-to-door collection and return across selected London zones (' + esc(zone.outward) + ' included). Free on orders of £200 or more.</span>' +
          '</span>' +
          '<span class="service-price is-free">Free</span>' +
        '</button>' +
        '<button type="button" class="service-card' + (state.service === "workshop" ? " is-selected" : "") + '" data-svc="workshop">' +
          '<span class="service-radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="service-name-row"><span class="service-name">Drop off in Fitzrovia</span><span class="service-pill is-neutral">W1W 8JQ</span></span>' +
            '<span class="service-desc">Bring your device to 12 Margaret Street, Audley House, London W1W 8JQ. Mon to Thu 9am to 6pm, Friday 10am to 6pm.</span>' +
          '</span>' +
          '<span class="service-price is-free">Free</span>' +
        '</button>';
    } else if (zone.isLondon && base < 200) {
      serviceCardsHtml =
        '<button type="button" class="service-card' + (state.service === "mailin" ? " is-selected" : "") + '" data-svc="mailin">' +
          '<span class="service-radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="service-name-row"><span class="service-name">Free Tracked &amp; Insured UK Mail-In Pack</span><span class="service-pill">Free under £200</span></span>' +
            '<span class="service-desc">We post a protective box with a prepaid tracked and insured label to your door. No courier surcharge on repairs under £200.</span>' +
          '</span>' +
          '<span class="service-price is-free">Free</span>' +
        '</button>' +
        '<button type="button" class="service-card' + (state.service === "workshop" ? " is-selected" : "") + '" data-svc="workshop">' +
          '<span class="service-radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="service-name-row"><span class="service-name">Drop off in Fitzrovia</span><span class="service-pill is-neutral">W1W 8JQ</span></span>' +
            '<span class="service-desc">Bring it directly to 12 Margaret Street, Audley House, London W1W 8JQ. Mon to Thu 9am to 6pm, Friday 10am to 6pm.</span>' +
          '</span>' +
          '<span class="service-price is-free">Free</span>' +
        '</button>' +
        '<button type="button" class="service-card' + (state.service === "courier" ? " is-selected" : "") + '" data-svc="courier">' +
          '<span class="service-radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="service-name-row"><span class="service-name">Same-Day London Courier Collection</span><span class="service-pill is-neutral">Door-to-door</span></span>' +
            '<span class="service-desc">Optional London courier collection and return for orders under £200 (free on orders £200+).</span>' +
          '</span>' +
          '<span class="service-price">+£25</span>' +
        '</button>';
    } else {
      serviceCardsHtml =
        '<button type="button" class="service-card is-selected" data-svc="mailin">' +
          '<span class="service-radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="service-name-row"><span class="service-name">Free Tracked &amp; Insured UK Mail-In Pack</span><span class="service-pill">Included UK-wide</span></span>' +
            '<span class="service-desc">For postcodes outside our London courier zones (' + esc(zone.outward) + '), we post a free padded box and prepaid tracked, insured return label to your door.</span>' +
          '</span>' +
          '<span class="service-price is-free">Free</span>' +
        '</button>';
    }

    var slotBlockHtml = "";
    if (state.service === "courier" || state.service === "workshop") {
      var dateBtns = COLLECTION_DATES.map(function (d) {
        var sel = state.dateId === d.id ? " is-selected" : "";
        return '<button type="button" class="date-btn' + sel + '" data-date="' + d.id + '">' +
          '<span class="date-dow">' + esc(d.dow) + '</span>' +
          '<span class="date-day">' + esc(d.day) + '</span>' +
          '</button>';
      }).join("");

      var winBtns = COLLECTION_WINDOWS.map(function (w) {
        var sel = state.windowId === w.id ? " is-selected" : "";
        return '<button type="button" class="window-btn' + sel + '" data-window="' + w.id + '">' +
          '<span class="window-title">' + esc(w.title) + '</span>' +
          '<span class="window-time">' + esc(w.time) + '</span>' +
          '</button>';
      }).join("");

      slotBlockHtml = '<div class="slot-block">' +
        '<span class="slot-label">' + (state.service === "courier" ? "Choose your London collection day and window" : "Choose your Fitzrovia drop-off day and window") + '</span>' +
        '<div class="date-strip">' + dateBtns + '</div>' +
        '<div class="window-row">' + winBtns + '</div>' +
      '</div>';
    }

    var futureSpeedHtml = "";
    if (state.showFutureSpeed && !fault.isDiag) {
      var sdFee = state.device === "iphone" ? 49 : 149;
      futureSpeedHtml = '<div class="future-speed-card" id="futureSpeedSlot">' +
        '<span class="future-badge">PREVIEW ONLY: FUTURE SPEED TIERS (NOT LIVE)</span>' +
        '<h3 class="quote-card-title">How future turnaround upgrades slot cleanly into Step 4</h3>' +
        '<p class="quote-card-sub">Hidden in default live-compliant mode. Shows where Standard, Priority, Same-Day, and ~1h London courier options fit without crowding mobile spacing.</p>' +
        '<div class="speed-grid">' +
          '<button type="button" class="speed-opt' + (state.futureSpeed === "standard" ? " is-selected" : "") + '" data-speed="standard">' +
            '<span class="speed-opt-title">Standard</span>' +
            '<span class="speed-opt-meta">2 working days at workshop</span>' +
            '<span class="speed-opt-price" style="color:#047857;">Included</span>' +
          '</button>' +
          '<button type="button" class="speed-opt' + (state.futureSpeed === "fast" ? " is-selected" : "") + '" data-speed="fast">' +
            '<span class="speed-opt-title">Priority (Future)</span>' +
            '<span class="speed-opt-meta">Next working day bench slot</span>' +
            '<span class="speed-opt-price">+£79</span>' +
          '</button>' +
          (zone.isLondon
            ? '<button type="button" class="speed-opt' + (state.futureSpeed === "sameday" ? " is-selected" : "") + '" data-speed="sameday">' +
                '<span class="speed-opt-title">Same-Day (Future)</span>' +
                '<span class="speed-opt-meta">B1/B2 stocked slot · ~1h bike</span>' +
                '<span class="speed-opt-price">+£' + sdFee + '</span>' +
              '</button>'
            : '<div class="speed-opt" style="opacity:0.65;cursor:default;">' +
                '<span class="speed-opt-title">Same-Day</span>' +
                '<span class="speed-opt-meta">Selected London zones only</span>' +
                '<span class="speed-opt-price">Unavailable</span>' +
              '</div>') +
        '</div>' +
      '</div>';
    }

    var timelineSteps = [];
    if (fault.isDiag) {
      timelineSteps = [
        { title: state.service === "mailin" ? "We post your free insured pack" : "We collect from your London door", desc: state.service === "mailin" ? "Protective box and prepaid tracked label posted within 24 hours." : "Tracked door-to-door London courier brings your device safely to Fitzrovia." },
        { title: "Board-level diagnostic in Fitzrovia", desc: "Microelectronics inspection with your triage notes attached. Standard assessment within 2 working days of workshop arrival." },
        { title: "Clear repair quote, £" + base + " deducted", desc: "You decide whether to proceed. Your £" + base + " diagnostic fee is deducted from the final repair price." }
      ];
    } else if (state.service === "mailin") {
      timelineSteps = [
        { title: "Free tracked & insured pack posted to " + esc(zone.outward), desc: "Padded protective box and prepaid tracked return label arrive at your door." },
        { title: "Repaired in 2 working days at Fitzrovia", desc: "Genuine Apple displays (panel only), recalibrated and tested in-house once your device reaches our workshop." },
        { title: "Tracked insured delivery back to you", desc: "Backed by our 2-year warranty with zero hidden extras." }
      ];
    } else if (state.service === "workshop") {
      timelineSteps = [
        { title: "Drop off at 12 Margaret Street, W1W 8JQ", desc: "Hand your device directly to our Fitzrovia team (Mon to Thu 9am to 6pm, Friday 10am to 6pm)." },
        { title: "Repaired in 2 working days in-house", desc: "Genuine Apple displays (panel only), fitted and recalibrated at our Fitzrovia bench." },
        { title: "Collect ready to go, 2-year warranty", desc: "We message you as soon as final quality checks pass." }
      ];
    } else {
      timelineSteps = [
        { title: "Same-day London courier collects from " + esc(zone.outward), desc: "Dedicated London courier collects during your chosen slot and brings your device straight to Fitzrovia." },
        { title: "Repaired in 2 working days once it reaches our workshop", desc: "Genuine Apple displays (panel only), keeping your original lid with full calibration." },
        { title: "Courier returns it to your door", desc: "Delivered back safely, backed by our 2-year warranty." }
      ];
    }

    var timelineHtml = timelineSteps.map(function (st, idx) {
      return '<li class="timeline-step">' +
        '<span class="timeline-num">0' + (idx + 1) + '</span>' +
        '<div><div class="timeline-title">' + st.title + '</div><div class="timeline-desc">' + st.desc + '</div></div>' +
        '</li>';
    }).join("");

    var triageSummaryHtml = "";
    if (fault.isDiag) {
      var usableTxt = state.triage.usable === "yes" ? "Turns on / usable" : "Will not turn on / not usable";
      var dataTxt = state.triage.dataPriority === "essential" ? "Prioritise data" : "Backed up";
      triageSummaryHtml = '<div class="triage-notice" style="margin-top:0;">' +
        '<strong>Bench triage attached:</strong> ' + esc(usableTxt) + ' · ' + esc(dataTxt) + '. Sent directly to our Fitzrovia technicians with your order.' +
      '</div>';
    }

    var svcLabel = state.service === "courier"
      ? "Same-day London courier"
      : (state.service === "workshop" ? "Fitzrovia workshop drop-off" : "Tracked & insured UK mail-in pack");

    var klarnaHtml = total >= 100
      ? '<div class="klarna-box"><span class="klarna-pill">Klarna.</span><span>Or 3 interest-free payments of <strong>£' + (total / 3).toFixed(2) + '</strong> at checkout.</span></div>'
      : '';

    var serviceRowValue = svcFee === 0 ? '<strong class="is-free">Free</strong>' : '<strong>+£' + svcFee + '</strong>';
    var speedRowHtml = speedAdd > 0
      ? '<div class="bd-row"><span>Future speed preview add-on</span><strong>+£' + speedAdd + '</strong></div>'
      : '';

    var turnaroundLine = fault.isDiag
      ? "Diagnostic turnaround: 2 working days once your device reaches our workshop."
      : "Standard turnaround: 2 working days once your device reaches our workshop.";

    return '<div class="quote-layout">' +
      /* LEFT / TOP ON MOBILE: NATURAL ORDER (POSTCODE -> SERVICE & SLOT -> OPTIONAL SPEED -> TIMELINE) */
      '<div class="quote-left">' +
        '<div class="lead-banner">' +
          '<div class="lead-banner-main">' +
            '<span class="mono-label">Fixed Quote Unlocked · ' + esc(zone.areaLabel) + '</span>' +
            '<span class="lead-banner-title">Quote ready for ' + esc(firstName) + ' · ' + esc(zone.formatted) + '</span>' +
            '<span class="lead-banner-meta">' + esc(model.name) + ' · ' + esc(fault.title) + ' · ' + esc(state.lead.phone) + '</span>' +
          '</div>' +
          '<button type="button" class="text-action-btn" id="editLeadBtn">Edit details</button>' +
        '</div>' +

        triageSummaryHtml +

        '<div class="quote-card" id="servicePickerCard">' +
          '<div class="quote-card-head">' +
            '<div>' +
              '<span class="mono-label">1. How Your Device Reaches Us</span>' +
              '<h3 class="quote-card-title" style="margin-top:4px;">' + (zone.isLondon ? "London collection &amp; drop-off options" : "Free tracked &amp; insured UK mail-in") + '</h3>' +
            '</div>' +
          '</div>' +
          '<div class="service-list">' + serviceCardsHtml + '</div>' +
          slotBlockHtml +
        '</div>' +

        futureSpeedHtml +

        /* Uncollapsed concise timeline & trust strip visible by default on mobile */
        '<div class="quote-card" id="timelineCard">' +
          '<span class="mono-label">2. How It Works (Visible By Default)</span>' +
          '<h3 class="quote-card-title" style="margin-top:4px;">Simple 3-step Fitzrovia repair process</h3>' +
          '<ol class="timeline-list">' + timelineHtml + '</ol>' +
          '<div class="trust-grid">' +
            '<div class="trust-tile"><div class="trust-tile-title">Genuine Apple displays</div><div class="trust-tile-sub">Display panel only, keeping your original lid and factory calibration.</div></div>' +
            '<div class="trust-tile"><div class="trust-tile-title">2-year warranty</div><div class="trust-tile-sub">Every screen and component repair is backed by our 2-year guarantee.</div></div>' +
            '<div class="trust-tile"><div class="trust-tile-title">4.8 from 750+ Google reviews</div><div class="trust-tile-sub">Verified independent clients across London and the UK.</div></div>' +
            '<div class="trust-tile"><div class="trust-tile-title">2 working days</div><div class="trust-tile-sub">Completed in-house once your device reaches our Fitzrovia workshop.</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* RIGHT RAIL ON DESKTOP (STICKY) / FOLLOWS NATURALLY ON MOBILE */
      '<div class="quote-right">' +
        '<div class="price-summary-card" id="priceSummaryCard">' +
          '<div class="price-top-row">' +
            '<span class="mono-label">' + (fault.isDiag ? "Diagnostic Fee" : "All-In Fixed Price") + '</span>' +
            '<span class="warranty-pill">2-year warranty</span>' +
          '</div>' +
          '<div class="price-hero-row">' +
            '<span class="price-hero">£' + total + '</span>' +
            '<span class="price-vat">inc. VAT</span>' +
          '</div>' +
          '<p class="price-turnaround">' + esc(turnaroundLine) + '</p>' +

          '<div class="price-breakdown">' +
            '<div class="bd-row"><span>' + esc(model.name) + ' · ' + esc(fault.title) + '</span><strong>£' + base + '</strong></div>' +
            '<div class="bd-row"><span>' + esc(svcLabel) + '</span>' + serviceRowValue + '</div>' +
            speedRowHtml +
          '</div>' +

          klarnaHtml +

          '<p class="payment-assurance">Upfront fixed pricing with no deposits required. Your name, UK phone number, and postcode pre-fill Shopify checkout automatically.</p>' +

          '<div class="cta-stack">' +
            '<button type="button" class="btn-primary" id="proceedCheckoutBtn">Proceed to checkout · £' + total + '</button>' +
            '<div class="secondary-actions">' +
              '<button type="button" class="btn-secondary" id="emailQuoteBtn">Email this quote</button>' +
              '<button type="button" class="btn-secondary" id="askQuestionBtn">Ask a question</button>' +
            '</div>' +
          '</div>' +

          (state.feedbackMsg ? '<div class="inline-feedback" role="status">' + esc(state.feedbackMsg) + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function updateStepperAndChips() {
    var model = getModelObj();
    var fault = getFaultObj();
    var dev = getDeviceObj();

    var tabs = document.querySelectorAll(".step-tab");
    tabs.forEach(function (tab) {
      var s = parseInt(tab.getAttribute("data-step"), 10);
      tab.classList.toggle("is-active", s === state.step);
      tab.classList.toggle("is-done", s < state.step);
      tab.setAttribute("aria-selected", s === state.step ? "true" : "false");
    });

    var chips = [
      '<span class="sel-chip">' + esc(dev.label) + '</span>',
      '<span class="sel-chip">' + esc(model.name) + '</span>',
      '<span class="sel-chip">' + esc(fault.title) + '</span>'
    ];
    if (state.step === 4 && state.lead.postcode) {
      chips.push('<span class="sel-chip">' + esc(normalizePostcode(state.lead.postcode)) + '</span>');
    } else {
      chips.push('<span class="sel-chip sel-chip-muted">Step ' + state.step + ' of 4</span>');
    }
    document.getElementById("selectionChips").innerHTML = chips.join("");

    var backBtn = document.getElementById("stepBackBtn");
    backBtn.hidden = state.step <= 1;
  }

  function updateStickyAndCookie() {
    var sticky = document.getElementById("mobileStickyCta");
    var banner = document.getElementById("simCookieBanner");
    var root = document.documentElement;

    banner.hidden = !state.showCookieBanner;
    root.classList.toggle("sim-cookie-on", state.showCookieBanner);
    document.getElementById("toggleCookieWrap").classList.toggle("is-on", state.showCookieBanner);
    document.getElementById("toggleSpeedWrap").classList.toggle("is-on", state.showFutureSpeed);
    document.getElementById("toggleCookieBanner").checked = state.showCookieBanner;
    document.getElementById("toggleFutureSpeed").checked = state.showFutureSpeed;

    if (state.showCookieBanner) {
      var rect = banner.getBoundingClientRect();
      var h = Math.max(Math.ceil(rect.height), window.innerWidth < 750 ? 227 : 86);
      root.style.setProperty("--cookie-h", h + "px");
      var badge = banner.querySelector(".sim-cookie-badge");
      if (badge) badge.textContent = "Simulated " + Math.ceil(rect.height || 227) + "px UK Banner";
    } else {
      root.style.setProperty("--cookie-h", "0px");
    }

    if (state.step === 4) {
      ensureValidServiceForZone();
      var total = getTotalPrice();
      var svcFee = getServiceFee();
      var svcShort = state.service === "courier"
        ? (svcFee === 0 ? "Free courier" : "£" + svcFee + " courier")
        : (state.service === "workshop" ? "Fitzrovia drop-off" : "Free mail-in");
      document.getElementById("stickyPrice").textContent = "£" + total;
      document.getElementById("stickySub").textContent = svcShort + " · 2 working days";
      sticky.hidden = false;
    } else {
      sticky.hidden = true;
    }
  }

  function openCheckoutModal() {
    ensureValidServiceForZone();
    var model = getModelObj();
    var fault = getFaultObj();
    var zone = classifyPostcode(state.lead.postcode);
    var total = getTotalPrice();
    var svcFee = getServiceFee();
    var dateObj = COLLECTION_DATES.filter(function (d) { return d.id === state.dateId; })[0] || COLLECTION_DATES[0];
    var winObj = COLLECTION_WINDOWS.filter(function (w) { return w.id === state.windowId; })[0] || COLLECTION_WINDOWS[0];

    var rows = [
      ["Device & Model", model.name + " (" + model.code + ")"],
      ["Repair / Fault", fault.title],
      ["Customer Name", state.lead.name],
      ["UK Phone", state.lead.phone],
      ["Postcode", zone.formatted + " (" + zone.areaLabel + ")"],
      ["Service", state.service === "courier" ? "Same-day London courier" : (state.service === "workshop" ? "Fitzrovia drop-off (W1W 8JQ)" : "Free tracked & insured UK mail-in")],
      ["Collection / Drop-off", state.service === "mailin" ? "Box posted within 24h" : (dateObj.full + ", " + winObj.time)],
      ["Turnaround", "2 working days once at workshop"],
      ["Upfront Fixed Total", "£" + total + " inc. VAT" + (svcFee > 0 ? " (includes +£" + svcFee + " courier)" : "")]
    ];

    document.getElementById("checkoutPayload").innerHTML = rows.map(function (r) {
      return '<div class="payload-row"><span>' + esc(r[0]) + '</span><strong>' + esc(r[1]) + '</strong></div>';
    }).join("");

    document.getElementById("checkoutModal").hidden = false;
  }

  function wireStageEvents() {
    var stage = document.getElementById("wizardStage");

    if (state.step === 1) {
      stage.querySelectorAll("[data-device]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.device = btn.getAttribute("data-device");
          state.familyFilter = "All";
          state.modelId = getDeviceObj().models[0].id;
          render();
        });
      });

      stage.querySelectorAll("[data-family]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.familyFilter = btn.getAttribute("data-family");
          render();
        });
      });

      stage.querySelectorAll("[data-model]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.modelId = btn.getAttribute("data-model");
          state.step = 2;
          render();
        });
      });

      var helperToggle = document.getElementById("toggleModelHelper");
      if (helperToggle) {
        helperToggle.addEventListener("click", function () {
          state.helperOpen = !state.helperOpen;
          render();
        });
      }

      var helperInput = document.getElementById("modelHelperInput");
      if (helperInput) {
        helperInput.addEventListener("input", function () {
          state.helperQuery = helperInput.value;
          var pos = helperInput.selectionStart;
          render();
          var nextInp = document.getElementById("modelHelperInput");
          if (nextInp) {
            nextInp.focus();
            nextInp.setSelectionRange(pos, pos);
          }
        });
      }

      stage.querySelectorAll("[data-helper-model]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.device = "macbook";
          state.modelId = btn.getAttribute("data-helper-model");
          state.helperOpen = false;
          state.step = 2;
          render();
        });
      });

      var s1Cont = document.getElementById("step1Continue");
      if (s1Cont) s1Cont.addEventListener("click", function () { state.step = 2; render(); });
    }

    if (state.step === 2) {
      stage.querySelectorAll("[data-fault]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.faultId = btn.getAttribute("data-fault");
          var f = getFaultObj();
          if (!f.isDiag) {
            state.step = 3;
          }
          render();
        });
      });

      stage.querySelectorAll("[data-triage]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var key = btn.getAttribute("data-triage");
          var val = btn.getAttribute("data-val");
          state.triage[key] = val;
          render();
        });
      });

      var s2Cont = document.getElementById("step2Continue");
      if (s2Cont) s2Cont.addEventListener("click", function () { state.step = 3; render(); });
    }

    if (state.step === 3) {
      var editBtn = document.getElementById("dwEditDevice");
      if (editBtn) editBtn.addEventListener("click", function () { state.step = 1; render(); });

      var nameInp = document.getElementById("dwName");
      var phoneInp = document.getElementById("dwPhone");
      var pcInp = document.getElementById("dwPostcode");

      if (nameInp) nameInp.addEventListener("input", function () { state.lead.name = nameInp.value; });
      if (phoneInp) phoneInp.addEventListener("input", function () { state.lead.phone = phoneInp.value; });
      if (pcInp) {
        pcInp.addEventListener("input", function () {
          state.lead.postcode = pcInp.value.toUpperCase();
          var preview = document.getElementById("dwZonePreview");
          if (preview) {
            if (isValidUkPostcode(state.lead.postcode)) {
              var z = classifyPostcode(state.lead.postcode);
              preview.innerHTML = '<div class="zone-preview-pill' + (z.isLondon ? "" : " is-mailin") + '">' +
                (z.isLondon
                  ? "London zone matched (" + esc(z.outward) + "): same-day London courier &amp; Fitzrovia drop-off available"
                  : "UK zone matched (" + esc(z.outward) + "): free tracked and insured UK mail-in pack available") +
                '</div>';
            } else {
              preview.innerHTML = "";
            }
          }
        });
      }

      var fillBtn = document.getElementById("dwFillSample");
      if (fillBtn) {
        fillBtn.addEventListener("click", function () {
          var sc = SCENARIOS[state.scenario] || SCENARIOS.A;
          state.lead = { name: sc.name, phone: sc.phone, postcode: sc.postcode };
          state.leadErrors = {};
          render();
        });
      }

      var form = document.getElementById("dataWallForm");
      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var errs = {};
          if (!state.lead.name || state.lead.name.trim().length < 2) {
            errs.name = "Please enter your full name so we can prepare your quote.";
          }
          if (!isValidUkPhone(state.lead.phone)) {
            errs.phone = "Please enter a valid UK mobile or landline number (e.g. 07700 900123).";
          }
          if (!isValidUkPostcode(state.lead.postcode)) {
            errs.postcode = "Please enter a full UK postcode (e.g. W1W 8JQ or M1 4BT).";
          }
          state.leadErrors = errs;
          if (Object.keys(errs).length > 0) {
            render();
            return;
          }
          state.lead.postcode = normalizePostcode(state.lead.postcode);
          ensureValidServiceForZone();
          state.feedbackMsg = "";
          state.step = 4;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    }

    if (state.step === 4) {
      var editLead = document.getElementById("editLeadBtn");
      if (editLead) editLead.addEventListener("click", function () { state.step = 3; render(); });

      stage.querySelectorAll("[data-svc]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.service = btn.getAttribute("data-svc");
          state.feedbackMsg = "";
          render();
        });
      });

      stage.querySelectorAll("[data-date]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.dateId = btn.getAttribute("data-date");
          render();
        });
      });

      stage.querySelectorAll("[data-window]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.windowId = btn.getAttribute("data-window");
          render();
        });
      });

      stage.querySelectorAll("[data-speed]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.futureSpeed = btn.getAttribute("data-speed");
          render();
        });
      });

      var proceedBtn = document.getElementById("proceedCheckoutBtn");
      if (proceedBtn) proceedBtn.addEventListener("click", openCheckoutModal);

      var emailBtn = document.getElementById("emailQuoteBtn");
      if (emailBtn) {
        emailBtn.addEventListener("click", function () {
          state.feedbackMsg = "Quote summary queued for " + state.lead.name + " (" + state.lead.phone + "). Ready for Intercom follow-up.";
          render();
        });
      }

      var askBtn = document.getElementById("askQuestionBtn");
      if (askBtn) {
        askBtn.addEventListener("click", function () {
          state.feedbackMsg = "Technician callback request logged for " + state.lead.name + " on " + state.lead.phone + ".";
          render();
        });
      }
    }
  }

  function applyScenario(key, forcedStep) {
    var sc = SCENARIOS[key] || SCENARIOS.A;
    state.scenario = sc.id;
    state.device = sc.device;
    state.familyFilter = "All";
    state.modelId = sc.modelId;
    state.faultId = sc.faultId;
    state.lead = { name: sc.name, phone: sc.phone, postcode: sc.postcode };
    state.leadErrors = {};
    state.service = sc.service;
    state.futureSpeed = "standard";
    state.feedbackMsg = "";
    state.step = typeof forcedStep === "number" ? forcedStep : sc.defaultStep;

    document.querySelectorAll("[data-scenario]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-scenario") === sc.id);
    });

    render();
  }

  function render() {
    updateStepperAndChips();
    var stage = document.getElementById("wizardStage");
    if (state.step === 1) stage.innerHTML = renderStep1();
    else if (state.step === 2) stage.innerHTML = renderStep2();
    else if (state.step === 3) stage.innerHTML = renderStep3DataWall();
    else stage.innerHTML = renderStep4Quote();

    wireStageEvents();
    updateStickyAndCookie();
  }

  function wireGlobalControls() {
    document.querySelectorAll("[data-scenario]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyScenario(btn.getAttribute("data-scenario"));
      });
    });

    document.querySelectorAll(".step-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = parseInt(tab.getAttribute("data-step"), 10);
        if (target === 4 && (!isValidUkPostcode(state.lead.postcode) || !isValidUkPhone(state.lead.phone) || !state.lead.name.trim())) {
          var sc = SCENARIOS[state.scenario] || SCENARIOS.A;
          state.lead = { name: sc.name, phone: sc.phone, postcode: sc.postcode };
        }
        state.step = target;
        state.feedbackMsg = "";
        render();
      });
    });

    document.getElementById("stepBackBtn").addEventListener("click", function () {
      if (state.step > 1) {
        state.step -= 1;
        state.feedbackMsg = "";
        render();
      }
    });

    document.getElementById("toggleCookieBanner").addEventListener("change", function (e) {
      state.showCookieBanner = !!e.target.checked;
      updateStickyAndCookie();
    });

    document.getElementById("toggleFutureSpeed").addEventListener("change", function (e) {
      state.showFutureSpeed = !!e.target.checked;
      if (!state.showFutureSpeed) state.futureSpeed = "standard";
      render();
    });

    var specBtn = document.getElementById("pvSpecBtn");
    var specDrawer = document.getElementById("pvSpecDrawer");
    specBtn.addEventListener("click", function () {
      var open = specDrawer.hidden;
      specDrawer.hidden = !open;
      specBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.getElementById("stickyProceedBtn").addEventListener("click", openCheckoutModal);
    document.getElementById("closeCheckoutModal").addEventListener("click", function () {
      document.getElementById("checkoutModal").hidden = true;
    });
    document.getElementById("checkoutModal").addEventListener("click", function (e) {
      if (e.target === e.currentTarget) document.getElementById("checkoutModal").hidden = true;
    });

    ["simCookieAccept", "simCookieDecline", "simCookieManage"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", function () {
          state.showCookieBanner = false;
          updateStickyAndCookie();
        });
      }
    });

    window.addEventListener("resize", updateStickyAndCookie);
  }

  function initFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var sc = (params.get("scenario") || "A").toUpperCase();
    var stepParam = params.get("step");
    var cookieParam = params.get("cookie");
    var speedParam = params.get("speed");

    state.showCookieBanner = cookieParam === "1" || cookieParam === "true";
    state.showFutureSpeed = speedParam === "1" || speedParam === "true";

    var parsedStep = stepParam ? parseInt(stepParam, 10) : 3;
    if (!(parsedStep >= 1 && parsedStep <= 4)) parsedStep = 3;

    applyScenario(SCENARIOS[sc] ? sc : "A", parsedStep);
  }

  wireGlobalControls();
  initFromQuery();
})();
