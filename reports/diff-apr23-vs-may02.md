# PostHog behaviour diff — 28-day windows

- **Before:** `2026-04-23T12:23:00.916676+00:00` (window_start 2026-03-26T12:23:00.916676+00:00)
- **After:**  `2026-05-02T13:35:56.211665+00:00` (window_start 2026-04-04T13:35:56.211665+00:00)

Markers: `▲` up  `▼` down  `📈` +20%+  `📉` -20%+  `✨` new data  `·` flat

### Session duration distribution

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| Total sessions | 12,127 | 11,952 | -175 | -1.4% | ▼ |
| Under 5s | 3,119 | 3,105 | -14 | -0.4% | ▼ |
| 5–30s | 3,800 | 3,805 | +5 | +0.1% | ▲ |
| 30s–2min | 2,922 | 2,812 | -110 | -3.8% | ▼ |
| 2–10min | 1,493 | 1,440 | -53 | -3.5% | ▼ |
| 10min+ | 793 | 790 | -3 | -0.4% | ▼ |
| % under 30s | 57.1 | 57.8 | +0.6999999999999957 | +1.2% | ▲ |
| % over 2min | 18.9 | 18.7 | -0.1999999999999993 | -1.1% | ▼ |

### Wizard + checkout event counts

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| $exception | 138 | 876 | +738 | +534.8% | 📈 |
| Checkout Started | 130 | 125 | -5 | -3.8% | ▼ |
| Checkout Step: Contact Info | 51 | 51 | +0 | +0.0% | · |
| Checkout Step: Payment Info | 45 | 44 | -1 | -2.2% | ▼ |
| Checkout Step: Shipping Info | 21 | 22 | +1 | +4.8% | ▲ |
| Order Completed | 0 | 0 | +0 | 0% | · |
| Product Added to Cart | 142 | 163 | +21 | +14.8% | ▲ |
| book_now_clicked | 2 | 28 | +26 | +1300.0% | 📈 |
| book_now_validation_failed | 0 | 8 | +8 | new | ✨ |
| booking_form_started | 2 | 26 | +24 | +1200.0% | 📈 |
| email_quote_clicked | 1 | 4 | +3 | +300.0% | 📈 |
| faq_expanded | 48 | 347 | +299 | +622.9% | 📈 |
| proceed_to_checkout_clicked | 2 | 28 | +26 | +1300.0% | 📈 |
| purchase_completed | 0 | 8 | +8 | new | ✨ |
| question_form_opened | 3 | 15 | +12 | +400.0% | 📈 |
| wizard_abandoned | 2,186 | 2,290 | +104 | +4.8% | ▲ |
| wizard_conversion | 152 | 148 | -4 | -2.6% | ▼ |
| wizard_entry | 8,848 | 14,177 | +5,329 | +60.2% | 📈 |
| wizard_resolution | 1,147 | 1,067 | -80 | -7.0% | ▼ |
| wizard_resolution_abandoned | 61 | 100 | +39 | +63.9% | 📈 |
| wizard_step | 11,396 | 12,253 | +857 | +7.5% | ▲ |

### Wizard / checkout funnel rates

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| wizard_entry → wizard_step (%) | 128.8 | 86.43 | -42.370000000000005 | -32.9% | 📉 |
| wizard_step → wizard_resolution (%) | 10.06 | 8.71 | -1.3499999999999996 | -13.4% | ▼ |
| wizard_resolution → wizard_conversion (%) | 13.25 | 13.87 | +0.6199999999999992 | +4.7% | ▲ |
| wizard_entry → wizard_conversion (%) | 1.72 | 1.04 | -0.6799999999999999 | -39.5% | 📉 |
| wizard_entry → Checkout Started (%) | 1.47 | 0.88 | -0.59 | -40.1% | 📉 |
| Checkout Started → Payment Info (%) | 34.62 | 35.2 | +0.5800000000000054 | +1.7% | ▲ |

### Dead + rage clicks per page (top 15)

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| `/` | 214 | 176 | -38 | -17.8% | ▼ |
| `/collections/macbook-screen-repair-prices` | 105 | 112 | +7 | +6.7% | ▲ |
| `/collections/macbook-repair-prices` | 67 | 76 | +9 | +13.4% | ▲ |
| `/pages/our-services` | 74 | 65 | -9 | -12.2% | ▼ |
| `/pages/advanced-diagnostic` | 52 | 48 | -4 | -7.7% | ▼ |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solutions` | 43 | 45 | +2 | +4.7% | ▲ |
| `/collections/iphone-battery-repair-prices` | 34 | 39 | +5 | +14.7% | ▲ |
| `/pages/about-us` | 27 | 42 | +15 | +55.6% | 📈 |
| `/products/iphone-14-pro-battery-repair` | 51 | 17 | -34 | -66.7% | 📉 |
| `/collections/iphone-repair-prices` | 27 | 40 | +13 | +48.1% | 📈 |
| `/products/iphone-13-battery-repair` | 31 | 29 | -2 | -6.5% | ▼ |
| `/pages/contact` | 28 | 26 | -2 | -7.1% | ▼ |
| `/pages/our-warranty` | 26 | 24 | -2 | -7.7% | ▼ |
| `/collections/macbook-pro-13-m1-a2338-2020-repair-prices` | 24 | 25 | +1 | +4.2% | ▲ |
| `/products/iphone-14-pro-max-battery-repair` | 22 | 24 | +2 | +9.1% | ▲ |

### Bounce rate per landing page (top 15 by sessions)

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| `/collections/macbook-screen-repair-prices` (bounce%) | 82.7 | 84.4 | +1.7000000000000028 | +2.1% | ▲ |
| `/` (bounce%) | 75.2 | 76.2 | +1.0 | +1.3% | ▲ |
| `/collections/iphone-battery-repair-prices` (bounce%) | 70.4 | 71.2 | +0.7999999999999972 | +1.1% | ▲ |
| `/pages/macbook-repairs` (bounce%) | 73.8 | 74.4 | +0.6000000000000085 | +0.8% | ▲ |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solutions` (bounce%) | 87.6 | 86.1 | -1.5 | -1.7% | ▼ |
| `/collections/iphone-screen-repair-prices` (bounce%) | 71.5 | 74.5 | +3.0 | +4.2% | ▲ |
| `/collections/apple-watch-screen-glass-only-repair-price` (bounce%) | 86.5 | 82.4 | -4.099999999999994 | -4.7% | ▼ |
| `/collections/iphone-rear-camera-lens-repair-prices` (bounce%) | 80.7 | 79.5 | -1.2000000000000028 | -1.5% | ▼ |
| `/collections/macbook-battery-repair-prices` (bounce%) | 64.8 | 66.2 | +1.4000000000000057 | +2.2% | ▲ |
| `/collections/macbook-keyboard-repair-prices` (bounce%) | 76.1 | 79.2 | +3.1000000000000085 | +4.1% | ▲ |
| `/collections/iphone-16-repair-prices` (bounce%) | 83.2 | 85.6 | +2.3999999999999915 | +2.9% | ▲ |
| `/collections/macbook-repair-prices` (bounce%) | 11.6 | 13.4 | +1.8000000000000007 | +15.5% | ▲ |
| `/collections/iphone-repair-prices` (bounce%) | 12.9 | 9.4 | -3.5 | -27.1% | 📉 |
| `/collections/iphone-13-repair-prices` (bounce%) | 76.1 | 78.5 | +2.4000000000000057 | +3.2% | ▲ |
| `/collections/iphone-14-pro-max-repair-prices` (bounce%) | 83.1 | 80.5 | -2.5999999999999943 | -3.1% | ▼ |

### Median session duration per landing page (top 15)

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| `/collections/macbook-screen-repair-prices` (median s) | 6 | 6 | +0 | +0.0% | · |
| `/` (median s) | 38 | 34 | -4 | -10.5% | ▼ |
| `/collections/iphone-battery-repair-prices` (median s) | 27 | 28 | +1 | +3.7% | ▲ |
| `/pages/macbook-repairs` (median s) | 6 | 7 | +1 | +16.7% | ▲ |
| `/blogs/news/macbook-pro-flexgate-repair-guide-solutions` (median s) | 30 | 35 | +5 | +16.7% | ▲ |
| `/collections/iphone-screen-repair-prices` (median s) | 26 | 24 | -2 | -7.7% | ▼ |
| `/collections/apple-watch-screen-glass-only-repair-price` (median s) | 24 | 24 | +0 | +0.0% | · |
| `/collections/iphone-rear-camera-lens-repair-prices` (median s) | 23 | 27 | +4 | +17.4% | ▲ |
| `/collections/macbook-keyboard-repair-prices` (median s) | 35 | 35 | +0 | +0.0% | · |
| `/collections/macbook-battery-repair-prices` (median s) | 49 | 49 | +0 | +0.0% | · |
| `/collections/iphone-16-repair-prices` (median s) | 19 | 17 | -2 | -10.5% | ▼ |
| `/pages/contact` (median s) | 24 | 26 | +2 | +8.3% | ▲ |
| `/collections/iphone-13-repair-prices` (median s) | 20 | 19 | -1 | -5.0% | ▼ |
| `/collections/iphone-repair-prices` (median s) | 67 | 86 | +19 | +28.4% | 📈 |
| `/collections/macbook-repair-prices` (median s) | 91 | 78 | -13 | -14.3% | ▼ |

### Scroll-to-75% reach per page (top 15)

| Metric | Before | After | Δ | % | |
|---|---|---|---|---|---|
| `/` reach_75 | 30 | 223 | +193 | +643.3% | 📈 |
| `/blogs/news` reach_75 | - | 3 | - | n/a | · |
| `/blogs/news/apple-pencil-issue-in-ipad-p` reach_75 | - | 4 | - | n/a | · |
| `/blogs/news/apple-pencil-not-working-aft` reach_75 | 1 | 9 | +8 | +800.0% | 📈 |
| `/blogs/news/how-long-does-a-macbook-repa` reach_75 | 1 | 3 | +2 | +200.0% | 📈 |
| `/blogs/news/iphone-14-pro-battery-issue-` reach_75 | - | 1 | - | n/a | · |
| `/blogs/news/iphone-face-id-not-working-t` reach_75 | - | 1 | - | n/a | · |
| `/blogs/news/iphone-showing-no-service-un` reach_75 | - | 6 | - | n/a | · |
| `/blogs/news/macbook-pro-flexgate-repair-` reach_75 | 6 | 23 | +17 | +283.3% | 📈 |
| `/blogs/news/macbook-screen-only-working-` reach_75 | - | 5 | - | n/a | · |
| `/blogs/news/navigating-macbook-liquid-da` reach_75 | - | 1 | - | n/a | · |
| `/blogs/news/original-iphone-screen-repai` reach_75 | - | 1 | - | n/a | · |
| `/blogs/news/things-to-know-before-iphone` reach_75 | 1 | 1 | +0 | +0.0% | · |
| `/blogs/news/why-icorrect-chooses-apple-o` reach_75 | - | 1 | - | n/a | · |
| `/cart` reach_75 | - | 2 | - | n/a | · |
