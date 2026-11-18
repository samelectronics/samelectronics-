'use client';
// Owner (15 Nov, after the shop): the hero iPad runs OUR shop like someone is using it.
// - a real iPad top: time (Dubai), signal, Wi-Fi, a battery that drains then charges, and a camera island like the phone
// - the shop's bar stays fixed (logo, a search that types, the cart) with the category chips under it
// - the products scroll forward forever and never repeat: they come from the real catalogue in a shuffled order, a new
//   row is added at the bottom as one leaves the top (396 parts before anything could come back)
// - every few seconds a finger taps a part: it opens (picture, grades, price), "Add to cart", the badge counts up,
//   it closes and the browsing carries on; now and then the chips switch category
// Everything is decorative (aria-hidden) and pauses when the hero is off screen or the tab is hidden.
import React, { useEffect, useRef, useState } from 'react';
import { data, products, shots, type Product } from '@/lib/catalog';
import { T } from '@/components/site/ui';

const RH = 196; // one row of two cards, px (owner, 16 Nov: the cards look like the real shop's)
const HH = 318; // the shop's own header (graphite hero, tabs, category tiles) before the grid
const SPEED = 15; // px per second
const CHIPS = ['All', 'Screens', 'Batteries', 'Flex cables', 'Back covers', 'Cameras'];
const CAT = ['', 'SCR', 'BAT', 'FLX', 'BCV', 'CAM'];
const QUERIES = ['iPhone 13 screen', 'A54 battery', 'S23 back cover', 'Redmi Note 12 flex', 'Pixel 7 camera'];

const small = (u: string) => u.replace(/-480\.webp$/, '-240.webp');
type Row = { k: number; a: Product; b: Product };

/** Owner (16 Nov): "the iPad is not running the real shop". It now runs the REAL /shop page in a frame, scaled to the
 *  iPad screen, scrolling slowly by itself (pause, scroll, pause, back to the top). It loads only after the home page
 *  has finished loading and while the hero is on screen; until then the drawn shop below stands in for it. */
const VW = 880; // owner (18 Nov): "less zoomed, 3 to 4 items per row": a slightly wider iPad, three parts per row
const SB = 52; // the iPad status bar (virtual px); the shop's own header sits just under it, like a real app
function RealShop({ live, onReady }: { live: React.MutableRefObject<boolean>; onReady: () => void }) {
  const box = useRef<HTMLDivElement>(null), fr = useRef<HTMLIFrameElement>(null), [go, setGo] = useState(false), [ready, setReady] = useState(false), [sc, setSc] = useState(0.46), [h, setH] = useState(1100);
  const [tap, setTap] = useState<{ x: number; y: number; n: number } | null>(null), [clock, setClock] = useState(''), [ink, setInk] = useState<'dark' | 'light'>('light'), [tint, setTint] = useState('');
  useEffect(() => {
    const start = () => { const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }; (w.requestIdleCallback || ((f: () => void) => window.setTimeout(f, 1200)))(() => setGo(true), { timeout: 4000 }); };
    if (document.readyState === 'complete') window.setTimeout(start, 1200); else window.addEventListener('load', () => window.setTimeout(start, 1200), { once: true });
    const c = () => { const d = new Date(); setClock(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dubai' }) + '  ' + d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Dubai' })); };
    c(); const iv = window.setInterval(c, 15000); return () => window.clearInterval(iv);
  }, []);
  useEffect(() => { const el = box.current; if (!el) return; const fit = () => { const k = el.offsetWidth / VW; setSc(k); setH(Math.ceil(el.offsetHeight / k)); }; fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect(); }, []);
  // the frame sleeps (display: none, the browser stops drawing it) whenever the hero is off screen
  const [shown, setShown] = useState(true);
  useEffect(() => { const el = box.current?.closest('section') || box.current; if (!el) return; const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting)); io.observe(el); return () => io.disconnect(); }, []);
  // owner (18 Nov): "the time and date should adapt dark/light": like iOS, the status bar has no band of its own; its ink
  // turns dark over a light screen and white over a dark one (we read the colour of whatever sits under it)
  useEffect(() => {
    if (!ready) return;
    // like Safari on an iPad: the bar takes the colour of the page right under it, and its ink follows
    const rgb = (c: string) => { const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); return !m || (m[4] !== undefined && +m[4] < 0.5) ? null : [+m[1], +m[2], +m[3]]; };
    const probe = () => { const d = fr.current?.contentDocument, w = fr.current?.contentWindow; if (!d || !w) return; let el = d.elementFromPoint(VW * 0.5, SB + 6) as HTMLElement | null, c: number[] | null = null; while (el && !c) { c = rgb(w.getComputedStyle(el).backgroundColor); el = el.parentElement; } if (!c) c = [247, 247, 245]; const l = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; setTint('rgb(' + c.join(',') + ')'); setInk(l > 0.6 ? 'dark' : 'light'); };
    probe(); const iv = window.setInterval(probe, 500); return () => window.clearInterval(iv);
  }, [ready]);
  // a customer using it: a quick flick, a pause to look, sometimes open a part, read it, close it, carry on;
  // after a while back to the top
  useEffect(() => {
    if (!ready) return; let alive = true, n = 0; const tm: number[] = [];
    const wait = (ms: number) => new Promise<void>((r) => tm.push(window.setTimeout(r, ms)));
    const W = () => fr.current?.contentWindow || null, D = () => fr.current?.contentDocument || null;
    const awake = async () => { while (alive && (!live.current || document.hidden)) await wait(800); };
    // owner (18 Nov): "the shop inside should scroll smoother": a longer, eased glide (slow in, slow out) like a thumb
    const flick = async (dy: number) => { const w = W(); if (!w) return; const y0 = w.scrollY, t0 = performance.now(), dur = 1100 + Math.abs(dy) * 1.4;
      await new Promise<void>((res) => { const f = (t: number) => { const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; w.scrollTo(0, y0 + dy * e); if (k < 1 && alive) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); };
    const press = async (el: Element | null) => { if (!el) return false; const r = el.getBoundingClientRect(); setTap({ x: (r.left + r.width / 2) * sc, y: (r.top + r.height / 2) * sc, n: ++n }); await wait(320); (el as HTMLElement).click(); return true; };
    const run = async () => {
      await wait(1600);
      while (alive) {
        await awake(); const w = W(), d = D(); if (!w || !d) { await wait(1000); continue; }
        const max = d.documentElement.scrollHeight - w.innerHeight;
        if (w.scrollY > Math.min(max - 50, 5200)) { await wait(1400); w.scrollTo({ top: 0, behavior: 'smooth' }); await wait(2600); continue; }
        await flick(220 + Math.random() * 260); await wait(1300 + Math.random() * 1500);
        if (Math.random() < 0.42) { // open a part that is fully on screen
          const cards = Array.from(d.querySelectorAll('.pc-img')).filter((c) => { const r = c.getBoundingClientRect(); return r.top > 140 && r.bottom < w.innerHeight - 60; });
          if (cards.length && (await press(cards[Math.floor(Math.random() * cards.length)]))) {
            await wait(2400); const pv = d.querySelector('.pv-veil'); if (pv) { for (let i = 0; i < 2; i++) { const t0 = pv.scrollTop; pv.scrollTo({ top: t0 + 280, behavior: 'smooth' }); await wait(1500); } await wait(900); await press(d.querySelector('.pv .sp-x')); await wait(900); }
          }
        }
      }
    };
    run(); return () => { alive = false; tm.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, sc]);
  return (
    <div ref={box} className={'hi-real' + (ready ? ' on' : '') + (shown ? '' : ' off')} aria-hidden="true">
      {go ? <iframe ref={fr} src="/shop" title="Sam Electronics shop" tabIndex={-1} scrolling="no" onLoad={() => window.setTimeout(() => { setReady(true); onReady(); }, 900)} style={{ width: VW + 'px', height: h + 'px', transform: 'scale(' + sc + ')' }} /> : null}
      <div className={'hi-sb ' + ink} style={{ height: SB * sc + 'px', ['--tint' as string]: tint || undefined }}><b>{clock}</b><span className="hi-isl" aria-hidden="true"><i /></span><span><svg width="13" height="9" viewBox="0 0 13 9"><path d="M6.5 8.6 4.5 6.4a2.8 2.8 0 0 1 4 0zM2.6 4.6a5.5 5.5 0 0 1 7.8 0l-1.2 1.2a3.8 3.8 0 0 0-5.4 0zM.6 2.6a8.3 8.3 0 0 1 11.8 0l-1.2 1.2a6.6 6.6 0 0 0-9.4 0z" /></svg><small>100%</small><i /></span></div>
      {tap ? <span key={tap.n} className="hs-tap go hi-rtap" style={{ left: tap.x + 'px', top: tap.y + 'px' }} /> : null}
    </div>
  );
}

export default function HeroIpadShop() {
  const [time, setTime] = useState(''), [bat, setBat] = useState(86), [chg, setChg] = useState(false), [cart, setCart] = useState(2);
  const [rows, setRows] = useState<Row[]>([]), [chip, setChip] = useState(0), [q, setQ] = useState(''), [tap, setTap] = useState<{ x: number; y: number; n: number } | null>(null);
  const [head, setHead] = useState(true), headRef = useRef(true), [flash, setFlash] = useState(0), [open, setOpen] = useState<Product | null>(null), [added, setAdded] = useState(0), [press, setPress] = useState<string | null>(null);
  const mock = useRef(true), root = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null), off = useRef(0), seq = useRef<Product[]>([]), pos = useRef(0), k = useRef(0), live = useRef(true), paused = useRef(false);

  // the status bar
  useEffect(() => {
    const clock = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }));
    clock(); const c = window.setInterval(clock, 15000);
    const b = window.setInterval(() => setBat((v) => { if (chg) { if (v >= 96) { setChg(false); return v; } return v + 2; } if (v <= 21) { setChg(true); return v; } return v - 1; }), 9000);
    return () => { clearInterval(c); clearInterval(b); };
  }, [chg]);

  // the catalogue, shuffled once (a stable shuffle per visit), served two at a time
  const chipRef = useRef(0), lastOpen = useRef('');
  // the next part not shown yet; with a category chip on, the next one of that category (like a real filter)
  const next = (): Product => { const s = seq.current, c = CAT[chipRef.current]; for (let i = 0; i < s.length; i++) { const p = s[pos.current % s.length]; pos.current++; if (!c || p.category === c) return p; } return s[pos.current++ % s.length]; };
  const row = (): Row => ({ k: k.current++, a: next(), b: next() });
  useEffect(() => {
    let iv = 0;
    const go = () => { const all = products().filter((p) => p.img); if (!all.length) return false; const a = all.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } seq.current = a; setRows([row(), row(), row(), row(), row()]); return true; };
    if (!(data() && shots() && go())) iv = window.setInterval(() => { if (data() && shots() && go()) window.clearInterval(iv); }, 200);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // only run while the hero is on screen and the tab is visible
  useEffect(() => { const el = root.current; if (!el || typeof IntersectionObserver === 'undefined') return; const io = new IntersectionObserver(([e]) => { live.current = e.isIntersecting; }); io.observe(el); return () => io.disconnect(); }, []);

  // the endless scroll: move the list up; when a whole row has left the top, drop it and add a new one at the bottom
  useEffect(() => {
    if (!rows.length) return; let raf = 0, last = performance.now();
    const f = (t: number) => { const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (live.current && !document.hidden && !paused.current) { off.current += SPEED * dt; if (headRef.current && off.current >= HH) { off.current -= HH; headRef.current = false; setHead(false); } else if (!headRef.current && off.current >= RH) { off.current -= RH; setRows((r) => [...r.slice(1), row()]); } if (track.current) track.current.style.transform = 'translate3d(0,' + (-off.current).toFixed(2) + 'px,0)'; }
      raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length > 0]);

  // the person using it: type a search now and then, switch a chip, tap a part, add it, close
  useEffect(() => {
    if (!rows.length) return; const tm: number[] = []; let n = 0, alive = true;
    const at = (ms: number, fn: () => void) => tm.push(window.setTimeout(() => { if (alive) fn(); }, ms));
    const cycle = () => {
      if (!alive) return; n++;
      if (!mock.current) return;
      if (!live.current || document.hidden) { at(2000, cycle); return; }
      if (n % 3 === 0) { // type a search, then clear it
        const s = QUERIES[(n / 3) % QUERIES.length | 0]; for (let i = 1; i <= s.length; i++) at(i * 70, () => setQ(s.slice(0, i))); at(s.length * 70 + 1600, () => setQ('')); at(s.length * 70 + 2600, cycle); return; }
      if (n % 4 === 0) { // pick the next category chip: the list refreshes with that category, from the top
        const c = (chipRef.current + 1) % CHIPS.length; chipRef.current = c; setChip(c); setTap({ x: 40 + (c % 4) * 78, y: 110, n: n + 2000 }); setFlash((f) => f + 1);
        at(260, () => { off.current = HH - 40; headRef.current = true; setHead(true); if (track.current) track.current.style.transform = 'translate3d(0,' + (-(HH - 40)) + 'px,0)'; setRows([row(), row(), row(), row(), row()]); }); at(2600, cycle); return; }
      // tap a card in the second visible row (left or right), open it, add to cart, close
      const sc = root.current, tr = track.current; if (!sc || !tr) { at(2000, cycle); return; }
      const cards = Array.from(tr.querySelectorAll<HTMLElement>('.hi-card')), sr = sc.getBoundingClientRect(), z = sr.width / sc.offsetWidth || 1;
      const vis = cards.filter((c) => { const r = c.getBoundingClientRect(); return (r.top - sr.top) / z > 140 && (r.bottom - sr.top) / z < sc.offsetHeight - 30; });
      const pool = vis.filter((v) => v.dataset.id !== lastOpen.current), c = pool[(n * 7) % Math.max(1, pool.length)]; if (c) lastOpen.current = c.dataset.id || ''; if (!c) { at(2000, cycle); return; }
      const r = c.getBoundingClientRect(), x = (r.left - sr.left + r.width / 2) / z, y = (r.top - sr.top + r.height * 0.42) / z, id = c.dataset.id || '';
      const p = seq.current.find((pp) => pp.id === id) || null;
      setTap({ x, y, n }); setPress(id); paused.current = true;
      at(380, () => { setPress(null); setOpen(p); });
      at(2300, () => setTap({ x: sc.offsetWidth * 0.5, y: sc.offsetHeight - 40, n: n + 1000 }));
      at(2600, () => { setAdded((a) => a + 1); window.setTimeout(() => setCart((v) => (v >= 9 ? 2 : v + 1)), 350); });
      at(4300, () => { setOpen(null); setTap(null); paused.current = false; });
      at(6200, cycle);
    };
    at(2500, cycle);
    return () => { alive = false; tm.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length > 0]);

  const D = data();
  const card = (p: Product) => (
    <span className={'hi-card' + (press === p.id ? ' press' : '')} data-id={p.id} key={p.id}>
      <span className="hi-img"><span className={'hi-gr g-' + p.grade}>{p.gradeName}</span><img src={small(p.img)} alt="" loading="lazy" decoding="async" /></span>
      <b>{p.title}</b>
      <span className="hi-pr"><em>AED {p.price}</em><small>· {T('SAMPLE')}</small></span>
      <span className="hi-stk"><i />{T('In stock')}</span>
      <span className="hi-addb"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 7h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>{T('Add to cart')}</span>
    </span>
  );
  const TILES: [string, string, string][] = [['Screens', 'SCR', 'solo-scr'], ['Batteries', 'BAT', 'solo-bat'], ['Flex cables', 'FLX', 'solo-flx'], ['Back covers', 'BCV', 'solo-bcv'], ['Cameras', 'CAM', 'solo-cam']];
  const all = products(), cnt = (c: string) => all.filter((p) => p.category === c).length;
  const shopHead = (
    <div className="hi-head">
      <div className="hi-hero">
        <span className="hi-crumb">{T('Home')} · {T('Shop')}</span>
        <span className="hi-eb">{T('THE PARTS SHOP')}</span>
        <b className="hi-h1">{T('Every part.')}<br /><em>{T('Every grade.')}</em></b>
        <span className="hi-stats"><span><b>{all.length}</b><small>{T('parts')}</small></span><span><b>{D?.models.length || 0}</b><small>{T('models')}</small></span><span><b>{D?.brands.length || 0}</b><small>{T('brands')}</small></span></span>
        <span className="hi-sbar"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><span>{T('Search')} “iPhone 13 screen”</span><i>{T('Search')}</i></span>
      </div>
      <div className="hi-tabs"><span className="on"><b>{T('Everything')}</b><i>{all.length}</i></span><span><b>{T('Offers')}</b></span><span><b>{T('New arrivals')}</b></span></div>
      <div className="hi-tiles">{TILES.map(([n, c, img], i) => <span key={c} className={chip === i + 1 ? 'on' : ''}><img src={'/assets/pose/' + img + '-480.webp'} alt="" /><b>{T(n)}</b><small>{cnt(c)} {T('parts')}</small></span>)}</div>
    </div>
  );
  return (
    <div className="hero-shop hi" ref={root} aria-hidden="true">
      <div className="hi-status">
        <b>{time}</b>
        <span className="hi-isl"><i /></span>
        <span className="hi-ic">
          <svg width="15" height="9" viewBox="0 0 15 9"><rect x="0" y="6" width="2.6" height="3" rx=".6" /><rect x="4" y="4" width="2.6" height="5" rx=".6" /><rect x="8" y="2" width="2.6" height="7" rx=".6" /><rect x="12" y="0" width="2.6" height="9" rx=".6" opacity=".35" /></svg>
          <svg width="13" height="9" viewBox="0 0 13 9"><path d="M6.5 8.6 4.5 6.4a2.8 2.8 0 0 1 4 0zM2.6 4.6a5.5 5.5 0 0 1 7.8 0l-1.2 1.2a3.8 3.8 0 0 0-5.4 0zM.6 2.6a8.3 8.3 0 0 1 11.8 0l-1.2 1.2a6.6 6.6 0 0 0-9.4 0z" /></svg>
          <i className={'hs-bat' + (chg ? ' chg' : bat < 25 ? ' low' : '')}><i style={{ width: bat + '%' }} /></i>
          <small>{bat}%</small>
        </span>
      </div>
      <div className="hi-bar">
        <span className="hi-logo"><img src="/assets/se-logo-320.webp" alt="" /><b>SAM ELECTRONICS</b></span>
        <span className="hi-search"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>{q ? <span className="hi-q">{q}<i /></span> : <span className="hi-ph">{T('Search any part, model or brand')}</span>}</span>
        <span className="hi-cart"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 7h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg><b key={cart}>{cart}</b></span>
      </div>
      <div className="hi-feed">
        <div className={'hi-track' + (flash ? ' f' + (flash % 2) : '')} ref={track}>
          {head ? shopHead : null}
          {rows.map((r) => <div className="hi-row" key={r.k}>{card(r.a)}{card(r.b)}</div>)}
        </div>
      </div>
      {open ? (
        <div className="hi-sheet" key={open.id}>
          <span className="hi-grab" />
          <span className="hi-simg"><img src={open.img} alt="" decoding="async" /></span>
          <span className="hi-sk">{open.brandName} · {open.catName}</span>
          <b className="hi-st">{open.title}</b>
          <span className="hi-grades">{Object.entries(D?.gradeNames || {}).slice(0, 4).map(([g, nme]) => <i key={g} className={g === open.grade ? 'on' : ''}>{nme}</i>)}</span>
          <span className="hi-sp"><em>AED {open.price}</em><small>{T('In stock')}</small></span>
          <span className={'hi-add' + (added ? ' go' : '')} key={'a' + added}>{T('Add to cart')}</span>
        </div>
      ) : null}
      <RealShop live={live} onReady={() => { paused.current = true; mock.current = false; }} />
      {tap ? <span key={tap.n} className="hs-tap go" style={{ left: tap.x + 'px', top: tap.y + 'px' }} /> : null}
      <span key={'o' + added} className={'hs-toast' + (added ? ' go' : '')}><i>✓</i> {T('Added to cart')}</span>
    </div>
  );
}
