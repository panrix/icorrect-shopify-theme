/**
 * Courier collection pricing helpers for the London band table (#53).
 *
 * Theme asset: assets/courier-london-bands.json (outward → band B1–B4 + rt_cost).
 * Tiers via product tags: courier:free | courier:subsidised | courier:full
 *   free = £0, subsidised = half band RT, full = band RT.
 * Unknown outward code → mail-in fallback (no courier price).
 *
 * No secrets. Safe for browser (theme asset) and Node (tests).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectCourier = factory();
    /* wizard aliases */

  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TIER_TAGS = {
    'courier:free': 'free',
    'courier:subsidised': 'subsidised',
    'courier:full': 'full',
  };

  var TIER_MODIFIERS = {
    free: 0,
    subsidised: 0.5,
    full: 1,
  };

  function roundMoney(value) {
    return Math.round(Number(value) * 100) / 100;
  }

  /**
   * Outward code = postcode prefix before the space, uppercased.
   * @param {string} postcode
   * @returns {string|null}
   */
  function extractOutwardCode(postcode) {
    if (postcode == null) return null;
    var cleaned = String(postcode).trim().toUpperCase().replace(/\s+/g, ' ');
    if (!cleaned) return null;
    var outward = cleaned.split(' ')[0];
    return outward || null;
  }

  /**
   * @param {string} postcode
   * @param {{ outward: Record<string, { band: string, rt_cost: number }>, fallback?: string }} bandsAsset
   * @returns {{ service: 'courier'|'mail-in', outward: string|null, band: string|null, rt_cost: number|null }}
   */
  function lookupCourierBand(postcode, bandsAsset) {
    var outward = extractOutwardCode(postcode);
    if (!outward || !bandsAsset || !bandsAsset.outward) {
      return { service: 'mail-in', outward: outward, band: null, rt_cost: null };
    }
    var entry = bandsAsset.outward[outward];
    if (!entry) {
      return { service: 'mail-in', outward: outward, band: null, rt_cost: null };
    }
    return {
      service: 'courier',
      outward: outward,
      band: entry.band,
      rt_cost: entry.rt_cost,
    };
  }

  /**
   * @param {string[]|string} productTags
   * @returns {'free'|'subsidised'|'full'|null}
   */
  function resolveCourierTier(productTags) {
    var tags = Array.isArray(productTags)
      ? productTags
      : String(productTags || '')
          .split(',')
          .map(function (t) {
            return t.trim();
          });
    // Prefer free > subsidised > full if multiple tags somehow present.
    var found = null;
    var rank = { free: 3, subsidised: 2, full: 1 };
    for (var i = 0; i < tags.length; i++) {
      var tier = TIER_TAGS[String(tags[i]).toLowerCase()];
      if (tier && (!found || rank[tier] > rank[found])) {
        found = tier;
      }
    }
    return found;
  }

  /**
   * @param {'free'|'subsidised'|'full'} tier
   * @param {number} rtCost band RT for the outward code
   * @returns {number|null}
   */
  function customerCourierPrice(tier, rtCost) {
    if (tier == null || !Object.prototype.hasOwnProperty.call(TIER_MODIFIERS, tier)) {
      return null;
    }
    if (!Number.isFinite(Number(rtCost))) return null;
    return roundMoney(Number(rtCost) * TIER_MODIFIERS[tier]);
  }

  /**
   * @param {{ postcode: string, productTags: string[]|string, bands: object }} opts
   */
  function quoteCourierCollection(opts) {
    var lookup = lookupCourierBand(opts.postcode, opts.bands);
    var tier = resolveCourierTier(opts.productTags);
    if (lookup.service !== 'courier') {
      return {
        service: 'mail-in',
        outward: lookup.outward,
        band: null,
        rt_cost: null,
        tier: tier,
        customer_price: null,
      };
    }
    return {
      service: 'courier',
      outward: lookup.outward,
      band: lookup.band,
      rt_cost: lookup.rt_cost,
      tier: tier,
      customer_price: customerCourierPrice(tier, lookup.rt_cost),
    };
  }

  return {
    TIER_TAGS: TIER_TAGS,
    TIER_MODIFIERS: TIER_MODIFIERS,
    extractOutwardCode: extractOutwardCode,
    lookupCourierBand: lookupCourierBand,
    resolveCourierTier: resolveCourierTier,
    customerCourierPrice: customerCourierPrice,
    quoteCourierCollection: quoteCourierCollection,
    roundMoney: roundMoney,
  };
});
