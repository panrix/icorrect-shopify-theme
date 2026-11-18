# PostHog behaviour report — 28-day window

- Snapshot: `2026-05-02T13:35:56.211665+00:00`
- Window: 28 days (start `2026-04-04T13:35:56.211665+00:00`)
- Host: `icorrect.co.uk`  Project: `296651`

## Session volume + quality

- Total sessions: **11,952**
- Under 5s: 3,105  (26.0%)
- 5–30s: 3,805
- 30s–2min: 2,812
- 2–10min: 1,440
- 10min+: 790
- **% under 30s: 57.8%**
- % over 2min: 18.7%

## Wizard funnel

- wizard_entry: **14,177**
- wizard_step: 12,253
- wizard_resolution: 1,067
- wizard_abandoned: 2,290
- wizard_conversion: **148**
- Checkout Started: 125
- Checkout Step: Contact Info: 51
- Checkout Step: Shipping Info: 22
- Checkout Step: Payment Info: 44
- purchase_completed (new pixel): 8
- Order Completed (legacy): 0

### Derived funnel rates

- wizard_entry → wizard_step: **86.43%**
- wizard_step → wizard_resolution: **8.71%**
- wizard_resolution → wizard_conversion: **13.87%**
- wizard_entry → wizard_conversion: 1.04%
- wizard_entry → Checkout Started: 0.88%
- Checkout Started → Payment Info: 35.2%

### Resolution shown by route

| Route | Count |
|---|---|
| repair | 700 |
| diagnostic | 276 |
| contact | 90 |
| dismiss | 1 |

### Conversion by action

| Action | Count |
|---|---|
| book_repair | 47 |
| book_diagnostic | 37 |
| contact_submit | 37 |
| question_submit | 14 |
| email_quote | 13 |

### Wizard funnel by device (from step-1 picker)

| Device | Entry | Step | Resolution | Conversion |
|---|---|---|---|---|
| None | 8,415 | 0 | 0 | 0 |
| iphone | 2,597 | 5,333 | 396 | 52 |
| macbook | 1,823 | 4,340 | 487 | 73 |
| ipad | 792 | 1,506 | 128 | 13 |
| watch | 550 | 1,074 | 56 | 10 |

## Top landing pages

| Page | Sessions | Bounce % | Median duration (s) |
|---|---|---|---|
| `/collections/macbook-screen-repair-prices` | 1,685 | 84.4% | 6 |
| `/` | 1,041 | 76.2% | 34 |
| `/collections/iphone-battery-repair-prices` | 788 | 71.2% | 28 |
| `/pages/macbook-repairs` | 692 | 74.4% | 7 |
| `/collections/iphone-screen-repair-prices` | 184 | 74.5% | 24 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solu` | 173 | 86.1% | 35 |
| `/collections/iphone-rear-camera-lens-repair-prices` | 146 | 79.5% | 27 |
| `/collections/macbook-battery-repair-prices` | 139 | 66.2% | 49 |
| `/collections/macbook-keyboard-repair-prices` | 130 | 79.2% | 35 |
| `/collections/apple-watch-screen-glass-only-repair-` | 125 | 82.4% | 24 |
| `/collections/macbook-repair-prices` | 119 | 13.4% | 78 |
| `/collections/iphone-16-repair-prices` | 111 | 85.6% | 17 |
| `/collections/iphone-repair-prices` | 96 | 9.4% | 86 |
| `/collections/iphone-13-repair-prices` | 93 | 78.5% | 19 |
| `/pages/iphone-repairs` | 84 | 25.0% | 23 |
| `/collections/apple-watch-battery-repair-prices` | 83 | 92.8% | 21 |
| `/collections/iphone-14-pro-max-repair-prices` | 82 | 80.5% | 20 |
| `/collections/iphone-16-pro-repair-prices` | 77 | 88.3% | 22 |
| `/pages/about-us` | 77 | 23.4% | 12 |
| `/collections/macbook-air-13-m1-a2337-2020-repair-p` | 76 | 75.0% | 20 |

## Frustration hotspots (dead + rage clicks)

| Page | Dead | Rage | Frustrated sessions |
|---|---|---|---|
| `/` | 150 | 26 | 109 |
| `/collections/macbook-screen-repair-prices` | 91 | 21 | 73 |
| `/collections/macbook-repair-prices` | 76 | 0 | 22 |
| `/pages/our-services` | 65 | 0 | 29 |
| `/pages/advanced-diagnostic` | 46 | 2 | 21 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solu` | 45 | 0 | 12 |
| `/pages/about-us` | 42 | 0 | 17 |
| `/collections/iphone-repair-prices` | 40 | 0 | 21 |
| `/collections/iphone-battery-repair-prices` | 38 | 1 | 30 |
| `/products/iphone-13-battery-repair` | 28 | 1 | 19 |
| `/collections/apple-watch-battery-repair-prices` | 28 | 0 | 4 |
| `/pages/contact` | 24 | 2 | 19 |
| `/collections/macbook-pro-13-m1-a2338-2020-repair-p` | 24 | 1 | 5 |
| `/pages/our-warranty` | 24 | 0 | 5 |
| `/products/iphone-14-pro-max-battery-repair` | 20 | 4 | 10 |

## Scroll reach (sessions hitting depth milestone)

| Page | Reached 25% | Reached 50% | Reached 75% |
|---|---|---|---|
| `/` | 311 | 272 | 223 |
| `/blogs/news` | 3 | 3 | 3 |
| `/blogs/news/apple-pencil-issue-in-ipad-pro-screen-` | 5 | 5 | 4 |
| `/blogs/news/apple-pencil-not-working-after-repair` | 14 | 12 | 9 |
| `/blogs/news/how-long-does-a-macbook-repair-take` | 3 | 3 | 3 |
| `/blogs/news/iphone-14-pro-battery-issue-what-icorr` | 2 | 2 | 1 |
| `/blogs/news/iphone-face-id-not-working-try-these-t` | 1 | 1 | 1 |
| `/blogs/news/iphone-showing-no-service-unable-to-co` | 8 | 6 | 6 |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solu` | 38 | 34 | 23 |
| `/blogs/news/macbook-screen-only-working-at-slight-` | 7 | 5 | 5 |
| `/blogs/news/navigating-macbook-liquid-damage-and-w` | 1 | 1 | 1 |
| `/blogs/news/original-iphone-screen-repair-vs-after` | 2 | 2 | 1 |
| `/blogs/news/things-to-know-before-iphone-repair` | 1 | 1 | 1 |
| `/blogs/news/why-icorrect-chooses-apple-original-se` | 1 | 1 | 1 |
| `/cart` | 5 | 3 | 2 |

## Top JS exceptions

| Type | Message | Path | Count |
|---|---|---|---|
| None |  | `/collections/macbook-screen-repair-prices` | 291 |
| None |  | `/` | 76 |
| None |  | `/collections/macbook-keyboard-repair-prices` | 30 |
| None |  | `/collections/iphone-battery-repair-prices` | 18 |
| None |  | `/collections/macbook-battery-repair-prices` | 18 |
| None |  | `/collections/iphone-15-pro-repair-prices` | 17 |
| None |  | `/search` | 17 |
| None |  | `/collections/iphone-repair-prices` | 14 |
| None |  | `/collections/iphone-11-repair-prices` | 14 |
| None |  | `/collections/iphone-rear-camera-lens-repair-prices` | 13 |

## Validation failures (book_now_validation_failed)

| Reason | Count |
|---|---|
| `unknown` | 4 |
| `Please select a preferred date.` | 4 |
