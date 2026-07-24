/* Theodyx Cine v3.1.1 — homepage cinematic. Library-free. Modules removable via CFG. */
(function(){
if(location.pathname!=='/'&&location.pathname!=='')return;
if(window.__thxCineInit)return;window.__thxCineInit=1;

var CFG={
  eagerImages:true,
  heroIntro:true,     // typed line -> connection word run -> "what it means to be Human." -> video emerges
  autoSound:true,     // silent: unmute on first user gesture
  scrollZoom:true,    // framed -> full on first scroll, one-way, once per load
  reveals:true,       // elite section-by-section choreography
  parallax:true,
  pressBand:true
};

var reduced=false;
try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var EASE='cubic-bezier(.19,1,.22,1)';
var WORDS=['video.','music.','writing.','live media.','brands.','studios.','institutions.','partners.','clients.','artists.','athlete.','olympian.','nurse.','doctor.','lawyer.','teacher.','construction.','welder.','scholar.','thinker.','actor.','executive.','mom.','son.','aunt.','friend.'];
var WORD_MS=[430,430,430,470, 260,260,260,260,260, 195,180,168,156,146,138,132,128,128,134,144,158,176, 390,450,530,700];

function init(){
  if(CFG.eagerImages){try{[].slice.call(document.images).forEach(function(im){if(im.loading==='lazy')im.loading='eager';});}catch(e){}}

  var video=document.querySelector('.hero-media video, video.hero-video');
  if(video){try{video.muted=true;video.play().catch(function(){});}catch(e){}}

  if(CFG.autoSound&&video){
    try{
      var armFn=function(){
        document.removeEventListener('pointerdown',armFn,true);
        document.removeEventListener('keydown',armFn,true);
        video.muted=false;video.play().catch(function(){});
      };
      document.addEventListener('pointerdown',armFn,true);
      document.addEventListener('keydown',armFn,true);
    }catch(e){}
  }

  var hero=document.querySelector('section.hero, .hero');
  var media=document.querySelector('.hero-media');
  var h1=document.querySelector('.hero-h1');
  var vlabel=document.querySelector('.hero-vlabel');
  var SETTLE={scale:0.9,radius:28};
  var flags={};
  var introDone=!CFG.heroIntro||reduced||!hero||!media||!h1;

  /* ---------- heroIntro ---------- */
  if(!introDone){
    try{
      if(getComputedStyle(hero).position==='static')hero.style.position='relative';
      media.style.overflow='hidden';
      media.style.willChange='transform,filter';
      media.style.opacity='0';
      media.style.transform='translateY(10%) scale(0.94)';
      if(video)video.style.filter='brightness(0.55) blur(14px)';
      h1.style.opacity='0';
      h1.style.transform='translateY(24px)';
      var word=(vlabel&&(vlabel.getAttribute('data-word')||vlabel.textContent.trim()))||'THEODYX';
      if(vlabel){
        vlabel.innerHTML='';
        word.split('').forEach(function(ch){
          var s=document.createElement('span');
          s.textContent=ch;
          s.style.cssText='display:block;opacity:0;transform:translateX(16px);transition:opacity .7s '+EASE+',transform .7s '+EASE;
          vlabel.appendChild(s);
        });
      }

      var text=(h1.textContent||'').replace(/\s+/g,' ').trim();
      var ov=document.createElement('div');
      ov.style.cssText='position:absolute;inset:0;z-index:30;background:#050505;display:flex;align-items:center;padding:0 max(24px,7vw);opacity:1;transition:opacity .7s ease';
      var tspan=document.createElement('div');
      tspan.style.cssText='font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-size:clamp(26px,4.6vw,52px);line-height:1.15;font-weight:600;letter-spacing:-0.02em;color:#faf8f2;max-width:24ch';
      var kf=document.createElement('style');
      kf.textContent='@keyframes thxCaret{0%,49%{opacity:1}50%,100%{opacity:0}}'+
        '.thx-wfade{transition:opacity .34s ease,filter .34s ease}';
      document.head.appendChild(kf);
      var tx=document.createElement('span');
      var caret=document.createElement('span');
      caret.style.cssText='display:inline-block;width:3px;height:.95em;background:#faf8f2;margin-left:5px;vertical-align:-0.12em;animation:thxCaret 0.9s steps(1) infinite';
      tspan.appendChild(tx);tspan.appendChild(caret);
      ov.appendChild(tspan);
      hero.appendChild(ov);

      /* -- timeline (all ms from start; time-based so background tabs stay correct) -- */
      var TYPE_MS=Math.min(72,3100/Math.max(1,text.length));  /* slower, deliberate */
      var T_TYPE_END=Math.round(text.length*TYPE_MS);
      var T_LINE_HOLD=T_TYPE_END+650;
      /* word run */
      var wordStarts=[],acc=T_LINE_HOLD+300;
      for(var wi=0;wi<WORDS.length;wi++){wordStarts.push(acc);acc+=WORD_MS[wi];}
      var T_WORDS_END=acc+150;
      var T_HUMAN=T_WORDS_END+120;          /* "Human." lands alone */
      var T_PREFIX=T_HUMAN+850;             /* "what it means to be " types in before it */
      var PREFIX='what it means to be ';
      var PRE_MS=58;
      var T_PREFIX_END=T_PREFIX+PREFIX.length*PRE_MS;
      var T_EXIT=T_PREFIX_END+1050;
      var T_VIDEO=T_EXIT+250;
      var T_LABEL=T_VIDEO+780;
      var T_H1=T_LABEL+1150;
      var T_ARMED=T_H1+600;

      var start=null,wordIdx=-1;
      var humanWrap=null,preSpan=null,humSpan=null;
      function once(k,fn){if(flags[k])return;flags[k]=1;try{fn();}catch(e){}}
      function clearTyped(){tx.textContent='';caret.style.display='none';}
      function showWord(i){
        if(i===wordIdx)return;wordIdx=i;
        var slow=i>=22;
        if(slow){
          tx.className='thx-wfade';
          tx.style.opacity='0';tx.style.filter='blur(6px)';
          (function(w){setTimeout(function(){if(flags['human'])return;tx.textContent=w;tx.style.opacity='1';tx.style.filter='blur(0px)';},170);})(WORDS[i]);
        }else{
          tx.className='';tx.style.opacity='1';tx.style.filter='';
          tx.textContent=WORDS[i];
        }
      }
      function mountHuman(){
        tx.className='';tx.style.opacity='1';tx.style.filter='';
        tx.textContent='';
        humanWrap=document.createElement('span');
        preSpan=document.createElement('span');
        humSpan=document.createElement('span');
        humSpan.textContent='Human.';
        humSpan.style.cssText='display:inline-block;opacity:0;transform:translateY(14px) scale(1.05);transition:opacity .7s '+EASE+',transform .7s '+EASE;
        humanWrap.appendChild(preSpan);humanWrap.appendChild(humSpan);
        tx.appendChild(humanWrap);
        requestAnimationFrame(function(){humSpan.style.opacity='1';humSpan.style.transform='none';});
        setTimeout(function(){if(humSpan){humSpan.style.opacity='1';humSpan.style.transform='none';}},60);
      }
      function settleMedia(){
        media.style.transition='opacity 1.5s '+EASE+',transform 1.6s '+EASE+',border-radius 1.6s '+EASE;
        media.style.opacity='1';
        media.style.transform='translateY(0%) scale('+SETTLE.scale+')';
        media.style.borderRadius=SETTLE.radius+'px';
        if(video){
          video.style.transition='filter 1.7s '+EASE;
          video.style.filter='brightness(1) blur(0px)';
          setTimeout(function(){try{video.style.filter='';video.style.transition='';}catch(e){}},1900);
        }
      }
      function showLabel(){
        if(!vlabel)return;
        [].slice.call(vlabel.children).forEach(function(s,i){
          s.style.transitionDelay=(i*90)+'ms';
          s.style.opacity='1';s.style.transform='translateX(0)';
        });
      }
      function showH1(){
        h1.style.transition='opacity .9s '+EASE+',transform .9s '+EASE;
        h1.style.opacity='1';h1.style.transform='translateY(0)';
      }
      function removeOverlay(){ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},750);}
      function finish(){
        once('exit',removeOverlay);
        once('video',settleMedia);
        once('label',showLabel);
        once('h1',showH1);
        introDone=true;
      }
      function step(){
        if(introDone||start===null)return;
        var t=Date.now()-start;
        if(t<T_TYPE_END){
          var n=Math.min(text.length,Math.floor(t/TYPE_MS));
          if(tx.textContent.length!==n&&wordIdx===-1)tx.textContent=text.slice(0,n);
        }else if(t<T_LINE_HOLD){
          if(wordIdx===-1&&tx.textContent!==text)tx.textContent=text;
        }else if(t<T_WORDS_END){
          once('wordmode',clearTyped);
          for(var i=WORDS.length-1;i>=0;i--){if(t>=wordStarts[i]){showWord(i);break;}}
        }else if(t<T_PREFIX){
          once('human',mountHuman);
        }else if(t<T_EXIT){
          once('human',mountHuman);
          if(preSpan){
            var pn=Math.min(PREFIX.length,Math.floor((t-T_PREFIX)/PRE_MS));
            if(preSpan.textContent.length!==pn)preSpan.textContent=PREFIX.slice(0,pn);
          }
        }
        if(t>=T_EXIT)once('exit',removeOverlay);
        if(t>=T_VIDEO)once('video',settleMedia);
        if(t>=T_LABEL)once('label',showLabel);
        if(t>=T_H1)once('h1',showH1);
        if(t>=T_ARMED)introDone=true;
      }
      var iv=setInterval(function(){step();if(introDone)clearInterval(iv);},110);
      (function raf(){if(introDone)return;step();requestAnimationFrame(raf);})();
      function begin(){if(start===null)start=Date.now();}
      window.__thxCineBegin=begin;
      if(document.hidden){
        var vis=function(){if(!document.hidden){document.removeEventListener('visibilitychange',vis);begin();}};
        document.addEventListener('visibilitychange',vis);
      }else begin();
      var skip=function(e){
        /* a scroll event at y<=2 is browser scroll-restoration noise, not user intent */
        if(e&&e.type==='scroll'&&window.pageYOffset<=2)return;
        window.removeEventListener('wheel',skip);
        window.removeEventListener('touchmove',skip);
        window.removeEventListener('scroll',skip);
        if(!introDone)finish();
      };
      window.addEventListener('wheel',skip,{passive:true});
      window.addEventListener('touchmove',skip,{passive:true});
      window.addEventListener('scroll',skip,{passive:true});
    }catch(e){introDone=true;}
  }

  /* ---------- scrollZoom ---------- */
  var zoomDone=false;
  if(CFG.scrollZoom&&media&&!reduced&&CFG.heroIntro&&hero&&h1){
    try{
      var baseR=20;
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
      window.addEventListener('scroll',function(){
        if(zoomDone||!introDone||!flags['video'])return;
        var p=Math.min(1,Math.max(0,window.pageYOffset/430));
        if(p>maxP){maxP=p;zoomPaint(maxP);}
      },{passive:true});
    }catch(e){}
  }

  /* ---------- reveals v3: elite section choreography ---------- */
  if(CFG.reveals&&!reduced&&'IntersectionObserver' in window){
    try{
      var lite=window.innerWidth<768;
      var css=document.createElement('style');
      css.textContent=
        '.thx-rvH{opacity:0;transform:translateY(46px);'+(lite?'':'clip-path:inset(0 0 58% 0);filter:blur(10px);')+'transition:opacity 1.1s '+EASE+',transform 1.15s '+EASE+(lite?'':',clip-path 1.15s '+EASE+',filter 1.05s '+EASE)+'}'+
        '.thx-rvH.thx-on{opacity:1;transform:none;'+(lite?'':'clip-path:inset(0 0 0% 0);filter:blur(0px);')+'}'+
        '.thx-rvC{opacity:0;transform:translateY(34px);'+(lite?'':'filter:blur(7px);')+'transition:opacity .95s '+EASE+',transform 1s '+EASE+(lite?'':',filter .9s '+EASE)+'}'+
        '.thx-rvC.thx-on{opacity:1;transform:none;'+(lite?'':'filter:blur(0px);')+'}'+
        '.thx-rvI{opacity:0;transform:scale(1.1);clip-path:inset(0 0 96% 0 round 16px);transition:opacity 1.05s '+EASE+',transform 1.3s '+EASE+',clip-path 1.25s '+EASE+'}'+
        '.thx-rvI.thx-on{opacity:1;transform:scale(1);clip-path:inset(0 0 0% 0 round 16px)}';
      document.head.appendChild(css);
      var vh=window.innerHeight;
      var sections=[].slice.call(document.querySelectorAll('.banner-sec,.fx-hero,.fx-split,.fx-sec'));
      var groups=[];
      sections.forEach(function(sec){
        var heads=[].slice.call(sec.querySelectorAll('h1,h2,h3,h4,.fx-h3,.lynx-heading'));
        var copy=[].slice.call(sec.querySelectorAll('.lynx-paragraph,.fx-stp,.fx-bp,.fx-body-1,.fx-link'));
        var imgs=[].slice.call(sec.querySelectorAll('img'));
        var els=[];
        heads.forEach(function(el){els.push({el:el,k:'thx-rvH'});});
        copy.forEach(function(el){els.push({el:el,k:'thx-rvC'});});
        imgs.forEach(function(el){els.push({el:el,k:'thx-rvI'});});
        els=els.filter(function(o){
          var el=o.el;
          if(el.closest('.site-navbar')||el.closest('footer')||el.closest('.footer')||el.closest('.hero'))return false;
          var r=el.getBoundingClientRect();
          if(r.height<8)return false;
          return r.top>vh*0.9;
        }).slice(0,16);
        /* order by document position so the cascade reads top-to-bottom */
        els.sort(function(a,b){return a.el.getBoundingClientRect().top-b.el.getBoundingClientRect().top;});
        if(els.length)groups.push({sec:sec,els:els});
      });
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting)return;
          var grp=null;
          for(var i=0;i<groups.length;i++)if(groups[i].sec===en.target)grp=groups[i];
          if(grp)grp.els.forEach(function(o,i){
            var d=Math.min(i,10)*110;
            o.el.style.transitionDelay=d+'ms';
            o.el.classList.add('thx-on');
            setTimeout(function(){o.el.style.transitionDelay='';o.el.classList.remove(o.k,'thx-on');},d+1450);
          });
          io.unobserve(en.target);
        });
      },{rootMargin:'0px 0px -10% 0px',threshold:0.07});
      groups.forEach(function(g){g.els.forEach(function(o){o.el.classList.add(o.k);});io.observe(g.sec);});
      function sweep(){
        [].slice.call(document.querySelectorAll('.thx-rvH:not(.thx-on),.thx-rvC:not(.thx-on),.thx-rvI:not(.thx-on)')).forEach(function(el){
          var r=el.getBoundingClientRect();
          if(r.top<window.innerHeight*0.97&&r.bottom>0){
            el.classList.add('thx-on');
            setTimeout(function(){el.style.transitionDelay='';el.classList.remove('thx-rvH','thx-rvC','thx-rvI','thx-on');},1450);
          }
        });
      }
      window.addEventListener('scroll',sweep,{passive:true});
      setTimeout(sweep,3500);
    }catch(e){}
  }

  /* ---------- parallax ---------- */
  if(CFG.parallax&&!reduced&&window.innerWidth>=768){
    try{
      var imgs2=[].slice.call(document.querySelectorAll('.lynx-image,.lynx-image-absolute,.image-16,.image-17,.image-18')).filter(function(im){
        return im.getBoundingClientRect().height>140;
      });
      imgs2.forEach(function(im){im.style.willChange='transform';});
      var ticking=false;
      function applyPx(){
        ticking=false;
        var vh2=window.innerHeight;
        imgs2.forEach(function(im){
          if(im.classList.contains('thx-rvI'))return;
          var r=im.getBoundingClientRect();
          if(r.bottom<-100||r.top>vh2+100)return;
          var c=(r.top+r.height/2-vh2/2)/vh2;
          var ty=Math.max(-12,Math.min(12,-c*18));
          im.style.transform='translateY('+ty.toFixed(1)+'px) scale(1.05)';
        });
      }
      window.addEventListener('scroll',function(){if(document.hidden){applyPx();return;}if(!ticking){ticking=true;requestAnimationFrame(applyPx);}},{passive:true});
      applyPx();
    }catch(e){}
  }

  /* ---------- pressBand ---------- */
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
        if(!reduced&&'IntersectionObserver' in window){
          [].slice.call(grid.children).forEach(function(cEl,i){
            cEl.style.cssText+=';opacity:0;transform:translateY(28px);transition:opacity .85s '+EASE+' '+(i*90)+'ms,transform .85s '+EASE+' '+(i*90)+'ms';
          });
          var reveal=function(){[].slice.call(grid.children).forEach(function(cEl){cEl.style.opacity='1';cEl.style.transform='none';});};
          var bio=new IntersectionObserver(function(es){
            es.forEach(function(en){if(!en.isIntersecting)return;reveal();bio.disconnect();});
          },{threshold:0.1});
          bio.observe(sec);
          var pswp=function(){var r=sec.getBoundingClientRect();if(r.top<window.innerHeight*0.97){reveal();window.removeEventListener('scroll',pswp);}};
          window.addEventListener('scroll',pswp,{passive:true});
        }
      }).catch(function(){});
    }catch(e){}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
