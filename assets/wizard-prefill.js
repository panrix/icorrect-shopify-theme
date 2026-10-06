/**
 * Resolve quote-wizard prefill from a collection handle (#53).
 * Data-driven via assets/wizard-collection-prefill.json — no per-template edits.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectWizardPrefill = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function resolveCollectionPrefill(handle, rulesAsset) {
    var h = String(handle || '').toLowerCase();
    var out = { device: null, fault: null };
    if (!h || !rulesAsset || !Array.isArray(rulesAsset.rules)) return out;
    /* Longest matching rule wins per field, so "rear-glass" beats "glass" and
       "earpiece" beats "speaker". Equal lengths keep the earlier rule. */
    var devLen = 0, faultLen = 0;
    for (var i = 0; i < rulesAsset.rules.length; i++) {
      var rule = rulesAsset.rules[i];
      var m = String(rule.match || '').toLowerCase();
      if (!m || h.indexOf(m) === -1) continue;
      if (rule.device && m.length > devLen) { out.device = rule.device; devLen = m.length; }
      if (rule.fault && m.length > faultLen) { out.fault = rule.fault; faultLen = m.length; }
    }
    return out;
  }

  /**
   * Reverse-lookup catalogue map entry by variant id or product handle.
   * @param {object} catalogueMap repair-catalogue-map.json
   * @param {{ variantId?: number|string, handle?: string }} needle
   */
  function resolveProductPrefill(catalogueMap, needle) {
    needle = needle || {};
    var wantVid = needle.variantId != null ? String(needle.variantId) : null;
    var wantHandle = needle.handle ? String(needle.handle).toLowerCase() : null;
    var models = (catalogueMap && catalogueMap.models) || {};
    var keys = Object.keys(models);
    for (var i = 0; i < keys.length; i++) {
      var model = models[keys[i]];
      var repairs = (model && model.repairs) || {};
      var rKeys = Object.keys(repairs);
      for (var j = 0; j < rKeys.length; j++) {
        var repair = repairs[rKeys[j]];
        if (!repair) continue;
        var vid = repair.variantId != null ? String(repair.variantId) : '';
        var handle = repair.handle ? String(repair.handle).toLowerCase() : '';
        if ((wantVid && vid === wantVid) || (wantHandle && handle === wantHandle)) {
          return {
            device: model.device || null,
            modelName: model.name || null,
            modelSlug: model.slug || null,
            fault: rKeys[j],
            variantId: repair.variantId,
            price: repair.price,
            tags: repair.tags || [],
            handle: repair.handle,
          };
        }
      }
    }
    return null;
  }

  return {
    resolveCollectionPrefill: resolveCollectionPrefill,
    resolveProductPrefill: resolveProductPrefill,
  };
});
