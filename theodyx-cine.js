/* Theodyx Cine v5.0.2 — homepage cinematic. Library-free. Modules removable via CFG.
   Intro: typed line -> word constellation builds center-screen -> family spotlight ->
   gravitational collapse -> "what it means to be Human." -> video emerges. No blur anywhere. */
(function(){
if(location.pathname!=='/'&&location.pathname!=='')return;
if(window.__thxCineInit)return;window.__thxCineInit=1;

var CFG={
  eagerImages:true,
  heroIntro:false,    // page loads straight into the video (constellation kept behind this flag)
  autoSound:true,
  scrollZoom:false,   // no intro -> hero stays in its native designed state
  reveals:true,
  parallax:true,
  pressBand:false     // replaced by the native From Our Thinking section
};

var reduced=false;
try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var EASE='cubic-bezier(.19,1,.22,1)';

/* the constellation — media, craft, feeling, people. family is the spotlight tail. */
var CLOUD=['video.','music.','writing.','film.','podcasts.','fashion.','gaming.','sports.','news.','culture.','stories.','stages.','platforms.','audiences.','fans.','voices.','visions.','dreams.','craft.','art.','design.','code.','capital.','deals.','rights.','royalties.','brands.','studios.','institutions.','partners.','clients.','creators.','artists.','athlete.','olympian.','nurse.','doctor.','lawyer.','teacher.','construction.','welder.','scholar.','thinker.','actor.','executive.','builders.','dreamers.','believers.','mentors.','teammates.','neighbors.','strangers.','laughter.','tears.','joy.','grief.','love.','courage.','doubt.','hope.','ambition.','legacy.','moments.','memories.','beginnings.','comebacks.','encores.'];
var EMPH=['stories.','creators.','love.','dreams.','culture.','legacy.','hope.','art.'];
var FAMILY=['mom.','son.','aunt.','friend.'];

function init(){
  if(CFG.eagerImages){try{[].slice.call(document.images).forEach(function(im){if(im.loading==='lazy')im.loading='eager';});}catch(e){}}

  var video=document.querySelector('.hero-media video, video.hero-video');
  if(video){try{video.muted=true;video.play().catch(function(){});}catch(e){}}

  /* 5.0.2 (Phase 9 F-01): the gesture auto-unmute is gone - audio only ever starts from the hero's own mute button
     (theodyx-home-fx). A first keystroke or tap must never turn sound on. CFG.autoSound is ignored. */

  var hero=document.querySelector('section.hero, .hero');
  var media=document.querySelector('.hero-media');
  var h1=document.querySelector('.hero-h1');
  var vlabel=document.querySelector('.hero-vlabel');
  var navEl=document.querySelector('.site-navbar,#thx-nav');
  var SETTLE={scale:0.9,radius:28};
  var flags={};
  var settleT=0;
  var introDone=!CFG.heroIntro||reduced||!hero||!media||!h1;

  function hideNav(){if(!navEl)return;navEl.style.transition='opacity .5s ease';navEl.style.opacity='0';navEl.style.visibility='hidden';navEl.style.pointerEvents='none';}
  function showNav(){if(!navEl)return;navEl.style.visibility='';navEl.style.opacity='';navEl.style.pointerEvents='';setTimeout(function(){try{navEl.style.transition='';}catch(e){}},600);}

  /* ---------- heroIntro ---------- */
  if(!introDone){
    try{
      if(getComputedStyle(hero).position==='static')hero.style.position='relative';
      hideNav();
      media.style.overflow='hidden';
      media.style.willChange='transform';
      media.style.opacity='0';
      media.style.transform='translateY(10%) scale(0.94)';
      if(video){video.style.filter='brightness(0.5)';try{video.pause();}catch(e){}}
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
      var isMobile=window.innerWidth<768;
      var ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;z-index:90;background:#050505;opacity:1;transition:opacity .8s ease;overflow:hidden';
      var typeLayer=document.createElement('div');
      typeLayer.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 6vw;z-index:3';
      var tspan=document.createElement('div');
      tspan.style.cssText='font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-size:clamp(28px,4.8vw,56px);line-height:1.18;font-weight:600;letter-spacing:-0.02em;color:#faf8f2;max-width:24ch';
      var kf=document.createElement('style');
      kf.textContent='@keyframes thxCaret{0%,49%{opacity:1}50%,100%{opacity:0}}'+
        '@keyframes thxDrift1{from{transform:translate(0,0)}to{transform:translate(7px,-9px)}}'+
        '@keyframes thxDrift2{from{transform:translate(0,0)}to{transform:translate(-8px,6px)}}'+
        '@keyframes thxDrift3{from{transform:translate(0,0)}to{transform:translate(5px,8px)}}';
      document.head.appendChild(kf);
      var tx=document.createElement('span');
      var caret=document.createElement('span');
      caret.style.cssText='display:inline-block;width:3px;height:.95em;background:#faf8f2;margin-left:5px;vertical-align:-0.12em;animation:thxCaret 0.9s steps(1) infinite';
      tspan.appendChild(tx);tspan.appendChild(caret);
      typeLayer.appendChild(tspan);
      var cloudLayer=document.createElement('div');
      cloudLayer.style.cssText='position:absolute;inset:0;z-index:2';
      ov.appendChild(cloudLayer);ov.appendChild(typeLayer);
      document.body.appendChild(ov);
      document.documentElement.style.overflow='hidden';

      /* word nodes on a jittered golden-angle spiral around center */
      var cloudWords=isMobile?CLOUD.filter(function(w,i){return i%2===0||EMPH.indexOf(w)>=0;}):CLOUD;
      var GA=137.508*Math.PI/180;
      var nodes=[];
      (function(){
        var vw=window.innerWidth,vh=window.innerHeight;
        var maxR=Math.min(vw,vh)*(isMobile?0.42:0.44);
        for(var i=0;i<cloudWords.length;i++){
          var w=cloudWords[i];
          var ang=i*GA+((i*7919)%100)/100*0.5;
          var r=Math.sqrt((i+1.5)/cloudWords.length)*maxR;
          var x=50+(r*Math.cos(ang))/vw*100;
          var y=50+(r*Math.sin(ang))/vh*88;
          x=Math.max(7,Math.min(93,x));y=Math.max(9,Math.min(91,y));
          var emph=EMPH.indexOf(w)>=0;
          var size=emph?(isMobile?26:38):(isMobile?13:16)+((i*104729)%100)/100*(isMobile?9:16);
          var op=emph?0.95:0.5+((i*15485863)%100)/100*0.4;
          var outer=document.createElement('span');
          outer.style.cssText='position:absolute;left:'+x.toFixed(2)+'%;top:'+y.toFixed(2)+'%;transform:translate(-50%,-50%) scale(.55);opacity:0;transition:transform .55s '+EASE+',opacity .5s ease;white-space:nowrap';
          var inner=document.createElement('span');
          inner.textContent=w;
          inner.style.cssText='display:inline-block;font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-weight:'+(emph?'600':'500')+';font-size:'+size.toFixed(1)+'px;color:rgba(250,248,242,'+op.toFixed(2)+');letter-spacing:-0.01em;animation:thxDrift'+((i%3)+1)+' '+(6+((i*31)%30)/10)+'s ease-in-out '+((i*13)%40)/10+'s infinite alternate;animation-play-state:paused';
          outer.appendChild(inner);
          cloudLayer.appendChild(outer);
          nodes.push({el:outer,x:x,y:y,shown:false});
        }
      })();

      /* -- timeline -- */
      var TYPE_MS=Math.min(72,3100/Math.max(1,text.length));
      var T_TYPE_END=Math.round(text.length*TYPE_MS);
      var T_LINE_HOLD=T_TYPE_END+600;
      var BUILD_START=T_LINE_HOLD+350;
      var BUILD_SPAN=isMobile?4600:5800;
      function buildAt(i){
        var f=i/Math.max(1,cloudWords.length-1);
        return BUILD_START+(1-Math.pow(1-f,1.9))*BUILD_SPAN;
      }
      var T_BUILD_END=BUILD_START+BUILD_SPAN;
      var famStarts=[],fa=T_BUILD_END+250;
      for(var fi=0;fi<FAMILY.length;fi++){famStarts.push(fa);fa+=fi<FAMILY.length-1?560:850;}
      var T_COLLAPSE=fa;
      var T_HUMAN=T_COLLAPSE+950;
      var T_PREFIX=T_HUMAN+900;
      var PREFIX='what it means to be ';
      var PRE_MS=58;
      var T_PREFIX_END=T_PREFIX+PREFIX.length*PRE_MS;
      var T_EXIT=T_PREFIX_END+1150;
      var T_VIDEO=T_EXIT+250;
      var T_LABEL=T_VIDEO+800;
      var T_H1=T_LABEL+1150;
      var T_ARMED=T_H1+600;

      var start=null,wordHi=-1,famIdx=-1;
      var preSpan=null,humSpan=null,famSpan=null;
      function once(k,fn){if(flags[k])return;flags[k]=1;try{fn();}catch(e){}}
      function clearTyped(){tx.textContent='';caret.style.display='none';}
      function showCloudUpTo(t){
        for(var i=wordHi+1;i<nodes.length;i++){
          if(buildAt(i)>t)break;
          var n=nodes[i];
          n.el.style.transform='translate(-50%,-50%) scale(1)';
          n.el.style.opacity='1';
          try{n.el.firstChild.style.animationPlayState='running';}catch(e){}
          n.shown=true;wordHi=i;
        }
      }
      function famWrapEl(){
        var f=document.createElement('div');
        f.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:4;pointer-events:none';
        var s=document.createElement('span');
        s.style.cssText='font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-weight:600;font-size:clamp(40px,7vw,74px);letter-spacing:-0.02em;color:#faf8f2;opacity:0;transform:scale(1.06);transition:opacity .42s ease,transform .5s '+EASE;
        f.appendChild(s);ov.appendChild(f);
        return s;
      }
      function showFamily(i){
        if(i===famIdx)return;famIdx=i;
        once('famDim',function(){cloudLayer.style.transition='opacity .7s ease';cloudLayer.style.opacity='0.32';});
        if(!famSpan)famSpan=famWrapEl();
        famSpan.style.opacity='0';famSpan.style.transform='scale(1.06)';
        (function(w){setTimeout(function(){
          if(flags['collapse'])return;
          famSpan.textContent=w;famSpan.style.opacity='1';famSpan.style.transform='scale(1)';
        },140);})(FAMILY[i]);
      }
      function collapse(){
        if(famSpan)famSpan.style.opacity='0';
        cloudLayer.style.opacity='1';
        var vw=window.innerWidth,vh=window.innerHeight;
        nodes.forEach(function(n){
          if(!n.shown){n.el.style.display='none';return;}
          try{n.el.firstChild.style.animationPlayState='paused';}catch(e){}
          var dx=(50-n.x)/100*vw,dy=(50-n.y)/100*vh;
          var dist=Math.sqrt(dx*dx+dy*dy);
          var dly=Math.round(dist/Math.max(vw,vh)*260);
          n.el.style.transition='transform .8s cubic-bezier(.55,0,.2,1) '+dly+'ms,opacity .55s ease '+(dly+180)+'ms';
          n.el.style.transform='translate(calc(-50% + '+dx.toFixed(0)+'px),calc(-50% + '+dy.toFixed(0)+'px)) scale(.05)';
          n.el.style.opacity='0';
        });
      }
      function mountHuman(){
        cloudLayer.style.display='none';
        if(famSpan&&famSpan.parentNode&&famSpan.parentNode.parentNode)famSpan.parentNode.parentNode.removeChild(famSpan.parentNode);
        tx.textContent='';caret.style.display='none';
        var wrap=document.createElement('span');
        preSpan=document.createElement('span');
        humSpan=document.createElement('span');
        humSpan.textContent='Human.';
        humSpan.style.cssText='display:inline-block;opacity:0;transform:translateY(12px) scale(1.06);transition:opacity .7s '+EASE+',transform .7s '+EASE;
        wrap.appendChild(preSpan);wrap.appendChild(humSpan);
        tx.appendChild(wrap);
        requestAnimationFrame(function(){humSpan.style.opacity='1';humSpan.style.transform='none';});
        setTimeout(function(){if(humSpan){humSpan.style.opacity='1';humSpan.style.transform='none';}},60);
      }
      function settleMedia(){
        settleT=Date.now();
        try{video&&video.play().catch(function(){});}catch(e){}
        media.style.transition='opacity 1.5s '+EASE+',transform 1.6s '+EASE+',border-radius 1.6s '+EASE;
        media.style.opacity='1';
        media.style.transform='translateY(0%) scale('+SETTLE.scale+')';
        media.style.borderRadius=SETTLE.radius+'px';
        if(video){
          video.style.transition='filter 1.6s '+EASE;
          video.style.filter='brightness(1)';
          setTimeout(function(){try{video.style.filter='';video.style.transition='';}catch(e){}},1800);
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
      function removeOverlay(){
        showNav();
        document.documentElement.style.overflow='';
        ov.style.opacity='0';
        setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},850);
      }
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
          if(tx.textContent.length!==n&&!flags['wordmode'])tx.textContent=text.slice(0,n);
        }else if(t<T_LINE_HOLD){
          if(!flags['wordmode']&&tx.textContent!==text)tx.textContent=text;
        }else if(t<T_COLLAPSE){
          once('wordmode',clearTyped);
          showCloudUpTo(t);
          for(var i=FAMILY.length-1;i>=0;i--){if(t>=famStarts[i]){showFamily(i);break;}}
        }else if(t<T_HUMAN){
          once('collapse',collapse);
        }else if(t<T_EXIT){
          once('collapse',collapse);
          once('human',mountHuman);
          if(preSpan&&t>=T_PREFIX){
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
        /* only genuine user intent skips: sustained scroll, real wheel delta, or touch drag */
        if(e&&e.type==='scroll'&&window.pageYOffset<=40)return;
        if(e&&e.type==='wheel'&&Math.abs(e.deltaY||0)<=4)return;
        window.removeEventListener('wheel',skip);
        window.removeEventListener('touchmove',skip);
        window.removeEventListener('scroll',skip);
        if(!introDone)finish();
      };
      /* arm after load turbulence settles */
      setTimeout(function(){
        window.addEventListener('wheel',skip,{passive:true});
        window.addEventListener('touchmove',skip,{passive:true});
        window.addEventListener('scroll',skip,{passive:true});
      },700);
    }catch(e){introDone=true;try{if(typeof ov!=='undefined'&&ov&&ov.parentNode)ov.parentNode.removeChild(ov);document.documentElement.style.overflow='';media.style.opacity='';media.style.transform='';if(video)video.style.filter='';h1.style.opacity='';h1.style.transform='';}catch(e2){}showNav();}
  }

  /* ---------- scrollZoom (desktop only — phones keep the rounded frame) ---------- */
  var zoomDone=false;
  if(CFG.scrollZoom&&media&&!reduced&&CFG.heroIntro&&hero&&h1&&window.innerWidth>=768){
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
        if(zoomDone||!introDone||!flags['video']||Date.now()-settleT<1650)return;
        var p=Math.min(1,Math.max(0,window.pageYOffset/430));
        if(p>maxP){maxP=p;zoomPaint(maxP);}
      },{passive:true});
    }catch(e){}
  }

  /* ---------- reveals v3 ---------- */
  if(CFG.reveals&&!reduced&&'IntersectionObserver' in window){
    try{
      var lite=window.innerWidth<768;
      var css=document.createElement('style');
      css.textContent=
        '.thx-rvH{opacity:0;transform:translateY(46px);'+(lite?'':'clip-path:inset(0 0 58% 0);')+'transition:opacity 1.1s '+EASE+',transform 1.15s '+EASE+(lite?'':',clip-path 1.15s '+EASE)+'}'+
        '.thx-rvH.thx-on{opacity:1;transform:none;'+(lite?'':'clip-path:inset(0 0 0% 0);')+'}'+
        '.thx-rvC{opacity:0;transform:translateY(34px);transition:opacity .95s '+EASE+',transform 1s '+EASE+'}'+
        '.thx-rvC.thx-on{opacity:1;transform:none}'+
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
          if(el.closest('.site-navbar,.thx-nav')||el.closest('footer')||el.closest('.footer')||el.closest('.hero'))return false;
          var r=el.getBoundingClientRect();
          if(r.height<8)return false;
          return r.top>vh*0.9;
        }).slice(0,16);
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
