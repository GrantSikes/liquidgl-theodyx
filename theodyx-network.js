/*! theodyx-network.js v1.0.0 (2026-09-18) — the Network application form, made easy.
 * Owner directive: "make it more UI/UX friendly and easy". The form's fields are native Webflow fields (editable in the Designer);
 * this file only arranges and helps them: section headings, a two-column grid for short fields, checkbox rows that read as one
 * line, availability as pill chips, the ORCID iD and bar number formatted as you type, repeatable "Add another link" rows with a
 * type dropdown, black ink everywhere (the site's legacy link colour is white), and a live character count on the statement.
 * Fields are found by their name attribute, so the Designer can reorder or relabel them freely. No dependencies. */
(function () {
  'use strict';
  if (window.__thxNetwork) return; window.__thxNetwork = { v: '1.0.0' };
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
    '.nf .nf-count{text-align:right;font-size:13px;color:rgba(13,13,13,.62)}.nf .nf-count.nf-low{color:#b3261e}',
    '.nf .nf-submit{grid-column:1/-1;margin-top:8px}.nf a{color:#0d0d0d!important;text-decoration:underline;text-underline-offset:2px}',
    '.ff-page .ff-form-note,.ff-page .ff-form-note *{color:rgba(13,13,13,.72)}',
    '@media (max-width:640px){.nf{grid-template-columns:1fr}.nf .nf-half{grid-column:1/-1}.nf .nf-link-row{grid-template-columns:1fr auto}.nf .nf-link-row select{grid-column:1/-1}}'
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
  ['First-Name', 'Last-Name', 'Email', 'Institutional-Email', 'Honorific', 'Affiliation', 'Bar-Jurisdiction', 'Bar-Number', 'ORCID', 'LinkedIn', 'Source', 'Discipline', 'Headline'].forEach(function (n) { var el = byName(n); if (el) fieldOf(el).classList.add('nf-half'); });
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
  hint('Institutional-Email', 'Your university, firm, or company address. It speeds up verification and is never published.');
  hint('Topics', 'Up to six, separated by commas. Example: First Amendment, media law, platform governance.');
  hint('Bar-Number', 'Exactly as your bar lists it. Example: 2019-123456 or 123456.');
  hint('ORCID', 'Sixteen digits, formatted 0000-0000-0000-0000. Find yours at orcid.org.');
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
