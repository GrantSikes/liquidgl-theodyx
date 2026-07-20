/*! theodyx-article-fx v1.1.0 — Theodyx publication template reading chrome.
   CONTRACT: enhancement-only. All content is native Webflow DOM; this script only
   (1) links existing <sup>N</sup> footnote markers to the Notes & sources list (dedicated .art-notes section, or legacy in-body h6+ol),
   (2) injects an "In this report" TOC derived from body h2s (3+ sections),
   (2b) rewrites .thx-rel-card hrefs from their bound .thx-rel-slug carriers (article + index pages),
   (3) renders a reading-progress hairline,
   (4) hides the current article from the Keep-reading band,
   (5) tags "Sources:" paragraphs with .thx-srcline for styling.
   Removing this script degrades gracefully; content stays fully Designer-editable. */
(function () {
  if (window.__thxArtFx) return; window.__thxArtFx = 1;
  var ready = function (f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f(); };
  ready(function () {
    try {
      /* cards — runs on every page carrying .thx-rel-card (articles + the index grid) */
      var PUB = '/our-thinking';
      document.querySelectorAll('a.thx-rel-card').forEach(function (a3) {
        var sl = a3.querySelector('.thx-rel-slug');
        if (sl && sl.textContent.trim()) a3.setAttribute('href', PUB + '/' + sl.textContent.trim());
      });
      var here = location.pathname.replace(/\/$/, '');
      document.querySelectorAll('a.thx-rel-card').forEach(function (a3) {
        try {
          var u = new URL(a3.getAttribute('href'), location.origin);
          if (u.pathname.replace(/\/$/, '') === here) {
            var it = a3.closest('.w-dyn-item') || a3;
            it.style.display = 'none';
          }
        } catch (e) {}
      });
      var rel = document.querySelector('.thx-rel-sec');
      if (rel) {
        var its = rel.querySelectorAll('.w-dyn-item');
        var vis = [].filter.call(its, function (it) { return it.style.display !== 'none'; });
        if (its.length && !vis.length) rel.style.display = 'none';
      }
    } catch (e) {}
    try {
      var body = document.querySelector('.thx-read-body');
      if (!body) return;

      /* 1 — footnotes: dedicated notes section first, legacy in-body h6+ol fallback */
      var notes = document.querySelector('.art-notes-list ol');
      if (!notes) {
        var h6 = body.querySelector('h6');
        if (h6) {
          h6.classList.add('thx-notes-h');
          var sib = h6.nextElementSibling;
          if (sib && sib.tagName === 'OL') { notes = sib; notes.classList.add('thx-notes'); }
        }
      }
      if (notes) {
        var lis = notes.children, i;
        for (i = 0; i < lis.length; i++) lis[i].id = lis[i].id || 'note-' + (i + 1);
        var sups = body.querySelectorAll('sup');
        for (i = 0; i < sups.length; i++) {
          var s = sups[i];
          if (notes.contains(s) || s.querySelector('a')) continue;
          var n = parseInt((s.textContent || '').trim(), 10);
          if (!n || n > lis.length) continue;
          var a = document.createElement('a');
          a.href = '#note-' + n;
          if (!document.getElementById('ref-' + n)) a.id = 'ref-' + n;
          a.textContent = n;
          a.setAttribute('aria-label', 'Note ' + n);
          s.textContent = '';
          s.appendChild(a);
        }
        for (i = 0; i < lis.length; i++) {
          if (!document.getElementById('ref-' + (i + 1))) continue;
          var b = document.createElement('a');
          b.className = 'thx-note-back';
          b.href = '#ref-' + (i + 1);
          b.textContent = '↩';
          b.setAttribute('aria-label', 'Back to reference ' + (i + 1));
          lis[i].appendChild(document.createTextNode(' '));
          lis[i].appendChild(b);
        }
      }

      /* 2 — In this report TOC */
      var hs = [].filter.call(body.querySelectorAll('h2'), function (h) { return !h.classList.contains('thx-notes-h'); });
      if (hs.length >= 3 && !document.querySelector('.thx-toc')) {
        var toc = document.createElement('nav');
        toc.className = 'thx-toc';
        toc.setAttribute('aria-label', 'In this report');
        var lab = document.createElement('p');
        lab.className = 'thx-toc-h';
        lab.textContent = 'In this report';
        toc.appendChild(lab);
        var ol = document.createElement('ol');
        hs.forEach(function (h, idx) {
          if (!h.id) h.id = 's' + (idx + 1) + '-' + (h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56);
          var li = document.createElement('li'), a2 = document.createElement('a');
          a2.href = '#' + h.id;
          a2.textContent = h.textContent;
          li.appendChild(a2);
          ol.appendChild(li);
        });
        toc.appendChild(ol);
        var kt = document.getElementById('thxartkt');
        if (kt) kt.insertAdjacentElement('afterend', toc);
        else body.parentNode.insertBefore(toc, body);
      }

      /* 3 — reading progress */
      if (!document.querySelector('.thx-progress')) {
        var bar = document.createElement('div');
        bar.className = 'thx-progress';
        document.body.appendChild(bar);
        var upd = function () {
          var d = document.documentElement;
          var m = d.scrollHeight - d.clientHeight;
          bar.style.width = (m > 0 ? (100 * d.scrollTop / m) : 0) + '%';
        };
        addEventListener('scroll', upd, { passive: true });
        addEventListener('resize', upd, { passive: true });
        upd();
      }

      /* 5 — breadcrumb: link the Section crumb to its landing page */
      var SEC = { 'Report': '/our-thinking/reports', 'News': '/our-thinking/news', 'Briefing': '/our-thinking/briefings', 'Resource': '/our-thinking/resources' };
      var crumb = document.querySelector('.thx-crumb');
      if (crumb) {
        var ps = crumb.querySelectorAll('p:not(.thx-dot):not(.thx-crumb-t)');
        ps.forEach(function (p) {
          var t = (p.textContent || '').trim();
          if (SEC[t] && !p.querySelector('a')) {
            var a4 = document.createElement('a');
            a4.href = SEC[t];
            a4.textContent = t;
            p.textContent = '';
            p.appendChild(a4);
          }
        });
      }

      /* 6 — stray source lines */
      body.querySelectorAll('p').forEach(function (p) {
        if (/^Sources?:/.test((p.textContent || '').trim())) p.classList.add('thx-srcline');
      });
    } catch (e) {}
  });
})();
