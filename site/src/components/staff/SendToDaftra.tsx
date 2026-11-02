'use client';
// R9 · "Send to Daftra" on an order. Nothing goes to Daftra unless a staff member with the Accounting permission presses
// the button AND confirms the window that shows exactly what will be created (type, client, items, totals). Invoices are
// created as drafts; quotations are never final until accepted. An order can be sent once: it then shows
// "Sent to Daftra ✓" with Daftra's number. Every send is written to the audit log (who, when, which order, which number).
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { backend, type Order, type Staff } from '@/lib/backend';
import { Badge, can, money, when, useSetting } from './kit';
import { api } from './DaftraMod';

export type Sent = { type: 'estimate' | 'invoice'; id: string; no: string; at: number; by: string };
export function DaftraMark({ size = 18 }: { size?: number }) {
  const [img, setImg] = useState(true);
  return img ? <img src="/assets/brands/daftra.svg" alt="Daftra" width={size} height={size} style={{ borderRadius: 4 }} onError={() => setImg(false)} />
    : <span className="dft-mark" style={{ width: size, height: size, fontSize: size * 0.62 }} aria-label="Daftra">D</span>;
}

export default function SendToDaftra({ o, me }: { o: Order; me: Staff }) {
  const [sentAll, setSentAll] = useSetting<Record<string, Sent>>('daftra-sent', {}), [map] = useSetting<Record<string, { id: string; name: string }>>('daftra-map', {});
  const [open, setOpen] = useState(false), [type, setType] = useState<'estimate' | 'invoice'>('estimate'), [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const [clients, setClients] = useState<Record<string, unknown>[] | null>(null), [cid, setCid] = useState<string>('new'), [prices, setPrices] = useState<Record<string, number>>({});
  const sent = sentAll[o.id];
  useEffect(() => {
    if (!open) return; setErr(''); setClients(null);
    const qs = [o.phone.replace(/\D/g, '').slice(-9), o.email].filter(Boolean);
    (async () => { const found: Record<string, unknown>[] = []; for (const k of qs) { try { const r = await api('clients.json', 'limit=10&keyword=' + encodeURIComponent(k)); r.rows.forEach((x) => { if (!found.some((f) => String(f.id) === String(x.id))) found.push(x); }); } catch (e) { setErr((e as Error).message); } } setClients(found); if (found[0]) setCid(String(found[0].id)); })();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!can(me, 'accounting')) return null;
  if (sent) return <span className="dft-sent"><DaftraMark size={16} /> Sent to Daftra ✓ <b>{sent.type === 'invoice' ? 'Draft invoice' : 'Quotation'} {sent.no}</b><small>{when(sent.at)} · {sent.by}</small></span>;
  const items = o.lines.map((l) => ({ l, unit: prices[l.id] ?? l.unit })), missing = items.filter((x) => !x.unit).length;
  const sub = items.reduce((a, x) => a + x.unit * x.l.qty, 0) + (o.ship || 0);
  const name = (c: Record<string, unknown>) => String(c.business_name || [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Client ' + c.id);
  const go = async () => {
    setBusy(true); setErr('');
    try {
      const body = { type, ref: o.no, ...(cid === 'new' ? { newClient: { name: o.company ? o.company + ' (' + o.name + ')' : o.name, email: o.email, phone: o.phone } } : { clientId: cid }),
        items: [...items.map(({ l, unit }) => ({ name: l.title + ' · ' + l.grade, description: l.id, unit_price: unit, quantity: l.qty, ...(map[l.id] ? { product_id: map[l.id].id } : {}) })), ...(o.ship ? [{ name: 'Delivery', unit_price: o.ship, quantity: 1 }] : [])],
        notes: o.note || '' };
      const r = await api('send', '', body);
      const rec: Sent = { type, id: String(r.id), no: String(r.no || r.id), at: Date.now(), by: me.name };
      await setSentAll({ ...sentAll, [o.id]: rec }, `Sent ${o.no} to Daftra as ${type === 'invoice' ? 'draft invoice' : 'quotation'} ${rec.no}`);
      await backend.log('Sent to Daftra', o.no, `${type === 'invoice' ? 'Draft invoice' : 'Quotation'} ${rec.no} (Daftra id ${rec.id}) by ${me.name}`);
      setOpen(false);
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  };
  return (
    <>
      <button type="button" className="cr-btn dft-btn" onClick={() => setOpen(true)}><DaftraMark /> Send to Daftra</button>
      {open ? createPortal(
        <div className="dft-veil" onClick={(e) => { if (e.target === e.currentTarget && !busy) setOpen(false); }}>
          <div className="dft-box" role="dialog" aria-modal="true" aria-label="Send to Daftra">
            <header><DaftraMark size={24} /><b>Send order {o.no} to Daftra</b></header>
            <div className="dft-sec"><small>CREATE</small>
              <span className="cr-tabs"><button type="button" className={type === 'estimate' ? 'on' : ''} onClick={() => setType('estimate')}>Quotation</button><button type="button" className={type === 'invoice' ? 'on' : ''} onClick={() => setType('invoice')}>Invoice (as a draft)</button></span></div>
            <div className="dft-sec"><small>CLIENT IN DAFTRA</small>
              {clients === null ? <span className="cr-muted">Looking for this customer in Daftra…</span> : (
                <div className="dft-cl">
                  {clients.map((c) => <label key={String(c.id)}><input type="radio" name="dc" checked={cid === String(c.id)} onChange={() => setCid(String(c.id))} /><b>{name(c)}</b><small>{String(c.phone1 || '')} {String(c.email || '')}</small></label>)}
                  <label><input type="radio" name="dc" checked={cid === 'new'} onChange={() => setCid('new')} /><b>New client: {o.company ? o.company + ' (' + o.name + ')' : o.name}</b><small>{o.phone} {o.email}</small></label>
                </div>)}
            </div>
            <div className="dft-sec"><small>ITEMS</small>
              <table className="cr-lines"><tbody>
                {items.map(({ l, unit }) => <tr key={l.id}><td>{l.qty} ×</td><td><b>{l.title}</b> · {l.grade}<br /><small className="mono">{l.id}{map[l.id] ? ' · linked to Daftra' : ' · not linked: sent as text'}</small></td>
                  <td className="num">{l.confirm || !l.unit ? <input className="cr-in dft-pr" type="number" min={0} step="0.5" value={unit || ''} placeholder="Price" onChange={(e) => setPrices({ ...prices, [l.id]: +e.target.value })} /> : money(unit)}</td><td className="num">{money(unit * l.qty)}</td></tr>)}
                {o.ship ? <tr><td>1 ×</td><td>Delivery</td><td className="num">{money(o.ship)}</td><td className="num">{money(o.ship)}</td></tr> : null}
                <tr className="tot"><td /><td>Total before VAT</td><td /><td className="num">{money(sub)}</td></tr>
              </tbody></table>
              <small className="cr-muted">VAT is applied by Daftra's tax settings. Notes will say “Website order {o.no}”.</small>
            </div>
            {missing ? <div className="cr-err">{missing} item{missing > 1 ? 's have' : ' has'} no price yet. Enter the confirmed price first.</div> : null}
            {err ? <div className="cr-err">{err}</div> : null}
            <footer><button type="button" className="cr-btn ghost" disabled={busy} onClick={() => setOpen(false)}>Cancel</button><button type="button" className="cr-btn dft-btn" disabled={busy || !!missing || clients === null} onClick={go}>{busy ? 'Sending…' : 'Confirm and create in Daftra'}</button></footer>
          </div>
        </div>, document.body
      ) : null}
    </>
  );
}
export function DaftraBadge({ id }: { id: string }) { const [s] = useSetting<Record<string, Sent>>('daftra-sent', {}); return s[id] ? <Badge t={'DAFTRA ' + s[id].no} tone="b" /> : null; }
