'use client';
// P3 · The Sam Circuit / Grid / Circle card as it appears in My Bench and on the membership page: the same card as the
// home page's card builder (styles in circuit.css), filled with the member's own name, number and level.
import React, { useRef } from 'react';
import CardDetail from './CardDetail';

export type CardKind = 'circuit' | 'grid' | 'circle';
export const CARD_NAME: Record<CardKind, [string, string]> = { circuit: ['SAM CIRCUIT', 'Member card'], grid: ['SAM GRID', 'Supplier card'], circle: ['SAM CIRCLE', 'Loyalty card'] };
export const LEVELS: Record<CardKind, string[]> = { circuit: ['Connected', 'Charged', 'Supercharged', 'Fully Charged', 'Lightning'], grid: ['Node', 'Hub', 'Network', 'Backbone', 'Mainframe'], circle: [] };

export default function MemberCard({ kind, name, no, level = 0, shop, tilt = true, ghost }: { kind: CardKind; name: string; no: string; level?: number; shop?: string; tilt?: boolean; ghost?: boolean }) {
  const ref = useRef<HTMLDivElement>(null), lv = LEVELS[kind], [nm, kd] = CARD_NAME[kind];
  const move = (e: React.PointerEvent) => { const c = ref.current; if (!c || !tilt) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.transform = `rotateX(${((0.5 - y) * 14).toFixed(2)}deg) rotateY(${((x - 0.5) * 20).toFixed(2)}deg)`; c.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--ly', (y * 100).toFixed(1) + '%'); };
  const leave = () => { const c = ref.current; if (c) { c.style.transform = ''; c.style.setProperty('--lx', '30%'); c.style.setProperty('--ly', '20%'); } };
  return (
    <div className={'mc' + (ghost ? ' ghost' : '')} onPointerMove={move} onPointerLeave={leave}>
      <div ref={ref} className={'cx-card k-' + kind + ' lv-' + level}>
        <span className="cx-holo" aria-hidden="true" /><span className="cx-edge" aria-hidden="true" /><span className="mc-brush" aria-hidden="true" /><span className="mc-hologram" aria-hidden="true" /><span className="mc-sheen" aria-hidden="true" />
        <svg className="cx-trace" viewBox="0 0 400 252" aria-hidden="true">
          <path d="M248 0 V34 L274 60 H332" /><path d="M400 96 H352 L334 114 V150" /><path d="M400 176 H338 L316 154 H262 L244 136 H214" /><path d="M300 0 V14 L314 28 H372" />
          <circle cx="332" cy="60" r="3.4" /><circle cx="334" cy="150" r="3.4" /><circle cx="214" cy="136" r="3.4" /><circle cx="372" cy="28" r="3" />
        </svg>
        <img className="cx-logo" src="/assets/se-logo-320.webp" alt="" aria-hidden="true" />
        <CardDetail kind={kind} />
        <div className="cx-card-in">
          <span className="top">
            <span className="brand"><b data-no-i18n="">{nm}</b><small>{kd}</small></span>
            {lv.length ? (
              <span className="mc-meter" aria-hidden="true">{lv.map((_, i) => <i key={i + '-' + level} className={i <= level ? 'on' : ''} style={{ animationDelay: i * 0.09 + 's' }} />)}</span>
            ) : <span className="mc-meter star" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 15.3 6.8 18l1-5.8L3.6 8.1l5.8-.8z" /></svg></span>}
          </span>
          <span className="cx-chiprow mc-row" aria-hidden="true">
            <svg className="mc-chip" viewBox="0 0 50 38"><defs><linearGradient id="mcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FBEFC4" /><stop offset=".35" stopColor="#D6AE52" /><stop offset=".6" stopColor="#F5DC92" /><stop offset="1" stopColor="#A87C24" /></linearGradient></defs>
              <rect x=".5" y=".5" width="49" height="37" rx="6" fill="url(#mcg)" stroke="rgba(90,60,0,.45)" /><g fill="none" stroke="rgba(90,60,0,.55)" strokeWidth=".9"><path d="M0 13h16M0 25h16M34 13h16M34 25h16M16 0v38M34 0v38M16 19h18" /><rect x="16" y="8" width="18" height="22" rx="3" /></g></svg>
            <svg className="cx-nfc" width="20" height="20" viewBox="0 0 24 24"><path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" /></svg>
          </span>
          <span className="nm" data-no-i18n="">{name}</span>
          <span className="sh" data-no-i18n="">{shop || ' '}</span>
          <span className="bot">
            <span><small>{lv.length ? (kind === 'grid' ? 'TRADE LEVEL' : 'LEVEL') : 'INVITATION'}</small><b>{lv.length ? lv[level] : 'Sam Circle member'}</b></span>
            <span className="no" data-no-i18n="">{no}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
