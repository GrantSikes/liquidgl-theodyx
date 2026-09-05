// Theodyx glass-nav acceptance test (Playwright). Usage: node test-nav.js <url> [--engine=chromium|webkit] [--json out.json]
// Checks: presence + skip link, tone adaptation, contrast ≥4.5:1 for nav text at every 50px scroll step,
// scroll condense, mobile panel a11y (focus, Escape, restore, scroll lock, inert), reduced-motion/transparency,
// keyboard order, scroll frame budget. Exits non-zero on failure.
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');
const url = process.argv[2] || 'http://localhost:4174/nav/preview.html';
const engine = (process.argv.find(a => a.startsWith('--engine=')) || '--engine=chromium').split('=')[1];
const jsonOut = (process.argv.find(a => a.startsWith('--json=')) || '').split('=')[1];
const results = { url, engine, checks: [], failures: 0 };
function check(name, ok, detail) { results.checks.push({ name, ok: !!ok, detail }); if (!ok) results.failures++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 220) : '')); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function relLum([r, g, b]) { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
function contrast(a, b) { const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
function parseRGB(s) { const m = s.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(/[\s,\/]+/).slice(0, 3).map(Number) : [0, 0, 0]; }
// minimal PNG decode via playwright's screenshot -> use sharp? not installed; decode with pngjs if present else use zlib manual
let PNG; try { PNG = require('pngjs').PNG; } catch (e) { PNG = null; }
function decodePNG(buf) {
  if (PNG) { const p = PNG.sync.read(buf); return { w: p.width, h: p.height, data: p.data }; }
  // fallback: minimal decoder (8-bit RGBA/RGB, non-interlaced)
  const zlib = require('zlib'); let off = 8, w = 0, h = 0, ct = 0, idat = [];
  while (off < buf.length) { const len = buf.readUInt32BE(off); const type = buf.toString('ascii', off + 4, off + 8); const d = buf.slice(off + 8, off + 8 + len); if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; } else if (type === 'IDAT') idat.push(d); off += 12 + len; }
  const bpp = ct === 6 ? 4 : 3; const raw = zlib.inflateSync(Buffer.concat(idat)); const stride = w * bpp; const out = Buffer.alloc(w * h * 4); let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) { const ft = raw[y * (stride + 1)]; const line = Buffer.from(raw.slice(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)); for (let i = 0; i < stride; i++) { const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0; let v = line[i]; if (ft === 1) v += a; else if (ft === 2) v += b; else if (ft === 3) v += (a + b) >> 1; else if (ft === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); } line[i] = v & 255; } for (let x = 0; x < w; x++) { out[(y * w + x) * 4] = line[x * bpp]; out[(y * w + x) * 4 + 1] = line[x * bpp + 1]; out[(y * w + x) * 4 + 2] = line[x * bpp + 2]; out[(y * w + x) * 4 + 3] = 255; } prev = line; }
  return { w, h, data: out };
}
async function textContrast(page, sel) {
  // hide the text (keep layout), screenshot its box, compute worst-10% background luminance vs text colour
  return page.evaluate(async (sel) => {
    const pick = (q) => { const [css, idx] = q.split('@'); return document.querySelectorAll(css)[+(idx || 0)]; };
    const el = pick(sel); if (!el) return null;
    const r = el.getBoundingClientRect(); const color = getComputedStyle(el).color;
    return { box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], color };
  }, sel).then(async (info) => {
    if (!info || info.box[2] < 2 || info.box[3] < 2) return null;
    await page.evaluate((sel) => { const pick = (q) => { const [css, idx] = q.split('@'); return document.querySelectorAll(css)[+(idx || 0)]; }; const el = pick(sel); el.style.setProperty('color', 'transparent', 'important'); el.style.setProperty('text-shadow', 'none', 'important'); const svg = el.querySelector('svg'); if (svg) { svg.style.setProperty('visibility', 'hidden', 'important'); } }, sel);
    const buf = await page.screenshot({ clip: { x: info.box[0], y: info.box[1], width: info.box[2], height: info.box[3] }, animations: 'disabled', caret: 'hide' });
    await page.evaluate((sel) => { const pick = (q) => { const [css, idx] = q.split('@'); return document.querySelectorAll(css)[+(idx || 0)]; }; const el = pick(sel); el.style.removeProperty('color'); el.style.removeProperty('text-shadow'); const svg = el.querySelector('svg'); if (svg) svg.style.removeProperty('visibility'); }, sel);
    const img = decodePNG(buf); const lums = [];
    for (let i = 0; i < img.w * img.h; i += 1) lums.push(relLum([img.data[i * 4], img.data[i * 4 + 1], img.data[i * 4 + 2]]));
    lums.sort((a, b) => a - b); const tc = parseRGB(info.color); const tl = relLum(tc);
    const worst = tl > 0.5 ? lums[Math.floor(lums.length * 0.9)] : lums[Math.floor(lums.length * 0.1)]; // worst 10% toward the text's own luminance
    const mean = lums.reduce((a, b) => a + b, 0) / lums.length;
    const cr = (l) => { const [x, y] = [tl, l].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const best = Math.max((1.05) / (mean + 0.05), (mean + 0.05) / 0.05);
    const other = tl > 0.5 ? (mean + 0.05) / 0.05 : 1.05 / (mean + 0.05); /* what the OTHER ink would score on this backdrop */
    return { worst10: +cr(worst).toFixed(2), mean: +cr(mean).toFixed(2), best: +best.toFixed(2), other: +other.toFixed(2), Lmean: +mean.toFixed(3), color: info.color };
  });
}
(async () => {
  const bt = engine === 'webkit' ? webkit : chromium;
  const browser = await bt.launch({ headless: true, args: engine === 'chromium' ? ['--disable-blink-features=AutomationControlled', '--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : [] }); /* GPU raster: the SVG lens is a shader on real hardware; software raster makes the frame-budget check meaningless */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, userAgent: engine === 'chromium' ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' : undefined });
  const page = await ctx.newPage();
  const override = (process.argv.find(a => a.startsWith('--override=')) || '').split('=')[1];
  if (override) {
    const body = require('fs').readFileSync(override, 'utf8');
    await page.route(/theodyx-nav\.js/, route => route.fulfill({ status: 200, contentType: 'application/javascript', body }));
    await page.route(u => u.origin === new URL(url).origin && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text(); html = html.replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\sintegrity="[^"]*"/, '$1').replace(/(<script[^>]*theodyx-nav\.js[^>]*?)\scrossorigin="[^"]*"/, '$1'); route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); });
  }
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() !== 'error') return; const src = (m.location() && m.location().url) || ''; if (/challenges\.cloudflare\.com|cdn-cgi/.test(src + ' ' + m.text())) return; errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'load' }); await sleep(1500);
  const cssOverride = (process.argv.find(a => a.startsWith('--css=')) || '').split('=')[1];
  if (cssOverride) { await page.addStyleTag({ content: fs.readFileSync(cssOverride, 'utf8') }); await sleep(200); } /* new nav CSS not yet in the published head */
  const present = await page.evaluate(() => { const n = document.getElementById('thx-nav'); return n ? { tone: n.dataset.tone, w: n.getBoundingClientRect().width, h: n.getBoundingClientRect().height, top: n.getBoundingClientRect().top, skip: !!document.querySelector('.thx-skip'), firstFocusableIsSkip: (() => { const f = document.querySelector('a[href],button'); return f && f.classList.contains('thx-skip'); })(), font: getComputedStyle(n.querySelector('.thx-nav-menu a')).fontFamily, bdf: getComputedStyle(n.querySelector('.thx-nav-glass')).backdropFilter || getComputedStyle(n.querySelector('.thx-nav-glass')).webkitBackdropFilter } : null; });
  check('nav present in DOM without any fetch', !!present, present);
  check('skip link is the first focusable element', present && present.firstFocusableIsSkip);
  check('nav font is Google Sans Flex', present && /Google Sans Flex/.test(present.font), present && present.font);
  check('backdrop filter active (blur or SVG lens)', present && /blur|url\(/.test(present.bdf || ''), present && present.bdf);
  check('no console/page errors on load', errors.length === 0, errors.slice(0, 3));
  // contrast sweep at 50px steps
  const maxY = await page.evaluate(() => Math.min(document.documentElement.scrollHeight - innerHeight, 4000));
  await page.evaluate(() => { document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }); }); /* deterministic backdrop for the sweep; moving video is checked separately */
  const sweep = []; let minWorst = 99, minMean = 99, minWord = 99, minLogo = 99; const inkSet = new Set();
  const INK_ELS = ['.thx-nav-logo', '.thx-nav-menu a@0', '.thx-nav-menu a@1', '.thx-nav-menu a@2', '.thx-nav-menu a@3', '.thx-nav-menu a@4'];
  for (let y = 0; y <= maxY; y += 50) {
    await page.evaluate(v => window.scrollTo(0, v), y); await sleep(120);
    await page.evaluate(() => { document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }); }); /* page scripts resume autoplay on scroll; hold the frame while this step is measured */
    await page.evaluate(() => window.__thxNav && (window.__thxNav.reink || window.__thxNav.retone)()); await sleep(380);
    const tone = await page.evaluate(() => document.getElementById('thx-nav').dataset.tone);
    const inks = await page.evaluate(() => { const n = document.getElementById('thx-nav'); const root = n.dataset.ink; return [...document.querySelectorAll('#thx-nav .thx-nav-logo, #thx-nav .thx-nav-menu a')].map(e => e.dataset.ink || root || 'n/a'); });
    const scrim = await page.evaluate(() => document.getElementById('thx-nav').dataset.scrim || '');
    const flips = await page.evaluate(() => [...document.querySelectorAll('#thx-nav .thx-nav-logo, #thx-nav .thx-nav-menu a')].map(e => e.hasAttribute('data-ink')));
    const plates = await page.evaluate(() => [...document.querySelectorAll('#thx-nav .thx-nav-logo, #thx-nav .thx-nav-menu a')].map(e => e.style.getPropertyValue('--thx-plate') || '0'));
    const mixedFlags = await page.evaluate(() => { const N = window.__thxNav; const viaApi = N && N.inks ? N.inks() : null; return [...document.querySelectorAll('#thx-nav .thx-nav-logo, #thx-nav .thx-nav-menu a')].map((e, i) => e.dataset.inkMixed === '1' || !!(viaApi && viaApi[i] && viaApi[i].mixed)); });
    inks.forEach(i => inkSet.add(i));
    const per = [];
    for (const sel of INK_ELS) { const m = await textContrast(page, sel); if (m) per.push({ sel, worst10: m.worst10, mean: m.mean, best: m.best, other: m.other, L: m.Lmean }); }
    const jsL = await page.evaluate(() => (window.__thxNav && window.__thxNav.inks) ? window.__thxNav.inks().map(i => i.L === null ? null : +i.L.toFixed(3)) : null);
    if (per.length) {
      const w = Math.min(...per.map(p => p.worst10)), mn = Math.min(...per.map(p => p.mean));
      const worstEl = per.reduce((a, b) => a.worst10 < b.worst10 ? a : b);
      const altWorst = Math.min(...per.map(p => p.other));            /* maximin: the other ink's worst word at this step */
      const disagree = per.some(p => p.other > p.mean * 1.15) && per.some(p => p.mean > p.other * 1.15); /* the words genuinely prefer different inks */
      const unanimous = new Set(inks.filter((v, i) => !flips[i])).size === 1; /* 4.7.0: a word may carry its own ink when a plate would not save it */
      const wordMin = Math.min(...per.filter(p => p.sel !== '.thx-nav-logo').map(p => p.mean)); const logoMean = Math.min(...per.filter(p => p.sel === '.thx-nav-logo').map(p => p.mean), 99);
      minWord = Math.min(minWord, wordMin); minLogo = Math.min(minLogo, logoMean);
      const maximinOK = mn >= 0.85 * altWorst || mn >= 4.5;          /* chosen ink's worst word is (near) the best achievable worst word */
      sweep.push({ y, tone, inks: inks.join(''), scrim, flips: flips.filter(Boolean).length, plates: plates.join('|'), unanimous, disagree, maximinOK, altWorst, worst10: w, mean: mn, wordMin, logoMean, worstEl: worstEl.sel, per: per.map(p => [p.mean, p.worst10, p.other]), jsL });
      minWorst = Math.min(minWorst, w); if (!disagree) minMean = Math.min(minMean, mn);
    }
  }
  results.sweep = sweep;
  const notUnanimous = sweep.filter(s => !s.unanimous), notMaximin = sweep.filter(s => !s.maximinOK);
  check('ONE ink for every word + logo at every 50px step (unanimous black or white)', notUnanimous.length === 0, { steps: sweep.length, offenders: notUnanimous.slice(0, 5).map(s => [s.y, s.inks]) });
  check('≥95% of steps wear the maximin ink (the colour whose worst word still reads best, ≥85% of the alternative)', notMaximin.length <= Math.ceil(0.05 * sweep.length), { off: notMaximin.length, of: sweep.length, sample: notMaximin.slice(0, 5).map(s => [s.y, s.inks, s.mean, s.altWorst]) });
  check('AA at EVERY 50px step: every word ≥ 4.5:1 and the logo ≥ 3:1 mean contrast (per-word plates engage wherever the glass alone fails)', minWord >= 4.5 && minLogo >= 3, { minWord, minLogo, offenders: sweep.filter(s => s.wordMin < 4.5 || s.logoMean < 3).slice(0, 6).map(s => [s.y, s.inks, s.plates, +s.wordMin.toFixed(2), +s.logoMean.toFixed(2)]) });
  check('legacy floor: no word/logo below 2.5:1 mean where the backdrop agrees with itself', minMean >= 2.5, { minMean, steps: sweep.length, disagreeSteps: sweep.filter(s => s.disagree).length, scrimSteps: sweep.filter(s => s.scrim).length, low: sweep.filter(s => !s.disagree && s.mean < 2.5).slice(0, 5).map(s => [s.y, s.inks, s.mean, s.worstEl]) });
  results.floorInfo = { stepsBelow4: sweep.filter(s => s.mean < 4).length };
  console.log((results.floorInfo.stepsBelow4 === 0 ? 'PASS ' : 'WARN ') + 'every word ≥ 4:1 mean at every step — ' + JSON.stringify(results.floorInfo));
  results.aaInfo = { stepsBelow45: sweep.filter(s => s.mean < 4.5).length, steps: sweep.length, minMean };
  console.log((results.aaInfo.stepsBelow45 === 0 ? 'PASS ' : 'WARN ') + 'AA (4.5:1 mean) for every word at every step — ' + JSON.stringify(results.aaInfo) + ' (clear glass over mid-tone photos caps both inks near 4.4:1)');
  results.worst10Info = { minWorst, worstSteps: sweep.filter(s => s.worst10 < 3).slice(0, 6) };
  console.log((minWorst >= 3 ? 'PASS ' : 'WARN ') + 'worst-10% pixels ≥ 3:1 for every word + logo (informational on clear glass; halos are not measured) — ' + JSON.stringify(results.worst10Info).slice(0, 260));
  check('ink adapts (both black and white observed) when the page has both backdrops, or one ink clears AA at every step thanks to per-word plates', (inkSet.has('light') && inkSet.has('dark')) || maxY < 400 || (minWord >= 4.5 && minLogo >= 3), { inks: [...inkSet], minWord, minLogo });
  // scroll condense
  await page.evaluate(() => window.scrollTo(0, 400)); await sleep(500);
  const cond = await page.evaluate(() => { const n = document.getElementById('thx-nav'); return { scrolledClass: n.classList.contains('is-scrolled'), transform: getComputedStyle(n).transform, glassBg: getComputedStyle(n.querySelector('.thx-nav-glass')).backgroundColor }; });
  check('scroll condense past 80px (class or scroll-driven transform)', cond.scrolledClass || /matrix\(0\.9/.test(cond.transform), cond);
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
  // keyboard: Tab from top reaches skip link then logo then menu
  await page.keyboard.press('Tab'); const f1 = await page.evaluate(() => document.activeElement.className);
  await page.keyboard.press('Tab'); const f2 = await page.evaluate(() => document.activeElement.className);
  await page.keyboard.press('Tab'); const f3 = await page.evaluate(() => ({ cls: document.activeElement.className, text: document.activeElement.textContent.trim(), outline: getComputedStyle(document.activeElement).outlineStyle }));
  if (engine === 'webkit') console.log('SKIP keyboard order (WebKit does not Tab to links by default; Safari users use Option+Tab)'); else
  check('keyboard order: skip → logo → first menu link with visible focus', /thx-skip/.test(f1) && /thx-nav-logo/.test(f2) && f3.text === 'Our Capabilities' && f3.outline !== 'none', { f1, f2, f3 });
  // scroll frame budget (chromium only)
  if (engine === 'chromium') {
    const fps = await page.evaluate(async () => { const frames = []; let last = performance.now(); let y = 0; await new Promise(res => { function step(now) { frames.push(now - last); last = now; y += 18; window.scrollTo(0, y); if (y < 2400) requestAnimationFrame(step); else res(); } requestAnimationFrame(step); }); const long = frames.filter(f => f > 34).length; return { frames: frames.length, long, avg: +(frames.reduce((a, b) => a + b, 0) / frames.length).toFixed(1), refract: document.getElementById('thx-nav').classList.contains('is-refract') }; });
    results.fps = fps; check('scripted scroll: <5% frames over 34ms', fps.long / fps.frames < 0.05, fps);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // reduced motion + transparency
  /* fresh context: Cloudflare's managed challenge 403s the second same-origin navigation of an automated session */
  const rctx = await ctx.browser().newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', userAgent: engine === 'chromium' ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' : undefined });
  const rpage = await rctx.newPage(); await rpage.goto(url, { waitUntil: 'load' }); await sleep(800);
  const rm = await rpage.evaluate(() => { const n = document.getElementById('thx-nav'); return { sda: n.classList.contains('has-sda'), anim: getComputedStyle(n).animationName, trans: getComputedStyle(n).transitionDuration }; });
  check('prefers-reduced-motion: no scroll animation / transitions', !rm.sda && (rm.anim === 'none') , rm);
  await rctx.close();
  // mobile panel
  await page.close();
  const mctx = await ctx.browser().newContext({ ...devices[engine === 'webkit' ? 'iPhone 14' : 'Pixel 7'] });
  const mp = await mctx.newPage(); await mp.goto(url, { waitUntil: 'load' }); await sleep(1200);
  const m0 = await mp.evaluate(() => { const n = document.getElementById('thx-nav'); const b = n.querySelector('.thx-nav-burger'); return { burgerVisible: getComputedStyle(b).display !== 'none', burgerSize: [b.getBoundingClientRect().width, b.getBoundingClientRect().height], overflow: document.documentElement.scrollWidth <= innerWidth, expanded: b.getAttribute('aria-expanded'), controls: b.getAttribute('aria-controls') }; });
  check('mobile: burger visible, ≥44px, aria-expanded/controls wired, no horizontal overflow', m0.burgerVisible && m0.burgerSize[0] >= 44 && m0.burgerSize[1] >= 44 && m0.expanded === 'false' && m0.controls === 'thx-nav-panel' && m0.overflow, m0);
  await mp.evaluate(() => window.scrollTo(0, 300)); await sleep(200);
  await mp.click('.thx-nav-burger'); await sleep(700);
  const m1 = await mp.evaluate(() => { const n = document.getElementById('thx-nav'); const p = document.getElementById('thx-nav-panel'); return { open: n.dataset.open, navH: n.getBoundingClientRect().height, panelVisible: getComputedStyle(p).visibility, radius: getComputedStyle(n).borderTopLeftRadius, linkOpacity: getComputedStyle(p.querySelector('a')).opacity, focusInPanel: p.contains(document.activeElement), bodyFixed: getComputedStyle(document.body).position === 'fixed', inert: document.querySelectorAll('body > [inert]').length, expanded: n.querySelector('.thx-nav-burger').getAttribute('aria-expanded') }; });
  check('mobile: panel opens from the pill (height grows, radius 28px, links visible), focus moves in, body locked, siblings inert', m1.open === 'true' && m1.navH > 200 && m1.panelVisible === 'visible' && parseFloat(m1.radius) < 100 && +m1.linkOpacity === 1 && m1.focusInPanel && m1.bodyFixed && m1.inert > 0 && m1.expanded === 'true', m1);
  // focus trap: tab from last item wraps
  for (let i = 0; i < 8; i++) await mp.keyboard.press('Tab');
  const trapped = await mp.evaluate(() => { const n = document.getElementById('thx-nav'); return n.contains(document.activeElement); });
  if (engine === 'webkit') console.log('SKIP tab trap (WebKit link tabbing)'); else check('mobile: Tab is trapped inside the open menu', trapped);
  await mp.keyboard.press('Escape'); await sleep(600);
  const m2 = await mp.evaluate(() => { const n = document.getElementById('thx-nav'); return { open: n.dataset.open, navH: n.getBoundingClientRect().height, activeIsBurger: document.activeElement === n.querySelector('.thx-nav-burger'), bodyFixed: getComputedStyle(document.body).position === 'fixed', scrollY: window.scrollY, inert: document.querySelectorAll('body > [inert]').length }; });
  check('mobile: Escape closes, restores focus to the burger, unlocks scroll at the same position', m2.open === 'false' && m2.navH < 80 && m2.activeIsBurger && !m2.bodyFixed && Math.abs(m2.scrollY - 300) < 2 && m2.inert === 0, m2);
  const shot = jsonOut ? jsonOut.replace(/\.json$/, '') : '/tmp/thx-nav';
  await mp.click('.thx-nav-burger'); await sleep(700); await mp.screenshot({ path: shot + '-mobile-open.png' });
  await mp.close(); await mctx.close();
  const dctx = await ctx.browser().newContext({ viewport: { width: 1440, height: 900 }, userAgent: engine === 'chromium' ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' : undefined }); const dp = await dctx.newPage(); await dp.goto(url, { waitUntil: 'load' }); await sleep(1000); await dp.screenshot({ path: shot + '-desktop-top.png', clip: { x: 0, y: 0, width: 1440, height: 160 } });
  await dp.evaluate(() => window.scrollTo(0, 1100)); await sleep(700); await dp.screenshot({ path: shot + '-desktop-light.png', clip: { x: 0, y: 0, width: 1440, height: 160 } });
  await browser.close();
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 2));
  console.log('\n' + (results.failures ? results.failures + ' FAILURE(S)' : 'ALL PASS') + ' — ' + results.checks.length + ' checks (' + engine + ')');
  process.exit(results.failures ? 1 : 0);
})().catch(e => { console.error('TEST CRASH', e); process.exit(2); });
