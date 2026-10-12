// GENERATED from design/project/SE Bench Test.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s, t } from '@/dc/runtime';
import Logic from './SEBenchTest.logic.js';

function render(v: Vals) {
  return (
    <>
      <section
        id="quality"
        data-tone="light"
        data-screen-label="05 Bench Test"
        style={{ position: 'relative', background: '#F7C032', color: '#1A1B1D' }}
      >
        {'\n  '}
        <div ref={v.benchRef} style={{ position: 'relative' }}>
          {'\n    '}
          <div style={{ position: 'relative', overflow: 'hidden', boxSizing: 'border-box', padding: '120px clamp(20px,4vw,64px)' }}>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                background: 'radial-gradient(60% 70% at 62% 45%,#FFE9A3 0%,#F7C032 55%,#EDB321 100%)',
              }}
            ></div>
            {'\n      '}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', opacity: '.55' }}>
              <defs>
                <pattern id="btEng" width="160" height="160" patternUnits="userSpaceOnUse">
                  <g fill="none" stroke="#C9921A" strokeWidth="1" strokeLinecap="round">
                    <path d="M0 40 H50 L70 60 H120"></path>
                    <path d="M120 60 V110 L140 130 H160"></path>
                    <path d="M20 160 V120 L40 100 H80"></path>
                    <path d="M100 0 V24 L116 40"></path>
                  </g>
                  <g fill="#F7C032" stroke="#C9921A" strokeWidth="1">
                    <circle cx="120" cy="60" r="2.5"></circle>
                    <circle cx="80" cy="100" r="2.5"></circle>
                    <circle cx="116" cy="40" r="2"></circle>
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#btEng)"></rect>
            </svg>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                background: 'radial-gradient(45% 55% at 62% 48%,rgba(247,192,50,0),rgba(247,192,50,.85) 100%)',
                pointerEvents: 'none',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '56%',
                top: '6%',
                width: '44%',
                height: '88%',
                opacity: '.08',
                filter: 'blur(6px)',
                pointerEvents: 'none',
                background:
                  'repeating-linear-gradient(0deg,#26282B 0 6px,transparent 6px 90px),repeating-linear-gradient(90deg,#26282B 0 8px,transparent 8px 180px)',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '10%',
                width: '30%',
                height: '60%',
                opacity: '.07',
                filter: 'blur(8px)',
                pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg,#26282B 0 5px,transparent 5px 70px)',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '62%',
                top: '50%',
                width: '700px',
                height: '700px',
                margin: '-350px 0 0 -350px',
                borderRadius: '50%',
                background: 'radial-gradient(closest-side,rgba(255,255,255,.25),rgba(255,255,255,0))',
                pointerEvents: 'none',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '10%',
                top: '-30%',
                width: '14%',
                height: '160%',
                background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.22),rgba(255,255,255,0))',
                transform: 'rotate(22deg)',
                animation: 'btBeam 14s cubic-bezier(.45,0,.55,1) infinite',
                pointerEvents: 'none',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '46%',
                top: '-30%',
                width: '10%',
                height: '160%',
                background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.18),rgba(255,255,255,0))',
                transform: 'rotate(22deg)',
                animation: 'btBeam 18s 4s cubic-bezier(.45,0,.55,1) infinite reverse',
                pointerEvents: 'none',
              }}
            ></div>
            {'\n      '}
            <svg
              viewBox="0 0 1600 400"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                left: '0',
                top: '30%',
                width: '200%',
                height: '40%',
                opacity: '.1',
                pointerEvents: 'none',
                animation: 'btScope 30s linear infinite',
              }}
              fill="none"
            >
              <path
                d="M0 200 C 50 120, 100 280, 150 200 S 250 120, 300 200 S 400 280, 450 200 S 550 120, 600 200 S 700 280, 750 200 S 850 120, 900 200 S 1000 280, 1050 200 S 1150 120, 1200 200 S 1300 280, 1350 200 S 1450 120, 1500 200 S 1600 280, 1600 200"
                stroke="#26282B"
                strokeWidth="2"
              ></path>
              <path
                d="M0 230 C 80 180, 160 280, 240 230 S 400 180, 480 230 S 640 280, 720 230 S 880 180, 960 230 S 1120 280, 1200 230 S 1360 180, 1440 230 S 1600 280, 1600 230"
                stroke="#26282B"
                strokeWidth="1.2"
              ></path>
            </svg>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '62%',
                top: '-10%',
                width: '700px',
                height: '500px',
                marginLeft: '-350px',
                background: 'radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,0))',
                pointerEvents: 'none',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'relative',
                maxWidth: '1312px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'minmax(0,45fr) minmax(0,55fr)',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {'\n        '}
              <div ref={v.leftRef} style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: '0' }}>
                {'\n          '}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '12px',
                    letterSpacing: '.14em',
                  }}
                >
                  <span style={{ width: '28px', height: '2px', background: '#26282B' }}></span>
                  {'BENCH TEST · '}
                  {t(v.stepLbl)}
                </span>
                {'\n          '}
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
                  Nothing leaves Deira until it passes the rig.
                </h2>
                {'\n          '}
                <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#26282B', maxWidth: '440px', textWrap: 'pretty' }}>
                  Every part is clamped into our test rig and probed before it is packed. The result is printed on your work order: grade,
                  warranty and price.
                </p>
                {'\n          '}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {'\n            '}
                  {(Array.isArray(v.qwp) ? v.qwp : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, q: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        {'\n              '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            height: '52px',
                            borderBottom: '1.5px solid rgba(38,40,43,.16)',
                          }}
                        >
                          {'\n                '}
                          <span
                            style={cssToObj(
                              `display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:${s(v.q?.dotBg)};box-shadow:inset 0 0 0 2px #26282B;transition:background .3s cubic-bezier(.2,.8,.2,1)`,
                            )}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="3.2">
                              <path
                                d="M5 12l5 5L20 7"
                                pathLength="24"
                                strokeDasharray="24"
                                strokeDashoffset={v.q?.dash}
                                style={{ transition: 'stroke-dashoffset .3s cubic-bezier(.2,.8,.2,1)' }}
                              ></path>
                            </svg>
                          </span>
                          {'\n                '}
                          <span
                            style={cssToObj(
                              `font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:26px;letter-spacing:-.03em;opacity:${s(v.q?.o)};transition:opacity .4s`,
                            )}
                          >
                            {t(v.q?.w)}
                          </span>
                          {'\n                '}
                          <span
                            style={cssToObj(
                              `margin-left:auto;font-size:14px;color:#26282B;opacity:${s(v.q?.o)};text-align:right;transition:opacity .4s`,
                            )}
                          >
                            {t(v.q?.d)}
                          </span>
                          {'\n              '}
                        </div>
                        {'\n            '}
                      </React.Fragment>
                    ))(v2);
                  })}
                  {'\n          '}
                </div>
                {'\n          '}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px', gap: '12px' }}>
                  {'\n            '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: 'linear-gradient(180deg,#3D3E3F,#26282B)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12),0 14px 30px rgba(110,72,0,.25)',
                    }}
                  >
                    {'\n              '}
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '30px',
                        padding: '0 12px',
                        borderBottom: '1px solid rgba(255,255,255,.08)',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '10px',
                        letterSpacing: '.12em',
                        color: '#C9CBCE',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#2BB673',
                          animation: 'btLed 1.2s ease-in-out infinite',
                        }}
                      ></span>
                      LIVE TEST LOG
                    </span>
                    {'\n              '}
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '6px 12px 8px', height: '110px', overflow: 'hidden' }}>
                      {'\n                '}
                      {(Array.isArray(v.log) ? v.log : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, l: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span
                              style={cssToObj(
                                `display:block;height:20px;line-height:20px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#E4E6E9;white-space:nowrap;overflow:hidden;opacity:${s(v.l?.o)};transition:opacity .5s`,
                              )}
                            >
                              <span style={cssToObj(`display:inline-block;animation:${s(v.l?.anim)}`)}>
                                {t(v.l?.time)}
                                {'  '}
                                <span style={{ color: '#F7C032' }}>Unit #{t(v.l?.unit)}</span>
                                {'  '}
                                {t(v.l?.test)} <span style={{ color: '#2BB673', fontWeight: '700' }}>PASS</span>
                              </span>
                            </span>
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n              '}
                    </div>
                    {'\n            '}
                  </div>
                  {'\n            '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,.6)',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.8),0 10px 24px rgba(110,72,0,.12)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {'\n              '}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                      PARTS TESTED TODAY
                    </span>
                    {'\n              '}
                    <span
                      style={{
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontWeight: '700',
                        fontSize: '34px',
                        letterSpacing: '-.03em',
                        lineHeight: '1',
                      }}
                    >
                      <span style={cssToObj(`display:inline-block;animation:${s(v.cntAnim)}`)}>{t(v.count)}</span>
                    </span>
                    {'\n              '}
                    <span style={{ fontSize: '11px', color: '#3D3E3F' }}>sample</span>
                    {'\n            '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                {'\n          '}
                <div style={cssToObj(`position:relative;width:${s(v.boxW)}px;height:${s(v.boxH)}px`)}>
                  {'\n            '}
                  <div
                    style={cssToObj(
                      `position:absolute;left:0;top:0;width:740px;height:700px;transform:scale(${s(v.sc)});transform-origin:0 0`,
                    )}
                  >
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '470px',
                        width: '720px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'radial-gradient(closest-side,rgba(110,72,0,.4),rgba(110,72,0,0))',
                        filter: 'blur(10px)',
                      }}
                    ></div>
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '30px',
                        width: '700px',
                        height: '470px',
                        borderRadius: '26px',
                        background: 'linear-gradient(180deg,#F4F5F6 0%,#D5D8DC 8%,#B9BDC2 50%,#9DA1A6 100%)',
                        boxShadow: 'inset 0 2px 0 rgba(255,255,255,.95),inset 0 -3px 0 rgba(0,0,0,.18),0 24px 50px rgba(110,72,0,.35)',
                      }}
                    >
                      {'\n                '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '26px',
                          backgroundImage:
                            'repeating-linear-gradient(90deg,rgba(255,255,255,.22) 0 1px,rgba(0,0,0,.025) 1px 2px,transparent 2px 3px)',
                          opacity: '.9',
                        }}
                      ></div>
                      {'\n                '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '10px',
                          borderRadius: '18px',
                          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12),inset 0 2px 4px rgba(0,0,0,.12)',
                        }}
                      ></div>
                      {'\n                '}
                      {(Array.isArray(v.screws) ? v.screws : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, w: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span
                              style={cssToObj(
                                `position:absolute;left:${s(v.w?.x)}px;top:${s(v.w?.y)}px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFFFFF,#9DA1A6 55%,#5E6064);box-shadow:0 1px 1px rgba(255,255,255,.8),inset 0 0 0 1px rgba(0,0,0,.25)`,
                              )}
                            >
                              <span
                                style={cssToObj(
                                  `position:absolute;left:3px;top:6px;width:8px;height:2px;background:#5E6064;transform:rotate(${s(v.w?.r)}deg)`,
                                )}
                              ></span>
                            </span>
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n                '}
                      {(Array.isArray(v.leds) ? v.leds : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, d: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span
                              style={cssToObj(
                                `position:absolute;left:${s(v.d?.x)}px;top:${s(v.d?.y)}px;width:6px;height:6px;border-radius:50%;background:#2BB673;box-shadow:0 0 6px #2BB673;animation:btLed 1.6s ${s(v.d?.dl)} ease-in-out infinite`,
                              )}
                            ></span>
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n                '}
                      <svg
                        viewBox="0 0 200 60"
                        width="200"
                        height="60"
                        style={{ position: 'absolute', left: '690px', top: '380px', overflow: 'visible' }}
                        fill="none"
                      >
                        <path d="M0 20 C 60 20, 80 50, 200 50 H 900" stroke="#26282B" strokeWidth="7" strokeLinecap="round"></path>
                        <path d="M0 20 C 60 20, 80 50, 200 50 H 900" stroke="#5E6064" strokeWidth="2.5" strokeLinecap="round"></path>
                        <path
                          d="M0 20 C 60 20, 80 50, 200 50 H 900"
                          pathLength="1000"
                          stroke="#FFDB6E"
                          strokeWidth="2.5"
                          strokeDasharray="40 960"
                          style={{ animation: 'sePulse 2.4s cubic-bezier(.45,0,.55,1) infinite reverse' }}
                        ></path>
                      </svg>
                      {'\n                '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '30px',
                          bottom: '18px',
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '11px',
                          letterSpacing: '.18em',
                          color: '#6E7378',
                          textShadow: '0 1px 0 rgba(255,255,255,.7)',
                        }}
                      >
                        SE-RIG 01 · DEIRA · CALIBRATED
                      </span>
                      {'\n                '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '40px',
                          top: '28px',
                          width: '250px',
                          height: '420px',
                          borderRadius: '40px',
                          background: 'linear-gradient(180deg,#8C9096,#6E7378)',
                          boxShadow: 'inset 0 3px 8px rgba(0,0,0,.45),inset 0 -1px 0 rgba(255,255,255,.4)',
                        }}
                      ></div>
                      {'\n                '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:62px;top:40px;width:206px;height:396px;transform:translateX(${s(v.phoneX)}px);opacity:${s(v.phoneO)};transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s;border-radius:32px;background:linear-gradient(115deg,#F4F5F6 0%,#B9BDC2 10%,#7E838A 40%,#C9CCD0 70%,#8C9096 100%);box-shadow:0 0 0 1px rgba(0,0,0,.3),0 10px 18px rgba(0,0,0,.35),0 0 ${s(v.devGlow)}px rgba(247,192,50,.7);transition:box-shadow .5s`,
                        )}
                      >
                        {'\n                  '}
                        <span
                          style={{
                            position: 'absolute',
                            right: '-2px',
                            top: '100px',
                            width: '3px',
                            height: '48px',
                            borderRadius: '2px',
                            background: '#8C9096',
                          }}
                        ></span>
                        {'\n                  '}
                        <div
                          style={{ position: 'absolute', inset: '3px', borderRadius: '29px', background: '#050506', overflow: 'hidden' }}
                        >
                          {'\n                    '}
                          <div
                            style={{ position: 'absolute', inset: '6px', borderRadius: '24px', overflow: 'hidden', background: '#0B0C0D' }}
                          >
                            {'\n                      '}
                            <div style={cssToObj(`position:absolute;inset:0;display:flex;opacity:${s(v.s0)};transition:opacity .4s`)}>
                              <span style={{ flex: '1', background: '#FFFFFF' }}></span>
                              <span style={{ flex: '1', background: '#F7C032' }}></span>
                              <span style={{ flex: '1', background: '#2BB673' }}></span>
                              <span style={{ flex: '1', background: '#3A7BD5' }}></span>
                              <span style={{ flex: '1', background: '#E5484D' }}></span>
                              <span style={{ flex: '1', background: '#3D3E3F' }}></span>
                              <span style={{ flex: '1', background: '#000000' }}></span>
                            </div>
                            {'\n                      '}
                            <div
                              style={cssToObj(
                                `position:absolute;inset:0;display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:1fr;gap:3px;padding:3px;opacity:${s(v.s1)};transition:opacity .4s`,
                              )}
                            >
                              {(Array.isArray(v.cells) ? v.cells : []).map((__it: any, __i: number) => {
                                const v2 = { ...v, c: __it, $index: __i };
                                return ((v: Vals) => (
                                  <React.Fragment key={__i}>
                                    <span style={cssToObj(`border-radius:3px;background:${s(v.c?.c)};transition:background .25s`)}></span>
                                  </React.Fragment>
                                ))(v2);
                              })}
                            </div>
                            {'\n                      '}
                            <div
                              style={cssToObj(
                                `position:absolute;inset:0;background:linear-gradient(180deg,#FFE3B0,#E4ECF5);opacity:${s(v.s2)};transition:opacity .4s`,
                              )}
                            >
                              <div
                                style={cssToObj(
                                  `position:absolute;inset:0;background:linear-gradient(180deg,#F2F3F4,#D6E4F5);opacity:${s(v.toneMix)};transition:opacity .3s`,
                                )}
                              ></div>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '0',
                                  right: '0',
                                  bottom: '70px',
                                  textAlign: 'center',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#26282B',
                                }}
                              >
                                {t(v.toneT)}
                              </span>
                            </div>
                            {'\n                      '}
                            <div
                              style={cssToObj(
                                `position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:radial-gradient(100% 70% at 50% 30%,#3D3E3F,#0B0C0D);opacity:${s(v.s3)};transition:opacity .4s`,
                              )}
                            >
                              <span
                                style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '44px', color: '#FFFFFF' }}
                              >
                                {t(v.batT)}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '11px',
                                  letterSpacing: '.14em',
                                  color: '#F7C032',
                                }}
                              >
                                BATTERY HEALTH
                              </span>
                            </div>
                            {'\n                      '}
                            <div
                              style={cssToObj(
                                `position:absolute;left:0;right:0;top:0;height:2px;background:#FFDB6E;box-shadow:0 0 14px 4px rgba(247,192,50,.7);opacity:${s(v.scanO)};animation:btScan 1.6s cubic-bezier(.45,0,.55,1) infinite alternate`,
                              )}
                            ></div>
                            {'\n                      '}
                            <div
                              style={{
                                position: 'absolute',
                                inset: '0',
                                background: 'linear-gradient(120deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 32%)',
                              }}
                            ></div>
                            {'\n                    '}
                          </div>
                          {'\n                    '}
                          <span
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '12px',
                              width: '60px',
                              height: '17px',
                              marginLeft: '-30px',
                              borderRadius: '9px',
                              background: '#000000',
                            }}
                          ></span>
                          {'\n                  '}
                        </div>
                        {'\n                '}
                      </div>
                      {'\n                '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:24px;top:190px;width:44px;height:86px;transform:translateX(-${s(v.clampOff)}px);transition:transform .3s cubic-bezier(.3,1.4,.5,1);border-radius:10px;background:linear-gradient(90deg,#9DA1A6,#E4E6E9 40%,#B9BDC2);box-shadow:0 6px 10px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.9)`,
                        )}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '-18px',
                            top: '28px',
                            width: '22px',
                            height: '30px',
                            borderRadius: '6px',
                            background: 'repeating-linear-gradient(0deg,#6E7378 0 2px,#C9CCD0 2px 4px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,.3)',
                          }}
                        ></span>
                      </div>
                      {'\n                '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:262px;top:190px;width:44px;height:86px;transform:translateX(${s(v.clampOff)}px);transition:transform .3s cubic-bezier(.3,1.4,.5,1);border-radius:10px;background:linear-gradient(90deg,#B9BDC2,#E4E6E9 60%,#9DA1A6);box-shadow:0 6px 10px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.9)`,
                        )}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            right: '-18px',
                            top: '28px',
                            width: '22px',
                            height: '30px',
                            borderRadius: '6px',
                            background: 'repeating-linear-gradient(0deg,#6E7378 0 2px,#C9CCD0 2px 4px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,.3)',
                          }}
                        ></span>
                      </div>
                      {'\n                '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '340px',
                          top: '28px',
                          width: '330px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '9px',
                        }}
                      >
                        {'\n                  '}
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '28px',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: '12px',
                            letterSpacing: '.1em',
                            color: '#3D3E3F',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={cssToObj(
                                `width:8px;height:8px;border-radius:50%;background:${s(v.ledC)};box-shadow:0 0 8px ${s(v.ledC)};animation:btLed 1.2s ease-in-out infinite`,
                              )}
                            ></span>
                            LIVE READOUT
                          </span>
                          <span style={{ fontWeight: '600' }}>{t(v.pass)}</span>
                        </span>
                        {'\n                  '}
                        {(Array.isArray(v.checks) ? v.checks : []).map((__it: any, __i: number) => {
                          const v2 = { ...v, c: __it, $index: __i };
                          return ((v: Vals) => (
                            <React.Fragment key={__i}>
                              {'\n                    '}
                              <div
                                style={cssToObj(
                                  `display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:14px;background:linear-gradient(180deg,#2E3033,#1E1F22);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px ${s(v.c?.bd)},0 6px 14px rgba(0,0,0,.25);color:#FFFFFF;transition:box-shadow .4s`,
                                )}
                              >
                                {'\n                      '}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span
                                    style={cssToObj(
                                      `display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:${s(v.c?.iconBg)};transition:background .4s`,
                                    )}
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#1A1B1D"
                                      strokeWidth="3.4"
                                      style={cssToObj(`opacity:${s(v.c?.tickO)}`)}
                                    >
                                      <path d="M5 12l5 5L20 7"></path>
                                    </svg>
                                  </span>
                                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                                    {t(v.c?.name)}
                                  </span>
                                  <span
                                    style={cssToObj(
                                      `margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:12px;color:${s(v.c?.vc)}`,
                                    )}
                                  >
                                    {t(v.c?.v)}
                                  </span>
                                </span>
                                {'\n                      '}
                                <div
                                  style={{
                                    position: 'relative',
                                    height: '34px',
                                    borderRadius: '8px',
                                    background: '#0E0F10',
                                    overflow: 'hidden',
                                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.05)',
                                  }}
                                >
                                  {'\n                        '}
                                  {v.c?.isPix ? (
                                    <>
                                      <div
                                        style={{
                                          position: 'absolute',
                                          inset: '6px',
                                          display: 'grid',
                                          gridTemplateColumns: 'repeat(24,1fr)',
                                          gap: '2px',
                                        }}
                                      >
                                        {(Array.isArray(v.c?.pix) ? v.c?.pix : []).map((__it: any, __i: number) => {
                                          const v2 = { ...v, p: __it, $index: __i };
                                          return ((v: Vals) => (
                                            <React.Fragment key={__i}>
                                              <span style={cssToObj(`border-radius:1px;background:${s(v.p?.c)}`)}></span>
                                            </React.Fragment>
                                          ))(v2);
                                        })}
                                      </div>
                                    </>
                                  ) : null}
                                  {'\n                        '}
                                  {v.c?.isWave ? (
                                    <>
                                      <svg
                                        viewBox="0 0 300 34"
                                        preserveAspectRatio="none"
                                        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
                                        fill="none"
                                      >
                                        <path
                                          d="M0 17 L20 17 L26 6 L32 28 L38 10 L44 24 L50 17 L80 17 L86 8 L92 26 L98 12 L104 22 L110 17 L140 17 L146 5 L152 29 L158 11 L164 23 L170 17 L200 17 L206 7 L212 27 L218 12 L224 22 L230 17 L260 17 L266 9 L272 25 L278 17 L300 17"
                                          stroke="#F7C032"
                                          strokeWidth="1.6"
                                          strokeDasharray={v.c?.dash}
                                          style={cssToObj(`filter:drop-shadow(0 0 3px rgba(247,192,50,.8));animation:${s(v.c?.anim)}`)}
                                        ></path>
                                      </svg>
                                    </>
                                  ) : null}
                                  {'\n                        '}
                                  {v.c?.isTone ? (
                                    <>
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: '8px',
                                          right: '8px',
                                          top: '12px',
                                          height: '10px',
                                          borderRadius: '5px',
                                          background: 'linear-gradient(90deg,#FF9A4A,#FFE3B0 40%,#F2F3F4 60%,#9CC3F5)',
                                        }}
                                      ></div>
                                      <span
                                        style={cssToObj(
                                          `position:absolute;top:7px;left:${s(v.c?.mk)};width:4px;height:20px;margin-left:-2px;border-radius:2px;background:#FFFFFF;box-shadow:0 0 6px rgba(255,255,255,.9);transition:left .3s cubic-bezier(.2,.8,.2,1)`,
                                        )}
                                      ></span>
                                    </>
                                  ) : null}
                                  {'\n                        '}
                                  {v.c?.isCurve ? (
                                    <>
                                      <svg
                                        viewBox="0 0 300 34"
                                        preserveAspectRatio="none"
                                        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
                                        fill="none"
                                      >
                                        <path d="M0 30 C 60 30, 90 8, 300 5" stroke="rgba(255,255,255,.12)" strokeWidth="1.5"></path>
                                        <path
                                          d="M0 30 C 60 30, 90 8, 300 5"
                                          pathLength="100"
                                          stroke="#F7C032"
                                          strokeWidth="2"
                                          strokeDasharray="100"
                                          strokeDashoffset={v.c?.off}
                                          style={{ filter: 'drop-shadow(0 0 3px rgba(247,192,50,.8))' }}
                                        ></path>
                                      </svg>
                                    </>
                                  ) : null}
                                  {'\n                      '}
                                </div>
                                {'\n                    '}
                              </div>
                              {'\n                  '}
                            </React.Fragment>
                          ))(v2);
                        })}
                        {'\n                '}
                      </div>
                      {'\n              '}
                    </div>
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '52px',
                        top: '4px',
                        width: '310px',
                        height: '22px',
                        borderRadius: '11px',
                        background: 'linear-gradient(180deg,#E4E6E9,#9DA1A6)',
                        boxShadow: '0 6px 12px rgba(0,0,0,.25),inset 0 1px 0 #FFFFFF',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '10px',
                          right: '10px',
                          top: '9px',
                          height: '4px',
                          borderRadius: '2px',
                          background: '#5E6064',
                          boxShadow: 'inset 0 1px 1px rgba(0,0,0,.4)',
                        }}
                      ></span>
                    </div>
                    {'\n              '}
                    <div
                      style={cssToObj(
                        `position:absolute;left:0;top:0;transform:translate(${s(v.armX)}px,0);transition:transform .7s cubic-bezier(.2,.8,.2,1)`,
                      )}
                    >
                      {'\n                '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '52px',
                          top: '-2px',
                          width: '56px',
                          height: '34px',
                          borderRadius: '9px',
                          background: 'linear-gradient(180deg,#F4F5F6,#B9BDC2)',
                          boxShadow: '0 8px 14px rgba(0,0,0,.3),inset 0 1px 0 #FFFFFF',
                        }}
                      >
                        <span
                          style={cssToObj(
                            `position:absolute;left:22px;top:12px;width:12px;height:12px;border-radius:50%;background:${s(v.ledC)};box-shadow:0 0 8px ${s(v.ledC)}`,
                          )}
                        ></span>
                      </div>
                      {'\n                '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:72px;top:30px;width:16px;height:${s(v.armL)}px;border-radius:0 0 6px 6px;background:linear-gradient(90deg,#8C9096,#F4F5F6 45%,#9DA1A6);box-shadow:4px 6px 10px rgba(0,0,0,.25);transition:height .7s cubic-bezier(.2,.8,.2,1)`,
                        )}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '4px',
                            bottom: '-14px',
                            width: '8px',
                            height: '16px',
                            borderRadius: '0 0 4px 4px',
                            background: 'linear-gradient(90deg,#B9852F,#FFDB6E 50%,#C9921A)',
                          }}
                        ></span>
                        <span
                          style={cssToObj(
                            `position:absolute;left:2px;bottom:-20px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle,rgba(255,219,110,.9),rgba(247,192,50,0) 70%);opacity:${s(v.tipO)};transition:opacity .3s`,
                          )}
                        ></span>
                      </div>
                      {'\n              '}
                    </div>
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '380px',
                        top: '478px',
                        width: '300px',
                        height: '14px',
                        borderRadius: '7px',
                        background: '#26282B',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,.8),0 1px 0 rgba(255,255,255,.4)',
                      }}
                    ></div>
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '390px',
                        top: '485px',
                        width: '280px',
                        height: '215px',
                        overflow: 'hidden',
                        pointerEvents: 'none',
                      }}
                    >
                      {'\n                '}
                      <div
                        style={cssToObj(
                          `position:relative;width:280px;transform:translateY(${s(v.tickY)}%);transition:transform .2s linear`,
                        )}
                      >
                        {'\n                  '}
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '7px',
                            padding: '16px 18px 22px',
                            background: '#FFFFFF',
                            color: '#1A1B1D',
                            boxShadow: '0 14px 26px rgba(110,72,0,.3)',
                            WebkitMask: 'radial-gradient(circle 5px at 5px 100%,transparent 98%,#000) 0 0/10px 100% repeat-x',
                            mask: 'radial-gradient(circle 5px at 5px 100%,transparent 98%,#000) 0 0/10px 100% repeat-x',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: '11px',
                          }}
                        >
                          {'\n                    '}
                          <span
                            style={{
                              fontFamily: "'Space Grotesk',sans-serif",
                              fontWeight: '700',
                              fontSize: '15px',
                              letterSpacing: '.06em',
                            }}
                          >
                            TESTED · WARRANTY
                          </span>
                          {'\n                    '}
                          <span
                            style={{ height: '1px', background: 'repeating-linear-gradient(90deg,#1A1B1D 0 4px,transparent 4px 8px)' }}
                          ></span>
                          {'\n                    '}
                          {(Array.isArray(v.ticket) ? v.ticket : []).map((__it: any, __i: number) => {
                            const v2 = { ...v, r: __it, $index: __i };
                            return ((v: Vals) => (
                              <React.Fragment key={__i}>
                                <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', paddingRight: '86px' }}>
                                  <span style={{ color: '#5E6064' }}>{t(v.r?.k)}</span>
                                  <span style={{ fontWeight: '600', textAlign: 'right' }}>{t(v.r?.v)}</span>
                                </span>
                              </React.Fragment>
                            ))(v2);
                          })}
                          {'\n                    '}
                          <span
                            style={{
                              height: '24px',
                              background:
                                'repeating-linear-gradient(90deg,#1A1B1D 0 2px,transparent 2px 4px,#1A1B1D 4px 5px,transparent 5px 8px)',
                            }}
                          ></span>
                          {'\n                    '}
                          <span
                            style={cssToObj(
                              `position:absolute;right:12px;top:40px;display:grid;place-items:center;width:76px;height:76px;border-radius:50%;box-shadow:inset 0 0 0 2.5px #26282B,inset 0 0 0 6px #F7C032,inset 0 0 0 8px #26282B;background:rgba(247,192,50,.25);transform:rotate(-14deg) scale(${s(v.stampS)});opacity:${s(v.stampO)};transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .3s;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;text-align:center;line-height:1.1`,
                            )}
                          >
                            PASSED
                            <br />4 / 4
                          </span>
                          {'\n                  '}
                        </div>
                        {'\n                '}
                      </div>
                      {'\n              '}
                    </div>
                    {'\n            '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
      </section>
    </>
  );
}

const SEBenchTest = createDC('SE Bench Test', Logic, render);
export default SEBenchTest;
