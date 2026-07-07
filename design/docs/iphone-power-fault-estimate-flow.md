# iPhone Power Fault — Estimate Flow

**Source:** Built on the estimate model — companion to the liquid flows
**Purpose:** Single-repair estimate only. Try the free fixes first, give a firm price where the symptom names the part, and band only the genuine unknowns.
**Date:** 2026-05-27

---

## Power Fault — iPhone (Estimate)

```
CONTEXT — tags the band, doesn't branch the tree:

  Any liquid contact, ever?   ├── Yes → jump to the LIQUID flow instead
                              └── No  → continue here

  Any drop or impact recently? ├── Yes → board more likely, push band up
                               └── No  → continue

---

START: Does the iPhone power on?
│
├── YES — it powers on
│   └── What's the issue?
│       │
│       ├── Battery drains fast / low health / shows "Service"
│       │   └── → QUOTE ✓  Battery (firm price)
│       │
│       ├── Won't charge, or charges only sometimes
│       │   └── Tried a different known-good cable AND charger?
│       │       ├── NO   → try that first — a dead cable is the commonest cause
│       │       │           └── Fixed? → FIXED AT HOME    Still no? → ↓
│       │       └── YES  → → QUOTE ✓  Charging port (firm price)
│       │
│       └── Random restarts / shutdowns
│           └── Tried a software update or restore?
│               ├── NO   → try that first
│               │           └── Fixed? → FIXED AT HOME    Still no? → ↓
│               └── YES  → → ESTIMATE  (battery, or board if it persists)
│
└── NO — won't power on
    └── Tried a known-good charger AND a force restart?
        │   ( Force restart: Vol Up, Vol Down, then hold Side button. )
        │
        ├── NO   → try both first
        │           └── Came back? → FIXED AT HOME    Still dead? → ↓
        │
        └── YES, still dead
            └── Is there data on it you need back?
                ├── YES, not backed up  → → DATA RECOVERY route
                └── NO / backed up      → → ESTIMATE  (battery → charging port → board)
```

---

## What a power fault usually is (the cost factors)

Ordered by how common and how costly — most resolve at the cheap end:

| Factor | How often | Price treatment |
|--------|-----------|-----------------|
| **Charger / cable** | Very common | Free — FIXED AT HOME |
| **Battery** | Common | Firm QUOTE ✓ — cheapest repair |
| **Charging port** | Common | Firm QUOTE ✓ |
| **Logic board** — power management | Least common | ESTIMATE — needs the bench, the expensive end |

> The split that matters: if it **powers on**, the fault usually names itself (battery or port) and you can give a firm price. If it **won't power at all**, it could be any of the three, so it's an honest band — anchored toward the board so the bench result comes in under, not over.

---

## Estimate Bands

> Swap the £ placeholders for your real figures.

| | Range | Covers |
|---|-------|--------|
| **Battery** | £[firm] | Known repair, firm price |
| **Charging port** | £[firm] | Known repair, firm price |
| **Won't-power band** | £[low–high] | Battery at the low end up to board-level at the high end. Bench confirms. Diagnostic credited to the repair. |
| **Data recovery** | Separate quote | If it's board-level and the data isn't backed up. |

---

## Try-first Note (the free wins)

Before any quote, the quick ones that often fix it at home:
- A different, known-good cable **and** charger — a failed cable is the single commonest "won't charge."
- A force restart (Vol Up, Vol Down, hold Side button).
- A software update or restore for random restarts.

If one of these solves it, that's a FIXED AT HOME — no repair, and a customer who remembers you didn't sell them one.

---

## Saying it well

**Powers on, battery:** "That's a straightforward battery — £[firm], usually back same or next day."

**Won't power, ruled out the cable:** "With the cable ruled out, this is most likely the battery, charging port, or the board. Those range from £[low] to £[high]. We'll confirm the exact figure on the bench and the diagnostic comes off the repair — and if it's board-level with data you need, we'd talk about protecting that first."

---

## Outcomes Key

| Tag | Meaning |
|-----|---------|
| QUOTE ✓ | Firm price — symptom names a known, single repair |
| ESTIMATE | Banded estimate — probable repair, bench confirms the exact figure |
| FIXED AT HOME | Resolved by a free check (cable, restart, update) — no booking |
| DATA RECOVERY | Data-led route, separate quote |
| REDIRECT | Not our service — no booking |

---

## Notes

1. **This flow uses the full spectrum** — unlike liquid (mostly ESTIMATE / DATA RECOVERY), a power fault often lands on a firm QUOTE or even FIXED AT HOME. Powers-on cases name their own part; only won't-power cases need the band.
2. **Liquid is a hard cross-link, not a branch** — any liquid history sends them to the liquid flow, because liquid changes the whole cost structure.
3. **Try-first questions double as deflection** — they fix the cheap cases for free and qualify the rest, exactly like Path B intended.
