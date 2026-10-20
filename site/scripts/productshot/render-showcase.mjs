#!/usr/bin/env node
/**
 * R6 §09 · the Showcase unboxing pieces: for each featured quality, its real box, the screen from the front and the
 * screen from the back, rendered one piece at a time by scene.html into public/assets/shots/sc-<q>-<part>-<480|960>.webp
 *   cd site && node scripts/productshot/render-showcase.mjs [--only or,ol]
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
// the box each featured quality ships in (Excel manufacturer → box design, as in se-shots.js); one model for all four
const Q = { or: { box: 'apple-sp' }, ol: { box: 'temp' }, in: { box: 'zy', label: 'iPhone' }, aq: { box: 'gx', label: 'GX-iPhone' } };
const only = args.only ? args.only.split(',') : null;
const OUT = path.join(ROOT, 'public/assets/shots'), PNG = path.join(OUT, '.png'); fs.mkdirSync(PNG, { recursive: true });
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 2400, height: 1800 } });
await p.route('http://shot.local/**', (r) => {
  const u = new URL(r.request().url()).pathname;
  const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : path.join(ROOT, 'scripts/productshot', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' });
  r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html' } });
});
p.on('pageerror', (e) => console.error('page error', e.message));
for (const [q, s] of Object.entries(Q)) {
  if (only && !only.includes(q)) continue;
  for (const part of ['box', 'front', 'back']) {
    const id = `sc-${q}-${part}`, qs = new URLSearchParams({ box: s.box, lcd: 'iphone', label: s.label || '', w: '2400', part, q });
    await p.goto('http://shot.local/scene.html?' + qs);
    await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
    const png = path.join(PNG, id + '.png');
    await p.locator('canvas').screenshot({ path: png, omitBackground: true });
    execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA'); a=im.split()[3].point(lambda v: 255 if v>40 else 0); bb=a.getbbox(); im=im.crop((max(0,bb[0]-16),max(0,bb[1]-16),min(im.width,bb[2]+16),min(im.height,bb[3]+16)))
for w in (480,960):
    h=round(im.height*w/im.width)
    r=im.resize((w,h),Image.LANCZOS) if w<im.width else im
    r.save(sys.argv[2]+'-%d.webp'%w,quality=86,method=6)
print(im.size)
`, png, path.join(OUT, id)], { stdio: 'inherit' });
    console.log('rendered', id);
  }
}
await b.close();
