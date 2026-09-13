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

  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function normalizeName(s) {
    return String(s || '')
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
    var exact = mapAsset.models[deviceKey + '::' + wantSlug];
    if (exact) return exact;

    var best = null;
    var bestScore = 0;
    var keys = Object.keys(mapAsset.models);
    for (var i = 0; i < keys.length; i++) {
      var m = mapAsset.models[keys[i]];
      if (m.device !== deviceKey) continue;
      var n = normalizeName(m.name);
      var score = 0;
      if (m.slug === wantSlug || n === wantNorm) {
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
      if (wantA.length) {
        var shared = false;
        for (var a = 0; a < wantA.length; a++) {
          if (n.indexOf(wantA[a]) !== -1) shared = true;
        }
        if (!shared) score = 0;
      }
      if (score > bestScore) {
        bestScore = score;
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
    return {
      id: entry.productId,
      title: entry.title,
      handle: entry.handle,
      tags: entry.tags,
      variants: [
        {
          id: entry.variantId,
          price: String(Number(entry.price).toFixed(2)),
        },
      ],
      courierTier: entry.courierTier,
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
