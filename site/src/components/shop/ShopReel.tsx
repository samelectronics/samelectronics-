'use client';
// Owner (16 Nov): the shop's ads must play like real video commercials, not a phone again. ShopReel is a widescreen
// commercial drawn live on a canvas (no video file): six scenes cut together with whips, slams, flashes and light,
// using our real product renders. Screens · the four grades · battery week · trade prices · in stock in Deira.
// The button under it always matches the scene. Pauses off screen and in a hidden tab; reduced motion shows a still.
import React, { useEffect, useRef, useState } from 'react';
import { T } from '@/components/site/ui';

const Y = '#F7C032', G = '#26282B', D = '#26282B'; // owner (17 Nov): graphite, never black
const IMG: Record<string, string> = {
  scr: '/assets/pose/samsung-sp-960.webp', sp: '/assets/pose/apple-sp-960.webp', gx: '/assets/pose/apple-gx-960.webp', zy: '/assets/pose/apple-zy-960.webp',
  tmp: '/assets/pose/apple-temp-960.webp', pal: '/assets/pallet/pallet-600.webp', bat: '/assets/pose/solo-bat-960.webp', board: '/assets/pose/solo-board-960.webp', cam: '/assets/pose/solo-cam-960.webp', logo: '/assets/se-logo-320.webp',
};
type Cta = { t: string; go: () => void };
const DUR = [2.6, 3.4, 3.6, 3.2, 3.4, 3.4]; // seconds per scene
const START = DUR.reduce<number[]>((a, d, i) => (a.push(i ? a[i - 1] + DUR[i - 1] : 0), a), []), TOTAL = DUR.reduce((a, b) => a + b, 0);
const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x), eo = (x: number) => 1 - Math.pow(1 - cl(x), 3), back = (x: number) => { x = cl(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

export default function ShopReel({ onCat, onDeals, onShop }: { onCat: (c: string) => void; onDeals: () => void; onShop: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null), wrap = useRef<HTMLDivElement>(null), [scene, setScene] = useState(0), [hold, setHold] = useState(false);
  const CTA: Cta[] = [
    { t: 'Shop all parts', go: onShop }, { t: 'Shop screens', go: () => onCat('SCR') }, { t: 'Compare the grades', go: () => onCat('SCR') },
    { t: 'Shop batteries', go: () => onCat('BAT') }, { t: 'Get trade prices', go: () => { location.href = '/wholesale'; } }, { t: 'Ship with us', go: () => { location.href = '/worldwide'; } },
  ];
  useEffect(() => {
    const c = cv.current, host = wrap.current; if (!c || !host) return;
    const x = c.getContext('2d')!; let W = 0, H = 0, dpr = 1, raf = 0, vis = true, t0 = performance.now(), paused = 0, last = -1;
    const im: Record<string, HTMLImageElement> = {}; Object.entries(IMG).forEach(([k, u]) => { const i = new Image(); i.decoding = 'async'; i.src = u; im[k] = i; });
    const ok = (i?: HTMLImageElement) => !!(i && i.complete && i.naturalWidth);
    const size = () => { const r = host.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); };
    size(); const ro = new ResizeObserver(size); ro.observe(host);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: [0, 0.1] }); io.observe(host);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const font = (w: number, s: number) => w + ' ' + s + "px 'Space Grotesk', sans-serif";
    const u = () => (W < 640 ? W / 56 : Math.min(W, H * 2.6) / 100); // design unit (bigger on phones so text stays readable)
    const fill = (c1: string, c2?: string) => { if (c2) { const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g; } else x.fillStyle = c1; x.fillRect(0, 0, W, H); };
    const spot = (cx: number, cy: number, r: number, col: string) => { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); };
    // glowing light lines drifting diagonally (same family as the teardown ad)
    const beams = (l: number, rgb: string, a = 0.6) => { x.save(); x.translate(W / 2, H / 2); x.rotate(-0.38); x.globalCompositeOperation = 'screen';
      for (let k = 0; k < 2; k++) { /* owner (18 Nov): never random: exactly two soft bands, half a beat apart, at one steady speed */ const off = (((l * 0.7 + k * 0.5) % 1) - 0.5) * H * 1.4, len = W * 1.3, x0 = -len / 2; const g = x.createLinearGradient(x0, 0, x0 + len, 0); g.addColorStop(0, 'rgba(' + rgb + ',0)'); g.addColorStop(0.5, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
        // owner: the light is a soft glowing band with a bright core, not a thin straight wire
        { const r = Math.max(28, H * 0.09); x.save(); x.translate(0, off); x.scale(len / 2 / r, 1); const rg = x.createRadialGradient(0, 0, 0, 0, 0, r);
          rg.addColorStop(0, 'rgba(' + rgb + ',' + a * 0.6 + ')'); rg.addColorStop(0.3, 'rgba(' + rgb + ',' + a * 0.22 + ')'); rg.addColorStop(1, 'rgba(' + rgb + ',0)'); x.fillStyle = rg; x.fillRect(-r, -r, r * 2, r * 2); x.restore(); }
        x.shadowColor = 'rgba(' + rgb + ',1)'; x.shadowBlur = 26; x.fillStyle = g; x.fillRect(x0, off - 2, len, 4); }
      x.shadowBlur = 0; x.restore(); };
    // owner (16 Nov): every language keeps the same layout as English; a longer translation gets a slightly smaller font
    // so it stays on its one line inside its own space (never runs into the picture or off the ad).
    const text = (s: string, X: number, Yy: number, f: string, col: string, al: CanvasTextAlign = 'left', alpha = 1) => { x.globalAlpha = alpha; x.font = f;
      { const mx = al === 'left' ? (X >= W * 0.4 ? W * 0.96 - X : (W < 640 ? W * 0.88 : W * 0.5)) : al === 'center' ? W * 0.9 : W * 0.5, w0 = x.measureText(s).width;
        if (w0 > mx) { const m = f.match(/(\d+(?:\.\d+)?)px/); if (m) { x.font = f.replace(m[0], Math.max(8, Math.floor(+m[1] * mx / w0)) + 'px'); } } } x.fillStyle = col; x.textAlign = al; x.textBaseline = 'alphabetic'; x.fillText(s, X, Yy); x.globalAlpha = 1; };
    const pic = (k: string, cx: number, cy: number, h: number, rot = 0, a = 1, shadow = true) => { const i = im[k]; if (!ok(i)) return; const w = (h * i.naturalWidth) / i.naturalHeight; x.save(); x.globalAlpha = a; x.translate(cx, cy); x.rotate(rot);
      if (shadow) { x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 30; x.shadowOffsetY = 18; } x.drawImage(i, -w / 2, -h / 2, w, h); x.restore(); };
    const flash = (l: number, col = '#fff') => { if (l < 0.08) { x.globalAlpha = (1 - l / 0.08) * 0.75; x.fillStyle = col; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } };
    const narrow = () => W < 640;
    // owner (18 Nov): the grade labels are the site's techy tags (chamfered, own gradient), not 1990s boxes
    // owner (18 Nov night): clean labels, the same as the shop's tags: a soft-tinted rounded label (c1 = border, c2 = fill)
    const tag = (lab: string, cx: number, cy: number, c1: string, c2: string, ink: string, a: number, s: number) => { x.save(); x.globalAlpha = Math.max(0, Math.min(1, a)); x.font = '600 ' + Math.round(1.6 * s) + 'px Inter, system-ui, sans-serif'; const tw = x.measureText(lab).width, w = tw + 2.4 * s, h = 3 * s, r = 0.7 * s, x0 = cx - w / 2, y0 = cy - h / 2;
      x.beginPath(); x.roundRect(x0, y0, w, h, r); x.fillStyle = c2; x.fill(); x.lineWidth = Math.max(1, 0.12 * s); x.strokeStyle = c1; x.stroke();
      x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(lab, cx, cy + 0.08 * s); x.restore(); };

    const scenes: ((l: number, k: number) => void)[] = [
      // 0 · open: the logo lands in a ring of light, the line tracks in
      (l) => { fill('#2E3034', D); spot(W / 2, H * 0.45, H * 0.9, 'rgba(247,192,50,.18)'); beams(l * 0.4, '255,214,120', 0.35);
        const s = u(), cx = narrow() ? W / 2 : W * 0.3, cy = H * 0.5, R = Math.min(H * 0.3, 22 * s); x.save(); x.strokeStyle = Y; x.lineWidth = 3; x.shadowColor = Y; x.shadowBlur = 16; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * eo(l * 1.6)); x.stroke(); x.restore();
        if (ok(im.logo)) { const k2 = back(l * 2 - 0.3), r2 = R * 0.86 * k2; x.save(); x.beginPath(); x.arc(cx, cy, Math.max(0.1, r2), 0, Math.PI * 2); x.clip(); x.fillStyle = '#fff'; x.fillRect(cx - r2, cy - r2, r2 * 2, r2 * 2); x.drawImage(im.logo, cx - r2, cy - r2, r2 * 2, r2 * 2); x.restore(); }
        if (!narrow()) { const a = eo((l - 0.35) * 2.2), xx = W * 0.5 + (1 - a) * 40; text(T('THE PARTS SHOP').toUpperCase(), xx, H * 0.4, '600 ' + Math.round(1.6 * s) + "px 'JetBrains Mono', monospace", Y, 'left', a);
          text(T('Every part.'), xx, H * 0.4 + 7.5 * s, font(800, Math.round(6.6 * s)), '#fff', 'left', a); text(T('Every grade.'), xx, H * 0.4 + 15 * s, font(800, Math.round(6.6 * s)), Y, 'left', eo((l - 0.5) * 2.2)); }
        else { const a = eo((l - 0.35) * 2.2); text(T('Every part. Every grade.'), W / 2, H * 0.88, font(800, Math.round(4.2 * s)), '#fff', 'center', a); } },
      // 1 · SCREENS: the word slams, the screen whips in on a light floor, a price ticker counts
      (l) => { fill('#2A2C2F'); const s = u(); beams(l, '255,214,120', 0.55); spot(W * 0.62, H * 0.62, H * 0.9, 'rgba(247,192,50,.12)');
        const sh = l < 0.18 ? (1 - l / 0.18) * 6 : 0, dx = (Math.random() * 2 - 1) * sh; x.save(); x.translate(dx, 0);
        x.globalAlpha = 0.09; x.font = font(900, Math.round(H * 0.62)); x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(T('SCREENS'), W / 2 - l * W * 0.25, H * 0.78); x.globalAlpha = 1;
        const k = back(l * 2.4), px = narrow() ? W * 0.68 : W * 0.66, py = narrow() ? H * 0.6 : H * 0.52; pic('scr', px + (1 - k) * W * 0.6, py, H * (narrow() ? 0.5 : 0.82) * (0.9 + 0.1 * k), -0.06 * (1 - k));
        x.restore(); flash(l);
        const a = eo((l - 0.25) * 2.5), tx = narrow() ? W * 0.06 : W * 0.08; text(T('Screens').toUpperCase(), tx, H * 0.3, font(800, Math.round(7 * s)), '#fff', 'left', a);
        text(T('Original, OLED, Incell, AAA'), tx, H * 0.3 + 4.6 * s, '500 ' + Math.round(1.9 * s) + 'px Inter, sans-serif', '#C9CBCE', 'left', a);
        const n = Math.round(25 + 0 * l); text(T('from'), tx, H * 0.5, '500 ' + Math.round(1.8 * s) + 'px Inter, sans-serif', '#9DA1A6', 'left', eo((l - 0.45) * 3));
        text('AED ' + Math.round(n * eo((l - 0.45) * 2.2)), tx, H * 0.5 + 6 * s, font(800, Math.round(6 * s)), Y, 'left', eo((l - 0.45) * 3)); },
      // 2 · four grades drop in one after another, each with its own pill
      (l) => { fill('#F7F5F0', '#E9E6DF'); const s = u(); const G4: [string, string, string, string, string][] = [['sp', 'Original', '#F5D98C', '#FFF4D1', '#8A5A00'], ['gx', 'OLED Soft', '#B9E4F0', '#E5F6FB', '#0E6E87'], ['zy', 'Incell', '#D9CFF6', '#F1EDFC', '#5B3FB0'], ['tmp', 'AAA', '#C6DAFC', '#EAF2FF', '#1849A9']];
        text(T('One screen. Every grade.'), W / 2, H * 0.17, font(800, Math.round(4.6 * s)), G, 'center', eo(l * 3));
        const n = narrow() ? 2 : 4; G4.slice(0, n).forEach(([k, lab, c1, c2, ink], i) => { const st = 0.12 + i * 0.13, a = back((l - st) * 3), cx = W * ((i + 0.5) / n), cy = H * 0.44 - (1 - a) * H * 0.5;
          if (a <= 0) return; pic(k, cx, cy, H * 0.44, 0, Math.min(1, a)); tag(lab, cx, H * 0.71, c1, c2, ink, a, s); });
        flash(l, '#fff'); },
      // 3 · battery week: yellow, the battery spins in, a -15% stamp slams with a shake
      (l) => { fill('#F7C032', '#E8A912'); const s = u(); spot(W * 0.6, H * 0.5, H, 'rgba(255,255,255,.35)'); beams(l, '255,250,232', 0.7);
        const k = eo(l * 2), cx = narrow() ? W * 0.5 : W * 0.62; pic('bat', cx, narrow() ? H * 0.62 : H * 0.55, H * (narrow() ? 0.42 : 0.78), (1 - k) * 1.2, k);
        const tx = narrow() ? W * 0.06 : W * 0.08; text(T('Battery week.'), tx, H * 0.36, font(800, Math.round(6.4 * s)), G, 'left', eo((l - 0.1) * 3));
        text(T('Genuine cells, tested before they ship.'), tx, H * 0.36 + 4.6 * s, '500 ' + Math.round(1.9 * s) + 'px Inter, sans-serif', '#4A3A00', 'left', eo((l - 0.2) * 3));
        const st = l - 0.42; if (st > 0) { const sc = st < 0.12 ? 2.2 - (st / 0.12) * 1.2 : 1, sx = (narrow() ? W * 0.78 : W * 0.86), sy = H * 0.3; x.save(); x.translate(sx, sy); x.rotate(-0.18); x.scale(sc, sc); const r = 9 * s;
          x.fillStyle = G; x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.setLineDash([4, 3]); x.beginPath(); x.arc(0, 0, r * 0.84, 0, Math.PI * 2); x.stroke(); x.setLineDash([]);
          text('-15%', 0, r * 0.22, font(800, Math.round(4.6 * s)), Y, 'center'); x.restore(); if (st < 0.06) { x.globalAlpha = 0.25; x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } } },
      // 4 · trade prices: the retail price is struck through, the trade price counts in
      (l) => { fill('#2E3034', D); const s = u(); beams(l, '255,214,120', 0.4); spot(W * 0.7, H * 0.5, H, 'rgba(247,192,50,.12)');
        const cx = narrow() ? W * 0.5 : W * 0.7; pic('board', narrow() ? W * 0.72 : cx, (narrow() ? H * 0.72 : H * 0.55) - Math.sin(l * 3) * 6, H * (narrow() ? 0.3 : 0.7), 0.05, eo(l * 2.5));
        const tx = narrow() ? W * 0.06 : W * 0.08; text(T('FOR REPAIR SHOPS'), tx, H * 0.2, '600 ' + Math.round(1.6 * s) + "px 'JetBrains Mono', monospace", Y, 'left', eo(l * 3));
        text(T('Trade prices.'), tx, H * 0.2 + 7 * s, font(800, Math.round(6.2 * s)), '#fff', 'left', eo((l - 0.08) * 3));
        const a = eo((l - 0.3) * 3); text(T('Everyone') + '  AED 575', tx, H * 0.5, '500 ' + Math.round(2.4 * s) + 'px Inter, sans-serif', '#9DA1A6', 'left', a);
        if (l > 0.48) { x.font = '500 ' + Math.round(2.4 * s) + 'px Inter, sans-serif'; const w = x.measureText(T('Everyone') + '  AED 575').width * eo((l - 0.48) * 4); x.strokeStyle = '#E85C4A'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(tx, H * 0.5 - 0.8 * s); x.lineTo(tx + w, H * 0.5 - 0.8 * s); x.stroke(); }
        const b = eo((l - 0.55) * 3); text(T('Trade') + '  AED ' + Math.round(449 + (575 - 449) * (1 - b)), tx, H * 0.5 + 6.4 * s, font(800, Math.round(4.6 * s)), Y, 'left', b); },
      // 5 · owner (18 Nov): no "in stock" ad. WORLDWIDE: the word slams with a shake, the pallet whips in, the regions pop
      (l) => { fill('#24323A', '#1F2023'); const s = u(); beams(l, '120,240,220', 0.35); spot(W * 0.68, H * 0.55, H, 'rgba(45,212,191,.16)');
        const sh = l < 0.16 ? (1 - l / 0.16) * 7 : 0; x.save(); x.translate((Math.random() * 2 - 1) * sh, 0);
        x.globalAlpha = 0.08; x.font = font(900, Math.round(H * 0.5)); x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(T('WORLDWIDE'), W / 2 + (0.5 - l) * W * 0.3, H * 0.74); x.globalAlpha = 1;
        const k = back(l * 2.2); pic('pal', (narrow() ? W * 0.7 : W * 0.7) + (1 - k) * W * 0.5, narrow() ? H * 0.66 : H * 0.58, H * (narrow() ? 0.36 : 0.6), (1 - k) * 0.3); x.restore(); flash(l);
        const tx = narrow() ? W * 0.06 : W * 0.08; text(T('Worldwide.'), tx, H * 0.34, font(800, Math.round(6.6 * s)), '#fff', 'left', eo((l - 0.08) * 3)); text(T('Every week.'), tx, H * 0.34 + 7 * s, font(800, Math.round(6.6 * s)), '#2DD4BF', 'left', eo((l - 0.18) * 3));
        ['MIDDLE EAST', 'AFRICA', 'EUROPE', 'ASIA'].forEach((r, n) => { const a = back((l - 0.4 - n * 0.08) * 4); if (a <= 0) return; tag(T(r), tx + (n % 2) * 16 * s + 7 * s, H * 0.62 + Math.floor(n / 2) * 4.2 * s, '#3A3D42', '#26282B', '#F7C032', a, s); }); },
    ];
    const draw = (tt: number) => { const t = ((tt % TOTAL) + TOTAL) % TOTAL; let i = 0; while (i < DUR.length - 1 && t >= START[i] + DUR[i]) i++; const l = (t - START[i]) / DUR[i];
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      // a quick whip between scenes: the new one slides in over the last frames of the old
      scenes[i](l, i);
      if (i !== last) { last = i; setScene(i); } };
    if (reduced) { draw(START[2] + 1.6); return () => { ro.disconnect(); io.disconnect(); }; }
    const loop = (now: number) => { if (vis && !document.hidden && !paused) draw((now - t0) / 1000); else if (paused) t0 += 16; raf = requestAnimationFrame(loop); };
    const onHold = (e: Event) => { paused = (e as CustomEvent).detail ? 1 : 0; }; host.addEventListener('se:reelhold', onHold);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener('se:reelhold', onHold); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { wrap.current?.dispatchEvent(new CustomEvent('se:reelhold', { detail: hold })); }, [hold]);
  const c = CTA[scene];
  return (
    <div className="reel" ref={wrap}>
      <canvas ref={cv} aria-hidden="true" />
      <button type="button" className={'reel-cta' + (scene === 3 ? ' dark' : '')} key={scene} onClick={c.go}>{T(c.t)}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
      <span className="reel-bar" aria-hidden="true">{DUR.map((d, i) => <i key={i} className={i === scene ? 'on' : i < scene ? 'done' : ''} style={{ ['--d' as string]: d + 's' } as React.CSSProperties} />)}</span>
      <span className="sr-only">{T('Shop commercial: screens, every grade, battery week, trade prices, worldwide shipping.')}</span>
    </div>
  );
}
