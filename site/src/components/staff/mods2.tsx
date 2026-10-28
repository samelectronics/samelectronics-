'use client';
// P5 · Control Room: Orders (with tax invoices), Repairs board, Customers, Approvals, Inbox (live chat with visitors).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { backend, type Application, type Message, type Order, type Staff, type Thread, type User } from '@/lib/backend';
import { data, products, repairFee } from '@/lib/catalog';
import { Panel, Kpi, Table, Drawer, Badge, csv, can, money, when, useSetting } from './kit';

type P = { me: Staff; go: (m: string) => void };
const FLOW: Order['status'][] = ['New', 'Quoted', 'Confirmed', 'Ready', 'Collected / Shipped', 'Closed'];

// ── Orders ───────────────────────────────────────────────────────────────────────────────────────────────────
export function invoice(o: Order, trn: string) {
  const w = window.open('', '_blank', 'width=820,height=1000'); if (!w) return;
  const rows = o.lines.map((l) => `<tr><td>${l.qty}</td><td>${l.title} · ${l.grade}<br><small>${l.id}</small></td><td class=n>${l.unit.toFixed(2)}</td><td class=n>${(l.unit * l.qty).toFixed(2)}</td></tr>`).join('');
  w.document.write(`<!doctype html><html><head><meta charset=utf-8><title>Tax invoice ${o.no}</title><style>body{font:14px/1.5 Inter,Arial,sans-serif;color:#26282B;margin:40px}h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}th{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888}.n{text-align:right}.top{display:flex;justify-content:space-between;border-bottom:4px solid #F7C032;padding-bottom:16px}.tot td{font-weight:700}small{color:#888}</style></head><body>
  <div class=top><div><h1>SAM ELECTRONICS L.L.C</h1><div>Al Murar, Deira, Dubai, UAE<br>+971 4 273 3031 · samelectronics.uae@gmail.com<br>TRN: ${trn || '— (to be added in Settings)'}</div></div><div style="text-align:right"><h1>TAX INVOICE</h1><div>${o.no}<br>${new Date(o.createdAt).toLocaleDateString('en-GB')}</div></div></div>
  <p><b>Bill to:</b> ${o.name}<br>${o.email} · ${o.phone}${o.address ? '<br>' + o.address + ', ' + (o.country || '') : ''}</p>
  <table><thead><tr><th>Qty</th><th>Item</th><th class=n>Unit (AED)</th><th class=n>Amount (AED)</th></tr></thead><tbody>${rows}
  <tr><td></td><td>Delivery</td><td></td><td class=n>${o.ship.toFixed(2)}</td></tr>
  <tr><td></td><td>Subtotal (excl. VAT)</td><td></td><td class=n>${(o.sub + o.ship).toFixed(2)}</td></tr>
  <tr><td></td><td>VAT 5%</td><td></td><td class=n>${o.vat.toFixed(2)}</td></tr>
  <tr class=tot><td></td><td>Total (AED)</td><td></td><td class=n>${o.total.toFixed(2)}</td></tr></tbody></table>
  <small>Warranty and returns: samelectronics website → Legal. Thank you for your business.</small><script>setTimeout(()=>print(),300)</script></body></html>`);
  w.document.close();
}
export function Orders({ me }: P) {
  const [orders, setOrders] = useState<Order[]>([]), [tab, setTab] = useState('open'), [sel, setSel] = useState<Order | null>(null), [trn] = useSetting('business', { trn: '' } as { trn: string });
  const load = () => backend.allOrders().then(setOrders);
  useEffect(() => { load(); }, []);
  const rows = orders.filter((o) => tab === 'all' || (tab === 'open' ? !['Collected / Shipped', 'Closed', 'Cancelled'].includes(o.status) : o.status === tab));
  const setStatus = async (o: Order, s: Order['status']) => { const r = await backend.setOrderStatus(o.id, s); if (r.ok) { setSel(r.data); load(); } };
  return (
    <div className="cr-grid">
      <div className="cr-kpis">
        {(['New', 'Quoted', 'Confirmed', 'Ready'] as const).map((s) => <Kpi key={s} l={s} v={orders.filter((o) => o.status === s).length} tone={s === 'New' ? 'y' : undefined} onClick={() => setTab(s)} />)}
        <Kpi l="Revenue (all time)" v={money(orders.filter((o) => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0))} tone="d" />
      </div>
      <div className="cr-tabs">{[['open', 'Open'], ...FLOW.map((s) => [s, s]), ['Cancelled', 'Cancelled'], ['all', 'All']].map(([k, l]) => <button key={k} type="button" className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}<small>{k === 'all' ? orders.length : k === 'open' ? orders.filter((o) => !['Collected / Shipped', 'Closed', 'Cancelled'].includes(o.status)).length : orders.filter((o) => o.status === k).length}</small></button>)}</div>
      <Panel t={rows.length + ' orders'} className="span3" right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('orders.csv', [['no', 'date', 'customer', 'email', 'phone', 'status', 'delivery', 'subtotal', 'vat', 'shipping', 'total'], ...rows.map((o) => [o.no, when(o.createdAt), o.name, o.email, o.phone, o.status, o.delivery, o.sub, o.vat, o.ship, o.total])])}>Export CSV</button>}>
        <Table rows={rows} onRow={setSel} search={(o) => o.no + ' ' + o.name + ' ' + o.email + ' ' + o.phone} empty="No orders here." cols={[
          { k: 'no', l: 'Order', get: (o) => <b className="mono">{o.no}</b>, sort: (o) => o.createdAt }, { k: 'd', l: 'Placed', get: (o) => when(o.createdAt), sort: (o) => o.createdAt },
          { k: 'c', l: 'Customer', get: (o) => <span className="cr-two"><b>{o.name}</b><small>{o.phone}</small></span>, sort: (o) => o.name },
          { k: 'i', l: 'Items', get: (o) => o.lines.reduce((a, l) => a + l.qty, 0), cls: 'num' }, { k: 'dl', l: 'Delivery', get: (o) => o.delivery },
          { k: 's', l: 'Status', get: (o) => <Badge t={o.status} tone={o.status === 'New' ? 'y' : o.status === 'Cancelled' ? 'r' : 'g'} />, sort: (o) => FLOW.indexOf(o.status) },
          { k: 't', l: 'Total', get: (o) => money(o.total), sort: (o) => o.total, cls: 'num' }]} />
      </Panel>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? 'Order ' + sel.no : ''} wide>
        {sel ? (
          <div className="cr-od">
            <div className="cr-flow">{FLOW.map((s, i) => <button key={s} type="button" className={(FLOW.indexOf(sel.status) >= i ? 'done' : '') + (sel.status === s ? ' cur' : '')} disabled={!can(me, 'orders')} onClick={() => setStatus(sel, s)}><i>{i + 1}</i>{s}</button>)}</div>
            <div className="cr-row2">
              <div className="cr-box"><small>CUSTOMER</small><b>{sel.name}</b><span>{sel.email}</span><span>{sel.phone}</span>{sel.address ? <span>{sel.address}, {sel.country}</span> : null}{sel.note ? <em>“{sel.note}”</em> : null}</div>
              <div className="cr-box"><small>DELIVERY & PAYMENT</small><b>{sel.delivery}</b><span>Payment: {sel.pay}</span><span>Placed {when(sel.createdAt)}</span></div>
            </div>
            <table className="cr-lines"><tbody>{sel.lines.map((l) => <tr key={l.id}><td>{l.qty} ×</td><td><b>{l.title}</b> · {l.grade}<br /><small className="mono">{l.id}</small></td><td className="num">{money(l.unit * l.qty)}</td></tr>)}
              <tr><td /><td>Subtotal</td><td className="num">{money(sel.sub)}</td></tr><tr><td /><td>Delivery</td><td className="num">{money(sel.ship)}</td></tr><tr><td /><td>VAT 5%</td><td className="num">{money(sel.vat)}</td></tr><tr className="tot"><td /><td>Total</td><td className="num">{money(sel.total)}</td></tr></tbody></table>
            <div className="cr-acts">
              <a className="cr-btn wa" href={'https://wa.me/' + sel.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent('Hi ' + sel.name.split(' ')[0] + ', this is Sam Electronics about your order ' + sel.no + '.')} target="_blank" rel="noopener noreferrer">WhatsApp customer</a>
              <button type="button" className="cr-btn" onClick={() => invoice(sel, trn.trn)}>Tax invoice</button>
              {can(me, 'orders') && sel.status !== 'Cancelled' ? <button type="button" className="cr-btn danger" onClick={() => setStatus(sel, 'Cancelled')}>Cancel order</button> : null}
            </div>
            <div className="cr-hist"><small>HISTORY</small>{sel.history.map((h, i) => <span key={i}>{when(h.at)} · <b>{h.status}</b>{h.by ? ' · ' + h.by : ''}</span>)}</div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

// ── Repairs board ────────────────────────────────────────────────────────────────────────────────────────────
type Job = { id: string; no: string; name: string; phone: string; model: string; problem: string; part?: string; partPrice: number; fee: number; adjust: number; tech?: string; status: string; note?: string; at: number };
const COLS = ['Booked', 'Diagnosing', 'Waiting for part', 'Repairing', 'Testing', 'Ready', 'Collected'];
export function Repairs({ me }: P) {
  const [jobs, setJobs] = useSetting<Job[]>('repair-jobs', []), [staff, setStaff] = useState<Staff[]>([]), [ed, setEd] = useState<Job | null>(null);
  useEffect(() => { backend.staffList().then(setStaff); }, []);
  const D = data(), R = ((D as unknown as { repairs?: { id: string; name: string; cat: string | null }[] })?.repairs) || [];
  const blank = (): Job => ({ id: 'j' + Date.now(), no: 'R-' + String(1000 + jobs.length + 1), name: '', phone: '', model: '', problem: R[0]?.name || '', partPrice: 0, fee: 25, adjust: 0, status: 'Booked', at: Date.now() });
  const save = async (j: Job) => { const next = jobs.some((x) => x.id === j.id) ? jobs.map((x) => (x.id === j.id ? j : x)) : [j, ...jobs]; await setJobs(next, j.no + ' · ' + j.status); setEd(null); };
  const move = (j: Job, dir: number) => { const i = COLS.indexOf(j.status) + dir; if (i < 0 || i >= COLS.length) return; save({ ...j, status: COLS[i] }); };
  return (
    <div className="cr-grid">
      <div className="cr-filters"><span className="cr-muted">Fitting fee follows the part price: AED 25 under 100, AED 35 for 100–500, AED 45 above 500. Adjust it up or down per job.</span><span className="cr-sp" />{can(me, 'repairs') ? <button type="button" className="cr-btn y sm" onClick={() => setEd(blank())}>+ New repair job</button> : null}</div>
      <div className="cr-kanban span3">
        {COLS.map((c) => (
          <div key={c} className="cr-col"><header><b>{c}</b><small>{jobs.filter((j) => j.status === c).length}</small></header>
            {jobs.filter((j) => j.status === c).map((j) => (
              <div key={j.id} className="cr-job" onClick={() => setEd(j)}>
                <span className="cr-jt"><b className="mono">{j.no}</b><small>{when(j.at)}</small></span>
                <b>{j.model || '—'}</b><span>{j.problem}</span><small>{j.name} · {j.phone}</small>
                <span className="cr-jt"><Badge t={money(j.partPrice + j.fee + j.adjust)} tone="y" />{j.tech ? <small>🔧 {j.tech}</small> : null}</span>
                <span className="cr-jm" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => move(j, -1)} disabled={c === COLS[0]}>←</button><button type="button" onClick={() => move(j, 1)} disabled={c === COLS[COLS.length - 1]}>→</button></span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Drawer open={!!ed} onClose={() => setEd(null)} title={ed ? 'Repair ' + ed.no : ''}>{ed ? <JobForm j={ed} R={R} staff={staff} onSave={save} /> : null}</Drawer>
    </div>
  );
}
function JobForm({ j, R, staff, onSave }: { j: Job; R: { id: string; name: string; cat: string | null }[]; staff: Staff[]; onSave: (j: Job) => void }) {
  const [f, setF] = useState(j), D = data();
  const mid = D?.models.find((m) => m.name === f.model)?.id, rep = R.find((r) => r.name === f.problem);
  const parts = mid && rep?.cat ? products().filter((p) => p.model_id === mid && p.category === rep.cat) : [];
  const pick = (id: string) => { const p = parts.find((x) => x.id === id); setF({ ...f, part: id || undefined, partPrice: p ? p.price : 0, fee: p ? repairFee(p.price) : 25 }); };
  return (
    <form className="cr-form" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="cr-row2"><label>Customer<input className="cr-in" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label><label>Phone<input className="cr-in" required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label></div>
      <label>Model<input className="cr-in" list="cr-models" value={f.model} onChange={(e) => setF({ ...f, model: e.target.value })} /><datalist id="cr-models">{D?.models.map((m) => <option key={m.id} value={m.name} />)}</datalist></label>
      <label>Repair<select className="cr-in" value={f.problem} onChange={(e) => setF({ ...f, problem: e.target.value, part: undefined, partPrice: 0, fee: 25 })}>{R.map((r) => <option key={r.id}>{r.name}</option>)}</select></label>
      <label>Part used<select className="cr-in" value={f.part || ''} onChange={(e) => pick(e.target.value)}><option value="">— none / not yet —</option>{parts.map((p) => <option key={p.id} value={p.id}>{p.gradeName} · {p.makerName} · AED {p.price} ({p.stock_qty} in stock)</option>)}</select></label>
      <div className="cr-row3">
        <label>Part price<input className="cr-in" type="number" value={f.partPrice} onChange={(e) => setF({ ...f, partPrice: +e.target.value, fee: repairFee(+e.target.value) })} /></label>
        <label>Fitting fee (tier)<input className="cr-in" type="number" value={f.fee} onChange={(e) => setF({ ...f, fee: +e.target.value })} /></label>
        <label>Adjust ±<input className="cr-in" type="number" value={f.adjust} onChange={(e) => setF({ ...f, adjust: +e.target.value })} /></label>
      </div>
      <div className="cr-note">Customer pays <b>{money(f.partPrice + f.fee + f.adjust)}</b> (+5% VAT on the invoice).</div>
      <div className="cr-row2">
        <label>Technician<select className="cr-in" value={f.tech || ''} onChange={(e) => setF({ ...f, tech: e.target.value })}><option value="">—</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select></label>
        <label>Status<select className="cr-in" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{COLS.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      <label>Notes<textarea className="cr-in" rows={3} value={f.note || ''} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Passcode, condition, what the customer said…" /></label>
      <div className="cr-acts"><button type="submit" className="cr-btn y">Save job</button><a className="cr-btn wa" href={'https://wa.me/' + f.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent('Hi ' + f.name.split(' ')[0] + ', your ' + f.model + ' repair (' + f.no + ') is: ' + f.status + '. Sam Electronics')} target="_blank" rel="noopener noreferrer">Send status on WhatsApp</a></div>
    </form>
  );
}

// ── Customers ────────────────────────────────────────────────────────────────────────────────────────────────
export function Customers({ me }: P) {
  const [list, setList] = useState<User[]>([]), [orders, setOrders] = useState<Order[]>([]), [sel, setSel] = useState<User | null>(null);
  const load = () => { backend.customers().then(setList); backend.allOrders().then(setOrders); };
  useEffect(load, []);
  const spent = (u: User) => orders.filter((o) => o.email === u.email && o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0);
  return (
    <div className="cr-grid">
      <div className="cr-kpis"><Kpi l="Customers" v={list.length} tone="y" /><Kpi l="Trade approved" v={list.filter((u) => u.tradeApproved).length} /><Kpi l="Waiting for trade approval" v={list.filter((u) => u.kind === 'wholesale' && !u.tradeApproved).length} tone="r" /><Kpi l="With a card" v={list.filter((u) => u.card).length} /></div>
      <Panel t="Customer accounts" className="span3" right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('customers.csv', [['name', 'email', 'phone', 'type', 'trade', 'card', 'spent', 'joined'], ...list.map((u) => [u.name, u.email, u.phone || '', u.kind, u.tradeApproved ? 'yes' : 'no', u.card?.no || '', spent(u), when(u.createdAt)])])}>Export CSV</button>}>
        <Table rows={list} onRow={setSel} search={(u) => u.name + ' ' + u.email + ' ' + (u.phone || '')} empty="No customer accounts yet. Sign-ups on the site appear here." cols={[
          { k: 'n', l: 'Customer', get: (u) => <span className="cr-two"><b>{u.name}</b><small>{u.email}</small></span>, sort: (u) => u.name },
          { k: 'k', l: 'Type', get: (u) => (u.tradeApproved ? <Badge t="Trade" tone="g" /> : u.kind === 'wholesale' ? <Badge t="Trade · pending" tone="y" /> : <Badge t="Customer" />) },
          { k: 'v', l: 'E-mail', get: (u) => (u.verified ? '✓ confirmed' : '— not confirmed') },
          { k: 'o', l: 'Orders', get: (u) => orders.filter((o) => o.email === u.email).length, cls: 'num' },
          { k: 's', l: 'Spent', get: (u) => money(spent(u)), sort: (u) => spent(u), cls: 'num' },
          { k: 'j', l: 'Joined', get: (u) => when(u.createdAt), sort: (u) => u.createdAt }]} />
      </Panel>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? sel.name : ''}>
        {sel ? (
          <div className="cr-od">
            <div className="cr-box"><small>CONTACT</small><b>{sel.email}</b><span>{sel.phone || 'no phone'}</span><span>{sel.city || ''} {sel.country || ''}</span><span>Joined {when(sel.createdAt)}</span></div>
            <div className="cr-box"><small>TRADE PRICES</small><b>{sel.tradeApproved ? 'Approved' : sel.kind === 'wholesale' ? 'Asked for trade prices' : 'Retail customer'}</b>
              {can(me, 'approvals') || can(me, 'customers') ? <button type="button" className={'cr-btn ' + (sel.tradeApproved ? 'danger' : 'y')} onClick={async () => { const r = await backend.approveTrade(sel.id, !sel.tradeApproved); if (r.ok) { setSel(r.data); load(); await backend.log(r.data.tradeApproved ? 'trade.approve' : 'trade.revoke', sel.email); } }}>{sel.tradeApproved ? 'Remove trade prices' : 'Approve trade prices'}</button> : null}
            </div>
            <div className="cr-box"><small>CARD & POINTS</small><b>{sel.card ? sel.card.no : 'No card connected'}</b><span>{sel.points} points</span></div>
            <small>ORDERS</small>
            {orders.filter((o) => o.email === sel.email).map((o) => <div key={o.id} className="cr-li"><b className="mono">{o.no}</b><span>{when(o.createdAt)}</span><Badge t={o.status} /><b>{money(o.total)}</b></div>)}
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

// ── Approvals ────────────────────────────────────────────────────────────────────────────────────────────────
export function Approvals({ me }: P) {
  const [apps, setApps] = useState<Application[]>([]), [type, setType] = useState('all'), [sel, setSel] = useState<Application | null>(null);
  const load = () => backend.applications().then(setApps);
  useEffect(() => { load(); }, []);
  const rows = apps.filter((a) => type === 'all' || a.type === type);
  const decide = async (a: Application, s: Application['status']) => {
    await backend.setApplication(a.id, s); await backend.log('application.' + s, a.type + ' · ' + a.email);
    if (a.type === 'wholesale' && s === 'approved') { const u = (await backend.customers()).find((x) => x.email === a.email.toLowerCase()); if (u) await backend.approveTrade(u.id, true); }
    setSel(null); load();
  };
  return (
    <div className="cr-grid">
      <div className="cr-tabs">{[['all', 'All'], ['wholesale', 'Trade accounts'], ['job', 'Job applications'], ['membership', 'Cards'], ['circle', 'Sam Circle']].map(([k, l]) => <button key={k} type="button" className={type === k ? 'on' : ''} onClick={() => setType(k)}>{l}<small>{k === 'all' ? apps.filter((a) => a.status === 'new').length : apps.filter((a) => a.type === k && a.status === 'new').length}</small></button>)}</div>
      <Panel t="Applications" d="Approving a trade application also switches on trade prices for the account with the same e-mail." className="span3">
        <Table rows={rows} onRow={setSel} search={(a) => a.name + ' ' + a.email + ' ' + JSON.stringify(a.data)} empty="No applications yet." cols={[
          { k: 't', l: 'Type', get: (a) => <Badge t={a.type} tone="d" /> }, { k: 'n', l: 'Name', get: (a) => <span className="cr-two"><b>{a.name}</b><small>{a.email}</small></span> },
          { k: 'x', l: 'Details', get: (a) => <small>{Object.entries(a.data).filter(([, v]) => v).slice(0, 3).map(([k, v]) => k + ': ' + v).join(' · ')}</small> },
          { k: 's', l: 'Status', get: (a) => <Badge t={a.status} tone={a.status === 'new' ? 'y' : a.status === 'approved' ? 'g' : a.status === 'declined' ? 'r' : undefined} /> }, { k: 'd', l: 'Received', get: (a) => when(a.at), sort: (a) => a.at }]} />
      </Panel>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? sel.type + ' · ' + sel.name : ''}>
        {sel ? (
          <div className="cr-od">
            <div className="cr-box"><small>FROM</small><b>{sel.name}</b><span>{sel.email}</span><span>{sel.phone}</span></div>
            <div className="cr-box">{Object.entries(sel.data).map(([k, v]) => <span key={k}><small>{k}</small> {v || '—'}</span>)}</div>
            {can(me, 'approvals') || can(me, 'staff') ? <div className="cr-acts"><button type="button" className="cr-btn y" onClick={() => decide(sel, 'approved')}>Approve</button><button type="button" className="cr-btn" onClick={() => decide(sel, 'reviewing')}>Mark reviewing</button><button type="button" className="cr-btn danger" onClick={() => decide(sel, 'declined')}>Decline</button></div> : null}
            <small className="cr-muted">The applicant receives an e-mail automatically once e-mails are connected (Automated e-mails).</small>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

// ── Inbox (live chat) ────────────────────────────────────────────────────────────────────────────────────────
export function Inbox({ me }: P) {
  const [threads, setThreads] = useState<Thread[]>([]), [cur, setCur] = useState<string | null>(null), [msgs, setMsgs] = useState<Message[]>([]), [text, setText] = useState(''), box = useRef<HTMLDivElement>(null);
  const [canned] = useSetting<string[]>('canned-replies', ['Hi! Yes, we have it in stock. Shall I reserve it for you?', 'Let me check the stock and come back to you in a few minutes.', 'We are open today until 22:00, Al Murar, Deira.', 'Trade prices show in the shop once your trade account is approved.']);
  const load = () => backend.threads().then(setThreads);
  useEffect(() => { load(); const iv = window.setInterval(load, 5000); return () => window.clearInterval(iv); }, []);
  useEffect(() => { if (!cur) return; const l = () => backend.messages(cur).then(setMsgs); l(); const iv = window.setInterval(l, 4000); return () => window.clearInterval(iv); }, [cur]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs.length]);
  const t = threads.find((x) => x.id === cur);
  const send = async (e?: React.FormEvent, s?: string) => { e?.preventDefault(); const body = (s || text).trim(); if (!cur || !body) return; await backend.send({ thread: cur, name: me.name, text: body, from: 'staff' }); setText(''); backend.messages(cur).then(setMsgs); load(); };
  const sorted = useMemo(() => [...threads].sort((a, b) => (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1) || b.at - a.at), [threads]);
  return (
    <div className="cr-inbox">
      <div className="cr-threads">{sorted.length ? sorted.map((x) => <button key={x.id} type="button" className={(cur === x.id ? 'on ' : '') + x.status} onClick={() => setCur(x.id)}><span><b>{x.name}</b><small>{when(x.at)}</small></span><small>{x.topic}</small><em>{x.last}</em>{x.status === 'open' ? <i /> : null}</button>) : <small className="cr-muted" style={{ padding: 16 }}>No conversations yet. Messages from the website’s live chat, contact form and My Bench land here.</small>}</div>
      <div className="cr-conv">
        {t ? (
          <>
            <header><b>{t.name}</b><small>{t.email || 'no e-mail'} · {t.topic}</small><Badge t={t.status === 'open' ? 'Waiting for us' : 'Answered'} tone={t.status === 'open' ? 'y' : 'g'} /></header>
            <div className="cr-msgs" ref={box}>{msgs.map((m) => <div key={m.id} className={'cr-msg ' + m.from}><p>{m.text}</p><small>{m.name} · {when(m.at)}</small></div>)}</div>
            <div className="cr-canned">{canned.map((c) => <button key={c} type="button" onClick={() => send(undefined, c)}>{c.slice(0, 48)}{c.length > 48 ? '…' : ''}</button>)}</div>
            <form className="cr-send" onSubmit={send}><input className="cr-in" value={text} onChange={(e) => setText(e.target.value)} placeholder={'Reply as ' + me.name + '…'} /><button type="submit" className="cr-btn y">Send</button></form>
          </>
        ) : <div className="cr-empty big">Pick a conversation.</div>}
      </div>
    </div>
  );
}
