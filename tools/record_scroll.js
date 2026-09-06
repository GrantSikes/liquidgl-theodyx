// Record the nav during a slow scripted scroll (desktop + phone) and log the ink state every 50 ms.
const { chromium, devices } = require('playwright');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const O = process.env.ORIGIN || 'https://nhq.webflow.io'; const PATH = process.env.PATHNAME || '/'; const OUT = process.env.OUT || 'r4/rec';
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
  for (const mobile of [false, true]) {
    const tag = (mobile ? 'phone' : 'desktop') + PATH.replace(/\W+/g, '_');
    const ctx = await browser.newContext(mobile ? { ...devices['iPhone 13'], recordVideo: { dir: OUT, size: { width: 390, height: 844 } } } : { viewport: { width: 1440, height: 900 }, userAgent: UA, recordVideo: { dir: OUT, size: { width: 1440, height: 900 } } });
    const page = await ctx.newPage();
    if (process.env.LOCAL) { const ROOT = '/Users/x/CLAUDE/liquidgl-theodyx/'; await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav.js', 'utf8') })); await page.route(u => /theodyx\.com|webflow\.io/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text(); html = html.replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\s+integrity="[^"]*"/, '$1'); route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); }); }
    await page.goto(O + PATH, { waitUntil: 'load' }); await sleep(2500);
    if (process.env.LOCAL) await page.addStyleTag({ content: fs.readFileSync('/Users/x/CLAUDE/liquidgl-theodyx/theodyx-nav.css', 'utf8') });
    if (PATH === '/scouting') { try { await page.click('#sc-gate-safety-ok', { timeout: 1500 }); } catch (e) {} try { await page.fill('#sc-gate-m', '06'); await page.fill('#sc-gate-d', '15'); await page.fill('#sc-gate-y', '2000'); await page.click('#sc-gate-age-go'); } catch (e) {} await sleep(800); }
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const log = []; const t0 = Date.now();
    // slow scroll: 12 px per 16 ms (~750 px/s) down the whole page, then back up faster
    await page.evaluate(async (H) => { window.__log = []; const N = window.__thxNav; const rec = () => { const n = document.getElementById('thx-nav'); const m = n.querySelector('.thx-nav-menu'); window.__log.push([Math.round(performance.now()), Math.round(scrollY), N.ink().logo, N.ink().menu, N.ink().burger, m ? (m.getAttribute('data-split') || '-') : '-', n.querySelector('.thx-nav-logo').getAttribute('data-split') || '-']); };
      const iv = setInterval(rec, 50); for (let y = 0; y <= H; y += 12) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); } await new Promise(r => setTimeout(r, 1500)); for (let y = H; y >= 0; y -= 30) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); } await new Promise(r => setTimeout(r, 1500)); clearInterval(iv); }, H);
    const l = await page.evaluate(() => window.__log); fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify(l));
    const v = page.video(); await ctx.close(); const p = await v.path(); fs.renameSync(p, `${OUT}/${tag}.webm`);
    // flips summary
    let flips = 0, last = null; for (const e of l) { const k = e[2] + e[3] + e[4]; if (last && k !== last) flips++; last = k; }
    console.log(tag, 'H', H, 'samples', l.length, 'group-ink changes', flips, 'split-on samples', l.filter(e => e[5] === 'true' || e[6] === 'true').length);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
