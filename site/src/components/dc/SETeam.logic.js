// @ts-nocheck
/* eslint-disable */
// The team, "Staff Badges" (Issue 11, 13 Oct 2026). Styles in src/styles/team.css.
// Five PVC badges hang from a brushed rail on lanyards. Each is a damped pendulum (angle in degrees) plus a lanyard
// stretch spring for the drop-in. Idle forcing keeps each one swaying a little differently; the mouse nudges them
// away; a click swings a badge up and flips it. An order ticket rides the rail and lights the badges in order.
import React from 'react';
import { DCLogic } from '@/dc/runtime';

export const ROLES = [
  { code: 'T01', role: 'Parts Advisor', mono: 'PA', bio: 'Helps you find the exact part and grade, in person.', help: ['Finding the right part for your model', 'Choosing between grades', 'Checking stock on the spot'] },
  { code: 'T02', role: 'Parts Flow Controller', mono: 'PF', bio: 'Receives, sorts and prepares every part before it reaches you.', help: ['Order status and preparation', 'Bulk orders and packing', 'Incoming stock and arrivals'] },
  { code: 'T03', role: 'Bench Engineer', mono: 'BE', bio: 'Repairs, tests and certifies every device on our bench.', help: ['Repair questions and timing', 'Testing and quality checks', 'Warranty on repaired parts'] },
  { code: 'T04', role: 'Finance & Checkout', mono: 'FC', bio: 'Handles invoices, payments and trade accounts.', help: ['Invoices and receipts', 'Payment options', 'Trade account questions'] },
  { code: 'T05', role: 'Founder', mono: 'TA', founder: true, bio: '', help: ['Partnerships and distribution', 'Large trade agreements', 'Feedback on our service'] },
];
const K = 9, C = 1.15, G = 2600, KY = 900, CY = 26; // pendulum (1/s²), damping, gravity and lanyard stretch (px)
const CYCLE = 12, STOP = 0.42, MOVE = 0.26; // the order ticket: every 12s, a short stop at each badge

class Component extends DCLogic {
  secRef = React.createRef();
  state = { seen: false, flip: -1 };
  componentDidMount() {
    this.b = ROLES.map((_, i) => ({ th: 0, w: 0, y: -720, vy: 0, dropAt: Infinity, ph: i * 1.7 + 0.4, om: 2.3 + i * 0.17, amp: 3.2 + (i % 3) * 0.8 }));
    this.mx = null; this.alive = true; this.t = 0; let last = performance.now();
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.start(); }, { threshold: 0.2 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    const loop = (now) => { if (!this.alive) return; const dt = Math.min(0.033, (now - last) / 1000); last = now; if (this.vis && !document.hidden) { this.t += dt; this.step(dt); this.paint(); } this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    this.onResize = () => this.measure(); window.addEventListener('resize', this.onResize); setTimeout(() => this.measure(), 120);
    window.seTeam = (t, flip) => { if (!this.state.seen) this.start(); this.b.forEach((b) => { b.y = 0; b.vy = 0; b.th = 0; b.w = 0; b.dropAt = -1; }); this.t0 = this.t - t; if (flip != null) this.setState({ flip }); this.paint(); };
  }
  componentWillUnmount() { this.alive = false; cancelAnimationFrame(this.raf); this.io && this.io.disconnect(); window.removeEventListener('se:lang', this.onLang); window.removeEventListener('resize', this.onResize); }
  start() { this.setState({ seen: true }); this.b.forEach((b, i) => { b.dropAt = this.t + 0.3 + i * 0.12; }); this.t0 = this.t; }
  step(dt) {
    const t = this.t, R = this.secRef.current;
    this.b.forEach((b, i) => {
      if (t < b.dropAt) return;
      // lanyard: free fall while slack, a stiff damped spring once it is stretched
      const ay = G - (b.y > 0 ? KY * b.y + CY * b.vy : 0); b.vy += ay * dt; b.y += b.vy * dt;
      if (!b.landed && b.y > 0) { b.landed = true; b.w += (i % 2 ? -1 : 1) * 26; } // lands with a swing
      // pendulum: idle forcing (each its own rhythm) + the mouse nudging it away
      let F = b.amp * Math.sin(b.om * t + b.ph);
      if (this.mx != null && this.cx) { const dx = this.cx[i] - this.mx, ady = Math.abs(this.my - 300); if (Math.abs(dx) < 170 && ady < 280) F += -Math.sign(dx || 1) * (170 - Math.abs(dx)) * 0.55; }
      b.w += (-K * b.th - C * b.w + F) * dt; b.th += b.w * dt;
    });
  }
  paint() {
    const R = this.secRef.current; if (!R) return;
    if (!this._g) { this._g = [...R.querySelectorAll('[data-g]')]; this._h = [...R.querySelectorAll('[data-holo]')]; this._c = [...R.querySelectorAll('.tm-card')]; }
    if (!this._g[0] || !this._g[0].isConnected) { this._g = null; return; }
    this.b.forEach((b, i) => { const g = this._g[i], h = this._h[i]; if (!g) return; const y = this.t < b.dropAt ? -720 : b.y;
      if (b.pth != null && Math.abs(b.th - b.pth) < 0.06 && Math.abs(y - b.py) < 0.3) return; b.pth = b.th; b.py = y; // sub-pixel changes are skipped (fewer repaints at idle)
      g.style.transform = 'translateY(' + y.toFixed(1) + 'px) rotate(' + b.th.toFixed(2) + 'deg)';
      if (h) h.style.transform = 'translateX(' + (b.th * 9 + Math.sin(this.t * 0.7 + i) * 8).toFixed(1) + '%)'; });
    // the order ticket rides the rail: Parts Advisor → Parts Flow Controller → Bench Engineer → Finance & Checkout → Founder
    const tk = this.q('ticket'); if (!tk || !this.cx) return;
    const tc = this.t0 == null ? -1 : (this.t - this.t0 - 1.8) % CYCLE, legs = ROLES.length, dur = legs * (MOVE + STOP) + MOVE + 0.2;
    let x = -120, lit = -1, op = 0;
    if (tc >= 0 && tc < dur) { op = 1; const k = Math.floor(tc / (MOVE + STOP)), f = tc - k * (MOVE + STOP);
      if (k >= legs) { x = this.cx[legs - 1] + ((tc - legs * (MOVE + STOP)) / (MOVE + 0.2)) * 260; op = 1 - (tc - legs * (MOVE + STOP)) / (MOVE + 0.2); }
      else { const from = k === 0 ? this.cx[0] - 200 : this.cx[k - 1], to = this.cx[k], m = Math.min(1, f / MOVE), e = m < 0.5 ? 2 * m * m : 1 - Math.pow(-2 * m + 2, 2) / 2; x = from + (to - from) * e; if (f >= MOVE) lit = k; } }
    tk.style.transform = 'translateX(' + x.toFixed(1) + 'px)'; tk.style.opacity = op.toFixed(2);
    this._c.forEach((c, i) => { const on = i === lit; if (c.classList.contains('lit') !== on) c.classList.toggle('lit', on); });
  }
  q(k) { const R = this.secRef.current; return R ? R.querySelector('[data-s="' + k + '"]') : null; }
  measure() { const R = this.secRef.current; if (!R) return; const st = R.querySelector('.tm-stage'); if (!st) return; const sr = st.getBoundingClientRect();
    this.cx = [...R.querySelectorAll('[data-g]')].map((g) => { const r = g.parentElement.getBoundingClientRect(); return r.left + r.width / 2 - sr.left; }); this.sl = sr.left; this.st = sr.top; }
  componentDidUpdate() { this._g = null; this.measure(); }
  renderVals() {
    const F = (this.props.$facts || {}).founder || {}, yr = new Date().getFullYear(), since = F.since || 2003, name = F.name || 'Tarek Alchoumari';
    const wa = (this.props.$facts || {}).contact ? 'https://wa.me/' + String(this.props.$facts.contact.whatsapp || '').replace(/\D/g, '') : '#';
    return { secRef: this.secRef, seen: this.state.seen,
      badges: ROLES.map((r, i) => ({ ...r, i, name: r.founder ? name : '', years: r.founder ? yr - since + ' years with us' : '', bio: r.founder ? name + ', leading the business since ' + since + '.' : r.bio,
        ask: r.founder ? 'Ask ' + name.split(' ')[0] : 'Ask our ' + r.role, flipped: this.state.flip === i,
        href: wa + (wa !== '#' ? '?text=' + encodeURIComponent('Hi Sam Electronics, I have a question for the ' + (r.founder ? 'founder' : r.role) + '.') : ''),
        flip: (e) => { if (e.target.closest('a')) return; this.b[i].w += 34; const c = e.currentTarget; c.classList.add('anim'); clearTimeout(c._t); c._t = setTimeout(() => c.classList.remove('anim'), 1100); const was = this.state.flip; if (was >= 0 && was !== i) { const o = this._c && this._c[was]; if (o) { o.classList.add('anim'); clearTimeout(o._t); o._t = setTimeout(() => o.classList.remove('anim'), 1100); } } this.setState({ flip: was === i ? -1 : i }); } })),
      move: (e) => { if (!this.cx) this.measure(); const st = this.secRef.current?.querySelector('.tm-stage'); if (!st) return; const r = st.getBoundingClientRect(); this.mx = e.clientX - r.left; this.my = e.clientY - r.top; },
      leave: () => { this.mx = null; },
      ref: () => this.measure() };
  }
}

export default Component;
