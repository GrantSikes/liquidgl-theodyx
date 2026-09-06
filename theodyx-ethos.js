/*! theodyx-ethos v1.3.0 - C-02: the article/ethos hero title now clears the nav pill on phones (see the block at the end of this file).
   1.2.0 - re-hosted from Webflow on 2026-09-05; source of truth is now this repo.
   Phase 11 motion: REVEAL-03/REVEAL-08 the .ethx-rvl scroll-reveal system and its 3 s /
   catch() safety nets are gone - article content is visible at once. RM-01 the .ethx-down
   jump and RM-02 the carousel glide() read prefers-reduced-motion live and jump instantly
   when it is set. Phase 9 accessibility pass below is unchanged. */
(function(){function q(s,r){return [].slice.call((r||document).querySelectorAll(s))}var RED=function(){return matchMedia('(prefers-reduced-motion: reduce)').matches};q('.ethx-vidsrc').forEach(function(c){var u=c.textContent.trim();var hero=c.classList.contains('ethx-vidsrc-hero');if(hero){var v=document.querySelector('video.ethx-media');if(v){if(u){v.src=u;v.muted=true;if(v.play){var p=v.play();if(p&&p.catch)p.catch(function(){})}}else if(v.parentNode){v.parentNode.removeChild(v)}}}else if(u){var w=c.closest('.ethx-vidwrap');if(w){var nv=document.createElement('video');nv.src=u;nv.controls=true;nv.style.width='100%';nv.style.display='block';nv.setAttribute('playsinline','');w.appendChild(nv)}}});var d=document.querySelector('.ethx-down');if(d){d.addEventListener('click',function(e){e.preventDefault();var o=document.querySelector('.ethx-over,.thx-read');if(o)o.scrollIntoView({behavior:RED()?'auto':'smooth'})});var hr=document.querySelector('.ethx-hero');var hf=function(){var hh=hr?hr.getBoundingClientRect().height:600;d.classList.toggle('ethx-down-off',pageYOffset>hh*0.35)};addEventListener('scroll',hf,{passive:true});hf()}function glide(car,to){if(RED()){car.scrollLeft=to;return}var prev=car.style.scrollSnapType;car.style.scrollSnapType='none';var from=car.scrollLeft,dd=to-from,t0=performance.now(),dur=500;function step(now){var p=Math.min(1,(now-t0)/dur);var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;car.scrollLeft=from+dd*e;if(p<1)requestAnimationFrame(step);else{car.scrollLeft=to;car.style.scrollSnapType=prev}}requestAnimationFrame(step)}q('.ethx-arrows').forEach(function(a){var car=a.nextElementSibling;if(!car||(' '+car.className+' ').indexOf(' ethx-car ')<0)return;var b=q('a',a);function st(){var s=car.querySelector('.ethx-slide');return s?s.getBoundingClientRect().width+16:car.clientWidth}function go(dir,e){e.preventDefault();car.dataset.thxStop='1';glide(car,Math.max(0,Math.min(car.scrollLeft+dir*st(),car.scrollWidth-car.clientWidth)))}if(b[0])b[0].addEventListener('click',function(e){go(-1,e)});if(b[1])b[1].addEventListener('click',function(e){go(1,e)})});/*thx-ethos-1.2.0-p11motion*/})();

/* ---------- Phase 9 accessibility pass (AXE-03, SEM-08, AXE-10, SEM-05a) ----------
   Runs on BOTH the Publications (/our-thinking/*) and Ethos (/index/*) templates,
   because this file is registered on both. Idempotent; theodyx-pubs-xp re-asserts
   the carousel + arrow attributes after it clones the arrow anchors. */
(function(){try{
var q=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

/* AXE-03: the scroll containers need a visible focus ring once they are tabbable. */
if(!document.getElementById('thx-ethx-a11y-css')){
  var st=document.createElement('style');st.id='thx-ethx-a11y-css';
  st.textContent='html body .ethx-car:focus-visible{outline:2px solid #000;outline-offset:3px}'
    +'html body .ethx-car:focus:not(:focus-visible){outline:none}';
  (document.body||document.documentElement).appendChild(st);
}

/* AXE-03: horizontally scrollable carousels are keyboard reachable and named. */
q('.ethx-car').forEach(function(car){
  var n=q('.ethx-slide',car).filter(function(s){return getComputedStyle(s).display!=='none'}).length;
  if(!car.hasAttribute('tabindex'))car.setAttribute('tabindex','0');
  car.setAttribute('role','group');
  car.setAttribute('aria-label','Image carousel, '+n+' slide'+(n===1?'':'s'));
});

/* SEM-08 / AXE-10: glyph-only controls get real names, and the glyph itself is
   wrapped in an aria-hidden span so the label is the only accessible name. */
var glyph=function(el){
  if(el.querySelector('[aria-hidden="true"]'))return;
  var t=(el.textContent||'').trim();if(!t)return;
  var sp=document.createElement('span');sp.setAttribute('aria-hidden','true');sp.textContent=t;
  el.textContent='';el.appendChild(sp);
};
q('.ethx-arrows').forEach(function(a){
  var b=q('a,button',a);
  b.forEach(function(el,i){
    var back=((el.textContent||'').indexOf('\u2190')>-1)||(i===0&&b.length>1);
    el.setAttribute('aria-label',back?'Previous slide':'Next slide');
    glyph(el);
  });
});
q('.ethx-down').forEach(function(d){d.setAttribute('aria-label','Skip to the article');glyph(d)});

/* SEM-05a: the full-bleed hero/divider video is decorative - the sibling
   img.ethx-media carries the alt text - so keep it out of the AT tree.
   Scoped to videos with no controls, which never includes the inline
   .ethx-vidwrap player this file builds above. */
q('video.ethx-media').forEach(function(v){if(!v.hasAttribute('controls'))v.setAttribute('aria-hidden','true')});
}catch(e){}})();

/* ---------- C-02: the hero title must clear the fixed nav pill on phones ----------
   The Webflow template embed sizes the hero at 72svh on touch (and <=767px) with
   overflow:hidden, and lays .ethx-heroinner out as position:absolute; inset:0 with
   justify-content:flex-end and padding-top:40px. Absolute inner + fixed hero height
   means the hero can never grow, so as soon as the H1 + dek + jump arrow are taller
   than the hero box, flex-end overflows the START edge: the H1 climbs to a negative
   top and interleaves with the nav wordmark (measured -139px at 320x568, -7px at
   375x667, +10px at 767x700). 40px of top padding is below the pill's 64px bottom
   edge anyway, so even the non-overflowing widths had no guaranteed clearance.

   Fix, phones only: put the inner back in flow and bottom-align it from the hero
   itself (flex column + justify-content:flex-end), so the look is unchanged while
   the hero is free to grow past its min-height instead of clipping; and floor the
   inner's top padding at nav-bottom + 16px = --thx-nav-top + --thx-nav-h + 16px.
   min-height mirrors whatever the embed's height rule resolves to at that width
   (72svh on touch and <=767px, 100svh for a 768-899px window), so nothing moves
   where the content already fitted. Desktop (>=900px, fine pointer) is untouched. */
(function(){try{
if(document.getElementById('thx-ethx-heroclear'))return;
if(!document.querySelector('.ethx-heroinner'))return;
var BASE='html body .ethx-hero.ethx-hero{height:auto!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important}'
 +'html body .ethx-heroinner{position:relative!important;inset:auto!important;'
 +'padding-top:calc(var(--thx-nav-top,12px) + var(--thx-nav-h,52px) + 16px)!important}'
 /* the embed opens the hero block with a 200px top margin on the H1. In the old absolute
    box that margin was pure overflow - flex-end simply pushed it off the top edge - but in
    flow it would add 200px of real height and drag the whole hero down. The padding above
    is the clearance now, so the leading margin goes. Everything else (the embed's -42px
    bottom margin below 480px included) is left alone, which reproduces the current
    geometry to the pixel on every width where the content already fitted. */
 +'html body .ethx-heroinner > :first-child{margin-top:0!important}';
var st=document.createElement('style');st.id='thx-ethx-heroclear';
st.textContent=
  '@media (max-width:899px){'+BASE+'html body .ethx-hero.ethx-hero{min-height:100svh}'
   +'html.xp-touch body .ethx-hero.ethx-hero{min-height:72svh}}'
 +'@media (max-width:767px){html body .ethx-hero.ethx-hero{min-height:72svh}}'
 +'@media (hover:none) and (pointer:coarse){'+BASE+'html body .ethx-hero.ethx-hero{min-height:72svh}}';
(document.body||document.documentElement).appendChild(st);
}catch(e){}})();
