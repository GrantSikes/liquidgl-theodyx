/*! theodyx-ff.js v1.3.1 (2026-09-16) — the Freshfields-pattern runtime for theodyx.com.
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
  var API = window.__thxFF = { v: '1.3.1' };
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
      /* 1.3.0: form controls are always readable - the owner's white-ink experiments on select copies made the prompts vanish */
      '.ff-page select,.ff-page input,.ff-page textarea,.ff-page select option{color:#0d0d0d}select option{background:#fff;color:#0d0d0d}.ff-page .ff-select{border-bottom-color:rgba(13,13,13,.7)}',
      /* 1.3.0: the modern form (owner: "make it look WAY more UI/UX and modern") - add class ff-form-modern to a <form>; fields are .ff-field wrappers */
      '.ff-form-modern{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 24px;max-width:920px}.ff-form-modern .ff-field{margin:0;min-width:0}.ff-form-modern .ff-span,.ff-form-modern .ff-consent,.ff-form-modern .ff-form-note{grid-column:1/-1}',
      '.ff-form-modern [data-ff-showfor]:not([hidden]),.ff-form-modern [data-ff-otherfor]:not([hidden]){display:contents}',
      '.ff-form-modern label,.ff-form-modern .ff-label{display:block;font-size:14px;font-weight:500;letter-spacing:normal;text-transform:none;color:#0d0d0d;margin:0 0 8px;opacity:1}',
      '.ff-form-modern input:not([type=checkbox]):not([type=radio]):not([type=submit]),.ff-form-modern select,.ff-form-modern textarea{width:100%;box-sizing:border-box;height:52px;margin:0;padding:0 16px;border:1px solid rgba(13,13,13,.22);border-radius:12px;background:#fff;color:#0d0d0d;font-family:' + SANS + ';font-size:16px;line-height:1.3;letter-spacing:normal;transition:border-color .15s,box-shadow .15s}',
      '.ff-form-modern textarea{height:auto;min-height:140px;padding:14px 16px;resize:vertical}',
      '.ff-form-modern select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2714%27 height=%2714%27 viewBox=%270 0 16 16%27%3E%3Cpath d=%27M3.5 6 8 10.5 12.5 6%27 fill=%27none%27 stroke=%27%230d0d0d%27 stroke-width=%271.6%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:44px;cursor:pointer}',
      '.ff-form-modern :is(input,select,textarea):focus{outline:none;border-color:#0d0d0d;box-shadow:0 0 0 3px rgba(13,13,13,.08)}.ff-form-modern ::placeholder{color:rgba(13,13,13,.42);opacity:1}',
      '.ff-form-modern .ff-consent{display:flex;gap:12px;align-items:flex-start;margin:6px 0 0}.ff-form-modern .ff-consent input[type=checkbox]{width:20px;height:20px;margin:2px 0 0;accent-color:#0d0d0d;flex:0 0 auto}.ff-form-modern .ff-consent-t{font-size:15px;line-height:1.5;text-transform:none;letter-spacing:normal}',
      '.ff-form-modern input[type=submit],.ff-form-modern button[type=submit],.ff-form-modern .w-button{grid-column:1/-1;justify-self:start;width:auto;height:52px;padding:0 28px;border-radius:999px;background:#0d0d0d;color:#f4f2ec;border:0;font-family:' + SANS + ';font-size:16px;font-weight:500;cursor:pointer;transition:transform .15s,opacity .15s}.ff-form-modern input[type=submit]:hover{opacity:.9;transform:translateY(-1px)}',
      '@media (max-width:767px){.ff-form-modern{grid-template-columns:minmax(0,1fr);gap:18px}}',
      /* 1.3.0: the university combobox */
      '.ff-combo{position:relative}.ff-combo-list{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:60;max-height:280px;overflow:auto;background:#fff;border:1px solid rgba(13,13,13,.16);border-radius:12px;box-shadow:0 12px 40px rgba(13,13,13,.12);padding:6px;margin:0;list-style:none}',
      '.ff-combo-list li{padding:10px 12px;border-radius:8px;cursor:pointer;font-size:15px;line-height:1.3;color:#0d0d0d}.ff-combo-list li[aria-selected=true],.ff-combo-list li:hover{background:rgba(13,13,13,.06)}.ff-combo-list small{display:block;color:rgba(13,13,13,.5);font-size:12px;margin-top:2px}.ff-combo-list .ff-combo-other{border-top:1px solid rgba(13,13,13,.1);margin-top:4px;padding-top:12px;color:rgba(13,13,13,.7)}',
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

  /* ---------- 8b. Our People catalogue: a card whose Department is empty takes its Network category as the kicker, so the category chips filter it ---------- */
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
    var h = panel.querySelector('.ff-panel-h'); if (h && !panel.querySelector('.ff-ppl-intro')) { var p = document.createElement('p'); p.className = 'ff-ppl-intro'; p.textContent = 'The people behind Theodyx and the people in Our Network. Find someone by name, role or team, and reach them directly.'; h.insertAdjacentElement('afterend', p); }
    var count = panel.querySelector('.thk-count'); if (!count) return;
    function fix() { var m = /(\d+)\s*(piece|pieces|item|items|result|results)/i.exec(count.textContent || ''); if (m) { var n = +m[1]; count.textContent = n + (n === 1 ? ' person' : ' people'); } }
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

  /* ---------- 11. placeholders (1.3.0, owner: "not 'Example text' - say whatever it is asking the user to input") ----------
     Any input/textarea whose placeholder is empty or the Designer default takes the text of its own label. The Designer placeholder still wins when set. */
  (function placeholders() {
    q('input,textarea').forEach(function (f) {
      var ph = (f.getAttribute('placeholder') || '').trim(); if (ph && !/^example text$/i.test(ph)) return;
      if (/^(checkbox|radio|submit|hidden|button|file)$/i.test(f.type || '')) return;
      var lab = (f.id && document.querySelector('label[for="' + f.id + '"]')) || (f.closest('.ff-field') || f.parentElement || {}).querySelector && (f.closest('.ff-field') || f.parentElement).querySelector('label');
      var MAP = { email: 'you@email.com', name: 'Full name', 'first-name': 'First name', 'last-name': 'Last name', company: 'Company, project or institution', 'based-in': 'City, country', website: 'https://', linkedin: 'https://linkedin.com/in/\u2026', instagram: '@handle', tiktok: '@handle', youtube: 'Channel or URL', x: '@handle', 'x-twitter': '@handle', threads: '@handle', 'managed-by': 'Agency or manager', about: 'A few lines about you and your work', 'role-other': 'e.g. Producer, Journalist, Coach', university: 'Start typing your university', 'university-other': 'Your university', message: 'How can we help?', phone: '+1 (555) 000-0000' };
      var key = (f.getAttribute('data-name') || f.name || '').toLowerCase().trim();
      var t = MAP[key] || (f.type === 'email' ? 'you@email.com' : f.type === 'url' ? 'https://' : (lab ? lab.textContent : key));
      t = t.replace(/\(required\)/ig, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
      if (t) f.setAttribute('placeholder', t);
    });
  })();

  /* ---------- 12. "Not listed" free text (1.3.0): a select whose chosen option is "Not listed" / "Other" reveals the field marked data-ff-otherfor="<select name>" ---------- */
  (function otherField() {
    q('[data-ff-otherfor]').forEach(function (g) {
      var form = g.closest('form') || document, sel = form.querySelector('select[name="' + g.getAttribute('data-ff-otherfor') + '"]'); if (!sel) return;
      function apply() { var on = /^(not listed|other|not listed .*)$/i.test((sel.value || '').trim()); g.hidden = !on; q('input,textarea', g).forEach(function (f) { f.disabled = !on; f.required = on; if (on) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) {} }, 30); }); }
      sel.addEventListener('change', apply); apply();
    });
  })();

  /* ---------- 13. university lookup (1.3.0): an input marked data-ff-uni becomes a combobox over a bundled list of ~10k institutions (name, country),
     fetched only when the field is first used. "Not listed" hands over to the data-ff-otherfor="University" field. ---------- */
  (function uni() {
    var inputs = q('input[data-ff-uni]'); if (!inputs.length) return;
    var URL = 'https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@4e8305ac49b183cc4d1604b15ce98547018691b0/data/universities.json', data = null, loading = null;
    function load() { if (data) return Promise.resolve(data); if (loading) return loading; loading = fetch(URL).then(function (r) { return r.json(); }).then(function (j) { data = j; return j; }).catch(function () { data = []; return data; }); return loading; }
    inputs.forEach(function (inp) {
      var wrap = document.createElement('div'); wrap.className = 'ff-combo'; inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
      var list = document.createElement('ul'); list.className = 'ff-combo-list'; list.hidden = true; list.setAttribute('role', 'listbox'); wrap.appendChild(list);
      inp.setAttribute('autocomplete', 'off'); inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false');
      var form = inp.closest('form') || document, other = form.querySelector('[data-ff-otherfor="' + (inp.name || 'University') + '"]'), items = [], cur = -1;
      function close() { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); cur = -1; }
      function pick(i) { var it = items[i]; if (!it) return; if (it.other) { inp.value = 'Not listed'; if (other) { other.hidden = false; q('input', other).forEach(function (f) { f.disabled = false; f.required = true; setTimeout(function () { try { f.focus(); } catch (e) {} }, 30); }); } } else { inp.value = it.n; if (other) { other.hidden = true; q('input', other).forEach(function (f) { f.disabled = true; f.required = false; }); } } close(); }
      function render() {
        list.innerHTML = ''; items.forEach(function (it, i) { var li = document.createElement('li'); li.setAttribute('role', 'option'); li.setAttribute('aria-selected', i === cur ? 'true' : 'false'); if (it.other) { li.className = 'ff-combo-other'; li.textContent = 'Not listed — I’ll type it in'; } else { li.textContent = it.n; var sm = document.createElement('small'); sm.textContent = it.c; li.appendChild(sm); } li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(i); }); list.appendChild(li); });
        list.hidden = !items.length; inp.setAttribute('aria-expanded', items.length ? 'true' : 'false');
      }
      function search() {
        var v = inp.value.trim().toLowerCase(); if (v.length < 2) { close(); return; }
        load().then(function (d) { var out = [], i; for (i = 0; i < d.length && out.length < 8; i++) { if (d[i][0].toLowerCase().indexOf(v) > -1) out.push({ n: d[i][0], c: d[i][1] }); } out.push({ other: true }); items = out; cur = -1; render(); });
      }
      inp.addEventListener('input', search); inp.addEventListener('focus', search);
      inp.addEventListener('keydown', function (e) { if (list.hidden) return; if (e.key === 'ArrowDown') { e.preventDefault(); cur = Math.min(items.length - 1, cur + 1); render(); } else if (e.key === 'ArrowUp') { e.preventDefault(); cur = Math.max(0, cur - 1); render(); } else if (e.key === 'Enter') { if (cur > -1) { e.preventDefault(); pick(cur); } } else if (e.key === 'Escape') { close(); } });
      inp.addEventListener('blur', function () { setTimeout(close, 120); });
      if (other) { other.hidden = true; q('input', other).forEach(function (f) { f.disabled = true; f.required = false; }); }
    });
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
