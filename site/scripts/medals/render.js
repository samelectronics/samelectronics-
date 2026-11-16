const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = '/home/claude/samelectronics-/site/node_modules', DIR = __dirname;
const srv = http.createServer((q, s) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u.startsWith('/three/') ? path.join(ROOT, u) : path.join(DIR, u === '/' ? 'index.html' : u); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }); s.end(d); }); }).listen(3299);
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const out = process.argv[2];
 for (const t of ['gold', 'silver', 'bronze', 'off']) { const p = await b.newPage({ viewport: { width: 512, height: 512 } });
  await p.goto('http://localhost:3299/?t=' + t + '&s=512'); await p.waitForFunction(() => window.__done, null, { timeout: 60000 }); await p.waitForTimeout(300);
  await p.screenshot({ path: out + '/m-' + t + '.png', omitBackground: true }); await p.close(); }
 await b.close(); srv.close(); })();
