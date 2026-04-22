# Marketing Brief: Cookie Consent Banner Blocking Recordings
**Date:** 2026-04-22
**Author:** Marketing Jarvis
**Priority:** P1 — Data quality

---

## Problem

The cookie consent banner is a large modal that covers the entire page. In PostHog session recordings, this banner blocks the view of user interactions, making it impossible to analyze behavior.

**Evidence:**
- Screenshot from PostHog recording (desktop): [user-provided image showing massive cookie consent modal]
- Screenshot from PostHog recording (mobile): [user-provided image showing banner covers ~80% of screen]
- Recording IDs: `019dafec-1e71-7fbc-8e40-a8be901c16b4`, `019db2b4-be27-71fd-a77e-...`
- Banner appears on every new session, blocking all content

**Impact:**
- Cannot see user clicks, scrolls, or form interactions in recordings
- Heatmaps are unusable while banner is visible
- Cannot analyze first-time visitor behavior (when banner shows)
- Mobile experience is severely degraded — banner covers almost entire screen

---

## Hypothesis

The cookie consent banner is injected by a Shopify app (not in theme files). It's configured to show as a full-page modal instead of a minimal banner.

**Confirmed:**
- Not found in theme files (`grep` for "cookie" returned no results)
- Likely from Shopify's built-in cookie consent or a third-party app

---

## Fix Options

### Option 1: Minimize banner to bottom bar (Recommended)
Change the cookie consent from a full-page modal to a small banner at the bottom of the screen.

**Tradeoffs:**
- Pro: Users can still see and interact with the site
- Pro: PostHog recordings show actual user behavior
- Pro: Compliant with GDPR/CCPA
- Con: May require app settings change or CSS override

**Implementation:**
If using Shopify's built-in cookie consent:
- Go to Shopify Admin > Online Store > Preferences > Customer privacy
- Change banner style to "Banner" instead of "Modal"

If using a third-party app:
- Check app settings for banner style options
- Or add CSS override:
```css
/* Minimize cookie banner */
[class*="cookie-banner"],
[id*="cookie-banner"] {
  position: fixed !important;
  bottom: 0 !important;
  top: auto !important;
  left: 0 !important;
  right: 0 !important;
  max-height: 80px !important;
  width: 100% !important;
}

/* Remove dark overlay */
[class*="cookie-banner"] ~ [class*="overlay"],
[id*="cookie-banner"] ~ [class*="overlay"] {
  display: none !important;
}
```

### Option 2: Hide banner in PostHog recordings
Add CSS to hide the cookie banner specifically for PostHog's capture.

**Tradeoffs:**
- Pro: Recordings show clean page
- Con: Banner still blocks real users
- Con: May violate recording accuracy

**Implementation:**
```css
/* Hide cookie banner in PostHog recordings */
html.ph-capture [class*="cookie-banner"],
html.ph-capture [id*="cookie-banner"] {
  display: none !important;
}
```

### Option 3: Delay banner appearance
Show the cookie banner after 10 seconds or after first interaction.

**Tradeoffs:**
- Pro: Users can start browsing immediately
- Pro: Recordings capture initial behavior
- Con: May not comply with strict privacy requirements

### Option 4: Remove banner entirely
If you're not using cookies for tracking (PostHog uses localStorage, not cookies), you may not need a cookie consent banner.

**Tradeoffs:**
- Pro: Cleanest solution
- Pro: Better user experience
- Con: Need to verify no other cookies are used (Shopify, Meta Pixel, Google Analytics)

---

## Acceptance Criteria

- [ ] Cookie banner does not block page content in PostHog recordings
- [ ] Users can still accept/decline cookies
- [ ] Banner complies with GDPR/CCPA requirements
- [ ] PostHog heatmaps show actual page content, not banner

---

## Priority

**P1 — Fix after image loading issue.** This affects data quality but also severely degrades mobile user experience.

---

## Notes

- Check Shopify Admin > Online Store > Preferences > Customer privacy for built-in settings
- If using a third-party app, check app settings first
- The banner may be from: Shopify Privacy & Compliance, CookieYes, OneTrust, or similar
