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

  /* Wizard menus use 13"; Monday Touch Bar titles use 13"; other SKUs use 13-inch.
     iPad/MacBook titles often omit "inch" entirely (iPad Air 11 vs 11"). */
  function canonicalizeModelText(s, device) {
    var out = String(s || '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\b(20\d{2})\/(\d{2})\b/g, function (_, y, yy) {
        return y + '-' + y.slice(0, 2) + yy;
      })
      .replace(/(\d+(?:\.\d+)?)\s*-?\s*(?:["\u2033](?=[\s'"]|$)|inch\b)/gi, '$1-inch');
    if (device === 'ipad' || device === 'macbook') {
      out = out.replace(/\b(11|12\.9|13|14|15|16)(?!-inch)\b(?=\s)/g, '$1-inch');
    }
    return out;
  }

  function slugify(s, device) {
    return canonicalizeModelText(s, device)
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function normalizeName(s, device) {
    return canonicalizeModelText(s, device)
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  var SIZE_ALIASES = {
    '41mm': ['42mm'],
    '42mm': ['41mm'],
    '45mm': ['46mm'],
    '46mm': ['45mm'],
  };

  function yearsIn(name) {
    return String(name || '').match(/\b(20\d{2})\b/g) || [];
  }

  function familyTokens(name) {
    var n = normalizeName(name);
    var fam = [];
    if (/\bpro\b/.test(n)) fam.push('pro');
    if (/\bair\b/.test(n)) fam.push('air');
    if (/\bmini\b/.test(n)) fam.push('mini');
    if (/\bse\b/.test(n)) fam.push('se');
    var series = n.match(/\bseries\s+(\d+)\b/);
    if (series) fam.push('series-' + series[1]);
    return fam;
  }

  function genTokens(name) {
    var n = normalizeName(name);
    var out = [];
    var seen = {};
    function add(g) {
      var k = String(parseInt(g, 10));
      if (!k || k === 'NaN' || seen[k]) return;
      seen[k] = 1;
      out.push(k);
    }
    var ord = n.match(/\b(\d+)(?:st|nd|rd|th)\b/g) || [];
    for (var i = 0; i < ord.length; i++) add(ord[i]);
    var labeled = n.match(/\b(?:air|mini|se|series)\s+(\d+)\b/g) || [];
    for (var j = 0; j < labeled.length; j++) {
      var num = labeled[j].match(/(\d+)/);
      if (num) add(num[1]);
    }
    return out;
  }

  function sizeTokens(name) {
    var n = normalizeName(name);
    var sizes = [];
    var mm = n.match(/\b(\d{2})\s*mm\b/g) || [];
    for (var i = 0; i < mm.length; i++) sizes.push(mm[i].replace(/\s+/g, ''));
    var dec = String(name || '').toLowerCase().match(/\b\d+\.\d+\b/g) || [];
    for (var d = 0; d < dec.length; d++) sizes.push(dec[d]);
    if (!mm.length) {
      var inch = n.match(/\b(7|8|9|10|11|12|13)\b/g) || [];
      for (var k = 0; k < inch.length; k++) {
        if (sizes.indexOf(inch[k]) === -1) sizes.push(inch[k]);
      }
    }
    return sizes;
  }

  function sizesCompatible(want, have) {
    if (!want.length) return true;
    if (!have.length) return false;
    for (var i = 0; i < want.length; i++) {
      var s = want[i];
      var ok = have.indexOf(s) !== -1;
      var al = SIZE_ALIASES[s] || [];
      for (var a = 0; a < al.length && !ok; a++) {
        if (have.indexOf(al[a]) !== -1) ok = true;
      }
      if (!ok) return false;
    }
    return true;
  }

  /**
   * Year + size + family (+ gen when present). Wizard labels say
   * "2nd Gen (2020)"; Shopify titles say "M1 (2020)" for the same iPad.
   * Size/family alone is too weak without a year or generation.
   */
  function structuralScore(wantName, hayName) {
    var wy = yearsIn(wantName);
    var hy = yearsIn(hayName);
    var ws = sizeTokens(wantName);
    var hs = sizeTokens(hayName);
    var wf = familyTokens(wantName);
    var hf = familyTokens(hayName);
    var wg = genTokens(wantName);
    var hg = genTokens(hayName);

    var yearsAlign = false;
    if (wy.length && hy.length) {
      for (var i = 0; i < wy.length; i++) {
        if (hy.indexOf(wy[i]) !== -1) yearsAlign = true;
      }
      if (!yearsAlign) return 0;
    }

    var gensAlign = false;
    if (wg.length && hg.length) {
      for (var g = 0; g < wg.length; g++) {
        if (hg.indexOf(wg[g]) !== -1) gensAlign = true;
      }
    }

    if (ws.length && hs.length && !sizesCompatible(ws, hs)) return 0;

    if (wf.length && hf.length) {
      var famHit = false;
      for (var f = 0; f < wf.length; f++) {
        if (hf.indexOf(wf[f]) !== -1) famHit = true;
      }
      if (!famHit) return 0;
    }

    if (!yearsAlign && !gensAlign) return 0;

    var score = 0;
    if (yearsAlign) score += 25;
    if (ws.length && hs.length && sizesCompatible(ws, hs)) score += 25;
    if (wf.length && hf.length) {
      for (var z = 0; z < wf.length; z++) {
        if (hf.indexOf(wf[z]) !== -1) score += 20;
      }
    }
    if (gensAlign) score += 15;
    return score;
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
    var wantSlug = slugify(modelName, deviceKey);
    var wantNorm = normalizeName(modelName, deviceKey);
    var wantA = wantNorm.match(/a\d{4}/g) || [];

    var best = null;
    var bestScore = 0;
    var bestRepairs = 0;
    var keys = Object.keys(mapAsset.models);
    for (var i = 0; i < keys.length; i++) {
      var m = mapAsset.models[keys[i]];
      if (m.device !== deviceKey) continue;
      var n = normalizeName(m.name, deviceKey);
      var score = 0;
      var aliasHit = false;
      var aliases = Array.isArray(m.aliases) ? m.aliases : [];
      for (var al = 0; al < aliases.length; al++) {
        if (slugify(aliases[al], deviceKey) === wantSlug || normalizeName(aliases[al], deviceKey) === wantNorm) {
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
        score += structuralScore(modelName, m.name);
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

  function siblingModels(mapAsset, model) {
    if (!mapAsset || !mapAsset.models || !model) return [];
    var out = [];
    var baseName = String(model.name || '').replace(/\s+display$/i, '');
    var sizeMatch = baseName.match(/\b(41|42|45|46)\s*mm\b/i);
    var alias = sizeMatch
      ? { 41: '42', 42: '41', 45: '46', 46: '45' }[sizeMatch[1]]
      : null;
    var aliased = alias
      ? baseName.replace(/\b(41|42|45|46)\s*mm\b/i, alias + 'MM')
      : null;
    var keys = Object.keys(mapAsset.models);
    for (var i = 0; i < keys.length; i++) {
      var m = mapAsset.models[keys[i]];
      if (!m || m.device !== model.device || m.slug === model.slug) continue;
      var otherBase = String(m.name || '').replace(/\s+display$/i, '');
      if (otherBase === baseName || (aliased && otherBase === aliased)) {
        out.push(m);
      }
    }
    return out;
  }

  function mergedRepairs(mapAsset, model) {
    var out = {};
    if (!model || !model.repairs) return out;
    var types = Object.keys(model.repairs);
    var i;
    for (i = 0; i < types.length; i++) out[types[i]] = model.repairs[types[i]];
    var sibs = siblingModels(mapAsset, model);
    for (i = 0; i < sibs.length; i++) {
      var r = sibs[i].repairs || {};
      var rt = Object.keys(r);
      for (var j = 0; j < rt.length; j++) {
        if (!out[rt[j]]) out[rt[j]] = r[rt[j]];
      }
    }
    return out;
  }

  function getRepair(mapAsset, device, modelName, repairType) {
    var model = findModel(mapAsset, device, modelName);
    if (!model) return null;
    return mergedRepairs(mapAsset, model)[repairType] || null;
  }

  /** Catalogue name → matching wizard collection label (or the catalogue name). */
  function findWizardLabel(mapAsset, device, catalogueName, wizardNames) {
    var cat = findModel(mapAsset, device, catalogueName);
    if (!cat) return null;
    var names = wizardNames || [];
    for (var i = 0; i < names.length; i++) {
      var resolved = findModel(mapAsset, device, names[i]);
      if (resolved && resolved.slug === cat.slug) return names[i];
    }
    return cat.name;
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
    if (!model) return out;
    var repairs = mergedRepairs(mapAsset, model);
    var types = Object.keys(repairs);
    for (var i = 0; i < types.length; i++) {
      out[types[i]] = asWizardProduct(repairs[types[i]]);
    }
    return out;
  }

  return {
    slugify: slugify,
    findModel: findModel,
    getRepair: getRepair,
    asWizardProduct: asWizardProduct,
    repairsMapForModel: repairsMapForModel,
    findWizardLabel: findWizardLabel,
  };
});
