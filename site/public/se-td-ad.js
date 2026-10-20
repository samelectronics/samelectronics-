// Sam Electronics · TEARDOWN final-call commercial, drawn on the 3D phone's screen.
// Urgent 3 (owner): redesigned as a designer would, not more decoration. Six products, each one strong shot in THE pose
// (carton behind, product in front: public/assets/pose), one short headline, one price line, clean motion (a soft
// cross-fade and a slow push-in), then the logo card. No ghost words, no bokeh, no particles, no flashes.
// API kept for se-teardown-3d.js: const ad = SETdAd.create(canvas, { lib, data }); ad.draw(t); ad.dur; ad.logoT; ad.setLib(lib)
(function () {
  const Y = '#F7C032', G = '#26282B';
  const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), K = (t, a, d) => cl((t - a) / d);
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const F = { sg: '"Space Grotesk","Arabic UI",sans-serif', in: 'Inter,"Arabic UI",sans-serif', jb: '"JetBrains Mono","Arabic UI",monospace' };
  const T = (s) => (window.seI18n ? window.seI18n.t(s) : s), AR = () => !!(window.seI18n && window.seI18n.lang() === 'ar');
  // the six products, in the order of the film (category for the price, pose id for the shot)
  const SCN = [
    { h: 'Screens.', cat: 'SCR', id: 'apple-sp' },
    { h: 'Batteries.', cat: 'BAT', id: 'part-bat' },
    { h: 'Back glass.', cat: 'BCV', id: 'part-bcv' },
    { h: 'Cameras.', cat: 'CAM', id: 'part-cam' },
    { h: 'Charging flex.', cat: 'FLX', id: 'part-flx' },
    { h: 'Small parts.', cat: 'SML', id: 'part-sml' },
  ];
  const SD = 2.6, XF = 0.4, LOGO = 2.4; // seconds per product, cross-fade, logo card
  const TOT = SCN.length * SD + LOGO, LOGO_T = SCN.length * SD + 0.5;
  function rr(x, X, Yy, w, h, r) { x.beginPath(); x.moveTo(X + r, Yy); x.arcTo(X + w, Yy, X + w, Yy + h, r); x.arcTo(X + w, Yy + h, X, Yy + h, r); x.arcTo(X, Yy + h, X, Yy, r); x.arcTo(X, Yy, X + w, Yy, r); x.closePath(); }
  function create(cv, opts) {
    const x = cv.getContext('2d'), W = cv.width, H = cv.height, u = W / 100;
    const imgs = SCN.map((q) => { const im = new Image(); im.decoding = 'async'; im.src = window.SE_SHOTS ? window.SE_SHOTS.url(q.id, 960) : ''; return im; });
    const logo = new Image(); logo.src = (opts && opts.logo) || '/assets/se-logo.png';
    const price = (cat) => { const D = window.SE_DATA, ps = D ? D.products.filter((p) => p.category === cat) : []; return ps.length ? Math.min(...ps.map((p) => p.retail_price)) : null; };
    const prices = SCN.map((q) => price(q.cat));
    // the studio: graphite, a soft floor light under the product, a hairline horizon
    function studio(a) {
      x.globalAlpha = a; x.fillStyle = G; x.fillRect(0, 0, W, H);
      const g = x.createRadialGradient(W / 2, H * 0.6, 0, W / 2, H * 0.6, W * 0.75); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.globalAlpha = 1;
    }
    function scene(i, lt, a) {
      const q = SCN[i], im = imgs[i], ar = AR();
      x.save(); x.globalAlpha = a;
      // the product: rises 4% and settles, then a slow 3% push-in for the rest of the scene
      const k = eo(K(lt, 0.05, 0.7)), push = 1 + 0.03 * K(lt, 0.4, SD), S = W * 0.84 * push, cx = W / 2, cy = H * 0.42 + (1 - k) * H * 0.04;
      if (im.complete && im.naturalWidth) { x.globalAlpha = a * k; x.drawImage(im, cx - S / 2, cy - S / 2, S, S); }
      // one short headline, one price line (text block at the lower third, aligned to the reading start)
      const tk = eo(K(lt, 0.35, 0.5)), mx = 9 * u, ty = H * 0.72 + (1 - tk) * 2 * u;
      x.globalAlpha = a * tk; x.textBaseline = 'alphabetic'; x.textAlign = ar ? 'right' : 'left'; const X0 = ar ? W - mx : mx;
      x.fillStyle = '#FFFFFF'; x.font = '700 ' + 11 * u + 'px ' + F.sg; x.fillText(T(q.h), X0, ty);
      const pk = eo(K(lt, 0.6, 0.5)); x.globalAlpha = a * pk;
      x.font = '600 ' + 4.6 * u + 'px ' + F.in; x.fillStyle = Y;
      const pr = prices[i]; x.fillText(pr != null ? (ar ? T('from') + ' ' + pr + ' ' + T('AED') : 'from AED ' + pr) : T('In stock'), X0, ty + 8 * u);
      x.restore();
    }
    function logoCard(lt, a) {
      x.save(); x.globalAlpha = a; x.fillStyle = G; x.fillRect(0, 0, W, H);
      const k = eo(K(lt, 0.1, 0.6)), s = W * 0.34 * (0.96 + 0.04 * k), cx = W / 2, cy = H * 0.44;
      x.globalAlpha = a * k; if (logo.complete && logo.naturalWidth) { x.save(); x.beginPath(); x.arc(cx, cy, s / 2, 0, 7); x.clip(); x.drawImage(logo, cx - s / 2, cy - s / 2, s, s); x.restore(); }
      const tk = eo(K(lt, 0.5, 0.5)); x.globalAlpha = a * tk; x.textAlign = 'center'; x.fillStyle = '#FFFFFF'; x.font = '700 ' + 6 * u + 'px ' + F.sg; x.fillText(AR() ? T('SAM ELECTRONICS') : 'SAM ELECTRONICS', cx, cy + s / 2 + 10 * u);
      x.fillStyle = Y; x.font = '500 ' + 3.6 * u + 'px ' + F.in; x.fillText(T('Quality · Warranty · Price'), cx, cy + s / 2 + 16 * u);
      x.restore();
    }
    function status() { // a quiet status bar: the time only
      const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
      x.globalAlpha = 0.85; x.fillStyle = '#FFFFFF'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = '600 ' + 3.6 * u + 'px ' + F.in; x.fillText(hh + ':' + mm, 9 * u, 5.5 * u); x.globalAlpha = 1; x.textBaseline = 'alphabetic';
    }
    function draw(t) {
      t = ((t % TOT) + TOT) % TOT; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); studio(1);
      const n = SCN.length;
      if (t < n * SD) { const i = Math.floor(t / SD), lt = t - i * SD;
        // cross-fade into the next scene during the last XF seconds
        const out = K(lt, SD - XF, XF); scene(i, lt, 1 - eio(out) * (i === n - 1 ? 0 : 1));
        if (out > 0 && i < n - 1) scene(i + 1, lt - SD, eio(out));
        if (i === n - 1 && out > 0) logoCard(lt - SD, eio(out));
      } else logoCard(t - n * SD, 1);
      status();
    }
    return { draw, dur: TOT, logoT: LOGO_T, setLib: () => {} };
  }
  window.SETdAd = { create };
})();
