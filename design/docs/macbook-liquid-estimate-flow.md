# MacBook Liquid Damage — Estimate Flow

**Source:** Ported from the iPhone liquid estimate flow → MacBook specifics
**Purpose:** Single-repair estimate only (NOT restore-to-new). Ask *only* what the customer can know, disclose the rest.
**Date:** 2026-05-27

---

## Liquid Damage — MacBook (Estimate)

```
CONTEXT — tags the band, doesn't branch the tree:

  How much liquid?
  ├── Light splash       → base band
  ├── Fully submerged    → push band up, repair odds lower
  └── Unsure             → assume submerged

  How long ago?
  ├── Last 48 hours      → best repair odds
  ├── Weeks ago          → corrosion likely, push band up
  └── Unsure             → assume corrosion

  Working normally before the liquid?
  ├── Yes                → liquid is the only cause
  └── No                 → a pre-existing fault stacks on top — capture it

  Any visible crack on the display?   (informational only — raises the floor, never lowers the ceiling)
  ├── Yes  → display is in play. Liquid can also reach the panel under the
  │           glass, so the screen side may be more than a straight swap.
  └── No   → do NOT promise the cheap band. Hidden display damage is still
              possible — that's the variable in the range, disclosed below.

---

START: Does the MacBook power on?
│
├── YES — powers on, with faults
│   └── → ESTIMATE  (present the factor breakdown below)
│
├── NO — won't power on
│   └── Press Caps Lock — does the key's light come on?
│       │   ( Tells us if the board has power. Light = board alive, likely a
│       │     display fault and your data is probably safe. No light = board-led. )
│       │
│       ├── LIGHT ON  → board has power, no display
│       │   └── → ESTIMATE  (display-led — reassure data likely safe)
│       │
│       ├── NO LIGHT  → board not powering
│       │   └── Is there data on it you need back?
│       │       ├── YES, not backed up  → → DATA RECOVERY route
│       │       └── NO / backed up      → → ESTIMATE  (board-led)
│       │
│       └── UNSURE
│           └── → ESTIMATE  (wider range)
│
└── UNSURE
    └── → ESTIMATE  (wider range)
```

---

## What liquid can hit — the cost factors (disclose at the START)

Never lead with one number. Present the estimate as a structure, ordered by how likely and how costly:

| Factor | How often | Effect on cost |
|--------|-----------|----------------|
| **Board clean** — ultrasonic liquid clean + corrosion treatment | Core — nearly every liquid job | The base of the estimate |
| **Charging board** — USB-C / MagSafe | Common | Adds to the band |
| **Battery** — can also swell | Common | Adds to the band |
| **Keyboard / trackpad (top case)** | Common — liquid often shows here first | Notable add — top-case parts aren't cheap |
| **Display assembly** — panel damaged by the liquid itself | Rare worst case — *can't be confirmed until it's open* | The ceiling-breaker — MacBook displays are the priciest part |

> The display is the one factor the customer can't see and we can't verify until it's open — liquid can reach the panel under the glass even when the glass looks perfect. Disclosed at the start, not discovered at the till.

---

## Saying it without sounding like an upsell

**Display looks fine:**
"Most of the cost is the board clean and the parts liquid usually takes — charging board, battery, sometimes the keyboard. The one thing we can't check until it's open is the display, because liquid can reach the panel under the glass. If that's happened it pushes toward the top of the range — better you hear it now than later."

**Visible crack or no image:**
"Liquid can damage the panel under the glass, so the display side might be more than a straight swap. We'll know once it's open — and on a MacBook the display is the priciest part, so it's the thing most likely to push the cost up."

**If the display does turn out damaged — the choice that removes the pressure:**
"You'll decide: replace the display for a full fix, or we sort everything else and leave the screen as it is — the machine works, the display keeps its marks, and you can replace it whenever. The expensive part is never something we decide for you."

---

## Estimate Bands

> Swap the £ placeholders for your real figures. Anchor toward the **top** of the core range so the bench result is a relief. Diagnostic fee credited to the repair.

| | Range | Covers |
|---|-------|--------|
| **Core band** | £[X–Y] | Board clean + the usual parts (charging board / battery / keyboard). Widen if submerged / weeks-old / unsure. |
| **+ Display (worst case)** | up to £[Z]+ | Only if the liquid reached the panel. Customer's choice to replace or leave it. |
| **Data recovery** | Separate quote | Data-led route — own timeline and handling. Storage is tied to the board on modern Macs. |

---

## Safety Note (show early — all liquid flows)

- Power off, leave it unplugged, do **not** charge it.
- Don't open the lid repeatedly or "dry it out" with rice. Speed does the work.
- Get it in fast — corrosion spreads from the moment it's powered.

---

## Outcomes Key

| Tag | Meaning |
|-----|---------|
| QUOTE ✓ | Firm price — symptom names a known, single repair |
| ESTIMATE | Banded estimate — probable repair, bench confirms the exact figure |
| DATA RECOVERY | Data-led route, separate quote |
| DIAGNOSTIC | Genuinely can't estimate yet — keep rare |
| REDIRECT | Not our service — no booking |

---

## Notes

1. **Caps Lock light is the one customer-doable board test.** Light on means the board is powering and the fault is almost certainly the display — which also means the data is very likely fine. A genuinely useful thing to be able to tell someone whose Mac "won't turn on."
2. **The display is disclosed, not asked** — same reasoning as iPhone: liquid damage to the panel is invisible from the outside, so we never gate the price on it. Floor from what they can see, ceiling disclosed to all.
3. **Top case matters on MacBook** — keyboard/trackpad is a common liquid casualty and a real cost, so it sits in the factor list, not hidden.
4. **Agency removes the rip-off feeling** — the expensive display is always the customer's choice.
