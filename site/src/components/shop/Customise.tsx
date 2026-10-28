'use client';
// P2 · "Customise everything": the shop's full control panel, built like the Find My Part panel (graphite glass, steps on
// the left, live result count). Price range (min/max), brand, model, part, quality, manufacturer, grade, warranty,
// device, colour, rating, availability, sort, how results are shown, and saved setups. Every change counts the results
// live; "Show N results" applies it.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type Filters, EMPTY, apply, data, facets, priceRange, fmt } from '@/lib/catalog';
import { useScrollLock } from '@/lib/scrollLock';
import { T } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';

export type View = { cols: 3 | 4 | 5; list: boolean; trade: boolean; per: 24 | 48 | 96 };
const SECS: [string, string][] = [['price', 'Price'], ['brand', 'Brand'], ['model', 'Model'], ['part', 'Part'], ['quality', 'Quality'], ['maker', 'Manufacturer'], ['grade', 'Grade'], ['warranty', 'Warranty'], ['device', 'Device'], ['colour', 'Colour'], ['rating', 'Rating'], ['avail', 'Availability'], ['sort', 'Sort & view'], ['saved', 'Saved setups']];
const SORTS: [Filters['sort'], string][] = [['best', 'Best match'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['rating', 'Top rated'], ['deal', 'Biggest discount'], ['stock', 'Most in stock'], ['new', 'Newest'], ['name', 'Name A–Z']];
const DEVS: [string, string][] = [['phone', 'Phones'], ['tablet', 'Tablets'], ['watch', 'Watches'], ['laptop', 'Laptops']];
const SW: Record<string, string> = { black: '#1d1d1f', white: '#f5f5f2', blue: '#3a6fd8', gold: '#d9b36a', green: '#4a8f5a', violet: '#7a5ac8', silver: '#c9ccd1', lavender: '#b9a7e6' };
const PKEY = 'se-shop-presets';

export default function Customise({ open, f, view, onClose, onApply }: { open: boolean; f: Filters; view: View; onClose: () => void; onApply: (f: Filters, v: View) => void }) {
  const [x, setX] = useState<Filters>(f), [vw, setVw] = useState<View>(view), [sec, setSec] = useState('price'), [mq, setMq] = useState(''), [name, setName] = useState('');
  const [presets, setPresets] = useState<{ name: string; f: Filters; v: View }[]>([]);
  const body = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useEffect(() => { if (open) { setX(f); setVw(view); try { setPresets(JSON.parse(localStorage.getItem(PKEY) || '[]')); } catch { /* */ } } }, [open, f, view]);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open, onClose]);
  const D = data(), [lo, hi] = useMemo(() => priceRange(), []);
  const n = useMemo(() => (open ? apply(x).length : 0), [open, x]);
  const fc = useMemo(() => (open ? facets(x) : null), [open, x]);
  if (!open || !D || !fc) return null;
  const tog = (k: keyof Filters, v: string) => setX((o) => { const a = o[k] as string[]; return { ...o, [k]: a.includes(v) ? a.filter((y) => y !== v) : [...a, v] }; });
  const has = (k: keyof Filters, v: string) => (x[k] as string[]).includes(v);
  const jump = (id: string) => { setSec(id); const b = body.current, el = b?.querySelector('#cz-' + id) as HTMLElement | null; if (b && el) b.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' }); };
  const spy = () => { const b = body.current; if (!b) return; let cur = SECS[0][0]; for (const [id] of SECS) { const el = b.querySelector('#cz-' + id) as HTMLElement | null; if (el && el.offsetTop - b.scrollTop < 140) cur = id; } setSec(cur); };
  const min = x.min ?? lo, max = x.max ?? hi;
  const models = D.models.filter((m) => (!x.brands.length || x.brands.includes(m.brand_id)) && (fc.models[m.id] || has('models', m.id)) && (!mq || (m.name + ' ' + m.series).toLowerCase().includes(mq.toLowerCase())));
  const parts = Array.from(new Map(Object.keys(fc.parts).map((pid) => { const c = D.categories.find((cc) => cc.part === pid); return [pid, c ? c.one : pid]; })));
  const count = (k: keyof ReturnType<typeof facets>, v: string) => <small className="cz-n">{(fc[k] as Record<string, number>)[v] || 0}</small>;
  const Opt = ({ k, v, label, cnt, sw }: { k: keyof Filters; v: string; label: React.ReactNode; cnt?: React.ReactNode; sw?: string }) => (
    <button type="button" className={'cz-opt' + (has(k, v) ? ' on' : '')} aria-pressed={has(k, v)} onClick={() => tog(k, v)}>
      {sw ? <i className="cz-sw" style={{ background: sw }} /> : <i className="cz-box" />}<span>{label}</span>{cnt}
    </button>
  );
  const savePreset = () => { const nm = name.trim() || T('My setup') + ' ' + (presets.length + 1); const next = [{ name: nm, f: x, v: vw }, ...presets.filter((p) => p.name !== nm)].slice(0, 10); setPresets(next); setName(''); try { localStorage.setItem(PKEY, JSON.stringify(next)); } catch { /* */ } };
  const delPreset = (nm: string) => { const next = presets.filter((p) => p.name !== nm); setPresets(next); try { localStorage.setItem(PKEY, JSON.stringify(next)); } catch { /* */ } };
  const active = (['brands', 'models', 'cats', 'parts', 'grades', 'makers', 'qualities', 'warranty', 'device', 'colours'] as const).reduce((a, k) => a + x[k].length, 0) + (x.min != null || x.max != null ? 1 : 0) + (x.inStock ? 1 : 0) + (x.deals ? 1 : 0) + (x.isNew ? 1 : 0) + (x.rating ? 1 : 0);
  const pct = (v: number) => ((v - lo) / Math.max(1, hi - lo)) * 100;

  return (
    <div className="cz-veil" role="dialog" aria-modal="true" aria-label={T('Customise everything')} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cz">
        <header className="cz-top">
          <span className="cz-tt"><b>{T('Customise everything')}</b><small>{active ? active + ' ' + T('settings on') : T('Nothing set yet: showing every part')}</small></span>
          <span className="cz-live"><i /><b>{fmt(n)}</b> {T('results')}</span>
          <button type="button" className="sp-x" style={{ position: 'static' }} onClick={onClose} aria-label={T('Close')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        </header>
        <nav className="cz-nav" aria-label={T('Sections')}>
          {SECS.map(([id, l]) => <button key={id} type="button" className={sec === id ? 'on' : ''} onClick={() => jump(id)}>{T(l)}</button>)}
        </nav>
        <div className="cz-body" ref={body} onScroll={spy}>
          <section id="cz-price" className="cz-sec">
            <h3>{T('Price')} <small>AED · {T('sample prices')}</small></h3>
            <div className="cz-range">
              <span className="cz-track"><i style={{ left: pct(min) + '%', right: 100 - pct(max) + '%' }} /></span>
              <input type="range" min={lo} max={hi} value={min} aria-label={T('Minimum price')} onChange={(e) => setX({ ...x, min: Math.min(+e.target.value, max - 1) })} />
              <input type="range" min={lo} max={hi} value={max} aria-label={T('Maximum price')} onChange={(e) => setX({ ...x, max: Math.max(+e.target.value, min + 1) })} />
            </div>
            <div className="cz-mm">
              <label><span>{T('Min price')}</span><input type="number" inputMode="numeric" value={x.min ?? ''} placeholder={String(lo)} onChange={(e) => setX({ ...x, min: e.target.value === '' ? null : +e.target.value })} /></label>
              <i />
              <label><span>{T('Max price')}</span><input type="number" inputMode="numeric" value={x.max ?? ''} placeholder={String(hi)} onChange={(e) => setX({ ...x, max: e.target.value === '' ? null : +e.target.value })} /></label>
            </div>
            <div className="cz-quick">{[[0, 50], [50, 150], [150, 400], [400, null]].map(([a, b]) => <button key={String(a)} type="button" className="sp-chip" onClick={() => setX({ ...x, min: a, max: b })}>{b ? 'AED ' + a + '–' + b : 'AED ' + a + '+'}</button>)}</div>
          </section>
          <section id="cz-brand" className="cz-sec">
            <h3>{T('Brand')}</h3>
            <div className="cz-brands">{D.brands.map((b) => (
              <button key={b.id} type="button" className={'cz-brand' + (has('brands', b.id) ? ' on' : '')} aria-pressed={has('brands', b.id)} onClick={() => tog('brands', b.id)}>
                <span className="cz-bl"><SEBrandLogo brand={b.id} h={18} fit="76x20" color="currentColor" /></span><b>{b.name}</b>{count('brands', b.id)}
              </button>
            ))}</div>
          </section>
          <section id="cz-model" className="cz-sec">
            <h3>{T('Model')} {x.models.length ? <small>{x.models.length} {T('chosen')}</small> : null}</h3>
            <input className="cz-q" value={mq} onChange={(e) => setMq(e.target.value)} placeholder={T('Search models')} />
            <div className="cz-models">{models.slice(0, 60).map((m) => <Opt key={m.id} k="models" v={m.id} label={m.name} cnt={count('models', m.id)} />)}{models.length > 60 ? <small className="cz-more">+{models.length - 60} {T('more: type to narrow')}</small> : null}</div>
          </section>
          <section id="cz-part" className="cz-sec">
            <h3>{T('Part')}</h3>
            <div className="cz-opts">{D.categories.filter((c) => !c.soon).map((c) => <Opt key={c.id} k="cats" v={c.id} label={T(c.name)} cnt={count('cats', c.id)} />)}</div>
            {parts.length ? <div className="cz-opts sub">{parts.map(([pid, nm]) => <Opt key={pid} k="parts" v={pid} label={T(nm)} cnt={count('parts', pid)} />)}</div> : null}
          </section>
          <section id="cz-quality" className="cz-sec">
            <h3>{T('Quality')}</h3>
            <div className="cz-opts">{D.qualities.filter((q) => fc.qualities[q.id] || has('qualities', q.id)).map((q) => <Opt key={q.id} k="qualities" v={q.id} label={T(q.name)} cnt={count('qualities', q.id)} />)}</div>
          </section>
          <section id="cz-maker" className="cz-sec">
            <h3>{T('Manufacturer')} <a className="cz-link" href="/brands#makers">{T('What do these mean?')}</a></h3>
            <div className="cz-opts">{D.manufacturers.filter((q) => fc.makers[q.id] || has('makers', q.id)).map((q) => <Opt key={q.id} k="makers" v={q.id} label={q.name} cnt={count('makers', q.id)} />)}</div>
          </section>
          <section id="cz-grade" className="cz-sec">
            <h3>{T('Grade')}</h3>
            <div className="cz-grades">{Object.entries(D.gradeNames).map(([g, nm]) => (
              <button key={g} type="button" className={'cz-grade g-' + g + (has('grades', g) ? ' on' : '')} aria-pressed={has('grades', g)} onClick={() => tog('grades', g)}><b>{nm}</b><small>{D.makerNames[g]}</small>{count('grades', g)}</button>
            ))}</div>
          </section>
          <section id="cz-warranty" className="cz-sec">
            <h3>{T('Warranty')}</h3>
            <div className="cz-opts">{['6 months', '3 months', '1 month'].map((w) => <Opt key={w} k="warranty" v={w} label={T(w)} cnt={count('warranty', w)} />)}</div>
          </section>
          <section id="cz-device" className="cz-sec">
            <h3>{T('Device')}</h3>
            <div className="cz-opts">{DEVS.map(([d, l]) => <Opt key={d} k="device" v={d} label={T(l)} cnt={count('device', d)} />)}</div>
          </section>
          <section id="cz-colour" className="cz-sec">
            <h3>{T('Colour')} <small>{T('back covers and frames')}</small></h3>
            <div className="cz-opts">{D.colours.slice(0, 8).map((c) => <Opt key={c.id} k="colours" v={c.id} label={T(c.name)} sw={SW[c.id] || '#999'} cnt={count('colours', c.id)} />)}</div>
          </section>
          <section id="cz-rating" className="cz-sec">
            <h3>{T('Rating')}</h3>
            <div className="cz-opts">{[0, 3, 4, 4.5].map((r) => <button key={r} type="button" className={'cz-opt' + (x.rating === r ? ' on' : '')} onClick={() => setX({ ...x, rating: r })}><i className="cz-rad" /><span>{r ? '★ ' + r + ' ' + T('& up') : T('Any rating')}</span></button>)}</div>
          </section>
          <section id="cz-avail" className="cz-sec">
            <h3>{T('Availability')}</h3>
            <div className="cz-tg">
              {([['inStock', 'In stock only'], ['deals', 'On offer only'], ['isNew', 'New arrivals only']] as const).map(([k, l]) => (
                <label key={k} className="cz-sw2"><input type="checkbox" checked={x[k]} onChange={(e) => setX({ ...x, [k]: e.target.checked })} /><i /><span>{T(l)}</span></label>
              ))}
            </div>
          </section>
          <section id="cz-sort" className="cz-sec">
            <h3>{T('Sort & view')}</h3>
            <div className="cz-opts">{SORTS.map(([k, l]) => <button key={k} type="button" className={'cz-opt' + (x.sort === k ? ' on' : '')} onClick={() => setX({ ...x, sort: k })}><i className="cz-rad" /><span>{T(l)}</span></button>)}</div>
            <div className="cz-view">
              <span><small>{T('Layout')}</small><span className="cz-seg">{[[false, 'Grid'], [true, 'List']].map(([l, nm]) => <button key={String(l)} type="button" className={vw.list === l ? 'on' : ''} onClick={() => setVw({ ...vw, list: l as boolean })}>{T(nm as string)}</button>)}</span></span>
              <span><small>{T('Cards per row')}</small><span className="cz-seg">{([3, 4, 5] as const).map((c) => <button key={c} type="button" className={vw.cols === c ? 'on' : ''} onClick={() => setVw({ ...vw, cols: c })}>{c}</button>)}</span></span>
              <span><small>{T('Per page')}</small><span className="cz-seg">{([24, 48, 96] as const).map((c) => <button key={c} type="button" className={vw.per === c ? 'on' : ''} onClick={() => setVw({ ...vw, per: c })}>{c}</button>)}</span></span>
            </div>
          </section>
          <section id="cz-saved" className="cz-sec">
            <h3>{T('Saved setups')}</h3>
            <div className="cz-save"><input className="cz-q" value={name} onChange={(e) => setName(e.target.value)} placeholder={T('Name this setup, e.g. “Daily iPhone screens”')} /><button type="button" className="sp-btn sm" onClick={savePreset}>{T('Save')}</button></div>
            <div className="cz-presets">{presets.length ? presets.map((p) => (
              <span key={p.name} className="cz-preset"><button type="button" onClick={() => { setX(p.f); setVw(p.v); }}><b>{p.name}</b><small>{fmt(apply(p.f).length)} {T('results')}</small></button><button type="button" className="ss-del" onClick={() => delPreset(p.name)} aria-label={T('Remove')}>×</button></span>
            )) : <small className="cz-more">{T('Save the setups you use every day and switch with one tap.')}</small>}</div>
          </section>
        </div>
        <footer className="cz-foot">
          <button type="button" className="sp-btn ghost" onClick={() => setX({ ...EMPTY, q: x.q })}>{T('Reset all')}</button>
          <button type="button" className="sp-btn" onClick={() => onApply(x, vw)}>{T('Show')} {fmt(n)} {T('results')}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
        </footer>
      </div>
    </div>
  );
}
