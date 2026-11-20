'use client';
// Owner (R11): "they look broken and messy, not something I'd want to collect. Tech-inspired chips or tokens; the better
// it is, the better the colour and the details; premium and wow". Each achievement is a TOKEN: a round minted coin with a
// notched rim like a casino chip, an engraved circuit ring, the track's emblem raised in the centre, and its metal tells
// how hard it was to earn: bronze (easy), steel (medium), gold (hard), and platinum with our yellow LED ring (the rarest).
// A locked token is a dark blank with the emblem as a faint etch. Earned tokens catch a slow light.
// A BADGE (see Badge below) is the bigger thing: a hexagon frame with one socket per token of its track; it lights up when
// every socket is filled.
import React, { useId } from 'react';
import type { Tier } from '@/lib/achievements';

const EMBLEM: Record<string, string> = {
  explore: 'M12 3.5l2.4 6.1 6.1 2.4-6.1 2.4L12 20.5l-2.4-6.1L3.5 12l6.1-2.4z',
  shop: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
  bench: 'M14.5 4.5a4 4 0 0 0-4.9 5.2L4 15.3 6.7 18l5.6-5.6a4 4 0 0 0 5.2-4.9l-2.3 2.3-2.3-.6-.6-2.3z',
  train: 'M3 9l9-4.5L21 9l-9 4.5zM7 11v4.5c1.4 1.3 3 2 5 2s3.6-.7 5-2V11',
  teardown: 'M6 5h12v4H6zM5 10.5h14v3.5H5zM6 15.5h12V19H6z',
  rank: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z',
};
// rim light → face → face shadow → deep edge
const METAL: Record<string, [string, string, string, string]> = {
  bronze: ['#FFD2AE', '#D08A55', '#9A5A2C', '#5E3214'],
  silver: ['#FFFFFF', '#DCE1E6', '#A3AAB2', '#5F666E'],
  gold: ['#FFF4C8', '#F7C032', '#D39A12', '#7A5204'],
  platinum: ['#FFFFFF', '#EEF1F5', '#C4CAD2', '#7C838C'],
  off: ['#5A5E64', '#3D4045', '#2E3034', '#202225'],
};

export default function Medal({ tier, on = true, size = 72, group = 'explore' }: { tier: Tier; on?: boolean; size?: number; glyph?: string; group?: string }) {
  const id = useId().replace(/:/g, ''), k = on ? tier : 'off', [a, b, c, d] = METAL[k] || METAL.gold, plat = on && tier === 'platinum';
  const notches = Array.from({ length: 24 }, (_, i) => i * 15);
  const ink = on ? (tier === 'gold' ? '#5A3C02' : tier === 'bronze' ? '#4A2610' : '#3A3F45') : 'rgba(255,255,255,.18)';
  return (
    <span className={'md3 md3-' + k + (on ? ' on' : ' off')} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <linearGradient id={'r' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".45" stopColor={b} /><stop offset=".75" stopColor={c} /><stop offset="1" stopColor={d} /></linearGradient>
          <radialGradient id={'f' + id} cx=".35" cy=".3" r=".85"><stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></radialGradient>
          <clipPath id={'c' + id}><circle cx="32" cy="32" r="30" /></clipPath>
        </defs>
        {plat ? <circle cx="32" cy="32" r="31.2" fill="none" stroke="#F7C032" strokeWidth="1.6" className="md3-led" /> : null}
        {/* the rim with its notches (a minted chip edge) */}
        <circle cx="32" cy="32" r="29.5" fill={'url(#r' + id + ')'} />
        <g fill={on ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.08)'}>{notches.map((r) => <rect key={r} x="30.6" y="2.8" width="2.8" height="5" rx="1" transform={`rotate(${r} 32 32)`} />)}</g>
        <circle cx="32" cy="32" r="23.5" fill={'url(#f' + id + ')'} stroke={on ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.4)'} strokeWidth=".8" />
        <circle cx="32" cy="32" r="23" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth=".5" strokeDasharray="1 1.4" />
        {/* the engraved circuit ring */}
        <g fill="none" stroke={ink} strokeOpacity={on ? 0.45 : 1} strokeWidth=".7" strokeLinecap="round">
          <circle cx="32" cy="32" r="18.5" strokeDasharray="6 2 1 2" />
          {[0, 60, 120, 180, 240, 300].map((r) => <g key={r} transform={`rotate(${r} 32 32)`}><path d="M32 13.5v3.4l2.2 2.2" /><circle cx="34.5" cy="19.4" r=".8" fill={ink} /></g>)}
        </g>
        {/* the raised emblem: highlight below, then the cut */}
        <g transform="translate(22 22) scale(.8333)" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={EMBLEM[group] || EMBLEM.explore} stroke={on ? 'rgba(255,255,255,.7)' : 'transparent'} strokeWidth="2.6" transform="translate(.4 .6)" />
          <path d={EMBLEM[group] || EMBLEM.explore} stroke={ink} strokeWidth="2.2" />
        </g>
        {on ? <g clipPath={'url(#c' + id + ')'}><rect className="md3-sheen" x="-30" y="-10" width="12" height="90" fill="rgba(255,255,255,.55)" transform="rotate(25)" /></g> : null}
      </svg>
    </span>
  );
}

/** a promotion rank: earned by finishing every token of a track (or of every track) */
export function Rank({ on, size = 56 }: { on: boolean; size?: number }) {
  return <Medal tier="platinum" on={on} size={size} group="rank" />;
}

/** a BADGE: a hexagon frame with a socket for each token of its track; lit when every socket is filled */
export function Badge({ group, have, of, size = 120, label }: { group: string; have: number; of: number; size?: number; label?: string }) {
  const full = have >= of && of > 0, n = Math.min(of, 8), pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [50 + Math.cos(a) * 31, 50 + Math.sin(a) * 31]; });
  return (
    <span className={'bd3' + (full ? ' full' : '')} style={{ width: size, height: size }} aria-label={label}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" fill={full ? '#26282B' : '#2E3034'} stroke={full ? '#F7C032' : 'rgba(255,255,255,.14)'} strokeWidth={full ? 2.4 : 1.2} className={full ? 'bd3-led' : undefined} />
        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.6" fill={i < have ? '#F7C032' : '#1E1F21'} stroke={i < have ? '#FFE08A' : 'rgba(255,255,255,.12)'} strokeWidth="1" />)}
        <g transform="translate(38 38)" fill="none" stroke={full ? '#F7C032' : 'rgba(255,255,255,.35)'} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d={EMBLEM[group] || EMBLEM.explore} /></g>
      </svg>
      <small dir="ltr">{Math.min(have, of)} / {of}</small>
    </span>
  );
}
