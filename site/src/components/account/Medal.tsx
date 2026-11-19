'use client';
// Owner (19 Nov): "redesign all achievements into tokens or chips, tech-inspired and very premium; the more detail and
// the better colour the better". Each medal is a processor chip: gold pins on all four sides, a green-black substrate,
// a machined metal lid (bronze, steel or gold) with the track's emblem engraved, a laser-etched code, the level as
// one, two or three notches, and a status LED. A locked one is a bare grey chip. Earned ones catch a slow light.
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
const LID: Record<string, [string, string, string, string]> = {
  bronze: ['#F2B788', '#C07A45', '#8A4E22', '#5E3214'],
  silver: ['#FFFFFF', '#D3D8DE', '#9AA1A9', '#5F666E'],
  gold: ['#FFF1B8', '#F7C032', '#D39A12', '#8A5F05'],
  off: ['#6A6E74', '#4E5257', '#3C3F44', '#2E3034'],
};
const LV: Record<string, number> = { bronze: 1, silver: 2, gold: 3, off: 0 };
const CODE: Record<string, string> = { explore: 'EXP', shop: 'SHP', bench: 'BNC', train: 'TRN', teardown: 'TDN', rank: 'MST' };

export default function Medal({ tier, on = true, size = 72, group = 'explore' }: { tier: Tier; on?: boolean; size?: number; glyph?: string; group?: string }) {
  const id = useId().replace(/:/g, ''), k = on ? tier : 'off', [a, b, c, d] = LID[k], n = LV[tier];
  const pins = Array.from({ length: 7 }, (_, i) => 13 + i * 6.3);
  const pin = on ? 'url(#pn' + id + ')' : '#55585E';
  return (
    <span className={'md2 md2-' + k + (on ? ' on' : ' off')} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <linearGradient id={'l' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".35" stopColor={b} /><stop offset=".7" stopColor={c} /><stop offset="1" stopColor={d} /></linearGradient>
          <linearGradient id={'pn' + id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#B88A2A" /><stop offset=".5" stopColor="#FFE7A0" /><stop offset="1" stopColor="#B88A2A" /></linearGradient>
          <radialGradient id={'s' + id} cx=".3" cy=".2" r="1"><stop offset="0" stopColor={on ? '#2F3A33' : '#3A3C40'} /><stop offset="1" stopColor={on ? '#141A16' : '#26282B'} /></radialGradient>
          <pattern id={'g' + id} width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="1" fill="rgba(255,255,255,.07)" /></pattern>
          <clipPath id={'c' + id}><rect x="15" y="15" width="34" height="34" rx="3" /></clipPath>
        </defs>
        {/* pins on four sides */}
        <g fill={pin}>{pins.map((p) => <React.Fragment key={p}><rect x={p - 1.4} y="2.5" width="2.8" height="7" rx=".6" /><rect x={p - 1.4} y="54.5" width="2.8" height="7" rx=".6" /><rect x="2.5" y={p - 1.4} width="7" height="2.8" rx=".6" /><rect x="54.5" y={p - 1.4} width="7" height="2.8" rx=".6" /></React.Fragment>)}</g>
        {/* substrate with traces */}
        <rect x="8" y="8" width="48" height="48" rx="5" fill={'url(#s' + id + ')'} />
        <rect x="8.5" y="8.5" width="47" height="47" rx="4.5" fill="none" stroke={on ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)'} />
        <g stroke={on ? 'rgba(247,192,50,.35)' : 'rgba(255,255,255,.08)'} strokeWidth=".6" fill="none"><path d="M11 20h3M11 32h3M11 44h3M50 20h3M50 32h3M50 44h3M20 11v3M32 11v3M44 11v3M20 50v3M32 50v3M44 50v3" /></g>
        {/* the machined lid */}
        <rect x="15" y="15" width="34" height="34" rx="3" fill={'url(#l' + id + ')'} />
        <rect x="15" y="15" width="34" height="34" rx="3" fill={'url(#g' + id + ')'} />
        <rect x="15.5" y="15.5" width="33" height="33" rx="2.6" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth=".6" />
        <rect x="15" y="15" width="34" height="34" rx="3" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth=".5" />
        {/* engraved emblem: a dark cut with a light lower edge */}
        <g transform="translate(22.4 19.6) scale(.8)" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={EMBLEM[group] || EMBLEM.explore} stroke="rgba(255,255,255,.55)" strokeWidth="2.2" transform="translate(.5 .7)" />
          <path d={EMBLEM[group] || EMBLEM.explore} stroke={on ? 'rgba(40,26,4,.75)' : 'rgba(0,0,0,.45)'} strokeWidth="2" />
        </g>
        {/* laser-etched code and level notches */}
        <text x="18" y="46.6" fontFamily="JetBrains Mono, monospace" fontSize="3.6" letterSpacing=".3" fill={on ? 'rgba(40,26,4,.65)' : 'rgba(0,0,0,.4)'}>SE-{CODE[group] || 'EXP'}</text>
        <g fill={on ? 'rgba(40,26,4,.7)' : 'rgba(0,0,0,.35)'}>{Array.from({ length: n }).map((_, i) => <rect key={i} x={36 + i * 3.6} y="43.6" width="2.4" height="3.4" rx=".5" />)}</g>
        {/* status LED */}
        <circle cx="45.5" cy="18.5" r="1.6" fill={on ? '#5CFF8F' : '#4A4D52'} />
        {on ? <circle cx="45.5" cy="18.5" r="3.2" fill="rgba(92,255,143,.25)" /> : null}
        {on ? <g clipPath={'url(#c' + id + ')'}><rect className="md2-sheen" x="-40" y="-10" width="14" height="90" fill="rgba(255,255,255,.45)" transform="rotate(25)" /></g> : null}
      </svg>
    </span>
  );
}

/** a promotion rank: earned by finishing every medal of a track (or of every track) */
export function Rank({ on, size = 56 }: { on: boolean; size?: number }) {
  return <Medal tier="gold" on={on} size={size} group="rank" />;
}
