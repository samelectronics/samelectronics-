'use client';
// R9 · Control Room → Excel · import & price lists.
//  1. Load the website catalogue into the database (live mode, once): adds the bundled products and their models; rows that
//     already exist are never touched.
//  2. Import from Excel/CSV: columns are recognised by their headings (and can be changed), a preview shows new / changed /
//     unchanged / problem rows, ticks decide what may change (prices, stock, names, new parts). Nothing is ever deleted.
//  3. Template: the current products in exactly the columns the import reads.
//  4. Price list builder: filters, retail and/or trade, columns, one sheet or a tab per brand / part type, branded header,
//     Excel or print/PDF. Never shows cost, never "AED 0" (unpriced parts say "Ask").
// Excel is read and written in the browser (exceljs, loaded only when used). Daftra stays the brain: this only edits the
// website's catalogue, and a pull from Daftra (Daftra module) can overwrite prices and stock again.
import React, { useMemo, useState } from 'react';
import { backend, live, type Staff } from '@/lib/backend';
import { data, products, rawProducts, invalidate, type Raw } from '@/lib/catalog';
import { Panel, Badge, can, money } from './kit';

type Field = 'id' | 'title' | 'model_id' | 'category' | 'part_name' | 'grade' | 'quality' | 'manufacturer' | 'retail_price' | 'wholesale_price' | 'stock_qty' | 'price_mode' | 'price_note' | 'visible' | 'barcode' | 'location';
const FIELDS: [Field, string, string[]][] = [
  ['id', 'Part number', ['part number', 'part no', 'id', 'sku', 'code', 'reference', 'ref', 'item code']],
  ['title', 'Name', ['name', 'title', 'product', 'item', 'description']],
  ['model_id', 'Model', ['model', 'model id', 'device', 'phone']],
  ['category', 'Part type', ['part type', 'category', 'type']],
  ['part_name', 'Part', ['part', 'part name']],
  ['grade', 'Grade', ['grade']],
  ['quality', 'Quality', ['quality']],
  ['manufacturer', 'Made by', ['made by', 'manufacturer', 'maker', 'brand of part']],
  ['retail_price', 'Retail price (AED)', ['retail price', 'retail', 'price', 'selling price', 'unit price']],
  ['wholesale_price', 'Trade price (AED)', ['trade price', 'trade', 'wholesale price', 'wholesale']],
  ['stock_qty', 'Stock', ['stock', 'qty', 'quantity', 'stock qty', 'balance']],
  ['price_mode', 'Price shows as', ['price shows as', 'price mode', 'price display']],
  ['price_note', 'Price note', ['price note', 'note']],
  ['visible', 'On the website', ['on the website', 'visible', 'show', 'active']],
  ['barcode', 'Barcode', ['barcode', 'ean']],
  ['location', 'Location', ['location', 'shelf', 'bin']],
];
const NUM: Field[] = ['retail_price', 'wholesale_price', 'stock_qty'];
const MODES = ['exact', 'range', 'from', 'whatsapp', 'call', 'trade'];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\b(aed|usd|eur)\b/g, ' ').replace(/\s+/g, ' ').trim(); // "Retail price (AED)" → "retail price"
const cell = (v: unknown): string => { if (v == null) return ''; if (typeof v === 'object') { const o = v as { text?: string; result?: unknown; richText?: { text: string }[] }; if (o.richText) return o.richText.map((r) => r.text).join(''); if (o.text != null) return String(o.text); if (o.result != null) return String(o.result); } return String(v).trim(); };
const ExcelJS = () => import('exceljs').then((m) => (m as unknown as { default?: typeof import('exceljs') }).default || m);
function download(name: string, buf: ArrayBuffer) { const u = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 2000); }

type Row = { n: number; vals: Partial<Record<Field, string>>; kind: 'new' | 'changed' | 'same' | 'error'; why?: string; patch?: Record<string, unknown> };

export default function ExcelMod({ me }: { me: Staff }) {
  const canP = can(me, 'prices'), canS = can(me, 'stock'), canC = can(me, 'products');
  return (
    <div className="cr-grid">
      {live && canC ? <LoadCatalogue /> : null}
      <Importer canP={canP} canS={canS} canC={canC} me={me} />
      <PriceList />
    </div>
  );
}

// ── 1 · load the bundled catalogue into the database ───────────────────────────────────────────────────────────────
function LoadCatalogue() {
  const [msg, setMsg] = useState(''), [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true); setMsg('');
    const D = data(); const rs = rawProducts(); if (!D || !rs.length) { setMsg('The catalogue is still loading. Try again in a second.'); setBusy(false); return; }
    const { insertMissing } = await import('@/lib/backend/supabase');
    const need = new Set(rs.map((p) => p.model_id));
    const models = D.models.filter((m) => need.has(m.id)).map((m) => ({ id: m.id, brand_id: m.brand_id, series: m.series, name: m.name, model_numbers: m.model_numbers || [], device: m.device }));
    const a = await insertMissing('models', models);
    if (a.error) { setMsg('Models: ' + a.error); setBusy(false); return; }
    const keep = ['id', 'model_id', 'category', 'part', 'part_name', 'grade', 'quality', 'manufacturer', 'title', 'shot', 'retail_price', 'wholesale_price', 'stock_qty', 'low_stock_threshold', 'badges', 'visible', 'sample'];
    const b = await insertMissing('products', rs.map((p) => Object.fromEntries(keep.map((k) => [k, (p as unknown as Record<string, unknown>)[k] ?? null]))));
    setMsg(b.error ? 'Products: ' + b.error : `${a.ok} models and ${b.ok} products added. Parts already in the database were left as they are.`);
    await backend.log('catalogue.load', 'products', `${b.ok} products, ${a.ok} models`);
    setBusy(false);
  };
  return (
    <Panel t="Website catalogue → database" d="Once, after connecting Supabase: copies the website's catalogue into the database so every change from the Control Room is saved for everyone. Nothing that is already there is changed." className="span3">
      <div className="cr-acts"><button type="button" className="cr-btn" disabled={busy} onClick={run}>{busy ? 'Loading…' : 'Load the catalogue into the database'}</button>{msg ? <span className={msg.includes(':') ? 'cr-err' : 'cr-ok'}>{msg}</span> : null}</div>
    </Panel>
  );
}

// ── 2/3 · import + template ──────────────────────────────────────────────────────────────────────────────────────────
function Importer({ canP, canS, canC, me }: { canP: boolean; canS: boolean; canC: boolean; me: Staff }) {
  const [file, setFile] = useState(''), [heads, setHeads] = useState<string[]>([]), [grid, setGrid] = useState<string[][]>([]), [map, setMap] = useState<Partial<Record<Field, number>>>({});
  const [allow, setAllow] = useState({ prices: canP, stock: canS, names: canC, add: canC }), [show, setShow] = useState<'all' | Row['kind']>('all'), [busy, setBusy] = useState(false), [msg, setMsg] = useState(''), [err, setErr] = useState('');
  const read = async (f: File) => {
    setErr(''); setMsg(''); setFile(f.name);
    try {
      let rows: string[][] = [];
      if (/\.csv$/i.test(f.name)) {
        const t = await f.text(), sep = (t.split('\n')[0].match(/;/g) || []).length > (t.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
        rows = t.split(/\r?\n/).filter((l) => l.trim()).map((l) => { const out: string[] = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === sep && !q) { out.push(cur.trim()); cur = ''; } else cur += ch; } out.push(cur.trim()); return out; });
      } else {
        const X = await ExcelJS(); const wb = new X.Workbook(); await wb.xlsx.load(await f.arrayBuffer()); const ws = wb.worksheets[0];
        ws.eachRow({ includeEmpty: false }, (r) => { const v = r.values as unknown[]; rows.push(v.slice(1).map(cell)); });
      }
      const hi = rows.findIndex((r) => r.filter(Boolean).length >= 2); if (hi < 0) throw new Error('No heading row found.');
      const h = rows[hi].map((x) => x || ''), m: Partial<Record<Field, number>> = {};
      FIELDS.forEach(([k, , al]) => { const i = h.findIndex((x) => al.includes(norm(x))); if (i >= 0) m[k] = i; });
      setHeads(h); setGrid(rows.slice(hi + 1)); setMap(m);
      if (m.id == null) setErr('Choose which column holds the part number (below).');
    } catch (e) { setErr('Could not read this file: ' + (e as Error).message); setHeads([]); setGrid([]); }
  };
  const D = data(), cur = useMemo(() => new Map(rawProducts().map((p) => [p.id, p])), [grid]); // eslint-disable-line react-hooks/exhaustive-deps
  const rows: Row[] = useMemo(() => grid.map((g, i) => {
    const vals: Partial<Record<Field, string>> = {}; (Object.keys(map) as Field[]).forEach((k) => { const v = g[map[k]!]; if (v != null && v !== '') vals[k] = v; });
    const n = i + 2; if (!vals.id) return { n, vals, kind: 'error', why: 'No part number' };
    for (const k of NUM) if (vals[k] != null && isNaN(+String(vals[k]).replace(/,/g, ''))) return { n, vals, kind: 'error', why: k.replace('_', ' ') + ' is not a number' };
    if (vals.price_mode && !MODES.includes(norm(vals.price_mode).replace(/ .*/, ''))) return { n, vals, kind: 'error', why: 'Price shows as: use exact, range, from, whatsapp, call or trade' };
    const old = cur.get(vals.id), patch: Record<string, unknown> = {};
    const num = (k: Field) => +String(vals[k]).replace(/,/g, '');
    if (allow.prices) { if (vals.retail_price != null && num('retail_price') > 0) patch.retail_price = num('retail_price'); if (vals.wholesale_price != null && num('wholesale_price') > 0) patch.wholesale_price = num('wholesale_price'); if (vals.price_mode) patch.price_mode = norm(vals.price_mode).replace(/ .*/, ''); if (vals.price_note != null) patch.price_note = vals.price_note; }
    if (allow.stock && vals.stock_qty != null) patch.stock_qty = Math.max(0, Math.round(num('stock_qty')));
    if (allow.names) { (['title', 'part_name', 'quality', 'barcode', 'location'] as Field[]).forEach((k) => { if (vals[k] != null) patch[k] = vals[k]; }); if (vals.visible != null) patch.visible = !/^(no|false|0|hide|hidden)$/i.test(vals.visible); }
    if (!old) {
      if (!allow.add) return { n, vals, kind: 'error', why: 'New part (tick “Add new parts” to add it)' };
      if (!vals.title) return { n, vals, kind: 'error', why: 'New part needs a name' };
      const model = D?.models.find((m) => m.id === vals.model_id || m.name.toLowerCase() === (vals.model_id || '').toLowerCase()), cat = D?.categories.find((c) => c.id === vals.category || c.name.toLowerCase() === (vals.category || '').toLowerCase());
      if (!model) return { n, vals, kind: 'error', why: 'Unknown model' };
      if (!cat) return { n, vals, kind: 'error', why: 'Unknown part type' };
      return { n, vals, kind: 'new', patch: { ...patch, id: vals.id, title: vals.title, model_id: model.id, category: cat.id, part_name: vals.part_name || cat.one, grade: vals.grade || 'AQ', quality: vals.quality || '', manufacturer: vals.manufacturer || null, retail_price: patch.retail_price ?? 0, wholesale_price: patch.wholesale_price ?? 0, stock_qty: patch.stock_qty ?? 0, sample: false } };
    }
    // compare with the defaults filled in, so an unset price setting equals "exact", an unset note equals empty, etc.
    const was = (k: string) => { const o = old as unknown as Record<string, unknown>; const v = o[k]; return v == null ? ({ price_mode: 'exact', price_note: '', visible: true, barcode: '', location: '', quality: '' } as Record<string, unknown>)[k] ?? '' : v; };
    const diff = Object.fromEntries(Object.entries(patch).filter(([k, v]) => String(was(k)) !== String(v)));
    return { n, vals, kind: Object.keys(diff).length ? 'changed' : 'same', patch: diff };
  }), [grid, map, allow, cur, D]);
  const count = (k: Row['kind']) => rows.filter((r) => r.kind === k).length;
  const apply = async () => {
    setBusy(true); setMsg(''); let ok = 0, bad = 0; const fails: string[] = [];
    for (const r of rows) {
      if (r.kind !== 'new' && r.kind !== 'changed') continue;
      let res = r.kind === 'new' ? await backend.addProduct(r.patch as Raw & { id: string; title: string }) : await backend.saveProduct(r.vals.id!, r.patch!);
      if (!res.ok && r.kind === 'changed' && /not in the database/i.test(res.error)) { const old = cur.get(r.vals.id!)!; res = await backend.addProduct({ ...(old as unknown as Record<string, unknown>), ...r.patch, id: old.id, title: String(r.patch?.title ?? old.title) }); }
      if (res.ok) ok++; else { bad++; if (fails.length < 5) fails.push('row ' + r.n + ': ' + res.error); }
    }
    invalidate(); await backend.log('excel.import', file, `${ok} saved, ${bad} failed, by ${me.name}`);
    setMsg(`${ok} parts saved.` + (bad ? ` ${bad} failed (${fails.join('; ')}).` : '')); setBusy(false);
  };
  const template = async () => {
    const X = await ExcelJS(), wb = new X.Workbook(), ws = wb.addWorksheet('Products'), P = products();
    ws.columns = FIELDS.map(([k, l]) => ({ header: l, key: k, width: k === 'title' ? 34 : k === 'id' ? 22 : 16 }));
    rawProducts().forEach((r) => { const p = P.find((x) => x.id === r.id); ws.addRow({ ...r, model_id: p?.modelName || r.model_id, category: p?.catName || r.category, price_mode: r.price_mode || 'exact', visible: r.visible === false ? 'no' : 'yes' }); });
    ws.getRow(1).font = { bold: true, color: { argb: 'FF26282B' } }; ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7C032' } }; ws.views = [{ state: 'frozen', ySplit: 1 }];
    download('sam-electronics-products-template.xlsx', await wb.xlsx.writeBuffer() as ArrayBuffer);
  };
  const vis = rows.filter((r) => show === 'all' || r.kind === show);
  return (
    <Panel t="Import from Excel" d="Upload an Excel or CSV file. You see every change before anything is saved, and nothing is ever deleted." className="span3" right={<button type="button" className="cr-btn ghost sm" onClick={template}>Download the template</button>}>
      <div className="cr-form">
        <label className="xl-drop"><input type="file" accept=".xlsx,.csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) read(f); e.target.value = ''; }} /><b>{file || 'Choose an Excel (.xlsx) or CSV file'}</b><small>The first row with headings is used. Part number is the key.</small></label>
        {err ? <div className="cr-err">{err}</div> : null}
        {heads.length ? (
          <>
            <div className="xl-map">{FIELDS.map(([k, l]) => <label key={k}><span>{l}</span><select className="cr-in" value={map[k] ?? ''} onChange={(e) => setMap({ ...map, [k]: e.target.value === '' ? undefined : +e.target.value })}><option value="">— not in the file</option>{heads.map((h, i) => <option key={i} value={i}>{h || 'Column ' + (i + 1)}</option>)}</select></label>)}</div>
            <div className="cr-acts">
              {([['prices', 'Update prices', canP], ['stock', 'Update stock', canS], ['names', 'Update names & details', canC], ['add', 'Add new parts', canC]] as const).map(([k, l, ok]) => <label key={k} className="cr-chk" style={{ paddingTop: 0 }}><input type="checkbox" disabled={!ok} checked={allow[k]} onChange={(e) => setAllow({ ...allow, [k]: e.target.checked })} /> {l}</label>)}
            </div>
            <div className="cr-tabs">{(['all', 'new', 'changed', 'same', 'error'] as const).map((k) => <button key={k} type="button" className={show === k ? 'on' : ''} onClick={() => setShow(k)}>{k === 'all' ? 'All' : k === 'same' ? 'Unchanged' : k === 'error' ? 'Problems' : k[0].toUpperCase() + k.slice(1)}<small>{k === 'all' ? rows.length : count(k)}</small></button>)}</div>
            <div className="cr-tbl"><table><thead><tr><th>Row</th><th>Part number</th><th>Name</th><th>Result</th><th>What changes</th></tr></thead><tbody>
              {vis.slice(0, 300).map((r) => <tr key={r.n}><td className="mono">{r.n}</td><td className="mono">{r.vals.id || '—'}</td><td>{r.vals.title || cur.get(r.vals.id || '')?.title || ''}</td>
                <td><Badge t={r.kind === 'same' ? 'UNCHANGED' : r.kind.toUpperCase()} tone={r.kind === 'error' ? 'r' : r.kind === 'new' ? 'y' : r.kind === 'changed' ? 'g' : 'd'} /></td>
                <td className="xl-why">{r.kind === 'error' ? r.why : r.patch ? Object.entries(r.patch).filter(([k]) => r.kind === 'changed' || ['retail_price', 'stock_qty', 'price_mode'].includes(k)).map(([k, v]) => k + ': ' + (k.endsWith('price') ? money(+String(v)) : String(v))).join(' · ') : ''}</td></tr>)}
            </tbody></table>{vis.length > 300 ? <div className="cr-muted">Showing 300 of {vis.length}.</div> : null}</div>
            <div className="cr-acts"><button type="button" className="cr-btn y" disabled={busy || !(count('new') + count('changed'))} onClick={apply}>{busy ? 'Saving…' : `Save ${count('new')} new and ${count('changed')} changed parts`}</button>{msg ? <span className={/failed/.test(msg) ? 'cr-err' : 'cr-ok'}>{msg}</span> : null}</div>
          </>
        ) : null}
      </div>
    </Panel>
  );
}

// ── 4 · price list builder ───────────────────────────────────────────────────────────────────────────────────────────
type Col = 'id' | 'title' | 'model' | 'part' | 'grade' | 'maker' | 'warranty' | 'retail' | 'trade' | 'stock';
const COLS: [Col, string][] = [['id', 'Part number'], ['title', 'Name'], ['model', 'Model'], ['part', 'Part'], ['grade', 'Grade'], ['maker', 'Made by'], ['warranty', 'Warranty'], ['retail', 'Price (AED)'], ['trade', 'Trade price (AED)'], ['stock', 'Availability']];
function PriceList() {
  const D = data(), P = useMemo(() => products(), []);
  const [f, setF] = useState({ brands: [] as string[], cats: [] as string[], grades: [] as string[], inStock: false, ask: true });
  const [cols, setCols] = useState<Col[]>(['id', 'title', 'model', 'grade', 'warranty', 'retail', 'stock']), [split, setSplit] = useState<'none' | 'brand' | 'cat'>('brand');
  const [title, setTitle] = useState('Price list'), [note, setNote] = useState('Prices in AED, VAT not included. Subject to stock.'), [until, setUntil] = useState(new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)), [busy, setBusy] = useState(false);
  if (!D) return null;
  const tog = (k: 'brands' | 'cats' | 'grades', v: string) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });
  const list = P.filter((p) => (!f.brands.length || f.brands.includes(p.brand)) && (!f.cats.length || f.cats.includes(p.category)) && (!f.grades.length || f.grades.includes(p.grade)) && (!f.inStock || p.stock_qty > 0) && (f.ask || p.price > 0))
    .sort((a, b) => (a.brandName + a.modelName + a.catName + a.gradeName).localeCompare(b.brandName + b.modelName + b.catName + b.gradeName));
  const val = (p: (typeof P)[number], c: Col): string | number => ({ id: p.id, title: p.title, model: p.modelName, part: p.part_name, grade: p.gradeName, maker: p.makerName, warranty: p.warranty, retail: p.price > 0 && (!p.price_mode || p.price_mode === 'exact') ? p.price : 'Ask', trade: p.wholesale_price > 0 ? p.wholesale_price : 'Ask', stock: p.stock_qty > 0 ? (p.stock_qty < 4 ? 'Few left' : 'In stock') : 'On request' }[c]);
  const groups = (): [string, typeof list][] => split === 'none' ? [['All parts', list]] : Array.from(new Set(list.map((p) => (split === 'brand' ? p.brandName : p.catName)))).map((g) => [g, list.filter((p) => (split === 'brand' ? p.brandName : p.catName) === g)]);
  const excel = async () => {
    setBusy(true);
    const X = await ExcelJS(), wb = new X.Workbook(); wb.creator = 'Sam Electronics';
    let logo: number | null = null; try { const b = await (await fetch('/icon-192.png')).arrayBuffer(); logo = wb.addImage({ buffer: b, extension: 'png' }); } catch { /* no logo */ }
    for (const [g, ps] of groups()) {
      const ws = wb.addWorksheet(g.slice(0, 30).replace(/[\\/*?:[\]]/g, ' '), { views: [{ state: 'frozen', ySplit: 6 }], pageSetup: { orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
      ws.columns = cols.map((c) => ({ key: c, width: c === 'title' ? 36 : c === 'id' ? 22 : c === 'model' ? 22 : 15 }));
      if (logo != null) ws.addImage(logo, { tl: { col: 0, row: 0 }, ext: { width: 56, height: 56 } });
      ws.mergeCells(1, 2, 1, cols.length); ws.getCell(1, 2).value = 'SAM ELECTRONICS L.L.C · ' + title; ws.getCell(1, 2).font = { bold: true, size: 16, color: { argb: 'FF26282B' } };
      ws.mergeCells(2, 2, 2, cols.length); ws.getCell(2, 2).value = 'Al Murar, Deira, Dubai · +971 4 273 3031 · WhatsApp +971 50 342 0015 · samelectronics.uae@gmail.com'; ws.getCell(2, 2).font = { size: 10, color: { argb: 'FF5A5D62' } };
      ws.mergeCells(3, 2, 3, cols.length); ws.getCell(3, 2).value = `${g} · valid until ${until} · ${note}`; ws.getCell(3, 2).font = { size: 10, italic: true, color: { argb: 'FF8A6A10' } };
      ws.getRow(1).height = 26; ws.getRow(2).height = 16; ws.getRow(3).height = 16;
      const h = ws.getRow(6); cols.forEach((c, i) => { const cl = h.getCell(i + 1); cl.value = COLS.find((x) => x[0] === c)![1]; cl.font = { bold: true, color: { argb: 'FFF7C032' } }; cl.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF26282B' } }; cl.alignment = { vertical: 'middle' }; }); h.height = 22;
      ps.forEach((p, i) => { const r = ws.addRow(cols.map((c) => val(p, c))); if (i % 2) r.eachCell((c) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F5' } }; }); cols.forEach((c, j) => { if (c === 'retail' || c === 'trade') { const cl = r.getCell(j + 1); if (typeof cl.value === 'number') cl.numFmt = '#,##0.00'; cl.alignment = { horizontal: 'right' }; } }); });
      ws.autoFilter = { from: { row: 6, column: 1 }, to: { row: 6, column: cols.length } };
    }
    download(`sam-electronics-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${until}.xlsx`, await wb.xlsx.writeBuffer() as ArrayBuffer);
    await backend.log('pricelist.export', title, `${list.length} parts, ${cols.includes('trade') ? 'with trade prices' : 'retail'}`);
    setBusy(false);
  };
  const print = () => {
    const w = window.open('', '_blank'); if (!w) return;
    const esc = (s: unknown) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
    const body = groups().map(([g, ps]) => `<h2>${esc(g)}</h2><table><thead><tr>${cols.map((c) => `<th>${COLS.find((x) => x[0] === c)![1]}</th>`).join('')}</tr></thead><tbody>${ps.map((p) => `<tr>${cols.map((c) => { const v = val(p, c); return `<td class="${c === 'retail' || c === 'trade' ? 'n' : ''}">${typeof v === 'number' ? v.toLocaleString('en-US', { minimumFractionDigits: 2 }) : esc(v)}</td>`; }).join('')}</tr>`).join('')}</tbody></table>`).join('');
    w.document.write(`<!doctype html><html><head><meta charset=utf-8><title>${esc(title)}</title><style>body{font:12px/1.4 Inter,Arial,sans-serif;color:#26282B;margin:28px}header{display:flex;gap:14px;align-items:center;border-bottom:3px solid #F7C032;padding-bottom:12px}header img{width:52px;height:52px;border-radius:50%}h1{margin:0;font-size:20px}small{color:#5A5D62}h2{font-size:14px;margin:22px 0 6px}table{width:100%;border-collapse:collapse}th{background:#26282B;color:#F7C032;text-align:left;padding:6px 8px;font-size:11px}td{padding:5px 8px;border-bottom:1px solid #EEE}tr:nth-child(even) td{background:#F7F7F5}.n{text-align:right}.note{margin-top:6px;color:#8A6A10}@media print{h2{break-before:auto}thead{display:table-header-group}}</style></head><body><header><img src="/icon-192.png" alt=""><div><h1>Sam Electronics · ${esc(title)}</h1><small>Al Murar, Deira, Dubai · +971 4 273 3031 · WhatsApp +971 50 342 0015</small><div class="note">Valid until ${esc(until)} · ${esc(note)}</div></div></header>${body}<script>setTimeout(()=>print(),400)</script></body></html>`);
    w.document.close();
  };
  return (
    <Panel t="Price list builder" d="A branded price list for customers or trade partners. Cost is never included; parts without a fixed price say “Ask”." className="span3">
      <div className="cr-form">
        <div className="xl-f"><b>Brands</b><span>{D.brands.filter((b) => P.some((p) => p.brand === b.id)).map((b) => <button key={b.id} type="button" className={'cr-pay' + (f.brands.includes(b.id) ? ' on' : '')} onClick={() => tog('brands', b.id)}>{b.name}</button>)}</span></div>
        <div className="xl-f"><b>Part types</b><span>{D.categories.filter((c) => P.some((p) => p.category === c.id)).map((c) => <button key={c.id} type="button" className={'cr-pay' + (f.cats.includes(c.id) ? ' on' : '')} onClick={() => tog('cats', c.id)}>{c.name}</button>)}</span></div>
        <div className="xl-f"><b>Grades</b><span>{Object.entries(D.gradeNames).map(([g, n]) => <button key={g} type="button" className={'cr-pay' + (f.grades.includes(g) ? ' on' : '')} onClick={() => tog('grades', g)}>{n}</button>)}</span></div>
        <div className="xl-f"><b>Columns</b><span>{COLS.map(([c, l]) => <button key={c} type="button" className={'cr-pay' + (cols.includes(c) ? ' on' : '')} onClick={() => setCols(cols.includes(c) ? cols.filter((x) => x !== c) : COLS.map((x) => x[0]).filter((x) => x === c || cols.includes(x)))}>{l}</button>)}</span></div>
        <div className="cr-row3">
          <label>Title<input className="cr-in" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Valid until<input className="cr-in" type="date" value={until} onChange={(e) => setUntil(e.target.value)} /></label>
          <label>Tabs<select className="cr-in" value={split} onChange={(e) => setSplit(e.target.value as typeof split)}><option value="none">One sheet</option><option value="brand">A tab per brand</option><option value="cat">A tab per part type</option></select></label>
        </div>
        <label>Note on every page<input className="cr-in" value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <div className="cr-acts">
          <label className="cr-chk" style={{ paddingTop: 0 }}><input type="checkbox" checked={f.inStock} onChange={(e) => setF({ ...f, inStock: e.target.checked })} /> In stock only</label>
          <label className="cr-chk" style={{ paddingTop: 0 }}><input type="checkbox" checked={f.ask} onChange={(e) => setF({ ...f, ask: e.target.checked })} /> Include parts without a fixed price (“Ask”)</label>
        </div>
        {cols.includes('trade') ? <div className="cr-note">This list includes trade prices: share it with approved trade partners only.</div> : null}
        <div className="cr-acts"><span className="cr-muted">{list.length} parts{split !== 'none' ? ' · ' + groups().length + (groups().length === 1 ? ' tab' : ' tabs') : ''}</span><button type="button" className="cr-btn y" disabled={busy || !list.length || !cols.length} onClick={excel}>{busy ? 'Building…' : 'Download Excel'}</button><button type="button" className="cr-btn ghost" disabled={!list.length || !cols.length} onClick={print}>Print / PDF</button></div>
      </div>
    </Panel>
  );
}
