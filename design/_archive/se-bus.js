// Continuous two-rail circuit bus for the home page. mount(root) -> dispose
export function mount(root) {
  const NS = 'http://www.w3.org/2000/svg';
  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute;left:0;top:0;width:100%;pointer-events:none;z-index:6;overflow:hidden';
  root.appendChild(wrap);
  const svg = document.createElementNS(NS, 'svg');
  svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  wrap.appendChild(svg);
  let rails = [], branches = [], pulses = [], alive = true, last = performance.now(), lastY = window.scrollY, spawnT = [0, 1.7], W = 0, H = 0;
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const DARK = 'rgba(247,192,50,.35)', LIGHT = 'rgba(61,62,63,.25)';
  function build() {
    const rr = root.getBoundingClientRect(), vw = root.clientWidth, hero = root.querySelector('#top'), foot = root.querySelector('footer');
    if (!hero || !foot) return;
    const y0 = hero.getBoundingClientRect().bottom - rr.top, y1 = foot.getBoundingClientRect().top - rr.top + 40;
    H = root.scrollHeight; W = vw;
    wrap.style.height = H + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const pad = Math.min(64, Math.max(20, vw * 0.04)), inner = Math.max((vw - 1312) / 2, pad), mob = vw < 768;
    const rx = mob ? 12 : Math.max(12, inner - 32);
    // tones
    const secs = [...root.querySelectorAll('[data-tone]')].filter((s) => s.tagName !== 'HEADER').map((s) => { const r = s.getBoundingClientRect(); return { t: r.top - rr.top, b: r.bottom - rr.top, dark: s.getAttribute('data-tone') === 'dark', el: s }; }).filter((s) => s.b > y0 && s.t < y1).sort((a, b) => a.t - b.t);
    const defs = el('defs', {}); svg.appendChild(defs);
    const grad = el('linearGradient', { id: 'seBusG', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H });
    let prev = null;
    secs.forEach((s) => { const c = s.dark ? DARK : LIGHT; if (prev !== null && prev !== c) { grad.appendChild(el('stop', { offset: Math.max(0, (s.t - 40) / H), 'stop-color': prev })); grad.appendChild(el('stop', { offset: Math.min(1, (s.t + 40) / H), 'stop-color': c })); } else if (prev === null) grad.appendChild(el('stop', { offset: s.t / H, 'stop-color': c })); prev = c; });
    if (prev) grad.appendChild(el('stop', { offset: 1, 'stop-color': prev }));
    defs.appendChild(grad);
    const glow = el('filter', { id: 'seBusGl', x: '-200%', y: '-200%', width: '500%', height: '500%' }); glow.appendChild(el('feGaussianBlur', { stdDeviation: 3 })); defs.appendChild(glow);
    rails = []; branches = [];
    [1, -1].forEach((side, si) => {
      const X = side === 1 ? rx : W - rx, inward = side;
      let d = 'M' + X + ' ' + y0, y = y0, x = X, k = 0, nodes = [];
      const jogMax = mob ? 0 : Math.max(0, Math.min(10, inner - 32 - 14));
      while (y < y1) {
        const seg = 380 + ((k * 173 + si * 97) % 320); const ny = Math.min(y1, y + seg);
        d += ' V' + ny; for (let ny2 = y + 150 + ((k * 37) % 50); ny2 < ny - 30; ny2 += 140 + ((k * 23) % 60)) nodes.push([x, ny2]);
        y = ny; if (y >= y1 || !jogMax) { k++; continue; }
        const dir = (k % 2 ? -1 : 1) * inward, nx = Math.max(6, Math.min(W - 6, x + dir * jogMax));
        d += ' L' + nx + ' ' + (y + Math.abs(nx - x)); y += Math.abs(nx - x); x = nx; k++;
      }
      const p = el('path', { d, stroke: 'url(#seBusG)', 'stroke-width': 2, fill: 'none', 'stroke-linejoin': 'round' }); svg.appendChild(p);
      // parallel bus bundles
      for (let b = 0; b < Math.floor((y1 - y0) / 1600); b++) { const by = y0 + 500 + b * 1600 + si * 300; [1, 2].forEach((j) => { const ox = X - inward * j * 5; if (ox < 3 || ox > W - 3) return; svg.appendChild(el('path', { d: 'M' + ox + ' ' + by + ' V' + (by + 180), stroke: 'url(#seBusG)', 'stroke-width': 1.2, fill: 'none', opacity: 0.8 })); }); }
      nodes.forEach(([nx, ny]) => svg.appendChild(el('circle', { cx: nx, cy: ny, r: 4, fill: 'none', stroke: 'url(#seBusG)', 'stroke-width': 2 })));
      const len = p.getTotalLength(), N = Math.max(2, Math.min(400, Math.ceil(len / 6))), lut = new Float32Array(N * 2); for (let i = 0; i < N; i++) { const q = p.getPointAtLength((i / (N - 1)) * len); lut[i * 2] = q.x; lut[i * 2 + 1] = q.y; } rails.push({ p, len, side, lut, N });
    });
    // branches: 1-2 per section toward its content, stopping 24px short
    const endX = inner - 24;
    secs.forEach((s, i) => {
      [0.32, 0.68].slice(0, s.b - s.t > 700 ? 2 : 1).forEach((f, j) => {
        const by = s.t + (s.b - s.t) * f; if (by < y0 + 60 || by > y1 - 60) return;
        rails.forEach((r) => {
          const X = r.side === 1 ? rx : W - rx, EX = r.side === 1 ? endX : W - endX, span = Math.abs(EX - X); if (span < 10) return;
          const dg = Math.min(16, span * 0.6), sgn = r.side;
          const d = 'M' + X + ' ' + by + ' L' + (X + sgn * dg) + ' ' + (by - dg) + ' H' + EX;
          const bp = el('path', { d, stroke: s.dark ? DARK : LIGHT, 'stroke-width': 1.6, fill: 'none' }); svg.appendChild(bp);
          const nd = el('circle', { cx: EX, cy: by - dg, r: 4, fill: s.dark ? '#26282B' : '#F2F3F4', stroke: s.dark ? '#F7C032' : '#8C9096', 'stroke-width': 1.6 }); svg.appendChild(nd);
          const ng = el('circle', { cx: EX, cy: by - dg, r: 7, fill: '#FFDB6E', opacity: 0, filter: 'url(#seBusGl)' }); svg.appendChild(ng);
          const bl = bp.getTotalLength(), BN = Math.max(2, Math.min(60, Math.ceil(bl / 6))), blut = new Float32Array(BN * 2); for (let q2 = 0; q2 < BN; q2++) { const q = bp.getPointAtLength((q2 / (BN - 1)) * bl); blut[q2 * 2] = q.x; blut[q2 * 2 + 1] = q.y; } branches.push({ y: by, side: r.side, path: bp, len: bl, lut: blut, N: BN, glow: ng, t: 0 });
        });
      });
    });
    pulses.forEach((pl) => pl.g.remove()); pulses = [];
  }
  function dot() { const g = el('g', {}); g.appendChild(el('circle', { r: 6, fill: '#FFDB6E', opacity: 0.55, filter: 'url(#seBusGl)' })); g.appendChild(el('circle', { r: 3, fill: '#FFF4D1' })); svg.appendChild(g); return g; }
  function at(o, s) { const i = Math.max(0, Math.min(o.N - 1, Math.round((s / o.len) * (o.N - 1)))); return { x: o.lut[i * 2], y: o.lut[i * 2 + 1] }; }
  function lenAtY(r, y) { let lo = 0, hi = r.N - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (r.lut[m * 2 + 1] < y) lo = m + 1; else hi = m; } return (lo / (r.N - 1)) * r.len; }
  function frame(now) {
    if (!alive) return; requestAnimationFrame(frame);
    if (now - last < 32) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!rails.length || document.hidden) return;
    const rr = root.getBoundingClientRect(), vt = -rr.top, vb = vt + window.innerHeight, sy = window.scrollY, ds = sy - lastY; lastY = sy;
    rails.forEach((r, i) => { spawnT[i] -= dt; if (spawnT[i] <= 0) { spawnT[i] = 3 + Math.random(); const L = lenAtY(r, ds < -2 ? vb + 40 : vt - 20); pulses.push({ r, s: L, g: dot(), dir: ds < -2 ? -1 : 1 }); } });
    pulses = pulses.filter((pl) => {
      const v = 400 * pl.dir * dt + ds * 1.2; pl.s += v;
      if (pl.br) { pl.bs += 260 * dt; const pt = at(pl.br, Math.min(pl.bs, pl.br.len)); pl.g.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')'); if (pl.bs >= pl.br.len) { pl.br.t = 0.6; pl.g.remove(); return false; } return true; }
      if (pl.s < 0 || pl.s > pl.r.len) { pl.g.remove(); return false; }
      const pt = at(pl.r, pl.s); if (pt.y < vt - 200 || pt.y > vb + 200) { pl.g.remove(); return false; }
      pl.g.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
      let br = null; if (!pl.tested) { for (let k = 0; k < branches.length; k++) { const b = branches[k]; if (b.side === pl.r.side && Math.abs(b.y - pt.y) < Math.abs(v) + 2) { br = b; break; } } }
      if (br && Math.random() < 0.6 && pulses.length < 10) { const clone = { r: pl.r, s: pl.s, g: dot(), br, bs: 0 }; pulses.push(clone); }
      return true;
    });
    branches.forEach((b) => { if (b.t > 0) { b.t -= dt; b.glow.setAttribute('opacity', Math.max(0, Math.min(1, b.t / 0.6)) * 0.9); } });
  }
  let rt; const rebuild = () => { clearTimeout(rt); rt = setTimeout(build, 150); };
  let rw = root.clientWidth; const ro = new ResizeObserver(() => { if (root.clientWidth !== rw) { rw = root.clientWidth; rebuild(); } }); ro.observe(root);
  window.addEventListener('resize', rebuild);
  requestIdleCallback ? requestIdleCallback(build, { timeout: 2000 }) : setTimeout(build, 500); let lastSH = 0; const iv = setInterval(() => { if (root.clientWidth !== W || Math.abs(root.scrollHeight - lastSH) > 300) { lastSH = root.scrollHeight; build(); } }, 5000);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(frame);
  return () => { alive = false; ro.disconnect(); clearInterval(iv); window.removeEventListener('resize', rebuild); wrap.remove(); };
}
