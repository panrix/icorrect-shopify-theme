#!/usr/bin/env python3
"""Create iPhone 17-family wizard collections + menu items on the live store.

Idempotent. Requires SHOPIFY_STORE + SHOPIFY_ACCESS_TOKEN.
Does not rewrite prices. Does not touch Mail-In or courier SKUs.
"""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORE = os.environ["SHOPIFY_STORE"]
TOKEN = os.environ["SHOPIFY_ACCESS_TOKEN"]
API = os.environ.get("SHOPIFY_API_VERSION", "2024-01")
CATALOGUE = ROOT / "data/shopify-catalogue-2026-09-15.json"

# Leftover Admin duplicate — not the Monday-synced clone.
SKIP_HANDLES = {"iphone-17-pro-max-screen-repair"}

FAMILIES = [
    {
        "key": "17-pro-max",
        "menu": "iPhone 17 Pro Max",
        "title": "iPhone 17 Pro Max Repair Prices",
        "handle": "iphone-17-pro-max-repair-prices",
        "prefix": "iphone-17-pro-max-",
        "remove_from": ["iphone-16-pro-max-repair-prices"],
    },
    {
        "key": "17-pro",
        "menu": "iPhone 17 Pro",
        "title": "iPhone 17 Pro Repair Prices",
        "handle": "iphone-17-pro-repair-prices",
        "prefix": "iphone-17-pro-",
        "exclude_prefix": "iphone-17-pro-max-",
        "remove_from": ["iphone-16-pro-repair-prices"],
    },
    {
        "key": "17",
        "menu": "iPhone 17",
        "title": "iPhone 17 Repair Prices",
        "handle": "iphone-17-repair-prices",
        "prefix": "iphone-17-",
        "exclude_prefixes": (
            "iphone-17-pro-",
            "iphone-17-pro-max-",
            "iphone-17e-",
        ),
        "remove_from": ["iphone-16-repair-prices"],
    },
    {
        "key": "17e",
        "menu": "iPhone 17e",
        "title": "iPhone 17e Repair Prices",
        "handle": "iphone-17e-repair-prices",
        "prefix": "iphone-17e-",
        "remove_from": ["iphone-16e-repair-prices"],
    },
    {
        "key": "air",
        "menu": "iPhone Air",
        "title": "iPhone Air Repair Prices",
        "handle": "iphone-air-repair-prices",
        "prefix": "iphone-air-",
        "remove_from": ["iphone-16-pro-repair-prices"],
    },
]

HUB_SCREEN_COLLECTIONS = [
    "iphone-screen-repair-prices",
    "iphone-genuine-screen-repair-prices",
]
SCREEN_HANDLES = {
    "iphone-17-screen",
    "iphone-17-pro-screen",
    "iphone-17-pro-max-screen",
    "iphone-17e-screen",
    "iphone-air-screen",
}


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
    try:
        with urllib.request.urlopen(req) as resp:
            payload = json.load(resp)
            return payload
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode()
        raise RuntimeError(f"{method} {path} → {exc.code}: {detail}") from exc


def gql(query, variables=None):
    payload = shopify(
        "graphql.json", "POST", {"query": query, "variables": variables or {}}
    )
    if payload.get("errors"):
        raise RuntimeError(payload["errors"])
    data = payload.get("data")
    return data


def matches_family(handle: str, family: dict) -> bool:
    if handle in SKIP_HANDLES:
        return False
    if not handle.startswith(family["prefix"]):
        return False
    if handle.startswith(family.get("exclude_prefix") or "\0"):
        return False
    for extra in family.get("exclude_prefixes") or ():
        if handle.startswith(extra):
            return False
    return True


def ensure_collection(handle: str, title: str) -> str:
    data = gql(
        """
        query($handle: String!) {
          collectionByHandle(handle: $handle) { id handle title }
        }
        """,
        {"handle": handle},
    )
    existing = data.get("collectionByHandle")
    if existing:
        print("collection exists", handle, existing["id"], flush=True)
        return existing["id"]
    created = gql(
        """
        mutation($input: CollectionInput!) {
          collectionCreate(input: $input) {
            collection { id handle title }
            userErrors { field message }
          }
        }
        """,
        {"input": {"title": title, "handle": handle}},
    )["collectionCreate"]
    if created["userErrors"]:
        raise RuntimeError(created["userErrors"])
    print("collection created", handle, created["collection"]["id"], flush=True)
    return created["collection"]["id"]


def collection_product_ids(handle: str) -> set[str]:
    ids = set()
    cursor = None
    while True:
        data = gql(
            """
            query($handle: String!, $cursor: String) {
              collectionByHandle(handle: $handle) {
                products(first: 50, after: $cursor) {
                  pageInfo { hasNextPage endCursor }
                  nodes { id handle }
                }
              }
            }
            """,
            {"handle": handle, "cursor": cursor},
        )
        col = data.get("collectionByHandle")
        if not col:
            break
        conn = col["products"]
        for n in conn["nodes"]:
            ids.add(n["id"])
        if not conn["pageInfo"]["hasNextPage"]:
            break
        cursor = conn["pageInfo"]["endCursor"]
        time.sleep(0.12)
    return ids


def add_products(collection_gid: str, product_gids: list[str]) -> None:
    if not product_gids:
        return
    result = gql(
        """
        mutation($id: ID!, $productIds: [ID!]!) {
          collectionAddProducts(id: $id, productIds: $productIds) {
            userErrors { field message }
          }
        }
        """,
        {"id": collection_gid, "productIds": product_gids},
    )["collectionAddProducts"]
    if result["userErrors"]:
        raise RuntimeError(result["userErrors"])


def remove_products(collection_gid: str, product_gids: list[str]) -> None:
    if not product_gids:
        return
    result = gql(
        """
        mutation($id: ID!, $productIds: [ID!]!) {
          collectionRemoveProducts(id: $id, productIds: $productIds) {
            userErrors { field message }
          }
        }
        """,
        {"id": collection_gid, "productIds": product_gids},
    )["collectionRemoveProducts"]
    if result["userErrors"]:
        raise RuntimeError(result["userErrors"])


def get_menu(handle: str) -> dict:
    data = gql(
        """
        {
          menus(first: 20) { nodes {
            id title handle
            items {
              id title type url resourceId
              items { id title type url resourceId }
            }
          } }
        }
        """
    )
    for menu in data["menus"]["nodes"]:
        if menu.get("handle") == handle:
            return menu
    raise RuntimeError(f"menu {handle} not found")


def menu_item_input(item: dict) -> dict:
    entry = {
        "title": item["title"],
        "type": item["type"],
    }
    if item.get("id"):
        entry["id"] = item["id"]
    if item.get("resourceId"):
        entry["resourceId"] = item["resourceId"]
    if item.get("url"):
        entry["url"] = item["url"]
    nested = [menu_item_input(child) for child in item.get("items") or []]
    if nested:
        entry["items"] = nested
    return entry


def collection_url(handle: str) -> str:
    return f"https://icorrect.co.uk/collections/{handle}"


def ensure_iphone_menu(new_items: list[dict]) -> None:
    menu = get_menu("wizard-iphone-models")

    existing_titles = set()
    for group in menu["items"] or []:
        existing_titles.add(group["title"])
        for child in group.get("items") or []:
            existing_titles.add(child["title"])

    missing = [row for row in new_items if row["menu"] not in existing_titles]
    if not missing:
        print("menu already has iPhone 17 series items", flush=True)
        return

    group_items = []
    for row in new_items:
        group_items.append(
            {
                "title": row["menu"],
                "type": "HTTP",
                "url": collection_url(row["handle"]),
            }
        )

    items = [
        {
            "title": "iPhone 17 series",
            "type": "HTTP",
            "url": "https://icorrect.co.uk/#",
            "items": group_items,
        }
    ]
    for group in menu["items"] or []:
        items.append(menu_item_input(group))

    updated = gql(
        """
        mutation($id: ID!, $title: String!, $items: [MenuItemUpdateInput!]!) {
          menuUpdate(id: $id, title: $title, items: $items) {
            menu { id handle }
            userErrors { field message }
          }
        }
        """,
        {"id": menu["id"], "title": menu["title"], "items": items},
    )["menuUpdate"]
    if updated["userErrors"]:
        raise RuntimeError(updated["userErrors"])
    print("menu updated", menu["handle"], "added", [r["menu"] for r in missing], flush=True)


def main():
    products = json.loads(CATALOGUE.read_text())["products"]
    by_handle = {p["handle"]: p for p in products}

    family_products: dict[str, list[dict]] = {}
    for family in FAMILIES:
        rows = [
            p
            for p in products
            if matches_family(p["handle"], family)
        ]
        family_products[family["key"]] = rows
        print(family["key"], "products", len(rows), [p["handle"] for p in rows], flush=True)
        if not rows:
            raise RuntimeError(f"no products for {family['key']}")

    for family in FAMILIES:
        gid = ensure_collection(family["handle"], family["title"])
        family["collection_gid"] = gid
        already = collection_product_ids(family["handle"])
        want = [f"gid://shopify/Product/{p['id']}" for p in family_products[family["key"]]]
        to_add = [pid for pid in want if pid not in already]
        add_products(gid, to_add)
        print("added", len(to_add), "to", family["handle"], flush=True)
        time.sleep(0.2)

        for src_handle in family.get("remove_from") or []:
            src = gql(
                """
                query($handle: String!) {
                  collectionByHandle(handle: $handle) { id }
                }
                """,
                {"handle": src_handle},
            ).get("collectionByHandle")
            if not src:
                print("skip remove; missing", src_handle, flush=True)
                continue
            src_ids = collection_product_ids(src_handle)
            to_remove = [pid for pid in want if pid in src_ids]
            remove_products(src["id"], to_remove)
            print("removed", len(to_remove), "from", src_handle, flush=True)
            time.sleep(0.2)

    for hub in HUB_SCREEN_COLLECTIONS:
        col = gql(
            """
            query($handle: String!) {
              collectionByHandle(handle: $handle) { id }
            }
            """,
            {"handle": hub},
        ).get("collectionByHandle")
        if not col:
            print("skip hub; missing", hub, flush=True)
            continue
        already = collection_product_ids(hub)
        want = []
        for handle in SCREEN_HANDLES:
            p = by_handle.get(handle)
            if p:
                want.append(f"gid://shopify/Product/{p['id']}")
        to_add = [pid for pid in want if pid not in already]
        add_products(col["id"], to_add)
        print("hub", hub, "added", len(to_add), flush=True)
        time.sleep(0.2)

    ensure_iphone_menu(FAMILIES)
    print("done", flush=True)


if __name__ == "__main__":
    main()
