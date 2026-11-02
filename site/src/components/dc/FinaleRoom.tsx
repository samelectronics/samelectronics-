'use client';
// R10 (owner, 3 Nov): the Finale's room, drawn like the teardown's stage instead of a CSS cone. A distant back wall that
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
      const X = W * cx, hz = Math.min(H - 60, horizon);
      // back wall: lit in the middle, falling off into darkness (distance)
      let gr = g.createRadialGradient(X, cy, 10, X, cy, Math.max(W, H) * 0.75);
      gr.addColorStop(0, '#3B3D42'); gr.addColorStop(0.35, '#2A2C30'); gr.addColorStop(0.75, '#1A1B1E'); gr.addColorStop(1, '#131416');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // haze band at the horizon: the far end of the room
      gr = g.createLinearGradient(0, hz - 90, 0, hz + 10); gr.addColorStop(0, 'rgba(255,240,210,0)'); gr.addColorStop(1, 'rgba(255,240,210,.035)'); g.fillStyle = gr; g.fillRect(0, hz - 90, W, 100);
      // floor: the whole width, darker as it comes towards us, with a wide soft pool of light under the logo
      gr = g.createLinearGradient(0, hz - 30, 0, H); gr.addColorStop(0, 'rgba(18,19,21,0)'); gr.addColorStop(0.3, 'rgba(18,19,21,.35)'); gr.addColorStop(1, 'rgba(14,15,17,.9)');
      g.fillStyle = gr; g.fillRect(0, hz - 30, W, H - hz + 30);
      g.save(); g.translate(X, hz + 10); g.scale(1, 0.16);
      gr = g.createRadialGradient(0, 0, 0, 0, 0, Math.min(W * 0.55, 760)); gr.addColorStop(0, 'rgba(255,226,150,.42)'); gr.addColorStop(0.35, 'rgba(247,192,50,.14)'); gr.addColorStop(1, 'rgba(247,192,50,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, Math.min(W * 0.55, 760), 0, 6.283); g.fill(); g.restore();
      // the logo glow mirrored on the polished floor
      g.save(); g.translate(X, hz + 70); g.scale(1, 0.45);
      gr = g.createRadialGradient(0, 0, 0, 0, 0, 170); gr.addColorStop(0, 'rgba(247,192,50,.16)'); gr.addColorStop(1, 'rgba(247,192,50,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 170, 0, 6.283); g.fill(); g.restore();
      // the horizon line: a faint lit edge where floor meets wall, fading out to the sides
      gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(255,236,190,0)'); gr.addColorStop(0.5, 'rgba(255,236,190,.05)'); gr.addColorStop(1, 'rgba(255,236,190,0)');
      g.fillStyle = gr; g.fillRect(0, hz, W, 1);
      // the beam: straight down onto the logo, soft-edged, breathing slightly
      const br = 1 + Math.sin(t * 0.0004) * 0.04, top = -40, bw0 = 70 * br, bw1 = 300 * br;
      gr = g.createLinearGradient(0, top, 0, hz + 40); gr.addColorStop(0, 'rgba(255,240,205,.20)'); gr.addColorStop(0.55, 'rgba(255,236,190,.08)'); gr.addColorStop(1, 'rgba(255,236,190,0)');
      g.save(); g.filter = 'blur(18px)'; g.fillStyle = gr; g.beginPath(); g.moveTo(X - bw0, top); g.lineTo(X + bw0, top); g.lineTo(X + bw1, hz + 40); g.lineTo(X - bw1, hz + 40); g.closePath(); g.fill(); g.restore();
      // dust: brighter inside the beam, a few out of focus
      for (const m of motes) {
        if (!still) { m.x += m.vx * 0.016; m.y += m.vy * 0.016; m.ph += 0.01; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } if (m.x < 0) m.x = 1; if (m.x > 1) m.x = 0; }
        const px = m.x * W + Math.sin(m.ph) * 6, py = m.y * hz, k = Math.abs(px - X) / (bw0 + (bw1 - bw0) * (py / hz) + 1);
        const inBeam = Math.max(0, 1 - k), a = (0.06 + inBeam * 0.55) * (0.4 + m.z * 0.6), r = m.z > 0.86 ? 2.6 : 0.6 + m.z * 1.2;
        if (a < 0.03) continue; g.fillStyle = `rgba(255,238,200,${a.toFixed(3)})`; g.beginPath(); g.arc(px, py, r, 0, 6.283); g.fill();
      }
      // vignette: the room's corners go dark
      gr = g.createRadialGradient(X, H * 0.45, Math.min(W, H) * 0.35, X, H * 0.45, Math.max(W, H) * 0.8); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    };
    const loop = (t: number) => { draw(t); if (vis && !still) raf = requestAnimationFrame(loop); };
    size(); draw(0);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis && !still) raf = requestAnimationFrame(loop); });
    io.observe(cv); const ro = new ResizeObserver(() => { size(); draw(performance.now()); }); ro.observe(cv.parentElement!);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [cx, cy, horizon]);
  return <canvas ref={ref} className="fz-room" aria-hidden="true" />;
}
