/*! theodyx-network.js v2.1.0 (2026-09-19) — the Network application form, made easy.
 * Owner directive: "make it more UI/UX friendly and easy". The form's fields are native Webflow fields (editable in the Designer);
 * this file only arranges and helps them: section headings, a two-column grid for short fields, checkbox rows that read as one
 * line, availability as pill chips, the ORCID iD and bar number formatted as you type, repeatable "Add another link" rows with a
 * type dropdown, black ink everywhere (the site's legacy link colour is white), and a live character count on the statement.
 * 2.1.0 (owner): the form column is widened so answers are readable, text areas grow as you type, a required "what does it mean to be
 * human" answer joins the intellectual-capital step, and a professional headshot is required (native Webflow file upload named
 * Headshot, with the reference photo and the requirements beside it).
 * 2.0.0 (owner, the intake playbook, no backend): the application is four steps (Identity → Discipline & credentials → Intellectual
 * capital → Logistics & agreement) with a persistent context line, Back keeps your answers, and each step validates before the next.
 * A nominated candidate (Source = a Member / a client or partner) gets the nominator fields and skips the thesis. The discipline routes
 * the credential, vetting, capstone and thesis fields (Law: bar, federal admissions, clerkships, standing; Medicine/Life Sciences: NPI,
 * state license, ORCID, board certification, PI status; Tech/Engineering/Physical Sciences: GitHub, ORCID, patents, open source;
 * Business/Policy: CRD, CIK, operating status, funding stage; Media/Arts/Modeling: primary platform, IMDbPro, ISNI, representation
 * status, brand synergy; Philosophy/Education: ORCID, academic standing). Availability choices open location, time zone, airport,
 * conflict disclosure and drafting tools. Fields that are not native Webflow fields are created here with the same names, so every
 * answer submits through the Webflow form. Nothing is verified automatically - the committee verifies after submission.
 * 1.1.0 (owner): SSRN gets its own field; the Affiliation field becomes an institution typeahead backed by the Research Organization
 * Registry (api.ror.org, the open global registry publishers use - universities, hospitals, labs; an "Enter it myself" fallback stays);
 * the credential fields follow the primary discipline (bar fields for Law / Legal Academia, ORCID for the research disciplines) and
 * slide open instead of snapping; validation waits for blur; the submit shows a working state.
 * Fields are found by their name attribute, so the Designer can reorder or relabel them freely. No dependencies. */
(function () {
  'use strict';
  if (window.__thxNetwork) return; window.__thxNetwork = { v: '2.1.0' };
  var form = document.querySelector('form[data-name="Network Application"]'); if (!form) return;
  var SANS = '"Google Sans Flex","Google Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  var st = document.createElement('style'); st.id = 'thx-net-css';
  st.textContent = [
    '.ff-page .ff-main:has(> .w-form form.nf),.ff-page .ff-main:has(.w-form form.nf){max-width:800px;width:100%}',
    '.ff-page #apply .ff-main,.ff-page #apply > .ff-main{max-width:860px!important;width:100%!important}',
    '.nf .w-input,.nf .w-select,.nf .ff-input,.nf .ff-select{font-size:16px!important;line-height:1.35}.nf textarea{min-height:120px;resize:vertical;overflow:hidden;font-size:16px!important;line-height:1.5}',
    '.nf .nf-shot{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:22px;align-items:start}.nf .nf-shot-ref img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid rgba(13,13,13,.12)}.nf .nf-shot-ref figcaption{margin:8px 0 0;font-size:12.5px;line-height:1.4;color:rgba(13,13,13,.62)}',
    '.nf .nf-shot ul{margin:8px 0 0;padding-left:18px;font-size:14px;line-height:1.55;color:rgba(13,13,13,.78)}',
    '.nf .w-file-upload{margin:0}.nf .w-file-upload-default,.nf .w-file-upload-uploading,.nf .w-file-upload-success{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 16px;border:1px dashed rgba(13,13,13,.35);border-radius:12px;background:#fff}.nf .w-file-upload-label{display:inline-flex;align-items:center;gap:8px;margin:0;padding:10px 16px;border:1px solid #0d0d0d;border-radius:999px;background:#0d0d0d;color:#fff;font-size:14px;cursor:pointer}.nf .w-file-upload-label:hover{background:#262626}.nf .w-file-upload-info{font-size:14px;color:rgba(13,13,13,.7)}.nf .w-file-upload-error{grid-column:1/-1}.nf .w-file-upload-error-msg{font-size:13px;color:#b3261e}',
    '@media (max-width:640px){.nf .nf-shot{grid-template-columns:1fr}.nf .nf-shot-ref{max-width:220px}}',
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
    '.nf .nf-head{grid-column:1/-1;margin-bottom:6px}.nf .nf-prog{display:flex;gap:10px;align-items:baseline;font-size:13px;letter-spacing:.02em;text-transform:uppercase;color:rgba(13,13,13,.62)}.nf .nf-step-t{color:#0d0d0d;font-weight:600}.nf .nf-ctx{margin-top:8px;font-size:22px;line-height:1.2;color:#0d0d0d}.nf .nf-bar{height:2px;background:rgba(13,13,13,.12);margin-top:14px;border-radius:2px;overflow:hidden}.nf .nf-bar i{display:block;height:100%;width:25%;background:#0d0d0d;transition:width .4s cubic-bezier(.22,1,.36,1)}',
    '.nf .nf-panel{grid-column:1/-1;display:none;grid-template-columns:1fr 1fr;column-gap:20px;row-gap:18px}.nf .nf-panel.nf-on{display:grid}.nf .nf-panel > .nf-h:first-child{margin-top:0;padding-top:0;border-top:0}',
    '.nf .nf-nav{grid-column:1/-1;display:flex;gap:12px;justify-content:space-between;align-items:center;margin-top:10px;padding-top:22px;border-top:1px solid rgba(13,13,13,.14)}.nf .nf-next,.nf .nf-back{padding:14px 26px;border-radius:999px;font:15px/1 ' + SANS + ';cursor:pointer}.nf .nf-next{margin-left:auto;background:#0d0d0d;color:#fff;border:1px solid #0d0d0d}.nf .nf-next:hover{background:#262626}.nf .nf-back{background:transparent;color:#0d0d0d;border:1px solid rgba(13,13,13,.3)}',
    '.nf .nf-radios{display:flex;flex-wrap:wrap;gap:10px}.nf .nf-radio{display:inline-flex;align-items:center;gap:8px;margin:0;padding:10px 16px;border:1px solid rgba(13,13,13,.28);border-radius:999px;background:#fff;color:#0d0d0d;font-size:15px;cursor:pointer}.nf .nf-radio input{width:16px;height:16px;margin:0;accent-color:#0d0d0d}.nf .nf-radio.nf-on{background:#0d0d0d;color:#fff;border-color:#0d0d0d}.nf .nf-radio .w-form-label{margin:0;color:inherit;font-size:15px}',
    '.nf [hidden]{display:none!important}.nf .nf-chips.nf-bad,.nf .nf-radios.nf-bad,.nf .nf-check.nf-bad{outline:2px solid #b3261e;outline-offset:6px;border-radius:8px}.nf .nf-burn{grid-column:1/-1;margin-top:6px}',
    '@media (max-width:640px){.nf .nf-panel{grid-template-columns:1fr}}',
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

  /* ================= 2.0.0: field spec (created when not native), routes, steps ================= */
  var STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Outside the United States'];
  var ABMS = ['Not board certified','Allergy and Immunology','Anesthesiology','Colon and Rectal Surgery','Dermatology','Emergency Medicine','Family Medicine','Internal Medicine','Medical Genetics and Genomics','Neurological Surgery','Nuclear Medicine','Obstetrics and Gynecology','Ophthalmology','Orthopaedic Surgery','Otolaryngology - Head and Neck Surgery','Pathology','Pediatrics','Physical Medicine and Rehabilitation','Plastic Surgery','Preventive Medicine','Psychiatry','Neurology','Radiology','Surgery','Thoracic Surgery','Urology','Other'];
  var TZ = ['Eastern (US)','Central (US)','Mountain (US)','Pacific (US)','Alaska','Hawaii','Atlantic (Canada)','London / Dublin','Paris / Berlin / Rome','Athens / Istanbul','Dubai','Mumbai / Delhi','Singapore / Hong Kong','Tokyo / Seoul','Sydney','Auckland','São Paulo','Buenos Aires','Mexico City','Johannesburg','Lagos','Other'];
  var SPEC = [
    /* identity */
    { n: 'Nominator-Name', l: 'Who nominated you?', t: 'text', ph: 'Their name', half: 1 },
    { n: 'Nominator-Email', l: 'Nominator email', t: 'email', ph: 'So we can confirm the nomination', half: 1 },
    { n: 'Invite-Code', l: 'Invite code', t: 'text', ph: 'If you were given one', half: 1, hint: 'Optional. Members can share a single-use code.' },
    /* law */
    { n: 'Federal-Admissions', l: 'Federal court admissions', t: 'checks', o: ['Supreme Court of the United States', 'U.S. Courts of Appeals', 'U.S. District Courts', 'None'] },
    { n: 'Clerkships', l: 'Judicial clerkships', t: 'checks', o: ['Federal appellate', 'Federal district', 'State supreme court', 'None'] },
    { n: 'Clerkship-Detail', l: 'Judge and court', t: 'text', ph: 'e.g. Hon. Jane Doe, U.S. Court of Appeals for the Eleventh Circuit' },
    { n: 'Legal-Standing', l: 'Current standing', t: 'select', o: ['Partner', 'Of counsel', 'Associate', 'In-house', 'Tenured faculty', 'Tenure-track faculty', 'Government', 'Judicial', 'Student', 'Other'], half: 1 },
    /* medicine + life sciences */
    { n: 'NPI', l: 'NPI number', t: 'text', ph: '10 digits', half: 1, hint: 'National Provider Identifier. Clinicians only.' },
    { n: 'Medical-License-State', l: 'State medical license', t: 'select', o: STATES, half: 1 },
    { n: 'Medical-License-Number', l: 'Medical license number', t: 'text', ph: 'As your state board lists it', half: 1 },
    { n: 'Board-Certification', l: 'Board certification', t: 'select', o: ABMS, half: 1 },
    { n: 'PI-Status', l: 'Are you currently a principal investigator on federal or institutional grants?', t: 'radio', o: ['Yes', 'No'] },
    /* tech + engineering + physical sciences */
    { n: 'GitHub', l: 'GitHub or GitLab profile', t: 'url', ph: 'https://github.com/your-handle', half: 1 },
    { n: 'Patents', l: 'Patent numbers', t: 'text', ph: 'e.g. US1234567B2, separated by commas', half: 1, hint: 'Optional. Issued patents only.' },
    { n: 'Open-Source', l: 'Open source or architecture', t: 'url', ph: 'https://', hint: 'Optional. A defining pull request in a major repository, or public architecture documentation.' },
    /* business + policy */
    { n: 'FINRA-CRD', l: 'FINRA CRD number', t: 'text', ph: 'Optional, for finance and venture', half: 1 },
    { n: 'SEC-CIK', l: 'SEC CIK number', t: 'text', ph: 'Optional, for public-company executives', half: 1 },
    { n: 'Operating-Status', l: 'Operating status', t: 'select', o: ['Founder', 'C-suite', 'Venture partner', 'Think-tank fellow', 'Independent consultant', 'Policy staff', 'Elected or appointed official', 'Other'], half: 1 },
    { n: 'Funding-Stage', l: 'Current funding stage', t: 'select', o: ['Not applicable', 'Bootstrapped', 'Seed', 'Series A', 'Series B', 'Series C or later', 'Exited or post-IPO'], half: 1 },
    /* media + arts + modeling */
    { n: 'Primary-Platform', l: 'Primary platform', t: 'select', o: ['Instagram', 'YouTube', 'TikTok', 'X', 'LinkedIn', 'Twitch', 'Substack', 'Podcast', 'Other'], half: 1 },
    { n: 'Primary-Platform-URL', l: 'Primary platform URL', t: 'url', ph: 'https://', half: 1 },
    { n: 'IMDbPro', l: 'IMDbPro page', t: 'url', ph: 'https://pro.imdb.com/name/…', half: 1, hint: 'Optional.' },
    { n: 'ISNI', l: 'ISNI', t: 'text', ph: '0000 0000 0000 0000', half: 1, hint: 'Optional. The 16-digit International Standard Name Identifier.' },
    { n: 'Brand-Synergy', l: 'Brands or editorial houses you have worked with', t: 'text', ph: 'Up to three' },
    /* academia */
    { n: 'Academic-Standing', l: 'Academic standing', t: 'select', o: ['Tenured', 'Tenure-track', 'Adjunct', 'Visiting', 'Postdoctoral', 'Doctoral candidate', 'Independent scholar', 'Other'], half: 1 },
    /* shared */
    { n: 'Representation-Status', l: 'Are you currently under exclusive commercial or talent management, a speaking bureau, or a publishing exclusivity?', t: 'radio', o: ['Yes', 'No'] },
    { n: 'Representation-Detail', l: 'Who represents you?', t: 'text', ph: 'Agency, bureau, or publisher, and what the exclusivity covers' },
    { n: 'Capstone', l: 'Capstone', t: 'url', ph: 'https://' },
    { n: 'Thesis', l: 'The contrarian thesis', t: 'textarea', max: 1000, hint: 'Up to 150 words.' },
    { n: 'Human', l: 'As the world we live in becomes less personal, what does it mean to be human, for you?', t: 'textarea', max: 1500, req: 1, hint: 'Required. In your own words.' },
    { n: 'Horizon', l: 'The collaboration horizon', t: 'textarea', max: 1200, hint: 'A specific project, venture, or research architecture you want to execute in the next 24 months but currently lack the infrastructure to achieve.' },
    /* logistics */
    { n: 'City', l: 'City', t: 'text', half: 1 },
    { n: 'Region', l: 'State or region', t: 'text', half: 1 },
    { n: 'Country', l: 'Country', t: 'text', half: 1 },
    { n: 'Time-Zone', l: 'Time zone', t: 'select', o: TZ, half: 1 },
    { n: 'Airport', l: 'Nearest major airport', t: 'text', ph: 'e.g. BHM', half: 1, hint: 'Optional. Three-letter code. It makes booking speaking dates simple.' },
    { n: 'Conflicts', l: 'Conflict of interest disclosure', t: 'textarea', max: 1500, hint: 'Current advisory, board, or expert-witness roles that would preclude you from advising competing entities.' },
    { n: 'Drafting', l: 'Drafting tools', t: 'select', o: ['Overleaf / LaTeX', 'Google Docs', 'Microsoft Word', 'Other'], half: 1, hint: 'Speeds up co-author matching.' },
    { n: 'Display-Consent', l: 'I understand that admission to the Network may involve the creation of a public-facing Member Profile, and that I decide which credentials and affiliations are publicly visible.', t: 'check', req: 1 },
    { n: 'Active-Network', l: 'I understand that Theodyx\'s Network is an active, working network. Members who do not engage, publish, or collaborate within a twelve-month period may have their Network status reviewed.', t: 'check', req: 1 }
  ];
  function mk(spec) {
    var el;
    if (spec.t === 'select') { el = document.createElement('select'); el.className = 'ff-select w-select'; var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Select…'; el.appendChild(o0); spec.o.forEach(function (v) { var o = document.createElement('option'); o.value = v; o.textContent = v; el.appendChild(o); }); }
    else if (spec.t === 'textarea') { el = document.createElement('textarea'); el.className = 'ff-textarea w-input'; if (spec.max) el.maxLength = spec.max; if (spec.req) { el.required = true; el.minLength = 40; } }
    else if (spec.t === 'checks' || spec.t === 'radio') {
      var grp = document.createElement('div'); grp.className = spec.t === 'radio' ? 'nf-radios' : 'nf-chips';
      spec.o.forEach(function (v) { var lab = document.createElement('label'); lab.className = spec.t === 'radio' ? 'nf-radio' : 'nf-chip'; var i = document.createElement('input'); i.type = spec.t === 'radio' ? 'radio' : 'checkbox'; i.name = spec.n; i.value = v; i.id = (spec.n + '-' + v).replace(/[^\w-]+/g, '-'); var sp = document.createElement('span'); sp.className = 'w-form-label'; sp.textContent = v; lab.appendChild(i); lab.appendChild(sp); lab.setAttribute('for', i.id); i.addEventListener('change', function () { if (spec.t === 'checks') lab.classList.toggle('nf-on', i.checked); else grp.querySelectorAll('.nf-radio').forEach(function (r) { r.classList.toggle('nf-on', r.querySelector('input').checked); }); }); grp.appendChild(lab); });
      return grp;
    }
    else if (spec.t === 'check') { var lab2 = document.createElement('label'); lab2.className = 'nf-check'; var cb = document.createElement('input'); cb.type = 'checkbox'; cb.name = spec.n; cb.id = spec.n; if (spec.req) cb.required = true; var sp2 = document.createElement('span'); sp2.className = 'w-form-label'; sp2.textContent = spec.l; lab2.appendChild(cb); lab2.appendChild(sp2); lab2.setAttribute('for', spec.n); return lab2; }
    else { el = document.createElement('input'); el.type = spec.t; el.className = 'ff-input w-input'; if (spec.ph) el.placeholder = spec.ph; if (spec.t === 'url') el.inputMode = 'url'; }
    el.name = spec.n; el.id = spec.n; return el;
  }
  function ensure(spec) {
    var existing = byName(spec.n); if (existing) return spec.t === 'checks' || spec.t === 'radio' || spec.t === 'check' ? existing.closest('.nf-field, .nf-check, .nf-chips, .nf-radios') || fieldOf(existing) : fieldOf(existing);
    var ctl = mk(spec);
    if (spec.t === 'check') { form.appendChild(ctl); return ctl; }
    var f = document.createElement('div'); f.className = 'nf-field' + (spec.half ? ' nf-half' : ''); var lab = document.createElement('label'); lab.className = 'ff-label'; lab.textContent = spec.l; lab.setAttribute('for', spec.n); f.appendChild(lab); f.appendChild(ctl);
    if (spec.hint) { var p = document.createElement('p'); p.className = 'nf-hint'; p.textContent = spec.hint; f.appendChild(p); }
    form.appendChild(f); return f;
  }
  var F = {}; SPEC.forEach(function (sp) { F[sp.n] = ensure(sp); });
  /* extra availability options */
  (function () { var chips = form.querySelector('.nf-chips'); if (!chips || !av.length) return; ['Corporate board seats', 'Expert witness'].forEach(function (v) { if (form.querySelector('input[name="Availability"][value="' + v + '"]')) return; var lab = document.createElement('label'); lab.className = 'nf-chip'; var i = document.createElement('input'); i.type = 'checkbox'; i.name = 'Availability'; i.value = v; i.id = ('Availability-' + v).replace(/[^\w-]+/g, '-'); var sp = document.createElement('span'); sp.className = 'w-form-label'; sp.textContent = v; lab.appendChild(i); lab.appendChild(sp); lab.setAttribute('for', i.id); i.addEventListener('change', function () { lab.classList.toggle('nf-on', i.checked); }); chips.appendChild(lab); }); })();
  function fieldFor(n) { var el = byName(n); return el ? (F[n] || fieldOf(el)) : null; }
  function wrapOf(n) { var el = byName(n); if (!el) return null; return el.closest('.nf-field') || el.closest('.nf-check') || el.closest('.nf-chips') || el.closest('.nf-radios') || null; }
  function labelOf(n, text) { var w = wrapOf(n); if (!w) return; var l = w.querySelector('label.ff-label'); if (l) l.textContent = text; }
  function hintOf(n, text) { var w = wrapOf(n); if (!w) return; var h = w.querySelector('.nf-hint'); if (!h) { h = document.createElement('p'); h.className = 'nf-hint'; w.appendChild(h); } h.textContent = text; }

  /* ---------- professional headshot (native Webflow file upload named Headshot) + the reference ---------- */
  (function () {
    var fi = form.querySelector('input[type=file]'); if (!fi) return;
    var up = fi.closest('.w-file-upload') || fi; var f = document.createElement('div'); f.className = 'nf-field nf-shot-field'; up.parentNode.insertBefore(f, up);
    var lab = document.createElement('label'); lab.className = 'ff-label'; lab.textContent = 'Professional headshot*'; f.appendChild(lab);
    var row = document.createElement('div'); row.className = 'nf-shot';
    var left = document.createElement('div'); left.appendChild(up);
    var ul = document.createElement('ul'); ['Front-facing, shoulders up, looking at the camera', 'Plain, uncluttered background', 'Natural light, no filters or heavy retouching', 'Taken within the last year', 'JPEG or PNG, portrait, at least 1200 px on the short side'].forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); }); left.appendChild(ul);
    var fig = document.createElement('figure'); fig.className = 'nf-shot-ref'; fig.innerHTML = '<img src="https://pub-c09c28c1b0ac4b73b1a35509b5d50686.r2.dev/images/202609/theodyx-network-headshot-reference.jpg" alt="Reference headshot: front-facing, shoulders up, plain background, natural light" loading="lazy" width="1200" height="1500"><figcaption>What we are looking for.</figcaption>';
    row.appendChild(left); row.appendChild(fig); f.appendChild(row);
    fi.setAttribute('accept', 'image/jpeg,image/png'); fi.required = true; F['Headshot'] = f;
    var l2 = up.querySelector('.w-file-upload-label'); if (l2) { var t2 = l2.querySelector('.w-inline-block, div:last-child'); if (t2) t2.textContent = 'Choose your headshot'; }
  })();
  /* text areas grow with the answer */
  q('textarea', form).forEach(function (t) { function grow() { t.style.height = 'auto'; t.style.height = Math.max(120, t.scrollHeight + 2) + 'px'; } t.addEventListener('input', grow); setTimeout(grow, 0); });
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
  /* ================= routes: the discipline decides which credentials, prompts and vetting show ================= */
  var disc = byName('Discipline'), src = byName('Source');
  var ROUTE = {
    law: { d: ['Law', 'Legal Academia'], f: ['Bar-Jurisdiction', 'Bar-Number', 'Federal-Admissions', 'Clerkships', 'Clerkship-Detail', 'Legal-Standing'], cap: 'Link to your defining legal brief, law review essay, or appellate argument.', th: 'What is a widely accepted legal precedent or consensus in your jurisdiction that you believe is fundamentally flawed?' },
    med: { d: ['Medicine', 'Life Sciences'], f: ['NPI', 'Medical-License-State', 'Medical-License-Number', 'ORCID', 'Board-Certification', 'PI-Status'], cap: 'Link to your highest-impact clinical trial, peer-reviewed study, or public-health initiative.', th: 'What is a prevailing clinical consensus or standard of care in your specialty that the data no longer supports?' },
    tech: { d: ['Technology', 'Engineering', 'Physical Sciences'], f: ['GitHub', 'ORCID', 'Patents', 'Open-Source'], cap: 'Link to the defining repository, technical whitepaper, or deployment that best demonstrates your capability.', th: "What is an architectural or engineering paradigm currently considered best practice that actually creates long-term technical debt?" },
    biz: { d: ['Business & Finance', 'Policy & Government'], f: ['FINRA-CRD', 'SEC-CIK', 'Operating-Status', 'Funding-Stage'], cap: 'Link to your defining policy whitepaper, corporate thesis, or major venture or acquisition.', th: 'What is a structural inefficiency in your market or regulatory environment that others mistake for a feature?' },
    media: { d: ['Media & Journalism', 'Arts & Design', 'Modeling & Talent'], f: ['Primary-Platform', 'Primary-Platform-URL', 'IMDbPro', 'ISNI', 'Brand-Synergy'], cap: 'Link to the single piece, editorial shoot, gallery show, or campaign that defines your work.', th: 'Where is the current creative medium heading, and how is your work front-running that shift?' },
    acad: { d: ['Philosophy & Humanities', 'Education', 'Legal Academia'], f: ['ORCID', 'Academic-Standing'], cap: 'Link to your most defining published monograph, essay, or theoretical framework.', th: 'Which prevailing theoretical model in your field do you believe will be entirely obsolete in ten years?' }
  };
  var ALLROUTE = []; Object.keys(ROUTE).forEach(function (k) { ROUTE[k].f.forEach(function (n) { if (ALLROUTE.indexOf(n) < 0) ALLROUTE.push(n); }); });
  function routesFor(v) { return Object.keys(ROUTE).filter(function (k) { return ROUTE[k].d.indexOf(v) > -1; }); }
  function show(n, on) { var w = wrapOf(n); if (!w) return; w.hidden = !on; q('input,select,textarea', w).forEach(function (c) { c.disabled = !on; }); }
  function nominated() { var v = src ? src.value : ''; return /nominated|client or partner/i.test(v) || (byName('Invite-Code') && byName('Invite-Code').value.trim()); }
  function route() {
    var v = disc ? disc.value : '', rs = routesFor(v), on = {};
    rs.forEach(function (k) { ROUTE[k].f.forEach(function (n) { on[n] = 1; }); });
    ALLROUTE.forEach(function (n) { show(n, !v || !!on[n]); });
    /* NPI only for clinicians; clerkship detail only when a clerkship is ticked; representation detail only on Yes */
    if (v && v !== 'Medicine') show('NPI', false);
    var cl = q('input[name="Clerkships"]:checked', form).filter(function (i) { return i.value !== 'None'; }); show('Clerkship-Detail', (!v || on['Clerkship-Detail']) && cl.length > 0);
    var rep = form.querySelector('input[name="Representation-Status"]:checked'); show('Representation-Detail', !!rep && rep.value === 'Yes');
    var r0 = rs[0] ? ROUTE[rs[0]] : null;
    labelOf('Capstone', 'Capstone' + (r0 ? '' : ' (your defining work)')); hintOf('Capstone', r0 ? r0.cap : 'Link to the single piece of work that best defines what you do.');
    labelOf('Thesis', 'The contrarian thesis'); hintOf('Thesis', (r0 ? r0.th : 'What is a widely accepted consensus in your primary discipline that you believe is fundamentally flawed?') + ' Up to 150 words.');
    var nom = nominated(); show('Nominator-Name', nom); show('Nominator-Email', nom); show('Thesis', !nom);
    var avs = q('input[name="Availability"]:checked', form).map(function (i) { return i.value; });
    var logistics = avs.some(function (x) { return /Speaking|Press|Mentoring/.test(x); });
    ['City', 'Region', 'Country', 'Time-Zone', 'Airport'].forEach(function (n) { show(n, logistics); });
    show('Conflicts', avs.some(function (x) { return /Advisory|board|witness/i.test(x); }));
    show('Drafting', avs.indexOf('Co-authoring') > -1);
    if (credHint) credHint.textContent = !v ? 'Choose your primary discipline and the right credential fields appear.' : (rs.length ? 'Only what applies to you. Nothing is checked automatically; the committee verifies after you submit.' : 'No credential fields are needed for this discipline. Your links do the work.');
    ctx();
  }
  var credHint = q('.nf-hint', form).filter(function (p) { return /Only what applies to you/.test(p.textContent); })[0];
  form.addEventListener('change', route); form.addEventListener('input', function (e) { if (e.target && (e.target.name === 'Invite-Code')) route(); });
  /* ================= steps ================= */
  var STEPS = [
    { t: 'Identity', n: ['First-Name', 'Last-Name', 'Email', 'Institutional-Email', 'Honorific', 'Headshot', 'Headline', 'Affiliation', 'LinkedIn', 'Source', 'Invite-Code', 'Nominator-Name', 'Nominator-Email', 'Representation-Status', 'Representation-Detail'] },
    { t: 'Discipline & credentials', n: ['Discipline', 'Topics'].concat(ALLROUTE).concat(['SSRN', 'Link-1-Type', 'Publications']) },
    { t: 'Intellectual capital', n: ['Capstone', 'Statement', 'Human', 'Thesis', 'Horizon'] },
    { t: 'Logistics & agreement', n: ['Availability', 'City', 'Region', 'Country', 'Time-Zone', 'Airport', 'Conflicts', 'Drafting', 'Display-Consent', 'Active-Network', 'Agreement', 'Newsletter'] }
  ];
  var panels = [], cur = 0;
  var head = document.createElement('div'); head.className = 'nf-head'; head.innerHTML = '<div class="nf-prog"><span class="nf-step-n"></span><span class="nf-step-t"></span></div><div class="nf-ctx"></div><div class="nf-bar"><i></i></div>'; form.insertBefore(head, form.firstChild);
  function elFor(n) { if (n === 'Availability') { var c = form.querySelector('input[name="Availability"]'); return c ? c.closest('.nf-field') || c.closest('.nf-chips') : null; } if (n === 'Link-1-Type') { var l = byName('Link-1-Type'); return l ? l.closest('.nf-field') : null; } return wrapOf(n); }
  STEPS.forEach(function (st, i) {
    var p = document.createElement('div'); p.className = 'nf-panel'; p.setAttribute('data-step', String(i + 1));
    var seen = {};
    st.n.forEach(function (n) { var w = elFor(n); if (!w || seen[n]) return; seen[n] = 1; /* carry the section heading + hint that sit right before this field */ var prev = w.previousElementSibling; var pre = []; while (prev && (prev.classList.contains('nf-h') || prev.classList.contains('nf-hint'))) { pre.unshift(prev); prev = prev.previousElementSibling; } pre.forEach(function (x) { p.appendChild(x); }); p.appendChild(w); });
    var nav = document.createElement('div'); nav.className = 'nf-nav';
    if (i > 0) { var back = document.createElement('button'); back.type = 'button'; back.className = 'nf-back'; back.textContent = 'Back'; back.addEventListener('click', function () { go(i - 1); }); nav.appendChild(back); }
    if (i < STEPS.length - 1) { var next = document.createElement('button'); next.type = 'button'; next.className = 'nf-next'; next.textContent = 'Continue'; next.addEventListener('click', function () { if (valid(p)) go(i + 1); }); nav.appendChild(next); }
    p.appendChild(nav); panels.push(p);
  });
  /* the submit lives in the last step */
  var subBtn = form.querySelector('input[type=submit],button[type=submit]'), subWrap = null;
  if (subBtn) { subWrap = subBtn.closest('.nf-submit'); if (!subWrap) { subWrap = document.createElement('div'); subWrap.className = 'nf-submit'; subBtn.parentNode.insertBefore(subWrap, subBtn); subWrap.appendChild(subBtn); } }
  var last = panels[panels.length - 1];
  if (subWrap) { var burn = document.createElement('p'); burn.className = 'nf-hint nf-burn'; burn.textContent = 'If your application is not selected, the data you gave us is deleted from our systems within 30 days. We do not keep waitlist dossiers.'; last.insertBefore(burn, last.querySelector('.nf-nav')); last.insertBefore(subWrap, last.querySelector('.nf-nav')); }
  /* anything left loose in the form (headings the steps did not claim) is hidden away */
  q(':scope > *', form).forEach(function (c) { if (!c.classList.contains('nf-head') && !c.classList.contains('nf-panel')) { if (c.classList.contains('nf-h') || c.classList.contains('nf-hint')) c.remove(); } });
  panels.forEach(function (p) { form.appendChild(p); });
  /* headings per step */
  function h3(text, hint) { var h = document.createElement('h3'); h.className = 'nf-h'; h.textContent = text; var out = [h]; if (hint) { var p = document.createElement('p'); p.className = 'nf-hint'; p.style.gridColumn = '1/-1'; p.textContent = hint; out.push(p); } return out; }
  function before(n, nodes) { var w = elFor(n); if (!w) return; nodes.forEach(function (x) { w.parentNode.insertBefore(x, w); }); }
  q('.nf-h', panels[0]).forEach(function (h) { if (/^Links$/.test(h.textContent.trim())) { var nx = h.nextElementSibling; if (nx && nx.classList.contains('nf-hint')) nx.remove(); h.remove(); } });
  before('Discipline', h3('Your discipline', 'The discipline you choose decides which credential and vetting fields appear.'));
  before('SSRN', h3('Links and publications', 'Where we can verify your work. Add as many links as you like.'));
  before('Capstone', h3('Your defining work', 'One link that best shows what you do, then two short answers. There is no résumé here on purpose.'));
  q('.nf-h', panels[3]).forEach(function (h) { if (/Availability and source/.test(h.textContent)) h.textContent = 'Availability'; });
  q('.nf-h', panels[2]).forEach(function (h) { if (/What you want to say/.test(h.textContent)) h.remove(); });
  q('.nf-h', panels[1]).forEach(function (h) { if (/^Publications$/.test(h.textContent.trim())) { var nx = h.nextElementSibling; if (nx && nx.classList.contains('nf-hint')) nx.remove(); h.remove(); } });
  function ctx() { var fn = (byName('First-Name') || {}).value || '', d = (disc || {}).value || ''; var c = head.querySelector('.nf-ctx'); c.textContent = fn ? (fn.trim() + "'s application" + (d ? ' — ' + d : '')) : (d ? d : 'Application to Theodyx\'s Network'); }
  function go(i) { cur = i; panels.forEach(function (p, j) { p.classList.toggle('nf-on', j === i); }); head.querySelector('.nf-step-n').textContent = 'Step ' + (i + 1) + ' of ' + panels.length; head.querySelector('.nf-step-t').textContent = STEPS[i].t; head.querySelector('.nf-bar i').style.width = ((i + 1) / panels.length * 100) + '%'; ctx(); if (i > 0 || form.getAttribute('data-nf-started')) { form.setAttribute('data-nf-started', '1'); head.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
  function valid(p) {
    var ok = true, first = null;
    q('input,select,textarea', p).forEach(function (c) { if (c.disabled || c.closest('[hidden]')) return; err(c, ''); if (!c.checkValidity()) { ok = false; if (!first) first = c; var m = c.validity.valueMissing ? (c.type === 'file' ? 'Please add your headshot.' : 'This one is needed.') : c.validity.tooShort ? 'A little more, please: at least ' + c.minLength + ' characters.' : c.validity.typeMismatch ? (c.type === 'email' ? 'That email address looks incomplete.' : 'Please provide a complete URL starting with https://') : 'Please check this answer.'; if (c.type === 'checkbox' || c.type === 'radio') { var w = c.closest('.nf-check, .nf-chips, .nf-radios'); if (w) w.classList.add('nf-bad'); } else err(c, m); } });
    if (first) { (first.closest('.nf-field') || first).scrollIntoView({ behavior: 'smooth', block: 'center' }); try { first.focus({ preventScroll: true }); } catch (e) {} }
    return ok;
  }
  form.setAttribute('novalidate', ''); form.addEventListener('submit', function (e) { if (!valid(panels[panels.length - 1])) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  route(); go(0);
  byName('First-Name') && byName('First-Name').addEventListener('input', ctx);
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
