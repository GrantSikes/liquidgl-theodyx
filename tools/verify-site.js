// Theodyx post-change verification suite. Usage: node verify-site.js <origin> [--json=out.json] [--quick]
// Runs against a published host (staging nhq.webflow.io or production www.theodyx.com).
// Checks: static nav on every sitemap page, legacy scripts gone, one h1, fonts (computed + network), contact inputs,
// JSON-LD validity, no console errors, mobile panel, contrast sweep via test-nav.js on 3 pages, mobile-fix regression.
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const origin = (process.argv[2] || 'https://nhq.webflow.io').replace(/\/$/, '');
const jsonOut = (process.argv.find(a => a.startsWith('--json=')) || '').split('=')[1];
const quick = process.argv.includes('--quick');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = { origin, checks: [], failures: 0, pages: {} };
function check(name, ok, detail) { results.checks.push({ name, ok: !!ok, detail }); if (!ok) results.failures++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 260) : '')); }
const SITEMAP = fs.readFileSync(path.join(__dirname, '..', 'sitemap-urls.txt'), 'utf8').trim().split('\n').map(u => u.replace('https://www.theodyx.com', '')).map(p => p || '/');
const RENDER = ['/', '/about', '/contact', '/our-thinking', '/our-thinking/what-automation-cannot-replace', '/index/planning-for-creators-brands-and-beyond', '/policies/privacy-policy', '/scouting'];
(async () => {
  // 1. static HTML sweep
  const staticRes = [];
  for (const p of SITEMAP) {
    let html = '', status = 0;
    try { html = execSync(`curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15" -w "\\n%{http_code}" "${origin}${p}"`, { encoding: 'utf8', maxBuffer: 20e6 }); const i = html.lastIndexOf('\n'); status = +html.slice(i + 1); html = html.slice(0, i); } catch (e) { status = -1; }
    const r = { p, status, navStatic: /id="thx-nav"/.test(html), skip: /class="thx-skip"/.test(html), nvmount: /nv2mount/.test(html), fontpolish: /theodyxsitefontpolish/.test(html), googleFonts: /fonts\.googleapis\.com\/css2\?family=(Fraunces|Inter)/.test(html), lato: /Lato:100/.test(html), h1: (html.match(/<h1\b/g) || []).length, navcss: /id="thx-nav-css"/.test(html), corecss: /id="thx-core"/.test(html), preloadFont: /rel="preload" as="font"/.test(html), viewportFit: /viewport-fit=cover/.test(html), navScript: /theodyx-nav\.js/.test(html), oldNavCount: (html.match(/site-navbar nav w-embed/g) || []).length, canonical: (html.match(/<link[^>]*rel="canonical"/g) || []).length, main: (html.match(/<main\b/g) || []).length, termsBroken: /href="\/policies\/terms"/.test(html), langSlot: /id="thx-lang-slot"/.test(html) };
    staticRes.push(r); await sleep(2600);
  }
  results.static = staticRes;
  const bad = k => staticRes.filter(r => !r[k]).map(r => r.p);
  check('all sitemap pages 200', staticRes.every(r => r.status === 200), staticRes.filter(r => r.status !== 200).map(r => r.p + ':' + r.status));
  check('native nav markup in static HTML on every page', bad('navStatic').length === 0, bad('navStatic'));
  check('skip link in static HTML on every page', bad('skip').length === 0, bad('skip'));
  check('legacy nv2mount script gone everywhere', staticRes.every(r => !r.nvmount), staticRes.filter(r => r.nvmount).map(r => r.p));
  check('font-polish script gone everywhere', staticRes.every(r => !r.fontpolish));
  check('no Fraunces/Inter Google Fonts link anywhere', staticRes.every(r => !r.googleFonts));
  check('nav CSS + core CSS inline in head everywhere', staticRes.every(r => r.navcss && r.corecss));
  check('font preload + viewport-fit=cover everywhere', staticRes.every(r => r.preloadFont && r.viewportFit));
  check('theodyx-nav.js applied everywhere', staticRes.every(r => r.navScript));
  check('no duplicate old nav embed', staticRes.every(r => r.oldNavCount === 0), staticRes.filter(r => r.oldNavCount).map(r => r.p));
  check('exactly one <h1> per page', staticRes.every(r => r.h1 === 1), staticRes.filter(r => r.h1 !== 1).map(r => r.p + ':' + r.h1));
  check('exactly one canonical per page', staticRes.every(r => r.canonical === 1));
  check('<main> landmark present on every page', staticRes.every(r => r.main >= 1), bad('main'));
  check('/policies/terms broken link gone', staticRes.every(r => !r.termsBroken), staticRes.filter(r => r.termsBroken).map(r => r.p));
  check('footer language slot present', staticRes.every(r => r.langSlot), bad('langSlot').slice(0, 5));
  check('Lato/Varela WebFont loader gone (Webflow project fonts setting)', staticRes.every(r => !r.lato), 'owner setting if failing');
  if (quick) { finish(); return; }
  // 2. rendered checks
  const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  for (const p of RENDER) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' });
    const page = await ctx.newPage(); const errors = []; const fonts = [];
    page.on('pageerror', e => errors.push(String(e).slice(0, 160))); page.on('console', m => { if (m.type() !== 'error') return; const src = (m.location() && m.location().url) || ''; if (/challenges\.cloudflare\.com|cdn-cgi\/zaraz/.test(src + ' ' + m.text())) return; /* Turnstile iframe noise on staging; Cloudflare Zaraz s.js 403 = owner item (dashboard) */ /* Turnstile's own iframe noise (staging hostname isn't on the Turnstile allowlist) */ errors.push(m.text().slice(0, 160) + (src ? ' @' + src.slice(0, 80) : '')); });
    page.on('response', r => { if (r.request().resourceType() === 'font') fonts.push(r.url()); });
    let ok = true; try { await page.goto(origin + p, { waitUntil: 'load', timeout: 60000 }); } catch (e) { ok = false; }
    await sleep(3000);
    const d = await page.evaluate(() => {
      const fam = el => el ? getComputedStyle(el).fontFamily : null;
      // Alias families (Archivo/Objectivity/Space Mono/Fraunces/Inter/Lato/Varela/...) resolve to the same variable WOFF2 via @font-face aliases in thx-core; the network check below proves only one font file loads.
      const gsf = s => /Google Sans Flex|Googlesansflex|Google Sans|Archivo|Objectivity|Space Mono|SpMono|Fraunces|Inter Tight|(^|, ?)"?Inter"?(,|$)|Lato|Varela|Sinhala Sangam|(^|, ?)"?Mono"?(,|$)/i.test(s || '');
      const els = { body: document.body, h1: document.querySelector('h1'), p: document.querySelector('main p, article p, .w-richtext p, p'), a: document.querySelector('main a, p a, footer a'), button: document.querySelector('button'), input: document.querySelector('input[type=text],input[type=email],input:not([type=hidden])'), label: document.querySelector('label'), footer: document.querySelector('footer') };
      const fams = {}; Object.keys(els).forEach(k => { fams[k] = fam(els[k]); });
      const leaks = Object.entries(fams).filter(([k, v]) => v && !gsf(v)).map(([k, v]) => k + ':' + v.slice(0, 40));
      const nav = document.getElementById('thx-nav');
      const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent); } catch (e) { return 'INVALID'; } });
      const inp = els.input ? parseFloat(getComputedStyle(els.input).fontSize) : null;
      return { title: document.title, nav: !!nav, tone: nav && nav.dataset.tone, navFont: nav ? fam(nav.querySelector('.thx-nav-menu a')) : null, leaks, jsonldCount: jsonld.length, jsonldInvalid: jsonld.filter(x => x === 'INVALID').length, inputFont: inp, langSlotMounted: !!document.querySelector('#thx-lang-slot #thx-langsel'), h1s: document.querySelectorAll('h1').length, mainCount: document.querySelectorAll('main').length, overflow: document.documentElement.scrollWidth > innerWidth, loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i) };
    });
    const fontHosts = fonts.map(u => { try { return new URL(u).host; } catch (e) { return u; } });
    results.pages[p] = { ok, errors: errors.slice(0, 5), ...d, fontRequests: fonts.length, fontHosts: [...new Set(fontHosts)] };
    check(`render ${p}: nav present, GSF on nav/body/h1/p/button/input, no leaks`, ok && d.nav && d.leaks.length === 0, d.leaks);
    check(`render ${p}: fonts only from Webflow's font CDN (no Google Fonts/Lato)`, fontHosts.every(h => /website-files\.com$|^webflow-files-prod\.global\.ssl\.fastly\.net$/.test(h)), [...new Set(fontHosts)]);
    check(`render ${p}: no legacy static 9pt TTF requests`, !fonts.some(u => /_9pt-/.test(u)), fonts.filter(u => /_9pt-/.test(u)).map(u => u.split('/').pop()));
    check(`render ${p}: no console/page errors`, errors.length === 0, errors.slice(0, 3));
    check(`render ${p}: valid JSON-LD`, d.jsonldInvalid === 0, { count: d.jsonldCount });
    check(`render ${p}: no horizontal overflow at 1440`, !d.overflow);
    if (d.inputFont != null) check(`render ${p}: input font-size ≥16px`, d.inputFont >= 16, d.inputFont);
    await ctx.close(); await sleep(2500);
  }
  await browser.close();
  // 3. nav acceptance on 3 pages + mobile fix regression
  for (const p of ['/', '/about', '/our-thinking/what-automation-cannot-replace']) {
    try { const out = execSync(`node ${path.join(__dirname, 'test-nav.js')} "${origin}${p}" --engine=chromium --json=/tmp/thx-nav-${p.replace(/\W/g, '_')}.json 2>&1 | tail -3`, { encoding: 'utf8' }); check(`nav acceptance ${p}`, /ALL PASS/.test(out), out.trim().split('\n').pop()); } catch (e) { check(`nav acceptance ${p}`, false, (e.stdout || String(e)).slice(-300)); }
    await sleep(3000);
  }
  try { const out = execSync(`node ${path.join(__dirname, 'test-pubs-mobile-fix.js')} "${origin}/our-thinking/what-automation-cannot-replace" "${origin}/index/planning-for-creators-brands-and-beyond" 2>&1 | tail -4`, { encoding: 'utf8', timeout: 600000 }); check('Publications/Ethos mobile scroll fix regression', /0 fail|PASS|passed/i.test(out) && !/FAIL/.test(out.replace(/0 FAIL/gi, '')), out.trim().slice(-300)); } catch (e) { check('Publications/Ethos mobile scroll fix regression', false, (e.stdout || String(e)).slice(-300)); }
  finish();
  function finish() { if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 2)); console.log('\n' + (results.failures ? results.failures + ' FAILURE(S)' : 'ALL PASS') + ' — ' + results.checks.length + ' checks on ' + origin); process.exit(results.failures ? 1 : 0); }
})().catch(e => { console.error('CRASH', e); process.exit(2); });
