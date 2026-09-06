// nav 4.13.0 flow: immediate flips, look-ahead memo, strict halo, live-video hold, self-check. Production Home + working-tree nav (or LIVE=1 on ORIGIN).
const { chromium } = require('playwright');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms)); const ROOT = '/Users/x/CLAUDE/liquidgl-theodyx/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const O = process.env.ORIGIN || 'https://www.theodyx.com', LIVE = !!process.env.LIVE;
let pass = 0, fail = 0; const check = (n, ok, d) => { console.log((ok ? 'PASS ' : 'FAIL ') + n + (ok ? '' : '  ' + JSON.stringify(d).slice(0, 500))); ok ? pass++ : fail++; };
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA }); const page = await ctx.newPage();
  if (!LIVE) { await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav.js', 'utf8') }));
    await page.route(u => /theodyx\.com|webflow\.io/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text(); html = html.replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\s+integrity="[^"]*"/, '$1'); route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); }); }
  await page.goto(O + '/', { waitUntil: 'load' }); await sleep(2500);
  if (!LIVE) await page.addStyleTag({ content: fs.readFileSync(ROOT + 'theodyx-nav.css', 'utf8') });
  const v = await page.evaluate(() => ({ v: window.__thxNav.v, i: window.__thxNav.ink(), tick: window.__thxNav.tickMs() }));
  check('nav 4.13+ loaded: dwell 260, live hold 900', /^4\.1[3-9]/.test(v.v) && v.i.dwell === 260 && v.i.liveHold === 900, v);
  // live video at the top
  const liveTop = await page.evaluate(async () => { const vid = document.querySelector('video'); try { await vid.play(); } catch (e) {} await new Promise(r => setTimeout(r, 900)); window.__thxNav.reink(); return { live: window.__thxNav.ink().live, paused: vid.paused, rs: vid.readyState, memo: window.__thxNav.ink().memo }; });
  check('a playing hero video under the bar is read as live (polled, not memoised)', liveTop.live === true || liveTop.paused || liveTop.rs < 2, liveTop);
  // flips over the film for 4 s: count them
  const filmFlips = await page.evaluate(async () => { const N = window.__thxNav; let last = null, flips = 0; const t0 = performance.now(); while (performance.now() - t0 < 4000) { const k = N.ink().logo + N.ink().menu; if (last && k !== last) flips++; last = k; await new Promise(r => setTimeout(r, 50)); } return flips; });
  check('over 4 s of the playing film the ink flips at most 4 times (900 ms live hold)', filmFlips <= 4, { filmFlips });
  await page.evaluate(() => document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }));
  // static: settle on the white band, wait for the look-ahead
  const yWhite = await page.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3')].find(e => /Make something only you can/i.test(e.textContent)); return Math.round(h.getBoundingClientRect().top + window.scrollY - 200); });
  const yBlack = await page.evaluate(() => { const f = document.querySelector('footer'); return Math.round(f.getBoundingClientRect().top + window.scrollY + 300); });
  await page.evaluate(y => window.scrollTo(0, y), yWhite); await sleep(300); await page.evaluate(() => window.__thxNav.settle()); await sleep(1800);
  const memo = await page.evaluate(() => window.__thxNav.memo());
  check('after 1.8 s idle the look-ahead has solved the viewport around the bar (>= 60 positions, 8 px apart)', memo.size >= 60, { size: memo.size, first: memo.keys.slice(0, 5) });
  const a0 = await page.evaluate(() => window.__thxNav.ink()); check('settled on the white band: menu dark, no halo', a0.menu === 'dark' && !a0.split.menu, a0);
  // a scroll into a solved position: the ink is right in the very next frame
  const target = yWhite + 480; const has = memo.keys.includes(Math.round(target / 8) * 8);
  const same = await page.evaluate(async (y) => { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); const first = window.__thxNav.ink().menu + '/' + window.__thxNav.ink().logo; window.__thxNav.settle(); const settled = window.__thxNav.ink().menu + '/' + window.__thxNav.ink().logo; return { first, settled }; }, target);
  check('a scroll into a solved position shows the settled ink within two frames', same.first === same.settled, { has, same });
  // white -> black with no hold; and straight back
  await page.evaluate(y => window.scrollTo(0, y), yWhite); await sleep(600);
  const t0 = Date.now(); await page.evaluate(y => window.scrollTo(0, y), yBlack);
  let tFlip = -1; for (let i = 0; i < 20; i++) { await sleep(25); const k = await page.evaluate(() => window.__thxNav.ink().menu); if (k === 'light') { tFlip = Date.now() - t0; break; } }
  check('white -> black: the menu turns white within 250 ms', tFlip > 0 && tFlip < 250, { tFlip });
  const t1 = Date.now(); await page.evaluate(y => window.scrollTo(0, y), yWhite);
  let tBack = -1; for (let i = 0; i < 24; i++) { await sleep(25); const k = await page.evaluate(() => window.__thxNav.ink().menu); if (k === 'dark') { tBack = Date.now() - t1; break; } }
  check('straight back to white: dark again within 500 ms (no hold; 260 ms dwell at most)', tBack > 0 && tBack < 500, { tBack });
  // halo: strict - none on the uniform band, on over a true split
  await sleep(400); const h0 = await page.evaluate(() => document.querySelector('.thx-nav-menu').getAttribute('data-split'));
  await page.evaluate(() => { const d = document.createElement('div'); d.id = 'thx-test-half'; d.style.cssText = 'position:fixed;top:0;left:70%;right:0;height:140px;background:#000;z-index:899'; document.body.appendChild(d); }); await sleep(700);
  const h1 = await page.evaluate(() => ({ split: document.querySelector('.thx-nav-menu').getAttribute('data-split'), words: new Set([...document.querySelectorAll('.thx-nav-menu a')].map(a => getComputedStyle(a).color)).size, ink: window.__thxNav.ink().menu }));
  await page.evaluate(() => document.getElementById('thx-test-half').remove()); await sleep(700);
  const h2 = await page.evaluate(() => document.querySelector('.thx-nav-menu').getAttribute('data-split'));
  check('halo: off on the uniform band, on over a true split (one colour for all words), off again within 700 ms', h0 !== 'true' && h1.split === 'true' && h1.words === 1 && h2 !== 'true', { h0, h1, h2 });
  // self-check: a backdrop change with no scroll is answered within 3.5 s
  const t2 = Date.now(); await page.evaluate(() => { const d = document.createElement('div'); d.id = 'thx-test-black'; d.style.cssText = 'position:fixed;inset:0 0 auto 0;height:140px;background:#000;z-index:899'; document.body.appendChild(d); });
  let tTick = -1; for (let i = 0; i < 40; i++) { await sleep(100); const k = await page.evaluate(() => window.__thxNav.ink().menu); if (k === 'light') { tTick = Date.now() - t2; break; } }
  check('a backdrop change with no scroll is answered by the self-check within 3.5 s', tTick > 0 && tTick <= 3600, { tTick });
  await page.evaluate(() => document.getElementById('thx-test-black').remove());
  const tick = await page.evaluate(() => window.__thxNav.tickMs()); console.log('   solver tick ms', tick);
  console.log(`\n${pass} passed, ${fail} failed`); await browser.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
