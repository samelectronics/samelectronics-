'use client';
// Owner (16 Nov): "love the energy of the teardown video, I want it in the shop". The same film engine as the final
// call (public/se-td-ad.js), playing on a phone screen inside the shop's main banner. It only draws while visible.
import React, { useEffect, useRef } from 'react';

type Ad = { draw: (t: number) => void; dur: number };
export default function ShopFilm() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current; if (!c) return; let ad: Ad | null = null, raf = 0, vis = false, t0 = 0, iv = 0;
    const W = window as unknown as { SETdAd?: { create: (cv: HTMLCanvasElement, o: object) => Ad }; SE_SHOTS?: unknown };
    const start = () => { if (ad || !W.SETdAd || !W.SE_SHOTS) return false; ad = W.SETdAd.create(c, {}); return true; };
    if (!start()) iv = window.setInterval(() => { if (start()) window.clearInterval(iv); }, 300);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) t0 = 0; }); io.observe(c);
    const loop = (n: number) => { raf = requestAnimationFrame(loop); if (!vis || !ad || document.hidden) return; if (!t0) t0 = n; ad.draw((n - t0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.clearInterval(iv); };
  }, []);
  return (
    <span className="sf-phone" aria-hidden="true">
      <canvas ref={cv} width={540} height={1110} />
      <i className="sf-island" />
      <i className="sf-glass" />
    </span>
  );
}
