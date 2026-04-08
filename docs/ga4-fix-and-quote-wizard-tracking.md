# GA4 Web Pixel Fix And Quote Wizard Tracking Audit

Date: 2026-04-08

GA4 setup found in theme
- GA4 measurement ID: G-YHN7YHZNM8
- Theme GA4 bootstrap file: layout/theme.liquid
- Legacy non-wizard GA4 form tracking file: assets/contact-form-interceptor.js
- Wizard tracking file: sections/quote-wizard.liquid

Task 1: Shopify Web Pixel fix
- The Shopify Customer Events custom Web Pixel is not stored in this repo.
- There is no local analytics.subscribe page_viewed block to edit here.
- Final deployment for this fix still needs to happen in Shopify Admin under Settings > Customer events.
- Root cause: window.location.href can resolve to sandbox web-pixels URLs inside the Web Pixel runtime.
- Required fix: use event.context.document.location.href anywhere the pixel needs the real page URL.
- Minimum admin patch pattern:
  analytics.subscribe(page_viewed, event => {
    const pageUrl = event.context.document.location.href;
  });
- Any other Web Pixel subscriptions using page location should be updated the same way.

Task 2: Quote Wizard tracking audit
- Before this change, the wizard fired PostHog events only.
- Existing wizard events found: wizard_entry, wizard_step, wizard_resolution, wizard_conversion, wizard_cart_replace_cancelled, wizard_cart_replace_confirmed, wizard_collection_fetch_failed, wizard_product_fetch_failed, wizard_resolution_abandoned, wizard_abandoned.
- Before this change, the wizard fired no GA4 events of its own.
- The old GA4 contact event in assets/contact-form-interceptor.js does not cover the wizard.

What should fire for the wizard
- wizard_start once per wizard journey
- step_complete for device, model, fault, and issue selections
- wizard_submit for successful checkout, question submit, contact submit, and email quote submit
- begin_checkout after successful cart add and before checkout redirect
- form_start when wizard lead forms are opened
- form_submit and generate_lead when wizard lead forms submit successfully
- purchase should stay in Shopify checkout and the Web Pixel, not the storefront wizard

Local theme changes made
- Added a GA4 helper layer to sections/quote-wizard.liquid
- Added wizard_start once per wizard journey
- Added step_complete for device, model, fault, and issue selections
- Added wizard_submit and begin_checkout after successful cart add
- Added form_start for question, contact, and email quote entry points
- Added form_submit and generate_lead for successful wizard lead submissions

Files changed locally
- sections/quote-wizard.liquid
- docs/ga4-fix-and-quote-wizard-tracking.md
