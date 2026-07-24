/* Theodyx Cine — homepage cinematic modules. Self-contained (no GSAP dependence). v1.2.0
   Modules are independently removable via CFG. */
(function(){
if(location.pathname!=='/'&&location.pathname!=='')return;
if(window.__thxCineInit)return;window.__thxCineInit=1;

var CFG={
  eagerImages:true,   // force homepage images to load immediately (mobile reliability)
  heroCinema:true,    // video eases into a framed card as you scroll
  soundToggle:true,   // minimal Sound pill on the hero video
  autoSound:true,     // try unmuted autoplay; else unmute on first user gesture
  reveals:true,       // headings + copy rise in as you scroll
  parallax:true       // subtle drift on section imagery (desktop only)
};

var reduced=false;
try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}

function init(){
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
      b.style.cssText='position:absolute;right:18px;bottom:18px;z-index:6;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;border:1px solid rgba(250,248,242,.35);background:rgba(8,8,9,.45);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#faf8f2;font:600 12.5px/1 inherit;letter-spacing:.04em;cursor:pointer;transition:border-color .2s';
      function paint(){b.innerHTML=(video.muted?ICON_OFF:ICON_ON)+'<span>'+(video.muted?'Sound':'Sound on')+'</span>';}
      paint();
      b.addEventListener('mouseenter',function(){b.style.borderColor='rgba(250,248,242,.7)';});
      b.addEventListener('mouseleave',function(){b.style.borderColor='rgba(250,248,242,.35)';});
      var userMuted=false;
      b.addEventListener('click',function(e){
        e.stopPropagation();
        video.muted=!video.muted;userMuted=video.muted;
        if(!video.muted)video.play().catch(function(){});
        paint();
      });
      wrap.appendChild(b);
      if(CFG.autoSound){
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

  if(reduced)return;

  /* ---- heroCinema — plain rAF, no library ---- */
  if(CFG.heroCinema){
    try{
      var hero=document.querySelector('section.hero, .hero');
      var media=document.querySelector('.hero-media');
      if(hero&&media){
        var baseR=parseFloat(getComputedStyle(media).borderRadius)||0;
        media.style.overflow='hidden';
        media.style.willChange='transform';
        var cur=0;
        function target(){
          var span=Math.max(200,hero.offsetHeight*0.8);
          return Math.min(1,Math.max(0,window.pageYOffset/span));
        }
        function paintAt(p){
          var s=1-0.07*p, r=baseR+(28-baseR)*p, br=1-0.26*p, ty=p*2.2;
          media.style.transform='translateY('+ty.toFixed(2)+'%) scale('+s.toFixed(4)+')';
          media.style.borderRadius=r.toFixed(1)+'px';
          if(video)video.style.filter=(br>=0.995)?'':'brightness('+br.toFixed(3)+')';
        }
        function frame(){
          var t=target();
          cur+= (t-cur)*0.14;
          if(Math.abs(t-cur)<0.001)cur=t;
          paintAt(cur);
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        window.addEventListener('scroll',function(){
          if(document.hidden){cur=target();paintAt(cur);}
        },{passive:true});
        paintAt(target());
      }
    }catch(e){}
  }

  /* ---- reveals — IntersectionObserver + CSS transitions, with force-show failsafe ---- */
  if(CFG.reveals&&'IntersectionObserver' in window){
    try{
      var css=document.createElement('style');
      css.textContent='.thx-rv{opacity:0;transform:translateY(26px);transition:opacity .85s cubic-bezier(.22,.61,.36,1),transform .85s cubic-bezier(.22,.61,.36,1)}.thx-rv.thx-rv-in{opacity:1;transform:none}';
      document.head.appendChild(css);
      var SEL='.banner-sec h1,.banner-sec h2,.banner-sec h3,.fx-hero h2,.fx-hero h3,.fx-split h2,.fx-stp,.fx-h3,.lynx-heading,.lynx-paragraph,.fx-bp';
      var vh=window.innerHeight;
      var els=[].slice.call(document.querySelectorAll(SEL)).filter(function(el){
        if(el.closest&&(el.closest('.site-navbar')||el.closest('footer')||el.closest('.footer')))return false;
        var r=el.getBoundingClientRect();
        return r.top>vh*0.92; /* only below the fold — never hide visible content */
      });
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting)return;
          var el=en.target;
          el.style.transitionDelay=((els.indexOf(el)%3)*70)+'ms';
          el.classList.add('thx-rv-in');
          io.unobserve(el);
        });
      },{rootMargin:'0px 0px -6% 0px',threshold:0.05});
      els.forEach(function(el){el.classList.add('thx-rv');io.observe(el);});
      /* failsafes: nothing may stay hidden — scroll fallback + timed sweep */
      function sweep(){
        [].slice.call(document.querySelectorAll('.thx-rv:not(.thx-rv-in)')).forEach(function(el){
          var r=el.getBoundingClientRect();
          if(r.top<window.innerHeight*0.96&&r.bottom>0)el.classList.add('thx-rv-in');
        });
      }
      window.addEventListener('scroll',sweep,{passive:true});
      setTimeout(sweep,3000);
      window.addEventListener('pagehide',function(){io.disconnect();});
    }catch(e){}
  }

  /* ---- parallax — rAF drift on section imagery, desktop only ---- */
  if(CFG.parallax&&window.innerWidth>=768){
    try{
      var imgs=[].slice.call(document.querySelectorAll('.lynx-image,.image-16,.image-17,.image-18')).filter(function(im){
        return im.getBoundingClientRect().height>160;
      });
      imgs.forEach(function(im){im.style.willChange='transform';});
      var ticking=false;
      function apply(){
        ticking=false;
        var vh2=window.innerHeight;
        imgs.forEach(function(im){
          var r=im.getBoundingClientRect();
          if(r.bottom<-100||r.top>vh2+100)return;
          var c=(r.top+r.height/2-vh2/2)/vh2; /* -0.5..0.5 */
          var ty=Math.max(-12,Math.min(12,-c*18));
          im.style.transform='translateY('+ty.toFixed(1)+'px) scale(1.05)';
        });
      }
      window.addEventListener('scroll',function(){if(document.hidden){apply();return;}if(!ticking){ticking=true;requestAnimationFrame(apply);}},{passive:true});
      apply();
    }catch(e){}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
