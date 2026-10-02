# Diagnostic and data recovery questions

Design prototype for the quote wizard's last steps, 25 September 2026. The priced lane (screen replacement) is in the same file so the flow stays whole. The work here is the questions we ask before a diagnostic or a data recovery booking.

This is a prototype. It is not wired into the live wizard (`sections/quote-wizard.liquid`).

## How to open it

- `quote-module-standalone.html` opens offline in a browser.
- `quote-module.dc.html` is the readable source. Serve this folder (`npx serve .`) and open it. It needs `support.js` and `_ds/` beside it.

Use the fault switcher at the top: **Liquid damage** and **No power** are the diagnostic lane. **Data recovery** is its own lane. The option lists live in `quote-module.dc.html`, in the triage block of the logic class.

## Diagnostic (Liquid damage, No power)

Required. The copy says it changes how we price the job. £79 diagnostic, deducted from the repair.

1. **Has it already been to Apple?**
   - Yes
   - No
   - Not sure

   If Yes, **What did they say?**
   - They quoted a logic board or a whole replacement
   - They said it cannot be repaired
   - They told me to buy a new one
   - They would not look at it
   - They diagnosed it and I have not decided

   Optional: **What did they quote?**

   A write-off answer (logic board, cannot be repaired, buy a new one) shows "We want this job".

2. **Is the data on this device important to keep?**
   - Yes, repair it to keep the data if you can
   - No, I have a backup
   - Not sure

   Optional: serial number.

## Data recovery

Required. The copy says it tells us whether we can get the data back. £99 recovery diagnostic, deducted from the recovery.

1. **What happened to it?**
   - Liquid got on it
   - It was dropped or knocked
   - It stopped working on its own
   - It failed during or after an update
   - Something else

2. **How dead is it right now?**
   - Nothing at all: no lights, no sound, no fan
   - Some sign of life, but no picture
   - It turns on, but gets stuck on the logo or a folder with a question mark
   - It starts up, but the files or the drive are missing

3. **Has anyone tried to repair it or recover the data?**
   - No, nobody has opened it
   - Yes, Apple
   - Yes, another repair shop
   - Yes, I tried myself

   If anyone has tried, **What did they tell you?**
   - The data cannot be recovered
   - They replaced the logic board or parts
   - They opened it and gave up
   - They quoted, and I did not go ahead

4. **Do you know the login password for this Mac?**
   - Yes
   - No
   - It is not my Mac, but the owner knows it

Optional: **What matters most to get back?**

Answers can show a short note before the client continues: original board still needed if it was swapped, password needed if they said no, and "we want this job" when someone else has already written the data off.

## Additions

@ferrari-icorrect — add the questions you want clients to answer before we book a diagnostic or a data recovery. Put them under the matching heading below, and mirror them in `quote-module.dc.html` if the prototype should show them.

### Diagnostic — add here

### Data recovery — add here

## Placeholders in the prototype

Guide prices per fault, £1,049 Apple comparison, £25 express collection, £39 priority diagnostic. These are not live prices.
