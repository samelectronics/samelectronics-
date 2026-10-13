#!/usr/bin/env node
/**
 * G9 coverage check: loads the home page in Arabic, scrolls every section, waits through the hero reel,
 * opens the overlays, and lists every visible text that still contains English words
 * (brands, model names, codes, units and handles are allowed).
 *   node scripts/qa/i18n-check.mjs --url http://localhost:3000/ [--out file] [--shots dir]
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const ALLOW = /\b(?:Apple|Samsung|SAMSUNG|Xiaomi|Redmi|POCO|Realme|realme|Oppo|oppo|OPPO|Vivo|vivo|Huawei|HUAWEI|Honor|HONOR|Google|Sony|SONY|Tecno|TECNO|Infinix|iPhone|iPad|Galaxy|Pixel|Xperia|Camon|Spark|Note|Pro|Max|Ultra|Plus|Magic\d*|Nova|Reno|OLED|LCD|AED|mAh|DXB|UAE|QR|Face|ID|True|Tone|Ctrl|EN|WhatsApp|Instagram|TikTok|Facebook|Code|SE|Li-ion|GX|Polymer|Battery|Rated|capacity|Typical|Nominal|voltage|Charge|limit)\b/g;
const b = await pw.chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route('**/*', (r) => { const u = r.request().url(); if (/se-teardown-3d|se-3d\.js|esm\.sh/.test(u)) return r.abort(); return /localhost|127\.0\.0\.1|fonts\.g/.test(u) ? r.continue() : r.abort(); });
await p.addInitScript(() => { try { localStorage.setItem('se-lang', 'ar'); } catch (e) {} });
const left = new Map();
const sweep = async (where) => {
  const found = await p.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const el = n.parentElement;
      if (!el || el.closest('script,style,noscript,[data-no-i18n],[data-sc-name="SE Brand Logo"]')) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
      const s = n.data.replace(/\s+/g, ' ').trim();
      if (/[A-Za-z]{2}/.test(s)) out.push(s);
    }
    for (const el of document.querySelectorAll('[placeholder],[title],[aria-label]')) for (const a of ['placeholder', 'title', 'aria-label']) { const v = el.getAttribute(a); if (v && /[A-Za-z]{2}/.test(v)) out.push('@' + a + ': ' + v); }
    return out;
  });
  for (const s of found) {
    const rest = s.replace(ALLOW, '').replace(/[A-Z]{1,4}-?[\dA-Z]{2,}(?:-[\dA-Z]+)*/g, '').replace(/[\w.+-]+@[\w.-]+|@[\w.]+|https?:\/\/\S+/g, '');
    if (!/[A-Za-z]{2}/.test(rest)) continue;
    if (!left.has(s)) left.set(s, where);
  }
};
await p.goto(args.url || 'http://localhost:3000/', { waitUntil: 'load' });
await p.waitForTimeout(5000);
const dir = await p.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
for (let i = 0; i < 6; i++) { await sweep('hero'); await p.waitForTimeout(5500); }
const H = await p.evaluate(() => document.documentElement.scrollHeight);
let k = 0;
for (let y = 0; y < H; y += 600) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(900); await sweep('y=' + y); if (args.shots && k++ % 3 === 0) await p.screenshot({ path: path.join(args.shots, `ar-${String(y).padStart(5, '0')}.png`) }).catch(() => {}); }
const click = async (re) => p.evaluate((src) => { const r = new RegExp(src); const el = [...document.querySelectorAll('button,a,[role=button]')].find((e) => r.test((e.textContent || '') + ' ' + (e.getAttribute('title') || '') + ' ' + (e.getAttribute('aria-label') || ''))); if (el) el.click(); return !!el; }, re.source);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600);
for (const re of [/ابحث عن قطعتي/, /السلة/, /سمسوم/]) { const ok = await click(re); await p.waitForTimeout(2500); await sweep('overlay ' + re.source + ' ' + ok); await p.keyboard.press('Escape'); await p.evaluate(() => [...document.querySelectorAll('[style*="z-index: 90"]')].forEach((e) => e.click())); await p.waitForTimeout(500); }
const list = [...left.entries()].map(([s, w]) => `${w}\t${s}`);
if (args.out) fs.writeFileSync(args.out, list.join('\n'));
console.log(`document: ${dir} · untranslated texts: ${list.length}`);
console.log(list.slice(0, 400).join('\n'));
await b.close();
