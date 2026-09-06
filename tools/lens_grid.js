// Render the live nav with several LENS parameter sets over the same backdrops, stacked per case.
const { chromium, devices } = require('playwright');
const { PNG } = require('pngjs');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const OUT = process.argv[2] || 'r3/lens'; fs.mkdirSync(OUT, { recursive: true });
const VARIANTS = JSON.parse(fs.readFileSync(process.argv[3] || 'r3/variants.json', 'utf8'));
const CASES = [
  { key: 'home-top', url: 'https://www.theodyx.com/', y: 0 },
  { key: 'home-cards', url: 'https://www.theodyx.com/', anchor: /Make something only you can/i, off: 440 },
  { key: 'clients', url: 'https://www.theodyx.com/clients', y: 560 },
  { key: 'about', url: 'https://www.theodyx.com/about', y: 900 },
];
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
  for (const c of CASES) { if (ONLY.length && !ONLY.includes(c.key)) continue;
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, deviceScaleFactor: 2 }); const page = await ctx.newPage();
    await page.goto(c.url, { waitUntil: 'load' }); await sleep(2500);
    await page.evaluate(() => document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }));
    let y = c.y; if (c.anchor) y = await page.evaluate(([src, off]) => { const re = new RegExp(src, 'i'); const h = Array.from(document.querySelectorAll('h1,h2,h3')).find(e => re.test(e.textContent)); return Math.round(h.getBoundingClientRect().top + window.scrollY - off); }, [c.anchor.source, c.off]);
    await page.evaluate(y => window.scrollTo(0, y), y); await sleep(1200);
    const base = await page.evaluate(() => window.__thxNav.lens().params);
    const strips = [];
    for (const v of VARIANTS) {
      await page.evaluate(p => window.__thxNav.lens(p), Object.assign({}, base, v.lens || {}));
      let tag = null; if (v.css) { tag = await page.addStyleTag({ content: v.css }); }
      await sleep(700); await page.evaluate(() => window.__thxNav.reink()); await sleep(400);
      const buf = await page.screenshot({ clip: { x: 100, y: 0, width: 1240, height: 96 } });
      strips.push(PNG.sync.read(buf));
      if (tag) await tag.evaluate(el => el.remove());
      console.log(c.key, v.name, 'ok');
    }
    const W = strips[0].width, H = strips.reduce((a, s) => a + s.height + 8, 0); const out = new PNG({ width: W, height: H }); out.data.fill(40); let yy = 0;
    for (const s of strips) { PNG.bitblt(s, out, 0, 0, s.width, s.height, 0, yy); yy += s.height + 8; }
    fs.writeFileSync(`${OUT}/${c.key}.png`, PNG.sync.write(out));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
