// Sam Electronics TEARDOWN final-call commercial (own file; the hero reel uses se-phone-ad.js).
// Template A = hero reel (calm, premium) · Template B = teardown final call (bold, fast).
// Every scene in a template shares the same fonts, sizes and positions; only words, part and colour change.
// const ad = SEPhoneAd.create(canvas, { mode: 'A'|'B', lib, logo }); ad.draw(t); ad.dur; ad.logoT; ad.setLib(lib)
(function () {
  const C_Y = '#F7C032', C_G = '#26282B', C_F = '#F2F3F4', INK = '#26282B';
  const F = { sg: '"Space Grotesk",sans-serif', in: 'Inter,sans-serif', jb: '"JetBrains Mono",monospace' };
  const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), K = (t, a, d) => cl((t - a) / d);
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3), ex = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * cl(x))), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x, s) => { x = cl(x); s = s == null ? 1.5 : s; const c3 = s + 1; return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
  const bounce = (x) => { x = cl(x); const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  const TONE = {
    [C_Y]: { ink: INK, eb: 'rgba(38,40,43,.75)', kick: 'rgba(38,40,43,.8)', d: '#3D3E3F', bb: C_G, bi: '#FFFFFF', st: C_G, glow: 'rgba(255,224,138,.6)', line: 'rgba(38,40,43,.08)' },
    [C_G]: { ink: '#FFFFFF', eb: 'rgba(255,255,255,.7)', kick: 'rgba(255,255,255,.8)', d: '#D5D7DA', bb: C_Y, bi: C_G, st: '#FFFFFF', glow: 'rgba(255,170,64,.25)', line: 'rgba(255,255,255,.08)' },
    [C_F]: { ink: INK, eb: 'rgba(38,40,43,.75)', kick: 'rgba(38,40,43,.8)', d: '#3D3E3F', bb: C_G, bi: '#FFFFFF', st: C_G, glow: 'rgba(196,184,166,.3)', line: 'rgba(38,40,43,.08)' },
  };
  function spaced(x, s, X, Y, ls, measure) { let w = 0; for (const ch of s) { const cw = x.measureText(ch).width; if (!measure) x.fillText(ch, X + w, Y); w += cw + ls; } return w - ls; }
  function wrap(x, s, maxW) { const words = s.replace(/\n/g, ' ').split(' '), out = []; let l = ''; words.forEach((w) => { const t = l ? l + ' ' + w : w; if (x.measureText(t).width > maxW && l) { out.push(l); l = w; } else l = t; }); if (l) out.push(l); return out; }
  function rr(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }

  // ── part images: crop to alpha bbox, silhouettes, product-shaped glow
  function prep(src, box) {
    return new Promise((res) => { const im = new Image(); im.onload = () => {
      const S = im.naturalWidth, c0 = mk(S, S), x0 = c0.getContext('2d'); x0.drawImage(im, 0, 0);
      let bx; if (box) bx = [Math.round(box[0] * S), Math.round(box[1] * S), Math.round(box[2] * S), Math.round(box[3] * S)];
      else { const d = x0.getImageData(0, 0, S, S).data; let a = S, b = S, c = -1, e = -1; for (let y = 0; y < S; y++) for (let X = 0; X < S; X++) if (d[(y * S + X) * 4 + 3] > 12) { if (X < a) a = X; if (X > c) c = X; if (y < b) b = y; if (y > e) e = y; } if (c < 0) { a = b = 0; c = e = S - 1; } bx = [a, b, c - a + 1, e - b + 1]; }
      const cv = mk(bx[2], bx[3]); cv.getContext('2d').drawImage(c0, bx[0], bx[1], bx[2], bx[3], 0, 0, bx[2], bx[3]);
      const sil = (col) => { const s = mk(cv.width, cv.height), x = s.getContext('2d'); x.drawImage(cv, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, s.width, s.height); return s; };
      res({ cv, w: cv.width, h: cv.height, black: sil('#000'), white: sil('#fff'), glow: {} }); };
      im.onerror = () => res(null); im.src = src; });
  }
  function glowOf(P, col) {
    if (P.glow[col]) return P.glow[col];
    const q = 0.25, pad = 0.45, w = P.w * q, h = P.h * q, G = mk(w * (1 + pad * 2), h * (1 + pad * 2)), x = G.getContext('2d'), s = mk(P.w * q, P.h * q), sx = s.getContext('2d');
    sx.drawImage(P.cv, 0, 0, s.width, s.height); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = col.replace(/rgba\(([^)]+),[^,)]+\)/, 'rgb($1)'); sx.fillRect(0, 0, s.width, s.height);
    const blur = Math.max(w, h) * 0.16; x.shadowColor = sx.fillStyle; x.shadowBlur = blur; x.shadowOffsetX = G.width * 4;
    const k = 1.18; for (let i = 0; i < 2; i++) x.drawImage(s, G.width / 2 - (w * k) / 2 - G.width * 4, G.height / 2 - (h * k) / 2, w * k, h * k);
    return (P.glow[col] = { cv: G, sc: 1 + pad * 2 });
  }

  // ── scene lists
  const SCN_A = [
    { L: 0, bg: C_G, eb: 'LCD & OLED SCREENS', h: ['Bright like', 'day one.'], d: 'Original, Service Pack, OLED and Incell.', b: 'Shop screens' },
    { L: 4, bg: C_Y, eb: 'BATTERIES', h: ['Full power,', 'fully tested.'], d: 'Genuine cells, checked before they ship.', b: 'Shop batteries' },
    { L: 7, bg: C_F, eb: 'BACK COVERS', h: ['Back to', 'like new.'], d: 'Every colour, exact fit.', b: 'Shop back covers' },
    { L: 1, bg: C_G, eb: 'FRAMES & HOUSINGS', h: ['Straight edges,', 'factory fit.'], d: 'Mid-frames and housings for every major model.', b: 'Shop frames' },
    { L: 2, bg: C_Y, eb: 'FLEX CABLES', h: ['Charging again', 'in minutes.'], d: 'Charging, power and button flex cables.', b: 'Shop flex cables' },
    { L: 5, bg: C_G, eb: 'CAMERAS', h: ['Sharp shots,', 'focus tested.'], d: 'Front and rear modules, checked on the bench.', b: 'Shop cameras' },
    { L: 6, bg: C_F, eb: 'SMALL PARTS', h: ['The small parts', 'that finish the job.'], d: 'Buttons, ports, speakers and board components.', b: 'Shop small parts' },
    { L: 9, rep: true, bg: C_G, eb: 'REPAIRS', h: ['Cracked today.', 'Fixed today.'], d: 'Screens replaced and tested in Deira.', b: 'Book a repair' },
    { L: 4, multi: [4, 4, 4], bg: C_Y, eb: 'WHOLESALE', h: ['Stock up.', 'Cost down.'], d: 'Trade prices for approved accounts.', b: 'Wholesale prices' },
    { L: 8, bg: C_F, eb: 'WORLDWIDE DELIVERY', h: ['From Deira', 'to the world.'], d: 'Tracked and securely packed, worldwide.', b: 'Shipping info' },
  ].map((q) => ({ ...q, k: 'a', dur: 3.2 }));
  const SCN_B = [{ k: 'intro', dur: 1.8, bg: C_G }].concat([
    { L: 0, bg: C_Y, kick: 'Bright like day one.', name: 'SCREENS', d: '2,211 in stock · 14 brands', b: 'Shop screens', tr: 'Z', dir: [-1, 0] },
    { L: 4, bg: C_G, kick: 'Full power, fully tested.', name: 'BATTERIES', d: '1,760 in stock · 14 brands', b: 'Shop batteries', tr: 'W', dir: [0, -1] },
    { L: 7, bg: C_F, kick: 'Factory finish, every brand.', name: 'BACK GLASS', d: '1,698 in stock · 14 brands', b: 'Shop back glass', tr: 'D', dir: [1, 0] },
    { L: 5, bg: C_Y, kick: 'Sharp again, every lens.', name: 'CAMERAS', d: '566 in stock · 11 brands', b: 'Shop cameras', tr: 'Z', dir: [0, 1] },
    { L: 2, bg: C_G, kick: 'Charging again in minutes.', name: 'FLEX & PORTS', d: '1,629 in stock · 14 brands', b: 'Shop flex & ports', tr: 'W', dir: [-1, 0] },
    { L: 6, bg: C_F, kick: 'The small parts that matter.', name: 'SMALL PARTS', d: '377 in stock · 14 brands', b: 'Shop small parts', tr: 'D', dir: [0, 1] },
  ].map((q) => ({ ...q, k: 'b', dur: 1.1 })).concat([
    { k: 'word', dur: 0.35, bg: C_Y, ink: C_G, w: 'EVERY PART.' },
    { k: 'word', dur: 0.35, bg: C_G, ink: C_Y, w: 'EVERY BRAND.' },
    { k: 'word', dur: 0.35, bg: C_F, ink: C_G, w: 'ALL IN DEIRA.' },
    { k: 'slam', dur: 0.6, bg: C_Y, ink: C_G, w: 'Get yours today.' },
    { k: 'logo', dur: 2.2, bg: C_G },
  ]));

  function create(cv, opts) {
    opts = opts || {}; const mode = 'B', SC = (opts.scenes || (mode === 'A' ? SCN_A : SCN_B)).map((q) => ({ ...q }));
    { const Dd = opts.data || {}, N = Dd.N || [], Bb = Dd.B || []; SC.forEach((q) => { if (q.k === 'b' && N[q.L] != null) q.d = Math.round(N[q.L]).toLocaleString('en-US') + ' in stock · ' + (Bb[q.L] || Dd.brands || 14) + ' brands'; }); }
    let st = 0; SC.forEach((q) => { q.st = st; st += q.dur; }); const TOT = st, LOGO_T = SC[SC.length - 1].st + 0.9;
    const ctx = cv.getContext('2d'); let W = cv.width, H = cv.height, u = W / 100, v = H / 100, bufA, bufB, scr, P = [], front = null, logoIm = null, logoPts = null;
    const resize = () => { W = cv.width; H = cv.height; u = W / 100; v = H / 100; bufA = mk(W, H); bufB = mk(W, H); scr = mk(W, H); };
    resize();
    const setLib = (lib) => { if (!lib || !lib.large || !lib.large.length) return; front = lib.front || null; const src = lib.large;
      src.forEach((s, i) => { if (!s) return; prep(s, i === 9 && front && front.ph ? front.ph : null).then((r) => { P[i] = r; }); }); };
    if (opts.lib) setLib(opts.lib);
    { const im = new Image(); im.onload = () => { logoIm = im; const S = 160, c = mk(S, S), x = c.getContext('2d'); x.drawImage(im, 0, 0, S, S); const d = x.getImageData(0, 0, S, S).data, pts = []; for (let y = 0; y < S; y += 2) for (let X = 0; X < S; X += 2) { const dx = X - S / 2, dy = y - S / 2; if (dx * dx + dy * dy > (S / 2 - 1) * (S / 2 - 1)) continue; const i = (y * S + X) * 4; if (d[i + 3] < 100) continue; pts.push([X / S - 0.5, y / S - 0.5, d[i], d[i + 1], d[i + 2]]); }
      let sd = 11; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647); for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
      logoPts = pts.slice(0, 1400).map((p) => { const a0 = rnd() * Math.PI * 2; return { tx: p[0], ty: p[1], a0, r0: 0.95 + rnd() * 0.35, spin: (rnd() < 0.5 ? -1 : 1) * (1.6 + rnd() * 1.4), dl: rnd() * 0.45, du: 0.55 + rnd() * 0.25, s: 0.6 + rnd() * 0.9, g: rnd() }; }); };
      im.src = opts.logo || 'assets/se-logo.png'; }

    // ── shared pieces
    function bg(x, col, pcx, pcy) {
      if (col === C_Y) { x.fillStyle = C_Y; x.fillRect(0, 0, W, H); let g = x.createRadialGradient(pcx, pcy, 0, pcx, pcy, H * 0.5); g.addColorStop(0, '#FBD467'); g.addColorStop(1, 'rgba(251,212,103,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); g = x.createRadialGradient(W / 2, H * 0.5, H * 0.3, W / 2, H * 0.5, H * 0.75); g.addColorStop(0, 'rgba(150,96,0,0)'); g.addColorStop(1, 'rgba(150,96,0,.13)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      else if (col === C_G) { const g = x.createRadialGradient(pcx, pcy, 0, pcx, pcy, H * 0.62); g.addColorStop(0, '#34363A'); g.addColorStop(1, '#26282B'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      else { const g = x.createRadialGradient(pcx, pcy, 0, pcx, pcy, H * 0.65); g.addColorStop(0, '#F8F6F2'); g.addColorStop(1, '#E8E7E3'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    }
    function status(x, col) {
      const T = TONE[col] || TONE[C_G], cy = 4.6 * u, r = 1.5 * u; x.fillStyle = '#050506'; x.beginPath(); x.arc(W / 2, cy, r, 0, Math.PI * 2); x.fill(); x.strokeStyle = 'rgba(120,124,130,.35)'; x.lineWidth = Math.max(1, u * 0.18); x.stroke();
      x.fillStyle = T.st; x.strokeStyle = T.st; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = '600 ' + 3.9 * u + 'px ' + F.in; x.fillText('9:41', 10 * u, cy + 0.15 * u);
      const R = W - 10 * u, bw = 5.6 * u, bh = 2.7 * u; x.lineWidth = Math.max(1, 0.32 * u); x.globalAlpha = 0.45; rr(x, R - bw, cy - bh / 2, bw, bh, 0.8 * u); x.stroke(); x.globalAlpha = 1; rr(x, R - bw + 0.55 * u, cy - bh / 2 + 0.55 * u, (bw - 1.1 * u) * 0.8, bh - 1.1 * u, 0.4 * u); x.fill(); x.globalAlpha = 0.45; rr(x, R + 0.35 * u, cy - 0.5 * u, 0.5 * u, u, 0.25 * u); x.fill(); x.globalAlpha = 1;
      const wx = R - bw - 3.6 * u, wy = cy + 1.15 * u; x.lineCap = 'round'; x.lineWidth = 0.5 * u; [2.6, 1.7].forEach((rad) => { x.beginPath(); x.arc(wx, wy, rad * u, -Math.PI * 0.75, -Math.PI * 0.25); x.stroke(); }); x.beginPath(); x.arc(wx, wy - 0.15 * u, 0.5 * u, 0, Math.PI * 2); x.fill();
      const sx = wx - 3.5 * u - 4 * 1.25 * u; for (let i = 0; i < 4; i++) { const h = (0.9 + i * 0.6) * u; rr(x, sx + i * 1.25 * u, cy + 1.3 * u - h, 0.85 * u, h, 0.25 * u); x.fill(); }
      x.textBaseline = 'alphabetic';
    }
    function button(x, col, label, y, a, dy) {
      const T = TONE[col], bh = 7.5 * v, bw = 80 * u, X = 10 * u; x.globalAlpha = a; x.fillStyle = T.bb; rr(x, X, y + dy, bw, bh, 3 * u); x.fill();
      x.fillStyle = T.bi; x.font = '600 ' + 4.6 * u + 'px ' + F.in; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(label, X + 5 * u, y + dy + bh / 2); x.textAlign = 'right'; x.fillText('→', X + bw - 5 * u, y + dy + bh / 2); x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.globalAlpha = 1;
    }
    function fitPart(Pi, hT, wMax) { const s = Math.min(hT / Pi.h, wMax / Pi.w); return { w: Pi.w * s, h: Pi.h * s }; }
    function glowAndShadow(x, col, Pi, cx, cy, w, h, rot, a, shY) {
      const T = TONE[col], G = glowOf(Pi, T.glow); x.save(); x.globalAlpha = a * parseFloat(T.glow.split(',')[3]); x.translate(cx, cy); x.rotate(rot); x.drawImage(G.cv, (-w * G.sc) / 2, (-h * G.sc) / 2, w * G.sc, h * G.sc); x.restore();
      if (shY != null) { x.save(); x.globalAlpha = a; x.translate(cx, shY); x.scale(1, 0.09); const g = x.createRadialGradient(0, 0, 0, 0, 0, w * 0.4); g.addColorStop(0, 'rgba(38,40,43,.25)'); g.addColorStop(1, 'rgba(38,40,43,0)'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, w * 0.4, 0, Math.PI * 2); x.fill(); x.restore(); }
    }
    function drawImg(x, img, cx, cy, w, h, rot, sx, a) { x.save(); x.globalAlpha = a == null ? 1 : a; x.translate(cx, cy); x.rotate(rot || 0); x.scale(sx == null ? 1 : sx, 1); x.drawImage(img, -w / 2, -h / 2, w, h); x.restore(); }
    // tint a part with an overlay clipped to its silhouette (scratch canvas)
    function partFx(Pi, w, h, fn) { const s = scr, sx = s.getContext('2d'); const cw = Math.ceil(w), ch = Math.ceil(h); sx.setTransform(1, 0, 0, 1, 0, 0); sx.clearRect(0, 0, cw + 2, ch + 2); sx.globalCompositeOperation = 'source-over'; sx.globalAlpha = 1; sx.drawImage(Pi.cv, 0, 0, w, h); sx.globalCompositeOperation = 'source-atop'; fn(sx, w, h); sx.globalCompositeOperation = 'source-over'; return { cv: s, sw: cw, sh: ch }; }
    function drawFx(x, fx, cx, cy, w, h, rot, sxk, a) { x.save(); x.globalAlpha = a == null ? 1 : a; x.translate(cx, cy); x.rotate(rot || 0); x.scale(sxk == null ? 1 : sxk, 1); x.drawImage(fx.cv, 0, 0, w, h, -w / 2, -h / 2, w, h); x.restore(); }

    // ── repair phone (Template A, REPAIRS): crack → yellow light seals each crack → boot
    let cracks = null;
    function mkCracks() { let sd = 5; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647), ix = 0.66, iy = 0.3, out = [];
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + rnd() * 0.5; let x = ix, y = iy, ang = a; const pts = [[x, y]]; const n = 4 + Math.floor(rnd() * 3); for (let j = 0; j < n; j++) { ang += (rnd() - 0.5) * 0.7; const l = 0.06 + rnd() * 0.1; x += Math.cos(ang) * l; y += Math.sin(ang) * l * 0.55; pts.push([x, y]); if (x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) break; }
        out.push(pts); if (rnd() < 0.6) { const k = Math.min(pts.length - 1, 2), b = [[pts[k][0], pts[k][1]]]; let bx = pts[k][0], by = pts[k][1], ba = ang + (rnd() < 0.5 ? 1 : -1) * 0.9; for (let j = 0; j < 2; j++) { bx += Math.cos(ba) * 0.07; by += Math.sin(ba) * 0.05; b.push([bx, by]); } out.push(b); } }
      out.forEach((p) => { let L = 0; p.len = [0]; for (let i = 1; i < p.length; i++) { L += Math.hypot(p[i][0] - p[i - 1][0], (p[i][1] - p[i - 1][1]) * 2.1); p.len.push(L); } p.L = L; }); return out; }
    function pathTo(x, p, f0, f1, sx, sy, w, h) { const a = f0 * p.L, b = f1 * p.L; x.beginPath(); let started = false; for (let i = 1; i < p.length; i++) { const l0 = p.len[i - 1], l1 = p.len[i]; if (l1 < a || l0 > b) continue; const t0 = Math.max(0, (a - l0) / (l1 - l0 || 1)), t1 = Math.min(1, (b - l0) / (l1 - l0 || 1)); const P0 = [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t0, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t0], P1 = [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t1, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t1]; if (!started) { x.moveTo(sx + P0[0] * w, sy + P0[1] * h); started = true; } x.lineTo(sx + P1[0] * w, sy + P1[1] * h); } }
    function repairScreen(x, lt, sx, sy, sw, sh, rad) {
      if (!cracks) cracks = mkCracks(); x.save(); rr(x, sx, sy, sw, sh, rad); x.clip();
      const boot = K(lt, 2.3, 0.35); x.fillStyle = '#0B0C0E'; x.fillRect(sx, sy, sw, sh);
      if (boot > 0) { const g = x.createRadialGradient(sx + sw / 2, sy + sh * 0.35, 0, sx + sw / 2, sy + sh * 0.35, sh * 0.8); g.addColorStop(0, '#3A3C40'); g.addColorStop(1, '#141517'); x.globalAlpha = boot; x.fillStyle = g; x.fillRect(sx, sy, sw, sh); x.globalAlpha = 1;
        if (logoIm) { const lw = sw * 0.5 * (0.9 + 0.1 * eo(boot)); x.save(); x.globalAlpha = boot; x.beginPath(); x.arc(sx + sw / 2, sy + sh / 2, lw / 2, 0, Math.PI * 2); x.clip(); x.drawImage(logoIm, sx + sw / 2 - lw / 2, sy + sh / 2 - lw / 2, lw, lw);
          const sk = K(lt, 2.6, 0.45); if (sk > 0 && sk < 1) { const bx = sx + sw / 2 - lw + sk * lw * 2; const g2 = x.createLinearGradient(bx - lw * 0.25, 0, bx + lw * 0.25, 0); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(0.5, 'rgba(255,255,255,.55)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g2; x.fillRect(sx, sy, sw, sh); } x.restore(); } }
      const hit = 0.95, grow = K(lt, hit, 0.18); if (lt >= hit && lt < hit + 0.25) { const f = 1 - K(lt, hit, 0.25); const g = x.createRadialGradient(sx + 0.66 * sw, sy + 0.3 * sh, 0, sx + 0.66 * sw, sy + 0.3 * sh, sw * 0.5); g.addColorStop(0, 'rgba(255,255,255,' + 0.5 * f + ')'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(sx, sy, sw, sh); }
      x.lineCap = 'round'; x.lineJoin = 'round';
      cracks.forEach((p, j) => { if (grow <= 0) return; const s0 = 1.25 + j * 0.085, sk = K(lt, s0, 0.3), head = eio(sk); const g1 = eo(grow);
        if (head < 1) { x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = Math.max(1, sw * 0.008); pathTo(x, p, head, g1, sx, sy, sw, sh); x.stroke(); x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = Math.max(2, sw * 0.025); pathTo(x, p, head, g1, sx, sy, sw, sh); x.stroke(); }
        if (sk > 0) { const fade = 1 - K(lt, s0 + 0.3, 0.35); if (fade > 0) { x.save(); x.shadowColor = '#F7C032'; x.shadowBlur = sw * 0.04; x.strokeStyle = 'rgba(255,219,110,' + fade + ')'; x.lineWidth = Math.max(1, sw * 0.012); pathTo(x, p, 0, head * g1, sx, sy, sw, sh); x.stroke(); x.restore(); }
          if (sk < 1) { const L = head * p.L; let i = 1; while (i < p.length - 1 && p.len[i] < L) i++; const t = (L - p.len[i - 1]) / (p.len[i] - p.len[i - 1] || 1), hx = sx + (p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t) * sw, hy = sy + (p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t) * sh; const g = x.createRadialGradient(hx, hy, 0, hx, hy, sw * 0.06); g.addColorStop(0, 'rgba(255,240,190,.95)'); g.addColorStop(1, 'rgba(247,192,50,0)'); x.fillStyle = g; x.fillRect(hx - sw * 0.06, hy - sw * 0.06, sw * 0.12, sw * 0.12); } } });
      const g = x.createLinearGradient(sx, sy, sx + sw, sy + sh * 0.6); g.addColorStop(0, 'rgba(255,255,255,.1)'); g.addColorStop(0.35, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(sx, sy, sw, sh); x.restore();
    }

    // ── Template A scene
    function sceneA(x, q, lt, exitK) {
      const T = TONE[q.bg], cy = 56.5 * v; bg(x, q.bg, W / 2, cy); const mx = 10 * u;
      // eyebrow
      { const k = eo(K(lt, 0.18, 0.1)); x.globalAlpha = k; x.fillStyle = T.eb; x.font = '500 ' + 3.6 * u + 'px ' + F.jb; spaced(x, q.eb, mx - (1 - k) * 6 * u, 17 * v + 3.6 * u, 3.6 * u * 0.2); x.globalAlpha = 1; }
      // headline
      const hs = 8.5 * u, lh = hs * 1.05, y0 = 17 * v + 3.6 * u + 2 * v; x.font = '700 ' + hs + 'px ' + F.sg; x.fillStyle = T.ink;
      q.h.forEach((ln, i) => { const k = ex(K(lt, 0.26 + i * 0.08, 0.32)); const top = y0 + i * lh; x.save(); x.beginPath(); x.rect(0, top - 0.1 * lh, W, lh * 1.12); x.clip(); x.fillText(ln, mx, top + hs * 0.86 + (1 - k) * lh); x.restore(); });
      // product
      const pk = K(lt, 0.36, 0.3), sk = K(lt, 0.66, 0.3), fl = Math.sin(((lt - 0.66) / 3) * Math.PI * 2) * (6 * H / 416) * sk, turn = Math.sin(((lt - 0.66) / 3.2) * Math.PI * 2) * (8 * Math.PI / 180) * sk;
      const fx = (1 - eo(pk)) * 70 * u, frot = (1 - eo(pk)) * 0.45, settle = pk >= 1 ? Math.sin(K(lt, 0.66, 0.3) * Math.PI) * 0.04 * (1 - sk) : 0, tilt = -8 * Math.PI / 180;
      const shY = 73 * v - 1.5 * v, show = (Pi, ox, oy, sc2, rot2, a2) => { const f = fitPart(Pi, 30 * v * sc2, 66 * u * sc2); const px = W / 2 + fx + ox, py = cy + fl + oy, rot = tilt + frot + settle + rot2, sxk = Math.cos(turn); glowAndShadow(x, q.bg, Pi, px, py, f.w, f.h, rot, eo(pk) * a2, ox === 0 ? shY : null); drawImg(x, Pi.cv, px, py, f.w, f.h, rot, sxk, a2 * (pk > 0 ? 1 : 0)); return { px, py, f, rot, sxk }; };
      if (q.rep) { const Pi = P[9]; if (Pi) { const r = show(Pi, 0, 0, 1, 0, 1); const fr = (front && front.scr) || [0.045, 0.022, 0.91, 0.956]; x.save(); x.translate(r.px, r.py); x.rotate(r.rot); x.scale(r.sxk, 1); const sx = -r.f.w / 2 + fr[0] * r.f.w, sy = -r.f.h / 2 + fr[1] * r.f.h; repairScreen(x, lt, sx, sy, fr[2] * r.f.w, fr[3] * r.f.h, r.f.w * 0.1); x.restore(); } }
      else if (q.multi) { const Pi = P[q.multi[0]]; if (Pi) { [[-14, 3, -0.2], [14, 3, 0.2], [0, -2, 0]].forEach(([ox, oy, rr2]) => show(Pi, ox * u, oy * v, 0.82, rr2, 1)); } }
      else { const Pi = P[q.L]; if (Pi) show(Pi, 0, 0, 1, 0, 1); }
      // description + button
      const dk = eo(K(lt, 0.64, 0.15)), dy = (1 - dk) * 3 * v; x.globalAlpha = dk; x.fillStyle = T.d; x.font = '400 ' + 4.6 * u + 'px ' + F.in; wrap(x, q.d, 80 * u).slice(0, 2).forEach((ln, i) => x.fillText(ln, mx, 77 * v + 4.6 * u * 0.9 + i * 4.6 * u * 1.35 + dy)); x.globalAlpha = 1;
      button(x, q.bg, q.b, 85 * v, dk, dy);
      
    }

    // ── Template B scene
    function nameLines(s) { const w = s.split(' '); if (w.length === 1) return [s]; if (w.length === 2) return w; return [w.slice(0, w.length - 1).join(' '), w[w.length - 1]]; }
    function sceneB(x, q, lt, exitK) {
      const T = TONE[q.bg], cy = 55 * v, mx = 12 * u, dir = q.dir || [1, 0]; const push = 1 + 0.03 * cl(lt / q.dur);
      bg(x, q.bg, W / 2, cy);
      const ex0 = exitK || 0, eX = -ex0 * 45 * u * (q.tr === 'Z' ? 0 : 1), eA = 1 - ex0;
      x.save(); if (ex0) { x.translate(eX * (dir[0] || 0.6), eX * (dir[1] || 0) * 0.5); x.globalAlpha = eA; }
      // giant outline word
      { x.save(); x.globalAlpha *= eo(K(lt, 0.05, 0.3)); x.font = '700 100px ' + F.sg; const ofs = Math.min(40 * u, (84 * u * 100) / x.measureText(q.name).width); x.font = '700 ' + ofs + 'px ' + F.sg; x.strokeStyle = T.ink; x.globalAlpha *= 0.08; x.lineWidth = Math.max(1, W / 320); const tw = x.measureText(q.name).width; const ox = (W - tw) / 2 + 3 * u - (lt / q.dur) * 6 * u; x.strokeText(q.name, ox, cy + ofs * 0.35); x.restore(); }
      // kicker
      { const k = eo(K(lt, 0.08, 0.1)); x.save(); x.globalAlpha *= k; x.fillStyle = T.kick; x.font = '600 ' + 4.6 * u + 'px ' + F.in; x.fillText(q.kick, mx + dir[0] * (1 - k) * 12 * u, 14 * v + 4.6 * u * 0.85 + dir[1] * (1 - k) * 4 * v); x.restore(); }
      // part name, letters fly in from the part's direction
      { const L = nameLines(q.name); x.font = '700 100px ' + F.sg; const mw = Math.max(...L.map((s) => x.measureText(s).width)); const fs = Math.min(15 * u, (76 * u * 100) / mw), lh = fs * 0.95; x.font = '700 ' + fs + 'px ' + F.sg; x.fillStyle = T.ink; let n = 0;
        L.forEach((s, li) => { let X = mx; const Y = 18 * v + 4.6 * u * 1.2 + fs * 0.8 + li * lh; for (const ch of s) { const cw = x.measureText(ch).width; const t0 = 0.16 + n * 0.025, k = K(lt, t0, 0.22), b = back(k, 1.6), off = (1 - b) * 26 * u; if (k > 0) { const ox = dir[0] * off, oy = dir[1] * off * 0.6; if (k < 0.7) { x.save(); x.globalAlpha *= 0.22 * (1 - k); x.fillText(ch, X + ox * 1.6, Y + oy * 1.6); x.fillText(ch, X + ox * 1.25, Y + oy * 1.25); x.restore(); } x.save(); x.globalAlpha *= cl(k * 3); x.fillText(ch, X + ox, Y + oy); x.restore(); } X += cw; n++; } }); }
      // product with its own entrance
      const Pi = P[q.L]; if (Pi) { const f0 = fitPart(Pi, 35 * v * push, 72 * u), w = f0.w, h = f0.h, ek = K(lt, 0.12, 0.42), e = eo(ek), fl = Math.sin(lt * 3.2) * 1.3 * v * e, wob = Math.sin(lt * 2.7) * 0.07; let px = W / 2, py = cy + fl, rot = -0.1 + wob, sxk = 1, a = 1;
        const shY = 73 * v - 1 * v; x.save(); if (ex0 && q.tr === 'Z') { x.translate(px, py); x.scale(1 + ex0 * 1.5, 1 + ex0 * 1.5); x.translate(-px, -py); }
        if (q.L === 0) { px -= (1 - e) * 80 * u; glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, e, shY); const lit = K(lt, 0.36, 0.22); drawImg(x, Pi.cv, px, py, w, h, rot, 1, 1); drawImg(x, Pi.black, px, py, w, h, rot, 1, 0.55 * (1 - lit)); if (lit > 0) { const fx = partFx(Pi, w, h, (s2, W2, H2) => { const g = s2.createRadialGradient(W2 * 0.45, H2 * 0.35, 0, W2 * 0.5, H2 * 0.45, H2 * 0.75); g.addColorStop(0, 'rgba(120,132,150,.55)'); g.addColorStop(1, 'rgba(30,34,40,.2)'); s2.fillStyle = g; s2.fillRect(0, 0, W2, H2); const g2 = s2.createLinearGradient(0, 0, W2, H2 * 0.5); g2.addColorStop(0, 'rgba(255,255,255,.22)'); g2.addColorStop(0.4, 'rgba(255,255,255,0)'); s2.fillStyle = g2; s2.fillRect(0, 0, W2, H2); }); drawFx(x, fx, px, py, w, h, rot, 1, eo(lit)); } if (lit > 0 && lit < 1) { x.save(); x.globalCompositeOperation = 'lighter'; drawImg(x, Pi.white, px, py, w, h, rot, 1, 0.35 * Math.sin(lit * Math.PI)); x.restore(); } }
        else if (q.L === 4) { const bk = K(lt, 0.12, 0.45), b = bk < 0.6 ? Math.pow(bk / 0.6, 2) : 1 - 0.1 * Math.sin((Math.PI * (bk - 0.6)) / 0.4); py -= (1 - b) * 50 * v; glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, b, shY); const c = eio(K(lt, 0.5, 0.45)); const fx = partFx(Pi, w, h, (s, W2, H2) => { const top = H2 * (1 - c); const g = s.createLinearGradient(0, top, 0, H2); g.addColorStop(0, 'rgba(255,224,138,.55)'); g.addColorStop(0.08, 'rgba(247,192,50,.28)'); g.addColorStop(1, 'rgba(247,192,50,.18)'); s.fillStyle = g; s.fillRect(0, top, W2, H2 - top); s.fillStyle = 'rgba(255,240,190,' + 0.8 * (1 - K(lt, 0.95, 0.15)) + ')'; s.fillRect(0, top, W2, Math.max(1, H2 * 0.006)); }); drawFx(x, fx, px, py, w, h, rot, 1, 1); }
        else if (q.L === 7) { const ang = (1 - e) * Math.PI * 2.5; sxk = Math.cos(ang); px += (1 - e) * 50 * u; glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, e, shY); const rf = K(lt, 0.5, 0.4); const fx = partFx(Pi, w, h, (s, W2, H2) => { s.fillStyle = 'rgba(0,0,0,' + 0.35 * (1 - Math.abs(sxk)) + ')'; s.fillRect(0, 0, W2, H2); if (rf > 0 && rf < 1) { const bx = -W2 * 0.6 + rf * W2 * 2.2; s.save(); s.translate(bx, 0); s.rotate(-0.5); const g = s.createLinearGradient(-W2 * 0.18, 0, W2 * 0.18, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); s.fillStyle = g; s.fillRect(-W2 * 0.18, -H2, W2 * 0.36, H2 * 3); s.restore(); } }); drawFx(x, fx, px, py, w, h, rot, Math.abs(sxk) < 0.02 ? 0.02 : sxk, 1); }
        else if (q.L === 5) { const r0 = (1 - e) * -2.2, sc = 1 + (1 - e) * 0.45; py += (1 - e) * 12 * v; glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, e, shY); if (ek < 1) for (let gI = 1; gI <= 3; gI++) drawImg(x, Pi.cv, px, py, w * sc, h * sc, rot + r0 + gI * 0.12 * (1 - e), 1, 0.16 * (1 - e)); drawImg(x, Pi.cv, px, py, w * sc, h * sc, rot + r0, 1, cl(e * 2)); const gk = K(lt, 0.5, 0.25); if (gk > 0 && gk < 1) { x.save(); x.globalCompositeOperation = 'lighter'; drawImg(x, Pi.white, px, py, w * sc, h * sc, rot + r0, 1, 0.3 * Math.sin(gk * Math.PI)); x.restore(); } }
        else if (q.L === 2) { px -= (1 - e) * 10 * u; glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, e, shY); x.save(); x.translate(px, py); x.rotate(rot); x.beginPath(); x.rect(-w / 2 - 2, -h / 2 - 2, (w + 4) * e, h + 4); x.clip(); x.scale(1, 0.88 + 0.12 * back(ek, 1.2)); x.drawImage(Pi.cv, -w / 2, -h / 2, w, h); x.restore(); if (ek > 0 && ek < 1) { x.save(); x.translate(px, py); x.rotate(rot); const ex2 = -w / 2 + w * e; const g = x.createLinearGradient(ex2 - w * 0.05, 0, ex2 + w * 0.02, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.35)'); x.fillStyle = g; x.fillRect(ex2 - w * 0.05, -h / 2, w * 0.07, h); x.restore(); } }
        else if (q.L === 6) { glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, e, shY); const N = 3, tw = w / N, th = h / N; let sd = 3; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647); x.save(); x.translate(px, py); x.rotate(rot); for (let r2 = 0; r2 < N; r2++) for (let c2 = 0; c2 < N; c2++) { const i = r2 * N + c2, k = back(K(lt, 0.12 + i * 0.03, 0.26), 1.3), dx = (rnd() - 0.5) * 60 * u, dy = (rnd() - 0.3) * 40 * v, ro = (rnd() - 0.5) * 1.4; x.save(); x.globalAlpha *= cl(K(lt, 0.12 + i * 0.03, 0.26) * 3); x.translate(-w / 2 + c2 * tw + tw / 2 + dx * (1 - k), -h / 2 + r2 * th + th / 2 + dy * (1 - k)); x.rotate(ro * (1 - k)); x.drawImage(Pi.cv, (c2 * Pi.w) / N, (r2 * Pi.h) / N, Pi.w / N, Pi.h / N, -tw / 2 - 0.5, -th / 2 - 0.5, tw + 1, th + 1); x.restore(); } x.restore(); }
        else { glowAndShadow(x, q.bg, Pi, px, py, w, h, rot, e, shY); drawImg(x, Pi.cv, px, py, w, h, rot, 1, e); }
        x.restore(); }
      // stock line + button
      const dk = eo(K(lt, 0.5, 0.15)), dy = (1 - dk) * 3 * v; x.save(); x.globalAlpha *= dk; x.fillStyle = T.d; x.font = '400 ' + 4.6 * u + 'px ' + F.in; x.fillText(q.d, mx, 78 * v + 4.6 * u * 0.9 + dy); x.restore(); x.save(); if (ex0) x.globalAlpha = eA; button(x, q.bg, q.b, 85 * v, dk * (ex0 ? eA : 1), dy); x.restore();
      x.restore(); 
    }
    function sceneWord(x, q, lt) {
      bg(x, q.bg, W / 2, H * 0.48); x.fillStyle = q.ink; const slam = q.k === 'slam', fs = slam ? 12 * u : 14 * u; x.font = '700 ' + fs + 'px ' + F.sg; const L = wrap(x, q.w, 76 * u), lh = fs * 1.0, y0 = H * 0.48 - ((L.length - 1) * lh) / 2;
      let s = 1; if (slam) { const k = K(lt, 0, 0.22); s = k < 1 ? 1.7 - 0.76 * ex(k) + 0.06 * Math.sin(k * Math.PI) : 1 + 0.015 * K(lt, 0.22, 0.38); }
      else s = 1 + 0.04 * (lt / q.dur);
      const shk = 0;
      x.save(); x.translate(W / 2, H * 0.48); x.scale(s, s); x.translate(-W / 2, -H * 0.48); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; L.forEach((ln, i) => x.fillText(ln, W / 2 + shk, y0 + i * lh + fs * 0.35)); x.restore(); /* 14 Oct §07 F: every final slide centred */ 
    }
    let dotSpr = null; const mkDot = () => { const c = mk(32, 32), x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,246,214,1)'); g.addColorStop(0.25, 'rgba(255,219,110,.95)'); g.addColorStop(0.55, 'rgba(247,192,50,.35)'); g.addColorStop(1, 'rgba(247,192,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 32, 32); return c; };
    // E4: round glowing golden dots stream in from the screen edges on swirling curves, speed up and pour into the logo; flash; all absorbed; logo 104→100; sweep; name; yellow slogan; hold; fade
    function sceneLogo(x, lt) {
      bg(x, C_G, W / 2, H * 0.42); const cx = W / 2, cy = H * 0.42, D = 46 * u; if (!dotSpr) dotSpr = mkDot();
      const solid = eo(K(lt, 0.72, 0.18)), flash = lt > 0.7 && lt < 0.98 ? Math.sin(K(lt, 0.7, 0.28) * Math.PI) : 0, sc = 1.04 - 0.04 * eio(K(lt, 0.78, 0.4));
      if (logoPts) { const per = (p) => { const L = 2 * (W + H), d = ((p.a0 / (Math.PI * 2)) * L) % L; return d < W ? [d, -2 * u] : d < W + H ? [W + 2 * u, d - W] : d < 2 * W + H ? [W - (d - W - H), H + 2 * u] : [-2 * u, H - (d - 2 * W - H)]; };
        x.save(); x.globalCompositeOperation = 'lighter';
        logoPts.forEach((p) => { const k = K(lt, p.dl * 0.55, 0.2 + p.du * 0.2); if (k <= 0) return; const fade = 1 - K(lt, 0.74 + p.g * 0.08, 0.1); if (fade <= 0) return;
          if (!p.e0) p.e0 = per(p); const e = k * k, sx = p.e0[0] - cx, sy = p.e0[1] - cy, r0 = Math.hypot(sx, sy), a0 = Math.atan2(sy, sx), tr = Math.hypot(p.tx, p.ty) * D, ta = Math.atan2(p.ty, p.tx), r = r0 + (tr - r0) * e, a = ta + (a0 - ta + p.spin) * (1 - e);
          const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r, d = (0.4 + p.s * 0.45) * u * 2.2; x.globalAlpha = (0.45 + 0.55 * k) * fade; x.drawImage(dotSpr, px - d / 2, py - d / 2, d, d); });
        x.restore(); }
      if (logoIm && solid > 0) { x.save(); x.globalAlpha = solid; x.translate(cx, cy); x.scale(sc, sc); x.beginPath(); x.arc(0, 0, D / 2, 0, Math.PI * 2); x.clip(); x.drawImage(logoIm, -D / 2, -D / 2, D, D); const sk = K(lt, 0.85, 0.5); if (sk > 0 && sk < 1) { const bx = -D + sk * D * 2; x.rotate(-0.4); const g = x.createLinearGradient(bx - D * 0.2, 0, bx + D * 0.2, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(-D, -D, D * 2, D * 2); } x.restore(); }
      if (flash > 0) { const g = x.createRadialGradient(cx, cy, 0, cx, cy, D); g.addColorStop(0, 'rgba(255,236,170,' + 0.55 * flash + ')'); g.addColorStop(1, 'rgba(255,236,170,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      const wk = eo(K(lt, 0.85, 0.3)); if (wk > 0) { x.save(); x.globalAlpha = wk; x.fillStyle = '#FFFFFF'; x.font = '600 ' + 5.6 * u + 'px ' + F.sg; const ls = 5.6 * u * (0.16 + 0.5 * (1 - wk)), ww = spaced(x, 'SAM ELECTRONICS', 0, 0, ls, true); spaced(x, 'SAM ELECTRONICS', cx - ww / 2, cy + D / 2 + 11 * u, ls); x.restore(); }
      const sk2 = eo(K(lt, 0.95, 0.2)); if (sk2 > 0) { x.save(); x.globalAlpha = sk2; x.fillStyle = C_Y; x.font = '500 ' + 3.4 * u + 'px ' + F.in; const ls = 3.4 * u * 0.14, ww = spaced(x, 'QUALITY · WARRANTY · PRICE', 0, 0, ls, true); spaced(x, 'QUALITY · WARRANTY · PRICE', cx - ww / 2, cy + D / 2 + 18 * u + (1 - sk2) * 2 * v, ls); x.restore(); }
      const fb = K(lt, 1.7, 0.5); if (fb > 0) { x.fillStyle = 'rgba(0,0,0,' + fb + ')'; x.fillRect(0, 0, W, H); }
    }
    function sceneIntro(x, lt) {
      x.fillStyle = C_G; x.fillRect(0, 0, W, H); /* 14 Oct §07 F: graphite, never black */ const g0 = x.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, H * 0.6); g0.addColorStop(0, '#2E3034'); g0.addColorStop(1, C_G); x.fillStyle = g0; x.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.42, D = 46 * u, zk = lt > 1.45 ? Math.pow(K(lt, 1.45, 0.35), 2.2) : 0, zs = 1 + zk * 7; x.save(); x.translate(cx, cy); x.scale(zs, zs); x.translate(-cx, -cy); x.globalAlpha = 1 - K(lt, 1.6, 0.2);
      const sc = 0.92 + 0.08 * eio(K(lt, 0, 1.45)), Ds = D * sc, sw = eio(K(lt, 0.1, 1.0)), lx = -Ds * 1.2 + sw * Ds * 2.6;
      if (logoIm) { x.save(); x.translate(cx, cy); x.beginPath(); x.arc(0, 0, Ds / 2, 0, Math.PI * 2); x.clip(); x.globalAlpha *= 0.12; x.drawImage(logoIm, -Ds / 2, -Ds / 2, Ds, Ds); x.restore();
        x.save(); x.translate(cx, cy); x.beginPath(); x.arc(0, 0, Ds / 2, 0, Math.PI * 2); x.clip(); x.rotate(-0.55); x.beginPath(); x.rect(-Ds * 2, -Ds * 2, Ds * 2 + lx, Ds * 4); x.clip(); x.rotate(0.55); x.drawImage(logoIm, -Ds / 2, -Ds / 2, Ds, Ds);
        if (sw > 0 && sw < 1) { x.rotate(-0.55); const g = x.createLinearGradient(lx - Ds * 0.3, 0, lx + Ds * 0.06, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.8, 'rgba(255,248,225,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(lx - Ds * 0.3, -Ds * 2, Ds * 0.36, Ds * 4); } x.restore();
        if (sw > 0 && sw < 1) { x.save(); x.globalCompositeOperation = 'lighter'; x.translate(cx, cy); x.rotate(-0.55); const g = x.createLinearGradient(lx - Ds * 0.5, 0, lx + Ds * 0.5, 0); g.addColorStop(0, 'rgba(255,220,140,0)'); g.addColorStop(0.5, 'rgba(255,220,140,.14)'); g.addColorStop(1, 'rgba(255,220,140,0)'); x.fillStyle = g; x.fillRect(lx - Ds * 0.5, -H, Ds, H * 2); x.restore(); } }
      const wk = eo(K(lt, 0.6, 0.6)); if (wk > 0) { x.save(); x.globalAlpha *= wk; x.fillStyle = '#FFFFFF'; x.font = '600 ' + 5.6 * u + 'px ' + F.sg; const ls = 5.6 * u * (0.16 + 0.9 * (1 - wk)), ww = spaced(x, 'SAM ELECTRONICS', 0, 0, ls, true); spaced(x, 'SAM ELECTRONICS', cx - ww / 2, cy + D / 2 + 11 * u, ls); x.restore(); }
      const sk = eo(K(lt, 1.0, 0.3)); if (sk > 0) { x.save(); x.globalAlpha *= sk; x.fillStyle = C_Y; x.font = '500 ' + 3.4 * u + 'px ' + F.in; const ls = 3.4 * u * 0.14, ww = spaced(x, 'QUALITY · WARRANTY · PRICE', 0, 0, ls, true); spaced(x, 'QUALITY · WARRANTY · PRICE', cx - ww / 2, cy + D / 2 + 18 * u + (1 - sk) * 2 * v, ls); x.restore(); }
      x.restore(); const fi = 1 - K(lt, 0, 0.25); if (fi > 0) { x.fillStyle = 'rgba(0,0,0,' + fi + ')'; x.fillRect(0, 0, W, H); }
    }
    function scene(x, q, lt, exitK) { x.save(); if (q.k === 'a') sceneA(x, q, lt, exitK); else if (q.k === 'b') sceneB(x, q, lt, exitK); else if (q.k === 'logo') sceneLogo(x, lt); else if (q.k === 'intro') sceneIntro(x, lt); else sceneWord(x, q, lt); x.restore(); }

    function draw(t) {
      if (cv.width !== W || cv.height !== H) resize();
      t = ((t % TOT) + TOT) % TOT; let i = SC.length - 1; for (let k = 0; k < SC.length; k++) if (t < SC[k].st + SC[k].dur) { i = k; break; }
      const q = SC[i], lt = t - q.st, pv = SC[(i + SC.length - 1) % SC.length], x = ctx; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      const TR = 0.15, hard = q.k === 'word' || q.k === 'slam' || q.k === 'logo' || q.k === 'intro';
      if (hard || lt >= TR) { scene(x, q, lt); return i; }
      const k = mode === 'A' ? eio(lt / TR) : eio(lt / TR), a = bufA.getContext('2d'), b = bufB.getContext('2d');
      a.setTransform(1, 0, 0, 1, 0, 0); b.setTransform(1, 0, 0, 1, 0, 0);
      const fromBlack = pv.k === 'logo';
      if (fromBlack) { a.fillStyle = C_G; a.fillRect(0, 0, W, H); } else scene(a, pv, pv.dur, mode === 'B' ? k : 0);
      scene(b, q, lt);
      const tr = mode === 'A' ? 'A' : q.tr;
      if (tr === 'A') { x.drawImage(bufA, 0, 0); const top = H * (1 - k); x.drawImage(bufB, 0, top, W, H - top, 0, top, W, H - top); }
      else if (tr === 'D') { x.drawImage(bufA, 0, 0); x.save(); x.beginPath(); const s = (W + H) * k; x.moveTo(0, H); x.lineTo(0, H - s); x.lineTo(s, H); x.closePath(); x.moveTo(0, 0); x.closePath(); const s2 = (W + H) * 1.0 * k; x.beginPath(); x.moveTo(-W, H); x.lineTo(-W + s2 * 1.5, H); x.lineTo(-W + s2 * 1.5 + H * 0.6, 0); x.lineTo(-W, 0); x.closePath(); x.clip(); x.drawImage(bufB, 0, 0); x.restore(); }
      else if (tr === 'W') { const ox = -k * W; const bl = Math.sin(k * Math.PI); x.globalAlpha = 1; x.drawImage(bufA, ox, 0); x.drawImage(bufB, ox + W, 0); if (bl > 0.05) { x.globalAlpha = 0.22 * bl; [-1, 1, 2].forEach((g) => { x.drawImage(bufA, ox + g * 5 * u * bl, 0); x.drawImage(bufB, ox + W + g * 5 * u * bl, 0); }); x.globalAlpha = 1; } }
      else { const zc = [W / 2, 57.5 * v]; x.save(); const s0 = 0.7 + 0.3 * eo(k); x.translate(zc[0], zc[1]); x.scale(s0, s0); x.translate(-zc[0], -zc[1]); x.drawImage(bufB, 0, 0); x.restore(); x.save(); x.globalAlpha = 1 - k; const s1 = 1 + 2.2 * k; x.translate(zc[0], zc[1]); x.scale(s1, s1); x.translate(-zc[0], -zc[1]); x.drawImage(bufA, 0, 0); x.restore(); }
      return i;
    }
    return { draw, setLib, dur: TOT, logoT: LOGO_T, scenes: SC, mode, canvas: cv };
  }
  window.SETdAd = { create, SCN_B };
  try { document.fonts && ['700 40px "Space Grotesk"', '600 40px "Space Grotesk"', '400 20px Inter', '600 20px Inter', '500 20px "JetBrains Mono"'].forEach((f) => document.fonts.load(f)); } catch (e) {}
})();
