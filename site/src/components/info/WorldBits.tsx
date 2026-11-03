'use client';
// R10 P8 · Worldwide: a live route map (land dots from public/se-globe-data.js, the 28 countries we ship to, air routes
// with planes flying them and sea lanes with ships), plus how we ship to each region and customs notes.
// Times are typical planning times (owner to confirm, facts.shippingDetails); every shipment is quoted with its own time.
import React, { useEffect, useMemo, useState } from 'react';
import { T } from '@/components/site/ui';

type G = { land: number[]; ctr: number[][]; dxb: number[] };
type C = { name: string; region: string };
const W = 1000, H = 560, L0 = -26, L1 = 100, A0 = -14, A1 = 66;
const px = (lon: number, lat: number) => [((lon - L0) / (L1 - L0)) * W, ((A1 - lat) / (A1 - A0)) * H];
// sea lanes (lon, lat) from Jebel Ali: Suez to the Med, East Africa, Karachi/Mumbai, West Africa round the Cape is too long: by air.
const SEA: [string, number[][]][] = [
  ['eu', [[55.0, 25.1], [56.4, 26.4], [58.6, 23.4], [60, 19], [54, 14], [46, 12.4], [43.4, 12.7], [40, 17], [37.5, 22], [34.5, 27.5], [32.5, 30.2], [31.8, 31.6], [26, 33.6], [15, 36.5], [5, 37.6], [-2, 36.4]]],
  ['af', [[55.0, 25.1], [56.4, 26.4], [58.6, 23.4], [60, 19], [55, 12.5], [51.5, 6], [46, -1], [41, -3.5], [39.7, -4.05]]],
  ['as', [[55.0, 25.1], [56.4, 26.4], [60, 24.4], [64, 24.2], [67, 24.8]]],
];
// main trade city per country (lon, lat); pins are found by name, so the list order never matters
const POS: Record<string, [number, number]> = { UK: [-0.13, 51.5], Spain: [-3.7, 40.42], Romania: [26.1, 44.43], 'Türkiye': [28.98, 41.01], Azerbaijan: [49.87, 40.41], Syria: [36.29, 33.51], Lebanon: [35.5, 33.89], Iraq: [44.37, 33.31], Iran: [51.39, 35.69], Tunisia: [10.18, 36.81], Algeria: [3.06, 36.75], Morocco: [-7.59, 33.57], Libya: [13.19, 32.89], Egypt: [31.24, 30.04], 'Saudi Arabia': [46.68, 24.71], Oman: [58.41, 23.59], Yemen: [44.21, 15.37], Sudan: [32.53, 15.5], Eritrea: [38.93, 15.32], Ethiopia: [38.75, 9.03], Nigeria: [3.38, 6.52], Uganda: [32.58, 0.35], Russia: [37.62, 55.76], Ukraine: [30.52, 50.45], India: [72.88, 19.08], Pakistan: [67.01, 24.86], 'Burkina Faso': [-1.52, 12.37], Senegal: [-17.47, 14.72] };
const REG = [['all', 'All'], ['me', 'Middle East'], ['af', 'Africa'], ['eu', 'Europe'], ['as', 'Asia']] as const;

export function RouteMap({ countries, reg, setReg }: { countries: C[]; reg: string; setReg: (r: string) => void }) {
  const [g, setG] = useState<G | null>(null), [hov, setHov] = useState<number | null>(null);
  useEffect(() => { const iv = window.setInterval(() => { const x = (window as unknown as { SE_GLOBE?: G }).SE_GLOBE; if (x) { window.clearInterval(iv); setG(x); } }, 80); return () => window.clearInterval(iv); }, []);
  const land = useMemo(() => { if (!g) return ''; let d = ''; for (let i = 0; i < g.land.length; i += 2) { const lo = g.land[i], la = g.land[i + 1]; if (lo < L0 - 2 || lo > L1 + 2 || la < A0 - 2 || la > A1 + 2) continue; const [x, y] = px(lo, la); d += `M${x.toFixed(1)},${y.toFixed(1)}h0`; } return d; }, [g]);
  if (!g) return <div className="rm rm-wait" />;
  const [ox, oy] = px(g.dxb[0], g.dxb[1]);
  const arcs = countries.map((c, i) => { const p = POS[c.name]; if (!p) return null; const [x, y] = px(p[0], p[1]), dx = x - ox, dy = y - oy, d = Math.hypot(dx, dy) || 1; let nx = -dy / d, ny = dx / d; if (ny > 0) { nx = -nx; ny = -ny; } const b = Math.min(90, d * 0.22), cx = (ox + x) / 2 + nx * b, cy = (oy + y) / 2 + ny * b; return { c, i, x, y, d: `M${ox.toFixed(1)},${oy.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`, len: d }; }).filter(Boolean) as { c: C; i: number; x: number; y: number; d: string; len: number }[];
  const on = (r: string) => reg === 'all' || reg === r;
  const fly = arcs.filter((a, k) => on(a.c.region) && (reg !== 'all' || k % 3 === 0));
  return (
    <div className="rm">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T('Map of our shipping routes from Dubai')}>
        <defs><radialGradient id="rm-glow"><stop offset="0" stopColor="#F7C032" stopOpacity=".55" /><stop offset="1" stopColor="#F7C032" stopOpacity="0" /></radialGradient></defs>
        <path d={land} className="rm-land" />
        {SEA.map(([r, pts], k) => { const d = 'M' + pts.map((p) => px(p[0], p[1]).map((v) => v.toFixed(1)).join(',')).join(' L'); return (
          <g key={k} className={'rm-sea' + (on(r) ? '' : ' off')}><path id={'rm-s' + k} d={d} /><g className="rm-ship"><path transform="scale(1.5)" d="M-7,-2 L7,-2 L5,3 L-5,3 Z M-3,-2 L-3,-6 L2,-6 L2,-2" /><animateMotion dur={22 + k * 4 + 's'} repeatCount="indefinite" rotate="auto"><mpath href={'#rm-s' + k} /></animateMotion></g></g>); })}
        {arcs.map((a) => <path key={a.c.name} id={'rm-a' + a.i} d={a.d} className={'rm-arc' + (on(a.c.region) ? '' : ' off') + (hov === a.i ? ' hov' : '')} />)}
        {fly.map((a, k) => <g key={'p' + a.i} className="rm-plane"><path d="M7,0 L-3,-1.4 L-6,-5.5 L-7.6,-5.5 L-5.6,-1.2 L-8,-1 L-9.4,-3 L-10.4,-3 L-9.6,0 L-10.4,3 L-9.4,3 L-8,1 L-5.6,1.2 L-7.6,5.5 L-6,5.5 L-3,1.4 Z" /><animateMotion dur={(3.2 + a.len / 180).toFixed(1) + 's'} begin={'-' + (k * 1.3).toFixed(1) + 's'} repeatCount="indefinite" rotate="auto"><mpath href={'#rm-a' + a.i} /></animateMotion></g>)}
        {arcs.map((a) => <g key={'d' + a.i} className={'rm-pin' + (on(a.c.region) ? '' : ' off')} transform={`translate(${a.x.toFixed(1)},${a.y.toFixed(1)})`} onMouseEnter={() => setHov(a.i)} onMouseLeave={() => setHov(null)} onClick={() => setReg(a.c.region)}><circle r="9" className="rm-hit" /><circle r="3.4" />{hov === a.i ? <g className="rm-tip"><rect x="8" y="-24" width={a.c.name.length * 7.4 + 16} height="22" rx="6" /><text x="16" y="-9">{T(a.c.name)}</text></g> : null}</g>)}
        <circle cx={ox} cy={oy} r="34" fill="url(#rm-glow)" className="rm-pulse" /><circle cx={ox} cy={oy} r="5.5" className="rm-hub" />
        <text x={ox + 10} y={oy + 22} className="rm-hubt">DUBAI · DEIRA</text>
      </svg>
      <div className="rm-legend"><span><i className="a" />{T('Air routes')}</span><span><i className="s" />{T('Sea lanes')}</span><span className="rm-live"><b />{T('Live view')}</span></div>
      <div className="rm-tabs">{REG.map(([k, l]) => <button key={k} type="button" className={'sp-chip' + (reg === k ? ' on' : '')} onClick={() => setReg(k)}>{T(l)} <small>{k === 'all' ? countries.length : countries.filter((c) => c.region === k).length}</small></button>)}</div>
    </div>
  );
}

const WAYS: Record<string, { m: [string, string, string][]; c: string[] }> = {
  me: { m: [['Express courier', '1–3 days', 'Urgent parts, door to door'], ['Air cargo', '2–4 days', 'Bulk orders, best price per kilo'], ['Road freight', '3–7 days', 'Saudi Arabia, Oman and the Gulf']], c: ['A commercial invoice and packing list go with every shipment.', 'Duties and taxes are paid by the receiver on arrival, unless we agree otherwise.', 'Some routes need the importer’s company registration for clearance; we tell you before we ship.'] },
  af: { m: [['Express courier', '3–5 days', 'Urgent parts, door to door'], ['Air cargo', '3–7 days', 'Bulk orders to the main airports'], ['Sea freight', '3–5 weeks', 'Large orders via East African ports']], c: ['Some countries need a pre-shipment inspection certificate; we arrange it when needed.', 'Duties and taxes are paid by the receiver on arrival.', 'Batteries travel under dangerous-goods rules; some routes take them by cargo only.'] },
  eu: { m: [['Express courier', '2–4 days', 'Urgent parts, door to door'], ['Air cargo', '4–7 days', 'Bulk orders, best price per kilo'], ['Sea freight', '3–4 weeks', 'Large orders via the Suez route']], c: ['Import VAT and duties are charged on arrival.', 'Business imports to the EU and UK need your EORI number on the paperwork.', 'Batteries travel under dangerous-goods rules (UN3480 / UN3481).'] },
  as: { m: [['Express courier', '2–4 days', 'Urgent parts, door to door'], ['Air cargo', '2–5 days', 'Bulk orders, best price per kilo'], ['Sea freight', '1–2 weeks', 'Large orders to Karachi and the west coast of India']], c: ['India: business shipments need the importer’s IEC code.', 'Pakistan: business shipments need the importer’s NTN.', 'Duties and taxes are paid by the receiver on arrival.'] },
};
export function ShipWays({ reg }: { reg: string }) {
  const r = reg === 'all' ? 'me' : reg, w = WAYS[r];
  return (
    <div className="sw" data-rise>
      <div className="sw-m">
        <span className="sp-eb">{T('HOW WE SHIP')} · {T(REG.find((x) => x[0] === r)?.[1] || '')}</span>
        {w.m.map(([n, t, d], i) => <div key={n} className="sw-row"><span className="sw-ic">{i === 0 ? '⚡' : i === 1 ? '✈' : r === 'me' && i === 2 ? '⛟' : '⛴'}</span><b>{T(n)}</b><span className="mono sw-t">{t}</span><small>{T(d)}</small></div>)}
        <small className="sp-sample">{T('Typical times for planning. Every shipment is quoted with its own time and price.')}</small>
      </div>
      <div className="sw-c">
        <span className="sp-eb">{T('CUSTOMS NOTES')}</span>
        <ul>{w.c.map((x) => <li key={x}>{T(x)}</li>)}</ul>
      </div>
    </div>
  );
}

// R11 (owner): where we ship, by region. Four big cards, each a dot map of its own region (land dots, our cities lit,
// the route from Dubai), with the way we ship there; a card opens the region: every country with its photo frame and
// how we get there.
const RB: Record<string, [number, number, number, number, string, string]> = { // lon0, lon1, lat0, lat1, title, line
  me: [24, 64, 10, 44, 'Middle East', 'Our home market: next-day to the Gulf, a few days to the Levant.'],
  af: [-20, 56, -12, 38, 'Africa', 'North, East and West Africa by courier, cargo or sea.'],
  eu: [-12, 52, 34, 60, 'Europe', 'From London to Kyiv: express, air cargo or sea via Suez.'],
  as: [44, 92, 4, 42, 'Asia', 'India, Pakistan and the Caucasus, by air and by sea.'],
};
function RegionMap({ r, countries, g }: { r: string; countries: C[]; g: G | null }) {
  const [l0, l1, a0, a1] = RB[r], w = 400, h = Math.round((w * (a1 - a0)) / (l1 - l0) * 1.15);
  const p = (lo: number, la: number) => [((lo - l0) / (l1 - l0)) * w, ((a1 - la) / (a1 - a0)) * h];
  const land = useMemo(() => { if (!g) return ''; let d = ''; for (let i = 0; i < g.land.length; i += 2) { const lo = g.land[i], la = g.land[i + 1]; if (lo < l0 || lo > l1 || la < a0 || la > a1) continue; const [x, y] = p(lo, la); d += `M${x.toFixed(1)},${y.toFixed(1)}h0`; } return d; }, [g]);
  const [ox, oy] = p(55.3, 25.27);
  return (
    <svg className="rg-map" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <path d={land} className="rg-land" />
      {countries.filter((c) => c.region === r && POS[c.name]).map((c, i) => { const [x, y] = p(...POS[c.name]); const mx = (ox + x) / 2, my = Math.min(oy, y) - Math.abs(x - ox) * 0.18 - 10; return (
        <g key={c.name}><path d={`M${ox.toFixed(1)},${oy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`} className="rg-arc" style={{ animationDelay: (i * 0.35).toFixed(2) + 's' }} /><circle cx={x} cy={y} r="4" className="rg-pin" /></g>
      ); })}
      {ox >= 0 && ox <= w && oy >= 0 && oy <= h ? <g><circle cx={ox} cy={oy} r="12" className="rg-dxb-h" /><circle cx={ox} cy={oy} r="5" className="rg-dxb" /></g> : null}
    </svg>
  );
}
export function RegionCards({ countries, flag }: { countries: C[]; flag: (n: string) => string }) {
  const [g, setG] = useState<G | null>(null), [open, setOpen] = useState<string | null>(null);
  useEffect(() => { const iv = window.setInterval(() => { const x = (window as unknown as { SE_GLOBE?: G }).SE_GLOBE; if (x) { window.clearInterval(iv); setG(x); } }, 80); return () => window.clearInterval(iv); }, []);
  const R = ['me', 'eu', 'af', 'as'], list = open ? countries.filter((c) => c.region === open) : [];
  return (
    <div className="rg">
      <div className="rg-grid">{R.map((r) => { const n = countries.filter((c) => c.region === r).length, w = WAYS[r]; return (
        <button key={r} type="button" className={'rg-c' + (open === r ? ' on' : '')} onClick={() => { setOpen(open === r ? null : r); window.setTimeout(() => document.getElementById('rg-open')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80); }} aria-expanded={open === r}>
          <RegionMap r={r} countries={countries} g={g} />
          <span className="rg-in">
            <span className="rg-n"><b>{n}</b><small>{T('countries')}</small></span>
            <b className="rg-t">{T(RB[r][4])}</b><span className="rg-d">{T(RB[r][5])}</span>
            <span className="rg-ways">{w.m.map(([m, t]) => <span key={m}><small>{T(m)}</small><b>{t}</b></span>)}</span>
            <span className="rg-go">{open === r ? T('Close') : T('See every country')} →</span>
          </span>
        </button>
      ); })}</div>
      {open ? (
        <div className="rg-open" id="rg-open" key={open}>
          <div className="rg-oh"><b>{T(RB[open][4])}</b><small>{list.length} {T('countries')} · {T('photos of each city arrive with the owner’s pictures')}</small></div>
          <div className="rg-list">{list.map((c, i) => (
            <div key={c.name} className="rg-cc" style={{ animationDelay: i * 0.04 + 's' }}>
              <span className="rg-ph"><span className="rg-fl">{flag(c.name)}</span><i /></span>
              <b>{T(c.name)}</b><small>{T(WAYS[open].m[0][0])} · {WAYS[open].m[0][1]}</small>
            </div>
          ))}</div>
        </div>
      ) : null}
    </div>
  );
}
