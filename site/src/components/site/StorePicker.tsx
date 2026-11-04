'use client';
// R11c (owner): which store? Dubai · Deira is live; Madrid · Plaza Mayor is still "loading" (shown like Our Story's
// PENDING boot line) and cannot be picked yet. Asked by Samsoom after the language, and from the store chip next to the
// logo or Settings at any time. The choice is kept in this browser ('se-store').
import React, { useEffect, useState } from 'react';
import { notify } from '@/lib/notes';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
export type StoreId = 'dxb' | 'mad';
export const getStore = (): StoreId => { try { return (localStorage.getItem('se-store') as StoreId) || 'dxb'; } catch { return 'dxb'; } };
export const hasStore = () => { try { return !!localStorage.getItem('se-store'); } catch { return true; } };
export const setStore = (s: StoreId) => { try { localStorage.setItem('se-store', s); } catch { /* */ } window.dispatchEvent(new CustomEvent('se:store-set', { detail: s })); };

export function StoreCards({ onPick }: { onPick: (s: StoreId) => void }) {
  const [cur, setCur] = useState<StoreId>('dxb'), [asked, setAsked] = useState(false), [pct, setPct] = useState(0);
  useEffect(() => { setCur(getStore()); let p = 0; const iv = window.setInterval(() => { p = p >= 87 ? 62 : p + 1; setPct(p); }, 70); return () => window.clearInterval(iv); }, []);
  return (
    <div className="stp-cards">
      <button type="button" className={'stp-c dxb' + (cur === 'dxb' ? ' on' : '')} onClick={() => { setStore('dxb'); onPick('dxb'); }}>
        <span className="stp-sky" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
        <span className="stp-flag" aria-hidden="true">🇦🇪</span>
        <span className="stp-live"><i />{T('Open now · since 2003')}</span>
        <b>Dubai · Deira</b><small>{T('Al Murar, Deira · our home counter')}</small>
        <span className="stp-go">{cur === 'dxb' ? '✓ ' + T('Your store') : T('Choose Deira') + ' →'}</span>
      </button>
      <div className="stp-c mad" aria-disabled="true">
        <span className="stp-sky" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span className="stp-flag" aria-hidden="true">🇪🇸</span>
        <span className="stp-pend mono">[ ···· ] v5.0 <em>PENDING</em></span>
        <b>Madrid · Plaza Mayor</b><small>{T('Allo Madrid · opening soon')}</small>
        <span className="stp-bar" aria-label={T('Loading')}><i style={{ width: pct + '%' }} /></span>
        <span className="stp-load mono">{T('Loading the Madrid store…')} {pct}%</span>
        <button type="button" className="stp-notify" disabled={asked} onClick={() => { setAsked(true); notify({ id: 'madrid-open', kind: 'info', t: 'Madrid is on its way', d: 'We will tell you here the day Allo Madrid opens.', href: '/story' }); }}>{asked ? '✓ ' + T('We will tell you') : T('Tell me when it opens')}</button>
      </div>
    </div>
  );
}

export function StorePicker() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const o = () => setOpen(true), k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('se:store', o); window.addEventListener('keydown', k); return () => { window.removeEventListener('se:store', o); window.removeEventListener('keydown', k); }; }, []);
  if (!open) return null;
  return (
    <div className="stp-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="stp-box" role="dialog" aria-modal="true" aria-label={T('Choose your store')}>
        <button type="button" className="stp-x" onClick={() => setOpen(false)} aria-label={T('Close')}>✕</button>
        <span className="stp-eb">{T('CHOOSE YOUR STORE')}</span><h3>{T('Which counter are you shopping at?')}</h3>
        <StoreCards onPick={() => window.setTimeout(() => setOpen(false), 450)} />
      </div>
    </div>
  );
}

export function StoreChip() {
  const [s, setS] = useState<StoreId>('dxb');
  useEffect(() => { setS(getStore()); const f = (e: Event) => setS((e as CustomEvent).detail); window.addEventListener('se:store-set', f); return () => window.removeEventListener('se:store-set', f); }, []);
  return (
    <button type="button" className="stp-chip" onClick={() => window.dispatchEvent(new CustomEvent('se:store'))} title={T('Change store')} aria-label={T('Change store')}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
      <span>{s === 'mad' ? 'Madrid' : 'Deira'}</span>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
    </button>
  );
}
