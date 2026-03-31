# Shopify Theme Audit

**Date:** 2026-03-31
**Reviewer:** Codex
**Scope:** Global Shopify theme audit across layout, sections, snippets, assets, config, and repo hygiene
**Repo:** `panrix/icorrect-shopify-theme`
**Branch reviewed:** Initial pass on `feature/trust-bar`, validation and follow-up on `main`
**Status:** Living audit document; source inspection extended on `main`, local follow-up fixes in progress

## Summary

This first audit pass focused on the highest-risk areas of the current theme build: repo security, global layout behavior, analytics, contact capture flows, the custom quote wizard, third-party dependencies, structured data, and accessibility-sensitive custom sections.

The main findings from this pass are:

1. A GitHub personal access token is stored directly in the repo's configured `origin` remote.
2. Customer data is injected into inline JavaScript without safe JSON escaping.
3. Global contact form interception replaces Shopify's native submission path and makes lead capture dependent on a third-party webhook.
4. The interceptor renders upstream error text with `innerHTML`, creating an XSS risk if the webhook returns unsafe content.
5. The quote wizard clears existing cart contents before checkout, which is destructive to mixed-cart user journeys.
6. jQuery and Slick are loaded sitewide for a narrow custom use case, and theme fonts are preloaded twice.
7. Some JSON-LD output is fragile or invalid because of blank social URLs and outdated schema context URLs.
8. The custom video reviews section has avoidable accessibility and markup problems.

## Audit Scope

This pass reviewed:

- Global layout and asset loading in `layout/theme.liquid`
- Theme-wide analytics and tracking setup
- Contact and corporate lead capture flows
- Custom quote wizard behavior
- Structured data output
- Selected custom sections with higher behavioral or accessibility risk
- Git remote and repo hygiene relevant to operational security

This pass did not include:

- Browser-based QA
- Lighthouse or Core Web Vitals measurement
- Shopify Theme Check execution
- Visual regression testing
- End-to-end submission testing against live external services

## Findings

### 1. GitHub PAT stored in repo remote configuration

- Severity: Critical
- Risk: The configured `origin` remote contains an embedded GitHub personal access token, which can leak through command output, shell history, screenshots, or local config access.
- Evidence: [.git/config](/home/ricky/builds/icorrect-shopify-theme/.git/config#L6)
- Notes: This is an operational security issue rather than a storefront rendering issue, but it is severe enough to treat as the top finding.
- Recommended action:
  - Rotate the exposed token immediately.
  - Replace the remote URL with a tokenless HTTPS URL or SSH remote.
  - Check whether the token was copied into any scripts, CI variables, or shell history.

### 2. Unsafe Liquid interpolation inside inline JavaScript

- Severity: High
- Risk: Customer-controlled data is inserted into JavaScript string literals without JSON encoding, which can break analytics initialization or allow script injection if quotes are present in the value.
- Evidence: [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L335)
- Affected code path:
  - `posthog.identify('{{ customer.email }}', { ... name: '{{ customer.name }}' ... })`
- Expected behavior: Liquid values rendered into JavaScript should use `| json` so the browser receives valid JS string literals in all cases.
- Recommended action:
  - Replace direct string interpolation with JSON-encoded values.
  - Review other inline scripts for the same pattern.

### 3. Global contact interception removes Shopify fallback behavior

- Severity: High
- Risk: Contact forms are forcibly rerouted to `n8n`, and native Shopify contact posting is disabled. If the webhook is unavailable or blocked, lead capture fails instead of degrading gracefully.
- Evidence:
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L59)
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L72)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L435)
  - [contact-form.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-form.liquid#L384)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L462)
  - [icorrect-landing.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/icorrect-landing.liquid#L475)
- Notes:
  - The interceptor changes form actions to `javascript:void(0);`
  - It prevents default submission and stops propagation
  - It is loaded globally, not only on one page
- Recommended action:
  - Preserve a safe fallback to Shopify contact submission if the webhook request fails.
  - Restrict interception to the exact forms that truly need it.
  - Consider server-side routing or progressive enhancement instead of hard replacement.

### 4. Interceptor error rendering is vulnerable to unsafe HTML injection

- Severity: Medium
- Risk: Webhook error text is inserted into the page using template-literal `innerHTML`. If upstream error content is not sanitized, this creates a reflected XSS path on contact pages.
- Evidence:
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L209)
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L284)
- Expected behavior: Upstream messages should be written via `textContent` or safely escaped before rendering.
- Recommended action:
  - Stop injecting raw error text into HTML.
  - Build the error banner with DOM nodes and `textContent`.

### 5. Quote wizard checkout flow clears existing carts

- Severity: Medium
- Risk: A customer with unrelated items in cart is asked to replace the cart entirely before booking a repair. This is destructive behavior and may reduce conversion or create support issues.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1681)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1691)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1716)
- Notes:
  - The warning is explicit, so this is not silent data loss.
  - It is still a product decision with conversion risk and should be documented as such.
- Recommended action:
  - Decide whether repairs must always run through isolated checkout.
  - If yes, consider a dedicated booking flow instead of mutating the main cart.
  - If no, redesign the flow so repair booking coexists with normal cart contents.

### 6. Global asset loading is heavier than necessary

- Severity: Medium
- Risk: Sitewide jQuery and Slick loading adds avoidable JavaScript and CSS cost to every page, even though the dependency appears to be for a narrow custom carousel use case.
- Evidence:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L42)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L56)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L57)
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L145)
- Additional note: theme fonts are preloaded twice in the same layout file.
- Evidence for duplicated preloads:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L18)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L21)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L288)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L293)
- Recommended action:
  - Load carousel assets only on sections that need them.
  - Remove duplicate font preloads.
  - Review third-party asset loading strategy at the layout level.

### 7. Structured data output is brittle

- Severity: Medium
- Risk: Some JSON-LD output can become invalid or low-quality because the schema context uses `http://schema.org` and the `sameAs` array includes blank values.
- Evidence:
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L579)
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L648)
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L656)
  - [settings_data.json](/home/ricky/builds/icorrect-shopify-theme/config/settings_data.json#L114)
- Notes:
  - The custom collection/page schema in `snippets/icorrect-seo-schema.liquid` is generally better formed and already uses `https://schema.org`.
- Recommended action:
  - Update legacy schema contexts to `https://schema.org`.
  - Filter `sameAs` to only include non-blank URLs.
  - Validate the final JSON-LD output with a structured-data validator during follow-up work.

### 8. `video-reviews` section has accessibility and markup defects

- Severity: Medium
- Risk: Social icons and fallback review images lack meaningful alt text, and the video markup uses boolean attributes in a misleading way.
- Evidence:
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L9)
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L20)
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L24)
- Notes:
  - `autoplay="false"`, `loop="true"`, `controls="true"`, and `muted="true"` are not reliable authoring patterns for HTML boolean attributes.
  - The section also depends on globally loaded jQuery/Slick.
- Recommended action:
  - Add proper alt text or explicitly mark decorative imagery as decorative.
  - Normalize video markup to valid boolean attribute usage.
  - Consider replacing the jQuery carousel implementation with theme-native JS.

## Supporting Notes

### Global third-party dependencies observed

- jQuery from `code.jquery.com`
- Google Analytics via `googletagmanager.com`
- PostHog
- `n8n` webhook endpoint at `icorrect.app.n8n.cloud`
- Multiple hardcoded CDN-hosted images and assets

These dependencies are not automatically wrong, but they increase the number of external points of failure and should be reviewed in later audit passes.

### Quote wizard status

The quote wizard remains the single largest custom implementation in the theme and should receive a dedicated second pass after this general audit. It already has separate docs in the repo, but it is still a material part of the broader theme risk profile.

## Limitations Of This Pass

- No browser testing was performed.
- No live form submissions were tested against external services.
- No local Shopify CLI or Theme Check run was possible in this environment.
- Findings are based on source inspection and code-path review, not live storefront telemetry.

## Recommended Remediation Order

1. Remove and rotate the GitHub PAT from repo configuration.
2. Fix unsafe Liquid-to-JavaScript interpolation in global analytics code.
3. Restore a safe fallback path for contact forms when webhook delivery fails.
4. Remove raw HTML injection from webhook error rendering.
5. Review the quote wizard cart strategy and decide whether destructive cart replacement is acceptable.
6. Reduce sitewide dependency loading and remove duplicate font preloads.
7. Repair structured data output and validate it.
8. Clean up accessibility issues in custom media sections.

## Follow-Up Backlog

- Run a second-pass audit focused on:
  - performance
  - accessibility
  - SEO
  - maintainability
  - quote wizard behavior
- Add browser-based validation for highest-risk flows.
- Convert this document into a living audit log with status updates per finding.

## Quote Wizard Deep Dive

### Overview

The quote wizard is the largest custom implementation in the theme and currently lives as a single inline section file at [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1). The file is 2879 lines long and contains:

- Liquid data bootstrapping
- Inline JavaScript application logic
- Inline CSS
- fetch-based catalog lookups
- cart mutation and checkout redirect logic
- webhook submission logic
- PostHog tracking
- custom helper flows for iPhone and MacBook model identification

This makes the wizard high leverage, but also means defects in the section can affect conversion, lead capture, pricing accuracy, and maintainability more than a typical content section.

### Existing Wizard Review History

The repo already contains wizard-specific QA work that should be treated as part of the audit record:

- [quote-wizard-audit.md](/home/ricky/builds/icorrect-shopify-theme/docs/quote-wizard-audit.md)
- [quote-wizard-qa-review-2026-03-23.md](/home/ricky/builds/icorrect-shopify-theme/docs/quote-wizard-qa-review-2026-03-23.md)
- [quote-wizard-re-qa-2026-03-25.md](/home/ricky/builds/icorrect-shopify-theme/docs/quote-wizard-re-qa-2026-03-25.md)
- [quote-wizard-preview-qa-checklist-2026-03-23.md](/home/ricky/builds/icorrect-shopify-theme/docs/quote-wizard-preview-qa-checklist-2026-03-23.md)

Those docs show that four important findings were already identified and then confirmed in code review:

1. Cart contamination was addressed by `ensureCleanWizardCart()`.
2. Lossy SKU resolution was addressed by explicit repair-type and handle preference logic.
3. False-positive webhook success was addressed by checking real HTTP and JSON success conditions.
4. The `A2338` helper ambiguity was addressed by matching full configured model names.

Evidence in current code:

- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L757)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1679)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1976)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1408)

That prior work appears real and should not be lost. The goal of this section is to document the remaining wizard risk after those fixes.

### Current Wizard Architecture

At a high level, the wizard works as a client-side app embedded inside a Liquid section:

1. Liquid exports model lists, page context, customer info, and service product config into global `window.WIZARD_*` objects.
2. The client script uses collection handles and product handles to fetch collection JSON and product JSON from the storefront.
3. Available faults and issues are derived from naming conventions in product handles and a route map in the section.
4. Resolution cards build repair, diagnostic, dismiss, or contact outcomes dynamically.
5. Booking uses `cart/add.js` plus optional service add-ons, then redirects to `/checkout`.
6. Contact questions and quote emails are sent to the external webhook.

Key entry points:

- Data bootstrapping: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L12)
- Collection fetch: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L722)
- Product resolution: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L757)
- Resolution rendering: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1746)
- Booking flow: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1702)
- Webhook flow: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1976)

### Quote Wizard Flow Walkthrough

The current user flow is more structured than a simple “choose a repair” widget. It works like this:

1. Bootstrap:
   - Liquid exports `window.WIZARD_MODELS`, `window.WIZARD_CONTEXT`, `window.WIZARD_CUSTOMER`, and `window.WIZARD_CFG`.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L12)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L61)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L86)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L94)

2. Initial state selection:
   - `initPrefill()` decides whether to start from a product page, collection page, device metafield context, or a fresh step-1 start.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2340)

3. Device selection:
   - The wizard renders device cards and records the chosen device in local state.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1082)

4. Model selection:
   - Models are grouped from Shopify navigation linklists.
   - Selecting a model triggers a collection JSON fetch and builds an availability map from the returned products.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1124)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1178)

5. Fault filtering:
   - Available fault cards are not static. They are derived from the fetched repair-product set for the selected model collection.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L815)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1446)

6. Issue routing:
   - The wizard uses the large `TS` triage map to decide whether a selected issue leads to `repair`, `diagnostic`, `contact`, or `dismiss`.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L490)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1525)

7. Resolution rendering:
   - The selected issue renders one of four endpoint cards:
     - direct repair booking
     - diagnostic booking
     - contact form
     - dismissal to Apple Support
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1746)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1761)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1825)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1917)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1932)

8. Booking path:
   - For repair and diagnostic routes, the wizard builds cart items, optionally adds service variants, checks the existing cart, clears it if confirmed, adds items, and redirects to checkout.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1599)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1679)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1702)

9. Lead-capture path:
   - For questions and emailed quotes, the wizard posts structured payloads to the `n8n` webhook and only shows success after a confirmed response.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1951)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1976)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2232)

10. Navigation and analytics:
   - Step changes push browser history state, progress dots are clickable, breadcrumbs are clickable, and abandonment/resolution/conversion events are sent to PostHog.
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1029)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1051)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1068)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2409)

### Quote Wizard Flow Risk Concentration

The wizard is not risky because it has many steps. It is risky because several distinct responsibilities are compressed into one path:

1. Catalog resolution:
   - The selected model immediately becomes a storefront collection lookup.
   - The returned products are then transformed into a repair availability map.
   - Any collection mismatch, fetch failure, or naming drift changes what the user sees as “available repairs.”

2. Triage resolution:
   - The chosen fault does not directly determine the outcome.
   - The issue list is routed through the `TS` map into one of four endpoint types: `repair`, `diagnostic`, `contact`, or `dismiss`.
   - That means the real “business logic” lives in the issue map, not in the visual step order.

3. Commerce resolution:
   - A `repair` or `diagnostic` route becomes a cart mutation flow, not just a lead form.
   - The wizard is therefore responsible for product resolution, variant resolution, service add-ons, cart conflict handling, and checkout attribution.

4. Lead-capture resolution:
   - A `contact` or emailed quote route becomes webhook delivery.
   - This means the same front-end app owns both checkout-bound and webhook-bound conversion paths.

5. Context-prefill resolution:
   - On product and collection pages, the wizard can skip earlier steps entirely.
   - This improves user speed when it works, but it also means some flows exercise a materially different code path than a cold start from step 1.

The practical implication is that preview QA should not treat “the quote wizard” as one path. It should be tested as a matrix:

1. cold start vs prefill start
2. repair vs diagnostic vs contact vs dismiss route
3. successful fetch/webhook/cart path vs degraded path
4. forward navigation vs breadcrumb/back navigation

### Residual Findings

#### QW-1. Wizard is too large and too inline for safe maintenance

- Severity: Medium
- Risk: The wizard is implemented as a 2879-line section that mixes Liquid, JS, and CSS in one file. This raises regression risk, makes review difficult, reduces cacheability, and increases the chance that small changes break unrelated logic.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2439)
- Notes:
  - The current file contains both the application logic and the full presentation layer.
  - This is a maintainability risk more than an immediate bug, but it is material.
- Recommended action:
  - Split JS and CSS into dedicated assets.
  - Keep Liquid focused on data output and section markup.
  - Add a small architecture note describing the wizard data flow.

#### QW-2. Collection and product resolution is still naming-convention dependent

- Severity: Medium
- Risk: The wizard derives repair types from product handle suffixes. If naming conventions drift, products can silently disappear from the flow or resolve incorrectly.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L715)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L733)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L815)
- Notes:
  - The current logic is deterministic, which is good.
  - It is still brittle because the contract between catalog data and wizard behavior is encoded in handle patterns instead of explicit structured data.
- Recommended action:
  - Move repair-type mapping toward explicit metafields or a controlled registry.
  - Add a validation script or QA checklist that flags products missing expected handle patterns.

#### QW-3. Collection fetch is capped at 250 products and silently degrades on failure

- Severity: Medium
- Risk: Model pricing availability is driven by `/collections/<handle>/products.json?limit=250`. If a collection exceeds that size, or if the fetch fails, the wizard silently behaves as though pricing does not exist.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L725)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L730)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1178)
- Notes:
  - This is especially risky because the fallback user message reads like a catalog state, not an error state.
  - Operational failures and genuine “no pricing” states are conflated.
- Recommended action:
  - Differentiate fetch failure from true no-availability states in the UI and logs.
  - Review whether any repair collections are near or above the 250-product cap.
  - Add instrumentation for collection fetch failure rates.

#### QW-4. Express turnaround detection is based on scraping rendered HTML

- Severity: Medium
- Risk: The fast-turnaround option is inferred by fetching the product page HTML and parsing for DOM markers and regex matches. Any template markup change can silently break pricing or variant detection.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L974)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L987)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L997)
- Notes:
  - The comment calls this “Zero maintenance,” but this is actually a fragile coupling to rendered HTML.
  - It is workable in the short term, but should be tracked as technical debt.
- Recommended action:
  - Replace DOM scraping with explicit data in Liquid, metafields, or product JSON.
  - Add a preview QA test specifically for fast-turnaround pricing and variant IDs.

#### QW-5. Error handling remains user-friendly but operationally opaque

- Severity: Medium
- Risk: Several failure paths surface generic messages to users but do not distinguish configuration errors, fetch failures, missing products, or webhook issues in a way that supports rapid diagnosis.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1415)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1682)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1739)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2002)
- Notes:
  - The user experience is mostly polite.
  - The operational problem is that genuine failures may be misread as catalog gaps or transient UX issues.
- Recommended action:
  - Add structured error logging for collection fetch, product fetch, cart add, and webhook submission failures.
  - Distinguish “not configured yet” from “could not load right now” in customer-facing copy.

#### QW-6. The wizard introduces an extra third-party font dependency inside the section

- Severity: Low-Medium
- Risk: The section loads DM Sans directly from Google Fonts, creating an extra external dependency and making the wizard styling less aligned with the theme’s core typography system.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L7)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2452)
- Notes:
  - This is not a functional defect.
  - It does increase external dependency count and creates one more place where typography is managed outside theme settings.
- Recommended action:
  - Decide whether the wizard should inherit theme typography or move its font to a globally managed asset strategy.

#### QW-7. Back-navigation state restoration appears partial rather than full

- Severity: Medium
- Risk: The wizard uses `history.pushState()` and a `popstate` handler, but the back-navigation logic restores only part of the state and mainly toggles visible step containers. That creates a risk of stale UI, stale selections, or inconsistent breadcrumbs when a user navigates backward mid-flow.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1029)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1051)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2319)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2409)
- Notes:
  - This is an inference from the code path and should be verified in live preview.
  - `popstate` resets `S.issue` to `null`, but it does not clearly rebuild the downstream UI for the target step.
- Recommended action:
  - Re-test browser back, wizard back buttons, and breadcrumb navigation in preview.
  - Prefer explicit rerendering from canonical state instead of step-only DOM toggling.

#### QW-8. Prefill behavior depends on accurate collection membership and metafield context

- Severity: Medium
- Risk: Product-page and collection-page prefills depend on the current product belonging to the expected repair-prices collection or carrying the right contextual metafields. If that relationship drifts, the wizard falls back to weaker defaults.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2344)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2355)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2376)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2389)
- Notes:
  - The fallback behavior is sensible, but it can hide catalog/config drift.
  - This matters because the prefill path is part of the landing-page SEO-to-conversion journey.
- Recommended action:
  - Add a QA check that confirms product pages prefill the intended device, model, and fault.
  - Consider logging or flagging cases where product context cannot resolve to a configured model.

### Quote Wizard Strengths In Current Build

Not everything in the wizard is a problem. The current implementation has several positive traits worth preserving:

- The page context and customer prefill use JSON-safe Liquid output in the wizard bootstrap layer.
- The product resolution logic is more deterministic than a naive collection-order approach.
- Webhook success handling is materially better than a fire-and-forget `no-cors` pattern.
- The MacBook helper ambiguity for `A2338` appears to have been addressed correctly.
- The booking flow warns before cart replacement instead of silently mixing carts.

Evidence:

- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L64)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L88)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L757)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1976)
- [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1688)

### Quote Wizard Follow-Up Audit Tasks

The next pass on the wizard should answer these questions with live preview testing:

1. Do all high-volume model collections stay below the 250-product JSON cap?
2. Does fast-turnaround detection still work if the product template changes slightly?
3. Are any valid repair products missing because handle suffixes do not match the wizard map?
4. Do fetch failures and webhook failures generate enough telemetry to diagnose real production issues?
5. Is cart replacement still the intended product decision for mixed-basket users?

### Quote Wizard Recommended Next Actions

1. Keep the existing prior QA docs, but treat this section as the high-level source of truth inside the main theme audit.
2. Run live preview QA against the existing wizard checklist before any broad wizard refactor.
3. Refactor the wizard into section markup plus asset-backed JS/CSS.
4. Replace HTML scraping and handle-pattern dependency with more explicit data contracts where possible.
5. Add operational logging so “missing pricing” and “load failure” are not confused.

### Quote Wizard PostHog Validation

Ferrari's PostHog review was directionally useful, but the current branch inspected in this audit did not fully match the claimed fixed state. The live source inspection showed that:

- step dedup logic was not present in the current branch
- `repairType` was still missing from the key PostHog events
- the prefill path still skipped the step-4 tracking event
- browser `popstate` still bypassed any tracking dedup reset

Those gaps have now been patched locally in [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L482).

#### PostHog changes now applied locally

1. Added wizard step dedup/reset state via `_trackedSteps`
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L483)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L487)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1068)

2. Added shared payload construction so `route` and `repairType` travel with the tracked events
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L498)

3. Added step-4 tracking for the prefill path
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1224)

4. Added `repairType` to `wizard_resolution`
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1793)

5. Added `repairType` to `wizard_conversion` events for:
   - booking repair
   - booking diagnostic
   - contact submission
   - email quote
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1865)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1957)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2126)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2312)

6. Added dedup reset for browser back navigation
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2461)

7. Added `wizard_entry` tracking with `entrySource`
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L554)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2494)

8. Added explicit collection and product fetch failure events
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L808)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L900)

9. Added cart replacement confirm/cancel events
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1807)
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1813)

10. Added post-resolution abandonment tracking
   - Evidence:
     - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2583)

#### PostHog items still worth monitoring

- The dustgate/flexgate sub-question path can still produce multiple `wizard_resolution` events in a single journey because it can resolve once to the original issue and once to the final rerouted repair path. That may be acceptable, but it should be understood in the dashboard.
- Step numbering is still historically odd:
  - `2` means device picked
  - `3` means model picked
  - `4` means fault picked
  - `resolution` means issue picked
- The new operational events will only be useful if dashboards and saved insights are updated to consume them.

#### Recommended PostHog next steps

1. Validate the new event payloads in preview before merging.
2. Confirm the dashboard and any saved insights are not filtering out the new `repairType`, `entrySource`, and failure-event properties.
3. Decide whether fetch failure events should trigger alerts or just support exploratory analysis.

### Quote Wizard Current Event Map

The current event model is now more coherent than it was, but it is still important to document what each event actually means:

1. `wizard_step`
   - Fired once per tracked step progression in the current session state.
   - Current numbering is historical, not literal UI numbering:
     - `2` = device chosen
     - `3` = model chosen
     - `4` = fault chosen
     - `resolution` = issue chosen / resolution shown

2. `wizard_resolution`
   - Fired when the selected issue resolves to a route card.
   - Now includes `route` and `repairType`.
   - Can fire more than once in a single journey when a sub-question reroutes the issue.

3. `wizard_conversion`
   - Fired on the action click for:
     - repair booking
     - diagnostic booking
     - question form submission
     - emailed quote submission
   - Now includes `route` and `repairType`, which makes route-level conversion analysis materially easier.

4. `wizard_abandoned`
   - Fired on `beforeunload` only when the user progressed beyond step 1 and has not yet selected an issue.
   - This means it is currently an early-funnel abandonment event, not a full-funnel abandonment event.

5. `wizard_entry`
   - Fired once on initial wizard load.
   - Current values:
     - `fresh`
     - `product`
     - `collection`
     - `device_context`

6. `wizard_collection_fetch_failed`
   - Fired when collection JSON lookup fails.
   - Intended to distinguish operational load failure from genuine “no pricing” catalog states.

7. `wizard_product_fetch_failed`
   - Fired when product JSON lookup fails after retry.
   - Intended to expose silent failures in product resolution and pricing-card rendering.

8. `wizard_cart_replace_confirmed` and `wizard_cart_replace_cancelled`
   - Fired around the cart replacement confirmation dialog.
   - These events make the destructive-cart decision measurable instead of implicit.

9. `wizard_resolution_abandoned`
   - Fired when a resolution was shown but no downstream conversion occurred before unload.
   - This closes the biggest analytics gap in the prior event model.

### Quote Wizard Additional Tracking Backlog And Status

If the goal is “the more data the better,” the next instrumentation layer should focus on operational visibility, not just funnel counts:

#### PH-1. Collection/product fetch failure events

- Severity: Medium
- Status: Implemented locally on `main`
- Risk: Missing pricing and load failure were previously hard to separate in downstream analysis.
- Recommended action:
  - Validate that failure events appear in preview with the expected `collectionHandle`, `productHandle`, and coarse failure reason.

#### PH-2. Prefill source event

- Severity: Low-Medium
- Status: Implemented locally on `main`
- Risk: Cold-start and context-prefilled journeys were previously blended together.
- Recommended action:
  - Confirm saved funnels and breakdowns use `entrySource`.

#### PH-3. Cart replacement confirmation/cancellation events

- Severity: Medium
- Status: Implemented locally on `main`
- Risk: Booking clicks were previously visible, but the cart-replacement decision itself was not measurable.
- Recommended action:
  - Review how often mixed-cart users abandon at this step before deciding whether the product behavior is acceptable.

#### PH-4. Post-resolution abandonment event

- Severity: Medium
- Status: Implemented locally on `main`
- Risk: Users who reached a resolution card and then left were previously invisible as a distinct drop-off class.
- Recommended action:
  - Validate that the event is not overfiring in the dustgate/flexgate reroute path.

## SEO Deep Dive

### Overview

The theme has a large SEO surface area:

- one global layout
- many targeted collection templates
- many targeted service/landing page templates
- custom JSON-LD in two places
- custom homepage title behavior

That means small metadata defects can scale across a large number of URLs.

Template footprint evidence:

- [templates](/home/ricky/builds/icorrect-shopify-theme/templates)

### SEO Findings

#### SEO-1. Homepage title is hardcoded in the layout

- Severity: Medium
- Risk: The homepage title is hardcoded in the layout instead of being derived from configurable SEO fields. That reduces editorial flexibility and makes future title experimentation or store-level updates harder.
- Evidence:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L25)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L27)
- Notes:
  - This may be intentional for SEO targeting.
  - Even if intentional, it should be documented because it bypasses the normal page-title pattern used elsewhere.
- Recommended action:
  - Decide whether the hardcoded homepage title is an explicit SEO strategy.
  - If yes, document ownership and review cadence.
  - If no, move to a configurable or data-driven title strategy.

#### SEO-2. Standard meta description tag only renders when `page_description` exists

- Severity: Medium
- Risk: The theme outputs the standard HTML meta description only when `page_description` is present. Pages without a set description fall back for Open Graph, but not for the main `meta name="description"` tag.
- Evidence:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L36)
  - [meta-tags.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/meta-tags.liquid#L5)
- Notes:
  - Social metadata has a fallback path.
  - Standard search metadata does not.
- Recommended action:
  - Decide on a fallback strategy for missing meta descriptions.
  - Audit high-value templates and landing pages for missing `page_description`.

#### SEO-3. Open Graph primary image uses `http:` instead of `https:`

- Severity: Medium
- Risk: The primary `og:image` tag is emitted with an `http:` URL while `og:image:secure_url` is emitted separately as `https:`. This is unnecessary and can create inconsistent crawler behavior.
- Evidence:
  - [meta-tags.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/meta-tags.liquid#L23)
  - [meta-tags.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/meta-tags.liquid#L24)
- Recommended action:
  - Emit the primary `og:image` as `https:` as well.

#### SEO-4. JSON-LD in the header still uses `http://schema.org`

- Severity: Medium
- Risk: The header emits JSON-LD using `http://schema.org` rather than `https://schema.org`. Most parsers will still understand it, but it is outdated and inconsistent with the custom schema snippet already used elsewhere.
- Evidence:
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L579)
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L648)
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L675)
  - [icorrect-seo-schema.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/icorrect-seo-schema.liquid#L41)
- Recommended action:
  - Normalize all JSON-LD to `https://schema.org`.

#### SEO-5. `sameAs` emits blank social URLs

- Severity: Medium
- Risk: The Organization schema always outputs a `sameAs` array, even when most social URLs are blank. That can invalidate or weaken the schema block.
- Evidence:
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L656)
  - [settings_data.json](/home/ricky/builds/icorrect-shopify-theme/config/settings_data.json#L114)
- Recommended action:
  - Filter `sameAs` to include only populated URLs.

#### SEO-6. Review counts and ratings are hardcoded in multiple schema blocks

- Severity: Medium
- Risk: The theme hardcodes `ratingValue` and `reviewCount` inside structured data. If the real review profile changes, the markup becomes stale and potentially misleading.
- Evidence:
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L616)
  - [icorrect-seo-schema.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/icorrect-seo-schema.liquid#L61)
- Notes:
  - The problem is not only that the values are static.
  - The values are duplicated in more than one place, which increases drift risk.
- Recommended action:
  - Centralize rating data or remove it unless there is a reliable update path.

#### SEO-7. Schema strategy is split across multiple sources and may drift

- Severity: Medium
- Risk: Sitewide schema comes from the header, while collection/page service schema comes from a separate snippet. This is workable, but it increases the chance of duplicated or inconsistent business metadata over time.
- Evidence:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L326)
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L577)
  - [icorrect-seo-schema.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/icorrect-seo-schema.liquid#L7)
- Recommended action:
  - Document which file owns which schema type.
  - Reduce duplicated business metadata where possible.

### SEO Template Family Pass

The template scan shows that the biggest SEO risks now are not only in global metadata. They also sit in how individual template families are assembled.

#### SEO-8. Multiple-H1 patterns exist across key page and product templates

- Severity: Medium
- Risk: Several custom page and product templates appear to render more than one H1-equivalent heading block. That weakens document structure and makes heading intent less clear on high-value landing pages.
- Evidence:
  - [product.macbook-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.macbook-product-template.json#L160)
  - [product.macbook-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.macbook-product-template.json#L244)
  - [product.iphone-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.iphone-product-template.json#L160)
  - [product.iphone-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.iphone-product-template.json#L244)
  - [page.macbook-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.macbook-repairs.json)
  - [page.iphone-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.iphone-repairs.json)
  - [page.ipad-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.ipad-repairs.json)
- Notes:
  - This is especially likely where `main-product` or `main-page` is combined with extra `rich-text`, `image-with-text`, or featured collection blocks configured as `h1`.
- Recommended action:
  - Audit rendered H1 output on representative product and service templates.
  - Standardize on one primary H1 per template.

#### SEO-9. Placeholder copy is still present in live template families

- Severity: High
- Risk: Multiple live templates still ship `Lorem ipsum` placeholder body copy or FAQ answers. That is a direct quality problem for organic landing pages and product templates.
- Evidence:
  - [product.macbook-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.macbook-product-template.json#L122)
  - [product.iphone-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.iphone-product-template.json#L122)
  - [product.watch-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.watch-product-template.json#L122)
  - [collection.iphone-13-series.json](/home/ricky/builds/icorrect-shopify-theme/templates/collection.iphone-13-series.json)
  - [collection.iphone-se-series.json](/home/ricky/builds/icorrect-shopify-theme/templates/collection.iphone-se-series.json)
  - [collection.battery-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/collection.battery-repairs.json)
  - [collection.screen-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/collection.screen-repairs.json#L153)
- Recommended action:
  - Treat placeholder-copy removal as a content QA blocker for any indexed template.
  - Run a repo-wide sweep before further SEO expansion work.

#### SEO-10. Some landing templates inject their own LocalBusiness schema inside template JSON

- Severity: Medium
- Risk: Several location/service landing pages embed their own `LocalBusiness` JSON-LD inside template-level custom liquid, which fragments schema ownership further and duplicates business facts already emitted elsewhere.
- Evidence:
  - [page.macbook-air-repair-london.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.macbook-air-repair-london.json#L117)
  - [page.macbook-repair-london.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.macbook-repair-london.json#L119)
- Notes:
  - This is not automatically invalid.
  - It does increase the chance of drifting phone numbers, opening hours, image URLs, or addresses over time.
- Recommended action:
  - Decide whether location/service pages should own additional schema.
  - If yes, centralize the data source instead of hardcoding JSON-LD inside template config.

#### SEO-11. High-value service pages rely heavily on hardcoded template content instead of page-owned content

- Severity: Medium
- Risk: Major service landing pages are assembled with large `custom-liquid`, `rich-text`, and template-configured content blocks. That makes content maintenance harder to scale and increases the chance of inconsistency between similar pages.
- Evidence:
  - [page.macbook-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.macbook-repairs.json)
  - [page.iphone-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.iphone-repairs.json)
  - [page.ipad-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.ipad-repairs.json)
- Recommended action:
  - Decide which landing-page content should be owned in page resources versus template config.
  - Reduce copy duplication across service-page templates before expanding the landing-page set further.

### SEO Follow-Up Tasks

1. Audit high-value landing pages for missing `page_description`.
2. Validate JSON-LD output on a representative set of URLs:
   - homepage
   - product page
   - collection page
   - service landing page
3. Normalize schema ownership and remove blank or stale properties.
4. Review whether the homepage hardcoded title is intentional and still current.
5. Run a rendered H1 audit across product templates, repair landing pages, and top collection templates.
6. Remove placeholder copy from any indexed template before further SEO rollout.

## Performance Deep Dive

### Overview

The main performance risks in this theme are not unusual micro-optimizations. They come from globally loaded third-party dependencies, duplicated font work, and large inline custom sections that reduce cacheability and increase review complexity.

### Performance Findings

#### PERF-1. jQuery and Slick are loaded on every page for a narrow section use case

- Severity: Medium
- Risk: The layout loads Slick CSS, jQuery, and Slick JS sitewide even though the concrete usage found in this pass is the `video-reviews` section. That adds global network and execution cost to unrelated pages.
- Evidence:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L42)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L56)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L57)
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L145)
- Recommended action:
  - Gate carousel assets to the section or template that needs them.
  - Prefer a theme-native carousel or lightweight section-scoped script.

#### PERF-2. Theme font preloads are duplicated in the global layout

- Severity: Medium
- Risk: The same header/body fonts are preloaded twice in `theme.liquid`, creating unnecessary markup and duplicated preload work.
- Evidence:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L14)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L18)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L286)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L291)
- Recommended action:
  - Keep a single preload path for each font.

#### PERF-3. Large inline app-like sections limit cacheability and raise regression cost

- Severity: Medium
- Risk: The theme contains custom sections that behave like front-end apps but are still delivered inline inside section files. That makes them harder to cache, test, and review than asset-backed JS/CSS.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2452)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L1)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L1027)
- Recommended action:
  - Move section logic and styling into assets where practical.
  - Leave sections responsible for data output and markup only.

#### PERF-4. Quote Wizard adds another external font source inside the section

- Severity: Low-Medium
- Risk: The wizard loads DM Sans from Google Fonts in addition to the theme’s main font system, increasing external requests and making typography less centralized.
- Evidence:
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L7)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2452)
- Recommended action:
  - Decide whether the wizard should inherit theme fonts or move this font into a global, explicitly managed strategy.

### Performance Follow-Up Tasks

1. Measure homepage, collection, product, and quote-wizard pages in preview after removing unnecessary global dependencies.
2. Review whether `video-reviews` can be reimplemented without global jQuery/Slick.
3. Split large inline sections into asset-backed JS/CSS before broader feature work increases their complexity further.

## Accessibility And Interaction Deep Dive

### Overview

The main accessibility issues found in this pass are concentrated in custom sections and custom interactive markup rather than in Shopify’s default components.

### Accessibility Findings

#### A11Y-1. `video-reviews` outputs media and social icons without accessible text alternatives

- Severity: Medium
- Risk: Social icon images and fallback review images are rendered without alt text, so screen-reader users get poor or empty context.
- Evidence:
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L8)
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L24)
- Recommended action:
  - Add meaningful `alt` text where the image conveys meaning.
  - Mark purely decorative images appropriately.

#### A11Y-2. `video-reviews` video markup uses misleading boolean attributes

- Severity: Medium
- Risk: Attributes such as `autoplay="false"` and `controls="true"` are misleading HTML authoring patterns and make the real playback behavior harder to reason about.
- Evidence:
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L20)
- Recommended action:
  - Use valid boolean attribute patterns and retest the actual media behavior on mobile and desktop.

#### A11Y-3. `contact-with-map` builds interactive UI through injected HTML and inline handlers

- Severity: Medium
- Risk: Large `innerHTML` blocks with inline `onclick` handlers make interactive state harder to reason about, harder to test, and easier to regress from an accessibility perspective.
- Evidence:
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L1027)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L1049)
- Notes:
  - This is primarily an implementation-risk finding.
  - It is especially relevant where buttons reveal or hide additional service detail.
- Recommended action:
  - Build interactive controls with DOM nodes and explicit event listeners.
  - Verify `aria-expanded`, focus order, and keyboard behavior during preview QA.

### Accessibility Follow-Up Tasks

1. Run keyboard-only QA on the quote wizard, contact-with-map, and video reviews sections.
2. Audit custom images and icon links for missing `alt` or accessible names.
3. Rework custom injected interactive UI toward more explicit DOM/event patterns before making further feature additions.

## Full Todo List

### QA First Gate

Before broad remediation work starts, this theme should be QA'd against the highest-risk flows. The purpose of this pass is not to “approve the theme.” It is to confirm which audit findings are:

- reproducible in preview
- source-only risks that need no visual confirmation
- already fixed locally but still unvalidated in the browser
- safe to defer until after critical fixes

### QA Order

1. Quote Wizard flow and PostHog validation
2. Contact form and webhook fallback behavior
3. SEO rendering validation on representative templates
4. Accessibility and interaction checks on custom sections
5. Performance spot checks on key templates

### QA Checklist

#### Quote Wizard QA

- Test cold-start wizard journeys for each device family:
  - MacBook
  - iPhone
  - iPad
  - Apple Watch
- Test at least one route for each resolution type:
  - repair
  - diagnostic
  - contact
  - dismiss
- Test product-page prefill path.
- Test collection-page prefill path.
- Test device-context prefill path if used by metafields.
- Test browser back button, breadcrumb clicks, and progress-dot backward navigation.
- Test mixed-cart booking flow and confirm cart replacement prompt behavior.
- Test walk-in date/time validation.
- Test mail-in booking flow.
- Test dustgate/flexgate reroute logic.
- Confirm “no pricing” UI versus actual fetch failure behavior where possible.

#### Quote Wizard PostHog QA

- Confirm `wizard_entry` fires once with the correct `entrySource`.
- Confirm `wizard_step` fires once per step progression and does not inflate on forward/backward reuse.
- Confirm `wizard_resolution` includes:
  - `route`
  - `repairType`
- Confirm `wizard_conversion` includes:
  - `route`
  - `repairType`
  - expected `action`
- Confirm `wizard_collection_fetch_failed` and `wizard_product_fetch_failed` appear when those failures are forced or reproduced.
- Confirm `wizard_cart_replace_confirmed` and `wizard_cart_replace_cancelled` fire correctly.
- Confirm `wizard_resolution_abandoned` fires only when a resolution card was seen and no downstream conversion occurred.
- Confirm the dustgate/flexgate path does not create misleading abandonment noise.
- Review saved dashboards/insights for compatibility with new properties.

#### Contact Form QA

- Test each contact form variant that is intercepted by the webhook flow.
- Confirm successful submission state.
- Confirm visible failure state when webhook delivery fails.
- Confirm whether any form still has a Shopify-native fallback.
- Confirm no unsafe raw HTML is rendered in error states.

#### SEO QA

- Validate rendered title and meta description on:
  - homepage
  - one product page
  - one collection page
  - one service landing page
  - one article page
- Validate JSON-LD output on the same representative URLs.
- Confirm whether representative templates render multiple H1s.
- Confirm whether any indexed templates still show placeholder content.
- Confirm OG image output uses the expected canonical image and protocol.
- Confirm `sameAs` does not emit empty values after any future fix.

#### Accessibility QA

- Keyboard-test:
  - Quote Wizard
  - contact-with-map
  - video-reviews
- Check focus visibility and logical tab order.
- Check custom expandable sections for correct state and keyboard interaction.
- Check media and icon links for accessible names.
- Check whether video behavior matches the authored intent on mobile and desktop.

#### Performance QA

- Spot-check homepage, product page, collection page, and Quote Wizard page in preview.
- Record whether jQuery/Slick are loaded on unrelated pages.
- Record whether duplicate font preloads are present in the document head.
- Capture a baseline before any dependency cleanup so later gains are measurable.

### QA Deliverables

The QA pass should produce:

- a pass/fail result for each high-risk flow
- screenshots or notes for any reproduced issue
- a list of findings that are confirmed in browser
- a list of source-only findings that do not need further reproduction
- a go/no-go recommendation for remediation sequencing

### QA Blockers For Remediation

The following should be validated before broad Quote Wizard or analytics changes are treated as ready:

- Quote Wizard route coverage in preview
- PostHog event payload correctness
- cart replacement analytics correctness
- post-resolution abandonment behavior

The following should be validated before SEO cleanup is treated as complete:

- rendered H1 structure
- rendered metadata on representative URLs
- placeholder-content sweep on indexed templates
- schema output on representative URLs

### P0 Immediate

- Rotate the GitHub PAT exposed in the repo remote and replace the remote URL with a tokenless HTTPS or SSH remote.
- Fix unsafe customer interpolation in [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid) by rendering PostHog identify values with `| json`.
- Replace raw HTML error rendering in [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js) with safe DOM/text rendering.
- Restore a safe fallback path for contact forms if the webhook request fails.
- Remove placeholder `Lorem ipsum` content from any indexed template still shipping it.

### P1 Quote Wizard Analytics And Reliability

- Validate all new Quote Wizard PostHog events in preview:
  - `wizard_step`
  - `wizard_resolution`
  - `wizard_conversion`
  - `wizard_entry`
  - `wizard_collection_fetch_failed`
  - `wizard_product_fetch_failed`
  - `wizard_cart_replace_confirmed`
  - `wizard_cart_replace_cancelled`
  - `wizard_resolution_abandoned`
- Update PostHog dashboards and saved insights to use:
  - `repairType`
  - `route`
  - `entrySource`
- Validate that dustgate/flexgate reroutes do not make `wizard_resolution_abandoned` overfire.
- Validate that fetch failure events contain the expected `collectionHandle` or `productHandle`.
- Decide whether fetch failure events should be alerting signals or exploratory analytics only.
- Review cart replacement cancellation rates before deciding whether the current cart-clearing flow is acceptable.

### P1 SEO

- Standardize to a single rendered H1 on key templates:
  - product templates
  - repair landing pages
  - top collection templates
- Add or define a fallback strategy for missing `meta name="description"` output.
- Change `og:image` primary output to `https:`.
- Normalize all schema `@context` values to `https://schema.org`.
- Filter blank entries out of `sameAs`.
- Centralize or remove hardcoded review counts and rating values in schema.
- Decide whether the homepage hardcoded title is intentional and still current.
- Decide whether location/service pages should own their own JSON-LD or inherit a centralized schema source.
- Reduce duplicated hardcoded landing-page content across service page templates.

### P1 Content QA

- Run a repo-wide sweep for placeholder copy in:
  - product templates
  - collection templates
  - FAQ blocks
  - supporting content sections
- Review indexed collection templates for unfinished FAQ content.
- Review product template supporting sections for irrelevant copy inherited across device types.
- Confirm top landing pages have intentional, current copy and not template carryover.

### P1 Performance

- Remove duplicate font preloads from [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid).
- Stop loading jQuery and Slick globally if only section-scoped usage remains.
- Rework `video-reviews` so its assets load only where needed.
- Decide whether the Quote Wizard should inherit theme typography instead of loading DM Sans independently.
- Measure key templates in preview after dependency cleanup:
  - homepage
  - product page
  - collection page
  - Quote Wizard page

### P1 Accessibility

- Add meaningful `alt` text or decorative treatment to images in `video-reviews`.
- Normalize boolean video attributes in `video-reviews`.
- Review keyboard interaction and focus order in:
  - Quote Wizard
  - contact-with-map
  - video reviews
- Replace inline `onclick` patterns in `contact-with-map` with explicit event listeners.
- Add or verify `aria-expanded` and related state on reveal/collapse UI in custom sections.

### P2 Quote Wizard Architecture

- Split Quote Wizard JS out of [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid) into an asset.
- Split Quote Wizard CSS out of the section into an asset.
- Keep Liquid focused on data bootstrapping and markup.
- Document the Quote Wizard data contracts:
  - model source
  - collection source
  - repair-type resolution
  - route map ownership
- Replace handle-suffix dependency with more explicit structured data where practical.
- Replace express turnaround HTML scraping with explicit product data or metafields.
- Distinguish operational load failure from genuine “not configured yet” catalog states in customer-facing copy.

### P2 Contact And Lead Capture

- Restrict contact interception only to forms that truly require the webhook flow.
- Review whether some forms should remain native Shopify submissions.
- Add more structured operational logging around webhook failures.
- Review whether contact success/failure analytics should be unified across theme forms.

### P2 Structured Data And Template Governance

- Define schema ownership by file:
  - global business schema
  - organization schema
  - collection/service schema
  - breadcrumb schema
  - location/service landing schema
- Remove duplicated business facts across header, snippets, and template-level JSON-LD.
- Add a structured-data validation step to the release checklist.
- Create a template QA checklist for indexed templates before publish.

### P2 Audit And QA Process

- Turn this audit into a tracked remediation log with status per item.
- Add owner, status, and date fields for each major finding.
- Run browser-based QA on:
  - Quote Wizard flows
  - contact forms
  - product booking flows
  - collection landing pages
- Run rendered checks for:
  - headings
  - meta tags
  - schema output
  - accessibility basics
- Add a final pre-publish sweep for placeholder copy and blank social/config values.

## Second-Pass QA Review

**Date:** 2026-03-31  
**Reviewer:** Codex  
**Scope:** Pressure-test of this audit against the current repo state and existing quote-wizard QA/re-QA docs

### Findings

#### 1. Audit baseline is blurred between committed code and local-only changes

- Severity: High
- What is wrong with the audit:
  - The document mixes `main`, local follow-up changes, and “current branch inspected” language without clearly separating committed state from dirty-worktree state.
  - The Quote Wizard PostHog section presents local-only changes as if they are part of the reviewed baseline.
- Why it matters:
  - Teams can easily prioritize or sign off against code that is not actually in `HEAD` or `origin/main`.
- Evidence from repo/docs/audit:
  - [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L7)
  - [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L8)
  - [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L548)
  - `git status` at review time showed `sections/quote-wizard.liquid` modified locally on `main`.
- What should change in the audit or remediation plan:
  - Explicitly label which findings are based on committed code and which are based on local uncommitted changes.
  - Do not describe local-only Quote Wizard analytics fixes as current baseline without saying so.

#### 2. Structured-data section understates the real problem

- Severity: High
- What is wrong with the audit:
  - The audit overweights `http://schema.org` and blank `sameAs` cleanup.
  - It understates that business facts are already inconsistent across schema blocks and visible contact surfaces.
- Why it matters:
  - Drift is no longer hypothetical. The theme is already emitting conflicting phone/email facts depending on source.
- Evidence from repo/docs/audit:
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L585)
  - [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L586)
  - [icorrect-seo-schema.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/icorrect-seo-schema.liquid#L52)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L434)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L439)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L133)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L137)
  - [page.macbook-repair-london.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.macbook-repair-london.json#L119)
- What should change in the audit or remediation plan:
  - Reframe this as a schema/contact-facts governance issue first.
  - Demote `http://schema.org` cleanup behind business-fact unification.

#### 3. Contact-form interception finding is broadly right but imprecisely framed

- Severity: Medium
- What is wrong with the audit:
  - “Global contact interception” is sloppy wording.
  - The script is loaded sitewide, but it only targets `#ContactForm` and `#corporate-lead-form`.
- Why it matters:
  - The remediation scope is narrower than “all forms,” but broader than one page.
  - The real problem is that the targeted forms lose Shopify’s native submission path, native error handling, and native success behavior.
- Evidence from repo/docs/audit:
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L26)
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L54)
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L59)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L435)
  - [contact-form.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-form.liquid#L384)
  - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L462)
  - [icorrect-landing.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/icorrect-landing.liquid#L475)
  - [repair-form.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/repair-form.liquid#L296)
- What should change in the audit or remediation plan:
  - Reword it to “sitewide-loaded interceptor removes Shopify fallback for the targeted forms.”
  - Add acceptance criteria for fallback, success, and error behavior.

#### 4. Quote Wizard cart replacement is current, but this is now mostly a product-policy issue

- Severity: Medium
- What is wrong with the audit:
  - The code finding is true.
  - The framing still treats it too much like a normal defect instead of a deliberate, user-confirmed flow choice.
- Why it matters:
  - Earlier wizard QA found silent cart contamination.
  - Current code warns, asks for confirmation, then clears the cart only after acceptance.
- Evidence from repo/docs/audit:
  - [quote-wizard-qa-review-2026-03-23.md](/home/ricky/builds/icorrect-shopify-theme/docs/quote-wizard-qa-review-2026-03-23.md#L19)
  - [quote-wizard-re-qa-2026-03-25.md](/home/ricky/builds/icorrect-shopify-theme/docs/quote-wizard-re-qa-2026-03-25.md#L13)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1796)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1805)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1817)
- What should change in the audit or remediation plan:
  - Keep the finding.
  - Reclassify it as a product decision with measurable conversion/support risk.
  - Do not prioritize it ahead of security, analytics/privacy, or runtime reliability defects.

#### 5. H1 and placeholder-copy sections mix real issues with weak evidence

- Severity: Medium
- What is wrong with the audit:
  - The document is right that there are heading/content problems.
  - Some cited evidence is weak because it relies on disabled blocks or template config that may not render.
- Why it matters:
  - This is exactly the sort of overreach that makes an audit look less reliable than it is.
- Evidence from repo/docs/audit:
  - [product.macbook-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.macbook-product-template.json#L118)
  - [product.iphone-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.iphone-product-template.json#L118)
  - [product.watch-product-template.json](/home/ricky/builds/icorrect-shopify-theme/templates/product.watch-product-template.json#L118)
  - [main-product.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/main-product.liquid#L262)
  - [main-product.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/main-product.liquid#L264)
  - [page.iphone-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.iphone-repairs.json#L1)
  - [collection.screen-repairs.json](/home/ricky/builds/icorrect-shopify-theme/templates/collection.screen-repairs.json#L152)
- What should change in the audit or remediation plan:
  - Split “rendered/active issues” from “disabled config debt.”
  - Lead with the concrete duplicated product-title heading in `main-product.liquid`.

#### 6. Several Quote Wizard residual findings are technical-debt notes or runtime hypotheses, not confirmed defects

- Severity: Medium
- What is wrong with the audit:
  - QW-1, QW-2, and QW-4 are fair technical-debt findings.
  - QW-7 and parts of QW-8 are explicitly inferred from code and should not be presented as settled behavior defects.
- Why it matters:
  - Technical debt, release risk, and preview-only hypotheses should not sit in one undifferentiated pool.
- Evidence from repo/docs/audit:
  - [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L488)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2479)
  - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2563)
- What should change in the audit or remediation plan:
  - Mark QW-7 and QW-8 as preview-validation items unless/until browser QA confirms failure.

#### 7. GitHub PAT finding is solid but needs scope clarification

- Severity: Critical
- What is wrong with the audit:
  - The finding is correct.
  - It should say clearly that `.git/config` is local clone config, not a tracked storefront file.
- Why it matters:
  - Teams need to understand the blast radius correctly.
- Evidence from repo/docs/audit:
  - [.git/config](/home/ricky/builds/icorrect-shopify-theme/.git/config#L6)
- What should change in the audit or remediation plan:
  - Keep the severity.
  - Add one sentence clarifying that this is a local operational exposure.

#### 8. Several top-line findings are solid and should not be re-litigated

- Severity: Low
- What is wrong with the audit:
  - Nothing material on these items.
- Why it matters:
  - They are supported directly by source and are actionable.
- Evidence from repo/docs/audit:
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L336)
  - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L284)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L42)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L56)
  - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L288)
  - [video-reviews.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/video-reviews.liquid#L20)
- What should change in the audit or remediation plan:
  - Keep the unsafe Liquid interpolation finding.
  - Keep the raw `innerHTML` error rendering finding.
  - Keep the global jQuery/Slick and duplicate font preload findings.
  - Keep the `video-reviews` markup/a11y finding.

### What This Audit Missed

- GA4 and PostHog are loaded unconditionally, and logged-in customers are identified by raw email without visible consent gating.
  - Evidence:
    - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L317)
    - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L331)
    - [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L336)
    - [posthog-tracking.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/posthog-tracking.liquid#L10)
- The contact interceptor still has a false-positive success path for any `2xx` response with non-JSON content.
  - Evidence:
    - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L200)
    - [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L204)
- Catalog/model data is duplicated across the Quote Wizard and contact sections instead of sharing one source of truth.
  - Evidence:
    - [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L13)
    - [contact-form.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-form.liquid#L492)
    - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L574)
    - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L817)
- The strongest concrete H1 issue is in the product section itself, where the product title is rendered twice.
  - Evidence:
    - [main-product.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/main-product.liquid#L262)
    - [main-product.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/main-product.liquid#L264)

### Required Audit Corrections

1. State the exact review baseline: committed `HEAD` versus local dirty worktree.
2. Rewrite the structured-data section around actual data drift, not mostly around `http://schema.org`.
3. Reclassify cart replacement, homepage title hardcoding, and template-owned content as product/governance decisions where appropriate.
4. Fix the contact-form finding wording so it reflects selector-scoped interception rather than universal form takeover.
5. Add the missing analytics/privacy finding and the contact `2xx` non-JSON false-success finding.
6. Replace disabled-block evidence in the H1/placeholder sections with active/rendered examples, or clearly label those examples as dormant config debt.
7. Mark runtime-inference Quote Wizard items as preview-validation hypotheses where the code does not prove failure.

### Recommended Remediation Order

#### Immediate Fixes

1. Rotate the token in [.git/config](/home/ricky/builds/icorrect-shopify-theme/.git/config#L6) and remove it from the remote URL.
2. Freeze the audit baseline before remediation starts so teams are not working against mixed committed/local states.
3. Fix unsafe customer interpolation in [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L336).
4. Replace raw HTML error rendering in [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L284).
5. Repair the contact submission contract:
   - explicit success criteria
   - defined fallback behavior
   - clear decision on which forms remain intercepted
6. Address analytics/privacy gating for GA4/PostHog.
7. Unify structured-data ownership and correct mismatched phone/email/review facts.

#### Product Decisions

1. Decide whether Quote Wizard cart replacement is acceptable product behavior.
2. Decide whether the homepage title hardcode is intentional SEO strategy.
3. Decide whether landing-page content should live in template config or page-owned content sources.

#### Validation Work

1. Preview-test Quote Wizard back navigation, prefill, cart replacement, and event payloads.
2. Preview-test intercepted contact forms for success, webhook failure, timeout, and non-JSON `2xx` responses.
3. Validate rendered schema, headings, meta description output, and placeholder content on representative live templates.

#### Deeper Follow-Up

1. Remove global jQuery/Slick loading and duplicate font preloads.
2. Consolidate duplicated model/collection mappings across Quote Wizard and contact sections.
3. Split large inline sections out of Liquid once current behavior is frozen and validated.

### Final Assessment

- Status: Usable after targeted edits
- Rationale:
  - The strongest source-backed findings are real.
  - The document is not safe to circulate as-is because it blurs committed versus local code, misses a material analytics/privacy risk, and misframes the schema problem.

## Implementation QA Review Addendum

**Date:** 2026-03-31  
**Reviewer:** Codex  
**Scope:** Implementation QA review of this audit/remediation plan against the current repo state

### Findings

#### 1. The document is not anchored to a stable execution baseline

- Severity: Critical
- What is wrong:
  - The audit summary, remediation order, P0/P1 lists, and second-pass self-review do not describe one consistent repo state.
  - Multiple top-line findings are now stale relative to the current files.
- Why it matters:
  - Teams can start execution against already-fixed or no-longer-applicable items and produce invalid QA results.
- Evidence from repo/plan:
  - The audit still says a GitHub PAT is in `.git/config`: [.git/config](/home/ricky/builds/icorrect-shopify-theme/.git/config#L6)
  - Current `.git/config` uses SSH remote format, not a tokenized HTTPS URL: [.git/config](/home/ricky/builds/icorrect-shopify-theme/.git/config#L6)
  - The audit still says PostHog customer interpolation is unsafe: [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L58)
  - Current `theme.liquid` already uses `| json` in `posthog.identify(...)`: [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L317)
  - The audit still says contact error rendering uses unsafe `innerHTML`: [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L90)
  - Current `showErrorMessage()` builds the banner with DOM nodes and `textContent`: [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L271)
- Recommended fix:
  - Freeze one explicit baseline before execution starts.
  - Rewrite the audit summary and P0/P1 lists against that exact baseline.

#### 2. Quote Wizard QA is scheduled too early relative to baseline freeze

- Severity: High
- What is wrong:
  - The document puts Quote Wizard preview QA first while also admitting that local follow-up changes are in progress and that the baseline is blurred.
- Why it matters:
  - Preview testing on moving code is not a release gate. It is noise.
- Evidence from repo/plan:
  - Audit status says local follow-up fixes are in progress: [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L8)
  - QA order starts with Quote Wizard flow and PostHog validation: [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L1020)
  - Current working tree is dirty in `layout/theme.liquid`, `assets/contact-form-interceptor.js`, `sections/header.liquid`, `sections/quote-wizard.liquid`, and other files.
- Recommended fix:
  - Move “freeze baseline” ahead of all preview QA.
  - Only run Quote Wizard preview QA on a pinned baseline.

#### 3. Contact interception remediation is still underspecified for safe implementation

- Severity: High
- What is wrong:
  - “Restore a safe fallback path” is directionally right but not implementable as written.
  - The document does not define the success contract, fallback behavior, or per-form scope clearly enough.
- Why it matters:
  - This is a live lead-capture path touching layout, section markup, webhook behavior, and Shopify native form behavior.
- Evidence from repo/plan:
  - Interceptor is loaded sitewide: [theme.liquid](/home/ricky/builds/icorrect-shopify-theme/layout/theme.liquid#L417)
  - It targets all `form[data-contact-intercept="true"]`: [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L17)
  - It affects at least three section variants:
    - [contact-form.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-form.liquid#L384)
    - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L462)
    - [icorrect-landing.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/icorrect-landing.liquid#L475)
  - Non-JSON `2xx` still counts as success: [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L182)
  - Native fallback bypasses the theme’s submit listeners by calling `HTMLFormElement.prototype.submit`: [contact-form-interceptor.js](/home/ricky/builds/icorrect-shopify-theme/assets/contact-form-interceptor.js#L223)
- Recommended fix:
  - Add acceptance criteria for:
    - JSON success response shape
    - timeout behavior
    - non-JSON `2xx` handling
    - native Shopify fallback behavior
    - which forms remain intercepted versus native

#### 4. Structured-data work is scoped too narrowly and in the wrong order

- Severity: High
- What is wrong:
  - The earlier audit emphasizes `sameAs` cleanup and schema context normalization.
  - The real defect is business-fact drift across header schema, snippet schema, template JSON-LD, and visible contact surfaces.
- Why it matters:
  - Syntax cleanup alone will still leave conflicting public facts.
- Evidence from repo/plan:
  - Header schema phone/email: [header.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/header.liquid#L585)
  - Contact surface phone/email: [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L434)
  - Collection/page schema repeats separate business facts: [icorrect-seo-schema.liquid](/home/ricky/builds/icorrect-shopify-theme/snippets/icorrect-seo-schema.liquid#L47)
  - Template JSON contains another LocalBusiness block with different facts: [page.macbook-repair-london.json](/home/ricky/builds/icorrect-shopify-theme/templates/page.macbook-repair-london.json#L119)
- Recommended fix:
  - Reframe this as schema/contact-facts governance first.
  - Inventory all emitted business facts and assign ownership before syntax cleanup.

#### 5. Quote Wizard items are mixed too early with global theme fixes

- Severity: High
- What is wrong:
  - The document acknowledges that the Quote Wizard is a high-risk custom app-like section, but still mixes its execution and QA too closely with global cleanup.
- Why it matters:
  - The wizard owns prefill, collection fetch, product fetch, triage routing, cart mutation, checkout redirection, and PostHog events.
  - That is a separate delivery stream, not ordinary section cleanup.
- Evidence from repo/plan:
  - Context bootstrapping: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L62)
  - Collection fetch and product fetch: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L803)
  - Cart replacement flow: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1796)
  - Diagnostic booking path: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L1959)
  - Prefill and browser history behavior: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L2479)
- Recommended fix:
  - Split Quote Wizard work into its own high-risk execution track.
  - Keep global theme fixes and Quote Wizard validation as separate gates.

#### 6. Validation strategy is still too loose for a repo with no obvious automated safety net

- Severity: Medium
- What is wrong:
  - The QA checklist is directionally correct but still broad and manual.
  - It does not pin exact preview URLs, required browsers, or release-blocking acceptance criteria.
- Why it matters:
  - There is no visible package-based test harness and no visible Theme Check config in the repo root.
  - Manual QA becomes the only gate, so it needs to be tighter.
- Evidence from repo/plan:
  - Audit admits no browser QA and no Theme Check execution in this pass: [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L186)
  - Repo has no visible `.theme-check.yml`
  - Repo has no visible `package.json`
- Recommended fix:
  - Require a fixed preview matrix:
    - one product page
    - one collection page
    - one service landing page
    - one Quote Wizard page
  - Require browser coverage for:
    - desktop Chrome
    - iPhone Safari
    - Android Chrome

#### 7. Shared catalog/model data duplication is deferred too late

- Severity: Medium
- What is wrong:
  - The audit correctly notes duplication later, but the execution order still leaves it as follow-up instead of an early dependency if contact or wizard work proceeds.
- Why it matters:
  - Catalog/model fixes can drift immediately between contact flows and the wizard.
- Evidence from repo/plan:
  - Wizard model/context source: [quote-wizard.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/quote-wizard.liquid#L62)
  - Contact form hardcoded repair data: [contact-form.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-form.liquid#L492)
  - Contact-with-map hardcoded repair data and collection map:
    - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L574)
    - [contact-with-map.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/contact-with-map.liquid#L817)
- Recommended fix:
  - If contact and wizard behavior are both in scope, move shared mapping/source-of-truth work earlier.

#### 8. Content/H1 issues need cleaner separation between active defects and dormant config debt

- Severity: Low
- What is wrong:
  - The document’s later self-review is right that this area mixes strong and weak evidence.
- Why it matters:
  - It dilutes the credibility of the active issues.
- Evidence from repo/plan:
  - Strong active issue: duplicated product title heading in [main-product.liquid](/home/ricky/builds/icorrect-shopify-theme/sections/main-product.liquid#L262)
  - The document later acknowledges that some earlier evidence relies on disabled blocks or config debt: [theme-audit-2026-03-31.md](/home/ricky/builds/icorrect-shopify-theme/docs/theme-audit-2026-03-31.md#L1350)
- Recommended fix:
  - Keep active rendered issues in execution scope.
  - Move dormant config debt to backlog.

### Open Questions / Assumptions

- Is the intended execution baseline current dirty worktree or committed `main`?
- Is analytics/privacy gating mandatory in this iteration or only a documented risk?
- Which intercepted forms must remain webhook-backed versus native Shopify forms?

### Recommended Revised Execution Order

1. Freeze the execution baseline and rewrite this audit summary/P0/P1 against actual current files.
2. Remove disproven or stale findings from the plan.
3. Define contracts before implementation:
   - contact interception scope
   - webhook success/failure contract
   - analytics/privacy position
   - schema fact ownership
4. Ship the minimum global source-backed slice first:
   - contact-flow contract fixes
   - business-fact unification
   - active rendered SEO/H1 cleanup
5. Run mandatory preview QA on contact flows and rendered SEO/schema outputs.
6. Run Quote Wizard as a separate track:
   - prefill
   - back navigation
   - cart replacement
   - repair/diagnostic/contact/dismiss routing
   - analytics payloads
7. Only after behavior is frozen, do performance/accessibility cleanup and larger Quote Wizard architecture work.

### Go / No-Go Assessment

- Status: No-go as written
- Minimum changes needed before execution:
  1. Freeze the baseline.
  2. Remove stale/disproven findings from the summary and P0/P1 lists.
  3. Split Quote Wizard into a separate preview-gated execution stream.
  4. Add explicit acceptance criteria for intercepted contact forms and schema fact ownership.
