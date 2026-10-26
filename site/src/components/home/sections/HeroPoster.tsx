// Issue 1B: the ad poster. Clicking the hero phone opens this pop-up: the same ad, bigger and with more
// details (a short paragraph, key points, the stock line), in the phone ad's colours and type. An X at the
// top right, Esc and a click outside close it; the page behind dims and blurs.
'use client';
import PalletDrop from '../PalletDrop';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import type { Vals } from '@/dc/runtime';

const TH: Record<string, { bg: string; ink: string; sub: string; kick: string; cta: string; ctaInk: string; ghost: string; glow: string }> = {
  dark: { bg: 'radial-gradient(110% 80% at 70% 35%,#4B4B49 0%,#303132 52%,#1E1F21 100%)', ink: '#FFFFFF', sub: '#D5D7DA', kick: '#F7C032', cta: '#F7C032', ctaInk: '#26282B', ghost: 'rgba(255,255,255,.22)', glow: 'rgba(255,226,150,.38)' },
  yel: { bg: 'radial-gradient(110% 80% at 70% 35%,#FFE291 0%,#F7C032 56%,#F7C032 100%)', ink: '#26282B', sub: '#26282B', kick: '#26282B', cta: '#26282B', ctaInk: '#FFFFFF', ghost: 'rgba(38,40,43,.3)', glow: 'rgba(255,250,228,.75)' },
  light: { bg: 'radial-gradient(110% 80% at 70% 35%,#FFFFFF 0%,#F6F4F0 50%,#E5E1D9 100%)', ink: '#26282B', sub: '#3D3E3F', kick: '#26282B', cta: '#26282B', ctaInk: '#FFFFFF', ghost: 'rgba(38,40,43,.25)', glow: 'rgba(255,206,96,.3)' },
};

/** The worldwide card's globe, as drawn on the phone right now. */
const globeShot = () => {
  try {
    return (document.querySelector('[data-card="wld"] canvas') as HTMLCanvasElement | null)?.toDataURL() || '';
  } catch {
    return '';
  }
};

/** Wholesale: the real pallet, cartons dropping onto it on repeat (owner, 27 Oct: same as the ad). */
function Cartons() {
  return <PalletDrop style={{ position: 'relative', width: '100%', maxHeight: '92%' }} />;
}

export default function HeroPoster({ v }: { v: Vals }) {
  const p = v.poster || {};
  const box = useRef<HTMLDivElement>(null);
  // R6 §03 C: the poster grows out of the phone screen (450ms) and closes back into it
  const fromPhone = (): Keyframe[] | null => {
    const ph = document.querySelector('[data-se-reel]'), el = box.current;
    if (!ph || !el) return null;
    const a = ph.getBoundingClientRect(), b = el.getBoundingClientRect();
    const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2), k = Math.min(a.width / b.width, a.height / b.height);
    return [{ transform: `translate(${dx}px,${dy}px) scale(${k})`, opacity: 0.4, borderRadius: '40px' }, { transform: 'none', opacity: 1, borderRadius: '28px' }];
  };
  useLayoutEffect(() => {
    if (!p.open || !box.current) return;
    const kf = fromPhone(), reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (kf && !reduce) box.current.animate(kf, { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
  }, [p.open]);
  const close = () => {
    const kf = fromPhone(), reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!kf || reduce || !box.current) return p.close && p.close();
    const an = box.current.animate(kf.slice().reverse(), { duration: 380, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
    an.onfinish = () => p.close && p.close();
  };
  useEffect(() => {
    if (!p.open) return;
    window.seReel?.pause();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('keydown', esc); window.seReel?.resume(); };
  }, [p.open]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p.open) return null;
  const c = TH[p.th] || TH.dark;
  return (
    <div className="se-soon-scrim se-poster-scrim" onClick={close} role="presentation" style={{ zIndex: 190 }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={p.k}
        onClick={(e) => e.stopPropagation()}
        ref={box}
        className="se-poster"
        style={{ background: c.bg, color: c.ink }}
      >
        <button className="se-soon-x" onClick={close} aria-label="Close" style={{ color: c.ink, borderColor: c.ghost, zIndex: 3 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="se-poster-txt">
          <span className="se-poster-k" style={{ color: c.kick }}>{p.k}</span>
          <h3>
            <span>{p.l1}</span>
            <span>{p.l2}</span>
          </h3>
          <p className="se-poster-d" style={{ color: c.sub }}>{p.p}</p>
          <ul>
            {(p.pts || []).map((x: string) => (
              <li key={x}>
                <span style={{ background: c.cta, color: c.ctaInk }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4"><path d="M5 12l5 5L20 7" /></svg>
                </span>
                {x}
              </li>
            ))}
          </ul>
          <span className="se-poster-stock" style={{ color: c.sub }}>
            <i />
            {p.stock}
          </span>
          <div className="se-poster-row">
            <button onClick={p.go} style={{ background: c.cta, color: c.ctaInk }}>
              {p.shop}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <a href={p.wa} target="_blank" rel="noreferrer" style={{ color: c.ink, boxShadow: 'inset 0 0 0 1.5px ' + c.ghost }}>
              Ask on WhatsApp
            </a>
          </div>
        </div>
        <div className="se-poster-art">
          <span className="se-poster-glow" style={{ background: `radial-gradient(closest-side,${c.glow},rgba(255,255,255,0))` }} />
          {p.hasImg && p.fix ? (
            <span className="se-rep-poster">
              <img src={p.img} alt="" />
              <img className="se-rep-fix se-rep-loop" src={p.fix} alt="" />
              <span className="se-rep-beam se-rep-loop" />
            </span>
          ) /* owner (27 Oct): the same cracked → repaired phone as the ad */ : p.hasImg ? <img src={p.img} alt="" /> : p.isWld ? <img src={globeShot()} alt="" style={{ borderRadius: '50%' }} /> : <Cartons />}
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    seReel?: { pause: () => void; resume: () => void; go: (d: number) => void; master: () => number; sync: () => void };
  }
}
