# Quote wizard pricing load failure

PostHog event: `quote_wizard_pricing_load_failed`.

Use this when the event fires, or when `node scripts/monitor/check-pricing-endpoints.js` exits 1. The synthetic check is manual until Rick signs off a timer. It is not installed.

`page_path` is the pathname only. The event has no postcode, address, email, phone, name, query string, or full URL.

## Site-wide or one browser

| What you see | Meaning | First check |
|---|---|---|
| Synthetic check fails, and many sessions share one `fetch_target` | The store or that asset is broken | The failing line in the script output, then that URL in a browser |
| Synthetic check is OK, and one session or one `browser_family` / `device_type` fails | That customer's network, an extension, or an old browser | `failure_kind`, `browser_family`, `device_type`, `online` |
| `retry_outcome` is `retried_succeeded` and `severity` is `recovered` | The first try failed and the retry worked. One event per asset per page | Watch the rate. A spike means the asset is flaky, not that checkout charged the wrong amount |

Break PostHog down by `fetch_target`, `failure_kind`, `theme_id`, `device_type`, and `browser_family`.

Shopify status: https://www.shopifystatus.com/

## failure_kind

| Kind | Meaning | Likely cause | Check first |
|---|---|---|---|
| `timeout` | The request did not finish within 4s, including the one retry | Shopify slow, customer network, ad-blocker stalling the CDN | Synthetic check. If that is fast, it is the customer |
| `http` | A response came back not OK. `http_status` is the code | 404 asset missing after a theme publish, 500 Shopify, 429 | Open the asset URL from the wizard page source. Compare `http_status` |
| `network` | `fetch` rejected before a status (offline, DNS, blocked) | Customer offline, extension, captive portal | `online`. Synthetic check from the VPS |
| `parse` | The body was not JSON | CDN error page, catalogue sync wrote bad JSON | Open the URL. A HTML body means the asset path is wrong |
| `wait_cap` | `courier-pricing.js` or the bands file never became usable within about 10s | Script blocked, or bands failed and the wait still ran | `fetch_target` `courier_pricing_script` vs `courier_bands` |
| `fallback` | The £25 service-adjustment variant was missing, so mail-in was quoted at £0 | Variant unpublished, id changed, product.js missing that id | `/products/service-adjustment.js` and the synthetic price check |
| `cart_error` | Checkout's `cart/add.js` threw. `http_status` is set when Shopify returned one | Sold-out variant, bad id, cart API down | `http_status`. This does not change the quoted pounds by itself |

`retry_outcome` is `retried_failed` after the one retry still failed, `retried_succeeded` when the retry worked, and `no_retry` for the wait cap, the free-mail fallback, and cart add.

## fetch_target

| Target | What failed | Likely cause | Check first |
|---|---|---|---|
| `catalogue_map` | `repair-catalogue-map.json` | Bad catalogue sync, asset 404 after publish | Script catalogue line. File must parse, with at least 50 models and 100 repairs |
| `courier_bands` | `courier-london-bands.json` | Asset missing, JSON overwritten | Script bands line. `outward` should hold the London codes |
| `service_adjustment_variants` | `service-adjustment-variants.json` | Theme asset missing or ids edited | Ids must stay 71280436379901, 71280436412669, 71280436445437 |
| `service_adjustment_product` | `/products/service-adjustment.js` | Product unpublished, renamed, or variants changed | Synthetic price line. Default shelf is £0 / £0 / £25. `product.js` stores pence |
| `courier_pricing_script` | `courier-pricing.js` did not load | Script 404, blocker, old cached page | View source for the script URL. Fetch it |
| `cart_add` | Adding the repair or adjustment variant failed | Variant id not purchasable | `http_status` on `cart/add.js` |
| `service_variant_fallback` | Quoted free mail-in because the paid variant id was missing | Same as `fallback` | service-adjustment product |
| `collection_prefill` | Not fired today. Prefill errors do not alert and do not block the quote | | Ignore unless a future change starts sending it |

`theme_id`, `theme_name`, and `theme_role` come from the published theme object. `theme_build` is null: Liquid cannot see the git SHA unless a stamp file is committed. Do not add a CI job that writes the live theme just to fill it. A later option is a committed `assets/theme-build.json` updated in git before merge.

`product_handle` is the repair handle already on the quote, when the customer has picked one. It is not a customer id.

## Pricing rules note

iPhone, iPad, and MacBook diagnostics keep free collection and free mail-in, including when the diagnostic price is under £200. Rick confirmed that exception on 2026-10-09. This change does not alter it.

Repairs under £200 pay courier, whatever `courier:free` says. That rule is draft PR #121, separate from this diagnostics PR.
