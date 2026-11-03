'use client';
// R10 P9 · points simulator: slide your monthly spend, watch the Sam Circuit battery charge level by level and see
// how long each level takes (AED 1 = 1 point; thresholds are the sample ones on this page until the owner confirms).
import React, { useState } from 'react';
import { T } from '@/components/site/ui';
import { aed } from '@/lib/catalog';

const LV: [string, number][] = [['Connected', 1], ['Charged', 1000], ['Supercharged', 5000], ['Fully Charged', 15000], ['Lightning', 40000]];
export default function PointsSim() {
  const [m, setM] = useState(600), y = m * 12;
  const lvl = LV.reduce((k, [, t], i) => (y >= t ? i : k), 0), next = LV[lvl + 1];
  const pct = next ? (y - LV[lvl][1]) / (next[1] - LV[lvl][1]) : 1;
  return (
    <div className="ps" data-rise>
      <div className="ps-l">
        <span className="sp-eb">{T('POINTS SIMULATOR')}</span>
        <b className="ps-q">{T('You spend about')} <span className="mono">{aed(m, false)}</span> {T('a month')}</b>
        <input type="range" min={50} max={5000} step={50} value={m} onChange={(e) => setM(+e.target.value)} aria-label={T('Monthly spend')} style={{ ['--p' as string]: ((m - 50) / 4950) * 100 + '%' }} />
        <div className="ps-out"><span><b className="mono">{y.toLocaleString('en-US')}</b><small>{T('points a year')}</small></span><span><b>{T(LV[lvl][0])}</b><small>{T('your level after a year')}</small></span></div>
        <ul className="ps-when">{LV.slice(1).map(([n, t]) => { const mo = Math.ceil(t / m); return <li key={n} className={y >= t ? 'on' : ''}><span>{T(n)}</span><span className="mono">{mo <= 1 ? T('first month') : mo <= 36 ? mo + ' ' + T('months') : T('3 years +')}</span></li>; })}</ul>
      </div>
      <div className="ps-bat" aria-hidden="true">
        <div className="ps-cells">{LV.map(([n], i) => <i key={n} className={i < lvl ? 'on' : i === lvl ? 'on cur' : i === lvl + 1 ? 'next' : ''} style={i === lvl + 1 ? { ['--f' as string]: pct } : undefined}><small>{T(n)}</small></i>)}</div>
        <span className="ps-nub" />
        <svg className="ps-bolt" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
      </div>
      <small className="sp-sample ps-note">{T('Levels and thresholds are samples until the owner confirms them.')}</small>
    </div>
  );
}
