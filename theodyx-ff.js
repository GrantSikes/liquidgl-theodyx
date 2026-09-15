/*! theodyx-ff.js v1.0.1 (2026-09-15) — the Freshfields-pattern runtime for theodyx.com.
 * Owner directive (2026-09-15): "make theodyx.com exactly like freshfields.com — the UI/UX, the colours, the sections — so I can edit it and
 * make it mine." Everything visual lives in native Designer classes (ff-*). This file only adds what CSS classes cannot:
 *  1. the How-we-help ACCORDION: a CMS rich-text field ([data-ff="acc"]) is split at every H3 — the H3 becomes the row title, everything
 *     under it becomes the row's panel; the first row opens; +/- icon; keyboard + aria; the open row takes the page's tint.
 *  2. the SECTION RAIL: the floating pill at the bottom of the page listing every section that carries data-ff-label, with scroll-spy,
 *     an up-arrow and a close button (Freshfields' "Our thinking / Featured topics / …" bar). Owner edits labels as element attributes.
 *  3. PANEL COLOUR: the hero panel's CMS Option (Blue / Pink / Lime / Sky / Lavender / Green) becomes a class on the panel and a page
 *     tint (--ff-tint) that the rail and the open accordion row share. A page may also set data-ff-tint on <main>.
 *  4. the capabilities index TABS (All / Practices / Industries / Innovation) — .ff-tab[data-kind] shows one [data-cap="group"].
 *  5. nested styles the Designer cannot express as classes: rich-text children inside .ff-prose / .ff-acc-panel, the select chevron,
 *     the rounded-grid PATTERN art (.ff-pattern), and hide-when-empty (data-ff-hide-empty + .w-dyn-bind-empty).
 * No dependencies. Safe to load on every page: it does nothing on pages without ff-* hooks. */
(function () {
  'use strict';
  if (window.__thxFF) return;
  var API = window.__thxFF = { v: '1.0.1' };
  function q(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var RED = function () { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

  /* ---------- 0. the serif: the native custom font is Newsreader; Google Fonts is fetched as a fallback so the face never misses ---------- */
  (function font() {
    var ok = false; try { ok = document.fonts && document.fonts.check('16px Newsreader'); } catch (e) {}
    if (ok || document.getElementById('thx-ff-font')) return;
    var l = document.createElement('link'); l.id = 'thx-ff-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap';
    document.head.appendChild(l);
  })();

  /* ---------- 5. stylesheet for what classes cannot carry ---------- */
  var TINT = { Blue: ['#7c8aff', '#b3d6f8', '#7fb0ea'], Pink: ['#d28fc8', '#e6daf6', '#c9b3e6'], Lime: ['#c8e67a', '#e7f0cf', '#b9d47a'],
               Sky: ['#b3d6f8', '#dcecfc', '#9cc6ee'], Lavender: ['#e6daf6', '#f0e8fa', '#c9b3e6'], Green: ['#3db25e', '#d4efcf', '#8fd39c'] };
  var PATTERN = "url(\"data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#0d0d0d" stroke-width="1.6"><path d="M0 40H28a12 12 0 0 1 12 12V80"/><path d="M40 0v12a12 12 0 0 1-12 12H0"/><path d="M80 40H52a12 12 0 0 0-12 12V80"/><path d="M40 0v12a12 12 0 0 0 12 12h28"/></svg>') + "\")";
  (function css() {
    if (document.getElementById('thx-ff-css')) return;
    var st = document.createElement('style'); st.id = 'thx-ff-css';
    st.textContent = [
      ':root{--ff-tint:#b3d6f8;--ff-tint-line:#7fb0ea}',
      /* rich text inside the prose column: Freshfields' serif subheads, comfortable paragraphs, underlined links, tidy lists */
      '.ff-prose p{margin:0 0 18px;font-size:17px;line-height:1.55}.ff-prose p:last-child{margin-bottom:0}',
      '.ff-prose h2,.ff-prose h3{font-family:Newsreader,Georgia,serif;font-weight:400;font-size:clamp(24px,2.2vw,30px);line-height:1.15;margin:30px 0 12px;letter-spacing:0}',
      '.ff-prose h4{font-size:18px;font-weight:600;margin:24px 0 8px}.ff-prose ul,.ff-prose ol{margin:0 0 18px;padding-left:22px}.ff-prose li{margin:0 0 8px;line-height:1.5}',
      '.ff-prose a{color:#0d0d0d;text-decoration:underline;text-underline-offset:3px}.ff-prose strong{font-weight:600;color:inherit}.ff-prose img{max-width:100%;height:auto;display:block;margin:24px 0}',
      '.ff-prose blockquote{border-left:2px solid #0d0d0d;margin:24px 0;padding:4px 0 4px 20px;font-family:Newsreader,Georgia,serif;font-size:22px;line-height:1.3}',
      '.ff-main>[data-ff]+.ff-h3{margin-top:40px}',
      /* accordion */
      '.ff-acc-panel p{margin:0 0 14px;font-size:16px;line-height:1.55}.ff-acc-panel p:last-child{margin-bottom:0}',
      '.ff-acc-panel h4,.ff-acc-panel strong{font-family:Newsreader,Georgia,serif;font-weight:400;font-size:19px;display:block;margin:18px 0 8px}',
      '.ff-acc-panel ul{margin:0 0 6px;padding-left:22px}.ff-acc-panel li{margin:0 0 4px;font-size:16px}.ff-acc-panel a{color:#0d0d0d;text-decoration:underline;text-underline-offset:3px}',
      '.ff-acc-item.ff-acc-open{background:var(--ff-tint);border-color:var(--ff-tint-line)}.ff-acc-btn[aria-expanded="true"] .ff-acc-icon::before{content:"\\2212"}.ff-acc-btn[aria-expanded="false"] .ff-acc-icon::before{content:"+"}',
      '.ff-acc-btn:focus-visible{outline:2px solid #0d0d0d;outline-offset:-4px}',
      /* rail */
      '.ff-rail{background:var(--ff-tint)}.ff-rail::-webkit-scrollbar{display:none}.ff-rail{scrollbar-width:none}.ff-rail-a:focus-visible,.ff-rail-btn:focus-visible{outline:2px solid #0d0d0d;outline-offset:2px}',
      'html.ff-rail-off .ff-rail{display:none}',
      '.ff-rail-btn svg{width:14px;height:14px;display:block}',
      /* selects: a chevron, no native arrow */
      '.ff-select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M3 6l5 5 5-5" fill="none" stroke="#0d0d0d" stroke-width="1.6"/></svg>') + '");background-repeat:no-repeat;background-position:right 8px center;padding-right:34px;cursor:pointer}',
      '.ff-input::placeholder,.ff-textarea::placeholder{color:rgba(13,13,13,.45)}',
      /* the rounded-grid pattern art (fills whatever wrapper it sits in) */
      '.ff-pattern{background-image:' + PATTERN + ';background-size:80px 80px;background-repeat:repeat;width:100%;height:100%;min-height:320px;display:block}',
      '.ff-art{overflow:hidden}.ff-art .ff-pattern{min-height:0;aspect-ratio:1/1}',
      /* the people search panel (black): the existing filter controls turn white / outlined inside it */
      '.ff-ppl-panel .thk-tools{position:static;padding:0;margin:0;background:transparent}',
      '.ff-ppl-panel .thk-search{background:#fff;border-radius:999px;border:0}.ff-ppl-panel .thk-search-in{color:#0d0d0d;background:transparent}',
      '.ff-ppl-panel .thk-chips{margin-top:14px}.ff-ppl-panel .thk-chip{border-color:rgba(244,242,236,.5);color:#f4f2ec;background:transparent}',
      '.ff-ppl-panel .thk-chip-on,.thx-hue .ff-ppl-panel .thk-chip-on{background:#c8e67a;border-color:#c8e67a;color:#0d0d0d}.ff-ppl-panel .thk-count{color:rgba(244,242,236,.7);display:block;margin-top:10px}',
      /* a data-ff="color" carrier is never shown */
      '[data-ff="color"]{display:none!important}',
      /* hide-when-empty (a CMS field left blank hides the whole section) */
      '[data-ff-hide-empty]:has(.w-dyn-bind-empty){display:none}',
      '.ff-hero-media:has(.w-dyn-bind-empty),.ff-hero-media:empty{display:none}.ff-hero:has(.ff-hero-media:empty),.ff-hero:has(.ff-hero-media .w-dyn-bind-empty){grid-template-columns:minmax(0,1fr)}',
      /* stat icons drawn as outline glyphs */
      '.ff-stat-ico svg{width:48px;height:48px;display:block;margin:0 auto}',
      /* the Freshfields black footer panel */
      'html.ff-footer .footer{background:#f4f2ec!important}',
    ].join('');
    document.head.appendChild(st);
  })();

  /* ---------- 3. panel colour → class + page tint ---------- */
  (function colour() {
    var main = document.getElementById('thx-main') || document.querySelector('main') || document.body;
    var name = '';
    q('[data-ff="panel"]').forEach(function (p) {
      /* the CMS Option cannot bind to an attribute, so the template carries it as a hidden text block ([data-ff="color"]) inside the panel */
      var carrier = p.querySelector('[data-ff="color"]'); if (carrier) carrier.hidden = true;
      var c = (p.getAttribute('data-ff-color') || (carrier ? carrier.textContent : '') || '').trim(); if (!c) return;
      var key = c.charAt(0).toUpperCase() + c.slice(1).toLowerCase(); if (!TINT[key]) return; name = name || key;
      p.classList.remove('ff-blue', 'ff-pink', 'ff-lime', 'ff-sky', 'ff-lav', 'ff-green'); p.style.backgroundColor = TINT[key][0];
    });
    name = name || (main.getAttribute('data-ff-tint') || '');
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if (TINT[name]) { document.documentElement.style.setProperty('--ff-tint', TINT[name][1]); document.documentElement.style.setProperty('--ff-tint-line', TINT[name][2]); }
  })();

  /* ---------- 1. accordion from a rich-text field ---------- */
  function accordion(host) {
    var rt = host.querySelector('.w-richtext') || host; if (host.dataset.ffReady) return;
    if (rt.classList.contains('w-dyn-bind-empty')) return;
    var kids = [].slice.call(rt.children), groups = [], cur = null;
    kids.forEach(function (k) {
      if (/^H[1-4]$/.test(k.tagName)) { cur = { title: k.textContent.trim(), body: [] }; groups.push(cur); }
      else { if (!cur) { cur = { title: '', body: [] }; groups.push(cur); } cur.body.push(k); }
    });
    groups = groups.filter(function (g) { return g.title || g.body.length; }); if (!groups.length) return;
    var list = document.createElement('div'); list.className = 'ff-acc'; var id = 'ffacc' + Math.random().toString(36).slice(2, 7);
    groups.forEach(function (g, i) {
      var item = document.createElement('div'); item.className = 'ff-acc-item';
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ff-acc-btn'; btn.id = id + 'b' + i; btn.setAttribute('aria-controls', id + 'p' + i);
      var t = document.createElement('span'); t.textContent = g.title || ('Section ' + (i + 1)); var ic = document.createElement('span'); ic.className = 'ff-acc-icon'; ic.setAttribute('aria-hidden', 'true');
      btn.appendChild(t); btn.appendChild(ic);
      var panel = document.createElement('div'); panel.className = 'ff-acc-panel'; panel.id = id + 'p' + i; panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', btn.id);
      g.body.forEach(function (n) { panel.appendChild(n); });
      item.appendChild(btn); item.appendChild(panel); list.appendChild(item);
      function set(open) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); panel.hidden = !open; item.classList.toggle('ff-acc-open', open); }
      set(i === 0);
      btn.addEventListener('click', function () { var open = btn.getAttribute('aria-expanded') === 'true'; set(!open); });
    });
    rt.parentNode.insertBefore(list, rt); rt.hidden = true; host.dataset.ffReady = '1';
  }
  q('[data-ff="acc"]').forEach(accordion);

  /* ---------- 4. capabilities index tabs ---------- */
  (function tabs() {
    var tabs = q('.ff-tab[data-kind]'); if (!tabs.length) return;
    var groups = q('[data-cap="group"]');
    function apply(kind) {
      tabs.forEach(function (t) { var on = (t.getAttribute('data-kind') || '') === kind; t.classList.toggle('ff-tab-on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
      groups.forEach(function (g) { g.style.display = (!kind || g.getAttribute('data-kind') === kind) ? '' : 'none'; });
    }
    tabs.forEach(function (t) { t.setAttribute('role', 'tab'); t.addEventListener('click', function (e) { e.preventDefault(); apply(t.getAttribute('data-kind') || ''); }); });
    var h = (location.hash || '').replace('#', '').toLowerCase(), pre = { 'cap-practices': 'Practice', 'cap-industries': 'Industry', 'cap-innovation': 'Innovation' }[h];
    apply(pre || '');
  })();

  /* ---------- 2. the section rail ---------- */
  (function rail() {
    var main = document.getElementById('thx-main') || document.querySelector('main') || document.body;
    var secs = q('[data-ff-label]', main).filter(function (s) { return s.offsetParent !== null || getComputedStyle(s).display !== 'none'; });
    if (secs.length < 2 || document.querySelector('.ff-rail')) return;
    secs.forEach(function (s, i) { if (!s.id) s.id = 'ff-sec-' + i; });
    var nav = document.createElement('nav'); nav.className = 'ff-rail'; nav.setAttribute('aria-label', 'On this page');
    var links = secs.map(function (s) { var a = document.createElement('a'); a.className = 'ff-rail-a'; a.href = '#' + s.id; a.textContent = s.getAttribute('data-ff-label'); nav.appendChild(a); return a; });
    var up = document.createElement('button'); up.type = 'button'; up.className = 'ff-rail-btn'; up.setAttribute('aria-label', 'Back to top');
    up.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    var close = document.createElement('button'); close.type = 'button'; close.className = 'ff-rail-btn'; close.setAttribute('aria-label', 'Hide this bar');
    close.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    nav.appendChild(up); nav.appendChild(close); document.body.appendChild(nav);
    var navH = function () { var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--thx-nav-h')); return (isNaN(v) ? 56 : v) + 24; };
    function go(el) { var y = el.getBoundingClientRect().top + window.pageYOffset - navH(); window.scrollTo({ top: y, behavior: RED() ? 'auto' : 'smooth' }); }
    links.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); go(secs[i]); history.replaceState(null, '', '#' + secs[i].id); }); });
    up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: RED() ? 'auto' : 'smooth' }); });
    close.addEventListener('click', function () { nav.remove(); try { sessionStorage.setItem('thx-ff-rail', 'off'); } catch (e) {} });
    try { if (sessionStorage.getItem('thx-ff-rail') === 'off') { nav.remove(); return; } } catch (e) {}
    function spy() {
      var y = window.pageYOffset + navH() + 40, best = 0;
      secs.forEach(function (s, i) { if (s.getBoundingClientRect().top + window.pageYOffset <= y) best = i; });
      links.forEach(function (a, i) { a.classList.toggle('ff-rail-on', i === best); if (i === best) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      var on = links[best]; if (on && on.scrollIntoView && nav.scrollWidth > nav.clientWidth + 4) { var r = on.getBoundingClientRect(), n = nav.getBoundingClientRect(); if (r.left < n.left || r.right > n.right) nav.scrollLeft += (r.left - n.left) - 24; }
    }
    var t = 0; addEventListener('scroll', function () { if (t) return; t = requestAnimationFrame(function () { t = 0; spy(); }); }, { passive: true }); spy();
    API.rail = nav;
  })();
})();
