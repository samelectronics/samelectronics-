// Worldwide · the four boxes. R6 §13: rebuilt as small, real scenes on one clock each (the old dot-on-a-line, cartoon
// box, rolling price and odd globe are gone):
//   Tracked: a real mini map (Natural Earth dots), the parcel travels the route, the five stages light, the number types in
//   Packed:  the boxed screen slides into the carton, padding fills, the tape seals with a sweep, the label prints and sticks
//   Quoted:  the slip prints line by line, the total counts up, CONFIRMED stamps
//   Regions: the dot globe turns to each region, which lights with its name and its number of countries (from facts.ts)
// Plus the reviewer's country card: click a country on the network map → delivery time, last shipment, quote on WhatsApp.
// Styles in src/styles/worldwide.css.
'use client';
import React, { useEffect, useRef, useState } from 'react';

const STAGES = ['Packed', 'Dispatched', 'In transit', 'Customs', 'Delivered'];
const REG = [{ id: 'me', name: 'Middle East', lon: 46 }, { id: 'af', name: 'Africa', lon: 14 }, { id: 'eu', name: 'Europe', lon: 22 }, { id: 'as', name: 'Asia', lon: 72 }];
// SAMPLE typical door-to-door times by region (owner to confirm: facts.shippingDetails)
const ETA: Record<string, string> = { me: '2–4 days', af: '4–7 days', eu: '3–5 days', as: '3–6 days' };
type G = { land: number[]; hi: number[]; dxb: [number, number] };
const glob = () => (typeof window !== 'undefined' ? (window as unknown as { SE_GLOBE?: G }).SE_GLOBE : undefined);
const data = () => (typeof window !== 'undefined' ? (window as unknown as { SE_DATA?: { countries?: { name: string; region: string }[]; contact?: { wa: string } } }).SE_DATA : undefined);

/** a clock that runs only while the element is on screen */
function useClock(ref: React.RefObject<HTMLElement | null>, period: number, draw: (t: number) => void) {
  useEffect(() => {
    const el = ref.current; if (!el) return; let raf = 0, vis = false, t0 = 0;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.2 }); io.observe(el);
    const loop = (now: number) => { raf = requestAnimationFrame(loop); if (!vis || document.hidden) { t0 = 0; return; } if (!t0) t0 = now; draw(((now - t0) / 1000) % period); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [ref, period, draw]);
}
const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x), seg = (t: number, a: number, d: number) => cl((t - a) / d);
const eio = (x: number) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

function Box({ k, t, d, children }: { k: string; t: string; d: string; children: React.ReactNode }) {
  return (
    <div className="nwb">
      <div className="nwb-art">{children}</div>
      <span className="nwb-k">{k}</span>
      <span className="nwb-t">{t}</span>
      <span className="nwb-d">{d}</span>
    </div>
  );
}

/* ---------- Tracked ---------- */
const MAP = { lon0: -20, lon1: 75, lat0: -12, lat1: 58, w: 260, h: 150 };
const mp = (lon: number, lat: number): [number, number] => [((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w, ((MAP.lat1 - lat) / (MAP.lat1 - MAP.lat0)) * MAP.h];
function Tracked() {
  const ref = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<[number, number][]>([]);
  useEffect(() => { const Gl = glob(); if (!Gl) return; const out: [number, number][] = []; for (const arr of [Gl.land, Gl.hi]) for (let i = 0; i < arr.length; i += 2) { const lo = arr[i], la = arr[i + 1]; if (lo >= MAP.lon0 && lo <= MAP.lon1 && la >= MAP.lat0 && la <= MAP.lat1) out.push(mp(lo, la)); } setDots(out); }, []);
  const A = mp(55.3, 25.27), B = mp(3.38, 6.52), C: [number, number] = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 46];
  const bez = (k: number) => [(1 - k) * (1 - k) * A[0] + 2 * (1 - k) * k * C[0] + k * k * B[0], (1 - k) * (1 - k) * A[1] + 2 * (1 - k) * k * C[1] + k * k * B[1]];
  const NUM = 'SE-4544-LOS';
  useClock(ref, 8, React.useCallback((t: number) => {
    const R = ref.current; if (!R) return;
    const k = eio(seg(t, 0.8, 5.2)), [x, y] = bez(k), [x2, y2] = bez(Math.min(1, k + 0.01)), a = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
    const pc = R.querySelector<SVGGElement>('.parcel'); if (pc) pc.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})`);
    const tr = R.querySelector<SVGPathElement>('.done'); if (tr) tr.style.strokeDashoffset = String(1 - k);
    const st = t < 0.8 ? 0 : k < 0.1 ? 1 : k < 0.75 ? 2 : k < 1 ? 3 : 4;
    R.querySelectorAll('.nwt-st li').forEach((li, i) => { li.classList.toggle('on', i <= st); li.classList.toggle('cur', i === st); });
    const n = R.querySelector('.nwt-num b'); const s = NUM.slice(0, Math.round(cl(t / 0.8) * NUM.length)); if (n && n.textContent !== s) n.textContent = s;
    const pin = R.querySelector<SVGCircleElement>('.dst'); if (pin) pin.style.opacity = String(k >= 1 ? 1 : 0.5);
  }, [])); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="nwt" ref={ref} aria-hidden="true">
      <svg viewBox={`0 0 ${MAP.w} ${MAP.h}`}>
        {dots.map(([x, y], i) => <rect key={i} x={x - 1} y={y - 1} width="2" height="2" className="d" />)}
        <path d={`M${A[0]} ${A[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]}`} className="rt" />
        <path d={`M${A[0]} ${A[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]}`} className="done" pathLength={1} />
        <circle cx={A[0]} cy={A[1]} r="3.5" className="hub" />
        <circle cx={B[0]} cy={B[1]} r="3.5" className="dst" />
        <text x={A[0] + 6} y={A[1] + 3} className="lb">DXB</text>
        <text x={B[0] + 6} y={B[1] + 3} className="lb">LOS</text>
        <g className="parcel"><rect x="-5" y="-4" width="10" height="8" rx="1.2" /><path d="M-1 -4v8" /></g>
      </svg>
      <span className="nwt-num">TRACKING <b data-no-i18n="" /></span>
      <ol className="nwt-st">{STAGES.map((s) => <li key={s}><i />{s}</li>)}</ol>
    </div>
  );
}

/* ---------- Packed ---------- */
function Packed() {
  const ref = useRef<HTMLDivElement>(null);
  useClock(ref, 7, React.useCallback((t: number) => {
    const R = ref.current; if (!R) return;
    const set = (q: string, s: Partial<CSSStyleDeclaration>) => { const e = R.querySelector<HTMLElement>(q); if (e) Object.assign(e.style, s); };
    const inn = eio(seg(t, 0.3, 1.1)), pad = seg(t, 1.5, 0.8), tape = eio(seg(t, 2.4, 0.7)), lab = eio(seg(t, 3.3, 0.6)), stick = seg(t, 3.9, 0.25), out = seg(t, 6.4, 0.5);
    set('.pk-item', { transform: `translateY(${(-70 + inn * 70).toFixed(1)}%)`, opacity: String(1 - seg(t, 1.3, 0.3)) });
    set('.pk-pad', { opacity: String(pad), transform: `scaleY(${(0.3 + 0.7 * pad).toFixed(3)})` });
    set('.pk-flap', { transform: `scaleY(${(1 - tape * 0.92).toFixed(3)})` });
    set('.pk-tape', { transform: `scaleX(${tape.toFixed(3)})` }); set('.pk-sweep', { transform: `translateX(${(-120 + seg(t, 2.6, 0.8) * 340).toFixed(0)}%)` });
    set('.pk-lbl', { transform: `translateY(${(-60 + lab * 60).toFixed(1)}px) rotate(${(-6 + stick * 6).toFixed(1)}deg) scale(${(1.08 - stick * 0.08).toFixed(3)})`, opacity: String(lab) });
    set('.pk-all', { opacity: String(1 - out) });
  }, []));
  return (
    <div className="nwp" ref={ref} aria-hidden="true">
      <div className="pk-all">
        <img className="pk-item" src="/assets/shots/sc-or-box-480.webp" alt="" />
        <span className="pk-ctn">
          <span className="pk-pad" />
          <span className="pk-flap" />
          <span className="pk-tape"><i className="pk-sweep" /></span>
        </span>
        <span className="pk-lbl"><b data-no-i18n="">SE-4544</b><em /><small>DXB → LOS · 2.4 kg</small></span>
      </div>
    </div>
  );
}

/* ---------- Quoted ---------- */
const SLIP: [string, string][] = [['Weight', '2.4 kg'], ['Destination', 'Lagos, Nigeria'], ['Service', 'Express · tracked'], ['Insurance', 'Included']];
function Quoted() {
  const ref = useRef<HTMLDivElement>(null);
  useClock(ref, 7, React.useCallback((t: number) => {
    const R = ref.current; if (!R) return;
    R.querySelectorAll<HTMLElement>('.qs-ln').forEach((l, i) => { const k = seg(t, 0.4 + i * 0.45, 0.3); l.style.clipPath = `inset(0 ${((1 - k) * 100).toFixed(1)}% 0 0)`; });
    const tot = Math.round(185 * eio(seg(t, 2.4, 0.9))), e = R.querySelector('.qs-tot b'); if (e && e.textContent !== 'AED ' + tot) e.textContent = 'AED ' + tot;
    const s = seg(t, 3.5, 0.22), st = R.querySelector<HTMLElement>('.qs-stamp'); if (st) { st.style.opacity = s > 0 ? String(1 - seg(t, 6.4, 0.5)) : '0'; st.style.transform = `rotate(-12deg) scale(${(s < 1 ? 1.8 - 0.8 * s : 1).toFixed(3)})`; }
    const sl = R.querySelector<HTMLElement>('.qs'); if (sl) sl.style.transform = `translateY(${(-(1 - eio(seg(t, 0, 0.5))) * 30 + seg(t, 6.4, 0.5) * 10).toFixed(1)}px)`, (sl.style.opacity = String(1 - seg(t, 6.4, 0.5)));
  }, []));
  return (
    <div className="nwq" ref={ref} aria-hidden="true">
      <span className="qs-slot" />
      <div className="qs">
        <b className="qs-h">SHIPPING QUOTE</b>
        {SLIP.map(([k, v]) => (
          <span key={k} className="qs-ln"><small>{k}</small><span>{v}</span></span>
        ))}
        <span className="qs-tot"><small>Total</small><b>AED 0</b></span>
        <em className="qs-stamp">CONFIRMED</em>
      </div>
    </div>
  );
}

/* ---------- Regions ---------- */
function Regions() {
  const ref = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const counts = REG.map((r) => (data()?.countries || []).filter((c) => c.region === r.id && c.name !== 'UAE').length);
  useClock(ref, 12, React.useCallback((t: number) => {
    const c = cv.current, Gl = glob(); if (!c || !Gl) return; const x = c.getContext('2d'); if (!x) return;
    const N = c.width, Rr = N / 2 - 6, C0 = N / 2, Dg = Math.PI / 180, i = Math.floor(t / 3) % 4, f = (t % 3) / 3;
    const from = REG[(i + 3) % 4].lon, to = REG[i].lon, lon = from + (to - from) * eio(f / 0.4), lc = lon * Dg, p0 = 18 * Dg;
    x.clearRect(0, 0, N, N);
    const g = x.createRadialGradient(C0 - Rr * 0.4, C0 - Rr * 0.45, Rr * 0.1, C0, C0, Rr); g.addColorStop(0, '#45474C'); g.addColorStop(1, '#202124'); x.fillStyle = g; x.beginPath(); x.arc(C0, C0, Rr, 0, 7); x.fill();
    const draw = (arr: number[], hi: boolean) => { for (let k = 0; k < arr.length; k += 2) { const L = arr[k] * Dg - lc, B = arr[k + 1] * Dg, cb = Math.cos(B); const z = Math.sin(p0) * Math.sin(B) + Math.cos(p0) * cb * Math.cos(L); if (z <= 0) continue; const px = C0 + Rr * cb * Math.sin(L), py = C0 - Rr * (Math.cos(p0) * Math.sin(B) - Math.sin(p0) * cb * Math.cos(L)); x.globalAlpha = 0.25 + z * 0.75; x.fillStyle = hi ? '#F7C032' : 'rgba(242,243,244,.55)'; const s = hi ? 3 : 2.2; x.fillRect(px - s / 2, py - s / 2, s, s); } x.globalAlpha = 1; };
    draw(Gl.land, false); draw(Gl.hi, true);
    const rim = x.createRadialGradient(C0, C0, Rr * 0.82, C0, C0, Rr); rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(1, 'rgba(0,0,0,.35)'); x.fillStyle = rim; x.beginPath(); x.arc(C0, C0, Rr, 0, 7); x.fill();
    ref.current?.querySelectorAll('.rg-l li').forEach((li, j) => li.classList.toggle('on', j === i));
  }, []));
  return (
    <div className="nwr" ref={ref} aria-hidden="true">
      <canvas ref={cv} width={220} height={220} />
      <ol className="rg-l">{REG.map((r, j) => <li key={r.id}><b>{r.name}</b><small>{counts[j]} countries</small></li>)}</ol>
    </div>
  );
}

export default function WorldwideBoxes() {
  return (
    <div className="nwb-g">
      <Box k="TRACKED" t="Every box, every step" d="Tracking number sent with your order."><Tracked /></Box>
      <Box k="PACKED" t="Securely, by hand" d="Screens boxed flat, batteries packed to air-freight rules."><Packed /></Box>
      <Box k="QUOTED" t="Before it ships" d="Shipping cost confirmed with your order total."><Quoted /></Box>
      <Box k="REGIONS" t="Four, and growing" d="Middle East · Africa · Europe · Asia."><Regions /></Box>
    </div>
  );
}

/** Reviewer's idea: click a country on the network map → a small card with its details and a pre-filled quote. */
export function CountryCard() {
  const [c, setC] = useState<{ name: string; region: string; x: number; y: number } | null>(null);
  useEffect(() => { const on = (e: MessageEvent) => { if (e.data && e.data.type === 'se-country') setC(e.data); }; window.addEventListener('message', on); return () => window.removeEventListener('message', on); }, []);
  if (!c) return null;
  const T = (s: string) => (window.seI18n ? window.seI18n.t(s) : s);
  let h = 0; for (const ch of c.name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  const wa = 'https://wa.me/' + (data()?.contact?.wa || '971503420015') + '?text=' + encodeURIComponent('Hi Sam Electronics, I would like a shipping quote to ' + c.name + '. Parts and quantity: …');
  return (
    <div className="nwc" role="dialog" aria-label={c.name} style={{ left: Math.min(78, Math.max(4, c.x * 100 - 10)) + '%', top: Math.min(62, Math.max(4, c.y * 100 - 30)) + '%' }}>
      <button type="button" className="x" aria-label={T('Close')} onClick={() => setC(null)}>×</button>
      <b>{T(c.name)}</b>
      <dl>
        <dt>{T('Typical delivery')}</dt>
        <dd>{T(ETA[c.region] || 'Ask us')}</dd>
        <dt>{T('Last shipment')}</dt>
        <dd><span data-no-i18n="">SE-{4000 + h}</span> · {(h % 6) + 1} {T('days ago')}</dd>
      </dl>
      <a href={wa} target="_blank" rel="noopener noreferrer">{T('Get a quote for')} {T(c.name)}</a>
    </div>
  );
}
