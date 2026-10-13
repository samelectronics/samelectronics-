// Converted from design/project/SE Repair Sequence.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s } from '@/dc/runtime';
import Logic from './SERepairSequence.logic.js';

function render(v: Vals) {
  return (
    <>
      <section
        data-replay="1"
        ref={v.boxRef}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '520px',
          background: 'linear-gradient(180deg,#3D3E3F,#26282B)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1),0 24px 60px rgba(26,27,29,.2)',
        }}
      >
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            left: '14px',
            right: '14px',
            top: '14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6,1fr)',
            gap: '6px',
            zIndex: '3',
          }}
        >
          {'\n    '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '28px',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                fontWeight: '600',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                animation: 'rsS0 16s infinite',
              }}
            >
              01 Intake
            </span>
            <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  background: '#F7C032',
                  transformOrigin: '0 50%',
                  animation: 'rsB0 16s linear infinite',
                }}
              ></span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '28px',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                fontWeight: '600',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                animation: 'rsS1 16s infinite',
              }}
            >
              02 Heat
            </span>
            <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  background: '#F7C032',
                  transformOrigin: '0 50%',
                  animation: 'rsB1 16s linear infinite',
                }}
              ></span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '28px',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                fontWeight: '600',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                animation: 'rsS2 16s infinite',
              }}
            >
              03 Open
            </span>
            <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  background: '#F7C032',
                  transformOrigin: '0 50%',
                  animation: 'rsB2 16s linear infinite',
                }}
              ></span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '28px',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                fontWeight: '600',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                animation: 'rsS3 16s infinite',
              }}
            >
              04 Swap
            </span>
            <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  background: '#F7C032',
                  transformOrigin: '0 50%',
                  animation: 'rsB3 16s linear infinite',
                }}
              ></span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '28px',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                fontWeight: '600',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                animation: 'rsS4 16s infinite',
              }}
            >
              05 Boot
            </span>
            <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  background: '#F7C032',
                  transformOrigin: '0 50%',
                  animation: 'rsB4 16s linear infinite',
                }}
              ></span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '28px',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                fontWeight: '600',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                animation: 'rsS5 16s infinite',
              }}
            >
              06 Tested
            </span>
            <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  background: '#F7C032',
                  transformOrigin: '0 50%',
                  animation: 'rsB5 16s linear infinite',
                }}
              ></span>
            </span>
          </div>
          {'\n  '}
        </div>
        {'\n  '}
        <div style={{ position: 'absolute', left: '0', right: '0', top: '64px', bottom: '0', display: 'grid', placeItems: 'center' }}>
          {'\n    '}
          <div
            style={cssToObj(`position:relative;width:620px;height:440px;transform:scale(${s(v.sc)});transform-origin:50% 50%;flex:none`)}
          >
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '18px',
                backgroundColor: '#2B3A36',
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
                backgroundSize: '80px 80px,80px 80px,16px 16px,16px 16px',
                boxShadow: 'inset 0 2px 14px rgba(0,0,0,.4)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  bottom: '10px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9px',
                  letterSpacing: '.2em',
                  color: 'rgba(255,255,255,.35)',
                }}
              >
                ESD SAFE · SAM ELECTRONICS
              </span>
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '478px',
                top: '280px',
                width: '96px',
                height: '96px',
                borderRadius: '10px',
                background: 'linear-gradient(160deg,#4A4D52,#26282B)',
                boxShadow: '0 8px 14px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.15)',
                padding: '8px',
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
              }}
            >
              {'\n        '}
              <span style={{ borderRadius: '4px', background: '#1F2022', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)' }}></span>
              <span style={{ borderRadius: '4px', background: '#1F2022', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)' }}></span>
              <span style={{ borderRadius: '4px', background: '#1F2022', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)' }}></span>
              <span style={{ borderRadius: '4px', background: '#1F2022', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)' }}></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  bottom: '-16px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '8px',
                  color: 'rgba(255,255,255,.45)',
                }}
              >
                MAGNETIC MAT
              </span>
              {'\n      '}
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '470px',
                top: '60px',
                width: '12px',
                height: '150px',
                borderRadius: '5px 5px 3px 3px',
                background: 'linear-gradient(90deg,#0E0F10,#3A3C40 45%,#1A1B1D)',
                clipPath: 'polygon(25% 0,75% 0,100% 8%,100% 100%,0 100%,0 8%)',
                transform: 'rotate(18deg)',
                boxShadow: '0 8px 10px rgba(0,0,0,.4)',
              }}
            ></div>
            {'\n      '}
            <span
              style={{
                position: 'absolute',
                left: '200px',
                top: '380px',
                width: '210px',
                height: '30px',
                borderRadius: '50%',
                background: 'radial-gradient(closest-side,rgba(0,0,0,0.5),rgba(0,0,0,0))',
                filter: 'blur(3px)',
              }}
            ></span>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '210px',
                top: '44px',
                width: '180px',
                height: '350px',
                animation: 'rsPhone 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '30px',
                  background: 'linear-gradient(115deg,#F4F5F6,#B9BDC2 12%,#7E838A 36%,#D5D8DC 62%,#8C9096 86%,#C9CCD0)',
                  boxShadow: '0 0 0 .5px rgba(0,0,0,.4),0 18px 26px rgba(0,0,0,.45),inset 0 1px 0 #FFFFFF',
                }}
              ></div>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  right: '-2px',
                  top: '96px',
                  width: '3px',
                  height: '40px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg,#9DA1A6,#5E6064)',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '80px',
                  width: '3px',
                  height: '22px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg,#5E6064,#9DA1A6)',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '110px',
                  width: '3px',
                  height: '34px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg,#5E6064,#9DA1A6)',
                }}
              ></span>
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '4px',
                  borderRadius: '26px',
                  background: 'linear-gradient(160deg,#B9BDC2,#8C9096)',
                  overflow: 'hidden',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    left: '8px',
                    right: '8px',
                    top: '10px',
                    height: '118px',
                    borderRadius: '9px',
                    background: 'linear-gradient(160deg,#1F5A3F,#103223)',
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.4)',
                  }}
                >
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      inset: '0',
                      borderRadius: '9px',
                      opacity: '.4',
                      backgroundImage:
                        'linear-gradient(90deg,rgba(212,175,90,.5) 1px,transparent 1px),linear-gradient(0deg,rgba(212,175,90,.35) 1px,transparent 1px)',
                      backgroundSize: '9px 100%,100% 13px',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '8px',
                      width: '56px',
                      height: '40px',
                      borderRadius: '3px',
                      background: 'linear-gradient(135deg,#E4E6E9,#9DA1A6 45%,#C9CCD0 70%,#8C9096)',
                      boxShadow: '0 1px 2px rgba(0,0,0,.5)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        backgroundImage: 'radial-gradient(rgba(0,0,0,.18) .8px,transparent 1px)',
                        backgroundSize: '5px 5px',
                      }}
                    ></span>
                  </span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '70px',
                      top: '10px',
                      width: '26px',
                      height: '26px',
                      borderRadius: '2px',
                      background: 'linear-gradient(145deg,#2E3033,#141516)',
                      boxShadow: '0 1px 2px rgba(0,0,0,.6)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '3px',
                        top: '3px',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '6px',
                        color: '#8C9096',
                      }}
                    >
                      A17
                    </span>
                  </span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '8px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 40% 35%,#3A4A66,#050506 62%)',
                      boxShadow: '0 0 0 3px #8C9096,0 0 0 4px #26282B',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '10px',
                      bottom: '10px',
                      width: '40px',
                      height: '9px',
                      borderRadius: '1px',
                      background: 'linear-gradient(180deg,#C9CCD0,#6E7378)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '2px',
                        background: 'repeating-linear-gradient(90deg,#D4AF5A 0 1px,#3A3C40 1px 2px)',
                      }}
                    ></span>
                  </span>
                  {'\n          '}
                </div>
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    right: '12px',
                    top: '140px',
                    height: '190px',
                    borderRadius: '8px',
                    background: 'linear-gradient(125deg,#F4F5F6 0%,#C9CCD0 18%,#9DA1A6 34%,#E4E6E9 52%,#A9ADB3 70%,#D5D8DC 100%)',
                    boxShadow: '0 3px 6px rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,255,255,.7)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: '0',
                      borderRadius: '8px',
                      background:
                        'repeating-linear-gradient(100deg,rgba(255,255,255,.18) 0 6px,rgba(0,0,0,.05) 6px 9px,transparent 9px 18px)',
                    }}
                  ></span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      right: '12px',
                      height: '52px',
                      borderRadius: '4px',
                      background: '#26282B',
                      padding: '6px 8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontWeight: '700',
                        fontSize: '9px',
                        letterSpacing: '.14em',
                        color: '#F7C032',
                      }}
                    >
                      SAM ELECTRONICS
                    </span>
                    <span
                      style={{
                        display: 'block',
                        marginTop: '3px',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '8px',
                        lineHeight: '1.5',
                        color: '#E4E6E9',
                      }}
                    >
                      Li-ion 3240 mAh · 3.88 V
                    </span>
                  </span>
                </div>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '30px',
                    top: '122px',
                    width: '14px',
                    height: '24px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#B26A22,#E9A54E,#B26A22)',
                    transformOrigin: '50% 100%',
                    animation: 'rsFlex 16s infinite',
                  }}
                ></span>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '48px',
                    top: '48px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%,#FFFFFF,#9DA1A6 55%,#5E6064)',
                    boxShadow: '0 1px 1px rgba(0,0,0,.5)',
                    animation: 'rsScrew0 16s infinite',
                    animationTimingFunction: 'cubic-bezier(.3,0,.5,1)',
                  }}
                >
                  <span
                    style={{ position: 'absolute', left: '2px', top: '4px', width: '5px', height: '1px', background: '#3D3E3F' }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '104px',
                    top: '48px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%,#FFFFFF,#9DA1A6 55%,#5E6064)',
                    boxShadow: '0 1px 1px rgba(0,0,0,.5)',
                    animation: 'rsScrew1 16s infinite',
                    animationTimingFunction: 'cubic-bezier(.3,0,.5,1)',
                  }}
                >
                  <span
                    style={{ position: 'absolute', left: '2px', top: '4px', width: '5px', height: '1px', background: '#3D3E3F' }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '48px',
                    top: '84px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%,#FFFFFF,#9DA1A6 55%,#5E6064)',
                    boxShadow: '0 1px 1px rgba(0,0,0,.5)',
                    animation: 'rsScrew2 16s infinite',
                    animationTimingFunction: 'cubic-bezier(.3,0,.5,1)',
                  }}
                >
                  <span
                    style={{ position: 'absolute', left: '2px', top: '4px', width: '5px', height: '1px', background: '#3D3E3F' }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '104px',
                    top: '84px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%,#FFFFFF,#9DA1A6 55%,#5E6064)',
                    boxShadow: '0 1px 1px rgba(0,0,0,.5)',
                    animation: 'rsScrew3 16s infinite',
                    animationTimingFunction: 'cubic-bezier(.3,0,.5,1)',
                  }}
                >
                  <span
                    style={{ position: 'absolute', left: '2px', top: '4px', width: '5px', height: '1px', background: '#3D3E3F' }}
                  ></span>
                </span>
                {'\n        '}
              </div>
              {'\n        '}
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '4px',
                  borderRadius: '26px',
                  background: '#050506',
                  overflow: 'hidden',
                  transformOrigin: '50% 0',
                  animation: 'rsOld 16s infinite',
                  animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '5px',
                    borderRadius: '21px',
                    background: 'radial-gradient(100% 70% at 50% 30%,#2A2C30,#0B0C0D)',
                  }}
                ></div>
                {'\n          '}
                <svg
                  viewBox="0 0 172 342"
                  width="172"
                  height="342"
                  style={{ position: 'absolute', inset: '0' }}
                  fill="none"
                  stroke="rgba(255,255,255,.85)"
                  strokeLinecap="round"
                >
                  <path
                    d="M120 112 L58 34 M120 112 L166 64 M120 112 L148 222 L120 334 M120 112 L30 160 L8 250 M120 112 L82 240 M148 222 L170 250 M30 160 L0 140 M82 240 L44 340 M120 112 L104 88 M120 112 L136 96 M120 112 L130 134 M120 112 L100 120"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeWidth="1.1"
                    style={{ animation: 'rsCrack 16s infinite' }}
                  ></path>
                  <circle cx="120" cy="112" r="6" strokeWidth="1.4"></circle>
                </svg>
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(118deg,rgba(255,255,255,.16),rgba(255,255,255,0) 32%)',
                  }}
                ></div>
                {'\n        '}
              </div>
              {'\n        '}
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '4px',
                  borderRadius: '26px',
                  background: '#050506',
                  overflow: 'hidden',
                  opacity: '0',
                  animation: 'rsNew 16s infinite',
                  animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '5px',
                    borderRadius: '21px',
                    background: 'radial-gradient(120% 70% at 50% 20%,#3D3E3F,#1F2022 55%,#0B0C0D)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <span
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      boxShadow: '0 0 0 2.5px #F7C032,0 0 30px rgba(247,192,50,.6)',
                      opacity: '0',
                      animation: 'rsBoot 16s infinite',
                    }}
                  >
                    <img src="assets/se-logo.png" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
                  </span>
                </div>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '12px',
                    width: '52px',
                    height: '15px',
                    marginLeft: '-26px',
                    borderRadius: '8px',
                    background: '#000000',
                  }}
                ></span>
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    borderRadius: '26px',
                    boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.18),inset 0 0 0 5px rgba(0,0,0,.6)',
                  }}
                ></div>
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    background:
                      'linear-gradient(118deg,rgba(255,255,255,.22),rgba(255,255,255,0) 32%,rgba(255,255,255,0) 80%,rgba(255,255,255,.08))',
                  }}
                ></div>
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg,rgba(170,215,255,.35),rgba(200,230,255,.18))',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.4)',
                    transformOrigin: '100% 0',
                    animation: 'rsFilm 16s infinite',
                    animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '-14px',
                      width: '30px',
                      height: '20px',
                      borderRadius: '4px 4px 0 0',
                      background: 'rgba(170,215,255,.6)',
                    }}
                  ></span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '14px',
                      bottom: '14px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '8px',
                      color: 'rgba(255,255,255,.75)',
                    }}
                  >
                    PROTECTIVE FILM
                  </span>
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '192px',
                  top: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '26px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  background: '#26282B',
                  color: '#FFFFFF',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.5)',
                  opacity: '0',
                  animation: 'rsChk0 16s infinite',
                }}
              >
                {'Display '}
                <span style={{ color: '#2BB673' }}>✓</span>
              </span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '192px',
                  top: '154px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '26px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  background: '#26282B',
                  color: '#FFFFFF',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.5)',
                  opacity: '0',
                  animation: 'rsChk1 16s infinite',
                }}
              >
                {'Touch '}
                <span style={{ color: '#2BB673' }}>✓</span>
              </span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '100px',
                  top: '250px',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side,rgba(255,255,255,.5),rgba(255,255,255,0))',
                  opacity: '0',
                  animation: 'rsDust 16s infinite',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '110px',
                  top: '260px',
                  display: 'grid',
                  placeItems: 'center',
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 0 0 3px #26282B,inset 0 0 0 8px #F7C032,inset 0 0 0 10px #26282B',
                  background: '#FFDB6E',
                  color: '#1A1B1D',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '14px',
                  textAlign: 'center',
                  lineHeight: '1.1',
                  opacity: '0',
                  animation: 'rsStamp 16s infinite',
                }}
              >
                TESTED
                <br />✓ 2/2
              </span>
              {'\n      '}
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '186px',
                top: '28px',
                width: '228px',
                height: '382px',
                borderRadius: '26px',
                opacity: '0',
                animation: 'rsHeat 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '26px',
                  background: 'linear-gradient(160deg,#4A4D52,#2E3033)',
                  boxShadow: '0 16px 26px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.12)',
                }}
              ></div>
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '12px',
                  borderRadius: '18px',
                  background:
                    'radial-gradient(70% 60% at 50% 50%,rgba(255,138,60,.45),rgba(255,138,60,0)),repeating-linear-gradient(0deg,rgba(255,170,90,.18) 0 2px,transparent 2px 14px)',
                  animation: 'rsShim 1.2s cubic-bezier(.45,0,.55,1) infinite',
                }}
              ></div>
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '22px',
                  width: '110px',
                  height: '44px',
                  marginLeft: '-55px',
                  borderRadius: '10px',
                  background: '#141516',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    right: '30px',
                    top: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    animation: 'rsTemp 16s infinite',
                    animationTimingFunction: 'steps(5,end)',
                  }}
                >
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    25
                  </span>
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    36
                  </span>
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    47
                  </span>
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    58
                  </span>
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    69
                  </span>
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    80
                  </span>
                  <span
                    style={{
                      height: '44px',
                      lineHeight: '44px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FF9A4A',
                      paddingRight: '4px',
                      boxSizing: 'content-box',
                      display: 'block',
                    }}
                  >
                    80
                  </span>
                </div>
                <span
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '12px',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '14px',
                    color: '#FF9A4A',
                  }}
                >
                  °C
                </span>
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '256px',
                top: '262px',
                width: '88px',
                height: '120px',
                opacity: '0',
                animation: 'rsCup 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '0',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 0 0 5px #C9CCD0,0 3px 5px rgba(0,0,0,.45)',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '40px',
                  top: '24px',
                  width: '8px',
                  height: '28px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg,#6E7378 0%,#F4F5F6 35%,#B9BDC2 55%,#5E6064 100%)',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '48px',
                  width: '88px',
                  height: '72px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 38% 30%,rgba(255,255,255,.8),rgba(175,195,210,.45) 42%,rgba(80,100,120,.55) 76%,rgba(30,40,50,.75))',
                  boxShadow: '0 12px 16px rgba(0,0,0,.45),inset 0 0 0 1.5px rgba(255,255,255,.55),inset 0 -8px 12px rgba(0,0,0,.25)',
                }}
              ></span>
              {'\n      '}
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '170px',
                top: '210px',
                width: '54px',
                height: '46px',
                opacity: '0',
                animation: 'rsPickL 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '50% 50% 50% 10%',
                  background: 'linear-gradient(135deg,rgba(80,150,255,.85),rgba(40,100,220,.7))',
                  boxShadow: '0 6px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.35)',
                }}
              ></span>
            </div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '376px',
                top: '180px',
                width: '54px',
                height: '46px',
                opacity: '0',
                animation: 'rsPickR 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '50% 50% 10% 50%',
                  background: 'linear-gradient(225deg,rgba(80,150,255,.85),rgba(40,100,220,.7))',
                  boxShadow: '0 6px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.35)',
                }}
              ></span>
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '256px',
                top: '-128px',
                width: '14px',
                height: '226px',
                opacity: '0',
                animation: 'rsDrv 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  width: '14px',
                  height: '12px',
                  borderRadius: '7px 7px 3px 3px',
                  background: 'radial-gradient(circle at 40% 30%,#FFFFFF,#9DA1A6 60%,#5E6064)',
                  transformOrigin: '50% 50%',
                  animation: 'rsCap 16s infinite',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '12px',
                  width: '18px',
                  height: '100px',
                  borderRadius: '4px',
                  background:
                    'repeating-linear-gradient(45deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px),repeating-linear-gradient(-45deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px),linear-gradient(90deg,#8C9096,#E4E6E9 40%,#B9BDC2 60%,#6E7378)',
                  boxShadow: '4px 8px 12px rgba(0,0,0,.4)',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '3px',
                  top: '112px',
                  width: '8px',
                  height: '10px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg,#3A7BD5,#8FB6EE,#2C5FA8)',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '5px',
                  top: '122px',
                  width: '4px',
                  height: '98px',
                  background: 'linear-gradient(90deg,#6E7378 0%,#F4F5F6 35%,#B9BDC2 55%,#5E6064 100%)',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '5px',
                  top: '218px',
                  width: '4px',
                  height: '8px',
                  background: 'linear-gradient(90deg,#3A3C40,#C9CCD0,#3A3C40)',
                  clipPath: 'polygon(0 0,100% 0,80% 100%,20% 100%)',
                }}
              ></span>
              {'\n      '}
            </div>
            {'\n      '}
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '250px',
                top: '150px',
                width: '150px',
                height: '16px',
                opacity: '0',
                transformOrigin: '100% 50%',
                animation: 'rsTwz 16s infinite',
                animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '2px',
                  width: '150px',
                  height: '5px',
                  borderRadius: '3px 1px 1px 3px',
                  background: 'linear-gradient(180deg,#E4E6E9,#8C9096 50%,#5E6064)',
                  clipPath: 'polygon(0 30%,100% 0,100% 100%,0 70%)',
                  boxShadow: '0 3px 4px rgba(0,0,0,.4)',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '9px',
                  width: '150px',
                  height: '5px',
                  borderRadius: '3px 1px 1px 3px',
                  background: 'linear-gradient(180deg,#E4E6E9,#8C9096 50%,#5E6064)',
                  clipPath: 'polygon(0 30%,100% 0,100% 100%,0 70%)',
                }}
              ></span>
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

const SERepairSequence = createDC('SE Repair Sequence', Logic, render);
export default SERepairSequence;
