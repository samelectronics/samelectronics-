'use client';
// Owner (16 Nov): "a techy touch and a nice readable title, some cool bold lettering somewhere, and the ads' rolling tape:
// bold and crazy but readable and professional". The title reads normally (white line, yellow line) and slams in like the
// teardown ad; one giant outlined page word sits behind it; two tapes cross the bottom of the header (yellow and graphite),
// unroll when the page opens and keep rolling with that page's facts.
import React, { useEffect, useState } from 'react';
import { T } from './ui';

export function HeroTitle({ a, b, className = 'sp-h1' }: { a: string; b?: string; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setOn(true), 60); return () => window.clearTimeout(t); }, []);
  let n = 0;
  const word = (w: string, cls: string) => { const i = n++; return <span key={i} className={'ht2-w ' + cls} style={{ ['--i' as string]: i, ['--s' as string]: i % 2 ? 1 : -1 } as React.CSSProperties}><span>{w}</span></span>; };
  return (
    <h1 className={className + ' ht2' + (on ? ' on' : '')} aria-label={a + (b ? ' ' + b : '')}>
      <span className="ht2-l a" aria-hidden="true">{a.split(' ').filter(Boolean).map((w) => word(w, ''))}</span>
      {b ? <span className="ht2-l b" aria-hidden="true">{b.split(' ').filter(Boolean).map((w) => word(w, 'y'))}</span> : null}
    </h1>
  );
}

const TAPES: Record<string, [string[], string[]]> = {
  shop: [['EVERY PART', 'EVERY GRADE', 'TESTED BEFORE IT SHIPS', 'IN STOCK IN DEIRA'], ['396 PARTS', '801 MODELS', '15 BRANDS', 'TRADE PRICES']],
  deals: [['DEALS THAT END SOON', 'NEW STOCK EVERY WEEK', 'LIMITED'], ['OFFERS', 'ARRIVALS', 'LAST PIECES']],
  repair: [['FITTED WHILE YOU WAIT', 'TESTED TWICE', 'WARRANTY ON EVERY FIX'], ['REPAIR LAB', 'AL MURAR · DEIRA', 'MOST IN AN HOUR']],
  wholesale: [['TRADE PRICES', 'BOTH PRICES ON EVERY PART', 'INVOICED TO YOUR COMPANY'], ['REPAIR SHOPS', 'TRADERS', 'EXPORTERS']],
  worldwide: [['PACKED IN DEIRA', 'TRACKED TO YOUR DOOR', 'FOUR REGIONS'], ['MIDDLE EAST', 'AFRICA', 'EUROPE', 'ASIA']],
  story: [['SINCE 2003', 'SAME FAMILY', 'SAME STREET'], ['SYRIA TELL', 'SAM ELECTRONICS', 'MADRID SOON']],
  membership: [['SAM CIRCUIT', 'SAM GRID', 'SAM CIRCLE'], ['AED 1 = 1 POINT', 'LEVEL UP', 'MEMBER PERKS']],
  brands: [['EVERY BRAND', 'EVERY MAKER', 'EVERY GRADE'], ['ORIGINAL', 'OLED', 'INCELL', 'AAA']],
  contact: [['WHATSAPP', 'WECHAT', 'CALL', 'VISIT'], ['REAL PEOPLE', 'IN DEIRA', 'REPLIES FAST']],
};
const tapeKey = () => (typeof location !== 'undefined' ? location.pathname.split('/')[1] || 'home' : 'home');

export function HeroBack({ word }: { word: string }) {
  const W = (word || '').toUpperCase(), [y, g] = TAPES[tapeKey()] || [['QUALITY', 'WARRANTY', 'PRICE'], ['SAM ELECTRONICS', 'DEIRA', 'SINCE 2003']];
  const run = (xs: string[]) => { const one = xs.map((x) => T(x)); return [...one, ...one, ...one, ...one]; };
  return (
    <div className="ht2-bg" aria-hidden="true">
      <span className="ht2-big" data-no-i18n="">{W}</span>
      <div className="ht2-tape g"><div className="ht2-tape-in"><span className="ht2-tape-t">{[0, 1].map((k) => <span key={k}>{run(g).map((x, i) => <React.Fragment key={i}><b>{x}</b><i>●</i></React.Fragment>)}</span>)}</span></div></div>
      <div className="ht2-tape y"><div className="ht2-tape-in"><span className="ht2-tape-t">{[0, 1].map((k) => <span key={k}>{run(y).map((x, i) => <React.Fragment key={i}><b>{x}</b><i>◆</i></React.Fragment>)}</span>)}</span><i className="ht2-glint" /></div></div>
    </div>
  );
}
