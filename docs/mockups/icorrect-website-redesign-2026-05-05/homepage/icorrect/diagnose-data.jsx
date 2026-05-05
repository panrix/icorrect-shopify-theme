// === Diagnose flow data ===
// Ported (compact) from icorrect-shopify-theme/icorrect-quote-wizard-final.html
// Source of truth lives there; this is a prototype mirror.

// --- Devices (Step 1) ---
const DIAG_DEVICES = [
  { id: "iphone",  name: "iPhone",   detail: "iPhone 11 onwards" },
  { id: "macbook", name: "MacBook",  detail: "Pro · Air · 2018+" },
  { id: "ipad",    name: "iPad",     detail: "iPad · Air · Pro · Mini" },
  { id: "watch",   name: "Watch",    detail: "Series 5+ · SE · Ultra" },
];

// --- Models (Step 2) — abbreviated for prototype, full list lives in production ---
const DIAG_MODELS = {
  macbook: [
    { g: 'MacBook Pro 16"', m: [
      { n: "MacBook Pro 16\" M4 Pro/Max", y: "2024" },
      { n: "MacBook Pro 16\" M3 Pro/Max", y: "2023" },
      { n: "MacBook Pro 16\" M1 Pro/Max", y: "2021" },
      { n: "MacBook Pro 16\" Intel",       y: "2019" },
    ]},
    { g: 'MacBook Pro 14"', m: [
      { n: "MacBook Pro 14\" M4 Pro/Max", y: "2024" },
      { n: "MacBook Pro 14\" M3 Pro/Max", y: "2023" },
      { n: "MacBook Pro 14\" M1 Pro/Max", y: "2021" },
    ]},
    { g: 'MacBook Pro 13"', m: [
      { n: "MacBook Pro 13\" M2", y: "2022" },
      { n: "MacBook Pro 13\" M1", y: "2020" },
      { n: "MacBook Pro 13\" Intel Touch Bar", y: "2016–20" },
    ]},
    { g: 'MacBook Air 15"', m: [
      { n: "MacBook Air 15\" M3", y: "2024" },
      { n: "MacBook Air 15\" M2", y: "2023" },
    ]},
    { g: 'MacBook Air 13"', m: [
      { n: "MacBook Air 13\" M3", y: "2024" },
      { n: "MacBook Air 13\" M2", y: "2022" },
      { n: "MacBook Air 13\" M1", y: "2020" },
      { n: "MacBook Air 13\" Intel Retina", y: "2018–20" },
    ]},
  ],
  iphone: [
    { g: "iPhone 16 series", m: [
      { n: "iPhone 16 Pro Max", y: "2024" },
      { n: "iPhone 16 Pro",     y: "2024" },
      { n: "iPhone 16 Plus",    y: "2024" },
      { n: "iPhone 16",         y: "2024" },
    ]},
    { g: "iPhone 15 series", m: [
      { n: "iPhone 15 Pro Max", y: "2023" },
      { n: "iPhone 15 Pro",     y: "2023" },
      { n: "iPhone 15 Plus",    y: "2023" },
      { n: "iPhone 15",         y: "2023" },
    ]},
    { g: "iPhone 14 series", m: [
      { n: "iPhone 14 Pro Max", y: "2022" },
      { n: "iPhone 14 Pro",     y: "2022" },
      { n: "iPhone 14",         y: "2022" },
    ]},
    { g: "Older iPhones", m: [
      { n: "iPhone 13 Pro Max", y: "2021" },
      { n: "iPhone 13 / Mini",  y: "2021" },
      { n: "iPhone 12 series",  y: "2020" },
      { n: "iPhone 11 series",  y: "2019" },
      { n: "iPhone SE 2/3",     y: "2020/22" },
    ]},
  ],
  ipad: [
    { g: "iPad Pro", m: [
      { n: "iPad Pro 13\" M4", y: "2024" },
      { n: "iPad Pro 11\" M4", y: "2024" },
      { n: "iPad Pro 12.9\" M2", y: "2022" },
    ]},
    { g: "iPad Air", m: [
      { n: "iPad Air M3 (13\" / 11\")", y: "2025" },
      { n: "iPad Air M2 (13\" / 11\")", y: "2024" },
      { n: "iPad Air 5",                y: "2022" },
    ]},
    { g: "iPad / Mini", m: [
      { n: "iPad 11", y: "2025" },
      { n: "iPad 10", y: "2022" },
      { n: "iPad Mini 7", y: "2024" },
      { n: "iPad Mini 6", y: "2021" },
    ]},
  ],
  watch: [
    { g: "Apple Watch Ultra", m: [
      { n: "Ultra 2", y: "2023" },
      { n: "Ultra",   y: "2022" },
    ]},
    { g: "Apple Watch Series", m: [
      { n: "Series 10",  y: "2024" },
      { n: "Series 9",   y: "2023" },
      { n: "Series 8",   y: "2022" },
      { n: "Series 7",   y: "2021" },
      { n: "Series 6",   y: "2020" },
      { n: "Series 5",   y: "2019" },
    ]},
    { g: "Apple Watch SE", m: [
      { n: "SE 2nd gen", y: "2022" },
      { n: "SE 1st gen", y: "2020" },
    ]},
  ],
};

// --- Fault categories (Step 3) ---
const DIAG_FAULTS = {
  iphone: [
    { id: "screen",  label: "Screen / Display",       icon: "screen" },
    { id: "back",    label: "Rear Glass",              icon: "glass" },
    { id: "camera",  label: "Camera",                  icon: "camera" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "audio",   label: "Audio / Mic / Speaker",   icon: "audio" },
    { id: "network", label: "Connectivity",            icon: "wifi" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "data",    label: "Data Recovery",           icon: "data" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
  macbook: [
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "input",   label: "Trackpad / Keyboard",     icon: "keyboard" },
    { id: "audio",   label: "Audio / Mic / Speaker",   icon: "audio" },
    { id: "network", label: "Connectivity",            icon: "wifi" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "data",    label: "Data Recovery",           icon: "data" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
  ipad: [
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "audio",   label: "Audio / Mic / Speaker",   icon: "audio" },
    { id: "network", label: "Connectivity",            icon: "wifi" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "data",    label: "Data Recovery",           icon: "data" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
  watch: [
    { id: "screen",  label: "Screen / Display",        icon: "screen" },
    { id: "back",    label: "Rear Glass",              icon: "glass" },
    { id: "battery", label: "Power / Battery / Charging", icon: "battery" },
    { id: "network", label: "Connectivity",            icon: "wifi" },
    { id: "water",   label: "Water Damage",            icon: "water" },
    { id: "other",   label: "Something else",          icon: "other" },
  ],
};

// --- Fault icons (compact SVG strings) ---
const DIAG_ICONS = {
  screen:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  glass:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="6" r="1.5"/><path d="M10 18h4"/></svg>',
  camera:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  battery:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8"/></svg>',
  audio:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>',
  wifi:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>',
  water:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
  data:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  other:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01M12 8a2 2 0 012 2c0 1-2 2-2 3"/></svg>',
  // device icons
  iphone:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="1" width="12" height="22" rx="2.5"/><path d="M10 19h4"/></svg>',
  macbook:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 17h20M8 21h8M12 17v4"/></svg>',
  ipad:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M10 18h4"/></svg>',
  watch:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="6"/><path d="M9 1h6M9 23h6"/></svg>',
};

function DiagIcon({ name, className }) {
  const html = DIAG_ICONS[name] || DIAG_ICONS.other;
  return <span className={"d-icon " + (className || "")} dangerouslySetInnerHTML={{ __html: html }} />;
}

Object.assign(window, {
  DIAG_DEVICES, DIAG_MODELS, DIAG_FAULTS, DIAG_ICONS, DiagIcon,
});
