// @ts-nocheck
/* eslint-disable */
// Live Parts Board (Issue 3, rebuilt 13 Oct 2026 from the design's SE Live Board; maintained by hand).
// Layout: [4 counter tiles stacked] → [wiring channel, one straight lane per tile] → [the board].
// Every 2.5–4s a new event lands on the board: the row types in and glows, a pulse runs back along its lane to
// its counter, the counter flashes, rolls up and shows "+1". All data is the sample feed in public/se-data.js.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

class Component extends DCLogic {
  state = { data: window.SE_DATA || null, i: 0, filt: 'all', counts: { arr: 5, low: 4, drop: 3, ship: 6 }, flash: {}, spark: { arr: [2, 3, 3, 4, 5], low: [4, 4, 3, 4, 4], drop: [1, 2, 2, 3, 3], ship: [2, 3, 4, 5, 6] }, pulse: null, tr: 0, now: Date.now(), seen: false, lib: null, cu: 0 };
  secRef = React.createRef();
  GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
  MAP = { arrival: 'arr', restock: 'arr', low: 'low', drop: 'drop', shipped: 'ship' };
  ISO = { Nigeria: 'NG', Iraq: 'IQ', Romania: 'RO', Morocco: 'MA', Uganda: 'UG', Algeria: 'DZ', Tunisia: 'TN', Libya: 'LY', Egypt: 'EG', Sudan: 'SD', Eritrea: 'ER', Ethiopia: 'ET', 'Saudi Arabia': 'SA', Oman: 'OM', Yemen: 'YE', Syria: 'SY', Lebanon: 'LB', Iran: 'IR', 'Türkiye': 'TR', Turkey: 'TR', Azerbaijan: 'AZ', UK: 'GB', 'United Kingdom': 'GB', Spain: 'ES', Russia: 'RU', UAE: 'AE' , Russia: 'RU', Ukraine: 'UA', India: 'IN', Pakistan: 'PK', 'Burkina Faso': 'BF', Senegal: 'SN'};
  LK = { SCR: 0, FRM: 1, FLX: 2, BAT: 4, CAM: 5, SML: 6, BCV: 7 };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { cancelAnimationFrame(this.cuR); this.setState({ seen: false, cu: 0 }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 60);
    const sp = window.seParts; const pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk }); this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) { this.setState({ seen: true }); const t0 = performance.now() + 300; const f = (t) => { const k = Math.max(0, Math.min(1, (t - t0) / 900)); this.setState({ cu: 1 - Math.pow(1 - k, 3) }); if (k < 1) this.cuR = requestAnimationFrame(f); }; this.cuR = requestAnimationFrame(f); } }, { threshold: 0.25 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    const next = () => { this.tm = setTimeout(() => { this.tick(); next(); }, 2500 + Math.random() * 1500); }; next(); // a new event every 2.5–4s
    this.tv = setInterval(() => { if (this.vis && !document.hidden) this.setState((s) => ({ tr: s.tr + 1, now: Date.now() })); }, 3000);
  }
  componentWillUnmount() { this.offRp && this.offRp(); cancelAnimationFrame(this.cuR); clearTimeout(this.tm); clearTimeout(this.pT); [this.tv, this.dIv].forEach(clearInterval); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); }
  events() { const D = this.state.data; if (!D) return []; if (this._eD === D) return this._ev; this._eD = D; const P = D.products, by = (id) => P.find((p) => p.id === id);
    this._ev = D.events.map((e) => { const p = e.pid && by(e.pid); const name = p ? p.title + ' · ' + (this.GN[p.grade] || '') : '';
      return { type: e.type, p, cc: e.type === 'shipped' ? this.ISO[e.country] || (e.country || '').slice(0, 2).toUpperCase() : '', text: e.type === 'shipped' ? e.city + ', ' + e.country : name, note: e.type === 'low' && p ? 'only ' + p.stock_qty + ' left' : e.type === 'shipped' ? e.note : e.type === 'drop' ? e.note : p ? 'AED ' + p.retail_price : '' }; }).filter((e) => e.text);
    return this._ev; }
  tick() {
    if (!this.vis || document.hidden || !this.state.seen) return; const E = this.events(); if (!E.length) return;
    const i = this.state.i + 1, e = E[i % E.length], k = this.MAP[e.type];
    this.setState({ i, pulse: { k, id: i } }); // the row lands; the pulse leaves the board along lane k
    { const S = this.secRef.current, r0 = S && S.querySelector('.lb-rows'); if (S && r0) S.style.setProperty('--ry', Math.round(r0.getBoundingClientRect().top - S.getBoundingClientRect().top + 28) + 'px'); } // R6 §07: the side ping lands on the newest row
    clearTimeout(this.pT); this.pT = setTimeout(() => this.setState((s) => ({ counts: { ...s.counts, [k]: s.counts[k] + 1 }, flash: { ...s.flash, [k]: (s.flash[k] || 0) + 1 }, spark: { ...s.spark, [k]: [...s.spark[k], s.spark[k][s.spark[k].length - 1] + 1].slice(-12) } })), 900);
    window.dispatchEvent(new CustomEvent('se:surge', { detail: { el: this.secRef.current } }));
  }
  renderVals() {
    const s = this.state, E = this.events(), pad = (n) => String(n).padStart(2, '0'), lib = s.lib;
    const TAG = { arrival: ['JUST LANDED', '#F7C032', '#26282B'], restock: ['BACK IN STOCK', 'rgba(255,255,255,.12)', '#F2F3F4'], low: ['LOW STOCK', 'rgba(229,72,77,.18)', '#FF8A8E'], drop: ['PRICE DROP', 'rgba(247,192,50,.16)', '#FFDB6E'], shipped: ['SHIPPED', 'rgba(43,182,115,.16)', '#5FD49A'] };
    const g = new Date(s.now), gst = new Date(g.getTime() + g.getTimezoneOffset() * 6e4 + 4 * 36e5), base = gst.getHours() * 60 + gst.getMinutes();
    // the newest 6 matching events (the board shows the history, newest first)
    const list = []; for (let j = 0; j < 40 && E.length && list.length < 6; j++) { const idx = ((s.i - j) % E.length + E.length) % E.length, e = E[idx]; if (s.filt !== 'all' && this.MAP[e.type] !== s.filt) continue; list.push({ e, j }); }
    const rows = list.map(({ e, j }, r) => { const tg = TAG[e.type], m = base - j * 3, top = r === 0 && j === 0, li = e.p ? this.LK[e.p.category] : null, th = lib && lib.thumb && li != null ? lib.thumb[li] : '';
      return { key: (s.i - j) + s.filt, t: pad(Math.floor(((m % 1440) + 1440) % 1440 / 60)) + ':' + pad(((m % 60) + 60) % 60), tag: tg[0], tagBg: tg[1], tagInk: tg[2], text: e.text, note: e.note, noteC: e.type === 'low' ? '#FF8A8E' : e.type === 'drop' ? '#F7C032' : '#C9CBCE',
        th, hasTh: !!th, cc: e.cc, hasCc: !th && !!e.cc, isNew: top, d: (r * 0.1).toFixed(2) + 's',
        go: () => { if (e.p) { const D = s.data, mo = D && D.models.find((x) => x.id === e.p.model_id); window.dispatchEvent(new CustomEvent('se:fmp', { detail: { b: mo && mo.brand_id, m: e.p.model_id, c: e.p.category } })); } else window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'network' } })); } }; });
    const T = [['arr', 'JUST LANDED', '#F7C032', 'box'], ['low', 'LOW STOCK', '#FF8A8E', 'bat'], ['drop', 'PRICE DROPS', '#FFDB6E', 'tag'], ['ship', 'SHIPPED TODAY', '#5FD49A', 'truck']];
    const sp = (a) => { const mx = Math.max(...a), mn = Math.min(...a), n = a.length - 1, pts = a.map((v, i) => [(i / n) * 120, 30 - ((v - mn) / Math.max(1, mx - mn)) * 24]); const line = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' '); return { line, fill: line + ' L120 34 L0 34 Z', ex: pts[n][0].toFixed(1), ey: pts[n][1].toFixed(1) }; };
    const tiles = T.map(([id, k, c, ic], n) => { const on = s.filt === id, f = s.flash[id] || 0, a = s.spark[id], spk = sp(a), dl = a[a.length - 1] - a[Math.max(0, a.length - 4)];
      return { id, k, c, v: Math.round(s.counts[id] * s.cu), ic, spark: spk, grad: 'lbg' + id, delta: '+' + Math.max(1, dl) + ' in the last hour', on, f, d: (0.3 + n * 0.08).toFixed(2) + 's', pick: () => this.setState({ filt: on ? 'all' : id }) }; });
    const tabs = [['all', 'All'], ['arr', 'Landed'], ['low', 'Low'], ['drop', 'Drops'], ['ship', 'Shipped']].map(([id, t]) => ({ id, t, on: s.filt === id, pick: () => this.setState({ filt: id }) }));
    const TR = [['iPhone 13 screen', 24], ['A54 battery', 18], ['Redmi Note 13 LCD', 15], ['Pixel 8 Pro camera', 12], ['iPhone 15 Pro OLED', 21], ['S24 Ultra back glass', 9], ['Tecno Camon 30 LCD', 11], ['iPhone 11 battery', 14]];
    const trend = TR.map(([t, n], j) => ({ t, n: n + ((s.tr + j) % 4) }));
    const total = 20 + Object.values(s.counts).reduce((a, b) => a + b, 0);
    return { secRef: this.secRef, rows, tiles, tabs, trend: trend.concat(trend), seen: s.seen, pulse: s.pulse, clock: pad(gst.getHours()) + ':' + pad(gst.getMinutes()), total, filt: s.filt,
      goDeals: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'deals' } })); } };
  }
}

export default Component;
