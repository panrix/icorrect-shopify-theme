# Gophr One Postcode Probe Runbook

This is a tiny sandboxed probe before building the full London courier postcode map.

It tests two public/commercial destination addresses from iCorrect's workshop at `12 Margaret Street, London, W1W 8JQ`:

- SW18: Southside Shopping Centre, Wandsworth High Street, London, SW18 4TF
- W1T: The Fitzroy Tavern, 16 Charlotte Street, London, W1T 2LY

It requests two vehicle types using Gophr's documented integer enum:

- `10` = pushbike
- `20` = motorbike

The vehicle enum is documented on the create-job reference. The probe applies the same field to the quote endpoint so we can verify whether quote requests honour it, reject it, or return a different allocated vehicle.

The parcel is treated as a normal packaged Apple device:

- `is_fragile: 0`
- `is_glass: 0`

In earlier probes, setting `is_glass: 1` caused a requested pushbike quote to be reallocated to a different vehicle, and `is_fragile: 1` may add unnecessary cost. Use `is_fragile: 0` and `is_glass: 0` for the baseline postcode map unless operations specifically wants special handling.

Official Gophr docs used:

- [Authentication](https://developers.gophr.com/docs/authorisation)
- [Environments](https://developers.gophr.com/docs/environments)
- [Quote endpoint](https://developers.gophr.com/reference/post-quotes-2)
- [Vehicle types](https://developers.gophr.com/docs/vehicle-types)
- [Addresses](https://developers.gophr.com/docs/addresses)
- [Create job reference](https://developers.gophr.com/reference/post-job)

## Safety Rules

- The script reads `GOPHR_API_KEY` from the shell environment.
- The key is never printed.
- The key is never written to the repo.
- `.env` and `.env.*` are ignored by git.
- Default base URL is the Gophr sandbox API.
- The payload uses `is_confirmed: 0`.

## Dry Run

Use this first to inspect the payload shape without calling Gophr:

```bash
python3 scripts/analysis/gophr_one_postcode_probe.py --dry-run
```

Expected outputs:

- `data/gophr-one-postcode-probe-2026-05-05.csv`
- `docs/gophr-one-postcode-probe-2026-05-05.md`

## Live Sandbox Probe

Load the key without printing it:

```bash
read -s GOPHR_API_KEY
export GOPHR_API_KEY
```

If Gophr requires a real contact mobile in sandbox, provide it without writing it to the repo:

```bash
read -s GOPHR_PROBE_MOBILE
export GOPHR_PROBE_MOBILE
```

Then run:

```bash
python3 scripts/analysis/gophr_one_postcode_probe.py \
  --service-window economy-2026-05-05 \
  --parcel-profile small-no-insurance
```

Clear shell secrets after the probe:

```bash
unset GOPHR_API_KEY GOPHR_PROBE_MOBILE
```

If the key is stored on the VPS, copy it into the current shell without echoing it. Do not paste it into chat and do not write it into a tracked file.

## What To Look For

Review the generated CSV line by line:

- whether the API economy window matches the manual Gophr UI economy price
- whether SW18 pushbike is rejected or repriced
- whether SW18 motorbike succeeds
- whether W1T pushbike succeeds
- whether W1T motorbike succeeds
- which price fields Gophr returns
- whether Gophr returns the requested vehicle or allocates a different one
- what response shape the full postcode map script should parse
