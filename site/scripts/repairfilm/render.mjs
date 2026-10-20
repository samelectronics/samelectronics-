#!/usr/bin/env node
/**
 * R6 §11 · renders the Repair Lab bench layers (scene.html) into public/assets/repair/<layer>-<640|1280>.webp
 *   cd site && node scripts/repairfilm/render.mjs [--only body,cup] [--shot all]
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
const LAYERS = ['mat', 'mat-hot', 'test0', 'test1', 'test2', 'test3', 'test4', 'sticker', 'body', 'bat-old', 'bat-new', 'port-old', 'port-new', 'screen-crack', 'screen-new', 'screen-boot', 'cup', 'pick'];
const only = args.only ? args.only.split(',') : args.shot ? [args.shot] : LAYERS;
const OUT = path.join(ROOT, 'public/assets/repair'), PNG = path.join(OUT, '.png'); fs.mkdirSync(PNG, { recursive: true });
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1280, height: 880 } });
await p.route('http://shot.local/**', (r) => {
  const u = new URL(r.request().url()).pathname;
  const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : path.join(ROOT, 'scripts/repairfilm', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' });
  r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html' } });
});
p.on('pageerror', (e) => console.error('page error', e.message));
for (const layer of only) {
  await p.goto('http://shot.local/scene.html?' + new URLSearchParams({ layer, w: '1280' }));
  await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
  if (layer === 'mat') fs.writeFileSync(path.join(ROOT, 'src/content/repairAnchors.json'), JSON.stringify(await p.evaluate(() => window.__anch)) + '\n');
  const png = path.join(PNG, layer + '.png');
  await p.locator('canvas').screenshot({ path: png, omitBackground: true });
  if (args.shot) { console.log('preview', png); continue; }
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA')
for w in (640,1280):
    r=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS) if w<im.width else im
    r.save(sys.argv[2]+'-%d.webp'%w,quality=84 if sys.argv[3]=='mat' else 88,method=6)
`, png, path.join(OUT, layer), layer]);
  console.log('rendered', layer);
}
await b.close();
