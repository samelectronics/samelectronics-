// Converted from design/project/SE Home Samsoom.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s, t } from '@/dc/runtime';
import Logic from './SEHomeSamsoom.logic.js';
import SESamsoom from './SESamsoom';

function render(v: Vals) {
  return (
    <>
      <section
        id="samsoom"
        ref={v.secRef}
        data-tone="light"
        data-screen-label="15 Meet Samsoom"
        onMouseMove={v.move}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(60% 70% at 26% 50%,#FFFFFF 0%,#F2F3F4 45%,#E4E6E9 100%)',
          color: '#1A1B1D',
          padding: '120px clamp(20px,4vw,64px)',
        }}
      >
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            left: '4%',
            top: '8%',
            width: '760px',
            height: '760px',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side,rgba(247,192,50,.28),rgba(247,192,50,0))',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  \n  \n  '}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '-20%',
            width: '24%',
            height: '140%',
            background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0))',
            animation: 'msSweep 12s cubic-bezier(.45,0,.55,1) infinite',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <svg
          viewBox="0 0 1440 760"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }}
          fill="none"
          strokeLinecap="round"
        >
          <g stroke="rgba(61,62,63,.16)" strokeWidth="2">
            <path d="M0 746 H120 L150 722 H260"></path>
            <path d="M1440 60 H1340 L1310 90 H1240"></path>
          </g>
          <g stroke="#C9921A" strokeWidth="3" strokeDasharray="60 940">
            <path
              pathLength="1000"
              d="M0 746 H120 L150 722 H260"
              style={{ animation: 'msPulse 3.2s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
            <path
              pathLength="1000"
              d="M1440 60 H1340 L1310 90 H1240"
              style={{ animation: 'msPulse 3.8s .8s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
          </g>
          <g fill="#F7C032" stroke="#3D3E3F" strokeWidth="1.5">
            <circle cx="260" cy="670" r="4"></circle>
            <circle cx="1240" cy="90" r="4"></circle>
          </g>
        </svg>
        {'\n  '}
        <div
          style={{
            position: 'relative',
            maxWidth: '1312px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))',
            gap: 'clamp(32px,4vw,64px)',
            alignItems: 'center',
          }}
        >
          {'\n    '}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px 36px', alignItems: 'center', justifyContent: 'center' }}>
            {'\n      '}
            <div style={{ position: 'relative', width: '340px', height: '400px', flex: 'none', display: 'grid', placeItems: 'center' }}>
              {'\n        '}
              <svg
                viewBox="0 0 340 340"
                width="340"
                height="340"
                style={{ position: 'absolute', left: '0', top: '20px', animation: 'msRing 40s linear infinite' }}
                fill="none"
              >
                <circle cx="170" cy="170" r="160" stroke="rgba(61,62,63,.22)" strokeWidth="1.5" strokeDasharray="2 10"></circle>
              </svg>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '50px',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,0))',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '34px',
                  width: '220px',
                  height: '34px',
                  marginLeft: '-110px',
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg,#F4F5F6,#B9BDC2)',
                  boxShadow: '0 14px 26px rgba(38,40,43,.25),inset 0 1px 0 #FFFFFF',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '44px',
                  width: '160px',
                  height: '6px',
                  marginLeft: '-80px',
                  borderRadius: '50%',
                  background: '#F7C032',
                  boxShadow: '0 0 18px 4px rgba(247,192,50,.55)',
                }}
              ></span>
              {'\n        '}
              <div style={cssToObj(`position:relative;margin-top:-30px;transform-origin:50% 90%;animation:${s(v.nodAnim)}`)}>
                <SESamsoom mood={v.mood} size={240} lookX={v.lx} lookY={v.ly} hold={v.hold} raise={v.raise} />
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '260px' }}>
              {'\n        '}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  letterSpacing: '.14em',
                  color: '#3D3E3F',
                }}
              >
                <span style={{ width: '28px', height: '2px', background: '#26282B' }}></span>MEET SAMSOOM · PARTS ASSISTANT
              </span>
              {'\n        '}
              <h2
                style={{
                  margin: '0',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: 'clamp(34px,3.2vw,48px)',
                  lineHeight: '1.04',
                  letterSpacing: '-.035em',
                  textWrap: 'balance',
                }}
              >
                Ask at 3 a.m. Samsoom already knows the shelf.
              </h2>
              {'\n        '}
              <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#3D3E3F' }}>
                Samsoom knows our catalogue, grades, hours and shipping. It finds the part, explains the grade, and hands you to a person on
                WhatsApp the second you need one.
              </p>
              {'\n        '}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  color: '#3D3E3F',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#2BB673',
                    boxShadow: '0 0 0 3px rgba(43,182,115,.18)',
                  }}
                ></span>
                {t(v.status)}
              </span>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,.62)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.9),0 30px 70px rgba(38,40,43,.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {'\n      '}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '62px',
                padding: '0 18px',
                borderBottom: '1px solid rgba(38,40,43,.08)',
              }}
            >
              {'\n        '}
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(160deg,#3D3E3F,#26282B)',
                  overflow: 'hidden',
                }}
              >
                <span style={{ marginTop: '6px' }}>
                  <SESamsoom mood={v.mood} size={30} still={true} />
                </span>
              </span>
              {'\n        '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '16px' }}>Samsoom</span>
                <span style={{ fontSize: '12px', color: '#1F7A4F' }}>Online · live demo</span>
              </span>
              {'\n        '}
              <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#3D3E3F' }}>
                {t(v.sceneLbl)}
              </span>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '10px',
                height: '320px',
                padding: '16px 18px',
                overflow: 'hidden',
              }}
            >
              {'\n        '}
              {(Array.isArray(v.msgs) ? v.msgs : []).map((__it: any, __i: number) => {
                const v2 = { ...v, m: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    {'\n          '}
                    <div
                      style={cssToObj(
                        `display:flex;align-items:flex-end;gap:8px;flex-direction:${s(v.m?.dir)};opacity:${s(v.m?.o)};transition:opacity .5s`,
                      )}
                    >
                      <span
                        style={cssToObj(
                          `flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:${s(v.m?.avBg)};overflow:hidden;box-shadow:0 0 0 1.5px ${s(v.m?.avRing)}`,
                        )}
                      >
                        {v.m?.bot ? (
                          <>
                            <span style={{ marginTop: '6px' }}>
                              <SESamsoom mood="happy" size={20} still={true} />
                            </span>
                          </>
                        ) : null}
                        {v.m?.user ? (
                          <>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#8C9096">
                              <circle cx="12" cy="9" r="4"></circle>
                              <path d="M4 22c0-4.4 3.6-7 8-7s8 2.6 8 7z"></path>
                            </svg>
                          </>
                        ) : null}
                      </span>
                      <span
                        style={cssToObj(
                          `max-width:78%;padding:10px 14px;border-radius:16px;background:${s(v.m?.bg)};color:${s(v.m?.ink)};font-size:14px;line-height:1.45;white-space:pre-line;box-shadow:0 2px 6px rgba(38,40,43,.1);animation:msIn .45s cubic-bezier(.2,.8,.2,1) both`,
                        )}
                      >
                        {t(v.m?.t)}
                      </span>
                    </div>
                    {'\n        '}
                  </React.Fragment>
                ))(v2);
              })}
              {'\n        '}
              {v.typing ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(38,40,43,.1)',
                    }}
                  >
                    <span
                      style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3D3E3F', animation: 'msDot .9s infinite' }}
                    ></span>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#3D3E3F',
                        animation: 'msDot .9s .15s infinite',
                      }}
                    ></span>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#3D3E3F',
                        animation: 'msDot .9s .3s infinite',
                      }}
                    ></span>
                  </div>
                </>
              ) : null}
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '12px 18px', borderTop: '1px solid rgba(38,40,43,.08)' }}>
              {(Array.isArray(v.chips) ? v.chips : []).map((__it: any, __i: number) => {
                const v2 = { ...v, c: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <button
                      onClick={v.c?.play}
                      onMouseEnter={v.c?.over}
                      onMouseLeave={v.c?.out}
                      style={cssToObj(
                        `animation:${s(v.c?.glow)};height:36px;padding:0 12px;border-radius:10px;border:none;background:${s(v.c?.bg)};color:#1A1B1D;box-shadow:inset 0 0 0 1px rgba(38,40,43,.1);font-size:13px;font-weight:600;cursor:pointer;transition:background .3s cubic-bezier(.2,.8,.2,1)`,
                      )}
                    >
                      {t(v.c?.q)}
                    </button>
                  </React.Fragment>
                ))(v2);
              })}
            </div>
            {'\n      '}
            <button
              onClick={v.ask}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '52px',
                padding: '0 18px',
                border: 'none',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Ask Samsoom your own question
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </button>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
      </section>
    </>
  );
}

const SEHomeSamsoom = createDC('SE Home Samsoom', Logic, render);
export default SEHomeSamsoom;
