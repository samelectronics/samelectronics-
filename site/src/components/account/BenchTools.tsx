'use client';
// R10 P6 · My Bench tools: repair tickets with their timeline + warranty check (by order or job number, typed or scanned
// from the ticket's QR), and the trade tools (reorder the last order, quick order by pasting codes, printable price list).
import React, { useEffect, useRef, useState } from 'react';
import type { Order, User } from '@/lib/backend';
import { aed, byId, products, priceText } from '@/lib/catalog';
import { store } from '@/lib/store';
import { T } from '@/components/site/ui';

export type Job = { job: string; model: string; repair: string; total: string; when: string; at: number };
export const readJobs = (): Job[] => { try { const v = JSON.parse(localStorage.getItem('se-jobs') || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
export const saveJob = (j: Job) => { try { localStorage.setItem('se-jobs', JSON.stringify([j, ...readJobs().filter((x) => x.job !== j.job)].slice(0, 30))); } catch { /* */ } };
const JSTEPS = ['Booked', 'Checked', 'On the bench', 'Tested', 'Ready'];

export function Repairs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => setJobs(readJobs()), []);
  return (
    <div className="bt-sec">
      <div className="bn-ch"><h3 className="sp-h3">{T('Your repairs')}</h3><a className="sp-btn sm" href="/repair">{T('Book a repair')}</a></div>
      {jobs.length ? jobs.map((j) => (
        <div key={j.job} className="sp-card bt-job">
          <div className="bt-jh"><b className="mono">{j.job}</b><span>{j.model} · {j.repair}</span><b>{j.total}</b></div>
          <ol className="bt-tl">{JSTEPS.map((s, i) => <li key={s} className={i === 0 ? 'on' : ''}><i />{T(s)}</li>)}</ol>
          <small className="sp-muted">{T('Booked')} {new Date(j.at).toLocaleDateString()} · {T('The team updates you on WhatsApp at each step.')}</small>
        </div>
      )) : <div className="sp-card"><span className="sp-muted">{T('Repairs you book on this device appear here with their job ticket.')}</span></div>}
    </div>
  );
}

export function WarrantyCheck({ orders }: { orders: Order[] }) {
  const [q, setQ] = useState(''), [res, setRes] = useState<React.ReactNode>(null), [scan, setScan] = useState(false), vid = useRef<HTMLVideoElement>(null);
  const check = (raw: string) => {
    const code = raw.trim().toUpperCase().replace(/^.*JOB=/, ''); if (!code) return;
    const o = orders.find((x) => String(x.no).toUpperCase() === code || x.id.toUpperCase() === code), j = readJobs().find((x) => x.job.toUpperCase() === code);
    if (o) setRes(<div className="bt-ok"><b>{T('Order')} {o.no}</b><span>{new Date(o.createdAt).toLocaleDateString()} · {o.lines.length} {T('parts')}</span><span>{T('Each part’s warranty is on its label and invoice; bring the order number with the part.')}</span></div>);
    else if (j) setRes(<div className="bt-ok"><b>{T('Repair')} {j.job}</b><span>{j.model} · {j.repair}</span><span>{T('Repairs are covered from the day you collect the phone. Bring this ticket.')}</span></div>);
    else setRes(<div className="bt-no">{T('We can’t find that number on this account. Check it, or send it to us on WhatsApp and we look it up.')}</div>);
  };
  // scan the job ticket's QR with the camera, where the browser can (BarcodeDetector)
  useEffect(() => {
    if (!scan) return; let stream: MediaStream | null = null, raf = 0, dead = false;
    const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
    if (!BD) { setRes(<div className="bt-no">{T('This browser cannot scan codes. Type the number instead.')}</div>); setScan(false); return; }
    const det = new BD({ formats: ['qr_code'] });
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((s) => { stream = s; if (vid.current) { vid.current.srcObject = s; vid.current.play(); }
      const tick = async () => { if (dead || !vid.current) return; try { const r = await det.detect(vid.current); if (r[0]) { setQ(r[0].rawValue); check(r[0].rawValue); setScan(false); return; } } catch { /* */ } raf = requestAnimationFrame(tick); }; tick(); })
      .catch(() => { setRes(<div className="bt-no">{T('The camera is not available. Type the number instead.')}</div>); setScan(false); });
    return () => { dead = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); };
  }, [scan]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="sp-card bt-war">
      <h3 className="sp-h3">{T('Warranty check')}</h3>
      <p className="sp-p">{T('Type the order number or the repair job number, or scan the QR on your job ticket.')}</p>
      <form onSubmit={(e) => { e.preventDefault(); check(q); }} className="bt-row"><input className="bt-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="SE-R… / 1024" /><button type="submit" className="sp-btn sm">{T('Check')}</button><button type="button" className="sp-btn sm ghost" onClick={() => setScan(!scan)}>{scan ? T('Stop') : T('Scan QR')}</button></form>
      {scan ? <video ref={vid} className="bt-vid" muted playsInline /> : null}
      {res}
    </div>
  );
}

export function TradeTools({ me, orders }: { me: User; orders: Order[] }) {
  const [txt, setTxt] = useState(''), [msg, setMsg] = useState('');
  if (!me.tradeApproved && me.kind !== 'wholesale') return null;
  const last = orders[0];
  const reorder = () => { if (!last) return; last.lines.forEach((l: { id: string; qty: number }) => store.add(l.id, l.qty)); setMsg(T('Your last order is in the cart.')); };
  const quick = () => {
    let ok = 0; const miss: string[] = [];
    txt.split(/\n|,/).map((l) => l.trim()).filter(Boolean).forEach((l) => { const m = l.match(/^([A-Za-z0-9-]+)\s*(?:[x×*:]\s*|\s+)?(\d+)?$/); const id = m ? m[1].toUpperCase() : ''; if (id && byId(id)) { store.add(id, Math.max(1, +(m![2] || 1))); ok++; } else miss.push(l); });
    setMsg(ok + ' ' + T('lines added to the cart') + (miss.length ? ' · ' + T('not found') + ': ' + miss.slice(0, 5).join(', ') : ''));
  };
  const priceList = () => {
    const rows = products().filter((p) => p.stock_qty > 0).sort((a, b) => a.title.localeCompare(b.title));
    const w = window.open('', '_blank'); if (!w) return;
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Sam Electronics · trade price list</title><style>body{font:13px Inter,Arial,sans-serif;color:#26282B;margin:28px}h1{font:700 20px Arial;margin:0}small{color:#6A6D72}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{padding:6px 8px;border-bottom:1px solid #ECEDEF;text-align:left}th{font:700 11px monospace;letter-spacing:.08em;text-transform:uppercase;background:#F4F5F6}td.r{text-align:right;font-variant-numeric:tabular-nums}</style><h1>Sam Electronics · trade price list</h1><small>${new Date().toLocaleDateString()} · ${me.name} · prices in AED excl. VAT · test data while the shop is set up</small><table><tr><th>Code</th><th>Part</th><th>Grade</th><th class="r">Price</th></tr>${rows.map((p) => `<tr><td>${p.id}</td><td>${p.title.replace(/</g, '&lt;')}</td><td>${p.gradeName}</td><td class="r">${p.price > 0 ? p.price.toFixed(2) : 'Ask'}</td></tr>`).join('')}</table><script>setTimeout(()=>print(),300)<\/script>`);
    w.document.close();
  };
  return (
    <div className="sp-card bt-trade">
      <h3 className="sp-h3">{T('Trade tools')}</h3>
      <div className="bt-row"><button type="button" className="sp-btn sm" onClick={reorder} disabled={!last}>{T('Reorder my last order')}</button><button type="button" className="sp-btn sm ghost" onClick={priceList}>{T('Download the trade price list (PDF)')}</button></div>
      <label className="sp-field">{T('Quick order: paste part codes, one per line, with a quantity')}<textarea value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={'SE-IP16PM-SCR-OR x5\nSE-IP16PM-SCR-OL 2'} rows={4} /></label>
      <button type="button" className="sp-btn sm dark" onClick={quick} disabled={!txt.trim()}>{T('Add all to cart')}</button>
      {msg ? <small className="sp-muted">{msg}</small> : null}
    </div>
  );
}
void aed; void priceText;
