/* Theodyx Cookie Preferences — banner + settings modal, GPC-aware. v1.3.0 (focus management: focus-in, trap, inert background, restore) */
(function(){
if(window.__thxCookiesInit)return;window.__thxCookiesInit=1;
var KEY='thx_consent';
var GPC=(navigator.globalPrivacyControl===true);
function read(){try{var v=JSON.parse(localStorage.getItem(KEY));if(v&&v.v===1)return v;}catch(e){}return null;}
function write(c){c.v=1;c.ts=Date.now();c.necessary=true;try{localStorage.setItem(KEY,JSON.stringify(c));}catch(e){}
  window.__thxConsent=c;window.__thxAnalyticsOptOut=!c.analytics;
  try{document.dispatchEvent(new CustomEvent('thx-consent-change',{detail:c}));}catch(e){}}
var stored=read();
if(stored){window.__thxConsent=stored;window.__thxAnalyticsOptOut=!stored.analytics;}
else{window.__thxAnalyticsOptOut=GPC;}

var CSS=''+
'.thxck-banner{position:fixed;left:18px;bottom:18px;z-index:9990;max-width:380px;background:#0c0c0d;border:1px solid rgba(250,248,242,.14);border-radius:18px;padding:18px 20px;color:#faf8f2;font-size:13.5px;line-height:1.55;letter-spacing:normal;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif}.thxck-banner *,.thxck-modal *{font-family:inherit;letter-spacing:normal}'+
'.thxck-banner h4{margin:0 0 6px;font-size:15px;font-weight:600;color:#faf8f2}'+
'.thxck-banner p{margin:0 0 14px;color:rgba(250,248,242,.72)}'+
'.thxck-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}'+
'.thxck-btn{cursor:pointer;border-radius:999px;padding:9px 16px;font-size:13px;font-weight:600;border:1px solid rgba(250,248,242,.28);background:transparent;color:#faf8f2;font-family:inherit}'+
'.thxck-btn:hover{border-color:rgba(250,248,242,.6)}'+
'.thxck-btn.thxck-primary{background:#faf8f2;color:#0b0b0c;border-color:#faf8f2}'+
'.thxck-link{cursor:pointer;background:none;border:0;color:rgba(250,248,242,.62);font-size:13px;text-decoration:underline;text-underline-offset:3px;padding:9px 2px;font-family:inherit}'+
'.thxck-link:hover{color:#faf8f2}'+
'.thxck-overlay{position:fixed;inset:0;z-index:9991;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px}'+
'.thxck-modal{width:100%;max-width:540px;max-height:88vh;overflow:auto;background:#0c0c0d;border:1px solid rgba(250,248,242,.14);border-radius:20px;padding:28px 28px 22px;color:#faf8f2;font-size:14.5px;line-height:1.6;letter-spacing:normal;font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif}'+
'.thxck-modal h2{margin:0 0 10px;font-size:20px;font-weight:600;letter-spacing:-.01em;color:#faf8f2}'+
'.thxck-modal .thxck-intro{margin:0 0 20px;color:rgba(250,248,242,.72);font-size:14px}'+
'.thxck-modal .thxck-intro a{color:#faf8f2;text-decoration:underline;text-underline-offset:3px}'+
'.thxck-cat{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid rgba(250,248,242,.1)}'+
'.thxck-cat h3{margin:0 0 4px;font-size:15px;font-weight:600;color:#faf8f2}'+
'.thxck-cat p{margin:0;font-size:13px;color:rgba(250,248,242,.65)}'+
'.thxck-req{flex:none;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(250,248,242,.5);border:1px solid rgba(250,248,242,.2);border-radius:999px;padding:5px 10px;margin-top:2px}'+
'.thxck-sw{flex:none;position:relative;width:46px;height:26px;border-radius:999px;background:rgba(250,248,242,.18);border:0;cursor:pointer;transition:background .2s;margin-top:2px}'+
'.thxck-sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#faf8f2;transition:transform .2s}'+
'.thxck-sw[aria-checked="true"]{background:#3d8f4f}'+
'.thxck-sw[aria-checked="true"]::after{transform:translateX(20px)}'+
'.thxck-foot{margin-top:20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}'+
'.thxck-gpc{margin:16px 0 0;font-size:12px;color:rgba(250,248,242,.5)}'+
'@media(max-width:600px){.thxck-banner{left:12px;right:12px;bottom:12px;max-width:none}.thxck-modal{padding:24px 20px 20px}}';

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
var st=el('style');st.textContent=CSS;document.head.appendChild(st);

var state={analytics: stored?!!stored.analytics:(GPC?false:true), marketing: stored?!!stored.marketing:false};

function modal(){
  if(document.querySelector('.thxck-overlay'))return;
  var ov=el('div','thxck-overlay');
  var m=el('div','thxck-modal');m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Cookie Settings');
  m.appendChild(el('h2',null,'Cookie Settings'));
  m.appendChild(el('p','thxck-intro','Cookies and similar identifiers keep small pieces of information on your device. We keep this to a minimum: no advertising cookies, no cross-site tracking, and analytics that are cookieless by design. Decide below what we may use — your choice is saved on this device and you can change it anytime. <a href="/policies/cookie-policy">Learn more</a>.'));
  function cat(title,desc,key){
    var c=el('div','thxck-cat');
    var t=el('div',null);t.appendChild(el('h3',null,title));t.appendChild(el('p',null,desc));
    c.appendChild(t);
    if(!key){c.appendChild(el('span','thxck-req','Always on'));}
    else{
      var sw=el('button','thxck-sw');sw.setAttribute('role','switch');sw.setAttribute('aria-checked',String(state[key]));sw.setAttribute('aria-label',title);
      sw.addEventListener('click',function(){state[key]=!state[key];sw.setAttribute('aria-checked',String(state[key]));});
      c.appendChild(sw);
    }
    return c;
  }
  m.appendChild(cat('Necessary','Security, bot protection, and the core features of the Site — the basics that keep pages, forms, and applications working. The Site can’t run without these.',null));
  m.appendChild(cat('Analytics','First-party, cookieless measurement of how the Site performs — page views and scroll depth. Never a raw IP address, never cross-site tracking.','analytics'));
  m.appendChild(cat('Marketing','Would allow personalization and measurement of our marketing on other platforms. We don’t use these today — the switch is here so the choice is always yours.','marketing'));
  var foot=el('div','thxck-foot');
  var save=el('button','thxck-btn thxck-primary','Save preferences');
  var all=el('button','thxck-btn','Accept all');
  save.addEventListener('click',function(){write({analytics:state.analytics,marketing:state.marketing});close();});
  all.addEventListener('click',function(){state.analytics=true;state.marketing=true;write({analytics:true,marketing:true});close();});
  foot.appendChild(save);foot.appendChild(all);
  m.appendChild(foot);
  m.appendChild(el('p','thxck-gpc','We honor Global Privacy Control. When your browser sends a GPC signal, analytics and marketing default to off.'+(GPC?' — a GPC signal is active in this browser.':'')));
  ov.appendChild(m);
  var prevFocus=document.activeElement, inerted=[];
  function close(){ov.remove();document.removeEventListener('keydown',esc);inerted.forEach(function(c){c.removeAttribute('inert');});inerted=[];banner(false);try{if(prevFocus&&prevFocus.focus&&document.contains(prevFocus))prevFocus.focus();}catch(e){}}
  m.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=Array.prototype.filter.call(m.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])'),function(x){return x.offsetParent!==null;});if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  function esc(e){if(e.key==='Escape')close();}
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
  document.addEventListener('keydown',esc);
  document.body.appendChild(ov);
  Array.prototype.forEach.call(document.body.children,function(c){if(c!==ov&&!c.hasAttribute('inert')&&!/^(SCRIPT|STYLE|LINK)$/.test(c.tagName)){c.setAttribute('inert','');inerted.push(c);}});
  m.setAttribute('tabindex','-1');var ff=m.querySelector('button');setTimeout(function(){try{(ff||m).focus();}catch(e){}},30);
}
window.__thxOpenCookiePrefs=modal;

var bannerEl=null;
function banner(show){
  if(!show){if(bannerEl){bannerEl.remove();bannerEl=null;}return;}
  if(bannerEl||read())return;
  bannerEl=el('div','thxck-banner');
  bannerEl.appendChild(el('h4',null,'Your privacy, handled properly'));
  bannerEl.appendChild(el('p',null,'We run a privacy-first, largely cookieless site. Choose what we may measure — you can change this anytime.'));
  var row=el('div','thxck-row');
  var all=el('button','thxck-btn thxck-primary','Accept all');
  var nec=el('button','thxck-btn','Necessary only');
  var pref=el('button','thxck-link','Preferences');
  all.addEventListener('click',function(){write({analytics:true,marketing:true});banner(false);});
  nec.addEventListener('click',function(){write({analytics:false,marketing:false});banner(false);});
  pref.addEventListener('click',function(){modal();});
  row.appendChild(all);row.appendChild(nec);row.appendChild(pref);
  bannerEl.appendChild(row);
  document.body.appendChild(bannerEl);
}
if(!stored){
  var shown=false;
  function reveal(){if(shown||read())return;shown=true;banner(true);}
  setTimeout(reveal,120000);
  setTimeout(function(){
    var onDown=function(){document.removeEventListener('pointerdown',onDown,true);setTimeout(reveal,450);};
    document.addEventListener('pointerdown',onDown,true);
  },6000);
}

/* Footer "Cookie Preferences" link — appended into the Terms & Policies column, idempotent */
function footLink(){
  if(document.querySelector('a[data-thx-cookie-prefs]'))return true;
  var anchors=[].slice.call(document.querySelectorAll('footer a, .footer a'));
  var target=null;
  for(var i=0;i<anchors.length;i++){
    var h=anchors[i].getAttribute('href')||'';
    if(h.indexOf('/policies/')===0){target=anchors[i];}
  }
  if(!target)return false;
  var a=document.createElement('a');
  a.href='#cookie-preferences';a.textContent='Cookie Preferences';a.className=target.className;
  a.setAttribute('data-thx-cookie-prefs','1');
  target.parentNode.appendChild(a);
  return true;
}
var tries=0,iv=setInterval(function(){if(footLink()||++tries>25)clearInterval(iv);},400);
document.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('a[href="#cookie-preferences"],a[data-thx-cookie-prefs]'):null;
  if(!a)return;e.preventDefault();modal();
},true);
})();
