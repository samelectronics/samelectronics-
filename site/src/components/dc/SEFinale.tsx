// Finale (Issue 17): rebuilt 13 Oct 2026 as a power-up film. Styles in src/styles/finale.css.
// The emblem is the owner's exact logo (public/assets/se-logo.png) set into a machined-metal bezel under glass,
// with a thick glowing yellow edge; the two phones inside it light up when the current arrives.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEFinale.logic.js';

// circuits (hero style) from both sides to the emblem's bezel; they stay at emblem height, never near the words
const LEFT = ['M0 210 H180 L220 250 H420 L450 220 H546', 'M0 300 H140 L180 340 H420 L450 310 H548', 'M0 390 H240 L290 350 H556'];
const mirror = (d: string) => d.replace(/([MHL]) ?(\d+)/g, (m, c, x) => (c === 'M' || c === 'L' || c === 'H' ? c + (1440 - Number(x)) : m));
const RIGHT = LEFT.map(mirror);
const WORDS = ['QUALITY', 'WARRANTY', 'PRICE'];
const HEAD = ['A', 'phone', 'on', 'your', 'bench?', 'We', 'have', 'the', 'part.'];

function Emblem({ refl }: { refl?: boolean }) {
  return (
    <div className={'fn-emb' + (refl ? ' refl' : '')} aria-hidden={refl ? true : undefined}>
      <span className="fn-edge" />
      <span className="fn-bezel" />
      <span className="fn-face">
        <img src="/assets/se-logo-320.webp" alt={refl ? '' : 'Sam Electronics'} draggable={false} />
        <i className="scr a" />
        <i className="scr b" />
      </span>
      <span className="fn-glass" />
      <span className="fn-sweep" />
    </div>
  );
}

function render(v: Vals) {
  return (
    <section ref={v.secRef} id="finale" data-tone="dark" data-screen-label="Finale" className={'fn' + (v.on ? ' fn-on' : '')}>
      <span className="fn-key" aria-hidden="true" />
      <div className="fn-dust" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} style={{ ['--i' as string]: i } as React.CSSProperties} />
        ))}
      </div>
      <svg className="fn-circ" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        {[...LEFT, ...RIGHT].map((d, i) => (
          <g key={i}>
            <path d={d} className="base" />
            <path d={d} className="cur" pathLength={1} style={{ animationDelay: (i % 3) * 0.12 + 's' }} />
            <path d={d} className="glow" />
          </g>
        ))}
      </svg>
      <div className="fn-stage">
        <span className="fn-shock" aria-hidden="true" />
        <div className="fn-rot">
          <Emblem />
        </div>
        <div className="fn-reflw" aria-hidden="true">
          <div className="fn-rot">
            <Emblem refl />
          </div>
        </div>
      </div>
      <div className="fn-words">
        {WORDS.map((w, i) => (
          <React.Fragment key={w}>
            {i ? <i className="fn-dotw" aria-hidden="true" /> : null}
            <span className="fn-neon" style={{ ['--i' as string]: i } as React.CSSProperties}>
              {w}
              <em aria-hidden="true" />
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="fn-msg">
        <h2 className="fn-h" data-no-i18n="">
          {(v.head || HEAD).map((w: string, i: number) => (
            <React.Fragment key={i}>
              {i ? ' ' : null}
              <span style={{ animationDelay: 2.4 + i * 0.09 + 's' }}>{w}</span>
            </React.Fragment>
          ))}
        </h2>
        <div className="fn-acts">
          <a href="#offer" onClick={v.browse} className="fn-btn yel">
            Browse all parts
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href={v.wa} target="_blank" rel="noopener noreferrer" className="fn-btn line">
            WhatsApp us
          </a>
          <a href={v.dir} target="_blank" rel="noopener noreferrer" className="fn-btn line">
            Visit Deira
          </a>
        </div>
        <div className="fn-stats">
          <span>
            <b data-fn="20">20</b>+ <small>years</small>
          </span>
          <span>
            <b data-fn="14">14</b> <small>brands</small>
          </span>
          <span>
            <b data-fn="9000">9,000</b>+ <small>parts · sample</small>
          </span>
        </div>
      </div>
    </section>
  );
}

const SEFinale = createDC('SE Finale', Logic, render);
export default SEFinale;
