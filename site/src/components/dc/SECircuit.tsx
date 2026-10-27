// Sam Circuit membership, "The Charging Station" (Issue 13): 13 Oct 2026. Styles in src/styles/circuit.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SECircuit.logic.js';

const ICON = [
  // plug → bolt → double bolt → full battery
  <path key="p" d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5" />,
  <path key="b" d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  <path key="d" d="M9 2 3 12h5l-1 6 6-9H9zM17 6l-4 7h4l-1 5 5-8h-4z" />,
  <path key="f" d="M3 7h15a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM21 10v4M5 10v4M8 10v4M11 10v4M14 10v4" />,
];
const CABLE = 'M60 0 C 60 70, 150 60, 150 130 V 176';

function render(v: Vals) {
  const T = v.tiers || [];
  return (
    <section id="circuit" ref={v.secRef} data-tone="dark" data-screen-label="Sam Circuit" className={'cs' + (v.seen ? ' cs-seen' : '') + (v.on ? '' : ' cs-off')}>
      <div className="cs-in">
        <header className="cs-top">
          <div>
            <span className="cs-eb">SAM CIRCUIT · MEMBERSHIP</span>
            <h2 className="cs-h">
              <span>
                <span>Every order</span> <span className="se-acc">charges you up.</span>
              </span>
            </h2>
            <p>Four levels, one battery. The more you buy from us, the higher your charge, and the better the perks.</p>
          </div>
          <div className="cs-acts">
            <button type="button" className="cs-btn yel" onClick={v.join}>
              Create account
            </button>
            <button type="button" className="cs-btn line" onClick={v.join}>
              Log in
            </button>
          </div>
        </header>

        <div className="cs-main">
          {/* ---------- the battery ---------- */}
          <div className="cs-stage">
            <span className="cs-pool" aria-hidden="true" />
            <svg className="cs-cable" viewBox="0 0 300 180" aria-hidden="true">
              <path d={CABLE} className="jacket" />
              <path d={CABLE} className="core" />
              <path d={CABLE} className="flow" />
              {v.pulse ? (
                <circle key={v.pulse} r="7" className="pulse">
                  <animateMotion dur="0.42s" fill="freeze" path={CABLE} />
                </circle>
              ) : null}
            </svg>
            <div className="cs-bat-wrap">
              <div className="cs-bat">
                {v.flash ? <span key={'f' + v.flash} className="cs-flash" aria-hidden="true" /> : null}
                <span className="cs-plug" aria-hidden="true">
                  <i />
                </span>
                <span className="cs-cap" aria-hidden="true" />
                <div className="cs-case">
                  <div className="cs-win">
                    <div className="cs-fill" data-c="fill">
                      <span className="cs-surf" />
                      <span className="cs-surf b" />
                    </div>
                    <span className="cs-soft" aria-hidden="true" />
                    <b className="cs-pct" data-c="pct">
                      0%
                    </b>
                  </div>
                  <div className="cs-marks" aria-hidden="true">
                    {T.map((t: any) => (
                      <span key={t.i} className={'cs-mark' + (t.un ? ' on' : '') + (t.next ? ' next' : '')} style={{ bottom: (t.i + 1) * 25 + '%' }}>
                        <i />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="cs-refl" data-c="refl" aria-hidden="true" />
              {v.pop ? (
                <span key={'p' + v.pop} className="cs-pop">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                  </svg>
                  {v.popName}
                </span>
              ) : null}
            </div>
            <div className="cs-sim">
              <span className="cs-k">SIMULATOR</span>
              <div className="cs-sim-b">
                <button type="button" onClick={v.add(200)}>
                  + Screen · <span data-no-i18n="">AED 200</span>
                </button>
                <button type="button" onClick={v.add(80)}>
                  + Battery · <span data-no-i18n="">AED 80</span>
                </button>
                <button type="button" onClick={v.add(2000)}>
                  + Bulk order · <span data-no-i18n="">AED 2,000</span>
                </button>
                <button type="button" className="rs" onClick={v.reset}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ---------- the reward ladder ---------- */}
          <div className="cs-ladder">
            <span className="cs-k">REWARD LADDER</span>
            {T.slice()
              .reverse()
              .map((t: any) => (
                <div key={t.i} className={'cs-row' + (t.un ? ' un' : '') + (t.cur ? ' cur' : '') + (t.next ? ' next' : '')} style={{ animationDelay: 1.6 + (3 - t.i) * 0.1 + 's' }}>
                  <span className="ic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {ICON[t.i]}
                    </svg>
                  </span>
                  <span className="tx">
                    <b>{t.name}</b>
                    <small>{t.req}</small>
                    {t.next ? (
                      <span className="bar">
                        <i style={{ transform: 'scaleX(' + t.prog + ')' }} />
                      </span>
                    ) : null}
                  </span>
                  <span className="chip">{t.chip}</span>
                </div>
              ))}
            <p className="cs-note">Spend so far: <b data-no-i18n="">{v.spend}</b></p>
          </div>

          {/* ---------- the member card ---------- */}
          <div className="cs-card-wrap" onMouseMove={v.tilt} onMouseLeave={v.untilt}>
            <div className="cs-card" ref={v.cardRef}>
              <span className="cs-holo" aria-hidden="true" />
              <span className="cs-sweep" aria-hidden="true" />
              <div className="cs-card-in">
                <span className="cs-card-top">
                  <b data-no-i18n="">SAM CIRCUIT</b>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F7C032">
                    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                  </svg>
                </span>
                <span className="cs-chip" aria-hidden="true" />
                <span className="cs-name">Your name here</span>
                <span className="cs-card-b">
                  <span>
                    <small>TIER</small>
                    <b>{v.tierName}</b>
                  </span>
                  <span>
                    <small>CHARGE</small>
                    <b data-c="pct">0%</b>
                  </span>
                </span>
              </div>
            </div>
            <span className="cs-card-cap">Move your mouse over the card</span>
          </div>
        </div>

        {/* ---------- reward cards: locked → unlocked ---------- */}
        <div className="cs-perks">
          {T.map((t: any) => (
            <div key={t.i} className={'cs-perk' + (t.un ? ' un' : '')}>
              <div className="cs-perk-in">
                <div className="face lock">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <b>{t.name}</b>
                  <small>{t.req}</small>
                </div>
                <div className="face open">
                  <span className="sweep" aria-hidden="true" />
                  <span className="cs-k">{t.name}</span>
                  <ul>
                    {t.perks.map((p: string) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <small>Example perks · to be confirmed</small>
                </div>
              </div>
            </div>
          ))}
          <div className="cs-perk tease">
            <div className="cs-tease-blur" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <b>More perks revealed at launch</b>
          </div>
        </div>
      </div>
    </section>
  );
}

const SECircuit = createDC('SE Circuit', Logic, render);
export default SECircuit;
