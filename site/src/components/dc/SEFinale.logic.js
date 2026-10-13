// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Finale.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import { registerScene, freshStage } from '@/dc/gl-budget';
import { site as SITE } from '@/content/facts';

class Component extends DCLogic {
  state = { on: false, loading: true };
  secRef = React.createRef(); hostRef = React.createRef(); fs = { start: 0 };
  componentDidMount() {
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.fs.start = performance.now(); this.setState({ on: true }); clearTimeout(this.cT); this.cT = setTimeout(() => this.count(), 6900); } else { this.fs.start = 0; this.setState({ on: false }); } }, { threshold: 0.3 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    // G16: the finale scene holds a WebGL context only while it is near the viewport (src/dc/gl-budget.ts).
    this.unreg = registerScene({ id: 'finale', el: () => this.hostRef.current, mount: async () => { const h = this.hostRef.current; if (!h) return; const stg = freshStage(h); try { const m = await import(/* webpackIgnore: true */ new URL('./se-3d.js', document.baseURI).href); const d = await m.mountFinale(stg.host, this.fs); this.setState({ loading: false }); return () => { d && d(); stg.remove(); }; } catch (e) { console.warn('finale', e && e.message); stg.remove(); this.setState({ loading: false }); } } });
  }
  componentWillUnmount() { clearTimeout(this.cT); this.io && this.io.disconnect(); this.unreg && this.unreg(); }
  count() { const r = this.secRef.current; if (!r) return; const els = [...r.querySelectorAll('[data-fn]')], t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3); els.forEach((el) => (el.textContent = Math.round(Number(el.getAttribute('data-fn')) * e).toLocaleString('en-US'))); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }
  renderVals() {
    const D = window.SE_DATA;
    return { secRef: this.secRef, hostRef: this.hostRef, on: this.state.on, loading: this.state.loading,
      wa: D ? 'https://wa.me/' + D.contact.wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.') : '#',
      dir: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(SITE.contact.plusCode + ' Dubai'),
      browse: (ev) => { ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:go', { detail: { id: 'offer' } })); } };
  }
}

export default Component;
