// @ts-nocheck
/* eslint-disable */
// Our story & branches (Issue 10, rebuilt 13 Oct 2026). Styles in src/styles/story.css.
// A pinned, scroll-driven film over the five versions. Everything that scrubs is a pure function of p (0–1) written
// straight to the DOM each frame; the photo "develop" is a 1.2s transition triggered when the line reaches a card.
//   0–15% the line draws to v1.0 · 15–60% it walks the versions (cards lift, photos develop, the year rolls)
//   60–75% RUNNING / INSTALLING · then the branches (map cards + stats strip) follow in the normal flow
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), seg = (p, a, b) => cl((p - a) / (b - a));
export const CX = [0.1, 0.3, 0.5, 0.7, 0.9]; // card centres along the line
const NOW = new Date().getFullYear();
// the line: 0–15% → first card, 15–60% → last card, 60–70% → the end
const lineAt = (p) => (p < 0.15 ? CX[0] * seg(p, 0, 0.15) : p < 0.6 ? CX[0] + (CX[4] - CX[0]) * seg(p, 0.15, 0.6) : CX[4] + (1 - CX[4]) * seg(p, 0.6, 0.7));
// the year counter rolls with the line: 2003 → 2011 → 2015 → 2020 → today
const YA = [[0, 2003], [CX[0], 2003], [CX[1], 2011], [CX[2], 2015], [CX[3], 2020], [0.8, NOW], [1, NOW]];
const yearAt = (L) => { for (let i = 1; i < YA.length; i++) if (L <= YA[i][0]) { const [a, ya] = YA[i - 1], [b, yb] = YA[i]; return Math.round(ya + (yb - ya) * seg(L, a, b)); } return NOW; };

class Component extends DCLogic {
  secRef = React.createRef();
  brRef = React.createRef();
  state = { sc: 1, data: window.SE_DATA || null, br: false };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.setState({ br: false }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    this.p = 0; this.alive = true;
    const loop = () => { if (!this.alive) return; this.frame(); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.onResize = () => { const vw = document.documentElement.clientWidth, vh = window.innerHeight, sc = Math.min(vw / 1440, (vh - 72) / 800); if (Math.abs(sc - this.state.sc) > 0.002) this.setState({ sc }); };
    window.addEventListener('resize', this.onResize); this.onResize();
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.br) { this.setState({ br: true }); this.countUp(); } }, { threshold: 0.25 });
    setTimeout(() => this.brRef.current && this.io.observe(this.brRef.current), 50);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seStory = (p) => { this.ov = p; this.p = p; this.frame(true); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); this.alive = false; cancelAnimationFrame(this.raf); cancelAnimationFrame(this.nRaf); clearInterval(this.dIv); this.io && this.io.disconnect(); window.removeEventListener('resize', this.onResize); window.removeEventListener('se:lang', this.onLang); }
  q(k) { const R = this.secRef.current; if (!R) return null; this._q = this._q || {}; const c = this._q[k]; if (c && c.isConnected) return c; return (this._q[k] = R.querySelector('[data-s="' + k + '"]')); }
  set(k, s) { const e = this.q(k); if (e) for (const n in s) { const v = s[n]; if (e.style[n] !== v) e.style[n] = v; } return e; }
  frame(force) {
    const R = this.secRef.current; if (!R) return; const r = R.getBoundingClientRect(), vh = window.innerHeight;
    if (!force && (r.bottom < -50 || r.top > vh + 50)) return;
    const tp = this.ov != null ? this.ov : cl(-r.top / Math.max(1, r.height - vh));
    if (!force) this.p += (tp - this.p) * 0.14; if (Math.abs(tp - this.p) < 0.0004) this.p = tp;
    const p = this.p, L = lineAt(p);
    // the line and its yellow current streak at the tip
    this.set('line', { transform: 'scaleX(' + L.toFixed(4) + ')' });
    this.set('tip', { transform: 'translateX(' + (L * 1272).toFixed(1) + 'px)', opacity: L > 0.002 && L < 0.999 ? '1' : '0' });
    // the year counter
    const y = String(yearAt(L)), ye = this.q('year'); if (ye && ye.textContent !== y) ye.textContent = y;
    this.q('yearT')?.classList.toggle('now', L >= 0.8);
    // cards lift in as the line reaches them; their photos develop (1.2s, warm first, then true colour)
    CX.forEach((c, i) => { const on = L >= c - 0.004, card = this.q('card' + i), node = this.q('node' + i);
      if (card && card.classList.contains('on') !== on) card.classList.toggle('on', on); if (node && node.classList.contains('on') !== on) node.classList.toggle('on', on); });
    // RUNNING / INSTALLING
    const rk = seg(p, 0.6, 0.66), ik = seg(p, 0.64, 0.75);
    this.q('run')?.classList.toggle('on', rk >= 1);
    this.set('inst', { transform: 'scaleX(' + (0.06 + 0.3 * ik).toFixed(3) + ')' });
    this.q('instW')?.classList.toggle('on', ik > 0);
    this.set('hint', { opacity: (1 - seg(p, 0.02, 0.08)).toFixed(3) });
  }
  countUp() { const R = this.brRef.current; if (!R) return; const els = [...R.querySelectorAll('[data-n]')], t0 = performance.now() + 700;
    const step = (now) => { const k = cl((now - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
      els.forEach((el) => { const to = +el.dataset.n, from = +(el.dataset.from || 0), v = String(Math.round(from + (to - from) * e)); if (el.textContent !== v) el.textContent = v; });
      if (k < 1) this.nRaf = requestAnimationFrame(step); }; this.nRaf = requestAnimationFrame(step); }
  renderVals() {
    const s = this.state, D = s.data, H = D ? D.history : [], ss = (D && D.serviceStats) || { countries: 24 };
    const items = H.map((h, i) => ({ ...h, i, now: i === 3, soon: i === 4 }));
    return { secRef: this.secRef, brRef: this.brRef, sc: s.sc, items, br: s.br, countries: ss.countries,
      more: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Our story', text: 'The full Our Story page is coming soon.' } })); },
      mapsDxb: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('78G4+3H2 Dubai'),
      mapsMad: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Plaza Mayor, Madrid') };
  }
}

export default Component;
