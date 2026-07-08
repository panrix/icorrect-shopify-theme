(function () {
  var root = document.querySelector(".icorrect-homepage");
  if (!root) return;

  var nav = root.querySelector("[data-hp-nav]");
  var menuButton = root.querySelector("[data-hp-menu-toggle]");
  var mobileMenu = root.querySelector("[data-hp-mobile-menu]");
  var scrim = root.querySelector("[data-hp-menu-scrim]");

  function setMenu(open) {
    if (!nav || !menuButton || !mobileMenu || !scrim) return;
    nav.classList.toggle("icnav-open", open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.hidden = !open;
    scrim.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(!nav.classList.contains("icnav-open"));
    });
  }
  if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
  root.querySelectorAll(".icnav-mobile a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  root.querySelectorAll("[data-hp-faq] .hp-faq-q").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest("[data-hp-faq]");
      var answer = item.querySelector(".hp-faq-a");
      var open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
      if (answer) answer.hidden = !open;
    });
  });

  var reveals = root.querySelectorAll(".hp-reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("revealed"); });
  }

  var wizard = root.querySelector("[data-hp-wizard]");
  if (!wizard) return;

  var panels = Array.prototype.slice.call(wizard.querySelectorAll("[data-hp-step]"));
  var dots = Array.prototype.slice.call(wizard.querySelectorAll("[data-hp-step-dot]"));
  var stepNum = wizard.querySelector("[data-hp-step-num]");
  var index = 0;

  function showStep(next) {
    index = Math.max(0, Math.min(next, panels.length - 1));
    panels.forEach(function (panel, i) {
      panel.hidden = i !== index;
    });
    dots.forEach(function (dot, i) {
      dot.disabled = i > index;
      dot.classList.toggle("done", i < index);
      dot.classList.toggle("current", i === index);
      var num = dot.querySelector(".qw-dot-num");
      if (num) num.textContent = i < index ? "✓" : String(i + 1);
    });
    if (stepNum) stepNum.textContent = String(index + 1);
  }

  wizard.querySelectorAll("[data-hp-next]").forEach(function (button) {
    button.addEventListener("click", function () { showStep(index + 1); });
  });
  wizard.querySelectorAll("[data-hp-back]").forEach(function (button) {
    button.addEventListener("click", function () { showStep(index - 1); });
  });
  wizard.querySelectorAll("[data-hp-step-dot]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.disabled) return;
      showStep(Number(button.getAttribute("data-hp-step-dot")) || 0);
    });
  });
  var form = wizard.querySelector("[data-hp-next-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showStep(index + 1);
    });
  }

  showStep(0);
})();
