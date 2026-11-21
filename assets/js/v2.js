/* Classic theme v2 interactions: goals, How I work, the lab, About toolkit
   tabs and the Contact form. Every block checks for its markup first, and
   the pages still read correctly without JavaScript. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  // ------------------------------------------------------------ Start here
  var goals = document.querySelector("[data-goals]");
  if (goals) {
    var goalData = [
      ["01 · Simplify a complex Agentic AI platform", "Turn tangled, conditional workflows into a few clear building blocks.", "Workload API", "work/workload-api.html"],
      ["02 · Build a design system", "One set of tokens and components that every product team can use.", "Design System", "work/design-system.html"],
      ["03 · Design tools for data and AI", "Code-first tools that work alongside automation instead of fighting it.", "Built in Notebooks", "work/notebooks.html"],
      ["04 · Take design all the way to code", "Designed in Figma, shipped as production code, with nothing lost in handoff.", "OpenCode theme.json", "work/cli-theme/index.html"]
    ];
    var chip = goals.querySelector("[data-goal-chip]");
    var line = goals.querySelector("[data-goal-line]");
    var link = goals.querySelector("[data-goal-link]");
    var cards = goals.querySelectorAll("[data-goal]");
    var showGoal = function (i) {
      var g = goalData[i];
      chip.textContent = g[0];
      line.textContent = g[1];
      link.textContent = "See it in " + g[2] + " →";
      link.setAttribute("href", g[3]);
      each(cards, function (c, j) { c.setAttribute("aria-pressed", String(i === j)); });
    };
    each(cards, function (card, i) {
      var pick = function () { showGoal(i); };
      card.addEventListener("click", pick);
      card.addEventListener("focus", pick);
      card.addEventListener("mouseenter", pick);
    });
  }

  // ------------------------------------------------------------ How I work
  var how = document.querySelector("[data-how]");
  if (how) {
    var steps = [
      { name: "Discover", when: "Go wide", text: "Stakeholder interviews, user research and real usage data. I look at how people actually work today, not how we think they do, and we agree on the one outcome this work must move.",
        get: [["◎", "Research summary"], ["?", "Problem statement"], ["↗", "Success measure"]], tools: "Claude · Figma",
        work: "Built in Notebooks", href: "work/notebooks.html", proof: "Studied how notebooks were really used across the platform and found the pattern that shaped everything: people jumping between no-code pipelines and custom code." },
      { name: "Define", when: "Narrow down", text: "Map the users, their jobs and the system around them. Name the real problem and cut it down until it fits on one page.",
        get: [["⇢", "User flows"], ["▦", "Information architecture"], ["✂", "Scope"]], tools: "Figma · Claude",
        work: "Workload API", href: "work/workload-api.html", proof: "Named the real problem: build inputs that changed with every build type, so the API was easy to misuse." },
      { name: "Design", when: "Go wide again", text: "Explore several directions, then converge. Wireframes, interaction details and high-fidelity UI built on the design system.",
        get: [["▢", "Wireframes"], ["◐", "High-fidelity UI"], ["▶", "Interactive prototype"]], tools: "Figma · Claude Design",
        work: "Workload API", href: "work/workload-api.html", proof: "Grouped every build input into one object, so each option carries only the fields it needs and invalid setups can’t happen." },
      { name: "Test", when: "Prove it", text: "Put an interactive prototype in front of real users before engineering commits, then fix what breaks.",
        get: [["◉", "Usability findings"], ["↺", "Revised designs"], ["✓", "Go-ahead for build"]], tools: "Claude Design",
        work: "Workload API", href: "work/workload-api.html", proof: "Ran 30–45 minute sessions on a Claude Design prototype before a line of production code was written." },
      { name: "Deliver", when: "Ship it", text: "Work side by side with engineering through build and launch, and ship some of it myself. Then check the result against the success measure.",
        get: [["{}", "Specs and tokens"], ["☑", "QA notes"], ["★", "Launch review"]], tools: "Claude Code · Figma",
        work: "OpenCode theme.json", href: "work/cli-theme/index.html", proof: "Designed in Figma and shipped as production JSON: 44 color tokens across light and dark modes." }
    ];
    var q = function (sel) { return how.querySelector(sel); };
    var stepBtns = how.querySelectorAll("[data-step]");
    var dots = how.querySelectorAll(".v2-how__dots span");
    var clip = q(".v2-journey__clip");
    var showStep = function (i) {
      var s = steps[i];
      q("[data-how-num]").textContent = "0" + (i + 1);
      q("[data-how-when]").textContent = s.when;
      q("[data-how-name]").textContent = s.name;
      q("[data-how-text]").textContent = s.text;
      q("[data-how-tools]").textContent = s.tools;
      q("[data-how-work]").textContent = s.work;
      q("[data-how-proof]").textContent = s.proof;
      q("[data-how-link]").setAttribute("href", s.href);
      each(how.querySelectorAll("[data-how-get] li"), function (li, j) {
        li.querySelector("i").textContent = s.get[j][0];
        li.querySelector("span").textContent = s.get[j][1];
      });
      each(stepBtns, function (b, j) { b.setAttribute("aria-pressed", String(i === j)); });
      each(dots, function (d, j) { d.classList.toggle("is-on", i === j); });
      if (clip) clip.style.transform = "translateX(" + (i * 233.6) + "px)";
    };
    each(stepBtns, function (b, i) {
      var pick = function () { showStep(i); };
      b.addEventListener("click", pick);
      b.addEventListener("focus", pick);
      b.addEventListener("mouseenter", pick);
    });
  }

  // ------------------------------------------------------- Lab: shared spring
  // Damped spring on a value, mass 1, two fixed sub-steps per frame.
  function spring(state, target, k, c, onFrame, v0) {
    if (state.raf) cancelAnimationFrame(state.raf);
    if (reduceMotion) { state.x = target; state.v = 0; onFrame(target, 0); return; }
    state.v = v0 || 0;
    var tick = function () {
      for (var n = 0; n < 2; n++) {
        var a = -k * (state.x - target) - c * state.v;
        state.v += a / 120; state.x += state.v / 120;
      }
      var done = Math.abs(state.v) < 0.002 && Math.abs(state.x - target) < 0.002 * Math.max(1, Math.abs(target) + 1);
      if (done) { state.x = target; state.v = 0; }
      onFrame(state.x, state.v);
      if (!done) state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
  }

  // Spring toggle
  var sw = document.querySelector("[data-spring-switch]");
  if (sw) {
    var knob = sw.querySelector(".v2-switch__knob");
    var swState = { x: 0, v: 0 };
    sw.addEventListener("click", function () {
      var on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", String(on));
      spring(swState, on ? 1 : 0, 520, 22, function (x, v) {
        var squash = 1 + Math.min(0.25, Math.abs(v) / 8);
        knob.style.transform = "translateX(" + (x * 56).toFixed(2) + "px) scaleX(" + squash.toFixed(3) + ")";
      });
    });
  }

  // Physics card
  var card = document.querySelector("[data-throw]");
  if (card) {
    var pos = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 }, r: { x: 0, v: 0 } };
    var drag = null;
    var paint = function () {
      card.style.transform = "translate(" + pos.x.x.toFixed(1) + "px," + pos.y.x.toFixed(1) + "px) rotate(" + pos.r.x.toFixed(2) + "deg)" + (drag ? " scale(1.04)" : "");
    };
    var release = function (vx, vy) {
      spring(pos.x, 0, 300, 14, paint, vx * 60);
      spring(pos.y, 0, 300, 14, paint, vy * 60);
      spring(pos.r, 0, 260, 12, paint);
    };
    card.addEventListener("pointerdown", function (e) {
      if (card.setPointerCapture) card.setPointerCapture(e.pointerId);
      ["x", "y", "r"].forEach(function (k) { if (pos[k].raf) cancelAnimationFrame(pos[k].raf); });
      drag = { sx: e.clientX - pos.x.x, sy: e.clientY - pos.y.x, lx: e.clientX, ly: e.clientY, lt: performance.now(), vx: 0, vy: 0 };
      card.classList.add("is-drag");
    });
    card.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var now = performance.now(), dt = Math.max(1, now - drag.lt);
      drag.vx = (e.clientX - drag.lx) / dt * 16; drag.vy = (e.clientY - drag.ly) / dt * 16;
      drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now;
      pos.x.x = e.clientX - drag.sx; pos.y.x = e.clientY - drag.sy;
      pos.r.x = Math.max(-18, Math.min(18, drag.vx * 1.2));
      paint();
    });
    var up = function () {
      if (!drag) return;
      var d = drag; drag = null;
      card.classList.remove("is-drag");
      release(d.vx, d.vy);
    };
    card.addEventListener("pointerup", up);
    card.addEventListener("pointercancel", up);
    card.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      var vx = (Math.random() > .5 ? 1 : -1) * (14 + Math.random() * 10);
      release(vx, -10 - Math.random() * 8);
      spring(pos.r, 0, 260, 12, paint, vx * 20);
    });
  }

  // Tuned slider
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var fill = slider.querySelector(".v2-slider__fill");
    var thumb = slider.querySelector(".v2-slider__thumb");
    var out = document.querySelector("[data-slider-val]");
    var val = 40, ac = null, bumpT = 0;
    var beep = function (freq) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        ac = ac || new AC();
        var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
        o.type = "sine"; o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.14);
      } catch (err) { /* no sound available */ }
    };
    var render = function () {
      fill.style.width = val + "%";
      thumb.style.left = val + "%";
      out.textContent = String(val);
      slider.setAttribute("aria-valuenow", String(val));
    };
    var set = function (v) {
      v = Math.max(0, Math.min(100, Math.round(v / 10) * 10));
      if (v === val) return;
      val = v; render(); beep(220 * Math.pow(2, v / 50));
      out.classList.add("is-bump"); clearTimeout(bumpT); bumpT = setTimeout(function () { out.classList.remove("is-bump"); }, 140);
    };
    var fromEvent = function (e) { var r = slider.getBoundingClientRect(); if (r.width) set((e.clientX - r.left) / r.width * 100); };
    var dragging = false;
    slider.addEventListener("pointerdown", function (e) {
      dragging = true; slider.classList.add("is-drag");
      if (slider.setPointerCapture) slider.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    slider.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    var stop = function () { dragging = false; slider.classList.remove("is-drag"); };
    slider.addEventListener("pointerup", stop);
    slider.addEventListener("pointercancel", stop);
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); set(val + 10); }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); set(val - 10); }
      if (e.key === "Home") { e.preventDefault(); set(0); }
      if (e.key === "End") { e.preventDefault(); set(100); }
    });
    render();
  }

  // ------------------------------------------------------- About: toolkit tabs
  var tablist = document.querySelector("[data-tabs]");
  if (tablist) {
    var tabs = tablist.querySelectorAll("[role=tab]");
    var select = function (i, focus) {
      each(tabs, function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        if (on && focus) t.focus();
      });
    };
    each(tabs, function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  }

  // ----------------------------------------------------------- Contact form
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var EMAIL = "annagorobchyk@gmail.com";
    var topics = {
      "Full-time role": ["Level", "e.g. Senior Product Designer", "Tell me about the role, the team and what they’re building."],
      "Freelance project": ["Timeline", "e.g. 3 months, from March", "What are you building, and where could design help most?"],
      "Design system": ["Team size", "e.g. 4 product teams", "Where is the system today, and what’s getting in the way?"],
      "Just saying hi": ["Where you found me", "e.g. LinkedIn", "Say hi. I read everything."]
    };
    var topicBtns = form.querySelectorAll("[data-topic]");
    var extraLabel = form.querySelector("[data-extra-label]");
    var extra = form.querySelector("[name=extra]");
    var msg = form.querySelector("[name=message]");
    var note = form.querySelector("[data-form-note]");
    var topic = "Full-time role";
    each(topicBtns, function (b) {
      b.addEventListener("click", function () {
        topic = b.getAttribute("data-topic");
        each(topicBtns, function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        var t = topics[topic];
        extraLabel.textContent = t[0]; extra.placeholder = t[1]; msg.placeholder = t[2];
      });
    });
    var check = function (field, ok, text) {
      var err = document.getElementById(field.getAttribute("aria-describedby"));
      field.setAttribute("aria-invalid", String(!ok));
      err.textContent = ok ? "" : text;
      return ok;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email;
      var emailVal = email.value.trim();
      var okName = check(name, !!name.value.trim(), "Please add your name.");
      var okEmail = check(email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailVal),
        emailVal ? "That email doesn’t look right. Check for a typo." : "Please add your email so I can reply.");
      var okMsg = check(msg, !!msg.value.trim(), "Please add a short message.");
      if (!(okName && okEmail && okMsg)) {
        note.textContent = "Fix the highlighted fields, then send again.";
        note.className = "v2-form__note is-error";
        (!okName ? name : !okEmail ? email : msg).focus();
        return;
      }
      // Send through Web3Forms so the message lands in Anna's inbox without leaving the page.
      var btn = form.querySelector("[type=submit]");
      var btnLabel = btn.innerHTML;
      var data = {
        access_key: form.elements.access_key.value,
        subject: "Website contact: " + topic + " — " + name.value.trim(),
        from_name: name.value.trim(),
        name: name.value.trim(),
        email: emailVal,
        topic: topic,
        company: form.elements.company.value.trim(),
        message: msg.value.trim(),
        botcheck: form.elements.botcheck.checked
      };
      if (extra.value.trim()) data[extraLabel.textContent] = extra.value.trim();
      btn.disabled = true;
      btn.textContent = "Sending…";
      note.textContent = "Sending your message…";
      note.className = "v2-form__note";
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.success !== false }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          form.reset();
          note.textContent = "Thank you, your message is on its way. I’ll reply within 2 working days.";
          note.className = "v2-form__note is-ok";
        })
        .catch(function () {
          note.textContent = "Sorry, the message didn’t send. Please try again, or copy my email address on the right.";
          note.className = "v2-form__note is-error";
        })
        .then(function () { btn.disabled = false; btn.innerHTML = btnLabel; });
    });
  }

  // ------------------------------------------------------------ Copy email
  var copyBtn = document.querySelector("[data-copy]");
  if (copyBtn) {
    var copyNote = document.querySelector("[data-copy-note]");
    var icon = copyBtn.querySelector(".v2-copy__icon");
    var resetT = 0;
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var done = function () {
        copyBtn.classList.add("is-copied");
        icon.textContent = "✓";
        copyNote.textContent = "Copied to your clipboard";
        copyNote.classList.add("is-ok");
        clearTimeout(resetT);
        resetT = setTimeout(function () {
          copyBtn.classList.remove("is-copied");
          icon.textContent = "⧉";
          copyNote.textContent = "Click the address to copy it";
          copyNote.classList.remove("is-ok");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { copyNote.textContent = "Couldn’t copy. Select the address instead."; });
      } else {
        copyNote.textContent = "Couldn’t copy. Select the address instead.";
      }
    });
  }
})();

/* Work cards: videos play only while the card is hovered or focused.
   Looping videos rest on their first frame. data-play="once" videos (an intro that
   builds the cover) rest on their last frame and replay from the start on each hover. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".v2-card").forEach(function (card) {
    var v = card.querySelector("video");
    if (!v || reduce) return;
    var once = v.getAttribute("data-play") === "once";
    v.preload = "auto";
    var seek = function (t) { try { v.currentTime = t; } catch (e) {} };
    var start = function () {
      if (once) seek(0);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    };
    var stop = function () {
      v.pause();
      if (once) { if (v.duration) seek(v.duration); } else seek(0.1);
    };
    card.addEventListener("mouseenter", start);
    card.addEventListener("focus", start);
    card.addEventListener("mouseleave", stop);
    card.addEventListener("blur", stop);
  });
})();
