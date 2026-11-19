'use client';
// Owner (19 Nov): "a store scrolling on its own is lame with no context, turn the iPad into an AD": the teardown idea but
// fuller, because it is an iPad. One cinematic loop (~27s), each scene enters differently:
//   1 WALL    graphite · bold lines fill the screen, sliding right→left / left→right in turns; three lines light up and
//             spell the message (they rush in fast, slow down, never fully stop)
//   2 BOOM    yellow · flash + shock ring, the live parts count punches in
//   3 STORE   white · the shop fades in, a search types itself, real results drop in
//   4 BRANDS  graphite · our real brand names sweep across from alternating sides, then the count booms
//   5 GRADES  yellow · the four grades slam down like chips
//   6 MAKERS  white · manufacturers and qualities, the maker's box rising
//   7 CALL    graphite · the logo powers on, "Open the shop"
// A real iPad top: no band behind the status bar; time (no date), Wi-Fi and battery change ink with whatever is under them
// (light ink on dark scenes, graphite on light ones); a larger camera island set lower; the home-indicator bar at the
// bottom, which changes ink too. Decorative (aria-hidden), pauses off screen and in hidden tabs.
import React, { useEffect, useRef, useState } from 'react';
import { data, products, search, shots, type Product, ptitle } from '@/lib/catalog';
import { T } from '@/components/site/ui';

type Scene = { id: string; ms: number; ink: 'light' | 'dark' };
const SCENES: Scene[] = [
  { id: 'wall', ms: 5600, ink: 'light' },
  { id: 'boom', ms: 2300, ink: 'dark' },
  { id: 'store', ms: 5200, ink: 'dark' },
  { id: 'brands', ms: 4200, ink: 'light' },
  { id: 'grades', ms: 3400, ink: 'dark' },
  { id: 'makers', ms: 3600, ink: 'dark' },
  { id: 'call', ms: 4200, ink: 'light' },
];
const WORDS = ['SCREENS', 'BATTERIES', 'FLEX CABLES', 'CAMERAS', 'BACK COVERS', 'CHARGING PORTS', 'SPEAKERS', 'FRAMES', 'SMALL PARTS'];
const LIT: Record<number, [string, string]> = { 1: ['EVERY PART.', 'y'], 4: ['EVERY MODEL.', 'w'], 7: ['EVERY GRADE.', 'y'] };
const QUERY = 'iPhone 13 screen';

export default function HeroIpadAd() {
  const root = useRef<HTMLDivElement>(null), live = useRef(true);
  const [i, setI] = useState(0), [loop, setLoop] = useState(0), [time, setTime] = useState(''), [bat, setBat] = useState(84), [q, setQ] = useState(''), [ok, setOk] = useState(false);
  // the catalogue arrives a moment after the page: wait for it (the wall scene needs nothing from it)
  useEffect(() => { if (data()) { setOk(true); return; } const iv = window.setInterval(() => { if (data()) { setOk(true); window.clearInterval(iv); } }, 300); return () => window.clearInterval(iv); }, []);
  useEffect(() => {
    const c = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }));
    c(); const a = window.setInterval(c, 15000), b = window.setInterval(() => setBat((v) => (v <= 22 ? 84 : v - 1)), 20000);
    return () => { window.clearInterval(a); window.clearInterval(b); };
  }, []);
  useEffect(() => { const el = root.current; if (!el || typeof IntersectionObserver === 'undefined') return; const io = new IntersectionObserver(([e]) => { live.current = e.isIntersecting; if (e.isIntersecting) el.removeAttribute('data-off'); else el.setAttribute('data-off', '1'); }); io.observe(el); return () => io.disconnect(); }, []);
  // the timeline: hold a scene for its length, only advancing while the hero is on screen and the tab is visible
  useEffect(() => {
    let t = 0, left = SCENES[i].ms, last = performance.now();
    const tick = () => { const now = performance.now(); if (live.current && !document.hidden) left -= now - last; last = now; if (left <= 0) { setI((x) => { const n = (x + 1) % SCENES.length; if (!n) setLoop((l) => l + 1); return n; }); return; } t = window.setTimeout(tick, 120); };
    t = window.setTimeout(tick, 120); return () => window.clearTimeout(t);
  }, [i]);
  // the search types itself during the store scene
  useEffect(() => {
    if (SCENES[i].id !== 'store') { setQ(''); return; }
    const tm: number[] = []; for (let k = 1; k <= QUERY.length; k++) tm.push(window.setTimeout(() => setQ(QUERY.slice(0, k)), 700 + k * 62));
    return () => tm.forEach(clearTimeout);
  }, [i]);

  const D = ok ? data() : null, all = ok ? products() : [];
  const res: Product[] = ok ? search(QUERY).filter((p) => p.img).slice(0, 4) : [];
  const fill: Product[] = res.length >= 4 ? res : [...res, ...all.filter((p) => p.img && p.category === 'SCR')].slice(0, 4);
  const brands = (D?.brands || []).map((b) => b.name).slice(0, 8);
  const grades = Object.values(D?.gradeNames || {}).slice(0, 4);
  const makers = (D?.manufacturers || []).map((m) => m.name).slice(0, 6), quals = (D?.qualities || []).map((m) => m.name).slice(0, 4);
  const box = typeof window !== 'undefined' && shots() ? shots()!.url('samsung-sp', 480) : '';
  const sc = SCENES[i], key = loop + '-' + i;
  const n = (v: number) => v.toLocaleString('en-US');

  return (
    <div className={'hia s-' + sc.id} ref={root} aria-hidden="true">
      <div className="hia-stage" key={key}>
        {sc.id === 'wall' ? (
          <div className="hia-wall">
            {WORDS.map((w, r) => LIT[r] ? (
              <span key={r} className={'hia-row lit ' + LIT[r][1] + (r % 2 ? ' rl' : ' lr')} style={{ ['--d' as string]: 0.9 + Object.keys(LIT).indexOf(String(r)) * 0.85 + 's' }}><b>{T(LIT[r][0])}</b></span>
            ) : (
              <span key={r} className={'hia-row' + (r % 2 ? ' rl' : ' lr')} style={{ ['--d' as string]: r * 0.06 + 's' }}><b>{T(w)} · {T(WORDS[(r + 3) % WORDS.length])} · {T(WORDS[(r + 5) % WORDS.length])} ·</b></span>
            ))}
          </div>
        ) : null}
        {sc.id === 'boom' ? (
          <div className="hia-boom">
            <span className="hia-flash" /><span className="hia-ring" /><span className="hia-ring r2" />
            <b className="hia-big">{n(all.reduce((t, p) => t + (p.stock_qty || 0), 0) || all.length)}</b>
            <span className="hia-sub">{T('parts in stock, right now')}</span>
            <span className="hia-tick"><i />{T('Live from our shelves in Deira')}</span>
          </div>
        ) : null}
        {sc.id === 'store' ? (
          <div className="hia-store">
            <div className="hia-shop">
              <span className="hia-sbar"><img src="/assets/se-logo-128.webp" alt="" /><b>SAM ELECTRONICS</b><i className="cart" /></span>
              <span className="hia-search"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><span>{q || T('Search any part, model or brand')}</span>{q ? <i className="caret" /> : null}</span>
              <span className="hia-count">{q.length === QUERY.length ? n(fill.length ? search(QUERY).length : 0) + ' ' + T('results') : ''}</span>
              <div className="hia-grid">{q.length === QUERY.length ? fill.map((p, k) => (
                <span className="hia-card" key={p.id} style={{ ['--k' as string]: k }}><span className="im"><img src={p.img.replace(/-480\.webp$/, '-240.webp')} alt="" /></span><b>{ptitle(p)}</b><small>{p.gradeName}</small></span>
              )) : null}</div>
            </div>
            <span className="hia-cap a">{T('Search anything.')}</span>
            <span className="hia-cap b">{T('Found in a blink.')}</span>
          </div>
        ) : null}
        {sc.id === 'brands' ? (
          <div className="hia-brands">
            <span className="hia-k">{T('THE BRANDS WE STOCK')}</span>
            {brands.map((b, k) => <span key={b} className={'hia-bn ' + (k % 2 ? 'rl' : 'lr')} style={{ ['--k' as string]: k }}>{b}</span>)}
            <span className="hia-bcount"><b>{D?.brands.length || 15}</b>{T('brands')} · <b>{n(D?.models.length || 0)}</b>{T('models')}</span>
          </div>
        ) : null}
        {sc.id === 'grades' ? (
          <div className="hia-grades">
            <b className="hia-h">{T('Every grade.')}<br /><em>{T('Tested on the bench.')}</em></b>
            <div className="hia-chips">{grades.map((g, k) => <span key={g} className="hia-chip" style={{ ['--k' as string]: k }}><i>{String(k + 1).padStart(2, '0')}</i>{g}</span>)}</div>
            <span className="hia-note">{T('Each grade carries its own warranty.')}</span>
          </div>
        ) : null}
        {sc.id === 'makers' ? (
          <div className="hia-makers">
            <span className="hia-k d">{T('MANUFACTURERS & QUALITIES')}</span>
            <b className="hia-h d">{T('Straight from the maker’s box.')}</b>
            {box ? <span className="hia-box"><img src={box} alt="" /></span> : null}
            <div className="hia-tags">{[...makers, ...quals].map((m, k) => <span key={m + k} style={{ ['--k' as string]: k }}>{m}</span>)}</div>
          </div>
        ) : null}
        {sc.id === 'call' ? (
          <div className="hia-call">
            <span className="hia-logo"><span className="ring" /><img src="/assets/se-logo-metal-320.webp" alt="" /></span>
            <span className="hia-k">{T('THE PARTS SHOP')}</span>
            <b className="hia-h">{T('Every part.')} <em>{T('Every grade.')}</em></b>
            <span className="hia-btn">{T('Open the shop')} →</span>
            <span className="hia-foot">{T('Al Murar, Deira')} · {T('Shipped worldwide')}</span>
          </div>
        ) : null}
      </div>
      {/* the iPad's own top and bottom: no band, the ink follows the scene under it */}
      <div className={'hia-sb ' + sc.ink}>
        <b>{time}</b>
        <span className="hia-isl"><i /></span>
        <span className="hia-ic">
          <svg width="14" height="10" viewBox="0 0 13 9"><path d="M6.5 8.6 4.5 6.4a2.8 2.8 0 0 1 4 0zM2.6 4.6a5.5 5.5 0 0 1 7.8 0l-1.2 1.2a3.8 3.8 0 0 0-5.4 0zM.6 2.6a8.3 8.3 0 0 1 11.8 0l-1.2 1.2a6.6 6.6 0 0 0-9.4 0z" /></svg>
          <small>{bat}%</small>
          <i className="bat"><i style={{ width: bat + '%' }} /></i>
        </span>
      </div>
      <span className={'hia-home ' + sc.ink} />
    </div>
  );
}
