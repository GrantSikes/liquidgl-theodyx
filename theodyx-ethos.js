/*! theodyx-ethos v1.2.0 - re-hosted from Webflow on 2026-09-05; source of truth is now this repo.
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
