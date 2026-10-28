'use client';
// P2 · The shop's search: free typing like the home hero, forgiving typos ("iphon 13 scren" → iPhone 13 screen), with
// suggestions (models, brands, parts) as you type and your recent searches (kept on this device, removable).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { suggest, fix } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { T } from '@/components/site/ui';

const TRY = ['iPhone 13 screen', 'A54 battery', 'Redmi Note 12 charging flex', 'S23 back cover', 'Pixel 7 camera'];

export default function ShopSearch({ q, onQ, onFmp }: { q: string; onQ: (q: string) => void; onFmp: () => void }) {
  const [v, setV] = useState(q), [open, setOpen] = useState(false), [hi, setHi] = useState(-1), [ph, setPh] = useState(0);
  const st = useStore(), box = useRef<HTMLDivElement>(null), inp = useRef<HTMLInputElement>(null);
  useEffect(() => setV(q), [q]);
  useEffect(() => { const iv = window.setInterval(() => setPh((n) => (n + 1) % TRY.length), 2600); return () => window.clearInterval(iv); }, []);
  useEffect(() => { const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener('pointerdown', out); return () => document.removeEventListener('pointerdown', out); }, []);
  // "/" focuses the search from anywhere in the shop
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === '/' && !(e.target as HTMLElement).closest('input,textarea')) { e.preventDefault(); inp.current?.focus(); } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  const sug = useMemo(() => (v.trim() ? suggest(v, 8) : []), [v]);
  const fx = useMemo(() => (v.trim().length > 2 ? fix(v) : null), [v]);
  const go = (s: string) => { store.searched(s); onQ(s); setV(s); setOpen(false); inp.current?.blur(); };
  const items = v.trim() ? sug.map((s) => s.q) : st.recent;
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi((h) => Math.min(items.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(-1, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(hi >= 0 && items[hi] ? items[hi] : v); }
    else if (e.key === 'Escape') setOpen(false);
  };
  return (
    <div ref={box} className={'ss' + (open ? ' open' : '')} data-tour-step="1" data-tour-title="Search anything" data-tour-text="Type a model, a part or both. Spelling mistakes are fine: I will understand.">
      <div className="ss-bar">
        <svg className="ss-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input ref={inp} value={v} onChange={(e) => { setV(e.target.value); setOpen(true); setHi(-1); }} onFocus={() => setOpen(true)} onKeyDown={key}
          placeholder={T('Search') + ' “' + T(TRY[ph]) + '”'} aria-label={T('Search the shop')} autoComplete="off" spellCheck={false} />
        {v ? <button type="button" className="ss-clr" onClick={() => { setV(''); onQ(''); inp.current?.focus(); }} aria-label={T('Clear')}>×</button> : <kbd className="ss-kbd">/</kbd>}
        <button type="button" className="ss-fmp" onClick={onFmp}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 6h16M7 12h10M10 18h4" /></svg><span>Find My Part</span></button>
        <button type="button" className="ss-go" onClick={() => go(v)}>{T('Search')}</button>
      </div>
      {open && (items.length || (fx && fx.changed)) ? (
        <div className="ss-drop" role="listbox">
          {fx && fx.changed && v.trim() ? <button type="button" className="ss-fix" onClick={() => go(fx.fixed)}>{T('Did you mean')} <b>{fx.fixed}</b>?</button> : null}
          {!v.trim() && st.recent.length ? <span className="ss-h">{T('Recent searches')}<button type="button" onClick={() => store.forget()}>{T('Clear all')}</button></span> : null}
          {v.trim()
            ? sug.map((s, i) => (
                <button key={s.kind + s.label} type="button" role="option" aria-selected={hi === i} className={'ss-it' + (hi === i ? ' hi' : '')} onMouseEnter={() => setHi(i)} onClick={() => go(s.q)}>
                  <span className={'ss-k k-' + s.kind}>{s.kind === 'model' ? 'MODEL' : s.kind === 'brand' ? 'BRAND' : 'PART'}</span>
                  <b>{s.label}</b><small>{s.sub}</small>
                </button>
              ))
            : st.recent.map((r, i) => (
                <span key={r} className={'ss-it rec' + (hi === i ? ' hi' : '')} onMouseEnter={() => setHi(i)}>
                  <button type="button" onClick={() => go(r)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{r}</button>
                  <button type="button" className="ss-del" onClick={() => store.forget(r)} aria-label={T('Remove')}>×</button>
                </span>
              ))}
        </div>
      ) : null}
    </div>
  );
}
