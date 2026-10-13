// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "RequestVisit". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t, val } from '@/dc/runtime';

export default function RequestVisit({ v }: { v: Vals }) {
  return (
    <section
      id="visit"
      data-tone="dark"
      data-screen-label="18 Request console and visit"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(90% 100% at 85% 0%,#4A4D52 0%,#3D3E3F 35%,#26282B 90%)',
        color: '#FFFFFF',
        padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)',
      }}
    >
      {'\n  '}
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }}
        fill="none"
        strokeLinecap="round"
      >
        <path d="M0 700 H140 L180 660 H360" stroke="rgba(247,192,50,.22)" strokeWidth="2"></path>
        <path
          pathLength="1000"
          d="M0 700 H140 L180 660 H360"
          stroke="#FFDB6E"
          strokeWidth="3"
          strokeDasharray="70 930"
          style={{ filter: 'drop-shadow(0 0 6px rgba(247,192,50,.9))', animation: 'sePulse 3.4s linear infinite' }}
        ></path>
        <circle cx="360" cy="660" r="4.5" fill="#26282B" stroke="#F7C032" strokeWidth="2"></circle>
      </svg>
      {'\n  '}
      <div
        style={{
          position: 'relative',
          maxWidth: '1312px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.45fr) minmax(320px,1fr)',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {'\n    '}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            padding: '28px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,.04)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.09)',
          }}
        >
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#F7C032' }}>
              REQUEST CONSOLE
            </span>
            <h2
              style={{
                margin: '0',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: 'clamp(30px,3vw,42px)',
                lineHeight: '1.08',
                letterSpacing: '-.03em',
              }}
            >
              Tell us what you need. We print the work order.
            </h2>
          </div>
          {'\n      '}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(Array.isArray(v.rq?.types) ? v.rq?.types : []).map((__it: any, __i: number) => {
              const v2 = { ...v, t: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <button
                    onClick={v.t?.pick}
                    style={cssToObj(
                      `height:36px;padding:0 14px;border-radius:10px;border:none;background:${s(v.t?.bg)};color:${s(v.t?.ink)};font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s`,
                    )}
                  >
                    {t(v.t?.name)}
                  </button>
                </React.Fragment>
              ))(v2);
            })}
          </div>
          {'\n      '}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 260px', gap: '18px', alignItems: 'start' }}>
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {'\n          '}
              {(Array.isArray(v.rq?.fields) ? v.rq?.fields : []).map((__it: any, __i: number) => {
                const v2 = { ...v, f: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    {'\n            '}
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#C9CBCE' }}>{t(v.f?.label)}</span>
                      <input
                        value={val(v.f?.val)}
                        onInput={v.f?.set}
                        placeholder={v.f?.ph}
                        style={{
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,.14)',
                          background: 'rgba(0,0,0,.25)',
                          color: '#FFFFFF',
                          fontSize: '15px',
                          outline: 'none',
                        }}
                        className={cx(undefined, 'scp-0901e87a')}
                      />
                    </label>
                    {'\n          '}
                  </React.Fragment>
                ))(v2);
              })}
              {'\n          '}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                {'\n            '}
                <a
                  href={v.rq?.wa}
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '44px',
                    padding: '0 18px',
                    borderRadius: '10px',
                    background: '#F7C032',
                    color: '#1A1B1D',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                  className={cx(undefined, 'scp-fa63c78a')}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '16px',
                      height: '16px',
                      background: '#1A1B1D',
                      WebkitMask: 'url(https://cdn.simpleicons.org/whatsapp/000000) center / contain no-repeat',
                      mask: 'url(https://cdn.simpleicons.org/whatsapp/000000) center / contain no-repeat',
                    }}
                  ></span>
                  Send on WhatsApp
                </a>
                {'\n            '}
                <a
                  href={v.rq?.mail}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '44px',
                    padding: '0 18px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,.4)',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                  className={cx(undefined, 'scp-9ee067bf')}
                >
                  Email it
                </a>
                {'\n          '}
              </div>
              {'\n        '}
            </div>
            {'\n        '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '18px',
                background: '#FFFFFF',
                color: '#1A1B1D',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,.4)',
                transform: 'rotate(1.2deg)',
                WebkitMask: 'radial-gradient(circle 6px at 6px 100%,transparent 98%,#000) 0 0/12px 100% repeat-x',
                mask: 'radial-gradient(circle 6px at 6px 100%,transparent 98%,#000) 0 0/12px 100% repeat-x',
                paddingBottom: '24px',
              }}
            >
              {'\n          '}
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '14px', letterSpacing: '.06em' }}>
                  WORK ORDER
                </span>
                <span>{t(v.rq?.no)}</span>
              </span>
              {'\n          '}
              <span style={{ height: '1px', background: 'repeating-linear-gradient(90deg,#1A1B1D 0 4px,transparent 4px 8px)' }}></span>
              {'\n          '}
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5E6064' }}>TYPE</span>
                <span style={{ fontWeight: '600' }}>{t(v.rq?.typeName)}</span>
              </span>
              {'\n          '}
              {(Array.isArray(v.rq?.lines) ? v.rq?.lines : []).map((__it: any, __i: number) => {
                const v2 = { ...v, l: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: '#5E6064', whiteSpace: 'nowrap' }}>{t(v.l?.k)}</span>
                      <span style={{ fontWeight: '600', textAlign: 'right', wordBreak: 'break-word' }}>{t(v.l?.v)}</span>
                    </span>
                  </React.Fragment>
                ))(v2);
              })}
              {'\n          '}
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5E6064' }}>STATUS</span>
                <span style={{ padding: '1px 6px', borderRadius: '4px', background: '#F7C032', fontWeight: '600' }}>NEW</span>
              </span>
              {'\n          '}
              <span style={{ height: '1px', background: 'repeating-linear-gradient(90deg,#1A1B1D 0 4px,transparent 4px 8px)' }}></span>
              {'\n          '}
              <span
                style={{
                  height: '26px',
                  background: 'repeating-linear-gradient(90deg,#1A1B1D 0 2px,transparent 2px 4px,#1A1B1D 4px 5px,transparent 5px 8px)',
                }}
              ></span>
              {'\n          '}
              <span style={{ fontSize: '11px', color: '#5E6064' }}>Sam Electronics · Al Murar, Deira</span>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div
          style={cssToObj(
            `display:flex;flex-direction:column;gap:16px;padding:28px;border-radius:24px;background:${s(v.visit?.bg)};color:${s(v.visit?.ink)};box-shadow:0 30px 60px rgba(0,0,0,.35)`,
          )}
        >
          {'\n      '}
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em' }}>
            {'VISIT US · DUBAI TIME '}
            {t(v.clock)}
          </span>
          {'\n      '}
          <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ position: 'relative', width: '14px', height: '14px' }}>
              <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.visit?.dot)}`)}></span>
              <span
                style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.visit?.dot)};animation:${s(v.st?.ping)}`)}
              ></span>
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '26px', letterSpacing: '-.02em' }}>
              {t(v.visit?.state)}
            </span>
          </span>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {'\n        '}
            {(Array.isArray(v.visit?.days) ? v.visit?.days : []).map((__it: any, __i: number) => {
              const v2 = { ...v, d: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <span
                    style={cssToObj(
                      `display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px;align-items:center;height:36px;padding:0 10px;border-radius:8px;background:${s(v.d?.bg)};font-size:14px`,
                    )}
                  >
                    <span style={cssToObj(`font-weight:${s(v.d?.w)}`)}>{t(v.d?.day)}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', textAlign: 'right' }}>{t(v.d?.h)}</span>
                  </span>
                </React.Fragment>
              ))(v2);
            })}
            {'\n      '}
          </div>
          {'\n      '}
          <span style={{ fontSize: '14px', lineHeight: '1.5' }}>
            {String(v.$facts?.contact?.address ?? '')}
            {' · '}
            {String(v.$facts?.contact?.plusCode ?? '')}
          </span>
          {'\n      '}
          <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {'\n        '}
            <a
              href={v.visit?.wa}
              target="_blank"
              rel="noopener"
              style={cssToObj(
                `display:flex;align-items:center;justify-content:center;gap:8px;height:44px;border-radius:10px;background:${s(v.visit?.btnBg)};color:${s(v.visit?.btnInk)};font-size:14px;font-weight:600`,
              )}
              className={cx(undefined, 'scp-f613627f')}
            >
              WhatsApp
            </a>
            {'\n        '}
            <a
              href={`tel:${s(v.$facts?.contact?.storeTel)}`}
              style={cssToObj(
                `display:flex;align-items:center;justify-content:center;height:44px;border-radius:10px;border:1.5px solid ${s(v.visit?.ink)};color:${s(v.visit?.ink)};font-size:14px;font-weight:600;white-space:nowrap`,
              )}
            >
              {String(v.$facts?.contact?.storePhone ?? '')}
            </a>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
