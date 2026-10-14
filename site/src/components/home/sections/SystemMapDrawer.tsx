// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "SystemMapDrawer". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';

export default function SystemMapDrawer({ v }: { v: Vals }) {
  return (
    <>
      {v.drawer?.map ? (
        <>
          <div style={{ position: 'fixed', inset: '0', zIndex: '90', display: 'flex', justifyContent: 'flex-end' }}>
            {'\n  '}
            <div
              onClick={v.drawer?.close}
              style={{
                position: 'absolute',
                inset: '0',
                background: 'rgba(26,27,29,.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            ></div>
            {'\n  '}
            <nav
              style={{
                position: 'relative',
                width: 'min(460px,100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(180deg,#26282B,#26282B)',
                color: '#FFFFFF',
                boxShadow: '-30px 0 80px rgba(0,0,0,.4)',
                animation: 'seSlideIn .35s cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n    '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '72px',
                  padding: '0 24px',
                  borderBottom: '1px solid rgba(255,255,255,.08)',
                }}
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '20px' }}>System Map</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#9DA1A6' }}>
                    12 ENTRIES · THE WHOLE SITE
                  </span>
                </span>
                <button
                  onClick={v.drawer?.close}
                  aria-label="Close"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '40px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,.16)',
                    background: 'transparent',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 6l12 12M18 6 6 18"></path>
                  </svg>
                </button>
              </div>
              {'\n    '}
              <div style={{ flex: '1', overflowY: 'auto', padding: '8px 12px' }}>
                {'\n      '}
                {(Array.isArray(v.sysMap) ? v.sysMap : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, m: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <a
                        href="#top"
                        onClick={v.m?.go}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '34px minmax(0,1fr) 20px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '12px',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          transition: 'background .2s',
                        }}
                        className={cx(undefined, 'scp-7173f7a2')}
                      >
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#F7C032' }}>{t(v.m?.n)}</span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '17px' }}>{t(v.m?.t)}</span>
                          <span style={{ fontSize: '13px', color: '#9DA1A6' }}>{t(v.m?.d)}</span>
                        </span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.2">
                          <path d="M5 12h14M13 6l6 6-6 6"></path>
                        </svg>
                      </a>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n    '}
              </div>
              {'\n    '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  padding: '16px 24px 22px',
                  borderTop: '1px solid rgba(255,255,255,.08)',
                }}
              >
                {'\n      '}
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,.05)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                    <span style={{ position: 'relative', display: 'inline-block', width: '7px', height: '7px', flex: 'none' }}>
                  {/* G7: same pulse in every state (the closed red dot is as alive as the open green one) */}
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)}`)}></span>
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)};animation:${s(v.st?.ping)}`)}></span>
                </span>
                    Dubai · Deira
                  </span>
                  <span style={{ color: '#C9CBCE' }}>{t(v.st?.short)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#9DA1A6' }}>
                    {'Today '}
                    {t(v.todayHours)}
                  </span>
                </span>
                {'\n      '}
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,.05)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F7C032' }}></span>Madrid
                  </span>
                  <span style={{ color: '#C9CBCE' }}>{String(v.$facts?.madrid?.opening ?? '')}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#9DA1A6' }}>Plaza Mayor</span>
                </span>
                {'\n    '}
              </div>
              {'\n  '}
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
