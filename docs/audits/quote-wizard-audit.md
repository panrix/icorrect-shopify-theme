# Quote Wizard Audit

**Date:** 2026-03-18
**Auditor:** Jarvis
**Source file:** quote-wizard-original.html
**Cross-referenced:** KB pricing (macbook/iphone/ipad/watch), Meesha's intake flows, service fees

---

## Part 1: Structural Issues

### 1.1 No issue-level repair routing
The biggest gap. Currently `showRes()` looks up `PRODUCTS[S.model][S.fault]` — it routes by fault category only. But many issues within the same fault category need completely different repairs.

**Example:** MacBook > Trackpad/Keyboard:
- "Keys not responding" → Keyboard Repair (£249+)
- "Sticky or stuck keys" → Diagnostic (£49) because it's almost always liquid damage
- "Trackpad not clicking" → Diagnostic (£49) because it could be swollen battery
- "Ghost typing" → Diagnostic (£49) because it's liquid damage

All four currently route to the same product. They shouldn't.

**Fix:** Add a `repairRoute` field to each issue in the TS object. The `showRes()` function should use `S.fault + S.issue` to determine what repair product/outcome to show.

### 1.2 Three outcome types needed
Not every path ends at a priced product page. The wizard needs three resolution types:

1. **Direct repair** — known repair, show price, link to product page. "We can fix this."
2. **Diagnostic** — ambiguous symptom, needs tech assessment. "We need to take a look." Show £49 diagnostic fee.
3. **Contact** — unusual/complex case. "Let's chat about this." Show contact form only.

### 1.3 Diagnostic is a flat £49 across all devices
MacBook diagnostic: £49. iPhone diagnostic: £49. iPad diagnostic: £49. Watch diagnostic: £19.
The diagnostic resolution doesn't need model-specific product lookup. It's a universal endpoint.

### 1.4 Missing "Flexgate" and "Dustgate" routing
We offer Flexgate Repair (£349) on A1706/A1707/A1708 and Dustgate Repair on select models. These are currently hidden under generic screen descriptions.

### 1.5 Price in PRODUCTS object is wrong
The sample data shows MacBook Air M1 Screen at £339 and Battery at £219. KB says Screen = £339 (correct) but Battery = £179 (the file says £219, which is wrong).

---

## Part 2: Issue-by-Issue Routing Map

### Legend
- **→ REPAIR:** Direct repair, show price + booking link
- **→ DIAGNOSTIC:** Show diagnostic fee (£49 Mac/iPhone/iPad, £19 Watch), explain why assessment is needed
- **→ CONTACT:** Show contact form, no price

---

### MacBook — Screen / Display

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Cracked or shattered screen | → REPAIR | Screen Repair | Your MacBook screen is damaged and needs replacing. We use genuine Apple displays and preserve True Tone calibration. |
| 2 | Lines, discolouration, or artefacts | → REPAIR | Screen Repair | Lines or colour issues on your display typically mean the LCD panel needs replacing. We use genuine displays with full colour calibration. |
| 3 | Dead pixels or bright spots | → REPAIR | Screen Repair | Dead or stuck pixels indicate panel failure. A genuine display replacement will restore your screen to full quality. |
| 4 | Black screen (external works) | → REPAIR | Screen Repair | Your MacBook works fine on an external monitor, which confirms the issue is the built-in display. A screen replacement will fix this. |
| 5 | Black screen (external doesn't work or untested) | → DIAGNOSTIC | Diagnostic | A completely black screen with no external output could be the display, logic board, or GPU. We need to run a diagnostic to pinpoint the cause before recommending a repair. |
| 6 | Backlight fading or dim at angle | → REPAIR | Screen Repair (Flexgate on A1706/A1707/A1708) | This is a known issue on certain MacBook Pro models where the display cable wears over time. The backlight fades or cuts out when the lid is opened fully. We'll replace the affected components. |
| 7 | Dust or debris behind the screen | → REPAIR | Screen Repair (Dustgate on applicable models) | Dust or particles trapped behind the glass is a known issue on some MacBook models. We'll replace the display to eliminate the debris and restore a clean picture. |

**Changes from current:**
- Split "Black screen" into two paths (external works vs doesn't)
- Added Flexgate/Dustgate notes for applicable models
- Rewrote all copy to be customer-facing and technically accurate
- Removed "Dead pixels" separate entry, merged with "bright spots"

---

### MacBook — Power / Battery / Charging

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Battery draining quickly | → REPAIR | Battery Replacement | Your battery has degraded and isn't holding a full charge. We replace it with an original-spec battery and your MacBook will show accurate health monitoring again. |
| 2 | "Service Recommended" warning | → REPAIR | Battery Replacement | macOS is telling you the battery needs replacing. We use original-spec batteries and your health monitoring will report accurately after the swap. |
| 3 | Battery swollen or expanding | → REPAIR | Battery Replacement (URGENT) | A swollen battery is a safety concern: stop using the MacBook and don't charge it. Bring it in as soon as possible. We'll safely remove the old battery and fit a new one. |
| 4 | Won't turn on | → DIAGNOSTIC | Diagnostic | A MacBook that won't power on could be the battery, logic board, or charging circuit. We need to run a diagnostic to identify the root cause before we can quote a repair. |
| 5 | Random shutdowns or reboots | → DIAGNOSTIC | Diagnostic | Unexpected shutdowns can be caused by a failing battery, overheating, or a logic board fault. A diagnostic will tell us exactly what's going on. |
| 6 | Won't charge or charger not recognised | → DIAGNOSTIC | Diagnostic | Charging issues could be the USB-C port, the charging circuit on the logic board, or even the cable. We'll test each component during a diagnostic to find the fault. |

**Changes from current:**
- Added "Service Recommended" as a separate option (common customer phrase)
- Split "Won't charge" and "Charger not recognised" into one combined diagnostic route
- "Battery swollen" now has URGENT flag and safety language
- "Won't turn on" correctly routes to DIAGNOSTIC (was implying battery in current copy)
- "Random shutdowns" correctly routes to DIAGNOSTIC (was implying battery/thermal)

---

### MacBook — Trackpad / Keyboard

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Keys not responding | → DIAGNOSTIC | Diagnostic | Non-responsive keys can be caused by liquid damage, a failing keyboard mechanism, or a flex cable issue. We need to open the MacBook and check for corrosion before confirming the repair. |
| 2 | Sticky, stuck, or crunchy keys | → DIAGNOSTIC | Diagnostic | Keys that feel sticky or crunchy are almost always a sign of liquid exposure, even if you don't remember a spill. Liquid creeps under the keys and causes corrosion over time. We need to assess the extent of the damage before recommending a repair. |
| 3 | Trackpad not clicking | → DIAGNOSTIC | Diagnostic | A trackpad that won't click can be caused by a swollen battery pushing against it from underneath, or by trackpad failure. We need to open it up and check the battery before quoting. |
| 4 | Ghost typing or phantom input | → DIAGNOSTIC | Diagnostic | Random characters appearing on screen is typically caused by liquid damage to the keyboard flex cable or connector. A diagnostic will reveal the extent of the damage and what needs replacing. |
| 5 | Missing or broken keycap | → REPAIR | Keyboard Repair | A physically broken or missing keycap means the keyboard mechanism underneath is likely damaged too. We'll replace the full top case, which includes a brand new keyboard. |

**Changes from current:**
- "Sticky or stuck keys" NOW ROUTES TO DIAGNOSTIC (was incorrectly showing keyboard repair). This is the example Ferrari flagged.
- "Keys not responding" changed from direct repair to diagnostic (could be liquid)
- "Trackpad not clicking" routes to diagnostic (swollen battery check)
- "Ghost typing" routes to diagnostic
- Added "Missing or broken keycap" as a direct repair path
- Copy explains WHY diagnostic is needed for each ambiguous case

---

### MacBook — Audio / Mic / Speaker

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | No sound from speakers | → DIAGNOSTIC | Diagnostic | Complete speaker failure could be the speaker module, audio IC, or liquid damage. We need to check the internals before confirming a repair. |
| 2 | Crackling or distorted audio | → DIAGNOSTIC | Diagnostic | Distorted sound can be a blown speaker cone or liquid corrosion on the audio circuit. We'll test the speakers and check for any underlying damage. |
| 3 | Microphone not working | → DIAGNOSTIC | Diagnostic | A dead mic could be the module, the flex cable, or corrosion from liquid. We need to diagnose which component has failed. |

**Changes from current:**
- All three now route to DIAGNOSTIC (the current file implied direct repairs, but per Meesha's flows, audio faults need liquid damage checks first)
- Copy explains diagnostic reasoning

---

### MacBook — Connectivity

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | WiFi dropping or weak signal | → DIAGNOSTIC | Diagnostic | Intermittent WiFi can be an antenna cable, the WiFi module, or even liquid damage. We'll test the wireless components to pinpoint the issue. |
| 2 | Bluetooth not connecting | → DIAGNOSTIC | Diagnostic | Bluetooth failures are usually the wireless module or antenna. A diagnostic will confirm which component needs replacing. |
| 3 | USB-C port(s) not working | → DIAGNOSTIC | Diagnostic | Dead USB-C ports could be physical damage to the port, or a fault on the logic board. We need to test each port and the charging circuit to identify the issue. |

**Changes from current:**
- All correctly route to DIAGNOSTIC
- Copy is more specific and customer-friendly

---

### MacBook — Water Damage

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Spilled liquid recently (within 24 hours) | → DIAGNOSTIC | Diagnostic (URGENT) | Time is critical with liquid damage. Stop using the MacBook, don't try to charge it, and bring it in as soon as possible. We'll open it up, clean the affected components with ultrasonic cleaning, and assess which parts need replacing. |
| 2 | Spilled liquid (more than 24 hours ago) | → DIAGNOSTIC | Diagnostic | Liquid causes corrosion that spreads over time. Even if your MacBook seems to work now, internal damage may be progressing. We need to open it, assess the corrosion, and determine which components are affected. |
| 3 | Partial failure after liquid exposure | → DIAGNOSTIC | Diagnostic | When some functions still work after a spill, it means the liquid damaged specific circuits but not the entire board. A diagnostic will map exactly what's affected so we can target the repair. |
| 4 | MacBook was submerged | → DIAGNOSTIC | Diagnostic (URGENT) | Full submersion causes widespread corrosion. Bring it in immediately without attempting to charge or turn it on. We'll do a full strip-down, ultrasonic clean, and component-level assessment. |

**Changes from current:**
- Split the vague "Spilled liquid" into time-sensitive categories
- Added "submerged" as a separate urgent option
- All routes to DIAGNOSTIC (correct)
- Copy now includes actionable advice (don't charge, bring in quickly)

---

### MacBook — Data Recovery

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Drive not mounting or not detected | → DIAGNOSTIC | Diagnostic | If your MacBook's drive isn't showing up, it could be the SSD, the connector, or a logic board issue. We need to diagnose the fault to determine whether data can be recovered and how. |
| 2 | Accidentally deleted files | → CONTACT | Contact | Data recovery from accidental deletion depends on the drive type and how much the drive has been used since. Get in touch and we'll advise on your options. On Apple Silicon Macs with APFS, recovery is extremely limited. |
| 3 | MacBook dead, need data | → DIAGNOSTIC | Diagnostic | If your MacBook won't turn on but you need the data, we'll diagnose the board to find the fault. In many cases we can repair the board enough to extract the data, or access the storage directly. |

**Changes from current:**
- Removed "Drive failing" (too vague), replaced with "MacBook dead, need data"
- Added honest caveats about APFS/Apple Silicon recovery limitations
- Copy is practical and manages expectations

---

### MacBook — Other

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Overheating or fans running loud | → DIAGNOSTIC | Diagnostic | Excessive heat or fan noise can be caused by clogged vents, dried-out thermal paste, or a failing fan. We'll clean the internals, reapply thermal compound, and test the cooling system. |
| 2 | Slow performance | → CONTACT | Contact | Performance issues are often software-related and may not need a physical repair. Get in touch and we'll help work out whether it's a hardware or software problem. |
| 3 | Something else | → CONTACT | Contact | Tell us what's going on and we'll point you in the right direction. Use the form below to describe the issue and we'll get back to you. |

---

### iPhone — Screen / Display

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Cracked glass (touch still works) | → REPAIR | Screen Repair | Your iPhone screen is cracked but still functional. We replace it with a genuine Apple OLED display that's verified in iOS Settings, so you know it's the real thing. |
| 2 | Touch not responding | → REPAIR | Screen Repair | A dead touchscreen means the digitiser is damaged. A genuine screen replacement will restore full touch functionality. |
| 3 | Lines, discolouration, or green line | → REPAIR | Screen Repair | Display lines or colour shifting indicate panel damage. This is a known issue on some OLED displays. A genuine screen replacement will fix it. |
| 4 | Black screen (phone still vibrates/rings) | → REPAIR | Screen Repair | If your phone vibrates or makes sounds but the screen is black, the display has failed. A screen replacement will bring it back. |
| 5 | No display, no response | → DIAGNOSTIC | Diagnostic | If your iPhone shows no signs of life at all, it could be the display, battery, or logic board. We need to test the device to find the cause. |

**Changes from current:**
- Merged "Lines or discolouration" + "Green line" (same repair path)
- Split "Black screen" into two: one where phone still vibrates (screen repair) and one with no response (diagnostic)
- Removed vague "Black screen (still vibrates)" description, made it clearer
- Copy mentions genuine parts verification in iOS Settings

---

### iPhone — Rear Glass

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Cracked back glass | → REPAIR | Rear Glass Replacement | We replace the rear glass with a genuine Apple housing in your original colour. Your iPhone will look and feel brand new. |
| 2 | Camera lens cover cracked | → REPAIR | Camera Lens Repair | A cracked camera lens cover lets dust and moisture into the camera module. We'll replace the lens cover to protect your cameras. If the camera itself is damaged, we'll let you know during the repair. |

**Changes from current:**
- Minimal changes, copy improved
- Added note about camera module check during lens repair

---

### iPhone — Camera

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Blurry photos or shaking camera | → REPAIR | Rear Camera Repair | A blurry or shaking camera usually means the optical image stabilisation (OIS) has failed, or the lens is damaged internally. We'll replace the camera module to restore sharp photos and video. |
| 2 | Camera shows black (no image) | → REPAIR | Rear Camera Repair | A black camera feed means the module has failed. We'll replace it with a genuine camera module. |
| 3 | Front camera or Face ID not working | → DIAGNOSTIC | Diagnostic | The front camera is linked to Face ID, and both share the same module. If either isn't working, we need to diagnose whether it's the camera, the TrueDepth sensor, or a software pairing issue. |
| 4 | Condensation in camera | → DIAGNOSTIC | Diagnostic | Moisture inside the camera lens is a sign of liquid damage or a broken seal. We need to check for internal corrosion before recommending a repair. |

**Changes from current:**
- Split "Camera black" from "Front camera / Face ID" (very different repairs)
- Added "Condensation in camera" (common complaint, needs diagnostic per intake flows)
- Front camera / Face ID routes to DIAGNOSTIC (complex pairing issues)
- Copy is specific and manages expectations

---

### iPhone — Power / Battery / Charging

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Battery drains fast | → REPAIR | Battery Replacement | Your battery has degraded below healthy capacity. We replace it with a genuine Apple battery, and your battery health will read accurately again in Settings. |
| 2 | Won't charge | → DIAGNOSTIC | Diagnostic | Charging failure could be the Lightning/USB-C port, the battery, or the charging circuit. We need to test each component to identify the fault. |
| 3 | Random shutdowns or reboots | → DIAGNOSTIC | Diagnostic | Unexpected shutdowns can be a failing battery or a logic board issue. A diagnostic will tell us whether a battery replacement will fix it or if there's a deeper fault. |
| 4 | Swollen battery | → REPAIR | Battery Replacement (URGENT) | A swollen battery is a safety risk. Stop using the phone and don't charge it. Bring it in as soon as possible and we'll replace the battery safely. |

**Changes from current:**
- "Won't charge" routes to DIAGNOSTIC (not direct battery replacement)
- "Random shutoffs" routes to DIAGNOSTIC
- "Swollen battery" has URGENT safety language
- Removed generic descriptions, replaced with specific technical explanations

---

### iPhone — Audio / Mic / Speaker

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | No sound or low volume from speaker | → REPAIR | Loudspeaker Repair | The loudspeaker module has likely failed. We'll replace it to restore full volume and clarity. |
| 2 | Earpiece quiet or silent during calls | → REPAIR | Earpiece Repair | If you can't hear callers properly, the earpiece speaker needs replacing. A quick swap will fix this. |
| 3 | Microphone not picking up voice | → DIAGNOSTIC | Diagnostic | iPhone has multiple microphones, and the faulty one depends on when it fails (calls, video, Siri). We need to test each mic to identify which module or flex cable needs replacing. |

**Changes from current:**
- Split "No sound" into loudspeaker vs earpiece (different repairs, different prices)
- Mic routes to DIAGNOSTIC (multiple mic locations, need testing)
- Copy is specific about what gets replaced

---

### iPhone — Connectivity

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | No signal / "No Service" / "SOS only" | → DIAGNOSTIC | Diagnostic | Loss of cellular signal could be an antenna, baseband chip, or SIM reader issue. We need to diagnose the specific component. |
| 2 | WiFi not connecting or greyed out | → DIAGNOSTIC | Diagnostic | A greyed-out WiFi toggle usually indicates a hardware fault on the logic board. We'll diagnose whether it's repairable. |
| 3 | Bluetooth not working | → DIAGNOSTIC | Diagnostic | Bluetooth and WiFi share the same chip on iPhones. A diagnostic will confirm whether the module or antenna is at fault. |

**Changes from current:**
- Consolidated from 3 vague options to 3 specific ones
- Added "No Service" / "SOS only" as the actual phrases customers see on screen
- Copy explains the shared WiFi/BT chip relationship

---

### iPhone — Water Damage

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Dropped in liquid (within 24 hours) | → DIAGNOSTIC | Diagnostic (URGENT) | Don't try to charge or turn on your iPhone. Bring it in as soon as possible. We'll open it up, perform an ultrasonic clean, and assess which components have been affected. The sooner we get to it, the better the outcome. |
| 2 | Liquid damage (more than 24 hours ago) | → DIAGNOSTIC | Diagnostic | Liquid causes corrosion that spreads over time, even after the device dries out. We need to open the phone, clean the corrosion, and check each circuit to see what's still working and what needs repair. |

**Changes from current:**
- Split by timing (critical distinction for repair success)
- Copy includes "don't charge" safety advice
- Manages expectations about outcomes

---

### iPhone — Data Recovery

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Phone dead, need data | → DIAGNOSTIC | Diagnostic | If your iPhone won't turn on but you need photos, messages, or other data, we can attempt a board-level repair to get the phone working long enough to back up. Success depends on the fault. |
| 2 | Forgotten passcode | → CONTACT | Contact | We can't bypass an iPhone passcode or iCloud lock. If you're the original owner, Apple Support can help with account recovery. Get in touch and we'll advise on your options. |

**Changes from current:**
- Honest about passcode limitations (we can't bypass, nor should we claim to)
- Data recovery routes to diagnostic (board repair attempt)

---

### iPhone — Other

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Vibration not working | → REPAIR | Taptic Engine Repair | The Taptic Engine (vibration motor) has failed. We'll replace the module to restore haptic feedback and vibration alerts. |
| 2 | Buttons not working (power/volume/mute) | → REPAIR | Button Repair | A faulty button is usually the flex cable behind it. We'll replace the affected flex to restore full button function. |
| 3 | Something else | → CONTACT | Contact | Describe your issue below and we'll get back to you with the right repair option. |

**Changes from current:**
- Removed "SIM issues" (too vague, better covered under Connectivity)
- Added "Buttons not working" (common repair we offer)
- Copy is specific about what gets replaced

---

### iPad — Screen / Display

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Cracked glass (display still works) | → REPAIR | Glass/Display Repair | Your iPad glass is cracked. Depending on the model, we can replace just the glass digitiser or the full display assembly. We use genuine parts to ensure Apple Pencil compatibility and full touch accuracy. |
| 2 | Touch not responding | → REPAIR | Display Repair | A dead touchscreen needs a display replacement. We use genuine panels to maintain Apple Pencil support and colour accuracy. |
| 3 | Lines or dead areas on screen | → REPAIR | Display Repair | Lines or dead zones on the display mean the LCD/LED panel is damaged internally. A display replacement will fix this. |
| 4 | Black screen | → DIAGNOSTIC | Diagnostic | A completely black screen could be the display, battery, or logic board. We need to test the device to find the cause. |

---

### iPad — Power / Battery / Charging

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Battery drains quickly | → REPAIR | Battery Replacement | Your iPad battery has degraded. We'll replace it with an original-spec battery so it holds a full charge again. |
| 2 | Won't charge | → DIAGNOSTIC | Diagnostic | Charging failures on iPads can be the port, battery, or charging IC. We need to test each component. |
| 3 | Won't turn on | → DIAGNOSTIC | Diagnostic | An iPad that won't power on could have a dead battery, logic board fault, or charging issue. A diagnostic will identify the cause. |

---

### iPad — Audio / Mic / Speaker

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | No sound from speakers | → DIAGNOSTIC | Diagnostic | iPad speaker issues can be the module or a board-level fault. We'll test to confirm. |
| 2 | Microphone not working | → DIAGNOSTIC | Diagnostic | iPad microphones can fail due to the module, flex cable, or corrosion. A diagnostic will pinpoint the issue. |

---

### iPad — Connectivity

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | WiFi not connecting | → DIAGNOSTIC | Diagnostic | WiFi issues on iPads can be the antenna, wireless chip, or a software problem. We'll diagnose the hardware first. |
| 2 | Bluetooth not working | → DIAGNOSTIC | Diagnostic | Bluetooth and WiFi share components on iPads. A diagnostic will identify which part has failed. |

---

### iPad — Water Damage

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Liquid exposure | → DIAGNOSTIC | Diagnostic | iPads are not waterproof. Any liquid exposure can cause corrosion on internal components. We need to open the device, clean it, and assess the damage. |

---

### iPad — Data Recovery

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Need data from broken iPad | → DIAGNOSTIC | Diagnostic | If your iPad is damaged but you need the data, we'll attempt to repair it enough to allow a backup. Success depends on the fault. |

---

### iPad — Other

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Home button or Touch ID not working | → DIAGNOSTIC | Diagnostic | Touch ID is paired to the logic board, so a failed Home button needs careful diagnosis. We'll check whether it's the button, flex cable, or a pairing issue. |
| 2 | Something else | → CONTACT | Contact | Describe the issue and we'll advise on the right repair. |

---

### Apple Watch — Screen / Display

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Cracked screen | → REPAIR | Screen Repair | We'll replace your Apple Watch display with a genuine panel. The screen is precision-fitted and water-sealed after repair. |
| 2 | Display dead or unresponsive | → DIAGNOSTIC | Diagnostic | A watch display that won't turn on could be the screen, battery, or main board. We need to test it. |

---

### Apple Watch — Rear Glass

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Cracked back crystal / sensor glass | → REPAIR | Heart Rate Monitor (Rear Glass) Repair | The rear crystal houses the heart rate and blood oxygen sensors. We'll replace it to restore sensor accuracy and the water seal. |

---

### Apple Watch — Power / Battery / Charging

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Won't charge | → DIAGNOSTIC | Diagnostic | Charging failures on Apple Watch can be the charging coil, battery, or main board. We'll test to find the cause. |
| 2 | Battery drains fast | → REPAIR | Battery Replacement | Your watch battery has degraded. We'll swap it for a new one and re-seal the watch. |
| 3 | Won't turn on | → DIAGNOSTIC | Diagnostic | If the watch won't power on at all, it needs a diagnostic to determine whether it's the battery or a board-level issue. |

---

### Apple Watch — Connectivity

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Bluetooth not connecting to phone | → DIAGNOSTIC | Diagnostic | Bluetooth pairing issues can be hardware or software. We'll test the wireless module. |
| 2 | WiFi not working | → DIAGNOSTIC | Diagnostic | WiFi faults on Apple Watch are typically the antenna or wireless chip. Diagnostic needed. |

---

### Apple Watch — Water Damage

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Water ingress despite water resistance | → DIAGNOSTIC | Diagnostic | Even water-resistant watches can fail if the seals are compromised. We'll open the watch, clean any corrosion, and assess the damage. |

---

### Apple Watch — Other

| # | Issue | Route | Repair Type | Copy |
|---|-------|-------|-------------|------|
| 1 | Digital Crown stuck or not rotating | → REPAIR | Crown Repair | The Digital Crown can get jammed by dirt or debris. We'll clean or replace the crown mechanism. |
| 2 | Side button not responding | → REPAIR | Side Button Repair | A faulty side button needs the button module replaced. Quick repair. |
| 3 | Something else | → CONTACT | Contact | Describe the issue and we'll advise. |

**Changes from current:**
- Added "Side button" repair (we offer this on all models)
- "Digital Crown" is a confirmed repair (not diagnostic)

---

## Part 3: Summary of All Copy Corrections

### Critical fixes (logic was WRONG):
1. **MacBook > Trackpad/Keyboard > "Sticky or stuck keys"** — Was routing to keyboard repair. Must route to DIAGNOSTIC. Liquid damage indicator.
2. **MacBook > Trackpad/Keyboard > "Trackpad not clicking"** — Was implying trackpad repair. Must route to DIAGNOSTIC. Could be swollen battery.
3. **MacBook > Trackpad/Keyboard > "Ghost typing"** — Was vague. Must route to DIAGNOSTIC. Liquid damage.
4. **MacBook > Trackpad/Keyboard > "Keys not responding"** — Was implying keyboard repair. Should route to DIAGNOSTIC (could be liquid).
5. **MacBook > Power > "Won't turn on"** — Was implying battery/board. Must explicitly route to DIAGNOSTIC.
6. **MacBook > Power > "Random shutdowns"** — Was implying battery/thermal. Must route to DIAGNOSTIC.
7. **MacBook > Power > "Charger not recognised"** — Was implying port repair. Must route to DIAGNOSTIC.
8. **iPhone > Power > "Won't charge"** — Was implying port/cable/battery. Must route to DIAGNOSTIC.
9. **iPhone > Power > "Random shutoffs"** — Was implying battery. Must route to DIAGNOSTIC.
10. **iPhone > Camera > "Front camera / Face ID"** — Was implying simple repair. Must route to DIAGNOSTIC (pairing complexity).

### Copy that was technically wrong:
1. **MacBook > Screen > "Dust under glass"** — Said "Delamination or debris, display replacement." Should reference Dustgate for applicable models.
2. **MacBook > Screen > "Backlight fading (Flexgate)"** — Said "Known flex cable issue on certain Pro models." Should specify which models (A1706, A1707, A1708, A1990).
3. **MacBook > Keyboard > "Keys not responding"** — Said "Common on butterfly keyboards." Butterfly is 2015-2019 only. Not universal.
4. **iPhone > Data Recovery > "Forgotten passcode"** — Said "Limited options, we can advise." Should be honest: we can't bypass passcodes.
5. **MacBook Battery in PRODUCTS** — Listed at £219. Actual price is £179.

### Copy that was too vague for customers:
- Nearly every description in the current TS object reads like internal tech notes ("Display cable or LCD panel issue", "Could be battery, logic board, or charging circuit"). Rewritten to be customer-friendly with explanations of why we're recommending what we're recommending.

---

## Part 4: Diagnostic Resolution Template

When routing to DIAGNOSTIC, the "We can fix this" card should change to:

**Badge:** "We need to take a look" (amber/yellow, not green)
**Title:** "Book a Diagnostic"
**Subtitle:** [Issue-specific copy from tables above]
**Price:** "From £49" (Mac/iPhone/iPad) or "From £19" (Watch)
**Note:** "The diagnostic fee is deducted from the final repair cost if you proceed."
**CTA:** "Book a Diagnostic" (link to diagnostic product page)

---

## Part 5: Contact Resolution Template

When routing to CONTACT, show:

**Badge:** "Let's chat about this" (neutral blue)
**Title:** "Get in touch"
**Subtitle:** [Issue-specific copy from tables above]
**No price shown**
**CTA:** Expand contact form directly (no product link)

---

## Part 6: Suggested Code Changes

### 6.1 Add `route` field to TS entries

```js
// Current structure:
{l:"Sticky or stuck keys", d:"Debris or mechanism failure."}

// New structure:
{l:"Sticky, stuck, or crunchy keys", route:"diagnostic", d:"Keys that feel sticky or crunchy are almost always a sign of liquid exposure..."}
```

Where `route` is one of:
- `"repair"` — look up product by `S.model` + repair type
- `"diagnostic"` — show diagnostic template at flat rate
- `"contact"` — show contact form only

### 6.2 Add `repairType` for direct repair routing

For issues that route to "repair" but the repair ISN'T the same as the fault category:

```js
{l:"Backlight fading", route:"repair", repairType:"flexgate", d:"..."}
```

This lets the wizard route MacBook > Screen > Flexgate to the Flexgate product instead of the Screen product.

### 6.3 Fix Battery price in PRODUCTS

```js
// Current (WRONG):
base: 219,

// Should be:
base: 179,
```

---

## Part 7: Missing Models / Gaps

### Models in wizard not in pricing KB:
- MacBook Pro 15-inch A1707 (2016-2017) — only Touch Bar listed in KB, no screen/battery/etc. prices
- Some older iPads (12.9 4th Gen 2020 — iPad Pro 12.9 M1 2020 overlap may be confusing)

### Repairs we offer but wizard doesn't surface:
- **MacBook Charging Port Repair** — Available for all models but no fault path leads to it directly
- **MacBook Touch Bar Repair** — Available for A2338, A1989, A2159, A2251, A2289, A2141. No fault category for it.
- **iPhone button repairs** (power, volume, mute) — Available but only under "Other > Something else"
- **iPhone charging port repair** — No direct path unless they pick Power > Won't charge → diagnostic
- **Apple Watch Crown Repair** — Available on some models but not in current TS
- **Apple Watch Side Button Repair** — Available on all models, not in current TS

### Recommendation:
Consider adding fault categories for:
- MacBook: "Touch Bar" (for applicable models)
- iPhone: expand "Other" to include buttons explicitly
- Watch: Crown and Side Button are now in "Other" in the corrected version above

---

## Next Steps

1. Ferrari to review this mapping and confirm the routing logic
2. Implement the three resolution types (repair / diagnostic / contact)
3. Replace all TS entries with corrected versions from this audit
4. Fix PRODUCTS sample data (battery price)
5. Build the "diagnostic" and "contact" resolution card templates
6. Consider: should we add a "liquid damage?" follow-up question for keyboard/trackpad/audio issues, rather than routing straight to diagnostic? (More like Meesha's flow trees)
