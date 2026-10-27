// The Feed (Issue 15 part A): 13 Oct 2026. Styles in src/styles/feed.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEFeed.logic.js';

export const GLYPH: Record<string, React.ReactNode> = {
  ig: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </>
  ),
  tt: <path d="M14 3h3a4 4 0 0 0 4 4v3a7 7 0 0 1-4-1.3V15a6 6 0 1 1-6-6v3.2a2.8 2.8 0 1 0 3 2.8z" fill="currentColor" />,
  fb: <path d="M14 8V6.5c0-.8.4-1.5 1.6-1.5H17V2h-2.6C11.6 2 11 4 11 6v2H8.5v3H11v11h3V11h2.6l.4-3z" fill="currentColor" />,
};
const Heart = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z" fill="currentColor" />
  </svg>
);

function Screen({ id, v }: { id: string; v: Vals }) {
  const P = v.posts || [];
  if (id === 'ig')
    return (
      <div className="fs ig">
        <div className="fs-bar">
          <b data-no-i18n="">samelectronics.uae</b>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            {GLYPH.ig}
          </svg>
        </div>
        <div className="fs-scroll">
          <div className="fs-col">
            {[0, 1].map((r) =>
              P.map((p: any) => (
                <div key={r + '-' + p.k} className="ig-post" aria-hidden={r === 1 ? true : undefined}>
                  <span className="ig-h">
                    <i />
                    <b data-no-i18n="">samelectronics.uae</b>
                  </span>
                  <span className={'ig-img ' + p.bg}>{p.img ? <img src={p.img} alt="" /> : null}</span>
                  <span className="ig-act">
                    <Heart />
                    <b data-no-i18n="">{p.likes}</b>
                  </span>
                  <span className="ig-cap">{p.t}</span>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    );
  if (id === 'tt')
    return (
      <div className="fs tt">
        <span className="tt-prog">
          <i />
        </span>
        <span className="tt-bg" />
        {v.img(5) ? <img className="tt-hero" src={v.img(5)} alt="" /> : null}
        <span className="tt-mute" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6" />
          </svg>
        </span>
        <div className="tt-rail">
          <span>
            <Heart />
            <b data-no-i18n="">{v.tt?.likes}</b>
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
            </svg>
            <b data-no-i18n="">{v.tt?.com}</b>
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M14 4l8 8-8 8v-5c-6 0-9 2-12 6 1-6 4-11 12-12z" />
            </svg>
            <b data-no-i18n="">{v.tt?.share}</b>
          </span>
        </div>
        <div className="tt-hearts" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ ['--i' as string]: i } as React.CSSProperties}>
              <Heart />
            </i>
          ))}
        </div>
        <div className="tt-cap">
          <b data-no-i18n="">@samelectronics.uae</b>
          <span>Pixel 8 Pro camera swap in 60 seconds</span>
        </div>
      </div>
    );
  return (
    <div className="fs fb">
      <div className="fb-cover">
        <span className="fb-av">SE</span>
      </div>
      <div className="fb-id">
        <b data-no-i18n="">Sam Electronics</b>
        <span className="fb-follow">Follow</span>
      </div>
      <div className="fs-scroll">
        <div className="fs-col slow">
          {[0, 1].map((r) =>
            P.slice()
              .reverse()
              .map((p: any) => (
                <div key={r + '-' + p.k} className="fb-post" aria-hidden={r === 1 ? true : undefined}>
                  <span className="fb-t">{p.t}</span>
                  <span className={'ig-img ' + p.bg}>{p.img ? <img src={p.img} alt="" /> : null}</span>
                  <span className="fb-m">
                    <Heart /> <b data-no-i18n="">{p.likes}</b> · <span>{p.m}</span>
                  </span>
                </div>
              )),
          )}
        </div>
      </div>
    </div>
  );
}

function render(v: Vals) {
  const f = v.front || { ph: [0.2725, 0.04, 0.455, 0.92], scr: [0.043, 0.0215, 0.902, 0.957] };
  const scr = { left: (f.ph[0] + f.scr[0] * f.ph[2]) * 100 + '%', top: (f.ph[1] + f.scr[1] * f.ph[3]) * 100 + '%', width: f.scr[2] * f.ph[2] * 100 + '%', height: f.scr[3] * f.ph[3] * 100 + '%' };
  return (
    <section id="social" ref={v.secRef} data-tone="dark" data-screen-label="The Feed" className={'fd' + (v.seen ? ' fd-seen' : '')}>
      <span className="fd-aura" aria-hidden="true" />
      <div className="fd-in">
        {/* owner (27 Oct): one phone (not three), the follow buttons and all three QR codes at once, the week's drops */}
        <div className="fd-grid">
          <div className="fd-info">
            <span className="fd-eb">THE FEED · @SAMELECTRONICS.UAE</span>
            <h2 className="fd-h"><span>Follow @samelectronics.uae</span> <span>for daily stock drops.</span></h2>
            <p className="fd-p">New stock, offers and bench tests go up first on our channels. Scan a code or tap Follow.</p>
            <div className="fd-follow">
              {(v.ch || []).map((c: any) => (
                <a key={c.id} href={c.href} target="_blank" rel="noopener noreferrer" className={'fd-fl ' + c.id + (c.on ? ' on' : '')} onMouseEnter={c.pick}>
                  <span className="qr"><img src={c.qr} alt={'QR code for ' + c.name} width={96} height={96} loading="lazy" /><i className="scan" aria-hidden="true" /></span>
                  <span className="nm"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">{GLYPH[c.id]}</svg>{c.name}</span>
                  <span className="ct"><b data-n={c.followers} data-no-i18n="">0</b> <small>followers</small></span>
                  <span className="btn">Follow</span>
                </a>
              ))}
            </div>
          </div>

          <div className="fd-stage" onMouseEnter={() => v.hover(true)} onMouseLeave={() => v.hover(false)}>
            <span className="fd-pool" aria-hidden="true" />
            <div className="fd-sw" role="tablist">
              {(v.ch || []).map((c: any) => (
                <button key={c.id} type="button" role="tab" aria-selected={c.on} className={c.on ? 'on' : ''} onClick={c.pick}>
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">{GLYPH[c.id]}</svg>{c.name}
                </button>
              ))}
            </div>
            <a href={(v.ch || []).find((c: any) => c.on)?.href} target="_blank" rel="noopener noreferrer" className="fd-ph one">
              <span className="fd-ph-in">
                <span className="fd-refl" aria-hidden="true">{v.phone ? <img src={v.phone} alt="" /> : null}</span>
                {v.phone ? <img className="fd-body" src={v.phone} alt="" draggable={false} /> : null}
                <span className="fd-scr" style={scr}>
                  <span className="fd-on" key={v.cur}>{v.seen ? <Screen id={v.cur} v={v} /> : null}</span>
                  <span className="fd-glass" aria-hidden="true" />
                </span>
                <span className="fd-rim" aria-hidden="true" />
              </span>
            </a>
          </div>

          <div className="fd-drops">
            <span className="fd-k"><i className="live" />THIS WEEK ON OUR CHANNELS</span>
            {(v.drops || []).map((d: any, i: number) => (
              <div key={d.t} className="fd-drop" style={{ ['--i' as string]: i } as React.CSSProperties}>
                <span className="tag">{d.tag}</span>
                <b>{d.t}</b>
                <small>{d.m}</small>
                <em>{d.ago}</em>
              </div>
            ))}
            <div className="fd-next"><span>NEXT LANDING</span><b>Thursday · 14:00</b><small>Turn on notifications so you see it first</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SEFeed = createDC('SE Feed', Logic, render);
export default SEFeed;
