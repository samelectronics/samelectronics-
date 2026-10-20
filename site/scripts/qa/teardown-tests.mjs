#!/usr/bin/env node
/**
 * Issue 1 · the 8 scroll tests of the teardown (PDF section D), run in a real browser.
 *   node scripts/qa/teardown-tests.mjs --url http://localhost:3000/ [--cdn dir]
 * --no3d blocks the 3D engine so the page runs at full speed: the step engine is the same, and on a machine
 * without a GPU (software WebGL at ~1fps) input events otherwise arrive seconds apart.
 * Reads the engine through window.__tdc (the teardown logic): idx = current step (0 back reveal … 12 final call).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const URL_ = args.url || 'http://localhost:3000/';
const CDN = args.cdn ? path.resolve(args.cdn) : null;
const cdnFile = (url) => {
  const u = new URL(url); let m;
  if ((u.host === 'unpkg.com' || u.host === 'cdn.jsdelivr.net') && (m = u.pathname.match(/^\/(?:npm\/)?(@?[^@]+)@[^/]+\/(.*)$/))) return { file: path.join(CDN, m[1], m[2]) };
  if (u.host === 'esm.sh' && (m = u.pathname.match(/^\/three@[^/]+(\/.*)?$/))) return { file: m[1] ? path.join(CDN, 'three', m[1]) : path.join(CDN, 'three/build/three.module.js'), rewrite: (s) => s.replace(/from\s+['"]three['"]/g, "from 'https://esm.sh/three@0.160.0'") };
  return null;
};
const b = await pw.chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const NO3D = process.argv.includes('--no3d');
const results = [];
const ok = (n, pass, note) => { results.push([n, pass, note]); console.log((pass ? 'PASS' : 'FAIL') + '  ' + n + (note ? '  · ' + note : '')); };

async function page() {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  if (CDN || NO3D) await p.route('**/*', (r) => {
    const url = r.request().url();
    if (NO3D && /se-teardown-3d/.test(url)) return r.abort();
    if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(url) || /fonts\.(googleapis|gstatic)\.com/.test(url) || !/^https?:/.test(url)) return r.continue();
    const l = CDN && cdnFile(url); if (l && fs.existsSync(l.file)) { let body = fs.readFileSync(l.file); if (l.rewrite) body = Buffer.from(l.rewrite(body.toString())); return r.fulfill({ status: 200, body, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' } }); }
    return r.abort();
  });
  await p.goto(URL_); await p.waitForFunction(() => window.__tdc && (window.__tdc.ready3d || !window.__tdc.state.loading), null, { timeout: 120000 });
  return p;
}
const st = (p) => p.evaluate(() => { const c = window.__tdc, sec = c.secRef.current.getBoundingClientRect(); return { idx: c.idx, mode: c.mode, oT: c.state.oT, busy: c.busy(), p: Math.round(c.td.p * 1000) / 1000, top: Math.round(sec.top), bottom: Math.round(sec.bottom), y: Math.round(scrollY) }; });
const secTop = (p) => p.evaluate(() => Math.round(scrollY + window.__tdc.secRef.current.getBoundingClientRect().top));
const idle = (p) => p.waitForFunction(() => window.__tdc.mode === 'film' && !window.__tdc.busy(), null, { timeout: 240000 }).then(() => p.waitForTimeout(400));
const wheel = async (p, dy, n = 1, gap = 16) => { for (let i = 0; i < n; i++) { await p.mouse.wheel(0, dy); await p.waitForTimeout(gap); } };
const goStep = async (p, i) => { while ((await st(p)).idx < i) { await wheel(p, 120); await idle(p); } };

// 1. slow scroll from the hero
{ const p = await page(); await p.mouse.move(700, 450); const top = await secTop(p);
  for (let k = 0; k < 80 && (await st(p)).mode !== 'film'; k++) { await wheel(p, 60); await p.waitForTimeout(80); }
  await p.waitForTimeout(600); const s = await st(p); ok('1 slow scroll from the hero starts at step 0', s.mode === 'film' && s.idx === 0 && (NO3D || (s.oT > 0 && s.oT < 3.4)) && Math.abs(s.y - top) <= 2, JSON.stringify(s));
  // 2. (Round 6 Part B, replaces "a big jump is held at step 0"): a jump straight into the teardown is never held; the
  //    film snaps silently to its end state and the page stays where the visitor sent it. Coming back normally replays it.
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800); await p.evaluate((t) => window.scrollTo(0, t + 700), top); await p.waitForTimeout(800);
  const s2 = await st(p); ok('2 a fast jump into the teardown passes through (no hold)', s2.mode !== 'film' && s2.p === 1 && Math.abs(s2.y - (top + 700)) <= 2, JSON.stringify(s2));
  // back to the top, then in again slowly (the film replays from step 0) for tests 4–7
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1500);
  for (let k = 0; k < 80 && (await st(p)).mode !== 'film'; k++) { await wheel(p, 60); await p.waitForTimeout(80); }
  await p.waitForTimeout(600); const s2b = await st(p); ok('2b re-entering slowly replays from step 0', s2b.mode === 'film' && s2b.idx === 0, JSON.stringify(s2b));
  // 4–7 at step 03 (layer 03 = engine step 5)
  await idle(p); await goStep(p, 5); let a = await st(p);
  await wheel(p, -10); await p.waitForTimeout(700); let c = await st(p); ok('4 at step 03 a 10px nudge up does nothing', c.idx === 5 && c.p === a.p && c.mode === 'film', JSON.stringify(c));
  await p.waitForTimeout(400); await wheel(p, -120); await idle(p); c = await st(p); ok('5 at step 03 one scroll up = exactly step 02', c.idx === 4, JSON.stringify(c));
  await wheel(p, 120); await idle(p); a = await st(p);
  await wheel(p, 55, 40, 16); await idle(p); c = await st(p); ok('6 one hard trackpad swipe = exactly one step', c.idx === a.idx + 1, 'from ' + a.idx + ' to ' + c.idx);
  a = c; await p.keyboard.press('ArrowDown'); for (let k = 0; k < 4; k++) { await p.waitForTimeout(120); await p.keyboard.press('ArrowDown'); }
  await idle(p); c = await st(p); const m1 = c.idx; await p.keyboard.press('ArrowDown'); await idle(p); c = await st(p);
  ok('7 arrows during an animation are ignored; then one step per press', m1 === a.idx + 1 && c.idx === a.idx + 2, a.idx + ' → ' + m1 + ' → ' + c.idx);
  // 8. from the final call, scroll down continues the page
  await goStep(p, 12); await idle(p); await p.waitForTimeout(400); await wheel(p, 120); await p.waitForTimeout(1500); c = await st(p);
  ok('8 from the final call, scroll down continues to the next section', c.mode === 'out' && c.bottom < 200, JSON.stringify(c));
  await p.close(); }
// 3. reload with the teardown half visible
{ const p = await page(); const top = await secTop(p); await p.evaluate((t) => window.scrollTo(0, t - 450), top); await p.waitForTimeout(500); await p.reload();
  await p.waitForFunction(() => window.__tdc && (window.__tdc.ready3d || !window.__tdc.state.loading), null, { timeout: 120000 }); await p.mouse.move(700, 450);
  for (let k = 0; k < 40 && (await st(p)).mode !== 'film'; k++) { await wheel(p, 60); await p.waitForTimeout(80); }
  await p.waitForTimeout(600); const s = await st(p); ok('3 reload with the teardown half visible starts at step 0', s.mode === 'film' && s.idx === 0 && (NO3D || s.oT < 3.4), JSON.stringify(s)); await p.close(); }
await b.close();
const pass = results.filter((r) => r[1]).length; console.log(`\n${pass} / ${results.length} passed`);
process.exit(pass === results.length ? 0 : 1);
