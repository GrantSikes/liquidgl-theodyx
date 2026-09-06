/* Phase 6 verification on staging: (1) English no-regression diff vs the pre-refactor snapshot, (2) translator gone + runtime present + no auto-apply under an es-ES browser, (3) locale dictionary renders Spanish/French when <html lang> says so (HTML routed with lang swapped), (4) switcher hidden with one locale and rendered with a config of three, (5) RTL smoke: dir=rtl produces no horizontal overflow and the read-progress origin flips, (6) <time datetime> + Intl date on an article, (7) console errors. */
const { chromium } = require('playwright'); const fs = require('fs');
const gateFill = async (pg, iso) => { try { const ok = await pg.$('#sc-gate-safety-ok'); if (ok && await ok.isVisible()) { await ok.click(); await pg.waitForTimeout(450); } } catch (e) {} /* scouting 2.4.0: the safety stage first */ const [y, m, d] = iso.split('-'); if (await pg.$('#sc-gate-y')) { await pg.fill('#sc-gate-m', m); await pg.fill('#sc-gate-d', d); await pg.fill('#sc-gate-y', y); } else await pg.fill('#sc-gate-dob', iso); }; /* scouting 2.3.0: the date is three segments (month / day / year, locale order); #sc-gate-dob is the hidden composite */
const O = process.argv[2] || 'https://nhq.webflow.io', SP = '/private/tmp/claude-501/-Users-x-CLAUDE/1f9ab44c-dab4-4c10-9374-4fb09761db8c/scratchpad';
const res = []; const check = (n, ok, d) => { res.push({ n, ok }); console.log((ok ? 'PASS ' : 'FAIL ') + n + (d ? ' — ' + String(d).slice(0, 300) : '')); };
const pages = ['/', '/our-thinking', '/our-thinking/consolidation-decade-agency-megamergers', '/scouting', '/this-page-does-not-exist-404', '/contact'];
(async () => {
  const b = await chromium.launch();
  // 1. English no-regression
  for (const p of pages) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto(O + p, { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await pg.waitForTimeout(1500);
    if (p === '/scouting') { /* owner 2026-09-05: the age dialog is back - answer it so the form text is comparable with the baseline */ try { await gateFill(pg, (new Date().getFullYear() - 22) + '-06-15'); await pg.click('#sc-gate-age-go'); } catch (e) {} await pg.waitForTimeout(900); }
    const t = await pg.evaluate(() => ({ text: document.body.innerText.replace(/\s+/g, ' ').trim(), lang: document.documentElement.lang, title: document.title, aria: [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).join('|'), langslot: (document.getElementById('thx-lang-slot') || {}).innerHTML || '', i18n: !!(window.__thxI18n && window.__thxI18n.t), langsel: !!document.getElementById('thx-langsel'), timeEl: document.querySelectorAll('time[datetime]').length, timeTxt: (document.querySelector('time[datetime]') || {}).textContent || '' }));
    const beforePath = `${SP}/p6/before${p.replace(/\//g, '_') || '_root'}.json`;
    const before = fs.existsSync(beforePath) ? JSON.parse(fs.readFileSync(beforePath, 'utf8')) : null;
    // normalise: old language button text (EN + list) is expected to disappear; footer year already current
    const norm = s => s.replace(/→/g, '').replace(/Language: [A-Z]{2}/g, '').replace(/\bEN\b(?:\s*English\s*EN\s*Español\s*ES.*?Русский\s*RU)?/g, '').replace(/\s+/g, ' ').trim();
    const same = before ? norm(before.text) === norm(t.text) : null;
    let diff = '';
    if (before && !same) { const a = norm(before.text), c = norm(t.text); let i = 0; while (i < a.length && a[i] === c[i]) i++; diff = 'first diff @' + i + ': before="' + a.slice(Math.max(0, i - 40), i + 60) + '" after="' + c.slice(Math.max(0, i - 40), i + 60) + '"'; }
    check('english unchanged: ' + p, before ? same : t.text.length > 200, before ? (same ? 'identical (' + t.text.length + ' chars)' : diff) : 'no baseline');
    check('runtime present, translator gone: ' + p, t.i18n && !t.langsel && t.lang === 'en' && !/Language: [A-Z]{2}/.test(t.aria), JSON.stringify({ i18n: t.i18n, langsel: t.langsel, lang: t.lang, slotLen: t.langslot.length }));
    check('no page errors: ' + p, errs.length === 0, JSON.stringify(errs.slice(0, 3)));
    if (p.indexOf('404') >= 0) { const arr = await pg.evaluate(() => { const e = document.querySelector('.thx-arr'); return e ? getComputedStyle(e, '::after').content : 'none'; }); check('404: arrow rendered by ::after (RTL-flippable)', /→/.test(arr), arr); }
    if (p.startsWith('/our-thinking/')) check('article date wrapped in <time datetime> with Intl text', t.timeEl >= 1 && /\d{4}/.test(t.timeTxt), 'time=' + t.timeEl + ' "' + t.timeTxt + '"');
    await ctx.close();
  }
  // 2. es-ES browser: no auto-apply
  { const ctx = await b.newContext({ locale: 'es-ES', viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage(); await pg.goto(O + '/', { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1500);
    const t = await pg.evaluate(() => ({ lang: document.documentElement.lang, nav: [...document.querySelectorAll('.thx-nav-menu a')].map(a => a.textContent.trim()).join(','), banner: (document.querySelector('.thxck-banner h4') || {}).textContent || '' }));
    check('es-ES browser gets English (no auto-apply)', t.lang === 'en' && /Our Capabilities/.test(t.nav) && (!t.banner || /privacy/.test(t.banner)), JSON.stringify(t)); await ctx.close(); }
  // 3. html lang swapped → dictionaries render
  for (const [lang, expect404, expectBanner, expectRead] of [['es', 'Esta página se salió del feed.', 'Configuración de cookies', 'min de lectura'], ['fr', 'Cette page s’est égarée dans le fil.', 'Paramètres des cookies', 'min de lecture']]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.route(u => (u.hostname.endsWith('webflow.io') || u.hostname.endsWith('theodyx.com')) && !/\.(js|css|png|jpg|svg|woff2|webp|mp4|json|xml|ico)(\?|$)/.test(u.pathname), async r => { const rs = await r.fetch(); const ct = rs.headers()['content-type'] || ''; if (!/text\/html/.test(ct)) return r.fulfill({ response: rs }); const html = (await rs.text()).replace(/<html([^>]*)lang="en"/, '<html$1lang="' + lang + '"'); r.fulfill({ response: rs, body: html, headers: { ...rs.headers(), 'content-type': 'text/html; charset=utf-8' } }); });
    const pg = await ctx.newPage(); await pg.goto(O + '/this-page-does-not-exist-404', { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1500);
    const t = await pg.evaluate(() => { try { window.__thxOpenCookiePrefs && window.__thxOpenCookiePrefs(); } catch (e) {} return { lang: document.documentElement.lang, h: (document.querySelector('#thx-404 h2, .thx-404-h, .thx-404 h2') || document.querySelector('h2') || {}).textContent || document.body.innerText.slice(0, 300), modal: (document.querySelector('.thxck-modal h2') || {}).textContent || '', burger: (document.querySelector('.thx-nav-burger') || {}).getAttribute ? document.querySelector('.thx-nav-burger').getAttribute('aria-label') : '' }; });
    check('lang=' + lang + ': 404 + cookie modal + nav strings localised', t.h.indexOf(expect404) >= 0 && t.modal === expectBanner && t.burger !== 'Open menu' && t.burger.length > 3, JSON.stringify(t).slice(0, 220));
    await ctx.close(); const ctx2 = await b.newContext({ viewport: { width: 1280, height: 900 } }); /* Cloudflare challenges a second same-origin navigation inside one context: fresh context per page */
    await ctx2.route(u => (u.hostname.endsWith('webflow.io') || u.hostname.endsWith('theodyx.com')) && !/\.(js|css|png|jpg|svg|woff2|webp|mp4|json|xml|ico)(\?|$)/.test(u.pathname), async r => { const rs = await r.fetch(); const ct = rs.headers()['content-type'] || ''; if (!/text\/html/.test(ct)) return r.fulfill({ response: rs }); const html = (await rs.text()).replace(/<html([^>]*)lang="en"/, '<html$1lang="' + lang + '"'); r.fulfill({ response: rs, body: html, headers: { ...rs.headers(), 'content-type': 'text/html; charset=utf-8' } }); });
    const pg2 = await ctx2.newPage(); await pg2.goto(O + '/our-thinking/consolidation-decade-agency-megamergers', { waitUntil: 'load', timeout: 60000 }); await pg2.waitForTimeout(1800);
    const a = await pg2.evaluate(() => ({ read: (document.querySelector('.thx-ml-min .thx-ml-t') || {}).textContent || '', toc: (document.querySelector('.thx-toc-h') || {}).textContent || '', time: (document.querySelector('time[datetime]') || {}).textContent || '', inLang: (() => { try { return [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)).map(x => (x['@graph'] || [x]).find(n => n['@type'] === 'Article')).filter(Boolean)[0].inLanguage; } catch (e) { return 'n/a'; } })() }));
    check('lang=' + lang + ': article read time numeric, TOC heading, Intl date, inLanguage', /^\d+$/.test(a.read.trim()) && a.toc && a.toc !== 'In this report' && a.time && a.inLang === lang, JSON.stringify(a));
    await ctx2.close();
  }
  // 4. switcher: hidden with one locale; rendered from a 3-locale config
  { const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
    await pg.addInitScript(() => { window.__thxLocales = [{ code: 'en', name: 'English', prefix: '' }, { code: 'es', name: 'Español', prefix: '/es' }, { code: 'fr', name: 'Français', prefix: '/fr' }]; });
    await pg.goto(O + '/about', { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1800);
    const s = await pg.evaluate(() => { const w = document.querySelector('#thx-lang-slot .thx-lang'); if (!w) return null; const b = w.querySelector('button'), ul = w.querySelector('ul'); const opts = [...ul.querySelectorAll('a[role="option"]')].map(a => ({ href: a.getAttribute('href'), text: a.textContent, sel: a.getAttribute('aria-selected'), lang: a.getAttribute('lang') })); return { btn: b.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded'), hidden: ul.hidden, role: ul.getAttribute('role'), opts }; });
    check('switcher renders from 3-locale config with real anchors, own-language names, current selected', s && s.role === 'listbox' && s.opts.length === 3 && s.opts[1].href === '/es/about' && s.opts[0].sel === 'true' && s.opts[1].text === 'Español', JSON.stringify(s));
    const k = await pg.evaluate(async () => { const w = document.querySelector('#thx-lang-slot .thx-lang'); const b = w.querySelector('button'); b.focus(); b.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); await new Promise(r => setTimeout(r, 50)); const ul = w.querySelector('ul'); const f1 = document.activeElement.textContent; document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); const f2 = document.activeElement.textContent; document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return { opened: !ul.hidden || true, f1, f2, closed: ul.hidden, back: document.activeElement === b }; });
    check('switcher keyboard: ArrowDown opens on current, moves, Escape closes and returns focus', k.f1 === 'English' && k.f2 === 'Español' && k.closed && k.back, JSON.stringify(k));
    await ctx.close(); }
  { const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage(); await pg.goto(O + '/about', { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1500);
    const one = await pg.evaluate(() => !!document.querySelector('#thx-lang-slot .thx-lang'));
    check('switcher hidden while only English exists', !one); await ctx.close(); }
  // 5. RTL smoke
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage(); await pg.goto(O + '/our-thinking/consolidation-decade-agency-megamergers', { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1200);
    const r = await pg.evaluate(() => { document.documentElement.dir = 'rtl'; return new Promise(res => setTimeout(() => { const prog = document.querySelector('.thx-nav-prog'); res({ overflow: document.documentElement.scrollWidth - innerWidth, origin: prog ? getComputedStyle(prog).transformOrigin : 'none', dirVar: getComputedStyle(document.documentElement).getPropertyValue('--thx-dir').trim() }); }, 400)); });
    check('rtl ' + w + ': no horizontal overflow, progress origin at inline start, --thx-dir=-1', r.overflow <= 1 && (r.origin === 'none' || /^(\d+(\.\d+)?)px/.test(r.origin) && parseFloat(r.origin) > 100) && r.dirVar === '-1', JSON.stringify(r)); await ctx.close();
  }
  await b.close();
  const fails = res.filter(r => !r.ok).length; console.log(fails ? 'FAILS: ' + fails : 'ALL PASS', '/', res.length);
})().catch(e => { console.error('HARNESS FAIL', e); process.exit(1); });
