'use client';
// R12 (owner: "unrealistic globe, dots and black outlines"): ONE realistic globe for every worldwide place on the site.
// NASA Blue Marble imagery (public domain) mapped onto a real sphere, turning slowly, lit from the upper left with a soft
// blue atmosphere at the rim, and Deira marked by a glowing yellow pin with a pulse. The sphere mapping is precomputed
// once per size, so each frame is only a cheap copy; it renders at most 360px inside (scaled by CSS) and pauses
// off-screen. Same component name and props as before, so every use upgraded at once.
import React, { useEffect, useRef } from 'react';

let texP: Promise<ImageData | null> | null = null;
const loadTex = () => texP || (texP = new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { try { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d')!; x.drawImage(im, 0, 0); res(x.getImageData(0, 0, im.width, im.height)); } catch { res(null); } }; im.onerror = () => res(null); im.src = '/assets/earth-day.webp'; }));

export default function DotGlobe({ size = 240, speed = 6, className, style }: { size?: number; speed?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const x = cv.getContext('2d'); if (!x) return;
    let raf = 0, vis = false, dead = false, last = 0;
    const N = Math.min(360, Math.round(size * Math.min(2, window.devicePixelRatio || 1))); cv.width = cv.height = N;
    const R = N / 2 - 2, C = N / 2, D = Math.PI / 180, tilt = 18 * D;
    loadTex().then((tex) => {
      if (dead || !tex) return;
      const TW = tex.width, TH = tex.height, src = tex.data, img = x.createImageData(N, N), out = img.data;
      // per pixel: texture column at rotation 0, row, and light (precomputed)
      const idx: number[] = [], u0: number[] = [], vrow: number[] = [], sh: number[] = [];
      for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
        const dx = (px + 0.5 - C) / R, dy = (py + 0.5 - C) / R, rr = dx * dx + dy * dy; if (rr > 1) continue;
        const dz = Math.sqrt(1 - rr), y1 = -dy * Math.cos(tilt) + dz * Math.sin(tilt), z1 = dy * Math.sin(tilt) + dz * Math.cos(tilt);
        const lat = Math.asin(Math.max(-1, Math.min(1, y1))), lon = Math.atan2(dx, z1);
        idx.push((py * N + px) * 4); u0.push(((lon / (2 * Math.PI) + 0.5) * TW) | 0); vrow.push(Math.min(TH - 1, ((0.5 - lat / Math.PI) * TH) | 0));
        const l = Math.max(0, -0.45 * dx - 0.35 * dy + 0.82 * dz); sh.push(0.28 + 0.92 * l);
      }
      const dxbLon = 55.3, dxbLat = 25.27;
      const draw = (t: number) => {
        const rot = (t * speed) % 360, centre = 55 - rot, du = ((((centre % 360) + 360) % 360) / 360) * TW; // Dubai faces us first; the Earth turns west to east
        for (let i = 0; i < idx.length; i++) { const u = (u0[i] + du) % TW | 0, s = (vrow[i] * TW + u) * 4, o = idx[i], k = sh[i]; out[o] = Math.min(255, src[s] * k * 1.05); out[o + 1] = Math.min(255, src[s + 1] * k * 1.05); out[o + 2] = Math.min(255, src[s + 2] * k * 1.1); out[o + 3] = 255; }
        x.putImageData(img, 0, 0);
        // atmosphere rim and a soft specular
        const g = x.createRadialGradient(C, C, R * 0.86, C, C, R * 1.0); g.addColorStop(0, 'rgba(120,180,255,0)'); g.addColorStop(1, 'rgba(140,195,255,.55)'); x.fillStyle = g; x.beginPath(); x.arc(C, C, R, 0, 7); x.fill();
        const sp = x.createRadialGradient(C - R * 0.38, C - R * 0.42, 0, C - R * 0.38, C - R * 0.42, R * 0.7); sp.addColorStop(0, 'rgba(255,255,255,.16)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = sp; x.beginPath(); x.arc(C, C, R, 0, 7); x.fill();
        // Deira pin
        const la = dxbLat * D, lon = ((((dxbLon - centre + 180) % 360) + 360) % 360 - 180) * D;
        const X = Math.cos(la) * Math.sin(lon), Y0 = Math.sin(la), Z0 = Math.cos(la) * Math.cos(lon), Yv = Y0 * Math.cos(tilt) - Z0 * Math.sin(tilt), Zv = Y0 * Math.sin(tilt) + Z0 * Math.cos(tilt);
        if (Zv > 0.05) { const sx = C + X * R, sy = C - Yv * R, a = Math.min(1, Zv * 2.5), pu = (t % 2.2) / 2.2;
          x.globalAlpha = a * (1 - pu) * 0.8; x.strokeStyle = '#F7C032'; x.lineWidth = Math.max(1, N / 180); x.beginPath(); x.arc(sx, sy, N / 60 + pu * N / 18, 0, 7); x.stroke();
          x.globalAlpha = a; const pg = x.createRadialGradient(sx, sy, 0, sx, sy, N / 30); pg.addColorStop(0, 'rgba(247,192,50,.9)'); pg.addColorStop(1, 'rgba(247,192,50,0)'); x.fillStyle = pg; x.beginPath(); x.arc(sx, sy, N / 30, 0, 7); x.fill();
          x.fillStyle = '#FFE28A'; x.beginPath(); x.arc(sx, sy, N / 90, 0, 7); x.fill(); x.globalAlpha = 1; }
      };
      const loop = (ms: number) => { if (dead) return; if (vis && ms - last > 33) { last = ms; draw(ms / 1000); } raf = requestAnimationFrame(loop); };
      draw(performance.now() / 1000); raf = requestAnimationFrame(loop);
    });
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(cv);
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); };
  }, [size, speed]);
  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: size, height: size, borderRadius: '50%', boxShadow: '0 0 ' + Math.round(size * 0.12) + 'px rgba(110,170,255,.18)', ...style }} />;
}
