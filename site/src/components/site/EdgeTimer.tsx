'use client';
// Owner (R11): "the time left on every message must run along the shape (it's a soft rounded shape, not a square); maybe an
// LED light filling". One timer for every pop-up, toast and notice: a glowing yellow LED line that traces the card's own
// rounded edge and drains around it. It pauses while the pointer is over the card or a finger holds it (the card adds
// the class `hold`), and calls onEnd when it runs out. `r` is the card's corner radius (999 = a pill). The shape is
// measured, so a pill gets true half-circle ends (never an ellipse) at any size.
import React, { useEffect, useRef, useState } from 'react';

export default function EdgeTimer({ ms, onEnd, r = 20 }: { ms: number; onEnd?: () => void; r?: number; tone?: 'y' | 'r' | 'g' }) {
  const ref = useRef<SVGSVGElement>(null), [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current?.parentElement; if (!el) return;
    const f = () => setBox({ w: el.offsetWidth, h: el.offsetHeight }); f();
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  // owner (R11, 2nd look): "not red, not around the whole card": one yellow LED line along the bottom edge that curves up
  // into the rounded corners, exactly on the card's shape, draining from left to right (right to left in RTL languages)
  const w = box ? box.w : 0, h = box ? box.h : 0, rr = Math.max(2, Math.min(r, h / 2, w / 2)), y = h - 1.25, up = Math.min(rr, h / 2);
  const d = box ? `M 1.25 ${(h - up).toFixed(1)} A ${rr} ${rr} 0 0 0 ${(rr).toFixed(1)} ${y.toFixed(1)} L ${(w - rr).toFixed(1)} ${y.toFixed(1)} A ${rr} ${rr} 0 0 0 ${(w - 1.25).toFixed(1)} ${(h - up).toFixed(1)}` : '';
  return (
    <svg ref={ref} className="se-et" aria-hidden="true" width={w} height={h} style={{ ['--et-ms' as string]: ms + 'ms' }} onAnimationEnd={(e) => { if ((e.target as Element).classList.contains('run')) onEnd?.(); }}>
      {box ? (
        <>
          <path className="trk" d={d} pathLength={100} />
          <path className="run" d={d} pathLength={100} />
        </>
      ) : null}
    </svg>
  );
}
