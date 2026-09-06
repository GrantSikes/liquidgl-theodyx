/*! theodyx-policies v3.3.0 — /policies/* in-page contents rail.
    3.3.0 (C-08): the active-item marker no longer overlaps the label below 480px (see the block at the end of this file).
    3.2.0 (Phase 9 accessibility): KB-08 activating a contents link moves focus to the section it scrolled to;
    SEM-25 "Contents" is a real heading that names the aside, and the 13 links are a list. */
(function(){
if(!/^\/policies\//.test(location.pathname))return;
/* SEM-25: the label was a bare <div> text node, the aside was unnamed and the links were bare <a> children of a <div> */
function structure(root){
 var side=root.querySelector('.polx-side'); if(!side)return;
 var t=side.querySelector('.polx-side-title');
 if(t&&t.tagName!=='H2'){var h=document.createElement('h2');for(var i=0;i<t.attributes.length;i++)h.setAttribute(t.attributes[i].name,t.attributes[i].value);
  var cs=getComputedStyle(t);h.style.font=cs.font;h.style.margin=cs.margin;h.style.letterSpacing=cs.letterSpacing;h.style.textTransform=cs.textTransform;/* the base h2 rules carry a heading line-height; keep the label pixel-identical */
  while(t.firstChild)h.appendChild(t.firstChild);t.parentNode.replaceChild(h,t);t=h;}
 if(t){if(!t.id)t.id='polx-toc-h';if(!side.getAttribute('aria-labelledby')&&!side.getAttribute('aria-label'))side.setAttribute('aria-labelledby',t.id);}
 var nav=side.querySelector('.polx-side-list')||side;
 if(nav.querySelector('ul'))return;
 var ls=[].slice.call(nav.querySelectorAll('.polx-side-link')); if(!ls.length)return;
 var holder=ls[0].parentNode;
 var ul=document.createElement('ul');ul.className='polx-side-ul';ul.style.cssText='list-style:none;margin:0;padding:0';
 ls.forEach(function(a){var li=document.createElement('li');li.style.cssText='list-style:none;margin:0;padding:0';li.appendChild(a);ul.appendChild(li);});
 holder.appendChild(ul);
}
function init(){
 var root=document.querySelector('.polx-root'); if(!root)return;
 try{structure(root);}catch(e){}
 var links=[].slice.call(root.querySelectorAll('.polx-side-link'));
 var anchors=links.map(function(a){var id=(a.getAttribute('href')||'').replace(/^.*#/,'');return document.getElementById(id);}).filter(Boolean);
 if(!anchors.length)return;
 var NAV=112;
 function setActive(id){for(var i=0;i<links.length;i++){links[i].classList.toggle('is-active',(links[i].getAttribute('href')||'').replace(/^.*#/,'')===id);}}
 root.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('.polx-side-link'):null; if(!a)return;
  var id=(a.getAttribute('href')||'').replace(/^.*#/,''),sec=document.getElementById(id); if(!sec)return;
  e.preventDefault();e.stopPropagation();
  window.scrollTo(0,Math.max(0,window.pageYOffset+sec.getBoundingClientRect().top-NAV));
  setActive(id);
  /* KB-08: the handler cancels the fragment navigation, so nothing moves focus — put it on the section the user chose */
  if(!sec.hasAttribute('tabindex'))sec.setAttribute('tabindex','-1');
  try{sec.focus({preventScroll:true});}catch(err){try{sec.focus();}catch(e2){}}
  if(history.replaceState)history.replaceState(null,'',location.pathname+'#'+id);
 },true);
 var side=root.querySelector('.polx-side'),ticking=false;
 function spy(){ticking=false;
  var cur=anchors[0],limit=NAV+14;
  for(var i=0;i<anchors.length;i++){if(anchors[i].getBoundingClientRect().top<=limit)cur=anchors[i];else break;}
  if(cur)setActive(cur.id);
  var act=root.querySelector('.polx-side-link.is-active');
  if(act&&side&&side.scrollHeight>side.clientHeight+2){var ot=act.offsetTop,oh=act.offsetHeight;
   if(ot<side.scrollTop)side.scrollTop=Math.max(0,ot-8);
   else if(ot+oh>side.scrollTop+side.clientHeight)side.scrollTop=ot+oh-side.clientHeight+8;}
 }
 function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(spy);}}
 addEventListener('scroll',onScroll,{passive:true});
 addEventListener('resize',onScroll,{passive:true});
 spy();
 if(location.hash){var el=document.getElementById(location.hash.slice(1));
  if(el)setTimeout(function(){window.scrollTo(0,Math.max(0,window.pageYOffset+el.getBoundingClientRect().top-NAV));spy();},80);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

;(function(){/* Phase 7 (thx-policies-p7): name the in-page contents landmark and mark the effective date up as <time> */try{var run=function(){document.querySelectorAll('nav.polx-side-list:not([aria-label]),.polx-side nav:not([aria-label])').forEach(function(n){n.setAttribute('aria-label','On this page');});var MO={january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,hits=[];while((n=w.nextNode())){if(/Effective(?: date)?:?\s+[A-Z][a-z]+ \d{1,2},\s*\d{4}/.test(n.nodeValue)&&!n.parentElement.closest('time')&&!n.parentElement.querySelector('time'))hits.push(n);}hits.forEach(function(n){var m=n.nodeValue.match(/([A-Z][a-z]+) (\d{1,2}),\s*(\d{4})/);if(!m||!MO[m[1].toLowerCase()])return;var iso=m[3]+'-'+String(MO[m[1].toLowerCase()]).padStart(2,'0')+'-'+String(m[2]).padStart(2,'0');var i=n.nodeValue.indexOf(m[0]);var t=document.createElement('time');t.setAttribute('datetime',iso);t.textContent=m[0];var after=n.splitText(i);after.nodeValue=after.nodeValue.slice(m[0].length);n.parentNode.insertBefore(t,after);});};if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);setTimeout(run,1500);}catch(e){}})();

/* ---------- C-08: the contents marker must not sit on top of the label on phones ----------
   The active contents item is drawn with box-shadow:inset 3px 0 0 currentColor, i.e. a bar
   painted inside the link's own left edge. Every breakpoint reserves a gutter for it -
   14px at >=992px, 10px from 480px up - except Webflow's <=479px one, which resets the
   link to padding:6px 0. With no left padding the 3px bar lands on the glyphs, so on an
   iPhone the white bar sat across the "1" of "1. Personal Data we collect".
   Restore the 480px breakpoint's own 10px gutter below 480px. The rail is inside an
   overflow:auto column, so the marker has to stay inside the link box rather than being
   offset out of it. Nothing at 480px and up changes. */
(function(){try{
if(!/^\/policies\//.test(location.pathname))return;
if(document.getElementById('thx-polx-marker-gutter'))return;
var st=document.createElement('style');st.id='thx-polx-marker-gutter';
st.textContent='@media (max-width:479px){html body a.polx-side-link{padding-left:10px!important}}';
(document.head||document.documentElement).appendChild(st);
}catch(e){}})();
