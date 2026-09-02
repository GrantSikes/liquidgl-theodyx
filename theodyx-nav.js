/*! theodyx-nav.js v3.0.1 (2026-09-02) — behaviours for the clear liquid-glass nav (#thx-nav).
 * Per-element ink (each word, the logo and the burger pick pure white or pure black from what is behind THEM),
 * edge lensing map + chromatic aberration (Chromium, capability + frame-budget gated), pointer highlight with a
 * spring, scroll condense, accessible mobile sheet (focus trap, Escape, inert, iOS-safe scroll lock), skip link
 * target, legacy first-section clearance, conversion hooks. No dependencies. */
(function () {
  'use strict';
  if (window.__thxNav) return;
  var nav = document.getElementById('thx-nav');
  if (!nav) return;
  var API = window.__thxNav = { v: '3.0.1' };
  var doc = document.documentElement, body = document.body;
  var glass = nav.querySelector('.thx-nav-glass');
  var rim = nav.querySelector('.thx-nav-rim');
  var burger = nav.querySelector('.thx-nav-burger');
  var logo = nav.querySelector('.thx-nav-logo');
  var panel = document.getElementById('thx-nav-panel');
  var mapImg = document.getElementById('thx-lens-map'), mapImgLite = document.getElementById('thx-lens-map-lite');
  var mq = function (q) { try { return window.matchMedia(q); } catch (e) { return { matches: false, addEventListener: function () {} }; } };
  var mqMotion = mq('(prefers-reduced-motion: reduce)');
  var mqTrans = mq('(prefers-reduced-transparency: reduce)');
  var mqFine = mq('(hover: hover) and (pointer: fine)');
  var mqDesk = mq('(min-width: 900px)');
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };
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

  /* ---------- 2. first-section clearance — OPT-IN only ([data-thx-clear]); a JS padding bump is a layout shift, so pages clear the nav in CSS ---------- */
  (function clearance() {
    var sec = document.querySelector('[data-thx-clear]');
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
    if (nav.getAttribute('data-open') !== 'true') reink();
  }
  var fallbackT = 0;
  function sched() { if (!ticking) { ticking = true; raf(onScroll); clearTimeout(fallbackT); fallbackT = setTimeout(function () { if (ticking) onScroll(); }, 140); } }
  window.addEventListener('scroll', sched, { passive: true });
  window.addEventListener('resize', sched, { passive: true });
  window.addEventListener('resize', function () { if (nav.getAttribute('data-open') === 'true' && panel && panel.firstElementChild) nav.style.setProperty('--thx-panel-h', panel.firstElementChild.offsetHeight + 'px'); }, { passive: true });

  /* ---------- 4. per-element ink (white or black, from what is behind each element) ---------- */
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(r, g, b) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
  function parseBg(cs) {
    var m = (cs.backgroundColor || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var c = m[1].split(/[\s,\/]+/).map(parseFloat);
    var a = c.length > 3 ? c[3] : 1;
    return a >= 0.5 ? lum(c[0], c[1], c[2]) : null;
  }
  var MEDIA = /^(VIDEO|IMG|CANVAS|PICTURE)$/;
  var sampler = document.createElement('canvas'); sampler.width = 24; sampler.height = 6;
  var sctx = null; try { sctx = sampler.getContext('2d', { willReadFrequently: true }); } catch (e) { sctx = null; }
  var corsImgs = {};   /* src -> Image (CORS clone) */
  var tickCache = null; /* per-tick memo: element -> stats */
  function readPixels() {
    var px = sctx.getImageData(0, 0, 24, 6).data, n = 0, s = 0, s2 = 0;
    for (var i = 0; i < px.length; i += 4) { var L = lum(px[i], px[i + 1], px[i + 2]); s += L; s2 += L * L; n++; }
    var mean = s / n, sd = Math.sqrt(Math.max(0, s2 / n - mean * mean));
    return { L: mean, sd: sd };
  }
  function drawRegion(src, iw, ih, mr, r, fit) {
    /* map the ink element's rect (r) into the media's intrinsic pixels, honouring object-fit: cover (default) / contain */
    if (!iw || !ih || !mr.width || !mr.height) return false;
    var scale = fit === 'contain' ? Math.min(mr.width / iw, mr.height / ih) : Math.max(mr.width / iw, mr.height / ih);
    var rw = iw * scale, rh = ih * scale, ox = (mr.width - rw) / 2, oy = (mr.height - rh) / 2;
    var sx = (r.left - mr.left - ox) / scale, sy = (r.top - mr.top - oy) / scale, sw = r.width / scale, sh = r.height / scale;
    if (sx < 0) { sw += sx; sx = 0; } if (sy < 0) { sh += sy; sy = 0; }
    sw = Math.min(sw, iw - sx); sh = Math.min(sh, ih - sy);
    if (sw < 1 || sh < 1) return false;
    sctx.drawImage(src, sx, sy, sw, sh, 0, 0, 24, 6);
    return true;
  }
  function mediaStats(el, r) {
    if (!sctx || el.__thxTainted) return null;
    var tag = el.tagName;
    if (tag === 'PICTURE') { el = el.querySelector('img'); if (!el) return null; tag = 'IMG'; }
    var mr = el.getBoundingClientRect(), fit = (getComputedStyle(el).objectFit || 'fill');
    try {
      if (tag === 'VIDEO') {
        if (el.readyState >= 2 && !el.__thxVideoTainted) {
          try { if (!drawRegion(el, el.videoWidth, el.videoHeight, mr, r, fit)) return null; return readPixels(); }
          catch (e) { el.__thxVideoTainted = true; }
        }
        /* frames unavailable (no CORS on the media, or not loaded yet): use the poster as a stand-in for the scene */
        var ps = el.poster || el.getAttribute('poster'); if (!ps) return null;
        var pim = corsImgs[ps];
        if (!pim) { pim = new Image(); pim.crossOrigin = 'anonymous'; pim.decoding = 'async'; pim.src = ps; corsImgs[ps] = pim; pim.onload = function () { reink(); }; pim.onerror = function () { pim.__thxFail = true; }; }
        if (pim.__thxFail || !pim.complete || !pim.naturalWidth) return null;
        try { if (!drawRegion(pim, pim.naturalWidth, pim.naturalHeight, mr, r, fit)) return null; var st = readPixels(); st.sd = Math.max(st.sd, 0.12); return st; } catch (e) { return null; }
      }
      if (tag === 'CANVAS') {
        if (!drawRegion(el, el.width, el.height, mr, r, fit)) return null;
        return readPixels();
      }
      if (tag === 'IMG') {
        var src = el.currentSrc || el.src; if (!src) return null;
        var im = el;
        if (!el.crossOrigin && new URL(src, location.href).origin !== location.origin) {
          im = corsImgs[src];
          if (!im) { im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async'; im.src = src; corsImgs[src] = im; im.onload = function () { reink(); }; im.onerror = function () { im.__thxFail = true; }; }
          if (im.__thxFail || !im.complete || !im.naturalWidth) return null;
        } else if (!el.complete || !el.naturalWidth) return null;
        if (!drawRegion(im, im.naturalWidth, im.naturalHeight, mr, r, fit)) return null;
        return readPixels();
      }
    } catch (e) { el.__thxTainted = true; }
    return null;
  }
  function bgStats(el, cs, bgi, r) {
    if (!sctx || el.__thxTainted) return null;
    var m = bgi.match(/url\((['"]?)(.*?)\1\)/); if (!m) return null;
    var src = m[2]; var im = corsImgs[src];
    if (!im) { im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async'; im.src = src; corsImgs[src] = im; im.onload = function () { reink(); }; im.onerror = function () { im.__thxFail = true; }; }
    if (im.__thxFail || !im.complete || !im.naturalWidth) return null;
    var key = Math.round(r.left) + ':' + Math.round(r.width);
    var per = tickCache.get(el); if (!per) { per = {}; tickCache.set(el, per); }
    if (key in per) return per[key];
    var st = null;
    try { var fit = /contain/.test(cs.backgroundSize) ? 'contain' : 'cover'; if (drawRegion(im, im.naturalWidth, im.naturalHeight, el.getBoundingClientRect(), r, fit)) st = readPixels(); } catch (e) { el.__thxTainted = true; }
    per[key] = st; return st;
  }
  var gcan = document.createElement('canvas'); var gctx = null; try { gctx = gcan.getContext('2d', { willReadFrequently: true }); } catch (e) { gctx = null; }
  function glyphCoverage(el, r) {
    /* rasterise the characters of `el` that overlap the ink rect r (same font, size, weight) and return the fraction of r they cover */
    if (!gctx) return 0;
    try {
      var cs = getComputedStyle(el);
      var node0 = null, i0 = 0, i1 = 0;
      var ys = r.top + r.height / 2;
      var pick = function (x) { if (document.caretPositionFromPoint) { var cp = document.caretPositionFromPoint(x, ys); return cp ? [cp.offsetNode, cp.offset] : null; } if (document.caretRangeFromPoint) { var cr = document.caretRangeFromPoint(x, ys); return cr ? [cr.startContainer, cr.startOffset] : null; } return null; };
      var A = pick(r.left + 1), B = pick(r.right - 1);
      if (!A || A[0].nodeType !== 3 || !el.contains(A[0])) return 0;
      node0 = A[0]; i0 = Math.max(0, A[1] - 1);
      i1 = (B && B[0] === node0) ? Math.min(node0.data.length, B[1] + 1) : Math.min(node0.data.length, i0 + 24);
      if (i1 <= i0) return 0;
      var k = 4; var cw = Math.max(8, Math.round(r.width / k)), ch = Math.max(4, Math.round(r.height / k));
      gcan.width = cw; gcan.height = ch; gctx.clearRect(0, 0, cw, ch);
      gctx.fillStyle = '#000'; gctx.textBaseline = 'alphabetic';
      gctx.font = (cs.fontStyle || 'normal') + ' ' + (cs.fontWeight || 400) + ' ' + (parseFloat(cs.fontSize) / k) + 'px ' + cs.fontFamily;
      var drew = 0;
      for (var i = i0; i < i1; i++) {
        var chr = node0.data.charAt(i); if (!chr || /\s/.test(chr)) continue;
        var rg = document.createRange(); rg.setStart(node0, i); rg.setEnd(node0, i + 1);
        var q = rg.getBoundingClientRect(); if (!q.width) continue;
        if (q.right < r.left || q.left > r.right || q.bottom < r.top || q.top > r.bottom) continue;
        /* the char box is the line box; put the baseline at ~80% of the em box height below the box top plus half-leading */
        var fs = parseFloat(cs.fontSize) || 16, lead = Math.max(0, (q.height - fs) / 2);
        gctx.fillText(chr, (q.left - r.left) / k, (q.top - r.top + lead + fs * 0.8) / k); drew++;
      }
      if (!drew) return 0;
      var d = gctx.getImageData(0, 0, cw, ch).data, on = 0, n = cw * ch;
      for (var j = 3; j < d.length; j += 4) if (d[j] > 90) on++;
      return on / n;
    } catch (e) { return 0; }
  }
  function gradientLum(bgi, el, x, y) {
    /* luminance of a CSS gradient at the point: linear gradients are evaluated along their axis; others use the stop average */
    var cols = []; var re = /(rgba?\([^)]+\))(?:\s+([\d.]+)%)?/g, mm;
    while ((mm = re.exec(bgi))) { var c = mm[1].match(/rgba?\(([^)]+)\)/)[1].split(/[\s,\/]+/).map(parseFloat); var a = c.length > 3 ? c[3] : 1; if (a < 0.3) continue; cols.push({ L: lum(c[0], c[1], c[2]), p: mm[2] !== undefined ? parseFloat(mm[2]) / 100 : null }); }
    if (!cols.length) return null;
    for (var i = 0; i < cols.length; i++) if (cols[i].p === null) cols[i].p = cols.length === 1 ? 0 : i / (cols.length - 1);
    var lin = bgi.indexOf('linear-gradient(') !== -1 && el && x !== undefined;
    if (!lin) { var s = 0; for (var j = 0; j < cols.length; j++) s += cols[j].L; return s / cols.length; }
    var r = el.getBoundingClientRect(); if (!r.width || !r.height) return cols[0].L;
    var ang = 180; var am = bgi.match(/linear-gradient\(\s*(-?[\d.]+)deg/); var tm = bgi.match(/linear-gradient\(\s*to ([a-z ]+)/);
    if (am) ang = parseFloat(am[1]); else if (tm) { var dirs = { 'top': 0, 'right': 90, 'bottom': 180, 'left': 270, 'top right': 45, 'right top': 45, 'bottom right': 135, 'right bottom': 135, 'bottom left': 225, 'left bottom': 225, 'top left': 315, 'left top': 315 }; ang = dirs[tm[1].trim()] !== undefined ? dirs[tm[1].trim()] : 180; }
    var th = ang * Math.PI / 180, dx = Math.sin(th), dy = -Math.cos(th);
    var len = Math.abs(r.width * dx) + Math.abs(r.height * dy);
    var px = (x - (r.left + r.width / 2)) * dx + (y - (r.top + r.height / 2)) * dy;
    var t = Math.min(1, Math.max(0, px / len + 0.5));
    for (var k = 1; k < cols.length; k++) { if (t <= cols[k].p) { var a0 = cols[k - 1], b0 = cols[k]; var u = (b0.p === a0.p) ? 0 : (t - a0.p) / (b0.p - a0.p); return a0.L + (b0.L - a0.L) * u; } }
    return cols[cols.length - 1].L;
  }
  function chainLum(el, x, y) {
    var node = el;
    while (node && node !== doc) {
      if (node.hasAttribute('data-nav-lum')) return parseFloat(node.getAttribute('data-nav-lum'));
      var cs = getComputedStyle(node);
      var L = parseBg(cs);
      if (L !== null) return L;
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        if (cs.backgroundImage.indexOf('gradient') !== -1) { var gl = gradientLum(cs.backgroundImage, node, arguments[1], arguments[2]); if (gl !== null) return gl; }
        else return 0.22;
      }
      node = node.parentElement;
    }
    var b = parseBg(getComputedStyle(body)); if (b !== null) return b;
    var h = parseBg(getComputedStyle(doc)); return h !== null ? h : 1;
  }
  function pointStats(x, y, r) {
    x = Math.min(Math.max(x, 0), window.innerWidth - 1); y = Math.min(Math.max(y, 0), window.innerHeight - 1);
    var els = document.elementsFromPoint(x, y);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el === nav || nav.contains(el) || el.contains(nav) || el.classList.contains('thx-skip')) continue;
      var tagged = el.closest('[data-nav-tone]');
      if (tagged) return { forced: tagged.getAttribute('data-nav-tone') };
      if (MEDIA.test(el.tagName)) {
        var key = Math.round(r.left) + ':' + Math.round(r.width);
        var per = tickCache.get(el); if (!per) { per = {}; tickCache.set(el, per); }
        if (!(key in per)) per[key] = mediaStats(el, r);
        var st = per[key];
        if (st) return { L: st.L, sd: st.sd, media: true };
        var cs = getComputedStyle(el); var pb = parseBg(cs);
        return { L: el.hasAttribute('data-nav-lum') ? parseFloat(el.getAttribute('data-nav-lum')) : (pb !== null ? pb : 0.2), sd: 0.25, media: true };
      }
      var cs2 = getComputedStyle(el);
      var bgi = cs2.backgroundImage && cs2.backgroundImage !== 'none' ? cs2.backgroundImage : '';
      if (bgi && bgi.indexOf('url(') === 0 && parseBg(cs2) === null) {
        var st2 = bgStats(el, cs2, bgi, r);
        if (st2) return { L: st2.L, sd: st2.sd, media: true };
        return { L: 0.22, sd: 0.25, media: true };
      }
      if (parseBg(cs2) === null && !bgi && el.tagName !== 'BODY' && el.tagName !== 'HTML' && !(el.textContent || '').trim()) continue; /* transparent wrappers: look deeper */
      var Lbg = chainLum(el, x, y);
      if (parseBg(cs2) === null && (el.textContent || '').trim()) {
        /* text under the nav: rasterise the letters that overlap this element's box and blend by their real coverage */
        var per2 = tickCache.get(el); if (!per2) { per2 = {}; tickCache.set(el, per2); }
        var gk = 'g' + Math.round(r.left) + ':' + Math.round(r.width);
        if (!(gk in per2)) per2[gk] = glyphCoverage(el, r);
        var g = per2[gk];
        if (g > 0.01) {
          var tm = (cs2.color || '').match(/rgba?\(([^)]+)\)/);
          if (tm) { var tc = tm[1].split(/[\s,\/]+/).map(parseFloat); var Lt = lum(tc[0], tc[1], tc[2]); return { L: Lt * g + Lbg * (1 - g), sd: Math.abs(Lt - Lbg) * Math.min(1, g * 2), media: false }; }
        }
      }
      return { L: Lbg, sd: 0, media: false };
    }
    return { L: chainLum(body), sd: 0, media: false };
  }
  var inkEls = [];
  if (logo) inkEls.push(logo);
  nav.querySelectorAll('.thx-nav-menu a').forEach(function (a) { inkEls.push(a); });
  if (burger) inkEls.push(burger);
  var inkState = inkEls.map(function (el) { return { el: el, ink: 'light', mixed: false, t: 0, L: null }; });
  var tone = 'dark', anyMedia = false, lastTickMs = 0, inkTimer = 0, inkInterval = 450;
  function contrast(L, ink) { return ink === 'light' ? 1.05 / (L + 0.05) : (L + 0.05) / 0.05; }
  function decide(cur, L, tNow, since) {
    L = Math.min(1, L * 1.3 + 0.01);           /* calibrated against rendered pixels through the glass: sampler underreads ~12% and the glass lifts the backdrop ~15% */
    var cw = 1.05 / (L + 0.05), cb = (L + 0.05) / 0.05;
    var want = cb > cw ? 'dark' : 'light';
    if (want === cur) return cur;
    var better = want === 'dark' ? cb / cw : cw / cb;
    if (better < 1.15) return cur;             /* hysteresis */
    if (tNow - since < 300) return cur;        /* dwell */
    return want;
  }
  function reink() {
    if (nav.getAttribute('data-open') === 'true') return;
    var t0 = now();
    tickCache = new Map(); anyMedia = false;
    var pe = nav.style.pointerEvents; nav.style.pointerEvents = 'none'; /* hit-testing (caret + elementsFromPoint) must see through the nav */
    try { reinkInner(t0); } finally { nav.style.pointerEvents = pe; }
  }
  function reinkInner(t0) {
    var sumL = 0, n = 0;
    for (var i = 0; i < inkState.length; i++) {
      var s = inkState[i], el = s.el;
      if (!el.offsetParent) continue;
      var r = el.getBoundingClientRect(); if (!r.width) continue;
      var pts = [[0.15, 0.18], [0.5, 0.18], [0.85, 0.18], [0.15, 0.5], [0.5, 0.5], [0.85, 0.5], [0.15, 0.84], [0.5, 0.84], [0.85, 0.84]];
      var Ls = [], sds = [], forced = null;
      for (var p = 0; p < pts.length; p++) {
        var st; try { st = pointStats(r.left + r.width * pts[p][0], r.top + r.height * pts[p][1], r); } catch (e) { st = null; }
        if (!st) continue;
        if (st.forced) { forced = st.forced; break; }
        Ls.push(st.L); sds.push(st.sd || 0); if (st.media) anyMedia = true;
      }
      var ink, L, mixed = false;
      if (forced) { ink = forced === 'light' ? 'dark' : 'light'; L = forced === 'light' ? 1 : 0; }
      else if (!Ls.length) { ink = s.ink; L = s.L === null ? 0.2 : s.L; }
      else {
        L = Ls.reduce(function (a, b) { return a + b; }, 0) / Ls.length;
        var spread = Math.max.apply(null, Ls) - Math.min.apply(null, Ls);
        var sd = sds.reduce(function (a, b) { return a + b; }, 0) / sds.length;
        mixed = spread > 0.3 || sd > 0.2;
        ink = decide(s.ink, L, t0, s.t);
        if (mixed && contrast(Math.min(1, L * 1.3 + 0.01), ink) < 3) { var Le = Math.min(1, L * 1.3 + 0.01); ink = contrast(Le, 'dark') > contrast(Le, 'light') ? 'dark' : 'light'; }
      }
      if (ink !== s.ink) { s.ink = ink; s.t = t0; el.setAttribute('data-ink', ink); }
      else if (!el.hasAttribute('data-ink')) el.setAttribute('data-ink', ink);
      if (mixed !== s.mixed) { s.mixed = mixed; if (mixed) el.setAttribute('data-ink-mixed', '1'); else el.removeAttribute('data-ink-mixed'); }
      s.L = L; sumL += L; n++;
    }
    if (n) {
      var avg = sumL / n, t = tone;
      if (tone === 'dark' && avg > 0.56) t = 'light';
      if (tone === 'light' && avg < 0.40) t = 'dark';
      if (t !== tone) { tone = t; nav.setAttribute('data-tone', t); nav.dispatchEvent(new CustomEvent('thx-nav-tone', { detail: t })); }
    }
    lastTickMs = now() - t0;
    tickCache = null;
    schedMedia();
  }
  function schedMedia() {
    clearTimeout(inkTimer);
    if (!anyMedia || document.hidden) return;
    inkInterval = lastTickMs > 4 ? Math.min(1500, inkInterval * 1.5) : Math.max(450, inkInterval * 0.8);
    inkTimer = setTimeout(reink, inkInterval);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) reink(); });
  API.reink = reink; API.retone = reink;
  API.inks = function () { return inkState.map(function (s) { return { text: (s.el.textContent || s.el.getAttribute('aria-label') || '').trim().slice(0, 24), ink: s.ink, L: s.L, mixed: s.mixed }; }); };
  API.tickMs = function () { return lastTickMs; };
  API.debugPoint = function (x, y, w) { tickCache = new Map(); var pe = nav.style.pointerEvents; nav.style.pointerEvents = 'none'; var r = { left: x - (w || 60) / 2, top: y - 8, width: w || 60, height: 16, right: x + (w || 60) / 2, bottom: y + 8 }; var st; try { st = pointStats(x, y, r); } finally { nav.style.pointerEvents = pe; } tickCache = null; return st; };
  API.setTone = function (t) { tone = t === 'light' ? 'light' : 'dark'; nav.setAttribute('data-tone', tone); };
  window.addEventListener('thx-nav-retone', reink);
  document.addEventListener('DOMContentLoaded', reink);
  window.addEventListener('load', function () { reink(); setTimeout(reink, 600); setTimeout(reink, 2000); });
  document.querySelectorAll('video').forEach(function (v) { v.addEventListener('loadeddata', reink, { once: true }); v.addEventListener('play', reink); });
  reink(); sched();

  /* ---------- 5. edge lensing (Chromium only; capability + frame-budget gated) ---------- */
  var refractOK = false, lite = false;
  try {
    var isBlink = !!(navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(function (b) { return /Chromium/i.test(b.brand); })) || (/Chrome\/|Chromium\//.test(navigator.userAgent) && !/\bEdgiOS\b/.test(navigator.userAgent));
    refractOK = !!mapImg && isBlink && CSS.supports('backdrop-filter', 'url(#x) blur(1px)') && !mqMotion.matches && !mqTrans.matches && (navigator.hardwareConcurrency || 8) >= 4 && (navigator.deviceMemory || 8) >= 4 && sessionStorage.getItem('thx-nav-norefract') !== '1';
    lite = !mqDesk.matches || !mqFine.matches || (navigator.hardwareConcurrency || 8) < 8;
  } catch (e) { refractOK = false; }
  var mapW = 0, mapH = 0;
  function buildMap() {
    if (!refractOK) return;
    var w = Math.round(nav.getBoundingClientRect().width), h = Math.round(glass.getBoundingClientRect().height);
    if (!w || !h || (w === mapW && h === mapH)) return;
    mapW = w; mapH = h;
    var cw = Math.min(w, 720), ch = Math.min(h, 112);
    var c = document.createElement('canvas'); c.width = cw; c.height = ch;
    var ctx = c.getContext('2d'); if (!ctx) { refractOK = false; return; }
    var img = ctx.createImageData(cw, ch), d = img.data;
    var sx = w / cw, sy = h / ch;
    var R = Math.min(h / 2, parseFloat(getComputedStyle(nav).borderTopLeftRadius) || h / 2);
    var bevel = Math.min(18, Math.max(12, h * 0.30));   /* flat clear centre; the lens lives in the outer ~16px */
    for (var y = 0; y < ch; y++) {
      for (var x = 0; x < cw; x++) {
        var px = (x + 0.5) * sx, py = (y + 0.5) * sy;
        var cx = px - w / 2, cy = py - h / 2;
        var qx = Math.abs(cx) - (w / 2 - R), qy = Math.abs(cy) - (h / 2 - R);
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        var outside = Math.sqrt(ox * ox + oy * oy), inside = Math.min(Math.max(qx, qy), 0);
        var dist = R - (outside + inside);            /* distance to the rounded edge, positive inside */
        var nx = 0, ny = 0;
        if (qx > 0 || qy > 0) { var len = outside || 1; nx = (ox / len) * (cx < 0 ? -1 : 1); ny = (oy / len) * (cy < 0 ? -1 : 1); }
        else if (qx > qy) { nx = cx < 0 ? -1 : 1; } else { ny = cy < 0 ? -1 : 1; }
        var t = Math.max(0, Math.min(1, 1 - dist / bevel));
        t = t * t * (3 - 2 * t); t = Math.pow(t, 1.5);     /* lens profile: flat centre, steep bevel */
        var i = (y * cw + x) * 4;
        d[i] = Math.round(128 + nx * t * 127); d[i + 1] = Math.round(128 + ny * t * 127); d[i + 2] = 128; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    var url = c.toDataURL('image/png');
    [mapImg, mapImgLite].forEach(function (fe) {
      if (!fe) return;
      fe.setAttribute('href', url);
      try { fe.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url); } catch (e) {}
      fe.setAttribute('width', w); fe.setAttribute('height', h);
    });
    nav.classList.add('is-refract'); nav.classList.toggle('is-lite', lite);
  }
  function frameBudget() {
    if (!refractOK) return;
    var last = now(), long = 0, n = 0, active = false, t0 = last;
    function onS() { active = true; }
    window.addEventListener('scroll', onS, { passive: true });
    (function loop(t) {
      var dt = t - last; last = t;
      if (active) { n++; if (dt > 34) long++; active = false; }
      if (t - t0 < 4000 && n < 90) return raf(loop);
      window.removeEventListener('scroll', onS);
      if (n >= 12 && long / n > 0.2) {
        if (!lite) { lite = true; nav.classList.add('is-lite'); }                   /* first: drop chromatic aberration */
        else { refractOK = false; nav.classList.remove('is-refract'); try { sessionStorage.setItem('thx-nav-norefract', '1'); } catch (e) {} }
      }
    })(last);
  }
  if (refractOK) { buildMap(); frameBudget(); window.addEventListener('resize', function () { raf(buildMap); }, { passive: true }); }
  API.lens = function () { return { on: nav.classList.contains('is-refract'), lite: nav.classList.contains('is-lite'), map: [mapW, mapH] }; };

  /* ---------- 6. pointer highlight with a spring ---------- */
  var lens = { x: 0, y: 0, s: 1, vx: 0, vy: 0, vs: 0, tx: 0, ty: 0, ts: 1, on: false, running: false };
  function spring(v, target, vel, k, c, dt) { var f = -k * (v - target) - c * vel; vel += f * dt; v += vel * dt; return [v, vel]; }
  var lastT = 0;
  function lensLoop(t) {
    var dt = Math.min(0.032, (t - (lastT || t)) / 1000) || 0.016; lastT = t;
    var a = spring(lens.x, lens.tx, lens.vx, 170, 22, dt); lens.x = a[0]; lens.vx = a[1];
    var b = spring(lens.y, lens.ty, lens.vy, 170, 22, dt); lens.y = b[0]; lens.vy = b[1];
    var s = spring(lens.s, lens.ts, lens.vs, 200, 24, dt); lens.s = s[0]; lens.vs = s[1];
    var tr = 'translate3d(' + lens.x.toFixed(2) + 'px,' + lens.y.toFixed(2) + 'px,0) scale(' + lens.s.toFixed(4) + ')';
    nav.querySelector('.thx-nav-bar').style.transform = tr; /* never transform the backdrop layers: it re-snapshots the backdrop every frame and misaligns the lens map */
    var settled = Math.abs(lens.x - lens.tx) < 0.02 && Math.abs(lens.y - lens.ty) < 0.02 && Math.abs(lens.s - lens.ts) < 0.0005 && Math.abs(lens.vx) < 0.05 && Math.abs(lens.vy) < 0.05;
    if (!settled || lens.on) raf(lensLoop); else { lens.running = false; lastT = 0; nav.querySelector('.thx-nav-bar').style.transform = ''; }
  }
  function kick() { if (!lens.running) { lens.running = true; lastT = 0; raf(lensLoop); } }
  if (mqFine.matches && !mqMotion.matches) {
    nav.addEventListener('pointermove', function (e) {
      if (nav.getAttribute('data-open') === 'true') return;
      var r = nav.getBoundingClientRect();
      var rx = (e.clientX - r.left) / r.width, ry = (e.clientY - r.top) / r.height;
      nav.style.setProperty('--thx-mx', (rx * 100).toFixed(1) + '%');
      nav.style.setProperty('--thx-my', (ry * 100).toFixed(1) + '%');
      lens.tx = (rx - 0.5) * 1.6; lens.ty = (ry - 0.5) * 1.2; lens.on = true;
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
    reink();
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
