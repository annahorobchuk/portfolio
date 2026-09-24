/* Small progressive enhancements: mobile nav toggle + back-to-top button. */

(function () {
  "use strict";

  // --- Mobile navigation -------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    var mq = window.matchMedia("(max-width: 640px)");

    var sync = function () {
      if (mq.matches) {
        links.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      } else {
        links.hidden = false;
      }
    };

    sync();
    mq.addEventListener("change", sync);

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.hidden = open;
    });
  }

  // --- Back to top -------------------------------------------------------
  var toTop = document.querySelector(".to-top");

  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Password gate -------------------------------------------------------
  var gateForm = document.getElementById("gate-form");

  if (gateForm) {
    var GATE_PASSWORD = "11111";
    var input = document.getElementById("gate-password");
    var error = document.getElementById("gate-error");
    var target = new URLSearchParams(window.location.search).get("to") || "../index.html";

    // Only allow same-site relative targets — no external redirects.
    if (/^[a-z]+:\/\//i.test(target) || target.indexOf("//") === 0) {
      target = "../index.html";
    }

    gateForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (input.value === GATE_PASSWORD) {
        window.location.href = target;
        return;
      }

      error.textContent = "Incorrect password. Try again.";
      gateForm.classList.remove("is-error");
      // Restart the shake animation even on repeated wrong attempts.
      void gateForm.offsetWidth;
      gateForm.classList.add("is-error");
      input.value = "";
      input.focus();
    });
  }
})();
