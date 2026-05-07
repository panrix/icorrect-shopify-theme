(function () {
  function moneyFromCents(cents) {
    var value = Number(cents || 0) / 100;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: value % 1 ? 2 : 0
    }).format(value);
  }

  function setStep(root, step) {
    root.querySelectorAll("[data-icr-step-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-icr-step-panel") !== String(step);
    });

    root.querySelectorAll("[data-icr-progress]").forEach(function (dot) {
      var dotStep = Number(dot.getAttribute("data-icr-progress"));
      dot.classList.toggle("is-active", dotStep === step);
      dot.classList.toggle("is-complete", dotStep < step);
      dot.classList.toggle("current", dotStep === step);
      dot.classList.toggle("done", dotStep < step);
      dot.disabled = dotStep > step;
    });

    var count = root.querySelector(".wiz-step-count");
    if (count) count.textContent = "Step " + step + " of 3";
  }

  function initFilters(root) {
    var filters = { family: "all", size: "all" };
    var chips = root.querySelectorAll("[data-icr-filter]");
    var clearButtons = root.querySelectorAll("[data-icr-filter-clear]");
    var mobileFamilyButtons = root.querySelectorAll("[data-icr-mobile-family]");
    var mobileFamilyBack = root.querySelector("[data-icr-mobile-family-back]");
    var empty = root.querySelector("[data-icr-empty]");

    function update() {
      var visibleCount = 0;
      root.querySelectorAll("[data-icr-model-option]").forEach(function (option) {
        var familyMatches = filters.family === "all" || option.getAttribute("data-family") === filters.family;
        var sizeMatches = filters.size === "all" || option.getAttribute("data-size") === filters.size;
        var visible = familyMatches && sizeMatches;
        option.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (empty) empty.hidden = visibleCount !== 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var group = chip.getAttribute("data-icr-filter");
        filters[group] = chip.getAttribute("data-filter-value") || "all";
        root.querySelectorAll('[data-icr-filter="' + group + '"]').forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        update();
      });
    });

    clearButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        filters.family = "all";
        filters.size = "all";
        root.classList.remove("has-family-choice");
        chips.forEach(function (chip) {
          chip.classList.toggle("active", chip.getAttribute("data-filter-value") === "all");
        });
        update();
      });
    });

    mobileFamilyButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        filters.family = button.getAttribute("data-icr-mobile-family") || "all";
        filters.size = "all";
        root.classList.add("has-family-choice");
        chips.forEach(function (chip) {
          var group = chip.getAttribute("data-icr-filter");
          var value = chip.getAttribute("data-filter-value") || "all";
          chip.classList.toggle("active", group === "family" ? value === filters.family : value === "all");
        });
        update();
      });
    });

    if (mobileFamilyBack) {
      mobileFamilyBack.addEventListener("click", function () {
        filters.family = "all";
        filters.size = "all";
        root.classList.remove("has-family-choice");
        chips.forEach(function (chip) {
          chip.classList.toggle("active", chip.getAttribute("data-filter-value") === "all");
        });
        update();
      });
    }

    update();
  }

  function initWizard(root) {
    var state = {
      step: 1,
      productTitle: "",
      productUrl: "",
      variantId: "",
      priceCents: 0,
      issue: "",
      modelRequiresDiagnosis: false,
      issueRequiresDiagnosis: false
    };

    var summaryModel = root.querySelector("[data-icr-summary-model]");
    var summaryIssue = root.querySelector("[data-icr-summary-issue]");
    var summaryPrice = root.querySelector("[data-icr-summary-price]");
    var form = root.querySelector("[data-icr-cart-form]");
    var variantInput = root.querySelector("[data-icr-variant-id]");
    var modelInput = root.querySelector("[data-icr-property-model]");
    var issueInput = root.querySelector("[data-icr-property-issue]");
    var serviceInput = root.querySelector("[data-icr-property-service]");
    var diagnostic = root.querySelector("[data-icr-diagnostic-result]");
    var booking = root.querySelector("[data-icr-booking-result]");
    var courierFields = root.querySelector("[data-icr-courier-fields]");
    var serviceRadios = root.querySelectorAll("[data-icr-service-radio]");
    var designRoot = root.closest(".icr-design");
    var floating = designRoot ? designRoot.querySelector("[data-icr-floating-wizard]") : null;

    function scrollToWizard() {
      var target = document.getElementById("wizard");
      if (!target) target = root;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }

    function goToStep(step, shouldScroll) {
      if (step === 2 && !state.productTitle) step = 1;
      if (step === 3 && (!state.productTitle || !state.issue)) step = state.productTitle ? 2 : 1;
      state.step = step;
      setStep(root, step);
      updateFloating();
      if (shouldScroll) scrollToWizard();
    }

    function requiresDiagnosis() {
      return state.modelRequiresDiagnosis || state.issueRequiresDiagnosis || !state.variantId;
    }

    function updateSummary() {
      if (summaryModel) summaryModel.textContent = state.productTitle || "Selected MacBook";
      if (summaryIssue) summaryIssue.textContent = state.issue || "Screen issue";
      if (summaryPrice) {
        summaryPrice.textContent = requiresDiagnosis() ? "Free diagnosis first" : moneyFromCents(state.priceCents);
      }
      if (variantInput) variantInput.value = state.variantId;
      if (modelInput) modelInput.value = state.productTitle;
      if (issueInput) issueInput.value = state.issue;
      if (diagnostic) diagnostic.hidden = !requiresDiagnosis();
      if (booking) booking.hidden = requiresDiagnosis();
      if (form) form.hidden = requiresDiagnosis();
      updateFloating();
    }

    function updateFloating() {
      if (!floating) return;

      var hasModel = Boolean(state.productTitle);
      var hasIssue = Boolean(state.issue);
      var hasBoth = hasModel && hasIssue;
      var modelChip = floating.querySelector('[data-icr-floating-jump="1"]');
      var issueChip = floating.querySelector('[data-icr-floating-jump="2"]');
      var modelValue = floating.querySelector("[data-icr-floating-model]");
      var issueValue = floating.querySelector("[data-icr-floating-issue]");
      var turnaroundValue = floating.querySelector("[data-icr-floating-turnaround]");
      var cta = floating.querySelector("[data-icr-floating-cta]");
      var floatingRequiresDiagnosis = state.modelRequiresDiagnosis || state.issueRequiresDiagnosis || (hasBoth && !state.variantId);
      var turnaround = floatingRequiresDiagnosis ? "Pre-diagnosis first" : hasIssue ? "1–2 days" : "1–2 days typical";
      var ctaText = "Start your quote";

      if (state.step === 3 && hasBoth) {
        ctaText = floatingRequiresDiagnosis ? "Book free pre-diagnosis" : "Book repair · " + moneyFromCents(state.priceCents);
      } else if (hasBoth) {
        ctaText = "Get my quote";
      } else if (hasModel) {
        ctaText = "Pick your issue";
      } else if (hasIssue) {
        ctaText = "Pick your model";
      }

      if (modelChip) {
        modelChip.classList.toggle("filled", hasModel);
        modelChip.setAttribute("aria-label", hasModel ? "Change model (currently " + state.productTitle + ")" : "Pick model");
      }
      if (issueChip) {
        issueChip.classList.toggle("filled", hasIssue);
        issueChip.setAttribute("aria-label", hasIssue ? "Change issue (currently " + state.issue + ")" : "Pick issue");
      }
      if (modelValue) modelValue.textContent = hasModel ? state.productTitle : "Not set";
      if (issueValue) issueValue.textContent = hasIssue ? state.issue : "Not set";
      if (turnaroundValue) turnaroundValue.textContent = turnaround;
      if (cta) {
        cta.innerHTML = ctaText + ' <span class="fwiz-btn-arrow" aria-hidden="true">→</span>';
      }
    }

    function initFloatingWizard() {
      if (!floating) return;

      function updateVisibility() {
        var rect = root.getBoundingClientRect();
        floating.hidden = rect.bottom >= -120;
      }

      floating.querySelectorAll("[data-icr-floating-jump]").forEach(function (button) {
        button.addEventListener("click", function () {
          goToStep(Number(button.getAttribute("data-icr-floating-jump")), true);
        });
      });

      var cta = floating.querySelector("[data-icr-floating-cta]");
      if (cta) {
        cta.addEventListener("click", function () {
          if (state.step === 3 && state.productTitle && state.issue) {
            scrollToWizard();
          } else if (state.productTitle && state.issue) {
            goToStep(3, true);
          } else if (state.productTitle) {
            goToStep(2, true);
          } else {
            goToStep(1, true);
          }
        });
      }

      window.addEventListener("scroll", updateVisibility, { passive: true });
      window.addEventListener("resize", updateVisibility);
      updateFloating();
      updateVisibility();
    }

    root.querySelectorAll("[data-icr-model-option]").forEach(function (button) {
      button.addEventListener("click", function () {
        root.querySelectorAll("[data-icr-model-option]").forEach(function (item) {
          item.classList.remove("is-selected");
          item.classList.remove("selected");
        });
        button.classList.add("is-selected");
        button.classList.add("selected");
        state.productTitle = button.getAttribute("data-product-title") || "";
        state.productUrl = button.getAttribute("data-product-url") || "";
        state.variantId = button.getAttribute("data-variant-id") || "";
        state.priceCents = Number(button.getAttribute("data-price-cents") || 0);
        state.modelRequiresDiagnosis = button.getAttribute("data-model-diagnosis") === "true";
        updateSummary();
        goToStep(2, false);
      });
    });

    root.querySelectorAll("[data-icr-issue-option]").forEach(function (button) {
      button.addEventListener("click", function () {
        root.querySelectorAll("[data-icr-issue-option]").forEach(function (item) {
          item.classList.remove("is-selected");
          item.classList.remove("selected");
        });
        button.classList.add("is-selected");
        button.classList.add("selected");
        state.issue = button.getAttribute("data-issue-label") || "";
        state.issueRequiresDiagnosis = button.getAttribute("data-diagnosis") === "true";
        updateSummary();
        goToStep(3, false);
      });
    });

    root.querySelectorAll("[data-icr-back]").forEach(function (button) {
      button.addEventListener("click", function () {
        goToStep(Number(button.getAttribute("data-icr-back")), false);
      });
    });

    root.querySelectorAll("[data-icr-progress]").forEach(function (button) {
      button.addEventListener("click", function () {
        goToStep(Number(button.getAttribute("data-icr-progress")), false);
      });
    });

    serviceRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        root.querySelectorAll(".icr-service-option, .wiz-delivery-card").forEach(function (label) {
          var selected = label.contains(radio) && radio.checked;
          label.classList.toggle("is-selected", selected);
          label.classList.toggle("active", selected);
        });
        if (serviceInput) serviceInput.value = radio.value;
        if (courierFields) courierFields.hidden = radio.value !== "london_courier";
      });
      if (radio.checked) {
        radio.dispatchEvent(new Event("change"));
      }
    });

    goToStep(1, false);
    initFilters(root);
    initFloatingWizard();
  }

  function initIdentify(form) {
    var input = form.querySelector("[data-icr-identify-input]");
    var message = form.querySelector("[data-icr-identify-message]");
    if (!input) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-icr-product-card]"));
      var match = cards.find(function (card) {
        return (card.getAttribute("data-search") || "").toLowerCase().indexOf(query) !== -1;
      });

      cards.forEach(function (card) {
        card.classList.remove("is-highlighted");
      });

      if (match && query) {
        match.classList.add("is-highlighted");
        match.scrollIntoView({ behavior: "smooth", block: "center" });
        if (message) message.textContent = "Matched your code to a repair below.";
      } else {
        var wizard = document.getElementById("icr-wizard");
        if (wizard) wizard.scrollIntoView({ behavior: "smooth", block: "start" });
        if (message) message.textContent = "We could not match that code yet. Start with the wizard and we will confirm the exact model.";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-icr-collection-wizard]").forEach(initWizard);
    document.querySelectorAll("[data-icr-identify-form]").forEach(initIdentify);
  });
})();
