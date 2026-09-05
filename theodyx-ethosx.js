/*! theodyx-ethosx v1.1.0 - re-hosted from Webflow on 2026-09-05; source of truth is now this repo.
   Phase 11 motion: INV-03/ACT-08 the 5 s setInterval carousel autoplay and the wheel/touch/
   pointer pause plumbing that existed only to stop it are gone, together with the glide()
   they drove - arrows, dots, swipe and keyboard still move the carousel. RM-03 the rail-nav
   jump reads prefers-reduced-motion live. ACT-03 the rail links answer hover and press with
   transform + ink on the spring curve. Phase 9 rail accessibility below is unchanged. */
(function(){function q(s,r){return [].slice.call((r||document).querySelectorAll(s))}var RED=function(){return matchMedia('(prefers-reduced-motion: reduce)').matches};if(matchMedia('(min-width:1220px)').matches){var hs=q('.ethx-prose h2');if(hs.length<2)hs=q('.thx-read-body h2');if(hs.length<2)hs=q('.thx-read-body h3');if(hs.length<2)hs=q('.thx-read-body h4');hs=hs.filter(function(h){return h.textContent.trim()});if(hs.length>1){var nav=document.createElement('nav');nav.className='ethx-railnav';nav.setAttribute('aria-label','Sections');hs.forEach(function(h,i){if(!h.id)h.id='ethx-s'+i;var a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;a.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:h.getBoundingClientRect().top+pageYOffset-96,behavior:RED()?'auto':'smooth'})});nav.appendChild(a)});document.body.appendChild(nav);var mark=function(id){q('a',nav).forEach(function(a){var m=a.getAttribute('href')==='#'+id;a.classList.toggle('on',m);if(m)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})};var io=new IntersectionObserver(function(x){x.forEach(function(o){if(o.isIntersecting)mark(o.target.id)})},{rootMargin:'-15% 0px -65% 0px'});hs.forEach(function(h){io.observe(h)});var hero=document.querySelector('.ethx-hero');var hh=hero?hero.getBoundingClientRect().height:600;var qd=false;function chk(){nav.classList.toggle('ethx-railon',pageYOffset>hh*0.7)}addEventListener('scroll',function(){if(qd)return;qd=true;requestAnimationFrame(function(){qd=false;chk()})},{passive:true});chk();railA11y(nav)}}

/* ---------- Phase 9 accessibility pass for the section rail ----------
   C-02  the rail ink was rgba(0,0,0,.42) = 2.72:1 on white and 1.00:1 over the
         black footer. Raise it to rgba(0,0,0,.56) = 4.94:1 on white and drop the
         rail entirely once footer.footer scrolls into the band it occupies.
   KB-09 / SEM-04  the rail was appended to <body>, so it was painted top-left but
         came last in the tab order, after the footer. Move the node instead of
         reaching for a positive tabindex, and mirror the TOC's aria-current.
   Hidden states use visibility, not opacity alone, so an invisible rail is not a
   keyboard tab stop. */
function railA11y(nav){try{
  if(!document.getElementById('thx-rail-a11y-css')){
    var st=document.createElement('style');st.id='thx-rail-a11y-css';
    st.textContent='html body nav.ethx-railnav a{color:rgba(0,0,0,.56)!important}'
      +'html body nav.ethx-railnav{visibility:hidden}'
      +'html body nav.ethx-railnav.ethx-railon{visibility:visible}'
      +'html body nav.ethx-railnav.ethx-railfoot,html body nav.ethx-railnav.xp-railoff{opacity:0!important;visibility:hidden!important;pointer-events:none!important}'
      +'html body nav.ethx-railnav a:focus-visible{outline:2px solid #000;outline-offset:3px}'
      /* ACT-03: the rail answers hover and press with transform+ink, not colour alone. */
      +'html body nav.ethx-railnav a{display:block;transition:transform .24s cubic-bezier(.22,1,.36,1),opacity .24s cubic-bezier(.22,1,.36,1),color .24s cubic-bezier(.22,1,.36,1)}'
      +'html body nav.ethx-railnav a:hover{transform:translateX(3px);color:#000!important}'
      +'html body nav.ethx-railnav a:active{transform:translateX(3px) scale(.97);opacity:.72}'
      +'@media (forced-colors:active){html body nav.ethx-railnav a{forced-color-adjust:none;color:CanvasText!important;border-left-color:Canvas}html body nav.ethx-railnav a:hover,html body nav.ethx-railnav a.on,html body nav.ethx-railnav a[aria-current]{color:Highlight!important;border-left-color:Highlight}}'
      +'@media (prefers-reduced-motion:reduce){html body nav.ethx-railnav a{transition:none}html body nav.ethx-railnav a:hover,html body nav.ethx-railnav a:active{transform:none}}';
    (document.body||document.documentElement).appendChild(st);
  }
  var skip=document.querySelector('a.thx-skip');
  if(skip&&skip.parentNode)skip.parentNode.insertBefore(nav,skip.nextSibling);
  else{var mn=document.getElementById('thx-main')||document.querySelector('main');
       if(mn&&mn.parentNode)mn.parentNode.insertBefore(nav,mn)}
  var foot=document.querySelector('footer.footer')||document.querySelector('footer');
  if(foot&&window.IntersectionObserver){
    var fio=null;
    var wire=function(){
      if(fio){fio.disconnect();fio=null}
      var r=nav.getBoundingClientRect();if(!r.height)return;
      var t=Math.max(0,Math.round(r.top)),b=Math.max(0,Math.round(innerHeight-r.bottom));
      fio=new IntersectionObserver(function(x){x.forEach(function(o){
        nav.classList.toggle('ethx-railfoot',o.isIntersecting)})},
        {rootMargin:(-t)+'px 0px '+(-b)+'px 0px',threshold:0});
      fio.observe(foot);
    };
    wire();
    var rt=null;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(wire,200)},{passive:true});
  }
}catch(e){}}
/*thx-ethosx-1.1.0-p11motion*/})();
