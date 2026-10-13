#!/usr/bin/env node
/**
 * Issue 4 · circuit audit: every decorative circuit must keep 24px clear of text, buttons, cards, images and icons.
 *   node scripts/qa/circuit-audit.mjs --url http://localhost:3000/ [--out file.json]
 * A "circuit" is a stroked, unfilled SVG path inside an absolutely positioned, non-interactive SVG that is at least
 * 120px long (decoration, not an icon). Points are sampled every 8px along each visible path, in page coordinates,
 * and checked against the boxes of content elements in the same section.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const b = await pw.chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route('**/*', (r) => { const u = r.request().url(); if (/se-teardown-3d|esm\.sh/.test(u)) return r.abort(); return /localhost|127\.0\.0\.1|fonts\.g/.test(u) ? r.continue() : r.abort(); });
await p.goto(args.url || 'http://localhost:3000/'); await p.waitForTimeout(6000);
// scroll through once so every section has entered and laid out
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 700) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(220); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
// collect the circuit SVGs, then check each one in view (so we can tell which points are actually visible)
const count = await p.evaluate(() => { const L = []; document.querySelectorAll('svg').forEach((svg) => { const cs = getComputedStyle(svg), r = svg.getBoundingClientRect(); if (cs.position !== 'absolute' && cs.position !== 'fixed') return; if (r.width < 60 || r.height < 60) return; /* charts and icons, not circuits */ if (svg.closest('nav, header, [role="dialog"], .se-reel, [data-ipad]')) return; L.push(svg); }); window.__aud = L; return L.length; });
const res = [];
for (let i = 0; i < count; i++) {
  await p.evaluate((i) => { const svg = window.__aud[i]; const r = svg.getBoundingClientRect(); window.scrollTo(0, Math.max(0, scrollY + r.top + r.height / 2 - innerHeight / 2)); }, i);
  await p.waitForTimeout(60);
  const r = await p.evaluate((i) => {
    const CLEAR = 24, svg = window.__aud[i], out = [];
    const sectionOf = (el) => el.closest('section, footer, [data-sc-name], header, nav') || document.body;
    const nameOf = (s) => (s.id ? '#' + s.id : s.getAttribute('data-sc-name') || s.tagName.toLowerCase());
    const sec = sectionOf(svg);
    const content = [...sec.querySelectorAll('h1,h2,h3,h4,p,a,button,img,input,label,li,canvas,video,span')].filter((e) => {
      if (e.closest('svg')) return false; const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity === 0) return false;
      if (e.tagName === 'CANVAS' && r.width * r.height > innerWidth * innerHeight * 0.4) return false; /* full-section 3D layer */ if (e.tagName === 'SPAN') return [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1); return true; }).map((e) => ({ e, r: e.getBoundingClientRect() }));
    const pe = svg.style.pointerEvents; svg.style.pointerEvents = 'auto'; svg.querySelectorAll('*').forEach((c) => (c.style.pointerEvents = 'auto'));
    svg.querySelectorAll('path, polyline, line').forEach((path, pi) => {
      const ps = getComputedStyle(path); if (ps.stroke === 'none' || (ps.fill !== 'none' && ps.fill !== 'rgba(0, 0, 0, 0)')) return; if (+ps.opacity === 0 || ps.visibility === 'hidden') return;
      let L = 0; try { L = path.getTotalLength(); } catch (e) { return; } const m = path.getScreenCTM(); if (!m || L <= 0) return;
      const N = Math.min(400, Math.max(8, Math.ceil(L / 4))), pts = []; for (let k = 0; k <= N; k++) { const q = path.getPointAtLength((L * k) / N); pts.push([m.a * q.x + m.c * q.y + m.e, m.b * q.x + m.d * q.y + m.f]); }
      const len = pts.reduce((a, q, k) => (k ? a + Math.hypot(q[0] - pts[k - 1][0], q[1] - pts[k - 1][1]) : 0), 0); if (len < 120) return;
      const hits = new Map();
      pts.forEach(([x, y]) => { if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return; const top = document.elementFromPoint(x, y); if (!top || !svg.contains(top) && top !== svg) return; // covered: not visible
        content.forEach(({ e, r }) => { const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom), d = Math.hypot(dx, dy); if (d < CLEAR) { const k = (e.tagName + ' ' + (e.textContent || e.getAttribute('alt') || '').trim().slice(0, 28)).trim(); hits.set(k, Math.min(hits.get(k) ?? 99, Math.round(d))); } }); });
      if (hits.size) out.push({ section: nameOf(sec), svg: (svg.getAttribute('class') || svg.getAttribute('viewBox') || '').slice(0, 40), path: pi, d: (path.getAttribute('d') || '').slice(0, 50), y: Math.round(pts[0][1] + scrollY), touches: [...hits.entries()].slice(0, 6).map(([k, d]) => k + ' (' + d + 'px)') });
    });
    svg.style.pointerEvents = pe; svg.querySelectorAll('*').forEach((c) => (c.style.pointerEvents = ''));
    return out;
  }, i);
  res.push(...r);
}
const by = {}; res.forEach((r) => ((by[r.section] = by[r.section] || []).push(r)));
for (const [s, list] of Object.entries(by)) { console.log('\n' + s + ': ' + list.length + ' circuit path(s) too close'); list.slice(0, 8).forEach((r) => console.log('  y=' + r.y + '  ' + r.svg + '  ' + r.d + '\n     → ' + r.touches.join(' · '))); }
console.log('\nTOTAL paths too close: ' + res.length);
if (args.out) fs.writeFileSync(args.out, JSON.stringify(res, null, 1));
await b.close();
