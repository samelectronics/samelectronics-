// @ts-nocheck
/* eslint-disable */
// Deals & arrivals (Issue 7, rebuilt 13 Oct 2026). Left: the Deal of the Day spotlight (split-flap clock, the price drop,
// the stock bar). Right: filter tabs and the carousel (drag, arrows, auto-drift). Below: the incoming shipment (bar,
// plane and countdown always agree) and the graphite pre-orders card. All prices and stock are the sample feed.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
const LK = { SCR: 0, FRM: 1, FLX: 2, BAT: 4, CAM: 5, SML: 6, BCV: 7 };
const TABS = [['all', 'All'], ['SCR', 'Screens'], ['BAT', 'Batteries'], ['BCV', 'Back covers'], ['CAM', 'Cameras']];
export const STAGES = ['Packed', 'Departed Shenzhen', 'In flight', 'Customs Dubai', 'Arrived Deira'];
const TRANSIT = 7 * 86400e3; // the sample shipment's door-to-door time

class Component extends DCLogic {
  state = { data: window.SE_DATA || null, now: Date.now(), seen: false, seenAt: 0, tab: 'all', lib: null, left: 32, waiting: 126, map: null, bump: {} };
  secRef = React.createRef(); trackRef = React.createRef(); beltRef = React.createRef();
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
    // R6 §10: the rail is a belt (transform, no scrollbar) that drifts continuously and wraps seamlessly over a cloned
    // set; arrows glide one card; hover and drag hold it. Static when every card fits.
    this.bx = 0; this.glide = null; let last = performance.now();
    const tick = (now) => { if (!this.alive) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (this.vis && !document.hidden) this.belt(dt, now); this.braf = requestAnimationFrame(tick); };
    this.alive = true; this.braf = requestAnimationFrame(tick);
    // the reviewer's price-drop moment: now and then a deal drops a little more (sample feed)
    const bump = () => { this.bT = setTimeout(() => { const pool = this.pool().filter((d) => d !== this._sp); if (this.vis && pool.length) { const d = pool[Math.floor(Math.random() * pool.length)], b = this.state.bump[d.id] || { extra: 0, n: 0 }; if (d.discount + b.extra < 35) this.setState((st) => ({ bump: { ...st.bump, [d.id]: { extra: b.extra + 1 + Math.floor(Math.random() * 2), n: b.n + 1, at: Date.now(), prev: b.extra } } })); } bump(); }, 11000 + Math.random() * 7000); }; bump();
    // the real map loads when the section nears
    this.mapIO = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.map) { this.mapIO.disconnect(); fetch('/se-ship-map.json').then((r) => r.json()).then((m) => this.alive && this.setState({ map: m })).catch(() => {}); } }, { rootMargin: '600px 0px' });
    setTimeout(() => this.secRef.current && this.mapIO.observe(this.secRef.current), 60);
  }
  componentWillUnmount() { this.offRp && this.offRp(); clearInterval(this.dIv); clearInterval(this.iv); clearInterval(this.wIv); clearTimeout(this.dT); this.alive = false; cancelAnimationFrame(this.braf); clearTimeout(this.bT); this.mapIO && this.mapIO.disconnect(); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); }
  pool() {
    const D = this.state.data; if (!D) return []; if (this._pD === D) return this._pool; this._pD = D;
    const extra = D.products.filter((p) => p.model_id && p.stock_qty > 0 && LK[p.category] != null && !D.deals.some((d) => d.product_id === p.id) && (p.badges.includes('Best seller') || p.badges.includes('New arrival'))).slice(0, Math.max(0, 14 - D.deals.length))
      .map((p, i) => ({ id: 'x' + i, product_id: p.id, discount: [8, 14, 22, 10, 16, 12, 18, 9][i % 8], ends: Date.now() + (6 + i * 7.3) * 36e5 }));
    this._pool = [...D.deals, ...extra].map((d) => ({ ...d, p: D.products.find((x) => x.id === d.product_id) })).filter((d) => d.p && LK[d.p.category] != null);
    return this._pool; }
  /** The belt: x grows (drift 24px/s or an arrow glide) and wraps at one set's width; the sign follows the reading direction. */
  belt(dt, now) {
    const T = this.trackRef.current, B = this.beltRef.current; if (!T || !B) return; const c = B.querySelector('.dl-card'); if (!c) return;
    const step = c.getBoundingClientRect().width + 16, n = this._n || 0, setW = n * step;
    if (!this._loop || setW <= 0) { if (B.style.transform) B.style.transform = ''; this.bx = 0; return; }
    if (this.glide) { const k = Math.min(1, (now - this.glide.t0) / 450), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; this.bx = this.glide.from + this.glide.by * e; if (k >= 1) this.glide = null; }
    else if (!this.hold && !this.drag) this.bx += 24 * dt;
    this.bx = ((this.bx % setW) + setW) % setW;
    const rtl = document.documentElement.dir === 'rtl', tx = (rtl ? 1 : -1) * this.bx;
    B.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,0,0)';
  }
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
  step() { const c = this.beltRef.current && this.beltRef.current.querySelector('.dl-card'); return c ? c.getBoundingClientRect().width + 16 : 300; }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib, pad = (n) => String(n).padStart(2, '0'), fmt = (n) => Math.round(n).toLocaleString('en-US');
    const img = (p) => (window.SE_SHOTS ? window.SE_SHOTS.url(p.shot || window.SE_SHOTS.forCat(p.category), 480) /* owner (27 Oct): every part is its standard pose */ : lib && lib.large && LK[p.category] != null ? lib.large[LK[p.category]] : '');
    const pool = this.pool(), since = s.seen ? (s.now - s.seenAt) / 1000 : 0;
    const hms = (ms) => { const x = Math.max(0, Math.floor(ms / 1000)); return [Math.floor(x / 3600), Math.floor((x % 3600) / 60), x % 60]; };
    // the flip clock lands digit by digit: each tile shows a few other digits before its real one (entrance)
    const flipDigits = (vals, base) => vals.map(pad).join('').split('').map((d, k) => { const land = base + k * 0.12; if (!s.seen || since < land) { const r = (Math.floor(since * 6) + k * 3) % 10; return { d: s.seen ? String(r) : d, k: 'r' + r + k }; } return { d, k: 'v' + d + k }; });
    // ---- spotlight: the deal with the biggest discount
    const sp = pool.length ? pool.reduce((a, b) => (b.discount > a.discount ? b : a)) : null; this._sp = sp;
    let spot = null;
    if (sp) { const p = sp.p, now = Math.round(p.retail_price * (1 - sp.discount / 100)), [h, m, sec] = hms(sp.ends - s.now);
      spot = { title: p.title, grade: GN[p.grade], img: img(p), old: 'AED ' + fmt(p.retail_price), price: String(now).split('').map((d, i) => ({ d, i, dl: (1.25 + i * 0.08).toFixed(2) + 's' })), pct: '−' + sp.discount + '%', clock: flipDigits([Math.min(99, h), m, sec], 0.3),
        left: s.left, of: 50, stock: s.left + ' of 50 left', bar: (s.left / 50).toFixed(3), add: (ev) => this.fly(ev, ev.currentTarget.closest('[data-deal]')?.querySelector('img'), p.id) }; }
    // ---- carousel
    const cards = pool.filter((d) => d !== sp && (s.tab === 'all' || d.p.category === s.tab)).map((d, i) => { const p = d.p, [h, m, sec] = hms(d.ends - s.now), b = s.bump[d.id], off = d.discount + (b ? b.extra : 0), dropping = !!(b && s.now - b.at < 2600);
      return { key: d.id + s.tab, title: p.title, grade: GN[p.grade], img: img(p), price: 'AED ' + fmt(p.retail_price * (1 - off / 100)), old: 'AED ' + fmt(p.retail_price), was: dropping ? 'AED ' + fmt(p.retail_price * (1 - (d.discount + b.prev) / 100)) : '', dropping, pct: '−' + off + '%', ends: (h >= 24 ? Math.floor(h / 24) + 'd ' + pad(h % 24) : pad(h)) + ':' + pad(m) + ':' + pad(sec), stock: p.stock_qty >= 4 ? 'In stock' : p.stock_qty ? 'Only ' + p.stock_qty + ' left' : 'Restocking', low: p.stock_qty < 4, dl: (0.6 + i * 0.07).toFixed(2) + 's',
        add: (ev) => this.fly(ev, ev.currentTarget.closest('[data-deal]')?.querySelector('img'), p.id) }; });
    const loop = cards.length > 3; this._n = cards.length; this._loop = loop;
    const belt = loop ? cards.concat(cards.map((c) => ({ ...c, key: c.key + '~', clone: true, dl: '0s' }))) : cards;
    const tabs = TABS.map(([id, t]) => ({ id, t, on: s.tab === id, pick: () => { this.bx = 0; this.glide = null; this.setState({ tab: id }); } }));
    // ---- the incoming shipment: one progress value drives the bar, the plane and the stage; the countdown is the time left
    const sh = D && D.shipments[0], rem = sh ? Math.max(0, sh.lands - s.now) : 0, prog = sh ? Math.min(1, Math.max(0, 1 - rem / TRANSIT)) : 0;
    const stage = prog >= 1 ? 4 : prog >= 0.85 ? 3 : prog >= 0.2 ? 2 : prog >= 0.08 ? 1 : 0, [dh, dm, ds] = hms(rem);
    const L = window.seI18n, ar = !!(L && L.lang() === 'ar'), eta = sh ? new Date(sh.lands).toLocaleString(ar ? 'ar-AE' : 'en-GB', { timeZone: 'Asia/Dubai', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' GST' : '';
    const ship = sh ? { id: sh.id, label: sh.label, eta, pct: Math.round(prog * 100) + '%', prog, clock: [[Math.floor(dh / 24), 'DAYS'], [dh % 24, 'HRS'], [dm, 'MIN']].map(([v, u]) => ({ v: pad(v), u })), stages: STAGES.map((t, i) => ({ t, on: i <= stage, cur: i === stage })),
      notify: () => window.dispatchEvent(new CustomEvent('se:flash', { detail: { t: 'We’ll message you when ' + sh.id + ' lands.' } })) } : null;
    const pre = D ? D.preorders.map((p, i) => ({ ...p, k: i, reserve: () => window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Pre-orders', text: 'Reserving a pre-order opens with the shop. Ask us on WhatsApp in the meantime.' } })) })) : [];
    return { secRef: this.secRef, trackRef: this.trackRef, beltRef: this.beltRef, seen: s.seen, spot, cards, belt, loop, tabs, ship, pre, waiting: s.waiting, live: pool.filter((d) => d.ends > s.now).length, map: s.map,
      prev: () => { this.glide = { t0: performance.now(), from: this.bx, by: -this.step() }; }, next: () => { this.glide = { t0: performance.now(), from: this.bx, by: this.step() }; },
      hold: () => { this.hold = true; }, free: () => { this.hold = false; },
      down: (e) => { if (e.pointerType !== 'mouse' || e.target.closest('button') || !this._loop) return; this.drag = { x: e.clientX, b: this.bx }; this.glide = null; },
      move: (e) => { const d = this.drag; if (!d) return; const rtl = document.documentElement.dir === 'rtl'; this.bx = d.b - (rtl ? -1 : 1) * (e.clientX - d.x); this.belt(0, performance.now()); },
      up: () => { this.drag = null; },
      all: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Every deal', text: 'The full Deals & arrivals page is coming soon. Every live deal is in the carousel in the meantime.' } })); } };
  }
}

export default Component;
