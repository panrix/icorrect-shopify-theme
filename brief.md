# Brief — issue #53 — Courier-first pivot (backend/plumbing slice)

**Ricky-named initiative: courier-first-pivot (2026-09-10/11).** Full spec + data + mockups are IN THIS BRANCH under `docs/courier-first-pivot/` and `data/gophr-london-bands-2026-09-10.json`. Read the spec first: `docs/courier-first-pivot/SPEC-courier-first-pivot-48h-2026-09-10.md`.

## Operational problem

Walk-in drop-off is being retracted business-wide (team cannot staff front-of-house post-Naheed; newco pivot to courier + mail-in only). The website currently sells walk-in as its primary service and has no courier pricing. Without this backend slice, the courier launch has no price data, no tier logic, and no booking automation — the September revenue defence (£4.5k/mo keep-rate) does not happen.

## Existing live state

Live theme: `panrix/icorrect-shopify-theme` main = production theme for icorrect.co.uk (Shopify store `i-correct-final`). Live quote wizard `sections/quote-wizard.liquid` offers Walk-in vs Collection&Delivery (flat £20 mail-in product). No postcode logic exists live. Band data source: live Gophr matrix pulled 2026-09-10 (396/396 quotes OK) at `data/gophr-london-bands-2026-09-10.json`. Monday exemplar: n/a for this slice (no Monday writes); Gophr exemplar: test draft job created then cancelled during the probe (evidence: dashboard screenshot in the probe report).

## Customer-facing text

No customer-facing text changes in this slice (backend only). The later UI slice's text is in `docs/courier-first-pivot/MOCKUPS-courier-first-2026-09-11.html` pending Ricky sign-off — do not pre-empt it.

## Must not happen

- No walk-in UI/copy changes in this slice.
- No deploy, no push to the live theme, no Shopify admin writes beyond reading product tags.
- No confirmed Gophr bookings — drafts only (`is_confirmed=0`), cancelled after evidence.
- No secrets in code/logs/commits — `GOPHR_API_KEY` by env reference only.
- No customer charges created or modified.

## Done-when

1. `assets/` (or equivalent theme include) exposes outward-code → band lookup generated from the band JSON, with a unit test or node script proving 5 sample postcodes across B1–B4 + one unknown code → mail-in fallback.
2. Tier helper maps a product's `courier:*` tag + band → customer courier price (free/subsidised/full rules per spec §B), with test evidence for all three tiers.
3. Gophr probe report committed at `docs/courier-first-pivot/GOPHR-WINDOW-PROBE-53.md`: the field that controls collection window on draft jobs, evidence screenshot reference, and the midnight-bug root cause.
4. Webhook design doc at `docs/courier-first-pivot/WEBHOOK-DESIGN-53.md`.
5. `git log` shows commits referencing #53 on `feat/courier-first-pivot`; nothing deployed.

## This slice: backend only (UI is a later slice, blocked on Ricky's mockup sign-off)

1. **Band lookup asset:** convert `data/gophr-london-bands-2026-09-10.json` (99 London outward codes → band B1–B4 + RT cost) into a theme-ready asset (JS/JSON include) exposing outward-code → band. Outward code = postcode prefix before the space, uppercased.
2. **Product tier tagging:** add `courier:free` / `courier:subsidised` / `courier:full` tag handling in the quote wizard's pricing logic (read-only helper now; UI wires in later). Tier map: repair ≥£250 → free; £150–249 → subsidised (half); <£150 → full. Silicon-MacBook diagnostics → free collect-only (half RT).
3. **Gophr window-field probe (research task, report back):** using the April discovery doc (`panrix/workshop-os: logistics/royal-mail-automation/docs/GOPHR-INTEGRATION-DISCOVERY-2026-04-24.md`) and `GOPHR_API_KEY` from env (never print/commit it), find the request field that makes a **draft** job (`is_confirmed=0`) show a correct collection window in the Gophr dashboard — not "deliver by midnight". Done-when: written report + screenshot evidence of a correct window on a test draft, then cancel the draft. No confirmed bookings.
4. **Order→Gophr draft webhook design doc** (no deploy): map Shopify `orders/paid` → courier line detection → draft job creation → Slack review card. Note where it lives (workshop-os intake-hub sibling) and what it needs.

## Rules
- Work in THIS worktree on branch `feat/courier-first-pivot`. Commits reference #53.
- Do NOT touch walk-in UI/copy yet (later slice). Do NOT deploy. Do NOT push to the live theme.
- No secrets in code. `GOPHR_API_KEY` by env reference only.
- Return: ~10-line summary + what landed where + what's blocked.
