'use client';
// Owner (16 Nov): medals must look like the site's real components, not cartoons. Each one is a rendered struck coin
// (three.js studio render, baked to images in public/assets/medals): gold, silver and bronze with a brushed face, a
// milled edge and our two-phones mark stamped in relief; a locked one is an unstruck graphite blank. A light sheen
// passes over it when earned (masked to the coin's own shape).
import React from 'react';
import type { Tier } from '@/lib/achievements';

export default function Medal({ tier, on = true, size = 72 }: { tier: Tier; on?: boolean; size?: number; glyph?: string }) {
  const k = on ? tier : 'off', src = '/assets/medals/' + k + '-' + (size > 56 ? 256 : 128) + '.webp';
  return (
    <span className={'md md-' + k + (on ? ' on' : ' off')} style={{ ['--s' as string]: size + 'px', ['--src' as string]: 'url(' + src + ')' } as React.CSSProperties} aria-hidden="true">
      <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" draggable={false} />
    </span>
  );
}
