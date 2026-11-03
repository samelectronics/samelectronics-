'use client';
// R10 P3 · Repair Lab pieces: the exploded phone you click to choose a repair, the fitting-fee gauge, the printed-style
// job ticket with a QR code, and the "bench now" status (the shop's real open/closed state, nothing invented).
import React, { useEffect, useState } from 'react';
import qrcode from 'qrcode-generator';
import { T } from '@/components/site/ui';
import { shopStatus } from '@/lib/shopStatus';

// layers of the phone, front to back, with the repair each one opens
const LAYERS: { id: string; l: string; y: number; tone: string }[] = [
  { id: 'SCR', l: 'Screen', y: 0, tone: 'scr' },
  { id: 'FRM', l: 'Frame', y: 1, tone: 'frm' },
  { id: 'BAT', l: 'Battery', y: 2, tone: 'bat' },
  { id: 'BCV', l: 'Back glass', y: 3, tone: 'bcv' },
];
// small parts that sit on the layers, as hotspots
const SPOTS: { id: string; l: string; layer: number; x: number; yy: number }[] = [
  { id: 'FCM', l: 'Front camera', layer: 0, x: 0.5, yy: 0.06 },
  { id: 'EAR', l: 'Earpiece', layer: 0, x: 0.32, yy: 0.06 },
  { id: 'BTN', l: 'Buttons', layer: 1, x: 0.02, yy: 0.3 },
  { id: 'FLX', l: 'Charging port', layer: 1, x: 0.5, yy: 0.97 },
  { id: 'SPK', l: 'Loudspeaker', layer: 1, x: 0.78, yy: 0.96 },
  { id: 'CAM', l: 'Rear camera', layer: 3, x: 0.22, yy: 0.14 },
];

export function PhoneMap({ on, pick, avail }: { on: string | null; pick: (id: string) => void; avail: (id: string) => boolean }) {
  // a flat phone seen from above at an angle (isometric), its layers lifted apart like the teardown: screen on top
  const A = [150, 74], B = [-118, 96], GAP = 78, OX = 300, OY = 40; // width vector, length vector, lift per layer
  const pt = (layer: number, u: number, v: number) => [OX + u * A[0] + v * B[0], OY + layer * GAP + u * A[1] + v * B[1]];
  const poly = (layer: number, u0 = 0, v0 = 0, u1 = 1, v1 = 1) => [pt(layer, u0, v0), pt(layer, u1, v0), pt(layer, u1, v1), pt(layer, u0, v1)].map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  return (
    <div className="rp-map">
      <svg viewBox="40 20 620 470" role="img" aria-label={T('Tap the part that is broken')}>
        <defs>
          <linearGradient id="rpScr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A3C40" /><stop offset="1" stopColor="#2A2C2F" /></linearGradient>
          <linearGradient id="rpBat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4A4C51" /><stop offset="1" stopColor="#36383C" /></linearGradient>
        </defs>
        {[...LAYERS].reverse().map((L) => {
          const sel = on === L.id, ok = avail(L.id);
          return (
            <g key={L.id} className={'rp-ly ' + L.tone + (sel ? ' on' : '') + (ok ? '' : ' na')} onClick={() => pick(L.id)} role="button" tabIndex={0} aria-label={T(L.l)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(L.id); } }}>
              <polygon points={poly(L.y)} />
              {L.id === 'BAT' ? <polygon className="cell" points={poly(2, 0.18, 0.3, 0.82, 0.86)} /> : null}
              {L.id === 'SCR' ? <polygon className="glass" points={poly(0, 0.06, 0.04, 0.94, 0.96)} /> : null}
              {(() => { const [x, y] = pt(L.y, 1, 0.12); return <><line className="lead" x1={x} y1={y} x2={540} y2={y} /><text className="lbl" x={548} y={y + 5}>{T(L.l)}</text></>; })()}
            </g>
          );
        })}
        {SPOTS.map((s) => { const [x, y] = pt(s.layer, s.x, s.yy), sel = on === s.id; return (
          <g key={s.id} className={'rp-spot' + (sel ? ' on' : '') + (avail(s.id) ? '' : ' na')} onClick={(e) => { e.stopPropagation(); pick(s.id); }} role="button" tabIndex={0} aria-label={T(s.l)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(s.id); } }}>
            <circle className="halo" cx={x} cy={y} r="13" /><circle className="dot" cx={x} cy={y} r="6" /><title>{T(s.l)}</title>
          </g>
        ); })}
      </svg>
      <div className="rp-map-legend">{[...LAYERS, ...SPOTS].map((x) => <button key={x.id} type="button" className={on === x.id ? 'on' : ''} onClick={() => pick(x.id)}>{T(x.l)}</button>)}</div>
    </div>
  );
}

/** the fitting fee as a gauge: three tiers (part under 100, 100–500, above 500), the needle on this repair's tier */
export function FeeGauge({ fee, part, total }: { fee: number; part: number; total: string }) {
  const tiers = [0, 1, 2], i = part < 100 ? 0 : part <= 500 ? 1 : 2, ang = -90 + (i + 0.5) * 60;
  return (
    <div className="rp-gauge">
      <svg viewBox="0 0 200 116" aria-hidden="true">
        {tiers.map((t, k) => { const a0 = Math.PI * (1 - k / 3), a1 = Math.PI * (1 - (k + 1) / 3), r = 84, cx = 100, cy = 104; const p = (a: number) => [cx + r * Math.cos(a), cy - r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1);
          return <path key={t} d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} className={'arc' + (k === i ? ' on' : '')} />; })}
        <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: '100px 104px', transition: 'transform .8s cubic-bezier(.2,1.4,.4,1)' }}><line x1="100" y1="104" x2="100" y2="36" className="needle" /></g>
        <circle cx="100" cy="104" r="7" className="hub" />
      </svg>
      <div className="rp-gauge-t"><small>{T('Fitting fee')}</small><b>AED {fee}</b><span>{T('Part')} AED {Math.round(part)} · {T('Total')} <em>{total}</em></span></div>
    </div>
  );
}

export function JobTicket({ job, model, repair, total, when, mode, name }: { job: string; model: string; repair: string; total: string; when: string; mode: string; name: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => { const q = qrcode(0, 'M'); q.addData(location.origin + '/repair?job=' + job); q.make(); setSvg(q.createSvgTag({ cellSize: 3, margin: 0, scalable: true })); }, [job]);
  return (
    <div className="rp-ticket" role="region" aria-label={T('Your job ticket')}>
      <div className="rp-tk-h"><img src="/assets/se-logo-128.webp" alt="" width={34} height={34} /><span><b>SAM ELECTRONICS · REPAIR LAB</b><small>Al Murar, Deira · Dubai</small></span><em>{T('JOB TICKET')}</em></div>
      <div className="rp-tk-b">
        <dl>
          <dt>{T('Job no.')}</dt><dd className="mono">{job}</dd>
          <dt>{T('Name')}</dt><dd>{name}</dd>
          <dt>{T('Device')}</dt><dd>{model}</dd>
          <dt>{T('Repair')}</dt><dd>{repair}</dd>
          <dt>{T('When')}</dt><dd>{when || T('As soon as possible')} · {T(mode)}</dd>
          <dt>{T('Estimate')}</dt><dd className="big">{total}</dd>
        </dl>
        <span className="rp-tk-qr" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="rp-tk-f"><span>{T('Show this at the counter. The final price is confirmed after the free check.')}</span><button type="button" className="sp-btn sm dark" onClick={() => window.print()}>{T('Print')}</button></div>
    </div>
  );
}

export function BenchNow() {
  const [now, setNow] = useState(() => Date.now()), [hours, setHours] = useState<Record<string, number[][]> | null>(null);
  useEffect(() => { const W = window as unknown as { SE_DATA?: { hours: Record<string, number[][]> } }; const iv = window.setInterval(() => { setNow(Date.now()); if (W.SE_DATA && !hours) setHours(W.SE_DATA.hours); }, 1000); return () => window.clearInterval(iv); }, [hours]);
  if (!hours) return null;
  const s = shopStatus(hours, now);
  return (
    <div className={'rp-now ' + s.state}>
      <i style={{ background: s.dot }} />
      <span><b>{T('Bench now')}</b> · {T(s.open ? 'Open for walk-ins' : 'Closed right now')}</span>
      <small>{T(s.short)}</small>
    </div>
  );
}
