// GENERATED from design/project/SE Finale.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, cx } from '@/dc/runtime';
import Logic from './SEFinale.logic.js';
import SESamsoom from './SESamsoom';

function render(v: Vals) {
  return (
    <>
      <section
        id="cta"
        ref={v.secRef}
        data-tone="dark"
        data-screen-label="19 Finale"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg,#3D3E3F 0%,#2E3033 55%,#1F2022 100%)',
          color: '#FFFFFF',
          padding: '120px clamp(20px,4vw,64px)',
        }}
      >
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-12%',
            width: '1100px',
            height: '1000px',
            marginLeft: '-550px',
            background:
              'conic-gradient(from 160deg at 50% 0%,rgba(255,255,255,0) 0deg,rgba(255,255,255,.11) 20deg,rgba(255,255,255,0) 40deg)',
            WebkitMaskImage: 'linear-gradient(180deg,#000,transparent 85%)',
            maskImage: 'linear-gradient(180deg,#000,transparent 85%)',
            animation: 'fnBeam 5s cubic-bezier(.45,0,.55,1) infinite',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        {v.on ? (
          <>
            {'\n    '}
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                animation: 'fnTrace .4s 3.5s both',
              }}
              fill="none"
              strokeLinecap="round"
            >
              {'\n      '}
              <g stroke="rgba(247,192,50,.3)" strokeWidth="2">
                <path d="M0 380 H420 L460 340 H600"></path>
                <path d="M1440 380 H1020 L980 340 H840"></path>
                <path d="M0 560 H360 L400 520 H600"></path>
                <path d="M1440 560 H1080 L1040 520 H840"></path>
              </g>
              {'\n      '}
              <g stroke="#FFDB6E" strokeWidth="3" strokeDasharray="120 880" style={{ filter: 'drop-shadow(0 0 5px #F7C032)' }}>
                <path
                  pathLength="1000"
                  d="M0 380 H420 L460 340 H600"
                  style={{ animation: 'fnRace 1s 3.5s cubic-bezier(.45,0,.55,1) both, fnRace 3s 4.5s linear infinite' }}
                ></path>
                <path
                  pathLength="1000"
                  d="M1440 380 H1020 L980 340 H840"
                  style={{ animation: 'fnRace 1s 3.6s cubic-bezier(.45,0,.55,1) both, fnRace 3.4s 4.6s linear infinite' }}
                ></path>
                <path
                  pathLength="1000"
                  d="M0 560 H360 L400 520 H600"
                  style={{ animation: 'fnRace 1s 3.7s cubic-bezier(.45,0,.55,1) both, fnRace 3.8s 4.7s linear infinite' }}
                ></path>
                <path
                  pathLength="1000"
                  d="M1440 560 H1080 L1040 520 H840"
                  style={{ animation: 'fnRace 1s 3.8s cubic-bezier(.45,0,.55,1) both, fnRace 3.2s 4.8s linear infinite' }}
                ></path>
              </g>
              {'\n    '}
            </svg>
            {'\n  '}
          </>
        ) : null}
        {'\n  '}
        <div
          style={{
            position: 'relative',
            maxWidth: '1312px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            textAlign: 'center',
          }}
        >
          {'\n    '}
          <div style={{ position: 'relative', width: 'min(560px,100%)', height: '440px' }}>
            {'\n      '}
            <div ref={v.hostRef} style={{ position: 'absolute', inset: '0' }}>
              <canvas style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
            </div>
            {'\n      '}
            {v.loading ? (
              <>
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '30px',
                    height: '30px',
                    margin: '-15px 0 0 -15px',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.12)',
                    borderTop: '2px solid #F7C032',
                    boxSizing: 'border-box',
                    animation: 'fnSpin 1s linear infinite',
                  }}
                ></span>
              </>
            ) : null}
            {'\n      '}
            {v.on ? (
              <>
                <span
                  style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '40px',
                    animation: 'fnPop .6s 6.4s cubic-bezier(.2,.8,.2,1) both',
                  }}
                >
                  <SESamsoom mood="wave" size={120} />
                </span>
              </>
            ) : null}
            {'\n    '}
          </div>
          {'\n    '}
          {v.on ? (
            <>
              {'\n      '}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                {'\n        '}
                <span
                  style={{
                    display: 'flex',
                    gap: '18px',
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '700',
                    fontSize: 'clamp(22px,2.2vw,30px)',
                    letterSpacing: '.04em',
                  }}
                >
                  <span style={{ color: '#5E6064', animation: 'fnWord .4s 4.5s both' }}>Quality</span>
                  <span style={{ color: '#5E6064' }}>·</span>
                  <span style={{ color: '#5E6064', animation: 'fnWord .4s 5.0s both' }}>Warranty</span>
                  <span style={{ color: '#5E6064' }}>·</span>
                  <span style={{ color: '#5E6064', animation: 'fnWord .4s 5.5s both' }}>Price</span>
                </span>
                {'\n        '}
                <h2
                  style={{
                    margin: '0',
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '700',
                    fontSize: 'clamp(44px,5vw,76px)',
                    lineHeight: '1',
                    letterSpacing: '-.045em',
                    textWrap: 'balance',
                    maxWidth: '900px',
                    animation: 'fnRise .7s 6.0s cubic-bezier(.2,.8,.2,1) both',
                  }}
                >
                  A phone on your bench? We have the part.
                </h2>
                {'\n        '}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    animation: 'fnRise .7s 6.4s cubic-bezier(.2,.8,.2,1) both',
                  }}
                >
                  {'\n          '}
                  <a
                    href="#offer"
                    onClick={v.browse}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '52px',
                      padding: '0 22px',
                      borderRadius: '10px',
                      background: '#F7C032',
                      color: '#1A1B1D',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s',
                    }}
                    className={cx(undefined, 'scp-c5046113')}
                  >
                    Browse all parts
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                  </a>
                  {'\n          '}
                  <a
                    href={v.wa}
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '52px',
                      padding: '0 22px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(255,255,255,.5)',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}
                    className={cx(undefined, 'scp-9ee067bf')}
                  >
                    WhatsApp us
                  </a>
                  {'\n          '}
                  <a
                    href={v.dir}
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '52px',
                      padding: '0 22px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(255,255,255,.5)',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}
                    className={cx(undefined, 'scp-9ee067bf')}
                  >
                    Visit Deira
                  </a>
                  {'\n        '}
                </div>
                {'\n        '}
                <span
                  style={{
                    display: 'flex',
                    gap: '28px',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '13px',
                    color: '#C9CBCE',
                    animation: 'fnRise .7s 6.8s cubic-bezier(.2,.8,.2,1) both',
                  }}
                >
                  <span>
                    <span
                      data-fn="20"
                      style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '22px', color: '#FFFFFF' }}
                    >
                      20
                    </span>
                    + years
                  </span>
                  <span>
                    <span
                      data-fn="14"
                      style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '22px', color: '#FFFFFF' }}
                    >
                      14
                    </span>
                    {' brands'}
                  </span>
                  <span>
                    <span
                      data-fn="9000"
                      style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '22px', color: '#FFFFFF' }}
                    >
                      9,000
                    </span>
                    + parts · sample
                  </span>
                </span>
                {'\n      '}
              </div>
              {'\n    '}
            </>
          ) : null}
          {'\n  '}
        </div>
      </section>
    </>
  );
}

const SEFinale = createDC('SE Finale', Logic, render);
export default SEFinale;
