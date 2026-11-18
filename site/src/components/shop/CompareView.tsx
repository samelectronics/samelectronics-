'use client';
// Owner (18 Nov): "the comparison feature seems cheap; make it better". Each part is a column card (photo on the
// stage, grade + maker tags, price); every measurable row is drawn as a bar so the winner shows at a glance (the best
// cell is marked); a "Best value" ribbon sits on the strongest all-rounder, and Samsoom sums it up in one line.
import React, { useState } from 'react';
import { type Product, priceText } from '@/lib/catalog';
import { store } from '@/lib/store';
import { T, Stars } from '@/components/site/ui';
import { GradeTag, MakerTag } from './Tags';
import LiveSam from '@/components/samsoom/LiveSam';

const WM = (w: string) => { const m = String(w || '').match(/(\d+)\s*(month|year)/i); return m ? +m[1] * (/year/i.test(m[2]) ? 12 : 1) : 0; };
type Row = { k: string; val: (p: Product) => number; txt: (p: Product) => React.ReactNode; low?: boolean };

export default function CompareView({ items, onClose, onOpen }: { items: Product[]; onClose: () => void; onOpen: (p: Product) => void }) {
  const [diff, setDiff] = useState(false);
  const rows: Row[] = [
    { k: 'Price', val: (p) => p.price, txt: (p) => <b>{priceText(p.price)}</b>, low: true },
    { k: 'Warranty', val: (p) => WM(p.warranty), txt: (p) => T(p.warranty || '—') },
    { k: 'Rating', val: (p) => p.rating, txt: (p) => <span className="cv-st"><Stars v={p.rating} /><small>{p.rating.toFixed(1)}</small></span> },
    { k: 'Stock (estimate)', val: (p) => p.stock_qty, txt: (p) => (p.stock_qty > 0 ? p.stock_qty + ' ' + T('pcs') : T('Out of stock')) },
  ];
  const score = (p: Product) => { const mp = Math.max(...items.map((x) => x.price || 1)), mw = Math.max(1, ...items.map((x) => WM(x.warranty))); return (1 - (p.price || mp) / mp) * 0.5 + (WM(p.warranty) / mw) * 0.3 + (p.rating / 5) * 0.2; };
  const best = items.length > 1 ? items.reduce((a, b) => (score(b) > score(a) ? b : a)) : null;
  const cheapest = items.reduce((a, b) => (b.price < a.price ? b : a));
  const longest = items.reduce((a, b) => (WM(b.warranty) > WM(a.warranty) ? b : a));
  const same = (r: Row) => new Set(items.map((p) => r.val(p))).size === 1;
  return (
    <div className="cv-veil" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cv" role="dialog" aria-modal="true" aria-label={T('Side by side')}>
        <div className="cv-hd">
          <span><small className="cv-k">{T('COMPARE')} · {items.length} {T('parts')}</small><b className="cv-h">{T('Side by side')}</b></span>
          <label className="cv-diff"><input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} /><i /><span>{T('Only differences')}</span></label>
          <button type="button" className="cv-x" onClick={onClose} aria-label={T('Close')} data-close="">×</button>
        </div>
        <div className="cv-grid" style={{ ['--n' as string]: items.length } as React.CSSProperties}>
          <span className="cv-corner" />
          {items.map((p) => (
            <div key={p.id} className={'cv-col' + (best && best.id === p.id ? ' win' : '')}>
              {best && best.id === p.id ? <span className="cv-rib">{T('Best value')}</span> : null}
              <button type="button" className="cv-rm" onClick={() => store.cmp(p.id)} aria-label={T('Remove')}>×</button>
              <span className="cv-img"><img src={p.img} alt="" /></span>
              <span className="tg-row"><GradeTag g={p.grade} name={p.gradeName} size="sm" /><MakerTag m={p.manufacturer} name={p.makerName} size="sm" /></span>
              <b className="cv-t">{p.title}</b>
              <small className="cv-s">{p.brandName} · {p.modelName}</small>
            </div>
          ))}
          {rows.filter((r) => !diff || !same(r)).map((r) => {
            const vals = items.map((p) => r.val(p)), mx = Math.max(...vals, 0.0001), mn = Math.min(...vals), top = r.low ? mn : Math.max(...vals), tie = new Set(vals).size === 1;
            return (
              <React.Fragment key={r.k}>
                <span className="cv-rk">{T(r.k)}</span>
                {items.map((p, j) => { const v = vals[j], w = r.low ? (mn / Math.max(v, 0.0001)) * 100 : (v / mx) * 100, win = !tie && v === top; return (
                  <span key={p.id} className={'cv-cell' + (win ? ' best' : '')}>
                    <span className="cv-v">{r.txt(p)}{win ? <em>{r.low ? T('Lowest') : T('Best')}</em> : null}</span>
                    <i className="cv-bar"><i style={{ width: Math.max(6, Math.round(w)) + '%' }} /></i>
                  </span>); })}
              </React.Fragment>
            );
          })}
          <span className="cv-rk" />
          {items.map((p) => (
            <span key={p.id} className="cv-acts">
              <button type="button" className="cv-add" onClick={(e) => window.dispatchEvent(new CustomEvent('se:cart', { detail: { id: p.id, clientX: e.clientX, clientY: e.clientY } }))}>{T('Add to cart')}</button>
              <button type="button" className="cv-view" onClick={() => { onClose(); onOpen(p); }}>{T('View details')}</button>
            </span>
          ))}
        </div>
        {items.length > 1 ? (
          <div className="cv-say">
            <span className="cv-sam" aria-hidden="true"><LiveSam size={34} mood="idle" /></span>
            <p><b>{T('Samsoom says')}:</b> {cheapest.gradeName} {T('is the cheapest')}{longest.id !== cheapest.id ? <>, {longest.gradeName} {T('has the longest warranty')}</> : null}{best ? <> {T('and')} <b>{best.gradeName}</b> {T('is the best value overall')}.</> : '.'}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
