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
    const out = cv.getContext('2d'), x = out, W = cv.width, H = cv.height, u = W / 100, M = 9 * u, REEL = (opts && opts.reel) || '', SAFE = REEL === 'ipad' || REEL === 'rig' ? { s: 1, top: 0 } : { s: 0.88, top: 0.075 };
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
      const lk = eo(K(lt, 0.85, 0.35)); if (ok(logo) && lk > 0) { const s = r * lerp(1.04, 1, lk); x.globalAlpha = lk; x.save(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); x.drawImage(logo, cx - s, cy - s, s * 2, s * 2); x.restore(); x.globalAlpha = 1; /* owner (16 Nov): the logo gets its yellow outline frame, drawn round as it lands, with a soft glow */ { const rk = eo(K(lt, 0.95, 0.5)); if (rk > 0) { x.save(); x.strokeStyle = Y; x.lineWidth = 1.4 * u; x.shadowColor = 'rgba(247,192,50,.85)'; x.shadowBlur = 5 * u; x.beginPath(); x.arc(cx, cy, s + 1.1 * u, -Math.PI / 2, -Math.PI / 2 + rk * Math.PI * 2); x.stroke(); x.restore(); } }
        const sw = K(lt, 1.15, 0.5); if (sw > 0 && sw < 1) { x.save(); x.beginPath(); x.arc(cx, cy, s, 0, 7); x.clip(); const gx = lerp(cx - s * 1.6, cx + s * 1.6, eio(sw)), g = x.createLinearGradient(gx - s * 0.4, 0, gx + s * 0.4, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - s, cy - s, s * 2, s * 2); x.restore(); } }
      const wk = eo(K(lt, 1.05, 0.45)); x.globalAlpha = wk; x.textAlign = 'center'; x.fillStyle = '#FFFFFF'; x.font = '600 ' + 6 * u + 'px ' + F.sg; if ('letterSpacing' in x) x.letterSpacing = lerp(2.4, 0.9, wk) * u + 'px'; x.fillText(ar ? T('SAM ELECTRONICS') : 'SAM ELECTRONICS', cx, cy + r + 13 * u); if ('letterSpacing' in x) x.letterSpacing = '0px';
      x.fillStyle = Y; x.font = '500 ' + 3.4 * u + 'px ' + F.jb; x.fillText(T('QUALITY · WARRANTY · PRICE'), cx, cy + r + 20 * u); x.globalAlpha = 1;
      const pk = eo(K(lt, 1.4, 0.4)), pulse = 1 + 0.03 * Math.sin(Math.max(0, lt - 1.8) * 7) * cl(lt - 1.8); x.globalAlpha = pk; x.save(); x.translate(cx, H - 22 * u); x.scale(pulse, pulse); x.fillStyle = Y; rr(x, -30 * u, -5 * u, 60 * u, 10 * u, 5 * u); x.fill(); text(T('Find My Part') + (ar ? '  ←' : '  →'), 0, 1.5 * u, '600 ' + 4 * u + 'px ' + F.in, G, 'center'); x.restore(); x.globalAlpha = 1;
      const out = K(lt, CLOSE - 0.25, 0.25); if (out > 0) { x.globalAlpha = out; x.fillStyle = '#000'; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } }
    function status(dark) { if (REEL === 'ipad' || REEL === 'rig') return; // owner (R11): no time or battery on the iPad // the status bar: the time, signal and battery, in the screen's ink (in the 'ears' beside the island, clear of the corners)
      const M = 19 * u, Y0 = 1.8 * u; /* R10 C4: a real safe margin from the rounded corners */ const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'), c = dark ? '#FFFFFF' : G;
      x.globalAlpha = 0.9; x.fillStyle = c; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = '600 ' + 3.4 * u + 'px ' + F.in; x.fillText(hh + ':' + mm, M, 6.4 * u + Y0);
      for (let j = 0; j < 4; j++) x.fillRect(W - M - 11.5 * u + j * 1.3 * u, 6.6 * u + Y0 - (j + 1) * 0.55 * u, 0.85 * u, (j + 1) * 0.55 * u);
      x.strokeStyle = c; x.lineWidth = 0.3 * u; rr(x, W - M - 5.6 * u, 4.6 * u + Y0, 5 * u, 2.4 * u, 0.6 * u); x.stroke(); x.fillRect(W - M - 5.1 * u, 5.1 * u + Y0, 3.6 * u, 1.4 * u); x.globalAlpha = 1; x.textBaseline = 'alphabetic'; }
    // ───────── R12 (owner: "redo it all: zoom in, zoom out, texts, energetic, not a copy of the hero") ─────────
    // A fast kinetic commercial: one word per beat, hard cuts, every beat its own move (slam, zoom-out, spin, split),
    // products crashing in (spin-zoom, swing, punch, flip, drop) with giant vertical words and live counters, a strobe of
    // every part, the grades flashing, then IN STOCK IN DEIRA + a bouncing SHOP NOW, then the logo close.
    // R11 · the iPad reel (owner: "brand level, logos spinning, one getting selected, the qualities doing a show"):
    // the same engine and look as this commercial, with its own script and a brand wall
    const BR = ['apple', 'samsung', 'xiaomi', 'huawei', 'google', 'oppo', 'honor', 'redmi', 'poco', 'oneplus', 'realme', 'vivo', 'infinix', 'tecno', 'nokia'];
    const BI = REEL === 'ipad' || REEL === 'rig' ? BR.map((b) => { const im = new Image(); im.src = '/assets/brands/' + b + '.svg'; return im; }) : [];
    const logoAt = (im, cx, cy, maxW, maxH) => { if (!ok(im)) return; const r = im.naturalWidth / im.naturalHeight || 3, w = Math.min(maxW, maxH * r), h = w / r; x.drawImage(im, cx - w / 2, cy - h / 2, w, h); };
    function brands(l) { // a 3D carousel of brand plates spins and slows, one is pulled to the front and lit, then the wall lands
      fill('dark'); streaks(l, 'dark', -0.4);
      const sel = 0, spin = eo5(K(l, 0, 1.1)), ang = (1 - spin) * Math.PI * 4;
      if (l < 1.25) { const n = 8, R = W * 0.3; const items = Array.from({ length: n }, (_, j) => { const a = ang + j * (Math.PI * 2 / n); return { j, a, z: Math.cos(a) }; }).sort((p2, q2) => p2.z - q2.z);
        items.forEach(({ j, a, z }) => { const sc2 = 0.5 + 0.5 * (z + 1) / 2, cx = W / 2 + Math.sin(a) * R, cy = H * 0.47 + Math.cos(a) * H * 0.07, pw = 26 * u * sc2, ph = 12 * u * sc2; x.save(); x.globalAlpha = 0.35 + 0.65 * (z + 1) / 2; x.fillStyle = '#FFFFFF'; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 3 * u; rr(x, cx - pw / 2, cy - ph / 2, pw, ph, 2.4 * u * sc2); x.fill(); x.shadowBlur = 0; logoAt(BI[j], cx, cy, pw * 0.72, ph * 0.5); x.restore(); });
        big(T('THE BRANDS WE STOCK'), 4.2 * u, Y, W / 2, H * 0.2); }
      else { const ll = l - 1.25, k = back(K(ll, 0, 0.3)), pw = 58 * u, ph = 24 * u; // the chosen one, then the wall
        if (ll < 0.8) { x.save(); x.translate(W / 2, H * 0.47); x.scale(lerp(0.4, 1, k), lerp(0.4, 1, k)); x.fillStyle = '#FFFFFF'; x.shadowColor = 'rgba(247,192,50,.95)'; x.shadowBlur = 8 * u; rr(x, -pw / 2, -ph / 2, pw, ph, 4 * u); x.fill(); x.shadowBlur = 0; x.lineWidth = 1 * u; x.strokeStyle = Y; x.stroke(); logoAt(BI[(Math.floor(l * 0) + sel) % BI.length], 0, -1.5 * u, pw * 0.7, ph * 0.46); x.font = '700 ' + 2.8 * u + 'px ' + F.jb; x.textAlign = 'center'; x.fillStyle = '#2BB673'; x.fillText('● ' + T('IN STOCK'), 0, ph / 2 - 3 * u); x.restore(); flash(ll, Y); }
        else { const lw = ll - 0.8, cols = 3, gw = 27 * u, gh = 11 * u, gap = 3 * u, rows = 5, x0 = W / 2 - (cols * gw + (cols - 1) * gap) / 2, y0 = H * 0.24;
          const nk = eo5(K(lw, 0, 0.3)); x.save(); x.translate(W / 2, H * 0.12); x.scale(lerp(1.6, 1, nk), lerp(1.6, 1, nk)); x.globalAlpha = cl(nk * 3); big('15', 15 * u, Y, -12 * u, 0); x.font = '700 ' + 3.4 * u + 'px ' + F.jb; x.textAlign = 'left'; x.fillStyle = '#FFFFFF'; x.fillText(T('BRANDS'), -1 * u, -2 * u); x.fillText(T('IN STOCK'), -1 * u, 3 * u); x.restore();
          BR.forEach((_, j) => { const c = j % cols, r2 = Math.floor(j / cols), kk = back(K(lw, 0.08 + j * 0.035, 0.28)); if (kk <= 0) return; const cx = x0 + c * (gw + gap) + gw / 2, cy = y0 + r2 * (gh + gap) + gh / 2; x.save(); x.translate(cx, cy); x.scale(kk, kk); x.fillStyle = '#FFFFFF'; rr(x, -gw / 2, -gh / 2, gw, gh, 2 * u); x.fill(); const hot = Math.floor(lw / 0.12) % BR.length === j && lw > 0.7; if (hot) { x.lineWidth = 0.8 * u; x.strokeStyle = Y; x.shadowColor = 'rgba(247,192,50,.9)'; x.shadowBlur = 4 * u; x.stroke(); x.shadowBlur = 0; } logoAt(BI[j], 0, 0, gw * 0.72, gh * 0.5); x.restore(); });
          flash(lw, '#FFFFFF'); } }
    }
    // owner (R12): the iPad reel was "a bit too quick" and "like the teardown ad": it is slower and tells the SHOP story:
    // the brand slams, then search → pick a grade → add to cart → order on WhatsApp/WeChat, the brands, every grade, close
    const GSTEP = REEL === 'ipad' ? 0.3 : REEL === 'rig' ? 0.34 : 0.22;
    // owner (R12): the rig's own reel: what the bench proves (tested, graded), every grade, the brands, the close
    const RIG = [
      { d: 0.7, f: (l) => slam('TESTED.', l, 'dark', 'zoom') },
      { d: 0.7, f: (l) => slam('GRADED.', l, 'yel', 'side') },
      { d: 0.7, f: (l) => slam('HONEST.', l, 'light', 'spin') },
      { d: 9 * 0.34, f: (l) => grades(l) },
      { d: 3.0, f: (l) => brands(l) },
      { d: 2.0, f: (l) => finale(l) },
    ];
    const BEATS = REEL === 'rig' ? RIG : REEL === 'ipad' ? [
      // always opens on the same entrance, then bold word → the real shop, four times, then the close
      { d: 0.8, f: (l) => slam('SAM', l, 'dark', 'zoom') },
      { d: 0.85, f: (l) => slam('ELECTRONICS', l, 'yel', 'side') },
      { d: 0.75, f: (l) => slam('SEARCH.', l, 'light', 'spin') },
      { d: 5.5, c: 1, f: (l) => clip(0, 0, l, 'Any part. Any model.') },
      { d: 0.75, f: (l) => slam('15 BRANDS.', l, 'dark', 'split') },
      { d: 2.4, f: (l) => brands(l) },
      { d: 5.5, c: 1, f: (l) => clip(5.5, 1, l, 'Every brand, on the shelf.') },
      { d: 0.75, f: (l) => slam('EVERY GRADE.', l, 'yel', 'zoom') },
      { d: 5.5, c: 1, f: (l) => clip(11.0, 1, l, 'Pick the grade. See the price.') },
      { d: 0.8, f: (l) => slam('ORDER IN SECONDS.', l, 'dark', 'side') },
      { d: 5.5, c: 1, f: (l) => clip(16.533, 3, l, 'Cart. WhatsApp. Done.') },
      { d: 2.2, f: (l) => finale(l) },
    ] : [
      { d: 0.55, f: (l) => slam('TAKE', l, 'dark', 'zoom') },
      { d: 0.5, f: (l) => slam('ANY', l, 'yel', 'side') },
      { d: 0.5, f: (l) => slam('PHONE', l, 'light', 'spin') },
      { d: 0.65, f: (l) => slam('APART.', l, 'dark', 'split') },
      { d: 1.0, f: (l) => prod(0, l, 'yel', 'spin', 'SCREENS', '1,902', 'ORIGINAL · OLED · INCELL · AAA') },
      { d: 1.0, f: (l) => prod(1, l, 'dark', 'swing', 'BATTERIES', '1,455', 'GENUINE CELLS · CAPACITY TESTED') },
      { d: 1.0, f: (l) => prod(3, l, 'light', 'punch', 'CAMERAS', '494', 'FRONT · REAR · LENSES') },
      { d: 1.0, f: (l) => prod(2, l, 'yel', 'flip', 'BACK COVERS', '1,436', 'EVERY COLOUR · WITH OR WITHOUT CHASSIS') },
      { d: 1.0, f: (l) => prod(5, l, 'dark', 'drop', 'FLEX & SMALL', '331', 'FLEX · SIM TRAYS · BUTTONS · SPEAKERS') },
      { d: 0.72, f: (l) => strobe(l) },
      { d: 9 * 0.22, f: (l) => grades(l) },
      { d: 1.7, f: (l) => finale(l) },
    ];
    const BT = BEATS.reduce((a2, b2) => a2 + b2.d, 0);
    const fill = (th) => { const c = th === 'yel' ? Y : th === 'light' ? '#F4F2EE' : '#1E1F21'; x.fillStyle = c; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); };
    const inkOf = (th) => (th === 'dark' ? '#FFFFFF' : G), accOf = (th) => (th === 'dark' ? Y : th === 'yel' ? '#FFFFFF' : Y);
    const flash = (l, c = '#FFFFFF') => { if (l < 0.07) { x.globalAlpha = (1 - l / 0.07) * 0.8; x.fillStyle = c; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]); x.globalAlpha = 1; } };
    const shake = (l, amt) => { const k = l < 0.22 ? (1 - l / 0.22) * amt * u : 0; return [(Math.random() * 2 - 1) * k, (Math.random() * 2 - 1) * k]; };
    // owner (15 Nov): the diagonal light reads as real light: soft feathered beams that blend (screen/multiply), not flat bars
    // owner (16 Nov): sharper, heavier, higher-quality light: each beam is a wide soft halo, a crisp bright core and a
    // thin white-hot line, travelling diagonally at slightly different speeds (like light through glass), blended into the
    // background (screen on dark/yellow, multiply on light) so it never looks like a flat bar
    // owner (16 Nov, 2nd): the beams must be glowing lines of light, not flat linear bands. Each beam is now a thin bright
    // line that fades out at both ends, with a real glow (blur) around it, drifting diagonally; same colours as before.
    const streaks = (l, th, ang) => { x.save(); x.translate(W / 2, H / 2); x.rotate(ang); const lightBg = th === 'light'; x.globalCompositeOperation = lightBg ? 'multiply' : 'screen';
      const base = lightBg ? '232,200,120' : th === 'yel' ? '255,250,232' : '255,214,120', hot = lightBg ? '214,150,20' : '255,255,255';
      for (let k2 = 0; k2 < 3; k2++) { const sp = 1.05 + k2 * 0.12, off = (((l * sp + k2 * 0.27) % 1) - 0.5) * H * 2.4, len = W * (1.1 + (k2 % 2) * 0.5), x0 = -len / 2 + Math.sin(l * 2 + k2) * W * 0.15;
        const a = (lightBg ? 0.35 : th === 'yel' ? 0.6 : 0.7) * (k2 % 2 ? 0.75 : 1);
        // owner (17 Nov): "the rays were reduced, they don't show much": a wide soft glow band behind every line again
        { const r = 9 * u; x.save(); x.translate(x0 + len / 2, off); x.scale(len / 2 / r, 1); const rg = x.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, 'rgba(' + base + ',' + a * 0.55 + ')'); rg.addColorStop(0.35, 'rgba(' + base + ',' + a * 0.2 + ')'); rg.addColorStop(1, 'rgba(' + base + ',0)'); x.fillStyle = rg; x.fillRect(-r, -r, r * 2, r * 2); x.restore(); }
        const lg = x.createLinearGradient(x0, 0, x0 + len, 0); lg.addColorStop(0, 'rgba(' + base + ',0)'); lg.addColorStop(0.5, 'rgba(' + base + ',' + a + ')'); lg.addColorStop(1, 'rgba(' + base + ',0)');
        x.shadowColor = 'rgba(' + base + ',' + Math.min(1, a + 0.2) + ')'; x.shadowBlur = (lightBg ? 6 : 14) * u * 0.5;
        x.fillStyle = lg; x.fillRect(x0, off - 0.8 * u, len, 1.6 * u);
        const hg = x.createLinearGradient(x0 + len * 0.2, 0, x0 + len * 0.8, 0); hg.addColorStop(0, 'rgba(' + hot + ',0)'); hg.addColorStop(0.5, 'rgba(' + hot + ',' + (lightBg ? 0.3 : 0.85) + ')'); hg.addColorStop(1, 'rgba(' + hot + ',0)');
        x.shadowBlur = (lightBg ? 3 : 8) * u * 0.5; x.fillStyle = hg; x.fillRect(x0 + len * 0.2, off - 0.14 * u, len * 0.6, 0.28 * u); }
      x.shadowBlur = 0; x.restore(); };
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
    function prod(i, l, th, mode, label, n, info) {
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
      // landing: a soft studio light bloom behind the part and one thin shockwave (owner: no sun-like rays)
      const land = l - 0.38; if (land > 0 && land < 0.6) { const b = land / 0.6, r0 = W * (0.2 + b * 0.55); x.save(); x.globalCompositeOperation = th === 'light' ? 'multiply' : 'screen';
        const bg = x.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, W * 0.7); bg.addColorStop(0, (th === 'light' ? 'rgba(247,192,50,' : 'rgba(255,226,150,') + (1 - b) * 0.45 + ')'); bg.addColorStop(1, 'rgba(255,226,150,0)'); x.fillStyle = bg; x.fillRect(FULL[0], FULL[1], FULL[2], FULL[3]);
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = (1 - b) * 0.6; x.strokeStyle = acc; x.lineWidth = (1 - b) * 0.9 * u; x.beginPath(); x.arc(W / 2, H * 0.47, r0, 0, 7); x.stroke(); x.restore(); }
      // label slams in from the top, the counter rolls at the bottom
      // R11 (owner: "the titles coming in look cheap, bland and too far up"): a small numbered kicker, then the name SLAMS in
      // big (scale 1.7 → 1 with a micro shake) just above the part, a lit rule drawing itself under it
      const lk0 = K(l, 0.22, 0.26), lk = eo5(lk0), yL = H * 0.255, fsL = Math.min(15 * u, (W * 1.75) / Math.max(4, T(label).length));
      if (lk0 > 0) { const kk = eo(K(l, 0.16, 0.25)); x.save(); x.globalAlpha = kk; x.font = '700 ' + 3.2 * u + 'px ' + F.jb; x.fillStyle = acc; x.textAlign = 'center'; x.fillText(String(['SCREENS', 'BATTERIES', 'CAMERAS', 'BACK COVERS', 'FLEX & SMALL'].indexOf(label) + 1).padStart(2, '0') + ' / 05', W / 2, yL - fsL * 0.78); x.restore();
        const sh = lk0 < 1 ? 0 : (K(l, 0.48, 0.12) < 1 ? (Math.random() * 2 - 1) * 0.5 * u : 0);
        x.save(); x.globalAlpha = cl(lk0 * 3); x.translate(W / 2 + sh, yL); x.scale(lerp(1.7, 1, lk), lerp(1.7, 1, lk)); x.shadowColor = th === 'dark' ? 'rgba(247,192,50,.45)' : 'rgba(0,0,0,.22)'; x.shadowBlur = 3 * u; x.shadowOffsetY = 0.5 * u; big(T(label), fsL, ink, 0, 0); x.restore();
        const rk = eo(K(l, 0.45, 0.3)), rw = W * 0.22 * rk; if (rk > 0) { x.save(); x.fillStyle = acc; x.shadowColor = 'rgba(247,192,50,.9)'; x.shadowBlur = th === 'yel' ? 0 : 2.5 * u; x.fillRect(W / 2 - rw / 2, yL + fsL * 0.62, rw, 0.7 * u); x.restore(); }
        x.globalAlpha = 1; }
      const ck = eo(K(l, 0.45, 0.45)), num = Math.round(parseInt(n.replace(/,/g, ''), 10) * ck).toLocaleString('en-US');
      x.globalAlpha = cl(K(l, 0.45, 0.15) * 3); big(num, 12 * u, acc, W / 2, H * 0.82); x.font = '600 ' + 3.3 * u + 'px ' + F.jb; x.fillStyle = ink; x.textAlign = 'center'; x.fillText(T('IN STOCK IN DEIRA'), W / 2, H * 0.89); x.globalAlpha = 1;
      if (info) { const ik = eo(K(l, 0.55, 0.25)); if (ik > 0) { x.save(); x.globalAlpha = ik; const tw = T(info), fs = Math.min(3 * u, (W * 0.86) / Math.max(10, tw.length * 0.62)); x.font = '700 ' + fs + 'px ' + F.jb; const mw = x.measureText(tw).width + 6 * u; x.fillStyle = th === 'dark' ? 'rgba(247,192,50,.14)' : 'rgba(38,40,43,.1)'; rr(x, W / 2 - mw / 2, H * 0.925 - fs * 0.9, mw, fs * 1.8, fs * 0.9); x.fill(); x.fillStyle = th === 'dark' ? Y : G; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(tw, W / 2, H * 0.925 + lerp(4 * u, 0, ik)); x.textBaseline = 'alphabetic'; x.restore(); } }
      flash(l);
    }
    function strobe(l) { // every part, 0.09s each, colours swapping
      const n = Math.floor(l / 0.09), th = ['yel', 'dark', 'light'][n % 3]; fill(th); const im = imgs[n % imgs.length], S = W * (0.8 + 0.25 * ((n * 37) % 7) / 7);
      x.save(); x.translate(W / 2, H * 0.48); x.rotate(((n * 53) % 9 - 4) * 0.06); if (ok(im)) x.drawImage(im, -S / 2, -S / 2, S, S); x.restore();
      big(T(['SCREENS', 'BATTERIES', 'CAMERAS', 'COVERS', 'FLEX', 'BOARDS'][n % 6]), 9 * u, inkOf(th), W / 2, H * 0.16); flash((l % 0.09) * 0.8, th === 'dark' ? Y : '#FFFFFF');
    }
    // owner (R12): "we have more qualities now, the ad must list ALL of them, same style": every grade in the shop flashes
    function grades(l) {
      const G9 = ['ORIGINAL', 'OLED SOFT', 'OLED BIG', 'OLED SMALL', 'INCELL', 'AAA', 'AA', 'COMPATIBLE', 'STANDARD'], st = GSTEP, n = Math.min(G9.length - 1, Math.floor(l / st)), th = ['dark', 'yel', 'light'][n % 3], ll = l - n * st; fill(th); streaks(ll, th, 0.5);
      const k = back(K(ll, 0, 0.16)), sz = Math.min(24 * u, (W * 1.45) / G9[n].length); x.save(); x.translate(W / 2, H * 0.46); x.scale(lerp(1.8, 1, k), lerp(1.8, 1, k)); big(T(G9[n]), sz, n % 3 === 0 ? Y : inkOf(th), 0, 0); x.restore();
      x.font = '700 ' + 3 * u + 'px ' + F.jb; x.textAlign = 'center'; x.fillStyle = th === 'dark' ? '#9DA1A6' : 'rgba(38,40,43,.6)'; x.fillText(String(n + 1).padStart(2, '0') + ' / ' + G9.length, W / 2, H * 0.33);
      x.font = '600 ' + 3.4 * u + 'px ' + F.jb; x.fillStyle = th === 'dark' ? '#D5D7DA' : G; x.fillText(T('EVERY GRADE · HONEST LABELS'), W / 2, H * 0.62); flash(ll);
    }
    // owner (R12): "focus more on the SHOP: show the customer the shopping experience, same energy and design"
    const chip = (t2, cx, cy, h, bg, fg) => { x.font = '700 ' + h * 0.42 + 'px ' + F.jb; const w = x.measureText(t2).width + h * 0.9; x.fillStyle = bg; rr(x, cx - w / 2, cy - h / 2, w, h, h / 2); x.fill(); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t2, cx, cy + h * 0.04); x.textBaseline = 'alphabetic'; return w; };
    const kicker = (t2, th) => { x.font = '700 ' + 3 * u + 'px ' + F.jb; x.textAlign = 'center'; x.fillStyle = th === 'dark' ? Y : G; x.fillText(t2, W / 2, H * 0.1); };
    // owner (R12b): "use a REAL recorded shop: the bold writing, then the shop itself, then another message, then the shop".
    // The real shop was recorded at tablet size (public/assets/ad/shop-film.mp4: search, brands, grades, order); a clip beat
    // plays its part of that film full-screen with a slow push-in, a vignette and a short caption.
    const VID = opts && opts.video;
    function clip(from, step, l, cap) {
      const v = VID, ready = v && v.readyState >= 2;
      if (!ready) { shop(step, l); return; }
      const want = from + Math.min(l, 5.45); if (v.paused) { try { v.play(); } catch (e) { /* autoplay */ } } if (Math.abs(v.currentTime - want) > 0.35) { try { v.currentTime = want; } catch (e) { /* */ } }
      const [fx, fy, fw, fh] = FULL, vw = v.videoWidth || 552, vh = v.videoHeight || 756, push = 1.02 + 0.07 * eio(K(l, 0, 5.5)), sc = Math.max(fw / vw, fh / vh) * push, dw = vw * sc, dh = vh * sc;
      const k = eo5(K(l, 0, 0.35)); x.save(); x.globalAlpha = cl(k * 1.4); x.drawImage(v, fx + (fw - dw) / 2, fy + (fh - dh) / 2 - (1 - k) * 4 * u, dw, dh); x.restore();
      const g = x.createLinearGradient(0, fy + fh * 0.62, 0, fy + fh); g.addColorStop(0, 'rgba(30,31,33,0)'); g.addColorStop(1, 'rgba(30,31,33,.82)'); x.fillStyle = g; x.fillRect(fx, fy + fh * 0.6, fw, fh * 0.4);
      const vg = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,21,23,.35)'); x.fillStyle = vg; x.fillRect(fx, fy, fw, fh);
      const ck = back(K(l, 0.35, 0.4)), ar = AR(); if (ck > 0) { x.save(); x.globalAlpha = cl(ck); x.translate(0, (1 - ck) * 5 * u); x.font = '700 ' + 2.6 * u + 'px ' + F.jb; x.textAlign = ar ? 'right' : 'left'; x.fillStyle = Y; x.fillText(T('THE SHOP') + ' · 0' + (step + 1), ar ? W - 7 * u : 7 * u, H * 0.84);
        let cs = 6.4 * u; x.font = '800 ' + cs + 'px ' + F.sg; const cw = x.measureText(T(cap)).width; if (cw > W - 14 * u) { cs *= (W - 14 * u) / cw; x.font = '800 ' + cs + 'px ' + F.sg; } x.fillStyle = '#FFFFFF'; x.fillText(T(cap), ar ? W - 7 * u : 7 * u, H * 0.9); x.restore(); }
      const fl = 1 - K(l, 0, 0.18); if (fl > 0) { x.globalAlpha = fl * 0.55; x.fillStyle = '#FFFFFF'; x.fillRect(fx, fy, fw, fh); x.globalAlpha = 1; }
    }
    function shop(step, l) {
      const ar = AR();
      if (step === 0) { // SEARCH: the bar types, the results drop in
        fill('light'); streaks(l, 'light', -0.4); kicker(T('THE SHOP') + ' · 01', 'light');
        const k = back(K(l, 0, 0.25)); x.save(); x.translate(W / 2, H * 0.2); x.scale(lerp(1.7, 1, k), lerp(1.7, 1, k)); big(T('SEARCH.'), 15 * u, G, 0, 0); x.restore();
        const bw = W * 0.84, bh = 11 * u, bx = (W - bw) / 2, by = H * 0.32; x.save(); x.shadowColor = 'rgba(247,192,50,.8)'; x.shadowBlur = 5 * u; x.fillStyle = '#FFFFFF'; rr(x, bx, by, bw, bh, 3 * u); x.fill(); x.restore(); x.strokeStyle = Y; x.lineWidth = 0.6 * u; rr(x, bx, by, bw, bh, 3 * u); x.stroke();
        const q = 'iPhone 15 Pro screen', nq = Math.floor(cl((l - 0.15) / 0.75) * q.length); x.font = '500 ' + 4.2 * u + 'px ' + F.in; x.fillStyle = G; x.textAlign = ar ? 'right' : 'left'; x.textBaseline = 'middle'; const tx = ar ? bx + bw - 5 * u : bx + 5 * u; x.fillText(q.slice(0, nq), tx, by + bh / 2);
        if ((l * 3) % 1 < 0.6) { const cw = x.measureText(q.slice(0, nq)).width; x.fillStyle = Y; x.fillRect(ar ? tx - cw - 0.8 * u : tx + cw + 0.4 * u, by + bh * 0.25, 0.5 * u, bh * 0.5); } x.textBaseline = 'alphabetic';
        [['ORIGINAL', 'AED 385', Y], ['OLED SOFT', 'AED 290', '#FFFFFF'], ['INCELL', 'AED 205', '#CFE8FF']].forEach(([g2, pr, c], j) => { const kk = back(K(l, 0.95 + j * 0.12, 0.3)); if (kk <= 0) return; const ry = by + bh + 3 * u + j * 12 * u; x.save(); x.globalAlpha = cl(kk); x.translate(0, (1 - kk) * 6 * u); x.fillStyle = '#FFFFFF'; x.shadowColor = 'rgba(38,40,43,.18)'; x.shadowBlur = 3 * u; rr(x, bx, ry, bw, 10 * u, 2.5 * u); x.fill(); x.shadowBlur = 0;
          const im = imgs[0]; if (im && im.complete && im.naturalWidth) x.drawImage(im, ar ? bx + bw - 10 * u : bx + 1.5 * u, ry + 1 * u, 8 * u, 8 * u);
          x.font = '700 ' + 3.6 * u + 'px ' + F.sg; x.fillStyle = G; x.textAlign = ar ? 'right' : 'left'; x.fillText('iPhone 15 Pro', ar ? bx + bw - 12 * u : bx + 12 * u, ry + 4.6 * u); chip(T(g2), ar ? bx + 20 * u : bx + bw - 34 * u, ry + 5 * u, 4.6 * u, c === '#FFFFFF' ? '#26282B' : c, c === '#FFFFFF' ? '#FFFFFF' : G);
          x.font = '800 ' + 3.6 * u + 'px ' + F.sg; x.fillStyle = G; x.textAlign = ar ? 'left' : 'right'; x.fillText(pr, ar ? bx + 3 * u : bx + bw - 3 * u, ry + 6.2 * u); x.restore(); });
        flash(l); return;
      }
      if (step === 1) { // PICK A GRADE: the selector slides across, the price follows
        fill('dark'); streaks(l, 'dark', 0.4); kicker(T('THE SHOP') + ' · 02', 'dark');
        const k = back(K(l, 0, 0.25)); x.save(); x.translate(W / 2, H * 0.2); x.scale(lerp(1.7, 1, k), lerp(1.7, 1, k)); big(T('PICK A GRADE.'), 11 * u, '#FFFFFF', 0, 0); x.restore();
        const im = imgs[0], ik = back(K(l, 0.1, 0.4)); if (im && im.complete && im.naturalWidth) { const S2 = W * 0.6 * ik; x.save(); x.shadowColor = 'rgba(247,192,50,.35)'; x.shadowBlur = 10 * u; x.drawImage(im, W / 2 - S2 / 2, H * 0.47 - S2 / 2, S2, S2); x.restore(); }
        const GS = [['ORIGINAL', '385'], ['OLED SOFT', '290'], ['INCELL', '205']], pick = Math.min(2, Math.floor(cl((l - 0.5) / 1.3) * 3)), cy = H * 0.74, gw = W * 0.27, x0 = W / 2 - gw * 1.5;
        GS.forEach(([g2], j) => { const cx = x0 + gw * (j + 0.5); const on = j === pick; x.fillStyle = on ? Y : 'rgba(255,255,255,.08)'; rr(x, cx - gw / 2 + 1 * u, cy - 4 * u, gw - 2 * u, 8 * u, 4 * u); x.fill(); x.font = '700 ' + 3 * u + 'px ' + F.jb; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = on ? G : '#D5D7DA'; x.fillText(T(g2), cx, cy + 0.2 * u); x.textBaseline = 'alphabetic'; });
        const pk = back(K(l, 0.5 + pick * 0.43, 0.25)); x.save(); x.translate(W / 2, H * 0.88); x.scale(lerp(1.4, 1, pk), lerp(1.4, 1, pk)); big('AED ' + GS[pick][1], 9 * u, Y, 0, 0); x.restore(); flash(l, Y); return;
      }
      if (step === 2) { // ADD TO CART: the button is pressed, the part flies to the cart, the badge bumps
        fill('yel'); streaks(l, 'yel', -0.4); kicker(T('THE SHOP') + ' · 03', 'yel');
        const k = back(K(l, 0, 0.25)); x.save(); x.translate(W / 2, H * 0.2); x.scale(lerp(1.7, 1, k), lerp(1.7, 1, k)); big(T('ADD TO CART.'), 11 * u, G, 0, 0); x.restore();
        const cw = W * 0.62, ch = H * 0.42, cx = W / 2 - cw / 2, cy = H * 0.3; x.save(); x.fillStyle = '#FFFFFF'; x.shadowColor = 'rgba(38,40,43,.3)'; x.shadowBlur = 6 * u; rr(x, cx, cy, cw, ch, 4 * u); x.fill(); x.restore();
        const im = imgs[1] || imgs[0], fly = eo(K(l, 0.75, 0.45)); if (im && im.complete && im.naturalWidth) { const S2 = cw * 0.62 * (1 - fly * 0.85); const tx2 = lerp(W / 2, ar ? W * 0.12 : W * 0.88, fly), ty2 = lerp(cy + ch * 0.38, H * 0.08 + 6 * u, fly); x.save(); x.globalAlpha = 1 - fly * 0.3; x.drawImage(im, tx2 - S2 / 2, ty2 - S2 / 2, S2, S2); x.restore(); }
        const pr = K(l, 0.55, 0.12) - K(l, 0.67, 0.12); x.save(); x.translate(W / 2, cy + ch * 0.86); x.scale(1 - pr * 0.08, 1 - pr * 0.08); x.fillStyle = G; rr(x, -cw * 0.4, -4.5 * u, cw * 0.8, 9 * u, 4.5 * u); x.fill(); x.font = '700 ' + 3.6 * u + 'px ' + F.in; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = Y; x.fillText(T('Add to cart') + '  +', 0, 0.2 * u); x.textBaseline = 'alphabetic'; x.restore();
        const bx2 = ar ? W * 0.12 : W * 0.88, by2 = H * 0.08 + 6 * u, bump = back(K(l, 1.18, 0.3)); x.fillStyle = G; x.beginPath(); x.arc(bx2, by2, 6 * u, 0, Math.PI * 2); x.fill(); x.strokeStyle = Y; x.lineWidth = 0.5 * u; x.beginPath(); x.moveTo(bx2 - 2.6 * u, by2 - 1.6 * u); x.lineTo(bx2 + 2.6 * u, by2 - 1.6 * u); x.lineTo(bx2 + 2 * u, by2 + 2.2 * u); x.lineTo(bx2 - 2 * u, by2 + 2.2 * u); x.closePath(); x.stroke();
        x.save(); x.translate(bx2 + 4.4 * u, by2 - 4.4 * u); x.scale(1 + 0.4 * Math.sin(bump * Math.PI), 1 + 0.4 * Math.sin(bump * Math.PI)); x.fillStyle = '#E5484D'; x.beginPath(); x.arc(0, 0, 2.8 * u, 0, Math.PI * 2); x.fill(); x.font = '800 ' + 3 * u + 'px ' + F.in; x.fillStyle = '#FFFFFF'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(l > 1.2 ? '1' : '0', 0, 0.2 * u); x.textBaseline = 'alphabetic'; x.restore();
        flash(l); return;
      }
      // ORDER: one tap, the order goes out on WhatsApp or WeChat, with the full list
      fill('dark'); streaks(l, 'dark', 0.4); kicker(T('THE SHOP') + ' · 04', 'dark');
      const k = back(K(l, 0, 0.25)); x.save(); x.translate(W / 2, H * 0.2); x.scale(lerp(1.7, 1, k), lerp(1.7, 1, k)); big(T('ORDER IN SECONDS.'), 9.5 * u, '#FFFFFF', 0, 0); x.restore();
      const bk = back(K(l, 0.2, 0.35)), bw = W * 0.74, bxx = ar ? W * 0.13 : W - W * 0.13 - bw, byy = H * 0.31; x.save(); x.globalAlpha = cl(bk); x.translate(0, (1 - bk) * 8 * u); x.fillStyle = '#DCF8C6'; rr(x, bxx, byy, bw, 26 * u, 4 * u); x.fill(); x.font = '600 ' + 3.2 * u + 'px ' + F.in; x.fillStyle = G; x.textAlign = ar ? 'right' : 'left';
      [T('New order · Sam Electronics'), '1 × iPhone 15 Pro Screen · ORIGINAL', '1 × iPhone 13 Battery', T('Total') + ': AED 455'].forEach((ln, j) => { x.font = (j === 0 || j === 3 ? '700 ' : '500 ') + 3.2 * u + 'px ' + F.in; x.fillText(ln, ar ? bxx + bw - 4 * u : bxx + 4 * u, byy + 6 * u + j * 5.4 * u); }); x.restore();
      [['WhatsApp', '#25D366'], ['WeChat', '#25D366']].forEach(([n2, c], j) => { const kk = back(K(l, 0.6 + j * 0.15, 0.3)); x.save(); x.translate(W / 2, H * (0.7 + j * 0.12)); x.scale(kk, kk); x.fillStyle = c; rr(x, -W * 0.36, -5 * u, W * 0.72, 10 * u, 5 * u); x.fill(); x.font = '700 ' + 4 * u + 'px ' + F.in; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#FFFFFF'; x.fillText(T('Send on') + ' ' + n2 + (ar ? '  ←' : '  →'), 0, 0.3 * u); x.textBaseline = 'alphabetic'; x.restore(); });
      flash(l, Y);
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
      if (t < BT) { let acc2 = 0, bi = 0; while (bi < BEATS.length - 1 && t >= acc2 + BEATS[bi].d) { acc2 += BEATS[bi].d; bi++; } if (VID && !BEATS[bi].c && !VID.paused) VID.pause(); BEATS[bi].f(t - acc2); const th = [0, 3, 5, 8, 11].includes(bi) ? 'dark' : 'x'; dark = th === 'dark' || (bi === 9 && Math.floor((t - acc2) / 0.09) % 3 === 1); }
      else close(t - BT);
      x.setTransform(1, 0, 0, 1, 0, 0);
      // owner (16 Nov): crystal clear and shiny: a punchier colour pass, then a soft glass reflection drifting across
      if ('filter' in x) { x.save(); x.filter = 'saturate(1.22) contrast(1.07) brightness(1.03)'; x.globalCompositeOperation = 'copy'; x.drawImage(cv, 0, 0); x.restore(); }
      { const p = ((t * 0.12) % 1.6) - 0.3, gx = x.createLinearGradient(W * (p - 0.35), 0, W * (p + 0.35), H); gx.addColorStop(0, 'rgba(255,255,255,0)'); gx.addColorStop(0.47, 'rgba(255,255,255,0)'); gx.addColorStop(0.5, 'rgba(255,255,255,.07)'); gx.addColorStop(0.53, 'rgba(255,255,255,0)'); gx.addColorStop(1, 'rgba(255,255,255,0)');
        x.save(); x.globalCompositeOperation = 'screen'; x.fillStyle = gx; x.fillRect(0, 0, W, H); x.restore(); }
      status(dark);
    }
    return { draw, dur: BT + CLOSE, logoT: BT + 0.9, setLib: () => {} };
  }
  window.SETdAd = { create };
})();
