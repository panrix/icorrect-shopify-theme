# iCorrect Theme v11 Series Changelog

## Version 11.11 — 29 December 2025

### Summary
Clean build based on v11.9, applying content fixes and bug fixes without the problematic CSS changes from v11.12-13.

### Changes

#### 1. FAQ and Content Link Removal
- **Scope**: 24 template JSON files
- **Action**: Stripped all anchor tags from FAQ headings, FAQ content, and details fields
- **Reason**: Links in FAQ sections appeared as black text on dark backgrounds; redundant links in card descriptions caused spacing issues due to nested anchor tags
- **Benefit**: Cleaner content, no more invisible FAQ links, proper text rendering

#### 2. Social Icon Alt Text & Schema Fix
- **File**: sections/footer.liquid
- **Changes**:
  - Alt text: Google→Instagram, LinkedIn→TikTok, X→YouTube
  - Schema IDs and labels updated to match actual icons

#### 3. Missing Alt Text Added (Accessibility)
- **Files**: banner-info.liquid, find-your-repair.liquid, header.liquid, icorrect-blog.liquid, repair-services.liquid, parent-categories.liquid
- **Action**: Added appropriate alt attributes

#### 4. MacBook Capitalisation Fix
- **File**: sections/google-reviews.liquid
- **Change**: "Macbook" → "MacBook"

#### 5. COVID-19 Text Removal
- **File**: templates/collection.macbook-collections.json
- **Change**: "Covid-19 secure drop off service" → "walk-in drop-off service by appointment"

#### 6. Mobile Button Color Fix
- **File**: sections/repair-contact-row.liquid
- **Change**: Added !important to mobile button color values
- **Reason**: Section swaps button styles on mobile, but base.css was overriding colors

### Testing Checklist
- [ ] Homepage "Unsure which repair" buttons visible on mobile
- [ ] FAQ sections display correctly (no broken links)
- [ ] Find Your Repair cards have proper spacing
- [ ] Social icons in footer have correct alt text
- [ ] All buttons site-wide have visible text

### Base Version
Built from v11.9

---
*Last updated: 29 December 2025*
