/*! theodyx-keep.js v1.0.0 (2026-09-18) — "Keep creating." : the page opens from two words.
 * Owner directive: the Clients page must start with literally the anthropic.com/path-to-hope opening — two words alone on the cream,
 * then, on the first scroll, the words drift to opposite corners while the page blooms up between them. Nothing here is a video or a
 * canvas: the words are real text (Google Sans Flex, the site's only face), the bloom is one scrubbable progress value driven by wheel /
 * touch / keys / the "Scroll" pill, and the page underneath scales and fades in around it. The full stop takes the visit's accent
 * (--thx-acc from theodyx-thinking.js) so the opening is in the same colour as the rest of the visit.
 * Mount: load on the page that should open this way. Words come from <body data-thx-keep="Keep creating."> or default to that.
 * Reduced motion: nothing runs. */
(function () {
  'use strict';
  if (window.__thxKeep) return;
  window.__thxKeep = { v: '1.0.0' };
  var RED = false; try { RED = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (RED) return;
  var SANS = '"Google Sans Flex","Google Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  var text = (document.body.getAttribute('data-thx-keep') || 'Keep creating.').replace(/\s+/g, ' ').trim();
  var sp = text.indexOf(' '), w1 = sp > 0 ? text.slice(0, sp) : text, w2 = sp > 0 ? text.slice(sp + 1) : '';
  var m = w2.match(/^(.*?)([.!?…]+)$/), w2core = m ? m[1] : w2, w2mark = m ? m[2] : '';

  /* ---------- stylesheet ---------- */
  var st = document.createElement('style'); st.id = 'thx-keep-css';
  st.textContent = [
    'html.thx-keep-lock,html.thx-keep-lock body{overflow:hidden!important;overscroll-behavior:none}',
    '.thx-keep{position:fixed;inset:0;z-index:940;background:transparent;font-family:' + SANS + ';color:#0d0d0d;overflow:hidden;contain:strict}',
    '.thx-keep-bg{position:absolute;inset:0;background:#f4f2ec;transition:none}',
    '.thx-keep-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '.thx-keep-lines line{stroke:#0d0d0d;stroke-width:1;stroke-dasharray:1;stroke-dashoffset:1;opacity:.55}',
    '.thx-keep-w{position:absolute;top:0;left:0;margin:0;font-weight:400;letter-spacing:-.035em;line-height:.9;white-space:nowrap;font-size:clamp(56px,10.5vw,156px);will-change:transform,opacity;transform-origin:50% 50%}',
    '.thx-keep-w .thx-keep-in{display:inline-block;opacity:0;transform:translateY(.28em);filter:blur(9px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform 1.1s cubic-bezier(.22,1,.36,1),filter .9s ease}',
    '.thx-keep-w:nth-child(3) .thx-keep-in{transition-delay:.14s}',
    '.thx-keep-ready .thx-keep-in{opacity:1;transform:none;filter:blur(0)}',
    '.thx-keep-mark{color:var(--thx-acc,#0d0d0d)}',
    '.thx-keep-pill{position:absolute;left:50%;bottom:30px;transform:translateX(-50%) translateY(10px);display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border:1px solid rgba(13,13,13,.28);border-radius:8px;background:#fff;color:#0d0d0d;font:15px/1 ' + SANS + ';cursor:pointer;opacity:0;transition:opacity .7s ease .9s,transform .7s cubic-bezier(.22,1,.36,1) .9s,border-color .2s}',
    '.thx-keep-ready .thx-keep-pill{opacity:1;transform:translateX(-50%)}',
    '.thx-keep-pill:hover{border-color:#0d0d0d}',
    '.thx-keep-pill svg{width:12px;height:12px}',
    '.thx-keep-stage{will-change:transform,opacity;transform-origin:50% 22%}',
    '@media (max-width:767px){.thx-keep-w{font-size:clamp(46px,15vw,84px)}.thx-keep-pill{bottom:22px}}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- DOM ---------- */
  var root = document.createElement('div'); root.className = 'thx-keep'; root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<div class="thx-keep-bg"></div><svg class="thx-keep-lines" aria-hidden="true"></svg>' +
    '<p class="thx-keep-w"><span class="thx-keep-in"></span></p><p class="thx-keep-w"><span class="thx-keep-in"></span></p>' +
    '<button type="button" class="thx-keep-pill">Scroll <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 1v10M2 7l4 4 4-4"/></svg></button>';
  var ws = root.querySelectorAll('.thx-keep-w'), ins = root.querySelectorAll('.thx-keep-in');
  ins[0].textContent = w1;
  ins[1].textContent = w2core; if (w2mark) { var mk = document.createElement('span'); mk.className = 'thx-keep-mark'; mk.textContent = w2mark; ins[1].appendChild(mk); }
  if (!w2) ws[1].style.display = 'none';
  var bg = root.querySelector('.thx-keep-bg'), svg = root.querySelector('.thx-keep-lines'), pill = root.querySelector('.thx-keep-pill');
  document.body.appendChild(root);
  document.documentElement.classList.add('thx-keep-lock');

  /* the page that blooms in: <main> if the page has one, else the first big wrapper; the fixed nav is left alone */
  var stage = document.querySelector('main') || document.querySelector('.page-wrapper, .ff-page') || null;
  if (stage) { stage.classList.add('thx-keep-stage'); stage.style.opacity = '0'; stage.style.transform = 'scale(.84)'; }

  /* ---------- layout: the words start centred as one line, and end in opposite corners ---------- */
  var L = { vw: 0, vh: 0, a: null, b: null };
  function layout() {
    L.vw = innerWidth; L.vh = innerHeight;
    var gap = Math.round(L.vw * 0.022);
    var r1 = ws[0].getBoundingClientRect(), r2 = w2 ? ws[1].getBoundingClientRect() : { width: 0, height: 0 };
    /* rects are read at scale(1) with no translate: reset first */
    ws[0].style.transform = 'none'; if (w2) ws[1].style.transform = 'none';
    r1 = ws[0].getBoundingClientRect(); r2 = w2 ? ws[1].getBoundingClientRect() : { width: 0, height: 0 };
    var total = r1.width + (w2 ? gap + r2.width : 0), x0 = (L.vw - total) / 2, y0 = (L.vh - r1.height) / 2;
    L.a = { x: x0, y: y0, w: r1.width, h: r1.height, ex: Math.round(L.vw * 0.05), ey: Math.round(L.vh * 0.09), es: 0.62 };
    L.b = { x: x0 + r1.width + gap, y: y0, w: r2.width, h: r2.height, es: 0.62 };
    L.b.ex = L.vw - Math.round(L.vw * 0.05) - r2.width * L.b.es; L.b.ey = L.vh - Math.round(L.vh * 0.1) - r2.height * L.b.es;
    svg.setAttribute('viewBox', '0 0 ' + L.vw + ' ' + L.vh);
    lines();
    render(true);
  }
  /* a handful of thin lines from each word toward the centre, drawn in as the page opens (the graph's connective tissue) */
  var LN = [];
  function lines() {
    svg.innerHTML = ''; LN = [];
    var cx = L.vw / 2, cy = L.vh / 2, pts = [];
    for (var i = 0; i < 7; i++) { var ang = (i / 7) * Math.PI * 2 + 0.6, rad = Math.min(L.vw, L.vh) * (0.14 + (i % 3) * 0.07); pts.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 0.7]); }
    var A = [L.a.ex + L.a.w * L.a.es * 0.5, L.a.ey + L.a.h * L.a.es * 0.5], B = [L.b.ex + L.b.w * L.b.es * 0.5, L.b.ey + L.b.h * L.b.es * 0.5];
    pts.forEach(function (p, i) {
      var from = i % 2 ? B : A, ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('x1', from[0]); ln.setAttribute('y1', from[1]); ln.setAttribute('x2', p[0]); ln.setAttribute('y2', p[1]); ln.setAttribute('pathLength', '1');
      svg.appendChild(ln); LN.push({ el: ln, d: 0.14 + (i / 7) * 0.3 });
    });
  }
  function ease(t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); }
  function place(el, r, p) {
    var s = 1 + (r.es - 1) * p, x = r.x + (r.ex - r.x) * p, y = r.y + (r.ey - r.y) * p;
    el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
    el.style.transformOrigin = '0 0';
  }
  var p = 0, target = 0, shown = 0, done = false, raf = 0, idle = 0;
  function render(force) {
    if (!L.a) return;
    var e = ease(p);
    place(ws[0], L.a, e); if (w2) place(ws[1], L.b, e);
    /* the words fade only at the very end, as the page's own hero arrives */
    var wf = p < 0.82 ? 1 : 1 - (p - 0.82) / 0.18;
    ws[0].style.opacity = wf.toFixed(3); if (w2) ws[1].style.opacity = wf.toFixed(3);
    bg.style.opacity = (p < 0.15 ? 1 : p > 0.78 ? 0 : 1 - (p - 0.15) / 0.63).toFixed(3);
    if (p > 0.03) { pill.style.transition = 'none'; pill.style.opacity = String(Math.max(0, 1 - p * 8)); }
    LN.forEach(function (l) { var t = (p - l.d) / 0.42, v = ease(t); l.el.style.strokeDashoffset = String(1 - v); l.el.style.opacity = String(0.5 * (p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.2))); });
    if (stage) { var se = ease((p - 0.12) / 0.7); stage.style.opacity = se.toFixed(3); stage.style.transform = 'scale(' + (0.84 + 0.16 * se).toFixed(4) + ')'; }
    if (p >= 1 && !done) finish();
  }
  function tick() {
    raf = 0;
    /* follow the input, then, once the opening has begun, carry it home on its own */
    var settle = !idle && target > 0.12 && target < 1;
    if (settle) target = Math.min(1, target + 0.014);
    p += (target - p) * 0.16; if (Math.abs(target - p) < 0.0015) p = target;
    render();
    if (p < 1) raf = requestAnimationFrame(tick);
  }
  function nudge(dp) { if (done) return; target = Math.max(0, Math.min(1, target + dp)); idle = 1; clearTimeout(nudge.t); nudge.t = setTimeout(function () { idle = 0; }, 140); if (!raf) raf = requestAnimationFrame(tick); }
  function go() { if (done) return; target = 1; idle = 0; if (!raf) raf = requestAnimationFrame(tick); }
  function finish() {
    done = true;
    document.documentElement.classList.remove('thx-keep-lock');
    if (stage) { stage.style.opacity = ''; stage.style.transform = ''; stage.classList.remove('thx-keep-stage'); }
    root.style.transition = 'opacity .35s ease'; root.style.opacity = '0'; root.style.pointerEvents = 'none';
    off();
    setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, 400);
    try { window.dispatchEvent(new CustomEvent('thx:keep-done')); } catch (e) {}
  }
  /* ---------- input while the opening owns the page ---------- */
  var ty = null;
  function onWheel(e) { e.preventDefault(); nudge(e.deltaY / 900); }
  function onTouchStart(e) { ty = e.touches[0].clientY; }
  function onTouchMove(e) { if (ty == null) return; e.preventDefault(); var y = e.touches[0].clientY; nudge((ty - y) / 520); ty = y; }
  function onKey(e) { if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter') { e.preventDefault(); go(); } }
  function on() { addEventListener('wheel', onWheel, { passive: false }); addEventListener('touchstart', onTouchStart, { passive: true }); addEventListener('touchmove', onTouchMove, { passive: false }); addEventListener('keydown', onKey); addEventListener('resize', layout); }
  function off() { removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTouchStart); removeEventListener('touchmove', onTouchMove); removeEventListener('keydown', onKey); removeEventListener('resize', layout); }
  pill.addEventListener('click', go);
  root.addEventListener('click', function (e) { if (e.target === root || e.target === bg) go(); });
  on();
  /* ---------- start: wait for the face (capped), then the words rise ---------- */
  var started = false;
  function start() { if (started) return; started = true; layout(); requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('thx-keep-ready'); }); }); }
  var cap = setTimeout(start, 700);
  try { document.fonts.ready.then(function () { clearTimeout(cap); start(); }); } catch (e) { clearTimeout(cap); start(); }
  window.scrollTo(0, 0);
})();
