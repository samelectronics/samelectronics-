'use client';
// P2 · One product in the shop grid (or list). Photo on the standard stage, grade + maker, rating, price ("· sample" until
// the owner's prices), the trade price (locked until the trade account is approved), stock estimate, and the actions:
// add to cart (flies into the cart), star, compare, "fits my device".
import PriceTag from './PriceTag';
import { buyable } from '@/lib/catalog';
import React, { useRef } from 'react';
import { type Product, aed } from '@/lib/catalog';
import { store, type State } from '@/lib/store';
import { Stars, flyToCart, T } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { GradeTag, MakerTag, DealTag, BestTag, NewTag } from './Tags';
import { CompareIcon } from './Icons';

export const stockLabel = (q: number) => (q <= 0 ? ['Out of stock · request it', 'out'] : q < 4 ? ['Only ' + q + ' left (estimate)', 'low'] : q < 15 ? ['In stock (estimate)', 'ok'] : ['Plenty in stock (estimate)', 'ok']);

export default function ProductCard({ p, st, trade, open, list, fits, tour }: { p: Product; st: State; trade: boolean; open: (p: Product) => void; list?: boolean; fits?: string; tour?: boolean }) {
  const img = useRef<HTMLImageElement>(null), fav = st.favs.includes(p.id), cmp = st.compare.includes(p.id), inCart = st.cart.find((l) => l.id === p.id);
  const [sl, sk] = stockLabel(p.stock_qty);
  return (
    <article className={'pc' + (list ? ' list' : '')} data-out={p.stock_qty <= 0 || undefined}>
      <button type="button" className="pc-img" onClick={() => open(p)} aria-label={T('View') + ' ' + p.title}>
        <span className="pc-stage" />
        {p.img ? <img ref={img} src={p.img} alt="" loading="lazy" decoding="async" /> : null}
        <span className="pc-badges">
          {p.deal ? <DealTag pct={p.deal} /> : null}
          {p.isNew ? <NewTag /> : null}
          {p.best ? <BestTag /> : null}
        </span>
        {/* owner (18 Nov): room for the brand's logo on every part, so it catches the eye */}
        <span className="pc-brand" aria-hidden="true"><SEBrandLogo brand={p.brand} h={12} fit="58x14" color="#26282B" /></span>
        <span className="pc-quick">{T('Quick view')}</span>
      </button>
      <div className="pc-side" {...(tour ? { 'data-tour-step': '8', 'data-tour-title': 'Star and compare', 'data-tour-text': 'Star a part to keep it in My Bench. The two-cards button adds it to Compare: up to three parts side by side.' } : {})}>
        <button type="button" className={'pc-ic' + (fav ? ' on' : '')} onClick={() => store.fav(p.id)} aria-pressed={fav} title={fav ? T('Starred') : T('Star it')}>
          <svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 16.8 6.1 20.1l1.3-6.6L2.5 8.9l6.6-.8z" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className={'pc-ic' + (cmp ? ' on' : '')} onClick={() => store.cmp(p.id)} aria-pressed={cmp} title={T('Compare')} aria-label={T('Compare')}>
          <CompareIcon />
        </button>
      </div>
      <div className="pc-body">
        <span className="pc-meta" {...(tour ? { 'data-tour-step': '7', 'data-tour-title': 'Grade and maker', 'data-tour-text': 'The coloured tag is the quality (Original, OLED, Incell, AAA and more). The dark tag with a light is who made it.' } : {})}><GradeTag g={p.grade} name={p.gradeName} size="sm" /><MakerTag m={p.manufacturer || ''} name={p.makerName} size="sm" />{fits ? <span className="pc-fits">✓ {T('Fits your')} {fits}</span> : null}</span>
        <button type="button" className="pc-t" onClick={() => open(p)}>{p.title}</button>
        <span className="pc-sub">{p.brandName} · {p.part_name}</span>
        <span className="pc-rate"><Stars v={p.rating} n={p.reviews} /><span className="sp-sample">sample</span></span>
        <span className="pc-price">
          <PriceTag p={p} trade={trade} />
        </span>
        <span className={'pc-trade' + (trade ? ' on' : '')}>
          {trade ? <>{T('Trade')} <b>{aed(p.wholesale_price, false)}</b> <span className="sp-sample">· sample</span></> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>{T('Trade price for approved accounts')}</>}
        </span>
        <span className={'pc-stock s-' + sk}><i />{sk === 'low' ? T('Only') + ' ' + p.stock_qty + ' ' + T('left (estimate)') : T(sl)}</span>
        <span className="pc-acts">
          <button type="button" className={'pc-add' + (inCart ? ' in' : '')} disabled={!buyable(p, trade)} onClick={(e) => flyToCart(img.current, p.id, e)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></svg>
            {p.stock_qty <= 0 ? (inCart ? T('Requested') + ' · ' + inCart.qty : T('Request it')) : inCart ? T('Add another') + ' · ' + inCart.qty : T('Add to cart')}
          </button>
        </span>
      </div>
    </article>
  );
}
