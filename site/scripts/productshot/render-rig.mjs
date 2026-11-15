#!/usr/bin/env node
// Owner (15 Nov): renders the Bench Test rig plate (rig.html) to public/assets/bench-rig.webp
//   cd site && node scripts/productshot/render-rig.mjs
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'); const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1900, height: 1900 } });
await p.route('http://shot.local/**', (r) => { const u = new URL(r.request().url()).pathname; const file = u.startsWith('/three/') ? path.join(ROOT, 'node_modules', u) : path.join(ROOT, 'scripts/productshot', u);
  if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' }); r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html' } }); });
p.on('pageerror', (e) => console.error('page error', e.message));
await p.goto('http://shot.local/rig.html?k=3'); await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
const png = path.join(ROOT, 'public/assets/pose/.png/bench-rig.png'); await p.locator('canvas').screenshot({ path: png, omitBackground: true }); await b.close();
execFileSync('python3', ['-I', '-c', 'import sys\nfrom PIL import Image\nImage.open(sys.argv[1]).convert("RGBA").resize((1240,1232),Image.LANCZOS).save(sys.argv[2],quality=90,method=6)', png, path.join(ROOT, 'public/assets/bench-rig.webp')]);
console.log('rendered bench-rig');
