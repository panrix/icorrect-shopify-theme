#!/usr/bin/env bash
# Start Shopify CLI against the real store using the VPS token.
# Never publishes to the live theme.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f /tmp/icorrect-secrets/shopify.env ]; then
  if [ -n "${VPS_SSH_KEY_B64:-}" ]; then
    mkdir -p /tmp/icorrect-secrets
    umask 077
    "$ROOT/scripts/load-shopify-env-from-vps.sh" > /tmp/icorrect-secrets/shopify.env
    chmod 600 /tmp/icorrect-secrets/shopify.env
  else
    echo "theme-dev not started: VPS SSH secrets are missing."
    sleep infinity
  fi
fi

# shellcheck disable=SC1091
set -a
source /tmp/icorrect-secrets/shopify.env
set +a

# Token via env only — never pass --password so it does not appear in ps.
export SHOPIFY_FLAG_STORE
export SHOPIFY_CLI_THEME_TOKEN
export SHOPIFY_FLAG_HOST=127.0.0.1
export SHOPIFY_FLAG_PORT=9292
exec npx shopify theme dev
