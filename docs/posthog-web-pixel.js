/**
 * PostHog custom Web Pixel — paste into Shopify Admin.
 *
 * Location: Shopify Admin → Settings → Customer Events → Add custom pixel
 *   Name:       "PostHog Purchase"
 *   Permission: "Not required" (analytics data)
 *   Code:       everything below
 *
 * Purpose:
 *   1. Fire posthog.capture('purchase_completed', ...) on checkout_completed
 *      so PostHog funnels show purchases (currently zero — see audit 2026-04-21 §4).
 *   2. Bridge the cross-domain identity gap by reading ?ph_distinct_id= from
 *      the checkout URL (set by snippets/posthog-tracking.liquid on the
 *      storefront) and calling posthog.identify($anon_distinct_id: …).
 *
 * References:
 *   - Web Pixels API docs: https://shopify.dev/docs/api/web-pixels-api
 *   - PostHog JS snippet:  https://posthog.com/docs/libraries/js
 */
import { register } from '@shopify/web-pixels-api';

register(({ analytics, init, browser }) => {
  var POSTHOG_KEY = 'phc_E4K3ulD49Fth2l3WOFjPpBbdgsbJwRMrErbWGjpppLB';
  var POSTHOG_HOST = 'https://us.i.posthog.com';

  function loadPostHog(onReady) {
    !(function (t, e) {
      var o, n, p, r;
      e.__SV ||
        ((window.posthog = e),
        (e._i = []),
        (e.init = function (i, s, a) {
          function g(t, e) {
            var o = e.split('.');
            2 == o.length && ((t = t[o[0]]), (e = o[1])),
              (t[e] = function () {
                t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
              });
          }
          (p = t.createElement('script')),
            (p.type = 'text/javascript'),
            (p.async = !0),
            (p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js'),
            (r = t.getElementsByTagName('script')[0]),
            r.parentNode.insertBefore(p, r);
          var u = e;
          for (
            void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
              u.people = u.people || [],
              u.toString = function (t) {
                var e = 'posthog';
                return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
              },
              u.people.toString = function () {
                return u.toString(1) + '.people (stub)';
              },
              o = 'init capture identify'.split(' '),
              n = 0;
            n < o.length;
            n++
          )
            g(u, o[n]);
          e._i.push([i, s, a]);
        }),
        (e.__SV = 1));
    })(document, window.posthog || []);
    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'always',
      loaded: onReady
    });
  }

  function getUrlParam(name) {
    try {
      var url = (init && init.context && init.context.window && init.context.window.location && init.context.window.location.href) || '';
      var m = url.match(new RegExp('[?&]' + name + '=([^&]+)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) {
      return null;
    }
  }

  loadPostHog(function () {
    // Identity bridge: reconcile storefront PostHog anon id with checkout email
    var phDistinctId = getUrlParam('ph_distinct_id');
    var customerEmail = init && init.data && init.data.customer && init.data.customer.email;
    if (customerEmail) {
      window.posthog.identify(customerEmail, phDistinctId ? { $anon_distinct_id: phDistinctId } : {});
    } else if (phDistinctId) {
      // No email yet (guest) — at least align distinct ids
      try { window.posthog.reset(false); } catch (e) {}
      window.posthog.register({ $anon_distinct_id: phDistinctId });
    }
  });

  analytics.subscribe('checkout_completed', function (event) {
    var checkout = (event && event.data && event.data.checkout) || {};
    var order = checkout.order || {};
    var total = checkout.totalPrice || {};
    var items = (checkout.lineItems || []).map(function (li) {
      return {
        variant_id: li.variant && li.variant.id,
        product_id: li.variant && li.variant.product && li.variant.product.id,
        title: li.title,
        quantity: li.quantity,
        price: li.variant && li.variant.price && li.variant.price.amount
      };
    });

    if (!window.posthog) return;
    window.posthog.capture('purchase_completed', {
      order_id: order.id || checkout.token,
      order_number: order.orderNumber,
      value: total.amount,
      currency: total.currencyCode,
      item_count: items.length,
      items: items,
      source_url: init && init.context && init.context.document && init.context.document.referrer
    });
  });
});
