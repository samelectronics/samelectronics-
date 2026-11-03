'use client';
// R10 Stage 4 (part 2): Pricing (4.9), Customers & credit (4.10), Shipments (4.11), Brand Studio (4.12), Reminders &
// campaigns (4.17), Health & data quality (4.25), Training (4.26), the owner's daily summary (4.27) and the Daftra name
// parser (4.2.1). Everything writes through the backend (Supabase when live) and is logged in the Activity Center.
import React, { useEffect, useMemo, useState } from 'react';
import { backend, type Order, type Staff, type User, type Application } from '@/lib/backend';
import { data, rawProducts, type Raw, type PriceMode } from '@/lib/catalog';
import { Panel, Table, Badge, csv, can, money, when, useSetting, Kpi } from './kit';
import { HBars } from './charts';
import { qr } from './jobcard';

type P = { me: Staff; go: (m: string) => void };
const useCatalog = () => { const [k, setK] = useState(0); useEffect(() => { const on = () => setK((x) => x + 1); window.addEventListener('se:catalog', on); window.addEventListener('se:db', on); return () => { window.removeEventListener('se:catalog', on); window.removeEventListener('se:db', on); }; }, []); return useMemo(() => rawProducts(), [k]); }; // eslint-disable-line react-hooks/exhaustive-deps
const esc = (s: unknown) => String(s ?? '').replace(/[<&>]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c] as string));
const popup = (title: string, body: string, css = '') => { const w = window.open('', '_blank'); if (!w) return; w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(title)}</title><style>body{font:13px Arial,sans-serif;color:#26282B;margin:16mm}h1{font:700 22px Arial;margin:0 0 4mm}table{width:100%;border-collapse:collapse}th,td{padding:6px 8px;border-bottom:1px solid #ECEDEF;text-align:left}th{font:700 10px monospace;letter-spacing:.08em;text-transform:uppercase;background:#F4F5F6}.r{text-align:right}${css}</style>${body}<script>setTimeout(()=>print(),300)<\/script>`); w.document.close(); };
const brandOf = () => { const D = data(); const M = new Map((D?.models || []).map((m) => [m.id, m.brand_id])); return (p: Raw) => M.get(p.model_id) || ''; };

// ── 4.9 Pricing ───────────────────────────────────────────────────────────────────────────────────────────────
type Hist = { id: string; title: string; f: string; old: number; now: number; at: number; by: string };
type Coupon = { code: string; kind: 'pct' | 'aed'; value: number; min?: number; until?: number; trade?: boolean; active?: boolean; note?: string };
const round = (v: number, r: string) => r === '0' ? Math.round(v) : r === '9' ? Math.max(0, Math.ceil(v) - 0.01) : r === '5' ? Math.round(v * 2) / 2 : Math.round(v * 100) / 100;
export function Pricing({ me }: P) {
  const list = useCatalog(), D = data(), bOf = useMemo(brandOf, [D]);
  const [brand, setBrand] = useState(''), [cat, setCat] = useState(''), [grade, setGrade] = useState(''), [field, setField] = useState<'retail_price' | 'wholesale_price'>('retail_price');
  const [how, setHow] = useState<'pct' | 'aed' | 'margin'>('pct'), [val, setVal] = useState(5), [rnd, setRnd] = useState('0'), [busy, setBusy] = useState(''), [mode, setMode] = useState<PriceMode | ''>('');
  const [hist, setHist] = useSetting<Hist[]>('price-history', []), [cps, setCps] = useSetting<Coupon[]>('coupons', []), [c, setC] = useState<Coupon>({ code: '', kind: 'pct', value: 10, active: true });
  const rows = list.filter((p) => (!brand || bOf(p) === brand) && (!cat || p.category === cat) && (!grade || p.grade === grade));
  const calc = (p: Raw) => { const o = p[field] || 0; const n = how === 'pct' ? o * (1 + val / 100) : how === 'aed' ? o + val : (p.wholesale_price || 0) * (1 + val / 100); return Math.max(0, round(n, rnd)); };
  const changes = rows.map((p) => ({ p, o: p[field] || 0, n: calc(p) })).filter((x) => x.n !== x.o), preview = changes.slice(0, 200);
  const apply = async () => {
    if (!changes.length || !confirm(`Change the ${field === 'retail_price' ? 'retail' : 'trade'} price of ${changes.length} products?`)) return;
    setBusy('Saving…'); const h: Hist[] = []; let ok = 0;
    for (const x of changes) { const r = await backend.saveProduct(x.p.id, { [field]: x.n }); if (r.ok) { ok++; h.push({ id: x.p.id, title: x.p.title, f: field, old: x.o, now: x.n, at: Date.now(), by: me.name }); } }
    await setHist([...h, ...hist].slice(0, 3000), 'Bulk price change: ' + ok + ' products');
    await backend.log('price.bulk', ok + ' products', `${field} ${how} ${val} round ${rnd}`); setBusy(ok + ' prices updated.');
  };
  const applyMode = async () => { if (!mode || !rows.length || !confirm(`Show ${rows.length} products as "${mode}"?`)) return; setBusy('Saving…'); let ok = 0; for (const p of rows) { const r = await backend.saveProduct(p.id, { price_mode: mode }); if (r.ok) ok++; } await backend.log('price.mode', ok + ' products', mode); setBusy(ok + ' products updated.'); };
  const canEdit = can(me, 'prices');
  return (
    <div className="cr-grid">
      <Panel t="Bulk price change" d="Pick the products, choose the change, check the preview, then apply. Every change is kept in the price history." className="span2">
        <div className="cr-row" style={{ marginTop: 0 }}>
          <select className="cr-in" value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">All brands</option>{D?.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <select className="cr-in" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All parts</option>{D?.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className="cr-in" value={grade} onChange={(e) => setGrade(e.target.value)}><option value="">All grades</option>{Object.entries(D?.gradeNames || {}).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </div>
        <div className="cr-row">
          <span className="cr-seg"><button type="button" className={field === 'retail_price' ? 'on' : ''} onClick={() => setField('retail_price')}>Retail</button><button type="button" className={field === 'wholesale_price' ? 'on' : ''} onClick={() => setField('wholesale_price')}>Trade</button></span>
          <span className="cr-seg"><button type="button" className={how === 'pct' ? 'on' : ''} onClick={() => setHow('pct')}>± %</button><button type="button" className={how === 'aed' ? 'on' : ''} onClick={() => setHow('aed')}>± AED</button><button type="button" className={how === 'margin' ? 'on' : ''} onClick={() => setHow('margin')}>Margin on trade %</button></span>
          <input className="cr-in" type="number" style={{ maxWidth: 110 }} value={val} onChange={(e) => setVal(+e.target.value)} />
          <select className="cr-in" style={{ maxWidth: 170 }} value={rnd} onChange={(e) => setRnd(e.target.value)}><option value="0">Round to whole AED</option><option value="9">End in .99</option><option value="5">Nearest .50</option><option value="x">Exact</option></select>
        </div>
        <Table rows={preview} empty={rows.length ? 'No price changes with these settings.' : 'No products match.'} pageSize={12} cols={[{ k: 't', l: 'Product (' + rows.length + ')', get: (x) => x.p.title }, { k: 'o', l: 'Now', get: (x) => money(x.o), cls: 'num' }, { k: 'n', l: 'New', get: (x) => <b>{money(x.n)}</b>, cls: 'num' }, { k: 'd', l: 'Change', get: (x) => <Badge t={(x.n >= x.o ? '+' : '') + (x.o ? Math.round(((x.n - x.o) / x.o) * 100) : 0) + '%'} tone={x.n >= x.o ? 'g' : 'r'} />, cls: 'num' }]} />
        {changes.length > 200 ? <small className="cr-muted">The preview shows the first 200 of {changes.length} changes; all of them are applied.</small> : null}
        <div className="cr-row"><button type="button" className="cr-btn" disabled={!canEdit || !changes.length || busy === 'Saving…'} onClick={apply}>Apply to {changes.length} products</button>{busy ? <small className="cr-muted">{busy}</small> : null}</div>
      </Panel>
      <Panel t="How prices show" d="For the products in the filter: exact price, a range, 'from', 'ask on WhatsApp', 'call' or trade accounts only.">
        <select className="cr-in" value={mode} onChange={(e) => setMode(e.target.value as PriceMode)}><option value="">Choose…</option>{(['exact', 'range', 'from', 'whatsapp', 'call', 'trade'] as PriceMode[]).map((m) => <option key={m}>{m}</option>)}</select>
        <button type="button" className="cr-btn" style={{ marginTop: 10, width: '100%' }} disabled={!canEdit || !mode} onClick={applyMode}>Apply to {rows.length} products</button>
      </Panel>
      <Panel t="Coupons" d="Codes customers type in the cart. The team still confirms every order." className="span2">
        <div className="cr-row" style={{ marginTop: 0 }}>
          <input className="cr-in mono" placeholder="CODE" style={{ maxWidth: 140 }} value={c.code} onChange={(e) => setC({ ...c, code: e.target.value.toUpperCase().replace(/\s/g, '') })} />
          <span className="cr-seg"><button type="button" className={c.kind === 'pct' ? 'on' : ''} onClick={() => setC({ ...c, kind: 'pct' })}>%</button><button type="button" className={c.kind === 'aed' ? 'on' : ''} onClick={() => setC({ ...c, kind: 'aed' })}>AED</button></span>
          <input className="cr-in" type="number" style={{ maxWidth: 90 }} value={c.value} onChange={(e) => setC({ ...c, value: +e.target.value })} />
          <input className="cr-in" type="number" placeholder="Min. order" style={{ maxWidth: 120 }} value={c.min || ''} onChange={(e) => setC({ ...c, min: +e.target.value || undefined })} />
          <input className="cr-in" type="date" style={{ maxWidth: 160 }} onChange={(e) => setC({ ...c, until: e.target.value ? new Date(e.target.value + 'T23:59:59').getTime() : undefined })} />
          <label className="cr-chk"><input type="checkbox" checked={!!c.trade} onChange={(e) => setC({ ...c, trade: e.target.checked })} /> Trade only</label>
          <button type="button" className="cr-btn" disabled={!canEdit || !c.code || c.value <= 0 || (c.kind === 'pct' && c.value > 50 && me.role !== 'owner')} onClick={() => { setCps([c, ...cps.filter((x) => x.code !== c.code)], 'Coupon ' + c.code); setC({ code: '', kind: 'pct', value: 10, active: true }); }}>Save</button>
        </div>
        {c.kind === 'pct' && c.value > 50 && me.role !== 'owner' ? <small className="cr-muted">Discounts above 50% need the owner.</small> : null}
        <Table rows={cps} empty="No coupons yet." cols={[{ k: 'c', l: 'Code', get: (x) => <b className="mono">{x.code}</b> }, { k: 'v', l: 'Discount', get: (x) => (x.kind === 'pct' ? x.value + '%' : money(x.value)) }, { k: 'm', l: 'Min.', get: (x) => (x.min ? money(x.min) : '·') }, { k: 'u', l: 'Until', get: (x) => (x.until ? new Date(x.until).toLocaleDateString() : 'No end') }, { k: 's', l: '', get: (x) => <span className="cr-row" style={{ margin: 0 }}><button type="button" className="cr-btn ghost sm" onClick={() => setCps(cps.map((y) => (y.code === x.code ? { ...y, active: y.active === false } : y)), 'Coupon ' + x.code + (x.active === false ? ' on' : ' off'))}>{x.active === false ? 'Turn on' : 'Turn off'}</button><button type="button" className="cr-btn ghost sm" onClick={() => setCps(cps.filter((y) => y.code !== x.code), 'Coupon removed ' + x.code)}>Delete</button></span> }]} />
      </Panel>
      <Panel t="Price history" d="Latest changes first" right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('price-history', [['When', 'Product', 'Field', 'Old', 'New', 'By'], ...hist.map((h) => [new Date(h.at).toISOString(), h.title, h.f, h.old, h.now, h.by])])}>CSV</button>}>
        <div className="cr-feed">{hist.slice(0, 12).map((h, i) => <div key={i} className="cr-fi" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}><span>{h.title}<small> · {money(h.old)} → <b>{money(h.now)}</b></small></span><small className="mono">{when(h.at)}</small></div>)}{!hist.length ? <small className="cr-muted">Bulk changes appear here.</small> : null}</div>
      </Panel>
    </div>
  );
}

// ── 4.10 Customers & credit: tags, notes, credit limits and printable statements ────────────────────────────────
type Cx = { tags?: string[]; note?: string; limit?: number; terms?: number };
export function Credit({ me }: P) {
  const [users, setUsers] = useState<User[]>([]), [orders, setOrders] = useState<Order[]>([]), [meta, setMeta] = useSetting<Record<string, Cx>>('customer-meta', {}), [sel, setSel] = useState<string | null>(null), [tag, setTag] = useState('');
  useEffect(() => { backend.customers().then(setUsers); backend.allOrders().then(setOrders); }, []);
  const byMail = useMemo(() => { const m = new Map<string, Order[]>(); orders.forEach((o) => { const k = o.email.toLowerCase(); m.set(k, [...(m.get(k) || []), o]); }); return m; }, [orders]);
  const open = (o: Order) => !['Collected / Shipped', 'Closed', 'Cancelled'].includes(o.status);
  const rows = users.map((u) => { const os = byMail.get(u.email.toLowerCase()) || [], due = os.filter(open).reduce((s, o) => s + o.total, 0), m = meta[u.id] || {}; return { u, os, due, m, spent: os.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0) }; }).filter((r) => !tag || (r.m.tags || []).includes(tag));
  const allTags = [...new Set(Object.values(meta).flatMap((m) => m.tags || []))];
  const cur = rows.find((r) => r.u.id === sel), save = (id: string, m: Cx) => setMeta({ ...meta, [id]: m }, 'Customer ' + (users.find((u) => u.id === id)?.email || id));
  const statement = (r: typeof rows[number]) => popup('Statement ' + r.u.name, `<h1>Statement of account</h1><p><b>${esc(r.u.name)}</b> · ${esc(r.u.email)}<br>${new Date().toLocaleDateString()} · Sam Electronics L.L.C, Al Murar, Deira, Dubai</p><table><tr><th>Date</th><th>Order</th><th>Status</th><th class="r">Amount</th></tr>${r.os.map((o) => `<tr><td>${new Date(o.createdAt).toLocaleDateString()}</td><td>${esc(o.no)}</td><td>${esc(o.status)}</td><td class="r">${o.total.toFixed(2)}</td></tr>`).join('')}<tr><th colspan="3">Open balance (website orders not yet completed)</th><th class="r">AED ${r.due.toFixed(2)}</th></tr></table>${r.m.limit ? `<p>Credit limit: AED ${r.m.limit.toFixed(2)} · Terms: ${r.m.terms || 30} days</p>` : ''}<p style="color:#888;font-size:11px">Balances from Daftra invoices are in Daftra; this statement lists website orders.</p>`);
  void me;
  return (
    <div className="cr-grid">
      <Panel t="Customers, tags and credit" d="Tag customers, set trade credit limits, print a statement." className="span2" right={<span className="cr-row" style={{ margin: 0 }}><select className="cr-in" value={tag} onChange={(e) => setTag(e.target.value)}><option value="">All tags</option>{allTags.map((t) => <option key={t}>{t}</option>)}</select><button type="button" className="cr-btn ghost sm" onClick={() => csv('customers-credit', [['Name', 'E-mail', 'Tags', 'Limit', 'Open', 'Spent'], ...rows.map((r) => [r.u.name, r.u.email, (r.m.tags || []).join(' '), r.m.limit || '', r.due, r.spent])])}>CSV</button></span>}>
        <Table rows={rows} onRow={(r) => setSel(r.u.id)} search={(r) => r.u.name + ' ' + r.u.email + ' ' + (r.m.tags || []).join(' ')} empty="No customer accounts yet." cols={[{ k: 'n', l: 'Customer', get: (r) => <span><b>{r.u.name}</b><br /><small className="cr-muted">{r.u.email}</small></span> }, { k: 't', l: 'Tags', get: (r) => <span className="cr-row" style={{ margin: 0, gap: 4 }}>{(r.m.tags || []).map((t) => <Badge key={t} t={t} />)}{r.u.tradeApproved ? <Badge t="TRADE" tone="y" /> : null}</span> }, { k: 's', l: 'Spent', get: (r) => money(r.spent), cls: 'num', sort: (r) => -r.spent }, { k: 'd', l: 'Open', get: (r) => <b style={{ color: r.m.limit && r.due > r.m.limit ? '#D14B4B' : undefined }}>{money(r.due)}</b>, cls: 'num', sort: (r) => -r.due }, { k: 'l', l: 'Limit', get: (r) => (r.m.limit ? money(r.m.limit) : '·'), cls: 'num' }]} />
      </Panel>
      <Panel t={cur ? cur.u.name : 'Customer'} d={cur ? cur.u.email : 'Pick a customer in the list.'}>
        {cur ? <div className="cr-form">
          <label>Tags (comma separated)<input className="cr-in" defaultValue={(cur.m.tags || []).join(', ')} key={cur.u.id + 't'} onBlur={(e) => save(cur.u.id, { ...cur.m, tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} /></label>
          <div className="cr-row2"><label>Credit limit (AED)<input className="cr-in" type="number" defaultValue={cur.m.limit || ''} key={cur.u.id + 'l'} onBlur={(e) => save(cur.u.id, { ...cur.m, limit: +e.target.value || undefined })} disabled={!can(me, 'accounting')} /></label><label>Terms (days)<input className="cr-in" type="number" defaultValue={cur.m.terms || 30} key={cur.u.id + 'd'} onBlur={(e) => save(cur.u.id, { ...cur.m, terms: +e.target.value || 30 })} disabled={!can(me, 'accounting')} /></label></div>
          <label>Notes<textarea className="cr-in" rows={3} defaultValue={cur.m.note || ''} key={cur.u.id + 'n'} onBlur={(e) => save(cur.u.id, { ...cur.m, note: e.target.value })} /></label>
          <div className="cr-kv"><span>Points</span><b>{cur.u.points}</b><span>Orders</span><b>{cur.os.length}</b><span>Open</span><b>{money(cur.due)}</b></div>
          <div className="cr-acts"><button type="button" className="cr-btn sm" onClick={() => statement(cur)}>Print statement</button>{cur.u.phone ? <a className="cr-btn wa sm" href={'https://wa.me/' + cur.u.phone.replace(/\D/g, '')} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}</div>
        </div> : <small className="cr-muted">Tags, limits and notes are kept per customer.</small>}
      </Panel>
    </div>
  );
}

// ── 4.11 Shipments: carriers, tracking, packing list and commercial invoice ─────────────────────────────────────
type Ship = { id: string; order?: string; to: string; country: string; carrier: string; track?: string; status: 'Packed' | 'Dispatched' | 'In transit' | 'Customs' | 'Delivered'; boxes: number; kg: number; battery?: boolean; at: number; by: string };
const CARRIERS: [string, string][] = [['DHL', 'https://www.dhl.com/ae-en/home/tracking.html?tracking-id='], ['FedEx', 'https://www.fedex.com/fedextrack/?trknbr='], ['UPS', 'https://www.ups.com/track?tracknum='], ['Aramex', 'https://www.aramex.com/ae/en/track/results?ShipmentNumber='], ['Emirates SkyCargo', ''], ['Sky Dragon', ''], ['Own driver', ''], ['Customer’s shipper', '']];
export function Shipments({ me }: P) {
  const [rows, setRows] = useSetting<Ship[]>('shipments', []), [orders, setOrders] = useState<Order[]>([]), [ed, setEd] = useState<Ship | null>(null);
  useEffect(() => { backend.allOrders().then(setOrders); }, []);
  const ST: Ship['status'][] = ['Packed', 'Dispatched', 'In transit', 'Customs', 'Delivered'];
  const blank = (): Ship => ({ id: 's' + Date.now(), to: '', country: 'United Arab Emirates', carrier: 'DHL', status: 'Packed', boxes: 1, kg: 1, at: Date.now(), by: me.name });
  const link = (s: Ship) => { const c = CARRIERS.find((x) => x[0] === s.carrier); return c && c[1] && s.track ? c[1] + encodeURIComponent(s.track) : ''; };
  const docs = (s: Ship, kind: 'pack' | 'ci') => { const o = orders.find((x) => x.no === s.order); const lines = o ? o.lines : [];
    popup((kind === 'pack' ? 'Packing list ' : 'Commercial invoice ') + (s.order || s.id), `<h1>${kind === 'pack' ? 'Packing list' : 'Commercial invoice'}</h1><p><b>From</b> Sam Electronics L.L.C, Al Murar, Deira, Dubai, UAE · +971 4 273 3031<br><b>To</b> ${esc(s.to)}, ${esc(s.country)}<br><b>Order</b> ${esc(s.order || '·')} · <b>Carrier</b> ${esc(s.carrier)} ${esc(s.track || '')} · ${s.boxes} box(es) · ${s.kg} kg</p><table><tr><th>Item</th><th>Grade</th><th class="r">Qty</th>${kind === 'ci' ? '<th class="r">Unit (AED)</th><th class="r">Total</th>' : ''}</tr>${lines.map((l) => `<tr><td>${esc(l.title)}</td><td>${esc(l.grade)}</td><td class="r">${l.qty}</td>${kind === 'ci' ? `<td class="r">${l.unit.toFixed(2)}</td><td class="r">${(l.unit * l.qty).toFixed(2)}</td>` : ''}</tr>`).join('') || '<tr><td colspan="5">Add the order number to list the items.</td></tr>'}</table>${kind === 'ci' ? `<p>Country of origin: as marked on each part · Reason for export: sale · Currency: AED${o ? ' · Total AED ' + o.total.toFixed(2) : ''}</p>` : ''}${s.battery ? '<p><b>Contains lithium-ion batteries (UN3480 / UN3481): ship under dangerous-goods rules.</b></p>' : ''}<p style="margin-top:20mm">Signature ____________________ Date ${new Date().toLocaleDateString()}</p>`); };
  return (
    <div className="cr-grid">
      <div className="cr-kpis span3">{ST.map((s) => <Kpi key={s} l={s} v={rows.filter((r) => r.status === s).length} tone={s === 'Customs' ? 'r' : s === 'Delivered' ? 'g' : undefined} />)}</div>
      <Panel t="Shipments" d="Every parcel with its carrier and tracking. Customers get the tracking link on WhatsApp." className="span3" right={<button type="button" className="cr-btn sm" onClick={() => setEd(blank())}>+ New shipment</button>}>
        <Table rows={rows} onRow={(r) => setEd(r)} empty="No shipments yet." search={(r) => r.to + ' ' + r.order + ' ' + r.track + ' ' + r.country} cols={[{ k: 'o', l: 'Order', get: (r) => <b className="mono">{r.order || '·'}</b> }, { k: 't', l: 'To', get: (r) => r.to + ', ' + r.country }, { k: 'c', l: 'Carrier', get: (r) => <span>{r.carrier}{r.track ? <small className="cr-muted mono"> {r.track}</small> : null}</span> }, { k: 's', l: 'Status', get: (r) => <Badge t={r.status} tone={r.status === 'Delivered' ? 'g' : r.status === 'Customs' ? 'r' : 'y'} /> }, { k: 'b', l: 'Load', get: (r) => r.boxes + ' × · ' + r.kg + ' kg' + (r.battery ? ' · 🔋' : '') }, { k: 'd', l: 'Date', get: (r) => when(r.at), sort: (r) => -r.at }]} />
      </Panel>
      {ed ? <div className="cr-modal" onClick={() => setEd(null)}><div className="cr-panel cr-modal-in" onClick={(e) => e.stopPropagation()}><header><h3>Shipment</h3></header>
        <div className="cr-form2">
          <label className="cr-f">Order no.<input className="cr-in mono" list="cr-orders" value={ed.order || ''} onChange={(e) => { const o = orders.find((x) => x.no === e.target.value); setEd({ ...ed, order: e.target.value, ...(o ? { to: o.name + (o.address ? ', ' + o.address : ''), country: o.country || ed.country } : {}) }); }} /><datalist id="cr-orders">{orders.slice(0, 200).map((o) => <option key={o.id} value={o.no}>{o.name}</option>)}</datalist></label>
          <label className="cr-f">Country<input className="cr-in" value={ed.country} onChange={(e) => setEd({ ...ed, country: e.target.value })} /></label>
          <label className="cr-f" style={{ gridColumn: '1 / -1' }}>Deliver to<input className="cr-in" value={ed.to} onChange={(e) => setEd({ ...ed, to: e.target.value })} /></label>
          <label className="cr-f">Carrier<select className="cr-in" value={ed.carrier} onChange={(e) => setEd({ ...ed, carrier: e.target.value })}>{CARRIERS.map(([c]) => <option key={c}>{c}</option>)}</select></label>
          <label className="cr-f">Tracking no.<input className="cr-in mono" value={ed.track || ''} onChange={(e) => setEd({ ...ed, track: e.target.value.trim() })} /></label>
          <label className="cr-f">Boxes<input className="cr-in" type="number" min={1} value={ed.boxes} onChange={(e) => setEd({ ...ed, boxes: Math.max(1, +e.target.value) })} /></label>
          <label className="cr-f">Weight (kg)<input className="cr-in" type="number" step="0.1" value={ed.kg} onChange={(e) => setEd({ ...ed, kg: +e.target.value })} /></label>
          <label className="cr-f">Status<select className="cr-in" value={ed.status} onChange={(e) => setEd({ ...ed, status: e.target.value as Ship['status'] })}>{ST.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="cr-chk" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!ed.battery} onChange={(e) => setEd({ ...ed, battery: e.target.checked })} /> Contains batteries</label>
        </div>
        <div className="cr-row" style={{ padding: '0 18px 18px' }}><button type="button" className="cr-btn" onClick={() => { setRows(rows.some((r) => r.id === ed.id) ? rows.map((r) => (r.id === ed.id ? ed : r)) : [ed, ...rows], 'Shipment ' + (ed.order || ed.to) + ' · ' + ed.status); setEd(null); }}>Save</button>
          <button type="button" className="cr-btn ghost" onClick={() => docs(ed, 'pack')}>Packing list</button><button type="button" className="cr-btn ghost" onClick={() => docs(ed, 'ci')}>Commercial invoice</button>
          {link(ed) ? <a className="cr-btn ghost" href={link(ed)} target="_blank" rel="noopener noreferrer">Track ↗</a> : null}
          {(() => { const o = orders.find((x) => x.no === ed.order); return o?.phone ? <a className="cr-btn wa" href={'https://wa.me/' + o.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent(`Hi ${o.name.split(' ')[0]}, your order ${o.no} is ${ed.status.toLowerCase()} with ${ed.carrier}${ed.track ? ' (tracking ' + ed.track + (link(ed) ? ': ' + link(ed) : '') + ')' : ''}. Sam Electronics`)} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a> : null; })()}</div>
      </div></div> : null}
    </div>
  );
}

// ── 4.12 Brand Studio: the brand kit + document templates with live preview, filled from a real order ───────────
type Kit = { slogan: string; y: string; g: string; stamp?: string; sign?: string; footer: string };
type Doc = { id: string; name: string; title: string; titleAr: string; intro: string; foot: string; prices: boolean; qr: boolean; lang: 'en' | 'ar' | 'both' };
const DOCS: Doc[] = [
  { id: 'quote', name: 'Quotation', title: 'QUOTATION', titleAr: 'عرض سعر', intro: 'Thank you for your request. Prices are valid for 7 days.', foot: 'Prices exclude delivery unless shown.', prices: true, qr: true, lang: 'both' },
  { id: 'proforma', name: 'Proforma invoice', title: 'PROFORMA INVOICE', titleAr: 'فاتورة مبدئية', intro: 'Please transfer the total to confirm your order.', foot: 'Goods are reserved for 3 days after this proforma.', prices: true, qr: true, lang: 'both' },
  { id: 'delivery', name: 'Delivery note', title: 'DELIVERY NOTE', titleAr: 'إشعار تسليم', intro: 'Received the goods below in good condition.', foot: 'Receiver signature: ____________________', prices: false, qr: true, lang: 'both' },
  { id: 'receipt', name: 'Receipt', title: 'RECEIPT', titleAr: 'إيصال', intro: 'Payment received with thanks.', foot: 'Keep this receipt for warranty claims.', prices: true, qr: false, lang: 'both' },
  { id: 'warranty', name: 'Warranty card', title: 'WARRANTY CARD', titleAr: 'بطاقة ضمان', intro: 'Each part is covered by the warranty of its grade, shown on its label.', foot: 'Bring this card and the part. Physical and water damage are not covered.', prices: false, qr: true, lang: 'both' },
  { id: 'letter', name: 'Letter', title: '', titleAr: '', intro: 'Dear customer,', foot: 'Kind regards,\nSam Electronics', prices: false, qr: false, lang: 'en' },
];
export function BrandStudio({ me }: P) {
  const [kit, setKit] = useSetting<Kit>('brand-kit', { slogan: 'QUALITY · WARRANTY · PRICE', y: '#F7C032', g: '#26282B', footer: 'Sam Electronics L.L.C · Al Murar, Deira, Dubai · +971 4 273 3031 · samelectronics.uae@gmail.com' });
  const [docs, setDocs] = useSetting<Doc[]>('doc-templates', DOCS), [sel, setSel] = useState('quote'), [orders, setOrders] = useState<Order[]>([]), [ono, setOno] = useState('');
  useEffect(() => { backend.allOrders().then(setOrders); }, []);
  const d = docs.find((x) => x.id === sel) || docs[0], o = orders.find((x) => x.no === ono);
  const upd = (p: Partial<Doc>) => setDocs(docs.map((x) => (x.id === d.id ? { ...x, ...p } : x)), 'Template ' + d.name);
  const img = (k: 'stamp' | 'sign') => (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setKit({ ...kit, [k]: String(r.result) }, 'Brand kit ' + k); r.readAsDataURL(f); };
  const html = useMemo(() => {
    const L = o ? o.lines : [{ title: 'iPhone 15 Pro Screen', grade: 'Original', qty: 2, unit: 450 }, { title: 'Galaxy A54 Battery', grade: 'Service Pack', qty: 5, unit: 85 }];
    const sub = L.reduce((s, l) => s + l.unit * l.qty, 0), vat = Math.round(sub * 5) / 100;
    return `<div class="dc" style="--y:${kit.y};--g:${kit.g}"><div class="dc-h"><img src="/assets/se-logo-128.webp" alt=""><div><b>SAM ELECTRONICS</b><small>${esc(kit.slogan)}</small></div><div class="dc-t">${d.lang !== 'ar' ? `<b>${esc(d.title)}</b>` : ''}${d.lang !== 'en' && d.titleAr ? `<b dir="rtl">${esc(d.titleAr)}</b>` : ''}<small>${o ? esc(o.no) : 'SAMPLE'} · ${new Date().toLocaleDateString()}</small></div></div>
      <p class="dc-to"><b>${esc(o ? o.name : 'Customer name')}</b><br>${esc(o ? o.phone + (o.address ? ' · ' + o.address : '') : 'Phone · address')}</p><p>${esc(d.intro)}</p>
      ${d.id === 'letter' ? '<p style="min-height:60mm">…</p>' : `<table><tr><th>Item</th><th>Grade</th><th class="r">Qty</th>${d.prices ? '<th class="r">Unit</th><th class="r">Total</th>' : ''}</tr>${L.map((l) => `<tr><td>${esc(l.title)}</td><td>${esc(l.grade)}</td><td class="r">${l.qty}</td>${d.prices ? `<td class="r">${l.unit.toFixed(2)}</td><td class="r">${(l.unit * l.qty).toFixed(2)}</td>` : ''}</tr>`).join('')}${d.prices ? `<tr><td colspan="4" class="r">Subtotal</td><td class="r">${sub.toFixed(2)}</td></tr><tr><td colspan="4" class="r">VAT 5%</td><td class="r">${vat.toFixed(2)}</td></tr><tr class="tot"><td colspan="4" class="r">Total AED</td><td class="r">${(sub + vat).toFixed(2)}</td></tr>` : ''}</table>`}
      <div class="dc-f"><p>${esc(d.foot).replace(/\n/g, '<br>')}</p><span>${kit.stamp ? `<img class="dc-st" src="${kit.stamp}" alt="">` : ''}${kit.sign ? `<img class="dc-sg" src="${kit.sign}" alt="">` : ''}${d.qr ? qr(location.origin + (o ? '/account#orders' : '/'), 2) : ''}</span></div><div class="dc-b">${esc(kit.footer)}</div></div>`;
  }, [d, o, kit]);
  const css = '.dc{font:12px Arial,sans-serif;color:#26282B;background:#fff;padding:10mm;max-width:190mm}.dc-h{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;border-bottom:3px solid var(--y);padding-bottom:4mm}.dc-h img{width:44px;height:44px;border-radius:50%}.dc-h b{display:block;letter-spacing:.14em}.dc-h small{color:#888;font-size:9px;letter-spacing:.14em}.dc-t{text-align:right;display:grid}.dc-t b{font-size:16px;letter-spacing:.1em;color:var(--g)}.dc-to{margin:6mm 0 3mm}table{width:100%;border-collapse:collapse;margin:4mm 0}th,td{padding:5px 6px;border-bottom:1px solid #ECEDEF;text-align:left}th{background:#F4F5F6;font-size:9px;letter-spacing:.08em;text-transform:uppercase}.r{text-align:right}.tot td{font-weight:700;border-top:2px solid var(--g)}.dc-f{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin-top:6mm}.dc-f span{display:flex;gap:8px;align-items:flex-end}.dc-f svg{width:22mm;height:22mm}.dc-st{height:24mm;opacity:.85}.dc-sg{height:14mm}.dc-b{margin-top:8mm;padding-top:3mm;border-top:1px solid #ECEDEF;color:#888;font-size:9px;text-align:center}';
  void me;
  return (
    <div className="cr-grid">
      <Panel t="Brand kit" d="Used on every document, label and e-mail.">
        <div className="cr-form">
          <label>Slogan<input className="cr-in" value={kit.slogan} onChange={(e) => setKit({ ...kit, slogan: e.target.value })} /></label>
          <div className="cr-row2"><label>Accent<input className="cr-in" type="color" value={kit.y} onChange={(e) => setKit({ ...kit, y: e.target.value })} /></label><label>Text<input className="cr-in" type="color" value={kit.g} onChange={(e) => setKit({ ...kit, g: e.target.value })} /></label></div>
          <label>Footer line<textarea className="cr-in" rows={2} value={kit.footer} onChange={(e) => setKit({ ...kit, footer: e.target.value })} /></label>
          <div className="cr-row2"><label>Stamp (PNG)<input type="file" accept="image/*" onChange={img('stamp')} /></label><label>Signature (PNG)<input type="file" accept="image/*" onChange={img('sign')} /></label></div>
        </div>
      </Panel>
      <Panel t="Template" d="Pick a document, type over the texts, fill it from an order." className="span2">
        <div className="cr-row" style={{ marginTop: 0 }}><span className="cr-seg" style={{ flexWrap: 'wrap' }}>{docs.map((x) => <button key={x.id} type="button" className={x.id === sel ? 'on' : ''} onClick={() => setSel(x.id)}>{x.name}</button>)}</span></div>
        <div className="cr-form2" style={{ padding: '12px 0' }}>
          <label className="cr-f">Title<input className="cr-in" value={d.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className="cr-f">Arabic title<input className="cr-in" dir="rtl" value={d.titleAr} onChange={(e) => upd({ titleAr: e.target.value })} /></label>
          <label className="cr-f" style={{ gridColumn: '1 / -1' }}>Opening text<input className="cr-in" value={d.intro} onChange={(e) => upd({ intro: e.target.value })} /></label>
          <label className="cr-f" style={{ gridColumn: '1 / -1' }}>Closing text<textarea className="cr-in" rows={2} value={d.foot} onChange={(e) => upd({ foot: e.target.value })} /></label>
          <label className="cr-f">Fill from order<input className="cr-in mono" list="bs-orders" value={ono} onChange={(e) => setOno(e.target.value)} placeholder="Sample data" /><datalist id="bs-orders">{orders.slice(0, 200).map((x) => <option key={x.id} value={x.no}>{x.name}</option>)}</datalist></label>
          <span className="cr-row" style={{ alignSelf: 'end', margin: 0 }}><label className="cr-chk"><input type="checkbox" checked={d.prices} onChange={(e) => upd({ prices: e.target.checked })} /> Prices</label><label className="cr-chk"><input type="checkbox" checked={d.qr} onChange={(e) => upd({ qr: e.target.checked })} /> QR</label><select className="cr-in" style={{ width: 120 }} value={d.lang} onChange={(e) => upd({ lang: e.target.value as Doc['lang'] })}><option value="both">EN + AR</option><option value="en">English</option><option value="ar">Arabic</option></select></span>
        </div>
        <div className="bs-prev"><style>{css}</style><div dangerouslySetInnerHTML={{ __html: html }} /></div>
        <div className="cr-row"><button type="button" className="cr-btn" onClick={() => popup(d.name, html, css)}>Print / save as PDF</button><button type="button" className="cr-btn ghost" onClick={() => setDocs(DOCS, 'Templates reset')}>Reset templates</button></div>
      </Panel>
    </div>
  );
}

// ── 4.17 Reminders & campaigns: what needs a follow-up today, one tap each; campaigns to a segment ──────────────
type Job = { id: string; no: string; name: string; phone: string; model: string; status: string; at: number };
const wa = (phone: string, text: string) => 'https://wa.me/' + phone.replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
export function Reminders({ me }: P) {
  const [orders, setOrders] = useState<Order[]>([]), [jobs] = useSetting<Job[]>('repair-jobs', []), [users, setUsers] = useState<User[]>([]), [meta] = useSetting<Record<string, Cx>>('customer-meta', {}), [done, setDone] = useSetting<Record<string, number>>('reminders-done', {});
  const [seg, setSeg] = useState('all'), [msg, setMsg] = useState('Hi {name}, new stock just landed at Sam Electronics: iPhone 16 screens in every grade. Reply here for prices.');
  useEffect(() => { backend.allOrders().then(setOrders); backend.customers().then(setUsers); }, []);
  const day = 864e5, now = Date.now();
  const items: { k: string; why: string; who: string; phone?: string; text: string }[] = [
    ...jobs.filter((j) => j.status === 'Ready' && now - j.at > 2 * day).map((j) => ({ k: 'r' + j.id, why: 'Repair ready, not collected', who: j.name + ' · ' + j.no, phone: j.phone, text: `Hi ${j.name.split(' ')[0]}, your ${j.model} (${j.no}) is ready and waiting for you at Sam Electronics, Al Murar, Deira.` })),
    ...orders.filter((o) => (o.status === 'New' || o.status === 'Quoted') && now - o.createdAt > day).map((o) => ({ k: 'o' + o.id, why: o.status === 'Quoted' ? 'Quote sent, no answer' : 'Request waiting more than a day', who: o.name + ' · ' + o.no, phone: o.phone, text: `Hi ${o.name.split(' ')[0]}, about your order ${o.no} at Sam Electronics: shall we go ahead?` })),
    ...orders.filter((o) => o.status === 'Ready' && now - o.createdAt > 2 * day).map((o) => ({ k: 'p' + o.id, why: 'Order ready, not collected', who: o.name + ' · ' + o.no, phone: o.phone, text: `Hi ${o.name.split(' ')[0]}, your order ${o.no} is ready for pickup at Sam Electronics.` })),
  ].filter((x) => !done[x.k] || now - done[x.k] > 3 * day);
  const segUsers = users.filter((u) => seg === 'all' || (seg === 'trade' ? u.tradeApproved : (meta[u.id]?.tags || []).includes(seg)));
  const tags = [...new Set(Object.values(meta).flatMap((m) => m.tags || []))];
  void me;
  return (
    <div className="cr-grid">
      <Panel t={'Follow up today · ' + items.length} d="Built from repairs and orders. Tap to send; it hides for 3 days." className="span2">
        {items.length ? items.map((x) => <div key={x.k} className="cr-li"><Badge t={x.why} tone="y" /><span>{x.who}</span>{x.phone ? <a className="cr-btn wa sm" href={wa(x.phone, x.text)} target="_blank" rel="noopener noreferrer" onClick={() => setDone({ ...done, [x.k]: Date.now() }, 'Reminder sent: ' + x.who)}>WhatsApp</a> : null}</div>) : <small className="cr-muted">Nothing to follow up. Well done.</small>}
      </Panel>
      <Panel t="Automatic sending" d="What needs an outside account">
        <ul className="cr-ul"><li><b>E-mail</b>: works once the domain and Resend are set up (Settings → Database).</li><li><b>WhatsApp, automatic</b>: needs the WhatsApp Business API (paid provider). Until then: one tap per message here.</li><li><b>SMS</b>: needs a provider and a UAE sender ID.</li></ul>
      </Panel>
      <Panel t="Campaign" d="Write once, send to a group: one WhatsApp tap per person, or one e-mail to all (BCC)." className="span3">
        <div className="cr-row" style={{ marginTop: 0 }}><select className="cr-in" style={{ maxWidth: 220 }} value={seg} onChange={(e) => setSeg(e.target.value)}><option value="all">All customers ({users.length})</option><option value="trade">Trade accounts</option>{tags.map((t) => <option key={t} value={t}>Tag: {t}</option>)}</select><small className="cr-muted">{segUsers.length} people · only customers who agreed to offers should get marketing</small></div>
        <textarea className="cr-in" rows={3} style={{ marginTop: 10, width: '100%' }} value={msg} onChange={(e) => setMsg(e.target.value)} />
        <div className="cr-row"><a className="cr-btn" href={'mailto:?bcc=' + encodeURIComponent(segUsers.map((u) => u.email).join(',')) + '&subject=' + encodeURIComponent('Sam Electronics') + '&body=' + encodeURIComponent(msg.replace('{name}', ''))}>E-mail all (BCC)</a><button type="button" className="cr-btn ghost" onClick={() => csv('campaign-' + seg, [['Name', 'Phone', 'E-mail', 'WhatsApp link'], ...segUsers.map((u) => [u.name, u.phone || '', u.email, u.phone ? wa(u.phone, msg.replace('{name}', u.name.split(' ')[0])) : ''])])}>Download list with WhatsApp links</button></div>
        <div className="cr-wa-list">{segUsers.filter((u) => u.phone).slice(0, 60).map((u) => <a key={u.id} className="cr-btn wa sm" href={wa(u.phone!, msg.replace('{name}', u.name.split(' ')[0]))} target="_blank" rel="noopener noreferrer">{u.name}</a>)}</div>
      </Panel>
    </div>
  );
}

// ── 4.25 Health & data quality ───────────────────────────────────────────────────────────────────────────────
export function Health() {
  const list = useCatalog(), D = data(), [ping, setPing] = useState<number | null>(null), [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { const t0 = performance.now(); fetch('/', { cache: 'no-store' }).then(() => setPing(Math.round(performance.now() - t0))).catch(() => setPing(-1)); backend.allOrders().then(setOrders); }, []);
  const models = new Set((D?.models || []).map((m) => m.id));
  const noPhoto = list.filter((p) => !p.shot), noPrice = list.filter((p) => !(p.retail_price > 0) && p.price_mode !== 'whatsapp' && p.price_mode !== 'call'), noModel = list.filter((p) => !models.has(p.model_id)), noGrade = list.filter((p) => !p.grade);
  const dupMap = new Map<string, Raw[]>(); list.forEach((p) => { const k = p.title.toLowerCase() + '|' + p.grade; dupMap.set(k, [...(dupMap.get(k) || []), p]); }); const dups = [...dupMap.values()].filter((x) => x.length > 1);
  const issues: [string, Raw[]][] = [['No photo or 3D shot', noPhoto], ['No price (and not "ask")', noPrice], ['Unknown model', noModel], ['No grade', noGrade], ['Possible duplicates', dups.flat()]];
  const exportAll = () => { csv('products-all', [['id', 'title', 'model', 'category', 'grade', 'retail', 'trade', 'stock', 'visible'], ...list.map((p) => [p.id, p.title, p.model_id, p.category, p.grade, p.retail_price, p.wholesale_price, p.stock_qty, p.visible !== false ? 1 : 0])]); csv('orders-all', [['no', 'date', 'name', 'email', 'phone', 'status', 'total'], ...orders.map((o) => [o.no, new Date(o.createdAt).toISOString(), o.name, o.email, o.phone, o.status, o.total])]); };
  return (
    <div className="cr-grid">
      <div className="cr-kpis span3"><Kpi l="Website" v={ping == null ? '…' : ping < 0 ? 'DOWN' : ping + ' ms'} s="home page response from here" tone={ping != null && (ping < 0 || ping > 1500) ? 'r' : 'g'} /><Kpi l="Products" v={list.length} s={list.filter((p) => p.visible !== false).length + ' visible'} /><Kpi l="Data issues" v={issues.reduce((s, [, x]) => s + x.length, 0)} s="to fix in Products & prices" tone="y" /><Kpi l="Orders stored" v={orders.length} /></div>
      <Panel t="Data quality" d="Products that need attention before they look right in the shop." className="span2" right={<button type="button" className="cr-btn ghost sm" onClick={exportAll}>Export everything (CSV)</button>}>
        <HBars rows={issues.map(([n, x]) => ({ n, v: x.length }))} fmt={(v) => String(v)} c="#D14B4B" />
        {issues.filter(([, x]) => x.length).map(([n, x]) => <details key={n} className="cr-det"><summary>{n} · {x.length}</summary><div>{x.slice(0, 40).map((p) => <span key={p.id + n} className="mono">{p.id} <small>{p.title}</small></span>)}{x.length > 40 ? <small>+{x.length - 40} more</small> : null}</div></details>)}
      </Panel>
      <Panel t="Speed" d="What visitors download">
        <ul className="cr-ul"><li>The Control Room, the Arabic dictionary and the database client load only when needed.</li><li>Spanish and French preload when the page is idle; the other 20 languages load when picked.</li><li>3D scenes lower their resolution on slow devices.</li></ul>
      </Panel>
    </div>
  );
}

// ── 4.26 Training: a short guide for each part of the Control Room + each person's first-week checklist ────────
const GUIDE: [string, string, string[]][] = [
  ['dashboard', 'Dashboard', ['Your day at a glance: sales, requests, repairs due, low stock.', 'Tap any number to open its page.', 'Green dot top right = live figures from Daftra.']],
  ['orders', 'Requests & orders', ['New website orders arrive here and on the bell.', 'Confirm stock and price with the customer, then move the status.', 'Send to Daftra creates the quotation or invoice (with confirmation).']],
  ['repairs', 'Repairs', ['New job: customer, model, problem, part.', 'Tick the arrival check and take damage photos.', 'Move the card as you work; each status has a ready WhatsApp message.', 'At pickup the customer signs on the tablet; print the warranty sticker.']],
  ['products', 'Products & prices', ['Search, edit a product, change price or stock.', 'Bulk changes with preview are in Pricing.']],
  ['scanner', 'Scanner', ['Open on the phone, scan a product or shelf QR.', 'Stock in / stock out with a quantity.']],
  ['queue', 'Walk-in queue', ['Give a ticket on the counter tablet.', 'Call the next number; it shows big on the shop TV.']],
  ['brand', 'Brand Studio', ['Pick a document, type over the texts, fill from an order, print or save as PDF.']],
  ['activity', 'Activity Center', ['Everything everyone did, with filters and export. No screen recording.']],
];
export function Training({ me, go }: P) {
  const [done, setDone] = useSetting<Record<string, string[]>>('training', {}), mine = done[me.id] || [];
  const tick = (k: string) => setDone({ ...done, [me.id]: mine.includes(k) ? mine.filter((x) => x !== k) : [...mine, k] }, me.name + ' training ' + k);
  return (
    <div className="cr-grid">
      <Panel t="Your first week" d={mine.length + ' of ' + GUIDE.length + ' done'} className="span3"><div className="tr-bar"><i style={{ width: (mine.length / GUIDE.length) * 100 + '%' }} /></div></Panel>
      {GUIDE.map(([k, t, steps]) => <Panel key={k} t={t} right={<button type="button" className="cr-btn ghost sm" onClick={() => go(k === 'brand' ? 'brand' : k)}>Open</button>}>
        <ol className="cr-ol">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <label className="cr-chk"><input type="checkbox" checked={mine.includes(k)} onChange={() => tick(k)} /> I know how to use this</label>
      </Panel>)}
    </div>
  );
}

// ── 4.27 The owner's daily summary (copy, WhatsApp or e-mail; automatic e-mail once Resend is set up) ──────────
export function Summary({ me }: P) {
  const [orders, setOrders] = useState<Order[]>([]), [jobs] = useSetting<Job[]>('repair-jobs', []), [apps, setApps] = useState<Application[]>([]), list = useCatalog(), [audit, setAudit] = useState<{ staff: string; at: number }[]>([]);
  useEffect(() => { backend.allOrders().then(setOrders); backend.applications().then(setApps); if (can(me, 'audit')) backend.audit().then(setAudit); }, [me]);
  const d0 = new Date(); d0.setHours(0, 0, 0, 0); const t = d0.getTime();
  const today = orders.filter((o) => o.createdAt >= t && o.status !== 'Cancelled'), acts = audit.filter((a) => a.at >= t);
  const lines = [`Sam Electronics · ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`, `Website orders today: ${today.length} · ${money(today.reduce((s, o) => s + o.total, 0))}`, `Waiting to confirm: ${orders.filter((o) => o.status === 'New').length}`, `Repairs on the bench: ${jobs.filter((j) => j.status !== 'Collected').length} · ready to collect: ${jobs.filter((j) => j.status === 'Ready').length}`, `New applications: ${apps.filter((a) => a.status === 'new').length}`, `Out of stock: ${list.filter((p) => p.visible !== false && p.stock_qty <= 0).length} · low: ${list.filter((p) => p.visible !== false && p.stock_qty > 0 && p.stock_qty <= (p.low_stock_threshold || 3)).length}`, `Team actions today: ${acts.length} by ${new Set(acts.map((a) => a.staff)).size} people`];
  const text = lines.join('\n');
  return (
    <div className="cr-grid">
      <Panel t="Today's summary" d="The owner's evening report. Automatic e-mail at 21:00 once the e-mail domain is set up." className="span2">
        <pre className="cr-pre">{text}</pre>
        <div className="cr-row"><button type="button" className="cr-btn" onClick={() => navigator.clipboard?.writeText(text)}>Copy</button><a className="cr-btn wa" href={'https://wa.me/?text=' + encodeURIComponent(text)} target="_blank" rel="noopener noreferrer">WhatsApp</a><a className="cr-btn ghost" href={'mailto:?subject=' + encodeURIComponent('Daily summary') + '&body=' + encodeURIComponent(text)}>E-mail</a></div>
      </Panel>
    </div>
  );
}

// ── 4.2.1 Daftra name parser: split a product name into brand / model / part / colour / quality ────────────────
export function parseName(name: string) {
  const D = data(); const n = ' ' + name.toLowerCase().replace(/[()\[\],/]+/g, ' ').replace(/\s+/g, ' ') + ' ';
  const best = <T,>(arr: T[], get: (x: T) => string[]) => { let hit: T | null = null, len = 0; arr.forEach((x) => get(x).forEach((k) => { const s = ' ' + k.toLowerCase() + ' '; if (k && n.includes(s) && s.length > len) { hit = x; len = s.length; } })); return hit as T | null; };
  const brand = best(D?.brands || [], (b) => [b.name]); const models = (D?.models || []).filter((m) => !brand || m.brand_id === (brand as { id: string }).id);
  const model = best(models, (m) => [m.name, ...(m.model_numbers || [])]); const cat = best(D?.categories || [], (c) => [c.name, c.one, c.part || ''].filter(Boolean));
  const grade = best(Object.entries(D?.gradeNames || {}), ([k, v]) => [v, k]); const colour = best(D?.colours || [], (c) => [c.name]);
  return { brand: (brand as { name: string } | null)?.name || '', model: (model as { name: string } | null)?.name || '', part: (cat as { name: string } | null)?.name || '', quality: grade ? (grade as [string, string])[1] : '', colour: (colour as { name: string } | null)?.name || '' };
}
export function NameParser() {
  const [txt, setTxt] = useState('');
  const rows = txt.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 500).map((l) => ({ l, ...parseName(l) }));
  return (
    <div className="cr-grid">
      <Panel t="Name parser" d="Paste product names (one per line, e.g. from a Daftra export). Each name is split using the shop's own brands, models, parts, grades and colours." className="span3">
        <textarea className="cr-in" rows={6} style={{ width: '100%' }} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={'IPHONE 13 PRO SCREEN ORIGINAL\nA54 BATTERY SERVICE PACK\nREDMI NOTE 12 BACK COVER BLACK'} />
        <Table rows={rows} empty="Paste names above." cols={[{ k: 'l', l: 'Name', get: (r) => <span className="mono">{r.l}</span> }, { k: 'b', l: 'Brand', get: (r) => r.brand || <Badge t="?" tone="r" /> }, { k: 'm', l: 'Model', get: (r) => r.model || <Badge t="?" tone="r" /> }, { k: 'p', l: 'Part', get: (r) => r.part || <Badge t="?" tone="r" /> }, { k: 'q', l: 'Quality', get: (r) => r.quality || '·' }, { k: 'c', l: 'Colour', get: (r) => r.colour || '·' }]} />
        <div className="cr-row"><button type="button" className="cr-btn ghost sm" disabled={!rows.length} onClick={() => csv('parsed-names', [['Name', 'Brand', 'Model', 'Part', 'Quality', 'Colour'], ...rows.map((r) => [r.l, r.brand, r.model, r.part, r.quality, r.colour])])}>Download CSV</button><small className="cr-muted">{rows.filter((r) => r.brand && r.model && r.part).length} of {rows.length} fully recognised</small></div>
      </Panel>
    </div>
  );
}

// ── 4.18 Staff Samsoom: knows every Control Room feature and where it is ──────────────────────────────────────────
const KB: [string[], string, string][] = [
  [['price', 'prices', 'bulk', 'margin', 'discount', 'coupon', 'سعر', 'أسعار', 'خصم'], 'Prices: one product in Products & prices; many at once (with a preview) and coupons in Pricing.', 'pricing'],
  [['stock', 'count', 'shelf', 'warehouse', 'مخزون'], 'Stock moves and counts are in Stock & warehouse. On the phone, use the Scanner for stock in and out.', 'warehouse'],
  [['scan', 'barcode', 'qr', 'label', 'sticker', 'ملصق'], 'Scan with the Scanner; print product, shelf and door QR labels in QR & labels. Repair warranty stickers print from the job.', 'scanner'],
  [['repair', 'job', 'ticket', 'imei', 'signature', 'صيانة'], 'Repairs: open a job card for intake, photos, checklist, WhatsApp per status and the pickup signature.', 'repairs'],
  [['warranty', 'return', 'claim', 'faulty', 'ضمان'], 'Returned or faulty parts go in Warranty & returns, with the supplier batch.', 'claims'],
  [['order', 'request', 'quote', 'quotation', 'invoice', 'daftra', 'طلب', 'فاتورة'], 'Website orders are in Requests & orders. Send to Daftra makes the quotation or invoice there (with confirmation).', 'orders'],
  [['customer', 'credit', 'statement', 'tag', 'عميل'], 'Customer tags, credit limits and statements are in Customers & credit.', 'credit'],
  [['ship', 'shipment', 'tracking', 'dhl', 'aramex', 'packing', 'شحن'], 'Parcels, tracking, packing list and commercial invoice: Shipments.', 'shipments'],
  [['document', 'template', 'brand', 'logo', 'stamp', 'pdf', 'quotation template'], 'Brand Studio has the brand kit and all document templates.', 'brand'],
  [['remind', 'follow', 'campaign', 'whatsapp', 'offer', 'تذكير'], 'Reminders shows who to follow up today, and sends campaigns to a group.', 'reminders'],
  [['report', 'sales by', 'best', 'تقرير'], 'Reports: sales by brand, part and quality, requests to sales, repairs.', 'reports'],
  [['who', 'activity', 'log', 'changed', 'نشاط'], 'Everything anyone did is in the Activity Center.', 'activity'],
  [['queue', 'ticket number', 'tv', 'طابور'], 'Walk-in queue: give tickets and show the number on the shop TV.', 'queue'],
  [['task', 'announcement', 'مهمة'], 'Tasks & announcements for the team; the announcement shows on everyone\'s dashboard.', 'tasks'],
  [['staff', 'invite', 'role', 'permission', 'two-step', 'موظف'], 'Invite staff and set their rights in Staff & roles. Reset someone\'s two-step there too.', 'team'],
  [['text', 'banner', 'website', 'edit', 'samsoom', 'موقع'], 'Website texts, banners and Samsoom are in Site & Samsoom; ads and events in Ads, pop-ups & events.', 'site'],
  [['excel', 'import', 'price list', 'catalogue'], 'Import products and make branded price lists in Excel.', 'excel'],
  [['missing', 'duplicate', 'health', 'speed', 'export'], 'Health shows missing photos or prices, duplicates, and exports everything.', 'health'],
  [['summary', 'today', 'daily', 'ملخص'], 'Today\'s summary for the owner: copy, WhatsApp or e-mail.', 'summary'],
  [['name', 'parse', 'split'], 'The Name parser splits Daftra product names into brand, model, part, quality and colour.', 'parser'],
];
export function StaffSam({ go }: P) {
  const [q, setQ] = useState(''), [log, setLog] = useState<{ q: string; a: string; m?: string }[]>([]);
  const ask = (e: React.FormEvent) => { e.preventDefault(); const s = q.toLowerCase(); if (!s.trim()) return; let best: [string[], string, string] | null = null, sc = 0; KB.forEach((k) => { const n = k[0].filter((w) => s.includes(w)).length; if (n > sc) { sc = n; best = k; } }); const b = best as [string[], string, string] | null; setLog([{ q, a: b ? b[1] : 'I am not sure yet. Try words like price, stock, repair, order, shipment, label or report.', m: b?.[2] }, ...log].slice(0, 8)); setQ(''); };
  return (
    <div className="cr-grid">
      <Panel t="Ask Samsoom" d="Where is something? How do I…? Ask in English or Arabic." className="span3">
        <form className="cr-row" style={{ marginTop: 0 }} onSubmit={ask}><input className="cr-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. how do I change prices for all Samsung screens?" autoFocus /><button type="submit" className="cr-btn">Ask</button></form>
        <div className="ss-log">{log.map((x, i) => <div key={i} className="ss-q"><b>{x.q}</b><p>{x.a}</p>{x.m ? <button type="button" className="cr-btn sm" onClick={() => go(x.m!)}>Open it</button> : null}</div>)}</div>
      </Panel>
    </div>
  );
}
