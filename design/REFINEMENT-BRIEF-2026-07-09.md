# Design Refinement Brief — Homepage + system tokens (for Claude design)

**Date:** 2026-07-09 (London). **From:** Fable (build). **Goal:** refine the design to remove the "made-by-AI" spacing/rhythm tells, then **RE-SIGN it** so there is one frozen source of truth to build 1:1 against.

## Why
The Liquid homepage is now verified 1:1 with the *current* signed render on typography (88/88 text elements match on size/line-height/weight/letter-spacing/family). So the remaining "feels AI-made" is in **the design's own rhythm**, not the port. The design needs a refinement + re-sign; the build then matches the new truth. No ad-hoc token edits on the build side — you own the design, you sign it.

## Confirmed issues (verified in `design/colors_and_type.css`)
1. **Spacing scale has holes.** `--space-*` = 2·4·6·8·10·12·14·16 then jumps to 32·36·40·64·80·96·128. **Missing 20/24/28/48/56** — the fine-tuning band. Everything snaps to the same few values → uniform breathing.
2. **Lede line-height loose.** `.t-body-lg` sits high (target ~1.5–1.6).
3. **Display tracking is backwards (em loosens as size grows):** h1 40px = −0.06em · display 48px = −0.05em · display-xl 64px = −0.045em · hero h1 60px = −0.043em (loosest of all). Big display should be *tighter*.

## Systematic fixes (cascade site-wide)
- Fill the spacing scale so mid-values exist (20/24/28/44/48/56…).
- Tighten lede/large-body line-height to ~1.55.
- Invert the tracking curve: larger = proportionally tighter em (tune by eye).

## The human pass (your seat — this is what actually kills the AI feel)
Deliberate rhythm: tight *within* groups, generous *between*; section padding varied by content weight (not a blanket 96px); optically centre icons/arrows in tiles/buttons; align to cap-height, not the box.

## Deliverable = the place of truth
1. Refined `design/colors_and_type.css` + `design/icorrect/*.css`. **KEEP class names + DOM structure stable** — the Liquid port maps to them 1:1; renaming forces a re-architect. Change values, not names.
2. Regenerated signed renders in `design/approved-renders/` at canonical viewports (desktop **1440**, mobile **390**) — homepage first.
3. Update `design/FREEZE.md` to re-sign (date + note).

## Build handoff (Fable)
Once re-signed, I re-port and verify 1:1 via a `getComputedStyle` diff (font size/line-height/weight/letter-spacing **and spacing/gaps**) against the refined mould. The Shopify base-theme "v5 readability" `!important` hack that was flattening type is already neutralised on the build side, so the mould CSS drives cleanly.

## Order
Homepage first as the worked before/after example → you + Ricky sign off → roll token changes across the site (they cascade) + per-page optical passes.
