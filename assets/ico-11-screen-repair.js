/* ==========================================================================
   ICO-11 MacBook Screen Repair - Scoped Interactive Behaviours
   Handles: mobile docked CTA bar, Trustindex fallback, mobile model groups,
   underside model-number finder, and FAQ accordions.
   ========================================================================== */
(function () {
  "use strict";

  var MODELS = [
    { code: "A3240", name: 'MacBook Air 13" M4 (2025)', price: "\u00a3479" },
    { code: "A3113", name: 'MacBook Air 13" M3 (2024)', price: "\u00a3429" },
    { code: "A2681", name: 'MacBook Air 13" M2 (2022)', price: "\u00a3399" },
    { code: "A2337", name: 'MacBook Air 13" M1 (2020)', price: "\u00a3339" },
    { code: "A2179", name: 'MacBook Air 13" (2020)', price: "\u00a3299" },
    { code: "A1932", name: 'MacBook Air 13" (2018 to 2019)', price: "\u00a3299" },
    { code: "A1466", name: 'MacBook Air 13" (2012 to 2017)', price: "\u00a3299" },
    { code: "A3241", name: 'MacBook Air 15" M4 (2025)', price: "\u00a3519" },
    { code: "A3114", name: 'MacBook Air 15" M3 (2024)', price: "\u00a3469" },
    { code: "A2941", name: 'MacBook Air 15" M2 (2023)', price: "\u00a3449" },
    { code: "A2338", name: 'MacBook Pro 13" M1 / M2 (2020 to 2022)', price: "from \u00a3399" },
    { code: "A2289", name: 'MacBook Pro 13" (2020)', price: "\u00a3329" },
    { code: "A2251", name: 'MacBook Pro 13" (2020)', price: "\u00a3329" },
    { code: "A2159", name: 'MacBook Pro 13" (2019)', price: "\u00a3329" },
    { code: "A1989", name: 'MacBook Pro 13" (2018 to 2019)', price: "\u00a3299" },
    { code: "A1706", name: 'MacBook Pro 13" (2016 to 2018)', price: "\u00a3399" },
    { code: "A1708", name: 'MacBook Pro 13" (2016 to 2017)', price: "\u00a3399" },
    { code: "A3112", name: 'MacBook Pro 14" M4 (2024)', price: "\u00a3649" },
    { code: "A3185", name: 'MacBook Pro 14" M4 Max (2024)', price: "\u00a3649" },
    { code: "A3401", name: 'MacBook Pro 14" M4 Pro (2024)', price: "\u00a3649" },
    { code: "A2992", name: 'MacBook Pro 14" M3 Pro/Max (2023)', price: "\u00a3599" },
    { code: "A2918", name: 'MacBook Pro 14" M3 (2023)', price: "\u00a3599" },
    { code: "A2779", name: 'MacBook Pro 14" M2 Pro/Max (2023)', price: "\u00a3599" },
    { code: "A2442", name: 'MacBook Pro 14" M1 Pro/Max (2021)', price: "\u00a3549" },
    { code: "A1990", name: 'MacBook Pro 15" (2018 to 2019)', price: "\u00a3649" },
    { code: "A1707", name: 'MacBook Pro 15" Retina (2016 to 2017)', price: "\u00a3649" },
    { code: "A3403", name: 'MacBook Pro 16" M4 Pro/Max (2024)', price: "\u00a3799" },
    { code: "A3186", name: 'MacBook Pro 16" M4 Pro/Max (2024)', price: "\u00a3799" },
    { code: "A2991", name: 'MacBook Pro 16" M3 Pro/Max (2023)', price: "\u00a3699" },
    { code: "A2780", name: 'MacBook Pro 16" M2 Pro/Max (2023)', price: "\u00a3639" },
    { code: "A2485", name: 'MacBook Pro 16" M1 Pro/Max (2021)', price: "\u00a3599" },
    { code: "A2141", name: 'MacBook Pro 16" (2019)', price: "\u00a3649" }
  ];

  function initMobileStickyBar() {
    var mobileBar = document.getElementById("mobile-sticky-bar");
    var mobileCta = document.getElementById("mobile-sticky-cta");
    if (!mobileBar || !mobileCta || mobileBar.dataset.ico11Bound === "true") return;
    mobileBar.dataset.ico11Bound = "true";

    var heroActions = document.getElementById("hero-actions");
    var quoteIntro = document.getElementById("quote-section");
    var quoteWizard = document.getElementById("get-free-quote") || document.querySelector(".quote-wizard-section");
    var closingCta = document.getElementById("closing-cta");
    var siteFooter = document.querySelector("#shopify-section-footer, footer.footer, footer");

    var heroInView = !!heroActions;
    var quoteIntroInView = false;
    var quoteWizardInView = false;
    var closingInView = false;
    var footerInView = false;

    function syncMobileBar() {
      var isMobile = window.innerWidth <= 768;
      var show = isMobile && !heroInView && !quoteIntroInView && !quoteWizardInView && !closingInView && !footerInView;
      mobileBar.classList.toggle("is-visible", show);
      mobileBar.setAttribute("aria-hidden", String(!show));
      if (show) {
        mobileCta.removeAttribute("tabindex");
      } else {
        mobileCta.setAttribute("tabindex", "-1");
      }
    }

    if ("IntersectionObserver" in window) {
      if (heroActions) {
        new IntersectionObserver(function (entries) {
          heroInView = entries[entries.length - 1].isIntersecting;
          syncMobileBar();
        }, { rootMargin: "-56px 0px 0px 0px" }).observe(heroActions);
      }
      if (quoteIntro) {
        new IntersectionObserver(function (entries) {
          quoteIntroInView = entries[entries.length - 1].isIntersecting;
          syncMobileBar();
        }, { rootMargin: "-56px 0px 0px 0px", threshold: 0.01 }).observe(quoteIntro);
      }
      if (quoteWizard) {
        new IntersectionObserver(function (entries) {
          quoteWizardInView = entries[entries.length - 1].isIntersecting;
          syncMobileBar();
        }, { rootMargin: "-56px 0px 0px 0px", threshold: 0.01 }).observe(quoteWizard);
      }
      if (closingCta) {
        new IntersectionObserver(function (entries) {
          closingInView = entries[entries.length - 1].isIntersecting;
          syncMobileBar();
        }, { rootMargin: "0px 0px 40px 0px", threshold: 0.01 }).observe(closingCta);
      }
      if (siteFooter) {
        new IntersectionObserver(function (entries) {
          footerInView = entries[entries.length - 1].isIntersecting;
          syncMobileBar();
        }, { rootMargin: "0px 0px 40px 0px", threshold: 0.01 }).observe(siteFooter);
      }
    } else {
      window.addEventListener("scroll", function () {
        heroInView = window.scrollY <= 220;
        syncMobileBar();
      }, { passive: true });
    }

    window.addEventListener("resize", syncMobileBar, { passive: true });
    syncMobileBar();
  }

  function initTrustindexFallback() {
    var tiSlot = document.getElementById("trustindex-reviews-slot");
    var tiFallback = document.getElementById("trustindex-fallback");
    if (!tiSlot || !tiFallback || tiSlot.dataset.ico11Bound === "true") return;
    tiSlot.dataset.ico11Bound = "true";

    var tiTimedOut = false;
    function syncReviewsSlot() {
      var mounted = !!tiSlot.querySelector(".ti-widget");
      tiSlot.classList.toggle("is-empty", tiTimedOut && !mounted);
      tiFallback.hidden = mounted || !tiTimedOut;
    }

    window.setTimeout(function () {
      tiTimedOut = true;
      syncReviewsSlot();
    }, 4000);

    if ("MutationObserver" in window) {
      new MutationObserver(syncReviewsSlot).observe(tiSlot, { childList: true, subtree: true });
    }
  }

  function syncModelGroupAria(group, headBtn) {
    if (!headBtn) return;
    if (window.innerWidth > 768) {
      headBtn.setAttribute("aria-expanded", "true");
      headBtn.setAttribute("aria-disabled", "true");
    } else {
      headBtn.setAttribute("aria-expanded", String(group.classList.contains("is-open")));
      headBtn.removeAttribute("aria-disabled");
    }
  }

  function initModelGroups(root) {
    (root || document).querySelectorAll("[data-ico11-model-group]").forEach(function (group) {
      if (group.dataset.ico11Bound === "true") return;
      group.dataset.ico11Bound = "true";

      var headBtn = group.querySelector(".model-group-head-btn");
      var showAllBtn = group.querySelector("[data-ico11-show-all]");

      if (headBtn) {
        syncModelGroupAria(group, headBtn);
        headBtn.addEventListener("click", function () {
          if (window.innerWidth > 768) return;
          var open = !group.classList.contains("is-open");
          group.classList.toggle("is-open", open);
          headBtn.setAttribute("aria-expanded", String(open));
        });
        window.addEventListener("resize", function () {
          syncModelGroupAria(group, headBtn);
        }, { passive: true });
      }

      if (showAllBtn) {
        showAllBtn.addEventListener("click", function () {
          group.classList.add("is-all-shown");
        });
      }
    });
  }

  function matchModelCode(rawInput) {
    var raw = (rawInput || "").trim().toUpperCase();
    var codeMatch = raw.match(/(?:^|[^A-Z0-9])(A\d{4})(?=$|[^A-Z0-9])/);
    if (!codeMatch) return null;
    var extractedCode = codeMatch[1];
    return MODELS.find(function (m) {
      return m.code === extractedCode;
    }) || null;
  }

  function initModelFinder(root) {
    var form = (root || document).querySelector("#identify-form");
    if (!form || form.dataset.ico11Bound === "true") return;
    form.dataset.ico11Bound = "true";

    var input = document.getElementById("identify-input");
    var error = document.getElementById("identify-error");
    var out = document.getElementById("identify-result");
    if (!input || !error || !out) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = (input.value || "").trim().toUpperCase();
      if (!raw) {
        input.setAttribute("aria-invalid", "true");
        error.hidden = false;
        out.classList.remove("is-visible");
        out.textContent = "";
        input.focus();
        return;
      }

      input.removeAttribute("aria-invalid");
      error.hidden = true;

      var match = matchModelCode(raw);

      out.textContent = "";
      out.classList.add("is-visible");

      if (match) {
        var span = document.createElement("span");
        var strong = document.createElement("strong");
        strong.textContent = match.name + " (" + match.code + ")";
        span.appendChild(strong);
        span.appendChild(document.createTextNode(", screen repair " + match.price));

        var link = document.createElement("a");
        link.className = "btn-ghost";
        link.href = "#quote-section";
        link.textContent = "Open in quote tool";

        out.appendChild(span);
        out.appendChild(link);
      } else {
        var notFoundSpan = document.createElement("span");
        notFoundSpan.appendChild(document.createTextNode("We could not match "));
        var codeStrong = document.createElement("strong");
        codeStrong.textContent = raw.replace(/[<>&"]/g, "");
        notFoundSpan.appendChild(codeStrong);
        notFoundSpan.appendChild(document.createTextNode(". Check the code on the underside, or choose your MacBook in the "));
        var quoteLink = document.createElement("a");
        quoteLink.className = "text-link";
        quoteLink.href = "#quote-section";
        quoteLink.textContent = "quote tool below";
        notFoundSpan.appendChild(quoteLink);
        notFoundSpan.appendChild(document.createTextNode("."));
        out.appendChild(notFoundSpan);
      }
    });
  }

  function initFaqs(root) {
    (root || document).querySelectorAll("[data-ico11-faq-btn]").forEach(function (btn) {
      if (btn.dataset.ico11Bound === "true") return;
      btn.dataset.ico11Bound = "true";

      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        if (!item) return;
        var open = !item.classList.contains("is-open");
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initAll(root) {
    initMobileStickyBar();
    initTrustindexFallback();
    initModelGroups(root);
    initModelFinder(root);
    initFaqs(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initAll(document);
    });
  } else {
    initAll(document);
  }

  document.addEventListener("shopify:section:load", function (event) {
    initAll(event.target || document);
  });
})();
