#!/usr/bin/env node
/**
 * Round 6 Part B · scroll engine tests (never trap the visitor).
 *   node scripts/qa/scroll-engine-tests.mjs --url http://localhost:3000/ [--lang en|ar]
 * Runs with the 3D engines blocked (the scroll logic is the same).
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const URL_ = args.url || 'http://localhost:3000/', LANG = args.lang || 'en';
const b = await pw.chromium.launch({ executablePath: exe });
const results = []; const ok = (n, pass, note) => { results.push(pass); console.log((pass ? 'PASS' : 'FAIL') + '  [' + LANG + '] ' + n + (note ? '  · ' + note : '')); };
async function page() {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript((l) => { try { sessionStorage.setItem('se-booted', '1'); localStorage.setItem('se-lang', l); } catch {} }, LANG);
  await p.route('**/*', (r) => { const u = r.request().url(); if (/se-teardown-3d|esm\.sh/.test(u)) return r.abort(); return /localhost|127\.0\.0\.1|fonts\.g/.test(u) ? r.continue() : r.abort(); });
  await p.goto(URL_); await p.waitForTimeout(4000); await p.mouse.move(700, 450); return p;
}
const H = (p) => p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const Y = (p) => p.evaluate(() => Math.round(scrollY));
const tdTop = (p) => p.evaluate(() => Math.round(scrollY + document.getElementById('teardown').getBoundingClientRect().top));
const tdBottom = (p) => p.evaluate(() => { const r = document.getElementById('teardown').getBoundingClientRect(); return Math.round(scrollY + r.bottom); });

// 1 · fast wheel scrolling top → bottom, then bottom → top: never stuck
{ const p = await page(); const max = await H(p), t0 = Date.now(); let stuck = 0, last = -1;
  while (Date.now() - t0 < 60000) { for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, 140); await p.waitForTimeout(25); } await p.waitForTimeout(280); const y = await Y(p); if (y >= max - 5) break; stuck = y === last ? stuck + 1 : 0; last = y; if (stuck > 6) break; }
  const y = await Y(p); ok('1a fast scroll top → bottom reaches the bottom', y >= max - 5, 'y ' + y + ' / ' + max + ' in ' + (Date.now() - t0) + 'ms');
  const t1 = Date.now(); stuck = 0; last = -1;
  while (Date.now() - t1 < 60000) { for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, -140); await p.waitForTimeout(25); } await p.waitForTimeout(280); const y2 = await Y(p); if (y2 <= 5) break; stuck = y2 === last ? stuck + 1 : 0; last = y2; if (stuck > 6) break; }
  const y2 = await Y(p); ok('1b fast scroll bottom → top reaches the top', y2 <= 5, 'y ' + y2 + ' in ' + (Date.now() - t1) + 'ms'); await p.close(); }

// 2 · dragging the scrollbar through the teardown: no hold
{ const p = await page(); const a = await tdTop(p) - 400, z = await tdBottom(p) + 300;
  for (let y = a; y <= z; y += 180) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(20); } await p.evaluate((y) => window.scrollTo(0, y), z);
  await p.waitForTimeout(900); const y = await Y(p); ok('2a scrollbar drag down through the teardown: no hold', y >= z - 10, 'ended at ' + y + ', wanted ' + z);
  for (let y2 = z; y2 >= a; y2 -= 180) { await p.evaluate((y) => window.scrollTo(0, y), y2); await p.waitForTimeout(20); } await p.evaluate((y) => window.scrollTo(0, y), a);
  await p.waitForTimeout(900); const y3 = await Y(p); ok('2b scrollbar drag up through the teardown: no hold', y3 <= a + 10, 'ended at ' + y3 + ', wanted ' + a); await p.close(); }

// 3 · logo from the footer → top in under 1s
{ const p = await page(); await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1200);
  const t0 = Date.now(); await p.evaluate(() => { const a = document.querySelector('header a[href="#top"], header a'); a && a.click(); });
  let y = await Y(p); while (y > 2 && Date.now() - t0 < 4000) { await p.waitForTimeout(30); y = await Y(p); }
  ok('3 logo click from the footer reaches the top in < 1s', y <= 2 && Date.now() - t0 < 1000, (Date.now() - t0) + 'ms, y ' + y); await p.close(); }

// 4 · the progress bar: click and drag
{ const p = await page(); const r = await p.evaluate(() => { const e = document.querySelector('.se-scrub').getBoundingClientRect(); return { x: e.x, y: e.y + e.height / 2, w: e.width }; }); const max = await H(p);
  const rtl = LANG === 'ar', at = (f) => r.x + (rtl ? 1 - f : f) * r.w;
  await p.mouse.click(at(0.5), r.y); await p.waitForTimeout(1300); const y = await Y(p);
  ok('4a progress bar click at 50% → middle of the page', Math.abs(y / max - 0.5) < 0.04, (y / max * 100).toFixed(1) + '%');
  await p.mouse.move(at(0.2), r.y); await p.mouse.down(); for (let f = 0.2; f <= 0.8; f += 0.05) { await p.mouse.move(at(f), r.y); await p.waitForTimeout(40); } await p.mouse.move(at(0.8), r.y); await p.waitForTimeout(40); await p.mouse.up(); await p.waitForTimeout(800);
  const y2 = await Y(p); ok('4b progress bar drag 20% → 80%', Math.abs(y2 / max - 0.8) < 0.04, (y2 / max * 100).toFixed(1) + '%');
  const tip = await p.evaluate(() => { const t = document.querySelector('.se-scrub-tip'); return t ? t.textContent : ''; }); ok('4c hover shows the section name', !!tip, tip); await p.close(); }

// 5 · slow scrolling still steps one by one through the teardown
{ const p = await page(); const top = await tdTop(p); await p.evaluate((t) => window.scrollTo(0, t - 300), top); await p.waitForTimeout(800);
  const steps = []; for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(2600); steps.push(await p.evaluate(() => window.__tdc ? window.__tdc.idx : -1)); }
  // the first gestures scroll the page into the held stage and play the opening; after that, every gesture = exactly one step
  const d = steps.slice(1).map((x, i) => x - steps[i]), firstMove = d.findIndex((x) => x > 0), after = firstMove < 0 ? [] : d.slice(firstMove);
  ok('5 slow scrolling: one gesture = one step', after.length >= 2 && after.every((x) => x === 1), steps.join(' → ')); await p.close(); }

await b.close();
const pass = results.filter(Boolean).length; console.log(`\n${pass} / ${results.length} passed`); process.exit(pass === results.length ? 0 : 1);
