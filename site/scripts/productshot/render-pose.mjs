#!/usr/bin/env node
/**
 * Urgent 1 · renders THE product pose (pose.html: carton behind, product in front, both 20° right) for every screen box
 * pairing in public/se-shots.js and for every other part on its white carton, into public/assets/pose/<id>-<240|480|960>.webp
 *   cd site && node scripts/productshot/render-pose.mjs [--only id,id] [--shot id]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
global.window = {}; require(path.join(ROOT, 'public/se-shots.js'));
const JOBS = {};
for (const [id, s] of Object.entries(window.SE_SHOTS.shots)) JOBS[id] = { item: 'scr', box: s.box, lcd: s.lcd, label: s.label || '' };
for (const it of ['bat', 'bcv', 'flx', 'cam', 'sml', 'frm', 'board']) JOBS['part-' + it] = { item: it, box: 'white', lcd: 'plain', label: '' };
const only = args.only ? args.only.split(',') : args.shot ? [args.shot] : Object.keys(JOBS);
const OUT = path.join(ROOT, 'public/assets/pose'), PNG = path.join(OUT, '.png'); fs.mkdirSync(PNG, { recursive: true });
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1400, height: 1400 } });
await p.route('http://shot.local/**', (r) => {
  const u = new URL(r.request().url()).pathname;
  const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : path.join(ROOT, 'scripts/productshot', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' });
  r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html' } });
});
p.on('pageerror', (e) => console.error('page error', e.message));
for (const id of only) {
  const j = JOBS[id]; if (!j) { console.error('no job', id); continue; }
  await p.goto('http://shot.local/pose.html?' + new URLSearchParams({ ...j, w: '1200' }));
  await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
  const png = path.join(PNG, id + '.png');
  await p.locator('canvas').screenshot({ path: png, omitBackground: true });
  if (args.shot) { console.log('preview', png); continue; }
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA'); bb=im.split()[3].point(lambda v:255 if v>24 else 0).getbbox()
im=im.crop((max(0,bb[0]-14),max(0,bb[1]-14),min(im.width,bb[2]+14),min(im.height,bb[3]+14)))
# square canvas so every place can show the shot at the same scale
s=max(im.width,im.height); sq=Image.new('RGBA',(s,s),(0,0,0,0)); sq.alpha_composite(im,((s-im.width)//2,s-im.height))
for w in (240,480,960):
    r=sq.resize((w,w),Image.LANCZOS) if w<s else sq
    r.save(sys.argv[2]+'-%d.webp'%w,quality=86,method=6)
`, png, path.join(OUT, id)]);
  console.log('rendered', id);
}
await b.close();
