/*! theodyx-scouting.js — client logic for the native Webflow Scouting page (/scouting)
 * Wires the natively-built form + gates to the get-scouted Cloudflare Worker.
 * Source of truth mirrored from ~/CLAUDE/theodyx-get-scouted (React app + shared/schema.ts).
 * Defensive + idempotent: every DOM lookup is guarded, so attaching this to a
 * partially-built page (or running twice) is a no-op rather than an error.
 * Host: jsDelivr GrantSikes/liquidgl-theodyx ; applied to page 6a3d4a65f73ca09cba112c93.
 */
(function () {
  'use strict';
  if (window.__thxScouting) return;
  window.__thxScouting = true;

  /* ---------------------------------------------------------------- config */
  var API_BASE = 'https://theodyx-scouting-api.theodyx.workers.dev';
  var TURNSTILE_SITE_KEY = '0x4AAAAAADp3wmr_gUgr_SNb';
  var TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  var QR_SRC = 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@04f46c6a0708418cb7b96fc563eacae0fbf77674/qrcode.min.js';
  var MIN_AGE = 14;
  var MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
  var SCOUTING_EMAIL = 'scouting@theodyx.com';
  var SS_FORM = 'theodyx_scouting_form_v1';
  var SS_GATES = 'theodyx_scouting_gates_v1';
  var PAGE_URL = (location.origin || 'https://www.theodyx.com') + (location.pathname || '/scouting');
  var INTRO_PHOTO = 'https://cdn.prod.website-files.com/69fe0aaad9f3034241913693/6a3d6ef7517e5adb1b9c90d0_theodyx-scouting-portrait.jpg';

  /* Option sets — copied verbatim from shared/schema.ts so the two never drift. */
  var COUNTRIES = ['United States','Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Congo (DRC)','Costa Rica','Côte d’Ivoire','Croatia','Cuba','Cyprus','Czechia','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','São Tomé and Príncipe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Türkiye','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Other'];

  var PLATFORM_GROUPS = [
    { group: 'Global', options: [['instagram','Instagram'],['tiktok','TikTok'],['youtube','YouTube'],['facebook','Facebook'],['x','X (Twitter)'],['snapchat','Snapchat'],['twitch','Twitch'],['kick','Kick'],['pinterest','Pinterest'],['reddit','Reddit'],['threads','Threads'],['linkedin','LinkedIn']] },
    { group: 'China', options: [['douyin','Douyin (抖音)'],['weixin','WeChat · Weixin (微信)'],['weibo','Weibo (微博)'],['bilibili','Bilibili (哔哩哔哩)'],['xiaohongshu','Xiaohongshu · RED (小红书)'],['kuaishou','Kuaishou (快手)']] },
    { group: 'Russia & CIS', options: [['vk','VK (ВКонтакте)'],['telegram','Telegram'],['odnoklassniki','Odnoklassniki (ОК)'],['rutube','RUTUBE'],['dzen','Dzen (Дзен)']] },
    { group: 'India', options: [['sharechat','ShareChat'],['moj','Moj'],['josh','Josh'],['roposo','Roposo']] },
    { group: 'Asia-Pacific', options: [['naver','Naver (Korea)'],['line','LINE (Japan)'],['niconico','Niconico (Japan)'],['likee','Likee'],['bigo','Bigo Live']] },
    { group: 'Creator platforms', options: [['substack','Substack'],['patreon','Patreon'],['vimeo','Vimeo'],['dailymotion','Dailymotion'],['triller','Triller']] },
    { group: 'Other', options: [['other','Other']] }
  ];

  /* --------------------------------------------------------------- helpers */
  function $(id) { return document.getElementById(id); }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function setText(el, t) { if (el) el.textContent = t; }
  function show(el, disp) { if (el) el.style.display = disp || 'block'; }
  function hide(el) { if (el) el.style.display = 'none'; }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isUrl(v) { try { var u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (e) { return false; } }
  function loadJSON(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { return null; } }
  function saveJSON(key, obj) { try { sessionStorage.setItem(key, JSON.stringify(obj)); } catch (e) {} }

  function loadScriptOnce(src, cb) {
    if (qs('script[src="' + src + '"]')) { if (cb) cb(); return; }
    var s = document.createElement('script');
    s.src = src; s.async = true; s.defer = true;
    if (cb) s.onload = cb;
    document.head.appendChild(s);
  }

  /* state */
  var gates = (function () {
    var g = loadJSON(SS_GATES) || {};
    return { trust: !!g.trust, ageResolved: !!g.ageResolved, eligible: !!g.eligible, age: g.age == null ? null : g.age };
  })();
  var mediaKitKey;            // string | undefined
  var sampleKeys = [undefined, undefined, undefined];
  var turnstileToken = '';
  var submitting = false;

  /* --------------------------------------------------------- option fills */
  function fillCountries() {
    var sel = $('sc-country');
    if (!sel || sel.dataset.thxFilled) return;
    sel.dataset.thxFilled = '1';
    var ph = document.createElement('option');
    ph.value = ''; ph.textContent = 'Select your country…'; ph.disabled = true; ph.selected = true;
    sel.appendChild(ph);
    COUNTRIES.forEach(function (c) {
      var o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o);
    });
  }
  function fillPlatforms() {
    var sel = $('sc-platform');
    if (!sel || sel.dataset.thxFilled) return;
    sel.dataset.thxFilled = '1';
    var ph = document.createElement('option');
    ph.value = ''; ph.textContent = 'Select…'; ph.disabled = true; ph.selected = true;
    sel.appendChild(ph);
    PLATFORM_GROUPS.forEach(function (g) {
      var og = document.createElement('optgroup'); og.label = g.group;
      g.options.forEach(function (pair) {
        var o = document.createElement('option'); o.value = pair[0]; o.textContent = pair[1]; og.appendChild(o);
      });
      sel.appendChild(og);
    });
  }
  function fillAges() {
    var sel = $('sc-age-select');
    if (!sel || sel.dataset.thxFilled) return;
    sel.dataset.thxFilled = '1';
    function opt(v, t, dis, seld) { var o = document.createElement('option'); o.value = v; o.textContent = t; if (dis) o.disabled = true; if (seld) o.selected = true; return o; }
    sel.appendChild(opt('', 'Select your age…', true, true));
    sel.appendChild(opt('under', 'Under ' + MIN_AGE));
    for (var a = MIN_AGE; a <= 80; a++) sel.appendChild(opt(String(a), String(a)));
    sel.appendChild(opt('prefer', 'Prefer not to say'));
  }

  /* --------------------------------------------------------------- gates */
  function persistGates() { saveJSON(SS_GATES, gates); }
  function lockScroll(lock) { document.body.style.overflow = lock ? 'hidden' : ''; }

  var APP_SECTIONS = ['sc-form-you', 'sc-form-work', 'sc-form-consent'];
  function showApp(disp) { var intro = qs('.sc-intro'); if (intro) intro.style.display = disp ? 'block' : 'none'; APP_SECTIONS.forEach(function (id) { var e = $(id); if (e) e.style.display = disp ? 'block' : 'none'; }); }

  function applyGateState() {
    var safety = $('sc-gate-safety'), age = $('sc-gate-age'), u14 = $('sc-gate-u14');
    hide(safety); hide(age); hide(u14);
    if (!gates.trust) { show(safety, 'flex'); lockScroll(true); showApp(false); return; }
    if (!gates.ageResolved) { show(age, 'flex'); lockScroll(true); showApp(false); return; }
    lockScroll(false);
    if (gates.eligible) { showApp(true); hide(u14); }
    else { showApp(false); show(u14, 'block'); }
  }

  function wireGates() {
    on($('sc-gate-safety-ok'), 'click', function () { gates.trust = true; persistGates(); applyGateState(); var a = $('sc-age-select'); if (a) a.focus(); });
    var go = $('sc-gate-age-go');
    on(go, 'click', function () {
      var sel = $('sc-age-select'); if (!sel || !sel.value) return;
      var c = sel.value;
      if (c === 'under' || c === 'prefer') { gates.eligible = false; gates.age = null; }
      else { var age = parseInt(c, 10); gates.age = age; gates.eligible = age >= MIN_AGE; }
      gates.ageResolved = true; persistGates(); applyGateState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    var sel = $('sc-age-select');
    on(sel, 'change', function () { if (go) go.disabled = !sel.value; });
    if (go && sel) go.disabled = !sel.value;
  }

  /* --------------------------------------------------------- form persist */
  var TEXT_FIELDS = ['sc-email','sc-firstName','sc-lastName','sc-dob','sc-platform','sc-country','sc-state','sc-city','sc-instagram','sc-tiktok','sc-youtube','sc-otherPlatform','sc-otherHandle','sc-link1','sc-link2','sc-link3','sc-notes'];

  function hydrateForm() {
    var saved = loadJSON(SS_FORM); if (!saved) { return; }
    TEXT_FIELDS.forEach(function (id) { var e = $(id); if (e && typeof saved[id] === 'string') e.value = saved[id]; });
    if (saved.represented === 'no' || saved.represented === 'yes') setRepresented(saved.represented, true);
    onPlatformChange();
  }
  function persistForm() {
    var obj = {};
    TEXT_FIELDS.forEach(function (id) { var e = $(id); if (e) obj[id] = e.value; });
    obj.represented = currentRepresented();
    saveJSON(SS_FORM, obj);
  }
  function wirePersist() {
    TEXT_FIELDS.forEach(function (id) { var e = $(id); if (e) { on(e, 'input', persistForm); on(e, 'change', persistForm); } });
  }

  /* ------------------------------------------------------- represented + other */
  function currentRepresented() {
    var on1 = qs('#sc-rep [data-val="yes"]'); var off1 = qs('#sc-rep [data-val="no"]');
    if (on1 && on1.getAttribute('data-on') === 'true') return 'yes';
    if (off1 && off1.getAttribute('data-on') === 'true') return 'no';
    return '';
  }
  function setRepresented(v, skipPersist) {
    qsa('#sc-rep [data-val]').forEach(function (b) {
      var isOn = b.getAttribute('data-val') === v;
      b.setAttribute('data-on', isOn ? 'true' : 'false');
      b.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    });
    var wrap = $('sc-representedBy-wrap');
    if (wrap) wrap.style.display = (v === 'yes') ? 'block' : 'none';
    if (!skipPersist) persistForm();
  }
  function wireRepresented() {
    qsa('#sc-rep [data-val]').forEach(function (b) { on(b, 'click', function () { setRepresented(b.getAttribute('data-val')); }); });
  }
  function onPlatformChange() {
    var sel = $('sc-platform'); var wrap = $('sc-other-wrap');
    if (wrap) wrap.style.display = (sel && sel.value === 'other') ? 'block' : 'none';
  }
  function wirePlatform() { var sel = $('sc-platform'); on(sel, 'change', function () { onPlatformChange(); persistForm(); }); }

  /* ------------------------------------------------------------- uploads */
  function uploadFile(file, onProgress) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', API_BASE + '/upload', true);
      xhr.setRequestHeader('content-type', file.type || 'application/octet-stream');
      if (xhr.upload && onProgress) xhr.upload.onprogress = function (e) { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = function () {
        var data = null; try { data = JSON.parse(xhr.responseText); } catch (e) {}
        if (xhr.status >= 200 && xhr.status < 300 && data && data.ok && data.key) resolve({ ok: true, key: data.key });
        else resolve({ ok: false, error: uploadErr(data && data.error) });
      };
      xhr.onerror = function () { resolve({ ok: false, error: 'Upload failed. Check your connection.' }); };
      xhr.send(file);
    });
  }
  function uploadErr(code) {
    if (code === 'too_large') return 'That file is over 10 MB. Try a smaller one.';
    if (code === 'unsupported_type') return 'That file type isn’t supported.';
    return 'Upload failed. Please try again.';
  }

  function setDropState(drop, html) { if (drop) drop.innerHTML = html; }
  function idleDropHTML(drop) {
    var main = drop.getAttribute('data-main') || '+ Upload';
    return '<span class="sc-drop-main">' + main + '</span><span class="sc-drop-sub">≤ 10 MB</span>';
  }

  function wireDrop(dropId, accept, onKey) {
    var drop = $(dropId); if (!drop || drop.dataset.thxWired) return;
    drop.dataset.thxWired = '1';
    if (!drop.innerHTML.trim()) setDropState(drop, idleDropHTML(drop));
    var input = document.createElement('input');
    input.type = 'file'; input.accept = accept; input.style.display = 'none';
    drop.appendChild(input);
    function reset() { drop.classList.remove('is-done'); setDropState(drop, idleDropHTML(drop)); drop.appendChild(input); onKey(undefined); }
    on(drop, 'click', function (e) { if (e.target && e.target.getAttribute && e.target.getAttribute('data-remove') === '1') { e.stopPropagation(); reset(); return; } input.click(); });
    on(input, 'change', function () {
      var file = input.files && input.files[0]; if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) { drop.classList.add('is-error'); setDropState(drop, '<span class="sc-drop-main" style="color:#8A1F1B">Files must be 10 MB or smaller.</span><span class="sc-drop-sub">Tap to try another</span>'); return; }
      drop.classList.remove('is-error');
      setDropState(drop, '<span class="sc-drop-main">Uploading… <b class="sc-pct">0%</b></span><span class="sc-drop-sub">' + escapeHtml(file.name) + '</span>');
      uploadFile(file, function (pct) { var p = qs('.sc-pct', drop); if (p) p.textContent = pct + '%'; }).then(function (res) {
        if (res.ok) {
          drop.classList.add('is-done');
          setDropState(drop, '<span class="sc-drop-main">✓ ' + escapeHtml(file.name) + '</span><span class="sc-drop-sub"><a href="#" data-remove="1" class="sc-drop-remove">Remove</a></span>');
          onKey(res.key);
        } else {
          drop.classList.add('is-error');
          setDropState(drop, '<span class="sc-drop-main" style="color:#8A1F1B">' + escapeHtml(res.error) + '</span><span class="sc-drop-sub">Tap to try again</span>');
        }
      });
    });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function wireUploads() {
    wireDrop('sc-mediakit', 'application/pdf', function (k) { mediaKitKey = k; });
    wireDrop('sc-pic0', 'image/png,image/jpeg,image/webp', function (k) { sampleKeys[0] = k; });
    wireDrop('sc-pic1', 'image/png,image/jpeg,image/webp', function (k) { sampleKeys[1] = k; });
    wireDrop('sc-pic2', 'image/png,image/jpeg,image/webp', function (k) { sampleKeys[2] = k; });
  }

  /* ----------------------------------------------------------- turnstile */
  function renderTurnstile() {
    var box = $('sc-turnstile'); if (!box) return;
    if (!window.turnstile) { return; }
    if (box.dataset.thxRendered) return; box.dataset.thxRendered = '1';
    try {
      window.turnstile.render(box, {
        sitekey: TURNSTILE_SITE_KEY, theme: 'light',
        callback: function (t) { turnstileToken = t; clearErr(); },
        'expired-callback': function () { turnstileToken = ''; },
        'error-callback': function () { turnstileToken = ''; }
      });
    } catch (e) {}
  }
  function initTurnstile() {
    var box = $('sc-turnstile'); if (!box) return;
    loadScriptOnce(TURNSTILE_SRC, renderTurnstile);
    if (window.turnstile) renderTurnstile();
    else { var n = 0, iv = setInterval(function () { if (window.turnstile) { clearInterval(iv); renderTurnstile(); } else if (++n > 50) clearInterval(iv); }, 200); }
  }

  /* ---------------------------------------------------------------- QR */
  function initQR() {
    var box = $('sc-qr'); if (!box) return;
    loadScriptOnce(QR_SRC, function () {
      if (!window.QRCode || box.dataset.thxQr) return; box.dataset.thxQr = '1';
      try { new window.QRCode(box, { text: PAGE_URL, width: 120, height: 120, colorDark: '#0E0E0F', colorLight: '#F2F1EC', correctLevel: window.QRCode.CorrectLevel.M }); } catch (e) {}
    });
  }

  /* -------------------------------------------------------------- errors */
  function clearErr() { var box = $('sc-err'); if (box) { box.style.display = 'none'; box.textContent = ''; } qsa('.sc-input--error').forEach(function (e) { e.classList.remove('sc-input--error'); }); }
  function showErr(msg, firstBadId) {
    var box = $('sc-err');
    if (box) { box.textContent = msg; box.style.display = 'block'; }
    if (firstBadId) { var e = $(firstBadId); if (e) { e.scrollIntoView({ behavior: 'smooth', block: 'center' }); try { e.focus(); } catch (x) {} } }
  }
  function markBad(id) { var e = $(id); if (e) e.classList.add('sc-input--error'); }

  /* -------------------------------------------------------------- submit */
  function collectAndValidate() {
    clearErr();
    var errs = [];
    function need(id, msg) { var v = val(id); if (!v) { markBad(id); errs.push([id, msg]); } return v; }

    var email = val('sc-email');
    if (!isEmail(email)) { markBad('sc-email'); errs.push(['sc-email', 'Enter a valid email address.']); }
    var firstName = need('sc-firstName', 'First name is required.');
    var lastName = need('sc-lastName', 'Last name is required.');
    var dob = val('sc-dob');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) { markBad('sc-dob'); errs.push(['sc-dob', 'Enter your date of birth.']); }
    var country = val('sc-country'); if (!country) { markBad('sc-country'); errs.push(['sc-country', 'Select your country.']); }
    var city = need('sc-city', 'City is required.');
    var platform = val('sc-platform'); if (!platform) { markBad('sc-platform'); errs.push(['sc-platform', 'Select your main platform.']); }
    var rep = currentRepresented(); if (rep !== 'yes' && rep !== 'no') { errs.push(['sc-rep', 'Let us know if you’re represented.']); }
    var representedBy = val('sc-representedBy');
    if (rep === 'yes' && !representedBy) { markBad('sc-representedBy'); errs.push(['sc-representedBy', 'Who represents you?']); }
    var otherPlatform = val('sc-otherPlatform');
    if (platform === 'other' && !otherPlatform) { markBad('sc-otherPlatform'); errs.push(['sc-otherPlatform', 'Name the platform.']); }

    var links = ['sc-link1', 'sc-link2', 'sc-link3'].map(val).filter(Boolean);
    for (var i = 0; i < links.length; i++) { if (!isUrl(links[i])) { errs.push(['sc-link1', 'Enter valid links (https://…).']); break; } }

    var consent = $('sc-consent'); if (!consent || !consent.checked) { errs.push(['sc-consent', 'Please agree to continue.']); }
    if (!turnstileToken) { errs.push(['sc-turnstile', 'Please complete the verification, then submit.']); }

    if (errs.length) { showErr(errs[0][1], errs[0][0].indexOf('sc-rep') === 0 ? null : errs[0][0]); return null; }

    var payload = {
      email: email, firstName: firstName, lastName: lastName, dob: dob,
      ageConfirmed: true,
      country: country, city: city,
      primaryPlatform: platform,
      represented: rep === 'yes',
      consent: true,
      turnstileToken: turnstileToken,
      company: ''
    };
    var state = val('sc-state'); if (state) payload.state = state;
    var ig = val('sc-instagram'); if (ig) payload.instagram = ig;
    var tt = val('sc-tiktok'); if (tt) payload.tiktok = tt;
    var yt = val('sc-youtube'); if (yt) payload.youtube = yt;
    if (platform === 'other') { payload.otherPlatform = otherPlatform; var oh = val('sc-otherHandle'); if (oh) payload.otherHandle = oh; }
    if (rep === 'yes') payload.representedBy = representedBy;
    if (links.length) payload.bestLinks = links;
    if (mediaKitKey) payload.mediaKitKey = mediaKitKey;
    var samples = sampleKeys.filter(Boolean); if (samples.length) payload.sampleKeys = samples;
    var notes = val('sc-notes'); if (notes) payload.notes = notes;
    return payload;
  }

  function setSubmitting(b) {
    submitting = b;
    var btn = $('sc-submit'); if (!btn) return;
    btn.disabled = b;
    btn.textContent = b ? 'Submitting…' : (btn.getAttribute('data-label') || 'Submit application');
  }

  function doSubmit() {
    if (submitting) return;
    var honey = $('sc-company'); if (honey && honey.value) { return; } // bot
    var payload = collectAndValidate(); if (!payload) return;
    setSubmitting(true);
    fetch(API_BASE + '/apply', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
    }).then(function (r) { return r.json().catch(function () { return null; }); })
      .then(function (data) {
        setSubmitting(false);
        if (data && data.ok) { onSuccess(); return; }
        if (data && data.error === 'validation' && data.fieldErrors) {
          var keys = Object.keys(data.fieldErrors);
          var first = keys[0];
          var id = first ? ('sc-' + first) : null;
          if (id) markBad(id);
          showErr(first ? data.fieldErrors[first] : 'Please check the highlighted fields.', id);
        } else if (data && data.error === 'turnstile') {
          turnstileToken = ''; if (window.turnstile) try { window.turnstile.reset(); } catch (e) {}
          showErr('Please complete the verification, then submit.', 'sc-turnstile');
        } else if (data && data.error === 'rate_limited') {
          showErr('Too many attempts. Please try again later, or email ' + SCOUTING_EMAIL + '.');
        } else {
          showErr('Something went wrong on our end. Your application didn’t send — try again, or email ' + SCOUTING_EMAIL + '.');
        }
      })
      .catch(function () {
        setSubmitting(false);
        showErr('Network error — your application didn’t send. Check your connection and try again.');
      });
  }

  function onSuccess() {
    try { sessionStorage.removeItem(SS_FORM); } catch (e) {}
    showApp(false);
    var success = $('sc-success');
    if (success) { show(success, 'flex'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------------------------------- neutralize WF */
  function neutralizeForms() {
    // Stop Webflow's native AJAX form handler from hijacking our custom submit.
    qsa('#sc-page form, .sc-page form, form.sc-form').forEach(function (f) {
      f.addEventListener('submit', function (e) { e.preventDefault(); }, true);
      f.setAttribute('onsubmit', 'return false;');
    });
  }

  /* ------------------------------------------------------------ stylesheet */
  function injectCSS() {
    if ($('sc-css')) return;
    var css = [
      ':root{--sc-ink:#0E0E0F;--sc-paper:#F2F1EC;--sc-dark:#0a0a0c;--sc-mute:rgba(14,14,15,0.7);--sc-mute-ink:rgba(242,241,236,0.6);--sc-hair:rgba(14,14,15,0.16);--sc-hair-ink:rgba(242,241,236,0.2);--sc-line:rgba(14,14,15,0.28);--sc-err:#8A1F1B;}',
      '.sc-app-sans{font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif;}',
      '#sc-form-you,#sc-form-work,#sc-form-consent{display:none;background:var(--sc-paper);color:var(--sc-ink);font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif;}',
      '.sc-section{max-width:760px;margin:0 auto;padding:64px 20px;}',
      '@media(min-width:640px){.sc-section{padding:96px 32px;}}',
      '#sc-form-work{background:rgba(14,14,15,0.02);border-top:1px solid var(--sc-hair);}',
      '.sc-eyebrow,.sc-label{font-family:"Space Mono","Mono",ui-monospace,monospace;}',
      '.sc-eyebrow{display:flex;align-items:center;gap:16px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--sc-mute);margin-bottom:36px;}',
      '.sc-eyebrow::after{content:"";flex:1;height:1px;background:var(--sc-hair);}',
      '.sc-h2{font-family:"Objectivity","Archivo",sans-serif;font-weight:700;font-size:clamp(28px,4vw,46px);line-height:1.05;letter-spacing:-0.01em;margin:0 0 14px;}',
      '.sc-text{font-size:clamp(15px,1.4vw,17px);line-height:1.6;color:var(--sc-mute);max-width:60ch;margin:0 0 40px;}',
      '.sc-grid{display:grid;grid-template-columns:1fr;gap:28px 40px;}',
      '.sc-grid3{display:grid;grid-template-columns:1fr;gap:28px 40px;}',
      '@media(min-width:768px){.sc-grid{grid-template-columns:1fr 1fr;}.sc-grid3{grid-template-columns:1fr 1fr 1fr;}}',
      '.sc-full{grid-column:1/-1;}',
      '.sc-field{display:flex;flex-direction:column;}',
      '.sc-label{display:block;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--sc-ink);margin-bottom:8px;}',
      '.sc-input,.sc-select,.sc-textarea{width:100%;background:transparent;border:0;border-bottom:1px solid var(--sc-line);padding:8px 0 10px;font-family:inherit;font-size:clamp(16px,1.5vw,18px);color:var(--sc-ink);border-radius:0;-webkit-appearance:none;appearance:none;transition:border-color .16s ease;}',
      '.sc-textarea{resize:vertical;min-height:96px;}',
      '.sc-select{background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'><path d=\'M1 1l5 5 5-5\' stroke=\'%230E0E0F\' fill=\'none\' stroke-width=\'1.4\'/></svg>");background-repeat:no-repeat;background-position:right 2px center;padding-right:20px;}',
      '.sc-input:focus,.sc-select:focus,.sc-textarea:focus{outline:none;border-bottom-color:var(--sc-ink);border-bottom-width:1.5px;}',
      '.sc-input::placeholder,.sc-textarea::placeholder{color:rgba(14,14,15,0.4);}',
      '.sc-input--error{border-bottom-color:var(--sc-err)!important;}',
      '.sc-chips{display:flex;gap:12px;flex-wrap:wrap;}',
      '.sc-chip{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;padding:9px 18px;border:1px solid var(--sc-line);background:transparent;color:var(--sc-ink);cursor:pointer;transition:all .14s ease;}',
      '.sc-chip[data-on="true"]{background:var(--sc-ink);color:var(--sc-paper);border-color:var(--sc-ink);}',
      '.sc-legend{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:12px;display:block;}',
      '.sc-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;aspect-ratio:4/3;border:1px dashed var(--sc-line);text-align:center;cursor:pointer;padding:16px;transition:background .14s ease;}',
      '.sc-drop:hover{background:rgba(0,0,0,0.02);}',
      '.sc-drop.is-done{border-style:solid;cursor:default;aspect-ratio:auto;flex-direction:row;justify-content:space-between;padding:14px 16px;}',
      '.sc-drop-main{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:12px;color:var(--sc-mute);}',
      '.sc-drop.is-done .sc-drop-main{color:var(--sc-ink);}',
      '.sc-drop-sub{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:10px;color:var(--sc-mute);}',
      '.sc-drop-remove{color:var(--sc-ink);text-decoration:underline;text-underline-offset:2px;}',
      '.sc-consent{display:flex;align-items:flex-start;gap:12px;cursor:pointer;}',
      '.sc-check{margin-top:3px;width:18px;height:18px;flex:0 0 auto;accent-color:var(--sc-ink);}',
      '.sc-consent-text{font-size:15px;line-height:1.6;}',
      '.sc-consent-text a{color:var(--sc-ink);text-decoration:underline;text-underline-offset:2px;}',
      '#sc-turnstile{margin-top:28px;}',
      '.sc-err{display:none;margin-top:22px;border-left:2px solid var(--sc-err);padding-left:16px;color:var(--sc-err);font-size:15px;line-height:1.5;}',
      '.sc-submit{margin-top:28px;width:100%;max-width:420px;display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--sc-ink);color:var(--sc-paper);border:1px solid var(--sc-ink);padding:18px 28px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:all .16s ease;}',
      '.sc-submit:hover:not(:disabled){background:var(--sc-paper);color:var(--sc-ink);}',
      '.sc-submit:disabled{opacity:.6;cursor:default;}',
      '.sc-note{margin-top:14px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;color:var(--sc-mute);}',
      '.sc-honey{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}',
      '#sc-other-wrap,#sc-representedBy-wrap,#sc-gate-u14{display:none;}',
      '.sc-block{margin-top:48px;}',
      '.sc-block--divider{margin-top:56px;border-top:1px solid var(--sc-hair);padding-top:48px;}',
      '.sc-drop--kit{max-width:320px;}',
      '.sc-opt{color:var(--sc-mute);font-weight:400;}',
      '.sc-label--stack{margin-top:18px;}',
      '.sc-pics-note{margin-bottom:32px;}',
      '.sc-serif{font-family:"Cormorant","Cormorant Garamond",Georgia,serif;font-style:italic;font-size:clamp(20px,2.4vw,30px);line-height:1.3;margin-top:24px;}',
      /* gates + success overlays */
      '#sc-gate-safety,#sc-gate-age,#sc-success{display:none;position:fixed;inset:0;z-index:9000;overflow-y:auto;background:var(--sc-ink);color:var(--sc-paper);font-family:"Objectivity","Archivo",sans-serif;}',
      '#sc-gate-age{background:rgba(14,14,15,0.92);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);align-items:center;justify-content:center;}',
      '#sc-gate-safety{align-items:center;justify-content:center;}',
      '.sc-gate-inner{max-width:640px;margin:0 auto;padding:64px 28px;width:100%;}',
      '.sc-gate-inner--center{text-align:center;max-width:440px;}',
      '.sc-gate-eyebrow{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--sc-mute-ink);margin-bottom:24px;display:block;}',
      '.sc-gate-h{font-family:"Objectivity","Archivo",sans-serif;font-weight:700;font-size:clamp(28px,4vw,46px);line-height:1.05;margin:0;}',
      '.sc-gate-body{font-size:16px;line-height:1.7;margin:28px 0 0;color:var(--sc-paper);}',
      '.sc-gate-body a{color:var(--sc-paper);text-decoration:underline;text-underline-offset:2px;}',
      '.sc-gate-note{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:12px;line-height:1.6;color:var(--sc-mute-ink);margin-top:28px;}',
      '.sc-gate-btn{margin-top:40px;background:var(--sc-paper);color:var(--sc-ink);border:1px solid var(--sc-paper);padding:16px 32px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:all .16s ease;}',
      '.sc-gate-btn:hover:not(:disabled){background:transparent;color:var(--sc-paper);}',
      '.sc-gate-btn:disabled{opacity:.5;cursor:not-allowed;}',
      '.sc-gate-field{max-width:300px;margin:36px auto 0;text-align:left;}',
      '.sc-gate-field .sc-label{color:var(--sc-paper);}',
      '#sc-age-select{color:var(--sc-paper);border-bottom-color:var(--sc-hair-ink);}',
      '#sc-age-select option{color:#111;}',
      '#sc-gate-u14{display:none;}',
      '#sc-success .sc-gate-inner{min-height:70vh;display:flex;flex-direction:column;justify-content:center;}',
      '.sc-success-title{font-family:"Objectivity","Archivo",sans-serif;font-weight:800;font-size:clamp(40px,7vw,96px);line-height:1;margin:0;}',
      /* ---- v1.2.0 editorial pass: charcoal hero, no ghost, black headings, more air ---- */
      /* Hero: short charcoal band, thin uppercase wordmark, drop the giant THEODYX ghost */
      '.sc-hero{background:#262626!important;min-height:0!important;height:auto!important;display:flex!important;align-items:flex-end!important;padding:clamp(80px,11vw,128px) clamp(22px,6vw,72px) clamp(56px,7vw,84px)!important;}',
      '.sc-hero-ghost{display:none!important;}',
      '.sc-hero-title{color:#F2F1EC!important;font-family:"Archivo","Objectivity",sans-serif!important;font-weight:300!important;font-size:clamp(46px,9vw,124px)!important;letter-spacing:0.012em!important;line-height:0.96!important;margin:0!important;text-transform:uppercase!important;}',
      /* Intro: airy, black heading, text left / QR right */
      '.sc-intro{background:var(--sc-paper)!important;padding:clamp(64px,8vw,108px) clamp(22px,6vw,72px) clamp(48px,6vw,76px)!important;}',
      '.sc-intro .sc-eyebrow{font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:11px!important;letter-spacing:0.22em!important;text-transform:uppercase!important;color:var(--sc-mute)!important;margin-bottom:clamp(28px,4vw,40px)!important;}',
      '.sc-intro-row{display:flex!important;flex-wrap:wrap;gap:clamp(32px,5vw,64px);align-items:flex-start;justify-content:space-between;}',
      '.sc-intro-text{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(16px,1.5vw,19px)!important;line-height:1.72!important;color:var(--sc-ink)!important;max-width:44ch;margin:0;}',
      '.sc-qr-wrap{display:flex;align-items:center;gap:16px;}',
      '.sc-qr-cap{font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:12px!important;line-height:1.5;color:var(--sc-mute)!important;max-width:150px;}',
      /* Headings everywhere on paper → ink black + lighter, larger, airier (fixes white-on-cream) */
      '.sc-h2{color:var(--sc-ink)!important;font-family:"Objectivity","Archivo",sans-serif!important;font-weight:400!important;font-size:clamp(32px,4.6vw,56px)!important;letter-spacing:-0.012em!important;line-height:1.08!important;margin-bottom:clamp(18px,2.4vw,28px)!important;}',
      /* More breathing room in the form sections */
      '.sc-section{max-width:860px!important;padding:clamp(72px,10vw,132px) clamp(22px,6vw,44px)!important;}',
      '.sc-eyebrow{margin-bottom:clamp(36px,5vw,52px)!important;}',
      '.sc-grid{gap:34px 52px!important;}',
      '.sc-grid3{gap:34px 52px!important;}',
      '.sc-text{line-height:1.72!important;margin-bottom:clamp(40px,5vw,60px)!important;max-width:58ch;}',
      '.sc-label{color:var(--sc-ink)!important;}',
      '.sc-submit{margin-top:clamp(28px,4vw,40px)!important;}',
      /* hide the duplicate native page header — keep the site-wide nav only */
      '.sc-header{display:none!important;}',
      /* intro: text + QR on the left, B&W editorial polaroid on the right */
      '.sc-intro-row{display:flex!important;flex-wrap:wrap;gap:clamp(32px,5vw,72px)!important;align-items:flex-start;justify-content:space-between;}',
      '.sc-intro-main{flex:1 1 360px;min-width:min(100%,300px);display:flex;flex-direction:column;gap:30px;}',
      '.sc-photo{flex:0 0 auto;margin:0;background:#fff;padding:14px 14px 46px;box-shadow:0 26px 54px -26px rgba(0,0,0,.55);transform:rotate(2.4deg);position:relative;align-self:flex-start;}',
      '.sc-photo::before,.sc-photo::after{content:"";position:absolute;inset:0;background:#fbfbf9;box-shadow:0 18px 40px -28px rgba(0,0,0,.55);z-index:-1;}',
      '.sc-photo::before{transform:rotate(-5.5deg) translateY(8px);}',
      '.sc-photo::after{transform:rotate(3.5deg) translate(4px,4px);}',
      '.sc-photo img{display:block;width:clamp(216px,25vw,296px);aspect-ratio:3/4;object-fit:cover;filter:grayscale(1) contrast(1.03);transition:filter .55s ease;}',
      '.sc-photo:hover img{filter:grayscale(0) contrast(1);}',
      '@media(max-width:700px){.sc-photo{align-self:center;margin-top:8px;}}',
      /* QR is "continue on your phone" — pointless on a phone; desktop only */
      '@media(max-width:767px){.sc-qr-wrap,.sc-qr,#sc-qr,.sc-qr-cap{display:none!important;}}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'sc-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------------------------------------------------- DOM bootstrap (B) */
  /* If the native elements aren't on the page, inject them. If they already
   * exist (native Designer build), this is a no-op and we just wire them. */
  var FRAG_FORMS = [
'<section id="sc-form-you" class="sc-section sc-app-sans" aria-label="About you"><div class="sc-eyebrow">01 — You</div><h2 class="sc-h2">Tell us who you are</h2><form class="sc-form" novalidate><div class="sc-grid"><div class="sc-field sc-full"><label class="sc-label" for="sc-email">Email</label><input id="sc-email" class="sc-input" type="email" autocomplete="email" inputmode="email" placeholder="you@email.com"></div><div class="sc-field"><label class="sc-label" for="sc-firstName">First name</label><input id="sc-firstName" class="sc-input" type="text" autocomplete="given-name"></div><div class="sc-field"><label class="sc-label" for="sc-lastName">Last name</label><input id="sc-lastName" class="sc-input" type="text" autocomplete="family-name"></div><div class="sc-field"><label class="sc-label" for="sc-dob">Date of birth</label><input id="sc-dob" class="sc-input" type="date"></div><div class="sc-field"><label class="sc-label" for="sc-platform">Primary platform</label><select id="sc-platform" class="sc-select"></select></div><div class="sc-field"><label class="sc-label" for="sc-country">Country</label><select id="sc-country" class="sc-select"></select></div><div class="sc-field"><label class="sc-label" for="sc-state">State / Region</label><input id="sc-state" class="sc-input" type="text" autocomplete="address-level1" placeholder="State, province, or region"></div><div class="sc-field"><label class="sc-label" for="sc-city">City</label><input id="sc-city" class="sc-input" type="text" autocomplete="address-level2" placeholder="Where are you based?"></div><div class="sc-field"><label class="sc-label" for="sc-instagram">Instagram handle</label><input id="sc-instagram" class="sc-input" type="text" placeholder="yourhandle"></div><div class="sc-field"><label class="sc-label" for="sc-tiktok">TikTok handle</label><input id="sc-tiktok" class="sc-input" type="text" placeholder="yourhandle"></div><div class="sc-field"><label class="sc-label" for="sc-youtube">YouTube channel</label><input id="sc-youtube" class="sc-input" type="text" placeholder="@channel or URL"></div><div class="sc-field" id="sc-other-wrap"><label class="sc-label" for="sc-otherPlatform">Other platform</label><input id="sc-otherPlatform" class="sc-input" type="text" placeholder="e.g. Substack, Twitch"><label class="sc-label sc-label--stack" for="sc-otherHandle">Handle on that platform</label><input id="sc-otherHandle" class="sc-input" type="text"></div><div class="sc-field sc-full" id="sc-rep"><span class="sc-legend">Are you currently represented? *</span><div class="sc-chips"><button type="button" class="sc-chip" data-val="no" data-on="false" aria-pressed="false">No</button><button type="button" class="sc-chip" data-val="yes" data-on="false" aria-pressed="false">Yes</button></div></div><div class="sc-field sc-full" id="sc-representedBy-wrap"><label class="sc-label" for="sc-representedBy">Represented by</label><input id="sc-representedBy" class="sc-input" type="text" placeholder="Agency / manager"></div><div class="sc-field sc-full"><label class="sc-label" for="sc-notes">Anything else?</label><textarea id="sc-notes" class="sc-textarea" rows="4" placeholder="Anything we should know? (optional)"></textarea></div></div></form></section>',
'<section id="sc-form-work" class="sc-section sc-app-sans" aria-label="Your work"><div class="sc-eyebrow">02 — Work</div><h2 class="sc-h2">Show us your work</h2><p class="sc-text">Upload the media you’re proudest of — a few links, or a media kit. Optional, but it helps our team get to know you better.</p><form class="sc-form" novalidate><div class="sc-grid3"><div class="sc-field"><label class="sc-label" for="sc-link1">post / video 1</label><input id="sc-link1" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div><div class="sc-field"><label class="sc-label" for="sc-link2">post / video 2</label><input id="sc-link2" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div><div class="sc-field"><label class="sc-label" for="sc-link3">post / video 3</label><input id="sc-link3" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div></div><div class="sc-block"><label class="sc-label">Media kit (PDF) <span class="sc-opt">(optional)</span></label><div id="sc-mediakit" class="sc-drop sc-drop--kit" data-main="+ Upload PDF"></div></div><div class="sc-block--divider"><p class="sc-label">Your pictures</p><p class="sc-text sc-pics-note">Keep these natural — please avoid baggy clothing, make-up, or smiling. The photos you submit shouldn’t be filtered, re-touched, or professionally taken.</p><div class="sc-grid3"><div class="sc-field"><label class="sc-label">Headshot <span class="sc-opt">(optional)</span></label><div id="sc-pic0" class="sc-drop" data-main="+ Add image"></div></div><div class="sc-field"><label class="sc-label">Profile <span class="sc-opt">(optional)</span></label><div id="sc-pic1" class="sc-drop" data-main="+ Add image"></div></div><div class="sc-field"><label class="sc-label">Full length <span class="sc-opt">(optional)</span></label><div id="sc-pic2" class="sc-drop" data-main="+ Add image"></div></div></div></div></form></section>',
'<section id="sc-form-consent" class="sc-section sc-app-sans" aria-label="Consent and submit"><form class="sc-form" novalidate><label class="sc-consent" for="sc-consent"><input id="sc-consent" class="sc-check" type="checkbox"><span class="sc-consent-text">I agree to Theodyx’s <a href="https://www.theodyx.com/resources/legal/legal" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and consent to be contacted about representation. I understand this is an application, not an offer of representation.</span></label><div class="sc-honey" aria-hidden="true"><label for="sc-company">Company</label><input id="sc-company" name="company" type="text" tabindex="-1" autocomplete="off"></div><div id="sc-turnstile"></div><div id="sc-err" class="sc-err" role="alert"></div><button id="sc-submit" type="button" class="sc-submit">Submit application</button><p class="sc-note">Every application is read. No fees, ever.</p></form></section>',
'<section id="sc-gate-u14" class="sc-section sc-app-sans" aria-label="A note"><div class="sc-eyebrow">A note</div><h2 class="sc-h2">Thank you for your interest in joining Theodyx.</h2><p class="sc-text">We are invested in protecting the privacy of our applicants. For this reason, we are unfortunately unable to accept applications from anyone under 14 at this time. We look forward to receiving your future application.</p></section>'
  ];
  var FRAG_BODY = [
'<div id="sc-gate-safety" role="dialog" aria-modal="true" aria-label="Safety"><div class="sc-gate-inner"><span class="sc-gate-eyebrow">Theodyx — Safety</span><h2 class="sc-gate-h">Your safety comes first.</h2><p class="sc-gate-body">Safety is our top priority, and protecting aspiring creatives from online predators is of the utmost importance. Please do not respond to anyone claiming to be affiliated with Theodyx without alerting an adult and verifying their identity first. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</p><button id="sc-gate-safety-ok" type="button" class="sc-gate-btn">Acknowledged</button></div></div>',
'<div id="sc-gate-age" role="dialog" aria-modal="true" aria-label="Age"><form class="sc-form sc-gate-inner sc-gate-inner--center" novalidate><span class="sc-gate-eyebrow">One quick question</span><h2 class="sc-gate-h">How old are you?</h2><div class="sc-gate-field"><label class="sc-label" for="sc-age-select">Select your age</label><select id="sc-age-select" class="sc-select"></select></div><button id="sc-gate-age-go" type="button" class="sc-gate-btn" disabled>Continue</button><p class="sc-gate-note">You must be 14 or older to apply directly.</p></form></div>',
'<div id="sc-success" role="dialog" aria-live="polite" aria-label="Application received"><div class="sc-gate-inner"><span class="sc-gate-eyebrow">Application received</span><h2 class="sc-success-title">Thank you.</h2><p class="sc-serif">We read every one.</p><p class="sc-gate-body">Application received. If it’s a fit, we’ll reach out from @theodyx — keep an eye on your DMs and email inbox. We’ll only ever contact you from official accounts, and we never ask for payment.</p></div></div>'
  ];
  function elFromHTML(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function ensureDom() {
    if ($('sc-form-you')) return; // native build already present — wire only
    var host = qs('.sc-page') || qs('main') || document.body;
    FRAG_FORMS.forEach(function (h) { var n = elFromHTML(h); if (n) host.appendChild(n); });
    FRAG_BODY.forEach(function (h) { var n = elFromHTML(h); if (n) document.body.appendChild(n); });
  }

  /* Enhance the native intro: trim copy to the reference line, lay text+QR on the
   * left and add a B&W editorial polaroid on the right. Idempotent. */
  function enhanceIntro() {
    var intro = qs('.sc-intro'); if (!intro || intro.dataset.thxEnh) return; intro.dataset.thxEnh = '1';
    var txt = qs('.sc-intro-text', intro);
    if (txt) { txt.textContent = (txt.textContent || '').replace(/^\s*Interested in Theodyx\?\s*/i, ''); }
    var row = qs('.sc-intro-row', intro); if (!row) return;
    if (qs('.sc-photo', intro)) return;
    var main = document.createElement('div'); main.className = 'sc-intro-main';
    while (row.firstChild) { main.appendChild(row.firstChild); }
    row.appendChild(main);
    var fig = document.createElement('figure'); fig.className = 'sc-photo';
    var img = document.createElement('img'); img.src = INTRO_PHOTO; img.alt = 'Theodyx — scouting creators'; img.loading = 'lazy';
    img.onerror = function () { fig.style.display = 'none'; };
    fig.appendChild(img);
    row.appendChild(fig);
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    injectCSS();
    ensureDom();
    enhanceIntro();
    fillCountries(); fillPlatforms(); fillAges();
    wireGates();
    wireRepresented(); wirePlatform();
    wireUploads();
    wirePersist();
    var btn = $('sc-submit'); if (btn) { if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', (btn.textContent || 'Submit application').trim()); on(btn, 'click', function (e) { e.preventDefault(); doSubmit(); }); }
    neutralizeForms();
    hydrateForm();
    initTurnstile();
    initQR();
    applyGateState();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
