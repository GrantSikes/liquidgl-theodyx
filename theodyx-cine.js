/* Theodyx Cine — homepage cinematic modules. Each CFG flag is independently removable. v1.0.0 */
(function(){
if(location.pathname!=='/'&&location.pathname!=='')return;
if(window.__thxCineInit)return;window.__thxCineInit=1;

var CFG={
  eagerImages:true,   // force homepage images to load immediately (mobile reliability)
  heroCinema:true,    // video scales into a framed card as you scroll (research.google-style)
  soundToggle:true,   // minimal Sound pill on the hero video
  autoSound:true,     // try unmuted autoplay; else unmute on first user gesture
  reveals:true,       // headings + cards rise in as you scroll
  parallax:true       // subtle drift on section imagery
};

var reduced=false;
try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}

function init(){
  var g=window.gsap, ST=(g&&g.core&&g.core.globals&&g.core.globals().ScrollTrigger)||window.ScrollTrigger;

  /* ---- eagerImages ---- */
  if(CFG.eagerImages){
    try{[].slice.call(document.images).forEach(function(im){if(im.loading==='lazy')im.loading='eager';});}catch(e){}
  }

  var video=document.querySelector('.hero-media video, video.hero-video');
  if(video){try{video.muted=true;video.play().catch(function(){});}catch(e){}}

  /* ---- soundToggle + autoSound ---- */
  if(CFG.soundToggle&&video){
    try{
      var wrap=video.closest('.hero-media')||video.parentElement;
      if(getComputedStyle(wrap).position==='static')wrap.style.position='relative';
      var ICON_ON='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
      var ICON_OFF='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
      var b=document.createElement('button');
      b.setAttribute('aria-label','Toggle sound');
      b.style.cssText='position:absolute;right:18px;bottom:18px;z-index:6;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;border:1px solid rgba(250,248,242,.35);background:rgba(8,8,9,.45);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#faf8f2;font:600 12.5px/1 inherit;letter-spacing:.04em;cursor:pointer;transition:border-color .2s,background .2s';
      function paint(){b.innerHTML=(video.muted?ICON_OFF:ICON_ON)+'<span>'+(video.muted?'Sound':'Sound on')+'</span>';}
      paint();
      b.addEventListener('mouseenter',function(){b.style.borderColor='rgba(250,248,242,.7)';});
      b.addEventListener('mouseleave',function(){b.style.borderColor='rgba(250,248,242,.35)';});
      var userMuted=false;
      b.addEventListener('click',function(e){
        e.stopPropagation();
        video.muted=!video.muted;
        userMuted=video.muted;
        if(!video.muted)video.play().catch(function(){});
        paint();
      });
      wrap.appendChild(b);
      if(CFG.autoSound&&!reduced){
        video.muted=false;
        var p=video.play();
        if(p&&p.catch)p.catch(function(){
          video.muted=true;paint();video.play().catch(function(){});
          var arm=function(){
            document.removeEventListener('pointerdown',arm,true);
            document.removeEventListener('keydown',arm,true);
            if(userMuted)return;
            video.muted=false;video.play().catch(function(){});paint();
          };
          document.addEventListener('pointerdown',arm,true);
          document.addEventListener('keydown',arm,true);
        });
        setTimeout(paint,300);
      }
    }catch(e){}
  }

  if(!g||!ST||reduced)return;
  try{g.registerPlugin(ST);}catch(e){}

  /* ---- heroCinema ---- */
  if(CFG.heroCinema){
    try{
      var media=document.querySelector('.hero-media');
      if(media){
        media.style.overflow='hidden';
        media.style.willChange='transform';
        g.to(media,{
          scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 35%',scrub:0.5},
          scale:0.93,yPercent:3,borderRadius:'28px',ease:'none'
        });
        g.to(video||media,{
          scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 20%',scrub:0.5},
          filter:'brightness(0.72)',ease:'none'
        });
      }
    }catch(e){}
  }

  /* ---- reveals ---- */
  if(CFG.reveals){
    try{
      var SEL='.banner-sec h1,.banner-sec h2,.banner-sec h3,.fx-hero h2,.fx-hero h3,.fx-split h2,.fx-stp,.fx-h3,.lynx-heading,.lynx-paragraph,.fx-bp';
      var els=[].slice.call(document.querySelectorAll(SEL)).filter(function(el){
        return !(el.closest&&(el.closest('.site-navbar')||el.closest('footer')||el.closest('.footer')));
      });
      els.forEach(function(el,i){
        g.set(el,{opacity:0,y:26});
        g.to(el,{opacity:1,y:0,duration:0.9,ease:'power3.out',delay:(i%3)*0.07,
          scrollTrigger:{trigger:el,start:'top 90%',once:true}});
      });
    }catch(e){}
  }

  /* ---- parallax ---- */
  if(CFG.parallax){
    try{
      [].slice.call(document.querySelectorAll('.lynx-image,.image-16,.image-17,.image-18')).forEach(function(im){
        var host=im.parentElement;if(!host)return;
        g.fromTo(im,{yPercent:-4},{yPercent:4,ease:'none',
          scrollTrigger:{trigger:host,start:'top bottom',end:'bottom top',scrub:0.8}});
      });
    }catch(e){}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
