# Contextual pre-qual — design

Date: 2026-09-16  
Status: draft — note only. Do not implement until Ricky signs this off.  
Repos: `panrix/icorrect-shopify-theme` (wizard) · Typeform `sDieaFMs` · Monday board `349212843` · Back Market scraper v7  
Builds on: details-first lead gate (name / email / mobile / postcode before price).

## What this is

Level 1 of the quote wizard was device + fault + price.  
Level 2 (last 24 hours) is details-first so we can follow up.  
Level 3 is this: ask a short, contextual set of the questions we already ask after booking, so the quote is a conversation, not a fee.

The winners Ricky described are real, and rare: M4 (or similar) MacBook, liquid, Apple have already said no. Those clients take the offer. The website today cannot see that, because those answers only exist on the post-book Typeform.

This spec is the note. AI voice (Ricky → Ryan → Ferrari) is a later module, after this one works.

## Live pre-repair form (looked at, 2026-09-16)

Canonical customer form: Typeform **Pre-Repair Questions** `https://form.typeform.com/to/sDieaFMs` (id `sDieaFMs`).

Sent after a job is booked, while the device is on the way. Hidden fields: `monday_item_id`, `conversation_id`. Walk-in doorstep drop-offs often skip it; booked walk-ins, courier, and mail-in usually get it.

Workshop-os already has a Typeform-parity copy (`PreRepairFields`, `/pre-repair/:id`). Nahid ops maps `appleDiagnosed` and treats `no` as “Apple declined service” in the intake brief. That mapping is wrong for the live question: the Typeform only asks whether Apple **diagnosed**, not whether they refused.

### The 11 items (verbatim)

| # | Question | Type | When it belongs |
|---|----------|------|-----------------|
| 1 | Please confirm your email. | short_text | Already on the wizard (details-first). |
| 2 | Please describe the current issue with your device and how it happened. | long_text | Wizard already has issue chips. Free-text “how it happened” is the missing half. |
| 3 | **Has your device been diagnosed by Apple?** | yes_no | **The one that changes the quote.** Missing a follow-up: what did they say? |
| 4 | Was your device purchased new or refurbished? | choice | Useful for warranty / prior repair risk. Not first-screen. |
| 5 | Has your device had any previous repairs? | long_text | Same. |
| 6 | Are there any other issues you’ve noticed? | long_text | Optional. |
| 7 | Do you have the data on your device backed up? | choice | High-value on liquid / dead / diagnostic. |
| 8 | Is the data stored on your device important, and should it be preserved if possible? | yes_no | Same. This is how we talk about repair-to-retain-data vs replacement. |
| 9 | Please provide your device passcode | short_text | **Stay post-book.** Do not put a passcode on the public quote. |
| 10 | Can we update your device software if needed? | choice | Stay post-book (calibration). |
| 11 | Remove cases, chargers, accessories. | statement | Stay post-book (pack / collect). |

Welcome copy: “a few quick questions (takes about 2 minutes).”

## What the booked-job data actually shows

Typeform API, 135 responses, 2025-09-10 → 2026-09-15 (almost all Jul–Sep 2026). 132 of 135 carry a Monday item id. Joined to main board `349212843` on 2026-09-16 (142 rows; a few emails hit more than one item).

**Do not treat “been to Apple = yes” as “this client will buy a big repair.”** In the booked cohort it does not.

| Been to Apple? | Jobs | Paid n | Mean paid | Median paid | Diagnostic share | Liquid in the write-up |
|---|---:|---:|---:|---:|---:|---:|
| Yes | 27 (19%) | 26 | £272 | **£194** | **15 / 27 (56%)** | **37%** |
| No | 115 | 107 | £309 | **£308** | 26 / 115 (23%) | 19% |

Apple-yes paid buckets: 10 under £150, 5 at £150–299, 7 at £300–499, 3 at £500–799, **1 at £800+**.  
Apple-no: 30 / 23 / 39 / 13 / 2.

Only **1 / 27** Apple-yes write-ups mention Apple refusing. The form never asks what Apple said. That is the hole.

What *is* true, and matches the shop-floor instinct:

- Apple-yes jobs are **more than twice as likely to be liquid** (37% vs 19%).
- They are **more than twice as likely to land as Diagnostic** rather than a priced repair.
- They are **not** higher spend *after they have already booked*. The form arrives too late to change the offer. The website still sold them a diagnostic fee.

Monday’s **Been to Apple?** mirror (`lookup_mkshhjqh`) is **blank on all 2,806 live items**. The answers exist on Typeform (and 132 are linked by hidden Monday id) but they do not land on the board Ferrari works. Info Capture is “No Information” on 2,382 / 2,806. We are sitting on the signal and not using it.

## Replacement value (scraper v7)

File: `/home/ricky/apps/backmarket/buyback-monitor/data/sell-prices-latest.json` → `sell-prices-2026-09-14.json`. Scraped 2026-09-14 01:30 UTC. 16 models, 217 spec combos.

**There is no live M4 MacBook Pro, and no M5, in this scrape.** Air 13" 2025 M4 is listed but has no Fair/Good/Excellent prices. We cannot yet print “equivalent replacement ≈ £2,500” for an M4 Pro from this file.

Closest Good-grade ranges that *are* priced:

| Model in v7 | Good-grade spec prices (available) |
|---|---|
| Air 13" 2024 M3 | £889–£1,499 (med £999, n=22) |
| Pro 14" 2023 M3 | £1,999–£2,300 (n=3) |
| Pro 14" 2023 M2 Pro | £1,600 (n=1) |
| Pro 16" 2023 M2 Pro | £1,436–£3,800 (n=2, noisy) |
| Pro 16" 2023 M3 Pro | £3,150–£4,499 (n=2, noisy) |

Ricky’s £2,500 replacement / £1,500–£1,800 like-for-like / £500–£800 repair band is the right *shape* for a high-spec 14" Pro. We should not invent an M4 Pro number until v7 actually scrapes that listing. Serial → exact spec is how that number becomes honest.

## Current wizard behaviour (why this feels thin)

After issue chips:

- **Known repair** (iPhone battery, most screens): details-first → all-in price → courier / mail-in. Same-day / Fast hidden on the paths we already hide. Correct. Do not add a journey here.
- **Diagnostic** (liquid, dead, won’t charge, data recovery): details-first → **Book a Diagnostic** + the diagnostic SKU + a “from £249 / £199 if the board needs work” guide. Collect → diagnose in 3 working days → email quote → they decide.

That diagnostic card is a fee. It is not: Apple already said no · data matters · here is repair vs replace vs we will call you.

## Approaches

### A — Dump the whole Typeform into the wizard

Every quote gets all 11 questions before a price.

Reject. Kills the battery / screen path we are trying to convert on courier. Puts a passcode on a public page. Two minutes of form before a £79 job.

### B — Same questions for every device, after the price

“You’ve seen £X, now tell us more.”

Reject for the winners. The point is to *change the offer* before they see a lonely diagnostic fee. After-the-price is fine for passcode / software / accessories (keep that post-book).

### C — Route-aware pre-qual (recommended)

Keep Level 2 as-is for known cheap / mid repairs.

On **high-context routes only**, insert 3–4 questions after details-first and **before** the offer card. Use the answers to pick one of three offers.

High-context routes (v1):

- Any `route === 'diagnostic'`
- MacBook + liquid / won’t turn on / data recovery
- MacBook Pro M-series (M1+) even when the chip is a priced screen, if they also tick liquid or “been to Apple”

Not in v1 (still take details, still show the normal price):

- iPhone battery
- iPhone / iPad priced screen with no liquid and no Apple visit
- Watch (leave the existing diagnostic / repair split)

## Recommended design (v1)

### Extra questions (website)

Ask these **only** on high-context routes. Yes/no and short choice. No passcode.

1. **Has it been to the Apple Store / Apple for a diagnosis?**  
   Yes / No / Not sure  
   If Yes → **What did they say?**  
   - They said they won’t repair it  
   - They quoted a replacement / whole-unit swap  
   - They quoted a repair (tell us roughly)  
   - They weren’t sure / I didn’t go ahead  
   This is the question the Typeform is missing. This is the qualifier.

2. **Is the data on this device important to keep?**  
   Yes, repair to keep the data if we can / No, I have a backup / Not sure

3. **Optional serial**  
   “If you can read the serial (underside / About This Mac / Settings), we can price a like-for-like replacement properly.” Skip allowed. Do not block the quote.

Do **not** ask purchased-new, previous repairs, other issues, passcode, software update, or accessories on the website. Those stay on `sDieaFMs` after book.

### Three offer cards (diagnostic / high-context only)

Not a single “Book a Diagnostic” fee. A short options block, honest that we still diagnose.

**Repair (retain data)**  
Estimate band from the issue + model, not a fake fixed board price. Copy: we diagnose first; if it would exceed this band we stop and tell you; we repair to keep the data where we can.

**Replace with the same class of machine**  
Back Market Good-grade from scraper v7 **only when that model exists in the scrape**. If it doesn’t (M4 Pro today), say “we’ll price a like-for-like once we have the serial / we’ve looked” — do not invent £2,500.

**Talk to us**  
“We’ll call you on the mobile you just gave us.” Checkbox default off. This is the stub for the later AI → Ferrari path. v1 = Slack / Intercom ping to Ferrari with the brief, human calls back.

Diagnostic fee still exists. It is the way they start Repair or “we’re not sure.” It is not the only sentence on the page.

### What we store

On `quote_events` / webhook / cart attributes (no passcode):

- `apple_diagnosed` yes/no/unknown  
- `apple_outcome` refused / replacement_quoted / repair_quoted / unsure  
- `data_important` yes/no/unknown  
- `serial` if given  
- existing lead + device + model + issue + route

After they book, Typeform still goes out. Prefill email + skip questions we already have, so we don’t ask twice. That is a workshop-os / n8n change, not the theme.

### Monday

Separate, small ops fix (workshop-os): write Typeform `appleDiagnosed` + the new `apple_outcome` onto the main-board **Been to Apple?** column (or a new status). The mirror is dead. Ferrari should see this without opening Typeform.

### What we do not build in v1

- AI voice agent (“Ricky” then “Ryan” then Ferrari). Phone number is already on the lead; the call graph is a later module.
- Live M5 / new-unit retail pricing.
- Trade-in checkout / BM buy-flow.
- Showing replacement prices for models v7 has not scraped.
- Passcode, software consent, or accessory rules on the website.
- Changing live H1 / theme publish. Unpublished preview only, same rule as the last wizard PRs.

## Later modules (parked, not forgotten)

**Voice, after this wizard module is live**

1. Client ticks “call me” and we have a mobile.  
2. Agent 1 (Ricky): disclose AI, ask if they want a short pre-repair, then connect.  
3. Agent 2 (Ryan): three questions only — Apple outcome, data, anything else we didn’t get on the site — then warm-handoff brief.  
4. Ferrari (or callback) converts with the brief already written.

Do not start this until the website questions exist and land on Monday. Otherwise the agent is reading an empty brief.

**Replacement catalogue**

Add M4 Pro 14/16 (and M5 when it lists) to scraper v7. Until then, replacement is a conversation, not a number.

## Success

We will know this is working when, on unpublished preview then live:

- High-context quotes store `apple_outcome` and `data_important` on the lead.
- Apple-refused + liquid + recent MacBook Pro is a tagged lead Ferrari can see the same day.
- Known iPhone battery / screen path is unchanged (no extra questions, no slower checkout).
- We can pull Apple-refused vs Apple-yes vs Apple-no against paid amount going forward. We cannot do that today because the form never asked the follow-up.

## Open decision (one)

Confirm the v1 gate: extra questions **only** on diagnostic + MacBook liquid/dead/data + M-series Pro with Apple or liquid — not on iPhone battery / vanilla screen.

If that is wrong, say so before anything is built.
