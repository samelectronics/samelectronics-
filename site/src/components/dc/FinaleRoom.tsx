'use client';
// R10 (owner, 3 Nov, round 2): only the dust lives here now; the room is the teardown's own studio recipe in CSS.
// Earlier note: the Finale's room, drawn like the teardown's stage instead of a CSS cone. A distant back wall that
// falls off into darkness, a soft beam of light from straight above the logo, a floor that runs across the whole width
// into the distance (light pool, the glow's reflection, darker towards the edges) and dust drifting through the beam.
// One canvas behind everything; it only animates while the section is on screen; reduced motion = one still frame.
import React, { useEffect, useRef } from 'react';

type Mote = { x: number; y: number; z: number; vx: number; vy: number; ph: number };

export default function FinaleRoom({ cx = 0.5, cy = 200, horizon = 360 }: { cx?: number; cy?: number; horizon?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const g = cv.getContext('2d'); if (!g) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, raf = 0, vis = false, motes: Mote[] = [];
    const size = () => {
      const b = cv.parentElement!.getBoundingClientRect(); dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(b.width)); H = Math.max(1, Math.round(b.height)); cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      const n = Math.round(Math.min(110, W / 13)); motes = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), vx: (Math.random() - 0.5) * 0.004, vy: -0.002 - Math.random() * 0.006, ph: Math.random() * 6.28 }));
    };
    const draw = (t: number) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H); const X = W * cx, hz = Math.min(H - 60, horizon), bw0 = W * 0.16, bw1 = W * 0.34;
      // dust: brighter inside the beam, a few out of focus
      for (const m of motes) {
        if (!still) { m.x += m.vx * 0.016; m.y += m.vy * 0.016; m.ph += 0.01; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } if (m.x < 0) m.x = 1; if (m.x > 1) m.x = 0; }
        const px = m.x * W + Math.sin(m.ph) * 6, py = m.y * hz, k = Math.abs(px - X) / (bw0 + (bw1 - bw0) * (py / hz) + 1);
        const inBeam = Math.exp(-k * k * 1.6), a = (0.03 + inBeam * 0.5) * (0.35 + m.z * 0.65), r = m.z > 0.86 ? 2.6 : 0.6 + m.z * 1.2;
        if (a < 0.03) continue; g.fillStyle = `rgba(255,238,200,${a.toFixed(3)})`; g.beginPath(); g.arc(px, py, r, 0, 6.283); g.fill();
      }
    };
    const loop = (t: number) => { draw(t); if (vis && !still) raf = requestAnimationFrame(loop); };
    size(); draw(0);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis && !still) raf = requestAnimationFrame(loop); });
    io.observe(cv); const ro = new ResizeObserver(() => { size(); draw(performance.now()); }); ro.observe(cv.parentElement!);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [cx, cy, horizon]);
  return <canvas ref={ref} className="fz-room" aria-hidden="true" />;
}
