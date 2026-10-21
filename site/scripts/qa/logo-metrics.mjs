#!/usr/bin/env node
/**
 * Hero 4 · measures every brand logo's real ink (tight bounds + how dark/dense it is) and trims each SVG's viewBox to
 * that ink, so SEBrandLogo can give all 15 logos the same optical size. Writes src/content/logoMetrics.json.
 *   cd site && node scripts/qa/logo-metrics.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const DIR = path.resolve('public/assets/brands'), OUT = path.resolve('src/content/logoMetrics.json');
const b = await pw.chromium.launch(); const p = await b.newPage();
const res = {};
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.svg'))) {
  const id = f.replace('.svg', ''), svg = fs.readFileSync(path.join(DIR, f), 'utf8');
  const m = await p.evaluate(async (src) => {
    const vb = src.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
    const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src); await img.decode();
    const H = 400, W = Math.round(H * vb[2] / vb[3]), c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(img, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0, ink = 0;
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const a = d[(j * W + i) * 4 + 3]; if (a > 20) { ink += a / 255; if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j; } }
    const s = vb[3] / H, tb = [vb[0] + x0 * s, vb[1] + y0 * s, (x1 - x0 + 1) * s, (y1 - y0 + 1) * s];
    return { vb: tb.map((v) => Math.round(v * 100) / 100), ar: Math.round(((x1 - x0 + 1) / (y1 - y0 + 1)) * 1000) / 1000, ink: Math.round((ink / ((x1 - x0 + 1) * (y1 - y0 + 1))) * 1000) / 1000 };
  }, svg);
  res[id] = m;
  fs.writeFileSync(path.join(DIR, f), svg.replace(/viewBox="[^"]+"/, `viewBox="${m.vb.join(' ')}"`));
}
await b.close();
fs.writeFileSync(OUT, JSON.stringify(res, null, 1) + '\n');
console.log(Object.entries(res).map(([k, v]) => k.padEnd(9) + ' ar ' + String(v.ar).padEnd(6) + ' ink ' + v.ink).join('\n'));
