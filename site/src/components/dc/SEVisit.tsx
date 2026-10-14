// Request console + Visit us (Issue 16): improved 13 Oct 2026. Styles in src/styles/visit.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEVisit.logic.js';
import SESamsoom from './SESamsoom';
import { MapDubai } from './SEStory';

const WA = <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" fill="currentColor" />;
const PHONE = <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" fill="none" stroke="currentColor" strokeWidth="2" />;
const MAIL = <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6" fill="none" stroke="currentColor" strokeWidth="2" />;

function render(v: Vals) {
  const sending = !!v.sent;
  return (
    <section id="visit" ref={v.secRef} data-tone="light" data-screen-label="Request & visit" className={'vs' + (v.seen ? ' vs-seen' : '')}>
      <div className="vs-in">
        {/* ---------- the request console ---------- */}
        <div className="vs-con">
          <span className="vs-eb">REQUEST CONSOLE</span>
          <h2 className="vs-h"><span>Tell us what you need.</span> <span>We print the work order.</span></h2>
          <div className="vs-tabs" role="tablist">
            {(v.types || []).map((t: any) => (
              <button key={t.name} type="button" role="tab" aria-selected={t.on} className={t.on ? 'on' : ''} onClick={t.pick}>
                {t.name}
              </button>
            ))}
          </div>
          <div className="vs-body">
            <div className="vs-fields" key={v.rt}>
              {(v.fields || []).map((f: any) => (
                <label key={f.label} className="vs-f" style={{ animationDelay: f.i * 0.06 + 's' }}>
                  <span>{f.label}</span>
                  <input value={f.val} onChange={f.set} placeholder={f.ph} />
                </label>
              ))}
              <div className="vs-prog">
                <span className="bar">
                  <i style={{ transform: 'scaleX(' + (v.total ? v.filled / v.total : 0) + ')' }} />
                </span>
                <small>
                  <b data-no-i18n="">
                    {v.filled} / {v.total}
                  </b>{' '}
                  <span>fields printed</span>
                </small>
              </div>
              <div className="vs-send">
                <button type="button" className={'vs-btn yel' + (v.sent === 'wa' ? ' hit' : '')} onClick={v.sendWa}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    {WA}
                  </svg>
                  Send on WhatsApp
                </button>
                <button type="button" className={'vs-btn line' + (v.sent === 'mail' ? ' hit' : '')} onClick={v.sendMail}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    {MAIL}
                  </svg>
                  Email it
                </button>
                {sending ? (
                  <span key={'ok' + v.sentN} className="vs-thumb" aria-hidden="true">
                    <SESamsoom mood="thanks" size={44} still={true} />
                  </span>
                ) : null}
              </div>
            </div>
            <div className="vs-printer">
              <span className="vs-slot" aria-hidden="true" />
              <div className="vs-slip-wrap">
                <div key={'s' + v.sentN} className={'vs-slip' + (sending ? ' tear ' + v.sent : '')} style={{ ['--n' as string]: v.lines.length } as React.CSSProperties}>
                  <span className="vs-perf" aria-hidden="true" />
                  <div className="vs-slip-h">
                    <b>WORK ORDER</b>
                    <span data-no-i18n="">{v.no}</span>
                  </div>
                  <div className="vs-line type" key={v.rt}>
                    <span>TYPE</span>
                    <b>{v.rt}</b>
                  </div>
                  {(v.lines || []).map((l: any) => (
                    <div key={l.k} className="vs-line">
                      <span>{l.k}</span>
                      <b data-no-i18n="">{l.v}</b>
                    </div>
                  ))}
                  <div className="vs-line">
                    <span>STATUS</span>
                    <em>{sending ? 'SENT' : 'NEW'}</em>
                  </div>
                  <span className="vs-bars" aria-hidden="true" />
                  <span className="vs-foot">Sam Electronics · Al Murar, Deira</span>
                  {sending ? <span className="vs-sent">SENT</span> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- visit us ---------- */}
        <div className="vs-card">
          <div className="vs-card-top">
            <span className="vs-eb dk">VISIT US · DUBAI TIME</span>
            <b className="vs-clock" data-no-i18n="">
              {v.clock}
            </b>
          </div>
          <div className="vs-status">
            <span className={'vs-dot' + (v.open ? ' on' : '')} style={{ ['--c' as string]: v.dot } as React.CSSProperties} />
            <span>
              <b>{v.status}</b> · <span>{v.sub}</span>
            </span>
            {v.count ? <em>{v.count}</em> : null}
          </div>
          <div className="vs-tl">
            <span className="vs-tl-bar">
              {(v.shifts || []).map((s: any) => (
                <i key={s.t} style={{ left: s.l, width: s.w }} />
              ))}
              <b className="now" style={{ left: v.nowAt }} />
            </span>
            <span className="vs-tl-l" aria-hidden="true" data-no-i18n="">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </span>
          </div>
          <ul className="vs-week">
            {(v.week || []).map((w: any) => (
              <li key={w.day} className={w.on ? 'on' : ''}>
                <span>{w.day}</span>
                <b data-no-i18n={w.h === 'Closed' ? undefined : ''}>{w.h}</b>
              </li>
            ))}
          </ul>
          <a className="vs-map" href={v.dir} target="_blank" rel="noopener noreferrer">
            <MapDubai />
            <span className="vs-map-a">
              Get directions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </span>
          </a>
          <p className="vs-addr">
            {v.address} · <span data-no-i18n="">{v.plus}</span>
          </p>
          <div className="vs-acts">
            <a href={v.wa} target="_blank" rel="noopener noreferrer" className="vs-btn dark">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                {WA}
              </svg>
              WhatsApp
            </a>
            <a href={v.tel} className="vs-btn line dk">
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                {PHONE}
              </svg>
              <span data-no-i18n="">{v.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const SEVisit = createDC('SE Visit', Logic, render);
export default SEVisit;
