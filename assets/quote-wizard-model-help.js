/**
 * Model-picker helpers extracted from quote-wizard.liquid to stay under
 * Shopify's 256 KB section limit.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ICorrectQuoteModelHelp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

function renderIphoneVG(panel, ctx) {
    ctx = ctx || {};
    var VG_DB = ctx.VG_DB;
    var MODELS = ctx.MODELS;
    var S = ctx.S;
    var pickModel = ctx.pickModel;
    var esc = ctx.esc;
    var vgS = {};
    var VK = { 1: 'cams', 2: 'edges', 3: 'screen', 4: 'size' };
    var CDN = 'https://cdn.shopify.com/s/files/1/0728/7111/7053/files/';

    function vgOpt(val, img, lbl) { return '<div class="qw-vg-opt" data-v="' + val + '"><img src="' + img + '" class="qw-vg-img"><div class="qw-vg-lbl">' + lbl + '</div></div>'; }
    var VG_PHONE_HEIGHTS = { max: 64, pro: 54, std: 46, mini: 38 };
    function vgSize(val, lbl, det) {
      var h = VG_PHONE_HEIGHTS[val] || 50;
      var w = Math.round(h * 0.48);
      var svg = '<svg viewBox="0 0 24 44" fill="none" stroke="var(--qw-text-2)" stroke-width="1.5" width="' + w + '" height="' + h + '" style="display:block;"><rect x="2" y="1" width="20" height="42" rx="4.5"/><line x1="9" y1="3.5" x2="15" y2="3.5" stroke-linecap="round" opacity="0.4"/><line x1="8" y1="39" x2="16" y2="39" stroke-linecap="round" opacity="0.3"/></svg>';
      return '<div class="qw-vg-opt" data-v="' + val + '"><div style="height:70px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;">' + svg + '</div><div class="qw-vg-lbl">' + lbl + '<br><span style="font-weight:400;color:var(--qw-text-3);font-size:11px;">' + det + '</span></div></div>';
    }

    var html = '<div class="qw-help-card"><div id="qwVgWiz">';
    html += '<div class="qw-vg-step on" data-vs="1"><div class="qw-vg-title">Rear cameras</div><div class="qw-vg-sub">What does the back look like?</div><div class="qw-vg-grid">';
    html += vgOpt('tri_plat',CDN+'17pm.png?v=1766083751','3 Cameras<br>(Plateau)');
    html += vgOpt('tri_std',CDN+'16pm.png?v=1766083961','3 Cameras<br>(Standard)');
    html += vgOpt('diag',CDN+'15.png?v=1766083751','2 Cameras<br>(Diagonal)');
    html += vgOpt('vert',CDN+'16.png?v=1766083751','2 Cameras<br>(Vertical)');
    html += vgOpt('single_plat',CDN+'air.png?v=1766083751','1 Camera<br>(Plateau)');
    html += vgOpt('single_std',CDN+'16e.png?v=1766083751','1 Camera<br>(Standard)');
    html += '</div></div>';
    html += '<div class="qw-vg-step" data-vs="2"><button class="qw-vg-back" data-from="2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back</button><div class="qw-vg-title">Frame shape</div><div class="qw-vg-sub">Check the metal edge</div><div class="qw-vg-grid">';
    html += vgOpt('flat',CDN+'squared.png?v=1766085750','Flat (Square)');
    html += vgOpt('curved',CDN+'round.png?v=1766085749','Curved (Round)');
    html += '</div></div>';
    html += '<div class="qw-vg-step" data-vs="3"><button class="qw-vg-back" data-from="3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back</button><div class="qw-vg-title">Screen type</div><div class="qw-vg-sub">Look at the top of the display</div><div class="qw-vg-grid">';
    html += vgOpt('island',CDN+'dynamic_island.png?v=1766085749','Dynamic Island');
    html += vgOpt('notch',CDN+'notch.png?v=1766085750','Notch');
    html += '</div></div>';
    html += '<div class="qw-vg-step" data-vs="4"><button class="qw-vg-back" data-from="4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back</button><div class="qw-vg-title">Size</div><div class="qw-vg-sub">How big is it?</div><div class="qw-vg-grid">';
    html += vgSize('max','Pro Max / Plus','6.5" - 6.9"');
    html += vgSize('pro','Pro','5.8" - 6.3"');
    html += vgSize('std','Standard','4.7" - 6.1"');
    html += vgSize('mini','Mini','5.4"');
    html += '</div></div>';
    html += '<div class="qw-vg-step" data-vs="result"><div class="qw-vg-result" id="qwVgResult"></div></div>';
    html += '</div><button class="qw-help-close">Close</button></div>';
    panel.innerHTML = html;
    panel.querySelector('.qw-help-close').onclick = function() { panel.classList.remove('open'); };

    function vgGoTo(n) {
      panel.querySelectorAll('.qw-vg-step').forEach(function(s) { s.classList.remove('on'); });
      var target = panel.querySelector('.qw-vg-step[data-vs="' + n + '"]');
      if (target) target.classList.add('on');
      vgApplyFilters();
    }

    /* [3.1] Filter logic: hide options that produce zero matches */
    function vgApplyFilters() {
      for (var step = 1; step <= 4; step++) {
        var key = VK[step];
        var tempState = {};
        for (var s = 1; s < step; s++) { if (vgS[VK[s]]) tempState[VK[s]] = vgS[VK[s]]; }
        var allowed = {};
        VG_DB.forEach(function(m) {
          if (tempState.cams && m.cams !== tempState.cams) return;
          if (tempState.edges && m.edges !== tempState.edges) return;
          if (tempState.screen && m.screen !== tempState.screen) return;
          if (tempState.size && m.size !== tempState.size) return;
          allowed[m[key]] = true;
        });
        var stepEl = panel.querySelector('.qw-vg-step[data-vs="' + step + '"]');
        if (stepEl) {
          var visibleCount = 0;
          stepEl.querySelectorAll('.qw-vg-opt').forEach(function(opt) {
            if (allowed[opt.dataset.v]) { opt.style.display = ''; visibleCount++; }
            else { opt.style.display = 'none'; }
          });
          /* Auto-skip: if only one option visible and we're on this step, auto-select it */
        }
      }
    }

    panel.querySelectorAll('.qw-vg-back').forEach(function(btn) {
      btn.onclick = function() {
        var from = parseInt(btn.dataset.from);
        delete vgS[VK[from]];
        vgGoTo(from - 1);
      };
    });

    panel.querySelectorAll('.qw-vg-opt').forEach(function(o) {
      o.onclick = function() {
        if (o.style.display === 'none') return;
        var vs = parseInt(o.closest('.qw-vg-step').dataset.vs);
        vgS[VK[vs]] = o.dataset.v;
        if (vs === 1 && o.dataset.v === 'single_plat') { vgShowResult(); return; }
        if (vs === 1 && o.dataset.v === 'tri_plat') { vgS.edges = 'curved'; vgS.screen = 'island'; vgGoTo(4); return; }
        if (vs === 2 && vgS.cams === 'single_std' && o.dataset.v === 'flat') { vgS.screen = 'notch'; vgGoTo(4); return; }
        if (vs === 2 && vgS.cams === 'single_std' && o.dataset.v === 'curved') { vgS.screen = 'home'; vgGoTo(4); return; }
        if (vs >= 4) { vgShowResult(); return; }
        vgGoTo(vs + 1);
      };
    });

    function vgShowResult() {
      var matches = VG_DB.filter(function(m) {
        if (vgS.cams && m.cams !== vgS.cams) return false;
        if (vgS.edges && m.edges !== vgS.edges) return false;
        if (vgS.screen && m.screen !== vgS.screen) return false;
        if (vgS.size && m.size !== vgS.size) return false;
        return true;
      });
      var rc = document.getElementById('qwVgResult');
      if (!rc) return;
      if (matches.length === 1) {
        var m = matches[0];
        rc.innerHTML = '<img src="' + m.img + '" style="max-width:220px;max-height:170px;object-fit:contain;margin-bottom:14px;"><div class="qw-vg-result-name">' + m.n + '</div><button class="qw-vg-btn qw-vg-btn-p" id="qwVgSel">Select this model</button> <button class="qw-vg-btn qw-vg-btn-s" id="qwVgReset2">Try again</button>';
        document.getElementById('qwVgSel').onclick = function() { vgSelect(m.n); };
        document.getElementById('qwVgReset2').onclick = vgReset;
      } else if (matches.length > 1) {
        var h = '<div class="qw-vg-title" style="margin-bottom:14px;">Which one?</div><div class="qw-vg-grid">';
        matches.forEach(function(m) {
          h += '<div class="qw-vg-opt" data-vgname="' + esc(m.n) + '"><img src="' + m.img + '" style="max-width:140px;max-height:110px;object-fit:contain;"><div class="qw-vg-lbl">' + m.n + '</div></div>';
        });
        h += '</div><button class="qw-vg-btn qw-vg-btn-s" style="margin-top:14px;" id="qwVgReset3">Try again</button>';
        rc.innerHTML = h;
        rc.querySelectorAll('[data-vgname]').forEach(function(el) { el.onclick = function() { vgSelect(el.dataset.vgname); }; });
        document.getElementById('qwVgReset3').onclick = vgReset;
      } else {
        /* Should not happen with filtering, but just in case */
        rc.innerHTML = '<div class="qw-vg-title">Could not match your device</div><button class="qw-vg-btn qw-vg-btn-s" id="qwVgReset">Try again</button>';
        document.getElementById('qwVgReset').onclick = vgReset;
      }
      vgGoTo('result');
    }

    function vgReset() { for (var k in vgS) delete vgS[k]; vgGoTo(1); }

    /* [3.3] Robust name matching: exact first, then contains (longest wins) */
    function vgSelect(name) {
      var groups = MODELS[S.device] || [];
      /* Pass 1: exact */
      for (var g = 0; g < groups.length; g++) {
        for (var m = 0; m < groups[g].models.length; m++) {
          if (groups[g].models[m].name === name) { panel.classList.remove('open'); pickModel(groups[g].models[m].name, groups[g].models[m].collectionHandle, null); return; }
        }
      }
      /* Pass 2: contains (longest match) */
      var best = null, bestLen = 0;
      for (var g2 = 0; g2 < groups.length; g2++) {
        for (var m2 = 0; m2 < groups[g2].models.length; m2++) {
          var mn = groups[g2].models[m2].name;
          if (mn.indexOf(name) !== -1 || name.indexOf(mn) !== -1) {
            var matchLen = Math.min(mn.length, name.length);
            if (matchLen > bestLen) { best = groups[g2].models[m2]; bestLen = matchLen; }
          }
        }
      }
      if (best) { panel.classList.remove('open'); pickModel(best.name, best.collectionHandle, null); return; }
      /* [3.2] No fallback with broken state - show message */
      var rc2 = document.getElementById('qwVgResult');
      if (rc2) rc2.innerHTML = '<div class="qw-vg-title">Could not match to a model in our system</div><p style="font-size:13px;color:var(--qw-text-2);margin:8px 0;">Please pick your model from the list above instead.</p><button class="qw-vg-btn qw-vg-btn-s" id="qwVgResetFail">Close</button>';
      var rb = document.getElementById('qwVgResetFail');
      if (rb) rb.onclick = function() { panel.classList.remove('open'); };
    }

    vgApplyFilters();
  }

function renderMacbookHelper(panel, ctx) {
    ctx = ctx || {};
    var MODELS = ctx.MODELS;
    var MB_NUMS = ctx.MB_NUMS;
    var pickModel = ctx.pickModel;
    panel.innerHTML =
      '<div class="qw-help-card"><div class="qw-help-body qw-help-split">' +
      '<div class="qw-help-left"><img src="https://cdn.shopify.com/s/files/1/0728/7111/7053/files/MacBook_Model_Number_7104995a-bc9e-4b6d-9a9b-5578f42b4a7b.png?v=1773930835" alt="Where to find your MacBook model number" class="qw-help-img"></div>' +
      '<div class="qw-help-right">' +
      '<p class="qw-help-inst">Flip your MacBook over. The model number (e.g. <code>A1989</code>) is printed on the bottom case near the hinge.</p>' +
      '<div class="qw-help-row"><input class="qw-help-input" type="text" id="qwMbSearch" placeholder="Type model number, e.g. A1989"></div>' +
      '<div class="qw-help-results" id="qwMbRes"></div>' +
      '</div></div><button class="qw-help-close">Close</button></div>';
    panel.querySelector('.qw-help-close').onclick = function() { panel.classList.remove('open'); };

    function findConfiguredModelByName(name) {
      var exact = null;
      var best = null;
      var bestLen = 0;
      var groups = MODELS['macbook'] || [];
      for (var g = 0; g < groups.length; g++) {
        for (var m = 0; m < groups[g].models.length; m++) {
          var model = groups[g].models[m];
          if (model.name === name) return model;
          if (model.name.indexOf(name) !== -1 || name.indexOf(model.name) !== -1) {
            var matchLen = Math.min(model.name.length, name.length);
            if (matchLen > bestLen) {
              best = model;
              bestLen = matchLen;
            }
          }
        }
      }
      return exact || best;
    }

    var groups = MODELS['macbook'] || [];

    function mbFilter() {
      var q = (document.getElementById('qwMbSearch').value || '').trim().toUpperCase();
      var r = document.getElementById('qwMbRes');
      if (!r) return;
      r.innerHTML = '';
      if (!q) return;
      var f = MB_NUMS.filter(function(n) { return n.n.toUpperCase().indexOf(q) !== -1 || n.m.toUpperCase().indexOf(q) !== -1; });
      if (!f.length) { r.innerHTML = '<div style="padding:10px;font-size:13px;color:var(--qw-text-3);">No match. Check the number and try again.</div>'; return; }
      /* Deduplicate by model name to avoid showing A2338 twice with same target */
      var seen = {};
      f.forEach(function(n) {
        if (seen[n.m]) return;
        seen[n.m] = true;
        var d = document.createElement('div'); d.className = 'qw-help-hit';
        d.innerHTML = '<span class="qw-hn">' + n.n + '</span><span class="qw-hm">' + n.m + '</span><span class="qw-hs">Select</span>';
        d.onclick = function() {
          var model = findConfiguredModelByName(n.m);
          if (model) {
            panel.classList.remove('open');
            pickModel(model.name, model.collectionHandle, null);
          } else {
            r.innerHTML = '<div style="padding:10px;font-size:13px;color:var(--qw-text-3);">This model isn\'t configured in our system yet. Please pick from the list above.</div>';
          }
        };
        r.appendChild(d);
      });
    }
    document.getElementById('qwMbSearch').oninput = mbFilter;
  }

  return { renderIphoneVG: renderIphoneVG, renderMacbookHelper: renderMacbookHelper };
});
