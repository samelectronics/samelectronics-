// Converted from design/project/SE Home Models.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t, val } from '@/dc/runtime';
import Logic from './SEHomeModels.logic.js';
import SEBrandLogo from './SEBrandLogo';
import SEPart from './SEPart';

function render(v: Vals) {
  return (
    <>
      <section
        id="models"
        ref={v.secRef}
        data-tone="light"
        data-screen-label="06 Model file"
        onPointerDown={v.touch}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg,#F2F3F4,#E4E6E9)',
          color: '#1A1B1D',
          padding: '120px clamp(20px,4vw,64px)',
        }}
      >
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            backgroundImage:
              'linear-gradient(rgba(61,62,63,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(61,62,63,.06) 1px,transparent 1px)',
            backgroundSize: '96px 96px',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {'\n    '}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '620px' }}>
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
                <span style={{ width: '28px', height: '2px', background: '#26282B' }}></span>MODEL FILE
              </span>
              {'\n        '}
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
                Pick your phone. See every part we have for it.
              </h2>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: 'min(420px,100%)' }}>
              {'\n        '}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  boxShadow: '0 0 0 1px rgba(26,27,29,.12),0 8px 20px rgba(26,27,29,.06)',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3D3E3F" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-3.5-3.5"></path>
                </svg>
                <input
                  value={val(v.q)}
                  onInput={v.setQ}
                  placeholder="Find your model…"
                  style={{
                    flex: '1',
                    minWidth: '0',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    background: 'transparent',
                    color: '#1A1B1D',
                    fontFamily: 'Inter,sans-serif',
                  }}
                />
              </label>
              {'\n        '}
              <div
                data-hscroll
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  WebkitMaskImage: 'linear-gradient(90deg,#000 88%,transparent)',
                  maskImage: 'linear-gradient(90deg,#000 88%,transparent)',
                }}
              >
                {(Array.isArray(v.brands) ? v.brands : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, b: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <button
                        onClick={v.b?.pick}
                        style={cssToObj(
                          `flex:none;display:flex;align-items:center;height:36px;padding:0 12px;border-radius:10px;border:none;background:${s(v.b?.bg)};box-shadow:inset 0 0 0 1px rgba(26,27,29,.1);cursor:pointer;transition:background .25s cubic-bezier(.2,.8,.2,1)`,
                        )}
                      >
                        <SEBrandLogo brand={v.b?.id} color={v.b?.ink} h="14" />
                      </button>
                    </React.Fragment>
                  ))(v2);
                })}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {'\n      '}
            <button
              onClick={v.chipsL}
              aria-label="Scroll models left"
              style={{
                flex: 'none',
                display: 'grid',
                placeItems: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: '#FFFFFF',
                boxShadow: 'inset 0 0 0 1px rgba(26,27,29,.12)',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="2.4">
                <path d="m15 6-6 6 6 6"></path>
              </svg>
            </button>
            {'\n      '}
            <div
              ref={v.chipsRef}
              style={{ flex: '1', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
            >
              {(Array.isArray(v.models) ? v.models : []).map((__it: any, __i: number) => {
                const v2 = { ...v, m: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <button
                      onClick={v.m?.pick}
                      style={cssToObj(
                        `flex:none;display:flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:10px;border:none;background:${s(v.m?.bg)};color:${s(v.m?.ink)};box-shadow:${s(v.m?.sh)};font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .25s cubic-bezier(.2,.8,.2,1),color .25s`,
                      )}
                    >
                      {t(v.m?.name)}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', opacity: '.65' }}>{t(v.m?.n)}</span>
                    </button>
                  </React.Fragment>
                ))(v2);
              })}
              {v.none ? (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', height: '36px', fontSize: '14px', color: '#3D3E3F' }}>
                    No model matches. Try a model number like A2849 or SM-A546.
                  </span>
                </>
              ) : null}
            </div>
            {'\n      '}
            <button
              onClick={v.chipsR}
              aria-label="Scroll models right"
              style={{
                flex: 'none',
                display: 'grid',
                placeItems: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: '#FFFFFF',
                boxShadow: 'inset 0 0 0 1px rgba(26,27,29,.12)',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="2.4">
                <path d="m9 6 6 6-6 6"></path>
              </svg>
            </button>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,4fr) minmax(0,6fr)', gap: '32px', alignItems: 'stretch' }}>
            {'\n      '}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '24px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg,#3D3E3F,#26282B)',
                color: '#FFFFFF',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12),0 24px 60px rgba(26,27,29,.18)',
              }}
            >
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  left: '-10%',
                  top: '-20%',
                  width: '40%',
                  height: '140%',
                  background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.05),rgba(255,255,255,0))',
                  transform: 'rotate(18deg)',
                  pointerEvents: 'none',
                }}
              ></div>
              {'\n        '}
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  letterSpacing: '.12em',
                  color: '#F7C032',
                }}
              >
                <span>
                  {'FILE · '}
                  {t(v.dev?.code)}
                </span>
                <span style={{ color: '#C9CBCE' }}>{t(v.dev?.num)}</span>
              </span>
              {'\n        '}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SEBrandLogo brand={v.dev?.brand} color="#C9CBCE" h="15" />
                <span
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '700',
                    fontSize: '28px',
                    letterSpacing: '-.025em',
                    lineHeight: '1.05',
                  }}
                >
                  {t(v.dev?.name)}
                </span>
              </div>
              {'\n        '}
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {(Array.isArray(v.dev?.stats) ? v.dev?.stats : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, s: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <span
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,.07)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06)',
                        }}
                      >
                        <span
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.08em', color: '#C9CBCE' }}
                        >
                          {t(v.s?.k)}
                        </span>
                        <span
                          style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '19px', whiteSpace: 'nowrap' }}
                        >
                          {t(v.s?.v)}
                        </span>
                      </span>
                    </React.Fragment>
                  ))(v2);
                })}
              </div>
              {'\n        '}
              <div
                ref={v.ttRef}
                style={{
                  position: 'relative',
                  flex: '1',
                  minHeight: '300px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background:
                    'radial-gradient(60% 55% at 50% 40%,rgba(255,255,255,.10),rgba(255,255,255,0) 70%),radial-gradient(50% 30% at 50% 92%,rgba(247,192,50,.18),rgba(247,192,50,0))',
                  animation: 'mkFade .6s .3s both',
                }}
              >
                {'\n          '}
                <canvas style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
                {'\n          '}
                {v.ttLoading ? (
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
                        animation: 'mkSpin 1s linear infinite',
                      }}
                    ></span>
                  </>
                ) : null}
                {'\n        '}
              </div>
              {'\n        '}
              <a
                href="#models"
                onClick={v.open}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  height: '44px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: '#F7C032',
                  color: '#1A1B1D',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
                className={cx(undefined, 'scp-c70f18f8')}
              >
                <span style={{ flex: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {'Open the full '}
                  {t(v.dev?.name)}
                  {' file'}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  style={{ flex: 'none' }}
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
              {'\n        '}
              <div
                style={{
                  position: 'relative',
                  padding: '20px',
                  borderRadius: '24px',
                  background: 'linear-gradient(180deg,#3D3E3F,#26282B)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1),0 24px 60px rgba(26,27,29,.18)',
                  overflow: 'hidden',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '12px',
                    borderRadius: '16px',
                    backgroundColor: '#2E3033',
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
                    backgroundSize: '80px 80px,80px 80px,16px 16px,16px 16px',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,.35)',
                  }}
                ></div>
                {'\n          '}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 6px 12px',
                  }}
                >
                  {'\n            '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#C9CBCE' }}>
                    {"TECHNICIAN'S MAT · "}
                    {t(v.dev?.name)}
                  </span>
                  {'\n            '}
                  <button
                    onClick={v.toggleAuto}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      height: '28px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(255,255,255,.08)',
                      color: '#FFFFFF',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={cssToObj(`width:7px;height:7px;border-radius:50%;background:${s(v.autoDot)};animation:${s(v.autoAnim)}`)}
                    ></span>
                    {t(v.autoLbl)}
                  </button>
                  {'\n          '}
                </div>
                {'\n          '}
                <div
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
                    gridAutoRows: '150px',
                    gap: '14px',
                    padding: '6px',
                  }}
                >
                  {'\n            '}
                  {(Array.isArray(v.tray) ? v.tray : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, p: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        {'\n              '}
                        <button
                          onClick={v.p?.pick}
                          style={cssToObj(
                            `grid-column:${s(v.p?.gc)};grid-row:${s(v.p?.gr)};position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:8px;padding:10px 8px;border-radius:14px;border:none;background:${s(v.p?.bg)};box-shadow:${s(v.p?.sh)};opacity:${s(v.p?.o)};cursor:pointer;color:#FFFFFF;animation:${s(v.p?.anim)};transition:opacity .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s,background .4s`,
                          )}
                        >
                          {'\n                '}
                          <span
                            style={{ flex: '1', display: 'grid', placeItems: 'center', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,.45))' }}
                          >
                            <SEPart kind={v.p?.kind} size={v.p?.size} tone="dark" still={true} />
                          </span>
                          {'\n                '}
                          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.2' }}>{t(v.p?.name)}</span>
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: '11px',
                                color: '#C9CBCE',
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px' }}>
                                {(Array.isArray(v.p?.bars) ? v.p?.bars : []).map((__it: any, __i: number) => {
                                  const v2 = { ...v, b: __it, $index: __i };
                                  return ((v: Vals) => (
                                    <React.Fragment key={__i}>
                                      <span
                                        style={cssToObj(`width:3px;height:${s(v.b?.h)}px;border-radius:1px;background:${s(v.b?.c)}`)}
                                      ></span>
                                    </React.Fragment>
                                  ))(v2);
                                })}
                              </span>
                              {'from '}
                              {t(v.p?.from)}
                            </span>
                          </span>
                          {'\n              '}
                        </button>
                        {'\n            '}
                      </React.Fragment>
                    ))(v2);
                  })}
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) 230px',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  boxShadow: '0 1px 2px rgba(0,0,0,.05),0 12px 30px rgba(26,27,29,.08)',
                }}
              >
                {'\n          '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {'\n            '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                    {'GRADES · '}
                    {t(v.catName)}
                  </span>
                  {'\n            '}
                  {(Array.isArray(v.grades) ? v.grades : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, g: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        {'\n              '}
                        <button
                          onClick={v.g?.pick}
                          style={cssToObj(
                            `display:grid;grid-template-columns:40px 110px minmax(0,1fr) 92px 84px;gap:12px;align-items:center;height:44px;padding:0 12px;border-radius:12px;border:none;text-align:left;cursor:pointer;background:${s(v.g?.bg)};box-shadow:${s(v.g?.sh)};color:#1A1B1D;opacity:${s(v.g?.o)};transition:background .25s,box-shadow .25s`,
                          )}
                        >
                          {'\n                '}
                          <span
                            style={{
                              display: 'grid',
                              placeItems: 'center',
                              width: '36px',
                              height: '24px',
                              borderRadius: '6px',
                              background: '#26282B',
                              color: '#F7C032',
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            {t(v.g?.code)}
                          </span>
                          {'\n                '}
                          <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>{t(v.g?.name)}</span>
                          {'\n                '}
                          <span style={{ height: '6px', borderRadius: '3px', background: '#E4E6E9', overflow: 'hidden' }}>
                            <span
                              style={cssToObj(
                                `display:block;height:100%;width:${s(v.g?.w)};border-radius:3px;background:linear-gradient(90deg,#C9921A,#F7C032,#FFDB6E);transform-origin:0 50%;animation:${s(v.g?.anim)}`,
                              )}
                            ></span>
                          </span>
                          {'\n                '}
                          <span style={{ fontSize: '12px', color: '#3D3E3F', whiteSpace: 'nowrap' }}>{t(v.g?.stock)}</span>
                          {'\n                '}
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: '14px',
                              fontWeight: '600',
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t(v.g?.price)}
                          </span>
                          {'\n              '}
                        </button>
                        {'\n            '}
                      </React.Fragment>
                    ))(v2);
                  })}
                  {'\n          '}
                </div>
                {'\n          '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '14px',
                    borderRadius: '16px',
                    background: 'linear-gradient(180deg,#FFF4D1,#FFFFFF)',
                    boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.35)',
                  }}
                >
                  {'\n            '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#3D3E3F' }}>
                    YOUR PICK
                  </span>
                  {'\n            '}
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '16px', lineHeight: '1.25' }}>
                    {t(v.pick?.title)}
                  </span>
                  {'\n            '}
                  <span style={{ fontSize: '13px', color: '#3D3E3F' }}>{t(v.pick?.grade)}</span>
                  {'\n            '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '22px', fontWeight: '700' }}>{t(v.pick?.price)}</span>
                  {'\n            '}
                  <button
                    onClick={v.pick?.add}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#26282B',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    className={cx(undefined, 'scp-7796087e')}
                  >
                    Add to cart
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                  </button>
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

const SEHomeModels = createDC('SE Home Models', Logic, render);
export default SEHomeModels;
