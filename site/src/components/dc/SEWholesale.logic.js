// @ts-nocheck
/* eslint-disable */
// Wholesale, "The Trade Floor" (Issue 8, rebuilt 13 Oct 2026). Styles in src/styles/wholesale.css.
// Entrance (CSS, started when the section is seen): tape unrolls → title + TRADE ONLY stamp → numbers count up → the
// pallet slides in and the first cartons drop. The Pallet Builder: pick a part, drag the quantity; cartons drop onto
// the pallet, the tier ladder steps the unit price down, "You keep" rolls up; at 500 the pallet is shrink-wrapped and labelled.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

const LK = { SCR: 0, FRM: 1, FLX: 2, BAT: 4, CAM: 5, SML: 6, BCV: 7 };
const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
const PARTS = ['SE-IP13-SCR-IN', 'SE-A54-BAT-OR', 'SE-RN13-SCR-OR', 'SE-IP15-BCV-HQ'];
// sample trade tiers: share of the retail price paid per unit
export const TIERS = [{ min: 10, f: 0.88 }, { min: 50, f: 0.82 }, { min: 100, f: 0.78 }, { min: 500, f: 0.72 }];
export const MAXC = 18; // 3 columns × 2 rows deep × 3 layers
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const tierOf = (q) => TIERS.reduce((a, t, i) => (q >= t.min ? i : a), 0);
export const cartonsFor = (q) => (q >= 500 ? MAXC : Math.max(1, Math.min(MAXC - 1, Math.ceil((q / 500) * MAXC))));

class Component extends DCLogic {
  secRef = React.createRef();
  keepRef = React.createRef();
  state = { part: PARTS[0], qty: 50, from: 0, seen: false, lib: null, data: window.SE_DATA || null, flash: 0 };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.setState({ seen: false, from: 0 }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk });
    this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.seen) { this.setState({ seen: true }); this.countUp(); } }, { threshold: 0.18 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    this.shown = this.keep();
    window.seWhs = (q, part) => this.setState({ seen: true, qty: q, part: part || this.state.part, from: MAXC }, () => this.paintKeep(this.keep()));
  }
  componentWillUnmount() { this.offRp && this.offRp(); clearInterval(this.dIv); this.io && this.io.disconnect(); cancelAnimationFrame(this.kRaf); cancelAnimationFrame(this.nRaf); window.removeEventListener('se:parts-lib', this.onLib); window.removeEventListener('se:lang', this.onLang); }
  prod() { const D = this.state.data; return D ? D.products.find((p) => p.id === this.state.part) : null; }
  keep(q = this.state.qty, p = this.prod()) { return p ? (p.retail_price - Math.round(p.retail_price * TIERS[tierOf(q)].f)) * q : 0; }
  paintKeep(v) { this.shown = v; const e = this.keepRef.current; if (e) e.textContent = 'AED ' + fmt(v); }
  rollKeep(to) { cancelAnimationFrame(this.kRaf); const a = this.shown || 0, t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / 520), e = 1 - Math.pow(1 - k, 3); this.paintKeep(a + (to - a) * e); if (k < 1) this.kRaf = requestAnimationFrame(step); }; this.kRaf = requestAnimationFrame(step); }
  // the numbers band counts up once (0.8–1.8s after the section is seen)
  countUp() { const R = this.secRef.current; if (!R) return; const els = [...R.querySelectorAll('[data-n]')], t0 = performance.now() + 800;
    const step = (now) => { const k = Math.max(0, Math.min(1, (now - t0) / 1000)), e = 1 - Math.pow(1 - k, 3);
      els.forEach((el) => { const to = +el.dataset.n, from = +(el.dataset.from || 0), v = Math.round(from + (to - from) * e); if (el.textContent !== String(v)) el.textContent = String(v); });
      if (k < 1) this.nRaf = requestAnimationFrame(step); }; this.nRaf = requestAnimationFrame(step); }
  setQty(q) { const s = this.state; if (q === s.qty) return; const was = tierOf(s.qty), now = tierOf(q), p = this.prod();
    this.setState({ qty: q, from: cartonsFor(s.qty), flash: now !== was ? s.flash + 1 : s.flash }); this.rollKeep(this.keep(q, p)); }
  pick(id) { const D = this.state.data, p = D && D.products.find((x) => x.id === id); this.setState({ part: id, from: MAXC }); if (p) this.rollKeep(this.keep(this.state.qty, p)); }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib, p = this.prod(), q = s.qty, ti = tierOf(q), full = q >= 500;
    const img = (x) => (x && x.shot && window.SE_SHOTS ? window.SE_SHOTS.url(x.shot, 480) /* R6 E7: screens = box + LCD */ : x && lib && lib.large && LK[x.category] != null ? lib.large[LK[x.category]] : '');
    const unit = p ? Math.round(p.retail_price * TIERS[ti].f) : 0, n = cartonsFor(q);
    const ss = (D && D.serviceStats) || { countries: 24, tradeMin: 10 };
    const cartons = Array.from({ length: n }, (_, i) => { const layer = Math.floor(i / 6), r = i % 6, back = r >= 3, col = r % 3; // each layer: the front row first, then the row behind
      const fresh = i >= s.from; return { key: i, layer, back, col, z: (back ? 0 : 100) + layer * 10 + col, drop: fresh, dl: (s.from === 0 ? 1.7 + i * 0.28 : (i - s.from) * 0.09).toFixed(2) + 's', code: 'SE-' + (2611 + i * 7) }; });
    const wa = D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I have a bulk list for a trade quote.') : '#';
    const soon = (title, text) => (ev) => { ev && ev.preventDefault && ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:soon', { detail: { title, text } })); };
    return {
      secRef: this.secRef, keepRef: this.keepRef, seen: s.seen, countries: ss.countries, tradeMin: ss.tradeMin,
      parts: PARTS.map((id) => D && D.products.find((x) => x.id === id)).filter(Boolean).map((x) => ({ id: x.id, name: x.title, grade: GN[x.grade], img: img(x), on: x.id === s.part, pick: () => this.pick(x.id) })),
      qty: q, setQty: (e) => this.setQty(Number(e.target.value)), fill: (((q - 10) / 490) * 100).toFixed(2) + '%',
      tiers: TIERS.map((t, i) => ({ k: t.min + '+', on: i === ti, past: i < ti, unit: p ? 'AED ' + fmt(p.retail_price * t.f) : '', key: i === ti ? 'f' + s.flash : 't' + i })),
      unitDigits: String(unit).split('').map((d, i) => ({ d, k: d + '-' + i + '-' + ti + '-' + s.part })),
      retail: 'AED ' + fmt(p ? p.retail_price * q : 0), trade: 'AED ' + fmt(unit * q), keepInit: 'AED ' + fmt(this.shown != null ? this.shown : this.keep()),
      cartons, n, full, partName: p ? p.title : '', grade: p ? GN[p.grade] : '',
      apply: soon('Trade accounts', 'Trade account applications open with the Wholesale page, coming soon. Message us on WhatsApp in the meantime.'),
      partner: soon('Partner programme', 'Partner programme details are coming soon. Message us on WhatsApp in the meantime.'), wa,
    };
  }
}

export default Component;
