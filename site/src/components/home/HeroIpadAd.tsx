'use client';
// Owner (R11, after two tries): "still cheap: the text, the background, the boxes; slow, not fun; I want the boom-pam of
// the teardown ad, brand level". So the iPad now plays the SAME film engine as the teardown commercial (public/se-td-ad.js,
// the one the owner holds up as the example), with its own script written for the hero: SAM / ELECTRONICS / EVERY / PART.
// slams, three parts crashing in with their stock, a 3D carousel of brand plates that slows and picks one, the wall of all
// brands, the parts strobe, the grades flashing, IN STOCK IN DEIRA and the close on the logo. It fills the screen edge to
// edge (no status bar), draws at the screen's real pixel size, and only runs while the hero is on screen.
import React, { useEffect, useRef } from 'react';

type Ad = { draw: (t: number) => void; dur: number };
export default function HeroIpadAd() {
  const root = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), vd = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = root.current, c = cv.current; if (!el || !c) return;
    let ad: Ad | null = null, raf = 0, vis = false, t0 = 0, iv = 0, W = 0, H = 0, tt = 0;
    const G = window as unknown as { SETdAd?: { create: (cv: HTMLCanvasElement, o: object) => Ad }; SE_SHOTS?: unknown };
    const size = () => { const d = Math.min(2, window.devicePixelRatio || 1), w = Math.round(el.offsetWidth * d), h = Math.round(el.offsetHeight * d); if (w && h && (w !== W || h !== H)) { W = w; H = h; c.width = w; c.height = h; ad = null; } };
    const start = () => { size(); if (ad) return true; if (!W || !G.SETdAd || !G.SE_SHOTS) return false; ad = G.SETdAd.create(c, { reel: 'ipad', video: vd.current }); return true; };
    if (!start()) iv = window.setInterval(() => { if (start()) window.clearInterval(iv); }, 300);
    const ro = new ResizeObserver(() => { size(); start(); }); ro.observe(el);
    // owner (R12b): "it must always start with the same SAM ELECTRONICS entrance": every time the iPad comes back into view
    // (and on first load) the film starts from 0
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !vis) { tt = 0; t0 = 0; } vis = e.isIntersecting; if (!vis) vd.current?.pause(); }, { threshold: 0.05 }); io.observe(el);
    const loop = (n: number) => { raf = requestAnimationFrame(loop); if (!vis || document.hidden) { t0 = 0; return; } if (!ad) return; if (!t0) t0 = n - tt * 1000; tt = (n - t0) / 1000; ad.draw(tt); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.clearInterval(iv); };
  }, []);
  return (
    <div className="hia3 hia5" ref={root} aria-hidden="true">
      <canvas ref={cv} />
      <video ref={vd} className="h5-vid" src="/assets/ad/shop-film.mp4" muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
      <span className="h3-cam" />
      <span className="h3-home" />
    </div>
  );
}
