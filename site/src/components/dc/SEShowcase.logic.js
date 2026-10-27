// @ts-nocheck
/* eslint-disable */
// The Showcase (Issue 6, replaces the Model File): five screen-grade adverts on a graphite | yellow stage.
// Each ad runs on its own clock t (about 7.5s; the Service Pack lead has its box-opening moment and runs 9.5s).
// Every element is a pure function of t, written to the DOM each frame, so pause, arrows and capture are exact.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), seg = (t, a, d) => cl((t - a) / d);
const ex = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * cl(x))), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

// 14 Oct §10: Original first; each grade carries its own one-line description, four quality bars (out of 5, sample)
// and a screen look (how bright and rich its picture is).
// R6 Part E: the Excel's qualities (High Copy is not one of them and is gone). Featured until the owner chooses: Original
// (sealed in its Service Pack box, the lead ad), OLED, Incell and AAA. No warranty claims here: periods come per product.
export const ADS = [
  { g: 'OR', u: 'or', lid: '#F3F3F0', k: 'ORIGINAL · SERVICE PACK', h: ['The original.', 'Nothing less.'], d: 'Genuine part, sealed in the maker’s service box · best colour, brightness and touch', q: [5, 5, 5, 3] },
  { g: 'OL', u: 'ol', lid: '#F1F1EE', k: 'OLED', h: ['Deep blacks.', 'Fair price.'], d: 'OLED replacement · deep blacks, true colour · great value', q: [4, 4, 4, 4] },
  { g: 'AQ', u: 'aq', lid: '#141414', k: 'AAA · GX', h: ['Close to', 'the original.'], d: 'High-grade copy · very good colour and touch · lower price', q: [4, 3, 4, 4] },
  { g: 'IN', u: 'in', lid: '#1D7FE6', k: 'INCELL', h: ['Best value.', 'Still bright.'], d: 'LCD with built-in touch · good everyday quality · budget friendly', q: [3, 3, 4, 5] },
];
export const QL = ['Brightness', 'Colour', 'Touch', 'Value'];
// R6 §09: every quality gets the same unboxing film: 4.5s on stage + 0.6s change
const DUR = (i) => (i === 0 ? 8.4 : 5.1); // owner (28 Oct): the Original slide is longer: every manufacturer's box gets its moment

class Component extends DCLogic {
  secRef = React.createRef();
  state = { i: 0, lib: null, data: window.SE_DATA || null, seen: false };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.t = 0; this.setState({ seen: false, i: 0 }); }); // 14 Oct · H-G2: replay from the start
    this.t = 0; this.alive = true; this.hov = false; let last = performance.now();
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk }); this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true }); }, { threshold: 0.3 });
    setTimeout(() => { const S = this.secRef.current; if (S) this.io.observe(S.querySelector('.sc-pin') || S); }, 50); // 14 Oct §10: watch the held stage (the section is now several screens tall)
    const loop = (now) => { if (!this.alive) return; const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (this.vis && !document.hidden && this.ov == null) { this.t += dt; /* Urgent 4: hover no longer pauses */ if (this.t >= DUR(this.state.i)) { if (this.pinOn()) this.t = DUR(this.state.i) - 0.6; else this.next(1, true); } this.frame(); }
      this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    // 14 Oct §10 A: the section holds while it plays. Desktop: a sticky stage; the page scroll and the grade move together,
    // one deliberate gesture (≥40px after 250ms of quiet) = one grade; after the last grade (or before the first) the page
    // goes on. Scrolling up plays it backwards. A scrollbar drag or keys map the scroll position to a grade.
    this.onScroll = () => { const S = this.secRef.current; if (!S || !this.pinOn()) return; const pin = S.querySelector('.sc-pin'); if (pin) { const top = Math.min(0, window.innerHeight - pin.offsetHeight); if (this._pt !== top) { this._pt = top; pin.style.top = top + 'px'; } }
      if (this.scrolling) return; const r = S.getBoundingClientRect(), f = (this._pt || 0) - r.top, i = Math.max(0, Math.min(ADS.length - 1, Math.round(f / this.SH()))); if (i !== this.state.i && f > -10 && f < this.SH() * (ADS.length - 1) + 10) { this.t = 0.02; this.setState({ i }); } };
    this.onWheel = (e) => { if (!this.pinOn() || !e.deltaY) return; const S = this.secRef.current; if (!S) return; const r = S.getBoundingClientRect(), f = (this._pt || 0) - r.top; if (f < -2 || f > this.SH() * (ADS.length - 1) + 2) return; // only while the stage is held
      const now = performance.now(), quiet = now - (this.lastW || 0) >= 250; this.lastW = now; if (quiet) { this.gAcc = 0; this.gUsed = false; this.gRel = false; }
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1), dir = Math.sign(dy), i = this.state.i;
      if (this.gRel) return; // this gesture already released the page: let it scroll on
      if ((dir > 0 && i === ADS.length - 1 && !this.scrolling) || (dir < 0 && i === 0 && !this.scrolling)) { if (!this.gUsed) { this.gRel = true; return; } }
      e.preventDefault(); if (this.gUsed) return; if (Math.sign(this.gAcc || 0) !== dir) this.gAcc = 0; this.gAcc = (this.gAcc || 0) + dy; if (Math.abs(this.gAcc) < 40) return;
      this.gUsed = true; this.gAcc = 0; this.goGrade(i + dir); };
    window.addEventListener('scroll', this.onScroll, { passive: true }); window.addEventListener('resize', this.onScroll); window.addEventListener('wheel', this.onWheel, { passive: false }); setTimeout(this.onScroll, 100);
    window.seShow = (i, t) => { this.ov = t; this.t = t; this.setState({ i }, () => this.frame()); };
  }
  componentWillUnmount() { window.removeEventListener('scroll', this.onScroll); window.removeEventListener('resize', this.onScroll); window.removeEventListener('wheel', this.onWheel); cancelAnimationFrame(this.sraf); this.offRp && this.offRp(); window.removeEventListener('se:lang', this.onLang); this.alive = false; cancelAnimationFrame(this.raf); clearInterval(this.dIv); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); }
  componentDidUpdate() { this.frame(); }
  // R6 Part B / §09 (overrides 14 Oct §10): the Showcase is never held. It auto-plays like the ads; free scrolling;
  // clicking a segment or an arrow jumps (Urgent 4: hover no longer pauses). (The held-stage code path stays off.)
  pinOn() { return false; }
  SH() { return Math.round(window.innerHeight * 0.55); }
  /** Show grade i and move the page with it (the stage stays pinned, so the move is invisible). */
  goGrade(i) { i = Math.max(0, Math.min(ADS.length - 1, i)); if (i === this.state.i) return; this.t = 0.02; this.setState({ i }); const S = this.secRef.current; if (!S) return;
    const y0 = window.scrollY, y1 = Math.round(window.scrollY + S.getBoundingClientRect().top - (this._pt || 0) + i * this.SH()), t0 = performance.now(), dur = 600; cancelAnimationFrame(this.sraf); this.scrolling = true;
    const f = (t) => { const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; window.scrollTo(0, y0 + (y1 - y0) * e); if (k < 1) this.sraf = requestAnimationFrame(f); else this.scrolling = false; }; this.sraf = requestAnimationFrame(f); }
  next(d, auto) { const n = ADS.length, i = (this.state.i + d + n) % n; this.t = auto ? 0 : 0.02; this.setState({ i }); }
  q(k) { const R = this.secRef.current; if (!R) return null; return R.querySelector('[data-s="' + k + '"]'); }
  set(k, s) { const e = this.q(k); if (e) for (const n in s) if (e.style[n] !== s[n]) e.style[n] = s[n]; }
  frame() {
    const i = this.state.i, D = DUR(i), t = this.t;
    const out = seg(t, D - 0.5, 0.5), oe = eio(out);
    // text on graphite
    this.set('eb', { opacity: (ex(seg(t, 0, 0.3)) * (1 - oe)).toFixed(3), transform: 'translateY(' + (-oe * 24).toFixed(1) + 'px)' });
    const R = this.secRef.current; if (!R) return;
    R.querySelectorAll('[data-s="w"]').forEach((w, j) => { const k = ex(seg(t, 0.1 + j * 0.06, 0.45)); w.style.opacity = (k * (1 - oe)).toFixed(3); w.style.filter = k < 1 ? 'blur(' + ((1 - k) * 8).toFixed(1) + 'px)' : 'none'; w.style.transform = 'translateY(' + (-oe * 30 - (1 - k) * 6).toFixed(1) + 'px)'; });
    R.querySelectorAll('[data-s="c"]').forEach((c, j) => { const k = seg(t, 1.0 + j * 0.25, 0.25); c.style.opacity = (ex(k) * (1 - oe)).toFixed(3); c.style.transform = 'translateY(' + (-oe * 30).toFixed(1) + 'px)'; c.classList.toggle('on', k > 0.4); });
    R.querySelectorAll('.sc-q li b').forEach((b, j) => { const k = eio(seg(t, 1.25 + j * 0.08, 0.8)); b.style.transform = 'scaleX(' + k.toFixed(4) + ')'; });
    this.set('btn', { opacity: (ex(seg(t, 1.2, 0.4)) * (1 - oe)).toFixed(3), transform: 'translateY(' + ((1 - ex(seg(t, 1.2, 0.4))) * 12 - oe * 30).toFixed(1) + 'px)' });
    // R6 §09 · the unboxing. The box slides in from the reading end, its lid lifts, the screen rises out of it and turns
    // to its 25° pose, its back stands up behind it, the price lands; at the change everything leaves the other way.
    const rtl = document.documentElement.dir === 'rtl', sx = rtl ? -1 : 1;
    const bi = ex(seg(t, 0.05, 0.6)), lid = eio(seg(t, 0.6, 0.45)), rise = eio(seg(t, 1.0, 1.1)), turn = eio(seg(t, 1.4, 0.8)), bk = eio(seg(t, 2.0, 0.8));
    const xo = -sx * 70 * oe; // leave toward the reading start
    this.set('ubox', { opacity: (cl(bi * 1.4) * (1 - oe)).toFixed(3), transform: 'translateX(' + (sx * (1 - bi) * 260 + xo).toFixed(1) + 'px)' });
    false && this.set('lid', { opacity: (1 - cl(lid * 1.3)).toFixed(3), transform: 'translateY(' + (-lid * 46).toFixed(1) + 'px) rotate(' + (-sx * lid * 14).toFixed(2) + 'deg)' });
    const idle = t > 2.6 ? Math.sin((t - 2.6) * 1.1) * 3 : 0;
    this.set('prod', { opacity: (cl(rise * 3) * (1 - oe)).toFixed(3), transform: 'translateX(' + (sx * -(1 - rise) * 150 + xo).toFixed(1) + 'px) translateY(' + ((1 - rise) * 120).toFixed(1) + 'px) scale(' + (0.62 + 0.38 * rise).toFixed(4) + ') rotateY(' + (sx * ((1 - turn) * -55 + idle)).toFixed(2) + 'deg)' });
    this.set('uback', { opacity: (bk * 0.95 * (1 - oe)).toFixed(3), transform: 'translateX(' + (sx * -(1 - bk) * 90 + xo).toFixed(1) + 'px) scale(' + (0.9 + 0.1 * bk).toFixed(4) + ')' });
    const sh = t > 2.2 ? ((t - 2.2) % 3) / 0.9 : -1; this.set('sheen', { transform: 'translateX(' + (sh >= 0 && sh <= 1 ? -120 + 260 * eio(sh) : -120) + '%)' });
    // the 'from' price lands
    const pk = seg(t, 2.9, 0.25); this.set('badge', { opacity: (pk > 0 ? 1 - oe : 0).toFixed(3), transform: 'scale(' + (pk < 1 ? 1.6 - 0.6 * ex(pk) : 1).toFixed(3) + ') rotate(-6deg)' });
    // story-style progress
    R.querySelectorAll('[data-s="bar"]').forEach((b, j) => { b.style.transform = 'scaleX(' + (j < i ? 1 : j > i ? 0 : cl(t / D)).toFixed(4) + ')'; });
  }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib, a = ADS[s.i];
    const price = (g) => { if (!D) return null; const ps = D.products.filter((p) => p.category === 'SCR' && p.grade === g); return ps.length ? Math.min(...ps.map((p) => p.retail_price)) : null; };
    const pr = price(a.g);
    const L = window.seI18n; return { isAr: !!(L && L.lang() === 'ar'), tr: (x) => (L ? L.tr(x) : x), secRef: this.secRef, i: s.i, ad: a, ads: ADS.map((x, j) => ({ k: x.k, on: j === s.i, go: () => { if (this.pinOn()) this.goGrade(j); else { this.t = 0.02; this.setState({ i: j }); } } })), spacer: this.pinOn() ? (ADS.length - 1) * 55 + 'vh' : '0px', qual: QL.map((l, j) => ({ l, v: a.q[j], w: (a.q[j] / 5) * 100 + '%', d: j * 0.08 + 's' })), pose: window.SE_SHOTS ? window.SE_SHOTS.url(({ OR: 'line-or', OL: 'apple-temp', AQ: 'apple-gx', IN: 'apple-zy' })[a.g] || 'apple-sp', 960) : '', poseWide: a.g === 'OR', u: ((q, base) => ({ box: base + q + '-box-480.webp', box2: base + q + '-box-960.webp', front: base + q + '-front-480.webp', front2: base + q + '-front-960.webp', back: base + q + '-back-480.webp', back2: base + q + '-back-960.webp', lid: a.lid }))(a.u, '/assets/shots/sc-'), price: pr ? 'AED ' + pr : '', hasPrice: !!pr,
      enter: () => { this.hov = true; }, leave: () => { this.hov = false; }, prev: () => (this.pinOn() ? this.goGrade(this.state.i - 1) : this.next(-1)), next: () => (this.pinOn() ? this.goGrade(this.state.i + 1) : this.next(1)),
      ts: (e) => { this._tx = e.touches[0].clientX; }, te: (e) => { if (this._tx == null) return; const dx = e.changedTouches[0].clientX - this._tx; this._tx = null; if (Math.abs(dx) > 40) this.next(dx < 0 ? 1 : -1); },
      shop: (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('se:fmp', { detail: { c: 'SCR' } })); } };
  }
}

export default Component;
