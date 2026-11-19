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
        <div className={'vs-con' + (v.full ? ' vs-full' : '')}>
          {v.full ? <button type="button" className="vs-close" onClick={v.closeFull} aria-label="Close the full form">Close ×</button> : null}
          <span className="vs-eb">REQUEST CONSOLE</span>
          <h2 className="vs-h"><span>Tell us what you need.</span> <span>We print the work order.</span></h2>{/* owner (28 Oct): two lines, the second on its own */}
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
                f.kind === 'one' || f.kind === 'many' ? (
                  <div key={f.label} className="vs-f vs-opt" style={{ animationDelay: f.i * 0.06 + 's' }}>
                    <span>{f.label}{f.kind === 'many' ? <> · <em>choose any</em></> : null}</span>
                    <div className="vs-chips">
                      {f.opts.map((o: any) => (
                        <button key={o.x} type="button" className={o.on ? 'on' : ''} aria-pressed={o.on} onClick={o.pick}>{o.x}</button>
                      ))}
                    </div>
                    {f.otherOn ? <input className="vs-other" defaultValue={f.other} onChange={f.setOther} placeholder="Tell us which" autoFocus /> : null}
                  </div>
                ) : (
                  <label key={f.label} className="vs-f" style={{ animationDelay: f.i * 0.06 + 's' }}>
                    <span>{f.label}</span>
                    {f.kind === 'area' ? <textarea defaultValue={f.val} onChange={f.set} placeholder={f.ph} rows={2} /> : <input type={f.kind === 'date' ? 'date' : 'text'} defaultValue={f.val} onChange={f.set} placeholder={f.ph} />}
                  </label>
                )
              ))}
              {!v.full && v.more ? (
                <button type="button" className="vs-fullbtn" onClick={v.openFull}>
                  Open the full form · every detail
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              ) : null}
              {v.full ? <label className="vs-f vs-note">
                <span>Comment <em>optional</em></span>
                <textarea key={'n' + v.rt} defaultValue={v.note} onChange={v.setNote} placeholder="Anything else we should know?" rows={2} />
              </label> : null}
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
              {v.need ? <p className="vs-need" role="alert">Fill in every field to send: the full form is open and your answers are kept.</p> : null}
              <div className={'vs-send' + (v.complete ? ' ready' : '')}>
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
            <span className="vs-dot on" style={{ ['--c' as string]: v.dot } as React.CSSProperties} />
            <span>
              <b>{v.status}</b> · <span>{v.sub}</span>
            </span>
            {v.count ? <em>{v.count}</em> : null}
          </div>
          <div className="vs-tl se-ltr" /* R6 Part D: the day runs 00 → 24 left to right in both languages, like the times */>
            <span className="vs-tl-bar">
              {(v.shifts || []).map((s: any) => (
                <i key={s.t} style={{ left: s.l, width: s.w }} />
              ))}
              <em className="fill" style={{ width: v.nowAt }} />
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
                <b className="se-ltr" data-no-i18n={w.h === 'Closed' ? undefined : ''}>{w.h}</b>
              </li>
            ))}
          </ul>
          {/* owner (R10): a real Google map you can move and zoom (the drawn map stays underneath while it loads) */}
          <div className="vs-map vs-map-live">
            <MapDubai />
            <iframe title="Sam Electronics · Al Murar, Deira" src={'https://www.google.com/maps?q=' + encodeURIComponent('78G4+3H2 Dubai') + '&z=17&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <p className="vs-addr">
            {v.address} · <span data-no-i18n="">{v.plus}</span>
          </p>
          {/* owner (R10, the rule for every contact block): Directions and Contact us first (Contact us opens every way to
              reach us), WhatsApp and WeChat on their own row below; each opens a preview before leaving the website */}
          <div className="vs-acts">
            <a href={v.dir} target="_blank" rel="noopener noreferrer" className="vs-btn yel">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
              Directions
            </a>
            <button type="button" className="vs-btn line dk" onClick={() => window.dispatchEvent(new CustomEvent('se:chatwith'))}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
              Contact us
            </button>
            <button type="button" className="vs-btn wa" onClick={() => window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wa' } }))}>
              <i className="ct-ic wa" aria-hidden="true" />
              WhatsApp
            </button>
            <button type="button" className="vs-btn wc" onClick={() => window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wc' } }))}>
              <i className="ct-ic wc" aria-hidden="true" />
              WeChat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const SEVisit = createDC('SE Visit', Logic, render);
export default SEVisit;
