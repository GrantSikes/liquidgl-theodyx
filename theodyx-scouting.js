/* theodyx-scouting 2.2.0 — age verification, restored. The owner's call overrides the Phase 10
 * decision that retired the gates: nobody reaches the application form without first confirming a
 * date of birth. One centred dialog goes up in the same synchronous task this script starts in —
 * role="dialog" aria-modal="true", labelled by its own heading, focus trapped, Escape deliberately
 * unbound (an age check is not dismissible), every other <body> child `inert`, the page scroll
 * locked, and html.sc-gated hiding the three form sections so there is no flash of an un-gated
 * form. The dialog states the safety statement verbatim (cloned from the page's own copy) above the
 * date field, so nobody answers the question without having read it. 14+ closes the dialog, carries
 * the date into #sc-dob and emits age_eligible + age_acknowledged; under 14 emits age_ineligible and
 * lands in the existing html.sc-u14 state, whose "Update your date of birth" button re-opens the
 * dialog rather than unlocking an unguarded form; an empty or impossible date is explained inline in
 * a role="status" node and nothing moves. A pass is stored in the session (SS_GATES.gatePassed), so
 * a reload does not re-ask and a new session does. Entrance is transform/opacity only, 240 ms on the
 * house curve, and prefers-reduced-motion drops it; forced-colors gets system colours.
 * Everything Phase 10 and Phase 11 built is untouched: the inline safety section and its required
 * acknowledgement checkbox both stay (the gate is in addition to them, not instead of them), the
 * single window.__thxTrack data layer, the offer above the fold, drag-and-drop uploads, the explicit
 * !important transitions, the QR-on-success loader.
 * 2.1.1/2.1.2: EASE-10 - the intro photo's grayscale-to-colour hover eases over --thx-dur-base on the house curve instead of 550 ms ease (filter repaints the whole element; 550 ms sat over the UI ceiling). !important because the page's own <style id="sc-native-css"> embed (body, later in the cascade) restates the 550 ms rule.
 * 2.1.0 — Phase 11 motion. EASE-03: no control transitions `all` any more —
 * the chips, the submit, the gate/consent buttons, the inputs and the dropzones each name the
 * properties their own state rules change (transform/opacity, plus colour where colour IS the
 * feedback) on one spring token, --sc-ease: cubic-bezier(.22,1,.36,1), at 140-160 ms; no layout
 * and no shadow property is scheduled. ACT-04: the upload zones are real drop targets —
 * dragenter/dragover/dragleave/drop with an .is-over treatment (tint + border + a 1.5% scale),
 * and a dropped file runs the identical accept/10 MB/status-announcement path as the picker;
 * click and keyboard still open the picker. prefers-reduced-motion drops the movement, and
 * forced-colors gets a Highlight outline for the drag state.
 * 2.0.1 — Phase 10 campaign readiness. The two full-screen modal gates were retired here (2.2.0
 * brings the age one back, as a single dialog):
 * the safety statement is an inline <section id="sc-safety"> above the form and its acknowledgement
 * is a required checkbox in the consent block; age comes from #sc-dob, evaluated on blur and
 * on submit, so a mistyped date is always correctable (FORMS-04). The first viewport now carries the
 * offer — eyebrow, headline, one sentence and a CTA — instead of a black overlay (LAND-01), and
 * Every funnel event goes through the site
 * head's window.__thxTrack, the single data layer (INST-02/03/04/06, FORMS-02, UTM-02/04), and the
 * submission carries session + landingPath + utm so a paid click can be credited (UTM-05).
 * Phase 9 accessibility is preserved throughout: error summary, aria-invalid/aria-describedby,
 * required + autocomplete, chip group, upload buttons with status, Turnstile fallback. */
(function () {
  'use strict';
  if (window.__thxScouting) return;
  window.__thxScouting = true;
  /* theodyx-scouting i18n (Phase 6): every user-facing string goes through T(); dictionaries (en/es/pt/fr) register with the site locale runtime, keyed by <html lang>. sc.safety.body carries the same English sentence in all four dictionaries on purpose: it is legal safety copy and is translated by people, not scripts — the key exists in every locale so a human translation drops straight in. */
  var SCD = {"en": {"sc.lbl.email": "Email", "sc.lbl.firstName": "First name", "sc.lbl.lastName": "Last name", "sc.lbl.dob": "Date of birth", "sc.lbl.platform": "Primary platform", "sc.lbl.country": "Country", "sc.lbl.state": "State / Region", "sc.lbl.city": "City", "sc.lbl.instagram": "Instagram handle", "sc.lbl.tiktok": "TikTok handle", "sc.lbl.youtube": "YouTube channel", "sc.lbl.otherPlatform": "Other platform", "sc.lbl.representedBy": "Represented by", "sc.lbl.notes": "Anything else?", "sc.lbl.link1": "post / video 1", "sc.lbl.link2": "post / video 2", "sc.lbl.link3": "post / video 3", "sc.lbl.pictures": "Your pictures", "sc.ph.email": "you@email.com", "sc.ph.state": "State, province, or region", "sc.ph.city": "Where are you based?", "sc.ph.handle": "yourhandle", "sc.ph.youtube": "@channel or URL", "sc.ph.otherPlatform": "e.g. Substack, Twitch", "sc.ph.representedBy": "Agency / manager", "sc.ph.country": "Select your country…", "sc.ph.select": "Select…", "sc.eyebrow.you": "01 — You", "sc.h2.you": "Tell us who you are", "sc.eyebrow.work": "02 — Work", "sc.h2.work": "Show us your work", "sc.text.work": "Upload the media you’re proudest of — a few links, or a media kit. Optional, but it helps our team get to know you better.", "sc.sec.you": "About you", "sc.sec.work": "Your work", "sc.sec.consent": "Consent and submit", "sc.legend.rep": "Are you currently represented? *", "sc.yes": "Yes", "sc.no": "No", "sc.optional": "(optional)", "sc.drop.upload": "+ Upload", "sc.drop.max": "≤ 10 MB", "sc.drop.toobig": "Files must be 10 MB or smaller.", "sc.drop.another": "Tap to try another", "sc.drop.again": "Tap to try again", "sc.drop.uploading": "Uploading…", "sc.drop.remove": "Remove", "sc.err.uploadnet": "Upload failed. Check your connection.", "sc.err.upload": "Upload failed. Please try again.", "sc.err.email": "Enter a valid email address.", "sc.err.first": "First name is required.", "sc.err.last": "Last name is required.", "sc.err.dob": "Enter your date of birth.", "sc.err.age": "You must be {n} or older to apply.", "sc.err.dobmatch": "Your date of birth doesn’t match the age you gave earlier.", "sc.err.country": "Select your country.", "sc.err.platform": "Select your main platform.", "sc.err.rep": "Let us know if you’re represented.", "sc.err.repby": "Who represents you?", "sc.err.other": "Name the platform.", "sc.err.links": "Enter valid links (https://…).", "sc.err.consent": "Please agree to continue.", "sc.err.turnstile": "Please complete the verification, then submit.", "sc.err.fields": "Please check the highlighted fields.", "sc.err.rate": "Too many attempts. Please try again later, or email {email}.", "sc.submit": "Submit application", "sc.submitting": "Submitting…", "sc.success.eyebrow": "Application received", "sc.success.title": "Thank you.", "sc.success.body": "Your application is in. Thank you for taking the time to apply.", "sc.home": "Return home", "sc.req.note": "Fields marked * are required.", "sc.err.summary": "Please fix the following:", "sc.qr.label": "Scan to continue this application on your phone", "sc.ts.label": "Verification", "sc.err.tsfallback": "Verification isn’t available in this browser — email {email} and we’ll take your application by email.", "sc.a11y.uploading": "Uploading {name} — {pct}%", "sc.a11y.uploaded": "{name} uploaded.", "sc.a11y.removed": "File removed.", "sc.a11y.removeFile": "Remove {name}", "sc.hero.eyebrow": "For creators", "sc.hero.sub": "Theodyx is scouting the next class of creators. Every application is read by a person — and there are no fees, ever.", "sc.hero.cta": "Apply to be scouted", "sc.safety.eyebrow": "Theodyx — Safety", "sc.safety.title": "Your safety comes first.", "sc.safety.body": "Safety is our top priority. Protecting aspiring creatives — including young individuals — from online predators is of the utmost importance. If you would like to confirm an email or communication is from an official Theodyx representative or affiliate, email scouting@theodyx.com and we will be glad to confirm. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at scouting@theodyx.com.", "sc.safety.ack": "I have read the safety statement", "sc.err.safety": "Please confirm you have read the safety statement.", "sc.u14.change": "Update your date of birth"}, "es": {"sc.lbl.email": "Correo electrónico", "sc.lbl.firstName": "Nombre", "sc.lbl.lastName": "Apellidos", "sc.lbl.dob": "Fecha de nacimiento", "sc.lbl.platform": "Plataforma principal", "sc.lbl.country": "País", "sc.lbl.state": "Estado / Región", "sc.lbl.city": "Ciudad", "sc.lbl.instagram": "Usuario de Instagram", "sc.lbl.tiktok": "Usuario de TikTok", "sc.lbl.youtube": "Canal de YouTube", "sc.lbl.otherPlatform": "Otra plataforma", "sc.lbl.representedBy": "Representado por", "sc.lbl.notes": "¿Algo más?", "sc.lbl.link1": "publicación / vídeo 1", "sc.lbl.link2": "publicación / vídeo 2", "sc.lbl.link3": "publicación / vídeo 3", "sc.lbl.pictures": "Tus fotos", "sc.ph.email": "tu@correo.com", "sc.ph.state": "Estado, provincia o región", "sc.ph.city": "¿Dónde vives?", "sc.ph.handle": "tuusuario", "sc.ph.youtube": "@canal o URL", "sc.ph.otherPlatform": "p. ej., Substack, Twitch", "sc.ph.representedBy": "Agencia / representante", "sc.ph.country": "Selecciona tu país…", "sc.ph.select": "Selecciona…", "sc.eyebrow.you": "01 — Tú", "sc.h2.you": "Cuéntanos quién eres", "sc.eyebrow.work": "02 — Trabajo", "sc.h2.work": "Muéstranos tu trabajo", "sc.text.work": "Sube el contenido del que estés más orgulloso: unos enlaces o un media kit. Es opcional, pero ayuda a nuestro equipo a conocerte mejor.", "sc.sec.you": "Sobre ti", "sc.sec.work": "Tu trabajo", "sc.sec.consent": "Consentimiento y envío", "sc.legend.rep": "¿Tienes representación actualmente? *", "sc.yes": "Sí", "sc.no": "No", "sc.optional": "(opcional)", "sc.drop.upload": "+ Subir", "sc.drop.max": "≤ 10 MB", "sc.drop.toobig": "Los archivos deben pesar 10 MB o menos.", "sc.drop.another": "Toca para probar con otro", "sc.drop.again": "Toca para intentarlo de nuevo", "sc.drop.uploading": "Subiendo…", "sc.drop.remove": "Quitar", "sc.err.uploadnet": "Error al subir el archivo. Comprueba tu conexión.", "sc.err.upload": "Error al subir el archivo. Inténtalo de nuevo.", "sc.err.email": "Introduce una dirección de correo válida.", "sc.err.first": "El nombre es obligatorio.", "sc.err.last": "Los apellidos son obligatorios.", "sc.err.dob": "Introduce tu fecha de nacimiento.", "sc.err.age": "Debes tener {n} años o más para solicitar.", "sc.err.dobmatch": "Tu fecha de nacimiento no coincide con la edad que indicaste antes.", "sc.err.country": "Selecciona tu país.", "sc.err.platform": "Selecciona tu plataforma principal.", "sc.err.rep": "Dinos si tienes representación.", "sc.err.repby": "¿Quién te representa?", "sc.err.other": "Indica la plataforma.", "sc.err.links": "Introduce enlaces válidos (https://…).", "sc.err.consent": "Acepta para continuar.", "sc.err.turnstile": "Completa la verificación y luego envía.", "sc.err.fields": "Revisa los campos marcados.", "sc.err.rate": "Demasiados intentos. Inténtalo más tarde o escribe a {email}.", "sc.submit": "Enviar solicitud", "sc.submitting": "Enviando…", "sc.success.eyebrow": "Solicitud recibida", "sc.success.title": "Gracias.", "sc.success.body": "Tu solicitud ha sido enviada. Gracias por tomarte el tiempo de presentarla.", "sc.home": "Volver al inicio", "sc.req.note": "Los campos marcados con * son obligatorios.", "sc.err.summary": "Corrige lo siguiente:", "sc.qr.label": "Escanea para continuar esta solicitud en tu teléfono", "sc.ts.label": "Verificación", "sc.err.tsfallback": "La verificación no está disponible en este navegador: escribe a {email} y recibiremos tu solicitud por correo.", "sc.a11y.uploading": "Subiendo {name}: {pct}%", "sc.a11y.uploaded": "{name} se ha subido.", "sc.a11y.removed": "Archivo eliminado.", "sc.a11y.removeFile": "Quitar {name}", "sc.hero.eyebrow": "Para creadores", "sc.hero.sub": "Theodyx está buscando a la próxima generación de creadores. Cada solicitud la lee una persona, y nunca hay comisiones.", "sc.hero.cta": "Solicita ser descubierto", "sc.safety.eyebrow": "Theodyx — Seguridad", "sc.safety.title": "Tu seguridad es lo primero.", "sc.safety.body": "Safety is our top priority. Protecting aspiring creatives — including young individuals — from online predators is of the utmost importance. If you would like to confirm an email or communication is from an official Theodyx representative or affiliate, email scouting@theodyx.com and we will be glad to confirm. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at scouting@theodyx.com.", "sc.safety.ack": "He leído la declaración de seguridad", "sc.err.safety": "Confirma que has leído la declaración de seguridad.", "sc.u14.change": "Actualiza tu fecha de nacimiento"}, "pt": {"sc.lbl.email": "E-mail", "sc.lbl.firstName": "Nome", "sc.lbl.lastName": "Sobrenome", "sc.lbl.dob": "Data de nascimento", "sc.lbl.platform": "Plataforma principal", "sc.lbl.country": "País", "sc.lbl.state": "Estado / Região", "sc.lbl.city": "Cidade", "sc.lbl.instagram": "Usuário do Instagram", "sc.lbl.tiktok": "Usuário do TikTok", "sc.lbl.youtube": "Canal do YouTube", "sc.lbl.otherPlatform": "Outra plataforma", "sc.lbl.representedBy": "Representado por", "sc.lbl.notes": "Mais alguma coisa?", "sc.lbl.link1": "publicação / vídeo 1", "sc.lbl.link2": "publicação / vídeo 2", "sc.lbl.link3": "publicação / vídeo 3", "sc.lbl.pictures": "Suas fotos", "sc.ph.email": "voce@email.com", "sc.ph.state": "Estado, província ou região", "sc.ph.city": "Onde você mora?", "sc.ph.handle": "seuusuario", "sc.ph.youtube": "@canal ou URL", "sc.ph.otherPlatform": "ex.: Substack, Twitch", "sc.ph.representedBy": "Agência / empresário", "sc.ph.country": "Selecione seu país…", "sc.ph.select": "Selecione…", "sc.eyebrow.you": "01 — Você", "sc.h2.you": "Conte quem você é", "sc.eyebrow.work": "02 — Trabalho", "sc.h2.work": "Mostre o seu trabalho", "sc.text.work": "Envie o conteúdo de que mais se orgulha: alguns links ou um media kit. É opcional, mas ajuda a nossa equipe a conhecer você melhor.", "sc.sec.you": "Sobre você", "sc.sec.work": "Seu trabalho", "sc.sec.consent": "Consentimento e envio", "sc.legend.rep": "Você tem representação atualmente? *", "sc.yes": "Sim", "sc.no": "Não", "sc.optional": "(opcional)", "sc.drop.upload": "+ Enviar", "sc.drop.max": "≤ 10 MB", "sc.drop.toobig": "Os arquivos devem ter no máximo 10 MB.", "sc.drop.another": "Toque para tentar outro", "sc.drop.again": "Toque para tentar novamente", "sc.drop.uploading": "Enviando…", "sc.drop.remove": "Remover", "sc.err.uploadnet": "Falha no envio. Verifique sua conexão.", "sc.err.upload": "Falha no envio. Tente novamente.", "sc.err.email": "Insira um e-mail válido.", "sc.err.first": "O nome é obrigatório.", "sc.err.last": "O sobrenome é obrigatório.", "sc.err.dob": "Insira sua data de nascimento.", "sc.err.age": "Você precisa ter {n} anos ou mais para se candidatar.", "sc.err.dobmatch": "Sua data de nascimento não corresponde à idade informada antes.", "sc.err.country": "Selecione seu país.", "sc.err.platform": "Selecione sua plataforma principal.", "sc.err.rep": "Diga se você tem representação.", "sc.err.repby": "Quem representa você?", "sc.err.other": "Informe a plataforma.", "sc.err.links": "Insira links válidos (https://…).", "sc.err.consent": "Aceite para continuar.", "sc.err.turnstile": "Conclua a verificação e depois envie.", "sc.err.fields": "Verifique os campos destacados.", "sc.err.rate": "Muitas tentativas. Tente novamente mais tarde ou escreva para {email}.", "sc.submit": "Enviar candidatura", "sc.submitting": "Enviando…", "sc.success.eyebrow": "Candidatura recebida", "sc.success.title": "Obrigado.", "sc.success.body": "Sua candidatura foi enviada. Obrigado por dedicar seu tempo.", "sc.home": "Voltar ao início", "sc.req.note": "Os campos marcados com * são obrigatórios.", "sc.err.summary": "Corrija o seguinte:", "sc.qr.label": "Escaneie para continuar esta candidatura no seu telefone", "sc.ts.label": "Verificação", "sc.err.tsfallback": "A verificação não está disponível neste navegador — escreva para {email} e receberemos sua candidatura por e-mail.", "sc.a11y.uploading": "Enviando {name}: {pct}%", "sc.a11y.uploaded": "{name} enviado.", "sc.a11y.removed": "Arquivo removido.", "sc.a11y.removeFile": "Remover {name}", "sc.hero.eyebrow": "Para criadores", "sc.hero.sub": "A Theodyx está descobrindo a próxima geração de criadores. Cada candidatura é lida por uma pessoa — e nunca há taxas.", "sc.hero.cta": "Candidate-se para ser descoberto", "sc.safety.eyebrow": "Theodyx — Segurança", "sc.safety.title": "Sua segurança vem primeiro.", "sc.safety.body": "Safety is our top priority. Protecting aspiring creatives — including young individuals — from online predators is of the utmost importance. If you would like to confirm an email or communication is from an official Theodyx representative or affiliate, email scouting@theodyx.com and we will be glad to confirm. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at scouting@theodyx.com.", "sc.safety.ack": "Li a declaração de segurança", "sc.err.safety": "Confirme que leu a declaração de segurança.", "sc.u14.change": "Atualize sua data de nascimento"}, "fr": {"sc.lbl.email": "E-mail", "sc.lbl.firstName": "Prénom", "sc.lbl.lastName": "Nom", "sc.lbl.dob": "Date de naissance", "sc.lbl.platform": "Plateforme principale", "sc.lbl.country": "Pays", "sc.lbl.state": "État / Région", "sc.lbl.city": "Ville", "sc.lbl.instagram": "Identifiant Instagram", "sc.lbl.tiktok": "Identifiant TikTok", "sc.lbl.youtube": "Chaîne YouTube", "sc.lbl.otherPlatform": "Autre plateforme", "sc.lbl.representedBy": "Représenté par", "sc.lbl.notes": "Autre chose ?", "sc.lbl.link1": "publication / vidéo 1", "sc.lbl.link2": "publication / vidéo 2", "sc.lbl.link3": "publication / vidéo 3", "sc.lbl.pictures": "Vos photos", "sc.ph.email": "vous@email.com", "sc.ph.state": "État, province ou région", "sc.ph.city": "Où êtes-vous basé(e) ?", "sc.ph.handle": "votreidentifiant", "sc.ph.youtube": "@chaîne ou URL", "sc.ph.otherPlatform": "ex. : Substack, Twitch", "sc.ph.representedBy": "Agence / manager", "sc.ph.country": "Sélectionnez votre pays…", "sc.ph.select": "Sélectionnez…", "sc.eyebrow.you": "01 — Vous", "sc.h2.you": "Dites-nous qui vous êtes", "sc.eyebrow.work": "02 — Travail", "sc.h2.work": "Montrez-nous votre travail", "sc.text.work": "Partagez les contenus dont vous êtes le plus fier : quelques liens ou un kit média. Facultatif, mais cela aide notre équipe à mieux vous connaître.", "sc.sec.you": "À propos de vous", "sc.sec.work": "Votre travail", "sc.sec.consent": "Consentement et envoi", "sc.legend.rep": "Êtes-vous actuellement représenté(e) ? *", "sc.yes": "Oui", "sc.no": "Non", "sc.optional": "(facultatif)", "sc.drop.upload": "+ Importer", "sc.drop.max": "≤ 10 Mo", "sc.drop.toobig": "Les fichiers doivent faire 10 Mo ou moins.", "sc.drop.another": "Touchez pour en essayer un autre", "sc.drop.again": "Touchez pour réessayer", "sc.drop.uploading": "Envoi…", "sc.drop.remove": "Retirer", "sc.err.uploadnet": "Échec de l’envoi. Vérifiez votre connexion.", "sc.err.upload": "Échec de l’envoi. Veuillez réessayer.", "sc.err.email": "Saisissez une adresse e-mail valide.", "sc.err.first": "Le prénom est obligatoire.", "sc.err.last": "Le nom est obligatoire.", "sc.err.dob": "Saisissez votre date de naissance.", "sc.err.age": "Vous devez avoir {n} ans ou plus pour postuler.", "sc.err.dobmatch": "Votre date de naissance ne correspond pas à l’âge indiqué précédemment.", "sc.err.country": "Sélectionnez votre pays.", "sc.err.platform": "Sélectionnez votre plateforme principale.", "sc.err.rep": "Indiquez si vous êtes représenté(e).", "sc.err.repby": "Qui vous représente ?", "sc.err.other": "Indiquez la plateforme.", "sc.err.links": "Saisissez des liens valides (https://…).", "sc.err.consent": "Veuillez accepter pour continuer.", "sc.err.turnstile": "Veuillez terminer la vérification, puis envoyer.", "sc.err.fields": "Veuillez vérifier les champs signalés.", "sc.err.rate": "Trop de tentatives. Réessayez plus tard ou écrivez à {email}.", "sc.submit": "Envoyer ma candidature", "sc.submitting": "Envoi…", "sc.success.eyebrow": "Candidature reçue", "sc.success.title": "Merci.", "sc.success.body": "Votre candidature est envoyée. Merci d’avoir pris le temps de postuler.", "sc.home": "Retour à l’accueil", "sc.req.note": "Les champs marqués d’un * sont obligatoires.", "sc.err.summary": "Veuillez corriger les points suivants :", "sc.qr.label": "Scannez pour continuer cette candidature sur votre téléphone", "sc.ts.label": "Vérification", "sc.err.tsfallback": "La vérification n’est pas disponible dans ce navigateur — écrivez à {email} et nous recevrons votre candidature par e-mail.", "sc.a11y.uploading": "Envoi de {name} : {pct} %", "sc.a11y.uploaded": "{name} envoyé.", "sc.a11y.removed": "Fichier supprimé.", "sc.a11y.removeFile": "Retirer {name}", "sc.hero.eyebrow": "Pour les créateurs", "sc.hero.sub": "Theodyx recherche la prochaine génération de créateurs. Chaque candidature est lue par une personne — et il n’y a jamais de frais.", "sc.hero.cta": "Postuler pour être repéré(e)", "sc.safety.eyebrow": "Theodyx — Sécurité", "sc.safety.title": "Votre sécurité avant tout.", "sc.safety.body": "Safety is our top priority. Protecting aspiring creatives — including young individuals — from online predators is of the utmost importance. If you would like to confirm an email or communication is from an official Theodyx representative or affiliate, email scouting@theodyx.com and we will be glad to confirm. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at scouting@theodyx.com.", "sc.safety.ack": "J’ai lu la déclaration de sécurité", "sc.err.safety": "Veuillez confirmer que vous avez lu la déclaration de sécurité.", "sc.u14.change": "Modifier votre date de naissance"}};
  /* 2.2.0 — the age gate's own strings, kept in their own object so the Phase 6 dictionary above
     stays byte-identical. The safety statement itself is sc.safety.body: legal copy, English in
     every locale until a person translates it. */
  var SCD_GATE = {
    "en": {"sc.gate.eyebrow": "Theodyx \u2014 Safety", "sc.gate.title": "Before you apply", "sc.gate.dob": "Your date of birth", "sc.gate.go": "Continue", "sc.gate.note": "You must be {n} or older to apply directly. We use your date of birth only to check that."},
    "es": {"sc.gate.eyebrow": "Theodyx \u2014 Seguridad", "sc.gate.title": "Antes de solicitar", "sc.gate.dob": "Tu fecha de nacimiento", "sc.gate.go": "Continuar", "sc.gate.note": "Debes tener {n} a\u00f1os o m\u00e1s para solicitar directamente. Solo usamos tu fecha de nacimiento para comprobarlo."},
    "pt": {"sc.gate.eyebrow": "Theodyx \u2014 Seguran\u00e7a", "sc.gate.title": "Antes de se candidatar", "sc.gate.dob": "Sua data de nascimento", "sc.gate.go": "Continuar", "sc.gate.note": "Voc\u00ea precisa ter {n} anos ou mais para se candidatar diretamente. Usamos sua data de nascimento apenas para verificar isso."},
    "fr": {"sc.gate.eyebrow": "Theodyx \u2014 S\u00e9curit\u00e9", "sc.gate.title": "Avant de postuler", "sc.gate.dob": "Votre date de naissance", "sc.gate.go": "Continuer", "sc.gate.note": "Vous devez avoir {n} ans ou plus pour postuler directement. Nous utilisons votre date de naissance uniquement pour le v\u00e9rifier."}
  };
  for (var __gl in SCD_GATE) { if (!SCD[__gl]) SCD[__gl] = {}; for (var __gk in SCD_GATE[__gl]) SCD[__gl][__gk] = SCD_GATE[__gl][__gk]; }
  var __I = window.__thxI18n; if (__I) { for (var __lc in SCD) __I.add(__lc, SCD[__lc]); }
  function T(k, v) { if (__I && __I.t) return __I.t(k, v); var s = SCD.en[k] || k; if (v) for (var p in v) s = s.split('{' + p + '}').join(v[p]); return s; }

  /* config */
  var API_BASE = 'https://theodyx-scouting-api.theodyx.workers.dev';
  var TURNSTILE_SITE_KEY = '0x4AAAAAADp3wmr_gUgr_SNb';
  var TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  var TURNSTILE_TIMEOUT_MS = 10000;
  var QR_SRC = 'https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@4fd766127f1588e11846fead994117da4d50cabe/vendor/qrcode.min.js';
  var QR_SRI = 'sha384-UE+eaQRn+KiuCh1sYLD51yNjGFekkZ5qoo2J9LvSo1leawRjhShWe7VY8obiE5D4';
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

  function loadScriptOnce(src, cb, integrity) {
    if (qs('script[src="' + src + '"]')) { if (cb) cb(); return; }
    var s = document.createElement('script');
    s.src = src; s.async = true; s.defer = true;
    if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
    if (cb) s.onload = cb;
    document.head.appendChild(s);
  }

  /* state */
  var gates = (function () {
    var g = loadJSON(SS_GATES) || {};
    /* 2.2.0 adds gatePassed + dob: the age dialog has been answered in THIS session (either way),
       so a reload does not re-ask and a new session does. trust stays what it always was — the
       inline safety checkbox — and the gate deliberately does not pre-tick it. */
    return {
      trust: !!g.trust, ageResolved: !!g.ageResolved, eligible: !!g.eligible,
      age: g.age == null ? null : g.age,
      gatePassed: !!g.gatePassed, dob: typeof g.dob === 'string' ? g.dob : ''
    };
  })();
  /* The page head carries <style id="sc-gate-preboot"> plus a two-line inline script reading the
   * very same SS_GATES keys. Phase 10 inverts the default: nothing is hidden at first paint, and the
   * only class the preboot can stamp is sc-u14 — a session that already told us it is under 14.
   * Stamping again here keeps the script correct on its own if that head snippet is ever missing. */
  function rootClass() { return (gates.ageResolved && !gates.eligible) ? 'sc-u14' : ''; }
  function stampRoot() {
    var d = document.documentElement, c = rootClass();
    d.classList.remove('sc-open', 'sc-done');
    if (c) d.classList.add(c); else d.classList.remove('sc-u14');
    /* 2.2.0: sc-gated means "the age dialog has not been answered in this session". It hides the
       three form sections, so the form cannot be seen or reached while the dialog is up. */
    if (gates.gatePassed) d.classList.remove('sc-gated'); else d.classList.add('sc-gated');
  }
  stampRoot();

  /* 2.2.0 — the gate goes up as early as this file runs, not at DOMContentLoaded and not at the end
   * of init(): the stylesheet and the dialog are both inserted in this same synchronous task, so the
   * next paint after the script executes already shows the dialog over a form that is both hidden
   * (html.sc-gated) and inert. The page <head> can hide it half a beat earlier still — see the
   * sc-gate-preboot note in injectCSS(). */
  function bootGate() {
    if (gates.gatePassed) return;
    injectCSS();
    if (document.body) openAgeGate();
    else document.addEventListener('DOMContentLoaded', function () { if (!gates.gatePassed) openAgeGate(); });
  }
  /* the call itself is the last statement in this file, below — the gate's own `var`s have to have
     been initialised before it runs, and it still runs in this same synchronous task, before init(). */

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
  /* ------------------------------------------------------- funnel events
   * One data layer. window.__thxTrack is defined by the site head beacon (session id, UTM with a
   * sessionStorage fallback, GPC + consent gating). The page never carries a second beacon, and the
   * page view is the head's landing_view — this file emits only the scouting funnel steps. */
  function trk(ev, step, once) { try { if (window.__thxTrack) window.__thxTrack(ev, step || null, !!once); } catch (e) {} }

  /* --------------------------------------------------------------- state */
  function persistGates() { saveJSON(SS_GATES, gates); }

  /* Reveal-only, and after Phase 10 the reveal is the default: the class on <html> only ever hides.
   * Never write display:none over something that was visible at first paint — that write is exactly
   * what used to shove the footer up ~635px. */
  function showApp(disp) {
    var d = document.documentElement;
    if (disp === false) d.classList.add('sc-done'); else d.classList.remove('sc-done');
  }

  function focusEl(el, scroll) {
    if (!el) return false;
    if (scroll) { try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (x) {} }
    try { el.focus({ preventScroll: true }); } catch (x) { try { el.focus(); } catch (y) {} }
    return document.activeElement === el;
  }

  /* ------------------------------------------------- age gate (2.2.0)
   * One dialog, asked before anything else on the page can be touched. It is a real modal:
   * role="dialog" aria-modal="true", named by its own <h2>, focus trapped inside it, every other
   * <body> child inert, the scroll locked, and Escape deliberately unbound — an age check is not a
   * thing you dismiss. The safety statement is stated inside it, cloned from the page's own copy,
   * so the question is never answered by someone who has not read it. Same setInert()/focus-move/
   * restore shape as the mobile nav sheet in theodyx-nav.js and as the 1.10.0 gates this replaces. */
  var gateInerted = [], activeGate = null, gateFocusPrev = null, gateKeysBound = false;
  var FOCUSABLE = 'a[href],button:not([disabled]),select:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type="hidden"]),[tabindex]:not([tabindex="-1"])';
  var HAS_INERT = ('inert' in document.documentElement);

  function isVisible(el) { return !!(el && (el.offsetWidth || el.offsetHeight || (el.getClientRects && el.getClientRects().length))); }
  function lockScroll(lock) { try { document.body.style.overflow = lock ? 'hidden' : ''; } catch (e) {} }
  function gateFocusables(gate) {
    return qsa(FOCUSABLE, gate).filter(function (el) { return isVisible(el) && !el.hasAttribute('inert'); });
  }
  /* inert is what actually holds the page back: it blocks pointer and keyboard alike and takes the
   * subtree out of the accessibility tree on its own. aria-hidden is added only where inert is not
   * supported — stating both on a modern engine is exactly what trips axe's aria-hidden-focus. */
  function setGateInert(gate) {
    releaseGateInert();
    var n = document.body.firstElementChild;
    while (n) {
      if (n !== gate && !n.contains(gate) && !/^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT)$/.test(n.tagName) && !n.hasAttribute('inert')) {
        n.setAttribute('inert', '');
        if (!HAS_INERT) n.setAttribute('aria-hidden', 'true');
        gateInerted.push(n);
      }
      n = n.nextElementSibling;
    }
  }
  function releaseGateInert() {
    gateInerted.forEach(function (n) { n.removeAttribute('inert'); n.removeAttribute('aria-hidden'); });
    gateInerted = [];
  }
  /* Tab guard: inert already keeps the rest of the page out of the sequence in modern engines,
   * this makes the wrap deterministic (and covers browsers without inert). Escape is not handled,
   * and no other key is: the only way out of this dialog is to answer it. */
  function onGateKeydown(e) {
    if (!activeGate || e.key !== 'Tab') return;
    var f = gateFocusables(activeGate);
    if (!f.length) { e.preventDefault(); focusEl(activeGate); return; }
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!activeGate.contains(a)) { e.preventDefault(); focusEl(e.shiftKey ? last : first); return; }
    if (e.shiftKey && (a === first || a === activeGate)) { e.preventDefault(); focusEl(last); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); focusEl(first); }
  }
  function onGateFocusIn(e) {
    if (!activeGate || activeGate.contains(e.target)) return;
    var f = gateFocusables(activeGate);
    focusEl(f[0] || activeGate);
  }
  function bindGateKeys() {
    if (gateKeysBound) return; gateKeysBound = true;
    document.addEventListener('keydown', onGateKeydown, true);
    document.addEventListener('focusin', onGateFocusIn, true);
  }
  function openGate(gate, prefer) {
    if (!gate || activeGate === gate) return;
    if (!activeGate) gateFocusPrev = document.activeElement;
    activeGate = gate;
    if (!gate.hasAttribute('tabindex')) gate.setAttribute('tabindex', '-1');
    gate.removeAttribute('aria-hidden'); gate.removeAttribute('inert');
    setGateInert(gate);
    bindGateKeys();
    focusEl(prefer && isVisible(prefer) ? prefer : gate);
  }
  /* Only moves focus if a gate was actually open, so an ordinary reload of an already-cleared
   * session never steals focus from the top of the document. */
  function closeGates(moveFocusTo) {
    var had = !!activeGate;
    activeGate = null;
    releaseGateInert();
    if (!had) return;
    if (moveFocusTo && isVisible(moveFocusTo)) focusEl(moveFocusTo);
    else if (gateFocusPrev && document.contains(gateFocusPrev) && isVisible(gateFocusPrev)) focusEl(gateFocusPrev);
    gateFocusPrev = null;
  }

  /* The statement, word for word: the page's native #sc-gate-safety copy is cloned (mailto links and
   * all) before buildSafety() moves the original into the inline #sc-safety section. */
  function gateSafetyBody() {
    var old = $('sc-gate-safety'), body = old && qs('.sc-gate-body', old);
    if (body) { var c = body.cloneNode(true); c.className = 'sc-gate-body'; c.removeAttribute('id'); return c; }
    var p = document.createElement('p'); p.className = 'sc-gate-body'; p.textContent = T('sc.safety.body'); return p;
  }

  /* The native page still ships an (empty, display:none) #sc-gate-age div left over from 1.x, and the
   * page's own <style id="sc-native-css"> block still positions it. Reuse that node — same id, same
   * overlay treatment — and rebuild its contents around a date field instead of the old age select. */
  function mountAgeGate() {
    if (!document.body) return null;
    var g = $('sc-gate-age');
    if (g && g.dataset.thxGate) return g;
    if (!g) { g = document.createElement('div'); g.id = 'sc-gate-age'; }
    if (g.parentNode !== document.body) document.body.appendChild(g);   /* a direct child of <body>, so setGateInert() can reach its siblings */
    while (g.firstChild) g.removeChild(g.firstChild);
    g.dataset.thxGate = '1';
    g.setAttribute('role', 'dialog');
    g.setAttribute('aria-modal', 'true');
    g.removeAttribute('aria-label');                 /* the heading is the name, not a one-word label */
    g.setAttribute('aria-labelledby', 'sc-gate-title');
    g.setAttribute('tabindex', '-1');

    var form = document.createElement('form');
    form.className = 'sc-gate-inner sc-gate-form';   /* not .sc-form: neutralizeForms() must not touch it */
    form.setAttribute('novalidate', '');

    var eb = document.createElement('span'); eb.className = 'sc-gate-eyebrow'; eb.textContent = T('sc.gate.eyebrow');
    var h = document.createElement('h2'); h.className = 'sc-gate-h'; h.id = 'sc-gate-title'; h.textContent = T('sc.gate.title');
    form.appendChild(eb); form.appendChild(h);
    form.appendChild(gateSafetyBody());

    var field = document.createElement('div'); field.className = 'sc-gate-field';
    var lab = document.createElement('label'); lab.className = 'sc-label'; lab.setAttribute('for', 'sc-gate-dob');
    lab.textContent = T('sc.gate.dob');
    var inp = document.createElement('input');
    inp.type = 'date'; inp.id = 'sc-gate-dob'; inp.className = 'sc-gate-input';
    inp.setAttribute('autocomplete', 'bday');
    inp.setAttribute('aria-describedby', 'sc-gate-msg sc-gate-note');
    var ty = new Date();
    inp.max = ty.getFullYear() + '-' + String(ty.getMonth() + 1).padStart(2, '0') + '-' + String(ty.getDate()).padStart(2, '0');
    inp.min = (ty.getFullYear() - 100) + '-01-01';
    field.appendChild(lab); field.appendChild(inp);
    form.appendChild(field);

    /* role="status" and empty from the start, so the live region exists before it has anything to say */
    var msg = document.createElement('p'); msg.id = 'sc-gate-msg'; msg.className = 'sc-gate-err';
    msg.setAttribute('role', 'status');
    form.appendChild(msg);

    var go = document.createElement('button');
    go.type = 'submit'; go.id = 'sc-gate-age-go'; go.className = 'sc-gate-btn'; go.textContent = T('sc.gate.go');
    form.appendChild(go);                             /* never disabled: an empty submit has to be able to explain itself */

    var note = document.createElement('p'); note.id = 'sc-gate-note'; note.className = 'sc-gate-note';
    note.textContent = T('sc.gate.note', { n: MIN_AGE });
    form.appendChild(note);

    g.appendChild(form);
    on(form, 'submit', function (e) { e.preventDefault(); gateSubmit(); });
    on(inp, 'input', function () {
      if (inp.getAttribute('aria-invalid') !== 'true') return;
      inp.removeAttribute('aria-invalid'); inp.classList.remove('is-bad'); gateMsg('');
    });
    return g;
  }

  function gateMsg(text) {
    var m = $('sc-gate-msg'); if (!m) return;
    m.textContent = text || '';
    if (text) m.classList.add('is-on'); else m.classList.remove('is-on');
  }

  function openAgeGate() {
    var g = mountAgeGate(); if (!g) return;
    var d = document.documentElement;
    d.classList.add('sc-gated'); d.classList.remove('sc-inelig');
    g.classList.add('is-open');
    g.style.removeProperty('display');
    lockScroll(true);
    gateMsg('');
    openGate(g, null);   /* the dialog itself takes focus, so its heading and the safety copy are read out */
  }

  function closeAgeGate() {
    var g = $('sc-gate-age');
    if (g) { g.classList.remove('is-open'); g.style.display = 'none'; }
    document.documentElement.classList.remove('sc-gated');
    lockScroll(false);
  }

  function gateSubmit() {
    var inp = $('sc-gate-dob'); if (!inp) return;
    var v = String(inp.value || '').trim();
    var a = /^\d{4}-\d{2}-\d{2}$/.test(v) ? ageFromDob(v) : null;
    if (a == null || a < 0 || a > 120) {              /* empty, unparsed, in the future, or not a lifetime */
      inp.setAttribute('aria-invalid', 'true'); inp.classList.add('is-bad');
      gateMsg(T('sc.err.dob'));
      focusEl(inp);
      return;
    }
    inp.removeAttribute('aria-invalid'); inp.classList.remove('is-bad'); gateMsg('');
    gates.age = a; gates.eligible = a >= MIN_AGE; gates.ageResolved = true; gates.gatePassed = true; gates.dob = v;
    persistGates();
    if (gates.eligible) { trk('age_eligible', null, true); trk('age_acknowledged', null, true); passGate(v); }
    else { trk('age_ineligible', null, true); blockGate(); }
  }

  /* 14+: the dialog goes, the date it collected becomes #sc-dob's value (asking twice would be rude
   * and would give the two answers a chance to disagree), and focus lands on the first field. */
  function passGate(dob) {
    closeAgeGate();
    var d = document.documentElement;
    d.classList.remove('sc-u14', 'sc-inelig');
    bootU14 = false;
    var f = $('sc-dob');
    if (f) { f.value = dob; persistForm(); }
    inlineNote();
    evaluateAge(false);       /* silent: age_eligible has already been emitted by gateSubmit() */
    closeGates($('sc-email') || $('sc-form-you'));
  }

  /* Under 14: the existing locked state, exactly as a returning under-14 session gets it. */
  function blockGate() {
    closeAgeGate();
    document.documentElement.classList.remove('sc-inelig');
    bootU14 = true;
    var note = u14Note();
    restoreU14Home();         /* html.sc-u14 hides #sc-form-consent, so the note cannot stay parked inside it */
    stampRoot();              /* -> html.sc-u14: the form sections go, #sc-gate-u14 stands in their place */
    var h = note && (qs('.sc-h2', note) || qs('h2', note));
    closeGates(h || note);
    /* scroll to the note, not to the top: it stands where the form used to, and the hero above it
       still says "apply". The note is the answer, so the note is what the page should be showing. */
    if (h || note) focusEl(h || note, true);
  }

  /* --------------------------------------------------------------- hero
   * LAND-01: the first viewport has to answer "what is this and what do I do next". The native
   * page ships <section class="sc-hero"><h1 class="sc-hero-title"> and nothing else, so the eyebrow,
   * the one-sentence offer and the CTA are added around that heading. The preboot reserves the band's
   * height, so the three nodes land inside space that was already painted (no shift). */
  function buildHero() {
    var hero = qs('.sc-hero'); if (!hero || hero.dataset.thxHero) return;
    hero.dataset.thxHero = '1';
    /* The h1 is the LCP element. It is never detached or re-parented — moving a node resets its
       paint, which is how the old build ended up with a 2.3 s elementRenderDelay (SPEED-02). The
       three new nodes are inserted around it, into a band whose box the page-head preboot already
       painted. */
    var h1 = qs('.sc-hero-title', hero) || qs('h1', hero);
    var eb = document.createElement('span'); eb.className = 'sc-hero-eyebrow'; eb.textContent = T('sc.hero.eyebrow');
    if (h1) hero.insertBefore(eb, h1); else hero.appendChild(eb);
    var sub = document.createElement('p'); sub.className = 'sc-hero-sub'; sub.textContent = T('sc.hero.sub');
    if (h1 && h1.nextSibling) hero.insertBefore(sub, h1.nextSibling); else hero.appendChild(sub);
    if (!$('sc-hero-cta')) {
      var cta = document.createElement('a');
      cta.id = 'sc-hero-cta'; cta.className = 'thxo-btn sc-hero-cta';
      cta.href = '#sc-form-you'; cta.textContent = T('sc.hero.cta');
      on(cta, 'click', function (e) {
        var t = $('sc-form-you'); if (!t) return;
        e.preventDefault();
        try { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (x) { t.scrollIntoView(); }
        var f = $('sc-email'); if (f) setTimeout(function () { focusEl(f); }, 420);
      });
      hero.insertBefore(cta, sub.nextSibling);
    }
  }

  /* -------------------------------------------------------------- safety
   * The statement used to be a full-screen role="dialog" overlay that a paid click hit before any
   * offer or form (LAND-01) and that gated LCP on the deferred bundle (SPEED-02). It is now an
   * ordinary section above the form; the acknowledgement moved to a required checkbox in the consent
   * block. The copy is lifted verbatim out of the native #sc-gate-safety when it is on the page, so
   * the mailto links and the legal wording survive untouched. */
  function buildSafety() {
    if ($('sc-safety')) return;
    var host = $('sc-form-you'); if (!host || !host.parentNode) return;
    var old = $('sc-gate-safety');
    var sec = document.createElement('section');
    sec.id = 'sc-safety'; sec.className = 'sc-section sc-app-sans sc-safety';
    sec.setAttribute('aria-labelledby', 'sc-safety-h');
    var eb = document.createElement('span'); eb.className = 'sc-safety-eyebrow';
    eb.textContent = (old && (qs('.sc-gate-eyebrow', old) || {}).textContent) || T('sc.safety.eyebrow');
    var h = document.createElement('h2'); h.className = 'sc-h2 sc-safety-h'; h.id = 'sc-safety-h';
    h.textContent = (old && (qs('.sc-gate-h', old) || {}).textContent) || T('sc.safety.title');
    sec.appendChild(eb); sec.appendChild(h);
    var body = old && qs('.sc-gate-body', old);
    if (body) { body.classList.remove('sc-gate-body'); body.classList.add('sc-safety-body'); sec.appendChild(body); }
    else { var p = document.createElement('p'); p.className = 'sc-safety-body'; p.textContent = T('sc.safety.body'); sec.appendChild(p); }
    host.parentNode.insertBefore(sec, host);
    /* 2.2.0: only the safety overlay is retired — its copy now lives here and (cloned) inside the
       age dialog. #sc-gate-age is that dialog's own node and is left exactly where it is. */
    var oldSafety = $('sc-gate-safety'); if (oldSafety && oldSafety.parentNode) oldSafety.parentNode.removeChild(oldSafety);
  }

  /* the acknowledgement, as a required checkbox that blocks submit exactly like the consent box */
  function buildSafetyAck() {
    if ($('sc-safety-ack')) return;
    var consent = $('sc-consent'); if (!consent) return;
    var lab = qs('label[for="sc-consent"]'); if (!lab || !lab.parentNode) return;
    var wrap = document.createElement('label');
    wrap.className = 'sc-consent sc-consent--ack'; wrap.setAttribute('for', 'sc-safety-ack');
    var box = document.createElement('input');
    box.type = 'checkbox'; box.id = 'sc-safety-ack'; box.className = 'sc-check'; box.required = true;
    var txt = document.createElement('span'); txt.className = 'sc-consent-text';
    var star = document.createElement('span'); star.className = 'sc-req'; star.setAttribute('aria-hidden', 'true'); star.textContent = '* ';
    txt.appendChild(star);
    txt.appendChild(document.createTextNode(T('sc.safety.ack')));
    var link = document.createElement('a'); link.href = '#sc-safety'; link.className = 'sc-ack-link'; link.textContent = T('sc.safety.title');
    on(link, 'click', function (e) { var t = $('sc-safety'); if (!t) return; e.preventDefault(); try { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (x) { t.scrollIntoView(); } });
    txt.appendChild(document.createTextNode(' — '));
    txt.appendChild(link);
    wrap.appendChild(box); wrap.appendChild(txt);
    lab.parentNode.insertBefore(wrap, lab);
    on(box, 'change', function () {
      if (box.checked) { gates.trust = true; persistGates(); trk('age_acknowledged', null, true); clearFieldMsg('sc-safety-ack'); }
      else { gates.trust = false; persistGates(); }
    });
    if (gates.trust) box.checked = true;
  }

  /* ----------------------------------------------------------------- age
   * FORMS-04: #sc-dob is still the single source of truth once the gate has cleared — the dialog
   * writes into it rather than keeping a second answer beside it, so the two can never disagree, and
   * editing the date re-evaluates and the page re-opens.
   * Two ineligible states, deliberately different:
   *   html.sc-u14     the tab already answered "under 14" on an earlier load. The preboot stamps it
   *                   before paint, the form sections never render, and #sc-gate-u14 stands in their
   *                   place with a button back to the date field. No shift, no dead end.
   *   html.sc-inelig  decided live, while the visitor is typing. The form stays exactly where it is;
   *                   only the submit row is replaced by the same note, so the date stays editable. */
  var bootU14 = document.documentElement.classList.contains('sc-u14');

  var u14Home = null;
  function u14Note() {
    var note = $('sc-gate-u14'); if (!note) return null;
    if (note.dataset.thxU14) return note;
    note.dataset.thxU14 = '1';
    /* where the page put it. inlineNote() parks it inside #sc-form-consent, and html.sc-u14 hides
       that whole section — so the under-14 branch has to be able to put it back. */
    u14Home = { parent: note.parentNode, next: note.nextSibling, cls: note.className };
    var h = qs('.sc-h2', note) || qs('h2', note);
    if (h && !h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    var back = document.createElement('button');
    back.type = 'button'; back.id = 'sc-u14-change'; back.className = 'sc-gate-btn sc-u14-change';
    back.textContent = T('sc.u14.change');
    on(back, 'click', unlockU14);
    note.appendChild(back);
    return note;
  }
  /* park the note where it reads as the submit row's replacement, not as a section after the form */
  function inlineNote() {
    var note = u14Note(), form = $('sc-form-consent'); if (!note || !form) return;
    if (note.dataset.thxInline) return;
    var anchor = $('sc-submit');
    if (anchor && anchor.parentNode) { anchor.parentNode.insertBefore(note, anchor); note.dataset.thxInline = '1'; note.className = 'sc-u14-inline sc-app-sans'; }
  }
  function restoreU14Home() {
    var note = $('sc-gate-u14'); if (!note || !u14Home || !u14Home.parent) return;
    if (note.parentNode !== u14Home.parent) {
      u14Home.parent.insertBefore(note, (u14Home.next && u14Home.next.parentNode === u14Home.parent) ? u14Home.next : null);
    }
    note.className = u14Home.cls;
    note.removeAttribute('data-thx-inline');
  }
  /* 2.2.0: the way back in is the gate, not an unguarded form. The stored answer is dropped, the
     date field is emptied, and the dialog asks again. */
  function unlockU14() {
    gates.ageResolved = false; gates.eligible = false; gates.age = null; gates.gatePassed = false; gates.dob = '';
    persistGates();
    document.documentElement.classList.remove('sc-u14', 'sc-inelig');
    bootU14 = false;
    var d = $('sc-dob'); if (d) { d.value = ''; persistForm(); }
    restoreU14Home();
    var gi = $('sc-gate-dob');
    if (gi) { gi.value = ''; gi.removeAttribute('aria-invalid'); gi.classList.remove('is-bad'); }
    openAgeGate();
  }

  function dobAge() { var v = val('sc-dob'); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? ageFromDob(v) : null; }
  function setIneligible(on) {
    var d = document.documentElement;
    if (on) { inlineNote(); d.classList.add('sc-inelig'); } else d.classList.remove('sc-inelig');
  }
  /* announce=true when the visitor caused it (blur / submit); false for the silent boot pass */
  function evaluateAge(announce) {
    if (bootU14) return null;                       /* the locked screen owns the state until unlocked */
    var a = dobAge();
    if (a == null) {
      if (gates.ageResolved) { gates.ageResolved = false; gates.eligible = false; gates.age = null; persistGates(); }
      setIneligible(false); return null;
    }
    var elig = a >= MIN_AGE, changed = (!gates.ageResolved || gates.eligible !== elig || gates.age !== a);
    gates.age = a; gates.eligible = elig; gates.ageResolved = true;
    if (changed) persistGates();
    trk(elig ? 'age_eligible' : 'age_ineligible', null, true);
    setIneligible(!elig);
    if (!elig) { if (announce) { markBad('sc-dob'); setFieldMsg('sc-dob', T('sc.err.age', { n: MIN_AGE })); } }
    else clearFieldMsg('sc-dob');
    return a;
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

  /* ------------------------------------------------- declared semantics
   * The page ships as a native Webflow build, so ensureDom() is a no-op there and every attribute
   * below has to be applied to the live DOM rather than only to the injected fragments. All of it
   * is idempotent and guarded, so it is safe on both builds. */
  var REQUIRED_IDS = ['sc-email', 'sc-firstName', 'sc-lastName', 'sc-dob', 'sc-platform', 'sc-country', 'sc-consent'];

  /* F-17: keep a short label on the checkbox and move the trailing sentence into a described-by
   * note, so the accessible name stops being a 40-word paragraph. */
  function splitConsentLabel() {
    var lab = qs('label[for="sc-consent"]'); if (!lab || lab.dataset.thxSplit) return;
    var txt = qs('.sc-consent-text', lab), box = $('sc-consent');
    if (!txt || !box || $('sc-consent-note')) return;
    var marker = 'I understand', node = null, idx = -1, t;
    var walk = document.createTreeWalker(txt, NodeFilter.SHOW_TEXT, null, false);
    while ((t = walk.nextNode())) { var i = t.nodeValue.indexOf(marker); if (i !== -1) { node = t; idx = i; break; } }
    if (!node) return;                                   /* translated copy — leave it alone */
    lab.dataset.thxSplit = '1';
    var tail = node.nodeValue.slice(idx);
    node.nodeValue = node.nodeValue.slice(0, idx);
    var after = [], seen = false, w2 = document.createTreeWalker(txt, NodeFilter.SHOW_TEXT, null, false), n2;
    while ((n2 = w2.nextNode())) { if (seen) after.push(n2); else if (n2 === node) seen = true; }
    after.forEach(function (n) { tail += n.nodeValue; n.nodeValue = ''; });
    var note = document.createElement('p');
    note.id = 'sc-consent-note'; note.className = 'sc-consent-note';
    note.textContent = tail.replace(/\s+/g, ' ').trim();
    lab.parentNode.insertBefore(note, lab.nextSibling);
    var d = box.getAttribute('aria-describedby') || '';
    if (d.split(/\s+/).indexOf('sc-consent-note') === -1) box.setAttribute('aria-describedby', d ? d + ' sc-consent-note' : 'sc-consent-note');
  }

  function enhanceSemantics() {
    splitConsentLabel();                 /* before the asterisk, so it lands on the short label */
    /* F-08 — the fields enforced on submit; say so before the user gets there */
    REQUIRED_IDS.forEach(function (id) {
      var el = $(id); if (!el) return;
      el.required = true; el.setAttribute('required', '');
      var lab = qs('label[for="' + id + '"]');
      if (lab && !qs('.sc-req', lab)) {
        var star = document.createElement('span');
        star.className = 'sc-req'; star.setAttribute('aria-hidden', 'true');
        var ct = qs('.sc-consent-text', lab);
        if (ct) { star.textContent = '* '; ct.insertBefore(star, ct.firstChild); }  /* leads the sentence */
        else { star.textContent = ' *'; lab.appendChild(star); }
      }
    });
    var you = $('sc-form-you');
    if (you && !$('sc-req-note')) {
      var note = document.createElement('p');
      note.id = 'sc-req-note'; note.className = 'sc-req-note'; note.textContent = T('sc.req.note');
      var frm = qs('form', you);
      if (frm) frm.parentNode.insertBefore(note, frm); else you.appendChild(note);
    }
    /* F-10 */
    var dob = $('sc-dob'); if (dob && !dob.getAttribute('autocomplete')) dob.setAttribute('autocomplete', 'bday');
    var ctry = $('sc-country'); if (ctry && !ctry.getAttribute('autocomplete')) ctry.setAttribute('autocomplete', 'country-name');
    /* F-11 — the chip pair is a named group, and both chips can carry an invalid state */
    var rep = $('sc-rep');
    if (rep) {
      var lg = qs('.sc-legend', rep);
      if (lg && !lg.id) lg.id = 'sc-rep-legend';
      var chips = qs('.sc-chips', rep);
      if (chips && lg) { chips.setAttribute('role', 'group'); chips.setAttribute('aria-labelledby', lg.id); }
      qsa('[data-val]', rep).forEach(function (b) { if (!b.id) b.id = 'sc-rep-' + b.getAttribute('data-val'); });
    }
    /* SEM-22 — a dialog is not a live region */
    var suc = $('sc-success');
    if (suc) { suc.removeAttribute('aria-live'); suc.setAttribute('aria-modal', 'true'); }
    ensureTurnstileBox();
  }

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

  /* F-13: the zone is a real <button> (not a div with role="button" holding a nested link), the
   * Remove control is a sibling button outside it, and every state change is written into a
   * visually-hidden role="status" so progress, success and failure are actually announced. */
  function srSay(node, msg) { if (node) { node.textContent = ''; node.textContent = msg; } }

  function wireDrop(dropId, accept, onKey) {
    var drop = $(dropId); if (!drop || drop.dataset.thxWired) return;
    var main = drop.getAttribute('data-main') || T('sc.drop.upload');
    if (drop.tagName !== 'BUTTON') {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = drop.className; btn.setAttribute('data-main', main);
      drop.removeAttribute('id');
      drop.parentNode.insertBefore(btn, drop);
      drop.parentNode.removeChild(drop);
      btn.id = dropId;
      drop = btn;
    }
    drop.dataset.thxWired = '1';
    drop.removeAttribute('role'); drop.removeAttribute('tabindex');
    drop.setAttribute('aria-label', main + ' — file upload');
    var wrap = document.createElement('div'); wrap.className = 'sc-drop-wrap';
    drop.parentNode.insertBefore(wrap, drop);
    wrap.appendChild(drop);
    var remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'sc-drop-remove'; remove.textContent = T('sc.drop.remove'); remove.hidden = true;
    var status = document.createElement('span');
    status.className = 'sc-sr-only'; status.setAttribute('role', 'status');
    var input = document.createElement('input');
    input.type = 'file'; input.accept = accept; input.className = 'sc-drop-input';
    wrap.appendChild(remove); wrap.appendChild(status); wrap.appendChild(input);
    setDropState(drop, idleDropHTML(drop));

    function reset(say) {
      drop.classList.remove('is-done'); drop.classList.remove('is-error');
      setDropState(drop, idleDropHTML(drop));
      remove.hidden = true; input.value = ''; onKey(undefined);
      if (say) { srSay(status, T('sc.a11y.removed')); focusEl(drop); }
    }
    on(drop, 'click', function () { input.click(); });
    on(remove, 'click', function () { reset(true); });

    /* ACT-04 — the zone is drawn as a drop target, so it accepts a drop. The dragged file goes
     * through exactly the same path as one chosen in the picker: same accept check, same 10 MB
     * limit, same status-region announcements, same progress and success rendering. Keyboard and
     * click behaviour are untouched — the <button> still opens the picker. */
    var accepts = String(accept || '').split(',').map(function (t) { return t.trim().toLowerCase(); })
      .filter(function (t) { return !!t; });
    function typeOk(file) {
      if (!accepts.length) return true;
      var t = String(file.type || '').toLowerCase();
      for (var i = 0; i < accepts.length; i++) {
        var a = accepts[i];
        if (a === t) return true;
        if (a.slice(-2) === '/*' && t.indexOf(a.slice(0, -1)) === 0) return true;
      }
      return false;
    }
    var overDepth = 0;
    function setOver(on_) {
      if (on_) drop.classList.add('is-over'); else drop.classList.remove('is-over');
    }
    function hasFiles(e) {
      var dt = e.dataTransfer; if (!dt) return false;
      if (dt.types) { for (var i = 0; i < dt.types.length; i++) if (dt.types[i] === 'Files') return true; }
      return false;
    }
    on(drop, 'dragenter', function (e) {
      if (!hasFiles(e)) return;
      e.preventDefault(); e.stopPropagation();
      overDepth++; setOver(true);
    });
    on(drop, 'dragover', function (e) {
      if (!hasFiles(e)) return;
      e.preventDefault(); e.stopPropagation();
      try { e.dataTransfer.dropEffect = 'copy'; } catch (err) {}
      setOver(true);
    });
    on(drop, 'dragleave', function (e) {
      e.stopPropagation();
      overDepth = Math.max(0, overDepth - 1);
      if (!overDepth) setOver(false);
    });
    on(drop, 'drop', function (e) {
      e.preventDefault(); e.stopPropagation();
      overDepth = 0; setOver(false);
      var dt = e.dataTransfer; var file = dt && dt.files && dt.files[0];
      if (!file) return;
      if (!typeOk(file)) {
        drop.classList.add('is-error');
        setDropState(drop, '<span class="sc-drop-main sc-drop-main--err">' + escapeHtml(uploadErr('unsupported_type')) + '</span><span class="sc-drop-sub">' + T('sc.drop.another') + '</span>');
        srSay(status, uploadErr('unsupported_type'));
        return;
      }
      /* keep the <input> the source of truth where the browser allows it, so a later reset()
       * clears the same object the picker would have set */
      try { if (window.DataTransfer && input.files !== dt.files) input.files = dt.files; } catch (err) {}
      handleFile(file);
    });

    on(input, 'change', function () {
      var file = input.files && input.files[0]; if (!file) return;
      handleFile(file);
    });

    function handleFile(file) {
      trk('upload_added', dropId);
      remove.hidden = true;
      if (file.size > MAX_UPLOAD_BYTES) {
        drop.classList.add('is-error');
        setDropState(drop, '<span class="sc-drop-main sc-drop-main--err">' + T('sc.drop.toobig') + '</span><span class="sc-drop-sub">' + T('sc.drop.another') + '</span>');
        srSay(status, T('sc.drop.toobig')); return;
      }
      drop.classList.remove('is-error');
      setDropState(drop, '<span class="sc-drop-main">' + T('sc.drop.uploading') + ' <b class="sc-pct">0%</b></span><span class="sc-drop-sub">' + escapeHtml(file.name) + '</span>');
      var lastStep = -1;
      srSay(status, T('sc.a11y.uploading', { name: file.name, pct: 0 }));
      uploadFile(file, function (pct) {
        var p = qs('.sc-pct', drop); if (p) p.textContent = pct + '%';
        var step = Math.floor(pct / 25) * 25;              /* throttled: 0 / 25 / 50 / 75 / 100 */
        if (step !== lastStep) { lastStep = step; srSay(status, T('sc.a11y.uploading', { name: file.name, pct: step })); }
      }).then(function (res) {
        if (res.ok) {
          drop.classList.add('is-done');
          setDropState(drop, '<span class="sc-drop-main">✓ ' + escapeHtml(file.name) + '</span>');
          remove.hidden = false;
          remove.setAttribute('aria-label', T('sc.a11y.removeFile', { name: file.name }));
          srSay(status, T('sc.a11y.uploaded', { name: file.name }));
          onKey(res.key);
        } else {
          drop.classList.add('is-error');
          setDropState(drop, '<span class="sc-drop-main sc-drop-main--err">' + escapeHtml(res.error) + '</span><span class="sc-drop-sub">' + T('sc.drop.again') + '</span>');
          srSay(status, res.error);
        }
      });
    }
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function wireUploads() {
    wireDrop('sc-mediakit', 'application/pdf', function (k) { mediaKitKey = k; });
    wireDrop('sc-pic0', 'image/png,image/jpeg,image/webp', function (k) { sampleKeys[0] = k; });
    wireDrop('sc-pic1', 'image/png,image/jpeg,image/webp', function (k) { sampleKeys[1] = k; });
    wireDrop('sc-pic2', 'image/png,image/jpeg,image/webp', function (k) { sampleKeys[2] = k; });
  }

  /* ----------------------------------------------------------- turnstile
   * F-06: the widget gets a named container with a reserved height, a message slot that is a real
   * focusable node (so an error can point at something), and — if the challenge never renders —
   * an email route out instead of an instruction the user cannot follow. */
  function ensureTurnstileBox() {
    var box = $('sc-turnstile'); if (!box) return null;
    if (box.dataset.thxTsBox) return box;
    box.dataset.thxTsBox = '1';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', T('sc.ts.label'));
    var w = document.createElement('div'); w.id = 'sc-turnstile-widget'; w.className = 'sc-ts-widget';
    var m = document.createElement('p'); m.id = 'sc-turnstile-msg'; m.className = 'sc-ts-msg';
    m.setAttribute('role', 'status'); m.setAttribute('tabindex', '-1');
    box.appendChild(w); box.appendChild(m);
    return box;
  }
  function tsUnavailable() { var m = $('sc-turnstile-msg'); return !!(m && m.dataset.thxFallback); }
  function turnstileFallback() {
    var m = $('sc-turnstile-msg'); if (!m || m.dataset.thxFallback) return;
    m.dataset.thxFallback = '1';
    while (m.firstChild) m.removeChild(m.firstChild);
    var parts = String(T('sc.err.tsfallback')).split('{email}');
    m.appendChild(document.createTextNode(parts[0]));
    var a = document.createElement('a'); a.href = 'mailto:' + SCOUTING_EMAIL; a.textContent = SCOUTING_EMAIL;
    m.appendChild(a);
    if (parts.length > 1) m.appendChild(document.createTextNode(parts[1]));
    m.classList.add('is-on');
  }
  function renderTurnstile() {
    var box = ensureTurnstileBox(); if (!box) return;
    if (!window.turnstile) { return; }
    if (box.dataset.thxRendered) return;
    try {
      window.turnstile.render($('sc-turnstile-widget') || box, {
        sitekey: TURNSTILE_SITE_KEY, theme: 'light',
        callback: function (t) { turnstileToken = t; clearErr(); },
        'expired-callback': function () { turnstileToken = ''; },
        'error-callback': function () { turnstileToken = ''; turnstileFallback(); }
      });
      box.dataset.thxRendered = '1';
    } catch (e) { turnstileFallback(); }
  }
  /* There is nothing to verify until someone is actually filling the form in, so the Turnstile
   * form to be reachable (init) or for the first field focus, whichever happens first. */
  function wireTurnstileOnFocus() {
    function once(e) {
      var t = e.target;
      if (!t || !t.closest || !t.closest('#sc-form-you, #sc-form-work, #sc-form-consent')) return;
      document.removeEventListener('focusin', once, true);
      initTurnstile();
    }
    document.addEventListener('focusin', once, true);
  }
  function initTurnstile() {
    var box = ensureTurnstileBox(); if (!box) return;
    if (box.dataset.thxTsBoot) return; box.dataset.thxTsBoot = '1';
    loadScriptOnce(TURNSTILE_SRC, renderTurnstile);
    if (window.turnstile) renderTurnstile();
    else { var n = 0, iv = setInterval(function () { if (window.turnstile) { clearInterval(iv); renderTurnstile(); } else if (++n > 50) clearInterval(iv); }, 200); }
    /* blocked, broken or never painted — offer the email route rather than a 0 px dead end */
    setTimeout(function () {
      if (turnstileToken) return;
      var w = $('sc-turnstile-widget'), f = w && w.querySelector('iframe');
      if (!f || !f.offsetHeight) turnstileFallback();
    }, TURNSTILE_TIMEOUT_MS);
  }

  /* ---------------------------------------------------------------- QR */
  /* The QR is the desktop-only "carry on from your phone" code inside .sc-intro, so it is only
   * ever shown once the gate is clear and the viewport is wide. Load the library at that point —
   * never on a phone, never behind the gate. */
  function initQR() {
    var box = $('sc-qr'); if (!box) return;
    if (box.dataset.thxQrBoot) return;
    if (box.offsetParent === null && getComputedStyle(box).display === 'none') return;
    box.dataset.thxQrBoot = '1';
    loadScriptOnce(QR_SRC, function () {
      if (!window.QRCode || box.dataset.thxQr) return; box.dataset.thxQr = '1';
      try { new window.QRCode(box, { text: PAGE_URL, width: 120, height: 120, colorDark: '#0E0E0F', colorLight: '#F2F1EC', correctLevel: window.QRCode.CorrectLevel.M }); } catch (e) {}
      /* the library appends an unlabelled <img>: the box carries the name, the graphic is decorative */
      function labelQR() {
        qsa('img,canvas', box).forEach(function (n) { n.setAttribute('alt', ''); n.setAttribute('aria-hidden', 'true'); });
        box.setAttribute('role', 'img');
        box.setAttribute('aria-label', T('sc.qr.label'));
      }
      labelQR(); setTimeout(labelQR, 400);
    }, QR_SRI);
  }

  /* -------------------------------------------------------------- errors
   * F-05/SEM-23 + F-09: every message is rendered twice — once beside its own field, tied to the
   * control with aria-describedby, and once in #sc-err as an error summary of links. The whole
   * errs list is shown, not just the first one, and focus lands on the summary. */
  function fieldMsgId(id) { return id + '-err'; }
  /* the controls a message belongs to — the represented question is a pair of chips, not one input */
  function fieldControls(id) {
    if (id === 'sc-rep') return qsa('#sc-rep [data-val]');
    if (id === 'sc-turnstile') return [];
    var e = $(id); return e ? [e] : [];
  }
  function fieldMsgHost(id) {
    if (id === 'sc-rep') return $('sc-rep');
    if (id === 'sc-turnstile') return $('sc-turnstile');
    if (id === 'sc-consent' || id === 'sc-safety-ack') { var lab = qs('label[for="' + id + '"]'); return (lab && lab.parentNode) || null; }
    var e = $(id); if (!e) return null;
    return (e.closest && e.closest('.sc-field')) || e.parentNode;
  }
  /* where the summary link should send the keyboard: always a real focusable node (F-06) */
  function errAnchorTarget(id) {
    if (id === 'sc-rep') return qs('#sc-rep [data-val]');
    if (id === 'sc-turnstile') return $('sc-turnstile-msg') || $('sc-submit');
    return $(id) || $('sc-submit');
  }
  function setFieldMsg(id, msg) {
    if (id === 'sc-turnstile' && tsUnavailable()) return;   /* the fallback line already says it */
    var host = fieldMsgHost(id); if (!host) return;
    var mid = fieldMsgId(id), p = $(mid);
    if (!p) {
      p = document.createElement('p'); p.id = mid; p.className = 'sc-field-err';
      /* the consent host is the whole form — put the message under the checkbox, not under submit */
      var after = (id === 'sc-consent') ? ($('sc-consent-note') || qs('label[for="sc-consent"]'))
        : (id === 'sc-safety-ack') ? qs('label[for="sc-safety-ack"]') : null;
      if (after && after.parentNode === host) host.insertBefore(p, after.nextSibling); else host.appendChild(p);
    }
    p.textContent = msg;
    fieldControls(id).forEach(function (el) {
      var d = el.getAttribute('aria-describedby') || '';
      if (d.split(/\s+/).indexOf(mid) === -1) el.setAttribute('aria-describedby', d ? d + ' ' + mid : mid);
    });
  }
  function clearFieldMsgs() {
    qsa('.sc-field-err').forEach(function (p) {
      var mid = p.id;
      qsa('[aria-describedby~="' + mid + '"]').forEach(function (el) {
        var rest = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (t) { return t && t !== mid; });
        if (rest.length) el.setAttribute('aria-describedby', rest.join(' ')); else el.removeAttribute('aria-describedby');
      });
      if (p.parentNode) p.parentNode.removeChild(p);
    });
  }
  /* FORMS-03 needs a single-field eraser: clearFieldMsgs() wipes the whole form, which is right at
   * submit time and wrong on blur, when only the field just left may change. */
  function clearFieldMsg(id) {
    var mid = fieldMsgId(id), p = $(mid);
    if (p) {
      qsa('[aria-describedby~="' + mid + '"]').forEach(function (el) {
        var rest = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (t) { return t && t !== mid; });
        if (rest.length) el.setAttribute('aria-describedby', rest.join(' ')); else el.removeAttribute('aria-describedby');
      });
      if (p.parentNode) p.parentNode.removeChild(p);
    }
    fieldControls(id).forEach(function (e) { e.classList.remove('sc-input--error'); e.removeAttribute('aria-invalid'); });
  }
  function clearErr() {
    var box = $('sc-err');
    if (box) { box.style.display = 'none'; while (box.firstChild) box.removeChild(box.firstChild); }
    qsa('.sc-input--error').forEach(function (e) { e.classList.remove('sc-input--error'); });
    qsa('#sc-form-you [aria-invalid],#sc-form-work [aria-invalid],#sc-form-consent [aria-invalid]').forEach(function (e) { e.removeAttribute('aria-invalid'); });
    clearFieldMsgs();
  }
  function errSummaryHead(box) {
    while (box.firstChild) box.removeChild(box.firstChild);
    var h = document.createElement('p');
    h.id = 'sc-err-title'; h.className = 'sc-err-title'; h.setAttribute('tabindex', '-1');
    box.appendChild(h);
    return h;
  }
  function showErrList(errs) {
    var box = $('sc-err'); if (!box || !errs.length) return;
    var h = errSummaryHead(box);
    h.textContent = T('sc.err.summary');
    var ul = document.createElement('ul'); ul.className = 'sc-err-list';
    errs.forEach(function (pair) {
      var id = pair[0], msg = pair[1];
      setFieldMsg(id, msg);
      var li = document.createElement('li'), t = errAnchorTarget(id);
      if (t) {
        if (!t.id) t.id = id + '-anchor';
        var a = document.createElement('a');
        a.href = '#' + t.id; a.textContent = msg;
        a.addEventListener('click', function (ev) { ev.preventDefault(); focusEl(t, true); });
        li.appendChild(a);
      } else { li.textContent = msg; }
      ul.appendChild(li);
    });
    box.appendChild(ul);
    box.style.display = 'block';
    focusEl(h, true);
  }
  /* single-message form (server-side outcomes) — same summary box, same focus behaviour */
  function showErr(msg, firstBadId) {
    if (firstBadId) { showErrList([[firstBadId, msg]]); return; }
    var box = $('sc-err'); if (!box) return;
    var h = errSummaryHead(box);
    h.textContent = msg;
    box.style.display = 'block';
    focusEl(h, true);
  }
  function markBad(id) {
    fieldControls(id).forEach(function (e) { e.classList.add('sc-input--error'); e.setAttribute('aria-invalid', 'true'); });
  }

  /* -------------------------------------------------- inline validation (FORMS-03)
   * One rule per field, shared by blur and by submit, so the two can never disagree. Blur writes
   * only the field's own message — the #sc-err summary stays a submit-time affordance. Once a field
   * is marked bad it re-validates on input, so the error clears as the visitor fixes it. */
  function fieldError(id) {
    if (id === 'sc-email') { var e = val('sc-email'); return isEmail(e) ? null : T('sc.err.email'); }
    if (id === 'sc-firstName') return val('sc-firstName') ? null : T('sc.err.first');
    if (id === 'sc-lastName') return val('sc-lastName') ? null : T('sc.err.last');
    if (id === 'sc-dob') {
      var v = val('sc-dob'); if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return T('sc.err.dob');
      var a = ageFromDob(v); return (a != null && a < MIN_AGE) ? T('sc.err.age', { n: MIN_AGE }) : null;
    }
    if (id === 'sc-country') return val('sc-country') ? null : T('sc.err.country');
    if (id === 'sc-platform') return val('sc-platform') ? null : T('sc.err.platform');
    if (id === 'sc-rep') { var r = currentRepresented(); return (r === 'yes' || r === 'no') ? null : T('sc.err.rep'); }
    if (id === 'sc-representedBy') return (currentRepresented() === 'yes' && !val('sc-representedBy')) ? T('sc.err.repby') : null;
    if (id === 'sc-otherPlatform') return (val('sc-platform') === 'other' && !val('sc-otherPlatform')) ? T('sc.err.other') : null;
    if (id === 'sc-link1' || id === 'sc-link2' || id === 'sc-link3') { var l = val(id); return (l && !isUrl(l)) ? T('sc.err.links') : null; }
    if (id === 'sc-consent') { var c = $('sc-consent'); return (c && c.checked) ? null : T('sc.err.consent'); }
    if (id === 'sc-safety-ack') { var k = $('sc-safety-ack'); return (k && k.checked) ? null : T('sc.err.safety'); }
    return null;
  }
  function validateField(id) {
    var msg = fieldError(id);
    if (msg) { markBad(id); setFieldMsg(id, msg); } else clearFieldMsg(id);
    return msg;
  }
  function isBad(id) { return fieldControls(id).some(function (e) { return e.getAttribute('aria-invalid') === 'true'; }); }
  var INLINE_BLUR = ['sc-email', 'sc-firstName', 'sc-lastName', 'sc-dob', 'sc-representedBy', 'sc-otherPlatform', 'sc-link1', 'sc-link2', 'sc-link3'];
  var INLINE_CHANGE = ['sc-country', 'sc-platform', 'sc-consent', 'sc-safety-ack'];
  function wireInlineValidation() {
    INLINE_BLUR.forEach(function (id) {
      var e = $(id); if (!e || e.dataset.thxInline) return; e.dataset.thxInline = '1';
      on(e, 'blur', function () { if (id === 'sc-dob') { evaluateAge(true); if (!dobAge()) validateField(id); } else validateField(id); });
      on(e, 'input', function () { if (isBad(id)) validateField(id); });
    });
    INLINE_CHANGE.forEach(function (id) {
      var e = $(id); if (!e || e.dataset.thxInline) return; e.dataset.thxInline = '1';
      on(e, 'change', function () { if (id === 'sc-safety-ack' || id === 'sc-consent') { if (e.checked) clearFieldMsg(id); else if (isBad(id)) validateField(id); } else validateField(id); });
    });
    qsa('#sc-rep [data-val]').forEach(function (b) { on(b, 'click', function () { if (isBad('sc-rep')) validateField('sc-rep'); }); });
  }

  /* -------------------------------------------------------------- submit */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  function readUtm() {
    var o = {}, any = false;
    try {
      var q = new URLSearchParams(location.search);
      UTM_KEYS.forEach(function (k) { var v = q.get(k); if (v) { o[k] = String(v).slice(0, 64); any = true; } });
      if (!any) { var st = sessionStorage.getItem('thx_utm_v1'); if (st) { var j = JSON.parse(st); if (j && typeof j === 'object') UTM_KEYS.forEach(function (k) { if (j[k]) o[k] = String(j[k]).slice(0, 64); }); } }
    } catch (e) {}
    return o;
  }
  function collectAndValidate() {
    clearErr();
    var errs = [];
    function need(id, msg) { var v = val(id); if (!v) { markBad(id); errs.push([id, msg]); } return v; }

    var email = val('sc-email');
    if (!isEmail(email)) { markBad('sc-email'); errs.push(['sc-email', T('sc.err.email')]); }
    var firstName = need('sc-firstName', T('sc.err.first'));
    var lastName = need('sc-lastName', T('sc.err.last'));
    /* FORMS-04: the date is the only age answer there is, so there is no second one to disagree
       with — the ±1 cross-check against the old entry gate is gone with the gate. */
    var dob = val('sc-dob');
    var dobErr = fieldError('sc-dob');
    if (dobErr) { markBad('sc-dob'); errs.push(['sc-dob', dobErr]); }
    var country = val('sc-country'); if (!country) { markBad('sc-country'); errs.push(['sc-country', T('sc.err.country')]); }
    var city = val('sc-city'); // optional
    var platform = val('sc-platform'); if (!platform) { markBad('sc-platform'); errs.push(['sc-platform', T('sc.err.platform')]); }
    var rep = currentRepresented(); if (rep !== 'yes' && rep !== 'no') { markBad('sc-rep'); errs.push(['sc-rep', T('sc.err.rep')]); }
    var representedBy = val('sc-representedBy');
    if (rep === 'yes' && !representedBy) { markBad('sc-representedBy'); errs.push(['sc-representedBy', T('sc.err.repby')]); }
    var otherPlatform = val('sc-otherPlatform');
    if (platform === 'other' && !otherPlatform) { markBad('sc-otherPlatform'); errs.push(['sc-otherPlatform', T('sc.err.other')]); }

    var links = ['sc-link1', 'sc-link2', 'sc-link3'].map(val).filter(Boolean);
    for (var i = 0; i < links.length; i++) { if (!isUrl(links[i])) { errs.push(['sc-link1', T('sc.err.links')]); break; } }

    var ack = $('sc-safety-ack'); if (!ack || !ack.checked) { markBad('sc-safety-ack'); errs.push(['sc-safety-ack', T('sc.err.safety')]); }
    var consent = $('sc-consent'); if (!consent || !consent.checked) { markBad('sc-consent'); errs.push(['sc-consent', T('sc.err.consent')]); }
    if (!turnstileToken) { errs.push(['sc-turnstile', tsUnavailable() ? T('sc.err.tsfallback', { email: SCOUTING_EMAIL }) : T('sc.err.turnstile')]); }

    if (errs.length) { showErrList(errs); return null; }

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
    /* UTM-05: the application row can be credited to a campaign. session joins it to funnel_events,
       landingPath says which page converted, utm comes from the head beacon's sessionStorage copy
       (so an in-site click that stripped the query string still carries the campaign) and falls back
       to the live URL. The worker stores them; nothing here is PII. */
    try { var sid = sessionStorage.getItem('thx_sid_v1'); if (sid) payload.session = sid; } catch (e) {}
    payload.landingPath = location.pathname || '/scouting';
    payload.utm = readUtm();
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
          showErr(tsUnavailable() ? T('sc.err.tsfallback', { email: SCOUTING_EMAIL }) : T('sc.err.turnstile'), 'sc-turnstile');
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
    /* INST-02 / FORMS-02 / UTM-04: the conversion is emitted here, where the worker has already
       answered ok — never inferred from whether a position:fixed panel looks visible. */
    trk('application_submitted', null, true);
    trk('success_view', null, true);
    showApp(false);
    var success = $('sc-success');
    if (success) { show(success, 'flex'); var hh = qs('.sc-success-title', success); if (hh) { try { hh.focus(); } catch (e) {} } }
    try { initQR(); } catch (e) {}
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
      ':root{--sc-ink:#0E0E0F;--sc-paper:#F2F1EC;--sc-dark:#0a0a0c;--sc-mute:rgba(14,14,15,0.7);--sc-mute-ink:rgba(242,241,236,0.6);--sc-hair:rgba(14,14,15,0.16);--sc-hair-ink:rgba(242,241,236,0.2);--sc-line:rgba(14,14,15,0.55);--sc-err:#8A1F1B;}',
      '.sc-app-sans{font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif;}',
      '#sc-form-you,#sc-form-work,#sc-form-consent{background:var(--sc-paper);color:var(--sc-ink);font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif;}',
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
      '.sc-input,.sc-select,.sc-textarea{width:100%;background:transparent;border:0;border-bottom:1px solid var(--sc-line);padding:8px 0 10px;font-family:inherit;font-size:clamp(16px,1.5vw,18px);color:var(--sc-ink);border-radius:0;-webkit-appearance:none;appearance:none;transition:border-color 160ms var(--sc-ease);}',
      '.sc-textarea{resize:vertical;min-height:96px;}',
      '.sc-select{background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'><path d=\'M1 1l5 5 5-5\' stroke=\'%230E0E0F\' fill=\'none\' stroke-width=\'1.4\'/></svg>");background-repeat:no-repeat;background-position:right 2px center;--sc-arrow:1;padding-inline-end:20px;}',
      '.sc-input:focus,.sc-select:focus,.sc-textarea:focus{outline:none;border-bottom-color:var(--sc-ink);border-bottom-width:1.5px;}',
      '.sc-input::placeholder,.sc-textarea::placeholder{color:rgba(14,14,15,0.4);}',
      '.sc-input--error{border-bottom-color:var(--sc-err)!important;}',
      '.sc-chips{display:flex;gap:12px;flex-wrap:wrap;}',
      '.sc-chip{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;padding:9px 18px;border:1px solid var(--sc-line);background:transparent;color:var(--sc-ink);cursor:pointer;transition:background-color 140ms var(--sc-ease),border-color 140ms var(--sc-ease),color 140ms var(--sc-ease),transform 140ms var(--sc-ease);}',
      '.sc-chip[data-on="true"]{background:var(--sc-ink);color:var(--sc-paper);border-color:var(--sc-ink);}',
      '.sc-legend{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:12px;display:block;}',
      '.sc-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;aspect-ratio:4/3;border:1px dashed var(--sc-line);text-align:center;cursor:pointer;padding:16px;transition:background-color 160ms var(--sc-ease),border-color 160ms var(--sc-ease),transform 160ms var(--sc-ease);}',
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
      /* Mirror of <style id="sc-gate-preboot"> in the page head. Phase 10 inverted it: the offer and
         the form are the default state, and the root class only ever takes something away. The
         html:not() prefix is not decoration — the page's own native <style> block sits in the body,
         after this sheet, and declares #sc-form-*{display:none}, so the default has to out-specify
         it rather than merely follow it.
         2.2.0 adds a second root class, html.sc-gated (stated at the very end of this sheet), which
         hides the same three sections while the age dialog is unanswered. This file stamps it in its
         first synchronous task, which is as early as a deferred script can act — but the page has
         already painted by then on a slow connection. To close that window the page head needs one
         extra rule in <style id="sc-gate-preboot">:
             html.sc-gated #sc-form-you,html.sc-gated #sc-form-work,html.sc-gated #sc-form-consent{display:none!important}
         and one extra line in the two-line preboot script beside it, which already reads the same
         sessionStorage key:
             if(!g.gatePassed)document.documentElement.classList.add('sc-gated');
         That pair fails closed: if this file never loads, the form stays hidden and nobody reaches
         it without an age check — which for an age check is the right way round. */
      'html:not(.sc-u14) #sc-form-you,html:not(.sc-u14) #sc-form-work,html:not(.sc-u14) #sc-form-consent{display:block;}',
      'html.sc-u14 #sc-form-you,html.sc-u14 #sc-form-work,html.sc-u14 #sc-form-consent{display:none;}',
      'html.sc-u14 #sc-gate-u14{display:block;}',
      /* live ineligibility: the form stays put, the submit row is what gets replaced */
      'html.sc-inelig #sc-gate-u14{display:block;}',
      'html.sc-inelig #sc-submit,html.sc-inelig #sc-turnstile{display:none;}',
      'html.sc-done .sc-intro,html.sc-done #sc-safety,html.sc-done #sc-form-you,html.sc-done #sc-form-work,html.sc-done #sc-form-consent,html.sc-done #sc-gate-u14{display:none!important;}',
      /* reserve the QR box so the code does not push the intro around when it renders */
      '#sc-qr{width:120px;height:120px;}',
      '.sc-err{display:none;margin-top:22px;border-inline-start:2px solid var(--sc-err);padding-inline-start:16px;color:var(--sc-err);font-size:15px;line-height:1.5;}',
      '.sc-submit{margin-top:28px;width:100%;max-width:420px;display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--sc-ink);color:var(--sc-paper);border:1px solid var(--sc-ink);padding:18px 28px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:background-color 160ms var(--sc-ease),border-color 160ms var(--sc-ease),color 160ms var(--sc-ease),opacity 160ms var(--sc-ease),transform 160ms var(--sc-ease);}',
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
      /* LAND-01: the two black overlays are gone. #sc-success is the one panel that still earns a
         fixed layer — it is shown only after the worker has accepted the application. */
      '#sc-success{display:none;position:fixed;inset:0;z-index:9000;overflow-y:auto;background:var(--sc-ink);color:var(--sc-paper);font-family:"Objectivity","Archivo",sans-serif;}',
      '.sc-gate-inner{max-width:640px;margin:0 auto;padding:64px 28px;width:100%;}',
      '.sc-gate-inner--center{text-align:center;max-width:440px;}',
      '.sc-gate-eyebrow{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--sc-mute-ink);margin-bottom:24px;display:block;}',
      '.sc-gate-h{font-family:"Objectivity","Archivo",sans-serif;font-weight:700;font-size:clamp(28px,4vw,46px);line-height:1.05;margin:0;}',
      '.sc-gate-body{font-size:16px;line-height:1.7;margin:28px 0 0;color:var(--sc-paper);}',
      '.sc-gate-body a{color:var(--sc-paper);text-decoration:underline;text-underline-offset:2px;}',
      '.sc-gate-note{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:12px;line-height:1.6;color:var(--sc-mute-ink);margin-top:28px;}',
      '.sc-gate-btn{margin-top:40px;background:var(--sc-paper);color:var(--sc-ink);border:1px solid var(--sc-paper);padding:16px 32px;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:background-color 160ms var(--sc-ease),border-color 160ms var(--sc-ease),color 160ms var(--sc-ease),opacity 160ms var(--sc-ease),transform 160ms var(--sc-ease);}',
      '.sc-gate-btn:hover:not(:disabled){background:transparent;color:var(--sc-paper);}',
      '.sc-gate-btn:disabled{opacity:.5;cursor:not-allowed;}',
      '#sc-success .sc-gate-inner{min-height:70vh;display:flex;flex-direction:column;justify-content:center;}',
      '.sc-success-title{font-family:"Objectivity","Archivo",sans-serif;font-weight:800;font-size:clamp(40px,7vw,96px);line-height:1;margin:0;}',
      /* ---- v1.2.0 editorial pass: charcoal hero, no ghost, black headings, more air ---- */
      /* Hero: short charcoal band, thin uppercase wordmark, drop the giant THEODYX ghost */
      /* Phase 10: the band keeps the exact height the page-head preboot reserved for it. If this
         sheet dropped it back to min-height:0 the hero would shrink the moment the script landed and
         drag the whole page up with it — measured at 0.116 CLS on a 390 px viewport. */
      '.sc-hero{background:#000000!important;position:relative!important;min-height:clamp(470px,50vw,620px)!important;height:auto!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;gap:clamp(14px,1.6vw,20px)!important;padding:calc(clamp(80px,11vw,128px) + 34px) clamp(22px,6vw,72px) clamp(56px,7vw,84px)!important;}',
      '.sc-hero-ghost{display:none!important;}',
      /* 46px overflowed the hero's own padding at 360 px, and the resulting one-line/two-line
         ambiguity was the last shift left on the page: the webfont swap re-laid the wordmark for
         0.035 CLS. At 42 px it fits on one line at every width, and with line-height fixed at 0.96
         the metric-matched fallback and the real face occupy the same box. Declared identically in
         the page-head preboot, so first paint already has these metrics. */
      '.sc-hero-title{color:#F2F1EC!important;font-family:"Archivo","Theodyx Sans Fallback","Objectivity",sans-serif!important;font-weight:300!important;font-size:clamp(42px,9vw,124px)!important;letter-spacing:0.012em!important;line-height:0.96!important;margin:0!important;text-transform:uppercase!important;}',
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
      '.sc-photo img{display:block;width:clamp(216px,25vw,296px);aspect-ratio:3/4;object-fit:cover;filter:grayscale(1) contrast(1.03);transition:filter var(--thx-dur-base,320ms) var(--sc-ease,cubic-bezier(.22,1,.36,1))!important;}',
      '.sc-photo:hover img{filter:grayscale(0) contrast(1);}',
      '@media(max-width:700px){.sc-photo{align-self:center;margin-top:8px;}}',
      /* QR is "continue on your phone" — pointless on a phone; desktop only */
      '@media(max-width:767px){.sc-qr-wrap,.sc-qr,#sc-qr,.sc-qr-cap{display:none!important;}}',
      /* remove the "Theodyx · Scouting" / "01 — You" / "02 — Work" eyebrow+bar labels */
      '.sc-eyebrow{display:none!important;}',
      /* consent text was rendering white on cream */
      '.sc-consent-text,.sc-consent-text *{color:var(--sc-ink)!important;}',
      /* success "Return home" button (anchor styled as gate button) */
      '.sc-home-btn{display:inline-block;text-decoration:none!important;margin-top:clamp(28px,4vw,44px);}',
      /* ------------------------- Phase 9 accessibility -------------------------
         C-04: the fields, chips and dropzones were bounded by a 1.89:1 hairline. Both the page's
         compiled Webflow CSS and the native <style> block state that colour literally, and the
         native block sits in the body (after this sheet), so the lift is stated explicitly.
         #sc-age-select is excluded — it sits on the dark gate and takes the ink-side hairline. */
      ':root{--sc-line:rgba(14,14,15,0.55)!important;}',
      '.sc-input:not(:focus),.sc-textarea:not(:focus),.sc-select:not(:focus):not(#sc-age-select){border-bottom-color:rgba(14,14,15,0.55)!important;}',
      '.sc-chip:not([data-on="true"]){border-color:rgba(14,14,15,0.55)!important;}',
      '.sc-drop{border-color:rgba(14,14,15,0.55)!important;}',
      '.sc-chip.sc-input--error{border-color:var(--sc-err)!important;}',
      /* C-05: placeholders were 2.61:1 */
      '.sc-input::placeholder,.sc-textarea::placeholder{color:rgba(14,14,15,0.62)!important;}',
      /* F-08 */
      '.sc-req-note{font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--sc-mute);margin:0 0 28px;}',
      '.sc-req{color:var(--sc-err);}',
      /* F-05 / F-09 — error summary + per-field messages */
      '.sc-field-err{margin:8px 0 0;font-size:14px;line-height:1.45;color:var(--sc-err);}',
      '.sc-err-title{margin:0 0 8px;font-weight:600;color:var(--sc-err);}',
      '.sc-err-list{margin:0;padding-inline-start:20px;}',
      '.sc-err-list li{margin:4px 0;}',
      '.sc-err-list a{color:var(--sc-err);text-decoration:underline;text-underline-offset:2px;}',
      /* F-06 — reserved, labelled verification box with a visible message slot */
      '#sc-turnstile{margin-top:28px;min-height:70px;}',
      '.sc-ts-msg{display:none;margin:10px 0 0;font-size:14px;line-height:1.5;color:var(--sc-err);}',
      '.sc-ts-msg.is-on{display:block;}',
      '.sc-ts-msg a{color:var(--sc-err);text-decoration:underline;text-underline-offset:2px;}',
      /* F-13 — button dropzone, sibling Remove button, hidden status region */
      '.sc-drop-wrap{display:flex;flex-direction:column;align-items:stretch;gap:8px;}',
      'button.sc-drop{width:100%;font:inherit;color:inherit;background:transparent;}',
      '.sc-drop-input{display:none!important;}',
      '.sc-drop-main--err{color:var(--sc-err);}',
      'button.sc-drop-remove{align-self:flex-start;background:none;border:0;padding:2px 0;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;color:var(--sc-ink);text-decoration:underline;text-underline-offset:2px;cursor:pointer;}',
      '.sc-sr-only{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;}',
      /* F-17 */
      '.sc-consent-note{margin:10px 0 0;font-size:14px;line-height:1.6;color:var(--sc-mute);}',

      /* ---------------------- Phase 10: the offer, above the fold (LAND-01) ----------------------
         The hero band reserves its own height in the page-head preboot, so the eyebrow, sentence and
         CTA that this file adds land inside space that was already painted. Content is bottom-aligned,
         so any spare reserved height reads as air above the wordmark rather than as a jump. */
      /* the eyebrow is taken out of flow and its 34 px band is reserved by the hero's padding-top,
         in this sheet and in the page-head preboot alike — so the h1 (the LCP element) occupies the
         same pixels before and after this file runs, and the band's height never changes. */
      '.sc-hero-eyebrow{position:absolute;top:clamp(80px,11vw,128px);inset-inline-start:clamp(22px,6vw,72px);font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(242,241,236,0.72);margin:0;}',
      '.sc-hero-sub{font-family:"Objectivity","Archivo",sans-serif;font-size:clamp(16px,1.6vw,20px);line-height:1.5;color:rgba(242,241,236,0.86);margin:0;max-width:46ch;}',
      'a.sc-hero-cta{display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin-top:clamp(6px,1vw,12px);padding:14px 26px;border-radius:20px;background:#F2F1EC;color:#0E0E0F;border:1px solid #F2F1EC;font-family:"Objectivity","Archivo",sans-serif;font-size:16px;line-height:1;text-decoration:none;transition:background .16s ease,color .16s ease;}',
      'a.sc-hero-cta:hover{background:transparent;color:#F2F1EC;}',
      'a.sc-hero-cta:focus-visible{outline:2px solid #F2F1EC;outline-offset:3px;}',

      /* the safety statement, demoted from a full-screen dialog to an ordinary section above the form */
      '#sc-safety{background:var(--sc-ink);color:var(--sc-paper);}',
      '#sc-safety .sc-h2{color:var(--sc-paper)!important;}',
      '.sc-safety-eyebrow{display:block;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--sc-mute-ink);margin-bottom:clamp(20px,3vw,28px);}',
      '.sc-safety-body{font-family:"Objectivity","Archivo",sans-serif;font-size:clamp(15px,1.4vw,17px);line-height:1.72;color:var(--sc-paper);margin:0;max-width:62ch;}',
      '.sc-safety-body a{color:var(--sc-paper);text-decoration:underline;text-underline-offset:2px;}',

      /* the acknowledgement checkbox, styled as a sibling of the consent box */
      '.sc-consent--ack{margin-bottom:20px;}',
      '.sc-ack-link{color:var(--sc-ink);text-decoration:underline;text-underline-offset:2px;}',

      /* the ineligibility note in its two homes: standing in for the form on a returning tab, and
         standing in for the submit row while the visitor is still typing */
      '.sc-u14-inline{margin:8px 0 0;padding:24px 0 0;border-top:1px solid var(--sc-hair);}',
      '.sc-u14-inline .sc-h2{font-size:clamp(22px,2.6vw,30px)!important;}',
      '.sc-u14-change{background:var(--sc-ink);color:var(--sc-paper);border:1px solid var(--sc-ink);margin-top:24px;}',
      '.sc-u14-change:hover:not(:disabled){background:transparent;color:var(--sc-ink);}',

      /* ---------------------------- Phase 11: motion (EASE-03 / ACT-04) ----------------------------
         One spring token for every control on this page. `transition:all` is gone from the chips, the
         submit, the gate buttons and the dropzones — each now names only the properties its own
         :hover / :focus / [data-on] / .is-over rules actually change, so nothing schedules a layout
         or a shadow pass. Durations stay in the 140-240 ms UI band. */
      ':root{--sc-ease:cubic-bezier(.22,1,.36,1);}',
      /* The page's own <style id="sc-native-css"> block (Webflow page custom code, in the body and
         therefore later in the cascade) restates `.sc-chip{transition:all .14s ease}`,
         `.sc-submit`/`.sc-gate-btn{transition:all .16s ease}` and `.sc-drop{transition:background
         .14s ease}`. This file cannot edit that block, so the explicit lists are stated !important
         here — that is the only way `all` actually leaves the computed style. */
      '.sc-chip{transition:background-color 140ms var(--sc-ease),border-color 140ms var(--sc-ease),color 140ms var(--sc-ease),transform 140ms var(--sc-ease)!important;}',
      '.sc-submit,.sc-gate-btn,.sc-u14-change{transition:background-color 160ms var(--sc-ease),border-color 160ms var(--sc-ease),color 160ms var(--sc-ease),opacity 160ms var(--sc-ease),transform 160ms var(--sc-ease)!important;}',
      '.sc-input,.sc-select,.sc-textarea{transition:border-color 160ms var(--sc-ease)!important;}',
      '.sc-drop{transition:background-color 160ms var(--sc-ease),border-color 160ms var(--sc-ease),transform 160ms var(--sc-ease)!important;}',
      'a.sc-hero-cta{transition:background-color 160ms var(--sc-ease),color 160ms var(--sc-ease),transform 160ms var(--sc-ease)!important;}',
      /* ACT-04 — the zone advertises a drop, so a drag now gets an answer: a solid border, a real
         tint (the old 2% hover read as 1% on screen) and a 1.5% lift on transform only. The native
         block's `.sc-drop:hover` ties on specificity and lands later, and a drag is always a hover,
         so the drag state is stated !important too. */
      'button.sc-drop:hover:not(.is-done){background-color:rgba(14,14,15,0.05)!important;border-color:var(--sc-ink)!important;}',
      'button.sc-drop.is-over{background-color:rgba(14,14,15,0.07)!important;border-style:solid;border-color:var(--sc-ink)!important;transform:scale(1.015);}',
      '.sc-drop.is-over .sc-drop-main,.sc-drop.is-over .sc-drop-sub{color:var(--sc-ink);}',
      '.sc-drop:focus-visible{outline:2px solid var(--sc-ink);outline-offset:3px;}',
      /* RM parity with the rest of the suite: colour feedback survives, movement does not. */
      '@media (prefers-reduced-motion: reduce){',
      '.sc-chip,.sc-submit,.sc-gate-btn,.sc-u14-change,.sc-input,.sc-select,.sc-textarea,.sc-drop,a.sc-hero-cta{transition-duration:1ms!important;}',
      'button.sc-drop.is-over{transform:none;}',
      '}',
      /* forced colours drop author backgrounds, so the drag state needs a system-colour outline */
      '@media (forced-colors: active){',
      '.sc-drop.is-over{outline:3px solid Highlight;outline-offset:-5px;}',
      '}',

      /* ------------------------- 2.2.0: the age-verification gate -------------------------
         Last in the sheet on purpose: html.sc-gated has to out-rank the open-by-default rule
         stated above (and the identical one in the page head's <style id="sc-gate-preboot">),
         and #sc-gate-age.is-open has to out-rank the page's own <style id="sc-native-css">
         embed, which sits in the body and declares #sc-gate-age{display:none}. */
      'html.sc-gated #sc-form-you,html.sc-gated #sc-form-work,html.sc-gated #sc-form-consent{display:none!important;}',
      '#sc-gate-age{display:none;}',
      '#sc-gate-age.is-open{display:flex;position:fixed;inset:0;z-index:9500;overflow-y:auto;align-items:flex-start;justify-content:center;padding:24px 20px;background:rgba(10,10,12,0.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:var(--sc-paper);font-family:"Objectivity","Archivo",sans-serif;}',
      '#sc-gate-age:focus{outline:none;}',
      /* margin:auto centres the card when there is room and refuses to clip its top when there is
         not — which align-items:center would do on a 390 px viewport. */
      '#sc-gate-age .sc-gate-inner{margin:auto;width:100%;max-width:560px;padding:clamp(30px,5vw,44px);background:var(--sc-ink);border:1px solid rgba(242,241,236,0.22);text-align:start;}',
      '#sc-gate-age.is-open .sc-gate-inner{animation:sc-gate-in 240ms var(--sc-ease,cubic-bezier(.22,1,.36,1)) both;}',
      '@keyframes sc-gate-in{from{opacity:0;transform:translate3d(0,12px,0) scale(.985);}to{opacity:1;transform:none;}}',
      '#sc-gate-age .sc-gate-eyebrow{margin-bottom:16px;}',
      '#sc-gate-age .sc-gate-h{font-size:clamp(26px,3.4vw,38px);margin:0;}',
      '#sc-gate-age .sc-gate-body{font-size:15px;line-height:1.65;margin-top:20px;}',
      '.sc-gate-field{max-width:320px;margin:30px 0 0;}',
      '.sc-gate-field .sc-label{display:block;font-family:"Space Mono","Mono",ui-monospace,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--sc-paper)!important;margin-bottom:8px;}',
      '.sc-gate-input{width:100%;background:transparent;border:0;border-bottom:1px solid rgba(242,241,236,0.55);border-radius:0;padding:8px 0 10px;font-family:inherit;font-size:17px;color:var(--sc-paper);color-scheme:dark;-webkit-appearance:none;appearance:none;transition:border-color 160ms var(--sc-ease,cubic-bezier(.22,1,.36,1));}',
      '.sc-gate-input:focus{outline:none;border-bottom-color:var(--sc-paper);border-bottom-width:1.5px;}',
      '.sc-gate-input:focus-visible{outline:2px solid var(--sc-paper);outline-offset:4px;}',
      '.sc-gate-input.is-bad{border-bottom-color:#FFB4AE;}',
      '#sc-gate-msg{display:none;margin:14px 0 0;font-size:14px;line-height:1.5;color:#FFB4AE;}',
      '#sc-gate-msg.is-on{display:block;}',
      '#sc-gate-age .sc-gate-btn{margin-top:28px;}',
      '#sc-gate-age .sc-gate-btn:focus-visible{outline:2px solid var(--sc-paper);outline-offset:3px;}',
      '#sc-gate-age .sc-gate-note{margin-top:20px;}',
      /* the statement is long and it is not going to be shortened — it is the point of the dialog.
         On a phone it is set a step tighter so the date field is one short scroll away, not two. */
      '@media(max-width:480px){',
      '#sc-gate-age.is-open{padding:16px 12px;}',
      '#sc-gate-age .sc-gate-inner{padding:26px 22px;}',
      '#sc-gate-age .sc-gate-body{font-size:14px;line-height:1.6;margin-top:16px;}',
      '.sc-gate-field{margin-top:24px;}',
      '}',
      '@media (prefers-reduced-motion: reduce){',
      '#sc-gate-age.is-open .sc-gate-inner{animation:none;}',
      '.sc-gate-input{transition-duration:1ms!important;}',
      '}',
      '@media (forced-colors: active){',
      '#sc-gate-age.is-open{background:Canvas;-webkit-backdrop-filter:none;backdrop-filter:none;}',
      '#sc-gate-age .sc-gate-inner{background:Canvas;border:1px solid CanvasText;}',
      '#sc-gate-age .sc-gate-eyebrow,#sc-gate-age .sc-gate-note,#sc-gate-msg{color:CanvasText;}',
      '.sc-gate-input{border-bottom-color:CanvasText;color:CanvasText;}',
      '}'
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
'<section class="sc-hero"><span class="sc-hero-eyebrow">'+T('sc.hero.eyebrow')+'</span><h1 class="sc-hero-title">Our Scouting</h1><p class="sc-hero-sub">'+T('sc.hero.sub')+'</p><a id="sc-hero-cta" class="thxo-btn sc-hero-cta" href="#sc-form-you">'+T('sc.hero.cta')+'</a></section>',
'<section id="sc-safety" class="sc-section sc-app-sans sc-safety" aria-labelledby="sc-safety-h"><span class="sc-safety-eyebrow">Theodyx — Safety</span><h2 class="sc-h2 sc-safety-h" id="sc-safety-h">Your safety comes first.</h2><p class="sc-safety-body">Safety is our top priority. Protecting aspiring creatives — including young individuals — from online predators is of the utmost importance. If you would like to confirm an email or communication is from an official Theodyx representative or affiliate, email <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a> and we will be glad to confirm. Theodyx never asks for photos in the nude or lingerie and never requires any kind of payment. If something doesn’t feel right, please don’t hesitate to contact us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</p></section>',
'<section id="sc-form-you" class="sc-section sc-app-sans" aria-label="'+T('sc.sec.you')+'"><div class="sc-eyebrow">'+T('sc.eyebrow.you')+'</div><h2 class="sc-h2">'+T('sc.h2.you')+'</h2><form class="sc-form" novalidate><div class="sc-grid"><div class="sc-field sc-full"><label class="sc-label" for="sc-email">'+T('sc.lbl.email')+'</label><input id="sc-email" class="sc-input" type="email" autocomplete="email" inputmode="email" required placeholder="'+T('sc.ph.email')+'"></div><div class="sc-field"><label class="sc-label" for="sc-firstName">'+T('sc.lbl.firstName')+'</label><input id="sc-firstName" class="sc-input" type="text" autocomplete="given-name" required></div><div class="sc-field"><label class="sc-label" for="sc-lastName">'+T('sc.lbl.lastName')+'</label><input id="sc-lastName" class="sc-input" type="text" autocomplete="family-name" required></div><div class="sc-field"><label class="sc-label" for="sc-dob">'+T('sc.lbl.dob')+'</label><input id="sc-dob" class="sc-input" type="date" autocomplete="bday" required></div><div class="sc-field"><label class="sc-label" for="sc-platform">'+T('sc.lbl.platform')+'</label><select id="sc-platform" class="sc-select" required></select></div><div class="sc-field"><label class="sc-label" for="sc-country">'+T('sc.lbl.country')+'</label><select id="sc-country" class="sc-select" autocomplete="country-name" required></select></div><div class="sc-field"><label class="sc-label" for="sc-state">'+T('sc.lbl.state')+'</label><input id="sc-state" class="sc-input" type="text" autocomplete="address-level1" placeholder="'+T('sc.ph.state')+'"></div><div class="sc-field"><label class="sc-label" for="sc-city">'+T('sc.lbl.city')+'</label><input id="sc-city" class="sc-input" type="text" autocomplete="address-level2" placeholder="'+T('sc.ph.city')+'"></div><div class="sc-field"><label class="sc-label" for="sc-instagram">'+T('sc.lbl.instagram')+'</label><input id="sc-instagram" class="sc-input" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="'+T('sc.ph.handle')+'"></div><div class="sc-field"><label class="sc-label" for="sc-tiktok">'+T('sc.lbl.tiktok')+'</label><input id="sc-tiktok" class="sc-input" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="'+T('sc.ph.handle')+'"></div><div class="sc-field"><label class="sc-label" for="sc-youtube">'+T('sc.lbl.youtube')+'</label><input id="sc-youtube" class="sc-input" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="'+T('sc.ph.youtube')+'"></div><div class="sc-field" id="sc-other-wrap"><label class="sc-label" for="sc-otherPlatform">'+T('sc.lbl.otherPlatform')+'</label><input id="sc-otherPlatform" class="sc-input" type="text" placeholder="'+T('sc.ph.otherPlatform')+'"><label class="sc-label sc-label--stack" for="sc-otherHandle">Handle on that platform</label><input id="sc-otherHandle" class="sc-input" type="text"></div><div class="sc-field sc-full" id="sc-rep"><span class="sc-legend" id="sc-rep-legend">'+T('sc.legend.rep')+'</span><div class="sc-chips" role="group" aria-labelledby="sc-rep-legend"><button type="button" id="sc-rep-no" class="sc-chip" data-val="no" data-on="false" aria-pressed="false">'+T('sc.no')+'</button><button type="button" id="sc-rep-yes" class="sc-chip" data-val="yes" data-on="false" aria-pressed="false">'+T('sc.yes')+'</button></div></div><div class="sc-field sc-full" id="sc-representedBy-wrap"><label class="sc-label" for="sc-representedBy">'+T('sc.lbl.representedBy')+'</label><input id="sc-representedBy" class="sc-input" type="text" placeholder="'+T('sc.ph.representedBy')+'"></div><div class="sc-field sc-full"><label class="sc-label" for="sc-notes">'+T('sc.lbl.notes')+'</label><textarea id="sc-notes" class="sc-textarea" rows="4" placeholder="Anything we should know? (optional)"></textarea></div></div></form></section>',
'<section id="sc-form-work" class="sc-section sc-app-sans" aria-label="'+T('sc.sec.work')+'"><div class="sc-eyebrow">'+T('sc.eyebrow.work')+'</div><h2 class="sc-h2">'+T('sc.h2.work')+'</h2><p class="sc-text">'+T('sc.text.work')+'</p><form class="sc-form" novalidate><div class="sc-grid3"><div class="sc-field"><label class="sc-label" for="sc-link1">'+T('sc.lbl.link1')+'</label><input id="sc-link1" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div><div class="sc-field"><label class="sc-label" for="sc-link2">'+T('sc.lbl.link2')+'</label><input id="sc-link2" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div><div class="sc-field"><label class="sc-label" for="sc-link3">'+T('sc.lbl.link3')+'</label><input id="sc-link3" class="sc-input" type="url" inputmode="url" placeholder="https://…"></div></div><div class="sc-block"><label class="sc-label">Media kit (PDF) <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-mediakit" class="sc-drop sc-drop--kit" data-main="+ Upload PDF"></div></div><div class="sc-block--divider"><p class="sc-label">Your pictures</p><p class="sc-text sc-pics-note">Keep these natural — please avoid baggy clothing, make-up, or smiling. The photos you submit shouldn’t be filtered, re-touched, or professionally taken.</p><div class="sc-grid3"><div class="sc-field"><label class="sc-label">Headshot <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-pic0" class="sc-drop" data-main="+ Add image"></div></div><div class="sc-field"><label class="sc-label">Profile <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-pic1" class="sc-drop" data-main="+ Add image"></div></div><div class="sc-field"><label class="sc-label">Full length <span class="sc-opt">'+T('sc.optional')+'</span></label><div id="sc-pic2" class="sc-drop" data-main="+ Add image"></div></div></div></div></form></section>',
'<section id="sc-form-consent" class="sc-section sc-app-sans" aria-label="'+T('sc.sec.consent')+'"><form class="sc-form" novalidate><label class="sc-consent" for="sc-consent"><input id="sc-consent" class="sc-check" type="checkbox" required><span class="sc-consent-text">I agree to Theodyx’s <a href="/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and consent to be contacted about representation. I understand this is an application, not an offer of representation.</span></label><div class="sc-honey" aria-hidden="true"><label for="sc-company">Company</label><input id="sc-company" name="company" type="text" tabindex="-1" autocomplete="off"></div><div id="sc-turnstile"></div><div id="sc-err" class="sc-err" role="alert"></div><button id="sc-submit" type="button" class="sc-submit">'+T('sc.submit')+'</button></form></section>',
'<section id="sc-gate-u14" class="sc-section sc-app-sans" aria-label="A note"><div class="sc-eyebrow">A note</div><h2 class="sc-h2">Thank you for your interest in joining Theodyx.</h2><p class="sc-text">We are invested in protecting the privacy of our applicants. For this reason, we are unfortunately unable to accept applications from anyone under 14 at this time. We look forward to receiving your future application.</p></section>'
  ];
  var FRAG_BODY = [
'<div id="sc-success" role="dialog" aria-modal="true" aria-label="'+T('sc.success.eyebrow')+'"><div class="sc-gate-inner"><span class="sc-gate-eyebrow">'+T('sc.success.eyebrow')+'</span><h2 class="sc-success-title" tabindex="-1">'+T('sc.success.title')+'</h2><p class="sc-gate-body">'+T('sc.success.body')+'</p><a href="/" class="sc-gate-btn sc-home-btn">'+T('sc.home')+'</a></div></div>'
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
  /* ------------------------------------------------------------- funnel
   * The four page-level listeners that used to live in the /scouting footer beacon. They emit
   * through window.__thxTrack, so they inherit the head's session id, UTM fallback, GPC and consent
   * gating instead of forking them (INST-03/04/06, UTM-02). No page view is emitted here — the
   * head's landing_view already carries path=/scouting. */
  function wireFunnel() {
    document.addEventListener('input', function (e) {
      var t = e.target; if (!t || !t.id || t.id.indexOf('sc-') !== 0) return;
      if (t.id.indexOf('sc-gate-') === 0) return;   /* 2.2.0: answering the age dialog is not a form start */
      trk('form_started', null, true);
    }, true);
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    injectCSS();
    ensureDom();
    buildHero();
    enhanceIntro();
    buildSafety();
    ensureFooter();
    fillCountries(); fillPlatforms();
    /* no future birthdates; an under-14 date is allowed in and answered honestly, because the
       ineligible message is the point — a max that silently refuses the date is the dead end. */
    var dobIn = $('sc-dob');
    if (dobIn && !dobIn.max) { var ty = new Date(); dobIn.max = ty.getFullYear() + '-' + String(ty.getMonth() + 1).padStart(2, '0') + '-' + String(ty.getDate()).padStart(2, '0'); dobIn.min = (ty.getFullYear() - 100) + '-01-01'; }
    enhanceSemantics();
    buildSafetyAck();
    wireRepresented(); wirePlatform();
    wireUploads();
    wirePersist();
    wireFunnel();
    var btn = $('sc-submit');
    if (btn) {
      if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', (btn.textContent || 'Submit application').trim());
      on(btn, 'click', function (e) { e.preventDefault(); trk('submit_attempt', null, true); doSubmit(); });
    }
    neutralizeForms();
    hydrateForm();
    wireInlineValidation();
    wireTurnstileOnFocus();
    u14Note();
    if (bootU14) return;      /* the locked screen owns the page until "Update your date of birth" */
    if (!gates.gatePassed) {
      /* 2.2.0: the dialog went up before init() and owns focus until it is answered. It is re-opened
         idempotently here, and the inert sweep is re-run because ensureDom() may have appended
         #sc-success to <body> after the first sweep walked it. */
      openAgeGate();
      if (activeGate) setGateInert(activeGate);
      return;
    }
    /* a session that already cleared the gate: the date it gave is the form's date */
    if (gates.dob && !val('sc-dob')) { var dd = $('sc-dob'); if (dd) { dd.value = gates.dob; persistForm(); } }
    inlineNote();
    evaluateAge(false);       /* silent: re-apply a stored under-14 answer without shouting at anyone */
    /* 2.0.1: the QR library loads only once the success panel is shown (Phase 8 budget: nothing before success) */
  }

  bootGate();   /* the dialog goes up here, in this same task, before init() touches anything */

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
