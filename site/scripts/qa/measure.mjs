#!/usr/bin/env node
/**
 * Performance + screenshot check for the home page (G16).
 *
 *   node scripts/qa/measure.mjs --url http://localhost:3000/ [--out dir] [--cdn dir] [--shots] [--sections a,b]
 *
 * For each section it scrolls the section into view, records frames for a few seconds and reports
 * median fps, p95 frame time, long tasks (>50ms) and the number of live WebGL contexts. It also
 * reports the main-thread blocking time during load. --shots saves a 1440×900 screenshot per section.
 * --block re1,re2 aborts matching requests (e.g. to measure a section without the 3D engines).
 * --cdn serves CDN files (unpkg, jsDelivr, esm.sh three) from a local node_modules folder, for
 * machines that cannot reach those CDNs.
 *
 * Numbers depend on the machine (software WebGL in CI is far slower than a laptop GPU): compare
 * runs made on the same machine only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, all) => {
    if (x.startsWith('--')) a.push([x.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return a;
  }, []),
);
const URL_ = args.url || 'http://localhost:3000/';
const OUT = path.resolve(args.out || 'qa-out');
const CDN = args.cdn ? path.resolve(args.cdn) : null;
const W = +(args.w || 1440), H = +(args.h || 900);
const DWELL = +(args.dwell || 3000);
fs.mkdirSync(OUT, { recursive: true });

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;

const DEFAULT_SECTIONS = ['#top', '[data-sc-name="SE Teardown"]', '[data-sc-name="SE What We Offer"]', '[data-sc-name="SE Live Board"]', '[data-sc-name="SE Bench Test"]', '[data-sc-name="SE Home Models"]', '[data-sc-name="SE Home Deals"]', '#repair', '#wholesale', '#network', '#story', '#team', '#everyone', '#circuit', '[data-sc-name="SE Home Samsoom"]', '#social', '#visit', '[data-sc-name="SE Finale"]', 'footer'];
const SECTIONS = args.sections ? String(args.sections).split(',') : DEFAULT_SECTIONS;

function cdnFile(url) {
  const u = new URL(url);
  let m;
  if ((u.host === 'unpkg.com' || u.host === 'cdn.jsdelivr.net') && (m = u.pathname.match(/^\/(?:npm\/)?(@?[^@]+)@[^/]+\/(.*)$/))) return { file: path.join(CDN, m[1], m[2]) };
  if (u.host === 'esm.sh' && (m = u.pathname.match(/^\/three@[^/]+(\/.*)?$/)))
    return { file: m[1] ? path.join(CDN, 'three', m[1]) : path.join(CDN, 'three/build/three.module.js'), rewrite: (s) => s.replace(/from\s+['"]three['"]/g, "from 'https://esm.sh/three@0.160.0'") };
  return null;
}

// Runs in the page before any script: counts WebGL contexts and records frames and long tasks.
const INIT = () => {
  const ctxs = new Set();
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const c = orig.call(this, type, ...rest);
    if (c && /webgl/.test(type)) ctxs.add(c);
    return c;
  };
  const longTasks = [];
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => longTasks.push({ t: e.startTime, d: e.duration }))).observe({ type: 'longtask', buffered: true }); } catch {}
  const frames = [];
  let last = performance.now();
  const tick = (t) => { frames.push({ t, d: t - last }); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  window.__qa = {
    live: () => [...ctxs].filter((c) => !c.isContextLost()).length,
    created: () => ctxs.size,
    window(from, to) {
      const f = frames.filter((x) => x.t >= from && x.t <= to).map((x) => x.d).sort((a, b) => a - b);
      const lt = longTasks.filter((x) => x.t >= from && x.t <= to);
      const med = f.length ? f[Math.floor(f.length / 2)] : 0, p95 = f.length ? f[Math.floor(f.length * 0.95)] : 0;
      return { frames: f.length, fps: f.length ? +(1000 / med).toFixed(1) : 0, avgFps: +((f.length * 1000) / (to - from)).toFixed(1), p95ms: +p95.toFixed(1), longTasks: lt.length, longMs: Math.round(lt.reduce((a, x) => a + x.d, 0)) };
    },
    loadBlocking: () => Math.round(longTasks.filter((x) => x.t < 15000).reduce((a, x) => a + Math.max(0, x.d - 50), 0)),
  };
};

const main = async () => {
  const browser = await playwright.chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 240)));
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 240)));
  await page.addInitScript(INIT);
  const BLOCK = args.block ? String(args.block).split(',').map((x) => new RegExp(x)) : [];
  if (CDN || BLOCK.length) {
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (BLOCK.some((re) => re.test(url))) return route.abort();
      if (!CDN) return route.continue();
      if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(url) || /fonts\.(googleapis|gstatic)\.com/.test(url) || !/^https?:/.test(url)) return route.continue();
      const l = cdnFile(url);
      if (l && fs.existsSync(l.file)) {
        let body = fs.readFileSync(l.file);
        if (l.rewrite) body = Buffer.from(l.rewrite(body.toString()));
        return route.fulfill({ status: 200, body, headers: { 'content-type': l.file.endsWith('.json') ? 'application/json' : 'application/javascript', 'access-control-allow-origin': '*' } });
      }
      return route.abort();
    });
  }
  const t0 = Date.now();
  await page.goto(URL_, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(+(args.settle || 8000));
  const report = { url: URL_, viewport: `${W}x${H}`, loadMs: Date.now() - t0, loadBlockingMs: await page.evaluate(() => window.__qa.loadBlocking()), sections: [] };
  for (const sel of SECTIONS) {
    const found = await page.evaluate((s) => {
      const e = document.querySelector(s);
      if (!e) return false;
      window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY);
      return true;
    }, sel);
    if (!found) { report.sections.push({ section: sel, missing: true }); continue; }
    await page.waitForTimeout(600);
    const from = await page.evaluate(() => performance.now());
    // a gentle scroll inside the section, then rest
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(80); }
    await page.waitForTimeout(DWELL);
    const to = await page.evaluate(() => performance.now());
    const m = await page.evaluate(([a, b]) => ({ ...window.__qa.window(a, b), liveWebGL: window.__qa.live() }), [from, to]);
    report.sections.push({ section: sel, ...m });
    if (args.shots) {
      try { await page.screenshot({ path: path.join(OUT, sel.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') + '.png'), timeout: 120000 }); } catch (e) { report.sections.at(-1).shot = 'failed'; }
    }
  }
  report.webglCreated = await page.evaluate(() => window.__qa.created());
  report.consoleErrors = errors;
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  const rows = report.sections.map((s) => (s.missing ? `${s.section.padEnd(36)} missing` : `${s.section.padEnd(36)} fps ${String(s.fps).padStart(5)}  avg ${String(s.avgFps).padStart(5)}  p95 ${String(s.p95ms).padStart(6)}ms  long ${String(s.longTasks).padStart(3)} (${s.longMs}ms)  webgl ${s.liveWebGL}`));
  console.log(`load ${report.loadMs}ms · blocking during load ${report.loadBlockingMs}ms · WebGL contexts created ${report.webglCreated} · console errors ${errors.length}`);
  console.log(rows.join('\n'));
  await browser.close();
};
main().catch((e) => { console.error(e); process.exit(1); });
