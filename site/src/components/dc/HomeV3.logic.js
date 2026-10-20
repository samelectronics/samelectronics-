// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/Sam Electronics Home v3.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import { shopStatus } from '@/lib/shopStatus';
import { jumpTo } from '@/lib/jumpScroll'; // R6 Part B: logo, nav links, hours pill: fast jumps that never get held
import { site as SITE } from '@/content/facts';
import { fallbackAnswer, emoteFor, isArabic } from '@/components/samsoom/brain';

// R6 Part E: quality names come from the Excel (window.SE_DATA.gradeNames); read lazily so it also works before data loads
const GN = new Proxy({}, { get: (_, k) => ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {})[k] });
class Component extends DCLogic {
  state = { data: window.SE_DATA || null, now: Date.now(), k: 0, z: 1, vw: 1440, vh: 900, prog: 0, tp: 0, tone: 'dark', ip: 0, ipJump: false, ipToast: false, ipCart: 2, reel: 0, reelJump: false, hover: null, typeI: 0, typeN: 0, seen: false, tilt: null, mx: 900, my: 400 };
  benchRef = React.createRef();
  ext = { feedI: 6, feedT: 0, boardF: 'all', bp: 0, mfModel: 'm4', mfCat: 'SCR', mfGrade: null, cart: [], sparks: [], toast: '', cartPop: false, glow: { bx: 900, by: 300, dx: 400, dy: 300, tx: 400, ty: 300 } };
  rootRef = React.createRef(); reelRef = React.createRef(); heroRef = React.createRef(); railRef = React.createRef(); tdRef = React.createRef(); offerRef = React.createRef();
  componentDidUpdate(pp, ps) { ps = ps || this._prevS || {}; this._prevS = { chatMsgs: this.state.chatMsgs, chatTyping: this.state.chatTyping, chatOpen: this.state.chatOpen }; const a = (ps.chatMsgs || []).length, b = (this.state.chatMsgs || []).length; if (a !== b || ps.chatTyping !== this.state.chatTyping || (!ps.chatOpen && this.state.chatOpen)) { const c = this.chatRef.current; if (c) c.scrollTop = c.scrollHeight; } }
  componentDidMount() {
    // G9: re-render the parts that depend on the language (switch state) when it changes.
    this.onLang = (e) => this.setState({ lang: e.detail }); window.addEventListener('se:lang', this.onLang); if (window.seI18n && window.seI18n.lang() === 'ar') this.setState({ lang: 'ar' });
    this.setState(this.ext);
    this.offIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.removeAttribute('data-off'); else e.target.setAttribute('data-off', ''); }), { rootMargin: '150px 0px' });
    this.offSeen = new WeakSet(); const scan = () => { document.querySelectorAll('section, footer').forEach((el) => { if (!this.offSeen.has(el)) { this.offSeen.add(el); el.setAttribute('data-off', ''); this.offIO.observe(el); } }); };
    scan(); this.offIv = setInterval(scan, 3000);
    false && setTimeout(() => { const r = this.rootRef.current; if (r) import(/* webpackIgnore: true */ new URL('./se-bus.js', document.baseURI).href).then((m) => { if (!this.dead) this.busOff = m.mount(r); }).catch((e) => console.warn('bus', e && e.message)); }, 300);
    try { if (!sessionStorage.getItem('se-booted') && !matchMedia('(prefers-reduced-motion: reduce)').matches) { sessionStorage.setItem('se-booted', '1'); this.setState({ bootOn: true }); /* 14 Oct §01: BootIntro decides when to leave (real loading, 1.5–5s) */ } } catch (e) {}
    this.buyIv = setInterval(() => { if (document.hidden || window.scrollY > 600 || this.state.fmpOpen) return; const D = this.state.data; if (!D) return; const p = D.products.find((x) => x.stock_qty > 3 && x.category === 'SCR'); if (!p) return; this.flyToCart(); }, 12000);
    this.onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.openSearch(); } else if (e.key === 'Escape') this.setState({ posterI: null, spOpen: false, fmpOpen: false, drawerMap: false, drawerCart: false }); };
    window.addEventListener('keydown', this.onKey);
    this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib); this.libT = setTimeout(() => { if (!window.seParts) return; const lb = window.seParts.peek(); if (lb && lb.large && lb.large.length >= 8) this.setState({ lib: lb }); else window.seParts.get(); }, 400);
    window.seIpFlyAt = (t) => this.flyToCart(t); window.seNowAt = (ms) => { this.nowOv = ms; this.forceUpdate(); }; window.seGlobeAt = (t) => { this._gOv = t; this._gDrawn = 0; this.drawGlobe(); }; window.seReelAt = (t) => { this._gOv = null; this.reelCtl(); window.seReel.at(t * 1000); this.drawGlobe(); };
    // R6 Part A: the hero globe only draws while the hero is on screen, at most ~30 times a second
    this.gVis = true; this.gIO = new IntersectionObserver(([e]) => { this.gVis = e.isIntersecting; }); setTimeout(() => this.heroRef.current && this.gIO.observe(this.heroRef.current), 300);
    let gLast = 0; const gLoop = (now) => { if (this.dead) return; if (this._gcv && !document.hidden && this.gVis && now - gLast > 32) { gLast = now; this.drawGlobe(); } this._graf = requestAnimationFrame(gLoop); }; gLoop(0);
    this.bus = (e) => { const d = e.detail || {}; switch (e.type) { case 'se:cart': this.addToCart(d.id, d); break; case 'se:flash': this.flash(d.t); break; case 'se:go': this.go(d.id); break; case 'se:fmp': this.openFmpAt(d.b, d.m, d.c, d.q); break; case 'se:chat': d.q ? this.ask(d.q) : this.setState({ chatOpen: true }); break; case 'se:search': this.openSearch(d.q); break; } };
    ['se:cart', 'se:flash', 'se:go', 'se:fmp', 'se:chat', 'se:search'].forEach((n) => window.addEventListener(n, this.bus));
    this.playIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); e.target.querySelectorAll('iframe[data-src]').forEach((f) => { if (!f.src) f.src = f.getAttribute('data-src'); }); } else e.target.removeAttribute('data-in'); }), { rootMargin: '600px 0px' });
    const obsAll = () => { const r = this.rootRef.current; if (r) r.querySelectorAll('section, footer').forEach((el) => { if (!el.__seObs) { el.__seObs = 1; this.playIO.observe(el); } }); };
    obsAll(); setTimeout(obsAll, 600); setTimeout(obsAll, 2000);
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 60);
    this.t = setInterval(() => this.setState({ now: Date.now() }), 60000);
    this.onScroll = () => { if (this.raf) return; this.raf = requestAnimationFrame(() => { this.raf = 0; this.measure(); }); };
    window.addEventListener('scroll', this.onScroll, { passive: true }); window.addEventListener('resize', this.onScroll);
    this.measure(); setTimeout(() => this.measure(), 600);
    this.io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) { if (e.target === this.storyRef.current) this.setState({ storySeen: false }); return; } if (e.target === this.railRef.current && !this.counted) { this.counted = true; this.count(); } if (e.target === this.offerRef.current) this.setState({ seen: e.isIntersecting }); if (e.target === this.storyRef.current) this.setState({ storySeen: e.isIntersecting }); if (this.seenRefs && this.seenRefs[e.target.id]) this.setState({ ['seen_' + e.target.id]: true }); }), { threshold: 0.12 });
    setTimeout(() => [this.railRef, this.offerRef, this.storyRef, ...(this.extraObs || [])].forEach((r) => r.current && this.io.observe(r.current)), 300);
    try { document.fonts && document.fonts.load('700 20px "Space Grotesk"').then(() => { if (!this.dead) { this._hl = {}; this.forceUpdate(); } }); } catch (e) {}
  }
  componentWillUnmount() { this.gIO && this.gIO.disconnect(); window.removeEventListener('se:lang', this.onLang); this.dead = true; clearInterval(this._reelSync); cancelAnimationFrame(this.reelRAF); this.reelIO && this.reelIO.disconnect(); [this.dIv, this.t, this.buyIv, this.offIv].forEach(clearInterval); this.offIO && this.offIO.disconnect(); this.busOff && this.busOff(); window.removeEventListener('keydown', this.onKey); ['se:cart', 'se:flash', 'se:go', 'se:fmp', 'se:chat', 'se:search'].forEach((n) => window.removeEventListener(n, this.bus)); this.playIO && this.playIO.disconnect(); if (this._kfEl) this._kfEl.remove(); clearTimeout(this.toastT2); clearTimeout(this.hideT); clearTimeout(this.toastT); window.removeEventListener('scroll', this.onScroll); window.removeEventListener('resize', this.onScroll); this.io && this.io.disconnect(); }
  TYPED = ['iPhone 15 Pro screen', 'Galaxy A54 battery', 'SM-A546 back cover', 'Redmi Note 13 charging flex', 'Pixel 8 Pro camera', 'Honor Magic6 Pro frame', 'Tecno Camon 30 screen', 'A2849 battery', 'Vivo V30 back glass', 'POCO X6 Pro charging port', 'Infinix Note 40 screen', 'Huawei P60 Pro camera'];
  measure() {
    const de = document.documentElement, vw = de.clientWidth || window.innerWidth, vh = window.innerHeight, z = Math.max(0.5, vw / 1440);
    const prog = Math.min(1, Math.max(0, window.scrollY / Math.max(1, de.scrollHeight - vh))), root = this.rootRef.current;
    if (root) { const pb = root.querySelector('[data-prog="bar"]'), pd = root.querySelector('[data-prog="dot"]'), pe = root.querySelector('[data-prog="end"]'), w = (prog * 100).toFixed(2) + '%'; /* R6 Part A: transforms only (no layout per scroll) */ if (pb) pb.style.transform = 'scaleX(' + prog.toFixed(4) + ')'; if (pd) pd.style.transform = 'translateX(' + ((document.documentElement.dir === 'rtl' ? -1 : 1) * prog * vw).toFixed(1) + 'px)'; if (pe) { const f = prog > 0.995; pe.style.background = f ? '#F7C032' : 'transparent'; pe.style.boxShadow = f ? '0 0 14px 4px rgba(247,192,50,.8)' : 'none'; } }
    const tone = 'dark'; // R6 Part A: the header is graphite everywhere, so the per-scroll scan of every [data-tone] block (a forced layout each time) is gone
    const ce = document.getElementById('circuit'); const circSeen = this.state.circSeen || (ce && ce.getBoundingClientRect().top < vh * 0.75);
    const S = this.state, nv = { z: Math.round(z * 1e4) / 1e4, vw, vh, tone, circSeen: !!circSeen };
    if (Object.keys(nv).some((k) => nv[k] !== S[k])) this.setState(nv);
  }
  kf(name, P, stepS, axis) {
    if (!this._kfs) { this._kfs = {}; this._kfEl = document.createElement('style'); document.head.appendChild(this._kfEl); }
    if (this._kfs[name]) return name; this._kfs[name] = 1;
    const n = P.length - 1, D = n * stepS, mv = Math.min(0.9, stepS * 0.35), tr = (v) => 'transform:translate' + axis + '(' + v + 'px)', E = 'animation-timing-function:cubic-bezier(.2,.8,.2,1)';
    let f = '0%{' + tr(P[0]) + '}';
    for (let i = 0; i < n; i++) { const t0 = ((i * stepS + stepS - mv) / D) * 100, t1 = (((i + 1) * stepS) / D) * 100; f += t0.toFixed(3) + '%{' + tr(P[i]) + ';' + E + '}' + t1.toFixed(3) + '%{' + tr(P[i + 1]) + '}'; }
    this.kfAdd('@keyframes ' + name + '{' + f + '}');
    return name;
  }
  kfShow(name, D, from, to) {
    this.kf('__init', [0, 0], 1, 'Y'); if (this._kfs[name]) return name; this._kfs[name] = 1;
    const p = (x) => ((x / D) * 100).toFixed(2) + '%';
    this.kfAdd('@keyframes ' + name + '{0%,' + p(from) + '{opacity:0;transform:translateY(8px)}' + p(from + 0.3) + ',' + p(to) + '{opacity:1;transform:none}' + p(to + 0.4) + ',100%{opacity:0;transform:none}}');
    return name;
  }
  count() { const root = this.rootRef.current; if (!root) return; const els = [...root.querySelectorAll('[data-count]')], t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3); els.forEach((el) => { el.textContent = Math.round(Number(el.getAttribute('data-count')) * e).toLocaleString('en-US'); }); if (k < 1 && !this.dead) requestAnimationFrame(f); }; requestAnimationFrame(f); }
  hours() {
    // 14 Oct §02: one shared status (src/lib/shopStatus.js): open / closing soon / closed / opening soon, in Dubai time
    const S = shopStatus(this.state.data ? this.state.data.hours : {}, this.nowOv || this.state.now), hm = (x) => String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
    return { ...S, clock: hm(S.m) };
  }
  // G7: data for the status pill's pop-over: weekly hours (today highlighted), branch, live status and countdown.
  // Handles the split shift (break 14:00–16:00, Friday 12:00–16:00) and the closed Sunday.
  statusPop() {
    const d = new Date(this.nowOv || this.state.now), g = new Date(d.getTime() + d.getTimezoneOffset() * 6e4 + 4 * 36e5), day = g.getDay(), m = g.getHours() * 60 + g.getMinutes();
    const H = this.state.data ? this.state.data.hours : {}, hm = (x) => String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
    const span = (mins) => { const dd = Math.floor(mins / 1440), hh = Math.floor((mins % 1440) / 60), mm = mins % 60; return dd ? dd + 'd ' + hh + 'h' : hh ? hh + 'h ' + String(mm).padStart(2, '0') + 'm' : mm + 'm'; };
    const cur = (H[day] || []).find(([a, b]) => m >= a && m < b);
    let count = '';
    if (cur) count = 'Closes in ' + span(cur[1] - m);
    else { for (let k = 0; k < 8 && !count; k++) { const dd = (day + k) % 7, nx = (H[dd] || []).find(([a]) => k > 0 || a > m); if (nx) count = 'Opens in ' + span(k * 1440 + nx[0] - m); } }
    const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const days = [6, 0, 1, 2, 3, 4, 5].map((k) => { const sh = H[k] || [], on = k === day; return { day: NAMES[k], h: sh.length ? sh.map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') : 'Closed', on, ink: on ? '#F7C032' : sh.length ? '#E4E5E7' : '#8A8C90', w: on ? 600 : 400, bg: on ? 'rgba(247,192,50,.10)' : 'transparent' }; });
    return { count, days, branch: 'Al Murar, Deira · Dubai time' };
  }
  memo(k, s, f) {
    const IGN = { tone: 1, z: 1, vw: 1, vh: 1, circSeen: 1, prog: 1, tp: 1, bp: 1, cartPop: 1 }, c = (this._memo = this._memo || {})[k];
    if (c) { let same = true; for (const key in s) { if (!IGN[key] && s[key] !== c.s[key]) { same = false; break; } } if (same) return c.v; }
    const v = f(); this._memo[k] = { s: { ...s }, v }; return v;
  }
  flyToCart(cap) {
    const root = this.rootRef.current; if (!root) return; const ip = root.querySelector('[data-ipad]'), cart = root.querySelector('[data-ipcart]'), grid = root.querySelector('[data-ipgrid]'); if (!ip || !cart || !grid) return;
    const gr = grid.getBoundingClientRect(), card = [...grid.querySelectorAll('[data-ipcard]')].find((c) => { const r = c.getBoundingClientRect(); return r.top >= gr.top - 1 && r.bottom <= gr.bottom + 1; }); if (!card) return;
    const plus = card.querySelector('[data-ipplus]'), im = card.querySelector('[data-ipimg]'), name = card.getAttribute('data-name') || 'Part', z = Math.max(0.5, ip.getBoundingClientRect().width / 384);
    const pr = plus.getBoundingClientRect(), ir = im.getBoundingClientRect(), b = cart.getBoundingClientRect(), px = pr.left + pr.width / 2, py = pr.top + pr.height / 2, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    (this._fly || []).forEach((e) => e.remove()); const els = (this._fly = []), A = [];
    const rip = document.createElement('div'); rip.style.cssText = 'position:absolute;left:' + (px + window.scrollX) + 'px;top:' + (py + window.scrollY) + 'px;width:' + 46 * z + 'px;height:' + 46 * z + 'px;margin:' + -23 * z + 'px 0 0 ' + -23 * z + 'px;border-radius:50%;background:rgba(255,255,255,.3);box-shadow:0 0 0 1px rgba(255,255,255,.45);z-index:60;pointer-events:none;opacity:0'; document.body.appendChild(rip); els.push(rip);
    A.push(rip.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(1.25)', opacity: 0.9, offset: 0.35 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }));
    A.push(plus.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)', offset: 0.4 }, { transform: 'scale(1)' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' }));
    const cp = im.cloneNode(true); cp.querySelectorAll('[data-ipplus],[data-ipchip]').forEach((e) => e.remove()); cp.removeAttribute('data-ipimg');
    const w0 = ir.width, h0 = ir.height; cp.style.cssText += ';position:absolute;left:' + window.scrollX + 'px;top:' + window.scrollY + 'px;width:' + w0 + 'px;height:' + h0 + 'px;margin:0;z-index:60;pointer-events:none;box-shadow:0 10px 22px rgba(26,27,29,.28);transform-origin:50% 50%;opacity:0'; document.body.appendChild(cp); els.push(cp);
    const xa = ir.left + w0 / 2, ya = ir.top + h0 / 2, mx = (xa + x1) / 2, my = Math.min(ya, y1) - 70 * z, K = [], N = 16, ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    for (let i = 0; i <= N; i++) { const t = i / N, e = ease(t), x = (1 - e) * (1 - e) * xa + 2 * (1 - e) * e * mx + e * e * x1, y = (1 - e) * (1 - e) * ya + 2 * (1 - e) * e * my + e * e * y1, sc = 1 - 0.8 * e, bl = Math.sin(Math.PI * t) * 1.8; K.push({ transform: 'translate(' + (x - w0 / 2) + 'px,' + (y - h0 / 2) + 'px) scale(' + sc.toFixed(3) + ')', filter: 'blur(' + bl.toFixed(2) + 'px)', opacity: t > 0.94 ? 0 : 1 }); }
    A.push(cp.animate(K, { duration: 600, delay: 150, easing: 'linear', fill: 'both' }));
    A.push(cart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)', offset: 0.4 }, { transform: 'scale(.97)', offset: 0.75 }, { transform: 'scale(1)' }], { duration: 250, delay: 750, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
    if (cap != null) { A.forEach((a) => { a.pause(); a.currentTime = cap * 1000; }); this.setState((st) => ({ ipBuys: cap >= 0.75 ? (this._capB = (this._capB == null ? st.ipBuys || 0 : this._capB)) + 1 : this._capB == null ? st.ipBuys || 0 : this._capB, ipToast: cap >= 1.0 && cap < 2.5, ipToastName: name })); return; }
    window.dispatchEvent(new CustomEvent('se:surge', { detail: { el: ip } })); // Issue 4: the circuits answer the add-to-cart
    clearTimeout(this.ipT1); clearTimeout(this.ipT2); clearTimeout(this.ipTT);
    this.ipT1 = setTimeout(() => this.setState((st) => ({ ipBuys: (st.ipBuys || 0) + 1 })), 750);
    this.ipT2 = setTimeout(() => { els.forEach((e) => e.remove()); this.setState({ ipToast: true, ipToastName: name }); this.ipTT = setTimeout(() => this.setState({ ipToast: false }), 1500); }, 1000);
  }
  kfV(name, P, steps, axis) {
    this.kf('__init', [0, 0], 1, 'Y'); if (this._kfs[name]) return name; this._kfs[name] = 1;
    const D = steps.reduce((a, b) => a + b, 0), tr = (v) => 'transform:translate' + axis + '(' + v + 'px)', E = 'animation-timing-function:cubic-bezier(.2,.8,.2,1)'; let f = '0%{' + tr(P[0]) + '}', t = 0;
    for (let i = 0; i < steps.length; i++) { const mv = Math.min(0.9, steps[i] * 0.35), t0 = ((t + steps[i] - mv) / D) * 100, t1 = ((t + steps[i]) / D) * 100; f += t0.toFixed(3) + '%{' + tr(P[i]) + ';' + E + '}' + t1.toFixed(3) + '%{' + tr(P[i + 1]) + '}'; t += steps[i]; }
    this.kfAdd('@keyframes ' + name + '{' + f + '}'); return name;
  }
  // timeline keyframes over the reel period D; fr = [[t (s, from film start T0), css, easing?], ...]
  // R6 Part A: keyframes were appended one at a time (each append re-parsed the whole growing stylesheet, ~220ms at load);
  // they are now queued and written once per task
  kfAdd(css) { (this._kfQ = this._kfQ || []).push(css); if (this._kfQd) return; this._kfQd = true; queueMicrotask(() => { this._kfQd = false; if (this._kfEl && this._kfQ.length) { this._kfEl.appendChild(document.createTextNode(this._kfQ.join(''))); this._kfQ = []; } }); }
  tlK(name, D, T0, fr) { this.kf('__init', [0, 0], 1, 'Y'); if (!this._kfs[name]) { this._kfs[name] = 1; const pc = (t) => Math.min(100, Math.max(0, ((T0 + t) / D) * 100)).toFixed(3) + '%'; let f = '0%{' + fr[0][1] + '}'; fr.forEach(([t, css, e]) => { f += pc(t) + '{' + css + (e ? ';animation-timing-function:' + e : '') + '}'; }); f += '100%{' + fr[fr.length - 1][1] + '}'; this.kfAdd('@keyframes ' + name + '{' + f + '}'); } return name + ' ' + D + 's linear infinite'; }
  computeBB(lib) { const out = {}; Promise.all((lib.large || []).slice(0, 10).map((src, i) => new Promise((res) => { if (!src) return res(); const im = new Image(); im.onload = () => { try { const N = 160, ar = im.naturalHeight / im.naturalWidth, c = document.createElement('canvas'); c.width = N; c.height = Math.round(N * ar); const x = c.getContext('2d'); x.drawImage(im, 0, 0, c.width, c.height); const d = x.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1; for (let y = 0; y < c.height; y++) for (let xx = 0; xx < c.width; xx++) if (d[(y * c.width + xx) * 4 + 3] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; } if (x1 >= 0) { let n = 0, sx = 0, sy = 0, xx2 = 0, yy2 = 0, xy = 0; for (let y = 0; y < c.height; y++) for (let q = 0; q < c.width; q++) if (d[(y * c.width + q) * 4 + 3] > 24) { n++; sx += q; sy += y; xx2 += q * q; yy2 += y * y; xy += q * y; } const mx = sx / n, my = sy / n, cxx = xx2 / n - mx * mx, cyy = yy2 / n - my * my, cxy = xy / n - mx * my, th = 0.5 * Math.atan2(2 * cxy, cxx - cyy); let tilt = 90 - (th * 180) / Math.PI; if (tilt > 90) tilt -= 180; out[i] = [x0 / c.width, y0 / c.height, (x1 - x0 + 1) / c.width, (y1 - y0 + 1) / c.height, ar, Math.abs(tilt) < 20 ? tilt : 0]; } } catch (e) {} res(); }; im.onerror = () => res(); im.src = src; }))).then(() => { if (!this.dead) this.setState({ bb: out }); }); }
  loadGlobe() {}
  drawGlobe() { const cv = this._gcv, G = window.SE_GLOBE; if (!cv || !cv.isConnected || !G) return; let t = 1.5; if (this._gOv != null) t = this._gOv; else { try { const sh = cv.closest('[data-card]'), an = sh && sh.getAnimations()[0], p = an && an.effect.getComputedTiming().progress; if (p != null) t = p * 32; } catch (e) {} if (t > 3.9 && this._gDrawn) return; }
    this._gDrawn = 1; const x = cv.getContext('2d'), N = cv.width, R = N / 2 - 5, C = N / 2, D = Math.PI / 180, l0 = (55.27 - 15 * t) * D, p0 = 22 * D, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
    const pj = (lon, lat, h) => { const l = lon * D - l0, f = lat * D, cf = Math.cos(f), sf = Math.sin(f), cl = Math.cos(l), r = R * (h || 1); return [C + r * cf * Math.sin(l), C - r * (cp0 * sf - sp0 * cf * cl), sp0 * sf + cp0 * cf * cl]; };
    x.clearRect(0, 0, N, N);
    const bg = x.createRadialGradient(C - R * 0.3, C - R * 0.35, R * 0.1, C, C, R); bg.addColorStop(0, '#3A3C41'); bg.addColorStop(0.7, '#25272B'); bg.addColorStop(1, '#1A1B1E'); x.beginPath(); x.arc(C, C, R, 0, 7); x.fillStyle = bg; x.fill();
    const dots = (arr, col, sz) => { x.fillStyle = col; for (let i = 0; i < arr.length; i += 2) { const q = pj(arr[i], arr[i + 1]); if (q[2] <= 0.02) continue; x.globalAlpha = Math.min(1, 0.15 + q[2] * 1.1); const z = sz * (0.55 + 0.45 * q[2]); x.fillRect(q[0] - z / 2, q[1] - z / 2, z, z); } x.globalAlpha = 1; };
    dots(G.land, 'rgba(214,216,219,.62)', 2.3); dots(G.hi, '#F7C032', 2.5);
    const v3 = (lon, lat) => [Math.cos(lat * D) * Math.cos(lon * D), Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D)], ll = (v) => [Math.atan2(v[1], v[0]) / D, Math.asin(Math.max(-1, Math.min(1, v[2]))) / D];
    const slerp = (a, b, f) => { const dt = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(dt); if (om < 1e-4) return a; const s1 = Math.sin((1 - f) * om) / Math.sin(om), s2 = Math.sin(f * om) / Math.sin(om); return [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2]; };
    const O = v3(G.dxb[0], G.dxb[1]); x.lineCap = 'round';
    G.ctr.forEach((c, k) => { const B = v3(c[0], c[1]), H = 0.05 + 0.1 * Math.min(1, Math.acos(Math.max(-1, Math.min(1, O[0] * B[0] + O[1] * B[1] + O[2] * B[2]))) / 1.2), pts = [];
      for (let i = 0; i <= 18; i++) { const f = i / 18, g = ll(slerp(O, B, f)); pts.push(pj(g[0], g[1], 1 + H * Math.sin(Math.PI * f))); }
      x.lineWidth = 1.1; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], z = Math.min(a[2], b[2]); if (z < -0.05) continue; x.globalAlpha = Math.max(0, Math.min(1, 0.2 + z * 1.4)) * 0.75; x.strokeStyle = '#F7C032'; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
      const e = pj(c[0], c[1]); if (e[2] > 0) { x.globalAlpha = Math.min(1, 0.2 + e[2] * 1.2); x.beginPath(); x.arc(e[0], e[1], 2.6, 0, 7); x.fillStyle = '#F7C032'; x.fill(); }
      const f = (t * 0.45 + k * 0.137) % 1, g = ll(slerp(O, B, f)), q = pj(g[0], g[1], 1 + H * Math.sin(Math.PI * f)); if (q[2] > 0) { const pa = Math.min(1, 0.2 + q[2] * 1.2) * Math.sin(Math.PI * f); x.globalAlpha = pa * 0.5; x.beginPath(); x.arc(q[0], q[1], 5, 0, 7); x.fillStyle = '#F7C032'; x.fill(); x.globalAlpha = pa; x.beginPath(); x.arc(q[0], q[1], 2, 0, 7); x.fillStyle = '#FFF4D1'; x.fill(); } });
    x.globalAlpha = 1; const d = pj(G.dxb[0], G.dxb[1]);
    if (d[2] > 0) { const a = Math.min(1, 0.2 + d[2] * 1.2), hg = x.createRadialGradient(d[0], d[1], 0, d[0], d[1], 18); hg.addColorStop(0, 'rgba(247,192,50,.6)'); hg.addColorStop(1, 'rgba(247,192,50,0)'); x.globalAlpha = a; x.fillStyle = hg; x.beginPath(); x.arc(d[0], d[1], 18, 0, 7); x.fill();
      const pu = (t % 2.4) / 2.4; x.globalAlpha = a * (1 - pu) * 0.9; x.lineWidth = 1.4; x.strokeStyle = '#F7C032'; x.beginPath(); x.arc(d[0], d[1], 5 + pu * 13, 0, 7); x.stroke();
      x.globalAlpha = a; x.beginPath(); x.arc(d[0], d[1], 5, 0, 7); x.fillStyle = '#F7C032'; x.fill(); x.lineWidth = 1.6; x.strokeStyle = '#26282B'; x.stroke(); }
    x.globalAlpha = 1; const rim = x.createRadialGradient(C, C, R * 0.82, C, C, R); rim.addColorStop(0, 'rgba(255,236,190,0)'); rim.addColorStop(0.85, 'rgba(255,236,190,.16)'); rim.addColorStop(1, 'rgba(255,240,205,.42)'); x.beginPath(); x.arc(C, C, R, 0, 7); x.fillStyle = rim; x.fill();
    x.lineWidth = 1; x.strokeStyle = 'rgba(255,240,205,.35)'; x.stroke(); }
  hlFit(t) { const h = (this._hl = this._hl || {}); if (h[t] != null) return h[t]; let ok = false; try { ok = document.fonts.check('700 20px "Space Grotesk"'); } catch (e) {}
    if (!ok) { if (!this._hlWait) { this._hlWait = 1; const re = () => { this._hlWait = 0; this._hl = {}; if (!this.dead) this.forceUpdate(); }; try { document.fonts.load('700 20px "Space Grotesk"').then(() => document.fonts.ready).then(re); } catch (e) {} } return 18; }
    const c = this._hlc || (this._hlc = document.createElement('canvas').getContext('2d')); c.font = '700 20px "Space Grotesk"'; const w = Math.max(...t.split('\n').map((l) => c.measureText(l).width - l.length * 0.5)); return (h[t] = Math.min(20, Math.floor(((20 * 157) / Math.max(1, w)) * 10) / 10)); }
  // H4 repair card: library phone (front) — crack from lower left, yellow seal from impact outward (~1.2s), boot logo; all on the reel clock
  hrFilm(F, D, T0, img) {
    const S = 137.3 / F.ph[3], px = F.ph[0] * S, py = F.ph[1] * S, pw = F.ph[2] * S, ph = F.ph[3] * S, bx = 96 - (px + pw / 2), by = 228.8 - (py + ph / 2), sx = px + F.scr[0] * pw, sy = py + F.scr[1] * ph, sw = F.scr[2] * pw, sh = F.scr[3] * ph, r1 = (v) => Math.round(v * 10) / 10;
    const key = r1(sw) + 'x' + r1(sh), ix = sw * 0.2, iy = sh * 0.84;
    if (!this._hrF || this._hrF.key !== key) {
      const pre = 'hrR' + (this._hrV = (this._hrV || 0) + 1) + '_', EO = 'cubic-bezier(.16,1,.3,1)', IO = 'cubic-bezier(.45,0,.55,1)'; let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647, inB = (x, y) => x > -2 && x < sw + 2 && y > -2 && y < sh + 2, seg = sw / 15, P2 = (x, y) => x.toFixed(1) + ' ' + y.toFixed(1), L = [];
      const angs = [-100, -86, -72, -58, -44, -30, -16, -3, 12, 150, 178, 205];
      angs.forEach((ag, k) => { let an = (ag * Math.PI) / 180, x = ix, y = iy, d = 'M' + P2(x, y), len = 0; const short = k >= 9, max = short ? sw * 0.26 : sw * (0.8 + rnd() * 1.4), pts = [[x, y]];
        while (inB(x, y) && len < max) { const sl = seg * (0.6 + rnd() * 0.9); an += (rnd() - 0.5) * 0.45; x += Math.cos(an) * sl; y += Math.sin(an) * sl; len += sl; d += ' L' + P2(x, y); pts.push([x, y]); }
        L.push({ d, r: 0, o: k, w: short ? 0.6 : 0.85 });
        if (!short && pts.length > 4 && rnd() < 0.75) { const bp = pts[2 + Math.floor(rnd() * (pts.length - 3))]; let qx = bp[0], qy = bp[1], ba = an + (rnd() < 0.5 ? -0.8 : 0.8), bd = 'M' + P2(qx, qy); for (let j = 0; j < 3; j++) { const sl = seg * (0.5 + rnd() * 0.6); ba += (rnd() - 0.5) * 0.4; qx += Math.cos(ba) * sl; qy += Math.sin(ba) * sl; bd += ' L' + P2(qx, qy); } L.push({ d: bd, r: Math.hypot(bp[0] - ix, bp[1] - iy), o: -1, w: 0.55 }); } });
      [0.1, 0.2, 0.33].forEach((f) => { const rr = sw * f; for (let k = 0; k < 8; k++) { if (rnd() < 0.35) continue; const a1 = (angs[k] * Math.PI) / 180, a2 = (angs[k + 1] * Math.PI) / 180, m = (a1 + a2) / 2, q = rr * (0.95 + rnd() * 0.12); L.push({ d: 'M' + P2(ix + Math.cos(a1) * rr, iy + Math.sin(a1) * rr) + ' L' + P2(ix + Math.cos(m) * q, iy + Math.sin(m) * q) + ' L' + P2(ix + Math.cos(a2) * rr, iy + Math.sin(a2) * rr), r: rr, o: -1, w: 0.55 }); } });
      const mr = Math.max(1, ...L.map((c) => c.r)); let n = 0;
      const cracks = L.map((c) => { const rad = c.o >= 0, ws = rad ? 0.2 + c.o * 0.008 : 0.26 + (c.r / mr) * 0.12, wd = rad ? 0.16 : 0.1, ys = rad ? 0.72 + c.o * 0.075 : 0.8 + (c.r / mr) * 0.9, yd = rad ? 0.3 : 0.2, id = pre + n++;
        return { d: c.d, w: c.w, yw: c.w * 1.9, wa: this.tlK(id + 'w', D, T0, [[0, 'stroke-dashoffset:1;opacity:1'], [ws, 'stroke-dashoffset:1;opacity:1', EO], [ws + wd, 'stroke-dashoffset:0;opacity:1'], [ys + yd, 'stroke-dashoffset:0;opacity:1'], [ys + yd + 0.1, 'stroke-dashoffset:0;opacity:0']]), ya: this.tlK(id + 'y', D, T0, [[0, 'stroke-dashoffset:1;opacity:1'], [ys, 'stroke-dashoffset:1;opacity:1', IO], [ys + yd, 'stroke-dashoffset:0;opacity:1'], [1.98, 'stroke-dashoffset:0;opacity:1'], [2.2, 'stroke-dashoffset:0;opacity:0']]) }; });
      this._hrF = { key, cracks,
        flash: this.tlK(pre + 'fl', D, T0, [[0, 'opacity:0;transform:scale(.4)'], [0.18, 'opacity:0;transform:scale(.4)', EO], [0.24, 'opacity:1;transform:scale(1)'], [0.5, 'opacity:0;transform:scale(1.4)']]),
        boot: this.tlK(pre + 'bt', D, T0, [[0, 'opacity:0'], [1.95, 'opacity:0', EO], [2.2, 'opacity:1']]),
        logo: this.tlK(pre + 'lg', D, T0, [[0, 'opacity:0;transform:scale(.92)'], [2.0, 'opacity:0;transform:scale(.92)', EO], [2.3, 'opacity:1;transform:scale(1)']]),
        sweep: this.tlK(pre + 'sw', D, T0, [[0, 'transform:translateX(-120%)'], [2.05, 'transform:translateX(-120%)', IO], [2.5, 'transform:translateX(320%)']]) };
    }
    const f = this._hrF;
    return { ...f, S, bx: r1(bx), by: r1(by), px: r1(px), py: r1(py), pw: r1(pw), ph: r1(ph), pr: r1(pw * 0.16), sx: r1(sx), sy: r1(sy), sw: r1(sw), sh: r1(sh), sr: r1(sw * 0.14), ox: r1(px + pw / 2), oy: r1(py + ph / 2), vb: '0 0 ' + r1(sw) + ' ' + r1(sh), fx: r1(ix), fy: r1(iy), lw: r1(sw * 0.52), shx: r1(bx + px + pw * 0.05), shy: r1(by + py + ph - 4), shw: r1(pw * 0.9), hasImg: !!img, noImg: !img, img: img || '' };
  }
  repFilm(D, T0) {
    if (this._rp) return this._rp; let sd = 7; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647), ix = 34, iy = 352, inB = (x, y) => x > -4 && x < 196 && y > -4 && y < 420;
    const rad = [], rings = [], EO = 'cubic-bezier(.16,1,.3,1)', IO = 'cubic-bezier(.45,0,.55,1)';
    const angs = [-98, -84, -71, -58, -45, -33, -20, -6, 8, 128, 168];
    angs.forEach((ag, k) => { let a = (ag * Math.PI) / 180, x = ix + Math.cos(a) * 4, y = iy + Math.sin(a) * 4, d = 'M' + x.toFixed(1) + ' ' + y.toFixed(1), len = 0, pts = [[x, y]]; const max = k >= 9 ? 50 : 160 + rnd() * 320;
      while (inB(x, y) && len < max) { const sl = 10 + rnd() * 22; a += ((rnd() - 0.5) * 26 * Math.PI) / 180; x += Math.cos(a) * sl; y += Math.sin(a) * sl; len += sl; d += ' L' + x.toFixed(1) + ' ' + y.toFixed(1); pts.push([x, y]); }
      rad.push({ d, k, pts, a0: (ag * Math.PI) / 180 });
      if (k < 9 && pts.length > 4 && rnd() < 0.7) { const bp = pts[2 + Math.floor(rnd() * (pts.length - 3))]; let bx = bp[0], by = bp[1], ba = a + (rnd() < 0.5 ? -0.7 : 0.7), bd = 'M' + bx.toFixed(1) + ' ' + by.toFixed(1); for (let j = 0; j < 3; j++) { const sl = 10 + rnd() * 16; ba += (rnd() - 0.5) * 0.4; bx += Math.cos(ba) * sl; by += Math.sin(ba) * sl; bd += ' L' + bx.toFixed(1) + ' ' + by.toFixed(1); } rings.push({ d: bd, r: Math.hypot(bp[0] - ix, bp[1] - iy) }); } });
    [16, 30, 52, 80].forEach((r) => { for (let k = 0; k < 8; k++) { if (rnd() < 0.3) continue; const a1 = (angs[k] * Math.PI) / 180, a2 = (angs[k + 1] * Math.PI) / 180, rr = r * (0.9 + rnd() * 0.2), m = (a1 + a2) / 2, rm = rr * (0.95 + rnd() * 0.12); rings.push({ d: 'M' + (ix + Math.cos(a1) * rr).toFixed(1) + ' ' + (iy + Math.sin(a1) * rr).toFixed(1) + ' L' + (ix + Math.cos(m) * rm).toFixed(1) + ' ' + (iy + Math.sin(m) * rm).toFixed(1) + ' L' + (ix + Math.cos(a2) * rr * (0.92 + rnd() * 0.16)).toFixed(1) + ' ' + (iy + Math.sin(a2) * rr * (0.92 + rnd() * 0.16)).toFixed(1), r }); } });
    const cr = []; let n = 0;
    const add = (d, ci, du, ew, lw) => { const id = 'rpC' + n++; cr.push({ d, ew, lw, w: this.tlK(id + 'w', D, T0, [[0, 'stroke-dashoffset:0'], [ci + 0.05, 'stroke-dashoffset:0', IO], [ci + du + 0.04, 'stroke-dashoffset:-1']]), y: this.tlK(id + 'y', D, T0, [[0, 'stroke-dashoffset:1;opacity:1'], [ci - 0.18, 'stroke-dashoffset:1;opacity:1', EO], [ci, 'stroke-dashoffset:0;opacity:1', IO], [ci + du, 'stroke-dashoffset:-1;opacity:0']]) }); };
    rad.forEach((c) => add(c.d, 0.62 + c.k * 0.055, 0.42, c.k >= 9 ? 1.6 : 2.2, c.k >= 9 ? 0.6 : 0.8));
    rings.sort((a, b) => a.r - b.r).forEach((c) => add(c.d, Math.min(1.42, 0.82 + (c.r / 90) * 0.5), 0.3, 1.6, 0.6));
    this._rp = { cracks: cr,
      ph: this.tlK('rpPhn', D, T0, [[0, 'transform:none'], [2.3, 'transform:none', EO], [2.75, 'transform:translateY(46px) scale(.62)']]),
      dim: this.tlK('rpDim', D, T0, [[0, 'opacity:1'], [1.8, 'opacity:1', 'ease-in'], [1.9, 'opacity:0']]),
      imp: this.tlK('rpImp', D, T0, [[0, 'opacity:1'], [0.62, 'opacity:1'], [0.9, 'opacity:0']]),
      logo: this.tlK('rpLogo', D, T0, [[0, 'opacity:0;transform:scale(.96)'], [1.95, 'opacity:0;transform:scale(.96)', EO], [2.15, 'opacity:1;transform:scale(1)']]),
      sweep: this.tlK('rpSw', D, T0, [[0, 'transform:translateX(-90px)'], [2.1, 'transform:translateX(-90px)', IO], [2.5, 'transform:translateX(220px)']]),
      eb: this.tlK('rpEb', D, T0, [[0, 'opacity:0;transform:translateY(6px)'], [2.4, 'opacity:0;transform:translateY(6px)', EO], [2.65, 'opacity:1;transform:none']]),
      h1: this.tlK('rpH1', D, T0, [[0, 'transform:translateY(110%)'], [2.5, 'transform:translateY(110%)', EO], [2.9, 'transform:none']]),
      h2: this.tlK('rpH2', D, T0, [[0, 'transform:translateY(110%)'], [2.6, 'transform:translateY(110%)', EO], [3.0, 'transform:none']]),
      h3: this.tlK('rpH3', D, T0, [[0, 'transform:translateY(110%)'], [2.7, 'transform:translateY(110%)', EO], [3.1, 'transform:none']]),
      pill: this.tlK('rpPill', D, T0, [[0, 'opacity:0;transform:scale(.6)'], [3.0, 'opacity:0;transform:scale(.6)', 'cubic-bezier(.2,.8,.2,1)'], [3.22, 'opacity:1;transform:scale(1.06)', 'ease-in-out'], [3.36, 'opacity:1;transform:scale(.98)', 'ease-out'], [3.46, 'opacity:1;transform:scale(1)']]) };
    return this._rp;
  }
  addToCart(id, ev) {
    const D = this.state.data, p = D && D.products.find((x) => x.id === id); if (!p) return;
    if (ev && ev.clientX != null) this.spark(ev.clientX, ev.clientY);
    this.setState((s) => { const c = s.cart || [], ex = c.find((x) => x.id === id); return { cart: ex ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id, qty: 1 }], cartPop: true, toast: 'Added · ' + p.title + ' · ' + p.grade }; });
    setTimeout(() => this.setState({ cartPop: false }), 320); clearTimeout(this.toastT2); this.toastT2 = setTimeout(() => this.setState({ toast: '' }), 2600);
  }
  spark(x, y) { const id = Date.now() + Math.random(); this.setState((s) => ({ sparks: [...(s.sparks || []), { id, x, y }] })); setTimeout(() => this.setState((s) => ({ sparks: (s.sparks || []).filter((k) => k.id !== id) })), 700); }
  flash(t) { clearTimeout(this.toastT2); this.setState({ toast: t }); this.toastT2 = setTimeout(() => this.setState({ toast: '' }), 2600); }
  extA(s, D, P, fmt, cl, pad, bars, KIND) {
    const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    const byId = (id) => P.find((p) => p.id === id);
    const mOf = (p) => D && p && D.models.find((m) => m.id === p.model_id);
    const dg = new Date(s.now), g = new Date(dg.getTime() + dg.getTimezoneOffset() * 6e4 + 4 * 36e5), tsec = g.getHours() * 3600 + g.getMinutes() * 60 + g.getSeconds();
    const hms = (sec) => { sec = ((sec % 86400) + 86400) % 86400; return pad(Math.floor(sec / 3600)) + ':' + pad(Math.floor((sec % 3600) / 60)) + ':' + pad(sec % 60); };
    // board
    const TAG = { arrival: ['JUST LANDED', '#F7C032', '#26282B'], low: ['LOW STOCK', 'rgba(229,72,77,.18)', '#FF8A8E'], drop: ['PRICE DROP', 'rgba(247,192,50,.16)', '#F7C032'], shipped: ['SHIPPED', 'rgba(43,182,115,.16)', '#5FD49A'], restock: ['BACK IN STOCK', 'rgba(255,255,255,.1)', '#F2F3F4'] };
    const evs = D ? D.events.map((e) => { const p = e.pid && byId(e.pid); const text = e.type === 'shipped' ? e.city + ', ' + e.country : p ? p.title + ' · ' + GN[p.grade] : ''; const note = e.type === 'low' && p ? 'only ' + p.stock_qty + ' left' : e.type === 'shipped' ? e.note : e.type === 'drop' ? e.note : p ? 'AED ' + fmt(p.retail_price) : ''; return { type: e.type, text, note }; }).filter((e) => e.text) : [];
    const base = s.boardF === 'all' ? evs : evs.filter((e) => e.type === s.boardF), n = base.length || 1;
    const N = base.length || 1, kk = 1 + Math.ceil(7 / N), rev = base.map((e, idx) => ({ e, idx })).reverse(), feed = [];
    for (let c = 0; c < kk; c++) rev.forEach(({ e, idx }) => { const tg = TAG[e.type]; feed.push({ t: hms(tsec - (N - 1 - idx) * 173 - 40).slice(0, 5), tag: tg[0], tagBg: tg[1], tagInk: tg[2], text: e.text, note: e.note, noteC: e.type === 'low' ? '#FF8A8E' : e.type === 'drop' ? '#F7C032' : '#9DA1A6' }); });
    const feedAnim = this.kf('seFeed' + N, Array.from({ length: N + 1 }, (_, i) => -(N - i) * 56), 2.8, 'Y') + ' ' + (N * 2.8).toFixed(1) + 's';
    const cnt = (t) => evs.filter((e) => e.type === t).length;
    const boardStats = [['arrival', 'JUST LANDED', cnt('arrival') + cnt('restock'), '#F7C032'], ['low', 'LOW STOCK', P.filter((p) => p.stock_qty > 0 && p.stock_qty <= 3).length, '#FF8A8E'], ['drop', 'PRICE DROPS', D ? D.deals.length : 0, '#F7C032'], ['shipped', 'SHIPPED TODAY', cnt('shipped'), '#5FD49A']]
      .map(([id, k, v, c]) => { const on = s.boardF === id; return { k, v: fmt(v), c, bg: on ? 'rgba(247,192,50,.12)' : 'rgba(255,255,255,.04)', bd: on ? '#F7C032' : 'rgba(255,255,255,.1)', pick: () => this.setState({ boardF: on ? 'all' : id }) }; });
    const boardFilterLbl = s.boardF === 'all' ? 'Showing everything · tap a counter to filter' : 'Filter · ' + (TAG[s.boardF] || TAG.arrival)[0].toLowerCase() + ' · tap again to clear';
    // model file
    const MF = ['m4', 'm9', 'm12', 'm14', 'm19', 'm28'];
    const mm = D && D.models.find((m) => m.id === s.mfModel), mps = P.filter((p) => p.model_id === s.mfModel);
    const catsHere = D ? D.categories.filter((c) => mps.some((p) => p.category === c.id)) : [];
    const mfCat = catsHere.some((c) => c.id === s.mfCat) ? s.mfCat : catsHere[0] ? catsHere[0].id : 'SCR';
    const gl = mps.filter((p) => p.category === mfCat).sort((a, b) => b.retail_price - a.retail_price), mx = Math.max(1, ...gl.map((p) => p.retail_price));
    const sel = gl.find((p) => p.id === s.mfGrade && p.stock_qty > 0) || gl.find((p) => p.stock_qty > 0) || gl[0];
    const mf = { code: mm ? mm.code : '', num: mm ? mm.model_numbers[0] : '', name: mm ? mm.name : '', brand: mm ? mm.brand_id : 'apple', kind: KIND[mfCat],
      models: MF.map((id) => { const m = D && D.models.find((x) => x.id === id), on = id === s.mfModel; return { name: m ? m.name : '', bg: on ? '#26282B' : '#FFFFFF', ink: on ? '#FFFFFF' : '#26282B', sh: on ? '0 0 0 1.5px #26282B' : '0 0 0 1px rgba(26,27,29,.12)', pick: () => this.setState({ mfModel: id, mfGrade: null }) }; }),
      stats: [['PARTS', mps.length], ['IN STOCK', fmt(mps.reduce((a, p) => a + p.stock_qty, 0))], ['FROM', 'AED ' + (mps.length ? Math.min(...mps.map((p) => p.retail_price)) : 0)]].map(([k, v]) => ({ k, v })),
      cats: catsHere.map((c) => { const on = c.id === mfCat; return { name: c.name, n: mps.filter((p) => p.category === c.id).length, bg: on ? '#F7C032' : '#F2F3F4', ink: '#26282B', pick: () => this.setState({ mfCat: c.id, mfGrade: null }) }; }),
      grades: gl.map((p) => { const on = sel && p.id === sel.id, out = p.stock_qty === 0; return { code: GN[p.grade], name: GN[p.grade], price: 'AED ' + fmt(p.retail_price), stock: out ? 'Restocking' : p.stock_qty >= 4 ? 'In stock' : 'Only ' + p.stock_qty + ' left', bars: bars(p.stock_qty, '#26282B', '#D5D7DA'), w: Math.round((p.retail_price / mx) * 100) + '%', out, o: out ? 0.5 : 1, bg: on ? '#FFF4D1' : '#FFFFFF', sh: on ? '0 0 0 2px #F7C032' : '0 0 0 1px rgba(26,27,29,.08)', pick: () => this.setState({ mfGrade: p.id }) }; }),
      hint: gl.length > 1 ? 'Bars show price relative to the top grade. Pick the grade that fits the job and the budget.' : 'One grade stocked for this part on this model.',
      selTitle: sel ? sel.title : '', selGrade: sel ? GN[sel.grade] + ' · ' + (sel.stock_qty >= 4 ? 'in stock' : 'only ' + sel.stock_qty + ' left') : '', selPrice: sel ? 'AED ' + fmt(sel.retail_price) : '',
      add: (ev) => sel && this.addToCart(sel.id, ev), open: (ev) => { ev.preventDefault(); this.flash('The full Model File page is next in the build.'); } };
    // deals
    const deals = D ? D.deals.slice(0, 4).map((d) => { const p = byId(d.product_id); if (!p) return null; const left = Math.max(0, d.ends - s.now) / 1000; return { kind: KIND[p.category], pct: '−' + d.discount + '%', grade: GN[p.grade], title: p.title, price: 'AED ' + fmt(p.retail_price * (1 - d.discount / 100)), old: 'AED ' + fmt(p.retail_price), bars: bars(p.stock_qty, '#F7C032', 'rgba(255,255,255,.18)'), stock: p.stock_qty >= 4 ? 'In stock' : p.stock_qty ? 'Only ' + p.stock_qty + ' left' : 'Restocking', left: left > 86400 ? Math.floor(left / 86400) + 'd ' + pad(Math.floor((left % 86400) / 3600)) + 'h' : Math.floor(left / 3600) + 'h ' + pad(Math.floor((left % 3600) / 60)) + 'm', add: (ev) => this.addToCart(p.id, ev) }; }).filter(Boolean) : [];
    const sh = D && D.shipments[0], sl = sh ? Math.max(0, sh.lands - s.now) / 1000 : 0, span = 7 * 86400;
    const ship = { id: sh ? sh.id : '', label: sh ? sh.label : '', origin: sh ? sh.origin : '', pct: (cl(1 - sl / span) * 100).toFixed(1) + '%', parts: [[Math.floor(sl / 86400), 'DAYS'], [Math.floor((sl % 86400) / 3600), 'HRS'], [Math.floor((sl % 3600) / 60), 'MIN']].map(([v, u]) => ({ v: pad(v), u })), notify: () => this.flash('We’ll message you when ' + (sh ? sh.id : 'it') + ' lands. (demo)') };
    const preorders = D ? D.preorders.map((p) => ({ ...p, bg: p.status === 'Pre-order open' ? '#F7C032' : '#F2F3F4' })) : [];
    return { feed, feedAnim, boardStats, boardFilterLbl, boardClock: hms(tsec).slice(0, 5), mf, deals, ship, preorders, goDeals: (ev) => { ev.preventDefault(); this.go('deals'); } };
  }
  mapRef = React.createRef(); storyRef = React.createRef();
  extB(s, D, P, fmt, cl, pad) {
    const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    // repair estimator
    const reBrand = s.reBrand || 'apple', models = D ? D.models.filter((m) => m.brand_id === reBrand) : [];
    const withParts = models.find((m) => P.some((p) => p.model_id === m.id)), reModel = models.some((m) => m.id === s.reModel) ? s.reModel : withParts ? withParts.id : models[0] ? models[0].id : ''; // R6 §11: start on a model with sample parts
    // R6 §11: problems are a multi-select; the first one with a part sets the quality chips (Original first), its
    // manufacturer and the film (screen / battery / charging port); the rest are added or quoted after diagnosis
    const R = D ? D.repairs : [], sel = (s.reProbs || ['SCR']).map((id) => R.find((r) => r.id === id)).filter(Boolean);
    const prob = sel.find((r) => r.cat) || sel[0] || R[0] || { cat: 'SCR', labour: 0, time: '' };
    const ORD = ['OR', 'OL', 'IN', 'AQ'], MN = (D && D.makerNames) || {};
    const parts = prob.cat ? P.filter((p) => p.model_id === reModel && p.category === prob.cat).sort((a, b) => ORD.indexOf(a.grade) - ORD.indexOf(b.grade)) : [];
    const grade = parts.find((p) => p.grade === s.reGrade) || parts.find((p) => p.stock_qty > 0) || parts[0];
    const others = sel.filter((r) => r !== prob), cheap = (cat) => { const ps = P.filter((p) => p.model_id === reModel && p.category === cat); return ps.length ? Math.min(...ps.map((p) => p.retail_price)) : null; };
    let lo = grade ? grade.retail_price + prob.labour : 0, diag = !prob.cat || !grade;
    others.forEach((r) => { const c = r.cat ? cheap(r.cat) : null; if (c != null) lo += c + r.labour; else diag = true; });
    const hi = Math.round((lo * 1.15) / 5) * 5;
    const mm = D && D.models.find((m) => m.id === reModel);
    const val = s.baVal == null ? 50 : s.baVal;
    const film = (sel.find((r) => r.film) || {}).film || 'scr';
    const re = { val, pos: val + '%', clipR: 100 - val + '%', slide: (e) => this.setState({ baVal: Number(e.target.value) }),
      steps: ['Diagnose', 'Quote', 'Repair', 'Test'].map((t, i) => ({ n: pad(i + 1), t })),
      brands: D ? D.brands.map((b) => { const on = b.id === reBrand; return { id: b.id, name: b.name, bg: on ? '#26282B' : '#F2F3F4', ink: on ? '#FFFFFF' : '#26282B', sh: on ? '0 0 0 2px #F7C032' : 'none', pick: () => this.setState({ reBrand: b.id, reModel: null, reGrade: null }) }; }) : [],
      models: models.map((m) => ({ id: m.id, name: m.name })), model: reModel, pickModel: (e) => this.setState({ reModel: e.target.value, reGrade: null }),
      mdd: { open: s.reDD === 'm', rot: s.reDD === 'm' ? 180 : 0, bd: s.reDD === 'm' ? '#F7C032' : 'rgba(26,27,29,.15)', cur: mm ? mm.name : '—', toggle: () => this.setState({ reDD: s.reDD === 'm' ? null : 'm' }), opts: models.map((m) => ({ name: m.name, on: m.id === reModel, bg: m.id === reModel ? '#FFF4D1' : 'transparent', pick: () => this.setState({ reModel: m.id, reGrade: null, reDD: null }) })) },
      probs: R.map((r) => { const on = sel.includes(r); return { id: r.id, name: r.name, on, pick: () => { const cur = s.reProbs || ['SCR'], nx = on ? cur.filter((x) => x !== r.id) : r.id === 'NS' ? ['NS'] : cur.filter((x) => x !== 'NS').concat(r.id); this.setState({ reProbs: nx.length ? nx : ['NS'], reGrade: null }); } }; }),
      grades: parts.map((p) => { const on = grade && p.id === grade.id; return { name: GN[p.grade], bg: on ? '#F7C032' : '#F2F3F4', ink: '#26282B', sh: on ? '0 0 0 1.5px #26282B,0 0 16px rgba(247,192,50,.75)' : 'none', pick: () => this.setState({ reGrade: p.grade }) }; }),
      maker: grade ? MN[grade.grade] || '' : '', grade: grade ? GN[grade.grade] : '', hasParts: parts.length > 0,
      range: lo ? 'AED ' + fmt(lo) + '–' + fmt(hi) : 'Ask us', rollAnim: (lo % 2 ? 'reRollA' : 'reRollB') + ' .4s cubic-bezier(.2,.8,.2,1) both', time: prob.cat ? prob.time || '—' : 'After diagnosis',
      note: [grade ? 'The part plus bench work.' : 'Parts quoted after diagnosis.'].concat(diag && grade ? ['Some problems are quoted after diagnosis.'] : [], ['Final price confirmed after diagnosis.']),
      film, ticket: { model: mm ? mm.name : '', problems: sel.map((r) => r.name).join(' · ') },
      wa: D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I want to book a repair: ' + (mm ? mm.name : '') + ' · ' + sel.map((r) => r.name).join(', ') + (grade ? ' · ' + GN[grade.grade] : '')) : '#',
      more: (ev) => { ev.preventDefault(); this.flash('The full Repair Lab page is next in the build.'); } };
    // wholesale
    const WP = ['SE-IP13-SCR-IN', 'SE-A54-BAT-OR', 'SE-RN13-SCR-OR', 'SE-IP15-BCV-HQ'].map((id) => P.find((p) => p.id === id)).filter(Boolean);
    const wp = WP.find((p) => p.id === s.whsPart) || WP[0], qty = s.whsQty || 100;
    const rt = wp ? wp.retail_price * qty : 0, tr = wp ? wp.wholesale_price * qty : 0;
    const whs = { qty, setQty: (e) => this.setState({ whsQty: Number(e.target.value) }), retail: 'AED ' + fmt(rt), trade: 'AED ' + fmt(tr), save: 'AED ' + fmt(rt - tr), bar: rt ? Math.round(((rt - tr) / rt) * 100 * 3) + '%' : '0%',
      parts: WP.map((p) => { const on = wp && p.id === wp.id; return { name: p.title.replace(' Screen', ' LCD'), bg: on ? '#F7C032' : 'rgba(255,255,255,.07)', ink: on ? '#26282B' : '#FFFFFF', pick: () => this.setState({ whsPart: p.id }) }; }),
      iso: (() => { const n = Math.min(24, Math.max(1, Math.ceil(qty / 20))), out = []; for (let k = 0; k < n; k++) { const L = Math.floor(k / 12), r = k % 12, gx = r % 4, gy = Math.floor(r / 4); out.push({ x: Math.round((gx - gy) * 20 - 22), y: Math.round(96 + (gx + gy) * 10 - L * 20 - 22 + 0), z: k }); } return out.sort((p, q) => p.y - q.y + (q.z - p.z) * 0); })(), full: qty >= 480,
      cartonsN: Math.max(1, Math.min(16, Math.ceil(qty / 25))), roll: (qty / 10 % 2 ? 'reRollA' : 'reRollB') + ' .4s cubic-bezier(.2,.8,.2,1) both', convDur: '28s', conv: (() => { const C = ['Lagos', 'Accra', 'Nairobi', 'Muscat', 'Amman', 'Kampala', 'Baghdad', 'Beirut'].map((c, i) => ({ label: 'SE-' + (4962 + i * 37) + ' · ' + c, w: 72 + (i % 3) * 14, h: 50 + (i % 2) * 12, fragile: i % 3 === 0 })).map((c) => ({ ...c, mt: 80 - c.h })); return [...C, ...C]; })(), cartons: Array.from({ length: Math.max(1, Math.min(12, Math.ceil(qty / 40))) }, (_, i) => ({ col: (i % 4) + 1, row: 3 - Math.floor(i / 4) })), film: Math.round(Math.min(1, qty / 480) * 100) + '%', liftAnim: qty >= 480 ? 'whLift 7s cubic-bezier(.45,0,.55,1) infinite' : 'none', forkAnim: qty >= 480 ? 'whFork 7s cubic-bezier(.45,0,.55,1) infinite' : 'none', newAnim: qty >= 480 ? 'whNew 7s cubic-bezier(.2,.8,.2,1) infinite' : 'none', boxLbl: qty >= 480 ? 'Pallet full · wrapped · off to dispatch' : Math.max(1, Math.min(12, Math.ceil(qty / 40))) + ' cartons on the pallet · packed in Deira',
      ticker: (() => { const T = [['Repair shop · Lagos', 'iPhone 13 Incell screens', '× 80'], ['Trader · Nairobi', 'Galaxy A54 batteries', '× 120'], ['Shop · Amman', 'Redmi Note 13 screens', '× 40'], ['Exporter · Baghdad', 'Charging flex mix', '× 300'], ['Repair shop · Muscat', 'iPhone 15 back glass', '× 25'], ['Trader · Kampala', 'Tecno Camon 30 screens', '× 60'], ['Shop · Beirut', 'iPhone 11 batteries', '× 50'], ['Distributor · Accra', 'Infinix Note 40 screens', '× 90']].map(([who, what, q]) => ({ who, what, qty: q })); return [...T, ...T]; })(),
      points: ['Trade prices for approved accounts', 'Bulk lists quoted the same day', 'Packed and shipped from Deira'],
      apply: () => this.flash('Trade account application opens on the Wholesale page.'), bulk: () => this.flash('Bulk list upload opens on the Wholesale page.'), partner: () => this.flash('Partner programme details are on the Wholesale page.') };
    // network
    const C = D ? D.countries : [], reg = s.region || 'all';
    const RN = [{ id: 'all', name: 'All' }, ...(D ? D.regions : [])];
    const list = C.filter((c) => c.name !== 'UAE' && (reg === 'all' || c.region === reg));
    
    const ST = ['Packed', 'Dispatched', 'In transit', 'Customs', 'Delivered'], STC = { Packed: ['#C9CBCE', 'rgba(255,255,255,.08)'], Dispatched: ['#F7C032', 'rgba(247,192,50,.12)'], 'In transit': ['#F7C032', 'rgba(247,192,50,.16)'], Customs: ['#E4E5E7', 'rgba(255,255,255,.1)'], Delivered: ['#5FD49A', 'rgba(43,182,115,.16)'] };
    const net = { count: list.length + ' DESTINATIONS',
      regions: RN.map((r) => { const on = r.id === reg; return { name: r.name, n: r.id === 'all' ? C.length - 1 : C.filter((c) => c.region === r.id).length, bg: on ? '#F7C032' : 'transparent', ink: on ? '#26282B' : '#F2F3F4', pick: () => { this.setState({ region: r.id }); const f = this.mapRef.current; if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'se-region', region: r.id }, '*'); } }; }),
      board: (() => { const M = list.length || 1, k2 = 1 + Math.ceil(9 / M), out = []; for (let c = 0; c < k2; c++) list.slice().reverse().forEach((cn, j) => { const st = ST[(j + c) % ST.length]; out.push({ name: cn.name, box: 'SE-' + (4100 + ((j * 37 + c * 11) % 900)), status: st, sc: STC[st][0], sb: STC[st][1] }); }); return out; })(),
      boardAnim: this.kf('seNet' + list.length, Array.from({ length: (list.length || 1) + 1 }, (_, i) => -((list.length || 1) - i) * 42), 2.6, 'Y') + ' ' + ((list.length || 1) * 2.6).toFixed(1) + 's',
      info: [['TRACKED', 'Every box, every step', 'Tracking number sent with your order.'], ['PACKED', 'Securely, by hand', 'Screens boxed flat, batteries packed to air-freight rules.'], ['QUOTED', 'Before it ships', 'Shipping cost confirmed with your order total.'], ['REGIONS', 'Four, and growing', 'Middle East · Africa · Europe · Asia.']].map(([k, t, d], i) => ({ k, t, d, p: ['M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5', 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', 'M12 2v4M5 9h14l-2 9H7zM9 22h6', 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20M2 12h20M12 2a15 15 0 0 1 0 20'][i], anim: ['niPin 1.6s ease-in-out infinite', 'niBox 2.4s ease-in-out infinite', 'niStamp 2.2s ease-in-out infinite', 'niGlow 2s ease-in-out infinite'][i] })) };
    // story
    const H = D ? D.history : [], seen = !!s.storySeen;
    const story = { fill: seen ? '90%' : '0%', madrid: '64%', more: (ev) => { ev.preventDefault(); this.flash('The full Our Story page is next in the build.'); }, notify: () => this.flash('We’ll tell you the day Madrid opens. (demo)'),
      items: H.map((h, i) => { const now = i === 3, soon = i === 4; return { ...h, bg: now ? 'linear-gradient(150deg,#3D3E3F,#26282B)' : soon ? 'rgba(255,255,255,.6)' : '#FFFFFF', ink: now ? '#FFFFFF' : '#26282B', sh: now ? '0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.18)' : soon ? 'inset 0 0 0 1.5px rgba(26,27,29,.2)' : '0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.06)', vBg: now ? '#F7C032' : '#26282B', vInk: now ? '#26282B' : '#F7C032',
        dot: seen && !soon ? '#F7C032' : '#FFFFFF', ring: soon ? 'rgba(26,27,29,.25)' : '#F7C032', nodeAnim: now ? 'stNode 1.6s cubic-bezier(.45,0,.55,1) infinite' : 'none', st: now ? '● RUNNING' : soon ? '◌ INSTALLING' : '✓ SHIPPED', stC: now ? '#F7C032' : '#5E6064', o: seen ? 1 : 0, y: seen ? 0 : 20, delay: i * 80 + 'ms' }; }) };
    const hrs = D ? D.hours : {}, dg = new Date(s.now), g = new Date(dg.getTime() + dg.getTimezoneOffset() * 6e4 + 4 * 36e5), hm = (x) => pad(Math.floor(x / 60)) + ':' + pad(x % 60);
    const td = (hrs[g.getDay()] || []).map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') || 'Closed';
    return { re, whs, net, story, mapRef: this.mapRef, storyRef: this.storyRef, todayHours: td, dirLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(SITE.contact.plusCode + ' Dubai') };
  }
  chatRef = React.createRef();
  // G8: where an answer can send the visitor (the API route's ACTIONS), with EN/AR button labels
  chatAct(name, ar) {
    const D = this.state.data || {}, wa = 'https://wa.me/' + ((D.contact && D.contact.wa) || SITE.contact.whatsapp);
    const A = { visit: ['Opening hours & directions', 'الدوام والاتجاهات', () => this.go('visit')], repair: ['Repair estimator', 'مقدّر التصليح', () => this.go('repair')], wholesale: ['Wholesale', 'الجملة', () => this.go('wholesale')], network: ['Worldwide network', 'شبكتنا حول العالم', () => this.go('network')], models: ['Compare grades', 'قارن الدرجات', () => this.go('models')], fmp: ['Find My Part', 'ابحث عن قطعتي', () => this.openFmpAt()], story: ['Our story', 'قصتنا', () => this.go('story')], circuit: ['Sam Circuit', 'سام سيركت', () => this.go('circuit')], whatsapp: ['WhatsApp the desk', 'راسل المكتب على واتساب', () => window.open(wa, '_blank')] }[name];
    return A ? { act: A[2], lbl: ar ? A[1] : A[0] } : {};
  }
  reply(text) {
    const D = this.state.data, t = text.toLowerCase(), H = this.hours(), ar = isArabic(text); if (!D) return { t: ar ? 'لحظة…' : 'One moment…' };
    const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    const nt = t.replace(/[\s-]/g, '');
    const m = D.models.find((x) => nt.includes(x.name.toLowerCase().replace(/[\s-]/g, '')) || x.model_numbers.some((n) => nt.includes(n.toLowerCase().replace(/[\s-]/g, ''))) || nt.includes(x.name.toLowerCase().replace(/^(galaxy|iphone|xiaomi|redmi|realme|oppo|huawei|pixel|xperia)\s*/, '').replace(/[\s-]/g, '')));
    if (m) { const W = { SCR: ['screen', 'lcd', 'oled', 'display', 'شاشه', 'شاشة'], BAT: ['battery', 'batt', 'بطاريه', 'بطارية'], FLX: ['flex', 'charging', 'cable', 'شحن'], BCV: ['back', 'cover', 'غطاء'], CAM: ['camera', 'كاميرا'], FRM: ['frame', 'housing', 'فريم'], SML: ['port', 'button', 'speaker', 'سماعه'] };
      const cat = Object.keys(W).find((k) => W[k].some((w) => t.includes(w))); const ps = D.products.filter((p) => p.model_id === m.id && (!cat || p.category === cat) && p.stock_qty > 0);
      if (ps.length) { const best = ps.sort((a, b) => a.retail_price - b.retail_price); return { t: (ar ? 'وجدت ' + ps.length + ' قطعة متوفرة لـ ' + m.name + ':\n' : 'Found ' + ps.length + ' in-stock part' + (ps.length > 1 ? 's' : '') + ' for the ' + m.name + ':\n') + best.slice(0, 3).map((p) => '· ' + p.title + ' · ' + GN[p.grade] + ' · AED ' + p.retail_price).join('\n') + (ar ? '\n(أسعار تجريبية)' : '\n(sample prices)'), act: () => this.openFmpAt(m.brand_id, m.id, cat || null), lbl: ar ? 'افتح في «ابحث عن قطعتي»' : 'Open in Find My Part', emote: 'part', own: ar }; }
      return { t: ar ? 'لا توجد قطعة ' + m.name + ' لهذا الطلب حالياً. أستطيع أن أسأل الفريق على واتساب.' : 'We have no ' + m.name + ' part in stock for that right now. I can ask the team on WhatsApp.', ...this.chatAct('whatsapp', ar), emote: 'low', own: ar }; }
    const tr = (en) => (window.seI18n && window.seI18n.tr ? window.seI18n.tr(en) : en);
    const fb = fallbackAnswer(text, { D, H, tr });
    if (fb) return { t: fb.t, ...this.chatAct(fb.act, ar), emote: fb.emote, own: ar };
    return { t: ar ? 'لم أفهم هذه تماماً. جرّب موديلاً وقطعة، مثل «بطارية A54» أو «شاشة iPhone 13»، أو اسأل عن الدرجات أو الدوام أو الشحن.' : 'I didn’t catch that one. Try a model and part, like “A54 battery” or “iPhone 13 screen”, or ask about grades, hours or shipping.', ...this.chatAct('fmp', ar), emote: 'low', own: ar };
  }
  // G8: Claude answers through /api/samsoom; until ANTHROPIC_API_KEY is set (or if it fails) the
  // typo-tolerant fallback above answers instead. The chat shows "thinking" until the answer lands.
  ask(q) {
    if (!q || !q.trim()) return;
    q = q.trim();
    const hist = (this.state.chatMsgs || []).filter((m) => !m.intro).map((m) => ({ role: m.me ? 'user' : 'assistant', text: m.t }));
    this.setState((s) => ({ chatMsgs: [...(s.chatMsgs || []), { me: true, t: q }], chatTyping: true, chatTouched: true, chatOpen: true }));
    const t0 = Date.now(), lang = window.seI18n ? window.seI18n.lang() : 'en';
    const land = (r) => { const wait = Math.max(0, 650 - (Date.now() - t0)); setTimeout(() => !this.dead && this.setState((s) => ({ chatTyping: false, chatMsgs: [...(s.chatMsgs || []), { t: r.t, act: r.act, lbl: r.lbl, emote: r.emote, own: true, n: (s.chatMsgs || []).length + 1 }] })), wait); };
    const local = () => land(this.reply(q));
    fetch('/api/samsoom', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: [...hist, { role: 'user', text: q }].slice(-12), lang }) })
      .then((r) => (r.ok ? r.json() : { fallback: true }))
      .then((j) => {
        if (!j || j.fallback || !j.text) return local();
        // model or part questions keep the in-stock lookup (it knows the sample catalogue)
        const lk = this.reply(q);
        const useLk = lk.emote === 'part' && /AED/.test(lk.t);
        if (useLk) return land(lk);
        land({ t: j.text, ...this.chatAct(j.action, isArabic(q) || isArabic(j.text)), emote: emoteFor(q, j.text) || 'happy', own: true });
      })
      .catch(local);
  }
  openFmpAt(b, m, c, q) { this.setState({ fmpOpen: true, fmpB: b || null, fmpM: m || null, fmpC: c || null, fmpQ: (!m && q) || '', drawerMap: false, drawerCart: false }); }
  extC(s, D, P, fmt, cl, pad, bars, KIND) {
    const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */, H = this.hours(), yr = new Date(s.now).getFullYear();
    const wa = D ? 'https://wa.me/' + D.contact.wa : '#', sm = (x) => 'url(/icons/' + x + '.svg) center / contain no-repeat' /* R6 Part C4: self-hosted (the CDN mask came back empty) */;
    // team (entry → senior)
    const TM = D ? D.teamRoles.map((role, i) => { const t = D.team.find((x) => x.role === role) || {}, f = role.startsWith('Founder'); return { role, n: 'C' + pad(i + 1), slot: 'se-team-' + i, name: t.name || 'Name to come', nameC: t.name ? '#FFFFFF' : '#9DA1A6', years: t.since ? (yr - t.since) + ' years with us' : 'Years · to come', stars: [0, 1, 2, 3, 4].map(() => ({ f: 'none' })), rateT: 'No ratings yet', bg: f ? 'linear-gradient(160deg,rgba(247,192,50,.16),rgba(255,255,255,.04))' : 'rgba(255,255,255,.04)', sh: f ? 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.3)' : 'inset 0 0 0 1px rgba(255,255,255,.09)', ring: f ? '#F7C032' : 'rgba(247,192,50,.45)' }; }) : [];
    const team = { members: TM, meet: () => this.flash('The full team roster is on the Our Story page, next in the build.'), join: () => this.flash('Careers and the job application are on the Our Story page.') };
    // lanes
    const LN = [['Retail customer', 'M3 9h18l-2 11H5zM8 9V6a4 4 0 0 1 8 0v3', ['Find your part by model', 'Pick the grade for your budget', 'Collect in Deira or get it delivered'], 'Find My Part', 'fmp'],
      ['Repair shop', 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', ['Same-day parts for the bench', 'Every grade side by side', 'Trade prices once approved'], 'Open a trade account', 'wholesale'],
      ['Trader & exporter', 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20', ['Bulk lists quoted fast', 'Packed for export', 'Shipped to four regions'], 'Shipping & export', 'network'],
      ['Bulk buyer', 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', ['Volume pricing on request', 'Incoming shipments first', 'One contact for every order'], 'Request a bulk quote', 'visit']];
    const lanes = LN.map(([t, icon, path, cta, to], i) => { const dk = false; return { n: pad(i + 1), t, icon, path, cta, href: '#' + to, delay: i * 0.4 + 's', bg: dk ? 'linear-gradient(150deg,#3D3E3F,#26282B 75%)' : '#FFFFFF', ink: dk ? '#FFFFFF' : '#26282B', sh: dk ? '0 24px 50px rgba(26,27,29,.22)' : '0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.06)', trace: dk ? 'rgba(247,192,50,.3)' : 'rgba(26,27,29,.12)', iconBg: dk ? 'rgba(247,192,50,.14)' : '#26282B', iconC: '#F7C032', dot: '#F7C032', dotRing: dk ? 'rgba(247,192,50,.2)' : '#FFF4D1', ctaBg: dk ? '#F7C032' : '#26282B', ctaInk: dk ? '#26282B' : '#FFFFFF', go: (ev) => { ev.preventDefault(); to === 'fmp' ? this.openFmpAt() : this.go(to); } }; });
    // sam circuit
    const TD = ['Your first order', 'Regular customer', 'Trade volume', 'Our closest partners'], cs = !!s.circSeen, hv = s.circHover == null ? 3 : s.circHover;
    const circCells = (D ? D.tiers : ['Connected', 'Charged', 'Supercharged', 'Fully Charged']).map((name, i) => ({ name, d: TD[i], pct: (i + 1) * 25 + '%', h: (i + 1) * 25 + '%', delay: (0.2 + i * 0.25).toFixed(2) + 's', d2: (1.4 + i * 0.25).toFixed(2) + 's', glow: i === 3 ? '0 0 28px 6px rgba(247,192,50,.85)' : 'none' }));
    const circ = { cells: circCells, join: () => this.flash('Sam Circuit sign-up opens with My Bench.'), line: 'Tier ' + (hv + 1) + ' of 4 · ' + (D ? D.tiers[hv] : '') + ' · ' + TD[hv],
      tiers: D ? D.tiers.map((name, i) => { const on = i <= hv; const PK = ['Saved parts and order history', 'Priority stock alerts', 'Trade price tiers', 'Account manager · first pick of shipments']; return { name, n: pad(i + 1), pct: (i + 1) * 25 + '%', d: TD[i], perk: PK[i] + ' · soon', anim: 'ciFill' + i, lvlW: Math.round(((i + 1) / 4) * 76), cells: [0, 1, 2, 3].map((c) => ({ o: c <= i ? 1 : 0.25 })), fill: cs && on ? '100%' : cs ? '0%' : '0%', delay: i * 0.25 + 's', ink: cs && on ? '#26282B' : '#FFFFFF', sub: cs && on ? '#26282B' : '#C9CBCE', kc: cs && on ? '#26282B' : '#F7C032', sh: i === hv ? 'inset 0 0 0 2px #26282B' : 'none', hover: () => this.setState({ circHover: i }) }; }) : [] };
    // samsoom section
    const MO = ['idle', 'think', 'happy', 'found', 'low', 'wave'], ML = ['Idle', 'Thinking', 'Answering', 'Found it', 'Not sure', 'Hello'];
    const mood = s.ssMood || 'idle';
    const SCRIPT = [['me', 'Do you have a Galaxy A54 battery?'], ['bot', 'Yes. Original grade, in stock in Deira. AED ' + ((P.find((p) => p.id === 'SE-A54-BAT-OR') || {}).retail_price || 0) + ' (sample).'], ['me', 'Are you open right now?'], ['bot', H.short + '. Dubai time.']];
    
    const ss = { mood, typing: false,
      moods: MO.map((m, i) => ({ name: ML[i], bg: mood === m ? '#F7C032' : '#FFFFFF', pick: () => this.setState({ ssMood: s.ssMood === m ? null : m }) })),
      msgs: SCRIPT.map(([w, t], i) => ({ t, anim: this.kfShow('seMsg' + i, 12, 0.4 + i * 1.8, 10.6) + ' 12s infinite', al: w === 'me' ? 'flex-end' : 'flex-start', bg: w === 'me' ? '#26282B' : '#FFFFFF', ink: w === 'me' ? '#FFFFFF' : '#26282B' })),
      chips: ['Find my part', 'Which grade?', 'Are you open?', 'Do you ship to my country?', 'Trade prices'].map((q) => ({ q, ask: () => this.ask(q === 'Find my part' ? 'iPhone 13 screen' : q) })),
      move: (ev) => { const sec = ev.currentTarget, el = sec.querySelector('[data-ss]'); if (!el) return; const r = sec.getBoundingClientRect(), x = Math.max(-1, Math.min(1, ((ev.clientX - r.left) / r.width - 0.25) * 2.4)), y = Math.max(-1, Math.min(1, ((ev.clientY - r.top) / r.height - 0.5) * 2)); el.style.transform = 'translate(' + (x * 8).toFixed(1) + 'px,' + (y * 6).toFixed(1) + 'px) rotate(' + (x * 6).toFixed(1) + 'deg)'; } };
    // social
    const socials = [['Instagram', 'instagram', 'https://instagram.com/samelectronics.uae'], ['TikTok', 'tiktok', 'https://www.tiktok.com/@samelectronics.uae'], ['Facebook', 'facebook', 'https://facebook.com/samelectronics.uae']].map(([name, ic, href]) => ({ name, href, mask: sm(ic) }));
    const ST = [['Instagram', 'instagram', 'https://instagram.com/samelectronics.uae', '12.4K', 'followers', 'Just landed: iPhone 15 Pro OLED screens', 'scr', '2 h ago'], ['TikTok', 'tiktok', 'https://www.tiktok.com/@samelectronics.uae', '8.1K', 'followers', 'Battery swap in 60 seconds', 'bat', '5 h ago'], ['Facebook', 'facebook', 'https://facebook.com/samelectronics.uae', '5.6K', 'followers', 'This week: −18% on back glass', 'bcv', '1 d ago']], si = s.socTab || 0, so = ST[si];
    const soc = { tabs: ST.map((x, i) => ({ name: x[0], mask: sm(x[1]), bg: i === si ? '#26282B' : 'transparent', ink: i === si ? '#FFFFFF' : '#3D3E3F', sh: i === si ? '0 4px 10px rgba(38,40,43,.25)' : 'none', pick: () => this.setState({ socTab: i }) })),
      name: so[0], href: so[2], count: so[3], unit: so[4], post: so[5], postKind: so[6], ago: so[7].toUpperCase(), postBg: 'radial-gradient(70% 70% at 50% 40%,#F7C032,#F7C032)', alt: 'QR code for ' + so[0], qr: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=26-27-29&data=' + encodeURIComponent(so[2]) }; soc.qrBg = 'url("' + soc.qr + '")';
    const posts = [['Instagram', 'instagram', 'scr', 'Just landed: iPhone 15 Pro OLED', '12 boxes · Deira', 'y'], ['TikTok', 'tiktok', 'bat', 'Battery swap in 60 seconds', 'Repair clip', 'd'], ['Facebook', 'facebook', 'bcv', 'This week: −18% on back glass', 'Offer · ends Friday', 'w'], ['TikTok', 'tiktok', 'board', 'Board repair under the microscope', 'Repair clip', 'd'], ['Instagram', 'instagram', 'cam', 'Pixel 8 Pro cameras back in stock', 'Stock drop', 'w'], ['Instagram', 'instagram', 'tls', 'Behind the counter: the bench team', 'Team', 'y']]
      .map(([k, ic, kind, title, meta, th], i) => ({ kind2: k, kind, title, meta, mask: sm(ic), href: socials.find((x) => x.name === k).href, video: k === 'TikTok', dur: i === 1 ? '0:58' : '1:24', d: i * 0.7 + 's', tone: th === 'd' ? 'dark' : 'light', ink: th === 'd' ? '#FFFFFF' : '#26282B', bg: th === 'y' ? 'radial-gradient(80% 70% at 50% 40%,#F7C032,#F7C032 70%)' : th === 'd' ? 'radial-gradient(80% 70% at 50% 40%,#4A4D52,#26282B 80%)' : 'radial-gradient(80% 70% at 50% 40%,#FFFFFF,#E4E5E7 80%)' }));
    // request console
    const RT = D ? D.requestTypes : [], rt = s.rqType || RT[0] || 'Order parts', rv = s.rqVals || {};
    const FL = { 'Order parts': [['Model', 'e.g. iPhone 15 Pro'], ['Part & grade', 'e.g. Screen · OLED'], ['Quantity', '1']], 'Bulk quote': [['Company', 'Your shop or company'], ['Parts list', 'Paste models and quantities'], ['Country', 'e.g. Nigeria']], 'Book a repair': [['Model', 'e.g. Galaxy A54'], ['Problem', 'e.g. cracked screen'], ['Preferred time', 'e.g. Saturday evening']], 'Trade account': [['Business name', 'Your shop or company'], ['Customer type', 'Repair shop · Trader · Bulk buyer'], ['Country', 'e.g. UAE']], 'Shipping quote': [['Destination', 'City, country'], ['Parts & quantity', 'e.g. 50 screens'], ['Deadline', 'e.g. next week']], General: [['Your name', 'Name'], ['Message', 'How can we help?']] };
    const fl = (FL[rt] || FL.General).map(([label, ph]) => ({ label, ph, val: rv[rt + label] || '', set: (e) => { const v = e.target.value; this.setState((st) => ({ rqVals: { ...(st.rqVals || {}), [rt + label]: v } })); } }));
    const no = 'SE-REQ-' + (2600 + (s.now / 864e5 | 0) % 900);
    const body = 'Work order ' + no + '\nType: ' + rt + '\n' + fl.map((f) => f.label + ': ' + (f.val || '—')).join('\n');
    const rq = { types: RT.map((t) => ({ name: t, bg: t === rt ? '#F7C032' : 'rgba(255,255,255,.06)', ink: t === rt ? '#26282B' : '#FFFFFF', pick: () => this.setState({ rqType: t }) })), fields: fl, no, typeName: rt, lines: fl.map((f) => ({ k: f.label.toUpperCase(), v: f.val || '—' })),
      wa: wa + '?text=' + encodeURIComponent(body), mail: 'mailto:' + SITE.contact.email + '?subject=' + encodeURIComponent(no + ' · ' + rt) + '&body=' + encodeURIComponent(body) };
    // visit + hours
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], dg = new Date(s.now), g = new Date(dg.getTime() + dg.getTimezoneOffset() * 6e4 + 4 * 36e5), hm = (x) => pad(Math.floor(x / 60)) + ':' + pad(x % 60);
    const visit = { bg: H.open ? '#F7C032' : 'linear-gradient(150deg,#3D3E3F,#26282B)', ink: H.open ? '#26282B' : '#FFFFFF', dot: H.dot, state: H.short.replace(/^Open · until /, 'Open now · until ').replace(/^Closed · opens (\d\d:\d\d)$/, 'Closed now · opens $1 today').replace(/^Closed · /, 'Closed now · '), btnBg: H.open ? '#26282B' : '#F7C032', btnInk: H.open ? '#FFFFFF' : '#26282B', wa: wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.'),
      days: [6, 1, 2, 3, 4, 5, 0].map((d) => { const sh = (D ? D.hours[d] : []) || [], on = d === g.getDay(); return { day: DAYS[d], short: DAYS[d].slice(0, 3), h: sh.length ? sh.map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') : 'Closed', bg: on ? (H.open ? 'rgba(26,27,29,.1)' : 'rgba(247,192,50,.14)') : 'transparent', w: on ? 700 : 500, fc: on ? '#F7C032' : '#C9CBCE' }; }) };
    // system map
    const SM = [['Shop parts', 'Every part, every grade', 'offer'], ['Brands & models', 'Every model’s full parts file', 'models'], ['Repair Lab', 'Fixed, tested, guaranteed', 'repair'], ['Wholesale & trade', 'Stock up. Cost down.', 'wholesale'], ['Worldwide network', 'From Deira to the world', 'network'], ['Deals & arrivals', 'Price drops, new stock, incoming shipments', 'deals'], ['Our story', 'Since 2003: branches, team, careers', 'story'], ['Sam Circuit', 'Our membership', 'circuit'], ['Ask Samsoom', 'Your parts assistant', '@chat'], ['My Bench', 'Orders, saved parts, your tier', '@bench'], ['Request & contact', 'Orders, quotes, repairs, visits', 'visit'], ['Home', 'The full system, top to bottom', 'top']];
    const smGo = (to) => (ev) => { if (ev && ev.preventDefault) ev.preventDefault(); this.setState({ drawerMap: false }); if (to === '@chat') this.setState({ chatOpen: true }); else if (to === '@bench') this.flash('My Bench (account) is designed in a later step.'); else if (to === 'top') jumpTo(0); else this.go(to); };
    const sysMap = SM.map(([t, d, to], i) => ({ n: pad(i + 1), t, d, go: smGo(to) })), sysMapShort = sysMap.filter((_, i) => i < 8);
    // find my part
    const units = (ps) => ps.reduce((t, p) => t + p.stock_qty, 0), kf = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n));
    const fb = s.fmpB, fm = s.fmpM, fc = s.fmpC, q = (s.fmpQ || '').toLowerCase().replace(/[\s-]/g, '');
    const Br = D ? D.brands : [], Mo = D ? D.models : [], Ca = D ? D.categories : [];
    const bName = fb && (Br.find((x) => x.id === fb) || {}).name, mObj = fm && Mo.find((m) => m.id === fm), cObj = fc && Ca.find((c) => c.id === fc);
    const lvl = fc ? 4 : fm ? 3 : fb ? 2 : 1, dl = (i) => Math.min(i, 14) * 25 + 'ms';
    const fbar = (q2) => [4, 7, 10, 13].map((hh, i) => ({ h: hh, c: i < (q2 === 0 ? 0 : q2 < 3 ? 1 : q2 < 10 ? 2 : q2 < 40 ? 3 : 4) ? '#F7C032' : 'rgba(255,255,255,.18)' }));
    const PN = [['Brand', bName], ['Model', mObj && mObj.name], ['Part', cObj && cObj.name], ['Grade', null]];
    const backs = [() => this.setState({ fmpB: null, fmpM: null, fmpC: null, fmpQ: '', fmpSer: null }), () => this.setState({ fmpM: null, fmpC: null }), () => this.setState({ fmpC: null }), () => {}];
    const path = PN.map(([k, v], i) => { const done = i < lvl - 1, cur = i === lvl - 1; return { label: done ? v + ' ✓' : k, go: backs[i], off: !done, cur: done ? 'pointer' : 'default', ink: done ? '#F7C032' : cur ? '#FFFFFF' : '#8C9096', bg: done || cur ? '#3D3E3F' : '#2E3033', dot: done ? '#F7C032' : cur ? '#FFFFFF' : '#5E6064', glow: done ? '0 0 0 1.5px #F7C032,0 0 14px rgba(247,192,50,.7)' : cur ? '0 0 0 1.5px #FFFFFF' : 'inset 0 0 0 1.5px #5E6064', more: i < 3, fill: done ? 1 : 0, flow: i === lvl - 2 }; });
    const POP = ['apple', 'samsung', 'xiaomi'];
    if (this._fmD !== D) { this._fmD = D; this._fmB = Br.map((x) => { const ms = Mo.filter((m) => m.brand_id === x.id), ids = new Set(ms.map((m) => m.id)), qq = P.filter((p) => ids.has(p.model_id)).reduce((t, p) => t + p.stock_qty, 0); return { id: x.id, nm: ms.length, q: qq }; }); }
    const GRP = Object.fromEntries(((D && D.brandGroups) || []).map((g) => [g.id, g.name])), BG = Object.fromEntries(Br.map((b) => [b.id, b.group]));
    // R6 Part E: the owner's order and groups (src/content/brands.ts); a small family label heads each cluster
    const brandsF = (this._fmB || []).map((x, i) => ({ id: x.id, grp: GRP[BG[x.id]] || '', pop: POP.includes(x.id), models: x.nm ? x.nm + ' models' : 'Models coming soon', parts: x.nm ? (x.q ? kf(x.q) + ' in stock' : 'Ask us') : 'Ask us on WhatsApp', bars: fbar(x.q / 20), d: dl(i), bg: POP.includes(x.id) ? 'linear-gradient(180deg,rgba(247,192,50,.12),rgba(255,255,255,.04))' : 'rgba(255,255,255,.05)', pick: () => this.setState({ fmpB: x.id, fmpQ: '', fmpSer: null }) }));
    const bm = Mo.filter((m) => !fb || m.brand_id === fb), SER = [...new Set(bm.map((m) => m.series).filter(Boolean))], ser = s.fmpSer;
    const fModels = bm.filter((m) => (!ser || m.series === ser) && (!q || (m.name + m.model_numbers.join('') + (m.fits || []).map((g) => g.names.join('')).join('')).toLowerCase().replace(/[\s-]/g, '').includes(q))); // R6 E: a compatible name finds the model too
    const CAM = { apple: 'cTri', samsung: 'cCol', google: 'cBar', redmi: 'cCol', poco: 'cCol', realme: 'cCol', infinix: 'cCol', oneplus: 'cCol', nokia: 'cCol' };
    const mp = P.filter((p) => p.model_id === fm);
    const fgr = mp.filter((p) => p.category === fc).sort((x, y) => y.retail_price - x.retail_price);
    // R6 Part E: one line per quality, never an invented warranty period (that is set per product in the Control Room)
    const BEST = { OR: 'Best for: a like-new result', OL: 'Best for: rich colour at a lower price', IN: 'Best for: tight budgets', AQ: 'Best for: close-to-original at a lower price' };
    const WAR = new Proxy({}, { get: () => 'Warranty · ask us for the period' });
        const bProds = fb ? P.filter((p) => { const m = Mo.find((x) => x.id === p.model_id); return m && m.brand_id === fb; }) : P;
    const scope = lvl === 1 ? P : lvl === 2 ? bProds : lvl === 3 ? mp : fgr, count = scope.length, stockU = units(scope);
    const pathTxt = [bName, mObj && mObj.name, cObj && cObj.name].filter(Boolean).join(' › ') || 'All parts';
    const goShop = (gp) => { this.setState({ fmpOpen: false }); this.flash('Shop · ' + pathTxt + (gp ? ' · ' + GN[gp.grade] + ' highlighted' : '') + ' · ' + count + ' results (Shop page comes in Part C).'); };
    const fmp = { open: !!s.fmpOpen, s1: lvl === 1, s2: lvl === 2, s3: lvl === 3, s4: lvl === 4, path, q: s.fmpQ || '', setQ: (e) => this.setState({ fmpQ: e.target.value }), close: () => this.setState({ fmpOpen: false }),
      slide: (lvl % 2 ? 'fmSlideA' : 'fmSlideB') + ' .3s cubic-bezier(.2,.8,.2,1) both', brands: brandsF,
      series: [{ name: 'All', id: null }, ...SER.map((x) => ({ name: x, id: x }))].map((x) => ({ name: x.name, bg: ser === x.id ? '#F7C032' : 'rgba(255,255,255,.07)', ink: ser === x.id ? '#26282B' : '#FFFFFF', pick: () => this.setState({ fmpSer: x.id }) })),
      quick: (fb ? bm.slice(0, 2) : []).map((m, i) => ({ t: (i ? 'Most searched · ' : 'Recently viewed · ') + m.name, pick: () => this.setState({ fmpM: m.id }) })),
      models: fModels.slice(0, 24).map((m, i) => { const ck = CAM[m.brand_id] || 'cRing'; return { name: m.name, num: m.model_numbers[0], parts: (() => { const mp2 = P.filter((p) => p.model_id === m.id); return mp2.length ? kf(units(mp2)) + ' in stock' : 'Ask us'; })(), slot: 'fmp-model-' + m.id, d: dl(i), cTri: ck === 'cTri', cCol: ck === 'cCol', cBar: ck === 'cBar', cRing: ck === 'cRing', pick: () => this.setState({ fmpM: m.id, fmpB: m.brand_id }) }; }), none: lvl === 2 && !fModels.length,
      fits: mObj && mObj.fits && mObj.fits.length ? [...new Set(mObj.fits.flatMap((g) => g.names))].filter((n) => n.toLowerCase().replace(/\s/g, '') !== mObj.name.toLowerCase().replace(/\s/g, '')).join(' · ') : '',
      ask: lvl === 3 && !mp.length ? Ca.filter((c) => !c.soon).map((c, i) => ({ name: c.name, kind: KIND[c.id], d: dl(i), wa: wa + '?text=' + encodeURIComponent('Hi Sam Electronics, do you have the ' + c.one.toLowerCase() + ' for ' + mObj.name + '?') })) : [],
      cats: Ca.filter((c) => mp.some((p) => p.category === c.id)).map((c, i) => { const cp = mp.filter((p) => p.category === c.id), qq = cp.reduce((t, p) => t + p.stock_qty, 0); return { name: c.name, kind: KIND[c.id], d: dl(i), n: cp.length + ' grades · from AED ' + Math.min(...cp.map((p) => p.retail_price)), o: qq ? 1 : 0.7, tag: kf(qq) + ' in stock', has: !!qq, out: !qq, slot: 'fmp-part-' + fm + '-' + c.id, notify: (ev) => { ev.stopPropagation(); this.flash('We’ll message you when ' + c.name.toLowerCase() + ' for this model are back. (demo)'); }, pick: () => this.setState({ fmpC: c.id }) }; }),
      grades: fgr.map((p, i) => { const out = p.stock_qty === 0; return { code: GN[p.grade], name: GN[p.grade], maker: ((D && D.makerNames) || {})[p.grade] || '', shot: p.shot, best: BEST[p.grade] || '', warranty: WAR[p.grade] || '', d: dl(i), price: 'AED ' + fmt(p.retail_price), stock: out ? 'Restocking' : p.stock_qty >= 4 ? 'In stock' : 'Only ' + p.stock_qty + ' left', bars: fbar(p.stock_qty), o: out ? 0.55 : 1, bd: i === 0 ? 'rgba(247,192,50,.5)' : 'rgba(255,255,255,.1)', kind: KIND[p.category], slot: 'fmp-grade-' + p.id, inStock: !out, out, shop: () => goShop(p), add: (ev) => { ev.stopPropagation(); out ? this.flash('We’ll message you when it’s back. (demo)') : this.addToCart(p.id, ev); } }; }),
      summary: [bName, mObj && mObj.name, cObj && cObj.name].filter(Boolean).join(' · ') || 'Pick a brand to start',
      foot: fmt(stockU) + ' parts in stock · ' + count + ' listings' + (lvl === 2 ? ' · ' + fModels.length + ' models' : '') + ' · sample data', count, countF: fmt(count), roll: (count % 2 ? 'fmRollA' : 'fmRollB') + ' .35s cubic-bezier(.2,.8,.2,1) both',
      shop: () => goShop(null) };
    // cart
    const cart = (s.cart || []).filter((c) => P.find((p) => p.id === c.id));
    const cartItems = cart.map((c) => { const p = P.find((x) => x.id === c.id); return { kind: KIND[p.category], title: p.title, grade: GN[p.grade], unit: 'AED ' + fmt(p.retail_price), qty: c.qty, line: 'AED ' + fmt(p.retail_price * c.qty), inc: () => this.setState((st) => ({ cart: st.cart.map((x) => (x.id === c.id ? { ...x, qty: x.qty + 1 } : x)) })), dec: () => this.setState((st) => ({ cart: st.cart.map((x) => (x.id === c.id ? { ...x, qty: x.qty - 1 } : x)).filter((x) => x.qty > 0) })) }; });
    const sub = cart.reduce((a, c) => a + P.find((p) => p.id === c.id).retail_price * c.qty, 0);
    // chat
    const msgs = s.chatMsgs || [{ t: 'Hi, I’m Samsoom. Ask me about a part, a grade, shipping, or whether the shop is open right now.' }];
    // G8: the chat keeps its own input and Samsoom's moods (src/components/home/sections/SamsoomChat.tsx), so
    // typing never re-renders the home page; it only calls ask() and reads the messages.
    const chat = { open: !!s.chatOpen, closed: !s.chatOpen, typing: !!s.chatTyping, showChips: !s.chatTouched, ask: (q) => this.ask(q), touch: () => !s.chatTouched && this.setState({ chatTouched: true }),
      chips: ['Find my part', 'Which grade?', 'Are you open?', 'Do you ship to my country?', 'Trade prices'].map((q2) => ({ q: q2, ask: () => (q2 === 'Find my part' ? this.ask('iPhone 13 screen') : this.ask(q2)) })),
      msgs: msgs.map((m, i) => ({ t: m.t, me: !!m.me, emote: m.emote || null, n: m.n || 0, own: !!(m.me || m.own), al: m.me ? 'flex-end' : 'flex-start', bg: m.me ? '#26282B' : '#FFFFFF', ink: m.me ? '#FFFFFF' : '#26282B', hasAct: !!m.act, act: () => { this.setState({ chatOpen: false }); m.act && m.act(); }, actLbl: m.lbl || '' })) };
    const sparks = s.sparks || [];
    const sparkEl = sparks.length ? React.createElement('div', { style: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 120 } }, sparks.map((k) => React.createElement('div', { key: k.id, style: { position: 'absolute', left: k.x, top: k.y } }, [React.createElement('span', { key: 'c', style: { position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle,#FFF4D1,#F7C032 50%,rgba(247,192,50,0) 70%)', animation: 'seSparkCore .5s ease-out forwards' } })].concat(Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + 0.3, d = 26 + (i % 3) * 12; return React.createElement('span', { key: i, style: { position: 'absolute', left: -2, top: -2, width: 4, height: 4, borderRadius: 2, background: i % 2 ? '#F7C032' : '#FFFFFF', boxShadow: '0 0 6px #F7C032', '--sx': Math.cos(a) * d + 'px', '--sy': Math.sin(a) * d + 'px', animation: 'seSpark .6s cubic-bezier(.2,.8,.2,1) forwards' } }); }))))) : null;
    return { team, lanes, circ, ss, socials, posts, soc, googleReview: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Sam Electronics Al Murar Deira Dubai'), laneGo0: (ev) => { ev.preventDefault(); this.openFmpAt(); }, laneGo1: (ev) => { ev.preventDefault(); this.go('wholesale'); }, laneGo2: (ev) => { ev.preventDefault(); this.go('network'); }, laneGo3: (ev) => { ev.preventDefault(); this.go('visit'); }, reviewSoon: () => this.flash('Reviews open with customer accounts (My Bench).'), rq, visit, sysMap, sysMapShort, fmp,
      drawer: { map: !!s.drawerMap, cart: !!s.drawerCart, close: () => this.setState({ drawerMap: false, drawerCart: false }) }, cartItems, cartEmpty: !cartItems.length, cartSub: 'AED ' + fmt(sub), cartCount: cart.reduce((a, c) => a + c.qty, 0), cartCountShown: cart.reduce((a, c) => a + c.qty, 0), cartPop: s.cartPop ? 1.35 : 1,
      cartWa: wa + '?text=' + encodeURIComponent('Order from the Sam Electronics website\n' + cart.map((c) => { const p = P.find((x) => x.id === c.id); return '· ' + c.qty + ' × ' + p.title + ' · ' + GN[p.grade] + ' [' + p.id + ']'; }).join('\n') + '\nPlease confirm stock, price and delivery.'),
      chat, chatRef: this.chatRef, launch: (() => { const HH = this.hours(), mm = HH.clock; return { mood: 'wave', m0: 'Ask Samsoom', m1: HH.state === 'open' ? 'Open till ' + HH.at : HH.short.replace('Closed · opens', 'Opens'), m2: 'Need a screen?', m3: 'Trade prices? Ask me' }; })(), openChat: () => this.setState({ chatOpen: true }), closeChat: () => this.setState({ chatOpen: false }), hasToast: !!s.toast, toast: s.toast || '', sparkEl,
      browseAll: () => this.flash('The Shop page (all parts) is next in the build.'), ctaMood: 'happy', cta: (() => { const HH = this.hours(), o = !!HH.open; return o ? { tone: 'light', sky: 'linear-gradient(180deg,#7FB7E6 0%,#B9DAF2 45%,#F3EDE2 78%)', ink: '#26282B', sun: 'radial-gradient(circle,#FFF6D8,#FFE7A0 60%,rgba(255,231,160,0))', sunGlow: '0 0 80px 30px rgba(255,240,200,.7)', cloud: '.85', street: 'linear-gradient(180deg,#B9B2A4,#9C9586)', inside: 'linear-gradient(180deg,#FFFDF8,#F1EADC)', signGlow: '.4', signBlur: 4, lampGlow: '.25', lampPost: 0, neon: '#2BB673', neonGlow: 'rgba(43,182,115,.6)', neonT: 'OPEN', doorT: 'COME IN · OPEN', pBg: '#26282B', pInk: '#FFFFFF' }
      : { tone: 'dark', sky: 'linear-gradient(180deg,#1E2A4A 0%,#4A3E62 38%,#B5677A 62%,#E7956A 80%)', ink: '#FFFFFF', sun: 'radial-gradient(circle,#FFF4D8,#F0E2C0 60%,rgba(240,226,192,0))', sunGlow: '0 0 50px 14px rgba(255,240,210,.35)', cloud: '.12', street: 'linear-gradient(180deg,#3D3E3F,#26282B)', inside: 'linear-gradient(180deg,#FFE3A8,#F2B866)', signGlow: '1', signBlur: 14, lampGlow: '.9', lampPost: 30, neon: '#FF6B5E', neonGlow: 'rgba(255,107,94,.6)', neonT: 'CLOSED', doorT: 'SEE YOU SOON', pBg: '#F7C032', pInk: '#26282B' }; })(), bootOn: !!s.bootOn, bootSkip: () => { clearTimeout(this.bootT); this.setState({ bootOn: false }); }, ctaBrowse: (ev) => { ev.preventDefault(); this.go('offer'); }, openFmp: () => this.openFmpAt(), openCart: () => this.setState({ drawerCart: true }), openMap: () => this.setState({ drawerMap: true }), arabic: () => window.seI18n && window.seI18n.set('ar'), bench: () => this.flash('My Bench (account) is designed in a later step.'), staff: () => this.flash('Control Room login: staff only, designed in a later step.') };
  }
  spRef = React.createRef();
  recent() { try { return JSON.parse(sessionStorage.getItem('se-recent') || '[]'); } catch (e) { return []; } }
  pushRecent(q) { q = (q || '').trim(); if (!q) return; const r = [q, ...this.recent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6); try { sessionStorage.setItem('se-recent', JSON.stringify(r)); } catch (e) {} }
  // Issue 1B: the hero reel's clock. Every reel animation is a CSS animation on the same 32s loop (10 ads × 3.2s);
  // this keeps them all on one master clock (so no card ever drifts or glitches), pauses it while the mouse is
  // over the phone, and browses with the arrows, the wheel or a swipe using the same scroll-in movement.
  reelCtl() {
    if (this._rc) return this._rc;
    const D = 32000, STEP = 3200, tl = () => document.timeline.currentTime || performance.now();
    const anims = () => { const r = document.querySelector('[data-se-reel]'), sw = document.querySelector('[data-se-sweep]'); const L = (r ? r.getAnimations({ subtree: true }) : []).concat(sw && !(r && r.contains(sw)) ? sw.getAnimations({ subtree: true }) : []); return L.filter((a) => /^hr/.test(a.animationName || '')); }; // R6 §03 C: + the glass sweep
    let off = tl(), pausedAt = null, hov = false, holdT = 0, lastGo = 0, el = null, ty = null, rev = false;
    const master = () => (pausedAt != null ? pausedAt : (((tl() - off) % D) + D) % D);
    const sync = () => { if (rev) return; const m = master(); anims().forEach((a) => { const c = (((a.currentTime || 0) % D) + D) % D; if (Math.abs(c - m) > 40) a.currentTime = m; if (pausedAt != null) { if (a.playState !== 'paused') a.pause(); } else if (a.playState === 'paused') a.play(); }); };
    const pause = () => { if (pausedAt == null) pausedAt = master(); sync(); };
    const resume = () => { if (pausedAt != null) { off = tl() - pausedAt; pausedAt = null; } sync(); };
    const go = (dir) => {
      const cur = Math.floor(master() / STEP), tgt = ((cur + dir + 10) % 10) * STEP; // the start of that ad's scroll-in
      if (dir < 0) { // R6 §03 C: previous = the feed moves DOWN: the same 600ms scroll, played backwards, then hold that ad
        clearTimeout(holdT); const base = cur * STEP; off = tl() - (base + 600); pausedAt = null; sync(); rev = true;
        anims().forEach((a) => { a.currentTime = base + 600; a.playbackRate = -1; if (a.playState === 'paused') a.play(); });
        holdT = setTimeout(() => { anims().forEach((a) => (a.playbackRate = 1)); rev = false; off = tl() - (tgt + 1250); pausedAt = null; sync(); if (hov) pause(); }, 600);
        return;
      }
      clearTimeout(holdT); off = tl() - tgt; pausedAt = null; sync();
      if (hov) holdT = setTimeout(() => { if (hov) pause(); }, 1250); // the 600ms feed motion + the ad's own entrance, then hold it
    };
    // 14 Oct §05 B: one wheel gesture (events until 250ms of quiet) or one swipe = one ad; the page never scrolls meanwhile
    let lastW = 0, busyUntil = 0;
    const wheel = (e) => { e.preventDefault(); const n = Date.now(), fresh = n - lastW > 250; lastW = n; if (!fresh || n < busyUntil || Math.abs(e.deltaY) < 2) return; busyUntil = n + 650; go(e.deltaY > 0 ? 1 : -1); };
    const ts = (e) => { ty = e.touches[0].clientY; hov = true; clearTimeout(this._rcLeave); pause(); }, tm = (e) => { if (ty != null) e.preventDefault(); }, te = (e) => { if (ty == null) return; const dy = e.changedTouches[0].clientY - ty; ty = null; if (Math.abs(dy) > 30) { e.preventDefault(); this._swiped = Date.now(); go(dy < 0 ? 1 : -1); } clearTimeout(this._rcLeave); this._rcLeave = setTimeout(() => { hov = false; resume(); }, 3000); };
    this._reelSync = setInterval(() => !this.dead && !document.hidden && sync(), 1600);
    window.seReel = { pause, resume, go, master, sync, at: (ms) => { pausedAt = ((ms % D) + D) % D; sync(); } };
    return (this._rc = {
      ref: (n) => { if (el) { el.removeEventListener('wheel', wheel); el.removeEventListener('touchstart', ts); el.removeEventListener('touchmove', tm); el.removeEventListener('touchend', te); } el = n; if (n) { n.addEventListener('wheel', wheel, { passive: false }); n.addEventListener('touchstart', ts, { passive: true }); n.addEventListener('touchmove', tm, { passive: false }); n.addEventListener('touchend', te, { passive: false }); } },
      enter: () => { hov = true; clearTimeout(holdT); clearTimeout(this._rcLeave); pause(); }, // 14 Oct §05 B: stops at once, the progress segment freezes
      leave: () => { clearTimeout(holdT); clearTimeout(this._rcLeave); this._rcLeave = setTimeout(() => { hov = false; resume(); }, 3000); }, // R6 §03 C: resumes 3s after the pointer leaves
      prev: (e) => { e && e.stopPropagation(); go(-1); },
      next: (e) => { e && e.stopPropagation(); go(1); },
      poster: () => { if (this._swiped && Date.now() - this._swiped < 400) return; this.setState({ posterI: Math.floor(master() / STEP) % 10 }); },
    });
  }
  // Issue 1B: the ad poster: the same ad, bigger, with a short paragraph, key points and the stock line
  posterVals(ads, cs, fmt) {
    const i = this.state.posterI; if (i == null || !ads[i]) return { open: false };
    const [kind, th, k, t, d, c] = ads[i], D = this.state.data, lib = this.state.lib, LK = { scr: 0, frm: 1, flx: 2, board: 3, bat: 4, cam: 5, sml: 6, bcv: 7, rep: 9 }, CAT = { scr: 'SCR', bat: 'BAT', bcv: 'BCV', cam: 'CAM', frm: 'FRM', flx: 'FLX', sml: 'SML' };
    const INFO = {
      scr: ['Every screen we sell is checked on the bench for touch, colour and brightness before it leaves Deira. Pick the grade that fits the job and the budget.', ['Original, OLED, Incell and AAA', 'Quality and manufacturer on every label', 'Touch, colour and brightness tested']],
      bat: ['Batteries for every major brand, checked for capacity and health before they ship, with the connector protected for the trip.', ['Genuine cells in every grade', 'Capacity checked before dispatch', 'Packed safely for shipping']],
      bcv: ['Back covers in every colour, cut to the exact fit of each model, with the camera ring and adhesive where the model needs them.', ['Every colour per model', 'Exact factory fit', 'Camera ring included where needed']],
      cam: ['Front and rear camera modules, focus-tested on the bench so the first photo after the repair is sharp.', ['Front and rear modules', 'Focus tested on the bench', 'For every major brand']],
      frm: ['Mid-frames and housings for every major model: buttons, antenna lines and screw holes exactly where the factory put them.', ['Factory-fit mid-frames', 'Housings for every major model', 'Ready for a full rebuild']],
      wld: ['We ship from Deira every day to the Middle East, Africa, Europe and Asia. Every order is tracked and securely packed; shipping is quoted with your order.', ['Tracked, every order', 'Securely packed by hand', 'Quoted with your order']],
      whs: ['Trade prices for repair shops and resellers once your trade account is approved. Send a bulk list and we quote it the same day.', ['Trade prices for approved accounts', 'Bulk lists quoted the same day', 'Packed and invoiced for export']],
      rep: ['Our bench in Deira replaces screens and batteries and fixes board faults. Every repair is tested before you collect it.', ['Screens, batteries, ports and boards', 'Tested before you collect', 'Price range in the estimator']],
      flx: ['Charging, power and button flex cables for every major model, checked for fit and contact before they ship.', ['Charging-port flex', 'Power and volume flex', 'Checked for fit and contact']],
      sml: ['The small parts that finish the job: buttons, ports, speakers, SIM trays and board components.', ['Buttons and ports', 'Speakers and SIM trays', 'Board components']],
    }[kind] || ['', []];
    const st = CAT[kind] ? cs(CAT[kind]) : null;
    const stock = st ? fmt(st.stock) + ' in stock · sample data' : kind === 'wld' ? 'Ships to the Middle East, Africa, Europe and Asia' : kind === 'whs' ? 'Trade account required' : 'Same-day slots depend on the part · team confirms';
    const shop = { scr: 'Shop screens', bat: 'Shop batteries', bcv: 'Shop back covers', cam: 'Shop cameras', frm: 'Shop frames', flx: 'Shop flex cables', sml: 'Shop small parts', wld: 'Shipping info', whs: 'Wholesale prices', rep: 'Book a repair' }[kind];
    const close = () => this.setState({ posterI: null });
    const wa = 'https://wa.me/' + ((D && D.contact && D.contact.wa) || SITE.contact.whatsapp) + '?text=' + encodeURIComponent('Hi, I saw your ' + k.toLowerCase() + ' ad. ');
    const img = (window.SE_SHOTS && window.SE_SHOTS.byKind(kind, 960)) || (lib && lib.large && LK[kind] != null ? lib.large[LK[kind]] : ''); /* Urgent 1: the pose */
    return { open: true, i, kind, th, k, l1: t.split('\n')[0], l2: t.split('\n')[1], d: d.replace('\n', ' '), p: INFO[0], pts: INFO[1], stock, img, hasImg: !!img, isWld: kind === 'wld', isWhs: kind === 'whs', shop, close, wa,
      go: () => { close(); if (CAT[kind]) this.openFmpAt(null, null, CAT[kind]); else this.go(kind === 'wld' ? 'network' : kind === 'whs' ? 'wholesale' : 'repair'); } };
  }
  // Issue 1B: the hero bar is the search (Ctrl K focuses it)
  openSearch() { const el = document.querySelector('.se-hs-input'); if (!el) return; this.setState({ fmpOpen: false }); if (window.scrollY > 200) jumpTo(0); setTimeout(() => el.focus({ preventScroll: true }), 60); }
  extD(s, D, P, fmt, KIND) {
    const GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    const q = (s.spQ || '').trim().toLowerCase(), nq = q.replace(/[\s-]/g, ''), Br = D ? D.brands : [], Mo = D ? D.models : [], Ca = D ? D.categories : [];
    const has = (str) => str.toLowerCase().replace(/[\s-]/g, '').includes(nq);
    const close = () => this.setState({ spOpen: false });
    const goModel = (m, cat) => () => { this.pushRecent(s.spQ || m.name); this.setState({ spOpen: false }); this.openFmpAt(m.brand_id, m.id, cat || null); };
    let groups = [];
    if (q) {
      const brands = Br.filter((b) => has(b.name)).slice(0, 3).map((b) => ({ t: b.name, s: Mo.filter((m) => m.brand_id === b.id).length + ' models · all parts', r: 'BRAND', rc: '#8C9096', hasLogo: true, brand: b.id, go: () => { this.pushRecent(s.spQ); this.setState({ spOpen: false }); this.openFmpAt(b.id); } }));
      const models = Mo.filter((m) => has(m.name) || m.model_numbers.some(has) || has(m.series)).slice(0, 5).map((m) => ({ t: m.name, s: m.series + ' · ' + m.model_numbers[0] + ' · ' + P.filter((p) => p.model_id === m.id).length + ' parts', r: 'MODEL', rc: '#8C9096', hasPart: true, kind: 'scr', go: goModel(m) }));
      const cats = Ca.filter((c) => has(c.name) || has(c.one)).slice(0, 3).map((c) => ({ t: c.name, s: P.filter((p) => p.category === c.id).length + ' parts in stock list', r: 'CATEGORY', rc: '#8C9096', hasPart: true, kind: KIND[c.id], go: () => { this.pushRecent(s.spQ); close(); this.go('offer'); } }));
      const words = q.split(/\s+/).filter(Boolean);
      const parts = P.filter((p) => { const t = (p.title + ' ' + GN[p.grade] + ' ' + p.id).toLowerCase().replace(/-/g, ' '); return words.every((w) => t.replace(/\s/g, '').includes(w.replace(/-/g, '')) || t.includes(w)); }).sort((a, b) => b.stock_qty - a.stock_qty).slice(0, 6).map((p) => { const m = Mo.find((x) => x.id === p.model_id); return { t: p.title, s: GN[p.grade] + ' · ' + (p.stock_qty ? (p.stock_qty >= 4 ? 'In stock' : 'Only ' + p.stock_qty + ' left') : 'Restocking'), r: 'AED ' + fmt(p.retail_price), rc: '#26282B', hasPart: true, kind: KIND[p.category], go: goModel(m, p.category) }; });
      groups = [['PARTS', parts], ['MODELS', models], ['BRANDS', brands], ['CATEGORIES', cats]].filter(([, it]) => it.length).map(([name, items]) => ({ name, items, n: items.length }));
    }
    let k = 0; const sel = s.spI || 0, flat = [];
    groups.forEach((g) => g.items.forEach((it) => { const idx = k++; flat.push(it); it.bg = idx === sel ? '#FFF4D1' : 'transparent'; it.d = Math.min(idx, 8) * 25 + 'ms'; it.hover = () => this.setState({ spI: idx }); }));
    const rc = this.recent();
    const POP = ['iPhone 13 screen', 'Galaxy A54 battery', 'iPhone 11 battery', 'Redmi Note 13 screen', 'iPhone 15 Pro back glass', 'Tecno Camon 30 screen'];
    const sp = { open: !!s.spOpen, q: s.spQ || '', ref: this.spRef, empty: !q, none: !!q && !flat.length, count: q ? flat.length + ' results · sample data' : 'Type to search ' + fmt(P.length) + ' parts', wa: D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi, do you have: ' + (s.spQ || '')) : '#',
      recentLbl: 'THIS SESSION', recent: rc.map((x) => ({ q: x, go: () => this.setState({ spQ: x, spI: 0 }) })), noRecent: !rc.length,
      popular: POP.map((x, i) => ({ q: x, n: String(i + 1).padStart(2, '0'), go: () => this.setState({ spQ: x, spI: 0 }) })),
      cats: Ca.map((c) => ({ name: c.name, go: () => this.setState({ spQ: c.one, spI: 0 }) })), groups, close,
      setQ: (e) => this.setState({ spQ: e.target.value, spI: 0 }),
      key: (e) => { if (e.key === 'Escape') close(); else if (e.key === 'ArrowDown') { e.preventDefault(); this.setState({ spI: Math.min(flat.length - 1, sel + 1) }); } else if (e.key === 'ArrowUp') { e.preventDefault(); this.setState({ spI: Math.max(0, sel - 1) }); } },
      submit: (e) => { e.preventDefault(); if (flat[sel]) flat[sel].go(); else this.pushRecent(s.spQ); } };
    return { sp, openSearch: () => this.openSearch() };
  }
  // Issue 6: the Model File left the home page; "Brands & models" opens Find My Part (browsing by model lives there).
  // G17: any other target that isn't on this page opens the "Coming soon" card instead of doing nothing.
  go(id) { if (id === 'models') return this.openFmpAt(); const el = document.getElementById(id); if (el) jumpTo(el.getBoundingClientRect().top + window.scrollY - 74); else window.dispatchEvent(new CustomEvent('se:soon', { detail: {} })); }
  renderVals() {
    if (!this._extInit) { this._extInit = true; Object.keys(this.ext).forEach((k) => { if (this.state[k] === undefined) this.state[k] = this.ext[k]; }); }
    const s = this.state, D = s.data, P = D ? D.products : [], fmt = (n) => Math.round(n).toLocaleString('en-US'), cl = (x) => Math.min(1, Math.max(0, x)), pad = (n) => String(n).padStart(2, '0');
    const H = this.hours(), mb = {}; if (D) D.models.forEach((m) => (mb[m.id] = m.brand_id));
    if (this._csD !== D) { this._csD = D; this._cs = {}; this._stats = null; }
    const cs = (cat) => this._cs[cat] || (this._cs[cat] = csRaw(cat)); const csRaw = (cat) => { const ps = P.filter((p) => p.category === cat); return { stock: ps.reduce((a, p) => a + p.stock_qty, 0), brands: new Set(ps.map((p) => mb[p.model_id]).filter(Boolean)).size, min: ps.length ? Math.min(...ps.map((p) => p.retail_price)) : 0, grades: new Set(ps.map((p) => p.grade)).size }; };
    const bars = (q, on, off) => { const n = q >= 10 ? 4 : q >= 4 ? 3 : q >= 1 ? 1 : 0; return [0, 1, 2, 3].map((i) => ({ h: 4 + i * 3, c: i < n ? (n === 1 ? '#E5484D' : on) : off })); };
    const tone = s.tone, dark = true; // 14 Oct §02: the header stays graphite everywhere (it used to turn light over light sections)
    const nav = dark ? { bg: 'linear-gradient(180deg,rgba(61,62,63,.9),rgba(48,50,53,.86))' /* R6 Part A: more opaque, so a lighter blur looks the same */, bd: 'rgba(255,255,255,.10)', ink: '#FFFFFF', sub: '#C9CBCE', pillBg: 'transparent', pillBd: 'rgba(255,255,255,.16)', track: 'rgba(255,255,255,.08)', langOn: '#FFFFFF', langOnInk: '#26282B' }
      : { bg: 'linear-gradient(180deg,rgba(255,255,255,.82),rgba(255,255,255,.74))', bd: 'rgba(26,27,29,.08)', ink: '#26282B', sub: '#3D3E3F', pillBg: 'transparent', pillBd: 'rgba(26,27,29,.12)', track: 'rgba(26,27,29,.08)', langOn: '#26282B', langOnInk: '#FFFFFF' };
    nav.showLinks = s.vw >= 1240;
    const stPop = this.statusPop();
    const st = { pop: stPop, go: (ev) => { ev && ev.preventDefault && ev.preventDefault(); const e = document.getElementById('visit'); if (e) jumpTo(e.getBoundingClientRect().top + window.scrollY - 72); }, short: H.short, dot: H.dot, state: H.state, ping: 'sePing 2.2s ease-out infinite', breathe: 'seLive ' + (H.soon ? '3.2s' : '2.2s') + ' cubic-bezier(.45,0,.55,1) infinite' };
    const noop = (msg) => (e) => { if (e && e.preventDefault) e.preventDefault(); };
    // brand stats
    const stats = this._stats || (this._stats = D ? D.brands.map((b) => { const ids = new Set(D.models.filter((m) => m.brand_id === b.id).map((m) => m.id)), ps = P.filter((p) => ids.has(p.model_id)), cats = {}; ps.forEach((p) => (cats[p.category] = (cats[p.category] || 0) + p.stock_qty)); return { id: b.id, name: b.name, models: ids.size, skus: ps.length, stock: ps.reduce((a, p) => a + p.stock_qty, 0), top: Object.entries(cats).sort((a, c) => c[1] - a[1]).slice(0, 3).map(([c, n]) => ({ name: D.categories.find((x) => x.id === c).name, n: fmt(n) })) }; }) : null) || [];
    const maxS = Math.max(1, ...stats.map((b) => b.stock)), total = P.reduce((a, p) => a + p.stock_qty, 0);
    /* 14 Oct §06: three copies, so no gap at any width */ const BC = { apple: '#F5F5F7', samsung: '#5B7BFF', google: '#4F8CF7', xiaomi: '#FF6900', redmi: '#FF3B30', poco: '#FFD100', huawei: '#FF3B4E', honor: '#7FD0FF', oppo: '#2BCB8B', realme: '#FFC915', oneplus: '#FF3341', vivo: '#5B78FF', infinix: '#5BD96A', tecno: '#3D8BFF', nokia: '#3D8BFF' }; // R6 §04: each brand in its own colour on hover
    const GRP = Object.fromEntries(((D && D.brandGroups) || []).map((g) => [g.id, g.name])), BG = Object.fromEntries(((D && D.brands) || []).map((b) => [b.id, b.group]));
    const rail = [...stats, ...stats, ...stats].map((b, i, all) => { const hv = s.hover && s.hover.id === b.id, l = Math.max(1, Math.round((b.stock / maxS) * 4)), nx = all[(i + 1) % all.length]; return { id: b.id, grpEnd: BG[b.id] !== BG[nx.id] || BG[b.id] === 'standalone', color: hv ? BC[b.id] || '#F7C032' : '#FFFFFF', glow: hv ? 'drop-shadow(0 0 10px rgba(247,192,50,.9))' : 'none', lift: hv ? -3 : 0, raw: b.stock, bars: [0, 1, 2, 3].map((i) => ({ h: 5 + i * 4, c: i < l ? '#F7C032' : 'rgba(255,255,255,.2)' })),
      enter: (e) => { clearTimeout(this.hideT); const h = this.heroRef.current; if (!h) return; const hr = h.getBoundingClientRect(), r = e.currentTarget.getBoundingClientRect(), sc = hr.width / h.offsetWidth || 1; this.setState({ hover: { id: b.id, x: (r.left - hr.left + r.width / 2) / sc } }); }, leave: () => { this.hideT = setTimeout(() => this.setState({ hover: null }), 220); } }; });
    const hb = s.hover && stats.find((b) => b.id === s.hover.id);
    // iPad inventory
    if (!this._ip && D) { let sd = 7; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647; const pool = P.filter((p) => p.stock_qty > 0 && p.model_id); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; } this._ip = pool.slice(0, 26); }
    const KIND = { SCR: 'scr', BAT: 'bat', FLX: 'flx', BCV: 'bcv', FRM: 'frm', CAM: 'cam', SML: 'sml', TLS: 'tls' };
    const ip12 = (this._ip || []).slice(0, 12), ipBase = [...ip12, ...ip12.slice(0, 6)], tap = -1;
    const ipLK = { scr: 0, frm: 1, flx: 2, board: 3, bat: 4, cam: 5, sml: 6, bcv: 7 }, ipTh = s.lib && s.lib.thumb && s.lib.thumb.length >= 8 ? s.lib.thumb : null, ipFit = (bb) => { const [x0, y0, bw, bh, ar] = bb || [0.1, 0.1, 0.8, 0.8, 1], Wi = Math.min(80 / bw, 80 / (bh * ar)), Hi = Wi * ar, q = (v) => Math.round(v * 10) / 10; return { l: q(40 - (x0 + bw / 2) * Wi), t: q(40 - (y0 + bh / 2) * Hi), w: q(Wi), h: q(Hi) }; };
    const ipCards = ipBase.map((p, i) => ({ ...((() => { if (p.shot && window.SE_SHOTS) return { lib: true, css: false, img: window.SE_SHOTS.url(p.shot, 480), f: ipFit([0.02, 0.02, 0.96, 0.96, 0.91]) }; /* R6 E7: screens = box + LCD */ const ix = ipLK[KIND[p.category]], ok = !!ipTh && ix != null && !!ipTh[ix]; return { lib: ok, css: !ok, img: ok ? ipTh[ix] : '', f: ipFit((s.bb || {})[ix]) }; })()), kind: KIND[p.category], shot: p.shot, grade: GN[p.grade], title: p.title, price: 'AED ' + fmt(p.retail_price), stock: p.stock_qty >= 4 ? 'In stock' : 'Only ' + p.stock_qty, bars: bars(p.stock_qty, '#26282B', '#D5D7DA'), ring: i === tap && s.ipToast ? '0 0 0 2px #F7C032,0 8px 22px rgba(247,192,50,.45)' : '0 1px 2px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.05)' }));
    const ipChips = ['All', 'Screens', 'Batteries', 'Covers', 'Cameras'].map((c, i) => { const on = i === 0; return { c, bg: on ? '#26282B' : '#FFFFFF', ink: on ? '#FFFFFF' : '#3D3E3F' }; });
    // phone reel
    const TH = { dark: { bg: 'radial-gradient(110% 70% at 50% 36%,#4B4B49 0%,#303132 52%,#1E1F21 100%)', ink: '#FFFFFF', sub: '#D5D7DA', kick: '#F7C032', kickO: 1, cta: '#F7C032', ctaInk: '#26282B', track: 'rgba(255,255,255,.1)', line: 'rgba(255,255,255,.3)', shc: 'rgba(0,0,0,.55)', shd: 'drop-shadow(0 12px 14px rgba(0,0,0,.45))' },
      yel: { bg: 'radial-gradient(110% 70% at 50% 36%,#FFE291 0%,#F7C032 56%,#F7C032 100%)', ink: '#26282B', sub: '#26282B', kick: '#26282B', kickO: 0.7, cta: '#26282B', ctaInk: '#FFFFFF', track: 'rgba(38,40,43,.1)', line: 'rgba(38,40,43,.3)', shc: 'rgba(110,72,0,.42)', shd: 'drop-shadow(0 12px 14px rgba(110,72,0,.3))' },
      light: { bg: 'radial-gradient(110% 70% at 50% 36%,#FFFFFF 0%,#F6F4F0 50%,#E5E1D9 100%)', ink: '#26282B', sub: '#3D3E3F', kick: '#26282B', kickO: 0.7, cta: '#26282B', ctaInk: '#FFFFFF', track: 'rgba(38,40,43,.1)', line: 'rgba(38,40,43,.3)', shc: 'rgba(90,74,46,.34)', shd: 'drop-shadow(0 12px 14px rgba(90,74,46,.28))' } };
    const ads = [['scr', 'dark', 'LCD & OLED SCREENS', 'Bright like\nday one.', 'Original, OLED,\nIncell and AAA.', 'From AED ' + cs('SCR').min], ['bat', 'yel', 'BATTERIES', 'Full power,\nfully tested.', 'Genuine cells, checked\nbefore they ship.', 'From AED ' + cs('BAT').min],
      ['bcv', 'light', 'BACK COVERS', 'Back to\nlike new.', 'Every colour,\nexact fit.', 'Shop back covers'], ['cam', 'dark', 'CAMERAS', 'Sharp shots,\nfocus tested.', 'Front and rear modules,\nchecked on the bench.', 'Shop cameras'],
      ['frm', 'dark', 'FRAMES & HOUSINGS', 'Factory-fit\nframes.', 'Mid-frames and housings\nfor every major model.', 'Shop frames'], ['wld', 'dark', 'WORLDWIDE DELIVERY', 'From Deira\nto the world.', 'Tracked and securely\npacked, worldwide.', 'Shipping info'],
      ['whs', 'yel', 'WHOLESALE', 'Stock up.\nCost down.', 'Trade prices for\napproved accounts.', 'Wholesale prices'], ['rep', 'dark', 'REPAIRS', 'Cracked today.\nFixed today.', 'Screens replaced and\ntested in Deira.', 'Book a repair'],
      ['flx', 'yel', 'FLEX CABLES', 'Charging again\nin minutes.', 'Charging, power and\nbutton flex cables.', 'Shop flex cables'], ['sml', 'light', 'SMALL PARTS', 'Small parts.\nJob finished.', 'Buttons, ports, speakers\nand board components.', 'Shop small parts']];
    // Issue 1B: fixed colour order, no two neighbouring ads alike (the last is white so the loop back to yellow never repeats)
    const ORDER = ['yel', 'light', 'dark', 'yel', 'light', 'dark', 'yel', 'light', 'dark', 'light']; ads.forEach((a, i) => (a[1] = ORDER[i]));
    // Urgent 1: the reel shows THE pose for every part (carton behind, product in front), not the bare library renders
    const POSE = window.SE_SHOTS ? (this._pose = this._pose || { large: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => window.SE_SHOTS.byIndex(i, 480)) }) : null;
    const REEL_D = 32, LIB = POSE ? POSE.large : s.lib && s.lib.large && s.lib.large.length >= 8 ? s.lib.large : null, LK = { scr: 0, frm: 1, flx: 2, board: 3, bat: 4, cam: 5, sml: 6, bcv: 7 };
    { const src = POSE || s.lib; if (src && src !== this._bbLib) { this._bbLib = src; this.computeBB(src); } }
    const r1 = (v) => Math.round(v * 10) / 10, BB = s.bb || {}, bbFit = (bb, W, H, cx, cy) => { const [x0, y0, bw, bh, ar] = bb || [0.1, 0.1, 0.8, 0.8, 1], Wi = Math.min(W / bw, H / (bh * ar)), Hi = Wi * ar; return { l: r1(cx - (x0 + bw / 2) * Wi), t: r1(cy - (y0 + bh / 2) * Hi), w: r1(Wi), h: r1(Hi), pw: bw * Wi, ph: bh * Hi }; };
    const EO = 'cubic-bezier(.16,1,.3,1)', IO = 'cubic-bezier(.45,0,.55,1)', lk = (n, fr) => this.tlK('hrK' + n, REEL_D, 0, fr), dl = (i) => ' ' + (-((REEL_D - i * 3.2) % REEL_D)).toFixed(2) + 's';
    const SC = 'cubic-bezier(.4,0,.2,1)', SO = 'cubic-bezier(.25,.6,.3,1)', hold = [[0, 'transform:none'], [1.2, 'transform:none']]; for (let k = 1; k <= 14; k++) { const t = 1.2 + k * 0.2, a = (2 * Math.PI * (t - 1.2)) / 4; hold.push([t, 'transform:translateY(' + (-3 * Math.sin(a)).toFixed(2) + 'px)']); } hold.push([REEL_D, hold[hold.length - 1][1]]);
    const K = { card: lk('Card', [[0, 'transform:translateY(100%);visibility:visible', SC], [0.6, 'transform:translateY(0);visibility:visible'], [3.2, 'transform:translateY(0);visibility:visible', SC], [3.8, 'transform:translateY(-100%);visibility:visible'], [3.81, 'transform:translateY(100%);visibility:hidden'], [REEL_D, 'transform:translateY(100%);visibility:hidden']]),
      eb: lk('Eb', [[0, 'opacity:0;transform:translateX(-14px)'], [0.6, 'opacity:0;transform:translateX(-14px)', EO], [0.75, 'opacity:1;transform:none'], [REEL_D, 'opacity:1;transform:none']]),
      l1: lk('L1', [[0, 'transform:translateY(110%)'], [0.64, 'transform:translateY(110%)', EO], [0.94, 'transform:none'], [REEL_D, 'transform:none']]),
      l2: lk('L2', [[0, 'transform:translateY(110%)'], [0.72, 'transform:translateY(110%)', EO], [1.02, 'transform:none'], [REEL_D, 'transform:none']]),
      prod: lk('Prod', [[0, 'opacity:0;transform:translateY(16px)'], [0.7, 'opacity:0;transform:translateY(16px)', SO], [1.2, 'opacity:1;transform:none'], [REEL_D, 'opacity:1;transform:none']]),
      fade: lk('Fade', [[0, 'opacity:0'], [0.7, 'opacity:0', 'ease-out'], [1.2, 'opacity:1'], [REEL_D, 'opacity:1']]),
      bot: lk('Bot', [[0, 'opacity:0;transform:translateY(12px)'], [0.9, 'opacity:0;transform:translateY(12px)', EO], [1.15, 'opacity:1;transform:none'], [REEL_D, 'opacity:1;transform:none']]),
      hold: lk('Hold', hold),
      sheen: lk('Sh', [[0, 'transform:translateX(-170%)'], [1.7, 'transform:translateX(-170%)', IO], [2.9, 'transform:translateX(240%)'], [REEL_D, 'transform:translateX(240%)']]),
      sheenR: lk('ShR', [[0, 'transform:translateX(-170%)'], [0.65, 'transform:translateX(-170%)', IO], [1.1, 'transform:translateX(240%)'], [REEL_D, 'transform:translateX(240%)']]) };
    // R6 §03 C: the glass shine plays on every new ad, 300ms after it settles (0.6s + 0.3s), brighter on dark ads and
    // softer on light ones; the iPad's glass sweeps 1.5s later, never together. Both on the reel's 32s clock.
    const SW0 = 'transform:translate(calc(var(--d) * -.82),calc(var(--d) * -.57))', SW1 = 'transform:translate(calc(var(--d) * .82),calc(var(--d) * .57))', SWO = { dark: 1, yel: 0.7, light: 0.5 };
    const swFr = (lag) => { const fr = [[0, SW0 + ';opacity:0']]; ads.forEach((a, i) => { const t0 = i * 3.2 + 0.9 + lag, o = SWO[a[1]]; if (t0 + 1.12 > REEL_D) return; fr.push([t0, SW0 + ';opacity:' + o, IO], [t0 + 1.1, SW1 + ';opacity:' + o], [t0 + 1.11, SW0 + ';opacity:0']); }); fr.push([REEL_D, SW0 + ';opacity:0']); return fr; };
    const sweepPh = this.tlK('hrSweep', REEL_D, 0, swFr(0)), sweepIp = this.tlK('ipSweep', REEL_D, 0, swFr(1.5));
    const iRep = ads.findIndex((a) => a[0] === 'rep'), iWhs = ads.findIndex((a) => a[0] === 'whs');
    const rqLib = s.lib && s.lib.large && s.lib.large[9] ? s.lib : null, rq = this.hrFilm((rqLib && rqLib.front) || { ph: [0.27, 0.04, 0.46, 0.92], scr: [0.045, 0.022, 0.91, 0.956] }, REEL_D, iRep * 3.2 + 0.9, rqLib ? rqLib.large[9] : '');
    const boxes = [[55, 259], [81, 259], [107, 259], [68, 232], [94, 232], [81, 205]].map(([x, y], j) => { const t = 0.6 + j * 0.1; return { x, y, an: this.tlK('hrC' + j, REEL_D, iWhs * 3.2, [[0, 'opacity:0;transform:translateY(-40px)'], [t, 'opacity:0;transform:translateY(-40px)'], [t + 0.01, 'opacity:1;transform:translateY(-40px)', 'cubic-bezier(.3,.6,.4,1)'], [t + 0.37, 'opacity:1;transform:translateY(0) scale(1)', 'ease-in-out'], [t + 0.43, 'opacity:1;transform:translateY(0) scale(1.02,.97)', 'ease-in-out'], [t + 0.53, 'opacity:1;transform:translateY(0) scale(1)'], [3.85, 'opacity:1;transform:translateY(0) scale(1)'], [3.9, 'opacity:0;transform:translateY(-40px)']]) }; });
    const GL = { dark: ['rgba(255,226,150,.42)', 'rgba(255,226,150,.16)'], yel: ['rgba(255,250,228,.8)', 'rgba(255,250,228,.3)'], light: ['rgba(255,206,96,.3)', 'rgba(255,206,96,.11)'] };
    if (!this._gRef) this._gRef = (el) => { this._gcv = el; if (el) { this._gDrawn = 0; this.loadGlobe(); this.drawGlobe(); } };
    // 14 Oct §05 A: products sit centred between the title (bottom ≈121px) and the description (top 302px): 211.5 vs 228.8
    const PROD_DY = -17.3;
    const reelAll = ads.map(([kind, th, k, t, d, c], i) => { const lib = !!LIB && LK[kind] != null && kind !== 'scr', f = lib ? bbFit(BB[LK[kind]], 96, 137.3, 96, 228.8) : null;
      const pw = kind === 'scr' ? 64.2 : kind === 'rep' ? rq.pw : kind === 'wld' ? 96 : kind === 'whs' ? 90 : lib ? f.pw : 88, ph = kind === 'scr' ? 137.3 : kind === 'rep' ? rq.ph : kind === 'wld' ? 96 : kind === 'whs' ? 99.5 : lib ? f.ph : 120, Lp = Math.max(pw, ph), gD = r1(Lp * 1.3), cy = 228.8;
      const [l1, l2] = t.split('\n'), G = GL[th];
      return { ...TH[th], kind, k, l1, l2, d, c, straight: lib && BB[LK[kind]] && BB[LK[kind]][5] ? 'rotate(' + BB[LK[kind]][5].toFixed(1) + 'deg)' : 'none', so: f ? r1(96 - f.l) + 'px ' + r1(228.8 - f.t) + 'px' : '50% 50%', isLib: lib, isCss: !LIB && !['scr', 'rep', 'whs', 'wld'].includes(kind), isScr: kind === 'scr', isRep: kind === 'rep', isWhs: kind === 'whs', isWld: kind === 'wld', f: f || { l: 0, t: 0, w: 0, h: 0 }, img: lib ? LIB[LK[kind]] : '', rq, boxes: kind === 'whs' ? boxes : [], gRef: this._gRef,
        gD, gL: r1(96 - gD / 2), gT: r1(cy - gD / 2), glow: 'radial-gradient(closest-side,' + G[0] + ' 0%,' + G[1] + ' 50%,rgba(255,255,255,0) 100%)', sW: r1(pw * 0.8), sL: r1(96 - pw * 0.4), sT: r1(228.8 + ph / 2 - 4),
        aCard: K.card + dl(i), aEb: K.eb + dl(i), aL1: K.l1 + dl(i), aL2: K.l2 + dl(i), aProd: K.prod + dl(i), aFade: K.fade + dl(i), aBot: K.bot + dl(i), aHold: K.hold + dl(i), aSheen: 'none', aSheenR: 'none', dy: PROD_DY }; }); // 14 Oct §05 C: no light on the products (only the glass shines)
    const PG = { dark: ['rgba(255,255,255,.16)', 'rgba(255,255,255,.8)'], yel: ['rgba(38,40,43,.16)', 'rgba(38,40,43,.72)'], light: ['rgba(38,40,43,.14)', 'rgba(38,40,43,.62)'] };
    const pgFr = (j) => ads.flatMap((a, i) => [[i * 3.2, 'background:' + PG[a[1]][j]], [i * 3.2 + 3.19, 'background:' + PG[a[1]][j]]]);
    // Issue 1B: step-based progress, one segment per ad: finished ads stay filled, the current one is highlighted
    const pgTrack = this.tlK('hrPgT', REEL_D, 0, pgFr(0)), pgCol = this.tlK('hrPgC', REEL_D, 0, pgFr(1));
    const pgSegs = ads.map((_, i) => { const a0 = i * 3.2, fr = i === 0 ? [[0, 'opacity:1'], [3.2, 'opacity:1'], [3.35, 'opacity:.5'], [REEL_D, 'opacity:.5']] : [[0, 'opacity:0'], [a0, 'opacity:0'], [a0 + 0.15, 'opacity:1'], [a0 + 3.2, 'opacity:1'], [Math.min(REEL_D, a0 + 3.35), i === ads.length - 1 ? 'opacity:1' : 'opacity:.5'], [REEL_D, i === ads.length - 1 ? 'opacity:1' : 'opacity:.5']]; return { a: this.tlK('hrSeg' + i, REEL_D, 0, fr) + ',' + pgCol }; });
    
    // offer
    const OF = [['SCR', 'scr', 'Screens', 'LCD and OLED, in every grade.'], ['BAT', 'bat', 'Batteries', 'Genuine cells, tested before they ship.'], ['FLX', 'flx', 'Flex cables', 'Charging, power and button flex.'], ['BCV', 'bcv', 'Back covers', 'Every colour, exact fit.'], ['FRM', 'frm', 'Frames & housings', 'Mid-frames and housings, factory fit.'], ['CAM', 'cam', 'Cameras', 'Front and rear modules, focus tested.'], ['SML', 'sml', 'Small parts', 'Buttons, ports, speakers, board parts.'], ['TLS', 'tls', 'Tools', 'Screwdrivers, adhesive, opening tools.']];
    const offer = OF.map(([cat, kind, name, d], i) => { const c = cs(cat), t = s.tiltI === i; return { code: cat, kind, name, d, link: 'Shop ' + name.toLowerCase(), from: 'from AED ' + c.min, stockLbl: fmt(c.stock), bars: bars(c.stock, '#26282B', '#D5D7DA'),
      o: s.seen ? 1 : 0, y: s.seen ? 0 : 26, delay: i * 60 + 'ms', go2: t ? 1 : 0, lift: !!t, scan: s.seen ? 'seScan 1.4s ' + (0.2 + i * 0.08) + 's cubic-bezier(.2,.8,.2,1) both' : 'none',
      sh: t ? '0 0 0 1.5px #F7C032,0 18px 40px rgba(26,27,29,.16),0 0 40px rgba(247,192,50,.25)' : '0 1px 2px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.06)',
      enter: () => this.setState({ tiltI: i }),
      move: (ev) => { const el = ev.currentTarget, r = el.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height; el.style.transform = 'perspective(900px) translateY(0px) rotateX(' + ((0.5 - py) * 8).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 10).toFixed(2) + 'deg)'; const mg = el.querySelector('[data-mag]'); if (mg && Math.abs(ev.movementX || 0) + Math.abs(ev.movementY || 0) < 40) { mg.style.transition = 'transform 1.1s cubic-bezier(.22,1,.36,1)'; mg.style.transform = 'translate(' + ((px - 0.5) * 20).toFixed(1) + 'px,' + ((py - 0.5) * 20).toFixed(1) + 'px)'; } const sh = el.querySelector('[data-shine]'); if (sh) sh.style.background = 'radial-gradient(260px circle at ' + Math.round(px * 100) + '% ' + Math.round(py * 100) + '%,rgba(255,255,255,.55),rgba(255,255,255,0) 60%)'; },
      leave: (ev) => { const el = ev.currentTarget; el.style.transform = 'perspective(900px) translateY(0px)'; const mg = el.querySelector('[data-mag]'); if (mg) { mg.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; mg.style.transform = 'none'; } this.setState({ tiltI: null }); }, go: (ev) => ev.preventDefault() }; });
    const services = [['#repair', 'linear-gradient(140deg,#3D3E3F,#26282B)', '#FFFFFF', 'rgba(247,192,50,.35)', 'rgba(247,192,50,.14)', 'REPAIR LAB', 'Fixed, tested, guaranteed.', 'Screens, batteries, ports and board-level faults.', 'iRep'], ['#wholesale', '#F7C032', '#26282B', 'rgba(255,255,255,.6)', '#26282B', 'WHOLESALE', 'Stock up. Cost down.', 'Trade prices for approved accounts, bulk ready.', 'iWhs'], ['#network', '#FFFFFF', '#26282B', 'rgba(247,192,50,.35)', '#26282B', 'WORLDWIDE DELIVERY', 'From Deira to the world.', 'Tracked and securely packed, to four regions.', 'iWld']]
      .map(([href, bg, ink, glow, iconBg, k, t, d, ic], i) => ({ href, bg, ink, glow, iconBg, k, t, d, cta: ['Repair Lab', 'Wholesale', 'Shipping'][i], btnBg: i === 1 ? '#26282B' : '#F7C032', btnInk: i === 1 ? '#FFFFFF' : '#26282B', iRep: ic === 'iRep', iWhs: ic === 'iWhs', iWld: ic === 'iWld', o: s.seen ? 1 : 0, y: s.seen ? 0 : 24, delay: 500 + i * 80 + 'ms', go: (ev) => { ev.preventDefault(); this.go(href.slice(1)); } }));
    const typedWords = this.TYPED.map((t, i) => ({ t, d: (i * 2.8).toFixed(1) + 's' }));
    const wa = D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.') : '#';
    return {
      rootRef: this.rootRef, reelRef: this.reelRef, heroRef: this.heroRef, railRef: this.railRef, tdRef: this.tdRef, offerRef: this.offerRef,
      nav, st,
      goTop: (ev) => { ev.preventDefault(); jumpTo(0); }, openFmp: () => this.go('offer'), arabic: () => window.seI18n && window.seI18n.set('ar'), english: () => window.seI18n && window.seI18n.set('en'), isAr: this.state.lang === 'ar', bench: noop(), openCart: noop(), staff: noop(), openMap: noop(), goOffer: (ev) => { ev.preventDefault(); this.go('offer'); },
      navLinks: [['Shop', 'offer'], ['Repair', 'repair'], ['Wholesale', 'wholesale'], ['Contact', 'visit']].map(([label, id]) => ({ label, href: '#' + id, go: (ev) => { ev.preventDefault(); this.go(id); } })),
      cartPop: 1, cartCount: 0, 
      z: s.z.toFixed(4), heroH: Math.round(1030 * s.z), glowX: 560, glowY: 420, clock: H.clock, ipQuery: 'Search 1,000+ parts', ipCart: s.ipCart, ipCartN: (s.ipCart || 2) + (s.ipBuys || 0), ipToastO: s.ipToast ? 1 : 0, ipToastY: s.ipToast ? 0 : 48, ipChips, ipCards, ipAnim: this.kf('seIpScroll', Array.from({ length: 7 }, (_, i) => -i * 195), 2.8, 'Y') + ' 16.8s',
      showRest: !window.SE_ONLY, reel: reelAll, pgTrack, pgSegs, sweepPh, sweepIp, ipFrom: (() => { const ps = P.filter((p) => p.category === 'SCR' && p.shot === 'samsung-sp'); return ps.length ? 'from AED ' + Math.min(...ps.map((p) => p.retail_price)) : ''; })(), reelCtl: this.reelCtl(), poster: this.posterVals(ads, cs, fmt), openFmpAt: (b, m, c, q) => this.openFmpAt(b, m, c, q), ipCartP: Math.max(0, (s.ipCart || 2) + (s.ipBuys || 0) - 1), ipOdo: s.ipBuys ? 'ipOdo .35s cubic-bezier(.2,.8,.2,1) both' : 'none', ipToastName: s.ipToastName || 'Part',
      typedWords, trust: ['Tested before it ships', 'Warranty on every grade', 'Trusted since 2003'],
      heroBtns: [{ label: 'Browse all parts', href: '#offer', target: '_self', go: (ev) => { ev.preventDefault(); this.go('offer'); }, bg: '#F7C032', bd: '#F7C032', ink: '#26282B', iconBg: 'rgba(26,27,29,.12)', iSearch: true }, { label: 'Trade prices', href: '#wholesale', target: '_self', go: (ev) => { ev.preventDefault(); this.go('wholesale'); }, bg: 'rgba(255,255,255,.04)', bd: 'rgba(255,255,255,.32)', ink: '#FFFFFF', iconBg: 'rgba(247,192,50,.14)', iTag: true }, { label: 'Book a repair', href: '#repair', target: '_self', go: (ev) => { ev.preventDefault(); this.go('repair'); }, bg: 'rgba(255,255,255,.04)', bd: 'rgba(255,255,255,.32)', ink: '#FFFFFF', iconBg: 'rgba(247,192,50,.14)', iWrench: true }, { label: 'WhatsApp us', href: 'https://wa.me/' + SITE.contact.whatsapp, target: '_blank', go: () => {}, bg: 'rgba(255,255,255,.04)', bd: 'rgba(255,255,255,.32)', ink: '#FFFFFF', iconBg: 'rgba(247,192,50,.14)', iWa: true }],
      rail, railPlay: s.hover ? 'paused' : 'running', totalRaw: total, brandCount: stats.length, modelCount: D ? D.models.length : 0, hasHover: !!hb,
      panel: hb ? { id: hb.id, x: Math.min(1100, Math.max(20, s.hover.x - 160)), name: hb.name, group: BG[hb.id] && BG[hb.id] !== 'standalone' ? GRP[BG[hb.id]] : '', models: hb.models, skus: hb.skus, stock: fmt(hb.stock), top: hb.top, go: () => this.openFmpAt(hb.id) } : { id: 'apple', x: 0, name: '', group: '', models: 0, skus: 0, stock: '0', top: [], go: () => {} },
      panelEnter: () => clearTimeout(this.hideT), panelLeave: () => { this.hideT = setTimeout(() => this.setState({ hover: null }), 220); },
      offer, services,
      ...this.memo('A', s, () => this.extA(s, D, P, fmt, cl, pad, bars, KIND)),
      ...this.memo('B', s, () => this.extB(s, D, P, fmt, cl, pad)),
      ...this.memo('C', s, () => this.extC(s, D, P, fmt, cl, pad, bars, KIND)),
      ...this.extD(s, D, P, fmt, KIND),
      glow: { bx: s.glow ? s.glow.bx : 900, by: s.glow ? s.glow.by : 300, dx: s.glow ? s.glow.dx : 400, dy: s.glow ? s.glow.dy : 300, tx: s.glow ? s.glow.tx : 400, ty: s.glow ? s.glow.ty : 300,
        move: (ev) => { const sec = ev.currentTarget, g = sec.querySelector('[data-glow]'); if (!g) return; const r = sec.getBoundingClientRect(); g.style.left = Math.round(ev.clientX - r.left) + 'px'; g.style.top = Math.round(ev.clientY - r.top) + 'px'; } }
    };
  }
}

export default Component;
