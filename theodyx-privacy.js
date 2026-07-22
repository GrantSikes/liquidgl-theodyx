(function(){
if(document.getElementById("thx-pol-root"))return;
/* Remove any pre-existing native policy embed (raw HtmlEmbed) so only this version renders */
try{var _ex=document.querySelectorAll(".thx-pol");for(var _i=0;_i<_ex.length;_i++){var _el=_ex[_i];if(_el.id==="thx-pol-root")continue;var _w=(_el.closest&&_el.closest(".w-embed"))||_el.parentElement||_el;if(_w&&_w.parentNode)_w.parentNode.removeChild(_w);else if(_el.parentNode)_el.parentNode.removeChild(_el);}}catch(e){}
var CSS=`.thx-pol{--ink:#0b0b0c;--ink-60:rgba(11,11,12,.60);--ink-44:rgba(11,11,12,.46);--rule:rgba(11,11,12,.12);--rule-4:rgba(11,11,12,.06);--panel:#f7f6f3;--measure:680px;
  background:#fff;color:var(--ink)!important;font-size:17px;line-height:1.7;
  font-family:"Google Sans Flex","Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  min-height:100vh;position:relative;z-index:1}
.thx-pol *{box-sizing:border-box}
.thx-pol a{color:inherit}
.thx-pol .pol-wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.thx-pol .pol-head{padding:132px 0 26px}
.thx-pol .pol-h1{font-size:clamp(34px,5vw,56px);line-height:1.04;font-weight:560;letter-spacing:-.02em;margin:0 0 16px;color:var(--ink)!important;text-wrap:balance;max-width:18ch}
.thx-pol .pol-meta{font-size:14px;color:var(--ink-44)!important;margin:0}
.thx-pol .pol-cols{display:grid;grid-template-columns:236px minmax(0,var(--measure));gap:76px;justify-content:center;align-items:start}
.thx-pol .pol-side{position:sticky;top:104px;align-self:start;max-height:calc(100vh - 132px);overflow-y:auto;overflow-x:hidden;padding-bottom:20px}
.thx-pol .pol-side-title{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-44)!important;margin:0 0 14px;font-weight:600}
.thx-pol .pol-side ol{list-style:none;margin:0;padding:0;counter-reset:t}
.thx-pol .pol-side li{counter-increment:t;margin:0}
.thx-pol .pol-side a{display:flex;gap:9px;padding:7px 0 7px 14px;font-size:14px;line-height:1.35;color:var(--ink-60)!important;text-decoration:none;border-left:2px solid transparent;transition:color .15s ease,border-color .15s ease}
.thx-pol .pol-side a::before{content:counter(t) ".";color:var(--ink-44);flex:none;min-width:15px}
.thx-pol .pol-side a:hover{color:var(--ink)!important}
.thx-pol .pol-side a.active{color:var(--ink)!important;border-left-color:var(--ink);font-weight:560}
.thx-pol .pol-side a.active::before{color:var(--ink)}
.thx-pol .pol-body{max-width:var(--measure);min-width:0;padding-bottom:120px;counter-reset:sec}
.thx-pol .pol-section{padding:30px 0 4px;border-top:1px solid var(--rule-4);counter-increment:sec}
.thx-pol .pol-section:first-child{border-top:0;padding-top:4px}
.thx-pol .pol-section h2{font-size:clamp(22px,2.6vw,28px);line-height:1.22;font-weight:560;letter-spacing:-.01em;margin:0 0 16px;color:var(--ink)!important;scroll-margin-top:112px}
.thx-pol .pol-section h2::before{content:counter(sec) ". ";color:var(--ink-44);font-weight:500}
.thx-pol .pol-body h3{font-size:18px;font-weight:600;margin:28px 0 8px;color:var(--ink)!important}
.thx-pol .pol-body p{margin:0 0 18px;color:var(--ink)!important}
.thx-pol .pol-body ul{margin:0 0 18px;padding-left:20px;list-style:none}
.thx-pol .pol-body ul>li{position:relative;margin:0 0 10px;padding-left:20px;color:var(--ink)!important}
.thx-pol .pol-body ul>li::before{content:"";position:absolute;left:2px;top:.72em;width:6px;height:6px;border-radius:50%;background:var(--ink-44)}
.thx-pol .pol-body a{color:var(--ink)!important;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--rule)}
.thx-pol .pol-body a:hover{color:var(--ink-60)!important;text-decoration-color:currentColor}
.thx-pol .pol-body strong{font-weight:600;color:var(--ink)!important}
.thx-pol .pol-body code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.88em;background:var(--rule-4);padding:1px 6px;border-radius:5px}
.thx-pol ::selection{background:var(--ink);color:#fff}
.thx-pol .pol-mtoc{display:none}
@media(max-width:980px){
  .thx-pol .pol-cols{grid-template-columns:minmax(0,1fr);gap:0}
  .thx-pol .pol-side{display:none}
  .thx-pol .pol-mtoc{display:block;position:sticky;top:74px;z-index:30;background:#fff;border:1px solid var(--rule);border-radius:12px;margin:0 0 26px}
  .thx-pol .pol-mtoc-btn{display:flex;align-items:center;gap:10px;width:100%;background:none;border:0;padding:15px 16px;font-size:14px;font-weight:560;color:var(--ink)!important;cursor:pointer}
  .thx-pol .pol-mtoc .chev{width:14px;height:14px;margin-left:auto;flex:none;transition:transform .2s ease}
  .thx-pol .pol-mtoc.open .chev{transform:rotate(180deg)}
  .thx-pol .pol-mtoc-panel{max-height:0;overflow:hidden;transition:max-height .3s ease}
  .thx-pol .pol-mtoc.open .pol-mtoc-panel{max-height:68vh;overflow:auto}
  .thx-pol .pol-mtoc ol{list-style:none;margin:0;padding:2px 0 12px;counter-reset:m}
  .thx-pol .pol-mtoc li{counter-increment:m}
  .thx-pol .pol-mtoc a{display:block;padding:9px 18px;font-size:15px;color:var(--ink-60)!important;text-decoration:none;border-left:2px solid transparent}
  .thx-pol .pol-mtoc a::before{content:counter(m) ". ";color:var(--ink-44)}
  .thx-pol .pol-mtoc a.active{color:var(--ink)!important;border-left-color:var(--ink);font-weight:560}
}
@media(max-width:767px){.thx-pol .pol-head{padding:108px 0 20px}.thx-pol .pol-h1{font-size:clamp(30px,8vw,40px)}.thx-pol .pol-body{padding-bottom:90px}}`;
var HTML=`<div id="thx-pol-root" class="thx-pol">
  <div class="pol-wrap">
    <header class="pol-head">
      <h1 class="pol-h1">Privacy Policy</h1>
      <p class="pol-meta">Effective June 26, 2026</p>
    </header>
    <div class="pol-mtoc">
      <button class="pol-mtoc-btn" aria-expanded="false"><span>Table of contents</span><svg class="chev" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="pol-mtoc-panel"><ol></ol></div>
    </div>
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
var st=document.createElement("style");st.id="thx-pol-style";st.textContent=CSS;document.head.appendChild(st);
var w=document.createElement("div");w.innerHTML=HTML;var _root=w.firstElementChild;document.body.appendChild(_root);
var root=document.getElementById('thx-pol-root');
  if(!root||root.dataset.polInit)return; root.dataset.polInit='1';
  var footer=document.querySelector('footer,.footer');
  if(footer&&footer.parentNode&&footer.compareDocumentPosition(root)&Node.DOCUMENT_POSITION_FOLLOWING){footer.parentNode.insertBefore(root,footer);}
  var body=root.querySelector('.pol-body'),
      sideOl=root.querySelector('.pol-side ol'),
      mOl=root.querySelector('.pol-mtoc ol'),
      secs=[].slice.call(body.querySelectorAll('.pol-section')),
      links=[];
  secs.forEach(function(sec){
    var h=sec.querySelector('h2'); if(!h||!sec.id)return;
    var title=(h.textContent||'').trim();
    function mk(){var li=document.createElement('li'),a=document.createElement('a');a.href='#'+sec.id;a.textContent=title;a.setAttribute('data-toc',sec.id);li.appendChild(a);return a;}
    if(sideOl){var li1=document.createElement('li');var a1=mk();li1.appendChild(a1);sideOl.appendChild(li1);links.push(a1);}
    if(mOl){var li2=document.createElement('li');var a2=mk();li2.appendChild(a2);mOl.appendChild(li2);links.push(a2);}
  });
  var NAV=112;
  root.addEventListener('click',function(e){
    var a=e.target.closest?e.target.closest('a[data-toc]'):null; if(!a)return;
    var id=a.getAttribute('data-toc'),sec=document.getElementById(id); if(!sec)return;
    e.preventDefault();
    var y=Math.max(0,window.pageYOffset+sec.getBoundingClientRect().top-NAV);
    window.scrollTo(0,y);
    if(history.replaceState)history.replaceState(null,'',location.pathname+'#'+id);
    var m=root.querySelector('.pol-mtoc'); if(m)m.classList.remove('open');
    requestAnimationFrame(spy);
  });
  var mbtn=root.querySelector('.pol-mtoc-btn'),mtoc=root.querySelector('.pol-mtoc');
  if(mbtn&&mtoc)mbtn.addEventListener('click',function(){var o=mtoc.classList.toggle('open');mbtn.setAttribute('aria-expanded',o?'true':'false');});
  var ticking=false;
  function spy(){
    ticking=false;
    var cur=secs[0],limit=NAV+14;
    for(var i=0;i<secs.length;i++){if(secs[i].getBoundingClientRect().top<=limit)cur=secs[i];else break;}
    var id=cur&&cur.id;
    for(var j=0;j<links.length;j++){links[j].classList.toggle('active',links[j].getAttribute('data-toc')===id);}
    var act=root.querySelector('.pol-side a.active'),side=root.querySelector('.pol-side');
    if(act&&side&&side.scrollHeight>side.clientHeight+2){var ot=act.offsetTop,oh=act.offsetHeight;if(ot<side.scrollTop)side.scrollTop=Math.max(0,ot-8);else if(ot+oh>side.scrollTop+side.clientHeight)side.scrollTop=ot+oh-side.clientHeight+8;}
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(spy);}}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  spy();
  if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el){setTimeout(function(){window.scrollTo(0,Math.max(0,window.pageYOffset+el.getBoundingClientRect().top-NAV));spy();},80);}}
})();
