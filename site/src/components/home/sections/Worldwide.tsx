// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Worldwide". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import WorldwideBoxes, { CountryCard } from './WorldwideBoxes';
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
              <span>From Deira</span> <span>to the world.</span>
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
              background: '#26282B',
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
            <CountryCard />
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
        <WorldwideBoxes />
        {'\n  '}
      </div>
    </section>
  );
}
