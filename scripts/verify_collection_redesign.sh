#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "assets/icorrect-redesign-tokens.css"
  "assets/icorrect-collection-redesign.css"
  "assets/icorrect-collection-redesign.js"
  "assets/Geist-Variable.woff2"
  "assets/GeistMono-Variable.woff2"
  "sections/icorrect-collection-hero-wizard.liquid"
  "sections/icorrect-identify-helper.liquid"
  "sections/icorrect-repair-product-grid.liquid"
  "sections/icorrect-process-proof.liquid"
  "sections/icorrect-parts-proof.liquid"
  "sections/icorrect-warranty-strip.liquid"
  "sections/icorrect-redesign-faq.liquid"
  "sections/icorrect-workshop-location.liquid"
  "sections/icorrect-redesign-footer.liquid"
)

for file in "${required_files[@]}"; do
  test -f "$file" || {
    echo "Missing required redesign file: $file" >&2
    exit 1
  }
done

required_sections=(
  "icorrect-collection-hero-wizard"
  "icorrect-identify-helper"
  "icorrect-repair-product-grid"
  "icorrect-process-proof"
  "icorrect-parts-proof"
  "icorrect-warranty-strip"
  "icorrect-redesign-faq"
  "icorrect-workshop-location"
  "icorrect-redesign-footer"
)

template="templates/collection.macbook-screen-repair.json"
for section in "${required_sections[@]}"; do
  grep -q "\"type\": \"$section\"" "$template" || {
    echo "Collection template is not wired to section type: $section" >&2
    exit 1
  }
done

if grep -RInE "react|babel|unpkg|cdn\\.jsdelivr" \
  assets/icorrect-redesign-tokens.css \
  assets/icorrect-collection-redesign.css \
  assets/icorrect-collection-redesign.js \
  sections/icorrect-*.liquid; then
  echo "Prototype dependency leaked into production redesign files" >&2
  exit 1
fi

echo "Collection redesign verification passed"
