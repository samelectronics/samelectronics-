// @ts-nocheck
/* eslint-disable */
// Bench Test (Issue 5, rebuilt 13 Oct 2026): a pinned scene (~300vh) where the scroll drives the test rig
// forward and backward (scrubbed, eased). Every element is a pure function of the progress p (0–1), written
// straight to the DOM each frame (no React re-render while scrolling), so scrolling up plays it in reverse.
//   0–10% load · 10–30% display · 30–45% touch (QUALITY) · 45–65% True Tone (WARRANTY) · 65–85% battery (PRICE) · 85–100% passed
import React from 'react';
import { DCLogic } from '@/dc/runtime';

const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), seg = (p, a, b) => cl((p - a) / (b - a));
const eo = (x) => 1 - Math.pow(1 - cl(x), 3), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (x) => { x = cl(x); const c = 1.6, q = x - 1; return 1 + (c + 1) * q * q * q + c * q * q; };
// the touch test: tap points on the phone screen (percent of the screen box)
export const TAPS = [[22, 20], [50, 20], [78, 20], [22, 50], [50, 50], [78, 50], [22, 80], [50, 80], [78, 80]];

class Component extends DCLogic {
  secRef = React.createRef();
  state = { sc: 1 };
  componentDidMount() {
    this.p = 0; this.tp = 0; this.alive = true;
    // R6 Part A: only measured while near the view (it used to read its position every frame for the whole visit)
    this.near = false; this.nearIO = new IntersectionObserver(([e]) => { this.near = e.isIntersecting; }, { rootMargin: '10% 0px 10% 0px' }); setTimeout(() => this.secRef.current && this.nearIO.observe(this.secRef.current), 50);
    const loop = () => { if (!this.alive) return; if (this.near) this.frame(); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.onResize = () => { const vw = document.documentElement.clientWidth, vh = window.innerHeight, sc = Math.min(vw / 1440, (vh - 72) / 828); if (Math.abs(sc - this.state.sc) > 0.002) this.setState({ sc }); };
    window.addEventListener('resize', this.onResize); this.onResize();
    window.seBench = (p) => { this.ov = p; this.p = p; this.frame(true); };
  }
  componentWillUnmount() { this.nearIO && this.nearIO.disconnect(); this.alive = false; cancelAnimationFrame(this.raf); window.removeEventListener('resize', this.onResize); }
  q(k) { const R = this.secRef.current; if (!R) return null; this._q = this._q || {}; const c = this._q[k]; if (c && c.isConnected) return c; return (this._q[k] = R.querySelector('[data-b="' + k + '"]')); }
  set(k, s) { const e = this.q(k); if (e) for (const n in s) { const v = s[n]; if (e.style[n] !== v) e.style[n] = v; } return e; }
  frame(force) {
    const R = this.secRef.current; if (!R) return; const r = R.getBoundingClientRect(), vh = window.innerHeight;
    if (!force && (r.bottom < -50 || r.top > vh + 50)) return; // off-screen: nothing to do (G16)
    const span = Math.max(1, r.height - vh); this.tp = this.ov != null ? this.ov : cl(-r.top / span);
    if (!force) this.p += (this.tp - this.p) * 0.14; if (Math.abs(this.tp - this.p) < 0.0004) this.p = this.tp; // scrubbed, eased
    const p = this.p, t = performance.now() / 1000;
    // ---- load: phone slides in, clamps close with a click and a 2px shake, LEDs go green, the counter wakes
    const lin = eo(seg(p, 0, 0.06)), clk = seg(p, 0.06, 0.08), shk = p > 0.08 && p < 0.1 ? Math.sin(seg(p, 0.08, 0.1) * Math.PI * 4) * 2 * (1 - seg(p, 0.08, 0.1)) : 0;
    this.set('phone', { transform: 'translate(' + shk.toFixed(2) + 'px,' + ((1 - lin) * 120).toFixed(1) + '%)' });
    this.set('clampL', { transform: 'translateX(' + (-(1 - eio(clk)) * 46).toFixed(1) + 'px)' });
    this.set('clampR', { transform: 'translateX(' + ((1 - eio(clk)) * 46).toFixed(1) + 'px)' });
    for (let i = 0; i < 4; i++) { const on = p >= 0.07 + i * 0.008; this.q('led' + i)?.classList.toggle('on', on); }
    this.set('ctr', { opacity: (0.35 + 0.65 * seg(p, 0.08, 0.1)).toFixed(3) });
    // ---- checks
    const checks = [[0.27, 'd'], [0.43, 't'], [0.6, 'w'], [0.8, 'b']];
    let n = 1; checks.forEach(([at], i) => { if (p >= at) n = Math.min(4, i + 2); });
    const eb = this.q('step'); if (eb) { const s = String(p >= 0.85 ? 4 : n); if (eb.textContent !== s) eb.textContent = s; }
    checks.forEach(([at, k]) => { const pass = p >= at; const tile = this.q('tile-' + k); if (tile) { tile.classList.toggle('pass', pass); tile.classList.toggle('run', !pass && p >= at - (k === 'd' ? 0.17 : k === 't' ? 0.13 : 0.15)); } });
    // display: a scan light sweeps down; the pixel grid fills behind it
    const dk = seg(p, 0.12, 0.26);
    this.set('scan', { transform: 'translateY(' + (dk * 100).toFixed(2) + '%)', opacity: dk > 0 && dk < 1 ? '1' : '0' });
    this.set('pix', { clipPath: 'inset(0 0 ' + ((1 - dk) * 100).toFixed(2) + '% 0)' });
    this.set('dbar', { transform: 'scaleX(' + dk.toFixed(3) + ')' });
    // touch: the probe taps the points one by one (its fine stylus never covers the screen content); a trace draws
    const tk = seg(p, 0.3, 0.42), tn = TAPS.length, fi = tk * tn, ti = Math.min(tn - 1, Math.floor(fi)), tf = fi - ti;
    const [px, py] = TAPS[ti], prev = TAPS[Math.max(0, ti - 1)], mv = eio(cl(tf / 0.5)), hx = prev[0] + (px - prev[0]) * mv, hy = prev[1] + (py - prev[1]) * mv;
    const touching = tk > 0 && tk < 1, down = touching && tf > 0.5 && tf < 0.85;
    this.set('probe', { transform: 'translate(' + hx.toFixed(2) + '%,' + hy.toFixed(2) + '%)', opacity: touching ? '1' : '0' });
    this.set('tip', { transform: 'scale(' + (down ? 0.8 : 1) + ')' });
    this.set('carriage', { left: (14 + hx * 0.72).toFixed(2) + '%' });
    TAPS.forEach((_, i) => this.q('tap' + i)?.classList.toggle('on', p >= 0.3 && (i < ti || (i === ti && tf > 0.6) || tk >= 1)));
    this.set('trace', { strokeDashoffset: (1 - cl((ti + (tf > 0.6 ? 1 : 0)) / tn) * (tk > 0 ? 1 : 0)).toFixed(3) });
    this.set('tline', { strokeDashoffset: (1 - tk).toFixed(3) });
    // True Tone: warm → cool, the needle settles
    const wk = seg(p, 0.46, 0.58), nk = seg(p, 0.47, 0.6), needle = -60 + 120 * eo(nk) + (nk > 0 && nk < 1 ? Math.sin(nk * 18) * 6 * (1 - nk) : 0);
    this.set('warm', { opacity: (p >= 0.45 && p < 0.66 ? 1 - wk : 0).toFixed(3) }); this.set('cool', { opacity: (p >= 0.45 && p < 0.66 ? wk : 0).toFixed(3) });
    this.set('needle', { transform: 'rotate(' + needle.toFixed(1) + 'deg)' });
    // warranty sticker pressed on the phone
    const sk = seg(p, 0.6, 0.63); this.set('sticker', { opacity: sk > 0 ? '1' : '0', transform: 'scale(' + (sk < 1 ? 1.5 - 0.5 * eo(sk) : 1) + ') rotate(-8deg)' });
    // battery: health charges to 98%
    const bk = seg(p, 0.66, 0.79), pct = Math.round(98 * eo(bk));
    this.set('bfill', { transform: 'scaleX(' + (0.98 * eo(bk)).toFixed(3) + ')' }); this.set('bscr', { opacity: p >= 0.65 && p < 0.86 ? '1' : '0' }); this.set('bscrf', { transform: 'scaleY(' + (0.98 * eo(bk)).toFixed(3) + ')' });
    ['bpct', 'bpct2'].forEach((k) => { const e = this.q(k); if (e && e.textContent !== pct + '%') e.textContent = pct + '%'; });
    // price tag drops in on its string
    const pk = seg(p, 0.8, 0.84), sw = p >= 0.84 ? Math.sin(t * 1.4) * 3 : Math.sin(pk * Math.PI * 3) * 14 * (1 - pk);
    this.set('ptag', { transform: 'translateY(' + (-(1 - back(pk)) * 50).toFixed(1) + 'px) rotate(' + sw.toFixed(2) + 'deg)', opacity: pk > 0 ? '1' : '0' });
    // the three words charge like bars, the circle draws into a ✓ and a line types in
    [[0.4, 0.45, 'q'], [0.6, 0.65, 'w'], [0.8, 0.85, 'p']].forEach(([a, b, k]) => { const f = seg(p, a, b);
      this.set('fill-' + k, { clipPath: 'inset(0 ' + ((1 - f) * 100).toFixed(2) + '% 0 0)' });
      this.set('ring-' + k, { strokeDashoffset: (1 - seg(p, a, a + 0.03)).toFixed(3) }); this.set('chk-' + k, { strokeDashoffset: (1 - seg(p, a + 0.025, b)).toFixed(3) });
      this.set('line-' + k, { clipPath: 'inset(0 ' + ((1 - seg(p, a + 0.02, b + 0.02)) * 100).toFixed(2) + '% 0 0)' }); });
    // passed: the work order feeds out, the PASSED stamp lands with a shake, the counter rolls 1,293 → 1,294
    const ok = seg(p, 0.86, 0.94), st = seg(p, 0.94, 0.965), ssh = st > 0 && st < 1 ? Math.sin(st * Math.PI * 5) * 3 * (1 - st) : 0, sway = ok >= 1 ? Math.sin(t * 0.9) * 0.6 : 0;
    this.set('order', { transform: 'translateY(' + (-(1 - eio(ok)) * 100).toFixed(2) + '%) rotate(' + sway.toFixed(2) + 'deg)' });
    this.set('stamp', { opacity: st > 0 ? '1' : '0', transform: 'translate(' + ssh.toFixed(1) + 'px,0) scale(' + (st < 1 ? 1.6 - 0.6 * eo(st) : 1) + ') rotate(-12deg)' });
    const cnt = p >= 0.965 ? '1,294' : '1,293', c = this.q('count'); if (c && c.dataset.v !== cnt) { c.dataset.v = cnt; c.textContent = cnt; c.classList.remove('roll'); void c.offsetWidth; if (p >= 0.965) c.classList.add('roll'); }
  }
  renderVals() { return { secRef: this.secRef, sc: this.state.sc }; }
}

export default Component;
