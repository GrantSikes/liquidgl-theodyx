/*! theodyx-network.js v1.1.0 (2026-09-19) — the Network application form, made easy.
 * Owner directive: "make it more UI/UX friendly and easy". The form's fields are native Webflow fields (editable in the Designer);
 * this file only arranges and helps them: section headings, a two-column grid for short fields, checkbox rows that read as one
 * line, availability as pill chips, the ORCID iD and bar number formatted as you type, repeatable "Add another link" rows with a
 * type dropdown, black ink everywhere (the site's legacy link colour is white), and a live character count on the statement.
 * 1.1.0 (owner): SSRN gets its own field; the Affiliation field becomes an institution typeahead backed by the Research Organization
 * Registry (api.ror.org, the open global registry publishers use - universities, hospitals, labs; an "Enter it myself" fallback stays);
 * the credential fields follow the primary discipline (bar fields for Law / Legal Academia, ORCID for the research disciplines) and
 * slide open instead of snapping; validation waits for blur; the submit shows a working state.
 * Fields are found by their name attribute, so the Designer can reorder or relabel them freely. No dependencies. */
(function () {
  'use strict';
  if (window.__thxNetwork) return; window.__thxNetwork = { v: '1.1.0' };
  var form = document.querySelector('form[data-name="Network Application"]'); if (!form) return;
  var SANS = '"Google Sans Flex","Google Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  var st = document.createElement('style'); st.id = 'thx-net-css';
  st.textContent = [
    '.ff-page .ff-main:has(> .w-form form.nf),.ff-page .ff-main:has(.w-form form.nf){max-width:800px;width:100%}',
    '.nf{width:100%;display:grid;grid-template-columns:1fr 1fr;column-gap:20px;row-gap:18px;max-width:760px;font-family:' + SANS + '}',
    '.nf .nf-field{grid-column:1/-1;display:flex;flex-direction:column;gap:8px;min-width:0}.nf .nf-half{grid-column:span 1}',
    '.nf .nf-h{grid-column:1/-1;margin:26px 0 2px;padding-top:26px;border-top:1px solid rgba(13,13,13,.14);font-size:22px;line-height:1.2;font-weight:400;color:#0d0d0d}.nf .nf-h:first-child{margin-top:0;padding-top:0;border-top:0}',
    '.nf .nf-hint{margin:-2px 0 0;font-size:13px;line-height:1.45;color:rgba(13,13,13,.62)}',
    '.nf .ff-label{margin:0;font-size:14px;font-weight:600;color:#0d0d0d}',
    '.nf .w-input,.nf .w-select,.nf .ff-input,.nf .ff-select,.nf .ff-textarea{margin:0;width:100%;box-sizing:border-box;color:#0d0d0d}',
    '.nf .nf-check{grid-column:1/-1;display:flex;align-items:flex-start;gap:12px;margin:0;cursor:pointer}.nf .nf-check .w-checkbox{margin:2px 0 0;padding:0;display:block}.nf .nf-check input[type=checkbox]{width:18px;height:18px;margin:0;accent-color:#0d0d0d}',
    '.nf .nf-check .w-form-label{font-size:15px;line-height:1.5;color:#0d0d0d;font-weight:400}',
    '.nf .nf-chips{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:10px}',
    '.nf .nf-chip{display:inline-flex;align-items:center;gap:8px;margin:0;padding:10px 16px;border:1px solid rgba(13,13,13,.28);border-radius:999px;background:#fff;color:#0d0d0d;font-size:15px;line-height:1;cursor:pointer;transition:background .15s,border-color .15s,color .15s}',
    '.nf .nf-chip input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}.nf .nf-chip .w-form-label{margin:0;font-size:15px;color:inherit}.nf .nf-chip.nf-on{background:#0d0d0d;border-color:#0d0d0d;color:#fff}.nf .nf-chip:focus-within{outline:2px solid #0d0d0d;outline-offset:2px}',
    '.nf .nf-link-row{grid-column:1/-1;display:grid;grid-template-columns:minmax(150px,220px) 1fr auto;gap:10px;align-items:center}.nf .nf-link-row .nf-x{width:44px;height:52px;border:1px solid rgba(13,13,13,.22);border-radius:12px;background:#fff;color:#0d0d0d;font-size:20px;line-height:1;cursor:pointer}',
    '.nf .nf-add{grid-column:1/-1;justify-self:start;padding:11px 18px;border:1px solid #0d0d0d;border-radius:999px;background:transparent;color:#0d0d0d;font:15px/1 ' + SANS + ';cursor:pointer}.nf .nf-add:hover{background:#0d0d0d;color:#fff}',
    '.nf .nf-combo{position:relative}.nf .nf-list{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:30;max-height:290px;overflow:auto;margin:0;padding:6px;list-style:none;background:#fff;border:1px solid rgba(13,13,13,.18);border-radius:12px;box-shadow:0 14px 40px rgba(13,13,13,.12)}',
    '.nf .nf-opt{padding:10px 12px;border-radius:8px;cursor:pointer;font-size:15px;line-height:1.35;color:#0d0d0d}.nf .nf-opt small{display:block;font-size:12.5px;color:rgba(13,13,13,.6)}.nf .nf-opt[aria-selected=true],.nf .nf-opt:hover{background:rgba(13,13,13,.06)}.nf .nf-opt b{font-weight:600}',
    '.nf .nf-opt.nf-manual{color:rgba(13,13,13,.72);font-style:italic}.nf .nf-picked{margin:6px 0 0;font-size:13px;color:rgba(13,13,13,.62)}',
    '.nf .nf-cond{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;column-gap:20px;row-gap:18px;overflow:hidden;max-height:0;opacity:0;transition:max-height .32s cubic-bezier(.22,1,.36,1),opacity .28s ease,margin .32s;margin:0}.nf .nf-cond.nf-open{max-height:900px;opacity:1}.nf .nf-cond:not(.nf-open){margin-top:-18px}',
    '.nf .nf-bad{border-color:#b3261e!important}.nf .nf-err{margin:-2px 0 0;font-size:13px;color:#b3261e}',
    '.nf .nf-count{text-align:right;font-size:13px;color:rgba(13,13,13,.62)}.nf .nf-count.nf-low{color:#b3261e}',
    '.nf .nf-submit{grid-column:1/-1;margin-top:8px}.nf a{color:#0d0d0d!important;text-decoration:underline;text-underline-offset:2px}',
    '.ff-page .ff-form-note,.ff-page .ff-form-note *{color:rgba(13,13,13,.72)}',
    '@media (max-width:640px){.nf{grid-template-columns:1fr}.nf .nf-cond{grid-template-columns:1fr}.nf .nf-half{grid-column:1/-1}.nf .nf-link-row{grid-template-columns:1fr auto}.nf .nf-link-row select{grid-column:1/-1}}'
  ].join('\n');
  document.head.appendChild(st);

  function byName(n) { return form.querySelector('[name="' + n + '"]'); }
  function q(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  /* every control and the label before it become one .nf-field; checkboxes become one row */
  function fieldOf(el) {
    var wrap = el.closest('.nf-field'); if (wrap) return wrap;
    var lab = el.previousElementSibling; if (lab && lab.tagName !== 'LABEL') lab = null;
    wrap = document.createElement('div'); wrap.className = 'nf-field';
    el.parentNode.insertBefore(wrap, lab || el); if (lab) wrap.appendChild(lab); wrap.appendChild(el);
    if (lab && el.id) lab.setAttribute('for', el.id); return wrap;
  }
  form.classList.add('nf');
  /* flatten the builder's inner wrapper so the grid sees every field */
  q(':scope > div', form).forEach(function (d) { if (!d.classList.contains('w-checkbox')) { while (d.firstChild) form.insertBefore(d.firstChild, d); d.parentNode.removeChild(d); } });
  q('input:not([type=checkbox]):not([type=submit]),select,textarea', form).forEach(function (el) { if (el.name) { el.id = el.id || el.name; fieldOf(el); } });
  /* checkboxes: the outer label holds the inline .w-checkbox and the visible text */
  q('label > .w-checkbox', form).forEach(function (cb) { var row = cb.parentNode; row.className = 'nf-check'; var inp = cb.querySelector('input'); if (inp) { inp.id = inp.id === 'checkbox' || !inp.id ? (inp.name + '-' + (inp.value || 'x')).replace(/[^\w-]+/g, '-') : inp.id; row.setAttribute('for', inp.id); } });
  /* availability → chips */
  var av = q('.nf-check input[name="Availability"]', form);
  if (av.length) {
    var chips = document.createElement('div'); chips.className = 'nf-chips';
    var first = av[0].closest('.nf-check'); first.parentNode.insertBefore(chips, first);
    av.forEach(function (i) { var row = i.closest('.nf-check'); row.className = 'nf-chip' + (i.checked ? ' nf-on' : ''); chips.appendChild(row); i.addEventListener('change', function () { row.classList.toggle('nf-on', i.checked); }); });
    var avLab = q('label.ff-label', form).filter(function (l) { return /^Availability/i.test(l.textContent); })[0];
    if (avLab) { var f = document.createElement('div'); f.className = 'nf-field'; chips.parentNode.insertBefore(f, chips); f.appendChild(avLab); f.appendChild(chips); }
  }
  /* half-width fields */
  ['First-Name', 'Last-Name', 'Email', 'Institutional-Email', 'Honorific', 'Affiliation', 'Bar-Jurisdiction', 'Bar-Number', 'ORCID', 'LinkedIn', 'SSRN', 'Source', 'Discipline', 'Headline'].forEach(function (n) { var el = byName(n); if (el) fieldOf(el).classList.add('nf-half'); });
  /* section headings, placed before the first field of each group */
  function heading(text, beforeName, hint) { var el = byName(beforeName); if (!el) return; var h = document.createElement('h3'); h.className = 'nf-h'; h.textContent = text; var f = fieldOf(el); f.parentNode.insertBefore(h, f); if (hint) { var p = document.createElement('p'); p.className = 'nf-hint'; p.style.gridColumn = '1/-1'; p.textContent = hint; f.parentNode.insertBefore(p, f); } }
  heading('About you', 'First-Name');
  heading('Your work', 'Headline');
  heading('Credentials', byName('Bar-Jurisdiction') ? 'Bar-Jurisdiction' : 'ORCID', 'Only what applies to you. Attorneys: your bar jurisdiction and number. Academics: your ORCID iD.');
  heading('Links', byName('LinkedIn') ? 'LinkedIn' : 'Link-1-Type', 'Where we can verify your work. LinkedIn has its own field; add as many other links as you like.');
  if (byName('Publications')) heading('Publications', 'Publications', 'Optional. One per line: a DOI (10.1234/abcd) or a URL.');
  heading('What you want to say', 'Statement');
  heading('Availability and source', av.length ? 'Availability' : 'Source');
  var agr = byName('Agreement'); if (agr) { var h = document.createElement('h3'); h.className = 'nf-h'; h.textContent = 'Agreement'; var row = agr.closest('.nf-check'); row.parentNode.insertBefore(h, row); }
  /* hints under specific fields */
  function hint(n, t) { var el = byName(n); if (!el) return; var p = document.createElement('p'); p.className = 'nf-hint'; p.textContent = t; fieldOf(el).appendChild(p); }
  /* placeholders the Data API cannot set */
  [['Institutional-Email','name@university.edu'],['Publications','One per line: a DOI (10.1234/abcd) or a URL'],['First-Name','First name'],['Last-Name','Last name'],['Email','you@email.com']].forEach(function (x) { var el = byName(x[0]); if (el && (!el.placeholder || el.placeholder === 'Example text')) el.placeholder = x[1]; });
  hint('Institutional-Email', 'Your university, firm, or company address. It speeds up verification and is never published.');
  hint('Topics', 'Up to six, separated by commas. Example: First Amendment, media law, platform governance.');
  hint('Bar-Number', 'Exactly as your bar lists it. Example: 2019-123456 or 123456.');
  hint('ORCID', 'Sixteen digits, formatted 0000-0000-0000-0000. Find yours at orcid.org.');
  hint('SSRN', 'Your author page. Example: https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=123456');
  var ssrn = byName('SSRN'); if (ssrn) { ssrn.setAttribute('placeholder', 'https://papers.ssrn.com/…'); ssrn.setAttribute('inputmode', 'url'); ssrn.addEventListener('blur', function () { var v = ssrn.value.trim(); if (v && !/^https?:\/\//i.test(v)) ssrn.value = 'https://' + v.replace(/^\/+/, ''); }); }
  /* ORCID: hyphens as you type */
  var orc = byName('ORCID');
  if (orc) { orc.setAttribute('placeholder', '0000-0000-0000-0000'); orc.setAttribute('maxlength', '19'); orc.setAttribute('inputmode', 'numeric'); orc.setAttribute('autocomplete', 'off');
    orc.addEventListener('input', function () { var v = orc.value.toUpperCase().replace(/[^0-9X]/g, '').slice(0, 16); orc.value = v.replace(/(.{4})(?=.)/g, '$1-'); });
    orc.addEventListener('blur', function () { var ok = !orc.value || /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orc.value); orc.setCustomValidity(ok ? '' : 'An ORCID iD looks like 0000-0000-0000-0000'); }); }
  var bar = byName('Bar-Number'); if (bar) { bar.setAttribute('placeholder', 'e.g. 2019-123456'); bar.setAttribute('autocomplete', 'off'); bar.addEventListener('input', function () { bar.value = bar.value.toUpperCase().replace(/[^0-9A-Z-]/g, '').slice(0, 20); }); }
  var li = byName('LinkedIn'); if (li) { li.setAttribute('placeholder', 'https://www.linkedin.com/in/your-name'); li.setAttribute('inputmode', 'url'); li.addEventListener('blur', function () { var v = li.value.trim(); if (v && !/^https?:\/\//i.test(v)) li.value = 'https://' + v.replace(/^\/+/, ''); }); }
  /* repeatable link rows: the first row is native (Link-1-Type + Link-1-URL); "Add another link" clones it */
  var t1 = byName('Link-1-Type'), u1 = byName('Link-1-URL');
  if (t1 && u1) {
    var rowsWrap = document.createElement('div'); rowsWrap.className = 'nf-field'; rowsWrap.style.gridColumn = '1/-1';
    var lab = fieldOf(t1).querySelector('label'); var f1 = fieldOf(t1), f2 = fieldOf(u1);
    f1.parentNode.insertBefore(rowsWrap, f1); if (lab) rowsWrap.appendChild(lab);
    function makeRow(n, type, url) {
      var r = document.createElement('div'); r.className = 'nf-link-row';
      var s = type || t1.cloneNode(true); s.name = 'Link-' + n + '-Type'; s.id = s.name; s.className = 'ff-select w-select';
      var u = url || u1.cloneNode(true); u.name = 'Link-' + n + '-URL'; u.id = u.name; u.className = 'ff-input w-input'; u.type = 'url'; u.placeholder = 'https://'; if (!url) u.value = '';
      var x = document.createElement('button'); x.type = 'button'; x.className = 'nf-x'; x.setAttribute('aria-label', 'Remove this link'); x.textContent = '×';
      x.addEventListener('click', function () { if (rowsWrap.querySelectorAll('.nf-link-row').length > 1) r.parentNode.removeChild(r); else { s.selectedIndex = 0; u.value = ''; } renumber(); });
      u.addEventListener('blur', function () { var v = u.value.trim(); if (v && !/^https?:\/\//i.test(v)) u.value = 'https://' + v; });
      r.appendChild(s); r.appendChild(u); r.appendChild(x); return r;
    }
    function renumber() { q('.nf-link-row', rowsWrap).forEach(function (r, i) { var s = r.querySelector('select'), u = r.querySelector('input'); s.name = s.id = 'Link-' + (i + 1) + '-Type'; u.name = u.id = 'Link-' + (i + 1) + '-URL'; }); }
    rowsWrap.appendChild(makeRow(1, t1, u1)); f1.parentNode.removeChild(f1); f2.parentNode.removeChild(f2);
    var add = document.createElement('button'); add.type = 'button'; add.className = 'nf-add'; add.textContent = '+ Add another link';
    add.addEventListener('click', function () { var n = rowsWrap.querySelectorAll('.nf-link-row').length; if (n >= 8) return; rowsWrap.appendChild(makeRow(n + 1)); rowsWrap.lastChild.querySelector('select').focus(); });
    rowsWrap.appendChild(add);
    u1.required = true;
  }
  /* ---------- institution typeahead (Affiliation) via the Research Organization Registry ---------- */
  var aff = byName('Affiliation');
  if (aff) (function () {
    var f = fieldOf(aff), wrap = document.createElement('div'); wrap.className = 'nf-combo'; f.insertBefore(wrap, aff); wrap.appendChild(aff);
    var list = document.createElement('ul'); list.className = 'nf-list'; list.id = 'nf-aff-list'; list.setAttribute('role', 'listbox'); list.hidden = true; wrap.appendChild(list);
    var rid = document.createElement('input'); rid.type = 'hidden'; rid.name = 'Affiliation-ROR'; rid.id = rid.name; wrap.appendChild(rid);
    var picked = document.createElement('p'); picked.className = 'nf-picked'; picked.hidden = true; f.appendChild(picked);
    aff.setAttribute('role', 'combobox'); aff.setAttribute('aria-autocomplete', 'list'); aff.setAttribute('aria-expanded', 'false'); aff.setAttribute('aria-controls', list.id); aff.setAttribute('autocomplete', 'off');
    aff.placeholder = 'Start typing your university, firm, hospital, or company';
    var t = 0, items = [], active = -1, manual = false, lastQ = '', ctrl = null;
    function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function mark(name, q) { var toks = q.trim().split(/\s+/).filter(Boolean); var out = esc(name); toks.forEach(function (tk) { out = out.replace(new RegExp('(' + tk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'), '<b>$1</b>'); }); return out; }
    function close() { list.hidden = true; aff.setAttribute('aria-expanded', 'false'); active = -1; aff.removeAttribute('aria-activedescendant'); }
    function render(q) {
      list.innerHTML = ''; active = -1;
      items.forEach(function (it, i) { var li = document.createElement('li'); li.className = 'nf-opt'; li.id = 'nf-aff-' + i; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false'); li.innerHTML = mark(it.name, q) + '<small>' + esc([it.city, it.country].filter(Boolean).join(', ')) + '</small>'; li.addEventListener('mousedown', function (e) { e.preventDefault(); choose(i); }); list.appendChild(li); });
      var m = document.createElement('li'); m.className = 'nf-opt nf-manual'; m.id = 'nf-aff-manual'; m.setAttribute('role', 'option'); m.setAttribute('aria-selected', 'false'); m.textContent = items.length ? 'Not listed? Keep what I typed' : 'No match. Keep what I typed'; m.addEventListener('mousedown', function (e) { e.preventDefault(); choose(-1); }); list.appendChild(m);
      list.hidden = false; aff.setAttribute('aria-expanded', 'true');
    }
    function choose(i) { if (i >= 0) { var it = items[i]; aff.value = it.name; rid.value = it.id; picked.textContent = 'Matched to ' + it.name + (it.country ? ' (' + it.country + ')' : '') + ' in the Research Organization Registry.'; picked.hidden = false; } else { rid.value = ''; picked.hidden = true; manual = true; } close(); }
    function move(d) { var opts = list.querySelectorAll('.nf-opt'); if (!opts.length) return; active = (active + d + opts.length) % opts.length; opts.forEach(function (o, i) { o.setAttribute('aria-selected', i === active ? 'true' : 'false'); }); aff.setAttribute('aria-activedescendant', opts[active].id); opts[active].scrollIntoView({ block: 'nearest' }); }
    function search(q) {
      if (ctrl) ctrl.abort(); ctrl = ('AbortController' in window) ? new AbortController() : null;
      /* two lookups at once: the registry's relevance search plus a prefix search, so "cumber" already finds Cumberland */
      var toksRaw = q.split(/\s+/).filter(Boolean).map(function (x) { return x.replace(/[^\w\u00C0-\u024F'-]/g, ''); }).filter(Boolean);
      var adv = 'names.value:(' + toksRaw.map(function (x) { return x + '*'; }).join(' AND ') + ')';
      var opt = ctrl ? { signal: ctrl.signal } : {};
      Promise.all([
        fetch('https://api.ror.org/v2/organizations?query=' + encodeURIComponent(q), opt).then(function (r) { return r.json(); }).catch(function () { return {}; }),
        fetch('https://api.ror.org/v2/organizations?query.advanced=' + encodeURIComponent(adv), opt).then(function (r) { return r.json(); }).catch(function () { return {}; })
      ]).then(function (ds) {
        if (q !== lastQ) return;
        var toks = q.toLowerCase().split(/\s+/).filter(Boolean), seen = {}, all = [];
        ds.forEach(function (d) { (d.items || []).forEach(function (o) { if (!seen[o.id]) { seen[o.id] = 1; all.push(o); } }); });
        items = all.map(function (o) {
          var n = (o.names || []).filter(function (x) { return (x.types || []).indexOf('ror_display') > -1; })[0] || (o.names || [])[0] || {};
          var loc = (o.locations || [])[0] || {}, g = loc.geonames_details || {};
          var name = n.value || '', low = name.toLowerCase(), score = 0;
          toks.forEach(function (tk) { if (low.indexOf(tk) > -1) score += 2; if (low.indexOf(tk) === 0) score += 2; });
          if ((o.types || []).indexOf('education') > -1) score += 1;
          return { id: o.id, name: name, city: g.name, country: g.country_name, score: score };
        }).filter(function (x) { return x.name; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 8);
        render(q);
      });
    }
    aff.addEventListener('input', function () { rid.value = ''; picked.hidden = true; manual = false; var q = aff.value.trim(); lastQ = q; clearTimeout(t); if (q.length < 3) { close(); return; } t = setTimeout(function () { search(q); }, 260); });
    aff.addEventListener('keydown', function (e) { if (list.hidden) return; if (e.key === 'ArrowDown') { e.preventDefault(); move(1); } else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); } else if (e.key === 'Enter') { if (active >= 0) { e.preventDefault(); var id = list.querySelectorAll('.nf-opt')[active].id; choose(id === 'nf-aff-manual' ? -1 : active); } } else if (e.key === 'Escape') { close(); } });
    aff.addEventListener('blur', function () { setTimeout(close, 120); });
  })();
  /* ---------- credentials follow the discipline ---------- */
  var disc = byName('Discipline');
  if (disc) (function () {
    var LAW = ['Law', 'Legal Academia'], RES = ['Legal Academia', 'Medicine', 'Life Sciences', 'Physical Sciences', 'Engineering', 'Philosophy & Humanities', 'Education', 'Technology', 'Business & Finance', 'Policy & Government'];
    function group(names) { var els = names.map(byName).filter(Boolean); if (!els.length) return null; var g = document.createElement('div'); g.className = 'nf-cond'; var first = fieldOf(els[0]); first.parentNode.insertBefore(g, first); els.forEach(function (el) { var f = fieldOf(el); f.classList.add('nf-half'); g.appendChild(f); }); return g; }
    var gLaw = group(['Bar-Jurisdiction', 'Bar-Number']), gRes = group(['ORCID']);
    var credHint = q('.nf-hint', form).filter(function (p) { return /Only what applies to you/.test(p.textContent); })[0];
    function apply() {
      var v = disc.value; var none = !v;
      if (gLaw) gLaw.classList.toggle('nf-open', none || LAW.indexOf(v) > -1);
      if (gRes) gRes.classList.toggle('nf-open', none || RES.indexOf(v) > -1);
      if (credHint) credHint.textContent = none ? 'Choose your primary discipline above and the right credential fields appear here.' : (LAW.indexOf(v) > -1 ? 'Attorneys: your bar jurisdiction and number' + (RES.indexOf(v) > -1 ? ', and your ORCID iD if you publish.' : '.') : (RES.indexOf(v) > -1 ? 'Your ORCID iD, if you have one.' : 'No credential fields are needed for this discipline. Your links do the work.'));
    }
    disc.addEventListener('change', apply); apply();
  })();
  /* ---------- gentle validation: only on blur, in plain words ---------- */
  function err(el, msg) { var f = fieldOf(el), e = f.querySelector('.nf-err'); if (!msg) { if (e) e.remove(); el.classList.remove('nf-bad'); return; } if (!e) { e = document.createElement('p'); e.className = 'nf-err'; f.appendChild(e); } e.textContent = msg; el.classList.add('nf-bad'); }
  q('input[type=url]', form).forEach(function (u) { u.addEventListener('blur', function () { var v = u.value.trim(); err(u, v && !/^https?:\/\/\S+\.\S+/.test(v) ? 'Please provide a complete URL starting with https://' : ''); }); u.addEventListener('input', function () { err(u, ''); }); });
  q('input[type=email]', form).forEach(function (u) { u.addEventListener('blur', function () { var v = u.value.trim(); err(u, v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'That email address looks incomplete.' : ''); }); u.addEventListener('input', function () { err(u, ''); }); });
  form.addEventListener('submit', function () { var b = form.querySelector('input[type=submit]'); if (b) { b.disabled = true; b.value = b.getAttribute('data-wait') || 'Sending…'; } });
  /* statement: live count */
  var stm = byName('Statement');
  if (stm) { var c = document.createElement('div'); c.className = 'nf-count'; fieldOf(stm).appendChild(c); var min = +stm.getAttribute('minlength') || 200, max = +stm.getAttribute('maxlength') || 1200;
    function count() { var n = stm.value.length; c.textContent = n < min ? (min - n) + ' more characters needed' : n + ' / ' + max; c.classList.toggle('nf-low', n > 0 && n < min); } stm.addEventListener('input', count); count(); }
  /* submit + note */
  var sub = form.querySelector('input[type=submit],button[type=submit]'); if (sub) { var sf = document.createElement('div'); sf.className = 'nf-submit'; sub.parentNode.insertBefore(sf, sub); sf.appendChild(sub); }
  /* the builder's empty inline labels inside checkboxes stay hidden */
  q('.w-checkbox > label, .w-checkbox .w-form-label:empty', form).forEach(function (l) { l.hidden = true; });
  /* black ink on the page's links (the site's legacy anchor colour is white) */
  q('a', form).forEach(function (a) { a.style.color = '#0d0d0d'; });
})();
