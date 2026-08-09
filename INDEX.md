# icorrect-shopify-theme

**State:** active
**Owner:** arlo-website
**Purpose:** Primary Shopify theme repo for icorrect.co.uk — live theme code, analytics instrumentation, conversion / SEO / marketing briefs.
**Last updated:** 2026-05-02 (Phase 7a folder-standard rollout)

## Current state

### In flight
- no live state captured — needs population by owner agent (arlo-website)

### Recently shipped
- Theme repo last touched 2026-04-24 (per inventory)

### Next up
- See `briefs/` for unshipped specs and build plans (quote-wizard refresh, macbook landing pages, meta-pixel fix, page-speed, social-proof first-fold)

## Structure

- [`briefs/`](briefs/INDEX.md) — 7 unshipped specs/plans (quote-wizard architecture/build/fix, macbook landing build brief, meta-pixel fix, page-speed, social-proof). Sub-INDEX present.
- `decisions/` — empty — backfill in Phase 7c if useful
- [`docs/`](docs/INDEX.md) — canonical reference: changelog, marketing implementation notes, ga4/posthog/meta-capi status. Sub-INDEX present.
- `docs/audits/` — 12 historical audits (theme audit 2026-03-31, quote-wizard reviews, dead-click / posthog-error / marketing-jarvis audits). Has own INDEX.
- `archive/` — empty (existing `snapshots/` dir at root is a legacy snapshots store, left in place per "no code-dir restructuring" rule)
- `scratch/` — 2 stale HTML prototypes (`icorrect-quote-wizard-final.html`, `prototype-quote-flow.html`) — pending classification, ambiguous artifacts from early quote-wizard work
- `data/` — `Products.csv`, `collections.xlsx` (Shopify export data)
- `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`, `scripts/` — Shopify theme code (left as-is)
- `reports/` — pre-design baseline report (left as-is, single file)
- `snapshots/` — point-in-time JSON snapshots (left as-is)

## Key documents

### briefs/
- [`briefs/quote-wizard-architecture-v2.md`](briefs/quote-wizard-architecture-v2.md) — quote-wizard v2 architecture
- [`briefs/quote-wizard-build-plan.md`](briefs/quote-wizard-build-plan.md) — quote-wizard build plan
- [`briefs/quote-wizard-fix-plan.md`](briefs/quote-wizard-fix-plan.md) — quote-wizard fix plan
- [`briefs/macbook-landing-pages-build-brief.md`](briefs/macbook-landing-pages-build-brief.md) — MacBook landing pages
- [`briefs/meta-pixel-fix-brief.md`](briefs/meta-pixel-fix-brief.md) — Meta Pixel double-fire / missing-event fix
- [`briefs/page-speed-optimisation-brief.md`](briefs/page-speed-optimisation-brief.md) — page-speed for Meta ad landing pages
- [`briefs/social-proof-first-fold-brief.md`](briefs/social-proof-first-fold-brief.md) — first-fold social proof on collection / content pages

### docs/
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — theme changelog
- See [`docs/INDEX.md`](docs/INDEX.md) for the full list of marketing/posthog/ga4/meta-capi reference docs

### docs/audits/
- See [`docs/audits/INDEX.md`](docs/audits/INDEX.md) for 12 audit reports

## Open questions

- Reconcile `reports/` and `snapshots/` (legacy dirs) with the standard `archive/` pattern in a future hygiene pass.
- Are the two scratched HTML prototypes still useful, or can they move to `archive/2026-05-02-superseded/`? Needs arlo-website call.
