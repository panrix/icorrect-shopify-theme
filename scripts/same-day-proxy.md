# Same-day eligibility proxy

Public (browser) path:

`https://api.icorrect.co.uk/same-day/eligibility?handle=&date=&outward=&device=`

`device` is `iphone` or `macbook` from the wizard. Shopify handles often omit
those words, so device is taken from `device=` first, then the handle.

The quote wizard fetches this with no secret. Fail closed if the URL is
blank, times out, 404s, or CORS-fails.

Nginx on `api.icorrect.co.uk` must **not** add a second
`Access-Control-Allow-Origin`. The Node process already sends `*`.
Chromium treats `*, *` as invalid and the wizard hides Same-day.

Nginx exposes **GET + OPTIONS only**. `POST /same-day/reserve` stays on
`127.0.0.1:8061` behind `SAME_DAY_RESERVE_SECRET`.

## Stock and slots (this service)

`scripts/same-day-eligibility-proxy/server.js` is a localhost Node process
on the VPS (`127.0.0.1:8061`).

1. Handle → Monday part ids from `handle-map.json` (generated on the VPS).
2. Live Monday qty when `MONDAY_AUTOMATIONS_TOKEN` is set. Cache 60s.
   Unmapped handle or Monday down → `in_stock: false`.
   Handles containing `diagnostic` are never eligible (Fast £79 only).
3. Slot store: 3 same-day jobs per date, persisted to `data/slots.json`.
4. Prototype stock (`SAME_DAY_PROTOTYPE_STOCK=1`) is only used when the
   map is empty. Production sets `SAME_DAY_PROTOTYPE_STOCK=0`.

Preview theme setting: `same_day_eligibility_url` =
`https://api.icorrect.co.uk/same-day/eligibility`

The older `/same-day/eligibility-preview` stub (always yes) stays for
emergencies. Do not point the live theme at either until this PR is
merged with Ricky’s new frontend.

## orders/paid reserve

`intake/shopify-order-handler` (workshop-os) POSTs
`http://127.0.0.1:8061/same-day/reserve` when the paid line is
`same-day-iphone` or `turn-around-time-fatest-4-hours`.

If `ok === false`, keep the repair, refund/remove the same-day line, and
Slack `SAME-DAY RESERVE FAILED`. Successful same-day orders Slack
`SAME-DAY` so staff book both Gophr legs by hand.

Patch files: `scripts/workshop-os-patches/`.
