// Checks every sitemap page at scrollY=0: does any visible text element sit under the fixed nav (top 72px)? Also reports nav v3 state per page.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const origin = (process.argv[2] || 'https://nhq.webflow.io').replace(/\/$/, '');
const SITEMAP = fs.readFileSync(path.join(__dirname, '..', 'sitemap-urls.txt'), 'utf8').trim().split('\n').map(u => u.replace('https://www.theodyx.com', '')).map(p => p || '/');
(async () => {
  const b = await chromium.launch(); const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
  const rows = [];
  for (const p of SITEMAP) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA }); /* one context per page: Cloudflare challenges the 2nd same-origin navigation of a session */
    const page = await ctx.newPage();
    try { await page.goto(origin + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1800);
      const r = await page.evaluate(() => { const nav = document.getElementById('thx-nav'); const nr = nav ? nav.getBoundingClientRect() : null; const hits = []; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) { const t = n.textContent.trim(); if (t.length < 3) continue; const el = n.parentElement; if (!el || nav.contains(el) || el.closest('script,style,noscript,[aria-hidden="true"]')) continue; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue; const rg = document.createRange(); rg.selectNodeContents(n); const q = rg.getBoundingClientRect(); if (!q.width || !q.height) continue; if (nr && q.top < nr.bottom && q.bottom > nr.top && q.left < nr.right && q.right > nr.left) hits.push(t.slice(0, 40) + ' @' + Math.round(q.top)); } return { v: window.__thxNav && window.__thxNav.v, lens: window.__thxNav && window.__thxNav.lens && window.__thxNav.lens().on, inks: window.__thxNav && window.__thxNav.inks ? window.__thxNav.inks().map(i => i.ink[0]).join('') : null, hits: hits.slice(0, 3) }; });
      rows.push({ p, ...r });
    } catch (e) { rows.push({ p, err: String(e).slice(0, 80) }); }
    await ctx.close(); await new Promise(r => setTimeout(r, 1500));
  }
  await b.close();
  const overlaps = rows.filter(r => r.hits && r.hits.length);
  console.log(JSON.stringify({ pages: rows.length, navV3: rows.filter(r => /^3\./.test(r.v || '')).length, lensOn: rows.filter(r => r.lens).length, overlaps: overlaps.map(r => [r.p, r.hits]), inks: rows.map(r => r.p + ':' + r.inks) }, null, 1));
})();
