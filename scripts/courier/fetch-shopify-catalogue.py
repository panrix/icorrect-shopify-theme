#!/usr/bin/env python3
"""Download live Shopify products + wizard menu collection aliases.

Requires SHOPIFY_STORE, SHOPIFY_ACCESS_TOKEN, optional SHOPIFY_API_VERSION.
Regenerable: python3 scripts/courier/fetch-shopify-catalogue.py
Then: node scripts/courier/build-catalogue-map.js
"""
from __future__ import annotations

import json
import os
import time
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORE = os.environ["SHOPIFY_STORE"]
TOKEN = os.environ["SHOPIFY_ACCESS_TOKEN"]
API = os.environ.get("SHOPIFY_API_VERSION", "2024-01")
STAMP = date.today().isoformat()


def shopify(path, method="GET", body=None):
    data = None
    headers = {"X-Shopify-Access-Token": TOKEN, "Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(
        f"https://{STORE}/admin/api/{API}/{path}",
        data=data,
        headers=headers,
        method=method,
    )
    with urllib.request.urlopen(req) as resp:
        link = resp.headers.get("Link") or resp.headers.get("link")
        payload = json.load(resp)
        return payload, link


def gql(query, variables=None):
    payload, _ = shopify(
        "graphql.json", "POST", {"query": query, "variables": variables or {}}
    )
    if payload.get("errors"):
        raise RuntimeError(payload["errors"])
    return payload["data"]


def parse_next(link):
    if not link:
        return None
    for part in link.split(","):
        if 'rel="next"' in part:
            start = part.find("<") + 1
            end = part.find(">")
            url = part[start:end]
            return url.split("/admin/api/")[-1].split("/", 1)[-1]
    return None


def fetch_products():
    products = []
    path = "products.json?limit=250&status=active&fields=id,title,handle,product_type,tags,variants,status"
    while path:
        payload, link = shopify(path)
        for p in payload.get("products") or []:
            variants = []
            for v in p.get("variants") or []:
                variants.append(
                    {
                        "id": v["id"],
                        "title": v.get("title"),
                        "price": v.get("price"),
                    }
                )
            products.append(
                {
                    "id": p["id"],
                    "title": p["title"],
                    "handle": p["handle"],
                    "type": p.get("product_type") or "",
                    "tags": p.get("tags") or "",
                    "variants": variants,
                }
            )
        path = parse_next(link)
        time.sleep(0.25)
        print("products", len(products), flush=True)
    return products


def fetch_wizard_aliases():
    menus = gql(
        """
        { menus(first: 20) { nodes { handle title items {
          title items { title url }
        } } } }
        """
    )["menus"]["nodes"]
    aliases = []
    for menu in menus:
        handle = menu.get("handle") or ""
        if not handle.startswith("wizard-") or handle == "test-wizard-nested":
            continue
        device = {
            "wizard-macbook-models": "macbook",
            "wizard-iphone-models": "iphone",
            "wizard-ipad-models": "ipad",
            "wizard-watch-models": "watch",
        }.get(handle)
        if not device:
            continue
        for group in menu.get("items") or []:
            for item in group.get("items") or []:
                url = item.get("url") or ""
                if "/collections/" not in url:
                    continue
                col_handle = url.split("/collections/")[-1].split("/")[0].split("?")[0]
                nodes = []
                cursor = None
                while True:
                    data = gql(
                        """
                        query($handle: String!, $cursor: String) {
                          collectionByHandle(handle: $handle) {
                            products(first: 50, after: $cursor) {
                              pageInfo { hasNextPage endCursor }
                              nodes { handle }
                            }
                          }
                        }
                        """,
                        {"handle": col_handle, "cursor": cursor},
                    )
                    col = data.get("collectionByHandle")
                    if not col:
                        break
                    conn = col["products"]
                    nodes.extend(n["handle"] for n in conn["nodes"])
                    if not conn["pageInfo"]["hasNextPage"]:
                        break
                    cursor = conn["pageInfo"]["endCursor"]
                    time.sleep(0.12)
                aliases.append(
                    {
                        "device": device,
                        "menuName": item["title"],
                        "collectionHandle": col_handle,
                        "productHandles": nodes,
                    }
                )
                print("alias", item["title"], "products", len(nodes), flush=True)
                time.sleep(0.12)
    return aliases


def main():
    products = fetch_products()
    snap = {
        "generated": STAMP,
        "store": STORE,
        "count": len(products),
        "products": products,
    }
    out = ROOT / f"data/shopify-catalogue-{STAMP}.json"
    out.write_text(json.dumps(snap, indent=1) + "\n")
    print("wrote", out, "count", len(products))
    aliases = fetch_wizard_aliases()
    aout = ROOT / "data/wizard-menu-aliases.json"
    aout.write_text(json.dumps({"generated": STAMP, "aliases": aliases}, indent=2) + "\n")
    print("wrote", aout, "rows", len(aliases))


if __name__ == "__main__":
    main()
