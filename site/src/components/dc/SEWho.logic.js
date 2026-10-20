// @ts-nocheck
/* eslint-disable */
// Open to everyone, "Who are you?" (Issue 12, 13 Oct 2026). Styles in src/styles/who.css.
// Four selector tabs and one cinematic stage. Each lane's scene runs ~6s on CSS keyframes (it remounts on every
// visit, so it always starts from the top); the logic only keeps the clock: auto-cycle, pause on hover, click to jump.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

export const LANES = [
  { id: 'ret', k: 'Retail customer', d: 'One phone, the right part.', cta: 'Find my part', ben: ['Find your part by model', 'Pick the grade for your budget', 'Collect in Deira or get it delivered'] },
  { id: 'rep', k: 'Repair shop', d: 'Parts for the bench, every day.', cta: 'Open a trade account', ben: ['Same-day parts for the bench', 'Every grade side by side', 'Trade prices once approved'] },
  { id: 'exp', k: 'Trader & exporter', d: 'Bulk lists, shipped worldwide.', cta: 'Plan my shipment', ben: ['Bulk lists quoted fast', 'Packed for export', 'Shipped to four regions'] },
  { id: 'blk', k: 'Bulk buyer', d: 'Volume, first in line.', cta: 'Request a bulk quote', ben: ['Volume pricing on request', 'Incoming shipments first', 'One contact for every order'] },
];
const DUR = 6.2;

class Component extends DCLogic {
  secRef = React.createRef();
  state = { i: 0, prev: -1, n: 0, seen: false, lib: null, data: window.SE_DATA || null };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.t = 0; this.setState({ seen: false, i: 0, prev: -1 }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk });
    this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.t = 0; this.alive = true; let last = performance.now();
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true, n: 1 }); }, { threshold: 0.3 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    const loop = (now) => { if (!this.alive) return; const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (this.vis && this.state.seen && !document.hidden && !this.hov && this.hold == null) { this.t += dt; if (this.t >= DUR) this.go((this.state.i + 1) % LANES.length); }
      const bar = this.secRef.current && this.secRef.current.querySelector('.wh-tab.on .wh-pg i'); if (bar) bar.style.transform = 'scaleX(' + Math.min(1, this.t / DUR).toFixed(4) + ')';
      this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seWho = (i, t) => { this.hold = t; this.setState({ seen: true, i, prev: -1, n: this.state.n + 1 }, () => { const S = this.secRef.current && this.secRef.current.querySelector('.wh-scene.on'); if (S) S.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000; }); }); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); this.alive = false; cancelAnimationFrame(this.raf); clearInterval(this.dIv); clearTimeout(this.pT); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); window.removeEventListener('se:lang', this.onLang); }
  go(i) { this.t = 0; clearTimeout(this.pT); this.setState({ prev: this.state.i === i ? -1 : this.state.i, i, n: this.state.n + 1 }); this.pT = setTimeout(() => this.setState({ prev: -1 }), 700); }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib;
    const scr = D ? D.products.filter((p) => p.id.startsWith('SE-IP13-SCR')) : [], lo = scr.length ? Math.min(...scr.map((p) => p.retail_price)) : 0;
    const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    const go = (id) => (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent(id === 'ret' ? 'se:fmp' : 'se:go', { detail: id === 'ret' ? { c: 'SCR' } : { id: id === 'rep' ? 'wholesale' : id === 'exp' ? 'network' : 'visit' } })); };
    return { secRef: this.secRef, seen: s.seen, i: s.i, prev: s.prev, n: s.n,
      lanes: LANES.map((l, j) => ({ ...l, j, on: j === s.i, pick: () => this.go(j), act: go(l.id) })),
      enter: () => { this.hov = true; }, leave: () => { this.hov = false; },
      img: (k) => (window.SE_SHOTS && window.SE_SHOTS.byIndex(k)) || (lib && lib.large ? lib.large[k] : ''), /* Urgent 1: the pose */ front: lib && lib.front ? lib.front : null,
      grades: scr.slice().sort((a, b) => b.retail_price - a.retail_price).map((p) => ({ g: GN[p.grade], p: 'AED ' + p.retail_price, t: 'AED ' + p.wholesale_price })), from: lo ? 'from AED ' + lo : '' };
  }
}

export default Component;
