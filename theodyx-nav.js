/*! theodyx-nav.js v4.8.0 (2026-09-05) — behaviours for the clear liquid-glass nav (#thx-nav).
 * One unanimous ink (every word, the logo and the burger flip together between pure white and pure black, chosen
 * from what is behind all of them) plus, since 4.7.0, a per-word plate: any word the elected ink still fails gets
 * its own soft plate sized from its worst sampled backdrop (or, when that plate would flatten the glass, its own ink), whole-surface lens (continuous refraction profile from the pill geometry, per-
 * channel dispersion, geometry-lit specular rim, colour bleed; Chromium, capability + frame-budget gated), pointer
 * highlight with a spring, scroll condense, accessible mobile sheet (focus trap, Escape, inert, iOS-safe scroll lock), skip link
 * target, legacy first-section clearance, conversion hooks. No dependencies. */
(function () {
  'use strict';
  if (window.__thxNav) return;
  var nav = document.getElementById('thx-nav');
  if (!nav) return;
  var API = window.__thxNav = { v: '4.5.3' };
  var I18N = window.__thxI18n; function T(k) { return (I18N && I18N.t) ? I18N.t(k) : ({ 'nav.open': 'Open menu', 'nav.close': 'Close menu' })[k] || k; } /* Phase 6: locale runtime (nv2pagesf) keyed by <html lang> */
  var doc = document.documentElement, body = document.body;
  var glass = nav.querySelector('.thx-nav-glass');
  var rim = nav.querySelector('.thx-nav-rim');
  var burger = nav.querySelector('.thx-nav-burger');
  if (burger) burger.setAttribute('aria-label', T('nav.open')); /* the embed's static English label is replaced by the locale runtime's */
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
  /* 4.4: no scroll-driven condense — any transform on the bar re-snapshots the backdrop (twitch) */
  var scrolled = null, ticking = false;
  /* 3b. reading progress — a hairline inside the pill (article pages); no layout, no extra fixed element */
  var prog = null;
  function progTick(y) {
    if (!prog) return;
    var m = doc.scrollHeight - doc.clientHeight;
    var p = m > 0 ? Math.max(0, Math.min(1, y / m)) : 0;
    nav.style.setProperty('--thx-prog', p.toFixed(4));
  }
  API.progress = function (on) {
    if (on && !prog) { prog = document.createElement('div'); prog.className = 'thx-nav-prog'; prog.setAttribute('aria-hidden', 'true'); nav.appendChild(prog); nav.classList.add('has-prog'); }
    else if (!on && prog) { prog.parentNode && prog.parentNode.removeChild(prog); prog = null; nav.classList.remove('has-prog'); nav.style.removeProperty('--thx-prog'); }
    progTick(window.scrollY || doc.scrollTop || 0);
    return !!prog;
  };
  if (document.querySelector('.thx-read-body') || doc.hasAttribute('data-thx-progress')) API.progress(true);
  function onScroll() {
    ticking = false;
    var y = window.scrollY || doc.scrollTop || 0, tn = now();
    if (lastScrollT) { var dt = tn - lastScrollT; if (dt > 0) scrollV = Math.abs(y - lastScrollY) / dt; } lastScrollY = y; lastScrollT = tn;
    var s = y > 80;
    if (s !== scrolled) { scrolled = s; nav.classList.toggle('is-scrolled', s); }
    progTick(y);
    if (nav.getAttribute('data-open') !== 'true') reinkSoon();
  }
  /* 4.6.0 (Phase 8): the ink sampler ran on every scroll frame (18-54 elementsFromPoint hit-tests + 72-281 getComputedStyle
   * reads per frame). It now runs at most every REINK_MS while scrolling, plus one trailing run after the last scroll event,
   * so the settled ink is still exact; the hysteresis + 300 ms dwell inside reinkInner already smooth the transitions. */
  var REINK_MS = 100, reinkT = 0, lastReink = 0, lastReinkY = -1e9, lastScrollY = 0, lastScrollT = 0, scrollV = 0;
  /* 4.8.0 (Phase 11 SIG-02): the solver never runs inside a scroll frame. It is queued into idle time (rAF fallback), skipped when
   * the page moved under 24 px and no media is in the band, and its cadence backs off to 160 ms while the finger is flying. */
  function idleReink() { if (window.requestIdleCallback) requestIdleCallback(function () { reink(); }, { timeout: 200 }); else raf(function () { reink(); }); }
  function reinkSoon() {
    var t = now(), y = window.scrollY || doc.scrollTop || 0;
    if (Math.abs(y - lastReinkY) < 24 && !anyMedia && lastReinkY !== -1e9) return;
    var gap = scrollV > 1.5 ? 160 : REINK_MS;
    if (t - lastReink >= gap) { lastReink = t; lastReinkY = y; idleReink(); }
    clearTimeout(reinkT); reinkT = setTimeout(function () { lastReink = now(); lastReinkY = window.scrollY || doc.scrollTop || 0; idleReink(); }, gap + 40);
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
  /* 4.7.2 (Phase 10 SPEED-05): the sampler's CORS copies were fetched at high priority during the LCP window and
   * competed with the hero itself. Copies now wait until the page has painted its LCP (largest-contentful-paint
   * observer, or load + 800 ms as the fallback), are requested at low priority, and only *.r2.dev (which sends
   * Access-Control-Allow-Origin solely when an Origin header is present) uses cache:'reload'; every other host
   * reuses the browser cache. Until then the nav wears the ink it elected from the colours it can read. */
  var lcpDone = false, lcpQueue = [];
  function lcpSettled() { if (lcpDone) return; lcpDone = true; var q = lcpQueue; lcpQueue = []; for (var i = 0; i < q.length; i++) { try { q[i](); } catch (e) {} } }
  (function () {
    var t = setTimeout(lcpSettled, 4000);
    function afterLoad() { setTimeout(lcpSettled, 800); }
    if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad, { once: true });
    try {
      if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf('largest-contentful-paint') !== -1) {
        var po = new PerformanceObserver(function () { clearTimeout(t); setTimeout(function () { lcpSettled(); try { po.disconnect(); } catch (e) {} }, 300); });
        po.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    } catch (e) {}
  })();
  function corsLoad(src, done) {
    var im = new Image(); im.decoding = 'async'; corsImgs[src] = im;
    var fail = function () { im.__thxFail = true; };
    var go = function () {
      var r2 = /\.r2\.dev$/.test((function () { try { return new URL(src, location.href).hostname; } catch (e) { return ''; } })());
      if (typeof fetch === 'function' && typeof URL !== 'undefined' && URL.createObjectURL) {
        var opts = { mode: 'cors', credentials: 'omit', priority: 'low' }; if (r2) opts.cache = 'reload';
        fetch(src, opts).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
          .then(function (b) { im.onload = function () { if (done) done(); }; im.onerror = fail; im.src = URL.createObjectURL(b); })
          .catch(function () { im.crossOrigin = 'anonymous'; im.onload = function () { if (done) done(); }; im.onerror = fail; im.src = src; });
      } else { im.crossOrigin = 'anonymous'; im.onload = function () { if (done) done(); }; im.onerror = fail; im.src = src; }
    };
    if (lcpDone) go(); else lcpQueue.push(go);
    return im;
  }
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
  var SMALL_W = 192;
  function smallCopy(src, iw, ih, persistent) {
    /* one downscaled copy per source per tick (videos) or per source for good (images): reading regions from it is cheap */
    var store = persistent ? src : null;
    if (persistent && src.__thxSmall) return src.__thxSmall;
    var per = tickCache.get(src); if (!persistent && per && per.__small) return per.__small;
    var w = SMALL_W, h = Math.max(4, Math.round(ih / iw * SMALL_W));
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var cx = c.getContext('2d', { willReadFrequently: true }); if (!cx) return null;
    cx.drawImage(src, 0, 0, w, h);
    try { cx.getImageData(0, 0, 1, 1); } catch (e) { return 'tainted'; }
    var out = { c: c, w: w, h: h };
    if (persistent) src.__thxSmall = out; else { if (!per) { per = {}; tickCache.set(src, per); } per.__small = out; }
    return out;
  }
  function mediaStats(el, r) {
    if (!sctx || el.__thxTainted) return null;
    var tag = el.tagName;
    if (tag === 'PICTURE') { el = el.querySelector('img'); if (!el) return null; tag = 'IMG'; }
    var mr = el.getBoundingClientRect(), fit = (getComputedStyle(el).objectFit || 'fill');
    try {
      if (tag === 'VIDEO') {
        if (el.readyState >= 2 && !el.__thxVideoTainted) {
          var sm = smallCopy(el, el.videoWidth, el.videoHeight, false);
          if (sm === 'tainted') el.__thxVideoTainted = true;
          else if (sm) { if (!drawRegion(sm.c, sm.w, sm.h, mr, r, fit)) return null; var stv = readPixels(); stv.sd = Math.max(stv.sd, 0.22); return stv; } /* live video: frames change, so always wear the stronger halo */
        }
        /* frames unavailable (no CORS on the media, or not loaded yet): use the poster as a stand-in for the scene */
        var ps = el.poster || el.getAttribute('poster'); if (!ps) return null;
        var pim = corsImgs[ps];
        if (!pim) pim = corsLoad(ps, reink);
        if (pim.__thxFail || !pim.complete || !pim.naturalWidth) return null;
        try { var smp = smallCopy(pim, pim.naturalWidth, pim.naturalHeight, true); if (!smp || smp === 'tainted') return null; if (!drawRegion(smp.c, smp.w, smp.h, mr, r, fit)) return null; var st = readPixels(); st.sd = Math.max(st.sd, 0.12); return st; } catch (e) { return null; }
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
          if (!im) im = corsLoad(src, reink);
          if (im.__thxFail || !im.complete || !im.naturalWidth) return null;
        } else if (!el.complete || !el.naturalWidth) return null;
        var smi = smallCopy(im, im.naturalWidth, im.naturalHeight, true);
        if (smi === 'tainted' || !smi) { el.__thxTainted = true; return null; }
        if (!drawRegion(smi.c, smi.w, smi.h, mr, r, fit)) return null;
        return readPixels();
      }
    } catch (e) { el.__thxTainted = true; }
    return null;
  }
  function warmPosters() {
    /* 4.7.0: the sampler reads a lazy video through a CORS copy of its poster; fetch those copies at idle so the first
     * sample over such a video reads the scene rather than the card behind it (first-encounter latency measured ~400 ms) */
    try {
      document.querySelectorAll('video[poster]').forEach(function (v) {
        var ps = v.poster || v.getAttribute('poster'); if (!ps || corsImgs[ps]) return;
        corsLoad(ps, null);
      });
    } catch (e) {}
  }
  if (window.requestIdleCallback) requestIdleCallback(warmPosters, { timeout: 1500 }); else setTimeout(warmPosters, 600);
  function bgStats(el, cs, bgi, r) {
    if (!sctx || el.__thxTainted) return null;
    var m = bgi.match(/url\((['"]?)(.*?)\1\)/); if (!m) return null;
    var src = m[2]; var im = corsImgs[src];
    if (!im) im = corsLoad(src, reink);
    if (im.__thxFail || !im.complete || !im.naturalWidth) return null;
    var key = Math.round(r.left) + ':' + Math.round(r.width);
    var per = tickCache.get(el); if (!per) { per = {}; tickCache.set(el, per); }
    if (key in per) return per[key];
    var st = null;
    try { var fit = /contain/.test(cs.backgroundSize) ? 'contain' : 'cover'; var smb = smallCopy(im, im.naturalWidth, im.naturalHeight, true); if (smb && smb !== 'tainted' && drawRegion(smb.c, smb.w, smb.h, el.getBoundingClientRect(), r, fit)) st = readPixels(); else if (smb === 'tainted') el.__thxTainted = true; } catch (e) { el.__thxTainted = true; }
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
  function gradientAt(bgi, el, x, y) {
    /* colour + alpha of a CSS gradient at the point: linear gradients along their axis, others = stop average */
    var cols = []; var re = /(rgba?\([^)]+\))(?:\s+([\d.]+)%)?/g, mm;
    while ((mm = re.exec(bgi))) { var c = mm[1].match(/rgba?\(([^)]+)\)/)[1].split(/[\s,\/]+/).map(parseFloat); cols.push({ L: lum(c[0], c[1], c[2]), a: c.length > 3 ? c[3] : 1, p: mm[2] !== undefined ? parseFloat(mm[2]) / 100 : null }); }
    if (!cols.length) return null;
    for (var i = 0; i < cols.length; i++) if (cols[i].p === null) cols[i].p = cols.length === 1 ? 0 : i / (cols.length - 1);
    var lin = bgi.indexOf('linear-gradient(') !== -1 && el && x !== undefined;
    if (!lin) { var sL = 0, sA = 0; for (var j = 0; j < cols.length; j++) { sL += cols[j].L * cols[j].a; sA += cols[j].a; } return { L: sA ? sL / sA : 0, a: sA / cols.length }; }
    var r = el.getBoundingClientRect(); if (!r.width || !r.height) return { L: cols[0].L, a: cols[0].a };
    var ang = 180; var am = bgi.match(/linear-gradient\(\s*(-?[\d.]+)deg/); var tm = bgi.match(/linear-gradient\(\s*to ([a-z ]+)/);
    if (am) ang = parseFloat(am[1]); else if (tm) { var dirs = { 'top': 0, 'right': 90, 'bottom': 180, 'left': 270, 'top right': 45, 'right top': 45, 'bottom right': 135, 'right bottom': 135, 'bottom left': 225, 'left bottom': 225, 'top left': 315, 'left top': 315 }; ang = dirs[tm[1].trim()] !== undefined ? dirs[tm[1].trim()] : 180; }
    var th = ang * Math.PI / 180, dx = Math.sin(th), dy = -Math.cos(th);
    var len = Math.abs(r.width * dx) + Math.abs(r.height * dy);
    var px = (x - (r.left + r.width / 2)) * dx + (y - (r.top + r.height / 2)) * dy;
    var t = Math.min(1, Math.max(0, px / len + 0.5));
    for (var k = 1; k < cols.length; k++) { if (t <= cols[k].p) { var a0 = cols[k - 1], b0 = cols[k]; var u = (b0.p === a0.p) ? 0 : (t - a0.p) / (b0.p - a0.p); var aa = a0.a + (b0.a - a0.a) * u; var LL = (a0.L * a0.a * (1 - u) + b0.L * b0.a * u) / (aa || 1); return { L: LL, a: aa }; } }
    return { L: cols[cols.length - 1].L, a: cols[cols.length - 1].a };
  }
  function gradientLum(bgi, el, x, y) { var g = gradientAt(bgi, el, x, y); return g ? g.L : null; }
  function paintLayers(cs, el, x, y) {
    /* the translucent paint of one box (or pseudo-element) at the point: gradient(s) then background colour; opaque url() images are handled by the caller */
    var out = [], op = parseFloat(cs.opacity); if (isNaN(op)) op = 1; if (op <= 0) return out;
    var bgi = cs.backgroundImage && cs.backgroundImage !== 'none' ? cs.backgroundImage : '';
    if (bgi && bgi.indexOf('gradient') !== -1 && bgi.indexOf('url(') === -1) { var g = gradientAt(bgi, el, x, y); if (g && g.a > 0.01) out.push({ L: g.L, a: Math.min(1, g.a * op) }); }
    var bm = (cs.backgroundColor || '').match(/rgba?\(([^)]+)\)/);
    if (bm) { var bc = bm[1].split(/[\s,\/]+/).map(parseFloat); var ba = bc.length > 3 ? bc[3] : 1; if (ba > 0.01) out.push({ L: lum(bc[0], bc[1], bc[2]), a: Math.min(1, ba * op) }); }
    return out;
  }
  function pseudoLayers(el, which, x, y) {
    /* ::before/::after overlays (scrims, ink-guards, vignettes) never appear in elementsFromPoint; assume a positioned pseudo covers its box */
    try {
      var cs = getComputedStyle(el, which);
      if (!cs || cs.content === 'none' || cs.content === 'normal' || cs.display === 'none') return [];
      if (cs.position !== 'absolute' && cs.position !== 'fixed') return [];
      var r = el.getBoundingClientRect(); if (x < r.left || x > r.right || y < r.top || y > r.bottom) return [];
      return paintLayers(cs, el, x, y);
    } catch (e) { return []; }
  }
  function mediaKids(el) {
    try { return Array.prototype.slice.call(el.querySelectorAll(':scope > img,:scope > video,:scope > canvas,:scope > picture,:scope > * > img,:scope > * > video,:scope > * > picture')); } catch (e) { return []; }
  }
  function hasDirectText(el) {
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && /\S/.test(c.data)) return true;
    return false;
  }
  function pointStats(x, y, r) {
    /* composite the stack of elements under (x,y) top-down: translucent colours, glyphs, gradients, images/video (opaque) */
    x = Math.min(Math.max(x, 0), window.innerWidth - 1); y = Math.min(Math.max(y, 0), window.innerHeight - 1);
    var els = document.elementsFromPoint(x, y);
    var acc = 0, rem = 1, sdMax = 0, media = false, key = Math.round(r.left) + ':' + Math.round(r.width);
    var G = function (L) { return Math.pow(Math.max(0, Math.min(1, L)), 1 / 2.2); }; /* blending happens on sRGB-encoded values, so accumulate in gamma space */
    for (var i = 0; i < els.length && rem > 0.02; i++) {
      var el = els[i];
      if (el === nav || nav.contains(el) || el.contains(nav) || el.classList.contains('thx-skip')) continue;
      var tagged = el.closest('[data-nav-tone]');
      if (tagged) return { forced: tagged.getAttribute('data-nav-tone') };
      if (el.hasAttribute('data-nav-lum')) { acc += rem * parseFloat(el.getAttribute('data-nav-lum')); rem = 0; break; }
      var per = tickCache.get(el); if (!per) { per = {}; tickCache.set(el, per); }
      if (MEDIA.test(el.tagName)) {
        if (!(key in per)) per[key] = mediaStats(el, r);
        var st = per[key]; media = true;
        if (st) { sdMax = Math.max(sdMax, st.sd); acc += rem * G(st.L); rem = 0; break; }
        var cs0 = getComputedStyle(el), pb = parseBg(cs0);
        if (pb !== null) { acc += rem * G(pb); rem = 0; break; }
        sdMax = Math.max(sdMax, 0.25); continue; /* no frames yet and no colour of its own (a video still loading): what is painted beneath it is what the eye sees */
      }
      /* 4.7.0: Chromium's hit-test skips a media child whose box is mostly scrolled out of the viewport (a 508px photo with
       * 57px still showing), so the stack holds the white card behind the photo. Look one and two levels down for media
       * that covers the point and is missing from the stack, and read it as if it were on top. */
      if (!hasDirectText(el)) {
        if (!('kids' in per)) per.kids = mediaKids(el);
        var kids = per.kids, hit = false;
        for (var kk = 0; kk < kids.length; kk++) {
          var km = kids[kk]; if (els.indexOf(km) !== -1) continue;
          var kr = per['kr' + kk] || (per['kr' + kk] = km.getBoundingClientRect());
          if (x < kr.left || x > kr.right || y < kr.top || y > kr.bottom) continue;
          var perK = tickCache.get(km); if (!perK) { perK = {}; tickCache.set(km, perK); }
          if (!(key in perK)) perK[key] = mediaStats(km, r);
          var stk = perK[key]; media = true; hit = true;
          if (stk) { sdMax = Math.max(sdMax, stk.sd); acc += rem * G(stk.L); rem = 0; }
          else sdMax = Math.max(sdMax, 0.25);
          break;
        }
        if (hit && rem === 0) break;
      }
      var cs = getComputedStyle(el);
      var after = pseudoLayers(el, '::after', x, y);
      for (var q = 0; q < after.length && rem > 0.02; q++) { acc += rem * after[q].a * G(after[q].L); rem *= (1 - after[q].a); }
      if (hasDirectText(el)) {
        var gk = 'g' + key; if (!(gk in per)) per[gk] = glyphCoverage(el, r);
        var g = per[gk];
        if (g > 0.01) { var tm = (cs.color || '').match(/rgba?\(([^)]+)\)/); if (tm) { var tc = tm[1].split(/[\s,\/]+/).map(parseFloat); var Lt = lum(tc[0], tc[1], tc[2]); acc += rem * g * G(Lt); rem *= (1 - g); sdMax = Math.max(sdMax, Math.min(1, g * 2) * 0.5); } }
      }
      var bgi = cs.backgroundImage && cs.backgroundImage !== 'none' ? cs.backgroundImage : '';
      if (bgi) {
        if (bgi.indexOf('url(') === 0) {
          var st2 = bgStats(el, cs, bgi, r); media = true;
          if (st2) { sdMax = Math.max(sdMax, st2.sd); acc += rem * G(st2.L); rem = 0; break; }
          sdMax = Math.max(sdMax, 0.25); /* unreadable image: fall through to the element's own colour layers and whatever is beneath */
        }
      }
      var before = pseudoLayers(el, '::before', x, y);
      for (var q2 = 0; q2 < before.length && rem > 0.02; q2++) { acc += rem * before[q2].a * G(before[q2].L); rem *= (1 - before[q2].a); }
      var own = paintLayers(cs, el, x, y);
      for (var q3 = 0; q3 < own.length && rem > 0.02; q3++) { acc += rem * own[q3].a * G(own[q3].L); rem *= (1 - own[q3].a); }
    }
    if (rem > 0.02) { var lb = parseBg(getComputedStyle(body)); if (lb === null) lb = parseBg(getComputedStyle(doc)); acc += rem * G(lb === null ? 1 : lb); }
    return { L: Math.pow(acc, 2.2), sd: sdMax, media: media };
  }
  var inkEls = [];
  if (logo) inkEls.push(logo);
  nav.querySelectorAll('.thx-nav-menu a').forEach(function (a) { inkEls.push(a); });
  if (burger) inkEls.push(burger);
  var inkState = inkEls.map(function (el) { return { el: el, L: null, mixed: false }; });
  var ink = 'light', inkT = 0, scrim = '', scrimT = 0, scrimOff = 0, tone = 'dark', anyMedia = false, lastTickMs = 0, inkTimer = 0, inkInterval = 320, tickId = 0;
  var menuEl = nav.querySelector('.thx-nav-menu');
  var cal = function (L) { return Math.min(1, L * 1.3 + 0.01); }; /* calibrated against rendered pixels through the glass: sampler underreads ~12% and the glass lifts the backdrop ~15% */
  function contrast(L, which) { return which === 'light' ? 1.05 / (L + 0.05) : (L + 0.05) / 0.05; }
  nav.setAttribute('data-ink', ink);
  function reink() {
    if (nav.getAttribute('data-open') === 'true') return;
    var t0 = now();
    tickCache = new Map(); anyMedia = false;
    var pe = nav.style.pointerEvents; nav.style.pointerEvents = 'none'; /* hit-testing (caret + elementsFromPoint) must see through the nav */
    try { reinkInner(t0); } finally { nav.style.pointerEvents = pe; }
  }
  function reinkInner(t0) {
    tickId++;
    /* 1. sample every inked element (9-point grid each), 2. decide ONE ink for all of them: the ink whose worst word
     * still reads best (maximin contrast), mean luminance breaking ties, with hysteresis + dwell so it never flickers. */
    var forced = null, worstD = Infinity, worstL = Infinity, sumL = 0, n = 0, prefD = 0, prefL = 0, anyMixed = false, wsum = 0, wL = 0, failD = 0, failL = 0;
    for (var i = 0; i < inkState.length; i++) {
      var s = inkState[i], el = s.el;
      if (!el.offsetParent) continue;
      var r = el.getBoundingClientRect(); if (!r.width) continue;
      var pts = [[0.15, 0.18], [0.5, 0.18], [0.85, 0.18], [0.15, 0.5], [0.5, 0.5], [0.85, 0.5], [0.15, 0.84], [0.5, 0.84], [0.85, 0.84]];
      var Ls = [], sds = [];
      for (var p = 0; p < pts.length; p++) {
        var st; try { st = pointStats(r.left + r.width * pts[p][0], r.top + r.height * pts[p][1], r); } catch (e) { st = null; }
        if (!st) continue;
        if (st.forced) { forced = st.forced; break; }
        Ls.push(st.L); sds.push(st.sd || 0); if (st.media) anyMedia = true;
      }
      if (forced) break;
      if (!Ls.length) continue;
      var L = Ls.reduce(function (a, b) { return a + b; }, 0) / Ls.length;
      var spread = Math.max.apply(null, Ls) - Math.min.apply(null, Ls);
      var sd = sds.reduce(function (a, b) { return a + b; }, 0) / sds.length;
      s.mixed = spread > 0.3 || sd > 0.2; if (s.mixed) anyMixed = true;
      s.L = L; s.Lmin = Math.min.apply(null, Ls); s.Lmax = Math.max.apply(null, Ls); s.tick = tickId; /* raw: the plate solver models the glass itself */
      var Le = cal(L), cd = contrast(Le, 'dark'), cl = contrast(Le, 'light');
      if (cd < worstD) worstD = cd; if (cl < worstL) worstL = cl;
      if (cd > cl) prefD++; else prefL++;
      var tgtI = (el === logo || el === burger) ? 3 : 4.5; if (cd < tgtI) failD++; if (cl < tgtI) failL++;
      var w = r.width * r.height; wsum += w; wL += w * Le;
      sumL += L; n++;
    }
    var want = ink, mixed = false;
    if (forced) { want = forced === 'light' ? 'dark' : 'light'; }
    else if (n) {
      var meanLe = wsum ? wL / wsum : cal(sumL / n);
      mixed = (prefD > 0 && prefL > 0) || anyMixed;
      if (Math.abs(worstD - worstL) < 0.35) want = contrast(meanLe, 'dark') >= contrast(meanLe, 'light') ? 'dark' : 'light'; /* tie: the bar as a whole decides */
      else want = worstD > worstL ? 'dark' : 'light';
      /* 4.8.0 (Phase 11 SIG-01): when a majority of the words fail AA in the elected ink and fewer would fail in the other, flip the
       * whole bar instead of plating - white words over a dark band are the answer, not five lozenges. */
      if (failD !== undefined) { var fw = want === 'dark' ? failD : failL, fo = want === 'dark' ? failL : failD; if (n >= 3 && fw * 2 >= n && fo < fw) want = want === 'dark' ? 'light' : 'dark'; }
      if (want !== ink) {
        var better = want === 'dark' ? worstD / Math.max(0.01, worstL) : worstL / Math.max(0.01, worstD);
        if (better < 1.15 || t0 - inkT < 300) want = ink;          /* hysteresis + dwell */
      }
    }
    if (want !== ink) { ink = want; inkT = t0; }
    nav.setAttribute('data-ink', ink);
    platePass(t0, !!forced);
    /* legibility scrim: only when the words disagree about the backdrop AND the chosen ink still fails somewhere (Apple's glass darkens/lightens the same way) */
    var worst = ink === 'dark' ? worstD : worstL;
    var sc = (!forced && mixed && n && worst < 3) ? (ink === 'light' ? 'dark' : 'light') : '';
    /* 4.8.0 (Phase 11 SIG-03): the scrim fails toward legibility - it comes on at once, and only goes off after 600 ms and two agreeing ticks */
    if (sc && sc !== scrim) { scrim = sc; scrimT = t0; scrimOff = 0; nav.setAttribute('data-scrim', sc); }
    else if (!sc && scrim) { scrimOff++; if (scrimOff >= 2 && t0 - scrimT >= 600) { scrim = ''; scrimT = t0; scrimOff = 0; nav.removeAttribute('data-scrim'); } }
    else scrimOff = 0;
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
  /* 4.7.0 (Phase 9, C-01/C-06): the unanimous election picks the ink whose WORST word reads best, but when the words
   * disagree about the backdrop that worst word can still sit at 1-3:1 (black over a black band while its neighbours sit
   * on cream). The global scrim only engaged on the mixed/unanimous flag, so a unanimous-but-catastrophic election drew
   * nothing. Now every word is checked on its own against AA (4.5:1 text, 3:1 mark + burger, plus margin for sampler
   * error) using its worst sampled point, and a word that fails gets a soft plate behind it - white under dark ink,
   * black under light ink - with the alpha solved from the luminance it needs, quantised to 0.05 and capped. When the
   * cap would not be enough and the other ink needs a lighter plate, that word flips ink on its own instead. Plates come
   * in at once and fade out lazily (dwell), so a moving hero frame cannot make them flicker. */
  var PLATE_CAP = 0.72, PLATE_DWELL = 350, PLATE_HEADROOM = 0.05, GLASS_TINT = 0.035;
  function plateNeed(Lw, which, target) {
    /* alpha compositing happens on sRGB-encoded values while WCAG luminance is linear, so solve in gamma space:
     * a white plate at 0.2 over black paints rgb(51,51,51), which is L 0.033 (2.3:1), not L 0.2. The clear glass
     * (rgba(255,255,255,.035)) sits under the plate, so lift the backdrop by it first; the headroom covers the
     * darkest pixels the nine-point grid does not land on. */
    var G = function (L) { return Math.pow(Math.max(0, Math.min(1, L)), 1 / 2.2); }, vb = G(Lw), a;
    vb = vb + GLASS_TINT * (1 - vb);
    if (which === 'dark') { var vn = G(target * 0.05 - 0.05); a = vb >= vn ? 0 : (vn - vb) / Math.max(0.001, 1 - vb); }
    else { var vl = G(1.05 / target - 0.05); a = vb <= vl ? 0 : 1 - vl / Math.max(0.001, vb); }
    return a > 0 ? a + PLATE_HEADROOM : 0;
  }
  function platePass(t0, forced) {
    /* 4.8.0 (Phase 11 SIG-01/SIG-03): the menu gets ONE plate, sized from its worst word and quantised to 0 / .34 / .52, so the pill
     * stays one piece of glass instead of a row of lozenges; the mark and the burger keep a plate of their own (they stand alone). */
    var needMenu = 0;
    for (var i = 0; i < inkState.length; i++) {
      var s = inkState[i], el = s.el, standalone = (el === logo || el === burger);
      if (forced || s.tick !== tickId || s.L === null || s.L === undefined) { if (standalone) setPlate(s, el, 0, t0); continue; }
      var target = standalone ? 3.4 : 4.9;
      var a = plateNeed(ink === 'dark' ? s.Lmin : s.Lmax, ink, target);
      if (standalone) setPlate(s, el, a, t0); else if (a > needMenu) needMenu = a;
    }
    if (menuEl) setPlate(menuState, menuEl, forced ? 0 : needMenu, t0);
  }
  var menuState = { plate: 0, plateT: 0 };
  function quant(a) { return a <= 0.06 ? 0 : a <= 0.40 ? 0.34 : 0.52; }
  function setPlate(s, el, a, t0) {
    var cur = s.plate || 0;
    a = quant(a);
    if (a < cur && t0 - (s.plateT || 0) < PLATE_DWELL) a = cur;   /* plates come in at once and fade out lazily */
    if (a === cur && (a === 0) === !el.hasAttribute('data-plate')) { if (a > 0 && el.getAttribute('data-plate') !== (ink === 'dark' ? 'light' : 'dark')) el.setAttribute('data-plate', ink === 'dark' ? 'light' : 'dark'); return; }
    if (a !== cur) { s.plate = a; s.plateT = t0; }
    if (a > 0) { el.setAttribute('data-plate', ink === 'dark' ? 'light' : 'dark'); el.style.setProperty('--thx-plate', a.toFixed(2)); }
    else { el.removeAttribute('data-plate'); el.style.removeProperty('--thx-plate'); }
  }
  function schedMedia() {
    clearTimeout(inkTimer);
    if (!anyMedia || document.hidden) return;
    inkInterval = lastTickMs > 6 ? Math.min(900, inkInterval * 1.4) : Math.max(320, inkInterval * 0.8);
    inkTimer = setTimeout(reink, inkInterval);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) reink(); });
  API.reink = reink; API.retone = reink;
  API.inks = function () { return inkState.map(function (s) { return { text: (s.el.textContent || s.el.getAttribute('aria-label') || '').trim().slice(0, 24), ink: ink, L: s.L, Lmin: s.Lmin, Lmax: s.Lmax, mixed: s.mixed, plate: (s.el === logo || s.el === burger) ? (s.plate || 0) : menuState.plate }; }); };
  API.ink = function () { return { ink: ink, scrim: scrim, tone: tone }; };
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
  /* Tunables (live: __thxNav.lens({scale:70,...})). Profile T(d) over distance d from the rounded edge: a rim term
   * (smoothstep^rimK over the outer rimW*h, the bevel) plus a body term that runs all the way to the centre line
   * (sign < 0 = the centre magnifies like a thick slab), so the whole surface bends — no flat inset panel. */
  var LENS = { scale: 112, rim: 0.9, rimW: 0.58, rimK: 1.25, body: -0.6, bodyK: 1.5, disp: 0.34, dispW: 0.4, dispBody: 0.05, sat: 1.9, blur: 0.45, spec: 0.5, specW: 0.24, bleed: 0.9, bleedBlur: 20, light: [-0.55, -0.83], light2: [0.55, 0.83] }; /* 4.4: turned up — deeper centre magnification, wider bevel, more dispersion, saturation and colour bleed. 4.5: dispersion lives at the edge — disp fades in over the outer dispW of the bevel, dispBody is a whisper in the body — one map per channel, so text under the body no longer splits into three colours */
  var mapW = 0, mapH = 0, mapURLs = ['', '', ''], mapRetry = 0;
  var svgNS = 'http://www.w3.org/2000/svg';
  function fe(name, attrs) { var e = document.createElementNS(svgNS, name); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function buildFilters(w, h) {
    /* rebuilds #thx-lens (full: three displacement passes = per-channel dispersion) and #thx-lens-lite (one pass) */
    var svg = mapImg && mapImg.ownerSVGElement; if (!svg) return false;
    var S = LENS.scale, D = LENS.disp, cm = function (r, g, b, res, inp) { return fe('feColorMatrix', { 'in': inp, type: 'matrix', values: r + ' 0 0 0 0  0 ' + g + ' 0 0 0  0 0 ' + b + ' 0 0  0 0 0 1 0', result: res }); };
    var build = function (id, full) {
      var f = svg.querySelector('#' + id); if (!f) { f = fe('filter', { id: id }); svg.appendChild(f); }
      while (f.firstChild) f.removeChild(f.firstChild);
      f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', '100%'); f.setAttribute('height', '100%'); f.setAttribute('color-interpolation-filters', 'sRGB');
      var mk = function (mid, url, res) { var img = fe('feImage', { id: mid, result: res, preserveAspectRatio: 'none', x: '0', y: '0', width: w, height: h }); img.setAttribute('href', url); try { img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url); } catch (e) {} f.appendChild(img); };
      mk(id + '-map', mapURLs[1], 'map'); /* green = the reference map (also the only map the lite filter uses) */
      if (full && D > 0) { mk(id + '-map-r', mapURLs[0], 'mapr'); mk(id + '-map-b', mapURLs[2], 'mapb'); }
      f.appendChild(fe('feGaussianBlur', { 'in': 'SourceGraphic', stdDeviation: LENS.blur, result: 'src' }));
      if (full && D > 0) {
        f.appendChild(fe('feDisplacementMap', { 'in': 'src', in2: 'mapr', scale: S, xChannelSelector: 'R', yChannelSelector: 'G', result: 'dr' }));
        f.appendChild(fe('feDisplacementMap', { 'in': 'src', in2: 'map', scale: S, xChannelSelector: 'R', yChannelSelector: 'G', result: 'dg' }));
        f.appendChild(fe('feDisplacementMap', { 'in': 'src', in2: 'mapb', scale: S, xChannelSelector: 'R', yChannelSelector: 'G', result: 'db' }));
        f.appendChild(cm(1, 0, 0, 'r', 'dr')); f.appendChild(cm(0, 1, 0, 'g', 'dg')); f.appendChild(cm(0, 0, 1, 'b', 'db'));
        f.appendChild(fe('feComposite', { 'in': 'r', in2: 'g', operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: 0, result: 'rg' }));
        f.appendChild(fe('feComposite', { 'in': 'rg', in2: 'b', operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: 0, result: 'd' }));
      } else {
        f.appendChild(fe('feDisplacementMap', { 'in': 'src', in2: 'map', scale: S, xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }));
      }
      f.appendChild(fe('feColorMatrix', { 'in': 'd', type: 'saturate', values: LENS.sat }));
    };
    build('thx-lens', true); build('thx-lens-lite', false);
    mapImg = document.getElementById('thx-lens-map'); mapImgLite = document.getElementById('thx-lens-map-lite');
    return true;
  }
  function buildMap(force) {
    if (!refractOK) return;
    var nr = nav.getBoundingClientRect();
    var w = Math.round(nr.width), h = Math.round(nr.height);
    if (!w || !h) return;
    if (h > 160 || w < 200 || !/url\(|blur\(/.test(getComputedStyle(glass).backdropFilter || '')) { clearTimeout(mapRetry); mapRetry = setTimeout(function () { buildMap(force); }, 150); return; } /* stylesheet not applied yet (unstyled header) — never bake a map for the wrong geometry */
    if (!force && w === mapW && h === mapH) return;
    mapW = w; mapH = h;
    /* The lens pulls content in from OUTSIDE the pill, but a backdrop-filter only captures what is under its own box,
     * so the glass is enlarged by `pad` on every side (and clipped back to the pill with clip-path). The map covers
     * the enlarged box; the pill geometry sits centred in it. */
    var pad = Math.ceil(LENS.scale / 2) + 4;
    /* The capture box must never leave the viewport: Chromium clips a backdrop-filter to the visible area and then stretches
     * the map over what is left, which shifts the whole lens. The top pad is therefore capped at the bar's own offset, and
     * upward samples are clamped to the viewport edge (see below). */
    var padT = Math.max(2, Math.min(pad, Math.floor(nr.top) - 1));
    nav.style.setProperty('--thx-lens-pad', pad + 'px'); nav.style.setProperty('--thx-lens-pad-t', padT + 'px');
    nav.style.setProperty('--thx-nav-bleed', String(LENS.bleed)); nav.style.setProperty('--thx-nav-bleed-blur', LENS.bleedBlur + 'px');
    var W = w + 2 * pad, Hh = h + pad + padT;
    var R = Math.min(h / 2, parseFloat(getComputedStyle(nav).borderTopLeftRadius) || h / 2);
    var H = h / 2, Rb = Math.max(12, h * LENS.rimW);
    var L1 = LENS.light, L2 = LENS.light2;
    /* signed distance to the rounded-rect edge (positive inside) + outward normal, for a point (px,py) relative to the pill's top-left */
    function geo(px, py) {
      var cx = px - w / 2, cy = py - h / 2;
      var qx = Math.abs(cx) - (w / 2 - R), qy = Math.abs(cy) - (h / 2 - R);
      var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      var outside = Math.sqrt(ox * ox + oy * oy), inside = Math.min(Math.max(qx, qy), 0);
      var dist = R - (outside + inside);
      var nx = 0, ny = 0;
      if (qx > 0 || qy > 0) { var len = outside || 1; nx = (ox / len) * (cx < 0 ? -1 : 1); ny = (oy / len) * (cy < 0 ? -1 : 1); }
      else if (qx > qy) { nx = cx < 0 ? -1 : 1; } else { ny = cy < 0 ? -1 : 1; }
      return [dist, nx, ny];
    }
    /* 1. displacement map over the enlarged box */
    var cw = Math.min(W, 880), ch = Math.min(Hh, 176);
    var c = document.createElement('canvas'); c.width = cw; c.height = ch;
    var ctx = c.getContext('2d'); if (!ctx) { refractOK = false; return; }
    var imgs = [ctx.createImageData(cw, ch), ctx.createImageData(cw, ch), ctx.createImageData(cw, ch)];
    var sx = W / cw, sy = Hh / ch, D = LENS.disp, Db = LENS.dispBody || 0, kk = [-1, 0, 1];
    for (var y = 0; y < ch; y++) {
      for (var x = 0; x < cw; x++) {
        var g = geo((x + 0.5) * sx - pad, (y + 0.5) * sy - padT), dist = g[0];
        var i = (y * cw + x) * 4, tr = 0, tb = 0, dw = 0;
        if (dist > 0) {
          tr = Math.max(0, Math.min(1, 1 - dist / Rb)); tr = tr * tr * (3 - 2 * tr); tr = Math.pow(tr, LENS.rimK);
          tb = Math.max(0, Math.min(1, 1 - dist / H)); tb = Math.pow(tb, LENS.bodyK);
          dw = Math.max(0, Math.min(1, 1 - dist / (Rb * (LENS.dispW || 0.4)))); dw = dw * dw * (3 - 2 * dw); /* colour splits only at the outer edge of the bevel */
        }
        for (var ci = 0; ci < 3; ci++) {
          var T = 0;
          if (dist > 0) {
            T = Math.max(-1, Math.min(1, tr * LENS.rim * (1 + kk[ci] * D * dw) + tb * LENS.body * (1 + kk[ci] * Db)));
            if (T > 0 && g[2] < 0) { var reach = 2 * (padT + dist) / (LENS.scale * -g[2]); if (T > reach) T = reach; } /* an upward sample may not go above the viewport */
          }
          var dd = imgs[ci].data;
          dd[i] = Math.round(128 + g[1] * T * 127); dd[i + 1] = Math.round(128 + g[2] * T * 127); dd[i + 2] = 128; dd[i + 3] = 255;
        }
      }
    }
    for (var mi = 0; mi < 3; mi++) { ctx.putImageData(imgs[mi], 0, 0); mapURLs[mi] = c.toDataURL('image/png'); }
    /* 2. specular rim from the same geometry (pill-sized): key light top-left, fill bottom-right, only on the bevel */
    var cw2 = Math.min(w, 720), ch2 = Math.min(h, 112);
    var hc = document.createElement('canvas'); hc.width = cw2; hc.height = ch2; var hctx = hc.getContext('2d');
    if (hctx && rim) {
      var himg = hctx.createImageData(cw2, ch2), hd = himg.data, sx2 = w / cw2, sy2 = h / ch2;
      for (var y2 = 0; y2 < ch2; y2++) {
        for (var x2 = 0; x2 < cw2; x2++) {
          var g2 = geo((x2 + 0.5) * sx2, (y2 + 0.5) * sy2), d2 = Math.max(0, g2[0]), nx = g2[1], ny = g2[2];
          var t2 = Math.max(0, Math.min(1, 1 - d2 / Math.max(8, h * LENS.specW))); t2 = t2 * t2 * (3 - 2 * t2); t2 = Math.pow(t2, LENS.rimK); /* the highlight lives on a narrower band than the lens, so a dark page stays dark through the body */
          var s1 = Math.max(0, nx * L1[0] + ny * L1[1]), s2 = Math.max(0, nx * L2[0] + ny * L2[1]);
          var spec = (Math.pow(s1, 2.4) * 1.0 + Math.pow(s2, 2.4) * 0.42) * Math.pow(t2, 0.85) * LENS.spec;
          var edge = d2 < 1.2 ? 0.40 : 0;
          var j = (y2 * cw2 + x2) * 4;
          hd[j] = 255; hd[j + 1] = 255; hd[j + 2] = 255; hd[j + 3] = Math.round(255 * Math.min(1, spec * 0.92 + edge));
        }
      }
      hctx.putImageData(himg, 0, 0);
      rim.style.backgroundImage = 'url(' + hc.toDataURL('image/png') + ')'; nav.classList.add('has-spec');
    }
    if (!buildFilters(W, Hh)) { refractOK = false; return; }
    nav.classList.add('is-refract'); nav.classList.toggle('is-lite', lite);
  }
  /* colour bleed: the glass takes on the colours around it (blurred, saturated, masked to the outer body) */
  var tint = nav.querySelector('.thx-nav-tint');
  if (!tint && glass) { tint = document.createElement('div'); tint.className = 'thx-nav-tint'; tint.setAttribute('aria-hidden', 'true'); glass.parentNode.insertBefore(tint, glass.nextSibling); }
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
        if (!lite) { lite = true; nav.classList.add('is-lite'); }                   /* first: single-pass lens, no dispersion, no colour bleed */
        else { refractOK = false; nav.classList.remove('is-refract'); try { sessionStorage.setItem('thx-nav-norefract', '1'); } catch (e) {} }
      }
    })(last);
  }
  /* 4.6.0 (Phase 8): the first lens build (two pixel loops + four PNG encodes, 100-166 ms on a phone) was the page's only
   * long task at load; it now runs after first paint in an idle slot. The CSS blur glass covers the bar until then. */
  function idle(fn) { if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 900 }); else setTimeout(fn, 120); }
  if (refractOK) { raf(function () { idle(function () { buildMap(); }); }); frameBudget(); window.addEventListener('resize', function () { raf(function () { buildMap(); }); }, { passive: true }); window.addEventListener('load', function () { buildMap(); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildMap(); }); }
  API.lens = function (opts) {
    if (opts && typeof opts === 'object') { for (var k in opts) if (k in LENS) LENS[k] = opts[k]; if (refractOK) buildMap(true); }
    return { on: nav.classList.contains('is-refract'), lite: nav.classList.contains('is-lite'), map: [mapW, mapH], params: JSON.parse(JSON.stringify(LENS)) };
  };
  API.setLite = function (on) { lite = !!on; nav.classList.toggle('is-lite', lite); };

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
    clearTimeout(closingT); nav.removeAttribute('data-closing');
    nav.setAttribute('data-open', 'true');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', T('nav.close'));
    panel.removeAttribute('inert'); panel.setAttribute('aria-hidden', 'false');
    lens.tx = 0; lens.ty = 0; lens.on = false; nav.classList.remove('is-lens'); kick();
    lock(); setInert(true);
    var f = panel.querySelector('a[href]');
    setTimeout(function () { if (f) f.focus({ preventScroll: true }); }, 60);
    track('nav_menu_open');
  }
  var closingT = 0;
  function close(restore) {
    if (nav.getAttribute('data-open') !== 'true') return;
    nav.setAttribute('data-open', 'false');
    /* 4.8.0 (Phase 11 SIG-05): the grid row snaps; the panel content slides up on transform, so the box stays open for that long */
    nav.setAttribute('data-closing', 'true'); clearTimeout(closingT); closingT = setTimeout(function () { nav.removeAttribute('data-closing'); }, 440);
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', T('nav.open'));
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
