# Pricing endpoint check

Read-only GETs against the live storefront. The script does not write products, tags, the theme, or Slack unless `SLACK_WEBHOOK_URL` is set. **The timer is not installed. It needs Rick's sign-off before anyone enables it.**

## Run it by hand

From a checkout of this theme:

```bash
node scripts/monitor/check-pricing-endpoints.js
node scripts/monitor/check-pricing-endpoints.js --json
```

Defaults:

- `STORE_URL` `https://www.icorrect.co.uk`
- `WIZARD_PAGE` `/` (the homepage renders the quote wizard)
- `EXPECT_ADJUSTMENT_PRICES` `0,0,25` (pounds for variant keys 15, 20, 25)
- `CHECK_TIMEOUT_MS` `8000`

Exit 0 when every check passes. Exit 1 on any HTTP error, timeout, bad JSON, a short catalogue, a short band map, a wrong variant id, or a service-adjustment price that is not the expected pounds. `product.js` prices are pence; the script divides by 100 before comparing.

No npm install. Node 20 or newer (global `fetch`).

## Slack

Leave `SLACK_WEBHOOK_URL` unset. The script then never posts.

If Rick signs off, put the webhook in an env file that is not committed, for example `/etc/icorrect/pricing-check.env`:

```
STORE_URL=https://www.icorrect.co.uk
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
CHECK_STATE_FILE=/var/lib/icorrect/pricing-check-state.json
```

A post happens only when a check fails. If `CHECK_STATE_FILE` exists and the previous run failed and this one passes, it posts one recovery line. It does not post on a steady success.

## Timer example (do not install yet)

**Not installed. Needs Rick's sign-off.** These units are an example only. Nothing in this PR copies them into systemd or starts them.

`/etc/systemd/system/icorrect-pricing-check.service`

```
[Service]
Type=oneshot
EnvironmentFile=/etc/icorrect/pricing-check.env
WorkingDirectory=/home/ricky/builds/grok-theme-119-120
ExecStart=/usr/bin/node scripts/monitor/check-pricing-endpoints.js
```

`/etc/systemd/system/icorrect-pricing-check.timer`

```
[Timer]
OnCalendar=*:0/15
Persistent=true
Unit=icorrect-pricing-check.service

[Install]
WantedBy=timers.target
```

After sign-off, the install is `sudo systemctl enable --now icorrect-pricing-check.timer`. Do not run that from this change.
