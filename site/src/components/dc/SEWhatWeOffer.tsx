// Converted from design/project/SE What We Offer.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import InfoTip from '@/components/home/InfoTip';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SEWhatWeOffer.logic.js';

function render(v: Vals) {
  return (
    <>
      <section
        id="families"
        ref={v.root}
        data-tone="light"
        data-screen-label="What we offer"
        style={{
          position: 'relative',
          isolation: 'isolate',
          zIndex: '0',
          background: '#F2F3F4',
          color: '#26282B',
          fontFamily: 'Inter,sans-serif',
        }}
      >
        {'\n  '}
        <div style={{ position: 'absolute', inset: '0', zIndex: '1', pointerEvents: 'none' }}>
          <div ref={v.host} style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100vh', overflow: 'hidden' }}></div>
        </div>
        {'\n\n  '}
        <div data-w="A" style={{ position: 'relative', padding: '120px 0 0' }}>
          {'\n    '}
          <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(60% 50% at 50% 60%,#FAFAF8 0%,#F2F3F4 70%)' }}></div>
          {'\n    '}
          {/* R6 §06 A: no blend from the teardown. The showroom has its own light: a very large faint circuit pattern (5%),
              soft spot pools from above, and the fine grain below */}
          <div className="wo-circuit" aria-hidden="true"></div>
          <div className="wo-spots" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              inset: '0',
              opacity: '.035',
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              left: '-10%',
              top: '80px',
              width: '60%',
              height: '70%',
              background: 'radial-gradient(closest-side,rgba(255,236,196,.55),rgba(255,236,196,0))',
              pointerEvents: 'none',
            }}
          ></div>
          {'\n    '}
          <svg
            viewBox="0 0 60 1000"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              left: '0',
              top: '180px',
              width: '60px',
              height: '900px',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
            fill="none"
          >
            {'\n      '}
            <path
              d="M22 0 V300 L38 340 V700 L22 740 V1000"
              stroke="rgba(38,40,43,.1)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            ></path>
            {'\n      '}
            <path
              d="M22 0 V300 L38 340 V700 L22 740 V1000"
              stroke="#F7C032"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="120 1480"
              style={{ opacity: '.5', animation: 'wwoFlow 14s linear infinite' }}
            ></path>
            {'\n      '}
            <path
              d="M22 0 V300 L38 340 V700 L22 740 V1000"
              stroke="#FFF4D1"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="40 1560"
              style={{ opacity: '.8', animation: 'wwoFlow 14s -0.4s linear infinite' }}
            ></path>
            {'\n    '}
          </svg>
          {'\n    '}
          <svg
            viewBox="0 0 60 1000"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              right: '0',
              top: '180px',
              width: '60px',
              height: '900px',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
            fill="none"
          >
            {'\n      '}
            <path
              d="M38 0 V200 L22 240 V560 L38 600 V1000"
              stroke="rgba(38,40,43,.1)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            ></path>
            {'\n      '}
            <path
              d="M38 0 V200 L22 240 V560 L38 600 V1000"
              stroke="#F7C032"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="150 1450"
              style={{ opacity: '.5', animation: 'wwoFlow 19s -6s linear infinite' }}
            ></path>
            {'\n    '}
          </svg>
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              left: '15px',
              top: '477px',
              width: '14px',
              height: '14px',
              boxSizing: 'border-box',
              borderRadius: '50%',
              border: '1.5px solid rgba(38,40,43,.3)',
              animation: 'wwoNode 4s ease-in-out infinite',
            }}
          ></span>
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              right: '15px',
              top: '377px',
              width: '14px',
              height: '14px',
              boxSizing: 'border-box',
              borderRadius: '50%',
              border: '1.5px solid rgba(38,40,43,.3)',
              animation: 'wwoNode 5s 1s ease-in-out infinite',
            }}
          ></span>
          {'\n\n    '}
          <div
            style={{
              position: 'relative',
              width: '1272px',
              maxWidth: 'calc(100% - 48px)',
              margin: '0 auto',
              boxSizing: 'border-box',
              paddingTop: '44px', /* Urgent 3: no fixed 900px height (the cards spilled under the service boxes) */
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {'\n      '}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '40px' }}>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {'\n          '}
                <span
                  data-w="eb"
                  style={{
                    height: '14px',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '.14em',
                    color: '#F7C032',
                    whiteSpace: 'nowrap',
                  }}
                >
                  WHAT WE OFFER
                </span>
                {'\n          '}
                <h2
                  style={{
                    margin: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '700',
                    fontSize: '46px',
                    lineHeight: '1.04',
                    letterSpacing: '-.03em',
                  }}
                >
                  {'\n            '}
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '4px', marginBottom: '-4px' }}>
                    <span data-w="hl0" style={{ display: 'block' }}>
                      Every part. Every service.
                    </span>
                  </span>
                  {'\n            '}
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '4px', marginBottom: '-4px' }}>
                    <span data-w="hl1" style={{ display: 'block', color: 'rgba(38,40,43,.6)' }}>
                      One shop in Deira.
                    </span>
                  </span>
                  {'\n          '}
                </h2>
                {'\n        '}
              </div>
              {'\n        '}
              <p
                data-w="intro"
                style={{ margin: '0 0 6px', maxWidth: '360px', fontSize: '16px', lineHeight: '1.5', color: '#3D3E3F', textWrap: 'pretty' }}
              >
                Eight part families in every grade, plus repairs, trade prices and shipping worldwide.
              </p>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ position: 'relative' }}>
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4,minmax(0,300px))',
                  gridTemplateRows: '410px 410px',
                  gap: '24px',
                  justifyContent: 'space-between',
                }}
              >
                {'\n          '}
                {(Array.isArray(v.fam) ? v.fam : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, f: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      {'\n            '}
                      <div
                        data-w={`cb${s(v.f?.i)}`}
                        className="wo-card"
                        style={{ position: 'relative', borderRadius: '16px' }}
                      >
                        {/* R6 §06 B: a graphite card with a lit stage: a soft yellow rim light at the back, a glossy black floor */}
                        {/* Urgent 3: the part stands still in THE pose (carton behind, product in front), perfectly lit; no
                            turntable, no glowing ovals */}
                        <div className="wo-stage" />
                        <img data-w={`fb${s(v.f?.i)}`} alt="" className="wo-pose" />
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
                  position: 'relative',
                  zIndex: '2',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4,minmax(0,300px))',
                  gridTemplateRows: '410px 410px',
                  gap: '24px',
                  justifyContent: 'space-between',
                }}
              >
                {'\n          '}
                {(Array.isArray(v.fam) ? v.fam : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, f: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      {'\n            '}
                      <div
                        data-w={`cf${s(v.f?.i)}`}
                        className="wo-cf"
                        onClick={v.f?.go}
                        onMouseEnter={v.f?.enter}
                        onMouseLeave={v.f?.leave}
                      >
                        <div data-w={`slot${s(v.f?.i)}`} style={{ position: 'absolute', left: '40px', right: '40px', top: '4px', height: '162px' }}></div>
                        <div className="wo-body">
                          <span className="wo-name">{t(v.f?.name)}</span>
                          <span className="wo-meta">
                            <span data-w={`n${s(v.f?.i)}`}>{t(v.f?.stock)}</span>
                            {' in stock · '}
                            {t(v.f?.models)}
                            {' models'}
                          </span>
                          <span data-w={`ch${s(v.f?.i)}`} className="wo-chips">
                            {(Array.isArray(v.f?.chips) ? v.f?.chips : []).map((c: any, j: number) => (
                              <span key={j} className={'wo-chip' + (c.k === 'maker' ? ' m' : '')}>
                                {String(c.n)}
                                <InfoTip name={c.n} kind={c.k} />
                              </span>
                            ))}
                          </span>
                          <span className="wo-foot">
                            <span className="wo-from">
                              {'from '}
                              <b>
                                {'AED '}
                                {t(v.f?.min)}
                              </b>
                            </span>
                            <a href="#shop" className="wo-shop" onClick={v.f?.go}>
                              {t(v.f?.shop)}
                              <svg data-w={`ar${s(v.f?.i)}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <path d="M5 12h14M13 6l6 6-6 6"></path>
                              </svg>
                            </a>
                          </span>
                        </div>
                      </div>
                      {'\n          '}
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
        {'\n\n  '}
        <div data-w="SV" className="wwo-boxes">
<div data-w="R" style={{ position: 'relative', height: '85vh', minHeight: '700px', color: '#FFFFFF', overflow: 'hidden' }}>
          {'\n    '}
          <div style={{ position: 'absolute', inset: '0', background: '#F2F3F4' }}></div>
          {'\n    '}
          <div
            data-w="Rwipe"
            style={{
              position: 'absolute',
              inset: '0',
              background: 'radial-gradient(55% 70% at 70% 52%,#3E4044 0%,#33353A 45%,#2A2C2F 100%)',
            }}
          >
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '44%',
                right: '0',
                bottom: '6%',
                height: '42%',
                background: 'radial-gradient(50% 45% at 50% 55%,rgba(88,90,96,.75),rgba(42,44,47,0) 100%)',
              }}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '30%',
                right: '-10%',
                top: '-20%',
                height: '80%',
                background: 'radial-gradient(closest-side,rgba(255,250,236,.08),rgba(255,250,236,0))',
              }}
            ></div>
            {'\n      '}
            <canvas
              data-w="Rdust"
              width="760"
              height="620"
              style={{ position: 'absolute', right: '0', top: '0', width: '760px', height: '620px' }}
            ></canvas>
            {'\n      '}
            <svg className="wo-side" aria-hidden="true"
              viewBox="0 0 60 1000"
              preserveAspectRatio="none"
              style={{ position: 'absolute', left: '0', top: '0', width: '60px', height: '100%', overflow: 'visible' }}
              fill="none"
            >
              {'\n        '}
              <path d="M24 0 V420 L40 460 V1000" stroke="rgba(255,255,255,.09)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
              {'\n        '}
              <path className="wo-flow"
                d="M24 0 V420 L40 460 V1000"
                stroke="#F7C032"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="130 1470"
                style={{ opacity: '.55', animation: 'wwoFlow 12s -3s linear infinite' }}
              ></path>
              {'\n      '}
            </svg>
            {'\n      '}
            <svg className="wo-side" aria-hidden="true"
              viewBox="0 0 60 1000"
              preserveAspectRatio="none"
              style={{ position: 'absolute', right: '0', top: '0', width: '60px', height: '100%', overflow: 'visible' }}
              fill="none"
            >
              {'\n        '}
              <path d="M36 0 V180 L20 220 V1000" stroke="rgba(255,255,255,.09)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
              {'\n        '}
              <path className="wo-flow"
                d="M36 0 V180 L20 220 V1000"
                stroke="#F7C032"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="100 1500"
                style={{ opacity: '.55', animation: 'wwoFlow 16s linear infinite' }}
              ></path>
              {'\n      '}
            </svg>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              zIndex: '2',
              width: '1272px',
              maxWidth: 'calc(100% - 48px)',
              height: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(0,520px) minmax(0,1fr)',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {'\n        '}
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  data-w="Reb"
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '.14em',
                    color: '#F7C032',
                  }}
                >
                  REPAIR LAB
                </span>
              </span>
              {'\n        '}
              <h3
                style={{
                  margin: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '64px',
                  lineHeight: '1.02',
                  letterSpacing: '-.04em',
                }}
              >
                {'\n          '}
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '6px', marginBottom: '-6px' }}>
                  <span data-w="Rh0" style={{ display: 'block' }}>
                    Broken today.
                  </span>
                </span>
                {'\n          '}
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '6px', marginBottom: '-6px' }}>
                  <span data-w="Rh1" style={{ display: 'block', color: '#F7C032' }}>
                    Fixed today.
                  </span>
                </span>
                {'\n        '}
              </h3>
              {'\n        '}
              <p
                data-w="Rp"
                style={{ margin: '0', maxWidth: '440px', fontSize: '17px', lineHeight: '1.5', color: '#D5D7DA', textWrap: 'pretty' }}
              >
                Screens, batteries, ports: fixed and tested in Deira.
              </p>
              {'\n        '}
              <div
                data-w="Rs"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                  borderTop: '1px solid rgba(255,255,255,.14)',
                  paddingTop: '16px',
                }}
              >
                {'\n          '}
                {(Array.isArray(v.stR) ? v.stR : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, s: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        style={cssToObj(`display:flex;flex-direction:column;gap:6px;padding-left:${s(v.s?.pl)};border-left:${s(v.s?.bl)}`)}
                      >
                        <span
                          style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '30px', letterSpacing: '-.02em' }}
                        >
                          <span data-w={v.s?.id}>{t(v.s?.v)}</span>
                          {t(v.s?.u)}
                        </span>
                        <span
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.08em', color: '#B9BCC0' }}
                        >
                          {t(v.s?.l)}
                        </span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n        '}
              <div data-w="Rb" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {'\n          '}
                <a
                  href="#repair"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '52px',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    borderRadius: '10px',
                    background: '#F7C032',
                    color: '#26282B',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'transform .2s,box-shadow .2s',
                  }}
                  className={cx(undefined, 'wo-btn wo-btn1 scp-6a9c9ea7')}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'rgba(26,27,29,.12)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                  </span>
                  Book a repair
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n          '}
                <a
                  href="#repair"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '52px',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,.35)',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                    transition: 'transform .2s,border-color .2s',
                  }}
                  className={cx(undefined, 'wo-btn scp-8a8c095f')}
                >
                  See repair prices
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div data-w="Rscene" style={{ position: 'relative', height: '560px' }}>
              {'\n        '}
              <div data-w="Rslot" style={{ position: 'absolute', left: '-20px', top: '60px', width: '480px', height: '480px' }}>
                {/* Urgent 3: a still product pose (carton behind, screen in front), no rolling 3D phone */}
                <img className="wo-rpose" src="/assets/pose/apple-sp-480.webp" srcSet="/assets/pose/apple-sp-480.webp 1x, /assets/pose/apple-sp-960.webp 2x" alt="" />
              </div>
              {'\n        '}
              <div
                data-w="Rchk"
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '150px',
                  width: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(26,27,29,.55)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08),0 20px 40px rgba(0,0,0,.25)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {'\n          '}
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#B9BCC0' }}>
                  BENCH TEST
                </span>
                {'\n          '}
                {(Array.isArray(v.chk) ? v.chk : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, c: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '15px',
                          color: '#FFFFFF',
                        }}
                      >
                        <span>{t(v.c?.t)}</span>
                        <span
                          data-w={v.c?.id}
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#F7C032',
                            color: '#26282B',
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
                            <path d="M5 12l5 5L20 7"></path>
                          </svg>
                        </span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n        '}
              <div
                data-w="Rseal"
                style={{
                  position: 'absolute',
                  right: '52px',
                  top: '360px',
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  border: '2.5px solid #F7C032',
                  color: '#F7C032',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '17px',
                  letterSpacing: '.1em',
                  transform: 'rotate(-12deg)',
                  boxShadow: 'inset 0 0 0 5px rgba(42,44,47,1),inset 0 0 0 6.5px rgba(247,192,50,.6)',
                }}
              >
                TESTED
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
        {'\n\n  '}
        <div data-w="W" style={{ position: 'relative', height: '85vh', minHeight: '700px', color: '#26282B', overflow: 'hidden' }}>
          {'\n    '}
          <div style={{ position: 'absolute', inset: '0', background: '#2A2C2F' }}></div>
          {'\n    '}
          <div
            data-w="Wwipe"
            style={{ position: 'absolute', inset: '0', background: '#F7C032' }}
          >
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                opacity: '.035',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            ></div>
            {'\n      '}
            {/* Urgent 3: no grey floor band, no cream glow: one flat brand yellow */}
            {'\n      '}

            {'\n      '}
            <svg className="wo-side" aria-hidden="true"
              viewBox="0 0 60 1000"
              preserveAspectRatio="none"
              style={{ position: 'absolute', right: '0', top: '0', width: '60px', height: '100%', overflow: 'visible' }}
              fill="none"
            >
              {'\n        '}
              <path d="M30 0 V300 L44 340 V1000" stroke="rgba(38,40,43,.12)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
              {'\n        '}
              <path className="wo-flow"
                d="M30 0 V300 L44 340 V1000"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="120 1480"
                style={{ opacity: '.7', animation: 'wwoFlow 13s -5s linear infinite' }}
              ></path>
              {'\n      '}
            </svg>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              zIndex: '2',
              width: '1272px',
              maxWidth: 'calc(100% - 48px)',
              height: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,500px)',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {'\n      '}
            <div data-w="Wscene" style={{ position: 'relative', height: '560px' }}>
              {'\n        '}
              <span
                data-w="Wpsh"
                style={{
                  position: 'absolute',
                  left: '40px',
                  top: '430px',
                  width: '500px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side,rgba(70,54,10,.4),rgba(70,54,10,0))',
                  filter: 'blur(4px)',
                }}
              ></span>
              {'\n        '}
              <div
                data-w="Wpal"
                style={{
                  position: 'absolute',
                  left: '290px',
                  top: '420px',
                  width: '0',
                  height: '0',
                  perspective: '1600px',
                  perspectiveOrigin: '0 -120px',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(-20deg) rotateY(-32deg)',
                  }}
                >
                  {'\n            '}
                  <div style={{ position: 'absolute', left: '0', top: '0', transformStyle: 'preserve-3d' }}>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-205px',
                        top: '0',
                        width: '410px',
                        height: '22px',
                        transform: 'translateZ(65px)',
                        background: 'linear-gradient(180deg,#D9BE90 0%,#C4A474 60%,#A9895C 100%)',
                        boxShadow: 'inset 0 -6px 6px rgba(70,50,20,.25)',
                      }}
                    >
                      <span
                        style={{ position: 'absolute', left: '20px', top: '6px', width: '36px', height: '16px', background: '#5E4A2E' }}
                      ></span>
                      <span
                        style={{ position: 'absolute', left: '187px', top: '6px', width: '36px', height: '16px', background: '#5E4A2E' }}
                      ></span>
                      <span
                        style={{ position: 'absolute', right: '20px', top: '6px', width: '36px', height: '16px', background: '#5E4A2E' }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '0',
                          right: '0',
                          top: '0',
                          height: '6px',
                          background: 'linear-gradient(180deg,#E6CFA6,#CDB083)',
                        }}
                      ></span>
                    </span>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-65px',
                        top: '0',
                        width: '130px',
                        height: '22px',
                        transform: 'rotateY(90deg) translateZ(205px)',
                        background: 'linear-gradient(180deg,#B89A6C,#957650)',
                        boxShadow: 'inset 0 -6px 6px rgba(60,40,15,.3)',
                      }}
                    >
                      <span
                        style={{ position: 'absolute', left: '10px', top: '6px', width: '30px', height: '16px', background: '#4C3B24' }}
                      ></span>
                      <span
                        style={{ position: 'absolute', right: '10px', top: '6px', width: '30px', height: '16px', background: '#4C3B24' }}
                      ></span>
                    </span>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-205px',
                        top: '-65px',
                        width: '410px',
                        height: '130px',
                        transform: 'rotateX(90deg)',
                        background: 'repeating-linear-gradient(90deg,#E2C99C 0 64px,#B79A6A 64px 68px)',
                        boxShadow: 'inset 0 0 30px rgba(90,64,28,.25)',
                      }}
                    ></span>
                    {'\n              '}
                    <span data-w="wrap" style={{ position: 'absolute', left: '0', top: '0', transformStyle: 'preserve-3d' }}>
                      {'\n                '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '-205px',
                          top: '-188px',
                          width: '410px',
                          height: '188px',
                          transform: 'translateZ(66px)',
                          background:
                            'linear-gradient(115deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.28) 30%,rgba(255,255,255,.06) 52%,rgba(255,255,255,.22) 76%,rgba(255,255,255,.05) 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.3)',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          data-w="wsh"
                          style={{
                            position: 'absolute',
                            top: '-40%',
                            bottom: '-40%',
                            left: '0',
                            width: '30%',
                            background: 'linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0))',
                          }}
                        ></span>
                      </span>
                      {'\n                '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '-66px',
                          top: '-188px',
                          width: '132px',
                          height: '188px',
                          transform: 'rotateY(90deg) translateZ(206px)',
                          background: 'linear-gradient(100deg,rgba(255,255,255,.04),rgba(255,255,255,.18) 50%,rgba(255,255,255,.04))',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.22)',
                        }}
                      ></span>
                      {'\n              '}
                    </span>
                    {'\n              '}
                    {(Array.isArray(v.boxes) ? v.boxes : []).map((__it: any, __i: number) => {
                      const v2 = { ...v, b: __it, $index: __i };
                      return ((v: Vals) => (
                        <React.Fragment key={__i}>
                          {'\n                '}
                          <span
                            style={cssToObj(
                              `position:absolute;left:0;top:0;transform-style:preserve-3d;transform:translate3d(${s(v.b?.x)}px,${s(v.b?.y)}px,0)`,
                            )}
                          >
                            {'\n                  '}
                            <span
                              data-w={v.b?.sid}
                              style={{
                                position: 'absolute',
                                left: '-70px',
                                top: '-58px',
                                width: '140px',
                                height: '116px',
                                transform: 'rotateX(90deg) translateZ(-1px)',
                                borderRadius: '8px',
                                background: 'radial-gradient(closest-side,rgba(50,34,10,.45),rgba(50,34,10,0))',
                              }}
                            ></span>
                            {'\n                  '}
                            <span
                              data-w={v.b?.pid}
                              style={{
                                position: 'absolute',
                                left: '-90px',
                                top: '-20px',
                                width: '180px',
                                height: '30px',
                                borderRadius: '50%',
                                background: 'radial-gradient(closest-side,rgba(240,232,214,.9),rgba(240,232,214,0))',
                                opacity: '0',
                                transform: 'translateZ(60px)',
                              }}
                            ></span>
                            {'\n                  '}
                            <span
                              data-w={v.b?.id}
                              style={{ position: 'absolute', left: '0', top: '0', transformStyle: 'preserve-3d', transformOrigin: '0 0 0' }}
                            >
                              {'\n                    '}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '-64px',
                                  top: '-92px',
                                  width: '128px',
                                  height: '92px',
                                  transform: 'translateZ(52px)',
                                  background: 'linear-gradient(180deg,#C9A16B 0%,#BB915B 70%,#A87E4A 100%)',
                                  boxShadow: 'inset 0 0 0 .5px rgba(80,52,18,.5),inset 0 -10px 12px rgba(70,46,14,.22)',
                                }}
                              >
                                {'\n                      '}
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '0',
                                    bottom: '0',
                                    width: '3px',
                                    background: 'repeating-linear-gradient(180deg,#8E6738 0 1.2px,#D7B47E 1.2px 2.4px)',
                                  }}
                                ></span>
                                {'\n                      '}
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '54px',
                                    top: '0',
                                    width: '20px',
                                    height: '26px',
                                    background: 'linear-gradient(180deg,#F7C032,#F7C032)',
                                    boxShadow: 'inset 0 -1px 0 rgba(120,80,0,.3)',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: '2px',
                                      top: '3px',
                                      fontFamily: "'Space Grotesk',sans-serif",
                                      fontWeight: '700',
                                      fontSize: '4px',
                                      letterSpacing: '.06em',
                                      color: '#26282B',
                                      writingMode: 'vertical-rl',
                                    }}
                                  >
                                    SAM ELECTRONICS
                                  </span>
                                </span>
                                {'\n                      '}
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '9px',
                                    bottom: '10px',
                                    width: '40px',
                                    height: '26px',
                                    borderRadius: '2px',
                                    background: '#F7F5F0',
                                    boxShadow: '0 .5px 1px rgba(60,40,10,.35)',
                                  }}
                                >
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: '4px',
                                      top: '3px',
                                      width: '22px',
                                      height: '2px',
                                      background: '#3D3E3F',
                                    }}
                                  ></span>
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: '4px',
                                      right: '4px',
                                      bottom: '4px',
                                      height: '10px',
                                      background:
                                        'repeating-linear-gradient(90deg,#26282B 0 1px,transparent 1px 2px,#26282B 2px 2.6px,transparent 2.6px 4px)',
                                    }}
                                  ></span>
                                </span>
                                {'\n                    '}
                              </span>
                              {'\n                    '}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '-52px',
                                  top: '-92px',
                                  width: '104px',
                                  height: '92px',
                                  transform: 'rotateY(90deg) translateZ(64px)',
                                  background: 'linear-gradient(180deg,#A47B47 0%,#946B3B 70%,#7F5A30 100%)',
                                  boxShadow: 'inset 0 0 0 .5px rgba(60,38,12,.5),inset 0 -10px 12px rgba(50,32,10,.3)',
                                }}
                              >
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '0',
                                    bottom: '0',
                                    width: '3px',
                                    background: 'repeating-linear-gradient(180deg,#6E4E28 0 1.2px,#C49A62 1.2px 2.4px)',
                                  }}
                                ></span>
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '0',
                                    right: '0',
                                    top: '0',
                                    height: '3px',
                                    background: 'repeating-linear-gradient(90deg,#6E4E28 0 1.2px,#C49A62 1.2px 2.4px)',
                                  }}
                                ></span>
                              </span>
                              {'\n                    '}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '-64px',
                                  top: '-144px',
                                  width: '128px',
                                  height: '104px',
                                  transform: 'rotateX(90deg)',
                                  background: 'linear-gradient(135deg,#E0BE88 0%,#D3AE76 100%)',
                                  boxShadow: 'inset 0 0 0 .5px rgba(80,52,18,.45)',
                                }}
                              >
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '0',
                                    right: '0',
                                    top: '51px',
                                    height: '1px',
                                    background: 'rgba(90,60,25,.45)',
                                  }}
                                ></span>
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '54px',
                                    top: '0',
                                    bottom: '0',
                                    width: '20px',
                                    background: 'linear-gradient(90deg,#F2BC33,#FFD45A 50%,#F2BC33)',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: '3px',
                                      top: '6px',
                                      fontFamily: "'Space Grotesk',sans-serif",
                                      fontWeight: '700',
                                      fontSize: '5px',
                                      letterSpacing: '.06em',
                                      color: '#26282B',
                                      writingMode: 'vertical-rl',
                                    }}
                                  >
                                    SAM ELECTRONICS · SAM ELECTRONICS
                                  </span>
                                </span>
                              </span>
                              {'\n                  '}
                            </span>
                            {'\n                '}
                          </span>
                          {'\n              '}
                        </React.Fragment>
                      ))(v2);
                    })}
                    {'\n            '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <div
                data-w="tag"
                style={{ position: 'absolute', left: '600px', top: '40px', width: '130px', height: '260px', transformOrigin: '65px 0' }}
              >
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '64px',
                    top: '0',
                    width: '1.5px',
                    height: '92px',
                    background: 'linear-gradient(180deg,#3D3E3F,#5E6064)',
                  }}
                ></span>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '59px',
                    top: '-6px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%,#D2D5D9,#6E7278)',
                  }}
                ></span>
                {'\n          '}
                <div style={{ position: 'absolute', left: '0', top: '90px', width: '130px', height: '164px', perspective: '600px' }}>
                  {'\n            '}
                  <div data-w="tagf" style={{ position: 'absolute', inset: '0', transformStyle: 'preserve-3d' }}>
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        borderRadius: '10px',
                        background: 'linear-gradient(160deg,#FFFFFF,#EEEBE4)',
                        boxShadow: '0 14px 28px rgba(70,54,10,.3),inset 0 0 0 1px rgba(38,40,43,.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {'\n                '}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#E3AE24',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.35)',
                        }}
                      ></span>
                      {'\n                '}
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '.14em',
                          color: '#5E6064',
                        }}
                      >
                        RETAIL
                      </span>
                      {'\n                '}
                      <span
                        style={{
                          fontFamily: "'Space Grotesk',sans-serif",
                          fontWeight: '700',
                          fontSize: '30px',
                          letterSpacing: '-.02em',
                          color: '#26282B',
                        }}
                      >
                        AED 125
                      </span>
                      {'\n              '}
                    </div>
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        borderRadius: '10px',
                        background: 'linear-gradient(160deg,#3D3E3F,#26282B)',
                        boxShadow: '0 14px 28px rgba(70,54,10,.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {'\n                '}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#E3AE24',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.5)',
                        }}
                      ></span>
                      {'\n                '}
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '.14em',
                          color: '#F7C032',
                        }}
                      >
                        TRADE
                      </span>
                      {'\n                '}
                      <span
                        style={{
                          fontFamily: "'Space Grotesk',sans-serif",
                          fontWeight: '700',
                          fontSize: '30px',
                          letterSpacing: '-.02em',
                          color: '#FFFFFF',
                        }}
                      >
                        AED 98
                      </span>
                      {'\n              '}
                    </div>
                    {'\n            '}
                  </div>
                  {'\n            '}
                  <span
                    data-w="badge"
                    style={{
                      position: 'absolute',
                      right: '-18px',
                      top: '-14px',
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      background: '#26282B',
                      color: '#F7C032',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '15px',
                      boxShadow: '0 6px 14px rgba(0,0,0,.3),inset 0 0 0 2px #F7C032',
                    }}
                  >
                    −22%
                  </span>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <div
                data-w="cnt"
                style={{
                  position: 'absolute',
                  left: '590px',
                  top: '400px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: '#26282B',
                  color: '#FFFFFF',
                  boxShadow: '0 12px 24px rgba(70,54,10,.3)',
                }}
              >
                <span
                  data-w="cntN"
                  style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '600', fontSize: '28px', color: '#F7C032' }}
                >
                  100
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.12em' }}>UNITS</span>
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {'\n        '}
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  data-w="Web"
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '.14em',
                    color: '#26282B',
                  }}
                >
                  WHOLESALE · TRADE
                </span>
              </span>
              {'\n        '}
              <h3
                style={{
                  margin: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '64px',
                  lineHeight: '1.02',
                  letterSpacing: '-.04em',
                  color: '#26282B',
                }}
              >
                {'\n          '}
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '6px', marginBottom: '-6px' }}>
                  <span data-w="Wh0" style={{ display: 'block' }}>
                    Stock up.
                  </span>
                </span>
                {'\n          '}
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '6px', marginBottom: '-6px' }}>
                  <span data-w="Wh1" style={{ display: 'block' }}>
                    Cost down.
                  </span>
                </span>
                {'\n        '}
              </h3>
              {'\n        '}
              <p
                data-w="Wp"
                style={{ margin: '0', maxWidth: '440px', fontSize: '17px', lineHeight: '1.5', color: '#26282B', textWrap: 'pretty' }}
              >
                Trade prices for shops, quoted the same day.
              </p>
              {'\n        '}
              <div
                data-w="Ws"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                  borderTop: '1px solid rgba(38,40,43,.2)',
                  paddingTop: '16px',
                }}
              >
                {'\n          '}
                {(Array.isArray(v.stW) ? v.stW : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, s: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        style={cssToObj(`display:flex;flex-direction:column;gap:6px;padding-left:${s(v.s?.pl)};border-left:${s(v.s?.bl)}`)}
                      >
                        <span
                          style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '30px', letterSpacing: '-.02em' }}
                        >
                          <span data-w={v.s?.id}>{t(v.s?.v)}</span>
                          {t(v.s?.u)}
                        </span>
                        <span
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.08em', color: '#3D3E3F' }}
                        >
                          {t(v.s?.l)}
                        </span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n        '}
              <div data-w="Wb" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {'\n          '}
                <a
                  href="#wholesale"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '52px',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    borderRadius: '10px',
                    background: '#26282B',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                    transition: 'transform .2s,box-shadow .2s',
                  }}
                  className={cx(undefined, 'wo-btn wo-btn1 scp-077cdbd8')}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,.12)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2">
                      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"></path>
                      <circle cx="7.5" cy="7.5" r="1.5"></circle>
                    </svg>
                  </span>
                  Apply for trade prices
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n          '}
                <a
                  href="#wholesale"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '52px',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #26282B',
                    color: '#26282B',
                    fontWeight: '600',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                    transition: 'transform .2s',
                  }}
                  className={cx(undefined, 'wo-btn scp-b08bac3b')}
                >
                  How trade works
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
        {'\n\n  '}
        <div data-w="G" style={{ position: 'relative', height: '85vh', minHeight: '700px', color: '#26282B', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={{ position: 'absolute', inset: '0', background: 'radial-gradient(80% 90% at 40% 45%,#F7C032 55%,#E3AE24 100%)' }}
          ></div>
          {'\n    '}
          <div
            data-w="Gwipe"
            style={{ position: 'absolute', inset: '0', background: 'radial-gradient(60% 60% at 85% 10%,#FFF8EC 0%,#FFFFFF 60%)' }}
          >
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                opacity: '.03',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            ></div>
            {'\n      '}
            <svg className="wo-side" aria-hidden="true"
              viewBox="0 0 60 1000"
              preserveAspectRatio="none"
              style={{ position: 'absolute', left: '0', top: '0', width: '60px', height: '100%', overflow: 'visible' }}
              fill="none"
            >
              {'\n        '}
              <path d="M22 0 V560 L38 600 V1000" stroke="rgba(38,40,43,.1)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
              {'\n        '}
              <path className="wo-flow"
                d="M22 0 V560 L38 600 V1000"
                stroke="#F7C032"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="140 1460"
                style={{ opacity: '.6', animation: 'wwoFlow 15s -2s linear infinite' }}
              ></path>
              {'\n      '}
            </svg>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              zIndex: '2',
              width: '1272px',
              maxWidth: 'calc(100% - 48px)',
              height: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(0,520px) minmax(0,1fr)',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {'\n        '}
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  data-w="Geb"
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '.14em',
                    color: '#F7C032',
                  }}
                >
                  WORLDWIDE
                </span>
              </span>
              {'\n        '}
              <h3
                style={{
                  margin: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '64px',
                  lineHeight: '1.02',
                  letterSpacing: '-.04em',
                  color: '#26282B',
                }}
              >
                {'\n          '}
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '6px', marginBottom: '-6px' }}>
                  <span data-w="Gh0" style={{ display: 'block' }}>
                    From Deira
                  </span>
                </span>
                {'\n          '}
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '6px', marginBottom: '-6px' }}>
                  <span data-w="Gh1" style={{ display: 'block' }}>
                    to the world.
                  </span>
                </span>
                {'\n        '}
              </h3>
              {'\n        '}
              <p
                data-w="Gp"
                style={{ margin: '0', maxWidth: '440px', fontSize: '17px', lineHeight: '1.5', color: '#3D3E3F', textWrap: 'pretty' }}
              >
                Packed in Deira, tracked all the way to your counter.
              </p>
              {'\n        '}
              <div
                data-w="Gs"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                  borderTop: '1px solid rgba(38,40,43,.14)',
                  paddingTop: '16px',
                }}
              >
                {'\n          '}
                {(Array.isArray(v.stG) ? v.stG : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, s: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        style={cssToObj(`display:flex;flex-direction:column;gap:6px;padding-left:${s(v.s?.pl)};border-left:${s(v.s?.bl)}`)}
                      >
                        <span
                          style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '30px', letterSpacing: '-.02em' }}
                        >
                          <span data-w={v.s?.id}>{t(v.s?.v)}</span>
                          {t(v.s?.u)}
                        </span>
                        <span
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.08em', color: '#5E6064' }}
                        >
                          {t(v.s?.l)}
                        </span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n        '}
              <div data-w="Gb" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {'\n          '}
                <a
                  href={v.quoteHref} target="_blank" rel="noopener" /* 14 Oct §09: opens a WhatsApp shipping quote */
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '52px',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    borderRadius: '10px',
                    background: '#F7C032',
                    color: '#26282B',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'transform .2s,box-shadow .2s',
                  }}
                  className={cx(undefined, 'wo-btn wo-btn1 scp-c103143e')}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'rgba(26,27,29,.12)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 8 12 3 3 8v8l9 5 9-5z"></path>
                      <path d="M3 8l9 5 9-5M12 13v8"></path>
                    </svg>
                  </span>
                  Get a shipping quote
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n          '}
                <a
                  href="#network"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '52px',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #26282B',
                    color: '#26282B',
                    fontWeight: '600',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                    transition: 'transform .2s',
                  }}
                  className={cx(undefined, 'wo-btn scp-b08bac3b')}
                >
                  Where we ship
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div data-w="Gscene" style={{ position: 'relative', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '478px',
                  width: '360px',
                  height: '40px',
                  marginLeft: '-180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side,rgba(38,40,43,.22),rgba(38,40,43,0))',
                  filter: 'blur(4px)',
                }}
              ></span>
              {'\n        '}
              <canvas
                data-w="glb"
                width="960"
                height="960"
                style={{ position: 'relative', width: '480px', height: '480px', display: 'block' }}
              ></canvas>
              {'\n        '}
              <div
                style={{
                  position: 'relative',
                  marginTop: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px',
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  boxShadow: '0 10px 26px rgba(38,40,43,.14),inset 0 0 0 1px rgba(38,40,43,.08)',
                }}
              >
                {'\n          '}
                <span
                  data-w="gdst"
                  style={{
                    padding: '0 12px 0 10px',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '.08em',
                    color: '#26282B',
                    whiteSpace: 'nowrap',
                  }}
                >
                  DXB → BAGHDAD
                </span>
                {'\n          '}
                {(Array.isArray(v.steps) ? v.steps : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, s: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        data-w={v.s?.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '32px',
                          padding: '0 12px',
                          borderRadius: '999px',
                          background: '#F2F3F4',
                          color: '#5E6064',
                          fontSize: '13px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          data-w={v.s?.cid}
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#26282B',
                            color: '#F7C032',
                            opacity: '0',
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <path d="M5 12l5 5L20 7"></path>
                          </svg>
                        </span>
                        {t(v.s?.t)}
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          {/* 14 Oct §09: the "sample values" footnote that collided with the buttons is removed */}
          {'\n  '}
        </div>
        </div>
      </section>
    </>
  );
}

const SEWhatWeOffer = createDC('SE What We Offer', Logic, render);
export default SEWhatWeOffer;
