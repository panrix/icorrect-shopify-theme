# Restart intake-handler for the quote email

The quote email trust row is three equal columns (reviews, parts, all-in price). That renderer is already on disk:

`/home/ricky/apps/workshop-os/intake/intake-handler/lib/render-quote-email.js`

The process that sends the email is still the one started at 06:07 on 24 Sep 2026 (pid 681001). It has the old 168px price column in memory. Ferrari’s SSH user cannot restart this unit.

Ricky, on the VPS:

```bash
systemctl --user restart intake-handler.service
```

Then send one quote from the live wizard. That email should show three equal columns.

Do not restart until this file is the one you want loaded. The customer-quote mailer files are on disk, so a restart keeps client emails working.
