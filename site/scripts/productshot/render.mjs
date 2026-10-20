#!/usr/bin/env node
/**
 * R6 Part E7 · renders every box + LCD pairing of the product shot once, into cached images:
 *   public/assets/shots/<id>-<240|480|960>.webp (+ .avif)
 *   cd site && node scripts/productshot/render.mjs [--only id,id] [--png dir]
 * The pairings (which box goes with which brand + manufacturer) live in public/se-shots.js, read by the site too.
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
const SHOTS = window.SE_SHOTS.shots, only = args.only ? args.only.split(',') : null;
const OUT = path.join(ROOT, 'public/assets/shots'); fs.mkdirSync(OUT, { recursive: true });
const PNG = args.png || path.join(OUT, '.png'); fs.mkdirSync(PNG, { recursive: true });

const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1280, height: 960 } });
await p.route('http://shot.local/**', (r) => {
  const u = new URL(r.request().url()).pathname;
  const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : path.join(ROOT, 'scripts/productshot', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' });
  r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html' } });
});
p.on('pageerror', (e) => console.error('page error', e.message));
for (const [id, s] of Object.entries(SHOTS)) {
  if (only && !only.includes(id)) continue;
  const q = new URLSearchParams({ box: s.box, lcd: s.lcd, label: s.label || '', w: '1280' });
  await p.goto('http://shot.local/scene.html?' + q);
  await p.waitForFunction(() => window.__done, null, { timeout: 180000 });
  const png = path.join(PNG, id + '.png');
  await p.locator('canvas').screenshot({ path: png, omitBackground: true });
  // three sizes, WebP and AVIF (python3 + Pillow)
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA'); bb=im.getbbox(); im=im.crop((max(0,bb[0]-24),max(0,bb[1]-24),min(im.width,bb[2]+24),min(im.height,bb[3]+24)))
for w in (240,480,960):
    r=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    r.save(sys.argv[2]+'-%d.webp'%w,quality=86,method=6)
    r.save(sys.argv[2]+'-%d.avif'%w,quality=62)
print(im.size)
`, png, path.join(OUT, id)]);
  console.log('rendered', id);
}
await b.close();
