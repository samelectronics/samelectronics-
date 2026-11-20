'use client';
// R12 (owner: "the phone on the rig ends with a weird pattern; bring it to life with an ad like the teardown, dedicated
// to the qualities and brands"): the rig's phone plays the ad engine (public/se-td-ad.js, reel 'rig') under the test effects.
import React, { useEffect, useRef } from 'react';

type Ad = { draw: (t: number) => void; dur: number };
export default function RigAd() {
  const root = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = root.current, c = cv.current; if (!el || !c) return;
    let ad: Ad | null = null, raf = 0, vis = true, t0 = 0, iv = 0, W = 0, H = 0, tt = 0;
    const G = window as unknown as { SETdAd?: { create: (cv: HTMLCanvasElement, o: object) => Ad }; SE_SHOTS?: unknown };
    const size = () => { const d = Math.min(2, window.devicePixelRatio || 1), w = Math.round(el.offsetWidth * d), h = Math.round(el.offsetHeight * d); if (w && h && (w !== W || h !== H)) { W = w; H = h; c.width = w; c.height = h; ad = null; } };
    const start = () => { size(); if (ad) return true; if (!W || !G.SETdAd || !G.SE_SHOTS) return false; ad = G.SETdAd.create(c, { reel: 'rig' }); return true; };
    if (!start()) iv = window.setInterval(() => { if (start()) window.clearInterval(iv); }, 300);
    const ro = new ResizeObserver(() => { size(); start(); }); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.05 }); io.observe(el);
    const loop = (n: number) => { raf = requestAnimationFrame(loop); if (!vis || document.hidden) { t0 = 0; return; } if (!ad) return; if (!t0) t0 = n - tt * 1000; tt = (n - t0) / 1000; ad.draw(tt); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.clearInterval(iv); };
  }, []);
  return (
    <div className="rig-ad" ref={root} aria-hidden="true">
      <canvas ref={cv} />
      
      
    </div>
  );
}
