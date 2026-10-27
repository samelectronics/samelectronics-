'use client';
// Owner (27 Oct): the hero phone ad's dot globe as one component, so every "worldwide" place on the site shows the SAME
// real globe (land dots, Dubai highlighted, routes arcing out with parcels travelling them, a pulse on Deira). Turns on its
// own real-time clock; paused off-screen. Data: window.SE_GLOBE (public/se-globe-data.js).
import React, { useEffect, useRef } from 'react';

type G = { land: number[]; hi: number[]; ctr: number[][]; dxb: number[] };

export default function DotGlobe({ size = 240, speed = 6, className, style }: { size?: number; speed?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const x = cv.getContext('2d'); if (!x) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), N = Math.round(size * dpr); cv.width = cv.height = N;
    let raf = 0, vis = false, last = 0; const t0 = performance.now() / 1000;
    const D = Math.PI / 180, R = N / 2 - 5 * dpr, C = N / 2, p0 = 22 * D, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
    const v3 = (lon: number, lat: number) => [Math.cos(lat * D) * Math.cos(lon * D), Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D)];
    const ll = (v: number[]) => [Math.atan2(v[1], v[0]) / D, Math.asin(Math.max(-1, Math.min(1, v[2]))) / D];
    const slerp = (a: number[], b: number[], f: number) => { const dt = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(dt); if (om < 1e-4) return a; const s1 = Math.sin((1 - f) * om) / Math.sin(om), s2 = Math.sin(f * om) / Math.sin(om); return [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2]; };
    const draw = (t: number) => {
      const Gl = (window as unknown as { SE_GLOBE?: G }).SE_GLOBE; if (!Gl) return;
      const l0 = (55.27 - speed * t) * D;
      const pj = (lon: number, lat: number, h = 1) => { const l = lon * D - l0, f = lat * D, cf = Math.cos(f), sf = Math.sin(f), cl = Math.cos(l), r = R * h; return [C + r * cf * Math.sin(l), C - r * (cp0 * sf - sp0 * cf * cl), sp0 * sf + cp0 * cf * cl]; };
      x.clearRect(0, 0, N, N);
      const bg = x.createRadialGradient(C - R * 0.3, C - R * 0.35, R * 0.1, C, C, R); bg.addColorStop(0, '#3A3C41'); bg.addColorStop(0.7, '#25272B'); bg.addColorStop(1, '#1A1B1E'); x.beginPath(); x.arc(C, C, R, 0, 7); x.fillStyle = bg; x.fill();
      const dots = (arr: number[], col: string, sz: number) => { x.fillStyle = col; for (let i = 0; i < arr.length; i += 2) { const q = pj(arr[i], arr[i + 1]); if (q[2] <= 0.02) continue; x.globalAlpha = Math.min(1, 0.15 + q[2] * 1.1); const z = sz * dpr * (size / 96) * 0.55 * (0.55 + 0.45 * q[2]); x.fillRect(q[0] - z / 2, q[1] - z / 2, z, z); } x.globalAlpha = 1; };
      dots(Gl.land, 'rgba(214,216,219,.62)', 2.3); dots(Gl.hi, '#F7C032', 2.5);
      const O = v3(Gl.dxb[0], Gl.dxb[1]); x.lineCap = 'round'; const k1 = dpr * Math.max(1, size / 160);
      Gl.ctr.forEach((c, k) => { const B = v3(c[0], c[1]), H = 0.05 + 0.1 * Math.min(1, Math.acos(Math.max(-1, Math.min(1, O[0] * B[0] + O[1] * B[1] + O[2] * B[2]))) / 1.2), pts: number[][] = [];
        for (let i = 0; i <= 18; i++) { const f = i / 18, g = ll(slerp(O, B, f)); pts.push(pj(g[0], g[1], 1 + H * Math.sin(Math.PI * f))); }
        x.lineWidth = 1.1 * k1; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], z = Math.min(a[2], b[2]); if (z < -0.05) continue; x.globalAlpha = Math.max(0, Math.min(1, 0.2 + z * 1.4)) * 0.75; x.strokeStyle = '#F7C032'; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
        const e = pj(c[0], c[1]); if (e[2] > 0) { x.globalAlpha = Math.min(1, 0.2 + e[2] * 1.2); x.beginPath(); x.arc(e[0], e[1], 2.6 * k1, 0, 7); x.fillStyle = '#F7C032'; x.fill(); }
        const f = (t * 0.45 + k * 0.137) % 1, g = ll(slerp(O, B, f)), q = pj(g[0], g[1], 1 + H * Math.sin(Math.PI * f)); if (q[2] > 0) { const pa = Math.min(1, 0.2 + q[2] * 1.2) * Math.sin(Math.PI * f); x.globalAlpha = pa * 0.5; x.beginPath(); x.arc(q[0], q[1], 5 * k1, 0, 7); x.fillStyle = '#F7C032'; x.fill(); x.globalAlpha = pa; x.beginPath(); x.arc(q[0], q[1], 2 * k1, 0, 7); x.fillStyle = '#FFF4D1'; x.fill(); } });
      x.globalAlpha = 1; const d = pj(Gl.dxb[0], Gl.dxb[1]);
      if (d[2] > 0) { const a = Math.min(1, 0.2 + d[2] * 1.2), hr = 18 * k1, hg = x.createRadialGradient(d[0], d[1], 0, d[0], d[1], hr); hg.addColorStop(0, 'rgba(247,192,50,.6)'); hg.addColorStop(1, 'rgba(247,192,50,0)'); x.globalAlpha = a; x.fillStyle = hg; x.beginPath(); x.arc(d[0], d[1], hr, 0, 7); x.fill();
        const pu = (t % 2.4) / 2.4; x.globalAlpha = a * (1 - pu) * 0.9; x.lineWidth = 1.4 * k1; x.strokeStyle = '#F7C032'; x.beginPath(); x.arc(d[0], d[1], (5 + pu * 13) * k1, 0, 7); x.stroke();
        x.globalAlpha = a; x.beginPath(); x.arc(d[0], d[1], 5 * k1, 0, 7); x.fillStyle = '#F7C032'; x.fill(); x.lineWidth = 1.6 * k1; x.strokeStyle = '#26282B'; x.stroke(); }
      x.globalAlpha = 1; const rim = x.createRadialGradient(C, C, R * 0.82, C, C, R); rim.addColorStop(0, 'rgba(255,236,190,0)'); rim.addColorStop(0.85, 'rgba(255,236,190,.16)'); rim.addColorStop(1, 'rgba(255,240,205,.42)'); x.beginPath(); x.arc(C, C, R, 0, 7); x.fillStyle = rim; x.fill();
      x.lineWidth = dpr; x.strokeStyle = 'rgba(255,240,205,.35)'; x.stroke();
    };
    const loop = (n: number) => { raf = requestAnimationFrame(loop); if (!vis || n - last < 33) return; last = n; draw(n / 1000 - t0); };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) draw(performance.now() / 1000 - t0); }); io.observe(cv);
    draw(0); raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [size, speed]);
  return <canvas ref={ref} className={'se-dglobe' + (className ? ' ' + className : '')} style={{ width: size, height: size, borderRadius: '50%', display: 'block', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.45))', ...style }} aria-hidden="true" />;
}
