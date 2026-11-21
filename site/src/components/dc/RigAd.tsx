'use client';
// R12 (owner: "the phone on the rig ends with a weird pattern; bring it to life with an ad like the teardown, dedicated
// to the qualities and brands"): the rig's phone plays the ad engine (public/se-td-reel.js, reel 'rig') under the test effects.
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
    // owner (R12b): "after the test the phone turns on like a real phone (loading screen, then it starts); the opposite:
    // it glitches, then goes off". The test is done when the warranty sticker is on the phone.
    const logo = new Image(); logo.src = '/assets/se-logo-metal-128.webp';
    let mode: 'off' | 'boot' | 'on' | 'glitch' = 'off', mt = 0;
    const x = c.getContext('2d')!;
    const done = () => { const st = el.closest('.bt-phone')?.parentElement?.querySelector('.bt-sticker') as HTMLElement | null; return !!st && parseFloat(getComputedStyle(st).opacity) > 0.5; };
    const loop = (n: number) => {
      raf = requestAnimationFrame(loop); if (!vis || document.hidden || !W) return;
      const want = done(), now = n / 1000;
      if (want && (mode === 'off' || mode === 'glitch')) { mode = 'boot'; mt = now; }
      if (!want && (mode === 'on' || mode === 'boot')) { mode = 'glitch'; mt = now; }
      const k = now - mt; x.setTransform(1, 0, 0, 1, 0, 0);
      if (mode === 'off') { x.clearRect(0, 0, W, H); return; }
      if (mode === 'boot') {
        x.fillStyle = '#0B0C0E'; x.fillRect(0, 0, W, H);
        const a = Math.min(1, k / 0.5), sz = W * 0.34; x.globalAlpha = a; if (logo.complete) x.drawImage(logo, W / 2 - sz / 2, H * 0.42 - sz / 2, sz, sz); x.globalAlpha = 1;
        const bw = W * 0.36, pr = Math.min(1, Math.max(0, (k - 0.4) / 1.1)); x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(W / 2 - bw / 2, H * 0.62, bw, 3); x.fillStyle = '#F7C032'; x.fillRect(W / 2 - bw / 2, H * 0.62, bw * pr, 3);
        if (k > 1.6) { mode = 'on'; mt = now; t0 = 0; tt = 0; } return;
      }
      if (!ad) return;
      if (mode === 'on') { if (!t0) t0 = n - tt * 1000; tt = (n - t0) / 1000; ad.draw(tt); if (k < 0.25) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1 - k / 0.25; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } return; }
      // glitch off: tearing bands and flicker (0–0.45 s), then the picture collapses to a bright line and goes dark
      ad.draw(tt); x.setTransform(1, 0, 0, 1, 0, 0);
      if (k < 0.45) { for (let i = 0; i < 7; i++) { const y = Math.random() * H, h = 4 + Math.random() * H * 0.06, dx = (Math.random() - 0.5) * W * 0.18; x.drawImage(c, 0, y, W, h, dx, y, W, h); } if (Math.random() < 0.35) { x.fillStyle = 'rgba(11,12,14,.7)'; x.fillRect(0, 0, W, H); } return; }
      const q = Math.min(1, (k - 0.45) / 0.25); x.fillStyle = '#0B0C0E'; x.fillRect(0, 0, W, H); const lh = Math.max(2, H * (1 - q) * 0.08); x.fillStyle = 'rgba(255,255,255,' + (1 - q * 0.6) + ')'; x.fillRect(W * q * 0.4, H / 2 - lh / 2, W * (1 - q * 0.8), lh);
      if (k > 0.8) { mode = 'off'; x.clearRect(0, 0, W, H); }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.clearInterval(iv); };
  }, []);
  return (
    <div className="rig-ad" ref={root} aria-hidden="true">
      <canvas ref={cv} />
      
      
    </div>
  );
}
