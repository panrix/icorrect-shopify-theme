/* Quote wizard data: triage/issue copy (TS) and the iPhone visual guide (VG_DB).
   Kept out of quote-wizard.js so that file stays well under Shopify's 256 KB
   asset limit. Loaded before quote-wizard.js (sections/quote-wizard.liquid). */
(function () {

  /* =============================================
     TRIAGE/ISSUE DATA (updated: Batch 2)
     ============================================= */
  var TS = {
    macbook: {
      'Screen / Display': [
        { label: 'Cracked or shattered screen', route: 'repair', repairType: 'screen', noTrueTone: true, copy: 'We replace your damaged MacBook screen with a genuine Apple display.' },
        { label: 'Cracked or shattered screen', route: 'repair', repairType: 'screen', trueToneOnly: true, copy: 'We replace your damaged MacBook screen with a genuine Apple display and keep True Tone working.' },
        { label: 'Thick bands, artefacts, or distortion', route: 'repair', repairType: 'screen', copy: 'Lines or colour issues on your display typically mean the display panel needs replacing. We use genuine displays with full colour calibration.', dustgateCheck: true },
        { label: 'Dead pixels or bright spots', route: 'repair', repairType: 'screen', copy: 'Dead or stuck pixels are a fault within the panel. We replace the display with a genuine Apple one.' },
        { label: 'No image, backlight on, external monitor works', route: 'repair', repairType: 'screen', copy: 'If your MacBook screen is not completely black but shows a blue or purple tint when the brightness is turned all the way up, while the MacBook still works normally on an external monitor, the LCD panel has failed and needs to be replaced. We complete the repair by replacing the LCD panel with a genuine Apple one and configuring it so all of the screen\u2019s original functionality is retained.' },
        { label: 'No image, no backlight or no external picture', route: 'diagnostic', repairType: 'diagnostic', copy: 'If your MacBook powers on but the screen stays completely black with no tint, no backlight, and nothing appears on an external monitor either, the fault could be with the display or the logic board.' },
        { label: 'Backlight fading or dim at angle', route: 'repair', repairType: 'screen', flexgateModelsOnly: true, flexgateCheck: true, copy: 'The backlight fading, or going dim when you tilt the screen, means the display panel has failed. We\'ll quote a display panel replacement.' },
        { label: 'Backlight fading or dim at angle', route: 'repair', repairType: 'screen', notFlexgateModels: true, copy: 'The backlight fading, or going dim when you tilt the screen, means the display panel has failed. We\'ll quote a display panel replacement. Flexgate only used to occur on the 13-inch A1706 (2016–2018), the 13-inch A1708 (2016–2017), and the 15-inch A1707 (2016–2017).' }
      ],
      'Power / Battery / Charging': [
        { label: 'Battery draining quickly', route: 'repair', repairType: 'battery', copy: 'We fit an original-specification battery with working battery health reporting.' },
        { label: '"Service Recommended" warning', route: 'repair', repairType: 'battery', copy: 'The "Service Recommended" warning means macOS has flagged the battery for replacement. We fit an original-specification battery with working battery health reporting.' },
        { label: 'Battery swollen or expanding', route: 'repair', repairType: 'battery', copy: 'We safely remove the swollen battery and fit a replacement.', urgent: true },
        { label: 'Won\'t turn on', route: 'diagnostic', repairType: 'diagnostic', copy: 'A MacBook showing no signs of life can have a fault with the battery, charging ports or logic board. For this reason, we need to carry out a full diagnostic to confirm exactly what has failed before quoting the repair.' },
        { label: 'Random shutdowns or reboots', route: 'diagnostic', repairType: 'diagnostic', copy: 'A MacBook that randomly shuts down or restarts can have several possible causes. Because the fault is intermittent, we need to run a full diagnostic and stress test the device to reproduce it and confirm the actual cause before quoting the repair.' },
        { label: 'Device powers on, but will not charge', route: 'repair', repairType: 'charging-port', copy: 'The MacBook turns on but will not charge. We\'ll replace the charging port and test it. If the logic board is the cause, we\'ll tell you before any extra work.' }
      ],
      'Trackpad / Keyboard': [
        { label: 'Keys not responding', route: 'repair', repairType: 'keyboard', copy: 'We replace the keyboard using genuine Apple keys. If testing reveals liquid damage, we\'ll contact you before any additional work.' },
        { label: 'Sticky, stuck, or crunchy keys', route: 'repair', repairType: 'keyboard', copy: 'We replace the keyboard using genuine Apple keys. If testing reveals liquid damage, we\'ll contact you before any additional work.' },
        { label: 'Trackpad not clicking', route: 'repair', repairType: 'trackpad', copy: 'A trackpad that won\'t click can be faulty or under pressure from a swollen battery. This quote covers the trackpad repair. We\'ll check the battery when the MacBook arrives and let you know if it is the cause.' },
        { label: 'Ghost typing or phantom input', route: 'repair', repairType: 'keyboard', copy: 'We replace the keyboard using genuine Apple keys. If testing reveals liquid damage, we\'ll contact you before any additional work.' },
        { label: 'Missing or broken keycap', route: 'repair', repairType: 'keyboard', copy: 'A physically broken or missing keycap means the keyboard mechanism is likely damaged too. We replace the keyboard using genuine Apple keys.' },
        { label: 'Physically damaged trackpad', route: 'repair', repairType: 'trackpad', copy: 'We replace the damaged trackpad with a genuine Apple one.' }
      ],
      'Touch Bar': [
        { label: 'Touch Bar not responding or frozen', route: 'repair', repairType: 'touch-bar', copy: 'A frozen Touch Bar usually means that the module failed. We fix the issue by replacing it.' },
        { label: 'Touch Bar flickering or displaying incorrectly', route: 'repair', repairType: 'touch-bar', copy: 'We replace the Touch Bar panel to fix flickering or display faults.' },
        { label: 'Touch Bar cracked or physically damaged', route: 'repair', repairType: 'touch-bar', copy: 'We replace the cracked Touch Bar module.' }
      ],
      'Audio / Mic / Speaker': [
        { label: 'No sound from speakers', route: 'contact', repairType: null, copy: 'Tell us what happens when you try to play sound. We\'ll confirm the repair options and cost for your MacBook.' },
        { label: 'Crackling or distorted audio', route: 'contact', repairType: null, copy: 'Distorted audio can come from the speaker or its circuit. Get in touch so we can check which repair you need.' },
        { label: 'Microphone not working', route: 'contact', repairType: null, copy: 'Get in touch about the microphone fault. We\'ll confirm whether a parts replacement is available for your model.' }
      ],
      'Water Damage': [
        { label: 'Spilled liquid recently (within 24 hours)', route: 'diagnostic', repairType: 'diagnostic', copy: 'Time is critical with liquid damage. We can\'t quote the full repair until we\'ve opened it, cleaned with ultrasonic, and seen what\'s affected.', urgent: true },
        { label: 'Spilled liquid (more than 24 hours ago)', route: 'diagnostic', repairType: 'diagnostic', copy: 'Liquid causes corrosion to spread. We inspect the MacBook internally to see what needs repairing or replacing.' },
        { label: 'Partial failure after liquid exposure', route: 'diagnostic', repairType: 'diagnostic', copy: 'When some functions still work after a spill, specific circuits are damaged. We can\'t quote the full repair until we\'ve mapped what\'s affected.' },
        { label: 'MacBook was submerged', route: 'diagnostic', repairType: 'diagnostic', copy: 'Full submersion needs a strip-down before we can quote. Bring it in without charging or turning it on. We\'ll assess and email the repair options.', urgent: true }
      ],
      'Data Recovery': [
        { label: 'Drive not mounting or not detected', route: 'diagnostic', repairType: 'diagnostic', copy: 'We check the storage drive, its connection and the logic board to find out why the drive isn\'t being detected.' },
        { label: 'Accidentally deleted files', route: 'contact', repairType: null, copy: 'Recovering deleted files depends on the type of storage in your MacBook. Get in touch so we can explain the options.' },
        { label: 'MacBook dead, need data', route: 'diagnostic', repairType: 'diagnostic', copy: 'If your MacBook won\'t turn on but you need the data, we\'ll diagnose the board. In many cases we can repair it enough to extract the data.' }
      ],
      'Other': [
        { label: 'Overheating or fans running loud', route: 'contact', repairType: null, copy: 'Heat and fan noise are often dust or dried thermal paste. Get in touch and we\'ll confirm the clean-and-service option for your model.' },
        { label: 'Slow performance', route: 'contact', repairType: null, copy: 'Performance issues are often software-related. Get in touch and we\'ll help work out whether it\'s hardware or software.' },
        { label: 'Something else', route: 'contact', repairType: null, copy: 'Describe the issue and we\'ll get back to you with the best repair option.' }
      ]
    },
    iphone: {
      'Screen / Display': [
        { label: 'Cracked glass (touch still works)', route: 'repair', repairType: 'screen', lcdOnly: true, copy: 'We replace the cracked screen with a genuine Apple LCD display and configure it so it is recognised in iOS Settings.' },
        { label: 'Cracked glass (touch still works)', route: 'repair', repairType: 'screen', oledOnly: true, copy: 'We replace the cracked screen with a genuine Apple OLED display and configure it so it is recognised in iOS Settings.' },
        { label: 'Touch not responding', route: 'repair', repairType: 'screen', copy: 'A dead touchscreen means the digitiser is damaged. A genuine screen replacement will restore full touch functionality.' },
        { label: 'Lines, discolouration, or green line', route: 'repair', repairType: 'screen', copy: 'Display lines or colour shifting indicate panel damage. A genuine screen replacement will fix it.' },
        { label: 'Black screen (phone still vibrates/rings)', route: 'repair', repairType: 'screen', copy: 'If your phone vibrates or makes sounds but the screen is black, the display has failed. A screen replacement will bring it back.' },
        { label: 'No display, no response', route: 'diagnostic', repairType: 'diagnostic', copy: 'If your iPhone shows no signs of life, it could be the display, battery, or logic board. We can\'t quote the full repair until we\'ve tested it.' }
      ],
      'Power / Battery / Charging': [
        { label: 'Battery drains fast', route: 'repair', repairType: 'battery', copy: 'Your battery has degraded below healthy capacity. We\'ll replace it with a genuine Apple battery and your battery health will read accurately again.' },
        { label: 'Won\'t turn on', route: 'diagnostic', repairType: 'diagnostic', copy: 'An iPhone that won\'t power on could be the battery, charging circuit, or logic board. Try a hard reset first: press Volume Up, press Volume Down, then hold the side button until the Apple logo appears. We can\'t quote the full repair until we\'ve looked.' },
        { label: 'Random shutdowns or reboots', route: 'diagnostic', repairType: 'diagnostic', copy: 'Unexpected shutdowns can be the battery or the logic board. We can\'t quote the full repair until we\'ve looked.' },
        { label: 'Swollen battery', route: 'repair', repairType: 'battery', copy: 'We\'ll replace the battery safely.', urgent: true },
        { label: 'Device powers on, but will not charge', route: 'repair', repairType: 'charging-port', faceIdOnly: true, copy: 'If the iPhone turns on and charges with a wireless charger, but the port does nothing, the charging port is the fault. We\'ll replace it and test charging.' },
        { label: 'Device powers on, but will not charge', route: 'repair', repairType: 'charging-port', noFaceIdOnly: true, copy: 'The iPhone turns on but will not charge from the port. We\'ll replace the charging port and test it. If the board is the cause, we\'ll tell you before any extra work.' },
        { label: 'Charges, but won\'t connect to a computer', route: 'repair', repairType: 'charging-port', copy: 'We\'ll replace the charging port, which usually fixes this, and confirm the fault during the repair. If it turns out the issue is with the logic board instead, we\'ll let you know and send you a quote before doing anything further. Nothing extra is ever done without your go-ahead.' }
      ],
      'Camera': [
        { label: 'Back camera blurry or shaking', route: 'repair', repairType: 'rear-camera', copy: 'A blurry or shaking back camera usually means the stabilisation system has failed. We\'ll replace the rear camera module.' },
        { label: 'Back camera: no preview or it freezes', route: 'diagnostic', repairType: 'diagnostic', copy: 'A black preview, or a back camera that freezes or crashes, can be the module or the board. We can\'t quote the full repair until we\'ve looked.' },
        { label: 'Front camera: Face ID error or TrueDepth message', route: 'repair', repairType: 'front-camera', faceIdOnly: true, copy: 'A TrueDepth camera message in Settings, or a Face ID error, means the front camera module needs replacing. The Face ID module needs to be ordered directly from Apple, so this repair takes 5-7 working days.' },
        { label: 'Front camera not working', route: 'repair', repairType: 'front-camera', noFaceIdOnly: true, copy: 'We replace the faulty front camera module.' },
        { label: 'Front camera: no preview or it freezes', route: 'diagnostic', repairType: 'diagnostic', copy: 'A black preview, or a front camera that freezes or crashes, can be the module or the board. We can\'t quote the full repair until we\'ve inspected both.' },
        { label: 'Condensation in camera', route: 'diagnostic', repairType: 'diagnostic', copy: 'Moisture inside the camera is a sign of liquid or a broken seal. We can\'t quote the full repair until we\'ve checked for internal corrosion.' },
        { label: 'Camera lens cover cracked', route: 'repair', repairType: 'rear-camera-lens', alsoListed: true, copy: 'A cracked camera lens cover lets dust and moisture in. We\'ll replace the lens cover to protect your cameras.' }
      ],
      'Audio / Mic / Speaker': [
        { label: 'No sound or low volume from speaker', route: 'repair', repairType: 'loudspeaker', copy: 'The loudspeaker module has likely failed. We\'ll replace it to restore full volume and clarity.' },
        { label: 'Earpiece quiet or silent during calls', route: 'repair', repairType: 'earpiece', copy: 'The earpiece speaker needs replacing. A quick swap will fix this.' },
        { label: 'Microphone not picking up voice', route: 'repair', repairType: 'microphone', copy: 'We\'ll quote a microphone replacement. If more than one mic or a flex is involved, we\'ll confirm that once the phone is here.' }
      ],
      'Buttons': [
        { label: 'Power button stuck or not responding', icon: 'power-button', route: 'repair', repairType: 'power-button', copy: 'The power button is stuck, loose, or does nothing. We\'ll replace the power button.' },
        { label: 'Volume buttons stuck or not responding', icon: 'volume-button', route: 'repair', repairType: 'volume-button', copy: 'The volume buttons are stuck, loose, or do nothing. We\'ll replace the volume buttons.' },
        { label: 'Mute switch stuck or not clicking', icon: 'mute-button', route: 'repair', repairType: 'mute-button', copy: 'The mute switch is stuck or will not click over. We\'ll replace the mute switch.' }
      ],
      'Rear Glass': [
        { label: 'Cracked back glass', route: 'repair', repairType: 'rear-glass', copy: 'We replace the rear glass with a genuine Apple housing in your original colour.' },
        { label: 'Camera lens cover cracked', route: 'repair', repairType: 'rear-camera-lens', copy: 'A cracked camera lens cover lets dust and moisture in. We\'ll replace the lens cover to protect your cameras.' }
      ],
      'Water Damage': [
        { label: 'Dropped in liquid (within 24 hours)', route: 'diagnostic', repairType: 'diagnostic', copy: 'Don\'t try to charge or turn on your iPhone. We\'ll open it up, perform an ultrasonic clean, and assess the damage.', urgent: true },
        { label: 'Liquid damage (more than 24 hours ago)', route: 'diagnostic', repairType: 'diagnostic', copy: 'Liquid causes corrosion that spreads over time. We need to open the phone, clean the corrosion, and check each circuit.' }
      ],
      'Data Recovery': [
        { label: 'Phone dead, need data', route: 'diagnostic', repairType: 'diagnostic', copy: 'We can attempt a data recovery repair to get the phone working long enough to back up. Success depends on the fault.' },
        { label: 'Forgotten passcode', route: 'dismiss', repairType: null, copy: 'We can\'t bypass an iPhone passcode or iCloud lock. If you\'re the original owner, Apple Support can help with account recovery.' }
      ],
      'Connectivity': [
        { label: 'No signal / "No Service" / "SOS only"', route: 'diagnostic', repairType: 'diagnostic', copy: 'Loss of cellular signal could be an antenna, baseband chip, or SIM reader. Book a diagnostic and we\'ll identify the fault before quoting a repair.' },
        { label: 'eSIM not detected', route: 'diagnostic', repairType: 'diagnostic', esimOnly: true, copy: 'A missing eSIM or "No SIM" message can be the eSIM profile or the board. There is no SIM tray on this iPhone. Book a diagnostic and we\'ll identify it before quoting a repair.' },
        { label: 'SIM not detected', route: 'diagnostic', repairType: 'diagnostic', simTrayOnly: true, copy: 'A missing SIM or "No SIM" message can be the tray, the reader, or the board. Book a diagnostic and we\'ll identify it before quoting a repair.' },
        { label: 'WiFi not connecting or greyed out', route: 'diagnostic', repairType: 'diagnostic', copy: 'A greyed-out WiFi toggle usually means a hardware fault on the logic board. Book a diagnostic and we\'ll confirm it before quoting a repair.' },
        { label: 'Bluetooth not working', route: 'diagnostic', repairType: 'diagnostic', copy: 'Bluetooth and WiFi share the same chip on iPhones. Book a diagnostic and we\'ll confirm the fault before quoting a repair.' },
        { label: 'Apple Pay / NFC not working', route: 'diagnostic', repairType: 'diagnostic', copy: 'We\'ll run a diagnostic to find the cause and send you a quote before doing any work.' },
        { label: 'Won\'t activate', route: 'diagnostic', repairType: 'diagnostic', copy: 'We\'ll run a diagnostic to find out what\'s causing it and send you a quote before doing any work.' }
      ],
      'Other': [
        { label: 'Vibration not working', route: 'contact', repairType: null, copy: 'The Taptic Engine may have failed. Get in touch and we\'ll confirm whether we can repair it for your model.' },
        { label: 'General diagnostic', route: 'diagnostic', repairType: 'diagnostic', copy: 'Not sure what\'s wrong, or want a second opinion? We\'ll run a full diagnostic and send you our findings with a quote before doing any work.' },
        { label: 'Board fault confirmed elsewhere', route: 'diagnostic', repairType: 'diagnostic', copy: 'We\'ll run our own diagnostic to confirm the fault and whether it can be repaired. You\'ll get our findings and a quote before we do anything.' },
        { label: 'Several parts damaged', route: 'contact', repairType: null, copy: 'If your device has a bent frame or more than one broken part, get in touch and we\'ll put together a quote for everything it needs.' },
        { label: 'Software issue', route: 'diagnostic', repairType: 'diagnostic', copy: 'Stuck on the Apple logo, restarting, or showing a restore or update error? We\'ll diagnose the cause and confirm the fix and price before going ahead.' },
        { label: 'Something else', route: 'contact', repairType: null, copy: 'Describe the issue and we\'ll get back to you with the best repair option.' }
      ]
    },
    ipad: {
      'Screen / Display': [
        { label: 'Cracked glass only (display still works)', route: 'repair', repairType: 'screen-glass', copy: 'We replace the cracked outer glass while keeping the working display.' },
        { label: 'Cracked glass only (display still works)', route: 'repair', repairType: 'screen', onlyWhenMissing: 'screen-glass', copy: 'The glass and display are bonded together on this model, so we replace the complete screen.' },
        { label: 'Touch not responding', route: 'repair', repairType: 'screen', copy: 'We replace the faulty touchscreen with a genuine display to restore touch response.' },
        { label: 'Blotches, lines, or a damaged display', route: 'repair', repairType: 'screen', copy: 'Blotches and lines affect the display itself. We need to replace the actual display panel.' },
        { label: 'Black screen (sound or buttons still work)', route: 'repair', repairType: 'screen', copy: 'If the iPad still responds, it means the display has failed. We fix the issue by installing a genuine Apple screen.' },
        { label: 'No display, no response', route: 'diagnostic', repairType: 'diagnostic', copy: 'If the iPad shows no signs of life, it could be the display, battery, or logic board. We can\'t quote the full repair until we\'ve tested it.' }
      ],
      'Power / Battery / Charging': [
        { label: 'Battery drains quickly', route: 'repair', repairType: 'battery', copy: 'Your iPad battery has degraded. We\'ll replace it with an original-spec battery.' },
        { label: 'Won\'t turn on', route: 'diagnostic', repairType: 'diagnostic', ipadHomeButton: true, copy: 'An iPad that won\'t power on could be the battery, charging port, or logic board. Try a hard reset first: hold the top button and the Home button until the Apple logo appears. We can\'t quote the full repair until we\'ve looked.' },
        { label: 'Won\'t turn on', route: 'diagnostic', repairType: 'diagnostic', ipadNoHomeButton: true, copy: 'An iPad that won\'t power on could be the battery, charging port, or logic board. Try a hard reset first: press Volume Up, press Volume Down, then hold the top button until the Apple logo appears. We can\'t quote the full repair until we\'ve looked.' },
        { label: 'Battery swollen or screen lifting', route: 'repair', repairType: 'battery', copy: 'A swollen battery is pushing the screen away from the frame. We\'ll safely remove it and fit a replacement.', urgent: true },
        { label: 'Device powers on, but will not charge', route: 'repair', repairType: 'charging-port', copy: 'The iPad turns on but will not charge from the port. We\'ll replace the charging port and test it. If the board is the cause, we\'ll tell you before any extra work.' },
        { label: 'Charges, but won\'t connect to a computer', route: 'repair', repairType: 'charging-port', copy: 'We\'ll replace the charging port, which usually fixes this, and confirm the fault during the repair. If it turns out the issue is with the logic board instead, we\'ll let you know and send you a quote before doing anything further. Nothing extra is ever done without your go-ahead.' }
      ],
      'Camera': [],
      'Water Damage': [
        { label: 'Dropped in liquid (within 24 hours)', route: 'diagnostic', repairType: 'diagnostic', copy: 'Time is critical. We\'ll open the iPad, clean affected components with ultrasonic cleaning, and assess which parts need replacing. Don\'t try to charge it.', urgent: true },
        { label: 'Liquid damage (more than 24 hours ago)', route: 'diagnostic', repairType: 'diagnostic', copy: 'Corrosion spreads over time even after the device dries out. We need to open it, clean the corrosion, and check each circuit.' },
        { label: 'Partial failure after liquid exposure', route: 'diagnostic', repairType: 'diagnostic', copy: 'When some functions still work after a spill, specific circuits are damaged. A diagnostic will map exactly what needs repair.' },
        { label: 'iPad was submerged', route: 'diagnostic', repairType: 'diagnostic', copy: 'Full submersion causes widespread corrosion. Bring it in without charging or turning it on. We\'ll do a full strip-down and assessment.', urgent: true }
      ],
      'Data Recovery': [
        { label: 'Need data from broken iPad', route: 'diagnostic', repairType: 'diagnostic', copy: 'We\'ll attempt to repair it enough to allow a backup. Success depends on the fault.' }
      ],
      'Other': [
        { label: 'No sound from speakers', route: 'contact', repairType: null, copy: 'iPad speaker faults vary by model. Tell us what you\'re hearing and we\'ll confirm the repair and price.' },
        { label: 'Microphone not working', route: 'contact', repairType: null, copy: 'iPad mic faults depend on the model. Get in touch and we\'ll confirm whether we can quote a parts repair.' },
        { label: 'WiFi not connecting', route: 'diagnostic', repairType: 'diagnostic', copy: 'WiFi issues can be the antenna, wireless chip, or software. We need to diagnose the device to quote the repair.' },
        { label: 'Bluetooth not working', route: 'diagnostic', repairType: 'diagnostic', copy: 'Bluetooth and WiFi share components on iPads. We need to diagnose the device to quote the repair.' },
        { label: 'NFC / Apple Pay not working', route: 'diagnostic', repairType: 'diagnostic', copy: 'We\'ll run a diagnostic to find the cause and send you a quote before doing any work.' },
        { label: 'General diagnostic', route: 'diagnostic', repairType: 'diagnostic', copy: 'Not sure what\'s wrong, or want a second opinion? We\'ll run a full diagnostic and send you our findings with a quote before doing any work.' },
        { label: 'Board fault confirmed elsewhere', route: 'diagnostic', repairType: 'diagnostic', copy: 'We\'ll run our own diagnostic to confirm the fault and whether it can be repaired. You\'ll get our findings and a quote before we do anything.' },
        { label: 'Several parts damaged', route: 'contact', repairType: null, copy: 'If your device has a bent frame or more than one broken part, get in touch and we\'ll put together a quote for everything it needs.' },
        { label: 'Software issue', route: 'diagnostic', repairType: 'diagnostic', copy: 'Stuck on the Apple logo, restarting, or showing a restore or update error? We\'ll diagnose the cause and confirm the fix and price before going ahead.' },
        { label: 'Something else', route: 'contact', repairType: null, copy: 'Describe the issue and we\'ll get back to you with the best repair option.' }
      ]
    },
    watch: {
      'Screen / Display': [
        { label: 'Cracked screen (display still works)', route: 'repair', repairType: 'screen-glass', copy: 'Your watch glass is cracked but the display works. We\'ll replace the glass and re-seal the watch.' },
        { label: 'Cracked screen (display damaged or bleeding)', route: 'repair', repairType: 'screen', copy: 'The OLED display is damaged. We\'ll fit a genuine panel and re-seal the watch.' },
        { label: 'Display dead or unresponsive', route: 'repair', repairType: 'screen', copy: 'If the Apple Watch is still powering on but the display has no image or is unresponsive, the screen has likely failed. We replace it with a genuine display and re-seal the Watch afterwards. If we find any additional battery or logic board faults once it arrives, we’ll contact you.' }
      ],
      'Power / Battery / Charging': [
        { label: 'Won\'t charge', route: 'diagnostic', repairType: 'diagnostic', copy: 'Charging failure on Apple Watch can be the coil, battery, or main board. We can\'t quote the full repair until we\'ve tested it.' },
        { label: 'Battery drains fast', route: 'repair', repairType: 'battery', copy: 'Your watch battery has degraded. We\'ll swap it and re-seal the watch.' },
        { label: 'Won\'t turn on', route: 'diagnostic', repairType: 'diagnostic', copy: 'If the watch won\'t power on, it could be the battery or a board-level fault. Try a restart first: hold the side button and the Digital Crown together for at least 10 seconds, until the Apple logo appears. We can\'t quote the full repair until we\'ve looked.' },
        { label: 'Battery swollen or back popping off', route: 'repair', repairType: 'battery', copy: 'A swollen battery is pushing the back off the watch. Stop wearing it immediately. We\'ll replace the battery and re-seal the case.', urgent: true }
      ],
      'Rear Glass': [
        { label: 'Cracked back crystal / sensor glass', route: 'repair', repairType: 'heart-rate-monitor', noBloodOxygen: true, copy: 'The rear crystal houses the heart rate sensor. We\'ll replace it to restore sensor accuracy and the water seal.' },
        { label: 'Cracked back crystal / sensor glass', route: 'repair', repairType: 'heart-rate-monitor', bloodOxygenOnly: true, copy: 'The rear crystal houses the heart rate and blood oxygen sensors. We\'ll replace it to restore sensor accuracy and the water seal.' }
      ],
      'Crown': [
        { label: 'Digital Crown stuck or not rotating', route: 'repair', repairType: 'crown', copy: 'The Digital Crown can get jammed by dirt or debris. We\'ll clean or replace the crown mechanism.' }
      ],
      'Water Damage': [
        { label: 'Water ingress despite water resistance', route: 'diagnostic', repairType: 'diagnostic', copy: 'Water-resistant seals can fail over time or after impact. We\'ll open the watch, clean any corrosion, and assess the damage.' },
        { label: 'Submerged beyond depth rating', route: 'diagnostic', repairType: 'diagnostic', copy: 'Exceeding the rated depth can force water past the seals. Don\'t charge the watch. We\'ll open it, clean the internals, and check each component.' }
      ],
      'Other': [
        { label: 'Bluetooth not connecting to phone', route: 'diagnostic', repairType: 'diagnostic', copy: 'Bluetooth pairing can be hardware or software. We need to diagnose the watch to quote the repair.' },
        { label: 'WiFi not working', route: 'diagnostic', repairType: 'diagnostic', copy: 'Watch WiFi faults are typically the antenna or wireless chip. We need to diagnose it to quote.' },
        { label: 'Something else', route: 'contact', repairType: null, copy: 'Describe the issue and we\'ll get back to you with the best repair option.' }
      ]
    }
  };

  /* =============================================
     IPHONE VISUAL GUIDE DB
     ============================================= */
  var VG_DB = [
    {n:"iPhone 17 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/17_pro_max_colours.png?v=1766237419",cams:"tri_plat",edges:"curved",screen:"island",size:"max"},
    {n:"iPhone 17 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/17_pro_max_colours.png?v=1766237419",cams:"tri_plat",edges:"curved",screen:"island",size:"pro"},
    {n:"iPhone 17",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/17_colours.png?v=1766237419",cams:"vert",edges:"flat",screen:"island",size:"std"},
    {n:"iPhone Air",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/air_colours.png?v=1766237418",cams:"single_plat",edges:"flat",screen:"island",size:"max"},
    {n:"iPhone 16 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/16_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"island",size:"max"},
    {n:"iPhone 16 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/16_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"island",size:"pro"},
    {n:"iPhone 16 Plus",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/16_colours.png?v=1766237419",cams:"vert",edges:"flat",screen:"island",size:"max"},
    {n:"iPhone 16",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/16_colours.png?v=1766237419",cams:"vert",edges:"flat",screen:"island",size:"std"},
    {n:"iPhone 16e",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/16e_colours.png?v=1766237418",cams:"single_std",edges:"flat",screen:"notch",size:"std"},
    {n:"iPhone 15 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/15_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"island",size:"max"},
    {n:"iPhone 15 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/15_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"island",size:"pro"},
    {n:"iPhone 15 Plus",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/15_colours.png?v=1766237419",cams:"diag",edges:"flat",screen:"island",size:"max"},
    {n:"iPhone 15",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/15_colours.png?v=1766237419",cams:"diag",edges:"flat",screen:"island",size:"std"},
    {n:"iPhone 14 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/14_pro_max_colours.png?v=1766237418",cams:"tri_std",edges:"flat",screen:"island",size:"max"},
    {n:"iPhone 14 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/14_pro_max_colours.png?v=1766237418",cams:"tri_std",edges:"flat",screen:"island",size:"pro"},
    {n:"iPhone 14 Plus",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/14_colours.png?v=1766237419",cams:"diag",edges:"flat",screen:"notch",size:"max"},
    {n:"iPhone 14",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/14_colours.png?v=1766237419",cams:"diag",edges:"flat",screen:"notch",size:"std"},
    {n:"iPhone 13 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/13_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"notch",size:"max"},
    {n:"iPhone 13 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/13_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"notch",size:"pro"},
    {n:"iPhone 13 Mini",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/13_colours.png?v=1766237419",cams:"diag",edges:"flat",screen:"notch",size:"mini"},
    {n:"iPhone 13",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/13_colours.png?v=1766237419",cams:"diag",edges:"flat",screen:"notch",size:"std"},
    {n:"iPhone 12 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/12_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"notch",size:"max"},
    {n:"iPhone 12 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/12_pro_max_colours.png?v=1766237419",cams:"tri_std",edges:"flat",screen:"notch",size:"pro"},
    {n:"iPhone 12 Mini",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/12_colours.png?v=1766237419",cams:"vert",edges:"flat",screen:"notch",size:"mini"},
    {n:"iPhone 12",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/12_colours.png?v=1766237419",cams:"vert",edges:"flat",screen:"notch",size:"std"},
    {n:"iPhone 11 Pro Max",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/11_pro_max.png?v=1766237419",cams:"tri_std",edges:"curved",screen:"notch",size:"max"},
    {n:"iPhone 11 Pro",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/11_pro_max.png?v=1766237419",cams:"tri_std",edges:"curved",screen:"notch",size:"pro"},
    {n:"iPhone 11",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/11_colours.png?v=1766237419",cams:"vert",edges:"curved",screen:"notch",size:"std"},
    {n:"iPhone SE (3rd Gen)",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/se3_colours.png?v=1766237418",cams:"single_std",edges:"curved",screen:"home",size:"std"},
    {n:"iPhone SE (2nd Gen)",img:"https://cdn.shopify.com/s/files/1/0728/7111/7053/files/se2_colours.png?v=1766237418",cams:"single_std",edges:"curved",screen:"home",size:"std"}
  ];

  window.ICorrectWizardTS = TS;
  window.ICorrectWizardVG = VG_DB;
})();
