'use client';
// Owner (27 Oct): a LIVE circuit background for a section (replaces the faint static "spiderweb" patterns).
// A board of orthogonal traces with 45° chamfers, pads and vias (generated once per size), light pulses running along
// the traces, and the traces near the pointer lighting up. Drawn on one canvas: the static board is cached; each frame
// only composites the cache, the pulses and the pointer glow. Paused off-screen; ~30 fps; reduced motion = static board.
import React, { useEffect, useRef } from 'react';

type Tone = 'light' | 'dark' | 'yel';
const COL: Record<Tone, { line: string; pad: string; lit: string; pulse: string; glow: string }> = {
  light: { line: 'rgba(38,40,43,.085)', pad: 'rgba(38,40,43,.12)', lit: 'rgba(214,150,10,.75)', pulse: '#F7C032', glow: 'rgba(247,192,50,.55)' },
  dark: { line: 'rgba(247,192,50,.10)', pad: 'rgba(247,192,50,.16)', lit: 'rgba(255,214,110,.9)', pulse: '#FFDB6E', glow: 'rgba(247,192,50,.7)' },
  yel: { line: 'rgba(38,40,43,.13)', pad: 'rgba(38,40,43,.18)', lit: 'rgba(38,40,43,.7)', pulse: '#FFFFFF', glow: 'rgba(255,255,255,.8)' },
};

type Pt = [number, number];
function board(w: number, h: number, seed: number) {
  let s = seed; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const G = 28, cols = Math.ceil(w / G), rows = Math.ceil(h / G), used = new Set<string>(), traces: Pt[][] = [];
  const n = Math.round((cols * rows) / 34);
  for (let k = 0; k < n; k++) {
    let cx = Math.floor(r() * cols), cy = Math.floor(r() * rows); if (used.has(cx + ',' + cy)) continue;
    const pts: Pt[] = [[cx * G, cy * G]]; let dir = Math.floor(r() * 4), len = 0; const max = 6 + Math.floor(r() * 18);
    const D = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    while (len < max) {
      const turn = r(); if (turn < 0.22) dir = (dir + 1) % 4; else if (turn < 0.44) dir = (dir + 3) % 4;
      const diag = r() < 0.35; const [dx, dy] = D[dir]; const [qx, qy] = diag ? [dx + (dy !== 0 ? (r() < 0.5 ? 1 : -1) : 0), dy + (dx !== 0 ? (r() < 0.5 ? 1 : -1) : 0)] : [dx, dy];
      const nx = cx + qx, ny = cy + qy, key = nx + ',' + ny; if (nx < 0 || ny < 0 || nx > cols || ny > rows || used.has(key)) break;
      used.add(key); cx = nx; cy = ny; pts.push([cx * G, cy * G]); len++;
    }
    if (pts.length > 3) traces.push(pts);
  }
  return traces;
}

export default function CircuitField({ tone = 'light', seed = 7, className, style }: { tone?: Tone; seed?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const x = cv.getContext('2d'); if (!x) return;
    const C = COL[tone], reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, traces: Pt[][] = [], base: HTMLCanvasElement | null = null, lit: HTMLCanvasElement | null = null, raf = 0, vis = false, last = 0;
    let mx = -9999, my = -9999, glow = 0; const pulses: { t: number; i: number; v: number }[] = [];
    const lenOf = (p: Pt[]) => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
    const at = (p: Pt[], d: number): Pt => { for (let i = 1; i < p.length; i++) { const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (d <= l) { const k = d / l; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; } d -= l; } return p[p.length - 1]; };
    const layer = (stroke: string, pad: string) => { const c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr; const g = c.getContext('2d')!; g.scale(dpr, dpr); g.lineWidth = 1.4; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = stroke;
      traces.forEach((p) => { g.beginPath(); p.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.stroke(); const [ex, ey] = p[p.length - 1], [sx, sy] = p[0]; g.fillStyle = pad; g.beginPath(); g.arc(ex, ey, 3.2, 0, 7); g.fill(); g.beginPath(); g.arc(sx, sy, 2.2, 0, 7); g.strokeStyle = pad; g.stroke(); g.strokeStyle = stroke; }); return c; };
    const size = () => { const b = cv.getBoundingClientRect(); dpr = Math.min(1.5, window.devicePixelRatio || 1); W = Math.max(1, Math.round(b.width)); H = Math.max(1, Math.min(2400, Math.round((cv.parentElement as HTMLElement).getBoundingClientRect().height))); cv.style.height = H + 'px'; /* never larger than 2400px (memory) */ cv.width = W * dpr; cv.height = H * dpr; traces = board(W, H, seed); base = layer(C.line, C.pad); lit = layer(C.lit, C.lit); pulses.length = 0; for (let k = 0; k < Math.min(26, traces.length); k++) pulses.push({ i: Math.floor(Math.random() * traces.length), t: Math.random(), v: 0.06 + Math.random() * 0.1 }); draw(0); };
    const draw = (dt: number) => {
      if (!base || !lit) return; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.drawImage(base, 0, 0);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      // the pointer lights the traces around it
      glow += ((mx > -999 ? 1 : 0) - glow) * Math.min(1, dt * 6);
      if (glow > 0.01) { const R = 170; x.save(); x.globalAlpha = glow; x.beginPath(); x.arc(mx, my, R, 0, 7); x.clip(); const g = x.createRadialGradient(mx, my, 0, mx, my, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.drawImage(lit, 0, 0, W, H); x.globalCompositeOperation = 'destination-in'; x.fillStyle = g; x.fillRect(mx - R, my - R, R * 2, R * 2); x.restore(); }
      if (reduce) return;
      // pulses: a bright head and a short fading tail running along a trace
      pulses.forEach((q) => { const p = traces[q.i]; if (!p) return; const L = lenOf(p); q.t += (q.v * dt * 260) / L; if (q.t > 1) { q.t = 0; q.i = Math.floor(Math.random() * traces.length); return; }
        for (let k = 0; k < 7; k++) { const d = q.t * L - k * 5; if (d < 0) break; const [a, b] = at(p, d); x.globalAlpha = (1 - k / 7) * 0.9; x.fillStyle = C.pulse; x.beginPath(); x.arc(a, b, k === 0 ? 2.2 : 1.6, 0, 7); x.fill(); }
        const [a, b] = at(p, q.t * L); x.globalAlpha = 0.5; const gg = x.createRadialGradient(a, b, 0, a, b, 10); gg.addColorStop(0, C.glow); gg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gg; x.fillRect(a - 10, b - 10, 20, 20); x.globalAlpha = 1; });
    };
    const loop = (t: number) => { raf = requestAnimationFrame(loop); if (!vis || t - last < 32) return; const dt = Math.min(0.1, (t - last) / 1000); last = t; draw(dt); };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(cv);
    const host = (cv.closest('section') || cv.parentElement) as HTMLElement;
    const mv = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; };
    const lv = () => { mx = -9999; my = -9999; };
    host.addEventListener('pointermove', mv, { passive: true }); host.addEventListener('pointerleave', lv);
    const ro = new ResizeObserver(() => size()); ro.observe(cv); size(); raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); host.removeEventListener('pointermove', mv); host.removeEventListener('pointerleave', lv); };
  }, [tone, seed]);
  return <canvas ref={ref} className={'se-cfield' + (className ? ' ' + className : '')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} aria-hidden="true" />;
}
