/* Phase 4 editorial verification. Usage: node p4_verify.js <origin> [slug ...]
   One browser context per navigation (Cloudflare). Prints a PASS/FAIL table + JSON. */
const { chromium } = require('playwright');
const https = require('https');
const ORIGIN = process.argv[2] || 'https://nhq.webflow.io';
const SLUGS = process.argv.slice(3).length ? process.argv.slice(3) : ['consolidation-decade-agency-megamergers', 'own-your-audience-first-party-channels', 'remove-the-creators-and-all-media-platforms-go-dark'];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const MUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
function raw(url) { return new Promise((res, rej) => { https.get(url, { headers: { 'User-Agent': UA } }, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => res({ status: r.statusCode, body: b })); }).on('error', rej); }); }
const results = [];
function check(name, ok, detail) { results.push({ name, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '  — ' + detail : '')); }
(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const slug of SLUGS) {
    const url = ORIGIN + '/our-thinking/' + slug;
    console.log('\n=== ' + url);
    // raw HTML
    const r = await raw(url);
    check('raw: 200', r.status === 200, String(r.status));
    check('raw: og:url present', /property="og:url" content="https:\/\/www\.theodyx\.com\/our-thinking\/[^"]+"/.test(r.body), (r.body.match(/property="og:url" content="([^"]+)"/) || [])[1]);
    const ssr = r.body.match(/<script type="application\/ld\+json" id="thx-article-ssr">([\s\S]*?)<\/script>/);
    let ssrJson = null; try { ssrJson = ssr && JSON.parse(ssr[1]); } catch (e) {}
    check('raw: SSR Article JSON-LD parses', !!ssrJson, ssrJson ? ('headline=' + String(ssrJson.headline).slice(0, 40) + ' | datePublished=' + ssrJson.datePublished + ' | dateModified=' + ssrJson.dateModified + ' | section=' + ssrJson.articleSection + ' | author=' + (ssrJson.author && ssrJson.author.name) + ' | image=' + (ssrJson.image && String(ssrJson.image[0]).slice(-40))) : (ssr ? ssr[1].slice(0, 200) : 'no block'));
    check('raw: head style thx-read present', /<style id="thx-read">/.test(r.body));
    // desktop
    for (const [label, vw, ua] of [['desktop', 1440, UA], ['mobile', 390, MUA]]) {
      const ctx = await browser.newContext({ viewport: { width: vw, height: vw === 390 ? 812 : 900 }, userAgent: ua, isMobile: vw === 390, hasTouch: vw === 390, deviceScaleFactor: vw === 390 ? 3 : 1 });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }));
      await page.waitForTimeout(1800);
      const d = await page.evaluate(() => {
        const cs = el => el ? getComputedStyle(el) : null;
        const body = document.querySelector('.thx-read-body');
        const p = body && [...body.querySelectorAll('p')].find(x => x.textContent.trim().length > 120);
        // chars per line via Range on first long paragraph
        let cpl = null;
        if (p) { const rg = document.createRange(); rg.selectNodeContents(p); const rects = [...rg.getClientRects()]; const lines = rects.filter(r => r.width > 100); const totalChars = p.textContent.length; if (lines.length) cpl = Math.round(totalChars / lines.length); }
        const a = body && body.querySelector('a');
        const nav = document.querySelector('.thx-nav');
        const prog = nav && nav.querySelector('.thx-nav-prog');
        const crumb = document.querySelector('.thx-crumb');
        const toc = document.querySelector('.thx-toc');
        const min = document.querySelector('.thx-ml-min .thx-ml-t');
        const words = [...document.querySelectorAll('.thx-read-body')].reduce((n, b) => n + b.innerText.trim().split(/\s+/).filter(Boolean).length, 0);
        const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent); } catch (e) { return { err: true }; } });
        const art = ld.map(x => x['@graph'] ? x['@graph'].find(n => n['@type'] === 'Article') : (x['@type'] === 'Article' ? x : null)).find(Boolean);
        const rel = [...document.querySelectorAll('.thx-rel-sec .w-dyn-item')];
        const relVis = rel.filter(it => it.offsetParent !== null && !it.hasAttribute('data-thx-hide') && it.style.display !== 'none');
        const secx = relVis.map(it => (it.querySelector('.thx-rel-secx') || {}).textContent || '');
        const crumbSec = crumb ? [...crumb.querySelectorAll('p:not(.thx-dot):not(.thx-crumb-t)')].map(x => x.textContent.trim()).filter(Boolean)[0] : '';
        const fixed = [...document.querySelectorAll('body *')].filter(el => getComputedStyle(el).position === 'fixed' && el.getBoundingClientRect().width > 0).map(el => el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.'));
        const h4 = body && body.querySelector('h4');
        return {
          bodyW: body && body.getBoundingClientRect().width, cpl, pFont: p && cs(p).fontSize, pLH: p && cs(p).lineHeight, pMT: p && cs(p).marginTop,
          aThick: a && cs(a).textDecorationThickness, aColor: a && cs(a).color,
          h4: h4 && cs(h4).fontSize,
          navProg: !!prog, progVar: nav && nav.style.getPropertyValue('--thx-prog'), bodyProg: !!document.querySelector('body > .thx-progress'),
          crumbDisp: crumb && cs(crumb).display, crumbColor: crumb && crumb.querySelector('a,p') && cs(crumb.querySelector('a,p')).color, crumbSec,
          toc: !!toc, tocN: toc ? toc.querySelectorAll('a').length : 0,
          minShown: min && min.textContent.trim(), minCalc: Math.max(1, Math.round(words / 230)), words,
          ldCount: ld.length, art: art && { wc: art.wordCount, tr: art.timeRequired, dp: art.datePublished, dm: art.dateModified, author: art.author && (art.author['@id'] || art.author.name), pub: art.publisher && art.publisher['@id'], section: art.articleSection },
          relVis: relVis.length, secx, fixed
        };
      });
      const tag = label + ':';
      if (label === 'desktop') {
        check(tag + ' measure 65–72 chars/line', d.cpl >= 60 && d.cpl <= 76, 'cpl=' + d.cpl + ' width=' + Math.round(d.bodyW) + ' ' + d.pFont + '/' + d.pLH + ' mt=' + d.pMT);
        check(tag + ' link underline thickness set', d.aThick && d.aThick !== 'auto', d.aThick + ' ' + d.aColor);
        check(tag + ' nav progress inside pill, body hairline gone', d.navProg && !d.bodyProg, 'navProg=' + d.navProg + ' bodyProg=' + d.bodyProg);
        check(tag + ' breadcrumb visible + black', d.crumbDisp === 'flex' && /rgb\(0, 0, 0\)/.test(d.crumbColor || ''), d.crumbDisp + ' ' + d.crumbColor + ' section=' + d.crumbSec);
        check(tag + ' TOC present', d.toc, 'entries=' + d.tocN);
        check(tag + ' reading time computed', d.minShown && String(d.minShown) === String(d.minCalc), 'shown=' + d.minShown + ' calc=' + d.minCalc + ' words=' + d.words);
        check(tag + ' Article JSON-LD wordCount+timeRequired+author', d.art && d.art.wc && d.art.tr, JSON.stringify(d.art));
        check(tag + ' keep-reading shows 3', d.relVis === 3, 'vis=' + d.relVis + ' sections=' + JSON.stringify(d.secx) + ' current=' + d.crumbSec);
        // scroll: progress + toc active
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
        await page.waitForTimeout(700);
        const s = await page.evaluate(() => ({ prog: document.querySelector('.thx-nav') && document.querySelector('.thx-nav').style.getPropertyValue('--thx-prog'), on: document.querySelectorAll('.thx-toc a.on').length }));
        check(tag + ' progress advances on scroll', parseFloat(s.prog) > 0.2, '--thx-prog=' + s.prog);
        check(tag + ' TOC active link at mid-scroll', !d.toc || s.on === 1, 'on=' + s.on);
      } else {
        check(tag + ' only nav + skip fixed (mobile scroll fix)', d.fixed.every(f => /thx-nav|thx-skip/.test(f)), JSON.stringify(d.fixed));
        check(tag + ' line-height 32px', d.pLH === '32px', d.pLH + ' cpl=' + d.cpl);
        const y0 = await page.evaluate(() => (document.querySelector('.ethx-hero') || document.body).getBoundingClientRect().top);
        await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(400);
        const y1 = await page.evaluate(() => (document.querySelector('.ethx-hero') || document.body).getBoundingClientRect().top);
        check(tag + ' hero scrolls 1:1', Math.abs((y0 - y1) - 600) < 4, 'delta=' + (y0 - y1));
      }
      const errs = [];
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      await ctx.close();
    }
  }
  await browser.close();
  const fails = results.filter(r => !r.ok);
  console.log('\n' + (fails.length ? 'FAILS: ' + fails.length : 'ALL PASS') + ' / ' + results.length);
  require('fs').writeFileSync(process.env.P4_OUT || '/dev/null', JSON.stringify(results, null, 1));
})();
