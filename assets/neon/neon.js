/* Neon theme interactions. Everything here is an enhancement: the pages read fine without it. */

(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var hero = $('.hero');
  var fx = $('.fx');
  var rail = $('.rail');
  var header = $('.top');
  var curtain = $('.curtain');

  /* ---------------------------------------------------------- Split text -- */

  $$('[data-split="chars"]').forEach(function (el) {
    var text = el.textContent;
    el.textContent = '';
    Array.from(text).forEach(function (c, i) {
      var s = doc.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i);
      s.textContent = c;
      el.appendChild(s);
    });
    el.classList.add('is-split');
  });

  $$('[data-split="words"]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.textContent = '';
    words.forEach(function (w, i) {
      var outer = doc.createElement('span');
      var inner = doc.createElement('span');
      outer.className = 'w';
      outer.setAttribute('aria-hidden', 'true');
      inner.className = 'wi';
      inner.style.setProperty('--i', i);
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(doc.createTextNode(' '));
    });
    el.classList.add('is-split');
  });

  /* ------------------------------------------------------- Text scramble -- */

  var GLYPHS = '!<>-_\\/[]{}=+*^?#01';

  function scramble(el) {
    if (reduce || el._scrambling) return;
    var text = el.dataset.text || (el.dataset.text = el.textContent);
    var len = text.length;
    var frame = 0;
    var total = 10 + len * 1.4;
    el._scrambling = true;
    // Lock the width so neighbouring items do not jitter while glyphs change.
    var w = el.getBoundingClientRect().width;
    var prevDisplay = el.style.display;
    if (w) { el.style.display = 'inline-block'; el.style.minWidth = w + 'px'; }
    (function step() {
      frame += 1;
      var shown = Math.floor((frame / total) * len);
      var out = '';
      for (var i = 0; i < len; i++) {
        var c = text.charAt(i);
        if (i < shown || c === ' ') out += c;
        else out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }
      el.textContent = out;
      if (frame < total) {
        setTimeout(step, 28);
      } else {
        el.textContent = text;
        el.style.display = prevDisplay;
        el.style.minWidth = '';
        el._scrambling = false;
      }
    })();
  }

  if (fine) {
    $$('[data-scramble]').forEach(function (el) {
      var host = el.closest('a, button') || el;
      host.addEventListener('pointerenter', function () { scramble(el); });
      host.addEventListener('focus', function () { scramble(el); });
    });
  }

  /* ------------------------------------------------------------- Loader -- */

  function assetsReady() {
    var waits = [];
    if (doc.fonts && doc.fonts.ready) waits.push(doc.fonts.ready);
    var img = $('.hero__img');
    if (img && !img.complete) {
      waits.push(new Promise(function (res) {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true });
      }));
    }
    var timeout = new Promise(function (res) { setTimeout(res, 3200); });
    return Promise.race([Promise.all(waits), timeout]);
  }

  function runLoader() {
    return new Promise(function (resolve) {
      var loader = $('.loader');
      var num = $('[data-loader-num]');
      if (!loader || !num) { resolve(); return; }
      var ready = false;
      var t0 = performance.now();
      var dur = 1500;
      var shown = 0;
      assetsReady().then(function () { ready = true; });
      // Never leave the cover up if frames stop arriving (for example in a background tab).
      setTimeout(function () { loader.classList.add('is-done'); resolve(); }, 7000);
      (function frame(now) {
        var t = clamp((now - t0) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        var target = ready ? eased * 100 : Math.min(eased * 100, 88);
        shown = lerp(shown, target, 0.22);
        if (target - shown < 0.6) shown = target;
        var n = Math.round(shown);
        num.textContent = (n < 10 ? '0' : '') + n;
        loader.style.setProperty('--lp', (shown / 100).toFixed(3));
        if (ready && t >= 1 && shown >= 99.5) {
          num.textContent = '100';
          loader.classList.add('is-done');
          setTimeout(resolve, 260);
          return;
        }
        requestAnimationFrame(frame);
      })(t0);
    });
  }

  function start() {
    root.classList.add('is-loaded');
    try { sessionStorage.setItem('ah-neon-intro', '1'); } catch (e) { /* storage unavailable */ }
    setTimeout(function () {
      // Entrance finished: hand the animated properties back to hover/scroll behaviour.
      root.classList.add('is-settled');
      $$('[data-intro]').forEach(function (el) { el.removeAttribute('data-intro'); });
      scheduleGlitch();
    }, 2800);
  }

  if (reduce || root.classList.contains('skip-intro')) {
    assetsReady().then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(start); });
    });
  } else {
    runLoader().then(start);
  }

  /* -------------------------------------------------------------- Glitch -- */

  function retrigger(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  var lines = $$('.hero__line');
  var figure = $('.hero__figure');

  lines.forEach(function (line) {
    line.addEventListener('animationend', function () { line.classList.remove('is-glitch'); });
    if (fine && !reduce) line.addEventListener('pointerenter', function () { retrigger(line, 'is-glitch'); });
  });
  if (figure) {
    figure.addEventListener('animationend', function (e) {
      if (e.animationName === 'slice-b') figure.classList.remove('is-glitch');
    });
  }

  function scheduleGlitch() {
    if (reduce || !lines.length) return;
    setTimeout(function () {
      if (!doc.hidden && window.scrollY < window.innerHeight * 0.6) {
        retrigger(lines[Math.floor(Math.random() * lines.length)], 'is-glitch');
        retrigger(figure, 'is-glitch');
      }
      scheduleGlitch();
    }, 3600 + Math.random() * 5200);
  }

  /* ------------------------------------------------------ Scroll reveals -- */

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');
        if (el.hasAttribute('data-scramble-in')) setTimeout(function () { scramble(el); }, 150);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------ Pointer state -- */

  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, nx: 0, ny: 0, seen: false, inside: 0 };
  var eased = { nx: 0, ny: 0, rx: mouse.x, ry: mouse.y, inside: 0 };

  var cursor = null;
  var cursorDot = null;
  var cursorRing = null;

  if (fine && !reduce) {
    cursor = doc.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<div class="cursor__ring"></div><div class="cursor__dot"></div>';
    doc.body.appendChild(cursor);
    cursorDot = $('.cursor__dot', cursor);
    cursorRing = $('.cursor__ring', cursor);

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.inside = 1;
      if (!mouse.seen) {
        mouse.seen = true;
        eased.rx = mouse.x;
        eased.ry = mouse.y;
        root.classList.add('has-cursor');
      }
    }, { passive: true });

    doc.addEventListener('mouseover', function (e) {
      var hit = e.target.closest ? e.target.closest('a, button, .illo') : null;
      cursor.classList.toggle('is-link', !!hit);
    });
    doc.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
    doc.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });
    doc.addEventListener('mouseleave', function () { mouse.inside = 0; root.classList.remove('has-cursor'); });
    doc.addEventListener('mouseenter', function () { if (mouse.seen) root.classList.add('has-cursor'); });
  }

  /* ------------------------------------------------------------ Magnetic -- */

  if (fine && !reduce) {
    $$('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.dataset.magnetic) || 0.28;
      var rect = null;
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var dx = e.clientX - (rect.left + rect.width / 2);
        var dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transition = 'transform 0.18s ease-out';
        el.style.transform = 'translate3d(' + (dx * strength).toFixed(1) + 'px,' + (dy * strength).toFixed(1) + 'px,0)';
      });
      el.addEventListener('pointerleave', function () {
        rect = null;
        el.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------- Glass bar and previews -- */

  var glass = $('.glass');
  if (glass && fine) {
    var shine = $('.glass__shine', glass);
    glass.addEventListener('pointermove', function (e) {
      var r = glass.getBoundingClientRect();
      shine.style.setProperty('--gx', (e.clientX - r.left).toFixed(0) + 'px');
      shine.style.setProperty('--gy', (e.clientY - r.top).toFixed(0) + 'px');
    });

    $$('.card', glass).forEach(function (card) {
      var pop = $('.pop', card);
      if (!pop) return;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var n = (e.clientX - r.left) / r.width - 0.5;
        var half = pop.offsetWidth / 2;
        var centre = r.left + r.width / 2;
        var left = rail ? rail.offsetWidth + 10 : 10;
        // Follow the pointer a little, but keep the preview inside the window.
        var min = left + half - centre;
        var max = window.innerWidth - 10 - half - centre;
        var ox = clamp(n * 56, Math.min(min, max), Math.max(min, max));
        pop.style.setProperty('--ox', ox.toFixed(1) + 'px');
        pop.style.setProperty('--or', (n * 5).toFixed(2) + 'deg');
      });
    });
  }

  /* ---------------------------------------------------- Illustration tilt -- */

  if (fine && !reduce) {
    $$('.illo').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg');
        el.style.setProperty('--lx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--ly', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------------------------------------------------------- Menu -- */

  var burger = $('.burger');
  var menu = $('.menu');

  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', String(open));
    if (menu) menu.setAttribute('aria-hidden', String(!open));
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 999) setMenu(false); });
  }

  /* ---------------------------------------------------- Page transitions -- */

  doc.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;

    if (a.dataset.themeTo) {
      try { localStorage.setItem('ah-theme', a.dataset.themeTo); } catch (err) { /* storage unavailable */ }
    }

    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url;
    try { url = new URL(a.href, window.location.href); } catch (err) { return; }
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    if (reduce || !curtain) return;

    e.preventDefault();
    setMenu(false);
    // Leaving for a classic (light) page: wipe to white so the hand-off is seamless.
    curtain.classList.toggle('curtain--light', url.pathname.indexOf('/neon/') === -1);
    root.classList.add('is-loaded', 'is-leaving');
    setTimeout(function () { window.location.href = a.href; }, 580);
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      root.classList.remove('is-leaving');
      if (curtain) curtain.classList.remove('curtain--light');
    }
  });

  /* ---------------------------------------------------------- WebGL fog -- */

  function initFog(canvas) {
    var gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    } catch (e) { gl = null; }
    if (!gl) return null;

    var vsSrc = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
    var fsSrc = [
      'precision mediump float;',
      'uniform vec2 r;uniform float t;uniform vec2 m;uniform float h;uniform float s;uniform vec2 c;uniform float a;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);',
      'return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.0;float w=0.5;for(int i=0;i<5;i++){v+=w*noise(p);p=p*2.02+vec2(1.7,9.2);w*=0.5;}return v;}',
      'void main(){',
      'vec2 uv=gl_FragCoord.xy/r;',
      'vec2 p=(gl_FragCoord.xy-0.5*r)/r.y;',
      'float tt=t*0.045;',
      'vec2 q=vec2(fbm(p*1.5+vec2(0.0,tt)),fbm(p*1.5+vec2(5.2,-tt*0.8)+1.3));',
      'float f=fbm(p*1.9+q*1.6+vec2(tt*0.5,-tt));',
      'vec2 cp=p-vec2(c.x,c.y+s*0.6);cp.x*=0.8;',
      'float core=exp(-dot(cp,cp)*4.4);',
      'vec3 col=vec3(0.0235,0.0196,0.0392);',
      'col+=vec3(0.83,0.22,0.39)*core*(0.05+0.42*f)*a;',
      'col+=vec3(0.97,0.19,0.36)*pow(f,3.0)*core*0.55*a;',
      'float low=exp(-pow(uv.y*2.6,2.0));',
      'col+=vec3(0.47,0.16,0.55)*low*(0.04+0.2*f)*(0.6+s*0.9);',
      'float md=length(p-m);',
      'col+=vec3(0.97,0.19,0.36)*exp(-md*md*9.0)*(0.04+0.2*f)*h;',
      'col*=mix(1.0,smoothstep(1.4,0.3,length(p*vec2(0.72,1.0))),0.7);',
      'col+=(hash(gl_FragCoord.xy+fract(t)*91.0)-0.5)*0.008;',
      'gl_FragColor=vec4(col,1.0);}'
    ].join('\n');

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    }
    var vs = compile(gl.VERTEX_SHADER, vsSrc);
    var fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var u = {};
    ['r', 't', 'm', 'h', 's', 'c', 'a'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

    var top = doc.body.getAttribute('data-fog') === 'top';
    gl.uniform2f(u.c, 0, top ? 0.4 : 0.07);
    gl.uniform1f(u.a, top ? 0.5 : 0.7);

    function resize() {
      // Half resolution is plenty for soft fog and keeps the fill rate low.
      var w = Math.max(2, Math.round(Math.min(window.innerWidth, 1920) * 0.5));
      var hgt = Math.max(2, Math.round(Math.min(window.innerHeight, 1200) * 0.5));
      canvas.width = w;
      canvas.height = hgt;
      gl.viewport(0, 0, w, hgt);
      gl.uniform2f(u.r, w, hgt);
    }
    resize();

    return {
      resize: resize,
      render: function (time, mx, my, inside, scroll) {
        gl.uniform1f(u.t, time);
        gl.uniform2f(u.m, mx, my);
        gl.uniform1f(u.h, inside);
        gl.uniform1f(u.s, scroll);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
  }

  /* -------------------------------------------------------------- Embers -- */

  function initEmbers(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = 0;
    var hgt = 0;
    var parts = [];

    var sprite = doc.createElement('canvas');
    sprite.width = sprite.height = 64;
    var sctx = sprite.getContext('2d');
    var grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,210,225,1)');
    grad.addColorStop(0.18, 'rgba(248,48,92,0.9)');
    grad.addColorStop(0.5, 'rgba(248,48,92,0.22)');
    grad.addColorStop(1, 'rgba(248,48,92,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    function spawn(p, anywhere) {
      p.x = Math.random() * w;
      p.y = anywhere ? Math.random() * hgt : hgt + 20;
      p.size = 3 + Math.random() * 9;
      p.vy = 0.12 + Math.random() * 0.4;
      p.vx = (Math.random() - 0.5) * 0.16;
      p.phase = Math.random() * 6.28;
      p.depth = 0.3 + Math.random() * 0.7;
      return p;
    }

    function resize() {
      w = window.innerWidth;
      hgt = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(hgt * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(clamp((w * hgt) / 26000, 16, 56));
      parts.length = 0;
      for (var i = 0; i < count; i++) parts.push(spawn({}, true));
    }
    resize();

    return {
      resize: resize,
      render: function (time, nx, ny) {
        ctx.clearRect(0, 0, w, hgt);
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.y -= p.vy;
          p.x += p.vx + Math.sin(time * 0.6 + p.phase) * 0.12;
          if (p.y < -24 || p.x < -24 || p.x > w + 24) spawn(p, false);
          var flicker = 0.45 + 0.55 * Math.sin(time * 1.7 + p.phase * 3.0);
          ctx.globalAlpha = clamp(0.1 + flicker * 0.5 * p.depth, 0, 1);
          var sz = p.size * p.depth;
          ctx.drawImage(sprite, p.x - nx * 18 * p.depth - sz / 2, p.y - ny * 12 * p.depth - sz / 2, sz, sz);
        }
        ctx.globalAlpha = 1;
      }
    };
  }

  var fogCanvas = $('.fx__fog');
  var emberCanvas = $('.fx__embers');
  var fog = (!reduce && fogCanvas) ? initFog(fogCanvas) : null;
  var embers = (!reduce && emberCanvas) ? initEmbers(emberCanvas) : null;
  if (fog) fogCanvas.classList.add('is-on');
  else if (fogCanvas) fogCanvas.style.display = 'none';

  /* ------------------------------------------------- Scroll-driven values -- */

  var scrollDirty = true;
  var lastY = window.scrollY;
  var scrollDir = 0;
  var scrollAnchor = lastY;
  var heroH = hero ? hero.offsetHeight : 1;
  var progress = 0;

  function applyScroll() {
    var y = window.scrollY;
    var max = Math.max(1, root.scrollHeight - window.innerHeight);
    progress = clamp(y / max, 0, 1);
    if (hero && !reduce) hero.style.setProperty('--sy', clamp(y / (heroH * 0.9), 0, 1).toFixed(4));
    if (rail) rail.style.setProperty('--p', progress.toFixed(4));
    if (fx && !reduce) fx.style.setProperty('--grid-y', (-((y * 0.14) % 48)).toFixed(1) + 'px');
    if (header) {
      header.classList.toggle('is-stuck', y > 24);
      // Measure from where the scroll direction last changed, so slow smooth scrolling still counts.
      var dir = y > lastY ? 1 : (y < lastY ? -1 : scrollDir);
      if (dir !== scrollDir) { scrollDir = dir; scrollAnchor = lastY; }
      if (!root.classList.contains('menu-open')) {
        if (y <= 260 || (scrollDir < 0 && scrollAnchor - y > 24)) header.classList.remove('is-hidden');
        else if (scrollDir > 0 && y - scrollAnchor > 48) header.classList.add('is-hidden');
      }
    }
    lastY = y;
  }

  window.addEventListener('scroll', function () { scrollDirty = true; }, { passive: true });
  window.addEventListener('resize', function () {
    heroH = hero ? hero.offsetHeight : 1;
    scrollDirty = true;
    if (fog) fog.resize();
    if (embers) embers.resize();
  });

  /* ------------------------------------------------------------ Main loop -- */

  var gridY = 0;
  function tick(now) {
    var time = now / 1000;

    if (scrollDirty) { scrollDirty = false; applyScroll(); }

    if (fine && !reduce) {
      eased.nx = lerp(eased.nx, mouse.nx, 0.06);
      eased.ny = lerp(eased.ny, mouse.ny, 0.06);
      eased.inside = lerp(eased.inside, mouse.inside, 0.05);
      if (hero) {
        hero.style.setProperty('--px', eased.nx.toFixed(4));
        hero.style.setProperty('--py', eased.ny.toFixed(4));
      }
      if (fx && mouse.seen) {
        gridY = parseFloat(fx.style.getPropertyValue('--grid-y')) || 0;
        fx.style.setProperty('--cx', mouse.x.toFixed(0) + 'px');
        fx.style.setProperty('--cy', (mouse.y + 96 - gridY).toFixed(0) + 'px');
      }
      if (cursor) {
        eased.rx = lerp(eased.rx, mouse.x, 0.17);
        eased.ry = lerp(eased.ry, mouse.y, 0.17);
        cursorDot.style.transform = 'translate3d(' + mouse.x + 'px,' + mouse.y + 'px,0)';
        cursorRing.style.transform = 'translate3d(' + eased.rx.toFixed(1) + 'px,' + eased.ry.toFixed(1) + 'px,0)';
      }
    }

    if (!doc.hidden) {
      if (fog) {
        var aspect = window.innerWidth / Math.max(1, window.innerHeight);
        fog.render(time, eased.nx * aspect * 0.5, -eased.ny * 0.5, eased.inside, progress);
      }
      if (embers) embers.render(time, eased.nx, eased.ny);
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
