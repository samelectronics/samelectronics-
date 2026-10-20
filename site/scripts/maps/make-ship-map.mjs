#!/usr/bin/env node
/**
 * R6 §10 · the incoming-shipment map: real coastlines and country borders (Natural Earth 50m via world-atlas), projected
 * once with d3-geo (Mercator fitted to the Gulf → South China region) into SVG path data:
 *   cd site && node scripts/maps/make-ship-map.mjs   →   public/se-ship-map.json (fetched when the Deals section nears)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature, mesh } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
const W = 520, H = 230, BOX = { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: [[40, 5], [124, 44]] } };
const proj = geoMercator().fitExtent([[6, 6], [W - 6, H - 6]], BOX).clipExtent([[-4, -4], [W + 4, H + 4]]);
const gp = geoPath(proj).digits(0);
const countries = feature(topo, topo.objects.countries).features;
const near = countries.filter((f) => { const b = geoPath().bounds(f); return b[1][0] > 30 && b[0][0] < 134 && b[1][1] > -2 && b[0][1] < 52; });
const land = gp(feature(topo, topo.objects.land));
const ids = new Set(near.map((f) => f.id));
const borders = gp(mesh(topo, topo.objects.countries, (a, b) => a !== b && (ids.has(a.id) || ids.has(b.id))));
const pt = (lon, lat) => proj([lon, lat]).map((v) => Math.round(v * 10) / 10);
const out = JSON.stringify({ src: 'Natural Earth 50m (world-atlas), Mercator', w: W, h: H, land, borders, shenzhen: pt(114.06, 22.54), dubai: pt(55.3, 25.27) });
fs.writeFileSync(path.join(ROOT, 'public/se-ship-map.json'), out);
console.log('land', land.length, 'borders', borders.length, 'countries', near.length, out.length);
