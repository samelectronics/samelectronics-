// Our story & branches (Issue 10): rebuilt 13 Oct 2026. Styles in src/styles/story.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic, { CX } from './SEStory.logic.js';

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/** Brand-styled Deira map: graphite ground, fog streets, the creek, a yellow pin with a soft pulse. Static until clicked. */
export function MapDubai() {
  return (
    <svg viewBox="0 0 600 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="600" height="280" fill="#2A2C2F" />
      <path d="M0 0 H150 C120 40 70 70 0 84 Z" fill="#1E2023" />
      <g fill="#313337">
        <path d="M180 10 L330 0 L320 70 L200 92 Z" /><path d="M350 0 H600 V96 L340 112 Z" /><path d="M196 112 L318 92 L306 168 L210 196 Z" />
        <path d="M338 130 L600 116 V200 L330 214 Z" /><path d="M60 120 L176 100 L196 210 L110 240 Z" /><path d="M326 236 L600 220 V280 H320 Z" />
      </g>
      <path d="M-20 168 C 70 170, 150 210, 250 300" stroke="#1E2023" strokeWidth="58" fill="none" />
      <path d="M-20 168 C 70 170, 150 210, 250 300" stroke="rgba(255,255,255,.05)" strokeWidth="60" fill="none" strokeDasharray="1 0" opacity=".4" />
      <g stroke="#3F4246" strokeWidth="2" fill="none">
        <path d="M200 0 L180 300" /><path d="M260 0 L240 300" /><path d="M420 0 L400 280" /><path d="M500 0 L486 280" /><path d="M120 110 L600 70" /><path d="M150 200 L600 168" /><path d="M200 250 L600 250" />
      </g>
      <g stroke="#6B6E73" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M120 0 C 170 70, 300 104, 610 98" />
        <path d="M334 -10 L 316 290" />
        <path d="M150 300 C 260 214, 430 210, 610 222" />
      </g>
      <g stroke="#8C9096" strokeWidth="1.2" fill="none" opacity=".55">
        <path d="M120 0 C 170 70, 300 104, 610 98" /><path d="M334 -10 L 316 290" /><path d="M150 300 C 260 214, 430 210, 610 222" />
      </g>
      <text x="70" y="214" className="st-map-l w" transform="rotate(24 70 214)">DUBAI CREEK</text>
      <text x="470" y="60" className="st-map-l">DEIRA</text>
      <text x="350" y="186" className="st-map-l y">AL MURAR</text>
      <g transform="translate(332 150)">
        <circle r="10" className="st-pulse" />
        <circle r="10" className="st-pulse b" />
        <path d="M0 0 C -4 -10 -14 -16 -14 -27 a14 14 0 0 1 28 0 C 14 -16 4 -10 0 0 Z" fill="#F7C032" stroke="#26282B" strokeWidth="1.5" />
        <circle cy="-27" r="5" fill="#26282B" />
      </g>
    </svg>
  );
}

/** Madrid, Plaza Mayor area: the same style, with a pulsing "opening soon" area circle instead of a pin. */
function MapMadrid() {
  return (
    <svg viewBox="0 0 600 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="600" height="280" fill="#2A2C2F" />
      <g fill="#313337">
        <path d="M0 30 H230 L224 78 H0 Z" /><path d="M250 28 H600 V70 L250 80 Z" /><path d="M0 104 H230 V200 L0 230 Z" />
        <path d="M400 96 L600 90 V200 L410 160 Z" /><path d="M0 250 L210 220 L190 280 H0 Z" /><path d="M300 222 L420 186 L600 230 V280 H280 Z" />
      </g>
      <rect x="250" y="104" width="128" height="92" rx="2" fill="#3A3C40" />
      <rect x="258" y="112" width="112" height="76" rx="1" fill="none" stroke="#5E6064" strokeWidth="1.5" strokeDasharray="2 3" />
      <circle cx="314" cy="150" r="3" fill="#8C9096" />
      <g stroke="#3F4246" strokeWidth="2" fill="none">
        <path d="M240 0 L236 300" /><path d="M392 0 L388 300" /><path d="M0 92 L250 96" /><path d="M378 98 L600 84" /><path d="M120 0 L100 300" /><path d="M520 0 L540 300" />
      </g>
      <g stroke="#6B6E73" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M-10 20 L 610 8" />
        <path d="M-10 92 C 150 96, 300 98, 610 84" />
        <path d="M300 196 L 228 300" />
        <path d="M378 170 L 610 244" />
      </g>
      <g stroke="#8C9096" strokeWidth="1.2" fill="none" opacity=".55">
        <path d="M-10 92 C 150 96, 300 98, 610 84" /><path d="M300 196 L 228 300" /><path d="M378 170 L 610 244" />
      </g>
      <circle cx="520" cy="66" r="7" fill="#3A3C40" stroke="#8C9096" strokeWidth="1.5" />
      <text x="534" y="58" className="st-map-l">SOL</text>
      <text x="40" y="86" className="st-map-l">CALLE MAYOR</text>
      <text x="314" y="216" textAnchor="middle" className="st-map-l y">PLAZA MAYOR</text>
      <circle cx="314" cy="150" r="74" className="st-area" />
      <circle cx="314" cy="150" r="74" className="st-area-ring" />
    </svg>
  );
}

function render(v: Vals) {
  const F = v.$facts || {};
  return (
    <section id="story" className="st">
      <div className="st-pin-wrap" ref={v.secRef}>
        <div className="st-pin">
          <div className="st-sun" aria-hidden="true" />
          <div className="st-grain" aria-hidden="true" />
          <div className="st-box" style={{ ['--sc' as string]: v.sc } as React.CSSProperties}>
            <header className="st-top">
              <div>
                <span className="st-eb">OUR STORY · FIRMWARE HISTORY</span>
                <h2 className="st-h">
                  <span>More than 20 years in Deira.</span>
                  <span>Same management since day one.</span>
                </h2>
              </div>
              <div className="st-yr">
                <span className="st-yr-k" data-s="yearT">
                  <span className="a">2003 → TODAY</span>
                  <span className="b">TODAY</span>
                </span>
                <b data-s="year">2003</b>
                <a href="#story" className="st-more" onClick={v.more}>
                  Read our story
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </header>

            <div className="st-tl">
              <div className="st-rail" aria-hidden="true">
                <i className="st-line" data-s="line" />
                <i className="st-tip" data-s="tip" />
                {CX.map((c: number, i: number) => (
                  <i key={i} className="st-node" data-s={'node' + i} style={{ left: c * 100 + '%' }} />
                ))}
              </div>
              <div className="st-cards">
                {(v.items || []).map((h: any) => (
                  <article key={h.v} className={'st-card' + (h.now ? ' now' : '') + (h.soon ? ' soon' : '')} data-s={'card' + h.i}>
                    <div className={'st-photo r' + h.i}>
                      <div className="st-ph">
                        <span className="st-ph-base" />
                        <span className={'st-ph-img p' + h.i} />
                        <span className="st-ph-warm" />
                        <span className="st-ph-gloss" />
                      </div>
                      <span className="st-ph-cap">{h.years}</span>
                    </div>
                    <div className="st-card-h">
                      <span className="st-v" data-no-i18n="">
                        {h.v}
                      </span>
                      <span className="st-years">{h.years}</span>
                    </div>
                    <h3>{h.title}</h3>
                    <p>{h.d}</p>
                    {h.now ? (
                      <span className="st-st run" data-s="run">
                        <i />
                        RUNNING
                      </span>
                    ) : h.soon ? (
                      <span className="st-st inst" data-s="instW">
                        <span className="st-st-t">
                          <i />
                          INSTALLING
                        </span>
                        <span className="st-bar">
                          <b data-s="inst" />
                        </span>
                      </span>
                    ) : (
                      <span className="st-st done">✓ SHIPPED</span>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <span className="st-hint" data-s="hint" aria-hidden="true">
              SCROLL · 20 YEARS IN 20 SECONDS
            </span>
          </div>
        </div>
      </div>

      {/* ---------- the branches: two brand-styled maps side by side, then the stats strip ---------- */}
      <div className={'st-br' + (v.br ? ' in' : '')} ref={v.brRef}>
        <div className="st-br-g">
          <article className="st-bc">
            <a className="st-map" href={v.mapsDxb} target="_blank" rel="noopener noreferrer" aria-label="Open Dubai · Deira in Maps">
              <MapDubai />
              <span className="st-open">Open in Maps {ARROW}</span>
            </a>
            <div className="st-bc-in">
              <span className="st-k">
                <i className="live" />
                BRANCH 01 · LIVE
              </span>
              <h3>Dubai · Deira</h3>
              <p>
                {String(F.contact?.address ?? '')}
                <br />
                <span data-no-i18n="">Plus Code {String(F.contact?.plusCode ?? '')}</span>
              </p>
              <span className="st-today">
                <span>Today</span> <span data-no-i18n="">{v.todayHours}</span>
              </span>
              <div className="st-acts">
                <a href={v.dirLink} target="_blank" rel="noopener noreferrer" className="st-btn yel">
                  Get directions {ARROW}
                </a>
                <a href={v.wa} target="_blank" rel="noopener noreferrer" className="st-btn line">
                  WhatsApp
                </a>
                <a href={'tel:' + String(F.contact?.storeTel ?? '')} className="st-btn line">
                  Call
                </a>
              </div>
            </div>
          </article>
          <article className="st-bc">
            <a className="st-map" href={v.mapsMad} target="_blank" rel="noopener noreferrer" aria-label="Open Madrid · Plaza Mayor in Maps">
              <MapMadrid />
              <span className="st-soon-tag">OPENING SOON · AREA</span>
              <span className="st-open">Open in Maps {ARROW}</span>
            </a>
            <div className="st-bc-in">
              <span className="st-k">
                <i className="soon" />
                BRANCH 02 · MADRID
              </span>
              <h3>Madrid · Plaza Mayor</h3>
              <p>Our first branch in Europe, in the Plaza Mayor district of Madrid, Spain.</p>
              <span className="st-today">{String(F.madrid?.opening ?? 'Opening date to be announced')}</span>
              <div className="st-acts">
                <button type="button" className="st-btn dark" onClick={v.notify}>
                  Tell me when it opens
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
        <div className="st-stats">
          <div>
            <small>SINCE</small>
            <b data-n="2003" data-from="1980">
              {v.br ? '1980' : '2003'}
            </b>
            <span>Same management since day one</span>
          </div>
          <div>
            <small>CITIES</small>
            <b data-n="2">{v.br ? '0' : '2'}</b>
            <span>Dubai today, Madrid next</span>
          </div>
          <div>
            <small>COUNTRIES SERVED*</small>
            <b>
              <span data-n={v.countries}>{v.br ? '0' : v.countries}</span>+
            </b>
            <span>Shipped from Deira</span>
          </div>
        </div>
        <p className="st-note">* Sample figure, to be confirmed.</p>
      </div>
    </section>
  );
}

const SEStory = createDC('SE Story', Logic, render);
export default SEStory;
