/*! theodyx-terms.js — replaces the stock Lorem content on the Theodyx legal/terms
 * page with the real Terms & Conditions. Applied via the legal page's footer
 * freeform custom code. Keeps the site nav + footer; swaps only the content section. */
(function () {
  'use strict';
  if (window.__thxTerms) return;
  window.__thxTerms = true;

  var TERMS = '' +
'<h1>Terms &amp; Conditions</h1>' +
'<p class="tc-eff">Effective date: June 25, 2026</p>' +
'<p>Welcome to Theodyx. These Terms &amp; Conditions ("Terms") govern your access to and use of the websites, applications, and services operated by Theodyx Inc. ("Theodyx," "we," "us," or "our"). Please read them carefully. By using our Services, you agree to be bound by these Terms.</p>' +

'<h2>Introduction &amp; Acceptance of Terms</h2>' +
'<p>Theodyx Inc. is a Delaware C-Corporation operating as a media and technology and talent-management company that builds, operates, and owns ventures alongside creators, brands, and institutions in the creator economy. Our work is guided by a simple idea: Media That Moves. Intelligence That Matters.</p>' +
'<p>These Terms form a binding agreement between you and Theodyx. They apply to your use of www.theodyx.com and our related properties, including theodyx.net, theodyx.store, theodyx.xyz, theodyx.me, and theodyx.info (collectively, the "Site"), together with any content, features, tools, and offerings we make available (collectively, the "Services").</p>' +
'<p>By accessing or using the Services, you confirm that you have read, understood, and agree to be bound by these Terms and by any policies referenced here, including our Privacy Policy. If you do not agree, please do not use the Services.</p>' +

'<h2>Definitions</h2>' +
'<ul>' +
'<li><strong>"Theodyx"</strong> means Theodyx Inc., a Delaware C-Corporation, together with its affiliates where the context applies.</li>' +
'<li><strong>"Services"</strong> means the Site and all websites, applications, content, features, tools, communications, and offerings that Theodyx makes available, including our creator scouting application.</li>' +
'<li><strong>"User," "you," or "your"</strong> means any person who accesses or uses the Services.</li>' +
'<li><strong>"Applicant"</strong> means a User who submits an application to be considered for representation through Theodyx’s scouting program, "Our Scouting."</li>' +
'<li><strong>"Content"</strong> means any text, images, photographs, video, audio, files, links, or other materials that are submitted, uploaded, posted, or otherwise made available through the Services, whether by you or by Theodyx.</li>' +
'</ul>' +

'<h2>Eligibility</h2>' +
'<p>To use the Services generally, you must be capable of forming a binding contract under applicable law and must use the Services only for lawful purposes and in accordance with these Terms. If you use the Services on behalf of an organization, you represent that you are authorized to bind that organization to these Terms.</p>' +
'<p>Where you are below the age of legal majority in your jurisdiction, you may use the Services only with the involvement and consent of a parent or legal guardian, who agrees to be responsible for your use.</p>' +
'<h3>Age requirement for scouting applications</h3>' +
'<p>To apply directly through Our Scouting, you must be at least 14 years of age. If you are under 18, we strongly encourage you to involve a parent or legal guardian in the application process. By submitting an application, you confirm that you meet this age requirement and that the information you provide is accurate.</p>' +

'<h2>The Services</h2>' +
'<p>Theodyx provides a range of offerings across media, talent management, and technology and ventures. These are described here in general terms, and the specific scope of any engagement may be governed by a separate written agreement.</p>' +
'<ul>' +
'<li><strong>Media.</strong> We create, produce, and distribute media and creative work alongside creators, brands, and institutions.</li>' +
'<li><strong>Talent management.</strong> We work with creators on representation, development, and related services, including through our scouting program described below.</li>' +
'<li><strong>Technology and ventures.</strong> We build and operate technology, platforms, and ventures that support creators and partners in the creator economy.</li>' +
'</ul>' +
'<p>The Services may change over time as we add, modify, or discontinue features. Nothing on the Site constitutes an offer, commitment, or guarantee of any particular service, outcome, or result unless set out in a separate signed agreement.</p>' +

'<h2>Scouting Applications &amp; Representation</h2>' +
'<p>Through Our Scouting, available at /scouting, individuals may apply to be considered for representation by Theodyx. The following rules apply to all applications, and we encourage every Applicant to read them carefully.</p>' +
'<ul>' +
'<li><strong>An application is not an offer.</strong> Submitting an application means you are asking to be considered. It is not an offer, promise, or guarantee of representation, a contract, employment, or any engagement with Theodyx. We review applications at our discretion and are under no obligation to respond to, accept, or act on any application.</li>' +
'<li><strong>We never charge a fee to apply.</strong> Applying through Our Scouting is free. Theodyx does not charge, and will never ask you to pay, any fee to apply or to be considered for representation.</li>' +
'<li><strong>Age requirement.</strong> You must be at least 14 years old to apply directly, as described under Eligibility above.</li>' +
'<li><strong>How we contact you.</strong> Theodyx will only contact Applicants from official @theodyx accounts and email addresses. We will never ask you for payment, and we will never request nude, lingerie, or otherwise sexualized or inappropriate photos. If you receive a message claiming to be from Theodyx that asks for any of these things, it is not from us; please disregard it and report it to us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</li>' +
'<li><strong>How submitted materials are used.</strong> Any media, photos, or other materials you submit through an application are used solely to evaluate your application. We describe the license you grant for this purpose in User Content &amp; Submissions below and how we handle your information in our Privacy Policy.</li>' +
'</ul>' +
'<p>If we decide to move forward together, any representation relationship will be governed by a separate written agreement signed by you (and, where applicable, your parent or legal guardian) and Theodyx. These Terms do not create any such relationship on their own.</p>' +

'<h2>User Accounts &amp; Communications</h2>' +
'<p>Some parts of the Services may allow or require you to create an account or to submit information through a form. Where that is the case, you agree to provide accurate, current, and complete information and to keep it up to date. You are responsible for maintaining the confidentiality of any credentials and for activity that occurs under your account.</p>' +
'<p>By contacting us or submitting information through the Services, you agree that we may communicate with you electronically, including by email, in connection with your inquiry or application. Communications related to scouting will come only from official @theodyx accounts, as described above. You may opt out of non-essential communications at any time by following the instructions in those messages or by contacting us.</p>' +

'<h2>User Content &amp; Submissions</h2>' +
'<p>You retain ownership of the Content you submit through the Services. By submitting Content, including any media or photos you provide with a scouting application, you grant Theodyx a non-exclusive, royalty-free, worldwide license to host, store, reproduce, and use that Content for the purpose of operating the Services and, in the case of an application, evaluating it. This license exists only to let us provide and assess what you have asked us to consider, and it does not transfer ownership of your Content to us.</p>' +
'<p>You represent and warrant that you own or have all necessary rights to the Content you submit, that it does not infringe or violate the rights of any third party, and that your submission complies with these Terms and applicable law. Where your Content includes the likeness of another person, you confirm you have the right to share it.</p>' +
'<p>We may, but are not obligated to, review, screen, or remove Content. We reserve the right to remove or decline to use any Content at our discretion, including Content we believe violates these Terms or is otherwise objectionable, without notice and without liability to you.</p>' +

'<h2>Intellectual Property</h2>' +
'<p>The Services, including the Site’s design, text, graphics, logos, the Theodyx name and marks, the tagline "Media That Moves. Intelligence That Matters.", and all related content, are owned by Theodyx or its licensors and are protected by intellectual property and other laws. All rights not expressly granted are reserved.</p>' +
'<p>Subject to your compliance with these Terms, Theodyx grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Site for your personal, non-commercial use. You may not copy, reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit any part of the Services without our prior written permission, except as expressly permitted by these Terms or applicable law. You may not use any Theodyx name, mark, or branding in a way that suggests sponsorship or endorsement without our consent.</p>' +

'<h2>Acceptable Use / Prohibited Conduct</h2>' +
'<p>You agree to use the Services responsibly and lawfully. You may not:</p>' +
'<ul>' +
'<li>Use the Services in violation of any applicable law, regulation, or these Terms;</li>' +
'<li>Submit Content that is false, misleading, unlawful, infringing, defamatory, harassing, abusive, hateful, or sexually explicit, or that depicts a minor in any inappropriate manner;</li>' +
'<li>Impersonate any person or entity, including Theodyx or its representatives, or misrepresent your affiliation with any person or entity;</li>' +
'<li>Attempt to gain unauthorized access to the Services, other users’ accounts, or any systems or networks connected to the Services;</li>' +
'<li>Introduce malware, viruses, or any code of a destructive or disruptive nature, or interfere with the proper functioning of the Services;</li>' +
'<li>Use automated means to scrape, harvest, or collect data from the Services without our permission;</li>' +
'<li>Use the Services to send unsolicited communications, or to defraud, exploit, or harm others.</li>' +
'</ul>' +
'<p>We may investigate and take appropriate action, including removing Content and suspending or terminating access, against anyone who violates this section.</p>' +

'<h2>Third-Party Links &amp; Services</h2>' +
'<p>The Services may contain links to third-party websites, products, or services that are not owned or controlled by Theodyx. We provide these links for convenience only and do not endorse and are not responsible for the content, policies, or practices of any third party. Your use of any third-party website or service is at your own risk and may be governed by that third party’s terms and privacy practices. We encourage you to review them.</p>' +

'<h2>Privacy</h2>' +
'<p>Your privacy matters to us. Our collection and use of personal information in connection with the Services, including information submitted through scouting applications, is described in our Privacy Policy. By using the Services, you acknowledge that you have reviewed the Privacy Policy and understand how we handle your information. Where there is a conflict between these Terms and the Privacy Policy regarding the handling of personal information, the Privacy Policy controls.</p>' +

'<h2>Disclaimers</h2>' +
'<p>The Services are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Theodyx disclaims all warranties of any kind, whether express, implied, or statutory, including any implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.</p>' +
'<p>We do not warrant that the Services will be uninterrupted, secure, error-free, or free of harmful components, or that any Content or information obtained through the Services will be accurate or reliable. No advice or information, whether oral or written, obtained from Theodyx or through the Services creates any warranty not expressly stated in these Terms. Submitting an application creates no warranty or assurance of representation, response, or any outcome.</p>' +

'<h2>Limitation of Liability</h2>' +
'<p>To the fullest extent permitted by law, Theodyx and its officers, directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenue, data, goodwill, or other intangible losses, arising out of or relating to your use of, or inability to use, the Services, whether based on warranty, contract, tort, or any other legal theory, even if we have been advised of the possibility of such damages.</p>' +
'<p>To the fullest extent permitted by law, the total aggregate liability of Theodyx arising out of or relating to these Terms or the Services will not exceed one hundred U.S. dollars (USD $100). Some jurisdictions do not allow certain limitations of liability, so some of the above may not apply to you; in such cases, our liability is limited to the greatest extent permitted by law.</p>' +

'<h2>Indemnification</h2>' +
'<p>You agree to indemnify, defend, and hold harmless Theodyx and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or related to your use of the Services, your Content, your violation of these Terms, or your violation of any law or the rights of any third party.</p>' +

'<h2>Modifications to the Terms and to the Services</h2>' +
'<p>We may update these Terms from time to time. When we do, we will revise the "Effective date" above and post the updated Terms. Material changes will take effect when posted, and your continued use of the Services after the changes become effective means you accept the revised Terms. If you do not agree to the updated Terms, please stop using the Services.</p>' +
'<p>We may also add, change, suspend, or discontinue any part of the Services at any time, with or without notice. We are not liable to you or any third party for any modification, suspension, or discontinuation of the Services.</p>' +

'<h2>Termination</h2>' +
'<p>You may stop using the Services at any time. We may suspend or terminate your access to the Services, in whole or in part, at any time and for any reason, including if we believe you have violated these Terms, without notice and without liability. Provisions that by their nature should survive termination, including ownership, disclaimers, limitation of liability, indemnification, and governing law, will survive.</p>' +

'<h2>Governing Law &amp; Dispute Resolution</h2>' +
'<p>These Terms and any dispute arising out of or relating to them or the Services are governed by the laws of the State of Delaware, USA, without regard to its conflict-of-laws principles.</p>' +
'<p>Before initiating any formal action, you agree to first contact us at <a href="mailto:contact@theodyx.com">contact@theodyx.com</a> and attempt in good faith to resolve the dispute informally. Many concerns can be resolved quickly this way. If we are unable to resolve a dispute within a reasonable period, the dispute will be subject to the exclusive jurisdiction of the state and federal courts located in the State of Delaware, and you consent to the personal jurisdiction and venue of those courts, except where applicable law provides otherwise.</p>' +

'<h2>Miscellaneous</h2>' +
'<p>These Terms, together with any policies referenced here, including the Privacy Policy, and any separate written agreement you enter into with Theodyx, constitute the entire agreement between you and Theodyx regarding the Services and supersede any prior understandings on that subject. If any provision of these Terms is found to be unenforceable, that provision will be limited or removed to the minimum extent necessary, and the remaining provisions will remain in full force and effect. Theodyx may assign or transfer these Terms, in whole or in part, without restriction; you may not assign your rights or obligations under these Terms without our prior written consent. Our failure to enforce any provision is not a waiver of our right to do so later. The section headings are for convenience only and do not affect interpretation.</p>' +

'<h2>Contact Us</h2>' +
'<p>If you have any questions about these Terms or the Services, please contact us:</p>' +
'<ul>' +
'<li><strong>Theodyx Inc.</strong></li>' +
'<li>Email: <a href="mailto:contact@theodyx.com">contact@theodyx.com</a></li>' +
'<li>Scouting and applications: <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a></li>' +
'<li>Phone: +1.938.293.5290</li>' +
'<li>Address: 16192 Coastal Highway, Lewes, DE 19958, USA</li>' +
'<li>Web: www.theodyx.com</li>' +
'</ul>';

  function injectCSS() {
    if (document.getElementById('tc-css')) return;
    var css = [
      '.top-section.v2{background:#F2F1EC!important;}',
      '.tc-wrap{max-width:820px;margin:0 auto;padding:clamp(56px,8vw,112px) clamp(20px,5vw,32px);font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif;color:#0E0E0F!important;}',
      '.tc-wrap h1{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(36px,5vw,60px)!important;font-weight:400!important;letter-spacing:-.012em!important;line-height:1.05!important;color:#0E0E0F!important;margin:0 0 10px!important;}',
      '.tc-eff{font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:12px!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:rgba(14,14,15,.6)!important;margin:0 0 44px!important;}',
      '.tc-wrap h2{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(21px,2.5vw,29px)!important;font-weight:600!important;letter-spacing:-.01em!important;color:#0E0E0F!important;margin:52px 0 14px!important;padding-top:24px;border-top:1px solid rgba(14,14,15,.12);}',
      '.tc-wrap h3{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(16px,1.8vw,19px)!important;font-weight:600!important;color:#0E0E0F!important;margin:28px 0 8px!important;}',
      '.tc-wrap p{font-size:16px!important;line-height:1.75!important;margin:0 0 16px!important;color:rgba(14,14,15,.84)!important;}',
      '.tc-wrap p.tc-eff{color:rgba(14,14,15,.6)!important;}',
      '.tc-wrap ul{margin:0 0 20px!important;padding-left:22px!important;list-style:disc!important;}',
      '.tc-wrap li{font-size:16px!important;line-height:1.7!important;margin:0 0 9px!important;color:rgba(14,14,15,.84)!important;}',
      '.tc-wrap a{color:#0E0E0F!important;text-decoration:underline!important;text-underline-offset:2px;}',
      '.tc-wrap strong{font-weight:600!important;color:#0E0E0F!important;}'
    ].join('\n');
    var s = document.createElement('style'); s.id = 'tc-css'; s.textContent = css; document.head.appendChild(s);
  }

  function run() {
    // Find the stock content section (holds the Lorem rich-text) and replace it.
    var rt = document.querySelector('.rich-text-v2');
    var sec = (rt && rt.closest('section')) || document.querySelector('.top-section.v2') || document.querySelector('.top-section');
    if (!sec) return;
    injectCSS();
    sec.innerHTML = '<div class="tc-wrap">' + TERMS + '</div>';
    // Hide any sibling stock content sections that also carried template copy.
    var sibs = document.querySelectorAll('.top-section');
    for (var i = 0; i < sibs.length; i++) { if (sibs[i] !== sec) sibs[i].style.display = 'none'; }
    document.title = 'Terms & Conditions | Theodyx';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
