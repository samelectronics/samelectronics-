// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Hero". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';
import SEBrandLogo from '../../dc/SEBrandLogo';
import HeroSearch from '../HeroSearch';
import SEPart from '../../dc/SEPart';

export default function Hero({ v }: { v: Vals }) {
  return (
    <section
      id="top"
      data-tone="dark"
      data-screen-label="01 Hero"
      style={cssToObj(`position:relative;width:100%;height:${s(v.heroH)}px;overflow:hidden;background:#26282B`)}
    >
      {'\n  '}
      <div ref={v.heroRef} style={cssToObj(`position:absolute;left:0;top:0;width:1440px;height:1030px;zoom:${s(v.z)};color:#FFFFFF`)}>
        {'\n    '}
        <div data-hero-scene="" style={{ position: 'absolute', left: '0', top: '0', width: '1440px', height: '860px', overflow: 'hidden' }}>
          {'\n      '}
          <div
            style={{ position: 'absolute', inset: '0', background: 'linear-gradient(135deg,#3D3E3F 0%,#26282B 48%,#26282B 100%)' }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              inset: '0',
              opacity: '.6',
              backgroundImage:
                'linear-gradient(45deg,rgba(255,255,255,.03) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.03) 75%),linear-gradient(45deg,rgba(255,255,255,.03) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.03) 75%)',
              backgroundSize: '6px 6px',
              backgroundPosition: '0 0,3px 3px',
              WebkitMaskImage: 'linear-gradient(90deg,#000,transparent 55%)',
              maskImage: 'linear-gradient(90deg,#000,transparent 55%)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '360px',
              top: '-260px',
              width: '240px',
              height: '1400px',
              transform: 'rotate(28deg)',
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)',
              pointerEvents: 'none',
            }}
          ></div>
          {'\n      '}
          <div
            style={cssToObj(
              `position:absolute;left:${s(v.glowX)}px;top:${s(v.glowY)}px;width:560px;height:560px;margin:-280px 0 0 -280px;border-radius:50%;background:radial-gradient(closest-side,rgba(247,192,50,.16),rgba(247,192,50,0));pointer-events:none;transition:left .6s ease-out,top .6s ease-out`,
            )}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              inset: '0',
              clipPath: 'polygon(960px 0,1440px 0,1440px 860px,660px 860px)',
              background: '#F7C032',
            }}
          >
            {'\n        '}
            <div
              style={{
                position: 'absolute',
                left: '760px',
                top: '60px',
                width: '760px',
                height: '720px',
                borderRadius: '50%',
                background: 'radial-gradient(closest-side,#FFE58F 0%,rgba(255,219,110,.8) 35%,rgba(255,219,110,0) 100%)',
              }}
            ></div>
            {'\n        '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 1px,transparent 1px 4px)',
              }}
            ></div>
            {'\n      '}
          </div>
          {'\n      '}
          <svg
            viewBox="0 0 1440 860"
            width="1440"
            height="860"
            style={{ position: 'absolute', left: '0', top: '0', pointerEvents: 'none' }}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {'\n        '}
            <g clipPath="url(#seDarkSide)" stroke="rgba(247,192,50,.5)" strokeWidth="3">
              <path d="M36 78 V112 L22 126 V560 L36 574"></path>
              <path d="M760 600 H790 L810 580 H850"></path>
            </g>
            {'\n        '}
            <g clipPath="url(#seDarkSide)" stroke="rgba(247,192,50,.28)">
              {'\n          '}
              <path d="M760 640 V660 L780 680 H800" strokeWidth="2"></path>
              {'\n          '}
              <path d="M760 96 V150 L790 180 H820 L850 210 V260" strokeWidth="2"></path>
              {'\n          '}
              <path d="M790 300 H810 L830 280 V200" strokeWidth="1.5"></path>
              {'\n          '}
              <path d="M760 420 H780 L800 400 H820" strokeWidth="1"></path>
              {'\n          '}
              <path d="M0 810 H140 L170 780 H430 L460 810 H620 L650 780 H700" strokeWidth="2.5"></path>
              {'\n          '}
              <path d="M0 822 H136 L166 792 H300" strokeWidth="1"></path>
              {'\n          '}
              <path d="M260 860 V836 L280 816" strokeWidth="1"></path>
              <path d="M540 860 V840 L560 820 H600" strokeWidth="1"></path>
              {'\n          '}
              <path d="M0 250 H18 L30 262 V440" strokeWidth="1.5"></path>
              <path d="M0 470 H12 V690 L30 708 V740" strokeWidth="1"></path>
              {'\n          '}
              <path d="M820 60 H880 L910 30" strokeWidth="4" stroke="rgba(247,192,50,.15)"></path>
              {'\n        '}
            </g>
            {'\n        '}
            <g stroke="rgba(61,62,63,.26)">
              {'\n          '}
              <path d="M1440 120 H1340 L1300 160 H1236" strokeWidth="2.5"></path>
              {'\n          '}
              <path d="M1440 170 H1406 L1392 184" strokeWidth="2"></path>
              <path d="M1440 182 H1410 L1400 192" strokeWidth="1"></path>
              {'\n          '}
              <path d="M1440 400 H1416 L1400 416 V470" strokeWidth="2"></path>
              {'\n          '}
              <path d="M1030 806 L1014 822 V860" strokeWidth="2.5"></path>
              <path d="M1300 812 L1314 826 V860" strokeWidth="2.5"></path>
              {'\n          '}
              <path d="M1440 620 H1420 L1404 636 V700" strokeWidth="1"></path>
              <path d="M1020 0 V40 L1050 70 H1240" strokeWidth="1.5"></path>
              {'\n          '}
              <path d="M1440 60 H1340" strokeWidth="1"></path>
              <path d="M1440 770 H1380 L1360 790 V860" strokeWidth="4" stroke="rgba(26,27,29,.12)"></path>
              {'\n        '}
            </g>
            {'\n        '}
            <defs>
              <clipPath id="seDarkSide">
                <polygon points="0,0 960,0 660,860 0,860"></polygon>
              </clipPath>
            </defs>
            <line
              x1="960"
              y1="0"
              x2="660"
              y2="860"
              stroke="#FFDB6E"
              strokeWidth="3"
              style={{
                filter: 'drop-shadow(0 0 8px #FFDB6E) drop-shadow(0 0 20px rgba(247,192,50,.8))',
                animation: 'seEdgeGlow 4s ease-in-out infinite',
              }}
            ></line>
            {'\n        '}
            <g
              clipPath="url(#seDarkSide)"
              stroke="#FFDB6E"
              strokeWidth="3.5"
              strokeDasharray="70 930"
              style={{ filter: 'drop-shadow(0 0 5px #F7C032) drop-shadow(0 0 12px rgba(247,192,50,.8))' }}
            >
              {'\n          '}
              <path pathLength="1000" d="M36 78 V112 L22 126 V560 L36 574" style={{ animation: 'sePulse 3.2s linear infinite' }}></path>
              {'\n          '}
              <path pathLength="1000" d="M760 600 H790 L810 580 H850" style={{ animation: 'sePulse 2.2s .9s linear infinite' }}></path>
              {'\n          '}
              <path
                pathLength="1000"
                d="M760 640 V660 L780 680 H800"
                strokeWidth="2.5"
                style={{ animation: 'sePulse 4.1s 1.4s linear infinite' }}
              ></path>
              {'\n          '}
              <path
                pathLength="1000"
                d="M760 96 V150 L790 180 H820 L850 210 V260"
                strokeWidth="2.5"
                style={{ animation: 'sePulse 2.7s .3s linear infinite' }}
              ></path>
              {'\n          '}
              <path
                pathLength="1000"
                d="M790 300 H810 L830 280 V200"
                strokeWidth="2"
                style={{ animation: 'sePulse 4.8s 2s linear infinite' }}
              ></path>
              {'\n          '}
              <path
                pathLength="1000"
                d="M0 810 H140 L170 780 H430 L460 810 H620 L650 780 H700"
                strokeWidth="3"
                style={{ animation: 'sePulse 5.2s .6s linear infinite' }}
              ></path>
              {'\n          '}
              <path
                pathLength="1000"
                d="M0 250 H18 L30 262 V440"
                strokeWidth="2"
                style={{ animation: 'sePulse 3.6s 1.1s linear infinite' }}
              ></path>
              {'\n        '}
            </g>
            {'\n        '}
            <g stroke="rgba(61,62,63,.6)" strokeWidth="3" strokeDasharray="70 930">
              {'\n          '}
              <path
                pathLength="1000"
                d="M1440 120 H1340 L1300 160 H1236"
                style={{ animation: 'sePulse 2.9s .2s linear infinite' }}
              ></path>
              {'\n          '}
              <path pathLength="1000" d="M1440 170 H1406 L1392 184" style={{ animation: 'sePulse 3.4s 1s linear infinite' }}></path>
              {'\n          '}
              <path pathLength="1000" d="M1440 400 H1416 L1400 416 V470" style={{ animation: 'sePulse 4.4s 1.8s linear infinite' }}></path>
              {'\n          '}
              <path pathLength="1000" d="M1030 806 L1014 822 V860" style={{ animation: 'sePulseRev 3.1s linear infinite' }}></path>
              {'\n          '}
              <path pathLength="1000" d="M1300 812 L1314 826 V860" style={{ animation: 'sePulseRev 2.6s .7s linear infinite' }}></path>
              {'\n          '}
              <path
                pathLength="1000"
                d="M1020 0 V40 L1050 70 H1240"
                strokeWidth="2"
                style={{ animation: 'sePulse 3.9s 2.4s linear infinite' }}
              ></path>
              {'\n        '}
            </g>
            {'\n        '}
            <g clipPath="url(#seDarkSide)" fill="#26282B" stroke="#F7C032" strokeWidth="2">
              {'\n          '}
              <circle cx="22" cy="126" r="5"></circle>
              <circle cx="36" cy="574" r="5"></circle>
              <circle cx="760" cy="600" r="5"></circle>
              <circle cx="810" cy="580" r="4"></circle>
              <circle cx="800" cy="680" r="4"></circle>
              <circle cx="760" cy="96" r="4"></circle>
              <circle cx="790" cy="180" r="3.5"></circle>
              <circle cx="850" cy="260" r="4"></circle>
              <circle cx="830" cy="200" r="4"></circle>
              <circle cx="760" cy="420" r="3.5"></circle>
              <circle cx="170" cy="780" r="4"></circle>
              <circle cx="460" cy="810" r="4"></circle>
              <circle cx="700" cy="780" r="5"></circle>
              <circle cx="300" cy="792" r="3"></circle>
              <circle cx="30" cy="262" r="3.5"></circle>
              <circle cx="30" cy="440" r="4"></circle>
              <circle cx="30" cy="740" r="3.5"></circle>
              {'\n        '}
            </g>
            {'\n        '}
            <g fill="#F7C032" stroke="rgba(61,62,63,.55)" strokeWidth="2">
              {'\n          '}
              <circle cx="1300" cy="160" r="4.5"></circle>
              <circle cx="1392" cy="184" r="4"></circle>
              <circle cx="1400" cy="416" r="4"></circle>
              <circle cx="1030" cy="806" r="4.5"></circle>
              <circle cx="1300" cy="812" r="4.5"></circle>
              <circle cx="1404" cy="636" r="3.5"></circle>
              <circle cx="1050" cy="70" r="3.5"></circle>
              <circle cx="1240" cy="70" r="3.5"></circle>
              <circle cx="1340" cy="60" r="3"></circle>
              <circle cx="1360" cy="790" r="3.5"></circle>
              {'\n        '}
            </g>
            {'\n      '}
          </svg>
          {'\n\n      '}
          <div
            style={{
              position: 'absolute',
              left: '760px',
              top: '660px',
              width: '700px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(110,72,0,.32),rgba(110,72,0,0))',
              filter: 'blur(6px)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '790px',
              top: '560px',
              width: '380px',
              height: '170px',
              transform: 'skewX(-38deg)',
              transformOrigin: '50% 100%',
              borderRadius: '40px',
              background: 'linear-gradient(0deg,rgba(60,40,0,.30),rgba(60,40,0,0))',
              filter: 'blur(14px)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '1150px',
              top: '590px',
              width: '220px',
              height: '150px',
              transform: 'skewX(-38deg)',
              transformOrigin: '50% 100%',
              borderRadius: '40px',
              background: 'linear-gradient(0deg,rgba(60,40,0,.30),rgba(60,40,0,0))',
              filter: 'blur(14px)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '836px',
              top: '708px',
              width: '390px',
              height: '22px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(26,27,29,.75),rgba(26,27,29,0))',
              filter: 'blur(3px)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '860px',
              top: '714px',
              width: '340px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(26,27,29,.7)',
              filter: 'blur(1.5px)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '1172px',
              top: '716px',
              width: '214px',
              height: '18px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(26,27,29,.8),rgba(26,27,29,0))',
              filter: 'blur(3px)',
            }}
          ></div>
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '1190px',
              top: '722px',
              width: '180px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(26,27,29,.7)',
              filter: 'blur(1.5px)',
            }}
          ></div>
          {'\n\n      '}
          <div
            data-ipad="1"
            data-hero-dev=""
            style={{
              position: 'absolute',
              left: '836px',
              top: '178px',
              width: '384px',
              height: '540px',
              zIndex: '3',
              transform: 'rotate(-3deg)',
              transformOrigin: '50% 100%',
            }}
          >
            {'\n        '}
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '9px',
                right: '-7px',
                bottom: '-9px',
                borderRadius: '32px',
                background: 'linear-gradient(160deg,#9A9FA6,#5E636A 50%,#3D4045)',
              }}
            ></div>
            {'\n        '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '32px',
                background: 'linear-gradient(115deg,#FFFFFF 0%,#D2D5D9 7%,#9A9FA6 32%,#E1E3E6 60%,#9DA1A6 100%)',
                boxShadow:
                  'inset 0 1.5px 0 rgba(255,255,255,.95),inset 1.5px 0 0 rgba(255,255,255,.8),inset 0 -1.5px 0 rgba(26,27,29,.35),0 0 0 1px rgba(26,27,29,.2)',
              }}
            >
              {'\n          '}
              <span
                style={{
                  position: 'absolute',
                  right: '64px',
                  top: '-2px',
                  width: '46px',
                  height: '3px',
                  borderRadius: '2px',
                  background: '#9DA1A6',
                }}
              ></span>
              {'\n          '}
              <div style={{ position: 'absolute', inset: '4px', borderRadius: '28px', background: '#08090A', overflow: 'hidden' }}>
                {/* 14 Oct §05 C/D: the iPad sweeps first (phone 2.7s later, never together); real glass on top */}
                <span className="se-glass" style={{ zIndex: 5 }}></span>
                <span className="se-glass-sweep" style={{ zIndex: 6, animationDelay: '0s', ['--d' as string]: '300px' } as React.CSSProperties}></span>
                <div
                  style={{
                    position: 'absolute',
                    inset: '13px',
                    borderRadius: '16px',
                    background: '#F2F3F4',
                    overflow: 'hidden',
                    color: '#26282B',
                    contain: 'layout paint',
                  }}
                >
                  {'\n              '}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      height: '22px',
                      padding: '0 14px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    <span>{t(v.clock)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px' }}>
                        <span style={{ width: '3px', height: '4px', background: '#26282B' }}></span>
                        <span style={{ width: '3px', height: '6px', background: '#26282B' }}></span>
                        <span style={{ width: '3px', height: '8px', background: '#26282B' }}></span>
                        <span style={{ width: '3px', height: '10px', background: '#26282B' }}></span>
                      </span>
                      <span
                        style={{
                          width: '20px',
                          height: '9px',
                          borderRadius: '3px',
                          border: '1.5px solid #26282B',
                          boxSizing: 'border-box',
                          padding: '1px',
                        }}
                      >
                        <span style={{ display: 'block', width: '80%', height: '100%', borderRadius: '1px', background: '#26282B' }}></span>
                      </span>
                    </span>
                  </div>
                  {'\n              '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      height: '44px',
                      padding: '0 12px',
                      background: '#FFFFFF',
                      borderBottom: '1px solid rgba(26,27,29,.06)',
                    }}
                  >
                    {'\n                '}
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flex: 'none',
                        boxShadow: '0 0 0 1.5px #F7C032',
                      }}
                    >
                      <img src="assets/se-logo-128.webp" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
                    </span>
                    {'\n                '}
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '13px', lineHeight: '1' }}>
                        Live inventory
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '8px',
                          color: '#2BB673',
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: '#2BB673',
                            animation: 'seBlinkDot 1.4s steps(1) infinite',
                          }}
                        ></span>
                        SYNCED · SAMPLE
                      </span>
                    </span>
                    {'\n                '}
                    <span
                      style={{
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '26px',
                        padding: '0 10px',
                        borderRadius: '9px',
                        background: '#F2F3F4',
                        fontSize: '11px',
                        color: '#8C9096',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5E6064" strokeWidth="2.4">
                        <circle cx="11" cy="11" r="7"></circle>
                        <path d="m20 20-3.5-3.5"></path>
                      </svg>
                      {t(v.ipQuery)}
                    </span>
                    {'\n                '}
                    <span data-ipcart="1" style={{ position: 'relative', display: 'flex' }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="2">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <path d="M3 6h18"></path>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-7px',
                          minWidth: '15px',
                          height: '15px',
                          borderRadius: '8px',
                          background: '#F7C032',
                          fontSize: '9px',
                          fontWeight: '700',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          key={v.ipCartN}
                          style={cssToObj(
                            `display:flex;flex-direction:column;align-items:center;transform:translateY(-15px);animation:${s(v.ipOdo)}`,
                          )}
                        >
                          <span style={{ display: 'block', height: '15px', lineHeight: '15px' }}>{t(v.ipCartP)}</span>
                          <span style={{ display: 'block', height: '15px', lineHeight: '15px' }}>{t(v.ipCartN)}</span>
                        </span>
                      </span>
                    </span>
                    {'\n              '}
                  </div>
                  {'\n              '}
                  <div style={{ display: 'flex', gap: '5px', padding: '9px 12px 8px' }}>
                    {(Array.isArray(v.ipChips) ? v.ipChips : []).map((__it: any, __i: number) => {
                      const v2 = { ...v, c: __it, $index: __i };
                      return ((v: Vals) => (
                        <React.Fragment key={__i}>
                          <span
                            style={cssToObj(
                              `padding:5px 8px;border-radius:7px;background:${s(v.c?.bg)};color:${s(v.c?.ink)};font-size:10px;font-weight:600;box-shadow:0 0 0 1px rgba(26,27,29,.08);transition:background .3s,color .3s;white-space:nowrap`,
                            )}
                          >
                            {t(v.c?.c)}
                          </span>
                        </React.Fragment>
                      ))(v2);
                    })}
                  </div>
                  {'\n              '}
                  <div
                    style={cssToObj(
                      `position:absolute;left:12px;right:12px;bottom:8px;display:flex;align-items:center;gap:8px;height:26px;padding:0 10px;border-radius:9px;background:#26282B;color:#FFFFFF;font-size:10.5px;box-shadow:0 8px 18px rgba(0,0,0,.22);z-index:2;opacity:${s(v.ipToastO)};transform:translateY(${s(v.ipToastY)}px);transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .35s cubic-bezier(.16,1,.3,1)`,
                    )}
                  >
                    <span
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: '16px',
                        height: '16px',
                        flex: 'none',
                        borderRadius: '50%',
                        background: '#F7C032',
                        color: '#26282B',
                        fontSize: '10px',
                        fontWeight: '700',
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {'Added · '}
                      {t(v.ipToastName)}
                    </span>
                  </div>
                  {'\n              '}
                  <div
                    data-ipgrid="1"
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '106px',
                      bottom: '0',
                      overflow: 'hidden',
                      padding: '0 12px',
                    }}
                  >
                    {'\n                '}
                    <div style={cssToObj(`display:grid;grid-template-columns:1fr 1fr;gap:9px;will-change:transform;animation:${s(v.ipAnim)} infinite`)}>
                      {'\n                  '}
                      {(Array.isArray(v.ipCards) ? v.ipCards : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, p: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            {'\n                    '}
                            <div
                              data-ipcard="1"
                              data-name={v.p?.title}
                              style={cssToObj(
                                `height:186px;box-sizing:border-box;display:flex;flex-direction:column;gap:5px;padding:6px;border-radius:12px;background:#FFFFFF;box-shadow:${s(v.p?.ring)};transition:box-shadow .3s`,
                              )}
                            >
                              {'\n                      '}
                              <div
                                data-ipimg="1"
                                style={{
                                  position: 'relative',
                                  height: '108px',
                                  borderRadius: '8px',
                                  background: 'radial-gradient(80% 90% at 50% 35%,#FFFFFF,#E7E8EA)',
                                  display: 'grid',
                                  placeItems: 'center',
                                  overflow: 'hidden',
                                }}
                              >
                                {'\n                        '}
                                {v.p?.lib ? (
                                  <>
                                    <span
                                      style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        width: '80px',
                                        height: '80px',
                                        margin: '-40px 0 0 -40px',
                                      }}
                                    >
                                      <img
                                        src={v.p?.img}
                                        alt=""
                                        style={cssToObj(
                                          `position:absolute;left:${s(v.p?.f?.l)}px;top:${s(v.p?.f?.t)}px;width:${s(v.p?.f?.w)}px;height:${s(v.p?.f?.h)}px;display:block;filter:drop-shadow(0 6px 6px rgba(90,74,46,.22))`,
                                        )}
                                      />
                                    </span>
                                  </>
                                ) : null}
                                {v.p?.css ? (
                                  <>
                                    <SEPart kind={v.p?.kind} size={112} />
                                  </>
                                ) : null}
                                {'\n                        '}
                                <span
                                  data-ipchip="1"
                                  style={{
                                    position: 'absolute',
                                    left: '5px',
                                    top: '5px',
                                    padding: '2px 5px',
                                    borderRadius: '5px',
                                    background: '#26282B',
                                    color: '#F7C032',
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: '8px',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {t(v.p?.grade)}
                                </span>
                                <span
                                  data-ipplus="1"
                                  style={{
                                    position: 'absolute',
                                    right: '5px',
                                    bottom: '5px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: '#26282B',
                                    color: '#FFFFFF',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    lineHeight: '1',
                                    boxShadow: '0 2px 6px rgba(26,27,29,.25)',
                                  }}
                                >
                                  +
                                </span>
                                {'\n                      '}
                              </div>
                              {'\n                      '}
                              <span
                                style={{ fontSize: '10.5px', fontWeight: '600', lineHeight: '1.25', height: '26px', overflow: 'hidden' }}
                              >
                                {t(v.p?.title)}
                              </span>
                              {'\n                      '}
                              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', fontWeight: '600' }}>
                                  {t(v.p?.price)}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8.5px', color: '#5E6064' }}>
                                  <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px' }}>
                                    {(Array.isArray(v.p?.bars) ? v.p?.bars : []).map((__it: any, __i: number) => {
                                      const v2 = { ...v, b: __it, $index: __i };
                                      return ((v: Vals) => (
                                        <React.Fragment key={__i}>
                                          <span
                                            style={cssToObj(`width:2.5px;height:${s(v.b?.h)}px;border-radius:1px;background:${s(v.b?.c)}`)}
                                          ></span>
                                        </React.Fragment>
                                      ))(v2);
                                    })}
                                  </span>
                                  {t(v.p?.stock)}
                                </span>
                              </span>
                              {'\n                    '}
                            </div>
                            {'\n                  '}
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n                '}
                    </div>
                    {'\n                \n              '}
                  </div>
                  {'\n            '}
                </div>
                {'\n            '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(118deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,.04) 28%,rgba(255,255,255,0) 29%)',
                    pointerEvents: 'none',
                  }}
                ></div>
                {'\n            '}
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '5px',
                    width: '6px',
                    height: '6px',
                    marginLeft: '-3px',
                    borderRadius: '50%',
                    background: '#26282B',
                    boxShadow: 'inset 0 0 0 1.5px #3D3E3F',
                  }}
                ></span>
                {'\n          '}
              </div>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n\n      '}
          <div
            ref={v.reelCtl?.ref}
            className="se-reel"
            onMouseEnter={v.reelCtl?.enter}
            onMouseLeave={v.reelCtl?.leave}
            onClick={v.reelCtl?.poster}
            role="region"
            aria-label="Phone ads: hover to pause, click for the poster"
            data-hero-dev=""
            style={{
              position: 'absolute',
              left: '1170px',
              top: '292px',
              width: '212px',
              height: '436px',
              zIndex: '4',
              transform: 'rotate(4deg)',
              transformOrigin: '50% 100%',
              cursor: 'pointer',
            }}
          >
            {'\n        '}
            <div
              style={{
                position: 'absolute',
                left: '6px',
                top: '8px',
                right: '-6px',
                bottom: '-8px',
                borderRadius: '38px',
                background: 'linear-gradient(160deg,#9A9FA6,#5E636A 50%,#3D4045)',
              }}
            ></div>
            {'\n        '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '38px',
                background: 'linear-gradient(115deg,#FFFFFF 0%,#D2D5D9 7%,#868B92 34%,#D9DCE0 66%,#8E939A 100%)',
                boxShadow:
                  'inset 0 1.5px 0 rgba(255,255,255,.95),inset 1.5px 0 0 rgba(255,255,255,.8),inset 0 -1.5px 0 rgba(26,27,29,.35),0 0 0 1px rgba(26,27,29,.22),0 0 70px rgba(255,219,110,.4)',
              }}
            >
              {'\n          '}
              <span
                style={{
                  position: 'absolute',
                  right: '-2px',
                  top: '112px',
                  width: '3px',
                  height: '56px',
                  borderRadius: '2px',
                  background: '#8E939A',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '96px',
                  width: '3px',
                  height: '30px',
                  borderRadius: '2px',
                  background: '#8E939A',
                }}
              ></span>
              {'\n          '}
              <div style={{ position: 'absolute', inset: '3px', borderRadius: '35px', background: '#08090A', overflow: 'hidden' }}>
                {'\n            '}
                <div style={{ position: 'absolute', inset: '7px', borderRadius: '29px', overflow: 'hidden', background: '#26282B' }}>
                  {'\n              '}
                  <div data-se-reel="1" style={{ position: 'absolute', inset: '0', zIndex: '0' }}>
                    {'\n                '}
                    {(Array.isArray(v.reel) ? v.reel : []).map((__it: any, __i: number) => {
                      const v2 = { ...v, a: __it, $index: __i };
                      return ((v: Vals) => (
                        <React.Fragment key={__i}>
                          {'\n                  '}
                          <div
                            data-card={v.a?.kind}
                            style={cssToObj(
                              `position:absolute;left:0;top:0;width:192px;height:416px;overflow:hidden;background:${s(v.a?.bg)};color:${s(v.a?.ink)};animation:${s(v.a?.aCard)}`,
                            )}
                          >
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;left:9%;top:62px;font-family:'JetBrains Mono',monospace;font-size:8.6px;font-weight:600;letter-spacing:.15em;line-height:1;white-space:nowrap;color:${s(v.a?.kick)};opacity:${s(v.a?.kickO)}`,
                              )}
                            >
                              <span style={cssToObj(`display:block;animation:${s(v.a?.aEb)}`)}>{t(v.a?.k)}</span>
                            </span>
                            {'\n                    '}
                            <div
                              style={{
                                position: 'absolute',
                                left: '9%',
                                top: '77px',
                                display: 'flex',
                                flexDirection: 'column',
                                fontFamily: "'Space Grotesk',sans-serif",
                                fontWeight: '700',
                                fontSize: '20.2px',
                                lineHeight: '1.05',
                                letterSpacing: '-.025em',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {'\n                      '}
                              <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '2px', marginBottom: '-2px' }}>
                                <span style={cssToObj(`display:block;animation:${s(v.a?.aL1)}`)}>{t(v.a?.l1)}</span>
                              </span>
                              {'\n                      '}
                              <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '2px', marginBottom: '-2px' }}>
                                <span style={cssToObj(`display:block;animation:${s(v.a?.aL2)}`)}>{t(v.a?.l2)}</span>
                              </span>
                              {'\n                    '}
                            </div>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;left:${s(v.a?.gL)}px;top:${s(v.a?.gT)}px;width:${s(v.a?.gD)}px;height:${s(v.a?.gD)}px;border-radius:50%;background:${s(v.a?.glow)};animation:${s(v.a?.aFade)};translate:0 ${s(v.a?.dy)}px`,
                              )}
                            ></span>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;left:${s(v.a?.sL)}px;top:${s(v.a?.sT)}px;width:${s(v.a?.sW)}px;height:12px;border-radius:50%;background:radial-gradient(closest-side,${s(v.a?.shc)},rgba(0,0,0,0));filter:blur(2.5px);animation:${s(v.a?.aFade)};translate:0 ${s(v.a?.dy)}px`,
                              )}
                            ></span>
                            {'\n                    '}
                            <div style={cssToObj(`position:absolute;inset:0;transform-origin:96px 229px;animation:${s(v.a?.aProd)};translate:0 ${s(v.a?.dy)}px`)}>
                              {'\n                      '}
                              <div style={cssToObj(`position:absolute;inset:0;transform-origin:96px 229px;animation:${s(v.a?.aHold)}`)}>
                                {'\n                        '}
                                <div
                                  style={{ position: 'absolute', inset: '0', transformOrigin: '96px 229px', transform: 'none' }}
                                >
                                  {'\n                          '}
                                  {v.a?.isLib ? (
                                    <>
                                      {'\n                            '}
                                      <div
                                        style={cssToObj(
                                          `position:absolute;left:${s(v.a?.f?.l)}px;top:${s(v.a?.f?.t)}px;width:${s(v.a?.f?.w)}px;height:${s(v.a?.f?.h)}px;transform:${s(v.a?.straight)};transform-origin:${s(v.a?.so)}`,
                                        )}
                                      >
                                        {'\n                              '}
                                        <img
                                          src={v.a?.img}
                                          alt=""
                                          style={cssToObj(
                                            `position:absolute;inset:0;width:100%;height:100%;display:block;filter:${s(v.a?.shd)}`,
                                          )}
                                        />
                                        {'\n                              '}
                                        <span
                                          style={cssToObj(
                                            `position:absolute;inset:0;overflow:hidden;-webkit-mask-image:url('${s(v.a?.img)}');mask-image:url('${s(v.a?.img)}');-webkit-mask-size:100% 100%;mask-size:100% 100%`,
                                          )}
                                        >
                                          <span
                                            style={cssToObj(
                                              `position:absolute;top:-20%;bottom:-20%;left:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.5),rgba(255,255,255,0));animation:${s(v.a?.aSheen)}`,
                                            )}
                                          ></span>
                                        </span>
                                        {'\n                            '}
                                      </div>
                                      {'\n                          '}
                                    </>
                                  ) : null}
                                  {'\n                          '}
                                  {v.a?.isCss ? (
                                    <>
                                      <div style={{ position: 'absolute', left: '36px', top: '169px' }}>
                                        <SEPart kind={v.a?.kind} size={120} />
                                      </div>
                                    </>
                                  ) : null}
                                  {'\n                          '}
                                  {v.a?.isScr ? (
                                    <>
                                      <div
                                        style={{
                                          position: 'absolute',
                                          inset: '0',
                                          transformOrigin: '96px 228px',
                                          transform: 'scale(1.107)',
                                        }}
                                      >
                                        {'\n                            '}
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '90px',
                                            top: '274px',
                                            width: '12px',
                                            height: '10px',
                                            background: 'linear-gradient(90deg,#9C5A22,#D98E45 45%,#B46A2C)',
                                            borderRadius: '0 0 2px 2px',
                                          }}
                                        ></span>
                                        {'\n                            '}
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '87px',
                                            top: '282px',
                                            width: '18px',
                                            height: '8px',
                                            borderRadius: '2px',
                                            background: 'linear-gradient(180deg,#3A3C40,#26282B)',
                                            boxShadow: 'inset 0 0 0 .5px rgba(255,255,255,.18)',
                                          }}
                                        >
                                          <span
                                            style={{
                                              position: 'absolute',
                                              left: '3px',
                                              right: '3px',
                                              top: '2px',
                                              height: '3px',
                                              background: 'repeating-linear-gradient(90deg,#E8C25A 0 1px,transparent 1px 2px)',
                                            }}
                                          ></span>
                                        </span>
                                        {'\n                            '}
                                        <div
                                          style={{
                                            position: 'absolute',
                                            left: '67px',
                                            top: '166px',
                                            width: '58px',
                                            height: '112px',
                                            borderRadius: '9px',
                                            overflow: 'hidden',
                                            background: 'linear-gradient(160deg,#30333A 0%,#0E0F12 42%,#050506 100%)',
                                            boxShadow:
                                              'inset 0 0 0 2.5px #000000,inset 0 0 0 3px rgba(255,255,255,.08),0 0 0 .8px rgba(255,255,255,.22)',
                                          }}
                                        >
                                          {'\n                              '}
                                          <span
                                            style={{
                                              position: 'absolute',
                                              inset: '3px',
                                              borderRadius: '7px',
                                              background:
                                                'radial-gradient(120% 70% at 30% 18%,rgba(255,255,255,.1),rgba(255,255,255,0) 60%)',
                                            }}
                                          ></span>
                                          {'\n                              '}
                                          <span
                                            style={{
                                              position: 'absolute',
                                              left: '50%',
                                              top: '6px',
                                              width: '16px',
                                              height: '4px',
                                              marginLeft: '-8px',
                                              borderRadius: '2px',
                                              background: '#000000',
                                            }}
                                          ></span>
                                          {'\n                              '}
                                          <span
                                            style={cssToObj(
                                              `position:absolute;top:-30%;bottom:-30%;left:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.34),rgba(255,255,255,0));animation:${s(v.a?.aSheen)}`,
                                            )}
                                          ></span>
                                          {'\n                            '}
                                        </div>
                                      </div>
                                      {'\n                          '}
                                    </>
                                  ) : null}
                                  {'\n                          '}
                                  {v.a?.isRep ? (
                                    <>
                                      {'\n                            '}
                                      <div
                                        style={cssToObj(
                                          `position:absolute;left:${s(v.a?.rq?.bx)}px;top:${s(v.a?.rq?.by)}px;width:${s(v.a?.rq?.S)}px;height:${s(v.a?.rq?.S)}px`,
                                        )}
                                      >
                                        {'\n                              '}
                                        {v.a?.rq?.hasImg ? (
                                          <>
                                            <img
                                              src={v.a?.rq?.img}
                                              alt=""
                                              style={{
                                                position: 'absolute',
                                                inset: '0',
                                                width: '100%',
                                                height: '100%',
                                                display: 'block',
                                                filter: 'drop-shadow(0 10px 12px rgba(0,0,0,.45))',
                                              }}
                                            />
                                          </>
                                        ) : null}
                                        {'\n                              '}
                                        {v.a?.rq?.noImg ? (
                                          <>
                                            <span
                                              style={cssToObj(
                                                `position:absolute;left:${s(v.a?.rq?.px)}px;top:${s(v.a?.rq?.py)}px;width:${s(v.a?.rq?.pw)}px;height:${s(v.a?.rq?.ph)}px;border-radius:${s(v.a?.rq?.pr)}px;background:#0B0C0D;box-shadow:0 0 0 2px #9A9FA6,0 12px 18px rgba(0,0,0,.45)`,
                                              )}
                                            ></span>
                                          </>
                                        ) : null}
                                        {'\n                              '}
                                        <div
                                          style={cssToObj(
                                            `position:absolute;left:${s(v.a?.rq?.sx)}px;top:${s(v.a?.rq?.sy)}px;width:${s(v.a?.rq?.sw)}px;height:${s(v.a?.rq?.sh)}px;border-radius:${s(v.a?.rq?.sr)}px;overflow:hidden;background:linear-gradient(160deg,#25272C 0%,#0B0C0E 45%,#050506 100%)`,
                                          )}
                                        >
                                          {'\n                                '}
                                          <span
                                            style={{
                                              position: 'absolute',
                                              inset: '0',
                                              background:
                                                'radial-gradient(120% 70% at 30% 18%,rgba(255,255,255,.1),rgba(255,255,255,0) 60%)',
                                            }}
                                          ></span>
                                          {'\n                                '}
                                          <span
                                            style={cssToObj(
                                              `position:absolute;top:-30%;bottom:-30%;left:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.3),rgba(255,255,255,0));animation:${s(v.a?.aSheenR)}`,
                                            )}
                                          ></span>
                                          {'\n                                '}
                                          <span
                                            style={cssToObj(
                                              `position:absolute;left:${s(v.a?.rq?.fx)}px;top:${s(v.a?.rq?.fy)}px;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,0));opacity:0;animation:${s(v.a?.rq?.flash)}`,
                                            )}
                                          ></span>
                                          {'\n                                '}
                                          <svg
                                            width={v.a?.rq?.sw}
                                            height={v.a?.rq?.sh}
                                            viewBox={v.a?.rq?.vb}
                                            style={{ position: 'absolute', left: '0', top: '0', overflow: 'visible' }}
                                          >
                                            {'\n                                  '}
                                            <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
                                              {(Array.isArray(v.a?.rq?.cracks) ? v.a?.rq?.cracks : []).map((__it: any, __i: number) => {
                                                const v2 = { ...v, c: __it, $index: __i };
                                                return ((v: Vals) => (
                                                  <React.Fragment key={__i}>
                                                    <path
                                                      d={v.c?.d}
                                                      pathLength="1"
                                                      strokeWidth={v.c?.w}
                                                      strokeDasharray="1 1"
                                                      style={cssToObj(`stroke-dashoffset:1;animation:${s(v.c?.wa)}`)}
                                                    ></path>
                                                  </React.Fragment>
                                                ))(v2);
                                              })}
                                            </g>
                                            {'\n                                  '}
                                            <g
                                              fill="none"
                                              stroke="#F7C032"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{ filter: 'drop-shadow(0 0 1.6px #FFDB6E)' }}
                                            >
                                              {(Array.isArray(v.a?.rq?.cracks) ? v.a?.rq?.cracks : []).map((__it: any, __i: number) => {
                                                const v2 = { ...v, c: __it, $index: __i };
                                                return ((v: Vals) => (
                                                  <React.Fragment key={__i}>
                                                    <path
                                                      d={v.c?.d}
                                                      pathLength="1"
                                                      strokeWidth={v.c?.yw}
                                                      strokeDasharray="1 1"
                                                      style={cssToObj(`stroke-dashoffset:1;animation:${s(v.c?.ya)}`)}
                                                    ></path>
                                                  </React.Fragment>
                                                ))(v2);
                                              })}
                                            </g>
                                            {'\n                                '}
                                          </svg>
                                          {'\n                                '}
                                          <div
                                            style={cssToObj(
                                              `position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;background:radial-gradient(90% 60% at 50% 45%,#34363A,#141517);opacity:0;animation:${s(v.a?.rq?.boot)}`,
                                            )}
                                          >
                                            {'\n                                  '}
                                            <img
                                              src="assets/se-logo-320.webp"
                                              alt=""
                                              style={cssToObj(
                                                `width:${s(v.a?.rq?.lw)}px;height:${s(v.a?.rq?.lw)}px;border-radius:50%;display:block;box-shadow:0 0 18px rgba(247,192,50,.45);animation:${s(v.a?.rq?.logo)}`,
                                              )}
                                            />
                                            {'\n                                  '}
                                            <span
                                              style={cssToObj(
                                                `position:absolute;top:-10%;bottom:-10%;left:0;width:40%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.4),rgba(255,255,255,0));transform:translateX(-120%);animation:${s(v.a?.rq?.sweep)}`,
                                              )}
                                            ></span>
                                            {'\n                                '}
                                          </div>
                                          {'\n                              '}
                                        </div>
                                        {'\n                            '}
                                      </div>
                                      {'\n                          '}
                                    </>
                                  ) : null}
                                  {'\n                        '}
                                </div>
                                {'\n                        '}
                                {v.a?.isWhs ? (
                                  <>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        inset: '0',
                                        transformOrigin: '96px 246.5px',
                                        transform: 'translateY(-17.7px) scale(1.07)',
                                      }}
                                    >
                                      {'\n                          '}
                                      <div style={{ position: 'absolute', left: '54px', top: '281px', width: '84px', height: '12px' }}>
                                        {'\n                            '}
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '0',
                                            right: '0',
                                            top: '0',
                                            height: '4px',
                                            borderRadius: '1px',
                                            background: 'repeating-linear-gradient(90deg,#D9B27A 0 20px,#C99F66 20px 21px)',
                                            boxShadow: 'inset 0 0 0 .5px rgba(90,60,25,.4)',
                                          }}
                                        ></span>
                                        {'\n                            '}
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '3px',
                                            top: '4px',
                                            width: '10px',
                                            height: '5px',
                                            background: '#9E7340',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '37px',
                                            top: '4px',
                                            width: '10px',
                                            height: '5px',
                                            background: '#9E7340',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            right: '3px',
                                            top: '4px',
                                            width: '10px',
                                            height: '5px',
                                            background: '#9E7340',
                                          }}
                                        ></span>
                                        {'\n                            '}
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '0',
                                            right: '0',
                                            top: '9px',
                                            height: '3px',
                                            borderRadius: '1px',
                                            background: 'linear-gradient(180deg,#C9A06A,#A97E47)',
                                          }}
                                        ></span>
                                        {'\n                          '}
                                      </div>
                                      {'\n                          '}
                                      {(Array.isArray(v.a?.boxes) ? v.a?.boxes : []).map((__it: any, __i: number) => {
                                        const v2 = { ...v, b: __it, $index: __i };
                                        return ((v: Vals) => (
                                          <React.Fragment key={__i}>
                                            {'\n                            '}
                                            <span
                                              style={cssToObj(
                                                `position:absolute;left:${s(v.b?.x)}px;top:${s(v.b?.y)}px;width:26px;height:22px;opacity:0;transform-origin:50% 100%;animation:${s(v.b?.an)}`,
                                              )}
                                            >
                                              {'\n                              '}
                                              <span
                                                style={{
                                                  position: 'absolute',
                                                  left: '0',
                                                  top: '-5px',
                                                  width: '26px',
                                                  height: '5px',
                                                  transformOrigin: '0 100%',
                                                  transform: 'skewX(-45deg)',
                                                  background: 'linear-gradient(90deg,#E6BF88,#D8AD72)',
                                                  boxShadow: 'inset 0 0 0 .5px rgba(90,60,25,.35)',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    position: 'absolute',
                                                    left: '10px',
                                                    top: '0',
                                                    bottom: '0',
                                                    width: '6px',
                                                    background: '#F2C14A',
                                                  }}
                                                ></span>
                                              </span>
                                              {'\n                              '}
                                              <span
                                                style={{
                                                  position: 'absolute',
                                                  left: '26px',
                                                  top: '0',
                                                  width: '5px',
                                                  height: '22px',
                                                  transformOrigin: '0 0',
                                                  transform: 'skewY(-45deg)',
                                                  background: 'repeating-linear-gradient(90deg,#A87A44 0 .8px,#8E6334 .8px 1.6px)',
                                                }}
                                              ></span>
                                              {'\n                              '}
                                              <span
                                                style={{
                                                  position: 'absolute',
                                                  inset: '0',
                                                  borderRadius: '1px',
                                                  background: 'linear-gradient(180deg,#D4A266,#BA8749)',
                                                  boxShadow: 'inset 0 0 0 .5px rgba(80,52,18,.45)',
                                                }}
                                              >
                                                {'\n                                '}
                                                <span
                                                  style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    right: '0',
                                                    top: '0',
                                                    height: '1.5px',
                                                    background: 'repeating-linear-gradient(90deg,#9E7340 0 .8px,#E2BC86 .8px 1.6px)',
                                                  }}
                                                ></span>
                                                {'\n                                '}
                                                <span
                                                  style={{
                                                    position: 'absolute',
                                                    left: '10px',
                                                    top: '0',
                                                    width: '6px',
                                                    height: '8px',
                                                    background: '#E9B42E',
                                                  }}
                                                ></span>
                                                {'\n                                '}
                                                <span
                                                  style={{
                                                    position: 'absolute',
                                                    right: '3px',
                                                    bottom: '3px',
                                                    width: '11px',
                                                    height: '8px',
                                                    borderRadius: '1px',
                                                    background: '#F6F4EF',
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      position: 'absolute',
                                                      left: '1.5px',
                                                      right: '1.5px',
                                                      top: '1.5px',
                                                      height: '3.5px',
                                                      background:
                                                        'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px,#26282B 1.3px 1.6px,transparent 1.6px 2.4px)',
                                                    }}
                                                  ></span>
                                                </span>
                                                {'\n                              '}
                                              </span>
                                              {'\n                            '}
                                            </span>
                                            {'\n                          '}
                                          </React.Fragment>
                                        ))(v2);
                                      })}
                                    </div>
                                    {'\n                        '}
                                  </>
                                ) : null}
                                {'\n                        '}
                                {v.a?.isWld ? (
                                  <>
                                    <canvas
                                      ref={v.a?.gRef}
                                      width="192"
                                      height="192"
                                      style={{
                                        position: 'absolute',
                                        left: '48px',
                                        top: '180.8px',
                                        width: '96px',
                                        height: '96px',
                                        display: 'block',
                                      }}
                                    ></canvas>
                                  </>
                                ) : null}
                                {'\n                      '}
                              </div>
                              {'\n                    '}
                            </div>
                            {'\n                    '}
                            <div style={cssToObj(`position:absolute;inset:0;animation:${s(v.a?.aBot)}`)}>
                              {'\n                      '}
                              <span
                                style={cssToObj(
                                  `position:absolute;left:9%;top:302px;width:82%;font-size:12.5px;line-height:1.3;color:${s(v.a?.sub)};white-space:pre-line`,
                                )}
                              >
                                {t(v.a?.d)}
                              </span>
                              {'\n                      '}
                              <span
                                style={cssToObj(
                                  `position:absolute;left:9%;top:349px;width:78%;height:33px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px;border-radius:10px;background:${s(v.a?.cta)};color:${s(v.a?.ctaInk)};font-family:Inter,sans-serif;font-weight:600;font-size:11.5px;white-space:nowrap`,
                                )}
                              >
                                {t(v.a?.c)}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                                </svg>
                              </span>
                              {'\n                    '}
                            </div>
                            {'\n                  '}
                          </div>
                          {'\n                '}
                        </React.Fragment>
                      ))(v2);
                    })}
                    {'\n                '}
                    <div
                      style={{ position: 'absolute', left: '9%', right: '9%', top: '35px', height: '2px', zIndex: 20, display: 'flex', gap: '3px' }}
                    >
                      {(Array.isArray(v.pgSegs) ? v.pgSegs : []).map((g: any, i: number) => (
                        <span key={i} style={cssToObj(`position:relative;flex:1;height:2px;border-radius:1px;overflow:hidden;animation:${s(v.pgTrack)}`)}>
                          <span style={cssToObj(`position:absolute;inset:0;border-radius:1px;opacity:0;animation:${s(g.a)}`)}></span>
                        </span>
                      ))}
                    </div>
                    {'\n              '}
                  </div>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '10px',
                      width: '58px',
                      height: '17px',
                      marginLeft: '-29px',
                      borderRadius: '9px',
                      zIndex: '30',
                      background: 'linear-gradient(180deg,#1C1D20 0%,#050506 45%,#000000 100%)',
                      boxShadow: 'inset 0 .6px 0 rgba(255,255,255,.16),inset 0 -.5px 0 rgba(255,255,255,.05),0 0 0 .5px rgba(0,0,0,.6)',
                    }}
                  ></span>
                  {'\n              '}
                  {/* 14 Oct §05 D: real glass (faint top-left reflection, bezel ring, vignette) replaces the strong top-right gloss */}
                  <span className="se-glass" style={{ zIndex: 31 }}></span>
                  <span className="se-glass-sweep" style={{ zIndex: 32, animationDelay: '2.7s', ['--d' as string]: '200px' } as React.CSSProperties}></span>
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute', left: '50%', bottom: '7px', width: '35%', height: '4px', transform: 'translateX(-50%)', borderRadius: '3px', zIndex: 33,
                      background: 'linear-gradient(180deg,rgba(225,228,232,.72),rgba(170,174,180,.6))', boxShadow: '0 0 0 .5px rgba(255,255,255,.35),0 1px 3px rgba(0,0,0,.25)',
                    }}
                  ></span>
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
        {'\n\n    '}
        <div
          data-hero-text=""
          style={{
            position: 'absolute',
            left: '80px',
            top: '118px',
            width: '640px',
            zIndex: '4',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {'\n      '}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '13px',
              letterSpacing: '.12em',
              color: '#D5D7DA',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: '34px', height: '2px', background: '#F7C032', boxShadow: '0 0 10px rgba(247,192,50,.8)' }}></span>
            <span style={{ color: '#F7C032', fontWeight: '600' }}>SINCE 2003</span>AL MURAR, DEIRA · WHOLESALE & RETAIL · SHIPPED WORLDWIDE
          </span>
          {'\n      '}
          <h1
            style={{
              margin: '0 0 4px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: '700',
              fontSize: '86px',
              lineHeight: '.98',
              letterSpacing: '-.045em',
            }}
          >
            <span>Every part.</span>
            <span>Every model.</span>
            <span style={{ color: '#F7C032', textShadow: '0 0 34px rgba(247,192,50,.45)' }}>Every grade.</span>
          </h1>
          {'\n      '}
          <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.5', color: '#D5D7DA', maxWidth: '560px', textWrap: 'pretty' }}>
            Genuine, tested mobile phone parts for repair shops, traders and everyday customers. More than 20 years in Deira.
          </p>
          {'\n      '}
          <HeroSearch
            openFmp={v.openFmpAt}
            typed={
              <>
              {(Array.isArray(v.typedWords) ? v.typedWords : []).map((__it: any, __i: number) => {
                const v2 = { ...v, w: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <span style={cssToObj(`position:absolute;left:0;top:0;opacity:0;animation:seWord12 33.6s ${s(v.w?.d)} infinite`)}>
                      <span style={cssToObj(`display:inline-block;animation:seWordType12 33.6s ${s(v.w?.d)} infinite`)}>{t(v.w?.t)}</span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '2px',
                          height: '18px',
                          marginLeft: '2px',
                          verticalAlign: '-3px',
                          background: '#F7C032',
                          animation: 'seCaret 1s steps(1) infinite',
                        }}
                      ></span>
                    </span>
                  </React.Fragment>
                ))(v2);
              })}
              </>
            }
          />
          {'\n      '}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '620px' }}>
            {'\n        '}
            {(Array.isArray(v.heroBtns) ? v.heroBtns : []).map((__it: any, __i: number) => {
              const v2 = { ...v, b: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  {'\n          '}
                  <a
                    href={v.b?.href}
                    onClick={v.b?.go}
                    target={v.b?.target}
                    style={cssToObj(
                      `display:flex;align-items:center;gap:12px;height:52px;box-sizing:border-box;padding:0 16px;border-radius:10px;background:${s(v.b?.bg)};border:1.5px solid ${s(v.b?.bd)};color:${s(v.b?.ink)};font-weight:600;font-size:15px;transition:transform .2s,box-shadow .2s,border-color .2s`,
                    )}
                    className={cx(undefined, 'scp-5861bbd1')}
                  >
                    {'\n            '}
                    <span
                      style={cssToObj(
                        `display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:${s(v.b?.iconBg)};flex:none`,
                      )}
                    >
                      {'\n              '}
                      {v.b?.iSearch ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                            <circle cx="11" cy="11" r="7"></circle>
                            <path d="m20 20-3.5-3.5"></path>
                          </svg>
                        </>
                      ) : null}
                      {'\n              '}
                      {v.b?.iTag ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2">
                            <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"></path>
                            <circle cx="7.5" cy="7.5" r="1.5"></circle>
                          </svg>
                        </>
                      ) : null}
                      {'\n              '}
                      {v.b?.iWrench ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                          </svg>
                        </>
                      ) : null}
                      {'\n              '}
                      {v.b?.iWa ? (
                        <>
                          <span
                            style={{
                              display: 'block',
                              width: '16px',
                              height: '16px',
                              background: '#F7C032',
                              WebkitMask: 'url(/icons/whatsapp.svg) center / contain no-repeat',
                              mask: 'url(/icons/whatsapp.svg) center / contain no-repeat',
                            }}
                          ></span>
                        </>
                      ) : null}
                      {'\n            '}
                    </span>
                    {'\n            '}
                    <span style={{ flex: '1', whiteSpace: 'nowrap' }}>{t(v.b?.label)}</span>
                    {'\n            '}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                    {'\n          '}
                  </a>
                  {'\n        '}
                </React.Fragment>
              ))(v2);
            })}
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
            {'\n        '}
            {(Array.isArray(v.trust) ? v.trust : []).map((__it: any, __i: number) => {
              const v2 = { ...v, t: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <span
                    className="se-tick-txt"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#D5D7DA', whiteSpace: 'nowrap', animationDelay: __i * 0.8 + 's' }}
                  >
                    <span
                      className="se-tick-dot"
                      style={{
                        animationDelay: __i * 0.8 + 's',
                        display: 'grid',
                        placeItems: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(247,192,50,.14)',
                        boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.5)',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="3">
                        <path d="M5 12l5 5L20 7"></path>
                      </svg>
                      {/* 14 Oct §05 E: the lit check is a separate graphite layer that fades with the light, so the tick never flashes */}
                      <svg className="se-tick-on" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="3" style={{ animationDelay: __i * 0.8 + 's' }} aria-hidden="true">
                        <path d="M5 12l5 5L20 7"></path>
                      </svg>
                    </span>
                    {t(v.t)}
                  </span>
                </React.Fragment>
              ))(v2);
            })}
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n\n    '}
        <div
          ref={v.railRef}
          style={{
            position: 'absolute',
            left: '0',
            top: '860px',
            width: '1440px',
            height: '170px',
            zIndex: '5',
            display: 'grid',
            gridTemplateColumns: '270px minmax(0,1fr) 420px',
            background: 'linear-gradient(180deg,#2E3033 0%,#1E2022 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1)',
          }}
        >
          {'\n      '}
          <div style={{ position: 'absolute', left: '0', right: '0', top: '0', height: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: '40%',
                height: '100%',
                background: 'linear-gradient(90deg,transparent,#F7C032,#FFDB6E,transparent)',
                animation: 'seRun 3.5s linear infinite',
              }}
            ></div>
          </div>
          {'\n      '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 24px 0 48px',
              borderRight: '1px solid rgba(255,255,255,.08)',
            }}
          >
            {'\n        '}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.14em',
                color: '#F7C032',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#F7C032',
                  animation: 'seBlinkDot 1.2s steps(1) infinite',
                }}
              ></span>
              BRAND STOCK · LIVE
            </span>
            {'\n        '}
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '20px', lineHeight: '1.2' }}>
              Parts for every brand you fix.
            </span>
            {'\n        '}
            <span style={{ fontSize: '13px', color: '#C9CBCE' }}>Hover a brand · sample stock</span>
            {'\n      '}
          </div>
          {'\n      '}
          <div
            style={{
              overflow: 'hidden',
              minWidth: '0',
              WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 7%,#000 88%,transparent)',
              maskImage: 'linear-gradient(90deg,transparent,#000 7%,#000 88%,transparent)',
            }}
          >
            {'\n        '}
            <div
              style={cssToObj(
                `display:flex;width:max-content;height:100%;animation:seRail3 47.3s linear infinite;animation-play-state:${s(v.railPlay)}`,
              )}
            >
              {'\n          '}
              {(Array.isArray(v.rail) ? v.rail : []).map((__it: any, __i: number) => {
                const v2 = { ...v, b: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    {'\n            '}
                    <div
                      onMouseEnter={v.b?.enter}
                      onMouseLeave={v.b?.leave}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '0 28px',
                        borderInlineEnd: '1px solid rgba(255,255,255,.07)',
                        cursor: 'pointer',
                      }}
                    >
                      {'\n              '}
                      <div
                        style={cssToObj(
                          `height:30px;display:flex;align-items:center;filter:${s(v.b?.glow)};transform:translateY(${s(v.b?.lift)}px);transition:transform .2s,filter .2s`,
                        )}
                      >
                        <SEBrandLogo brand={v.b?.id} color={v.b?.color} h="28" />
                      </div>
                      {'\n              '}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                          {(Array.isArray(v.b?.bars) ? v.b?.bars : []).map((__it: any, __i: number) => {
                            const v2 = { ...v, x: __it, $index: __i };
                            return ((v: Vals) => (
                              <React.Fragment key={__i}>
                                <span style={cssToObj(`width:4px;height:${s(v.x?.h)}px;border-radius:1px;background:${s(v.x?.c)}`)}></span>
                              </React.Fragment>
                            ))(v2);
                          })}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', color: '#E4E5E7' }}>
                          <span data-count={v.b?.raw}>0</span>
                          {' in stock'}
                        </span>
                      </span>
                      {'\n            '}
                    </div>
                    {'\n          '}
                  </React.Fragment>
                ))(v2);
              })}
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n      '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '14px',
              padding: '0 48px 0 30px',
              borderLeft: '1px solid rgba(255,255,255,.08)',
            }}
          >
            {'\n        '}
            <span style={{ display: 'flex', alignItems: 'baseline', gap: '12px', whiteSpace: 'nowrap' }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '38px',
                  letterSpacing: '-.03em',
                  lineHeight: '1',
                  color: '#F7C032',
                  textShadow: '0 0 24px rgba(247,192,50,.4)',
                }}
                data-count={v.totalRaw}
              >
                0
              </span>
              <span style={{ fontSize: '14px', lineHeight: '1.3', color: '#E4E5E7' }}>
                parts in stock
                <br />
                {t(v.brandCount)}
                {' brands · '}
                {t(v.modelCount)}
                {' models'}
              </span>
            </span>
            {'\n        '}
            <div style={{ display: 'flex', gap: '8px' }}>
              {'\n          '}
              <button
                onClick={v.openFmp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(255,255,255,.4)',
                  background: 'transparent',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'border-color .2s',
                }}
                className={cx(undefined, 'scp-71e4b6d9')}
              >
                View all brands
              </button>
              {'\n          '}
              <a
                href="#offer"
                onClick={v.goOffer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '36px',
                  boxSizing: 'border-box',
                  padding: '0 14px',
                  borderRadius: '10px',
                  background: '#F7C032',
                  color: '#26282B',
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                }}
                className={cx(undefined, 'scp-dfd1e816')}
              >
                Browse all products
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n\n    '}
        {v.hasHover ? (
          <>
            {'\n      '}
            <div
              onMouseEnter={v.panelEnter}
              onMouseLeave={v.panelLeave}
              style={cssToObj(
                `position:absolute;left:${s(v.panel?.x)}px;top:620px;width:320px;box-sizing:border-box;z-index:7;display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:16px;background:rgba(26,27,29,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(247,192,50,.55);box-shadow:0 0 40px rgba(247,192,50,.22),0 24px 48px rgba(0,0,0,.45);animation:seRise .25s cubic-bezier(.2,.8,.2,1)`,
              )}
            >
              {'\n        '}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SEBrandLogo brand={v.panel?.id} color="#FFFFFF" h="24" />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#F7C032', whiteSpace: 'nowrap' }}>
                  {t(v.panel?.stock)}
                  {' in stock'}
                </span>
              </div>
              {'\n        '}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,.06)',
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#9DA1A6' }}>
                    MODELS
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                    {t(v.panel?.models)}
                  </span>
                </span>
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,.06)',
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#9DA1A6' }}>
                    PART LINES
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '18px' }}>{t(v.panel?.skus)}</span>
                </span>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(Array.isArray(v.panel?.top) ? v.panel?.top : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, t: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#D5D7DA' }}>
                        <span>{t(v.t?.name)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{t(v.t?.n)}</span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
              </div>
              {'\n        '}
              <button
                onClick={v.panel?.go}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '36px',
                  padding: '0 14px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#F7C032',
                  color: '#26282B',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <span>
                  {'Find '}
                  {t(v.panel?.name)}
                  {' parts'}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </button>
              {'\n      '}
            </div>
            {'\n    '}
          </>
        ) : null}
        {'\n  '}
      </div>
    </section>
  );
}
