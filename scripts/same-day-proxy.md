# Same-day eligibility proxy

Public (browser) path:

`https://api.icorrect.co.uk/same-day/eligibility?handle=&date=&outward=&device=`

`device` is `iphone` or `macbook` from the wizard. Shopify handles often omit
those words, so prototype stock keys off `device` first.

The quote wizard fetches this with no secret. Fail closed if the URL is
blank, times out, or 404s.

## Prototype service (this repo)

`scripts/same-day-eligibility-proxy/server.js` is a localhost Node process
on the VPS (`127.0.0.1:8061`). Nginx exposes only GET + OPTIONS.

Prototype stock: iPhone / MacBook handles return `in_stock: true`.
Slots default to 3. Band comes from `assets/courier-london-bands.json`.
iPad, Watch, missing handle, and non-B1/B2 outward fail closed.

This is **not** the Monday parts ledger. Set `SAME_DAY_PROTOTYPE_STOCK=0`
to fail closed on stock. Do **not** point the live theme at this URL
until workshop-os has a handle → parts map and `orders/paid` reserve.

Preview theme setting: `same_day_eligibility_url` =
`https://api.icorrect.co.uk/same-day/eligibility`

The older `/same-day/eligibility-preview` stub (always yes) stays for
emergencies. Prefer the prototype service above.

## workshop-os (authenticated, not public)

`GET /same-day/eligibility` and `POST /same-day/reserve` on the parts
service still sit behind `webhookAuth`. The browser must never receive
that token. When the ledger map exists, this public proxy should forward
to that service instead of using prototype stock.

## orders/paid reserve (not in this theme)

On `panrix/workshop-os`, when the paid-order / courier webhook sees
`same-day-iphone` or `turn-around-time-fatest-4-hours`, POST
`/same-day/reserve` with `{ orderId, date, handle }`. If `ok === false`,
remove/refund that line and Slack `SAME-DAY RESERVE FAILED`.
