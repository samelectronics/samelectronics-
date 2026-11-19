'use client';
// P2 · The shop's search: free typing like the home hero, forgiving typos ("iphon 13 scren" → iPhone 13 screen), with
// suggestions (models, brands, parts) as you type and your recent searches (kept on this device, removable).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { suggest, fix, products, aed, byId, data } from '@/lib/catalog';
import { GradeTag } from './Tags';
import { store, useStore } from '@/lib/store';
import { T } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { brandInk } from '@/lib/brandInk';

const TRY = ['iPhone 13 screen', 'A54 battery', 'Redmi Note 12 charging flex', 'S23 back cover', 'Pixel 7 camera'];

export default function ShopSearch({ q, onQ, onFmp, compact, count, onFilters, nFilters = 0 }: { q: string; onQ: (q: string) => void; onFmp: () => void; compact?: boolean; count?: number; onFilters?: () => void; nFilters?: number }) {
  const [v, setV] = useState(q), [open, setOpen] = useState(false), [hi, setHi] = useState(-1), [ph, setPh] = useState(0), [nw, setNw] = useState(false);
  // in the docked bar on a phone or tablet there is only room for a short hint
  useEffect(() => { if (!compact) return; const f = () => setNw(window.innerWidth <= 1100); f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, [compact]);
  const narrow = compact && nw;
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
          placeholder={narrow ? T('Search') : T('Search') + ' “' + T(TRY[ph]) + '”'} aria-label={T('Search the shop')} autoComplete="off" spellCheck={false} />
        {v ? <button type="button" className="ss-clr" onClick={() => { setV(''); onQ(''); inp.current?.focus(); }} aria-label={T('Clear')}>×</button> : <kbd className="ss-kbd">/</kbd>}
        {count != null ? <span className="ss-n" aria-live="polite"><b>{count.toLocaleString('en-US')}</b> {T('results')}</span> : null}
        {/* owner (19 Nov): Filters sits INSIDE the search, beside the send button */}
        {onFilters ? <button type="button" className="ss-flt" onClick={onFilters} aria-label={T('Filters')} title={T('Filters')}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>{nFilters ? <em>{nFilters}</em> : null}</button> : null}
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
                const mark = (txt: string) => { if (!words.length) return txt; const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig'); return txt.split(re).map((x, k) => (k % 2 ? <strong key={k} className="ss-m">{x}</strong> : x)); };
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
                              <span className="ss-txt"><b>{mark(s.kind === 'part' ? s.label.split(' · ')[0] : s.label)}</b><small>{s.brand && s.img ? <SEBrandLogo brand={s.brand} h={10} fit="44x12" color={brandInk(s.brand)} /> : null}{T(s.sub)}</small></span>
                              {s.kind === 'part' && s.id && byId(s.id) ? <GradeTag g={byId(s.id)!.grade} name={byId(s.id)!.gradeName} size="sm" /> : null}
                              {s.price ? <span className="ss-pr">{aed(s.price, false)}</span> : (() => { const ps = products().filter((p) => (s.kind === 'model' ? p.model_id === s.model : p.brand === s.brand)); return ps.length ? <span className="ss-cnt"><b>{ps.length} {T('parts')}</b><small>{T('from')} {aed(Math.min(...ps.map((p) => p.price)), false)}</small></span> : <span className="ss-cnt"><small>{T('ask us')}</small></span>; })()}
                              <svg className="ss-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
                            </button>); })}
                        </div>) : null)}
                    </div>
                    {cur ? (
                      <div className="ss-prev" key={cur.label}>
                        <span className="ss-prev-img">{pic ? <img src={pic} alt="" /> : null}</span>
                        <span className="ss-prev-k">{cur.brand ? <SEBrandLogo brand={cur.brand} h={14} fit="64x16" color={brandInk(cur.brand)} /> : null}<i>{cur.kind === 'part' ? T('Part') : cur.kind === 'model' ? T('Model') : T('Brand')}</i></span>
                        <b className="ss-prev-t">{cur.label}</b>
                        <span className="ss-prev-g">{rel.slice(0, 5).map((p) => <span key={p.id}><GradeTag g={p.grade} name={p.gradeName} size="sm" /><em>{aed(p.price, false)}</em></span>)}</span>
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
                {/* owner (18 Nov): a richer start: browse by part, and the quick tools */}
                <span className="ss-h">{T('Browse by part')}</span>
                <span className="ss-cats">{(data()?.categories || []).filter((c) => !(c as { soon?: boolean }).soon).slice(0, 7).map((c) => <button key={c.id} type="button" onClick={() => go(T(c.name))}><img src={'/assets/pose/' + ({ SCR: 'solo-scr', BAT: 'solo-bat', FLX: 'solo-flx', BCV: 'solo-bcv', FRM: 'solo-frm', CAM: 'solo-cam', SML: 'solo-sml' } as Record<string, string>)[c.id] + '-240.webp'} alt="" /><small>{T(c.name)}</small></button>)}</span>
                <span className="ss-tools">
                  <button type="button" className="y" onClick={() => { setOpen(false); onFmp(); }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>{T('Find My Part')}<small>{T('Brand → model → part')}</small></button>
                  <a href="/samsoom"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{T('Ask Samsoom')}<small>{T('Describe it in your words')}</small></a>
                  <a href="/samsoom?tool=photo"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2.5" /><circle cx="12" cy="13" r="3.6" /></svg>{T('Search by photo')}<small>{T('A label or Settings → About')}</small></a>
                </span>
              </>}
          {!v.trim() || sug.length || (fx && fx.changed) ? null : <span className="ss-hint">{T('No quick match. Press Enter to search everything.')}</span>}
        </div>
      ) : null}
    </div>
  );
}
