/*! theodyx-thinking.js v1.9.2 (2026-09-18) — the Our Thinking system: editorial carousels (.thk-track), the hub's search +
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
  var API = window.__thxThinking = { v: '1.9.2' };
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
    /* 1.4.0 (a11y): the arrows are keyboard buttons too (Enter / Space), and the strip announces itself as a carousel */
    [prev, next].forEach(function (b) { if (!b) return; if (!b.hasAttribute('role')) b.setAttribute('role', 'button'); if (!b.hasAttribute('tabindex')) b.setAttribute('tabindex', '0'); b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } }); });
    if (!list.hasAttribute('role')) list.setAttribute('role', 'region'); if (!list.hasAttribute('aria-roledescription')) list.setAttribute('aria-roledescription', 'carousel'); if (!list.hasAttribute('aria-label')) { var hd = band.querySelector('h2,h3'); list.setAttribute('aria-label', hd ? (hd.textContent || '').trim().slice(0, 80) : 'Carousel'); }
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

  /* ---------- 1.6.0 (2026-09-14, owner: "the blend way better, a ton more hues, smooth, and the synced colour on a few more sections") ----------
     One accent per page load, drawn from the whole hue circle (not a list). Its lightness is solved in the browser so that white-on-accent
     AND accent-on-cream both clear WCAG AA 4.5:1, whatever hue lands. The variables live on <html> (--thx-h / --thx-s / --thx-l / --thx-acc)
     so every tinted piece on the page agrees: the Our Thinking band (a tint that fades in from the cream and back out, three soft drifting
     glows in the hue and its neighbours, the closing words of the heading), and on Home the ghost pills, carousel arrows and card links of
     "Where to start", "Your ambition, our expertise" and the closing "Make something" CTA. Body copy stays black. Reduced motion = no drift. */
  (function accent() {
    /* 1.7.0: the accent is site-wide - every page draws one, so pills, arrows and links agree everywhere; only the band itself needs #thk-home */
    var band = document.getElementById('thk-home'); if (document.documentElement.classList.contains('thx-hue')) return;
    function rgb(h, s, l) { /* hsl -> [r,g,b] 0..1 */
      var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
      if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
      return [r + m, g + m, b + m];
    }
    function lum(p) { return p.map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0); }
    function ratio(a, b) { var hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); }
    var CREAM = lum([0xf4 / 255, 0xf2 / 255, 0xec / 255]), WHITE = 1;
    var h = Math.floor(Math.random() * 360), s = 0.58 + Math.random() * 0.14, l = 0.5;
    for (var L = 0.52; L >= 0.2; L -= 0.01) { var y = lum(rgb(h, s, L)); if (ratio(WHITE, y) >= 4.6 && ratio(y, CREAM) >= 4.6) { l = L; break; } }
    var root = document.documentElement;
    root.style.setProperty('--thx-h', String(h)); root.style.setProperty('--thx-s', Math.round(s * 100) + '%'); root.style.setProperty('--thx-l', Math.round(l * 100) + '%');
    root.classList.add('thx-hue');
    if (!document.getElementById('thx-thk-tint')) {
      var st = document.createElement('style'); st.id = 'thx-thk-tint';
      st.textContent = [
        ':root.thx-hue{--thx-acc:hsl(var(--thx-h) var(--thx-s) var(--thx-l));--thx-acc-deep:hsl(var(--thx-h) var(--thx-s) calc(var(--thx-l) - 8%));',
        '--thx-tint:hsl(var(--thx-h) 70% 93%);--thx-tint-2:hsl(calc(var(--thx-h) + 28) 70% 94%)}',
        /* the band: a tint that rises out of the cream and settles back into it - no edge at either end */
                '.thk-band.thk-tinted{background:transparent!important;border-bottom-color:transparent!important}', /* 1.8.0 (owner: "remove the page color, keep the colour-changing text and stuff") */
        '.thk-band.thk-tinted>*{position:relative;z-index:1}',
        '.thk-band.thk-tinted .thk-glow{color:var(--thx-acc)}',
        /* the synced accent: ghost pills, carousel arrows and card links wherever the page carries them */
        '.thx-hue .thk-band .thxo-btn-ghost,.thx-hue .wwd-sec .thxo-btn-ghost,.thx-hue .thxo-cta-band .bottom-link-2{background:var(--thx-acc);color:#fff;transition:background-color 240ms cubic-bezier(.22,1,.36,1)}',
        '.thx-hue .thk-band .thxo-btn-ghost:hover,.thx-hue .wwd-sec .thxo-btn-ghost:hover,.thx-hue .thxo-cta-band .bottom-link-2:hover{background:var(--thx-acc-deep);color:#fff}',
        '.thx-hue .thk-arrow{border-color:hsl(var(--thx-h) 50% var(--thx-l)/.55);color:var(--thx-acc)}',
        '.thx-hue .thk-arrow:hover,.thx-hue .thk-arrow:focus-visible{background:var(--thx-acc);border-color:var(--thx-acc);color:#fff}',
        '.thx-hue .wwd-link{text-decoration-color:var(--thx-acc);text-decoration-thickness:2px;transition:color 200ms}',
        '.thx-hue .wwd-card:hover .wwd-link,.thx-hue .wwd-card:focus-visible .wwd-link{color:var(--thx-acc)}',
        '.thx-hue .wwd-sec .wwd-kicker{color:var(--thx-acc)}',
        /* 1.9.0 (2026-09-18, owner: hero line "Express what only you can." writes itself in, in the visit's accent) */
        '.thx-hero-ink{color:var(--thx-acc);position:relative}',
        '.thx-hero-ink .thx-w{display:inline-block;white-space:nowrap}',
        '.thx-hero-ink .thx-c{display:inline-block;opacity:0;transform:translateY(.32em) rotate(3deg);filter:blur(7px);transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1),filter .5s ease;transition-delay:calc(var(--i) * 42ms + 140ms);will-change:transform,opacity}',
        '.thx-hero-on .thx-c{opacity:1;transform:none;filter:blur(0)}',
        '.thx-hero-ink .thx-caret{display:inline-block;width:.055em;height:.82em;margin-left:.06em;vertical-align:-.06em;background:var(--thx-acc);border-radius:2px;animation:thx-caret 0.9s steps(1) infinite}',
        '.thx-hero-ink .thx-rule{position:absolute;left:0;bottom:-.14em;height:.045em;width:100%;background:linear-gradient(90deg,var(--thx-acc),var(--thx-acc-deep));border-radius:2px;transform:scaleX(0);transform-origin:0 50%;transition:transform 1.1s cubic-bezier(.22,1,.36,1)}',
        '.thx-hero-done .thx-rule{transform:scaleX(1)}',
        '@keyframes thx-caret{0%,100%{opacity:1}50%{opacity:0}}',
        '.thx-hero-shine .thx-c{animation:thx-shine 1.1s cubic-bezier(.22,1,.36,1) 1;animation-delay:calc(var(--i) * 30ms)}',
        '@keyframes thx-shine{0%,100%{color:var(--thx-acc);transform:none}35%{color:hsl(var(--thx-h) var(--thx-s) calc(var(--thx-l) + 26%));transform:translateY(-.06em)}}',
        '@media (prefers-reduced-motion:reduce){.thx-hero-ink .thx-c{opacity:1;transform:none;filter:none;transition:none;animation:none}.thx-hero-ink .thx-caret{display:none}.thx-hero-ink .thx-rule{transition:none}}',
        '.thx-hue .primary-button:hover,.thx-hue .cap-cta-primary:hover,.thx-hue .thk-more-btn:hover{background:var(--thx-acc-deep)!important;border-color:var(--thx-acc-deep)!important;color:#fff!important}',
        '.thx-hue .thk-chip-on{background:var(--thx-acc);border-color:var(--thx-acc);color:#fff}',
        /* 1.7.1 (owner: "fix the contact thing, make it blend in"): the form loses its white card and sits on the cream like the column beside it; labels no longer wrap; the submit is the house black pill */
        '.contact-form---card,.contact-form---card.card{background:transparent!important;border-radius:0!important;box-shadow:none!important;padding:0!important;border:0!important}',
        '.contact-form-wrapper .field-label,.contact-form-wrapper label{font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif!important;font-size:12px!important;letter-spacing:.06em!important;text-transform:uppercase!important;color:rgba(13,13,13,.7)!important;white-space:nowrap!important;margin-bottom:6px!important;font-weight:500!important}',
        '.contact-form-wrapper .w-input{font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif!important;font-size:16px!important;background:transparent!important;border:0!important;border-bottom:1px solid rgba(13,13,13,.22)!important;border-radius:0!important;box-shadow:none!important;padding:8px 0 10px!important;color:#0d0d0d!important}',
        '.contact-form-wrapper .w-input:focus{border-bottom-color:var(--thx-acc,#0d0d0d)!important;outline:none!important}',
        '.contact-form-wrapper .primary-button{display:inline-flex!important;justify-content:center!important;align-items:center!important;min-height:52px!important;padding:14px 28px!important;background:#0d0d0d!important;color:#f4f2ec!important;font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif!important;font-size:15px!important;font-weight:500!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;border-radius:999px!important;border:1px solid #0d0d0d!important;cursor:pointer;transition:background-color 220ms cubic-bezier(.22,1,.36,1),transform 220ms cubic-bezier(.22,1,.36,1)!important;box-shadow:none!important}',
        '.contact-form-wrapper .primary-button:hover{background:var(--thx-acc-deep,#262626)!important;border-color:var(--thx-acc-deep,#262626)!important;color:#fff!important;transform:translateY(-1px)}',
        '.contact-form-wrapper .primary-button:focus-visible{outline:2px solid #0d0d0d!important;outline-offset:3px!important}',
        '.contact-form-wrapper .div-block-11{background:transparent!important;padding:0!important;border-radius:0!important;box-shadow:none!important}',
        '.contact-form-wrapper .thx-contact-status{font-size:13px;color:rgba(13,13,13,.6);margin-top:10px}',
        '.thx-hue .thk-search-in:focus{border-color:var(--thx-acc)}',
        '.thx-hue .thxo-cta-band .bottom-link,.thx-hue .thxo-cta-band .bottom-link-2{display:inline-flex;align-items:center;padding:13px 24px;margin:0 10px 10px 0;border-radius:999px;font-size:15px;font-weight:500;text-decoration:none;transition:background-color 240ms cubic-bezier(.22,1,.36,1)}',
        '.thx-hue .thxo-cta-band .bottom-link{background:#0d0d0d;color:#f4f2ec}',
        '.thx-hue .thxo-cta-band .bottom-link:hover{background:var(--thx-acc-deep);color:#fff}',
      ].join('');
      document.head.appendChild(st);
    }
    if (!band) return;
    /* 1.8.0: no tint, no glows - the band stays cream; only the words, pill and arrows carry the colour */
    var t = band.querySelector('.thk-title');
    if (t && !t.querySelector('.thk-glow')) {
      var txt = (t.textContent || '').replace(/\s+/g, ' ').trim(), m = /^(.*?)(never stops moving\.?)$/i.exec(txt);
      if (m) { t.textContent = ''; t.appendChild(document.createTextNode(m[1])); var g = document.createElement('span'); g.className = 'thk-glow'; g.textContent = m[2]; t.appendChild(g); }
    }
    /* the closing CTA on Home (.thxo-cta-band: 'Get in touch' = .bottom-link, 'Our Scouting' = .bottom-link-2) is reached by class above */
    band.classList.add('thk-tinted');
  })();

  /* ---------- 1.9.x: the hero line writes itself in, in the visit's accent (Home only: .hero-h1) ----------
     1.9.1 (2026-09-18, owner: "make sure it does it on scroll as well"): on a tall screen the video pushes the line below the fold, so the
     write-on now starts when the line actually enters the viewport (IntersectionObserver, 35% visible), replays if you scroll away and
     come back (after a 6 s cooldown), and finishes with a one-time shimmer that runs through the letters after the underline draws. */
  (function heroInk() {
    var h = document.querySelector('.hero-h1'); if (!h || h.classList.contains('thx-hero-ink')) return;
    var txt = (h.textContent || '').replace(/\s+/g, ' ').trim(); if (!txt) return;
    var still = false; try { still = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    h.setAttribute('aria-label', txt);
    var frag = document.createDocumentFragment(), i = 0, words = txt.split(' ');
    words.forEach(function (w, wi) {
      var ws = document.createElement('span'); ws.className = 'thx-w'; ws.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(w, function (ch) { var c = document.createElement('span'); c.className = 'thx-c'; c.textContent = ch; c.style.setProperty('--i', String(i++)); ws.appendChild(c); });
      frag.appendChild(ws);
      if (wi < words.length - 1) { frag.appendChild(document.createTextNode(' ')); i++; }
    });
    var rule = document.createElement('span'); rule.className = 'thx-rule'; rule.setAttribute('aria-hidden', 'true');
    h.textContent = ''; h.appendChild(frag); h.appendChild(rule);
    h.classList.add('thx-hero-ink');
    var total = still ? 0 : (i * 42 + 140 + 750), timers = [], playing = false, lastPlay = 0, caret = null;
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function play() {
      if (playing) return; playing = true; lastPlay = Date.now(); clear();
      h.classList.remove('thx-hero-on', 'thx-hero-done', 'thx-hero-shine');
      if (caret && caret.parentNode) caret.parentNode.removeChild(caret);
      if (!still) { caret = document.createElement('span'); caret.className = 'thx-caret'; caret.setAttribute('aria-hidden', 'true'); h.insertBefore(caret, rule); }
      void h.offsetWidth; /* commit the reset before the transitions arm */
      requestAnimationFrame(function () { requestAnimationFrame(function () { h.classList.add('thx-hero-on'); }); });
      timers.push(setTimeout(function () { h.classList.add('thx-hero-done'); }, total));
      timers.push(setTimeout(function () { if (caret && caret.parentNode) caret.parentNode.removeChild(caret); h.classList.add('thx-hero-shine'); }, total + 900));
      timers.push(setTimeout(function () { playing = false; }, total + 900 + i * 30 + 600));
    }
    if (still || !('IntersectionObserver' in window)) { play(); return; }
    /* enter → write (if the letters are hidden); leave → after the cooldown, hide the letters again so the next entry replays */
    var armTimer = null;
    function arm() { clearTimeout(armTimer); armTimer = setTimeout(function () { if (!playing) { clear(); h.classList.remove('thx-hero-on', 'thx-hero-done', 'thx-hero-shine'); if (caret && caret.parentNode) caret.parentNode.removeChild(caret); } }, Math.max(0, 6000 - (Date.now() - lastPlay))); }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) { clearTimeout(armTimer); if (!h.classList.contains('thx-hero-on')) play(); }
        else if (!e.isIntersecting) arm();
      });
    }, { threshold: [0, 0.35] });
    io.observe(h);
  })();

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
