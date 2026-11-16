'use client';
// A real medal, not a sticker: a struck metal disc (bronze, silver or gold) with a milled rim, a raised inner field and
// our mark engraved in the middle, hanging from a woven graphite-and-yellow ribbon. Locked medals are an unstruck dark
// blank with the outline only. Styles: .md-* in src/styles/medals.css.
import React from 'react';
import type { Tier } from '@/lib/achievements';

export default function Medal({ tier, on = true, size = 72, glyph }: { tier: Tier; on?: boolean; size?: number; glyph?: string }) {
  return (
    <span className={'md md-' + tier + (on ? ' on' : ' off')} style={{ ['--s' as string]: size + 'px' } as React.CSSProperties} aria-hidden="true">
      <span className="md-rib"><i /><i /></span>
      <span className="md-disc">
        <span className="md-mill" />
        <span className="md-field">
          {glyph ? <b className="md-gl">{glyph}</b> : <svg viewBox="0 0 40 40" className="md-mark"><path d="M20 5l4.2 9.2 10 1.1-7.5 6.8 2.1 9.9L20 27l-8.8 5 2.1-9.9-7.5-6.8 10-1.1z" /></svg>}
        </span>
        <span className="md-shine" />
      </span>
    </span>
  );
}
