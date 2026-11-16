'use client';
// P2 · Shop adverts: a big rotating banner (like the home's screen adverts) and promo tiles beside it. Texts and offers are
// samples; from the Control Room (Site → Banners) the team will write their own.
import React, { useEffect, useState } from 'react';
import { T } from '@/components/site/ui';
import { siteRaw } from '@/lib/catalog';
import ShopFilm from './ShopFilm';

type Side = { k: string; t: string; d: string; cta: string; href: string; img: string; c: string; wide?: boolean };
const SIDE: Side[][] = [
  [
    { k: 'FOR REPAIR SHOPS', t: 'Trade prices on every grade', d: 'Apply once, see both prices in the shop.', cta: 'Apply', href: '/wholesale', img: '/assets/pose/samsung-sp-480.webp', c: 'y' },
    { k: 'WORLDWIDE', t: 'Pallets to four regions', d: 'Packed in Deira, tracked to your door.', cta: 'Ship with us', href: '/worldwide', img: '/assets/pallet/pallet-600.webp', c: 'w', wide: true },
    { k: 'SAM CIRCUIT', t: 'Points on every part', d: 'Your first purchase activates the card.', cta: 'Get the card', href: '/membership', img: '/assets/pose/solo-bat-480.webp', c: 'y' },
  ],
  [
    { k: 'REPAIR LAB', t: 'Fitted while you wait', d: 'Fitting from AED 25 (sample).', cta: 'Book a repair', href: '/repair', img: '/assets/pose/rep-fixed-480.webp', c: 'd' },
    { k: 'BENCH TESTED', t: 'Every screen passes the rig', d: 'Display, touch, True Tone and battery.', cta: 'Shop screens', href: '/shop?cat=SCR', img: '/assets/pose/solo-scr-480.webp', c: 'd' },
    { k: 'ASK SAMSOOM', t: 'Not sure which part?', d: 'Tell me the model, I find the part.', cta: 'Ask now', href: '/samsoom', img: '/assets/pose/solo-board-480.webp', c: 'd' },
  ],
];
type Slide = { k: string; t: string; a: string; d: string; cta: string; go: () => void; img: string; bg: string; ink: string; film?: boolean };

export default function Banners({ onDeals, onCat }: { onDeals: () => void; onCat: (c: string) => void }) {
  // the slides are edited in the Control Room (Site & Samsoom → Shop banners); these are the defaults
  const DEF: Slide[] = [
    // owner (16 Nov): the teardown film's energy in the shop: the commercial plays on a phone in the first banner
    { k: 'IN STOCK · DEIRA', t: 'Every part.', a: 'Every grade.', d: 'Screens, batteries, cameras, flex and more, tested before they ship.', cta: 'Shop all parts', go: () => document.querySelector('.shop-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), img: '', bg: 'radial-gradient(80% 120% at 75% 50%, #3A3C40, #232427 60%, #1A1B1D)', ink: '#FFFFFF', film: true },
    { k: 'THIS WEEK · SAMPLE OFFER', t: 'Battery week.', a: 'Up to 15% off.', d: 'Genuine cells, tested before they ship.', cta: 'Shop batteries', go: () => onCat('BAT'), img: '/assets/pose/part-bat-960.webp', bg: 'linear-gradient(120deg,#F7C032,#FFD566)', ink: '#26282B' },
    { k: 'SERVICE PACK SCREENS', t: 'The original.', a: 'In its original box.', d: 'Same color, brightness and touch as new.', cta: 'Shop screens', go: () => onCat('SCR'), img: '/assets/pose/samsung-sp-960.webp', bg: 'linear-gradient(120deg,#26282B,#3D3E3F)', ink: '#FFFFFF' },
    { k: 'DEALS & ARRIVALS', t: 'Fresh stock.', a: 'Limited offers.', d: 'New shipments every week, and offers that end soon.', cta: 'See every deal', go: onDeals, img: '/assets/pose/part-cam-960.webp', bg: 'linear-gradient(120deg,#FFFFFF,#F2F3F4)', ink: '#26282B' },
  ];  const saved = siteRaw<{ k: string; t: string; a: string; d: string; cta: string; href: string; img: string; bg: string; ink: string }[] | null>('shop-banners', null);
  const S: Slide[] = saved && saved.length ? saved.map((x) => ({ ...x, go: () => { location.href = x.href || '/shop'; } })) : DEF;

  const [i, setI] = useState(0), [pause, setPause] = useState(false), [si, setSi] = useState(0);
  useEffect(() => { if (pause) return; const t = window.setTimeout(() => setSi((n) => n + 1), 4800); return () => window.clearTimeout(t); }, [si, pause]);
  useEffect(() => { if (pause) return; const t = window.setTimeout(() => setI((n) => (n + 1) % S.length), S[i] && S[i].film ? 15000 : 6000); return () => window.clearTimeout(t); }, [i, pause, S.length]);
  const s = S[i];
  return (
    <section className="ad" aria-label={T('Offers')}>
      <div className="ad-main" style={{ background: s.bg, color: s.ink }} onPointerEnter={() => setPause(true)} onPointerLeave={() => setPause(false)}>
        <div className="ad-txt" key={'t' + i}>
          <span className="ad-k">{T(s.k)}</span>
          <b className="ad-t">{T(s.t)}<br /><em>{T(s.a)}</em></b>
          <span className="ad-d">{T(s.d)}</span>
          <button type="button" className={'sp-btn' + (s.ink === '#FFFFFF' ? '' : ' dark')} onClick={s.go}>{T(s.cta)}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
        </div>
        {s.film ? <ShopFilm key={'f' + i} /> : <img key={'i' + i} className="ad-img" src={s.img} alt="" />}
        <span className="ad-dots">{S.map((_, k) => <button key={k} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={'Slide ' + (k + 1)}><i style={{ animationPlayState: pause ? 'paused' : 'running', animationDuration: S[k] && S[k].film ? '15s' : undefined }} /></button>)}</span>
      </div>
      {/* owner: the ads always change and come in moving, never a squeezed line of cartons: two slots, each turning
          through its own set, one clean picture per ad, a few seconds apart so the page always has something new */}
      <div className="ad-side">
        {[0, 1].map((slot) => { const set = SIDE[slot], a = set[(si + slot) % set.length]; return (
          <a key={slot + '-' + ((si + slot) % set.length)} className={'ad-tile ' + a.c} href={a.href} onPointerEnter={() => setPause(true)} onPointerLeave={() => setPause(false)}>
            <span className="ad-k">{T(a.k)}</span><b>{T(a.t)}</b><small>{T(a.d)}</small>
            <span className="ad-go">{T(a.cta)}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            <img src={a.img} alt="" className={a.wide ? 'wide' : ''} />
            <span className="ad-pips" aria-hidden="true">{set.map((_, k) => <i key={k} className={k === (si + slot) % set.length ? 'on' : ''} />)}</span>
          </a>); })}
      </div>
    </section>
  );
}
