// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE FMP Menu.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';

class Component extends DCLogic {
  state = { open: false, b: 'apple', dev: 'phone', data: window.SE_DATA || null };
  componentDidMount() { if (!this.state.data) this.iv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.iv); this.setState({ data: window.SE_DATA }); } }, 80); }
  componentWillUnmount() { clearInterval(this.iv); clearTimeout(this.t); }
  fire(d) { this.setState({ open: false }); window.dispatchEvent(new CustomEvent('se:fmp', { detail: d })); }
  renderVals() {
    const s = this.state, D = s.data, Br = D ? D.brands : [], Mo = D ? D.models : [], P = D ? D.products : [];
    if (this._D !== D) { this._D = D; const q = {}; const mb = {}; Mo.forEach((m) => (mb[m.id] = m.brand_id)); this._mq = {}; P.forEach((p) => { q[mb[p.model_id]] = (q[mb[p.model_id]] || 0) + p.stock_qty; this._mq[p.model_id] = (this._mq[p.model_id] || 0) + p.stock_qty; }); this._bq = q; }
    const k = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n || 0));
    // Hero 4 (owner): one brand per row with its own divider; the right side follows the Excel: the brand's devices
    // (phones / tablets / watches) first, then its models, in-stock first, the rest "On request" (never "0 in stock")
    const curB = Br.find((x) => x.id === s.b) || { name: '', id: s.b }, bm = Mo.filter((m) => m.brand_id === s.b), devs = ['phone', 'tablet', 'watch'].map((d) => ({ id: d, n: bm.filter((m) => m.device === d).length })).filter((d) => d.n);
    const dev = devs.some((d) => d.id === s.dev) ? s.dev : (devs[0] || { id: 'phone' }).id, ms = bm.filter((m) => m.device === dev).sort((x, y) => (this._mq[y.id] || 0) - (this._mq[x.id] || 0));
    const DN = { phone: 'Phones', tablet: 'Tablets', watch: 'Watches' }, L = window.seI18n, T = (x) => (L ? L.t(x) : x);
    return {
      open: s.open, chevR: s.open ? 180 : 0, brandsK: T('BRANDS'),
      enter: () => { clearTimeout(this.t); this.t = setTimeout(() => this.setState({ open: true }), 120); },
      leave: () => { clearTimeout(this.t); this.t = setTimeout(() => this.setState({ open: false }), 220); },
      openAll: () => this.fire({}),
      brands: Br.map((b) => { const on = b.id === s.b, q = this._bq[b.id] || 0; return { id: b.id, on, q: q ? k(q) + ' ' + T('in stock') : T('On request'), hover: () => this.setState({ b: b.id }), pick: () => this.fire({ b: b.id }) }; }),
      devs: devs.map((d) => ({ id: d.id, name: T(DN[d.id]), n: d.n, on: d.id === dev, pick: () => this.setState({ dev: d.id }) })),
      cur: { name: curB.name, n: bm.length + ' ' + T('models') + ' · ' + (this._bq[s.b] ? k(this._bq[s.b]) + ' ' + T('parts in stock') : T('On request')), see: T('See all') + ' ' + curB.name + ' ' + T('models'), all: () => this.fire({ b: s.b }) },
      models: ms.slice(0, 10).map((m) => { const q = this._mq[m.id] || 0; return { id: m.id, name: m.name, dev: m.device, q: q ? k(q) + ' ' + T('parts in stock') : T('On request'), in: !!q, pick: () => this.fire({ b: m.brand_id, m: m.id }) }; })
    };
  }
}

export default Component;
