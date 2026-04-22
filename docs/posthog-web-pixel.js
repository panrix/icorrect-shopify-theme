/**
 * iCorrect PostHog Web Pixel — addendum for v3.1 → v3.2
 *
 * CONTEXT
 * A custom Web Pixel already exists in Shopify Admin → Settings →
 * Customer Events (version v3.1, identified by the header
 * "iCorrect — PostHog Web Pixel"). It handles checkout_started,
 * checkout_contact_info_submitted, checkout_shipping_info_submitted,
 * and payment_info_submitted — but NOT checkout_completed, which is
 * why PostHog shows 0 Purchase events (see audit 2026-04-21 §4).
 *
 * THIS FILE
 * The single block below — paste it into the existing v3.1 pixel, at
 * the bottom (before the final closing line). Also bump the version
 * comment at the top of the pixel from v3.1 to v3.2.
 *
 * DO NOT create a second pixel — it would double-fire every checkout
 * event. Edit the existing one.
 *
 * The block reuses the existing helpers (getStorefrontDistinctId,
 * phIdentify, phCapture) so no new dependencies are introduced.
 */

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  const order = checkout?.order;
  const email = checkout?.email;
  const anonId = getStorefrontDistinctId(event);
  const id = email || anonId || 'anon_checkout';
  if (email) phIdentify(email, anonId);
  phCapture('purchase_completed', id, {
    order_id: order?.id || checkout?.token,
    order_number: order?.orderNumber,
    total_price: parseFloat(checkout?.totalPrice?.amount) || 0,
    currency: checkout?.currencyCode,
    item_count: checkout?.lineItems?.length || 0,
    items: (checkout?.lineItems || []).map(li => ({
      variant_id: li?.variant?.id,
      product_id: li?.variant?.product?.id,
      title: li?.title,
      quantity: li?.quantity,
      price: parseFloat(li?.variant?.price?.amount) || 0
    }))
  });
});
