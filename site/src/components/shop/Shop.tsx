'use client';
// P2 · THE SHOP (owner: "professional, like Amazon, so detailed"). Built from the home's language: graphite header with
// live circuits, the search like the hero, Find My Part, then categories, adverts, quick filters, a "Customise everything"
// panel, the results (grid or list), compare, My devices, and the product view inside the shop (?p=ID).
// mode="deals" is the Deals page: the same shop engine showing offers, new arrivals and limited stock.
// Everything reads the URL, so any view can be shared: /shop?q=a54&cat=BAT&sort=price-asc
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type Filters, type Product, EMPTY, apply, data, products, fmt, aed, byId, facets, shots } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { useMe } from '@/lib/backend';
import { T, CountUp, Stars } from '@/components/site/ui';
import CircuitField from '@/components/home/CircuitField';
import LiveSam from '@/components/samsoom/LiveSam';
import ShopSearch from './ShopSearch';
import ProductCard from './ProductCard';
import ProductView from './ProductView';
import Customise, { type View } from './Customise';
import Banners from './Banners';

const LIST_KEYS = ['brands', 'models', 'cats', 'parts', 'grades', 'makers', 'qualities', 'warranty', 'device', 'colours'] as const;
const URLK: Record<(typeof LIST_KEYS)[number], string> = { brands: 'brand', models: 'model', cats: 'cat', parts: 'part', grades: 'grade', makers: 'maker', qualities: 'quality', warranty: 'warranty', device: 'device', colours: 'colour' };
const CAT_IMG: Record<string, string> = { SCR: 'samsung-sp', BAT: 'part-bat', FLX: 'part-flx', BCV: 'part-bcv', FRM: 'part-frm', CAM: 'part-cam', SML: 'part-sml', TLS: 'part-board' };
const SORTS: [Filters['sort'], string][] = [['best', 'Best match'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['rating', 'Top rated'], ['deal', 'Biggest discount'], ['stock', 'Most in stock'], ['new', 'Newest'], ['name', 'Name A–Z']];
type Scope = 'all' | 'deals' | 'new' | 'limited';

function fromUrl(): { f: Filters; p: string | null; scope: Scope } {
  const u = new URLSearchParams(location.search), f: Filters = { ...EMPTY, q: u.get('q') || '' };
  LIST_KEYS.forEach((k) => { const v = u.get(URLK[k]); if (v) (f[k] as string[]) = v.split(',').filter(Boolean); });
  if (u.get('min')) f.min = +u.get('min')!; if (u.get('max')) f.max = +u.get('max')!;
  if (u.get('stock') === '1') f.inStock = true; if (u.get('deals') === '1') f.deals = true; if (u.get('new') === '1') f.isNew = true;
  if (u.get('rating')) f.rating = +u.get('rating')!; if (u.get('sort')) f.sort = u.get('sort') as Filters['sort'];
  return { f, p: u.get('p'), scope: (u.get('scope') as Scope) || 'all' };
}
function toUrl(f: Filters, p: string | null, scope: Scope) {
  const u = new URLSearchParams(); if (f.q) u.set('q', f.q);
  LIST_KEYS.forEach((k) => f[k].length && u.set(URLK[k], f[k].join(',')));
  if (f.min != null) u.set('min', String(f.min)); if (f.max != null) u.set('max', String(f.max));
  if (f.inStock) u.set('stock', '1'); if (f.deals) u.set('deals', '1'); if (f.isNew) u.set('new', '1'); if (f.rating) u.set('rating', String(f.rating)); if (f.sort !== 'best') u.set('sort', f.sort);
  if (scope !== 'all') u.set('scope', scope); if (p) u.set('p', p);
  const s = u.toString(); history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
}

export default function Shop({ mode = 'shop' }: { mode?: 'shop' | 'deals' }) {
  const [ready, setReady] = useState(false), [f, setF] = useState<Filters>(EMPTY), [pid, setPid] = useState<string | null>(null), [scope, setScope] = useState<Scope>(mode === 'deals' ? 'deals' : 'all');
  const [view, setView] = useState<View>({ cols: 4, list: false, trade: true, per: 24 }), [page, setPage] = useState(1), [cz, setCz] = useState(false), [cmpOpen, setCmpOpen] = useState(false), [side, setSide] = useState(false);
  const st = useStore(), [me] = useMe(), trade = !!me?.tradeApproved, [cv, setCv] = useState(0);
  useEffect(() => { const on = () => setCv((n) => n + 1); window.addEventListener('se:catalog', on); return () => window.removeEventListener('se:catalog', on); }, []);
  // the data is loaded by the page's scripts; wait for it, then read the link
  useEffect(() => {
    const go = () => { const u = fromUrl(); setF(u.f); setPid(u.p); if (u.scope !== 'all' || mode === 'deals') setScope(mode === 'deals' && u.scope === 'all' ? 'deals' : u.scope); try { const v = JSON.parse(localStorage.getItem('se-shop-view') || 'null'); if (v) setView(v); } catch { /* */ } setReady(true); };
    if (data() && shots()) go(); else { const iv = window.setInterval(() => { if (data() && shots()) { window.clearInterval(iv); go(); } }, 60); return () => window.clearInterval(iv); }
  }, [mode]);
  useEffect(() => { if (ready) toUrl(f, pid, scope); }, [f, pid, scope, ready]);
  useEffect(() => { setPage(1); }, [f, scope]);
  useEffect(() => { try { localStorage.setItem('se-shop-view', JSON.stringify(view)); } catch { /* */ } }, [view]);
  const open = useCallback((p: Product) => setPid(p.id), []);
  const close = useCallback(() => setPid(null), []);

  const base = useMemo(() => { if (!ready) return []; const all = products(); return scope === 'deals' ? all.filter((p) => p.deal > 0) : scope === 'new' ? all.filter((p) => p.isNew) : scope === 'limited' ? all.filter((p) => p.stock_qty > 0 && p.stock_qty < 6) : all; }, [ready, scope, cv]);
  const res = useMemo(() => (ready ? apply(f, base) : []), [f, base, ready]);
  const fc = useMemo(() => (ready ? facets(f) : null), [f, ready, cv]);
  const D = data();
  if (!ready || !D || !fc) return <div className="shop-wait"><span /><span /><span /></div>;

  const shown = res.slice(0, page * view.per), myModels = new Map(st.devices.map((d) => [d.model_id, d.nick || d.name]));
  const set = (patch: Partial<Filters>) => setF((o) => ({ ...o, ...patch }));
  const tog = (k: (typeof LIST_KEYS)[number], v: string) => setF((o) => ({ ...o, [k]: o[k].includes(v) ? o[k].filter((x) => x !== v) : [...o[k], v] }));
  const name = (k: (typeof LIST_KEYS)[number], v: string) => k === 'brands' ? D.brands.find((b) => b.id === v)?.name : k === 'models' ? D.models.find((m) => m.id === v)?.name : k === 'cats' ? T(D.categories.find((c) => c.id === v)?.name || v) : k === 'grades' ? D.gradeNames[v] : k === 'makers' ? D.manufacturers.find((m) => m.id === v)?.name : k === 'qualities' ? D.qualities.find((q) => q.id === v)?.name : k === 'parts' ? D.categories.find((c) => c.part === v)?.one || v : k === 'colours' ? D.colours.find((c) => c.id === v)?.name : T(v);
  const chips: [string, () => void][] = [
    ...LIST_KEYS.flatMap((k) => f[k].map((v) => [String(name(k, v) || v), () => tog(k, v)] as [string, () => void])),
    ...(f.min != null || f.max != null ? [['AED ' + (f.min ?? 0) + '–' + (f.max ?? '∞'), () => set({ min: null, max: null })] as [string, () => void]] : []),
    ...(f.inStock ? [[T('In stock'), () => set({ inStock: false })] as [string, () => void]] : []),
    ...(f.deals ? [[T('On offer'), () => set({ deals: false })] as [string, () => void]] : []),
    ...(f.isNew ? [[T('New'), () => set({ isNew: false })] as [string, () => void]] : []),
    ...(f.rating ? [['★ ' + f.rating + '+', () => set({ rating: 0 })] as [string, () => void]] : []),
  ];
  const cats = D.categories.map((c) => ({ ...c, n: base.filter((p) => p.category === c.id).length }));
  const cmp = st.compare.map(byId).filter(Boolean) as Product[];
  const openFmp = () => window.dispatchEvent(new CustomEvent('se:fmp', { detail: {} }));
  const counts = { deals: products().filter((p) => p.deal > 0).length, new: products().filter((p) => p.isNew).length, limited: products().filter((p) => p.stock_qty > 0 && p.stock_qty < 6).length };

  return (
    <div className={'shop' + (mode === 'deals' ? ' is-deals' : '')}>
      {/* header: the hero's language — graphite, live circuits, the search, Samsoom ready to help */}
      <section className="shop-hd" data-tone="dark">
        <CircuitField tone="dark" seed={mode === 'deals' ? 23 : 5} />
        <div className="sp-wrap">
          <nav className="sp-crumb"><a href="/">{T('Home')}</a><i /><span>{mode === 'deals' ? T('Deals & arrivals') : T('Shop')}</span></nav>
          <div className="shop-hd-row">
            <div className="shop-hd-l">
              <span className="sp-eb">{mode === 'deals' ? T('DEALS · ARRIVALS · LIMITED OFFERS') : T('THE PARTS SHOP')}</span>
              <h1 className="sp-h1">{mode === 'deals' ? <>{T('Deals that')} <em>{T('end soon.')}</em></> : <>{T('Every part.')} <em>{T('Every grade.')}</em></>}</h1>
            </div>
            <div className="shop-stats">
              <span><b><CountUp to={products().length} /></b><small>{T('parts')}</small></span>
              <span><b><CountUp to={D.models.length} /></b><small>{T('models')}</small></span>
              <span><b>{D.brands.length}</b><small>{T('brands')}</small></span>
              <span className="shop-sam" title="Samsoom" onClick={() => window.dispatchEvent(new CustomEvent('se:help'))}><LiveSam size={56} mood="think" /></span>
            </div>
          </div>
          <ShopSearch q={f.q} onQ={(q) => set({ q })} onFmp={openFmp} />
          <div className="shop-devs" data-tour-step="2" data-tour-title="My devices" data-tour-text="Add the phones you fix most. I will mark every part that fits them.">
            <span>{T('My devices')}:</span>
            {st.devices.map((d) => <button key={d.model_id} type="button" className={'sp-chip' + (f.models.includes(d.model_id) ? ' y' : '')} onClick={() => tog('models', d.model_id)}>{d.nick || d.name}<span className="x" onClick={(e) => { e.stopPropagation(); store.device(d); }}>×</span></button>)}
            <select className="shop-adddev" value="" onChange={(e) => { const m = D.models.find((x) => x.id === e.target.value); if (m) store.device({ model_id: m.id, name: m.name }); }} aria-label={T('Add a device')}>
              <option value="">+ {T('Add a device')}</option>
              {D.brands.map((b) => <optgroup key={b.id} label={b.name}>{D.models.filter((m) => m.brand_id === b.id && products().some((p) => p.model_id === m.id)).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>)}
            </select>
          </div>
        </div>
      </section>

      {mode === 'deals' ? (
        <div className="sp-wrap deals-tabs" data-tour-step="3" data-tour-title="Deals, arrivals, limited" data-tour-text="Switch between offers, new stock and parts that are nearly gone.">
          {([['deals', 'Offers', counts.deals, 'Discounts that end on a date'], ['new', 'New arrivals', counts.new, 'Fresh from this week’s shipments'], ['limited', 'Limited stock', counts.limited, 'Only a few left'], ['all', 'Everything', products().length, 'The whole shop']] as [Scope, string, number, string][]).map(([k, l, n, d]) => (
            <button key={k} type="button" className={'dt' + (scope === k ? ' on' : '')} onClick={() => setScope(k)}><b>{T(l)}</b><small>{T(d)}</small><span>{n}</span></button>
          ))}
        </div>
      ) : null}

      <div className="sp-wrap">
        {/* the categories, as big tiles with the part on its carton */}
        <div className="shop-cats" data-tour-step={mode === 'deals' ? '4' : '3'} data-tour-title="Shop by part" data-tour-text="Tap a part to see every model and grade we have of it.">
          {cats.map((c) => (
            <button key={c.id} type="button" className={'shop-cat' + (f.cats.includes(c.id) ? ' on' : '') + (c.soon ? ' soon' : '')} disabled={c.soon} onClick={() => tog('cats', c.id)}>
              <img src={'/assets/pose/' + CAT_IMG[c.id] + '-240.webp'} alt="" loading="lazy" /><b>{T(c.name)}</b><small>{c.soon ? T('Coming soon') : c.n + ' ' + T('parts')}</small>
            </button>
          ))}
        </div>
        {mode === 'shop' && !f.q && !chips.length ? <Banners onDeals={() => (location.href = '/deals')} onCat={(c) => set({ cats: [c] })} /> : null}

        <div className="shop-body">
          {/* quick filters on the left; the full panel is one tap away */}
          <aside className={'shop-side' + (side ? ' open' : '')} aria-label={T('Filters')}>
            <div className="shop-side-in">
              <button type="button" className="shop-cz" onClick={() => setCz(true)} data-tour-step={mode === 'deals' ? '5' : '4'} data-tour-title="Customise everything" data-tour-text="Price, quality, manufacturer, colour, warranty… set it all exactly how you like, and save it.">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
                <span><b>{T('Customise everything')}</b><small>{T('Price, quality, colour, warranty…')}</small></span>
              </button>
              <div className="sf"><b>{T('Availability')}</b>
                {([['inStock', 'In stock'], ['deals', 'On offer'], ['isNew', 'New arrivals']] as const).map(([k, l]) => <label key={k} className="sf-tg"><input type="checkbox" checked={f[k]} onChange={(e) => set({ [k]: e.target.checked })} /><i /><span>{T(l)}</span></label>)}
              </div>
              <div className="sf"><b>{T('Brand')}</b>{D.brands.filter((b) => fc.brands[b.id] || f.brands.includes(b.id)).map((b) => <label key={b.id} className="sf-o"><input type="checkbox" checked={f.brands.includes(b.id)} onChange={() => tog('brands', b.id)} /><i /><span>{b.name}</span><small>{fc.brands[b.id] || 0}</small></label>)}</div>
              <div className="sf"><b>{T('Grade')}</b>{Object.entries(D.gradeNames).map(([g, n]) => <label key={g} className="sf-o"><input type="checkbox" checked={f.grades.includes(g)} onChange={() => tog('grades', g)} /><i /><span><span className={'pc-gr g-' + g}>{n}</span></span><small>{fc.grades[g] || 0}</small></label>)}</div>
              <div className="sf"><b>{T('Price')} <span className="sp-sample">AED · sample</span></b>
                <div className="sf-pr"><input type="number" placeholder={T('Min')} value={f.min ?? ''} onChange={(e) => set({ min: e.target.value === '' ? null : +e.target.value })} /><i>–</i><input type="number" placeholder={T('Max')} value={f.max ?? ''} onChange={(e) => set({ max: e.target.value === '' ? null : +e.target.value })} /></div>
                <div className="sf-q">{[[0, 50], [50, 150], [150, 400], [400, null]].map(([a, b]) => <button key={String(a)} type="button" className={'sp-chip' + (f.min === a && f.max === b ? ' on' : '')} onClick={() => set({ min: a, max: b })}>{b ? a + '–' + b : a + '+'}</button>)}</div>
              </div>
              <div className="sf"><b>{T('Manufacturer')}</b>{D.manufacturers.filter((m) => fc.makers[m.id] || f.makers.includes(m.id)).map((m) => <label key={m.id} className="sf-o"><input type="checkbox" checked={f.makers.includes(m.id)} onChange={() => tog('makers', m.id)} /><i /><span>{m.name}</span><small>{fc.makers[m.id] || 0}</small></label>)}</div>
              <div className="sf"><b>{T('Rating')}</b>{[4.5, 4, 3].map((r) => <button key={r} type="button" className={'sf-r' + (f.rating === r ? ' on' : '')} onClick={() => set({ rating: f.rating === r ? 0 : r })}><Stars v={r} /> {T('& up')}</button>)}</div>
              <button type="button" className="sp-btn sm dark shop-side-done" onClick={() => setSide(false)}>{T('Show')} {fmt(res.length)} {T('results')}</button>
            </div>
          </aside>

          <div className="shop-main">
            <div className="shop-bar">
              <span className="shop-n"><b>{fmt(res.length)}</b> {T('results')}{f.q ? <> {T('for')} “<b>{f.q}</b>”</> : null}</span>
              <button type="button" className="sp-chip shop-fbtn" onClick={() => setSide(true)}>☰ {T('Filters')}{chips.length ? ' · ' + chips.length : ''}</button>
              <button type="button" className="sp-chip y" onClick={() => setCz(true)}>{T('Customise')}</button>
              <label className="shop-sort"><span>{T('Sort')}</span><select value={f.sort} onChange={(e) => set({ sort: e.target.value as Filters['sort'] })}>{SORTS.map(([k, l]) => <option key={k} value={k}>{T(l)}</option>)}</select></label>
              <span className="shop-vw">
                <button type="button" className={!view.list ? 'on' : ''} onClick={() => setView({ ...view, list: false })} aria-label={T('Grid')}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg></button>
                <button type="button" className={view.list ? 'on' : ''} onClick={() => setView({ ...view, list: true })} aria-label={T('List')}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="1.5" /><rect x="3" y="10" width="18" height="4" rx="1.5" /><rect x="3" y="16" width="18" height="4" rx="1.5" /></svg></button>
              </span>
            </div>
            {chips.length ? <div className="shop-chips">{chips.map(([l, x], i) => <button key={l + i} type="button" className="sp-chip on" onClick={x}>{l}<span className="x">×</span></button>)}<button type="button" className="shop-clear" onClick={() => setF({ ...EMPTY, sort: f.sort })}>{T('Clear all')}</button></div> : null}
            {!trade ? <div className="sp-note shop-tradenote"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg><span>{T('Prices shown are for everyone. Approved trade accounts see their trade price on every part.')} <a href="/wholesale">{T('How to get trade prices')}</a></span></div> : null}

            {res.length ? (
              <div className={'shop-grid' + (view.list ? ' list' : '')} style={{ ['--cols' as string]: view.cols }}>
                {shown.map((p) => <ProductCard key={p.id} p={p} st={st} trade={trade} open={open} list={view.list} fits={myModels.get(p.model_id)} />)}
              </div>
            ) : (
              <div className="sp-empty shop-none">
                <LiveSam size={96} mood="think" />
                <b>{T('Nothing matches all of that.')}</b>
                <span>{T('Remove a filter, try another spelling, or ask me: we may have it in the back.')}</span>
                <span className="sp-acts" style={{ justifyContent: 'center' }}><button type="button" className="sp-btn sm" onClick={() => setF({ ...EMPTY })}>{T('Clear filters')}</button><button type="button" className="sp-btn sm ghost" onClick={() => window.dispatchEvent(new CustomEvent('se:chat', { detail: { q: f.q || 'Do you have this part?' } }))}>{T('Ask Samsoom')}</button></span>
              </div>
            )}
            {shown.length < res.length ? <div className="shop-more"><span>{T('Showing')} {shown.length} {T('of')} {fmt(res.length)}</span><i><em style={{ width: (shown.length / res.length) * 100 + '%' }} /></i><button type="button" className="sp-btn dark" onClick={() => setPage(page + 1)}>{T('Show more')}</button></div> : null}
          </div>
        </div>
      </div>

      {/* compare tray */}
      {cmp.length ? (
        <div className="cmp-tray">
          <span className="cmp-l"><b>{T('Compare')}</b><small>{cmp.length} / 4</small></span>
          <span className="cmp-items">{cmp.map((p) => <span key={p.id} className="cmp-it"><img src={p.img} alt="" /><small>{p.title}</small><button type="button" onClick={() => store.cmp(p.id)} aria-label={T('Remove')}>×</button></span>)}</span>
          <button type="button" className="sp-btn sm" disabled={cmp.length < 2} onClick={() => setCmpOpen(true)}>{T('Compare now')}</button>
          <button type="button" className="cmp-clr" onClick={() => cmp.forEach((p) => store.cmp(p.id))}>{T('Clear')}</button>
        </div>
      ) : null}
      {cmpOpen && cmp.length ? (
        <>
          <div className="sp-veil" onClick={() => setCmpOpen(false)} />
          <div className="sp-modal cmp-m">
            <button type="button" className="sp-x" onClick={() => setCmpOpen(false)} aria-label={T('Close')}>×</button>
            <h3 className="sp-h3">{T('Side by side')}</h3>
            <div className="cmp-scroll"><table className="sp-table cmp-t"><tbody>
              <tr><th /> {cmp.map((p) => <td key={p.id}><img src={p.img} alt="" /><b>{p.title}</b></td>)}</tr>
              {([['Price', (p: Product) => aed(p.price)], ['Grade', (p: Product) => p.gradeName], ['Manufacturer', (p: Product) => p.makerName], ['Quality', (p: Product) => p.qualityName], ['Warranty', (p: Product) => p.warranty], ['Rating', (p: Product) => p.rating + ' ★'], ['Stock (estimate)', (p: Product) => String(p.stock_qty)], ['Model', (p: Product) => p.modelName]] as [string, (p: Product) => string][]).map(([k, fn]) => (
                <tr key={k}><th>{T(k)}</th>{cmp.map((p) => <td key={p.id}>{fn(p)}</td>)}</tr>
              ))}
              <tr><th /> {cmp.map((p) => <td key={p.id}><button type="button" className="sp-btn sm" onClick={(e) => { window.dispatchEvent(new CustomEvent('se:cart', { detail: { id: p.id, clientX: e.clientX, clientY: e.clientY } })); }}>{T('Add to cart')}</button></td>)}</tr>
            </tbody></table></div>
          </div>
        </>
      ) : null}

      <Customise open={cz} f={f} view={view} onClose={() => setCz(false)} onApply={(nf, nv) => { setF(nf); setView(nv); setCz(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <ProductView id={pid} me={me} onClose={close} onOpen={open} />
    </div>
  );
}
