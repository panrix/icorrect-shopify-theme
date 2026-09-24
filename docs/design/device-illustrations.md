# Device illustrations: design language and rules

The repair pages use code-drawn device illustrations instead of photos. There is one drawing per **design era** of each device family, never one per model. Every drawing can highlight the part being repaired.

This guide is the source of truth for drawing a new era, for example when Apple ships a device that looks different (iPhone Duo, a redesigned MacBook, and so on).

## Where things live

| File | Role |
|---|---|
| `snippets/device-variant.liquid` | Maps a model / product title to an era (plus lens count, Touch Bar) |
| `snippets/device-glyph.liquid` | Picks the highlighted part and view, then renders the era snippet |
| `snippets/device-glyph-<family>-<era>.liquid` | One SVG drawing per era (front and back where relevant) |
| `snippets/repair-meta.liquid` | Works out the repair type from the product title (`screen`, `battery`, …) |
| `assets/repair-imageless.css` | All drawing styles (`.dg*` classes) and the highlight colour |
| `sections/repair-illustration-specimen.liquid` | QA sheet: every era × every repair. Open any page with `?view=repair-illustrations` |

## Current eras

| Family | Era key | Models | Distinguishing features |
|---|---|---|---|
| iPhone | `iphone-home` | 6s–8, SE 2nd/3rd | Top and bottom bezels, round home button, earpiece slit and camera dot above the screen |
| iPhone | `iphone-notch` | X–14, 14 Plus, 16e, 17e | Notch cut into the top of the screen |
| iPhone | `iphone-island` | 14 Pro–16 Pro Max, 15, 16, 17 | Dynamic Island pill below the top edge |
| iPhone | `iphone-plateau` | Air, 17 Pro, 17 Pro Max | Island front; full-width camera plateau on the back |
| MacBook | `macbook-wedge` | Air A1466 / A1932 / A2179 / M1 | Thicker bezels, no notch, no base slab, large trackpad |
| MacBook | `macbook-touchbar` | Pro 2016–2020 (13"/15"/16", M1/M2 13") | Touch Bar strip (function keys on A1708), side grilles |
| MacBook | `macbook-notch-air` | Air M2 onwards | Notch, full-height function row, no grilles, thin base |
| MacBook | `macbook-notch-pro` | Pro 14"/16" 2021 onwards | Notch, base slab, grilles beside a narrower keyboard |
| iPad | `ipad-home` | iPad 5th–9th, Air 3, mini 5 | Thick bezels, home button |
| iPad | `ipad-allscreen` | Air 4+, mini 6+, iPad 10th+ | Even bezels, single rear lens |
| iPad | `ipad-pro` | Pro 2018 onwards | Even bezels; dual lens, LiDAR and flash on the back |
| Watch | `watch-classic` | Series 4–6, SE | Wider bezels, softer screen corners |
| Watch | `watch-rounded` | Series 7–9 | Rounder case, thinner bezels |
| Watch | `watch-s10` | Series 10 onwards | Thinnest bezels, slightly wider case |
| Watch | `watch-ultra` | Ultra, Ultra 2 | Squarer case, bold bezel ring, crown guard, action button |

Within an era, the iPhone back view draws **1, 2 or 3 lenses** from the model name: Pro = 3; e / SE / XR / Air / non-Plus 6–8 = 1; everything else = 2.

**Unknown newer models fall into the newest era of their family**, so a launch never breaks. Draw a new era only when the device looks different.

## Style rules

- **Canvas (viewBox):** iPhone `0 0 120 250`, iPad `0 0 180 250`, MacBook `0 0 260 190`, Watch `0 0 140 228`. Keep them, so sizing CSS keeps working.
- **Lines:**
  - Strokes are 1.5px, non-scaling (set in CSS), with round caps and joins. Colour `#1d1d1f`.
  - The body outline is 1.75px. Inner frame lines are 1px at 12% black.
- **Fills:**
  - Body white.
  - Screen `#e9ebef` with a single diagonal white sheen band (60% opacity) running from the top edge towards the lower left, staying inside the straight part of the screen edge.
  - Dark details (notch, island, lenses, camera dots) `#1d1d1f` / `#2c2c2e`.
- **Shadow:** a soft ellipse under the device (`.dg-shadow`), 3–3.5px tall.
- **Detail level:** only features that identify the era at card size (about 60–90px wide). No logos, text, screws, antenna lines or colours.
- **Colour:** everything is monochrome except the highlight. The highlight is always the accent blue `#0070f3` (stroke) with a 10% blue fill and a soft glow. Display damage adds one green line and a dark ink blot.
- **Corners:** body corner radius follows the real device's proportions; the screen radius is the body radius minus the bezel.
- **Consistency:** reuse the coordinates of an existing era of the same family wherever the device hasn't changed (buttons, port, battery area), so eras line up in grids.

## Part contract (required classes)

Every era must draw these elements with these classes, adding `is-hl` when `part` matches. That is what makes every repair highlight work on every drawing.

| Class | Part key | Notes |
|---|---|---|
| `dg-shadow` | — | Ground shadow |
| `dg-body` | — | Outer case; `dg-glass` on the back view (`glass` highlights it) |
| `dg-frame` | — | Inner frame line |
| `dg-screen` | `screen` | Full screen assembly |
| `dg-sheen` | — | Glass reflection |
| `dg-btn` | `buttons` (`crown` on Watch) | Side buttons. iPhone repairs highlight one control via `dg-btn-mute`, `dg-btn-volume`, or `dg-btn-power`. There is no repair that highlights every button. |
| `dg-home` | `buttons` | Home button (home-button eras) |
| `dg-cam` / `dg-notch` / `dg-island` | `fcam` | Front camera / Face ID area |
| `dg-earpiece` | `earpiece` | Top speaker slit (iPhone) |
| `dg-port` / `dg-port-side` | `port` | Charging port (MacBook: side of the top case, near the top-left corner) |
| `dg-grille` | `grille` | Loudspeaker / microphone (MacBook Air: hinge) |
| `dg-battery` | `battery` | Hidden unless highlighted; dashed |
| `dg-crack` | screen assembly | Zig-zag crack across the screen |
| `dg-shatter` | glass only | Impact point with radial cracks |
| `dg-fault`, `dg-fault--alt`, `dg-blot` | display only | Vertical lines plus ink bleed |
| `dg-scan` | diagnostic | Scan line; set `--dg-scan-travel` for the era in CSS |
| Back view: `dg-module`, `dg-plateau`, `dg-lens-ring`, `dg-lens`, `dg-flash`, `dg-lidar`, `dg-lens-crack` | `camera` highlights the camera block only (on a plateau phone, the left square, not the bar). `lens` highlights the top-left lens and shows `dg-lens-crack`. |
| Watch back: `dg-sensor`, `dg-leds` | `sensor` | Heart-rate sensor |
| MacBook: `dg-keyboard`, `dg-keys`, `dg-fnrow`, `dg-trackpad`, `dg-touchbar-strip`, `dg-hinge`, `dg-dustbands` | `keyboard`, `trackpad`, `touchbar`, `hinge` (Flexgate: the screen fills black), `dust` (Dustgate: six wavy bands across the screen) | |

On a product page the disc leans in on a small part (buttons, cameras, ports, speakers, the earpiece, the crown, the Touch Bar). The same drawing scales up from that part. Screen, battery, glass, keyboard and trackpad stay at the normal distance. Cards and model tiles do not lean in.

## Adding a new era (checklist)

1. Collect front and back reference photos of the device. Note only what identifies it at small size (camera shape, notch or island, buttons, bezel width).
2. Copy the nearest existing era snippet to `snippets/device-glyph-<family>-<era>.liquid`, and update the header comment (era name, models, features).
3. Redraw only what changed, following the style rules. Keep every class from the part contract.
4. In `snippets/device-glyph.liquid`, add a `when '<family>-<era>'` line that renders the new snippet.
5. In `snippets/device-variant.liquid`, map the models to the new era. If it is the newest design, make it the fallback for unknown newer models.
6. In `assets/repair-imageless.css`, add `.dg--<family>-<era> { --dg-scan-travel: …; }` if the screen height differs, plus styles for any new detail class.
7. Add a sample row to `sections/repair-illustration-specimen.liquid`.
8. Open `/pages/contact?view=repair-illustrations` on the preview theme. Check every repair highlight on the new row, at desktop and mobile widths.
9. Add the era to the table above.
