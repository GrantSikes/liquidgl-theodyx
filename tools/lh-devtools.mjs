// Lighthouse with REAL applied throttling (throttlingMethod: 'devtools') instead of Lantern simulation.
import fs from 'node:fs'; import path from 'node:path';
import puppeteer from 'puppeteer-core'; import lighthouse from 'lighthouse';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT=process.env.LH_OUT; fs.mkdirSync(OUT,{recursive:true});
const BASE=process.env.LH_BASE||'https://www.theodyx.com';
const PAGES=(process.env.LH_PAGES||'/').split(',');
const RUNS=+(process.env.RUNS||2);
const slug=p=>p==='/'?'home':p.replace(/^\//,'').replace(/\//g,'__');
const cfg={extends:'lighthouse:default',settings:{formFactor:'mobile',
  screenEmulation:{mobile:true,width:412,height:823,deviceScaleFactor:1.75,disabled:false},
  emulatedUserAgentString:'Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  throttlingMethod:'devtools',
  throttling:{rttMs:150,throughputKbps:1638.4,requestLatencyMs:150*3.75,downloadThroughputKbps:1638.4*0.9,uploadThroughputKbps:675*0.9,cpuSlowdownMultiplier:4}}};
for(const p of PAGES){ for(let r=1;r<=RUNS;r++){
  const id=`${slug(p)}-dt-${r}`;
  const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',
    args:['--no-first-run','--no-default-browser-check','--disable-blink-features=AutomationControlled'],
    userDataDir:path.join(OUT,'.p-'+id)});
  let lhr=null,err=null;
  try{const page=await browser.newPage();
    const rr=await lighthouse(BASE+p,{output:'json',logLevel:'error'},cfg,page);
    lhr=rr.lhr; fs.writeFileSync(path.join(OUT,id+'.json'),rr.report);
  }catch(e){err=String(e&&e.message||e);}
  await browser.close();
  const a=k=>lhr?.audits?.[k]?.numericValue;
  const lb=lhr?.audits?.['lcp-breakdown-insight']?.details?.items||[];
  let node=null,ph={};
  for(const it of lb){ if(it.type==='node') node=it.selector;
    if(it.type==='table') for(const x of it.items||[]) ph[x.subpart]=Math.round(x.duration); }
  console.log(JSON.stringify({id,url:BASE+p,perf:lhr?.categories?.performance?.score,
    fcp:Math.round(a('first-contentful-paint')||0),lcp:Math.round(a('largest-contentful-paint')||0),
    si:Math.round(a('speed-index')||0),tbt:Math.round(a('total-blocking-time')||0),
    cls:+(a('cumulative-layout-shift')||0).toFixed(4),ttfb:Math.round(a('server-response-time')||0),ph,node,err}));
}}
