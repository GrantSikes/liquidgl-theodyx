(function(){
  function L(u){var s=document.createElement('script');s.src=u;s.async=true;(document.body||document.documentElement).appendChild(s);}
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@936014a505cc0cb7df20d216bc2e8a12e28e116a/theodyx-footer.js');
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@0c9e2a358efb3e7f05006534d3cf47cb88d2b484/theodyx-mosaic.js');
  var HUB='https://www.theodyx.com/resources/legal/legal';
  function fixLinks(){
    var as=document.querySelectorAll('a'),i,a,t,h,nu;
    for(i=0;i<as.length;i++){
      a=as[i]; t=(a.textContent||'').trim().toLowerCase(); h=a.getAttribute('href')||'';
      // Scouting -> /scouting (was the old standalone app)
      if(t==='scouting'||t==='our scouting'||t==='get scouted'||h.indexOf('get-scouted.theodyx.com')>=0){ if(h!=='/scouting') a.href='/scouting'; continue; }
      if(h.charAt(0)==='#') continue; // leave in-page hub anchors alone
      nu=null;
      if(t==='terms'||t==='terms & conditions'||t==='terms and conditions') nu='#terms-and-conditions';
      else if(t==='privacy'||t==='privacy policy') nu='#privacy-policy';
      else if(t==='cookies'||t==='cookie'||t==='cookie policy') nu='#cookie-policy';
      else if(t==='accessibility') nu='#accessibility';
      else if(t==='legal') nu='#terms-and-conditions';
      if(nu){ var full=HUB+nu; if(h!==full) a.href=full; }
    }
  }
  // Move the language selector to the END of the nav (after "Scouting").
  function fixNavOrder(){
    var ul=document.querySelector('ul.tdx-menu'); var lang=document.getElementById('thx-langsel');
    if(ul&&lang&&ul.lastElementChild!==lang){ ul.appendChild(lang); }
  }
  function tick(){ fixLinks(); fixNavOrder(); }
  function boot(){ tick(); var n=0,iv=setInterval(function(){ tick(); if(++n>16) clearInterval(iv); },500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
