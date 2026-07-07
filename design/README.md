# iCorrect — New Website Design (Audit Package)

This is the proposed redesign of icorrect.co.uk, exported for independent review.
It is NOT the live site — do not compare against icorrect.co.uk expecting a match.

## How to run

The pages use in-browser JSX, so they must be served over HTTP (file:// will not work):

    cd into this folder, then:  npx serve .
    or:                         python3 -m http.server 8000

Then open: `iCorrect Homepage.html`

## Pages

- iCorrect Homepage.html — flagship; quote wizard in hero (the core conversion surface)
- MacBook Screen Collection.html — collection template (device+fault pre-filled wizard)
- MacBook Screen Repair - Product Page.html — product template (model+price pre-filled)
- MacBook Repairs.html — category page
- Liquid Damage Process.html / Board-Level Diagnosis.html / How It Works.html — process pages
- Why Us.html · Corporate Services.html · Careers.html · Contact.html · Repair Case Study.html

## Review tools included

- Mobile Fold Audit.html — every key page at iPhone widths with the Safari first-fold line marked
- Desktop Spacing Audit.html — all pages at 1440px with a section-spacing measurement script
- Mobile Sign-off.html — interactive 390px frames

## Context for the auditor

- One wizard engine everywhere: qw/QuoteWizardV3 (flow) + qw/QuoteTiersV6 (quote) + qw/QuoteModalV7 (modal). Three entry depths (homepage / collection / product).
- Pricing resolves to three outcomes: fixed price · estimate band · £49 diagnostic (a separate one-off charge, never credited).
- "Book" hands off to Shopify checkout — customer details/payment are deliberately not designed here.
- Decisions log: `Quote Wizard - Notes.md`
- Known open items: iPhone/iPad collection pages (MacBook page is the template), "Full" walk-in slot state, corporate stats pending verification, case-study photos are placeholders.

Design system: near-monochrome Geist-based; borders are box-shadow rings (never `border:`);
weights 400/500/600 only; blue #38598C primary accent, orange #BC6A2C secondary; gold review stars.
