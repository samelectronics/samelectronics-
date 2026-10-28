'use client';
// P4 · BRANDS & MANUFACTURERS (/brands): every phone brand we stock (with its models, series and parts) and every parts
// manufacturer (Service Pack, OEM, GX, ZY…) explained — who makes it, what it is like, which grades and warranty. Shop
// products link here (#apple, #maker-gx). Manufacturer descriptions are drafts for the owner to confirm.
import React, { useEffect, useState } from 'react';
import { data, products } from '@/lib/catalog';
import { PageHero, T, useRise } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';

const MAKER: Record<string, [string, string, string]> = {
  'service-pack': ['The brand’s own part', 'Original parts in the brand’s service packaging, the same ones authorised service centres fit. Exact colours, brightness, touch and battery life.', 'Original · 6 months'],
  oem: ['Made by the original supplier', 'Produced by the factories that supply the brands, sold outside the brand’s own box. Very close to original.', 'Original / Compatible · up to 6 months'],
  repaied: ['Refurbished original', 'Original parts recovered and rebuilt (for example a new glass on an original panel), then tested.', 'Original grade · 3 months'],
  oled: ['OLED panels', 'Flexible OLED panels made to the original specification: deep blacks and true colours.', 'OLED Soft / Big / Small · 3 months'],
  gx: ['GX', 'A well-known aftermarket maker with consistent quality and packaging; our usual AAA choice.', 'AAA · 1 month'],
  zy: ['ZY', 'Aftermarket Incell and LCD panels: bright, reliable and affordable.', 'Incell · 1 month'],
  yk: ['YK', 'Aftermarket parts for the best price on older models.', 'AA / Standard · 1 month'],
  taiwan: ['Taiwan', 'Parts made in Taiwan factories, between original and aftermarket.', 'Compatible · 1–3 months'],
  anther: ['Other makers', 'Parts from other factories, tested and labelled by us.', 'As labelled'],
};

export default function BrandsPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const iv = window.setInterval(() => { if (data() && products().length) { window.clearInterval(iv); setReady(true); } }, 60); return () => window.clearInterval(iv); }, []);
  useRise(ready);
  useEffect(() => { if (ready && location.hash) window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300); }, [ready]);
  const D = data(); if (!ready || !D) return <div className="shop-wait"><span /><span /><span /></div>;
  const P = products();
  return (
    <>
      <PageHero eb={T('BRANDS & MANUFACTURERS')} title={T('Every brand.')} accent={T('Every maker, explained.')} crumb={[[T('Brands & manufacturers')]]} seed={109}
        sub={T('The phones we stock parts for, and the factories behind every part, so you always know exactly what you are buying.')}>
        <div className="sp-acts"><a className="sp-btn" href="#brands">{T('Phone brands')}</a><a className="sp-btn ghost" href="#makers">{T('Part manufacturers')}</a></div>
      </PageHero>

      <section id="brands" className="sp-sec w"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('PHONE BRANDS')}</span><h2 className="sp-h2">{D.brands.length} {T('brands,')} {D.models.length} {T('models')}</h2></div></div>
        <div className="br-grid">{D.brands.map((b, i) => {
          const ms = D.models.filter((m) => m.brand_id === b.id), ps = P.filter((p) => p.brand === b.id), series = [...new Set(ms.map((m) => m.series).filter(Boolean))].slice(0, 6);
          return (
            <article key={b.id} id={b.id} className="br-c" data-rise style={{ ['--i' as string]: i % 4 }}>
              <span className="br-logo"><SEBrandLogo brand={b.id} h={26} fit="140x30" color="#26282B" /></span>
              <span className="br-n"><b>{ms.length}</b> {T('models')} · <b>{ps.length}</b> {T('parts in the shop')}</span>
              <span className="br-ser">{series.map((s) => <span key={s} className="sp-tag">{s}</span>)}</span>
              <span className="sp-acts"><a className="sp-btn sm" href={'/shop?brand=' + b.id}>{T('Shop')} {b.name}</a><a className="sp-btn sm ghost" href={'/repair?model=' + (ms[0]?.id || '')}>{T('Repairs')}</a></span>
            </article>
          );
        })}</div>
      </div></section>

      <section id="makers" className="sp-sec d"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('PART MANUFACTURERS')}</span><h2 className="sp-h2" style={{ color: '#fff' }}>{T('Who makes your part.')}</h2><p className="sp-p">{T('Every part in the shop is labelled with two things: its quality, and who made it. Here is what each manufacturer means.')}</p></div></div>
        <div className="br-makers">{D.manufacturers.map((m) => {
          const [t, d, w] = MAKER[m.id] || ['', '', ''], n = P.filter((p) => p.manufacturer === m.id).length;
          return (
            <article key={m.id} id={'maker-' + m.id} className="br-m" data-rise>
              <span className="br-mk">{m.name.slice(0, 2).toUpperCase()}</span>
              <b className="sp-h3">{m.name}</b><small className="br-mt">{T(t)}</small>
              <p>{T(d)}</p>
              <span className="br-mw">{T(w)}</span>
              <a className="sp-btn sm" href={'/shop?maker=' + m.id}>{n ? n + ' ' + T('parts') : T('See parts')} →</a>
            </article>
          );
        })}</div>
      </div></section>

      <section className="sp-sec y"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('GRADES')}</span><h2 className="sp-h2">{T('Four grades, one honest label.')}</h2></div></div>
        <div className="sp-grid sp-g4" data-rise>{Object.entries(D.gradeNames).map(([g, n]) => <div key={g} className="sp-card"><span className={'pc-gr g-' + g}>{n}</span><b className="sp-h3" style={{ marginTop: 10, display: 'block' }}>{D.makerNames[g]}</b><p className="sp-p">{T({ OR: 'The part the brand itself fits.', OL: 'Close to original, at a lower price.', IN: 'Reliable everyday LCD, budget price.', AQ: 'Our best price, tested.' }[g] || '')}</p></div>)}</div>
      </div></section>
    </>
  );
}
