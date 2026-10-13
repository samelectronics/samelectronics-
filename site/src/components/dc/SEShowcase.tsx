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
      <div className="sc-in">
        <header className="sc-top">
          <div>
            <span className="sc-eb">THE SHOWCASE · SCREENS BY GRADE</span>
            <h2 className="sc-h">
              <span>Five grades of screen.</span>
              <span>One for every budget.</span>
            </h2>
          </div>
          <p className="sc-p">Every grade is labelled on your order. The difference is explained in words, never faked on screen.</p>
        </header>
        <div className="sc-stage" onMouseEnter={v.enter} onMouseLeave={v.leave} onTouchStart={v.ts} onTouchEnd={v.te}>
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
            <ul className="sc-list">
              {a.c.map((c: string) => (
                <li key={c} data-s="c">
                  <span className="sc-tick">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <a href="#fmp" className="sc-btn" data-s="btn" onClick={v.shop}>
              <span className="sc-btn-i">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              {'Shop ' + a.k.toLowerCase() + ' screens'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <div className="sc-r" key={'r' + v.i}>
            <span className="sc-haze a" aria-hidden="true" />
            <span className="sc-haze b" aria-hidden="true" />
            <span className="sc-shadow" data-s="shadow" aria-hidden="true" />
            {a.box ? (
              <div className="sc-box" data-s="box" aria-hidden="true">
                <span className="sc-box-back" />
                <span className="sc-box-flap" data-s="flap" />
                <span className="sc-box-front">
                  <small>GENUINE</small>
                  <b>SERVICE PACK</b>
                  <i />
                </span>
                <span className="sc-seal" data-s="seal">
                  SEALED
                  <br />
                  GENUINE
                </span>
              </div>
            ) : null}
            <div className="sc-prod" data-s="prod">
              {v.hasImg ? <img src={v.img} alt="" /> : null}
              <span className="sc-sheen" aria-hidden="true" style={v.hasImg ? { WebkitMask: `url(${v.img}) center / contain no-repeat`, mask: `url(${v.img}) center / contain no-repeat` } : undefined}>
                <i data-s="sheen" />
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
    </section>
  );
}

const SEShowcase = createDC('SE Showcase', Logic, render);
export default SEShowcase;
