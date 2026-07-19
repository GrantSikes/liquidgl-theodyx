/* nv2navorder.js — nav-layer glue, relocated during the footer nativization.
 * 1) Keeps the language selector last in the liquid-nav menu (from nv2footd).
 * 2) Re-syncs liquidGL lens metrics on viewport changes (from theodyx-footer.js).
 * No footer logic lives here. */
(function(){
  "use strict";
  if (window.__thxNavOrder) return; window.__thxNavOrder = true;
  // Move the language selector to the END of the nav (after "Scouting").
  function fixNavOrder(){
    var ul=document.querySelector('ul.tdx-menu'); var lang=document.getElementById('thx-langsel');
    if(ul&&lang&&ul.lastElementChild!==lang){ ul.appendChild(lang); }
  }
  function boot(){ fixNavOrder(); var n=0,iv=setInterval(function(){ fixNavOrder(); if(++n>16) clearInterval(iv); },500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();

  var lqRaf = false;
  function lqR() {
    if (lqRaf) return; lqRaf = true;
    requestAnimationFrame(function () {
      lqRaf = false; var r = window.__liquidGLRenderer__; if (!r || !r.lenses) return;
      for (var i = 0; i < r.lenses.length; i++) { try { r.lenses[i].updateMetrics && r.lenses[i].updateMetrics(); } catch (e) {} }
      try { r.render && r.render(); } catch (e) {}
    });
  }
  var lqB = false;
  function lqBind() {
    if (lqB || !window.__liquidGLRenderer__) return; lqB = true;
    window.addEventListener('resize', lqR, { passive: true });
    if (window.visualViewport) {
      visualViewport.addEventListener('resize', lqR, { passive: true });
      visualViewport.addEventListener('scroll', lqR, { passive: true });
    }
  }
  var lqt = setInterval(function () { lqBind(); if (lqB) clearInterval(lqt); }, 500);
  setTimeout(function () { clearInterval(lqt); }, 20000);
})();
