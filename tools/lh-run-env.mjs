// Lighthouse runner (perf_lighthouse audit). Sequential, one Chrome per run.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = process.env.LH_OUT || '/private/tmp/claude-501/-Users-x-CLAUDE/1f9ab44c-dab4-4c10-9374-4fb09761db8c/scratchpad/data/perf_lighthouse';
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.LH_BASE || 'https://www.theodyx.com';
const PAGES = (process.env.LH_PAGES ? process.env.LH_PAGES.split(',') : ['/', '/about', '/our-thinking', '/our-thinking/what-automation-cannot-replace', '/scouting', '/contact', '/our-capabilities', '/index/planning-for-creators-brands-and-beyond']);
const slug = p => p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '__');

const plan = [];
for (const p of PAGES) {
  const n = p === '/' ? 3 : 1;
  for (let i = 1; i <= n; i++) plan.push({ page: p, preset: 'mobile', run: i });
  plan.push({ page: p, preset: 'desktop', run: 1 });
}
const only = process.argv[2]; // optional filter e.g. "home-mobile-2"
const log = [];

for (const job of plan) {
  const id = `${slug(job.page)}-${job.preset}-${job.run}`;
  if (only && !id.startsWith(only)) continue;
  const file = path.join(OUT, id + '.json');
  if (fs.existsSync(file) && !process.env.FORCE) { console.log('skip existing', id); continue; }
  const url = BASE + job.page;
  const t0 = Date.now();
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-first-run', '--no-default-browser-check', '--disable-blink-features=AutomationControlled'],
    userDataDir: path.join(OUT, '.profile-' + id),
  });
  let result = null, title = null, err = null;
  try {
    const page = await browser.newPage();
    const flags = { output: 'json', logLevel: 'error' };
    const config = job.preset === 'desktop' ? desktopConfig : undefined;
    const rr = await lighthouse(url, flags, config, page);
    result = rr.lhr;
    try { title = await page.title(); } catch (e) { title = 'ERR:' + e.message; }
    fs.writeFileSync(file, rr.report);
  } catch (e) { err = String(e && e.stack || e); }
  await browser.close();
  const lhr = result;
  const a = k => lhr?.audits?.[k]?.numericValue;
  const rec = {
    id, url, preset: job.preset, run: job.run, ts: new Date().toISOString(), secs: (Date.now() - t0) / 1000,
    title, err, lhVersion: lhr?.lighthouseVersion, finalUrl: lhr?.finalDisplayedUrl, runtimeError: lhr?.runtimeError,
    perf: lhr?.categories?.performance?.score, a11y: lhr?.categories?.accessibility?.score, bp: lhr?.categories?.['best-practices']?.score, seo: lhr?.categories?.seo?.score,
    fcp: a('first-contentful-paint'), lcp: a('largest-contentful-paint'), tbt: a('total-blocking-time'), cls: a('cumulative-layout-shift'), si: a('speed-index'), ttfb: a('server-response-time'),
    challenge: !!(lhr && JSON.stringify(lhr.audits?.['network-requests']?.details?.items || []).match(/challenge-platform|challenges\.cloudflare\.com/)) || /just a moment/i.test(title || ''),
  };
  log.push(rec);
  console.log(JSON.stringify(rec));
  fs.appendFileSync(path.join(OUT, 'runlog.jsonl'), JSON.stringify(rec) + '\n');
}
