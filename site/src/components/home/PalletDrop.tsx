// Owner (27 Oct): the wholesale ad shows the REAL pallet (the same isometric renders as the Wholesale section and the
// poster). Its cartons drop onto it from above one by one, bottom layer first; then the stack clears TOP FIRST until the
// pallet is empty, and only then do they drop again. The loop runs on its own clock, so it keeps playing while the phone
// is hovered (only the feed holds).
import React from 'react';
import { PALLET_CELLS, PALLET_FRAME } from '@/content/palletCells';

const PL = (l: string, w = 600) => `/assets/pallet/${l}-${w}.webp`;
const P = 4.2; // seconds per loop
const pc = (t: number) => ((t / P) * 100).toFixed(2) + '%';

/** one keyframe set per carton: hidden above → drops (with a small settle) → holds → lifts and fades, top carton first */
function frames(n: number) {
  let css = '';
  for (let i = 0; i < n; i++) {
    const d0 = 0.15 + i * 0.09, d1 = d0 + 0.42, c0 = 2.75 + (n - 1 - i) * 0.045, c1 = c0 + 0.24;
    const up = 'translate(var(--x), calc(var(--y) - 30%))', at = 'translate(var(--x), var(--y))', lift = 'translate(var(--x), calc(var(--y) - 4%))';
    css += `@keyframes sePd${i}{0%,${pc(d0)}{transform:${up};opacity:0;animation-timing-function:cubic-bezier(.55,0,.85,.4)}${pc(d0 + 0.05)}{opacity:1}${pc(d1)}{transform:translate(var(--x), calc(var(--y) + .7%));animation-timing-function:ease-out}${pc(d1 + 0.1)},${pc(c0)}{transform:${at};opacity:1;animation-timing-function:ease-in}${pc(c1)},100%{transform:${lift};opacity:0}}`;
    css += `.se-pd>.se-pd-c:nth-of-type(${i + 2}){animation-name:sePd${i}}`;
  }
  return css;
}

export default function PalletDrop({ n = 18, className, style }: { n?: number; className?: string; style?: React.CSSProperties }) {
  const cells = PALLET_CELLS.slice(0, n);
  return (
    <div className={'se-pd' + (className ? ' ' + className : '')} style={style} aria-hidden="true">
      <style>{frames(cells.length)}</style>
      <img src={PL('pallet')} srcSet={PL('pallet') + ' 1x, ' + PL('pallet', 1200) + ' 2x'} alt="" draggable={false} />
      {cells.map((c, i) => (
        <img
          key={i}
          className="se-pd-c"
          src={PL('carton')}
          srcSet={PL('carton') + ' 1x, ' + PL('carton', 1200) + ' 2x'}
          alt=""
          draggable={false}
          style={{ ['--x' as string]: ((c.dx / PALLET_FRAME.w) * 100).toFixed(3) + '%', ['--y' as string]: ((c.dy / PALLET_FRAME.h) * 100).toFixed(3) + '%', zIndex: 10 + c.z } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
