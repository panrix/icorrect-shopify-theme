#!/bin/bash
# Deploy MacBook Landing Pages to Shopify
# Requires: SHOPIFY_ACCESS_TOKEN env var set
# Usage: source /home/ricky/config/api-keys/.env && bash deploy-macbook-landing-pages.sh

set -euo pipefail

SHOP="i-correct-final.myshopify.com"
API_VERSION="2024-01"
THEME_ID="158358438141"
BASE_URL="https://${SHOP}/admin/api/${API_VERSION}"

if [ -z "${SHOPIFY_ACCESS_TOKEN:-}" ]; then
  echo "ERROR: SHOPIFY_ACCESS_TOKEN not set. Run: source /home/ricky/config/api-keys/.env"
  exit 1
fi

HEADERS=(
  -H "X-Shopify-Access-Token: ${SHOPIFY_ACCESS_TOKEN}"
  -H "Content-Type: application/json"
)

# ─── Page definitions ───
declare -A PAGE_TITLES=(
  ["macbook-screen-repair-london"]="MacBook Screen Repair London"
  ["macbook-repair-london"]="MacBook Repair London"
  ["macbook-pro-screen-replacement-london"]="MacBook Pro Screen Replacement London"
  ["macbook-air-screen-replacement-london"]="MacBook Air Screen Replacement London"
  ["macbook-pro-repair-london"]="MacBook Pro Repair London"
  ["macbook-air-repair-london"]="MacBook Air Repair London"
)

declare -A SEO_TITLES=(
  ["macbook-screen-repair-london"]="MacBook Screen Repair London | Same-Day Service | iCorrect"
  ["macbook-repair-london"]="MacBook Repair London | Expert Mac Technicians | iCorrect"
  ["macbook-pro-screen-replacement-london"]="MacBook Pro Screen Replacement London | iCorrect"
  ["macbook-air-screen-replacement-london"]="MacBook Air Screen Replacement London | iCorrect"
  ["macbook-pro-repair-london"]="MacBook Pro Repair London | Screen, Battery, Logic Board | iCorrect"
  ["macbook-air-repair-london"]="MacBook Air Repair London | Screen, Battery & More | iCorrect"
)

declare -A META_DESCS=(
  ["macbook-screen-repair-london"]="Expert MacBook screen repair in London. Cracked display, backlight failure, Flexgate issues. Most repairs completed same-day. 2-year warranty. Book online."
  ["macbook-repair-london"]="MacBook repair specialists in London. Screens, batteries, keyboards, liquid damage, logic board repairs. 2-year warranty. Same-day express available. Book now."
  ["macbook-pro-screen-replacement-london"]="MacBook Pro screen replacement in London. All models including M1, M2, M3 Pro & Max. Genuine displays, same-day available, 2-year warranty. Book now."
  ["macbook-air-screen-replacement-london"]="MacBook Air screen replacement in London. All models including M1, M2, M3. Genuine Retina displays, fast turnaround, 2-year warranty. Book online."
  ["macbook-pro-repair-london"]="MacBook Pro repair specialists in London. Screens, batteries, keyboards, liquid damage, logic board. All models M1–M3. 2-year warranty. Book now."
  ["macbook-air-repair-london"]="MacBook Air repair specialists in London. Screen, battery, charging, keyboard and logic board repairs. M1, M2, M3 models. 2-year warranty. Book online."
)

HANDLES=(
  "macbook-screen-repair-london"
  "macbook-repair-london"
  "macbook-pro-screen-replacement-london"
  "macbook-air-screen-replacement-london"
  "macbook-pro-repair-london"
  "macbook-air-repair-london"
)

echo "=== Deploying MacBook Landing Pages ==="
echo ""

# ─── Step 1: Create Shopify Pages via Admin API ───
echo "--- Step 1: Creating Shopify Pages ---"
for handle in "${HANDLES[@]}"; do
  title="${PAGE_TITLES[$handle]}"
  seo_title="${SEO_TITLES[$handle]}"
  meta_desc="${META_DESCS[$handle]}"

  echo "Creating page: ${handle}..."

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/pages.json" \
    "${HEADERS[@]}" \
    -d @- <<PAYLOAD
{
  "page": {
    "title": "${title}",
    "handle": "${handle}",
    "body_html": "",
    "published": true,
    "template_suffix": "${handle}",
    "metafields": [
      {
        "namespace": "global",
        "key": "title_tag",
        "value": "${seo_title}",
        "type": "single_line_text_field"
      },
      {
        "namespace": "global",
        "key": "description_tag",
        "value": "${meta_desc}",
        "type": "single_line_text_field"
      }
    ]
  }
}
PAYLOAD
  )

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Created: /pages/${handle} (HTTP ${HTTP_CODE})"
  else
    echo "  ✗ FAILED: ${handle} (HTTP ${HTTP_CODE})"
    echo "  Response: ${BODY}"
  fi
done

echo ""

# ─── Step 2: Upload Template JSON to Theme ───
echo "--- Step 2: Uploading Template JSON to Theme ${THEME_ID} ---"
for handle in "${HANDLES[@]}"; do
  TEMPLATE_FILE="templates/page.${handle}.json"

  if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "  ✗ Template file not found: ${TEMPLATE_FILE}"
    continue
  fi

  echo "Uploading template: ${TEMPLATE_FILE}..."

  # Read and escape the JSON template for embedding
  TEMPLATE_CONTENT=$(python3 -c "
import json, sys
with open('${TEMPLATE_FILE}') as f:
    content = f.read()
payload = {
    'asset': {
        'key': 'templates/page.${handle}.json',
        'value': content
    }
}
print(json.dumps(payload))
")

  RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/themes/${THEME_ID}/assets.json" \
    "${HEADERS[@]}" \
    -d "$TEMPLATE_CONTENT")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo "  ✓ Uploaded: templates/page.${handle}.json (HTTP ${HTTP_CODE})"
  else
    echo "  ✗ FAILED: ${handle} (HTTP ${HTTP_CODE})"
    echo "  Response: ${BODY}"
  fi
done

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Pages should be accessible at:"
for handle in "${HANDLES[@]}"; do
  echo "  https://www.icorrect.co.uk/pages/${handle}"
done
