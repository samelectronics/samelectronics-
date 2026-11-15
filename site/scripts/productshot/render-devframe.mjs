#!/usr/bin/env node
// Owner (15 Nov): renders the Home hero device frames (devframe.html) as real titanium: public/assets/frame-<name>.webp
//   cd site && node scripts/productshot/render-devframe.mjs
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'); const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const JOBS = { ipad: { w: 384, h: 540, r: 32, in: 4, btn: [['t', 300, 34], ['r', 70, 40]] }, phone: { w: 212, h: 436, r: 38, in: 3, btn: [['l', 92, 22], ['l', 126, 40], ['l', 174, 40], ['r', 124, 62]] } };
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1800, height: 2000 } });
await p.route('http://shot.local/**', (r) => { const u = new URL(r.request().url()).pathname; const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : path.join(ROOT, 'scripts/productshot', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' }); r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html' } }); });
p.on('pageerror', (e) => console.error('page error', e.message));
for (const [name, j] of Object.entries(JOBS)) {
  await p.goto('http://shot.local/devframe.html?' + new URLSearchParams({ k: 3, w: j.w, h: j.h, r: j.r, in: j.in, btn: JSON.stringify(j.btn) })); await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
  const png = path.join(ROOT, 'public/assets/pose/.png/frame-' + name + '.png'); await p.locator('canvas').screenshot({ path: png, omitBackground: true });
  execFileSync('python3', ['-I', '-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGBA"); im.resize((im.width*2//3, im.height*2//3), Image.LANCZOS).save(sys.argv[2], quality=92, method=6)', png, path.join(ROOT, 'public/assets/frame-' + name + '.webp')]);
  console.log('rendered', name); }
await b.close();
