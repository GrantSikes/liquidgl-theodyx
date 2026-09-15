/*! theodyx-ff.js v1.2.5 (2026-09-15) — the Freshfields-pattern runtime for theodyx.com.
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
  var API = window.__thxFF = { v: '1.2.5' };
  var SANS = '"Google Sans Flex","Google Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  function q(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var RED = function () { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

  /* ---------- 0. type: one face only. Owner directive 2026-09-15 (round 2): "all the font is Google Sans Flex, normal spacing, nothing else" - the serif is gone. ---------- */

  /* ---------- 5. stylesheet for what classes cannot carry ---------- */
  var TINT = { Blue: ['#7c8aff', '#b3d6f8', '#7fb0ea'], Pink: ['#d28fc8', '#e6daf6', '#c9b3e6'], Lime: ['#c8e67a', '#e7f0cf', '#b9d47a'],
               Sky: ['#b3d6f8', '#dcecfc', '#9cc6ee'], Lavender: ['#e6daf6', '#f0e8fa', '#c9b3e6'], Green: ['#3db25e', '#d4efcf', '#8fd39c'] };
  var PATTERN = "url(\"data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#0d0d0d" stroke-width="1.6"><path d="M0 40H28a12 12 0 0 1 12 12V80"/><path d="M40 0v12a12 12 0 0 1-12 12H0"/><path d="M80 40H52a12 12 0 0 0-12 12V80"/><path d="M40 0v12a12 12 0 0 0 12 12h28"/></svg>') + "\")";
  (function css() {
    if (document.getElementById('thx-ff-css')) return;
    var st = document.createElement('style'); st.id = 'thx-ff-css';
    st.textContent = [
      ':root{--ff-tint:#b3d6f8;--ff-tint-line:#7fb0ea}',
      /* 1.1.0: ONE typeface (Google Sans Flex), normal tracking, black ink on every ff-* element; the black panels keep cream text */
      '[class^="ff-"],[class*=" ff-"]{font-family:' + SANS + ';letter-spacing:normal}',
      '.ff-hero-h1,.ff-h2,.ff-h2-sm,.ff-h3,.ff-statement,.ff-card-t,.ff-list-h,.ff-panel-h,.ff-lead,.ff-p,.ff-hero-deck,.ff-crumb,.ff-crumb-cur,.ff-crumb-link,.ff-label,.ff-input,.ff-select,.ff-textarea,.ff-tab,.ff-chip,.ff-list-a,.ff-aside-link,.ff-aside-t,.ff-card-d,.ff-card-date,.ff-link,.ff-btn,.ff-btn-black,.ff-btn-sky,.ff-btn-ghost,.ff-btn-white,.ff-acc-btn,.ff-acc-panel,.ff-rail,.ff-rail-a,.ff-rail-btn,.ff-tile,.ff-stat,.ff-kicker,.ff-kicker-solid,.ff-form-note,.ff-ppl-label,.ff-ppl-or,.ff-thk-search{font-family:' + SANS + ';letter-spacing:normal}',
      '.ff-hero-h1,.ff-h2,.ff-h2-sm,.ff-h3,.ff-statement,.ff-card-t,.ff-list-h{font-weight:400}',
      /* 1.2.0: every ink rule sits in :where() (zero specificity) so a page's OWN class (p-<page>-*) always wins in the Designer */
      ':where(.ff-page,.ff-page p,.ff-page li,.ff-page label,.ff-page h1,.ff-page h2,.ff-page h3,.ff-page h4,.ff-page a){color:#0d0d0d}',
      ':where(.ff-page .ff-black,.ff-page .ff-black *,.ff-page .ff-panel,.ff-page .ff-panel *,.ff-page .ff-ppl-panel,.ff-page .ff-ppl-panel *){color:#f4f2ec}',
      ':where(.ff-page .ff-ppl-panel .ff-btn,.ff-page .ff-ppl-panel .thk-chip-on,.ff-page .ff-ppl-panel .thk-search-in,.ff-page .ff-panel .ff-btn,.ff-page .ff-panel .ff-btn-sky){color:#0d0d0d}',
      ':where(.ff-page .ff-btn,.ff-page .ff-btn-sky,.ff-page .ff-btn-white,.ff-page .ff-btn-ghost){color:#0d0d0d}:where(.ff-page .ff-btn-black){color:#f4f2ec}',
      /* 1.2.0: checkbox + radio rows, and the form field group shown for some roles (data-ff-showfor) */
      '.ff-consent{display:flex;gap:12px;align-items:flex-start;margin:8px 0 18px}.ff-consent-t{font-size:15px;line-height:1.5;color:#0d0d0d}[data-ff-showfor][hidden]{display:none!important}',
      /* 1.0.2: Webflow publishes only the classes some element USES in the Designer, so the classes this script adds at runtime (accordion rows,
         the rail, the active tab) arrive unstyled. These :where() fallbacks have zero specificity - the moment the owner applies and edits the
         same class in the Designer, the Webflow rule wins. Also: the site's legacy heading/strong colour variable resolves to white, so every
         serif element here states its ink explicitly. */
      /* 1.0.3: plain class selectors (they must beat the site's global a / button tag rules), and this <style> is inserted BEFORE Webflow's own
         stylesheet, so a Designer rule for the same class still wins the tie. */
      '.ff-acc{border-top:1px solid rgba(13,13,13,.18)}.ff-acc-item{border-bottom:1px solid rgba(13,13,13,.18);transition:background-color 220ms}',
      '.ff-acc-btn{display:flex;width:100%;align-items:center;justify-content:space-between;gap:24px;padding:28px 24px;background:transparent;border:0;border-radius:0;text-align:left;font-size:21px;line-height:1.3;font-weight:400;font-family:inherit;color:#0d0d0d;cursor:pointer;-webkit-appearance:none;appearance:none;margin:0}',
      '.ff-acc-icon{flex:0 0 auto;width:22px;height:22px;font-size:26px;line-height:22px;text-align:center}',
      '.ff-acc-panel{padding:0 24px 28px;font-size:16px;line-height:1.55;color:#0d0d0d}',
      '.ff-acc-open{background:var(--ff-tint);border:1px solid var(--ff-tint-line);border-radius:4px;margin-top:-1px}',
      '.ff-rail{font-family:' + SANS + ';letter-spacing:normal;position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:90;display:flex;align-items:center;gap:4px;max-width:calc(100% - 48px);padding:6px;border-radius:999px;background:var(--ff-tint);color:#0d0d0d;overflow-x:auto;white-space:nowrap;box-shadow:0 8px 30px rgba(13,13,13,.12)}',
      '.ff-rail-a{display:inline-flex;align-items:center;padding:10px 22px;border-radius:999px;font-size:15px;line-height:1;color:#0d0d0d;text-decoration:none;white-space:nowrap}.ff-rail-a:hover{text-decoration:underline}',
      '.ff-rail-on,.ff-rail-a.ff-rail-on{background:#fff;color:#0d0d0d}',
      '.ff-rail-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;border:1px solid #0d0d0d;background:transparent;color:#0d0d0d;font-size:16px;cursor:pointer;flex:0 0 auto;margin-left:6px;padding:0}',
      '.ff-tab-on{background:#f9cdb5}',
      '@media (max-width:767px){.ff-acc-btn{padding:20px 16px;font-size:18px}.ff-acc-panel{padding:0 16px 20px}.ff-rail{bottom:12px;max-width:calc(100% - 24px)}}',
      /* the contact form card used to fade in through an old scroll reveal; inside the new layout that trigger never fires - keep it visible */
      '.contact-form---card,.contact-form-wrapper{opacity:1!important;transform:none!important}',
      ':where(.ff-statement,.ff-hero-h1,.ff-h2,.ff-h2-sm,.ff-h3,.ff-card-t,.ff-list-h,.ff-prose h2,.ff-prose h3,.ff-prose h4,.ff-prose strong,.ff-acc-panel strong,.ff-acc-panel h4,.ff-stat,.ff-tile){color:#0d0d0d}',
      ':where(.ff-panel-h,.ff-panel-p,.ff-panel strong,.ff-black,.ff-black h2,.ff-black h3,.ff-black p,.ff-ppl-panel h1){color:#f4f2ec}',
      /* rich text inside the prose column: Freshfields' serif subheads, comfortable paragraphs, underlined links, tidy lists */
      '.ff-prose p{margin:0 0 18px;font-size:17px;line-height:1.55}.ff-prose p:last-child{margin-bottom:0}',
      '.ff-prose h2,.ff-prose h3{font-family:inherit;letter-spacing:normal;font-weight:400;font-size:clamp(24px,2.2vw,30px);line-height:1.15;margin:30px 0 12px;letter-spacing:0}',
      '.ff-prose h4{font-size:18px;font-weight:600;margin:24px 0 8px}.ff-prose ul,.ff-prose ol{margin:0 0 18px;padding-left:22px}.ff-prose li{margin:0 0 8px;line-height:1.5}',
      '.ff-prose a{color:#0d0d0d;text-decoration:underline;text-underline-offset:3px}.ff-prose strong{font-weight:600;color:inherit}.ff-prose img{max-width:100%;height:auto;display:block;margin:24px 0}',
      '.ff-prose blockquote{border-left:2px solid #0d0d0d;margin:24px 0;padding:4px 0 4px 20px;font-family:inherit;letter-spacing:normal;font-size:22px;line-height:1.3}',
      '.ff-main>[data-ff]+.ff-h3{margin-top:40px}',
      /* accordion */
      '.ff-acc-panel p{margin:0 0 14px;font-size:16px;line-height:1.55}.ff-acc-panel p:last-child{margin-bottom:0}',
      '.ff-acc-panel h4,.ff-acc-panel strong{font-family:inherit;letter-spacing:normal;font-weight:400;font-size:19px;display:block;margin:18px 0 8px}',
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
      /* 1.1.0 people panel: a real search bar (icon, 56px, focus ring), chips that wrap, the count on its own line, stacked on phones */
      '.ff-ppl-panel{grid-template-columns:minmax(0,1fr) 52%;padding:44px 40px 40px;min-height:0;border-radius:8px}',
      '.ff-ppl-panel .ff-panel-h{font-size:clamp(34px,4vw,62px);line-height:1.02;margin-bottom:16px}',
      '.ff-ppl-intro{max-width:34ch;font-size:17px;line-height:1.5;color:rgba(244,242,236,.82)!important;margin:0 0 28px}',
      '.ff-ppl-panel .thk-search{max-width:none;height:56px;padding:0 20px 0 52px;background:#fff url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0d0d0d" stroke-width="1.8"><circle cx="8.5" cy="8.5" r="6"/><path d="M13 13l5 5"/></svg>') + '") no-repeat 20px center;border:1px solid transparent;transition:box-shadow 160ms}',
      '.ff-ppl-panel .thk-search:focus-within{box-shadow:0 0 0 3px #c8e67a}.ff-ppl-panel .thk-search-in{height:54px;font-size:17px}',
      '.ff-ppl-panel .thk-tools{display:flex;flex-direction:column;align-items:stretch;gap:0}.ff-ppl-panel .thk-search{flex:0 0 auto;width:100%}.ff-ppl-panel .thk-chips{margin-top:16px;gap:8px}',
      /* checkbox / radio labels inside the forms read black on the cream page */
      '.ff-page .w-checkbox,.ff-page .w-radio,.ff-page .w-form-label,.ff-page .w-checkbox-input+span{color:#0d0d0d}',
      /* three factual tiles on the network page: no image column, so the copy has room */
      '.ff-cards-3 .ff-tile{display:flex;flex-direction:column;justify-content:space-between;gap:18px;min-height:0}',
      '.ff-ppl-panel .thk-chip{height:40px;padding:0 18px;font-size:14px;transition:background-color 160ms,color 160ms,border-color 160ms}.ff-ppl-panel .thk-chip:hover{background:rgba(244,242,236,.14)}',
      '.ff-ppl-panel .thk-count{margin:14px 0 0;font-size:14px}',
      '.ff-ppl-panel .ff-ppl-or{margin-top:30px;font-size:13px;letter-spacing:normal;text-transform:none;font-weight:500;color:rgba(244,242,236,.7)!important}',
      '.ff-ppl-panel .ff-btn{display:inline-flex;align-self:flex-start;width:auto;padding:14px 26px;font-size:16px}',
      '@media (max-width:991px){.ff-ppl-panel{grid-template-columns:minmax(0,1fr);padding:32px 24px}}',
      '@media (max-width:767px){.ff-ppl-panel{padding:28px 18px}.ff-ppl-panel .thk-search{height:52px;padding-left:46px;background-position:16px center}.ff-ppl-panel .thk-chip{height:36px;padding:0 14px;font-size:13px}}',
      /* the Our thinking hero form fields (selects sit on a lavender panel) */
      '.ff-thk-hero-r .ff-select{background-color:#fff}',
      /* a data-ff="color" carrier is never shown */
      '[data-ff="color"]{display:none!important}[data-ppl-cat]{display:none!important}',
      /* hide-when-empty (a CMS field left blank hides the whole section) */
      '[data-ff-hide-empty]:has(.w-dyn-bind-empty){display:none}',
      '.ff-hero-media:has(.w-dyn-bind-empty),.ff-hero-media:empty{display:none}.ff-hero:has(.ff-hero-media:empty),.ff-hero:has(.ff-hero-media .w-dyn-bind-empty){grid-template-columns:minmax(0,1fr)}',
      /* stat icons drawn as outline glyphs */
      '.ff-stat-ico svg{width:48px;height:48px;display:block;margin:0 auto}',
      /* the Freshfields black footer panel */
      'html.ff-footer .footer{background:#f4f2ec!important}',
    ].join('');
    /* before Webflow's stylesheet: equal-specificity Designer rules win, tag rules (a, button) still lose */
    var wf = document.querySelector('link[rel="stylesheet"][href*="website-files"], link[rel="stylesheet"]');
    if (wf && wf.parentNode) wf.parentNode.insertBefore(st, wf); else document.head.appendChild(st);
    /* 1.2.4: the INK sheet goes AFTER Webflow's CSS. Its rules are :where(.ff-page) tag rules - specificity (0,0,1) - so they beat the site's
       legacy tag rules (h1/p -> the white --font--colors--title-dark variable) by source order, yet lose to ANY class the owner sets in the Designer. */
    var ink = document.createElement('style'); ink.id = 'thx-ff-ink';
    ink.textContent = [
      ':where(.ff-page) :where(h1,h2,h3,h4,h5,h6,p,li,label,a,div,span,blockquote,strong,em,b){color:#0d0d0d}',
      /* runtime-made capability chips on pages that never used .thk-chip in the Designer (the class is tree-shaken there) */
      ':where(.ff-page) .thk-chip{display:inline-flex;align-items:center;height:38px;padding:0 16px;border:1px solid rgba(13,13,13,.18);border-radius:999px;color:#0d0d0d;font-size:14px;font-weight:500;text-decoration:none}',
      ':where(.ff-page) :where(.ff-black,.ff-panel,.ff-ppl-panel,.ff-ppl-panel-lime .ff-ppl-kicker) :where(h1,h2,h3,h4,p,li,label,a,div,span){color:#f4f2ec}',
      ':where(.ff-page) :where(.ff-ppl-panel-lime) :where(h1,h2,h3,p,div,span,a){color:#0d0d0d}',
      ':where(.ff-page) :where(.ff-panel,.ff-ppl-panel) :where(.ff-btn,.ff-btn-sky,.ff-btn-white,.thk-chip-on,.thk-search-in){color:#0d0d0d}',
      ':where(.ff-page) :where(.ff-btn-black,.ff-kicker-solid,.ff-ppl-kicker,.thk-chip-on){color:#f4f2ec}',
      ':where(.ff-page) :where(.ff-btn-black,.ff-kicker-solid,.ff-ppl-kicker) :where(span,div){color:#f4f2ec}',
    ].join('');
    document.head.appendChild(ink);
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

  /* ---------- 6. dropdowns: the builder publishes <select> elements with no <option> children, so the options live on the element as
     data-ff-options="One|Two|Three" (edit them in the Designer's attribute panel); the first entry is the prompt. Duplicate #field ids are made unique. */
  (function selects() {
    q('select').forEach(function (s, i) {
      var raw = s.getAttribute('data-ff-options'); var name = s.getAttribute('name') || ('select-' + i);
      if (s.id === 'field' || !s.id) s.id = 'ff-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      var lab = s.closest('.ff-field'); var l = lab && lab.querySelector('label'); if (l && !l.getAttribute('for')) l.setAttribute('for', s.id);
      if (!raw || s.options.length) return;
      raw.split('|').forEach(function (t, j) { t = t.trim(); if (!t) return; var o = document.createElement('option'); o.textContent = t; o.value = j === 0 ? '' : t; s.appendChild(o); });
    });
  })();

  /* ---------- 7. Our thinking: the hero's Practices / Industries / Section + "Search our thinking" drive the page's own filter (chips + search box) ---------- */
  (function thinking() {
    var btn = document.querySelector('.ff-thk-search, .p-thinking-thk-search, [data-ff="thk-search"]'); if (!btn) return;
    var form = btn.closest('form'); if (form) form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    var sel = function (n) { return document.querySelector('select[name="' + n + '"]'); };
    function fire(el, type) { el.dispatchEvent(new Event(type, { bubbles: true })); }
    function run() {
      var section = (sel('section') || {}).value || '', terms = [(sel('practice') || {}).value, (sel('industry') || {}).value].filter(Boolean).join(' ');
      var chips = q('.thk-chips .thk-chip'), hit = null;
      chips.forEach(function (c) { var cat = (c.getAttribute('data-cat') || '').toLowerCase(), txt = c.textContent.trim().toLowerCase(); if (section && (cat === section.toLowerCase() || txt === section.toLowerCase())) hit = c; });
      (hit || chips[0]) && (hit || chips[0]).click();
      var box = document.querySelector('#latest .thk-search-in, .thk-hub .thk-search-in'); if (box) { box.value = terms; fire(box, 'input'); fire(box, 'keyup'); fire(box, 'change'); }
      var tgt = document.getElementById('latest'); if (tgt) setTimeout(function () { var y = tgt.getBoundingClientRect().top + window.pageYOffset - 90; window.scrollTo({ top: y, behavior: RED() ? 'auto' : 'smooth' }); }, 60);
    }
    btn.addEventListener('click', function (e) { e.preventDefault(); run(); });
    ['practice', 'industry', 'section'].forEach(function (n) { var s = sel(n); if (s) s.addEventListener('change', run); });
  })();

  /* ---------- 8b. Our Humans catalogue: a card whose Department is empty takes its Network category as the kicker, so the category chips filter it ---------- */
  (function catalogue() {
    q('.thk-card').forEach(function (c) {
      var k = c.querySelector('.thk-kicker'), cat = c.querySelector('[data-ppl-cat]'); if (!k || !cat) return;
      var t = (cat.textContent || '').trim(); if (!t || cat.classList.contains('w-dyn-bind-empty')) return;
      if (!(k.textContent || '').trim() || k.classList.contains('w-dyn-bind-empty')) { k.textContent = t; k.classList.remove('w-dyn-bind-empty'); }
    });
  })();

  /* ---------- 8. people panel: an intro line under the title, and the count reads "N people" not "N pieces" ---------- */
  (function people() {
    var panel = document.querySelector('.ff-ppl-panel'); if (!panel) return;
    var h = panel.querySelector('.ff-panel-h'); if (h && !panel.querySelector('.ff-ppl-intro')) { var p = document.createElement('p'); p.className = 'ff-ppl-intro'; p.textContent = 'The humans behind Theodyx and the people in Our Network. Find someone by name, role or team, and reach them directly.'; h.insertAdjacentElement('afterend', p); }
    var count = panel.querySelector('.thk-count'); if (!count) return;
    function fix() { var m = /(\d+)\s*(piece|pieces|item|items|result|results)/i.exec(count.textContent || ''); if (m) { var n = +m[1]; count.textContent = n + (n === 1 ? ' human' : ' humans'); } }
    fix(); new MutationObserver(fix).observe(count, { childList: true, characterData: true, subtree: true });
  })();

  /* ---------- 9. hide-when-empty for LINKS: a link bound to an empty CMS link field publishes href="#" (no w-dyn-bind-empty), so hide those too ---------- */
  (function emptyLinks() {
    q('a[data-ff-hide-empty]').forEach(function (a) { var h = (a.getAttribute('href') || '').trim(); if (!h || h === '#' || /^mailto:$|^tel:$/.test(h)) a.hidden = true; });
    q('[data-ff-hide-empty]:not(a)').forEach(function (w) { var kids = [].slice.call(w.children); if (kids.length && kids.every(function (k) { return k.hidden || k.classList.contains('w-dyn-bind-empty') || (k.tagName === 'A' && k.hidden); })) w.hidden = true; });
  })();

  /* ---------- 10. conditional form groups: [data-ff-showfor="A|B"] shows only while the form's Role select holds one of those values ---------- */
  (function showFor() {
    q('[data-ff-showfor]').forEach(function (g) {
      var form = g.closest('form') || document, sel = form.querySelector('select[name="Role"], select[data-ff-role]'); if (!sel) return;
      var want = g.getAttribute('data-ff-showfor').split('|').map(function (t) { return t.trim().toLowerCase(); });
      function apply() { var on = want.indexOf((sel.value || '').trim().toLowerCase()) > -1; g.hidden = !on; q('input,select,textarea', g).forEach(function (f) { f.disabled = !on; }); }
      sel.addEventListener('change', apply); apply();
    });
  })();

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
