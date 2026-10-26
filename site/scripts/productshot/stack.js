// Hero 5 · the teardown's own part geometry and materials (public/se-teardown-3d.js, lines 47–294, copied verbatim
// by scripts/productshot/sync-stack.mjs), so every product pose is built from exactly the same parts the teardown shows.
// buildStack(THREE, RoundedBoxGeometry, renderer) → { L: the 8 layer groups, NAMES, M, W, H, SG }.
export async function buildStack(THREE, RoundedBoxGeometry, renderer) {
  const PI = Math.PI, ANI = renderer.capabilities.getMaxAnisotropy();
  const W = 1.5, H = 3.1, R = 0.18, PX = 512 / W;
  let seed = 11; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rr = (P, w, h, r, cx = 0, cy = 0) => { const x = cx - w / 2, y = cy - h / 2; P.moveTo(x + r, y); P.lineTo(x + w - r, y); P.absarc(x + w - r, y + r, r, -PI / 2, 0); P.lineTo(x + w, y + h - r); P.absarc(x + w - r, y + h - r, r, 0, PI / 2); P.lineTo(x + r, y + h); P.absarc(x + r, y + h - r, r, PI / 2, PI); P.lineTo(x, y + r); P.absarc(x + r, y + r, r, PI, PI * 1.5); return P; };
  const Sh = (w, h, r, cx, cy) => rr(new THREE.Shape(), w, h, r, cx, cy);
  const Hp = (w, h, r, cx, cy) => rr(new THREE.Path(), w, h, r, cx, cy);
  const Ci = (r, cx, cy) => { const p = new THREE.Path(); p.absarc(cx, cy, r, 0, PI * 2, true); return p; };
  const FULL = [-W / 2, W / 2, -H / 2, H / 2];
  const uvBox = (g, b) => { const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - b[0]) / (b[1] - b[0]), (p.getY(i) - b[2]) / (b[3] - b[2])); uv.needsUpdate = true; };
  const extr = (shape, d, bevel = 0, box = FULL) => { const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 24 }); g.translate(0, 0, -d / 2); uvBox(g, box); return g; };
  const flat = (shape, box = FULL) => { const g = new THREE.ShapeGeometry(shape, 24); uvBox(g, box); return g; };
  const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; };
  const rb = (w, h, d, r, m, x, y, z) => mesh(new RoundedBoxGeometry(w, h, d, 3, Math.max(0.0005, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4))), m, x, y, z);
  const cyl = (r, h, m, x, y, z, seg = 48) => { const o = mesh(new THREE.CylinderGeometry(r, r, h, seg), m, x, y, z); o.rotation.x = PI / 2; return o; };
  const cvs = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const tex = (w, h, draw, srgb = true) => { const c = cvs(w, h); const x = c.getContext('2d'); draw(x, w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANI; return t; };
  const u2p = (xu, yu) => [(xu + W / 2) * PX, (H / 2 - yu) * PX];
  const brush = (x, w, h, base, n, a) => { x.fillStyle = base; x.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { const y = rand() * h, v = rand() < 0.5 ? 255 : 40; x.strokeStyle = `rgba(${v},${v},${v},${a * (0.4 + rand())})`; x.lineWidth = 0.5 + rand(); x.beginPath(); x.moveTo(rand() * w * 0.4 - 60, y); x.lineTo(w * 0.6 + rand() * w * 0.6, y); x.stroke(); } };
  const TH = Math.round(512 * H / W);
  const logoImg = await new Promise((res) => { const i = new Image(); i.onload = () => { const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'); g.drawImage(i, 0, 0, S, S);
    try { const d = g.getImageData(0, 0, S, S), a = d.data, rad = S / 2 - 2; for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) { const j = (y * S + xx) * 4, r = a[j], gg = a[j + 1], b = a[j + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), sat = mx ? (mx - mn) / mx : 0, L0 = (r + gg + b) / 765, base = L0 > 0.8 ? 255 : Math.round(Math.pow(L0 / 0.8, 1.8) * 255), dist = Math.hypot(xx - S / 2 + 0.5, y - S / 2 + 0.5);
      if (sat > 0.22 && r > b + 30) { const k = Math.min(1, sat / 0.55); a[j] = Math.round(base + (247 - base) * k); a[j + 1] = Math.round(base + (192 - base) * k); a[j + 2] = Math.round(base + (50 - base) * k); } else { a[j] = a[j + 1] = a[j + 2] = base; }
      a[j + 3] = Math.round(255 * Math.min(1, Math.max(0, rad - dist + 0.5))); } g.putImageData(d, 0, 0); } catch (e) {}
    res(c); }; i.onerror = () => res(null); i.src = new URL('assets/se-logo.png', document.baseURI).href; });

  // textures
  const fritTex = tex(512, TH, (x, w, h) => { x.fillStyle = '#060607'; x.beginPath(); x.roundRect(0, 0, w, h, R * PX); x.fill(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, R * PX - 6); x.fill(); x.globalCompositeOperation = 'source-over'; const [cx, cy] = u2p(0, H / 2 - 0.12); x.strokeStyle = '#060607'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 0.024 * PX, 0, PI * 2); x.stroke(); });
  const SCW = 768, SCH = Math.round(SCW * H / W), scrC = cvs(SCW, SCH), scrX = scrC.getContext('2d'), scrTex = new THREE.CanvasTexture(scrC); scrTex.colorSpace = THREE.SRGBColorSpace; scrTex.anisotropy = ANI;
  let scrKey = '';
  const setLS = (x, v) => { try { x.letterSpacing = v; } catch (e) {} };
  const drawLogo = (x, cx, cy, s, a) => { if (!logoImg || a <= 0) return; x.save(); x.globalAlpha *= a; x.shadowColor = 'rgba(247,192,50,.5)'; x.shadowBlur = 40; x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(cx, cy, s / 2, 0, PI * 2); x.fill(); x.shadowBlur = 0; x.drawImage(logoImg, cx - s / 2, cy - s / 2, s, s); x.lineWidth = 4; x.strokeStyle = '#F7C032'; x.beginPath(); x.arc(cx, cy, s / 2 + 4, 0, PI * 2); x.stroke(); x.restore(); };
  const sweep = (x, w, h, k, a = 0.2) => { x.save(); x.beginPath(); x.roundRect(0, 0, w, h, R * PX); x.clip(); const cx = -w * 0.6 + k * w * 2.2, gg = x.createLinearGradient(cx - 120, 0, cx + 120, 60); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(0.5, 'rgba(255,255,255,' + a + ')'); gg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gg; x.translate(cx, h / 2); x.rotate(-0.45); x.fillRect(-120, -h, 240, h * 2); x.restore(); };
  // power-on screen: black OLED, soft warm glow, full-colour logo (drawn in 512-wide space, rendered at 768)
  const drawScreen = (lv, sw, fin) => {
    const on = Math.max(lv, fin), k = on.toFixed(2) + '|' + (sw < 0 ? -1 : sw.toFixed(3)); if (k === scrKey) return; scrKey = k;
    const x = scrX; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = '#030304'; x.fillRect(0, 0, SCW, SCH); x.setTransform(SCW / 512, 0, 0, SCW / 512, 0, 0);
    const w = 512, h = TH; x.textAlign = 'center';
    if (on > 0) {
      x.globalAlpha = on; const g = x.createRadialGradient(w / 2, h * 0.42, 10, w / 2, h * 0.42, w * 0.95); g.addColorStop(0, 'rgba(120,86,20,.55)'); g.addColorStop(0.5, 'rgba(60,44,12,.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      drawLogo(x, w / 2, h * 0.42, 210, 1);
      setLS(x, '6px'); x.fillStyle = '#FFFFFF'; x.font = '600 32px "Space Grotesk", sans-serif'; x.fillText('SAM ELECTRONICS', w / 2 + 3, h * 0.42 + 170);
      setLS(x, '2px'); x.fillStyle = '#F7C032'; x.font = '600 17px "JetBrains Mono", monospace'; x.fillText('QUALITY · WARRANTY · PRICE', w / 2 + 1, h * 0.42 + 206); setLS(x, '0px');
      if (sw >= 0) { x.globalAlpha = 1; sweep(x, w, h, sw, 0.32); }
    }
    x.globalAlpha = 1; x.textAlign = 'left'; scrTex.needsUpdate = true;
  };
  drawScreen(0, -1, 0);
  const streakTex = tex(256, Math.round(256 * H / W), (x, w, h) => { const g = x.createLinearGradient(0, 0, w, h * 0.6); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.32, 'rgba(255,255,255,0)'); g.addColorStop(0.36, 'rgba(255,255,255,.22)'); g.addColorStop(0.42, 'rgba(255,255,255,.05)'); g.addColorStop(0.47, 'rgba(255,255,255,.14)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  const holesF = [[-0.56, 1.36], [0.08, 1.4], [-0.56, 0.36], [0.6, 0.3], [-0.56, -1.33], [0.56, -1.33], [0, -1.4]];
  const midTex = tex(512, TH, (x, w, h) => {
    brush(x, w, h, '#8d9197', 2600, 0.07);
    let [a, b] = u2p(-0.64, 1.42), [c, d] = u2p(0.18, 0.32); x.fillStyle = '#2b2d30'; x.beginPath(); x.roundRect(a, b, c - a, d - b, 10); x.fill();
    x.fillStyle = 'rgba(160,165,170,.55)'; x.font = '600 11px "JetBrains Mono", monospace'; x.fillText('GRAPHITE · DO NOT REMOVE', a + 14, b + 24);
    holesF.forEach(([hx, hy]) => { const [px, py] = u2p(hx, hy); x.strokeStyle = 'rgba(40,42,46,.55)'; x.lineWidth = 3; x.beginPath(); x.arc(px, py, 16, 0, PI * 2); x.stroke(); });
    x.fillStyle = 'rgba(38,40,43,.8)'; x.font = '600 13px "JetBrains Mono", monospace'; let [tx, ty] = u2p(-0.6, -1.12); x.fillText('SE-MF-08 · AL 7000', tx, ty); x.fillText('MADE FOR REPAIR', tx, ty + 18);
    [tx, ty] = u2p(0.38, -1.02); for (let i = 0; i < 14; i++) for (let j = 0; j < 14; j++) if (rand() < 0.5 || i < 3 && j < 3 || i < 3 && j > 10 || i > 10 && j < 3) { x.fillRect(tx + i * 4, ty + j * 4, 4, 4); }
  });
  const amberTex = (vertical) => tex(vertical ? 64 : 512, vertical ? 512 : 64, (x, w, h) => { x.fillStyle = '#b3650f'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(232,170,80,.75)'; for (let i = 6; i < (vertical ? w : h) - 4; i += 9) vertical ? x.fillRect(i, 0, 3, h) : x.fillRect(0, i, w, 3); x.fillStyle = 'rgba(255,220,150,.12)'; vertical ? x.fillRect(0, 0, 8, h) : x.fillRect(0, 0, w, 8); });
  const BX = [-0.66, 0.66, 0.2, 1.42], BP = 1024 / 1.32, BH = Math.round(1.22 * BP);
  const b2p = (xu, yu) => [(xu - BX[0]) * BP, (BX[3] - yu) * BP];
  const boardTex = tex(1024, BH, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#20553b'); g.addColorStop(1, '#153a28'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) { x.fillStyle = `rgba(0,0,0,${rand() * 0.09})`; x.fillRect(rand() * w, rand() * h, 2, 2); }
    x.lineCap = 'round'; x.lineJoin = 'round';
    for (let b = 0; b < 34; b++) { const n = 3 + Math.floor(rand() * 7), sp = 7, sx = rand() * w, sy = rand() * h, L1 = 40 + rand() * 220, L2 = 20 + rand() * 90, L3 = 30 + rand() * 220, dx = rand() < 0.5 ? 1 : -1, dy = rand() < 0.5 ? 1 : -1; x.strokeStyle = rand() < 0.5 ? 'rgba(86,160,114,.55)' : 'rgba(70,140,98,.6)'; x.lineWidth = 2.2; for (let k = 0; k < n; k++) { const o = k * sp; x.beginPath(); x.moveTo(sx, sy + o); x.lineTo(sx + dx * (L1 + o * 0.41), sy + o); x.lineTo(sx + dx * (L1 + o * 0.41 + L2), sy + o + dy * L2); x.lineTo(sx + dx * (L1 + o * 0.41 + L2), sy + o + dy * (L2 + L3)); x.stroke(); } }
    for (let i = 0; i < 650; i++) { const px = rand() * w, py = rand() * h; x.fillStyle = '#c8a95a'; x.beginPath(); x.arc(px, py, 2.6, 0, PI * 2); x.fill(); x.fillStyle = '#1b2a22'; x.beginPath(); x.arc(px, py, 1.1, 0, PI * 2); x.fill(); }
    for (let i = 0; i < 90; i++) { const px = rand() * w, py = rand() * h, ww = 8 + rand() * 26, hh = 6 + rand() * 16; x.strokeStyle = 'rgba(235,238,232,.7)'; x.lineWidth = 1.2; x.strokeRect(px, py, ww, hh); x.fillStyle = '#d6b866'; x.fillRect(px + 1, py + hh / 2 - 2, 4, 4); x.fillRect(px + ww - 5, py + hh / 2 - 2, 4, 4); }
    x.fillStyle = 'rgba(238,240,235,.85)'; x.font = '600 13px "JetBrains Mono", monospace';
    ['C1204', 'R2210', 'U3300', 'L1802', 'J4100', 'C0911', 'FL220', 'U5010', 'TP12', 'TP31', 'Q801', 'D404'].forEach((t) => x.fillText(t, rand() * (w - 60), 20 + rand() * (h - 30)));
    x.font = '700 18px "JetBrains Mono", monospace'; let [px, py] = b2p(-0.62, 0.3); x.fillText('SE-LB-08  REV C', px, py); x.font = '600 13px "JetBrains Mono", monospace'; x.fillText('2026-W41  ·  8L HDI', px, py + 18);
    [[-0.6, 1.36], [0.14, 1.36], [-0.6, 0.27]].forEach(([a, b]) => { const [qx, qy] = b2p(a, b); x.fillStyle = '#d8b862'; x.beginPath(); x.arc(qx, qy, 26, 0, PI * 2); x.fill(); x.fillStyle = '#0d0e0f'; x.beginPath(); x.arc(qx, qy, 15, 0, PI * 2); x.fill(); });
    x.strokeStyle = '#d8b862'; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6);
  });
  const shieldTex = tex(512, 512, (x, w, h) => { brush(x, w, h, '#c6c9cd', 900, 0.08); x.fillStyle = 'rgba(30,32,35,.55)'; for (let i = 0; i < 18; i++) for (let j = 0; j < 6; j++) { x.beginPath(); x.arc(300 + i * 11, 40 + j * 11, 2.6, 0, PI * 2); x.fill(); } x.fillStyle = 'rgba(40,42,46,.6)'; x.font = '700 30px "JetBrains Mono", monospace'; x.fillText('SE', 34, 430); x.font = '600 22px "JetBrains Mono", monospace'; x.fillText('08 · 2026', 34, 466); x.strokeStyle = 'rgba(30,32,35,.35)'; x.lineWidth = 6; x.strokeRect(4, 4, w - 8, h - 8); });
  const chipTex = (t1, t2) => tex(256, 256, (x, w, h) => { x.fillStyle = '#18191b'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.04)'; x.fillRect(0, 0, w, h / 2); x.fillStyle = '#8d9196'; x.font = '700 36px "JetBrains Mono", monospace'; x.fillText(t1, 26, 110); x.font = '600 26px "JetBrains Mono", monospace'; x.fillText(t2, 26, 152); x.beginPath(); x.arc(30, 30, 9, 0, PI * 2); x.fillStyle = '#2b2c2f'; x.fill(); });
  const labelTex = tex(640, 908, (x, w, h) => {
    x.fillStyle = '#121315'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#F2F3F4'; x.font = '700 40px "Space Grotesk", sans-serif'; x.fillText('Li-ion Polymer Battery', 40, 96);
    x.font = '500 25px Inter, sans-serif'; ['Rated capacity  4,820 mAh  ·  18.65 Wh', 'Typical capacity  5,000 mAh', 'Nominal voltage  3.87 V', 'Charge limit  4.45 V'].forEach((t, i) => x.fillText(t, 40, 160 + i * 40));
    x.fillStyle = 'rgba(242,243,244,.25)'; x.fillRect(40, 340, w - 80, 2);
    x.fillStyle = 'rgba(242,243,244,.7)'; x.font = '400 18px Inter, sans-serif'; ['Do not disassemble, puncture, crush or heat above 60 °C.', 'Use only a compatible charger. Do not short-circuit.', 'Replace only with a battery of the same type.', 'Dispose of used batteries according to local rules.'].forEach((t, i) => x.fillText(t, 40, 384 + i * 28));
    x.strokeStyle = '#F2F3F4'; x.lineWidth = 3; x.strokeRect(46, 530, 52, 64); x.beginPath(); x.moveTo(40, 524); x.lineTo(104, 600); x.moveTo(104, 524); x.lineTo(40, 600); x.stroke();
    x.beginPath(); x.moveTo(170, 528); x.lineTo(206, 596); x.lineTo(134, 596); x.closePath(); x.stroke(); x.font = '700 34px Inter, sans-serif'; x.fillStyle = '#F2F3F4'; x.fillText('!', 164, 588);
    x.font = '700 22px "JetBrains Mono", monospace'; x.fillText('Li-ion', 240, 572); x.font = '500 18px "JetBrains Mono", monospace'; x.fillStyle = 'rgba(242,243,244,.7)'; x.fillText('RECYCLE', 240, 598);
    x.fillStyle = '#F7C032'; x.beginPath(); x.arc(w - 100, 600, 58, 0, PI * 2); x.fill(); x.fillStyle = '#1A1B1D'; x.font = '700 22px "Space Grotesk", sans-serif'; x.textAlign = 'center'; x.fillText('TESTED', w - 100, 596); x.font = '600 15px "JetBrains Mono", monospace'; x.fillText('SAM · SE', w - 100, 620); x.textAlign = 'left';
    x.fillStyle = '#F2F3F4'; x.fillRect(40, 700, w - 80, 150); x.fillStyle = '#121315'; let bx = 60; while (bx < w - 70) { const bw = 2 + Math.floor(rand() * 5); x.fillRect(bx, 716, bw, 96); bx += bw + 2 + Math.floor(rand() * 4); }
    x.font = '600 18px "JetBrains Mono", monospace'; x.fillText('SE-BAT-5000 · 2641 · 0815', 60, 838);
  });
  const foilTex = tex(256, 256, (x, w, h) => { brush(x, w, h, '#a9adb3', 600, 0.12); for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(255,255,255,${rand() * 0.25})`; x.lineWidth = 1 + rand() * 3; x.beginPath(); x.moveTo(rand() * w, 0); x.lineTo(rand() * w, h); x.stroke(); } });
  const coilTex = tex(512, 512, (x, w, h) => {
    x.fillStyle = '#17181a'; x.beginPath(); x.roundRect(0, 0, w, h, 40); x.fill();
    x.strokeStyle = '#b8732f'; x.lineWidth = 6; for (let i = 0; i < 3; i++) { x.beginPath(); x.roundRect(14 + i * 10, 14 + i * 10, w - 28 - i * 20, h - 28 - i * 20, 34); x.stroke(); }
    x.lineWidth = 4.2; for (let r = 46; r < 200; r += 7.5) { x.strokeStyle = r % 2 ? '#c8823a' : '#b5702c'; x.beginPath(); x.arc(w / 2, h / 2 + 10, r, 0, PI * 2); x.stroke(); }
    const g = x.createRadialGradient(w * 0.35, h * 0.3, 10, w * 0.35, h * 0.3, 300); g.addColorStop(0, 'rgba(255,230,190,.25)'); g.addColorStop(1, 'rgba(255,230,190,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#c8823a'; x.fillRect(w / 2 - 22, 0, 14, h / 2 - 180); x.fillRect(w / 2 + 8, 0, 14, h / 2 - 180);
  });

  const backGrad = tex(256, 512, (x, w2, h2) => { const g = x.createLinearGradient(0, 0, w2 * 0.35, h2); g.addColorStop(0, '#45474C'); g.addColorStop(0.45, '#33353A'); g.addColorStop(1, '#232428'); x.fillStyle = g; x.fillRect(0, 0, w2, h2); for (let i = 0; i < 2600; i++) { x.fillStyle = 'rgba(255,255,255,' + (rand() * 0.025).toFixed(3) + ')'; x.fillRect(rand() * w2, rand() * h2, 1, 1); } });
  const brushC = tex(256, 256, (x, w2, h2) => { x.fillStyle = '#b9bdc2'; x.fillRect(0, 0, w2, h2); for (let r = 2; r < 128; r += 0.7) { const v = 150 + Math.round(rand() * 105); x.strokeStyle = 'rgba(' + v + ',' + v + ',' + (v + 4) + ',.5)'; x.lineWidth = 0.6; x.beginPath(); x.arc(w2 / 2, h2 / 2, r, 0, PI * 2); x.stroke(); } });
  const emT = (() => { const S = 512, c = cvs(S, S), x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, S, S); if (logoImg) { const t2 = cvs(S, S), y2 = t2.getContext('2d'); y2.drawImage(logoImg, 0, 0, S, S); try { const d = y2.getImageData(0, 0, S, S), a = d.data, o = x.createImageData(S, S); for (let i = 0; i < a.length; i += 4) { const lum = (a[i] + a[i + 1] + a[i + 2]) / 765, v = a[i + 3] > 10 ? Math.round(Math.max(0, Math.min(1, (0.78 - lum) / 0.5)) * 255) : 0; o.data[i] = o.data[i + 1] = o.data[i + 2] = v; o.data[i + 3] = 255; } x.putImageData(o, 0, 0); } catch (e) {} } x.strokeStyle = '#fff'; x.lineWidth = 9; x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 8, 0, PI * 2); x.stroke(); const t = new THREE.CanvasTexture(c); t.anisotropy = ANI; return t; })();
  const islShT = tex(256, 512, (x, w2, h2) => { x.shadowColor = 'rgba(0,0,0,.9)'; x.shadowBlur = 26; x.fillStyle = 'rgba(0,0,0,.9)'; x.beginPath(); x.roundRect(30, 30, w2 - 60, h2 - 60, 60); x.fill(); });
  const std = (o) => new THREE.MeshStandardMaterial(o), phy = (o) => new THREE.MeshPhysicalMaterial(o);
  const M = {
    alu: phy({ color: 0x8a8e94, metalness: 1, roughness: 0.24, clearcoat: 0.55, clearcoatRoughness: 0.16, envMapIntensity: 1.6 }),
    mid: std({ map: midTex, metalness: 0.85, roughness: 0.42 }),
    aluDark: std({ color: 0x55595e, metalness: 1, roughness: 0.42 }),
    antenna: std({ color: 0x2a2b2e, roughness: 0.6 }),
    hole: std({ color: 0x0a0a0b, roughness: 0.85 }),
    glass: phy({ color: 0x15191b, roughness: 0.02, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.01, envMapIntensity: 1.1, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide }),
    glassEdge: phy({ color: 0xe4efec, roughness: 0.03, envMapIntensity: 3, transparent: true, opacity: 0.42, depthWrite: false, clearcoat: 1, clearcoatRoughness: 0 }),
    frit: std({ map: fritTex, transparent: true, roughness: 0.15, depthWrite: false }),
    screen: new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false }),
    black: std({ color: 0x151618, roughness: 0.45, metalness: 0.2 }),
    amber: phy({ map: amberTex(true), roughness: 0.32, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    amberH: phy({ map: amberTex(false), roughness: 0.32, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    gold: std({ color: 0xd8b25c, metalness: 1, roughness: 0.25 }),
    steel: std({ color: 0xd9dcdf, metalness: 1, roughness: 0.22 }),
    pcb: phy({ map: boardTex, roughness: 0.42, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    pcbEdge: std({ color: 0x1a3b2b, roughness: 0.6 }),
    shield: std({ map: shieldTex, metalness: 0.9, roughness: 0.3 }),
    soc: std({ map: chipTex('SE-X8', '2641 A1'), roughness: 0.38, metalness: 0.2 }),
    pmic: std({ map: chipTex('PM-55', '26W41'), roughness: 0.38, metalness: 0.2 }),
    nand: std({ map: chipTex('UFS4', '512G'), roughness: 0.38, metalness: 0.2 }),
    pouch: phy({ color: 0x141517, roughness: 0.38, metalness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
    foil: std({ map: foilTex, metalness: 1, roughness: 0.32 }),
    label: std({ map: labelTex, roughness: 0.48 }),
    lens: phy({ color: 0x05060a, roughness: 0.02, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.01, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [180, 620], envMapIntensity: 2.2 }),
    lensIn: phy({ color: 0x1b2a46, roughness: 0.12, metalness: 0.9 }),
    ring: std({ color: 0xd2d5d9, metalness: 1, roughness: 0.14 }),
    frost: phy({ map: backGrad, color: 0xffffff, roughness: 0.38, metalness: 0.12, clearcoat: 0.75, clearcoatRoughness: 0.2, sheen: 0.15, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.55, envMapIntensity: 1.25 }),
    ringB: std({ map: brushC, color: 0xffffff, metalness: 1, roughness: 0.26 }),
    lensCoat: phy({ color: 0x0a0c12, roughness: 0, metalness: 0, clearcoat: 1, clearcoatRoughness: 0, iridescence: 0.22, iridescenceIOR: 1.5, iridescenceThicknessRange: [300, 480], transparent: true, opacity: 0.2, depthWrite: false, envMapIntensity: 2.6 }),
    flash: phy({ color: 0xe6dcc2, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05 }),
    emblem: phy({ color: 0x2a2c31, roughness: 0.06, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.02, alphaMap: emT, transparent: true, opacity: 0.55, depthWrite: false, envMapIntensity: 1.8 }),
    islSh: new THREE.MeshBasicMaterial({ map: islShT, transparent: true, depthWrite: false, opacity: 0.55 }),
    island: phy({ color: 0x2a2c30, roughness: 0.06, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.02 }),
    coil: std({ map: coilTex, roughness: 0.38, metalness: 0.55, transparent: true }),
    flash: std({ color: 0xf1e5c0, roughness: 0.3, emissive: 0x2a2310 }),
    capA: std({ color: 0xbf9a62, roughness: 0.5 }), capB: std({ color: 0x2a2a2c, roughness: 0.4 }), capC: std({ color: 0x8a6c48, roughness: 0.5 })
  };

  const phone = new THREE.Group();
  const NAMES = ['Screen', 'Frame', 'Flex cables', 'Logic board', 'Battery', 'Cameras', 'Small parts', 'Back glass'];
  const baseZ = [0.059, 0, -0.015, -0.053, -0.016, -0.035, -0.05, -0.066];
  const APER = [], SCREWS = [];
  const L = NAMES.map((n, s) => { const g = new THREE.Group(); g.name = n; g.position.z = baseZ[s]; phone.add(g); return g; });
  const SG = [0.013, -0.013].map((z) => { const g = new THREE.Group(); g.position.z = z; L[0].add(g); return g; });
  const ISL = { x: 0.45, y: 0.95, w: 0.42, h: 1.06, r: 0.2 }, LENS = [[0.45, 1.25, 0.135], [0.45, 0.95, 0.12], [0.45, 0.65, 0.12]];
  const ribbon = (g, pts, wd, z) => { for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], v = Math.abs(x1 - x2) < 1e-6; g.add(rb(v ? wd : Math.abs(x2 - x1) + wd, v ? Math.abs(y2 - y1) + wd : wd, 0.007, 0.003, v ? M.amber : M.amberH, (x1 + x2) / 2, (y1 + y2) / 2, z)); } };
  const b2b = (g, x, y, z, rot = 0) => { const sf = rb(0.24, 0.1, 0.004, 0.0015, M.steel, x, y, z - 0.015); sf.rotation.z = rot; g.add(sf); const a = rb(0.2, 0.075, 0.026, 0.008, M.black, x, y, z); a.rotation.z = rot; g.add(a); const b = rb(0.17, 0.02, 0.006, 0.002, M.gold, x, y, z + 0.015); b.rotation.z = rot; g.add(b); };
  const caps = (g, n, region, z, avoid = []) => { let k = 0, guard = 0; while (k < n && guard++ < n * 30) { const x = region[0] + rand() * (region[1] - region[0]), y = region[2] + rand() * (region[3] - region[2]); if (avoid.some(([a, b, c, d]) => x > a && x < b && y > c && y < d)) continue; const big = rand() < 0.2, w = big ? 0.05 : 0.028, h = big ? 0.028 : 0.016; const m = [M.capA, M.capB, M.capC, M.steel][Math.floor(rand() * 4)]; const c = rb(w, h, 0.016, 0.003, m, x, y, z); if (rand() < 0.5) c.rotation.z = PI / 2; g.add(c); k++; } };

  // 0 · Screen assembly (a) cover glass, printed border, earpiece slot
  { const g = SG[0];
    g.add(mesh(extr(Sh(W - 0.012, H - 0.012, R - 0.006), 0.016, 0.006), [M.glass, M.glassEdge]));
    const f = mesh(flat(Sh(W - 0.01, H - 0.01, R - 0.005)), M.frit, 0, 0, -0.0095); f.castShadow = false; f.renderOrder = 2; g.add(f);
    g.add(rb(0.3, 0.02, 0.004, 0.009, M.black, 0, H / 2 - 0.04, 0.0105));
    const st = mesh(flat(Sh(W - 0.03, H - 0.03, R - 0.015)), phy({ color: 0x000000, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 0, 0.0092); st.castShadow = false; st.renderOrder = 3; g.add(st); }
  // 0 · Screen assembly (b) OLED panel with live screen, punch-hole, flex tail folded behind
  { const g = SG[1];
    g.add(mesh(extr(Sh(W - 0.02, H - 0.02, R - 0.01), 0.018), [M.screen, M.black]));
    g.add(mesh(extr(Sh(W - 0.09, H - 0.32, R - 0.05, 0, 0.1), 0.002), [M.foil, M.foil], 0, 0, -0.0102));
    g.add(mesh(new THREE.RingGeometry(0.016, 0.0225, 40), M.black, 0, H / 2 - 0.12, 0.0095)); g.add(mesh(new THREE.CircleGeometry(0.016, 40), M.lens, 0, H / 2 - 0.12, 0.0097));
    const y0 = -H / 2 + 0.1, tail = new THREE.Shape(); tail.moveTo(-0.17, y0); tail.lineTo(0.17, y0); tail.lineTo(0.17, y0 + 0.14); tail.lineTo(0.31, y0 + 0.18); tail.lineTo(0.31, y0 + 0.5); tail.lineTo(-0.31, y0 + 0.5); tail.lineTo(-0.31, y0 + 0.18); tail.lineTo(-0.17, y0 + 0.14); tail.lineTo(-0.17, y0);
    g.add(mesh(extr(tail, 0.006, 0, [-0.31, 0.31, y0, y0 + 0.5]), [M.amber, M.amberH], 0, 0, -0.0115));
    g.add(rb(0.34, 0.03, 0.02, 0.01, M.amberH, 0, -H / 2 + 0.09, -0.004));
    g.add(rb(0.24, 0.06, 0.004, 0.0015, M.steel, 0, y0 + 0.1, -0.0135)); g.add(rb(0.5, 0.13, 0.004, 0.0015, M.black, 0, y0 + 0.4, -0.0135)); g.add(rb(0.42, 0.04, 0.0015, 0.0005, M.gold, 0, y0 + 0.4, -0.0157)); }
  // 1 · Frame
  { const g = L[1];
    const band = Sh(W - 0.02, H - 0.02, R - 0.01); band.holes.push(Hp(W - 0.085, H - 0.085, R - 0.045));
    g.add(mesh(extr(band, 0.13, 0.012), M.alu));
    const plate = Sh(W - 0.07, H - 0.07, R - 0.035); plate.holes.push(Hp(1.02, 1.5, 0.07, 0, -0.45)); plate.holes.push(Hp(ISL.w, ISL.h, ISL.r, ISL.x, ISL.y)); holesF.forEach(([x, y]) => plate.holes.push(Ci(0.024, x, y)));
    g.add(mesh(extr(plate, 0.012), [M.mid, M.aluDark], 0, 0, 0.025));
    holesF.forEach(([x, y]) => { g.add(cyl(0.038, 0.02, M.aluDark, x, y, 0.012)); g.add(cyl(0.02, 0.008, M.steel, x, y, 0.034, 24)); const sl = rb(0.026, 0.005, 0.003, 0.001, M.hole, x, y, 0.038); g.add(sl); const s2 = sl.clone(); s2.rotation.z = PI / 2; g.add(s2); });
    g.add(rb(0.006, 0.34, 0.044, 0.002, M.aluDark, -W / 2 + 0.008, 0.62, 0)); { const sh = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 16), M.hole, -W / 2 + 0.006, 0.47, 0); sh.rotation.z = PI / 2; g.add(sh); }
    [[-1, 1.12], [-1, -1.12], [1, 1.12], [1, -1.12]].forEach(([sx, y]) => g.add(rb(0.05, 0.024, 0.152, 0.004, M.antenna, sx * (W / 2 - 0.03), y, 0)));
    [[-0.36, 1], [0.38, -1]].forEach(([x, sy]) => g.add(rb(0.024, 0.05, 0.152, 0.004, M.antenna, x, sy * (H / 2 - 0.03), 0)));
    g.add(rb(0.03, 0.46, 0.05, 0.012, M.alu, W / 2 + 0.004, 0.98, 0)); g.add(rb(0.03, 0.26, 0.05, 0.012, M.alu, W / 2 + 0.004, 0.42, 0));
    g.add(rb(0.004, 0.36, 0.06, 0.002, M.aluDark, -W / 2 - 0.003, -0.35, 0));
    g.add(rb(0.3, 0.03, 0.07, 0.014, M.hole, 0, -H / 2, 0));
    for (let i = 0; i < 6; i++) g.add(mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.03, 16), M.hole, 0.3 + i * 0.05, -H / 2 + 0.003, 0));
    for (let i = 0; i < 2; i++) g.add(mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.03, 16), M.hole, -0.32 - i * 0.05, -H / 2 + 0.003, 0)); }
  // 3 · Flex cables
  { const g = L[2], z = 0;
    const cf = new THREE.Shape(); rr(cf, 1.16, 0.26, 0.04, 0, -1.34); g.add(mesh(extr(cf, 0.007, 0, [-0.58, 0.58, -1.47, -1.21]), [M.amberH, M.amberH], 0, 0, z));
    g.add(rb(0.3, 0.1, 0.05, 0.022, M.steel, 0, -1.42, z)); g.add(rb(0.2, 0.03, 0.03, 0.012, M.hole, 0, -1.46, z));
    g.add(cyl(0.04, 0.035, M.steel, -0.34, -1.34, z + 0.02)); g.add(rb(0.12, 0.08, 0.03, 0.008, M.black, 0.36, -1.24, z + 0.016));
    caps(g, 16, [-0.5, 0.5, -1.44, -1.24], z + 0.008, [[-0.2, 0.2, -1.5, -1.36], [-0.4, -0.28, -1.4, -1.28], [0.28, 0.44, -1.3, -1.18]]);
    ribbon(g, [[0.62, -1.22], [0.62, 0.28], [0.06, 0.28]], 0.13, z); b2b(g, 0.02, 0.28, z + 0.016);
    ribbon(g, [[-0.6, -1.22], [-0.6, 0.24], [-0.5, 0.24]], 0.07, z); b2b(g, -0.5, 0.24, z + 0.016);
    const coax = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.69, -1.18, z), new THREE.Vector3(-0.69, -0.4, z), new THREE.Vector3(-0.69, 0.6, z), new THREE.Vector3(-0.685, 1.24, z), new THREE.Vector3(-0.6, 1.38, z)]);
    g.add(mesh(new THREE.TubeGeometry(coax, 60, 0.011, 10), std({ color: 0x5a5d62, roughness: 0.5 })));
    [[-0.69, -1.18], [-0.6, 1.38]].forEach(([x, y]) => g.add(cyl(0.022, 0.02, M.gold, x, y, z))); }
  // 4 · Logic board
  { const g = L[3], t = 0.022, zt = t / 2;
    const bs = new THREE.Shape(); bs.moveTo(-0.66, 0.2); bs.lineTo(0.2, 0.2); bs.lineTo(0.2, 1.42); bs.lineTo(-0.66, 1.42); bs.lineTo(-0.66, 0.2);
    holesF.slice(0, 3).forEach(([x, y]) => bs.holes.push(Ci(0.016, x, y)));
    g.add(mesh(extr(bs, t, 0, BX), [M.pcb, M.pcbEdge]));
    g.add(rb(0.62, 0.5, 0.036, 0.01, M.shield, -0.26, 1.06, zt + 0.018)); g.add(rb(0.34, 0.24, 0.016, 0.006, M.steel, -0.47, 0.6, zt + 0.008)); for (let i = 0; i < 6; i++) g.add(rb(0.026, 0.07, 0.006, 0.002, M.gold, -0.58 + i * 0.044, 0.6, zt + 0.018));
    g.add(rb(0.17, 0.17, 0.02, 0.006, M.pmic, 0.04, 0.66, zt + 0.01)); g.add(rb(0.22, 0.15, 0.022, 0.006, M.nand, -0.22, 0.33, zt + 0.011)); g.add(rb(0.1, 0.1, 0.016, 0.004, M.soc, 0.06, 0.95, zt + 0.008));
    b2b(g, 0.02, 0.28, zt + 0.013); b2b(g, -0.5, 0.24, zt + 0.013); b2b(g, 0.08, 1.3, zt + 0.013, PI / 2);
    g.add(rb(0.16, 0.08, 0.03, 0.006, M.steel, -0.6, 0.86, zt + 0.015));
    caps(g, 40, [-0.64, 0.18, 0.22, 1.4], zt + 0.008, [[-0.6, 0.06, 0.78, 1.34], [-0.64, -0.24, 0.45, 0.76], [-0.05, 0.14, 0.55, 0.77], [-0.35, -0.09, 0.24, 0.42], [-0.62, -0.38, 0.19, 0.3], [-0.1, 0.14, 0.22, 0.34], [0, 0.16, 1.18, 1.42], [-0.7, -0.5, 0.78, 0.95], [0, 0.14, 0.87, 1.03]]);
    [[-0.6, 1.36], [0.14, 1.36], [-0.6, 0.27]].forEach(([x, y]) => { g.add(cyl(0.032, 0.012, M.steel, x, y, zt + 0.006)); const c = rb(0.04, 0.008, 0.004, 0.001, M.aluDark, x, y, zt + 0.013); g.add(c); const c2 = c.clone(); c2.rotation.z = PI / 2; g.add(c2); }); }
  // 4 · Battery — foil seam, black pouch, label, connector, pull tabs
  { const g = L[4];
    g.add(rb(1.03, 1.41, 0.05, 0.04, M.foil, 0, -0.51, -0.008));
    g.add(rb(1.0, 1.38, 0.08, 0.04, M.pouch, 0, -0.51, 0));
    const lb = mesh(new THREE.PlaneGeometry(0.9, 1.26), M.label, 0, -0.51, 0.0405); lb.castShadow = false; g.add(lb);
    g.add(rb(0.36, 0.2, 0.003, 0.002, M.black, 0, -1.24, 0.042)); g.add(rb(0.2, 0.05, 0.004, 0.002, M.amberH, 0, -1.3, 0.044));
    ribbon(g, [[0.36, 0.14], [0.36, 0.3]], 0.12, 0.03); b2b(g, 0.36, 0.3, 0.046);
    const trk = mesh(new THREE.PlaneGeometry(0.72, 0.04), new THREE.MeshBasicMaterial({ color: 0x2a2b2e }), 0, -1.0, 0.0414); trk.castShadow = false; g.add(trk);
    const chg = mesh(new THREE.PlaneGeometry(0.72, 0.04), new THREE.MeshBasicMaterial({ color: 0xf7c032, toneMapped: false }), -0.36, -1.0, 0.0416); chg.geometry.translate(0.36, 0, 0); chg.position.x = -0.36; chg.scale.x = 0.0001; chg.castShadow = false; g.add(chg); g.userData.chg = chg; chg.name = 'chg'; }
  // 5 · Cameras
  { const g = L[5];
    g.add(rb(ISL.w, ISL.h, 0.02, 0.12, M.aluDark, ISL.x, ISL.y, -0.03));
    LENS.forEach(([x, y, r]) => {
      g.add(rb(0.3, 0.29, 0.06, 0.03, M.black, x, y, 0));
      g.add(cyl(r + 0.022, 0.03, M.ring, x, y, 0.042)); g.add(cyl(r, 0.032, M.black, x, y, 0.044));
      { const ap = mesh(new THREE.RingGeometry(r * 0.3, r * 0.55, 40), M.lensIn, x, y, 0.061); APER.push(ap); g.add(ap); }
      const cap = mesh(new THREE.SphereGeometry(r * 1.4, 48, 12, 0, PI * 2, 0, 0.62), M.lens, x, y, 0.06 - r * 1.4 * Math.cos(0.62)); cap.rotation.x = PI / 2; cap.scale.set(1, 0.55, 1); g.add(cap);
    });
    ribbon(g, [[0.3, 0.44], [0.08, 0.44]], 0.1, -0.02); b2b(g, 0.08, 0.44, -0.006);
  }
  // 7 · Back glass
  { const g = L[7];
    const bg = Sh(W - 0.012, H - 0.012, R - 0.006); bg.holes.push(Hp(ISL.w, ISL.h, ISL.r, ISL.x, ISL.y));
    { /* 14 Oct §07 D: the back glass edge is solid (it was see-through with no depth write, so it popped grey/black as the transparent sort order changed while the phone turned) */ const edgeB = phy({ color: 0x8e9298, roughness: 0.22, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }); const bgm = mesh(extr(bg, 0.014, 0.004), [M.frost, edgeB]); bgm.receiveShadow = false; g.add(bgm); }
    const isl = Sh(ISL.w + 0.05, ISL.h + 0.05, ISL.r + 0.025, ISL.x, ISL.y); LENS.forEach(([x, y]) => isl.holes.push(Ci(0.135, x, y)));
    g.add(mesh(extr(isl, 0.024, 0.006), M.island, 0, 0, -0.022));
    LENS.forEach(([x, y]) => { g.add(cyl(0.152, 0.026, M.ringB, x, y, -0.03)); g.add(cyl(0.136, 0.028, M.hole, x, y, -0.03)); const gl = mesh(new THREE.CircleGeometry(0.136, 48), M.lens, x, y, -0.0445); gl.rotation.y = PI; g.add(gl);
      [[0.1, 0.122, M.black, -0.0449], [0.055, 0.082, M.lensIn, -0.0452], [0.03, 0.036, M.ring, -0.0455]].forEach(([r0, r1, mt, z]) => { const rg = mesh(new THREE.RingGeometry(r0, r1, 48), mt, x, y, z); rg.rotation.y = PI; rg.castShadow = false; g.add(rg); });
      const Rd = 0.224, dome = mesh(new THREE.SphereGeometry(Rd, 48, 12, 0, PI * 2, 0, 0.62), M.lensCoat, x, y, -0.0447 + 0.55 * Rd * Math.cos(0.62)); dome.rotation.x = -PI / 2; dome.scale.set(1, 0.55, 1); dome.castShadow = false; dome.renderOrder = 3; g.add(dome); });
    { const sh = mesh(new THREE.PlaneGeometry(ISL.w + 0.2, ISL.h + 0.2), M.islSh, ISL.x, ISL.y - 0.02, -0.0113); sh.rotation.y = PI; sh.castShadow = false; sh.renderOrder = 1; g.add(sh); }
    g.add(cyl(0.046, 0.006, M.ringB, 0.1, 1.22, -0.0125)); { const fl = mesh(new THREE.CircleGeometry(0.036, 40), M.flash, 0.1, 1.22, -0.0157); fl.rotation.y = PI; fl.castShadow = false; g.add(fl); const mc = mesh(new THREE.CircleGeometry(0.011, 24), M.hole, 0.1, 1.07, -0.0113); mc.rotation.y = PI; mc.castShadow = false; g.add(mc); }
    { const em = mesh(new THREE.CircleGeometry(0.2, 72), M.emblem, 0, -0.12, -0.0122); em.rotation.y = PI; em.castShadow = false; em.receiveShadow = false; M.emblem.polygonOffset = true; M.emblem.polygonOffsetFactor = -2; M.emblem.polygonOffsetUnits = -2; em.renderOrder = 2; g.add(em); }
    { const ad = Sh(W - 0.03, H - 0.03, R - 0.015); ad.holes.push(Hp(W - 0.07, H - 0.07, R - 0.035)); const am = mesh(flat(ad), std({ color: 0x0c0c0d, roughness: 0.9 }), 0, 0, 0.0081); am.castShadow = false; g.add(am); }
    const coil = mesh(new THREE.PlaneGeometry(0.88, 0.88), M.coil, 0, -0.32, 0.0115); coil.castShadow = false; g.add(coil); }

  // 6 · Small parts — SIM tray, side buttons, taptic motor, speaker, USB-C port, screws on a clear tray (matte)
  { const g = L[6], mt = std({ color: 0xa4a8ad, metalness: 0.7, roughness: 0.58 }), mk = std({ color: 0x1c1d1f, roughness: 0.82 }), ma = std({ color: 0x686c71, metalness: 0.7, roughness: 0.55 });
    const tray = mesh(extr(Sh(W - 0.06, H - 0.06, R - 0.03), 0.01, 0.003), phy({ color: 0xdfe5ea, roughness: 0.45, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false }), 0, 0, -0.02); g.add(tray);
    const ol = Sh(W - 0.1, H - 0.1, R - 0.05); ol.holes.push(Hp(W - 0.118, H - 0.118, R - 0.059)); g.add(mesh(flat(ol), new THREE.MeshBasicMaterial({ color: 0xd8dde2, transparent: true, opacity: 0.5, depthWrite: false }), 0, 0, -0.0135));
    g.add(rb(0.78, 0.13, 0.014, 0.006, ma, 0, 1.02, -0.006)); g.add(rb(0.5, 0.085, 0.004, 0.002, mk, -0.08, 1.02, 0.002)); g.add(cyl(0.014, 0.016, mk, 0.3, 1.02, -0.004, 20)); g.add(rb(0.05, 0.15, 0.02, 0.008, ma, -0.42, 1.02, -0.004));
    g.add(rb(0.56, 0.07, 0.04, 0.03, ma, -0.18, 0.66, 0)); g.add(rb(0.3, 0.07, 0.04, 0.03, ma, 0.4, 0.66, 0));
    g.add(rb(0.74, 0.3, 0.07, 0.03, mt, 0, 0.14, 0.02)); g.add(rb(0.36, 0.13, 0.003, 0.002, mk, -0.12, 0.14, 0.0565)); g.add(rb(0.16, 0.08, 0.006, 0.002, M.amberH, 0.44, 0.14, -0.006));
    g.add(rb(0.74, 0.26, 0.07, 0.03, mk, 0, -0.42, 0.02)); for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) g.add(cyl(0.011, 0.004, ma, -0.2 + i * 0.05, -0.4 - r * 0.045, 0.056, 12));
    g.add(rb(0.6, 0.2, 0.006, 0.004, M.amberH, 0, -0.98, -0.006)); g.add(rb(0.22, 0.09, 0.06, 0.04, mt, -0.08, -0.98, 0.024)); g.add(rb(0.15, 0.035, 0.064, 0.016, mk, -0.08, -0.98, 0.026)); g.add(rb(0.12, 0.08, 0.02, 0.004, mk, 0.2, -0.98, 0.006));
    [[-0.5, 1.3], [-0.3, 1.3], [-0.1, 1.3], [0.1, 1.3], [0.3, 1.3], [0.5, 1.3], [-0.42, -1.3], [-0.14, -1.3], [0.14, -1.3], [0.42, -1.3]].forEach(([x, y]) => { g.add(cyl(0.03, 0.014, mt, x, y, -0.006, 24)); const sg = new THREE.Group(); sg.position.set(x, y, 0.002); const a = rb(0.036, 0.007, 0.004, 0.001, mk, 0, 0, 0); sg.add(a); const b = a.clone(); b.rotation.z = PI / 2; sg.add(b); g.add(sg); SCREWS.push(sg); }); }
  return { L, NAMES, M, W, H, R, SG, phone, ISL, LENS };
}
