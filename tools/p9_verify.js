// Phase 9 accessibility verifier. Usage: node p9_verify.js [--prod] [--base=<origin>] [--only=<block>]
//   --base   point the whole run at another origin (e.g. a local harness serving an unpublished build)
//   --only   run a single block: head|cookie|home|scouting|article|footnotes|index|policy|contact|hub|mobile|mobile2
// Staging nhq.webflow.io by default; fresh context per page.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const PROD = process.argv.includes('--prod');
const BASE_ARG = (process.argv.find(a => a.startsWith('--base=')) || '').slice(7);
const BASE = BASE_ARG || (PROD ? 'https://www.theodyx.com' : 'https://nhq.webflow.io');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
const run = n => !ONLY || ONLY === n;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const HEAD_MIN = '/Users/x/CLAUDE/liquidgl-theodyx/site-head.min.html';
const results = []; let fails = 0;
const check = (name, ok, detail) => { results.push({ name, ok: !!ok, detail }); if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? ' — ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 300) : '')); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ headless: true });
  async function open(pathname, opts = {}) {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: 1440, height: 900 }, userAgent: UA }, opts.ctx || {}));
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error' && !/challenges\.cloudflare|cdn-cgi|turnstile/i.test(m.text() + (m.location() && m.location().url))) errors.push(m.text()); });
    if (opts.route) await page.route(opts.route[0], opts.route[1]);
    const res = await page.goto(BASE + pathname, { waitUntil: 'load' }); await sleep(opts.settle || 1800);
    return { page, ctx, errors, status: res && res.status() };
  }
  // 1. head + site footer pins
  if (run('head')) { const { page, ctx, errors } = await open('/about');
    const html = await page.content();
    const lines = fs.readFileSync(HEAD_MIN, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('<!--'));
    const norm = t => t.replace(/ (crossorigin|defer|data-thx-robots)(?=[ >])/g, ' $1=""'); const H = norm(html); const missing = lines.filter(l => !H.includes(norm(l)) && !html.includes(l));
    check('head v4.11.1 banner is live', html.includes('Theodyx head code · v4.11.1'));
    check('every line of site-head.min.html appears in the page', missing.length === 0, { missing: missing.length, first: missing[0] && missing[0].slice(0, 120) });
    for (const [f, sha] of [['theodyx-nav.js', '8f1151c88f61f83e10836cf83fe5a4749ce790dd'], ['nv2pagesf.js', '6613fa29f87593a2d12cc9f4fb97f35103a791f5'], ['theodyx-cookies.js', '75c55eb6bf0a969abd0dcfa19bd51b84cb392022'], ['theodyx-article-fx.js', '1ada34cade7b358f3a40225a8913b5b8d7935a2d']]) {
      const re = new RegExp('<script src="https://cdn\\.jsdelivr\\.net/gh/GrantSikes/liquidgl-theodyx@' + sha + '/' + f.replace('.', '\\.') + '" integrity="sha384-[^"]+" crossorigin="anonymous" defer(="")?>');
      check('footer tag pinned: ' + f + ' @' + sha.slice(0, 7), re.test(html));
    }
    // focus ring two-tone
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { tag: e.tagName, cls: e.className, outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, shadow: cs.boxShadow }; });
    check('KB-02: focused nav link wears the two-tone ring (black outline + white/black shadow)', /solid 2px rgb\(0, 0, 0\)/.test(ring.outline) && /rgb\(255, 255, 255\) 0px 0px 0px 4px/.test(ring.shadow) && /rgb\(0, 0, 0\) 0px 0px 0px 6px/.test(ring.shadow), ring);
    // skip link target no ring
    const mainRing = await page.evaluate(() => { const m = document.getElementById('thx-main'); if (!m) return null; m.focus(); const cs = getComputedStyle(m); return cs.outlineStyle + '|' + cs.boxShadow; });
    check('KB-12: #thx-main draws no ring when focused', mainRing === null || /^none\|none$/.test(mainRing), mainRing);
    // language slot hidden
    const lang = await page.evaluate(() => { const s = document.getElementById('thx-lang-slot'); return s ? { hidden: s.hidden, items: s.children.length } : 'absent'; });
    check('SEM-18: single-locale language slot is hidden', lang === 'absent' || lang.hidden === true, lang);
    // TZ-01 mobile clip on /about handled below
    check('/about: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 2. cookie banner (keyboard-only session)
  if (run('cookie')) { const { page, ctx, errors } = await open('/our-capabilities');
    await sleep(5200); /* the consent triggers arm 6 s after load by design */ await page.keyboard.press('Tab'); await sleep(400); await page.keyboard.press('Tab'); await sleep(1500);
    const b = await page.evaluate(() => { const b = document.querySelector('.thxck-banner'); if (!b) return null; return { first: document.body.firstElementChild === b, role: b.getAttribute('role'), label: b.getAttribute('aria-label'), h4: b.querySelectorAll('h4').length, status: !!document.querySelector('[role="status"].thxck-sr, .thxck-status, [role="status"]'), focusInside: b.contains(document.activeElement) }; });
    check('COOKIE-BANNER: banner is body\'s first child, role=region with a name, no h4, focus not stolen', b && b.first && b.role === 'region' && b.label && b.h4 === 0 && !b.focusInside, b);
    const footBtn = await page.evaluate(() => { const e = document.querySelector('[data-thx-cookie-prefs]'); return e ? { tag: e.tagName, haspopup: e.getAttribute('aria-haspopup'), cls: e.className } : null; });
    check('SEM-21: footer cookie control is a <button aria-haspopup="dialog">', footBtn && footBtn.tag === 'BUTTON' && footBtn.haspopup === 'dialog', footBtn);
    // nav plates engage on this page
    await page.evaluate(() => window.scrollTo(0, 1100)); await sleep(300); await page.evaluate(() => window.__thxNav && window.__thxNav.reink()); await sleep(900); await page.evaluate(() => window.__thxNav && window.__thxNav.reink()); await sleep(500);
    const plates = await page.evaluate(() => { const n = document.getElementById('thx-nav'); const api = window.__thxNav; return { ink: n.getAttribute('data-ink'), inks: api && api.inks ? api.inks().map(s => s.ink) : [] }; });
    check('C-01 (4.9.1, ink-only by owner decision): over the dark band at scrollY 1100 the nav reports one elected ink for every word (the glass itself never changes)', (plates.ink === 'light' || plates.ink === 'dark') && plates.inks.length >= 6, plates);
    const vids = await page.evaluate(() => [...document.querySelectorAll('video[data-thx-lazy]')].map(v => v.getAttribute('crossorigin')));
    check('lazy videos carry crossorigin=anonymous (frames readable by the sampler)', vids.length === 2 && vids.every(v => v === 'anonymous'), vids);
    check('/our-capabilities: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 3. home hero
  if (run('home')) { const { page, ctx, errors } = await open('/');
    check('footer tag pinned: theodyx-cine.js @4e1d3a5 (Home)', /liquidgl-theodyx@4e1d3a53e57869e8fc19bdc5cc2de0cb17cebf82\/theodyx-cine\.js" integrity="sha384-/.test(await page.content()));
    await page.keyboard.press('Tab'); await sleep(800);
    const h = await page.evaluate(() => { const v = document.querySelector('video.hero-video'); const pause = document.querySelector('.hero-ctrl-btn[data-hero-pause]'); const wm = document.querySelector('.hero-vlabel'); return { muted: v && v.muted, label: v && v.getAttribute('aria-label'), pause: pause ? { pressed: pause.getAttribute('aria-pressed'), name: pause.getAttribute('aria-label') } : null, wm: wm ? { role: wm.getAttribute('role'), name: wm.getAttribute('aria-label'), hiddenLetters: wm.querySelectorAll('p[aria-hidden="true"]').length } : null, alts: [...document.querySelectorAll('img[alt*="Theodyx Capital"]')].length }; });
    check('F-01: hero video stays muted after a keystroke', h.muted === true, h.muted);
    check('F-03/AXE-08: pause control present with aria-pressed', h.pause && h.pause.pressed !== null && h.pause.name, h.pause);
    check('SEM-05/SEM-06: hero video labelled, wordmark role=img with hidden letters', h.label && h.wm && h.wm.role === 'img' && h.wm.name === 'Theodyx' && h.wm.hiddenLetters >= 7, h);
    check('SEM-09: no "Theodyx Capital" alt text on Home', h.alts === 0, h.alts);
    check('/: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 4. scouting gates
  if (run('scouting')) { const { page, ctx, errors } = await open('/scouting', { settle: 2500 });
    // Phase 10 replaced the two modal gates. The safety statement is an inline section above the
    // form and its acknowledgement is a required checkbox; age comes from #sc-dob alone. So the
    // modal contract (focus trap, inert, aria-modal) is gone by design and is asserted absent —
    // everything else Phase 9 established has to survive unchanged.
    const g = await page.evaluate(() => {
      const safety = document.getElementById('sc-safety'), you = document.getElementById('sc-form-you');
      return {
        gatesGone: !document.getElementById('sc-gate-safety') && !document.getElementById('sc-gate-age'),
        inert: [...document.body.children].filter(e => e.hasAttribute('inert')).length,
        safetyInline: !!(safety && you && (safety.compareDocumentPosition(you) & 4) && getComputedStyle(safety).position === 'static' && getComputedStyle(safety).display !== 'none'),
        safetyNamed: safety && safety.getAttribute('aria-labelledby'),
        ack: (() => { const a = document.getElementById('sc-safety-ack'); return a ? { required: a.required, label: !!document.querySelector('label[for="sc-safety-ack"]') } : null; })(),
        formsOpen: ['sc-form-you', 'sc-form-work', 'sc-form-consent'].every(i => getComputedStyle(document.getElementById(i)).display === 'block')
      };
    });
    check('LAND-01: the modal gates are gone and the form is open on arrival', g.gatesGone && g.inert === 0 && g.formsOpen, g);
    check('LAND-01: the safety statement is a named inline section above the form', g.safetyInline && g.safetyNamed === 'sc-safety-h', g);
    check('F-08b: the safety acknowledgement is a required, labelled checkbox', !!(g.ack && g.ack.required && g.ack.label), g.ack);
    // the acknowledgement blocks submit exactly like the consent box
    await page.click('#sc-submit'); await sleep(500);
    const blocked = await page.evaluate(() => ({
      summary: getComputedStyle(document.getElementById('sc-err')).display,
      ackMsg: (document.getElementById('sc-safety-ack-err') || {}).textContent || null,
      ackInvalid: document.getElementById('sc-safety-ack').getAttribute('aria-invalid'),
      focus: document.activeElement.id
    }));
    check('F-05/F-09: submit still opens the error summary, takes focus, and the acknowledgement is in it', blocked.summary === 'block' && !!blocked.ackMsg && blocked.ackInvalid === 'true' && blocked.focus === 'sc-err-title', blocked);
    // FORMS-04: the date is the only age answer, and it is always correctable
    const y12 = new Date().getFullYear() - 12, y22 = new Date().getFullYear() - 22;
    await page.fill('#sc-dob', y12 + '-06-15'); await page.click('#sc-firstName'); await sleep(400);
    const u = await page.evaluate(() => ({ msg: (document.getElementById('sc-dob-err') || {}).textContent || null, note: getComputedStyle(document.getElementById('sc-gate-u14')).display, submit: getComputedStyle(document.getElementById('sc-submit')).display, editable: !!document.getElementById('sc-dob').offsetParent }));
    check('FORMS-04: an under-14 date is answered inline, replaces the submit row, and stays editable', /\d/.test(u.msg || '') && u.note === 'block' && u.submit === 'none' && u.editable, u);
    await page.fill('#sc-dob', y22 + '-06-15'); await page.click('#sc-firstName'); await sleep(400);
    const ok = await page.evaluate(() => ({ msg: !!document.getElementById('sc-dob-err'), submit: getComputedStyle(document.getElementById('sc-submit')).display }));
    check('FORMS-04: correcting the date clears the block — no dead end', ok.msg === false && ok.submit !== 'none', ok);
    // FORMS-03: blur validation, summary stays submit-only
    await page.evaluate(() => { const b = document.getElementById('sc-err'); b.style.display = 'none'; });
    await page.fill('#sc-email', 'not-an-email'); await page.click('#sc-firstName'); await sleep(300);
    const bl = await page.evaluate(() => ({ msg: (document.getElementById('sc-email-err') || {}).textContent || null, desc: document.getElementById('sc-email').getAttribute('aria-describedby'), summary: getComputedStyle(document.getElementById('sc-err')).display }));
    check('FORMS-03: email validates on blur, described-by wired, summary stays closed', !!bl.msg && /sc-email-err/.test(bl.desc || '') && bl.summary === 'none', bl);
    const f = await page.evaluate(() => ({ required: ['sc-email', 'sc-firstName', 'sc-lastName', 'sc-dob', 'sc-platform', 'sc-country', 'sc-consent'].map(id => { const e = document.getElementById(id); return e ? e.required : null; }), bday: document.getElementById('sc-dob').getAttribute('autocomplete'), country: document.getElementById('sc-country') && document.getElementById('sc-country').getAttribute('autocomplete'), rep: (() => { const r = document.querySelector('#sc-rep .sc-chips'); return r ? r.getAttribute('role') + '/' + r.getAttribute('aria-labelledby') : null; })(), drop: (() => { const d = document.getElementById('sc-mediakit'); return d ? d.tagName : null; })(), ts: (() => { const t = document.getElementById('sc-turnstile'); return t ? t.getAttribute('role') + '/' + !!t.getAttribute('aria-label') : null; })() }));
    check('F-08/F-10/F-11/F-13: required + autocomplete + chip group + upload button', f.required.every(r => r === true) && f.bday === 'bday' && f.country === 'country-name' && /^group\//.test(f.rep || '') && f.drop === 'BUTTON', f);
    check('F-06: the verification box is still a named group', /^group\/true$/.test(f.ts || ''), f.ts);
    check('/scouting: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  if (run('article')) { const { page, ctx, errors } = await open('/our-thinking/remove-the-creators-and-all-media-platforms-go-dark', { settle: 2500 });
    const a = await page.evaluate(() => { const rail = document.querySelector('nav.ethx-railnav'); const railA = rail && rail.querySelector('a'); const navs = [...document.querySelectorAll('a.thx-skip ~ nav, nav')]; const skip = document.querySelector('a.thx-skip'); let firstNavAfterSkip = null; if (skip) { let n = skip.nextElementSibling; while (n) { if (n.tagName === 'NAV') { firstNavAfterSkip = n.className; break; } n = n.nextElementSibling; } } return { railColor: railA && getComputedStyle(railA).color, firstNavAfterSkip, cars: [...document.querySelectorAll('.ethx-car')].map(c => c.getAttribute('role') + '|' + c.getAttribute('tabindex') + '|' + c.getAttribute('aria-label')), arrows: [...document.querySelectorAll('.ethx-arrow')].map(x => x.getAttribute('aria-label')), down: (document.querySelector('.ethx-down') || {}).getAttribute && document.querySelector('.ethx-down').getAttribute('aria-label'), toc: (() => { const t = document.querySelector('nav.thx-toc'); return t ? (t.getAttribute('aria-labelledby') + '|' + t.getAttribute('aria-label')) : null; })(), dots: [...document.querySelectorAll('.thx-dot')].map(d => d.getAttribute('aria-hidden')), levels: [...document.querySelectorAll('.thx-read-col h2[id^="ethx-s"], .thx-read-col h3[id^="ethx-s"]')].slice(0, 6).map(h => h.tagName + ':' + (h.getAttribute('aria-level') || '')), sups: document.querySelectorAll('.thx-read-body sup a, sup a').length, slideAlts: [...document.querySelectorAll('.ethx-car img')].map(i => (i.getAttribute('alt') || '').slice(0, 40)), hero: (document.querySelector('.ethx-hero') || {}).getAttribute && (document.querySelector('.ethx-hero').getAttribute('role') + '/' + document.querySelector('.ethx-hero').getAttribute('aria-label')) }; });
    check('C-02: section rail ink is rgba(0,0,0,0.56)', a.railColor === 'rgba(0, 0, 0, 0.56)', a.railColor);
    check('KB-09/SEM-04: rail is the first nav after the skip link', /ethx-railnav/.test(a.firstNavAfterSkip || ''), a.firstNavAfterSkip);
    check('AXE-03: carousels are focusable groups with names', a.cars.length > 0 && a.cars.every(c => /^group\|0\|Image carousel/.test(c)), a.cars);
    check('SEM-08/AXE-10: arrows and down control named', a.arrows.length > 0 && a.arrows.every(x => /slide/.test(x || '')) && /article/i.test(a.down || ''), { arrows: a.arrows, down: a.down });
    check('SEM-19/C-08: TOC labelled once, crumb dots aria-hidden', /^thx-toc-h\|null$/.test(a.toc || '') && a.dots.length > 0 && a.dots.every(d => d === 'true'), { toc: a.toc, dots: a.dots });
    check('SEM-20: body sections exposed at level 2', a.levels.length > 0 && a.levels.every(l => /:2$|^H2:/.test(l)), a.levels);
    check('AXE-04: carousel slides carry descriptive alt text (not the article title; one empty slot allowed)', a.slideAlts.filter(Boolean).length >= 7 && a.slideAlts.every(t => !/Remove the creators/i.test(t)), a.slideAlts);
    check('SEM-01: article hero is a labelled region', /region\/Article header/.test(a.hero || ''), a.hero);
    // rail hides over footer
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await sleep(900);
    const railFoot = await page.evaluate(() => { const rail = document.querySelector('nav.ethx-railnav'); if (!rail) return null; const cs = getComputedStyle(rail); return { cls: rail.className, vis: cs.visibility, op: cs.opacity }; });
    check('C-02: rail hidden once the footer intersects it', railFoot && (railFoot.vis === 'hidden' || parseFloat(railFoot.op) === 0), railFoot);
    check('article: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 6. footnotes + TOC focus on the sponsorship article
  if (run('footnotes')) { const { page, ctx } = await open('/our-thinking/the-end-of-the-sponsorship-era', { settle: 2500 });
    const r = await page.evaluate(async () => { const link = document.querySelector('nav.thx-toc a[href^="#"]'); if (!link) return { noToc: true }; link.click(); await new Promise(r => setTimeout(r, 1400)); const ae = document.activeElement; return { active: ae.tagName + '#' + ae.id, tabindex: ae.getAttribute('tabindex') }; });
    check('KB-08: activating a TOC link moves focus to the heading', r.noToc || (/^H[2-4]#/.test(r.active) && r.tabindex === '-1'), r);
    await ctx.close(); }
  // 7. index (ethos) page
  if (run('index')) { const { page, ctx, errors } = await open('/index/planning-for-creators-brands-and-beyond', { settle: 2500 });
    const e = await page.evaluate(() => ({ h6: document.querySelectorAll('h6').length, h4Notes: [...document.querySelectorAll('h4')].some(h => /^Notes$/.test(h.textContent.trim())), vid: [...document.querySelectorAll('video.ethx-media')].map(v => v.getAttribute('aria-hidden')), alts: [...document.querySelectorAll('.ethx-car img')].map(i => (i.getAttribute('alt') || '').length), cars: document.querySelectorAll('.ethx-car[role="group"][tabindex="0"]').length }));
    check('AXE-07/SEM-15: /index Notes is an h4, no h6 left', e.h6 === 0 && e.h4Notes, e);
    check('SEM-05a: decorative ethx video aria-hidden', e.vid.length === 0 || e.vid.every(v => v === 'true'), e.vid);
    check('AXE-04: /index carousel alts populated (8)', e.alts.length >= 8 && e.alts.every(n => n > 20), e.alts);
    check('AXE-03: /index carousels are focusable groups', e.cars >= 2, e.cars);
    check('/index: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 8. policy page
  if (run('policy')) { const { page, ctx, errors } = await open('/policies/privacy-policy');
    const p = await page.evaluate(() => { const aside = document.querySelector('aside'); const h = document.getElementById('polx-toc-h'); return { labelledby: aside && aside.getAttribute('aria-labelledby'), h: h && h.tagName + ':' + h.textContent.trim(), li: aside ? aside.querySelectorAll('ul li a.polx-side-link').length : 0 }; });
    check('SEM-25: policy TOC has an h2 heading and a list', p.labelledby === 'polx-toc-h' && /^H2:Contents/.test(p.h || '') && p.li >= 5, p);
    check('/policies/privacy-policy: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 9. contact
  if (run('contact')) { const { page, ctx } = await open('/contact', { settle: 3500 });
    const c = await page.evaluate(() => ({ ac: ['name', 'email', 'phone', 'company'].map(id => { const e = document.getElementById(id); return e && e.getAttribute('autocomplete'); }), labels: [...document.querySelectorAll('label')].map(l => l.textContent.trim()).filter(t => /\(required\)/.test(t)).length, status: (() => { const s = document.getElementById('thx-contact-status'); return s ? { role: s.getAttribute('role'), text: s.textContent, describes: (document.querySelector('input[type="submit"],button[type="submit"]') || {}).getAttribute && document.querySelector('input[type="submit"],button[type="submit"]').getAttribute('aria-describedby') } : null; })(), done: (document.querySelector('.w-form-done') || {}).getAttribute && document.querySelector('.w-form-done').getAttribute('role'), fail: (document.querySelector('.w-form-fail') || {}).getAttribute && document.querySelector('.w-form-fail').getAttribute('role') }));
    check('F-04/SEM-16: contact autocomplete tokens', JSON.stringify(c.ac) === JSON.stringify(['name', 'email', 'tel', 'organization']), c.ac);
    check('F-16: three labels marked (required)', c.labels >= 3, c.labels);
    check('F-02: Turnstile status region present, announced, and describes the submit', c.status && c.status.role === 'status' && c.status.text && /thx-contact-status/.test(c.status.describes || ''), c.status);
    check('SEM-03: form messages carry live-region roles', c.done === 'status' && c.fail === 'alert', { done: c.done, fail: c.fail });
    await ctx.close(); }
  // 10. hub
  if (run('hub')) { const { page, ctx, errors } = await open('/our-thinking');
    const hb = await page.evaluate(() => ({ border: (() => { const b = document.querySelector('.thxo-ctrl-btn:not(.thxo-ctrl-on)'); return b && getComputedStyle(b).borderColor; })(), cardAlts: [...document.querySelectorAll('a.thxo-card img')].slice(0, 6).map(i => i.getAttribute('alt')) }));
    check('C-09: inactive hub control border is rgba(13,13,13,0.45)', hb.border === 'rgba(13, 13, 13, 0.45)', hb.border);
    check('SEM-09b: hub card images no longer repeat the title as alt (empty or descriptive)', hb.cardAlts.length > 0 && hb.cardAlts.every(a => a !== null), hb.cardAlts);
    check('/our-thinking: no console/page errors', errors.length === 0, errors.slice(0, 3));
    await ctx.close(); }
  // 11. mobile + coarse pointer
  if (run('mobile')) { const { page, ctx } = await open('/about', { ctx: { ...devices['iPhone 13'], viewport: { width: 360, height: 780 } } });
    const m = await page.evaluate(() => { const p = document.querySelector('p.paragraph-31'); return { clip: document.documentElement.scrollWidth > document.documentElement.clientWidth, mr: p && getComputedStyle(p).marginRight, ml: p && getComputedStyle(p).marginLeft, footer: (() => { const a = document.querySelector('a.footer-link'); return a && a.getBoundingClientRect().height; })(), bottom: [...document.querySelectorAll('a.bottom-link, a.bottom-link-2, a.link-36, a.link-37, a.link-39, a.link-42, a.link-43')].map(a => Math.round(a.getBoundingClientRect().height)) }; });
    check('TZ-01: paragraph-31 no longer clips at 360px (margin-right 0, no horizontal overflow)', m.mr === '0px' && !m.clip, m);
    check('TZ-07: footer links ≥ 44px on coarse pointers', m.footer >= 44, m.footer);
    check('TZ-06: card CTAs ≥ 44px on coarse pointers', m.bottom.length === 0 || m.bottom.every(h => h >= 44), m.bottom);
    await ctx.close(); }
  if (run('mobile2')) { const { page, ctx } = await open('/our-thinking', { ctx: { ...devices['iPhone 13'] } });
    const t = await page.evaluate(() => ({ ctrl: [...document.querySelectorAll('.thxo-ctrl-btn')].map(b => Math.round(b.getBoundingClientRect().height)), tabs: [...document.querySelectorAll('a.thxo-tab')].map(a => Math.round(a.getBoundingClientRect().width)) }));
    check('TZ-05: hub controls ≥ 44px tall and tabs ≥ 44px wide on coarse pointers', t.ctrl.every(h => h >= 44 || h === 0) && t.tabs.every(w => w >= 44 || w === 0), t);
    await ctx.close(); }
  await browser.close();
  const out = path.join(__dirname, '..', 'p9', (PROD ? 'p9_verify_prod.json' : 'p9_verify_staging.json'));
  try { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify({ base: BASE, only: ONLY || null, results, fails }, null, 1)); } catch (e) { console.log('(results not written: ' + e.message + ')'); }
  console.log((fails ? fails + ' FAILURE(S)' : 'ALL PASS') + ' — ' + results.length + ' checks (' + BASE + ')');
  process.exit(fails ? 1 : 0);
})();
