// Open to everyone, "Who are you?" (Issue 12): 13 Oct 2026. Styles in src/styles/who.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEWho.logic.js';
import SESamsoom from './SESamsoom';

const ICONS: Record<string, string> = {
  ret: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  rep: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  exp: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  blk: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
};

/** World dots for the exporter lane (offline globe data), equirectangular. */
let dotsCache: React.ReactNode = null;
function WorldDots() {
  if (dotsCache) return dotsCache;
  const G = typeof window !== 'undefined' ? (window as unknown as { SE_GLOBE?: { land: number[] } }).SE_GLOBE : null;
  if (!G) return null;
  const c: React.ReactNode[] = [];
  for (let i = 0; i < G.land.length; i += 2) {
    const lon = G.land[i], lat = G.land[i + 1];
    if (lat < -50 || lon < -30 || lon > 120) continue;
    c.push(<circle key={i} cx={(((lon + 30) / 150) * 780).toFixed(1)} cy={(((70 - lat) / 120) * 540).toFixed(1)} r="2.6" />);
  }
  return (dotsCache = <g className="exp-dots">{c}</g>);
}
const P = (lon: number, lat: number) => [((lon + 30) / 150) * 780, ((70 - lat) / 120) * 540];
const DXB = P(55.3, 25.3);
const DEST = [P(3.4, 6.5), P(36.8, -1.3), P(-3.7, 40.4), P(44.4, 33.3), P(58.4, 23.6)];

function Scene({ id, v }: { id: string; v: Vals }) {
  if (id === 'ret') {
    const f = v.front;
    const scr = f ? { left: (f.ph[0] + f.scr[0] * f.ph[2]) * 100 + '%', top: (f.ph[1] + f.scr[1] * f.ph[3]) * 100 + '%', width: f.scr[2] * f.ph[2] * 100 + '%', height: f.scr[3] * f.ph[3] * 100 + '%' } : null;
    return (
      <div className="ret">
        <div className="ret-hold">
          <svg className="ret-hand" viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <linearGradient id="whSkin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#D9B096" />
                <stop offset="1" stopColor="#A9785E" />
              </linearGradient>
            </defs>
            <path d="M70 300 C 70 240, 84 206, 104 196 L 196 196 C 214 206, 230 236, 232 300 Z" fill="url(#whSkin)" />
            <path d="M92 214 C 70 196, 58 170, 66 152 C 72 140, 86 146, 90 158 L 104 196 Z" fill="url(#whSkin)" />
            <g fill="url(#whSkin)">
              <rect x="196" y="120" width="34" height="22" rx="11" />
              <rect x="198" y="146" width="36" height="22" rx="11" />
              <rect x="198" y="172" width="34" height="22" rx="11" />
            </g>
            <path d="M104 196 L196 196" stroke="rgba(90,50,30,.25)" strokeWidth="2" />
          </svg>
          <div className="ret-phone">
            {v.img(9) ? <img src={v.img(9)} alt="" /> : null}
            {scr ? (
              <svg className="ret-crack" viewBox="0 0 100 200" preserveAspectRatio="none" style={scr} aria-hidden="true">
                <path d="M64 58 L50 76 L56 92 L38 118 M50 76 L30 70 L14 82 M56 92 L78 104 L90 130 M38 118 L44 150 M64 58 L80 40 L92 46 M64 58 L58 34 L66 12" />
                <circle cx="64" cy="58" r="3" />
              </svg>
            ) : null}
          </div>
        </div>
        <div className="ret-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="ret-type" data-no-i18n="">
            iPhone 13
          </span>
          <i className="ret-caret" />
          <span className="ret-fmp">Find My Part</span>
        </div>
        <div className="ret-part">
          {v.img(0) ? <img src={v.img(0)} alt="" /> : null}
          <div className="ret-chips">
            {(v.grades || []).map((g: any, k: number) => (
              <span key={g.g} style={{ animationDelay: 2.7 + k * 0.15 + 's' }}>
                {g.g}
              </span>
            ))}
          </div>
          <b className="ret-price">{v.from}</b>
        </div>
        <div className="ret-pin">
          <svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true">
            <path d="M13 34 C 9 24 0 20 0 12 a13 13 0 0 1 26 0 C 26 20 17 24 13 34 Z" fill="#F7C032" stroke="#1A1B1D" strokeWidth="1.5" />
            <circle cx="13" cy="12" r="4.5" fill="#1A1B1D" />
          </svg>
          <span>Collect in Deira or get it delivered</span>
        </div>
      </div>
    );
  }
  if (id === 'rep') {
    return (
      <div className="rep">
        <div className="rep-mat" />
        <span className="rep-driver" aria-hidden="true">
          <i />
        </span>
        <span className="rep-tweez" aria-hidden="true" />
        <span className="rep-spud" aria-hidden="true" />
        <div className="rep-tray">
          {(v.grades || []).map((g: any, k: number) => (
            <div key={g.g} className="rep-cell" style={{ ['--k' as string]: k } as React.CSSProperties}>
              <span className="rep-part">{v.img(0) ? <img src={v.img(0)} alt="" /> : null}</span>
              <b>{g.g}</b>
              <span className="rep-pr">
                <s>{g.p}</s>
                <em>{g.t}</em>
              </span>
            </div>
          ))}
        </div>
        <div className="rep-lock" aria-hidden="true">
          <span className="sh" />
          <span className="bd">
            <i />
          </span>
          <span className="fl" />
        </div>
        <span className="rep-trade">TRADE PRICES</span>
      </div>
    );
  }
  if (id === 'exp') {
    return (
      <div className="exp">
        <svg className="exp-map" viewBox="0 0 780 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <WorldDots />
          {DEST.map(([x, y], k) => {
            const mx = (DXB[0] + x) / 2, my = Math.min(DXB[1], y) - 70 - k * 8;
            return (
              <g key={k}>
                <path d={`M${DXB[0]} ${DXB[1]} Q${mx} ${my} ${x} ${y}`} pathLength={1} className="exp-arc" style={{ animationDelay: 3 + k * 0.22 + 's' }} />
                <circle cx={x} cy={y} r="4" className="exp-dst" style={{ animationDelay: 3.5 + k * 0.22 + 's' }} />
              </g>
            );
          })}
          <circle cx={DXB[0]} cy={DXB[1]} r="6" className="exp-dxb" />
          <circle cx={DXB[0]} cy={DXB[1]} r="6" className="exp-dxb-p" />
        </svg>
        <div className="exp-doc">
          <span className="exp-doc-h">
            <b>BULK LIST</b>
            <span data-no-i18n="">#BL-2611</span>
          </span>
          {[
            ['Screens · mixed grades', '× 300'],
            ['Batteries', '× 180'],
            ['Back covers', '× 120'],
            ['Charging flex', '× 240'],
            ['Cameras', '× 60'],
          ].map(([a, b]) => (
            <span key={a} className="exp-row">
              <span>{a}</span>
              <b>{b}</b>
            </span>
          ))}
          <span className="exp-scan" />
          <span className="exp-stamp">QUOTED</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bk">
      <div className="bk-st">
        <div className="wf-pallet">
          <span className="wf-cshadow" aria-hidden="true" />
          <i className="deck" />
          <i className="deck2" />
          <i className="blk b1" />
          <i className="blk b2" />
          <i className="blk b3" />
        </div>
        {Array.from({ length: 18 }, (_, k) => {
          const layer = Math.floor(k / 6), r = k % 6, back = r >= 3, col = r % 3;
          return (
            <div
              key={k}
              className="wf-ct drop"
              style={{ left: col * 118 + (back ? 26 : 0), top: 312 - (layer + 1) * 86 - (back ? 18 : 0) - 18, zIndex: (back ? 0 : 100) + layer * 10 + col, animationDelay: 0.3 + k * 0.13 + 's' }}
            >
              <i className="t" />
              <i className="s" />
              <i className="f">
                {!back ? (
                  <span className="lbl">
                    <b>SE-{2611 + k * 7}</b>
                    <em />
                  </span>
                ) : null}
              </i>
            </div>
          );
        })}
        <div className="wf-wrap bk-wrap" aria-hidden="true">
          <i className="sp" />
          <i className="sh" />
        </div>
      </div>
      <span className="bk-badge">Incoming shipments first</span>
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
          <h2 className="wh-h">One phone or one container. We serve everyone like family.</h2>
          <div className="wh-peek" aria-hidden="true">
            <SESamsoom mood="wave" size={64} />
            <span className="wh-bubble">Who are you?</span>
          </div>
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
