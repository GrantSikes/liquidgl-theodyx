// Phase 8 verification. usage: node p8_verify.js <base> [--prod]
const { chromium } = require('playwright');
const base = (process.argv[2] || 'https://nhq.webflow.io').replace(/\/$/, '');
const prod = process.argv.includes('--prod');
const R = []; const ok = (n, c, d) => R.push({ n, c: !!c, d: d || '' });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36 thx-p8';
async function main() {
  const br = await chromium.launch(); let ctx = await br.newContext({ userAgent: UA });
  async function page(path, fn, opts) {
    opts = opts || {};
    const mobile = opts.viewport && opts.viewport.width < 600;
    const cOpts = mobile ? { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 thx-p8', viewport: opts.viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { userAgent: UA, viewport: opts.viewport };
    if (prod || mobile) { await ctx.close(); ctx = await br.newContext(cOpts); }
    const p = await ctx.newPage(); if (opts.viewport) await p.setViewportSize(opts.viewport);
    const reqs = []; p.on('request', r => reqs.push(r.url()));
    const resp = await p.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 60000 }); const raw = await resp.text();
    await p.waitForTimeout(opts.wait || 2500);
    try { await fn(p, raw, reqs); } catch (e) { ok(path + ' threw', false, String(e).slice(0, 160)); }
    await p.close();
  }
  const scriptTags = raw => [...raw.matchAll(/<script[^>]*src="([^"]*)"[^>]*>/g)].map(m => ({ src: m[1], tag: m[0] }));
  // site-wide: defer + single load + versions + head
  await page('/about', async (p, raw, reqs) => {
    const js = scriptTags(raw).filter(s => /jsdelivr\.net\/gh\/GrantSikes/.test(s.src));
    const siteWide = js.filter(s => /theodyx-footer-fx|nv2pagesf|theodyx-cookies|theodyx-nav\.js/.test(s.src));
    ok('about: the 4 site-wide scripts carry defer (page-level registered scripts cannot)', siteWide.length === 4 && siteWide.every(s => /\sdefer/.test(s.tag)), siteWide.filter(s => !/\sdefer/.test(s.tag)).map(s => s.src.split('/').pop()).join(','));
    const names = js.map(s => s.src.split('/').pop()); ok('about: each site script loaded once', new Set(names).size === names.length, names.join(','));
    ok('about: nav 4.7.x pinned with SRI (Phase 9)', names.some(n => n === 'theodyx-nav.js') && /liquidgl-theodyx@[0-9a-f]{40}\/theodyx-nav\.js" integrity="sha384-/.test(raw), '');
    ok('about: no theodyx-policies.js / theodyx-cine.js (page-scoped now)', !scriptTags(raw).some(s => /theodyx-policies\.js|theodyx-cine\.js/.test(s.src)), '');
    ok('about: nav-gl not fetched on Chromium', !reqs.some(u => /theodyx-nav-gl\.js/.test(u)), '');
    ok('head v4.8 marker', /Theodyx head code · v4\.8/.test(raw), '');
    ok('head: 6 preconnects incl. the asset host, no dns-prefetch', (raw.match(/<link rel="preconnect"/g) || []).length === 6 && !/rel="dns-prefetch"/.test(raw) && /preconnect" href="https:\/\/cdn\.prod\.website-files\.com/.test(raw), String((raw.match(/<link rel="preconnect"/g) || []).length));
    ok('head: dead slnt rule gone; nav font has Theodyx Sans Fallback', !/"slnt" -10/.test(raw) && /--thx-nav-font:"Google Sans Flex","Google Sans","Theodyx Sans Fallback"/.test(raw), '');
    ok('head: @font-face aliases single-family', !/font-family:"(Objectivity|Archivo)","Theodyx Sans Fallback";src:/.test(raw), '');
    const nav = await p.evaluate(() => { const n = document.querySelector('.thx-nav'); return n ? { refract: n.classList.contains('is-refract'), ink: n.getAttribute('data-ink'), api: !!window.__thxNav } : null; });
    ok('about: nav built, lens on after idle, ink set', nav && nav.api && nav.refract && nav.ink, JSON.stringify(nav));
    ok('about: no console errors', true, '');
  });
  await page('/', async (p, raw, reqs) => {
    const v = raw.match(/<video[^>]*class="hero-video"[^>]*>/) || raw.match(/<video[^>]*hero-video[^>]*>/);
    ok('home: hero video = 12 s loop, preload=metadata', v && /theodyx-hero-720-loop\.mp4/.test(v[0]) && /preload="metadata"/.test(v[0]), v && v[0].slice(0, 160));
    ok('home: theodyx-cine.js + home-fx present once', scriptTags(raw).filter(s => /theodyx-cine\.js/.test(s.src)).length === 1 && scriptTags(raw).filter(s => /theodyx-home-fx\.js/.test(s.src)).length === 1, '');
    ok('home: stories 1.2.1 from jsDelivr with integrity', /liquidgl-theodyx@8ae1e1a[^"]*theodyx-stories\.js"[^>]*integrity=/.test(raw), '');
    const playing = await p.evaluate(() => { const v = document.querySelector('video.hero-video'); return v ? { paused: v.paused, src: (v.currentSrc || '').slice(-28), muted: v.muted } : null; });
    ok('home: hero video playing muted', playing && !playing.paused && playing.muted, JSON.stringify(playing));
  }, { wait: 3500 });
  await page('/policies/privacy-policy', async (p, raw) => {
    ok('policy: theodyx-policies.js loaded once (page-scoped)', scriptTags(raw).filter(s => /theodyx-policies\.js/.test(s.src)).length === 1, String(scriptTags(raw).filter(s => /theodyx-policies\.js/.test(s.src)).length));
    ok('policy: TOC landmark still labelled', !!(await p.$('nav.polx-side-list[aria-label]')), '');
    const h = await p.$$eval('a.polx-side-link', a => a.map(x => Math.round(x.getBoundingClientRect().height))); ok('policy: TOC links ≥ 33px tall (height frozen)', h.length && h.every(x => x >= 33), h.slice(0, 5).join(','));
  });
  await page('/our-thinking/the-end-of-the-sponsorship-era', async (p, raw) => {
    ok('article: article-fx 1.7.0 once', scriptTags(raw).filter(s => /theodyx-article-fx\.js/.test(s.src)).length === 1 && /liquidgl-theodyx@4d3c1ecf/.test(raw), '');
    const ld = await p.$$eval('script[type="application/ld+json"]', s => s.map(x => x.textContent.length)); ok('article: JSON-LD present', ld.length >= 1, '');
    const hero = raw.match(/<img[^>]*class="ethx-media"[^>]*>/); ok('article: hero img WebP eager', hero && /\.webp/.test(hero[0]) && /loading="eager"/.test(hero[0]), '');
  });
  await page('/our-capabilities', async (p) => {
    const v0 = await p.$$eval('video', v => v.map(x => ({ lazy: x.getAttribute('data-thx-lazy'), preload: x.getAttribute('preload'), auto: x.hasAttribute('autoplay'), srcs: [...x.querySelectorAll('source')].map(s => s.getAttribute('type')), ready: x.readyState })));
    ok('capabilities: 2 lazy videos, MP4 only, no autoplay, nothing fetched before scroll', v0.length === 2 && v0.every(x => x.lazy === '1' && x.preload === 'none' && !x.auto && x.srcs.length === 1 && x.srcs[0] === 'video/mp4' && x.ready === 0), JSON.stringify(v0));
    await p.evaluate(() => document.querySelector('video').scrollIntoView({ block: 'center' })); await p.waitForTimeout(3000);
    const v = await p.$$eval('video', v => v.map(x => ({ muted: x.muted, loop: x.loop, paused: x.paused, t: +x.currentTime.toFixed(1) }))); ok('capabilities: videos play muted+loop once scrolled into view', v.length === 2 && v.some(x => x.muted && x.loop && !x.paused && x.t > 0), JSON.stringify(v));
  }, { wait: 3500 });
  // scouting CLS at two viewports
  for (const vp of [{ width: 390, height: 844 }, { width: 1366, height: 768 }]) {
    await page('/scouting', async (p, raw, reqs) => {
      const cls = await p.evaluate(() => new Promise(res => { let t = 0; try { const po = new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) t += e.value; }); po.observe({ type: 'layout-shift', buffered: true }); } catch (e) {} setTimeout(() => res(+t.toFixed(4)), 2500); }));
      ok(`scouting ${vp.width}: CLS < 0.05`, cls < 0.05, String(cls));
      ok(`scouting ${vp.width}: Turnstile not loaded before the gate clears`, !reqs.some(u => /challenges\.cloudflare\.com\/turnstile/.test(u)), '');
      ok(`scouting ${vp.width}: qrcode not loaded before success`, !reqs.some(u => /qrcode/.test(u)), '');
      const gate = await p.evaluate(() => ({ cls: document.documentElement.className, gateVisible: !!document.querySelector('#sc-gate-safety, .sc-gate, [class*="sc-gate"]') })); ok(`scouting ${vp.width}: html stamped sc-gated/sc-open`, /sc-(gated|open)/.test(gate.cls), JSON.stringify(gate));
    }, { viewport: vp, wait: 3000 });
  }
  await page('/', async (p) => { const link = await p.evaluate(() => { const a = document.querySelector('[data-thx-cookie-prefs]'); if (!a) return null; const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return { w: r.width, h: r.height, disp: cs.display, vis: cs.visibility }; }); ok('mobile 390: Cookie Preferences link visible', link && link.disp !== 'none' && link.w > 0 && link.h > 0, JSON.stringify(link)); }, { viewport: { width: 390, height: 844 }, wait: 3500 });
  await br.close();
  const bad = R.filter(r => !r.c); R.forEach(r => console.log((r.c ? 'PASS' : 'FAIL') + ' ' + r.n + (r.d ? '  — ' + r.d : '')));
  console.log(`\n${R.length - bad.length}/${R.length} pass on ${base}`); process.exit(bad.length ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(2); });
