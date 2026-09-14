# Same-day eligibility proxy

The quote wizard already posts unauthenticated quote events to
`https://api.icorrect.co.uk/api/quote-events`. Workshop-os Task 5
(`GET /same-day/eligibility`, `POST /same-day/reserve`) sits behind
`webhookAuth`. The browser must never receive that token.

There is **no** public unauthenticated eligibility path today. Theme setting
`same_day_eligibility_url` therefore defaults to blank (fail closed:
`inStock: false`, `slotsRemaining: 0`). When a proxy exists, set it to the
**same origin** as quote-events:

`https://api.icorrect.co.uk/same-day/eligibility`

That path should be a Cloudflare Worker / hub ingress that injects the
workshop secret server-side, forwards query `handle`, `date`, `outward`,
and returns Task 5 JSON. No CORS secret, no `?token=` in Liquid.

```js
export default {
  async fetch(req, env) {
    const src = new URL(req.url);
    if (src.pathname !== '/same-day/eligibility' || req.method !== 'GET') {
      return new Response('not found', { status: 404 });
    }
    const dest = new URL(env.PARTS_ELIGIBILITY_ORIGIN + '/same-day/eligibility');
    dest.search = src.search;
    dest.searchParams.set('token', env.WORKSHOP_WEBHOOK_TOKEN);
    return fetch(dest, { method: 'GET', headers: { accept: 'application/json' } });
  }
};
```

Do not invent a Shopify handle → parts map in the theme. Production
`in_stock` stays fail-closed until workshop-os has that map.

## orders/paid reserve (not in this theme)

This Cloud environment does not have
`/home/ricky/worktrees/workshop-os-same-day` (or the courier
`orders/paid` webhook). Theme-only work: fetch eligibility.

On `panrix/workshop-os` branch `cursor/same-day-express-a035`, when the
paid-order / courier webhook is edited, POST `/same-day/reserve` with
`{ orderId, date, handle }` if line items include `same-day-iphone` or
`turn-around-time-fatest-4-hours`. If `ok === false`, remove/refund that
line and Slack `SAME-DAY RESERVE FAILED`.
