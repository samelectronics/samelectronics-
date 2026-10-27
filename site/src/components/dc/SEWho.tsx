// Open to everyone, "Who are you?" (Issue 12): 13 Oct 2026. Styles in src/styles/who.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEWho.logic.js';
import DotGlobe from '../home/DotGlobe';
import PalletDrop from '../home/PalletDrop';

// owner (27 Oct): icons redrawn in the site's line style (1.8 stroke, rounded, the same 24 grid as the nav and FMP icons)
const ICONS: Record<string, string> = {
  ret: 'M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM10.5 5h3M11 18.5h2M9 9l3 2.5-1.5 2L14 16',
  rep: 'M4 20l7-7M9.5 11.5l3 3M13 4.5a3.5 3.5 0 0 1 4.6 4.6l2.4 2.4-2 2-2.4-2.4A3.5 3.5 0 0 1 13 4.5zM4 4h5v5H4zM15 16h5v4h-5z',
  exp: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M3.5 9h17M3.5 15h17M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9M12 3c-2.5 2.6-3.5 5.6-3.5 9',
  blk: 'M3 20h18M5 20v-2h14v2M6 18V9h5v9M13 18V5h5v13M6 12h5M13 9h5M13 13h5',
};
const shot = (id: string) => (typeof window !== 'undefined' && (window as unknown as { SE_SHOTS?: { url: (i: string, w: number) => string } }).SE_SHOTS ? (window as unknown as { SE_SHOTS: { url: (i: string, w: number) => string } }).SE_SHOTS.url(id, 960) : '');

/** owner (27 Oct): one symbolic 3D scene per visitor, all on the same dark studio stage as the hero ad and the teardown
 *  (real renders, a soft key light, a floor shadow), no cartoon hand and no busy backgrounds. */
function Scene({ id, v }: { id: string; v: Vals }) {
  if (id === 'ret') {
    return (
      <div className="ws ws-ret">
        <span className="ws-key" />
        <div className="ws-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span className="ws-type" data-no-i18n="">iPhone 13 screen</span><i className="ws-caret" />
        </div>
        {shot('apple-temp') ? <img className="ws-hero" src={shot('apple-temp')} alt="" /> : null}
        <span className="ws-floor" />
        <div className="ws-tag"><b>{v.from}</b></div>
      </div>
    );
  }
  if (id === 'rep') {
    return (
      <div className="ws ws-rep">
        <span className="ws-key" />
        {shot('rep-open') ? <img className="ws-hero" src={shot('rep-open')} alt="" /> : null}
        <span className="ws-floor" />
        <div className="ws-grades">
          {(v.grades || []).map((g: any, k: number) => (
            <span key={g.g} style={{ ['--k' as string]: k } as React.CSSProperties}><b>{g.g}</b><s>{g.p}</s><em>{g.t}</em></span>
          ))}
        </div>
        <span className="ws-chip">TRADE PRICES</span>
      </div>
    );
  }
  if (id === 'exp') {
    return (
      <div className="ws ws-exp">
        <span className="ws-key" />
        <DotGlobe size={360} speed={7} className="ws-globe" />
        <div className="ws-doc">
          <span className="h"><b>BULK LIST</b><span data-no-i18n="">#BL-2611</span></span>
          {[['Screens · mixed grades', '× 300'], ['Batteries', '× 180'], ['Back covers', '× 120'], ['Charging flex', '× 240'], ['Cameras', '× 60']].map(([a, b], k) => (
            <span key={a} className="r" style={{ ['--k' as string]: k } as React.CSSProperties}><span>{a}</span><b>{b}</b></span>
          ))}
          <span className="st">QUOTED</span>
        </div>
      </div>
    );
  }
  return (
    <div className="ws ws-blk">
      <span className="ws-key" />
      <PalletDrop style={{ position: 'absolute', left: '50%', top: '44%', width: '330px', transform: 'translate(-50%, -50%)' }} />
      <span className="ws-chip">Incoming shipments first</span>
    </div>
  );
}

function render(v: Vals) {
  const lane = (v.lanes || [])[v.i] || {};
  return (
    <section id="everyone" ref={v.secRef} data-tone="light" data-screen-label="13 Open to everyone" className={'wh' + (v.seen ? ' wh-seen' : '')}>
      {(v.lanes || []).map((l: any) => (
        <span key={l.id} className={'wh-light ' + l.id + (l.on ? ' on' : '')} aria-hidden="true" />
      ))}
      <div className="wh-grain" aria-hidden="true" />
      <div className="wh-in">
        <div className="wh-left">
          <span className="wh-eb">OPEN TO EVERYONE · WHO ARE YOU?</span>
          <h2 className="wh-h"><span>One phone or one container.</span> <span>We serve everyone like family.</span></h2>
          <div className="wh-tabs" role="tablist">
            {(v.lanes || []).map((l: any) => (
              <button key={l.id} type="button" role="tab" aria-selected={l.on} className={'wh-tab' + (l.on ? ' on' : '')} onClick={l.pick}>
                <span className="ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[l.id]} />
                  </svg>
                </span>
                <span className="tx">
                  <b>{l.k}</b>
                  <small>{l.d}</small>
                </span>
                <span className="wh-pg" aria-hidden="true">
                  <i />
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className={'wh-stage ' + (lane.id || '')} onMouseEnter={v.enter} onMouseLeave={v.leave}>
          {(v.lanes || []).map((l: any) =>
            l.on || l.j === v.prev ? (
              <div key={l.id + (l.on ? '-' + v.n : '-off')} className={'wh-scene ' + l.id + (l.on ? ' on' : ' off')} aria-hidden={!l.on}>
                {v.seen ? <Scene id={l.id} v={v} /> : null}
                <div className="wh-ben">
                  {l.ben.map((b: string, k: number) => (
                    <span key={b} style={{ animationDelay: 0.8 + k * 0.7 + 's' }}>
                      <i />
                      {b}
                    </span>
                  ))}
                  <a href="#everyone" className="wh-cta" onClick={l.act}>
                    {l.cta}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}

const SEWho = createDC('SE Who', Logic, render);
export default SEWho;
