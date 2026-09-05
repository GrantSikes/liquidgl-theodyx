// Reproduces the dwell veto: flip to light at the footer, then jump to a white section within 600 ms; read the ink at +300 ms and +1200 ms.
const { chromium } = require('playwright'); const fs = require('fs');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
  const out = {};
  for (const [label, file] of [['4.9.3', '/tmp/nav493.js'], ['4.9.4', '/Users/x/CLAUDE/liquidgl-theodyx/theodyx-nav.js']]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA }); const page = await ctx.newPage();
    const body = fs.readFileSync(file, 'utf8'); await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body }));
    await page.goto('https://nhq.webflow.io/', { waitUntil: 'load' }); await sleep(2500);
    const res = await page.evaluate(async () => { const api = window.__thxNav, nav = document.getElementById('thx-nav'); const rd = () => nav.getAttribute('data-ink'); window.scrollTo(0, document.documentElement.scrollHeight); let t = 0; while (rd() !== 'light' && t < 3000) { await new Promise(r => setTimeout(r, 50)); t += 50; } const tFlip = performance.now(); if (rd() !== 'light') return { fail: 'never went light at the footer' }; await new Promise(r => setTimeout(r, 120)); window.scrollTo(0, 1200); await new Promise(r => setTimeout(r, 300)); const at300 = rd(); await new Promise(r => setTimeout(r, 900)); const at1200 = rd(); await new Promise(r => setTimeout(r, 1500)); const at2700 = rd(); return { version: api.v, tFlipToJump: 120, at300, at1200, at2700 }; });
    out[label] = res; await ctx.close();
  }
  await browser.close(); console.log(JSON.stringify(out));
})();
