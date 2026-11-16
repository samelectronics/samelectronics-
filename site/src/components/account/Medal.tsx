'use client';
// Owner (17 Nov): "medals are just coins, make them more serious, themed with the site, with levels and promotions".
// Each medal is an insignia in the site's own language: a chamfered circuit-chip plate in graphite, a metal rim
// (bronze, steel or gold), the track's emblem engraved in the middle, and its level as one, two or three chevrons.
// A locked one is a dark blank with only the outline. Earned ones catch a slow light.
import React, { useId } from 'react';
import type { Tier } from '@/lib/achievements';

const EMBLEM: Record<string, string> = {
  explore: 'M12 3.5l2.4 6.1 6.1 2.4-6.1 2.4L12 20.5l-2.4-6.1L3.5 12l6.1-2.4z', // compass star
  shop: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8', // the part box
  bench: 'M14.5 4.5a4 4 0 0 0-4.9 5.2L4 15.3 6.7 18l5.6-5.6a4 4 0 0 0 5.2-4.9l-2.3 2.3-2.3-.6-.6-2.3z', // wrench
  train: 'M3 9l9-4.5L21 9l-9 4.5zM7 11v4.5c1.4 1.3 3 2 5 2s3.6-.7 5-2V11', // graduate
  teardown: 'M6 5h12v4H6zM5 10.5h14v3.5H5zM6 15.5h12V19H6z', // the layers of a phone
  rank: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z',
};
const RIM: Record<string, [string, string, string]> = {
  bronze: ['#E6A36B', '#A8622E', '#6E3C17'],
  silver: ['#F4F6F8', '#AEB4BB', '#6F757C'],
  gold: ['#FFE38A', '#F7C032', '#B47E0B'],
  off: ['#4A4D52', '#3A3D42', '#2A2C2F'],
};
const LV: Record<string, number> = { bronze: 1, silver: 2, gold: 3, off: 0 };

export default function Medal({ tier, on = true, size = 72, group = 'explore' }: { tier: Tier; on?: boolean; size?: number; glyph?: string; group?: string }) {
  const id = useId().replace(/:/g, ''), k = on ? tier : 'off', [a, b, c] = RIM[k], n = LV[tier];
  const plate = 'M20 4h24l16 16v24L44 60H20L4 44V20z';
  return (
    <span className={'md2 md2-' + k + (on ? ' on' : ' off')} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <linearGradient id={'r' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".5" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
          <radialGradient id={'p' + id} cx=".35" cy=".25" r=".9"><stop offset="0" stopColor={on ? '#44474C' : '#2E3034'} /><stop offset="1" stopColor={on ? '#202225' : '#232527'} /></radialGradient>
          <clipPath id={'c' + id}><path d={plate} /></clipPath>
        </defs>
        <path d={plate} fill={'url(#r' + id + ')'} />
        <path d="M21.5 8h21L56 21.5v21L42.5 56h-21L8 42.5v-21z" fill={'url(#p' + id + ')'} />
        {/* the circuit etched into the plate */}
        <g stroke={on ? b : '#3E4146'} strokeWidth=".8" fill="none" opacity={on ? 0.55 : 0.6}>
          <path d="M8 26h7l3 3h4M8 38h6l3-3h5M56 26h-7l-3 3h-4M56 38h-6l-3-3h-5" />
          <circle cx="22" cy="29" r="1" fill={on ? b : '#3E4146'} /><circle cx="42" cy="29" r="1" fill={on ? b : '#3E4146'} /><circle cx="22" cy="35" r="1" fill={on ? b : '#3E4146'} /><circle cx="42" cy="35" r="1" fill={on ? b : '#3E4146'} />
        </g>
        <g transform="translate(20 17) scale(1)">
          <path d={EMBLEM[group] || EMBLEM.explore} fill="none" stroke={on ? 'url(#r' + id + ')' : '#55585E'} strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" transform="scale(1)" />
        </g>
        {/* level: one, two or three chevrons */}
        <g fill="none" stroke={on ? 'url(#r' + id + ')' : '#4A4D52'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {Array.from({ length: n }).map((_, i) => <path key={i} d={'M26 ' + (46 + i * 3.4) + 'l6 3 6-3'} />)}
        </g>
        {on ? <g clipPath={'url(#c' + id + ')'}><rect className="md2-sheen" x="-40" y="-10" width="18" height="90" fill="rgba(255,255,255,.35)" transform="rotate(25)" /></g> : null}
      </svg>
    </span>
  );
}

/** a promotion rank: earned by finishing every medal of a track (or of every track) */
export function Rank({ on, size = 56 }: { on: boolean; size?: number }) {
  return <Medal tier="gold" on={on} size={size} group="rank" />;
}
