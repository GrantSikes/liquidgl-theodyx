(function(){
  function L(u){var s=document.createElement('script');s.src=u;s.async=true;(document.body||document.documentElement).appendChild(s);}

  /* ---- capability gate: skip the heaviest WebGL on constrained devices ---- */
  var nc=navigator.connection||{};
  window.__thxLite = nc.saveData===true
    || /(^|-)2g$/.test(nc.effectiveType||'')
    || (typeof navigator.deviceMemory==='number' && navigator.deviceMemory<=4)
    || (typeof navigator.hardwareConcurrency==='number' && navigator.hardwareConcurrency<=4);
  var reduce=false; try{ reduce=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

  /* footer wordmark always (it has a static gradient fallback); mosaic only when affordable + motion-ok */
  L('https://cdn.theodyx.com/v1/theodyx-footer.min.js');
  if(!window.__thxLite && !reduce){ L('https://cdn.theodyx.com/v1/theodyx-mosaic.min.js'); }

  /* ---- reduced-motion backstop for hero video / mosaic (vestibular safety) ---- */
  if(reduce){
    var rm=document.createElement('style');
    rm.textContent='@media (prefers-reduced-motion: reduce){.fx-hero video,.theodyx-mosaic canvas{animation:none!important}.fx-hero video{display:none!important}}';
    (document.head||document.documentElement).appendChild(rm);
  }

  /* ---- canonical: every TLD points at www.theodyx.com (kills duplicate content) ---- */
  function fixCanonical(){
    try{
      var p=location.pathname.replace(/\/+$/,''); if(!p) p='/';
      var href='https://www.theodyx.com'+p;
      var l=document.querySelector('link[rel="canonical"]');
      if(!l){ l=document.createElement('link'); l.setAttribute('rel','canonical'); (document.head||document.documentElement).appendChild(l); }
      if(l.getAttribute('href')!==href) l.setAttribute('href',href);
    }catch(e){}
  }

  /* ---- a11y: skip link + html lang ---- */
  function addSkip(){
    if(document.getElementById('thx-skip')) return;
    var main=document.querySelector('main')||document.querySelector('.main-wrapper')||document.body;
    if(main&&!main.id) main.id='thx-main';
    var a=document.createElement('a'); a.id='thx-skip'; a.href='#'+main.id; a.textContent='Skip to content';
    a.setAttribute('style','position:absolute;left:-9999px;top:8px;z-index:99999;background:#0E0E0F;color:#F2F1EC;padding:10px 16px;border-radius:8px;font:600 13px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;');
    a.addEventListener('focus',function(){a.style.left='12px';});
    a.addEventListener('blur',function(){a.style.left='-9999px';});
    document.body.insertBefore(a,document.body.firstChild);
  }

  /* ---- cookieless site-wide journey tracking (per-tab sessionStorage; no cookie; PII-free) ---- */
  var EP='https://theodyx-scouting-api.theodyx.workers.dev/event', SS='thx_sid_v1', fired={};
  function sid(){try{var s=sessionStorage.getItem(SS);if(!s){s=(window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Math.random()).slice(2)+Date.now());sessionStorage.setItem(SS,s);}return s;}catch(e){return 'nostore';}}
  function utm(){var o={};try{var q=new URLSearchParams(location.search);['source','medium','campaign','content','term'].forEach(function(k){var v=q.get('utm_'+k);if(v)o['utm_'+k]=v.slice(0,64);});}catch(e){}return o;}
  var refHost='';try{refHost=document.referrer?new URL(document.referrer).hostname:'';}catch(e){}
  function track(ev,step,once){
    if(once){if(fired[ev])return;fired[ev]=1;}
    try{
      var b=Object.assign({event:ev,step:step||null,session:sid(),path:location.pathname,ref_host:refHost,device:(window.matchMedia&&matchMedia('(max-width:767px)').matches)?'mobile':'desktop'},utm());
      var blob=new Blob([JSON.stringify(b)],{type:'text/plain'});
      if(navigator.sendBeacon){navigator.sendBeacon(EP,blob);}else{fetch(EP,{method:'POST',body:blob,keepalive:true,headers:{'Content-Type':'text/plain'}});}
    }catch(e){}
  }
  window.__thxTrack=track;
  track('landing_view',null,true);
  var hit={};
  function onScroll(){
    var h=document.documentElement,sc=h.scrollTop||document.body.scrollTop||0,mx=(h.scrollHeight-h.clientHeight)||1,pct=Math.min(100,Math.round(sc/mx*100));
    [25,50,75,100].forEach(function(m){ if(pct>=m&&!hit[m]){ hit[m]=1; track('scroll_depth',String(m)); } });
  }
  var qd=false;
  addEventListener('scroll',function(){ if(qd)return; qd=true; (window.requestAnimationFrame||function(f){setTimeout(f,100);})(function(){ qd=false; onScroll(); }); },{passive:true});

  /* ---- existing link + nav normalisation (unchanged behaviour) ---- */
  var HUB='https://www.theodyx.com/resources/legal/legal';
  function fixLinks(){
    var as=document.querySelectorAll('a'),i,a,t,h,nu;
    for(i=0;i<as.length;i++){
      a=as[i]; t=(a.textContent||'').trim().toLowerCase(); h=a.getAttribute('href')||'';
      if(t==='scouting'||t==='our scouting'||t==='get scouted'||h.indexOf('get-scouted.theodyx.com')>=0){ if(h!=='/scouting') a.href='/scouting'; continue; }
      if(h.charAt(0)==='#') continue;
      nu=null;
      if(t==='terms'||t==='terms & conditions'||t==='terms and conditions') nu='#terms-and-conditions';
      else if(t==='privacy'||t==='privacy policy') nu='#privacy-policy';
      else if(t==='cookies'||t==='cookie'||t==='cookie policy') nu='#cookie-policy';
      else if(t==='accessibility') nu='#accessibility';
      else if(t==='legal') nu='#terms-and-conditions';
      if(nu){ var full=HUB+nu; if(h!==full) a.href=full; }
    }
  }
  function fixNavOrder(){
    var ul=document.querySelector('ul.tdx-menu'); var lang=document.getElementById('thx-langsel');
    if(ul&&lang&&ul.lastElementChild!==lang){ ul.appendChild(lang); }
  }
  function tick(){ fixLinks(); fixNavOrder(); fixCanonical(); }
  function boot(){ addSkip(); if(!document.documentElement.lang) document.documentElement.lang='en'; tick(); var n=0,iv=setInterval(function(){ tick(); if(++n>16) clearInterval(iv); },500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
