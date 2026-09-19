/*! theodyx-keep.js v3.0.0 (2026-09-19) — the Clients page opens from a typed line, then the brand mark draws itself.
 * 3.0.0 (owner): "keep creating" is no longer typed text - it is the monoline brand mark (Brand_Identity/Logos_and_Marks/theodyx-keep-creating-w12-t140.draw.svg),
 * split into "keep" and "creating" so the two halves can drift to the corners. Every stroke draws in with the exact per-path timing of the
 * brand file (stroke-dashoffset, 6.0 s in total), in the site's ink. The words stay real vector, so they are crisp at any size.
 * Owner directive (round 2): the line types itself out - "to the creatives", then "creatives" becomes "misfits", then "dreamers" -
 * and then it says "keep creating". No cursor, all lowercase, no lines. On the first scroll "keep" glides to the top-left and
 * "creating" to the bottom-right, very smoothly, while the page blooms up between them. It plays once per visit (sessionStorage).
 * Real text in Google Sans Flex, one scrubbable progress value, the fixed nav stays above it (z 890 < nav 900). Reduced motion: nothing runs.
 * Mount: load on the page that should open this way. */
(function () {
  'use strict';
  if (window.__thxKeep) return;
  window.__thxKeep = { v: '3.0.0' };
  var RED = false; try { RED = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (RED) return;
  try { if (sessionStorage.getItem('thx-keep') === '1') return; sessionStorage.setItem('thx-keep', '1'); } catch (e) {}
  var SANS = '"Google Sans Flex","Google Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  var LEAD = 'to the ', ROLL = ['creatives', 'misfits', 'dreamers'];
  var MARK_KEEP = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-24 -174 470 258\" aria-hidden=\"true\"><defs><clipPath id=\"thc0\"><rect x=\"0\" y=\"-100\" width=\"78\" height=\"100\"/></clipPath></defs><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"12\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" stroke-miterlimit=\"12\"><path d=\"M6 -150 L6 0\" data-k=\"draw\" data-d=\"0.24\" data-t=\"0\" data-len=\"150\"/><g clip-path=\"url(#thc0)\"><path d=\"M6 -44 L86.91 -115.95\" data-k=\"draw\" data-d=\"0.17\" data-t=\"0.24\" data-len=\"108.27\"/></g><path d=\"M28.67 -64.16 L58.8 -18.3 A30.6 30.6 0 0 0 84.37 -4.5 L139.58 -4.5\" data-k=\"draw\" data-d=\"0.22\" data-t=\"0.41\" data-len=\"140.36\"/><path d=\"M94.08 -50 L179.08 -50\" data-k=\"draw\" data-d=\"0.13\" data-t=\"0.63\" data-len=\"85\"/><path d=\"M191.08 -50 A51.5 51.5 0 0 1 190.73 -44 L178.62 -44 A39.5 39.5 0 0 0 179.08 -50 Z\" fill=\"currentColor\" stroke=\"none\" data-k=\"fade\" data-d=\".01\" data-t=\"0.76\"/><path d=\"M185.08 -50 A45.5 45.5 0 1 0 139.58 -4.5 L254.34 -4.5 A45.5 45.5 0 0 0 283.59 -15.14\" data-k=\"draw\" data-d=\"0.57\" data-t=\"0.77\" data-len=\"360.74\"/><path d=\"M208.84 -50 L293.84 -50\" data-k=\"draw\" data-d=\"0.13\" data-t=\"1.34\" data-len=\"85\"/><path d=\"M305.84 -50 A51.5 51.5 0 0 1 305.49 -44 L293.38 -44 A39.5 39.5 0 0 0 293.84 -50 Z\" fill=\"currentColor\" stroke=\"none\" data-k=\"fade\" data-d=\".01\" data-t=\"1.47\"/><path d=\"M299.84 -50 A45.5 45.5 0 1 0 254.34 -4.5\" data-k=\"draw\" data-d=\"0.34\" data-t=\"1.48\" data-len=\"214.22\"/><path d=\"M326.12 -100 L326.12 60\" data-k=\"draw\" data-d=\"0.25\" data-t=\"1.82\" data-len=\"160\"/><path d=\"M371.62 -95.5 A45.5 45.5 0 0 0 371.62 -4.5 A45.5 45.5 0 0 0 371.62 -95.5\" data-k=\"draw\" data-d=\"0.45\" data-t=\"2.07\" data-len=\"285.43\"/></g></svg>";
  var MARK_CREATING = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"470 -174 769.43 258\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"12\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" stroke-miterlimit=\"12\"><path d=\"M598.43 -80.45 A45.5 45.5 0 1 0 564.62 -4.5 L584.92 -4.5 A49.3 49.3 0 0 0 634.22 -53.8 L634.22 -100\" data-k=\"draw\" data-d=\"0.51\" data-t=\"2.52\" data-len=\"324.87\"/><path d=\"M634.22 -66.6 A28.9 28.9 0 0 1 685.25 -85.18\" data-k=\"draw\" data-d=\"0.11\" data-t=\"3.03\" data-len=\"70.6\"/><path d=\"M705.93 -50 L790.93 -50\" data-k=\"draw\" data-d=\"0.13\" data-t=\"3.14\" data-len=\"85\"/><path d=\"M802.93 -50 A51.5 51.5 0 0 1 802.58 -44 L790.47 -44 A39.5 39.5 0 0 0 790.93 -50 Z\" fill=\"currentColor\" stroke=\"none\" data-k=\"fade\" data-d=\".01\" data-t=\"3.28\"/><path d=\"M796.93 -50 A45.5 45.5 0 1 0 780.68 -15.14\" data-k=\"draw\" data-d=\"0.39\" data-t=\"3.29\" data-len=\"245.89\"/><path d=\"M820.69 -61.5 A34 34 0 0 1 888.69 -61.5 L888.69 0\" data-k=\"draw\" data-d=\"0.26\" data-t=\"3.67\" data-len=\"168.27\"/><path d=\"M861.19 -59.5 A27.5 27.5 0 0 0 861.19 -4.5 A27.5 27.5 0 0 0 861.19 -59.5\" data-k=\"draw\" data-d=\"0.27\" data-t=\"3.94\" data-len=\"172.51\"/><path d=\"M932.79 -130 L932.79 -35.78 A31.28 31.28 0 0 0 964.07 -4.5 A31.28 31.28 0 0 0 995.35 -35.78 L995.35 -100\" data-k=\"draw\" data-d=\"0.4\" data-t=\"4.21\" data-len=\"256.7\"/><path d=\"M906.79 -94 L958.79 -94\" data-k=\"draw\" data-d=\"0.08\" data-t=\"4.61\" data-len=\"52\"/><path d=\"M989.35 -107.2 L1001.35 -107.2 L1001.35 -119.2 L989.35 -119.2 Z\" fill=\"currentColor\" stroke=\"none\" data-k=\"fade\" data-d=\".01\" data-t=\"4.69\"/><path d=\"M1024.15 -100 L1024.15 0\" data-k=\"draw\" data-d=\"0.16\" data-t=\"4.71\" data-len=\"100\"/><path d=\"M1024.15 -61.5 A34 34 0 0 1 1092.15 -61.5 L1092.15 -53.8 A49.3 49.3 0 0 0 1141.45 -4.5 L1163.93 -4.5\" data-k=\"draw\" data-d=\"0.34\" data-t=\"4.86\" data-len=\"214.38\"/><path d=\"M1163.93 -4.5 A45.5 45.5 0 0 0 1163.93 -95.5 A45.5 45.5 0 0 0 1163.93 -4.5\" data-k=\"draw\" data-d=\"0.45\" data-t=\"5.2\" data-len=\"285.43\"/><path d=\"M1209.43 -100 L1209.43 42 A12 12 0 0 1 1197.43 54 L1135.09 54\" data-k=\"draw\" data-d=\"0.35\" data-t=\"5.65\" data-len=\"223.19\"/></g></svg>";

  var st = document.createElement('style'); st.id = 'thx-keep-css';
  st.textContent = [
    'html.thx-keep-lock,html.thx-keep-lock body{overflow:hidden!important;overscroll-behavior:none}',
    '.thx-keep{position:fixed;inset:0;z-index:890;background:transparent;font-family:' + SANS + ';color:#0d0d0d;overflow:hidden;contain:strict}',
    '.thx-keep-bg{position:absolute;inset:0;background:#f4f2ec}',
    '.thx-keep-type{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);margin:0;padding:0 5vw;text-align:center;font-weight:400;letter-spacing:-.03em;line-height:1;font-size:clamp(40px,7.2vw,112px);white-space:nowrap;transition:opacity .45s ease}',
    '.thx-keep-w{position:absolute;top:0;left:0;margin:0;line-height:0;will-change:transform,opacity;transform-origin:0 0;opacity:0;transition:opacity .4s ease}',
    '.thx-keep-w svg{display:block;height:var(--thx-mark-h,clamp(64px,13.6vw,224px));width:auto;color:#0d0d0d;overflow:visible}',
    '.thx-keep-final .thx-keep-w{opacity:1}',
    '.thx-keep-pill{position:absolute;left:50%;bottom:30px;transform:translateX(-50%) translateY(10px);display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border:1px solid rgba(13,13,13,.28);border-radius:8px;background:#fff;color:#0d0d0d;font:15px/1 ' + SANS + ';cursor:pointer;opacity:0;transition:opacity .7s ease,transform .7s cubic-bezier(.22,1,.36,1),border-color .2s}',
    '.thx-keep-drawn .thx-keep-pill{opacity:1;transform:translateX(-50%)}',
    '.thx-keep-pill:hover{border-color:#0d0d0d}.thx-keep-pill svg{width:12px;height:12px}',
    '.thx-keep-stage{will-change:transform,opacity;transform-origin:50% 22%}',
    '@media (max-width:767px){.thx-keep-type{font-size:clamp(30px,9.6vw,60px)}.thx-keep-w svg{height:17.5vw}.thx-keep-pill{bottom:22px}}'
  ].join('\n');
  document.head.appendChild(st);

  var root = document.createElement('div'); root.className = 'thx-keep'; root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<div class="thx-keep-bg"></div><p class="thx-keep-type"></p><p class="thx-keep-w"></p><p class="thx-keep-w"></p>' +
    '<button type="button" class="thx-keep-pill">scroll <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 1v10M2 7l4 4 4-4"/></svg></button>';
  var bg = root.querySelector('.thx-keep-bg'), typeEl = root.querySelector('.thx-keep-type'), ws = root.querySelectorAll('.thx-keep-w'), pill = root.querySelector('.thx-keep-pill');
  ws[0].innerHTML = MARK_KEEP; ws[1].innerHTML = MARK_CREATING;
  var strokes = [].slice.call(root.querySelectorAll('.thx-keep-w path[data-k]'));
  strokes.forEach(function (p) { var l = p.getAttribute('data-len'); if (l) { p.style.strokeDasharray = l + 'px'; p.style.strokeDashoffset = l + 'px'; } else p.style.opacity = '0'; });
  document.body.appendChild(root);
  document.documentElement.classList.add('thx-keep-lock');
  var stage = document.querySelector('main') || document.querySelector('.page-wrapper, .ff-page') || null;
  if (stage) { stage.classList.add('thx-keep-stage'); stage.style.opacity = '0'; stage.style.transform = 'scale(.86)'; }

  /* ---------- 1. the typed line ---------- */
  var timers = [], final = false, drawn = false;
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function typeText(target, from, to, cb) {
    /* delete back to the shared prefix, then type the rest, one character at a time */
    var i = 0; while (i < from.length && i < to.length && from[i] === to[i]) i++;
    var cur = from;
    function del() { if (cur.length > i) { cur = cur.slice(0, -1); target.textContent = cur; later(del, 34); } else add(); }
    function add() { if (cur.length < to.length) { cur = to.slice(0, cur.length + 1); target.textContent = cur; later(add, 52 + Math.random() * 30); } else cb && cb(); }
    del();
  }
  function script() {
    var line = LEAD + ROLL[0];
    typeText(typeEl, '', line, function () {
      later(function () { typeText(typeEl, line, LEAD + ROLL[1], function () {
        later(function () { typeText(typeEl, LEAD + ROLL[1], LEAD + ROLL[2], function () {
          later(toFinal, 1100);
        }); }, 760);
      }); }, 760);
    });
  }
  function toFinal() {
    if (final) return; final = true; timers.forEach(clearTimeout); timers = [];
    typeEl.style.opacity = '0';
    setTimeout(function () {
      typeEl.style.display = 'none'; layout(); root.classList.add('thx-keep-final');
      /* the brand file's own choreography: each stroke draws (or a joint fades in) at its authored delay and duration */
      var end = 0;
      strokes.forEach(function (p) {
        var d = parseFloat(p.getAttribute('data-d')) * 1000, t = parseFloat(p.getAttribute('data-t')) * 1000; end = Math.max(end, d + t);
        if (p.getAttribute('data-k') === 'draw') p.animate([{ strokeDashoffset: p.getAttribute('data-len') + 'px' }, { strokeDashoffset: '0px' }], { duration: d, delay: t, easing: 'linear', fill: 'forwards' });
        else p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: Math.max(d, 10), delay: t, easing: 'linear', fill: 'forwards' });
      });
      drawn = false; setTimeout(function () { drawn = true; root.classList.add('thx-keep-drawn'); }, end + 150);
    }, 460);
  }

  /* ---------- 2. layout: centred as one line, ending in opposite corners ---------- */
  var L = null;
  function layout() {
    ws[0].style.transform = 'none'; ws[1].style.transform = 'none';
    var vw = innerWidth, vh = innerHeight, gap = Math.round(vw * 0.022);
    var r1 = ws[0].getBoundingClientRect(), r2 = ws[1].getBoundingClientRect();
    var total = r1.width + gap + r2.width, x0 = (vw - total) / 2, y0 = (vh - r1.height) / 2, es = 0.62;
    L = { a: { x: x0, y: y0, ex: Math.round(vw * 0.05), ey: Math.round(vh * 0.11), es: es },
          b: { x: x0 + r1.width + gap, y: y0, ex: vw - Math.round(vw * 0.05) - r2.width * es, ey: vh - Math.round(vh * 0.1) - r2.height * es, es: es } };
    render();
  }
  function ease(t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); }
  function smooth(t) { return t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t); }
  function place(el, r, p) {
    var s = 1 + (r.es - 1) * p, x = r.x + (r.ex - r.x) * p, y = r.y + (r.ey - r.y) * p;
    el.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
  }
  var p = 0, target = 0, done = false, raf = 0, idle = 0;
  function render() {
    if (!L) return;
    var e = smooth(p);
    place(ws[0], L.a, e); place(ws[1], L.b, e);
    var wf = p < 0.86 ? 1 : 1 - (p - 0.86) / 0.14;
    ws[0].style.opacity = ws[1].style.opacity = wf.toFixed(3);
    bg.style.opacity = (p < 0.12 ? 1 : p > 0.8 ? 0 : 1 - smooth((p - 0.12) / 0.68)).toFixed(3);
    if (p > 0.02) { pill.style.transition = 'none'; pill.style.opacity = String(Math.max(0, 1 - p * 8)); }
    if (stage) { var se = smooth((p - 0.1) / 0.75); stage.style.opacity = se.toFixed(3); stage.style.transform = 'scale(' + (0.86 + 0.14 * se).toFixed(4) + ')'; }
    if (p >= 1 && !done) finish();
  }
  function tick() {
    raf = 0;
    if (!idle && target > 0.1 && target < 1) target = Math.min(1, target + 0.006);
    p += (target - p) * 0.06; if (Math.abs(target - p) < 0.001) p = target;
    render();
    if (p < 1) raf = requestAnimationFrame(tick);
  }
  function nudge(dp) { if (done) return; if (!final) { toFinal(); return; } if (!L || !drawn) return; target = Math.max(0, Math.min(1, target + dp)); idle = 1; clearTimeout(nudge.t); nudge.t = setTimeout(function () { idle = 0; }, 160); if (!raf) raf = requestAnimationFrame(tick); }
  function go() { if (done) return; if (!final) { toFinal(); setTimeout(go, 520); return; } if (!drawn) { setTimeout(go, 300); return; } target = 1; idle = 0; if (!raf) raf = requestAnimationFrame(tick); }
  function finish() {
    done = true;
    document.documentElement.classList.remove('thx-keep-lock');
    if (stage) { stage.style.opacity = ''; stage.style.transform = ''; stage.classList.remove('thx-keep-stage'); }
    root.style.transition = 'opacity .35s ease'; root.style.opacity = '0'; root.style.pointerEvents = 'none';
    off(); setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, 400);
    try { window.dispatchEvent(new CustomEvent('thx:keep-done')); } catch (e) {}
  }
  var ty = null;
  function onWheel(e) { e.preventDefault(); nudge(e.deltaY / 1100); }
  function onTouchStart(e) { ty = e.touches[0].clientY; }
  function onTouchMove(e) { if (ty == null) return; e.preventDefault(); var y = e.touches[0].clientY; nudge((ty - y) / 600); ty = y; }
  function onKey(e) { if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter') { e.preventDefault(); go(); } }
  function onResize() { if (final && !done) layout(); }
  function on() { addEventListener('wheel', onWheel, { passive: false }); addEventListener('touchstart', onTouchStart, { passive: true }); addEventListener('touchmove', onTouchMove, { passive: false }); addEventListener('keydown', onKey); addEventListener('resize', onResize); }
  function off() { removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTouchStart); removeEventListener('touchmove', onTouchMove); removeEventListener('keydown', onKey); removeEventListener('resize', onResize); }
  pill.addEventListener('click', go);
  root.addEventListener('click', function (e) { if (e.target === root || e.target === bg) go(); });
  on();
  var started = false;
  function start() { if (started) return; started = true; later(script, 350); }
  var cap = setTimeout(start, 700);
  try { document.fonts.ready.then(function () { clearTimeout(cap); start(); }); } catch (e) { clearTimeout(cap); start(); }
  window.scrollTo(0, 0);
})();
