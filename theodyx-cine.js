/* Theodyx Cine v2.0.0 — homepage cinematic. Library-free. Modules removable via CFG. */
(function(){
if(location.pathname!=='/'&&location.pathname!=='')return;
if(window.__thxCineInit)return;window.__thxCineInit=1;

var CFG={
  eagerImages:true,  // images load immediately (mobile reliability)
  heroIntro:true,    // type-on headline -> video emerges from the dark -> THEODYX side label -> headline pops in
  autoSound:true,    // silent best-effort: unmute on first user gesture (no pill)
  scrollZoom:true,   // after the intro, first scroll zooms the video up to full — once per page load
  reveals:true,      // section-by-section cascades
  parallax:true,     // drift on section imagery (desktop)
  pressBand:true     // "From Our Thinking" article cards, scraped live from /our-thinking
};

var reduced=false;
try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var EASE='cubic-bezier(.16,1,.3,1)';

function init(){
  if(CFG.eagerImages){try{[].slice.call(document.images).forEach(function(im){if(im.loading==='lazy')im.loading='eager';});}catch(e){}}

  var video=document.querySelector('.hero-media video, video.hero-video');
  if(video){try{video.muted=true;video.play().catch(function(){});}catch(e){}}

  if(CFG.autoSound&&video){
    try{
      var armed=function(){
        document.removeEventListener('pointerdown',armed,true);
        document.removeEventListener('keydown',armed,true);
        video.muted=false;video.play().catch(function(){});
      };
      document.addEventListener('pointerdown',armed,true);
      document.addEventListener('keydown',armed,true);
    }catch(e){}
  }

  var hero=document.querySelector('section.hero, .hero');
  var media=document.querySelector('.hero-media');
  var h1=document.querySelector('.hero-h1');
  var vlabel=document.querySelector('.hero-vlabel');
  var baseR=media?(parseFloat(getComputedStyle(media).borderRadius)||0):0;
  var SETTLE={scale:0.9,radius:26};
  var introDone=!CFG.heroIntro||reduced||!hero||!media||!h1;
  var zoomDone=false;

  /* ---------- heroIntro ---------- */
  if(!introDone){
    try{
      hero.style.position=hero.style.position||'relative';
      if(getComputedStyle(hero).position==='static')hero.style.position='relative';
      media.style.overflow='hidden';
      media.style.willChange='transform';
      media.style.opacity='0';
      media.style.transform='translateY(14%) scale(0.96)';
      h1.style.opacity='0';
      h1.style.transform='translateY(22px)';
      /* side label letters */
      var word=(vlabel&&(vlabel.getAttribute('data-word')||vlabel.textContent.trim()))||'THEODYX';
      if(vlabel){
        vlabel.innerHTML='';
        word.split('').forEach(function(ch){
          var s=document.createElement('span');
          s.textContent=ch;
          s.style.cssText='display:block;opacity:0;transform:translateX(14px);transition:opacity .6s '+EASE+',transform .6s '+EASE;
          vlabel.appendChild(s);
        });
      }
      /* typing overlay */
      var text=(h1.textContent||'').replace(/\s+/g,' ').trim();
      var ov=document.createElement('div');
      ov.style.cssText='position:absolute;inset:0;z-index:30;background:#050505;display:flex;align-items:center;padding:0 max(24px,7vw);opacity:1;transition:opacity .55s ease';
      var tspan=document.createElement('div');
      tspan.style.cssText='font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-size:clamp(26px,4.6vw,52px);line-height:1.15;font-weight:600;letter-spacing:-0.02em;color:#faf8f2;max-width:22ch';
      var caret=document.createElement('span');
      caret.style.cssText='display:inline-block;width:3px;height:.95em;background:#faf8f2;margin-left:4px;vertical-align:-0.12em;animation:thxCaret 0.85s steps(1) infinite';
      var kf=document.createElement('style');
      kf.textContent='@keyframes thxCaret{0%,49%{opacity:1}50%,100%{opacity:0}}';
      document.head.appendChild(kf);
      var tx=document.createElement('span');
      tspan.appendChild(tx);tspan.appendChild(caret);
      ov.appendChild(tspan);
      hero.appendChild(ov);

      var TYPE_MS=Math.min(42,1750/Math.max(1,text.length));
      var T_TYPE_END=Math.round(text.length*TYPE_MS);
      var T_EXIT=T_TYPE_END+420;
      var T_VIDEO=T_EXIT+240;
      var T_LABEL=T_VIDEO+620;
      var T_H1=T_LABEL+1050;
      var T_ARMED=T_H1+520;

      var start=null,flags={};
      function once(k,fn){if(flags[k])return;flags[k]=1;try{fn();}catch(e){}}
      function settleMedia(){
        media.style.transition='opacity 1.1s '+EASE+',transform 1.15s '+EASE+',border-radius 1.15s '+EASE;
        media.style.opacity='1';
        media.style.transform='translateY(0%) scale('+SETTLE.scale+')';
        media.style.borderRadius=SETTLE.radius+'px';
      }
      function showLabel(){
        if(!vlabel)return;
        [].slice.call(vlabel.children).forEach(function(s,i){
          s.style.transitionDelay=(i*85)+'ms';
          s.style.opacity='1';s.style.transform='translateX(0)';
        });
      }
      function showH1(){
        h1.style.transition='opacity .8s '+EASE+',transform .8s '+EASE;
        h1.style.opacity='1';h1.style.transform='translateY(0)';
      }
      function finish(){
        once('exit',function(){ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},600);});
        once('video',settleMedia);
        once('label',showLabel);
        once('h1',showH1);
        introDone=true;
      }
      function step(){
        if(introDone)return;
        if(start===null)return;
        var t=Date.now()-start;
        var n=Math.min(text.length,Math.floor(t/TYPE_MS));
        if(tx.textContent.length!==n)tx.textContent=text.slice(0,n);
        if(t>=T_EXIT)once('exit',function(){caret.style.display='none';ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},600);});
        if(t>=T_VIDEO)once('video',settleMedia);
        if(t>=T_LABEL)once('label',showLabel);
        if(t>=T_H1)once('h1',showH1);
        if(t>=T_ARMED)introDone=true;
      }
      /* time-based ticker: rAF + interval fallback (background tabs) */
      var iv=setInterval(function(){step();if(introDone)clearInterval(iv);},120);
      (function raf(){if(introDone)return;step();requestAnimationFrame(raf);})();
      /* start when visible (or after 8s regardless) */
      function begin(){if(start===null)start=Date.now();}
      if(document.hidden){
        var vis=function(){if(!document.hidden){document.removeEventListener('visibilitychange',vis);begin();}};
        document.addEventListener('visibilitychange',vis);
        setTimeout(begin,8000);
      }else begin();
      /* any scroll/gesture before the end: finish instantly, never trap the user */
      var skip=function(){
        window.removeEventListener('wheel',skip,{passive:true});
        window.removeEventListener('touchmove',skip,{passive:true});
        window.removeEventListener('scroll',skip);
        if(!introDone)finish();
      };
      window.addEventListener('wheel',skip,{passive:true});
      window.addEventListener('touchmove',skip,{passive:true});
      window.addEventListener('scroll',skip,{passive:true});
    }catch(e){introDone=true;}
  }

  /* ---------- scrollZoom: framed -> full, one-way, once ---------- */
  if(CFG.scrollZoom&&media&&!reduced){
    try{
      var maxP=0;
      function zoomPaint(p){
        var s=SETTLE.scale+(1-SETTLE.scale)*p;
        var r=SETTLE.radius+(baseR-SETTLE.radius)*p;
        media.style.transition='none';
        media.style.transform='scale('+s.toFixed(4)+')';
        media.style.borderRadius=r.toFixed(1)+'px';
        if(p>=0.999&&!zoomDone){
          zoomDone=true;
          media.style.transform='';
          media.style.borderRadius='';
          media.style.willChange='';
        }
      }
      function onScrollZoom(){
        if(zoomDone||!introDone)return;
        var p=Math.min(1,Math.max(0,window.pageYOffset/420));
        if(p>maxP){maxP=p;zoomPaint(maxP);}
      }
      window.addEventListener('scroll',onScrollZoom,{passive:true});
    }catch(e){}
  }

  if(reduced)return;

  /* ---------- reveals v2: section-by-section cascades ---------- */
  if(CFG.reveals&&'IntersectionObserver' in window){
    try{
      var css=document.createElement('style');
      css.textContent='.thx-rv2{opacity:0;transform:translateY(30px);transition:opacity .9s '+EASE+',transform .9s '+EASE+'}'+
        'img.thx-rv2,.lynx-image.thx-rv2{transform:translateY(30px) scale(1.04)}'+
        '.thx-rv2.thx-rv2-in{opacity:1;transform:none}';
      document.head.appendChild(css);
      var vh=window.innerHeight;
      var sections=[].slice.call(document.querySelectorAll('.banner-sec,.fx-hero,.fx-split,.fx-sec'));
      var TS='h1,h2,h3,h4,.fx-h3,.lynx-heading,.lynx-paragraph,.fx-stp,.fx-bp,.fx-body-1,.fx-link,img';
      var groups=[];
      sections.forEach(function(sec){
        var els=[].slice.call(sec.querySelectorAll(TS)).filter(function(el){
          if(el.closest('.site-navbar')||el.closest('footer')||el.closest('.footer'))return false;
          var r=el.getBoundingClientRect();
          if(r.height<8)return false;
          return r.top>vh*0.9;
        }).slice(0,14);
        if(els.length)groups.push({sec:sec,els:els});
      });
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting)return;
          var grp=null;
          for(var i=0;i<groups.length;i++)if(groups[i].sec===en.target)grp=groups[i];
          if(grp)grp.els.forEach(function(el,i){
            el.style.transitionDelay=Math.min(i,9)*85+'ms';
            el.classList.add('thx-rv2-in');
          });
          io.unobserve(en.target);
        });
      },{rootMargin:'0px 0px -8% 0px',threshold:0.06});
      groups.forEach(function(g){g.els.forEach(function(el){el.classList.add('thx-rv2');});io.observe(g.sec);});
      function sweep(){
        [].slice.call(document.querySelectorAll('.thx-rv2:not(.thx-rv2-in)')).forEach(function(el){
          var r=el.getBoundingClientRect();
          if(r.top<window.innerHeight*0.96&&r.bottom>0)el.classList.add('thx-rv2-in');
        });
      }
      window.addEventListener('scroll',sweep,{passive:true});
      setTimeout(sweep,3500);
    }catch(e){}
  }

  /* ---------- parallax ---------- */
  if(CFG.parallax&&window.innerWidth>=768){
    try{
      var imgs=[].slice.call(document.querySelectorAll('.lynx-image,.lynx-image-absolute,.image-16,.image-17,.image-18')).filter(function(im){
        return im.getBoundingClientRect().height>140;
      });
      imgs.forEach(function(im){im.style.willChange='transform';});
      var ticking=false;
      function apply(){
        ticking=false;
        var vh2=window.innerHeight;
        imgs.forEach(function(im){
          var r=im.getBoundingClientRect();
          if(r.bottom<-100||r.top>vh2+100)return;
          var c=(r.top+r.height/2-vh2/2)/vh2;
          var ty=Math.max(-12,Math.min(12,-c*18));
          im.style.transform='translateY('+ty.toFixed(1)+'px) scale(1.05)';
        });
      }
      window.addEventListener('scroll',function(){if(document.hidden){apply();return;}if(!ticking){ticking=true;requestAnimationFrame(apply);}},{passive:true});
      apply();
    }catch(e){}
  }

  /* ---------- pressBand: From Our Thinking ---------- */
  if(CFG.pressBand){
    try{
      fetch('/our-thinking').then(function(r){return r.text();}).then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        var seen={},cards=[];
        [].slice.call(doc.querySelectorAll('a[href^="/our-thinking/"]')).forEach(function(a){
          var href=a.getAttribute('href');
          if(!href||href==='/our-thinking'||seen[href])return;
          var scope=a.closest('.w-dyn-item')||a;
          var img=scope.querySelector('img');
          var hEl=scope.querySelector('h2,h3,h4')||a;
          var title=(hEl.textContent||'').trim();
          if(!title||title.length<8)title=(a.getAttribute('aria-label')||'').trim();
          if(!title)return;
          seen[href]=1;
          cards.push({href:href,title:title,img:img?(img.currentSrc||img.src):null});
        });
        cards=cards.slice(0,4);
        if(!cards.length)return;
        var css2=document.createElement('style');
        css2.textContent='.thx-press{background:#050505;padding:96px 24px 110px}'+
          '.thx-press-in{max-width:1180px;margin:0 auto}'+
          '.thx-press-top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:34px}'+
          '.thx-press-k{font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(250,248,242,.55);font-weight:600}'+
          '.thx-press-all{font-family:inherit;font-size:14px;color:#faf8f2;text-decoration:none;border-bottom:1px solid rgba(250,248,242,.3);padding-bottom:2px}'+
          '.thx-press-all:hover{border-color:#faf8f2}'+
          '.thx-press-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:26px}'+
          '.thx-press-card{display:block;text-decoration:none;color:#faf8f2}'+
          '.thx-press-imgw{aspect-ratio:3/2;border-radius:14px;overflow:hidden;background:#101011;margin-bottom:14px}'+
          '.thx-press-imgw img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s '+EASE+'}'+
          '.thx-press-card:hover .thx-press-imgw img{transform:scale(1.045)}'+
          '.thx-press-t{font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-size:17px;line-height:1.4;font-weight:600;color:#faf8f2;margin:0 0 8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}'+
          '.thx-press-m{font-size:13px;color:rgba(250,248,242,.5)}'+
          '@media(max-width:600px){.thx-press{padding:70px 18px 84px}}';
        document.head.appendChild(css2);
        var sec=document.createElement('section');
        sec.className='thx-press';
        var inner=document.createElement('div');inner.className='thx-press-in';
        var top=document.createElement('div');top.className='thx-press-top';
        var k=document.createElement('div');k.className='thx-press-k';k.textContent='From Our Thinking';
        var all=document.createElement('a');all.className='thx-press-all';all.href='/our-thinking';all.textContent='View all →';
        top.appendChild(k);top.appendChild(all);
        var grid=document.createElement('div');grid.className='thx-press-grid';
        cards.forEach(function(c){
          var a=document.createElement('a');a.className='thx-press-card';a.href=c.href;
          var iw=document.createElement('div');iw.className='thx-press-imgw';
          if(c.img){var im=document.createElement('img');im.src=c.img;im.alt=c.title;im.loading='eager';iw.appendChild(im);}
          var t=document.createElement('h3');t.className='thx-press-t';t.textContent=c.title;
          var m=document.createElement('div');m.className='thx-press-m';m.textContent='Read →';
          a.appendChild(iw);a.appendChild(t);a.appendChild(m);
          grid.appendChild(a);
        });
        inner.appendChild(top);inner.appendChild(grid);sec.appendChild(inner);
        var footer=document.querySelector('footer,.footer');
        if(footer&&footer.parentNode)footer.parentNode.insertBefore(sec,footer);
        else document.body.appendChild(sec);
        /* gentle entrance */
        if(!reduced&&'IntersectionObserver' in window){
          [].slice.call(grid.children).forEach(function(cEl,i){
            cEl.style.cssText+=';opacity:0;transform:translateY(28px);transition:opacity .85s '+EASE+' '+(i*90)+'ms,transform .85s '+EASE+' '+(i*90)+'ms';
          });
          var bio=new IntersectionObserver(function(es){
            es.forEach(function(en){if(!en.isIntersecting)return;
              [].slice.call(grid.children).forEach(function(cEl){cEl.style.opacity='1';cEl.style.transform='none';});
              bio.disconnect();});
          },{threshold:0.1});
          bio.observe(sec);
          var pswp=function(){var r=sec.getBoundingClientRect();if(r.top<window.innerHeight*0.96){[].slice.call(grid.children).forEach(function(cEl){cEl.style.opacity='1';cEl.style.transform='none';});window.removeEventListener('scroll',pswp);}};
          window.addEventListener('scroll',pswp,{passive:true});
        }
      }).catch(function(){});
    }catch(e){}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
