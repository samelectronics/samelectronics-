'use client';
// P5 · Control Room: Dashboard, Products & prices, Stock & warehouse.
import React, { useEffect, useMemo, useState } from 'react';
import { backend, type Order, type Staff, type StockMove, type Thread, type Application } from '@/lib/backend';
import { data, rawProducts, products, type Raw } from '@/lib/catalog';
import { Panel, Kpi, Bars, Table, Drawer, Badge, csv, can, money, day, when } from './kit';

type P = { me: Staff; go: (m: string) => void };
const useCatalog = () => { const [n, setN] = useState(0); useEffect(() => { const on = () => setN((x) => x + 1); window.addEventListener('se:catalog', on); window.addEventListener('se:db', on); return () => { window.removeEventListener('se:catalog', on); window.removeEventListener('se:db', on); }; }, []); return useMemo(() => rawProducts(), [n]); }; // eslint-disable-line react-hooks/exhaustive-deps
const names = () => { const D = data(); const M = new Map((D?.models || []).map((m) => [m.id, m])), B = new Map((D?.brands || []).map((b) => [b.id, b.name])); return (p: Raw) => { const m = M.get(p.model_id); return { model: m?.name || p.model_id, brand: m ? B.get(m.brand_id) || '' : '' }; }; };

// ── Dashboard ───────────────────────────────────────────────────────────────────────────────────────────────
export function Dashboard({ me, go }: P) {
  const [orders, setOrders] = useState<Order[]>([]), [threads, setThreads] = useState<Thread[]>([]), [apps, setApps] = useState<Application[]>([]);
  const list = useCatalog();
  useEffect(() => { backend.allOrders().then(setOrders); backend.threads().then(setThreads); backend.applications().then(setApps); }, []);
  const now = Date.now(), d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const today = orders.filter((o) => o.createdAt >= d0.getTime()), open = orders.filter((o) => !['Collected / Shipped', 'Closed', 'Cancelled'].includes(o.status));
  const low = list.filter((p) => p.visible !== false && p.stock_qty <= (p.low_stock_threshold || 3));
  const sample = !orders.length;
  const series = Array.from({ length: 14 }, (_, i) => { const a = d0.getTime() - (13 - i) * 864e5, b = a + 864e5; const real = orders.filter((o) => o.createdAt >= a && o.createdAt < b).reduce((s, o) => s + o.total, 0); return { l: new Date(a).getDate() + '', v: sample ? 1800 + Math.round(Math.abs(Math.sin(i * 1.7)) * 4200) : real }; });
  const stockValue = list.reduce((s, p) => s + p.stock_qty * (p.wholesale_price || 0) * 0.85, 0);
  return (
    <div className="cr-grid">
      <div className="cr-hello"><div><small>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</small><h2>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {me.name.split(' ')[0]}.</h2></div></div>
      <div className="cr-kpis">
        <Kpi l="Sales today" v={money(today.reduce((s, o) => s + o.total, 0))} s={today.length + ' orders'} tone="y" onClick={can(me, 'orders') ? () => go('orders') : undefined} />
        <Kpi l="Open orders" v={open.length} s="to confirm, pack or hand over" onClick={can(me, 'orders') ? () => go('orders') : undefined} />
        <Kpi l="Low stock" v={low.length} s="at or under the alert level" tone={low.length ? 'r' : 'g'} onClick={can(me, 'stock') ? () => go('warehouse') : undefined} />
        <Kpi l="Unread chats" v={threads.filter((t) => t.status === 'open').length} s="waiting for a reply" tone="d" onClick={can(me, 'chat') ? () => go('inbox') : undefined} />
        <Kpi l="Approvals" v={apps.filter((a) => a.status === 'new').length} s="trade, jobs, cards" onClick={can(me, 'approvals') ? () => go('approvals') : undefined} />
        <Kpi l="Stock value (est.)" v={money(stockValue)} s={list.length + ' products'} />
      </div>
      <Panel t="Sales · last 14 days" d={sample ? 'Sample curve: real figures appear as orders come in.' : 'Order totals incl. VAT'} className="span2"><Bars data={series} h={190} fmt={money} /></Panel>
      <Panel t="Needs attention" className="cr-att">
        {low.slice(0, 6).map((p) => <div key={p.id} className="cr-li"><Badge t={p.stock_qty ? p.stock_qty + ' left' : 'OUT'} tone={p.stock_qty ? 'y' : 'r'} /><span>{p.title}</span><small>{p.grade}</small></div>)}
        {threads.filter((t) => t.status === 'open').slice(0, 3).map((t) => <div key={t.id} className="cr-li"><Badge t="CHAT" tone="d" /><span>{t.name}: {t.last.slice(0, 50)}</span></div>)}
        {!low.length && !threads.length ? <small className="cr-muted">All clear.</small> : null}
      </Panel>
      <Panel t="Latest orders" right={can(me, 'orders') ? <button type="button" className="cr-btn ghost sm" onClick={() => go('orders')}>All orders</button> : null} className="span3">
        <Table rows={orders.slice(0, 8)} empty="No orders yet. Orders placed on the site appear here instantly." cols={[
          { k: 'no', l: 'Order', get: (o) => <b className="mono">{o.no}</b> }, { k: 'c', l: 'Customer', get: (o) => o.name }, { k: 'd', l: 'Date', get: (o) => when(o.createdAt) },
          { k: 's', l: 'Status', get: (o) => <Badge t={o.status} tone={o.status === 'New' ? 'y' : o.status === 'Cancelled' ? 'r' : 'g'} /> }, { k: 't', l: 'Total', get: (o) => money(o.total), cls: 'num' }]} />
      </Panel>
    </div>
  );
}

// ── Products & prices ────────────────────────────────────────────────────────────────────────────────────────
export function Products({ me }: P) {
  const list = useCatalog(), D = data(), nm = useMemo(() => names(), []);
  const [cat, setCat] = useState(''), [brand, setBrand] = useState(''), [lowOnly, setLowOnly] = useState(false), [ed, setEd] = useState<Raw | null>(null), [add, setAdd] = useState(false), [bulk, setBulk] = useState(0), [msg, setMsg] = useState('');
  const mB = useMemo(() => new Map((D?.models || []).map((m) => [m.id, m.brand_id])), [D]);
  const rows = list.filter((p) => (!cat || p.category === cat) && (!brand || mB.get(p.model_id) === brand) && (!lowOnly || p.stock_qty <= (p.low_stock_threshold || 3)));
  const P_ = can(me, 'prices'), S_ = can(me, 'stock'), C_ = can(me, 'products');
  const save = async (id: string, patch: Record<string, unknown>) => { const r = await backend.saveProduct(id, patch); setMsg(r.ok ? 'Saved · the shop shows it now' : r.error); window.setTimeout(() => setMsg(''), 2200); };
  const applyBulk = async () => { if (!bulk) return; for (const p of rows) await backend.saveProduct(p.id, { retail_price: Math.round(p.retail_price * (1 + bulk / 100)), wholesale_price: Math.round(p.wholesale_price * (1 + bulk / 100)) }); setMsg(rows.length + ' prices changed by ' + bulk + '%'); setBulk(0); };
  return (
    <div className="cr-grid">
      <div className="cr-filters">
        <select className="cr-in" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{D?.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select className="cr-in" value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">All brands</option>{D?.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
        <label className="cr-chk"><input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Low stock only</label>
        <span className="cr-sp" />
        {msg ? <Badge t={msg} tone="g" /> : null}
        {P_ ? <span className="cr-bulk">Prices of these {rows.length}: <input className="cr-in xs" type="number" value={bulk || ''} onChange={(e) => setBulk(+e.target.value)} placeholder="±%" /><button type="button" className="cr-btn sm" onClick={applyBulk} disabled={!bulk}>Apply</button></span> : null}
        <button type="button" className="cr-btn ghost sm" onClick={() => csv('products.csv', [['id', 'title', 'brand', 'model', 'category', 'grade', 'manufacturer', 'retail', 'trade', 'cost', 'stock', 'visible'], ...rows.map((p) => { const n = nm(p); return [p.id, p.title, n.brand, n.model, p.category, p.grade, p.manufacturer, p.retail_price, p.wholesale_price, (p as Raw & { cost_price?: number }).cost_price || '', p.stock_qty, p.visible !== false ? 'yes' : 'no']; })])}>Export CSV</button>
        {C_ ? <button type="button" className="cr-btn y sm" onClick={() => setAdd(true)}>+ Add product</button> : null}
      </div>
      <Panel t={rows.length + ' products'} d="Click a row to edit everything. Changes show in the shop immediately." className="span3">
        <Table rows={rows} search={(p) => p.id + ' ' + p.title + ' ' + nm(p).model} onRow={setEd} cols={[
          { k: 'img', l: '', w: '54px', get: (p) => <img className="cr-thumb" src={products().find((x) => x.id === p.id)?.img || ''} alt="" /> },
          { k: 't', l: 'Product', get: (p) => <span className="cr-two"><b>{p.title}</b><small className="mono">{p.id}</small></span>, sort: (p) => p.title },
          { k: 'g', l: 'Grade', get: (p) => <Badge t={(D?.gradeNames || {})[p.grade] || p.grade} tone="d" />, sort: (p) => p.grade },
          { k: 'm', l: 'Maker', get: (p) => p.manufacturer, sort: (p) => p.manufacturer },
          { k: 'r', l: 'Retail', get: (p) => money(p.retail_price), sort: (p) => p.retail_price, cls: 'num' },
          { k: 'w', l: 'Trade', get: (p) => money(p.wholesale_price), sort: (p) => p.wholesale_price, cls: 'num' },
          { k: 's', l: 'Stock', get: (p) => <Badge t={String(p.stock_qty)} tone={p.stock_qty <= 0 ? 'r' : p.stock_qty <= (p.low_stock_threshold || 3) ? 'y' : 'g'} />, sort: (p) => p.stock_qty },
          { k: 'v', l: 'On site', get: (p) => (p.visible !== false ? '●' : '○'), sort: (p) => (p.visible !== false ? 1 : 0) },
        ]} />
      </Panel>
      <Drawer open={!!ed} onClose={() => setEd(null)} title={ed ? ed.title : ''}>
        {ed ? <ProductForm p={ed} canP={P_} canS={S_} canC={C_} onSave={async (patch) => { await save(ed.id, patch); setEd(null); }} /> : null}
      </Drawer>
      <Drawer open={add} onClose={() => setAdd(false)} title="Add a product"><NewProduct onDone={() => setAdd(false)} /></Drawer>
    </div>
  );
}
function ProductForm({ p, canP, canS, canC, onSave }: { p: Raw; canP: boolean; canS: boolean; canC: boolean; onSave: (patch: Record<string, unknown>) => void }) {
  const x = p as Raw & { cost_price?: number; location?: string; description?: string; warranty?: string; photos?: string[] };
  const [f, setF] = useState({ title: p.title, retail_price: p.retail_price, wholesale_price: p.wholesale_price, cost_price: x.cost_price || Math.round(p.wholesale_price * 0.82), low_stock_threshold: p.low_stock_threshold || 3, visible: p.visible !== false, location: x.location || '', description: x.description || '', warranty: x.warranty || '', badges: (p.badges || []).join(', '), photos: x.photos || [] as string[] });
  const margin = f.retail_price ? Math.round((1 - f.cost_price / f.retail_price) * 100) : 0, tmargin = f.wholesale_price ? Math.round((1 - f.cost_price / f.wholesale_price) * 100) : 0;
  const pic = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const r = new FileReader(); r.onload = () => setF({ ...f, photos: [...f.photos, String(r.result)].slice(0, 6) }); r.readAsDataURL(file); };
  return (
    <form className="cr-form" onSubmit={(e) => { e.preventDefault(); onSave({ title: f.title, ...(canP ? { retail_price: +f.retail_price, wholesale_price: +f.wholesale_price, cost_price: +f.cost_price } : {}), ...(canS ? { low_stock_threshold: +f.low_stock_threshold, location: f.location } : {}), ...(canC ? { visible: f.visible, description: f.description, warranty: f.warranty, badges: f.badges.split(',').map((s) => s.trim()).filter(Boolean), photos: f.photos } : {}) }); }}>
      <label>Title<input className="cr-in" value={f.title} disabled={!canC} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
      <div className="cr-row3">
        <label>Retail price (AED)<input className="cr-in" type="number" step="0.5" value={f.retail_price} disabled={!canP} onChange={(e) => setF({ ...f, retail_price: +e.target.value })} /></label>
        <label>Trade price (AED)<input className="cr-in" type="number" step="0.5" value={f.wholesale_price} disabled={!canP} onChange={(e) => setF({ ...f, wholesale_price: +e.target.value })} /></label>
        <label>Cost price (AED)<input className="cr-in" type="number" step="0.5" value={f.cost_price} disabled={!canP} onChange={(e) => setF({ ...f, cost_price: +e.target.value })} /></label>
      </div>
      <div className="cr-note">Margin: retail <b>{margin}%</b> · trade <b>{tmargin}%</b> · VAT is added at checkout (5%).</div>
      <div className="cr-row3">
        <label>Stock alert at<input className="cr-in" type="number" value={f.low_stock_threshold} disabled={!canS} onChange={(e) => setF({ ...f, low_stock_threshold: +e.target.value })} /></label>
        <label>Warehouse location<input className="cr-in" value={f.location} disabled={!canS} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="e.g. A-03-2" /></label>
        <label>Warranty (if different)<input className="cr-in" value={f.warranty} disabled={!canC} onChange={(e) => setF({ ...f, warranty: e.target.value })} placeholder="6 months" /></label>
      </div>
      <label>Description<textarea className="cr-in" rows={4} value={f.description} disabled={!canC} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
      <label>Badges (comma separated)<input className="cr-in" value={f.badges} disabled={!canC} onChange={(e) => setF({ ...f, badges: e.target.value })} placeholder="NEW, HOT" /></label>
      <div className="cr-photos"><span>Photos</span>{f.photos.map((s, i) => <span key={i} className="cr-ph"><img src={s} alt="" /><button type="button" onClick={() => setF({ ...f, photos: f.photos.filter((_, j) => j !== i) })}>×</button></span>)}{canC ? <label className="cr-ph add">+<input type="file" accept="image/*" onChange={pic} hidden /></label> : null}</div>
      <label className="cr-chk"><input type="checkbox" checked={f.visible} disabled={!canC} onChange={(e) => setF({ ...f, visible: e.target.checked })} /> Show on the website</label>
      <p className="cr-muted">Stock quantity is changed in Stock & warehouse, so every unit has a reason in the log.</p>
      <button type="submit" className="cr-btn y">Save changes</button>
    </form>
  );
}
function NewProduct({ onDone }: { onDone: () => void }) {
  const D = data(), [q, setQ] = useState(''), [err, setErr] = useState('');
  const [f, setF] = useState({ model_id: '', category: 'SCR', grade: 'OR', quality: 'original', manufacturer: 'service-pack', retail_price: 0, wholesale_price: 0, stock_qty: 0 });
  const ms = (D?.models || []).filter((m) => q.length > 1 && m.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  const m = D?.models.find((x) => x.id === f.model_id), c = D?.categories.find((x) => x.id === f.category);
  const idv = m ? ('SE-' + m.name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8) + '-' + f.category + '-' + f.grade) : '';
  const go = async (e: React.FormEvent) => { e.preventDefault(); if (!m || !c) return setErr('Choose the model first.'); const r = await backend.addProduct({ id: idv, model_id: m.id, category: f.category, part: c.part || '', part_name: c.one, grade: f.grade, quality: f.quality, manufacturer: f.manufacturer, title: m.name + ' ' + c.one, shot: '', retail_price: +f.retail_price, wholesale_price: +f.wholesale_price, stock_qty: +f.stock_qty }); if (r.ok) onDone(); else setErr(r.error); };
  return (
    <form className="cr-form" onSubmit={go}>
      <label>Model<input className="cr-in" value={m ? m.name : q} onChange={(e) => { setQ(e.target.value); setF({ ...f, model_id: '' }); }} placeholder="Type a model…" /></label>
      {!m && ms.length ? <div className="cr-pick">{ms.map((x) => <button key={x.id} type="button" onClick={() => setF({ ...f, model_id: x.id })}>{x.name}</button>)}</div> : null}
      <div className="cr-row3">
        <label>Part<select className="cr-in" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{D?.categories.map((x) => <option key={x.id} value={x.id}>{x.one}</option>)}</select></label>
        <label>Grade<select className="cr-in" value={f.grade} onChange={(e) => setF({ ...f, grade: e.target.value })}>{Object.entries(D?.gradeNames || {}).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>Quality<select className="cr-in" value={f.quality} onChange={(e) => setF({ ...f, quality: e.target.value })}>{D?.qualities.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      </div>
      <div className="cr-row3">
        <label>Manufacturer<select className="cr-in" value={f.manufacturer} onChange={(e) => setF({ ...f, manufacturer: e.target.value })}>{D?.manufacturers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label>Retail (AED)<input className="cr-in" type="number" value={f.retail_price || ''} onChange={(e) => setF({ ...f, retail_price: +e.target.value })} /></label>
        <label>Trade (AED)<input className="cr-in" type="number" value={f.wholesale_price || ''} onChange={(e) => setF({ ...f, wholesale_price: +e.target.value })} /></label>
      </div>
      <label>Opening stock<input className="cr-in" type="number" value={f.stock_qty || ''} onChange={(e) => setF({ ...f, stock_qty: +e.target.value })} /></label>
      {idv ? <div className="cr-note">Reference: <b className="mono">{idv}</b> · title: <b>{m?.name} {c?.one}</b></div> : null}
      {err ? <span className="cr-err">{err}</span> : null}
      <button type="submit" className="cr-btn y">Add to the catalogue</button>
    </form>
  );
}

// ── Stock & warehouse ────────────────────────────────────────────────────────────────────────────────────────
const REASONS = ['Received from supplier', 'Sold in the shop', 'Used in a repair', 'Returned by customer', 'Damaged / faulty', 'Stock count correction', 'Moved to another branch'];
export function Warehouse({ me }: P) {
  const list = useCatalog(), [moves, setMoves] = useState<StockMove[]>([]), [q, setQ] = useState(''), [pid, setPid] = useState(''), [delta, setDelta] = useState(0), [reason, setReason] = useState(REASONS[0]), [ref, setRef] = useState(''), [msg, setMsg] = useState('');
  const load = () => backend.stockMoves().then(setMoves);
  useEffect(() => { load(); }, []);
  const found = q.length > 1 ? list.filter((p) => (p.id + ' ' + p.title).toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  const cur = list.find((p) => p.id === pid);
  const low = list.filter((p) => p.visible !== false && p.stock_qty <= (p.low_stock_threshold || 3)).sort((a, b) => a.stock_qty - b.stock_qty);
  const ship = ((data() as unknown as { shipments?: { id: string; label: string; origin: string; lands: number }[] })?.shipments) || [];
  const totalUnits = list.reduce((s, p) => s + p.stock_qty, 0), value = list.reduce((s, p) => s + p.stock_qty * ((p as Raw & { cost_price?: number }).cost_price || p.wholesale_price * 0.82), 0);
  const move = async (e: React.FormEvent) => { e.preventDefault(); if (!pid || !delta) return; const r = await backend.stockMove(pid, reason.startsWith('Sold') || reason.startsWith('Used') || reason.startsWith('Damaged') || reason.startsWith('Moved') ? -Math.abs(delta) : reason.startsWith('Stock count') ? delta : Math.abs(delta), reason, ref); setMsg(r.ok ? 'Stock updated' : r.error); setDelta(0); setRef(''); load(); window.setTimeout(() => setMsg(''), 2000); };
  return (
    <div className="cr-grid">
      <div className="cr-kpis">
        <Kpi l="Units in stock" v={totalUnits.toLocaleString('en-US')} s={list.length + ' products'} tone="y" />
        <Kpi l="Stock value at cost" v={money(value)} s="estimate until cost prices are in" />
        <Kpi l="Low or out" v={low.length} tone={low.length ? 'r' : 'g'} />
        <Kpi l="Moves this week" v={moves.filter((m) => m.at > Date.now() - 7 * 864e5).length} />
      </div>
      {can(me, 'stock') ? (
        <Panel t="Move stock" d="Every change has a reason, so the count always adds up.">
          <form className="cr-form" onSubmit={move}>
            <label>Product<input className="cr-in" value={cur ? cur.title + ' · ' + cur.grade : q} onChange={(e) => { setQ(e.target.value); setPid(''); }} placeholder="Search a product or reference" /></label>
            {!cur && found.length ? <div className="cr-pick">{found.map((p) => <button key={p.id} type="button" onClick={() => setPid(p.id)}>{p.title} · {p.grade} <small>({p.stock_qty})</small></button>)}</div> : null}
            {cur ? <div className="cr-note">Now in stock: <b>{cur.stock_qty}</b></div> : null}
            <div className="cr-row3">
              <label>Reason<select className="cr-in" value={reason} onChange={(e) => setReason(e.target.value)}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></label>
              <label>Quantity{reason.startsWith('Stock count') ? ' (±)' : ''}<input className="cr-in" type="number" value={delta || ''} onChange={(e) => setDelta(+e.target.value)} /></label>
              <label>Reference<input className="cr-in" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Invoice, order no…" /></label>
            </div>
            {msg ? <Badge t={msg} tone="g" /> : null}
            <button type="submit" className="cr-btn y" disabled={!pid || !delta}>Save move</button>
          </form>
        </Panel>
      ) : null}
      <Panel t="Low stock · reorder" right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('reorder.csv', [['id', 'title', 'grade', 'stock', 'alert at'], ...low.map((p) => [p.id, p.title, p.grade, p.stock_qty, p.low_stock_threshold || 3])])}>Reorder list CSV</button>}>
        <Table rows={low} pageSize={12} empty="Nothing low. 👍" cols={[{ k: 't', l: 'Product', get: (p) => <span className="cr-two"><b>{p.title}</b><small>{p.grade} · {p.manufacturer}</small></span> }, { k: 's', l: 'Stock', get: (p) => <Badge t={String(p.stock_qty)} tone={p.stock_qty ? 'y' : 'r'} />, sort: (p) => p.stock_qty }]} />
      </Panel>
      <Panel t="Incoming shipments">
        {ship.map((s) => <div key={s.id} className="cr-li"><Badge t={s.id} tone="d" /><span>{s.label} · from {s.origin}</span><small>lands {day(s.lands)}</small></div>)}
        <small className="cr-muted">Shipments are entered here by the warehouse once suppliers confirm them.</small>
      </Panel>
      <Panel t="Stock log" className="span3" right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('stock-moves.csv', [['date', 'product', 'change', 'reason', 'ref', 'staff'], ...moves.map((m) => [when(m.at), m.product, m.delta, m.reason, m.ref || '', m.staff])])}>Export</button>}>
        <Table rows={moves} search={(m) => m.product + ' ' + m.reason + ' ' + (m.ref || '')} empty="No stock moves yet." cols={[{ k: 'd', l: 'When', get: (m) => when(m.at), sort: (m) => m.at }, { k: 'p', l: 'Product', get: (m) => <span className="mono">{m.product}</span> }, { k: 'q', l: 'Change', get: (m) => <b className={m.delta < 0 ? 'neg' : 'pos'}>{m.delta > 0 ? '+' : ''}{m.delta}</b>, cls: 'num' }, { k: 'r', l: 'Reason', get: (m) => m.reason }, { k: 'ref', l: 'Ref', get: (m) => m.ref || '—' }, { k: 's', l: 'By', get: (m) => m.staff }]} />
      </Panel>
    </div>
  );
}
