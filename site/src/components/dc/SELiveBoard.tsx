// Live Parts Board (Issue 3): rebuilt layout, 13 Oct 2026. Styles in src/styles/live-board.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SELiveBoard.logic.js';

/** Small always-alive icons for the four counters (Issue 3 · idle life). Each moving part is its own small
 *  layer animated with transform/opacity only, so the icons never repaint (G16). */
function Icon({ k }: { k: string }) {
  const L = (cls: string, el: React.ReactNode) => (
    <svg className={'lb-icl ' + cls} viewBox="0 0 32 32" width="26" height="26" fill="none" aria-hidden="true">
      {el}
    </svg>
  );
  if (k === 'box')
    return (
      <span className="lb-icw">
        {L('', <path d="M4 27h24" stroke="#8C9096" strokeWidth="1.6" strokeLinecap="round" />)}
        {L('lb-ic-drop', <><path d="M9 13h14v12H9z" fill="#D9A55C" stroke="#F7C032" strokeWidth="1.4" strokeLinejoin="round" /><path d="M14.5 13v5l1.5-1 1.5 1v-5" fill="#F7C032" /></>)}
      </span>
    );
  if (k === 'bat')
    return (
      <span className="lb-icw">
        {L('', <><rect x="5" y="10" width="20" height="12" rx="2.5" stroke="#FF8A8E" strokeWidth="1.6" /><rect x="26" y="13.5" width="2.5" height="5" rx="1" fill="#FF8A8E" /></>)}
        <i className="lb-ic-drain" />
      </span>
    );
  if (k === 'tag')
    return (
      <span className="lb-icw">
        {L('', <path d="M16 3v5" stroke="#8C9096" strokeWidth="1.2" />)}
        {L('lb-ic-swing', <><path d="M9 12l7-5 7 5v13a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2z" fill="rgba(247,192,50,.18)" stroke="#F7C032" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="16" cy="11.5" r="1.6" fill="#F7C032" /><path d="M12.5 18h7M12.5 22h5" stroke="#F7C032" strokeWidth="1.6" strokeLinecap="round" /></>)}
      </span>
    );
  return (
    <span className="lb-icw">
      {L('', <path d="M2 26h28" stroke="#8C9096" strokeWidth="1.2" strokeDasharray="3 3" />)}
      {L('lb-ic-drive', <><path d="M4 10h14v12H4zM18 14h5l4 4v4h-9z" fill="rgba(95,212,154,.16)" stroke="#5FD49A" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="9" cy="23" r="2.2" fill="#1F2023" stroke="#5FD49A" strokeWidth="1.5" /><circle cx="22" cy="23" r="2.2" fill="#1F2023" stroke="#5FD49A" strokeWidth="1.5" /></>)}
    </span>
  );
}

function render(v: Vals) {
  const tiles: any[] = v.tiles || [];
  const rows: any[] = v.rows || [];
  const pulse = v.pulse;
  return (
    <section id="board" ref={v.secRef} className={'lb' + (v.seen ? ' lb-seen' : '')}>
      {/* R6 §07: faint side circuits in the gutters, away from the board and text; with every new row a ping runs
          from one side's circuit into the board at the newest row's height (--ry, measured by the logic) */}
      {(['l', 'r'] as const).map((sd, n) => (
        <svg key={sd} className={'lb-side ' + sd} viewBox="0 0 100 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 36 H38 L58 56 V176 L82 200 H100" className="lb-strace" />
          <path d="M0 330 H26 L46 310 V244 L64 226" className="lb-strace" />
          <path d="M0 120 H18 L30 132 V150" className="lb-strace" />
          <circle cx="64" cy="226" r="3" className="lb-snode" />
          <circle cx="30" cy="150" r="3" className="lb-snode" />
          {pulse && pulse.id % 2 === n ? <path key={pulse.id} d="M0 36 H38 L58 56 V176 L82 200 H100" className="lb-spulse" pathLength={1} /> : null}
        </svg>
      ))}
      <div className="lb-in">
        <header className="lb-top">
          <div>
            <span className="lb-eb">
              <i />
              LIVE PARTS BOARD · LIVE FEED
            </span>
            <h2 className="lb-h">
              <span>
                <span>What’s moving on our</span>
              </span>
              <span>
                <span>shelves, right now.</span>
              </span>
            </h2>
          </div>
          <p className="lb-p">New stock landing, prices dropping, boxes leaving Deira. Every row on the board feeds the counters, live.</p>
        </header>

        <div className="lb-main">
          <div className="lb-tiles">
            {tiles.map((x) => (
              <button
                key={x.id}
                type="button"
                className={'lb-tile' + (x.on ? ' on' : '') + (x.f ? ' f' + (x.f % 2) : '')}
                style={{ animationDelay: x.d, ['--c' as string]: x.c } as React.CSSProperties}
                onClick={x.pick}
                aria-pressed={x.on}
              >
                <span className="lb-ic">
                  <Icon k={x.ic} />
                </span>
                <span className="lb-tx">
                  <span className="lb-k">
                    <i />
                    {x.k}
                  </span>
                  <span className="lb-v">
                    <span key={x.f} className="lb-roll">
                      {x.v}
                    </span>
                    {x.f ? (
                      <span key={'p' + x.f} className="lb-plus">
                        +1
                      </span>
                    ) : null}
                  </span>
                  <span className="lb-d">{x.delta}</span>
                </span>
                <svg className="lb-spark" viewBox="0 0 124 36" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id={x.grad} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={x.c} stopOpacity=".32" />
                      <stop offset="1" stopColor={x.c} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={x.spark.fill} fill={`url(#${x.grad})`} className="lb-sfill" />
                  <path d={x.spark.line} stroke={x.c} strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" className="lb-sline" pathLength={1} />
                  <circle cx={x.spark.ex} cy={x.spark.ey} r="2.6" fill={x.c} className="lb-dot" />
                </svg>
              </button>
            ))}
          </div>

          {/* the wiring channel: one straight lane per tile, never through text or tiles */}
          <svg className="lb-chan" viewBox="0 0 96 464" preserveAspectRatio="none" aria-hidden="true">
            {tiles.map((x, k) => {
              const y = 52 + k * 120;
              return (
                <g key={x.id}>
                  <path d={`M0 ${y} H96`} className="lb-lane" style={{ animationDelay: 0.8 + k * 0.1 + 's' }} pathLength={1} />
                  <circle cx="92" cy={y} r="3.5" className="lb-node" style={{ animationDelay: 1.1 + k * 0.1 + 's' }} />
                  {pulse && pulse.k === x.id ? <path key={pulse.id} d={`M96 ${y} H0`} className="lb-pulse" pathLength={1} /> : null}
                </g>
              );
            })}
          </svg>

          <div className="lb-board" data-board="1">
            <div className="lb-bh">
              <span className="lb-path">
                <img src="/assets/se-logo-128.webp" alt="" width="22" height="22" />
                se://deira/board
              </span>
              <span className="lb-clock">
                {v.clock} GST <b>● LIVE</b>
              </span>
            </div>
            <div className="lb-tabs" role="tablist">
              {(v.tabs || []).map((t: any) => (
                <button key={t.id} type="button" role="tab" aria-selected={t.on} className={t.on ? 'on' : ''} onClick={t.pick}>
                  {t.t}
                </button>
              ))}
            </div>
            <div className="lb-rows" key={v.filt}>
              {rows.map((r, i) => (
                <button key={r.key} type="button" className={'lb-row' + (r.isNew ? ' new' : '')} style={{ animationDelay: r.d }} onClick={r.go}>
                  <span className="lb-t">{r.t}</span>
                  <span className="lb-tag" style={{ background: r.tagBg, color: r.tagInk }}>
                    {r.tag}
                  </span>
                  <span className="lb-th">{r.hasTh ? <img src={r.th} alt="" /> : r.hasCc ? <span className="lb-cc" data-no-i18n="">{r.cc}</span> : null}</span>
                  <span className="lb-item" data-no-i18n={r.hasCc ? undefined : ''}>
                    <span className="lb-type">{r.text}</span>
                  </span>
                  <span className="lb-note" style={{ color: r.noteC }}>
                    {r.note}
                  </span>
                  {i === 0 ? null : null}
                </button>
              ))}
            </div>
            <div className="lb-foot">
              <span>
                <span key={v.total} className="lb-roll">
                  {v.total}
                </span>{' '}
                events today
              </span>
              <span className="lb-act" aria-hidden="true">
                {Array.from({ length: 14 }, (_, k) => (
                  <i key={k} style={{ animationDelay: -k * 0.21 + 's' }} />
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className="lb-trend">
          <span className="lb-tk">TRENDING RIGHT NOW</span>
          <div className="lb-tick">
            <div className="lb-tick-in">
              {(v.trend || []).map((x: any, i: number) => (
                <span key={i} className="lb-chip">
                  <span data-no-i18n="">{x.t}</span>
                  <b key={x.n}>{x.n} searches</b>
                </span>
              ))}
            </div>
          </div>
        </div>
        <a href="#deals" onClick={v.goDeals} className="lb-cta">
          See deals & arrivals
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      {/* faint decorative circuit in the empty top-right corner (Issue 4: empty areas only, 8–12%) */}
      <svg className="lb-deco" viewBox="0 0 320 140" fill="none" aria-hidden="true">
        <path d="M320 20 H210 L180 50 H120 L100 70 H0" stroke="#F7C032" strokeWidth="1.2" />
        <circle cx="180" cy="50" r="3.5" stroke="#F7C032" strokeWidth="1.2" />
        <circle cx="100" cy="70" r="3.5" stroke="#F7C032" strokeWidth="1.2" />
      </svg>
    </section>
  );
}

const SELiveBoard = createDC('SE Live Board', Logic, render);
export default SELiveBoard;
