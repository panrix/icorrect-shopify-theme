/**
 * Stamp quoted Shopify product onto the quote card via DOM dataset.
 * Do not interpolate title into HTML attributes — `"` in a product title
 * would break out of data-repair="...".
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectQuotedRepair = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function stampQuotedRepair(el, opts) {
    if (!el) return el;
    opts = opts || {};
    el.dataset.repair = opts.title ? String(opts.title) : '';
    el.dataset.repairHandle = opts.handle ? String(opts.handle) : '';
    el.dataset.repairType = opts.repairType ? String(opts.repairType) : '';
    el.dataset.route = opts.route ? String(opts.route) : '';
    return el;
  }

  function readQuotedRepair(el) {
    if (!el || !el.dataset) {
      return { repair: null, repair_handle: null, repair_type: null, route: null };
    }
    return {
      repair: el.dataset.repair || null,
      repair_handle: el.dataset.repairHandle || null,
      repair_type: el.dataset.repairType || null,
      route: el.dataset.route || null
    };
  }

  return { stampQuotedRepair: stampQuotedRepair, readQuotedRepair: readQuotedRepair };
});
