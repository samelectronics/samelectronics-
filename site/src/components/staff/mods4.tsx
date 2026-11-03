'use client';
// R10 Stage 4 · Control Room v2: the dashboard with live Daftra data (4.1), the Activity Center (4.23), QR & labels (4.5),
// the phone scanner (4.6) and the shop-floor task board (4.20). Daftra data comes only through the server bridge
// (/api/daftra, staff + 6-digit code); nothing from Daftra is stored in the code.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import qrcode from 'qrcode-generator';
import { backend, type Order, type Staff, type Thread, type Application, type Audit } from '@/lib/backend';
import { rawProducts, type Raw } from '@/lib/catalog';
import { Panel, Kpi, Table, Badge, csv, can, money, when, useSetting } from './kit';
import { LineChart, Donut, HBars } from './charts';
import { api as daftra } from './DaftraMod';

type P = { me: Staff; go: (m: string) => void };
type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? '' : String(v)), n = (v: unknown) => +s(v) || 0;
const dkey = (t: number) => new Date(t + 4 * 36e5).toISOString().slice(0, 10); // Dubai date
const useCatalog = () => { const [k, setK] = useState(0); useEffect(() => { const on = () => setK((x) => x + 1); window.addEventListener('se:catalog', on); window.addEventListener('se:db', on); return () => { window.removeEventListener('se:catalog', on); window.removeEventListener('se:db', on); }; }, []); return useMemo(() => rawProducts(), [k]); }; // eslint-disable-line react-hooks/exhaustive-deps
type Job = { id: string; no: string; name: string; model: string; problem: string; status: string; at: number; due?: number; tech?: string };

// ── 4.1 Dashboard ─────────────────────────────────────────────────────────────────────────────────────────────
export function Dashboard({ me, go }: P) {
  const [orders, setOrders] = useState<Order[]>([]), [threads, setThreads] = useState<Thread[]>([]), [apps, setApps] = useState<Application[]>([]), [audit, setAudit] = useState<Audit[]>([]);
  const [inv, setInv] = useState<Row[] | null>(null), [pays, setPays] = useState<Row[] | null>(null), [dErr, setDErr] = useState(''), [days, setDays] = useState(14);
  const [jobs] = useSetting<Job[]>('repair-jobs', []);
  const list = useCatalog(), seeMoney = can(me, 'accounting') || can(me, 'reports');
  useEffect(() => { backend.allOrders().then(setOrders); backend.threads().then(setThreads); backend.applications().then(setApps); if (can(me, 'audit')) backend.audit().then(setAudit); }, [me]);
  useEffect(() => { if (!seeMoney) return; daftra('invoices.json', 'limit=100&page=1').then((r) => setInv(r.rows)).catch((e) => setDErr(String(e.message || e))); daftra('invoice_payments.json', 'limit=100&page=1').then((r) => setPays(r.rows)).catch(() => setPays([])); }, [seeMoney]);
  const keys = useMemo(() => Array.from({ length: days }, (_, i) => dkey(Date.now() - (days - 1 - i) * 864e5)), [days]);
  const labels = keys.map((k) => k.slice(8) + '/' + k.slice(5, 7));
  const fromDaftra = !!inv?.length;
  const sales = useMemo(() => {
    const T = keys.map(() => 0), Pd = keys.map(() => 0), U = keys.map(() => 0), R = keys.map(() => 0);
    if (fromDaftra) inv!.forEach((r) => { const k = s(r.date).slice(0, 10), i = keys.indexOf(k); if (i < 0) return; const tot = n(r.summary_total), paid = n(r.summary_paid), ret = tot < 0 || /refund|return|credit/i.test(s(r.type_name) + s(r.invoice_type)); if (ret) { R[i] += Math.abs(tot); return; } T[i] += tot; Pd[i] += paid; U[i] += Math.max(0, n(r.summary_unpaid) || tot - paid); });
    else orders.forEach((o) => { const i = keys.indexOf(dkey(o.createdAt)); if (i < 0) return; if (o.status === 'Cancelled') { R[i] += o.total; return; } T[i] += o.total; if (['Confirmed', 'Ready', 'Collected / Shipped', 'Closed'].includes(o.status)) Pd[i] += o.total; else U[i] += o.total; });
    return { T, Pd, U, R };
  }, [inv, orders, keys, fromDaftra]);
  const paidTot = sales.Pd.reduce((a, b) => a + b, 0), unpaidTot = sales.U.reduce((a, b) => a + b, 0), retTot = sales.R.reduce((a, b) => a + b, 0);
  const daily = useMemo(() => { const v = keys.map(() => 0); (pays || []).forEach((p) => { const i = keys.indexOf(s(p.date).slice(0, 10)); if (i >= 0) v[i] += n(p.amount); }); return v; }, [pays, keys]);
  const today = dkey(Date.now()), low = list.filter((p) => p.visible !== false && p.stock_qty <= (p.low_stock_threshold || 3)).sort((a, b) => a.stock_qty - b.stock_qty);
  const reqs = orders.filter((o) => o.status === 'New'), openChats = threads.filter((t) => t.status === 'open');
  const dueToday = jobs.filter((j) => j.status !== 'Collected' && (j.due ? dkey(j.due) === today : j.status === 'Ready' || dkey(j.at) === today));
  const h = new Date().getHours();
  return (
    <div className="cr-grid cr-dash">
      <div className="cr-hello span3"><div><small>{new Date().toLocaleDateString(typeof document !== 'undefined' ? document.documentElement.lang || 'en-GB' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</small><h2><span>{h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}</span>, <span data-no-i18n="">{me.name.split(' ')[0]}</span>.</h2></div>
        <span className={'cr-src' + (fromDaftra ? ' on' : '')}><i />{fromDaftra ? 'Live from Daftra' : seeMoney ? (dErr ? 'Daftra not connected · website figures' : 'Connecting to Daftra…') : 'Website figures'}</span></div>
      <div className="cr-kpis span3">
        {seeMoney ? <Kpi l={<><span>Sales</span> · {days} <span>days</span></>} v={money(sales.T.reduce((a, b) => a + b, 0))} s={fromDaftra ? <>{inv!.length} <span>Daftra invoices read</span></> : <>{orders.length} <span>website orders</span></>} tone="y" /> : null}
        <Kpi l="Website requests" v={reqs.length} s="new, waiting to be confirmed" onClick={can(me, 'orders') ? () => go('orders') : undefined} />
        <Kpi l="Repairs due today" v={dueToday.length} s={<>{jobs.filter((j) => j.status !== 'Collected').length} <span>on the bench</span></>} tone="d" onClick={can(me, 'repairs') ? () => go('repairs') : undefined} />
        <Kpi l="Low stock" v={low.length} s="at or under the alert level" tone={low.length ? 'r' : 'g'} onClick={can(me, 'stock') ? () => go('warehouse') : undefined} />
        <Kpi l="Trade applications" v={apps.filter((a) => a.status === 'new' && a.type === 'wholesale').length} s={<>{apps.filter((a) => a.status === 'new').length} <span>approvals waiting in all</span></>} onClick={can(me, 'approvals') ? () => go('approvals') : undefined} />
        <Kpi l="Open chats" v={openChats.length} s="waiting for a reply" tone="d" onClick={can(me, 'chat') ? () => go('inbox') : undefined} />
      </div>
      {seeMoney ? <>
        <Panel t="Sales per day" d={fromDaftra ? 'Daftra invoices: total, paid, unpaid and returns (AED)' : 'Website orders until Daftra is connected (AED)'} className="span2"
          right={<span className="cr-seg">{[7, 14, 30].map((d) => <button key={d} type="button" className={days === d ? 'on' : ''} onClick={() => setDays(d)}>{d}d</button>)}</span>}>
          <LineChart labels={labels} series={[{ n: 'Total', c: '#F7C032', v: sales.T, area: true }, { n: 'Paid', c: '#2E9E5B', v: sales.Pd }, { n: 'Unpaid', c: '#D14B4B', v: sales.U, dash: true }, { n: 'Returns', c: '#6A6D72', v: sales.R, dash: true }]} />
        </Panel>
        <Panel t="Payments" d={<><span>paid vs unpaid</span> · {days}d</>}><Donut label="AED" parts={[{ n: 'Paid', v: paidTot, c: '#2E9E5B' }, { n: 'Unpaid', v: unpaidTot, c: '#F7C032' }, { n: 'Returns', v: retTot, c: '#9DA1A6' }]} /></Panel>
        <Panel t="Daily payments received" d={pays?.length ? 'Daftra invoice payments (AED)' : 'Appears once Daftra is connected'} className="span2"><LineChart h={190} labels={labels} series={[{ n: 'Received', c: '#2E9E5B', v: daily, area: true }]} /></Panel>
      </> : null}
      <Panel t="Low stock" right={can(me, 'stock') ? <button type="button" className="cr-btn ghost sm" onClick={() => go('warehouse')}>Stock</button> : null}>
        {low.length ? low.slice(0, 7).map((p) => <div key={p.id} className="cr-li"><Badge t={p.stock_qty > 0 ? p.stock_qty + ' left' : 'OUT'} tone={p.stock_qty > 0 ? 'y' : 'r'} /><span>{p.title}</span><small>alert at {p.low_stock_threshold || 3}</small></div>) : <small className="cr-muted">All products are above their alert level.</small>}
        {low.length > 7 ? <small className="cr-muted">+{low.length - 7} more</small> : null}
      </Panel>
      <Panel t="Website requests" right={can(me, 'orders') ? <button type="button" className="cr-btn ghost sm" onClick={() => go('orders')}>All</button> : null}>
        {reqs.slice(0, 6).map((o) => <div key={o.id} className="cr-li"><Badge t={o.no} tone="y" /><span>{o.name} · {o.lines.length} parts</span><small>{when(o.createdAt)}</small></div>)}
        {openChats.slice(0, 3).map((t) => <div key={t.id} className="cr-li"><Badge t="CHAT" tone="d" /><span>{t.name}: {t.last.slice(0, 44)}</span></div>)}
        {!reqs.length && !openChats.length ? <small className="cr-muted">No new requests.</small> : null}
      </Panel>
      <Panel t="Repairs due today" right={can(me, 'repairs') ? <button type="button" className="cr-btn ghost sm" onClick={() => go('repairs')}>Bench</button> : null}>
        {dueToday.length ? dueToday.slice(0, 7).map((j) => <div key={j.id} className="cr-li"><Badge t={j.status} tone={j.status === 'Ready' ? 'g' : 'y'} /><span><b className="mono">{j.no}</b> {j.model} · {j.problem}</span><small>{j.tech || ''}</small></div>) : <small className="cr-muted">Nothing due today.</small>}
      </Panel>
      <Panel t="Trade applications" className={seeMoney ? '' : 'span3'} right={can(me, 'approvals') ? <button type="button" className="cr-btn ghost sm" onClick={() => go('approvals')}>Approvals</button> : null}>
        {apps.filter((a) => a.status === 'new').slice(0, 6).map((a) => <div key={a.id} className="cr-li"><Badge t={a.type === 'wholesale' ? 'TRADE' : a.type === 'job' ? 'JOB' : 'CARD'} tone={a.type === 'wholesale' ? 'y' : 'd'} /><span>{a.name}{a.data?.company ? ' · ' + a.data.company : ''}</span><small>{when(a.at)}</small></div>)}
        {!apps.some((a) => a.status === 'new') ? <small className="cr-muted">No applications waiting.</small> : null}
      </Panel>
      {can(me, 'audit') ? <Panel t="Live team activity" right={<button type="button" className="cr-btn ghost sm" onClick={() => go('activity')}>Activity Center</button>} className="span3">
        <div className="cr-feed">{audit.slice(0, 8).map((a) => <div key={a.id} className="cr-fi"><span className="cr-av sm">{a.staff.slice(0, 1)}</span><span><b>{a.staff}</b> {a.action} <i>{a.target}</i>{a.detail ? <small> · {a.detail}</small> : null}</span><small className="mono">{when(a.at)}</small></div>)}{!audit.length ? <small className="cr-muted">Actions by the team appear here as they happen.</small> : null}</div>
      </Panel> : null}
    </div>
  );
}

// ── 4.23 Activity Center ──────────────────────────────────────────────────────────────────────────────────────
export function Activity({ me }: P) {
  const [rows, setRows] = useState<Audit[]>([]), [who, setWho] = useState(''), [q, setQ] = useState(''), [span, setSpan] = useState(7);
  useEffect(() => { const load = () => backend.audit().then(setRows); load(); const iv = window.setInterval(load, 20000); return () => window.clearInterval(iv); }, []);
  const people = useMemo(() => [...new Set(rows.map((r) => r.staff))], [rows]);
  const shown = rows.filter((r) => (!who || r.staff === who) && r.at >= Date.now() - span * 864e5 && (!q || (r.action + ' ' + r.target + ' ' + (r.detail || '')).toLowerCase().includes(q.toLowerCase())));
  const per = people.map((p) => ({ n: p, v: shown.filter((r) => r.staff === p).length })).filter((x) => x.v).sort((a, b) => b.v - a.v);
  void me;
  return (
    <div className="cr-grid">
      <Panel t="Who did what" d="Every action in the Control Room, including the owner's. No screen recording: staff are told in writing." className="span2"
        right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('activity', [['When', 'Who', 'Action', 'Item', 'Detail'], ...shown.map((r) => [new Date(r.at).toISOString(), r.staff, r.action, r.target, r.detail || ''])])}>Export CSV</button>}>
        <div className="cr-filters"><input className="cr-in" placeholder="Search actions…" value={q} onChange={(e) => setQ(e.target.value)} /><select className="cr-in" value={who} onChange={(e) => setWho(e.target.value)}><option value="">Everyone</option>{people.map((p) => <option key={p}>{p}</option>)}</select><span className="cr-seg">{[1, 7, 30, 365].map((d) => <button key={d} type="button" className={span === d ? 'on' : ''} onClick={() => setSpan(d)}>{d === 1 ? 'Today' : d === 365 ? 'Year' : d + 'd'}</button>)}</span></div>
        <Table rows={shown} empty="No actions in this period." cols={[{ k: 'w', l: 'When', get: (r) => <span className="mono">{when(r.at)}</span>, sort: (r) => -r.at }, { k: 's', l: 'Who', get: (r) => <b>{r.staff}</b> }, { k: 'a', l: 'Action', get: (r) => r.action }, { k: 't', l: 'Item', get: (r) => r.target }, { k: 'd', l: 'Before → after', get: (r) => <small>{r.detail || ''}</small> }]} />
      </Panel>
      <Panel t="Actions per person" d={'Last ' + (span === 1 ? 'day' : span + ' days')}>{per.length ? <HBars rows={per} fmt={(v) => String(v)} /> : <small className="cr-muted">No actions yet.</small>}</Panel>
    </div>
  );
}

// ── 4.5 QR & labels ───────────────────────────────────────────────────────────────────────────────────────────
const qrSvg = (text: string, cell = 4) => { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell, margin: 2, scalable: true }); };
export function QrLabels() {
  const list = useCatalog(), [q, setQ] = useState(''), [pick, setPick] = useState<string[]>([]), [kind, setKind] = useState<'product' | 'shelf' | 'door'>('product'), [shelf, setShelf] = useState('A-01');
  const base = typeof window !== 'undefined' ? location.origin : 'https://samelectronics.vercel.app';
  const hits = list.filter((p) => !q || (p.id + ' ' + p.title).toLowerCase().includes(q.toLowerCase())).slice(0, 40);
  const labels: { t: string; s: string; url: string }[] = kind === 'product' ? pick.map((id) => { const p = list.find((x) => x.id === id) as Raw | undefined; return { t: p?.title || id, s: id, url: base + '/p/' + encodeURIComponent(id) }; })
    : kind === 'shelf' ? shelf.split(/[,\s]+/).filter(Boolean).map((b) => ({ t: 'Shelf ' + b, s: 'Scan to see what is on it', url: base + '/staff#scanner?shelf=' + encodeURIComponent(b) }))
    : [{ t: 'Sam Electronics', s: 'Shop, repairs and trade', url: base + '/?src=door' }];
  const print = () => { const w = window.open('', '_blank'); if (!w) return; w.document.write(`<!doctype html><meta charset="utf-8"><title>Labels</title><style>body{font:12px Arial;margin:10mm}.g{display:grid;grid-template-columns:repeat(3,60mm);gap:4mm}.l{border:1px dashed #bbb;padding:3mm;display:grid;grid-template-columns:22mm 1fr;gap:3mm;align-items:center;height:28mm;box-sizing:border-box}.l svg{width:22mm;height:22mm}b{display:block;font-size:11px}small{color:#666;font:9px monospace;word-break:break-all}</style><div class="g">${labels.map((l) => `<div class="l">${qrSvg(l.url)}<div><b>${l.t.replace(/</g, '&lt;')}</b><small>${l.s.replace(/</g, '&lt;')}</small></div></div>`).join('')}</div><script>setTimeout(()=>print(),300)<\/script>`); w.document.close(); };
  return (
    <div className="cr-grid">
      <Panel t="Make labels" d="Products open their page when a customer scans; shelves open the scanner for staff; the door QR counts visits." className="span2">
        <span className="cr-seg">{(['product', 'shelf', 'door'] as const).map((k) => <button key={k} type="button" className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k === 'product' ? 'Products' : k === 'shelf' ? 'Shelves' : 'Door / flyer'}</button>)}</span>
        {kind === 'product' ? <><input className="cr-in" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginTop: 12 }} />
          <div className="cr-pick">{hits.map((p) => <label key={p.id}><input type="checkbox" checked={pick.includes(p.id)} onChange={() => setPick(pick.includes(p.id) ? pick.filter((x) => x !== p.id) : [...pick, p.id])} /><span>{p.title}</span><small className="mono">{p.id}</small></label>)}</div></>
          : kind === 'shelf' ? <label className="cr-f" style={{ marginTop: 12 }}>Shelf or bin codes, separated by commas<input className="cr-in" value={shelf} onChange={(e) => setShelf(e.target.value)} /></label> : null}
      </Panel>
      <Panel t={'Preview · ' + labels.length + ' labels'} right={<button type="button" className="cr-btn sm" disabled={!labels.length} onClick={print}>Print</button>}>
        <div className="cr-labels">{labels.slice(0, 12).map((l, i) => <div key={i} className="cr-label"><span dangerouslySetInnerHTML={{ __html: qrSvg(l.url, 3) }} /><span><b>{l.t}</b><small className="mono">{l.s}</small></span></div>)}{!labels.length ? <small className="cr-muted">Tick some products to make their labels.</small> : null}</div>
      </Panel>
    </div>
  );
}

// ── 4.6 Phone scanner ─────────────────────────────────────────────────────────────────────────────────────────
export function Scanner({ me }: P) {
  const vid = useRef<HTMLVideoElement>(null), [on, setOn] = useState(false), [code, setCode] = useState(''), [msg, setMsg] = useState(''), [qty, setQty] = useState(1);
  const list = useCatalog(), item = useMemo(() => { const c = code.trim(), id = decodeURIComponent((c.match(/\/p\/([^?#]+)/) || [])[1] || c).toUpperCase(); return list.find((p) => p.id.toUpperCase() === id) || null; }, [code, list]);
  useEffect(() => {
    if (!on) return; let stream: MediaStream | null = null, raf = 0, dead = false;
    const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
    if (!BD) { setMsg('This browser cannot read codes with the camera (use Chrome on Android, or type the code).'); setOn(false); return; }
    const det = new BD({ formats: ['qr_code', 'ean_13', 'code_128'] });
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((st) => { stream = st; if (vid.current) { vid.current.srcObject = st; vid.current.play(); } const tick = async () => { if (dead || !vid.current) return; try { const r = await det.detect(vid.current); if (r[0]) { setCode(r[0].rawValue); setOn(false); return; } } catch { /* */ } raf = requestAnimationFrame(tick); }; tick(); }).catch(() => { setMsg('The camera is not available.'); setOn(false); });
    return () => { dead = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); };
  }, [on]);
  const move = async (d: number) => { if (!item) return; const r = await backend.stockMove(item.id, d * qty, d > 0 ? 'Scanner · stock in' : 'Scanner · stock out'); setMsg(r.ok ? (d > 0 ? '+' : '−') + qty + ' · ' + item.title : r.error); };
  return (
    <div className="cr-grid">
      <Panel t="Scan" d="Point the phone at a product QR, shelf QR or barcode, or type the code.">
        <div className="cr-scan">{on ? <video ref={vid} muted playsInline /> : <button type="button" className="cr-btn" onClick={() => { setMsg(''); setOn(true); }}>Start the camera</button>}</div>
        <input className="cr-in" placeholder="…or type a product code" value={code} onChange={(e) => setCode(e.target.value)} style={{ marginTop: 12 }} />
        {msg ? <small className="cr-muted">{msg}</small> : null}
      </Panel>
      <Panel t={item ? item.title : 'Item'} className="span2">
        {item ? <div className="cr-scanned">
          <div className="cr-kv"><span>Code</span><b className="mono">{item.id}</b><span>In stock</span><b>{item.stock_qty}</b><span>Shelf</span><b>{s((item as unknown as Row).location) || '·'}</b><span>Price</span><b>{money(item.retail_price)}</b></div>
          {can(me, 'stock') ? <div className="cr-row"><input type="number" min={1} className="cr-in" style={{ width: 90 }} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} /><button type="button" className="cr-btn" onClick={() => move(1)}>Stock in</button><button type="button" className="cr-btn ghost" onClick={() => move(-1)}>Stock out</button><a className="cr-btn ghost" href={'/p/' + encodeURIComponent(item.id)} target="_blank" rel="noopener">Open page ↗</a></div> : null}
        </div> : <small className="cr-muted">{code ? 'No product with that code.' : 'Scan or type a code to see the item and its actions.'}</small>}
      </Panel>
    </div>
  );
}

// ── 4.20 Tasks & announcements ───────────────────────────────────────────────────────────────────────────────
type Task = { id: string; t: string; who?: string; col: 'todo' | 'doing' | 'done'; at: number; by: string };
export function Tasks({ me }: P) {
  const [tasks, setTasks] = useSetting<Task[]>('cr-tasks', []), [ann, setAnn] = useSetting<{ t: string; by: string; at: number } | null>('cr-announce', null), [t, setT] = useState(''), [who, setWho] = useState(''), [a, setA] = useState(''), [staff, setStaff] = useState<Staff[]>([]);
  useEffect(() => { backend.staffList().then(setStaff); }, []);
  const add = () => { if (!t.trim()) return; setTasks([{ id: 't' + Date.now(), t: t.trim(), who: who || undefined, col: 'todo', at: Date.now(), by: me.name }, ...tasks], 'Task added: ' + t.trim()); setT(''); };
  const mv = (x: Task, col: Task['col']) => setTasks(tasks.map((y) => (y.id === x.id ? { ...y, col } : y)), x.t + ' → ' + col);
  const COLS: [Task['col'], string][] = [['todo', 'To do'], ['doing', 'Doing'], ['done', 'Done']];
  return (
    <div className="cr-grid">
      <Panel t="Announcement" d="Shown at the top of everyone's dashboard." className="span3">
        {ann ? <div className="cr-ann"><b>{ann.t}</b><small>{ann.by} · {when(ann.at)}</small>{can(me, 'staff') ? <button type="button" className="cr-btn ghost sm" onClick={() => setAnn(null, 'Announcement removed')}>Remove</button> : null}</div> : null}
        {can(me, 'staff') ? <div className="cr-row"><input className="cr-in" placeholder="Write an announcement for the team…" value={a} onChange={(e) => setA(e.target.value)} /><button type="button" className="cr-btn" disabled={!a.trim()} onClick={() => { setAnn({ t: a.trim(), by: me.name, at: Date.now() }, 'Announcement: ' + a.trim()); setA(''); }}>Post</button></div> : null}
      </Panel>
      <Panel t="Add a task" className="span3"><div className="cr-row"><input className="cr-in" placeholder="What needs doing?" value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /><select className="cr-in" style={{ maxWidth: 200 }} value={who} onChange={(e) => setWho(e.target.value)}><option value="">Anyone</option>{staff.map((x) => <option key={x.id}>{x.name}</option>)}</select><button type="button" className="cr-btn" onClick={add}>Add</button></div></Panel>
      {COLS.map(([c, l]) => <Panel key={c} t={l + ' · ' + tasks.filter((x) => x.col === c).length}>
        <div className="cr-tasks">{tasks.filter((x) => x.col === c).map((x) => <div key={x.id} className={'cr-task ' + c}><b>{x.t}</b><small>{x.who ? x.who + ' · ' : ''}{when(x.at)}</small><span>{c !== 'todo' ? <button type="button" onClick={() => mv(x, c === 'done' ? 'doing' : 'todo')}>←</button> : null}{c !== 'done' ? <button type="button" onClick={() => mv(x, c === 'todo' ? 'doing' : 'done')}>→</button> : <button type="button" onClick={() => setTasks(tasks.filter((y) => y.id !== x.id), 'Task cleared: ' + x.t)}>✕</button>}</span></div>)}</div>
      </Panel>)}
    </div>
  );
}
export function Announcement() {
  const [ann] = useSetting<{ t: string; by: string; at: number } | null>('cr-announce', null);
  return ann ? <div className="cr-annbar"><b>📣 {ann.t}</b><small>{ann.by} · {when(ann.at)}</small></div> : null;
}

// ── 4.21 Reports ──────────────────────────────────────────────────────────────────────────────────────────────
export function Reports() {
  const [orders, setOrders] = useState<Order[]>([]), [span, setSpan] = useState(30), [jobs] = useSetting<Job[]>('repair-jobs', []);
  const list = useCatalog();
  useEffect(() => { backend.allOrders().then(setOrders); }, []);
  const by = useMemo(() => new Map(list.map((p) => [p.id, p])), [list]);
  const ok = orders.filter((o) => o.createdAt >= Date.now() - span * 864e5 && o.status !== 'Cancelled');
  const group = (f: (id: string, l: { title: string; grade: string }) => string) => { const m = new Map<string, number>(); ok.forEach((o) => o.lines.forEach((l) => { const k = f(l.id, l) || 'Other'; m.set(k, (m.get(k) || 0) + l.unit * l.qty); })); return [...m.entries()].map(([n, v]) => ({ n, v })).sort((a, b) => b.v - a.v).slice(0, 8); };
  const R = (id: string) => by.get(id) as (Raw & Record<string, unknown>) | undefined;
  const brand = group((id) => s(R(id)?.brand_id || R(id)?.brand)), part = group((id) => s(R(id)?.category)), grade = group((_, l) => l.grade);
  const prod = group((_, l) => l.title);
  const funnel = [['New', '#F7C032'], ['Quoted', '#E0A800'], ['Confirmed', '#3A7BD5'], ['Ready', '#2E9E5B'], ['Collected / Shipped', '#1E7A45'], ['Closed', '#6A6D72']].map(([st, c]) => ({ n: st, c, v: orders.filter((o) => o.createdAt >= Date.now() - span * 864e5 && o.status === st).length }));
  const rep = ['Booked', 'Diagnosing', 'Waiting for part', 'Repairing', 'Testing', 'Ready', 'Collected'].map((st) => ({ n: st, v: jobs.filter((j) => j.status === st).length }));
  const fmtA = (v: number) => money(v).replace('AED ', '');
  const exp = () => csv('report-' + span + 'd', [['Section', 'Name', 'Value'], ...brand.map((x) => ['Brand', x.n, x.v]), ...part.map((x) => ['Part', x.n, x.v]), ...grade.map((x) => ['Quality', x.n, x.v]), ...prod.map((x) => ['Product', x.n, x.v]), ...funnel.map((x) => ['Requests', x.n, x.v]), ...rep.map((x) => ['Repairs', x.n, x.v])]);
  return (
    <div className="cr-grid cr-dash">
      <div className="cr-hello span3"><div><small>Website orders and repairs · Daftra totals are on the dashboard</small><h2>Sales and work, at a glance</h2></div><span className="cr-row" style={{ marginTop: 0 }}><span className="cr-seg">{[7, 30, 90, 365].map((d) => <button key={d} type="button" className={span === d ? 'on' : ''} onClick={() => setSpan(d)}>{d === 365 ? 'Year' : d + 'd'}</button>)}</span><button type="button" className="cr-btn ghost sm" onClick={exp}>Export CSV</button></span></div>
      <Panel t="Sales by brand" d="AED, excl. cancelled">{brand.length ? <HBars rows={brand} fmt={fmtA} /> : <small className="cr-muted">No sales in this period yet.</small>}</Panel>
      <Panel t="Sales by part" d="AED">{part.length ? <HBars rows={part} fmt={fmtA} c="#3A7BD5" /> : <small className="cr-muted">No sales in this period yet.</small>}</Panel>
      <Panel t="Sales by quality" d="AED">{grade.length ? <Donut label="AED" fmt={fmtA} parts={grade.map((g, i) => ({ ...g, c: ['#F7C032', '#26282B', '#3A7BD5', '#2E9E5B', '#D14B4B', '#9DA1A6', '#E0A800', '#6A6D72'][i % 8] }))} /> : <small className="cr-muted">No sales in this period yet.</small>}</Panel>
      <Panel t="Requests → sales" d="Where website requests are now" className="span2"><HBars rows={funnel.map((f) => ({ n: f.n, v: f.v }))} fmt={(v) => String(v)} c="#26282B" /></Panel>
      <Panel t="Repairs on the bench" d="Jobs by status"><HBars rows={rep} fmt={(v) => String(v)} c="#2E9E5B" /></Panel>
      <Panel t="Best-selling parts" className="span3"><Table rows={prod} empty="No sales in this period yet." cols={[{ k: 'n', l: 'Part', get: (r) => r.n }, { k: 'v', l: 'Sales', get: (r) => money(r.v), cls: 'num', sort: (r) => -r.v }]} /></Panel>
    </div>
  );
}

// ── B9 · the staff bell: new website orders, chats, approvals, tasks for me and low stock, newest first ───────
type Note = { k: string; t: string; s: string; at: number; go: string };
export function StaffBell({ me, go }: P) {
  const [items, setItems] = useState<Note[]>([]), [open, setOpen] = useState(false), [seen, setSeen] = useState(0), ref = useRef<HTMLDivElement>(null);
  const [tasks] = useSetting<Task[]>('cr-tasks', []);
  useEffect(() => { try { setSeen(+(localStorage.getItem('cr-bell-seen-' + me.id) || 0)); } catch { /* */ } }, [me.id]);
  useEffect(() => {
    const load = async () => {
      const out: Note[] = [];
      if (can(me, 'orders')) (await backend.allOrders()).filter((o) => o.status === 'New').forEach((o) => out.push({ k: 'order', t: 'New order ' + o.no, s: o.name + ' · ' + money(o.total), at: o.createdAt, go: 'orders' }));
      if (can(me, 'chat')) (await backend.threads()).filter((t) => t.status === 'open').forEach((t) => out.push({ k: 'chat', t: 'Chat from ' + t.name, s: t.last.slice(0, 60), at: t.at, go: 'inbox' }));
      if (can(me, 'approvals')) (await backend.applications()).filter((a) => a.status === 'new').forEach((a) => out.push({ k: 'app', t: (a.type === 'wholesale' ? 'Trade application' : a.type === 'job' ? 'Job application' : 'Card request') + ' · ' + a.name, s: a.email, at: a.at, go: 'approvals' }));
      if (can(me, 'stock')) rawProducts().filter((p) => p.visible !== false && p.stock_qty <= 0).slice(0, 5).forEach((p) => out.push({ k: 'stock', t: 'Out of stock', s: p.title, at: 0, go: 'warehouse' }));
      setItems(out.sort((a, b) => b.at - a.at));
    };
    load(); const iv = window.setInterval(load, 30000); return () => window.clearInterval(iv);
  }, [me]);
  const mine = tasks.filter((x) => x.col !== 'done' && x.who === me.name).map((x) => ({ k: 'task', t: 'Task for you', s: x.t, at: x.at, go: 'tasks' } as Note));
  const all = [...mine, ...items].sort((a, b) => b.at - a.at), unread = all.filter((x) => x.at > seen).length;
  useEffect(() => { if (!open) return; const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, [open]);
  const markAll = () => { const t = Date.now(); setSeen(t); try { localStorage.setItem('cr-bell-seen-' + me.id, String(t)); } catch { /* */ } };
  return (
    <div className="cr-bell" ref={ref}>
      <button type="button" className="cr-bell-b" aria-label="Notifications" aria-expanded={open} onClick={() => setOpen(!open)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>{unread ? <b>{unread > 99 ? '99+' : unread}</b> : null}</button>
      {open ? <div className="cr-bell-p">
        <div className="cr-bell-h"><b>Notifications</b>{unread ? <button type="button" onClick={markAll}>Mark all read</button> : null}</div>
        <div className="cr-bell-l">{all.length ? all.slice(0, 30).map((x, i) => <button key={i} type="button" className={'cr-bell-i k-' + x.k + (x.at > seen ? ' un' : '')} onClick={() => { setOpen(false); go(x.go); }}><i /><span><b>{x.t}</b><small>{x.s}</small></span>{x.at ? <small className="mono">{when(x.at)}</small> : null}</button>) : <small className="cr-muted" style={{ padding: 16, display: 'block' }}>Nothing new. All clear.</small>}</div>
      </div> : null}
    </div>
  );
}

// ── 4.20 Walk-in queue + shop TV ─────────────────────────────────────────────────────────────────────────────
type Q = { next: number; serving: number | null; list: { n: number; name: string; why: string; at: number }[]; served: number };
export function Queue({ me }: P) {
  const [q, setQ] = useSetting<Q>('cr-queue', { next: 1, serving: null, list: [], served: 0 }), [name, setName] = useState(''), [why, setWhy] = useState('Buy parts'), [tv, setTv] = useState(false), tvRef = useRef<HTMLDivElement>(null);
  const take = () => { const n = q.next; setQ({ ...q, next: n + 1, list: [...q.list, { n, name: name.trim(), why, at: Date.now() }] }, 'Ticket ' + n + ' · ' + why); setName(''); };
  const call = () => { const [h, ...rest] = q.list; if (!h) return; setQ({ ...q, serving: h.n, list: rest, served: q.served + 1 }, 'Now serving ' + h.n + ' · ' + me.name); };
  const reset = () => setQ({ next: 1, serving: null, list: [], served: 0 }, 'Queue reset');
  const wait = q.list.length ? Math.round((Date.now() - q.list[0].at) / 60000) : 0;
  const goTv = async () => { setTv(true); try { await tvRef.current?.requestFullscreen(); } catch { /* */ } };
  return (
    <div className="cr-grid">
      <Panel t="Give a ticket" d="On the counter tablet: the customer gets a number and waits for the TV.">
        <label className="cr-f">Name (optional)<input className="cr-in" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <span className="cr-seg" style={{ marginTop: 10, flexWrap: 'wrap' }}>{['Buy parts', 'Repair', 'Collect', 'Trade order'].map((x) => <button key={x} type="button" className={why === x ? 'on' : ''} onClick={() => setWhy(x)}>{x}</button>)}</span>
        <button type="button" className="cr-btn" style={{ marginTop: 12, width: '100%' }} onClick={take}>Ticket {q.next}</button>
      </Panel>
      <Panel t="Counter" d={q.list.length + ' waiting · longest ' + wait + ' min · ' + q.served + ' served today'} right={<button type="button" className="cr-btn ghost sm" onClick={goTv}>Shop TV ↗</button>}>
        <div className="cr-now"><small>NOW SERVING</small><b>{q.serving ?? '·'}</b></div>
        <div className="cr-row"><button type="button" className="cr-btn" disabled={!q.list.length} onClick={call}>Call next{q.list[0] ? ' · ' + q.list[0].n : ''}</button>{can(me, 'staff') ? <button type="button" className="cr-btn ghost" onClick={reset}>Reset</button> : null}</div>
      </Panel>
      <Panel t="Waiting">{q.list.length ? q.list.map((x) => <div key={x.n} className="cr-li"><Badge t={String(x.n)} tone="y" /><span>{x.name || 'Walk-in'} · {x.why}</span><small>{Math.round((Date.now() - x.at) / 60000)} min</small></div>) : <small className="cr-muted">Nobody waiting.</small>}</Panel>
      <div ref={tvRef} className={'cr-tv' + (tv ? ' on' : '')} onClick={() => { setTv(false); if (document.fullscreenElement) document.exitFullscreen(); }}>
        <img src="/assets/se-logo-320.webp" alt="" /><small>NOW SERVING</small><b>{q.serving ?? '·'}</b>
        <div className="cr-tv-next">{q.list.slice(0, 5).map((x) => <span key={x.n}>{x.n}</span>)}</div>
        <em>Sam Electronics · Al Murar, Deira · tap to close</em>
      </div>
    </div>
  );
}

// ── 4.4 Warranty & returns: claims with supplier batch, outcome, and the faulty rate per supplier ───────────────
type Claim = { id: string; no: string; part: string; supplier: string; batch: string; ref: string; reason: string; status: 'Received' | 'Testing' | 'Replaced' | 'Refunded' | 'Rejected'; at: number; by: string };
export function Claims({ me }: P) {
  const [rows, setRows] = useSetting<Claim[]>('cr-claims', []), list = useCatalog();
  const blank = (): Claim => ({ id: 'c' + Date.now(), no: 'W-' + String(1001 + rows.length), part: '', supplier: '', batch: '', ref: '', reason: 'Not working', status: 'Received', at: Date.now(), by: me.name });
  const [ed, setEd] = useState<Claim | null>(null);
  const save = (c: Claim) => { setRows(rows.some((x) => x.id === c.id) ? rows.map((x) => (x.id === c.id ? c : x)) : [c, ...rows], c.no + ' · ' + c.status); setEd(null); };
  const sup = useMemo(() => { const m = new Map<string, number>(); rows.filter((r) => r.status !== 'Rejected').forEach((r) => m.set(r.supplier || 'Unknown', (m.get(r.supplier || 'Unknown') || 0) + 1)); return [...m.entries()].map(([n, v]) => ({ n, v })).sort((a, b) => b.v - a.v); }, [rows]);
  const ST: Claim['status'][] = ['Received', 'Testing', 'Replaced', 'Refunded', 'Rejected'];
  return (
    <div className="cr-grid">
      <Panel t="Warranty claims & returns" d="Every returned part with its supplier batch, so faulty batches show up early." className="span2" right={<span className="cr-row" style={{ marginTop: 0 }}><button type="button" className="cr-btn ghost sm" onClick={() => csv('claims', [['No', 'Date', 'Part', 'Supplier', 'Batch', 'Order/Job', 'Reason', 'Status'], ...rows.map((r) => [r.no, new Date(r.at).toISOString().slice(0, 10), r.part, r.supplier, r.batch, r.ref, r.reason, r.status])])}>Export CSV</button><button type="button" className="cr-btn sm" onClick={() => setEd(blank())}>New claim</button></span>}>
        <Table rows={rows} onRow={(r) => setEd(r)} empty="No claims yet." search={(r) => r.no + ' ' + r.part + ' ' + r.supplier + ' ' + r.batch + ' ' + r.ref} cols={[{ k: 'no', l: 'Claim', get: (r) => <b className="mono">{r.no}</b> }, { k: 'p', l: 'Part', get: (r) => r.part }, { k: 's', l: 'Supplier · batch', get: (r) => <span>{r.supplier}<small className="cr-muted"> · {r.batch}</small></span> }, { k: 'r', l: 'Reason', get: (r) => r.reason }, { k: 'st', l: 'Status', get: (r) => <Badge t={r.status} tone={r.status === 'Rejected' ? 'r' : r.status === 'Received' || r.status === 'Testing' ? 'y' : 'g'} /> }, { k: 'd', l: 'Date', get: (r) => when(r.at), sort: (r) => -r.at }]} />
      </Panel>
      <Panel t="Faulty parts per supplier" d="Accepted claims (not rejected)">{sup.length ? <HBars rows={sup} fmt={(v) => String(v)} c="#D14B4B" /> : <small className="cr-muted">Appears as claims come in.</small>}</Panel>
      {ed ? <div className="cr-modal" onClick={() => setEd(null)}><div className="cr-panel cr-modal-in" onClick={(e) => e.stopPropagation()}>
        <header><h3>{ed.no}</h3></header>
        <div className="cr-form2">
          <label className="cr-f">Part<input className="cr-in" list="cr-parts" value={ed.part} onChange={(e) => setEd({ ...ed, part: e.target.value })} /></label>
          <datalist id="cr-parts">{list.slice(0, 400).map((p) => <option key={p.id} value={p.title} />)}</datalist>
          <label className="cr-f">Supplier<input className="cr-in" value={ed.supplier} onChange={(e) => setEd({ ...ed, supplier: e.target.value })} /></label>
          <label className="cr-f">Batch / delivery no.<input className="cr-in" value={ed.batch} onChange={(e) => setEd({ ...ed, batch: e.target.value })} /></label>
          <label className="cr-f">Order or job no.<input className="cr-in" value={ed.ref} onChange={(e) => setEd({ ...ed, ref: e.target.value })} /></label>
          <label className="cr-f">Reason<select className="cr-in" value={ed.reason} onChange={(e) => setEd({ ...ed, reason: e.target.value })}>{['Not working', 'Touch fault', 'Display lines or spots', 'Battery drains fast', 'Wrong part', 'Damaged in transit', 'Other'].map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="cr-f">Status<select className="cr-in" value={ed.status} onChange={(e) => setEd({ ...ed, status: e.target.value as Claim['status'] })}>{ST.map((x) => <option key={x}>{x}</option>)}</select></label>
        </div>
        <div className="cr-row" style={{ padding: '0 18px 18px' }}><button type="button" className="cr-btn" disabled={!ed.part.trim()} onClick={() => save(ed)}>Save</button><button type="button" className="cr-btn ghost" onClick={() => setEd(null)}>Cancel</button></div>
      </div></div> : null}
    </div>
  );
}

// ── 4.20 Calendar: repairs, tasks and warranty claims on one month view ────────────────────────────────────────
export function Calendar({ go }: P) {
  const [jobs] = useSetting<Job[]>('repair-jobs', []), [tasks] = useSetting<Task[]>('cr-tasks', []), [claims] = useSetting<Claim[]>('cr-claims', []);
  const [m, setM] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const first = (m.getDay() + 6) % 7, days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate(), today = dkey(Date.now());
  const ev = useMemo(() => { const e = new Map<string, { t: string; k: string; go: string }[]>(); const put = (t: number, x: { t: string; k: string; go: string }) => { const k = dkey(t); e.set(k, [...(e.get(k) || []), x]); };
    jobs.forEach((j) => put(j.due || j.at, { t: j.no + ' ' + j.model, k: 'rep', go: 'repairs' })); tasks.filter((x) => x.col !== 'done').forEach((x) => put(x.at, { t: x.t, k: 'task', go: 'tasks' })); claims.forEach((c) => put(c.at, { t: c.no + ' ' + c.part, k: 'claim', go: 'claims' })); return e; }, [jobs, tasks, claims]);
  const cells = Array.from({ length: Math.ceil((first + days) / 7) * 7 }, (_, i) => { const d = i - first + 1; return d >= 1 && d <= days ? d : null; });
  return (
    <div className="cr-grid">
      <Panel t={m.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} className="span3" right={<span className="cr-seg"><button type="button" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))}>←</button><button type="button" onClick={() => { const d = new Date(); setM(new Date(d.getFullYear(), d.getMonth(), 1)); }}>Today</button><button type="button" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))}>→</button></span>}>
        <div className="cr-cal">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <b key={d}>{d}</b>)}
          {cells.map((d, i) => { const k = d ? dkey(new Date(m.getFullYear(), m.getMonth(), d, 12).getTime() - 4 * 36e5) : '', list = d ? ev.get(k) || [] : []; return (
            <div key={i} className={'cr-day' + (!d ? ' off' : '') + (k === today ? ' now' : '')}>{d ? <small>{d}</small> : null}{list.slice(0, 3).map((x, j) => <button key={j} type="button" className={'cr-ev ' + x.k} onClick={() => go(x.go)} title={x.t}>{x.t}</button>)}{list.length > 3 ? <small className="cr-more">+{list.length - 3}</small> : null}</div>); })}
        </div>
        <div className="ch-leg" style={{ marginTop: 10 }}><span><i style={{ background: '#F7C032' }} />Repairs</span><span><i style={{ background: '#3A7BD5' }} />Tasks</span><span><i style={{ background: '#D14B4B' }} />Warranty claims</span></div>
      </Panel>
    </div>
  );
}
