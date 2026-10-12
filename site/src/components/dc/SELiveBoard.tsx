// GENERATED from design/project/SE Live Board.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SELiveBoard.logic.js';

function render(v: Vals) {
  return (
    <>
      <section
        id="board"
        ref={v.secRef}
        data-tone="dark"
        data-screen-label="04 Live Parts Board"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg,#4A4D52 0%,#3D3E3F 35%,#26282B 100%)',
          color: '#FFFFFF',
          padding: '120px clamp(20px,4vw,64px)',
        }}
      >
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0 1px,transparent 1px 3px)',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            left: '-10%',
            top: '-30%',
            width: '20%',
            height: '160%',
            background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.05),rgba(255,255,255,0))',
            animation: 'lbSweep 14s cubic-bezier(.45,0,.55,1) infinite',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <div
          ref={v.gridRef}
          style={{
            position: 'relative',
            maxWidth: '1312px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))',
            gap: 'clamp(32px,5vw,96px)',
            alignItems: 'center',
          }}
        >
          {'\n    '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0' }}>
            {'\n      '}
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
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#2BB673',
                  animation: 'lbBlink 1.2s steps(1) infinite',
                }}
              ></span>
              LIVE PARTS BOARD · SAMPLE FEED
            </span>
            {'\n      '}
            <h2
              style={{
                margin: '0',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: 'clamp(34px,3.4vw,50px)',
                lineHeight: '1.04',
                letterSpacing: '-.035em',
                textWrap: 'balance',
              }}
            >
              What's moving on our shelves, right now.
            </h2>
            {'\n      '}
            <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#D5D7DA', textWrap: 'pretty' }}>
              New stock landing, prices dropping, boxes leaving Deira. Every row on the board feeds the counters, live.
            </p>
            {'\n      '}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {'\n        '}
              {(Array.isArray(v.tiles) ? v.tiles : []).map((__it: any, __i: number) => {
                const v2 = { ...v, t: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    {'\n          '}
                    <button
                      data-tile={v.t?.id}
                      onClick={v.t?.pick}
                      style={cssToObj(
                        `position:relative;display:grid;grid-template-columns:36px minmax(0,1fr);grid-template-rows:auto auto auto;gap:4px 12px;padding:14px;border-radius:16px;border:none;text-align:left;cursor:pointer;color:#FFFFFF;background:${s(v.t?.bg)};backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);animation:${s(v.t?.flash)};transition:background .3s cubic-bezier(.2,.8,.2,1)`,
                      )}
                    >
                      {'\n            '}
                      <span
                        style={{
                          gridRow: '1 / span 2',
                          position: 'relative',
                          display: 'block',
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'rgba(0,0,0,.25)',
                          overflow: 'hidden',
                        }}
                      >
                        {'\n              '}
                        {v.t?.iBox ? (
                          <>
                            <span
                              style={{
                                position: 'absolute',
                                left: '10px',
                                top: '12px',
                                width: '16px',
                                height: '13px',
                                borderRadius: '2px',
                                background: 'linear-gradient(160deg,#D9A866,#B98446)',
                                animation: 'lbBox 2.4s cubic-bezier(.2,.8,.2,1) infinite',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  top: '0',
                                  width: '4px',
                                  height: '13px',
                                  background: 'rgba(255,240,210,.6)',
                                }}
                              ></span>
                            </span>
                            <span
                              style={{
                                position: 'absolute',
                                left: '6px',
                                right: '6px',
                                bottom: '8px',
                                height: '2px',
                                background: 'rgba(255,255,255,.3)',
                              }}
                            ></span>
                          </>
                        ) : null}
                        {'\n              '}
                        {v.t?.iBat ? (
                          <>
                            <span
                              style={{
                                position: 'absolute',
                                left: '7px',
                                top: '12px',
                                width: '19px',
                                height: '12px',
                                borderRadius: '2px',
                                boxShadow: 'inset 0 0 0 1.5px #FF8A8E',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '2.5px',
                                  top: '2.5px',
                                  width: '14px',
                                  height: '7px',
                                  borderRadius: '1px',
                                  background: '#E5484D',
                                  transformOrigin: '0 50%',
                                  animation: 'lbDrain 3s cubic-bezier(.45,0,.55,1) infinite',
                                }}
                              ></span>
                            </span>
                            <span
                              style={{
                                position: 'absolute',
                                left: '27px',
                                top: '16px',
                                width: '2px',
                                height: '4px',
                                background: '#FF8A8E',
                              }}
                            ></span>
                          </>
                        ) : null}
                        {'\n              '}
                        {v.t?.iTag ? (
                          <>
                            <svg
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              style={{
                                position: 'absolute',
                                left: '8px',
                                top: '8px',
                                animation: 'lbTag 2.6s cubic-bezier(.2,.8,.2,1) infinite',
                              }}
                              fill="#FFDB6E"
                            >
                              <path d="M3 12V4h8l10 10-8 8z"></path>
                              <circle cx="7.5" cy="8" r="1.6" fill="#26282B"></circle>
                            </svg>
                          </>
                        ) : null}
                        {'\n              '}
                        {v.t?.iTruck ? (
                          <>
                            <span style={{ position: 'absolute', left: '10px', top: '12px', animation: 'lbTruck 2.2s linear infinite' }}>
                              <svg viewBox="0 0 24 16" width="18" height="12" fill="none">
                                <rect x="1" y="2" width="13" height="9" rx="1" fill="#5FD49A"></rect>
                                <path d="M14 5h4l3 3v3h-7z" fill="#2BB673"></path>
                                <circle cx="5" cy="13" r="2" fill="#FFFFFF"></circle>
                                <circle cx="17" cy="13" r="2" fill="#FFFFFF"></circle>
                              </svg>
                            </span>
                          </>
                        ) : null}
                        {'\n            '}
                      </span>
                      {'\n            '}
                      <span
                        style={cssToObj(
                          `display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;color:${s(v.t?.c)}`,
                        )}
                      >
                        <span style={cssToObj(`width:7px;height:7px;border-radius:2px;background:${s(v.t?.c)}`)}></span>
                        {t(v.t?.k)}
                      </span>
                      {'\n            '}
                      <span
                        style={{
                          height: '32px',
                          overflow: 'hidden',
                          fontFamily: "'Space Grotesk',sans-serif",
                          fontWeight: '700',
                          fontSize: '30px',
                          letterSpacing: '-.02em',
                          lineHeight: '32px',
                        }}
                      >
                        <span style={cssToObj(`display:inline-block;animation:${s(v.t?.roll)}`)}>{t(v.t?.v)}</span>
                      </span>
                      {'\n            '}
                      <svg
                        viewBox="0 0 200 28"
                        preserveAspectRatio="none"
                        style={{ gridColumn: '1 / span 2', width: '100%', height: '28px', marginTop: '4px' }}
                        fill="none"
                      >
                        <path
                          d={v.t?.spark}
                          pathLength="1"
                          stroke={v.t?.c}
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                          strokeDasharray="1"
                          vectorEffect="non-scaling-stroke"
                          style={{ animation: 'lbSpark 1s cubic-bezier(.2,.8,.2,1) both' }}
                        ></path>
                      </svg>
                      {'\n          '}
                    </button>
                    {'\n        '}
                  </React.Fragment>
                ))(v2);
              })}
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {'\n        '}
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.14em', color: '#C9CBCE' }}>
                TRENDING RIGHT NOW
              </span>
              {'\n        '}
              <div style={{ display: 'flex', gap: '8px', overflow: 'hidden', height: '36px' }}>
                {'\n          '}
                {(Array.isArray(v.trend) ? v.trend : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, c: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        style={cssToObj(
                          `flex:none;display:flex;align-items:center;gap:8px;height:36px;padding:0 12px;border-radius:10px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);font-size:13px;white-space:nowrap;animation:${s(v.c?.anim)}`,
                        )}
                      >
                        {t(v.c?.t)}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#F7C032' }}>{t(v.c?.n)}</span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <a
              href="#deals"
              onClick={v.goDeals}
              style={{
                alignSelf: 'flex-start',
                marginTop: '12px',
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
                textDecoration: 'none',
                transition: 'transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s',
              }}
              className={cx(undefined, 'scp-0ab9b9d5')}
            >
              See deals & arrivals
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            data-board="1"
            style={{
              position: 'relative',
              borderRadius: '24px',
              padding: '1.5px',
              background: 'linear-gradient(140deg,rgba(255,255,255,.35),rgba(255,255,255,.06) 40%,rgba(247,192,50,.45))',
              boxShadow: '0 30px 70px rgba(0,0,0,.35),0 0 60px rgba(247,192,50,.12)',
            }}
          >
            {'\n      '}
            <div style={{ borderRadius: '23px', overflow: 'hidden', background: 'linear-gradient(180deg,#2E3033,#1F2022)' }}>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '48px',
                  padding: '0 20px',
                  borderBottom: '1px solid rgba(255,255,255,.07)',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  color: '#C9CBCE',
                }}
              >
                {'\n          '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{ width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 1.5px #F7C032' }}
                  >
                    <img src="assets/se-logo.png" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
                  </span>
                  se://deira/board
                </span>
                {'\n          '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span>
                    {t(v.clock)}
                    {' GST'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5FD49A' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#2BB673',
                        animation: 'lbBlink 1s steps(1) infinite',
                      }}
                    ></span>
                    LIVE
                  </span>
                </span>
                {'\n        '}
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', height: '448px', overflow: 'hidden' }}>
                {'\n          '}
                {(Array.isArray(v.rows) ? v.rows : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, f: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      {'\n            '}
                      <div
                        data-row={v.f?.first}
                        style={cssToObj(
                          `display:grid;grid-template-columns:56px 118px minmax(0,1fr) auto;gap:12px;align-items:center;min-height:64px;flex:none;box-sizing:border-box;padding:8px 20px;border-bottom:1px solid rgba(255,255,255,.05);font-family:'JetBrains Mono',monospace;font-size:13px;opacity:${s(v.f?.o)};animation:${s(v.f?.anim)}`,
                        )}
                      >
                        {'\n              '}
                        <span style={{ color: '#9DA1A6' }}>{t(v.f?.t)}</span>
                        {'\n              '}
                        <span
                          style={cssToObj(
                            `justify-self:start;padding:4px 8px;border-radius:6px;background:${s(v.f?.tagBg)};color:${s(v.f?.tagInk)};font-size:11px;font-weight:600;letter-spacing:.06em;white-space:nowrap`,
                          )}
                        >
                          {t(v.f?.tag)}
                        </span>
                        {'\n              '}
                        <span style={{ color: '#F2F3F4', lineHeight: '1.35', textWrap: 'pretty' }}>
                          <span style={cssToObj(`display:inline-block;animation:${s(v.f?.type)}`)}>{t(v.f?.text)}</span>
                        </span>
                        {'\n              '}
                        <span style={cssToObj(`color:${s(v.f?.noteC)};white-space:nowrap`)}>{t(v.f?.note)}</span>
                        {'\n            '}
                      </div>
                      {'\n          '}
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  borderTop: '1px solid rgba(255,255,255,.07)',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  color: '#C9CBCE',
                }}
              >
                <span>{t(v.filterLbl)}</span>
                <span>
                  {t(v.total)}
                  {' events today · sample'}
                </span>
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
            fill="none"
          >
            {'\n      '}
            {(Array.isArray(v.traces) ? v.traces : []).map((__it: any, __i: number) => {
              const v2 = { ...v, r: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <path d={v.r?.d} stroke="rgba(247,192,50,.28)" strokeWidth="1.6" strokeLinejoin="round"></path>
                  <circle cx={v.r?.x0} cy={v.r?.y0} r="3.5" fill="#26282B" stroke="#F7C032" strokeWidth="1.5"></circle>
                  <circle cx={v.r?.x1} cy={v.r?.y1} r="3.5" fill="#26282B" stroke="#F7C032" strokeWidth="1.5"></circle>
                </React.Fragment>
              ))(v2);
            })}
            {'\n    '}
          </svg>
          {'\n    '}
          {(Array.isArray(v.pulses) ? v.pulses : []).map((__it: any, __i: number) => {
            const v2 = { ...v, p: __it, $index: __i };
            return ((v: Vals) => (
              <React.Fragment key={__i}>
                <span
                  style={cssToObj(
                    `position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#FFF4D1;box-shadow:0 0 10px 4px rgba(247,192,50,.85);offset-path:path('${s(v.p?.d)}');offset-rotate:0deg;pointer-events:none;animation:lbPulse .7s cubic-bezier(.45,0,.55,1) both`,
                  )}
                ></span>
              </React.Fragment>
            ))(v2);
          })}
          {'\n  '}
        </div>
      </section>
    </>
  );
}

const SELiveBoard = createDC('SE Live Board', Logic, render);
export default SELiveBoard;
