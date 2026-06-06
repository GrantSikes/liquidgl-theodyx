/* theodyx-footer.js — modern, Google Labs-inspired site footer for Theodyx.
 * Loaded site-wide via the registered "nv2footd" loader. Idempotent + self-healing.
 * Restyles the existing <footer class="footer"> markup, injects a CTA band, a giant
 * gradient wordmark, a gradient glow, and circular social buttons. Also keeps the
 * link-fix / cleanup behaviour the old nv2footd provided.
 */
(function () {
  "use strict";
  if (window.__thxFooterV2) return;
  window.__thxFooterV2 = true;

  var CSS = [
    '.footer{position:relative!important;overflow:hidden!important;background:#0a0a0c!important;color:#f5f1e8!important;padding:clamp(64px,8vw,116px) clamp(22px,5vw,72px) 34px!important;display:block!important;border-top:1px solid rgba(245,241,232,.08)!important}',
    '.footer .thx-glow{position:absolute;top:-34%;left:50%;transform:translateX(-50%);width:120%;height:74%;background:radial-gradient(50% 62% at 50% 0,rgba(120,148,246,.20),rgba(168,124,255,.10) 46%,transparent 72%);pointer-events:none;z-index:0}',
    '.footer .thx-top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(120,148,246,.6),rgba(168,124,255,.65),rgba(255,143,177,.5),transparent);z-index:2}',
    '.footer>*:not(.thx-glow):not(.thx-top){position:relative;z-index:1;max-width:1280px;margin-left:auto;margin-right:auto}',
    '.thx-fcta{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:clamp(44px,6vw,82px)!important}',
    '.thx-fcta .ey{margin:0 0 14px;font:600 13px/1 "Google Sans Flex","Google Sans",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,241,232,.5)}',
    '.thx-fcta h2{margin:0;font-family:"Google Sans Flex","Google Sans",Georgia,serif;font-weight:500;font-size:clamp(28px,4.6vw,54px);line-height:1.03;letter-spacing:-.02em;max-width:15ch;color:#fff}',
    '.thx-fbtn{flex:0 0 auto;display:inline-flex;align-items:center;gap:.45em;padding:16px 30px;border-radius:999px;background:#f5f1e8;color:#0a0a0c!important;font:600 16px/1 "Google Sans Flex","Google Sans",system-ui,sans-serif;text-decoration:none!important;border:0;cursor:pointer;transition:transform .25s cubic-bezier(.33,1,.68,1),box-shadow .25s,background .25s;box-shadow:0 10px 34px rgba(0,0,0,.4)}',
    '.thx-fbtn:hover{transform:translateY(-2px) scale(1.02);background:#fff;box-shadow:0 16px 44px rgba(120,148,246,.4)}',
    '.thx-fbtn .ar{transition:transform .25s}',
    '.thx-fbtn:hover .ar{transform:translateX(4px)}',
    '.thx-fcols{display:flex;flex-wrap:wrap;gap:clamp(34px,6vw,84px)}',
    '.footer .footer-col{display:flex!important;flex-direction:column!important;align-items:flex-start!important;min-width:118px;gap:0!important}',
    '.footer .footer-h{margin:0 0 16px!important;padding:0!important;font:600 12px/1 "Google Sans Flex","Google Sans",system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:rgba(245,241,232,.42)!important;background:none!important}',
    '.footer .footer-link{position:relative;display:inline-block!important;width:auto!important;padding:7px 0!important;margin:0!important;color:rgba(245,241,232,.62)!important;font:400 15.5px/1.35 "Google Sans Flex","Google Sans",system-ui,sans-serif!important;text-decoration:none!important;background:none!important;transition:color .2s ease,transform .2s ease}',
    '.footer .footer-link:hover{color:#fff!important;transform:translateX(4px)}',
    '.thx-fmark{margin:clamp(50px,7vw,98px) auto 0!important;font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-weight:800;font-size:clamp(56px,18.6vw,248px);line-height:.82;letter-spacing:-.04em;text-align:center;white-space:nowrap;background:linear-gradient(108deg,#7894f6,#a87cff 44%,#ff8fb1 80%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;opacity:.95;user-select:none;pointer-events:none}',
    '.footer .footer-bottom-1{margin:clamp(30px,4vw,52px) auto 0!important;padding-top:24px!important;border-top:1px solid rgba(245,241,232,.1)!important;display:flex!important;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}',
    '.footer .footer-bottom-1 .copyright{margin:0!important;color:rgba(245,241,232,.46)!important;font:400 13px/1.55 "Google Sans Flex","Google Sans",system-ui,sans-serif!important}',
    '.thx-fsoc{display:flex;gap:10px}',
    '.thx-fsoc a{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:999px;border:1px solid rgba(245,241,232,.16);color:rgba(245,241,232,.72)!important;text-decoration:none!important;transition:transform .2s,background .2s,border-color .2s,color .2s}',
    '.thx-fsoc a:hover{transform:translateY(-3px);background:rgba(245,241,232,.08);border-color:rgba(245,241,232,.45);color:#fff!important}',
    '.thx-fsoc svg{width:17px;height:17px;display:block;fill:currentColor}',
    '@media(max-width:600px){.footer{text-align:left}.thx-fcols{gap:30px 40px}.footer .footer-col{min-width:42%}.thx-fbtn{width:100%;justify-content:center}.thx-fcta h2{font-size:clamp(26px,7.5vw,34px)}.thx-fmark{font-size:clamp(46px,19vw,92px)}.footer .footer-bottom-1{justify-content:flex-start}}'
  ].join('');

  var ICONS = {
    X: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
    LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/></svg>',
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.36 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.12-1.38c.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.12A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>',
    Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>'
  };

  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }

  function injectCSS() {
    if (document.getElementById('thx-footer-css')) return;
    var s = el('style'); s.id = 'thx-footer-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function build(f) {
    if (f.__thxV2) return;
    f.__thxV2 = 1;
    var cols = [].slice.call(f.querySelectorAll('.footer-col'));
    if (!cols.length) { f.__thxV2 = 0; return; }
    var bottom = f.querySelector('.footer-bottom-1');

    var glow = el('div', 'thx-glow'); var top = el('div', 'thx-top');
    f.insertBefore(glow, f.firstChild); f.insertBefore(top, f.firstChild);

    var cta = el('div', 'thx-fcta');
    var left = el('div');
    var ey = el('p', 'ey'); ey.textContent = 'Let’s build';
    var h2 = el('h2'); h2.textContent = 'Ready to build what only you can?';
    left.appendChild(ey); left.appendChild(h2);
    var btn = el('a', 'thx-fbtn'); btn.setAttribute('href', '/company/global/contact');
    btn.innerHTML = 'Get in touch <span class="ar">→</span>';
    cta.appendChild(left); cta.appendChild(btn);

    var social = null, keep = [];
    cols.forEach(function (c) {
      var h = c.querySelector('.footer-h');
      if (h && /social/i.test(h.textContent)) social = c; else keep.push(c);
    });
    var wrap = el('div', 'thx-fcols');
    var anchor = cols[0];
    anchor.parentNode.insertBefore(cta, anchor);
    anchor.parentNode.insertBefore(wrap, anchor);
    keep.forEach(function (c) { wrap.appendChild(c); });
    if (social) social.style.display = 'none';

    var soc = el('div', 'thx-fsoc');
    var map = { x: 'X', twitter: 'X', linkedin: 'LinkedIn', youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook' };
    if (social) {
      [].slice.call(social.querySelectorAll('a')).forEach(function (a) {
        var key = (a.textContent || '').trim().toLowerCase();
        var name = map[key]; var ic = name && ICONS[name]; if (!ic) return;
        var na = el('a'); var href = a.getAttribute('href') || '#';
        na.setAttribute('href', href);
        if (/^https?:/.test(href)) { na.setAttribute('target', '_blank'); na.setAttribute('rel', 'noopener'); }
        na.setAttribute('aria-label', name); na.innerHTML = ic;
        soc.appendChild(na);
      });
    }

    var mark = el('div', 'thx-fmark'); mark.setAttribute('aria-hidden', 'true'); mark.textContent = 'THEODYX';
    if (bottom) {
      bottom.parentNode.insertBefore(mark, bottom);
      if (soc.children.length) bottom.appendChild(soc);
    } else {
      f.appendChild(mark); if (soc.children.length) f.appendChild(soc);
    }
  }

  function links() {
    var f = document.querySelector('.footer'); if (!f) return;
    var ov = [
      ['Partners', '/company/global/partners'],
      ['Clients', '/company/global/clients'],
      ['Capabilities', '/company/global/our-capabilities'],
      ['About', '/resources/company-pages/about'],
      ['Our thinking', '/company/global/thinking-overview'],
      ['Connect', '/company/global/contact'],
      ['Privacy', '/resources/company-pages/terms-conditions'],
      ['Terms', '/resources/company-pages/terms-conditions'],
      ['Cookies', '/resources/company-pages/terms-conditions'],
      ['Accessibility', '/resources/company-pages/terms-conditions']
    ];
    [].slice.call(f.querySelectorAll('a.footer-link')).forEach(function (a) {
      var t = (a.textContent || '').replace(/\s+/g, ' ').trim();
      for (var i = 0; i < ov.length; i++) {
        if (t === ov[i][0]) { a.setAttribute('href', ov[i][1]); a.removeAttribute('target'); a.removeAttribute('rel'); return; }
      }
      if (/@theodyx\.com/i.test(t)) { a.setAttribute('href', 'mailto:contact@theodyx.com'); return; }
      if (/^\+?[\d.\s()-]{7,}$/.test(t)) { a.setAttribute('href', 'tel:+19382935290'); return; }
      if (/coastal highway/i.test(t)) { a.setAttribute('href', 'https://www.google.com/maps/search/?api=1&query=16192+Coastal+Highway+Lewes+DE+19958'); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); return; }
    });
  }

  function cleanup() {
    var lw = 'convallis accumsan placerat faucibus vestibulum ultricies commodo malesuada consectetur'.split(' ');
    [].forEach.call(document.querySelectorAll('span,p,div,li'), function (e) {
      if (e.children.length === 0) {
        var t = (e.textContent || '').trim();
        if (t.length > 0 && t.length < 44 && lw.some(function (w) { return t.indexOf(w) > -1; })) e.textContent = '';
      }
    });
    [].forEach.call(document.images, function (im) {
      if (im.complete && im.naturalWidth === 0 && !im.getAttribute('data-keep')) im.style.opacity = '0';
    });
  }

  var lqRaf = false;
  function lqR() {
    if (lqRaf) return; lqRaf = true;
    requestAnimationFrame(function () {
      lqRaf = false; var r = window.__liquidGLRenderer__; if (!r || !r.lenses) return;
      for (var i = 0; i < r.lenses.length; i++) { try { r.lenses[i].updateMetrics && r.lenses[i].updateMetrics(); } catch (e) {} }
      try { r.render && r.render(); } catch (e) {}
    });
  }
  var lqB = false;
  function lqBind() {
    if (lqB || !window.__liquidGLRenderer__) return; lqB = true;
    window.addEventListener('resize', lqR, { passive: true });
    if (window.visualViewport) {
      visualViewport.addEventListener('resize', lqR, { passive: true });
      visualViewport.addEventListener('scroll', lqR, { passive: true });
    }
  }
  var lqt = setInterval(function () { lqBind(); if (lqB) clearInterval(lqt); }, 500);
  setTimeout(function () { clearInterval(lqt); }, 20000);

  function run() {
    injectCSS();
    var f = document.querySelector('.footer'); if (!f) return false;
    build(f); links(); cleanup();
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.footer a[href="#"]');
    if (a) e.preventDefault();
  }, false);

  if (document.readyState !== 'loading') run(); else document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  var n = 0, iv = setInterval(function () { if (run() || ++n > 6) clearInterval(iv); }, 600);
})();
