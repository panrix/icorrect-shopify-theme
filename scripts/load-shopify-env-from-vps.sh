#!/usr/bin/env bash
# Load Shopify Admin credentials from the VPS env file the other agents already
# use. Prints `export KEY=value` lines for eval; never writes secrets into the
# repo. Requires VPS_SSH_KEY_B64, VPS_SSH_HOST, VPS_SSH_USER.
set -euo pipefail

if [ -z "${VPS_SSH_KEY_B64:-}" ] || [ -z "${VPS_SSH_HOST:-}" ] || [ -z "${VPS_SSH_USER:-}" ]; then
  echo "VPS SSH secrets are not set; cannot load Shopify env from mission-control." >&2
  exit 1
fi

KEY="${HOME}/.ssh/cloud_key"
mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"
if [ ! -f "$KEY" ]; then
  echo "$VPS_SSH_KEY_B64" | base64 -d > "$KEY"
  chmod 600 "$KEY"
fi

# Remote helper: parse the existing .env (same file other Shopify agents use)
# and mint a client-credentials Admin token when possible.
ssh -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new \
  -i "$KEY" "${VPS_SSH_USER}@${VPS_SSH_HOST}" 'python3 -' <<'PY'
import json, re, urllib.request

env = {}
with open("/home/ricky/config/api-keys/.env") as f:
    for line in f:
        m = re.match(r"""^\s*([A-Z0-9_]+)\s*=\s*(['\"]?)(.*?)\2\s*$""", line)
        if m:
            env[m.group(1)] = m.group(3)

store = env.get("SHOPIFY_STORE", "")
token = env.get("SHOPIFY_ACCESS_TOKEN", "")
client_id = env.get("SHOPIFY_CLIENT_ID", "")
client_secret = env.get("SHOPIFY_CLIENT_SECRET", "")

if store and client_id and client_secret:
    try:
        req = urllib.request.Request(
            f"https://{store}/admin/oauth/access_token",
            data=json.dumps({
                "client_id": client_id,
                "client_secret": client_secret,
                "grant_type": "client_credentials",
            }).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            minted = json.loads(resp.read()).get("access_token")
            if minted:
                token = minted
    except Exception:
        pass

if not store or not token:
    raise SystemExit("could not load SHOPIFY_STORE / token from VPS env")

# Values are single-quoted and escaped for safe eval on the caller.
def q(s: str) -> str:
    return "'" + s.replace("'", "'\"'\"'") + "'"

print(f"export SHOPIFY_FLAG_STORE={q(store)}")
print(f"export SHOPIFY_STORE={q(store)}")
print(f"export SHOPIFY_CLI_THEME_TOKEN={q(token)}")
print(f"export SHOPIFY_ACCESS_TOKEN={q(token)}")
PY
