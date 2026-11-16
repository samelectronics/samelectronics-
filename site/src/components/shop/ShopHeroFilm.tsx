'use client';
// Owner (16 Nov): "when you land on the shop: cool techy titles like the teardown ad, exciting, modern, moving".
// A widescreen cut of the teardown final-call commercial (public/se-td-ad.js), in the same language: the logo opens in
// a drawn ring → six part scenes, each in its own look (yellow / graphite / white) with its own transition (push, circle
// wipe, whip pan, zoom-through), speed stripes, a giant outline word sliding through, the title slamming in word by
// word, the real product render dropping in with a camera shake, flash ring and burst, stock lines ticking in with
// their dots → a flash-cut montage of every part → "Get yours today." → "In stock in Deira." → particles gathering
// into the logo. The button under it follows the scene. Draws only while on screen; reduced motion shows one frame.
import React, { useEffect, useRef, useState } from 'react';
import { T } from '@/components/site/ui';

const Y = '#F7C032', G = '#26282B';
const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v), K = (t: number, a: number, d: number) => cl((t - a) / d), lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (v: number) => 1 - Math.pow(1 - cl(v), 3), eo5 = (v: number) => 1 - Math.pow(1 - cl(v), 5), eio = (v: number) => { v = cl(v); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
const back = (v: number) => { v = cl(v); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2); };
const F = { sg: '"Space Grotesk","IBM Plex Sans Arabic",sans-serif', in: 'Inter,"IBM Plex Sans Arabic",sans-serif', jb: '"JetBrains Mono","IBM Plex Sans Arabic",monospace' };
type Th = 'yel' | 'dark' | 'light';
const TH: Record<Th, { bg: string[]; ink: string; sub: string; kick: string; glow: string; acc: string }> = {
  yel: { bg: ['#FFE291', Y, '#EDB21C'], ink: G, sub: '#3A3000', kick: 'rgba(38,40,43,.72)', glow: 'rgba(255,250,228,.8)', acc: 'rgba(38,40,43,' },
  dark: { bg: ['#4B4B49', '#303132', '#1C1D1F'], ink: '#FFFFFF', sub: '#D5D7DA', kick: Y, glow: 'rgba(255,226,150,.36)', acc: 'rgba(247,192,50,' },
  light: { bg: ['#FFFFFF', '#F6F4F0', '#E2DED6'], ink: G, sub: '#3D3E3F', kick: 'rgba(38,40,43,.72)', glow: 'rgba(255,206,96,.32)', acc: 'rgba(247,192,50,' },
};
type Scn = { k: string; t: [string, string]; img: string; th: Th; cta: string; cat: string; tr: 'push' | 'circle' | 'whip' | 'zoom'; it: [string, number][] };
const SCN: Scn[] = [
  { k: 'DISPLAY', t: ['Every', 'screen.'], img: '/assets/pose/samsung-sp-960.webp', th: 'yel', cta: 'Shop screens', cat: 'SCR', tr: 'push', it: [['Full display screen', 24], ['Display with frame', 9], ['Touch glass', 0]] },
  { k: 'POWER & CHARGING', t: ['Full', 'power.'], img: '/assets/pose/part-bat-960.webp', th: 'dark', cta: 'Shop batteries', cat: 'BAT', tr: 'circle', it: [['Battery', 31], ['Charging port flex', 18], ['Charging connector', 0]] },
  { k: 'HOUSING', t: ['Like new,', 'again.'], img: '/assets/pose/part-bcv-960.webp', th: 'light', cta: 'Shop back covers', cat: 'BCV', tr: 'whip', it: [['Back cover', 22], ['Back cover with chassis', 6], ['Screw set', 0]] },
  { k: 'CAMERAS', t: ['Sharp', 'every shot.'], img: '/assets/pose/part-cam-960.webp', th: 'yel', cta: 'Shop cameras', cat: 'CAM', tr: 'zoom', it: [['Rear camera', 12], ['Front camera', 7], ['Camera lens', 0]] },
  { k: 'FLEX CABLES', t: ['Every', 'connection.'], img: '/assets/pose/part-flx-960.webp', th: 'dark', cta: 'Shop flex cables', cat: 'FLX', tr: 'push', it: [['Volume flex', 14], ['Power flex', 11], ['Mainboard flex', 0]] },
  { k: 'FRAMES & SMALL PARTS', t: ['Every', 'last part.'], img: '/assets/pose/part-frm-960.webp', th: 'light', cta: 'Shop small parts', cat: 'SML', tr: 'circle', it: [['Middle frame', 8], ['SIM tray', 16], ['Fingerprint reader', 0]] },
];
const OPEN = 1.5, SD = 2.5, TRD = 0.36, MONT = 1.3, CALL = 2.4, CLOSE = 2.4;
const S0 = OPEN, M0 = S0 + SCN.length * SD, C0 = M0 + MONT, L0 = C0 + CALL, TOT = L0 + CLOSE;

export default function ShopHeroFilm({ onCat, onShop, stats }: { onCat: (c: string) => void; onShop: () => void; stats: [number, number, number] }) {
  const cv = useRef<HTMLCanvasElement>(null), host = useRef<HTMLDivElement>(null), [ph, setPh] = useState(-1);
  useEffect(() => {
    const c = cv.current, h = host.current; if (!c || !h) return;
    const x = c.getContext('2d')!; let W = 0, H = 0, dpr = 1, raf = 0, vis = true, t0 = 0, lastPh = -9;
    const imgs = SCN.map((q) => { const im = new Image(); im.decoding = 'async'; im.src = q.img; return im; });
    const logo = new Image(); logo.src = '/assets/se-logo-512.webp';
    const ok = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0;
    const PT = Array.from({ length: 220 }, (_, i) => { const side = i % 4; return { sx: side === 0 ? -0.05 : side === 1 ? 1.05 : Math.random(), sy: side === 2 ? -0.1 : side === 3 ? 1.1 : Math.random(), a: Math.random() * Math.PI * 2, r: 0.86 + Math.random() * 0.16, s: 0.6 + Math.random() * 1.4, d: Math.random() * 0.45, sw: Math.random() - 0.5 }; });
    const size = () => { const r = h.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); };
    size(); const ro = new ResizeObserver(size); ro.observe(h);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: [0, 0.05] }); io.observe(h);
    const narrow = () => W < 760;
    const U = () => (narrow() ? W / 60 : H / 100); // layout unit
    const M = () => (narrow() ? W * 0.07 : Math.max(32, Math.min(W * 0.075, 120)));
    const bg = (th: Th) => { const b = TH[th].bg, cx = narrow() ? W / 2 : W * 0.66, g = x.createRadialGradient(cx, H * 0.42, 0, cx, H * 0.42, Math.max(W, H) * 0.75); g.addColorStop(0, b[0]); g.addColorStop(0.5, b[1]); g.addColorStop(1, b[2]); x.fillStyle = g; x.fillRect(0, 0, W, H); };
    const txt = (s: string, X: number, Yy: number, font: string, col: string, al: CanvasTextAlign = 'left') => { x.font = font; x.fillStyle = col; x.textAlign = al; x.fillText(s, X, Yy); };
    const rr = (X: number, Yy: number, w: number, hh: number, r: number) => { x.beginPath(); x.roundRect(X, Yy, w, hh, r); };
    const dashes = (i: number, th: Th, k: number) => { const u = U(), m = M(), n = SCN.length, gw = 0.9 * u, w = Math.min(64, (W * 0.34 - gw * (n - 1)) / n), y = narrow() ? 5 * u : 9 * u;
      for (let j = 0; j < n; j++) { const X = m + j * (w + gw); x.fillStyle = th === 'dark' ? 'rgba(255,255,255,.18)' : 'rgba(38,40,43,.16)'; rr(X, y, w, 3, 1.5); x.fill(); const f = j < i ? 1 : j === i ? k : 0; if (f > 0) { x.fillStyle = th === 'dark' ? Y : G; rr(X, y, w * f, 3, 1.5); x.fill(); } } };

    function scene(i: number, lt: number) {
      const q = SCN[i], th = TH[q.th], u = U(), m = M(), nar = narrow();
      bg(q.th);
      // speed stripes and a giant outline word sliding through
      x.save(); x.translate(W / 2, H / 2); x.rotate(-0.38); const sp = (lt * 0.5 + i * 0.37) % 1;
      for (let k2 = 0; k2 < 6; k2++) { const off = ((sp + k2 * 0.19) % 1) * (W + H) * 1.2 - (W + H) * 0.6; x.fillStyle = th.acc + (0.045 + 0.03 * (k2 % 2)) + ')'; x.fillRect(-W * 1.5, off, W * 3, (2 + k2 * 1.2) * u); }
      x.restore();
      { const word = T(q.t[0] + ' ' + q.t[1]).toUpperCase().replace(/[.,]/g, ''), gx = lerp(W * 1.05, -W * 1.4, K(lt, 0, SD)); x.save(); x.globalAlpha = 0.08; x.translate(gx, H * 0.86); x.font = '800 ' + (nar ? 30 : 46) * u + 'px ' + F.sg; x.lineWidth = Math.max(1.5, 0.35 * u); x.strokeStyle = q.th === 'yel' ? G : Y; x.textAlign = 'left'; x.strokeText(word, 0, 0); x.restore(); }
      const land = lt - 0.62, shake = land > 0 && land < 0.28 ? (1 - land / 0.28) * 1.2 * u : 0, zEnd = 1 + 0.05 * eio(K(lt, SD - 0.35, 0.35));
      x.save(); x.translate(W / 2 + (shake ? (Math.random() * 2 - 1) * shake : 0), H / 2 + (shake ? (Math.random() * 2 - 1) * shake : 0)); x.scale(zEnd, zEnd); x.translate(-W / 2, -H / 2);
      const pcx = nar ? W / 2 : W * 0.7, pcy = nar ? H * 0.34 : H * 0.5;
      { const g = x.createRadialGradient(pcx, pcy, 0, pcx, pcy, (nar ? W * 0.5 : H * 0.62)); g.addColorStop(0, th.glow); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      dashes(i, q.th, cl(lt / SD));
      x.textBaseline = 'alphabetic';
      const ty0 = nar ? H * 0.62 : 30 * u;
      { const k = eo(K(lt, 0.18, 0.35)); x.globalAlpha = k; txt(String(i + 1).padStart(2, '0') + ' / ' + T(q.k), m - (1 - k) * 4 * u, ty0 - (nar ? 4 : 7) * u, '600 ' + (nar ? 2.2 : 2.1) * u + 'px ' + F.jb, th.kick); x.globalAlpha = 1; }
      const ts = nar ? 6.2 * u : 12.5 * u;
      q.t.forEach((w2, j) => { const k = K(lt, 0.24 + j * 0.11, 0.32), e = back(k), s = lerp(1.35, 1, eo(k)), y = ty0 + ts * 0.85 + j * ts * 1.02, from = (j % 2 ? 1 : -1) * 10 * u;
        if (k <= 0) return; x.save(); x.globalAlpha = cl(k * 2.2); x.translate(m + from * (1 - e), y); x.scale(s, s); txt(T(w2), 0, 0, '700 ' + ts + 'px ' + F.sg, j === 1 && q.th !== 'yel' ? (q.th === 'dark' ? Y : G) : th.ink); x.restore();
        if (j === 1 && q.th === 'light' && k > 0.6) { x.font = '700 ' + ts + 'px ' + F.sg; const tw = x.measureText(T(w2)).width; x.fillStyle = 'rgba(247,192,50,.55)'; x.fillRect(m, y + ts * 0.08, tw * eo(K(lt, 0.6, 0.4)), ts * 0.14); } });
      // the product drops in, floats, slow push-in
      { const im = imgs[i], k = K(lt, 0.3, 0.55), e = back(k), fl = Math.sin((lt - 0.85) * 2.4) * 0.8 * u * cl(lt - 0.85), push = 1 + 0.04 * K(lt, 0.6, SD), S = (nar ? W * 0.62 : H * 1.02) * push, cy = pcy + (1 - e) * 14 * u + fl;
        if (ok(im) && k > 0) { x.save(); x.globalAlpha = cl(k * 2); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 40; x.shadowOffsetY = 24; x.drawImage(im, pcx - S / 2, cy - S / 2, S, S); x.restore(); } }
      if (land > 0 && land < 0.5) { const b = land / 0.5; x.save(); x.globalAlpha = (1 - b) * 0.9; x.strokeStyle = q.th === 'yel' ? '#FFFFFF' : Y; x.lineWidth = (1 - b) * 1.6 * u; const R0 = nar ? W * 0.18 : H * 0.22; x.beginPath(); x.arc(pcx, pcy, R0 + b * R0 * 2.2, 0, 7); x.stroke();
        for (let r2 = 0; r2 < 14; r2++) { const a2 = r2 * Math.PI / 7 + i, r0 = R0 * (1.2 + b * 1.4), r1 = r0 + R0 * 0.6 * (1 - b); x.beginPath(); x.moveTo(pcx + Math.cos(a2) * r0, pcy + Math.sin(a2) * r0); x.lineTo(pcx + Math.cos(a2) * r1, pcy + Math.sin(a2) * r1); x.stroke(); }
        if (land < 0.08) { x.globalAlpha = (1 - land / 0.08) * 0.45; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); } x.restore(); }
      // stock lines ticking in, each with its dot
      if (!nar || H > 520) q.it.forEach(([name, st], j) => { const k = eo(K(lt, 0.62 + j * 0.09, 0.3)), y = (nar ? H * 0.84 : ty0 + ts * 2.6) + j * (nar ? 3.4 : 4.6) * u; if (k <= 0) return; x.globalAlpha = k; const xo = m - (1 - k) * 4 * u, fs = (nar ? 2.3 : 2.35) * u;
        x.fillStyle = st ? '#2BB673' : (q.th === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(38,40,43,.3)'); x.beginPath(); x.arc(xo + fs * 0.35, y - fs * 0.35, fs * 0.3, 0, 7); x.fill();
        if (st) { x.globalAlpha = k * (0.4 + 0.4 * Math.sin(lt * 6 + j)); x.beginPath(); x.arc(xo + fs * 0.35, y - fs * 0.35, fs * 0.6, 0, 7); x.fill(); x.globalAlpha = k; }
        txt(T(name), xo + fs * 1.2, y, '500 ' + fs + 'px ' + F.in, th.sub);
        x.font = '500 ' + fs + 'px ' + F.in; const nw = x.measureText(T(name)).width; txt(st ? st + ' ' + T('in stock') : T('On request'), xo + fs * 1.2 + nw + fs, y, '600 ' + fs * 0.85 + 'px ' + F.jb, st ? (q.th === 'yel' ? '#1E7A4C' : '#2BB673') : th.kick); x.globalAlpha = 1; });
      x.restore();
    }
    const prevOf = (i: number) => (i === 0 ? () => openF(OPEN) : () => scene(i - 1, SD));
    function into(i: number, lt: number) {
      const tr = SCN[i].tr, k = eio(K(lt, 0, TRD));
      if (k >= 1) { scene(i, lt); return; }
      if (tr === 'zoom') { scene(i, lt); const s2 = lerp(1, 1.9, k); x.save(); x.globalAlpha = 1 - k; x.translate(W / 2, H / 2); x.scale(s2, s2); x.translate(-W / 2, -H / 2); prevOf(i)(); x.restore(); x.globalAlpha = 1; return; }
      prevOf(i)(); x.save();
      if (tr === 'push') { x.translate(0, (1 - k) * H); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, -6, W, 6); }
      else if (tr === 'circle') { x.beginPath(); x.arc(narrow() ? W / 2 : W * 0.7, H / 2, Math.hypot(W, H) * k, 0, 7); x.clip(); }
      else if (tr === 'whip') x.translate((1 - k) * W, 0);
      scene(i, lt); x.restore();
      if (tr === 'whip') { x.globalAlpha = 0.35 * Math.sin(k * Math.PI); x.fillStyle = '#FFFFFF'; for (let j = 0; j < 12; j++) x.fillRect(0, H * (0.06 + j * 0.08), W, 2); x.globalAlpha = 1; }
    }
    function openF(lt: number) {
      bg('dark'); const u = U(), cx = W / 2, cy = H * 0.42, r = Math.min(H * 0.17, W * 0.12);
      const ring = eo(K(lt, 0.05, 0.5)); x.save(); x.strokeStyle = Y; x.lineWidth = 3; x.lineCap = 'round'; x.shadowColor = Y; x.shadowBlur = 18; x.beginPath(); x.arc(cx, cy, r + 10, -Math.PI / 2, -Math.PI / 2 + ring * Math.PI * 2); x.stroke(); x.restore();
      const lk = back(K(lt, 0.25, 0.45)); if (ok(logo) && lk > 0) { const s = r * lk; x.save(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); x.fillStyle = '#fff'; x.fillRect(cx - s, cy - s, s * 2, s * 2); x.drawImage(logo, cx - s, cy - s, s * 2, s * 2); x.restore(); }
      const wk = eo(K(lt, 0.45, 0.5)); x.globalAlpha = wk; x.textAlign = 'center'; x.fillStyle = '#FFFFFF'; x.font = '600 ' + Math.max(18, 4.6 * u) + 'px ' + F.sg; (x as unknown as { letterSpacing: string }).letterSpacing = lerp(18, 6, wk) + 'px'; x.fillText(T('THE PARTS SHOP'), cx, cy + r + 9 * u); (x as unknown as { letterSpacing: string }).letterSpacing = '0px';
      x.fillStyle = Y; x.font = '500 ' + Math.max(12, 2.4 * u) + 'px ' + F.jb; x.fillText(stats[0] ? stats[0] + ' ' + T('parts') + ' · ' + stats[1] + ' ' + T('models') + ' · ' + stats[2] + ' ' + T('brands') : T('IN STOCK IN DEIRA'), cx, cy + r + 15 * u); x.globalAlpha = 1;
      const z = K(lt, OPEN - 0.3, 0.3); if (z > 0) { x.globalAlpha = eio(z); x.fillStyle = Y; x.beginPath(); x.arc(cx, cy, Math.hypot(W, H) * eio(z), 0, 7); x.fill(); x.globalAlpha = 1; }
    }
    function montage(lt: number) {
      const n = SCN.length, d = MONT / n, j = Math.min(n - 1, Math.floor(lt / d)), l = lt - j * d, th = (['yel', 'dark', 'light'] as Th[])[j % 3];
      bg(th); const im = imgs[j], s = (narrow() ? W * 0.8 : H * 1.15) * (1.05 + 0.15 * eo(l / d)); if (ok(im)) x.drawImage(im, W / 2 - s / 2, H / 2 - s / 2, s, s);
      txt(T(SCN[j].k), M(), H * 0.16, '600 ' + Math.max(12, 2.2 * U()) + 'px ' + F.jb, TH[th].kick);
      const fl = 1 - cl(l / 0.07); if (fl > 0) { x.globalAlpha = fl * 0.85; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
    }
    function call(lt: number) {
      const u = U(), m = M(), nar = narrow(), fs = nar ? 7.5 * u : 13 * u;
      if (lt < 1.15) { bg('yel');
        (['Get', 'yours', 'today.'] as const).forEach((w2, j) => { const k = K(lt, 0.05 + j * 0.08, 0.3), e = back(k), s = lerp(1.5, 1, eo(k)), from = (j % 2 ? 1 : -1); if (k <= 0) return; x.save(); x.globalAlpha = cl(k * 2.5); x.translate(m + from * 16 * u * (1 - e), H * (nar ? 0.38 : 0.36) + j * fs); x.scale(s, s); txt(T(w2), 0, 0, '700 ' + fs + 'px ' + F.sg, G); x.restore(); });
        const lk = eo(K(lt, 0.55, 0.35)); x.fillStyle = G; x.fillRect(m, H * (nar ? 0.38 : 0.36) + 2.4 * fs, W * 0.3 * lk, 4);
        const fl = K(lt, 1.0, 0.15); if (fl > 0) { x.globalAlpha = fl; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } return; }
      const l = lt - 1.15; bg('dark'); const fl = 1 - cl(l / 0.15);
      ([['In stock', '#FFFFFF'], ['in Deira.', Y]] as const).forEach(([w2, c2], j) => { const k = K(l, 0.05 + j * 0.12, 0.35), e = eo5(k); if (k <= 0) return; const y = H * 0.42 + j * fs; x.save(); x.beginPath(); x.rect(0, y - fs, W, fs * 1.25); x.clip(); txt(T(w2), m, y + (1 - e) * fs, '700 ' + fs + 'px ' + F.sg, c2); x.restore(); });
      const mk = eo(K(l, 0.45, 0.35)); x.globalAlpha = mk; txt(T('AL MURAR · DEIRA · DUBAI'), m, H * 0.42 + fs * 1.7, '600 ' + Math.max(12, 2.2 * u) + 'px ' + F.jb, '#D5D7DA'); x.globalAlpha = 1;
      if (fl > 0) { x.globalAlpha = fl; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
    }
    function close(lt: number) {
      bg('dark'); const u = U(), cx = W / 2, cy = H * 0.42, r = Math.min(H * 0.18, W * 0.13), gk = K(lt, 0, 0.95);
      x.fillStyle = Y; PT.forEach((p) => { const k = eio(K(gk, p.d, 1 - p.d)); const a = p.a + p.sw * (1 - k) * 2, tx = cx + Math.cos(a) * r * p.r, ty = cy + Math.sin(a) * r * p.r; x.globalAlpha = (1 - K(lt, 0.9, 0.3)) * 0.9; x.beginPath(); x.arc(lerp(p.sx * W, tx, k), lerp(p.sy * H, ty, k), p.s, 0, 7); x.fill(); });
      x.globalAlpha = 1;
      const lk = eo(K(lt, 0.85, 0.35)); if (ok(logo) && lk > 0) { const s = r; x.globalAlpha = lk; x.save(); x.strokeStyle = Y; x.lineWidth = 3; x.shadowColor = Y; x.shadowBlur = 16; x.beginPath(); x.arc(cx, cy, s + 4, 0, 7); x.stroke(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); x.fillStyle = '#fff'; x.fillRect(cx - s, cy - s, s * 2, s * 2); x.drawImage(logo, cx - s, cy - s, s * 2, s * 2);
        const sw = K(lt, 1.15, 0.5); if (sw > 0 && sw < 1) { const gx = lerp(cx - s * 1.6, cx + s * 1.6, eio(sw)), g = x.createLinearGradient(gx - s * 0.4, 0, gx + s * 0.4, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - s, cy - s, s * 2, s * 2); }
        x.restore(); x.globalAlpha = 1; }
      const wk = eo(K(lt, 1.05, 0.45)); x.globalAlpha = wk; x.textAlign = 'center'; x.fillStyle = '#FFFFFF'; x.font = '600 ' + Math.max(18, 4.4 * u) + 'px ' + F.sg; (x as unknown as { letterSpacing: string }).letterSpacing = lerp(16, 6, wk) + 'px'; x.fillText('SAM ELECTRONICS', cx, cy + r + 9 * u); (x as unknown as { letterSpacing: string }).letterSpacing = '0px';
      x.fillStyle = Y; x.font = '500 ' + Math.max(12, 2.3 * u) + 'px ' + F.jb; x.fillText(T('QUALITY · WARRANTY · PRICE'), cx, cy + r + 15 * u); x.globalAlpha = 1;
    }
    const draw = (tt: number) => {
      const t = ((tt % TOT) + TOT) % TOT; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      let p = -1;
      if (t < S0) { openF(t); p = -1; }
      else if (t < M0) { const i = Math.min(SCN.length - 1, Math.floor((t - S0) / SD)); into(i, t - S0 - i * SD); p = i; }
      else if (t < C0) { montage(t - M0); p = 6; }
      else if (t < L0) { call(t - C0); p = 7; }
      else { close(t - L0); p = 8; }
      if (p !== lastPh) { lastPh = p; setPh(p); }
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { const iv = window.setTimeout(() => draw(S0 + 1.8), 300); return () => { window.clearTimeout(iv); ro.disconnect(); io.disconnect(); }; }
    const loop = (now: number) => { raf = requestAnimationFrame(loop); if (!vis || document.hidden) { t0 += 16; return; } if (!t0) t0 = now; draw((now - t0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [stats[0], stats[1], stats[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  const sc = ph >= 0 && ph < SCN.length ? SCN[ph] : null, dark = sc ? sc.th === 'dark' : ph !== 7 || true;
  return (
    <div ref={host} className={'shf' + (sc ? ' th-' + sc.th : ' th-dark')} aria-hidden="false">
      <canvas ref={cv} aria-hidden="true" />
      
      {sc ? <button type="button" key={ph} className={'shf-cta ' + sc.th} onClick={() => onCat(sc.cat)}>{T(sc.cta)}<i aria-hidden="true">→</i></button>
        : ph >= 6 ? <button type="button" key={'all' + ph} className={'shf-cta ' + (ph === 7 && dark ? 'dark' : 'dark')} onClick={onShop}>{T('Shop all parts')}<i aria-hidden="true">→</i></button> : null}
    </div>
  );
}
