// frame-time measurement of a scripted scroll with the lens on vs off, in a GPU-enabled headless Chromium
const {chromium}=require('playwright');
const url=process.argv[2]||'https://nhq.webflow.io/';
(async()=>{
  const b=await chromium.launch({headless:true,args:['--enable-gpu','--use-angle=metal','--ignore-gpu-blocklist','--enable-gpu-rasterization','--enable-zero-copy']});
  for(const mode of ['lens','nolens']){
    const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'});
    const p=await ctx.newPage();
    if(mode==='nolens') await p.addInitScript(()=>{try{sessionStorage.setItem('thx-nav-norefract','1')}catch(e){}});
    await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(2500);
    const r=await p.evaluate(()=>new Promise(res=>{const o={frames:0,long:0,max:0,sum:0,vis:document.visibilityState,lens:window.__thxNav&&window.__thxNav.lens().on,gpu:(()=>{try{const c=document.createElement('canvas');const gl=c.getContext('webgl');const d=gl.getExtension('WEBGL_debug_renderer_info');return d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL).slice(0,50):'?'}catch(e){return 'none'}})()};let last=performance.now();const t0=last;const dur=3000;function step(t){const dt=t-last;last=t;o.frames++;o.sum+=dt;if(dt>34)o.long++;if(dt>o.max)o.max=dt;const q=(t-t0)/dur;window.scrollTo(0,Math.round(1400*(q<0.5?q*2:(1-q)*2)));if(t-t0<dur)requestAnimationFrame(step);else{o.avg=+(o.sum/o.frames).toFixed(1);o.max=+o.max.toFixed(1);o.tick=window.__thxNav.tickMs();res(o)}}requestAnimationFrame(step)}));
    console.log(mode,JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
