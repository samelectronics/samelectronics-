'use client';
// Owner (R12): "the shop button's right side is boring now, just a graphite icon; I want it to switch and show movement:
// numbers of brands, logos moving one after another, but premium and rich, not cheap". A glass capsule that rolls
// through live facts: parts in stock (live dot), the brand logos sliding past one by one, models covered, grades.
import React, { useEffect, useState } from 'react';
import { T } from '@/components/site/ui';

const LOGOS = ['apple', 'samsung', 'xiaomi', 'huawei', 'honor', 'oppo', 'vivo', 'realme', 'oneplus', 'google', 'tecno', 'infinix', 'nokia', 'redmi', 'poco'];
export default function ShopTicker({ total }: { total: number }) {
  const t = (x: string) => String(T(x));
  const [i, setI] = useState(0), [n, setN] = useState({ models: 800, brands: 15 });
  useEffect(() => {
    const D = (window as unknown as { SE_DATA?: { models?: unknown[]; brands?: unknown[] } }).SE_DATA;
    if (D) setN({ models: D.models?.length || 800, brands: D.brands?.length || 15 });
    const red = matchMedia('(prefers-reduced-motion: reduce)').matches; if (red) return;
    const a = window.setInterval(() => setI((x) => (x + 1) % 3), 3200);
    return () => { window.clearInterval(a); };
  }, []);
  return (
    <span className="se-hb-info hb-tk" aria-label={total.toLocaleString('en-US') + ' ' + t('parts in stock')}>
      <span className={'tk-s' + (i === 0 ? ' on' : '')}><i className="tk-dot" aria-hidden="true" /><b>{total.toLocaleString('en-US')}</b> {t('parts in stock')}</span>
      <span className={'tk-s' + (i === 1 ? ' on' : '')} aria-hidden="true"><b>{n.brands}</b> {t('brands')}{/* R15 (owner: "it glitches and moves suddenly"): one smooth endless strip in a fixed window, nothing re-mounts or resizes */}<span className="tk-logos2"><span className="run">{[...LOGOS, ...LOGOS].map((l, k) => <img key={k} src={'/assets/brands/' + l + '.svg'} alt="" />)}</span></span></span>
      <span className={'tk-s' + (i === 2 ? ' on' : '')} aria-hidden="true"><b>{n.models}+</b> {t('phone models')}<span className="tk-gr"><em>A+</em><em>OLED</em><em>ORIG</em></span></span>
    </span>
  );
}
