// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Story". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';

/** Issue 4: fine film grain instead of grids, stripes and tiles. */
const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

export default function Story({ v }: { v: Vals }) {
  return (
    <section
      id="story"
      ref={v.storyRef}
      data-tone="light"
      data-screen-label="11 Story and branches"
      style={{ position: 'relative', overflow: 'hidden', background: '#F2F3F4', padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)' }}
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
          right: '-200px',
          top: '-200px',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side,rgba(255,219,110,.42),rgba(242,243,244,0))',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {'\n    '}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
            {'\n        '}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.14em',
                color: '#5E6064',
              }}
            >
              <span style={{ width: '28px', height: '2px', background: '#F7C032' }}></span>OUR STORY · FIRMWARE HISTORY
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
              More than 20 years in Deira. Same management since day one.
            </h2>
            {'\n      '}
          </div>
          {'\n      '}
          <a
            href="#story"
            onClick={v.story?.more}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1.5px solid #1A1B1D',
              fontSize: '15px',
              fontWeight: '600',
              color: '#1A1B1D',
            }}
            className={cx(undefined, 'scp-cbf0b285')}
          >
            Read our story
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6"></path>
            </svg>
          </a>
          {'\n    '}
        </div>
        {'\n    '}
        <div
          style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '14px', paddingTop: '34px' }}
        >
          {'\n      '}
          <div
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              top: '12px',
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(26,27,29,.12)',
            }}
          ></div>
          {'\n      '}
          <div
            style={cssToObj(
              `position:absolute;left:0;top:12px;height:3px;border-radius:2px;width:${s(v.story?.fill)};background-image:linear-gradient(90deg,#C9921A,#F7C032 40%,#FFF4D1 50%,#F7C032 60%,#C9921A);background-size:200px 3px;animation:seFlowBg 1.4s linear infinite;box-shadow:0 0 12px rgba(247,192,50,.7);transition:width 2.2s cubic-bezier(.2,.8,.2,1)`,
            )}
          ></div>
          {'\n      '}
          {(Array.isArray(v.story?.items) ? v.story?.items : []).map((__it: any, __i: number) => {
            const v2 = { ...v, h: __it, $index: __i };
            return ((v: Vals) => (
              <React.Fragment key={__i}>
                {'\n        '}
                <div
                  style={cssToObj(
                    `position:relative;display:flex;flex-direction:column;gap:10px;padding:20px;border-radius:16px;background:${s(v.h?.bg)};color:${s(v.h?.ink)};box-shadow:${s(v.h?.sh)};opacity:${s(v.h?.o)};transform:translateY(${s(v.h?.y)}px);transition:opacity .5s ${s(v.h?.delay)},transform .5s cubic-bezier(.2,.8,.2,1) ${s(v.h?.delay)}`,
                  )}
                >
                  {'\n          '}
                  <span
                    style={cssToObj(
                      `position:absolute;left:20px;top:-29px;width:16px;height:16px;border-radius:50%;background:${s(v.h?.dot)};box-shadow:0 0 0 3px #F2F3F4,0 0 0 4.5px ${s(v.h?.ring)};transition:background .4s ${s(v.h?.delay)};animation:${s(v.h?.nodeAnim)}`,
                    )}
                  ></span>
                  {'\n          '}
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '12px',
                    }}
                  >
                    <span
                      style={cssToObj(`padding:3px 7px;border-radius:6px;background:${s(v.h?.vBg)};color:${s(v.h?.vInk)};font-weight:600`)}
                    >
                      {t(v.h?.v)}
                    </span>
                    <span style={{ opacity: '.75' }}>{t(v.h?.years)}</span>
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '18px', lineHeight: '1.2' }}>
                    {t(v.h?.title)}
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', lineHeight: '1.45', opacity: '.85' }}>{t(v.h?.d)}</span>
                  {'\n          '}
                  <span
                    style={cssToObj(
                      `margin-top:auto;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;color:${s(v.h?.stC)}`,
                    )}
                  >
                    {t(v.h?.st)}
                  </span>
                  {'\n        '}
                </div>
                {'\n      '}
              </React.Fragment>
            ))(v2);
          })}
          {'\n    '}
        </div>
        {'\n    '}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: '20px' }}>
          {'\n      '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(150deg,#3D3E3F,#1A1B1D 75%)',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,.10),0 24px 64px rgba(0,0,0,.14)',
              minHeight: '330px',
            }}
          >
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '26px' }}>
              {'\n          '}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  letterSpacing: '.12em',
                  color: '#F7C032',
                }}
              >
                <span style={{ position: 'relative', width: '8px', height: '8px' }}>
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)}`)}></span>
                  <span
                    style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)};animation:${s(v.st?.ping)}`)}
                  ></span>
                </span>
                BRANCH 01 · LIVE
              </span>
              {'\n          '}
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '26px', letterSpacing: '-.02em' }}>
                Dubai · Deira
              </span>
              {'\n          '}
              <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#D5D7DA' }}>
                {String(v.$facts?.contact?.address ?? '')}
                <br />
                {'Plus Code '}
                {String(v.$facts?.contact?.plusCode ?? '')}
              </span>
              {'\n          '}
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,.06)',
                  fontSize: '14px',
                }}
              >
                <span style={{ fontWeight: '600' }}>{t(v.st?.short)}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#C9CBCE' }}>
                  {'Today · '}
                  {t(v.todayHours)}
                </span>
              </span>
              {'\n          '}
              <a
                href={v.dirLink}
                target="_blank"
                rel="noopener"
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  background: '#F7C032',
                  color: '#1A1B1D',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                className={cx(undefined, 'scp-44ed8c98')}
              >
                Get directions
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M7 17 17 7M9 7h8v8"></path>
                </svg>
              </a>
              {'\n          '}
              <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <a
                  href={v.visit?.wa}
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '44px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,.35)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                  className={cx(undefined, 'scp-9ee067bf')}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '15px',
                      height: '15px',
                      background: '#FFFFFF',
                      WebkitMask: 'url(https://cdn.simpleicons.org/whatsapp/000000) center / contain no-repeat',
                      mask: 'url(https://cdn.simpleicons.org/whatsapp/000000) center / contain no-repeat',
                    }}
                  ></span>
                  WhatsApp
                </a>
                <a
                  href={`tel:${s(v.$facts?.contact?.storeTel)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '44px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,.35)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                  className={cx(undefined, 'scp-9ee067bf')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"></path>
                  </svg>
                  Call
                </a>
              </span>
              {'\n        '}
            </div>
            {'\n        '}
            <iframe
              data-src={`https://www.google.com/maps?q=${s(v.$facts?.contact?.mapsQuery)}&z=16&output=embed`}
              referrerPolicy="no-referrer-when-downgrade"
              title="Sam Electronics, Al Murar, Deira"
              loading="lazy"
              style={{ width: '100%', height: '100%', minHeight: '330px', border: '0', display: 'block' }}
            ></iframe>
            {'\n      '}
          </div>
          {'\n      '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.06)',
              minHeight: '330px',
            }}
          >
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '26px' }}>
              {'\n          '}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  letterSpacing: '.12em',
                  color: '#5E6064',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#F7C032',
                    animation: 'seBlinkDot 1.6s steps(1) infinite',
                  }}
                ></span>
                BRANCH 02 · MADRID
              </span>
              {'\n          '}
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '26px', letterSpacing: '-.02em' }}>
                {String(v.$facts?.madrid?.name ?? '')}
              </span>
              {'\n          '}
              <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#3D3E3F' }}>
                Our first branch in Europe, in the Plaza Mayor district of Madrid, Spain.
              </span>
              {'\n          '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.1em', color: '#3D3E3F' }}>
                  {String(v.$facts?.madrid?.openingCaps ?? '')}
                </span>
                <span style={{ position: 'relative', height: '6px', borderRadius: '3px', background: '#E4E5E7', overflow: 'hidden' }}>
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      bottom: '0',
                      left: '0',
                      width: '30%',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg,rgba(247,192,50,0),#F7C032,rgba(247,192,50,0))',
                      animation: 'seRun 2.4s linear infinite',
                    }}
                  ></span>
                </span>
              </span>
              {'\n          '}
              <button
                onClick={v.story?.notify}
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #1A1B1D',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1A1B1D',
                  cursor: 'pointer',
                }}
                className={cx(undefined, 'scp-c54aea0f')}
              >
                Tell me when it opens
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                </svg>
              </button>
              {'\n        '}
            </div>
            {'\n        '}
            <div
              data-replay="1"
              style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#EEF2F6',
                backgroundImage:
                  'linear-gradient(rgba(58,90,140,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(58,90,140,.12) 1px,transparent 1px),linear-gradient(rgba(58,90,140,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(58,90,140,.06) 1px,transparent 1px)',
                backgroundSize: '60px 60px,60px 60px,12px 12px,12px 12px',
              }}
            >
              {'\n          '}
              <svg
                viewBox="0 0 400 260"
                preserveAspectRatio="xMidYMid meet"
                style={{ position: 'absolute', left: '4%', top: '6%', width: '92%', height: '88%' }}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M20 196 H380"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.8"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M40 196 V70 H360 V196"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.6"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0.1s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M40 70 L60 54 H340 L360 70"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.4"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0.25s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M150 54 V34 H250 V54"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.4"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0.35s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M150 34 L160 20 L170 34 M230 34 L240 20 L250 34"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.4"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0.45s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M40 104 H360 M40 132 H360 M40 160 H360"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0.5s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M52 196 V178 A12 12 0 0 1 76 178 V196 M86 196 V178 A12 12 0 0 1 110 178 V196 M120 196 V178 A12 12 0 0 1 144 178 V196 M154 196 V178 A12 12 0 0 1 178 178 V196 M188 196 V178 A12 12 0 0 1 212 178 V196 M222 196 V178 A12 12 0 0 1 246 178 V196 M256 196 V178 A12 12 0 0 1 280 178 V196 M290 196 V178 A12 12 0 0 1 314 178 V196 M324 196 V178 A12 12 0 0 1 348 178 V196 "
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.2"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 0.7s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M52 96 V78 H64 V96 Z M82.5 96 V78 H94.5 V96 Z M113 96 V78 H125 V96 Z M143.5 96 V78 H155.5 V96 Z M174 96 V78 H186 V96 Z M204.5 96 V78 H216.5 V96 Z M235 96 V78 H247 V96 Z M265.5 96 V78 H277.5 V96 Z M296 96 V78 H308 V96 Z M326.5 96 V78 H338.5 V96 Z M52 124 V106 H64 V124 Z M82.5 124 V106 H94.5 V124 Z M113 124 V106 H125 V124 Z M143.5 124 V106 H155.5 V124 Z M174 124 V106 H186 V124 Z M204.5 124 V106 H216.5 V124 Z M235 124 V106 H247 V124 Z M265.5 124 V106 H277.5 V124 Z M296 124 V106 H308 V124 Z M326.5 124 V106 H338.5 V124 Z M52 152 V134 H64 V152 Z M82.5 152 V134 H94.5 V152 Z M113 152 V134 H125 V152 Z M143.5 152 V134 H155.5 V152 Z M174 152 V134 H186 V152 Z M204.5 152 V134 H216.5 V152 Z M235 152 V134 H247 V152 Z M265.5 152 V134 H277.5 V152 Z M296 152 V134 H308 V152 Z M326.5 152 V134 H338.5 V152 Z "
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="0.9"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 1s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M49 96 H67 M79.5 96 H97.5 M110 96 H128 M140.5 96 H158.5 M171 96 H189 M201.5 96 H219.5 M232 96 H250 M262.5 96 H280.5 M293 96 H311 M323.5 96 H341.5 M49 124 H67 M79.5 124 H97.5 M110 124 H128 M140.5 124 H158.5 M171 124 H189 M201.5 124 H219.5 M232 124 H250 M262.5 124 H280.5 M293 124 H311 M323.5 124 H341.5 M49 152 H67 M79.5 152 H97.5 M110 152 H128 M140.5 152 H158.5 M171 152 H189 M201.5 152 H219.5 M232 152 H250 M262.5 152 H280.5 M293 152 H311 M323.5 152 H341.5 "
                  pathLength="1"
                  stroke="#C9921A"
                  strokeWidth="0.8"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 1.3s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M186 236 V214 H214 V236 M192 214 V206 Q200 196 208 206 V214"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1.2"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 1.6s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M196 200 L200 190 L206 196"
                  pathLength="1"
                  stroke="#3D3E3F"
                  strokeWidth="1"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 1.8s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M20 236 H380"
                  pathLength="1"
                  stroke="rgba(61,62,63,.5)"
                  strokeWidth="1"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 1.7s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                <path
                  d="M60 236 L120 200 M340 236 L280 200"
                  pathLength="1"
                  stroke="rgba(61,62,63,.4)"
                  strokeWidth="0.8"
                  strokeDasharray="1"
                  style={{ animation: 'bpDraw 1.4s 1.9s cubic-bezier(.45,0,.55,1) both' }}
                ></path>
                {'\n            '}
                <g style={{ animation: 'bpIn .5s 2.3s cubic-bezier(.2,.8,.2,1) both' }}>
                  <path d="M300 54 L322 30 H396" stroke="#C9921A" strokeWidth="1"></path>
                  <text x="300" y="25" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#3D3E3F">
                    Plaza Mayor · Madrid
                  </text>
                  <path d="M70 196 L46 222 H6" stroke="#C9921A" strokeWidth="1"></path>
                  <text x="6" y="218" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#3D3E3F">
                    Branch 02
                  </text>
                  <circle cx="300" cy="54" r="2.5" fill="#F7C032"></circle>
                  <circle cx="70" cy="196" r="2.5" fill="#F7C032"></circle>
                </g>
                {'\n          '}
              </svg>
              {'\n          '}
              <span
                style={{
                  position: 'absolute',
                  right: '10%',
                  bottom: '12%',
                  padding: '8px 14px',
                  border: '3px solid #26282B',
                  borderRadius: '6px',
                  color: '#26282B',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '18px',
                  letterSpacing: '.14em',
                  opacity: '.85',
                  transform: 'rotate(-12deg)',
                  animation: 'bpStamp .45s 2.7s cubic-bezier(.2,.8,.2,1) both',
                }}
              >
                COMING SOON
              </span>
              {'\n          '}
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '10px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '10px',
                  letterSpacing: '.14em',
                  color: '#5E6064',
                }}
              >
                SHEET 02 · ELEVATION · NOT TO SCALE
              </span>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
