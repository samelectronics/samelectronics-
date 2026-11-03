'use client';
// R10 4.0 · real charts for the Control Room (no coloured boxes): a line/area chart with axes, gridlines, values and a
// hover read-out; a donut with its legend and centre total; horizontal bars with values. Plain SVG, brand palette.
import React, { useMemo, useState } from 'react';

const nice = (max: number) => { if (max <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(max))), f = max / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; };
const short = (n: number) => (Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : Math.abs(n) >= 1e3 ? (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + 'k' : String(Math.round(n)));
export type Series = { n: string; c: string; v: number[]; area?: boolean; dash?: boolean };

export function LineChart({ labels, series, h = 240, fmt = short }: { labels: string[]; series: Series[]; h?: number; fmt?: (n: number) => string }) {
  const W = 720, P = { l: 52, r: 16, t: 14, b: 30 }, iw = W - P.l - P.r, ih = h - P.t - P.b;
  const mx = Math.max(0, ...series.flatMap((s) => s.v)), top = mx > 0 ? nice(mx) : 4, ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * top);
  const x = (i: number) => P.l + (labels.length > 1 ? (i / (labels.length - 1)) * iw : iw / 2), y = (v: number) => P.t + ih - (v / top) * ih;
  const [hv, setHv] = useState<number | null>(null);
  const step = Math.max(1, Math.ceil(labels.length / 8));
  return (
    <div className="ch">
      <svg viewBox={`0 0 ${W} ${h}`} className="ch-svg" onMouseLeave={() => setHv(null)} onMouseMove={(e) => { const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W; setHv(Math.max(0, Math.min(labels.length - 1, Math.round(((px - P.l) / iw) * (labels.length - 1))))); }}>
        {ticks.map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="ch-grid" /><text x={P.l - 8} y={y(t) + 4} className="ch-ax" textAnchor="end">{fmt(t)}</text></g>)}
        {labels.map((l, i) => (i % step === 0 || i === labels.length - 1 ? <text key={i} x={x(i)} y={h - 8} className="ch-ax" textAnchor="middle">{l}</text> : null))}
        {series.map((s) => { const d = s.v.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(''); return (
          <g key={s.n}>{s.area ? <path d={d + `L${x(s.v.length - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={s.c} opacity=".14" /> : null}<path d={d} fill="none" stroke={s.c} strokeWidth="2.4" strokeDasharray={s.dash ? '5 5' : undefined} strokeLinejoin="round" strokeLinecap="round" /></g>); })}
        {hv != null ? <g><line x1={x(hv)} x2={x(hv)} y1={P.t} y2={P.t + ih} className="ch-hv" />{series.map((s) => <circle key={s.n} cx={x(hv)} cy={y(s.v[hv] || 0)} r="4.5" fill="#fff" stroke={s.c} strokeWidth="2.4" />)}</g> : null}
      </svg>
      <div className="ch-leg">{series.map((s) => <span key={s.n}><i style={{ background: s.c }} />{s.n}{hv != null ? <b>{fmt(s.v[hv] || 0)}</b> : null}</span>)}{hv != null ? <span className="ch-at">{labels[hv]}</span> : null}</div>
    </div>
  );
}

export function Donut({ parts, fmt = short, label }: { parts: { n: string; v: number; c: string }[]; fmt?: (n: number) => string; label?: string }) {
  const tot = parts.reduce((s, p) => s + p.v, 0), R = 62, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="dn">
      <svg viewBox="0 0 160 160" className="dn-svg">
        <circle cx="80" cy="80" r={R} fill="none" stroke="#ECEDEF" strokeWidth="20" />
        {tot ? parts.map((p) => { const len = (p.v / tot) * C, el = <circle key={p.n} cx="80" cy="80" r={R} fill="none" stroke={p.c} strokeWidth="20" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} transform="rotate(-90 80 80)" />; acc += len; return el; }) : null}
        <text x="80" y="78" textAnchor="middle" className="dn-v">{fmt(tot)}</text><text x="80" y="96" textAnchor="middle" className="dn-l">{label || 'total'}</text>
      </svg>
      <ul className="dn-leg">{parts.map((p) => <li key={p.n}><i style={{ background: p.c }} /><span>{p.n}</span><b>{fmt(p.v)}</b><small>{tot ? Math.round((p.v / tot) * 100) : 0}%</small></li>)}</ul>
    </div>
  );
}

export function HBars({ rows, fmt = short, c = '#F7C032' }: { rows: { n: string; v: number; s?: string }[]; fmt?: (n: number) => string; c?: string }) {
  const max = useMemo(() => Math.max(1, ...rows.map((r) => r.v)), [rows]);
  return <div className="hb">{rows.map((r) => <div key={r.n} className="hb-r"><span className="hb-n" title={r.n}>{r.n}{r.s ? <small>{r.s}</small> : null}</span><span className="hb-t">{r.v > 0 ? <i style={{ width: (r.v / max) * 100 + '%', background: c }} /> : null}</span><b className="hb-v">{fmt(r.v)}</b></div>)}</div>;
}
