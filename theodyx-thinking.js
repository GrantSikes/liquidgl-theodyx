/*! theodyx-thinking.js v1.3.2 (2026-09-13) — the Our Thinking system: editorial carousels (.thk-track), the hub's search +
 * facet filter (.thk-hub), and the card polish shared by the homepage band, /our-thinking and the alumni page.
 * Carousel: prev/next arrows glide one card at a time (snap-safe: scroll-snap is lifted during the rAF tween, exactly as the
 * Ethos carousel fix of 2026-07-28 - Chrome swallows smooth scrollTo on a mandatory-snap container), a 6.5 s autoplay that
 * loops, is viewport + document.hidden gated, pauses while hovered WITHOUT latching, and stops for good on real intent (a
 * horizontal wheel, a horizontal touch move, a pointerdown inside the strip, an arrow click). Reduced motion = no autoplay.
 * Hub: the search box and the section chips filter the story grid client-side (title + description + kicker), a Load-more
 * reveals 12 at a time, empty bands hide with their heading. Cards with an empty kicker lose the separator. No dependencies. */
(function () {
  'use strict';
  if (window.__thxThinking) return;
  var API = window.__thxThinking = { v: '1.3.2' };
  /* 1.3.0 (owner: "when you click search our thinking it makes that large black border - remove it"): the site-wide two-tone focus ring (head, Phase 9) is lifted off the hub search input; the pill itself carries a soft focus-within state (native style) */
  (function () { var st = document.createElement('style'); st.id = 'thx-thk-css'; st.textContent = 'html body input.thk-search-in:focus-visible,html body input.thk-search-in:focus{box-shadow:none!important;outline:none!important;border:0!important}'; document.head.appendChild(st); })();
  function q(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var RED = function () { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };

  /* ---------- slug carriers: cards whose link is empty resolve from the hidden slug paragraph ---------- */
  q('.thk-slug').forEach(function (s) {
    var a = s.closest('a'); var t = (s.textContent || '').trim(); if (!a || !t) return;
    var h = a.getAttribute('href') || '';
    if (h === '' || h === '#' || h === '/our-thinking') a.setAttribute('href', t.charAt(0) === '/' ? t : '/our-thinking/' + t);
  });
  /* ---------- meta polish: an empty kicker or date drops out with its separator ---------- */
  q('.thk-meta').forEach(function (m) {
    q(':scope > *', m).forEach(function (el) { if (!(el.textContent || '').trim()) el.parentNode.removeChild(el); });
  });

  /* ---------- carousels ---------- */
  function carousel(track) {
    var list = track.querySelector('.thk-list') || track.querySelector('.w-dyn-items') || track.querySelector('[data-thk-list]') || [].filter.call(track.children, function (c) { return c.children.length > 1; })[0]; if (!list) return; /* 1.3.1: a static strip (the homepage What we do cards) may mark its list with data-thk-list; 1.3.2: otherwise the first child that holds several items is the list */
    var band = track.closest('.thk-band, section, .thxo-sec') || track;
    var prev = band.querySelector('.thk-arrow[data-dir="prev"]'), next = band.querySelector('.thk-arrow[data-dir="next"]');
    var stopped = false, hover = false, tweening = false, timer = 0, STEP_MS = 6500;
    function items() { return q(':scope > *', list).filter(function (el) { return el.offsetParent !== null; }); }
    function snapTargets() { var base = list.scrollLeft, pl = parseFloat(getComputedStyle(list).paddingLeft) || 0; return items().map(function (el) { return el.getBoundingClientRect().left - list.getBoundingClientRect().left + base - pl; }); }
    function glide(to) {
      if (tweening) return; var from = list.scrollLeft; var max = list.scrollWidth - list.clientWidth; to = Math.max(0, Math.min(max, to));
      if (Math.abs(to - from) < 2) return;
      if (RED()) { list.scrollLeft = to; return; }
      tweening = true; var snap = list.style.scrollSnapType; list.style.scrollSnapType = 'none';
      var t0 = 0, D = 620;
      function ease(x) { return 1 - Math.pow(1 - x, 3); }
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / D); list.scrollLeft = from + (to - from) * ease(p); if (p < 1) raf(step); else { list.style.scrollSnapType = snap; tweening = false; } }
      raf(step);
    }
    function index() { var s = snapTargets(), x = list.scrollLeft, best = 0; for (var i = 0; i < s.length; i++) if (s[i] <= x + 4) best = i; return best; }
    function go(d, user) {
      if (user) stopped = true;
      var s = snapTargets(); if (!s.length) return; var i = index() + d;
      var max = list.scrollWidth - list.clientWidth;
      if (i >= s.length || (d > 0 && list.scrollLeft >= max - 2)) { i = 0; }
      if (i < 0) i = s.length - 1;
      glide(s[i]);
    }
    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); go(-1, true); });
    if (next) next.addEventListener('click', function (e) { e.preventDefault(); go(1, true); });
    list.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1, true); } });
    if (!list.hasAttribute('tabindex')) list.setAttribute('tabindex', '0');
    /* real intent only: a horizontal wheel, a horizontal touch move, a pointerdown in the strip */
    list.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) stopped = true; }, { passive: true });
    var tx = 0, ty = 0;
    list.addEventListener('touchstart', function (e) { var t = e.touches[0]; tx = t.clientX; ty = t.clientY; }, { passive: true });
    list.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (Math.abs(t.clientX - tx) > Math.abs(t.clientY - ty) + 6) stopped = true; }, { passive: true });
    list.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') stopped = true; });
    list.addEventListener('mouseenter', function () { hover = true; }); list.addEventListener('mouseleave', function () { hover = false; });
    var seen = false;
    if (window.IntersectionObserver) { new IntersectionObserver(function (x) { x.forEach(function (o) { seen = o.isIntersecting; }); }, { threshold: 0.35 }).observe(track); } else seen = true;
    function tick() { if (stopped || RED()) return; if (seen && !hover && !document.hidden && list.scrollWidth > list.clientWidth + 8) go(1, false); timer = setTimeout(tick, STEP_MS); }
    if (track.getAttribute('data-thk-auto') !== 'off') timer = setTimeout(tick, STEP_MS);
    /* arrows fade when there is nothing to scroll */
    function arrows() { var can = list.scrollWidth > list.clientWidth + 8; [prev, next].forEach(function (b) { if (b) { b.style.opacity = can ? '' : '.35'; b.setAttribute('aria-disabled', can ? 'false' : 'true'); } }); }
    arrows(); addEventListener('resize', arrows, { passive: true });
    track.dataset.thkReady = '1';
  }
  q('.thk-track').forEach(carousel);

  /* ---------- hub: search + chips + load more ---------- */
  function hub(root) {
    var grid = root.querySelector('.thk-grid'); if (!grid) return;
    var cards = q(':scope > *', grid), N = 12, n = N, needle = '', cat = '';
    var input = root.querySelector('.thk-search input, input.thk-search'), chips = q('.thk-chip', root), more = root.querySelector('.thk-more-btn'), count = root.querySelector('.thk-count');
    function txt(c) { return (c.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
    function kicker(c) { var k = c.querySelector('.thk-kicker'); return k ? (k.textContent || '').trim() : ''; }
    function apply() {
      var v = cards.filter(function (c) { return (!cat || kicker(c) === cat) && (!needle || txt(c).indexOf(needle) > -1); });
      cards.forEach(function (c) { c.style.display = 'none'; });
      v.slice(0, n).forEach(function (c) { c.style.display = ''; });
      if (more) more.style.display = v.length > n ? '' : 'none';
      if (count) count.textContent = v.length ? (v.length + (v.length === 1 ? ' piece' : ' pieces')) : 'Nothing matches yet';
      var empty = root.querySelector('.thk-empty'); if (empty) empty.style.display = v.length ? 'none' : '';
    }
    if (input) { var t = 0; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { needle = input.value.trim().toLowerCase(); n = N; apply(); }, 120); }); }
    chips.forEach(function (ch) { ch.addEventListener('click', function (e) { e.preventDefault(); chips.forEach(function (x) { x.classList.remove('thk-chip-on'); x.setAttribute('aria-pressed', 'false'); }); ch.classList.add('thk-chip-on'); ch.setAttribute('aria-pressed', 'true'); cat = ch.getAttribute('data-cat') || ''; n = N; apply(); }); });
    if (more) more.addEventListener('click', function (e) { e.preventDefault(); n += N; apply(); });
    /* a hash like #podcast pre-selects a chip */
    var h = (location.hash || '').replace('#', '').toLowerCase();
    if (h) chips.forEach(function (ch) { if ((ch.getAttribute('data-cat') || '').toLowerCase() === h) ch.click(); });
    apply();
    /* section bands with no cards hide with their heading */
    q('.thk-secband', root).forEach(function (b) { var l = b.querySelector('.w-dyn-items'); if (!l || !l.children.length) b.style.display = 'none'; });
  }
  q('.thk-hub').forEach(hub);
  /* ---------- capabilities index (/our-capabilities): kind chips show one group, the search narrows every row by name + deck ---------- */
  function capIndex(root) {
    var groups = q('[data-cap="group"]', root), rows = q('.thk-row', root), tools = document.querySelector('[data-cap="tools"]') || root;
    var input = tools.querySelector('input'), chips = q('.thk-chip[data-kind]', tools), count = tools.querySelector('.thk-count'), empty = root.querySelector('[data-cap="empty"]');
    var kind = '', needle = '';
    function txt(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
    function apply() {
      var shown = 0;
      groups.forEach(function (g) {
        var on = !kind || g.getAttribute('data-kind') === kind, n = 0;
        q('.thk-row', g).forEach(function (r) { var ok = on && (!needle || txt(r).indexOf(needle) > -1); r.style.display = ok ? '' : 'none'; if (ok) n++; });
        g.style.display = on && (n || !needle) ? '' : 'none'; shown += n;
      });
      if (count) count.textContent = shown ? shown + (shown === 1 ? ' capability' : ' capabilities') : 'No match yet';
      if (empty) empty.style.display = shown ? 'none' : '';
    }
    if (input) { var t = 0; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { needle = input.value.trim().toLowerCase(); apply(); }, 120); }); }
    chips.forEach(function (ch) { ch.addEventListener('click', function (e) { e.preventDefault(); chips.forEach(function (x) { x.classList.remove('thk-chip-on'); x.setAttribute('aria-pressed', 'false'); }); ch.classList.add('thk-chip-on'); ch.setAttribute('aria-pressed', 'true'); kind = ch.getAttribute('data-kind') || ''; apply(); if (kind) { var g = root.querySelector('[data-cap="group"][data-kind="' + kind + '"]'); if (g) g.scrollIntoView({ behavior: RED() ? 'auto' : 'smooth', block: 'start' }); } }); });
    var h = (location.hash || '').replace('#cap-', '').toLowerCase();
    var pre = { practices: 'Practice', industries: 'Industry', innovation: 'Innovation' }[h];
    if (pre) chips.forEach(function (ch) { if (ch.getAttribute('data-kind') === pre) ch.click(); }); else apply();
  }
  q('[data-cap="index"]').forEach(capIndex);
  /* ---------- people profile: the vCard is generated from what the page shows (name, role, email, phone, office, address, photo);
     an uploaded .vcf (data-ppl-file on the button) wins. Capability tags become chips that link to /capabilities/<slug>. ---------- */
  function slugify(t) { return (t || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function vtext(sel) { var el = document.querySelector(sel); return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function vEsc(v) { return String(v).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\;'); }
  function buildVcard() {
    var name = vtext('[data-ppl="name"]'), role = vtext('[data-ppl="role"]'), email = vtext('[data-ppl="email"]'), phone = vtext('[data-ppl="phone"]');
    var office = vtext('[data-ppl="office"]'), address = vtext('[data-ppl="address"]'), img = document.querySelector('[data-ppl="photo"] img');
    var parts = name.split(' '), last = parts.length > 1 ? parts.pop() : '', first = parts.join(' ');
    var adr = address ? address.split(/\s*,\s*/) : [];
    var L = ['BEGIN:VCARD', 'VERSION:3.0', 'N:' + vEsc(last) + ';' + vEsc(first) + ';;;', 'FN:' + vEsc(name), 'ORG:Theodyx Inc.'];
    if (role) L.push('TITLE:' + vEsc(role));
    if (email) L.push('EMAIL;TYPE=INTERNET,WORK:' + email);
    if (phone) L.push('TEL;TYPE=WORK,VOICE:' + phone.replace(/[^+\d]/g, ''));
    if (adr.length) L.push('ADR;TYPE=WORK:;;' + vEsc(adr[0] || '') + ';' + vEsc(adr[1] || '') + ';' + vEsc((adr[2] || '').replace(/\s*\d{5}(-\d{4})?$/, '')) + ';' + vEsc(((adr[2] || '').match(/\d{5}(-\d{4})?$/) || [''])[0]) + ';' + vEsc(adr[3] || ''));
    if (office) L.push('NOTE:' + vEsc(office + ' office'));
    L.push('URL:' + location.href.split('#')[0]);
    if (img && img.currentSrc) L.push('PHOTO;VALUE=URI:' + img.currentSrc);
    L.push('REV:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), 'END:VCARD');
    return L.join('\r\n') + '\r\n';
  }
  q('[data-ppl="vcard"], [data-ppl="vcard2"]').forEach(function (a) {
    var file = a.getAttribute('data-ppl-file');
    if (file) { a.setAttribute('href', file); a.setAttribute('download', ''); return; }
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var name = vtext('[data-ppl="name"]') || 'contact', blob = new Blob([buildVcard()], { type: 'text/vcard;charset=utf-8' });
      var url = URL.createObjectURL(blob), l = document.createElement('a'); l.href = url; l.download = slugify(name) + '.vcf'; document.body.appendChild(l); l.click();
      setTimeout(function () { document.body.removeChild(l); URL.revokeObjectURL(url); }, 800);
      try { if (typeof window.__thxTrack === 'function') window.__thxTrack('vcard_download', slugify(name)); } catch (err) {}
    });
  });
  q('[data-ppl="tags"]').forEach(function (p) {
    var names = (p.textContent || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    if (!names.length) { var sec = p.closest('section'); if (sec) sec.style.display = 'none'; return; }
    var wrap = document.createElement('div'); wrap.className = 'thk-chips';
    names.forEach(function (n) { var a = document.createElement('a'); a.className = 'thk-chip'; a.href = '/capabilities/' + slugify(n); a.textContent = n; wrap.appendChild(a); });
    p.parentNode.replaceChild(wrap, p);
  });
  /* the people index reuses the hub filter: department is the card kicker, so the chips match on it */
})();
