// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "OpenToEveryone". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cx } from '@/dc/runtime';

/** Issue 4: fine film grain instead of grids, stripes and tiles. */
const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

export default function OpenToEveryone({ v }: { v: Vals }) {
  return (
    <section
      id="everyone"
      data-tone="light"
      data-screen-label="13 Open to everyone"
      data-replay="1"
      style={{ position: 'relative', overflow: 'hidden', background: '#F2F3F4', padding: '120px clamp(20px,4vw,64px)' }}
    >
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: GRAIN,
          opacity: '.04',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          opacity: '0',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          top: '-30%',
          width: '24%',
          height: '160%',
          background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.8),rgba(255,255,255,0))',
          transform: 'rotate(20deg)',
          animation: 'rpSweep 14s cubic-bezier(.45,0,.55,1) infinite',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '120px',
          width: '900px',
          height: '600px',
          marginLeft: '-450px',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side,rgba(255,219,110,.4),rgba(242,243,244,0))',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'relative',
          maxWidth: '1312px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {'\n    '}
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#3D3E3F' }}>
          OPEN TO EVERYONE · FOUR LANES, ONE HUB
        </span>
        {'\n    '}
        <h2
          style={{
            margin: '0',
            fontFamily: "'Space Grotesk',sans-serif",
            fontWeight: '700',
            fontSize: 'clamp(34px,3.4vw,50px)',
            lineHeight: '1.04',
            letterSpacing: '-.035em',
            textAlign: 'center',
            textWrap: 'balance',
            maxWidth: '780px',
          }}
        >
          One phone or one container. We serve everyone like family.
        </h2>
        {'\n    '}
        <div style={{ position: 'relative', width: '100%', height: '150px', marginTop: '6px' }}>
          {'\n      '}
          <svg
            viewBox="0 0 1000 150"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
            fill="none"
          >
            <g stroke="rgba(61,62,63,.25)" strokeWidth="2" vectorEffect="non-scaling-stroke">
              <path id="ln0" d="M500 128 V138 H125 V150"></path>
              <path d="M500 128 V138 H375 V150"></path>
              <path d="M500 128 V138 H625 V150"></path>
              <path d="M500 128 V138 H875 V150"></path>
            </g>
            <path
              d="M500 128 V138 H125 V150"
              pathLength="1000"
              stroke="#F7C032"
              strokeWidth="3"
              strokeDasharray="60 940"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 3px #F7C032)', animation: 'sePulse 4s 0s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
            <path
              d="M500 128 V138 H375 V150"
              pathLength="1000"
              stroke="#F7C032"
              strokeWidth="3"
              strokeDasharray="60 940"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 3px #F7C032)', animation: 'sePulse 4s 1s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
            <path
              d="M500 128 V138 H625 V150"
              pathLength="1000"
              stroke="#F7C032"
              strokeWidth="3"
              strokeDasharray="60 940"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 3px #F7C032)', animation: 'sePulse 4s 2s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
            <path
              d="M500 128 V138 H875 V150"
              pathLength="1000"
              stroke="#F7C032"
              strokeWidth="3"
              strokeDasharray="60 940"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 3px #F7C032)', animation: 'sePulse 4s 3s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
          </svg>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              width: '92px',
              height: '92px',
              marginLeft: '-46px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'radial-gradient(circle,#FFFFFF,#F2F3F4)',
              boxShadow: '0 0 0 2px #F7C032,0 0 0 10px rgba(247,192,50,.15),0 14px 30px rgba(26,27,29,.16)',
              animation: 'hubPulse 3s cubic-bezier(.45,0,.55,1) infinite',
            }}
          >
            <span style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2px #26282B' }}>
              <img src="assets/se-logo.png" alt="Sam Electronics" style={{ width: '100%', height: '100%', display: 'block' }} />
            </span>
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '18px' }}>
          <div
            style={
              {
                '--sp': '1',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '14px 14px 18px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,.82)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.9),0 12px 30px rgba(26,27,29,.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
                animation: 'tmRise .6s 0ms cubic-bezier(.2,.8,.2,1) backwards',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-4ede20eb')}
          >
            {'\n      '}
            <div
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'radial-gradient(70% 80% at 50% 30%,#FFFFFF,#EEF0F2)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '14px',
                  width: '62px',
                  height: '112px',
                  marginLeft: '-60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(115deg,#F4F5F6,#9DA1A6 30%,#D5D8DC 60%,#8C9096)',
                  boxShadow: '0 10px 16px rgba(26,27,29,.25)',
                }}
              >
                <div style={{ position: 'absolute', inset: '2px', borderRadius: '10px', background: '#F2F3F4', overflow: 'hidden' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '5px',
                      right: '5px',
                      top: '12px',
                      height: '10px',
                      borderRadius: '5px',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '4px',
                        top: '3px',
                        height: '4px',
                        width: '30px',
                        background: '#3D3E3F',
                        borderRadius: '2px',
                        transformOrigin: '0 50%',
                        animation: 'lnType calc(4s * var(--sp)) steps(6) infinite',
                      }}
                    ></span>
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '6px',
                      right: '6px',
                      top: '30px',
                      height: '44px',
                      borderRadius: '6px',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0,0,0,.15)',
                      animation: 'lnCard calc(4s * var(--sp)) cubic-bezier(.45,0,.55,1) infinite',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '5px',
                        top: '5px',
                        width: '20px',
                        height: '34px',
                        borderRadius: '3px',
                        background: 'linear-gradient(160deg,#3D3E3F,#0B0C0D)',
                      }}
                    ></span>
                    <span
                      style={{ position: 'absolute', left: '30px', top: '8px', width: '16px', height: '3px', background: '#3D3E3F' }}
                    ></span>
                    <span
                      style={{ position: 'absolute', left: '30px', top: '15px', width: '12px', height: '3px', background: '#F7C032' }}
                    ></span>
                  </span>
                </div>
              </div>
              <div style={{ position: 'absolute', left: '50%', top: '76px', marginLeft: '24px', width: '40px', height: '34px' }}>
                <svg viewBox="0 0 24 24" width="40" height="34" fill="none" stroke="#26282B" strokeWidth="1.8">
                  <path d="M3 4h2l2.5 11h11L21 8H7"></path>
                  <circle cx="9" cy="19" r="1.6"></circle>
                  <circle cx="17" cy="19" r="1.6"></circle>
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    right: '-4px',
                    top: '-4px',
                    minWidth: '14px',
                    height: '14px',
                    borderRadius: '7px',
                    background: '#F7C032',
                    fontSize: '9px',
                    fontWeight: '700',
                    display: 'grid',
                    placeItems: 'center',
                    animation: 'lnBadge calc(4s * var(--sp)) cubic-bezier(.45,0,.55,1) infinite',
                  }}
                >
                  1
                </span>
              </div>
            </div>
            {'\n      '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                LANE 01
              </span>
            </span>
            {'\n      '}
            <span
              style={{
                padding: '0 6px',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: '22px',
                letterSpacing: '-.02em',
              }}
            >
              Retail customer
            </span>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '0 6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Find your part by model
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Pick the grade for your budget
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Collect in Deira or get it delivered
              </span>
            </div>
            {'\n      '}
            <a
              href="#fmp"
              onClick={v.laneGo0}
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '44px',
                padding: '0 14px',
                borderRadius: '10px',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
              className={cx(undefined, 'scp-b327c115')}
            >
              Find my part
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            {'\n    '}
          </div>
          <div
            style={
              {
                '--sp': '1',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '14px 14px 18px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,.82)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.9),0 12px 30px rgba(26,27,29,.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
                animation: 'tmRise .6s 80ms cubic-bezier(.2,.8,.2,1) backwards',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-4ede20eb')}
          >
            {'\n      '}
            <div
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'radial-gradient(70% 80% at 50% 30%,#FFFFFF,#EEF0F2)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  right: '16px',
                  top: '70px',
                  height: '56px',
                  borderRadius: '8px',
                  backgroundColor: '#2B3A36',
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)',
                  backgroundSize: '12px 12px',
                  transform: 'perspective(300px) rotateX(35deg)',
                  boxShadow: '0 8px 14px rgba(26,27,29,.25)',
                }}
              ></div>
              <span
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '84px',
                  width: '6px',
                  height: '44px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg,#141516,#3A3C40,#1A1B1D)',
                  transform: 'rotate(60deg)',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  right: '34px',
                  top: '88px',
                  width: '4px',
                  height: '40px',
                  background: 'linear-gradient(90deg,#8C9096,#F4F5F6,#8C9096)',
                  transform: 'rotate(-58deg)',
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
                    background: 'linear-gradient(90deg,#8C9096,#E4E6E9,#8C9096)',
                  }}
                ></span>
              </span>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '30px',
                  width: '46px',
                  height: '84px',
                  marginLeft: '-23px',
                  borderRadius: '9px',
                  background: '#050506',
                  boxShadow: 'inset 0 0 0 2px #3D3E3F,0 10px 14px rgba(0,0,0,.35)',
                  animation: 'lnDrop calc(3.6s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: '4px',
                    borderRadius: '6px',
                    background: 'radial-gradient(100% 70% at 50% 30%,#3D3E3F,#0B0C0D)',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    inset: '0',
                    borderRadius: '9px',
                    background: 'linear-gradient(120deg,rgba(255,255,255,.2),rgba(255,255,255,0) 35%)',
                  }}
                ></span>
              </div>
            </div>
            {'\n      '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                LANE 02
              </span>
            </span>
            {'\n      '}
            <span
              style={{
                padding: '0 6px',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: '22px',
                letterSpacing: '-.02em',
              }}
            >
              Repair shop
            </span>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '0 6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Same-day parts for the bench
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Every grade side by side
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Trade prices once approved
              </span>
            </div>
            {'\n      '}
            <a
              href="#wholesale"
              onClick={v.laneGo1}
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '44px',
                padding: '0 14px',
                borderRadius: '10px',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
              className={cx(undefined, 'scp-b327c115')}
            >
              Open a trade account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            {'\n    '}
          </div>
          <div
            style={
              {
                '--sp': '1',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '14px 14px 18px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,.82)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.9),0 12px 30px rgba(26,27,29,.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
                animation: 'tmRise .6s 160ms cubic-bezier(.2,.8,.2,1) backwards',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-4ede20eb')}
          >
            {'\n      '}
            <div
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'radial-gradient(70% 80% at 50% 30%,#FFFFFF,#EEF0F2)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  right: '14px',
                  top: '14px',
                  height: '112px',
                  borderRadius: '10px',
                  background: 'linear-gradient(180deg,#E4E6E9,#D5D8DC)',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
                }}
              >
                <svg
                  viewBox="0 0 220 112"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
                >
                  <path
                    d="M10 40 Q30 20 60 30 T110 26 Q140 18 160 40 L190 50 Q205 70 180 90 L120 96 Q80 100 60 80 L20 70 Z"
                    fill="#C9CCD0"
                  ></path>
                  <path d="M30 76 C 70 30, 140 30, 196 62" stroke="#3D3E3F" strokeWidth="1.6" strokeDasharray="4 4" fill="none"></path>
                  <circle cx="30" cy="76" r="4" fill="#26282B"></circle>
                  <circle cx="196" cy="62" r="4.5" fill="#F7C032" stroke="#26282B" strokeWidth="1.5"></circle>
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '22px',
                    height: '16px',
                    margin: '-8px 0 0 -11px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: '0 3px 5px rgba(0,0,0,.3)',
                    offsetPath: "path('M30 76 C 70 30, 140 30, 196 62')",
                    offsetRotate: '0deg',
                    animation: 'lnRoute calc(4s * var(--sp)) cubic-bezier(.45,0,.55,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '9px',
                      top: '0',
                      width: '4px',
                      height: '16px',
                      background: 'rgba(255,240,210,.6)',
                    }}
                  ></span>
                </span>
              </div>
            </div>
            {'\n      '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                LANE 03
              </span>
            </span>
            {'\n      '}
            <span
              style={{
                padding: '0 6px',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: '22px',
                letterSpacing: '-.02em',
              }}
            >
              Trader & exporter
            </span>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '0 6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Bulk lists quoted fast
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Packed for export
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Shipped to four regions
              </span>
            </div>
            {'\n      '}
            <a
              href="#network"
              onClick={v.laneGo2}
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '44px',
                padding: '0 14px',
                borderRadius: '10px',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
              className={cx(undefined, 'scp-b327c115')}
            >
              Plan my shipment
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            {'\n    '}
          </div>
          <div
            style={
              {
                '--sp': '1',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '14px 14px 18px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,.82)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.9),0 12px 30px rgba(26,27,29,.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s',
                animation: 'tmRise .6s 240ms cubic-bezier(.2,.8,.2,1) backwards',
              } as React.CSSProperties
            }
            className={cx(undefined, 'scp-4ede20eb')}
          >
            {'\n      '}
            <div
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'radial-gradient(70% 80% at 50% 30%,#FFFFFF,#EEF0F2)',
              }}
            >
              <div style={{ position: 'absolute', left: '50%', top: '22px', width: '112px', height: '104px', marginLeft: '-56px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0px',
                    bottom: '14px',
                    width: '36px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.3)',
                    animation: 'lnStack0 calc(4.8s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '0',
                      width: '6px',
                      height: '26px',
                      background: 'rgba(255,240,210,.55)',
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '37px',
                    bottom: '14px',
                    width: '36px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.3)',
                    animation: 'lnStack1 calc(4.8s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '0',
                      width: '6px',
                      height: '26px',
                      background: 'rgba(255,240,210,.55)',
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '74px',
                    bottom: '14px',
                    width: '36px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.3)',
                    animation: 'lnStack2 calc(4.8s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '0',
                      width: '6px',
                      height: '26px',
                      background: 'rgba(255,240,210,.55)',
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '0px',
                    bottom: '41px',
                    width: '36px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.3)',
                    animation: 'lnStack3 calc(4.8s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '0',
                      width: '6px',
                      height: '26px',
                      background: 'rgba(255,240,210,.55)',
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '37px',
                    bottom: '41px',
                    width: '36px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.3)',
                    animation: 'lnStack4 calc(4.8s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '0',
                      width: '6px',
                      height: '26px',
                      background: 'rgba(255,240,210,.55)',
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '74px',
                    bottom: '41px',
                    width: '36px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(160deg,#D9A866,#B98446)',
                    boxShadow: 'inset 0 0 0 .5px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.3)',
                    animation: 'lnStack5 calc(4.8s * var(--sp)) cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '0',
                      width: '6px',
                      height: '26px',
                      background: 'rgba(255,240,210,.55)',
                    }}
                  ></span>
                </span>
                <div style={{ position: 'absolute', left: '-2px', right: '-2px', bottom: '0', height: '14px' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '0',
                      height: '4px',
                      background: 'linear-gradient(180deg,#D9B784,#B88F55)',
                    }}
                  ></span>
                  <span
                    style={{ position: 'absolute', left: '3px', top: '4px', width: '14px', height: '6px', background: '#8E6A3A' }}
                  ></span>
                  <span
                    style={{ position: 'absolute', left: '48px', top: '4px', width: '14px', height: '6px', background: '#8E6A3A' }}
                  ></span>
                  <span
                    style={{ position: 'absolute', right: '3px', top: '4px', width: '14px', height: '6px', background: '#8E6A3A' }}
                  ></span>
                  <span style={{ position: 'absolute', left: '0', right: '0', top: '10px', height: '4px', background: '#9C7642' }}></span>
                </div>
              </div>
            </div>
            {'\n      '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                LANE 04
              </span>
            </span>
            {'\n      '}
            <span
              style={{
                padding: '0 6px',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: '22px',
                letterSpacing: '-.02em',
              }}
            >
              Bulk buyer
            </span>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '0 6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Volume pricing on request
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                Incoming shipments first
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#26282B' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    flex: 'none',
                    borderRadius: '50%',
                    background: '#F7C032',
                    boxShadow: '0 0 0 3px #FFF4D1',
                  }}
                ></span>
                One contact for every order
              </span>
            </div>
            {'\n      '}
            <a
              href="#visit"
              onClick={v.laneGo3}
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '44px',
                padding: '0 14px',
                borderRadius: '10px',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
              className={cx(undefined, 'scp-b327c115')}
            >
              Request a bulk quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            {'\n    '}
          </div>
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
