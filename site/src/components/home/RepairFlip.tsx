'use client';
// Owner (28 Oct): the repair, played as a real 3D film everywhere a repair is shown (Repair Lab, What we offer, Who are
// you, Wholesale). 48 frames rendered by scripts/productshot (item=film): the cracked phone turns on the bench, opens like
// a book, the cracked screen slides out, the new one slides in, it closes and boots with the logo. Frames load only
// when the film comes near the screen, it plays only while visible, and loops with a short hold on the repaired phone.
import React, { useEffect, useRef } from 'react';

const N = 48, PLAY = 4.6, HOLD0 = 0.5, HOLD1 = 1.3, LOOP = HOLD0 + PLAY + HOLD1;
const src = (i: number, w: number) => `/assets/pose/film-${String(i).padStart(2, '0')}-${w}.webp`;
// phase of the repair at film position f (0..1): 0 cracked · 1 opening · 2 new screen · 3 tested
export const phaseAt = (f: number) => (f < 0.12 ? 0 : f < 0.45 ? 1 : f < 0.8 ? 2 : 3);

export default function RepairFlip({ w = 480, zoom = 1.45, className, style, onPhase }: { w?: 480 | 960; zoom?: number; className?: string; style?: React.CSSProperties; onPhase?: (p: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null), cb = useRef(onPhase);
  cb.current = onPhase;
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const x = cv.getContext('2d'); if (!x) return;
    const imgs: HTMLImageElement[] = []; let loaded = false, vis = false, raf = 0, t0 = 0, lastI = -1, lastP = -1;
    const load = () => { if (loaded) return; loaded = true; for (let i = 0; i < N; i++) { const im = new Image(); im.decoding = 'async'; im.src = src(i, w); imgs.push(im); } };
    const draw = (i: number) => { const im = imgs[i]; if (!im || !im.complete || !im.naturalWidth) return false; const W = cv.width, H = cv.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight) * zoom, dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      x.clearRect(0, 0, W, H); x.drawImage(im, (W - dw) / 2, (H - dh) / 2 + H * 0.04, dw, dh); return true; };
    const loop = (n: number) => { raf = requestAnimationFrame(loop); if (!vis) return; if (!t0) t0 = n;
      const t = ((n - t0) / 1000) % LOOP, f = t < HOLD0 ? 0 : t > HOLD0 + PLAY ? 1 : (t - HOLD0) / PLAY, i = Math.round(f * (N - 1));
      if (i !== lastI && draw(i)) lastI = i;
      const ph = phaseAt(f); if (ph !== lastP) { lastP = ph; cb.current && cb.current(ph); } };
    const size = () => { const b = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.max(1, Math.round(b.width * d)); cv.height = Math.max(1, Math.round(b.height * d)); lastI = -1; };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) load(); vis = e.isIntersecting && e.intersectionRatio > 0; if (vis) t0 = 0; }, { rootMargin: '600px 0px 600px 0px', threshold: [0, 0.01] });
    const ioV = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) { t0 = 0; lastI = -1; } });
    io.observe(cv); ioV.observe(cv); const ro = new ResizeObserver(size); ro.observe(cv); size();
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ioV.disconnect(); ro.disconnect(); };
  }, [w, zoom]);
  return <canvas ref={ref} className={'se-rflip' + (className ? ' ' + className : '')} style={{ display: 'block', width: '100%', height: '100%', ...style }} aria-label="A cracked phone being repaired on our bench" role="img" />;
}
