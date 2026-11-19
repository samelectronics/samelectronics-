'use client';
import { HeroTitle, HeroBack } from '@/components/site/HeroType';
// P2 · THE SHOP (owner: "professional, like Amazon, so detailed"). Built from the home's language: graphite header with
// live circuits, the search like the hero, Find My Part, then categories, adverts, quick filters, a "Customize everything"
// panel, the results (grid or list), compare, My devices, and the product view inside the shop (?p=ID).
// mode="deals" is the Deals page: the same shop engine showing offers, new arrivals and limited stock.
// Everything reads the URL, so any view can be shared: /shop?q=a54&cat=BAT&sort=price-asc
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Filters, type Product, EMPTY, apply, data, products, fmt, aed, byId, facets, shots , priceText, ptitle } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { useMe } from '@/lib/backend';
import { T, CountUp, Stars } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';
import ShopSearch from './ShopSearch';
import ScreenGrades from './ScreenGrades';
import ProductCard from './ProductCard';
import ProductView from './ProductView';
import Customize, { type View } from './Customize';
import Banners from './Banners';
import InlineAd from './InlineAd';
import CompareView from './CompareView';
import LogoMark from '@/components/site/LogoMark';
import { GradeTag, MakerTag } from './Tags';
import { CompareIcon } from './Icons';
import DevicePicker, { DevIcon, kindOf } from './DevicePicker';

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

// R10 P1 · "Parts warehouse" cover: a wall of shelving with labelled bins, some lit; it is the shop's own signature
const WMONTHS = (w: string) => { const m = /(\d+)\s*(month|year)/i.exec(w || ''); return m ? +m[1] * (/year/i.test(m[2]) ? 12 : 1) : /life/i.test(w || '') ? 999 : 0; };
// compare rows: label, value, and (when one is better) a score where higher wins
const CMP_ROWS: [string, (p: Product) => string, ((p: Product) => number)?][] = [
  ['Price', (p) => priceText(p.price), (p) => -p.price], ['Grade', (p) => p.gradeName], ['Manufacturer', (p) => p.makerName], ['Quality', (p) => p.qualityName],
  ['Warranty', (p) => p.warranty, (p) => WMONTHS(p.warranty)], ['Rating', (p) => p.rating + ' ★', (p) => p.rating], ['Stock (estimate)', (p) => String(p.stock_qty), (p) => p.stock_qty], ['Model', (p) => p.modelName],
];

/** owner (18 Nov): "the bold writing in the shop header should be more fun, like the ads: moving, crazy, techy". The
 *  first line slams in; the second keeps flipping through what we carry (grade, screen, battery, brand, model) with a
 *  glitch flip and a small counter, like a live readout. */
const ROT = ['Every grade.', 'Every screen.', 'Every battery.', 'Every brand.', 'Every model.'];
function ShopHeadline() {
  const [k, setK] = React.useState(0);
  React.useEffect(() => { const t = window.setInterval(() => { if (!document.hidden) setK((v) => v + 1); }, 2600); return () => window.clearInterval(t); }, []);
  const i = k % ROT.length;
  return (
    <h1 className="sp-h1 shd" aria-label={T('Every part.') + ' ' + T('Every grade.')}>
      <span className="ht4 on shd-a" aria-hidden="true"><span className="ht4-l a">{T('Every part.').split(/\s+/).map((w, n) => <span key={n} className="ht4-w" style={{ ['--i' as string]: n } as React.CSSProperties}><span>{w}</span></span>)}</span></span>
      <span className="shd-b" aria-hidden="true"><span className="shd-w" key={k}>{T(ROT[i])}</span></span>
    </h1>
  );
}
const MQ = ['SCREENS', 'BATTERIES', 'FLEX CABLES', 'BACK COVERS', 'CAMERAS', 'FRAMES', 'SMALL PARTS'];

export default function Shop({ mode = 'shop' }: { mode?: 'shop' | 'deals' }) {
  const scanRef = useRef<HTMLDivElement>(null), [dock, setDock] = useState(false);
  // owner: once the big search scrolls away, a slim one follows you smoothly under the bar (search, results, Customize)
  useEffect(() => { const el = scanRef.current; if (!el || typeof IntersectionObserver === 'undefined') return; const io = new IntersectionObserver(([e]) => setDock(!e.isIntersecting && e.boundingClientRect.top < 0), { rootMargin: '-72px 0px 0px 0px' }); io.observe(el); return () => io.disconnect(); });
  useEffect(() => { const o = () => setCmpOpen(true); window.addEventListener('se:open-compare', o); return () => window.removeEventListener('se:open-compare', o); }, []);
  useEffect(() => { document.documentElement.toggleAttribute('data-shop-dock', dock); return () => document.documentElement.removeAttribute('data-shop-dock'); }, [dock]);
  // owner (18 Nov night): the site bar itself turns into the shop bar. The shop tools sit exactly between the site
  // logo and the site's own buttons (account, notifications, cart, menu), which never hide.
  useEffect(() => {
    const fit = () => {
      const h = document.querySelector('header'); if (!h) return;
      const a = h.querySelector('.se-nav-row > a'), right = h.querySelector('.se-nav-right');
      if (!a || !right) return;
      // on a phone the logo's name hides in this mode, so measure from the round mark itself
      const small = window.innerWidth <= 1100, logo = (small && a.querySelector('.lm2')) || a;
      const keep = Array.from(right.children).filter((c) => !c.matches('.se-status, .se-contact-dd, .sc-host') && (c as HTMLElement).offsetWidth > 0);
      const L = Math.round(logo.getBoundingClientRect().right + (small ? 10 : 18)), R = keep.length ? Math.min(...keep.map((c) => c.getBoundingClientRect().left)) : window.innerWidth - 20;
      const root = document.documentElement; root.style.setProperty('--dock-l', L + 'px'); root.style.setProperty('--dock-r', Math.max(12, Math.round(window.innerWidth - R + 14)) + 'px');
    };
    fit(); const t = window.setTimeout(fit, 400); window.addEventListener('resize', fit);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', fit); };
  }, [dock]);
  const [ready, setReady] = useState(false), [f, setF] = useState<Filters>(EMPTY), [pid, setPid] = useState<string | null>(null), [scope, setScope] = useState<Scope>(mode === 'deals' ? 'deals' : 'all');
  const [view, setView] = useState<View>({ cols: 4, list: false, trade: true, per: 24 }), [page, setPage] = useState(1), [cz, setCz] = useState(false), [cmpOpen, setCmpOpen] = useState(false), [diffOnly, setDiffOnly] = useState(false), [side, setSide] = useState(false);
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
  useEffect(() => { const o = () => { setPid(null); setCmpOpen(true); }; window.addEventListener('se:cmp-open', o); return () => window.removeEventListener('se:cmp-open', o); }, []);

  const base = useMemo(() => { if (!ready) return []; const all = products(); return scope === 'deals' ? all.filter((p) => p.deal > 0) : scope === 'new' ? all.filter((p) => p.isNew) : scope === 'limited' ? all.filter((p) => p.stock_qty > 0 && p.stock_qty < 6) : all; }, [ready, scope, cv]);
  const res = useMemo(() => (ready ? apply(f, base) : []), [f, base, ready]);
  // owner (18 Nov night): a search, a filter, a tab or a category takes you straight to the results (smoothly, with the
  // sticky bar's height left free), so nobody waits on the header wondering if anything happened
  const armed = useRef(false);
  useEffect(() => { if (!ready) return; const t = window.setTimeout(() => { armed.current = true; }, 800); return () => window.clearTimeout(t); }, [ready]);
  useEffect(() => {
    if (!armed.current) return; // never on page load or when a shared link opens with filters already set
    const t = window.setTimeout(() => {
      const el = document.querySelector('.shop-body'); if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 92;
      if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: 'smooth' });
    }, 120);
    return () => window.clearTimeout(t);
  }, [f, scope]);
  const fc = useMemo(() => (ready ? facets(f) : null), [f, ready, cv]);
  const D = data();
  const dockIc = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const sync = () => dockIc.current?.querySelectorAll<HTMLElement>('[data-mirror]').forEach((b) => { const src = document.querySelector(b.dataset.mirror!) as HTMLElement | null; if (src && b.innerHTML !== src.innerHTML) { b.innerHTML = src.innerHTML; b.className = src.className + (b.classList.contains('mn') ? ' mn' : ''); } });
    sync(); const iv = window.setInterval(sync, 800); window.addEventListener('se:store', sync); return () => { window.clearInterval(iv); window.removeEventListener('se:store', sync); };
  }, []);
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
      <section className="shop-hd shop-cine" data-tone="dark" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', (e.clientX - r.left) + 'px'); e.currentTarget.style.setProperty('--gy', (e.clientY - r.top) + 'px'); e.currentTarget.classList.add('glow-on'); }} onPointerLeave={(e) => e.currentTarget.classList.remove('glow-on')}>
        <div className="cine-bg" aria-hidden="true"><i className="cine-wall" /><i className="shd-glow" /><i className="cine-beam" /><span className="cine-bokeh">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} />)}</span><i className="cine-floor" /><i className="cine-grain" /><HeroBack word={mode === 'deals' ? 'DEALS' : 'PARTS'} /></div>
        <span className="shd-mq" aria-hidden="true" data-no-i18n="">{[0, 1].map((r) => <span key={r} className={'shd-row r' + r}>{[0, 1].map((x) => <span key={x}>{(r ? [...MQ].reverse() : MQ).map((w) => <b key={w}>{T(w)}<i /></b>)}</span>)}</span>)}</span>
        <div className="sp-wrap">
          <nav className="sp-crumb"><a href="/">{T('Home')}</a><i /><span>{mode === 'deals' ? T('Deals & arrivals') : T('Shop')}</span></nav>
          <div className="shop-hd-row">
            <div className="shop-hd-l">
              <span className="sp-eb">{mode === 'deals' ? T('DEALS · ARRIVALS · LIMITED OFFERS') : T('THE PARTS SHOP')}</span>
              {mode === 'deals' ? <HeroTitle key={mode} a={T('Deals that')} b={T('end soon.')} /> : <ShopHeadline />}
            </div>
            <div className="shop-stats">
              <span><b><CountUp to={products().length} /></b><small>{T('parts')}</small></span>
              <span><b><CountUp to={D.models.length} /></b><small>{T('models')}</small></span>
              <span><b>{D.brands.length}</b><small>{T('brands')}</small></span>
            </div>
          </div>
          <div className="shop-scan" ref={scanRef}><i className="shop-beam" aria-hidden="true" /><ShopSearch q={f.q} onQ={(q) => set({ q })} onFmp={openFmp} onFilters={() => (window.innerWidth > 1100 ? setCz(true) : setSide(true))} nFilters={chips.length} /></div>
          {/* owner (latest): a smaller, professional search that follows smoothly (see .shop-dock) */}
          <div className="shop-devs" data-tour-step="2" data-tour-title="My devices" data-tour-text="Add the phones you fix most. I will mark every part that fits them.">
            {/* owner (19 Nov): one tidy panel: the label, your phones as small device tiles and Add, then the fit switch in its own zone */}
            <span className="sd-lab"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></svg>{T('My devices')}</span>
            {/* owner (18 Nov): one switch shows only the parts that fit the phones you saved */}
            {st.devices.length ? (() => { const ids = st.devices.map((d) => d.model_id), on = ids.every((m) => f.models.includes(m)) && f.models.length === ids.length; return (
              <button type="button" role="switch" aria-checked={on} className={'fit-sw' + (on ? ' on' : '')} onClick={() => set({ models: on ? [] : ids })}><i aria-hidden="true" />{T(st.devices.length > 1 ? 'Only parts that fit my devices' : 'Only parts that fit my device')}</button>
            ); })() : null}
            {st.devices.map((d) => { const k = kindOf(d.model_id), br = D.brands.find((b) => b.id === D.models.find((m) => m.id === d.model_id)?.brand_id)?.name; return <button key={d.model_id} type="button" className={'sd-dev' + (f.models.includes(d.model_id) ? ' y' : '')} aria-pressed={f.models.includes(d.model_id)} title={d.nick || d.name} onClick={() => tog('models', d.model_id)}><DevIcon kind={k} size={28} /><span className="sd-n"><b>{d.nick || d.name}</b><small>{br}{br ? ' · ' : ''}{T(k === 'watch' ? 'Watch' : k === 'tablet' ? 'Tablet' : 'Phone')}</small></span><span className="x" role="button" aria-label={T('Remove')} onClick={(e) => { e.stopPropagation(); store.device(d); }}>×</span></button>; })}
            <DevicePicker have={st.devices.map((d) => d.model_id)} onPick={(m) => store.device({ model_id: m.id, name: m.name })} />
          </div>
        </div>
      </section>

      {/* R10 P1: Shop and Deals are one place; offers, new arrivals and limited stock are tabs (the /deals page opens here) */}
      <div className="sp-wrap deals-tabs" data-tour-step="3" data-tour-title="Deals, arrivals, limited" data-tour-text="Switch between offers, new stock and parts that are nearly gone.">
        {([['all', 'Everything', products().length, 'The whole shop'], ['deals', 'Offers', counts.deals, 'Discounts that end on a date'], ['new', 'New arrivals', counts.new, 'Fresh from this week’s shipments'], ['limited', 'Limited stock', counts.limited, 'Only a few left']] as [Scope, string, number, string][]).map(([k, l, n, d]) => (
          <button key={k} type="button" className={'dt' + (scope === k ? ' on' : '')} onClick={() => setScope(k)}><b>{T(l)}</b><small>{T(d)}</small><span>{n}</span></button>
        ))}
      </div>

      <div className="sp-wrap">
        {/* the categories, as big tiles with the part on its carton */}
        <div className="shop-cats" data-tour-step="4" data-tour-title="Shop by part" data-tour-text="Tap a part to see every model and grade we have of it.">
          {cats.map((c) => (
            <button key={c.id} type="button" className={'shop-cat' + (f.cats.includes(c.id) ? ' on' : '') + (c.soon ? ' soon' : '')} disabled={c.soon} onClick={() => tog('cats', c.id)}>
              <img src={'/assets/pose/' + CAT_IMG[c.id] + '-240.webp'} alt="" loading="lazy" /><b>{T(c.name)}</b><small>{c.soon ? T('Coming soon') : c.n + ' ' + T('parts')}</small>
            </button>
          ))}
        </div>
        {/* owner (18 Nov): every filter has its ads: mixed for everything, the topic's own commercial for a tab, a part family or a brand */}
        <Banners onDeals={() => setScope('deals')} onCat={(c) => set({ cats: [c] })} onGo={() => document.querySelector('.shop-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          ctx={scope !== 'all' ? { kind: scope as 'deals' | 'new' | 'limited', items: res } : f.cats.length === 1 ? { kind: 'cat', id: f.cats[0], items: res } : f.brands.length === 1 ? { kind: 'brand', id: f.brands[0], items: res } : null} />

        <div className="shop-body">
          {/* quick filters on the left; the full panel is one tap away */}
          <aside className={'shop-side' + (side ? ' open' : '')} aria-label={T('Filters')}>
            <div className="shop-side-in">
              <button type="button" className="shop-cz" onClick={() => setCz(true)} data-tour-step="6" data-tour-title="Customize everything" data-tour-text="Price, quality, manufacturer, color, warranty… set it all exactly how you like, and save it.">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
                <span><b>{T('Customize everything')}</b><small>{T('Price, quality, color, warranty…')}</small></span>
              </button>
              <span className="sf-qk">{T('Quick filters')}</span>
              <div className="sf"><b>{T('Availability')}</b>
                {([['inStock', 'In stock'], ['deals', 'On offer'], ['isNew', 'New arrivals']] as const).map(([k, l]) => <label key={k} className="sf-tg"><input type="checkbox" checked={f[k]} onChange={(e) => set({ [k]: e.target.checked })} /><i /><span>{T(l)}</span></label>)}
              </div>
              <div className="sf"><b>{T('Brand')}</b>{D.brands.filter((b) => fc.brands[b.id] || f.brands.includes(b.id)).map((b) => <label key={b.id} className="sf-o"><input type="checkbox" checked={f.brands.includes(b.id)} onChange={() => tog('brands', b.id)} /><i /><span>{b.name}</span><small>{fc.brands[b.id] || 0}</small></label>)}</div>
              <div className="sf"><b>{T('Grade')}</b>{Object.entries(D.gradeNames).map(([g, n]) => <label key={g} className="sf-o"><input type="checkbox" checked={f.grades.includes(g)} onChange={() => tog('grades', g)} /><i /><span><span className={'pc-gr g-' + g}>{n}</span></span><small>{fc.grades[g] || 0}</small></label>)}</div>
              <div className="sf"><b>{T('Price')} <span className="sp-sample">AED · sample</span></b>
                <div className="sf-pr"><input type="number" placeholder={T('Min')} value={f.min ?? ''} onChange={(e) => set({ min: e.target.value === '' ? null : +e.target.value })} /><i>–</i><input type="number" placeholder={T('Max')} value={f.max ?? ''} onChange={(e) => set({ max: e.target.value === '' ? null : +e.target.value })} /></div>
                <div className="sf-q">{[[0, 50], [50, 150], [150, 400], [400, null]].map(([a, b]) => <button key={String(a)} type="button" className={'sp-chip' + (f.min === a && f.max === b ? ' on' : '')} onClick={() => set({ min: a, max: b })}>{b ? a + '–' + b : a + '+'}</button>)}</div>
              </div>
              <div className="sf"><b>{T('Manufacturer')}</b>{D.manufacturers.filter((m) => fc.makers[m.id] || f.makers.includes(m.id)).map((m) => <label key={m.id} className="sf-o"><input type="checkbox" checked={f.makers.includes(m.id)} onChange={() => tog('makers', m.id)} /><i /><span><MakerTag m={m.id} name={m.name} size="sm" /></span><small>{fc.makers[m.id] || 0}</small></label>)}</div>
              <div className="sf"><b>{T('Rating')}</b>{[4.5, 4, 3].map((r) => <button key={r} type="button" className={'sf-r' + (f.rating === r ? ' on' : '')} onClick={() => set({ rating: f.rating === r ? 0 : r })}><Stars v={r} /> {T('& up')}</button>)}</div>
              <button type="button" className="sp-btn sm dark shop-side-done" onClick={() => setSide(false)}>{T('Show')} {fmt(res.length)} {T('results')}</button>
            </div>
          </aside>

          <div className="shop-main">
            <div className="shop-bar" data-tour-step="9" data-tour-title="Sort and view" data-tour-text="Sort by price, newest or best match, and switch between the grid and the list.">
              <span className="shop-n"><b>{fmt(res.length)}</b> {T('results')}{f.q ? <> {T('for')} “<b>{f.q}</b>”</> : null}</span>
              <button type="button" className="sp-chip shop-fbtn" onClick={() => setSide(true)}>☰ {T('Filters')}{chips.length ? ' · ' + chips.length : ''}</button>
              <button type="button" className="sp-chip y" onClick={() => setCz(true)}>{T('Customize')}</button>
              <label className="shop-sort"><span>{T('Sort')}</span><select value={f.sort} onChange={(e) => set({ sort: e.target.value as Filters['sort'] })}>{SORTS.map(([k, l]) => <option key={k} value={k}>{T(l)}</option>)}</select></label>
              <span className="shop-vw">
                <button type="button" className={!view.list ? 'on' : ''} onClick={() => setView({ ...view, list: false })} aria-label={T('Grid')}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg></button>
                <button type="button" className={view.list ? 'on' : ''} onClick={() => setView({ ...view, list: true })} aria-label={T('List')}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="1.5" /><rect x="3" y="10" width="18" height="4" rx="1.5" /><rect x="3" y="16" width="18" height="4" rx="1.5" /></svg></button>
              </span>
            </div>
            {chips.length ? <div className="shop-chips">{chips.map(([l, x], i) => <button key={l + i} type="button" className="sp-chip on" onClick={x}>{l}<span className="x">×</span></button>)}<button type="button" className="shop-clear" onClick={() => setF({ ...EMPTY, sort: f.sort })}>{T('Clear all')}</button></div> : null}
            {!trade ? <div className="sp-note shop-tradenote" data-tour-step="10" data-tour-title="Trade prices" data-tour-text="Repair shops and traders: apply once, and every part shows your trade price."><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg><span>{T('Prices shown are for everyone. Approved trade accounts see their trade price on every part.')} <a href="/wholesale">{T('How to get trade prices')}</a></span></div> : null}

            {f.cats.length === 1 && f.cats[0] === 'SCR' ? <ScreenGrades items={base.filter((p) => p.category === 'SCR')} on={f.grades} onPick={(g) => tog('grades', g)} /> : null}
            {/* owner (18 Nov): repair shops come back for the same parts: the last ones you opened, one tap away */}
            {(() => { const rv = st.viewed.map(byId).filter(Boolean).slice(0, 10) as Product[]; return rv.length ? (
              <div className="rcv-row" aria-label={T('Recently viewed')}>
                {/* owner (19 Nov): "crowded and weird": one slim history strip */}
                <span className="rcv-h"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><b>{T('Recently viewed')}</b></span>
                <div className="rcv-list">{rv.map((p) => (
                  <button type="button" key={p.id} className="rcv-it" onClick={() => open(p)}>
                    <img src={p.img} alt="" loading="lazy" />
                    <span><b>{ptitle(p)}</b><small>{p.gradeName} · {aed(p.price, false)}</small></span>
                  </button>
                ))}</div>
                <button type="button" className="rcv-clr" onClick={() => store.clearViewed()} aria-label={T('Clear')} title={T('Clear')}>×</button>
              </div>
            ) : null; })()}
            {res.length ? (
              <div className={'shop-grid' + (view.list ? ' list' : '')} style={{ ['--cols' as string]: view.cols }}>
                {shown.map((p, k) => {
                  /* owner (18 Nov): the ads keep coming as you scroll. R10: the first one after two rows (so it is seen
                     early), then one every three rows; a short list gets one at its end */
                  const row = view.list ? 1 : Math.max(1, +view.cols || 4), first = row * 2, every = row * 3, n = k + 1;
                  const mid = n === first ? 1 : n > first && (n - first) % every === 0 ? 1 + (n - first) / every : 0;
                  const slot = mid && n < shown.length ? mid : n === shown.length && shown.length >= 3 && shown.length < first + every ? (mid || Math.floor(Math.max(0, n - first) / every) + 1) + (n >= first ? 1 : 0) : 0;
                  return <React.Fragment key={p.id}><ProductCard p={p} st={st} trade={trade} open={open} list={view.list} fits={myModels.get(p.model_id)} tour={k === 0} />{slot ? <InlineAd slot={slot} lastCat={f.cats[0]} /> : null}</React.Fragment>;
                })}
              </div>
            ) : (
              <div className="sp-empty shop-none">
                <LiveSam circle size={96} mood="think" />
                <b>{T('Nothing matches all of that.')}</b>
                <span>{T('Remove a filter, try another spelling, or ask me: we may have it in the back.')}</span>
                <span className="sp-acts" style={{ justifyContent: 'center' }}><button type="button" className="sp-btn sm" onClick={() => setF({ ...EMPTY })}>{T('Clear filters')}</button><button type="button" className="sp-btn sm ghost" onClick={() => window.dispatchEvent(new CustomEvent('se:chat', { detail: { q: f.q || 'Do you have this part?' } }))}>{T('Ask Samsoom')}</button></span>
              </div>
            )}
            {shown.length < res.length ? <div className="shop-more"><span>{T('Showing')} {shown.length} {T('of')} {fmt(res.length)}</span><i><em style={{ width: (shown.length / res.length) * 100 + '%' }} /></i><button type="button" className="sp-btn dark" onClick={() => setPage(page + 1)}>{T('Show more')}</button></div> : null}
          </div>
        </div>
      </div>

      <div className={'shop-dock' + (dock ? ' on' : '')} aria-hidden={!dock}>
        <div className="sp-wrap shop-dock-in">
          {/* owner (16 Nov): once you scroll, the shop has its OWN bar (no double bar): logo, search, results and
              filters, then account, cart and the menu (they use the site bar's own buttons) */}
          <a className="shop-dock-logo" href="/" aria-label="Sam Electronics"><LogoMark size={40} animate={false} /><span><b>SAM ELECTRONICS</b><small>QUALITY · WARRANTY · PRICE</small></span></a>
          {/* owner (18 Nov): "a premium search that follows you, with an LED running round its outline, and only the shop's
              essential tools": search in a running-light frame, then Find My Part, Filters, Compare and the cart */}
          <span className="dk-led"><ShopSearch compact count={res.length} q={f.q} onQ={(q) => { set({ q }); }} onFmp={openFmp} onFilters={() => (window.innerWidth > 1100 ? setCz(true) : setSide(true))} nFilters={chips.length} /></span>
          <span className="dk-tools">
            <button type="button" className="dk-b" disabled={cmp.length < 1} onClick={() => setCmpOpen(true)} aria-label={T('Compare')}><CompareIcon size={16} /><span className="t">{T('Compare')}</span>{cmp.length ? <em>{cmp.length}</em> : null}</button>
            <span className="shop-dock-ic" ref={dockIc}>
              <button type="button" data-mirror='header [data-tour="cart"]' aria-label={T('Cart')} onClick={() => (document.querySelector('header [data-tour="cart"]') as HTMLElement | null)?.click()} />
            </span>
          </span>
        </div>
      </div>

      {/* compare tray */}
      {cmp.length ? (
        <div className="cmp-tray">
          <span className="cmp-l"><b>{T('Compare')}</b><small>{cmp.length < 2 ? T('Pick another part to compare') : cmp.length + ' / 3'}</small></span>
          <span className="cmp-items">{cmp.map((p) => <span key={p.id} className="cmp-it"><img src={p.img} alt="" /><span className="cmp-it-t"><small>{p.title}</small><GradeTag g={p.grade} name={p.gradeName} size="sm" /></span><button type="button" onClick={() => store.cmp(p.id)} aria-label={T('Remove')}>×</button></span>)}</span>
          <button type="button" className="sp-btn sm" disabled={cmp.length < 2} onClick={() => { close(); setCmpOpen(true); }}>{T('Compare now')}</button>
          <button type="button" className="cmp-clr" onClick={() => cmp.forEach((p) => store.cmp(p.id))}>{T('Clear')}</button>
        </div>
      ) : null}
      {cmpOpen && cmp.length ? <CompareView items={cmp} onClose={() => setCmpOpen(false)} onOpen={(p) => open(p)} /> : null}

      <Customize open={cz} f={f} view={view} onClose={() => setCz(false)} onApply={(nf, nv) => { setF(nf); setView(nv); setCz(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <ProductView id={pid} me={me} onClose={close} onOpen={open} />
    </div>
  );
}
