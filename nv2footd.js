(function(){
  function L(u){var s=document.createElement('script');s.src=u;s.async=true;(document.body||document.documentElement).appendChild(s);}
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@52f072b3d3d750cb19909bd09498cbca9b1fb496/theodyx-footer.js');
  L('https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@0c9e2a358efb3e7f05006534d3cf47cb88d2b484/theodyx-mosaic.js');
  // Repair site-wide links that other scripts point at the wrong place:
  //  - footer legal links (Privacy/Terms/Cookies) -> the legal hub anchors
  //  - Scouting links (nav + footer) -> the native /scouting page (not the old standalone app)
  var HUB='https://www.theodyx.com/resources/legal/legal';
  function fixLinks(){
    var as=document.querySelectorAll('a'),i,a,t,h;
    for(i=0;i<as.length;i++){
      a=as[i]; t=(a.textContent||'').trim().toLowerCase(); h=a.getAttribute('href')||'';
      // Scouting -> /scouting
      if((t==='scouting'||t==='our scouting'||t==='get scouted')||h.indexOf('get-scouted.theodyx.com')>=0){
        if(h!=='/scouting') a.href='/scouting';
        continue;
      }
      // Footer legal links (skip in-page hub anchors so we never clobber the hub's own links)
      if(h.charAt(0)==='#') continue;
      var nu=null;
      if(t==='terms'||t==='terms & conditions'||t==='terms and conditions') nu='#terms-and-conditions';
      else if(t==='privacy'||t==='privacy policy') nu='#privacy-policy';
      else if(t==='cookies'||t==='cookie'||t==='cookie policy') nu='#cookie-policy';
      if(nu){ var full=HUB+nu; if(h!==full) a.href=full; }
    }
  }
  function boot(){ fixLinks(); var n=0,iv=setInterval(function(){ fixLinks(); if(++n>16) clearInterval(iv); },500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
