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

// --- Theme switch: "Try me" nudge ------------------------------------------
// Always shows on the classic theme; Escape closes the preview until the
// pointer leaves.
(function () {
  "use strict";

  var root = document.documentElement;
  var sw = document.querySelector(".theme-switch");
  if (!sw || root.classList.contains("theme-neon")) return;

  root.classList.add("show-try");

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") sw.classList.add("is-closed");
  });
  sw.addEventListener("mouseleave", function () { sw.classList.remove("is-closed"); });
  sw.addEventListener("focusout", function () { sw.classList.remove("is-closed"); });
})();

/* Autoplaying hero videos: respect "reduce motion" by stopping on the first frame */
(function () {
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("video[autoplay]").forEach(function (v) {
    v.removeAttribute("autoplay");
    v.pause();
  });
})();

/* Image-to-video hero: the image turns into the video and comes back when the video ends.
   data-hero-player="click" (default): a play button starts it; clicking again stops it early.
   data-hero-player="hover": it plays while the pointer is over it; on touch screens a tap toggles it. */
(function () {
  document.querySelectorAll("[data-hero-player]").forEach(function (box) {
    var v = box.querySelector("video");
    if (!v) return;
    var hover = box.getAttribute("data-hero-player") === "hover";
    var btn = box.querySelector(".cs-banner__play");
    var label = btn ? btn.getAttribute("aria-label") : "";
    var playing = function () { return box.classList.contains("is-playing"); };
    function reset() {
      box.classList.remove("is-playing");
      if (btn) btn.setAttribute("aria-label", label);
      setTimeout(function () { if (!playing()) { v.pause(); try { v.currentTime = 0; } catch (e) {} } }, 400);
    }
    function start() {
      if (playing()) return;
      try { v.currentTime = 0; } catch (e) {}
      var p = v.play();
      box.classList.add("is-playing");
      if (btn) btn.setAttribute("aria-label", "Stop the video");
      if (p && p.catch) p.catch(reset);
    }
    v.addEventListener("ended", reset);
    if (hover) {
      v.preload = "auto";
      box.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") start(); });
      box.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") reset(); });
      box.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") { if (playing()) reset(); else start(); } });
    } else if (btn) {
      btn.addEventListener("click", function () { if (playing()) reset(); else start(); });
    }
  });
})();
