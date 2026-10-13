// Converted from design/project/SE Home Deals.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SEHomeDeals.logic.js';
import SEPart from './SEPart';

/** Issue 4: fine film grain instead of grids, stripes and tiles. */
const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

function render(v: Vals) {
  return (
    <>
      <section
        id="deals"
        ref={v.secRef}
        data-tone="dark"
        data-screen-label="07 Deals and arrivals"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(90% 90% at 20% 0%,#4A4D52 0%,#3D3E3F 35%,#26282B 80%)',
          color: '#FFFFFF',
          padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)',
        }}
      >
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: '-30%',
            width: '22%',
            height: '160%',
            background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.06),rgba(255,255,255,0))',
            animation: 'dlBeam 10s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            left: '60%',
            top: '-30%',
            width: '16%',
            height: '160%',
            background: 'linear-gradient(90deg,rgba(247,192,50,0),rgba(247,192,50,.08),rgba(247,192,50,0))',
            animation: 'dlBeam 13s 3s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            backgroundImage: GRAIN,
            opacity: '.035',
            pointerEvents: 'none',
          }}
        ></div>
        {'\n  '}
        <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {'\n    '}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
            {'\n      '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '680px' }}>
              {'\n        '}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  letterSpacing: '.14em',
                  color: '#F7C032',
                }}
              >
                <span style={{ width: '28px', height: '2px', background: '#F7C032' }}></span>
                {'DEALS & ARRIVALS · '}
                {t(v.liveCount)}
                {' LIVE · SAMPLE PRICES'}
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
                Prices drop. Clocks tick. Grab it before the next shop does.
              </h2>
              {'\n      '}
            </div>
            {'\n      '}
            <a
              href="#deals"
              onClick={v.all}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '44px',
                padding: '0 18px',
                borderRadius: '10px',
                background: '#F7C032',
                color: '#1A1B1D',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
              className={cx(undefined, 'scp-c70f18f8')}
            >
              See every deal
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </a>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              margin: '0 calc(-1 * clamp(20px,4vw,64px))',
              WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
              maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
            }}
          >
            {'\n      '}
            <div
              style={cssToObj(
                `display:flex;gap:14px;width:max-content;padding:10px 0 24px;animation:dlTrack ${s(v.trackDur)} linear infinite`,
              )}
              className={cx(undefined, 'scp-facaa0da')}
            >
              {'\n        '}
              {(Array.isArray(v.cards) ? v.cards : []).map((__it: any, __i: number) => {
                const v2 = { ...v, d: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    {'\n          '}
                    <div
                      style={{
                        position: 'relative',
                        width: '280px',
                        flex: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'linear-gradient(170deg,rgba(255,255,255,.11),rgba(255,255,255,.04))',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.12),0 20px 40px rgba(0,0,0,.25)',
                        transition: 'transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s',
                      }}
                      className={cx(undefined, 'scp-38895ad2')}
                    >
                      {'\n            '}
                      <div
                        style={{
                          position: 'relative',
                          height: '150px',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'radial-gradient(60% 80% at 50% 78%,rgba(247,192,50,.26),rgba(255,255,255,0) 70%)',
                        }}
                      >
                        {'\n              '}
                        <SEPart kind={v.d?.kind} size={130} tone="dark" />
                        {'\n              '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            height: '26px',
                            padding: '0 9px',
                            borderRadius: '7px',
                            background: '#F7C032',
                            color: '#1A1B1D',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: '12px',
                            fontWeight: '700',
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M12 5v14M5 12l7 7 7-7"></path>
                          </svg>
                          {t(v.d?.pct)}
                        </span>
                        {'\n              '}
                        <span
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '12px',
                            padding: '4px 8px',
                            borderRadius: '7px',
                            background: '#26282B',
                            color: '#F7C032',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: '11px',
                            fontWeight: '600',
                            boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.4)',
                          }}
                        >
                          {t(v.d?.grade)}
                        </span>
                        {'\n            '}
                      </div>
                      {'\n            '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px 16px 16px', flex: '1' }}>
                        {'\n              '}
                        <span style={{ fontWeight: '600', fontSize: '15px', lineHeight: '1.3', minHeight: '40px' }}>{t(v.d?.title)}</span>
                        {'\n              '}
                        <span style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: '10px', height: '28px' }}>
                          {'\n                '}
                          <span
                            style={cssToObj(
                              `font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:#F7C032;display:inline-block;animation:dlNew ${s(v.trackDur)} ${s(v.d?.dl)} infinite`,
                            )}
                          >
                            {t(v.d?.price)}
                          </span>
                          {'\n                '}
                          <span
                            style={cssToObj(
                              `font-family:'JetBrains Mono',monospace;font-size:13px;color:#C9CBCE;text-decoration:line-through;display:inline-block;animation:dlOld ${s(v.trackDur)} ${s(v.d?.dl)} infinite`,
                            )}
                          >
                            {t(v.d?.old)}
                          </span>
                          {'\n              '}
                        </span>
                        {'\n              '}
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 10px',
                            borderRadius: '9px',
                            background: 'rgba(0,0,0,.22)',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: '12px',
                          }}
                        >
                          <span style={{ color: '#C9CBCE' }}>ENDS IN</span>
                          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{t(v.d?.left)}</span>
                        </span>
                        {'\n              '}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#E4E5E7' }}>
                          <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px' }}>
                            {(Array.isArray(v.d?.bars) ? v.d?.bars : []).map((__it: any, __i: number) => {
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
                          {t(v.d?.stock)}
                        </span>
                        {'\n              '}
                        <button
                          onClick={v.d?.add}
                          style={{
                            marginTop: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '36px',
                            padding: '0 14px',
                            borderRadius: '10px',
                            border: '1.5px solid rgba(255,255,255,.4)',
                            background: 'transparent',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background .3s,color .3s,border-color .3s',
                          }}
                          className={cx(undefined, 'scp-7f19569c')}
                        >
                          Add to cart
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M12 5v14M5 12h14"></path>
                          </svg>
                        </button>
                        {'\n            '}
                      </div>
                      {'\n          '}
                    </div>
                    {'\n        '}
                  </React.Fragment>
                ))(v2);
              })}
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(300px,1fr)', gap: '14px' }}>
            {'\n      '}
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 300px',
                gap: '20px',
                padding: '24px',
                borderRadius: '24px',
                background: 'linear-gradient(150deg,#26282B,#1E2022)',
                boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.35),0 30px 60px rgba(0,0,0,.35)',
                overflow: 'hidden',
              }}
            >
              {'\n          '}
              <svg
                viewBox="0 0 800 260"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }}
                fill="none"
                strokeLinecap="round"
              >
                <g stroke="rgba(247,192,50,.12)" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
                  <path d="M0 248 H120 L140 232 H300"></path>
                </g>
                <g stroke="#FFDB6E" strokeWidth="2" strokeDasharray="40 960" vectorEffect="non-scaling-stroke">
                  <path
                    pathLength="1000"
                    d="M0 248 H120 L140 232 H300"
                    style={{ animation: 'dlCirc 3.6s cubic-bezier(.45,0,.55,1) infinite' }}
                  ></path>
                </g>
              </svg>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0' }}>
                {'\n          '}
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
                  <span>
                    {'INCOMING SHIPMENT · '}
                    {t(v.ship?.id)} <span style={{ color: '#C9CBCE' }}>· SAMPLE</span>
                  </span>
                  <span style={{ color: '#FFFFFF' }}>
                    {t(v.ship?.pct)}
                    {' OF THE WAY'}
                  </span>
                </span>
                {'\n          '}
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '19px' }}>{t(v.ship?.label)}</span>
                {'\n          '}
                <div style={{ position: 'relative', height: '140px', marginTop: '-6px', width: '440px', maxWidth: '100%' }}>
                  {'\n            '}
                  <svg
                    viewBox="0 0 440 150"
                    width="440"
                    height="150"
                    style={{ position: 'absolute', inset: '0', overflow: 'visible' }}
                    fill="none"
                  >
                    {'\n              '}
                    <path d="M20 110 C 120 10, 300 10, 420 92" stroke="rgba(255,255,255,.14)" strokeWidth="2"></path>
                    {'\n              '}
                    <path
                      d="M20 110 C 120 10, 300 10, 420 92"
                      stroke="#F7C032"
                      strokeWidth="2.5"
                      pathLength="100"
                      strokeDasharray="100 100"
                      style={{ animation: 'dlTrail 10s infinite' }}
                    ></path>
                    <path
                      d="M20 110 C 120 10, 300 10, 420 92"
                      stroke="rgba(247,192,50,.5)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      style={{ animation: 'dlDash 1s linear infinite' }}
                    ></path>
                    {'\n            '}
                  </svg>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '110px',
                      width: '10px',
                      height: '10px',
                      margin: '-5px 0 0 -5px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '420px',
                      top: '92px',
                      width: '12px',
                      height: '12px',
                      margin: '-6px 0 0 -6px',
                      borderRadius: '50%',
                      background: '#F7C032',
                      boxShadow: '0 0 0 3px #26282B',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '420px',
                      top: '92px',
                      width: '12px',
                      height: '12px',
                      margin: '-6px 0 0 -6px',
                      borderRadius: '50%',
                      background: '#F7C032',
                      opacity: '0',
                      animation: 'dlLand 10s infinite',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '124px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '11px',
                      color: '#C9CBCE',
                    }}
                  >
                    {t(v.ship?.origin)}
                  </span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '330px',
                      top: '108px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '11px',
                      color: '#F7C032',
                    }}
                  >
                    DUBAI · DEIRA
                  </span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      width: '34px',
                      height: '26px',
                      offsetPath: "path('M20 110 C 120 10, 300 10, 420 92')",
                      offsetRotate: 'auto',
                      offsetDistance: '0%',
                      animation: 'dlShip 10s infinite',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '4px',
                        background: 'linear-gradient(160deg,#E0B060,#B9852F)',
                        boxShadow: '0 6px 12px rgba(0,0,0,.45),inset 0 0 0 1px rgba(0,0,0,.15)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '0',
                        width: '6px',
                        height: '26px',
                        background: 'rgba(255,244,209,.6)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '4px',
                        bottom: '4px',
                        width: '10px',
                        height: '6px',
                        background: '#26282B',
                        borderRadius: '1px',
                      }}
                    ></span>
                  </span>
                  {'\n          '}
                </div>
                {'\n          \n        '}
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {'\n          '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
                  {'\n            '}
                  {(Array.isArray(v.ship?.parts) ? v.ship?.parts : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, p: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        <span
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '12px 0',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,.06)',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)',
                          }}
                        >
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '700', fontSize: '26px', lineHeight: '1' }}>
                            {t(v.p?.v)}
                          </span>
                          <span
                            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '.1em', color: '#C9CBCE' }}
                          >
                            {t(v.p?.u)}
                          </span>
                        </span>
                      </React.Fragment>
                    ))(v2);
                  })}
                  {'\n          '}
                </div>
                {'\n          '}
                <span style={{ fontSize: '13px', lineHeight: '1.5', color: '#E4E5E7' }}>
                  Pre-book from this box and your parts are reserved the moment it lands in Deira.
                </span>
                {'\n          '}
                <button
                  onClick={v.ship?.notify}
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#F7C032',
                    color: '#1A1B1D',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Notify me when it lands
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                  </svg>
                </button>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '20px 22px',
                borderRadius: '24px',
                background: '#FFFFFF',
                color: '#1A1B1D',
                boxShadow: '0 20px 40px rgba(0,0,0,.25)',
              }}
            >
              {'\n        '}
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '12px',
                  letterSpacing: '.12em',
                  color: '#3D3E3F',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <span>PRE-ORDERS · NEW MODELS</span>
                <span style={{ letterSpacing: '.06em', color: '#5E6064' }}>placeholders</span>
              </span>
              {'\n        '}
              {(Array.isArray(v.preorders) ? v.preorders : []).map((__it: any, __i: number) => {
                const v2 = { ...v, p: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0,1fr) auto',
                        gap: '4px 10px',
                        padding: '11px 0',
                        borderTop: '1px solid rgba(26,27,29,.08)',
                      }}
                    >
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>{t(v.p?.model)}</span>
                      <span
                        style={cssToObj(
                          `justify-self:end;padding:3px 8px;border-radius:6px;background:${s(v.p?.bg)};font-size:12px;font-weight:600;white-space:nowrap`,
                        )}
                      >
                        {t(v.p?.status)}
                      </span>
                      <span style={{ gridColumn: 'span 2', fontSize: '13px', color: '#3D3E3F' }}>{t(v.p?.parts)}</span>
                    </div>
                  </React.Fragment>
                ))(v2);
              })}
              {'\n        '}
              <button
                onClick={v.preorder}
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
              >
                Reserve a pre-order
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </button>
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

const SEHomeDeals = createDC('SE Home Deals', Logic, render);
export default SEHomeDeals;
