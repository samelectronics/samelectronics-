#!/usr/bin/env node
/**
 * R6 Part E · reads the owner's Excel (docs/Products.xlsx, kept unchanged) and writes src/content/catalog.ts.
 *   cd site && node --experimental-strip-types scripts/import-catalog.ts
 * Re-run it whenever the Excel changes. Rules agreed with the owner (20 Oct):
 *  - The Excel is used as it is: nothing is regrouped, merged or reinterpreted. Every entry keeps its raw text (`raw`).
 *  - Only obvious spelling that customers see is fixed, in `name` (display); every fix is listed in docs/CATALOG_CLEANUP.md.
 *  - Brands follow the owner's 15 (src/content/brands.ts): Honor, Redmi, POCO and Realme are their own brands, so their
 *    columns are filed under them (the Excel keeps them inside the Huawei, MI and Oppo sheets).
 *  - The MI, Oppo and Huawei lists: an entry naming 2+ models becomes an "Also fits" group.
 *  - Nothing about stock, prices or which quality/colour/manufacturer a part has is in the Excel: those come from the
 *    Control Room later (src/content/offers.ts), never from here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const XLSX = path.resolve(ROOT, '../docs/Products.xlsx');
const OUT = path.resolve(ROOT, 'src/content/catalog.ts');
const LOG = path.resolve(ROOT, '../docs/CATALOG_CLEANUP.md');

type Fix = { what: string; raw: string; name: string; why: string };
const fixes: Fix[] = [];
const questions: { what: string; raw: string; note: string }[] = [];

// ---------- display cleanup: obvious, customer-visible spelling only ----------
const sp = (s: string) => String(s ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const RULES: [RegExp, string, string][] = [
  [/\bIphone\b/g, 'iPhone', 'brand spelling'],
  [/\bDoogle\b/g, 'Google', 'typo'],
  [/\bHUAWIE\b/g, 'Huawei', 'typo'],
  [/\bREDMi\b/g, 'Redmi', 'brand spelling'],
  [/\bOne Plus\b/g, 'OnePlus', 'brand spelling'],
  [/\bNote 9oro\b/g, 'Note 9 Pro', 'typo'],
  [/\bPor\b/g, 'Pro', 'typo'],
  [/\bEngoy\b/g, 'Enjoy', 'typo'],
  [/\(S931$/g, '(S931)', 'missing bracket'],
  [/\(2043\)/g, '(2024)', 'typo in the year'],
  [/\(4G\) \)/g, '(4G)', 'extra bracket'],
  [/\bMENI\b/gi, 'Mini', 'typo'],
  [/\bChassia\b/gi, 'chassis', 'typo'],
  [/\bconnecter\b/gi, 'connector', 'typo'],
  [/\bvalume\b/gi, 'volume', 'typo'],
  [/\bSim trey\b/gi, 'SIM tray', 'typo'],
  [/\bSim Reader\b/gi, 'SIM reader', 'spelling'],
  [/\bMicroSD Card\b/g, 'microSD card', 'spelling'],
  [/\bTemperes\b/gi, 'Tempered', 'typo'],
  [/\bFinger print\b/gi, 'Fingerprint', 'spelling'],
  [/ @ /g, ' & ', '"@" used for "and"'],
  [/^Oled\b/g, 'OLED', 'spelling'],
  [/^incell$/g, 'Incell', 'capital letter'],
  [/^(ather|Anther)$/g, 'Other', 'typo'],
  [/^Repaied$/g, 'Refurbished', "the owner's brief names it Refurbished"],
  [/^Service pack$/g, 'Service Pack', 'capital letter'],
  [/^Ping$/g, 'Pink', 'typo'],
  [/^Bronza$/g, 'Bronze', 'typo'],
  [/^cream$/g, 'Cream', 'capital letter'],
  [/^Serie A$/g, 'A series', 'spelling'],
  [/^My series$/g, 'Mi series', 'typo'],
  [/^Pocophone series$/g, 'POCO series', 'brand name'],
  [/^Galaxy Tab pro$/g, 'Galaxy Tab Pro', 'capital letter'],
  [/^other$/g, 'Other', 'capital letter'],
];
// colour words in the Samsung screen example (upper case in the Excel; shown in normal case)
const COLOUR_FIX: Record<string, string> = { BALCK: 'Black', BLACKR: 'Black', LEVENDER: 'Lavender', LEVANDER: 'Lavender', VOILET: 'Violet', BLEU: 'Blue', BUE: 'Blue', ORANG: 'Orange', GOLS: 'Gold', YELLOE: 'Yellow', CREEM: 'Cream' };
function clean(what: string, raw: string): string {
  let s = sp(raw);
  const base = s;
  const why: string[] = [];
  if (what === 'Also fits list') {
    // the lists are typed in lower case: brand and series words get their normal capitals
    const W: Record<string, string> = { redmi: 'Redmi', poco: 'POCO', realme: 'Realme', note: 'Note', pro: 'Pro', lite: 'Lite', ultra: 'Ultra', plus: 'Plus', nova: 'Nova', mate: 'Mate', honor: 'Honor', reno: 'Reno', find: 'Find', mi: 'Mi', power: 'Power', prime: 'Prime', max: 'Max', se: 'SE' };
    const n = s.replace(/\b[a-z]+\b/g, (w) => W[w] || w).replace(/\((\d)g\)/g, '($1G)').replace(/\b(\d)g\b/g, '$1G');
    if (n !== s) { why.push('capital letters'); s = n; }
  }
  for (const [re, to, w] of RULES) { const n = s.replace(re, to); if (n !== s) { why.push(w); s = n; } }
  if (s !== base) fixes.push({ what, raw: base, name: s, why: [...new Set(why)].join(', ') });
  return s;
}
function cleanColour(raw: string): string {
  const base = sp(raw);
  let typo = false;
  const s = base.replace(/[A-Za-z]+/g, (w) => { const u = w.toUpperCase(); if (COLOUR_FIX[u]) { typo = true; return COLOUR_FIX[u]; } return /^[A-Z]{3,}$/.test(w) ? w[0] + w.slice(1).toLowerCase() : w; });
  if (typo) fixes.push({ what: 'Colour (Samsung screens)', raw: base, name: s, why: 'typo' });
  return s;
}
const slug = (s: string) => sp(s).toLowerCase().replace(/\+/g, ' plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- read ----------
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(XLSX);
const sheet = (name: string) => { const ws = wb.worksheets.find((w) => w.name.trim().toLowerCase() === name.toLowerCase()); if (!ws) throw new Error('sheet missing: ' + name); return ws; };
const val = (c: ExcelJS.Cell) => { const v = c.value as unknown; if (v == null) return ''; if (typeof v === 'object' && v && 'richText' in (v as object)) return (v as { richText: { text: string }[] }).richText.map((r) => r.text).join(''); if (typeof v === 'object' && v && 'result' in (v as object)) return String((v as { result: unknown }).result ?? ''); return String(v); };
const col = (ws: ExcelJS.Worksheet, letter: string, from: number, to = ws.rowCount) => { const out: { row: number; raw: string }[] = []; for (let r = from; r <= to; r++) { const t = val(ws.getCell(letter + r)); if (sp(t)) out.push({ row: r, raw: t }); } return out; };

// level 1 · catalogue (first sheet)
const main = wb.worksheets[0];
const categories = ['B', 'C', 'D', 'E', 'F', 'G'].map((L, i) => ({ id: ['parts', 'accessories', 'tools', 'repair', 'phones', 'other'][i], raw: sp(val(main.getCell(L + 4))), name: '', ar: sp(val(main.getCell(L + 5))), detailed: i === 0 }));
categories.forEach((c) => (c.name = c.raw.toLowerCase().replace(/(^|\s)\S/g, (m) => m.toUpperCase())));
// level 4 · the fixed list of 30 parts
const parts = col(main, 'B', 40, 69).map((p, i) => ({ id: 'p' + String(i + 1).padStart(2, '0'), raw: sp(p.raw), name: clean('Part', p.raw) }));
// level 5 · the master lists
const rowList = (row: number, from = 'E', to = 'O') => { const out: string[] = []; for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) { const t = val(main.getCell(String.fromCharCode(c) + row)); if (sp(t)) out.push(t); } return out; };
const qualities = rowList(40, 'E', 'N').map((r) => ({ id: slug(r), raw: sp(r), name: clean('Quality', r) }));
const colours = [...rowList(42, 'E', 'O'), ...rowList(43, 'E', 'O')].map((r) => ({ id: slug(r), raw: sp(r), name: clean('Colour', r) }));
const manufacturers = rowList(45, 'E', 'M').map((r) => ({ id: slug(r), raw: sp(r), name: clean('Manufacturer', r) }));
const specFields = [47, 49].map((r) => sp(val(main.getCell('D' + r))));

// level 2–3 · brands, series, models
type Model = { id: string; brand: string; series: string | null; raw: string; name: string; device: 'phone' | 'tablet' | 'watch'; sheet: string; cell: string; dupOf?: string; fits?: string[]; dubaiList?: boolean; note?: string };
type Series = { id: string; brand: string; raw: string; name: string; device: 'phone' | 'tablet' | 'watch' };
const series: Series[] = [], models: Model[] = [];
const seriesNo = (s: string) => sp(s).replace(/^\d+\s*-\s*/, '');
function addSeries(brand: string, raw: string | null, device: Series['device'] = 'phone') {
  if (raw == null) return null;
  const r = seriesNo(raw), id = brand + ':' + slug(r);
  if (!series.find((s) => s.id === id)) series.push({ id, brand, raw: sp(raw), name: clean('Series', r), device });
  return id;
}
function addModels(sheetName: string, letter: string, from: number, to: number, brand: string, seriesId: string | null, device: Model['device'], name: (raw: string) => string = (r) => clean('Model', r)) {
  for (const { row, raw } of col(sheet(sheetName), letter, from, to)) {
    const n = name(raw);
    let id = brand + '-' + slug(n), k = 2; while (models.find((m) => m.id === id)) id = brand + '-' + slug(n) + '-' + k++;
    const dup = models.find((m) => m.brand === brand && slug(m.name) === slug(n));
    models.push({ id, brand, series: seriesId, raw: sp(raw), name: n, device, sheet: sheetName, cell: letter + row, ...(dup ? { dupOf: dup.id } : {}) });
  }
}
// Apple: iPhone · iPad · Apple Watch (the G column holds generation notes next to the watches; kept, not shown)
addModels('Apple', 'B', 9, 60, 'apple', addSeries('apple', '1 - iPhone'), 'phone');
addModels('Apple', 'D', 9, 60, 'apple', addSeries('apple', '2 - iPad', 'tablet'), 'tablet');
addModels('Apple', 'F', 9, 60, 'apple', addSeries('apple', '3 - Apple Watch', 'watch'), 'watch');
for (const { row, raw } of col(sheet('Apple'), 'G', 9, 60)) { const m = models.find((x) => x.cell === 'F' + row); if (m) m.note = sp(raw); }
// Samsung: 13 series columns D…P from row 5 (the R/T/U block is the screen example, read below)
const SAM = sheet('Samsung');
'DEFGHIJKLMNOP'.split('').forEach((L) => { const raw = val(SAM.getCell(L + 4)); const tab = /tab/i.test(raw); addModels('Samsung', L, 5, SAM.rowCount, 'samsung', addSeries('samsung', raw, tab ? 'tablet' : 'phone'), tab ? 'tablet' : 'phone'); });
// MI sheet → Xiaomi (Mi + Xiaomi series), Redmi, POCO
addModels('MI', 'D', 16, 200, 'xiaomi', addSeries('xiaomi', val(sheet('MI').getCell('D15'))), 'phone');
addModels('MI', 'F', 16, 200, 'redmi', null, 'phone');
addModels('MI', 'H', 16, 200, 'poco', null, 'phone');
addModels('MI', 'J', 16, 200, 'xiaomi', addSeries('xiaomi', val(sheet('MI').getCell('J15'))), 'phone');
// huawei sheet → Honor (Honor + Magic series, "Huawei" prefix dropped), Huawei (P, Y, Mate, Nova)
const HW = sheet('huawei');
const honorName = (raw: string) => { const n = clean('Model', sp(raw).replace(/^Huawei\s+/i, '').replace(/^(?!Honor)/, 'Honor ')); fixes.push({ what: 'Model (Honor)', raw: sp(raw), name: n, why: 'Honor is its own brand: "Huawei" prefix dropped' }); return n; };
addModels('huawei', 'C', 4, 200, 'honor', addSeries('honor', val(HW.getCell('C3'))), 'phone', honorName);
'DEFG'.split('').forEach((L) => addModels('huawei', L, 4, 200, 'huawei', addSeries('huawei', val(HW.getCell(L + '3'))), 'phone'));
addModels('huawei', 'H', 4, 200, 'honor', addSeries('honor', val(HW.getCell('H3'))), 'phone', honorName);
// oppo sheet → Oppo (A, Reno, F, X series), Realme
const OP = sheet('oppo');
'CEFG'.split('').forEach((L) => addModels('oppo', L, 5, 200, 'oppo', addSeries('oppo', val(OP.getCell(L + '4'))), 'phone'));
addModels('oppo', 'D', 5, 200, 'realme', null, 'phone');
// no series
addModels('plus', 'D', 5, 200, 'oneplus', null, 'phone');
addModels('nokia', 'C', 6, 200, 'nokia', null, 'phone');
addModels('google', 'C', 5, 200, 'google', null, 'phone');
['vivo', 'infinix'].forEach((s) => { if (sheet(s).actualRowCount > 0) console.warn('note: the ' + s + ' sheet now has rows; add its columns to the importer'); });

// level 6 · the Samsung screen example (model → screen type × colour), as written
type Variant = { model: string; modelRaw: string; typeRaw: string; type: string; frame: 'framed' | 'frameless' | null; colourRaw: string; colour: string; cell: string };
const variants: Variant[] = [];
{ let cur: Model | null = null, curRaw = '';
  for (let r = 9; r <= SAM.rowCount; r++) {
    const m = sp(val(SAM.getCell('R' + r))), t = sp(val(SAM.getCell('T' + r))), c = sp(val(SAM.getCell('U' + r)));
    if (m && !/^\d+$/.test(m) && !/series$/i.test(m) && m !== 'Serie A') { curRaw = m; cur = models.find((x) => x.brand === 'samsung' && slug(x.raw) === slug(m)) || models.find((x) => x.brand === 'samsung' && slug(x.raw).replace(/-/g, '') === slug(m).replace(/-/g, '')) || null; if (!cur) questions.push({ what: 'Samsung screen example', raw: m, note: 'not found in the series columns (spelling differs); kept as written' }); }
    if (!curRaw || (!t && !c)) continue;
    const frame = /with frame/i.test(t) ? 'framed' : /^fill screen$/i.test(t) ? 'frameless' : null;
    // Z series rows put the colours in column T (no screen type): read as colour
    const zRow = !c && t && !/screen/i.test(t);
    variants.push({ model: cur ? cur.id : '', modelRaw: curRaw, typeRaw: zRow ? '' : t, type: zRow ? '' : frame === 'framed' ? 'Framed' : frame === 'frameless' ? 'Frameless' : t ? sp(t).replace(/^FULL SCREEN$/i, 'Full screen') : '', frame: zRow ? null : frame, colourRaw: zRow ? t : c, colour: cleanColour(zRow ? t : c), cell: 'R/T/U' + r });
  } }
fixes.push({ what: 'Screen type (Samsung)', raw: 'Full screen with frame / FILL Screen', name: 'Framed / Frameless', why: "the owner's brief: 'FILL screen' is the frameless screen" });

// "fits each other" lists (MI col M, oppo col J) and the Huawei "sells in Dubai" list (col L)
const BRANDS_OF: Record<string, string[]> = { MI: ['xiaomi', 'redmi', 'poco'], oppo: ['oppo', 'realme'], huawei: ['huawei', 'honor'] };
const norm = (s: string) => sp(s).toLowerCase().replace(/\b(xiaomi|mi|redmi|poco|oppo|realme|huawei|honor)\b/g, ' ').replace(/[^a-z0-9+]+/g, '');
const fitGroups: { id: string; sheet: string; cell: string; raw: string; names: string[]; models: (string | null)[]; multi: boolean }[] = [];
for (const [sh, L, from] of [['MI', 'M', 15], ['oppo', 'J', 6], ['huawei', 'L', 4]] as [string, string, number][]) {
  for (const { row, raw } of col(sheet(sh), L, from, 400)) {
    const body = sp(raw).replace(/\s*(\*+|\+-)\s*$/, '');
    const names = [...new Set(body.split(/\s*\/\s*|\s+-\s*|\s*-\s+|(?<=[0-9a-zA-Z)])-(?=[0-9a-zA-Z])/).map((x) => clean('Also fits list', x)).filter(Boolean))];
    const pool = models.filter((m) => BRANDS_OF[sh].includes(m.brand));
    const ids = names.map((n) => { const k = norm(n); const hit = pool.find((m) => norm(m.name) === k); return hit ? hit.id : null; });
    const g = { id: sh.toLowerCase() + '-' + row, sheet: sh, cell: L + row, raw: sp(raw), names, models: ids, multi: names.length >= 2 };
    fitGroups.push(g);
    ids.forEach((id) => { const m = models.find((x) => x.id === id); if (!m) return; if (g.multi) (m.fits ||= []).push(g.id); if (sh === 'huawei') m.dubaiList = true; });
  }
}
// duplicates are flagged, never deleted
models.filter((m) => m.dupOf).forEach((m) => questions.push({ what: 'Duplicate model', raw: m.raw + ' (' + m.sheet + ' ' + m.cell + ')', note: 'same as ' + models.find((x) => x.id === m.dupOf)!.cell + '; shown once' }));
questions.push({ what: 'Model', raw: 'Huawei Honor Huawei Y90 (huawei C43)', note: 'shown as written under Honor; which model is it?' });
questions.push({ what: 'Model', raw: 'F956 ( Z FOLD 6 6G 2024 )', note: '"6G" kept as written (5G?)' });
questions.push({ what: 'Apple Watch notes', raw: "'2rd Generation' (Apple G11, G13)", note: 'kept as written, not shown' });
questions.push({ what: 'Screen type', raw: "'Full screen' (no 'with frame', not 'FILL')", note: 'shown as "Full screen"; framed or frameless?' });

// ---------- write ----------
const header = `// GENERATED by scripts/import-catalog.ts from docs/Products.xlsx (the owner's Excel). Do not edit by hand: change the
// Excel (or the cleanup rules in the script) and re-run \`node --experimental-strip-types scripts/import-catalog.ts\`.
// \`raw\` = exactly as written in the Excel · \`name\` = what customers see (spelling fixes listed in docs/CATALOG_CLEANUP.md).
// Structure only: which qualities / colours / manufacturers each part really has, stock and prices come from the Control Room
// (src/content/offers.ts), never from this file.
`;
const types = `export type Named = { id: string; raw: string; name: string };
export type Category = Named & { ar: string; detailed: boolean };
export type Series = Named & { brand: string; device: 'phone' | 'tablet' | 'watch' };
export type Model = { id: string; brand: string; series: string | null; raw: string; name: string; device: 'phone' | 'tablet' | 'watch'; sheet: string; cell: string; dupOf?: string; fits?: string[]; dubaiList?: boolean; note?: string };
export type ScreenVariant = { model: string; modelRaw: string; typeRaw: string; type: string; frame: 'framed' | 'frameless' | null; colourRaw: string; colour: string; cell: string };
export type FitGroup = { id: string; sheet: string; cell: string; raw: string; names: string[]; models: (string | null)[]; multi: boolean };
`;
const J = (x: unknown) => JSON.stringify(x, null, 0).replace(/\},\{/g, '},\n  {').replace(/^\[\{/, '[\n  {').replace(/\}\]$/, '},\n]');
fs.writeFileSync(OUT, header + types + `
export const CATALOG_SOURCE = { file: 'docs/Products.xlsx', models: ${models.length}, parts: ${parts.length} } as const;
export const CATEGORIES: Category[] = ${J(categories)};
export const PARTS: Named[] = ${J(parts)};
export const QUALITIES: Named[] = ${J(qualities)};
export const COLOURS: Named[] = ${J(colours)};
export const MANUFACTURERS: Named[] = ${J(manufacturers)};
export const SPEC_FIELDS: string[] = ${JSON.stringify(specFields)};
export const SERIES: Series[] = ${J(series)};
export const MODELS: Model[] = ${J(models)};
export const SCREEN_VARIANTS: ScreenVariant[] = ${J(variants)};
export const FIT_GROUPS: FitGroup[] = ${J(fitGroups)};
`);

// a compact copy for the browser (public/se-catalog.js → window.SE_CATALOG), read by public/se-data.js: every model the
// Find My Part steps can show, the master lists and the "Also fits" groups. Loaded once, cached.
{
  const { BRANDS, BRAND_GROUPS } = await import('../src/content/brands.ts');
  const sName = (id: string | null) => (id ? series.find((s) => s.id === id)!.name : '');
  const multi = fitGroups.filter((g) => g.multi);
  const gi = new Map(multi.map((g, i) => [g.id, i]));
  const C = {
    brands: BRANDS, groups: BRAND_GROUPS,
    parts: parts.map((p) => [p.id, p.name]), qualities: qualities.map((q) => [q.id, q.name]), manufacturers: manufacturers.map((m) => [m.id, m.name]), colours: colours.map((c) => [c.id, c.name]),
    // [id, brand, series, name, device p|t|w, [also-fits group indexes]]
    models: models.filter((m) => !m.dupOf).map((m) => [m.id, m.brand, sName(m.series), m.name, m.device[0], (m.fits || []).map((f) => gi.get(f)).filter((x) => x != null)]),
    fits: multi.map((g) => [g.names, g.models]),
    screens: variants.filter((v) => v.model).map((v) => [v.model, v.type, v.colour]),
  };
  fs.writeFileSync(path.resolve(ROOT, 'public/se-catalog.js'), '// GENERATED by scripts/import-catalog.ts from docs/Products.xlsx. Do not edit by hand.\nwindow.SE_CATALOG=' + JSON.stringify(C) + ';\n');
}

// the cleanup log for the owner
const uniq = new Map<string, Fix>(); fixes.forEach((f) => uniq.set(f.what + '|' + f.raw, f));
const byBrand = (b: string) => models.filter((m) => m.brand === b && !m.dupOf).length;
const md = `# Catalogue cleanup log

Generated by \`site/scripts/import-catalog.ts\` from \`docs/Products.xlsx\` (the owner's Excel, kept unchanged).
The site keeps every entry exactly as written (\`raw\`) and shows a cleaned display name. **Only obvious spelling that
customers see is fixed.** Nothing was regrouped, merged or reinterpreted, and no model, part, colour or price was added.

## What was imported

- ${categories.length} catalogue categories (only *Mobile spare parts* is detailed in the Excel).
- ${parts.length} parts (the fixed list for every model).
- Master lists: ${qualities.length} qualities, ${colours.length} colours, ${manufacturers.length} manufacturers.
- ${models.length} models in ${series.length} series. Per brand (duplicates counted once):
${['apple', 'samsung', 'xiaomi', 'redmi', 'poco', 'huawei', 'honor', 'oppo', 'realme', 'oneplus', 'google', 'nokia'].map((b) => '  - ' + b + ': ' + byBrand(b)).join('\n')}
  - vivo, infinix, tecno: no models in the Excel yet ("Models coming soon").
- The Samsung screen example: ${variants.length} rows (screen type × colour).
- "Fits each other" lists: MI ${fitGroups.filter((g) => g.sheet === 'MI').length} entries, Oppo ${fitGroups.filter((g) => g.sheet === 'oppo').length}, Huawei "sells in Dubai" ${fitGroups.filter((g) => g.sheet === 'huawei').length}.
  ${fitGroups.filter((g) => g.multi).length} entries name 2 or more models and show as **Also fits**.
  ${fitGroups.filter((g) => g.multi).reduce((n, g) => n + g.models.filter((x) => !x).length, 0)} names in those entries don't match a model in the brand sheets. They are still shown as text; no model was added for them.

## Brand filing (the owner's 15 brands)

- The Huawei sheet's *Honor series* and *Magic series* are filed under **Honor**, without the "Huawei" prefix.
- The MI sheet's *Redmi series* is filed under **Redmi**, and *Pocophone series* under **POCO**.
- The Oppo sheet's *Realme series* is filed under **Realme**.

## Spelling fixes (${uniq.size})

| Where | In the Excel | On the site | Why |
|---|---|---|---|
${[...uniq.values()].map((f) => `| ${f.what} | ${f.raw.replace(/\|/g, '\\|')} | ${f.name.replace(/\|/g, '\\|')} | ${f.why} |`).join('\n')}

## For the owner to check (kept as written)

| What | Entry | Note |
|---|---|---|
${questions.map((q) => `| ${q.what} | ${q.raw.replace(/\|/g, '\\|')} | ${q.note} |`).join('\n')}
`;
fs.writeFileSync(LOG, md);
console.log(`catalog: ${models.length} models · ${series.length} series · ${parts.length} parts · ${variants.length} screen rows · ${fitGroups.length} list entries (${fitGroups.filter((g) => g.multi).length} also-fits) · ${uniq.size} fixes · ${questions.length} questions`);
