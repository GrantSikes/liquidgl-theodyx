/*! theodyx-nav.js v2.0.2 (2026-09-02) — behaviours for the native glass nav (#thx-nav).
 * Adaptive tint (data-nav-tone sections + live backdrop luminance), scroll condense,
 * edge refraction (Chromium, capability + frame-budget gated), pointer lensing with a spring,
 * accessible mobile panel (focus trap, Escape, inert, iOS-safe scroll lock), skip link target,
 * legacy first-section clearance, conversion hooks. No dependencies. */
(function () {
  'use strict';
  if (window.__thxNav) return;
  var nav = document.getElementById('thx-nav');
  if (!nav) return;
  var API = window.__thxNav = { v: '2.0.2' };
  var doc = document.documentElement, body = document.body;
  var glass = nav.querySelector('.thx-nav-glass');
  var burger = nav.querySelector('.thx-nav-burger');
  var panel = document.getElementById('thx-nav-panel');
  var feImg = document.getElementById('thx-refract-map');
  var mq = function (q) { try { return window.matchMedia(q); } catch (e) { return { matches: false, addEventListener: function () {} }; } };
  var mqMotion = mq('(prefers-reduced-motion: reduce)');
  var mqTrans = mq('(prefers-reduced-transparency: reduce)');
  var mqFine = mq('(hover: hover) and (pointer: fine)');
  var mqDesk = mq('(min-width: 900px)');
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var track = function (ev, step) { try { if (typeof window.__thxTrack === 'function') window.__thxTrack(ev, step); } catch (e) {} };

  /* ---------- 0. legacy hooks + current page ---------- */
  doc.classList.add('thx-has-nav');
  ['#theodyx-liquid-nav', '.header-wrapper'].forEach(function (s) {
    var l = document.querySelectorAll(s);
    for (var i = 0; i < l.length; i++) { l[i].style.setProperty('visibility', 'hidden', 'important'); l[i].style.setProperty('pointer-events', 'none', 'important'); }
  });
  var path = location.pathname.replace(/\/+$/, '') || '/';
  nav.querySelectorAll('a[href]').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h !== '/' && path.indexOf(h.replace(/\/+$/, '')) === 0) a.setAttribute('aria-current', 'page');
    a.addEventListener('click', function () { track('nav_click', (a.textContent || a.getAttribute('aria-label') || '').trim().toLowerCase().slice(0, 40)); });
  });

  /* ---------- 1. main landmark + skip link target ---------- */
  (function mainTarget() {
    if (document.getElementById('thx-main')) return;
    var m = document.querySelector('main');
    if (!m) {
      var first = null, n = body.firstElementChild;
      while (n) { if (!nav.contains(n) && n !== nav && !n.contains(nav) && !/^(SCRIPT|STYLE|LINK|NOSCRIPT|A|SVG|TEXTAREA)$/.test(n.tagName) && !n.classList.contains('thx-skip')) { first = n; break; } n = n.nextElementSibling; }
      m = first;
    }
    if (m) { if (!m.id) m.id = 'thx-main'; else { var a = document.querySelector('.thx-skip'); if (a) a.setAttribute('href', '#' + m.id); } if (!m.hasAttribute('tabindex')) m.setAttribute('tabindex', '-1'); }
  })();

  /* ---------- 2. first-section clearance (was nv2mount's inline bump) ---------- */
  (function clearance() {
    if (document.querySelector('.rebuild-root, .hero-v1, [data-thx-noclear]')) return;
    var sec = document.querySelector('.page-wrapper section, main section, body section, section');
    if (sec && sec.tagName === 'MAIN') sec = null; /* never pad the main wrapper itself (it is black on the thxo pages) */
    if (!sec) return;
    var r = sec.getBoundingClientRect();
    if (r.top + window.scrollY < 40 && !sec.hasAttribute('data-thx-cleared')) {
      var pt = parseFloat(getComputedStyle(sec).paddingTop) || 0;
      sec.style.setProperty('padding-top', 'calc(' + pt + 'px + var(--thx-nav-h, 56px) + var(--thx-nav-top, 12px) + 16px)');
      sec.setAttribute('data-thx-cleared', '1');
    }
  })();

  /* ---------- 3. scroll state ---------- */
  var supportsSDA = false;
  try { supportsSDA = CSS.supports('animation-timeline: scroll()'); } catch (e) {}
  if (supportsSDA && !mqMotion.matches) nav.classList.add('has-sda');
  var scrolled = null, ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || doc.scrollTop || 0;
    var s = y > 80;
    if (s !== scrolled) { scrolled = s; nav.classList.toggle('is-scrolled', s); }
    if (nav.getAttribute('data-open') !== 'true') retone();
  }
  var fallbackT = 0;
  function sched() { if (!ticking) { ticking = true; raf(onScroll); clearTimeout(fallbackT); fallbackT = setTimeout(function () { if (ticking) onScroll(); }, 140); } }
  window.addEventListener('scroll', sched, { passive: true });
  window.addEventListener('resize', sched, { passive: true });
  window.addEventListener('resize', function () { if (nav.getAttribute('data-open') === 'true' && panel && panel.firstElementChild) nav.style.setProperty('--thx-panel-h', panel.firstElementChild.offsetHeight + 'px'); }, { passive: true });

  /* ---------- 4. adaptive tone ---------- */
  var tone = nav.getAttribute('data-tone') === 'light' ? 'light' : 'dark';
  function lum(r, g, b) {
    var f = function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function parseBg(cs) {
    var m = (cs.backgroundColor || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var c = m[1].split(/[\s,\/]+/).map(parseFloat);
    var a = c.length > 3 ? c[3] : 1;
    return a >= 0.5 ? lum(c[0], c[1], c[2]) : null;
  }
  function effLum(el) {
    var node = el;
    while (node && node !== doc) {
      if (node.hasAttribute('data-nav-lum')) return parseFloat(node.getAttribute('data-nav-lum'));
      var tag = node.tagName;
      if (tag === 'VIDEO' || tag === 'CANVAS') return 0.12;
      var cs = getComputedStyle(node);
      if (tag === 'IMG' || (cs.backgroundImage && cs.backgroundImage !== 'none')) return 0.22;
      var L = parseBg(cs);
      if (L !== null) return L;
      node = node.parentElement;
    }
    var b = parseBg(getComputedStyle(body));
    if (b !== null) return b;
    var h = parseBg(getComputedStyle(doc));
    return h !== null ? h : 1;
  }
  function sampleTone() {
    var r = nav.getBoundingClientRect();
    var pts = [[r.left + r.width * 0.18, r.top + r.height * 0.5], [r.left + r.width * 0.5, r.bottom + 4], [r.left + r.width * 0.82, r.top + r.height * 0.5]];
    var forced = null, lums = [];
    for (var p = 0; p < pts.length; p++) {
      var x = Math.min(Math.max(pts[p][0], 0), window.innerWidth - 1), y = Math.min(Math.max(pts[p][1], 0), window.innerHeight - 1);
      var els = document.elementsFromPoint(x, y);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === nav || nav.contains(el) || el.contains(nav) || el.classList.contains('thx-skip')) continue;
        var tagged = el.closest('[data-nav-tone]');
        if (tagged) { forced = tagged.getAttribute('data-nav-tone'); break; }
        lums.push(effLum(el));
        break;
      }
      if (forced) break;
    }
    if (forced) return forced === 'light' ? 'light' : 'dark';
    if (!lums.length) return tone;
    var avg = lums.reduce(function (a, b) { return a + b; }, 0) / lums.length;
    if (tone === 'dark' && avg > 0.56) return 'light';
    if (tone === 'light' && avg < 0.40) return 'dark';
    return tone;
  }
  function retone() {
    var t;
    try { t = sampleTone(); } catch (e) { return; }
    if (t !== tone) { tone = t; nav.setAttribute('data-tone', t); nav.dispatchEvent(new CustomEvent('thx-nav-tone', { detail: t })); }
  }
  API.setTone = function (t) { tone = t === 'light' ? 'light' : 'dark'; nav.setAttribute('data-tone', tone); };
  API.retone = retone;
  window.addEventListener('thx-nav-retone', retone);
  document.addEventListener('DOMContentLoaded', retone);
  window.addEventListener('load', function () { retone(); setTimeout(retone, 600); setTimeout(retone, 2000); });
  retone(); sched();

  /* ---------- 5. edge refraction (Chromium only, gated) ---------- */
  var refractOK = false;
  try {
    refractOK = !!feImg && CSS.supports('backdrop-filter', 'url(#x) blur(1px)') && !mqMotion.matches && !mqTrans.matches && mqFine.matches && mqDesk.matches && (navigator.hardwareConcurrency || 8) >= 4 && (navigator.deviceMemory || 8) >= 4 && sessionStorage.getItem('thx-nav-norefract') !== '1';
  } catch (e) { refractOK = false; }
  var mapW = 0, mapH = 0;
  function buildMap() {
    if (!refractOK) return;
    var w = Math.round(nav.getBoundingClientRect().width), h = Math.round(glass.getBoundingClientRect().height);
    if (!w || !h || (w === mapW && h === mapH)) return;
    mapW = w; mapH = h;
    var cw = Math.min(w, 480), ch = Math.min(h, 96);
    var c = document.createElement('canvas'); c.width = cw; c.height = ch;
    var ctx = c.getContext('2d'); if (!ctx) { refractOK = false; return; }
    var img = ctx.createImageData(cw, ch), d = img.data;
    var sx = w / cw, sy = h / ch;
    var R = Math.min(h / 2, parseFloat(getComputedStyle(nav).borderTopLeftRadius) || h / 2);
    var band = Math.min(18, h * 0.34);
    for (var y = 0; y < ch; y++) {
      for (var x = 0; x < cw; x++) {
        var px = (x + 0.5) * sx, py = (y + 0.5) * sy;
        var cx = px - w / 2, cy = py - h / 2;
        var qx = Math.abs(cx) - (w / 2 - R), qy = Math.abs(cy) - (h / 2 - R);
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        var outside = Math.sqrt(ox * ox + oy * oy), inside = Math.min(Math.max(qx, qy), 0);
        var dist = R - (outside + inside);
        var nx = 0, ny = 0;
        if (qx > 0 || qy > 0) { var len = outside || 1; nx = (ox / len) * (cx < 0 ? -1 : 1); ny = (oy / len) * (cy < 0 ? -1 : 1); }
        else if (qx > qy) { nx = cx < 0 ? -1 : 1; } else { ny = cy < 0 ? -1 : 1; }
        var t = Math.max(0, 1 - dist / band); t = t * t * (3 - 2 * t);
        var i = (y * cw + x) * 4;
        d[i] = Math.round(128 + nx * t * 120); d[i + 1] = Math.round(128 + ny * t * 120); d[i + 2] = 128; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    var url = c.toDataURL('image/png');
    feImg.setAttribute('href', url);
    try { feImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url); } catch (e) {}
    feImg.setAttribute('width', w); feImg.setAttribute('height', h);
    nav.classList.add('is-refract');
  }
  function frameBudget() {
    if (!refractOK) return;
    var last = performance.now(), long = 0, n = 0, active = false, t0 = last;
    function onS() { active = true; }
    window.addEventListener('scroll', onS, { passive: true });
    (function loop(now) {
      var dt = now - last; last = now;
      if (active) { n++; if (dt > 34) long++; active = false; }
      if (now - t0 < 4000 && n < 90) return raf(loop);
      window.removeEventListener('scroll', onS);
      if (n >= 12 && long / n > 0.2) { refractOK = false; nav.classList.remove('is-refract'); try { sessionStorage.setItem('thx-nav-norefract', '1'); } catch (e) {} }
    })(last);
  }
  if (refractOK) { buildMap(); frameBudget(); window.addEventListener('resize', function () { raf(buildMap); }, { passive: true }); }

  /* ---------- 6. pointer lensing with a spring ---------- */
  var lens = { x: 0, y: 0, s: 1, vx: 0, vy: 0, vs: 0, tx: 0, ty: 0, ts: 1, on: false, running: false };
  function spring(v, target, vel, k, c, dt) { var f = -k * (v - target) - c * vel; vel += f * dt; v += vel * dt; return [v, vel]; }
  var lastT = 0;
  function lensLoop(now) {
    var dt = Math.min(0.032, (now - (lastT || now)) / 1000) || 0.016; lastT = now;
    var a = spring(lens.x, lens.tx, lens.vx, 170, 22, dt); lens.x = a[0]; lens.vx = a[1];
    var b = spring(lens.y, lens.ty, lens.vy, 170, 22, dt); lens.y = b[0]; lens.vy = b[1];
    var s = spring(lens.s, lens.ts, lens.vs, 200, 24, dt); lens.s = s[0]; lens.vs = s[1];
    glass.style.transform = 'translate3d(' + lens.x.toFixed(2) + 'px,' + lens.y.toFixed(2) + 'px,0) scale(' + lens.s.toFixed(4) + ')';
    var settled = Math.abs(lens.x - lens.tx) < 0.02 && Math.abs(lens.y - lens.ty) < 0.02 && Math.abs(lens.s - lens.ts) < 0.0005 && Math.abs(lens.vx) < 0.05 && Math.abs(lens.vy) < 0.05;
    if (!settled || lens.on) raf(lensLoop); else { lens.running = false; lastT = 0; glass.style.transform = ''; }
  }
  function kick() { if (!lens.running) { lens.running = true; lastT = 0; raf(lensLoop); } }
  if (mqFine.matches && !mqMotion.matches) {
    nav.addEventListener('pointermove', function (e) {
      if (nav.getAttribute('data-open') === 'true') return;
      var r = nav.getBoundingClientRect();
      var rx = (e.clientX - r.left) / r.width, ry = (e.clientY - r.top) / r.height;
      nav.style.setProperty('--thx-mx', (rx * 100).toFixed(1) + '%');
      nav.style.setProperty('--thx-my', (ry * 100).toFixed(1) + '%');
      lens.tx = (rx - 0.5) * 3.2; lens.ty = (ry - 0.5) * 2.4; lens.on = true;
      nav.classList.add('is-lens'); kick();
    });
    nav.addEventListener('pointerleave', function () { lens.tx = 0; lens.ty = 0; lens.ts = 1; lens.on = false; nav.classList.remove('is-lens'); kick(); });
    nav.addEventListener('pointerdown', function (e) { if (e.target.closest('a,button')) { lens.ts = 0.992; kick(); } });
    window.addEventListener('pointerup', function () { if (lens.ts !== 1) { lens.ts = 1; kick(); } }, { passive: true });
  }

  /* ---------- 7. mobile panel ---------- */
  var lockY = 0, lastFocus = null, inerted = [];
  function focusables() {
    var l = [burger].concat(Array.prototype.slice.call(panel.querySelectorAll('a[href],button:not([disabled])')));
    return l.filter(function (el) { return el && el.offsetParent !== null; });
  }
  function lock() {
    lockY = window.scrollY || 0;
    var sbw = window.innerWidth - doc.clientWidth;
    doc.style.setProperty('--thx-sbw', (sbw > 0 ? sbw : 0) + 'px');
    doc.classList.add('thx-nav-lock');
    body.style.top = -lockY + 'px'; body.style.position = 'fixed'; body.style.left = '0'; body.style.right = '0'; body.style.width = '100%';
  }
  function unlock() {
    doc.classList.remove('thx-nav-lock');
    body.style.position = ''; body.style.top = ''; body.style.left = ''; body.style.right = ''; body.style.width = '';
    doc.style.setProperty('--thx-sbw', '0px');
    window.scrollTo(0, lockY);
  }
  function setInert(on) {
    if (on) {
      inerted = [];
      var n = body.firstElementChild;
      while (n) { if (n !== nav && !nav.contains(n) && !n.contains(nav) && !n.classList.contains('thx-skip') && !/^(SCRIPT|STYLE|LINK)$/.test(n.tagName)) { if (!n.hasAttribute('inert')) { n.setAttribute('inert', ''); inerted.push(n); } } n = n.nextElementSibling; }
    } else { inerted.forEach(function (n) { n.removeAttribute('inert'); }); inerted = []; }
  }
  function open() {
    if (nav.getAttribute('data-open') === 'true') return;
    if (getComputedStyle(burger).display === 'none') return; /* desktop: panel is display:none, nothing to open */
    lastFocus = document.activeElement;
    var inner = panel.firstElementChild;
    nav.style.setProperty('--thx-panel-h', (inner ? inner.offsetHeight : panel.scrollHeight) + 'px');
    nav.setAttribute('data-open', 'true');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
    panel.removeAttribute('inert'); panel.setAttribute('aria-hidden', 'false');
    lens.tx = 0; lens.ty = 0; lens.on = false; nav.classList.remove('is-lens'); kick();
    lock(); setInert(true);
    var f = panel.querySelector('a[href]');
    setTimeout(function () { if (f) f.focus({ preventScroll: true }); }, 60);
    track('nav_menu_open');
  }
  function close(restore) {
    if (nav.getAttribute('data-open') !== 'true') return;
    nav.setAttribute('data-open', 'false');
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu');
    panel.setAttribute('inert', ''); panel.setAttribute('aria-hidden', 'true');
    setInert(false); unlock();
    if (restore !== false) { var t = (lastFocus && lastFocus !== body && lastFocus !== doc && document.contains(lastFocus)) ? lastFocus : burger; try { t.focus({ preventScroll: true }); } catch (e) {} }
    retone();
  }
  API.open = open; API.close = close;
  if (burger && panel) {
    burger.addEventListener('click', function () { nav.getAttribute('data-open') === 'true' ? close() : open(); });
    document.addEventListener('keydown', function (e) {
      if (nav.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab') {
        var f = focusables(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (!nav.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    panel.addEventListener('click', function (e) { if (e.target.closest('a[href]')) close(false); });
    document.addEventListener('pointerdown', function (e) { if (nav.getAttribute('data-open') === 'true' && !nav.contains(e.target)) close(); }, true);
    mqDesk.addEventListener && mqDesk.addEventListener('change', function (m) { if (m.matches) close(false); });
    window.addEventListener('pagehide', function () { close(false); });
  }

  /* ---------- 8. reduced-motion: pause autoplaying background video (WCAG 2.2.2) ---------- */
  function motionPref() {
    if (!mqMotion.matches) return;
    document.querySelectorAll('video[autoplay]').forEach(function (v) { try { v.pause(); v.removeAttribute('autoplay'); v.setAttribute('data-thx-motion-paused', '1'); } catch (e) {} });
  }
  motionPref(); mqMotion.addEventListener && mqMotion.addEventListener('change', motionPref);
  window.addEventListener('load', motionPref);
})();
