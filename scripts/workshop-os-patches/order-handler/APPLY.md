# Apply on workshop-os shopify-order-handler

Live path on mission-control:

`/home/ricky/apps/workshop-os/intake/shopify-order-handler`

1. Copy `same-day-reserve.js` to `lib/same-day-reserve.js`.
2. In `lib/transform-order.js`, after building `lineItems`, if `findSameDayLine({ line_items: lineItems })` then `turnaroundTag = " *SAME-DAY*"`.
3. In `lib/slack-notify.js` `buildSuccessSlackText`, accept a third `extra` argument and prefix `*SAME-DAY*` or `*SAME-DAY RESERVE FAILED*`.
4. In `services/app.js` `processShopifyOrder`, after `transformOrder` / before Slack success:
   - `const reserve = await reserveSameDayOnPaid(order)`
   - if `reserve.ok === false` try `refundSameDayLine(order, shopify)` and pass `{ reserveFailed: true, sameDay: true }` to Slack
   - else if same-day line, pass `{ sameDay: true }`
5. Set `SAME_DAY_RESERVE_SECRET` on the order-handler unit to match the proxy.
6. Do **not** expose `/same-day/reserve` on public nginx.

Reserve failure must not fail Monday / Intercom ingest. Keep the repair. Drop only the speed line.
