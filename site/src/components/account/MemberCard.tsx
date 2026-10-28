'use client';
// P3 · The Sam Circuit / Grid / Circle card as it appears in My Bench and on the membership page: the same card as the
// home page's card builder (styles in circuit.css), filled with the member's own name, number and level.
import React, { useRef } from 'react';

export type CardKind = 'circuit' | 'grid' | 'circle';
export const CARD_NAME: Record<CardKind, [string, string]> = { circuit: ['SAM CIRCUIT', 'Member card'], grid: ['SAM GRID', 'Supplier card'], circle: ['SAM CIRCLE', 'Loyalty card'] };
export const LEVELS: Record<CardKind, string[]> = { circuit: ['Connected', 'Charged', 'Supercharged', 'Fully Charged', 'Lightning'], grid: ['Node', 'Hub', 'Network', 'Backbone', 'Mainframe'], circle: [] };

export default function MemberCard({ kind, name, no, level = 0, shop, tilt = true, ghost }: { kind: CardKind; name: string; no: string; level?: number; shop?: string; tilt?: boolean; ghost?: boolean }) {
  const ref = useRef<HTMLDivElement>(null), lv = LEVELS[kind], [nm, kd] = CARD_NAME[kind];
  const move = (e: React.PointerEvent) => { const c = ref.current; if (!c || !tilt) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.transform = `rotateX(${((0.5 - y) * 14).toFixed(2)}deg) rotateY(${((x - 0.5) * 20).toFixed(2)}deg)`; c.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--ly', (y * 100).toFixed(1) + '%'); };
  const leave = () => { const c = ref.current; if (c) { c.style.transform = ''; c.style.setProperty('--lx', '30%'); c.style.setProperty('--ly', '20%'); } };
  return (
    <div className={'mc' + (ghost ? ' ghost' : '')} onPointerMove={move} onPointerLeave={leave}>
      <div ref={ref} className={'cx-card k-' + kind}>
        <span className="cx-holo" aria-hidden="true" />
        <svg className="cx-trace" viewBox="0 0 400 252" aria-hidden="true">
          <path d="M248 0 V34 L274 60 H332" /><path d="M400 96 H352 L334 114 V150" /><path d="M400 176 H338 L316 154 H262 L244 136 H214" /><path d="M300 0 V14 L314 28 H372" />
          <circle cx="332" cy="60" r="3.4" /><circle cx="334" cy="150" r="3.4" /><circle cx="214" cy="136" r="3.4" /><circle cx="372" cy="28" r="3" />
        </svg>
        <img className="cx-logo" src="/assets/se-logo-320.webp" alt="" aria-hidden="true" />
        <div className="cx-card-in">
          <span className="top">
            <span className="brand"><b data-no-i18n="">{nm}</b><small>{kd}</small></span>
            {lv.length ? (
              <span className="cx-bat" aria-hidden="true">
                <span className="cx-bat-cells">{lv.map((_, i) => <i key={i + '-' + level} className={i <= level ? 'on' : ''} style={{ animationDelay: i * 0.09 + 's' }} />)}</span>
                <span className="cx-bat-nub" />
                <svg className="cx-bat-bolt" width="12" height="12" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
              </span>
            ) : <span className="cx-seal" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 15.3 6.8 18l1-5.8L3.6 8.1l5.8-.8z" /></svg></span>}
          </span>
          <span className="chip" aria-hidden="true"><i /><i /><i /></span>
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
