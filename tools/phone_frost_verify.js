// 4.14.0 phone frost: local nav.js / nav.css / nav-gl.js routed into production pages on an iPhone (Chromium + WebKit engines).
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms)); const ROOT = '/Users/x/CLAUDE/liquidgl-theodyx/';
const O = process.env.ORIGIN || 'https://www.theodyx.com', LIVE = !!process.env.LIVE, OUT = process.env.OUT || 'r4/phone'; fs.mkdirSync(OUT, { recursive: true });
let pass = 0, fail = 0; const check = (n, ok, d) => { console.log((ok ? 'PASS ' : 'FAIL ') + n + (ok ? '' : '  ' + JSON.stringify(d).slice(0, 400))); ok ? pass++ : fail++; };
async function setup(page) {
  if (LIVE) return;
  await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav.js', 'utf8') }));
  await page.route(/theodyx-nav-gl\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav-gl.js', 'utf8') }));
  await page.route(u => /theodyx\.com|webflow\.io/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text();
    html = html.replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\s+integrity="[^"]*"/, '$1').replace(/s\.integrity = 'sha384-[^']*';\s*/, '');
    const css = fs.readFileSync(ROOT + 'theodyx-nav.css', 'utf8'); html = html.replace(/<style id="thx-nav-css">[\s\S]*?<\/style>/, '<style id="thx-nav-css">' + css.replace('"Google Sans Flex","Google Sans",system-ui', '"Google Sans Flex","Google Sans","Theodyx Sans Fallback",system-ui') + '</style>');
    route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); });
}
(async () => {
  const PAGES = [['/', 0], ['/clients', 560], ['/our-thinking/why-the-next-media-empires-will-be-built-by-one-person', 1400], ['/scouting', 300], ['/', 99999]];
  for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch({ headless: true, args: engineName === 'chromium' ? ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] : [] });
    for (const [p, y] of PAGES) {
      const ctx = await browser.newContext({ ...devices['iPhone 13'] }); const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
      await setup(page); await page.goto(O + p, { waitUntil: 'load' }); await sleep(2200);
      if (p === '/scouting') { try { await page.click('#sc-gate-safety-ok', { timeout: 2000 }); await sleep(400); await page.fill('#sc-gate-m', '06'); await page.fill('#sc-gate-d', '15'); await page.fill('#sc-gate-y', '2000'); await page.click('#sc-gate-age-go'); await sleep(800); } catch (e) {} }
      await page.evaluate(y => window.scrollTo(0, Math.min(y, document.documentElement.scrollHeight - innerHeight)), y); await sleep(900);
      const st = await page.evaluate(() => { const n = document.getElementById('thx-nav'); const g = n.querySelector('.thx-nav-glass'); const cs = getComputedStyle(g); const logo = n.querySelector('.thx-nav-logo'); const gl = n.querySelector('canvas.thx-nav-gl'); return { v: window.__thxNav && window.__thxNav.v, cls: n.className, bf: cs.backdropFilter || cs.webkitBackdropFilter, bg: cs.backgroundColor, vis: cs.visibility, ink: n.getAttribute('data-ink'), logoColor: getComputedStyle(logo).color, logoFilter: getComputedStyle(logo.querySelector('svg')).filter, gl: gl ? getComputedStyle(gl).display : 'none', glWhy: n.getAttribute('data-gl'), tint: getComputedStyle(n.querySelector('.thx-nav-tint') || g).display, split: logo.getAttribute('data-split'), memo: window.__thxNav && window.__thxNav.ink().memo }; });
      const tag = engineName + p.replace(/\W+/g, '_') + '_' + y;
      check(`${engineName} ${p} @${y}: plain frost (blur 18px), no lens class, no GL canvas, black ink, no halo, no sampling`, /^4\.14/.test(st.v || '') && /blur\(18px\)/.test(st.bf) && !/url\(/.test(st.bf) && !/is-refract|is-gl/.test(st.cls) && st.gl === 'none' && st.logoColor === 'rgb(0, 0, 0)' && st.logoFilter === 'none' && st.vis === 'visible' && st.tint === 'none' && st.split !== 'true' && (st.memo || 0) === 0 && errors.length === 0, { st, errors });
      await page.screenshot({ path: `${OUT}/${tag}.png`, clip: { x: 0, y: 0, width: 390, height: 120 } });
      await ctx.close();
    }
    await browser.close();
  }
  console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
