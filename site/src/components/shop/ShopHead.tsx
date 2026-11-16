'use client';
// Owner (16 Nov): the shop's header is a header, not a second advert: the title ENTERS cinematically and something real
// complements it. Here: the kicker types in; each word of the title rises out of a mask with a blur-to-sharp and a light
// sweep across it; the counts run up; and on the right four real part renders fly in from off screen (each with its own
// path and spin) and settle into a floating fan on a lit floor, with a soft glow that breathes. Calm after it lands.
import React, { useEffect, useRef, useState } from 'react';
import { T } from '@/components/site/ui';

// owner (16 Nov): parts never float on their own; they stand in a lit display cabinet, each on its shelf with a label
const PARTS = [
  { src: '/assets/pose/samsung-sp-960.webp', k: 'SCREENS', n: 91 },
  { src: '/assets/pose/part-bat-960.webp', k: 'BATTERIES', n: 74 },
  { src: '/assets/pose/part-cam-960.webp', k: 'CAMERAS', n: 23 },
  { src: '/assets/pose/part-bcv-960.webp', k: 'BACK COVERS', n: 74 },
];

function Count({ to, on }: { to: number; on: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => { if (!on) return; let raf = 0; const t0 = performance.now(); const f = (t: number) => { const k = Math.min(1, (t - t0) / 1300); setN(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [to, on]);
  return <>{n.toLocaleString('en-US')}</>;
}

export default function ShopHead({ eb, a, b, crumb, stats }: { eb: string; a: string; b: string; crumb: React.ReactNode; stats: [number, string][] }) {
  const ref = useRef<HTMLDivElement>(null), [on, setOn] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setOn(true), 120); return () => window.clearTimeout(t); }, []);
  const words = (s: string, base: number) => s.split(' ').map((w, i) => <span key={i} className="shh-w" style={{ ['--d' as string]: base + i * 0.09 + 's' } as React.CSSProperties}><span>{w}</span></span>);
  return (
    <div ref={ref} className={'shh' + (on ? ' on' : '')}>
      <div className="shh-l">
        {crumb}
        <span className="shh-eb"><span>{eb}</span></span>
        <h1 className="shh-h"><span className="a">{words(a, 0.25)}</span><span className="b">{words(b, 0.55)}</span><i className="shh-sweep" aria-hidden="true" /></h1>
        <div className="shh-stats">{stats.map(([n, l], i) => <span key={l} style={{ ['--d' as string]: 0.9 + i * 0.1 + 's' } as React.CSSProperties}><b><Count to={n} on={on} /></b><small>{T(l)}</small></span>)}</div>
      </div>
      <div className="shh-r" aria-hidden="true">
        <div className="cab">
          <span className="cab-plate"><img src="/assets/se-logo-128.webp" alt="" /><b>SAM ELECTRONICS</b><small>DEIRA · IN STOCK</small></span>
          {[0, 1].map((row) => (
            <div key={row} className={'cab-row r' + row}>
              <i className="cab-led" />
              {PARTS.slice(row * 2, row * 2 + 2).map((p, i) => (
                <span key={p.k} className="cab-slot" style={{ ['--d' as string]: 0.9 + row * 0.35 + i * 0.18 + 's' } as React.CSSProperties}>
                  <img src={p.src} alt="" decoding="async" />
                  <span className="cab-tag"><b>{T(p.k)}</b><small>{p.n} {T('in stock')}</small></span>
                </span>
              ))}
              <i className="cab-glass" />
            </div>
          ))}
          <i className="cab-front" />
        </div>
        <span className="cab-floor" />
      </div>
    </div>
  );
}
