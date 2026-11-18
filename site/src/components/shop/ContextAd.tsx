'use client';
// Owner (18 Nov): "all filters must have ads. If it's 'everything' the ads can be mixed; if it's something specific the ad
// should be specific to that option". When the visitor is on Offers, New arrivals, Limited stock, one part family or one
// brand, the big advert becomes that topic's own commercial in the teardown style: the word slams in with a shake, the
// real parts of that topic whip in one after another, the numbers count, the grade tags drop; it loops calmly.
import React, { useEffect, useState } from 'react';
import { type Product, priceText, data } from '@/lib/catalog';
import { T } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { brandInk } from '@/lib/brandInk';
import { GradeTag, DealTag } from './Tags';

export type Ctx = { kind: 'deals' | 'new' | 'limited' | 'cat' | 'brand'; id?: string; items: Product[] };

function Countdown({ to }: { to: number }) {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const t = window.setInterval(() => setN(Date.now()), 1000); return () => window.clearInterval(t); }, []);
  const d = Math.max(0, to - n), h = Math.floor(d / 36e5), m = Math.floor((d % 36e5) / 6e4), s = Math.floor((d % 6e4) / 1e3), p = (x: number) => String(x).padStart(2, '0');
  return <span className="cad-cd" data-no-i18n=""><b>{p(h)}</b><i>:</i><b>{p(m)}</b><i>:</i><b>{p(s)}</b></span>;
}

export default function ContextAd({ ctx, onGo }: { ctx: Ctx; onGo: () => void }) {
  const D = data(), it = ctx.items.filter((p) => p.img);
  const [k, setK] = useState(0);
  useEffect(() => { const t = window.setInterval(() => setK((v) => v + 1), 2600); return () => window.clearInterval(t); }, []);
  const cat = ctx.kind === 'cat' ? D?.categories.find((c) => c.id === ctx.id) : null, brand = ctx.kind === 'brand' ? D?.brands.find((b) => b.id === ctx.id) : null;
  const from = it.length ? Math.min(...it.map((p) => p.price).filter((x) => x > 0)) : 0;
  const grades = Array.from(new Map(it.map((p) => [p.grade, p.gradeName])).entries());
  const ends = ctx.kind === 'deals' ? Math.min(...it.map((p) => p.dealEnds || Infinity)) : Infinity;
  const top = ctx.kind === 'deals' ? Math.max(0, ...it.map((p) => p.deal || 0)) : 0;
  const M: Record<Ctx['kind'], { k: string; a: string; b: string; word: string; ac: string; cta: string }> = {
    deals: { k: 'OFFERS · ENDING SOON', a: 'Deals that', b: 'end soon.', word: 'DEALS', ac: '#FF5A5F', cta: 'Shop every deal' },
    new: { k: 'NEW ARRIVALS · THIS WEEK', a: 'Fresh stock.', b: 'Just landed.', word: 'NEW', ac: '#38BDF8', cta: 'See what is new' },
    limited: { k: 'LIMITED STOCK', a: 'Last pieces.', b: 'Gone soon.', word: 'LAST', ac: '#F59E0B', cta: 'Grab them now' },
    cat: { k: (cat?.name || '').toUpperCase() + ' · ' + T('EVERY GRADE'), a: 'Every ' + (cat?.one || 'part').toLowerCase() + '.', b: 'Every grade.', word: (cat?.name || 'PARTS').toUpperCase(), ac: '#F7C032', cta: 'Show them all' },
    brand: { k: (brand?.name || '').toUpperCase() + ' · ' + T('PARTS'), a: 'Every ' + (brand?.name || '') + '.', b: 'Every part.', word: (brand?.name || 'BRAND').toUpperCase(), ac: brand ? brandInk(brand.id) : '#F7C032', cta: 'Show them all' },
  };
  const m = M[ctx.kind], ac = m.ac === '#000000' || m.ac === '#111111' ? '#F7C032' : m.ac;
  const show = it.length ? [0, 1, 2].map((n) => it[(k + n) % it.length]) : [];
  return (
    <div className="cad" style={{ ['--ac' as string]: ac } as React.CSSProperties} key={ctx.kind + (ctx.id || '')}>
      <span className="cad-bg" aria-hidden="true"><i className="glow" /><i className="band b1" /><i className="band b2" /><span className="cad-word" data-no-i18n="">{[0, 1].map((n) => <b key={n}>{m.word} · {m.word} · </b>)}</span></span>
      <div className="cad-l">
        <span className="cad-k">{brand ? <SEBrandLogo brand={brand.id} h={12} fit="60x14" color="#26282B" /> : <i className="rec" />}{T(m.k)}</span>
        <b className="cad-t" data-no-i18n=""><span className="a">{T(m.a).split(' ').map((w, n) => <span key={n} style={{ ['--w' as string]: n } as React.CSSProperties}>{w}</span>)}</span><span className="b">{T(m.b).split(' ').map((w, n) => <span key={n} style={{ ['--w' as string]: n + 3 } as React.CSSProperties}>{w}</span>)}</span></b>
        <span className="cad-stats">
          <span><b>{it.length}</b><small>{T('parts')}</small></span>
          {from ? <span><b>{priceText(from)}</b><small>{T('from')}</small></span> : null}
          {top ? <span><DealTag pct={top} /><small>{T('up to')}</small></span> : null}
          {ends < Infinity ? <span><Countdown to={ends} /><small>{T('first one ends in')}</small></span> : null}
        </span>
        {grades.length > 1 ? <span className="tg-row cad-g">{grades.slice(0, 6).map(([g, n], i) => <span key={g} style={{ ['--i' as string]: i } as React.CSSProperties}><GradeTag g={g} name={n} size="sm" /></span>)}</span> : null}
        <button type="button" className="cad-cta" onClick={onGo}>{T(m.cta)}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
      </div>
      <div className="cad-r" aria-hidden="true">
        {show.map((p, n) => p ? (
          <span key={p.id + '-' + k + '-' + n} className={'cad-p p' + n}>
            <img src={p.img} alt="" />
            <span className="cad-pl"><GradeTag g={p.grade} name={p.gradeName} size="sm" /><b>{p.modelName}</b><em>{priceText(p.price)}</em></span>
          </span>) : null)}
        <i className="cad-flash" key={'f' + k} />
      </div>
    </div>
  );
}
