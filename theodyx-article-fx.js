/*! theodyx-article-fx v1.6.2 — Theodyx publication template reading chrome.
   CONTRACT: enhancement-only. All content is native Webflow DOM; this script only
   (1) links existing <sup>N</sup> footnote markers to the Notes & sources list (dedicated .art-notes section, or legacy in-body h6+ol),
   (2) injects an "In this report" TOC from the article headings (h2, falling back to h3 then h4; 3+ entries) across EVERY
       .thx-read-body (the pubs composer may split the body into two sheets) and highlights the active section while reading,
   (2b) rewrites .thx-rel-card hrefs from their bound .thx-rel-slug carriers (article + index pages) and orders the Keep-reading band
        by the current article's Section (cards carrying a .thx-rel-secx carrier), most-recent as the fallback, 3 shown,
   (3) reading progress: hands off to the glass nav (window.__thxNav.progress) — its in-pill hairline — else a body hairline,
   (4) hides the current article from the Keep-reading band,
   (5) tags "Sources:" paragraphs with .thx-srcline for styling,
   (6) computes the reading time from the rendered body (230 wpm) and writes it into the metaline's "min read" figure,
   (7) JSON-LD: patches the server-rendered #thx-article-ssr block (wordCount, timeRequired, author @id, dateModified, dates → ISO)
       or, when the template has none, injects WebSite + Article + BreadcrumbList built from the live DOM.
   Runs at DOMContentLoaded and again after load (the composer splits the body between the two), idempotently.
   Removing this script degrades gracefully; content stays fully Designer-editable. */
(function () {
  /* Phase 6: strings come from the locale runtime (nv2pagesf carries the dictionary; English fallback here); the visible date renders through Intl inside <time datetime> */
  var I = window.__thxI18n, EN = { 'art.note': 'Note {n}', 'art.backref': 'Back to reference {n}', 'art.toc': 'In this report', 'art.readmin': '{n} min read' };
  function T(k, v) { if (I && I.t) return I.t(k, v); var s = EN[k] || k; if (v) for (var p in v) s = s.split('{' + p + '}').join(v[p]); return s; }
  function timeWrap(el, shown, iso) {
    try {
      if (!iso || el.querySelector('time')) return;
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        var i = n.nodeValue.indexOf(shown); if (i < 0) continue;
        var t = document.createElement('time'); t.setAttribute('datetime', iso); t.textContent = I ? I.date(iso) : shown;
        var after = n.splitText(i); after.nodeValue = after.nodeValue.slice(shown.length); n.parentNode.insertBefore(t, after); return;
      }
    } catch (e) {}
  }  if (window.__thxArtFx) return; window.__thxArtFx = 1;
  var ready = function (f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f(); };
  var txt = function (el) { return el ? (el.textContent || '').trim() : ''; };
  var WPM = 230;
  var PUB = '/our-thinking';
  var SEC = { 'Report': '/our-thinking', 'News': '/our-thinking', 'Briefing': '/our-thinking', 'Resource': '/our-thinking', 'Publication': '/our-thinking' }; /* Phase 7: no per-section hubs exist; the crumb points at the hub instead of a 404 */
  var MO = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };

  function bodies() { return [].slice.call(document.querySelectorAll('.thx-read-body')); }
  function words() {
    var n = 0;
    bodies().forEach(function (b) { n += (b.innerText || b.textContent || '').trim().split(/\s+/).filter(Boolean).length; });
    return n;
  }
  function isoDate(s) {
    if (!s) return '';
    s = String(s).trim();
    var m = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    var dm = s.match(/([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/);
    if (dm && MO[dm[1].toLowerCase()]) { var mo = MO[dm[1].toLowerCase()], dd = parseInt(dm[2], 10); return dm[3] + '-' + (mo < 10 ? '0' : '') + mo + '-' + (dd < 10 ? '0' : '') + dd; }
    var d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return '';
  }
  function sectionName() {
    var ct = document.querySelector('.thx-crumb');
    if (!ct) return '';
    var segs = ct.querySelectorAll('p:not(.thx-dot):not(.thx-crumb-t)');
    for (var i = 0; i < segs.length; i++) { var st = txt(segs[i]); if (st) return st; }
    return '';
  }
  function authorName() {
    var byEl = document.querySelector('.thx-ml-by, .thx-read-by');
    return txt(byEl).replace(/^By\s+/i, '');
  }
  function personId(name) {
    var origin = location.origin;
    if (/\bgrant\b[\s\S]*\bsikes\b/i.test(name)) return origin + '/#grant-sikes';
    if (/\blisa\b[\s\S]*\bsikes\b/i.test(name)) return origin + '/#lisa-sikes';
    return '';
  }

  /* ---------- cards (articles + index pages) ---------- */
  function cards() {
    try {
      document.querySelectorAll('a.thx-rel-card').forEach(function (a3) {
        var sl = a3.querySelector('.thx-rel-slug');
        if (sl && sl.textContent.trim()) a3.setAttribute('href', PUB + '/' + sl.textContent.trim());
      });
      var here = location.pathname.replace(/\/$/, '');
      document.querySelectorAll('a.thx-rel-card').forEach(function (a3) {
        try {
          var u = new URL(a3.getAttribute('href'), location.origin);
          if (u.pathname.replace(/\/$/, '') === here) { var it = a3.closest('.w-dyn-item') || a3; it.style.display = 'none'; }
        } catch (e) {}
      });
      var rel = document.querySelector('.thx-rel-sec');
      if (rel) {
        var its = [].slice.call(rel.querySelectorAll('.w-dyn-item')).filter(function (it) { return it.style.display !== 'none'; });
        /* section-aware ordering: matches first (document order = most recent first), then the rest; show 3 */
        var sec = sectionName().toLowerCase();
        var grid = its.length ? its[0].parentNode : null;
        if (grid && sec) {
          var match = [], rest = [];
          its.forEach(function (it) {
            var c = it.querySelector('.thx-rel-secx');
            (c && txt(c).toLowerCase() === sec ? match : rest).push(it);
          });
          if (match.length && rest.length) match.concat(rest).forEach(function (it) { grid.appendChild(it); });
          its = match.concat(rest);
        }
        its.forEach(function (it, i) { if (i >= 3) it.setAttribute('data-thx-hide', '1'); else it.removeAttribute('data-thx-hide'); });
        var all = rel.querySelectorAll('.w-dyn-item');
        if (all.length && !its.length) rel.style.display = 'none';
      }
    } catch (e) {}
  }

  /* ---------- footnotes ---------- */
  function footnotes(body) {
    var notes = document.querySelector('.art-notes-list ol');
    if (!notes) {
      var h6 = body.querySelector('h6');
      if (h6) { h6.classList.add('thx-notes-h'); var sib = h6.nextElementSibling; if (sib && sib.tagName === 'OL') { notes = sib; notes.classList.add('thx-notes'); } }
    }
    if (!notes) return;
    var lis = notes.children, i;
    for (i = 0; i < lis.length; i++) lis[i].id = lis[i].id || 'note-' + (i + 1);
    var sups = [];
    bodies().forEach(function (b) { sups = sups.concat([].slice.call(b.querySelectorAll('sup'))); });
    for (i = 0; i < sups.length; i++) {
      var s = sups[i];
      if (notes.contains(s) || s.querySelector('a')) continue;
      var n = parseInt((s.textContent || '').trim(), 10);
      if (!n || n > lis.length) continue;
      var a = document.createElement('a');
      a.href = '#note-' + n;
      if (!document.getElementById('ref-' + n)) a.id = 'ref-' + n;
      a.textContent = n;
      a.setAttribute('aria-label', T('art.note', { n: n }));
      s.textContent = '';
      s.appendChild(a);
    }
    for (i = 0; i < lis.length; i++) {
      if (!document.getElementById('ref-' + (i + 1)) || lis[i].querySelector('.thx-note-back')) continue;
      var b = document.createElement('a');
      b.className = 'thx-note-back';
      b.href = '#ref-' + (i + 1);
      b.textContent = '↩';
      b.setAttribute('aria-label', T('art.backref', { n: i + 1 }));
      lis[i].appendChild(document.createTextNode(' '));
      lis[i].appendChild(b);
    }
  }

  /* ---------- headings + TOC + active section ---------- */
  function headings() {
    var bs = bodies(), lvls = ['h2', 'h3', 'h4'], out = [];
    for (var l = 0; l < lvls.length; l++) {
      out = [];
      bs.forEach(function (b) { out = out.concat([].filter.call(b.querySelectorAll(lvls[l]), function (h) { return !h.classList.contains('thx-notes-h') && txt(h); })); });
      if (out.length >= 3) return out;
    }
    return [];
  }
  var tocState = { hs: [], links: [], bound: false, key: '' };
  function toc(body) {
    var hs = headings();
    var key = hs.map(function (h) { return txt(h); }).join('|');
    if (!hs.length) return;
    hs.forEach(function (h, idx) { if (!h.id) h.id = 's' + (idx + 1) + '-' + txt(h).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56); });
    var nav = document.querySelector('.thx-toc');
    if (nav && key === tocState.key) return;
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'thx-toc';
      nav.setAttribute('aria-label', T('art.toc'));
      var lab = document.createElement('p'); lab.className = 'thx-toc-h'; lab.textContent = T('art.toc'); nav.appendChild(lab);
      nav.appendChild(document.createElement('ol'));
      var kt = document.getElementById('thxartkt');
      if (kt) kt.insertAdjacentElement('afterend', nav); else body.parentNode.insertBefore(nav, body);
    }
    var ol = nav.querySelector('ol'); ol.textContent = '';
    tocState.links = [];
    hs.forEach(function (h) {
      var li = document.createElement('li'), a2 = document.createElement('a');
      a2.href = '#' + h.id; a2.textContent = txt(h);
      li.appendChild(a2); ol.appendChild(li); tocState.links.push(a2);
    });
    tocState.hs = hs; tocState.key = key;
    if (!tocState.bound) {
      tocState.bound = true;
      var t = 0;
      var upd = function () {
        t = 0;
        var mark = window.innerHeight * 0.3, cur = -1;
        for (var i = 0; i < tocState.hs.length; i++) { if (tocState.hs[i].getBoundingClientRect().top <= mark) cur = i; else break; }
        tocState.links.forEach(function (a, i) { if (i === cur) { a.classList.add('on'); a.setAttribute('aria-current', 'location'); } else { a.classList.remove('on'); a.removeAttribute('aria-current'); } });
      };
      var sched = function () { if (!t) t = (window.requestAnimationFrame || setTimeout)(upd); };
      addEventListener('scroll', sched, { passive: true });
      addEventListener('resize', sched, { passive: true });
      upd();
    }
  }

  /* ---------- reading time ---------- */
  function readTime() {
    var wc = words();
    if (wc < 80) return 0;
    var min = Math.max(1, Math.round(wc / WPM));
    var box = document.querySelector('.thx-ml-min');
    if (box) {
      var ps = box.querySelectorAll('.thx-ml-t');
      if (ps.length && /^\d+$/.test(txt(ps[0]))) ps[0].textContent = String(min);
      else if (ps.length && /^\d+\s*min/i.test(txt(ps[0]))) ps[0].textContent = T('art.readmin', { n: I ? I.num(min) : String(min) });
    }
    return min;
  }

  /* ---------- JSON-LD ---------- */
  function jsonld(min) {
    var origin = location.origin;
    var url = origin + location.pathname.replace(/\/$/, '');
    var ORG = origin + '/#organization', WEB = origin + '/#website';
    var titleEl = document.querySelector('.thx-read-title, h1');
    var title = txt(titleEl);
    var wc = words();
    var author = authorName(), PID = personId(author);
    var ssr = document.getElementById('thx-article-ssr');
    if (ssr) {
      /* patch the server-rendered Article (Webflow bindings render dates/names in their own formats) */
      try {
        var d = JSON.parse(ssr.textContent);
        var art = d['@graph'] ? d['@graph'].filter(function (n) { return n['@type'] === 'Article' || n['@type'] === 'BlogPosting'; })[0] : d;
        if (art) {
          if (!art.headline && title) art.headline = title;
          var dec = function (v) { if (typeof v !== 'string' || v.indexOf('&') < 0) return v; var t = document.createElement('textarea'); t.innerHTML = v; return t.value; }; /* Webflow HTML-escapes bound text inside custom code: &#39; → ' */
          if (art.headline) art.headline = dec(art.headline); if (art.description) art.description = dec(art.description); if (art.articleSection) art.articleSection = dec(art.articleSection);
          if (art.datePublished) art.datePublished = isoDate(art.datePublished) || art.datePublished;
          if (art.dateModified) art.dateModified = isoDate(art.dateModified) || art.dateModified;
          art.inLanguage = document.documentElement.getAttribute('lang') || art.inLanguage || 'en-US';
          if (!art.dateModified && art.datePublished) art.dateModified = art.datePublished;
          if (art.dateModified && art.datePublished && art.dateModified < art.datePublished) art.dateModified = art.datePublished;
          if (wc > 50) art.wordCount = wc;
          if (min) art.timeRequired = 'PT' + min + 'M';
          if (Array.isArray(art.image)) art.image = art.image.filter(Boolean);
          if (art.image && !art.image.length) delete art.image;
          var an = (author && !/theodyx/i.test(author)) ? author : ((art.author && art.author.name) || author); /* 1.6.2: the rendered byline wins over the static SSR Organization when it names a person */
          if (an && !/theodyx/i.test(an)) { var pid = personId(an); art.author = pid ? { '@type': 'Person', '@id': pid, 'name': an } : { '@type': 'Person', 'name': an }; }
          else art.author = { '@type': 'Organization', '@id': ORG, 'name': 'Theodyx' };
          if (!art.publisher) art.publisher = { '@id': ORG };
          if (!art.mainEntityOfPage) art.mainEntityOfPage = url;
          if (!art.inLanguage) art.inLanguage = 'en-US';
          /* Phase 7 (SD-03/SD-04): the server block is a flat Article; publish it as a @graph with a resolvable publisher, the WebSite node and a BreadcrumbList */
          var LOGO = 'https://cdn.prod.website-files.com/69fe0aaad9f3034241913693/6a1a1717e93ecc012e58ba8b_theodyx-webclip.png';
          art.publisher = { '@type': 'Organization', '@id': ORG, 'name': 'Theodyx', 'url': origin + '/', 'logo': { '@type': 'ImageObject', 'url': LOGO } };
          art.isPartOf = { '@id': WEB };
          var crumbs = [{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin + '/' }, { '@type': 'ListItem', 'position': 2, 'name': 'Our Thinking', 'item': origin + PUB }, { '@type': 'ListItem', 'position': 3, 'name': art.headline || title, 'item': url }];
          d = { '@context': 'https://schema.org', '@graph': [art, { '@type': 'WebSite', '@id': WEB, 'url': origin + '/', 'name': 'Theodyx', 'publisher': { '@id': ORG } }, { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', 'itemListElement': crumbs }] };
          ssr.textContent = JSON.stringify(d);
          try { var ml2 = document.querySelector('.thx-art-metaline'); if (ml2 && art.datePublished) { var mm = txt(ml2).match(/([A-Z][a-z]+ \d{1,2},\s*\d{4})/); if (mm) timeWrap(ml2, mm[1], isoDate(mm[1]) || String(art.datePublished).slice(0, 10)); } } catch (e) {} /* the visible date gets <time datetime> + Intl text on the server-rendered path too; the ISO comes from the rendered day (site timezone), not the UTC stamp */
          return;
        }
      } catch (e) { /* malformed server block (e.g. a quote in a bound field): fall through and build a clean one */ }
    }
    if (!title || document.getElementById('thx-article-jsonld')) return;
    var deckEl = document.querySelector('.thx-read-deck');
    var deck = (deckEl && !deckEl.classList.contains('w-dyn-bind-empty')) ? txt(deckEl) : '';
    var heroImg = document.querySelector('.thx-art-hero-img');
    var image = (heroImg && !heroImg.classList.contains('w-dyn-bind-empty') && heroImg.getAttribute('src')) ? heroImg.getAttribute('src') : '';
    var section = sectionName();
    var iso = '';
    var ml = document.querySelector('.thx-art-metaline');
    if (ml) { var m = txt(ml).match(/([A-Z][a-z]+ \d{1,2},\s*\d{4})/); if (m) { iso = isoDate(m[1]); timeWrap(ml, m[1], iso); } }
    var mod = document.documentElement.getAttribute('data-thx-updated') ? isoDate(document.documentElement.getAttribute('data-thx-updated')) : '';
    var article = { '@type': 'Article', 'headline': title, 'inLanguage': 'en-US' };
    if (deck) article.description = deck;
    if (image) article.image = [image];
    if (iso) { article.datePublished = iso; article.dateModified = (mod && mod >= iso) ? mod : iso; }
    if (section) article.articleSection = section;
    article.author = (author && !/theodyx/i.test(author)) ? (PID ? { '@type': 'Person', '@id': PID, 'name': author } : { '@type': 'Person', 'name': author }) : { '@type': 'Organization', 'name': 'Theodyx', '@id': ORG };
    if (wc > 50) article.wordCount = wc;
    if (min) article.timeRequired = 'PT' + min + 'M';
    article.publisher = { '@type': 'Organization', 'name': 'Theodyx', '@id': ORG };
    article.isPartOf = { '@id': WEB };
    article.mainEntityOfPage = { '@type': 'WebPage', '@id': url };
    var graph = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', '@id': WEB, 'url': origin + '/', 'name': 'Theodyx', 'publisher': { '@id': ORG } },
      article,
      { '@type': 'BreadcrumbList', 'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Our Thinking', 'item': origin + PUB },
        { '@type': 'ListItem', 'position': 3, 'name': title, 'item': url } ] } ] };
    var sc = document.createElement('script');
    sc.type = 'application/ld+json'; sc.id = 'thx-article-jsonld'; sc.textContent = JSON.stringify(graph);
    document.head.appendChild(sc);
  }

  /* ---------- progress ---------- */
  var progDone = false;
  function progress() {
    if (progDone) return; progDone = true;
    var api = window.__thxNav;
    if (api && typeof api.progress === 'function' && api.progress(true)) return;
    if (document.querySelector('.thx-progress')) return;
    var bar = document.createElement('div');
    bar.className = 'thx-progress';
    document.body.appendChild(bar);
    var upd = function () { var d = document.documentElement; var m = d.scrollHeight - d.clientHeight; bar.style.width = (m > 0 ? (100 * d.scrollTop / m) : 0) + '%'; };
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd, { passive: true });
    upd();
  }

  /* ---------- breadcrumb section link ---------- */
  function crumb() {
    var c = document.querySelector('.thx-crumb');
    if (!c) return;
    c.querySelectorAll('p:not(.thx-dot):not(.thx-crumb-t)').forEach(function (p) {
      var t = txt(p);
      if (SEC[t] && !p.querySelector('a')) { var a4 = document.createElement('a'); a4.href = SEC[t]; a4.textContent = t; p.textContent = ''; p.appendChild(a4); }
    });
  }

  function run() {
    cards();
    var body = document.querySelector('.thx-read-body');
    if (!body) return;
    try { footnotes(body); } catch (e) {}
    try { toc(body); } catch (e) {}
    try { crumb(); } catch (e) {}
    try { bodies().forEach(function (b) { b.querySelectorAll('p').forEach(function (p) { if (/^Sources?:/.test(txt(p))) p.classList.add('thx-srcline'); }); }); } catch (e) {}
    var min = 0;
    try { min = readTime(); } catch (e) {}
    try { jsonld(min); } catch (e) {}
    try { progress(); } catch (e) {}
  }
  ready(function () {
    run();
    /* the pubs composer may split the body after us: re-run once the page has loaded (idempotent) */
    var again = function () { setTimeout(run, 60); setTimeout(run, 700); };
    if (document.readyState === 'complete') again(); else addEventListener('load', again, { once: true });
  });
})();

/* 1.6.1 (Phase 7) outline hygiene. Two template quirks the Data API cannot change: a Heading element cannot become a div
   (so the aria-hidden .thx-read-title h2 stays an h2 in the outline), and a CMS-bound heading with no value still renders as an
   empty <h2 class="w-dyn-bind-empty"> (Webflow only hides it with CSS). Both are corrected in the rendered DOM: empty bound
   headings are removed, and the read-title heading is swapped for a div that keeps every attribute and child. */
;(function () {
  function fix() {
    try {
      document.querySelectorAll('h1.w-dyn-bind-empty,h2.w-dyn-bind-empty,h3.w-dyn-bind-empty,h4.w-dyn-bind-empty,h5.w-dyn-bind-empty,h6.w-dyn-bind-empty').forEach(function (h) { if (!h.textContent.trim()) h.remove(); });
      document.querySelectorAll('h1.thx-read-title,h2.thx-read-title,h3.thx-read-title,h4.thx-read-title').forEach(function (h) {
        var d = document.createElement('div'); for (var i = 0; i < h.attributes.length; i++) d.setAttribute(h.attributes[i].name, h.attributes[i].value);
        while (h.firstChild) d.appendChild(h.firstChild); h.parentNode.replaceChild(d, h);
      });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix); else fix();
})();
