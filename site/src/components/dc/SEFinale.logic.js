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
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.on) { this.setState({ on: true }); clearTimeout(this.cT); this.cT = setTimeout(() => this.count(), 2600); } }, { threshold: 0.3 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seFinale = (t) => { this.setState({ on: true }, () => { const R = this.secRef.current; if (!R) return; R.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000 + (a.effect && a.effect.getTiming ? 0 : 0); }); if (t > 3) R.querySelectorAll('[data-fn]').forEach((el) => (el.textContent = Number(el.getAttribute('data-fn')).toLocaleString('en-US'))); }); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); window.removeEventListener('se:lang', this.onLang); clearTimeout(this.cT); cancelAnimationFrame(this.raf); this.io && this.io.disconnect(); }
  count() { const r = this.secRef.current; if (!r) return; const els = [...r.querySelectorAll('[data-fn]')], t0 = performance.now();
    const f = (t) => { const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3); els.forEach((el) => (el.textContent = Math.round(Number(el.getAttribute('data-fn')) * e).toLocaleString('en-US'))); if (k < 1) this.raf = requestAnimationFrame(f); };
    this.raf = requestAnimationFrame(f); }
  renderVals() {
    const D = window.SE_DATA, L = window.seI18n, line = 'A phone on your bench? We have the part.';
    const head = (L && L.lang() === 'ar' ? L.tr(line) : line).split(' '); // word by word, in the visitor's language
    return { secRef: this.secRef, on: this.state.on, head,
      wa: D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.') : '#',
      dir: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(SITE.contact.plusCode + ' Dubai'),
      browse: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'offer' } })); } };
  }
}

export default Component;
