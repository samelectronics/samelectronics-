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
for (const it of ['bat', 'bcv', 'flx', 'cam', 'sml', 'aud', 'frm', 'board']) JOBS['part-' + it] = { item: it, box: 'white', lcd: 'plain', label: '' };
JOBS['rep-crack'] = { item: 'crack', box: 'white', lcd: 'plain', label: '' };
JOBS['rep-fixed'] = { item: 'fixed', box: 'white', lcd: 'plain', label: '' };
// owner (27 Oct): the box lineups (every box of a range behind the screen, ~70% of each showing), for the iPad banners and the Showcase
JOBS['line-all'] = { item: 'line', boxes: 'zy,gx,xiaomi-sp,huawei-sp,apple-sp,samsung-sp', box: 'samsung-sp', lcd: 'plain', label: '', aspect: '2' };
// owner (27 Oct): every part on its own, no carton (solo-<kind>), same stage and size
for (const it of ['scr', 'bat', 'bcv', 'flx', 'cam', 'sml', 'aud', 'frm', 'board']) JOBS['solo-' + it] = { item: it, box: 'white', lcd: 'plain', label: '', nobox: '1' };
// owner (27 Oct): an Arabic set, the carton peeking out on the RIGHT (rendered, so its print stays readable): <id>-ar-<w>.webp
for (const id of Object.keys(JOBS).filter((k) => !k.startsWith('solo-'))) JOBS[id + '-ar'] = { ...JOBS[id], ar: '1' };
const only = args.only ? args.only.split(',') : args.shot ? [args.shot] : Object.keys(JOBS);
const OUT = path.join(ROOT, 'public/assets/pose'), PNG = path.join(OUT, '.png'); fs.mkdirSync(PNG, { recursive: true });
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 2500, height: 2500 } });
await p.route('http://shot.local/**', (r) => {
  const u = new URL(r.request().url()).pathname;
  const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : u.startsWith('/assets/') ? path.join(ROOT, 'public', u) : path.join(ROOT, 'scripts/productshot', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' });
  r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : file.endsWith('.jpg') ? 'image/jpeg' : file.endsWith('.json') ? 'application/json' : file.endsWith('.png') ? 'image/png' : 'text/html' } });
});
p.on('pageerror', (e) => console.error('page error', e.message));
for (const id of only) {
  const j = JOBS[id]; if (!j) { console.error('no job', id); continue; }
  await p.goto('http://shot.local/pose.html?' + new URLSearchParams({ ...j, w: args.w || '2400' }));
  await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
  const png = path.join(PNG, id + '.png');
  await p.locator('canvas').screenshot({ path: png, omitBackground: true });
  if (args.shot) { console.log('preview', png); continue; }
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
# owner (27 Oct): the frame is NOT cropped per item: the stage and camera are fixed, so every shot lines up with every other
sq=Image.open(sys.argv[1]).convert('RGBA')
for w in (240,480,960):
    # owner (26 Oct): crystal clear. Rendered at 2400px, so every size is a supersampled downscale, never an upscale
    r=sq.resize((w,round(w*sq.height/sq.width)),Image.LANCZOS)
    r.save(sys.argv[2]+'-%d.webp'%w,quality=90,method=6)
`, png, path.join(OUT, id)]);
  console.log('rendered', id);
}
await b.close();
