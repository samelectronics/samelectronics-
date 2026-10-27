// @ts-nocheck
/* eslint-disable */
// Meet Samsoom, "Ask at 3 a.m." (Issue 14, 13 Oct 2026). Styles in src/styles/meet.css.
// Five demo conversations loop in the graphite chat. Each runs on its own clock (question → typing → answer →
// rich card → hold), and Samsoom's mood follows it (thinking while typing, found / happy on the answer, and a rare
// wink, kiss or dabke step). His eyes follow the cursor through CSS variables written on mousemove.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

const T_Q = 0, T_TYPE = 0.7, T_ANS = 2.3, T_CARD = 2.7, DUR = 7.4;
export const CONVOS = [
  { q: 'Do you have a Galaxy A54 battery?', a: 'Yes. Original grade, in stock in Deira.', card: 'product', land: 'found' },
  { q: 'Which grade should I pick for an iPhone 13 screen?', a: 'Depends on your budget. Every grade is labelled on your order:', card: 'grades', land: 'happy' },
  { q: 'Are you open right now?', a: '', card: 'hours', land: 'wink' },
  { q: 'Do you have trade prices?', a: 'Yes, for approved trade accounts. Prices step down as your order grows:', card: 'trade', land: 'kiss' },
  { q: 'Can you ship to Iraq?', a: 'Yes. Baghdad, Basra and Erbil every week.', card: 'ship', land: 'dabke' },
];
export const DRIFT = ['Is the iPhone 15 Pro screen in stock?', 'Do you sell Pixel 8 cameras?', 'Can I collect today?', 'What is Incell?', 'Do you ship to Nigeria?', 'Back glass for S24 Ultra?', 'Bulk price for 100 batteries?'];

class Component extends DCLogic {
  secRef = React.createRef();
  state = { seen: false, ci: 0, t: 0, lib: null, data: window.SE_DATA || null, now: Date.now() };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.t = -1.2; this._st = null; this.setState({ seen: false, ci: 0, t: 0 }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk });
    this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.alive = true; this.t = -1.2; let last = performance.now(); // the chat starts 1.2s after the arrival
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true }); }, { threshold: 0.3 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    const loop = (now) => { if (!this.alive) return; const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (this.vis && this.state.seen && !document.hidden && this.ov == null) { this.t += dt; if (this.t >= DUR) { this.t = 0; this.setState({ ci: (this.state.ci + 1) % CONVOS.length, now: Date.now() }); }
        const st = this.stage(this.t); if (st !== this._st) { this._st = st; this.setState({ t: this.t }); } }
      this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    // eyes follow the cursor
    this.onMove = (e) => { if (!this.vis) return; const R = this.secRef.current, face = R && R.querySelector('.sl-body'); if (!face) return; const r = face.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / 500, dy = (e.clientY - (r.top + r.height * 0.4)) / 500; R.style.setProperty('--lx', Math.max(-1, Math.min(1, dx)).toFixed(3)); R.style.setProperty('--ly', Math.max(-1, Math.min(1, dy)).toFixed(3)); };
    window.addEventListener('mousemove', this.onMove, { passive: true });
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seMeet = (ci, t) => { this.ov = t; this.t = t; this._st = null; this.setState({ seen: true, ci, t }); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); this.alive = false; cancelAnimationFrame(this.raf); clearInterval(this.dIv); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); window.removeEventListener('mousemove', this.onMove); window.removeEventListener('se:lang', this.onLang); }
  stage(t) { return t < T_Q ? 0 : t < T_TYPE ? 1 : t < T_ANS ? 2 : t < T_CARD ? 3 : t < T_CARD + 1.2 ? 4 : 5; }
  hours() { const D = this.state.data, H = D ? D.hours : {}, d = new Date(this.state.now), g = new Date(d.getTime() + d.getTimezoneOffset() * 6e4 + 4 * 36e5), m = g.getHours() * 60 + g.getMinutes();
    const pad = (n) => String(n).padStart(2, '0'), hm = (x) => pad(Math.floor(x / 60)) + ':' + pad(x % 60), today = H[g.getDay()] || [];
    const open = today.some(([a, b]) => m >= a && m < b), nxt = today.find(([a]) => a > m);
    return { open, line: today.length ? today.map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') : 'Closed today', state: open ? 'Open now' : nxt ? 'Opens at ' + hm(nxt[0]) : 'Closed now · see you tomorrow', clock: hm(m) }; }
  renderVals() {
    const s = this.state, D = s.data, lib = s.lib, P = D ? D.products : [], GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    const img = (k) => (window.SE_SHOTS && window.SE_SHOTS.byIndex(k, 480)) || (lib && lib.large ? lib.large[k] : ''), thumb = (k) => (window.SE_SHOTS && window.SE_SHOTS.byIndex(k, 240)) || (lib && lib.thumb ? lib.thumb[k] : ''); /* Urgent 1: the pose */ // R6 E7: screens = box + LCD
    const bat = P.find((p) => p.id === 'SE-A54-BAT-OR'), scr = P.filter((p) => p.id.startsWith('SE-IP13-SCR')).sort((a, b) => b.retail_price - a.retail_price);
    const card = (k) => k === 'product' ? { k, img: img(4), title: bat ? bat.title : 'Galaxy A54 Battery', grade: GN.OR, price: 'AED ' + (bat ? bat.retail_price : 85), stock: bat ? bat.stock_qty + ' in stock · Deira' : '', add: () => window.dispatchEvent(new CustomEvent('se:cart', { detail: { id: 'SE-A54-BAT-OR' } })) }
      : k === 'grades' ? { k, rows: scr.map((p) => ({ g: GN[p.grade], p: 'AED ' + p.retail_price, img: thumb(0) })) }
      : k === 'hours' ? { k, ...this.hours() }
      : k === 'trade' ? { k, tiers: [['10+', '−12%'], ['50+', '−18%'], ['100+', '−22%'], ['500+', '−28%']], go: () => window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'wholesale' } })) }
      : { k, from: 'Dubai · Deira', to: 'Baghdad, Iraq', eta: '3–5 days' };
    // the chat: a welcome line, the previous conversation (complete) and the current one up to its stage
    const st = this.stage(s.t), msgs = [{ id: 'w', who: 'bot', t: 'Hi, I’m Samsoom. Ask me about a part, a grade, shipping, or our hours.' }];
    const push = (ci, upto) => { const c = CONVOS[ci]; msgs.push({ id: 'q' + ci, who: 'me', t: c.q }); if (upto >= 2 && upto < 3) msgs.push({ id: 'ty' + ci, who: 'typing' }); if (upto >= 3) msgs.push({ id: 'a' + ci, who: 'bot', t: c.card === 'hours' ? '' : c.a, card: upto >= 4 ? card(c.card) : null }); };
    const prev = (s.ci + CONVOS.length - 1) % CONVOS.length; push(prev, 5);
    if (st >= 1) push(s.ci, st);
    const c = CONVOS[s.ci], mood = !s.seen ? 'idle' : st <= 1 ? 'idle' : st === 2 ? 'think' : st === 3 ? 'found' : st === 4 ? c.land : st === 5 && s.t > DUR - 1.2 ? 'idle' : c.land === 'found' ? 'happy' : c.land;
    return { secRef: this.secRef, seen: s.seen, mood: s.seen && this.t < 0.2 && this.ov == null ? 'wave' : mood, front: lib && lib.front ? lib.front : null, phone: img(9), msgs, ci: s.ci, n: CONVOS.length, flyQ: st === 1 ? c.q : '',
      ask: () => window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })), drift: DRIFT };
  }
}

export default Component;
