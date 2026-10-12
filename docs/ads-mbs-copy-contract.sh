#!/usr/bin/env bash
# Re-copy the iCorrect design contract and the diagram kit into this theme for the
# MacBook screen ads page (page.ads-macbook-screen). Run after design-system changes merge.
#   docs/ads-mbs-copy-contract.sh /path/to/icorrect-design-system-checkout
# Files are copied verbatim. The only change: tokens.css loads the fonts from the theme's
# own assets folder (Shopify assets cannot live in subfolders), so "./fonts/" is dropped.
set -euo pipefail
DS="${1:?path to an icorrect-design-system checkout}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
A="$HERE/assets"
sed 's#url("./fonts/#url("#g' "$DS/tokens.css" > "$A/ads-mbs-tokens.css"
cp "$DS/components.css" "$A/ads-mbs-components.css"
for f in macbook-display-assembly-transparent macbook-display-assembly-mobile-transparent macbook-display-assembly-assembled \
         courier-route-transparent courier-route-mobile-transparent repair-bench-transparent repair-bench-mobile-transparent warranty-seal-closed; do
  cp "$DS/diagrams/svg/$f.svg" "$A/$f.svg"
done
( cd "$DS" && echo "copied from icorrect-design-system @ $(git rev-parse --short HEAD) on $(date -u +%F)" )
