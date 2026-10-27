// Finale. Owner (27 Oct): the ending rebuilt at higher quality, keeping the idea (current runs in, the emblem powers up):
// circuits from both edges run into a ring that draws itself around the logo exactly like the loading screen, the logo
// lights, the three promises light one after the other, then the line, the actions and the numbers. It flows straight
// into the footer (same graphite), so the page ends as one piece. Replays on every re-entry. Styles: src/styles/finale.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEFinale.logic.js';

const LEFT = ['M0 120 H230 L270 90 H470 L540 160 H607', 'M0 230 H170 L210 200 H600', 'M0 330 H250 L290 290 H470 L540 240 H607'];
const mirror = (d: string) => d.replace(/([MHL]) ?(\d+)/g, (m, c, x) => c + (1440 - Number(x)));
const RIGHT = LEFT.map(mirror);
const WORDS = ['QUALITY', 'WARRANTY', 'PRICE'];
const HEAD = ['A', 'phone', 'on', 'your', 'bench?', 'We', 'have', 'the', 'part.'];
const R = 118, C = 2 * Math.PI * R;
const start = (d: string) => { const m = d.match(/^M(\d+) (\d+)/)!; return [Number(m[1]), Number(m[2])]; };

function render(v: Vals) {
  return (
    <section ref={v.secRef} id="finale" data-tone="dark" data-screen-label="Finale" className={'fz' + (v.on ? ' fz-on' : '')}>
      <div className="fz-stage">
        <svg className="fz-circ" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="fzHalo"><stop offset="0" stopColor="#F7C032" stopOpacity=".28" /><stop offset="1" stopColor="#F7C032" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx="720" cy="200" r="230" fill="url(#fzHalo)" className="fz-halo" />
          {[...LEFT, ...RIGHT].map((d, i) => (
            <g key={i} style={{ ['--i' as string]: i % 3 } as React.CSSProperties}>
              <path d={d} className="base" />
              <path d={d} className="cur" pathLength={1} />
              <circle r="3.2" className="pad" cx={start(d)[0]} cy={start(d)[1]} />
            </g>
          ))}
          <circle cx="720" cy="200" r={R} className="fz-track" />
          <circle cx="720" cy="200" r={R} className="fz-ring" strokeDasharray={C} strokeDashoffset={C} transform="rotate(-90 720 200)" />
        </svg>
        <div className="fz-logo">
          <span className="fz-glow" aria-hidden="true" />
          <img src="/assets/se-logo-320.webp" alt="Sam Electronics" width={196} height={196} draggable={false} />
          <span className="fz-shine" aria-hidden="true" />
        </div>
      </div>
      <div className="fz-words">
        {WORDS.map((w, i) => (
          <React.Fragment key={w}>
            {i ? <i aria-hidden="true" /> : null}
            <span style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span>
          </React.Fragment>
        ))}
      </div>
      <h2 className="fz-h" data-no-i18n="">
        {(v.head || HEAD).map((w: string, i: number) => (
          <React.Fragment key={i}>
            {i ? ' ' : null}
            <span style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span>
          </React.Fragment>
        ))}
      </h2>
      <div className="fz-acts">
        <a href="#offer" onClick={v.browse} className="fz-btn yel">
          Browse all parts
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <a href={v.wa} target="_blank" rel="noopener noreferrer" className="fz-btn line">WhatsApp us</a>
        <a href={v.dir} target="_blank" rel="noopener noreferrer" className="fz-btn line">Visit Deira</a>
      </div>
      <div className="fz-stats">
        <span><b><em data-fn="20">20</em>+</b><small>years in Deira</small></span>
        <span><b><em data-fn="14">14</em></b><small>brands</small></span>
        <span><b><em data-fn="9000">9,000</em>+</b><small>parts in stock</small></span>
      </div>
    </section>
  );
}

const SEFinale = createDC('SE Finale', Logic, render);
export default SEFinale;
