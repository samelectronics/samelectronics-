'use client';
// R6 §03 E · the hero iPad's own film, over the live inventory grid (16s loop):
//   0–6s the inventory grid · 6–12s brand feature (Samsung · Service Pack: the box + LCD turning slowly) · 12–16s a message
// screen with a WhatsApp bubble. Every ~10s a notification banner drops in for 3s (sample texts). CSS keyframes only,
// paused with the hero when it is off screen; the banner text changes with a small interval.
import { useEffect, useState } from 'react';

const NOTES = ['New: Galaxy S24 Ultra screens just dropped', 'Restocked: iPhone 16 batteries', 'Price drop: Redmi Note 13 screens', 'Just landed: Pixel 8 Pro cameras'];

export default function IpadFilm({ from }: { from: string }) {
  const [n, setN] = useState(0);
  useEffect(() => { const iv = window.setInterval(() => setN((x) => x + 1), 10000); return () => window.clearInterval(iv); }, []);
  const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
  const shot = typeof window !== 'undefined' && window.SE_SHOTS ? window.SE_SHOTS.url('samsung-sp', 480) : '';
  return (
    <>
      <div className="ipf-feat" aria-hidden="true">
        <span className="ipf-k">SAMSUNG · SERVICE PACK</span>
        <b>{T('Straight from the maker’s box.')}</b>
        <span className="ipf-stage">
          <span className="ipf-glow" />
          {shot ? <img src={shot} alt="" /> : null}
        </span>
        <span className="ipf-line">
          <i />
          {T('In stock')} · <span className="se-ltr">{from}</span>
        </span>
      </div>
      <div className="ipf-msg" aria-hidden="true">
        <span className="ipf-k">TRADE DESK</span>
        <b>{T('Same-day trade quotes.')}</b>
        <span className="ipf-chat">
          <span className="in">{T('Hi, 50 × A54 screens, price?')}</span>
          <span className="dots"><i /><i /><i /></span>
          <span className="out">{T('Quoted today. Sending your list now.')}</span>
        </span>
      </div>
      <div key={n} className="ipf-note" role="status">
        <i />
        {T(NOTES[n % NOTES.length])}
      </div>
    </>
  );
}

declare global {
  interface Window { SE_SHOTS?: { url: (id: string, w: number) => string } }
}
