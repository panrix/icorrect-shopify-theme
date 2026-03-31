# Theme Audit PR QA Checklist

**Date:** 2026-03-31
**Branch:** `fix/theme-audit-p0-remediation`
**Baseline commit:** `9dfaedf`
**Purpose:** Pre-merge QA checklist for the global theme audit remediation branch

## Execution Record

- QA owner:
- QA date:
- Preview theme URL:
- Product page URL:
- Collection page URL:
- Contact page URL:
- Mobile device(s) used:
- Desktop browser/version:

## Scope

This checklist covers the changes shipped on `fix/theme-audit-p0-remediation`:

- contact form interception and Shopify fallback behavior
- global jQuery/Slick removal
- `video-reviews` section refactor
- schema/meta syntax cleanup

This checklist does **not** cover Quote Wizard execution work. Quote Wizard should be QA'd on a separate branch/track.

## Merge Gate

This branch should not merge until the following are complete:

1. All three intercepted contact forms pass success and failure-path QA.
2. A forced non-JSON `2xx` webhook response is tested and verified to fall back to native Shopify submission.
3. `video-reviews` is preview-tested on desktop and a real mobile viewport.
4. Key templates are spot-checked for console errors after removing global jQuery/Slick.
5. Rendered schema/meta output is validated on representative URLs.

## Test Matrix

### Browsers / devices

- Desktop Chrome
- iPhone Safari
- Android Chrome

### Representative templates

- Homepage
- One product page
- One collection page
- One contact page

## Contact Form QA

Test all three intercepted forms:

- `/sections/contact-form.liquid`
- `/sections/contact-with-map.liquid`
- `/sections/icorrect-landing.liquid`

### Success path

- Submit with valid data and confirm a real JSON success response from the webhook.
- Confirm exactly one success state is shown.
- Confirm there is no duplicate submission.

### Failure / fallback path

- Force a webhook timeout or network failure.
- Confirm the form falls back to native Shopify submission.
- Confirm no false success state is shown before fallback completes.

### Non-JSON `2xx` path

- Force the webhook to return `2xx` with non-JSON content.
- Confirm the interceptor treats this as recoverable failure.
- Confirm native Shopify fallback runs instead of the custom success state.

### Validation behavior

- Leave required fields invalid/empty.
- Confirm browser validation prevents submission before JS interception.

### Contact Form Signoff Table

| Form | Success JSON | Timeout / network fallback | Non-JSON `2xx` fallback | Invalid-field browser validation | Duplicate submission check | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `contact-form.liquid` | pass / fail | pass / fail | pass / fail | pass / fail | pass / fail | |
| `contact-with-map.liquid` | pass / fail | pass / fail | pass / fail | pass / fail | pass / fail | |
| `icorrect-landing.liquid` | pass / fail | pass / fail | pass / fail | pass / fail | pass / fail | |

## Video Reviews QA

### Desktop

- Confirm layout spacing is correct.
- Confirm no console errors.
- Confirm videos render with expected controls.

### Mobile

- Confirm horizontal scrolling works.
- Confirm prev/next buttons work.
- Confirm disabled button state updates correctly at both ends.
- Confirm card snapping feels acceptable.
- Confirm actual playback behavior is acceptable to product/design.

### Video Reviews Signoff Table

| View | Layout / spacing | Controls / playback | Scroll / buttons | Console clean | Notes |
| --- | --- | --- | --- | --- | --- |
| Desktop Chrome | pass / fail | pass / fail | n/a | pass / fail | |
| iPhone Safari | pass / fail | pass / fail | pass / fail | pass / fail | |
| Android Chrome | pass / fail | pass / fail | pass / fail | pass / fail | |

## Global Dependency Removal QA

Spot-check these templates after jQuery/Slick removal:

- homepage
- product page
- collection page
- contact page

For each:

- confirm no console errors
- confirm no obvious layout/interaction regressions

### Global Dependency Removal Signoff Table

| Template | Console clean | No broken interactions | No visible layout regression | Notes |
| --- | --- | --- | --- | --- |
| Homepage | pass / fail | pass / fail | pass / fail | |
| Product page | pass / fail | pass / fail | pass / fail | |
| Collection page | pass / fail | pass / fail | pass / fail | |
| Contact page | pass / fail | pass / fail | pass / fail | |

## Schema / Meta QA

Validate on homepage and one representative collection page:

- `og:image` renders with `https:`
- `sameAs` omits blank values
- JSON-LD renders without syntax errors

### Schema / Meta Signoff Table

| Page | `og:image` https | `sameAs` omits blanks | JSON-LD valid | Notes |
| --- | --- | --- | --- | --- |
| Homepage | pass / fail | pass / fail | pass / fail | |
| Collection page | pass / fail | pass / fail | pass / fail | |

## Signoff

- Contact forms: pass / fail
- Video reviews: pass / fail
- Global dependency removal: pass / fail
- Schema / meta output: pass / fail
- Ready to merge: yes / no
- QA approver:
- Final comments:

## Notes

- No Shopify CLI or Theme Check tooling is available in this environment.
- This checklist is the required manual QA gate for the branch as currently scoped.
