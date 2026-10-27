// Hero 4 · Find My Part, rebuilt on the boss's Excel (docs/Products.xlsx, src/content/catalog.ts):
//   Catalog (level 1) → Brand (level 2) → Device: phones / tablets / watches → Models (level 3, multi-select, series
//   filter) → Parts (level 4, the Excel's 30 parts, multi-select) → Specs (level 5: quality, manufacturer, colour,
//   multi-select) → open the shop with those filters.
// Every brand is its own card (Honor is a brand of its own; no family headings), every logo has the same optical size.
// Stock and prices are sample data from SE_DATA; a model with nothing in stock says "On request", never "0 in stock".
'use client';
import DeviceIcon from './DeviceIcon';
import React, { useEffect, useMemo, useState } from 'react';
import { useScrollLock, stopWheel } from '@/lib/scrollLock';
import SEBrandLogo from '../dc/SEBrandLogo';

type Model = { id: string; brand_id: string; series: string | null; name: string; model_numbers: string[]; device: 'phone' | 'tablet' | 'watch' };
type Product = { id: string; model_id: string; part: string; quality: string; manufacturer: string; stock_qty: number; retail_price: number };
type Named = { id: string; name: string };
type Init = { b?: string | null; m?: string | null; c?: string | null; q?: string };
type Data = { brands: Named[]; models: Model[]; products: Product[]; qualities: Named[]; manufacturers: Named[]; colours: Named[] };
type Cat = { id: string; name: string; ar: string; detailed: boolean };
declare global { interface Window { SE_DATA?: Data & Record<string, unknown>; SE_CATALOG?: { parts: Named[] } & Record<string, unknown> } }

const CATS: Cat[] = [
  { id: 'parts', name: 'Mobile Spare Parts', ar: 'قطع غيار موبايل', detailed: true },
  { id: 'accessories', name: 'Accessories', ar: 'اكسسوار و ملحقات', detailed: false },
  { id: 'tools', name: 'Tools', ar: 'عدد صيانة', detailed: false },
  { id: 'repair', name: 'Repair Service', ar: 'خدمة الاصلاح', detailed: false },
  { id: 'phones', name: 'Mobile Phones', ar: 'هواتف متحركة', detailed: false },
  { id: 'other', name: 'Other Products', ar: 'منتجات اخرى', detailed: false },
];
const STEPS = ['Brand', 'Device', 'Models', 'Parts', 'Specs'];
const DEV: { id: Model['device']; name: string; one: string }[] = [
  { id: 'phone', name: 'Phones', one: 'phone' },
  { id: 'tablet', name: 'Tablets', one: 'tablet' },
  { id: 'watch', name: 'Watches', one: 'watch' },
];
// the Excel's 30 parts, grouped the way a technician looks for them
const PART_GROUPS: [string, string[]][] = [
  ['Display', ['p01', 'p02', 'p28', 'p27', 'p30']],
  ['Power & charging', ['p03', 'p07', 'p08', 'p09']],
  ['Housing', ['p04', 'p05', 'p06', 'p29', 'p26']],
  ['Cameras', ['p10', 'p11', 'p12', 'p13', 'p14']],
  ['Audio & sensors', ['p15', 'p16', 'p17', 'p18', 'p21']],
  ['Flex & small parts', ['p19', 'p20', 'p22', 'p23', 'p24', 'p25']],
];
const SWATCH: Record<string, string> = { black: '#1d1d1f', white: '#f4f4f2', blue: '#3a6ea5', gold: '#d9b77a', green: '#4c7a5a', violet: '#7d5ba6', silver: '#c9ccd1', lavender: '#b9a7d9', 'lavender-lilac': '#c8a9d8', 'yellow-lemon': '#f2dc5d', 'mint-green': '#9ed9c0', 'blue-ice': '#bcd8ec', red: '#c8302f', ping: '#f2b8c6', pink: '#f2b8c6', mint: '#a8e0c8', navy: '#25335a', orange: '#f08a24', graphite: '#4a4c50', burgundy: '#6e1f2f', cream: '#efe6d2', 'cream-beige': '#e8dcc0', bronza: '#9a6b3f', bronze: '#9a6b3f' };

const Icon = ({ d, s = 22 }: { d: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const CHECK = 'M5 12.5l4.5 4.5L19 7.5';
const k = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n));
const toggle = (a: string[], x: string) => (a.includes(x) ? a.filter((y) => y !== x) : [...a, x]);

export default function FindMyPart({ open, init, onClose, onShop }: { open: boolean; init: Init; onClose: () => void; onShop: (summary: string, count: number) => void }) {
  const [D, setD] = useState<Data | null>(null);
  const [parts, setParts] = useState<Named[]>([]);
  const [cat, setCat] = useState('parts');
  const [step, setStep] = useState(0);
  const [b, setB] = useState<string | null>(null);
  const [dev, setDev] = useState<Model['device'] | null>(null);
  const [ser, setSer] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [ms, setMs] = useState<string[]>([]);
  const [ps, setPs] = useState<string[]>([]);
  const [qu, setQu] = useState<string[]>([]);
  const [mf, setMf] = useState<string[]>([]);
  const [co, setCo] = useState<string[]>([]);
  useScrollLock(open);

  useEffect(() => {
    if (D) return;
    const iv = window.setInterval(() => { if (window.SE_DATA && window.SE_DATA.models && window.SE_CATALOG) { window.clearInterval(iv); setD(window.SE_DATA as Data); setParts(((window.SE_CATALOG.parts || []) as unknown as ([string, string] | Named)[]).map((p) => (Array.isArray(p) ? { id: p[0], name: p[1] } : p))); } }, 80);
    return () => window.clearInterval(iv);
  }, [D]);

  // open at the place the visitor came from (a brand in the menu, a model, a part category, a search)
  useEffect(() => {
    if (!open || !D) return;
    const m = init.m ? D.models.find((x) => x.id === init.m) : null;
    const bb = m ? m.brand_id : init.b || null;
    setCat('parts'); setB(bb); setDev(m ? m.device : null); setSer(m ? m.series : null); setMs(m ? [m.id] : []); setQ(init.q || '');
    const cp = init.c ? (D as unknown as { categories: { id: string; part: string }[] }).categories.find((c) => c.id === init.c) : null;
    setPs(cp && cp.part ? [cp.part] : []); setQu([]); setMf([]); setCo([]);
    setStep(m ? (cp ? 4 : 3) : bb ? 1 : init.q ? 2 : 0);
  }, [open, D]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const idx = useMemo(() => {
    if (!D) return null;
    const byModel: Record<string, Product[]> = {};
    D.products.forEach((p) => { (byModel[p.model_id] = byModel[p.model_id] || []).push(p); });
    const units = (l: Product[]) => l.reduce((t, p) => t + (p.stock_qty || 0), 0);
    const brandStock: Record<string, number> = {}, brandModels: Record<string, number> = {};
    D.models.forEach((m) => { brandModels[m.brand_id] = (brandModels[m.brand_id] || 0) + 1; brandStock[m.brand_id] = (brandStock[m.brand_id] || 0) + units(byModel[m.id] || []); });
    return { byModel, units, brandStock, brandModels };
  }, [D]);

  if (!open) return null;
  const ar = typeof document !== 'undefined' && document.documentElement.lang === 'ar';
  // every word goes through the dictionary here (numbers stay outside), so nothing English is left inside Arabic
  const T = (x: string) => (ar && window.seI18n ? window.seI18n.tr(x) : x);
  const brand = D && b ? D.brands.find((x) => x.id === b) : null;
  const bModels = D && b ? D.models.filter((m) => m.brand_id === b) : [];
  const devCount = (d: string) => bModels.filter((m) => m.device === d).length;
  const dModels = bModels.filter((m) => !dev || m.device === dev);
  const series = [...new Set(dModels.map((m) => m.series).filter(Boolean))] as string[];
  const qq = q.toLowerCase().replace(/[\s-]/g, '');
  const stockOf = (id: string) => (idx ? idx.units(idx.byModel[id] || []) : 0);
  const shown = (D && !b && qq ? D.models : dModels)
    .filter((m) => (!ser || m.series === ser) && (!qq || (m.name + m.model_numbers.join('')).toLowerCase().replace(/[\s-]/g, '').includes(qq)))
    .sort((x, y) => (stockOf(y.id) > 0 ? 1 : 0) - (stockOf(x.id) > 0 ? 1 : 0));
  // the products the current choice points at (models ∩ parts ∩ quality ∩ manufacturer)
  const scopeModels = ms.length ? ms : dModels.map((m) => m.id);
  const inScope = (idx && D ? scopeModels.flatMap((id) => idx.byModel[id] || []) : []).filter((p) => (!ps.length || ps.includes(p.part)));
  const result = inScope.filter((p) => (!qu.length || qu.includes(p.quality)) && (!mf.length || mf.includes(p.manufacturer)));
  const partCount = (pid: string) => (idx && D ? scopeModels.flatMap((id) => idx.byModel[id] || []).filter((p) => p.part === pid).length : 0);
  const specCount = (key: 'quality' | 'manufacturer', id: string) => inScope.filter((p) => p[key] === id).length;
  const pName = (id: string) => (parts.find((p) => p.id === id) || { name: id }).name;
  const canNext = step === 0 ? !!b : step === 1 ? !!dev : step === 2 ? ms.length > 0 : true;
  const go = (n: number) => setStep(Math.max(0, Math.min(4, n)));
  const summary = [brand && brand.name, dev && T(DEV.find((d) => d.id === dev)?.name || ''), ms.length ? (ms.length === 1 ? D?.models.find((m) => m.id === ms[0])?.name : ms.length + ' ' + T('models')) : null, ps.length ? (ps.length === 1 ? T(pName(ps[0])) : ps.length + ' ' + T('parts')) : null].filter(Boolean).join(ar ? ' ‹ ' : ' › ');
  const shop = () => onShop(summary || T('All parts'), result.length);
  const c0 = CATS.find((c) => c.id === cat) || CATS[0];

  return (
    <div className="fp-scrim" onClick={onClose} role="presentation" data-no-i18n="">
      <div className="fp" role="dialog" aria-modal="true" aria-label="Find My Part" onClick={(e) => e.stopPropagation()} {...stopWheel}>
        <header className="fp-head">
          <div className="fp-title">
            <span className="fp-eb">{T('FIND MY PART')}</span>
            <b>{T('Brand, model, part, grade. In seconds.')}</b>
          </div>
          <ol className="fp-steps">
            {STEPS.map((s, i) => (
              <li key={s} className={(i === step ? 'on' : '') + (i < step ? ' done' : '')}>
                <button type="button" disabled={i > step} onClick={() => go(i)}>
                  <i>{i < step ? <Icon d={CHECK} s={12} /> : i + 1}</i>
                  <span>{T(s)}</span>
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="fp-x" onClick={onClose} aria-label={T('Close')}><Icon d="M6 6l12 12M18 6L6 18" s={18} /></button>
        </header>

        <nav className="fp-cats" aria-label="Catalog">
          {CATS.map((c) => (
            <button key={c.id} type="button" className={c.id === cat ? 'on' : ''} onClick={() => setCat(c.id)}>
              {ar ? c.ar : c.name}
              {!c.detailed ? <small>{T('Soon')}</small> : null}
            </button>
          ))}
        </nav>

        <div className="fp-body">
          {!c0.detailed ? (
            <div className="fp-soon">
              <b>{ar ? c0.ar : c0.name}</b>
              <p>{T('This part of the catalogue is being prepared. Ask us on WhatsApp and we will check it for you today.')}</p>
              <a className="fp-btn" href="https://wa.me/971503420015" target="_blank" rel="noreferrer">{T('Ask on WhatsApp')}</a>
            </div>
          ) : step === 0 ? (
            <div className="fp-brands">
              {(D ? D.brands : []).map((x) => (
                idx && !idx.brandModels[x.id] ? (
                  <a key={x.id} className="fp-brand fp-brand-soon" href={'https://wa.me/971503420015?text=' + encodeURIComponent('Hello Sam Electronics, I need a ' + x.name + ' part.')} target="_blank" rel="noreferrer">
                    <span className="fp-logo"><SEBrandLogo brand={x.id} h="30" fit="132x30" color="#FFFFFF" /></span>
                    <span className="fp-bm">{T('Models coming soon')}</span>
                    <span className="fp-bs">{T('Ask us on WhatsApp')}</span>
                  </a>
                ) : (
                <button key={x.id} type="button" className={'fp-brand' + (x.id === b ? ' on' : '')} onClick={() => { if (x.id !== b) { setDev(null); setSer(null); setMs([]); } setB(x.id); go(1); }}>
                  <span className="fp-logo"><SEBrandLogo brand={x.id} h="30" fit="132x30" color={x.id === b ? '#F7C032' : '#FFFFFF'} /></span>
                  <span className="fp-bm">{idx ? idx.brandModels[x.id] || 0 : 0} {T('models')}</span>
                  <span className="fp-bs">{idx && idx.brandStock[x.id] ? k(idx.brandStock[x.id]) + ' ' + T('in stock') : T('On request')}</span>
                </button>
                )
              ))}
            </div>
          ) : step === 1 ? (
            <div className="fp-devs">
              {DEV.map((d) => {
                const n = devCount(d.id), sers = [...new Set(bModels.filter((m) => m.device === d.id).map((m) => m.series).filter(Boolean))];
                return (
                  <button key={d.id} type="button" className={'fp-dev' + (dev === d.id ? ' on' : '')} disabled={!n} onClick={() => { if (d.id !== dev) { setSer(null); setMs([]); } setDev(d.id); go(2); }}>
                    <span className="fp-dev-ic"><DeviceIcon kind={d.id} size={34} /></span>
                    <b>{T(d.name)}</b>
                    <span>{n ? n + ' ' + T('models') : T('None listed')}</span>
                    {sers.length ? <small>{sers.join(' · ')}</small> : null}
                  </button>
                );
              })}
            </div>
          ) : step === 2 ? (
            <div className="fp-models">
              <aside className="fp-ser">
                <button type="button" className={!ser ? 'on' : ''} onClick={() => setSer(null)}>{T('All')} <em>{dModels.length}</em></button>
                {series.map((x) => (
                  <button key={x} type="button" className={ser === x ? 'on' : ''} onClick={() => setSer(x)}>{x} <em>{dModels.filter((m) => m.series === x).length}</em></button>
                ))}
              </aside>
              <div className="fp-mcol">
                <div className="fp-mbar">
                  <label className="fp-search">
                    <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5" s={16} />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Search a model or model number')} />
                  </label>
                  <button type="button" className="fp-all" onClick={() => setMs(shown.every((m) => ms.includes(m.id)) ? ms.filter((id) => !shown.some((m) => m.id === id)) : [...new Set([...ms, ...shown.map((m) => m.id)])])}>
                    {shown.length && shown.every((m) => ms.includes(m.id)) ? T('Clear these') : T('Select all') + ' ' + shown.length}
                  </button>
                </div>
                <div className="fp-mgrid">
                  {shown.map((m) => {
                    const on = ms.includes(m.id), st = stockOf(m.id);
                    return (
                      <button key={m.id} type="button" className={'fp-model' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setMs(toggle(ms, m.id))}>
                        <span className="fp-ck">{on ? <Icon d={CHECK} s={12} /> : null}</span>
                        <span className="fp-mic"><DeviceIcon kind={m.device} size={20} /></span>
                        <span className="fp-mt">
                          <b data-no-i18n="">{m.name}</b>
                          <small className={st ? 'in' : ''}>{st ? st + ' ' + T('parts in stock') : T('On request')}</small>
                        </span>
                      </button>
                    );
                  })}
                  {!shown.length ? <p className="fp-empty">{T('No model matches this search. Try the model number on the back of the phone.')}</p> : null}
                </div>
              </div>
            </div>
          ) : step === 3 ? (
            <div className="fp-parts">
              {PART_GROUPS.map(([g, ids]) => (
                <section key={g}>
                  <h4>{T(g)}</h4>
                  {ids.map((id) => {
                    const on = ps.includes(id), n = partCount(id);
                    return (
                      <button key={id} type="button" className={'fp-part' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setPs(toggle(ps, id))}>
                        <span className="fp-ck">{on ? <Icon d={CHECK} s={12} /> : null}</span>
                        <span className="fp-pn">{T(pName(id))}</span>
                        <em className={n ? 'in' : ''}>{n ? n + ' ' + T('in stock') : T('On request')}</em>
                      </button>
                    );
                  })}
                </section>
              ))}
            </div>
          ) : (
            <div className="fp-specs">
              <section>
                <h4>{T('Quality')}</h4>
                <div className="fp-chips">
                  {(D ? D.qualities : []).map((x) => { const n = specCount('quality', x.id), on = qu.includes(x.id); return <button key={x.id} type="button" className={'fp-chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setQu(toggle(qu, x.id))}>{T(x.name)}{n ? <em>{n}</em> : null}</button>; })}
                </div>
              </section>
              <section>
                <h4>{T('Manufacturer')}</h4>
                <div className="fp-chips">
                  {(D ? D.manufacturers : []).map((x) => { const n = specCount('manufacturer', x.id), on = mf.includes(x.id); return <button key={x.id} type="button" className={'fp-chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setMf(toggle(mf, x.id))}>{T(x.name)}{n ? <em>{n}</em> : null}</button>; })}
                </div>
              </section>
              <section>
                <h4>{T('Colour')}</h4>
                <div className="fp-chips">
                  {(D ? D.colours : []).map((x) => { const on = co.includes(x.id); return <button key={x.id} type="button" className={'fp-chip fp-col' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setCo(toggle(co, x.id))}><i style={{ background: SWATCH[x.id] || '#888' }} />{T(x.name)}</button>; })}
                </div>
              </section>
            </div>
          )}
        </div>

        <footer className="fp-foot">
          <div className="fp-sel">
            {summary ? <span className="fp-path">{summary}</span> : <span className="fp-hint">{T('Pick a brand to start')}</span>}
            {[...qu.map((x) => ['q', x, D?.qualities.find((y) => y.id === x)?.name]), ...mf.map((x) => ['m', x, D?.manufacturers.find((y) => y.id === x)?.name]), ...co.map((x) => ['c', x, D?.colours.find((y) => y.id === x)?.name])].map(([t, id, name]) => (
              <button key={t + '' + id} type="button" className="fp-tag" onClick={() => (t === 'q' ? setQu(toggle(qu, id as string)) : t === 'm' ? setMf(toggle(mf, id as string)) : setCo(toggle(co, id as string)))}>
                {T(name || '')}<Icon d="M7 7l10 10M17 7L7 17" s={11} />
              </button>
            ))}
          </div>
          <div className="fp-act">
            <span className="fp-count"><b>{result.length}</b> {T('results')}</span>
            {step > 0 && c0.detailed ? <button type="button" className="fp-back" onClick={() => go(step - 1)}>{T('Back')}</button> : null}
            {step < 4 && c0.detailed ? (
              <button type="button" className="fp-btn" disabled={!canNext} onClick={() => go(step + 1)}>{T('Next')}</button>
            ) : null}
            <button type="button" className={step === 4 ? 'fp-btn' : 'fp-ghost'} onClick={shop}>{T('Open in Shop with these filters')}</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
