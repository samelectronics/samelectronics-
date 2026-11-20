'use client';
// Owner (R12): "a LED light on the bottom edge of the pop-up, a flat horizontal line, that softly gets sucked in and
// hidden into the pop-up when it reaches the sides, not cut off like a square, and NOT going around the whole thing".
// So: one straight glowing line along the bottom edge, inset from the rounded corners, whose two ends fade into the card
// (a soft mask), draining from one side to the other (mirrored in RTL). It pauses while the pointer or a finger is on the
// card and calls onEnd when it runs out. `r` is the card's corner radius, used only for the inset.
import React from 'react';

export default function EdgeTimer({ ms, onEnd, r = 20 }: { ms: number; onEnd?: () => void; r?: number; tone?: 'y' | 'r' | 'g' }) {
  const inset = Math.min(Math.max(r * 0.55, 10), 28);
  return (
    <span className="se-et2" aria-hidden="true" style={{ ['--et-ms' as string]: ms + 'ms', ['--et-in' as string]: inset + 'px' }}>
      <i onAnimationEnd={() => onEnd?.()} />
    </span>
  );
}
