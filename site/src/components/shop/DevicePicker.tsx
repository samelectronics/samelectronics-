'use client';
// R9 · "+ Add a device": the branded picker (no grey browser dropdown). Search a model, or pick a brand then a model; the
// models with parts in the shop come first. Styles: shop.css (.dp-*).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { data, products } from '@/lib/catalog';
import { T } from '@/components/site/ui';

export default function DevicePicker({ onPick, have }: { onPick: (m: { id: string; name: string }) => void; have: string[] }) {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [brand, setBrand] = useState(''), box = useRef<HTMLSpanElement>(null), inp = useRef<HTMLInputElement>(null);
  const D = data();
  const stocked = useMemo(() => new Set(products().map((p) => p.model_id)), [open]);
  useEffect(() => { const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); }; const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc); return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); }; }, []);
  useEffect(() => { if (open) window.setTimeout(() => inp.current?.focus(), 40); }, [open]);
  if (!D) return null;
  const brands = D.brands.filter((b) => D.models.some((m) => m.brand_id === b.id && stocked.has(m.id)));
  const s = q.trim().toLowerCase();
  const list = D.models.filter((m) => (s ? (m.name + ' ' + (D.brands.find((b) => b.id === m.brand_id)?.name || '')).toLowerCase().includes(s) : (!brand || m.brand_id === brand) && stocked.has(m.id)))
    .sort((a, b) => +stocked.has(b.id) - +stocked.has(a.id)).slice(0, 60);
  return (
    <span ref={box} className={'dp' + (open ? ' open' : '')}>
      <button type="button" className="dp-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></svg>
        {T('Add a device')}<svg className="dp-chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open ? (
        <span className="dp-panel" role="dialog" aria-label={T('Add a device')}>
          <label className="dp-search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Type your model, e.g. A54')} /></label>
          {!s ? <span className="dp-brands"><button type="button" className={!brand ? 'on' : ''} onClick={() => setBrand('')}>{T('All')}</button>{brands.map((b) => <button key={b.id} type="button" className={brand === b.id ? 'on' : ''} onClick={() => setBrand(b.id)}>{b.name}</button>)}</span> : null}
          <span className="dp-list">
            {list.length ? list.map((m) => { const on = have.includes(m.id); return (
              <button key={m.id} type="button" className={'dp-it' + (on ? ' on' : '')} onClick={() => { onPick({ id: m.id, name: m.name }); setOpen(false); setQ(''); }}>
                <b>{m.name}</b><small>{D.brands.find((b) => b.id === m.brand_id)?.name}{stocked.has(m.id) ? '' : ' · ' + T('ask us')}</small>{on ? <i>✓</i> : null}
              </button>); }) : <span className="dp-none">{T('No model matches. Ask Samsoom and we will check.')}</span>}
          </span>
        </span>
      ) : null}
    </span>
  );
}
