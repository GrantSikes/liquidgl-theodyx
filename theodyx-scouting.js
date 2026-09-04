(function () {
  'use strict';
  if (window.__thxScouting) return;
  window.__thxScouting = true;
  /* theodyx-scouting i18n (Phase 6): every user-facing string goes through T(); dictionaries (en/es/pt/fr) register with the site locale runtime, keyed by <html lang>. The safety statement and the age gate stay English on purpose: legal copy is translated by people, not scripts. */
  var SCD = {"en": {"sc.lbl.email": "Email", "sc.lbl.firstName": "First name", "sc.lbl.lastName": "Last name", "sc.lbl.dob": "Date of birth", "sc.lbl.platform": "Primary platform", "sc.lbl.country": "Country", "sc.lbl.state": "State / Region", "sc.lbl.city": "City", "sc.lbl.instagram": "Instagram handle", "sc.lbl.tiktok": "TikTok handle", "sc.lbl.youtube": "YouTube channel", "sc.lbl.otherPlatform": "Other platform", "sc.lbl.representedBy": "Represented by", "sc.lbl.notes": "Anything else?", "sc.lbl.link1": "post / video 1", "sc.lbl.link2": "post / video 2", "sc.lbl.link3": "post / video 3", "sc.lbl.pictures": "Your pictures", "sc.ph.email": "you@email.com", "sc.ph.state": "State, province, or region", "sc.ph.city": "Where are you based?", "sc.ph.handle": "yourhandle", "sc.ph.youtube": "@channel or URL", "sc.ph.otherPlatform": "e.g. Substack, Twitch", "sc.ph.representedBy": "Agency / manager", "sc.ph.country": "Select your country…", "sc.ph.select": "Select…", "sc.eyebrow.you": "01 — You", "sc.h2.you": "Tell us who you are", "sc.eyebrow.work": "02 — Work", "sc.h2.work": "Show us your work", "sc.text.work": "Upload the media you’re proudest of — a few links, or a media kit. Optional, but it helps our team get to know you better.", "sc.sec.you": "About you", "sc.sec.work": "Your work", "sc.sec.consent": "Consent and submit", "sc.legend.rep": "Are you currently represented? *", "sc.yes": "Yes", "sc.no": "No", "sc.optional": "(optional)", "sc.drop.upload": "+ Upload", "sc.drop.max": "≤ 10 MB", "sc.drop.toobig": "Files must be 10 MB or smaller.", "sc.drop.another": "Tap to try another", "sc.drop.again": "Tap to try again", "sc.drop.uploading": "Uploading…", "sc.drop.remove": "Remove", "sc.err.uploadnet": "Upload failed. Check your connection.", "sc.err.upload": "Upload failed. Please try again.", "sc.err.email": "Enter a valid email address.", "sc.err.first": "First name is required.", "sc.err.last": "Last name is required.", "sc.err.dob": "Enter your date of birth.", "sc.err.age": "You must be {n} or older to apply.", "sc.err.dobmatch": "Your date of birth doesn’t match the age you gave earlier.", "sc.err.country": "Select your country.", "sc.err.platform": "Select your main platform.", "sc.err.rep": "Let us know if you’re represented.", "sc.err.repby": "Who represents you?", "sc.err.other": "Name the platform.", "sc.err.links": "Enter valid links (https://…).", "sc.err.consent": "Please agree to continue.", "sc.err.turnstile": "Please complete the verification, then submit.", "sc.err.fields": "Please check the highlighted fields.", "sc.err.rate": "Too many attempts. Please try again later, or email {email}.", "sc.submit": "Submit application", "sc.submitting": "Submitting…", "sc.success.eyebrow": "Application received", "sc.success.title": "Thank you.", "sc.success.body": "Your application is in. Thank you for taking the time to apply.", "sc.home": "Return home"}, "es": {"sc.lbl.email": "Correo electrónico", "sc.lbl.firstName": "Nombre", "sc.lbl.lastName": "Apellidos", "sc.lbl.dob": "Fecha de nacimiento", "sc.lbl.platform": "Plataforma principal", "sc.lbl.country": "País", "sc.lbl.state": "Estado / Región", "sc.lbl.city": "Ciudad", "sc.lbl.instagram": "Usuario de Instagram", "sc.lbl.tiktok": "Usuario de TikTok", "sc.lbl.youtube": "Canal de YouTube", "sc.lbl.otherPlatform": "Otra plataforma", "sc.lbl.representedBy": "Representado por", "sc.lbl.notes": "¿Algo más?", "sc.lbl.link1": "publicación / vídeo 1", "sc.lbl.link2": "publicación / vídeo 2", "sc.lbl.link3": "publicación / vídeo 3", "sc.lbl.pictures": "Tus fotos", "sc.ph.email": "tu@correo.com", "sc.ph.state": "Estado, provincia o región", "sc.ph.city": "¿Dónde vives?", "sc.ph.handle": "tuusuario", "sc.ph.youtube": "@canal o URL", "sc.ph.otherPlatform": "p. ej., Substack, Twitch", "sc.ph.representedBy": "Agencia / representante", "sc.ph.country": "Selecciona tu país…", "sc.ph.select": "Selecciona…", "sc.eyebrow.you": "01 — Tú", "sc.h2.you": "Cuéntanos quién eres", "sc.eyebrow.work": "02 — Trabajo", "sc.h2.work": "Muéstranos tu trabajo", "sc.text.work": "Sube el contenido del que estés más orgulloso: unos enlaces o un media kit. Es opcional, pero ayuda a nuestro equipo a conocerte mejor.", "sc.sec.you": "Sobre ti", "sc.sec.work": "Tu trabajo", "sc.sec.consent": "Consentimiento y envío", "sc.legend.rep": "¿Tienes representación actualmente? *", "sc.yes": "Sí", "sc.no": "No", "sc.optional": "(opcional)", "sc.drop.upload": "+ Subir", "sc.drop.max": "≤ 10 MB", "sc.drop.toobig": "Los archivos deben pesar 10 MB o menos.", "sc.drop.another": "Toca para probar con otro", "sc.drop.again": "Toca para intentarlo de nuevo", "sc.drop.uploading": "Subiendo…", "sc.drop.remove": "Quitar", "sc.err.uploadnet": "Error al subir el archivo. Comprueba tu conexión.", "sc.err.upload": "Error al subir el archivo. Inténtalo de nuevo.", "sc.err.email": "Introduce una dirección de correo válida.", "sc.err.first": "El nombre es obligatorio.", "sc.err.last": "Los apellidos son obligatorios.", "sc.err.dob": "Introduce tu fecha de nacimiento.", "sc.err.age": "Debes tener {n} años o más para solicitar.", "sc.err.dobmatch": "Tu fecha de nacimiento no coincide con la edad que indicaste antes.", "sc.err.country": "Selecciona tu país.", "sc.err.platform": "Selecciona tu plataforma principal.", "sc.err.rep": "Dinos si tienes representación.", "sc.err.repby": "¿Quién te representa?", "sc.err.other": "Indica la plataforma.", "sc.err.links": "Introduce enlaces válidos (https://…).", "sc.err.consent": "Acepta para continuar.", "sc.err.turnstile": "Completa la verificación y luego envía.", "sc.err.fields": "Revisa los campos marcados.", "sc.err.rate": "Demasiados intentos. Inténtalo más tarde o escribe a {email}.", "sc.submit": "Enviar solicitud", "sc.submitting": "Enviando…", "sc.success.eyebrow": "Solicitud recibida", "sc.success.title": "Gracias.", "sc.success.body": "Tu solicitud ha sido enviada. Gracias por tomarte el tiempo de presentarla.", "sc.home": "Volver al inicio"}, "pt": {"sc.lbl.email": "E-mail", "sc.lbl.firstName": "Nome", "sc.lbl.lastName": "Sobrenome", "sc.lbl.dob": "Data de nascimento", "sc.lbl.platform": "Plataforma principal", "sc.lbl.country": "País", "sc.lbl.state": "Estado / Região", "sc.lbl.city": "Cidade", "sc.lbl.instagram": "Usuário do Instagram", "sc.lbl.tiktok": "Usuário do TikTok", "sc.lbl.youtube": "Canal do YouTube", "sc.lbl.otherPlatform": "Outra plataforma", "sc.lbl.representedBy": "Representado por", "sc.lbl.notes": "Mais alguma coisa?", "sc.lbl.link1": "publicação / vídeo 1", "sc.lbl.link2": "publicação / vídeo 2", "sc.lbl.link3": "publicação / vídeo 3", "sc.lbl.pictures": "Suas fotos", "sc.ph.email": "voce@email.com", "sc.ph.state": "Estado, província ou região", "sc.ph.city": "Onde você mora?", "sc.ph.handle": "seuusuario", "sc.ph.youtube": "@canal ou URL", "sc.ph.otherPlatform": "ex.: Substack, Twitch", "sc.ph.representedBy": "Agência / empresário", "sc.ph.country": "Selecione seu país…", "sc.ph.select": "Selecione…", "sc.eyebrow.you": "01 — Você", "sc.h2.you": "Conte quem você é", "sc.eyebrow.work": "02 — Trabalho", "sc.h2.work": "Mostre o seu trabalho", "sc.text.work": "Envie o conteúdo de que mais se orgulha: alguns links ou um media kit. É opcional, mas ajuda a nossa equipe a conhecer você melhor.", "sc.sec.you": "Sobre você", "sc.sec.work": "Seu trabalho", "sc.sec.consent": "Consentimento e envio", "sc.legend.rep": "Você tem representação atualmente? *", "sc.yes": "Sim", "sc.no": "Não", "sc.optional": "(opcional)", "sc.drop.upload": "+ Enviar", "sc.drop.max": "≤ 10 MB", "sc.drop.toobig": "Os arquivos devem ter no máximo 10 MB.", "sc.drop.another": "Toque para tentar outro", "sc.drop.again": "Toque para tentar novamente", "sc.drop.uploading": "Enviando…", "sc.drop.remove": "Remover", "sc.err.uploadnet": "Falha no envio. Verifique sua conexão.", "sc.err.upload": "Falha no envio. Tente novamente.", "sc.err.email": "Insira um e-mail válido.", "sc.err.first": "O nome é obrigatório.", "sc.err.last": "O sobrenome é obrigatório.", "sc.err.dob": "Insira sua data de nascimento.", "sc.err.age": "Você precisa ter {n} anos ou mais para se candidatar.", "sc.err.dobmatch": "Sua data de nascimento não corresponde à idade informada antes.", "sc.err.country": "Selecione seu país.", "sc.err.platform": "Selecione sua plataforma principal.", "sc.err.rep": "Diga se você tem representação.", "sc.err.repby": "Quem representa você?", "sc.err.other": "Informe a plataforma.", "sc.err.links": "Insira links válidos (https://…).", "sc.err.consent": "Aceite para continuar.", "sc.err.turnstile": "Conclua a verificação e depois envie.", "sc.err.fields": "Verifique os campos destacados.", "sc.err.rate": "Muitas tentativas. Tente novamente mais tarde ou escreva para {email}.", "sc.submit": "Enviar candidatura", "sc.submitting": "Enviando…", "sc.success.eyebrow": "Candidatura recebida", "sc.success.title": "Obrigado.", "sc.success.body": "Sua candidatura foi enviada. Obrigado por dedicar seu tempo.", "sc.home": "Voltar ao início"}, "fr": {"sc.lbl.email": "E-mail", "sc.lbl.firstName": "Prénom", "sc.lbl.lastName": "Nom", "sc.lbl.dob": "Date de naissance", "sc.lbl.platform": "Plateforme principale", "sc.lbl.country": "Pays", "sc.lbl.state": "État / Région", "sc.lbl.city": "Ville", "sc.lbl.instagram": "Identifiant Instagram", "sc.lbl.tiktok": "Identifiant TikTok", "sc.lbl.youtube": "Chaîne YouTube", "sc.lbl.otherPlatform": "Autre plateforme", "sc.lbl.representedBy": "Représenté par", "sc.lbl.notes": "Autre chose ?", "sc.lbl.link1": "publication / vidéo 1", "sc.lbl.link2": "publication / vidéo 2", "sc.lbl.link3": "publication / vidéo 3", "sc.lbl.pictures": "Vos photos", "sc.ph.email": "vous@email.com", "sc.ph.state": "État, province ou région", "sc.ph.city": "Où êtes-vous basé(e) ?", "sc.ph.handle": "votreidentifiant", "sc.ph.youtube": "@chaîne ou URL", "sc.ph.otherPlatform": "ex. : Substack, Twitch", "sc.ph.representedBy": "Agence / manager", "sc.ph.country": "Sélectionnez votre pays…", "sc.ph.select": "Sélectionnez…", "sc.eyebrow.you": "01 — Vous", "sc.h2.you": "Dites-nous qui vous êtes", "sc.eyebrow.work": "02 — Travail", "sc.h2.work": "Montrez-nous votre travail", "sc.text.work": "Partagez les contenus dont vous êtes le plus fier : quelques liens ou un kit média. Facultatif, mais cela aide notre équipe à mieux vous connaître.", "sc.sec.you": "À propos de vous", "sc.sec.work": "Votre travail", "sc.sec.consent": "Consentement et envoi", "sc.legend.rep": "Êtes-vous actuellement représenté(e) ? *", "sc.yes": "Oui", "sc.no": "Non", "sc.optional": "(facultatif)", "sc.drop.upload": "+ Importer", "sc.drop.max": "≤ 10 Mo", "sc.drop.toobig": "Les fichiers doivent faire 10 Mo ou moins.", "sc.drop.another": "Touchez pour en essayer un autre", "sc.drop.again": "Touchez pour réessayer", "sc.drop.uploading": "Envoi…", "sc.drop.remove": "Retirer", "sc.err.uploadnet": "Échec de l’envoi. Vérifiez votre connexion.", "sc.err.upload": "Échec de l’envoi. Veuillez réessayer.", "sc.err.email": "Saisissez une adresse e-mail valide.", "sc.err.first": "Le prénom est obligatoire.", "sc.err.last": "Le nom est obligatoire.", "sc.err.dob": "Saisissez votre date de naissance.", "sc.err.age": "Vous devez avoir {n} ans ou plus pour postuler.", "sc.err.dobmatch": "Votre date de naissance ne correspond pas à l’âge indiqué précédemment.", "sc.err.country": "Sélectionnez votre pays.", "sc.err.platform": "Sélectionnez votre plateforme principale.", "sc.err.rep": "Indiquez si vous êtes représenté(e).", "sc.err.repby": "Qui vous représente ?", "sc.err.other": "Indiquez la plateforme.", "sc.err.links": "Saisissez des liens valides (https://…).", "sc.err.consent": "Veuillez accepter pour continuer.", "sc.err.turnstile": "Veuillez terminer la vérification, puis envoyer.", "sc.err.fields": "Veuillez vérifier les champs signalés.", "sc.err.rate": "Trop de tentatives. Réessayez plus tard ou écrivez à {email}.", "sc.submit": "Envoyer ma candidature", "sc.submitting": "Envoi…", "sc.success.eyebrow": "Candidature reçue", "sc.success.title": "Merci.", "sc.success.body": "Votre candidature est envoyée. Merci d’avoir pris le temps de postuler.", "sc.home": "Retour à l’accueil"}};
  var __I = window.__thxI18n; if (__I) { for (var __lc in SCD) __I.add(__lc, SCD[__lc]); }
  function T(k, v) { if (__I && __I.t) return __I.t(k, v); var s = SCD.en[k] || k; if (v) for (var p in v) s = s.split('{' + p + '}').join(v[p]); return s; }

  /* config */
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
  var INTRO_PHOTO = 'https://cdn.prod.website-files.com/69fe0aaad9f3034241913693/6a3da3923fccf3c9841f855a_theodyx-scouting-hero.jpg';

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
  function ageFromDob(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); if (!m) return null; var d = new Date(+m[1], +m[2] - 1, +m[3]); if (isNaN(d.getTime())) return null; var t = new Date(), a = t.getFullYear() - d.getFullYear(), mo = t.getMonth() - d.getMonth(); if (mo < 0 || (mo === 0 && t.getDate() < d.getDate())) a--; return a; }
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
    ph.value = ''; ph.textContent = T('sc.ph.country'); ph.disabled = true; ph.selected = true;
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
    ph.value = ''; ph.textContent = T('sc.ph.select'); ph.disabled = true; ph.selected = true;
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
      gates.ageResolved = true; persistGates();
      if (window.__thxTrack) window.__thxTrack(gates.eligible ? 'age_eligible' : 'age_ineligible', null, true);
      applyGateState();
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
      xhr.onerror = function () { resolve({ ok: false, error: T('sc.err.uploadnet') }); };
      xhr.send(file);
    });
  }
  function uploadErr(code) {
    if (code === 'too_large') return 'That file is over 10 MB. Try a smaller one.';
    if (code === 'unsupported_type') return 'That file type isn’t supported.';
    return T('sc.err.upload');
  }

  function setDropState(drop, html) { if (drop) drop.innerHTML = html; }
  function idleDropHTML(drop) {
    var main = drop.getAttribute('data-main') || T('sc.drop.upload');
    return '<span class="sc-drop-main">' + main + '</span><span class="sc-drop-sub">' + T('sc.drop.max') + '</span>';
  }

  function wireDrop(dropId, accept, onKey) {
    var drop = $(dropId); if (!drop || drop.dataset.thxWired) return;
    drop.dataset.thxWired = '1';
    drop.setAttribute('role', 'button'); drop.setAttribute('tabindex', '0');
    drop.setAttribute('aria-label', (drop.getAttribute('data-main') || 'Upload') + ' — file upload');
    if (!drop.innerHTML.trim()) setDropState(drop, idleDropHTML(drop));
    var input = document.createElement('input');
    input.type = 'file'; input.accept = accept; input.style.display = 'none';
    drop.appendChild(input);
    function reset() { drop.classList.remove('is-done'); setDropState(drop, idleDropHTML(drop)); drop.appendChild(input); onKey(undefined); }
    on(drop, 'click', function (e) { if (e.target && e.target.getAttribute && e.target.getAttribute('data-remove') === '1') { e.stopPropagation(); reset(); return; } input.click(); });
    on(drop, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { if (e.target && e.target.getAttribute && e.target.getAttribute('data-remove') === '1') return; e.preventDefault(); input.click(); } });
    on(input, 'change', function () {
      var file = input.files && input.files[0]; if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) { drop.classList.add('is-error'); setDropState(drop, '<span class="sc-drop-main" style="color:#8A1F1B">' + T('sc.drop.toobig') + '</span><span class="sc-drop-sub">' + T('sc.drop.another') + '</span>'); return; }
      drop.classList.remove('is-error');
      setDropState(drop, '<span class="sc-drop-main">' + T('sc.drop.uploading') + ' <b class="sc-pct">0%</b></span><span class="sc-drop-sub">' + escapeHtml(file.name) + '</span>');
      uploadFile(file, function (pct) { var p = qs('.sc-pct', drop); if (p) p.textContent = pct + '%'; }).then(function (res) {
        if (res.ok) {
          drop.classList.add('is-done');
          setDropState(drop, '<span class="sc-drop-main">✓ ' + escapeHtml(file.name) + '</span><span class="sc-drop-sub"><a href="#" data-remove="1" class="sc-drop-remove">' + T('sc.drop.remove') + '</a></span>');
          onKey(res.key);
        } else {
          drop.classList.add('is-error');
          setDropState(drop, '<span class="sc-drop-main" style="color:#8A1F1B">' + escapeHtml(res.error) + '</span><span class="sc-drop-sub">' + T('sc.drop.again') + '</span>');
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
  function clearErr() { var box = $('sc-err'); if (box) { box.style.display = 'none'; box.textContent = ''; } qsa('.sc-input--error').forEach(function (e) { e.classList.remove('sc-input--error'); e.removeAttribute('aria-invalid'); }); }
  function showErr(msg, firstBadId) {
    var box = $('sc-err');
    if (box) { box.textContent = msg; box.style.display = 'block'; }
    if (firstBadId) { var e = $(firstBadId); if (e) { e.scrollIntoView({ behavior: 'smooth', block: 'center' }); try { e.focus(); } catch (x) {} } }
  }
  function markBad(id) { var e = $(id); if (e) { e.classList.add('sc-input--error'); e.setAttribute('aria-invalid', 'true'); } }

  /* -------------------------------------------------------------- submit */
  function collectAndValidate() {
    clearErr();
    var errs = [];
    function need(id, msg) { var v = val(id); if (!v) { markBad(id); errs.push([id, msg]); } return v; }

    var email = val('sc-email');
    if (!isEmail(email)) { markBad('sc-email'); errs.push(['sc-email', T('sc.err.email')]); }
    var firstName = need('sc-firstName', T('sc.err.first'));
    var lastName = need('sc-lastName', T('sc.err.last'));
    var dob = val('sc-dob');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) { markBad('sc-dob'); errs.push(['sc-dob', T('sc.err.dob')]); }
    else { var dobAge = ageFromDob(dob);
      if (dobAge != null && dobAge < MIN_AGE) { markBad('sc-dob'); errs.push(['sc-dob', T('sc.err.age', { n: MIN_AGE })]); }
      else if (dobAge != null && gates.age != null && Math.abs(dobAge - gates.age) > 1) { markBad('sc-dob'); errs.push(['sc-dob', T('sc.err.dobmatch')]); }
    }
    var country = val('sc-country'); if (!country) { markBad('sc-country'); errs.push(['sc-country', T('sc.err.country')]); }
    var city = val('sc-city'); // optional
    var platform = val('sc-platform'); if (!platform) { markBad('sc-platform'); errs.push(['sc-platform', T('sc.err.platform')]); }
    var rep = currentRepresented(); if (rep !== 'yes' && rep !== 'no') { errs.push(['sc-rep', T('sc.err.rep')]); }
    var representedBy = val('sc-representedBy');
    if (rep === 'yes' && !representedBy) { markBad('sc-representedBy'); errs.push(['sc-representedBy', T('sc.err.repby')]); }
    var otherPlatform = val('sc-otherPlatform');
    if (platform === 'other' && !otherPlatform) { markBad('sc-otherPlatform'); errs.push(['sc-otherPlatform', T('sc.err.other')]); }

    var links = ['sc-link1', 'sc-link2', 'sc-link3'].map(val).filter(Boolean);
    for (var i = 0; i < links.length; i++) { if (!isUrl(links[i])) { errs.push(['sc-link1', T('sc.err.links')]); break; } }

    var consent = $('sc-consent'); if (!consent || !consent.checked) { errs.push(['sc-consent', T('sc.err.consent')]); }
    if (!turnstileToken) { errs.push(['sc-turnstile', T('sc.err.turnstile')]); }

    if (errs.length) { showErr(errs[0][1], errs[0][0].indexOf('sc-rep') === 0 ? null : errs[0][0]); return null; }

    var payload = {
      email: email, firstName: firstName, lastName: lastName, dob: dob,
      ageConfirmed: true,
      country: country,
      primaryPlatform: platform,
      represented: rep === 'yes',
      consent: true,
      turnstileToken: turnstileToken,
      company: ''
    };
    var state = val('sc-state'); if (state) payload.state = state;
    if (city) payload.city = city;
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
    btn.textContent = b ? T('sc.submitting') : (btn.getAttribute('data-label') || T('sc.submit'));
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
          showErr(first ? data.fieldErrors[first] : T('sc.err.fields'), id);
        } else if (data && data.error === 'turnstile') {
          turnstileToken = ''; if (window.turnstile) try { window.turnstile.reset(); } catch (e) {}
          showErr('Please complete the verification, then submit.', 'sc-turnstile');
        } else if (data && data.error === 'rate_limited') {
          showErr(T('sc.err.rate', { email: SCOUTING_EMAIL }));
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
    if (success) { show(success, 'flex'); var hh = qs('.sc-success-title', success); if (hh) { try { hh.focus(); } catch (e) {} } }
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
      '.sc-select{background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'><path d=\'M1 1l5 5 5-5\' stroke=\'%230E0E0F\' fill=\'none\' stroke-width=\'1.4\'/></svg>");background-repeat:no-repeat;background-position:right 2px center;--sc-arrow:1;padding-inline-end:20px;}',
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
      '[dir="rtl"] .sc-select{background-position:left 2px center;}',
      '.sc-drop-sub{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:10px;color:var(--sc-mute);}',
      '.sc-drop-remove{color:var(--sc-ink);text-decoration:underline;text-underline-offset:2px;}',
      '.sc-consent{display:flex;align-items:flex-start;gap:12px;cursor:pointer;}',
      '.sc-check{margin-top:3px;width:18px;height:18px;flex:0 0 auto;accent-color:var(--sc-ink);}',
      '.sc-consent-text{font-size:15px;line-height:1.6;}',
      '.sc-consent-text a{color:var(--sc-ink);text-decoration:underline;text-underline-offset:2px;}',
      '#sc-turnstile{margin-top:28px;}',
      '.sc-err{display:none;margin-top:22px;border-inline-start:2px solid var(--sc-err);padding-inline-start:16px;color:var(--sc-err);font-size:15px;line-height:1.5;}',
      '.sc-submit{margin-top:28px;width:100%;max-width:420px;display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--sc-ink);color:var(--sc-paper);border:1px solid var(--sc-ink);padding:18px 28px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:all .16s ease;}',
      '.sc-submit:hover:not(:disabled){background:var(--sc-paper);color:var(--sc-ink);}',
      '.sc-submit:disabled{opacity:.6;cursor:default;}',
      '.sc-note{margin-top:14px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;color:var(--sc-mute);}',
      '.sc-honey{position:absolute;inset-inline-start:-9999px;width:1px;height:1px;overflow:hidden;}',
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
      '.sc-gate-field{max-width:300px;margin:36px auto 0;text-align:start;}',
      '.sc-gate-field .sc-label{color:var(--sc-paper);}',
      '#sc-age-select{color:var(--sc-paper);border-bottom-color:var(--sc-hair-ink);}',
      '#sc-age-select option{color:#111;}',
      '#sc-gate-u14{display:none;}',
      '#sc-success .sc-gate-inner{min-height:70vh;display:flex;flex-direction:column;justify-content:center;}',
      '.sc-success-title{font-family:"Objectivity","Archivo",sans-serif;font-weight:800;font-size:clamp(40px,7vw,96px);line-height:1;margin:0;}',
      /* ---- v1.2.0 editorial pass: charcoal hero, no ghost, black headings, more air ---- */
      /* Hero: short charcoal band, thin uppercase wordmark, drop the giant THEODYX ghost */
      '.sc-hero{background:#000000!important;min-height:0!important;height:auto!important;display:flex!important;align-items:flex-end!important;padding:clamp(80px,11vw,128px) clamp(22px,6vw,72px) clamp(56px,7vw,84px)!important;}',
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
      '@media(max-width:767px){.sc-qr-wrap,.sc-qr,#sc-qr,.sc-qr-cap{display:none!important;}}',
      /* remove the "Theodyx · Scouting" / "01 — You" / "02 — Work" eyebrow+bar labels */
      '.sc-eyebrow{display:none!important;}',
      /* consent text was rendering white on cream */
      '.sc-consent-text,.sc-consent-text *{color:var(--sc-ink)!important;}',
      /* success "Return home" button (anchor styled as gate button) */
      '.sc-home-btn{display:inline-block;text-decoration:none!important;margin-top:clamp(28px,4vw,44px);}'
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
'<section id="sc-form-you" class="sc-section sc-app-sans" aria-label="'+T('sc.sec.you')+'"><div class="sc-eyebrow">'+T('sc.eyebrow.you')+'</div><h2 class="sc-h2">'+T('sc.h2.you')+'</h2><form class="sc-form" novalidate><div class="sc-grid"><div class="sc-field sc-full"><label class="sc-label" for="sc-email">'+T('sc.lbl.email')+'</label><input id="sc-email" class="sc-input" type="email" autocomplete="email" inputmode="email" placeholder="'+T('sc.ph.email')+'"></div><div class="sc-field"><label class="sc-label" for="sc-firstName">'+T('sc.lbl.firstName')+'</label><input id="sc-firstName" class="sc-input" type="text" autocomplete="given-name"></div><div class="sc-field"><label class="sc-label" for="sc-lastName">'+T('sc.lbl.lastName')+'</label><input id="sc-lastName" class="sc-input" type="text" autocomplete="family-name"></div><div class="sc-field"><label class="sc-label" for="sc-dob">'+T('sc.lbl.dob')+'</label><input id="sc-dob" class="sc-input" type="date"></div><div class="sc-field"><label class="sc-label" for="sc-platform">'+T('sc.lbl.platform')+'</label><select id="sc-platform" class="sc-select"></select></div><div class="sc-field"><label class="sc-label" for="sc-country">'+T('sc.lbl.country')+'</label><select id="sc-country" class="sc-select"></select></div><div class="sc-field"><label class="sc-label" for="sc-state">'+T('sc.lbl.state')+'</label><input id="sc-state" class="sc-input" type="text" autocomplete="address-level1" placeholder="'+T('sc.ph.state')+'"></div><div class="sc-field"><label class="sc-label" for="sc-city">'+T('sc.lbl.city')+'</label><input id="sc-city" class="sc-input" type="text" autocomplete="address-level2" placeholder="'+T('sc.ph.city')+'"></div><div class="sc-field"><label class="sc-label" for="sc-instagram">'+T('sc.lbl.instagram')+'</label><input id="sc-instagram" class="sc-input" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="'+T('sc.ph.handle')+'"></div><div class="sc-field"><label class="sc-label" for="sc-tiktok">'+T('sc.lbl.tiktok')+'</label><input id="sc-tiktok" class="sc-input" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="'+T('sc.ph.handle')+'"></div><div class="sc-field"><label class="sc-label" for="sc-youtube">'+T('sc.lbl.youtube')+'</label><input id="sc-youtube" class="sc-input" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="'+T('sc.ph.youtube')+'"></div><div class="sc-field" id="sc-other-wrap"><label class="sc-label" for="sc-otherPlatform">'+T('sc.lbl.otherPlatform')+'</label><input id="sc-otherPlatform" class="sc-input" type="text" placeholder="'+T('sc.ph.otherPlatform')+'"><label class="sc-label sc-label--stack" for="sc-otherHandle">Handle on that platform</label><input id="sc-otherHandle" class="sc-input" type="text"></div><div class="sc-field sc-full" id="sc-rep"><span class="sc-legend">'+T('sc.legend.rep')+'</span><div class="sc-chips"><button type="button" class="sc-chip" data-val="no" data-on="false" aria-pressed="false">'+T('sc.no')+'</button><button type="button" class="sc-chip" data-val="yes" data-on="false" aria-pressed="false">'+T('sc.yes')+'</button></div></div><div class="sc-field sc-full" id="sc-representedBy-wrap"><label class="sc-label" for="sc-representedBy">'+T('sc.lbl.representedBy')+'</label><input id="sc-representedBy" class="sc-input" type="text" placeholder="'+T('sc.ph.representedBy')+'"></div><div class="sc-field sc-full"><label class="sc-label" for="sc-notes">'+T('sc.lbl.notes')+'</label><textarea id="sc-notes" class="sc-textarea" rows="4" placeholder="Anything we should know? (optional)"></textarea></div></div></form></section>',
'<section id="sc-form-work" class="sc-section sc-app-sans" aria-label="'+T('sc.sec.work')+'"><div class="sc-eyebrow">'+T('sc.eyebrow.work')+'</div><h2 class="sc-h2">'+T('sc.h2.work')+'</h2><p class="sc-text">'+T('sc.text.work')+'</p><form class="sc-form" novalidate><div class="sc-grid3"><div class="sc-field"><label class="sc-label" for="sc-link1">'+T('sc.lbl.link1')+'</label><input id="sc-link1" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div><div class="sc-field"><label class="sc-label" for="sc-link2">'+T('sc.lbl.link2')+'</label><input id="sc-link2" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div><div class="sc-field"><label class="sc-label" for="sc-link3">'+T('sc.lbl.link3')+'</label><input id="sc-link3" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div></div><div class="sc-block"><label class="sc-label">Media kit (PDF) <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-mediakit" class="sc-drop sc-drop--kit" data-main="+ Upload PDF"></div></div><div class="sc-block--divider"><p class="sc-label">Your pictures</p><p class="sc-text sc-pics-note">Keep these natural — please avoid baggy clothing, make-up, or smiling. The photos you submit shouldn’t be filtered, re-touched, or professionally taken.</p><div class="sc-grid3"><div class="sc-field"><label class="sc-label">Headshot <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-pic0" class="sc-drop" data-main="+ Add image"></div></div><div class="sc-field"><label class="sc-label">Profile <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-pic1" class="sc-drop" data-main="+ Add image"></div></div><div class="sc-field"><label class="sc-label">Full length <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-pic2" class="sc-drop" data-main="+ Add image"></div></div></div></div></form></section>',
'<section id="sc-form-consent" class="sc-section sc-app-sans" aria-label="'+T('sc.sec.consent')+'"><form class="sc-form" novalidate><label class="sc-consent" for="sc-consent"><input id="sc-consent" class="sc-check" type="checkbox"><span class="sc-consent-text">I agree to Theodyx’s <a href="https://www.theodyx.com/resources/legal/legal#privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and consent to be contacted about representation. I understand this is an application, not an offer of representation.</span></label><div class="sc-honey" aria-hidden="true"><label for="sc-company">Company</label><input id="sc-company" name="company" type="text" tabindex="-1" autocomplete="off"></div><div id="sc-turnstile"></div><div id="sc-err" class="sc-err" role="alert"></div><button id="sc-submit" type="button" class="sc-submit">'+T('sc.submit')+'</button></form></section>',
'<section id="sc-gate-u14" class="sc-section sc-app-sans" aria-label="A note"><div class="sc-eyebrow">A note</div><h2 class="sc-h2">Thank you for your interest in joining Theodyx.</h2><p class="sc-text">We are invested in protecting the privacy of our applicants. For this reason, we are unfortunately unable to accept applications from anyone under 14 at this time. We look forward to receiving your future application.</p></section>'
  ];
  var FRAG_BODY = [
'<div id="sc-gate-safety" role="dialog" aria-modal="true" aria-label="Safety"><div class="sc-gate-inner"><span class="sc-gate-eyebrow">Theodyx — Safety</span><h2 class="sc-gate-h">Your safety comes first.</h2><p class="sc-gate-body">Safety is our top priority. Protecting aspiring creatives — including young individuals — from online predators is of the utmost importance. If you would like to confirm an email or communication is from an official Theodyx representative or affiliate, email <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a> and we will be glad to confirm. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</p><button id="sc-gate-safety-ok" type="button" class="sc-gate-btn">Acknowledged</button></div></div>',
'<div id="sc-gate-age" role="dialog" aria-modal="true" aria-label="Age"><form class="sc-form sc-gate-inner sc-gate-inner--center" novalidate><span class="sc-gate-eyebrow">One quick question</span><h2 class="sc-gate-h">How old are you?</h2><div class="sc-gate-field"><label class="sc-label" for="sc-age-select">Select your age</label><select id="sc-age-select" class="sc-select"></select></div><button id="sc-gate-age-go" type="button" class="sc-gate-btn" disabled>Continue</button><p class="sc-gate-note">You must be 14 or older to apply directly.</p></form></div>',
'<div id="sc-success" role="dialog" aria-live="polite" aria-label="'+T('sc.success.eyebrow')+'"><div class="sc-gate-inner"><span class="sc-gate-eyebrow">'+T('sc.success.eyebrow')+'</span><h2 class="sc-success-title" tabindex="-1">'+T('sc.success.title')+'</h2><p class="sc-gate-body">'+T('sc.success.body')+'</p><a href="/" class="sc-gate-btn sc-home-btn">'+T('sc.home')+'</a></div></div>'
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

  /* Pull the site-wide footer (built on other pages but not on this native page)
   * from the home page and append it so /scouting has the full website footer. */
  function ensureFooter() {
    if (qs('footer.footer') || document.body.dataset.thxFoot) return;
    document.body.dataset.thxFoot = '1';
    fetch('/', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
      if (!html || qs('footer.footer')) return;
      try {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var f = doc.querySelector('footer.footer');
        if (f) (qs('.sc-page') || document.body).appendChild(document.importNode(f, true));
      } catch (e) {}
    }).catch(function () {});
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    injectCSS();
    ensureDom();
    enhanceIntro();
    ensureFooter();
    fillCountries(); fillPlatforms(); fillAges();
    var dobIn = $('sc-dob'); if (dobIn && !dobIn.max) { var ty = new Date(); dobIn.max = (ty.getFullYear() - MIN_AGE) + '-' + String(ty.getMonth() + 1).padStart(2, '0') + '-' + String(ty.getDate()).padStart(2, '0'); dobIn.min = (ty.getFullYear() - 100) + '-01-01'; }
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
