'use client';
// Owner (R11): "the time left on every message must run along the shape (it's a soft rounded shape, not a square); maybe an
// LED light filling". One timer for every pop-up, toast and notice: a glowing yellow LED line that traces the card's own
// rounded edge and drains around it. It pauses while the pointer is over the card or a finger holds it (the card adds
// the class `hold`), and calls onEnd when it runs out. `r` is the card's corner radius (999 = a pill). The shape is
// measured, so a pill gets true half-circle ends (never an ellipse) at any size.
import React, { useEffect, useRef, useState } from 'react';

export default function EdgeTimer({ ms, onEnd, r = 20, tone }: { ms: number; onEnd?: () => void; r?: number; tone?: 'y' | 'r' | 'g' }) {
  const ref = useRef<SVGSVGElement>(null), [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current?.parentElement; if (!el) return;
    const f = () => setBox({ w: el.offsetWidth, h: el.offsetHeight }); f();
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  const w = box ? Math.max(0, box.w - 2) : 0, h = box ? Math.max(0, box.h - 2) : 0, rr = Math.min(r, h / 2, w / 2);
  return (
    <svg ref={ref} className={'se-et' + (tone ? ' ' + tone : '')} aria-hidden="true" width={box ? box.w : 0} height={box ? box.h : 0} style={{ ['--et-ms' as string]: ms + 'ms' }} onAnimationEnd={(e) => { if ((e.target as Element).classList.contains('run')) onEnd?.(); }}>
      {box ? (
        <>
          <rect className="trk" x={1} y={1} width={w} height={h} rx={rr} ry={rr} pathLength={100} />
          <rect className="run" x={1} y={1} width={w} height={h} rx={rr} ry={rr} pathLength={100} />
        </>
      ) : null}
    </svg>
  );
}
