/*! theodyx-article-fx v1.3.0 — Theodyx publication template reading chrome.
   CONTRACT: enhancement-only. All content is native Webflow DOM; this script only
   (1) links existing <sup>N</sup> footnote markers to the Notes & sources list (dedicated .art-notes section, or legacy in-body h6+ol),
   (2) injects an "In this report" TOC derived from body h2s (3+ sections),
   (2b) rewrites .thx-rel-card hrefs from their bound .thx-rel-slug carriers (article + index pages),
   (3) renders a reading-progress hairline,
   (4) hides the current article from the Keep-reading band,
   (5) tags "Sources:" paragraphs with .thx-srcline for styling,
   (7) injects WebSite + Article + BreadcrumbList JSON-LD (Person @id reuse, TZ-safe dates, wordCount) built from the live DOM (Webflow's
       server-side {{wf}} bindings render empty in structured data, so we build it here
       from CMS-accurate rendered content; Google executes JS and reads it).
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

      /* 7 — Article + BreadcrumbList JSON-LD from the live DOM */
      try {
        var titleEl = document.querySelector('.thx-read-title');
        if (titleEl && !document.getElementById('thx-article-jsonld')) {
          var txt = function (el) { return el ? (el.textContent || '').trim() : ''; };
          var ORG = 'https://www.theodyx.com/#organization';
          var WEB = 'https://www.theodyx.com/#website';
          var LOGO = 'https://s3.amazonaws.com/webflow-prod-assets/69fe0aaad9f3034241913693/6a1a1717e93ecc012e58ba8b_theodyx-webclip.png';
          var origin = location.origin;
          var url = origin + location.pathname.replace(/\/$/, '');
          var title = txt(titleEl);

          var deckEl = document.querySelector('.thx-read-deck');
          var deck = (deckEl && !deckEl.classList.contains('w-dyn-bind-empty')) ? txt(deckEl) : '';

          var heroImg = document.querySelector('.thx-art-hero-img');
          var image = (heroImg && !heroImg.classList.contains('w-dyn-bind-empty') && heroImg.getAttribute('src')) ? heroImg.getAttribute('src') : '';

          var byEl = document.querySelector('.thx-ml-by');
          var author = txt(byEl).replace(/^By\s+/i, '');

          var section = '';
          var ct = document.querySelector('.thx-crumb');
          if (ct) {
            var segs = ct.querySelectorAll('p:not(.thx-dot):not(.thx-crumb-t)');
            for (var si = 0; si < segs.length; si++) { var st = txt(segs[si]); if (st) { section = st; break; } }
          }

          var iso = '';
          var ml = document.querySelector('.thx-art-metaline');
          if (ml) {
            var m = txt(ml).match(/([A-Z][a-z]+ \d{1,2},\s*\d{4})/);
            if (m) { var MO = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12}; var dm = m[1].match(/([A-Za-z]+) (\d{1,2}),\s*(\d{4})/); if (dm && MO[dm[1].toLowerCase()]) { var mo = MO[dm[1].toLowerCase()], dd = parseInt(dm[2], 10); iso = dm[3] + '-' + (mo < 10 ? '0' : '') + mo + '-' + (dd < 10 ? '0' : '') + dd; } }
          }

          var article = { '@type': 'Article', 'headline': title, 'inLanguage': 'en' };
          if (deck) article.description = deck;
          if (image) article.image = [image];
          if (iso) { article.datePublished = iso; article.dateModified = iso; }
          if (section) article.articleSection = section;
          var PID = /grant\s+sikes/i.test(author) ? origin + '/#grant-sikes' : (/lisa\s+sikes/i.test(author) ? origin + '/#lisa-sikes' : '');
          article.author = author ? (PID ? { '@type': 'Person', '@id': PID, 'name': author } : { '@type': 'Person', 'name': author }) : { '@type': 'Organization', 'name': 'Theodyx', '@id': ORG };
          try { var bodyEl = document.querySelector('.thx-read-body, main.thx-read'); if (bodyEl) { var wc = (bodyEl.innerText || '').trim().split(/\s+/).filter(Boolean).length; if (wc > 50) article.wordCount = wc; } } catch (e) {}
          article.publisher = { '@type': 'Organization', 'name': 'Theodyx', '@id': ORG, 'logo': { '@type': 'ImageObject', 'url': LOGO } };
          article.isPartOf = { '@id': WEB };
          article.mainEntityOfPage = { '@type': 'WebPage', '@id': url };

          var graph = {
            '@context': 'https://schema.org',
            '@graph': [{ '@type': 'WebSite', '@id': WEB, 'url': origin + '/', 'name': 'Theodyx', 'publisher': { '@id': ORG } }, article, {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin + '/' },
                { '@type': 'ListItem', 'position': 2, 'name': 'Our Thinking', 'item': origin + '/our-thinking' },
                { '@type': 'ListItem', 'position': 3, 'name': title, 'item': url }
              ]
            }]
          };
          var sc = document.createElement('script');
          sc.type = 'application/ld+json';
          sc.id = 'thx-article-jsonld';
          sc.textContent = JSON.stringify(graph);
          document.head.appendChild(sc);
        }
      } catch (e) {}
    } catch (e) {}
  });
})();
