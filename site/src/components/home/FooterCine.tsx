'use client';
// Owner (16 Nov): "I preferred the logo: introduce it like those crazy teardown videos, so cinematic, like a real
// cinema with the edges and the background". The footer opens with a short film: letterbox bars close in, a beam of
// light sweeps the dark stage, the ring draws itself around the logo, the logo lands with an anamorphic flare, the name
// resolves letter by letter from blur, and the three words type in. Plays when it comes into view (again each time it
// re-enters after leaving), then rests with a slow sheen. Reduced motion: the final frame.
import React, { useEffect, useRef, useState } from 'react';

const NAME = 'SAM ELECTRONICS';
export default function FooterCine() {
  const ref = useRef<HTMLDivElement>(null), [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { el.classList.add('done'); return; }
    let out = true;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && e.intersectionRatio > 0.45 && out) { out = false; setRun((r) => r + 1); } else if (!e.isIntersecting) out = true; }, { threshold: [0, 0.45, 0.7] });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={'fc' + (run ? ' play' : '')} key={run} aria-label="Sam Electronics" role="img">
      <span className="fc-bars" aria-hidden="true"><i /><i /></span>
      <span className="fc-dust" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ ['--k' as string]: i } as React.CSSProperties} />)}</span>
      <span className="fc-beam" aria-hidden="true" />
      <span className="fc-flare" aria-hidden="true" />
      <div className="fc-in" aria-hidden="true">
        <span className="fc-logo">
          <svg className="fc-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" pathLength="100" /></svg>
          <img src="/assets/se-logo-320.webp" alt="" loading="lazy" decoding="async" />
          <span className="fc-gl" />
        </span>
        <span className="fc-txt">
          <b className="fc-name">{NAME.split('').map((c, i) => <span key={i} style={{ ['--i' as string]: i } as React.CSSProperties}>{c === ' ' ? ' ' : c}</span>)}</b>
          <small className="fc-tag"><span>QUALITY · WARRANTY · PRICE</span></small>
          <em className="fc-since">AL MURAR · DEIRA · SINCE 2003</em>
        </span>
      </div>
      <span className="fc-hud" aria-hidden="true"><i />SE · FINAL REEL</span>
    </div>
  );
}
