'use client';
// Shop · the screen grades guide (owner: the Showcase grades block belongs on the screens page). Shown when Screens is
// picked: the four grades side by side with how bright, colourful, responsive and good value each is, the lowest price
// we have for it right now, and one tap to show only that grade.
import React from 'react';
import { T } from '@/components/site/ui';
import type { Product } from '@/lib/catalog';

// the same four grades and scores as the home Showcase adverts (kept here so the shop does not load that section)
const ADS = [
  { g: 'OR', u: 'or', k: 'ORIGINAL · SERVICE PACK', h: ['The original.', 'Nothing less.'], d: 'Genuine part, sealed in the maker’s service box · best color, brightness and touch', q: [5, 5, 5, 3] },
  { g: 'OL', u: 'ol', k: 'OLED', h: ['Deep blacks.', 'Fair price.'], d: 'OLED replacement · deep blacks, true color · great value', q: [4, 4, 4, 4] },
  { g: 'AQ', u: 'aq', k: 'AAA · GX', h: ['Close to', 'the original.'], d: 'High-grade copy · very good color and touch · lower price', q: [4, 3, 4, 4] },
  { g: 'IN', u: 'in', k: 'INCELL', h: ['Best value.', 'Still bright.'], d: 'LCD with built-in touch · good everyday quality · budget friendly', q: [3, 3, 4, 5] },
];
const QL = ['Brightness', 'Color', 'Touch', 'Value'];

export default function ScreenGrades({ items, on, onPick }: { items: Product[]; on: string[]; onPick: (g: string) => void }) {
  return (
    <section className="sg" aria-label={T('Which screen grade?')}>
      <div className="sg-hd"><span className="sp-eb">{T('SCREEN GRADES')}</span><b>{T('Which screen grade is right for you?')}</b><small>{T('Tap a grade to see only those screens.')}</small></div>
      <div className="sg-row">
        {ADS.map((a, k) => { const ps = items.filter((p) => p.grade === a.g), from = ps.length ? Math.min(...ps.map((p) => p.price)) : 0;
          return (
            <button key={a.g} type="button" className={'sg-c g-' + a.u + (on.includes(a.g) ? ' on' : '')} style={{ ['--k' as string]: k }} onClick={() => onPick(a.g)} aria-pressed={on.includes(a.g)}>
              <span className="sg-scr" aria-hidden="true"><i style={{ ['--b' as string]: a.q[0] / 5, ['--c' as string]: a.q[1] / 5 }} /></span>
              <span className="sg-k">{T(a.k)}</span>
              <b>{T(a.h[0])} {T(a.h[1])}</b>
              <small>{T(a.d)}</small>
              <span className="sg-q">{QL.map((l, j) => <span key={l}><em>{T(l)}</em><i>{[0, 1, 2, 3, 4].map((d) => <u key={d} className={d < a.q[j] ? 'f' : ''} />)}</i></span>)}</span>
              <span className="sg-ft">{ps.length ? <><span>{ps.length} {T('screens')}</span><span>{T('from')} <b>AED {from}</b></span></> : <span>{T('Ask us for this grade')}</span>}</span>
            </button>
          ); })}
      </div>
    </section>
  );
}
