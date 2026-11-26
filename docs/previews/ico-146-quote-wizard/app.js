(() => {
  'use strict';

  /* =========================================================================
     Data: Devices, Models, Faults, Prices, & Locked Copy (Audit Sections 2-7)
     ========================================================================= */
  const LOCKED_LIQUID_COPY = {
    usable: "If you can, please back up your device. Liquid damage is unpredictable and may still affect your data, though we'll still take every care with your device.",
    notUsable: "Liquid damage can be unpredictable. There's a small chance your data could be affected. During the diagnostic we'll prioritise protecting your data wherever we can."
  };

  const HOME_ADDRESS_SKU = {
    variantId: '46150010929405',
    title: 'Home / collection / mail-in pack address line',
    price: 0,
    property: 'Home / collection / mail-in pack'
  };

  const DEVICES = [
    { id: 'macbook', name: 'MacBook', sub: 'Pro & Air (Intel & M-series)' },
    { id: 'iphone', name: 'iPhone', sub: '12 to 16 Pro Max' },
    { id: 'ipad', name: 'iPad', sub: 'Pro, Air & standard' },
    { id: 'watch', name: 'Apple Watch', sub: 'Series 6 to Ultra 2' }
  ];

  const MODELS = {
    macbook: [
      { id: 'mbp-14-m3', series: 'MacBook Pro', name: 'MacBook Pro 14" (M3, 2023)', code: 'A2918', chip: 'M3', intelDustFlex: false, touchBar: false, colors: ['Space Black', 'Silver'], prices: { screen: 549, battery: 219, 'charging-port': 199, keyboard: 249, trackpad: 189, diagnostic: 49, logicFloor: 249 }, expressFee: 79 },
      { id: 'mbp-16-m3', series: 'MacBook Pro', name: 'MacBook Pro 16" (M3 Pro/Max)', code: 'A2991', chip: 'M3 Pro', intelDustFlex: false, touchBar: false, colors: ['Space Black', 'Silver'], prices: { screen: 699, battery: 239, 'charging-port': 199, keyboard: 269, trackpad: 199, diagnostic: 49, logicFloor: 249 }, expressFee: 79 },
      { id: 'mba-13-m3', series: 'MacBook Air', name: 'MacBook Air 13" (M3, 2024)', code: 'A3113', chip: 'M3', intelDustFlex: false, touchBar: false, colors: ['Midnight', 'Starlight', 'Space Grey', 'Silver'], prices: { screen: 399, battery: 179, 'charging-port': 179, keyboard: 219, trackpad: 169, diagnostic: 49, logicFloor: 249 }, expressFee: 79 },
      { id: 'mba-15-m3', series: 'MacBook Air', name: 'MacBook Air 15" (M3, 2024)', code: 'A3114', chip: 'M3', intelDustFlex: false, touchBar: false, colors: ['Midnight', 'Starlight', 'Space Grey', 'Silver'], prices: { screen: 449, battery: 199, 'charging-port': 179, keyboard: 229, trackpad: 179, diagnostic: 49, logicFloor: 249 }, expressFee: 79 },
      { id: 'mbp-14-m1', series: 'MacBook Pro', name: 'MacBook Pro 14" (M1 Pro, 2021)', code: 'A2442', chip: 'M1 Pro', intelDustFlex: false, touchBar: false, colors: ['Space Grey', 'Silver'], prices: { screen: 529, battery: 209, 'charging-port': 189, keyboard: 239, trackpad: 179, diagnostic: 49, logicFloor: 249 }, expressFee: 79 },
      { id: 'mbp-13-2019', series: 'MacBook Pro', name: 'MacBook Pro 13" (2019 Intel)', code: 'A2159', chip: 'Intel', intelDustFlex: true, hasDustgate: true, hasFlexgate: false, touchBar: true, colors: ['Space Grey', 'Silver'], prices: { screen: 349, dustgate: 199, battery: 179, 'charging-port': 169, keyboard: 229, trackpad: 169, 'touch-bar': 189, diagnostic: 49, logicFloor: 249 }, expressFee: 79 },
      { id: 'mbp-13-2017', series: 'MacBook Pro', name: 'MacBook Pro 13" (2016/2017 Intel)', code: 'A1706', chip: 'Intel', intelDustFlex: true, hasDustgate: true, hasFlexgate: true, touchBar: true, colors: ['Space Grey', 'Silver'], prices: { screen: 299, dustgate: 189, flexgate: 189, battery: 169, 'charging-port': 159, keyboard: 219, trackpad: 159, 'touch-bar': 179, diagnostic: 49, logicFloor: 249 }, expressFee: 79 }
    ],
    iphone: [
      { id: 'ip-16-pro', series: 'iPhone 16', name: 'iPhone 16 Pro', code: 'A3293', colors: ['Black Titanium', 'Natural Titanium', 'Desert Titanium', 'White Titanium'], prices: { screen: 329, battery: 99, 'charging-port': 119, 'rear-glass': 169, 'rear-camera': 189, 'front-camera': 219, diagnostic: 69, logicFloor: 199 }, expressFee: 49 },
      { id: 'ip-15-pro', series: 'iPhone 15', name: 'iPhone 15 Pro', code: 'A3102', colors: ['Black Titanium', 'Blue Titanium', 'Natural Titanium', 'White Titanium'], prices: { screen: 299, battery: 95, 'charging-port': 109, 'rear-glass': 149, 'rear-camera': 179, 'front-camera': 199, diagnostic: 69, logicFloor: 199 }, expressFee: 49 },
      { id: 'ip-14-pro', series: 'iPhone 14', name: 'iPhone 14 Pro', code: 'A2890', colors: ['Space Black', 'Deep Purple', 'Silver', 'Gold'], prices: { screen: 249, battery: 89, 'charging-port': 99, 'rear-glass': 139, 'rear-camera': 159, 'front-camera': 189, diagnostic: 69, logicFloor: 199 }, expressFee: 49 },
      { id: 'ip-13', series: 'iPhone 13', name: 'iPhone 13', code: 'A2633', colors: ['Midnight', 'Starlight', 'Blue', 'Pink'], prices: { screen: 179, battery: 79, 'charging-port': 89, 'rear-glass': 119, 'rear-camera': 129, 'front-camera': 159, diagnostic: 69, logicFloor: 199 }, expressFee: 49 }
    ],
    ipad: [
      { id: 'ipad-pro-13-m4', series: 'iPad Pro', name: 'iPad Pro 13" (M4, 2024)', code: 'A2925', nanoOption: true, needsConnect: true, colors: ['Space Black', 'Silver'], prices: { screen: 499, battery: 159, 'charging-port': 149, diagnostic: 69, logicFloor: 199 }, expressFee: 79 },
      { id: 'ipad-air-11-m2', series: 'iPad Air', name: 'iPad Air 11" (M2, 2024)', code: 'A2902', nanoOption: false, needsConnect: true, colors: ['Space Grey', 'Starlight', 'Blue', 'Purple'], prices: { screen: 279, battery: 129, 'charging-port': 129, diagnostic: 69, logicFloor: 199 }, expressFee: 79 }
    ],
    watch: [
      { id: 'watch-ultra-2', series: 'Ultra', name: 'Apple Watch Ultra 2', code: 'A2986', colors: ['Natural Titanium', 'Black Titanium'], prices: { 'screen-glass': 229, screen: 329, battery: 109, crown: 129, diagnostic: 49, logicFloor: 149 }, expressFee: 49 },
      { id: 'watch-s9-45', series: 'Series 9', name: 'Apple Watch Series 9 (45mm)', code: 'A2980', colors: ['Midnight', 'Starlight', 'Silver'], prices: { 'screen-glass': 149, screen: 219, battery: 89, crown: 99, diagnostic: 49, logicFloor: 149 }, expressFee: 49 }
    ]
  };

  /* 5-day working strip anchored on Thu 26 Nov 2026 per approved audit spec */
  const WORKING_DATES = [
    { iso: '2026-11-26', short: 'Thu 26', label: 'Thu 26 Nov', isToday: true, isFriday: false, stdReturn: 'Mon 30 Nov', stdReturnIso: '2026-11-30', expReturn: 'Fri 27 Nov', expReturnIso: '2026-11-27', expSlotsNormal: 2, expSlotsFullWeek: 0 },
    { iso: '2026-11-27', short: 'Fri 27', label: 'Fri 27 Nov', isToday: false, isFriday: true, stdReturn: 'Tue 1 Dec', stdReturnIso: '2026-12-01', expReturn: 'Mon 30 Nov', expReturnIso: '2026-11-30', expSlotsNormal: 1, expSlotsFullWeek: 0 },
    { iso: '2026-11-30', short: 'Mon 30', label: 'Mon 30 Nov', isToday: false, isFriday: false, stdReturn: 'Wed 2 Dec', stdReturnIso: '2026-12-02', expReturn: 'Tue 1 Dec', expReturnIso: '2026-12-01', expSlotsNormal: 3, expSlotsFullWeek: 0 },
    { iso: '2026-12-01', short: 'Tue 1', label: 'Tue 1 Dec', isToday: false, isFriday: false, stdReturn: 'Thu 3 Dec', stdReturnIso: '2026-12-03', expReturn: 'Wed 2 Dec', expReturnIso: '2026-12-02', expSlotsNormal: 3, expSlotsFullWeek: 3 },
    { iso: '2026-12-02', short: 'Wed 2', label: 'Wed 2 Dec', isToday: false, isFriday: false, stdReturn: 'Fri 4 Dec', stdReturnIso: '2026-12-04', expReturn: 'Thu 3 Dec', expReturnIso: '2026-12-03', expSlotsNormal: 3, expSlotsFullWeek: 3 }
  ];

  const SWATCH_HEX = {
    'Space Black': '#1E1F22',
    'Silver': '#D9DCE0',
    'Midnight': '#232B38',
    'Starlight': '#E7E2D8',
    'Space Grey': '#6D7178',
    'Black Titanium': '#2C2C2E',
    'Natural Titanium': '#B9B5AC',
    'Desert Titanium': '#C2A88B',
    'White Titanium': '#EFEFEF',
    'Blue Titanium': '#3B485A',
    'Deep Purple': '#574B67',
    'Gold': '#DEC69D',
    'Blue': '#4D749E',
    'Pink': '#E7C1C8',
    'Purple': '#A394C4'
  };

  /* =========================================================================
     Application State
     ========================================================================= */
  const state = {
    step: 1,
    maxStep: 1,
    device: 'macbook',
    series: 'All',
    modelId: 'mbp-14-m3',
    finderOpen: false,
    finderQuery: '',
    vgStep: 0,
    vgAnswers: {},

    fault: null,
    subOption: null,
    resolvedSku: 'screen',
    route: 'repair', // 'repair' | 'diagnostic' | 'dismiss' | 'contact'
    dustFlexConfirmed: false,
    swollenBattery: false,

    // Liquid & No Power triage (Section 3.2)
    liquidUsable: null, // 'yes' | 'no'
    liquidAck: false,
    dataAnswer: null,
    appleBeen: null,
    appleVerdict: null,
    appleQuote: '',

    // Data Recovery triage (Section 3.3)
    recWhat: null,
    recState: null,
    recTried: null,
    recTriedSaid: null,
    recPassword: null,
    recPriority: '',
    iphoneRecoveryPath: null, // 'dead' | 'passcode'

    // Step 3 details
    name: '',
    email: '',
    phone: '',
    postcode: '',
    postcodeInfo: null,
    errors: {},

    // Step 4 booking choices
    service: 'courier', // 'courier' | 'dropoff' | 'mailin'
    speed: 'standard', // 'standard' | 'express'
    selectedDateIso: '2026-11-26',
    selectedWindow: 'am', // 'am' | 'pm'
    fullDateNotice: '',
    deviceColor: '',
    ipadGlass: 'Standard',
    ipadConnect: 'Wi-Fi',

    // Preview test controls
    expressFullThisWeek: false,
    cookieSim: false,
    londonTimeOverride: null, // { hour, minute } or null for live Europe/London
    activeScenario: 'screen',
    trustindexLoaded: false
  };

  /* =========================================================================
     UK Postcode Validation (Audit Section 2.3) & Europe/London Clock Logic
     ========================================================================= */
  const OUTWARD_RE = /^(?:[A-Z]{1,2}[0-9]{1,2}|[A-Z]{1,2}[0-9][A-Z])$/;
  const INWARD_RE = /^[0-9][A-Z]{2}$/;

  function parseFullPostcode(raw) {
    const clean = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length < 5 || clean.length > 7) return null;
    const outward = clean.slice(0, -3);
    const inward = clean.slice(-3);
    if (!OUTWARD_RE.test(outward) || !INWARD_RE.test(inward)) return null;
    const formatted = outward + ' ' + inward;
    const band = resolveLondonBand(outward);
    return { clean, outward, inward, formatted, band };
  }

  function resolveLondonBand(outward) {
    if (/^(W1[A-Z]?|WC[12][A-Z]?|EC[1-4][A-Z]?|SW1[A-Z]?|NW1|SE1|E1|N1)$/.test(outward)) return 'B1';
    if (/^(W[2-9]|W1[0-4]|SW[2-9]|SW1[0-9]|NW[2-9]|NW1[01]|N[2-9]|N1[0-9]|E[2-9]|E1[0-8]|SE[2-9]|SE1[0-9]|SE2[0-8])$/.test(outward)) return 'B2';
    if (/^(CR|BR|DA|EN|HA|IG|KT|RM|SM|TW|UB|WD)[0-9]/.test(outward)) return 'B3';
    if (/^(AL|CM|GU|HP|LU|ME|RG|RH|SL|SS|TN)[0-9]/.test(outward)) return 'B4';
    return 'UK';
  }

  function getLondonClock() {
    if (state.londonTimeOverride) return state.londonTimeOverride;
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(new Date());
      const hour = Number(parts.find((p) => p.type === 'hour')?.value || 10);
      const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0);
      return { hour, minute };
    } catch (_err) {
      return { hour: 11, minute: 15 };
    }
  }

  function getClockStatus(band) {
    const { hour, minute } = getLondonClock();
    const mins = hour * 60 + minute;
    const isInnerLondon = band === 'B1' || band === 'B2';
    const todayAllowedCourier = isInnerLondon && mins < 14 * 60;
    const morningExpiredToday = mins >= 10 * 60 + 30;
    const dropoffTodayAllowed = mins < 15 * 60;
    const clockText = String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0') + ' Europe/London';
    return { hour, minute, mins, isInnerLondon, todayAllowedCourier, morningExpiredToday, dropoffTodayAllowed, clockText };
  }

  /* =========================================================================
     Helpers: Model, Pricing, Capacity, Dates
     ========================================================================= */
  function getModel() {
    const list = MODELS[state.device] || [];
    return list.find((m) => m.id === state.modelId) || list[0];
  }

  function getFaultDefinitions(model) {
    if (state.device === 'macbook') {
      const list = [
        { id: 'screen', title: 'Screen / Display', sub: 'Cracked panel, lines, dark screen', badge: 'Panel only' },
        { id: 'power', title: 'Battery / Charging', sub: 'Draining fast, swollen, or USB-C port', badge: '1 check' },
        { id: 'keyboard', title: 'Keyboard', sub: 'Stuck, repeating, or dead keys', badge: 'Straight to price' },
        { id: 'trackpad', title: 'Trackpad', sub: 'No click, jumping, or cracked glass', badge: 'Straight to price' },
        { id: 'liquid', title: 'Water Damage', sub: 'Spill, splash, or liquid exposure', badge: 'Inline triage' },
        { id: 'nopower', title: 'No Power', sub: 'Will not turn on or dead board', badge: 'Inline triage' },
        { id: 'recovery', title: 'Data Recovery', sub: 'Recover files from a failed Mac', badge: 'Inline triage' }
      ];
      if (model.touchBar) {
        list.splice(4, 0, { id: 'touch-bar', title: 'Touch Bar', sub: 'Flickering, unresponsive, or cracked', badge: 'Straight to price' });
      }
      return list;
    }
    if (state.device === 'iphone') {
      return [
        { id: 'screen', title: 'Screen / Display', sub: 'Cracked glass, lines, or touch fault', badge: '1 check' },
        { id: 'power', title: 'Battery / Charging', sub: 'Battery health, port, or won\'t power on', badge: '1 check' },
        { id: 'rear-glass', title: 'Rear Glass', sub: 'Cracked back glass or lens cover', badge: '1 check' },
        { id: 'camera', title: 'Camera / Face ID', sub: 'Rear lens, blur, or Face ID module', badge: '1 check' },
        { id: 'liquid', title: 'Water Damage', sub: 'Liquid spill or submersion', badge: 'Inline triage' },
        { id: 'recovery', title: 'Data Recovery', sub: 'Dead phone data or passcode check', badge: 'Inline triage' }
      ];
    }
    if (state.device === 'ipad') {
      return [
        { id: 'screen', title: 'Screen / Display', sub: 'Cracked display, touch, or dark panel', badge: '1 check' },
        { id: 'power', title: 'Battery / Charging', sub: 'Battery drain, USB-C port, or dead', badge: '1 check' },
        { id: 'liquid', title: 'Water Damage', sub: 'Liquid spill or exposure', badge: 'Inline triage' },
        { id: 'recovery', title: 'Data Recovery', sub: 'Recover files from a dead iPad', badge: 'Inline triage' }
      ];
    }
    return [
      { id: 'screen', title: 'Screen / Display', sub: 'Cracked glass or dead OLED', badge: '1 check' },
      { id: 'power', title: 'Battery / Power', sub: 'Fast drain or will not turn on', badge: '1 check' },
      { id: 'crown', title: 'Digital Crown', sub: 'Stuck, stiff, or unresponsive crown', badge: 'Straight to price' },
      { id: 'liquid', title: 'Water Damage', sub: 'Liquid exposure or fogging', badge: 'Inline triage' }
    ];
  }

  function isTriageFault(faultId) {
    return faultId === 'liquid' || faultId === 'nopower' || faultId === 'recovery';
  }

  function isFaceIdRepair() {
    return state.device === 'iphone' && state.resolvedSku === 'front-camera';
  }

  function getBasePrice() {
    const model = getModel();
    if (state.route === 'diagnostic') return model.prices.diagnostic;
    return model.prices[state.resolvedSku] || model.prices.screen || 199;
  }

  function getExpressFee() {
    if (state.route === 'diagnostic' || isFaceIdRepair()) return 0;
    return getModel().expressFee || 79;
  }

  function canUseExpress() {
    return state.route === 'repair' && !isFaceIdRepair();
  }

  function getServiceAdjustment() {
    const base = getBasePrice();
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'B1';
    if (state.service === 'courier') {
      if (state.route === 'diagnostic' || base >= 200) return 0;
      if (band === 'B1' || band === 'B2') return 25;
      return 0;
    }
    return 0;
  }

  function getTotalPrice() {
    const base = getBasePrice();
    const exp = state.speed === 'express' && canUseExpress() ? getExpressFee() : 0;
    const adj = getServiceAdjustment();
    return base + exp + adj;
  }

  function isLondonPostcode() {
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'UK';
    return band === 'B1' || band === 'B2' || band === 'B3' || band === 'B4';
  }

  function courierAvailableForOrder() {
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'UK';
    const base = getBasePrice();
    if (band === 'B1' || band === 'B2') return true;
    if ((band === 'B3' || band === 'B4') && (base >= 200 || state.route === 'diagnostic')) return true;
    return false;
  }

  function getExpressSlotsForDate(dateObj) {
    return state.expressFullThisWeek ? dateObj.expSlotsFullWeek : dateObj.expSlotsNormal;
  }

  function getEligibleDates(service) {
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'B1';
    const clk = getClockStatus(band);
    return WORKING_DATES.map((d) => {
      let availableForService = true;
      if (service === 'courier' && d.isToday && !clk.todayAllowedCourier) {
        availableForService = false;
      }
      if (service === 'dropoff' && d.isToday && !clk.dropoffTodayAllowed) {
        availableForService = false;
      }
      const expLeft = getExpressSlotsForDate(d);
      const expressAvailable = availableForService && expLeft > 0;
      return {
        ...d,
        availableForService,
        expLeft,
        expressAvailable
      };
    });
  }

  function ensureValidStep4Defaults() {
    const model = getModel();
    if (!state.deviceColor && model.colors && model.colors.length) {
      state.deviceColor = model.colors[0];
    }
    if (!canUseExpress()) {
      state.speed = 'standard';
    }
    if (!isLondonPostcode()) {
      state.service = 'mailin';
    } else if (state.service === 'courier' && !courierAvailableForOrder()) {
      state.service = 'mailin';
    }

    if (state.service === 'courier' || state.service === 'dropoff') {
      const dates = getEligibleDates(state.service);
      const current = dates.find((d) => d.iso === state.selectedDateIso);
      const isValidCurrent = current && (state.speed === 'express' ? current.expressAvailable : current.availableForService);
      if (!isValidCurrent) {
        const pick = dates.find((d) => (state.speed === 'express' ? d.expressAvailable : d.availableForService)) || dates[dates.length - 1];
        if (pick) state.selectedDateIso = pick.iso;
      }
      const chosen = dates.find((d) => d.iso === state.selectedDateIso);
      const band = state.postcodeInfo ? state.postcodeInfo.band : 'B1';
      const clk = getClockStatus(band);
      if (chosen && chosen.isToday && clk.morningExpiredToday) {
        state.selectedWindow = 'pm';
      }
    }
  }

  function getReturnSummary() {
    if (isFaceIdRepair()) {
      return {
        label: 'Quote & return: 5 to 7 working days (Apple Face ID module)',
        dateText: 'Thu 5 Dec',
        iso: '2026-12-05',
        propKey: 'Return by'
      };
    }
    if (state.service === 'mailin') {
      if (state.route === 'diagnostic') {
        return {
          label: 'Diagnostic quote by: Tue 1 Dec (within 1 working day of arrival)',
          dateText: 'Tue 1 Dec',
          iso: '2026-12-01',
          propKey: 'Quote by'
        };
      }
      if (state.speed === 'express') {
        return {
          label: 'Back with you by: Wed 2 Dec (Express bench reserved in transit)',
          dateText: 'Wed 2 Dec',
          iso: '2026-12-02',
          propKey: 'Return by'
        };
      }
      return {
        label: 'Back with you by: Thu 3 Dec (2 working days on the bench)',
        dateText: 'Thu 3 Dec',
        iso: '2026-12-03',
        propKey: 'Return by'
      };
    }

    const d = WORKING_DATES.find((x) => x.iso === state.selectedDateIso) || WORKING_DATES[0];
    if (state.route === 'diagnostic') {
      return {
        label: 'Diagnostic quote by: ' + d.expReturn + ' (1 working day on bench)',
        dateText: d.expReturn,
        iso: d.expReturnIso,
        propKey: 'Quote by'
      };
    }
    if (state.speed === 'express') {
      return {
        label: 'Back with you by: ' + d.expReturn + ' (Express bench reserved on arrival)',
        dateText: d.expReturn,
        iso: d.expReturnIso,
        propKey: 'Return by'
      };
    }
    return {
      label: 'Back with you by: ' + d.stdReturn + ' (2 working days on the bench)',
      dateText: d.stdReturn,
      iso: d.stdReturnIso,
      propKey: 'Return by'
    };
  }

  function getRepairDisplayName() {
    const skuLabels = {
      screen: 'Genuine Apple Screen Repair',
      'screen-glass': 'Front Glass Repair',
      dustgate: 'Dustgate Display Flex Repair',
      flexgate: 'Flexgate Backlight Flex Repair',
      battery: 'Battery Replacement',
      'charging-port': 'Charging Port Repair',
      keyboard: 'Keyboard Replacement',
      trackpad: 'Trackpad Replacement',
      'touch-bar': 'Touch Bar Replacement',
      'rear-glass': 'Rear Glass Repair',
      'rear-camera': 'Rear Camera Replacement',
      'front-camera': 'Front Camera / Face ID Repair',
      crown: 'Digital Crown Repair',
      diagnostic: state.fault === 'recovery' ? 'Board-Level Data Recovery Diagnostic' : (state.fault === 'liquid' ? 'Liquid Damage Diagnostic' : 'No Power Diagnostic')
    };
    return skuLabels[state.resolvedSku] || 'Repair Quote';
  }

  function step2IsReady() {
    if (!state.fault) return false;
    if (state.route === 'dismiss') return false;
    if (state.fault === 'liquid') {
      if (!state.liquidUsable || !state.liquidAck || !state.dataAnswer || !state.appleBeen) return false;
      if (state.appleBeen === 'Yes' && !state.appleVerdict) return false;
      return true;
    }
    if (state.fault === 'nopower') {
      if (!state.dataAnswer || !state.appleBeen) return false;
      if (state.appleBeen === 'Yes' && !state.appleVerdict) return false;
      return true;
    }
    if (state.fault === 'recovery') {
      if (state.device === 'iphone' && state.iphoneRecoveryPath === 'passcode') return false;
      if (!state.recWhat || !state.recState || !state.recTried || !state.recPassword) return false;
      if (state.recTried !== 'No, nobody has opened it' && !state.recTriedSaid) return false;
      return true;
    }
    if (state.fault === 'screen' || state.fault === 'power' || state.fault === 'rear-glass' || state.fault === 'camera') {
      return Boolean(state.subOption);
    }
    return true;
  }

  function validateStep3(showAllErrors) {
    const errors = {};
    if (state.name.trim().length < 2) errors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) errors.email = 'Please enter a valid email address.';
    const digits = state.phone.replace(/\D/g, '');
    if (digits.length < 10) errors.phone = 'Please enter a valid UK phone number.';
    const parsed = parseFullPostcode(state.postcode);
    if (!parsed) {
      errors.postcode = 'Enter your full postcode, for example W1W 8JQ.';
    }
    state.postcodeInfo = parsed;
    if (showAllErrors) state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  /* =========================================================================
     DOM References
     ========================================================================= */
  const els = {
    stage: document.getElementById('wizardStage'),
    chips: document.getElementById('wizChips'),
    backBtn: document.getElementById('wizBackBtn'),
    cta: document.getElementById('wizPrimaryCta'),
    footMeta: document.getElementById('wizFootMeta'),
    collectionNotice: document.getElementById('qwCollectionNotice'),
    collectionNoticeText: document.getElementById('qwCollectionNoticeText'),
    mBackBtn: document.getElementById('mBackBtn'),
    mStepLabel: document.getElementById('mStepLabel'),
    mTestBtn: document.getElementById('mTestBtn'),
    mTestSheet: document.getElementById('mTestSheet'),
    closeMTestSheet: document.getElementById('closeMTestSheet'),
    doneMTestSheet: document.getElementById('doneMTestSheet'),
    pvExpressFull: document.getElementById('pvExpressFull'),
    mExpressFull: document.getElementById('mExpressFull'),
    mCookieSim: document.getElementById('mCookieSim'),
    simCookieBanner: document.getElementById('simCookieBanner'),
    simCookieAccept: document.getElementById('simCookieAccept'),
    simCookieDecline: document.getElementById('simCookieDecline'),
    reviewsOverlay: document.getElementById('reviewsOverlay'),
    openReviewsDesktopBtn: document.getElementById('openReviewsDesktopBtn'),
    closeReviewsOverlay: document.getElementById('closeReviewsOverlay'),
    trustindexSlot: document.getElementById('trustindexSlot'),
    checkoutOverlay: document.getElementById('checkoutOverlay'),
    checkoutOverlayBody: document.getElementById('checkoutOverlayBody'),
    closeCheckoutOverlay: document.getElementById('closeCheckoutOverlay')
  };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* =========================================================================
     Render Orchestrator
     ========================================================================= */
  function render() {
    if (state.step === 4) ensureValidStep4Defaults();
    renderHeaderAndProgress();
    renderFooter();

    if (state.step === 1) els.stage.innerHTML = renderStep1();
    else if (state.step === 2) els.stage.innerHTML = renderStep2();
    else if (state.step === 3) els.stage.innerHTML = renderStep3();
    else els.stage.innerHTML = renderStep4();

    els.stage.scrollTop = 0;
    syncTestControlHighlights();
  }

  function renderHeaderAndProgress() {
    const stepNames = {
      1: 'Device & model',
      2: 'Fault',
      3: 'Your details',
      4: 'Fixed price'
    };

    document.querySelectorAll('.wiz-step').forEach((btn) => {
      const s = Number(btn.dataset.step);
      btn.classList.toggle('is-active', s === state.step);
      btn.classList.toggle('is-done', s < state.step);
      btn.disabled = s > state.maxStep;
      btn.setAttribute('aria-selected', s === state.step ? 'true' : 'false');
    });

    document.querySelectorAll('.m-seg').forEach((seg) => {
      const s = Number(seg.dataset.seg);
      seg.classList.toggle('is-done', s < state.step);
      seg.classList.toggle('is-active', s === state.step);
    });

    if (els.mStepLabel) {
      els.mStepLabel.textContent = 'Step ' + state.step + ' of 4 · ' + stepNames[state.step];
    }
    if (els.mBackBtn) {
      els.mBackBtn.disabled = state.step === 1;
    }
    if (els.backBtn) {
      els.backBtn.hidden = state.step === 1;
    }

    const model = getModel();
    const chipParts = [];
    if (model) chipParts.push('<span class="wiz-ctx-chip">' + esc(model.name) + '</span>');
    if (state.fault && state.step >= 2) {
      chipParts.push('<span class="wiz-ctx-chip">' + esc(getRepairDisplayName()) + '</span>');
    }
    if (state.postcodeInfo && state.step >= 3) {
      chipParts.push('<span class="wiz-ctx-chip">' + esc(state.postcodeInfo.formatted) + ' (' + esc(state.postcodeInfo.band) + ')</span>');
    }
    if (chipParts.length === 1 && state.step === 1) {
      chipParts.push('<span class="wiz-ctx-chip wiz-ctx-chip--muted">Select a model to continue</span>');
    }
    els.chips.innerHTML = chipParts.join('');
  }

  function renderFooter() {
    const showCourierNotice = state.step === 4 && state.service === 'courier' && state.postcodeInfo;
    if (showCourierNotice) {
      els.collectionNotice.hidden = false;
      els.collectionNoticeText.innerHTML = '<strong>Collecting from ' + esc(state.postcodeInfo.formatted) + '.</strong> Please use this address as your shipping address at checkout.';
    } else {
      els.collectionNotice.hidden = true;
    }

    if (state.step === 1) {
      els.cta.textContent = 'Continue to fault';
      els.cta.disabled = !state.modelId;
      els.footMeta.innerHTML = '<span class="wiz-foot-note">Upfront fixed pricing · 2-year warranty</span>';
    } else if (state.step === 2) {
      els.cta.textContent = 'Continue to your details';
      els.cta.disabled = !step2IsReady();
      els.footMeta.innerHTML = isTriageFault(state.fault)
        ? '<span class="wiz-foot-note">Diagnostic fee deducted if you proceed</span>'
        : '<span class="wiz-foot-note">Straight repairs skip extra questionnaires</span>';
    } else if (state.step === 3) {
      els.cta.textContent = 'See my fixed price';
      els.cta.disabled = false;
      els.footMeta.innerHTML = '<span class="wiz-foot-note">No spam · Used for quote &amp; collection</span>';
    } else {
      const total = getTotalPrice();
      els.cta.textContent = 'Continue to checkout · £' + total;
      els.cta.disabled = false;
      els.footMeta.innerHTML = '<button type="button" class="wiz-foot-link" data-action="open-reviews">4.8 from 750+ Google reviews</button><span class="wiz-foot-note">Mon to Thu 9am to 6pm</span>';
    }
  }

  /* =========================================================================
     Step 1: Device & Model + Working MacBook A-Number / iPhone Visual Finder
     ========================================================================= */
  function getDeviceIconSvg(id) {
    if (id === 'macbook') return '<svg class="device-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M1.5 19h21" stroke-linecap="round"/></svg>';
    if (id === 'iphone') return '<svg class="device-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 5.5h4" stroke-linecap="round"/></svg>';
    if (id === 'ipad') return '<svg class="device-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2.5" width="16" height="19" rx="2"/><circle cx="12" cy="18.5" r="0.8" fill="currentColor"/></svg>';
    return '<svg class="device-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="5" width="10" height="14" rx="3"/><path d="M9.5 2.5h5M9.5 21.5h5" stroke-linecap="round"/></svg>';
  }

  function renderModelFinder() {
    if (!state.finderOpen) return '';
    if (state.device === 'macbook') {
      const q = state.finderQuery.trim().toUpperCase();
      const matches = MODELS.macbook.filter((m) => !q || m.code.includes(q) || m.name.toUpperCase().includes(q));
      return `
        <div class="finder-drawer">
          <div class="finder-head">
            <div>
              <span class="ic-label">MacBook A-number lookup</span>
              <h3 class="finder-title">Flip your MacBook over and read the 4-digit "A" code near the hinge</h3>
            </div>
            <button type="button" class="inline-link-btn" data-action="toggle-finder">Close</button>
          </div>
          <div class="finder-row">
            <input type="text" class="ic-input" id="finderInput" placeholder="e.g. A2918, A3113, A2159, A1706" value="${esc(state.finderQuery)}" aria-label="MacBook A-number">
          </div>
          <div class="finder-results">
            ${matches.map((m) => `<button type="button" class="finder-match-btn" data-select-model="${esc(m.id)}"><strong>${esc(m.code)}</strong> · ${esc(m.name)}</button>`).join('')}
          </div>
        </div>
      `;
    }
    if (state.device === 'iphone') {
      const cam = state.vgAnswers.cameras || '';
      const notch = state.vgAnswers.top || '';
      let suggested = MODELS.iphone[0];
      if (cam === '2') suggested = MODELS.iphone[3];
      else if (notch === 'island') suggested = MODELS.iphone[0];
      else if (notch === 'notch') suggested = MODELS.iphone[3];
      return `
        <div class="finder-drawer">
          <div class="finder-head">
            <div>
              <span class="ic-label">iPhone visual guide</span>
              <h3 class="finder-title">Answer two quick visual checks to match your iPhone</h3>
            </div>
            <button type="button" class="inline-link-btn" data-action="toggle-finder">Close</button>
          </div>
          <div class="vg-step">
            <span class="ic-label">1. Rear cameras</span>
            <div class="vg-opts">
              <button type="button" class="chip-btn" data-vg="cameras" data-val="3" aria-pressed="${cam === '3'}">3 rear lenses (Pro)</button>
              <button type="button" class="chip-btn" data-vg="cameras" data-val="2" aria-pressed="${cam === '2'}">2 rear lenses</button>
            </div>
          </div>
          <div class="vg-step">
            <span class="ic-label">2. Top of screen</span>
            <div class="vg-opts">
              <button type="button" class="chip-btn" data-vg="top" data-val="island" aria-pressed="${notch === 'island'}">Dynamic Island pill</button>
              <button type="button" class="chip-btn" data-vg="top" data-val="notch" aria-pressed="${notch === 'notch'}">Classic top notch</button>
            </div>
          </div>
          <div class="finder-results">
            <button type="button" class="finder-match-btn" data-select-model="${esc(suggested.id)}">Match: <strong>${esc(suggested.name)}</strong> (${esc(suggested.code)}) &rarr;</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="finder-drawer">
        <div class="finder-head">
          <div>
            <span class="ic-label">Model lookup</span>
            <h3 class="finder-title">Open Settings &gt; General &gt; About to read your Model Name</h3>
          </div>
          <button type="button" class="inline-link-btn" data-action="toggle-finder">Close</button>
        </div>
        <p class="step-sub">Tap the Model Number once in Settings to reveal the "A" code, or select your model below.</p>
      </div>
    `;
  }

  function renderStep1() {
    const models = MODELS[state.device] || [];
    const seriesList = ['All', ...Array.from(new Set(models.map((m) => m.series)))];
    const filtered = state.series === 'All' ? models : models.filter((m) => m.series === state.series);

    return `
      <div class="step-head">
        <div>
          <span class="ic-label">Step 1 of 4</span>
          <h2 class="step-title">Which Apple device needs repair?</h2>
          <p class="step-sub">Pick your device and exact model to match genuine parts and fixed pricing.</p>
        </div>
        <button type="button" class="inline-link-btn" data-action="toggle-finder">Not sure which model?</button>
      </div>

      <div class="device-grid" role="group" aria-label="Device category">
        ${DEVICES.map((d) => `
          <button type="button" class="device-card" data-select-device="${esc(d.id)}" aria-pressed="${state.device === d.id}">
            ${getDeviceIconSvg(d.id)}
            <span class="device-card-name">${esc(d.name)}</span>
            <span class="device-card-sub">${esc(d.sub)}</span>
          </button>
        `).join('')}
      </div>

      ${renderModelFinder()}

      <div class="series-bar">
        <span class="ic-label">Select your ${esc(DEVICES.find((d) => d.id === state.device).name)} model</span>
        ${seriesList.length > 2 ? `
          <div class="series-pills" role="group" aria-label="Model series filter">
            ${seriesList.map((s) => `<button type="button" class="chip-btn" data-select-series="${esc(s)}" aria-pressed="${state.series === s}">${esc(s)}</button>`).join('')}
          </div>
        ` : ''}
      </div>

      <div class="model-grid">
        ${filtered.map((m) => `
          <button type="button" class="model-card" data-select-model="${esc(m.id)}" aria-pressed="${state.modelId === m.id}">
            <div>
              <div class="model-card-name">${esc(m.name)}</div>
              <div class="model-card-meta">${esc(m.code)}${m.intelDustFlex ? ' · Dustgate / Flexgate eligible' : ''}</div>
            </div>
            <span class="model-card-tag">Select &rarr;</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  /* =========================================================================
     Step 2: Fault Selection + Straight Check + Conditional Inline Triage
     ========================================================================= */
  function renderStep2SubPanel() {
    if (!state.fault) return '';
    const model = getModel();

    if (state.fault === 'screen') {
      if (state.device === 'macbook') {
        const opts = [
          { id: 'cracked', title: 'Cracked, lines, dead pixels, or backlight still on', sub: 'Straight to fixed screen price (genuine Apple display panel only)' },
          { id: 'black', title: 'Completely black (no backlight or external image)', sub: 'Routes to No Power board-level diagnostic' }
        ];
        if (model.intelDustFlex) {
          opts.push({ id: 'dustflex', title: 'Thick bands, distortion, or dim at an angle (2016 to 2020 Intel)', sub: 'Check Dustgate / Flexgate flex cable repair (saves vs full panel)' });
        }
        return `
          <div class="inline-panel">
            <div class="inline-q">
              <h3 class="inline-q-title">Quick display check</h3>
              <p class="inline-q-help">One concise check so we match the exact repair SKU.</p>
              <div class="opt-stack">
                ${opts.map((o) => `
                  <button type="button" class="opt-card" data-sub-opt="${esc(o.id)}" aria-pressed="${state.subOption === o.id}">
                    <span class="opt-radio" aria-hidden="true"></span>
                    <div>
                      <div class="opt-card-title">${esc(o.title)}</div>
                      <div class="opt-card-sub">${esc(o.sub)}</div>
                    </div>
                  </button>
                `).join('')}
              </div>
              ${state.subOption === 'dustflex' ? `
                <div class="liquid-ack-box">
                  <span class="ic-label">Dustgate / Flexgate visual check (${esc(model.code)})</span>
                  <div class="photo-check-grid">
                    <div class="photo-ref-card">
                      <svg class="photo-ref-svg" viewBox="0 0 220 76" aria-hidden="true">
                        <rect width="220" height="76" fill="#171717"/>
                        <rect x="0" y="26" width="220" height="8" fill="#525252"/>
                        <rect x="0" y="38" width="220" height="4" fill="#A3A3A3"/>
                        <rect x="0" y="45" width="220" height="12" fill="#404040"/>
                      </svg>
                      <div class="photo-ref-cap"><strong>Dustgate:</strong> horizontal purple/pink bands or distortion across the panel.</div>
                    </div>
                    <div class="photo-ref-card">
                      <svg class="photo-ref-svg" viewBox="0 0 220 76" aria-hidden="true">
                        <rect width="220" height="76" fill="#171717"/>
                        <rect x="20" y="54" width="24" height="22" fill="#525252"/>
                        <rect x="64" y="54" width="24" height="22" fill="#525252"/>
                        <rect x="108" y="54" width="24" height="22" fill="#525252"/>
                        <rect x="152" y="54" width="24" height="22" fill="#525252"/>
                      </svg>
                      <div class="photo-ref-cap"><strong>Flexgate:</strong> stage-light glow at bottom edge or backlight drops past 45 degrees.</div>
                    </div>
                  </div>
                  <div class="opt-row-2">
                    <button type="button" class="opt-card" data-dustflex="yes" aria-pressed="${state.dustFlexConfirmed}">
                      <span class="opt-radio" aria-hidden="true"></span>
                      <div class="opt-card-title">Yes, that is what I see (£${model.prices.dustgate || model.prices.flexgate})</div>
                    </button>
                    <button type="button" class="opt-card" data-dustflex="no" aria-pressed="${!state.dustFlexConfirmed}">
                      <span class="opt-radio" aria-hidden="true"></span>
                      <div class="opt-card-title">No, standard screen replacement (£${model.prices.screen})</div>
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }
      if (state.device === 'iphone') {
        return `
          <div class="inline-panel">
            <div class="inline-q">
              <h3 class="inline-q-title">Does the iPhone still ring, vibrate, or show any image?</h3>
              <div class="opt-row-2">
                <button type="button" class="opt-card" data-sub-opt="cracked" aria-pressed="${state.subOption === 'cracked'}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div><div class="opt-card-title">Yes, display damaged</div><div class="opt-card-sub">Fixed screen replacement</div></div>
                </button>
                <button type="button" class="opt-card" data-sub-opt="black" aria-pressed="${state.subOption === 'black'}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div><div class="opt-card-title">Completely dead</div><div class="opt-card-sub">Board-level diagnostic</div></div>
                </button>
              </div>
            </div>
          </div>
        `;
      }
      return `
        <div class="inline-panel">
          <div class="inline-q">
            <h3 class="inline-q-title">Is the display image still clear behind the cracked glass?</h3>
            <div class="opt-row-2">
              <button type="button" class="opt-card" data-sub-opt="cracked" aria-pressed="${state.subOption === 'cracked'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Display damaged or lines</div><div class="opt-card-sub">Full display assembly</div></div>
              </button>
              <button type="button" class="opt-card" data-sub-opt="glass" aria-pressed="${state.subOption === 'glass'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Image clear, glass only</div><div class="opt-card-sub">Front glass replacement</div></div>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (state.fault === 'power') {
      return `
        <div class="inline-panel">
          <div class="inline-q">
            <h3 class="inline-q-title">What best describes the power issue?</h3>
            <div class="opt-stack">
              <button type="button" class="opt-card" data-sub-opt="battery" aria-pressed="${state.subOption === 'battery'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Battery draining fast, Service Recommended, or swollen</div><div class="opt-card-sub">Fixed battery replacement</div></div>
              </button>
              <button type="button" class="opt-card" data-sub-opt="charging-port" aria-pressed="${state.subOption === 'charging-port'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Powers on, but will not charge</div><div class="opt-card-sub">Charging port replacement</div></div>
              </button>
              <button type="button" class="opt-card" data-sub-opt="nopower" aria-pressed="${state.subOption === 'nopower'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Will not turn on or random shutdowns</div><div class="opt-card-sub">Opens board-level No Power triage</div></div>
              </button>
            </div>
            ${state.subOption === 'battery' ? `
              <div class="ic-notice ic-notice--danger" role="alert" style="margin-top:10px;margin-bottom:0;">
                <span class="ic-notice-dot" aria-hidden="true"></span>
                <span>If the battery is swollen or lifting the casing: <strong>Safety concern: stop using the device and don't charge it.</strong></span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    if (state.fault === 'camera') {
      return `
        <div class="inline-panel">
          <div class="inline-q">
            <h3 class="inline-q-title">Which camera needs attention?</h3>
            <div class="opt-row-2">
              <button type="button" class="opt-card" data-sub-opt="rear-camera" aria-pressed="${state.subOption === 'rear-camera'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Rear camera module</div><div class="opt-card-sub">2 working days</div></div>
              </button>
              <button type="button" class="opt-card" data-sub-opt="front-camera" aria-pressed="${state.subOption === 'front-camera'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Front camera / Face ID</div><div class="opt-card-sub">5 to 7 working days (ordered from Apple)</div></div>
              </button>
            </div>
            ${state.subOption === 'front-camera' ? `
              <div class="ic-notice ic-notice--action" style="margin-top:10px;margin-bottom:0;">
                <span class="ic-notice-dot" aria-hidden="true"></span>
                <span>The Face ID module needs to be ordered directly from Apple. Standard turnaround is 5 to 7 working days.</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    if (state.fault === 'rear-glass') {
      return `
        <div class="inline-panel">
          <div class="inline-q">
            <h3 class="inline-q-title">Which part of the back is cracked?</h3>
            <div class="opt-row-2">
              <button type="button" class="opt-card" data-sub-opt="rear-glass" aria-pressed="${state.subOption === 'rear-glass'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Main rear glass back</div><div class="opt-card-sub">Full rear glass replacement</div></div>
              </button>
              <button type="button" class="opt-card" data-sub-opt="rear-camera" aria-pressed="${state.subOption === 'rear-camera'}">
                <span class="opt-radio" aria-hidden="true"></span>
                <div><div class="opt-card-title">Camera lens cover only</div><div class="opt-card-sub">Camera lens replacement</div></div>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    /* Section 3.2: Liquid Damage & No Power Inline Triage */
    if (state.fault === 'liquid' || state.fault === 'nopower') {
      const isLiquid = state.fault === 'liquid';
      const safetyCopy = isLiquid
        ? 'Stop using it and do not charge it. Power through a wet board is what turns a repairable job into a replacement. Leave it off until it reaches us.'
        : 'Do not keep trying to charge it. If a power line is shorted, repeated charging can take more of the board with it. Leave it off until we have it.';

      const appleVerdicts = [
        'They quoted a logic board or a whole replacement',
        'They said it cannot be repaired',
        'They told me to buy a new one',
        'They would not look at it',
        'They diagnosed it and I have not decided'
      ];

      return `
        <div class="inline-panel">
          <div class="ic-notice ic-notice--attention" role="alert">
            <span class="ic-notice-dot" aria-hidden="true"></span>
            <span>${esc(safetyCopy)}</span>
          </div>

          ${isLiquid ? `
            <div class="inline-q">
              <span class="ic-label">Triage 1 of 3</span>
              <h3 class="inline-q-title">Is the device turning on and usable right now?</h3>
              <div class="opt-row-2">
                <button type="button" class="opt-card" data-liquid-usable="yes" aria-pressed="${state.liquidUsable === 'yes'}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">Yes, usable</div>
                </button>
                <button type="button" class="opt-card" data-liquid-usable="no" aria-pressed="${state.liquidUsable === 'no'}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">No, won't turn on or isn't usable</div>
                </button>
              </div>
              ${state.liquidUsable ? `
                <div class="liquid-ack-box">
                  <p class="liquid-ack-copy">${esc(state.liquidUsable === 'yes' ? LOCKED_LIQUID_COPY.usable : LOCKED_LIQUID_COPY.notUsable)}</p>
                  <label class="ack-check ${state.liquidAck ? 'is-checked' : ''}">
                    <input type="checkbox" id="liquidAckCheck" ${state.liquidAck ? 'checked' : ''}>
                    <span>I understand</span>
                  </label>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="inline-q">
            <span class="ic-label">${isLiquid ? 'Triage 2 of 3' : 'Triage 1 of 2'}</span>
            <h3 class="inline-q-title">Is the data on this device important to you?</h3>
            <p class="inline-q-help">It changes the order we work in. Data recovery comes before anything irreversible.</p>
            <div class="opt-stack">
              ${[
                'Yes, repair it to keep the data if you can',
                'No, I have a backup',
                'Not sure'
              ].map((opt) => `
                <button type="button" class="opt-card" data-data-answer="${esc(opt)}" aria-pressed="${state.dataAnswer === opt}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">${esc(opt)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="inline-q">
            <span class="ic-label">${isLiquid ? 'Triage 3 of 3' : 'Triage 2 of 2'}</span>
            <h3 class="inline-q-title">Have you already taken it to Apple or another repair shop?</h3>
            <div class="opt-row-3">
              ${['Yes', 'No', 'Not sure'].map((opt) => `
                <button type="button" class="opt-card" data-apple-been="${esc(opt)}" aria-pressed="${state.appleBeen === opt}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">${esc(opt)}</div>
                </button>
              `).join('')}
            </div>

            ${state.appleBeen === 'Yes' ? `
              <div class="liquid-ack-box">
                <span class="ic-label">What did they say?</span>
                <div class="opt-stack" style="margin-top:8px;">
                  ${appleVerdicts.map((v) => `
                    <button type="button" class="opt-card" data-apple-verdict="${esc(v)}" aria-pressed="${state.appleVerdict === v}">
                      <span class="opt-radio" aria-hidden="true"></span>
                      <div class="opt-card-title">${esc(v)}</div>
                    </button>
                  `).join('')}
                </div>
                <div class="ic-field" style="margin-top:10px;">
                  <label class="ic-label" for="appleQuoteInput">Optional: What price did they quote you (£)?</label>
                  <input type="text" inputmode="numeric" class="ic-input" id="appleQuoteInput" placeholder="e.g. 1049" value="${esc(state.appleQuote)}">
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    /* Section 3.3: Data Recovery Inline Triage */
    if (state.fault === 'recovery') {
      if (state.device === 'iphone' && state.iphoneRecoveryPath === 'passcode') {
        return `
          <div class="inline-panel">
            <div class="ic-notice ic-notice--danger">
              <span class="ic-notice-dot" aria-hidden="true"></span>
              <div>
                <strong>We cannot bypass an Apple passcode or iCloud lock.</strong><br>
                If you have forgotten your passcode, Apple Support is the only route to reset the device: <a href="https://support.apple.com" target="_blank" rel="noopener">Contact Apple Support</a>.
              </div>
            </div>
            <button type="button" class="ic-btn--secondary" data-iphone-rec="dead">My iPhone is dead, not passcode-locked</button>
          </div>
        `;
      }

      const whatOpts = [
        'Liquid got on it',
        'It was dropped or knocked',
        'It stopped working on its own',
        'It failed during or after an update',
        'Something else'
      ];
      const stateOpts = [
        'Nothing at all: no lights, no sound, no fan',
        'Some sign of life, but no picture',
        'It turns on, but gets stuck on the logo or a folder with a question mark',
        'It starts up, but the files or the drive are missing'
      ];
      const triedOpts = [
        'No, nobody has opened it',
        'Yes, Apple',
        'Yes, another repair shop',
        'Yes, I tried myself'
      ];
      const triedSaidOpts = [
        'The data cannot be recovered',
        'They replaced the logic board or parts',
        'They opened it and gave up',
        'They quoted, and I did not go ahead'
      ];
      const pwOpts = [
        'Yes',
        'No',
        'It is not my Mac, but the owner knows it'
      ];

      // Live Dynamic Assessment Callout (Audit Section 3.3 #7)
      let assessmentHtml = '';
      if (state.recTriedSaid === 'They replaced the logic board or parts') {
        assessmentHtml = `<div class="ic-notice ic-notice--attention"><span class="ic-notice-dot" aria-hidden="true"></span><span>Do you still have the original logic board? The data lives on the board it was written to. If you still have it, send it with the Mac and we work on that.</span></div>`;
      } else if (state.recPassword === 'No') {
        assessmentHtml = `<div class="ic-notice ic-notice--attention"><span class="ic-notice-dot" aria-hidden="true"></span><span>We will need that password. Getting the board running is only half of it; the files stay locked without the login. Check a password manager or iCloud Keychain before you book.</span></div>`;
      } else if (state.recTriedSaid === 'The data cannot be recovered' || state.recTriedSaid === 'They opened it and gave up') {
        assessmentHtml = `<div class="ic-notice ic-notice--ok"><span class="ic-notice-dot" aria-hidden="true"></span><span>This is the job we are set up for. Most Macs written off for data have a board fault, not a dead drive.</span></div>`;
      } else if (state.recWhat && state.recState) {
        assessmentHtml = `<div class="ic-notice ic-notice--action"><span class="ic-notice-dot" aria-hidden="true"></span><span>Completely dead is often still recoverable. This sounds recoverable: nothing you have told us rules it out.</span></div>`;
      }

      return `
        <div class="inline-panel">
          <div class="ic-notice ic-notice--attention" role="alert">
            <span class="ic-notice-dot" aria-hidden="true"></span>
            <span>Leave it switched off. Every attempt to power a failing board risks the data on it. Do not keep trying to start it, and do not let anyone else open it before we see it.</span>
          </div>

          ${state.device === 'iphone' ? `
            <div class="inline-q">
              <h3 class="inline-q-title">Why can you not access the iPhone?</h3>
              <div class="opt-row-2">
                <button type="button" class="opt-card" data-iphone-rec="dead" aria-pressed="${state.iphoneRecoveryPath !== 'passcode'}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">Dead or will not turn on</div>
                </button>
                <button type="button" class="opt-card" data-iphone-rec="passcode" aria-pressed="${state.iphoneRecoveryPath === 'passcode'}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">Forgotten passcode</div>
                </button>
              </div>
            </div>
          ` : ''}

          <div class="inline-q">
            <span class="ic-label">Question 1 of 4</span>
            <h3 class="inline-q-title">What happened to it?</h3>
            <div class="opt-stack">
              ${whatOpts.map((opt) => `
                <button type="button" class="opt-card" data-rec-what="${esc(opt)}" aria-pressed="${state.recWhat === opt}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">${esc(opt)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="inline-q">
            <span class="ic-label">Question 2 of 4</span>
            <h3 class="inline-q-title">How dead is it right now?</h3>
            <p class="inline-q-help">Tell us what it does when you press the power button. This is the question that tells us most.</p>
            <div class="opt-stack">
              ${stateOpts.map((opt) => `
                <button type="button" class="opt-card" data-rec-state="${esc(opt)}" aria-pressed="${state.recState === opt}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">${esc(opt)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="inline-q">
            <span class="ic-label">Question 3 of 4</span>
            <h3 class="inline-q-title">Has anyone tried to repair it or recover the data?</h3>
            <p class="inline-q-help">Including you. Previous work changes what we look for when we open it.</p>
            <div class="opt-row-2">
              ${triedOpts.map((opt) => `
                <button type="button" class="opt-card" data-rec-tried="${esc(opt)}" aria-pressed="${state.recTried === opt}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">${esc(opt)}</div>
                </button>
              `).join('')}
            </div>
            ${state.recTried && state.recTried !== 'No, nobody has opened it' ? `
              <div class="liquid-ack-box">
                <span class="ic-label">What did they tell you?</span>
                <div class="opt-stack" style="margin-top:8px;">
                  ${triedSaidOpts.map((opt) => `
                    <button type="button" class="opt-card" data-rec-tried-said="${esc(opt)}" aria-pressed="${state.recTriedSaid === opt}">
                      <span class="opt-radio" aria-hidden="true"></span>
                      <div class="opt-card-title">${esc(opt)}</div>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="inline-q">
            <span class="ic-label">Question 4 of 4</span>
            <h3 class="inline-q-title">Do you know the login password for this Mac?</h3>
            <p class="inline-q-help">The data is locked to it. Even once the board runs again, we can only read your files with the password.</p>
            <div class="opt-stack">
              ${pwOpts.map((opt) => `
                <button type="button" class="opt-card" data-rec-password="${esc(opt)}" aria-pressed="${state.recPassword === opt}">
                  <span class="opt-radio" aria-hidden="true"></span>
                  <div class="opt-card-title">${esc(opt)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          ${assessmentHtml}

          <div class="inline-q">
            <div class="ic-field">
              <label class="ic-label" for="recPriorityInput">Optional: Which files or folders matter most?</label>
              <input type="text" class="ic-input" id="recPriorityInput" placeholder="e.g. 2019 onwards, the Clients folder on the desktop" value="${esc(state.recPriority)}">
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  function renderStep2() {
    const model = getModel();
    const faults = getFaultDefinitions(model);
    return `
      <div class="step-head">
        <div>
          <span class="ic-label">Step 2 of 4 · ${esc(model.name)}</span>
          <h2 class="step-title">What needs fixing?</h2>
          <p class="step-sub">Straight repairs skip unnecessary questionnaires. Only complex diagnostics expand inline triage.</p>
        </div>
      </div>

      <div class="fault-grid">
        ${faults.map((f) => `
          <button type="button" class="fault-card" data-select-fault="${esc(f.id)}" aria-pressed="${state.fault === f.id}">
            <div>
              <div class="fault-card-title">${esc(f.title)}</div>
              <div class="fault-card-sub">${esc(f.sub)}</div>
            </div>
            <span class="fault-card-badge">${esc(f.badge)}</span>
          </button>
        `).join('')}
      </div>

      ${renderStep2SubPanel()}
    `;
  }

  /* =========================================================================
     Step 3: Your Details (Name, Email, Phone, Full UK Postcode)
     ========================================================================= */
  function renderPostcodeLiveBanner() {
    if (!state.postcodeInfo) {
      return `
        <div class="postcode-live">
          <div>
            <div class="postcode-live-copy">Enter your full UK postcode to check London courier zones</div>
            <div class="postcode-live-sub">Partial codes such as W1W 8J do not resolve. Example: W1W 8JQ or M1 4BT.</div>
          </div>
          <span class="ic-chip ic-chip--action"><span class="ic-chip-dot"></span>Live zone check</span>
        </div>
      `;
    }
    const band = state.postcodeInfo.band;
    const isLondon = band === 'B1' || band === 'B2' || band === 'B3' || band === 'B4';
    const clk = getClockStatus(band);
    if (isLondon) {
      const sameDayNote = (band === 'B1' || band === 'B2') && clk.todayAllowedCourier
        ? 'Same-day courier collection available today (' + clk.clockText + ').'
        : 'London courier collection & booked Fitzrovia drop-off available.';
      return `
        <div class="postcode-live">
          <div>
            <div class="postcode-live-copy"><strong>${esc(state.postcodeInfo.formatted)}</strong> · London Band ${esc(band)}</div>
            <div class="postcode-live-sub">${esc(sameDayNote)}</div>
          </div>
          <span class="ic-chip ic-chip--ok"><span class="ic-chip-dot"></span>London ${esc(band)}</span>
        </div>
      `;
    }
    return `
      <div class="postcode-live">
        <div>
          <div class="postcode-live-copy"><strong>${esc(state.postcodeInfo.formatted)}</strong> · Nationwide UK Mail-in</div>
          <div class="postcode-live-sub">Free tracked &amp; insured Royal Mail pack sent to your door, with Express bench available.</div>
        </div>
        <span class="ic-chip ic-chip--ok"><span class="ic-chip-dot"></span>Free UK mail-in</span>
      </div>
    `;
  }

  function renderStep3() {
    const e = state.errors || {};
    return `
      <div class="step-head">
        <div>
          <span class="ic-label">Step 3 of 4</span>
          <h2 class="step-title">Your details &amp; postcode</h2>
          <p class="step-sub">Enter your postcode to see your fixed price and London collection options.</p>
        </div>
      </div>

      <form id="detailsForm" novalidate>
        <div class="form-grid">
          <div class="ic-field">
            <label class="ic-label" for="qwName">Full name</label>
            <input class="ic-input" id="qwName" name="name" type="text" autocomplete="name" placeholder="Alex Taylor" value="${esc(state.name)}" aria-invalid="${e.name ? 'true' : 'false'}">
            <span class="field-error" id="errName">${esc(e.name || '')}</span>
          </div>

          <div class="ic-field">
            <label class="ic-label" for="qwEmail">Email address</label>
            <input class="ic-input" id="qwEmail" name="email" type="email" autocomplete="email" placeholder="alex@example.co.uk" value="${esc(state.email)}" aria-invalid="${e.email ? 'true' : 'false'}">
            <span class="field-error" id="errEmail">${esc(e.email || '')}</span>
          </div>

          <div class="ic-field">
            <label class="ic-label" for="qwPhone">UK phone number</label>
            <input class="ic-input" id="qwPhone" name="phone" type="tel" autocomplete="tel" placeholder="07700 900123" value="${esc(state.phone)}" aria-invalid="${e.phone ? 'true' : 'false'}">
            <span class="field-error" id="errPhone">${esc(e.phone || '')}</span>
          </div>

          <div class="ic-field">
            <label class="ic-label" for="qwPostcode">Full UK postcode</label>
            <input class="ic-input" id="qwPostcode" name="postcode" type="text" autocomplete="postal-code" placeholder="W1W 8JQ" value="${esc(state.postcode)}" aria-invalid="${e.postcode ? 'true' : 'false'}">
            <span class="field-error" id="errPostcode">${esc(e.postcode || '')}</span>
          </div>
        </div>
      </form>

      <div id="postcodeLiveSlot">${renderPostcodeLiveBanner()}</div>
      <p class="privacy-note">Your quote is saved against your email so you can return later. We never share your details.</p>
    `;
  }

  /* =========================================================================
     Step 4: Fixed Price Hero + Model Extras + Expandable .ic-choice Radio Cards
     ========================================================================= */
  function renderSpeedToggle(serviceKind) {
    if (!canUseExpress()) return '';
    const fee = getExpressFee();
    const isMailin = serviceKind === 'mailin';
    const stdSub = isMailin
      ? '2 working days on the bench once it arrives'
      : '2 working days on the bench';
    const expLabel = isMailin ? 'Express bench' : 'Express';
    const expSub = isMailin
      ? 'Priority bench on arrival. Parts pre-reserved while in transit.'
      : '1 working day priority bench (advance-bookable)';

    let statusLine = '';
    if (state.speed === 'express' && !isMailin && state.expressFullThisWeek) {
      statusLine = `
        <div class="express-status-line" role="status">
          <span>Express is full this week. Next guaranteed slot: Tue 1 Dec (back Wed 2 Dec).</span>
        </div>
      `;
    } else if (state.speed === 'express' && isMailin) {
      statusLine = `
        <div class="express-status-line" role="status" style="background:var(--ok-tint);color:var(--ok-text);">
          <span>Express bench held for when your parcel arrives. Parts pre-reserved while in transit.</span>
        </div>
      `;
    }

    return `
      <div class="drawer-section">
        <div class="drawer-label-row">
          <span class="ic-label">Bench speed</span>
        </div>
        <div class="speed-row" role="group" aria-label="Bench turnaround speed">
          <button type="button" class="speed-chip" data-set-speed="standard" aria-pressed="${state.speed === 'standard'}">
            <span class="speed-chip-top"><span>Standard</span><span>Included</span></span>
            <span class="speed-chip-sub">${esc(stdSub)}</span>
          </button>
          <button type="button" class="speed-chip" data-set-speed="express" aria-pressed="${state.speed === 'express'}">
            <span class="speed-chip-top"><span>${esc(expLabel)}</span><span>+£${fee}</span></span>
            <span class="speed-chip-sub">${esc(expSub)}</span>
          </button>
        </div>
        ${statusLine}
      </div>
    `;
  }

  function renderDateAndWindow(serviceKind) {
    const dates = getEligibleDates(serviceKind);
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'B1';
    const clk = getClockStatus(band);
    const chosen = dates.find((d) => d.iso === state.selectedDateIso) || dates[0];
    const isDropoff = serviceKind === 'dropoff';
    const amLabel = isDropoff
      ? (chosen.isFriday ? '10am to 12pm' : '9am to 12pm')
      : '9am to 12pm';
    const pmLabel = isDropoff ? '12pm to 6pm' : '12pm to 5pm';
    const amDisabled = chosen.isToday && clk.morningExpiredToday;

    return `
      <div class="drawer-section">
        <div class="drawer-label-row">
          <span class="ic-label">${isDropoff ? 'Appointment date' : 'Collection date'}${state.speed === 'express' ? ' (Express availability)' : ''}</span>
          <span class="ic-label">${esc(clk.clockText)}</span>
        </div>
        <div class="date-strip" role="group" aria-label="Select date">
          ${dates.map((d) => {
            const isSelected = d.iso === state.selectedDateIso;
            const disabledForMode = state.speed === 'express' ? !d.expressAvailable : !d.availableForService;
            let micro = d.isToday ? 'Today' : (d.isFriday ? 'Fri' : 'Open');
            let microCls = 'date-chip-sub';
            if (!d.availableForService) {
              micro = 'Closed';
              microCls += ' date-chip-sub--full';
            } else if (state.speed === 'express') {
              if (d.expLeft === 0) {
                micro = 'Full';
                microCls += ' date-chip-sub--full';
              } else if (d.expLeft === 1) {
                micro = '1 left';
                microCls += ' date-chip-sub--low';
              } else {
                micro = d.expLeft + ' left';
                microCls += ' date-chip-sub--ok';
              }
            }
            return `
              <button type="button" class="date-chip" data-select-date="${esc(d.iso)}" aria-pressed="${isSelected}" aria-disabled="${disabledForMode ? 'true' : 'false'}">
                <span class="date-chip-day">${esc(d.short)}</span>
                <span class="${microCls}">${esc(micro)}</span>
              </button>
            `;
          }).join('')}
        </div>
        ${state.fullDateNotice ? `
          <div class="full-date-helper">
            <span>${esc(state.fullDateNotice)}</span>
            <button type="button" class="inline-link-btn" data-action="switch-std-for-date">Switch to Standard</button>
          </div>
        ` : ''}
        ${!isDropoff && !clk.todayAllowedCourier && (band === 'B1' || band === 'B2') ? `
          <div class="drawer-mono-hint">Same-day cut-off passed; earliest collection Fri 27 Nov.</div>
        ` : ''}
      </div>

      <div class="drawer-section">
        <div class="drawer-label-row">
          <span class="ic-label">${isDropoff ? 'Drop-off window' : 'Collection window'}</span>
          ${amDisabled ? '<span class="ic-label">Morning cut-off passed (10:30)</span>' : ''}
        </div>
        <div class="window-row" role="group" aria-label="Time window">
          <button type="button" class="window-chip" data-select-window="am" aria-pressed="${state.selectedWindow === 'am'}" ${amDisabled ? 'disabled' : ''}>
            <span>Morning</span>
            <span class="window-chip-sub">${esc(amLabel)}</span>
          </button>
          <button type="button" class="window-chip" data-select-window="pm" aria-pressed="${state.selectedWindow === 'pm'}">
            <span>Afternoon</span>
            <span class="window-chip-sub">${esc(pmLabel)}</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderStep4() {
    const model = getModel();
    const total = getTotalPrice();
    const base = getBasePrice();
    const ret = getReturnSummary();
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'UK';
    const postcodeDisplay = state.postcodeInfo ? state.postcodeInfo.formatted : 'W1W 8JQ';
    const isLondon = isLondonPostcode();
    const courierOk = courierAvailableForOrder();
    const courierPriceLabel = (state.route === 'diagnostic' || base >= 200) ? 'Free' : '+£25';
    const klarnaInstallment = (total / 3).toFixed(2);
    const clk = getClockStatus(band);
    const nextApptLabel = clk.dropoffTodayAllowed
      ? ('Today, ' + (clk.morningExpiredToday ? '12pm to 6pm' : '9am to 12pm'))
      : 'Fri 27 Nov, 10am to 12pm';

    const appleContrast = state.appleBeen === 'Yes' && state.appleQuote.trim()
      ? `<div class="ic-notice ic-notice--ok" style="margin-bottom:10px;"><span class="ic-notice-dot" aria-hidden="true"></span><span>You were quoted £${esc(state.appleQuote.replace(/[^0-9.,]/g, ''))}. Our board-level repairs on this model start at £${model.prices.logicFloor}.</span></div>`
      : '';

    const diagGuide = state.route === 'diagnostic' ? `
      <div class="diag-guide-rows">
        <p class="diag-guide-copy">We'll complete the diagnostic within 1 working day of receiving your device and email you a quote. The device stays with us while you decide whether to proceed. Collection and return are included. If you go ahead with the repair, we take the £${model.prices.diagnostic} off the repair price.</p>
        <div class="diag-guide-list">
          <div class="diag-guide-item"><span>Board-level diagnostic</span><strong>£${model.prices.diagnostic}</strong></div>
          <div class="diag-guide-item"><span>Logic board repairs from</span><strong>£${model.prices.logicFloor}</strong></div>
        </div>
      </div>
    ` : '';

    const extrasHtml = (model.colors && model.colors.length) || state.device === 'ipad' ? `
      <div class="extras-block">
        ${model.colors && model.colors.length ? `
          <div class="extras-row">
            <span class="ic-label">Device colour (matches stock at Fitzrovia)</span>
          </div>
          <div class="swatch-group" id="qwColorGrid" role="group" aria-label="Device colour">
            ${model.colors.map((c) => `
              <button type="button" class="swatch-btn" data-select-color="${esc(c)}" aria-pressed="${state.deviceColor === c}">
                <span class="swatch-dot" style="background:${SWATCH_HEX[c] || '#757575'}"></span>
                <span>${esc(c)}</span>
              </button>
            `).join('')}
          </div>
        ` : ''}
        ${state.device === 'ipad' ? `
          <div class="opt-row-2" style="margin-top:10px;">
            <div>
              <span class="ic-label">Connectivity</span>
              <div class="swatch-group">
                ${['Wi-Fi', 'Wi-Fi + Cellular'].map((opt) => `<button type="button" class="swatch-btn" data-ipad-connect="${esc(opt)}" aria-pressed="${state.ipadConnect === opt}">${esc(opt)}</button>`).join('')}
              </div>
            </div>
            ${model.nanoOption ? `
              <div>
                <span class="ic-label">Display glass</span>
                <div class="swatch-group">
                  ${['Standard', 'Nano-texture'].map((opt) => `<button type="button" class="swatch-btn" data-ipad-glass="${esc(opt)}" aria-pressed="${state.ipadGlass === opt}">${esc(opt)}</button>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    ` : '';

    const b3Under200Banner = isLondon && !courierOk ? `
      <div class="ic-notice ic-notice--action" style="margin-bottom:10px;">
        <span class="ic-notice-dot" aria-hidden="true"></span>
        <span>Courier collection in this area applies to repairs £200 and over. Free tracked mail-in is selected for this repair.</span>
      </div>
    ` : '';

    return `
      <div class="price-hero">
        <div class="price-hero-left">
          <span class="ic-label">${esc(model.name)} · ${esc(getRepairDisplayName())}</span>
          <div class="price-figure-row">
            <span class="price-hero-amount">£${total}</span>
            <span class="price-vat">inc. VAT</span>
          </div>
          <p class="price-eta-line">${esc(ret.label)}</p>
          ${total >= 100 ? `
            <div class="klarna-row">
              <span class="klarna-badge">Klarna.</span>
              <span>3 interest-free payments of £${klarnaInstallment}. First payment at checkout, then one every 30 days. Subject to status.</span>
            </div>
          ` : ''}
        </div>
        <div class="price-hero-right">
          <span class="ic-chip ic-chip--ok"><span class="ic-chip-dot"></span>2-year warranty</span>
          ${state.route === 'repair' ? '<span class="ic-chip ic-chip--action"><span class="ic-chip-dot"></span>Genuine Apple displays</span>' : '<span class="ic-chip ic-chip--action"><span class="ic-chip-dot"></span>Fee deducted if repaired</span>'}
        </div>
      </div>

      ${appleContrast}
      ${diagGuide}
      ${extrasHtml}
      ${b3Under200Banner}

      <div class="choice-section-head">
        <span class="ic-label">Choose how it reaches us (${esc(postcodeDisplay)})</span>
      </div>

      <div class="choice-group" role="radiogroup" aria-label="How your device reaches iCorrect">
        ${courierOk ? `
          <div class="ic-choice" role="radio" tabindex="0" aria-checked="${state.service === 'courier'}" data-select-service="courier">
            <div class="ic-choice-head">
              <span class="ic-choice-mark" aria-hidden="true"></span>
              <div class="ic-choice-copy">
                <div class="ic-choice-title">Same-day London courier</div>
                <div class="ic-choice-sub">Door-to-door from ${esc(postcodeDisplay)} · Insured collection &amp; return</div>
              </div>
              <span class="ic-choice-price ${courierPriceLabel === 'Free' ? 'ic-choice-price--free' : ''}">${esc(courierPriceLabel)}</span>
            </div>
            ${state.service === 'courier' ? `
              <div class="ic-choice-drawer">
                ${renderSpeedToggle('courier')}
                ${renderDateAndWindow('courier')}
                <p class="drawer-meta-line"><strong>${esc(ret.label)}</strong></p>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${isLondon ? `
          <div class="ic-choice" role="radio" tabindex="0" aria-checked="${state.service === 'dropoff'}" data-select-service="dropoff">
            <div class="ic-choice-head">
              <span class="ic-choice-mark" aria-hidden="true"></span>
              <div class="ic-choice-copy">
                <div class="ic-choice-title">Booked Fitzrovia drop-off</div>
                <div class="ic-choice-sub">Next available: ${esc(nextApptLabel)} · 12 Margaret Street, W1W 8JQ</div>
              </div>
              <span class="ic-choice-price ic-choice-price--free">Free</span>
            </div>
            ${state.service === 'dropoff' ? `
              <div class="ic-choice-drawer">
                ${renderSpeedToggle('dropoff')}
                ${renderDateAndWindow('dropoff')}
                <p class="drawer-meta-line"><strong>12 Margaret Street, Audley House, London W1W 8JQ</strong> · Mon to Thu 9am to 6pm, Friday 10am to 6pm, Sat &amp; Sun closed.</p>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="ic-choice" role="radio" tabindex="0" aria-checked="${state.service === 'mailin'}" data-select-service="mailin">
          <div class="ic-choice-head">
            <span class="ic-choice-mark" aria-hidden="true"></span>
            <div class="ic-choice-copy">
              <div class="ic-choice-title">Free tracked UK mail-in</div>
              <div class="ic-choice-sub">Prepaid insured box sent to ${esc(postcodeDisplay)} · Free tracked return</div>
            </div>
            <span class="ic-choice-price ic-choice-price--free">Free</span>
          </div>
          ${state.service === 'mailin' ? `
            <div class="ic-choice-drawer">
              <div class="drawer-section">
                <ul class="drawer-list">
                  <li><span class="drawer-bullet" aria-hidden="true"></span><span>Prepaid insured box dispatched today before 3pm</span></li>
                  <li><span class="drawer-bullet" aria-hidden="true"></span><span>Drop at any UK Post Office using the prepaid Royal Mail label</span></li>
                  <li><span class="drawer-bullet" aria-hidden="true"></span><span>Tracked insured return included once calibrated and tested</span></li>
                </ul>
              </div>
              ${renderSpeedToggle('mailin')}
              <p class="drawer-meta-line"><strong>${esc(ret.label)}</strong></p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /* =========================================================================
     Checkout Verification Confirmation Overlay (Zero Step 5!)
     ========================================================================= */
  function openCheckoutVerification() {
    const model = getModel();
    const base = getBasePrice();
    const exp = state.speed === 'express' && canUseExpress() ? getExpressFee() : 0;
    const adj = getServiceAdjustment();
    const total = getTotalPrice();
    const ret = getReturnSummary();
    const pc = state.postcodeInfo ? state.postcodeInfo.formatted : 'W1W 8JQ';
    const band = state.postcodeInfo ? state.postcodeInfo.band : 'B1';
    const internalServiceType = state.service === 'courier'
      ? 'Courier collection'
      : (state.service === 'dropoff' ? 'Walk-in' : 'Mail-in');

    const lines = [
      { title: model.name + ' · ' + getRepairDisplayName(), sku: state.resolvedSku, price: '£' + base }
    ];
    if (exp > 0) {
      lines.push({
        title: state.service === 'mailin' ? 'Express Bench (Mail-in priority on arrival)' : 'Express Turnaround (Booked for ' + state.selectedDateIso + ')',
        sku: 'express-turnaround',
        price: '+£' + exp
      });
    }
    if (adj > 0) {
      lines.push({ title: 'London Courier Service Adjustment (Under £200)', sku: '71280436445437', price: '+£' + adj });
    }
    if (state.service !== 'dropoff') {
      lines.push({
        title: HOME_ADDRESS_SKU.title + ' (Variant ' + HOME_ADDRESS_SKU.variantId + ')',
        sku: HOME_ADDRESS_SKU.variantId,
        price: '£0'
      });
    }

    const slotLabel = state.selectedWindow === 'am' ? 'Morning (9am to 12pm)' : (state.service === 'dropoff' ? 'Afternoon (12pm to 6pm)' : 'Afternoon (12pm to 5pm)');
    const props = [
      ['Repair Type', state.route === 'diagnostic' ? 'Diagnostic' : 'Repair'],
      ['Service Type (Monday key)', internalServiceType],
      ['Postcode', pc],
      ['Band', band],
      [ret.propKey, ret.iso + ' (' + ret.dateText + ')'],
      ['Turnaround', state.speed === 'express' && canUseExpress() ? ('Express (' + (state.service === 'mailin' ? 'Mail-in priority' : 'Booked for ' + state.selectedDateIso) + ')') : 'Standard (2 working days)']
    ];
    if (state.service === 'courier') {
      props.push(['Collection Date', state.selectedDateIso]);
      props.push(['Collection Window', slotLabel]);
    } else if (state.service === 'dropoff') {
      props.push(['Drop-off Date', state.selectedDateIso]);
      props.push(['Drop-off Window', slotLabel]);
    }
    if (state.deviceColor) props.push(['Device Color', state.deviceColor]);
    if (state.device === 'ipad') {
      props.push(['Connectivity', state.ipadConnect]);
      if (model.nanoOption) props.push(['Display glass', state.ipadGlass]);
    }
    if (state.fault === 'liquid') {
      props.push(['Device usable', state.liquidUsable === 'yes' ? 'Yes' : 'No']);
      props.push(['Liquid risk acknowledged', state.liquidAck ? 'Yes (verbatim copy confirmed)' : 'No']);
    }
    if (state.dataAnswer) props.push(['Data priority', state.dataAnswer]);
    if (state.appleBeen) {
      props.push(['Previous Apple / shop verdict', state.appleBeen === 'Yes' ? (state.appleVerdict + (state.appleQuote ? ' (£' + state.appleQuote + ')' : '')) : state.appleBeen]);
    }
    if (state.fault === 'recovery') {
      props.push(['Data recovery notes', [state.recWhat, state.recState, 'Prior work: ' + state.recTried, state.recTriedSaid ? 'Verdict: ' + state.recTriedSaid : '', 'Login password: ' + state.recPassword, state.recPriority ? 'Priority: ' + state.recPriority : ''].filter(Boolean).join(' | ')]);
    }

    const checkoutUrl = '/checkout?ph_distinct_id=preview_session&checkout[shipping_address][country]=United%20Kingdom&checkout[shipping_address][zip]=' + encodeURIComponent(pc);

    els.checkoutOverlayBody.innerHTML = `
      <div class="ic-notice ic-notice--ok">
        <span class="ic-notice-dot" aria-hidden="true"></span>
        <span>Zero Step 5: clicking <strong>Continue to checkout · £${total}</strong> posts these exact line items to <code>/cart/add.js</code> and redirects directly to Shopify Checkout.</span>
      </div>

      <div class="payload-section">
        <span class="ic-label">Shopify cart line items (${lines.length})</span>
        <div class="payload-line-list">
          ${lines.map((l) => `<div class="payload-line-item"><span>${esc(l.title)}</span><strong>${esc(l.price)}</strong></div>`).join('')}
        </div>
        ${state.service === 'dropoff' ? '<p class="drawer-meta-line">£0 homeAddress SKU intentionally omitted for Booked Fitzrovia drop-off.</p>' : '<p class="drawer-meta-line">£0 physical homeAddress SKU (46150010929405) included so Shopify collects the shipping/collection address.</p>'}
      </div>

      <div class="payload-section">
        <span class="ic-label">Checkout redirect URL (postcode prefill)</span>
        <div class="payload-url">${esc(checkoutUrl)}</div>
      </div>

      <div class="payload-section">
        <span class="ic-label">Line item &amp; Monday intake properties</span>
        <div class="payload-kv">
          ${props.map(([k, v]) => `<div class="payload-k">${esc(k)}</div><div class="payload-v">${esc(v)}</div>`).join('')}
        </div>
      </div>
    `;
    els.checkoutOverlay.hidden = false;
  }

  /* =========================================================================
     Live Trustindex Reviews Overlay
     ========================================================================= */
  function openReviewsOverlay() {
    els.reviewsOverlay.hidden = false;
    if (!state.trustindexLoaded && els.trustindexSlot) {
      state.trustindexLoaded = true;
      els.trustindexSlot.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://cdn.trustindex.io/loader.js?47cc7ef8590e8871fa062160cf7';
      script.defer = true;
      script.async = true;
      els.trustindexSlot.appendChild(script);
    }
  }

  /* =========================================================================
     Quick Preview Scenarios (Slim Test Bar + Mobile Sheet + URL Params)
     ========================================================================= */
  function applyScenario(id, opts) {
    const o = opts || {};
    state.activeScenario = id;
    state.errors = {};
    state.fullDateNotice = '';
    state.finderOpen = false;
    els.checkoutOverlay.hidden = true;
    els.reviewsOverlay.hidden = true;

    // Reset triage state cleanly
    state.liquidUsable = null;
    state.liquidAck = false;
    state.dataAnswer = null;
    state.appleBeen = null;
    state.appleVerdict = null;
    state.appleQuote = '';
    state.recWhat = null;
    state.recState = null;
    state.recTried = null;
    state.recTriedSaid = null;
    state.recPassword = null;
    state.recPriority = '';
    state.iphoneRecoveryPath = 'dead';
    state.dustFlexConfirmed = false;

    if (id === 'screen') {
      state.device = 'macbook';
      state.series = 'All';
      state.modelId = 'mbp-14-m3';
      state.fault = 'screen';
      state.subOption = 'cracked';
      state.resolvedSku = 'screen';
      state.route = 'repair';
      state.name = 'Alex Taylor';
      state.email = 'alex@example.co.uk';
      state.phone = '07700 900123';
      state.postcode = 'W1W 8JQ';
      state.postcodeInfo = parseFullPostcode('W1W 8JQ');
      state.service = 'courier';
      state.speed = 'standard';
      state.step = o.step || 1;
      state.maxStep = Math.max(state.step, 1);
    } else if (id === 'liquid') {
      state.device = 'macbook';
      state.series = 'All';
      state.modelId = 'mbp-14-m3';
      state.fault = 'liquid';
      state.subOption = null;
      state.resolvedSku = 'diagnostic';
      state.route = 'diagnostic';
      state.liquidUsable = 'no';
      state.liquidAck = true;
      state.dataAnswer = 'Yes, repair it to keep the data if you can';
      state.appleBeen = 'Yes';
      state.appleVerdict = 'They quoted a logic board or a whole replacement';
      state.appleQuote = '1049';
      state.name = 'Alex Taylor';
      state.email = 'alex@example.co.uk';
      state.phone = '07700 900123';
      state.postcode = 'W1W 8JQ';
      state.postcodeInfo = parseFullPostcode('W1W 8JQ');
      state.service = 'courier';
      state.speed = 'standard';
      state.step = o.step || 2;
      state.maxStep = Math.max(state.step, 2);
    } else if (id === 'recovery') {
      state.device = 'macbook';
      state.series = 'All';
      state.modelId = 'mbp-14-m3';
      state.fault = 'recovery';
      state.subOption = null;
      state.resolvedSku = 'diagnostic';
      state.route = 'diagnostic';
      state.recWhat = 'It stopped working on its own';
      state.recState = 'Nothing at all: no lights, no sound, no fan';
      state.recTried = 'Yes, Apple';
      state.recTriedSaid = 'The data cannot be recovered';
      state.recPassword = 'Yes';
      state.recPriority = '2024 client projects on Desktop';
      state.name = 'Alex Taylor';
      state.email = 'alex@example.co.uk';
      state.phone = '07700 900123';
      state.postcode = 'W1W 8JQ';
      state.postcodeInfo = parseFullPostcode('W1W 8JQ');
      state.service = 'courier';
      state.speed = 'standard';
      state.step = o.step || 2;
      state.maxStep = Math.max(state.step, 2);
    } else if (id === 'london') {
      state.device = 'macbook';
      state.series = 'All';
      state.modelId = 'mbp-14-m3';
      state.fault = 'screen';
      state.subOption = 'cracked';
      state.resolvedSku = 'screen';
      state.route = 'repair';
      state.name = 'Alex Taylor';
      state.email = 'alex@example.co.uk';
      state.phone = '07700 900123';
      state.postcode = 'W1W 8JQ';
      state.postcodeInfo = parseFullPostcode('W1W 8JQ');
      state.service = 'courier';
      state.speed = o.express ? 'express' : 'standard';
      state.selectedDateIso = '2026-11-26';
      state.selectedWindow = 'pm';
      state.deviceColor = 'Space Black';
      state.step = o.step || 4;
      state.maxStep = 4;
    } else if (id === 'mailin') {
      state.device = 'macbook';
      state.series = 'All';
      state.modelId = 'mba-13-m3';
      state.fault = 'screen';
      state.subOption = 'cracked';
      state.resolvedSku = 'screen';
      state.route = 'repair';
      state.name = 'Sam Patel';
      state.email = 'sam@example.co.uk';
      state.phone = '07700 900456';
      state.postcode = 'M1 4BT';
      state.postcodeInfo = parseFullPostcode('M1 4BT');
      state.service = 'mailin';
      state.speed = o.express === false ? 'standard' : 'express';
      state.deviceColor = 'Midnight';
      state.step = o.step || 4;
      state.maxStep = 4;
    }

    render();
  }

  function syncTestControlHighlights() {
    document.querySelectorAll('[data-scenario]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.scenario === state.activeScenario);
    });
    if (els.pvExpressFull) els.pvExpressFull.checked = state.expressFullThisWeek;
    if (els.mExpressFull) els.mExpressFull.checked = state.expressFullThisWeek;
    if (els.mCookieSim) els.mCookieSim.checked = state.cookieSim;
    document.documentElement.style.setProperty('--cookie-h', state.cookieSim ? '227px' : '0px');
    if (els.simCookieBanner) els.simCookieBanner.hidden = !state.cookieSim;
  }

  /* =========================================================================
     Event Delegation
     ========================================================================= */
  function goNext() {
    if (state.step === 1) {
      if (!state.modelId) return;
      state.step = 2;
      state.maxStep = Math.max(state.maxStep, 2);
      render();
    } else if (state.step === 2) {
      if (!step2IsReady()) return;
      state.step = 3;
      state.maxStep = Math.max(state.maxStep, 3);
      render();
    } else if (state.step === 3) {
      if (!validateStep3(true)) {
        render();
        return;
      }
      state.errors = {};
      state.service = courierAvailableForOrder() ? 'courier' : 'mailin';
      state.step = 4;
      state.maxStep = 4;
      render();
    } else if (state.step === 4) {
      openCheckoutVerification();
    }
  }

  function goBack() {
    if (state.step > 1) {
      state.step -= 1;
      render();
    }
  }

  els.cta.addEventListener('click', goNext);
  els.backBtn.addEventListener('click', goBack);
  els.mBackBtn.addEventListener('click', goBack);

  document.querySelectorAll('.wiz-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.dataset.step);
      if (target <= state.maxStep) {
        state.step = target;
        render();
      }
    });
  });

  document.querySelectorAll('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyScenario(btn.dataset.scenario);
      if (els.mTestSheet) els.mTestSheet.hidden = true;
    });
  });

  function setExpressFullWeek(checked) {
    state.expressFullThisWeek = checked;
    state.fullDateNotice = '';
    if (checked && state.step === 4 && state.service !== 'mailin' && canUseExpress()) {
      state.speed = 'express';
      ensureValidStep4Defaults();
    }
    render();
  }

  if (els.pvExpressFull) {
    els.pvExpressFull.addEventListener('change', (ev) => setExpressFullWeek(ev.target.checked));
  }
  if (els.mExpressFull) {
    els.mExpressFull.addEventListener('change', (ev) => setExpressFullWeek(ev.target.checked));
  }
  if (els.mCookieSim) {
    els.mCookieSim.addEventListener('change', (ev) => {
      state.cookieSim = ev.target.checked;
      syncTestControlHighlights();
    });
  }
  if (els.simCookieAccept) {
    els.simCookieAccept.addEventListener('click', () => { state.cookieSim = false; syncTestControlHighlights(); });
  }
  if (els.simCookieDecline) {
    els.simCookieDecline.addEventListener('click', () => { state.cookieSim = false; syncTestControlHighlights(); });
  }

  if (els.mTestBtn) {
    els.mTestBtn.addEventListener('click', () => { els.mTestSheet.hidden = false; });
  }
  if (els.closeMTestSheet) {
    els.closeMTestSheet.addEventListener('click', () => { els.mTestSheet.hidden = true; });
  }
  if (els.doneMTestSheet) {
    els.doneMTestSheet.addEventListener('click', () => { els.mTestSheet.hidden = true; });
  }
  if (els.mTestSheet) {
    els.mTestSheet.addEventListener('click', (ev) => {
      if (ev.target === els.mTestSheet) els.mTestSheet.hidden = true;
    });
  }

  if (els.openReviewsDesktopBtn) {
    els.openReviewsDesktopBtn.addEventListener('click', openReviewsOverlay);
  }
  if (els.closeReviewsOverlay) {
    els.closeReviewsOverlay.addEventListener('click', () => { els.reviewsOverlay.hidden = true; });
  }
  if (els.closeCheckoutOverlay) {
    els.closeCheckoutOverlay.addEventListener('click', () => { els.checkoutOverlay.hidden = true; });
  }

  els.footMeta.addEventListener('click', (ev) => {
    const trigger = ev.target.closest('[data-action="open-reviews"]');
    if (trigger) openReviewsOverlay();
  });

  // Stage click delegation
  els.stage.addEventListener('click', (ev) => {
    const target = ev.target.closest('button, [data-select-service]');
    if (!target) return;

    if (target.dataset.action === 'toggle-finder') {
      state.finderOpen = !state.finderOpen;
      render();
      return;
    }

    if (target.dataset.selectDevice) {
      state.device = target.dataset.selectDevice;
      state.series = 'All';
      state.modelId = MODELS[state.device][0].id;
      state.deviceColor = '';
      state.fault = null;
      state.subOption = null;
      state.finderQuery = '';
      render();
      return;
    }

    if (target.dataset.selectSeries) {
      state.series = target.dataset.selectSeries;
      render();
      return;
    }

    if (target.dataset.selectModel) {
      state.modelId = target.dataset.selectModel;
      state.deviceColor = '';
      state.finderOpen = false;
      state.step = 2;
      state.maxStep = Math.max(state.maxStep, 2);
      render();
      return;
    }

    if (target.dataset.vg) {
      state.vgAnswers[target.dataset.vg] = target.dataset.val;
      render();
      return;
    }

    if (target.dataset.selectFault) {
      const f = target.dataset.selectFault;
      state.fault = f;
      state.subOption = null;
      state.dustFlexConfirmed = false;
      state.fullDateNotice = '';

      if (f === 'keyboard' || f === 'trackpad' || f === 'touch-bar' || f === 'crown') {
        state.resolvedSku = f;
        state.route = 'repair';
        state.step = 3;
        state.maxStep = Math.max(state.maxStep, 3);
        render();
        return;
      }
      if (f === 'liquid' || f === 'nopower' || f === 'recovery') {
        state.resolvedSku = 'diagnostic';
        state.route = 'diagnostic';
        render();
        return;
      }
      render();
      return;
    }

    if (target.dataset.subOpt) {
      const opt = target.dataset.subOpt;
      state.subOption = opt;
      if (opt === 'black' || opt === 'nopower') {
        state.fault = 'nopower';
        state.resolvedSku = 'diagnostic';
        state.route = 'diagnostic';
        render();
        return;
      }
      if (opt === 'dustflex') {
        const m = getModel();
        state.dustFlexConfirmed = true;
        state.resolvedSku = m.hasDustgate ? 'dustgate' : 'flexgate';
        state.route = 'repair';
        render();
        return;
      }
      if (opt === 'cracked') {
        state.resolvedSku = 'screen';
        state.route = 'repair';
        state.step = 3;
        state.maxStep = Math.max(state.maxStep, 3);
        render();
        return;
      }
      if (opt === 'glass') {
        state.resolvedSku = 'screen-glass';
        state.route = 'repair';
        state.step = 3;
        state.maxStep = Math.max(state.maxStep, 3);
        render();
        return;
      }
      if (opt === 'battery' || opt === 'charging-port' || opt === 'rear-glass' || opt === 'rear-camera' || opt === 'front-camera') {
        state.resolvedSku = opt;
        state.route = 'repair';
        if (opt !== 'battery' && opt !== 'front-camera') {
          state.step = 3;
          state.maxStep = Math.max(state.maxStep, 3);
        }
        render();
        return;
      }
      render();
      return;
    }

    if (target.dataset.dustflex) {
      const m = getModel();
      state.dustFlexConfirmed = target.dataset.dustflex === 'yes';
      state.resolvedSku = state.dustFlexConfirmed ? (m.hasDustgate ? 'dustgate' : 'flexgate') : 'screen';
      render();
      return;
    }

    if (target.dataset.liquidUsable) {
      state.liquidUsable = target.dataset.liquidUsable;
      state.liquidAck = false;
      render();
      return;
    }

    if (target.dataset.dataAnswer) {
      state.dataAnswer = target.dataset.dataAnswer;
      render();
      return;
    }

    if (target.dataset.appleBeen) {
      state.appleBeen = target.dataset.appleBeen;
      if (state.appleBeen !== 'Yes') {
        state.appleVerdict = null;
        state.appleQuote = '';
      }
      render();
      return;
    }

    if (target.dataset.appleVerdict) {
      state.appleVerdict = target.dataset.appleVerdict;
      render();
      return;
    }

    if (target.dataset.iphoneRec) {
      state.iphoneRecoveryPath = target.dataset.iphoneRec;
      state.route = target.dataset.iphoneRec === 'passcode' ? 'dismiss' : 'diagnostic';
      render();
      return;
    }

    if (target.dataset.recWhat) {
      state.recWhat = target.dataset.recWhat;
      render();
      return;
    }

    if (target.dataset.recState) {
      state.recState = target.dataset.recState;
      render();
      return;
    }

    if (target.dataset.recTried) {
      state.recTried = target.dataset.recTried;
      if (state.recTried === 'No, nobody has opened it') state.recTriedSaid = null;
      render();
      return;
    }

    if (target.dataset.recTriedSaid) {
      state.recTriedSaid = target.dataset.recTriedSaid;
      render();
      return;
    }

    if (target.dataset.recPassword) {
      state.recPassword = target.dataset.recPassword;
      render();
      return;
    }

    if (target.dataset.selectColor) {
      state.deviceColor = target.dataset.selectColor;
      render();
      return;
    }

    if (target.dataset.ipadConnect) {
      state.ipadConnect = target.dataset.ipadConnect;
      render();
      return;
    }

    if (target.dataset.ipadGlass) {
      state.ipadGlass = target.dataset.ipadGlass;
      render();
      return;
    }

    if (target.dataset.setSpeed) {
      state.speed = target.dataset.setSpeed;
      state.fullDateNotice = '';
      ensureValidStep4Defaults();
      render();
      return;
    }

    if (target.dataset.selectDate) {
      const iso = target.dataset.selectDate;
      const dates = getEligibleDates(state.service);
      const found = dates.find((d) => d.iso === iso);
      if (!found || !found.availableForService) return;
      if (state.speed === 'express' && !found.expressAvailable) {
        state.fullDateNotice = 'Express is full on ' + found.short + '. Switch to Standard for ' + found.short + '?';
        state.pendingStdDateIso = iso;
        render();
        return;
      }
      state.fullDateNotice = '';
      state.selectedDateIso = iso;
      ensureValidStep4Defaults();
      render();
      return;
    }

    if (target.dataset.action === 'switch-std-for-date') {
      state.speed = 'standard';
      if (state.pendingStdDateIso) state.selectedDateIso = state.pendingStdDateIso;
      state.fullDateNotice = '';
      ensureValidStep4Defaults();
      render();
      return;
    }

    if (target.dataset.selectWindow) {
      if (target.disabled) return;
      state.selectedWindow = target.dataset.selectWindow;
      render();
      return;
    }

    if (target.dataset.selectService) {
      // Only switch when clicking header or inactive card
      if (ev.target.closest('.ic-choice-drawer')) return;
      state.service = target.dataset.selectService;
      state.fullDateNotice = '';
      ensureValidStep4Defaults();
      render();
    }
  });

  // Keyboard support for radio cards
  els.stage.addEventListener('keydown', (ev) => {
    const choice = ev.target.closest('[data-select-service]');
    if (choice && (ev.key === 'Enter' || ev.key === ' ')) {
      if (ev.target.closest('.ic-choice-drawer')) return;
      ev.preventDefault();
      state.service = choice.dataset.selectService;
      ensureValidStep4Defaults();
      render();
    }
  });

  // Live input handlers inside stage (zero full re-render on typing so cursor stays put)
  els.stage.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.id === 'finderInput') {
      state.finderQuery = el.value;
      const res = els.stage.querySelector('.finder-results');
      if (res) {
        const q = state.finderQuery.trim().toUpperCase();
        const matches = MODELS.macbook.filter((m) => !q || m.code.includes(q) || m.name.toUpperCase().includes(q));
        res.innerHTML = matches.map((m) => `<button type="button" class="finder-match-btn" data-select-model="${esc(m.id)}"><strong>${esc(m.code)}</strong> · ${esc(m.name)}</button>`).join('');
      }
      return;
    }
    if (el.id === 'appleQuoteInput') {
      state.appleQuote = el.value;
      return;
    }
    if (el.id === 'recPriorityInput') {
      state.recPriority = el.value;
      return;
    }
    if (el.id === 'qwName') {
      state.name = el.value;
      if (state.errors.name && state.name.trim().length >= 2) {
        delete state.errors.name;
        el.setAttribute('aria-invalid', 'false');
        const errEl = document.getElementById('errName');
        if (errEl) errEl.textContent = '';
      }
      return;
    }
    if (el.id === 'qwEmail') {
      state.email = el.value;
      if (state.errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
        delete state.errors.email;
        el.setAttribute('aria-invalid', 'false');
        const errEl = document.getElementById('errEmail');
        if (errEl) errEl.textContent = '';
      }
      return;
    }
    if (el.id === 'qwPhone') {
      state.phone = el.value;
      if (state.errors.phone && state.phone.replace(/\D/g, '').length >= 10) {
        delete state.errors.phone;
        el.setAttribute('aria-invalid', 'false');
        const errEl = document.getElementById('errPhone');
        if (errEl) errEl.textContent = '';
      }
      return;
    }
    if (el.id === 'qwPostcode') {
      state.postcode = el.value;
      state.postcodeInfo = parseFullPostcode(state.postcode);
      if (state.postcodeInfo && state.errors.postcode) {
        delete state.errors.postcode;
        el.setAttribute('aria-invalid', 'false');
        const errEl = document.getElementById('errPostcode');
        if (errEl) errEl.textContent = '';
      }
      const liveSlot = document.getElementById('postcodeLiveSlot');
      if (liveSlot) liveSlot.innerHTML = renderPostcodeLiveBanner();
      renderHeaderAndProgress();
    }
  });

  els.stage.addEventListener('change', (ev) => {
    if (ev.target.id === 'liquidAckCheck') {
      state.liquidAck = ev.target.checked;
      render();
    }
  });

  els.stage.addEventListener('blur', (ev) => {
    if (ev.target.id === 'qwPostcode') {
      const parsed = parseFullPostcode(ev.target.value);
      state.postcodeInfo = parsed;
      const errEl = document.getElementById('errPostcode');
      if (!parsed && ev.target.value.trim().length > 0) {
        state.errors.postcode = 'Enter your full postcode, for example W1W 8JQ.';
        ev.target.setAttribute('aria-invalid', 'true');
        if (errEl) errEl.textContent = state.errors.postcode;
      } else if (parsed) {
        state.postcode = parsed.formatted;
        ev.target.value = parsed.formatted;
        delete state.errors.postcode;
        ev.target.setAttribute('aria-invalid', 'false');
        if (errEl) errEl.textContent = '';
      }
    }
  }, true);

  /* =========================================================================
     Initialise from URL Params (for deep-links & automated visual checks)
     ========================================================================= */
  function initFromParams() {
    const params = new URLSearchParams(window.location.search);
    const scen = params.get('scenario') || 'screen';
    const stepParam = Number(params.get('step')) || 0;
    const expressParam = params.get('express');
    const expressFullParam = params.get('expressFull') === '1';
    const cookieParam = params.get('cookie') === '1';
    const londonTimeParam = params.get('londonTime');

    if (londonTimeParam && /^\d{1,2}:\d{2}$/.test(londonTimeParam)) {
      const [h, m] = londonTimeParam.split(':').map(Number);
      state.londonTimeOverride = { hour: h, minute: m };
    }
    state.expressFullThisWeek = expressFullParam;
    state.cookieSim = cookieParam;

    applyScenario(scen, {
      step: stepParam || undefined,
      express: expressParam === '1' ? true : (expressParam === '0' ? false : undefined)
    });
  }

  initFromParams();
})();
