'use client';
// Owner (R10 → R11): "the iPad ad looks cheap and weak: the screen isn't filled, a sun-like light loops, the time and
// battery are annoying, it lacks the boom-pam of the teardown video, no high-quality bold running text, the logos are
// cheaply presented; think of us as an international brand, this becomes an app later".
// A short film (~39s) in the teardown's language. Every scene fills the whole screen; cuts land on a white flash;
// huge bold type slams in; bold yellow bands run across; no status bar, no rays.
//   1 OPEN      SAM slams in, ELECTRONICS tracks out, two bands cross
//   2 TEAR      the real teardown footage opens the phone; every layer is named as it comes out; the stock count lands
//   3 WORDS     five beats, one part each: SCREENS · BATTERIES · CAMERAS · FLEX CABLES · BACK GLASS (colour cut per beat)
//   4 CARD      NOW OPEN · the parts shop
//   5 SHOP      the REAL /shop browses (nothing over it)
//   6 CARD      Type it. Find it.
//   7 SEARCH    the REAL shop's search bar types and shows results
//   8 BRANDS    every brand on equal white tiles (true logos in their own ink), a spotlight walks across them
//   9 GRADES    four beats: the screen box slams in with its grade name, huge
//  10 CALL      the logo, EVERY PART. EVERY GRADE., the button, bands
// Sizes use container units (cqw), so the film scales with the iPad (and the future app). Decorative, aria-hidden,
// paused off screen and in hidden tabs; the real shop loads after the page settles.
import React, { useEffect, useRef, useState } from 'react';
import { data, products, type Product } from '@/lib/catalog';
import { T } from '@/components/site/ui';
import { GradeTag } from '@/components/shop/Tags';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { brandInk } from '@/lib/brandInk';

type Scene = { id: string; ms: number };
const SCENES: Scene[] = [
  { id: 'open', ms: 2800 },
  { id: 'tear', ms: 5400 },
  { id: 'words', ms: 3700 },
  { id: 'card1', ms: 1900 },
  { id: 'shop', ms: 5600 },
  { id: 'card2', ms: 1700 },
  { id: 'search', ms: 5400 },
  { id: 'brands', ms: 6600 },
  { id: 'grades', ms: 5800 },
  { id: 'call', ms: 4400 },
];
const QUERY = 'iPhone 13 screen';
const VW = 880; // the real shop is drawn at this width, scaled to the screen
const BRANDS = ['apple', 'samsung', 'xiaomi', 'redmi', 'poco', 'huawei', 'honor', 'oppo', 'realme', 'google', 'oneplus', 'vivo', 'infinix', 'tecno', 'nokia'];
const FILM = Array.from({ length: 48 }, (_, k) => '/assets/pose/film-' + String(k).padStart(2, '0') + '-480.webp');
const LAYERS = ['SCREEN', 'FRAME', 'BATTERY', 'BOARD & FLEX', 'BACK GLASS'];
const WORDS: [string, string][] = [['SCREENS', 'solo-scr'], ['BATTERIES', 'solo-bat'], ['CAMERAS', 'solo-cam'], ['FLEX CABLES', 'solo-flx'], ['BACK GLASS', 'solo-bcv']];
const GRADES: [string, string, string, string][] = [['apple-sp', 'OR', 'Original', 'ORIGINAL'], ['apple-gx', 'OL', 'OLED Soft', 'OLED'], ['apple-zy', 'IN', 'Incell', 'INCELL'], ['apple-temp', 'AQ', 'AAA', 'AAA']];
const BEAT = { words: 740, grades: 1450 };

function typeInto(input: HTMLInputElement, v: string) {
  const set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
  set?.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true }));
}
/** a word as big as the screen allows: long words (and long translations) shrink to fit the width */
const fit = (s: string, max: number, room = 92) => ({ fontSize: `min(${max}cqw, ${(room / Math.max(1, s.length * 0.62)).toFixed(2)}cqw)` });
/** a bold running band of text (the teardown's ticker) */
const Band = ({ text, cls = '' }: { text: string; cls?: string }) => (
  <span className={'h4-band ' + cls}><span>{[0, 1].map((k) => <b key={k}>{Array.from({ length: 4 }, () => text).join(' ✦ ')} ✦ </b>)}</span></span>
);

export default function HeroIpadAd() {
  const root = useRef<HTMLDivElement>(null), fr = useRef<HTMLIFrameElement>(null), live = useRef(true);
  const [i, setI] = useState(0), [loop, setLoop] = useState(0), [ok, setOk] = useState(false), [bs, setBs] = useState({ i: -1, b: 0, f: 0 });
  const [go, setGo] = useState(false), [ready, setReady] = useState(false), [sc, setSc] = useState(0.43), [fh, setFh] = useState(1240);
  useEffect(() => { if (data()) { setOk(true); return; } const iv = window.setInterval(() => { if (data()) { setOk(true); window.clearInterval(iv); } }, 300); return () => window.clearInterval(iv); }, []);
  // R11 (speed): the real shop inside the iPad loads only once the film is about to need it (from the WORDS scene on),
  // in a quiet moment, and only while the hero is on screen, so it never competes with the page's first load or the 3D
  useEffect(() => {
    if (go || SCENES[i].id !== 'words') return;
    const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number };
    const run = () => { if (live.current && !document.hidden) setGo(true); };
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 2500 }); else window.setTimeout(run, 400);
  }, [i, go]);
  // warm the footage and the pictures once, so no beat ever shows a half-loaded image
  useEffect(() => { const t = window.setTimeout(() => { [...FILM, ...WORDS.map((w) => '/assets/pose/' + w[1] + '-480.webp'), ...GRADES.map((g) => '/assets/pose/' + g[0] + '-480.webp')].forEach((s) => { const im = new Image(); im.src = s; }); }, 1200); return () => window.clearTimeout(t); }, []);
  useEffect(() => { const el = root.current; if (!el) return; const f = () => { const k = el.offsetWidth / VW; setSc(k); setFh(Math.ceil(el.offsetHeight / k)); }; f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => { const el = root.current; if (!el || typeof IntersectionObserver === 'undefined') return; const io = new IntersectionObserver(([e]) => { live.current = e.isIntersecting; if (e.isIntersecting) el.removeAttribute('data-off'); else el.setAttribute('data-off', ''); }, { threshold: 0.05 }); io.observe(el); return () => io.disconnect(); }, []);
  // the timeline (the shop scenes and their title cards wait until the real shop has loaded)
  useEffect(() => {
    let t = 0, left = SCENES[i].ms, last = performance.now();
    const needsShop = (id: string) => id === 'card1' || id === 'shop' || id === 'card2' || id === 'search';
    const tick = () => { const now = performance.now(); if (live.current && !document.hidden) left -= now - last; last = now;
      if (left <= 0) { setI((x) => { let n = (x + 1) % SCENES.length; while (!ready && needsShop(SCENES[n].id)) n = (n + 1) % SCENES.length; if (n <= x) setLoop((l) => l + 1); return n; }); return; }
      t = window.setTimeout(tick, 80); };
    t = window.setTimeout(tick, 80); return () => window.clearTimeout(t);
  }, [i, ready]);
  // beats inside a scene (words, grades) and the teardown footage (opens once, then holds)
  useEffect(() => {
    // (beats are stored with their scene, so a new scene never shows the last scene's beat for a frame)
    const id = SCENES[i].id; setBs({ i, b: 0, f: 0 });
    if (id === 'words' || id === 'grades') { const iv = window.setInterval(() => { if (live.current && !document.hidden) setBs((s) => ({ ...s, b: s.b + 1 })); }, BEAT[id]); return () => window.clearInterval(iv); }
    if (id === 'tear') { let k = 0; const iv = window.setInterval(() => { if (!live.current || document.hidden) return; k++; setBs((s) => ({ ...s, f: Math.min(FILM.length - 1, k) })); if (k >= FILM.length - 1) window.clearInterval(iv); }, 62); return () => window.clearInterval(iv); }
  }, [i]);
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
  const sc0 = SCENES[i], key = loop + '-' + i, n = (v: number) => v.toLocaleString('en-US');
  const shopOn = ready && (sc0.id === 'shop' || sc0.id === 'search');
  const beat = bs.i === i ? bs.b : 0, ff = bs.i === i ? bs.f : 0;
  const w = WORDS[beat % WORDS.length], g = GRADES[beat % GRADES.length];
  const tw = T(w[0]), tg = T(g[3]);

  return (
    <div className={'hia3 hia4 s-' + sc0.id} ref={root} aria-hidden="true">
      <div className={'h3-real' + (shopOn ? ' on' : '') + (sc0.id === 'shop' ? ' tilt' : '')}>
        {go ? <iframe ref={fr} src="/shop" title="Sam Electronics shop" tabIndex={-1} scrolling="no" onLoad={() => window.setTimeout(() => setReady(true), 1200)} style={{ width: VW + 'px', height: fh + 'px', transform: 'scale(' + sc + ')' }} /> : null}
      </div>
      <div className="h4-stage" key={key}>
        {sc0.id === 'open' ? (
          <div className="h4-open">
            <span className="h4-grain" />
            <img className="h4-mark" src="/assets/se-logo-metal-320.webp" alt="" />
            <b className="h4-sam">SAM</b>
            <b className="h4-elec">ELECTRONICS</b>
            <small className="h4-kick">{T('DEIRA · DUBAI · SINCE 2003')}</small>
            <Band text={T('QUALITY · WARRANTY · PRICE')} cls="a" />
            <Band text={T('EVERY PART · EVERY GRADE')} cls="b" />
          </div>
        ) : null}
        {sc0.id === 'tear' ? (
          <div className="h4-tear">
            <span className="h4-grid" />
            <small className="h4-k">{T('INSIDE EVERY PHONE')}</small>
            <img className="h4-film" src={FILM[ff]} alt="" />
            <span className="h4-layers">{LAYERS.map((l, k) => <b key={l} style={{ ['--k' as string]: k }}><i>{String(k + 1).padStart(2, '0')}</i>{T(l)}</b>)}</span>
            <span className="h4-count"><b>{n(stock)}</b><small>{T('PARTS IN STOCK · RIGHT NOW')}</small></span>
            <Band text={T('TESTED ON THE BENCH · SHIPPED WORLDWIDE')} cls="c" />
          </div>
        ) : null}
        {sc0.id === 'words' ? (
          <div className={'h4-words t' + (beat % 3)} key={'w' + beat}>
            <img src={'/assets/pose/' + w[1] + '-480.webp'} alt="" />
            <b style={fit(tw, 30)}>{tw}</b>
            <b className="ol" style={fit(tw, 30)}>{tw}</b>
            <small>{String((beat % WORDS.length) + 1).padStart(2, '0')} / {String(WORDS.length).padStart(2, '0')}</small>
            <i className="h4-flash" />
          </div>
        ) : null}
        {sc0.id === 'card1' ? (
          <div className="h4-card y"><small>{T('NOW OPEN')}</small><b style={fit(T('The parts shop.'), 16, 170)}>{T('The parts shop.')}</b><span>{n(all.length)} {T('parts')} · {brandsN} {T('brands')} · {n(modelsN)} {T('models')}</span><Band text={T('NOW OPEN')} cls="d" /></div>
        ) : null}
        {sc0.id === 'card2' ? (
          <div className="h4-card"><small>{T('SEARCH')}</small><b style={fit(T('Type it.'), 22, 100)}>{T('Type it.')}</b><b className="y" style={fit(T('Find it.'), 22, 100)}>{T('Find it.')}</b></div>
        ) : null}
        {sc0.id === 'brands' ? (
          <div className="h4-brands">
            {/* the show: a ring of brands spins, slows, and one is pulled out and selected; then the whole wall lands */}
            <span className="h4-ring3"><span className="rot">{BRANDS.slice(0, 12).map((b, k) => <span key={b} style={{ ['--k' as string]: k }}><SEBrandLogo brand={b} h={20} fit="96x22" color={brandInk(b)} /></span>)}</span></span>
            <span className="h4-sel"><SEBrandLogo brand={BRANDS[loop % 12]} h={34} fit="170x38" color={brandInk(BRANDS[loop % 12])} /><small>{T('IN STOCK')}</small></span>
            <span className="h4-bh"><b>{brandsN}</b><small>{T('BRANDS')}<br />{n(modelsN)} {T('MODELS')}</small></span>
            <span className="h4-tiles">{BRANDS.map((b, k) => <span key={b} style={{ ['--k' as string]: k }}><SEBrandLogo brand={b} h={22} fit="104x24" color={brandInk(b)} /></span>)}</span>
            <Band text={T('THE BRANDS WE STOCK')} cls="e" />
          </div>
        ) : null}
        {sc0.id === 'grades' ? (
          <div className={'h4-grades t' + (beat % 2)} key={'g' + beat}>
            <small className="h4-k">{T('EVERY GRADE · TESTED ON THE BENCH')}</small>
            <b className="ol" style={fit(tg, 34)}>{tg}</b>
            <span className="h4-spin"><GradeTag g={g[1]} name={g[2]} size="lg" /></span>
            <img src={'/assets/pose/' + g[0] + '-480.webp'} alt="" />
            <span className="h4-tag"><GradeTag g={g[1]} name={g[2]} size="lg" /></span>
            <i className="h4-flash" />
          </div>
        ) : null}
        {sc0.id === 'call' ? (
          <div className="h4-call">
            <span className="h4-grain" />
            <span className="h4-logo"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="100" /></svg><img src="/assets/se-logo-metal-320.webp" alt="" /></span>
            <b style={fit(T('EVERY PART.'), 15, 150)}>{T('EVERY PART.')}</b>
            <b className="y" style={fit(T('EVERY GRADE.'), 15, 150)}>{T('EVERY GRADE.')}</b>
            <span className="h4-btn">{T('Open the shop')} →</span>
            <span className="h4-ways"><i className="wa" />WhatsApp<i className="wc" />WeChat</span>
            <Band text={T('SAM ELECTRONICS · DEIRA · DUBAI')} cls="f" />
          </div>
        ) : null}
        <i className="h4-cut" />
      </div>
      <span className="h3-cam" />
      <span className="h3-home" />
    </div>
  );
}
