#!/usr/bin/env node
/**
 * Renders the G15 parts library once with the in-browser builder (public/se-parts-lib.js → se-teardown-3d.js)
 * and saves the pictures to public/parts/ so visitors never build them (G16).
 *   node scripts/qa/render-parts.mjs --url http://localhost:3000/ [--cdn dir]
 * Re-run it whenever a part model in se-teardown-3d.js changes, then bump PARTS_VERSION in se-parts-lib.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const OUT = path.resolve('public/parts');
const b = await pw.chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
if (args.cdn) {
  const CDN = path.resolve(args.cdn);
  await p.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (/localhost|127\.0\.0\.1|fonts\.g/.test(u.host)) return r.continue();
    let m = u.host === 'esm.sh' && u.pathname.match(/^\/three@[^/]+(\/.*)?$/);
    if (m) { const f = m[1] ? path.join(CDN, 'three', m[1]) : path.join(CDN, 'three/build/three.module.js'); return r.fulfill({ body: fs.readFileSync(f, 'utf8').replace(/from\s+['"]three['"]/g, "from 'https://esm.sh/three@0.160.0'"), headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' } }); }
    return r.abort();
  });
}
await p.goto(args.url || 'http://localhost:3000/', { waitUntil: 'load' });
await p.waitForFunction(() => window.seParts, null, { timeout: 60000 });
const lib = await p.evaluate(async () => { const l = await window.seParts.build(); return { large: l.large, thumb: l.thumb, front: l.front, names: l.names }; }, null);
fs.mkdirSync(OUT, { recursive: true });
const save = (url, file) => fs.writeFileSync(path.join(OUT, file), Buffer.from(url.split(',')[1], 'base64'));
lib.large.forEach((u, i) => save(u, `large-${i}.webp`));
lib.thumb.forEach((u, i) => save(u, `thumb-${i}.webp`));
fs.writeFileSync(path.join(OUT, 'front.json'), JSON.stringify(lib.front)); // copy into PARTS_FRONT in public/se-parts-lib.js
console.log('saved', lib.large.length, 'large +', lib.thumb.length, 'thumbs; front', JSON.stringify(lib.front));
await b.close();
