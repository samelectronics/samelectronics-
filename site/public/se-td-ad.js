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
  const T = (s) => (window.seI18n ? window.seI18n.t(s) : s), AR = () => !!(window.seI18n && window.seI18n.lang() === 'ar');
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
    const out = cv.getContext('2d'), off = document.createElement('canvas'); off.width = cv.width; off.height = cv.height;
    const x = off.getContext('2d'), W = cv.width, H = cv.height, u = W / 100, M = 9 * u, SAFE = { s: 0.86, top: 0.07 };
    let lang = null, imgs = [];
    const load = () => { lang = AR(); imgs = SCN.map((q) => { const im = new Image(); im.decoding = 'async'; im.src = window.SE_SHOTS ? window.SE_SHOTS.url(q.id, 960) : ''; return im; }); };
    load();
    const logo = new Image(); logo.src = (opts && opts.logo) || '/assets/se-logo.png';
    // particles for the close: they come in from the edges and settle on the logo ring
    const PN = 180, PT = Array.from({ length: PN }, (_, i) => { const a = Math.random() * Math.PI * 2, e = Math.random(); const side = i % 4; const sx = side === 0 ? -0.1 : side === 1 ? 1.1 : Math.random(), sy = side === 2 ? -0.1 : side === 3 ? 1.1 : Math.random(); return { sx, sy, a, r: 0.86 + e * 0.14, s: 0.5 + Math.random() * 1.4, d: Math.random() * 0.35, sw: (Math.random() - 0.5) * 1.6 }; });
    const ok = (im) => im && im.complete && im.naturalWidth;
    // ---------- pieces ----------
    function bg(th, a = 1) { const c = TH[th].bg, g = x.createRadialGradient(W / 2, H * 0.36, 0, W / 2, H * 0.36, H * 0.75); g.addColorStop(0, c[0]); g.addColorStop(0.52, c[1]); g.addColorStop(1, c[2]); x.globalAlpha = a; x.fillStyle = g; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
    function dashes(i, th, k) { // the progress dashes under the island, like the hero reel
      const n = SCN.length, gw = 1.6 * u, w = (W - 2 * M - gw * (n - 1)) / n, y = 10.5 * u, ar = AR();
      for (let j = 0; j < n; j++) { const X = ar ? W - M - (j + 1) * w - j * gw : M + j * (w + gw); x.fillStyle = TH[th].dot; rr(x, X, y, w, 0.55 * u, 0.27 * u); x.fill(); const f = j < i ? 1 : j === i ? k : 0; if (f > 0) { x.fillStyle = TH[th].ink; rr(x, ar ? X + w * (1 - f) : X, y, w * f, 0.55 * u, 0.27 * u); x.fill(); } } }
    function text(s, X, Yy, font, col, align) { x.font = font; x.fillStyle = col; x.textAlign = align; x.direction = AR() ? 'rtl' : 'ltr'; x.fillText(s, X, Yy); x.direction = 'ltr'; }
    function scene(i, lt) { // one product scene, lt = its local time (0 = its transition starts)
      const q = SCN[i], th = TH[q.th], ar = AR(), al = ar ? 'right' : 'left', X0 = ar ? W - M : M, dir = ar ? -1 : 1;
      bg(q.th);
      // a soft glow behind the product
      { const g = x.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, W * 0.55); g.addColorStop(0, th.glow); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
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
      // the items, each with a stock dot (green = in stock, grey = on request), ticking in
      q.it.forEach(([name, st], j) => { const k = eo(K(lt, 0.62 + j * 0.09, 0.3)), y = H * 0.745 + j * 5.6 * u; if (k <= 0) return; x.globalAlpha = k; const xo = X0 - dir * (1 - k) * 5 * u;
        x.fillStyle = st ? '#2BB673' : (q.th === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(38,40,43,.3)'); x.beginPath(); x.arc(ar ? xo - 0.9 * u : xo + 0.9 * u, y - 1.2 * u, 0.9 * u, 0, 7); x.fill();
        text(T(name), ar ? xo - 3 * u : xo + 3 * u, y, '500 ' + 3.7 * u + 'px ' + F.in, th.sub, al);
        text(st ? (ar ? T('in stock') + ' ' + st : st + ' in stock') : T('On request'), ar ? M : W - M, y, '600 ' + 3.1 * u + 'px ' + F.jb, st ? (q.th === 'yel' ? '#1E7A4C' : '#2BB673') : th.kick, ar ? 'left' : 'right'); x.globalAlpha = 1; });
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
      const fl = 1 - cl(l / 0.07); if (fl > 0) { x.globalAlpha = fl * 0.85; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } }
    function call(lt) { // "Get yours today." on yellow, then "In stock in Deira." on graphite
      const ar = AR(), dir = ar ? -1 : 1, al = ar ? 'right' : 'left', X0 = ar ? W - M : M;
      if (lt < 1.15) { bg('yel'); x.textBaseline = 'alphabetic';
        [['Get', -1, 0], ['yours', 1, 0.08], ['today.', -1, 0.16]].forEach(([w2, from, d], j) => { const k = K(lt, 0.05 + d, 0.3), e = back(k), s = lerp(1.5, 1, eo(k)); if (k <= 0) return; x.save(); x.globalAlpha = cl(k * 2.5); x.translate(X0 + from * dir * 20 * u * (1 - e), H * 0.4 + j * 16 * u); x.scale(s, s); text(T(w2), 0, 0, '700 ' + 17 * u + 'px ' + F.sg, G, al); x.restore(); });
        const lk = eo(K(lt, 0.55, 0.35)); x.fillStyle = G; x.fillRect(ar ? X0 - 40 * u * lk : X0, H * 0.4 + 36 * u, 40 * u * lk, 1.4 * u);
        const fl = K(lt, 1.0, 0.15); if (fl > 0) { x.globalAlpha = fl; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } return; }
      const l = lt - 1.15; bg('dark'); const fl = 1 - cl(l / 0.15);
      [['In stock', '#FFFFFF'], ['in Deira.', Y]].forEach(([w2, c], j) => { const k = K(l, 0.05 + j * 0.12, 0.35), e = eo5(k); if (k <= 0) return; x.save(); x.beginPath(); x.rect(0, H * 0.36 + j * 15 * u - 14 * u, W, 17 * u); x.clip(); x.globalAlpha = 1; text(T(w2), X0, H * 0.36 + j * 15 * u + (1 - e) * 15 * u, '700 ' + 14.5 * u + 'px ' + F.sg, c, al); x.restore(); });
      const mk = eo(K(l, 0.45, 0.35)); x.globalAlpha = mk; text(T('AL MURAR · DEIRA · DUBAI'), X0, H * 0.36 + 30 * u, '600 ' + 3.2 * u + 'px ' + F.jb, '#D5D7DA', al);
      text(T('14 brands · shipped worldwide'), X0, H * 0.36 + 36 * u, '500 ' + 3.6 * u + 'px ' + F.in, '#9DA1A6', al); x.globalAlpha = 1;
      if (fl > 0) { x.globalAlpha = fl; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } }
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
      const out = K(lt, CLOSE - 0.25, 0.25); if (out > 0) { x.globalAlpha = out; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; } }
    function status(dark) { // the status bar: the time, signal and battery, in the screen's ink
      const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'), c = dark ? '#FFFFFF' : G;
      x.globalAlpha = 0.9; x.fillStyle = c; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = '600 ' + 3.4 * u + 'px ' + F.in; x.fillText(hh + ':' + mm, M, 5.6 * u);
      for (let j = 0; j < 4; j++) x.fillRect(W - M - 11.5 * u + j * 1.3 * u, 6.6 * u - (j + 1) * 0.55 * u, 0.85 * u, (j + 1) * 0.55 * u);
      x.strokeStyle = c; x.lineWidth = 0.3 * u; rr(x, W - M - 5.6 * u, 4.6 * u, 5 * u, 2.4 * u, 0.6 * u); x.stroke(); x.fillRect(W - M - 5.1 * u, 5.1 * u, 3.6 * u, 1.4 * u); x.globalAlpha = 1; x.textBaseline = 'alphabetic'; }
    function draw(t) {
      if (AR() !== lang) load();
      t = ((t % TOT) + TOT) % TOT; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
      let dark = true;
      if (t < S0) open(t);
      else if (t < M0) { const i = Math.floor((t - S0) / SD), lt = t - S0 - i * SD; dark = SCN[i].th === 'dark';
        if (i === 0) { if (lt < 0.3) { x.fillStyle = Y; x.fillRect(0, 0, W, H); x.globalAlpha = 1 - lt / 0.3; open(OPEN); x.globalAlpha = 1; x.save(); x.globalAlpha = eo(lt / 0.3); scene(0, lt); x.restore(); } else scene(0, lt); }
        else into(i, lt, () => scene(i - 1, SD + lt)); }
      else if (t < C0) { montage(t - M0); dark = ['yel', 'dark', 'light'][Math.min(5, Math.floor((t - M0) / (MONT / 6))) % 3] === 'dark'; }
      else if (t < L0) { call(t - C0); dark = t - C0 >= 1.15; }
      else close(t - L0);
      status(dark);
      // place it in the safe area: margin colour = the ad's edge colour (top and bottom), then the ad itself
      const px = (yy) => { const d = x.getImageData(4, yy, 1, 1).data; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'; };
      const g = out.createLinearGradient(0, 0, 0, H); g.addColorStop(0, px(4)); g.addColorStop(1, px(H - 5)); out.setTransform(1, 0, 0, 1, 0, 0); out.fillStyle = g; out.fillRect(0, 0, W, H);
      const sw = W * SAFE.s, sh = H * SAFE.s; out.drawImage(off, (W - sw) / 2, H * SAFE.top, sw, sh);
    }
    return { draw, dur: TOT, logoT: LOGO_T, setLib: () => {} };
  }
  window.SETdAd = { create };
})();
