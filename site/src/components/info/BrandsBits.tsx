'use client';
// R10 P4 · Brands page pieces: the supply chain told on scroll, makers as chips on a circuit board wired to the grades they
// make (from the real catalogue), and an interactive grade comparison.
import React from 'react';
import { T } from '@/components/site/ui';

type Maker = { id: string; name: string; grades: string[]; n: number; t: string; d: string; w: string };
export function MakerBoard({ makers, gradeNames }: { makers: Maker[]; gradeNames: Record<string, string> }) {
  // R11 (owner): no circuit board. One clean card per maker: what it is, what it makes, the warranty, its grades and how
  // many of its parts are in the shop. The brand's own parts lead, marked with the yellow edge.
  return (
    <div className="mk-grid">{makers.map((m, i) => (
      <a key={m.id} className={'mk-c' + (i === 0 ? ' top' : '')} href={'/shop?maker=' + m.id} data-rise style={{ ['--i' as string]: i % 3 } as React.CSSProperties}>
        <span className="mk-h"><span className="mk-mono" aria-hidden="true">{m.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}</span><span><b>{m.name}</b><small>{T(m.t)}</small></span></span>
        <p>{T(m.d)}</p>
        <span className="mk-w"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg>{T(m.w)}</span>
        <span className="mk-f"><span className="mk-g">{m.grades.map((g) => <span key={g} className={'pc-gr g-' + g}>{gradeNames[g]}</span>)}</span><em>{m.n ? m.n + ' ' + T('parts') : T('See parts')} →</em></span>
      </a>
    ))}</div>
  );
}

// how the grades compare (qualitative bars, 1–5), the same scale the Showcase uses
const CMP: Record<string, number[]> = { OR: [5, 5, 5, 5, 2, 5], OL: [4, 5, 5, 4, 3, 4], AQ: [4, 4, 4, 4, 4, 3], IN: [3, 3, 4, 3, 5, 2] };
const AX = ['Brightness', 'Colour', 'Touch', 'Battery life', 'Price (lower is better value)', 'Warranty'];
const LINE: Record<string, [string, string]> = { OR: ['The original', 'Exactly what the phone came with.'], OL: ['Deep blacks', 'OLED, close to original, a fair price.'], AQ: ['Everyday value', 'A solid aftermarket part.'], IN: ['Best price', 'Bright and reliable, for older phones.'] };
export function GradeCompare({ gradeNames }: { gradeNames: Record<string, string> }) {
  // R11 (owner): the four grades side by side, each with its own meters (battery cells, like the rest of the site)
  const G = Object.keys(gradeNames).filter((g) => CMP[g]);
  return (
    <div className="gq">{G.map((g, k) => (
      <article key={g} className={'gq-c g-' + g} data-rise style={{ ['--i' as string]: k } as React.CSSProperties}>
        <span className="gq-top"><span className={'pc-gr g-' + g}>{gradeNames[g]}</span><small>{String(k + 1).padStart(2, '0')}</small></span>
        <b className="gq-t">{T((LINE[g] || [gradeNames[g]])[0])}</b><small className="gq-d">{T((LINE[g] || ['', ''])[1])}</small>
        <span className="gq-ms">{AX.map((a, i) => (
          <span key={a} className="gq-m"><span>{T(a.replace(' (lower is better value)', ''))}</span><span className="gq-cells" aria-label={CMP[g][i] + ' / 5'}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= CMP[g][i] ? 'on' : ''} />)}</span></span>
        ))}</span>
        <a className="sp-btn sm" href={'/shop?grade=' + g}>{T('Shop')} {gradeNames[g]} →</a>
      </article>
    ))}<small className="gc-note">{T('A guide to how the grades usually compare. Each part’s own label and warranty are on its page.')}</small></div>
  );
}
