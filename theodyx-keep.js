/*! theodyx-keep.js v2.0.0 (2026-09-18) — the Clients page opens from a typed line.
 * Owner directive (round 2): the line types itself out - "to the creatives", then "creatives" becomes "misfits", then "dreamers" -
 * and then it says "keep creating". No cursor, all lowercase, no lines. On the first scroll "keep" glides to the top-left and
 * "creating" to the bottom-right, very smoothly, while the page blooms up between them. It plays once per visit (sessionStorage).
 * Real text in Google Sans Flex, one scrubbable progress value, the fixed nav stays above it (z 890 < nav 900). Reduced motion: nothing runs.
 * Mount: load on the page that should open this way. */
(function () {
  'use strict';
  if (window.__thxKeep) return;
  window.__thxKeep = { v: '2.0.0' };
  var RED = false; try { RED = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (RED) return;
  try { if (sessionStorage.getItem('thx-keep') === '1') return; sessionStorage.setItem('thx-keep', '1'); } catch (e) {}
  var SANS = '"Google Sans Flex","Google Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  var LEAD = 'to the ', ROLL = ['creatives', 'misfits', 'dreamers'], W1 = 'keep', W2 = 'creating';

  var st = document.createElement('style'); st.id = 'thx-keep-css';
  st.textContent = [
    'html.thx-keep-lock,html.thx-keep-lock body{overflow:hidden!important;overscroll-behavior:none}',
    '.thx-keep{position:fixed;inset:0;z-index:890;background:transparent;font-family:' + SANS + ';color:#0d0d0d;overflow:hidden;contain:strict}',
    '.thx-keep-bg{position:absolute;inset:0;background:#f4f2ec}',
    '.thx-keep-type{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);margin:0;padding:0 5vw;text-align:center;font-weight:400;letter-spacing:-.03em;line-height:1;font-size:clamp(40px,7.2vw,112px);white-space:nowrap;transition:opacity .45s ease}',
    '.thx-keep-w{position:absolute;top:0;left:0;margin:0;font-weight:400;letter-spacing:-.035em;line-height:.9;white-space:nowrap;font-size:clamp(56px,10.5vw,156px);will-change:transform,opacity;transform-origin:0 0;opacity:0;transition:opacity .7s ease}',
    '.thx-keep-final .thx-keep-w{opacity:1}',
    '.thx-keep-pill{position:absolute;left:50%;bottom:30px;transform:translateX(-50%) translateY(10px);display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border:1px solid rgba(13,13,13,.28);border-radius:8px;background:#fff;color:#0d0d0d;font:15px/1 ' + SANS + ';cursor:pointer;opacity:0;transition:opacity .7s ease,transform .7s cubic-bezier(.22,1,.36,1),border-color .2s}',
    '.thx-keep-final .thx-keep-pill{opacity:1;transform:translateX(-50%)}',
    '.thx-keep-pill:hover{border-color:#0d0d0d}.thx-keep-pill svg{width:12px;height:12px}',
    '.thx-keep-stage{will-change:transform,opacity;transform-origin:50% 22%}',
    '@media (max-width:767px){.thx-keep-type{font-size:clamp(30px,9.6vw,60px)}.thx-keep-w{font-size:clamp(46px,15vw,84px)}.thx-keep-pill{bottom:22px}}'
  ].join('\n');
  document.head.appendChild(st);

  var root = document.createElement('div'); root.className = 'thx-keep'; root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<div class="thx-keep-bg"></div><p class="thx-keep-type"></p><p class="thx-keep-w"></p><p class="thx-keep-w"></p>' +
    '<button type="button" class="thx-keep-pill">scroll <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 1v10M2 7l4 4 4-4"/></svg></button>';
  var bg = root.querySelector('.thx-keep-bg'), typeEl = root.querySelector('.thx-keep-type'), ws = root.querySelectorAll('.thx-keep-w'), pill = root.querySelector('.thx-keep-pill');
  ws[0].textContent = W1; ws[1].textContent = W2;
  document.body.appendChild(root);
  document.documentElement.classList.add('thx-keep-lock');
  var stage = document.querySelector('main') || document.querySelector('.page-wrapper, .ff-page') || null;
  if (stage) { stage.classList.add('thx-keep-stage'); stage.style.opacity = '0'; stage.style.transform = 'scale(.86)'; }

  /* ---------- 1. the typed line ---------- */
  var timers = [], final = false;
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
    setTimeout(function () { typeEl.style.display = 'none'; layout(); root.classList.add('thx-keep-final'); }, 460);
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
  function nudge(dp) { if (done) return; if (!final) { toFinal(); return; } if (!L) return; target = Math.max(0, Math.min(1, target + dp)); idle = 1; clearTimeout(nudge.t); nudge.t = setTimeout(function () { idle = 0; }, 160); if (!raf) raf = requestAnimationFrame(tick); }
  function go() { if (done) return; if (!final) { toFinal(); setTimeout(go, 520); return; } target = 1; idle = 0; if (!raf) raf = requestAnimationFrame(tick); }
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
