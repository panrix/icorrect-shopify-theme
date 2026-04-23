# PostHog behaviour report — 28-day window

- Snapshot: `2026-04-23T12:23:00.916676+00:00`
- Window: 28 days (start `2026-03-26T12:23:00.916676+00:00`)
- Host: `icorrect.co.uk`  Project: `296651`

## Session volume + quality

- Total sessions: **12,127**
- Under 5s: 3,119  (25.7%)
- 5–30s: 3,800
- 30s–2min: 2,922
- 2–10min: 1,493
- 10min+: 793
- **% under 30s: 57.1%**
- % over 2min: 18.9%

## Wizard funnel

- wizard_entry: **8,848**
- wizard_step: 11,396
- wizard_resolution: 1,147
- wizard_abandoned: 2,186
- wizard_conversion: **152**
- Checkout Started: 130
- Checkout Step: Contact Info: 51
- Checkout Step: Shipping Info: 21
- Checkout Step: Payment Info: 45
- purchase_completed (new pixel): 0
- Order Completed (legacy): 0

### Derived funnel rates

- wizard_entry → wizard_step: **128.8%**
- wizard_step → wizard_resolution: **10.06%**
- wizard_resolution → wizard_conversion: **13.25%**
- wizard_entry → wizard_conversion: 1.72%
- wizard_entry → Checkout Started: 1.47%
- Checkout Started → Payment Info: 34.62%

### Resolution shown by route

| Route | Count |
|---|---|
| repair | 736 |
| diagnostic | 304 |
| contact | 107 |

### Conversion by action

| Action | Count |
|---|---|
| contact_submit | 41 |
| book_diagnostic | 38 |
| book_repair | 36 |
| question_submit | 22 |
| email_quote | 15 |

### Wizard funnel by device (from step-1 picker)

| Device | Entry | Step | Resolution | Conversion |
|---|---|---|---|---|
| None | 5,389 | 0 | 0 | 0 |
| iphone | 1,553 | 4,962 | 443 | 64 |
| macbook | 1,131 | 3,992 | 503 | 62 |
| ipad | 497 | 1,613 | 149 | 20 |
| watch | 278 | 829 | 52 | 6 |

## Top landing pages

| Page | Sessions | Bounce % | Median duration (s) |
|---|---|---|---|
| `/collections/macbook-screen-repair-prices` | 1,840 | 82.7% | 6 |
| `/` | 1,011 | 75.2% | 38 |
| `/pages/macbook-repairs` | 916 | 73.8% | 6 |
| `/collections/iphone-battery-repair-prices` | 851 | 70.4% | 27 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solu` | 201 | 87.6% | 30 |
| `/collections/iphone-screen-repair-prices` | 179 | 71.5% | 26 |
| `/collections/apple-watch-screen-glass-only-repair-` | 141 | 86.5% | 24 |
| `/collections/iphone-16-repair-prices` | 125 | 83.2% | 19 |
| `/collections/macbook-keyboard-repair-prices` | 117 | 76.1% | 35 |
| `/collections/iphone-repair-prices` | 116 | 12.9% | 67 |
| `/collections/iphone-rear-camera-lens-repair-prices` | 114 | 80.7% | 23 |
| `/collections/macbook-repair-prices` | 112 | 11.6% | 91 |
| `/collections/macbook-battery-repair-prices` | 108 | 64.8% | 49 |
| `/collections/iphone-14-pro-max-repair-prices` | 89 | 83.1% | 19 |
| `/collections/iphone-13-repair-prices` | 88 | 76.1% | 20 |
| `/pages/contact` | 87 | 60.9% | 24 |
| `/pages/iphone-repairs` | 83 | 32.5% | 36 |
| `/pages/about-us` | 81 | 24.7% | 18 |
| `/collections/apple-watch-battery-repair-prices` | 70 | 87.1% | 21 |
| `/collections/macbook-pro-16-m1-pro-max-a2485-2021-` | 69 | 79.7% | 16 |

## Frustration hotspots (dead + rage clicks)

| Page | Dead | Rage | Frustrated sessions |
|---|---|---|---|
| `/` | 194 | 20 | 111 |
| `/collections/macbook-screen-repair-prices` | 86 | 19 | 74 |
| `/pages/our-services` | 74 | 0 | 26 |
| `/collections/macbook-repair-prices` | 67 | 0 | 23 |
| `/pages/advanced-diagnostic` | 50 | 2 | 24 |
| `/products/iphone-14-pro-battery-repair` | 51 | 0 | 9 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solu` | 43 | 0 | 12 |
| `/collections/iphone-battery-repair-prices` | 33 | 1 | 28 |
| `/products/iphone-13-battery-repair` | 30 | 1 | 19 |
| `/pages/contact` | 27 | 1 | 19 |
| `/pages/about-us` | 27 | 0 | 20 |
| `/collections/iphone-repair-prices` | 27 | 0 | 15 |
| `/pages/our-warranty` | 26 | 0 | 7 |
| `/collections/macbook-pro-13-m1-a2338-2020-repair-p` | 23 | 1 | 4 |
| `/pages/macbook-repairs` | 19 | 4 | 18 |

## Scroll reach (sessions hitting depth milestone)

| Page | Reached 25% | Reached 50% | Reached 75% |
|---|---|---|---|
| `/` | 43 | 38 | 30 |
| `/blogs/news/apple-pencil-not-working-after-repair` | 1 | 1 | 1 |
| `/blogs/news/how-long-does-a-macbook-repair-take` | 1 | 1 | 1 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solu` | 10 | 10 | 6 |
| `/blogs/news/things-to-know-before-iphone-repair` | 1 | 1 | 1 |
| `/collections/all-devices-repair-prices` | 1 | - | - |
| `/collections/apple-watch-battery-repair-prices` | 3 | 2 | - |
| `/collections/apple-watch-repair-prices` | 3 | - | - |
| `/collections/apple-watch-screen-glass-only-repair-` | 3 | 1 | - |
| `/collections/apple-watch-se-series-repair-prices` | 1 | 1 | - |
| `/collections/apple-watch-series-5-40mm-repair-pric` | 1 | - | - |
| `/collections/apple-watch-series-6-44mm-repair-pric` | 1 | - | - |
| `/collections/apple-watch-ultra-repair-prices` | 1 | - | - |
| `/collections/ipad-11th-gen-2025-repair-prices` | 1 | 1 | 1 |
| `/collections/ipad-8th-gen-a2270-a2428-a2429-a2430-` | 2 | - | - |

## Top JS exceptions

| Type | Message | Path | Count |
|---|---|---|---|
| None |  | `/collections/macbook-screen-repair-prices` | 71 |
| None |  | `/collections/macbook-keyboard-repair-prices` | 17 |
| None |  | `/blogs/news/macbook-pro-flexgate-repair-guide-solutions-for-screen-issues-on-2016-2018-models` | 6 |
| None |  | `/products/iphone-13-pro-max-battery-repair` | 5 |
| None |  | `/collections/iphone-repair-prices` | 4 |
| None |  | `/collections/ipad-repair-prices` | 4 |
| None |  | `/collections/iphone-battery-repair-prices` | 4 |
| None |  | `/` | 4 |
| None |  | `/collections/iphone-13-pro-max-repair-prices` | 3 |
| None |  | `/collections/iphone-13-series-repair-prices` | 3 |
