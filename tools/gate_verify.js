// Local scouting 2.3.0 gate: production /scouting with theodyx-scouting.js (and nav) routed to the working tree.
const { chromium, devices } = require('playwright');
const fs = require('fs'); const sleep = ms => new Promise(r => setTimeout(r, ms));
const ROOT = '/Users/x/CLAUDE/liquidgl-theodyx/'; const OUT = process.env.OUT || './gate'; fs.mkdirSync(OUT, { recursive: true });
const URL0 = process.env.URL || 'https://www.theodyx.com/scouting';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
let pass = 0, fail = 0; const check = (n, ok, d) => { console.log((ok ? 'PASS ' : 'FAIL ') + n + (ok ? '' : '  ' + JSON.stringify(d).slice(0, 400))); ok ? pass++ : fail++; };
const PREBOOT_EXTRA = `html.sc-gated.sc-g1 #sc-gate-safety{display:block!important;position:fixed;inset:0;z-index:9600;background:#0E0E0F}html.sc-gated.sc-g2 #sc-gate-age{display:block!important;position:fixed;inset:0;z-index:9500;background:#0E0E0F}html.sc-gated #sc-gate-safety:not([data-thx-gate])>*,html.sc-gated #sc-gate-age:not([data-thx-gate])>*{visibility:hidden}`;
async function ctxFor(browser, mobile) {
  const ctx = await browser.newContext(mobile ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 }, userAgent: UA, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  if (!process.env.LIVE) {
    await page.route(/theodyx-scouting\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-scouting.js', 'utf8') }));
    await page.route(/theodyx-nav\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-nav.js', 'utf8') }));
    await page.route(u => /theodyx\.com|webflow\.io/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => {
      if (route.request().resourceType() !== 'document') return route.continue();
      const res = await route.fetch(); let html = await res.text();
      html = html.replace(/(<script[^>]*theodyx-(?:scouting|nav)\.js[^>]*?)\s+integrity="[^"]*"/g, '$1');
      html = html.replace('html.sc-gated #sc-form-you,html.sc-gated #sc-form-work,html.sc-gated #sc-form-consent{display:none!important}', 'html.sc-gated #sc-form-you,html.sc-gated #sc-form-work,html.sc-gated #sc-form-consent{display:none!important}\n' + PREBOOT_EXTRA); html = html.replace("if(!g.gatePassed)document.documentElement.classList.add('sc-gated');", "if(!g.trust)document.documentElement.classList.add('sc-gated','sc-g1');else if(!g.gatePassed)document.documentElement.classList.add('sc-gated','sc-g2');"); html = html.replace(/<style id="sc-gate-preboot">[\s\S]*?<\/style>/, m => m.replace(/html\.sc-gated #sc-gate-age\{display:block!important[^}]*\}\n?html\.sc-gated #sc-gate-age:not\(\[data-thx-gate\]\)>\*\{visibility:hidden\}\n?/, ''));
      route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } });
    });
  }
  return { ctx, page, errors };
}
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
  const y22 = new Date().getFullYear() - 22, y10 = new Date().getFullYear() - 10;
  for (const mobile of [false, true]) {
    const tag = mobile ? 'phone' : 'desktop';
    const { ctx, page, errors } = await ctxFor(browser, mobile);
    await page.goto(URL0, { waitUntil: 'load' }); await sleep(1800);
    await page.screenshot({ path: `${OUT}/safety-${tag}.png` });
    const s0 = await page.evaluate(() => { const g = document.getElementById('sc-gate-safety'); if (!g) return null; const cs = getComputedStyle(g); const h = document.getElementById('sc-gate-safety-title'); return { role: g.getAttribute('role'), modal: g.getAttribute('aria-modal'), labelled: g.getAttribute('aria-labelledby') === 'sc-gate-safety-title' && !!h, display: cs.display, z: cs.zIndex, bg: cs.backgroundColor, focusInside: g.contains(document.activeElement), inert: [...document.body.children].filter(e => e.hasAttribute('inert')).length, cls: document.documentElement.className, eyebrow: (g.querySelector('.sc-gate-kicker') || {}).textContent, title: h && h.textContent, body: (g.querySelector('.sc-gate-body') || {}).textContent, mailto: !!g.querySelector('.sc-gate-body a[href^="mailto:"]'), ok: (document.getElementById('sc-gate-safety-ok') || {}).textContent, brand: !!g.querySelector('.sc-gate-brand svg'), ageVisible: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', inline: !!document.getElementById('sc-safety'), ack: !!document.getElementById('sc-safety-ack'), formsHidden: ['sc-form-you', 'sc-form-work', 'sc-form-consent'].every(i => getComputedStyle(document.getElementById(i)).display === 'none') }; });
    check(`${tag}: the SAFETY stage is up first - role/modal/labelled, ink stage, focus inside, page inert and gated (g1), forms hidden, age stage not yet shown`, !!s0 && s0.role === 'dialog' && s0.modal === 'true' && s0.labelled && s0.display === 'block' && /^rgb\(14, 14, 15\)$/.test(s0.bg) && s0.focusInside && s0.inert > 0 && /sc-gated/.test(s0.cls) && /sc-g1/.test(s0.cls) && s0.formsHidden && !s0.ageVisible, s0);
    check(`${tag}: it says Theodyx | Safety / Your safety comes first. / the statement with the mailto / Acknowledged; no inline section, no checkbox`, !!s0 && /Theodyx \| Safety/i.test(s0.eyebrow || '') && /Your safety comes first/i.test(s0.title || '') && /never asks for photos/i.test(s0.body || '') && s0.mailto && /Acknowledged/i.test(s0.ok || '') && s0.brand && !s0.inline && !s0.ack, s0);
    await page.keyboard.press('Escape'); await sleep(150); for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    const strap = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('sc-gate-safety')).display !== 'none', inside: document.getElementById('sc-gate-safety').contains(document.activeElement) }));
    check(`${tag}: safety stage - Escape does not dismiss, Tab cannot leave`, strap.open && strap.inside, strap);
    const ackRes = await page.evaluate(() => { document.getElementById('sc-gate-safety-ok').click(); const g = document.getElementById('sc-gate-safety'); return { leaving: g.classList.contains('is-leaving'), ageOpen: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', cls: document.documentElement.className }; });
    await sleep(500);
    const afterAck = await page.evaluate(() => ({ safetyGone: getComputedStyle(document.getElementById('sc-gate-safety')).display === 'none', ageOpen: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', cls: document.documentElement.className, trust: (JSON.parse(sessionStorage.getItem('theodyx_scouting_gates_v1') || '{}') || {}).trust, focusInAge: document.getElementById('sc-gate-age').contains(document.activeElement), aside: !!document.querySelector('#sc-gate-age .sc-gate-col--safety') }));
    check(`${tag}: Acknowledged opens the age stage under the fading safety stage, stamps g2, stores trust, moves focus, no statement column inside the age stage`, ackRes.leaving && ackRes.ageOpen && afterAck.safetyGone && afterAck.ageOpen && /sc-g2/.test(afterAck.cls) && !/sc-g1/.test(afterAck.cls) && afterAck.trust === true && afterAck.focusInAge && !afterAck.aside, { ackRes, afterAck });
    await page.screenshot({ path: `${OUT}/gate-${tag}.png` });
    const g0 = await page.evaluate(() => { const g = document.getElementById('sc-gate-age'); const cs = getComputedStyle(g); const segs = [...g.querySelectorAll('.sc-gate-input')].map(i => i.id); const h = g.querySelector('#sc-gate-title'); const inp = g.querySelector('#sc-gate-m'); return { role: g.getAttribute('role'), modal: g.getAttribute('aria-modal'), labelled: g.getAttribute('aria-labelledby') === 'sc-gate-title' && !!h, display: cs.display, bg: cs.backgroundColor, bf: cs.backdropFilter, focusInside: g.contains(document.activeElement), inert: [...document.body.children].filter(e => e.hasAttribute('inert')).length, gated: document.documentElement.classList.contains('sc-gated'), formsHidden: ['sc-form-you', 'sc-form-work', 'sc-form-consent'].every(i => getComputedStyle(document.getElementById(i)).display === 'none'), segs, brand: !!g.querySelector('.sc-gate-brand svg'), h2: h && getComputedStyle(h).fontSize, inputFs: inp && getComputedStyle(inp).fontSize, inputMode: inp && inp.getAttribute('inputmode'), hidden: !!document.getElementById('sc-gate-dob') && document.getElementById('sc-gate-dob').type, order: [...g.querySelectorAll('.sc-gate-form > *')].map(e => e.className.split(' ')[0]), overflow: document.body.style.overflow, lang: document.documentElement.lang }; });
    check(`${tag}: dialog up on arrival - role/modal/labelled, ink stage (no backdrop blur), focus inside, page inert, forms hidden`, g0.role === 'dialog' && g0.modal === 'true' && g0.labelled && g0.display === 'block' && /^rgb\(14, 14, 15\)$/.test(g0.bg) && (g0.bf === 'none' || !g0.bf) && g0.focusInside && g0.inert > 0 && g0.gated && g0.formsHidden, g0);
    check(`${tag}: three numeric segments in locale order (en: m d y), hidden composite, brand mark cloned, title/entry order`, g0.segs.join(',') === 'sc-gate-m,sc-gate-d,sc-gate-y' && g0.hidden === 'hidden' && g0.brand && g0.inputMode === 'numeric' && g0.order.join(',') === 'sc-gate-head,sc-gate-entry', g0);
    console.log('   sizes', tag, 'h2', g0.h2, 'input', g0.inputFs);
    await page.keyboard.press('Escape'); await sleep(150); for (let i = 0; i < 9; i++) await page.keyboard.press('Tab');
    const trap = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', inside: document.getElementById('sc-gate-age').contains(document.activeElement), active: document.activeElement.id || document.activeElement.tagName }));
    check(`${tag}: Escape does not dismiss, Tab cannot leave`, trap.open && trap.inside, trap);
    await page.click('#sc-gate-age-go'); await sleep(300);
    const empty = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', msg: document.getElementById('sc-gate-msg').textContent, bad: [...document.querySelectorAll('.sc-gate-input[aria-invalid="true"]')].length, focus: document.activeElement.id }));
    check(`${tag}: empty submit explains itself, marks the three segments, focuses the first`, empty.open && /date of birth/i.test(empty.msg) && empty.bad === 3 && empty.focus === 'sc-gate-m', empty);
    // typing with auto-advance
    await page.click('#sc-gate-m'); await page.keyboard.type('02'); const afterM = await page.evaluate(() => document.activeElement.id);
    await page.keyboard.type('31'); const afterD = await page.evaluate(() => document.activeElement.id); await page.keyboard.type('2000');
    check(`${tag}: typing auto-advances month -> day -> year`, afterM === 'sc-gate-d' && afterD === 'sc-gate-y', { afterM, afterD });
    await page.click('#sc-gate-age-go'); await sleep(300);
    const impossible = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', msg: document.getElementById('sc-gate-msg').textContent, badIds: [...document.querySelectorAll('.sc-gate-input[aria-invalid="true"]')].map(i => i.id), composite: document.getElementById('sc-gate-dob').value }));
    check(`${tag}: 31 February is named as impossible, the day marked, nothing stored`, impossible.open && /exist/i.test(impossible.msg) && impossible.badIds.join() === 'sc-gate-d' && impossible.composite === '', impossible);
    await page.screenshot({ path: `${OUT}/gate-error-${tag}.png` });
    // backspace back
    await page.click('#sc-gate-y'); await page.evaluate(() => { const y = document.getElementById('sc-gate-y'); y.setSelectionRange(y.value.length, y.value.length); }); for (let i = 0; i < 5; i++) await page.keyboard.press('Backspace'); /* the caret is placed explicitly: on macOS the End key does not collapse a selection, and a focused segment is select-all (one Backspace clears it, the next hops back) */
    const back = await page.evaluate(() => ({ active: document.activeElement.id, y: document.getElementById('sc-gate-y').value, d: document.getElementById('sc-gate-d').value }));
    check(`${tag}: Backspace in an empty year steps back to the day (its content kept)`, back.active === 'sc-gate-d' && back.y === '' && back.d === '31', back);
    // under 14
    await page.fill('#sc-gate-m', '06'); await page.fill('#sc-gate-d', '15'); await page.fill('#sc-gate-y', String(y10)); await page.click('#sc-gate-age-go'); await sleep(900);
    const u14 = await page.evaluate(() => ({ gone: getComputedStyle(document.getElementById('sc-gate-age')).display === 'none', cls: document.documentElement.className, note: !!document.getElementById('sc-gate-u14') && getComputedStyle(document.getElementById('sc-gate-u14')).display !== 'none', focus: document.activeElement.tagName + '.' + document.activeElement.className }));
    check(`${tag}: an under-14 date closes the dialog into the under-14 state with the note in view`, u14.gone && /sc-u14/.test(u14.cls) && u14.note, u14);
    await page.click('#sc-u14-change'); await sleep(700);
    const reopen = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', cleared: ['sc-gate-m', 'sc-gate-d', 'sc-gate-y', 'sc-gate-dob'].every(i => document.getElementById(i).value === ''), gated: document.documentElement.classList.contains('sc-gated'), leaving: document.getElementById('sc-gate-age').classList.contains('is-leaving') }));
    check(`${tag}: "Update your date of birth" re-opens the dialog with the fields cleared`, reopen.open && reopen.cleared && reopen.gated && !reopen.leaving, reopen);
    // adult
    await page.fill('#sc-gate-m', '06'); await page.fill('#sc-gate-d', '15'); await page.fill('#sc-gate-y', String(y22)); await page.screenshot({ path: `${OUT}/gate-filled-${tag}.png` });
    const fading = await page.evaluate(() => { const g = document.getElementById('sc-gate-age'); document.getElementById('sc-gate-age-go').click(); /* read in the same task as the click: the fade class is set synchronously */ return { leaving: g.classList.contains('is-leaving'), opacity: getComputedStyle(g).opacity, gated: document.documentElement.classList.contains('sc-gated') }; });
    await sleep(700);
    const passed = await page.evaluate(() => ({ gone: getComputedStyle(document.getElementById('sc-gate-age')).display === 'none', gated: document.documentElement.classList.contains('sc-gated'), dob: document.getElementById('sc-dob').value, formsOpen: ['sc-form-you', 'sc-form-work', 'sc-form-consent'].every(i => getComputedStyle(document.getElementById(i)).display !== 'none'), inert: [...document.body.children].filter(e => e.hasAttribute('inert')).length, focus: document.activeElement.id, overflow: document.body.style.overflow, ack: (document.getElementById('sc-safety-ack') || {}).checked }));
    check(`${tag}: an adult date fades the stage out (280 ms), carries the date into #sc-dob, opens the form, releases the page, focuses the first field`, fading.leaving && !fading.gated && passed.gone && !passed.gated && passed.dob === y22 + '-06-15' && passed.formsOpen && passed.inert === 0 && passed.overflow === '' && passed.ack !== true, { fading, passed });
    await page.screenshot({ path: `${OUT}/after-${tag}.png` });
    await sleep(2500);
    const page2 = await page.evaluate(() => { const q = document.getElementById('sc-qr'); const img = document.querySelector('.sc-photo img'); const ts = document.getElementById('sc-turnstile-msg'); return { qrKids: q ? q.children.length : -1, qrShown: q ? getComputedStyle(q).display !== 'none' : false, photo: img ? { nat: [img.naturalWidth, img.naturalHeight], box: [Math.round(img.getBoundingClientRect().width), Math.round(img.getBoundingClientRect().height)], fit: getComputedStyle(img).objectFit } : null, tsText: ts ? ts.textContent.trim() : '', inline: !!document.getElementById('sc-safety'), ack: !!document.getElementById('sc-safety-ack') }; });
    const ratioOk = page2.photo && page2.photo.nat[0] > 0 && Math.abs(page2.photo.box[1] / page2.photo.box[0] - page2.photo.nat[1] / page2.photo.nat[0]) < 0.03;
    check(`${tag}: after the gates - the photograph is shown whole (box aspect = natural aspect), no verification sentence, no inline section or checkbox` + (mobile ? '' : ', the desktop QR is drawn'), ratioOk && page2.tsText === '' && !page2.inline && !page2.ack && (mobile ? true : page2.qrKids > 0 && page2.qrShown), page2);
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const again = await page.evaluate(() => ({ present: !!document.getElementById('sc-gate-age'), safetyOpen: !!document.getElementById('sc-gate-safety') && getComputedStyle(document.getElementById('sc-gate-safety')).display !== 'none', open: !!document.getElementById('sc-gate-age') && getComputedStyle(document.getElementById('sc-gate-age')).display !== 'none', gated: document.documentElement.classList.contains('sc-gated'), dob: (document.getElementById('sc-dob') || {}).value, title: document.title, url: location.href, status: document.body.innerText.slice(0, 80) }));
    if (/Just a moment/.test(again.title)) console.log(`SKIP ${tag}: reload was met by the Cloudflare challenge (headless bot check) - not testable here`); else check(`${tag}: a reload in the same session does not re-ask (neither stage)`, !again.open && !again.safetyOpen && !again.gated && again.dob === y22 + '-06-15', again);
    const realErrs = errors.filter(e => !/403|font-size:0;color:transparent/.test(e)); check(`${tag}: no page errors (Cloudflare 403 on the reload and Webflow's console badge excluded)`, realErrs.length === 0, realErrs.slice(0, 3));
    await ctx.close();
  }
  // paste + reduced motion + first-paint stage (desktop)
  { const { ctx, page } = await ctxFor(browser, false);
    await page.goto(URL0, { waitUntil: 'load' }); await sleep(1200); await page.click('#sc-gate-safety-ok'); await sleep(500);
    const pasted = await page.evaluate(() => { const m = document.getElementById('sc-gate-m'); m.focus(); const dt = new DataTransfer(); dt.setData('text', '1995-04-12'); const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }); m.dispatchEvent(ev); return { m: m.value, d: document.getElementById('sc-gate-d').value, y: document.getElementById('sc-gate-y').value, comp: document.getElementById('sc-gate-dob').value, active: document.activeElement.id }; });
    check('paste of an ISO date fills all three segments and lands on the year', pasted.m === '04' && pasted.d === '12' && pasted.y === '1995' && pasted.comp === '1995-04-12' && pasted.active === 'sc-gate-y', pasted);
    await ctx.close(); }
  { const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, reducedMotion: 'reduce' }); const page = await ctx.newPage();
    if (!process.env.LIVE) { await page.route(/theodyx-scouting\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(ROOT + 'theodyx-scouting.js', 'utf8') })); await page.route(u => /theodyx\.com|webflow\.io/.test(u.hostname) && !/\.(js|css|png|jpe?g|webp|woff2?|svg|mp4|ico|json|xml)(\?|$)/.test(u.pathname), async route => { if (route.request().resourceType() !== 'document') return route.continue(); const res = await route.fetch(); let html = await res.text(); html = html.replace(/(<script[^>]*theodyx-scouting\.js[^>]*?)\s+integrity="[^"]*"/g, '$1'); route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } }); }); }
    await page.goto(URL0, { waitUntil: 'load' }); await sleep(1200); await page.click('#sc-gate-safety-ok'); await sleep(200);
    const rm = await page.evaluate(() => ({ anim: getComputedStyle(document.querySelector('.sc-gate-head')).animationName }));
    await page.fill('#sc-gate-m', '06'); await page.fill('#sc-gate-d', '15'); await page.fill('#sc-gate-y', String(y22)); await page.click('#sc-gate-age-go'); await sleep(60);
    const rm2 = await page.evaluate(() => ({ gone: getComputedStyle(document.getElementById('sc-gate-age')).display === 'none' }));
    check('reduced motion: no entrance animation, the stage goes at once', rm.anim === 'none' && rm2.gone, { rm, rm2 });
    await ctx.close(); }
  console.log(`\n${pass} passed, ${fail} failed`); await browser.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
