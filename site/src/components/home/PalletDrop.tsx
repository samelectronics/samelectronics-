// Owner (27 Oct): the wholesale ad shows the REAL pallet (the same isometric renders as the Wholesale section and the
// poster), and its cartons drop onto it from above one by one, layer by layer, then the stack clears and it repeats.
// The loop runs on its own clock, so it keeps playing while the phone is hovered (only the feed holds).
import React from 'react';
import { PALLET_CELLS, PALLET_FRAME } from '@/content/palletCells';

const PL = (l: string, w = 600) => `/assets/pallet/${l}-${w}.webp`;

export default function PalletDrop({ n = 18, period = 3.6, step = 0.09, className, style }: { n?: number; period?: number; step?: number; className?: string; style?: React.CSSProperties }) {
  const cells = PALLET_CELLS.slice(0, n);
  return (
    <div className={'se-pd' + (className ? ' ' + className : '')} style={{ ['--pd' as string]: period + 's', ...style } as React.CSSProperties} aria-hidden="true">
      <img src={PL('pallet')} srcSet={PL('pallet') + ' 1x, ' + PL('pallet', 1200) + ' 2x'} alt="" draggable={false} />
      {cells.map((c, i) => (
        <img
          key={i}
          className="se-pd-c"
          src={PL('carton')}
          srcSet={PL('carton') + ' 1x, ' + PL('carton', 1200) + ' 2x'}
          alt=""
          draggable={false}
          style={{ ['--x' as string]: ((c.dx / PALLET_FRAME.w) * 100).toFixed(3) + '%', ['--y' as string]: ((c.dy / PALLET_FRAME.h) * 100).toFixed(3) + '%', zIndex: 10 + c.z, animationDelay: (i * step).toFixed(2) + 's' } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
