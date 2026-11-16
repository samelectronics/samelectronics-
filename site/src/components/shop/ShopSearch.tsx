'use client';
// P2 · The shop's search: free typing like the home hero, forgiving typos ("iphon 13 scren" → iPhone 13 screen), with
// suggestions (models, brands, parts) as you type and your recent searches (kept on this device, removable).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { suggest, fix, products, aed } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { T } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { brandInk } from '@/lib/brandInk';

const TRY = ['iPhone 13 screen', 'A54 battery', 'Redmi Note 12 charging flex', 'S23 back cover', 'Pixel 7 camera'];

export default function ShopSearch({ q, onQ, onFmp, compact, count }: { q: string; onQ: (q: string) => void; onFmp: () => void; compact?: boolean; count?: number }) {
  const [v, setV] = useState(q), [open, setOpen] = useState(false), [hi, setHi] = useState(-1), [ph, setPh] = useState(0);
  const st = useStore(), box = useRef<HTMLDivElement>(null), inp = useRef<HTMLInputElement>(null);
  useEffect(() => setV(q), [q]);
  useEffect(() => { const iv = window.setInterval(() => setPh((n) => (n + 1) % TRY.length), 2600); return () => window.clearInterval(iv); }, []);
  useEffect(() => { const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener('pointerdown', out); return () => document.removeEventListener('pointerdown', out); }, []);
  // "/" focuses the search from anywhere in the shop
  useEffect(() => { if (compact) return; const k = (e: KeyboardEvent) => { if (e.key === '/' && !(e.target as HTMLElement).closest('input,textarea')) { e.preventDefault(); inp.current?.focus(); } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  const sug = useMemo(() => (v.trim() ? suggest(v, 9) : []), [v]);
  const fx = useMemo(() => (v.trim().length > 2 ? fix(v) : null), [v]);
  const go = (s: string) => { store.searched(s); onQ(s); setV(s); setOpen(false); inp.current?.blur(); };
  const items = v.trim() ? sug.map((s) => s.q) : [...st.recent, ...TRY.filter((t) => !st.recent.includes(t)).slice(0, 4)];
  void onFmp;
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi((h) => Math.min(items.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(-1, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(hi >= 0 && items[hi] ? items[hi] : v); }
    else if (e.key === 'Escape') setOpen(false);
  };
  return (
    <div ref={box} className={'ss' + (open ? ' open' : '') + (compact ? ' sm' : '')} {...(compact ? {} : { 'data-tour-step': '1', 'data-tour-title': 'Search anything', 'data-tour-text': 'Type a model, a part or both. Spelling mistakes are fine: I will understand.' })}>
      <div className="ss-bar">
        <svg className="ss-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input ref={inp} value={v} onChange={(e) => { setV(e.target.value); setOpen(true); setHi(-1); }} onFocus={() => setOpen(true)} onKeyDown={key}
          placeholder={T('Search') + ' “' + T(TRY[ph]) + '”'} aria-label={T('Search the shop')} autoComplete="off" spellCheck={false} />
        {v ? <button type="button" className="ss-clr" onClick={() => { setV(''); onQ(''); inp.current?.focus(); }} aria-label={T('Clear')}>×</button> : <kbd className="ss-kbd">/</kbd>}
        {count != null ? <span className="ss-n" aria-live="polite"><b>{count.toLocaleString('en-US')}</b> {T('results')}</span> : null}
        <button type="button" className="ss-go" onClick={() => go(v)}>{T('Search')}</button>
      </div>
      {open ? (
        <div className="ss-drop" role="listbox">
          {fx && fx.changed && v.trim() ? <button type="button" className="ss-fix" onClick={() => go(fx.fixed)}>{T('Did you mean')} <b>{fx.fixed}</b>?</button> : null}
          {!v.trim() && st.recent.length ? <span className="ss-h">{T('Recent searches')}<button type="button" onClick={() => store.forget()}>{T('Clear all')}</button></span> : null}
          {v.trim()
            ? (() => {
                // owner (17 Nov): a premium two-column search: grouped results on the left (logo, picture, highlighted match,
                // price), a live preview of the highlighted one on the right
                const words = v.trim().toLowerCase().split(/\s+/).filter((w) => w.length > 1);
                const mark = (txt: string) => { if (!words.length) return txt; const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig'); return txt.split(re).map((x, k) => (k % 2 ? <mark key={k}>{x}</mark> : x)); };
                const cur = sug[Math.max(0, hi)] || sug[0];
                const rel = cur ? products().filter((p) => (cur.kind === 'part' ? p.model_id === cur.model && p.category === products().find((x) => x.id === cur.id)?.category : cur.kind === 'model' ? p.model_id === cur.model : p.brand === cur.brand)) : [];
                const pic = cur?.img || rel.find((p) => p.img)?.img;
                const groups: [string, typeof sug][] = [['MODELS', sug.filter((x) => x.kind !== 'part')], ['PARTS', sug.filter((x) => x.kind === 'part')]];
                let n = -1;
                return (
                  <div className="ss-pal">
                    <div className="ss-list">
                      {groups.map(([g, xs]) => xs.length ? (
                        <div key={g} className="ss-grp"><span className="ss-gh">{T(g)}<i>{xs.length}</i></span>
                          {xs.map((s) => { n++; const i = n; return (
                            <button key={s.kind + s.label} type="button" role="option" aria-selected={hi === i} className={'ss-it' + (hi === i ? ' hi' : '')} onMouseEnter={() => setHi(i)} onClick={() => go(s.q)}>
                              <span className="ss-thumb">{s.img ? <img src={s.img.replace(/-480\.webp$/, '-240.webp')} alt="" /> : s.brand ? <SEBrandLogo brand={s.brand} h={14} fit="56x16" color={brandInk(s.brand)} /> : null}</span>
                              <span className="ss-txt"><b>{mark(s.label)}</b><small>{s.brand && s.img ? <SEBrandLogo brand={s.brand} h={10} fit="44x12" color={brandInk(s.brand)} /> : null}{T(s.sub)}</small></span>
                              {s.price ? <span className="ss-pr">{aed(s.price, false)}</span> : <span className={'ss-k k-' + s.kind}>{s.kind === 'model' ? T('Model') : T('Brand')}</span>}
                            </button>); })}
                        </div>) : null)}
                    </div>
                    {cur ? (
                      <div className="ss-prev" key={cur.label}>
                        <span className="ss-prev-img">{pic ? <img src={pic} alt="" /> : null}</span>
                        <span className="ss-prev-k">{cur.brand ? <SEBrandLogo brand={cur.brand} h={14} fit="64x16" color={brandInk(cur.brand)} /> : null}<i>{cur.kind === 'part' ? T('Part') : cur.kind === 'model' ? T('Model') : T('Brand')}</i></span>
                        <b className="ss-prev-t">{cur.label}</b>
                        <span className="ss-prev-g">{rel.slice(0, 4).map((p) => <span key={p.id}><i>{p.gradeName}</i><em>{aed(p.price, false)}</em></span>)}</span>
                        <span className="ss-prev-n">{rel.length} {T('parts')}</span>
                        <button type="button" className="ss-prev-go" onClick={() => go(cur.q)}>{T('Show results')} →</button>
                      </div>
                    ) : null}
                  </div>
                );
              })()
            : <>
                {st.recent.map((r, i) => (
                  <span key={r} className={'ss-it rec' + (hi === i ? ' hi' : '')} onMouseEnter={() => setHi(i)}>
                    <button type="button" onClick={() => go(r)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{r}</button>
                    <button type="button" className="ss-del" onClick={() => store.forget(r)} aria-label={T('Remove')}>×</button>
                  </span>
                ))}
                <span className="ss-h">{T('Popular right now')}</span>
                <span className="ss-pop">{items.slice(st.recent.length).map((t, k) => <button key={t} type="button" className={'sp-chip' + (hi === st.recent.length + k ? ' y' : '')} onClick={() => go(T(t))}>{T(t)}</button>)}</span>
                {!st.recent.length ? <span className="ss-hint">{T('Your searches will be kept here on this device.')}</span> : null}
              </>}
          {!v.trim() || sug.length || (fx && fx.changed) ? null : <span className="ss-hint">{T('No quick match. Press Enter to search everything.')}</span>}
        </div>
      ) : null}
    </div>
  );
}
