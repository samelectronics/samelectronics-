'use client';
// Owner (19 Nov, round 2): "the iPad ad is dead, a grey screen. I asked for the boom and pam of the teardown ad, the
// screen filled with beauty, transitions, animations and colours, and the shop features from the ACTUAL shop."
// One loop (~33s), every scene a different colour and a different entrance:
//   1 WALL    graphite · bold lines slide across in turns; three rush in, slow down, and LIGHT UP as yellow bands with a
//             boom each time (white flash, the screen kicks, sparks fly)
//   2 BOOM    yellow · a sunburst spins, shock rings, real parts fly out of the centre, the live stock count punches in
//   3 SHOP    the REAL /shop page fades in (zooming out to fit) and scrolls like a customer is browsing
//   4 SEARCH  the REAL shop's own search bar types "iPhone 13 screen" and its real results appear; captions slam in
//   5 BRANDS  white · the real brand logos slam onto tiles one by one, then the brand/model count booms
//   6 GRADES  graphite · the shop's own grade and maker tags rain down, a light sweeps across
//   7 CALL    yellow → graphite · rays, the logo powers on (LED ring flicker), "Open the shop" pulses
// Status bar (no band, ink follows the screen under it), a big lowered camera island, the home bar. Decorative,
// aria-hidden, paused off screen and in hidden tabs. The real shop loads once, after the home page has settled.
import React, { useEffect, useRef, useState } from 'react';
import { data, products, shots, type Product } from '@/lib/catalog';
import { T } from '@/components/site/ui';
import { GradeTag, MakerTag } from '@/components/shop/Tags';

type Scene = { id: string; ms: number; ink: 'light' | 'dark' };
const SCENES: Scene[] = [
  { id: 'wall', ms: 5800, ink: 'light' },
  { id: 'boom', ms: 2800, ink: 'dark' },
  { id: 'shop', ms: 5600, ink: 'light' },
  { id: 'search', ms: 5600, ink: 'light' },
  { id: 'brands', ms: 4600, ink: 'dark' },
  { id: 'grades', ms: 4200, ink: 'light' },
  { id: 'call', ms: 4400, ink: 'light' },
];
const WORDS = ['SCREENS', 'BATTERIES', 'FLEX CABLES', 'CAMERAS', 'BACK COVERS', 'CHARGING PORTS', 'SPEAKERS', 'FRAMES', 'SMALL PARTS'];
const LIT: Record<number, string> = { 1: 'EVERY PART.', 4: 'EVERY MODEL.', 7: 'EVERY GRADE.' };
const LIT_AT = [0.9, 2.1, 3.3]; // seconds: when each lit line lands (a boom each time)
const QUERY = 'iPhone 13 screen';
const VW = 880; // the real shop is drawn at this width, scaled to the screen
const BRAND_SVG = ['apple', 'samsung', 'xiaomi', 'huawei', 'oppo', 'honor', 'oneplus', 'google', 'poco', 'infinix', 'realme', 'vivo'];

/** sets a value on a React-controlled input inside the shop frame, the way typing does */
function typeInto(input: HTMLInputElement, v: string) {
  const set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
  set?.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true }));
}

export default function HeroIpadAd() {
  const root = useRef<HTMLDivElement>(null), fr = useRef<HTMLIFrameElement>(null), live = useRef(true);
  const [i, setI] = useState(0), [loop, setLoop] = useState(0), [time, setTime] = useState(''), [bat, setBat] = useState(84), [ok, setOk] = useState(false);
  const [go, setGo] = useState(false), [ready, setReady] = useState(false), [sc, setSc] = useState(0.43), [fh, setFh] = useState(1240);
  useEffect(() => { if (data()) { setOk(true); return; } const iv = window.setInterval(() => { if (data()) { setOk(true); window.clearInterval(iv); } }, 300); return () => window.clearInterval(iv); }, []);
  useEffect(() => {
    const c = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }));
    c(); const a = window.setInterval(c, 15000), b = window.setInterval(() => setBat((v) => (v <= 22 ? 84 : v - 1)), 20000);
    return () => { window.clearInterval(a); window.clearInterval(b); };
  }, []);
  // the real shop loads once the home page has finished loading
  useEffect(() => {
    const start = () => { const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }; (w.requestIdleCallback || ((f: () => void) => window.setTimeout(f, 1500)))(() => setGo(true), { timeout: 5000 }); };
    if (document.readyState === 'complete') window.setTimeout(start, 1500); else window.addEventListener('load', () => window.setTimeout(start, 1500), { once: true });
  }, []);
  useEffect(() => { const el = root.current; if (!el) return; const fit = () => { const k = el.offsetWidth / VW; setSc(k); setFh(Math.ceil(el.offsetHeight / k)); }; fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => { const el = root.current; if (!el || typeof IntersectionObserver === 'undefined') return; const io = new IntersectionObserver(([e]) => { live.current = e.isIntersecting; if (e.isIntersecting) el.removeAttribute('data-off'); else el.setAttribute('data-off', '1'); }); io.observe(el); return () => io.disconnect(); }, []);
  // the timeline (skips the two shop scenes until the real shop has loaded)
  useEffect(() => {
    let t = 0, left = SCENES[i].ms, last = performance.now();
    const tick = () => { const now = performance.now(); if (live.current && !document.hidden) left -= now - last; last = now;
      if (left <= 0) { setI((x) => { let n = (x + 1) % SCENES.length; while (!ready && (SCENES[n].id === 'shop' || SCENES[n].id === 'search')) n = (n + 1) % SCENES.length; if (n <= x) setLoop((l) => l + 1); return n; }); return; }
      t = window.setTimeout(tick, 100); };
    t = window.setTimeout(tick, 100); return () => window.clearTimeout(t);
  }, [i, ready]);
  // drive the real shop: browse (scroll) in SHOP, type into its own search bar in SEARCH
  useEffect(() => {
    const id = SCENES[i].id, w = fr.current?.contentWindow, d = fr.current?.contentDocument; if (!w || !d || !ready) return;
    const tm: number[] = []; let raf = 0;
    const glide = (to: number, ms: number) => { const y0 = w.scrollY, t0 = performance.now(); const f = (t: number) => { const k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; w.scrollTo(0, y0 + (to - y0) * e); if (k < 1) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); };
    const input = () => d.querySelector<HTMLInputElement>('.ss-bar input');
    if (id === 'shop') { const inp = input(); if (inp && inp.value) { typeInto(inp, ''); d.querySelector<HTMLButtonElement>('.ss-go')?.click(); } w.scrollTo(0, 0); tm.push(window.setTimeout(() => glide(560, 1900), 700), window.setTimeout(() => glide(1150, 1700), 3000)); }
    if (id === 'search') {
      w.scrollTo(0, 0);
      for (let k = 1; k <= QUERY.length; k++) tm.push(window.setTimeout(() => { const inp = input(); if (inp) typeInto(inp, QUERY.slice(0, k)); }, 500 + k * 70));
      tm.push(window.setTimeout(() => { d.querySelector<HTMLButtonElement>('.ss-go')?.click(); (d.activeElement as HTMLElement | null)?.blur?.(); }, 600 + QUERY.length * 70 + 300));
      tm.push(window.setTimeout(() => glide(380, 1500), 600 + QUERY.length * 70 + 1100));
    }
    return () => { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, [i, ready]);

  const D = ok ? data() : null, all: Product[] = ok ? products() : [];
  const stock = all.reduce((t, p) => t + (p.stock_qty || 0), 0) || all.length;
  const flyers = all.filter((p) => p.img).slice(0, 60).filter((_, k) => k % 6 === 0).slice(0, 8);
  const brandsN = D?.brands.length || 15, modelsN = D?.models.length || 0;
  const grades = Object.entries(D?.gradeNames || {}).slice(0, 6);
  const makers = Object.entries(D?.makerNames || {}).slice(0, 6);
  const box = typeof window !== 'undefined' && shots() ? shots()!.url('samsung-sp', 480) : '';
  const sc0 = SCENES[i], key = loop + '-' + i, n = (v: number) => v.toLocaleString('en-US');
  const shopOn = ready && (sc0.id === 'shop' || sc0.id === 'search');

  return (
    <div className={'hia s-' + sc0.id} ref={root} aria-hidden="true">
      {/* the real shop, scaled to the screen; visible only in its two scenes */}
      <div className={'hia-real' + (shopOn ? ' on' : '')}>
        {go ? <iframe ref={fr} src="/shop" title="Sam Electronics shop" tabIndex={-1} scrolling="no" onLoad={() => window.setTimeout(() => setReady(true), 1200)} style={{ width: VW + 'px', height: fh + 'px', transform: 'scale(' + sc + ')' }} /> : null}
      </div>
      <div className="hia-stage" key={key}>
        {sc0.id === 'wall' ? (
          <div className="hia-wall">
            {WORDS.map((w, r) => LIT[r] ? (
              <span key={r} className={'hia-row lit' + (r % 2 ? ' rl' : ' lr')} style={{ ['--d' as string]: LIT_AT[Object.keys(LIT).indexOf(String(r))] + 's' }}><i className="band" /><b>{T(LIT[r])}</b></span>
            ) : (
              <span key={r} className={'hia-row' + (r % 2 ? ' rl' : ' lr')} style={{ ['--d' as string]: r * 0.05 + 's' }}><b>{T(w)} · {T(WORDS[(r + 3) % WORDS.length])} · {T(WORDS[(r + 5) % WORDS.length])} ·</b></span>
            ))}
            {LIT_AT.map((t, k) => <span key={k} className="hia-hit" style={{ ['--d' as string]: t + 0.18 + 's' }}><i className="fl" />{Array.from({ length: 10 }, (_, j) => <i key={j} className="sp" style={{ ['--a' as string]: j * 36 + k * 11 + 'deg' }} />)}</span>)}
          </div>
        ) : null}
        {sc0.id === 'boom' ? (
          <div className="hia-boom">
            <span className="hia-rays" /><span className="hia-flash" /><span className="hia-ring" /><span className="hia-ring r2" /><span className="hia-ring r3" />
            {flyers.map((p, k) => <img key={p.id} className="hia-fly" src={p.img.replace(/-480\.webp$/, '-240.webp')} alt="" style={{ ['--a' as string]: k * 45 + 20 + 'deg', ['--k' as string]: k }} />)}
            <b className="hia-big">{n(stock)}</b>
            <span className="hia-sub">{T('parts in stock, right now')}</span>
            <span className="hia-tick"><i />{T('Live from our shelves in Deira')}</span>
          </div>
        ) : null}
        {sc0.id === 'shop' ? (
          <div className="hia-over">
            <span className="hia-cap top">{T('THE PARTS SHOP')}</span>
            <span className="hia-cap a">{T('Every part. Every grade.')}</span>
            <span className="hia-cap b y">{n(all.length)} {T('parts')} · {brandsN} {T('brands')}</span>
          </div>
        ) : null}
        {sc0.id === 'search' ? (
          <div className="hia-over">
            <span className="hia-cap a s">{T('Search anything.')}</span>
            <span className="hia-cap b y s">{T('Found in a blink.')}</span>
          </div>
        ) : null}
        {sc0.id === 'brands' ? (
          <div className="hia-brands">
            <span className="hia-k d">{T('THE BRANDS WE STOCK')}</span>
            <div className="hia-bgrid">{BRAND_SVG.map((b, k) => <span key={b} style={{ ['--k' as string]: k }}><img src={'/assets/brands/' + b + '.svg'} alt="" onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} /></span>)}</div>
            <span className="hia-bcount"><b>{brandsN}</b>{T('brands')}<i /><b>{n(modelsN)}</b>{T('phone models')}</span>
          </div>
        ) : null}
        {sc0.id === 'grades' ? (
          <div className="hia-grades">
            <span className="hia-sweep" />
            <span className="hia-k">{T('MANUFACTURERS & QUALITIES')}</span>
            <b className="hia-h">{T('Every grade.')} <em>{T('Tested on the bench.')}</em></b>
            <div className="hia-rain">{grades.map(([g, nm], k) => <span key={g} style={{ ['--k' as string]: k }}><GradeTag g={g} name={nm} size="lg" /></span>)}</div>
            <div className="hia-rain m">{makers.map(([m, nm], k) => <span key={m} style={{ ['--k' as string]: k + 4 }}><MakerTag m={m} name={nm} size="lg" /></span>)}</div>
            {box ? <img className="hia-box" src={box} alt="" /> : null}
          </div>
        ) : null}
        {sc0.id === 'call' ? (
          <div className="hia-call">
            <span className="hia-rays y" />
            <span className="hia-logo"><span className="ring" /><img src="/assets/se-logo-metal-320.webp" alt="" /></span>
            <span className="hia-k">{T('THE PARTS SHOP')}</span>
            <b className="hia-h">{T('Every part.')} <em>{T('Every grade.')}</em></b>
            <span className="hia-btn">{T('Open the shop')} →</span>
            <span className="hia-foot">{T('Al Murar, Deira')} · {T('Shipped worldwide')}</span>
          </div>
        ) : null}
      </div>
      <div className={'hia-sb ' + sc0.ink}>
        <b>{time}</b>
        <span className="hia-isl"><i /></span>
        <span className="hia-ic">
          <svg width="14" height="10" viewBox="0 0 13 9"><path d="M6.5 8.6 4.5 6.4a2.8 2.8 0 0 1 4 0zM2.6 4.6a5.5 5.5 0 0 1 7.8 0l-1.2 1.2a3.8 3.8 0 0 0-5.4 0zM.6 2.6a8.3 8.3 0 0 1 11.8 0l-1.2 1.2a6.6 6.6 0 0 0-9.4 0z" /></svg>
          <small>{bat}%</small>
          <i className="bat"><i style={{ width: bat + '%' }} /></i>
        </span>
      </div>
      <span className={'hia-home ' + sc0.ink} />
    </div>
  );
}
