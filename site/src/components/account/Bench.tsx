'use client';
// P3 · MY BENCH, the customer's account: overview, orders (with their status steps), cart & saved, stars & alerts,
// points & membership card, company profiles (on top of the personal one: details and locations), My devices, Samsoom
// chats, messages with the team (live chat), and profile & settings. Sections are in the link (#orders, #companies…).
import React, { useEffect, useMemo, useState } from 'react';
import { backend, type Company, type Order, type Thread, type Message, type User } from '@/lib/backend';
import { aed, byId, data, type Product } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { T } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';
import MemberCard, { LEVELS } from './MemberCard';

const NAV: [string, string, string][] = [
  ['overview', 'Overview', 'M3 12l9-8 9 8v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  ['orders', 'Orders', 'M4 7h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8zM8 7a4 4 0 0 1 8 0'],
  ['saved', 'Cart, saved & stars', 'M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 16.8 6.1 20.1l1.3-6.6L2.5 8.9l6.6-.8z'],
  ['points', 'Points & card', 'M3 6h18v12H3zM3 10h18'],
  ['companies', 'Companies', 'M3 21V7l6-4 6 4v14M15 21V11h6v10M7 9h4M7 13h4M7 17h4'],
  ['devices', 'My devices', 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2'],
  ['chats', 'Samsoom chats', 'M4 5h16v11H8l-4 4z'],
  ['messages', 'Messages', 'M3 6l9 6 9-6M3 6h18v12H3z'],
  ['profile', 'Profile & settings', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'],
];
const STEPS = ['New', 'Quoted', 'Confirmed', 'Ready', 'Collected / Shipped'];
const KINDS: [Company['kind'], string][] = [['repair-shop', 'Repair shop'], ['trader', 'Trader'], ['exporter', 'Exporter'], ['retailer', 'Retailer'], ['other', 'Other']];
const Ico = ({ d }: { d: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"><path d={d} /></svg>;
type Chat = { id: string; title: string; msgs: { t: string; me: boolean }[]; at: number };

export default function Bench({ me, refresh }: { me: User; refresh: () => void }) {
  const [sec, setSec] = useState('overview'), [orders, setOrders] = useState<Order[]>([]), [cos, setCos] = useState<Company[]>([]), [threads, setThreads] = useState<Thread[]>([]);
  const st = useStore();
  useEffect(() => { const h = () => setSec((location.hash.slice(1) || 'overview')); h(); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);
  const load = () => { backend.myOrders().then(setOrders); backend.companies().then(setCos); backend.threads().then(setThreads); };
  useEffect(load, []);
  const go = (s: string) => { history.replaceState(null, '', '#' + s); setSec(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const first = me.name.split(' ')[0] || me.name;
  const spent = orders.reduce((a, o) => a + o.total, 0), pts = me.points || Math.round(spent);
  const lv = me.card ? LEVELS[me.card.kind] : LEVELS.circuit, NEXT = [1000, 5000, 15000, 40000], level = NEXT.filter((n) => pts >= n).length;

  return (
    <div className="bn-wrap sp-wrap">
      <aside className="bn-nav">
        <div className="bn-me"><span className="bn-av">{(me.name || me.email).slice(0, 1).toUpperCase()}</span><span><b>{me.name}</b><small>{me.email}</small>{me.tradeApproved ? <span className="sp-tag ok">{T('Trade approved')}</span> : me.kind === 'wholesale' ? <span className="sp-tag y">{T('Trade: pending')}</span> : null}</span></div>
        <nav>{NAV.map(([id, l, d]) => <button key={id} type="button" className={sec === id ? 'on' : ''} onClick={() => go(id)}><Ico d={d} /><span>{T(l)}</span>{id === 'orders' && orders.length ? <small>{orders.length}</small> : id === 'saved' && st.cart.length ? <small>{st.cart.length}</small> : id === 'messages' && threads.some((t) => t.status === 'waiting') ? <small className="dot" /> : null}</button>)}</nav>
        <button type="button" className="bn-out" onClick={async () => { await backend.signOut(); refresh(); }}>{T('Sign out')}</button>
      </aside>

      <div className="bn-main" key={sec}>
        {sec === 'overview' ? (
          <>
            <div className="bn-hello">
              <div><span className="sp-eb">{T('MY BENCH')}</span><h1 className="sp-h2">{T('Hello')}, {first}.</h1><p className="sp-p">{T('Everything you keep with us, in one place.')}</p></div>
              <LiveSam size={110} mood="idle" play="wave" />
            </div>
            <div className="bn-stats">
              {([['Orders', orders.length, 'orders'], ['In your cart', st.cart.reduce((a, l) => a + l.qty, 0), 'saved'], ['Stars', st.favs.length, 'saved'], ['Points', pts, 'points']] as [string, number, string][]).map(([l, n, s]) => <button key={l} type="button" className="bn-stat" onClick={() => go(s)}><b>{n.toLocaleString('en-US')}</b><small>{T(l)}</small></button>)}
            </div>
            <div className="sp-grid sp-g2">
              <div className="sp-card"><div className="bn-ch"><h3 className="sp-h3">{T('Latest order')}</h3><button type="button" className="shop-clear" onClick={() => go('orders')}>{T('All orders')}</button></div>{orders[0] ? <OrderRow o={orders[0]} /> : <Empty t="No orders yet" a="Go to the shop" h="/shop" />}</div>
              <div className="sp-card bn-cardbox">{me.card ? <MemberCard kind={me.card.kind} name={me.name} no={me.card.no} level={me.card.level} /> : <><h3 className="sp-h3">{T('Your membership card')}</h3><p className="sp-p">{T('Connect your Sam Circuit, Grid or Circle card to collect points and see your level here.')}</p><button type="button" className="sp-btn sm" onClick={() => go('points')}>{T('Connect a card')}</button></>}</div>
            </div>
            <div className="bn-quick">
              {([['Find My Part', () => window.dispatchEvent(new CustomEvent('se:fmp', { detail: {} }))], ['Book a repair', () => (location.href = '/repair')], ['Ask Samsoom', () => (location.href = '/samsoom')], ['Message the team', () => go('messages')], [me.tradeApproved ? 'Trade prices are on' : 'Apply for trade prices', () => (location.href = '/wholesale#apply')]] as [string, () => void][]).map(([l, f]) => <button key={l} type="button" className="sp-chip" onClick={f}>{T(l)}</button>)}
            </div>
          </>
        ) : sec === 'orders' ? (
          <Sec t="Orders" d="Every order, with its status. We confirm stock and price on WhatsApp before you pay.">
            {orders.length ? orders.map((o) => <div key={o.id} className="sp-card"><OrderRow o={o} full /></div>) : <Empty t="No orders yet" a="Go to the shop" h="/shop" />}
          </Sec>
        ) : sec === 'saved' ? (
          <Sec t="Cart, saved & stars" d="Your cart, the parts you saved for later, your stars and your price & stock alerts.">
            <List title="In your cart" ids={st.cart.map((l) => l.id)} act={['Checkout', () => (location.href = '/cart')]} />
            <List title="Saved for later" ids={st.saved} each={['Move to cart', (id) => store.add(id)]} />
            <List title="Stars" ids={st.favs} each={['Remove star', (id) => store.fav(id)]} />
            <List title="Price & stock alerts" ids={st.alerts} each={['Stop alert', (id) => store.alert(id)]} note="We will message you when the price drops or stock is back (e-mail alerts start when the database is connected)." />
          </Sec>
        ) : sec === 'points' ? (
          <Points me={me} pts={pts} level={level} lv={lv} refresh={refresh} />
        ) : sec === 'companies' ? (
          <Companies me={me} cos={cos} reload={load} />
        ) : sec === 'devices' ? (
          <Devices />
        ) : sec === 'chats' ? (
          <Chats />
        ) : sec === 'messages' ? (
          <Messages me={me} threads={threads} reload={load} />
        ) : (
          <Profile me={me} refresh={refresh} />
        )}
      </div>
    </div>
  );
}

function Sec({ t, d, children, right }: { t: string; d?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return <section className="bn-sec"><div className="bn-sh"><div><h2 className="sp-h2">{T(t)}</h2>{d ? <p className="sp-p">{T(d)}</p> : null}</div>{right}</div><div className="bn-body">{children}</div></section>;
}
function Empty({ t, a, h }: { t: string; a?: string; h?: string }) {
  return <div className="sp-empty bn-empty"><LiveSam size={72} mood="think" /><b>{T(t)}</b>{a ? <a className="sp-btn sm" href={h}>{T(a)}</a> : null}</div>;
}
function OrderRow({ o, full }: { o: Order; full?: boolean }) {
  const k = Math.max(0, STEPS.indexOf(o.status));
  return (
    <div className="bn-order">
      <div className="bn-oh"><b>{o.no}</b><span className={'sp-tag' + (o.status === 'Cancelled' ? ' r' : k >= 4 ? ' ok' : ' y')}>{T(o.status)}</span><small>{new Date(o.createdAt).toLocaleDateString()}</small><b className="bn-ot">{aed(o.total, false)}</b></div>
      <div className="bn-steps">{STEPS.map((s, i) => <span key={s} className={i <= k ? 'on' : ''}><i />{full ? <small>{T(s)}</small> : null}</span>)}</div>
      {full ? <ul className="bn-ol">{o.lines.map((l) => <li key={l.id}>{l.qty} × {l.title} · {l.grade}<b>{aed(l.unit * l.qty, false)}</b></li>)}<li className="tot">{T('VAT 5%')} {aed(o.vat, false)} · {T('Delivery')}: {T(o.delivery)}</li></ul> : null}
      {full ? <span className="sp-acts"><a className="sp-btn sm wa" href={'https://wa.me/971503420015?text=' + encodeURIComponent('Hi Sam Electronics, about my order ' + o.no)} target="_blank" rel="noopener noreferrer">{T('Ask about this order')}</a><button type="button" className="sp-btn sm ghost" onClick={() => o.lines.forEach((l) => byId(l.id) && store.add(l.id, l.qty))}>{T('Order again')}</button></span> : null}
    </div>
  );
}
function List({ title, ids, act, each, note }: { title: string; ids: string[]; act?: [string, () => void]; each?: [string, (id: string) => void]; note?: string }) {
  const ps = ids.map(byId).filter(Boolean) as Product[];
  return (
    <div className="sp-card bn-list">
      <div className="bn-ch"><h3 className="sp-h3">{T(title)} <small className="sp-muted">· {ps.length}</small></h3>{act && ps.length ? <button type="button" className="sp-btn sm" onClick={act[1]}>{T(act[0])}</button> : null}</div>
      {note ? <small className="sp-muted">{T(note)}</small> : null}
      {ps.length ? <div className="bn-items">{ps.map((p) => <div key={p.id} className="bn-item"><a href={'/shop?p=' + p.id}><img src={p.img} alt="" /></a><span><a href={'/shop?p=' + p.id}><b>{p.title}</b></a><small>{p.gradeName} · {aed(p.price)}</small></span>{each ? <button type="button" className="shop-clear" onClick={() => each[1](p.id)}>{T(each[0])}</button> : null}</div>)}</div> : <small className="sp-muted">{T('Nothing here yet.')}</small>}
    </div>
  );
}
function Points({ me, pts, level, lv, refresh }: { me: User; pts: number; level: number; lv: string[]; refresh: () => void }) {
  const [kind, setKind] = useState<'circuit' | 'grid' | 'circle'>(me.card?.kind || 'circuit'), [no, setNo] = useState(''), [err, setErr] = useState('');
  const NEXT = [0, 1000, 5000, 15000, 40000], nxt = NEXT[level + 1], pct = nxt ? ((pts - NEXT[level]) / (nxt - NEXT[level])) * 100 : 100;
  const link = async (e: React.FormEvent) => { e.preventDefault(); const r = await backend.linkCard(kind, no); if (r.ok) { setErr(''); refresh(); } else setErr(T(r.error)); };
  return (
    <Sec t="Points & card" d="AED 1 = 1 point on every part and repair. Your level rises as your points do.">
      <div className="bn-pts">
        <MemberCard kind={me.card?.kind || 'circuit'} name={me.name} no={me.card?.no || 'SC ••• ••• ••••'} level={me.card ? me.card.level : Math.min(level, 4)} ghost={!me.card} />
        <div className="sp-card">
          <span className="sp-eb">{T('YOUR POINTS')}</span>
          <b className="bn-big">{pts.toLocaleString('en-US')}</b>
          <span className="bn-lv"><b>{T(lv[Math.min(level, lv.length - 1)] || 'Member')}</b>{nxt ? <small>{(nxt - pts).toLocaleString('en-US')} {T('points to')} {T(lv[level + 1] || '')}</small> : <small>{T('Top level reached')}</small>}</span>
          <span className="bn-bar"><i style={{ width: Math.max(4, Math.min(100, pct)) + '%' }} /></span>
          <span className="sp-sample">{T('Points are counted from your orders until the database is connected.')}</span>
        </div>
      </div>
      <form className="sp-card bn-link" onSubmit={link}>
        <h3 className="sp-h3">{me.card ? T('Change the connected card') : T('Connect your card')}</h3>
        <div className="au-kind three">{(['circuit', 'grid', 'circle'] as const).map((k) => <label key={k} className={'cart-opt' + (kind === k ? ' on' : '')}><input type="radio" checked={kind === k} onChange={() => setKind(k)} /><i /><span><b>{['Sam Circuit', 'Sam Grid', 'Sam Circle'][['circuit', 'grid', 'circle'].indexOf(k)]}</b><small>{T(['For customers', 'For suppliers', 'By invitation'][['circuit', 'grid', 'circle'].indexOf(k)])}</small></span></label>)}</div>
        <span className="cart-code"><input className="sp-in" value={no} onChange={(e) => setNo(e.target.value)} placeholder="SC 123 456 2700" required /><button type="submit" className="sp-btn sm">{T('Connect')}</button></span>
        {err ? <small style={{ color: '#9B1C20' }}>{err}</small> : null}
        <small className="sp-muted">{T('No card yet?')} <a href="/membership">{T('See the three cards and how to get one')}</a></small>
      </form>
    </Sec>
  );
}
function Companies({ me, cos, reload }: { me: User; cos: Company[]; reload: () => void }) {
  const blank = { name: '', kind: 'repair-shop' as Company['kind'], tradeLicence: '', trn: '', phone: '', email: '', website: '', locations: [] as Company['locations'], note: '' };
  const [ed, setEd] = useState<(typeof blank & { id?: string }) | null>(null), [err, setErr] = useState('');
  const save = async (e: React.FormEvent) => { e.preventDefault(); if (!ed) return; const r = await backend.saveCompany(ed); if (r.ok) { setEd(null); reload(); } else setErr(T(r.error)); };
  const loc = (i: number, k: 'label' | 'address' | 'city' | 'country', v: string) => ed && setEd({ ...ed, locations: ed.locations.map((l, j) => (j === i ? { ...l, [k]: v } : l)) });
  return (
    <Sec t="Companies" d="Add the businesses you buy for: details, trade licence, TRN and every location. Orders can be placed for a company." right={!ed ? <button type="button" className="sp-btn sm" onClick={() => setEd({ ...blank })}>+ {T('Add a company')}</button> : null}>
      {ed ? (
        <form className="sp-card bn-co" onSubmit={save}>
          <h3 className="sp-h3">{ed.id ? T('Edit company') : T('New company')}</h3>
          <div className="sp-grid sp-g2">
            <label className="sp-field">{T('Company name')}<input required value={ed.name} onChange={(e) => setEd({ ...ed, name: e.target.value })} /></label>
            <label className="sp-field">{T('Type')}<select value={ed.kind} onChange={(e) => setEd({ ...ed, kind: e.target.value as Company['kind'] })}>{KINDS.map(([k, l]) => <option key={k} value={k}>{T(l)}</option>)}</select></label>
            <label className="sp-field">{T('Trade licence number')}<input value={ed.tradeLicence} onChange={(e) => setEd({ ...ed, tradeLicence: e.target.value })} /></label>
            <label className="sp-field">{T('TRN (VAT number)')}<input value={ed.trn} onChange={(e) => setEd({ ...ed, trn: e.target.value })} /></label>
            <label className="sp-field">{T('Phone')}<input value={ed.phone} onChange={(e) => setEd({ ...ed, phone: e.target.value })} /></label>
            <label className="sp-field">{T('Company e-mail')}<input type="email" value={ed.email} onChange={(e) => setEd({ ...ed, email: e.target.value })} /></label>
            <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('Website or social page')}<input value={ed.website} onChange={(e) => setEd({ ...ed, website: e.target.value })} /></label>
          </div>
          <h4 className="bn-h4">{T('Locations')}</h4>
          {ed.locations.map((l, i) => (
            <div key={l.id} className="bn-loc">
              <input className="sp-in" value={l.label} onChange={(e) => loc(i, 'label', e.target.value)} placeholder={T('Name, e.g. Main shop')} />
              <input className="sp-in" value={l.address} onChange={(e) => loc(i, 'address', e.target.value)} placeholder={T('Address')} />
              <input className="sp-in" value={l.city} onChange={(e) => loc(i, 'city', e.target.value)} placeholder={T('City')} />
              <input className="sp-in" value={l.country} onChange={(e) => loc(i, 'country', e.target.value)} placeholder={T('Country')} />
              <button type="button" className="ss-del" onClick={() => setEd({ ...ed, locations: ed.locations.filter((_, j) => j !== i) })} aria-label={T('Remove')}>×</button>
            </div>
          ))}
          <button type="button" className="sp-chip" onClick={() => setEd({ ...ed, locations: [...ed.locations, { id: 'l' + Date.now(), label: '', address: '', city: '', country: 'United Arab Emirates', main: !ed.locations.length }] })}>+ {T('Add a location')}</button>
          {err ? <small style={{ color: '#9B1C20' }}>{err}</small> : null}
          <span className="sp-acts"><button type="submit" className="sp-btn sm">{T('Save company')}</button><button type="button" className="sp-btn sm ghost" onClick={() => setEd(null)}>{T('Cancel')}</button></span>
        </form>
      ) : null}
      {cos.length ? cos.map((c) => (
        <div key={c.id} className="sp-card bn-coc">
          <span className="bn-coi">{c.name.slice(0, 2).toUpperCase()}</span>
          <div><b className="sp-h3">{c.name}</b><small className="sp-muted">{T(KINDS.find((k) => k[0] === c.kind)?.[1] || '')}{c.trn ? ' · TRN ' + c.trn : ''}{c.tradeLicence ? ' · ' + T('Licence') + ' ' + c.tradeLicence : ''}</small>
            <span className="bn-locs">{c.locations.map((l) => <span key={l.id} className="sp-chip">📍 {l.label || l.city} · {l.city}</span>)}</span></div>
          <span className={'sp-tag' + (c.approved ? ' ok' : ' y')}>{c.approved ? T('Verified') : T('Waiting for review')}</span>
          <span className="sp-acts"><button type="button" className="sp-btn sm ghost" onClick={() => setEd({ ...blank, ...c, tradeLicence: c.tradeLicence || '', trn: c.trn || '', phone: c.phone || '', email: c.email || '', website: c.website || '', note: c.note || '' })}>{T('Edit')}</button><button type="button" className="shop-clear" onClick={async () => { await backend.removeCompany(c.id); reload(); }}>{T('Remove')}</button></span>
        </div>
      )) : !ed ? <Empty t="No companies yet" /> : null}
      {!me.tradeApproved ? <div className="sp-note">{T('Buying for a business? Add your company, then apply for trade prices: once approved you see both prices in the shop.')} <a href="/wholesale#apply">{T('Apply for trade prices')}</a></div> : null}
    </Sec>
  );
}
function Devices() {
  const st = useStore(), D = data(), [q, setQ] = useState('');
  const found = useMemo(() => (D && q.trim().length > 1 ? D.models.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : []), [q, D]);
  return (
    <Sec t="My devices" d="The phones you fix or own. The shop marks every part that fits them, and Find My Part opens on them.">
      <div className="sp-card">
        <input className="sp-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Add a device: type a model, e.g. Galaxy A54')} />
        <div className="bn-found">{found.map((m) => <button key={m.id} type="button" className="sp-chip" onClick={() => { store.device({ model_id: m.id, name: m.name }); setQ(''); }}>+ {m.name}</button>)}</div>
      </div>
      <div className="bn-devs">{st.devices.length ? st.devices.map((d) => (
        <div key={d.model_id} className="sp-card bn-dev">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></svg>
          <b>{d.name}</b>
          <span className="sp-acts"><a className="sp-btn sm" href={'/shop?model=' + d.model_id}>{T('Parts for it')}</a><button type="button" className="shop-clear" onClick={() => store.device(d)}>{T('Remove')}</button></span>
        </div>
      )) : <Empty t="No devices yet" />}</div>
    </Sec>
  );
}
function Chats() {
  const [list, setList] = useState<Chat[]>([]);
  useEffect(() => { try { setList(JSON.parse(localStorage.getItem('se-chats') || '[]')); } catch { /* */ } }, []);
  return (
    <Sec t="Samsoom chats" d="Every conversation you had with Samsoom on this device. Open one to carry on." right={<a className="sp-btn sm" href="/samsoom">{T('New chat')}</a>}>
      {list.length ? list.map((c) => (
        <a key={c.id} className="sp-card bn-chat" href={'/samsoom?c=' + c.id}>
          <span className="bn-chs"><LiveSam size={40} mood="idle" /></span>
          <span><b>{c.title}</b><small>{c.msgs.length} {T('messages')} · {new Date(c.at).toLocaleString()}</small><em>{c.msgs[c.msgs.length - 1]?.t.slice(0, 120)}</em></span>
        </a>
      )) : <Empty t="No chats yet" a="Ask Samsoom" h="/samsoom" />}
    </Sec>
  );
}
function Messages({ me, threads, reload }: { me: User; threads: Thread[]; reload: () => void }) {
  const [open, setOpen] = useState<string | null>(null), [msgs, setMsgs] = useState<Message[]>([]), [text, setText] = useState(''), [topic, setTopic] = useState('Stock question');
  useEffect(() => { if (open) backend.messages(open).then(setMsgs); }, [open]);
  const send = async (e: React.FormEvent) => { e.preventDefault(); if (!text.trim()) return; const r = await backend.send({ thread: open || undefined, name: me.name, email: me.email, topic, text }); if (r.ok) { setText(''); setOpen(r.data.thread); backend.messages(r.data.thread).then(setMsgs); reload(); } };
  return (
    <Sec t="Messages" d="Write to the team here: they answer from the Control Room during opening hours, and you get an e-mail when they do.">
      <div className="bn-msg">
        <div className="bn-th">
          <button type="button" className={'bn-tt new' + (!open ? ' on' : '')} onClick={() => { setOpen(null); setMsgs([]); }}>+ {T('New message')}</button>
          {threads.map((t) => <button key={t.id} type="button" className={'bn-tt' + (open === t.id ? ' on' : '')} onClick={() => setOpen(t.id)}><b>{T(t.topic)}</b><small>{t.last.slice(0, 60)}</small><span className={'sp-tag' + (t.status === 'waiting' ? ' ok' : '')}>{t.status === 'waiting' ? T('Answered') : t.status === 'closed' ? T('Closed') : T('Open')}</span></button>)}
        </div>
        <div className="bn-conv">
          <div className="bn-ms">
            {!open ? <div className="sp-empty"><LiveSam size={80} mood="idle" play="wave" /><b>{T('How can the team help?')}</b><span>{T('Pick a topic and write your message.')}</span></div> : msgs.map((m) => <div key={m.id} className={'bn-m ' + m.from}><small>{m.from === 'staff' ? m.name + ' · Sam Electronics' : T('You')}</small><p>{m.text}</p><small>{new Date(m.at).toLocaleString()}</small></div>)}
          </div>
          <form className="bn-send" onSubmit={send}>
            {!open ? <select className="sp-in" value={topic} onChange={(e) => setTopic(e.target.value)}>{['Stock question', 'Order question', 'Repair', 'Trade account', 'Shipping', 'Something else'].map((t) => <option key={t} value={t}>{T(t)}</option>)}</select> : null}
            <input className="sp-in" value={text} onChange={(e) => setText(e.target.value)} placeholder={T('Write a message…')} />
            <button type="submit" className="sp-btn sm">{T('Send')}</button>
          </form>
        </div>
      </div>
    </Sec>
  );
}
function Profile({ me, refresh }: { me: User; refresh: () => void }) {
  const [f, setF] = useState({ name: me.name, phone: me.phone || '', contactEmail: me.contactEmail || '', country: me.country || '', city: me.city || '', lang: me.lang || 'en' }), [ok, setOk] = useState('');
  const save = async (e: React.FormEvent) => { e.preventDefault(); const r = await backend.updateMe(f); if (r.ok) { setOk(T('Saved.')); refresh(); window.setTimeout(() => setOk(''), 2000); } };
  return (
    <Sec t="Profile & settings" d="Your details, how we reach you, and your language.">
      <form className="sp-card" onSubmit={save}>
        <div className="sp-grid sp-g2">
          <label className="sp-field">{T('Full name')}<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label className="sp-field">{T('Sign-in e-mail')}<input value={me.email} disabled /></label>
          <label className="sp-field">{T('Phone (WhatsApp)')}<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
          <label className="sp-field">{T('Contact e-mail (if different)')}<input type="email" value={f.contactEmail} onChange={(e) => setF({ ...f, contactEmail: e.target.value })} /></label>
          <label className="sp-field">{T('Country')}<input value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></label>
          <label className="sp-field">{T('City')}<input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></label>
        </div>
        <span className="sp-acts" style={{ marginTop: 16 }}><button type="submit" className="sp-btn sm">{T('Save changes')}</button>{ok ? <small style={{ color: '#157A4A' }}>{ok}</small> : null}</span>
      </form>
      <div className="sp-card bn-danger"><b>{T('Password')}</b><small className="sp-muted">{T('Forgot it or want a new one? We e-mail you a reset link.')}</small><button type="button" className="sp-btn sm ghost" onClick={() => backend.resetPassword(me.email)}>{T('Send reset link')}</button></div>
      <div className="sp-card bn-danger"><b>{T('Your data')}</b><small className="sp-muted">{T('Ask us for a copy of your data, or to delete your account, at any time.')}</small><a className="sp-btn sm ghost" href="/contact#privacy">{T('Privacy requests')}</a></div>
    </Sec>
  );
}
