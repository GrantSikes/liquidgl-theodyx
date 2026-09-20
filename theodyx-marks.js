/*! theodyx-marks.js v1.0.0 (2026-09-19) — the brand's monoline word marks as headers.
 * Owner directive: "Here is the font to use for the headers" - nineteen hand-set marks (Brand_Identity/Logos_and_Marks/*-w12-t140.svg).
 * Any heading whose text matches a mark is redrawn with it: the text stays in the DOM (visually hidden) for search engines and
 * screen readers, the mark is inline SVG in the heading's ink at the heading's size (150 units of cap height = the font's cap
 * height), and its strokes draw themselves in when the heading enters view. On the Thinking band the second line takes the
 * visit's accent, as the text did. Needs theodyx-marks-data.js (window.__thxMarks). No dependencies. */
(function () {
  'use strict';
  if (window.__thxMarksOn || !window.__thxMarks) return; window.__thxMarksOn = { v: '1.0.0' };
  var M = window.__thxMarks, RED = false; try { RED = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var st = document.createElement('style'); st.id = 'thx-marks-css';
  st.textContent = [
    '.thm{display:block;width:auto;max-width:100%;height:var(--thm-h);overflow:visible;color:inherit}',
    '.thm-sr{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
    '.thm-h{line-height:1}.thm-h.thm-inline .thm{display:inline-block;vertical-align:-.22em}',
    '.thm path[data-len]{stroke-dasharray:var(--l);stroke-dashoffset:var(--l)}.thm path[data-fill]{opacity:0}',
    '.thm-on path[data-len]{transition:stroke-dashoffset .55s cubic-bezier(.22,1,.36,1);transition-delay:var(--d);stroke-dashoffset:0}.thm-on path[data-fill]{transition:opacity .2s ease;transition-delay:var(--d);opacity:1}',
    '.thx-hue .thk-band .thm .thm-l2{color:var(--thx-acc)}',
    /* the hero's second line stays type: lighter weight so it sits with the monoline mark above it */
    '.hero-h1.thm-mixed .hero-line:not(.thm-h){font-weight:300;letter-spacing:-.02em}',
    '@media (prefers-reduced-motion:reduce){.thm path[data-len]{stroke-dashoffset:0;transition:none}.thm path[data-fill]{opacity:1;transition:none}}'
  ].join('\n');
  document.head.appendChild(st);
  function norm(t) { return (t || '').replace(/&amp;|&/g, 'and').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase(); }
  var byText = {}; Object.keys(M).forEach(function (k) { byText[norm(M[k].t)] = k; });
  var CAP = 0.72; /* cap height as a share of the font size (Google Sans Flex) */
  function build(k) {
    var m = M[k], vb = m.vb.split(' ').map(Number), h = vb[3];
    var wrap = document.createElement('div'); wrap.innerHTML = '<svg class="thm" xmlns="http://www.w3.org/2000/svg" viewBox="' + m.vb + '" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false">' + m.b + '</svg>';
    var svg = wrap.firstChild; svg.style.setProperty('--thm-h', (h / 150 * CAP).toFixed(3) + 'em');
    /* line 2 (baseline at y=240) is tagged so it can take a colour on its own */
    if (h > 300) { var g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g2.setAttribute('class', 'thm-l2'); var root = svg.querySelector('g[stroke]'); [].slice.call(root.children).forEach(function (el) { var d = el.getAttribute('d') || (el.querySelector('path') || {}).getAttribute && el.querySelector('path').getAttribute('d') || ''; var ys = (d.match(/(?:M|L)\s*-?[\d.]+\s+(-?[\d.]+)/g) || []).map(function (s) { return parseFloat(s.split(/\s+/).pop()); }); if (ys.length && Math.min.apply(null, ys) > 60) g2.appendChild(el); }); root.appendChild(g2); }
    /* stroke lengths and a left-to-right stagger for the draw */
    var paths = [].slice.call(svg.querySelectorAll('path')), x0 = vb[0], w = vb[2];
    paths.forEach(function (p) {
      var d = p.getAttribute('d'), mx = parseFloat((d.match(/M\s*(-?[\d.]+)/) || [0, 0])[1]), my = (d.match(/M\s*-?[\d.]+\s+(-?[\d.]+)/) || [0, 0])[1];
      var order = ((mx - x0) / w) + (parseFloat(my) > 60 ? 1 : 0); /* second line after the first */
      p.style.setProperty('--d', (order * 0.55).toFixed(3) + 's');
      if (p.getAttribute('fill') === 'currentColor') { p.setAttribute('data-fill', '1'); return; }
      var len = 0; try { len = p.getTotalLength(); } catch (e) {}
      if (!len) { var t = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); t.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'; var c = p.cloneNode(); t.appendChild(c); document.body.appendChild(t); len = c.getTotalLength(); document.body.removeChild(t); }
      p.setAttribute('data-len', '1'); p.style.setProperty('--l', (len + 2).toFixed(1));
    });
    return svg;
  }
  var io = ('IntersectionObserver' in window) && !RED ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('thm-on'); io.unobserve(e.target); } }); }, { threshold: 0.2 }) : null;
  function apply(el) {
    if (el.getAttribute('data-thm')) return;
    var key = byText[norm(el.innerText || el.textContent)]; if (!key) return;
    var svg = build(key), sr = document.createElement('span'); sr.className = 'thm-sr'; sr.textContent = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('data-thm', key); el.classList.add('thm-h'); el.textContent = ''; el.appendChild(sr); el.appendChild(svg);
    if (io) io.observe(svg); else svg.classList.add('thm-on');
  }
  function sweep(root) {
    [].slice.call((root || document).querySelectorAll('h1,h2,h3,.hero-line,.thk-title,.wwd-title,.thxo-h2,.ff-hero-h1,.p-partners-card-t,.wwd-t,.thk-card-t')).forEach(function (el) {
      /* the Thinking band title holds a glow span: match on the whole text, then replace the whole heading */
      if (el.querySelector('.thm')) return;
      if (el.classList.contains('hero-line')) { if (byText[norm(el.innerText || el.textContent)]) { apply(el); var h1 = el.closest('.hero-h1'); if (h1) h1.classList.add('thm-mixed'); } return; }
      apply(el);
    });
  }
  sweep();
  /* headings that scripts add later (carousels, hubs) */
  var mo = new MutationObserver(function (ms) { var t = 0; ms.forEach(function (m) { if (m.addedNodes.length) t = 1; }); if (t) sweep(); });
  mo.observe(document.body, { childList: true, subtree: true });
})();
