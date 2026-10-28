'use client';
// P2 · Shop adverts: a big rotating banner (like the home's screen adverts) and promo tiles beside it. Texts and offers are
// samples; from the Control Room (Site → Banners) the team will write their own.
import React, { useEffect, useState } from 'react';
import { T } from '@/components/site/ui';

type Slide = { k: string; t: string; a: string; d: string; cta: string; go: () => void; img: string; bg: string; ink: string };

export default function Banners({ onDeals, onCat }: { onDeals: () => void; onCat: (c: string) => void }) {
  const S: Slide[] = [
    { k: 'THIS WEEK · SAMPLE OFFER', t: 'Battery week.', a: 'Up to 15% off.', d: 'Genuine cells, tested before they ship.', cta: 'Shop batteries', go: () => onCat('BAT'), img: '/assets/pose/part-bat-960.webp', bg: 'linear-gradient(120deg,#F7C032,#FFD566)', ink: '#26282B' },
    { k: 'SERVICE PACK SCREENS', t: 'The original.', a: 'In its original box.', d: 'Same colour, brightness and touch as new.', cta: 'Shop screens', go: () => onCat('SCR'), img: '/assets/pose/samsung-sp-960.webp', bg: 'linear-gradient(120deg,#26282B,#3D3E3F)', ink: '#FFFFFF' },
    { k: 'DEALS & ARRIVALS', t: 'Fresh stock.', a: 'Limited offers.', d: 'New shipments every week, and offers that end soon.', cta: 'See every deal', go: onDeals, img: '/assets/pose/part-cam-960.webp', bg: 'linear-gradient(120deg,#FFFFFF,#F2F3F4)', ink: '#26282B' },
  ];
  const [i, setI] = useState(0), [pause, setPause] = useState(false);
  useEffect(() => { if (pause) return; const t = window.setTimeout(() => setI((n) => (n + 1) % S.length), 6000); return () => window.clearTimeout(t); }, [i, pause, S.length]);
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
        <img key={'i' + i} className="ad-img" src={s.img} alt="" />
        <span className="ad-dots">{S.map((_, k) => <button key={k} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={'Slide ' + (k + 1)}><i style={{ animationPlayState: pause ? 'paused' : 'running' }} /></button>)}</span>
      </div>
      <div className="ad-side">
        <a className="ad-tile y" href="/wholesale"><span className="ad-k">{T('FOR REPAIR SHOPS')}</span><b>{T('Trade prices on every grade')}</b><small>{T('Apply once, see both prices in the shop.')}</small><img src="/assets/pose/line-all-480.webp" alt="" /></a>
        <a className="ad-tile d" href="/repair"><span className="ad-k">{T('REPAIR LAB')}</span><b>{T('Fitted while you wait')}</b><small>{T('Fitting from AED 25 (sample).')}</small><img src="/assets/pose/rep-fixed-480.webp" alt="" /></a>
      </div>
    </section>
  );
}
