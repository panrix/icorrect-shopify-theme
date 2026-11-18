# Dead-click analysis — captured 2026-04-23
**Source:** PostHog `$dead_click` + `$rageclick` events, queried 2026-04-23 / 24.
**Project:** 296651 (iCorrect Tracking).
**Baseline snapshot:** `snapshots/2026-04-23-baseline-pre-design.json`.

---

## Totals

| Window | Dead clicks | Rage clicks | Unique pages flagged |
|---|---|---|---|
| Last 7 days | 370 | 31 | 40 |
| Last 28 days | **1,159** | 70 | 40 |
| Last 90 days | 2,779 | 210 | 40 |

"Dead click" = PostHog heuristic: a click that produced no detectable interaction (no navigation, no DOM change, no event listener) within 300 ms. "Rage click" = repeated frustrated clicks in the same spot.

---

## Top pages (28 days)

| Page | Dead | Rage |
|---|---|---|
| `/` | **194** | 20 |
| `/collections/macbook-screen-repair-prices` | 86 | 19 |
| `/pages/our-services` | 74 | 0 |
| `/collections/macbook-repair-prices` | 67 | 0 |
| `/products/iphone-14-pro-battery-repair` | 51 | 0 |
| `/pages/advanced-diagnostic` | 50 | 2 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solutions-for-screen-issues-on-2016-2018-models` | 43 | 0 |
| `/collections/iphone-battery-repair-prices` | 33 | 1 |

Homepage dominates: ~7 dead clicks/day. Collection grids and policy/info pages are the next tier.

---

## Element-level breakdown (28 days)

### Pattern 1 — Quote-wizard components on `/` (193 dead clicks)

Non-interactive elements inside otherwise-interactive components:

| What users tapped | Count | Why it's dead |
|---|---|---|
| `Email` (label in the contact card) | 4 | The `<p class="qw-d-label">Email</p>` isn't wrapped in the `mailto:` link — only the address on the line below is |
| `+£20`, `Included` (service-card price labels) | 6 | The price label is a child `<div>` inside a clickable `.qw-opt-card`; click doesn't reliably bubble on mobile |
| `Get your free quote` | 4 | Looks like a CTA; actually a headline |
| FAQ questions ("Do you offer payment plans?" etc.) | 11+ | Accordion toggles — may be PostHog false-positives from `maxHeight` style changes not registering as DOM mutations |
| Descriptive body copy (e.g. "Your iPhone screen is cracked but still functional...") | multiple | Paragraph text inside wizard resolution card — users treating it as CTA |

### Pattern 2 — Collection-grid cards (across all `/collections/*`)

Users tap the product *title* or *model-name* area; only the image and the `<a>`-wrapped title are clickable.

| Text tapped | Example count |
|---|---|
| `MacBook Pro 13"`, `MacBook Air`, `MacBook Air 13''` | 4+ each on `/collections/macbook-repair-prices` |
| `Charging Port Repair`, `Keyboard Repair`, `Touch Bar Repair` (category titles) | 1+ each |
| `iPhone 13 series`, `Older iPhones` | 1+ each on `/collections/iphone-battery-repair-prices` |

Fix direction: wrap the whole `.repair-card` in `<a href="{{ product.url }}">`, not just the image and title.

### Pattern 3 — FAQ sections (every page that has one)

| Page | FAQ dead clicks |
|---|---|
| `/pages/our-services` | **55** across 8 questions |
| `/pages/advanced-diagnostic` | 15 across 8 questions |
| `/collections/macbook-screen-repair-prices` | 19 across 9 questions |
| `/products/iphone-14-pro-battery-repair` | 9 across FAQ questions |

Most likely cause: PostHog flagging accordion-opens as dead because the handler changes `style.maxHeight` (inline style) rather than adding/removing a DOM class, and PostHog's 300 ms DOM-change detector misses it. Secondary possibility: specific FAQ sections have a broken handler on mobile.

Verification needed: watch one recording per page to confirm.

### Pattern 4 — Body copy and inline text (mostly on blog pages)

| Page | Dead clicks on body paragraphs |
|---|---|
| `/blogs/news/macbook-pro-flexgate-repair-guide-...` | 40+ |
| `/products/iphone-14-pro-battery-repair` (product description) | ~15 |

Largely noise — users select-to-copy on long-form content, PostHog flags it. Low-priority to fix.

### Pattern 5 — Navigation and header items

"About us" (3–4 clicks per collection page), "Corporate Services" (1 click). These are header/footer links users tap before JS hydrates, or tap on the label's whitespace instead of the `<a>` text. Marginal priority.

### Pattern 6 — `(no-text)` clicks — 363 / 1,159 (31%)

PostHog captured a click but no text content — so it was on an icon, image, or decorative element. `$elements_chain` / `$el_tag_name` came back empty in the API for these, so the specific element can't be identified without recording review.

Probable candidates:
- Hero images on homepage
- Trust-badge icons
- Service-card icons
- FAQ expand chevrons
- SVG decorations

Best recovered by filtering PostHog recordings to `$dead_click` on `/` and watching 5-10 sessions.

---

## Design-brief input (ready to paste)

> From PostHog 28-day dead-click analysis, Design should treat these as broken interactions and fix the affordance:
>
> 1. **Product-grid cards (collection pages):** wrap the entire card in `<a href="{{ product.url }}">` — today only the image and title link. Users keep tapping the model-name area expecting navigation.
> 2. **Service-type cards (quote wizard):** the `+£20` and `Included` price labels, and body copy like "We collect and return your device", are inside the card but tapping them doesn't reliably select the card on mobile. The whole card hit-area should respond to any tap.
> 3. **Contact-card email/phone labels (quote wizard):** `<p class="qw-d-label">Email</p>` isn't wrapped in the `mailto:` — the whole contact-method block (icon + label + value) should be a single anchor.
> 4. **FAQ accordions:** verify every FAQ section visibly signals affordance (chevron, "+", background change on hover) and that the click handler definitely fires on mobile. Also worth switching the open-state indicator from `style.maxHeight` to a CSS class, which helps PostHog capture correctly.
> 5. **Unexplained icon/image taps:** 31% of all dead clicks happen on non-text elements — hero images, trust badges, service-card icons, FAQ chevrons. If something looks like a button, make it a button; if it doesn't need to be, strip the affordance.

---

## How to reproduce these numbers

```bash
set -a; source /home/ricky/config/api-keys/.env; set +a
python3 -c "
import json
d = json.load(open('snapshots/2026-04-23-baseline-pre-design.json'))
for w in ['7','28','90']:
    fr = d['windows'][w].get('frustration', [])
    print(f'{w}d:', sum(x[\"dead_clicks\"] for x in fr), 'dead,', sum(x['rage_clicks'] for x in fr), 'rage')
"
```

For element-level detail, run a HogQL query:

```sql
SELECT
  coalesce(nullIf(properties.$el_text,''), '(no-text)') AS text,
  properties.$el_tag_name AS tag,
  properties.$elements_chain_href AS href,
  count() AS c
FROM events
WHERE event = '$dead_click'
  AND properties.$pathname = '<page>'
  AND timestamp >= now() - INTERVAL 28 DAY
GROUP BY text, tag, href
ORDER BY c DESC
LIMIT 15
```

---

*Captured for reference by Claude Code — 2026-04-24.*
