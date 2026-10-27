// Bench Test (Issue 5): rebuilt 13 Oct 2026 as a pinned, scroll-scrubbed scene. Styles in src/styles/bench-test.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic, { TAPS } from './SEBenchTest.logic.js';
import { comingSoon } from '@/components/g17/ComingSoon';

const WORDS: [string, string, string][] = [
  ['q', 'QUALITY', 'Display and touch passed'],
  ['w', 'WARRANTY', 'True Tone passed, covered by warranty'],
  ['p', 'PRICE', 'Battery passed, the price you agreed'],
];

function Tile({ k, name, children }: { k: string; name: string; children: React.ReactNode }) {
  return (
    <div className="bt-tile" data-b={'tile-' + k}>
      <div className="bt-tile-h">
        <span className="bt-tile-n">{name}</span>
        <span className="bt-st">
          <span className="bt-q">queued</span>
          <span className="bt-r">testing</span>
          <span className="bt-ok">
            PASS
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </span>
        </span>
      </div>
      {children}
    </div>
  );
}

function render(v: Vals) {
  return (
    <section id="quality" ref={v.secRef} className="bt" style={{ ['--sc' as string]: v.sc } as React.CSSProperties}>
      <div className="bt-pin" data-b="pin">
        <div className="bt-bg" aria-hidden="true" />
        <div className="bt-box" style={{ ['--sc' as string]: v.sc } as React.CSSProperties}>
          {/* ---------- left: the promise ---------- */}
          <div className="bt-left">
            <span className="bt-eb">
              <i />
              <span>BENCH TEST · CHECK</span> <b data-b="step">1</b> <span>OF 4</span>
            </span>
            <h2 className="bt-h">
              <span>Nothing leaves Deira</span>
              <span>until it passes the rig.</span>
            </h2>
            <p className="bt-p">Every part is clamped into our test rig and probed before it is packed.</p>
            <div className="bt-words">
              {WORDS.map(([k, w, l]) => (
                <div key={k} className="bt-word">
                  <svg className="bt-ring" viewBox="0 0 48 48" aria-hidden="true">
                    <circle cx="24" cy="24" r="20" className="bt-ring-bg" />
                    <circle cx="24" cy="24" r="20" className="bt-ring-fg" data-b={'ring-' + k} pathLength={1} />
                    <path d="M15 24.5l6 6 12-13" className="bt-chk" data-b={'chk-' + k} pathLength={1} />
                  </svg>
                  <div className="bt-wt">
                    <span className="bt-w">
                      <span className="bt-w-o">{w}</span>
                      <span className="bt-w-f" data-b={'fill-' + k} aria-hidden="true">
                        {w}
                      </span>
                    </span>
                    <span className="bt-line" data-b={'line-' + k}>
                      {l}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* R6 §08: the space under the promise: today's rig counters (SAMPLE), how we test, run it yourself */}
            <div className="bt-today">
              <span className="bt-today-h">
                TODAY ON THE RIG
              </span>
              <div className="bt-cnts">
                {(v.today || []).map((c: any) => (
                  <span key={c.k} className="bt-cnt">
                    <b data-b={'tc-' + c.k}>0</b>
                    <small>
                      {c.l}
                      {c.k === 'stickers' ? (
                        <button type="button" className="se-info light bt-i" aria-label="About the warranty sticker">
                          i<span role="tooltip">The yellow sticker means this part passed every check on the rig. It seals the part for its warranty: ask us for the period.</span>
                        </button>
                      ) : null}
                    </small>
                  </span>
                ))}
              </div>
              <div className="bt-acts">
                <button type="button" className="bt-how" onClick={() => comingSoon({ text: 'A page about how we test every part is coming soon.' })}>
                  How we test
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                {/* owner (27 Oct): one clear invitation instead of three quality buttons; the full "test your own screen"
                    experience (pick your exact screen, watch it run on the rig, get its quality report) comes as its own page */}
                <button type="button" className="bt-try" onClick={() => comingSoon({ title: 'Test your screen', text: 'Pick your exact screen, watch it run on our rig and get its quality report. Opening soon.' })}>
                  <span className="bt-try-i" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10 18h4" /></svg>
                  </span>
                  Test your screen on our rig
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* ---------- right: the rig ---------- */}
          <div className="bt-rigwrap">
            <div className="bt-shadow" aria-hidden="true" />
            <svg className="bt-cable" viewBox="0 0 120 220" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="btCab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0E0F11" /><stop offset=".45" stopColor="#3A3D42" /><stop offset=".6" stopColor="#24262A" /><stop offset="1" stopColor="#0E0F11" /></linearGradient>
                <linearGradient id="btMet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7E8389" /><stop offset=".35" stopColor="#F2F3F5" /><stop offset=".55" stopColor="#B9BDC2" /><stop offset="1" stopColor="#6C7076" /></linearGradient>
                <pattern id="btBraid" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="6" height="6" fill="none" /><path d="M0 3h6" stroke="rgba(255,255,255,.08)" strokeWidth="1.2" /></pattern>
              </defs>
              {/* owner (27 Oct): a real braided cable (shaded round body, weave, highlight), a machined ferrule and a USB-C plug */}
              <path d="M30 0 C 30 70, 90 80, 90 150 V186" stroke="rgba(0,0,0,.25)" strokeWidth="12" strokeLinecap="round" transform="translate(3 4)" />
              <path d="M30 0 C 30 70, 90 80, 90 150 V186" stroke="url(#btCab)" strokeWidth="10" strokeLinecap="round" />
              <path d="M30 0 C 30 70, 90 80, 90 150 V186" stroke="url(#btBraid)" strokeWidth="10" strokeLinecap="round" />
              <path d="M28 0 C 28 70, 88 80, 88 150 V186" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" strokeLinecap="round" />
              <rect x="80" y="180" width="20" height="12" rx="3" fill="url(#btMet)" />
              <rect x="77" y="190" width="26" height="22" rx="4" fill="url(#btMet)" stroke="#5E6064" strokeWidth=".8" />
              <rect x="77.5" y="191" width="25" height="3" rx="1.5" fill="rgba(255,255,255,.55)" />
              <rect x="83" y="210" width="14" height="9" rx="4.5" fill="url(#btMet)" stroke="#4A4D52" strokeWidth=".8" />
              <rect x="85.5" y="213" width="9" height="3" rx="1.5" fill="#1A1B1D" />
            </svg>
            <div className="bt-rig">
              <div className="bt-top">
                <span className="bt-leds">
                  {[0, 1, 2, 3].map((i) => (
                    <i key={i} data-b={'led' + i} style={{ animationDelay: -i * 0.7 + 's' }} />
                  ))}
                </span>
                <span className="bt-eng">SE · TEST RIG 04 · DEIRA</span>
                <span className="bt-ctr" data-b="ctr">
                  <small>UNITS</small>
                  <b data-b="count">1,293</b>
                </span>
              </div>
              <div className="bt-plate">
                {/* phone bay */}
                <div className="bt-bay">
                  <div className="bt-rail" aria-hidden="true">
                    <i data-b="carriage" />
                  </div>
                  <div className="bt-clamp l" data-b="clampL" aria-hidden="true">
                    <span className="bt-knob" />
                  </div>
                  <div className="bt-clamp r" data-b="clampR" aria-hidden="true">
                    <span className="bt-knob" />
                  </div>
                  <div className="bt-phone" data-b="phone">
                    <div className="bt-screen">
                      <div className="bt-pix" data-b="pix" />
                      <div className="bt-scan" data-b="scan" />
                      <svg className="bt-trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <path data-b="trace" pathLength={1} d={'M' + TAPS.map(([x, y]) => x + ' ' + y).join(' L')} />
                      </svg>
                      {TAPS.map(([x, y], i) => (
                        <i key={i} className="bt-tap" data-b={'tap' + i} style={{ left: x + '%', top: y + '%' }} />
                      ))}
                      <div className="bt-tone warm" data-b="warm" />
                      <div className="bt-tone cool" data-b="cool" />
                      <div className="bt-bscr" data-b="bscr">
                        <span className="bt-bat">
                          <i data-b="bscrf" />
                        </span>
                        <b data-b="bpct">0%</b>
                      </div>
                      <div className="bt-probe" data-b="probe" aria-hidden="true">
                        <span className="bt-stylus" />
                        <span className="bt-tip" data-b="tip" />
                      </div>
                      <span className="bt-island" />
                    </div>
                    <span className="bt-sticker" data-b="sticker">
                      WARRANTY
                      <br />
                      CHECKED
                    </span>
                  </div>
                </div>
                {/* readouts */}
                <div className="bt-tiles">
                  <Tile k="d" name="Display">
                    <span className="bt-bar">
                      <i data-b="dbar" />
                    </span>
                    <span className="bt-sub">Every pixel, every colour</span>
                  </Tile>
                  <Tile k="t" name="Touch">
                    <svg className="bt-mini" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0 22 L25 8 L50 22 L75 8 L100 22 L125 8 L150 22 L175 8 L200 22" data-b="tline" pathLength={1} />
                    </svg>
                    <span className="bt-sub">9 points, edge to edge</span>
                  </Tile>
                  <Tile k="w" name="True Tone">
                    <span className="bt-gauge">
                      <svg viewBox="0 0 120 64" aria-hidden="true">
                        <path d="M10 60 A50 50 0 0 1 110 60" className="bt-g-arc" />
                        <path d="M10 60 A50 50 0 0 1 110 60" className="bt-g-col" />
                      </svg>
                      <i data-b="needle" />
                    </span>
                    <span className="bt-sub">Warm to cool, sensor read</span>
                  </Tile>
                  <Tile k="b" name="Battery">
                    <span className="bt-bar b">
                      <i data-b="bfill" />
                    </span>
                    <span className="bt-sub">
                      Health <b data-b="bpct2">0%</b>
                    </span>
                  </Tile>
                </div>
                <div className="bt-ptag" data-b="ptag" aria-hidden="true">
                  <span className="bt-string" />
                  <span className="bt-tag">
                    <small>PRICE</small>
                    <b>AED {v.price}</b>
                  </span>
                </div>
              </div>
              <div className="bt-slot" aria-hidden="true" />
            </div>
            <div className="bt-orderwrap">
              <div className="bt-order" data-b="order">
                <div className="bt-o-h">
                  <b>WORK ORDER</b>
                  <span>#1,294</span>
                </div>
                <div className="bt-o-r">
                  <span>Part</span>
                  <span data-no-i18n="">iPhone 15 Pro screen</span>
                </div>
                <div className="bt-o-r">
                  <span>Grade</span>
                  <span>{v.grade}</span>
                </div>
                <div className="bt-o-r">
                  <span>Warranty</span>
                  <span>on every grade*</span>
                </div>
                <div className="bt-o-r">
                  <span>Price</span>
                  <span>AED {v.price}</span>
                </div>
                <div className="bt-o-bars" aria-hidden="true" />
                <span className="bt-stamp" data-b="stamp">
                  PASSED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SEBenchTest = createDC('SE Bench Test', Logic, render);
export default SEBenchTest;
