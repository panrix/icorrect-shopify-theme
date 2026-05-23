// ═══════════════════════════════════════════════════════════════════════════
//  iCorrect Quote Wizard — Device / Model / Fault / Troubleshoot Data
//  Source: icorrect-shopify-theme repo (icorrect-quote-wizard-final.html)
// ═══════════════════════════════════════════════════════════════════════════

window.QW_DEVICES = [
  { id: "iphone", name: "iPhone", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="1" width="12" height="22" rx="2.5"/><path d="M10 19h4"/></svg>' },
  { id: "macbook", name: "MacBook", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 17h20M8 21h8M12 17v4"/></svg>' },
  { id: "ipad", name: "iPad", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M10 18h4"/></svg>' },
  { id: "watch", name: "Watch", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="6"/><path d="M9 1h6M9 23h6"/></svg>' },
];


// ── MODELS: grouped by device, each group has sub-groups ──────────────────
window.QW_MODELS = {
  macbook: [
    { group: "MacBook Pro 16\"", models: [
      { name: "MacBook Pro 16\" M4 Pro/Max A3186/A3403 (2024)", year: "2024" },
      { name: "MacBook Pro 16\" M3 Pro/Max A2991 (2023)", year: "2023" },
      { name: "MacBook Pro 16\" M2 Pro/Max A2780 (2023)", year: "2023" },
      { name: "MacBook Pro 16\" M1 Pro/Max A2485 (2021)", year: "2021" },
      { name: "MacBook Pro 16\" A2141 (2019)", year: "2019" },
      { name: "MacBook Pro 15\" A1990 (2018–2019)", year: "2018" },
    ]},
    { group: "MacBook Pro 14\"", models: [
      { name: "MacBook Pro 14\" M4 Pro/Max A3112/A3185/A3401 (2024)", year: "2024" },
      { name: "MacBook Pro 14\" M3 Pro/Max A2918/A2992 (2023)", year: "2023" },
      { name: "MacBook Pro 14\" M2 Pro/Max A2779 (2023)", year: "2023" },
      { name: "MacBook Pro 14\" M1 Pro/Max A2442 (2021)", year: "2021" },
    ]},
    { group: "MacBook Pro 13\"", models: [
      { name: "MacBook Pro 13\" M2 A2338 (2022)", year: "2022" },
      { name: "MacBook Pro 13\" M1 A2338 (2020)", year: "2020" },
      { name: "MacBook Pro 13\" A2251 (2020)", year: "2020" },
      { name: "MacBook Pro 13\" A2289 (2020)", year: "2020" },
      { name: "MacBook Pro 13\" A2159 (2019)", year: "2019" },
      { name: "MacBook Pro 13\" A1989 (2018–2019)", year: "2018" },
    ]},
    { group: "MacBook Air 15\"", models: [
      { name: "MacBook Air 15\" M4 A3241 (2025)", year: "2025" },
      { name: "MacBook Air 15\" M3 A3114 (2024)", year: "2024" },
      { name: "MacBook Air 15\" M2 A2941 (2023)", year: "2023" },
    ]},
    { group: "MacBook Air 13\"", models: [
      { name: "MacBook Air 13\" M4 A3240 (2025)", year: "2025" },
      { name: "MacBook Air 13\" M3 A3113 (2024)", year: "2024" },
      { name: "MacBook Air 13\" M2 A2681 (2022)", year: "2022" },
      { name: "MacBook Air 13\" M1 A2337 (2020)", year: "2020" },
      { name: "MacBook Air 13\" A2179 (2020)", year: "2020" },
      { name: "MacBook Air 13\" A1932 (2018–2019)", year: "2018" },
    ]},
  ],
  iphone: [
    { group: "iPhone 16 series", models: [
      { name: "iPhone 16 Pro Max", year: "2024" },
      { name: "iPhone 16 Pro", year: "2024" },
      { name: "iPhone 16 Plus", year: "2024" },
      { name: "iPhone 16", year: "2024" },
      { name: "iPhone 16e", year: "2025" },
    ]},
    { group: "iPhone 15 series", models: [
      { name: "iPhone 15 Pro Max", year: "2023" },
      { name: "iPhone 15 Pro", year: "2023" },
      { name: "iPhone 15 Plus", year: "2023" },
      { name: "iPhone 15", year: "2023" },
    ]},
    { group: "iPhone 14 series", models: [
      { name: "iPhone 14 Pro Max", year: "2022" },
      { name: "iPhone 14 Pro", year: "2022" },
      { name: "iPhone 14 Plus", year: "2022" },
      { name: "iPhone 14", year: "2022" },
    ]},
    { group: "iPhone 13 series", models: [
      { name: "iPhone 13 Pro Max", year: "2021" },
      { name: "iPhone 13 Pro", year: "2021" },
      { name: "iPhone 13", year: "2021" },
      { name: "iPhone 13 Mini", year: "2021" },
    ]},
    { group: "iPhone 12 & older", models: [
      { name: "iPhone SE 3rd Gen (2022)", year: "2022" },
      { name: "iPhone 12 Pro Max", year: "2020" },
      { name: "iPhone 12 Pro", year: "2020" },
      { name: "iPhone 12", year: "2020" },
      { name: "iPhone 12 Mini", year: "2020" },
      { name: "iPhone SE 2nd Gen (2020)", year: "2020" },
      { name: "iPhone 11 Pro Max", year: "2019" },
      { name: "iPhone 11 Pro", year: "2019" },
      { name: "iPhone 11", year: "2019" },
    ]},
  ],
  ipad: [
    { group: "iPad Pro", models: [
      { name: "iPad Pro 13\" M4 (2024)", year: "2024" },
      { name: "iPad Pro 12.9\" 6th Gen M2 (2022)", year: "2022" },
      { name: "iPad Pro 12.9\" 5th Gen M1 (2021)", year: "2021" },
      { name: "iPad Pro 12.9\" 4th Gen (2020)", year: "2020" },
      { name: "iPad Pro 12.9\" 3rd Gen (2018)", year: "2018" },
      { name: "iPad Pro 11\" M4 (2024)", year: "2024" },
      { name: "iPad Pro 11\" 4th Gen M2 (2022)", year: "2022" },
      { name: "iPad Pro 11\" 3rd Gen M1 (2021)", year: "2021" },
      { name: "iPad Pro 11\" 2nd Gen (2020)", year: "2020" },
      { name: "iPad Pro 11\" 1st Gen (2018)", year: "2018" },
    ]},
    { group: "iPad Air", models: [
      { name: "iPad Air 13\" 7th Gen M3 (2025)", year: "2025" },
      { name: "iPad Air 11\" 7th Gen M3 (2025)", year: "2025" },
      { name: "iPad Air 13\" M2 (2024)", year: "2024" },
      { name: "iPad Air 11\" M2 (2024)", year: "2024" },
      { name: "iPad Air 5th Gen (2022)", year: "2022" },
      { name: "iPad Air 4th Gen (2020)", year: "2020" },
    ]},
    { group: "iPad + iPad Mini", models: [
      { name: "iPad 11th Gen (2025)", year: "2025" },
      { name: "iPad 10th Gen (2022)", year: "2022" },
      { name: "iPad 9th Gen (2021)", year: "2021" },
      { name: "iPad 8th Gen (2020)", year: "2020" },
      { name: "iPad 7th Gen (2019)", year: "2019" },
      { name: "iPad Mini 7 (2024)", year: "2024" },
      { name: "iPad Mini 6 (2021)", year: "2021" },
      { name: "iPad Mini 5 (2019)", year: "2019" },
    ]},
  ],
  watch: [
    { group: "Apple Watch Ultra", models: [
      { name: "Apple Watch Ultra 2", year: "2023" },
      { name: "Apple Watch Ultra", year: "2022" },
    ]},
    { group: "Apple Watch Series", models: [
      { name: "Apple Watch Series 10 46mm", year: "2024" },
      { name: "Apple Watch Series 10 42mm", year: "2024" },
      { name: "Apple Watch Series 9 45mm", year: "2023" },
      { name: "Apple Watch Series 9 41mm", year: "2023" },
      { name: "Apple Watch Series 8 45mm", year: "2022" },
      { name: "Apple Watch Series 8 41mm", year: "2022" },
      { name: "Apple Watch Series 7 45mm", year: "2021" },
      { name: "Apple Watch Series 7 41mm", year: "2021" },
      { name: "Apple Watch Series 6 44mm", year: "2020" },
      { name: "Apple Watch Series 6 40mm", year: "2020" },
      { name: "Apple Watch Series 5 44mm", year: "2019" },
      { name: "Apple Watch Series 5 40mm", year: "2019" },
    ]},
    { group: "Apple Watch SE", models: [
      { name: "Apple Watch SE 2nd Gen 44mm", year: "2022" },
      { name: "Apple Watch SE 2nd Gen 40mm", year: "2022" },
      { name: "Apple Watch SE 1st Gen 44mm", year: "2020" },
      { name: "Apple Watch SE 1st Gen 40mm", year: "2020" },
    ]},
  ],
};


// ── FAULT CATEGORIES per device type ──────────────────────────────────────
window.QW_FAULTS = {
  macbook: [
    { id: "screen",   label: "Screen / Display",            icon: "screen" },
    { id: "battery",  label: "Power / Battery / Charging",  icon: "battery" },
    { id: "keyboard", label: "Trackpad / Keyboard",         icon: "keyboard" },
    { id: "audio",    label: "Audio / Mic / Speaker",       icon: "audio" },
    { id: "wifi",     label: "Connectivity",                icon: "wifi" },
    { id: "water",    label: "Water Damage",                icon: "water" },
    { id: "data",     label: "Data Recovery",               icon: "data" },
    { id: "other",    label: "Other",                       icon: "other" },
  ],
  iphone: [
    { id: "screen",   label: "Screen / Display",            icon: "screen" },
    { id: "glass",    label: "Rear Glass",                  icon: "glass" },
    { id: "camera",   label: "Camera",                      icon: "camera" },
    { id: "battery",  label: "Power / Battery / Charging",  icon: "battery" },
    { id: "audio",    label: "Audio / Mic / Speaker",       icon: "audio" },
    { id: "wifi",     label: "Connectivity",                icon: "wifi" },
    { id: "water",    label: "Water Damage",                icon: "water" },
    { id: "data",     label: "Data Recovery",               icon: "data" },
    { id: "other",    label: "Other",                       icon: "other" },
  ],
  ipad: [
    { id: "screen",   label: "Screen / Display",            icon: "screen" },
    { id: "battery",  label: "Power / Battery / Charging",  icon: "battery" },
    { id: "audio",    label: "Audio / Mic / Speaker",       icon: "audio" },
    { id: "wifi",     label: "Connectivity",                icon: "wifi" },
    { id: "water",    label: "Water Damage",                icon: "water" },
    { id: "data",     label: "Data Recovery",               icon: "data" },
    { id: "other",    label: "Other",                       icon: "other" },
  ],
  watch: [
    { id: "screen",   label: "Screen / Display",            icon: "screen" },
    { id: "glass",    label: "Rear Glass",                  icon: "glass" },
    { id: "battery",  label: "Power / Battery / Charging",  icon: "battery" },
    { id: "wifi",     label: "Connectivity",                icon: "wifi" },
    { id: "water",    label: "Water Damage",                icon: "water" },
    { id: "other",    label: "Other",                       icon: "other" },
  ],
};


// ── TROUBLESHOOT: specific issues per device + fault ──────────────────────
window.QW_ISSUES = {
  macbook: {
    "Screen / Display": [
      { label: "Lines or artifacts", hint: "Display cable or LCD panel issue." },
      { label: "Dead pixels", hint: "Pixel failure, may need panel replacement." },
      { label: "Black screen", hint: "Could be display, GPU, or logic board." },
      { label: "Backlight fading (Flexgate)", hint: "Known flex cable issue on certain Pro models." },
      { label: "Cracked or shattered glass", hint: "Full display assembly replacement." },
      { label: "Dust under glass", hint: "Delamination or debris, display replacement." },
    ],
    "Power / Battery / Charging": [
      { label: "Won't turn on", hint: "Could be battery, logic board, or charging circuit." },
      { label: "Won't charge past a certain %", hint: "Degraded battery, replacement needed." },
      { label: "Battery swollen", hint: "Stop using immediately. Battery replacement." },
      { label: "Random shutdowns", hint: "Failing battery or thermal issue." },
      { label: "Charger not recognised", hint: "Charging port or logic board." },
    ],
    "Trackpad / Keyboard": [
      { label: "Keys not responding", hint: "Common on butterfly keyboards, may need top case." },
      { label: "Sticky or stuck keys", hint: "Debris or mechanism failure." },
      { label: "Trackpad not clicking", hint: "Could be swollen battery or trackpad failure." },
      { label: "Ghost typing", hint: "Liquid damage or flex cable." },
    ],
    "Audio / Mic / Speaker": [
      { label: "No sound", hint: "Speaker or audio circuit." },
      { label: "Crackling audio", hint: "Speaker cone damage or software." },
      { label: "Mic not working", hint: "Mic module or flex cable." },
    ],
    "Connectivity": [
      { label: "WiFi dropping", hint: "Antenna cable or WiFi module." },
      { label: "Bluetooth issues", hint: "Module or antenna." },
      { label: "USB-C ports dead", hint: "Port damage or logic board." },
    ],
    "Water Damage": [
      { label: "Spilled liquid", hint: "Needs professional diagnostic." },
      { label: "Won't turn on after spill", hint: "Corrosion likely, ultrasonic cleaning." },
      { label: "Partial failure after spill", hint: "Diagnostic needed." },
    ],
    "Data Recovery": [
      { label: "Drive not mounting", hint: "SSD or logic board." },
      { label: "Accidental deletion", hint: "Recovery depends on drive type." },
      { label: "Drive failing", hint: "Specialist recovery." },
    ],
    "Other": [
      { label: "Overheating", hint: "Fan, thermal paste, or airflow." },
      { label: "Slow performance", hint: "Software, RAM, or storage." },
      { label: "Something else", hint: "Tell us more below." },
    ],
  },
  iphone: {
    "Screen / Display": [
      { label: "Cracked glass (touch works)", hint: "Screen replacement with genuine parts." },
      { label: "Touch not responding", hint: "Digitiser failure, screen replacement." },
      { label: "Lines or discolouration", hint: "Panel damage, display replacement." },
      { label: "Black screen (still vibrates)", hint: "Display connection or panel." },
      { label: "Green line", hint: "Known OLED fault, display replacement." },
    ],
    "Rear Glass": [
      { label: "Cracked back glass", hint: "Rear glass replacement." },
      { label: "Camera lens cracked", hint: "Lens cover replacement." },
    ],
    "Camera": [
      { label: "Blurry photos", hint: "OIS failure or lens damage." },
      { label: "Camera black", hint: "Camera module or flex cable." },
      { label: "Front camera / Face ID", hint: "Front module repair." },
    ],
    "Power / Battery / Charging": [
      { label: "Drains fast", hint: "Battery degraded, replacement recommended." },
      { label: "Won't charge", hint: "Port, cable, or battery." },
      { label: "Random shutoffs", hint: "Battery or power management." },
      { label: "Swollen battery", hint: "Stop using. Battery replacement." },
    ],
    "Audio / Mic / Speaker": [
      { label: "No sound", hint: "Speaker module replacement." },
      { label: "Mic not working", hint: "Mic or flex cable." },
      { label: "Earpiece quiet", hint: "Earpiece replacement." },
    ],
    "Connectivity": [
      { label: "No signal", hint: "Antenna or baseband." },
      { label: "WiFi greyed out", hint: "WiFi IC or antenna." },
      { label: "Bluetooth issues", hint: "Module or antenna." },
    ],
    "Water Damage": [
      { label: "Dropped in liquid", hint: "Professional diagnostic needed." },
      { label: "Partial failure after water", hint: "Diagnostic required." },
    ],
    "Data Recovery": [
      { label: "Phone dead, need data", hint: "Board-level repair may be needed." },
      { label: "Forgotten passcode", hint: "Limited options, we can advise." },
    ],
    "Other": [
      { label: "Vibration not working", hint: "Taptic engine replacement." },
      { label: "SIM issues", hint: "Tray or software." },
      { label: "Something else", hint: "Tell us more." },
    ],
  },
  ipad: {
    "Screen / Display": [
      { label: "Cracked glass", hint: "Digitiser or display replacement." },
      { label: "Touch not responding", hint: "Screen replacement." },
      { label: "Lines or dead areas", hint: "Panel damage." },
      { label: "Black screen", hint: "Display or logic board." },
    ],
    "Power / Battery / Charging": [
      { label: "Won't charge", hint: "Port or battery." },
      { label: "Drains fast", hint: "Battery replacement." },
      { label: "Won't turn on", hint: "Battery or logic board." },
    ],
    "Audio / Mic / Speaker": [
      { label: "No sound", hint: "Speaker module." },
      { label: "Mic dead", hint: "Flex cable or module." },
    ],
    "Connectivity": [
      { label: "WiFi issues", hint: "Antenna or module." },
      { label: "Bluetooth issues", hint: "Antenna or chip." },
    ],
    "Water Damage": [
      { label: "Liquid exposure", hint: "Diagnostic required." },
    ],
    "Data Recovery": [
      { label: "Need data from broken iPad", hint: "Diagnostic needed." },
    ],
    "Other": [
      { label: "Home button / Touch ID", hint: "Button or flex cable." },
      { label: "Something else", hint: "Tell us more." },
    ],
  },
  watch: {
    "Screen / Display": [
      { label: "Cracked screen", hint: "Display replacement." },
      { label: "Display dead", hint: "Screen or connection." },
    ],
    "Rear Glass": [
      { label: "Cracked back crystal", hint: "Sensor crystal replacement." },
    ],
    "Power / Battery / Charging": [
      { label: "Won't charge", hint: "Coil or battery." },
      { label: "Drains fast", hint: "Battery replacement." },
      { label: "Won't turn on", hint: "Battery or logic board." },
    ],
    "Connectivity": [
      { label: "Bluetooth issues", hint: "Module or antenna." },
      { label: "WiFi issues", hint: "Antenna." },
    ],
    "Water Damage": [
      { label: "Water ingress", hint: "Seal failure, diagnostic needed." },
    ],
    "Other": [
      { label: "Digital Crown stuck", hint: "Cleaning or replacement." },
      { label: "Something else", hint: "Tell us more." },
    ],
  },
};


// ── FAULT ICON SVGs ───────────────────────────────────────────────────────
window.QW_FAULT_ICONS = {
  screen:   "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zM8 21h8M12 17v4",
  glass:    "M5 2h14v20H5zM5 14h14",
  camera:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  battery:  "M13 2L3 14h9l-1 8 10-12h-9l1-8",
  keyboard: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zM8 11h0M12 11h0M16 11h0M8 15h8",
  audio:    "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
  wifi:     "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  water:    "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  data:     "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  other:    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
};


// ── SERVICE CONFIG ────────────────────────────────────────────────────────
window.QW_SERVICE_CONFIG = {
  WORKSHOP_ADDRESS: "12 Margaret St, Fitzrovia W1W 8JQ",
  UK_BANK_HOLIDAYS: [
    "2026-01-01","2026-04-03","2026-04-06","2026-05-04","2026-05-25","2026-08-31","2026-12-25","2026-12-28",
    "2027-01-01","2027-03-26","2027-03-29","2027-05-03","2027-05-31","2027-08-30","2027-12-27","2027-12-28",
  ],
  WALK_IN_TIMES: [
    { time: "10:00", full: false }, { time: "11:00", full: false }, { time: "12:00", full: true },
    { time: "13:00", full: false }, { time: "14:00", full: false }, { time: "15:00", full: true },
    { time: "16:00", full: false }, { time: "17:00", full: false },
  ],
};
