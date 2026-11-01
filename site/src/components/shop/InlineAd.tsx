'use client';
// R9 · ads between the product rows of the shop. At most three ad strips on a page; each strip rotates by itself (pauses on
// hover) and the whole strip is a link. The team edits them in the Control Room (Ads & pop-ups → 'shop-ads'); these are the
// samples. With the Booster choice on, the strip leads with the ad that matches the part you looked at last.
// Styles in src/styles/dc-base.css (.iad-*).
import React, { useEffect, useMemo, useState } from 'react';
import { T } from '@/components/site/ui';
import { siteRaw } from '@/lib/catalog';
import { allowed } from '@/lib/prefs';

export type Ad = { id: string; k: string; t: string; d: string; cta: string; href: string; img: string; tone: 'y' | 'd' | 'w'; cat?: string };
export const ADS_DEFAULT: Ad[] = [
  { id: 'a1', k: 'SAMPLE OFFER', t: 'Screens with a 6-month warranty', d: 'Service pack and tested grades, fitted or shipped.', cta: 'Shop screens', href: '/shop?cat=SCR', img: '/assets/pose/samsung-sp-480.webp', tone: 'd', cat: 'SCR' },
  { id: 'a2', k: 'REPAIR LAB', t: 'Fitted while you wait', d: 'Bring your phone to Deira. Most fits take under an hour.', cta: 'Book a repair', href: '/repair', img: '/assets/pose/rep-fixed-480.webp', tone: 'y' },
  { id: 'a3', k: 'TRADE', t: 'Repair shop? See trade prices', d: 'Apply once. Every part shows your price.', cta: 'Apply for trade', href: '/wholesale#apply', img: '/assets/pose/line-all-480.webp', tone: 'w' },
  { id: 'a4', k: 'BATTERY WEEK', t: 'Genuine cells, tested', d: 'Capacity checked before they leave the shop.', cta: 'Shop batteries', href: '/shop?cat=BAT', img: '/assets/pose/part-bat-480.webp', tone: 'y', cat: 'BAT' },
  { id: 'a5', k: 'CAMERAS', t: 'Sharp again', d: 'Rear and front cameras for most models.', cta: 'Shop cameras', href: '/shop?cat=CAM', img: '/assets/pose/part-cam-480.webp', tone: 'd', cat: 'CAM' },
];
export const shopAds = (): Ad[] => { const s = siteRaw<Ad[] | null>('shop-ads', null); return s && s.length ? s : ADS_DEFAULT; };

export default function InlineAd({ slot, lastCat }: { slot: number; lastCat?: string }) {
  const list = useMemo(() => {
    const all = shopAds(); const n = all.length; const rot = all.map((_, i) => all[(i + slot * 2) % n]);
    if (lastCat && allowed('booster')) { const m = rot.findIndex((a) => a.cat === lastCat); if (m > 0) rot.unshift(...rot.splice(m, 1)); }
    return rot.slice(0, 3);
  }, [slot, lastCat]);
  const [i, setI] = useState(0), [pause, setPause] = useState(false);
  useEffect(() => { if (pause || list.length < 2) return; const t = window.setTimeout(() => setI((n) => (n + 1) % list.length), 5500); return () => window.clearTimeout(t); }, [i, pause, list.length]);
  const a = list[i]; if (!a) return null;
  return (
    <a className={'iad iad-' + a.tone} href={a.href} onPointerEnter={() => setPause(true)} onPointerLeave={() => setPause(false)} aria-label={T(a.t)}>
      <span className="iad-k">{T(a.k)} <em>{T('Ad')}</em></span>
      <span className="iad-txt" key={a.id}><b>{T(a.t)}</b><small>{T(a.d)}</small></span>
      <img key={'i' + a.id} src={a.img} alt="" loading="lazy" />
      <span className="iad-cta">{T(a.cta)} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
      {list.length > 1 ? <span className="iad-dots" onClick={(e) => e.preventDefault()}>{list.map((x, k) => <button key={x.id} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={'Ad ' + (k + 1)}><i style={{ animationPlayState: pause ? 'paused' : 'running' }} /></button>)}</span> : null}
    </a>
  );
}
