// Studio teardown "The Stack" — modern smartphone, 8 layers (Screen · Frame · Flex · Board · Battery · Cameras · Small parts · Back glass), constant scale, floor-anchored, studio shadows + reflection, finale advert.
// mount(host, state) -> dispose.  state: { p, snap, mob }   Timeline: see Teardown frame map.md
export const T = { rise0: 0.10, rise1: 0.15, pwr0: 0.165, pwr1: 0.185, lay0: 0.19, lay1: 0.26, l0: 0.27, ls: 0.055, ld: 0.05, b8: 0.655, sh0: 0.68, sh1: 0.745, re0: 0.75, rs: 0.0143, st0: 0.852, st1: 0.89, fin0: 0.89 };
export const NAV = 72;
export function layout(w, h, mob) {
  if (mob) { const ppu = Math.min(w / 4.4, h / 4.1), top = 14, floorY = Math.round(h * 0.9); return { mob, ppu, cx: w / 2, fx: w / 2, top, aW: w - 28, floorY, Hs: (floorY - top) * 0.8 }; }
  const ppu = Math.min((h - 60) / 3.3, (w * 0.5) / 3.6), top = NAV + 48, floorY = h - 48;
  // R6 Part D: Arabic mirrors the stage (list on the left, title on the right), so the phone's centre mirrors too
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  return { mob, rtl, ppu, cx: w * (rtl ? 0.475 : 0.525), fx: w * (rtl ? 0.25 : 0.75), top, aW: w * 0.45 - 40, floorY, Hs: Math.min(h * 0.75, floorY - top - 6) };
}
export async function mount(host, state) {
  const THREE = await import('https://esm.sh/three@0.160.0');
  const { RoomEnvironment } = await import('https://esm.sh/three@0.160.0/examples/jsm/environments/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('https://esm.sh/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js');
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) {}
  const PI = Math.PI;
  const canvas = host.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true }); // R6 §05 A: no depth fighting on the back-cover edge at any distance
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5) /* R6 Part A: 1.5× max */);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  const ANI = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envS = new THREE.Scene(); { const room = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.035, 0.036, 0.04), side: THREE.BackSide })); envS.add(room);
    const panel = (wd, ht, rgb, pos) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(wd, ht), new THREE.MeshBasicMaterial({ color: new THREE.Color(...rgb), side: THREE.DoubleSide })); m.position.set(...pos); m.lookAt(0, 0, 0); envS.add(m); };
    panel(9, 6, [7, 7, 6.8], [-7, 9, 8]); panel(5, 9, [1.1, 1.1, 1.15], [11, 0, 4]); panel(1.2, 14, [4.2, 3.4, 2.4], [-8, 2, -10]); panel(1.2, 14, [4.2, 3.4, 2.4], [8, 2, -10]); panel(20, 4, [0.35, 0.35, 0.36], [0, -9, 0]); }
  scene.environment = pmrem.fromScene(envS, 0.02).texture;
  const cam = new THREE.PerspectiveCamera(16, 1, 0.1, 400);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1b1d, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 10; key.shadow.blurSamples = 16; key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 40 });
  scene.add(key); scene.add(key.target);
  const rimL = new THREE.DirectionalLight(0xffffff, 2.4); scene.add(rimL); scene.add(rimL.target);
  const rimR = new THREE.DirectionalLight(0xffe6c4, 2.2); scene.add(rimR); scene.add(rimR.target);
  const fill = new THREE.DirectionalLight(0xe8eef5, 0.7); scene.add(fill); scene.add(fill.target);
  const fxL = new THREE.PointLight(0xffffff, 0, 1, 2), pulseL = new THREE.PointLight(0xfff2d6, 0, 3, 2); scene.add(fxL); scene.add(pulseL);
  const rimY = new THREE.DirectionalLight(0xf7c032, 0.9); scene.add(rimY); scene.add(rimY.target);
  const rimY2 = new THREE.DirectionalLight(0xffdb6e, 0.3); scene.add(rimY2); scene.add(rimY2.target);

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

  const phone = new THREE.Group(); scene.add(phone);
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
  // per-layer material clones: dim + yellow glow without touching shared materials
  L.forEach((g) => g.traverse((m) => { if (!m.isMesh) return; const one = (mt) => { if (mt === M.screen) return mt; const c = mt.clone(); c.userData.base = { c: c.color ? c.color.clone() : null, e: c.envMapIntensity, em: c.emissive ? c.emissive.clone() : null }; return c; }; m.material = Array.isArray(m.material) ? m.material.map(one) : one(m.material); }));
  L.forEach((g) => g.traverse((m) => { if (m.isMesh && (Array.isArray(m.material) ? m.material : [m.material]).some((mt) => mt.transparent)) m.castShadow = false; }));
  const ringGeo = (() => { const s = Sh(W + 0.045, H + 0.045, R + 0.022); s.holes.push(Hp(W + 0.012, H + 0.012, R + 0.006)); return new THREE.ShapeGeometry(s, 24); })();
  const rings = L.map((g) => { const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false })); g.add(m); return m; });
  const YEL = new THREE.Color(0xffd257), WHT = new THREE.Color(0xffffff), GLOW = new THREE.Color(0xf7c032);
  // key-light sweep down the back glass (opening) + one diagonal shine across the front glass (screen lock)
  const vBand = tex(16, 512, (x, w2, h2) => { const g = x.createLinearGradient(0, h2, 0, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.2, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,250,240,.4)'); g.addColorStop(0.8, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w2, h2); });
  const bSweep = new THREE.Mesh(flat(Sh(W - 0.03, H - 0.03, R - 0.015)), new THREE.MeshBasicMaterial({ map: vBand, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0 })); bSweep.rotation.y = PI; bSweep.position.z = -0.0125; bSweep.renderOrder = 4; bSweep.visible = false; L[7].add(bSweep);
  const emG = new THREE.Mesh(new THREE.CircleGeometry(0.2, 72), new THREE.MeshBasicMaterial({ color: 0xfff2d8, alphaMap: emT, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0 })); emG.rotation.y = PI; emG.position.set(0, -0.12, -0.0118); emG.renderOrder = 6; emG.visible = false; L[7].add(emG);
  const dBand = tex(512, 512, (x, w2, h2) => { const g = x.createLinearGradient(0, h2, w2, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.55)'); g.addColorStop(0.55, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w2, h2); });
  const fShine = new THREE.Mesh(flat(Sh(W - 0.03, H - 0.03, R - 0.015)), new THREE.MeshBasicMaterial({ map: dBand, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); fShine.position.z = 0.0115; fShine.renderOrder = 5; fShine.visible = false; SG[0].add(fShine);
  // Issue 1 · C: the screen is crystal glass, never dead: every ~6s a soft vertical band of light sweeps across it, edge to edge
  const hBand = tex(512, 16, (x, w2, h2) => { const g = x.createLinearGradient(0, 0, w2, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.38, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,252,246,.34)'); g.addColorStop(0.62, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w2, h2); });
  const gSweep = new THREE.Mesh(flat(Sh(W - 0.03, H - 0.03, R - 0.015)), new THREE.MeshBasicMaterial({ map: hBand, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0 })); gSweep.position.z = 0.0117; gSweep.renderOrder = 5; gSweep.visible = false; SG[0].add(gSweep);

  // ── Finale commercial: 10s loop rendered live into a high-res render target (lit 3D parts + kinetic type)
  const AW = state.mob ? 680 : 1132, AH = Math.round(AW * H / W), fq = AW / 1132;
  const rt = new THREE.WebGLRenderTarget(AW, AH, { samples: state.mob ? 0 : 4, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
  rt.texture.colorSpace = THREE.SRGBColorSpace; rt.texture.anisotropy = ANI; renderer.localClippingEnabled = true;
  const adS = new THREE.Scene(); adS.environment = scene.environment; adS.background = new THREE.Color(0x050506);
  adS.add(new THREE.HemisphereLight(0xffffff, 0x0c0d0e, 0.35));
  const aKey = new THREE.DirectionalLight(0xffffff, 1.6); aKey.position.set(-3, 5, 6);
  const aRimL = new THREE.DirectionalLight(0xffffff, 3.4); aRimL.position.set(-6, 2, -5);
  const aRimR = new THREE.DirectionalLight(0xfff0d0, 2.8); aRimR.position.set(6, 3, -5);
  const aFill = new THREE.DirectionalLight(0xffffff, 0.9); aFill.position.set(5, -1, 6); [aKey, aRimL, aRimR, aFill].forEach((l) => adS.add(l));
  const adCam = new THREE.PerspectiveCamera(26, AW / AH, 0.05, 80), AD_D = 2.7 / Math.tan((13 * PI) / 180), AD_Y = 0.55;
  const offMat = phy({ color: 0x040506, roughness: 0.06, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.4 });
  const bandTex = (rgb, a) => { const t = tex(512, 16, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(' + rgb + ',0)'); g.addColorStop(0.4, 'rgba(' + rgb + ',0)'); g.addColorStop(0.5, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(0.6, 'rgba(' + rgb + ',0)'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.center.set(0.5, 0.5); t.rotation = 0.5; return t; };
  const addMat = (o) => new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, ...o });
  const parts = L.map((g) => {
    const c = g.clone(true); c.visible = true; c.position.set(0, 0, 0); c.quaternion.identity(); c.scale.setScalar(1);
    const kill = []; c.traverse((m) => { if (!m.isMesh) return; if (m.geometry === ringGeo) kill.push(m); else if (Array.isArray(m.material)) m.material = m.material.map((mt) => (mt === M.screen ? offMat : mt.clone())); else m.material = m.material === M.screen ? offMat : m.material.clone(); });
    kill.forEach((m) => m.parent && m.parent.remove(m));
    c.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(c), ctr = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
    c.position.sub(ctr); const piv = new THREE.Group(); piv.add(c); piv.visible = false; piv.userData = { ctr, s: Math.min(2.7 / sz.y, 1.3 / Math.max(sz.x, 0.2)) }; adS.add(piv); return piv; });
  { const c = phone.clone(true); c.visible = true; c.position.set(0, 0, 0); c.quaternion.identity(); c.scale.setScalar(1); c.children.forEach((g, i) => { g.visible = true; g.position.set(0, 0, baseZ[i] ?? g.position.z); g.quaternion.identity(); g.scale.setScalar(1); });
    const kill = []; c.traverse((m) => { if (!m.isMesh) return; if (m.geometry === ringGeo) kill.push(m); else if (Array.isArray(m.material)) m.material = m.material.map((mt) => (mt === M.screen ? offMat : mt)); else if (m.material === M.screen) m.material = offMat; });
    kill.forEach((m) => m.parent && m.parent.remove(m)); c.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(c), ctr = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
    c.position.sub(ctr); const piv = new THREE.Group(); piv.add(c); piv.visible = false; piv.userData = { ctr, s: Math.min(2.7 / sz.y, 1.3 / Math.max(sz.x, 0.2)), asm: true }; adS.add(piv); parts.asm = piv; }
  // ad helpers: lit screen for the screen scene, camera irises, small-parts pieces that snap into place
  const adScrTex = tex(512, TH, (x, w2, h2) => { x.fillStyle = '#030304'; x.fillRect(0, 0, w2, h2); const g = x.createRadialGradient(w2 / 2, h2 * 0.42, 10, w2 / 2, h2 * 0.42, w2 * 0.95); g.addColorStop(0, 'rgba(120,86,20,.6)'); g.addColorStop(0.5, 'rgba(60,44,12,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w2, h2); x.textAlign = 'center'; drawLogo(x, w2 / 2, h2 * 0.42, 210, 1); setLS(x, '6px'); x.fillStyle = '#FFFFFF'; x.font = '600 32px "Space Grotesk", sans-serif'; x.fillText('SAM ELECTRONICS', w2 / 2 + 3, h2 * 0.42 + 170); setLS(x, '0px'); });
  const adScrMat = new THREE.MeshBasicMaterial({ map: adScrTex, toneMapped: false, color: 0x000000 });
  parts[0].traverse((m) => { if (!m.isMesh) return; if (Array.isArray(m.material)) m.material = m.material.map((mt) => (mt === offMat ? adScrMat : mt)); else if (m.material === offMat) m.material = adScrMat; });
  const apG = new Set(APER.map((m) => m.geometry)), apC = []; parts[5].traverse((m) => { if (m.isMesh && apG.has(m.geometry)) { m.userData.rz0 = m.rotation.z; apC.push(m); } });
  const sm6 = parts[6].children[0].children.map((o) => ({ o, p: o.position.clone(), off: new THREE.Vector3((rand() - 0.5) * 1.8, (rand() - 0.5) * 2.6, 0.3 + rand() * 0.6) }));
  const shG = new THREE.Mesh(flat(Sh(W - 0.03, H - 0.03, R - 0.015)), addMat({ map: bandTex('255,255,255', 0.5) })); shG.rotation.y = PI; shG.position.z = -0.0125; parts[7].children[0].add(shG);
  const shB = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.26), addMat({ map: bandTex('255,205,90', 0.75) })); shB.position.set(0, -0.51, 0.043); parts[4].children[0].add(shB);
  const glintTex = tex(256, 256, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.07, 'rgba(255,250,235,.85)'); g.addColorStop(0.28, 'rgba(255,240,210,.12)'); g.addColorStop(1, 'rgba(255,240,210,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); [[w, 3], [3, h * 0.7]].forEach(([rw, rh]) => { const gg = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(rw, rh) / 2); gg.addColorStop(0, 'rgba(255,255,255,.9)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gg; x.fillRect(w / 2 - rw / 2, h / 2 - rh / 2, rw, rh); }); });
  const mGlint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true, toneMapped: false })); mGlint.visible = false; scene.add(mGlint);
  const glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true, toneMapped: false })); glint.visible = false; adS.add(glint);
  const ovS = new THREE.Scene(), ovC = new THREE.OrthographicCamera(-AW / 2, AW / 2, AH / 2, -AH / 2, -10, 10);
  const ovMat = (o) => new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false, toneMapped: false, ...o });
  const quad = (wq, hq, m, ro, geo) => { const q = new THREE.Mesh(geo || new THREE.PlaneGeometry(wq, hq), m); q.renderOrder = ro; q.visible = false; ovS.add(q); return q; };
  // text sprites (left-aligned), optional mask reveal from below via a clipping plane
  const eo = (x) => { x = Math.min(1, Math.max(0, x)); return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); };
  const eioA = (x) => { x = Math.min(1, Math.max(0, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const FAM = { sg: '"Space Grotesk", sans-serif', mono: '"JetBrains Mono", monospace', in: 'Inter, sans-serif' };
  // R6 Part D: every advert text goes through the site dictionary (Arabic now, French/Spanish later). Arabic letters must
  // join, so Arabic text gets no letter spacing and is drawn right-to-left (numbers inside stay in their own order).
  const TR = (t) => (typeof window !== 'undefined' && window.seI18n && window.seI18n.t ? window.seI18n.t(t) : t), ARB = /[\u0600-\u06FF]/;
  const mkText = (t, o) => { t = TR(t); if (ARB.test(t)) o = { ...o, ls: 0, rtl: true }; const fam = FAM[o.f || 'sg'], wt = o.wt || 700, c0 = cvs(8, 8).getContext('2d'); let sz = Math.round(o.size * fq), mw;
    if (o.rtl) c0.direction = 'rtl';
    for (;;) { c0.font = wt + ' ' + sz + 'px ' + fam; setLS(c0, (o.ls || 0) * sz + 'px'); mw = c0.measureText(t).width; if (mw <= (o.maxW || AW * 0.76) || sz < 18) break; sz -= 2; }
    const pad = Math.ceil(sz * 0.12), cw = Math.ceil(mw + pad * 2), ch = Math.ceil(sz * 1.3);
    const tx = tex(cw, ch, (x) => { x.font = wt + ' ' + sz + 'px ' + fam; setLS(x, (o.ls || 0) * sz + 'px'); x.fillStyle = o.color; if (o.rtl) { x.direction = 'rtl'; x.textAlign = 'left'; } x.fillText(t, pad, Math.round(sz * 0.98)); }); tx.generateMipmaps = false; tx.minFilter = THREE.LinearFilter;
    const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5), m = new THREE.Mesh(new THREE.PlaneGeometry(cw, ch), ovMat({ map: tx, clippingPlanes: [clip] })); m.renderOrder = o.ro || 20; m.visible = false; ovS.add(m);
    return { m, w: cw, h: ch, pad, len: t.length, sz,
      at(xL, yC, a, dy = 0, mask = false, sc = 1) { m.visible = a > 0.002; m.material.opacity = a; m.scale.setScalar(sc); m.position.set(xL - pad + cw / 2 * sc, yC + dy, 0); clip.constant = mask ? -(yC - ch / 2) : 1e5; } }; };
  const mkPill = (label, bg, ink) => { const pw = Math.round(AW * 0.76), ph = Math.round(118 * fq);
    const tx = tex(pw, ph, (x, w, h) => { x.fillStyle = bg; x.beginPath(); x.roundRect(0, 0, w, h, h / 2); x.fill(); x.fillStyle = ink; x.font = '600 ' + Math.round(40 * fq) + 'px ' + FAM.in; x.textBaseline = 'middle'; x.fillText(label, h * 0.42, h / 2 + 1); x.strokeStyle = ink; x.lineWidth = 5 * fq; x.lineCap = 'round'; x.lineJoin = 'round'; const ax = w - h * 0.5, ay = h / 2, s2 = 17 * fq; x.beginPath(); x.moveTo(ax - s2 * 1.4, ay); x.lineTo(ax + s2, ay); x.moveTo(ax + s2 * 0.1, ay - s2 * 0.9); x.lineTo(ax + s2, ay); x.lineTo(ax + s2 * 0.1, ay + s2 * 0.9); x.stroke(); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), ovMat({ map: tx })); m.renderOrder = 22; m.visible = false; ovS.add(m); return { m, w: pw, h: ph }; };
  const mkStatus = (ink) => { const sw2 = AW, sh2 = Math.round(120 * fq), c = cvs(sw2, sh2), x = c.getContext('2d'), tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
    const draw = (lab) => { const w = sw2, h = sh2, mL = w * 0.1, cy = h / 2, u = fq * 1.9; x.clearRect(0, 0, w, h); x.fillStyle = ink; x.strokeStyle = ink; x.font = '600 ' + Math.round(50 * fq) + 'px ' + FAM.in; x.textBaseline = 'middle'; x.fillText(lab, mL, cy + 1);
      const bx = w - mL; x.lineWidth = 2.2 * u; x.globalAlpha = 0.45; x.beginPath(); x.roundRect(bx - 34 * u, cy - 8.5 * u, 30 * u, 17 * u, 5 * u); x.stroke(); x.beginPath(); x.roundRect(bx - 2.5 * u, cy - 3.5 * u, 3 * u, 7 * u, 1.5 * u); x.fill(); x.globalAlpha = 1; x.beginPath(); x.roundRect(bx - 31.5 * u, cy - 6 * u, 21 * u, 12 * u, 3 * u); x.fill();
      const wx = bx - 56 * u, wy = cy + 7 * u; x.lineCap = 'round'; x.lineWidth = 2.6 * u; [14, 9].forEach((r) => { x.beginPath(); x.arc(wx, wy, r * u, -PI * 0.75, -PI * 0.25); x.stroke(); }); x.beginPath(); x.arc(wx, wy - 1.5 * u, 2.6 * u, 0, PI * 2); x.fill();
      for (let i = 0; i < 4; i++) { const hh = (5 + i * 3.6) * u; x.beginPath(); x.roundRect(bx - 102 * u + i * 7.5 * u, cy + 8 * u - hh, 5 * u, hh, 1.2 * u); x.fill(); }
      tx.needsUpdate = true; };
    let lab = ''; const m = new THREE.Mesh(new THREE.PlaneGeometry(sw2, sh2), ovMat({ map: tx })); m.renderOrder = 60; m.position.y = AH / 2 - (0.12 / H) * AH; m.visible = false; ovS.add(m);
    m.userData.tick = () => {}; draw('9:41'); return m; };
  const stDark = mkStatus('#1A1B1D'), stLight = mkStatus('#FFFFFF');
  const LG = 1024, LR = 380, logoTex = tex(LG, LG, (x) => { x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(LG / 2, LG / 2, LR, 0, PI * 2); x.fill(); if (logoImg) x.drawImage(logoImg, LG / 2 - LR, LG / 2 - LR, 2 * LR, 2 * LR); x.lineWidth = 12; x.strokeStyle = '#F7C032'; x.beginPath(); x.arc(LG / 2, LG / 2, LR + 10, 0, PI * 2); x.stroke(); });
  const LGS = AW * 0.62, logoQ = quad(LGS, LGS, ovMat({ map: logoTex }), 5), sweepQ = quad(0, 0, ovMat({ map: bandTex('255,255,255', 0.75), blending: THREE.AdditiveBlending }), 6, new THREE.CircleGeometry(LGS * (LR + 16) / LG, 72));
  // ── the commercial: 11 scenes (~19s), back plate (outline word, streak, shadow) → lit 3D part → kinetic type
  const ovB = new THREE.Scene(); const quadB = (wq, hq, m, ro, geo) => { const q = new THREE.Mesh(geo || new THREE.PlaneGeometry(wq, hq), m); q.renderOrder = ro; q.visible = false; ovB.add(q); return q; };
  const mkOut = (t, col) => { const sz = Math.round(560 * fq), c0 = cvs(8, 8).getContext('2d'); c0.font = '700 ' + sz + 'px ' + FAM.sg; const mw = c0.measureText(t).width, cw = Math.ceil(mw + sz * 0.3), ch = Math.ceil(sz * 1.2);
    const tx = tex(cw, ch, (x) => { x.font = '700 ' + sz + 'px ' + FAM.sg; x.lineWidth = 5 * fq; x.strokeStyle = col; x.strokeText(t, sz * 0.15, sz * 0.95); }); const m = quadB(cw, ch, ovMat({ map: tx }), 2); return { m, w: cw }; };
  const shTex = tex(256, 128, (x, w2, h2) => { const g = x.createRadialGradient(w2 / 2, h2 / 2, 0, w2 / 2, h2 / 2, w2 / 2); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.5, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.save(); x.scale(1, 0.5); x.beginPath(); x.arc(w2 / 2, h2, w2 / 2, 0, PI * 2); x.fill(); x.restore(); });
  const shQ = quadB(AW * 0.62, AW * 0.16, ovMat({ map: shTex }), 3), streak = quadB(AW * 2.2, AH * 0.5, ovMat({ map: bandTex('255,255,255', 0.16), blending: THREE.AdditiveBlending }), 4); streak.rotation.z = 0.55;
  const circ = quad(0, 0, ovMat({ color: 0xffffff }), 45, new THREE.CircleGeometry(1, 96)), cover = quad(AW * 1.2, AH * 1.2, ovMat({ color: 0xffffff }), 46), wipe = quad(AW * 3.2, AH * 1.6, ovMat({ color: 0xffffff }), 46); wipe.rotation.z = 0.42;
  const blurTex = tex(256, 8, (x, w2) => { const g = x.createLinearGradient(0, 0, w2, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.35, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,1)'); x.fillStyle = g; x.fillRect(0, 0, w2, 8); });
  const whipQ = quad(AW * 1.6, AH * 1.2, ovMat({ map: blurTex }), 46);
  const C_Y = '#F7C032', C_G = '#26282B', C_W = '#F2F3F4', INK = '#1A1B1D';
  const SC = [
    { k: 'open', dur: 2.2, bg: '#121315', tr: 'D' },
    { k: 'p', dur: 1.1, bg: C_Y, tr: 'C', L: 0, t: 'SCREENS', sub: 'Bright like day one, every model.', shop: 'Shop screens' },
    { k: 'p', dur: 1.1, bg: C_G, tr: 'C', L: 4, t: 'BATTERIES', sub: 'Full power, fully tested.', shop: 'Shop batteries' },
    { k: 'p', dur: 1.1, bg: C_W, tr: 'C', L: 7, t: 'BACK GLASS', sub: 'Factory finish, every major brand.', shop: 'Shop back glass' },
    { k: 'p', dur: 1.1, bg: C_Y, tr: 'C', L: 5, t: 'CAMERAS', sub: 'Sharp shots, focus tested.', shop: 'Shop cameras' },
    { k: 'p', dur: 1.1, bg: C_G, tr: 'C', L: 2, t: 'FLEX CABLES', sub: 'Charging ports & flex, tested.', shop: 'Shop flex & ports' },
    { k: 'p', dur: 1.1, bg: C_W, tr: 'C', L: 6, t: 'SMALL PARTS', sub: 'The small parts that finish the job.', shop: 'Shop small parts' },
    { k: 'word', dur: 0.35, bg: C_Y, tr: 'C', w: ['EVERY', 'PART.'], col: INK },
    { k: 'word', dur: 0.35, bg: C_G, tr: 'C', w: ['EVERY', 'BRAND.'], col: C_Y },
    { k: 'word', dur: 0.35, bg: C_W, tr: 'C', w: ['ALL IN', 'DEIRA.'], col: INK },
    { k: 'slam', dur: 0.6, bg: C_Y, tr: 'C', w: ['Get yours', 'today.'], col: INK },
    { k: 'close', dur: 3.3, bg: '#1A1B1D', tr: 'C' }];
  let acc = 0; SC.forEach((q) => { q.st = acc; acc += q.dur; }); const TOT = acc, CLOSE = SC[SC.length - 1].st, LOGO_T = CLOSE + 1.6, TXo = 0.22, TXi = 0.3; state.adTOT = TOT; state.adLogoT = LOGO_T;
  const ML0 = -AW / 2 + 18 * (AW / 192), ML = -AW / 2 + AW * 0.12, TOPY = AH / 2 - AH * 0.125, U = 5.4 / AH;
  const kc = (bg) => (bg === C_G ? C_Y : bg === C_Y ? '#3D3E3F' : '#5E6064'), dcol = (bg) => (bg === C_G ? '#D5D7DA' : '#3D3E3F');
  const K5 = AW / 192, PADX = 18 * K5;
  const fitSz = (lines, sz, maxW, fam, wt, ls) => { const c0 = cvs(8, 8).getContext('2d'); let z = sz; for (;;) { c0.font = wt + ' ' + Math.round(z * fq) + 'px ' + fam; setLS(c0, ls * z * fq + 'px'); if (lines.every((t2) => c0.measureText(t2).width <= maxW) || z < 20) return z; z -= 2; } };
  const SZ_T = AW * 0.11 / fq, SZ_S = AW * 0.05 / fq, SZ_D = AW * 0.04 / fq, SZ_B = AW * 0.045 / fq, MX = -AW / 2 + AW * 0.12, CW = AW * 0.76;
  const PAL = { [C_Y]: { ink: INK, sub: INK, d: '#3D3E3F', bb: INK, bi: '#FFFFFF', gl: '#FFF4CC', g0: '#FFD65C', g1: '#F7C032', g2: '#E7A91A' }, [C_G]: { ink: '#FFFFFF', sub: '#E6E7E9', d: '#C9CBCE', bb: C_Y, bi: INK, gl: '#F7C032', g0: '#45474B', g1: '#2C2E31', g2: '#1A1B1D' }, [C_W]: { ink: INK, sub: INK, d: '#5E6064', bb: C_Y, bi: INK, gl: '#F7C032', g0: '#FFFFFF', g1: '#F2F3F4', g2: '#DDE0E3' } };
  const bgT = {}; [C_Y, C_G, C_W].forEach((c) => { const P = PAL[c]; bgT[c] = tex(256, 512, (x, w2, h2) => { const g = x.createRadialGradient(w2 * 0.5, h2 * 0.42, 0, w2 * 0.5, h2 * 0.42, h2 * 0.75); g.addColorStop(0, P.g0); g.addColorStop(0.55, P.g1); g.addColorStop(1, P.g2); x.fillStyle = g; x.fillRect(0, 0, w2, h2); }); });
  const bgQ = quadB(AW * 1.02, AH * 1.02, ovMat({ map: bgT[C_G] }), 0);
  const mkBtn = (label, bg, ink) => { label = TR(label); const pw = Math.round(CW), fz = Math.round(SZ_B * fq), ph = Math.round(fz * 2.4); const tx = tex(pw, ph, (x, w2, h2) => { x.fillStyle = bg; x.beginPath(); x.roundRect(0, 0, w2, h2, h2 / 2); x.fill(); x.fillStyle = ink; x.strokeStyle = ink; x.font = '600 ' + fz + 'px ' + FAM.in; x.textBaseline = 'middle'; x.fillText(label, h2 * 0.42, h2 / 2 + fz * 0.04); x.lineWidth = fz * 0.11; x.lineCap = 'round'; x.lineJoin = 'round'; const ax = w2 - h2 * 0.42, ay = h2 / 2, a = fz * 0.36; x.beginPath(); x.moveTo(ax - a * 1.7, ay); x.lineTo(ax, ay); x.moveTo(ax - a * 0.8, ay - a * 0.8); x.lineTo(ax, ay); x.lineTo(ax - a * 0.8, ay + a * 0.8); x.stroke(); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), ovMat({ map: tx })); m.renderOrder = 22; m.visible = false; ovS.add(m); return { m, w: pw, h: ph }; };
  const wrapL = (t, fz, wt, fam, maxW) => { const c0 = cvs(8, 8).getContext('2d'); c0.font = wt + ' ' + fz + 'px ' + fam; const out = []; let cur = ''; t.split(' ').forEach((wd) => { const tr = cur ? cur + ' ' + wd : wd; if (c0.measureText(tr).width > maxW && cur) { out.push(cur); cur = wd; } else cur = tr; }); if (cur) out.push(cur); return out; };
  const gRT = new THREE.WebGLRenderTarget(Math.round(AW / 8), Math.round(AH / 8), { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false }), silM = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const GT = Array.from({ length: 14 }, (_, i) => ({ q: quadB(AW, AH, ovMat({ color: 0xffffff, alphaMap: gRT.texture }), 1), r: i < 7 ? 0.45 : 1, a: (i % 7) / 7 * PI * 2 + (i < 7 ? 0 : 0.45) })); let glowOn = false;
  const glowY = quadB(1, 1, ovMat({ map: tex(256, 256, (x, w2) => { const g = x.createRadialGradient(w2 / 2, w2 / 2, 0, w2 / 2, w2 / 2, w2 / 2); g.addColorStop(0, 'rgba(255,236,170,.9)'); g.addColorStop(0.4, 'rgba(247,192,50,.35)'); g.addColorStop(1, 'rgba(247,192,50,0)'); x.fillStyle = g; x.fillRect(0, 0, w2, w2); }), blending: THREE.AdditiveBlending }), 8);
  ovB.remove(glowY); ovS.add(glowY);
  let tagO, stmt, fmpP; const drop = (o) => { if (o && o.m) { if (o.m.parent) o.m.parent.remove(o.m); const mp = o.m.material && o.m.material.map; if (mp) mp.dispose(); } };
  const buildAdText = () => {
  SC.forEach((q) => { const P = PAL[q.bg]; [q.T, q.P, q.D, ...(q.S || []), ...(q.W || [])].forEach(drop); q.D = null;
    if (q.k === 'p') { q.T = mkText(q.t, { wt: 700, size: SZ_T, ls: -0.01, color: P.ink, maxW: 1e5 }); q.S = wrapL(TR(q.sub), Math.round(SZ_S * fq), 500, FAM.in, CW).map((t2) => mkText(t2, { f: 'in', wt: 500, size: SZ_S, color: P.sub, maxW: 1e5 })); q.P = mkBtn(q.shop, P.bb, P.bi); }
    if (q.k === 'word' || q.k === 'slam') q.W = q.w.map((t2) => mkText(t2, { wt: 700, size: q.k === 'slam' ? 168 : 210, ls: -0.03, color: q.col, maxW: 1e5 })); });
  const WM = 'SAM ELECTRONICS'.split('').map((c) => mkText(c === ' ' ? '\u00a0' : c, { wt: 600, size: 58, ls: 0, color: '#FFFFFF' }));
  [tagO, stmt, fmpP].forEach(drop);
  tagO = mkText('QUALITY · WARRANTY · PRICE', { f: 'mono', wt: 600, size: 32, ls: 0.1, color: C_Y }); stmt = mkText('All in Deira.', { size: 150, ls: -0.05, color: '#FFFFFF', maxW: AW * 0.8 });
  fmpP = (() => { const pw = Math.round(AW * 0.5), ph = Math.round(110 * fq); const tx2 = tex(pw, ph, (x, w2, h2) => { x.fillStyle = C_Y; x.beginPath(); x.roundRect(0, 0, w2, h2, h2 / 2); x.fill(); x.fillStyle = INK; x.font = '600 ' + Math.round(38 * fq) + 'px ' + FAM.in; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(TR('Find My Part'), w2 / 2, h2 / 2 + 1); }); const m = quad(pw, ph, ovMat({ map: tx2 }), 22); return { m, w: pw, h: ph }; })();
  dKey = ''; };
  const NP = 1400, pPos = new Float32Array(NP * 3), pFrom = [], pTo = [], pDl = [], pDu = [], pSw = [];
  { const cand = []; try { const id = logoTex.image.getContext('2d').getImageData(0, 0, LG, LG).data; for (let y = 0; y < LG; y += 4) for (let x = 0; x < LG; x += 4) { const dd = Math.hypot(x - LG / 2, y - LG / 2), j = (y * LG + x) * 4, lum = (id[j] + id[j + 1] + id[j + 2]) / 765; let wt = 0; if (dd > LR + 3 && dd < LR + 17) wt = 1; else if (dd < LR) wt = lum < 0.6 ? 1 : 0.18; if (wt && Math.random() < wt) cand.push([(x / LG - 0.5) * LGS, (0.5 - y / LG) * LGS]); } } catch (e) {}
    for (let i = cand.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [cand[i], cand[k]] = [cand[k], cand[i]]; }
    for (let i = 0; i < NP; i++) { const c = cand.length ? cand[i % cand.length] : [0, 0], e = Math.random() * 4, u = Math.random() - 0.5, X = AW * 0.56, Y = AH * 0.53; pTo.push([c[0] + (Math.random() - 0.5) * 3, c[1] + (Math.random() - 0.5) * 3]); pFrom.push(e < 1 ? [-X, u * 2 * Y] : e < 2 ? [X, u * 2 * Y] : e < 3 ? [u * 2 * X, Y] : [u * 2 * X, -Y]); const dl = Math.random() * 0.16; pDl.push(dl); pDu.push(0.98 - dl - Math.random() * 0.08); pSw.push((Math.random() < 0.5 ? -1 : 1) * (1.1 + Math.random() * 1.3)); } }
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const dotTex = tex(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(0.4, 'rgba(255,230,170,.6)'); g.addColorStop(1, 'rgba(255,220,150,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
  const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 14 * fq, map: dotTex, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, blending: THREE.AdditiveBlending, toneMapped: false })); pts.renderOrder = 7; pts.visible = false; ovS.add(pts);
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');
  let dKey = ''; buildAdText(); const onAdLang = () => buildAdText(); window.addEventListener('se:lang', onAdLang); const MON = [4, 5, 7, 1, 3], MBG = [C_Y, C_G, C_W, C_Y, C_G]; let monT = [];
  const ensureData = () => { const D2 = state.adData || {}, N2 = D2.N || [], key = JSON.stringify(N2) + '|' + (D2.brands || 0); if (key === dKey) return; dKey = key; const br = D2.brands || 14;
    SC.forEach((q) => { if (q.k !== 'p') return; if (q.D) ovS.remove(q.D.m); q.D = mkText(fmtN(Math.max(1, N2[q.L] || 0)) + ' ' + TR('in stock') + ' · ' + br + ' ' + TR('brands'), { f: 'in', wt: 400, size: SZ_D, color: PAL[q.bg].d, maxW: 1e5 }); }); };
  const bo = (x) => { x = Math.min(1, Math.max(0, x)); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const chgA = parts[4].getObjectByName('chg');
  const LV = new THREE.Vector3(), NV = new THREE.Vector3(), camP = new THREE.Vector3(), camL = new THREE.Vector3(), clA = (x) => Math.min(1, Math.max(0, x)), lp = (a2, b2, k) => a2 + (b2 - a2) * k;
  const placePart = (pv, pxS, pyS, hPx, rx, ry, rz, sc = 1) => { pv.visible = true; pv.position.set(pxS * U, AD_Y + pyS * U, 0); pv.rotation.set(rx, ry, rz); pv.scale.setScalar(pv.userData.s * (hPx * U) / 2.7 * sc); pv.updateMatrixWorld(true); };
  // a text line with in (fast, from a direction) → hold (slow drift) → out (fast)
  const line = (T2, x, y, lt, tIn, tOut, dir) => { const ki = eo((lt - tIn) / 0.25), ko = clA((lt - tOut) / 0.2), drift = (lt - tIn) * 14; if (ki <= 0 || ko >= 1) { T2.m.visible = false; return; }
    const a2 = (1 - ko); let dx = drift, dy = ko * 46, sc = 1, mask = false;
    if (dir === 'L') dx += -AW * 0.5 * (1 - ki); else if (dir === 'R') dx += AW * 0.5 * (1 - ki); else if (dir === 'P') sc = 1 + 0.2 * (1 - ki); else { mask = true; dy += -T2.h * 1.05 * (1 - ki); }
    T2.at(x + dx, y, dir === 'P' ? a2 * clA(ki * 3) : a2, dy, mask && ko === 0, sc); };
  const resetAd = () => { sm6.forEach((s2) => s2.o.position.copy(s2.p)); apC.forEach((m) => { m.scale.setScalar(1); m.rotation.z = m.userData.rz0; }); adScrMat.color.setScalar(0); };
  // hero-style phone ad: eyebrow + 2-line headline · part with backlight glow · stock line · full-width button · progress bar
  const drawP = (q, lt) => { const P = PAL[q.bg]; bgQ.visible = true; bgQ.material.map = bgT[q.bg]; const tz = SZ_T * fq, sz = SZ_S * fq, dz = SZ_D * fq;
    const dir = q.L === 0 ? 1 : q.L === 4 ? 0 : q.L === 7 ? -1 : q.L === 5 ? 0 : q.L === 2 ? -1 : 0, kT = eo(lt / 0.22), kS = eo((lt - 0.04) / 0.24), kB = eo((lt - 0.08) / 0.24);
    const yT = AH / 2 - AH * 0.112 - tz * 0.5; q.T.at(MX, yT, clA(kT * 2.5), dir === 0 ? -tz * 0.35 * (1 - kT) : 0); if (dir !== 0) q.T.m.position.x += dir * AW * 0.35 * (1 - kT);
    let yS = yT - tz * 0.5 - sz * 0.95; q.S.forEach((T2, j) => { T2.at(MX, yS - j * sz * 1.3, clA(kS * 2.5), -18 * fq * (1 - kS)); }); const yS1 = yS - (q.S.length - 1) * sz * 1.3;
    const yB = -AH / 2 + AH * 0.07 + q.P.h / 2, yD = yB + q.P.h / 2 + dz * 1.05; q.P.m.visible = true; q.P.m.material.opacity = clA(kB * 2.5); q.P.m.position.set(0, yB - 20 * fq * (1 - kB), 0);
    if (q.D) q.D.at(MX, yD, clA(kB * 2.5), -14 * fq * (1 - kB));
    const top = yS1 - sz * 0.7 - AH * 0.03, bot = yD + dz * 0.7 + AH * 0.03, cyS = (top + bot) / 2, H0 = Math.min((top - bot) * 0.86, AH * 0.48);
    const ent = eo(lt / 0.32), pv = parts[q.L]; let rx = -0.3, ry = -0.5 + 0.55 * lt, rz = 0.05, px = 0, py = cyS + Math.sin(lt * 3.2) * AH * 0.006, sy = 1, sc = 0.94 + 0.06 * ent;
    if (q.L === 0) { px += AW * 0.6 * (1 - ent); ry = -0.42 + 0.3 * lt; rx = -0.12; adScrMat.color.setScalar(eo((lt - 0.18) / 0.3)); }
    else if (q.L === 4) { py += AH * 0.3 * (1 - bo(clA(lt / 0.35))); rx = -0.28; if (chgA) chgA.scale.x = Math.max(1e-4, eo((lt - 0.25) / 0.6)); }
    else if (q.L === 7) { ry = PI + 0.45 - (1 - eo(lt / 0.6)) * PI * 2 + 0.2 * lt; rx = -0.1; shG.visible = true; shG.material.map.offset.x = lp(0.9, -0.9, clA((lt - 0.35) / 0.55)); }
    else if (q.L === 5) { ry = 0.3 - 0.25 * lt; rx = -0.18; py -= AH * 0.12 * (1 - ent); const fk = clA((lt - 0.12) / 0.75); apC.forEach((m) => { m.scale.setScalar(1 - 0.5 * Math.sin(PI * fk)); m.rotation.z = m.userData.rz0 + fk * 2.4; }); }
    else if (q.L === 2) { sy = Math.max(0.03, eo(lt / 0.4)); rx = -0.3; ry = 0.35 - 0.3 * lt; px -= AW * 0.5 * (1 - ent); }
    else if (q.L === 6) { rx = -0.45; ry = -0.4 + 0.3 * lt; sm6.forEach((s2, i) => { const k = bo(clA((lt - 0.03 - (i % 12) * 0.014) / 0.24)); s2.o.position.copy(s2.p).addScaledVector(s2.off, 1 - k); }); }
    placePart(pv, px, py, H0, rx, ry, rz, sc);
    if (sy < 1) { pv.scale.y *= sy; pv.position.y += (H0 * U / 2) * (1 - sy); pv.updateMatrixWorld(true); }
    glowOn = true; const gc = P.gl, ga = q.bg === C_G ? 0.62 : q.bg === C_Y ? 0.75 : 0.5; const gR = 16 * fq; GT.forEach((o) => { const g = o.q, k = o.r < 1 ? 1.03 : 1.075, a = (o.r < 1 ? 0.2 : 0.09) * ga; g.visible = true; g.material.color.set(gc); g.material.opacity = a * clA(ent * 1.5); g.scale.setScalar(k); g.position.set(px * (1 - k) + Math.cos(o.a) * gR * o.r * 1.6, cyS * (1 - k) + Math.sin(o.a) * gR * o.r * 1.6, 0); });
    shQ.visible = true; shQ.material.opacity = (q.bg === C_G ? 0.6 : 0.32) * ent; shQ.position.set(px, cyS - H0 * 0.53, 0); shQ.scale.set(0.8 + 0.06 * Math.sin(lt * 3), 0.7, 1);
    camP.set(0, AD_Y, AD_D * (1 - 0.03 * clA(lt / q.dur))); camL.set(0, AD_Y, 0);
    if (q.L === 5) { const gk = clA((lt - 0.5) / 0.35); if (gk > 0 && gk < 1) { glint.visible = true; LV.set(LENS[0][0] - 0.06, LENS[0][1] + 0.07, 0.09).sub(pv.userData.ctr); pv.localToWorld(LV); glint.position.copy(LV); glint.scale.setScalar(0.9 * Math.sin(PI * gk)); glint.material.rotation = gk * 1.2; } } };
  const drawWord = (q, lt) => { bgQ.visible = true; bgQ.material.map = bgT[q.bg]; const fz = q.W[0].sz, n = q.W.length, y0 = ((n - 1) * fz * 0.98) / 2 + AH * 0.02;
    if (q.k === 'slam') { const k = eo(lt / 0.14), sc = 1.28 - 0.28 * k + 0.012 * Math.sin(clA((lt - 0.14) / 0.2) * PI); q.W.forEach((T2, j) => T2.at(MX * sc, (y0 - j * fz * 0.98) * sc, clA(k * 3), 0, false, sc)); ovC.zoom = 1 + 0.06 * (1 - k); }
    else q.W.forEach((T2, j) => T2.at(MX, y0 - j * fz * 0.98, 1)); };
  const wordmark = (k, y, a2) => { let tw = 0; const ws = WM.map((T2) => T2.w - 2 * T2.pad); ws.forEach((v) => (tw += v)); const sp = (1 - k) * 34 * fq, tot = tw + sp * (WM.length - 1); let x = -tot / 2; WM.forEach((T2, i) => { T2.at(x, y, a2 * clA(k * 1.4)); x += ws[i] + sp; }); };
  const drawOpen = (lt) => { const sw = clA((lt - 0.15) / 1.3), ly = AH * 0.06; logoQ.visible = true; const lit = eo((sw - 0.1) / 0.8); logoQ.material.color.setScalar(0.1 + 0.9 * lit); logoQ.material.opacity = clA(lt / 0.35); logoQ.scale.setScalar(0.92 + 0.08 * clA(lt / 2.2)); logoQ.position.set(0, ly, 0);
    if (sw > 0 && sw < 1) { sweepQ.visible = true; sweepQ.position.set(0, ly, 0); sweepQ.scale.copy(logoQ.scale); sweepQ.material.map.offset.x = lp(-0.9, 0.9, sw); }
    wordmark(eo((lt - 0.55) / 1.1), ly - LGS * 0.5 - 110 * fq, clA((lt - 0.55) / 0.5)); const tg = clA((lt - 1.2) / 0.5); if (tg > 0) tagO.at(-tagO.w / 2 + tagO.pad, ly - LGS * 0.5 - 200 * fq, tg * 0.9); };
  const drawClose = (lt) => { const ly = AH * 0.06; bgQ.visible = true; bgQ.material.map = bgT[C_G];
    const pa = 1 - clA((lt - 1.02) / 0.12); pts.visible = pa > 0; if (pts.visible) { for (let i = 0; i < NP; i++) { const f = pFrom[i], to = pTo[i], k0 = clA((lt - pDl[i]) / pDu[i]), k = Math.pow(k0, 2.1), bx = lp(f[0], to[0], k), by = lp(f[1], to[1], k) - ly * (1 - k), a = pSw[i] * Math.pow(1 - k, 1.4), ca = Math.cos(a), sa = Math.sin(a), dx2 = bx - to[0], dy2 = by - to[1]; pPos[i * 3] = to[0] + dx2 * ca - dy2 * sa; pPos[i * 3 + 1] = ly + to[1] + dx2 * sa + dy2 * ca; } pGeo.attributes.position.needsUpdate = true; pts.material.opacity = 0.95 * pa; pts.material.size = lp(13, 7, clA(lt / 1.0)) * fq; }
    const la = clA((lt - 0.94) / 0.12); logoQ.visible = la > 0; logoQ.material.color.setScalar(1); logoQ.material.opacity = la; logoQ.position.set(0, ly, 0); logoQ.scale.setScalar(1.04 - 0.04 * eioA(clA((lt - 1.0) / 0.5)));
    const fk = clA((lt - 0.92) / 0.45); if (fk > 0 && fk < 1) { glowY.visible = true; glowY.material.opacity = Math.sin(PI * fk) * 0.9; glowY.scale.setScalar(LGS * (1.3 + 0.5 * fk)); glowY.position.set(0, ly, 0); }
    const sw = clA((lt - 1.45) / 0.75); if (sw > 0 && sw < 1) { sweepQ.visible = true; sweepQ.position.set(0, ly, 0); sweepQ.scale.copy(logoQ.scale); sweepQ.material.map.offset.x = lp(-0.9, 0.9, sw); }
    const wk = eo((lt - 1.5) / 0.7); if (lt > 1.5) wordmark(wk, ly - LGS * 0.5 - 110 * fq, clA((lt - 1.5) / 0.4)); const tg = clA((lt - 1.85) / 0.35); if (tg > 0) tagO.at(-tagO.w / 2 + tagO.pad, ly - LGS * 0.5 - 200 * fq, tg);
    const fo = clA((lt - 2.8) / 0.5); if (fo > 0) { cover.visible = true; cover.material.color.set('#000000'); cover.material.opacity = fo; cover.position.set(0, 0, 0); } };
  const drawMont = (lt) => { const i = Math.min(4, Math.floor(lt / 0.3)), ct = lt - i * 0.3, l = MON[i]; adBg = MBG[i];
    placePart(parts[l], 0, AH * 0.04, AH * 0.68, -0.3 + 0.1 * i, -0.6 + i * 0.5 + ct * 0.8, 0.05, 1 + 0.12 * ct / 0.3);
    const T2 = monT[i]; if (T2) T2.at(-T2.w / 2 + T2.pad, -AH * 0.34, Math.floor(ct / 0.075) % 2 ? 0.55 : 1);
    camP.set(0, AD_Y, AD_D); camL.set(0, AD_Y, 0); const wf = clA((lt - 1.38) / 0.12); if (wf > 0) { cover.visible = true; cover.material.color.set('#FFFFFF'); cover.material.opacity = Math.sin(PI * Math.min(1, wf * 0.999 + 0.001)) > 0 ? wf : 0; cover.position.set(0, 0, 0); } };
  const drawStat = (lt) => { const k = eo(lt / 0.22); stmt.at(-stmt.w / 2 * (1.25 - 0.25 * k) + stmt.pad, AH * 0.02, clA(k * 2), 0, false, 1.25 - 0.25 * k); if (lt < 0.15) { const wf = 1 - lt / 0.15; cover.visible = true; cover.material.color.set('#FFFFFF'); cover.material.opacity = wf; cover.position.set(0, 0, 0); }
    ovC.position.x = lt > 0.18 && lt < 0.32 ? Math.sin(lt * 140) * 6 * fq : 0; };
  let adBg = '#121315', adErr = false;
  const renderAd0 = (t) => {
    ensureData(); t = ((t % TOT) + TOT) % TOT;
    parts.forEach((q) => (q.visible = false)); ovS.children.forEach((o) => (o.visible = false)); ovB.children.forEach((o) => (o.visible = false)); glint.visible = false; shG.visible = shB.visible = false; resetAd();
    ovC.zoom = 1; adCam.zoom = 1; ovC.position.x = 0; cover.material.opacity = 1; circ.material.opacity = 1; whipQ.material.opacity = 1;
    let i = SC.length - 1; for (let k = 0; k < SC.length; k++) if (t < SC[k].st + SC[k].dur) { i = k; break; } const q = SC[i], lt = t - q.st, nx = SC[(i + 1) % SC.length], pv2 = SC[(i + SC.length - 1) % SC.length];
    adBg = q.bg; camP.set(0, AD_Y, AD_D); camL.set(0, AD_Y, 0);
    glowOn = false; if (q.k === 'open') drawOpen(lt); else if (q.k === 'p') drawP(q, lt); else if (q.k === 'word' || q.k === 'slam') drawWord(q, lt); else drawClose(lt);
    // outgoing transition (last TXo s) and incoming settle (first TXi s)
    const ko = lt > q.dur - TXo ? (lt - (q.dur - TXo)) / TXo : -1, ki = lt < TXi ? lt / TXi : -1, nb = nx.bg;
    if (ko >= 0 && q.tr === 'Z') { const z = 1 + 3 * ko * ko; ovC.zoom = z; adCam.zoom = z; circ.visible = true; circ.material.color.set(nb); circ.scale.setScalar(Math.max(1e-3, (AH * 0.75 * ko * ko * ko) / z)); }
    if (ko >= 0 && q.tr === 'H') { whipQ.visible = true; whipQ.material.color.set(nb); whipQ.position.set(lp(AW * 1.4, -AW * 0.1, eo(ko)), 0, 0); ovC.position.x = AW * 0.25 * ko * ko; }
    if (ko >= 0 && q.tr === 'D') { wipe.visible = true; wipe.material.color.set(nb); wipe.position.set(lp(AW * 2.9, 0, eo(ko)), 0, 0); }
    if (ki >= 0 && pv2.tr === 'Z' && q.k !== 'open') { const z = 1 + 0.35 * (1 - eo(ki)); ovC.zoom = z; adCam.zoom = z; }
    if (ki >= 0 && pv2.tr === 'H') { ovC.position.x = -AW * 0.18 * (1 - eo(ki)); }
    if (ki >= 0 && pv2.tr === 'D') { wipe.visible = true; wipe.material.color.set(q.bg); wipe.position.set(lp(0, -AW * 2.9, eo(ki)), 0, 0); }
    if (q.k === 'p' || q.k === 'word' || q.k === 'slam') { (adBg === C_G ? stLight : stDark).visible = true; } else stLight.visible = true;
    ovC.updateProjectionMatrix(); adCam.updateProjectionMatrix(); adCam.position.copy(camP); adCam.lookAt(camL);
    if (glowOn) { const vs = [glint.visible, shG.visible, shB.visible]; glint.visible = shG.visible = shB.visible = false; const bgS = adS.background; adS.background = null; adS.overrideMaterial = silM; renderer.setRenderTarget(gRT); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(adS, adCam); adS.overrideMaterial = null; adS.background = bgS; [glint.visible, shG.visible, shB.visible] = vs; }
    const ccS = renderer.getClearColor(new THREE.Color()), caS = renderer.getClearAlpha(); renderer.setRenderTarget(rt); renderer.setClearColor(adBg, 1); renderer.clear(); const ac = renderer.autoClear; renderer.autoClear = false; renderer.render(ovB, ovC); const bg0 = adS.background; adS.background = null; renderer.render(adS, adCam); adS.background = bg0; renderer.render(ovS, ovC); renderer.autoClear = ac; renderer.setRenderTarget(null); renderer.setClearColor(ccS, caS);
    return i;
  };
  const renderAd = (t) => { if (adErr) return -1; try { return renderAd0(t); } catch (e) { adErr = true; renderer.setRenderTarget(null); console.warn('ad', e && e.message); return -1; } };
  // precompile the commercial's shaders asynchronously so the first frame never stalls; then render 3D chip thumbnails
  let adReady = false;
  const renderThumbs = (TS0, quiet) => { try { resetAd(); const OS = TS0 || 192, TS = Math.min(1024, Math.round(OS * 1.5)), trt = new THREE.WebGLRenderTarget(TS, TS, { samples: 4 }); trt.texture.colorSpace = THREE.SRGBColorSpace; const bg0 = adS.background, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha(); adS.background = null; glint.visible = shG.visible = shB.visible = false;
      const urls = [...parts, parts.asm].map((pv, i) => { parts.forEach((q) => (q.visible = false)); parts.asm.visible = false; pv.visible = true; pv.position.set(0, AD_Y, 0); pv.rotation.set(-0.42, i === 7 ? PI - 0.55 : -0.55, i === 7 ? -0.05 : 0.05); pv.scale.setScalar(pv.userData.s * 1.3); pv.updateMatrixWorld(true);
        adCam.aspect = 1; adCam.updateProjectionMatrix(); adCam.position.set(0, AD_Y, AD_D); adCam.lookAt(0, AD_Y, 0); renderer.setRenderTarget(trt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(adS, adCam);
        const px = new Uint8Array(TS * TS * 4); renderer.readRenderTargetPixels(trt, 0, 0, TS, TS, px); const c = cvs(TS, TS), x = c.getContext('2d'), id = x.createImageData(TS, TS); for (let y = 0; y < TS; y++) id.data.set(px.subarray((TS - 1 - y) * TS * 4, (TS - y) * TS * 4), y * TS * 4); x.putImageData(id, 0, 0); let bx0 = TS, bx1 = 0, by0 = TS, by1 = 0; for (let y = 0; y < TS; y += 2) for (let xx = 0; xx < TS; xx += 2) if (id.data[(y * TS + xx) * 4 + 3] > 12) { if (xx < bx0) bx0 = xx; if (xx > bx1) bx1 = xx; if (y < by0) by0 = y; if (y > by1) by1 = y; } const o = cvs(OS, OS), ox = o.getContext('2d'); ox.imageSmoothingQuality = 'high'; if (bx1 > bx0 && by1 > by0) { const bw = bx1 - bx0 + 2, bh = by1 - by0 + 2, k = Math.min((OS * 0.8) / bh, (OS * 0.66) / bw); ox.drawImage(c, bx0, by0, bw, bh, (OS - bw * k) / 2, OS * 0.9 - bh * k, bw * k, bh * k); } return o.toDataURL('image/png'); });
      { const pv = parts.asm, keyM = new THREE.MeshBasicMaterial({ color: 0xff00ff, toneMapped: false }), swap = (to, from) => pv.traverse((m) => { if (!m.isMesh) return; if (Array.isArray(m.material)) m.material = m.material.map((mt) => (mt === from ? to : mt)); else if (m.material === from) m.material = to; });
        parts.forEach((q) => (q.visible = false)); pv.visible = true; pv.position.set(0, AD_Y, 0); pv.rotation.set(0, 0, 0); pv.scale.setScalar(pv.userData.s * 1.3); pv.updateMatrixWorld(true); adCam.aspect = 1; adCam.updateProjectionMatrix(); adCam.position.set(0, AD_Y, AD_D); adCam.lookAt(0, AD_Y, 0);
        const grab = () => { renderer.setRenderTarget(trt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(adS, adCam); const px = new Uint8Array(TS * TS * 4); renderer.readRenderTargetPixels(trt, 0, 0, TS, TS, px); const c = cvs(TS, TS), x = c.getContext('2d'), id = x.createImageData(TS, TS); for (let y = 0; y < TS; y++) id.data.set(px.subarray((TS - 1 - y) * TS * 4, (TS - y) * TS * 4), y * TS * 4); x.putImageData(id, 0, 0); return { c, id }; };
        const A1 = grab(); swap(keyM, offMat); const A2 = grab(); swap(offMat, keyM); keyM.dispose();
        const bb = (f) => { let x0 = TS, x1 = 0, y0 = TS, y1 = 0; for (let y = 0; y < TS; y++) for (let xx = 0; xx < TS; xx++) if (f((y * TS + xx) * 4)) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; } return [x0, y0, x1 + 1, y1 + 1]; };
        const d1 = A1.id.data, d2 = A2.id.data, P = bb((i) => d1[i + 3] > 12), Q = bb((i) => d2[i] > 200 && d2[i + 1] < 60 && d2[i + 2] > 200);
        const bw = P[2] - P[0], bh = P[3] - P[1], k = (OS * 0.92) / bh, ox0 = (OS - bw * k) / 2, oy0 = OS * 0.04, o = cvs(OS, OS), oc = o.getContext('2d'); oc.imageSmoothingQuality = 'high'; oc.drawImage(A1.c, P[0], P[1], bw, bh, ox0, oy0, bw * k, bh * k);
        urls.push(o.toDataURL('image/png')); state.libFront = { ar: bw / bh, ph: [ox0 / OS, oy0 / OS, (bw * k) / OS, (bh * k) / OS], scr: [(Q[0] - P[0]) / bw, (Q[1] - P[1]) / bh, (Q[2] - Q[0]) / bw, (Q[3] - Q[1]) / bh] }; pv.visible = false; }
      renderer.setRenderTarget(null); renderer.setClearColor(cc, ca); adS.background = bg0; adCam.aspect = AW / AH; adCam.updateProjectionMatrix(); parts.forEach((q) => (q.visible = false)); parts.asm.visible = false; trt.dispose(); if (quiet) return urls; state.thumbs = urls; state.onThumbs && state.onThumbs(urls); return urls; } catch (e) { console.warn('thumbs', e && e.message); } };
  const precompile = () => { ensureData(); const vis = []; [adS, ovS, ovB].forEach((sc) => sc.traverse((o) => { vis.push([o, o.visible]); o.visible = true; })); renderer.setRenderTarget(rt);
    const done = () => { adReady = true; setTimeout(renderThumbs, 50); }; let pr; try { pr = renderer.compileAsync ? Promise.all([renderer.compileAsync(adS, adCam), renderer.compileAsync(ovS, ovC), renderer.compileAsync(ovB, ovC)]) : (renderer.compile(adS, adCam), renderer.compile(ovS, ovC), Promise.resolve()); } catch (e) { pr = Promise.resolve(); }
    renderer.setRenderTarget(null); vis.forEach(([o, v]) => (o.visible = v)); pr.then(done, done); };
  if (!state.shelf) setTimeout(precompile, 1200);
  state.renderLib = (TS) => renderThumbs(TS, true);
  // final-call ad = Template B of the shared phone-ad engine (se-phone-ad.js); 3D renderAd stays as fallback
  let ad2 = null, ad2Cv = null, ad2Tex = null, ad2Wait = 0;
  const ad2Init = () => { if (ad2 || !window.SETdAd) return ad2; const sp = window.seParts, lib = sp && sp.peek && sp.peek(); if (!lib || !lib.large || lib.large.length < 10) { if (sp && !ad2Wait) { ad2Wait = 1; sp.get().catch(() => {}); } return null; }
    const w = state.mob ? 560 : 780; ad2Cv = cvs(w, Math.round((w * AH) / AW)); ad2 = window.SETdAd.create(ad2Cv, { lib, data: state.adData }); ad2Tex = new THREE.CanvasTexture(ad2Cv); ad2Tex.colorSpace = THREE.SRGBColorSpace; ad2Tex.anisotropy = ANI; state.adTOT = ad2.dur; state.adLogoT = ad2.logoT; return ad2; };
  state.ad2Init = ad2Init;
  state.adShot2 = (t) => { if (!ad2Init()) return null; ad2.draw(t); return ad2Cv.toDataURL('image/jpeg', 0.9); };
  state.adShot = (t) => { if (ad2Init()) return state.adShot2(t); renderAd(t); const px = new Uint8Array(AW * AH * 4); renderer.readRenderTargetPixels(rt, 0, 0, AW, AH, px); const c = cvs(AW, AH), x = c.getContext('2d'), id = x.createImageData(AW, AH); for (let y = 0; y < AH; y++) id.data.set(px.subarray((AH - 1 - y) * AW * 4, (AH - y) * AW * 4), y * AW * 4); x.putImageData(id, 0, 0); const o = cvs(Math.round(AW / 2), Math.round(AH / 2)); o.getContext('2d').drawImage(c, 0, 0, o.width, o.height); return o.toDataURL('image/jpeg', 0.9); };


  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible'; host.appendChild(svg);
  const refl = document.createElement('canvas'); refl.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0'; host.insertBefore(refl, canvas); const rx = refl.getContext('2d');
  const shd = document.createElement('canvas'); shd.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'; host.insertBefore(shd, canvas); const sx = shd.getContext('2d');
  const mkS = (t) => document.createElementNS(NS, t), cPath = mkS('path'), cHalo = mkS('circle'), cDot = mkS('circle');
  cPath.setAttribute('fill', 'none'); cPath.setAttribute('stroke', '#F7C032'); cPath.setAttribute('stroke-width', '1.5'); cPath.setAttribute('stroke-linejoin', 'round'); cPath.style.filter = 'drop-shadow(0 0 4px rgba(247,192,50,.7))';
  cHalo.setAttribute('r', '9'); cHalo.setAttribute('fill', 'rgba(247,192,50,.22)'); cDot.setAttribute('r', '4'); cDot.setAttribute('fill', '#F7C032'); cDot.setAttribute('stroke', '#1A1B1D'); cDot.setAttribute('stroke-width', '1.5');
  [cPath, cHalo, cDot].forEach((n) => { n.style.opacity = 0; svg.appendChild(n); }); cPath.setAttribute('pathLength', '1'); cPath.setAttribute('stroke-dasharray', '1 1');
  // Urgent: no sound effects anywhere (the lock click and its audio context are gone)

  const click = () => {};

  let act0 = -2, tAct = 0, liftS = new Array(8).fill(0), zMul = 1, orbS = 0, drawT = 0;
  const clO = Array.from({ length: 3 }, () => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;left:0;top:0;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.1em;color:rgba(255,255,255,.9);white-space:nowrap;pointer-events:none;opacity:0;will-change:transform,opacity'; host.appendChild(d); const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path'); ln.setAttribute('fill', 'none'); ln.setAttribute('stroke', 'rgba(255,255,255,.55)'); ln.setAttribute('stroke-width', '1'); const dt = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dt.setAttribute('r', '2.5'); dt.setAttribute('fill', '#F7C032'); return { d, ln, dt }; });
  const CLP = [[[-0.5, 1.2], [-0.75, 0], [0, -1.3]], [[-0.75, 0.62], [0.75, 0.98], [0, -1.55]], [[0, -1.42], [0.02, 0.28], [-0.69, 0.6]], [[0.06, 0.95], [0.04, 0.66], [-0.22, 0.33]], [[0, -0.2], [0, -1.0], [0.36, 0.3]], [[0.45, 1.25], [0.45, 0.95], [0.45, 0.65]], [[0, 1.02], [0, -0.42], [-0.5, 1.3]], [[0, 0.6], [0, -0.32], [0.45, 0.95]]];
  const SPEC0 = [['OLED · INCELL', 'COVER GLASS', 'TOUCH LAYER'], ['ALUMINIUM', 'SIDE KEYS', 'ANTENNA BANDS'], ['CHARGING PORT', 'BOARD-TO-BOARD', 'COAX LINE'], ['PROCESSOR', 'POWER IC', 'STORAGE'], ['LI-ION', 'CHARGE LEVEL', 'CONNECTOR'], ['WIDE', 'ULTRA WIDE', 'MACRO'], ['SIM TRAY', 'SPEAKER', 'SCREWS'], ['BACK GLASS', 'WIRELESS COIL', 'CAMERA RING']];
  let p = 0, alive = true, visible = true, w = 0, hgt = 0, LY = null, camD = 10, dpr = 1, zMin = 1, zS = 0, upp = 0.01, mx = 0, my = 0, tmx = 0, tmy = 0, adClock = 0, lastT = 0;
  const ray = new THREE.Raycaster(), plane0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), V = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
  const worldAt = (sx, sy, out) => { ray.setFromCamera({ x: (sx / w) * 2 - 1, y: -(sy / hgt) * 2 + 1 }, cam); ray.ray.intersectPlane(plane0, out); return out; };
  const proj = (v) => { V.copy(v).project(cam); return [((V.x + 1) / 2) * w, ((1 - V.y) / 2) * hgt]; };
  const cl = (x) => Math.min(1, Math.max(0, x)), sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
  const eoB = (k) => { k = cl(k); return k >= 1 ? 1 : 1 - Math.pow(2, -10 * k); };
  const eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const ramp = (x) => (x <= 0 ? 0 : x < 0.2 ? 0.72 * (x / 0.2) : Math.min(1, 0.72 + 0.28 * (1 - Math.pow(1 - cl((x - 0.2) / 1.0), 3))));
  let pPrev = 0, oLitG = 1, oRimG = 0, oTrG = 1;
  let pushV = 0, pushA = 0, tShine = -9, tB = -9, bOn0 = false, stK = 0, tFr = -9, pFr = 0; const sepB = new Array(8).fill(0);
  const impact = (lv) => { pushV = Math.max(pushV, lv > 1 ? 1 : 0.6); };
  state.impact = impact;
  const flashD = document.createElement('div'); flashD.style.cssText = 'position:absolute;left:0;top:0;width:10px;height:10px;pointer-events:none;opacity:0;border-radius:40px;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.55) 45%,rgba(255,255,255,0));mix-blend-mode:screen;box-shadow:-2px 0 0 rgba(255,80,80,.35),2px 0 0 rgba(80,160,255,.35)'; 
  const flash = () => { const b2 = bbox(); flashD.style.left = (b2[0] - 30) + 'px'; flashD.style.top = (b2[2] - 30) + 'px'; flashD.style.width = (b2[1] - b2[0] + 60) + 'px'; flashD.style.height = (b2[3] - b2[2] + 60) + 'px'; flashD.animate([{ opacity: 0 }, { opacity: 0.95, offset: 0.25 }, { opacity: 0 }], { duration: 160, easing: 'ease-out' }); };
  const back = (k) => { k = cl(k); const c = 1.25, q = k - 1; return 1 + (c + 1) * q * q * q + c * q * q; };
  const setLook = (g, k, glow) => { const key = k.toFixed(2) + '|' + glow.toFixed(2); if (g.userData.k === key) return; g.userData.k = key; g.traverse((m) => { if (!m.isMesh || rings.includes(m)) return; (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => { const b = mt.userData.base; if (!b) return; if (b.c) mt.color.copy(b.c).multiplyScalar(k); if (b.e != null) mt.envMapIntensity = b.e * k; if (b.em) mt.emissive.copy(b.em).lerp(GLOW, glow * 0.18); }); }); };
  const qLay = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.96, 0, 0)), qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.52), qI = new THREE.Quaternion(), qA = new THREE.Quaternion(), qS = new THREE.Quaternion(), qP = new THREE.Quaternion(), Yax = new THREE.Vector3(0, 1, 0), Xax = new THREE.Vector3(1, 0, 0);
  qLay.premultiply(qYaw);
  const CORN = [[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H / 2], [-W / 2, H / 2]].map(([x, y]) => new THREE.Vector3(x, y, 0)), cv = new THREE.Vector3();
  const OUT = []; [[1, 1, 0], [-1, 1, PI / 2], [-1, -1, PI], [1, -1, PI * 1.5]].forEach(([qx, qy, a0]) => { for (let i = 0; i <= 6; i++) { const a = a0 + (i / 6) * PI / 2; [-0.06, 0.06].forEach((z) => OUT.push(new THREE.Vector3(qx * (W / 2 - R) + Math.cos(a) * R, qy * (H / 2 - R) + Math.sin(a) * R, z))); } });
  const rimClip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e5);
  const sepUp = new Array(8).fill(0), prevDown = new Array(8).fill(0), hovK = new Array(8).fill(0), hovT = new Array(8).fill(0), ghK = new Array(8).fill(1), HC = []; let yawH = 0;
  const setGhost = (g, k) => { const key = k.toFixed(2); if (g.userData.gk === key) return; g.userData.gk = key; const want = k < 0.995; g.traverse((m) => { if (!m.isMesh || rings.includes(m)) return; (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => { const b = mt.userData.g || (mt.userData.g = { t: mt.transparent, o: mt.opacity, d: mt.depthWrite }); const tr = want || b.t; if (mt.transparent !== tr) { mt.transparent = tr; mt.needsUpdate = true; } mt.opacity = b.o * k; mt.depthWrite = want ? false : b.d; }); }); };
  const tag = document.createElement('div'); tag.style.cssText = 'position:absolute;left:0;top:0;display:flex;align-items:center;gap:10px;height:40px;padding:0 14px;border-radius:10px;background:rgba(26,27,29,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(247,192,50,.45),0 12px 28px rgba(0,0,0,.35);color:#FFFFFF;font:500 13px Inter,sans-serif;white-space:nowrap;pointer-events:none;opacity:0;will-change:transform,opacity'; host.appendChild(tag);
  const setCam = (z) => { cam.position.set(0, camD * z * 0.1, camD * z); cam.lookAt(0, 0, 0); cam.updateMatrixWorld(); /* 14 Oct §07 D: depth range hugs the phone (was 0.1–400) for clean, stable edges */ const dd = camD * z, nn = Math.max(0.1, dd - 12), ff = dd + 40; if (Math.abs(cam.near - nn) > 0.05 || Math.abs(cam.far - ff) > 0.5) { cam.near = nn; cam.far = ff; cam.updateProjectionMatrix(); } };
  const bbox = () => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; L.forEach((g) => { if (!g.visible) return; OUT.forEach((c) => { cv.copy(c).applyMatrix4(g.matrixWorld); const [qx, qy] = proj(cv); x0 = Math.min(x0, qx); x1 = Math.max(x1, qx); y0 = Math.min(y0, qy); y1 = Math.max(y1, qy); }); }); return [x0, x1, y0, y1]; };
  const anchor = (x) => { phone.position.set(0, 0, 0); phone.updateMatrixWorld(true); worldAt(x, LY.floorY, A); phone.position.set(A.x, A.y, 0); for (let k = 0; k < 2; k++) { phone.updateMatrixWorld(true); phone.position.y += (bbox()[3] - LY.floorY) * upp; } phone.updateMatrixWorld(true); };
  const pose = (offs, hx) => L.forEach((g, s) => g.position.set(hx ? hx[s] : 0, 0, baseZ[s] + offs[s]));
  const upd = () => { worldAt(w / 2, 0, A); worldAt(w / 2, hgt, B); upp = (A.y - B.y) / hgt; };
  // scale: standing phone = LY.Hs (≈75% vh); the camera only pulls back when the exploded stack needs more room
  const measure = () => { L.forEach((g) => (g.visible = true)); phone.quaternion.copy(qI); pose(L.map(() => 0)); zMin = 1; for (let i = 0; i < 3; i++) { setCam(zMin); upd(); anchor(LY.cx); const b = bbox(); const r = (b[3] - b[2]) / LY.Hs; if (isFinite(r) && r > 0.05 && r < 20) zMin *= r; } zS = 0; };
  const dust = document.createElement('canvas'); dust.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'; host.insertBefore(dust, refl); const dx = dust.getContext('2d');
  const SPR = {}, dSpr = (bk) => { const k = bk ? 'b' : 'n'; if (SPR[k]) return SPR[k]; const mkS = (c) => { const S = 64, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d'), g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); g.addColorStop(0, 'rgba(' + c + ',1)'); g.addColorStop(bk ? 0.25 : 0.42, 'rgba(' + c + ',.78)'); g.addColorStop(1, 'rgba(' + c + ',0)'); x.fillStyle = g; x.fillRect(0, 0, S, S); return cv; }; return (SPR[k] = { w: mkS('255,247,234'), g: mkS('247,196,90') }); };
  const BK = Array.from({ length: 11 }, (_, i) => ({ x: 0.45 + Math.random() * 0.55, y: 0.08 + Math.random() * 0.62, r: 18 + Math.random() * 46, a: 0.035 + Math.random() * 0.045, ph: Math.random() * 6.28 }));
  const DP = Array.from({ length: state.mob ? 90 : 190 }, (_, i) => { const bk = i < (state.mob ? 4 : 9), z = bk ? 1 : Math.random(), g0 = Math.random(), ang = Math.random() * 6.28, sp = (1.5 + Math.random() * 4) * (0.5 + z); return { bk, z, x: Math.random(), y: Math.random(), r: bk ? 2.5 + Math.random() * 2.5 : 0.5 + z * 0.9 + Math.random() * 0.1, a: bk ? 0.03 + Math.random() * 0.03 : 0.1 + z * 0.17 + Math.random() * 0.08, c: [255, Math.round(lerp(255, 238, g0)), Math.round(lerp(255, 222, g0))], vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.7, ph: Math.random() * 6.28, wb: 0.08 + Math.random() * 0.7, tw: 0.7 + Math.random() * 4.5, fv: 0.6 + Math.random() * 3.6, sx: (Math.random() - 0.5) * 3.2, ph2: Math.random() * 6.28 }; });
  let BKD = null; const mkBK = () => { const arr = []; let guard = 0; while (arr.length < 15 && guard++ < 6000) { const r = 20 + Math.pow(Math.random(), 1.2) * 60, x = r + Math.random() * Math.max(1, w - 2 * r), y = hgt * 0.06 + r + Math.random() * Math.max(1, hgt * 0.9 - 2 * r); if (arr.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r + 40)) arr.push({ x, y, r, th: Math.random() * 6.28, om: 0.05 + Math.random() * 0.12, ph: Math.random() * 6.28, v: 4 + (8 * (r - 20)) / 60, a: 0.06 + Math.random() * 0.08, bp: 4 + Math.random() * 2, rim: Math.random() < 0.45, c: [Math.round(lerp(228, 247, Math.random())), Math.round(lerp(150, 192, Math.random())), Math.round(lerp(36, 50, Math.random()))] }); } arr.w = w; arr.h = hgt; return arr; };
  // G16: render density follows the frame rate (window.seQuality from se-perf.js): 2× when smooth, down to 1.25× while it struggles.
  let prWant = Math.min(window.devicePixelRatio || 1, 1.5); // R6 Part A: WebGL at 1.5× max
  const prNow = () => { const q = window.seQuality; return q && q.level < 1 ? Math.max(Math.min(1.25, prWant), +(prWant * (0.55 + 0.45 * q.level)).toFixed(2)) : prWant; };
  const resize = () => { const rw = host.clientWidth, rh = host.clientHeight, pr = prNow(); if (!rw || (rw === w && rh === hgt && LY && LY.mob === !!state.mob && LY.rtl === (document.documentElement.dir === 'rtl') && pr === renderer.getPixelRatio())) return; w = rw; hgt = rh; renderer.setPixelRatio(pr); renderer.setSize(w, hgt, false); dpr = renderer.getPixelRatio(); refl.width = shd.width = dust.width = canvas.width; refl.height = shd.height = dust.height = canvas.height; cam.aspect = w / Math.max(1, hgt); LY = layout(w, hgt, !!state.mob); camD = hgt / (2 * Math.tan((cam.fov * PI) / 360) * LY.ppu); cam.updateProjectionMatrix(); measure(); };
  const hull = (P) => { P.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = []; for (const q of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); } for (let i = P.length - 1; i >= 0; i--) { const q = P[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); } up.pop(); lo.pop(); return lo.concat(up); };
  const OFF = 30000;
  const shade = (pts, a, blur, ox, oy, sc) => { const hp = hull(pts); if (hp.length < 3) return; let cx = 0, cy = 0; hp.forEach((q) => { cx += q[0]; cy += q[1]; }); cx /= hp.length; cy /= hp.length; sx.shadowColor = 'rgba(6,7,8,' + Math.min(1, a).toFixed(3) + ')'; sx.shadowBlur = Math.min(90, Math.max(0.5, blur)) * dpr; sx.shadowOffsetX = OFF; sx.shadowOffsetY = 0; sx.beginPath(); hp.forEach((q, i) => { const X = (cx + (q[0] - cx) * sc + ox) * dpr - OFF, Y = (cy + (q[1] - cy) * sc + oy) * dpr; i ? sx.lineTo(X, Y) : sx.moveTo(X, Y); }); sx.closePath(); sx.fillStyle = '#000'; sx.fill(); };
  const tmp = document.createElement('canvas'), tx2 = tmp.getContext('2d'), lo = document.createElement('canvas'), lx = lo.getContext('2d');
  const onMove = (e) => { tmx = (e.clientX / (window.innerWidth || 1)) * 2 - 1; tmy = (e.clientY / (window.innerHeight || 1)) * 2 - 1; };
  window.addEventListener('pointermove', onMove, { passive: true });
  const tick = () => {
    if (!alive) return; if (document.hidden) setTimeout(tick, 60); else requestAnimationFrame(tick);
    { const r = host.getBoundingClientRect(); visible = r.bottom > 0 && r.top < (window.innerHeight || 1000) && r.width > 0; } if (!visible) return;
    const f0 = performance.now(); try { frame(); window.__tdFt = performance.now() - f0; } catch (e) { if (!window.__tdErr) { window.__tdErr = e.message; console.error('teardown', e); } }
  };
  const frame = () => {
    resize(); if (!LY) return;
    let snapped = false; if (state.snap) { p = state.p; state.snap = false; snapped = true; } else p += (state.p - p) * 0.16;
    const t = performance.now() / 1000, dt = Math.min(0.05, Math.max(0, t - lastT)), mob = LY.mob; lastT = t;
    const rise = sm((p - T.rise0) / (T.rise1 - T.rise0)), pwr = sm((p - T.pwr0) / (T.pwr1 - T.pwr0));
    if (snapped) stK = p >= T.st0 ? 1 : 0; else if (p >= T.st0) stK = Math.min(1, stK + dt / 1.4); else stK = Math.max(0, stK - dt / 0.6); if (state.stKf != null) stK = state.stKf;
    const lay = sm((p - T.lay0) / (T.lay1 - T.lay0)), stand = eio(stK), layK = lay * (1 - stand);
    const GAP = mob ? 0.56 : 0.84; let act = -1;
    const bOn = p >= 0.258; if (bOn && !bOn0) tB = snapped ? t - 9 : t; bOn0 = bOn; const bt = state.burstAt != null ? state.burstAt : t - tB;
    for (let s = 0; s < 8; s++) {
      if (s === 7) { sepUp[s] = 0; continue; }
      const a0 = T.l0 + s * T.ls; sepB[s] = bOn ? ramp(bt - s * 0.022) : snapped ? 0 : sepB[s] * Math.exp(-dt * 9); const up = sepB[s];
      const d0 = T.re0 + (6 - s) * T.rs, dk = cl((p - d0) / (T.rs * 0.92)), down = dk * dk;
      if (p >= a0 && p < a0 + T.ls && p < T.re0) act = s;
      if (down >= 1 && prevDown[s] < 1 && p > d0) { click(); impact(s === 0 ? 2 : 1); if (s === 0) tShine = t; }
      prevDown[s] = down; sepUp[s] = up * (1 - down);
    }
    if (p >= T.b8 && p < T.sh0) act = 7;
    if (state.act != null && state.act >= 0 && p >= T.l0 - 0.02 && p < T.re0) act = state.act;
    pPrev = p;
    const showW = sm((p - T.sh0) / 0.012) * (1 - sm((p - T.sh1 + 0.01) / 0.012)), finW = sm((p - T.fin0) / 0.015);
    const hvS = finW > 0.5 && stK >= 1 && state.hover != null ? state.hover : -1, kE = 1 - Math.exp(-dt * 9), kY = 1 - Math.exp(-dt * 10);
    for (let s = 0; s < 8; s++) { hovT[s] = s === hvS ? Math.min(1, hovT[s] + dt / 0.5) : Math.max(0, hovT[s] - dt / 0.4); hovK[s] = hovT[s]; ghK[s] = 1; }
    let hvM = 0, hvI = -1; hovT.forEach((k, s2) => { if (k > hvM) { hvM = k; hvI = s2; } }); const hvSep = hvI >= 1 ? eio(cl(hvM / 0.8)) : 0; yawH = 0; // the phone never tilts or turns on hover (owner, 13 Oct)
    const offs = sepUp.map((k, s) => (7 - s) * GAP * k + (7 - s) * 18 * upp * hvSep);
    L[6].visible = sepUp[6] > 0.004;
    if (!mob) { mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06; }
    const lifting = p >= T.l0 && p < T.re0;
    if (act !== act0) { act0 = act; tAct = t; drawT = t; }
    const tt = t - tAct, stepOn = lifting && act >= 0;
    qA.copy(qI).slerp(qLay, layK);
    orbS += (((stepOn ? (act % 2 ? 1 : -1) * 0.21 : 0)) - orbS) * 0.035;
    zMul += ((stepOn && tt > 0.15 ? 0.975 : 1) - zMul) * 0.025;
    const oT2 = state.oT == null ? 9 : state.oT, oVis = cl((oT2 - 1.48) / 0.04), oLit = sm((oT2 - 0.3) / 1.4), oRim = 0, oTr = 1, oo = oVis >= 1 && oLit >= 1 ? 1 : 0, roK = oT2 < 3.4 ? 1 - Math.pow(1 - cl((oT2 - 1.5) / 1.2), 3) : 1, ovK = 0, opR = oLit; oLitG = oLit; oRimG = oRim * (1 - oLit); oTrG = oTr;
    const tA = state.tossAt, tossOn = tA != null, backK = tossOn ? 1 - eio(tA / 1.0) : (state.faceBack || p < 0.178 ? 1 : 0), tossH = !tossOn ? 0 : tA < 0.45 ? 1 - Math.pow(1 - tA / 0.45, 3) : tA < 1.15 ? 1 : tA < 1.95 ? 1 - eio((tA - 1.15) / 0.8) : tA < 2.15 ? -(4 / Math.max(1, (LY.floorY - LY.top) * 0.12)) * Math.sin(PI * cl((tA - 1.95) / 0.2)) : 0, turn = PI * backK + (1 - roK) * 0.35 + PI * 2 * stand;
    const yaw = turn + showW * 0.26 * Math.sin(t * 0.55)  + orbS * layK + yawH;
    qS.setFromAxisAngle(Yax, yaw + mx * 0.052); qP.setFromAxisAngle(Xax, my * 0.052); phone.quaternion.copy(qP).multiply(qS).multiply(qA);
    pose(offs);
    // hover: the ONE real phone opens (no clones): screen lifts off the front and slides right 45% W; any other layer slides right 40% W out of the separated stack
    for (let s = 0; s < 8; s++) { const k = hovT[s]; if (k <= 0.001) continue; if (s === 0) { const xk = 1 - Math.pow(2, -10 * k); L[0].position.x += xk * 0.45 * W; L[0].position.z += xk * 0.04 * W; } else { const xs = 1 - Math.pow(2, -10 * k), xk = 1 - Math.pow(2, -10 * cl((k - 0.15) / 0.85)); L[0].position.x -= xs * 0.30 * W; L[s].position.x += xk * 1.05 * W; } } // Screen: the screen slides right; any other part: the screen (still playing) slides LEFT and the part slides out to the RIGHT, behind it in depth order
    // active layer lifts ~20px towards the camera and tilts to show its detail
    { const qi = phone.quaternion.clone().invert(), dirL = V.copy(cam.position).sub(phone.position).normalize().applyQuaternion(qi); L.forEach((g, s2) => { liftS[s2] += ((stepOn && s2 === act ? 1 : 0) - liftS[s2]) * 0.09; if (stK > 0 && stK < 1) liftS[s2] = 0; const k = liftS[s2]; g.position.addScaledVector(dirL, k * 20 * upp); g.rotation.set(-0.07 * k, 0.05 * k, 0); }); }
    phone.scale.setScalar(1);
    const upK = sm(Math.max(...sepUp.map((k, s2) => ((7 - s2) * k) / 7)) * 1.4), CX = lerp(LY.cx, LY.fx, stand); let b, zT = zS || zMin;
    let zF = zT; for (let it = 0; it < 3; it++) { setCam(zT); upd(); anchor(CX); b = bbox(); const r2 = Math.max((b[3] - b[2]) / ((LY.floorY - LY.top) * lerp(0.96, 0.98, stand)), (b[1] - b[0]) / LY.aW); if (isFinite(r2) && r2 > 0.01) { zF = zT * r2; zT = lerp(Math.max(zMin, zF), zF, upK); } }
    zS = !zS || state.snapZ ? zT : zS + (zT - zS) * 0.12; state.snapZ = false;
    pushV *= Math.exp(-dt * 3.2); pushA += (pushV - pushA) * (1 - Math.exp(-dt * 10));
    { const inh = Math.sin(PI * cl((p - 0.236) / 0.03)); setCam(Math.max(zS * zMul * (1 + 0.03 * inh) * (1 - 0.018 * pushA), zF * 0.985)); } upd(); anchor(CX); b = bbox(); phone.position.x += (CX - (b[0] + b[1]) / 2) * upp; phone.position.y += 0.5 * (1 - rise) * zS + Math.sin(t * 0.7) * 3 * upp * layK - ((1 - roK) * LY.Hs * 1.08 - ovK * 4) * upp + (tossH * (LY.floorY - LY.top) * 0.12) * upp; if (tossH > 0.001 && tossH <= 1) { const Hp = b[3] - b[2], cY = (b[2] + b[3]) / 2, off = tossH * (LY.floorY - LY.top) * 0.12, ks = Math.min(1, (2 * (cY - off - LY.top - 6)) / Hp); if (ks < 1) phone.scale.setScalar(Math.max(0.6, ks)); } phone.updateMatrixWorld(true); C.copy(phone.position);
    canvas.style.opacity = (rise * oVis).toFixed(3); shd.style.opacity = (rise * opR * opR).toFixed(3); 
    L.forEach((g, s) => {
      const on = s === act, hk = s === hvI ? hvM : 0, done = lifting && !on && (s < act || (act === -1 && p >= T.sh0));
      const dim = (stepOn ? (on ? 1 : 0.7) : p >= T.sh0 && p < T.re0 ? 0.92 : 1) * (hvI >= 1 && s !== hvI ? 1 - 0.3 * hvM : 1);
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);
      setLook(g, dim * (0.03 + 0.97 * oLitG), on ? 0.55 + 0.35 * pulse : hk * 0.3); setGhost(g, ghK[s]);
      const d0 = T.re0 + (6 - s) * T.rs + T.rs * 0.92, spark = s < 7 && p > T.re0 ? Math.max(0, 1 - Math.abs(p - d0) / 0.006) : 0;
      const ghost = (lifting || (p >= T.re0 && sepUp[s] > 0.02)) && !on ? 0.16 * (1 - sm((p - T.re0) / 0.06)) : 0;
      const rm = rings[s].material, ro = on ? 0.75 + pulse * 0.2 : Math.max(spark * 0.9, ghost, hk * 0.85);
      const sil = oRimG * 0.5; rm.color.copy((on || hk > 0.05 || spark > ghost) && sil < 0.05 ? YEL : WHT); rm.opacity = Math.max(ro, sil); rings[s].visible = rm.opacity > 0.005; if (!rm.clippingPlanes || rm.clippingPlanes[0] !== rimClip) { rm.clippingPlanes = [rimClip]; rm.needsUpdate = true; }
    });
    if (p >= 0.18 && pFr < 0.18) tFr = t; pFr = p; const fk = cl((tt - 0.3) / 1.5), flick = stepOn && act === 0 && fk > 0 && fk < 1 ? Math.sin(PI * fk) * (Math.sin(fk * 47) > -0.2 ? 0.75 : 0.25) : 0;
    const tA2 = state.tossAt, tG = tA2 == null ? (p < 0.17 ? 0 : 1) : sm((tA2 - 1.95) / 0.3); const scr = Math.max(pwr * tG * (1 - sm((p - T.lay1 - 0.004) / 0.008)), flick), swk0 = tA2 == null ? -1 : (tA2 - 1.95) / 0.3, sw = p >= 0.17 && p < T.lay1 && swk0 >= 0 && swk0 < 1 ? swk0 : -1;
    const adOn = !!state.adGo && adReady && !adErr && finW > 0.98 && stK >= 1;
    if (adOn) {
      if (state.adT != null) { adClock = state.adT; state.adT = null; }
      const A2 = ad2Init(), TT = A2 ? A2.dur : TOT, LT = A2 ? A2.logoT : LOGO_T;
      const prev = adClock % TT; adClock += dt; const at = adClock % TT; if (prev < LT && at >= LT) window.dispatchEvent(new CustomEvent('se:td-logo'));
      if (A2) { try { A2.draw(at); ad2Tex.needsUpdate = true; } catch (e) { if (!window.__adErr) { window.__adErr = e.message; console.warn('ad2', e); } } if (M.screen.map !== ad2Tex) { M.screen.map = ad2Tex; M.screen.needsUpdate = true; } }
      else { try { renderAd(at); } catch (e) { if (!window.__adErr) { window.__adErr = e.message; console.warn('ad', e); } }
      if (M.screen.map !== rt.texture) { M.screen.map = rt.texture; M.screen.needsUpdate = true; } }
    } else { adClock = 0; if (M.screen.map !== scrTex) { M.screen.map = scrTex; M.screen.needsUpdate = true; } try { drawScreen(finW > 0 ? 0 : scr, finW > 0 ? -1 : sw, finW); } catch (e) {} }
    { const gl = SG[0].children[0].material[0]; gl.opacity = 0.14 * (1 - 0.88 * Math.max(finW, scr)) * ghK[0]; }
    key.position.set(C.x - 4, C.y + 8, 5); key.target.position.copy(C); rimL.position.set(C.x - 6, C.y + 2, -5); rimL.target.position.copy(C); rimR.position.set(C.x + 5, C.y + 4, -6); rimR.target.position.copy(C); fill.position.set(C.x + 7, C.y - 1, 3); fill.target.position.copy(C);
    key.intensity = 2.5 * (1 + 0.03 * Math.sin((t * PI * 2) / 6));
    [rimL, rimR].forEach((l) => { if (l.userData.b == null) l.userData.b = l.intensity; l.intensity = l.userData.b * (0.25 + 0.75 * Math.max(oRimG > 0 ? 1 : 0, oLitG)) * (oLitG < 1 ? 1.6 - 0.6 * oLitG : 1); });
    { const sm2 = M.screen; if (sm2.userData.c0 == null) { sm2.userData.c0 = sm2.color.clone(); sm2.userData.ei = sm2.emissiveIntensity == null ? 1 : sm2.emissiveIntensity; } const kS = oLitG * oLitG; sm2.color.copy(sm2.userData.c0).multiplyScalar(0.02 + 0.98 * kS); if (sm2.emissiveIntensity != null) sm2.emissiveIntensity = sm2.userData.ei * kS; }
    key.position.x -= (1 - oLitG) * 9; key.intensity *= 0.02 + 0.98 * oLitG; fill.intensity = (fill.userData.b == null ? (fill.userData.b = fill.intensity) : fill.userData.b) * (0.05 + 0.95 * oLitG);
    rimClip.constant = oTrG < 1 ? -(C.y + (H / 2 + 0.05) * (1 - 2 * oTrG) - 0.05) * -1 : 1e5; if (oTrG < 1) { rimClip.normal.set(0, 1, 0); rimClip.constant = -(C.y + (H / 2 + 0.1) - (H + 0.2) * oTrG); } else { rimClip.normal.set(0, -1, 0); rimClip.constant = 1e5; }
    { fxL.intensity = 0; mGlint.visible = false; const k = fk, bell = Math.sin(PI * k), W2 = (x, y, z, g) => g.localToWorld(V.set(x, y, z));
      if (stepOn && k > 0 && k < 1) {
        if (act === 1) { const per = 2 * (W + H), d = k * per; let x, y; if (d < W) { x = -W / 2 + d; y = H / 2; } else if (d < W + H) { x = W / 2; y = H / 2 - (d - W); } else if (d < 2 * W + H) { x = W / 2 - (d - W - H); y = -H / 2; } else { x = -W / 2; y = -H / 2 + (d - 2 * W - H); } fxL.position.copy(W2(x * 1.04, y * 1.03, 0.12, L[1])); fxL.color.setHex(0xfff4e0); fxL.distance = 0.9 * zS; fxL.intensity = 7 * bell; }
        else if (act === 2) { const P2 = [[0.62, -1.22], [0.62, 0.28], [0.06, 0.28]], l1 = 1.5, l2 = 0.56, d = k * (l1 + l2), q = d < l1 ? [0.62, -1.22 + d] : [0.62 - (d - l1), 0.28]; fxL.position.copy(W2(q[0], q[1], 0.05, L[2])); fxL.color.setHex(0xffd257); fxL.distance = 0.45 * zS; fxL.intensity = 9 * bell; }
        else if (act === 3) { fxL.position.copy(W2(0.06, 0.95, 0.07, L[3])); fxL.color.setHex(0xd6ff9a); fxL.distance = (0.12 + 1.3 * k) * zS; fxL.intensity = 6 * (1 - k); }
        else if (act === 7) { fxL.position.copy(W2(lerp(-1.1, 1.1, k), lerp(1.2, -1.2, k), 0.45, L[7])); fxL.color.setHex(0xffffff); fxL.distance = 1.6 * zS; fxL.intensity = 8 * bell; }
        else if (act === 5) { const gk = cl((k - 0.55) / 0.4); if (gk > 0 && gk < 1) { mGlint.visible = true; mGlint.position.copy(W2(LENS[0][0] - 0.06, LENS[0][1] + 0.06, 0.09, L[5])); mGlint.scale.setScalar(0.5 * zS * Math.sin(PI * gk)); mGlint.material.rotation = gk; } } }
      const ak = act === 5 && stepOn ? Math.sin(PI * cl(k / 0.6)) : 0; APER.forEach((m) => m.scale.setScalar(1 - 0.45 * ak));
      const chg = L[4].userData.chg; if (chg) chg.scale.x = act === 4 && stepOn ? Math.max(1e-4, 1 - Math.pow(1 - cl(k / 0.9), 3)) : 1e-4;
      const sq = act === 6 && stepOn ? (PI / 2) * (1 - Math.pow(1 - cl(k / 0.8), 3)) : 0; SCREWS.forEach((g) => (g.rotation.z = sq));
      { const sk = oT2 < 3.4 ? cl((oT2 - 1.68) / 1.45) : 0, tk = 1 - backK; bSweep.visible = sk > 0 && sk < 1; if (bSweep.visible) { bSweep.material.opacity = Math.sin(PI * sk) * 0.85; vBand.offset.y = lerp(-0.6, 0.6, sk); } else if (tk > 0.01 && tk < 0.99) { bSweep.visible = true; bSweep.material.opacity = Math.sin(PI * tk) * 0.6; vBand.offset.y = lerp(0.6, -0.6, tk); }
        { const g1 = sk > 0 && sk < 1 ? Math.exp(-Math.pow((sk - 0.64) / 0.08, 2)) * 0.5 : 0, g2 = tk > 0.01 && tk < 0.99 ? Math.exp(-Math.pow((tk - 0.45) / 0.1, 2)) * 0.35 : 0, gg = Math.max(g1, g2); emG.visible = gg > 0.005; emG.material.opacity = gg; }
        if (oT2 < 3.4) for (let i = 0; i < 3; i++) { const gk = cl((oT2 - 2.23 - i * 0.18) / 0.3); if (gk > 0 && gk < 1) { mGlint.visible = true; mGlint.position.copy(phone.localToWorld(V.set(LENS[i][0], LENS[i][1], -0.13))); mGlint.scale.setScalar(0.38 * zS * Math.sin(PI * gk)); mGlint.material.rotation = gk * 0.8; } }
        { const gk2 = ((t % 6) - 4.6) / 1.4; gSweep.visible = backK < 0.5 && gk2 > 0 && gk2 < 1; if (gSweep.visible) { hBand.offset.x = lerp(0.62, -0.62, eio(gk2)); gSweep.material.opacity = Math.sin(PI * gk2); } }
        const shk = state.shineK != null ? state.shineK : (t - tShine) / 0.35; fShine.visible = shk >= 0 && shk < 1; if (fShine.visible) { const o2 = lerp(0.65, -0.65, shk); dBand.offset.set(o2, o2); fShine.material.opacity = Math.sin(PI * shk); } }
      const pk = cl(tt / 0.7); pulseL.intensity = stepOn && pk < 1 ? 5 * Math.sin(PI * pk) : 0; if (pulseL.intensity > 0) { pulseL.position.copy(W2(0, 0, lerp(baseZ[7] + offs[7], baseZ[0] + offs[0], pk) + 0.2, phone)); pulseL.distance = 2.2 * zS; } } rimY.position.set(C.x + 6, C.y + 3, -4); rimY.target.position.copy(C); rimY2.position.set(C.x + 5, C.y - 4, 3); rimY2.target.position.copy(C);
    renderer.render(scene, cam);
    // text knockout: title letters over the phone become outline-only (solid layer clipped around the phone, outline layer clipped to it)
    if (!mob) { const root2 = host.parentElement, kS = root2 && root2.querySelector('[data-ko="s"]'), kO = root2 && root2.querySelector('[data-ko="o"]');
      if (kS && kO) { let cs = 'none', co = 'polygon(0 0,0 0,0 0)';
        if ((state.koOn != null ? state.koOn : oT2 < 3.4) && rise * oVis > 0.01) { const P = []; L.forEach((g) => { if (g.visible) OUT.forEach((c) => P.push(proj(cv.copy(c).applyMatrix4(g.matrixWorld)))); }); const hp = hull(P);
          if (hp.length > 2) { const hr = host.getBoundingClientRect(), r = kS.getBoundingClientRect(), kk = hr.width / w || 1, sc = r.width / (kS.offsetWidth || 1) || 1;
            const pts2 = hp.concat([hp[0]]).map((q) => ((hr.left + q[0] * kk - r.left) / sc).toFixed(1) + 'px ' + ((hr.top + q[1] * kk - r.top) / sc).toFixed(1) + 'px').join(',');
            co = 'polygon(' + pts2 + ')'; cs = 'polygon(evenodd,-4000px -4000px,9000px -4000px,9000px 9000px,-4000px 9000px,-4000px -4000px,' + pts2 + ')'; } }
        if (kS.dataset.c !== cs) { kS.dataset.c = cs; kS.style.clipPath = cs; kS.style.webkitClipPath = cs; } if (kO.dataset.c !== co) { kO.dataset.c = co; kO.style.clipPath = co; kO.style.webkitClipPath = co; } } }
    const [x0, x1, y0, y1] = bbox();
    // floor shadows: dark contact line + soft per-layer shadow cast to the bottom-right, lighter and blurrier with height
    sx.setTransform(1, 0, 0, 1, 0, 0); sx.clearRect(0, 0, shd.width, shd.height);
    if (rise > 0.01) {
      let ylo = 1e9; L.forEach((g) => { if (g.visible) OUT.forEach((c) => { cv.copy(c).applyMatrix4(g.matrixWorld); ylo = Math.min(ylo, cv.y); }); });
      const ppx = 1 / upp, cpts = [];
      L.forEach((g) => { if (!g.visible) return; const pts = []; let hs = 0; OUT.forEach((c) => { cv.copy(c).applyMatrix4(g.matrixWorld); const hh = cv.y - ylo; hs += hh; if (hh < 0.07) cpts.push(proj(V.set(cv.x, ylo, cv.z))); cv.x += hh * 0.42; cv.z += hh * 0.32; cv.y = ylo; pts.push(proj(cv)); }); hs /= OUT.length;
        shade(pts, 0.32 / (1 + hs * 1.4), 6 + hs * 0.15 * ppx, 0, 0, 1); });
      if (cpts.length >= 3) { shade(cpts, 0.85, 2.5, 0, 1, 1.01); shade(cpts, 0.42, 0.05 * ppx, 0.03 * ppx, 2, 1.12); }
    }
    // reflection: sharp at the contact line, blurring and gone within ~25% of the phone height, ~35% strength
    refl.style.opacity = (rise * 0.36 * opR * opR).toFixed(3);
    rx.setTransform(1, 0, 0, 1, 0, 0); rx.globalCompositeOperation = 'source-over'; rx.clearRect(0, 0, refl.width, refl.height);
    if (rise > 0.01) { const yf = LY.floorY * dpr, oh = Math.max(30, LY.Hs * 0.25) * dpr, ax0 = Math.max(0, (x0 - 40) * dpr), aw = Math.min(refl.width - ax0, (x1 - x0 + 80) * dpr), sh = Math.min(yf, oh * 1.2);
      if (aw > 0 && sh > 0) {
        if (tmp.width !== refl.width || tmp.height !== refl.height) { tmp.width = refl.width; tmp.height = refl.height; }
        const mir = (c2) => { c2.save(); c2.setTransform(1, 0, 0, -1, 0, 2 * yf); c2.drawImage(canvas, ax0, yf - sh, aw, sh, ax0, yf - sh, aw, sh); c2.restore(); };
        const fade = (c2, a0, len) => { c2.globalCompositeOperation = 'destination-in'; const gr = c2.createLinearGradient(0, yf, 0, yf + len); gr.addColorStop(0, 'rgba(0,0,0,' + a0 + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c2.fillStyle = gr; c2.fillRect(0, yf, refl.width, refl.height - yf); c2.globalCompositeOperation = 'source-over'; };
        tx2.setTransform(1, 0, 0, 1, 0, 0); tx2.clearRect(0, 0, tmp.width, tmp.height); mir(tx2); fade(tx2, 1, oh * 0.45);
        const q = 6, bw = Math.max(1, Math.round(aw / q)), bh = Math.max(1, Math.round(sh / q)); if (lo.width !== bw || lo.height !== bh) { lo.width = bw; lo.height = bh; } lx.setTransform(1, 0, 0, -1, 0, bh); lx.clearRect(0, 0, bw, bh); lx.drawImage(canvas, ax0, yf - sh, aw, sh, 0, 0, bw, bh);
        rx.imageSmoothingQuality = 'high'; rx.drawImage(lo, 0, 0, bw, bh, ax0, yf, aw, sh); fade(rx, 0.75, oh); rx.drawImage(tmp, 0, 0); rx.clearRect(0, 0, refl.width, yf); } }
    // dust: tiny soft white specks hanging in the light, each drifting its own way (slight overall fall), twinkling in the key light; in the climax they grow, warm and defocus into the golden bokeh
    dx.setTransform(1, 0, 0, 1, 0, 0); dx.clearRect(0, 0, dust.width, dust.height);
    { const lw = (LY.floorY - LY.top) * 0.42, topY = 0, botY = LY.floorY + 10, gk = stand, lt = (state.lt == null ? 1 : state.lt) * Math.max(rise, oVis * 0.6);
      const x0d = CX - lw * 1.9, x1d = CX + lw * 1.9;
      const dpLim = window.seQuality ? window.seQuality.count(DP.length) : DP.length; // G16: density follows the frame rate
      DP.forEach((d, di) => { if (di >= dpLim) return; if (d.px == null) { d.px = lerp(x0d, x1d, d.x); d.py = lerp(topY, botY, d.y); }
        const zs = 0.5 + d.z; d.vx += (Math.sin(t * d.wb + d.ph) * 2.2 * zs + d.sx - d.vx) * Math.min(1, dt * 0.6); d.px += (d.vx + Math.sin(t * d.wb * 0.53 + d.ph2) * 1.2) * dt; d.py += (d.vy + d.fv * zs + Math.cos(t * d.wb * 0.8 + d.ph2) * 1.6) * dt;
        if (d.py > botY) { d.py = topY - Math.random() * 140; d.px = lerp(x0d, x1d, Math.random()); } if (d.py < topY - 160) d.py = botY - Math.random() * 80; if (d.px < x0d) { d.px = x1d - Math.random() * 30; d.py = lerp(topY, botY, Math.random()); } if (d.px > x1d) { d.px = x0d + Math.random() * 30; d.py = lerp(topY, botY, Math.random()); }
        const X = d.px, Y = d.py, yn = cl((Y - topY) / (botY - topY)), bw = lw * (0.7 + 0.75 * yn) * (1 + gk * 0.9), dxn = (X - CX) / bw, inL = Math.exp(-dxn * dxn) * (1.15 - 0.55 * yn) * Math.min(1, 0.3 + yn * 5) * (1 - Math.max(0, yn - 0.92) * 8);
        const tw = Math.exp(-dxn * dxn * 6) * (0.5 + 0.5 * Math.sin(t * d.tw + d.ph));
        let a = (d.a + (d.bk ? 0 : 0.14 * tw)) * inL; a = lerp(a, (0.05 + d.a * 0.25) * inL, gk) * lt * Math.pow(1 - gk, 1.6); if (a < 0.004) return;
        const r = (d.r * (1 + gk * (d.bk ? 1.5 : 10 + d.a * 30)) + gk * 2) * dpr, cr = Math.round(lerp(d.c[0], 247, gk)), cg2 = Math.round(lerp(d.c[1], 196, gk)), cb = Math.round(lerp(d.c[2], 90, gk)), soft = d.bk ? 2.4 : 1.6 + gk * 1.4;
        // G16: pre-drawn soft round sprites (white and gold, blended by gk) instead of a new gradient per speck per frame
        const R2 = r * soft, sw = dSpr(d.bk), gA = a * gk, wA = a * (1 - gk);
        if (wA > 0.003) { dx.globalAlpha = Math.min(1, wA); dx.drawImage(sw.w, X * dpr - R2, Y * dpr - R2, R2 * 2, R2 * 2); }
        if (gA > 0.003) { dx.globalAlpha = Math.min(1, gA); dx.drawImage(sw.g, X * dpr - R2, Y * dpr - R2, R2 * 2, R2 * 2); }
        dx.globalAlpha = 1; });
      if (gk > 0.004) { if (!BKD || BKD.w !== w || BKD.h !== hgt) BKD = mkBK(); const ek = eio(gk);
        BKD.forEach((b2) => { const th = b2.th + 0.9 * Math.sin(t * b2.om + b2.ph); b2.x += Math.cos(th) * b2.v * dt; b2.y += (Math.sin(th) * 0.8 - 0.25) * b2.v * dt; if (b2.x < -b2.r) b2.x = w + b2.r; if (b2.x > w + b2.r) b2.x = -b2.r; if (b2.y < -b2.r) b2.y = hgt + b2.r; if (b2.y > hgt + b2.r) b2.y = -b2.r; });
        for (let i = 0; i < BKD.length; i++) for (let j = i + 1; j < BKD.length; j++) { const p1 = BKD[i], p2 = BKD[j], ddx = p2.x - p1.x, ddy = p2.y - p1.y, dd = Math.hypot(ddx, ddy) || 1, ov = p1.r + p2.r + 24 - dd; if (ov > 0) { const k2 = Math.min(ov, 30) * dt * 0.8 / dd; p1.x -= ddx * k2; p1.y -= ddy * k2; p2.x += ddx * k2; p2.y += ddy * k2; } }
        BKD.forEach((b2, j) => { const hd = DP[9 + j] || DP[j], X = lerp(hd.px == null ? b2.x : hd.px, b2.x, ek), Y = lerp(hd.py == null ? b2.y : hd.py, b2.y, ek), r = lerp(hd.r * 3, b2.r, ek) * dpr, A = b2.a * (1 + 0.2 * Math.sin((t * PI * 2) / b2.bp + b2.ph)) * cl(gk * 1.2), c3 = b2.c.join(',');
          const gr = dx.createRadialGradient(X * dpr, Y * dpr, 0, X * dpr, Y * dpr, r); gr.addColorStop(0, 'rgba(' + c3 + ',' + (A * 0.72).toFixed(3) + ')'); gr.addColorStop(0.7, 'rgba(' + c3 + ',' + (A * 0.86).toFixed(3) + ')'); gr.addColorStop(0.9, 'rgba(' + c3 + ',' + (A * (b2.rim ? 1.5 : 1)).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(' + c3 + ',0)');
          dx.fillStyle = gr; dx.beginPath(); dx.arc(X * dpr, Y * dpr, r, 0, PI * 2); dx.fill(); }); } }
    // spec callouts: labels left of the stack; each line = one diagonal outside the stack + one horizontal run that never crosses another layer
    { const ok = stepOn && !mob && oo >= 0.999 && rise > 0.98; const specs = (state.spec && state.spec[act]) || SPEC0[act] || [];
      const hulls = ok ? L.map((g, s2) => (s2 === act || !g.visible ? null : hull(OUT.map((c) => proj(cv.copy(c).applyMatrix4(g.matrixWorld)))))).filter(Boolean) : [];
      const inH = (P2, x, y) => { let sg = 0; for (let k = 0; k < P2.length; k++) { const a2 = P2[k], b2 = P2[(k + 1) % P2.length], c2 = (b2[0] - a2[0]) * (y - a2[1]) - (b2[1] - a2[1]) * (x - a2[0]); if (c2 === 0) continue; if (!sg) sg = Math.sign(c2); else if (Math.sign(c2) !== sg) return false; } return true; };
      const free = (xa, xb, y) => { for (let k = 0; k <= 24; k++) { const x = lerp(xa, xb, k / 24); if (hulls.some((P2) => inH(P2, x, y))) return false; } return true; };
      const RT = LY.rtl, bx = RT ? x1 + 14 : x0 - 14, own = ok ? OUT.map((c) => proj(cv.copy(c).applyMatrix4(L[act].matrixWorld))) : [];
      let tg = ok ? CLP[act].map(([x, y], i) => { let q = proj(L[act].localToWorld(V.set(x, y, 0.04))); if (!free(bx, q[0], q[1])) { let best = null, bd = 1e9; own.forEach((o2) => { if ((RT ? x1 - o2[0] : o2[0] - x0) > (x1 - x0) * 0.45) return; const dd = Math.abs(o2[1] - q[1]); if (dd < bd && free(bx, o2[0] + (RT ? 1 : -1), o2[1])) { bd = dd; best = o2; } }); q = best; } return q ? { q, i } : null; }).filter((g2) => g2 && g2.q[0] > 4 && g2.q[0] < w - 4 && g2.q[1] > LY.top - 8 && g2.q[1] < LY.floorY + 8).sort((a2, b2) => a2.q[1] - b2.q[1]) : [];
      if (tg.length) { const n = tg.length, mid = tg.reduce((a2, b2) => a2 + b2.q[1], 0) / n, gap = 40, y0s = Math.max(LY.top + 10, Math.min(LY.floorY - 20 - gap * (n - 1), mid - (gap * (n - 1)) / 2)); tg.forEach((g2, k) => (g2.ly = y0s + k * gap)); }
      clO.forEach((c, i) => { if (!c.ln.parentNode) { svg.appendChild(c.ln); svg.appendChild(c.dt); } const it = tg[i]; const o = it ? cl((tt - 0.35 - i * 0.12) / 0.3) : 0;
        if (!it || o <= 0) { c.d.style.opacity = 0; c.ln.style.opacity = 0; c.dt.style.opacity = 0; return; }
        const q = it.q, ly = it.ly; c.d.textContent = specs[it.i] || ''; const lwid = c.d.offsetWidth || 90, rx2 = RT ? Math.min(LY.cx + LY.aW / 2 - lwid, bx + 44) + lwid : Math.max(LY.cx - LY.aW / 2 + lwid, bx - 44);
        c.d.style.transform = 'translate(' + (rx2 - lwid).toFixed(1) + 'px,' + (ly - 7).toFixed(1) + 'px)'; c.d.style.opacity = o.toFixed(3);
        c.ln.setAttribute('d', 'M' + (RT ? rx2 - lwid - 8 : rx2 + 8).toFixed(1) + ' ' + ly.toFixed(1) + ' L' + bx.toFixed(1) + ' ' + q[1].toFixed(1) + ' H' + q[0].toFixed(1)); c.ln.style.opacity = (o * 0.9).toFixed(3);
        c.dt.setAttribute('cx', q[0].toFixed(1)); c.dt.setAttribute('cy', q[1].toFixed(1)); c.dt.style.opacity = o.toFixed(3); }); }
    // drawer tag beside the slid-out part
    { let hi = -1, hm = 0.04; hovK.forEach((k, s2) => { if (k > hm) { hm = k; hi = s2; } });
      if (hi >= 0) { let xr = -1e9, xl = 1e9, yM = -1e9, ya = 0, yb = 0, n = 0; OUT.forEach((c) => { const q = proj(cv.copy(c).applyMatrix4(L[hi].matrixWorld)); xr = Math.max(xr, q[0]); xl = Math.min(xl, q[0]); ya += q[1]; yM = Math.max(yM, q[1]); n++; }); yb = ya / n;
        const txt = (state.tags && state.tags[hi]) || ''; const tw = tag.offsetWidth || 220, RT2 = LY.rtl, side = RT2 ? xl - 16 - tw >= 24 : xr + 16 + tw <= w - 24; if (tag.dataset.t !== txt + side + RT2) { tag.dataset.t = txt + side + RT2; tag.innerHTML = (side ? '<span style="position:absolute;' + (RT2 ? 'right' : 'left') + ':-16px;top:50%;width:16px;height:1px;background:rgba(247,192,50,.85)"></span>' : '<span style="position:absolute;left:50%;top:-12px;width:1px;height:12px;background:rgba(247,192,50,.85)"></span>') + txt; } tag.style.transform = side ? 'translate(' + (RT2 ? xl - 16 - tw : xr + 16).toFixed(1) + 'px,' + (yb - 20).toFixed(1) + 'px)' : 'translate(' + Math.max(24, Math.min(w - tw - 24, (xl + xr) / 2 - tw / 2)).toFixed(1) + 'px,' + (yM + 12).toFixed(1) + 'px)'; tag.style.opacity = cl((hm - 0.4) / 0.5).toFixed(3); }
      else tag.style.opacity = 0; }
    const root = host.parentElement, oc = !mob && stepOn && oo >= 0.999 && rise > 0.98 && root ? root.querySelector('[data-td-dot="' + act + '"]') : null;
    let show = false;
    if (oc) { const hr = host.getBoundingClientRect(), r = oc.getBoundingClientRect(), kk = hr.width / w || 1;
      const sg = LY.rtl ? -1 : 1; let ax = -1e9, ay = 0; CORN.forEach((c) => { cv.copy(c).applyMatrix4(L[act].matrixWorld); const q = proj(cv); if (q[0] * sg > ax) { ax = q[0] * sg; ay = q[1]; } }); ax *= sg;
      const dx2 = (r.left + r.width / 2 - hr.left) / kk, dy2 = (r.top + r.height / 2 - hr.top) / kk, sx2 = ax + 8 * sg, kx = dx2 - 26 * sg;
      cPath.setAttribute('d', 'M' + sx2.toFixed(1) + ' ' + ay.toFixed(1) + ' L' + kx.toFixed(1) + ' ' + dy2.toFixed(1) + ' H' + (dx2 - 6 * sg).toFixed(1));
      cPath.setAttribute('stroke-dashoffset', (1 - (1 - Math.pow(1 - cl((t - drawT - 0.1) / 0.3), 3))).toFixed(3));
      cHalo.setAttribute('cx', sx2.toFixed(1)); cHalo.setAttribute('cy', ay.toFixed(1)); cDot.setAttribute('cx', sx2.toFixed(1)); cDot.setAttribute('cy', ay.toFixed(1)); cHalo.setAttribute('r', (7 + 2 * Math.sin(t * 4)).toFixed(1)); show = ax > 0 && ax < w && ay > LY.top - 8 && ay < LY.floorY + 8; }
    [cPath, cHalo, cDot].forEach((n) => (n.style.opacity = show ? 1 : 0));
  };
  state.dbg = { L, phone, cam, scene: typeof scene !== 'undefined' ? scene : null };
  state.renderNow = () => { state.snap = true; state.snapZ = true; try { frame(); } catch (e) { if (!state.__rnErr) { state.__rnErr = 1; console.warn('[teardown] frame error', e && e.message, e && e.stack && e.stack.split('\n')[1]); } } };
  // shelf mode: no teardown loop; render library parts / the assembled phone into viewports of this canvas (What we offer)
  if (state.shelf) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); renderer.shadowMap.enabled = false;
    const swL = new THREE.DirectionalLight(0xffffff, 0); adS.add(swL); adS.add(swL.target);
    const info = [...parts, parts.asm].map((pv) => { pv.visible = true; pv.position.set(0, 0, 0); pv.rotation.set(0, 0, 0); pv.scale.setScalar(pv.userData.s); pv.updateMatrixWorld(true); const sz = new THREE.Box3().setFromObject(pv).getSize(new THREE.Vector3()); pv.visible = false; return { hh: sz.y / 2, hw: sz.x / 2, hd: sz.z / 2 }; });
    let scrT = null; const scrM = new THREE.MeshBasicMaterial({ toneMapped: false, color: 0x000000 });
    parts.asm.traverse((m) => { if (!m.isMesh) return; if (Array.isArray(m.material)) m.material = m.material.map((mt) => (mt === offMat ? scrM : mt)); else if (m.material === offMat) m.material = scrM; });
    const qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), XA = new THREE.Vector3(1, 0, 0), YA = new THREE.Vector3(0, 1, 0), ZA = new THREE.Vector3(0, 0, 1), sz2 = new THREE.Vector2();
    const api = { info,
      setScreen(cv) { scrT = new THREE.CanvasTexture(cv); scrT.colorSpace = THREE.SRGBColorSpace; scrT.anisotropy = ANI; scrM.map = scrT; scrM.color.setScalar(1); scrM.needsUpdate = true; },
      screenDirty() { if (scrT) scrT.needsUpdate = true; },
      draw(items) { const W2 = host.clientWidth, H2 = host.clientHeight; if (!W2 || !H2) return; renderer.getSize(sz2); if (sz2.x !== W2 || sz2.y !== H2) renderer.setSize(W2, H2, false);
        renderer.setRenderTarget(null); renderer.setScissorTest(false); renderer.setViewport(0, 0, W2, H2); renderer.setClearColor(0x000000, 0); renderer.clear(); if (!items.length) return;
        renderer.setScissorTest(true); const bg0 = adS.background; adS.background = null; resetAd(); glint.visible = shG.visible = shB.visible = false;
        items.forEach((it) => { parts.forEach((q) => (q.visible = false)); parts.asm.visible = false; const pv = it.L === 8 ? parts.asm : parts[it.L]; if (!pv) return; pv.visible = true; pv.position.set(0, AD_Y + (it.py || 0), 0);
          if (it.lay) { qa.setFromAxisAngle(XA, -PI / 2); qb.setFromAxisAngle(ZA, it.lay.roll); qa.premultiply(qb); qb.setFromAxisAngle(YA, it.lay.yaw); qa.premultiply(qb); pv.quaternion.copy(qa); } else pv.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
          pv.scale.setScalar(pv.userData.s * it.k); pv.updateMatrixWorld(true);
          const el = it.el || 0; adCam.aspect = it.w / it.h; adCam.position.set(0, AD_Y + AD_D * Math.sin(el), AD_D * Math.cos(el)); adCam.lookAt(0, AD_Y, 0); adCam.updateProjectionMatrix();
          swL.intensity = (it.sw || 0) * 3.2; swL.position.set((it.sx || 0) * 6, 3, 5); swL.target.position.set(0, AD_Y, 0);
          const y = H2 - it.y - it.h; renderer.setViewport(it.x, y, it.w, it.h); renderer.setScissor(it.x, y, it.w, it.h); renderer.render(adS, adCam); });
        renderer.setScissorTest(false); adS.background = bg0; parts.forEach((q) => (q.visible = false)); parts.asm.visible = false; } };
    state.shelfApi = api; state.onShelf && state.onShelf(api);
    return () => { alive = false; window.removeEventListener('se:lang', onAdLang); window.removeEventListener('pointermove', onMove); renderer.dispose(); pmrem.dispose(); svg.remove(); refl.remove(); shd.remove(); dust.remove(); clO.forEach((c) => c.d.remove()); tag.remove(); };
  }
  tick();
  return () => { alive = false; window.removeEventListener('se:lang', onAdLang); window.removeEventListener('pointermove', onMove); rt.dispose(); renderer.dispose(); pmrem.dispose(); svg.remove(); refl.remove(); shd.remove(); dust.remove(); clO.forEach((c) => c.d.remove()); tag.remove(); };
}
