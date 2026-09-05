/*! theodyx-pubs-xp v1.4.1 — Publications reading-experience composer.
   Runs LAST on the Publications template (after articlefx/ethos/ethosx/r2media).
   (1) weaves the media bands into the reading flow: carousel 1 ~top-middle,
       divider at the article midpoint (splits the body into two sheets),
       carousel 2 ~middle-bottom; notes/disclaimer follow the second half.
   (2) carousel dots + arrows, share row (the magnetic CTA was removed in 1.4.1, INV-05). Enhancement-only: no CMS
       content is created here.
   Phase 11 motion: REVEAL-03/REVEAL-08 the .xp-rvl scroll-reveal system, its 3.5 s
   timer and its catch() safety net are gone - article blocks are visible at once;
   INV-03/ACT-08 the 5 s carousel autoplay, its progress ring and the pause plumbing
   that only served it are gone (arrows/dots/swipe/keyboard remain); INV-04 the
   divider scroll-parallax is gone; ACT-07 the dots carry a border + forced-colors
   block; every glide honours prefers-reduced-motion live.
   re-hosted from Webflow on 2026-09-05; source of truth is now this repo. */
(function(){
if(window.__thxXp)return;window.__thxXp=1;
var ready=function(f){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f):f()};
ready(function(){try{
var q=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var MOB=matchMedia('(max-width:767px)').matches||matchMedia('(pointer:coarse)').matches,RED=matchMedia('(prefers-reduced-motion: reduce)').matches;
var red=function(){return matchMedia('(prefers-reduced-motion: reduce)').matches};
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

/* ---------- 3. carousel system: dots + arrows, reader-driven (Phase 11) ----------
   INV-03 / ACT-08: the 5 s autoplay, its progress ring and the hover/wheel/touch
   pause plumbing that existed only to stop it are gone. The carousel moves for
   arrows, dots, swipe, native scroll-snap and the focusable container's arrow
   keys - nothing advances on its own, so it needs no pause control.
   ACT-07: the dots carry a 1px border and a forced-colors block so the current
   slide stays distinguishable when the fills are overridden, and the 9 px of ink
   now sits inside a 24x24 target (WCAG 2.5.8). */
try{
if(!document.getElementById('thx-xp-dots-css')){
  var dst=document.createElement('style');dst.id='thx-xp-dots-css';
  dst.textContent='html body .xp-dots{gap:0}'
    /* WCAG 2.5.8: the dot is 9px of ink inside a 24x24 target. */
    +'html body .xp-dots button{width:24px;height:24px;min-width:24px;min-height:24px;padding:0;border:0;background:none;display:inline-flex;align-items:center;justify-content:center;transform:none}'
    +'html body .xp-dots button::before{content:"";display:block;box-sizing:border-box;width:9px;height:9px;border-radius:50%;border:1px solid rgba(0,0,0,.55);background:rgba(0,0,0,.12);transition:transform .24s cubic-bezier(.22,1,.36,1),background-color .24s cubic-bezier(.22,1,.36,1)}'
    +'html body .xp-dots button.on{background:none;transform:none}'
    +'html body .xp-dots button.on::before{background:#000;border-color:#000;transform:scale(1.3)}'
    +'html body .xp-dots button:hover::before{transform:scale(1.25);background:rgba(0,0,0,.4)}'
    +'html body .xp-dots button.on:hover::before{transform:scale(1.4);background:#000}'
    +'html body .xp-dots button:active::before{transform:scale(.92)}'
    +'html body .xp-dots button.on:active::before{transform:scale(1.15)}'
    +'@media (forced-colors:active){html body .xp-dots button::before{forced-color-adjust:none;border:1px solid ButtonText;background:ButtonFace}'
    +'html body .xp-dots button.on::before{background:Highlight;border-color:Highlight}'
    +'html body .xp-dots button:hover::before{border-color:Highlight}}'
    +'@media (prefers-reduced-motion:reduce){html body .xp-dots button::before{transition:none}}';
  (document.body||document.documentElement).appendChild(dst);
}
q('.ethx-car').forEach(function(car){
  /* keeps any cached copy of the legacy ethosx autoplay a no-op */
  car.dataset.thxStop='1';
  var slides=q('.ethx-slide',car).filter(function(s){return getComputedStyle(s).display!=='none'});
  /* AXE-03: the scroll container is a named, keyboard-reachable group. */
  if(!car.hasAttribute('tabindex'))car.setAttribute('tabindex','0');
  car.setAttribute('role','group');
  car.setAttribute('aria-label','Image carousel, '+slides.length+' slide'+(slides.length===1?'':'s'));
  if(slides.length<2)return;
  var max=function(){return car.scrollWidth-car.clientWidth};
  var pts=function(){var r=car.getBoundingClientRect();return slides.map(function(el){var sr=el.getBoundingClientRect();return Math.max(0,Math.min(sr.left-r.left+car.scrollLeft-(car.clientWidth-sr.width)/2,max()))})};
  /* RM: an animated glide is motion; under reduced motion the carousel jumps. */
  var glide=function(to,dur){if(red()){car.scrollLeft=to;return}var prev=car.style.scrollSnapType;car.style.scrollSnapType='none';var from=car.scrollLeft,dd=to-from,ts=performance.now();(function step(now){var p=Math.min(1,((now||performance.now())-ts)/(dur||600));var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;car.scrollLeft=from+dd*e;if(p<1)requestAnimationFrame(step);else{car.scrollLeft=to;car.style.scrollSnapType=prev}})()};
  var idx=function(){var p=pts(),cur=car.scrollLeft,i=0,bd=1e9;p.forEach(function(x,k){var d=Math.abs(x-cur);if(d<bd){bd=d;i=k}});return i};
  /* dots */
  var dots=document.createElement('div');dots.className='xp-dots';
  slides.forEach(function(_,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(i+1));b.addEventListener('click',function(){glide(pts()[i],500)});dots.appendChild(b)});
  car.insertAdjacentElement('afterend',dots);
  var mark=function(){var i=idx();q('button',dots).forEach(function(b,k){b.classList.toggle('on',k===i)})};
  car.addEventListener('scroll',function(){requestAnimationFrame(mark)},{passive:true});mark();
  /* arrows: strip legacy listeners, glyph in a clipper span */
  var arr=car.previousElementSibling;
  if(arr&&(' '+arr.className+' ').indexOf(' ethx-arrows ')>-1){
    q('a',arr).forEach(function(a){
      var c=a.cloneNode(true);a.parentNode.replaceChild(c,a);
      var t=(c.textContent||'').trim();
      if(!c.querySelector('.xp-gl')&&t){var cl=document.createElement('span');cl.className='xp-clip';var sp=document.createElement('span');sp.className='xp-gl '+(t.indexOf('←')>-1?'xp-gl-l':'xp-gl-r');sp.textContent=t;sp.setAttribute('aria-hidden','true');cl.appendChild(sp);c.textContent='';c.appendChild(cl)}
      var dir=(t.indexOf('←')>-1)?-1:1;
      /* SEM-08 / AXE-10: the clone carries the accessible name, not the glyph. */
      c.setAttribute('aria-label',dir===1?'Next slide':'Previous slide');
      c.addEventListener('click',function(e){e.preventDefault();var p=pts(),i=idx(),n=Math.max(0,Math.min(p.length-1,i+dir));glide(p[n],600)});
    });
  }
});
}catch(e){}

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


/* ---------- 6. (removed) ---------- */
/* INV-05: the magnetic CTA (pointermove -> style.transform on .ethx-cta .thxo-btn) is gone. It was an
   uncomposited per-move style write on the page's primary conversion control and made the hit target
   drift under a slow pointer; the button's colour hover and the site-wide pressed state answer the pointer. */
/*thx-pubs-xp-1.4.1-p11motion*/
}catch(e){}});
})();
