// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Nav". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';
import SEFMPMenu from '../../dc/SEFMPMenu';

export default function Nav({ v }: { v: Vals }) {
  return (
    <header
      style={cssToObj(
        `position:fixed;left:0;right:0;top:0;z-index:60;background:${s(v.nav?.bg)};backdrop-filter:blur(18px) saturate(1.3);-webkit-backdrop-filter:blur(18px) saturate(1.3);border-bottom:1px solid ${s(v.nav?.bd)};color:${s(v.nav?.ink)};transition:background .35s,color .35s,border-color .35s`,
      )}
    >
      {'\n  '}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          height: '72px',
          padding: '0 clamp(20px,3.3vw,48px)',
        }}
      >
        {'\n    '}
        <a href="#top" onClick={v.goTop} style={{ display: 'flex', alignItems: 'center', gap: '13px', flex: 'none' }}>
          {'\n      '}
          <span
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: '0 0 0 2px #F7C032,0 0 18px rgba(247,192,50,.4)',
              flex: 'none',
            }}
          >
            <img src="assets/se-logo.png" alt="Sam Electronics" style={{ width: '100%', height: '100%', display: 'block' }} />
          </span>
          {'\n      '}
          <span style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '600',
                fontSize: '16px',
                letterSpacing: '.16em',
                lineHeight: '1',
                whiteSpace: 'nowrap',
              }}
            >
              SAM ELECTRONICS
            </span>
            <span
              style={cssToObj(
                `font-family:'Inter',sans-serif;font-weight:400;font-size:10px;letter-spacing:.26em;line-height:1;white-space:nowrap;color:${s(v.nav?.sub)}`,
              )}
            >
              QUALITY · WARRANTY · PRICE
            </span>
          </span>
          {'\n    '}
        </a>
        {'\n    '}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,2vw,28px)', fontSize: '15px', fontWeight: '500' }}>
          {'\n      '}
          <SEFMPMenu />
          {'\n      '}
          {v.nav?.showLinks ? (
            <>
              {(Array.isArray(v.navLinks) ? v.navLinks : []).map((__it: any, __i: number) => {
                const v2 = { ...v, l: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <a
                      href={v.l?.href}
                      onClick={v.l?.go}
                      style={{ whiteSpace: 'nowrap', opacity: '.92', transition: 'color .2s,opacity .2s' }}
                      className={cx(undefined, 'scp-4c08dbd8')}
                    >
                      {t(v.l?.label)}
                    </a>
                  </React.Fragment>
                ))(v2);
              })}
            </>
          ) : null}
          {'\n    '}
        </nav>
        {'\n    '}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 'none' }}>
          {'\n      '}
          {/* G7: status pill. Hover (or keyboard focus) shows the weekly hours, branch and countdown; click goes to Visit us. */}
          <span className="se-status" style={{ position: 'relative', display: 'flex' }}>
            <button
              type="button"
              onClick={v.st?.go}
              aria-describedby="se-status-pop"
              style={cssToObj(
                `display:flex;align-items:center;gap:8px;white-space:nowrap;height:32px;box-sizing:border-box;padding:0 12px;border-radius:10px;background:${s(v.nav?.pillBg)};border:1px solid ${s(v.nav?.pillBd)};font:inherit;font-size:13px;font-weight:500;color:inherit;cursor:pointer`,
              )}
            >
              <span style={{ position: 'relative', width: '7px', height: '7px', flex: 'none' }}>
                <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)}`)}></span>
                <span
                  style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)};animation:${s(v.st?.ping)}`)}
                ></span>
              </span>
              {t(v.st?.short)}
            </button>
            <span id="se-status-pop" role="tooltip" className="se-status-pop">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                <span style={{ position: 'relative', width: '8px', height: '8px', flex: 'none' }}>
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)}`)}></span>
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)};animation:${s(v.st?.ping)}`)}></span>
                </span>
                {t(v.st?.short)}
              </span>
              <span style={{ display: 'block', marginTop: '4px', paddingInlineStart: '16px', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#F7C032' }}>
                {t(v.st?.pop?.count)}
              </span>
              <span style={{ display: 'block', margin: '12px 0 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#8A8C90' }}>
                {t(v.st?.pop?.branch)}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {(Array.isArray(v.st?.pop?.days) ? v.st.pop.days : []).map((d: any) => (
                  <span
                    key={d.day}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '5px 8px', borderRadius: '8px', background: d.bg, color: d.ink, fontWeight: d.w, fontSize: '13px' }}
                  >
                    <span>{d.day}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', whiteSpace: 'nowrap' }}>{d.h}</span>
                  </span>
                ))}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12px', color: '#C9CBCE' }}>
                See hours &amp; directions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </span>
            </span>
          </span>
          {'\n      '}
          <span style={cssToObj(`display:flex;gap:2px;padding:3px;border-radius:10px;background:${s(v.nav?.pillBg)};font-size:12px`)}>
            {/* G9: language switch. The active language is highlighted; the choice is remembered (src/i18n/lang.ts). */}
            <button
              data-no-i18n
              onClick={v.english}
              aria-pressed={!v.isAr}
              style={cssToObj(
                `padding:4px 9px;border:none;border-radius:7px;font:inherit;font-size:12px;cursor:pointer;background:${v.isAr ? 'none' : s(v.nav?.langOn)};color:${v.isAr ? 'inherit' : s(v.nav?.langOnInk)};font-weight:${v.isAr ? 400 : 600}`,
              )}
            >
              EN
            </button>
            <button
              data-no-i18n
              lang="ar"
              onClick={v.arabic}
              aria-pressed={!!v.isAr}
              style={cssToObj(
                `padding:4px 9px;border:none;border-radius:7px;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:12px;cursor:pointer;background:${v.isAr ? s(v.nav?.langOn) : 'none'};color:${v.isAr ? s(v.nav?.langOnInk) : 'inherit'};font-weight:${v.isAr ? 600 : 400}`,
              )}
            >
              عربي
            </button>
          </span>
          {'\n      '}
          <button
            onClick={v.bench}
            title="My Bench"
            style={{ display: 'flex', border: 'none', background: 'none', padding: '4px', color: 'inherit', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21a8 8 0 0 1 16 0"></path>
            </svg>
          </button>
          {'\n      '}
          <button
            data-navcart="1"
            onClick={v.openCart}
            title="Cart"
            style={{
              position: 'relative',
              display: 'flex',
              border: 'none',
              background: 'none',
              padding: '4px',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span
              style={cssToObj(
                `position:absolute;top:-4px;right:-6px;min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;border-radius:9px;background:#F7C032;color:#26282B;font-size:11px;font-weight:700;display:grid;place-items:center;transform:scale(${s(v.cartPop)});transition:transform .3s cubic-bezier(.2,1.6,.4,1)`,
              )}
            >
              {t(v.cartCountShown)}
            </span>
          </button>
          {'\n      '}
          <button
            onClick={v.staff}
            title="Staff · Control Room"
            style={{
              display: 'flex',
              border: 'none',
              background: 'none',
              padding: '4px',
              color: 'inherit',
              opacity: '.7',
              cursor: 'pointer',
            }}
            className={cx(undefined, 'scp-18367cd8')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="11" width="16" height="10" rx="2"></rect>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
            </svg>
          </button>
          {'\n      '}
          <button
            onClick={v.openMap}
            title="System Map"
            style={cssToObj(
              `display:flex;align-items:center;justify-content:center;width:42px;height:36px;border-radius:10px;border:1px solid ${s(v.nav?.pillBd)};background:${s(v.nav?.pillBg)};color:inherit;cursor:pointer`,
            )}
            className={cx(undefined, 'scp-71e4b6d9')}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h11"></path>
            </svg>
          </button>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
      {'\n  '}
      <div style={cssToObj(`position:relative;height:2px;background:${s(v.nav?.track)}`)}>
        {'\n    '}
        <div
          data-prog="bar"
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            bottom: '0',
            width: '0%',
            backgroundImage: 'linear-gradient(90deg,#C9921A 0%,#F7C032 30%,#FFF4D1 45%,#F7C032 60%,#C9921A 100%)',
            backgroundSize: '200px 2px',
            animation: 'seFlowBg 1.2s linear infinite',
            boxShadow: '0 0 10px rgba(247,192,50,.8)',
          }}
        ></div>
        {'\n    '}
        <span
          data-prog="dot"
          style={{
            position: 'absolute',
            left: '0%',
            top: '-3px',
            width: '8px',
            height: '8px',
            marginLeft: '-4px',
            borderRadius: '50%',
            background: '#FFDB6E',
            boxShadow: '0 0 12px 4px rgba(247,192,50,.7)',
          }}
        ></span>
        {'\n    '}
        <span
          style={{
            position: 'absolute',
            right: '6px',
            top: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            boxSizing: 'border-box',
            border: '2px solid #F7C032',
            background: 'transparent',
            transition: 'background .3s,box-shadow .3s',
          }}
          data-prog="end"
        ></span>
        {'\n  '}
      </div>
    </header>
  );
}
