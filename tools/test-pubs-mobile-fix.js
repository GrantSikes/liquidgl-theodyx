#!/usr/bin/env node
/*
 * test-pubs-mobile-fix.js — standalone regression test for the protected
 * "Publications Template mobile scroll fix" (Theodyx non-negotiable #7).
 *
 * Mechanism under test (as shipped 2026-08-26, ROUND 7):
 *   L1  theodyxr2media 1.1.0 (page-level script on both CMS templates) detects touch
 *       (pointer:coarse || navigator.maxTouchPoints>0 || 'ontouchstart' in window), adds
 *       html.xp-touch and writes INLINE !important styles on .ethx-hero/.ethx-divider
 *       (position:relative; top:auto; height:72svh) + animation/transform:none on hero media.
 *   L2  html.xp-touch CSS mirrors in the pubs embed (v3.2.0) and the Ethos glue (v3.3).
 *   L3  @media (hover:none) and (pointer:coarse) blocks in the same embeds.
 *
 * Usage:
 *   node test-pubs-mobile-fix.js [--profiles=pixel7,iphone14,ipad7p,ipad7l,desktop1440]
 *                                [--out=<dir>] [--screens] [--json=<file>] [url ...]
 *   URLS env var (comma-separated) also accepted. Default URL set = 3 pubs + 1 Ethos page.
 * Exit code 1 if any assertion fails or a page cannot be measured.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium, webkit, devices } = require('playwright');

// ---------- config ----------
const args = process.argv.slice(2);
const opt = (name, def) => { const a = args.find(x => x.startsWith(`--${name}=`)); return a ? a.split('=').slice(1).join('=') : def; };
const flag = name => args.includes(`--${name}`);
const argUrls = args.filter(a => !a.startsWith('--'));
const DEFAULT_URLS = [
  'https://www.theodyx.com/our-thinking/what-automation-cannot-replace',
  'https://www.theodyx.com/our-thinking/remove-the-creators-and-all-media-platforms-go-dark',
  'https://www.theodyx.com/our-thinking/the-end-of-the-sponsorship-era',
  'https://www.theodyx.com/index/planning-for-creators-brands-and-beyond',
];
const URLS = argUrls.length ? argUrls : (process.env.URLS ? process.env.URLS.split(',').map(s => s.trim()).filter(Boolean) : DEFAULT_URLS);
const OUT = opt('out', path.join(__dirname, '..', 'data', 'pubs_mobile_fix'));
const SCREENS = flag('screens');
const JSON_OUT = opt('json', path.join(OUT, `results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`));
const SETTLE_MS = Number(opt('settle', 2500));
const SCROLL_STEPS = [0, 300, 700, 1200];
const SHOT_STEPS = [0, 600, 1400];

const PROFILES = {
  pixel7:      { engine: 'chromium', device: 'Pixel 7',             touch: true,  label: 'Chromium Pixel 7 (412x839, touch, mobile)' },
  iphone14:    { engine: 'webkit',   device: 'iPhone 14',           touch: true,  label: 'WebKit iPhone 14 (390x664, touch, mobile)' },
  ipad7p:      { engine: 'webkit',   device: 'iPad (gen 7)',        touch: true,  label: 'WebKit iPad gen7 portrait (810x1080, touch)' },
  ipad7l:      { engine: 'webkit',   device: 'iPad (gen 7) landscape', touch: true, label: 'WebKit iPad gen7 landscape (1080x810, touch)' },
  desktop1440: { engine: 'chromium', device: null,                  touch: false, label: 'Chromium desktop 1440x900 (mouse, control)',
                 ctx: { viewport: { width: 1440, height: 900 }, hasTouch: false, isMobile: false,
                        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' } },
  // Informational: a touchscreen laptop (desktop UA/viewport, fine pointer, but maxTouchPoints>0).
  // r2media's 3-way detection deliberately treats this as touch -> static hero expected.
  touchlaptop1440: { engine: 'chromium', device: null, touch: true, label: 'Chromium desktop 1440x900 + hasTouch (touchscreen laptop, informational)',
                 ctx: { viewport: { width: 1440, height: 900 }, hasTouch: true, isMobile: false,
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' } },
};
const DEFAULT_PROFILES = ['pixel7', 'iphone14', 'ipad7p', 'ipad7l', 'desktop1440'];
const PROFILE_KEYS = opt('profiles', DEFAULT_PROFILES.join(',')).split(',').map(s => s.trim()).filter(k => PROFILES[k]);

fs.mkdirSync(OUT, { recursive: true });
const slugOf = u => new URL(u).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home';
const isPubs = u => /\/our-thinking\//.test(new URL(u).pathname);

// ---------- in-page measurement ----------
function measureInPage() {
  const sel = el => { if (!el) return null; let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.classList.length) s += '.' + [...el.classList].slice(0, 4).join('.'); return s; };
  const cs = el => el ? getComputedStyle(el) : null;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:72vh;pointer-events:none;visibility:hidden';
  document.body.appendChild(probe);
  const px72vh = probe.getBoundingClientRect().height;
  probe.style.setProperty('height', '72svh');
  const px72svh = probe.getBoundingClientRect().height;
  probe.style.setProperty('height', '100svh');
  const px100svh = probe.getBoundingClientRect().height;
  probe.remove();
  const hero = document.querySelector('.ethx-hero');
  const divider = document.querySelector('.ethx-divider');
  const heroMedia = document.querySelector('.ethx-hero img.ethx-media, .ethx-hero video.ethx-media');
  const heroMediaAll = [...document.querySelectorAll('.ethx-hero img.ethx-media, .ethx-hero video.ethx-media')];
  const divImg = divider ? divider.querySelector('img') : null;
  const heroInnerKids = [...document.querySelectorAll('.ethx-heroinner > *')];
  const arrows = [...document.querySelectorAll('.ethx-arrows')].map(a => {
    const band = a.closest('.xp-band');
    const c = cs(a);
    const r = a.getBoundingClientRect();
    return { sel: sel(a), inBand: !!band, display: c.display, visibility: c.visibility, opacity: c.opacity, w: Math.round(r.width), h: Math.round(r.height),
      renderedVisible: c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0 && a.offsetParent !== null,
      ancestorsHidden: (() => { let p = a.parentElement; while (p) { const d = cs(p).display; if (d === 'none') return true; p = p.parentElement; } return false; })() };
  });
  const stickyFixed = [];
  const all = document.querySelectorAll('body *');
  for (const el of all) { const p = cs(el).position; if (p === 'sticky' || p === 'fixed') { stickyFixed.push({ sel: sel(el), position: p, display: cs(el).display }); if (stickyFixed.length >= 60) break; } }
  const overflowers = [];
  const iw = innerWidth;
  for (const el of all) { const r = el.getBoundingClientRect(); if (r.width > 0 && (r.right > iw + 1 || r.left < -1) && cs(el).position !== 'fixed') { overflowers.push({ sel: sel(el), left: Math.round(r.left), right: Math.round(r.right), overflowX: cs(el).overflowX }); if (overflowers.length >= 20) break; } }
  const styleText = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
  const m = (re) => { const x = styleText.match(re); return x ? x[1] : null; };
  const scripts = [...document.scripts].map(s => s.src).filter(Boolean).filter(s => /r2media|pubs-xp|pubsxp|ethos|article-fx/.test(s)).map(s => s.split('/').pop());
  const dividerHidden = divider ? (cs(divider).display === 'none') : null;
  return {
    ua: navigator.userAgent, innerWidth, innerHeight, hidden: document.hidden, title: document.title,
    challenge: /Just a moment/i.test(document.title) || /cf-chl|challenge-platform/.test(document.documentElement.innerHTML.slice(0, 200000)),
    xpTouch: document.documentElement.classList.contains('xp-touch'),
    mq: { pointerCoarse: matchMedia('(pointer: coarse)').matches, hoverNone: matchMedia('(hover: none)').matches, maxTouchPoints: navigator.maxTouchPoints || 0, ontouchstart: 'ontouchstart' in window, max767: matchMedia('(max-width:767px)').matches, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
    px72vh, px72svh, px100svh,
    hero: hero ? { sel: sel(hero), position: cs(hero).position, top: cs(hero).top, height: cs(hero).height, rectH: Math.round(hero.getBoundingClientRect().height * 100) / 100, rectTop: hero.getBoundingClientRect().top, display: cs(hero).display, inline: hero.getAttribute('style'), zIndex: cs(hero).zIndex } : null,
    divider: divider ? { sel: sel(divider), position: cs(divider).position, top: cs(divider).top, height: cs(divider).height, rectH: Math.round(divider.getBoundingClientRect().height * 100) / 100, display: cs(divider).display, hidden: dividerHidden, inline: divider.getAttribute('style'), imgEmpty: divImg ? divImg.classList.contains('w-dyn-bind-empty') : null, docTop: divider.getBoundingClientRect().top + scrollY } : null,
    heroMedia: heroMedia ? { sel: sel(heroMedia), tag: heroMedia.tagName.toLowerCase(), animationName: cs(heroMedia).animationName, transform: cs(heroMedia).transform, inline: heroMedia.getAttribute('style'), count: heroMediaAll.length, srcHost: (heroMedia.currentSrc || heroMedia.src || '').split('/')[2] || null, r2: heroMedia.classList.contains('xp-r2'), empty: heroMedia.classList.contains('w-dyn-bind-empty') } : null,
    heroMediaAll: heroMediaAll.map(el => ({ sel: sel(el), tag: el.tagName.toLowerCase(), animationName: cs(el).animationName, transform: cs(el).transform, display: cs(el).display, inline: el.getAttribute('style') })),
    dividerImg: divImg ? { animationName: cs(divImg).animationName, transform: cs(divImg).transform, inline: divImg.getAttribute('style') } : null,
    heroInnerKids: heroInnerKids.map(el => ({ sel: sel(el), animationName: cs(el).animationName, inline: el.getAttribute('style') })),
    arrows, stickyFixed, overflowers,
    scrollWidth: document.scrollingElement.scrollWidth, docScrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, scrollHeight: document.scrollingElement.scrollHeight,
    versions: { pubsEmbed: m(/Ethos parity \+ reading experience v(\d+\.\d+\.\d+)/), editorialEmbed: m(/Publications template v(\d+\.\d+\.\d+)/), composerDeclared: m(/Composer: theodyxpubsxp (\d+\.\d+\.\d+)/), ethosGlue: m(/Ethos story template glue v(\d+\.\d+(?:\.\d+)?)/), scripts },
    bodyOverflowX: cs(document.body).overflowX, htmlOverflowX: cs(document.documentElement).overflowX,
  };
}

async function scrollTrack(page, selector, steps) {
  return page.evaluate(async ({ selector, steps }) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const out = [];
    for (const y of steps) {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
      await raf(); await new Promise(r => setTimeout(r, 60)); await raf();
      out.push({ requested: y, scrollY: Math.round(scrollY), top: Math.round(el.getBoundingClientRect().top * 100) / 100 });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); await raf();
    return out;
  }, { selector, steps });
}

function trackVerdict(track) {
  // returns { ok, maxDrift } : ok if element top moves exactly -Δscroll (1:1 with content)
  if (!track || track.length < 2) return { ok: null, maxDrift: null };
  let maxDrift = 0;
  for (let i = 1; i < track.length; i++) {
    const dScroll = track[i].scrollY - track[0].scrollY;
    const dTop = track[i].top - track[0].top;
    maxDrift = Math.max(maxDrift, Math.abs(dTop + dScroll));
  }
  return { ok: maxDrift <= 2, maxDrift: Math.round(maxDrift * 100) / 100 };
}

async function launch(profile, persistent) {
  const p = PROFILES[profile];
  const engine = p.engine === 'webkit' ? webkit : chromium;
  const ctxOpts = p.device ? { ...devices[p.device] } : { ...p.ctx };
  ctxOpts.locale = 'en-US';
  ctxOpts.colorScheme = 'light';
  if (persistent && p.engine === 'chromium') {
    const dir = path.join(OUT, `.profile-${profile}`);
    const ctx = await chromium.launchPersistentContext(dir, { ...ctxOpts, headless: true, args: ['--disable-blink-features=AutomationControlled'] });
    return { browser: null, ctx };
  }
  const browser = await engine.launch({ headless: true, args: p.engine === 'chromium' ? ['--disable-blink-features=AutomationControlled'] : [] });
  const ctx = await browser.newContext(ctxOpts);
  return { browser, ctx };
}

async function loadAndMeasure(ctx, url, profile) {
  const page = await ctx.newPage();
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const status = res ? res.status() : null;
  const headers = res ? res.headers() : {};
  try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch (e) { /* beacons may never settle */ }
  try { await page.waitForSelector('.nav, .site-navbar', { timeout: 15000 }); } catch (e) { /* recorded via navPresent */ }
  await page.waitForTimeout(SETTLE_MS);
  const navPresent = await page.$('.nav, .site-navbar') !== null;
  const data = await page.evaluate(measureInPage);
  data.status = status; data.cfMitigated = headers['cf-mitigated'] || null; data.server = headers['server'] || null; data.navPresent = navPresent;
  if (!data.challenge) {
    data.heroTrack = await scrollTrack(page, '.ethx-hero', SCROLL_STEPS);
    if (data.divider && !data.divider.hidden) {
      const d = Math.round(data.divider.docTop);
      data.dividerTrack = await scrollTrack(page, '.ethx-divider', [Math.max(0, d - 400), Math.max(0, d - 100), d + 100, d + 300]);
      // post-scroll: did any scroll handler (pubsxp divider parallax) overwrite the inline transform:none?
      data.dividerImgAfterScroll = await page.evaluate(async (d) => {
        const img = document.querySelector('.ethx-divider img'); if (!img) return null;
        window.scrollTo({ top: d - 200, behavior: 'instant' });
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));
        const out = { transform: getComputedStyle(img).transform, animationName: getComputedStyle(img).animationName, inline: img.getAttribute('style') };
        window.scrollTo({ top: 0, behavior: 'instant' });
        return out;
      }, d);
    }
    // post-scroll hero media check (Ken Burns / any scroll-driven transform)
    data.heroMediaAfterScroll = await page.evaluate(async () => {
      const el = document.querySelector('.ethx-hero img.ethx-media, .ethx-hero video.ethx-media'); if (!el) return null;
      window.scrollTo({ top: 400, behavior: 'instant' });
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));
      const out = { transform: getComputedStyle(el).transform, animationName: getComputedStyle(el).animationName, inline: el.getAttribute('style') };
      window.scrollTo({ top: 0, behavior: 'instant' });
      return out;
    });
    if (SCREENS && (profile === 'pixel7' || profile === 'iphone14')) {
      data.screens = [];
      for (const y of SHOT_STEPS) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(400);
        const f = path.join(OUT, `${profile}-${slugOf(url)}-s${y}.png`);
        await page.screenshot({ path: f, fullPage: false });
        data.screens.push(f);
      }
    }
  }
  await page.close();
  return data;
}

function assess(profileKey, url, d) {
  const p = PROFILES[profileKey];
  const checks = [];
  const add = (name, ok, detail, applicable = true) => checks.push({ name, ok: applicable ? !!ok : null, detail });
  if (d.challenge) { add('no-cf-challenge', false, `title="${d.title}" cf-mitigated=${d.cfMitigated}`); return checks; }
  add('http-200', d.status === 200, `status=${d.status}`);
  add('hero-present', !!d.hero, d.hero ? d.hero.sel : 'no .ethx-hero');
  const heroTrack = trackVerdict(d.heroTrack);
  const divTrack = trackVerdict(d.dividerTrack);
  const heroH = d.hero ? d.hero.rectH : null;
  const heroIs72 = heroH != null && Math.abs(heroH - d.px72svh) <= 2;
  const heroIs100 = heroH != null && Math.abs(heroH - d.px100svh) <= 2;
  if (p.touch) {
    add('touch-detected-by-page', d.mq.pointerCoarse || d.mq.maxTouchPoints > 0 || d.mq.ontouchstart, `pointer:coarse=${d.mq.pointerCoarse} hover:none=${d.mq.hoverNone} maxTouchPoints=${d.mq.maxTouchPoints} ontouchstart=${d.mq.ontouchstart}`);
    add('html.xp-touch set', d.xpTouch, `xp-touch=${d.xpTouch}`);
    add('hero position:relative', d.hero && d.hero.position === 'relative', d.hero ? `position=${d.hero.position} top=${d.hero.top}` : 'n/a');
    add('hero inline !important styles (r2media L1)', d.hero && /position:\s*relative\s*!important/.test(d.hero.inline || '') && /height:\s*72(s?)vh\s*!important/.test(d.hero.inline || ''), d.hero ? `style="${d.hero.inline}"` : 'n/a');
    add('hero height = 72svh', heroIs72, `rectH=${heroH} 72svh=${d.px72svh} 72vh=${d.px72vh} 100svh=${d.px100svh} computed=${d.hero && d.hero.height}`);
    add('hero media animation:none + transform:none', !d.heroMedia || (d.heroMedia.animationName === 'none' && d.heroMedia.transform === 'none'), d.heroMedia ? `${d.heroMedia.tag} anim=${d.heroMedia.animationName} transform=${d.heroMedia.transform} inline="${d.heroMedia.inline}"` : 'no hero media', !!d.heroMedia);
    add('hero scrolls 1:1 with content', heroTrack.ok, `maxDrift=${heroTrack.maxDrift}px track=${JSON.stringify(d.heroTrack)}`);
    add('divider position:relative', !d.divider || d.divider.position === 'relative', d.divider ? `position=${d.divider.position} display=${d.divider.display} imgEmpty=${d.divider.imgEmpty} inline="${d.divider.inline}"` : 'no .ethx-divider', !!d.divider);
    add('divider scrolls 1:1 (when shown)', divTrack.ok !== false, d.dividerTrack ? `maxDrift=${divTrack.maxDrift}px track=${JSON.stringify(d.dividerTrack)}` : 'divider hidden/absent (n/a)', !!d.dividerTrack);
    add('divider img transform:none after scroll (no parallax on touch)', !d.dividerImgAfterScroll || d.dividerImgAfterScroll.transform === 'none', d.dividerImgAfterScroll ? `after-scroll transform=${d.dividerImgAfterScroll.transform} inline="${d.dividerImgAfterScroll.inline}"` : 'divider hidden/absent (n/a)', !!d.dividerImgAfterScroll);
    add('hero media transform:none after scroll', !d.heroMediaAfterScroll || (d.heroMediaAfterScroll.transform === 'none' && d.heroMediaAfterScroll.animationName === 'none'), d.heroMediaAfterScroll ? `after-scroll transform=${d.heroMediaAfterScroll.transform} anim=${d.heroMediaAfterScroll.animationName}` : 'no hero media (n/a)', !!d.heroMediaAfterScroll);
    add('no horizontal overflow', d.scrollWidth <= d.innerWidth + 1, `scrollWidth=${d.scrollWidth} innerWidth=${d.innerWidth} overflowers=${JSON.stringify(d.overflowers.slice(0, 5))}`);
    const bandArrows = d.arrows.filter(a => a.inBand && !a.ancestorsHidden);
    add('carousel arrows hidden on touch (pubs .xp-band)', bandArrows.every(a => !a.renderedVisible), `arrows=${JSON.stringify(d.arrows.map(a => ({ sel: a.sel, inBand: a.inBand, display: a.display, vis: a.renderedVisible })))}`, isPubs(url) && bandArrows.length > 0);
    add('rail nav hidden on touch', !d.stickyFixed.some(s => /ethx-railnav/.test(s.sel) && s.display !== 'none'), `stickyFixed=${JSON.stringify(d.stickyFixed.map(s => s.sel + ':' + s.position + (s.display === 'none' ? '(display:none)' : '')))}`);
    add('no sticky/fixed hero or divider', !d.stickyFixed.some(s => /ethx-hero|ethx-divider/.test(s.sel)), 'see stickyFixed list');
  } else {
    add('html.xp-touch NOT set (mouse)', !d.xpTouch, `xp-touch=${d.xpTouch} pointer:coarse=${d.mq.pointerCoarse} maxTouchPoints=${d.mq.maxTouchPoints}`);
    add('hero has no inline touch override', !/position:\s*relative\s*!important/.test((d.hero && d.hero.inline) || ''), d.hero ? `style="${d.hero.inline}"` : 'n/a');
    add('desktop curtain (hero sticky/fixed, 100svh)', d.hero && (d.hero.position === 'sticky' || d.hero.position === 'fixed') && heroIs100, d.hero ? `position=${d.hero.position} rectH=${heroH} 100svh=${d.px100svh} track=${JSON.stringify(d.heroTrack)} maxDrift=${heroTrack.maxDrift}` : 'n/a');
    add('no horizontal overflow', d.scrollWidth <= d.innerWidth + 1, `scrollWidth=${d.scrollWidth} innerWidth=${d.innerWidth} overflowers=${JSON.stringify(d.overflowers.slice(0, 5))}`);
  }
  return checks;
}

(async () => {
  const results = [];
  let failures = 0;
  console.log(`test-pubs-mobile-fix — ${new Date().toISOString()} — playwright ${require('playwright/package.json').version}`);
  console.log(`URLs: ${URLS.length}, profiles: ${PROFILE_KEYS.join(', ')}, settle ${SETTLE_MS}ms, screens=${SCREENS}`);
  for (const pk of PROFILE_KEYS) {
    const p = PROFILES[pk];
    let { browser, ctx } = await launch(pk, false);
    for (const url of URLS) {
      let data, err = null;
      try {
        data = await loadAndMeasure(ctx, url, pk);
        if (data.challenge) {
          console.log(`  [${pk}] CF challenge on ${url} (cf-mitigated=${data.cfMitigated}) — retrying with persistent context`);
          const retry = await launch(pk, true);
          const data2 = await loadAndMeasure(retry.ctx, url, pk);
          data2.retriedAfterChallenge = true; data2.firstAttempt = { title: data.title, cfMitigated: data.cfMitigated, status: data.status };
          await retry.ctx.close(); if (retry.browser) await retry.browser.close();
          data = data2;
        }
      } catch (e) { err = String(e && e.message || e); }
      const checks = data ? assess(pk, url, data) : [{ name: 'load', ok: false, detail: err }];
      const failed = checks.filter(c => c.ok === false);
      failures += failed.length;
      results.push({ profile: pk, label: p.label, url, checks, data, error: err });
      const verdict = failed.length ? `FAIL(${failed.length})` : 'PASS';
      console.log(`\n== [${pk}] ${url} -> ${verdict}`);
      if (data) console.log(`   ua=${(data.ua || '').slice(0, 70)}… vp=${data.innerWidth}x${data.innerHeight} status=${data.status} cf-mitigated=${data.cfMitigated} nav=${data.navPresent} xp-touch=${data.xpTouch} versions=${JSON.stringify(data.versions)}`);
      for (const c of checks) console.log(`   ${c.ok === null ? 'n/a ' : c.ok ? 'ok  ' : 'FAIL'}  ${c.name.padEnd(46)} ${String(c.detail).slice(0, 230)}`);
    }
    await ctx.close(); if (browser) await browser.close();
  }
  // summary table
  console.log('\n=== SUMMARY ===');
  const head = 'profile'.padEnd(13) + 'page'.padEnd(58) + 'xp-touch  hero-pos   hero-h(px/72svh)  media-anim/transform     hero1:1  overflow  arrows   verdict';
  console.log(head);
  for (const r of results) {
    const d = r.data || {}; const h = d.hero || {}; const hm = d.heroMedia || {};
    const ht = trackVerdict(d.heroTrack);
    const fails = r.checks.filter(c => c.ok === false).length;
    const arrowsVis = (d.arrows || []).filter(a => a.renderedVisible).length;
    console.log(r.profile.padEnd(13) + new URL(r.url).pathname.slice(0, 56).padEnd(58) + String(d.xpTouch).padEnd(10) + String(h.position || '-').padEnd(11) + `${h.rectH ?? '-'}/${d.px72svh ?? '-'}`.padEnd(18) + `${hm.animationName ?? '-'}/${hm.transform ?? '-'}`.slice(0, 24).padEnd(25) + String(ht.ok === null ? '-' : ht.ok ? 'yes' : 'NO(' + ht.maxDrift + ')').padEnd(9) + String(d.scrollWidth != null ? (d.scrollWidth <= d.innerWidth + 1 ? 'none' : d.scrollWidth + '>' + d.innerWidth) : '-').padEnd(10) + `${arrowsVis}/${(d.arrows || []).length}vis`.padEnd(9) + (fails ? `FAIL(${fails})` : 'PASS'));
  }
  fs.writeFileSync(JSON_OUT, JSON.stringify({ ranAt: new Date().toISOString(), urls: URLS, profiles: PROFILE_KEYS, results }, null, 2));
  console.log(`\nJSON: ${JSON_OUT}`);
  console.log(failures ? `\nRESULT: ${failures} assertion(s) FAILED` : '\nRESULT: ALL PASS');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
