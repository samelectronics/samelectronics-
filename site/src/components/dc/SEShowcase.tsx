// The Showcase (Issue 6): screen adverts on a graphite | yellow stage. Replaces the Model File on the home page.
// Styles in src/styles/showcase.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEShowcase.logic.js';

function render(v: Vals) {
  const a = v.ad || { k: '', h: ['', ''], c: [] };
  return (
    <section id="showcase" ref={v.secRef} className="sc">
      {/* 14 Oct §10: the stage is held (sticky) while the qualities play; the spacer is the scroll it holds for */}
      <div className="sc-pin">
      <div className="sc-in">
        <header className="sc-top">
          <div>
            <span className="sc-eb">THE SHOWCASE · SCREENS BY QUALITY</span>
            <h2 className="sc-h">
              <span>Four qualities of screen.</span>
              <span>One for every budget.</span>
            </h2>
          </div>
          <p className="sc-p">Every grade is labelled on your order. The difference is explained in words, never faked on screen.</p>
        </header>
        <div className="sc-stage" onTouchStart={v.ts} onTouchEnd={v.te}>
          <div className="sc-bars" role="tablist" aria-label="Screen adverts">
            {(v.ads || []).map((x: any, j: number) => (
              <button key={j} type="button" role="tab" aria-selected={x.on} aria-label={v.tr(x.k)} onClick={x.go}>
                <i data-s="bar" />
              </button>
            ))}
          </div>
          <div className="sc-l" key={'l' + v.i}>
            <span className="sc-k" data-s="eb" data-no-i18n="">
              {a.k}
            </span>
            <h3 className="sc-ad-h">
              {a.h.map((line: string, li: number) => (
                <span key={li} className={li === 1 ? 'y' : ''}>
                  {(v.isAr ? [v.tr(line)] : line.split(' ')).map((w: string, wi: number) => (
                    <span key={wi} data-s="w">
                      {w}
                    </span>
                  ))}
                </span>
              ))}
            </h3>
            {/* 14 Oct §10 B: complete content per grade: one line + four quality bars (sample) */}
            <p className="sc-d" data-s="c">
              {a.d}
            </p>
            <ul className="sc-q" data-s="c" aria-label={v.tr('Quality (sample)')}>
              {(v.qual || []).map((q: any) => (
                <li key={q.l}>
                  <span>{q.l}</span>
                  <i>
                    <b style={{ width: q.w, animationDelay: q.d }} />
                  </i>
                  <em>{q.v}/5</em>
                </li>
              ))}
              <li className="sc-q-note">{'SAMPLE'}</li>
            </ul>
            <a href="#fmp" className="sc-btn" data-s="btn" onClick={v.shop}>
              <span className="sc-btn-i">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              {'Shop ' + ({ ORIGINAL: 'original', OLED: 'OLED', AAA: 'AAA', INCELL: 'Incell' } as Record<string, string>)[a.k.split(' · ')[0]] + ' screens'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <div className="sc-r" key={'r' + v.i}>
            {/* Urgent 4: a real studio: the yellow wall sweeps through a short cove into the floor every product stands on */}
            <span className="sc-floor" aria-hidden="true" />
            {/* R6 §09: the unboxing: this quality's real box (Part E renders), its lid, the screen from the front and its
                back standing behind it, each rendered on its own (scripts/productshot/render-showcase.mjs) */}
            <div className="sc-un" aria-hidden="true">
              <span className="sc-ubox" data-s="ubox">
                <img src={v.u.box} srcSet={v.u.box + ' 1x, ' + v.u.box2 + ' 2x'} alt="" />
              </span>
              <span className="sc-uback" data-s="uback">
                <img src={v.u.back} srcSet={v.u.back + ' 1x, ' + v.u.back2 + ' 2x'} alt="" />
              </span>
              <span className="sc-ufront" data-s="prod">
                <img src={v.u.front} srcSet={v.u.front + ' 1x, ' + v.u.front2 + ' 2x'} alt="" />
                <span className="sc-sheen" style={{ WebkitMask: `url(${v.u.front}) center / contain no-repeat`, mask: `url(${v.u.front}) center / contain no-repeat` }}>
                  <i data-s="sheen" />
                </span>
              </span>
            </div>
            {v.hasPrice ? (
              <span className="sc-badge" data-s="badge">
                <small>from</small>
                <b>{v.price}</b>
                <small>sample</small>
              </span>
            ) : null}
            <div className="sc-nav">
              <button type="button" aria-label="Previous ad" onClick={v.prev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </button>
              <button type="button" aria-label="Next ad" onClick={v.next}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div aria-hidden="true" style={{ height: v.spacer }} />
    </section>
  );
}

const SEShowcase = createDC('SE Showcase', Logic, render);
export default SEShowcase;
