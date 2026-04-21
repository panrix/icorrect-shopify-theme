# Meta CAPI status — 2026-04-21

**TL;DR:** CAPI is already active via Shopify's native Meta channel (55% of events arrive SERVER-sourced last 7d). The attribution gap is **not a missing CAPI** — it's that `_fbc` / `_fbp` cookies don't exist when events fire. My theme snippet `snippets/meta-pixel-attribution.liquid` (added in this branch) fixes the cookie side; the server events will start carrying `fbc`/`fbp` automatically once Shopify's CAPI reads them from the browser session.

## Evidence

Pulled via Meta Graph API (`META_ACCESS_TOKEN` in `/home/ricky/config/api-keys/.env`), pixel `570102806970617`, 2026-04-15 → 2026-04-21:

| Event source | Count | Share |
|---|---|---|
| SERVER (CAPI) | 1867 | 54.5% |
| BROWSER (pixel) | 1559 | 45.5% |

Match keys on the same window:

| Key | Share | Note |
|---|---|---|
| external_id | 75.5% | Shopify customer id — strong match, but this is the *post-checkout* identity |
| email | 4.1% | Low — mostly only from purchases |
| phone | 3.5% | Low |
| `fbc` (fbclid) | **0%** | **← the attribution gap** |
| `fbp` (browser id) | **0%** | **← the attribution gap** |

Without `fbc` there is no way for Meta to connect a purchase back to the ad click that drove it, no matter how many server events we send.

## Pixel inventory

| Pixel ID | Name | Status |
|---|---|---|
| `570102806970617` | iCorrect Ads's Pixel | Active — last fired 2026-04-20, 46 Purchases in April |
| `432282026552150` | "what is this?" | Dormant — created 2024-10-08, no `last_fired_time`, zero events |

**Action for Ricky:** remove the "what is this?" pixel from Business Manager to keep inventory clean.

## What's fixed in this branch

- `snippets/meta-pixel-attribution.liquid` captures `fbclid` → writes `_fbc` cookie in Meta's canonical format, generates `_fbp` if missing, preserves `fbclid` across internal navigations, forwards it onto checkout URLs.
- Next 24-48h Meta Events Manager should show `fbc`/`fbp` appearing in the match-keys breakdown.

## What Ricky still needs to check in Meta Events Manager

1. **Aggregated Event Measurement (AEM):** Business settings → Data sources → Pixel 570… → Aggregated Event Measurement. Confirm `Purchase` is in the prioritised 8 events (required for iOS 14.5+ attribution).
2. **Domain verification:** `icorrect.co.uk` must show verified. Without it AEM events drop.
3. **Event deduplication:** the Shopify Meta channel auto-generates `event_id` for both browser and server events of the same order. In Events Manager → Overview, Purchase dedup rate should be 90%+. If it isn't, there's a duplicate pixel somewhere in Shopify Customer Events.
4. **Shopify Customer Events:** Settings → Customer Events — there should be exactly one "Facebook & Instagram" pixel entry. Any custom pixel also firing Purchase = double-counts.
