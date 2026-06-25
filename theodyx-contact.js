/*! theodyx-contact.js — restyle the Contact ("Connect") form to match the
 * Scouting page aesthetic: underline-only fields, Space-Mono uppercase labels,
 * and a full ink submit bar. CSS-only — the Webflow form still submits normally.
 * Applied via the Contact page footer freeform code. */
(function () {
  'use strict';
  if (window.__thxContact) return;
  window.__thxContact = true;
  if (document.getElementById('tcform-css')) return;
  var ink = '#0E0E0F', paper = '#F2F1EC', line = 'rgba(14,14,15,.28)', mute = 'rgba(14,14,15,.45)';
  var css = [
    '.contact-form-wrapper{max-width:780px;}',
    '.contact-form-wrapper label,.contact-form-wrapper [class^="field-label"]{font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:11px!important;letter-spacing:.16em!important;text-transform:uppercase!important;font-weight:400!important;color:' + ink + '!important;margin-bottom:8px!important;}',
    '.contact-form-wrapper .input,.contact-form-wrapper .text-area,.contact-form-wrapper input.w-input,.contact-form-wrapper textarea.w-input{background:transparent!important;border:0!important;border-bottom:1px solid ' + line + '!important;border-radius:0!important;box-shadow:none!important;padding:8px 0 10px!important;font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif!important;font-size:clamp(16px,1.5vw,18px)!important;color:' + ink + '!important;transition:border-color .16s ease!important;}',
    '.contact-form-wrapper .input:focus,.contact-form-wrapper .text-area:focus,.contact-form-wrapper input.w-input:focus,.contact-form-wrapper textarea.w-input:focus{outline:none!important;border-bottom-color:' + ink + '!important;border-bottom-width:1.5px!important;}',
    '.contact-form-wrapper .input::placeholder,.contact-form-wrapper .text-area::placeholder,.contact-form-wrapper .w-input::placeholder{color:' + mute + '!important;}',
    '.contact-form-wrapper .text-area,.contact-form-wrapper textarea.w-input{min-height:128px!important;resize:vertical!important;}',
    '.contact-form-wrapper .primary-button,.contact-form-wrapper input[type="submit"]{background:' + ink + '!important;color:' + paper + '!important;border:1px solid ' + ink + '!important;border-radius:0!important;padding:18px 30px!important;font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:13px!important;letter-spacing:.16em!important;text-transform:uppercase!important;font-weight:400!important;cursor:pointer;transition:all .16s ease!important;box-shadow:none!important;}',
    '.contact-form-wrapper .primary-button:hover,.contact-form-wrapper input[type="submit"]:hover{background:' + paper + '!important;color:' + ink + '!important;}'
  ].join('\n');
  var s = document.createElement('style'); s.id = 'tcform-css'; s.textContent = css; document.head.appendChild(s);
})();
