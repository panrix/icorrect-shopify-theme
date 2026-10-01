# Quote wizard turnaround map

The date stored on the Shopify order is the promise. Monday reads that date. It does not work the date out again from the device or the repair.

Corporate London courier is not in this map.

## What is stored

On Book, the wizard copies the date already on screen into a line-item property. The value is `YYYY-MM-DD`. It is the same calendar day as the label the client sees (`Wed 16 Sep`). The year is in the stored value so a December booking is not read as the following year.

| On screen | Line property | Example |
|---|---|---|
| Estimated return by | `Return by` | `2026-09-16` |
| We'll tell you what's wrong by | `Quote by` | `2026-09-15` |

`Order summary` on the same repair line includes `Return by:` or `Quote by:`. That is the Shopify order recap.

A booking with no date on screen (collection window not chosen yet) does not write either property. Choosing Fast does not change the date. Do not shorten it from the Fast card.

If Royal Mail delivers later than the receive day the quote assumed, keep the stored `Return by`. The client was already shown that date.

## How Monday turns that date into deadlines

`D` is the stored date. It is the day the device is with the client. Working days are Monday–Friday. Saturday and Sunday are skipped. Bank holidays are not skipped. If `D` is a Monday, the previous working day is Friday.

- **Royal Mail** (`Service Type` = `Mail-in`). Tech deadline is the working day before `D`. Client deadline is that same day at 16:00 Europe/London. Shown return Wednesday means tech deadline Tuesday and client deadline Tuesday at 16:00.
- **Public Gophr** (`Service Type` = `Courier collection`). Tech deadline is `D`. Client deadline is `D`. No 16:00 cutoff. The return rider is inside that date.
- **Diagnostic** (`Quote by`, no `Return by`). That date is when the quote is emailed. Do not set a return deadline. The device stays until the customer approves a repair.

## Dates the site shows today

These come from `assets/repair-journey.js`. They are examples of what `Return by` / `Quote by` will contain. Monday still uses the stored value, not this table.

Repair time on the journey step **We repair** (not the return date):

- iPhone, every known repair: 1 working day
- MacBook, every known repair: 2 working days
- iPad, every known repair: 2 working days
- Apple Watch, every known repair: 3 working days

Known-repair types that share that device number:

- MacBook: screen, battery, charging-port, keyboard, trackpad, touch-bar, flexgate, dustgate
- iPhone: screen, battery, charging-port, rear-camera, front-camera, loudspeaker, earpiece, microphone, power-button, volume-button, mute-button, rear-glass, rear-camera-lens
- iPad: screen, screen-glass, battery, charging-port
- Watch: screen, screen-glass, battery, heart-rate-monitor, crown

Contact issues have no date. Do not set a deadline from this map.

### Public Gophr, collected Monday 14 Sep 2026

| Device | We repair | Return by | Tech deadline | Client deadline |
|---|---|---|---|---|
| iPhone | 1 working day | 2026-09-15 | 2026-09-15 | 2026-09-15 |
| MacBook | 2 working days | 2026-09-16 | 2026-09-16 | 2026-09-16 |
| iPad | 2 working days | 2026-09-16 | 2026-09-16 | 2026-09-16 |
| Watch | 3 working days | 2026-09-17 | 2026-09-17 | 2026-09-17 |

### Royal Mail, pack sent Monday 14 Sep 2026 before 15:00 London

The pack ships that working day until 15:00 Europe/London, otherwise the next working day. The device is received the next working day. **Back to you** is receive day + the repair days above, then one more working day for the return post.

| Device | Received | Return by | Tech deadline | Client deadline |
|---|---|---|---|---|
| iPhone | 2026-09-15 | 2026-09-17 | 2026-09-16 | 2026-09-16 16:00 |
| MacBook | 2026-09-15 | 2026-09-18 | 2026-09-17 | 2026-09-17 16:00 |
| iPad | 2026-09-15 | 2026-09-18 | 2026-09-17 | 2026-09-17 16:00 |
| Watch | 2026-09-15 | 2026-09-21 | 2026-09-18 | 2026-09-18 16:00 |

### Diagnostic

| Service | Shown line | Quote by |
|---|---|---|
| Gophr, collected Monday 14 Sep 2026 | We'll tell you what's wrong by Tue 15 Sep | 2026-09-15 |
| Royal Mail, pack sent Monday 14 Sep 2026 before 15:00 | We'll tell you what's wrong by Wed 16 Sep | 2026-09-16 |

Collection pages that still say “2 to 3 working days” are not this clock.
