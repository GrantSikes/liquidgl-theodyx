/*! theodyx-pubs-xp v1.3.1 — Publications reading-experience composer.
   Runs LAST on the Publications template (after articlefx/ethos/ethosx/r2media).
   (1) weaves the media bands into the reading flow: carousel 1 ~top-middle,
       divider at the article midpoint (splits the body into two sheets),
       carousel 2 ~middle-bottom; notes/disclaimer follow the second half.
   (2) reveal choreography, carousel dots, divider parallax, magnetic CTA,
       share row. All gated on prefers-reduced-motion; composer is desktop+mobile,
       motion is desktop-only. Enhancement-only: no CMS content is created here.
   re-hosted from Webflow on 2026-09-05; source of truth is now this repo. */
(function(){
if(window.__thxXp)return;window.__thxXp=1;
var ready=function(f){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f):f()};
ready(function(){try{
var q=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var MOB=matchMedia('(max-width:767px)').matches||matchMedia('(pointer:coarse)').matches,RED=matchMedia('(prefers-reduced-motion: reduce)').matches;
var body=document.querySelector('.thx-read-body');
var col=document.querySelector('.thx-read-col');
var read=document.querySelector('.thx-read');
if(!body||!col||!read)return;
var over2=document.querySelector('.ethx-over-b');
var divider=document.querySelector('.ethx-divider');
var vis=function(el){return !!el&&getComputedStyle(el).display!=='none'};
var band=function(nodes){var w=document.createElement('div');w.className='xp-band';nodes.forEach(function(n){w.appendChild(n)});return w};

/* ---------- 1. compose the flow ---------- */
try{
var qw1=q('.thx-read > .ethx-qwrap')[0];
var film=document.querySelector('.ethx-vidwrap');
var ar1=q('.thx-read > .ethx-arrows')[0];
var car1=document.querySelector('.ethx-car1');
var qw2=over2?over2.querySelector('.ethx-qwrap'):null;
var ar2=over2?over2.querySelector('.ethx-arrows'):null;
var car2=document.querySelector('.ethx-car2');
var bandA=[qw1,film,ar1,car1].filter(vis);
var bandB=[qw2,ar2,car2].filter(vis);
var hs=q('h2',body).filter(function(h){return h.textContent.trim()&&!h.classList.contains('thx-notes-h')});
/* index-based placement — deterministic, independent of lazy-image layout */
if(hs.length>=2){
  var si=Math.floor(hs.length/2);
  var split=vis(divider)&&over2?hs[si]:null;
  if(bandA.length){
    var ai=split?Math.max(1,Math.floor(si/2)):Math.max(1,Math.round(hs.length*0.33));
    var aAt=hs[Math.min(ai,hs.length-1)];
    if(split&&(aAt===split||hs.indexOf(aAt)>si))aAt=split;
    body.insertBefore(band(bandA),aAt||null);
  }
  if(split){
    var colB=document.createElement('article');colB.className='thx-read-col xp-colb';
    var bodyB=document.createElement('div');bodyB.className='thx-read-body xp-bodyb';colB.appendChild(bodyB);
    var mv=[],n=split;while(n){mv.push(n);n=n.nextSibling}
    mv.forEach(function(m){bodyB.appendChild(m)});
    over2.insertBefore(colB,over2.firstChild);
    if(bandB.length){
      var hsB=q('h2',bodyB).filter(function(h){return h.textContent.trim()}).slice(1);
      var bAt=hsB.length?hsB[Math.floor(hsB.length/2)]:null;
      if(bAt)bodyB.insertBefore(band(bandB),bAt);else bodyB.appendChild(band(bandB));
    }
    var tail=[document.querySelector('.art-notes'),document.querySelector('.art-signature'),document.querySelector('.art-disclaimer')];
    tail.forEach(function(t){if(t)colB.appendChild(t)});
  }else if(bandB.length){
    var bi=Math.max(1,Math.round(hs.length*0.7));
    var bAt2=hs[Math.min(bi,hs.length-1)];
    if(bAt2&&bAt2.previousSibling&&bAt2.previousSibling.classList&&bAt2.previousSibling.classList.contains('xp-band'))bAt2=null;
    if(bAt2)body.insertBefore(band(bandB),bAt2);else body.appendChild(band(bandB));
  }
}
}catch(e){}

/* ---------- 2. share row ---------- */
try{
var t=(document.querySelector('.ethx-h1')||{textContent:document.title}).textContent.trim();
var url=location.origin+location.pathname;
var sh=document.createElement('nav');sh.className='xp-share';sh.setAttribute('aria-label','Share');
var lab=document.createElement('p');lab.className='xp-share-h';lab.textContent='Share this piece';sh.appendChild(lab);
var row=document.createElement('div');row.className='xp-share-row';sh.appendChild(row);
var mk=function(txt,fn,href){var a=document.createElement('a');a.className='xp-pill';a.textContent=txt;if(href){a.href=href;a.target='_blank';a.rel='noopener'}else{a.href='#';a.addEventListener('click',fn)}row.appendChild(a);return a};
var cp=mk('Copy link',function(e){e.preventDefault();try{navigator.clipboard.writeText(url).then(function(){cp.textContent='Copied ✓';setTimeout(function(){cp.textContent='Copy link'},1800)})}catch(x){}});
if(navigator.share)mk('Share…',function(e){e.preventDefault();navigator.share({title:t,url:url}).catch(function(){})});
mk('X','', 'https://twitter.com/intent/tweet?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(t));
mk('LinkedIn','', 'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url));
var host=document.querySelector('.xp-colb')||col;
var before=host.querySelector('.art-notes')||host.querySelector('.art-disclaimer');
if(before)host.insertBefore(sh,before);else host.appendChild(sh);
}catch(e){}

/* ---------- 3. carousel system: dots + owned 5s autoplay + progress ring (OpenAI-style) ----------
   Retires the legacy ethosx autoplay (thxStop preset) and rebinds the arrows
   (cloned to strip old listeners). The next-arrow carries a conic progress
   ring that fills over 5s; hover pauses, arrows/dots reset the timer,
   horizontal wheel/swipe stops autoplay for good. */
try{
q('.ethx-car').forEach(function(car){
  car.dataset.thxStop='1';
  var slides=q('.ethx-slide',car).filter(function(s){return getComputedStyle(s).display!=='none'});
  /* AXE-03: the scroll container is a named, keyboard-reachable group. */
  if(!car.hasAttribute('tabindex'))car.setAttribute('tabindex','0');
  car.setAttribute('role','group');
  car.setAttribute('aria-label','Image carousel, '+slides.length+' slide'+(slides.length===1?'':'s'));
  if(slides.length<2)return;
  var DUR=5000,stopped=RED,paused=false,hold=0,t0=performance.now(),running=false,ring=null;
  var max=function(){return car.scrollWidth-car.clientWidth};
  var pts=function(){var r=car.getBoundingClientRect();return slides.map(function(el){var sr=el.getBoundingClientRect();return Math.max(0,Math.min(sr.left-r.left+car.scrollLeft-(car.clientWidth-sr.width)/2,max()))})};
  var glide=function(to,dur){var prev=car.style.scrollSnapType;car.style.scrollSnapType='none';var from=car.scrollLeft,dd=to-from,ts=performance.now();(function step(now){var p=Math.min(1,((now||performance.now())-ts)/(dur||600));var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;car.scrollLeft=from+dd*e;if(p<1)requestAnimationFrame(step);else{car.scrollLeft=to;car.style.scrollSnapType=prev}})()};
  var idx=function(){var p=pts(),cur=car.scrollLeft,i=0,bd=1e9;p.forEach(function(x,k){var d=Math.abs(x-cur);if(d<bd){bd=d;i=k}});return i};
  /* dots */
  var dots=document.createElement('div');dots.className='xp-dots';
  slides.forEach(function(_,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(i+1));b.addEventListener('click',function(){t0=performance.now();glide(pts()[i],500)});dots.appendChild(b)});
  car.insertAdjacentElement('afterend',dots);
  var mark=function(){var i=idx();q('button',dots).forEach(function(b,k){b.classList.toggle('on',k===i)})};
  car.addEventListener('scroll',function(){requestAnimationFrame(mark)},{passive:true});mark();
  /* arrows: strip legacy listeners, glyph in a clipper span, next-arrow gets the ring */
  var arr=car.previousElementSibling;
  if(arr&&(' '+arr.className+' ').indexOf(' ethx-arrows ')>-1){
    q('a',arr).forEach(function(a){
      var c=a.cloneNode(true);a.parentNode.replaceChild(c,a);
      var t=(c.textContent||'').trim();
      if(!c.querySelector('.xp-gl')&&t){var cl=document.createElement('span');cl.className='xp-clip';var sp=document.createElement('span');sp.className='xp-gl '+(t.indexOf('←')>-1?'xp-gl-l':'xp-gl-r');sp.textContent=t;sp.setAttribute('aria-hidden','true');cl.appendChild(sp);c.textContent='';c.appendChild(cl)}
      var dir=(t.indexOf('←')>-1)?-1:1;
      /* SEM-08 / AXE-10: the clone carries the accessible name, not the glyph. */
      c.setAttribute('aria-label',dir===1?'Next slide':'Previous slide');
      if(dir===1){c.classList.add('xp-next');ring=c}
      c.addEventListener('click',function(e){e.preventDefault();t0=performance.now();var p=pts(),i=idx(),n=Math.max(0,Math.min(p.length-1,i+dir));glide(p[n],600)});
    });
  }
  /* real intent stops autoplay for good */
  var stop=function(){if(stopped)return;stopped=true;if(ring){ring.classList.add('xp-ringoff');ring.style.setProperty('--xp-p','0deg')}};
  car.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)>Math.abs(e.deltaY))stop()},{passive:true});
  var tx=0,ty=0;
  car.addEventListener('touchstart',function(e){var tt=e.touches[0];tx=tt.clientX;ty=tt.clientY},{passive:true});
  car.addEventListener('touchmove',function(e){var tt=e.touches[0];if(Math.abs(tt.clientX-tx)>Math.abs(tt.clientY-ty)+4)stop()},{passive:true});
  car.addEventListener('mouseenter',function(){if(!paused){paused=true;hold=performance.now()-t0}});
  car.addEventListener('mouseleave',function(){if(paused){paused=false;t0=performance.now()-hold}});
  /* rAF loop, viewport-gated */
  var loop=function(now){
    if(!running||stopped)return;
    if(!paused){
      var el2=now-t0;
      if(el2>DUR*2){t0=now}
      else if(el2>=DUR){var p=pts(),i=idx(),n=(i+1>=p.length||p[i]>=max()-4)?0:i+1;glide(p[n],700);t0=now;if(ring)ring.style.setProperty('--xp-p','0deg')}
      else if(ring)ring.style.setProperty('--xp-p',Math.round(el2/DUR*360)+'deg');
    }
    requestAnimationFrame(loop);
  };
  if(!stopped){
    var vio=new IntersectionObserver(function(es){es.forEach(function(o){if(o.isIntersecting){if(!running){running=true;t0=performance.now();requestAnimationFrame(loop)}}else{running=false}})},{threshold:0.2});
    vio.observe(car);
  }
});
}catch(e){}

/* ---------- 4. reveal choreography (desktop, motion-ok) ---------- */
if(!MOB&&!RED){try{
var targets=[];
q('.thx-read-body > h2,.thx-read-body > h3,.thx-read-body > figure,.thx-read-body > blockquote,.thx-toc,#thxartkt,.art-notes,.xp-share').forEach(function(el){targets.push(el)});
q('.xp-band').forEach(function(b){if(!b.querySelector('.ethx-rvl'))targets.push(b)});
targets.forEach(function(el){el.classList.add('xp-rvl')});
var io=new IntersectionObserver(function(es){es.forEach(function(o){if(o.isIntersecting){var el=o.target;el.classList.add('xp-in');io.unobserve(el);setTimeout(function(){el.classList.remove('xp-rvl','xp-in')},900)}})},{threshold:0.06,rootMargin:'0px 0px -4% 0px'});
targets.forEach(function(el){io.observe(el)});
setTimeout(function(){q('.xp-rvl').forEach(function(el){el.classList.add('xp-in')})},3500);
}catch(e){q('.xp-rvl').forEach(function(el){el.classList.add('xp-in')})}}

/* ---------- 5. divider parallax ---------- */
if(!MOB&&!RED){try{
var dimg=divider?divider.querySelector('img'):null;
if(dimg&&vis(divider)){var tick=false;
var par=function(){tick=false;var r=divider.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var p=Math.max(0,Math.min(1,1-(r.top+r.height/2)/(innerHeight||1)));dimg.style.transform='scale('+(1.1-0.1*p).toFixed(4)+') translateZ(0)'};
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(par)}},{passive:true});par()}
}catch(e){}}

/* ---------- 7. rail auto-hide over full-bleed media ----------
   The divider is sticky (its rect pins forever), so its zone is the EXPOSED
   gap between sheet 1's bottom edge and sheet 2's top edge, not its own rect. */
try{
var bandZones=q('.xp-band');
var hasDiv=divider&&vis(divider)&&over2;
if(bandZones.length||hasDiv){var rtick=false;
var railChk=function(){rtick=false;var nav=document.querySelector('.ethx-railnav');if(!nav)return;var nr=nav.getBoundingClientRect();if(!nr.height){nr={top:innerHeight*0.3,bottom:innerHeight*0.7}}
var over=bandZones.some(function(z){var r=z.getBoundingClientRect();return r.top<nr.bottom&&r.bottom>nr.top});
if(!over&&hasDiv){var gt=read.getBoundingClientRect().bottom,gb=over2.getBoundingClientRect().top;if(gb>gt&&gt<nr.bottom&&gb>nr.top)over=true}
nav.classList.toggle('xp-railoff',over)};
addEventListener('scroll',function(){if(!rtick){rtick=true;requestAnimationFrame(railChk)}},{passive:true});setTimeout(railChk,600)}
}catch(e){}


/* ---------- 6. magnetic CTA ---------- */
if(!MOB&&!RED){try{
q('.ethx-cta .thxo-btn').forEach(function(b){
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();var dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;b.style.transform='translate('+(dx*8).toFixed(1)+'px,'+(dy*6).toFixed(1)+'px)'});
  b.addEventListener('pointerleave',function(){b.style.transform=''});
});
}catch(e){}}
/*thx-pubs-xp-1.3.2-a11y*/
}catch(e){}});
})();
