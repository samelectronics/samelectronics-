// @ts-nocheck
/* eslint-disable */
// The Feed (Issue 15 part A, 13 Oct 2026). Styles in src/styles/feed.css.
// Three teardown phones fanned in a graphite studio, each playing one of our channels (Instagram, TikTok, Facebook).
// Feeds scroll and reels play on CSS; the logic only ticks the like counters and rolls the follower counts once.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';

export const CH = [
  { id: 'ig', name: 'Instagram', href: 'https://instagram.com/samelectronics.uae', followers: 12400 },
  { id: 'tt', name: 'TikTok', href: 'https://www.tiktok.com/@samelectronics.uae', followers: 8100 },
  { id: 'fb', name: 'Facebook', href: 'https://facebook.com/samelectronics.uae', followers: 5600 },
];
export const POSTS = [
  { k: 0, t: 'Just landed: iPhone 15 Pro OLED screens', m: '12 boxes · Deira', bg: 'y', likes: 412 },
  { k: 4, t: 'Galaxy A54 batteries back in stock', m: 'Stock drop', bg: 'w', likes: 268 },
  { k: 7, t: 'This week: −18% on back glass', m: 'Offer · ends Friday', bg: 'd', likes: 351 },
  { k: 5, t: 'Pixel 8 Pro cameras, tested', m: 'Bench test', bg: 'w', likes: 187 },
];

class Component extends DCLogic {
  secRef = React.createRef();
  state = { seen: false, tick: 0, lib: null };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { cancelAnimationFrame(this.nRaf); this.setState({ seen: false }); }); // 14 Oct · H-G2: replay from the start
    const sp = window.seParts, pk = sp && sp.peek && sp.peek(); if (pk) this.setState({ lib: pk });
    this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) { this.setState({ seen: true }); this.roll(); } }, { threshold: 0.25 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.iv = setInterval(() => { if (this.vis && !document.hidden) this.setState({ tick: this.state.tick + 1 }); }, 1600);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
  }
  componentWillUnmount() { this.offRp && this.offRp(); clearInterval(this.iv); cancelAnimationFrame(this.nRaf); this.io && this.io.disconnect(); window.removeEventListener('se:parts-lib', this.onLib); window.removeEventListener('se:lang', this.onLang); }
  roll() { const R = this.secRef.current; if (!R) return; const els = [...R.querySelectorAll('[data-n]')], t0 = performance.now() + 900;
    const k1 = (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'K' : String(Math.round(v)));
    const step = (now) => { const k = Math.max(0, Math.min(1, (now - t0) / 1400)), e = 1 - Math.pow(1 - k, 3); els.forEach((el) => { const s = k1(+el.dataset.n * e); if (el.textContent !== s) el.textContent = s; }); if (k < 1) this.nRaf = requestAnimationFrame(step); };
    this.nRaf = requestAnimationFrame(step); }
  renderVals() {
    const s = this.state, lib = s.lib, tk = s.tick;
    const img = (k) => (lib && lib.large ? lib.large[k] : '');
    const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n));
    return { secRef: this.secRef, seen: s.seen, phone: img(9), front: lib && lib.front ? lib.front : null, img,
      ch: CH, posts: POSTS.map((p, i) => ({ ...p, img: img(p.k), likes: fmt(p.likes + Math.floor((tk + i * 2) / 3) * (i + 1)) })),
      tt: { likes: fmt(3200 + tk * 7), com: fmt(146 + Math.floor(tk / 2)), share: fmt(88 + Math.floor(tk / 4)) },
      qr: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=26-27-29&data=' + encodeURIComponent(CH[0].href) };
  }
}

export default Component;
