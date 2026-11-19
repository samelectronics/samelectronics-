'use client';
// Owner (R10): "the iPad needs a full redesign … I want a cinematic, premium, high-quality ad with the teardown video's
// energy; introduce things before showing them; never put text over the shop; brands, qualities and makers shown in a
// premium way; the status bar like Apple does (dark on light, light on dark, pixel by pixel), no big island or grey box".
// One loop (~37s), crossfading scenes:
//   1 OPEN      graphite · a spotlight sweeps, the logo's LED ring draws itself, the name tracks in
//   2 TEARDOWN  graphite · a phone splits into its layers in 3D (glass, frame, battery, board, back) with callout lines;
//               the live stock count rolls in
//   3 CARD      yellow · title card that introduces the shop: "Now open: the parts shop."
//   4 SHOP      the REAL /shop tilts in from 3D and browses (no text over it)
//   5 CARD      graphite · "Type it. Find it."
//   6 SEARCH    the REAL shop's own search bar types and shows its results (no text over it)
//   7 BRANDS    white · one brand at a time lands in a spotlight while the others orbit in a 3D ring behind
//   8 GRADES    graphite · the quality tags are dealt out like premium cards, the makers follow, a light sweeps over
//   9 CALL      yellow · the logo, "Open the shop", and every way to reach us
// The status bar is drawn as a mask over the screen itself (grayscale, inverted, full contrast), so every pixel of the
// time and icons is black over light and white over dark, exactly like iOS. iPads have no island: only a tiny camera dot
// in the bezel. Decorative, aria-hidden, paused off screen and in hidden tabs; the real shop loads after the page settles.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { data, products, type Product } from '@/lib/catalog';
import { T } from '@/components/site/ui';
import { GradeTag, MakerTag } from '@/components/shop/Tags';

type Scene = { id: string; ms: number };
const SCENES: Scene[] = [
  { id: 'open', ms: 3400 },
  { id: 'tear', ms: 5600 },
  { id: 'card1', ms: 2300 },
  { id: 'shop', ms: 5600 },
  { id: 'card2', ms: 2000 },
  { id: 'search', ms: 5400 },
  { id: 'brands', ms: 5200 },
  { id: 'grades', ms: 4800 },
  { id: 'call', ms: 4400 },
];
const QUERY = 'iPhone 13 screen';
const VW = 880; // the real shop is drawn at this width, scaled to the screen
const BRANDS = ['apple', 'samsung', 'xiaomi', 'huawei', 'oppo', 'honor', 'google', 'oneplus', 'realme', 'vivo', 'infinix', 'tecno'];
const LAYERS: [string, string][] = [['glass', 'Screen'], ['frame', 'Frame'], ['bat', 'Battery'], ['board', 'Board & flex'], ['back', 'Back glass']];

function typeInto(input: HTMLInputElement, v: string) {
  const set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
  set?.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true }));
}
const svgUrl = (svg: string) => 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';

export default function HeroIpadAd() {
  const root = useRef<HTMLDivElement>(null), fr = useRef<HTMLIFrameElement>(null), live = useRef(true);
  const [i, setI] = useState(0), [loop, setLoop] = useState(0), [time, setTime] = useState('9:41'), [bat, setBat] = useState(84), [ok, setOk] = useState(false);
  const [go, setGo] = useState(false), [ready, setReady] = useState(false), [sc, setSc] = useState(0.43), [fh, setFh] = useState(1240), [bi, setBi] = useState(0);
  useEffect(() => { if (data()) { setOk(true); return; } const iv = window.setInterval(() => { if (data()) { setOk(true); window.clearInterval(iv); } }, 300); return () => window.clearInterval(iv); }, []);
  useEffect(() => {
    const c = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Dubai' }));
    c(); const a = window.setInterval(c, 15000), b = window.setInterval(() => setBat((v) => (v <= 22 ? 84 : v - 1)), 20000);
    return () => { window.clearInterval(a); window.clearInterval(b); };
  }, []);
  useEffect(() => {
    const start = () => { const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }; (w.requestIdleCallback || ((f: () => void) => window.setTimeout(f, 1500)))(() => setGo(true), { timeout: 5000 }); };
    if (document.readyState === 'complete') window.setTimeout(start, 1500); else window.addEventListener('load', () => window.setTimeout(start, 1500), { once: true });
  }, []);
  useEffect(() => { const el = root.current; if (!el) return; const fit = () => { const k = el.offsetWidth / VW; setSc(k); setFh(Math.ceil(el.offsetHeight / k)); }; fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => { const el = root.current; if (!el || typeof IntersectionObserver === 'undefined') return; const io = new IntersectionObserver(([e]) => { live.current = e.isIntersecting; if (e.isIntersecting) el.removeAttribute('data-off'); else el.setAttribute('data-off', ''); }, { threshold: 0.05 }); io.observe(el); return () => io.disconnect(); }, []);
  // the timeline (the shop scenes and their title cards wait until the real shop has loaded)
  useEffect(() => {
    let t = 0, left = SCENES[i].ms, last = performance.now();
    const needsShop = (id: string) => id === 'card1' || id === 'shop' || id === 'card2' || id === 'search';
    const tick = () => { const now = performance.now(); if (live.current && !document.hidden) left -= now - last; last = now;
      if (left <= 0) { setI((x) => { let n = (x + 1) % SCENES.length; while (!ready && needsShop(SCENES[n].id)) n = (n + 1) % SCENES.length; if (n <= x) setLoop((l) => l + 1); return n; }); return; }
      t = window.setTimeout(tick, 100); };
    t = window.setTimeout(tick, 100); return () => window.clearTimeout(t);
  }, [i, ready]);
  // brands: one logo in the spotlight at a time
  useEffect(() => { if (SCENES[i].id !== 'brands') return; setBi(0); const iv = window.setInterval(() => setBi((x) => x + 1), 620); return () => window.clearInterval(iv); }, [i]);
  // drive the real shop: browse (scroll) in SHOP, type into its own search bar in SEARCH
  useEffect(() => {
    const id = SCENES[i].id, w = fr.current?.contentWindow, d = fr.current?.contentDocument; if (!w || !d || !ready) return;
    const tm: number[] = []; let raf = 0;
    const glide = (to: number, ms: number) => { const y0 = w.scrollY, t0 = performance.now(); const f = (t: number) => { const k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; w.scrollTo(0, y0 + (to - y0) * e); if (k < 1) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); };
    const input = () => d.querySelector<HTMLInputElement>('.ss-bar input');
    if (id === 'card1') { const inp = input(); if (inp && inp.value) { typeInto(inp, ''); d.querySelector<HTMLButtonElement>('.ss-go')?.click(); } w.scrollTo(0, 0); }
    if (id === 'shop') tm.push(window.setTimeout(() => glide(560, 1900), 1100), window.setTimeout(() => glide(1150, 1700), 3300));
    if (id === 'card2') w.scrollTo(0, 0);
    if (id === 'search') {
      for (let k = 1; k <= QUERY.length; k++) tm.push(window.setTimeout(() => { const inp = input(); if (inp) typeInto(inp, QUERY.slice(0, k)); }, 450 + k * 70));
      tm.push(window.setTimeout(() => { d.querySelector<HTMLButtonElement>('.ss-go')?.click(); (d.activeElement as HTMLElement | null)?.blur?.(); }, 550 + QUERY.length * 70 + 300));
      tm.push(window.setTimeout(() => glide(380, 1500), 550 + QUERY.length * 70 + 1100));
    }
    return () => { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, [i, ready]);

  const D = ok ? data() : null, all: Product[] = ok ? products() : [];
  const stock = all.reduce((t, p) => t + (p.stock_qty || 0), 0) || all.length;
  const brandsN = D?.brands.length || 15, modelsN = D?.models.length || 0;
  const grades = Object.entries(D?.gradeNames || {}).slice(0, 6);
  const makers = Object.entries(D?.makerNames || {}).filter(([, nm], k, a) => a.findIndex((x) => x[1] === nm) === k).slice(0, 6);
  const sc0 = SCENES[i], key = loop + '-' + i, n = (v: number) => v.toLocaleString('en-US');
  const shopOn = ready && (sc0.id === 'shop' || sc0.id === 'search');
  // the status bar mask: the time on the left, signal + wifi + battery on the right (drawn as shapes, so the screen shows through)
  const sb = useMemo(() => {
    const tm = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='14'><text x='0' y='11.5' font-family='-apple-system,Inter,Arial' font-size='12' font-weight='600'>${time}</text></svg>`);
    const w = Math.max(2, Math.round(16 * bat / 100));
    const ic = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='62' height='14'><g><rect x='0' y='8' width='2.6' height='4' rx='.8'/><rect x='3.8' y='6' width='2.6' height='6' rx='.8'/><rect x='7.6' y='4' width='2.6' height='8' rx='.8'/><rect x='11.4' y='2' width='2.6' height='10' rx='.8'/></g><path transform='translate(18 1.5)' d='M7 10.5 5 8.3a2.8 2.8 0 0 1 4 0zM3.1 6.5a5.5 5.5 0 0 1 7.8 0L9.7 7.7a3.8 3.8 0 0 0-5.4 0zM1.1 4.5a8.3 8.3 0 0 1 11.8 0L11.7 5.7a6.6 6.6 0 0 0-9.4 0z'/><rect x='36.5' y='2.5' width='21' height='9.5' rx='2.6' fill='none' stroke='black' stroke-width='1.1'/><rect x='38.4' y='4.4' width='${w}' height='5.7' rx='1.3'/><rect x='58.4' y='5.5' width='1.6' height='3.4' rx='.8'/></svg>`);
    return { tm, ic };
  }, [time, bat]);

  return (
    <div className={'hia3 s-' + sc0.id} ref={root} aria-hidden="true">
      <div className={'h3-real' + (shopOn ? ' on' : '') + (sc0.id === 'shop' ? ' tilt' : '')}>
        {go ? <iframe ref={fr} src="/shop" title="Sam Electronics shop" tabIndex={-1} scrolling="no" onLoad={() => window.setTimeout(() => setReady(true), 1200)} style={{ width: VW + 'px', height: fh + 'px', transform: 'scale(' + sc + ')' }} /> : null}
      </div>
      <div className="h3-stage" key={key}>
        {sc0.id === 'open' ? (
          <div className="h3-open">
            <span className="h3-spot" /><span className="h3-dust" />
            <span className="h3-logo"><svg className="h3-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" /></svg><img src="/assets/se-logo-metal-320.webp" alt="" /></span>
            <b className="h3-name">SAM ELECTRONICS</b>
            <small className="h3-tag">{T('QUALITY · WARRANTY · PRICE')}</small>
          </div>
        ) : null}
        {sc0.id === 'tear' ? (
          <div className="h3-tear">
            <span className="h3-grid" />
            <div className="h3-phone">{LAYERS.map(([k], z) => <span key={k} className={'ly ' + k} style={{ ['--z' as string]: z }}>{k === 'board' ? <><i /><i /><i /><i /></> : k === 'back' ? <em /> : null}</span>)}</div>
            <div className="h3-calls">{LAYERS.map(([k, l], z) => <span key={k} style={{ ['--z' as string]: z }}><i />{T(l)}</span>)}</div>
            <span className="h3-count"><b>{n(stock)}</b><small>{T('parts in stock, right now')}</small></span>
          </div>
        ) : null}
        {sc0.id === 'card1' ? <div className="h3-card y"><small>{T('NOW OPEN')}</small><b>{T('The parts shop.')}</b><span>{n(all.length)} {T('parts')} · {brandsN} {T('brands')}</span></div> : null}
        {sc0.id === 'card2' ? <div className="h3-card"><small>{T('SEARCH')}</small><b>{T('Type it.')} <em>{T('Find it.')}</em></b></div> : null}
        {sc0.id === 'brands' ? (
          <div className="h3-brands">
            <span className="h3-spot w" />
            <div className="h3-orbit">{BRANDS.map((b, k) => <span key={b} style={{ ['--k' as string]: k, ['--n' as string]: BRANDS.length }}><img src={'/assets/brands/' + b + '.svg'} alt="" /></span>)}</div>
            <span className="h3-hero" key={bi}><img src={'/assets/brands/' + BRANDS[bi % BRANDS.length] + '.svg'} alt="" /></span>
            <span className="h3-bk">{T('THE BRANDS WE STOCK')}</span>
            <span className="h3-bn"><b>{brandsN}</b> {T('brands')} <i /> <b>{n(modelsN)}</b> {T('phone models')}</span>
          </div>
        ) : null}
        {sc0.id === 'grades' ? (
          <div className="h3-grades">
            <span className="h3-sweep" />
            <span className="h3-gk">{T('EVERY GRADE · TESTED ON THE BENCH')}</span>
            <div className="h3-deal">{grades.map(([g, nm], k) => <span key={g} style={{ ['--k' as string]: k, ['--m' as string]: grades.length }}><GradeTag g={g} name={nm} size="lg" /></span>)}</div>
            <div className="h3-makers">{makers.map(([m, nm], k) => <span key={m} style={{ ['--k' as string]: k }}><MakerTag m={m} name={nm} size="lg" /></span>)}</div>
          </div>
        ) : null}
        {sc0.id === 'call' ? (
          <div className="h3-call">
            <span className="h3-rays" />
            <span className="h3-logo sm"><svg className="h3-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" /></svg><img src="/assets/se-logo-metal-320.webp" alt="" /></span>
            <b className="h3-ch">{T('Every part.')} <em>{T('Every grade.')}</em></b>
            <span className="h3-btn">{T('Open the shop')} →</span>
            <span className="h3-ways"><i className="wa" />WhatsApp<i className="wc" />WeChat<i className="ml" />{T('E-mail')}<i className="web" />{T('Website')}</span>
          </div>
        ) : null}
      </div>
      {/* iOS-style status bar: every pixel black over light, white over dark (the screen itself, inverted, through the shapes) */}
      <span className="h3-sb t" style={{ WebkitMaskImage: sb.tm, maskImage: sb.tm }} />
      <span className="h3-sb r" style={{ WebkitMaskImage: sb.ic, maskImage: sb.ic }} />
      <span className="h3-cam" />
      <span className="h3-home" />
    </div>
  );
}
