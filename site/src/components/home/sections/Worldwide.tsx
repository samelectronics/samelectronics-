// GENERATED from design/project/Sam Electronics Home v3.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
// Home v3 section "Worldwide". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';

export default function Worldwide({ v }: { v: Vals }) {
  return (
    <section
      id="network"
      data-tone="dark"
      data-screen-label="10 Worldwide network"
      onMouseMove={v.glow?.move}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(80% 70% at 60% 40%,#3D3E3F 0%,#26282B 75%)',
        color: '#FFFFFF',
        padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)',
      }}
    >
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          backgroundImage:
            'linear-gradient(rgba(247,192,50,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(247,192,50,.06) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
          backgroundSize: '120px 120px,120px 120px,24px 24px,24px 24px',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {'\n    '}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '620px' }}>
            {'\n        '}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.14em',
                color: '#F7C032',
              }}
            >
              <span style={{ width: '28px', height: '2px', background: '#F7C032' }}></span>WORLDWIDE NETWORK
            </span>
            {'\n        '}
            <h2
              style={{
                margin: '0',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: 'clamp(34px,3.4vw,48px)',
                lineHeight: '1.08',
                letterSpacing: '-.03em',
              }}
            >
              From Deira to the world.
            </h2>
            {'\n        '}
            <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#D5D7DA', maxWidth: '540px' }}>
              Parts leave our counter every day for the Middle East, Africa, Europe and Asia. Tracked, securely packed, and quoted before
              they ship.
            </p>
            {'\n      '}
          </div>
          {'\n      '}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              padding: '5px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,.05)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
            }}
          >
            {(Array.isArray(v.net?.regions) ? v.net?.regions : []).map((__it: any, __i: number) => {
              const v2 = { ...v, r: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <button
                    onClick={v.r?.pick}
                    style={cssToObj(
                      `display:flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:10px;border:none;background:${s(v.r?.bg)};color:${s(v.r?.ink)};font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s`,
                    )}
                  >
                    {t(v.r?.name)}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', opacity: '.75' }}>{t(v.r?.n)}</span>
                  </button>
                </React.Fragment>
              ))(v2);
            })}
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '20px', alignItems: 'stretch' }}>
          {'\n      '}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#1A1B1D',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08),0 30px 60px rgba(0,0,0,.4)',
              aspectRatio: '1200/620',
            }}
          >
            {'\n        '}
            <iframe
              ref={v.mapRef}
              data-src="SE World Map.html"
              title="Countries we ship to"
              style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', border: '0', background: 'transparent' }}
              loading="lazy"
            ></iframe>
            {'\n        '}
            <span
              style={{
                position: 'absolute',
                left: '16px',
                bottom: '14px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px',
                color: '#9DA1A6',
                pointerEvents: 'none',
              }}
            >
              Example destinations · owner-provided
            </span>
            {'\n      '}
          </div>
          {'\n      '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              background: '#0B0C0D',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
              overflow: 'hidden',
            }}
          >
            {'\n        '}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '46px',
                padding: '0 16px',
                borderBottom: '1px solid rgba(255,255,255,.07)',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                color: '#F7C032',
              }}
            >
              <span>SHIPMENTS · DXB</span>
              <span style={{ color: '#9DA1A6' }}>{t(v.net?.count)}</span>
            </div>
            {'\n        '}
            <div style={{ position: 'relative', flex: '1', minHeight: '336px', overflow: 'hidden' }}>
              <div
                style={cssToObj(
                  `position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;animation:${s(v.net?.boardAnim)} infinite`,
                )}
              >
                {'\n          '}
                {(Array.isArray(v.net?.board) ? v.net?.board : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, c: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      {'\n            '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0,1fr) auto',
                          gap: '8px',
                          alignItems: 'center',
                          height: '42px',
                          flex: 'none',
                          boxSizing: 'border-box',
                          padding: '0 16px',
                          borderBottom: '1px solid rgba(255,255,255,.05)',
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '13px',
                        }}
                      >
                        {'\n              '}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '0', overflow: 'hidden' }}>
                          <span style={{ color: '#8C9096', fontSize: '11px' }}>{t(v.c?.box)}</span>
                          <span
                            style={{
                              color: '#F2F3F4',
                              fontWeight: '600',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {t(v.c?.name)}
                          </span>
                        </span>
                        {'\n              '}
                        <span
                          style={cssToObj(
                            `display:flex;align-items:center;gap:6px;padding:3px 8px;border-radius:6px;background:${s(v.c?.sb)};color:${s(v.c?.sc)};font-size:11px;font-weight:600;white-space:nowrap`,
                          )}
                        >
                          <span style={cssToObj(`width:6px;height:6px;border-radius:50%;background:${s(v.c?.sc)}`)}></span>
                          {t(v.c?.status)}
                        </span>
                        {'\n            '}
                      </div>
                      {'\n          '}
                    </React.Fragment>
                  ))(v2);
                })}
              </div>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px' }}>
          {'\n      '}
          <div
            style={
              {
                '--sp': '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-8c36d164')}
          >
            <div
              style={{
                position: 'relative',
                width: '96px',
                height: '72px',
                marginBottom: '6px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,.22)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
                overflow: 'hidden',
              }}
            >
              <svg viewBox="0 0 96 48" width="96" height="48" style={{ position: 'absolute', left: '0', top: '4px' }} fill="none">
                <path d="M10 38 C 30 6, 64 6, 86 30" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeDasharray="3 4"></path>
                <circle cx="10" cy="38" r="3" fill="#FFFFFF"></circle>
                <circle cx="86" cy="30" r="3.5" fill="#F7C032"></circle>
              </svg>
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '4px',
                  width: '8px',
                  height: '8px',
                  margin: '-4px 0 0 -4px',
                  borderRadius: '50%',
                  background: '#FFDB6E',
                  boxShadow: '0 0 8px #F7C032',
                  offsetPath: "path('M10 38 C 30 6, 64 6, 86 30')",
                  animation: 'nwTrack calc(3s * var(--sp)) cubic-bezier(.45,0,.55,1) infinite',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  bottom: '6px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '8.5px',
                  color: '#E4E6E9',
                  whiteSpace: 'nowrap',
                  animation: 'nwType calc(3s * var(--sp)) steps(20) infinite',
                }}
              >
                SE-4544 · In transit
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
              TRACKED
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '18px' }}>Every box, every step</span>
            <span style={{ fontSize: '14px', color: '#C9CBCE' }}>Tracking number sent with your order.</span>
          </div>
          <div
            style={
              {
                '--sp': '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-8c36d164')}
          >
            <div
              style={{
                position: 'relative',
                width: '96px',
                height: '72px',
                marginBottom: '6px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,.22)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', left: '28px', top: '22px', width: '40px', height: '32px', perspective: '200px' }}>
                <span
                  style={{
                    position: 'absolute',
                    inset: '0',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 4px 6px rgba(0,0,0,.4)',
                    transformOrigin: '50% 100%',
                    animation: 'nwBox calc(3s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '20px',
                    height: '14px',
                    background: '#C9954F',
                    transformOrigin: '0 0',
                    animation: 'nwFlapL calc(3s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    width: '20px',
                    height: '14px',
                    background: '#C9954F',
                    transformOrigin: '100% 0',
                    animation: 'nwFlapR calc(3s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '-1px',
                    width: '8px',
                    height: '34px',
                    background: 'rgba(255,240,210,.75)',
                    transformOrigin: '50% 0',
                    animation: 'nwTape calc(3s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '3px',
                    bottom: '4px',
                    width: '12px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                    animation: 'nwLbl calc(3s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
              PACKED
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '18px' }}>Securely, by hand</span>
            <span style={{ fontSize: '14px', color: '#C9CBCE' }}>Screens boxed flat, batteries packed to air-freight rules.</span>
          </div>
          <div
            style={
              {
                '--sp': '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-8c36d164')}
          >
            <div
              style={{
                position: 'relative',
                width: '96px',
                height: '72px',
                marginBottom: '6px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,.22)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', left: '10px', top: '18px', height: '22px', overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'nwQuote calc(3.6s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      height: '22px',
                      lineHeight: '22px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}
                  >
                    AED 120
                  </span>
                  <span
                    style={{
                      height: '22px',
                      lineHeight: '22px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}
                  >
                    AED 185
                  </span>
                  <span
                    style={{
                      height: '22px',
                      lineHeight: '22px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}
                  >
                    AED 150
                  </span>
                  <span
                    style={{
                      height: '22px',
                      lineHeight: '22px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}
                  >
                    AED 150
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" width="22" height="22" style={{ position: 'absolute', left: '12px', top: '44px' }} fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="#2BB673"
                  style={{ transformOrigin: '12px 12px', animation: 'nwChkBg calc(3.6s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite' }}
                ></circle>
                <path
                  d="M7 12l3.5 3.5L17 9"
                  stroke="#FFFFFF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  pathLength="20"
                  strokeDasharray="20"
                  style={{ animation: 'nwChk calc(3.6s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite' }}
                ></path>
              </svg>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
              QUOTED
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '18px' }}>Before it ships</span>
            <span style={{ fontSize: '14px', color: '#C9CBCE' }}>Shipping cost confirmed with your order total.</span>
          </div>
          <div
            style={
              {
                '--sp': '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-8c36d164')}
          >
            <div
              style={{
                position: 'relative',
                width: '96px',
                height: '72px',
                marginBottom: '6px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,.22)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '10px',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle at 35% 30%,#5E7AA6,#26324A 70%)',
                  boxShadow: 'inset -6px -6px 12px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.15)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '200%',
                    height: '100%',
                    background:
                      'repeating-linear-gradient(90deg,rgba(255,255,255,.22) 0 1px,transparent 1px 11.5px),radial-gradient(ellipse 7px 9px at 14px 20px,#4A6B4E 98%,transparent),radial-gradient(ellipse 9px 6px at 32px 30px,#4A6B4E 98%,transparent),radial-gradient(ellipse 7px 9px at 60px 20px,#4A6B4E 98%,transparent),radial-gradient(ellipse 9px 6px at 78px 30px,#4A6B4E 98%,transparent)',
                    animation: 'nwGlobe calc(6s * var(--sp)) linear infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    inset: '0',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),rgba(255,255,255,0) 45%)',
                  }}
                ></span>
              </span>
              <div style={{ position: 'absolute', left: '60px', top: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#8C9096',
                    animation: 'nwReg0 calc(4s * var(--sp)) steps(1) infinite',
                  }}
                >
                  ME
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#8C9096',
                    animation: 'nwReg1 calc(4s * var(--sp)) steps(1) infinite',
                  }}
                >
                  AFR
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#8C9096',
                    animation: 'nwReg2 calc(4s * var(--sp)) steps(1) infinite',
                  }}
                >
                  EU
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#8C9096',
                    animation: 'nwReg3 calc(4s * var(--sp)) steps(1) infinite',
                  }}
                >
                  ASIA
                </span>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
              REGIONS
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '18px' }}>Four, and growing</span>
            <span style={{ fontSize: '14px', color: '#C9CBCE' }}>Middle East · Africa · Europe · Asia.</span>
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
