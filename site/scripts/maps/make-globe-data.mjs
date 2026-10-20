#!/usr/bin/env node
/**
 * R6 §13 · rebuilds the served-country highlights of the dot globes (public/se-globe-data.js) from the single country
 * list in src/content/facts.ts (mapCountries), so every globe follows the list. The land dot grid itself is kept
 * exactly as it was (same style); dots inside a served country move to `hi`, centroids (`ctr`) are recomputed.
 *   cd site && node scripts/maps/make-globe-data.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';
import { geoContains, geoCentroid } from 'd3-geo';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const facts = fs.readFileSync(path.join(ROOT, 'src/content/facts.ts'), 'utf8');
const block = facts.slice(facts.indexOf('mapCountries: confirmed(['), facts.indexOf('] as [name: string, geo: string, region: string][]'));
const list = [...block.matchAll(/\['([^']+)', '([^']+)', '([a-z]+)'\]/g)].map((m) => ({ name: m[1], geo: m[2], region: m[3] }));
const topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
const feats = feature(topo, topo.objects.countries).features;
const ALIAS = { Turkey: ['Turkey', 'Türkiye'], 'United Kingdom': ['United Kingdom'], Russia: ['Russia'] };
const find = (g) => feats.find((f) => (ALIAS[g] || [g]).includes(f.properties.name));
const served = list.map((c) => ({ ...c, f: find(c.geo) }));
const missing = served.filter((c) => !c.f).map((c) => c.geo); if (missing.length) { console.error('not found in Natural Earth:', missing); process.exit(1); }
const file = path.join(ROOT, 'public/se-globe-data.js'), src = fs.readFileSync(file, 'utf8');
const G = new Function('window', src + '; return window.SE_GLOBE;')({});
const pts = []; for (const arr of [G.land, G.hi]) for (let i = 0; i < arr.length; i += 2) pts.push([arr[i], arr[i + 1]]);
const land = [], hi = [];
for (const p of pts) (served.some((c) => geoContains(c.f, p)) ? hi : land).push(p);
// small countries can fall between grid dots: give each served country at least its centroid dot
const ctr = served.map((c) => { const k = geoCentroid(c.f); return [+k[0].toFixed(2), +k[1].toFixed(2)]; });
served.forEach((c, i) => { if (!hi.some((p) => geoContains(c.f, p))) hi.push(ctr[i]); });
const flat = (a) => a.flat().map((v) => +(+v).toFixed(1));
const out = `/* offline world dot data for hero globe (from world-atlas 110m) */\n/* R6 §13: hi + ctr rebuilt from src/content/facts.ts mapCountries by scripts/maps/make-globe-data.mjs (${served.length} countries) */\nwindow.SE_GLOBE={land:${JSON.stringify(flat(land))},hi:${JSON.stringify(flat(hi))},ctr:${JSON.stringify(ctr)},names:${JSON.stringify(served.map((c) => c.name))},dxb:${JSON.stringify(G.dxb)}};\n`;
fs.writeFileSync(file, out);
console.log('countries', served.length, 'land', land.length, 'hi', hi.length, 'from', pts.length);
