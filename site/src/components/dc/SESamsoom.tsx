// Converted from design/project/SE Samsoom.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s } from '@/dc/runtime';
import Logic from './SESamsoom.logic.js';
import SEPart from './SEPart';

function render(v: Vals) {
  return (
    <>
      <div style={cssToObj(`position:relative;width:${s(v.W)}px;height:${s(v.H)}px`)}>
        {'\n  '}
        <div style={cssToObj(`position:absolute;left:0;top:0;width:200px;height:250px;transform:scale(${s(v.k)});transform-origin:0 0`)}>
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              left: '58px',
              top: '228px',
              width: '84px',
              height: '12px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(0,0,0,.35),rgba(0,0,0,0))',
            }}
          ></span>
          {'\n    '}
          <div style={cssToObj(`position:absolute;inset:0;animation:${s(v.bodyAnim)}`)}>
            {'\n      '}
            <div
              style={cssToObj(
                `position:absolute;inset:0;transform:rotate(${s(v.tilt)}deg);transform-origin:50% 90%;transition:transform .6s cubic-bezier(.2,.8,.2,1)`,
              )}
            >
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '99px',
                  top: '8px',
                  width: '2px',
                  height: '24px',
                  borderRadius: '1px',
                  background: 'linear-gradient(90deg,#5E6064,#C9CCD0,#5E6064)',
                }}
              ></span>
              {'\n        '}
              <span
                style={cssToObj(
                  `position:absolute;left:94px;top:2px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF4D1,#F7C032 55%,#F7C032);box-shadow:0 0 10px 3px rgba(247,192,50,.85);animation:${s(v.antAnim)}`,
                )}
              ></span>
              {'\n        '}
              <div
                style={cssToObj(
                  `position:absolute;left:${s(v.armLx)}px;top:136px;width:20px;height:60px;transform-origin:16px 4px;--a:${s(v.armLa)}deg;transform:rotate(${s(v.armLa)}deg);animation:${s(v.armLanim)};transition:transform .6s cubic-bezier(.2,.8,.2,1)`,
                )}
              >
                {'\n          '}
                <svg
                  viewBox="0 0 20 60"
                  width="20"
                  height="60"
                  style={{ position: 'absolute', inset: '0', overflow: 'visible' }}
                  fill="none"
                  strokeLinecap="round"
                >
                  <path d="M16 4 C 4 18, 20 30, 8 48" stroke="#1F2124" strokeWidth="6.6" /><path d="M16 4 C 4 18, 20 30, 8 48" stroke="#3A3D42" strokeWidth="4.8" />
                  <path d="M16 4 C 4 18, 20 30, 8 48" stroke="rgba(255,255,255,.3)" strokeWidth="1.2" transform="translate(-1.2 -0.6)" />
                </svg>
                {'\n          '}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 26"
                  width="22"
                  height="24"
                  style={{ position: 'absolute', left: '-2.2px', top: '46.6px', overflow: 'visible', transform: 'rotate(33.7deg)', transformOrigin: '11px 0', /* owner (15 Nov): the connector sits ON the cable end, along its direction */ filter: 'drop-shadow(0 1.5px 1.5px rgba(0,0,0,.35))' }}
                >
                  {/* owner (15 Nov): a smooth little tech hand (five fingers, graphite glove, yellow cuff), not a plug */}
                  <defs>
                    <linearGradient id="samHandF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F1F2F4" /><stop offset="1" stopColor="#C9CDD2" /></linearGradient>
                    <linearGradient id="samHandL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F5F6" /><stop offset=".5" stopColor="#C3C7CC" /><stop offset="1" stopColor="#7E838A" /></linearGradient>
                  </defs>
                  <g>
                    {/* owner (15 Nov): the cable ends in a machined connector that gives off electricity: three smooth current arcs with light travelling along them */}
                    <rect x="8.6" y="0" width="6.8" height="6" rx="1.8" fill="url(#samHandF)" stroke="#26282B" strokeWidth=".9" />
                    <rect x="9.3" y=".7" width="5.4" height="1.1" rx=".55" fill="rgba(255,255,255,.3)" />
                    <rect x="8.6" y="5.6" width="6.8" height="1.4" rx=".5" fill="#26282B" />
                    <circle cx="12" cy="8.6" r="3.4" fill="#F7C032" opacity=".28" className="sam-zap-core" />
                    <circle cx="12" cy="8.4" r="1.3" fill="#FFF4D1" />
                    <g className="sam-zap" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8.6c-1.4 2.2-3.6 3-4.4 6.2" stroke="#26282B" strokeWidth="1.15" />
                      <path d="M12 8.6c.2 2.6-.6 4.6.4 8" stroke="#26282B" strokeWidth="1.15" />
                      <path d="M12 8.6c1.4 2.2 3.6 3 4.4 6.2" stroke="#26282B" strokeWidth="1.15" />
                      <path d="M12 8.6c-1.4 2.2-3.6 3-4.4 6.2" stroke="#FFF4D1" strokeWidth=".9" pathLength="10" strokeDasharray="2.2 7.8" className="sam-zap-run" />
                      <path d="M12 8.6c.2 2.6-.6 4.6.4 8" stroke="#FFF4D1" strokeWidth=".9" pathLength="10" strokeDasharray="2.2 7.8" className="sam-zap-run b" />
                      <path d="M12 8.6c1.4 2.2 3.6 3 4.4 6.2" stroke="#FFF4D1" strokeWidth=".9" pathLength="10" strokeDasharray="2.2 7.8" className="sam-zap-run c" />
                    </g>
                    <circle cx="7.6" cy="14.8" r="1.05" fill="#fff" stroke="#26282B" strokeWidth=".7" /><circle cx="12.4" cy="16.6" r="1.05" fill="#fff" stroke="#26282B" strokeWidth=".7" /><circle cx="16.4" cy="14.8" r="1.05" fill="#fff" stroke="#26282B" strokeWidth=".7" />
                  </g>
                </svg>
                {'\n          '}
                {v.tool ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-2px',
                        top: '52px',
                        width: '4px',
                        height: '30px',
                        borderRadius: '1px',
                        background: 'linear-gradient(90deg,#8C9096,#F4F5F6,#8C9096)',
                        transform: 'rotate(30deg)',
                        transformOrigin: '50% 0',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '-3px',
                          top: '-12px',
                          width: '10px',
                          height: '14px',
                          borderRadius: '3px',
                          background: '#F7C032',
                        }}
                      ></span>
                    </span>
                  </>
                ) : null}
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={cssToObj(
                  `position:absolute;left:${s(v.armRx)}px;top:136px;width:20px;height:60px;transform-origin:4px 4px;--a:${s(v.armRa)}deg;transform:rotate(${s(v.armRa)}deg);animation:${s(v.armRanim)};transition:transform .6s cubic-bezier(.2,.8,.2,1)`,
                )}
              >
                {'\n          '}
                <svg
                  viewBox="0 0 20 60"
                  width="20"
                  height="60"
                  style={{ position: 'absolute', inset: '0', overflow: 'visible' }}
                  fill="none"
                  strokeLinecap="round"
                >
                  <path d="M4 4 C 16 18, 0 30, 12 48" stroke="#1F2124" strokeWidth="6.6" /><path d="M4 4 C 16 18, 0 30, 12 48" stroke="#3A3D42" strokeWidth="4.8" />
                  <path d="M4 4 C 16 18, 0 30, 12 48" stroke="rgba(255,255,255,.3)" strokeWidth="1.2" transform="translate(-1.2 -0.6)" />
                </svg>
                {'\n          '}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 26"
                  width="22"
                  height="24"
                  style={{ position: 'absolute', left: '0.2px', top: '46.6px', overflow: 'visible', transform: 'rotate(-33.7deg)', transformOrigin: '11px 0', filter: 'drop-shadow(0 1.5px 1.5px rgba(0,0,0,.35))' }}
                >
                  {/* owner (15 Nov): a smooth little tech hand (five fingers, graphite glove, yellow cuff), not a plug */}
                  <defs>
                    <linearGradient id="samHandF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F1F2F4" /><stop offset="1" stopColor="#C9CDD2" /></linearGradient>
                    <linearGradient id="samHandR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F5F6" /><stop offset=".5" stopColor="#C3C7CC" /><stop offset="1" stopColor="#7E838A" /></linearGradient>
                  </defs>
                  <g transform="translate(24 0) scale(-1 1)">
                    {/* owner (15 Nov): the cable ends in a machined connector that gives off electricity: three smooth current arcs with light travelling along them */}
                    <rect x="8.6" y="0" width="6.8" height="6" rx="1.8" fill="url(#samHandF)" stroke="#26282B" strokeWidth=".9" />
                    <rect x="9.3" y=".7" width="5.4" height="1.1" rx=".55" fill="rgba(255,255,255,.3)" />
                    <rect x="8.6" y="5.6" width="6.8" height="1.4" rx=".5" fill="#26282B" />
                    <circle cx="12" cy="8.6" r="3.4" fill="#F7C032" opacity=".28" className="sam-zap-core" />
                    <circle cx="12" cy="8.4" r="1.3" fill="#FFF4D1" />
                    <g className="sam-zap" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8.6c-1.4 2.2-3.6 3-4.4 6.2" stroke="#26282B" strokeWidth="1.15" />
                      <path d="M12 8.6c.2 2.6-.6 4.6.4 8" stroke="#26282B" strokeWidth="1.15" />
                      <path d="M12 8.6c1.4 2.2 3.6 3 4.4 6.2" stroke="#26282B" strokeWidth="1.15" />
                      <path d="M12 8.6c-1.4 2.2-3.6 3-4.4 6.2" stroke="#FFF4D1" strokeWidth=".9" pathLength="10" strokeDasharray="2.2 7.8" className="sam-zap-run" />
                      <path d="M12 8.6c.2 2.6-.6 4.6.4 8" stroke="#FFF4D1" strokeWidth=".9" pathLength="10" strokeDasharray="2.2 7.8" className="sam-zap-run b" />
                      <path d="M12 8.6c1.4 2.2 3.6 3 4.4 6.2" stroke="#FFF4D1" strokeWidth=".9" pathLength="10" strokeDasharray="2.2 7.8" className="sam-zap-run c" />
                    </g>
                    <circle cx="7.6" cy="14.8" r="1.05" fill="#fff" stroke="#26282B" strokeWidth=".7" /><circle cx="12.4" cy="16.6" r="1.05" fill="#fff" stroke="#26282B" strokeWidth=".7" /><circle cx="16.4" cy="14.8" r="1.05" fill="#fff" stroke="#26282B" strokeWidth=".7" />
                  </g>
                </svg>
                {'\n          '}
                {v.hanky ? (
                  <>
                    <svg
                      width="30"
                      height="26"
                      viewBox="0 0 30 26"
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '46px',
                        transformOrigin: '2px 2px',
                        animation: 'smHanky .45s cubic-bezier(.45,0,.55,1) infinite',
                        overflow: 'visible',
                      }}
                    >
                      <path
                        d="M2 2 C 10 0, 20 4, 28 2 C 26 10, 28 18, 24 24 C 16 20, 8 22, 2 18 C 4 12, 0 8, 2 2 Z"
                        fill="#F7C032"
                        stroke="#F7C032"
                        strokeWidth="1"
                      ></path>
                      <path
                        d="M6 6 C 12 6, 18 8, 22 7 M5 12 C 11 12, 17 14, 23 13"
                        stroke="#FFF1B8"
                        strokeWidth="1"
                        fill="none"
                        opacity=".8"
                      ></path>
                    </svg>
                  </>
                ) : null}
                {'\n          '}
                {v.thumb ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '38px',
                        width: '6px',
                        height: '12px',
                        borderRadius: '3px',
                        background: '#3D3E3F',
                        transform: 'rotate(-20deg)',
                      }}
                    ></span>
                  </>
                ) : null}
                {'\n          '}
                {v.mag ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-8px',
                        top: '30px',
                        width: '30px',
                        height: '30px',
                        transform: 'rotate(-30deg)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '0',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          boxShadow: 'inset 0 0 0 3px #C9CCD0,0 2px 4px rgba(0,0,0,.4)',
                          background: 'radial-gradient(circle at 35% 30%,rgba(255,255,255,.7),rgba(180,210,240,.25))',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '18px',
                          top: '18px',
                          width: '5px',
                          height: '14px',
                          borderRadius: '2px',
                          background: '#26282B',
                          transform: 'rotate(-45deg)',
                          transformOrigin: '50% 0',
                        }}
                      ></span>
                    </span>
                  </>
                ) : null}
                {'\n          '}
                {v.hasItem ? (
                  <span style={cssToObj(`position:absolute;left:12px;top:52px;width:0;height:0;transform:rotate(${s(v.itemRot)}deg)`)}>
                    <SamsoomItem v={v} />
                  </span>
                ) : null}
                {v.hasHold ? (
                  <>
                    <span style={cssToObj(`position:absolute;left:-14px;top:42px;transform:rotate(${s(v.holdRot)}deg)`)}>
                      <SEPart kind={v.hold} size={48} />
                    </span>
                  </>
                ) : null}
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  left: '52px',
                  top: '30px',
                  width: '96px',
                  height: '184px',
                  borderRadius: '24px',
                  background: 'radial-gradient(120% 60% at 30% 0%,#6A6E75 0%,rgba(106,110,117,0) 55%),linear-gradient(160deg,#4A4D53 0%,#2E3034 40%,#222427 75%,#33363B 100%)', /* owner (15 Nov): a cute, soft, glossy graphite shell, not a serious phone */ /* owner (15 Nov): a real titanium band with light on both edges */
                  boxShadow: '0 16px 26px rgba(0,0,0,.32),inset 0 2px 1px rgba(255,255,255,.28),inset 0 -3px 6px rgba(0,0,0,.45),inset 3px 0 6px rgba(255,255,255,.06)',
                }}
              >
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    right: '-2px',
                    top: '52px',
                    width: '3px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#9DA1A6,#5E6064)',
                  }}
                ></span>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '44px',
                    width: '3px',
                    height: '14px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#5E6064,#9DA1A6)',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '64px',
                    width: '3px',
                    height: '22px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#5E6064,#9DA1A6)',
                  }}
                ></span>
                {'\n          '}
                <div style={{ position: 'absolute', inset: '3px', borderRadius: '23px', background: '#050506', overflow: 'hidden' }}>
                  {'\n            '}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '2.5px',
                      borderRadius: '21.5px',
                      background: 'radial-gradient(110% 80% at 40% 25%,#FFF1B8 0%,#F7C032 35%,#F7C032 75%,#E0A61E 100%)',
                      overflow: 'hidden',
                    }}
                  >
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '6px',
                        width: '26px',
                        height: '8px',
                        marginLeft: '-13px',
                        borderRadius: '4px',
                        background: '#000000',
                        boxShadow: 'inset 0 0 0 .5px rgba(255,255,255,.12)',
                      }}
                    ></span>
                    {/* owner (15 Nov, "more realistic"): real cover glass over the display: a soft diagonal reflection and a crisp edge */}
                    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', borderRadius: 'inherit', background: 'linear-gradient(128deg,rgba(255,255,255,.34) 0%,rgba(255,255,255,.1) 22%,rgba(255,255,255,0) 23%,rgba(255,255,255,0) 64%,rgba(255,255,255,.07) 65%,rgba(255,255,255,0) 78%)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.22),inset 0 0 0 2.5px rgba(0,0,0,.18),inset 0 -10px 18px rgba(160,100,0,.18)' }} />
                    {'\n              '}
                    <div
                      style={cssToObj(
                        `position:absolute;left:0;right:0;top:46px;height:44px;transform:translate(${s(v.eyeX)}px,${s(v.eyeY)}px);transition:transform .5s cubic-bezier(.2,.8,.2,1)`,
                      )}
                    >
                      {'\n                '}
                      <div style={cssToObj(`position:absolute;inset:0;animation:${s(v.lookAnim)}`)}>
                        {'\n                  '}
                        {v.eCaps ? (
                          <>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;left:16px;top:${s(v.eTopL)}px;width:20px;height:${s(v.eHL)}px;border-radius:11px;background:radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516);box-shadow:0 2px 3px rgba(110,72,0,.35);transform-origin:50% 50%;animation:${s(v.blinkAnim)};transition:height .35s cubic-bezier(.2,.8,.2,1),top .35s`,
                              )}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '4px',
                                  top: '4px',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                  opacity: '.9',
                                }}
                              ></span>
                            </span>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;right:16px;top:${s(v.eTopR)}px;width:20px;height:${s(v.eHR)}px;border-radius:11px;background:radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516);box-shadow:0 2px 3px rgba(110,72,0,.35);transform-origin:50% 50%;animation:${s(v.blinkAnim)};transition:height .35s cubic-bezier(.2,.8,.2,1),top .35s`,
                              )}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '4px',
                                  top: '4px',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                  opacity: '.9',
                                }}
                              ></span>
                            </span>
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                  '}
                        {v.eArc ? (
                          <>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                left: '14px',
                                top: '12px',
                                width: '24px',
                                height: '14px',
                                boxSizing: 'border-box',
                                border: '5px solid #26282B',
                                borderBottom: 'none',
                                borderRadius: '14px 14px 0 0',
                              }}
                            ></span>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;right:14px;top:12px;width:24px;height:14px;box-sizing:border-box;border:5px solid #26282B;border-bottom:none;border-radius:14px 14px 0 0;;opacity:${s(v.rArcO)}`,
                              )}
                            ></span>
                            {'\n                    '}
                            {v.winkR ? (
                              <>
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '4px',
                                    width: '20px',
                                    height: '28px',
                                    borderRadius: '11px',
                                    background: 'radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516)',
                                    boxShadow: '0 2px 3px rgba(110,72,0,.35)',
                                  }}
                                ></span>
                              </>
                            ) : null}
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                  '}
                        {v.eRound ? (
                          <>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                left: '12px',
                                top: '4px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516)',
                                boxShadow: '0 2px 4px rgba(110,72,0,.35)',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  top: '5px',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                }}
                              ></span>
                            </span>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '4px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516)',
                                boxShadow: '0 2px 4px rgba(110,72,0,.35)',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  top: '5px',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                }}
                              ></span>
                            </span>
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                  '}
                        {v.eLine ? (
                          <>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                left: '14px',
                                top: '18px',
                                width: '24px',
                                height: '12px',
                                boxSizing: 'border-box',
                                border: '4px solid #26282B',
                                borderTop: 'none',
                                borderRadius: '0 0 12px 12px',
                                opacity: '.85',
                              }}
                            ></span>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                right: '14px',
                                top: '18px',
                                width: '24px',
                                height: '12px',
                                boxSizing: 'border-box',
                                border: '4px solid #26282B',
                                borderTop: 'none',
                                borderRadius: '0 0 12px 12px',
                                opacity: '.85',
                              }}
                            ></span>
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                '}
                      </div>
                      {'\n              '}
                    </div>
                    {'\n              '}
                    {/* owner (15 Nov): always a little blush, cute */}
                    <span aria-hidden="true" style={{ position: 'absolute', left: '11px', top: '93px', width: '16px', height: '8px', borderRadius: '50%', background: 'rgba(255,110,120,.42)', filter: 'blur(2px)', zIndex: 2 }} />
                    <span aria-hidden="true" style={{ position: 'absolute', right: '11px', top: '93px', width: '16px', height: '8px', borderRadius: '50%', background: 'rgba(255,110,120,.42)', filter: 'blur(2px)', zIndex: 2 }} />
                    {v.blush ? (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            left: '10px',
                            top: '92px',
                            width: '14px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'rgba(255,120,110,.55)',
                            filter: 'blur(1px)',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '92px',
                            width: '14px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'rgba(255,120,110,.55)',
                            filter: 'blur(1px)',
                          }}
                        ></span>
                      </>
                    ) : null}
                    {'\n              '}
                    <div data-sm-mouth=""
                      style={{
                        position: 'absolute',
                        left: '0',
                        right: '0',
                        top: '102px',
                        height: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {'\n                '}
                      {v.mSmile ? (
                        <>
                          <span
                            style={cssToObj(
                              `width:${s(v.mW)}px;height:${s(v.mHh)}px;box-sizing:border-box;border:3.5px solid #26282B;border-top:none;border-radius:0 0 16px 16px;;transition:width .35s,height .35s`,
                            )}
                          ></span>
                        </>
                      ) : null}
                      {'\n                '}
                      {v.mO ? (
                        <>
                          <span
                            style={
                              v.yawnO
                                ? { width: '16px', height: '20px', boxSizing: 'border-box', border: '3px solid #26282B', borderRadius: '50%', background: '#5A2E1E', animation: 'smYawn 3s ease-in-out 1 both' }
                                : { width: '10px', height: '12px', boxSizing: 'border-box', border: '3px solid #26282B', borderRadius: '50%' }
                            }
                          ></span>
                        </>
                      ) : null}
                      {'\n                '}
                      {v.mWavy ? (
                        <>
                          <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
                            <path d="M2 6 Q 7 1, 13 6 T 24 5" stroke="#26282B" strokeWidth="3" strokeLinecap="round"></path>
                          </svg>
                        </>
                      ) : null}
                      {'\n                '}
                      {v.mDots ? (
                        <>
                          <span style={{ display: 'flex', gap: '4px', paddingTop: '4px' }}>
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#26282B',
                                animation: 'smDots .9s infinite',
                              }}
                            ></span>
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#26282B',
                                animation: 'smDots .9s .15s infinite',
                              }}
                            ></span>
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#26282B',
                                animation: 'smDots .9s .3s infinite',
                              }}
                            ></span>
                          </span>
                        </>
                      ) : null}
                      {'\n              '}
                    </div>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '8px',
                        width: '30px',
                        height: '3px',
                        marginLeft: '-15px',
                        borderRadius: '2px',
                        background: 'rgba(38,40,43,.3)',
                      }}
                    ></span>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        top: '-10%',
                        bottom: '-10%',
                        left: '0',
                        width: '40%',
                        background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14),rgba(255,255,255,0))',
                        animation: 'smShine 6s ease-in-out infinite',
                      }}
                    ></span>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        background: 'linear-gradient(125deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.04) 28%,rgba(255,255,255,0) 29%)',
                      }}
                    ></span>
                    {'\n            '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              {v.chin ? (
                <svg width="200" height="250" viewBox="0 0 200 250" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', transformOrigin: '52px 140px', animation: v.chinAnim }} fill="none" strokeLinecap="round" aria-hidden="true">
                  <path d="M52 140 C 44 176, 78 178, 88 156" stroke="#2B2D31" strokeWidth="6.5" />
                  <path d="M52 140 C 44 176, 78 178, 88 156" stroke="rgba(255,255,255,.32)" strokeWidth="1.5" transform="translate(-1.1 -0.6)" />
                  <rect x="84" y="144" width="12" height="15" rx="3.5" fill="#F7C032" /><rect x="86" y="152" width="8" height="9" rx="2.5" fill="#D5D8DC" />
                  <defs><radialGradient id="smChinG" cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#6E7378" /><stop offset=".7" stopColor="#26282B" /></radialGradient></defs>
                </svg>
              ) : null}
              {v.zzz ? (
                <>
                  <span
                    style={{
                      position: 'absolute',
                      left: '150px',
                      top: '30px',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '18px',
                      color: '#8C9096',
                      animation: 'smZ 2.6s ease-out infinite',
                    }}
                  >
                    z
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '156px',
                      top: '22px',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '12px',
                      color: '#8C9096',
                      animation: 'smZ 2.6s 1.3s ease-out infinite',
                    }}
                  >
                    z
                  </span>
                </>
              ) : null}
              {'\n        '}
              {v.heart ? (
                <>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '146px',
                      top: '70px',
                      opacity: '0',
                      animation: 'smHeart 1.8s .5s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#E5484D"
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                    ></path>
                  </svg>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '156px',
                      top: '92px',
                      opacity: '0',
                      animation: 'smHeart 1.8s 1.1s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#E5484D"
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                    ></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '142px',
                      top: '80px',
                      opacity: '0',
                      animation: 'smHeart 1.8s .8s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#E5484D"
                    ></path>
                  </svg>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '4px',
                      top: '70px',
                      opacity: '0',
                      animation: 'smHeartL 1.8s .5s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#E5484D"
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                    ></path>
                  </svg>
<svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '-6px',
                      top: '92px',
                      opacity: '0',
                      animation: 'smHeartL 1.8s 1.1s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#E5484D"
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                    ></path>
                  </svg>
<svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '80px',
                      opacity: '0',
                      animation: 'smHeartL 1.8s .8s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#E5484D"
                    ></path>
                  </svg>
                </>
              ) : null}
              {'\n        '}
              {v.spark ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    style={{ position: 'absolute', left: '146px', top: '36px', animation: 'smSpark 1.4s ease-in-out infinite' }}
                  >
                    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#F7C032"></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style={{ position: 'absolute', left: '38px', top: '60px', animation: 'smSpark 1.4s .7s ease-in-out infinite' }}
                  >
                    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#F7C032"></path>
                  </svg>
                </>
              ) : null}
              {'\n        '}
              {v.confetti ? (
                <>
                  {(Array.isArray(v.conf) ? v.conf : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, c: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        <span
                          style={cssToObj(
                            `position:absolute;left:98px;top:20px;width:6px;height:9px;border-radius:1px;background:${s(v.c?.c)};--cx:${s(v.c?.x)}px;--cy:${s(v.c?.y)}px;animation:smConf 1.4s ${s(v.c?.d)} ease-out infinite`,
                          )}
                        ></span>
                      </React.Fragment>
                    ))(v2);
                  })}
                </>
              ) : null}
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
      </div>
    </>
  );
}

/** G8 context emotes: the little things Samsoom pulls out (28px, drawn above his right hand). */
function SamsoomItem({ v }: { v: Vals }) {
  const box: React.CSSProperties = { position: 'absolute', left: '-24px', top: '-52px', width: '48px', height: '48px', overflow: 'visible', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))' };
  if (v.isClock)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <circle cx="17" cy="17" r="15" fill="#FFFFFF" stroke="#26282B" strokeWidth="3" />
        <circle cx="17" cy="17" r="11.5" fill="none" stroke="#F7C032" strokeWidth="1.5" strokeDasharray="1.5 4.5" />
        <path d="M17 17V9" stroke="#26282B" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M17 17h-6" stroke="#26282B" strokeWidth="2.2" strokeLinecap="round" style={{ transformOrigin: '17px 17px', animation: v.itemAnim }} />
        <circle cx="17" cy="17" r="2" fill="#F7C032" />
      </svg>
    );
  if (v.isCheck)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <rect x="5" y="4" width="24" height="29" rx="3" fill="#FFFFFF" stroke="#26282B" strokeWidth="2.6" />
        <rect x="12" y="1.5" width="10" height="5" rx="1.5" fill="#F7C032" stroke="#26282B" strokeWidth="1.6" />
        {[12, 19, 26].map((y, i) => (
          <g key={y} style={{ opacity: 0, animation: `smCheck .4s ${0.35 + i * 0.45}s cubic-bezier(.2,.8,.2,1) both` }}>
            <path d={`M9 ${y}l2 2 3.5-4`} fill="none" stroke="#2BB673" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M17 ${y}h8`} stroke="#8C9096" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    );
  if (v.isTool)
    return (
      <svg viewBox="0 0 34 34" style={{ ...box, transformOrigin: '17px 30px', animation: v.itemAnim }}>
        <rect x="13" y="16" width="8" height="16" rx="3" fill="#F7C032" stroke="#26282B" strokeWidth="2" />
        <path d="M15.5 19v10M18.5 19v10" stroke="#F7C032" strokeWidth="1.2" />
        <rect x="15.6" y="2" width="2.8" height="15" rx="1" fill="#C9CCD0" stroke="#5E6064" strokeWidth=".8" />
        <path d="M15.6 2h2.8v2h-2.8z" fill="#26282B" />
      </svg>
    );
  if (v.isTag)
    return (
      <svg viewBox="0 0 34 34" style={{ ...box, transformOrigin: '17px 4px', animation: 'smSwing 1.5s ease-in-out infinite alternate' }}>
        <path d="M17 1v6" stroke="#26282B" strokeWidth="1.4" />
        <path d="M8 12l9-6 9 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#F7C032" stroke="#26282B" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="17" cy="11" r="2" fill="#FFFFFF" stroke="#26282B" strokeWidth="1.4" />
        <path d="M12 19h10M12 24h7" stroke="#26282B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (v.isParcel)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <path d="M17 3 31 10v15l-14 7L3 25V10z" fill="#D9A55C" stroke="#26282B" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M3 10l14 7 14-7M17 17v15" fill="none" stroke="#26282B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 6.5l14 7v5" fill="none" stroke="#F7C032" strokeWidth="3" />
      </svg>
    );
  if (v.isGlobe)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <circle cx="17" cy="17" r="14" fill="#26282B" stroke="#F7C032" strokeWidth="2.2" />
        <ellipse cx="17" cy="17" rx="7" ry="14" fill="none" stroke="#F7C032" strokeWidth="1.4" style={{ transformOrigin: '17px 17px', animation: v.itemAnim }} />
        <ellipse cx="17" cy="17" rx="7" ry="14" fill="none" stroke="#F7C032" strokeWidth="1" opacity=".6" style={{ transformOrigin: '17px 17px', animation: v.itemAnim, animationDelay: '-.75s' }} />
        <path d="M3 17h28M5.5 10h23M5.5 24h23" stroke="#F7C032" strokeWidth="1" opacity=".7" />
      </svg>
    );
  return null;
}

const SESamsoom = createDC('SE Samsoom', Logic, render);
export default SESamsoom;
