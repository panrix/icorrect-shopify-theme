# Courier pricing policy — margin check (Ricky's rulings 2026-09-11 10:31)

**Policy as ruled:**
- Free courier = **Central London only (B1–B2)**, repairs **≥£200**, baked into price (all-in, no breakdown)
- **B3–B4:** customer always pays at least one leg; we absorb one
- **<£200:** courier available at a charge (B1–B2), else mail-in
- **Outside London:** mail-in — free baked-in ≥£200, ~£20 adjusted cost <£200
- Mail-in true cost per device (Ricky): ~£6 pack out + ~£8 in + £8 back (normal) / £15–20 back (high-value insured) ≈ **£20–34/device**

## Margin check per repair family (sell / parts from top-repairs-courier-afford-20260908)

| Family | Sell | After parts | B1–B2 free RT £17–32 | B3/B4 one-leg hit £8–33 | Verdict |
|---|---:|---:|---:|---:|---|
| MacBook Pro 16" screen | £599 | £352 | £320–335 | £319–344 | ✅ strong |
| MacBook Air M2 screen | £399 | £281 | £249–264 | £248–273 | ✅ strong |
| MacBook Air M1 screen | £339 | £211 | £179–194 | £178–203 | ✅ strong |
| iPhone 15 Pro screen | £339 | £129 | £97–112 | £96–121 | ✅ holds |
| iPad screen | ~£341 | ~£200 | £168–183 | — | ✅ holds |
| MacBook battery | £199 | £165 | **£1 UNDER threshold** | — | ⚠️ see below |
| iPhone SE screen | £149 | £134 | n/a (<£200: +£25 courier or +£20 mail-in) | — | ✅ customer pays |
| iPhone battery | £89 | £68 | n/a — customer pays | — | ✅ "don't mind losing" |
| MacBook diag £49 (B1–B2 free per ruling) | £49 | £49 | £17–32 left | — | ⚠️ conversion bet, B1-only safer (£24 max RT) |

**Verdict: the £200 threshold holds margin on every measured family ≥£200, including the worst case (B4 one-leg on the thinnest ≥£200 repair ≈ £96 left).** No measured repair ≥£200 breaks under the policy.

## Edge cases to rule

1. **MacBook battery £199** — £1 under the threshold, £165 contribution, easily affords free B1–B2. Fix: manual `courier:free` tag override on those products (tag beats threshold), or reprice to £209.
2. **£49 MacBook diagnostics** — free B1–B2 leaves £17–32. Recommend **B1 only** (RT ≤£24, worst case £25 left) unless the conversion study says otherwise.
3. **Long-tail products** (971 in catalogue) use the £200 price threshold as proxy — parts data only exists per family. Accept the proxy; the measured families cover ~80% of volume.

## Final customer-facing matrix (all-in totals, no breakdown)

| | B1–B2 (core/inner) | B3–B4 (outer) | Outside London |
|---|---|---|---|
| **≥£200** | **Free collection & return** | Collection today: +£15 (B3) / +£25 (B4) · or free mail-in | Free tracked mail-in |
| **<£200** | Collection today: +£25 · or mail-in +£20 | Mail-in +£20 | Mail-in +£20 |

Tagging rules for the catalogue:
- `courier:free` → ≥£200 (plus manual overrides: MacBook batteries, silicon diags B1)
- `courier:one-leg` → ≥£200 in B3/B4 context (charge £15/£25)
- untagged/<£200 → paid courier B1–B2 (+£25) or mail-in (+£20)
