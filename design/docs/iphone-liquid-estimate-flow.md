# iPhone Liquid Damage — Estimate Flow

**Source:** Rebuilt from Meesha's original liquid flow → customer-facing estimate model
**Purpose:** Single-repair estimate only (NOT restore-to-new). Ask *only* what the customer can actually know, and disclose the rest.
**Date:** 2026-05-27

---

## Liquid Damage — iPhone (Estimate)

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

  Any visible crack on the glass?   (informational only — raises the floor, never lowers the ceiling)
  ├── Yes  → glass is in play. Tell them: liquid can also reach the display
  │           layer under the glass, so the screen side may be more than a
  │           straight glass swap.
  └── No   → do NOT promise the cheap band. Hidden screen damage is still
              possible — that's the variable in the range, disclosed below.

---

START: Does the phone power on?
│
├── YES — powers on, with faults
│   └── → ESTIMATE  (present the factor breakdown below)
│
├── NO — won't power on
│   └── Is there data on it you need back?
│       ├── YES, not backed up  → → DATA RECOVERY route
│       └── NO / backed up      → → ESTIMATE  (board-led)
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
| **Battery** | Common | Adds to the band |
| **Charging port** | Common | Adds to the band |
| **Screen** — display / OLED damaged by the liquid itself | Rare worst case — *can't be confirmed until it's open* | The ceiling-breaker |

> The screen is the one factor the customer can't see and we can't verify until the phone is open — liquid can damage the display under the glass even when the glass looks perfect. That's why it's disclosed at the start, not discovered at the till.

---

## Saying it without sounding like an upsell

**Screen looks fine:**
"Most of the cost is the board clean and the parts liquid usually takes — battery, charging port. The one thing we can't check until it's open is the screen, because liquid can get under the glass to the display. If that's happened it pushes toward the top of the range. We'd rather tell you that now than surprise you with it later."

**Visible crack:**
"Your glass is cracked, but liquid can also reach the display layer underneath, so the screen side might be more than a straight glass swap. We'll know for sure once it's open."

**If the screen does turn out damaged — the choice that removes the pressure:**
"You'll decide: replace the screen for a full fix, or we sort everything else and leave the screen as it is — the phone works, the display keeps its marks, and you can replace it whenever. The expensive part is never something we decide for you."

---

## Estimate Bands

> Swap the £ placeholders for your real figures. Anchor toward the **top** of the core range so the bench result is a relief. Diagnostic fee credited to the repair.

| | Range | Covers |
|---|-------|--------|
| **Core band** | £[X–Y] | Board clean + the usual parts (battery / charging port). Widen if submerged / weeks-old / unsure. |
| **+ Screen (worst case)** | up to £[Z]+ | Only if the liquid reached the display. Customer's choice to replace or leave it. |
| **Data recovery** | Separate quote | Data-led route — own timeline and handling. |

---

## Safety Note (show early — all liquid flows)

- Power off, leave it unplugged, do **not** charge it.
- Rice does nothing. Speed does.
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

1. **The screen is disclosed, not asked.** Customers often can't tell a liquid-damaged screen from a working one — the glass looks fine. So we don't gate the price on a question they can't answer; we set the floor from what they *can* see (a visible crack) and disclose the screen as the possible ceiling to everyone.
2. **Agency removes the rip-off feeling.** The expensive screen is always the customer's choice, never forced. "Fix the rest, leave the screen" is a real, cheaper option.
3. **Band-movers only** — every question is one a customer can answer at home AND one that changes the number. Bench-only checks live in the diagnostic system.
4. **Ports to MacBook liquid:** same shape — core = charging port + logic board + clean, ceiling-breaker = screen.
