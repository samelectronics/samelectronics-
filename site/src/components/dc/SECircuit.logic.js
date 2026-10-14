// @ts-nocheck
/* eslint-disable */
// Sam Circuit membership, "The Charging Station" (Issue 13, 13 Oct 2026). Styles in src/styles/circuit.css.
// One number drives everything: the member's spend (sample). It maps to the battery level through the four tier
// marks (25 / 50 / 75 / 100%), so the fill always shows the real level. The level is tweened and written to the DOM
// each frame; crossing a mark flashes the battery, pops the tier badge and flips that tier's reward card.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

// sample thresholds (owner to confirm): the spend at each tier mark
export const MARKS = [[0, 0], [200, 0.25], [1000, 0.5], [5000, 0.75], [15000, 1]];
export const REQ = ['Your first order', 'AED 1,000 spent', 'AED 5,000 spent', 'AED 15,000 spent'];
export const PERKS = [['Saved parts and order history'], ['Priority stock alerts', 'Early access to deals'], ['Trade price tiers', 'Bulk quotes first'], ['A dedicated account manager', 'First pick of incoming shipments']];
const DEMO = 2920; // 62%
const levelOf = (s) => { for (let i = 1; i < MARKS.length; i++) if (s <= MARKS[i][0]) { const [a, la] = MARKS[i - 1], [b, lb] = MARKS[i]; return la + (lb - la) * ((s - a) / (b - a)); } return 1; };
const fmt = (n) => Math.round(n).toLocaleString('en-US');

class Component extends DCLogic {
  secRef = React.createRef();
  cardRef = React.createRef();
  state = { seen: false, spend: DEMO, tier: -1, pop: 0, flash: 0, pulse: 0, on: true };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { cancelAnimationFrame(this.tRaf); this.lv = 0; this.paint(); this.setState({ seen: false, tier: -1, on: true, spend: 2920 }); }); // 14 Oct · H-G2: replay from the start
    this.lv = 0; this.alive = true;
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.seen) { this.setState({ seen: true }); setTimeout(() => this.tweenTo(levelOf(this.state.spend), 1400), 1000); } }, { threshold: 0.25 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seCircuit = (spend, instant) => { this.setState({ seen: true, spend, on: true }); if (instant) { this.lv = levelOf(spend); this.paint(); this.syncTier(true); } else this.tweenTo(levelOf(spend), 900); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); this.alive = false; cancelAnimationFrame(this.tRaf); this.io && this.io.disconnect(); window.removeEventListener('se:lang', this.onLang); }
  componentDidUpdate() { this.paint(); }
  tweenTo(to, ms) { cancelAnimationFrame(this.tRaf); const a = this.lv, t0 = performance.now();
    const step = (now) => { if (!this.alive) return; const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; this.lv = a + (to - a) * e; this.paint(); this.syncTier(); if (k < 1) this.tRaf = requestAnimationFrame(step); };
    this.tRaf = requestAnimationFrame(step); }
  paint() { const R = this.secRef.current; if (!R) return; const lv = this.lv, pct = Math.round(lv * 100) + '%';
    const f = R.querySelector('[data-c="fill"]'); if (f) f.style.transform = 'translateY(' + ((1 - lv) * 100).toFixed(2) + '%)';
    R.querySelectorAll('[data-c="pct"]').forEach((e) => { if (e.textContent !== pct) e.textContent = pct; });
    const rf = R.querySelector('[data-c="refl"]'); if (rf) rf.style.opacity = (0.25 + lv * 0.75).toFixed(3); }
  syncTier(silent) { const t = [0.25, 0.5, 0.75, 1].reduce((a, m, i) => (this.lv >= m - 0.001 ? i : a), -1);
    if (t !== this.state.tier) { const up = t > this.state.tier; this.setState({ tier: t, pop: up && !silent ? this.state.pop + 1 : this.state.pop, flash: up && !silent ? this.state.flash + 1 : this.state.flash }); } }
  add(n) { const spend = this.state.spend + n; this.setState({ spend, on: true, pulse: this.state.pulse + 1 }); setTimeout(() => this.tweenTo(levelOf(spend), 900), 380); }
  reset() { this.setState({ spend: 0, on: false }); this.tweenTo(0, 1100); }
  renderVals() {
    const s = this.state, TN = (window.SE_DATA && window.SE_DATA.tiers) || ['Connected', 'Charged', 'Supercharged', 'Fully Charged'];
    const nextI = s.tier + 1, lv = levelOf(s.spend);
    const tiers = TN.map((name, i) => { const need = MARKS[i + 1][0], togo = Math.max(0, need - s.spend), un = i <= s.tier;
      const prev = MARKS[i][0], prog = un ? 1 : Math.max(0, Math.min(1, (s.spend - prev) / (need - prev)));
      return { name, i, req: REQ[i], un, cur: i === s.tier, next: i === nextI, chip: un ? 'Unlocked' : togo ? 'AED ' + fmt(togo) + ' to go' : 'Charging…', prog: prog.toFixed(3), perks: PERKS[i] }; });
    return { secRef: this.secRef, cardRef: this.cardRef, seen: s.seen, on: s.on, tiers, tierName: s.tier >= 0 ? TN[s.tier] : 'Not connected yet', popName: s.tier >= 0 ? TN[s.tier] : '', pop: s.pop, flash: s.flash, pulse: s.pulse,
      spend: 'AED ' + fmt(s.spend), level: Math.round(lv * 100) + '%',
      add: (n) => () => this.add(n), reset: () => this.reset(),
      join: () => window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Sam Circuit', text: 'Sam Circuit accounts open with My Bench, coming soon.' } })),
      tilt: (e) => { const c = this.cardRef.current; if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = 'rotateX(' + ((0.5 - y) * 16).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 20).toFixed(2) + 'deg)'; c.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--ly', (y * 100).toFixed(1) + '%'); },
      untilt: () => { const c = this.cardRef.current; if (c) { c.style.transform = ''; c.style.setProperty('--lx', '30%'); c.style.setProperty('--ly', '20%'); } } };
  }
}

export default Component;
