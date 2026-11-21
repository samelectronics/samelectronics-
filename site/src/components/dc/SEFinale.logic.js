// @ts-nocheck
/* eslint-disable */
// Finale (Issue 17, rebuilt 13 Oct 2026): "A phone on your bench? We have the part." Styles in src/styles/finale.css.
// The film is CSS keyframes started when the section is seen (current → power → neon → message); the logic only
// starts it, counts the stats up once and offers a capture hook (window.seFinale(t) freezes the film at t seconds).
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';
import { site as SITE } from '@/content/facts';

class Component extends DCLogic {
  state = { on: false };
  secRef = React.createRef();
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { clearTimeout(this.cT); cancelAnimationFrame(this.raf); this.setState({ on: false }); }); // 14 Oct · H-G2: replay from the start
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.on) { this.setState({ on: true }); clearTimeout(this.cT); } /* R15: the numbers count when the stats band itself comes into view (below) */ }, { threshold: [0, 0.08, 0.16, 0.25] });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    /* R15 (owner: "where is the entry animation for the numbers, counting up?"): they sit at 0 until the band is really on
       screen, then count up; again every time it comes back */
    this.sio = new IntersectionObserver(([e]) => { const r = this.secRef.current; if (!r) return; if (e.isIntersecting) { cancelAnimationFrame(this.raf); this.count(); } else r.querySelectorAll('[data-fn]').forEach((el) => (el.textContent = '0')); }, { threshold: 0.6 });
    setTimeout(() => { const st = this.secRef.current && this.secRef.current.querySelector('.fz4-stats'); if (st) this.sio.observe(st); }, 60);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seFinale = (t) => { this.setState({ on: true }, () => { const R = this.secRef.current; if (!R) return; R.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000 + (a.effect && a.effect.getTiming ? 0 : 0); }); if (t > 3) R.querySelectorAll('[data-fn]').forEach((el) => (el.textContent = Number(el.getAttribute('data-fn')).toLocaleString('en-US'))); }); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); window.removeEventListener('se:lang', this.onLang); clearTimeout(this.cT); cancelAnimationFrame(this.raf); this.io && this.io.disconnect(); this.sio && this.sio.disconnect(); }
  count() { const r = this.secRef.current; if (!r) return; const els = [...r.querySelectorAll('[data-fn]')], t0 = performance.now();
    const f = (t) => { const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3); els.forEach((el) => (el.textContent = Math.round(Number(el.getAttribute('data-fn')) * e).toLocaleString('en-US'))); if (k < 1) this.raf = requestAnimationFrame(f); };
    this.raf = requestAnimationFrame(f); }
  renderVals() {
    const D = window.SE_DATA, L = window.seI18n, line = 'A phone on your bench? We have the part.';
    const head = (L && L.lang() !== 'en' ? L.tr(line) : line).split(' '); // word by word, in the visitor's language
    // the numbers come from the live catalogue, rounded down so the "+" stays true
    const nB = D ? D.brands.length : 15, nM = D ? Math.floor(D.models.length / 50) * 50 : 800, nP = D ? Math.floor(D.products.reduce((a, x) => a + Math.max(0, x.stock_qty || 0), 0) / 100) * 100 : 7000;
    return { secRef: this.secRef, on: this.state.on, head, nB, nM, nP,
      wa: D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.') : '#',
      dir: SITE.contact.mapsLink,
      browse: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'offer' } })); } };
  }
}

export default Component;
