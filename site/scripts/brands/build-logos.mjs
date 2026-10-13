#!/usr/bin/env node
/**
 * G18 brand logos: builds public/assets/brands/<id>.svg for the 14 brands, read by the shared
 * SE Brand Logo component (src/components/dc/SEBrandLogo.*), which recolours them to fit each place.
 *
 *   node scripts/brands/build-logos.mjs
 *
 * Every file has the same layout so all brands share one visual height: a 100-unit-high box, the symbol
 * (when the brand has one) 100 units high on the left, and the wordmark 54 units high, vertically centred.
 *
 * Sources (see SOURCES below, also written to public/assets/brands/SOURCES.md):
 *   - Official SVGs from Simple Icons (CC0) where available, and the Google wordmark from gilbarbara/logos (CC0).
 *   - Where no official file could be obtained, the cleanest available wordmark: the name outlined in the
 *     typeface closest to the brand's own wordmark (SIL OFL fonts in scripts/brands/sources/). These are
 *     marked TO CONFIRM: replace the brand's entry with the official SVG when the owner supplies it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import opentype from 'opentype.js';
import { svgPathBbox } from 'svg-path-bbox';

const require = createRequire(import.meta.url);
const si = require('simple-icons');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'sources');
const OUT = path.resolve(HERE, '../../public/assets/brands');

const H = 100; // box height
const WORD_H = 54; // wordmark height
const GAP = 16; // symbol → wordmark

/** One part of a logo: path data with its bounding box. */
const fromPath = (d) => {
  const [x0, y0, x1, y1] = svgPathBbox(d);
  return { d, x0, y0, x1, y1 };
};
const fromPaths = (ds) => {
  const bbs = ds.map((d) => svgPathBbox(d));
  return { d: ds.join(' '), x0: Math.min(...bbs.map((b) => b[0])), y0: Math.min(...bbs.map((b) => b[1])), x1: Math.max(...bbs.map((b) => b[2])), y1: Math.max(...bbs.map((b) => b[3])) };
};
const simple = (key) => fromPath(si[key].path);
const fileSvg = (file) => fromPaths([...fs.readFileSync(path.join(SRC, file), 'utf8').matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]));
const fonts = {};
const text = (str, fontFile, { tracking = 0, italic = 0 } = {}) => {
  const font = (fonts[fontFile] ||= opentype.parse(fs.readFileSync(path.join(SRC, fontFile)).buffer));
  const size = 100;
  let x = 0;
  const ds = [];
  const glyphs = font.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    if (italic) p.commands.forEach((c) => ['x', 'x1', 'x2'].forEach((k) => c[k] != null && (c[k] -= italic * (c[k.replace('x', 'y')] ?? 0))));
    ds.push(p.toPathData(2));
    const kern = i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) : 0;
    x += ((g.advanceWidth + kern) / font.unitsPerEm) * size + tracking * size;
  });
  return fromPaths(ds.filter(Boolean));
};

/** id → parts, source note, and whether the owner still has to confirm the artwork. */
const SOURCES = {
  apple: { symbol: () => simple('siApple'), word: () => text('Apple', 'Inter.ttf', { tracking: -0.01 }), note: 'Apple symbol: Simple Icons (CC0). "Apple" wordmark: Inter Semibold (closest available).', confirm: true },
  samsung: { word: () => simple('siSamsung'), note: 'SAMSUNG wordmark: Simple Icons (CC0).' },
  xiaomi: { symbol: () => simple('siXiaomi'), word: () => text('Xiaomi', 'Nunito.ttf'), note: 'Mi symbol: Simple Icons (CC0). "Xiaomi" wordmark: Nunito ExtraBold (closest available).', confirm: true },
  redmi: { word: () => text('Redmi', 'Poppins.ttf', { tracking: -0.01 }), note: 'Redmi wordmark: Poppins Bold (no official SVG available).', confirm: true },
  poco: { word: () => text('POCO', 'Rubik.ttf', { tracking: 0.01 }), note: 'POCO wordmark: Rubik Black (no official SVG available).', confirm: true },
  realme: { word: () => text('realme', 'Comfortaa.ttf'), note: 'realme wordmark: Comfortaa Bold (no official SVG available).', confirm: true },
  oppo: { word: () => simple('siOppo'), note: 'OPPO wordmark: Simple Icons (CC0).' },
  vivo: { word: () => simple('siVivo'), note: 'vivo wordmark: Simple Icons (CC0).' },
  huawei: { symbol: () => simple('siHuawei'), word: () => text('HUAWEI', 'Montserrat.ttf', { tracking: 0.08 }), note: 'Huawei flower: Simple Icons (CC0). "HUAWEI" wordmark: Montserrat SemiBold (closest available).', confirm: true },
  honor: { word: () => simple('siHonor'), note: 'HONOR wordmark: Simple Icons (CC0).' },
  google: { word: () => fileSvg('google-wordmark.svg'), wordScale: 1.3, note: 'Google wordmark: gilbarbara/logos (CC0).' },
  sony: { word: () => simple('siSony'), note: 'SONY wordmark: Simple Icons (CC0).' },
  tecno: { word: () => text('TECNO', 'Exo2.ttf', { tracking: 0.02 }), note: 'TECNO wordmark: Exo 2 ExtraBold Italic (no official SVG available).', confirm: true },
  infinix: { word: () => text('Infinix', 'Audiowide.ttf'), note: 'Infinix wordmark: Audiowide (no official SVG available).', confirm: true },
};

const place = (p, height, x, yMid) => {
  const k = height / (p.y1 - p.y0);
  const tx = x - p.x0 * k, ty = yMid - ((p.y0 + p.y1) / 2) * k;
  return { el: `<path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(5)})" d="${p.d}"/>`, w: (p.x1 - p.x0) * k };
};

fs.mkdirSync(OUT, { recursive: true });
const md = ['# Brand logos (G18)', '', 'Built by `site/scripts/brands/build-logos.mjs`. Brand names and logos belong to their owners and are used only to show compatibility.', '', '| Brand | Source | Status |', '|---|---|---|'];
for (const [id, s] of Object.entries(SOURCES)) {
  let x = 0;
  const els = [];
  if (s.symbol) {
    const sym = place(s.symbol(), H, x, H / 2);
    els.push(sym.el);
    x += sym.w + GAP;
  }
  const word = place(s.word(), WORD_H * (s.wordScale || 1), x, H / 2); // wordScale: wordmarks with descenders (Google) match the others' cap height
  els.push(word.el);
  x += word.w;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(x)} ${H}" fill="#000">${els.join('')}</svg>\n`;
  fs.writeFileSync(path.join(OUT, id + '.svg'), svg);
  md.push(`| ${id} | ${s.note} | ${s.confirm ? 'TO CONFIRM: replace with the official SVG' : 'Official'} |`);
  console.log(id.padEnd(8), Math.ceil(x) + '×' + H, s.confirm ? 'TO CONFIRM' : 'official');
}
fs.writeFileSync(path.join(OUT, 'SOURCES.md'), md.join('\n') + '\n');
