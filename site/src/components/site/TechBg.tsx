'use client';
// Owner (16 Nov): "make it more techy". One shared live background for the shop's side ads, the ads between products
// and every page header: a faint drifting grid, glowing light streaks (soft glow + thin tapered core + a flare running
// along), a slow scan line, corner brackets and a small HUD read-out. Same family as the shop reel and the teardown ad.
// Draws only while on screen, at ~30 fps, and stays still with reduced motion.
import React, { useEffect, useRef } from 'react';

type Tone = 'dark' | 'yellow' | 'light';
export default function TechBg({ tone = 'dark', hud, streaks = 2, className }: { tone?: Tone; hud?: string; streaks?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current, host = c?.parentElement; if (!c || !host) return;
    const x = c.getContext('2d')!; let W = 0, H = 0, dpr = 1, raf = 0, vis = false, lastT = 0; const t0 = performance.now() - Math.random() * 8000;
    const ink = tone === 'dark' ? '255,255,255' : '38,40,43', glow = tone === 'yellow' ? '255,250,232' : '255,214,120';
    const size = () => { const r = host.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; c.width = Math.max(1, Math.round(W * dpr)); c.height = Math.max(1, Math.round(H * dpr)); };
    size(); const ro = new ResizeObserver(size); ro.observe(host);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: [0, 0.05] }); io.observe(host);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const draw = (s: number) => {
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      // grid
      const gs = Math.max(26, Math.min(44, W / 18)); x.strokeStyle = 'rgba(' + ink + ',' + (tone === 'dark' ? 0.05 : tone === 'yellow' ? 0.06 : 0.035) + ')'; x.lineWidth = 1; x.beginPath();
      for (let gx = (s * 6) % gs; gx < W; gx += gs) { x.moveTo(gx + 0.5, 0); x.lineTo(gx + 0.5, H); } for (let gy = 0.5; gy < H; gy += gs) { x.moveTo(0, gy); x.lineTo(W, gy); } x.stroke();
      // glowing streaks
      x.save(); x.translate(W / 2, H / 2); x.rotate(-0.36); x.globalCompositeOperation = tone === 'light' ? 'source-over' : 'lighter';
      const a = tone === 'light' ? 0.35 : tone === 'yellow' ? 0.55 : 0.5, col = tone === 'light' ? '247,192,50' : glow;
      for (let k = 0; k < streaks; k++) {
        const ph = ((s * (0.05 + k * 0.012) + k * 0.43) % 1), off = (ph - 0.5) * (H + W * 0.4) * 1.6, len = W * 1.3, x0 = -len / 2, bend = H * 0.08 * (k % 2 ? 1 : -1);
        const path = () => { x.beginPath(); x.moveTo(x0, off); x.quadraticCurveTo(0, off + bend, x0 + len, off); };
        const grad = (al: number) => { const g = x.createLinearGradient(x0, 0, x0 + len, 0); g.addColorStop(0, 'rgba(' + col + ',0)'); g.addColorStop(0.4, 'rgba(' + col + ',' + al * 0.45 + ')'); g.addColorStop(0.6, 'rgba(' + col + ',' + al + ')'); g.addColorStop(1, 'rgba(' + col + ',0)'); return g; };
        x.lineCap = 'round'; x.shadowColor = 'rgba(' + col + ',.6)';
        x.strokeStyle = grad(a * 0.12); x.lineWidth = 16; x.shadowBlur = 30; path(); x.stroke();
        x.strokeStyle = grad(a * 0.35); x.lineWidth = 4; x.shadowBlur = 14; path(); x.stroke();
        x.strokeStyle = grad(a); x.lineWidth = 1.2; x.shadowBlur = 6; path(); x.stroke();
        const hp = (s * 0.18 + k * 0.37) % 1, hx = x0 + len * hp, hy = off + bend * 4 * hp * (1 - hp); x.shadowBlur = 0; x.save(); x.translate(hx, hy); x.scale(5, 1);
        const hg = x.createRadialGradient(0, 0, 0, 0, 0, 10); hg.addColorStop(0, 'rgba(255,255,255,' + a * 0.8 + ')'); hg.addColorStop(0.35, 'rgba(' + col + ',' + a * 0.4 + ')'); hg.addColorStop(1, 'rgba(' + col + ',0)'); x.fillStyle = hg; x.fillRect(-10, -10, 20, 20); x.restore();
      }
      x.restore(); x.shadowBlur = 0;
      // scan line
      const sy = ((s * 0.09) % 1) * (H + 60) - 30; const sg = x.createLinearGradient(0, sy - 50, 0, sy); sg.addColorStop(0, 'rgba(247,192,50,0)'); sg.addColorStop(1, 'rgba(247,192,50,' + (tone === 'dark' ? 0.04 : tone === 'yellow' ? 0.05 : 0.025) + ')'); x.fillStyle = sg; x.fillRect(0, sy - 50, W, 50);
      x.fillStyle = 'rgba(' + (tone === 'yellow' ? '38,40,43' : '247,192,50') + ',' + (tone === 'dark' ? 0.14 : 0.12) + ')'; x.fillRect(0, sy, W, 1);
      // brackets
      x.strokeStyle = 'rgba(' + ink + ',' + (tone === 'dark' ? 0.32 : 0.3) + ')'; x.lineWidth = 1.5; const m = 12, cc = 14;
      [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([cx, cy, sx, sy2]) => { x.beginPath(); x.moveTo(cx, cy + cc * sy2); x.lineTo(cx, cy); x.lineTo(cx + cc * sx, cy); x.stroke(); });
      // HUD
      if (hud && W > 260) { x.font = "500 10px 'JetBrains Mono', monospace"; x.textAlign = 'right'; x.fillStyle = 'rgba(' + ink + ',.5)'; const tc = Math.floor(s) % 60, fr = Math.floor((s % 1) * 24);
        const str = hud + '  00:' + String(tc).padStart(2, '0') + ':' + String(fr).padStart(2, '0'); x.fillText(str, W - 30, H - 20);
        x.fillStyle = '#E85C4A'; x.globalAlpha = Math.sin(s * 5) > 0 ? 1 : 0.25; x.beginPath(); x.arc(W - 30 - x.measureText(str).width - 9, H - 23.5, 3, 0, 7); x.fill(); x.globalAlpha = 1; }
    };
    if (reduced) { draw(3); return () => { ro.disconnect(); io.disconnect(); }; }
    const loop = (now: number) => { raf = requestAnimationFrame(loop); if (!vis || document.hidden || now - lastT < 32) return; lastT = now; draw((now - t0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [tone, hud, streaks]);
  return <canvas ref={ref} className={'tbg' + (className ? ' ' + className : '')} aria-hidden="true" />;
}
