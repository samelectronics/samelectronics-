// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Social". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';
import SEPart from '../../dc/SEPart';

export default function Social({ v }: { v: Vals }) {
  return (
    <section
      id="social"
      data-tone="light"
      data-screen-label="16 Social wall and reviews"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(70% 80% at 50% 0%,#FFFFFF 0%,#FBF8F2 45%,#F1EBDF 100%)',
        padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)',
      }}
    >
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '-30%',
          width: '1100px',
          height: '700px',
          marginLeft: '-550px',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side,rgba(255,240,210,.9),rgba(255,240,210,0))',
          pointerEvents: 'none',
        }}
      ></div>
      <span
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          height: '40%',
          background: 'linear-gradient(180deg,rgba(241,235,223,0),rgba(228,219,203,.6))',
          pointerEvents: 'none',
        }}
      ></span>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          left: '-240px',
          bottom: '-240px',
          width: '760px',
          height: '760px',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side,rgba(255,219,110,.42),rgba(242,243,244,0))',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'relative',
          maxWidth: '1312px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.5fr) minmax(320px,1fr)',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {'\n    '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {'\n      '}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#5E6064' }}>
                SOCIAL WALL · @SAMELECTRONICS.UAE
              </span>
              <h2
                style={{
                  margin: '0',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: 'clamp(30px,3vw,42px)',
                  lineHeight: '1.08',
                  letterSpacing: '-.03em',
                }}
              >
                Follow @samelectronics.uae for daily stock drops.
              </h2>
            </div>
            {'\n        '}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(Array.isArray(v.socials) ? v.socials : []).map((__it: any, __i: number) => {
                const v2 = { ...v, x: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <a
                      href={v.x?.href}
                      target="_blank"
                      rel="noopener"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '36px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        background: '#1A1B1D',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'box-shadow .2s',
                      }}
                      className={cx(undefined, 'scp-b327c115')}
                    >
                      <span
                        style={cssToObj(
                          `display:block;width:16px;height:16px;background:#F7C032;-webkit-mask:${s(v.x?.mask)};mask:${s(v.x?.mask)}`,
                        )}
                      ></span>
                      {t(v.x?.name)}
                    </a>
                  </React.Fragment>
                ))(v2);
              })}
            </div>
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '12px', flex: '1' }}>
            {'\n        '}
            {(Array.isArray(v.posts) ? v.posts : []).map((__it: any, __i: number) => {
              const v2 = { ...v, p: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  {'\n          '}
                  <a
                    href={v.p?.href}
                    target="_blank"
                    rel="noopener"
                    style={cssToObj(
                      `position:relative;display:block;aspect-ratio:4/5;border-radius:16px;overflow:hidden;background:${s(v.p?.bg)};color:${s(v.p?.ink)};text-decoration:none;box-shadow:0 2px 4px rgba(0,0,0,.08),0 14px 30px rgba(26,27,29,.14);transition:transform .3s cubic-bezier(.2,.8,.2,1)`,
                    )}
                    className={cx(undefined, 'scp-44c25a65')}
                  >
                    {'\n            '}
                    <span
                      style={cssToObj(
                        `position:absolute;left:50%;top:44%;margin:-70px 0 0 -70px;animation:soFloat 6s ${s(v.p?.d)} ease-in-out infinite`,
                      )}
                    >
                      <SEPart kind={v.p?.kind} size={140} tone={v.p?.tone} />
                    </span>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '26px',
                        padding: '0 9px',
                        borderRadius: '7px',
                        background: 'rgba(38,40,43,.86)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      <span
                        style={cssToObj(
                          `display:block;width:12px;height:12px;background:#F7C032;-webkit-mask:${s(v.p?.mask)};mask:${s(v.p?.mask)}`,
                        )}
                      ></span>
                      {t(v.p?.kind2)}
                    </span>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        right: '12px',
                        bottom: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '16px', lineHeight: '1.15' }}>
                        {t(v.p?.title)}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', opacity: '.85' }}>{t(v.p?.meta)}</span>
                    </span>
                    {'\n            '}
                    {v.p?.video ? (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '44%',
                            width: '52px',
                            height: '52px',
                            margin: '-26px 0 0 -26px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'rgba(255,255,255,.88)',
                            boxShadow: '0 8px 20px rgba(0,0,0,.35)',
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#26282B">
                            <path d="M8 5v14l11-7z"></path>
                          </svg>
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            height: '3px',
                            background: 'rgba(255,255,255,.3)',
                          }}
                        >
                          <span
                            style={cssToObj(
                              `display:block;height:100%;background:#F7C032;transform-origin:0 50%;animation:soProg 6s ${s(v.p?.d)} linear infinite`,
                            )}
                          ></span>
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '12px',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {t(v.p?.dur)}
                        </span>
                      </>
                    ) : null}
                    {'\n          '}
                  </a>
                  {'\n        '}
                </React.Fragment>
              ))(v2);
            })}
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
              gap: '12px',
              padding: '22px',
              borderRadius: '24px',
              background: 'linear-gradient(150deg,#4A4D52,#3D3E3F 40%,#26282B)',
              color: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(26,27,29,.22)',
            }}
          >
            {'\n        '}
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#F7C032' }}>
                REVIEWS
              </span>
            </span>
            {'\n        '}
            <span
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: '22px',
                letterSpacing: '-.02em',
                lineHeight: '1.15',
              }}
            >
              Bought from us? Be the first review.
            </span>
            {'\n        '}
            <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#E4E5E7' }}>
              Only real customers. Your words help the next shop choose.
            </span>
            {'\n        '}
            <button
              onClick={v.reviewSoon}
              style={{
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
              Write the first review
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
              </svg>
            </button>
            {'\n      '}
          </div>
          {'\n      '}
          <a
            href={v.googleReview}
            target="_blank"
            rel="noopener"
            style={{
              display: 'grid',
              gridTemplateColumns: '56px minmax(0,1fr) auto',
              gap: '14px',
              alignItems: 'center',
              padding: '18px 20px',
              borderRadius: '24px',
              background: '#FFFFFF',
              color: '#1A1B1D',
              boxShadow: '0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.06)',
              transition: 'box-shadow .2s,transform .2s',
            }}
            className={cx(undefined, 'scp-c69c1c01')}
          >
            {'\n        '}
            <span
              style={{ display: 'grid', placeItems: 'center', width: '56px', height: '56px', borderRadius: '16px', background: '#F2F3F4' }}
            >
              <svg width="26" height="26" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
              </svg>
            </span>
            {'\n        '}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '18px' }}>Review us on Google</span>
              <span style={{ fontSize: '13px', color: '#5E6064' }}>Sam Electronics · Al Murar, Deira</span>
            </span>
            {'\n        '}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17 17 7M9 7h8v8"></path>
            </svg>
            {'\n      '}
          </a>
          {'\n      '}
          <div
            style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '18px 20px',
              borderRadius: '24px',
              background: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,.06),0 10px 28px rgba(120,90,40,.10)',
            }}
          >
            {'\n        '}
            <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '12px', background: '#F4F1EA' }}>
              {(Array.isArray(v.soc?.tabs) ? v.soc?.tabs : []).map((__it: any, __i: number) => {
                const v2 = { ...v, t: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <button
                      onClick={v.t?.pick}
                      style={cssToObj(
                        `flex:1;display:flex;align-items:center;justify-content:center;gap:7px;height:36px;border-radius:9px;border:none;background:${s(v.t?.bg)};color:${s(v.t?.ink)};box-shadow:${s(v.t?.sh)};font-size:13px;font-weight:600;cursor:pointer;transition:background .35s cubic-bezier(.2,.8,.2,1),color .35s`,
                      )}
                    >
                      <span
                        style={cssToObj(
                          `display:block;width:14px;height:14px;background:currentColor;-webkit-mask:${s(v.t?.mask)};mask:${s(v.t?.mask)}`,
                        )}
                      ></span>
                      {t(v.t?.name)}
                    </button>
                  </React.Fragment>
                ))(v2);
              })}
            </div>
            {'\n        '}
            <div style={{ display: 'grid', gridTemplateColumns: '118px minmax(0,1fr)', gap: '16px', alignItems: 'center' }}>
              {'\n          '}
              <span
                style={{
                  position: 'relative',
                  width: '118px',
                  height: '118px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  boxShadow: 'inset 0 0 0 1px rgba(26,27,29,.1)',
                }}
              >
                <span
                  style={cssToObj(`display:block;width:100%;height:100%;background:#FFFFFF ${s(v.soc?.qrBg)} center / 100% 100% no-repeat`)}
                  role="img"
                  aria-label={v.soc?.alt}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: '0',
                    height: '3px',
                    background: '#F7C032',
                    boxShadow: '0 0 10px 2px rgba(247,192,50,.8)',
                    animation: 'soScan 2.6s cubic-bezier(.45,0,.55,1) infinite',
                  }}
                ></span>
              </span>
              {'\n          '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#5E6064' }}>
                  SCAN TO FOLLOW
                </span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '18px' }}>@samelectronics.uae</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '24px', letterSpacing: '-.02em' }}>
                    {t(v.soc?.count)}
                  </span>
                  <span style={{ fontSize: '13px', color: '#3D3E3F' }}>
                    {t(v.soc?.unit)}
                    {' · sample'}
                  </span>
                </span>
                <a
                  href={v.soc?.href}
                  target="_blank"
                  rel="noopener"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    background: '#26282B',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                  className={cx(undefined, 'scp-b327c115')}
                >
                  {'Follow on '}
                  {t(v.soc?.name)}
                </a>
              </span>
              {'\n        '}
            </div>
            {'\n        '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '64px minmax(0,1fr)',
                gap: '12px',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '14px',
                background: '#F8F6F1',
                boxShadow: 'inset 0 0 0 1px rgba(120,90,40,.08)',
              }}
            >
              {'\n          '}
              <span
                style={cssToObj(
                  `position:relative;width:64px;height:64px;border-radius:10px;overflow:hidden;display:grid;place-items:center;background:${s(v.soc?.postBg)}`,
                )}
              >
                <SEPart kind={v.soc?.postKind} size={58} />
              </span>
              {'\n          '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#5E6064' }}>
                  {'LATEST POST · '}
                  {t(v.soc?.ago)}
                </span>
                <span style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.3' }}>{t(v.soc?.post)}</span>
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
