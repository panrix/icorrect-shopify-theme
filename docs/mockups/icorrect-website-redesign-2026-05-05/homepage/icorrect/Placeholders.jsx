// Workshop / board / device SVG placeholders — stylised line art that signals "real photo will go here"

function WorkshopSceneSVG() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ws-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1208" stopOpacity="0.04"/>
          <stop offset="1" stopColor="#1a1208" stopOpacity="0.10"/>
        </linearGradient>
        <pattern id="ws-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(120,53,15,0.08)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="500" fill="url(#ws-bg)"/>
      <rect width="400" height="500" fill="url(#ws-grid)"/>

      {/* Bench surface horizon */}
      <line x1="0" y1="320" x2="400" y2="320" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8"/>

      {/* Microscope on left */}
      <g stroke="#171717" strokeWidth="1.4" fill="none" strokeLinejoin="round">
        <rect x="30" y="240" width="80" height="14" rx="2"/>
        <line x1="70" y1="254" x2="70" y2="290"/>
        <line x1="55" y1="290" x2="85" y2="290"/>
        <rect x="50" y="290" width="40" height="22" rx="3"/>
        <path d="M 70 240 L 70 130 L 200 130 L 200 220"/>
        <rect x="170" y="120" width="60" height="34" rx="4"/>
        <circle cx="200" cy="240" r="14"/>
        <circle cx="200" cy="240" r="6" fill="#171717" fillOpacity="0.1"/>
      </g>

      {/* MacBook on bench, opened */}
      <g stroke="#171717" strokeWidth="1.4" fill="rgba(255,255,255,0.6)" strokeLinejoin="round">
        <path d="M 120 380 L 280 380 L 300 410 L 100 410 Z"/>
        <rect x="130" y="320" width="140" height="60" rx="3" fill="rgba(255,255,255,0.9)"/>
        <rect x="138" y="328" width="124" height="44" rx="1" fill="rgba(120,53,15,0.06)" stroke="rgba(0,0,0,0.18)"/>
      </g>

      {/* Tools — soldering iron + tweezers */}
      <g stroke="#171717" strokeWidth="1.3" fill="none">
        <line x1="320" y1="350" x2="380" y2="295"/>
        <rect x="312" y="346" width="14" height="28" rx="2" transform="rotate(-42 319 360)"/>
        <line x1="380" y1="295" x2="384" y2="291"/>
      </g>
      <g stroke="#171717" strokeWidth="1.2" fill="none">
        <path d="M 290 340 L 340 360 M 290 344 L 340 364"/>
      </g>

      {/* Annotation lines */}
      <g stroke="rgba(120,53,15,0.55)" strokeWidth="0.8" fill="none" strokeDasharray="3 3">
        <line x1="200" y1="240" x2="270" y2="180"/>
        <line x1="200" y1="350" x2="280" y2="80"/>
      </g>
      <g fill="rgba(120,53,15,0.85)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.5">
        <text x="275" y="178">STEREO 40×</text>
        <text x="285" y="78">A2442 LOGIC BD</text>
      </g>
    </svg>
  );
}

function BoardSVG({ tone = "warm" }) {
  // Logic board with components — stylised line art
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bd-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tone === "warm" ? "#1a0f06" : "#0a1018"}/>
          <stop offset="1" stopColor={tone === "warm" ? "#0f0904" : "#050810"}/>
        </linearGradient>
        <pattern id="bd-traces" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 40 10 M 10 0 L 10 40 M 20 20 L 40 20 M 30 0 L 30 30"
                stroke="rgba(120, 80, 30, 0.18)" strokeWidth="0.4" fill="none"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#bd-bg)"/>
      <rect width="400" height="300" fill="url(#bd-traces)"/>

      {/* Board outline */}
      <rect x="30" y="40" width="340" height="220" rx="6"
            fill="rgba(120, 80, 30, 0.18)"
            stroke="rgba(200, 160, 90, 0.35)" strokeWidth="0.8"/>

      {/* Main SoC block */}
      <rect x="120" y="100" width="100" height="100" rx="2"
            fill="rgba(20,20,20,0.85)"
            stroke="rgba(220, 180, 100, 0.5)" strokeWidth="0.8"/>
      <text x="170" y="155" fontFamily="var(--font-mono)" fontSize="11"
            textAnchor="middle" fill="rgba(220, 180, 100, 0.6)">M3 PRO</text>

      {/* Memory chips */}
      <rect x="240" y="100" width="60" height="40" rx="1"
            fill="rgba(20,20,20,0.7)"
            stroke="rgba(220, 180, 100, 0.4)" strokeWidth="0.5"/>
      <rect x="240" y="160" width="60" height="40" rx="1"
            fill="rgba(20,20,20,0.7)"
            stroke="rgba(220, 180, 100, 0.4)" strokeWidth="0.5"/>

      {/* Backlight IC area — circled with ring */}
      <rect x="60" y="120" width="40" height="20" rx="1"
            fill="rgba(20,20,20,0.85)"
            stroke="rgba(255, 100, 80, 0.9)" strokeWidth="1.2"/>
      <circle cx="80" cy="130" r="32" fill="none"
              stroke="rgba(255, 100, 80, 0.45)" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="115" y1="130" x2="180" y2="60"
            stroke="rgba(255, 100, 80, 0.7)" strokeWidth="0.8"/>
      <text x="180" y="55" fontFamily="var(--font-mono)" fontSize="9"
            fill="rgba(255, 140, 120, 0.95)" letterSpacing="0.5">U7600 · BACKLIGHT IC</text>

      {/* Tiny components scattered */}
      {[...Array(40)].map((_, i) => {
        const x = 40 + ((i * 47) % 320);
        const y = 50 + ((i * 37) % 200);
        const inMain = (x > 115 && x < 305 && y > 95 && y < 205);
        if (inMain) return null;
        return (
          <rect key={i} x={x} y={y} width={i % 3 === 0 ? 6 : 3} height={2}
                fill="rgba(220, 180, 100, 0.35)"/>
        );
      })}

      {/* Connector */}
      <rect x="60" y="220" width="80" height="14" rx="1"
            fill="rgba(40,40,40,0.85)"
            stroke="rgba(220, 180, 100, 0.45)" strokeWidth="0.5"/>
      {[...Array(20)].map((_, i) => (
        <line key={i} x1={62 + i * 4} y1="222" x2={62 + i * 4} y2="232"
              stroke="rgba(220, 180, 100, 0.5)" strokeWidth="0.4"/>
      ))}
    </svg>
  );
}

function MacBookHeroSVG() {
  // Open MacBook, slight 3/4 view, with screen showing damage / repair
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0a0a"/>
          <stop offset="1" stopColor="#1a1a1a"/>
        </linearGradient>
      </defs>

      {/* Lid */}
      <g>
        <path d="M 80 80 L 320 80 L 330 250 L 70 250 Z"
              fill="rgba(120, 80, 30, 0.18)"
              stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
        {/* Screen */}
        <rect x="92" y="92" width="216" height="146" fill="url(#mb-screen)" rx="2"/>
        {/* Stage light effect — vertical bars near bottom */}
        <g opacity="0.45">
          <rect x="100" y="220" width="2" height="14" fill="#7dd3fc"/>
          <rect x="120" y="218" width="2" height="16" fill="#7dd3fc"/>
          <rect x="155" y="216" width="2" height="18" fill="#7dd3fc"/>
          <rect x="200" y="220" width="2" height="14" fill="#7dd3fc"/>
          <rect x="240" y="216" width="2" height="18" fill="#7dd3fc"/>
          <rect x="285" y="218" width="2" height="16" fill="#7dd3fc"/>
        </g>
        {/* Notch */}
        <rect x="186" y="92" width="28" height="6" rx="2" fill="#000"/>
      </g>

      {/* Base — perspective */}
      <g>
        <path d="M 50 250 L 350 250 L 380 290 L 20 290 Z"
              fill="rgba(120, 80, 30, 0.22)"
              stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
        {/* Front edge */}
        <path d="M 20 290 L 380 290 L 376 295 L 24 295 Z"
              fill="rgba(0,0,0,0.18)"/>
      </g>

      {/* Keyboard hint */}
      <g opacity="0.3" stroke="rgba(0,0,0,0.4)" strokeWidth="0.4" fill="none">
        {[...Array(5)].map((_, r) => (
          [...Array(13)].map((_, c) => (
            <rect key={`${r}-${c}`} x={70 + c * 20} y={258 + r * 5} width="16" height="3" rx="0.5"/>
          ))
        ))}
      </g>

      {/* Annotation */}
      <g stroke="rgba(180, 80, 50, 0.7)" strokeWidth="0.8" fill="none" strokeDasharray="2 3">
        <line x1="200" y1="226" x2="350" y2="160"/>
      </g>
      <text x="350" y="155" fontFamily="var(--font-mono)" fontSize="10"
            textAnchor="end" fill="rgba(180, 80, 50, 0.95)" letterSpacing="0.4">
        STAGE LIGHT EFFECT
      </text>
    </svg>
  );
}

function LiquidDamageSVG() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ld-bg" cx="0.3" cy="0.4">
          <stop offset="0" stopColor="rgba(80, 45, 20, 0.45)"/>
          <stop offset="1" stopColor="rgba(0, 0, 0, 0.95)"/>
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ld-bg)"/>

      {/* Board with corrosion staining */}
      <rect x="40" y="60" width="320" height="180" rx="6"
            fill="rgba(120, 80, 30, 0.25)"
            stroke="rgba(200, 160, 90, 0.35)" strokeWidth="0.8"/>

      {/* Liquid spread blobs */}
      <g fill="rgba(140, 90, 40, 0.5)" stroke="rgba(180, 110, 50, 0.7)" strokeWidth="0.5">
        <ellipse cx="120" cy="130" rx="55" ry="38"/>
        <ellipse cx="180" cy="160" rx="38" ry="22"/>
        <ellipse cx="240" cy="120" rx="28" ry="18"/>
      </g>
      <g fill="rgba(220, 180, 100, 0.18)">
        <ellipse cx="110" cy="125" rx="35" ry="22"/>
        <ellipse cx="175" cy="155" rx="22" ry="12"/>
      </g>

      {/* Components peeking through */}
      <rect x="240" y="140" width="40" height="40" rx="1"
            fill="rgba(20,20,20,0.85)"
            stroke="rgba(220, 180, 100, 0.4)" strokeWidth="0.5"/>
      <rect x="290" y="90" width="50" height="20" rx="1"
            fill="rgba(20,20,20,0.7)"
            stroke="rgba(220, 180, 100, 0.4)" strokeWidth="0.5"/>

      {/* Annotation */}
      <g stroke="rgba(180, 80, 50, 0.8)" strokeWidth="0.8" fill="none" strokeDasharray="2 3">
        <line x1="120" y1="130" x2="50" y2="40"/>
      </g>
      <text x="46" y="36" fontFamily="var(--font-mono)" fontSize="9"
            fill="rgba(220, 120, 90, 0.95)" letterSpacing="0.4">
        CORROSION · DAY 14
      </text>
    </svg>
  );
}

function TouchIDSVG() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#0a0a0a"/>

      {/* Keyboard area */}
      <g stroke="rgba(220, 180, 100, 0.18)" strokeWidth="0.4" fill="rgba(120, 80, 30, 0.12)">
        {[...Array(4)].map((_, r) => (
          [...Array(13)].map((_, c) => (
            <rect key={`${r}-${c}`} x={40 + c * 25} y={80 + r * 32} width="20" height="20" rx="2"/>
          ))
        ))}
      </g>

      {/* Touch ID button (top right) */}
      <g>
        <circle cx="350" cy="100" r="15"
                fill="rgba(40,40,40,0.95)"
                stroke="rgba(220, 180, 100, 0.55)" strokeWidth="0.8"/>
        <circle cx="350" cy="100" r="22" fill="none"
                stroke="rgba(255, 100, 80, 0.7)" strokeWidth="1.2" strokeDasharray="2 3"/>
        {/* Fingerprint pattern */}
        <g stroke="rgba(220, 180, 100, 0.45)" strokeWidth="0.5" fill="none">
          <circle cx="350" cy="100" r="3"/>
          <circle cx="350" cy="100" r="6"/>
          <circle cx="350" cy="100" r="9"/>
        </g>
      </g>

      {/* Cable trace under */}
      <path d="M 350 115 Q 350 160 320 200 Q 280 230 200 230"
            stroke="rgba(220, 180, 100, 0.4)" strokeWidth="1.5" fill="none"/>

      {/* Annotation */}
      <text x="298" y="68" fontFamily="var(--font-mono)" fontSize="9"
            textAnchor="end" fill="rgba(255, 140, 120, 0.95)" letterSpacing="0.4">
        T2 CHIP PAIR FAULT
      </text>
    </svg>
  );
}

Object.assign(window, { WorkshopSceneSVG, BoardSVG, MacBookHeroSVG, LiquidDamageSVG, TouchIDSVG });
