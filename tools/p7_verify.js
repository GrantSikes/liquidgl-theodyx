// Phase 7 verification. usage: node p7_verify.js <base> [--prod]
const { chromium } = require('playwright');
const base = (process.argv[2] || 'https://nhq.webflow.io').replace(/\/$/, '');
const prod = process.argv.includes('--prod');
const R = []; const ok = (n, c, d) => R.push({ n, c: !!c, d: d || '' });
async function main() {
  const br = await chromium.launch();
  let ctx = await br.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36 thx-p7' });
  async function page(path, fn, waitMs) {
    if (prod) { await ctx.close(); ctx = await br.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36 thx-p7' }); }
    const p = await ctx.newPage(); const resp = await p.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const raw = await resp.text();
    await p.waitForTimeout(waitMs || 2500);
    try { await fn(p, raw, resp); } catch (e) { ok(path + ' threw', false, String(e).slice(0, 160)); }
    await p.close();
  }
  const ld = async (p) => p.$$eval('script[type="application/ld+json"]', s => s.map(x => { try { return JSON.parse(x.textContent); } catch (e) { return null; } }));
  const nodes = (arr) => arr.filter(Boolean).flatMap(d => d['@graph'] ? d['@graph'] : [d]);
  // 404
  await page('/thx-p7-does-not-exist-' + Date.now(), async (p, raw, resp) => {
    ok('404 status', resp.status() === 404, String(resp.status()));
    ok('404 one h1', (await p.$$('h1')).length === 1, String((await p.$$('h1')).length));
    ok('404 main present', !!(await p.$('main')));
    const cards = await p.$$eval('#thx-404 [role="img"], .thx-404 [role="img"], [class*="404"] [role="img"]', e => e.map(x => ({ bg: x.getAttribute('data-bg') || x.style.backgroundImage, al: x.getAttribute('aria-label') })));
    ok('404 cards role=img + aria-label', cards.length >= 3 && cards.every(c => c.al), JSON.stringify(cards.map(c => c.al)).slice(0, 120));
    ok('404 thumbs -p-800', cards.length && cards.every(c => /-p-800/.test(c.bg || '')), (cards[0] && cards[0].bg || '').slice(0, 100));
    const hrefs = await p.$$eval('a[href]', a => a.map(x => x.getAttribute('href')).filter(h => /company\/global|\/blog\/|thinking-overview/.test(h)));
    ok('404 no legacy paths', hrefs.length === 0, hrefs.join(',').slice(0, 120));
    const cardLinks = await p.$$eval('a[href^="/our-thinking/"]', a => a.map(x => x.getAttribute('href')));
    ok('404 cards link /our-thinking/*', cardLinks.length >= 3, cardLinks.join(',').slice(0, 160));
  });
  // 404 card targets 200
  const chk = await ctx.newPage();
  for (const s of ['what-automation-cannot-replace', 'the-end-of-the-sponsorship-era', 'why-the-next-media-empires-will-be-built-by-one-person']) {
    const r = await chk.goto(base + '/our-thinking/' + s, { waitUntil: 'commit' }); ok('404-card target 200 ' + s, r.status() === 200, String(r.status()));
  }
  await chk.close();
  // article
  await page('/our-thinking/streamings-profit-pivot-2026-earnings', async (p, raw) => {
    const ssr = raw.match(/<script type="application\/ld\+json" id="thx-article-ssr">([\s\S]*?)<\/script>/);
    let j = null; try { j = ssr && JSON.parse(ssr[1]); } catch (e) {}
    ok('article SSR parses', !!j, ssr ? ssr[1].slice(0, 80) : 'no ssr');
    ok('article SSR author Organization', j && j.author && j.author['@type'] === 'Organization', j && JSON.stringify(j.author));
    ok('article SSR publisher logo', j && j.publisher && j.publisher.logo && j.publisher.logo.url, '');
    const all = nodes(await ld(p));
    const art = all.find(n => n['@type'] === 'Article');
    ok('article runtime @graph has WebSite + BreadcrumbList', all.some(n => n['@type'] === 'WebSite') && all.some(n => n['@type'] === 'BreadcrumbList'), all.map(n => n['@type']).join(','));
    ok('article headline decoded (no &#x27;)', art && !/&#x?\w+;|&amp;/.test(art.headline), art && art.headline);
    const bc = all.find(n => n['@type'] === 'BreadcrumbList');
    ok('article crumb 2 → /our-thinking', bc && /\/our-thinking$/.test(bc.itemListElement[1].item), bc && bc.itemListElement[1].item);
    ok('article publisher has logo (runtime)', art && art.publisher && art.publisher.logo, '');
    const title = await p.title();
    ok('article <title> uses seo-title (≤60 + | Theodyx)', /\| Theodyx$/.test(title) && title.length <= 60, title + ' (' + title.length + ')');
    const h4 = await p.$$eval('.w-richtext h4, .art-body h4, article h4', e => e.length);
    ok('article body no h4 (h2>h3)', h4 === 0, 'h4=' + h4);
    ok('article <time datetime>', !!(await p.$('time[datetime]')));
  });
  // meta descriptions + OG
  const metas = {
    '/contact': ['Contact Theodyx for creator representation', null],
    '/policies/terms-of-service': ['The terms that govern your use', null],
    '/policies/scouting-safety': ["How Theodyx's scouting program really operates", 'Scouting Safety | Theodyx'],
    '/applications': ["UmbraOS is Theodyx's creator-data platform", null],
    '/scouting': ['Apply to be scouted by Theodyx', null],
    '/policies/notice-at-collection': [null, 'Notice at Collection | Theodyx'],
    '/policies/your-privacy-choices': [null, 'Your Privacy Choices | Theodyx'],
    '/policies/dmca': [null, 'DMCA Policy | Theodyx'],
    '/policies/accessibility': [null, 'Accessibility | Theodyx'],
  };
  for (const [path, [desc, og]] of Object.entries(metas)) {
    await page(path, async (p, raw) => {
      if (desc) { const m = raw.match(/<meta content="([^"]*)" name="description"\s*\/?>|<meta name="description" content="([^"]*)"\s*\/?>/); const v = m && (m[1] || m[2]) || ''; ok('desc ' + path, v.indexOf(desc.replace(/'/g, '&#x27;')) === 0 || v.indexOf(desc) === 0, v.slice(0, 70)); }
      if (og) { const m = raw.match(/<meta content="([^"]*)" property="og:title"\s*\/?>|<meta property="og:title" content="([^"]*)"\s*\/?>/); const v = m && (m[1] || m[2]) || ''; ok('og:title ' + path, v.replace(/&amp;/g, '&') === og, v); const d = /property="og:description"|og:description"/.test(raw); ok('og:description ' + path, d, ''); }
      if (/policies\//.test(path)) {
        const all = nodes(await ld(p)); const bc = all.find(n => n['@type'] === 'BreadcrumbList');
        ok('crumb2 Terms & Policies ' + path, bc && bc.itemListElement[1] && bc.itemListElement[1].name === 'Terms & Policies', bc && bc.itemListElement[1] && bc.itemListElement[1].name);
        ok('policy nav aria-label ' + path, !!(await p.$('nav.polx-side-list[aria-label]')), '');
        ok('policy effective <time> ' + path, !!(await p.$('time[datetime]')), '');
      }
      if (path === '/scouting') { const h = await p.$$eval('a[href]', a => a.map(x => x.getAttribute('href')).filter(h => /privacy/.test(h))); ok('scouting consent → /policies/privacy-policy', h.some(x => x === '/policies/privacy-policy') && !h.some(x => /resources\/legal/.test(x)), h.join(',').slice(0, 120)); }
      if (path === '/applications') { const all = nodes(await ld(p)); const sw = all.find(n => n['@type'] === 'SoftwareApplication'); ok('/applications SoftwareApplication @id #umbraos, no offers', sw && sw['@id'] === 'https://www.theodyx.com/#umbraos' && !sw.offers, sw && sw['@id']); }
    }, 1500);
  }
  await page('/', async (p) => { const all = nodes(await ld(p)); const org = all.find(n => n['@id'] === 'https://www.theodyx.com/#organization' && n.name); ok('home Organization type incl ProfessionalService', org && [].concat(org['@type']).includes('ProfessionalService'), org && JSON.stringify(org['@type'])); ok('home inLanguage en-US', all.filter(n => n.inLanguage).every(n => n.inLanguage === 'en-US'), ''); }, 1500);
  await page('/about', async (p) => { const all = nodes(await ld(p)); const org = all.find(n => n['@type'] === 'Organization' || (Array.isArray(n['@type']) && n['@type'].includes('Organization'))); ok('about founder @ids', org && org.founder && org.founder.length === 2, org && JSON.stringify(org.founder)); }, 1500);
  await page('/index/planning-for-creators-brands-and-beyond', async (p, raw) => {
    const all = nodes(await ld(p)); const wp = all.find(n => n['@type'] === 'WebPage'); const bc = all.find(n => n['@type'] === 'BreadcrumbList');
    ok('/index WebPage resolved (no {{wf)', wp && !/\{\{wf/.test(JSON.stringify(wp)) && /planning-for-creators/.test(wp.url), wp && wp.url);
    ok('/index BreadcrumbList name resolved', bc && bc.itemListElement[1] && !/\{\{wf/.test(bc.itemListElement[1].name) && bc.itemListElement[1].name.length > 3, bc && bc.itemListElement[1] && bc.itemListElement[1].name);
    const og = raw.match(/property="og:title" content="([^"]*)"|content="([^"]*)" property="og:title"/); ok('/index og:title bound', og && /Theodyx/.test(og[1] || og[2]) && !/\{\{wf/.test(og[1] || og[2]), og && (og[1] || og[2]));
  }, 1500);
  for (const [path, u] of [['/clients', '(6a666733b6dcc4a8a9024d12|clients-lcp-500\\.webp)'], ['/our-capabilities', '(6a67835dcad1123c2d383b42|our-capabilities-lcp-736\\.webp)'], ['/partners', '(6a658c1aca97e39b20173a6e|colorvibe)'], ['/our-thinking', '6a8cb712b01d3827472ffb30']]) {
    await page(path, async (p, raw) => { ok('preload ' + path, new RegExp('<link rel="preload" as="image" (href|imagesrcset)="[^"]*' + u + '[^"]*"[^>]*fetchpriority="high">').test(raw), ''); }, 300);
  }
  // element-level fixes (footer rel, internal new-tab links, outline hygiene)
  await page('/partners', async (p, raw) => {
    const soc = await p.$$eval('a.footer-social-btn', a => a.map(x => ({ t: x.getAttribute('target'), r: x.getAttribute('rel') })));
    ok('footer social: 8 anchors with rel=noopener', soc.length === 8 && soc.every(x => /noopener/.test(x.r || '')), JSON.stringify(soc).slice(0, 120));
    const blank = await p.$$eval('a[target="_blank"]', a => a.map(x => x.getAttribute('href')).filter(h => h && h[0] === '/'));
    ok('/partners no internal target=_blank', blank.length === 0, blank.join(',').slice(0, 120));
    ok('/partners no stray <link rel=noopener> in body', !/<body[\s\S]*<link rel="noopener"/.test(raw), '');
  }, 1500);
  for (const path of ['/', '/policies/legal']) {
    await page(path, async (p) => { const blank = await p.$$eval('a[target="_blank"]', a => a.map(x => x.getAttribute('href')).filter(h => h && h[0] === '/')); ok(path + ' no internal target=_blank', blank.length === 0, blank.join(',').slice(0, 120)); }, 1500);
  }
  await page('/our-thinking/the-end-of-the-sponsorship-era', async (p) => {
    ok('article: no empty bound headings after runtime', (await p.$$('h1.w-dyn-bind-empty,h2.w-dyn-bind-empty,h3.w-dyn-bind-empty')).length === 0, '');
    const rt = await p.$eval('.thx-read-title', e => e.tagName).catch(() => 'none');
    ok('article: .thx-read-title is not a heading after runtime', rt === 'DIV' || rt === 'none', rt);
    const hs = await p.$$eval('h1,h2,h3,h4,h5,h6', e => e.map(x => x.tagName + (x.textContent.trim() ? '' : '(empty)')));
    ok('article: no empty headings at all', !hs.some(h => /empty/.test(h)), hs.filter(h => /empty/.test(h)).join(','));
  });
  // llms.txt
  const lp = await ctx.newPage(); const lr = await lp.goto(base + '/llms.txt'); const lt = await lr.text();
  ok('llms.txt 200 text/plain', lr.status() === 200 && /text\/plain/.test(lr.headers()['content-type'] || ''), lr.headers()['content-type']);
  ok('llms.txt no /blog/ /careers /thinking hops', !/\/blog\/|\/careers|theodyx\.com\/thinking\b|\/features\b/.test(lt), '');
  ok('llms.txt lists 14 /our-thinking/ pieces', (lt.match(/theodyx\.com\/our-thinking\/[a-z0-9-]+/g) || []).length === 14, String((lt.match(/theodyx\.com\/our-thinking\/[a-z0-9-]+/g) || []).length));
  await lp.close();
  await br.close();
  const bad = R.filter(r => !r.c);
  R.forEach(r => console.log((r.c ? 'PASS' : 'FAIL') + ' ' + r.n + (r.d ? '  — ' + r.d : '')));
  console.log(`\n${R.length - bad.length}/${R.length} pass on ${base}`);
  process.exit(bad.length ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(2); });
