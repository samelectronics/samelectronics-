// Meet Samsoom, "Ask at 3 a.m." (Issue 14): 13 Oct 2026. Styles in src/styles/meet.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEMeet.logic.js';
import SESamsoom from './SESamsoom';

function Card({ c }: { c: any }) {
  if (c.k === 'product')
    return (
      <div className="mt-card prod">
        <span className="th">{c.img ? <img src={c.img} alt="" /> : null}</span>
        <span className="tx">
          <b data-no-i18n="">{c.title}</b>
          <small>
            <em>{c.grade}</em> · {c.stock}
          </small>
          <strong data-no-i18n="">{c.price}</strong>
        </span>
        <button type="button" className="mt-add" onClick={c.add}>
          Add to cart
        </button>
      </div>
    );
  if (c.k === 'grades')
    return (
      <div className="mt-card grades">
        {c.rows.map((r: any) => (
          <span key={r.g} className="row">
            <span className="th sm">{r.img ? <img src={r.img} alt="" /> : null}</span>
            <b>{r.g}</b>
            <em data-no-i18n="">{r.p}</em>
          </span>
        ))}
      </div>
    );
  if (c.k === 'hours')
    return (
      <div className="mt-card hours">
        <span className={'dot' + (c.open ? ' on' : '')} />
        <span className="tx">
          <b>{c.state}</b>
          <small>
            <span>Today</span> <span data-no-i18n="">{c.line}</span>
          </small>
          <small>
            <span>Dubai time</span> <span data-no-i18n="">{c.clock}</span>
          </small>
        </span>
      </div>
    );
  if (c.k === 'trade')
    return (
      <div className="mt-card trade">
        <span className="tiers">
          {c.tiers.map(([q, d]: string[]) => (
            <span key={q}>
              <b data-no-i18n="">{q}</b>
              <em data-no-i18n="">{d}</em>
            </span>
          ))}
        </span>
        <button type="button" className="mt-add" onClick={c.go}>
          Open a trade account
        </button>
      </div>
    );
  return (
    <div className="mt-card ship">
      <svg viewBox="0 0 220 60" aria-hidden="true">
        <path d="M18 44 Q110 -6 202 26" className="arc" />
        <circle cx="18" cy="44" r="5" className="a" />
        <circle cx="202" cy="26" r="5" className="b" />
      </svg>
      <span className="tx">
        <span>
          <small>FROM</small>
          <b>{c.from}</b>
        </span>
        <span>
          <small>TO</small>
          <b>{c.to}</b>
        </span>
        <span>
          <small>ETA</small>
          <b>{c.eta}</b>
        </span>
      </span>
    </div>
  );
}

function render(v: Vals) {
  return (
    <section id="samsoom" ref={v.secRef} data-tone="light" data-screen-label="Meet Samsoom" className={'mt' + (v.seen ? ' mt-seen' : '')}>
      <div className="mt-vig" aria-hidden="true" />
      <div className="mt-in">
        <div className="mt-left">
          <span className="mt-eb">
            <span>MEET SAMSOOM · PARTS ASSISTANT</span>
          </span>
          <h2 className="mt-h">
            <span>
              <span>Ask at 3 a.m. Samsoom</span>
            </span>
            <span>
              <span>already knows the shelf.</span>
            </span>
          </h2>
          <p className="mt-p">
            Samsoom knows our catalogue, grades, hours and shipping. It finds the part, explains the grade, and hands you to a person on WhatsApp the second you need one.
          </p>
          {/* owner (27 Oct): the same Samsoom as the launcher on the right, big; under it what you can ask (fills the space) */}
          <div className="mt-stage2">
            <span className="mt-glow" aria-hidden="true" />
            <div className="mt-bot"><SESamsoom mood={v.mood} size={220} /></div>
            <div className="mt-asks">
              <span className="mt-k">TRY ASKING</span>
              {(v.tries || []).map((t: any) => (
                <button key={t.q} type="button" className={t.on ? 'on' : ''} onClick={t.go}>{t.q}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
              ))}
            </div>
          </div>
          <div className="mt-facts">
            <span><b>24/7</b><small>Answers any time</small></span>
            <span><b>9,000+</b><small>Parts it knows</small></span>
            <span><b>1 tap</b><small>To a person on WhatsApp</small></span>
          </div>
        </div>

        <div className="mt-chat">
          <div className="mt-chat-h">
            <span className="av"><SESamsoom mood="idle" size={40} still={true} /></span>
            <span className="nm">
              <b>Samsoom</b>
              <small>
                <i /> Online · replies in seconds
              </small>
            </span>
            <span className="ct" data-no-i18n="">
              {String(v.ci + 1).padStart(2, '0')} / {String(v.n).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-msgs">
            {(v.msgs || []).map((m: any) =>
              m.who === 'typing' ? (
                <div key={m.id} className="mt-row bot"><span className="mt-av bot" aria-hidden="true"><SESamsoom mood="think" size={30} still={true} /></span><div className="mt-m bot typing" aria-label="Samsoom is typing">
                  <i />
                  <i />
                  <i />
                </div></div>
              ) : (
                <div key={m.id} className={'mt-row ' + m.who}>
                  {m.who === 'me' ? <span className="mt-av me" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.2" /><path d="M3.5 21c.8-4.4 4.2-7 8.5-7s7.7 2.6 8.5 7z" /></svg></span> : <span className="mt-av bot" aria-hidden="true"><SESamsoom mood="happy" size={30} still={true} /></span>}
                  <div className={'mt-m ' + m.who}>
                    {m.t ? <span className="bub">{m.t}</span> : null}
                    {m.card ? <Card c={m.card} /> : null}
                  </div>
                </div>
              ),
            )}
          </div>
          {v.flyQ ? (
            <span key={v.flyQ} className="mt-flyq" aria-hidden="true">
              {v.flyQ}
            </span>
          ) : null}
          <button type="button" className="mt-ask" onClick={v.ask}>
            Ask Samsoom your own question
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

const SEMeet = createDC('SE Meet', Logic, render);
export default SEMeet;
