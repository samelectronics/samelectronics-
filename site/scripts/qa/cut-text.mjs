#!/usr/bin/env node
/**
 * R6 Part C5 · finds clipped text: an element whose own text overflows a box that hides overflow (or ends in an ellipsis),
 * or text that runs past the window edge. Runs each width in EN and AR, scrolling through the page so every section mounts.
 *   node scripts/qa/cut-text.mjs --url http://localhost:3100/ [--widths 1280,1440,1920] [--langs en,ar]
 * Prints one line per finding: width lang #section "text" (scrollWidth > clientWidth).
 */
import { createRequire } from 'node:module';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') && a.push([x.slice(2), all[i + 1]]), a), []));
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const URL_ = args.url || 'http://localhost:3100/';
const widths = (args.widths || '1280,1440,1920').split(',').map(Number);
const langs = (args.langs || 'en,ar').split(',');
const b = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
let total = 0;
for (const w of widths) for (const lang of langs) {
  const c = await b.newContext({ viewport: { width: w, height: 900 } });
  await c.addInitScript((l) => { try { localStorage.setItem('se-lang', l); localStorage.setItem('se-lang-asked', '1'); sessionStorage.setItem('se-boot', '1'); } catch {} }, lang);
  const p = await c.newPage();
  await p.route(/se-teardown-3d/, (r) => r.abort()); // the step engine is the same; software WebGL is too slow here
  await p.goto(URL_); await p.waitForTimeout(5000);
  if (lang === 'ar') { await p.evaluate(() => window.seI18n && window.seI18n.set && window.seI18n.set('ar')); await p.waitForTimeout(1200); }
  if (await p.evaluate(() => !!window.__tdc)) await p.evaluate(() => { window.__tdc.manual = true; });
  const found = new Map();
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) {
    await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(700);
    const hits = await p.evaluate(() => {
      const out = [], vw = innerWidth;
      for (const el of document.querySelectorAll('body *')) {
        const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
        if (!own || own.length < 2) continue;
        const r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        if (el.closest('[aria-hidden="true"],.se-marquee,[data-marquee],svg')) continue;
        const sec = (el.closest('section[id],footer,header,nav') || {}).id || el.closest('footer,header,nav')?.tagName.toLowerCase() || '?';
        const clip = /hidden|clip/.test(cs.overflowX) || cs.textOverflow === 'ellipsis';
        if (clip && el.scrollWidth > el.clientWidth + 1) out.push([sec, own.slice(0, 50), el.scrollWidth + '>' + el.clientWidth]);
        else if (r.right > vw + 1 || r.left < -1) { // past the window edge, unless an ancestor clips or scrolls it on purpose (marquees, carousels)
          let a = el.parentElement, scroller = false; while (a && a !== document.body) { const s = getComputedStyle(a); if (/auto|scroll|hidden|clip/.test(s.overflowX)) { scroller = true; break; } a = a.parentElement; }
          if (!scroller) out.push([sec, own.slice(0, 50), 'edge ' + Math.round(r.left) + '…' + Math.round(r.right)]);
        }
      }
      return out;
    });
    for (const h of hits) found.set(h[0] + '|' + h[1], h);
  }
  for (const [, h] of found) console.log(w, lang, '#' + h[0], JSON.stringify(h[1]), h[2]);
  console.log(`-- ${w} ${lang}: ${found.size} finding(s)`); total += found.size;
  await c.close();
}
await b.close();
console.log(`\n${total} finding(s) in total`);
