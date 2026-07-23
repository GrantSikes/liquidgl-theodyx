(function(){
if(!/^\/policies\//.test(location.pathname))return;
function init(){
 var root=document.querySelector('.polx-root'); if(!root)return;
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
