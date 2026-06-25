(function(){
  function L(u){var s=document.createElement('script');s.src=u;s.async=true;(document.body||document.documentElement).appendChild(s);}
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@52f072b3d3d750cb19909bd09498cbca9b1fb496/theodyx-footer.js');
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@0c9e2a358efb3e7f05006534d3cf47cb88d2b484/theodyx-mosaic.js');
  // Point the footer legal links (Privacy / Terms / Cookies — were bare '#') at the legal hub.
  var BASE='https://www.theodyx.com/resources/legal/legal';
  function fixLegal(){
    var as=document.querySelectorAll('a'),i,a,t,h;
    for(i=0;i<as.length;i++){
      a=as[i]; h=a.getAttribute('href')||''; if(h.charAt(0)!=='#') continue;
      t=(a.textContent||'').trim().toLowerCase();
      if(t==='terms'||t==='terms & conditions'||t==='terms and conditions'||h==='#terms-and-conditions') a.href=BASE+'#terms-and-conditions';
      else if(t==='privacy'||t==='privacy policy'||h==='#privacy-policy') a.href=BASE+'#privacy-policy';
      else if(t==='cookies'||t==='cookie'||t==='cookie policy'||h==='#cookie-policy') a.href=BASE+'#cookie-policy';
    }
  }
  function boot(){ fixLegal(); var n=0,iv=setInterval(function(){ fixLegal(); if(++n>12) clearInterval(iv); },500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
