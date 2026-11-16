'use client';
// Page headers (owner, 16 Nov: "techy, readable, our own idea").
//  · Scan reveal: when the page opens, one thin yellow scanning light sweeps across the header; the title is revealed
//    behind it (it reads left to right, white line then yellow line) and the outlined page word lights up as it passes.
//  · Live readout: a slim instrument line under the title with real, live numbers: Deira time (ticking), the shop's open
//    status, the parts online (counting up) and one true fact for that page.
import React, { useEffect, useState } from 'react';
import { shopStatus } from '@/lib/shopStatus';
import { facts } from '@/content/facts';
import { products } from '@/lib/catalog';

const tr = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n?.t(s)) || s;

export function HeroTitle({ a, b, className = 'sp-h1' }: { a: string; b?: string; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setOn(true), 40); return () => window.clearTimeout(t); }, []);
  return (
    <h1 className={className + ' ht3' + (on ? ' on' : '')}>
      <span className="ht3-l a">{a}</span>
      {b ? <> <span className="ht3-l b">{b}</span></> : null}
    </h1>
  );
}

/** the scanning light (sits in the header background) */
export function HeroBack(_: { word: string }) { return <i className="ht3-scan" aria-hidden="true" />; }

const EXTRA: Record<string, string> = {
  repair: 'WARRANTY ON EVERY FIX', wholesale: 'TRADE PRICE ON EVERY PART', worldwide: 'SHIPS EVERY WEEK', membership: 'AED 1 = 1 POINT',
  contact: 'WHATSAPP · WECHAT · CALL', brands: 'EVERY GRADE, EVERY BRAND', shop: 'TESTED BEFORE IT SHIPS', deals: 'NEW STOCK EVERY WEEK', story: 'SAME FAMILY, SAME STREET',
};

export function HeroReadout() {
  const [now, setNow] = useState<number | null>(null), [n, setN] = useState(0), [total, setTotal] = useState(0);
  useEffect(() => {
    setNow(Date.now()); const id = window.setInterval(() => setNow(Date.now()), 1000);
    const read = () => setTotal(products().length); read(); window.addEventListener('se:catalog', read);
    return () => { window.clearInterval(id); window.removeEventListener('se:catalog', read); };
  }, []);
  useEffect(() => { if (!total) return; const t0 = performance.now(); let r = 0; const step = (t: number) => { const k = Math.min(1, (t - t0) / 1400); setN(Math.round(total * (1 - Math.pow(1 - k, 3)))); if (k < 1) r = requestAnimationFrame(step); }; const d = window.setTimeout(() => { r = requestAnimationFrame(step); }, 900); return () => { window.clearTimeout(d); cancelAnimationFrame(r); }; }, [total]);
  if (now == null) return <div className="ht3-ro" aria-hidden="true" />;
  const g = new Date(now + 4 * 36e5), p2 = (x: number) => String(x).padStart(2, '0');
  const st = shopStatus((facts.hours as unknown as { value: Record<number, [number, number][]> }).value, now);
  const key = location.pathname.split('/')[1] || 'home', ex = EXTRA[key], yrs = new Date().getFullYear() - 2003;
  return (
    <div className="ht3-ro" role="status" aria-live="off" data-no-i18n="">
      <span className="ht3-ri"><small>DEIRA</small><b dir="ltr">{p2(g.getUTCHours())}:{p2(g.getUTCMinutes())}<em>:{p2(g.getUTCSeconds())}</em></b></span>
      <span className={'ht3-ri sst ' + st.state}><i className="dot" /><b>{tr(st.short)}</b></span>
      {total ? <span className="ht3-ri"><b dir="ltr">{n.toLocaleString('en-US')}</b><small>{tr('PARTS ONLINE')}</small></span> : null}
      {key === 'story' ? <span className="ht3-ri"><b dir="ltr">{yrs}+</b><small>{tr('YEARS IN DEIRA')}</small></span> : null}
      {ex && key !== 'story' ? <span className="ht3-ri x"><small>{tr(ex)}</small></span> : null}
    </div>
  );
}
