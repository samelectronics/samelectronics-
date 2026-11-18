'use client';
// Owner (18 Nov): "yes, I agree with your suggestions and love them". Samsoom's tools, opened from the composer's "+":
// Fit check (my devices), Track my order, Stock alert, Price watch, Book a repair, and the Trade list for Sam Grid holders.
// Each tool is a small form in the chat dock. The result lands in the chat as Samsoom's answer, and every request that
// needs a person (bookings, order questions, alerts, trade lists) is sent to the team's Control Room inbox at once.
import React, { useEffect, useMemo, useState } from 'react';
import { data, byId, priceText, type Product } from '@/lib/catalog';
import { lookup } from './brain2';
import { store, useStore } from '@/lib/store';
import { backend } from '@/lib/backend';
import { watchBase } from '@/lib/watch';
import { T } from '@/components/site/ui';

export type ToolKey = 'photo' | 'fit' | 'track' | 'stock' | 'price' | 'book' | 'trade';
export type ToolOut = { t: string; parts?: string[]; emote?: string; act?: string };
export const TOOLS: [ToolKey, string, string, string][] = [
  ['photo', 'Send a photo', 'Samsoom reads the model from it', '<rect x="3" y="6" width="18" height="14" rx="2.5"/><circle cx="12" cy="13" r="3.6"/><path d="M8.5 6l1.4-2.2h4.2L15.5 6"/>'],
  ['fit', 'Fit check', 'Parts that fit your phone', '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M9.5 12.5l2 2 3.5-4"/>'],
  ['track', 'Track my order', 'Where your order is now', '<path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>'],
  ['stock', 'Stock alert', 'Tell me when a part is back', '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'],
  ['price', 'Price watch', 'Tell me when the price drops', '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.4"/><path d="M12 15l3-3"/>'],
  ['book', 'Book a repair', 'Pick a day and a time at the counter', '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8.5 15l2 2 4-4"/>'],
  ['trade', 'Trade list', 'Paste a parts list, get a priced order (Sam Grid)', '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'],
];
export function ToolIcon({ k, size = 18 }: { k: ToolKey; size?: number }) {
  const d = TOOLS.find((x) => x[0] === k)?.[3] || '';
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
}

type Who = { name: string; email?: string; phone?: string; kind: string; level: number } | null;
const models = () => (data()?.models || []) as { id: string; name: string; brand_id: string }[];
const cats = () => ((data()?.categories || []) as { id: string; name: string; one: string; soon?: boolean }[]).filter((c) => !c.soon);
const label = (p: Product) => p.modelName + ' · ' + T(p.catName) + ' · ' + p.gradeName;
const ref = (pre: string) => pre + '-' + Date.now().toString(36).toUpperCase().slice(-5);
const ics = (title: string, start: Date, mins: number, where: string) => {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sam Electronics//Booking//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@samelectronics', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(start), 'DTEND:' + f(new Date(start.getTime() + mins * 60000)), 'SUMMARY:' + title, 'LOCATION:' + where, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = 'sam-electronics-repair.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};

/** a model box with the catalogue's models as suggestions */
function ModelBox({ value, set, id }: { value: string; set: (s: string) => void; id: string }) {
  const list = useMemo(() => models().map((m) => m.name), []);
  return (<><input list={id} value={value} onChange={(e) => set(e.target.value)} placeholder={T('e.g. iPhone 13 or Galaxy A54')} autoComplete="off" /><datalist id={id}>{list.slice(0, 600).map((n) => <option key={n} value={n} />)}</datalist></>);
}
/** search a part for an alert / watch */
function PartPick({ pick, set }: { pick: string; set: (id: string) => void }) {
  const [q, setQ] = useState(''), lk = q.trim().length > 2 ? lookup(q) : null;
  return (
    <div className="stl-pick">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Model and part, e.g. iPhone 13 screen')} autoFocus />
      {lk && lk.list.length ? <div className="stl-res">{lk.list.slice(0, 6).map((p) => <button key={p.id} type="button" className={pick === p.id ? 'on' : ''} onClick={() => set(p.id)}><span><b>{label(p)}</b><small>{p.makerName} · {p.stock_qty > 0 ? T('in stock') : T('out of stock')}</small></span><em>{priceText(p.price)}</em></button>)}</div> : lk ? <small className="stl-none">{T('No match yet. Add the model and the part.')}</small> : null}
    </div>
  );
}

export default function ToolPanel({ k, who, close, out, setMood }: { k: ToolKey; who: Who; close: () => void; out: (o: ToolOut) => void; setMood?: (m: string) => void }) {
  const st = useStore();
  const [model, setModel] = useState(''), [cat, setCat] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const [pick, setPick] = useState(''), [orderNo, setOrderNo] = useState('');
  const [issue, setIssue] = useState(''), [day, setDay] = useState(0), [slot, setSlot] = useState(''), [name, setName] = useState(who?.name || ''), [phone, setPhone] = useState(who?.phone || ''), [note, setNote] = useState(''), [booked, setBooked] = useState<{ ref: string; at: Date; model: string } | null>(null);
  const [list, setList] = useState('');
  useEffect(() => { if (who) { setName((n) => n || who.name); setPhone((p) => p || who.phone || ''); } }, [who]);
  useEffect(() => { if (k === 'fit' && !model && st.devices.length) setModel(st.devices[0].name); }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const team = (topic: string, text: string) => backend.send({ name: who?.name || name || T('Website visitor'), email: who?.email || undefined, topic, text: text + '\nPage: /samsoom' }).catch(() => null);

  // ── Fit check ──
  const fit = () => {
    const m = models().find((x) => x.name.toLowerCase() === model.trim().toLowerCase()) || null;
    const lk = lookup(model + ' ' + (cats().find((c) => c.id === cat)?.one || ''));
    if (!lk.model) { setErr(T('I could not find that model. Pick it from the list, or send a photo of Settings → About.')); return; }
    const mm = m || models().find((x) => x.name === lk.model);
    if (mm && !st.devices.some((d) => d.model_id === mm.id)) store.device({ model_id: mm.id, name: mm.name });
    const l = lk.list, inS = l.filter((p) => p.stock_qty > 0);
    out({ t: T('Parts that fit your') + ' ' + lk.model + (lk.cat ? ' · ' + T(cats().find((c) => c.id === lk.cat)?.name || '') : '') + ':\n• ' + T('Fits') + ': ' + T('made for this exact model, no adapters') + '\n• ' + T('In stock') + ': ' + inS.length + ' ' + T('of') + ' ' + l.length + '\n• ' + T('Saved') + ': ' + T('your phone is in My devices for next time'), parts: (inS.length ? inS : l).slice(0, 6).map((p) => p.id), emote: 'found', act: 'fmp' });
  };
  // ── Track my order ──
  const track = async () => {
    setBusy(true); setErr('');
    const mine = await backend.myOrders().catch(() => []);
    const no = orderNo.trim().toUpperCase().replace(/\s+/g, '');
    const o = no ? mine.find((x) => x.no.toUpperCase() === no || x.id.toUpperCase() === no) : mine[0];
    setBusy(false);
    if (o) {
      const steps = ['New', 'Confirmed', 'Ready', 'Collected / Shipped', 'Closed'], at = steps.indexOf(o.status);
      const next: Record<string, string> = { New: 'The team checks stock and confirms it, usually within the hour.', Quoted: 'Your quote is ready: reply on WhatsApp to confirm it.', Confirmed: 'It is being picked and tested.', Ready: o.delivery === 'pickup' ? 'Ready at the counter in Deira. Bring your order number.' : 'Packed and waiting for the courier.', 'Collected / Shipped': 'On its way, or collected.', Closed: 'Done. Thank you!', Cancelled: 'This order was cancelled. Ask the team if that is a surprise.' };
      out({ t: T('Order') + ' ' + o.no + ':\n• ' + T('Status') + ': ' + T(o.status) + (at >= 0 ? ' (' + (at + 1) + '/' + steps.length + ')' : '') + '\n• ' + T('Placed') + ': ' + new Date(o.createdAt).toLocaleDateString() + '\n• ' + T('Items') + ': ' + o.lines.reduce((a, l) => a + (l as { qty: number }).qty, 0) + '\n• ' + T('Total') + ': ' + priceText(o.total) + '\n• ' + T('Next') + ': ' + T(next[o.status] || ''), emote: 'happy' });
      return;
    }
    if (!no) { setErr(who ? T('No orders on your account yet. Type the order number from your receipt.') : T('Sign in to see your orders, or type the order number from your receipt.')); return; }
    await team('Order enquiry · ' + no, 'A customer asked Samsoom where order ' + no + ' is. It is not on their account: please reply on ' + (phone || who?.email || 'the chat') + '.');
    out({ t: T('I can not see order') + ' ' + no + ' ' + T('on this account, so I passed it to the team. They will reply with its status shortly.'), emote: 'think', act: 'whatsapp' });
  };
  // ── Stock alert / Price watch ──
  const watch = async (kind: 'stock' | 'price') => {
    const p = byId(pick); if (!p) return;
    if (!st.alerts.includes(p.id)) store.alert(p.id);
    watchBase(p.id, kind);
    await team(kind === 'stock' ? 'Stock alert · ' + p.modelName : 'Price watch · ' + p.modelName, (kind === 'stock' ? 'Wants to know when this is back: ' : 'Watching the price of: ') + label(p) + ' (' + p.id + ') · now ' + priceText(p.price) + ', stock ' + p.stock_qty);
    out({ t: (kind === 'stock' ? (p.stock_qty > 0 ? T('Good news: it is in stock right now. I will still tell you if it runs out and comes back.') : T('Done. I will ring the bell the moment it is back in stock.')) : T('Done. I will ring the bell when the price drops below') + ' ' + priceText(p.price) + '.') + '\n• ' + T('Part') + ': ' + label(p) + '\n• ' + T('Where') + ': ' + T('the bell at the top, and My Bench → Alerts'), parts: [p.id], emote: 'happy' });
  };
  // ── Book a repair ──
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); d.setHours(0, 0, 0, 0); return d; });
  const SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30'];
  const slotOk = (s: string) => { if (day) return true; const [h, m] = s.split(':').map(Number), n = new Date(); return h * 60 + m > n.getHours() * 60 + n.getMinutes() + 45; };
  const book = async () => {
    if (!model.trim() || !issue || !slot || !name.trim() || !phone.trim()) { setErr(T('Add the phone, the problem, a time, your name and your number.')); return; }
    setBusy(true); const r = ref('RB'), at = new Date(days[day]); const [h, m] = slot.split(':').map(Number); at.setHours(h, m);
    await team('Repair booking · ' + model.trim(), 'Booking ' + r + '\nPhone: ' + model.trim() + '\nProblem: ' + issue + '\nWhen: ' + at.toLocaleString() + '\nName: ' + name.trim() + '\nNumber: ' + phone.trim() + (note.trim() ? '\nNote: ' + note.trim() : ''));
    setBusy(false); setBooked({ ref: r, at, model: model.trim() }); setMood && setMood('celebrate');
    out({ t: T('Your repair is booked') + ':\n• ' + T('Booking') + ': ' + r + '\n• ' + T('Phone') + ': ' + model.trim() + '\n• ' + T('Problem') + ': ' + T(issue) + '\n• ' + T('When') + ': ' + at.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + slot + '\n• ' + T('Where') + ': ' + T('the counter in Al Murar, Deira') + '\n' + T('The team will confirm on WhatsApp. Bring the phone with some battery so we can test it.'), emote: 'celebrate', act: 'visit' });
  };
  // ── Trade list (Sam Grid) ──
  const grid = who?.kind === 'grid';
  const rows = useMemo(() => list.split(/\n+/).map((l) => l.trim()).filter(Boolean).slice(0, 60).map((l) => {
    const mq = l.match(/^(\d{1,4})\s*(?:x|×|pcs|pc)?\s+(.+)$/i) || l.match(/^(.+?)\s*(?:x|×|-|,)?\s*(\d{1,4})\s*(?:pcs|pc)?$/i);
    const qty = mq ? +(/^\d/.test(l) ? mq[1] : mq[2]) : 1, text = mq ? (/^\d/.test(l) ? mq[2] : mq[1]) : l;
    const lk = lookup(text), p = lk.list.find((x) => x.stock_qty >= qty) || lk.list.find((x) => x.stock_qty > 0) || lk.list[0] || null;
    return { line: l, qty: Math.max(1, qty), p };
  }), [list]);
  const found = rows.filter((r) => r.p) as { line: string; qty: number; p: Product }[], total = found.reduce((a, r) => a + r.p.price * r.qty, 0);
  const tradeSend = async () => {
    const r = ref('TL');
    const txt = 'Trade list ' + r + '\n' + rows.map((x) => (x.p ? '• ' + x.qty + ' × ' + label(x.p) + ' · ' + priceText(x.p.price * x.qty) + (x.p.stock_qty < x.qty ? ' (stock ' + x.p.stock_qty + ')' : '') : '• ' + x.line + ' · not matched')).join('\n') + '\nTotal (retail): ' + priceText(total);
    await team('Trade list · ' + found.length + ' lines', txt);
    window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wa', text: txt } }));
    out({ t: T('Your trade list is with the team') + ':\n• ' + T('List') + ': ' + r + '\n• ' + T('Lines matched') + ': ' + found.length + ' ' + T('of') + ' ' + rows.length + '\n• ' + T('Total at retail') + ': ' + priceText(total) + '\n' + T('Your Sam Grid trade prices are applied when the team confirms it.'), emote: 'happy' });
  };

  const H: Record<ToolKey, string> = { photo: '', fit: 'Fit check', track: 'Track my order', stock: 'Stock alert', price: 'Price watch', book: 'Book a repair', trade: 'Trade list' };
  return (
    <div className="stl" role="dialog" aria-label={T(H[k])}>
      <div className="stl-h"><span className="stl-ic"><ToolIcon k={k} /></span><span><b>{T(H[k])}</b><small>{T(TOOLS.find((x) => x[0] === k)?.[2] || '')}</small></span><button type="button" className="stl-x" onClick={close} aria-label={T('Close')} data-close="">×</button></div>
      {err ? <p className="stl-err" role="alert">{err}</p> : null}

      {k === 'fit' ? (
        <div className="stl-b">
          {st.devices.length ? <div className="stl-chips"><small>{T('My devices')}</small>{st.devices.map((d) => <button key={d.model_id} type="button" className={model === d.name ? 'on' : ''} onClick={() => setModel(d.name)}>{d.nick || d.name}</button>)}</div> : null}
          <label><span>{T('Your phone')}</span><ModelBox id="stl-m1" value={model} set={(s) => { setModel(s); setErr(''); }} /></label>
          <label><span>{T('Which part?')}</span><select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">{T('Every part')}</option>{cats().map((c) => <option key={c.id} value={c.id}>{T(c.name)}</option>)}</select></label>
          <div className="stl-a"><button type="button" className="stl-go" disabled={!model.trim()} onClick={fit}>{T('Show what fits')}</button></div>
        </div>
      ) : null}

      {k === 'track' ? (
        <div className="stl-b">
          <label><span>{T('Order number')}</span><input value={orderNo} onChange={(e) => { setOrderNo(e.target.value); setErr(''); }} placeholder={who ? T('Leave empty for your latest order') : 'SE-2041'} /></label>
          {!who ? <small className="stl-n">{T('Signed-in customers see every order without typing a number.')} <a href="/account">{T('Sign in')}</a></small> : null}
          <div className="stl-a"><button type="button" className="stl-go" disabled={busy || (!who && !orderNo.trim())} onClick={track}>{busy ? T('Looking…') : T('Find my order')}</button></div>
        </div>
      ) : null}

      {k === 'stock' || k === 'price' ? (
        <div className="stl-b">
          <PartPick pick={pick} set={setPick} />
          <div className="stl-a"><small className="stl-n">{k === 'stock' ? T('You will hear the bell when it is back.') : T('You will hear the bell when it gets cheaper.')}</small><button type="button" className="stl-go" disabled={!pick} onClick={() => watch(k)}>{k === 'stock' ? T('Alert me') : T('Watch the price')}</button></div>
        </div>
      ) : null}

      {k === 'book' ? (
        booked ? (
          <div className="stl-b stl-done">
            <b>{T('Booked')} · <span data-no-i18n="">{booked.ref}</span></b>
            <small>{booked.at.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} · {slot}</small>
            <div className="stl-a"><button type="button" className="stl-ghost" onClick={() => ics('Sam Electronics · ' + booked.model + ' repair', booked.at, 60, 'Sam Electronics, Al Murar, Deira, Dubai')}>{T('Add to my calendar')}</button><button type="button" className="stl-go" onClick={close}>{T('Done')}</button></div>
          </div>
        ) : (
          <div className="stl-b">
            <label><span>{T('Your phone')}</span><ModelBox id="stl-m2" value={model} set={setModel} /></label>
            <span className="stl-l">{T('What is wrong?')}</span>
            <div className="stl-chips">{['Screen', 'Battery', 'Charging port', 'Camera', 'Back glass', 'Water damage', 'Speaker or mic', 'Something else'].map((x) => <button key={x} type="button" className={issue === x ? 'on' : ''} onClick={() => setIssue(x)}>{T(x)}</button>)}</div>
            <span className="stl-l">{T('Day')}</span>
            <div className="stl-days">{days.map((d, i) => <button key={i} type="button" className={day === i ? 'on' : ''} onClick={() => { setDay(i); setSlot(''); }}><small>{i === 0 ? T('Today') : i === 1 ? T('Tomorrow') : d.toLocaleDateString(undefined, { weekday: 'short' })}</small><b>{d.getDate()}</b></button>)}</div>
            <span className="stl-l">{T('Time')}</span>
            <div className="stl-chips">{SLOTS.map((s) => <button key={s} type="button" disabled={!slotOk(s)} className={slot === s ? 'on' : ''} onClick={() => setSlot(s)}>{s}</button>)}</div>
            <div className="stl-2"><label><span>{T('Your name')}</span><input value={name} onChange={(e) => setName(e.target.value)} /></label><label><span>{T('Phone or WhatsApp')}</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 …" /></label></div>
            <label><span>{T('Anything we should know? (optional)')}</span><input value={note} onChange={(e) => setNote(e.target.value)} /></label>
            <div className="stl-a"><small className="stl-n">{T('Most repairs take 30 to 60 minutes.')}</small><button type="button" className="stl-go" disabled={busy} onClick={book}>{busy ? T('Booking…') : T('Book it')}</button></div>
          </div>
        )
      ) : null}

      {k === 'trade' ? (
        grid ? (
          <div className="stl-b">
            <label><span>{T('One part per line, with the quantity')}</span><textarea rows={5} value={list} onChange={(e) => setList(e.target.value)} placeholder={'10 iPhone 13 screen\n5 x Galaxy A54 battery\nRedmi Note 12 charging port 8'} /></label>
            {rows.length ? (
              <div className="stl-tl">
                {rows.map((r, i) => <span key={i} className={r.p ? '' : 'no'}><em>{r.qty}×</em><b>{r.p ? label(r.p) : r.line}</b><small>{r.p ? (r.p.stock_qty >= r.qty ? T('in stock') : r.p.stock_qty > 0 ? T('only') + ' ' + r.p.stock_qty : T('ask us')) : T('not matched')}</small><i>{r.p ? priceText(r.p.price * r.qty) : '·'}</i></span>)}
                <span className="tot"><b>{T('Total at retail')}</b><i>{priceText(total)}</i></span>
              </div>
            ) : null}
            <div className="stl-a"><button type="button" className="stl-ghost" disabled={!found.length} onClick={() => { found.forEach((r) => store.add(r.p.id, r.qty)); window.dispatchEvent(new CustomEvent('se:cart', { detail: { id: found[0].p.id } })); }}>{T('Add all to cart')}</button><button type="button" className="stl-go" disabled={!found.length} onClick={tradeSend}>{T('Send to the team')}</button></div>
          </div>
        ) : (
          <div className="stl-b stl-lock">
            <b>{T('For Sam Grid trade accounts')}</b>
            <small>{T('Repair shops and traders paste a whole parts list and get it priced and checked against stock in one go, with trade prices.')}</small>
            <div className="stl-a"><a className="stl-go" href="/wholesale">{T('Get a trade account')}</a>{!who ? <a className="stl-ghost" href="/account">{T('Sign in')}</a> : null}</div>
          </div>
        )
      ) : null}
    </div>
  );
}

/** card-aware line under a price: points you earn with your card, or what a card would earn you */
export function cardLine(price: number, who: Who): string {
  if (!(price > 0)) return '';
  const pts = Math.round(price);
  if (who && who.kind === 'grid') return T('Sam Grid') + ' · ' + T('trade price at checkout') + ' · +' + pts.toLocaleString('en-US') + ' ' + T('points');
  if (who && who.kind) return '+' + pts.toLocaleString('en-US') + ' ' + T('points on your card');
  return T('Earns') + ' ' + pts.toLocaleString('en-US') + ' ' + T('points with a Sam Circuit card');
}
