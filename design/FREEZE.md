# Design mould — FROZEN reference (do not ship)

**Frozen 2026-07-07** · approved by Ricky (icorrect-kb PR #207, `DESIGN-SIGNOFF-2026-07-07.md`).

This folder is the signed-off **"Website - Collections"** design mould — the visual/UX fidelity reference for the OS 2.0 theme rebuild (WS-A). Build screens to match these; never free-design.

- `iCorrect Homepage.html`, `MacBook Screen Collection.html`, `MacBook Screen Repair - Product Page.html` = the three approved mould paths (desktop + mobile). `approved-renders/` = the exact renders Ricky signed off.
- **Reference only — NEVER ships.** These mockups use in-browser React/Babel (`text/babel`, `babel-standalone`), dev React, and `image-slot.js` — the confirmed **P0 prototype runtime**. Production hard-fails on those patterns; `design/**` is excluded from the prod scans precisely so this reference can live here.
- **Copy is NOT authoritative** — reconcile per `DESIGN-SIGNOFF-2026-07-07.md`: ship 719+/4.8 (not the mockups' 1,247/892), the verbatim £49 sentence, Shopify prices, "Book this repair" CTA, ruling-7 parts wording (drop "Apple authorised").

Mould source mirror: `~/marketing/website-redesign/design-handoff/`.
