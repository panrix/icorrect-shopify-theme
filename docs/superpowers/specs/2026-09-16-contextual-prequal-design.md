# Contextual pre-qual — design

Date: 2026-09-16  
Status: building on unpublished preview 2026-09-16. Do not publish live.  
Repos: `panrix/icorrect-shopify-theme` (wizard) · Typeform `sDieaFMs` · Monday board `349212843` · Back Market scraper v7  
Builds on: details-first lead gate (name / email / mobile / postcode before price).

## What this is

Level 1 of the quote wizard was device + fault + price.  
Level 2 (last 24 hours) is details-first so we can follow up.  
Level 3 is this: ask a short, contextual set of the questions we already ask after booking, so the quote is a conversation, not a fee.

The trigger is the **fault**, not the brand. They pick the device and the model first. If the fault is liquid, dead / not powering, or another diagnostic chip, we ask more. We already know it is a 16 Pro or an M4 Pro; the extra answers let us decide whether this is a repair-to-keep-data job, a replacement conversation, or a call.

MacBook is the hunt. That is where AdWords gets built and where we fight for orders. The same wizard questions still fire on other devices when the fault is diagnostic — a dead iPhone 16 Pro (no liquid) is a £2,500-class machine coming in for a £49 diagnostic. There is money in that. Ads do not have to chase it first.

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

**iPhone 16 Pro is the same gap on the phone side.** Live diagnostic SKU is £49 (`iphone-16-pro-diagnostic`). v7’s iPhone/iPad URL list (27 models) goes as far as iPhone 16 128GB Black/Teal and iPhone 15 Pro 128GB. **There is no iPhone 16 Pro / 16 Pro Max in the scrape.** Same rule: do not print £2,500 as a Back Market number until that listing is in the file. The *shape* is right — a dead 16 Pro is a replacement-class device, not a battery quote.

## Current wizard behaviour (why this feels thin)

After issue chips:

- **Known repair** (iPhone battery, most screens): details-first → all-in price → courier / mail-in. Same-day / Fast hidden on the paths we already hide. Correct. Do not add a journey here.
- **Diagnostic** (liquid, dead, won’t charge, data recovery): details-first → **Book a Diagnostic** + the diagnostic SKU + a “from £249 / £199 if the board needs work” guide. Collect → diagnose in 3 working days → email quote → they decide.

That diagnostic card is a fee. Live SKUs: iPhone 16 Pro diagnostic **£49**, MacBook Pro 14" M4 diagnostic **£49**. Same card for a £2,000-class machine and a cheap unknown. It is not: this is a job we want · we will move · Apple already said no · data matters · repair vs replace.

## Two jobs, not one screen (2026-09-16)

Ricky split this correctly. They are related. They are not the same build.

| | 1. Contextual pre-qual | 2. High-value convert |
|---|---|---|
| Job | Learn Apple outcome, data, serial | Treat a winner like a winner |
| We already have | Almost nothing until they answer | Device + model + fault chip **right now** |
| Risk if we do it first | Three more fields before they see we want the work. AdWords drop-off. | We call / collect without knowing Apple said no. Still a good lead. |
| Converts | Ferrari later, warmer | The person in the wizard **now** |

**Ship 2 first. Put 1 on the same card, not in front of it.**

We do not need Apple to know an M4 Pro with liquid, or a 16 Pro that is dead, is a machine we fight for. Asking first, then showing a £49 fee, is the opposite of “how can we get this done quickly.”

### High-value detect (automatic, no extra questions)

A quote is **high-value** when the issue chip is already `diagnostic` **and** the model is replacement-class:

- MacBook Pro M-series (M1+), especially 14/16 M3/M4 — this is the AdWords hunt
- MacBook Air M3/M4 + liquid or dead
- iPhone 15 Pro / 15 Pro Max / 16 / 16 Pro / 16 Pro Max + dead or liquid
- iPad Pro M-series + dead or liquid

A 2018 Air with a spill is diagnostic. It is not this treatment. Cheap batteries are never this treatment. A **priced MacBook Pro screen** is Lane B below, not a diagnostic.

### Two convert lanes (Ricky 2026-09-16)

These are how we “get it done quickly” and whether we eat collection.

Live costs we already have:

| Fact | Number |
|---|---|
| N7 | **B1**. Economy collect **£11.96** in the 10 Sep band file. RT ≈ **£24**. Night Gophr probe: outer B1 £11–£13, ride 36–60 min. |
| MacBook Pro 16" M3 screen | Catalogue **£699**. Older family margin: 16" screen after parts **~£352**, after free B1 RT still **~£320**. Holds easily. |
| Same model diagnostic | **£49**. After free B1 RT **£17–32** left. Conversion bet. |
| Policy already | B1–B2 **≥£200** collection + return is **free**, baked in. N7 + £699 screen is already free collect. We are not inventing that subsidy. |
| Same-day | MacBook **+£149**, 3 slots, morning collect, MacBook book-by **11:00**, unpublished. Not for diagnostics. |
| Fast | MacBook **+£79** = 1 working day after collection. |

#### Lane A — high-value diagnostic (unknown board)

Goal: **get it in today**, diagnose fast, word back. Then they buy the repair or the replace.

- **The convert is collect today.** Copy: we can collect it today. Windows run **into the afternoon**. As long as the machine is on a bike today, it is in. That is the line that converts. Not “diagnosed in 24 hours.” Not same-day repair.
- Hour-collect language on B1 economy ASAP is fine when the window is still morning. After that, still sell **today** — last afternoon window — not tomorrow.
- **Eat collection (one leg, ~£12)** on M-series Pro / 15–16 Pro dead-or-liquid only. Still charge the **£49** diagnostic. If they refuse the repair we still owe a return (~£12 more). Worst case ~£25 left on the fee. Acceptable **only** on those models, **B1 only**. Do not eat B2–B4 or old Airs.
- **Word back in 24 hours is optional, and it has a dial.** It is not Saturday. It is **Safan** (Safan Patel, lead repair tech — Short Deadline queue, diagnostics / board-level). If Safan is stacked, we **dial down**: copy becomes next working day, whatever that date is. Fail closed. One workshop-os / ops switch (or a count on Safan Short Deadline) so when the bench is overwhelmed we stop promising 24h without a theme deploy.
- Same-day *repair* stays off. We do not burn a slot on an unknown board.
- Fast +£79 on diagnostic stays as an optional paid pull-forward if 24h is dialled down. Do not give Fast away on a £49 fee.

This is the “at least let’s get it in” lane. The ticket we want is the repair after the quote, not the £49. Collect today is how we start winning it.

#### Lane B — known high ticket, part in stock (the N7 16" M3)

Goal: collect today because profit is already in the job. Upsell **time**.

Example: MacBook Pro 16" M3 screen, N7, part on the shelf.

- Collection is **already free** (≥£200 + B1). Taking the hit is the current policy. Do it. Do not show +£25.
- **Included clock for this lane only:** collect today, **back tomorrow** (1 working day). That is today’s Fast clock, **given away** on in-stock MacBook Pro screens / keyboards **≥£279** in B1/B2. After-parts on a 16" screen still clears £300. We can afford it to convert.
- **Paid upsell:** back **today** = same-day **+£149** if a slot is left and it is before the MacBook 11:00 morning cutoff. Hidden when 0 slots or no stock.
- Do **not** give tomorrow-free on MacBook battery (£199–£249) or anything under the high-ticket line. Those stay Standard 3 working days + paid Fast.
- AdWords and this treatment **target only these higher tickets** (MacBook Pro screen / keyboard / liquid-dead diagnostic). Not iPhone batteries. Not cheap screens.

N7 same-day is the edge of B1 (longer ride). Morning collect still fits the locked cutoff. If the slot is gone, tomorrow-free is the convert, not a fake today.

### What the high-value card says (v0, unpublished)

Lead with the convert, not the fee.

**Lane A (diagnostic):** we want this job · **shout the collect** — weekday morning B1: a courier can be with you in ~1 hour; after noon: last afternoon window today; after 17:00 / weekend: first bike next working day · word back in 24 hours only if Safan is not stacked, else next working day · we’ll call you (default on) · £49 is how we start · repair vs replace after we look.

**Lane B (in-stock high ticket):** collect today, free · back tomorrow, included · back today +£149 if a slot · we’ll call you optional.

Repair-vs-replace numbers stay honest: only if v7 has the model. Until then, one line: we can talk like-for-like once we have the serial or we’ve looked. Do not invent £2,500.

### Where the questions sit (v1, same card)

Apple / data / serial do **not** gate the call or the book button.

They sit under the convert copy, short, skippable except Apple yes/no on high-value. If they say Apple refused, the card can tighten (“Apple have already said no — this is the job we take”) and the Slack brief gets `apple_outcome`. If they skip, we still treat them as high-value from model + fault.

That is how we get both without slowing the winners.

## Approaches

### A — Dump the whole Typeform into the wizard

Every quote gets all 11 questions before a price.

Reject. Kills the battery / screen path we are trying to convert on courier. Puts a passcode on a public page. Two minutes of form before a £79 job.

### B — Same questions for every device, after the price

“You’ve seen £X, now tell us more.”

Reject for the winners. The point is to *change the offer* before they see a lonely diagnostic fee. After-the-price is fine for passcode / software / accessories (keep that post-book).

### C — Fault-triggered pre-qual (locked)

Keep Level 2 as-is for known cheap / mid repairs (battery, cracked screen, priced parts).

The extra questions fire when **the issue chip is already a diagnostic**, on any device we quote. Device + model are already known. The questions decipher the job.

**In (fault chips that already route to `diagnostic`):**

- Liquid / spill / submerged (MacBook, iPhone, iPad)
- Dead / won’t turn on / no display no response (including iPhone “Phone dead, need data”)
- Won’t charge when that chip is diagnostic, not a priced port/battery
- Data recovery / “need data from a dead device”

**Out (no extra questions, normal all-in price):**

- iPhone / iPad / MacBook priced screen with no liquid
- iPhone / MacBook battery
- Other priced parts (camera, rear glass, keyboard without liquid)
- Watch — leave the existing diagnostic / repair split; not the AdWords hunt

A dead iPhone 16 Pro with no liquid **is in**. That is the point. We already know the model. We ask Apple / data / optional serial, then show repair-vs-replace, not only “£49 diagnostic.”

**AdWords / acquisition (separate from the wizard gate):**

- Hunt: **MacBook Pro** liquid, dead, won’t power, **and in-stock screen**. Higher tickets only.
- The iPhone dead-16-Pro path is in the wizard so organic / direct / existing traffic still gets the conversation. It is not the first ad group.

## Recommended design (v1)

### Extra questions (website)

Ask these **only** on diagnostic routes, **on the same card as the convert copy**. They do not block book or call. Yes/no and short choice. No passcode.

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
Back Market Good-grade from scraper v7 **only when that model exists in the scrape**. If it doesn’t (M4 Pro and iPhone 16 Pro today), say “we’ll price a like-for-like once we have the serial / we’ve looked” — do not invent £2,500.

**Talk to us**  
On **high-value** quotes the call checkbox is **default on**. On ordinary diagnostics it stays off. Slack / Intercom ping to Ferrari with the brief. Human calls back. AI voice stays later.

Diagnostic fee still exists. It is how they start. It is not the headline on a high-value card.

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

Add M4 Pro 14/16 (and M5 when it lists) and **iPhone 16 Pro / Pro Max** to scraper v7. Until then, replacement is a conversation, not a number. AdWords copy can still talk about repair vs replace; the website must not invent a BM price.

## Success

We will know this is working when, on unpublished preview then live:

- Lane A: collect today (afternoon OK) is the headline. 24h diagnose only when the Safan dial is open; else next working day. Call default-on. Apple questions optional on the same card.
- Lane B (in-stock MacBook Pro screen/keyboard, B1/B2): tomorrow included, same-day +£149 only when a slot exists.
- High-context quotes that *do* answer store `apple_outcome` and `data_important` on the lead.
- Apple-refused + liquid/dead + recent high-value model is a tagged lead Ferrari can see the same day.
- iPhone battery / cheap screen path is unchanged (no extra questions, no free Fast).
- AdWords targets MacBook Pro liquid/dead **and** MacBook Pro screen (higher tickets only).

## Locked decisions (2026-09-16)

- Gate is the **fault**, not the brand. Liquid / dead / not powering → extra questions. Battery / vanilla screen → no extra questions.
- Questions run across MacBook, iPhone, and iPad when that fault is selected. Device + model are already in the wizard.
- **AdWords hunts MacBook Pro higher tickets** (liquid / dead / screen). iPhone 16 Pro dead stays in the wizard; it is not the first ad group.
- Do not print a replacement £ until v7 has that model (M4 Pro and 16 Pro are both missing today).
- **Two modules.** High-value convert (model + fault → we want this, we call, we collect fast) ships first. Pre-qual questions sit on that same card and do not block book / call.
- **Lane A (diagnostic):** B1 collect **today, into the afternoon**. Eat one leg on M-series Pro / 15–16 Pro only, still charge £49. 24h word-back only if Safan Short Deadline is not stacked; one dial to drop that to next working day when overwhelmed. No same-day repair.
- **Lane B (known high ticket, in stock, B1/B2):** collection already free at ≥£200. Included clock = back tomorrow. Same-day +£149 if a slot. Not for batteries.
- AdWords and this treatment target **higher tickets only** (MacBook Pro screen / keyboard / liquid-dead).
