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

  // Small spring integrator for components that run several springs in one loop.
  var step = function (o, target, k, c, dt, eps) {
    var a = -k * (o.x - target) - c * o.v;
    o.v += a * dt; o.x += o.v * dt;
    if (Math.abs(o.v) < eps * 4 && Math.abs(o.x - target) < eps) { o.x = target; o.v = 0; return false; }
    return true;
  };
  var loop = function (frame) {
    var raf = 0, last = 0;
    var tick = function (now) {
      var dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000)); last = now;
      raf = frame(dt, now) ? requestAnimationFrame(tick) : 0;
    };
    return function () { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  // Spring toggle: the knob springs across (stiffness 520, damping 22) and, before you
  // click, leans toward a nearby cursor like a magnet.
  var sw = document.querySelector("[data-spring-switch]");
  if (sw) {
    var knob = sw.querySelector(".v2-switch__knob");
    var stage = sw.closest(".v2-stage") || sw.parentNode;
    var S = { x: { x: 0, v: 0 }, lx: { x: 0, v: 0 }, ly: { x: 0, v: 0 }, pr: { x: 0, v: 0 }, on: false, tx: 0, ty: 0, tp: 0 };
    var paintSw = function () {
      knob.style.transform = "translate(" + (S.x.x * 56 + S.lx.x).toFixed(2) + "px," + S.ly.x.toFixed(2) + "px) scale(" + (1 + S.pr.x * 0.07).toFixed(3) + ")";
      knob.style.setProperty("--hx", (50 + S.lx.x * 3).toFixed(1) + "%");
      knob.style.setProperty("--hy", (35 + S.ly.x * 3).toFixed(1) + "%");
      sw.style.setProperty("--lx", S.lx.x.toFixed(2));
      sw.style.setProperty("--ly", S.ly.x.toFixed(2));
    };
    var runSw = loop(function (dt) {
      var a = step(S.x, S.on ? 1 : 0, 520, 22, dt, 0.0008);
      var b = step(S.lx, S.tx, 300, 20, dt, 0.01);
      var c = step(S.ly, S.ty, 300, 20, dt, 0.01);
      var d = step(S.pr, S.tp, 300, 24, dt, 0.001);
      paintSw();
      return a || b || c || d;
    });
    sw.addEventListener("click", function () {
      S.on = !S.on;
      sw.setAttribute("aria-checked", String(S.on));
      runSw();
    });
    if (!reduceMotion) {
      stage.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = knob.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var f = clamp(1 - Math.sqrt(dx * dx + dy * dy) / 150, 0, 1);
        S.tx = clamp(dx * 0.16, -10, 10) * f; S.ty = clamp(dy * 0.16, -6, 6) * f; S.tp = f > 0 ? 1 : 0;
        runSw();
      });
      stage.addEventListener("pointerleave", function () { S.tx = 0; S.ty = 0; S.tp = 0; runSw(); });
    }
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

  // Tuned slider: a value bubble rides above the thumb and swings with your drag speed;
  // ticks rise as the thumb passes. A short note plays at every step of 10.
  var bs = document.querySelector("[data-bslider]");
  if (bs) {
    var bOut = bs.querySelector("[data-bslider-val]");
    var bTicks = bs.querySelectorAll(".v2-bslider__ticks i");
    var B = { val: 40, vs: { x: 40, v: 0 }, tilt: { x: 0, v: 0 }, bsc: { x: 0.88, v: 0 }, ts: { x: 1, v: 0 }, drag: false, tt: 0, lastT: 0, lastV: 40, step10: 4 };
    var bAc = null;
    var bBeep = function (freq) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        bAc = bAc || new AC();
        var o = bAc.createOscillator(), g = bAc.createGain(), t = bAc.currentTime;
        o.type = "sine"; o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.1, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(g); g.connect(bAc.destination); o.start(t); o.stop(t + 0.14);
      } catch (err) { /* no sound available */ }
    };
    var paintB = function () {
      var p = clamp(B.vs.x, 0, 100), w = bs.clientWidth || 1, px = p / 100 * w;
      bs.style.setProperty("--p", p.toFixed(2) + "%");
      bs.style.setProperty("--tilt", B.tilt.x.toFixed(2));
      bs.style.setProperty("--bs", B.bsc.x.toFixed(3));
      bs.style.setProperty("--ts", B.ts.x.toFixed(3));
      bOut.textContent = String(Math.round(p));
      for (var i = 0; i < bTicks.length; i++) {
        var tx = i / (bTicks.length - 1) * w;
        bTicks[i].style.setProperty("--pr", clamp(1 - Math.abs(tx - px) / 50, 0, 1).toFixed(3));
        bTicks[i].classList.toggle("on", i * 5 <= p + 0.01);
      }
    };
    var runB = loop(function (dt, now) {
      if (B.drag && now - B.lastT > 60) B.tt = 0;
      var a = step(B.vs, B.val, 600, 45, dt, 0.01);
      var b = step(B.tilt, B.tt, 220, 12, dt, 0.01);
      var c = step(B.bsc, B.drag ? 1.08 : 0.88, 400, 22, dt, 0.001);
      var d = step(B.ts, B.drag ? 1.18 : 1, 500, 24, dt, 0.001);
      paintB();
      return a || b || c || d;
    });
    var setVal = function (v) {
      B.val = clamp(v, 0, 100);
      var s10 = Math.round(B.val / 10);
      if (s10 !== B.step10) { B.step10 = s10; bBeep(220 * Math.pow(2, s10 * 10 / 50)); }
      bs.setAttribute("aria-valuenow", String(Math.round(B.val)));
      runB();
    };
    var fromPointer = function (e) {
      var r = bs.getBoundingClientRect(); if (!r.width) return;
      var v = clamp((e.clientX - r.left) / r.width * 100, 0, 100), now = performance.now();
      var vel = (v - B.lastV) / (Math.max(1, now - B.lastT) / 1000);
      B.tt = reduceMotion ? 0 : clamp(-vel * 0.12, -28, 28);
      B.lastV = v; B.lastT = now;
      setVal(v);
    };
    bs.addEventListener("pointerdown", function (e) {
      if (bs.setPointerCapture) bs.setPointerCapture(e.pointerId);
      B.drag = true; B.lastT = performance.now(); B.lastV = B.val; fromPointer(e);
    });
    bs.addEventListener("pointermove", function (e) { if (B.drag) fromPointer(e); });
    var bStop = function () { B.drag = false; B.tt = 0; runB(); };
    bs.addEventListener("pointerup", bStop);
    bs.addEventListener("pointercancel", bStop);
    bs.addEventListener("keydown", function (e) {
      var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0;
      if (d) { e.preventDefault(); setVal(Math.round(B.val) + d * (e.shiftKey ? 10 : 1)); if (!reduceMotion) { B.tt = -d * 10; setTimeout(function () { B.tt = 0; runB(); }, 90); } }
      if (e.key === "Home") { e.preventDefault(); setVal(0); }
      if (e.key === "End") { e.preventDefault(); setVal(100); }
    });
    paintB();
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
