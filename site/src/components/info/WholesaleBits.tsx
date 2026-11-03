'use client';
// R10 P7 · Wholesale: the trade floor (one pallet per part family, live stock from the catalogue), the live trade
// calculator (pick parts and quantities → retail vs trade, per order and per month) and the application tracker.
import React, { useEffect, useMemo, useState } from 'react';
import { products, aed, type Product } from '@/lib/catalog';
import { useMe } from '@/lib/backend';
import { T } from '@/components/site/ui';

const useProducts = () => { const [l, setL] = useState<Product[]>([]); useEffect(() => { const iv = window.setInterval(() => { const x = products(); if (x.length) { window.clearInterval(iv); setL(x); } }, 80); return () => window.clearInterval(iv); }, []); return l; };

export function TradeFloor() {
  const l = useProducts();
  const fam = useMemo(() => { const m = new Map<string, { name: string; n: number; q: number }>(); l.forEach((p) => { const f = m.get(p.category) || { name: p.catName, n: 0, q: 0 }; f.n++; f.q += Math.max(0, p.stock_qty || 0); m.set(p.category, f); }); return [...m.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 6); }, [l]);
  return (
    <div className="tf" data-rise>
      {fam.map(([id, f], i) => { const h = Math.max(2, Math.min(5, Math.round(f.n / 6))); return (
        <a key={id} className="tf-pal" href={'/shop?cat=' + id} style={{ ['--i' as string]: i }}>
          <span className="tf-stack">{Array.from({ length: h }).map((_, k) => <i key={k} style={{ ['--k' as string]: k }} />)}</span>
          <span className="tf-base" />
          <span className="tf-tag"><b>{T(f.name)}</b><small className="mono">{f.n} {T('parts')} · {f.q ? f.q + ' ' + T('in stock') : T('ask for stock')}</small></span>
        </a>); })}
    </div>
  );
}

export function TradeCalc() {
  const l = useProducts();
  const pool = useMemo(() => l.filter((p) => p.retail_price > 0 && p.wholesale_price > 0 && p.wholesale_price < p.retail_price).slice(0, 60), [l]);
  const [rows, setRows] = useState<{ id: string; q: number }[]>([]), [per, setPer] = useState(4);
  useEffect(() => { if (pool.length && !rows.length) setRows(pool.slice(0, 3).map((p, i) => ({ id: p.id, q: [10, 5, 20][i] }))); }, [pool]); // eslint-disable-line react-hooks/exhaustive-deps
  const get = (id: string) => pool.find((p) => p.id === id);
  const r = rows.reduce((s, x) => s + (get(x.id)?.retail_price || 0) * x.q, 0), w = rows.reduce((s, x) => s + (get(x.id)?.wholesale_price || 0) * x.q, 0);
  return (
    <div className="tc" data-rise>
      <div className="tc-l">
        {rows.map((x, i) => (
          <div key={i} className="tc-row">
            <select value={x.id} onChange={(e) => setRows(rows.map((y, j) => j === i ? { ...y, id: e.target.value } : y))}>{pool.map((p) => <option key={p.id} value={p.id}>{p.title} · {p.gradeName}</option>)}</select>
            <input type="number" min={1} max={999} value={x.q} onChange={(e) => setRows(rows.map((y, j) => j === i ? { ...y, q: Math.max(1, Math.min(999, +e.target.value || 1)) } : y))} aria-label={T('Quantity')} />
            <button type="button" className="tc-x" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label={T('Remove')}>×</button>
          </div>
        ))}
        {pool.length ? <button type="button" className="sp-btn sm ghost" onClick={() => setRows([...rows, { id: pool[rows.length % pool.length].id, q: 5 }])}>+ {T('Add a part')}</button> : <span className="sp-muted">{T('Loading parts…')}</span>}
        <label className="tc-per"><span>{T('Orders like this per month')}</span><input type="range" min={1} max={20} value={per} onChange={(e) => setPer(+e.target.value)} /><b className="mono">{per}×</b></label>
      </div>
      <div className="tc-r">
        <span className="tc-k">{T('Everyone pays')}</span><b className="tc-v">{aed(r, false)}</b>
        <span className="tc-k">{T('You pay with a trade account')}</span><b className="tc-v y">{aed(w, false)}</b>
        <div className="tc-bar"><i style={{ width: (r ? (w / r) * 100 : 0) + '%' }} /></div>
        <span className="tc-save">{T('You save')} <b>{aed(r - w, false)}</b> {T('per order')} · <b>{aed((r - w) * per * 12, false)}</b> {T('a year')}</span>
        <small className="sp-sample">{T('Sample prices while the shop is set up')}</small>
      </div>
    </div>
  );
}

type Sent = { at: number; company: string };
export const markSent = (company: string) => { try { localStorage.setItem('se-trade-app', JSON.stringify({ at: Date.now(), company })); } catch { /* */ } };
export function AppTracker() {
  const [me] = useMe(); const [s, setS] = useState<Sent | null>(null);
  useEffect(() => { const h = () => { try { setS(JSON.parse(localStorage.getItem('se-trade-app') || 'null')); } catch { /* */ } }; h(); window.addEventListener('se:trade-app', h); return () => window.removeEventListener('se:trade-app', h); }, []);
  if (!s && !me?.tradeApproved) return null;
  const step = me?.tradeApproved ? 3 : s && Date.now() - s.at > 36e5 ? 1 : 0;
  const L = ['Received', 'Checking the licence', 'Decision', 'Trade prices on'];
  return (
    <div className="sp-card at" data-rise>
      <div className="at-h"><b>{T('Your application')}</b>{s ? <small className="mono">{s.company} · {new Date(s.at).toLocaleDateString()}</small> : null}</div>
      <ol className="bt-tl at-tl">{L.map((x, i) => <li key={x} className={i <= step ? 'on' : ''}><i />{T(x)}</li>)}</ol>
      <small className="sp-muted">{step === 3 ? T('Approved. Sign in and the shop shows your trade price on every part.') : T('We reply by e-mail and WhatsApp, usually within one working day. Sign in with the same e-mail to see the result here.')}</small>
    </div>
  );
}
