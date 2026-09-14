#!/usr/bin/env bash
# Per-boot: pull Shopify credentials from the VPS env file other agents already
# use, and write them to a local (uncommitted) file for theme-dev.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p /tmp/icorrect-secrets
umask 077
if [ -n "${VPS_SSH_KEY_B64:-}" ]; then
  "$ROOT/scripts/load-shopify-env-from-vps.sh" > /tmp/icorrect-secrets/shopify.env
  chmod 600 /tmp/icorrect-secrets/shopify.env
  echo "Loaded Shopify env from mission-control."
else
  echo "VPS SSH secrets not present; theme-dev will skip until they are."
fi
