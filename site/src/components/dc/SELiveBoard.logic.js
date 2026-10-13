// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Live Board.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';

class Component extends DCLogic {
  state = { data: window.SE_DATA || null, i: 0, filt: 'all', counts: { arr: 5, low: 4, drop: 3, ship: 6 }, flash: {}, spark: { arr: [2, 3, 3, 4, 5], low: [4, 4, 3, 4, 4], drop: [1, 2, 2, 3, 3], ship: [2, 3, 4, 5, 6] }, pulses: [], tr: 0, traces: [], now: Date.now() };
  secRef = React.createRef(); gridRef = React.createRef();
  GN = { OR: 'Original', SP: 'Service Pack', OL: 'OLED', IN: 'Incell', HQ: 'High Copy' };
  MAP = { arrival: 'arr', restock: 'arr', low: 'low', drop: 'drop', shipped: 'ship' };
  componentDidMount() {
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 60);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting) this.measure(); }, { threshold: 0.2 }); setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.ro = new ResizeObserver(() => this.measure()); setTimeout(() => this.gridRef.current && this.ro.observe(this.gridRef.current), 60);
    this.iv = setInterval(() => this.tick(), 3500); this.tv = setInterval(() => { if (this.vis && !document.hidden) this.setState((s) => ({ tr: s.tr + 1, now: Date.now() })); }, 3000);
  }
  componentWillUnmount() { [this.iv, this.tv, this.dIv].forEach(clearInterval); this.io && this.io.disconnect(); this.ro && this.ro.disconnect(); }
  measure() {
    const g = this.gridRef.current; if (!g) return; const gr = g.getBoundingClientRect(), bd = g.querySelector('[data-board]'); if (!bd) return; const br = bd.getBoundingClientRect();
    if (gr.width < 900) return this.setState({ traces: [] });
    const traces = ['arr', 'low', 'drop', 'ship'].map((id, k) => { const t = g.querySelector('[data-tile="' + id + '"]'); if (!t) return null; const r = t.getBoundingClientRect(); const x0 = r.right - gr.left + 2, y0 = r.top - gr.top + r.height * (k < 2 ? 0.3 : 0.7), x1 = br.left - gr.left - 2, y1 = br.top - gr.top + 80 + k * 70;
      const mx = x0 + 24 + (k % 2 ? 0 : 20) + k * 6, dy = y1 - y0, sx = Math.min(Math.abs(dy), (x1 - mx - 20) * 0.6), sg = Math.sign(dy);
      const d = 'M' + x0 + ' ' + y0 + ' H' + mx + ' L' + (mx + sx) + ' ' + (y0 + sg * sx) + ' V' + y1 + ' H' + x1;
      return { id, d, rev: 'M' + x1 + ' ' + y1 + ' H' + (mx + sx) + ' V' + (y0 + sg * sx) + ' L' + mx + ' ' + y0 + ' H' + x0, x0, y0, x1, y1 }; }).filter(Boolean);
    this.setState({ traces });
  }
  events() { const D = this.state.data; if (!D) return []; if (this._eD === D) return this._ev; this._eD = D; const P = D.products, by = (id) => P.find((p) => p.id === id);
    this._ev = D.events.map((e) => { const p = e.pid && by(e.pid); const name = p ? p.title.replace(' Screen', ' screen').replace(' Battery', ' battery') + ' · ' + (this.GN[p.grade] || '') : ''; return { type: e.type, text: e.type === 'shipped' ? e.city + ', ' + e.country : name, note: e.type === 'low' && p ? 'only ' + p.stock_qty + ' left' : e.type === 'shipped' ? e.note : e.type === 'drop' ? e.note : p ? 'AED ' + p.retail_price : '' }; }).filter((e) => e.text);
    return this._ev; }
  tick() {
    if (!this.vis || document.hidden) return; const E = this.events(); if (!E.length) return;
    const i = this.state.i + 1, e = E[i % E.length], k = this.MAP[e.type], tr = this.state.traces.find((t) => t.id === k);
    const pid = Date.now(); this.setState((s) => ({ i, pulses: tr ? [{ id: pid, d: tr.rev }] : [] }));
    setTimeout(() => this.setState((s) => ({ counts: { ...s.counts, [k]: s.counts[k] + 1 }, flash: { ...s.flash, [k]: (s.flash[k] || 0) + 1 }, spark: { ...s.spark, [k]: [...s.spark[k], s.spark[k][s.spark[k].length - 1] + 1].slice(-12) }, pulses: [] })), tr ? 700 : 0);
  }
  renderVals() {
    const s = this.state, E = this.events(), pad = (n) => String(n).padStart(2, '0');
    const TAG = { arrival: ['JUST LANDED', '#F7C032', '#1A1B1D'], restock: ['BACK IN STOCK', 'rgba(255,255,255,.12)', '#F2F3F4'], low: ['LOW STOCK', 'rgba(229,72,77,.18)', '#FF8A8E'], drop: ['PRICE DROP', 'rgba(247,192,50,.16)', '#FFDB6E'], shipped: ['SHIPPED', 'rgba(43,182,115,.16)', '#5FD49A'] };
    const g = new Date(s.now), gst = new Date(g.getTime() + g.getTimezoneOffset() * 6e4 + 4 * 36e5), base = gst.getHours() * 60 + gst.getMinutes();
    const list = []; for (let j = 0; j < 7 && E.length; j++) { const idx = ((s.i - j) % E.length + E.length) % E.length, e = E[idx]; if (s.filt !== 'all' && this.MAP[e.type] !== s.filt) continue; list.push({ e, j }); }
    const rows = list.slice(0, 7).map(({ e, j }, r) => { const tg = TAG[e.type], m = base - j * 3; const top = r === 0; return { key: s.i - j, first: top ? '1' : '0', t: pad(Math.floor(((m % 1440) + 1440) % 1440 / 60)) + ':' + pad(((m % 60) + 60) % 60), tag: tg[0], tagBg: tg[1], tagInk: tg[2], text: e.text, note: e.note, noteC: e.type === 'low' ? '#FF8A8E' : e.type === 'drop' ? '#F7C032' : '#C9CBCE', o: (1 - r * 0.09).toFixed(2), anim: top ? ((s.i % 2) ? 'lbRow .3s cubic-bezier(.2,.8,.2,1) both, lbNew 1.2s .3s both' : 'lbRow2 .3s cubic-bezier(.2,.8,.2,1) both, lbNew2 1.2s .3s both') : 'none', type: top ? ((s.i % 2) ? 'lbType' : 'lbType2') + ' .6s .2s steps(24) both' : 'none' }; });
    const T = [['arr', 'JUST LANDED', '#F7C032', 'iBox'], ['low', 'LOW STOCK', '#FF8A8E', 'iBat'], ['drop', 'PRICE DROPS', '#FFDB6E', 'iTag'], ['ship', 'SHIPPED TODAY', '#5FD49A', 'iTruck']];
    const sp = (a) => { const mx = Math.max(...a), mn = Math.min(...a), n = a.length - 1; return a.map((v, i) => (i ? 'L' : 'M') + (i / n * 200).toFixed(1) + ' ' + (24 - (v - mn) / Math.max(1, mx - mn) * 20).toFixed(1)).join(' '); };
    const tiles = T.map(([id, k, c, ic]) => { const on = s.filt === id, f = s.flash[id] || 0; return { id, k, c, v: s.counts[id], [ic]: true, spark: sp(s.spark[id]), bg: on ? 'linear-gradient(180deg,rgba(247,192,50,.16),rgba(247,192,50,.05))' : 'rgba(255,255,255,.05)', flash: f ? (f % 2 ? 'lbFlashA' : 'lbFlashB') + ' .4s cubic-bezier(.2,.8,.2,1) both' : (on ? 'none' : 'none'), roll: f ? (f % 2 ? 'lbRollA' : 'lbRollB') + ' .35s cubic-bezier(.2,.8,.2,1) both' : 'none', pick: () => this.setState({ filt: on ? 'all' : id }) }; });
    const TR = [['iPhone 13 screen', 24], ['A54 battery', 18], ['Redmi Note 13 LCD', 15], ['Pixel 8 Pro camera', 12], ['iPhone 15 Pro OLED', 21], ['S24 Ultra back glass', 9], ['Tecno Camon 30 LCD', 11]];
    const trend = [0, 1, 2].map((j) => { const [t, n] = TR[(s.tr + j) % TR.length]; return { t, n: (n + (s.tr % 3)) + ' searches', anim: j === 2 ? ((s.tr % 2) ? 'lbChipIn' : 'lbChipIn2') + ' .45s cubic-bezier(.2,.8,.2,1) both' : 'none', key: s.tr + j }; });
    return { secRef: this.secRef, gridRef: this.gridRef, rows, tiles, trend, traces: s.traces, pulses: s.pulses, clock: pad(gst.getHours()) + ':' + pad(gst.getMinutes()), total: Object.values(s.counts).reduce((a, b) => a + b, 0),
      filterLbl: s.filt === 'all' ? 'Showing everything · tap a counter to filter' : 'Filtered · tap the counter again to clear',
      goDeals: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'deals' } })); } };
  }
}

export default Component;
