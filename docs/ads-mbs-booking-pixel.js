// DRAFT, NOT INSTALLED. Shopify admin > Settings > Customer events > Add custom pixel.
// Name: "Ads page booking (GA4)". Permission: Analytics. Data sale: not sold.
//
// Why: the ads page (page.ads-macbook-screen) tags the cart with lp, lp_variant and lp_in_test.
// Checkout runs on Shopify, outside the theme, so the page cannot see the booking. This pixel
// sends one GA4 "booking" event per completed checkout that came from the ads page, with its
// variant, so bookings per variant sit next to quote_start and quote_complete in GA4.
// Shopify orders keep the same attributes, so the order list stays the first-party count.
// No personal data is sent: no name, email, phone or address.

const GA4_ID = 'G-YHN7YHZNM8';

function attr(checkout, key) {
  const list = (checkout && checkout.attributes) || [];
  const hit = list.find((a) => a && a.key === key);
  return hit ? hit.value : null;
}

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data && event.data.checkout;
  if (attr(checkout, 'lp') !== 'ads-macbook-screen') return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA4_ID, { send_page_view: false });
  gtag('event', 'booking', {
    lp: 'ads-macbook-screen',
    lp_variant: attr(checkout, 'lp_variant'),
    lp_in_test: attr(checkout, 'lp_in_test'),
    value: checkout.totalPrice ? Number(checkout.totalPrice.amount) : undefined,
    currency: checkout.currencyCode || 'GBP',
    transaction_id: checkout.order ? checkout.order.id : checkout.token,
  });
});
