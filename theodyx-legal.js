/*! theodyx-legal.js — Theodyx legal hub. Replaces the stock Lorem on the legal
 * page with three deep-linkable policies (Terms / Privacy / Cookies) in a clean
 * tabbed layout. Anchors: #terms-and-conditions, #privacy-policy, #cookie-policy.
 * Applied via the legal page footer freeform code. Supersedes theodyx-terms.js. */
(function () {
  'use strict';
  if (window.__thxLegal) return;
  window.__thxLegal = true;

  var EFF = 'Effective date: June 25, 2026';

  var TERMS = '' +
'<p>Welcome to Theodyx. These Terms &amp; Conditions ("Terms") govern your access to and use of the websites, applications, and services operated by Theodyx Inc. ("Theodyx," "we," "us," or "our"). Please read them carefully. By using our Services, you agree to be bound by these Terms.</p>' +
'<h2>Introduction &amp; Acceptance of Terms</h2>' +
'<p>Theodyx Inc. is a Delaware C-Corporation operating as a media and technology and talent-management company that builds, operates, and owns ventures alongside creators, brands, and institutions in the creator economy. Our work is guided by a simple idea: Media That Moves. Intelligence That Matters.</p>' +
'<p>These Terms form a binding agreement between you and Theodyx. They apply to your use of www.theodyx.com and our related properties, including theodyx.net, theodyx.store, theodyx.xyz, theodyx.me, and theodyx.info (collectively, the "Site"), together with any content, features, tools, and offerings we make available (collectively, the "Services").</p>' +
'<p>By accessing or using the Services, you confirm that you have read, understood, and agree to be bound by these Terms and by any policies referenced here, including our <a href="#privacy-policy">Privacy Policy</a>. If you do not agree, please do not use the Services.</p>' +
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
'<p>Through Our Scouting, available at <a href="/scouting">/scouting</a>, individuals may apply to be considered for representation by Theodyx. The following rules apply to all applications, and we encourage every Applicant to read them carefully.</p>' +
'<ul>' +
'<li><strong>An application is not an offer.</strong> Submitting an application means you are asking to be considered. It is not an offer, promise, or guarantee of representation, a contract, employment, or any engagement with Theodyx. We review applications at our discretion and are under no obligation to respond to, accept, or act on any application.</li>' +
'<li><strong>We never charge a fee to apply.</strong> Applying through Our Scouting is free. Theodyx does not charge, and will never ask you to pay, any fee to apply or to be considered for representation.</li>' +
'<li><strong>Age requirement.</strong> You must be at least 14 years old to apply directly, as described under Eligibility above.</li>' +
'<li><strong>How we contact you.</strong> Theodyx will only contact Applicants from official @theodyx accounts and email addresses. We will never ask you for payment, and we will never request nude, lingerie, or otherwise sexualized or inappropriate photos. If you receive a message claiming to be from Theodyx that asks for any of these things, it is not from us; please disregard it and report it to us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</li>' +
'<li><strong>How submitted materials are used.</strong> Any media, photos, or other materials you submit through an application are used solely to evaluate your application. We describe the license you grant for this purpose in User Content &amp; Submissions below and how we handle your information in our <a href="#privacy-policy">Privacy Policy</a>.</li>' +
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
'<p>Your privacy matters to us. Our collection and use of personal information in connection with the Services, including information submitted through scouting applications, is described in our <a href="#privacy-policy">Privacy Policy</a>. By using the Services, you acknowledge that you have reviewed the Privacy Policy and understand how we handle your information. Where there is a conflict between these Terms and the Privacy Policy regarding the handling of personal information, the Privacy Policy controls.</p>' +
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

  var PRIVACY = '' +
'<p>This Privacy Policy explains how Theodyx Inc. ("Theodyx," "we," "us," or "our") collects, uses, shares, and protects personal information when you visit our websites or use our services, including our "Our Scouting" creator application available at <a href="/scouting">/scouting</a> (collectively, the "Services"). Theodyx is a media and technology and talent-management company in the creator economy, guided by our commitment that "Media That Moves. Intelligence That Matters." We encourage you to read this Policy carefully to understand our practices regarding your personal information.</p>' +
'<h2>Introduction</h2>' +
'<p>Theodyx Inc. is a Delaware C-Corporation that operates www.theodyx.com along with related domains, including theodyx.net, theodyx.store, theodyx.xyz, theodyx.me, and theodyx.info. This Policy applies to personal information we collect through these websites and through the Services, most notably the information submitted by creators who apply through our "Our Scouting" application.</p>' +
'<p>By using our Services or submitting an application, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use the Services or submit personal information to us.</p>' +
'<h2>Information We Collect</h2>' +
'<p>We collect personal information primarily when you choose to submit a creator application through our "Our Scouting" application at <a href="/scouting">/scouting</a>. The categories of information we collect include the following.</p>' +
'<h3>Identity and Contact Information</h3>' +
'<p>When you apply, we collect your first name, last name, email address, and date of birth.</p>' +
'<h3>Location Information</h3>' +
'<p>We collect your country and, optionally, your state or region and your city.</p>' +
'<h3>Creator Profile Information</h3>' +
'<p>We collect details about your work as a creator, including your primary platform; your social handles (such as Instagram, TikTok, YouTube, and/or others); whether you are currently represented and, if so, by whom; and links to your work.</p>' +
'<h3>Submitted Media</h3>' +
'<p>You may optionally upload a media-kit PDF and optional photos (for example, a headshot, a profile photo, or a full-length photo) so that we can evaluate your application.</p>' +
'<h3>Free-Text Notes</h3>' +
'<p>We collect any additional free-text notes that you choose to provide as part of your application.</p>' +
'<h3>Consent and Security Verification</h3>' +
'<p>We collect your consent confirmation and a security verification token generated by Cloudflare Turnstile.</p>' +
'<h3>Technical and Anti-Abuse Data</h3>' +
'<p>To help prevent spam and abuse, we use Cloudflare Turnstile and rate-limiting. We do not store your raw IP address; instead, we store only a one-way hashed value derived from it, which we use for rate-limiting purposes. In addition, standard server logs may be processed by our infrastructure providers as part of operating the Services.</p>' +
'<h3>Website Analytics</h3>' +
'<p>Our website may collect standard usage analytics to help us understand how visitors interact with our Services.</p>' +
'<h2>How We Use Your Information</h2>' +
'<p>We use the personal information we collect for the following purposes:</p>' +
'<ul>' +
'<li>To review and evaluate scouting applications submitted through the "Our Scouting" application;</li>' +
'<li>To contact applicants about possible representation. Any such outreach will come only from official @theodyx accounts;</li>' +
'<li>To operate, secure, and improve the Services;</li>' +
'<li>To prevent fraud and abuse; and</li>' +
'<li>To comply with applicable law.</li>' +
'</ul>' +
'<p>We use your information only for the purposes described in this Policy and consistent with the context in which you provided it.</p>' +
'<h2>Legal Bases</h2>' +
'<p>Where required by applicable law, we rely on one or more legal bases to process your personal information, depending on the specific context in which we collect and use it. These legal bases generally include the following:</p>' +
'<ul>' +
'<li><strong>Consent:</strong> where you have given us your consent to process your information, such as when you confirm your consent in the application and submit your details for evaluation;</li>' +
'<li><strong>Legitimate interests:</strong> where processing is necessary for our legitimate interests, such as operating, securing, and improving the Services and preventing fraud and abuse, provided those interests are not overridden by your rights;</li>' +
'<li><strong>Contract:</strong> where processing is necessary to take steps at your request and to evaluate a potential relationship with you; and</li>' +
'<li><strong>Legal obligation:</strong> where processing is necessary to comply with a legal obligation to which we are subject.</li>' +
'</ul>' +
'<h2>How We Share Information</h2>' +
'<p>We do not sell personal information. We share personal information only as described in this Policy.</p>' +
'<p>We share information with service providers and processors that help us run the Services. These notably include Cloudflare, which provides hosting, security and Turnstile services, and storage of application data and uploads, as well as our email-delivery provider. Our service providers act on our instructions and process personal information on our behalf in connection with the services they provide to us.</p>' +
'<p>We may also disclose information if required by law, or where we believe disclosure is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.</p>' +
'<h2>Cookies and Tracking Technologies</h2>' +
'<p>Our Site uses cookies and similar technologies to operate and improve the Services and to collect standard usage analytics. For more detailed information about the cookies and similar technologies we use and the choices available to you, please see our <a href="#cookie-policy">Cookie Policy</a>.</p>' +
'<h2>Data Storage and Security</h2>' +
'<p>Application data and uploads are stored with our cloud infrastructure provider, Cloudflare. We use reasonable technical and organizational safeguards designed to protect personal information against unauthorized access, loss, misuse, or alteration. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee the absolute security of your information.</p>' +
'<h2>Data Retention</h2>' +
'<p>We keep personal information for as long as necessary to evaluate applications and operate the Services, and as required by applicable law. Applicants may request deletion of their personal information by contacting us using the details provided in the "Contact Us" section below.</p>' +
'<h2>International Data Transfers</h2>' +
'<p>Theodyx scouts globally. As a result, your information may be processed and stored in the United States and in other countries, which may have data-protection laws that differ from those in your country of residence. By using the Services or submitting your information, you understand that your information may be transferred to and processed in these locations.</p>' +
'<h2>Your Privacy Rights and Choices</h2>' +
'<p>You may request access to, correction of, or deletion of your personal information, and you may opt out of non-essential communications. To exercise these rights or choices, please contact us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a> or <a href="mailto:contact@theodyx.com">contact@theodyx.com</a>.</p>' +
'<p>Depending on where you live (for example, in the European Economic Area, the United Kingdom, or California), you may have additional rights under applicable data-protection laws. We honor applicable rights and will respond to your request in accordance with the law that applies to you.</p>' +
'<h2>Children’s Privacy</h2>' +
'<p>The scouting application requires applicants to be at least 14 years of age. We do not knowingly accept applications from anyone under 14, and we do not knowingly collect personal information from children under 14. If you believe that a child under 14 has provided us with personal information, please contact us so that we can take appropriate action.</p>' +
'<h2>Third-Party Links</h2>' +
'<p>Our Services may contain links to third-party websites, platforms, or services that are not operated or controlled by Theodyx. This Privacy Policy does not apply to those third-party properties, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites or services you visit.</p>' +
'<h2>Changes to This Policy</h2>' +
'<p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will revise the effective date shown at the top of this Policy. We encourage you to review this Policy periodically to stay informed about how we protect your information.</p>' +
'<h2>Contact Us</h2>' +
'<p>If you have any questions, concerns, or requests regarding this Privacy Policy or our handling of your personal information, please contact us:</p>' +
'<ul>' +
'<li><strong>Theodyx Inc.</strong></li>' +
'<li>Email: <a href="mailto:contact@theodyx.com">contact@theodyx.com</a></li>' +
'<li>Scouting inquiries: <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a></li>' +
'<li>Phone: +1.938.293.5290</li>' +
'<li>Address: 16192 Coastal Highway, Lewes, DE 19958</li>' +
'</ul>' +
'<p>This Privacy Policy is governed by the laws of the State of Delaware, United States, without regard to its conflict-of-laws principles.</p>';

  var COOKIES = '' +
'<h2>Introduction</h2>' +
'<p>This Cookie Policy explains how Theodyx Inc. ("Theodyx," "we," "us," or "our") uses cookies and similar technologies when you visit our websites, including www.theodyx.com and our related domains (theodyx.net, theodyx.store, theodyx.xyz, theodyx.me, and theodyx.info) (collectively, the "Site"). It describes what these technologies are, why we use them, and the choices available to you. Theodyx Inc. is a Delaware C-Corporation operating in the media, technology, and talent-management space within the creator economy.</p>' +
'<p>This policy should be read together with our <a href="#privacy-policy">Privacy Policy</a>, which provides more detail about how we handle personal information. By continuing to use the Site, you agree to the use of cookies and similar technologies as described here, except where your consent is separately required by law.</p>' +
'<h2>What Are Cookies?</h2>' +
'<p>Cookies are small text files that a website places on your device (such as your computer, tablet, or phone) when you visit. They are widely used to make websites work, to improve performance and security, and to remember information about your visit. Cookies set by the website you are visiting are often called "first-party" cookies, while cookies set by other organizations are called "third-party" cookies.</p>' +
'<p>Alongside cookies, we and our service providers may use similar technologies, including:</p>' +
'<ul>' +
'<li><strong>Local storage and session storage</strong> — small amounts of data your browser stores on your device. Session storage is cleared automatically when your browsing session ends, while local storage may persist until it is cleared.</li>' +
'<li><strong>Pixels</strong> (also called tags or beacons) — tiny image or code elements that can help us understand whether content or a page has been viewed or loaded.</li>' +
'</ul>' +
'<p>In this policy, we use the word "cookies" broadly to refer to these and similar technologies unless we say otherwise.</p>' +
'<h2>How We Use Cookies</h2>' +
'<p>Our Site is built on the Webflow website platform and uses Cloudflare for security and performance. As a result, certain cookies and similar technologies are used to deliver and protect the Site, to remember your preferences, and to help us understand how the Site is used so we can improve it.</p>' +
'<p>We use cookies to keep the Site functioning and secure, to support specific features (such as our scouting application), and to gather general, aggregated insight into Site usage. We do <strong>not</strong> use cookies to sell your personal data.</p>' +
'<h2>Types of Cookies We Use</h2>' +
'<p>We group the cookies and similar technologies we use into the categories described below.</p>' +
'<h3>Strictly Necessary</h3>' +
'<p>These technologies are required for the Site to function properly and to keep it secure. They include Cloudflare’s security and anti-bot technology, such as Cloudflare Turnstile, which is used on our scouting application to help confirm that visitors are genuine and to protect against abuse, as well as basic Webflow platform cookies needed to serve and operate the Site. Because the Site cannot work correctly without them, these technologies cannot be switched off through our Site.</p>' +
'<h3>Functional / Preferences</h3>' +
'<p>These technologies help the Site remember choices you make, such as your preferred language, so we can provide a more personalized experience. In addition, our scouting application uses your browser’s session storage to temporarily save your in-progress application form on your own device, so you do not lose your entries while completing it. This information is held only on your device, is cleared when your session ends, and is not used for tracking.</p>' +
'<h3>Analytics / Performance</h3>' +
'<p>These technologies help us understand how visitors find and use the Site — for example, which pages are viewed and how the Site performs — using standard website usage analytics. We use this information in an aggregated way to maintain, troubleshoot, and improve the Site. They are not essential for the Site to function.</p>' +
'<h2>Third-Party Cookies</h2>' +
'<p>Some cookies and similar technologies on our Site are set by the third-party services we rely on to operate it. These include:</p>' +
'<ul>' +
'<li><strong>Cloudflare</strong> — provides security and performance services for the Site, including the anti-bot protection used on our scouting application.</li>' +
'<li><strong>Webflow</strong> — the website platform on which the Site is built and hosted.</li>' +
'</ul>' +
'<p>These providers may set their own cookies in accordance with their respective policies. The specific cookies used can change as these services are updated, so we describe them in general terms here rather than listing individual cookies.</p>' +
'<h2>Managing Your Cookie Preferences</h2>' +
'<p>You can control and manage cookies in several ways. Most web browsers let you view, block, or delete cookies through their settings, and allow you to be notified before a cookie is stored. The steps differ from browser to browser, so please check your browser’s help resources for details.</p>' +
'<p>Please note that if you block or delete cookies, some parts of the Site may not work as intended. In particular, strictly necessary technologies cannot be switched off without affecting core functionality and security, and turning off functional technologies may mean the Site no longer remembers your preferences.</p>' +
'<p>Many browsers and operating systems also offer broader privacy controls, such as a "Do Not Track" signal or other global privacy controls. Support for these signals varies, and where we are required by applicable law to honor a recognized control, we will do so. You can also clear data stored in your browser’s local and session storage through your browser settings.</p>' +
'<h2>Changes to This Cookie Policy</h2>' +
'<p>We may update this Cookie Policy from time to time to reflect changes in the technologies we use, our practices, or applicable legal requirements. When we make changes, we will revise the effective date shown at the top of this policy. We encourage you to review this page periodically to stay informed about how we use cookies and similar technologies.</p>' +
'<h2>Contact Us</h2>' +
'<p>If you have any questions about this Cookie Policy or how we use cookies and similar technologies, please contact us:</p>' +
'<ul>' +
'<li><strong>Theodyx Inc.</strong></li>' +
'<li>Email: <a href="mailto:contact@theodyx.com">contact@theodyx.com</a></li>' +
'<li>Phone: +1.938.293.5290</li>' +
'<li>Address: 16192 Coastal Highway, Lewes, DE 19958</li>' +
'</ul>';

  var DOCS = [
    { id: 'terms-and-conditions', tab: 'Terms & Conditions', title: 'Terms & Conditions', body: TERMS },
    { id: 'privacy-policy', tab: 'Privacy Policy', title: 'Privacy Policy', body: PRIVACY },
    { id: 'cookie-policy', tab: 'Cookie Policy', title: 'Cookie Policy', body: COOKIES }
  ];
  var BY_ID = {}; DOCS.forEach(function (d) { BY_ID[d.id] = d; });
  var ALIAS = { 'cookies': 'cookie-policy', 'cookie': 'cookie-policy', 'privacy': 'privacy-policy', 'terms': 'terms-and-conditions' };

  function injectCSS() {
    if (document.getElementById('tc-css')) return;
    var css = [
      '.top-section.v2{background:#F2F1EC!important;}',
      '.tc-wrap{max-width:880px;margin:0 auto;padding:clamp(48px,7vw,96px) clamp(20px,5vw,32px);font-family:"Objectivity","Archivo","Helvetica Neue",Arial,sans-serif;color:#0E0E0F!important;}',
      '.tc-kicker{font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:11px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:rgba(14,14,15,.55)!important;margin:0 0 22px!important;}',
      '.tc-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 clamp(40px,6vw,64px);border-bottom:1px solid rgba(14,14,15,.14);padding-bottom:0;}',
      '.tc-tab{appearance:none;background:none;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;padding:12px 4px;margin-right:22px;font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:12px!important;letter-spacing:.12em;text-transform:uppercase;color:rgba(14,14,15,.5)!important;cursor:pointer;transition:color .15s ease,border-color .15s ease;}',
      '.tc-tab:hover{color:#0E0E0F!important;}',
      '.tc-tab[aria-selected="true"]{color:#0E0E0F!important;border-bottom-color:#0E0E0F;}',
      '.tc-doc[hidden]{display:none;}',
      '.tc-doc h1.tc-title{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(36px,5vw,60px)!important;font-weight:400!important;letter-spacing:-.012em!important;line-height:1.04!important;color:#0E0E0F!important;margin:0 0 10px!important;}',
      '.tc-eff{font-family:"Space Mono","Mono",ui-monospace,monospace!important;font-size:12px!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:rgba(14,14,15,.6)!important;margin:0 0 44px!important;}',
      '.tc-doc h2{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(21px,2.5vw,29px)!important;font-weight:600!important;letter-spacing:-.01em!important;color:#0E0E0F!important;margin:52px 0 14px!important;padding-top:24px;border-top:1px solid rgba(14,14,15,.12);}',
      '.tc-doc h3{font-family:"Objectivity","Archivo",sans-serif!important;font-size:clamp(16px,1.8vw,19px)!important;font-weight:600!important;color:#0E0E0F!important;margin:28px 0 8px!important;}',
      '.tc-doc p{font-size:16px!important;line-height:1.75!important;margin:0 0 16px!important;color:rgba(14,14,15,.84)!important;}',
      '.tc-doc ul{margin:0 0 20px!important;padding-left:22px!important;list-style:disc!important;}',
      '.tc-doc li{font-size:16px!important;line-height:1.7!important;margin:0 0 9px!important;color:rgba(14,14,15,.84)!important;}',
      '.tc-doc a{color:#0E0E0F!important;text-decoration:underline!important;text-underline-offset:2px;}',
      '.tc-doc strong{font-weight:600!important;color:#0E0E0F!important;}'
    ].join('\n');
    var s = document.createElement('style'); s.id = 'tc-css'; s.textContent = css; document.head.appendChild(s);
  }

  function activeFromHash() {
    var h = (location.hash || '').replace(/^#/, '').toLowerCase();
    if (BY_ID[h]) return h;
    if (ALIAS[h]) return ALIAS[h];
    return 'terms-and-conditions';
  }

  function select(id, push) {
    if (!BY_ID[id]) id = 'terms-and-conditions';
    DOCS.forEach(function (d) {
      var sec = document.querySelector('.tc-doc[data-doc="' + d.id + '"]');
      var tab = document.querySelector('.tc-tab[data-doc="' + d.id + '"]');
      if (sec) sec.hidden = (d.id !== id);
      if (tab) tab.setAttribute('aria-selected', d.id === id ? 'true' : 'false');
    });
    document.title = BY_ID[id].title + ' | Theodyx';
    if (push && ('#' + id) !== location.hash) {
      try { history.replaceState(null, '', '#' + id); } catch (e) { location.hash = id; }
    }
  }

  function run() {
    var rt = document.querySelector('.rich-text-v2');
    var sec = (rt && rt.closest('section')) || document.querySelector('.top-section.v2') || document.querySelector('.top-section');
    if (!sec) return;
    injectCSS();

    var html = '<div class="tc-wrap"><p class="tc-kicker">Theodyx · Legal</p>';
    html += '<nav class="tc-tabs" aria-label="Legal documents">';
    DOCS.forEach(function (d) { html += '<button type="button" class="tc-tab" data-doc="' + d.id + '" aria-selected="false">' + d.tab + '</button>'; });
    html += '</nav>';
    DOCS.forEach(function (d) {
      html += '<section class="tc-doc" data-doc="' + d.id + '" hidden><h1 class="tc-title">' + d.title + '</h1><p class="tc-eff">' + EFF + '</p>' + d.body + '</section>';
    });
    html += '</div>';
    sec.innerHTML = html;

    // hide any sibling stock sections
    var sibs = document.querySelectorAll('.top-section');
    for (var i = 0; i < sibs.length; i++) { if (sibs[i] !== sec) sibs[i].style.display = 'none'; }

    // wire tabs
    Array.prototype.forEach.call(document.querySelectorAll('.tc-tab'), function (b) {
      b.addEventListener('click', function () { select(b.getAttribute('data-doc'), true); window.scrollTo({ top: Math.max(0, sec.getBoundingClientRect().top + window.pageYOffset - 90), behavior: 'smooth' }); });
    });
    // intercept in-content cross-links (#privacy-policy etc.)
    sec.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').replace(/^#/, '').toLowerCase();
      id = BY_ID[id] ? id : (ALIAS[id] || '');
      if (id) { e.preventDefault(); select(id, true); window.scrollTo({ top: Math.max(0, sec.getBoundingClientRect().top + window.pageYOffset - 90), behavior: 'smooth' }); }
    });
    window.addEventListener('hashchange', function () { select(activeFromHash(), false); });

    select(activeFromHash(), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
