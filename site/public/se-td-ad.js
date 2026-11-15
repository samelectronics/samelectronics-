// Sam Electronics · TEARDOWN final-call commercial, drawn on the 3D phone's screen.
// Owner (27 Oct): rebuilt as a real ad with energy, in the hero phone ads' look (same type, colours, margins, kicker /
// two-line title / product / CTA pill, progress dashes) and the Find My Part groups:
//   OPEN (logo, ring, wordmark) → 6 scenes, each with its own transition (feed push, circle wipe, whip pan, zoom-through)
//   and its own colour (yellow / graphite / white), kinetic titles, the 3D pose render, items with stock dots, a Shop pill
//   → montage (every part, flash cuts) → "Get yours today." → "In stock in Deira." → CLOSE (particles gather into the logo).
// Type: Space Grotesk 700 (titles), Inter (body), JetBrains Mono (kickers, data). Brand yellow #F7C032, graphite #26282B.
// API kept for se-teardown-3d.js: const ad = SETdAd.create(canvas, { lib, data }); ad.draw(t); ad.dur; ad.logoT; ad.setLib(lib)
(function () {
  const Y = '#F7C032', G = '#26282B';
  const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), K = (t, a, d) => cl((t - a) / d), lerp = (a, b, k) => a + (b - a) * k;
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3), eo5 = (x) => 1 - Math.pow(1 - cl(x), 5), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x) => { x = cl(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const F = { sg: '"Space Grotesk","IBM Plex Sans Arabic",sans-serif', in: 'Inter,"IBM Plex Sans Arabic",sans-serif', jb: '"JetBrains Mono","IBM Plex Sans Arabic",monospace' };
  const T = (s) => (window.seI18n ? window.seI18n.t(s) : s), AR = () => !!(window.seI18n && (window.seI18n.rtl ? window.seI18n.rtl() : window.seI18n.lang() === 'ar')); // right-to-left: Arabic and Persian
  // the three looks of the hero phone ads
  const TH = {
    yel: { bg: ['#FFE291', Y, Y], ink: G, sub: G, kick: 'rgba(38,40,43,.7)', cta: G, ctaInk: '#FFFFFF', dot: 'rgba(38,40,43,.18)', glow: 'rgba(255,250,228,.75)' },
    dark: { bg: ['#4B4B49', '#303132', '#1E1F21'], ink: '#FFFFFF', sub: '#D5D7DA', kick: Y, cta: Y, ctaInk: G, dot: 'rgba(255,255,255,.18)', glow: 'rgba(255,226,150,.38)' },
    light: { bg: ['#FFFFFF', '#F6F4F0', '#E5E1D9'], ink: G, sub: '#3D3E3F', kick: 'rgba(38,40,43,.7)', cta: G, ctaInk: '#FFFFFF', dot: 'rgba(38,40,43,.16)', glow: 'rgba(255,206,96,.3)' },
  };
  // the six Find My Part groups (sample stock, as in the picker)
  const SCN = [
    { k: 'DISPLAY', t: ['Every', 'screen.'], id: 'samsung-sp', th: 'yel', cta: 'Shop screens', tr: 'push', it: [['Full Display Screen', 2], ['Display with frame', 0], ['Touch glass', 0]] },
    { k: 'POWER & CHARGING', t: ['Full', 'power.'], id: 'part-bat', th: 'dark', cta: 'Shop batteries', tr: 'circle', it: [['Battery', 2], ['Charging connector flex', 2], ['Charging connector', 0]] },
    { k: 'HOUSING', t: ['Like new,', 'again.'], id: 'part-bcv', th: 'light', cta: 'Shop back covers', tr: 'whip', it: [['Back cover', 2], ['Back cover with chassis', 1], ['Screw set', 0]] },
    { k: 'CAMERAS', t: ['Sharp', 'every shot.'], id: 'part-cam', th: 'yel', cta: 'Shop cameras', tr: 'zoom', it: [['Rear camera', 1], ['Front camera', 0], ['Camera lens', 0]] },
    { k: 'AUDIO & SENSORS', t: ['Loud and', 'clear.'], id: 'part-aud', th: 'dark', cta: 'Shop audio parts', tr: 'push', it: [['Earpiece speaker', 0], ['Buzzer & speaker', 0], ['Microphone', 0]] },
    { k: 'FLEX & SMALL PARTS', t: ['Every', 'last part.'], id: 'part-sml', th: 'light', cta: 'Shop small parts', tr: 'circle', it: [['SIM tray', 1], ['Fingerprint reader', 0], ['Volume flex', 0]] },
  ];
  const OPEN = 1.3, SD = 1.75, TRD = 0.34, MONT = 1.3, CALL = 2.3, CLOSE = 2.6;
  const S0 = OPEN, M0 = S0 + SCN.length * SD, C0 = M0 + MONT, L0 = C0 + CALL, TOT = L0 + CLOSE, LOGO_T = L0 + 0.9;
  function rr(x, X, Yy, w, h, r) { x.beginPath(); x.moveTo(X + r, Yy); x.arcTo(X + w, Yy, X + w, Yy + h, r); x.arcTo(X + w, Yy + h, X, Yy + h, r); x.arcTo(X, Yy + h, X, Yy, r); x.arcTo(X, Yy, X + w, Yy, r); x.closePath(); }
  function create(cv, opts) {
    // owner (27 Oct): a real safe area. The ad is drawn on an off-screen canvas and placed INSIDE the screen (clear of the
    // rounded corners, the island and the edges); the margin is filled with the ad's own edge colour, so it reads as a screen
    // owner (28 Oct): no more 'video cut out and pasted in'. The ad IS the phone's screen: its colours run edge to edge under
    // the glass, the status bar (time, signal, battery) sits at the top beside the island like a real phone, and only the
    // ad's CONTENT is kept inside a safe area (a little smaller, below the status bar), never touching corners or edges.
    const out = cv.getContext('2d'), x = out, W = cv.width, H = cv.height, u = W / 100, M = 9 * u, SAFE = { s: 0.88, top: 0.075 };
    const FULL = [-W * 0.2, -H * 0.2, W * 1.4, H * 1.4]; // any full-screen fill bleeds past the safe area to the real edges
    let lang = null, imgs = [];
    const load = () => { lang = AR(); imgs = SCN.map((q) => { const im = new Image(); im.decoding = 'async'; im.src = window.SE_SHOTS ? window.SE_SHOTS.url(q.id, 960) : ''; return im; }); };
    load();
    const logo = new Image(); logo.src = (opts && opts.logo) || '/assets/se-logo-512.webp';
    // particles for the close: they come in from the edges and settle on the logo ring
    const PN = 180, PT = Array.from({ length: PN }, (_, i) => { const a = Math.random() * Math.PI * 2, e = Math.random(); const side = i % 4; const sx = side === 0 ? -0.1 : side === 1 ? 1.1 : Math.random(), sy = side === 2 ? -0.1 : side === 3 ? 1.1 : Math.random(); return { sx, sy, a, r: 0.86 + e * 0.14, s: 0.5 + Math.random() * 1.4, d: Math.random() * 0.35, sw: (Math.random() - 0.5) * 1.6 }; });
    const ok = (im) => im && im.complete && im.naturalWidth;
    // ---------- pieces ----------
    function bg(th, a = 1) { const c = TH[th].bg, g = x.createRadialGradient(W / 2, H * 0.36, 0, W / 2, H * 0.36, H * 0.75); g.addColorStop(0, c[0]); g.addColorStop(0.52, c[1]); g.addColorStop(1, c[2]); x.globalAlpha = a; x.fillStyle = g; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; }
    function dashes(i, th, k) { // the progress dashes under the island, like the hero reel
      const n = SCN.length, gw = 1.6 * u, w = (W - 2 * M - gw * (n - 1)) / n, y = 10.5 * u, ar = AR();
      for (let j = 0; j < n; j++) { const X = ar ? W - M - (j + 1) * w - j * gw : M + j * (w + gw); x.fillStyle = TH[th].dot; rr(x, X, y, w, 0.55 * u, 0.27 * u); x.fill(); const f = j < i ? 1 : j === i ? k : 0; if (f > 0) { x.fillStyle = TH[th].ink; rr(x, ar ? X + w * (1 - f) : X, y, w * f, 0.55 * u, 0.27 * u); x.fill(); } } }
    function text(s, X, Yy, font, col, align) { x.font = font; x.fillStyle = col; x.textAlign = align; x.direction = AR() ? 'rtl' : 'ltr'; x.fillText(s, X, Yy); x.direction = 'ltr'; }
    function scene(i, lt) { // one product scene, lt = its local time (0 = its transition starts)
      const q = SCN[i], th = TH[q.th], ar = AR(), al = ar ? 'right' : 'left', X0 = ar ? W - M : M, dir = ar ? -1 : 1;
      bg(q.th);
      // R12 (owner: "energetic, different styles, zoom in and out, text from here and there, boom effects"):
      // speed stripes sweeping through, a giant outline word sliding across, a camera shake + flash + burst when the
      // product lands, and a punch zoom-out at the end of every scene
      const acc = q.th === 'yel' ? 'rgba(38,40,43,' : 'rgba(247,192,50,';
      x.save(); x.beginPath(); x.rect(FULL[0], FULL[1], FULL[2], FULL[3]); x.clip();
      { const sp = (lt * 0.9 + i * 0.37) % 1; x.save(); x.translate(W / 2, H / 2); x.rotate(-0.42); for (let k2 = 0; k2 < 5; k2++) { const off = ((sp + k2 * 0.21) % 1) * H * 2.2 - H * 1.1; x.fillStyle = acc + (0.05 + 0.03 * (k2 % 2)) + ')'; x.fillRect(-W, off, W * 2, (3 + k2 * 1.5) * u); } x.restore(); }
      { const word = T(q.t[0]).toUpperCase(), gx = lerp(W * 1.1, -W * 1.6, K(lt, 0, SD)); x.save(); x.globalAlpha = 0.09; x.translate(gx, H * 0.62); x.rotate(-0.12); x.font = '800 ' + 34 * u + 'px ' + F.sg; x.lineWidth = 0.5 * u; x.strokeStyle = q.th === 'yel' ? G : Y; x.textAlign = 'left'; x.strokeText(word, 0, 0); x.restore(); }
      x.restore();
      const land = lt - 0.62, shake = land > 0 && land < 0.28 ? (1 - land / 0.28) * 1.6 * u : 0, zEnd = 1 + 0.07 * eio(K(lt, SD - 0.35, 0.35));
      x.save(); x.translate(W / 2 + (shake ? (Math.random() * 2 - 1) * shake : 0), H / 2 + (shake ? (Math.random() * 2 - 1) * shake : 0)); x.scale(zEnd, zEnd); x.translate(-W / 2, -H / 2);
      // a soft glow behind the product
      { const g = x.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, W * 0.55); g.addColorStop(0, th.glow); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); }
      dashes(i, q.th, cl(lt / SD));
      x.textBaseline = 'alphabetic';
      // kicker: number + group, slides in from the reading side
      { const k = eo(K(lt, 0.18, 0.35)); x.globalAlpha = k; text(String(i + 1).padStart(2, '0') + ' / ' + T(q.k), X0 - dir * (1 - k) * 6 * u, 21 * u, '600 ' + 3.3 * u + 'px ' + F.jb, th.kick, al); x.globalAlpha = 1; }
      // the title: each word slams in from its own side (scale 1.35 → 1, from transparent), the second 110ms later
      q.t.forEach((w2, j) => { const k = K(lt, 0.24 + j * 0.11, 0.32), e = back(k), s = lerp(1.35, 1, eo(k)), y = 33 * u + j * 12 * u, from = (j % 2 ? 1 : -1) * dir * 14 * u;
        if (k <= 0) return; x.save(); x.globalAlpha = cl(k * 2.2); x.translate(X0 + from * (1 - e), y); x.scale(s, s); text(T(w2), 0, 0, '700 ' + 11.6 * u + 'px ' + F.sg, j === 1 && q.th === 'dark' ? Y : th.ink, al); x.restore(); });
      // the product: drops in with a small overshoot, then floats; a slow push-in for the rest of the scene
      { const im = imgs[i], k = K(lt, 0.3, 0.55), e = back(k), fl = Math.sin((lt - 0.85) * 2.4) * 0.6 * u * cl(lt - 0.85), push = 1 + 0.035 * K(lt, 0.6, SD), S = W * 0.98 * push, cy = H * 0.5 + (1 - e) * 12 * u + fl;
        if (ok(im) && k > 0) { x.globalAlpha = cl(k * 2); x.drawImage(im, W / 2 - S / 2, cy - S / 2, S, S); x.globalAlpha = 1; } }
      // BOOM: when the product lands, a flash ring and burst rays
      if (land > 0 && land < 0.5) { const b = land / 0.5, cx = W / 2, cy = H * 0.5; x.save(); x.globalAlpha = (1 - b) * 0.9; x.strokeStyle = q.th === 'yel' ? '#FFFFFF' : Y; x.lineWidth = (1 - b) * 2.2 * u; x.beginPath(); x.arc(cx, cy, W * (0.15 + b * 0.55), 0, 7); x.stroke();
        for (let r2 = 0; r2 < 12; r2++) { const a2 = r2 * Math.PI / 6 + i, r0 = W * (0.22 + b * 0.3), r1 = r0 + W * 0.12 * (1 - b); x.beginPath(); x.moveTo(cx + Math.cos(a2) * r0, cy + Math.sin(a2) * r0); x.lineTo(cx + Math.cos(a2) * r1, cy + Math.sin(a2) * r1); x.stroke(); }
        if (land < 0.08) { x.globalAlpha = (1 - land / 0.08) * 0.5; x.fillStyle = '#FFFFFF'; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); } x.restore(); }
      // the items, each with a stock dot (green = in stock, grey = on request), ticking in
      q.it.forEach(([name, st], j) => { const k = eo(K(lt, 0.62 + j * 0.09, 0.3)), y = H * 0.745 + j * 5.6 * u; if (k <= 0) return; x.globalAlpha = k; const xo = X0 - dir * (1 - k) * 5 * u;
        x.fillStyle = st ? '#2BB673' : (q.th === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(38,40,43,.3)'); x.beginPath(); x.arc(ar ? xo - 0.9 * u : xo + 0.9 * u, y - 1.2 * u, 0.9 * u, 0, 7); x.fill();
        text(T(name), ar ? xo - 3 * u : xo + 3 * u, y, '500 ' + 3.7 * u + 'px ' + F.in, th.sub, al);
        text(st ? (ar ? T('in stock') + ' ' + st : st + ' in stock') : T('On request'), ar ? M : W - M, y, '600 ' + 3.1 * u + 'px ' + F.jb, st ? (q.th === 'yel' ? '#1E7A4C' : '#2BB673') : th.kick, ar ? 'left' : 'right'); x.globalAlpha = 1; });
      x.restore();
      // the Shop pill (full width, like the hero ads)
      { const k = eo(K(lt, 0.85, 0.35)), y = H - 21 * u + (1 - k) * 4 * u; x.globalAlpha = k; x.fillStyle = th.cta; rr(x, M, y, W - 2 * M, 9.5 * u, 4.75 * u); x.fill();
        text(T(q.cta), ar ? W - M - 5 * u : M + 5 * u, y + 6.1 * u, '600 ' + 4 * u + 'px ' + F.in, th.ctaInk, al); text(ar ? '←' : '→', ar ? M + 5 * u : W - M - 5 * u, y + 6.2 * u, '600 ' + 4.4 * u + 'px ' + F.in, th.ctaInk, ar ? 'left' : 'right'); x.globalAlpha = 1; }
    }
    // a transition into scene i: the previous frame is drawn, then the new scene is revealed its own way
    function into(i, lt, prev) {
      const tr = SCN[i].tr, k = eio(K(lt, 0, TRD)), ar = AR();
      if (k >= 1) { scene(i, lt); return; }
      if (tr === 'zoom') { // zoom-through: the new scene is already there; the old one flies toward the viewer and fades
        scene(i, lt); const s2 = lerp(1, 1.9, k); x.save(); x.globalAlpha = 1 - k; x.translate(W / 2, H * 0.48); x.scale(s2, s2); x.translate(-W / 2, -H * 0.48); prev(); x.restore(); x.globalAlpha = 1; return; }
      prev();
      x.save();
      if (tr === 'push') { x.translate(0, (1 - k) * H); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, -2 * u, W, 2 * u); }
      else if (tr === 'circle') { x.beginPath(); x.arc(W / 2, H * 0.5, Math.hypot(W, H) * 0.6 * k, 0, 7); x.clip(); }
      else if (tr === 'whip') { const d = (ar ? -1 : 1) * (1 - k) * W; x.translate(d, 0); }
      scene(i, lt); x.restore();
      if (tr === 'whip') { x.globalAlpha = 0.35 * Math.sin(k * Math.PI); x.fillStyle = '#FFFFFF'; for (let j = 0; j < 9; j++) x.fillRect(0, H * (0.1 + j * 0.1), W, 0.35 * u); x.globalAlpha = 1; }
    }
    function open(lt) { // the logo opens: ring draws, logo lands, wordmark tracks in, then a zoom-through into scene 1
      bg('dark'); const cx = W / 2, cy = H * 0.42, r = W * 0.17, ar = AR();
      const ring = eo(K(lt, 0.05, 0.5)); x.strokeStyle = Y; x.lineWidth = 1.2 * u; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r + 2.2 * u, -Math.PI / 2, -Math.PI / 2 + ring * Math.PI * 2); x.stroke();
      const lk = back(K(lt, 0.25, 0.45)); if (ok(logo) && lk > 0) { const s = r * lk; x.save(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); x.drawImage(logo, cx - s, cy - s, s * 2, s * 2); x.restore(); }
      const wk = eo(K(lt, 0.45, 0.5)); x.globalAlpha = wk; x.textAlign = 'center'; x.fillStyle = '#FFFFFF'; x.font = '600 ' + 5.4 * u + 'px ' + F.sg; if ('letterSpacing' in x) x.letterSpacing = lerp(3.2, 0.9, wk) * u + 'px'; x.fillText(ar ? T('SAM ELECTRONICS') : 'SAM ELECTRONICS', cx, cy + r + 13 * u); if ('letterSpacing' in x) x.letterSpacing = '0px';
      x.fillStyle = Y; x.font = '500 ' + 3.2 * u + 'px ' + F.jb; x.fillText(T('Every part. Every model.'), cx, cy + r + 20 * u); x.globalAlpha = 1;
      const z = K(lt, OPEN - 0.3, 0.3); if (z > 0) { x.globalAlpha = eio(z); x.fillStyle = Y; x.beginPath(); x.arc(cx, cy, Math.hypot(W, H) * eio(z), 0, 7); x.fill(); x.globalAlpha = 1; } }
    function montage(lt) { // every part, 0.2s each, colour swaps and punch-ins, flash cuts
      const n = SCN.length, d = MONT / n, j = Math.min(n - 1, Math.floor(lt / d)), l = lt - j * d, th = ['yel', 'dark', 'light'][j % 3];
      bg(th); const im = imgs[j], s = W * (1.08 + 0.12 * eo(l / d)); if (ok(im)) x.drawImage(im, W / 2 - s / 2, H * 0.48 - s / 2, s, s);
      x.textAlign = AR() ? 'right' : 'left'; x.globalAlpha = 0.9; text(T(SCN[j].k), AR() ? W - M : M, 21 * u, '600 ' + 3.3 * u + 'px ' + F.jb, TH[th].kick, AR() ? 'right' : 'left'); x.globalAlpha = 1;
      const fl = 1 - cl(l / 0.07); if (fl > 0) { x.globalAlpha = fl * 0.85; x.fillStyle = '#FFFFFF'; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } }
    function call(lt) { // "Get yours today." on yellow, then "In stock in Deira." on graphite
      const ar = AR(), dir = ar ? -1 : 1, al = ar ? 'right' : 'left', X0 = ar ? W - M : M;
      if (lt < 1.15) { bg('yel'); x.textBaseline = 'alphabetic';
        [['Get', -1, 0], ['yours', 1, 0.08], ['today.', -1, 0.16]].forEach(([w2, from, d], j) => { const k = K(lt, 0.05 + d, 0.3), e = back(k), s = lerp(1.5, 1, eo(k)); if (k <= 0) return; x.save(); x.globalAlpha = cl(k * 2.5); x.translate(X0 + from * dir * 20 * u * (1 - e), H * 0.4 + j * 16 * u); x.scale(s, s); text(T(w2), 0, 0, '700 ' + 17 * u + 'px ' + F.sg, G, al); x.restore(); });
        const lk = eo(K(lt, 0.55, 0.35)); x.fillStyle = G; x.fillRect(ar ? X0 - 40 * u * lk : X0, H * 0.4 + 36 * u, 40 * u * lk, 1.4 * u);
        const fl = K(lt, 1.0, 0.15); if (fl > 0) { x.globalAlpha = fl; x.fillStyle = '#FFFFFF'; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } return; }
      const l = lt - 1.15; bg('dark'); const fl = 1 - cl(l / 0.15);
      [['In stock', '#FFFFFF'], ['in Deira.', Y]].forEach(([w2, c], j) => { const k = K(l, 0.05 + j * 0.12, 0.35), e = eo5(k); if (k <= 0) return; x.save(); x.beginPath(); x.rect(0, H * 0.36 + j * 15 * u - 14 * u, W, 17 * u); x.clip(); x.globalAlpha = 1; text(T(w2), X0, H * 0.36 + j * 15 * u + (1 - e) * 15 * u, '700 ' + 14.5 * u + 'px ' + F.sg, c, al); x.restore(); });
      const mk = eo(K(l, 0.45, 0.35)); x.globalAlpha = mk; text(T('AL MURAR · DEIRA · DUBAI'), X0, H * 0.36 + 30 * u, '600 ' + 3.2 * u + 'px ' + F.jb, '#D5D7DA', al);
      text(T('14 brands · shipped worldwide'), X0, H * 0.36 + 36 * u, '500 ' + 3.6 * u + 'px ' + F.in, '#9DA1A6', al); x.globalAlpha = 1;
      if (fl > 0) { x.globalAlpha = fl; x.fillStyle = '#FFFFFF'; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } }
    function close(lt) { // particles gather into the logo, the wordmark, the slogan, the Find My Part pill
      bg('dark'); const cx = W / 2, cy = H * 0.4, r = W * 0.19, ar = AR();
      const gk = K(lt, 0, 0.95);
      x.fillStyle = Y; PT.forEach((p) => { const k = eio(K(gk, p.d, 1 - p.d)); if (k >= 1 && lt > 1.0) return; const a = p.a + p.sw * (1 - k) * 2, tx = cx + Math.cos(a) * r * p.r, ty = cy + Math.sin(a) * r * p.r, X = lerp(p.sx * W, tx, k), Yy = lerp(p.sy * H, ty, k); x.globalAlpha = (1 - K(lt, 0.9, 0.3)) * 0.9; x.beginPath(); x.arc(X, Yy, p.s * u * 0.45, 0, 7); x.fill(); });
      x.globalAlpha = 1;
      const lk = eo(K(lt, 0.85, 0.35)); if (ok(logo) && lk > 0) { const s = r * lerp(1.04, 1, lk); x.globalAlpha = lk; x.save(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); x.drawImage(logo, cx - s, cy - s, s * 2, s * 2); x.restore(); x.globalAlpha = 1;
        const sw = K(lt, 1.15, 0.5); if (sw > 0 && sw < 1) { x.save(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); const gx = lerp(cx - s * 1.6, cx + s * 1.6, eio(sw)), g = x.createLinearGradient(gx - s * 0.4, 0, gx + s * 0.4, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - s, cy - s, s * 2, s * 2); x.restore(); } }
      const wk = eo(K(lt, 1.05, 0.45)); x.globalAlpha = wk; x.textAlign = 'center'; x.fillStyle = '#FFFFFF'; x.font = '600 ' + 6 * u + 'px ' + F.sg; if ('letterSpacing' in x) x.letterSpacing = lerp(2.4, 0.9, wk) * u + 'px'; x.fillText(ar ? T('SAM ELECTRONICS') : 'SAM ELECTRONICS', cx, cy + r + 13 * u); if ('letterSpacing' in x) x.letterSpacing = '0px';
      x.fillStyle = Y; x.font = '500 ' + 3.4 * u + 'px ' + F.jb; x.fillText(T('QUALITY · WARRANTY · PRICE'), cx, cy + r + 20 * u); x.globalAlpha = 1;
      const pk = eo(K(lt, 1.4, 0.4)), pulse = 1 + 0.03 * Math.sin(Math.max(0, lt - 1.8) * 7) * cl(lt - 1.8); x.globalAlpha = pk; x.save(); x.translate(cx, H - 22 * u); x.scale(pulse, pulse); x.fillStyle = Y; rr(x, -30 * u, -5 * u, 60 * u, 10 * u, 5 * u); x.fill(); text(T('Find My Part') + (ar ? '  ←' : '  →'), 0, 1.5 * u, '600 ' + 4 * u + 'px ' + F.in, G, 'center'); x.restore(); x.globalAlpha = 1;
      const out = K(lt, CLOSE - 0.25, 0.25); if (out > 0) { x.globalAlpha = out; x.fillStyle = '#000'; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } }
    function status(dark) { // the status bar: the time, signal and battery, in the screen's ink (in the 'ears' beside the island, clear of the corners)
      const M = 19 * u, Y0 = 1.8 * u; /* R10 C4: a real safe margin from the rounded corners */ const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'), c = dark ? '#FFFFFF' : G;
      x.globalAlpha = 0.9; x.fillStyle = c; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = '600 ' + 3.4 * u + 'px ' + F.in; x.fillText(hh + ':' + mm, M, 6.4 * u + Y0);
      for (let j = 0; j < 4; j++) x.fillRect(W - M - 11.5 * u + j * 1.3 * u, 6.6 * u + Y0 - (j + 1) * 0.55 * u, 0.85 * u, (j + 1) * 0.55 * u);
      x.strokeStyle = c; x.lineWidth = 0.3 * u; rr(x, W - M - 5.6 * u, 4.6 * u + Y0, 5 * u, 2.4 * u, 0.6 * u); x.stroke(); x.fillRect(W - M - 5.1 * u, 5.1 * u + Y0, 3.6 * u, 1.4 * u); x.globalAlpha = 1; x.textBaseline = 'alphabetic'; }
    // ───────── R12 (owner: "redo it all: zoom in, zoom out, texts, energetic, not a copy of the hero") ─────────
    // A fast kinetic commercial: one word per beat, hard cuts, every beat its own move (slam, zoom-out, spin, split),
    // products crashing in (spin-zoom, swing, punch, flip, drop) with giant vertical words and live counters, a strobe of
    // every part, the grades flashing, then IN STOCK IN DEIRA + a bouncing SHOP NOW, then the logo close.
    const BEATS = [
      { d: 0.55, f: (l) => slam('TAKE', l, 'dark', 'zoom') },
      { d: 0.5, f: (l) => slam('ANY', l, 'yel', 'side') },
      { d: 0.5, f: (l) => slam('PHONE', l, 'light', 'spin') },
      { d: 0.65, f: (l) => slam('APART.', l, 'dark', 'split') },
      { d: 1.0, f: (l) => prod(0, l, 'yel', 'spin', 'SCREENS', '1,902') },
      { d: 1.0, f: (l) => prod(1, l, 'dark', 'swing', 'BATTERIES', '1,455') },
      { d: 1.0, f: (l) => prod(3, l, 'light', 'punch', 'CAMERAS', '494') },
      { d: 1.0, f: (l) => prod(2, l, 'yel', 'flip', 'BACK COVERS', '1,436') },
      { d: 1.0, f: (l) => prod(5, l, 'dark', 'drop', 'FLEX & SMALL', '331') },
      { d: 0.72, f: (l) => strobe(l) },
      { d: 1.1, f: (l) => grades(l) },
      { d: 1.7, f: (l) => finale(l) },
    ];
    const BT = BEATS.reduce((a2, b2) => a2 + b2.d, 0);
    const fill = (th) => { const c = th === 'yel' ? Y : th === 'light' ? '#F4F2EE' : '#1E1F21'; x.fillStyle = c; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); };
    const inkOf = (th) => (th === 'dark' ? '#FFFFFF' : G), accOf = (th) => (th === 'dark' ? Y : th === 'yel' ? '#FFFFFF' : Y);
    const flash = (l, c = '#FFFFFF') => { if (l < 0.07) { x.globalAlpha = (1 - l / 0.07) * 0.8; x.fillStyle = c; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } };
    const shake = (l, amt) => { const k = l < 0.22 ? (1 - l / 0.22) * amt * u : 0; return [(Math.random() * 2 - 1) * k, (Math.random() * 2 - 1) * k]; };
    const streaks = (l, th, ang) => { x.save(); x.translate(W / 2, H / 2); x.rotate(ang); for (let k2 = 0; k2 < 7; k2++) { const off = (((l * 1.8 + k2 * 0.17) % 1) - 0.5) * H * 2; x.fillStyle = (th === 'yel' ? 'rgba(38,40,43,' : 'rgba(247,192,50,') + (0.06 + 0.04 * (k2 % 2)) + ')'; x.fillRect(-W, off, W * 2, (2 + (k2 % 3) * 2.5) * u); } x.restore(); };
    const big = (str, size, col, X, Yy, al = 'center', stroke = false) => { x.font = '800 ' + size + 'px ' + F.sg; x.textAlign = al; x.textBaseline = 'middle'; if (stroke) { x.lineWidth = 0.45 * u; x.strokeStyle = col; x.strokeText(str, X, Yy); } else { x.fillStyle = col; x.fillText(str, X, Yy); } x.textBaseline = 'alphabetic'; };
    function slam(word, l, th, mode) {
      fill(th); streaks(l, th, mode === 'side' ? 0 : -0.5); const w2 = T(word), ink = inkOf(th), sz = Math.min(30 * u, (W * 1.5) / Math.max(3, w2.length));
      const [sx, sy] = shake(l - 0.1, 2.2); x.save(); x.translate(W / 2 + sx, H / 2 + sy);
      if (mode === 'zoom') { const s2 = lerp(5, 1, eo5(K(l, 0, 0.22))); x.scale(s2, s2); }
      if (mode === 'side') { x.translate(lerp(-W * 1.2, 0, back(K(l, 0, 0.26))), 0); }
      if (mode === 'spin') { const k = back(K(l, 0, 0.3)); x.rotate((1 - k) * -0.9); x.scale(lerp(0.2, 1, k), lerp(0.2, 1, k)); }
      if (mode === 'split') { const k = eo5(K(l, 0, 0.25)), gap = (1 - k) * H * 0.6; x.save(); x.beginPath(); x.rect(-W, -H, W * 2, H); x.clip(); big(w2, sz, ink, 0, -gap); x.restore(); x.save(); x.beginPath(); x.rect(-W, 0, W * 2, H); x.clip(); big(w2, sz, Y, 0, gap); x.restore(); }
      else big(w2, sz, ink, 0, 0);
      x.restore();
      // a ghost echo of the word, zooming past
      x.save(); x.globalAlpha = 0.12 * (1 - K(l, 0.1, 0.4)); x.translate(W / 2, H / 2); const e2 = lerp(1, 2.4, K(l, 0.05, 0.45)); x.scale(e2, e2); big(w2, sz, accOf(th), 0, 0, 'center', true); x.restore();
      flash(l, th === 'dark' ? Y : '#FFFFFF');
    }
    function prod(i, l, th, mode, label, n) {
      fill(th); streaks(l, th, -0.35); const im = imgs[i], ink = inkOf(th), acc = accOf(th), ar = AR();
      // giant vertical word climbing behind
      x.save(); x.translate(ar ? W * 0.14 : W * 0.86, lerp(H * 0.95, H * 0.35, eo(K(l, 0, 0.9)))); x.rotate(-Math.PI / 2); x.globalAlpha = 0.16; big(T(label), 15 * u, acc, 0, 0, 'left', true); x.restore();
      // the product crashing in
      const [sx, sy] = shake(l - 0.3, 2.6); let S = W * 0.95, rot = 0, dx = 0, dy = 0, sc = 1, a = 1;
      const k = K(l, 0.08, 0.32), e = back(k), e5 = eo5(k);
      if (mode === 'spin') { rot = (1 - e5) * Math.PI * 1.4; sc = lerp(0.05, 1, e); }
      if (mode === 'swing') { dx = lerp(-W * 1.1, 0, e); rot = (1 - e) * -0.6; }
      if (mode === 'punch') { sc = lerp(2.6, 1, e5); a = cl(k * 3); }
      if (mode === 'flip') { sc = 1; x.save(); }
      if (mode === 'drop') { dy = lerp(-H * 0.9, 0, back(k)); }
      const push = 1 + 0.06 * K(l, 0.4, 0.6);
      x.save(); x.translate(W / 2 + dx + sx, H * 0.47 + dy + sy); x.rotate(rot); x.scale(sc * push * (mode === 'flip' ? Math.max(0.02, Math.abs(Math.cos((1 - e5) * Math.PI))) : 1), sc * push);
      x.globalAlpha = a; if (ok(im)) x.drawImage(im, -S / 2, -S / 2, S, S); x.restore(); if (mode === 'flip') x.restore(); x.globalAlpha = 1;
      // landing boom
      const land = l - 0.38; if (land > 0 && land < 0.45) { const b = land / 0.45; x.save(); x.globalAlpha = (1 - b) * 0.85; x.strokeStyle = acc; x.lineWidth = (1 - b) * 2.4 * u; x.beginPath(); x.arc(W / 2, H * 0.47, W * (0.18 + b * 0.6), 0, 7); x.stroke(); for (let r2 = 0; r2 < 14; r2++) { const a2 = r2 * Math.PI / 7 + i, r0 = W * (0.26 + b * 0.32); x.beginPath(); x.moveTo(W / 2 + Math.cos(a2) * r0, H * 0.47 + Math.sin(a2) * r0); x.lineTo(W / 2 + Math.cos(a2) * (r0 + W * 0.1 * (1 - b)), H * 0.47 + Math.sin(a2) * (r0 + W * 0.1 * (1 - b))); x.stroke(); } x.restore(); }
      // label slams in from the top, the counter rolls at the bottom
      const lk = back(K(l, 0.3, 0.3)); x.save(); x.translate(W / 2, lerp(-10 * u, 17 * u, lk)); big(T(label), Math.min(11 * u, (W * 1.6) / Math.max(4, T(label).length)), ink, 0, 0); x.restore();
      const ck = eo(K(l, 0.45, 0.45)), num = Math.round(parseInt(n.replace(/,/g, ''), 10) * ck).toLocaleString('en-US');
      x.globalAlpha = cl(K(l, 0.45, 0.15) * 3); big(num, 12 * u, acc, W / 2, H * 0.82); x.font = '600 ' + 3.3 * u + 'px ' + F.jb; x.fillStyle = ink; x.textAlign = 'center'; x.fillText(T('IN STOCK IN DEIRA'), W / 2, H * 0.89); x.globalAlpha = 1;
      flash(l);
    }
    function strobe(l) { // every part, 0.09s each, colours swapping
      const n = Math.floor(l / 0.09), th = ['yel', 'dark', 'light'][n % 3]; fill(th); const im = imgs[n % imgs.length], S = W * (0.8 + 0.25 * ((n * 37) % 7) / 7);
      x.save(); x.translate(W / 2, H * 0.48); x.rotate(((n * 53) % 9 - 4) * 0.06); if (ok(im)) x.drawImage(im, -S / 2, -S / 2, S, S); x.restore();
      big(T(['SCREENS', 'BATTERIES', 'CAMERAS', 'COVERS', 'FLEX', 'BOARDS'][n % 6]), 9 * u, inkOf(th), W / 2, H * 0.16); flash((l % 0.09) * 0.8, th === 'dark' ? Y : '#FFFFFF');
    }
    function grades(l) { // the grades flash one by one, each its own colour
      const G4 = ['ORIGINAL', 'OLED', 'INCELL', 'AAA'], n = Math.min(3, Math.floor(l / 0.24)), th = ['dark', 'yel', 'light', 'dark'][n], ll = l - n * 0.24; fill(th); streaks(ll, th, 0.5);
      const k = back(K(ll, 0, 0.18)), sz = Math.min(26 * u, (W * 1.5) / G4[n].length); x.save(); x.translate(W / 2, H * 0.46); x.scale(lerp(1.8, 1, k), lerp(1.8, 1, k)); big(T(G4[n]), sz, n === 3 ? Y : inkOf(th), 0, 0); x.restore();
      x.font = '600 ' + 3.4 * u + 'px ' + F.jb; x.textAlign = 'center'; x.fillStyle = th === 'dark' ? '#D5D7DA' : G; x.fillText(T('EVERY GRADE · HONEST LABELS'), W / 2, H * 0.62); flash(ll);
    }
    function finale(l) { // IN STOCK / IN DEIRA. then a bouncing SHOP NOW pill
      fill('dark'); streaks(l, 'dark', -0.5);
      [['IN STOCK', '#FFFFFF'], ['IN DEIRA.', Y]].forEach(([w2, c], j) => { const k = eo5(K(l, j * 0.14, 0.3)); x.save(); x.translate(lerp(j ? W * 1.4 : -W * 0.4, W / 2, k), H * (0.36 + j * 0.13)); big(T(w2), 15 * u, c, 0, 0); x.restore(); });
      const pk = back(K(l, 0.45, 0.35)), bob = 1 + 0.05 * Math.sin(Math.max(0, l - 0.8) * 9) * cl(l - 0.8); x.save(); x.translate(W / 2, H * 0.74); x.scale(pk * bob, pk * bob); x.fillStyle = Y; rr(x, -30 * u, -6.5 * u, 60 * u, 13 * u, 6.5 * u); x.fill();
      x.font = '700 ' + 5.4 * u + 'px ' + F.in; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = G; x.fillText(T('SHOP NOW') + (AR() ? '  ←' : '  →'), 0, 0.3 * u); x.textBaseline = 'alphabetic'; x.restore();
      flash(l, Y);
    }
    function draw(t) {
      if (AR() !== lang) load();
      t = ((t % (BT + CLOSE)) + (BT + CLOSE)) % (BT + CLOSE); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
      const inset = () => x.setTransform(SAFE.s, 0, 0, SAFE.s, (W - W * SAFE.s) / 2, H * SAFE.top); inset();
      let dark = true;
      if (t < BT) { let acc2 = 0, bi = 0; while (bi < BEATS.length - 1 && t >= acc2 + BEATS[bi].d) { acc2 += BEATS[bi].d; bi++; } BEATS[bi].f(t - acc2); const th = [0, 3, 5, 8, 11].includes(bi) ? 'dark' : 'x'; dark = th === 'dark' || (bi === 9 && Math.floor((t - acc2) / 0.09) % 3 === 1); }
      else close(t - BT);
      x.setTransform(1, 0, 0, 1, 0, 0); status(dark);
    }
    return { draw, dur: BT + CLOSE, logoT: BT + 0.9, setLib: () => {} };
  }
  window.SETdAd = { create };
})();
