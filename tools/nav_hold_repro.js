// nav 4.12.0: the 3 s hold, the 3 s tick and the split halo, on production Home with the local nav routed in.
const { chromium } = require('playwright');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms)); const ROOT = '/Users/x/CLAUDE/liquidgl-theodyx/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
let pass = 0, fail = 0; const check = (n, ok, d) => { console.log((ok ? 'PASS ' : 'FAIL ') + n + (ok ? '' : '  ' + JSON.stringify(d).slice(0, 500))); ok ? pass++ : fail++; };
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA }); const page = await ctx.newPage();
  await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav.js', 'utf8') }));
  await page.route(u => /theodyx\.com/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text(); html = html.replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\s+integrity="[^"]*"/, '$1'); route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); });
  await page.goto('https://www.theodyx.com/', { waitUntil: 'load' }); await sleep(2500);
  await page.addStyleTag({ content: fs.readFileSync(ROOT + 'theodyx-nav.css', 'utf8') });
  await page.evaluate(() => document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }));
  const v = await page.evaluate(() => ({ v: window.__thxNav.v, hold: window.__thxNav.ink().hold, words: [...document.querySelectorAll('.thx-nav-menu a')].filter(a => a.hasAttribute('data-ink')).length }));
  check('nav 4.12.0 loaded, hold = 3000, no per-word data-ink', v.v === '4.12.0' && v.hold === 3000 && v.words === 0, v);
  // find a white band and the black footer
  const yWhite = await page.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3')].find(e => /Make something only you can/i.test(e.textContent)); return Math.round(h.getBoundingClientRect().top + window.scrollY - 200); });
  const yBlack = await page.evaluate(() => { const f = document.querySelector('footer'); return Math.round(f.getBoundingClientRect().top + window.scrollY + 300); });
  await page.evaluate(y => window.scrollTo(0, y), yWhite); await sleep(3500); await page.evaluate(() => window.__thxNav.settle()); await sleep(200);
  const a0 = await page.evaluate(() => window.__thxNav.ink());
  check('settled on the white band: menu dark', a0.menu === 'dark', a0);
  // 1. a flip long after the last one is immediate-ish (< 1 s)
  const t0 = Date.now(); await page.evaluate(y => window.scrollTo(0, y), yBlack);
  let tFlip = -1; for (let i = 0; i < 40; i++) { await sleep(100); const k = await page.evaluate(() => window.__thxNav.ink().menu); if (k === 'light') { tFlip = Date.now() - t0; break; } }
  check('white -> black with no recent flip: the menu turns white within 1 s', tFlip > 0 && tFlip < 1000, { tFlip });
  // 2. straight back within the hold: the flip waits for the 3 s hold, then lands; the halo covers the wait
  const t1 = Date.now(); await page.evaluate(y => window.scrollTo(0, y), yWhite);
  let tBack = -1, haloSeen = false; for (let i = 0; i < 45; i++) { await sleep(100); const s = await page.evaluate(() => ({ menu: window.__thxNav.ink().menu, split: document.querySelector('.thx-nav-menu').getAttribute('data-split') })); if (s.menu === 'light' && s.split === 'true') haloSeen = true; if (s.menu === 'dark') { tBack = Date.now() - t1; break; } }
  check('black -> white inside the hold: the flip waits for the hold (lands between 1.5 s and 3.5 s after the first flip)', tBack > 0 && (tBack + tFlip) >= 2500 && (tBack + tFlip) <= 3600, { tFlip, tBack, haloSeen });
  check('while held on the wrong ink over the white band the menu wears the halo (data-split)', haloSeen, { haloSeen });
  const haloOff = await page.evaluate(() => document.querySelector('.thx-nav-menu').getAttribute('data-split'));
  check('once the ink is right on a uniform band the halo is off', haloOff !== 'true', { haloOff });
  // 3. the 3 s tick: no scroll, the backdrop changes under the bar -> the ink follows within ~3.5 s
  await sleep(3200);
  const t2 = Date.now(); await page.evaluate(() => { const d = document.createElement('div'); d.id = 'thx-test-black'; d.style.cssText = 'position:fixed;inset:0 0 auto 0;height:140px;background:#000;z-index:899'; document.body.appendChild(d); });
  let tTick = -1; for (let i = 0; i < 45; i++) { await sleep(100); const k = await page.evaluate(() => window.__thxNav.ink().menu); if (k === 'light') { tTick = Date.now() - t2; break; } }
  check('a backdrop change with no scroll is answered by the 3 s tick (within 3.5 s)', tTick > 0 && tTick <= 3600, { tTick });
  await page.evaluate(() => document.getElementById('thx-test-black').remove());
  // 4. split backdrop: half black under the menu -> one ink for all words + halo on
  await sleep(3300); await page.evaluate(() => { const d = document.createElement('div'); d.id = 'thx-test-half'; d.style.cssText = 'position:fixed;top:0;left:70%;right:0;height:140px;background:#000;z-index:899'; document.body.appendChild(d); }); await sleep(3600);
  const split = await page.evaluate(() => ({ ink: window.__thxNav.ink(), words: [...document.querySelectorAll('.thx-nav-menu a')].map(a => getComputedStyle(a).color), shadow: getComputedStyle(document.querySelector('.thx-nav-menu a')).textShadow, split: document.querySelector('.thx-nav-menu').getAttribute('data-split') }));
  check('a split backdrop: every menu word shares one colour and the halo is on', new Set(split.words).size === 1 && split.split === 'true' && split.shadow !== 'none', split);
  console.log(`\n${pass} passed, ${fail} failed`); await browser.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
