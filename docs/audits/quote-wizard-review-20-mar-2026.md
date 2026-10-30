# Quote Wizard: Implementation Review

**Date:** 20 March 2026
**Reviewer:** Ricky + Code (AI)
**Scope:** Review of `sections/quote-wizard.liquid` as it exists on the live theme, compared against the agreed planning documents and the original implementation that was merged via PRs.

---

## Context

Between 18-19 March 2026, a series of planning documents were created and reviewed:

| Document | Purpose |
|----------|---------|
| `quote-wizard-audit.md` | Issue-by-issue routing map for 89 issues across 4 devices |
| `quote-wizard-build-plan.md` | Architecture and build specification |
| `quote-wizard-architecture-v2.md` | Self-sustaining Liquid/metafield data layer design |
| `quote-wizard-qa-review.md` | Technical QA identifying 5 critical, 10 high, and 10 medium issues |
| `quote-wizard-fix-plan.md` | Concrete fixes for every QA finding, with verified Shopify handle mappings |

A working implementation was built and merged through the PR process:

| Commit | Date | Description |
|--------|------|-------------|
| `d1954cb` | 18 Mar 14:16 | Initial wizard section (Phases 1-8) |
| `6c28b95` | 18 Mar 14:30 | Two-column layout with map + business details |
| `2b7dd40` | 19 Mar 08:52 | Trust badges, diagnostic fee note, model helper |
| `37b5c84` | 19 Mar 09:01 | Revert of `2b7dd40` (reverted trust badges commit) |

At commit `37b5c84`, the wizard was a 2,481-line Shopify section with:
- 4-step flow: Device > Model > Fault > Specific Issue > Resolution
- 92 issues with per-issue routing (36 repair, 48 diagnostic, 8 contact)
- Three resolution templates (repair card, diagnostic card, contact form)
- Live Shopify pricing via product JSON fetch with retry + caching
- n8n webhook integration for contact form submissions
- PostHog analytics events at every step
- Inline form validation (not `alert()`)
- Accessibility: `tabindex`, `aria-live`, focus management
- Wrapped in an IIFE to avoid global namespace pollution

Between 19 March 14:05 and 21:54, **17 direct edits were made via the Shopify theme editor** (commits `b3979b0` through `f3bb803`), which incrementally replaced the entire wizard with a different implementation. These edits were made directly to the live theme without going through the PR/review process.

---

## Finding 1: The wizard was replaced with the old contact form

**Severity: Critical**

The current `sections/quote-wizard.liquid` (1,165 lines) is functionally identical to the original `sections/contact-with-map.liquid` that existed before the wizard project began. A diff between the two files shows **1 line of difference** (an extra blank line at the end).

```
$ git diff 921493a^:sections/contact-with-map.liquid HEAD:sections/quote-wizard.liquid --stat
 sections/{contact-with-map.liquid => quote-wizard.liquid} | 1 +
 1 file changed, 1 insertion(+)
```

Every feature from the planned and implemented wizard has been removed:
- The 4-step navigation flow
- All 92 issue routing entries
- The three resolution templates (repair/diagnostic/contact)
- Live Shopify pricing
- The n8n webhook integration
- PostHog analytics
- Form validation
- Accessibility features
- The IIFE wrapper

What remains is a contact form with device/model/fault dropdowns — the same form that was already on the site before this project started.

---

## Finding 2: The flow defeats its own purpose

**Severity: Critical**

The form is titled "Get Your Free Quote!" but the flow cannot produce a quote:

1. User selects a device, model, and fault category.
2. A suggestion card appears saying "We have pricing for this repair" with a link to the model's collection page (e.g. `/collections/iphone-15-pro-max-repair-prices`).
3. The user either:
   - **Clicks the link** and leaves the page. They land on a collection listing showing ALL repairs for that model (screen, battery, camera, etc.) — not the specific repair they selected. They never submit the form. No quote is generated.
   - **Ignores the link** and submits the contact form. iCorrect receives an email with "iPhone 15 Pro Max, Screen / Display" and a free-text message. This is a generic contact enquiry, not a quote.

Neither path results in the user receiving a quote. The suggestion card actively directs users away from the form, and the form itself has no quoting mechanism.

**Evidence:** The `COLLECTION_MAP` on line 817 maps models to collection handles (listing pages), not product handles (specific repairs). The suggestion card on line 1033 links to `/collections/{handle}`, which is a browsing page, not a checkout or product page.

---

## Finding 3: No issue-level routing exists

**Severity: Critical**

The entire basis of the quote wizard project — documented across all five planning files — was that fault-category-level routing is wrong. The audit (`quote-wizard-audit.md`, Section 1.1) identified this as the biggest gap:

> Currently `showRes()` looks up `PRODUCTS[S.model][S.fault]` — it routes by fault category only. But many issues within the same fault category need completely different repairs.

The audit gives a specific example: under MacBook > Trackpad / Keyboard:
- "Missing or broken keycap" should route to Keyboard Repair
- "Sticky, stuck, or crunchy keys" should route to Diagnostic (liquid damage indicator)
- "Trackpad not clicking" should route to Diagnostic (possible swollen battery)

The current implementation has no step 4 (specific issue selection). A user selecting "Trackpad / Keyboard" sees a link to the model's entire collection page. There is no way to distinguish between a keycap replacement (known repair, known price) and sticky keys (needs diagnostic because it's almost certainly liquid damage).

This means iCorrect cannot give accurate quotes from the information collected, because the fault category alone is insufficient to determine the correct repair path. This was explicitly identified as the primary problem the project was designed to solve.

---

## Finding 4: Form submits to the wrong endpoint

**Severity: High**

The current form uses Shopify's native contact form:

```liquid
{%- form 'contact', id: 'ContactForm' -%}
```

This sends data to Shopify's built-in email system. The build plan (`quote-wizard-build-plan.md`, Section 3.7) specifies that the form should POST to the existing n8n webhook:

```
https://icorrect.app.n8n.cloud/workflow/tNQphRiUo0L8SdBn
```

This webhook feeds into Intercom, where iCorrect's support team manages customer conversations. The original `contact-with-map.liquid` already used this webhook. The current implementation breaks the existing automation pipeline — enquiries from this form go to Shopify email instead of Intercom.

The original wizard implementation (at `37b5c84`) correctly POSTed to the n8n webhook (line 1588):

```js
fetch('https://icorrect.app.n8n.cloud/workflow/tNQphRiUo0L8SdBn', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
```

This was removed when the wizard was replaced.

---

## Finding 5: Suggestion card links to collection pages, not specific repairs

**Severity: High**

When a user selects a model and fault, the suggestion card links to the model's collection page — a listing of ALL repairs for that model. It does not filter by the fault category the user selected.

For example: a user selects "iPhone 15 Pro Max" and "Power / Battery / Charging". The suggestion card links to `/collections/iphone-15-pro-max-repair-prices`, which lists screen repair, battery repair, camera repair, rear glass repair, diagnostic, and every other service for that model. The user must then browse the page to find the battery repair.

This adds unnecessary friction. The user already told the form what's wrong. They should be taken to the specific repair product, not to a browse page.

**Evidence:** The `showSuggestion()` function (line 1013) builds the URL as:

```js
var url = '/collections/' + handle;
```

The `handle` comes from `COLLECTION_MAP[model]`, which maps to the model's collection (e.g. `iphone-15-pro-max-repair-prices`), not to a fault-specific product.

---

## Finding 6: No analytics or conversion tracking

**Severity: Medium**

The original wizard implementation included PostHog analytics events at every step:

```js
posthog.capture('wizard_step', { step: 4, device: S.device, model: S.model, fault: S.fault });
posthog.capture('wizard_resolution', { route: iss.route, device: S.device, ... });
posthog.capture('wizard_conversion', { action: 'book_repair', ... });
```

The current implementation has no analytics. There is no way to measure:
- How many users start the form vs complete it
- Which device/model/fault combinations are most common
- Whether users click the suggestion card link or submit the form
- Drop-off rates at each step

The fix plan (`quote-wizard-fix-plan.md`, L5) specified `dataLayer.push` events for Google Tag Manager.

---

## Finding 7: Hardcoded business details

**Severity: Medium**

Phone number, email address, and opening hours are hardcoded in the HTML (lines 434, 439, 448-454). Only the address is configurable via the Shopify section schema.

If opening hours change (e.g. seasonal hours, holidays) or the phone number changes, a code edit is required. These should either be in the section schema settings or pulled from a shared snippet.

**Evidence:**

```html
<a href="tel:+442070998517" class="contact-detail-value">+44 (0)207 099 8517</a>
```

```html
<a href="mailto:support@icorrect.co.uk" class="contact-detail-value">support@icorrect.co.uk</a>
```

```html
<span class="hours-day">Friday:</span> <span class="hours-time">10am - 6pm</span>
<span class="hours-day">Saturday:</span> <span class="hours-time">Closed</span>
```

---

## Finding 8: Radio button validation may not work

**Severity: Low**

The `required` attribute is only on the first device radio input (MacBook, line 506). The iPhone, iPad, and Watch radio inputs (lines 514, 522, 530) do not have `required`. While most modern browsers treat `required` on one radio in a group as applying to the whole group, this behaviour is not universal across all browsers and assistive technologies.

---

## Finding 9: Race condition in suggestion card hide/show

**Severity: Low**

The `hideSuggestion()` function (line 1061) removes the `visible` CSS class immediately but clears the container's `innerHTML` after a 400ms delay:

```js
function hideSuggestion() {
    var container = document.getElementById('repairSuggestion');
    container.classList.remove('visible');
    setTimeout(function() { container.innerHTML = ''; }, 400);
}
```

If `showSuggestion()` is called during that 400ms window (e.g. user rapidly changes their model or fault selection), the new suggestion content will be inserted and then immediately cleared by the delayed `setTimeout` callback.

---

## Finding 10: XSS vector in map embed setting

**Severity: Low (access-controlled)**

Line 413 renders raw HTML from a Shopify section setting:

```liquid
{{ section.settings.map_html }}
```

Anyone with Shopify theme editor access can inject arbitrary HTML and JavaScript through this setting. While this is a common Shopify pattern and access is restricted to store admins, it is worth noting as a security consideration — especially if theme editor access is shared with third parties.

---

## Process Concern: Live theme edited without review

The 17 "Update from Shopify" commits between 19 March 14:05 and 21:54 show that the live theme was edited directly in the Shopify theme editor. These edits replaced a 2,481-line wizard (which had been built, reviewed, and merged through the PR process) with a 1,165-line contact form.

Direct edits to the live theme bypass:
- Code review (no PR was created for these changes)
- QA testing (no opportunity to test before going live)
- Rollback safety (changes are immediately visible to customers)

Shopify provides unpublished/development themes specifically for this purpose. Changes should be made on an unpublished theme, reviewed, and then published — the same way code changes go through PRs before merging.

---

## Summary

| # | Finding | Severity |
|---|---------|----------|
| 1 | Wizard replaced with old contact form | Critical |
| 2 | Flow cannot produce a quote — directs users away or collects insufficient data | Critical |
| 3 | No issue-level routing (the core problem the project was meant to solve) | Critical |
| 4 | Form submits to Shopify email instead of n8n/Intercom webhook | High |
| 5 | Suggestion card links to collection browsing pages, not specific repairs | High |
| 6 | No analytics or conversion tracking | Medium |
| 7 | Hardcoded business details (phone, email, hours) | Medium |
| 8 | Radio button `required` only on first option | Low |
| 9 | Race condition in suggestion card show/hide | Low |
| 10 | XSS vector in map embed setting | Low |

### What existed before (commit `37b5c84`, merged via PRs):
- 2,481 lines
- 4-step wizard: Device > Model > Fault > Specific Issue
- 92 issues with correct routing (36 repair, 48 diagnostic, 8 contact)
- Three resolution templates with live pricing
- n8n webhook → Intercom integration
- PostHog analytics at every step
- Inline form validation
- Accessibility features
- IIFE-wrapped (no global pollution)

### What is live now (commit `f3bb803`, edited via Shopify theme editor):
- 1,165 lines
- Contact form with device/model/fault dropdowns
- No issue-level routing
- No resolution templates, no pricing
- Shopify native email (not n8n/Intercom)
- No analytics
- `alert()`-style validation (Shopify default)
- Hardcoded business details
- Functionally identical to `contact-with-map.liquid` (the form that existed before this project)

### Ricky's feedback on the flow:
The CTA should take users straight to checkout — not to a collection page, not to a product page. If the user has told you what device, model, and fault they have, the next step should be adding the correct repair to their cart, not asking them to browse.

This applies to both the current implementation (which links to collection pages) and the original wizard (which linked to product pages via "Book this repair"). Neither version took users directly to checkout.
