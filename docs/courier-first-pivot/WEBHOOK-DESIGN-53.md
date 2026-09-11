# WEBHOOK DESIGN — Shopify `orders/paid` → Gophr draft → Slack review

_Issue: [#53](https://github.com/panrix/icorrect-shopify-theme/issues/53) · Initiative: courier-first-pivot · Date: 2026-09-11_

**Status:** design only — **no implementation in this slice.** Receiver lives in `panrix/workshop-os` (intake-hub sibling), not in the Shopify theme. Theme work here only produces the band/tier pricing inputs the order will carry.

**Secrets:** `GOPHR_API_KEY`, Shopify webhook HMAC secret, and Slack bot token stay in env / secret store only. Never commit keys, sandbox tokens, or live webhook signing secrets.

---

## 1. Goal

When a customer pays for a **courier collection** repair:

1. Shopify fires `orders/paid`.
2. workshop-os verifies the webhook, detects a courier line, and creates a **Gophr draft job** (`is_confirmed=0`) so no rider is dispatched yet.
3. A Slack card lands in `#courier-bookings` for staff review.
4. One staff confirm action promotes the draft to a live Gophr job and returns the public tracking URL to the customer (v0: Gophr-hosted tracking link in branded messaging).

Draft-first is deliberate: a mis-booked job must never auto-dispatch (April Gophr discovery).

---

## 2. Trigger & filter

| Item | Decision |
|---|---|
| Topic | Shopify Admin webhook `orders/paid` |
| Endpoint | `POST /webhooks/shopify/orders-paid` on workshop-os (name TBD; sibling to intake-hub) |
| Auth | Validate `X-Shopify-Hmac-Sha256` with the app’s webhook secret (env) |
| Idempotency | Key on `order.id` + topic; store processed IDs so Shopify retries are no-ops |
| Courier detection | Order has a line item / property / tag indicating courier collection (e.g. cart attribute `service=courier`, or line property `courier_band=B2`). Exact property names to be aligned with the wizard UI slice — **not this PR**. |
| Non-courier | Mail-in and booked drop-off orders are ignored by this receiver (existing paths stay). |

If detection fails but the order looks courier-ish (ambiguous), post a Slack *warning* card, do **not** create a Gophr job.

---

## 3. Payload → Gophr draft mapping

Pickup = customer; dropoff = workshop (12 Margaret Street, Fitzrovia).

```
Shopify order
  ├─ shipping_address / note attributes  → Gophr pickup_*
  ├─ fixed workshop address              → Gophr dropoff_*
  ├─ collection window (from band/cutoff copy chosen at checkout)
  │     → window fields (see §5 midnight-bug probe)
  ├─ order name / id                     → external reference / description
  └─ is_confirmed = 0                    → DRAFT (required)
```

### Draft job shape (conceptual)

```json
{
  "is_confirmed": 0,
  "pickup": {
    "address": "<customer street>",
    "postcode": "<customer postcode>",
    "city": "London",
    "country_code": "GB",
    "contact": { "name": "...", "email": "...", "phone": "..." }
  },
  "dropoff": {
    "address": "12 Margaret Street",
    "postcode": "W1W 8RL",
    "city": "London",
    "country_code": "GB",
    "contact": { "name": "iCorrect Workshop", "phone": "<ops>" }
  },
  "parcels": [{ "weight_kg": 2, "description": "Repair device — order <name>" }],
  "reference": "<Shopify order name>",
  "pickup_window_start": "<ISO8601 — provisional>",
  "pickup_window_end": "<ISO8601 — provisional>"
}
```

Field names above are indicative — final names must match whatever the §5 probe proves the dashboard actually honours. Prefer economy bike product class consistent with the band table (`gophr-london-bands-2026-09-10`).

**API auth:** `Authorization` / API key header from `process.env.GOPHR_API_KEY` only. Production key required (sandbox 401s — confirmed April).

**On Gophr API failure:** Slack error card with order link; do not silently drop. Retry with backoff for 5xx; surface 4xx to Slack for human fix.

---

## 4. Slack review card

Channel: `#courier-bookings` (private ops channel).

Card contents:

- Order name + Admin deep link
- Customer name, phone, postcode, outward code, **band (B1–B4)**
- Requested collection window (human copy, e.g. “today 15:00–18:00”)
- Repair / line item summary + courier tier tag if present
- Gophr draft job id + link to Gophr dashboard
- Actions:
  - **Confirm booking** → calls workshop-os `POST /courier/jobs/:id/confirm` → Gophr confirm → store tracking URL on order metafield / note → trigger customer message
  - **Cancel draft** → cancel Gophr draft; Slack update “cancelled”
  - **Open in Gophr** / **Open in Shopify** — deep links only

Implementation options (choose at build time): Slack Block Kit with button `action_id`s hitting the receiver, or a simple message + emoji reactions (`:white_check_mark:` = confirm). Buttons preferred for auditability.

---

## 5. Midnight-bug / window-field probe (pre-requisite)

April discovery: `pickup_window_start/end` (and dropoff equivalents) appear **accepted but ignored** by `/quotes`; drafts can show “deliver by midnight” in the Gophr UI.

**Done-when before auto-confirm ships:**

1. Probe live API (docs + test drafts) until a draft shows the **correct** collection window in the Gophr dashboard.
2. Screenshot proof.
3. Cancel the test draft.
4. Lock the working field name(s) into the receiver mapping.

If the probe slips: still ship theme band/tier pricing; staff book manually from Slack cards (pre-filled Gophr web UI link) for week one. Website pivot does not depend on auto-booking (SPEC §4 risk #1).

---

## 6. Sequence (happy path)

```
Customer pays (courier)
  → Shopify orders/paid
  → workshop-os HMAC verify + idempotency check
  → detect courier line
  → POST Gophr /jobs { is_confirmed: 0 }
  → persist { shopify_order_id, gophr_job_id, status: draft }
  → Slack #courier-bookings review card
  → staff Confirm
  → Gophr confirm job
  → persist tracking URL
  → customer email/SMS with branded wrapper around app.gophr.com/tracking/...
  → device arrives → existing mail-in intake match
  → return leg = same flow reversed (separate job; out of 48h if needed)
```

---

## 7. Explicit non-goals (this design / #53 backend slice)

- Live Gophr quoting in the browser
- Auto-confirm without Slack review
- Branded tracking page v1 (domain polling)
- UI / copy / wizard changes (blocked on mockup sign-off)
- Theme deploy
- Storing API keys in repo or theme settings

---

## 8. Theme ↔ webhook contract (for the later UI slice)

When the wizard ships, checkout should attach enough data for the receiver without re-deriving price:

| Attribute / property | Example | Why |
|---|---|---|
| `service` | `courier` | Filter |
| `courier_outward` | `SW11` | Audit / Slack |
| `courier_band` | `B2` | Audit / Slack |
| `courier_tier` | `free` \| `subsidised` \| `full` | Audit |
| `courier_customer_price` | `0` / `12.14` / `24.28` | What customer paid for collection |
| `courier_window_label` | `today 15:00–18:00` | Draft window + Slack copy |

Pricing source of truth for the quote remains `assets/courier-london-bands.json` + `assets/courier-pricing.js` (this PR). Webhook trusts the paid order contents; it does not re-quote Gophr for customer price.

---

## 9. Test plan (when implementing in workshop-os)

1. Signed fixture `orders/paid` with courier properties → draft created → Slack card payload snapshot.
2. Replay same order id → idempotent no-op.
3. Mail-in order → ignored.
4. Gophr 500 → Slack error, no false “booked” state.
5. Confirm action → job confirmed + tracking URL stored (staging key / cancellable draft only).
6. Window probe screenshot attached to #53 before enabling confirm in production.
