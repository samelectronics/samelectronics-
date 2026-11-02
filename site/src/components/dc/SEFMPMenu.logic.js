// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE FMP Menu.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';

class Component extends DCLogic {
  state = { open: false, b: 'apple', dev: 'phone', q: '', m: null, data: window.SE_DATA || null };
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
    const dev = devs.some((d) => d.id === s.dev) ? s.dev : (devs[0] || { id: 'phone' }).id;
    // R10 B5 (owner): quick view = brand tabs -> every model as a searchable grid (with its model code) -> every part for
    // that model with grade chips and prices. A part opens the shop already filtered to it; "See it all" opens the full
    // Find My Part. A search looks across every brand, by name, model code or a compatible name.
    const nq = (s.q || '').trim().toLowerCase().replace(/[\s-]/g, ''), hay = (m) => (m.name + (m.model_numbers || []).join('') + (m.fits || []).map((g) => g.names.join('')).join('')).toLowerCase().replace(/[\s-]/g, '');
    const ms = (nq ? Mo.filter((m) => hay(m).includes(nq)) : bm.filter((m) => m.device === dev)).sort((x, y) => (this._mq[y.id] || 0) - (this._mq[x.id] || 0));
    const DN = { phone: 'Phones', tablet: 'Tablets', watch: 'Watches' }, L = window.seI18n, T = (x) => (L ? L.t(x) : x);
    const GN = (D && D.gradeNames) || {}, Ca = (D && D.categories) || [], mObj = s.m ? Mo.find((m) => m.id === s.m) : null, fx = (n) => Math.round(n).toLocaleString('en-US');
    const shopUrl = (o) => { const u = new URLSearchParams(); Object.entries(o).forEach(([k2, v2]) => v2 && u.set(k2, v2)); return '/shop?' + u.toString(); };
    const go = (url) => { this.setState({ open: false }); location.href = url; };
    const parts = mObj ? Ca.map((c) => { const cp = P.filter((p) => p.model_id === mObj.id && p.category === c.id).sort((x, y) => y.retail_price - x.retail_price); if (!cp.length) return null; const q = cp.reduce((t2, p) => t2 + p.stock_qty, 0);
      return { id: c.id, name: T(c.name), q: q ? k(q) + ' ' + T('in stock') : T('On request'), in: !!q, open: () => go(shopUrl({ brand: mObj.brand_id, model: mObj.id, cat: c.id })),
        grades: cp.map((p) => ({ id: p.id, g: GN[p.grade] || p.grade, price: 'AED ' + fx(p.retail_price), out: !p.stock_qty, open: (ev) => { ev.stopPropagation(); go(shopUrl({ brand: mObj.brand_id, model: mObj.id, cat: c.id, grade: p.grade })); } })) }; }).filter(Boolean) : [];
    return {
      open: s.open, chevR: s.open ? 180 : 0, brandsK: T('BRANDS'),
      enter: () => { this._in = true; clearTimeout(this.t); this.t = setTimeout(() => this.setState({ open: true }), 120); },
      leave: () => { this._in = false; clearTimeout(this.t); if (this._typing) return; this.t = setTimeout(() => this.setState({ open: false, m: null }), 220); },
      openAll: () => this.fire({}),
      brands: Br.map((b) => { const on = b.id === s.b && !nq, q = this._bq[b.id] || 0; return { id: b.id, on, q: q ? k(q) + ' ' + T('in stock') : T('On request'), hover: () => this.setState({ b: b.id, m: null, q: '' }), pick: () => this.setState({ b: b.id, m: null, q: '' }) }; }),
      devs: nq ? [] : devs.map((d) => ({ id: d.id, name: T(DN[d.id]), n: d.n, on: d.id === dev, pick: () => this.setState({ dev: d.id }) })),
      q: s.q, ph: T('Search a model (e.g. iPhone 15 or S911)'), setQ: (e) => this.setState({ q: e.target.value, m: null }), focusQ: () => { this._typing = true; clearTimeout(this.t); }, blurQ: () => { this._typing = false; if (!this._in) this.t = setTimeout(() => this.setState({ open: false, m: null }), 220); }, keyQ: (e) => { if (e.key === 'Escape') { this._typing = false; this.setState({ open: false, m: null, q: '' }); } },
      none: !ms.length ? T('No model matches. Try the full Find My Part.') : '',
      cur: { name: nq ? T('Search results') : curB.name, n: nq ? ms.length + ' ' + T('models') : bm.length + ' ' + T('models') + ' · ' + (this._bq[s.b] ? k(this._bq[s.b]) + ' ' + T('parts in stock') : T('On request')), see: mObj ? T('See it all') + ' · ' + mObj.name : T('See it all') + ' · ' + curB.name, all: () => this.fire(mObj ? { b: mObj.brand_id, m: mObj.id } : { b: s.b }) },
      models: ms.map((m) => { const q = this._mq[m.id] || 0; return { id: m.id, name: m.name, code: (m.model_numbers || [])[0] || '', dev: m.device, q: q ? k(q) + ' ' + T('parts in stock') : T('On request'), in: !!q, pick: () => this.setState({ m: m.id }) }; }),
      model: mObj ? { name: mObj.name, code: (mObj.model_numbers || []).slice(0, 3).join(' · '), back: () => this.setState({ m: null }), backT: T('All models'), parts, empty: !parts.length ? T('Parts for this model are on request. Ask us on WhatsApp.') : '' } : null
    };
  }
}

export default Component;
