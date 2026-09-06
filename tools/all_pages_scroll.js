// Every page, desktop + phone: a scripted scroll down and up with the ink state logged every 50 ms. Reports per page: group flips,
// flips within 400 ms of the previous flip of the same group (jitter), halo toggles, halo-on share, page errors, nav version.
// usage: ORIGIN=https://nhq.webflow.io SHARD=0/3 node all_pages_scroll.js out.json   (LOCAL=1 routes the working-tree nav in)
const { chromium, devices } = require('playwright');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const O = process.env.ORIGIN || 'https://nhq.webflow.io'; const OUT = process.argv[2] || 'r4/all_pages.json';
const ALL = fs.readFileSync('/Users/x/CLAUDE/liquidgl-theodyx/sitemap-urls.txt', 'utf8').trim().split('\n').map(u => u.replace('https://www.theodyx.com', '')).map(p => p || '/');
const [si, sn] = (process.env.SHARD || '0/1').split('/').map(Number); const PATHS = ALL.filter((_, i) => i % sn === si);
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] }); const rows = [];
  for (const p of PATHS) for (const mobile of [false, true]) {
    const ctx = await browser.newContext(mobile ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 }, userAgent: UA }); const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
    if (process.env.LOCAL) { const ROOT = '/Users/x/CLAUDE/liquidgl-theodyx/'; await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav.js', 'utf8') })); await page.route(u => /theodyx\.com|webflow\.io/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text(); html = html.replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\s+integrity="[^"]*"/, '$1'); route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); }); }
    const row = { p, dev: mobile ? 'phone' : 'desktop' };
    try {
      const resp = await page.goto(O + p, { waitUntil: 'load', timeout: 60000 }); row.status = resp && resp.status(); await sleep(2200);
      if (process.env.LOCAL) await page.addStyleTag({ content: fs.readFileSync('/Users/x/CLAUDE/liquidgl-theodyx/theodyx-nav.css', 'utf8') });
      if (p === '/scouting') { try { await page.click('#sc-gate-safety-ok', { timeout: 2000 }); await sleep(500); } catch (e) {} try { await page.fill('#sc-gate-m', '06'); await page.fill('#sc-gate-d', '15'); await page.fill('#sc-gate-y', '2000'); await page.click('#sc-gate-age-go'); } catch (e) {} await sleep(800); }
      const H = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
      const l = await page.evaluate(async (H) => { const N = window.__thxNav; if (!N) return null; const log = []; const rec = () => { const n = document.getElementById('thx-nav'); const m = n.querySelector('.thx-nav-menu'); const i = N.ink(); log.push([Math.round(performance.now()), Math.round(scrollY), i.logo, i.menu, i.burger, m ? (m.getAttribute('data-split') || '-') : '-', n.querySelector('.thx-nav-logo').getAttribute('data-split') || '-']); };
        const iv = setInterval(rec, 50); const step = Math.max(12, Math.round(H / 260)); for (let y = 0; y <= H; y += step) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); } await new Promise(r => setTimeout(r, 800)); for (let y = H; y >= 0; y -= step * 2) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); } await new Promise(r => setTimeout(r, 800)); clearInterval(iv); return { v: N.v, memo: N.ink().memo, tick: N.tickMs(), log }; }, H);
      if (!l) { row.err = 'no nav'; } else {
        const lastT = {}, lastI = {}; let quick = 0, flips = 0, splitTog = 0, lastS = null, splitOn = 0;
        for (const e of l.log) { const v = { logo: e[2], menu: e[3], burger: e[4] }; for (const g in v) { if (lastI[g] !== undefined && v[g] !== lastI[g]) { const dt = lastT[g] == null ? 9999 : e[0] - lastT[g]; flips++; if (dt < 400) quick++; lastT[g] = e[0]; } lastI[g] = v[g]; } const s = e[5] + e[6]; if (lastS !== null && s !== lastS) splitTog++; lastS = s; if (e[5] === 'true' || e[6] === 'true') splitOn++; }
        Object.assign(row, { v: l.v, H, samples: l.log.length, flips, quick, splitTog, splitOn: Math.round(100 * splitOn / Math.max(1, l.log.length)), memo: l.memo, tick: +l.tick.toFixed(1) });
      }
    } catch (e) { row.err = String(e.message || e).slice(0, 120); }
    row.errors = errors.slice(0, 3); rows.push(row); console.log(JSON.stringify(row)); await ctx.close();
  }
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 1)); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
