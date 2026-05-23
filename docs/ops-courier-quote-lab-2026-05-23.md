# Ops Courier Quote Lab

**Date:** 2026-05-23  
**URL:** `https://ops.icorrect.co.uk/courier/`  
**Status:** Phase-one internal sandbox  
**Auth:** Nginx basic auth via `/etc/nginx/.htpasswd`

## Purpose

This lab lets the team click through the Claude-designed quote wizard and test London courier decision logic before it is wired into the live Shopify theme.

It is not a live Shopify checkout and it does not book Gophr. The lab produces the booking payload that a later Shopify integration or internal ops booking module can consume.

## What Changed From The Static Prototype

- The Step 5 courier cards no longer use fixed prototype prices such as `+20`.
- Postcode decisions now call the local courier decision contract.
- Courier options show contract-backed service levels, customer prices, collection windows, return windows, and same-day status.
- The lab includes internal test controls for stock state, same-day slot count, and quote/reserve action.
- The final payload includes the selected courier option and customer-safe cart properties.

## Current Architecture

```text
Browser at /courier/
  -> Claude quote wizard UI
  -> POST /courier/api/decision
  -> courier_quote_lab_server.py
  -> courier_decision_contract.py
  -> courier_decision_engine.py
  -> committed matrix/fixture data
```

The deployed service runs on the VPS as:

```text
systemd service: icorrect-courier-quote-lab.service
local port: 127.0.0.1:8055
nginx host: ops.icorrect.co.uk
nginx path: /courier/
```

## Files

- `docs/mockups/icorrect-courier-quote-lab-2026-05-23/`
- `scripts/analysis/courier_quote_lab_server.py`
- `scripts/analysis/courier_quote_lab_fixtures.py`
- `scripts/analysis/courier_decision_contract.py`
- `scripts/analysis/courier_decision_engine.py`

## Verification

Run locally:

```bash
python3 -m py_compile scripts/analysis/courier_quote_lab_server.py scripts/analysis/courier_quote_lab_fixtures.py scripts/analysis/courier_decision_contract.py scripts/analysis/courier_decision_engine.py
python3 scripts/analysis/courier_quote_lab_fixtures.py
python3 scripts/analysis/courier_decision_contract_fixtures.py
```

On the VPS:

```bash
systemctl is-active icorrect-courier-quote-lab.service
curl -fsS http://127.0.0.1:8055/courier/health
curl -I https://ops.icorrect.co.uk/courier/
```

Expected public response is `401 Unauthorized` until basic auth credentials are supplied.

## Phase Two

Once the quote and turnaround logic feels right, this lab can grow into an internal telephone booking module:

- customer name;
- email;
- phone;
- pickup address;
- selected device/repair;
- selected courier service;
- internal notes;
- booking draft creation;
- later, live Gophr booking after stock/capacity/address revalidation.
