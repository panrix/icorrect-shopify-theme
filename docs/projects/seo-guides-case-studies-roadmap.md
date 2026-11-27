# Project Brief: iCorrect SEO Technical Guides, Visual Case Studies, Anatomy Explainers & Theme Queue

**Repo:** `panrix/icorrect-shopify-theme` (with related diagram assets in `panrix/icorrect-design-system` and `panrix/workshop-os`)
**Owner:** Ricky Panesar
**Purpose:** Handoff and restart brief to move this work from ad-hoc chat into a structured Cursor / Linear Project.

---

## 1. Completed & Verified Live Baseline (Do Not Re-Do)

Both technical SEO and video-panel PRs completed adversarial QA review, achieved `VERDICT: GREEN`, merged to `main`, and were verified live on `icorrect.co.uk`:

- **[PR #140](https://github.com/panrix/icorrect-shopify-theme/pull/140) (`81c64eb`):**
  - Removed sitewide `aggregateRating` from `snippets/icorrect-localbusiness-schema.liquid` (eliminating rich-result spam risk).
  - Added Shopify's official `templates/agents.md.liquid` using `agents.*` variables so `https://icorrect.co.uk/llms.txt`, `https://icorrect.co.uk/agents.md`, and `https://icorrect.co.uk/llms-full.txt` natively serve iCorrect's Fitzrovia repair directory + live UCP/MCP discovery as `text/markdown; charset=utf-8` (no Cloudflare proxy needed, zero private contact leakage, zero 404s).
  - Updated `templates/page.llms-txt.liquid` with defensive checks so zero 404s appear before PR #141 pages exist in Shopify Admin.
  - Added `BreadcrumbList` JSON-LD for blog articles in `snippets/icorrect-seo-schema.liquid` (alongside Shopify's built-in `article | structured_data`, which emits `Article` JSON-LD in `sections/main-article.liquid`), plus device-first Dynamic Blog Repair CTAs (`sections/main-article.liquid`, `templates/article.json`) with `"Liquid Retina"` protection, title-over-tag precedence, and aligned turnaround copy.
- **[PR #142](https://github.com/panrix/icorrect-shopify-theme/pull/142) (`9dfe9f2`):**
  - Upgraded all 5 video panel sections across **82 live templates** (`sections/homepage-videos.liquid`, `macbook-videos.liquid`, `iphone-videos.liquid`, `ipad-videos.liquid`, `apple-watch-videos.liquid`) to click-to-play facades (`snippets/icorrect-video-panel.liquid` + `assets/icorrect-video-panel.js`): `0 KB` YouTube JS/cookies on initial load, native HD vertical Shorts covers (`oar2.jpg` with `hqdefault.jpg` fallback), WCAG AAA contrast on both dark `scheme-4` (77 of 82 templates) and light `scheme-2` (`#f3f3f3`, 5 of 82 templates), Theme Editor `request.design_mode` script loader in `layout/theme.liquid`, and keyboard focus handoff.
  - Tightened truncated SEO titles and meta descriptions in `layout/theme.liquid` for `/pages/macbook-repairs`, `/pages/iphone-repairs`, `/pages/advanced-diagnostic`, and `/collections/macbook-screen-repair-prices`.

### Held Separately (Do Not Touch From This Project)
- **[PR #141](https://github.com/panrix/icorrect-shopify-theme/pull/141) (`cursor/macbook-liquid-nopower-pages-8b7d`):** MacBook Liquid Damage & Dead / No Power pillar pages are currently with a separate Website UI agent.
  - **Post-publish follow-up (after PR #141 merges and pages are created in Shopify Admin):** `/pages/llms-txt` and blog CTAs will auto-link to `/pages/macbook-liquid-damage-repair` and `/pages/macbook-no-power-repair`; add those two verified URLs into `templates/agents.md.liquid` in a 2-line update.

---

## 2. Included Bug Fix in This PR (Item #2)

- **Bug found during live post-merge verification:** In `layout/theme.liquid`, the existing `#53` walk-in rewrite rule replaced `'Central London.'` with `'Courier collection across London, tracked mail-in nationwide.'`, leaving a dangling preposition (`"in Courier collection across London..."`) on **9 of 22 live blog articles** and **`/pages/how-it-works`**.
- **Fix included in this PR:** Added `| replace: ' in Central London.', ' with London courier collection or tracked UK mail-in.'` directly ahead of bare `'Central London.'` in `layout/theme.liquid`. All 10 affected live meta descriptions will read cleanly once deployed, with zero regressions to existing `#53` replacements.

---

## 3. Workstream A: Technical Repair Guides + Interactive Anatomy Explainers (Item #3a)

### Objective
Turn iCorrect's real Fitzrovia bench knowledge into clear, plain-English technical guides that explain **how Apple circuits actually fail and how component-level repair works**, aimed at normal customers searching high-intent faults.

### Reference Design & Existing Assets to Reuse
1. **Internal Anatomy Skill (`anatomy`):**
   - Core principle: **"The object is the explanation."** Build crafted, interactive isometric SVG figures that look like real physical bench instruments (with four-tone shading, true painter's order, live readouts, and calm eased motion) rather than generic boxes and arrows.
   - Verify every figure with `node build.mjs --audit` (`audit passed`, 0 geometry faults) and `lines.mjs` (`line ends: 0`) on desktop and 390px mobile in both light and dark themes.
2. **iCorrect Exploded Diagram Kit:**
   - Repo: `panrix/icorrect-design-system` ([PR #5](https://github.com/panrix/icorrect-design-system/pull/5), still open and unmerged; 174 SVG exploded device diagrams under `diagrams/svg/` for iPhone 16, iPad Air M2, MacBook Air M3, Apple Watch S10; preview at https://icorrect-diagram-kit.vercel.app).
   - Skill in `panrix/workshop-os`: `.cursor/skills/icorrect-diagrams`.
   - Existing theme assets: `docs/design/device-illustrations.md`, `sections/repair-illustration-specimen.liquid`, `assets/repair-diagram-*.svg`.

### First Flagship Guide: Dead / No Power MacBook (5V USB-C Explained Simply)
You have 22 live blog articles (including 1 liquid damage guide) and **zero dedicated Dead / No Power MacBook articles**.
- **Target searches:** `"MacBook Pro won't turn on London"`, `"MacBook not charging 5V USB-C"`, `"MacBook dead logic board repair data recovery"`.
- **Plain-English story structure:**
  1. **What happens when you plug in a USB-C charger:** Start at **5V** (handshake mode) before negotiating up to **20V** (full charging power).
  2. **Interactive Anatomy Figure ("The 5V vs 20V Bench Test Rig"):** Built with the `anatomy` skill as a real Fitzrovia bench instrument (USB-C power meter readout, `CD3217` USB-C controller gate, main power rail `PPBUS_G3H` on Intel / `PPBUS_AON` on Apple Silicon, shorted ceramic capacitor on the rail, and interactive toggle between **Fault: Stuck at 5V / 0.02A** and **Repaired: 20V Negotiated / 12.6V Rail Live**). Dumbs down microelectronics so any customer immediately understands why one tiny failed component stops a £2,000 MacBook from booting.
  3. **Apple Store vs Fitzrovia Micro-Soldering:** Why Apple swaps the whole logic board (erasing the soldered SSD and costing £700+) vs isolating and replacing the single failed component while keeping data intact.
  4. **Automatic funnel:** Today's live Dynamic Blog CTA automatically attaches the Dead / No Power MacBook CTA to this article.

### Follow-On Explainers (Same Playbook)
- MacBook Liquid Damage: how corrosion bridges power rails beneath BGA chips even after the keyboard feels dry (pair with ultrasonic cleaning explainer).
- MacBook Screen Repair (Panel Only vs Full Lid Assembly): exploded lid view showing original aluminium housing + camera + hinges preserved vs full-lid swap.
- iPhone Genuine OLED vs Cheap Aftermarket LCD: showing why copy LCDs draw excess backlight current and cause overheating (tying directly to existing YouTube bench Short `P6gIFwmokIQ`).

---

## 4. Workstream B: Visual Bench Case Studies From Existing Videos & Photos (Item #3b)

### Objective
Reuse iCorrect's large existing library of workshop videos (YouTube Shorts & bench recordings) and repair photos to build **real visual repair case studies** that publish in **two places from one structured story**:
1. **SEO Blog Posts (`/blogs/news/...`)** capturing long-tail model + fault searches (e.g. `"M1 MacBook Pro liquid damage Apple quoted £1000"`).
2. **Embeddable Proof Modules across service pages** (Liquid Damage, Dead / No Power, MacBook Repairs, iPhone Repairs, iPad Repairs, Apple Watch Repairs).

### Reusable Case Study Format
- **Visual stills extracted from existing workshop videos & bench photos:**
  - Frame 1: **The Intake / Fault** (microscope corrosion view, USB-C 5V meter reading, or damaged assembly).
  - Frame 2: **The Bench Fix** (ultrasonic clean / micro-soldering / genuine panel transfer).
  - Frame 3: **The Outcome** (booting MacBook with original data intact, cost saved vs Apple replacement quote, turnaround, 2-year warranty).
- **Structured data fields per case study:** Device & Model, Reported Fault, Apple Store Quote (where real), Root Cause Found on Bench, Repair Performed, Data Preserved (Yes/No), Turnaround, Related Video ID (click-to-play facade), and Primary Booking Link.
- **First 3 candidate case studies using footage already on the site:**
  1. Liquid-damaged M1 MacBook Pro where Apple quoted over £1,000 (video `6j_C-4PejV4`).
  2. Dead iPhone logic board data recovery where Apple said recovery was impossible (video `PEa5le-a5_g`).
  3. Dead iPad charging IC micro-soldering repair showing zero signs of life (video `-yFJAgPt7Z4`).

---

## 5. Workstream C: Google Search Console & Core Web Vitals Check (Item #4)

Run this checklist directly in Google Search Console and PageSpeed Insights (no theme code needed):

1. **Re-submit Sitemap:** In Google Search Console for `icorrect.co.uk`, re-submit `https://icorrect.co.uk/sitemap.xml` so Google recrawls the updated theme cleanly.
2. **Verify Structured Data (Zero Errors):**
   - Inspect `https://icorrect.co.uk/`, `/pages/macbook-repairs`, `/pages/advanced-diagnostic`, and a live blog article in URL Inspection + Rich Results Test.
   - Confirm `aggregateRating` is gone, `BreadcrumbList` (from `snippets/icorrect-seo-schema.liquid`) and `Article` (from Shopify's `article | structured_data` in `sections/main-article.liquid`) validate cleanly, and zero Search Console warnings appear.
3. **Measure Core Web Vitals Gain (82 Video Panel Pages):**
   - Run PageSpeed Insights (Mobile + Desktop) on `https://icorrect.co.uk/`, `https://icorrect.co.uk/pages/macbook-repairs`, and `https://icorrect.co.uk/pages/iphone-repairs`.
   - Record before/after LCP, INP, Total Blocking Time, and third-party JS payload saved from removing the 3 eager YouTube iframes.
4. **Verify Live AI Discovery Endpoints:**
   - Confirm `https://icorrect.co.uk/llms.txt` and `https://icorrect.co.uk/agents.md` return `200 OK` (`text/markdown`) with updated iCorrect directory + UCP endpoints.

---

## 6. Workstream D: Open Theme PR Queue Triage (Item #5)

Suggested triage for tracked PRs in `panrix/icorrect-shopify-theme` (all work and merges still follow `CLAUDE.md` dispatch, the 7-point ready-to-build check, the independent pinned-commit QA gate, and Ricky's GO where required):

| PR | Branch | Summary | Suggested Next Step |
| --- | --- | --- | --- |
| [#133](https://github.com/panrix/icorrect-shopify-theme/pull/133) | `cursor/trustindex-google-reviews-b186` | Replace homepage mock Google reviews with live Trustindex widget | Rebase on `main`, verify Vercel preview + screenshots, run independent QA gate, await sign-off (high trust signal on homepage) |
| [#135](https://github.com/panrix/icorrect-shopify-theme/pull/135) | `fix/hide-draft-products` | Hide drafted repairs and models from the quote wizard | Merged to `main` (`b501cc6`); verify live |
| [#137](https://github.com/panrix/icorrect-shopify-theme/pull/137) | `cursor/gro-1-wizard-confirm-charged-copy-0775` | Quote wizard & theme fixes (cookie banner, confirm modal, mobile CTA + sticky bar, copy fixes) | Merged to `main` (`923e8be`); verify live and check any remaining overlap with #138/#139 |
| [#138](https://github.com/panrix/icorrect-shopify-theme/pull/138) / [#139](https://github.com/panrix/icorrect-shopify-theme/pull/139) | `cursor/ico-11-macbook-screen-preview-8b7d` / `cursor/ico-146-quote-wizard-redesign-preview` | Quote wizard UI redesign previews | Keep preview-only or consolidate with Website UI agent |
| [#141](https://github.com/panrix/icorrect-shopify-theme/pull/141) | `cursor/macbook-liquid-nopower-pages-8b7d` | MacBook Liquid Damage & Dead/No Power pillar pages | Held with Website UI agent; merge after UI sign-off |

---

## 7. Suggested Execution Plan When Restarting as a Project

1. **First:** Land this PR after independent QA sign-off and merge approval so the `"in Courier collection"` meta grammar bug is fixed on 10 live URLs once deployed.
2. **Parallel Track 1 (Anatomy Builder):** Build the interactive **5V vs 20V USB-C Dead MacBook Bench Rig** figure using the internal `anatomy` skill + publish the Dead / No Power MacBook technical guide.
3. **Parallel Track 2 (Case Studies Builder):** Extract stills from the 3 existing YouTube bench videos (`6j_C-4PejV4`, `PEa5le-a5_g`, `-yFJAgPt7Z4`), build the reusable Shopify `case-study-strip` section + 3 structured case study blog articles.
4. **Parallel Track 3 (PR Hygiene + GSC):** Run Workstream C (GSC sitemap resubmit + PageSpeed Insights baseline) and route [#133](https://github.com/panrix/icorrect-shopify-theme/pull/133) through standard dispatch, preview checks, and independent QA review.
5. **SOP & QA Guardrails (per `CLAUDE.md`):** Route changes through standard dispatch and the 7-point ready-to-build check, test UI work on a Vercel preview with screenshots, pass the independent pinned-commit QA gate (Terra / dedicated QA reviewer) before merge, obtain Ricky's GO where required, never touch `.env`/nginx/secrets, use zero em dashes, and verify live pages after deploy.
