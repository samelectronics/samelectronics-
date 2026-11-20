'use client';
// R9 · "+ Add a device": the branded picker (no grey browser dropdown). Search a model, or pick a brand then a model; the
// models with parts in the shop come first. Styles: shop.css (.dp-*).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import LiveSam from '@/components/samsoom/LiveSam';
import { data, products } from '@/lib/catalog';
import { T } from '@/components/site/ui';

type Kind = 'phone' | 'tablet' | 'watch';
/** owner (R10): every saved device wears a little drawing of its back: a phone with its camera block, a tablet with one
 *  lens, a watch with its strap. Graphite lines, a yellow lens ring (our colours, no brand art). */
export function DevIcon({ kind = 'phone', size = 30 }: { kind?: string; size?: number }) {
  if (kind === 'watch') return (
    <svg className="dv-ic" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><path d="M11 3h10l1 5H10zM10 24h12l-1 5H11z" fill="#C9CCD1" /><rect x="7.5" y="7.5" width="17" height="17" rx="5" fill="#fff" stroke="#3D3E3F" strokeWidth="1.6" /><circle cx="16" cy="16" r="3.4" fill="none" stroke="#F7C032" strokeWidth="1.8" /><rect x="24.6" y="13" width="1.8" height="4.5" rx=".9" fill="#3D3E3F" /></svg>
  );
  if (kind === 'tablet') return (
    <svg className="dv-ic" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="3" width="22" height="26" rx="3.4" fill="#fff" stroke="#3D3E3F" strokeWidth="1.6" /><circle cx="10" cy="8" r="2.3" fill="#3D3E3F" /><circle cx="10" cy="8" r="1.1" fill="none" stroke="#F7C032" strokeWidth="1" /><rect x="13" y="13" width="6" height="6" rx="1.5" fill="none" stroke="#C9CCD1" strokeWidth="1.2" /></svg>
  );
  return (
    <svg className="dv-ic" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><rect x="8" y="2" width="16" height="28" rx="4" fill="#fff" stroke="#3D3E3F" strokeWidth="1.6" /><rect x="10.5" y="4.6" width="7.4" height="8.2" rx="2.2" fill="#3D3E3F" /><circle cx="12.6" cy="6.9" r="1.3" fill="none" stroke="#F7C032" strokeWidth="1" /><circle cx="12.6" cy="10.6" r="1.3" fill="none" stroke="#F7C032" strokeWidth="1" /><circle cx="15.9" cy="8.7" r=".8" fill="#C9CCD1" /><rect x="13.5" y="19" width="5" height="5" rx="1.4" fill="none" stroke="#C9CCD1" strokeWidth="1.1" /></svg>
  );
}

/** R12b (owner: "the phone backs in Add a device look cheap; make them like the teardown parts"): a small 3D-shaded back of
 *  the phone: a brushed metal body with a glass sheen, and the brand's own camera layout with glass lenses and rings */
const BODY: Record<string, [string, string, string]> = { apple: ['#E9E4DA', '#C8C1B4', '#9E978A'], samsung: ['#D9DEE6', '#B4BCC8', '#8C95A3'], google: ['#E7E3DC', '#C9C3B8', '#A39C8F'], xiaomi: ['#3A3D42', '#26282B', '#16171A'], redmi: ['#3A4A5E', '#2A3646', '#1B2430'], poco: ['#FFD54A', '#F2B81A', '#C98F0C'], huawei: ['#4E5A52', '#38423C', '#252C28'], honor: ['#5C6C8A', '#45526C', '#2F384B'], oppo: ['#D4E2DC', '#AFC4BB', '#87A096'], realme: ['#F2C14E', '#D9A12A', '#B07E14'], oneplus: ['#4A4F57', '#33373D', '#1F2226'], nokia: ['#3D5A80', '#2C4566', '#1C2F48'] };
export function DevBack({ brand = '', size = 44 }: { brand?: string; size?: number }) {
  const [a, b, c] = BODY[brand] || ['#D6D9DD', '#B3B8BE', '#8C9198'], id = 'db' + brand + size;
  const lens = (x: number, y: number, r: number) => <g key={x + '-' + y}><circle cx={x} cy={y} r={r + 1.1} fill="#1E1F21" /><circle cx={x} cy={y} r={r + .5} fill={'url(#' + id + 'r)'} /><circle cx={x} cy={y} r={r} fill={'url(#' + id + 'l)'} /><circle cx={x - r * .35} cy={y - r * .35} r={r * .28} fill="rgba(255,255,255,.75)" /></g>;
  const cam = brand === 'apple' ? <><rect x="9" y="5" width="15" height="15" rx="4.4" fill={b} stroke="rgba(0,0,0,.18)" strokeWidth=".6" />{lens(13.2, 9.2, 2.6)}{lens(13.2, 15.8, 2.6)}{lens(19.6, 12.5, 2.6)}</>
    : brand === 'google' ? <><rect x="5" y="9" width="30" height="7.5" rx="3.7" fill="#2A2C2F" />{lens(13, 12.7, 2.4)}{lens(19.5, 12.7, 2.4)}</>
    : brand === 'samsung' ? <>{lens(12, 8.5, 2.5)}{lens(12, 15, 2.5)}{lens(12, 21.5, 2.5)}</>
    : brand === 'xiaomi' || brand === 'redmi' || brand === 'poco' ? <><rect x="9" y="5" width="16" height="16" rx="4" fill="#1E1F21" opacity=".85" />{lens(13.3, 9.3, 2.5)}{lens(20.6, 9.3, 2.5)}{lens(13.3, 16.6, 2.5)}{lens(20.6, 16.6, 2.5)}</>
    : <><circle cx="16" cy="13" r="8" fill="#1E1F21" opacity=".85" />{lens(13, 10.5, 2.3)}{lens(19, 10.5, 2.3)}{lens(16, 16.4, 2.3)}</>;
  return (
    <svg className="dv-back" width={size * .72} height={size} viewBox="0 0 40 56" aria-hidden="true">
      <defs>
        <linearGradient id={id + 'b'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="rgba(255,255,255,0)" /><stop offset=".45" stopColor="rgba(255,255,255,.38)" /><stop offset=".55" stopColor="rgba(255,255,255,0)" /></linearGradient>
        <radialGradient id={id + 'l'} cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#4A5A7A" /><stop offset=".55" stopColor="#141820" /><stop offset="1" stopColor="#05060A" /></radialGradient>
        <linearGradient id={id + 'r'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2F3F5" /><stop offset="1" stopColor="#6E7378" /></linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="52" rx="7.5" fill={c} />
      <rect x="2.6" y="2.6" width="34.8" height="50.6" rx="7" fill={'url(#' + id + 'b)'} />
      <rect x="2.6" y="2.6" width="34.8" height="50.6" rx="7" fill={'url(#' + id + 's)'} opacity=".8" />
      {cam}
      <rect x="2.6" y="2.6" width="34.8" height="50.6" rx="7" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth=".6" />
    </svg>
  );
}
export const kindOf = (id: string) => (data()?.models.find((m) => m.id === id)?.device || 'phone') as Kind;

export default function DevicePicker({ onPick, have }: { onPick: (m: { id: string; name: string }) => void; have: string[] }) {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [brand, setBrand] = useState(''), [kind, setKind] = useState<'' | Kind>(''), box = useRef<HTMLSpanElement>(null), pane = useRef<HTMLDivElement>(null), inp = useRef<HTMLInputElement>(null);
  const D = data();
  const stocked = useMemo(() => new Set(products().map((p) => p.model_id)), [open]);
  useEffect(() => { const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node) && !(pane.current && pane.current.contains(e.target as Node))) setOpen(false); }; const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc); return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); }; }, []);
  useEffect(() => { if (open) window.setTimeout(() => inp.current?.focus(), 40); }, [open]);
  if (!D) return null;
  const brands = D.brands.filter((b) => D.models.some((m) => m.brand_id === b.id && stocked.has(m.id) && (!kind || m.device === kind)));
  const s = q.trim().toLowerCase();
  const list = D.models.filter((m) => (!kind || m.device === kind) && (s ? (m.name + ' ' + (D.brands.find((b) => b.id === m.brand_id)?.name || '')).toLowerCase().includes(s) : (!brand || m.brand_id === brand) && stocked.has(m.id)))
    .sort((a, b) => +stocked.has(b.id) - +stocked.has(a.id)).slice(0, 60);
  return (
    <span ref={box} className={'dp' + (open ? ' open' : '')}>
      <button type="button" className="dp-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></svg>
        {T('Add a device')}<svg className="dp-chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {/* owner (19 Nov): a proper, centred pop-up in the site's style (not a side pop-out) */}
      {open && typeof document !== 'undefined' ? createPortal(
        <div className="dp-veil">
        <div ref={pane} className="dp-panel dp-modal" role="dialog" aria-modal="true" aria-label={T('Add a device')}>
          <span className="dp-head"><span className="dp-sam" aria-hidden="true"><LiveSam fit size={56} pose="happy" /></span><span><b>{T('Add a device')}</b><small>{T('Save the devices you fix most. I will mark every part that fits them.')}</small></span><button type="button" className="dp-x" aria-label={T('Close')} onClick={() => setOpen(false)}>×</button></span>
          <label className="dp-search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Type your model, e.g. A54')} /></label>
          <span className="dp-kinds" role="tablist">{([['', 'All'], ['phone', 'Phones'], ['tablet', 'Tablets'], ['watch', 'Watches']] as ['' | Kind, string][]).map(([k, l]) => <button key={l} type="button" role="tab" aria-selected={kind === k} className={kind === k ? 'on' : ''} onClick={() => { setKind(k); setBrand(''); }}>{k ? <DevIcon kind={k} size={20} /> : null}{T(l)}</button>)}</span>
          {!s ? <span className="dp-brands"><button type="button" className={!brand ? 'on' : ''} onClick={() => setBrand('')}>{T('All')}</button>{brands.map((b) => <button key={b.id} type="button" className={brand === b.id ? 'on' : ''} onClick={() => setBrand(b.id)}>{b.name}</button>)}</span> : null}
          <span className="dp-list">
            {list.length ? list.map((m) => { const on = have.includes(m.id); return (
              <button key={m.id} type="button" className={'dp-it' + (on ? ' on' : '')} onClick={() => { onPick({ id: m.id, name: m.name }); setOpen(false); setQ(''); }}>
                {m.device === 'phone' || !m.device ? <span className="dp-bk"><DevBack brand={m.brand_id} size={40} /></span> : <DevIcon kind={m.device} size={30} />}<b>{m.name}</b><small>{D.brands.find((b) => b.id === m.brand_id)?.name}{stocked.has(m.id) ? '' : ' · ' + T('ask us')}</small>{on ? <i>✓</i> : null}
              </button>); }) : <span className="dp-none">{T('No model matches. Ask Samsoom and we will check.')}</span>}
          </span>
        </div>
        </div>, document.body) : null}
    </span>
  );
}
