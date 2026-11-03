'use client';
// R10 P4 · Brands page pieces: the supply chain told on scroll, makers as chips on a circuit board wired to the grades they
// make (from the real catalogue), and an interactive grade comparison.
import React, { useEffect, useRef, useState } from 'react';
import { T } from '@/components/site/ui';

const CHAIN = [
  { k: 'FACTORY', t: 'Made by the maker', d: 'Brand service centres, original suppliers and aftermarket factories, each named on the label.', ic: 'M3 21V10l6 3V10l6 3V6l6 3v12zM7 21v-4M12 21v-4M17 21v-4' },
  { k: 'BOXED', t: 'Packed and labelled', d: 'Every part keeps its box, its grade and its maker, so nothing is mixed up on the way.', ic: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10' },
  { k: 'DEIRA', t: 'Tested in Deira', d: 'Screens, batteries and flex go on our test rig before they are shelved in Al Murar.', ic: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { k: 'YOUR BENCH', t: 'On your bench', d: 'Picked up the same day in Deira or shipped tracked to the Middle East, Africa, Europe and Asia.', ic: 'M4 20h16M6 20V9h12v11M9 9V5h6v4' },
];
export function SupplyChain() {
  const ref = useRef<HTMLDivElement>(null), [k, setK] = useState(0);
  useEffect(() => { const el = ref.current; if (!el) return; const on = () => { const r = el.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.3))); setK(p); }; on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  return (
    <div className="bc-chain" ref={ref} style={{ ['--k' as string]: k } as React.CSSProperties}>
      <span className="bc-rail" aria-hidden="true"><i /></span>
      {CHAIN.map((c, i) => (
        <div key={c.k} className={'bc-st' + (k >= i / (CHAIN.length - 0.6) ? ' on' : '')}>
          <span className="bc-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.ic} /></svg></span>
          <small>{String(i + 1).padStart(2, '0')} · {T(c.k)}</small><b>{T(c.t)}</b><p>{T(c.d)}</p>
        </div>
      ))}
    </div>
  );
}

type Maker = { id: string; name: string; grades: string[]; n: number; t: string; d: string; w: string };
export function MakerBoard({ makers, gradeNames }: { makers: Maker[]; gradeNames: Record<string, string> }) {
  const [on, setOn] = useState<string>(makers[0]?.id || ''), G = Object.keys(gradeNames);
  const board = useRef<HTMLDivElement>(null), [geo, setGeo] = useState<{ w: number; h: number; c: { x: number; y: number }[]; p: { x: number; y: number }[] } | null>(null);
  // traces are drawn from the real positions of the chips and the grade pads, so they always meet exactly
  useEffect(() => {
    const el = board.current; if (!el) return;
    const measure = () => { const b = el.getBoundingClientRect(); const c = [...el.querySelectorAll('.mb-chip')].map((x) => { const r = x.getBoundingClientRect(); return { x: r.right - b.left, y: r.top - b.top + r.height / 2 }; }); const p = [...el.querySelectorAll('.mb-pad .pc-gr')].map((x) => { const r = x.getBoundingClientRect(); return { x: r.left - b.left, y: r.top - b.top + r.height / 2 }; }); setGeo({ w: b.width, h: b.height, c, p }); };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, []);
  const M = makers.find((m) => m.id === on);
  return (
    <div className="mb">
      <div className="mb-board" ref={board}>
        {geo ? <svg viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          {makers.map((m, i) => m.grades.map((g) => { const j = G.indexOf(g), c = geo.c[i], p = geo.p[j]; if (!c || !p) return null; const mx = c.x + (p.x - c.x) * (0.35 + (i % 4) * 0.08), dy = p.y - c.y, s = Math.sign(dy) || 1, k = Math.min(16, Math.abs(dy) / 2);
            return <path key={m.id + g} className={'mb-tr' + (m.id === on ? ' on' : '')} d={`M${c.x + 4} ${c.y} H${mx - k} L${mx} ${c.y + s * k} V${p.y - s * k} L${mx + k} ${p.y} H${p.x - 6}`} />; }))}
          {geo.p.map((p, j) => <circle key={j} cx={p.x - 6} cy={p.y} r="3.5" className={'mb-via' + (M && M.grades.includes(G[j]) ? ' on' : '')} />)}
        </svg> : null}
        <div className="mb-chips">{makers.map((m) => <button key={m.id} type="button" className={'mb-chip' + (m.id === on ? ' on' : '')} onClick={() => setOn(m.id)}><i /><b>{m.name}</b><small>{m.n}</small></button>)}</div>
        <div className="mb-pads">{G.map((g) => <span key={g} className={'mb-pad' + (M && M.grades.includes(g) ? ' on' : '')}><span className={'pc-gr g-' + g}>{gradeNames[g]}</span></span>)}</div>
      </div>
      {M ? (
        <div className="mb-card" key={M.id}>
          <span className="sp-eb">{T('MANUFACTURER')}</span><b className="sp-h3">{M.name}</b><small className="mb-t">{T(M.t)}</small>
          <p>{T(M.d)}</p>
          <span className="mb-w">{T(M.w)}</span>
          <span className="mb-g">{M.grades.map((g) => <span key={g} className={'pc-gr g-' + g}>{gradeNames[g]}</span>)}</span>
          <a className="sp-btn sm" href={'/shop?maker=' + M.id}>{M.n ? M.n + ' ' + T('parts in the shop') : T('See parts')} →</a>
        </div>
      ) : null}
    </div>
  );
}

// how the grades compare (qualitative bars, 1–5), the same scale the Showcase uses
const CMP: Record<string, number[]> = { OR: [5, 5, 5, 5, 2, 5], OL: [4, 5, 5, 4, 3, 4], AQ: [4, 4, 4, 4, 4, 3], IN: [3, 3, 4, 3, 5, 2] };
const AX = ['Brightness', 'Colour', 'Touch', 'Battery life', 'Price (lower is better value)', 'Warranty'];
export function GradeCompare({ gradeNames }: { gradeNames: Record<string, string> }) {
  const G = Object.keys(gradeNames).filter((g) => CMP[g]), [sel, setSel] = useState<string[]>(G.slice(0, 2));
  const tog = (g: string) => setSel((s) => (s.includes(g) ? (s.length > 1 ? s.filter((x) => x !== g) : s) : [...s, g].slice(-3)));
  return (
    <div className="gc">
      <div className="gc-pick">{G.map((g) => <button key={g} type="button" className={sel.includes(g) ? 'on' : ''} onClick={() => tog(g)}><span className={'pc-gr g-' + g}>{gradeNames[g]}</span></button>)}<small>{T('Pick up to three to compare')}</small></div>
      <div className="gc-rows">{AX.map((a, i) => (
        <div key={a} className="gc-row"><span>{T(a)}</span>
          <div className="gc-bars">{sel.map((g) => <span key={g} className={'gc-bar g-' + g}><i style={{ width: (CMP[g][i] / 5) * 100 + '%' }} /><em>{gradeNames[g]}</em></span>)}</div>
        </div>
      ))}</div>
      <small className="gc-note">{T('A guide to how the grades usually compare. Each part’s own label and warranty are on its page.')}</small>
    </div>
  );
}
