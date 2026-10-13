// @ts-nocheck
/* eslint-disable */
// The Showcase (Issue 6, replaces the Model File): five screen-grade adverts on a graphite | yellow stage.
// Each ad runs on its own clock t (about 7.5s; the Service Pack lead has its box-opening moment and runs 9.5s).
// Every element is a pure function of t, written to the DOM each frame, so pause, arrows and capture are exact.
import React from 'react';
import { DCLogic } from '@/dc/runtime';

const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), seg = (t, a, d) => cl((t - a) / d);
const ex = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * cl(x))), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

export const ADS = [
  { g: 'SP', k: 'SERVICE PACK', h: ['Straight from', 'the maker’s box.'], c: ['Genuine manufacturer part', 'Sealed in its service box', 'Warranty on every grade*'], box: true },
  { g: 'OR', k: 'ORIGINAL', h: ['The original.', 'Nothing less.'], c: ['Genuine original part', 'Tested before it ships', 'Warranty on every grade*'] },
  { g: 'OL', k: 'OLED', h: ['Deep blacks.', 'Fair price.'], c: ['OLED replacement screen', 'Bright, sharp, responsive', 'Tested on our bench'] },
  { g: 'IN', k: 'INCELL', h: ['Best value.', 'Still bright.'], c: ['Incell replacement screen', 'Best value for money', 'Tested on our bench'] },
  { g: 'HQ', k: 'HIGH COPY', h: ['Budget-friendly.', 'Still tested.'], c: ['Tested copy (for example GX)', 'Budget comes first', 'Checked before it ships'] },
];
const DUR = (i) => (ADS[i].box ? 9.5 : 7.5);

class Component extends DCLogic {
  secRef = React.createRef();
  state = { i: 0, lib: null, data: window.SE_DATA || null, seen: false };
  componentDidMount() {
    this.t = 0; this.alive = true; this.hov = false; let last = performance.now();
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk }); this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true }); }, { threshold: 0.3 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    const loop = (now) => { if (!this.alive) return; const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (this.vis && !document.hidden && this.ov == null) { if (!this.hov) this.t += dt; if (this.t >= DUR(this.state.i)) this.next(1, true); this.frame(); }
      this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seShow = (i, t) => { this.ov = t; this.t = t; this.setState({ i }, () => this.frame()); };
  }
  componentWillUnmount() { window.removeEventListener('se:lang', this.onLang); this.alive = false; cancelAnimationFrame(this.raf); clearInterval(this.dIv); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); }
  componentDidUpdate() { this.frame(); }
  next(d, auto) { const n = ADS.length, i = (this.state.i + d + n) % n; this.t = auto ? 0 : 0.02; this.setState({ i }); }
  q(k) { const R = this.secRef.current; if (!R) return null; return R.querySelector('[data-s="' + k + '"]'); }
  set(k, s) { const e = this.q(k); if (e) for (const n in s) if (e.style[n] !== s[n]) e.style[n] = s[n]; }
  frame() {
    const i = this.state.i, a = ADS[i], D = DUR(i), t = this.t, box = !!a.box, T0 = box ? 1.2 : 0; // the lead ad's product appears after the box opens
    const out = seg(t, D - 0.5, 0.5), oe = eio(out);
    // text on graphite
    this.set('eb', { opacity: (ex(seg(t, 0, 0.3)) * (1 - oe)).toFixed(3), transform: 'translateY(' + (-oe * 24).toFixed(1) + 'px)' });
    const R = this.secRef.current; if (!R) return;
    R.querySelectorAll('[data-s="w"]').forEach((w, j) => { const k = ex(seg(t, 0.1 + j * 0.06, 0.45)); w.style.opacity = (k * (1 - oe)).toFixed(3); w.style.filter = k < 1 ? 'blur(' + ((1 - k) * 8).toFixed(1) + 'px)' : 'none'; w.style.transform = 'translateY(' + (-oe * 30 - (1 - k) * 6).toFixed(1) + 'px)'; });
    R.querySelectorAll('[data-s="c"]').forEach((c, j) => { const k = seg(t, 1.0 + j * 0.25, 0.25); c.style.opacity = (ex(k) * (1 - oe)).toFixed(3); c.style.transform = 'translateY(' + (-oe * 30).toFixed(1) + 'px)'; c.classList.toggle('on', k > 0.4); });
    this.set('btn', { opacity: (ex(seg(t, 1.2, 0.4)) * (1 - oe)).toFixed(3), transform: 'translateY(' + ((1 - ex(seg(t, 1.2, 0.4))) * 12 - oe * 30).toFixed(1) + 'px)' });
    // product on yellow: enters with depth (from 70%, slightly turned), 2° overshoot, then a slow ±10° turn; exits backwards
    const pin = seg(t, 0.3 + T0, 1.1), pe = ex(pin), ov = Math.sin(Math.PI * cl((pin - 0.55) / 0.45)) * 2 * (pin < 1 ? 1 : 0);
    const turn = t > 1.4 + T0 ? Math.sin((t - 1.4 - T0) * 0.55) * 10 : 0, up = box ? (1 - eio(seg(t, 1.5, 0.9))) * 150 - 70 : 0; // the lead screen rises clear of its box
    this.set('prod', { opacity: ((box ? cl(seg(t, 1.5, 0.3)) : cl(pin * 2)) * (1 - oe)).toFixed(3), transform: 'translateY(' + (up + oe * 20).toFixed(1) + 'px) scale(' + ((box ? 0.74 + 0.08 * eio(seg(t, 1.5, 0.9)) : 0.7 + 0.3 * pe) * (1 - 0.15 * oe)).toFixed(4) + ') rotateY(' + ((box ? (1 - eio(seg(t, 1.6, 0.9))) * 35 : (1 - pe) * -18) + turn).toFixed(2) + 'deg) rotate(' + ((1 - pe) * -6 + ov).toFixed(2) + 'deg)' });
    this.set('shadow', { opacity: (cl(pin * 1.5) * (1 - oe) * (box ? cl(seg(t, 2.0, 0.4)) : 1)).toFixed(3), transform: 'scale(' + (0.6 + 0.4 * pe).toFixed(3) + ')' });
    const sh = t > 2 ? ((t - 2) % 3) / 0.9 : -1; this.set('sheen', { transform: 'translateX(' + (sh >= 0 && sh <= 1 ? -120 + 260 * eio(sh) : -120) + '%)' });
    // badge stamps on the yellow side
    const bk = seg(t, 1.6 + (box ? 1.0 : 0), 0.25); this.set('badge', { opacity: (bk > 0 ? 1 - oe : 0).toFixed(3), transform: 'scale(' + (bk < 1 ? 1.6 - 0.6 * ex(bk) : 1).toFixed(3) + ') rotate(-6deg)' });
    // the Service Pack moment: the sealed box slides in, the flap lifts, the screen slides out and turns, a seal stamps
    if (box) { const bi = ex(seg(t, 0.3, 0.7)), fl = eio(seg(t, 1.0, 0.5)), sl = seg(t, 2.4, 0.3);
      this.set('box', { opacity: (cl(bi * 1.5) * (1 - oe)).toFixed(3), transform: 'translateX(' + ((1 - bi) * 160).toFixed(1) + 'px) translateY(' + (oe * 30).toFixed(1) + 'px)' });
      this.set('flap', { transform: 'rotateX(' + (-fl * 115).toFixed(1) + 'deg)' });
      this.set('seal', { opacity: sl > 0 ? (1 - oe).toFixed(3) : '0', transform: 'scale(' + (sl < 1 ? 1.7 - 0.7 * ex(sl) : 1).toFixed(3) + ') rotate(-10deg)' }); }
    // story-style progress
    R.querySelectorAll('[data-s="bar"]').forEach((b, j) => { b.style.transform = 'scaleX(' + (j < i ? 1 : j > i ? 0 : cl(t / D)).toFixed(4) + ')'; });
  }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib, a = ADS[s.i];
    const price = (g) => { if (!D) return null; const ps = D.products.filter((p) => p.category === 'SCR' && p.grade === g); return ps.length ? Math.min(...ps.map((p) => p.retail_price)) : null; };
    const pr = price(a.g);
    const L = window.seI18n; return { isAr: !!(L && L.lang() === 'ar'), tr: (x) => (L ? L.tr(x) : x), secRef: this.secRef, i: s.i, ad: a, ads: ADS.map((x, j) => ({ k: x.k, on: j === s.i, go: () => { this.t = 0.02; this.setState({ i: j }); } })), img: lib && lib.large ? lib.large[0] : '', hasImg: !!(lib && lib.large), price: pr ? 'AED ' + pr : '', hasPrice: !!pr,
      enter: () => { this.hov = true; }, leave: () => { this.hov = false; }, prev: () => this.next(-1), next: () => this.next(1),
      ts: (e) => { this._tx = e.touches[0].clientX; }, te: (e) => { if (this._tx == null) return; const dx = e.changedTouches[0].clientX - this._tx; this._tx = null; if (Math.abs(dx) > 40) this.next(dx < 0 ? 1 : -1); },
      shop: (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('se:fmp', { detail: { c: 'SCR' } })); } };
  }
}

export default Component;
