// @ts-nocheck
/* eslint-disable */
// Deals & arrivals (Issue 7, rebuilt 13 Oct 2026). Left: the Deal of the Day spotlight (split-flap clock, the price drop,
// the stock bar). Right: filter tabs and the carousel (drag, arrows, auto-drift). Below: the incoming shipment (bar,
// plane and countdown always agree) and the graphite pre-orders card. All prices and stock are the sample feed.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

const GN = { OR: 'Original', SP: 'Service Pack', OL: 'OLED', IN: 'Incell', HQ: 'High Copy' };
const LK = { SCR: 0, FRM: 1, FLX: 2, BAT: 4, CAM: 5, SML: 6, BCV: 7 };
const TABS = [['all', 'All'], ['SCR', 'Screens'], ['BAT', 'Batteries'], ['BCV', 'Back covers'], ['CAM', 'Cameras']];
export const STAGES = ['Packed', 'Departed Shenzhen', 'In flight', 'Customs Dubai', 'Arrived Deira'];
const TRANSIT = 7 * 86400e3; // the sample shipment's door-to-door time

class Component extends DCLogic {
  state = { data: window.SE_DATA || null, now: Date.now(), seen: false, seenAt: 0, tab: 'all', lib: null, left: 32, waiting: 126 };
  secRef = React.createRef(); trackRef = React.createRef();
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.setState({ seen: false }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk }); this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true, seenAt: Date.now() }); }, { threshold: 0.2 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.iv = setInterval(() => { if (this.vis && !document.hidden) this.setState({ now: Date.now() }); }, 1000);
    // every 20–30s the spotlight stock drops by one; the pre-order queue ticks up now and then
    const drop = () => { this.dT = setTimeout(() => { if (this.vis && this.state.left > 6) this.setState((s) => ({ left: s.left - 1 })); drop(); }, 20000 + Math.random() * 10000); }; drop();
    this.wIv = setInterval(() => { if (this.vis && Math.random() < 0.5) this.setState((s) => ({ waiting: s.waiting + 1 })); }, 9000);
    // the carousel drifts slowly left, one whole card at a time (so the first and last visible cards are always readable)
    this.drift = setInterval(() => { const el = this.trackRef.current; if (!el || !this.vis || this.hold || this.drag || document.hidden) return; const c = el.querySelector('.dl-card'); if (!c) return; const step = c.getBoundingClientRect().width + 16, max = el.scrollWidth - el.clientWidth; if (max < 4) return; el.scrollTo({ left: el.scrollLeft >= max - 4 ? 0 : el.scrollLeft + step, behavior: 'smooth' }); }, 4500);
  }
  componentWillUnmount() { this.offRp && this.offRp(); clearInterval(this.dIv); clearInterval(this.iv); clearInterval(this.wIv); clearTimeout(this.dT); clearInterval(this.drift); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); }
  pool() {
    const D = this.state.data; if (!D) return []; if (this._pD === D) return this._pool; this._pD = D;
    const extra = D.products.filter((p) => p.model_id && p.stock_qty > 0 && LK[p.category] != null && !D.deals.some((d) => d.product_id === p.id) && (p.badges.includes('Best seller') || p.badges.includes('New arrival'))).slice(0, Math.max(0, 14 - D.deals.length))
      .map((p, i) => ({ id: 'x' + i, product_id: p.id, discount: [8, 14, 22, 10, 16, 12, 18, 9][i % 8], ends: Date.now() + (6 + i * 7.3) * 36e5 }));
    this._pool = [...D.deals, ...extra].map((d) => ({ ...d, p: D.products.find((x) => x.id === d.product_id) })).filter((d) => d.p && LK[d.p.category] != null);
    return this._pool; }
  /** Fly-to-cart, the same moment as the hero iPad: tap ripple → arc to the nav cart → bounce → badge → toast. */
  fly(ev, img, id) {
    const cart = document.querySelector('[data-navcart]'); const go = () => window.dispatchEvent(new CustomEvent('se:cart', { detail: { id } }));
    if (!cart || !img) return go();
    const b = cart.getBoundingClientRect(), r = img.getBoundingClientRect(), x0 = r.left + r.width / 2, y0 = r.top + r.height / 2, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    const rip = document.createElement('div'); rip.style.cssText = 'position:fixed;left:' + ev.clientX + 'px;top:' + ev.clientY + 'px;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(247,192,50,.35);z-index:130;pointer-events:none'; document.body.appendChild(rip);
    rip.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => rip.remove();
    const cp = img.cloneNode(true); cp.style.cssText = 'position:fixed;left:0;top:0;width:' + r.width + 'px;height:' + r.height + 'px;object-fit:contain;z-index:130;pointer-events:none'; document.body.appendChild(cp);
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 120, K = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16, e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * mx + e * e * x1, y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * my + e * e * y1; K.push({ transform: 'translate(' + (x - r.width / 2) + 'px,' + (y - r.height / 2) + 'px) scale(' + (1 - 0.82 * e).toFixed(3) + ')', opacity: t > 0.94 ? 0 : 1 }); }
    cp.animate(K, { duration: 650, easing: 'linear', fill: 'both' }).onfinish = () => { cp.remove(); cart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)', offset: 0.4 }, { transform: 'scale(.95)', offset: 0.75 }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); go(); };
  }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib, pad = (n) => String(n).padStart(2, '0'), fmt = (n) => Math.round(n).toLocaleString('en-US');
    const img = (p) => (lib && lib.large && LK[p.category] != null ? lib.large[LK[p.category]] : '');
    const pool = this.pool(), since = s.seen ? (s.now - s.seenAt) / 1000 : 0;
    const hms = (ms) => { const x = Math.max(0, Math.floor(ms / 1000)); return [Math.floor(x / 3600), Math.floor((x % 3600) / 60), x % 60]; };
    // the flip clock lands digit by digit: each tile shows a few other digits before its real one (entrance)
    const flipDigits = (vals, base) => vals.map(pad).join('').split('').map((d, k) => { const land = base + k * 0.12; if (!s.seen || since < land) { const r = (Math.floor(since * 6) + k * 3) % 10; return { d: s.seen ? String(r) : d, k: 'r' + r + k }; } return { d, k: 'v' + d + k }; });
    // ---- spotlight: the deal with the biggest discount
    const sp = pool.length ? pool.reduce((a, b) => (b.discount > a.discount ? b : a)) : null;
    let spot = null;
    if (sp) { const p = sp.p, now = Math.round(p.retail_price * (1 - sp.discount / 100)), [h, m, sec] = hms(sp.ends - s.now);
      spot = { title: p.title, grade: GN[p.grade], img: img(p), old: 'AED ' + fmt(p.retail_price), price: String(now).split('').map((d, i) => ({ d, i, dl: (1.25 + i * 0.08).toFixed(2) + 's' })), pct: '−' + sp.discount + '%', clock: flipDigits([Math.min(99, h), m, sec], 0.3),
        left: s.left, of: 50, stock: s.left + ' of 50 left', bar: (s.left / 50).toFixed(3), add: (ev) => this.fly(ev, ev.currentTarget.closest('[data-deal]')?.querySelector('img'), p.id) }; }
    // ---- carousel
    const cards = pool.filter((d) => d !== sp && (s.tab === 'all' || d.p.category === s.tab)).map((d, i) => { const p = d.p, [h, m, sec] = hms(d.ends - s.now);
      return { key: d.id + s.tab, title: p.title, grade: GN[p.grade], img: img(p), price: 'AED ' + fmt(p.retail_price * (1 - d.discount / 100)), old: 'AED ' + fmt(p.retail_price), pct: '−' + d.discount + '%', ends: (h >= 24 ? Math.floor(h / 24) + 'd ' + pad(h % 24) : pad(h)) + ':' + pad(m) + ':' + pad(sec), stock: p.stock_qty >= 4 ? 'In stock' : p.stock_qty ? 'Only ' + p.stock_qty + ' left' : 'Restocking', low: p.stock_qty < 4, dl: (0.6 + i * 0.07).toFixed(2) + 's',
        add: (ev) => this.fly(ev, ev.currentTarget.closest('[data-deal]')?.querySelector('img'), p.id) }; });
    const tabs = TABS.map(([id, t]) => ({ id, t, on: s.tab === id, pick: () => { if (this.trackRef.current) this.trackRef.current.scrollLeft = 0; this.setState({ tab: id }); } }));
    // ---- the incoming shipment: one progress value drives the bar, the plane and the stage; the countdown is the time left
    const sh = D && D.shipments[0], rem = sh ? Math.max(0, sh.lands - s.now) : 0, prog = sh ? Math.min(1, Math.max(0, 1 - rem / TRANSIT)) : 0;
    const stage = prog >= 1 ? 4 : prog >= 0.85 ? 3 : prog >= 0.2 ? 2 : prog >= 0.08 ? 1 : 0, [dh, dm, ds] = hms(rem);
    const ship = sh ? { id: sh.id, label: sh.label, pct: Math.round(prog * 100) + '%', prog, clock: [[Math.floor(dh / 24), 'DAYS'], [dh % 24, 'HRS'], [dm, 'MIN']].map(([v, u]) => ({ v: pad(v), u })), stages: STAGES.map((t, i) => ({ t, on: i <= stage, cur: i === stage })),
      notify: () => window.dispatchEvent(new CustomEvent('se:flash', { detail: { t: 'We’ll message you when ' + sh.id + ' lands (sample).' } })) } : null;
    const pre = D ? D.preorders.map((p, i) => ({ ...p, k: i, reserve: () => window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Pre-orders', text: 'Reserving a pre-order opens with the shop. Ask us on WhatsApp in the meantime.' } })) })) : [];
    return { secRef: this.secRef, trackRef: this.trackRef, seen: s.seen, spot, cards, tabs, ship, pre, waiting: s.waiting, live: pool.length,
      hold: () => { this.hold = true; }, free: () => { this.hold = false; },
      down: (e) => { const el = this.trackRef.current; if (!el || e.pointerType !== 'mouse' || e.target.closest('button')) return; this.drag = { x: e.clientX, l: el.scrollLeft }; el.style.scrollSnapType = 'none'; el.style.scrollBehavior = 'auto'; },
      move: (e) => { const el = this.trackRef.current, d = this.drag; if (!el || !d) return; el.scrollLeft = d.l - (e.clientX - d.x); },
      up: () => { const el = this.trackRef.current; this.drag = null; if (el) { el.style.scrollSnapType = ''; el.style.scrollBehavior = ''; } },
      all: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Every deal', text: 'The full Deals & arrivals page is coming soon. Every live deal is in the carousel in the meantime.' } })); } };
  }
}

export default Component;
