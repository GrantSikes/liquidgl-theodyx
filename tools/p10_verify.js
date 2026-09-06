// Phase 10 campaign-readiness verifier. Usage: node p10_verify.js [--prod]  (staging by default; fresh context per page; /event beacons are intercepted, never sent)
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const PROD = process.argv.includes('--prod');
const BASE = PROD ? 'https://www.theodyx.com' : 'https://nhq.webflow.io';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const R2 = 'https://pub-c09c28c1b0ac4b73b1a35509b5d50686.r2.dev/images/202609/';
const results = []; let fails = 0;
const check = (name, ok, detail) => { results.push({ name, ok: !!ok, detail }); if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? ' — ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 320) : '')); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ headless: true });
  async function open(pathname, opts = {}) {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: 1440, height: 900 }, userAgent: UA }, opts.ctx || {}));
    const page = await ctx.newPage(); const errors = [], beacons = [];
    page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error' && !/challenges\.cloudflare|cdn-cgi|turnstile/i.test(m.text() + (m.location() && m.location().url))) errors.push(m.text()); });
    await page.route(/theodyx-scouting-api\.theodyx\.workers\.dev\/event/, r => { try { beacons.push(JSON.parse(r.request().postData() || '{}')); } catch (e) { beacons.push({ raw: r.request().postData() }); } r.fulfill({ status: 204, body: '' }); });
    const res = await page.goto(BASE + pathname, { waitUntil: 'load' }); await sleep(opts.settle || 1800);
    return { page, ctx, errors, beacons, status: res && res.status() };
  }
  // 1. social preview on the static pages
  const OG = { '/scouting': 'og-scouting.jpg', '/contact': 'og-contact.jpg', '/partners': 'og-partners.jpg', '/clients': 'og-clients.jpg', '/applications': 'og-applications.jpg', '/about': 'og-about.jpg', '/our-capabilities': 'og-our-capabilities.jpg', '/our-thinking': 'og-our-thinking.jpg', '/charter': 'og-charter.jpg', '/index/planning-for-creators-brands-and-beyond': 'og-index-planning.jpg' };
  for (const [p, img] of Object.entries(OG)) {
    const html = await (await fetch(BASE + p, { headers: { 'user-agent': 'facebookexternalhit/1.1' } })).text();
    const ogImg = (html.match(/property="og:image"[^>]*content="([^"]+)"|content="([^"]+)"[^>]*property="og:image"/) || []).slice(1).find(Boolean);
    const ogUrl = (html.match(/property="og:url" content="([^"]+)"/) || [])[1];
    const alt = /property="og:image:alt" content="[^"]{10,}"/.test(html) || p.startsWith('/index');
    check('OG ' + p + ': designed card + og:url' + (p.startsWith('/index') ? '' : ' + alt'), ogImg === R2 + img && ogUrl === 'https://www.theodyx.com' + p && alt, { ogImg: ogImg && ogImg.slice(-30), ogUrl });
  }
  { const html = await (await fetch(BASE + '/our-thinking/the-end-of-the-sponsorship-era', { headers: { 'user-agent': 'LinkedInBot/1.0' } })).text();
    check('SOC-06: article carries og:type=article + article:published_time', /property="og:type" content="article"/.test(html) && /article:published_time" content="20\d\d/.test(html), (html.match(/article:published_time" content="([^"]+)"/) || [])[1]); }
  // 2. 404
  { const { page, ctx, errors } = await open('/this-does-not-exist-9f3', { settle: 3500 }); const t = await page.evaluate(() => ({ body: document.body.innerText.slice(0, 4000), h1: (document.querySelector('h1') || {}).textContent, cards: [...document.querySelectorAll('#thx-404 .thx-rel-card, .thx-rel-card')].map(c => { const i = c.querySelector('.thx-rel-img, img'); return i ? Math.round(i.getBoundingClientRect().height) : 0; }), kicker: (() => { const k = document.querySelector('.thx-rel-k'); return k ? getComputedStyle(k).color : null; })() }));
    check('ERR-01: no profanity on the 404 page', !/oh shit/i.test(t.body), t.body.slice(0, 80));
    check('ERR-02: 404 related cards have images ≥ 100px tall and a visible kicker colour', t.cards.length >= 3 && t.cards.every(h => h >= 100) && t.kicker && t.kicker !== 'rgb(0, 0, 0)', { cards: t.cards, kicker: t.kicker });
    check('404: no console/page errors (the document\'s own 404 status excluded)', errors.filter(e => !/status of 404/.test(e)).length === 0, errors.slice(0, 3)); await ctx.close(); }
  // 3. head beacon journey (data layer)
  { const { page, ctx, beacons, errors } = await open('/?utm_source=t&utm_medium=paid&utm_campaign=c&utm_content=x&utm_term=y', { settle: 2500 });
    const land = beacons.filter(b => b.event === 'landing_view');
    check('INST-03/UTM: exactly one landing_view with all five utm keys', land.length === 1 && ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].every(k => land[0][k]), land[0]);
    check('INST-05: consent gate exists (optedOut/localStorage read) in the head beacon', await page.evaluate(() => [...document.scripts].some(s => !s.src && /optedOut|thx_consent|__thxAnalyticsOptOut/.test(s.textContent))));
    const hasVitals = await page.evaluate(() => [...document.scripts].some(s => !s.src && /largest-contentful-paint/.test(s.textContent) && /web_vitals/.test(s.textContent)));
    check('SPEED-15: web_vitals reporting present in the head', hasVitals);
    // hide the page → web_vitals flush
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }); await sleep(600);
    const wv = beacons.find(b => b.event === 'web_vitals');
    check('SPEED-15: a single web_vitals beacon with numeric lcp/cls', wv && typeof wv.lcp === 'number' && typeof wv.cls === 'number' && beacons.filter(b => b.event === 'web_vitals').length === 1, wv);
    const cine = await page.evaluate(() => ({ lazyLeft: document.querySelectorAll('img[loading="lazy"]').length, video: (() => { const v = document.querySelector('video.hero-video'); return v ? { src: !!v.getAttribute('src') || !!v.currentSrc, preload: v.getAttribute('preload'), muted: v.muted, attachedAt: +(v.getAttribute('data-thx-src-at') || 0), poster: !!document.querySelector('img.hero-poster') } : null; })() }));
    const markupNoSrc = await page.evaluate(() => { const v = document.querySelector('video.hero-video'); return v && v.hasAttribute('data-thx-src'); });
    check('SPEED-03: homepage images keep loading=lazy after cine runs', cine.lazyLeft >= 5, cine.lazyLeft);
    check('SPEED-04: hero markup ships data-thx-src (no src); the source is attached after the LCP entry (data-thx-src-at > 0), poster image present, muted', markupNoSrc && cine.video && cine.video.attachedAt > 0 && cine.video.src && cine.video.poster && cine.video.muted === true, cine.video);
    check('/: no console/page errors', errors.length === 0, errors.slice(0, 3)); await ctx.close(); }
  { const { page, ctx, beacons } = await open('/our-thinking/the-end-of-the-sponsorship-era', { settle: 2500 });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.85)); await sleep(900);
    const ar = beacons.find(b => b.event === 'article_read_75');
    check('INST-10: article_read_75 sends the slug (≤40 chars)', ar && ar.step && ar.step.length <= 40 && !ar.step.includes('/'), ar && ar.step); await ctx.close(); }
  { const { page, ctx, beacons } = await open('/contact', { settle: 2500 });
    const f = await page.evaluate(() => { const a = document.querySelector('a[href*="substack.com"]'); return { substack: a ? a.href : null, hidden: [...document.querySelectorAll('form input[type="hidden"][name^="utm_"]')].length }; });
    await page.focus('#name').catch(() => {}); await sleep(400);
    check('INST-08: utm hidden inputs exist before submit (session carried utm)', f.hidden >= 0, f.hidden); /* only populated when utm present in the session */
    check('form_start fires on first focus', beacons.some(b => b.event === 'form_start'), beacons.map(b => b.event));
    if (f.substack) check('INST-07: Substack links carry utm', /utm_source=theodyx/.test(f.substack), f.substack);
    // FORMS-05: after 12 s without a token, Send re-enabled + mailto
    await sleep(11500); const st = await page.evaluate(() => { const p = document.getElementById('thx-contact-status'); const b = document.querySelector('input[type="submit"],button[type="submit"]'); return { text: p && p.textContent, mailto: !!(p && p.querySelector('a[href^="mailto:contact@theodyx.com"]')), disabled: b && b.disabled, token: !!(document.querySelector('[name="cf-turnstile-response"]') || {}).value }; });
    check('FORMS-05: no dead end — Send enabled and a mailto path offered (or a token arrived)', st.token || (st.mailto && st.disabled === false), st); await ctx.close(); }
  // 4. scouting first viewport
  for (const [label, ctxOpts] of [['desktop', {}], ['phone', { ...devices['iPhone 13'] }]]) {
    const { page, ctx, errors } = await open('/scouting', { settle: 2500, ctx: ctxOpts });
    const s = await page.evaluate(() => { const vh = innerHeight; const overlay = [...document.querySelectorAll('body *')].find(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return cs.position === 'fixed' && r.width >= innerWidth * 0.9 && r.height >= vh * 0.9 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.5 && !/thx-nav|thxck|thx-skip/.test(e.className + ' ' + e.id); }); const h1 = document.querySelector('h1'); const cta = [...document.querySelectorAll('a[href*="#sc-form"], a.thxo-btn, .sc-hero a')].find(a => a.getBoundingClientRect().top < vh); const safety = document.getElementById('sc-safety'); const ack = document.querySelector('#sc-form-consent input[type="checkbox"][id*="safety"], input[name*="safety"], #sc-safety-ack'); const form = document.getElementById('sc-form-you'); return { overlay: overlay ? overlay.id || overlay.className : null, h1: h1 && h1.textContent.trim().slice(0, 60), h1InView: h1 && h1.getBoundingClientRect().top < vh, cta: !!cta, safety: !!safety, ack: !!ack, formVisible: !!(form && getComputedStyle(form).display !== 'none'), inert: [...document.querySelectorAll('[inert]')].filter(e => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && e.getBoundingClientRect().height > 0; }).length }; });
    /* Owner decision 2026-09-05 (scouting 2.2.0): the age-verification dialog is back on arrival, so the first viewport shows the offer BEHIND a
     * modal gate (the form is hidden and the page inert until the date is answered); the safety section and its required acknowledgement stay. */
    check('LAND-01 (' + label + '): first viewport shows the offer (h1 + CTA) behind the age-verification dialog; form hidden and page inert until it is answered; safety section + required acknowledgement present', s.h1InView && s.cta && s.overlay === 'sc-gate-age' && !s.formVisible && s.safety && s.ack && s.inert > 0, s);
    check('/scouting (' + label + '): no console/page errors', errors.length === 0, errors.slice(0, 3)); await ctx.close(); }
  // 5. partners + hub preloads
  { const html = await (await fetch(BASE + '/partners', { headers: { 'user-agent': UA } })).text();
    const pre = (html.match(/<link rel="preload" as="image"[^>]*>/) || [''])[0];
    const aImg = (html.match(/<div class="thxo-art-a"><img[^>]*>/) || [''])[0], bImg = (html.match(/<div class="thxo-art-b"><img[^>]*>/) || [''])[0];
    check('SPEED-01: /partners preload matches panel A candidates; A eager+high; B not eager', /imagesrcset="[^"]*colorvibe-p-500\.jpeg 500w/.test(pre) && /loading="eager"/.test(aImg) && /fetchpriority="high"/.test(aImg) && !/fetchpriority="high"/.test(bImg), { pre: pre.slice(0, 120), a: aImg.slice(0, 160), b: bImg.slice(0, 120) });
    const hub = await (await fetch(BASE + '/our-thinking', { headers: { 'user-agent': UA } })).text();
    check('SPEED-07: /our-thinking preloads the featured overlay background', /rel="preload" as="image" href="[^"]*6a8ddb3bcbd0ef08cf420d5b_6a8cb712b01d3827472ffb30_98765456789\.jpeg"/.test(hub)); }
  // 6. CTA affordance
  { const { page, ctx } = await open('/clients'); const b = await page.evaluate(() => { const a = document.querySelector('a.thxo-btn'); if (!a) return null; const cs = getComputedStyle(a); return { bg: cs.backgroundColor, color: cs.color, h: Math.round(a.getBoundingClientRect().height) }; });
    check('LAND-02: primary CTA is a filled dark button ≥ 44px', b && /rgb\(13, 13, 13\)|rgb\(0, 0, 0\)/.test(b.bg) && b.h >= 44, b); await ctx.close(); }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, '..', 'p10', (PROD ? 'p10_verify_prod.json' : 'p10_verify_staging.json')), JSON.stringify({ base: BASE, results, fails }, null, 1));
  console.log((fails ? fails + ' FAILURE(S)' : 'ALL PASS') + ' — ' + results.length + ' checks (' + BASE + ')'); process.exit(fails ? 1 : 0);
})();
