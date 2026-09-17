/**
 * Repair catalogue lookup — theme asset (#53).
 * Reads assets/repair-catalogue-map.json (device → model → repairType → variant).
 * No HTML scraping. No secrets.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectCatalogue = factory();
    /* wizard aliases */

  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* Wizard menus use 13"; Monday Touch Bar titles use 13"; other SKUs use 13-inch. */
  function canonicalizeModelText(s) {
    return String(s || '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/(\d+)\s*-?\s*(?:["\u2033](?=[\s'"]|$)|inch\b)/gi, '$1-inch');
  }

  function slugify(s) {
    return canonicalizeModelText(s)
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function normalizeName(s) {
    return canonicalizeModelText(s)
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  /**
   * @param {object} mapAsset repair-catalogue-map.json
   * @param {string} device macbook|iphone|ipad|watch
   * @param {string} modelName wizard model label
   */
  function findModel(mapAsset, device, modelName) {
    if (!mapAsset || !mapAsset.models) return null;
    var deviceKey = String(device || '').toLowerCase();
    if (deviceKey === 'mac') deviceKey = 'macbook';
    if (deviceKey === 'apple-watch') deviceKey = 'watch';
    var wantSlug = slugify(modelName);
    var wantNorm = normalizeName(modelName);
    var wantA = wantNorm.match(/a\d{4}/g) || [];

    var best = null;
    var bestScore = 0;
    var bestRepairs = 0;
    var keys = Object.keys(mapAsset.models);
    for (var i = 0; i < keys.length; i++) {
      var m = mapAsset.models[keys[i]];
      if (m.device !== deviceKey) continue;
      var n = normalizeName(m.name);
      var score = 0;
      var aliasHit = false;
      var aliases = Array.isArray(m.aliases) ? m.aliases : [];
      for (var al = 0; al < aliases.length; al++) {
        if (slugify(aliases[al]) === wantSlug || normalizeName(aliases[al]) === wantNorm) {
          aliasHit = true;
          break;
        }
      }
      if (m.slug === wantSlug || n === wantNorm || aliasHit) {
        score = 100;
      } else {
        // A-number hits are strong signals
        for (var j = 0; j < wantA.length; j++) {
          if (n.indexOf(wantA[j]) !== -1) score += 40;
        }
        // Prefer longer containment (avoid matching bare "macbook")
        if (wantNorm.length >= 10 && n.indexOf(wantNorm) !== -1) score += 50;
        if (n.length >= 10 && wantNorm.indexOf(n) !== -1) score += 45;
        // Shared meaningful tokens (length > 2, skip device words)
        var skip = { macbook: 1, iphone: 1, ipad: 1, watch: 1, apple: 1, inch: 1 };
        var wantToks = wantNorm.split(' ').filter(function (t) {
          return t.length > 2 && !skip[t];
        });
        var hit = 0;
        for (var k = 0; k < wantToks.length; k++) {
          if (n.indexOf(wantToks[k]) !== -1) hit += 1;
        }
        if (wantToks.length) score += Math.round((hit / wantToks.length) * 30);
      }
      // If query has an A-number, require the candidate to share one
      // (skip when the wizard menu alias already matched)
      if (wantA.length && !aliasHit) {
        var shared = false;
        for (var a = 0; a < wantA.length; a++) {
          if (n.indexOf(wantA[a]) !== -1) shared = true;
        }
        if (!shared) score = 0;
      }
      var repairCount = m.repairs ? Object.keys(m.repairs).length : 0;
      if (
        score > bestScore ||
        (score === bestScore && score >= 40 && repairCount > bestRepairs)
      ) {
        bestScore = score;
        bestRepairs = repairCount;
        best = m;
      }
    }
    return bestScore >= 40 ? best : null;
  }

  function getRepair(mapAsset, device, modelName, repairType) {
    var model = findModel(mapAsset, device, modelName);
    if (!model || !model.repairs) return null;
    return model.repairs[repairType] || null;
  }

  /** Shape a catalogue repair entry like a products.json product for the wizard. */
  function asWizardProduct(entry) {
    if (!entry) return null;
    var tags = Array.isArray(entry.tags) ? entry.tags.slice() : [];
    var tier = entry.courierTier || null;
    if (!tier) {
      for (var i = 0; i < tags.length; i++) {
        var m = String(tags[i] || '').toLowerCase().match(/^courier:(.+)$/);
        if (m) { tier = m[1]; break; }
      }
    }
    return {
      id: entry.productId || entry.variantId,
      title: entry.title,
      handle: entry.handle,
      tags: tags,
      variants: [
        {
          id: entry.variantId,
          price: String(Number(entry.price).toFixed(2)),
        },
      ],
      courierTier: tier,
      _fromCatalogue: true,
    };
  }

  function repairsMapForModel(mapAsset, device, modelName) {
    var model = findModel(mapAsset, device, modelName);
    var out = {};
    if (!model || !model.repairs) return out;
    var types = Object.keys(model.repairs);
    for (var i = 0; i < types.length; i++) {
      out[types[i]] = asWizardProduct(model.repairs[types[i]]);
    }
    return out;
  }

  return {
    slugify: slugify,
    findModel: findModel,
    getRepair: getRepair,
    asWizardProduct: asWizardProduct,
    repairsMapForModel: repairsMapForModel,
  };
});
