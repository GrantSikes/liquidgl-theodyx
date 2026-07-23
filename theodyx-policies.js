(function(){
if(!/^\/policies\//.test(location.pathname))return;
if(document.getElementById("thx-pol-root")||document.querySelector(".thx-pol[data-thx-transformed]"))return;
var PATH=location.pathname.replace(/\/+$/,"");
var IS_PRIVACY=/\/policies\/privacy-policy$/.test(PATH);
var IS_TERMS=/\/policies\/terms-of-service$/.test(PATH);
var CSS=`.thx-pol{--ink:#faf8f2;--ink-60:rgba(250,248,242,.62);--ink-44:rgba(250,248,242,.45);--rule:rgba(250,248,242,.16);--rule-4:rgba(250,248,242,.08);--panel:#101011;--measure:680px;
  background:#050505!important;color:var(--ink)!important;font-size:17px;line-height:1.7;
  font-family:"Google Sans Flex","Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  min-height:100vh;position:relative;z-index:1}
.thx-pol *{box-sizing:border-box}
.thx-pol a{color:inherit}
.thx-pol .pol-wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.thx-pol .pol-head{max-width:992px;margin:0 auto;padding:132px 0 26px}
.thx-pol .pol-h1{font-size:clamp(34px,5vw,56px);line-height:1.04;font-weight:560;letter-spacing:-.02em;margin:0 0 16px;color:var(--ink)!important;text-wrap:balance;max-width:22ch}
.thx-pol .pol-meta{font-size:14px;color:var(--ink-44)!important;margin:0}
.thx-pol .pol-prev{display:inline-block;margin-top:14px;color:var(--ink)!important;text-decoration:underline;text-underline-offset:3px}
.thx-pol .pol-toc{display:none!important}
.thx-pol .pol-cols{display:grid;grid-template-columns:236px minmax(0,var(--measure));gap:76px;justify-content:center;align-items:start}
.thx-pol .pol-side{position:sticky;top:104px;align-self:start;max-height:calc(100vh - 128px);overflow-y:auto;overflow-x:hidden;padding-bottom:20px}
.thx-pol .pol-side-title{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-44)!important;margin:0 0 14px;font-weight:600}
.thx-pol .pol-side ol{list-style:none;margin:0;padding:0;counter-reset:t}
.thx-pol .pol-side li{counter-increment:t;margin:0}
.thx-pol .pol-side a{display:flex;gap:9px;padding:7px 0 7px 14px;font-size:14px;line-height:1.35;color:var(--ink-60)!important;text-decoration:none!important;border-left:2px solid transparent;transition:color .15s ease,border-color .15s ease}
.thx-pol .pol-side a::before{content:counter(t) ".";color:var(--ink-44);flex:none;min-width:15px}
.thx-pol .pol-side a:hover{color:var(--ink)!important}
.thx-pol .pol-side a.active{color:var(--ink)!important;border-left-color:var(--ink);font-weight:560}
.thx-pol .pol-side a.active::before{color:var(--ink)}
.thx-pol .pol-side.pol-side-plain a::before{content:none}
.thx-pol .pol-body{max-width:var(--measure);min-width:0;margin:0;padding:6px 0 120px}
.thx-pol .pol-section{padding:30px 0 4px;border-top:1px solid var(--rule-4);counter-increment:sec;scroll-margin-top:112px}
.thx-pol .pol-section:first-child{border-top:0;padding-top:4px}
.thx-pol .pol-section h2{font-size:clamp(22px,2.6vw,28px);line-height:1.22;font-weight:560;letter-spacing:-.01em;margin:0 0 16px;color:var(--ink)!important;scroll-margin-top:112px}
.thx-pol .pol-section h2::before{content:counter(sec) ". ";color:var(--ink-44);font-weight:500}
.thx-pol[data-thx-transformed] .pol-body h2{font-size:clamp(22px,2.6vw,28px);line-height:1.22;font-weight:560;letter-spacing:-.01em;margin:34px 0 16px;padding-top:30px;color:var(--ink)!important;scroll-margin-top:112px;border-top:1px solid var(--rule-4)}
.thx-pol[data-thx-transformed] .pol-body h2:first-of-type{border-top:0;padding-top:0;margin-top:0}
.thx-pol[data-thx-autonum] .pol-body{counter-reset:secn}
.thx-pol[data-thx-autonum] .pol-body h2{counter-increment:secn}
.thx-pol[data-thx-autonum] .pol-body h2::before{content:counter(secn) ". ";color:var(--ink-44);font-weight:500}
.thx-pol .pol-body h3{font-size:18px;font-weight:600;margin:28px 0 8px;color:var(--ink)!important}
.thx-pol .pol-body p{margin:0 0 18px;color:var(--ink)!important}
.thx-pol .pol-body ul,.thx-pol .pol-body ol{margin:0 0 18px;padding-left:22px;color:var(--ink)!important}
.thx-pol .pol-body li{margin:0 0 10px;color:var(--ink)!important}
.thx-pol .pol-body a{color:var(--ink)!important;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--rule)}
.thx-pol .pol-body a:hover{color:var(--ink-60)!important;text-decoration-color:currentColor}
.thx-pol .pol-body strong{font-weight:600;color:var(--ink)!important}
.thx-pol .pol-body code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.88em;background:var(--rule-4);padding:1px 6px;border-radius:5px}
.thx-pol .pol-callout{background:var(--panel)!important;border:1px solid var(--rule)!important;border-radius:12px;padding:18px 20px;font-size:15px;line-height:1.65;margin:0 0 28px;color:var(--ink)!important}
.thx-pol .pol-body table{width:100%;border-collapse:collapse;margin:8px 0 28px;font-size:14px;line-height:1.55}
.thx-pol .pol-body th,.thx-pol .pol-body td{border:1px solid var(--rule)!important;padding:12px 14px;text-align:left;vertical-align:top;overflow-wrap:anywhere;color:var(--ink)!important}
.thx-pol .pol-body th{font-weight:600;background:var(--panel)!important}
.thx-pol ::selection{background:var(--ink)!important;color:#050505!important}
@media(max-width:980px){
  .thx-pol .pol-cols{grid-template-columns:170px minmax(0,1fr);gap:30px}
  .thx-pol .pol-head{max-width:none;padding:112px 0 18px}
  .thx-pol .pol-side a{font-size:12.5px;padding:6px 0 6px 10px;gap:7px}
}
@media(max-width:600px){
  .thx-pol{font-size:15.5px}
  .thx-pol .pol-cols{grid-template-columns:112px minmax(0,1fr);gap:16px}
  .thx-pol .pol-side{top:88px;max-height:calc(100vh - 108px)}
  .thx-pol .pol-side-title{font-size:10px;margin:0 0 10px}
  .thx-pol .pol-side a{font-size:10.5px;line-height:1.35;padding:5px 0 5px 7px;gap:5px}
  .thx-pol .pol-side a::before{min-width:11px}
  .thx-pol .pol-h1{font-size:clamp(26px,7.5vw,34px)}
  .thx-pol .pol-head{padding:100px 0 14px}
  .thx-pol .pol-body{padding-bottom:90px}
}`;
var PRIV_HTML=`<div id="thx-pol-root" class="thx-pol">
  <div class="pol-wrap">
    <header class="pol-head">
      <h1 class="pol-h1">Privacy Policy</h1>
      <p class="pol-meta">Effective June 26, 2026</p>
    </header>
    
    <div class="pol-cols">
      <aside class="pol-side"><nav aria-label="Table of contents"><p class="pol-side-title">Contents</p><ol></ol></nav></aside>
      <article class="pol-body">
        <section id="personal-data-we-collect" class="pol-section">
          <h2>Personal Data we collect</h2>
          <p>This Privacy Policy explains how Theodyx Inc. (&ldquo;Theodyx,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, discloses, and protects personal information. We are a media, talent-management, and technology/ventures company in the creator economy, organized as a Delaware C-Corporation. This Policy applies to www.theodyx.com and our related sites theodyx.net, theodyx.store, theodyx.xyz, theodyx.me, and theodyx.info (together, the &ldquo;Site&rdquo;), and to the &ldquo;Our Scouting&rdquo; creator-application flow available at <a href="/scouting">our scouting page</a>. A short, plain-language summary is available in our <a href="/policies/notice-at-collection">Notice at Collection</a>, and this Policy works alongside our <a href="/policies/terms-of-service">Terms &amp; Conditions</a> and <a href="/policies/cookie-policy">Cookie Policy</a>.</p>
          <p>We collect the following categories of personal information, described using CCPA categories together with the specific fields involved. We collect only what we need to operate the Site and to evaluate creator applications.</p>
          <ul>
            <li><strong>Identifiers.</strong> Your first and last name and your email address.</li>
            <li><strong>Age information.</strong> Your date of birth, which we use to confirm eligibility. We re-derive your age on the server (see the <a href="#children">Children</a> section below).</li>
            <li><strong>Geolocation (coarse).</strong> The city, state, and country you type into your application. We also derive a coarse, country-level location from your network connection; we do not collect precise GPS location.</li>
            <li><strong>Internet or other electronic network activity.</strong> Cookieless, first-party analytics &mdash; such as page views and scroll depth &mdash; and a salted hash of your IP address. We never store a raw IP address; we store only a one-way salted hash, together with minimal request metadata, for security and abuse-prevention.</li>
            <li><strong>Professional or creator information.</strong> Your primary platform, your social handles, your &ldquo;best links&rdquo; (URLs), and audience or creator details you choose to share.</li>
            <li><strong>Audio-visual information.</strong> Media you upload &mdash; a media-kit PDF and up to a few sample images or photos &mdash; plus any optional notes you add.</li>
            <li><strong>Inferences.</strong> Limited inferences we may draw from the above to evaluate a possible fit for representation. We do not use these to build advertising or cross-context tracking profiles.</li>
          </ul>
          <h3>Sources of personal information</h3>
          <p>We obtain personal information from two sources:</p>
          <ul>
            <li><strong>Directly from you</strong> &mdash; the information you type into the scouting application and the media you upload, including your age confirmation (14+) and your consent.</li>
            <li><strong>Automatically from your device and use of the Site</strong> &mdash; cookieless analytics signals (page views, scroll depth), the coarse country derived from your connection, and the salted IP hash and minimal request metadata generated by our security tools.</li>
          </ul>
          <h3>Sensitive personal information</h3>
          <p>Photos and full-length images of minors are treated as <strong>sensitive personal information</strong>. We use sensitive personal information only for limited, permitted purposes &mdash; to provide the service, to evaluate applications, and for security &mdash; and never to infer characteristics about a person and never for advertising. You may ask us to limit the use of your sensitive personal information; see <a href="/policies/your-privacy-choices">Your Privacy Choices</a>.</p>
        </section>
        <section id="how-we-use-personal-data" class="pol-section">
          <h2>How we use Personal Data</h2>
          <p>We use personal information for the following purposes:</p>
          <ul>
            <li><strong>To provide and operate the Site</strong> &mdash; to deliver pages, run the scouting flow, and measure basic, privacy-preserving usage.</li>
            <li><strong>To evaluate scouting applications</strong> &mdash; to review submissions and consider whether to reach out about possible representation. Applicant data may be routed into our internal creator-data system for this evaluation.</li>
            <li><strong>To communicate with you</strong> &mdash; to respond to applications, questions, and requests. We contact applicants only from official @theodyx email addresses.</li>
            <li><strong>For security and fraud-prevention</strong> &mdash; to protect the Site against abuse, bots, and unauthorized access, using tools such as a privacy-preserving CAPTCHA-alternative, a web-application firewall, rate limiting, and a privacy-safe audit log of salted hashes.</li>
            <li><strong>To comply with law</strong> &mdash; to meet legal obligations and to establish, exercise, or defend legal claims.</li>
          </ul>
        </section>
        <section id="disclosure-of-personal-data" class="pol-section">
          <h2>Disclosure of Personal Data</h2>
          <p>We do not sell your personal information. We disclose it only as follows:</p>
          <ul>
            <li><strong>To service providers and processors</strong> &mdash; including our cloud hosting, security, and storage provider, our website platform, and our email provider &mdash; under contracts that limit them to performing services for Theodyx and that prohibit using the information for their own purposes.</li>
            <li><strong>To affiliates</strong> under common control with Theodyx.</li>
            <li><strong>For legal and safety reasons</strong> &mdash; to comply with law, respond to lawful requests, enforce our <a href="/policies/terms-of-service">Terms &amp; Conditions</a>, and protect the rights, safety, and security of applicants, the public, and Theodyx.</li>
            <li><strong>In a corporate transaction</strong> &mdash; in connection with a merger, financing, acquisition, or sale of assets, subject to appropriate protections.</li>
          </ul>
          <p>Theodyx does not &ldquo;sell&rdquo; personal information and does not &ldquo;share&rdquo; it for cross-context behavioral advertising, as those terms are defined under the CCPA. We do not use third-party advertising cookies or ad pixels, and we do not engage in cross-site or cross-context tracking, nor do we work with data brokers.</p>
        </section>
        <section id="retention" class="pol-section">
          <h2>Retention</h2>
          <p>We keep personal information only for as long as necessary to fulfill the purposes described in this Policy, unless a longer retention period is required or permitted by law. We determine retention based on criteria such as: how long we need the information to evaluate an application and any resulting relationship; whether you ask us to delete it; and our legal, security, and recordkeeping obligations.</p>
          <p>Telemetry is minimized and automatically purged on a schedule. Our security audit log stores only salted hashes &mdash; never a raw IP address, user-agent string, or email &mdash; and is similarly retained only as long as needed for abuse-prevention.</p>
        </section>
        <section id="data-controls" class="pol-section">
          <h2>Data controls</h2>
          <p>We give you meaningful control over the limited information we handle.</p>
          <ul>
            <li><strong>Cookies and tracking.</strong> We use a cookieless, first-party approach to analytics and do not use advertising cookies or third-party ad pixels. The only client-side storage we rely on is a per-tab session token kept in your browser&rsquo;s <code>sessionStorage</code> (not a cookie), which is cleared when you close the tab. For details, see our <a href="/policies/cookie-policy">Cookie Policy</a>.</li>
            <li><strong>Global Privacy Control (GPC).</strong> We honor GPC browser signals as a valid opt-out preference signal. Because we do not sell or share personal information, a GPC signal does not change how your information is handled, but we recognize and respect it.</li>
            <li><strong>Sale, sharing, and sensitive information.</strong> You can record your preferences &mdash; including to opt out of any sale or sharing and to limit the use of sensitive personal information &mdash; through <a href="/policies/your-privacy-choices">Your Privacy Choices</a>.</li>
          </ul>
        </section>
        <section id="your-rights" class="pol-section">
          <h2>Your rights</h2>
          <p>Depending on where you live and applicable law, you may have the following rights (drawn from the California and Virginia-model frameworks):</p>
          <ul>
            <li><strong>Know and access</strong> &mdash; to learn what personal information we collect, use, and disclose, and to obtain a copy.</li>
            <li><strong>Delete</strong> &mdash; to ask us to delete personal information we hold about you.</li>
            <li><strong>Correct</strong> &mdash; to ask us to correct inaccurate personal information.</li>
            <li><strong>Data portability</strong> &mdash; to receive your information in a portable, readily usable format where applicable.</li>
            <li><strong>Opt out of sale or sharing, and of targeted advertising and certain profiling</strong> &mdash; though, as explained above, we do none of these.</li>
            <li><strong>Limit the use of sensitive personal information</strong> &mdash; see <a href="/policies/your-privacy-choices">Your Privacy Choices</a>.</li>
            <li><strong>Non-discrimination and no retaliation</strong> &mdash; we will not discriminate or retaliate against you for exercising any of these rights.</li>
            <li><strong>Appeal</strong> &mdash; if we deny your request, you may appeal our decision (Virginia-model). We will respond within the time the law allows and explain our reasoning.</li>
          </ul>
          <h3>How to exercise your rights</h3>
          <p>To make a request, email <a href="mailto:contact@theodyx.com">contact@theodyx.com</a>. We will take reasonable steps to <strong>verify your identity</strong> before acting, which may include confirming information you previously provided. You may use an <strong>authorized agent</strong> to submit a request on your behalf; we may ask the agent for proof of authorization and may ask you to verify your identity directly. We aim to respond within the timelines required by applicable law, and we will let you know if we need additional time.</p>
        </section>
        <section id="children" class="pol-section">
          <h2>Children</h2>
          <p>You must be at least 14 years old to apply through the scouting flow, and this minimum is enforced on the server (your date of birth is re-derived on the server, not merely accepted as a checkbox). We block applicants under 13 entirely, consistent with a conservative reading of the Children&rsquo;s Online Privacy Protection Act (COPPA).</p>
          <p>We do not sell or share the personal information of consumers we know to be under 16 years of age without the affirmative authorization (opt-in) required by California Civil Code section 1798.120(c). Because we do not sell or share personal information at all, no such authorization is sought.</p>
          <p>A parent or guardian may contact us to exercise rights on behalf of an eligible minor, including to access, correct, or delete the minor&rsquo;s information. Please email <a href="mailto:contact@theodyx.com">contact@theodyx.com</a>. To report impersonation or a safety concern involving a minor, contact <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a> and see our <a href="/policies/scouting-safety">Scouting Safety &amp; Anti-Impersonation Notice</a>.</p>
        </section>
        <section id="security" class="pol-section">
          <h2>Security</h2>
          <p>We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. These include one-way salted hashing of IP addresses, encryption of data in transit, access controls, and abuse-prevention tooling such as a privacy-preserving CAPTCHA-alternative and a web-application firewall. No method of transmission or storage is perfectly secure, and we cannot guarantee absolute security; we encourage you to share only what you are comfortable providing.</p>
        </section>
        <section id="additional-us-state-disclosures" class="pol-section">
          <h2>Additional U.S. state disclosures</h2>
          <p>We have written this Policy to meet a high-water mark drawn from the California Consumer Privacy Act, as amended by the California Privacy Rights Act (together, the &ldquo;CCPA&rdquo;), and from Virginia-model comprehensive privacy laws, so that we can offer strong, consistent protections to everyone. This section summarizes disclosures for residents of U.S. states with comprehensive privacy laws.</p>
          <h3>California</h3>
          <p>In the sections above we describe the categories of personal information we collect and the sources of that information (see <a href="#personal-data-we-collect">Personal Data we collect</a>), the business and commercial purposes for collecting it (see <a href="#how-we-use-personal-data">How we use Personal Data</a>), and the categories of recipients to whom we disclose it (see <a href="#disclosure-of-personal-data">Disclosure of Personal Data</a>). We do <strong>not</strong> sell or &ldquo;share&rdquo; personal information for cross-context behavioral advertising, and we do not use sensitive personal information to infer characteristics. California residents have the rights described under <a href="#your-rights">Your rights</a>, may designate an authorized agent, will not be discriminated against for exercising those rights, and may record preferences through <a href="/policies/your-privacy-choices">Your Privacy Choices</a>. We honor Global Privacy Control signals.</p>
          <h3>Virginia and similar states</h3>
          <p>Residents of Virginia and other states with comparable laws have the rights to access, correct, delete, and obtain a portable copy of their personal data, and to opt out of targeted advertising, the sale of personal data, and certain profiling. As explained above, we do not engage in those processing activities. You also have the right to <strong>appeal</strong> a refusal to act on a request; to appeal, reply to our response or email <a href="mailto:contact@theodyx.com">contact@theodyx.com</a> with &ldquo;Appeal&rdquo; in the subject line.</p>
        </section>
        <section id="changes-to-the-privacy-policy" class="pol-section">
          <h2>Changes to the privacy policy</h2>
          <p>We may update this Policy from time to time. When we do, we will revise the effective date shown with this Policy and, where appropriate, provide additional notice. Your continued use of the Site after an update means you accept the revised Policy.</p>
        </section>
        <section id="data-controller" class="pol-section">
          <h2>Data controller</h2>
          <p>Theodyx Inc., a Delaware C-Corporation, is the controller responsible for the personal information handled under this Policy. You can reach us using the details in <a href="#how-to-contact-us">How to contact us</a>.</p>
          <p>Theodyx is based in the United States, and we process and store personal information in the United States. Our launch is US-only. We do not currently target or monitor individuals in the European Union, the United Kingdom, Canada, Brazil, or China, and the corresponding regional privacy modules are dormant. If that changes, additional regional rights and representative arrangements would apply, and we would update this Policy accordingly.</p>
        </section>
        <section id="how-to-contact-us" class="pol-section">
          <h2>How to contact us</h2>
          <p>If you have questions about this Policy or our privacy practices, you can contact us:</p>
          <ul>
            <li>By email at <a href="mailto:contact@theodyx.com">contact@theodyx.com</a></li>
            <li>By phone at +1.938.293.5290</li>
            <li>By mail at Theodyx Inc., 16192 Coastal Highway, Lewes, DE 19958</li>
          </ul>
          <p>For scouting safety or impersonation reports, email <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</p>
        </section>
        <section id="useful-resources" class="pol-section">
          <h2>Useful resources</h2>
          <ul>
            <li><a href="/policies/notice-at-collection">Notice at Collection</a> &mdash; a short, plain-language summary of what we collect and why.</li>
            <li><a href="/policies/your-privacy-choices">Your Privacy Choices</a> &mdash; opt out of any sale or sharing and limit use of sensitive information.</li>
            <li><a href="/policies/cookie-policy">Cookie Policy</a> &mdash; our privacy-first, largely cookieless approach.</li>
            <li><a href="/policies/terms-of-service">Terms &amp; Conditions</a> &mdash; the terms that govern your use of Theodyx and Our Scouting.</li>
            <li><a href="/policies/scouting-safety">Scouting Safety &amp; Anti-Impersonation Notice</a> &mdash; how we operate and how to report scams.</li>
            <li><a href="/policies/dmca">DMCA &amp; Copyright Policy</a> and <a href="/policies/accessibility">Accessibility Statement</a>.</li>
            <li><a href="/policies/legal">All Terms &amp; policies</a> in one place.</li>
          </ul>
        </section>
      </article>
    </div>
  </div>
</div>`;
var TERMS_HTML=`<div id="thx-pol-root" class="thx-pol"><div class="pol-wrap"><header class="pol-head"><h1 class="pol-h1">Terms & Conditions</h1><p class="pol-meta">Effective July 21, 2026 · Last updated July 21, 2026</p><a class="pol-prev" href="#">Previous version</a></header><main class="pol-body"><p class="pol-callout">PLEASE READ THESE TERMS &amp; CONDITIONS CAREFULLY. They contain important information about your legal rights, remedies, and obligations. Section 20 (Dispute Resolution; Binding Arbitration; Class Action Waiver) contains a binding arbitration agreement, a class-action waiver, and a jury-trial waiver that affect how disputes between you and Theodyx are resolved, including your right to bring or participate in a lawsuit in court. You may opt out of the arbitration agreement within thirty (30) days as described in Section 20.5.</p>
<p>If you are under the age of 18, you may use the Services and submit an application only with the involvement, permission, and supervision of a parent or legal guardian, who must review and agree to these Terms on your behalf. See Section 3.</p>

<h2 id="agreement">1. Agreement to These Terms</h2>
<p>These Terms &amp; Conditions (the &ldquo;Terms&rdquo;) are a legally binding agreement between you (&ldquo;you,&rdquo; &ldquo;your,&rdquo; or &ldquo;User&rdquo;) and Theodyx Inc., a Delaware corporation, together with its Affiliates (as defined below) (&ldquo;Theodyx,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms govern your access to and use of the websites located at <a href="https://www.theodyx.com">www.theodyx.com</a> and our related sites, including theodyx.net, theodyx.store, theodyx.xyz, theodyx.me, theodyx.info, and theodyxcapital.com (collectively, the &ldquo;Site&rdquo;), the &ldquo;Our Scouting&rdquo; creator-application experience available through the Site (the &ldquo;Scouting Application&rdquo;), and all related content, features, tools, and services we make available (together with the Site and the Scouting Application, the &ldquo;Services&rdquo;).</p>
<p>By accessing or using the Services, by submitting a Scouting Application, or by clicking to accept or agree to these Terms where that option is made available to you, you acknowledge that you have read, understood, and agree to be bound by these Terms and by our Privacy Policy, which is incorporated into these Terms by reference. If you do not agree to these Terms, you must not access or use the Services.</p>
<p>These Terms work alongside our other policies, each of which is incorporated by reference and applies to your use of the Services, including our:</p>
<ul>
<li><a href="/policies/privacy-policy">Privacy Policy</a></li>
<li><a href="/policies/notice-at-collection">Notice at Collection</a></li>
<li><a href="/policies/cookie-policy">Cookie Policy</a></li>
<li><a href="/policies/your-privacy-choices">Your Privacy Choices</a></li>
<li><a href="/policies/dmca">DMCA &amp; Copyright Policy</a></li>
<li><a href="/policies/accessibility">Accessibility Statement</a></li>
<li><a href="/policies/scouting-safety">Scouting Safety &amp; Anti-Impersonation Notice</a></li>
</ul>
<p>If any conflict exists between these Terms and any of the policies listed above with respect to the subject matter of that policy, the more specific policy controls as to that subject matter.</p>

<h2 id="definitions">2. Definitions</h2>
<p>For purposes of these Terms:</p>
<p>&ldquo;Affiliate&rdquo; means any entity that directly or indirectly controls, is controlled by, or is under common control with Theodyx Inc., where &ldquo;control&rdquo; means ownership of more than fifty percent (50%) of the voting equity or the power to direct the management and policies of the entity, whether through ownership, contract, or otherwise. Affiliates include any present or future parent company of Theodyx Inc. and its subsidiaries.</p>
<p>&ldquo;Applicant&rdquo; means any individual who submits, or on whose behalf a parent or guardian submits, a Scouting Application.</p>
<p>&ldquo;Content&rdquo; means all text, images, photographs, video, audio, graphics, data, links, files, and other materials.</p>
<p>&ldquo;Minor&rdquo; means any individual under the age of 18, or any individual who is treated as a minor under the laws of the jurisdiction in which that individual resides.</p>
<p>&ldquo;Submission&rdquo; means any Content that you or, where applicable, a parent or guardian on your behalf, submit, upload, transmit, or otherwise make available to Theodyx through the Services, including through the Scouting Application &mdash; for example, your name, contact information, date of birth, location, social media handles, links, a media kit, sample photographs or images, and any notes or other information you choose to provide.</p>
<p>&ldquo;Theodyx Content&rdquo; means all Content that Theodyx owns or licenses and makes available through the Services, together with the design, structure, arrangement, and &ldquo;look and feel&rdquo; of the Services.</p>

<h2 id="eligibility">3. Eligibility; Minors and Parental Consent</h2>
<p><strong>3.1 Minimum Age.</strong> The Services, including the Scouting Application, are available only to individuals who are at least fourteen (14) years of age. We do not knowingly permit any individual under the age of thirteen (13) to use the Services or to submit a Scouting Application, and we take steps to block applications from individuals under 13, consistent with the Children&rsquo;s Online Privacy Protection Act (&ldquo;COPPA&rdquo;). Your age is verified on our servers based on the date of birth you provide; providing a false date of birth is a breach of these Terms.</p>
<p><strong>3.2 Users Under 18.</strong> If you are under the age of 18, you may access and use the Services and submit a Scouting Application only with the knowledge, permission, involvement, and supervision of a parent or legal guardian. By using the Services or submitting a Scouting Application as a Minor, you represent that a parent or legal guardian has reviewed and agreed to these Terms on your behalf and consents to your use of the Services and to the collection and processing of your information as described in our Privacy Policy.</p>
<p><strong>3.3 Parental and Guardian Acceptance.</strong> A parent or legal guardian who permits a Minor to use the Services or who submits a Scouting Application on a Minor&rsquo;s behalf: (a) represents and warrants that they are the parent or legal guardian of the Minor and have the legal authority to act on the Minor&rsquo;s behalf; (b) agrees to be bound by these Terms both individually and on behalf of the Minor; (c) agrees to supervise the Minor&rsquo;s use of the Services; and (d) accepts responsibility for the Minor&rsquo;s compliance with these Terms. See also Section 8.</p>
<p><strong>3.4 Authority to Contract.</strong> If you are 18 or older, you represent that you have the legal capacity to enter into these Terms. If you use the Services on behalf of another person or an entity, you represent that you have authority to bind that person or entity to these Terms.</p>
<p><strong>3.5 Geographic Scope.</strong> The Services are intended for users located in the United States. We make no representation that the Services are appropriate or available for use outside the United States, and access from other jurisdictions is at your own risk and subject to local law.</p>

<h2 id="services">4. The Services</h2>
<p>The Services consist of (a) a marketing and informational website that provides information about Theodyx, our people, our capabilities, our sectors, and our perspectives; and (b) the Scouting Application, an experience through which creators and talent may apply to be considered by Theodyx. We may add, change, suspend, or discontinue any part of the Services at any time, with or without notice. We are not liable to you or to any third party for any modification, suspension, or discontinuation of the Services or any part of them.</p>

<h2 id="scouting-application">5. The Scouting Application; No Guarantee of Representation; No Fees</h2>
<p><strong>5.1 Nature of the Scouting Application.</strong> The Scouting Application allows you to submit information and media so that Theodyx may consider whether to reach out to you about possible representation or collaboration. Submitting a Scouting Application is an application only.</p>
<p><strong>5.2 No Relationship Created.</strong> Submitting a Scouting Application, and any review of it by Theodyx, does not create any agency, representation, management, employment, partnership, joint venture, or other contractual or fiduciary relationship between you and Theodyx. Any representation or management relationship, if one is ever offered and accepted, would be governed exclusively by a separate written agreement signed by you (and, if you are a Minor, by your parent or legal guardian) and by Theodyx. Until such a separate written agreement is executed, no such relationship exists.</p>
<p><strong>5.3 No Guarantee of Outcome.</strong> We make no promise, guarantee, or representation that we will contact you, review your Submission within any particular time, offer you representation, secure you any engagement, placement, opportunity, brand partnership, compensation, exposure, or audience, or achieve any result of any kind. Any statements about potential opportunities are aspirational and are not commitments.</p>
<p><strong>5.4 No Fees.</strong> Applying to Our Scouting is free. We do not charge any application fee, registration fee, &ldquo;processing&rdquo; fee, or any other cost to apply or to be considered. We will never ask you to pay money, purchase anything, buy gift cards, or provide banking, credit-card, or other financial or payment information as part of applying or being considered. See Section 10.</p>
<p><strong>5.5 Evaluation.</strong> We may review, evaluate, retain, or decline any Submission in our sole discretion and for any lawful reason or no reason. We are under no obligation to review or respond to any Submission.</p>

<h2 id="registration">6. Registration and Account Security</h2>
<p>Certain features of the Services may require you to submit information or, in the future, to create an account. You agree to provide accurate, current, and complete information and to keep it updated. You are responsible for maintaining the confidentiality of any credentials associated with your use of the Services and for all activity that occurs under them. You agree to notify us promptly at <a href="mailto:contact@theodyx.com">contact@theodyx.com</a> of any unauthorized use. We are not liable for any loss arising from your failure to safeguard your credentials.</p>

<h2 id="submissions">7. User Submissions and Content</h2>
<p><strong>7.1 Your Submissions.</strong> You are solely responsible for your Submissions and for the consequences of making them. You retain ownership of any intellectual property rights that you hold in your Submissions, subject to the license you grant to Theodyx in Section 7.2.</p>
<p><strong>7.2 License to Theodyx.</strong> By making a Submission, you (and, if you are a Minor, your parent or legal guardian on your behalf) grant to Theodyx a non-exclusive, worldwide, royalty-free, fully paid-up, sublicensable (solely to our service providers acting on our behalf) license to host, store, back up, reproduce, transmit, reformat, and display your Submission solely for the following purposes: (a) operating, providing, maintaining, and securing the Services; (b) reviewing and evaluating your Scouting Application and considering whether to offer representation or collaboration; and (c) protecting the Services and Theodyx against fraud, abuse, and security threats. This license does not permit Theodyx to use your Submission for advertising or marketing, to build advertising or cross-context tracking profiles, or for any purpose beyond those stated in this Section, and it is not a perpetual or irrevocable license. This license ends when your Submission is deleted from our active systems, except that (i) we may retain and use residual copies in routine backups for a limited period, and (ii) we may retain and use your Submission as required to comply with law or to establish, exercise, or defend legal claims, as described in our Privacy Policy. Any broader use of your name, image, likeness, voice, or Content &mdash; for example, in a public case study or promotional material &mdash; would require your separate, express permission.</p>
<p><strong>7.3 Your Representations and Warranties.</strong> For each Submission, you represent and warrant that: (a) you own or otherwise have all rights, licenses, consents, and permissions necessary to make the Submission and to grant the license in Section 7.2; (b) the Submission, and our use of it as permitted by these Terms, does not and will not infringe, misappropriate, or violate any third party&rsquo;s intellectual property, privacy, publicity, or other rights, or any law; (c) the Submission is accurate and not misleading; (d) if any person depicted or identified in the Submission is a Minor, you are the parent or legal guardian of that Minor or you have obtained the verifiable consent of that Minor&rsquo;s parent or legal guardian; and (e) the Submission complies with Section 7.4 and Section 9.</p>
<p><strong>7.4 Prohibited Submissions.</strong> You must not submit any Content that: (a) is nude, sexually explicit, sexually suggestive, lingerie-based, or otherwise sexualized or inappropriate &mdash; the only images you should submit are ordinary sample photographs and an optional media kit; (b) depicts, sexualizes, or endangers any Minor; (c) is unlawful, defamatory, harassing, threatening, hateful, or obscene; (d) infringes or misappropriates any third party&rsquo;s rights; (e) contains malware or malicious code; (f) contains another person&rsquo;s personal information without authorization; or (g) is false, deceptive, or intended to impersonate any person or entity. We take Content involving Minors extremely seriously and will act on, and where required report, any Content that sexualizes or endangers a Minor.</p>
<p><strong>7.5 No Confidentiality; No Obligation.</strong> We do not treat Submissions as confidential or proprietary, and no Submission creates any confidentiality or fiduciary obligation on our part. We are not obligated to use, review, return, or store any Submission.</p>
<p><strong>7.6 Removal.</strong> We may, but are not obligated to, review, monitor, screen, refuse, remove, or disable access to any Submission at any time, in our sole discretion, including any Submission we believe violates these Terms or may expose Theodyx or any person to harm or liability. You may request removal or deletion of your Submission as described in our Privacy Policy.</p>

<h2 id="parental-responsibilities">8. Parental and Guardian Responsibilities</h2>
<p>We strongly encourage parents and legal guardians to be actively involved in a Minor&rsquo;s use of the Services and in any communications that follow a Scouting Application. A parent or legal guardian who consents to a Minor&rsquo;s use of the Services agrees to supervise that use and acknowledges that a Minor should never be asked to handle money, share financial information, send private or inappropriate images, or move a conversation to a private or off-platform channel &mdash; and that, if any of these occurs, a trusted adult should be involved immediately. Parents and guardians may exercise privacy rights on behalf of a Minor as described in our Privacy Policy, and may contact us at any time at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</p>

<h2 id="acceptable-use">9. Acceptable Use Policy</h2>
<p>You agree that you will not, and will not attempt to, and will not permit any third party to:</p>
<p>(a) use the Services for any unlawful, fraudulent, harmful, or deceptive purpose; (b) impersonate Theodyx, any Theodyx personnel, or any other person or entity, or misrepresent your affiliation with any person or entity; (c) upload or transmit any Content prohibited by Section 7.4; (d) harass, abuse, threaten, or harm any other person, including any Minor; (e) interfere with, disrupt, or attempt to gain unauthorized access to the Services, our servers, or any systems or networks connected to the Services; (f) circumvent, disable, or interfere with any security, authentication, rate-limiting, anti-abuse, or content-protection feature of the Services (including any bot-protection or verification tool we use); (g) use any robot, spider, scraper, or other automated means to access, scrape, or collect Content or data from the Services without our express written permission; (h) reverse engineer, decompile, or disassemble any part of the Services, except to the extent that restriction is prohibited by law; (i) use the Services to send unsolicited communications, advertising, or spam; (j) collect or harvest any information about other users; or (k) use the Services in any manner that could damage, disable, overburden, or impair the Services or interfere with any other party&rsquo;s use of the Services.</p>
<p>We may investigate and take appropriate action against anyone who, in our sole discretion, violates this Section, including removing Content, suspending or terminating access, and reporting conduct to law-enforcement authorities.</p>

<h2 id="official-communications">10. Official Communications; Anti-Impersonation; Safety</h2>
<p>Because Applicants include Minors and share personal information and media, we hold ourselves to firm rules so that impersonation and scams are easier to identify. These rules are part of these Terms:</p>
<p>(a) We contact Applicants only from official @theodyx.com email addresses. Genuine messages from us come from an address ending in @theodyx.com (for example, <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>). A message that claims to be from Theodyx but comes from any other address is not from us. (b) We never charge a fee to apply, and we never ask you to send money, buy gift cards, or pay any cost. (c) We never ask for payment, banking, or financial information. (d) We never request nude, lingerie, sexualized, or otherwise inappropriate photographs, and we never ask for images beyond ordinary sample photos and an optional media kit submitted through the Scouting Application. (e) We do not move Minors to private or off-platform chats, we do not ask for personal contact details for that purpose, and we never ask anyone to keep communications secret from a parent or guardian.</p>
<p>Anyone acting inconsistently with the rules above is not Theodyx. If you receive a suspicious message, or if any request makes you uncomfortable, do not send money, images, or personal information &mdash; instead, report it to us at <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a> with as much detail as you can, and, if you believe you are in immediate danger, contact your local emergency services first. For more information, see our <a href="/policies/scouting-safety">Scouting Safety &amp; Anti-Impersonation Notice</a>.</p>

<h2 id="intellectual-property">11. Intellectual Property Rights</h2>
<p><strong>11.1 Our IP.</strong> The Services and all Theodyx Content are owned by Theodyx or its licensors and are protected by United States and international copyright, trademark, trade-secret, and other intellectual-property laws. Except for the limited license in Section 11.3, nothing in these Terms transfers to you any right, title, or interest in the Services or Theodyx Content.</p>
<p><strong>11.2 Trademarks.</strong> &ldquo;Theodyx,&rdquo; &ldquo;Theodyx Capital,&rdquo; the Theodyx logos, and all related names, marks, designs, and slogans are trademarks of Theodyx or its Affiliates. You may not use any of these marks without our prior written permission. All other names, logos, and marks appearing on the Services are the property of their respective owners.</p>
<p><strong>11.3 Limited License to You.</strong> Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services and to view Theodyx Content for your personal, non-commercial purposes. You must not copy, reproduce, distribute, publicly display, modify, create derivative works from, sell, or exploit any part of the Services or Theodyx Content except as expressly permitted by these Terms or with our prior written consent.</p>
<p><strong>11.4 Feedback.</strong> If you send us any suggestions, ideas, or feedback about the Services (&ldquo;Feedback&rdquo;), you grant Theodyx a perpetual, irrevocable, worldwide, royalty-free license to use and incorporate that Feedback for any purpose, without any obligation or compensation to you. Feedback is not treated as your confidential information.</p>

<h2 id="third-party-links">12. Third-Party Links and Services</h2>
<p>The Services may contain links to third-party websites, platforms, or services that are not owned or controlled by Theodyx. We provide these links for convenience only, and we do not endorse and are not responsible for the content, policies, or practices of any third party. Your use of any third-party website or service is at your own risk and is governed by that third party&rsquo;s terms and policies.</p>

<h2 id="dmca">13. Copyright / DMCA</h2>
<p>Theodyx respects the intellectual-property rights of others and responds to notices of alleged copyright infringement in accordance with the Digital Millennium Copyright Act. If you believe that Content on the Services infringes your copyright, please follow the procedures in our <a href="/policies/dmca">DMCA &amp; Copyright Policy</a>. We may, in appropriate circumstances and in our discretion, terminate the access of users who are repeat infringers.</p>

<h2 id="privacy">14. Privacy</h2>
<p>Your use of the Services is subject to our <a href="/policies/privacy-policy">Privacy Policy</a>, <a href="/policies/notice-at-collection">Notice at Collection</a>, <a href="/policies/cookie-policy">Cookie Policy</a>, and <a href="/policies/your-privacy-choices">Your Privacy Choices</a>, which describe how we collect, use, disclose, and protect personal information, and which are incorporated into these Terms by reference. Please review them carefully.</p>

<h2 id="third-party-beneficiaries">15. Third-Party Beneficiaries; Corporate Structure</h2>
<p>The Services are provided by Theodyx Inc. Theodyx Inc.&rsquo;s Affiliates &mdash; including any present or future parent company and its subsidiaries &mdash; are intended third-party beneficiaries of the disclaimers, limitations of liability, releases, and indemnities in these Terms and are entitled to enforce and rely on those provisions as if they were a party to these Terms. Except as stated in this Section, these Terms do not create any third-party beneficiary rights.</p>

<h2 id="disclaimers">16. Disclaimers of Warranties</h2>
<p>THE SERVICES, INCLUDING ALL THEODYX CONTENT AND THE SCOUTING APPLICATION, ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITH ALL FAULTS AND WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, THEODYX AND ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS (THE &ldquo;THEODYX PARTIES&rdquo;), DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, AND NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.</p>
<p>WITHOUT LIMITING THE FOREGOING, THE THEODYX PARTIES MAKE NO WARRANTY THAT: (A) THE SERVICES WILL MEET YOUR REQUIREMENTS OR BE AVAILABLE, UNINTERRUPTED, SECURE, TIMELY, OR ERROR-FREE; (B) ANY DEFECTS WILL BE CORRECTED; (C) THE SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR (D) ANY SUBMISSION WILL BE REVIEWED, RETAINED, OR RESULT IN CONTACT, REPRESENTATION, PLACEMENT, COMPENSATION, EXPOSURE, OR ANY OTHER OUTCOME. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM THEODYX OR THROUGH THE SERVICES, CREATES ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS.</p>
<p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO SOME OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.</p>

<h2 id="limitation-of-liability">17. Limitation of Liability</h2>
<p>TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE THEODYX PARTIES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OPPORTUNITIES, OR REPUTATION, ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF (OR INABILITY TO USE) THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT THE THEODYX PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
<p>TO THE FULLEST EXTENT PERMITTED BY LAW, THE TOTAL AGGREGATE LIABILITY OF THE THEODYX PARTIES ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID TO THEODYX, IF ANY, IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE LIABILITY, OR (B) ONE HUNDRED U.S. DOLLARS (US$100).</p>
<p>THESE LIMITATIONS ARE A FUNDAMENTAL BASIS OF THE BARGAIN BETWEEN YOU AND THEODYX AND APPLY EVEN IF ANY LIMITED REMEDY FAILS OF ITS ESSENTIAL PURPOSE. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU. NOTHING IN THESE TERMS LIMITS LIABILITY THAT CANNOT BE LIMITED UNDER APPLICABLE LAW.</p>

<h2 id="indemnification">18. Indemnification</h2>
<p>To the fullest extent permitted by law, you (and, if you are a Minor, your parent or legal guardian) agree to defend, indemnify, and hold harmless the Theodyx Parties from and against any claims, demands, actions, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&rsquo; fees) arising out of or relating to: (a) your Submissions; (b) your use or misuse of the Services; (c) your violation of these Terms; (d) your violation of any law or of any third party&rsquo;s rights, including any intellectual-property, privacy, or publicity right; or (e) any misrepresentation you make. We reserve the right, at our own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which case you agree to cooperate with our defense of that matter. You may not settle any matter without our prior written consent.</p>

<h2 id="term-termination">19. Term and Termination</h2>
<p>These Terms remain in effect while you access or use the Services. We may suspend or terminate your access to the Services at any time, with or without cause and with or without notice, including if we believe you have violated these Terms. You may stop using the Services at any time. Upon termination, the licenses granted to you under these Terms end, and any provisions that by their nature should survive termination will survive, including Sections 7.2 (as limited therein), 7.3, 11, 15, 16, 17, 18, 20, 21, and 23.</p>

<h2 id="dispute-resolution">20. Dispute Resolution; Binding Arbitration; Class Action Waiver</h2>
<p>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS AND REQUIRES INDIVIDUAL ARBITRATION OF MOST DISPUTES INSTEAD OF COURT PROCEEDINGS AND CLASS ACTIONS.</p>
<p><strong>20.1 Informal Resolution First.</strong> Before starting any arbitration or other proceeding, you and Theodyx agree to try in good faith to resolve any dispute informally. You agree to send a written notice describing the dispute and the relief you seek to <a href="mailto:contact@theodyx.com">contact@theodyx.com</a>. You and Theodyx will attempt to resolve the dispute through good-faith negotiation for at least sixty (60) days after the notice is received. If the dispute is not resolved within that period, either party may begin arbitration.</p>
<p><strong>20.2 Binding Arbitration.</strong> Except for the disputes described in Section 20.6, you and Theodyx agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Services will be resolved by final and binding individual arbitration, rather than in court. The Federal Arbitration Act governs the interpretation and enforcement of this Section. The arbitration will be administered by [the American Arbitration Association (&ldquo;AAA&rdquo;) under its Consumer Arbitration Rules &mdash; OR another established arbitration provider selected in consultation with counsel], as modified by these Terms. The arbitration will be conducted in the English language. Unless you and Theodyx agree otherwise, any in-person hearing will take place in the county of your residence or by videoconference. The arbitrator&rsquo;s award may be entered as a judgment in any court of competent jurisdiction.</p>
<p><strong>20.3 Class Action Waiver.</strong> You and Theodyx agree that each may bring claims against the other only in an individual capacity, and not as a plaintiff or class member in any purported class, collective, consolidated, or representative proceeding. The arbitrator may not consolidate more than one person&rsquo;s claims and may not preside over any form of class or representative proceeding. If this Section 20.3 is found to be unenforceable as to a particular claim or request for relief, then that claim or request will be severed and brought in a court of competent jurisdiction, while all other claims will proceed in arbitration.</p>
<p><strong>20.4 Jury Trial Waiver.</strong> To the extent any dispute proceeds in court rather than arbitration, you and Theodyx each waive any right to a trial by jury to the fullest extent permitted by law.</p>
<p><strong>20.5 Right to Opt Out of Arbitration.</strong> You may opt out of the arbitration agreement and class-action waiver in Sections 20.2 and 20.3 by sending written notice to Theodyx Inc. at <a href="mailto:contact@theodyx.com">contact@theodyx.com</a>, or by mail at Theodyx Inc., 16192 Coastal Highway, Lewes, DE 19958, within thirty (30) days after you first accept these Terms. Your notice must include your name and a clear statement that you wish to opt out of arbitration. If you opt out, neither you nor Theodyx will be required to arbitrate, and the informal-resolution requirement in Section 20.1 still applies. Opting out of arbitration has no effect on any other part of these Terms.</p>
<p><strong>20.6 Exceptions.</strong> This Section 20 does not require arbitration of: (a) any individual claim that qualifies for small-claims court, so long as it remains in that court and proceeds on an individual basis; or (b) any claim seeking injunctive or other equitable relief to stop the unauthorized use or abuse of the Services or the infringement or misappropriation of intellectual-property rights.</p>
<p><strong>20.7 Survival and Severability.</strong> This Section 20 survives termination of these Terms. If any part of this Section (other than Section 20.3, which is governed by its own terms) is found invalid or unenforceable, the remainder of this Section will remain in effect.</p>
<p><em>Note regarding Minors:</em> The enforceability of arbitration agreements and class-action waivers against Minors is not settled and varies by jurisdiction. This Section is drafted to rely on the agreement of the parent or legal guardian who accepts these Terms on a Minor&rsquo;s behalf under Section 3. Your counsel should confirm how this Section should be applied given your specific circumstances.</p>

<h2 id="governing-law">21. Governing Law and Venue</h2>
<p>These Terms and any dispute arising out of or relating to them or the Services are governed by the laws of the State of Delaware, without regard to its conflict-of-laws principles, and by applicable United States federal law. Subject to Section 20, you and Theodyx agree that any dispute not subject to arbitration will be brought exclusively in the state or federal courts located in the State of Delaware, and you and Theodyx consent to the personal jurisdiction of those courts.</p>

<h2 id="changes">22. Changes to These Terms</h2>
<p>We may update these Terms from time to time. When we do, we will revise the &ldquo;Last Updated&rdquo; date above and, where appropriate, provide additional notice, such as by posting a notice on the Site or, where we have your email address, by email. Changes are effective when posted unless we state otherwise. Your continued access to or use of the Services after changes become effective means you accept the revised Terms. If you do not agree to the revised Terms, you must stop using the Services.</p>

<h2 id="general">23. General Provisions</h2>
<p><strong>23.1 Entire Agreement.</strong> These Terms, together with the policies incorporated by reference, constitute the entire agreement between you and Theodyx regarding the Services and supersede all prior or contemporaneous understandings on that subject.</p>
<p><strong>23.2 Severability.</strong> If any provision of these Terms is held invalid or unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect.</p>
<p><strong>23.3 No Waiver.</strong> Our failure to enforce any provision of these Terms is not a waiver of that provision or of any other provision. Any waiver must be in writing to be effective.</p>
<p><strong>23.4 Assignment.</strong> You may not assign or transfer these Terms or any of your rights or obligations under them without our prior written consent, and any attempted assignment in violation of this Section is void. We may freely assign or transfer these Terms, in whole or in part, including to any Affiliate or parent company, or in connection with a merger, acquisition, financing, reorganization, or sale of assets. These Terms bind and benefit the parties and their permitted successors and assigns.</p>
<p><strong>23.5 Relationship of the Parties.</strong> Nothing in these Terms creates any agency, partnership, joint venture, employment, or fiduciary relationship between you and Theodyx.</p>
<p><strong>23.6 Force Majeure.</strong> Theodyx is not liable for any failure or delay in performance caused by events beyond its reasonable control, including acts of God, natural disasters, labor disputes, internet or utility failures, cyberattacks, governmental action, or war.</p>
<p><strong>23.7 Notices and Electronic Communications.</strong> We may provide notices to you by posting on the Site or by email. You consent to receive communications from us electronically, and you agree that electronic communications satisfy any legal requirement that a communication be in writing. You may contact us as described in Section 24.</p>
<p><strong>23.8 Headings.</strong> Section headings are for convenience only and do not affect the interpretation of these Terms.</p>

<h2 id="contact">24. Contact Information</h2>
<p>If you have questions about these Terms, please contact us:</p>
<p>Theodyx Inc.<br>16192 Coastal Highway<br>Lewes, DE 19958<br>Email: <a href="mailto:contact@theodyx.com">contact@theodyx.com</a><br>Phone: +1.938.293.5290</p>
<p>For scouting safety, impersonation reports, or concerns involving a Minor: <a href="mailto:scouting@theodyx.com">scouting@theodyx.com</a>.</p>
</main></div></div>`;
var NAV=112;
function slug(t){return (t||'').toLowerCase().replace(/^\s*\d+[\.\)]\s*/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'section';}
function removeOtherPols(){
  var ex=document.querySelectorAll('.thx-pol');
  for(var i=0;i<ex.length;i++){var el=ex[i];if(el.id==='thx-pol-root')continue;
    var w=(el.closest&&el.closest('.w-embed'))||el.parentElement||el;
    if(w&&w.parentNode)w.parentNode.removeChild(w);else if(el.parentNode)el.parentNode.removeChild(el);}
}
function placeBeforeFooter(root){
  var footer=document.querySelector('footer,.footer');
  if(footer&&footer.parentNode&&footer.compareDocumentPosition(root)&Node.DOCUMENT_POSITION_FOLLOWING){footer.parentNode.insertBefore(root,footer);}
}
function injectRoot(html){
  var w=document.createElement('div');w.innerHTML=html;var root=w.firstElementChild;
  document.body.appendChild(root);placeBeforeFooter(root);return root;
}
function buildSidebar(pol){
  var body=pol.querySelector('.pol-body'); if(!body)return null;
  var toc=pol.querySelector('.pol-toc'); if(toc&&toc.parentNode)toc.parentNode.removeChild(toc);
  var hs=[].slice.call(body.querySelectorAll('h2')); if(!hs.length)return null;
  for(var i=0;i<hs.length;i++){ if(!hs[i].id)hs[i].id=slug(hs[i].textContent); }
  var selfNum=false;
  for(var j=0;j<hs.length;j++){ if(/^\s*\d+[\.\)]\s/.test(hs[j].textContent)){selfNum=true;break;} }
  pol.setAttribute('data-thx-transformed','1');
  if(!selfNum)pol.setAttribute('data-thx-autonum','1');
  var cols=document.createElement('div');cols.className='pol-cols';
  var aside=document.createElement('aside');aside.className='pol-side'+(selfNum?' pol-side-plain':'');
  aside.innerHTML='<nav aria-label="Table of contents"><p class="pol-side-title">Contents</p><ol></ol></nav>';
  body.parentNode.insertBefore(cols,body);
  cols.appendChild(aside);cols.appendChild(body);
  var ol=aside.querySelector('ol'),links=[];
  for(var k=0;k<hs.length;k++){
    var li=document.createElement('li'),a=document.createElement('a');
    a.href='#'+hs[k].id;a.setAttribute('data-toc',hs[k].id);
    a.textContent=(hs[k].textContent||'').trim();
    li.appendChild(a);ol.appendChild(li);links.push(a);
  }
  return {anchors:hs,links:links};
}
function fillPrivacySidebar(root){
  var sideOl=root.querySelector('.pol-side ol');
  var secs=[].slice.call(root.querySelectorAll('.pol-section')),links=[];
  for(var i=0;i<secs.length;i++){
    var h=secs[i].querySelector('h2'); if(!h||!secs[i].id)continue;
    var li=document.createElement('li'),a=document.createElement('a');
    a.href='#'+secs[i].id;a.setAttribute('data-toc',secs[i].id);
    a.textContent=(h.textContent||'').trim();
    li.appendChild(a);sideOl.appendChild(li);links.push(a);
  }
  return {anchors:secs,links:links};
}
function wire(root,anchors,links){
  function setActive(id){for(var j=0;j<links.length;j++){links[j].classList.toggle('active',links[j].getAttribute('data-toc')===id);}}
  root.addEventListener('click',function(e){
    var a=e.target.closest?e.target.closest('a[data-toc]'):null; if(!a)return;
    var id=a.getAttribute('data-toc'),sec=document.getElementById(id); if(!sec)return;
    e.preventDefault();e.stopPropagation();
    var y=Math.max(0,window.pageYOffset+sec.getBoundingClientRect().top-NAV);
    window.scrollTo(0,y);
    setActive(id);
    if(history.replaceState)history.replaceState(null,'',location.pathname+'#'+id);
  },true);
  var ticking=false;
  function spy(){
    ticking=false;
    var cur=anchors[0],limit=NAV+14;
    for(var i=0;i<anchors.length;i++){if(anchors[i].getBoundingClientRect().top<=limit)cur=anchors[i];else break;}
    var id=cur&&cur.id;
    for(var j=0;j<links.length;j++){links[j].classList.toggle('active',links[j].getAttribute('data-toc')===id);}
    var act=root.querySelector('.pol-side a.active'),side=root.querySelector('.pol-side');
    if(act&&side&&side.scrollHeight>side.clientHeight+2){var ot=act.offsetTop,oh=act.offsetHeight;
      if(ot<side.scrollTop)side.scrollTop=Math.max(0,ot-8);
      else if(ot+oh>side.scrollTop+side.clientHeight)side.scrollTop=ot+oh-side.clientHeight+8;}
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(spy);}}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  spy();
  if(location.hash){var el=document.getElementById(location.hash.slice(1));
    if(el){setTimeout(function(){window.scrollTo(0,Math.max(0,window.pageYOffset+el.getBoundingClientRect().top-NAV));spy();},80);}}
}
var st=document.createElement('style');st.id='thx-pol-style';st.textContent=CSS;document.body.appendChild(st);
var built=null,root=null;
if(IS_PRIVACY){
  removeOtherPols();
  root=injectRoot(PRIV_HTML);
  built=fillPrivacySidebar(root);
}else if(IS_TERMS&&!document.querySelector('.thx-pol')){
  root=injectRoot(TERMS_HTML);
  built=buildSidebar(root);
}else{
  root=document.querySelector('.thx-pol');
  if(root){
    var ex=document.querySelectorAll('.thx-pol');
    for(var x=1;x<ex.length;x++){var w=(ex[x].closest&&ex[x].closest('.w-embed'))||ex[x];if(w.parentNode)w.parentNode.removeChild(w);}
    built=buildSidebar(root);
  }
}
if(root&&built)wire(root,built.anchors,built.links);
})();
