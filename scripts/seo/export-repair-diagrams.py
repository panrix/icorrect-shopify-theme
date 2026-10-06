#!/usr/bin/env python3
"""Export the imageless repair drawings (snippets/device-glyph.liquid) as real
image files so Google can index them.

Writes, from the repo root:
  assets/repair-diagram-<key>.svg   used by <img class="dg__img"> on repair pages
  assets/repair-diagram-<key>.png   1200x900, used for og:image and Product schema
  snippets/repair-diagram-keys.liquid   manifest ",key@width@height,..."

The drawings are read from the noindex export view of a theme (live or an
unpublished preview), so the files always match the Liquid source:
  /collections/all?view=repair-diagram-export&page=N

Usage:
  python3 scripts/seo/export-repair-diagrams.py --theme <themeId|live> [--no-png]

Needs: requests, beautifulsoup4, and for PNGs playwright (Chromium) plus Pillow.
Re-run after changing any device-glyph snippet or assets/repair-imageless.css,
then upload the changed assets and snippet.
"""
import argparse, os, re, sys
import requests
from bs4 import BeautifulSoup

STORE = "https://icorrect.co.uk"
CSS_START = "/* ---------- Device diagram ---------- */"
CSS_END = "/* ---------- Product page repair panel ---------- */"


def fetch_keys(theme):
    q = {"view": "repair-diagram-export", "_fd": "0", "_sc": "1"}
    if theme != "live":
        q["preview_theme_id"] = theme
    keys, page, pages = {}, 1, 1
    while page <= pages:
        q["page"] = str(page)
        html = requests.get(STORE + "/collections/all", params=q, headers={"User-Agent": "Mozilla/5.0"}, timeout=60).text
        soup = BeautifulSoup(html, "html.parser")
        marker = soup.select_one("#pages")
        if marker is None:
            sys.exit("export view not found; is templates/collection.repair-diagram-export.liquid on this theme?")
        pages = int(marker.get("data-pages", "1"))
        for span in soup.select("span.dg[data-dg-key]"):
            k = span["data-dg-key"]
            if k not in keys:
                keys[k] = {"classes": span.get("class", []), "svg": str(span.find("svg"))}
        page += 1
    return keys


def diagram_style(css_text):
    vars_body = re.search(r":root \{(.*?)\}", css_text, re.S).group(1)
    block = css_text[css_text.index(CSS_START):css_text.index(CSS_END)]
    # Fixed drawing scale so highlight strength matches the product page panel.
    block = re.sub(r"\.dg \{.*?\n\}", ".dg {\n  --dg-w: 200px;\n  --dg-hl: 1;\n}", block, count=1, flags=re.S)
    block = re.sub(r"\.dg__svg \{.*?\n\}", "", block, count=1, flags=re.S)
    style = ".dg {" + vars_body + "}\n" + block
    style = re.sub(r"/\*.*?\*/", "", style, flags=re.S)
    return re.sub(r"\s*\n\s*", "\n", style).strip()


def build_svgs(keys, style, out_dir):
    manifest = []
    for k, v in sorted(keys.items()):
        s = BeautifulSoup(v["svg"], "html.parser").find("svg")
        x0, y0, w, h = [float(n) for n in (s.get("viewbox") or s.get("viewBox")).split()]
        pad = round(w * 0.05, 2)
        vb = f"{x0 - pad:g} {y0 - pad:g} {w + 2 * pad:g} {h + 2 * pad:g}"
        W, H = round(w + 2 * pad), round(h + 2 * pad)
        inner = re.sub(r">\s+<", "><", "".join(str(c) for c in s.contents)).strip()
        classes = " ".join(c for c in v["classes"] if c != "dg")
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{W}" height="{H}" fill="none" '
               f'class="dg dg__svg {classes}"><style>{style}</style>{inner}</svg>\n')
        with open(os.path.join(out_dir, f"repair-diagram-{k}.svg"), "w") as f:
            f.write(svg)
        manifest.append(f"{k}@{W}@{H}")
    return manifest


def build_pngs(keys, out_dir):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    exe = os.environ.get("CHROME_PATH")
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else p.chromium.launch()
        pg = br.new_page(viewport={"width": 1200, "height": 900})
        for k in sorted(keys):
            svg_path = os.path.abspath(os.path.join(out_dir, f"repair-diagram-{k}.svg"))
            pg.set_content(f'<html><body style="margin:0;background:#f5f5f7;width:1200px;height:900px;display:flex;'
                           f'align-items:center;justify-content:center"><img src="file://{svg_path}" style="height:720px;width:auto;max-width:1100px"></body></html>')
            pg.wait_for_timeout(150)
            png = os.path.join(out_dir, f"repair-diagram-{k}.png")
            pg.screenshot(path=png, animations="disabled")
            Image.open(png).convert("RGB").quantize(colors=96).save(png, optimize=True)
        br.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--theme", required=True, help="theme id to read the export view from, or 'live'")
    ap.add_argument("--no-png", action="store_true")
    a = ap.parse_args()
    keys = fetch_keys(a.theme)
    style = diagram_style(open("assets/repair-imageless.css").read())
    manifest = build_svgs(keys, style, "assets")
    with open("snippets/repair-diagram-keys.liquid", "w") as f:
        f.write("{%- comment -%}Generated by scripts/seo/export-repair-diagrams.py: key@width@height for each "
                "assets/repair-diagram-<key>.svg (and .png). Do not edit by hand.{%- endcomment -%}\n")
        f.write("," + ",".join(manifest) + ",")
    if not a.no_png:
        build_pngs(keys, "assets")
    print(f"{len(manifest)} drawings exported")


if __name__ == "__main__":
    main()
