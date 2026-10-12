// GENERATED from design/project/Sam Electronics Home v3.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
// Home v3 section "Wholesale". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t, val } from '@/dc/runtime';
import SEWholesaleTruck from '../../dc/SEWholesaleTruck';

export default function Wholesale({ v }: { v: Vals }) {
  return (
    <section
      id="wholesale"
      data-tone="light"
      data-screen-label="09 Wholesale"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#F7C032',
        color: '#26282B',
        padding: '120px clamp(20px,4vw,64px) 190px',
      }}
    >
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '0', right: '0', bottom: '36px', height: '110px', pointerEvents: 'none' }}
      >
        {'\n    '}
        <div
          style={{
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            height: '26px',
            background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 40%,#26282B)',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,.18),0 10px 20px rgba(110,72,0,.3)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              top: '3px',
              height: '10px',
              background: 'repeating-linear-gradient(90deg,#2E3033 0 2px,#3D3E3F 2px 16px)',
              animation: 'whBelt 1.2s linear infinite',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              bottom: '2px',
              height: '10px',
              background: 'repeating-linear-gradient(90deg,transparent 0 30px,radial-gradient(circle,#C9CCD0,#5E6064) 30px 40px)',
            }}
          ></div>
        </div>
        {'\n    '}
        <div style={{ position: 'absolute', left: '0', right: '0', bottom: '26px', height: '80px', overflow: 'hidden' }}>
          <div
            style={cssToObj(
              `display:flex;gap:120px;width:max-content;padding-left:40px;animation:whConv ${s(v.whs?.convDur)} linear infinite`,
            )}
          >
            {(Array.isArray(v.whs?.conv) ? v.whs?.conv : []).map((__it: any, __i: number) => {
              const v2 = { ...v, c: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <span
                    style={cssToObj(
                      `position:relative;flex:none;width:${s(v.c?.w)}px;height:${s(v.c?.h)}px;margin-top:${s(v.c?.mt)}px;border-radius:2px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 1px rgba(90,55,20,.4),inset 0 -4px 0 rgba(90,55,20,.18),0 6px 10px rgba(110,72,0,.35)`,
                    )}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '44%',
                        top: '0',
                        width: '10%',
                        height: '100%',
                        background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '6px',
                        bottom: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        padding: '4px 6px',
                        borderRadius: '2px',
                        background: '#F4F1EA',
                        boxShadow: '0 0 0 .5px rgba(0,0,0,.2)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '9px',
                          fontWeight: '700',
                          color: '#26282B',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t(v.c?.label)}
                      </span>
                      <span
                        style={{
                          width: '46px',
                          height: '6px',
                          background: 'repeating-linear-gradient(90deg,#26282B 0 1px,transparent 1px 2.2px)',
                        }}
                      ></span>
                    </span>
                    {v.c?.fragile ? (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            padding: '1px 3px',
                            border: '1px solid #26282B',
                            borderRadius: '2px',
                            fontFamily: "'Space Grotesk',sans-serif",
                            fontWeight: '700',
                            fontSize: '7px',
                            color: '#26282B',
                          }}
                        >
                          FRAGILE
                        </span>
                      </>
                    ) : null}
                  </span>
                </React.Fragment>
              ))(v2);
            })}
          </div>
        </div>
        {'\n  '}
      </div>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          left: '20%',
          top: '-30%',
          width: '1000px',
          height: '1000px',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side,#FFE58F,rgba(255,219,110,0))',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 4px)',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <svg
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {'\n    '}
        <g stroke="rgba(26,27,29,.16)">
          <path d="M0 680 H160 L200 640 H420 L450 670 H560" strokeWidth="2.5"></path>
          <path d="M1440 70 H1300 L1260 110 H1140" strokeWidth="2"></path>
          <path d="M1440 82 H1304 L1270 116" strokeWidth="1"></path>
          <path d="M900 760 V720 L930 690 H1060" strokeWidth="1.5"></path>
        </g>
        {'\n    '}
        <g stroke="rgba(26,27,29,.5)" strokeWidth="3" strokeDasharray="70 930">
          <path pathLength="1000" d="M0 680 H160 L200 640 H420 L450 670 H560" style={{ animation: 'sePulse 3.6s linear infinite' }}></path>
          <path pathLength="1000" d="M1440 70 H1300 L1260 110 H1140" style={{ animation: 'sePulse 3s .6s linear infinite' }}></path>
        </g>
        {'\n    '}
        <g fill="#F7C032" stroke="rgba(26,27,29,.55)" strokeWidth="2">
          <circle cx="560" cy="670" r="4.5"></circle>
          <circle cx="1140" cy="110" r="4.5"></circle>
          <circle cx="1060" cy="690" r="4"></circle>
        </g>
        {'\n  '}
      </svg>
      {'\n  '}
      <div
        style={{
          position: 'relative',
          maxWidth: '1312px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))',
          gap: 'clamp(32px,4vw,56px)',
          alignItems: 'center',
        }}
      >
        {'\n    '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '540px' }}>
          {'\n      '}
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em' }}>WHOLESALE & TRADE</span>
          {'\n      '}
          <h2
            style={{
              margin: '0',
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: '700',
              fontSize: 'clamp(48px,5.4vw,80px)',
              lineHeight: '.98',
              letterSpacing: '-.04em',
            }}
          >
            Stock up.
            <br />
            Cost down.
          </h2>
          {'\n      '}
          <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#26282B', textWrap: 'pretty' }}>
            Repair shops, traders and exporters buy at trade prices once their account is approved. Send a bulk list and we quote it the
            same day.
          </p>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {'\n        '}
            {(Array.isArray(v.whs?.points) ? v.whs?.points : []).map((__it: any, __i: number) => {
              const v2 = { ...v, p: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      height: '44px',
                      borderBottom: '1.5px solid rgba(26,27,29,.14)',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    <span
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#26282B',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="3.4">
                        <path d="M5 12l5 5L20 7"></path>
                      </svg>
                    </span>
                    {t(v.p)}
                  </span>
                </React.Fragment>
              ))(v2);
            })}
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {'\n        '}
            <button
              onClick={v.whs?.apply}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '44px',
                padding: '0 18px',
                borderRadius: '10px',
                border: 'none',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform .2s,box-shadow .2s',
              }}
              className={cx(undefined, 'scp-79294bcc')}
            >
              Apply for a trade account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </button>
            {'\n        '}
            <button
              onClick={v.whs?.bulk}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '44px',
                padding: '0 18px',
                borderRadius: '10px',
                border: '1.5px solid #26282B',
                background: 'transparent',
                color: '#26282B',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              className={cx(undefined, 'scp-dcb3e0a8')}
            >
              Send a bulk list
            </button>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {'\n      '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              padding: '26px',
              borderRadius: '24px',
              background:
                'repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px),linear-gradient(180deg,#3D3E3F,#26282B)',
              color: '#FFFFFF',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.22),0 30px 60px rgba(110,72,0,.3)',
            }}
          >
            {'\n        '}
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.12em',
                color: '#F7C032',
              }}
            >
              <span>BULK CALCULATOR</span>
              <span style={{ color: '#9DA1A6' }}>SAMPLE TRADE PRICES</span>
            </span>
            {'\n        '}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {(Array.isArray(v.whs?.parts) ? v.whs?.parts : []).map((__it: any, __i: number) => {
                const v2 = { ...v, p: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <button
                      onClick={v.p?.pick}
                      style={cssToObj(
                        `height:36px;padding:0 12px;border-radius:10px;border:none;background:${s(v.p?.bg)};color:${s(v.p?.ink)};font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap`,
                      )}
                    >
                      {t(v.p?.name)}
                    </button>
                  </React.Fragment>
                ))(v2);
              })}
            </div>
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Quantity</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '600', color: '#F7C032' }}>
                  {t(v.whs?.qty)}
                  {' pcs'}
                </span>
              </span>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={val(v.whs?.qty)}
                onInput={v.whs?.setQty}
                style={{ width: '100%', accentColor: '#F7C032' }}
              />
            </div>
            {'\n        '}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {'\n          '}
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,.05)',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#9DA1A6' }}>
                  RETAIL TOTAL
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#C9CBCE',
                    textDecoration: 'line-through',
                    overflow: 'hidden',
                  }}
                >
                  <span style={cssToObj(`display:inline-block;animation:${s(v.whs?.roll)}`)}>{t(v.whs?.retail)}</span>
                </span>
              </span>
              {'\n          '}
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'rgba(247,192,50,.12)',
                  boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.5)',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#F7C032' }}>
                  TRADE TOTAL
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '20px', fontWeight: '600' }}>
                  <span style={cssToObj(`display:inline-block;animation:${s(v.whs?.roll)}`)}>{t(v.whs?.trade)}</span>
                </span>
              </span>
              {'\n        '}
            </div>
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>You keep</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '22px', color: '#F7C032' }}>
                  <span style={cssToObj(`display:inline-block;animation:${s(v.whs?.roll)}`)}>{t(v.whs?.save)}</span>
                </span>
              </span>
              <span
                style={{
                  position: 'relative',
                  height: '10px',
                  borderRadius: '5px',
                  background: 'rgba(255,255,255,.08)',
                  overflow: 'hidden',
                }}
              >
                <span
                  style={cssToObj(
                    `position:absolute;left:0;top:0;bottom:0;width:${s(v.whs?.bar)};border-radius:5px;background-image:linear-gradient(90deg,#C9921A,#F7C032 40%,#FFF4D1 50%,#F7C032 60%,#C9921A);background-size:200px 10px;animation:seFlowBg 1.4s linear infinite;transition:width .4s cubic-bezier(.2,.8,.2,1)`,
                  )}
                ></span>
              </span>
            </div>
            {'\n        '}
            <SEWholesaleTruck n={v.whs?.cartonsN} />
            {'\n      '}
          </div>
          {'\n      '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '56px minmax(0,1fr) auto',
              gap: '16px',
              alignItems: 'center',
              padding: '18px 20px',
              borderRadius: '24px',
              background: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(26,27,29,.2)',
            }}
          >
            {'\n        '}
            <span
              style={{
                position: 'relative',
                display: 'grid',
                placeItems: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#26282B',
                overflow: 'hidden',
              }}
            >
              <svg viewBox="0 0 56 56" width="56" height="56" style={{ position: 'absolute', inset: '0' }} fill="none">
                <path
                  d="M6 44 C 16 14, 40 14, 50 44"
                  stroke="#F7C032"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{ animation: 'whArc 1s linear infinite' }}
                ></path>
              </svg>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F7C032"
                strokeWidth="1.8"
                style={{ position: 'relative' }}
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path>
              </svg>
            </span>
            {'\n        '}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '18px' }}>Partner with us</span>
              <span style={{ fontSize: '14px', color: '#3D3E3F' }}>
                Distributors and resellers abroad: become a Sam Electronics partner in your country.
              </span>
            </span>
            {'\n        '}
            <button
              onClick={v.whs?.partner}
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: 'none',
                background: '#F7C032',
                cursor: 'pointer',
              }}
              aria-label="Partner with us"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </button>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
      {'\n  '}
      <div
        style={{
          position: 'relative',
          maxWidth: '1312px',
          margin: '36px auto 0',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#26282B',
          boxShadow: '0 20px 40px rgba(26,27,29,.25)',
        }}
      >
        {'\n    '}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {'\n      '}
          <span
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '52px',
              padding: '0 18px',
              background: '#3D3E3F',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '12px',
              letterSpacing: '.12em',
              color: '#F7C032',
              zIndex: '1',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#2BB673',
                animation: 'seBlinkDot 1.2s steps(1) infinite',
              }}
            ></span>
            TRADE TICKER · SAMPLE
          </span>
          {'\n      '}
          <div
            style={{
              flex: '1',
              overflow: 'hidden',
              WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)',
              maskImage: 'linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)',
            }}
          >
            <div style={{ display: 'flex', width: 'max-content', animation: 'whTick 40s linear infinite' }}>
              {(Array.isArray(v.whs?.ticker) ? v.whs?.ticker : []).map((__it: any, __i: number) => {
                const v2 = { ...v, t: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '52px',
                        padding: '0 22px',
                        borderRight: '1px solid rgba(255,255,255,.08)',
                        fontSize: '14px',
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#C9CBCE' }}>{t(v.t?.who)}</span>
                      {t(v.t?.what)}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '600', color: '#F7C032' }}>{t(v.t?.qty)}</span>
                    </span>
                  </React.Fragment>
                ))(v2);
              })}
            </div>
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
