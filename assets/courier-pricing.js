/**
 * Courier / mail-in service adjustment helpers (#53 pricing policy v2).
 *
 * ALL-IN TOTALS — UI shows repair + adjustment as one total, never a
 * courier/repair breakdown.
 *
 * Matrix (Ricky 2026-09-11):
 *   ≥£200 (courier:free / courier:one-leg):
 *     B1–B2 → free collection & return
 *     B3 → +£15 · B4 → +£25 · or free mail-in
 *     Outside London → free tracked mail-in
 *   <£200 (untagged / paid):
 *     B1–B2 → +£25 courier today, or +£20 mail-in
 *     B3/B4 / outside → mail-in +£20 only
 *
 * Theme assets: courier-london-bands.json, service-adjustment-variants.json
 * No secrets. Safe for browser (theme asset) and Node (tests).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectCourier = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TIER_TAGS = {
    'courier:free': 'free',
    'courier:one-leg': 'one-leg',
    /* legacy pre-v2 tags → paid unless free/one-leg also present */
    'courier:subsidised': 'paid',
    'courier:full': 'paid',
  };

  var ADJUSTMENT = {
    B3_ONE_LEG: 15,
    B4_ONE_LEG: 25,
    PAID_COURIER: 25,
    MAIL_IN: 20,
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
   * @param {{ outward: Record<string, { band: string, rt_cost: number }> }} bandsAsset
   * @returns {{ service: 'courier'|'mail-in', outward: string|null, band: string|null, rt_cost: number|null }}
   */
  function lookupCourierBand(postcode, bandsAsset) {
    var outward = extractOutwardCode(postcode);
    if (!outward || !bandsAsset || !bandsAsset.outward) {
      return { service: 'mail-in', outward: outward, band: null, rt_cost: null };
    }
    var entry = bandsAsset.outward[outward];
    /* District fallback: SW1A → SW1 when only the district key exists. */
    if (!entry && /[A-Z]$/.test(outward)) {
      var district = outward.slice(0, -1);
      if (bandsAsset.outward[district]) {
        entry = bandsAsset.outward[district];
      }
    }
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

  function normalizeTags(productTags) {
    return Array.isArray(productTags)
      ? productTags
      : String(productTags || '')
          .split(',')
          .map(function (t) {
            return t.trim();
          })
          .filter(Boolean);
  }

  /**
   * Tag beats price threshold. free > one-leg > paid.
   * @param {string[]|string} productTags
   * @param {number} [repairPrice] optional — ≥£200 → free when untagged
   * @returns {'free'|'one-leg'|'paid'}
   */
  function resolveCourierTier(productTags, repairPrice) {
    var tags = normalizeTags(productTags);
    var found = null;
    var rank = { free: 3, 'one-leg': 2, paid: 1 };
    for (var i = 0; i < tags.length; i++) {
      var tier = TIER_TAGS[String(tags[i]).toLowerCase()];
      if (tier && (!found || rank[tier] > rank[found])) {
        found = tier;
      }
    }
    if (found === 'free' || found === 'one-leg') return found;
    if (found === 'paid') return 'paid';
    if (Number.isFinite(Number(repairPrice)) && Number(repairPrice) >= 200) {
      return 'free';
    }
    return 'paid';
  }

  function isFreeEligible(tier) {
    return tier === 'free' || tier === 'one-leg';
  }

  /**
   * @param {'free'|'one-leg'|'paid'} tier
   * @param {string|null} band B1–B4 or null (outside London)
   * @param {'courier'|'mail-in'} service
   * @returns {{ available: boolean, adjustment: number|null }}
   */
  function computeAdjustment(tier, band, service) {
    var free = isFreeEligible(tier);

    if (service === 'mail-in') {
      return { available: true, adjustment: free ? 0 : ADJUSTMENT.MAIL_IN };
    }

    if (!band) {
      return { available: false, adjustment: null };
    }
    if (free) {
      if (band === 'B1' || band === 'B2') {
        return { available: true, adjustment: 0 };
      }
      if (band === 'B3') {
        return { available: true, adjustment: ADJUSTMENT.B3_ONE_LEG };
      }
      if (band === 'B4') {
        return { available: true, adjustment: ADJUSTMENT.B4_ONE_LEG };
      }
      return { available: false, adjustment: null };
    }

    /* paid: courier only B1–B2 */
    if (band === 'B1' || band === 'B2') {
      return { available: true, adjustment: ADJUSTMENT.PAID_COURIER };
    }
    return { available: false, adjustment: null };
  }

  /**
   * Resolve Shopify variant ID for a quoted adjustment.
   * Null-safe: missing ID → free mail-in fallback (never charge £0 for a quote).
   *
   * @param {number} adjustment
   * @param {{ variants?: Record<string, number> }|Record<string, number>|null} variantsAsset
   * @param {{ warn?: function }} [opts]
   * @returns {{ variantId: number|null, mode: 'none'|'ok'|'fallback-free-mail-in', adjustment: number }}
   */
  function resolveAdjustmentVariant(adjustment, variantsAsset, opts) {
    var amount = roundMoney(adjustment || 0);
    if (!amount || amount <= 0) {
      return { variantId: null, mode: 'none', adjustment: 0 };
    }
    /* No variants asset yet (tests / early UI) — keep quoted adjustment, unresolved. */
    if (variantsAsset == null) {
      return { variantId: null, mode: 'unresolved', adjustment: amount };
    }
    var map =
      variantsAsset.variants != null ? variantsAsset.variants : variantsAsset;
    var key = String(Math.round(amount));
    var raw = map ? map[key] : null;
    var vid = raw != null && raw !== '' ? Number(raw) : null;
    if (vid && Number.isFinite(vid) && vid > 0) {
      return { variantId: vid, mode: 'ok', adjustment: amount };
    }
    var warn = opts && opts.warn ? opts.warn : console.warn;
    try {
      warn(
        '[icorrect courier] missing service-adjustment variant for £' +
          key +
          ' — falling back to free mail-in (never block checkout, never misprice)'
      );
    } catch (e) {}
    return { variantId: null, mode: 'fallback-free-mail-in', adjustment: 0 };
  }

  /**
   * Full quote for the selected service preference.
   *
   * @param {{
   *   postcode: string,
   *   productTags?: string[]|string,
   *   bands: object,
   *   service?: 'courier'|'mail-in',
   *   repairPrice?: number,
   *   variants?: object
   * }} opts
   */
  function quoteServiceAdjustment(opts) {
    opts = opts || {};
    var preference = opts.service === 'mail-in' ? 'mail-in' : 'courier';
    var lookup = lookupCourierBand(opts.postcode, opts.bands);
    var tier = resolveCourierTier(opts.productTags, opts.repairPrice);
    var band = lookup.band;
    var repair = Number.isFinite(Number(opts.repairPrice))
      ? roundMoney(opts.repairPrice)
      : null;

    var chosen = preference;
    var computed = computeAdjustment(tier, band, chosen);
    var forcedMailIn = false;

    if (chosen === 'courier' && !computed.available) {
      forcedMailIn = true;
      chosen = 'mail-in';
      computed = computeAdjustment(tier, band, 'mail-in');
    }

    if (preference === 'courier' && lookup.service === 'mail-in' && !forcedMailIn) {
      forcedMailIn = true;
      chosen = 'mail-in';
      computed = computeAdjustment(tier, null, 'mail-in');
    }

    var adjustment = computed.adjustment != null ? roundMoney(computed.adjustment) : 0;
    var variantInfo = resolveAdjustmentVariant(adjustment, opts.variants || null);

    if (variantInfo.mode === 'fallback-free-mail-in') {
      forcedMailIn = true;
      chosen = 'mail-in';
      adjustment = 0;
    }

    var total = repair != null ? roundMoney(repair + adjustment) : null;

    return {
      service: chosen,
      preference: preference,
      courierAvailable:
        lookup.service === 'courier' &&
        computeAdjustment(tier, band, 'courier').available,
      outward: lookup.outward,
      band: lookup.service === 'courier' ? band : null,
      rt_cost: lookup.service === 'courier' ? lookup.rt_cost : null,
      tier: tier,
      adjustment: adjustment,
      /* wizard / tests still read customer_price as the service adjustment */
      customer_price: adjustment,
      repair_price: repair,
      total: total,
      forcedMailIn: forcedMailIn,
      variantId: variantInfo.variantId,
      variantMode: variantInfo.mode,
    };
  }

  /**
   * Quote for courier preference (auto-falls back to mail-in when unavailable).
   * @param {{ postcode: string, productTags: string[]|string, bands: object, repairPrice?: number, variants?: object }} opts
   */
  function quoteCourierCollection(opts) {
    return quoteServiceAdjustment(
      Object.assign({}, opts, { service: 'courier' })
    );
  }

  /**
   * @deprecated policy v2 — adjustment for courier by tier+band (rtCost ignored).
   */
  function customerCourierPrice(tier, rtCost, band) {
    var computed = computeAdjustment(tier, band || null, 'courier');
    if (!computed.available) return null;
    return computed.adjustment;
  }

  return {
    TIER_TAGS: TIER_TAGS,
    ADJUSTMENT: ADJUSTMENT,
    extractOutwardCode: extractOutwardCode,
    lookupCourierBand: lookupCourierBand,
    resolveCourierTier: resolveCourierTier,
    computeAdjustment: computeAdjustment,
    resolveAdjustmentVariant: resolveAdjustmentVariant,
    quoteServiceAdjustment: quoteServiceAdjustment,
    quoteCourierCollection: quoteCourierCollection,
    customerCourierPrice: customerCourierPrice,
    isFreeEligible: isFreeEligible,
    roundMoney: roundMoney,
  };
});
