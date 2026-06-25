(function(){
  function L(u){var s=document.createElement('script');s.src=u;s.async=true;(document.body||document.documentElement).appendChild(s);}
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@52f072b3d3d750cb19909bd09498cbca9b1fb496/theodyx-footer.js');
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@0c9e2a358efb3e7f05006534d3cf47cb88d2b484/theodyx-mosaic.js');
  // Footer legal links (Privacy / Terms / Cookies) get pointed at /resources/company-pages/terms-conditions
  // by nv2pagesf — which 404s. Re-point them at the real legal hub, by their footer label text.
  var HUB='https://www.theodyx.com/resources/legal/legal';
  function fixLegal(){
    var as=document.querySelectorAll('a'),i,a,t,h,nu;
    for(i=0;i<as.length;i++){
      a=as[i]; t=(a.textContent||'').trim().toLowerCase();
      if(t==='terms'||t==='terms & conditions'||t==='terms and conditions') nu='#terms-and-conditions';
      else if(t==='privacy'||t==='privacy policy') nu='#privacy-policy';
      else if(t==='cookies'||t==='cookie'||t==='cookie policy') nu='#cookie-policy';
      else continue;
      h=a.getAttribute('href')||'';
      if(h.charAt(0)==='#') continue; // leave in-page hub anchors (the legal page's own links) alone
      var full=HUB+nu; if(h!==full) a.href=full;
    }
  }
  function boot(){ fixLegal(); var n=0,iv=setInterval(function(){ fixLegal(); if(++n>16) clearInterval(iv); },500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
