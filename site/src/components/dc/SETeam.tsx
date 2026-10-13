// The team, "Staff Badges" (Issue 11): 13 Oct 2026. Styles in src/styles/team.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SETeam.logic.js';

function render(v: Vals) {
  return (
    <section id="team" ref={v.secRef} className={'tm' + (v.seen ? ' tm-seen' : '')} data-tone="dark">
      <div className="tm-pool" aria-hidden="true" />
      <div className="tm-in">
        <header className="tm-top">
          <span className="tm-eb">THE TEAM · ONE CIRCUIT</span>
          <h2 className="tm-h">
            <span>
              <span>Five roles. Every order</span>
            </span>
            <span>
              <span>passes through all of us.</span>
            </span>
          </h2>
          <p className="tm-sub">Click a badge to see what each role can help you with.</p>
        </header>

        <div className="tm-stage" onMouseMove={v.move} onMouseLeave={v.leave}>
          <div className="tm-rail" aria-hidden="true">
            <i />
          </div>
          <div className="tm-ticket" data-s="ticket" aria-hidden="true">
            <span className="hook" />
            <span className="paper">
              <b>ORDER</b>
              <span data-no-i18n="">#1294</span>
            </span>
          </div>
          <div className="tm-row">
            {(v.badges || []).map((b: any) => (
              <div key={b.code} className={'tm-slot' + (b.founder ? ' f' : '')}>
                <div className="tm-swing" data-g={b.i}>
                  <span className="tm-ring" aria-hidden="true" />
                  <span className="tm-lan" aria-hidden="true">
                    <span>SAM ELECTRONICS · SAM ELECTRONICS</span>
                  </span>
                  <span className="tm-clip" aria-hidden="true" />
                  <div className="tm-badge">
                    <div
                      className={'tm-card' + (b.flipped ? ' flip' : '')}
                      onClick={b.flip}
                      role="button"
                      tabIndex={0}
                      aria-pressed={b.flipped}
                      aria-label={b.role}
                    >
                      <div className="tm-face front">
                        <span className="tm-slot-cut" aria-hidden="true" />
                        <div className="tm-band">
                          <b data-no-i18n="">SAM ELECTRONICS</b>
                          <span>{b.founder ? 'LEADING SINCE 2003' : 'STAFF'}</span>
                        </div>
                        <div className="tm-photo">
                          <span data-no-i18n="">{b.mono}</span>
                        </div>
                        <span className="tm-code" data-no-i18n="">
                          {b.code}
                        </span>
                        <h3>{b.role}</h3>
                        {b.name ? (
                          <span className="tm-name">
                            {b.name}
                          </span>
                        ) : (
                          <span className="tm-name dim">Name to come</span>
                        )}
                        {b.years ? <span className="tm-yrs">{b.years}</span> : <span className="tm-yrs dim">Sam Electronics · Deira</span>}
                        <div className="tm-holo" aria-hidden="true">
                          <i data-holo="" />
                        </div>
                        <span className="tm-gloss" aria-hidden="true" />
                      </div>
                      <div className="tm-face back">
                        <span className="tm-slot-cut" aria-hidden="true" />
                        <span className="tm-k">
                          <span data-no-i18n="">{b.code}</span> · {b.role}
                        </span>
                        <span className="tm-k2">WHAT I CAN HELP WITH</span>
                        <ul>
                          {b.help.map((h: string) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                        <p>{b.bio}</p>
                        <a href={b.href} target="_blank" rel="noopener noreferrer" className="tm-ask">
                          {b.ask}
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                        <span className="tm-gloss" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const SETeam = createDC('SE Team', Logic, render);
export default SETeam;
